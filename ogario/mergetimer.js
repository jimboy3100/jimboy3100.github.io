// Time Merger v3.2 — split detection from player-cell ids, re-armed on every split
window.ExternalScripts = true;

(function () {
    "use strict";

    var intervalId = null;
    /*
     * Polled every 100 ms. Previously the split edge was looked for in a
     * 10-frame historyMass window once per second, so most splits were missed,
     * new pieces (fresh ids) never got a timer and a re-split was ignored.
     */
    var TICK_MS = 100;
    var prevMass = {};   // id -> mass at the previous tick
    var prevCount = 0;

    function clearCellMergeState(cellData) {
        if (!cellData) {
            return;
        }

        cellData.mergeTime = null;
        cellData._mergeDeadline = null;
        cellData._mergeState = "idle";
        cellData._mergeTriggerActive = false;
    }

    function armCellMergeTimer(cellData, mass, now) {
        var mergeDurationSec =
            29 + (8 / 300) * mass;

        cellData._mergeDeadline =
            now + mergeDurationSec * 1000;

        cellData._mergeState = "counting";
    }

    function updateCellMergeTimer(cellData, now) {
        if (!cellData) {
            return;
        }

        if (cellData._mergeState === "counting" &&
            Number.isFinite(cellData._mergeDeadline)) {

            var remainingMs =
                cellData._mergeDeadline - now;

            if (remainingMs <= 0) {
                clearCellMergeState(cellData);
                return;
            }

            cellData.mergeTime =
                Math.ceil(remainingMs / 1000);
            return;
        }

        cellData.mergeTime = null;
    }

    function CellTimer() {
        if (!window.ExternalScripts ||
            !window.legendmod ||
            !window.legendmod5 ||
            window.legendmod5.optimizedMass ||
            !window.playerCellsId) {
            return;
        }

        var now = performance.now();
        var playerCells =
            window.legendmod.playerCells || [];

        var playerCellsId =
            window.playerCellsId;

        var count = playerCells.length;
        var grew = prevCount > 0 && count > prevCount;
        var nextMass = {};

        for (var i = 0;
            i < count;
            i++) {

            var cell = playerCells[i];

            if (!cell ||
                cell.id === undefined ||
                cell.id === null) {
                continue;
            }

            var mass = Number(cell.mass);
            if (!Number.isFinite(mass) || mass <= 0) {
                continue;
            }
            nextMass[cell.id] = mass;

            var cellData =
                playerCellsId[cell.id];

            if (!cellData) {
                cellData = playerCellsId[cell.id] = { historyMass: [mass] };
            }

            if (count <= 1) {
                // back to one cell: nothing left to merge
                clearCellMergeState(cellData);
                continue;
            }

            var lastMass = prevMass[cell.id];
            var isNewPiece = grew && lastMass === undefined;
            var lostMass = lastMass !== undefined && lastMass > mass * 1.4;

            // a split (or virus pop) arms both the new pieces and the piece
            // that lost mass, also while it is already counting
            if (isNewPiece || (grew && lostMass)) {
                armCellMergeTimer(cellData, mass, now);
            }

            updateCellMergeTimer(
                cellData,
                now
            );
        }

        prevMass = nextMass;
        prevCount = count;
    }

    function start() {
        if (intervalId !== null) {
            return;
        }

        intervalId =
            setInterval(CellTimer, TICK_MS);
    }

    function stop() {
        if (intervalId === null) {
            return;
        }

        clearInterval(intervalId);
        intervalId = null;
    }

    window.MergeTimerController = {
        start: start,
        stop: stop,
        clearCellState: clearCellMergeState,
        updateCell: updateCellMergeTimer
    };

    start();
})();
