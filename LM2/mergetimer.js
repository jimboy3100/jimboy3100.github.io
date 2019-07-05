//Time Merger v1.9
window.ExternalScripts = true;
var Intervalstatistics = setInterval(CellTimer, 1000);

function CellTimer() {
    if (!window.legendmod5.optimizedMass && window.ExternalScripts) {
        myCells = [];
        for (var i = 0; i < window.legendmod.playerCells.length; i++) {
            //legendmod.cells[i].historyMass->window.playerCellsId[legendmod.cells[i].id].historyMass

            if (window.playerCellsId && window.legendmod.playerCells[i] && window.legendmod.playerCells[i].id && window.playerCellsId[legendmod.playerCells[i].id] &&
                window.playerCellsId[legendmod.playerCells[i].id].historyMass &&
                window.playerCellsId[legendmod.playerCells[i].id].historyMass[window.legendmod2.fps] > window.playerCellsId[legendmod.playerCells[i].id].historyMass[0] * 1.4) {
					//console.log("Mass Merge Timer started with mass: " + window.playerCellsId[legendmod.playerCells[i].id].historyMass[window.legendmod2.fps]);
                var j = i;
                var x = 0;

                MergeCells(j, x);

            } else {
                if (window.playerCellsId && window.legendmod.playerCells[i] && window.legendmod.playerCells[i].id && window.playerCellsId[legendmod.playerCells[i].id] &&
                    window.playerCellsId[legendmod.playerCells[i].id].historyMass) {
                    window.playerCellsId[legendmod.playerCells[i].id].mergeTime = null;
                }
            }

        }
    }
}

function MergeCells(j, x) {
    x++;
    if (window.legendmod.playerCells.length > 1 && window.playerCellsId && window.legendmod.playerCells[j] && window.legendmod.playerCells[j].id && window.playerCellsId[legendmod.playerCells[j].id]) {
        //window.playerCellsId[legendmod.playerCells[j].id].mergeTime = 29 + (7 / 300) * window.playerCellsId[legendmod.playerCells[j].id].historyMass[0] - x;
		window.playerCellsId[legendmod.playerCells[j].id].mergeTime = 29 + (8 / 300) * window.playerCellsId[legendmod.playerCells[j].id].historyMass[0] - x;
        //
        if (window.playerCellsId[legendmod.playerCells[j].id].mergeTime > -20) {
            setTimeout(function() {
                MergeCells(j, x);
				//console.log("Mass Merge: " + j, x, window.playerCellsId[legendmod.playerCells[j].id].historyMass[0]);
            }, 1000);
        }

    } 
	else {
		//console.log("Mass Merge Timer ended: " + j, x);
                if (window.playerCellsId && window.legendmod.playerCells[j] && window.legendmod.playerCells[j].id && window.playerCellsId[legendmod.playerCells[j].id] &&
                    window.playerCellsId[legendmod.playerCells[j].id].historyMass) {		
						window.playerCellsId[legendmod.playerCells[j].id].mergeTime = null;
					}
    }
    return j, x;
}
