// Time Merger v3.1 — persistent edge-triggered deadline state machine
window.ExternalScripts = true;

(function () {
    "use strict";

    var intervalId = null;

    function clearCellMergeState(cellData) {
        if (!cellData) {
            return;
        }

        cellData.mergeTime = null;
        cellData._mergeDeadline = null;
        cellData._mergeState = "idle";
        cellData._mergeTriggerActive = false;
    }

    function updateCellMergeTimer(cellData, now) {
        if (!cellData ||
            !cellData.historyMass ||
            !cellData.historyMass.length) {
            return;
        }

        var fpsIndex =
            window.legendmod2 &&
            Number.isFinite(window.legendmod2.fps)
                ? window.legendmod2.fps
                : 0;

        if (fpsIndex < 0) {
            fpsIndex = 0;
        }

        if (fpsIndex >= cellData.historyMass.length) {
            fpsIndex = cellData.historyMass.length - 1;
        }

        var baseMass = Number(cellData.historyMass[0]);
        var currentMass = Number(cellData.historyMass[fpsIndex]);

        if (!Number.isFinite(baseMass) ||
            baseMass <= 0 ||
            !Number.isFinite(currentMass) ||
            currentMass < 0) {
            clearCellMergeState(cellData);
            return;
        }

        if (!cellData._mergeState) {
            cellData._mergeState = "idle";
        }

        var triggerActive =
            currentMass > baseMass * 1.4;

        /*
         * Create a deadline only on a rising edge:
         * false -> true.
         *
         * Once counting has started, temporary mass/history fluctuations must
         * not erase the deadline.
         */
        if (triggerActive &&
            !cellData._mergeTriggerActive &&
            cellData._mergeState === "idle") {

            var mergeDurationSec =
                29 + (8 / 300) * baseMass;

            cellData._mergeDeadline =
                now + mergeDurationSec * 1000;

            cellData._mergeState = "counting";
        }

        cellData._mergeTriggerActive =
            triggerActive;

        if (cellData._mergeState === "counting" &&
            Number.isFinite(cellData._mergeDeadline)) {

            var remainingMs =
                cellData._mergeDeadline - now;

            var remainingSec =
                Math.max(
                    0,
                    Math.ceil(remainingMs / 1000)
                );

            cellData.mergeTime =
                remainingSec;

            if (remainingMs <= 0) {
                cellData.mergeTime = null;
                cellData._mergeState = "completed";
            }

            return;
        }

        if (cellData._mergeState === "completed") {
            cellData.mergeTime = null;

            /*
             * Rearm only after the triggering condition returns to false.
             * A future false -> true transition may then represent a new
             * merge event.
             */
            if (!triggerActive) {
                cellData._mergeState = "idle";
                cellData._mergeDeadline = null;
            }

            return;
        }

        cellData.mergeTime = null;
    }

    function CellTimer() {
        if (!window.ExternalScripts ||
            !window.legendmod ||
            !window.legendmod5 ||
            window.legendmod5.optimizedMass) {
            return;
        }

        var now = performance.now();
        var playerCells =
            window.legendmod.playerCells || [];

        var playerCellsId =
            window.playerCellsId || {};

        for (var i = 0;
            i < playerCells.length;
            i++) {

            var cell = playerCells[i];

            if (!cell ||
                cell.id === undefined ||
                cell.id === null) {
                continue;
            }

            var cellData =
                playerCellsId[cell.id];

            if (!cellData) {
                continue;
            }

            updateCellMergeTimer(
                cellData,
                now
            );
        }
    }

    function start() {
        if (intervalId !== null) {
            return;
        }

        intervalId =
            setInterval(CellTimer, 1000);
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
