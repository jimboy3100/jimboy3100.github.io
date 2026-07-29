//Time Merger v2.0 — deadline-based, no recursive timers
window.ExternalScripts = true;
var Intervalstatistics = setInterval(CellTimer, 1000);

function CellTimer() {
    if (!window.legendmod5.optimizedMass && window.ExternalScripts) {
        var now = performance.now();
        myCells = [];
        for (var i = 0; i < window.legendmod.playerCells.length; i++) {
            var cell = window.legendmod.playerCells[i];
            if (!window.playerCellsId || !cell || !cell.id || !window.playerCellsId[cell.id]) continue;
            var cellData = window.playerCellsId[cell.id];
            if (!cellData.historyMass) continue;

            if (cellData.historyMass[window.legendmod2.fps] > cellData.historyMass[0] * 1.4) {
                // Cell just gained mass — compute merge deadline once
                if (!cellData._mergeDeadline) {
                    var mergeDurationSec = 29 + (8 / 300) * cellData.historyMass[0];
                    cellData._mergeDeadline = now + mergeDurationSec * 1000;
                }
                // Derive display value from deadline
                var remainingSec = Math.max(0, Math.ceil((cellData._mergeDeadline - now) / 1000));
                cellData.mergeTime = remainingSec > 0 ? remainingSec : null;
                if (remainingSec <= 0) {
                    cellData._mergeDeadline = null;
                }
            } else {
                cellData.mergeTime = null;
                cellData._mergeDeadline = null;
            }
        }
    }
}
