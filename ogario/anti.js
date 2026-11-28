/* Anti-cheat mass monitoring — v2.0
 * Replaced recursive setTimeout polling with a single managed interval.
 * Fixed: .tofixed -> .toFixed, optimizedmass -> optimizedMass case mismatch,
 *        permanent "ding" console spam, no timer cancellation on disconnect. */
var mycells;
var mycellshistoryMass;
var mybiggercell = {}; //your biggest cell
var mysmallercell = {}; //your smallest cell
mybiggercell.mass = 0;
mysmallercell.mass = 25000;
var _antiTimerInterval = null;
var _antiPauseResetTimer = null;
var _antiPauseText = ''; /* the text we put in #pause-hud, in the chosen language */

function CellTimerTrigger() {
    if (_antiTimerInterval) return; // already running
    if (window.legendmod5.mergeTimer) {
        _antiTimerInterval = setInterval(celltimer, 1000);
    }
}

function celltimerstop() {
    if (_antiTimerInterval) {
        clearInterval(_antiTimerInterval);
        _antiTimerInterval = null;
    }
}

function celltimer() {
    // Stop polling if setting changed
    if (!window.legendmod5.mergeTimer) {
        celltimerstop();
        return;
    }

    mycells = [];
    mycellshistoryMass = [];
    mybiggercell.mass = 0;
    mysmallercell.mass = 25000;

    if (window.playerCellsId != null && window.legendmod.playerCells.length != 0) {
        for (var i = 0; i < window.legendmod.playerCells.length; i++) {
            mycells.push(window.legendmod.playerCells[i]);
            if (window.playerCellsId[mycells[i].id]) {
                mycells[i].historyMass = window.playerCellsId[mycells[i].id].historyMass;
            }
            if (window.legendmod.playerCells[i].mass > mybiggercell.mass) {
                mybiggercell = window.legendmod.playerCells[i];
            }
            if (window.legendmod.playerCells[i].mass < mysmallercell.mass) {
                mysmallercell = window.legendmod.playerCells[i];
            }
        }
        for (var i = 0; i < mycells.length; i++) {
            if (!mycells[i].historyMass) continue;
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
        for (var i = 0; i < window.legendmod2.fps - 5; i++) {
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
                    var tempshow = (1 - mycellshistoryMassbottom / mycellshistoryMasstop).toFixed(5) * 100;
                    if (tempshow < 10 && tempshow > 0.1) {
                        // Cancel previous reset timer before setting new one
                        if (_antiPauseResetTimer) clearTimeout(_antiPauseResetTimer);
                        _antiPauseText = lmT('game2.antiBeat', [tempshow.toFixed(5)]);
                        $('#pause-hud').text(_antiPauseText);
                        _antiPauseResetTimer = setTimeout(function() {
                            /* only undo our own text: it overwrote the replay's "Loading..." and
                             * the translated pause text with a hard-coded English one */
                            if ($('#pause-hud').text() === _antiPauseText) {
                                $('#pause-hud').text(lmT('settings.pause'));
                            }
                            _antiPauseResetTimer = null;
                        }, 3000);
                    }
                }
            }
        }
    } catch (e) {}
}
