var Intervalstatistics = setInterval(CellTimer, 1000);	
function CellTimer() {
	myCells = [];
	for (var i = 0; i < window.legendmod.playerCells.length; i++) {		
			if (legendmod.playerCells[i].historyMass[window.legendmod2.fps]>legendmod.playerCells[i].historyMass[0]*1.3){
				var j=i;
				var x=0;
				//setTimeout(function() {					
					MergeCells(j,x);
				//}, 1000);
			}
		}
	}	

function MergeCells(j,x){
x++;
legendmod.playerCells[j].mergeTime=30 + (2.33/100)*legendmod.playerCells[j].mass-x;
	console.log(j,x, Math.round(legendmod.playerCells[j].mergeTime));
	if (legendmod.playerCells[j].mergeTime>0){
	setTimeout(function() {	
		MergeCells(j,x);
		}, 1000);
	}
	return j,x;
}



