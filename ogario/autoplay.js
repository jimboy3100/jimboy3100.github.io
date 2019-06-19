window.autoteammatenicks = [];
window.targetFood = null;
window.autoPlay = false;
window.doSplitFlag = true;
window.VirusFlag = true;
window.BiggerCellFlag = true;
window.SmallerCellFlag = true;
window.bestDist = 10000;


function calcTarget() {
    //legendmod.zoomValue=0.3;
    window.legendmod5.virMassShots = true;
    window.legendmod5.noNames = false;
    window.legendmod5.autoHideNames = false;
    window.legendmod5.autoHideMass = false;
    window.legendmod5.hideMyName = false;
    window.legendmod5.hideTeammatesNames = false;
    window.legendmod5.showMass = true;
    window.legendmod5.hideEnemiesMass = false;
    window.legendmod5.autoHideFood = false;
    window.legendmod5.autoHideFoodOnZoom = false;
    let target;
    target2 = {};
    let bestDist = 10000;
    let bestDist2 = 10000;
    let PlayerCell;
    let bestDistVirus;
    let doSplit = false;
    let doFeed = false;
    window.DistanceX = [];
    window.DistanceY = [];
    window.DistanceName = [];
    window.DangerDistanceX = [];
    window.DangerDistanceY = [];
    window.DangerDistanceName = [];
    window.FlagDangerCells = [];
    var biggercellmass = 0;
    var smallercellmass = 25000;
    window.SandwichCellCase = null;
    for (var i = 0; i < window.legendmod.playerCells.length; i++) {
        if (window.legendmod.playerCells[i].mass > biggercellmass) {
            biggercellmass = window.legendmod.playerCells[i].mass;
        }
        if (window.legendmod.playerCells[i].mass < smallercellmass) {
            smallercellmass = window.legendmod.playerCells[i].mass;
        }
    }

    Object.keys(window.legendmod.food).forEach(node => {
        if (window.legendmod.food[node].isFood) { //not needed					
            let cell = window.legendmod.food[node];
            let distance = calcDist(cell.x, cell.y);
            if (distance < bestDist) {
                //acting
                target = cell;
                bestDist = distance;
            }
        } //
    });

    Object.keys(window.legendmod.cells).forEach(node => {
        PlayerCell = window.legendmod.cells[node];
        let distancePlayerCell = calcDist(PlayerCell.x, PlayerCell.y);
        if (PlayerCell.nick != window.legendmod.playerNick) {
            //remember cells

            try {
                window.DistanceX[PlayerCell.id] = PlayerCell.x - window.legendmod.playerX;
                window.DistanceY[PlayerCell.id] = PlayerCell.y - window.legendmod.playerY;
                window.DistanceName[PlayerCell.id] = PlayerCell.nick;
            } catch (err) {
                //document.getElementById("demo").innerHTML = err.message;
            } finally {
                if (distancePlayerCell < window.legendmod.playerSize + (PlayerCell.size) && biggercellmass > 125 + 1.25 * ((7 - PlayerCell.mass) * 12) && PlayerCell.isVirus && window.legendmod.playerCells.length != 16) {
                    //if ( distancePlayerCell < window.legendmod.playerSize + PlayerCell.size && biggercellmass > 125 + 1.25 * (( 7 - PlayerCell.mass ) * 12 ) && PlayerCell.isVirus ) {		
                    //console.log(PlayerCell.mass, PlayerCell.size); //window.legendmod5.virMassShots=false-> 7, 100... 6, 105.9999999999999  .....    window.legendmod5.virMassShots=true->100,100... 112, 106 
                    //Object.keys(window.DistanceX).forEach(function(key) {
                    //console.log(key, window.DistanceX[key]);
                    //});
                    //if(){

                    //}
                    if (window.VirusFlag == true) {
                        window.VirusFlag = false;
                        setTimeout(function() {
                            window.VirusFlag = true;
                        }, 1000);
                        $('#pause-hud').html("<font color='" + PlayerCell.color + "'>Virus</font> is close. X: " + parseInt(window.DistanceX[PlayerCell.id]) + " , Y: " + parseInt(window.DistanceY[PlayerCell.id]));
                    }
                    if (window.DistanceX[PlayerCell.id] > 0) {
                        target2.x = legendmod.mapMinX;
                    } else {
                        target2.x = legendmod.mapMaxX;
                    }
                    if (window.DistanceY[PlayerCell.id] > 0) {
                        target2.y = legendmod.mapMinY;
                    } else {
                        target2.y = legendmod.mapMaxY;
                    }
                }
                //window.legendmod.cells[0].isPlayerCell is our cell
                //danger cells, avoiding
                else if ((distancePlayerCell < PlayerCell.size + window.legendmod.playerSize + 760 && PlayerCell.mass > biggercellmass * 2.5) || (distancePlayerCell < PlayerCell.size + window.legendmod.playerSize + 95 && PlayerCell.mass > biggercellmass * 1.25)) {
                    window.DangerDistanceX[PlayerCell.id] = window.DistanceX[PlayerCell.id];
                    window.DangerDistanceY[PlayerCell.id] = window.DistanceY[PlayerCell.id];
                    window.DangerDistanceName[PlayerCell.id] = window.DistanceName[PlayerCell.id];
                    window.FlagDangerCells.push(PlayerCell.id);
                    DefineSandwichCellCase();

                    if (distancePlayerCell - PlayerCell.size < bestDist2) {
                        bestDist2 = distancePlayerCell - PlayerCell.size;
                    }

                    //start of acting
                    if (distancePlayerCell - PlayerCell.size <= bestDist2) { //watch the closer cells

                        if (window.BiggerCellFlag == true) {
                            window.BiggerCellFlag = false;
                            setTimeout(function() {
                                window.BiggerCellFlag = true;
                            }, 1000);
                            $('#pause-hud').html("<font color='" + PlayerCell.color + "'>" + PlayerCell.nick + "</font> (mass: " + PlayerCell.mass + ") is close. X: " + parseInt(window.DistanceX[PlayerCell.id]) + " , Y: " + parseInt(window.DistanceY[PlayerCell.id]));
                        }
                        //Avoiding corners
                        if (PlayerCell.x < legendmod.mapMinX + 760 || PlayerCell.y < legendmod.mapMinY + 760 || PlayerCell.x > legendmod.mapMaxX - 760 || PlayerCell.y > legendmod.mapMaxY - 760) {
                            if (PlayerCell.x < legendmod.mapMinX + 760) {
                                target2.x = legendmod.mapMaxY;
                                $('#pause-hud').html("Avoiding corners X- " + PlayerCell.x);
                            }
                            if (PlayerCell.y < legendmod.mapMinY + 760) {
                                target2.x = legendmod.mapMaxX;
                                $('#pause-hud').html("Avoiding corners Y- " + PlayerCell.y);
                            }
                            if (PlayerCell.x > legendmod.mapMaxX - 760) {
                                target2.x = legendmod.mapMinY;
                                $('#pause-hud').html("Avoiding corners X+ " + PlayerCell.x);
                            }
                            if (PlayerCell.y > legendmod.mapMaxY - 760) {
                                target2.x = legendmod.mapMinX;
                                $('#pause-hud').html("Avoiding corners Y+ " + PlayerCell.x);
                            }
                        } 
						else if (window.SandwichCellCase != null) {
                            if (window.SandwichCellCase == 0) { //down right and up left
								handleSandwichCellCase(target2);
                                window.SandwichCellCase = null;
                            } else if (window.SandwichCellCase == 1) {
								handleSandwichCellCase(target2)
                                window.SandwichCellCase = null;
                            } else if (window.SandwichCellCase == 2) {
								handleSandwichCellCase(target2);
                                window.SandwichCellCase = null;
                            } else if (window.SandwichCellCase == 3) {
								handleSandwichCellCase(target2);
                                window.SandwichCellCase = null;
                            }
                        } 
                        //General acting
                        else {
                            GeneralAvoiding(target2, PlayerCell);
                        }


                    }
                } else if (distancePlayerCell < PlayerCell.size + window.legendmod.playerSize + 320 && PlayerCell.mass * 1.4 < biggercellmass && biggercellmass > 130) {
                    if (window.teammatenicks.includes(PlayerCell.name) && legendmod3.lastSentClanTag != "") {
                        if (!window.autoteammatenicks.includes(PlayerCell.name)) {
                            window.autoteammatenicks[PlayerCell.name] = true;
                            target2.x = PlayerCell.x;
                            target2.y = PlayerCell.y;
                            console.log("Target mass: " + PlayerCell.mass);
                            if (PlayerCell.mass != 0 && PlayerCell.mass != "0" && PlayerCell.name != "" && PlayerCell.name != null) { //2nd time to check
                                doFeed = true;
                            }
                        }
                        $('#pause-hud').html("<font color='" + PlayerCell.color + "'>" + PlayerCell.nick + "</font> (mass: " + PlayerCell.mass + ") is teammate. X: " + parseInt(window.DistanceX[PlayerCell.id]) + " , Y: " + parseInt(window.DistanceY[PlayerCell.id]));
                    } else {
                        if (PlayerCell.mass != 0 && PlayerCell.nick != "" && PlayerCell.mass * 3 < biggercellmass && window.legendmod.playerCells.length == 1 && !(PlayerCell.mass * 10 < biggercellmass && biggercellmass > 260)) {
                            //760 

                            if (window.SmallerCellFlag == true) {
                                window.SmallerCellFlag = false;
                                setTimeout(function() {
                                    window.SmallerCellFlag = true;
                                }, 1000);
                                $('#pause-hud').html("<font color='" + PlayerCell.color + "'>" + PlayerCell.nick + "</font> (mass: " + PlayerCell.mass + ") is close and will be eaten by split. X: " + parseInt(window.DistanceX[PlayerCell.id]) + " , Y: " + parseInt(window.DistanceY[PlayerCell.id]));
                            }
                            target2.x = PlayerCell.x;
                            target2.y = PlayerCell.y;
                            console.log("Target mass: " + PlayerCell.mass);
                            if (PlayerCell.mass != 0 && PlayerCell.mass != "0") { //2nd time to check
                                doSplit = true;
                            }
                        } else if (PlayerCell.mass * 1.4 < biggercellmass && !(PlayerCell.mass * 10 < biggercellmass)) {

                            if (window.SmallerCellFlag == true) {
                                window.SmallerCellFlag = false;
                                setTimeout(function() {
                                    window.SmallerCellFlag = true;
                                }, 1000);
                                $('#pause-hud').html("<font color='" + PlayerCell.color + "'>" + PlayerCell.nick + "</font> (mass: " + PlayerCell.mass + ") is close, AI follows... X: " + parseInt(window.DistanceX[PlayerCell.id]) + " , Y: " + parseInt(window.DistanceY[PlayerCell.id]));
                            }
                            target2.x = PlayerCell.x;
                            target2.y = PlayerCell.y;
                            console.log("Target mass: " + PlayerCell.mass);
                        }
                    }
                }
            }
        }
    });
    if (target != undefined) { //not needed
        window.legendmod.sendPosition(target, target2);
    }
    if (doSplit == true && window.doSplitFlag == true) {
        doSplit = false;
        window.doSplitFlag = false;
        setTimeout(function() {
            window.doSplitFlag = true;
        }, 2000);
        window.legendmod.sendAction(17);
    } else if (doFeed) {
        window.legendmod.sendAction(21);
    }
}


function GeneralAvoiding(target2, PlayerCell) {
    if (window.DistanceX[PlayerCell.id] > 0) {
        target2.x = legendmod.mapMinX;
    } else {
        target2.x = legendmod.mapMaxX;
    }
    if (window.DistanceY[PlayerCell.id] > 0) {
        target2.y = legendmod.mapMinY;
    } else {
        target2.y = legendmod.mapMaxY;
    }
    return target2;
}

function DefineSandwichCellCase() {
    if (window.FlagDangerCells.length > 1) {
        for (var i = 1; i < window.FlagDangerCells.length; i++) {
            //x<0 left y<0 up
            if (window.DangerDistanceX[window.FlagDangerCells[i - 1]] > 0) {
                if (window.DangerDistanceY[window.FlagDangerCells[i - 1]] > 0) {
                    if (window.DangerDistanceX[window.FlagDangerCells[i]] < 0 && window.DangerDistanceY[window.FlagDangerCells[i]] < 0) {
                        AnnounceDangerCellOpposite(window.DangerDistanceName[window.FlagDangerCells[i - 1]], window.DangerDistanceName[window.FlagDangerCells[i]]);
                        window.SandwichCellCase = 0;
                    }
                } else if (window.DangerDistanceY[window.FlagDangerCells[i - 1]] < 0) {
                    if (window.DangerDistanceX[window.FlagDangerCells[i]] < 0 && window.DangerDistanceY[window.FlagDangerCells[i]] > 0) {
                        AnnounceDangerCellOpposite(window.DangerDistanceName[window.FlagDangerCells[i - 1]], window.DangerDistanceName[window.FlagDangerCells[i]]);
                        window.SandwichCellCase = 1;
                    }
                }
            } else if (window.DangerDistanceX[window.FlagDangerCells[i - 1]] < 0) {
                if (window.DangerDistanceY[window.FlagDangerCells[i - 1]] > 0) {
                    if (window.DangerDistanceX[window.FlagDangerCells[i]] > 0 && window.DangerDistanceY[window.FlagDangerCells[i]] < 0) {
                        AnnounceDangerCellOpposite(window.DangerDistanceName[window.FlagDangerCells[i - 1]], window.DangerDistanceName[window.FlagDangerCells[i]]);
                        window.SandwichCellCase = 2;
                    }
                } else if (window.DangerDistanceY[window.FlagDangerCells[i - 1]] < 0) {
                    if (window.DangerDistanceX[window.FlagDangerCells[i]] > 0 && window.DangerDistanceY[window.FlagDangerCells[i]] > 0) {
                        AnnounceDangerCellOpposite(window.DangerDistanceName[window.FlagDangerCells[i - 1]], window.DangerDistanceName[window.FlagDangerCells[i]]);
                        window.SandwichCellCase = 3;
                    }
                }
            }
        }
    }
}
function handleSandwichCellCase(target2){
var closestX=1000;
var closestY=1000;
var negativeX=false;
var negativeY=false;
Object.keys(window.FlagDangerCells).forEach(function(key) {
                    console.log(key, window.FlagDangerCells[key], window.DangerDistanceX[window.FlagDangerCells[key]], window.DangerDistanceY[window.FlagDangerCells[key]]);
					//console.log(window.DangerDistanceX[window.FlagDangerCells[key]], window.DangerDistanceY[window.FlagDangerCells[key]]);
						if ( Math.abs(window.DangerDistanceX[window.FlagDangerCells[key]]) < closestX){
							closestX=Math.abs(window.DangerDistanceX[window.FlagDangerCells[key]]);	
							if (window.DangerDistanceX[window.FlagDangerCells[key]]<0){
								negativeX=true;
							}
							else{
								negativeX=false;
							}
						}		
						if ( Math.abs(window.DangerDistanceY[window.FlagDangerCells[key]]) < closestY){
							closestY=Math.abs(window.DangerDistanceY[window.FlagDangerCells[key]]);	
							if (window.DangerDistanceY[window.FlagDangerCells[key]]<0){
								negativeY=true;
							}	
							else{
								negativeY=false;
							}							
						}				
                    });
if (negativeX){
	closestX = -closestX;
}	
if (negativeY){
	closestY = -closestY;
}	
console.log(closestX, closestY);	
//here is the difference with the GeneralAvoiding
if (Math.abs(-closestX)<Math.abs(-closestY)){
	target2.x = -closestX;
	target2.y = closestY;
}
else{
	target2.x = closestX;
	target2.y = -closestY;
}
//target2.x = -closestX; normaly
//target2.y = -closestY; normaly
return target2;
}
function calcDist(x, y) {
    return Math.round(Math.sqrt(Math.pow(window.legendmod.playerX - x, 2) + Math.pow(window.legendmod.playerY - y, 2)));
}

function AnnounceDangerCellOpposite(x, y) {
    $('#pause-hud').html("<font color='red'>Danger: <font> " + x + " and " + y + " are diametral");
}
