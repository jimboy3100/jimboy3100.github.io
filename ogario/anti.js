var myCells;
var myCellsHistoryMass;
var myBiggerCell = {}; //your biggest cell
var mySmallerCell = {}; //your smallest cell
    myBiggerCell.mass = 0;
    mySmallerCell.mass = 25000;
var CellTimerTriggerOnce=true;

function CellTimerTrigger() {
	if (CellTimerTriggerOnce){		
		if (!window.legendmod5.optimizedMass && window.ExternalScripts && !this.mergeCanvas) {
			CellTimer();
		}, 1000);
		return CellTimerTriggerOnce=false;
	}
}	

function CellTimer() {
	//console.log("ding");
	myCells = [];
	myCellsHistoryMass=[];
    for (var i = 0; i < window.legendmod.playerCells.length; i++) {
		myCells.push(window.legendmod.playerCells[i]);
		myCells[i].historyMass=window.playerCellsId[myCells[i].id].historyMass;
        if (window.legendmod.playerCells[i].mass > myBiggerCell.mass) {
            myBiggerCell = window.legendmod.playerCells[i];
        }
        if (window.legendmod.playerCells[i].mass < mySmallerCell.mass) {
            mySmallerCell = window.legendmod.playerCells[i];
        }
    }
	for (var i = 0; i < myCells.length; i++) {	
		for (var j = 0; j < myCells[i].historyMass.length; j++) {
			if (myCellsHistoryMass[j]==undefined){
				myCellsHistoryMass[j]=0;
			}
			myCellsHistoryMass[j] += myCells[i].historyMass[j];
	}
	}

	
try{
	var myCellsHistoryMassTop=0;
	var myCellsHistoryMassBottom=25000;
	var myCellsHistoryMassTopI=0;
	var myCellsHistoryMassBottomI=0;
	for (var i = 0; i < window.legendmod2.fps-5; i++) {	//window.legendmod2.fps-5 is because for making bug in case of increased fps in case of an eject
		if (myCellsHistoryMass[i]<myCellsHistoryMassBottom){
			myCellsHistoryMassBottom=myCellsHistoryMass[i];
			myCellsHistoryMassTopI=i;
		}
		if (myCellsHistoryMass[i]>myCellsHistoryMassTop){
			myCellsHistoryMassTop=myCellsHistoryMass[i];
			myCellsHistoryMassBottomI=i;
		}

	}
if 	(myCellsHistoryMassTop!=0 && myCellsHistoryMassTop!=myCellsHistoryMassBottom){
		
	if (myCellsHistoryMassBottom < myCellsHistoryMassTop && myCellsHistoryMassTopI < myCellsHistoryMassBottomI) { 
		if (window.lastejected){
			window.lastejected=false;
		}
		else if (1-myCellsHistoryMassBottom/myCellsHistoryMassTop<1000){
			var tempshow=(1-myCellsHistoryMassBottom/myCellsHistoryMassTop).toFixed(5)*100;
			if (tempshow <10 && tempshow>0.1){
				$('#pause-hud').text("PAUSE! ANTI beat: " + (tempshow).toFixed(5)+"%");
				setTimeout(function() {
				$('#pause-hud').text("PAUSE!");
				}, 3000);
	console.log((tempshow).toFixed(5)+"%");
			}
		}
	}
}
}
catch(e) { 
}
setTimeout(function() {
	if (!window.legendmod5.optimizedMass && window.ExternalScripts && !this.mergeCanvas) {
	CellTimer();
	}, 1000);
}
}
/*
function StopIntervalstatistics() {
  clearInterval(Intervalstatistics);
}
*/
