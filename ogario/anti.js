var mycells;
var mycellshistoryMass;
var mybiggercell = {}; //your biggest cell
var mysmallercell = {}; //your smallest cell
mybiggercell.mass = 0;
mysmallercell.mass = 25000;
var celltimertriggeronce = true;

function celltimertrigger() {
    if (celltimertriggeronce) {
        if (!window.legendmod5.optimizedmass) {
            celltimer();
        }
        return celltimertriggeronce = false;
    }
}

function celltimer() {
	
    console.log("ding");
    setTimeout(function() {
        if (!window.legendmod5.optimizedmass) {
            celltimer();
        }
    }, 1000);	
    mycells = [];
    mycellshistoryMass = [];
    if (window.playerCellsId != null && window.legendmod.playerCells.length != 0) {
        for (var i = 0; i < window.legendmod.playerCells.length; i++) {
            mycells.push(window.legendmod.playerCells[i]);
            mycells[i].historyMass = window.playerCellsId[mycells[i].id].historyMass;
            if (window.legendmod.playerCells[i].mass > mybiggercell.mass) {
                mybiggercell = window.legendmod.playerCells[i];
            }
            if (window.legendmod.playerCells[i].mass < mysmallercell.mass) {
                mysmallercell = window.legendmod.playerCells[i];
            }
        }
        for (var i = 0; i < mycells.length; i++) {
            for (var j = 0; j < mycells[i].historyMass.length; j++) {
                if (mycellshistoryMass[j] == undefined) {
                    mycellshistoryMass[j] = 0;
                }
                mycellshistoryMass[j] += mycells[i].historyMass[j];
            }
        }
    }

    try {
        var mycellshistoryMasstop = 0;
        var mycellshistoryMassbottom = 25000;
        var mycellshistoryMasstopi = 0;
        var mycellshistoryMassbottomi = 0;
        for (var i = 0; i < window.legendmod2.fps - 5; i++) { //window.legendmod2.fps-5 is because for making bug in case of increased fps in case of an eject
            if (mycellshistoryMass[i] < mycellshistoryMassbottom) {
                mycellshistoryMassbottom = mycellshistoryMass[i];
                mycellshistoryMasstopi = i;
            }
            if (mycellshistoryMass[i] > mycellshistoryMasstop) {
                mycellshistoryMasstop = mycellshistoryMass[i];
                mycellshistoryMassbottomi = i;
            }

        }
        if (mycellshistoryMasstop != 0 && mycellshistoryMasstop != mycellshistoryMassbottom) {

            if (mycellshistoryMassbottom < mycellshistoryMasstop && mycellshistoryMasstopi < mycellshistoryMassbottomi) {
                if (window.lastejected) {
                    window.lastejected = false;
                } else if (1 - mycellshistoryMassbottom / mycellshistoryMasstop < 1000) {
					console.log((1 - mycellshistoryMassbottom / mycellshistoryMasstop)*100);
                    var tempshow = (1 - mycellshistoryMassbottom / mycellshistoryMasstop).tofixed(5) * 100;
                    if (tempshow < 10 && tempshow > 0.1) {
                        $('#pause-hud').text("PAUSE! Anti beat:: " + (tempshow).tofixed(5) + "%");
                        setTimeout(function() {
                            $('#pause-hud').text("PAUSE!");
                        }, 3000);
                        console.log((tempshow).tofixed(5) + "%");
                    }
                }
            }
        }
    } catch (e) {}


}
/*
function stopintervalstatistics() {
  clearinterval(intervalstatistics);
}
*/
