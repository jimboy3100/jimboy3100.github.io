var Intervalstatistics = setInterval(CellTimer, 1000);	
function CellTimer() {
	if (!window.legendmod5.optimizedMass){
	myCells = [];
	for (var i = 0; i < window.legendmod.playerCells.length; i++) {
//legendmod.cells[i].historyMass->window.playerCellsId[legendmod.cells[i].id].historyMass
		
			if (window.playerCellsId && window.legendmod.playerCells[i] && window.legendmod.playerCells[i].id && window.playerCellsId[legendmod.playerCells[i].id] && window.playerCellsId[legendmod.playerCells[i].id].historyMass && 
			window.playerCellsId[legendmod.playerCells[i].id].historyMass[window.legendmod2.fps]>window.playerCellsId[legendmod.playerCells[i].id].historyMass[0]*1.4){
				var j=i;
				var x=0;
					
					MergeCells(j,x);

			}
			else{
				if(window.playerCellsId && window.legendmod.playerCells[i] && window.legendmod.playerCells[i].id && window.playerCellsId[legendmod.playerCells[i].id]){
				//window.playerCellsId[legendmod.playerCells[i].id].mergeTime=null;
			}
			}
			
		}
}
	}	

function MergeCells(j,x){
x++;
if (window.playerCellsId && window.legendmod.playerCells[j] && window.legendmod.playerCells[j].id && window.playerCellsId[legendmod.playerCells[j].id]){
window.playerCellsId[legendmod.playerCells[j].id].mergeTime = 29 + (7/300)*window.playerCellsId[legendmod.playerCells[j].id].historyMass[0] - x;
	console.log(j,x, Math.round(window.playerCellsId[legendmod.playerCells[j].id].mergeTime));
	if (window.playerCellsId[legendmod.playerCells[j].id].mergeTime>0){
	setTimeout(function() {	
		MergeCells(j,x);
		}, 1000);
	}
	else{
		window.playerCellsId[legendmod.playerCells[j].id].mergeTime=null;
	}
}	
	return j,x;
}


