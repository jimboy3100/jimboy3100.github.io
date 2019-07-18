var mycells;
var mycellshistorymass;
var mybiggercell = {}; //your biggest cell
var mysmallercell = {}; //your smallest cell
mybiggercell.mass = 0;
mysmallercell.mass = 25000;
var celltimertriggeronce = true;

function celltimertrigger() {
    if (celltimertriggeronce) {
        if (!window.legendmod5.optimizedmass && window.externalscripts && !this.mergecanvas) {
            celltimer();
        }
        return celltimertriggeronce = false;
    }
}

function celltimer() {
    //console.log("ding");
    mycells = [];
    mycellshistorymass = [];
    if (window.playerCellsId != null && window.legendmod.playerCells.length != 0) {
        for (var i = 0; i < window.legendmod.playerCells.length; i++) {
            mycells.push(window.legendmod.playerCells[i]);
            mycells[i].historymass = window.playerCellsId[mycells[i].id].historymass;
            if (window.legendmod.playerCells[i].mass > mybiggercell.mass) {
                mybiggercell = window.legendmod.playerCells[i];
            }
            if (window.legendmod.playerCells[i].mass < mysmallercell.mass) {
                mysmallercell = window.legendmod.playerCells[i];
            }
        }
        for (var i = 0; i < mycells.length; i++) {
            for (var j = 0; j < mycells[i].historymass.length; j++) {
                if (mycellshistorymass[j] == undefined) {
                    mycellshistorymass[j] = 0;
                }
                mycellshistorymass[j] += mycells[i].historymass[j];
            }
        }
    }

    try {
        var mycellshistorymasstop = 0;
        var mycellshistorymassbottom = 25000;
        var mycellshistorymasstopi = 0;
        var mycellshistorymassbottomi = 0;
        for (var i = 0; i < window.legendmod2.fps - 5; i++) { //window.legendmod2.fps-5 is because for making bug in case of increased fps in case of an eject
            if (mycellshistorymass[i] < mycellshistorymassbottom) {
                mycellshistorymassbottom = mycellshistorymass[i];
                mycellshistorymasstopi = i;
            }
            if (mycellshistorymass[i] > mycellshistorymasstop) {
                mycellshistorymasstop = mycellshistorymass[i];
                mycellshistorymassbottomi = i;
            }

        }
        if (mycellshistorymasstop != 0 && mycellshistorymasstop != mycellshistorymassbottom) {

            if (mycellshistorymassbottom < mycellshistorymasstop && mycellshistorymasstopi < mycellshistorymassbottomi) {
                if (window.lastejected) {
                    window.lastejected = false;
                } else if (1 - mycellshistorymassbottom / mycellshistorymasstop < 1000) {
                    var tempshow = (1 - mycellshistorymassbottom / mycellshistorymasstop).tofixed(5) * 100;
                    if (tempshow < 10 && tempshow > 0.1) {
                        $('#pause-hud').text("pause! anti beat: " + (tempshow).tofixed(5) + "%");
                        settimeout(function() {
                            $('#pause-hud').text("pause!");
                        }, 3000);
                        console.log((tempshow).tofixed(5) + "%");
                    }
                }
            }
        }
    } catch (e) {}
    settimeout(function() {
        if (!window.legendmod5.optimizedmass && window.externalscripts && !this.mergecanvas) {
            celltimer();
        }
    }, 1000);

}
/*
function stopintervalstatistics() {
  clearinterval(intervalstatistics);
}
*/
