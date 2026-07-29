//Time Merger v3.0 — edge-triggered deadlines, persistent countdowns
window.ExternalScripts = true;
var _mergeTimerInterval = null;

function startMergeTimer() {
    if (_mergeTimerInterval) return; // already running
    _mergeTimerInterval = setInterval(CellTimer, 1000);
}

function stopMergeTimer() {
    if (_mergeTimerInterval) {
        clearInterval(_mergeTimerInterval);
        _mergeTimerInterval = null;
    }
}

// Start on load (matches original behavior)
startMergeTimer();

function CellTimer() {
    if (!window.legendmod5 || window.legendmod5.optimizedMass || !window.ExternalScripts) {
        return;
    }
    if (!window.playerCellsId || !window.legendmod || !window.legendmod.playerCells) {
        return;
    }

    var now = performance.now();
    var playerCells = window.legendmod.playerCells;

    // Track which cell IDs are currently alive for cleanup
    var aliveCellIds = {};

    for (var i = 0; i < playerCells.length; i++) {
        var cell = playerCells[i];
        if (!cell || !cell.id) continue;

        var cellData = window.playerCellsId[cell.id];
        if (!cellData) continue;

        aliveCellIds[cell.id] = true;

        if (!cellData.historyMass) continue;

        var currentMass = cellData.historyMass[0];
        var oldMass = cellData.historyMass[window.legendmod2.fps];

        // Edge detection: set deadline only when mass gain is first detected
        // and no deadline is already active
        if (oldMass > currentMass * 1.4 && !cellData._mergeDeadline) {
            var mergeDurationSec = 29 + (8 / 300) * currentMass;
            cellData._mergeDeadline = now + mergeDurationSec * 1000;
        }

        // If a deadline is active, count it down regardless of current mass ratio.
        // The deadline persists through normal mass fluctuations (eating, decay).
        if (cellData._mergeDeadline) {
            var remainingSec = Math.max(0, Math.ceil((cellData._mergeDeadline - now) / 1000));
            if (remainingSec > 0) {
                cellData.mergeTime = remainingSec;
            } else {
                // Deadline expired — merge complete
                cellData.mergeTime = null;
                cellData._mergeDeadline = null;
            }
        } else {
            cellData.mergeTime = null;
        }
    }

    // Clean up deadlines for cells that no longer exist (eaten, popped, died)
    if (window.playerCellsId) {
        for (var id in window.playerCellsId) {
            if (!aliveCellIds[id] && window.playerCellsId[id]) {
                window.playerCellsId[id].mergeTime = null;
                window.playerCellsId[id]._mergeDeadline = null;
            }
        }
    }
}
