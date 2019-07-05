//v7.3
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
    let doSplittoAvoidCorner = false;
    let doFeed = false;
    window.DistanceX = [];
    window.DistanceY = [];
    window.DistanceName = []; //names of all cells
    window.DistanceId = [];
    window.DangerDistanceX = [];
    window.DangerDistanceY = [];
    window.DangerDistanceName = []; //names of all cells that can harm
    window.VirusDistanceX = [];
    window.VirusDistanceY = [];
    let VirusCellDontDoTheRest = false;

    window.FlagDangerCells = [];
    window.FlagVirusCells = [];

    window.BadCellsDistanceX = [];
    window.BadCellsDistanceY = [];
    window.BadCellsDistanceName = []; //top 5 leaderboard names
    let biggercell = {}; //your biggest cell
    let smallercell = {}; //your smallest cell
    biggercell.mass = 0;
    smallercell.mass = 25000;
    window.SandwichCellCase = null;

    for (var i = 0; i < window.legendmod.playerCells.length; i++) {
        if (window.legendmod.playerCells[i].mass > biggercell.mass) {
            biggercell = window.legendmod.playerCells[i];
        }
        if (window.legendmod.playerCells[i].mass < smallercell.mass) {
            smallercell = window.legendmod.playerCells[i];
        }
    }

    Object.keys(window.legendmod.food).forEach(node => { //function to define and eat food
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
    var distcounterflag = 0;
    Object.keys(window.legendmod.cells).forEach(node => { //function to define and act to cells
        distcounterflag++
        PlayerCell = window.legendmod.cells[node];
        let distancePlayerCell = calcDist(PlayerCell.x, PlayerCell.y);
        if (PlayerCell.nick != window.legendmod.playerNick) {
            //remember cells

            try {
                window.DistanceX[PlayerCell.id] = PlayerCell.x - window.legendmod.playerX;
                window.DistanceY[PlayerCell.id] = PlayerCell.y - window.legendmod.playerY;
                window.DistanceName[PlayerCell.id] = PlayerCell.nick;
                window.DistanceId[distcounterflag] = PlayerCell.id; //not used
                if (PlayerCell.isVirus) {
                    window.FlagVirusCells.push(PlayerCell.id);
                }
                for (var i = 0; i < FlagVirusCells.length; i++) {
                    window.VirusDistanceX[FlagVirusCells[i]] = window.DistanceX[FlagVirusCells[i]];
                    window.VirusDistanceY[FlagVirusCells[i]] = window.DistanceY[FlagVirusCells[i]];
                }
            } catch (err) {
                //document.getElementById("demo").innerHTML = err.message;
            } finally {
                if (distancePlayerCell < window.legendmod.playerSize + (PlayerCell.size) && biggercell.mass > 125 + 1.25 * ((7 - PlayerCell.mass) * 12) && PlayerCell.isVirus && window.legendmod.playerCells.length != 16) { //avoid viruses

                    //console.log(PlayerCell.mass, PlayerCell.size); //window.legendmod5.virMassShots=false-> 7, 100... 6, 105.9999999999999  .....    window.legendmod5.virMassShots=true->100,100... 112, 106 


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
                } else if (distancePlayerCell < PlayerCell.size + window.legendmod.playerSize + 760 && window.teammatenicks.includes(PlayerCell.nick) && legendmod3.lastSentClanTag != "") { //feed teammates on tag
                    //if (!window.autoteammatenicks.includes(PlayerCell.name)) {
                    console.log("feed!");
                    window.autoteammatenicks[PlayerCell.name] = true;
                    target2.x = PlayerCell.x;
                    target2.y = PlayerCell.y;
                    //console.log("Target mass: " + PlayerCell.mass);
                    if (PlayerCell.mass != 0 && PlayerCell.mass != "0" && PlayerCell.name != "" && PlayerCell.nick != null) { //2nd time to check
                        doFeed = true;
                    }
                    //}
                    $('#pause-hud').html("<font color='" + PlayerCell.color + "'>" + PlayerCell.nick + "</font> (mass: " + PlayerCell.mass + ") is teammate. X: " + parseInt(window.DistanceX[PlayerCell.id]) + " , Y: " + parseInt(window.DistanceY[PlayerCell.id]));
                }
                //window.legendmod.cells[0].isPlayerCell is our cell		
                else if ((distancePlayerCell < PlayerCell.size + window.legendmod.playerSize + 760 && PlayerCell.mass > biggercell.mass * 2.5) || (distancePlayerCell < PlayerCell.size + window.legendmod.playerSize + 95 && PlayerCell.mass > biggercell.mass * 1.25)) { //avoid danger cells
                    window.DangerDistanceX[PlayerCell.id] = window.DistanceX[PlayerCell.id];
                    window.DangerDistanceY[PlayerCell.id] = window.DistanceY[PlayerCell.id];
                    window.DangerDistanceName[PlayerCell.id] = window.DistanceName[PlayerCell.id];
                    window.FlagDangerCells.push(PlayerCell.id);
                    DefineSandwichCellCase(); //announce Sandwich Case when players are on opposite axes

                    if (distancePlayerCell - PlayerCell.size < bestDist2) {
                        bestDist2 = distancePlayerCell - PlayerCell.size;
                    }

                    //define if top 5 who are not teammates and on tag are behind the virus, announce, act
                    if ((window.DangerDistanceName.includes(legendmod.leaderboard[0].nick) || window.DangerDistanceName.includes(legendmod.leaderboard[1].nick) || window.DangerDistanceName.includes(legendmod.leaderboard[2].nick) || window.DangerDistanceName.includes(legendmod.leaderboard[3].nick) || window.DangerDistanceName.includes(legendmod.leaderboard[4].nick)) &&
                        window.legendmod.playerSize > 140) {
                        for (var i = 0; i < 5; i++) {
                            //for (var j = 0; j < 5; j++) {
                            for (var j = 0; j < legendmod.leaderboard.length; j++) {
                                if (window.DangerDistanceName[window.FlagDangerCells[i]] == legendmod.leaderboard[j].nick) {
                                    window.BadCellsDistanceX[window.FlagDangerCells[i]] = window.DangerDistanceX[window.FlagDangerCells[i]];
                                    window.BadCellsDistanceY[window.FlagDangerCells[i]] = window.DangerDistanceY[window.FlagDangerCells[i]];
                                    window.BadCellsDistanceName[window.FlagDangerCells[i]] = window.DangerDistanceName[window.FlagDangerCells[i]];
                                    //console.log(window.DangerDistanceName[window.FlagDangerCells[i]], BadCellsDistanceX[window.FlagDangerCells[i]], BadCellsDistanceY[window.FlagDangerCells[i]]);
                                }

                            }
                        }
                        DefineVirusshootCaseAndShoot(target2, doFeed);

                    }
                    if (distancePlayerCell - PlayerCell.size <= bestDist2 && !VirusCellDontDoTheRest) { //watch the closer cells

                        if (window.BiggerCellFlag == true) {
                            window.BiggerCellFlag = false;
                            setTimeout(function() {
                                window.BiggerCellFlag = true;
                            }, 1000);
                            $('#pause-hud').html("<font color='" + PlayerCell.color + "'>" + PlayerCell.nick + "</font> (mass: " + PlayerCell.mass + ") is close. X: " + parseInt(window.DistanceX[PlayerCell.id]) + " , Y: " + parseInt(window.DistanceY[PlayerCell.id]));
                        }

                        if (window.SandwichCellCase != null) {
                            if (window.SandwichCellCase == 0) {
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
                            avoidCorners(biggercell, target2, PlayerCell, doSplittoAvoidCorner); //avoid being cornered on wall
                        }
                        //General acting
                        else {
                            GeneralAvoiding(target2, PlayerCell); //avoid dangerous cells by going back
                            avoidCorners(biggercell, target2, PlayerCell, doSplittoAvoidCorner); //avoid being cornered on wall
                        }


                    }
                } else if (distancePlayerCell < PlayerCell.size + window.legendmod.playerSize + 320 && PlayerCell.mass * 1.4 < biggercell.mass && biggercell.mass > 130 && !VirusCellDontDoTheRest) { //acting when you have the upper hand


                    if (PlayerCell.mass != 0 && PlayerCell.nick != "" && PlayerCell.mass * 3 < biggercell.mass && window.legendmod.playerCells.length == 1 && !(PlayerCell.mass * 10 < biggercell.mass && biggercell.mass > 260)) { //split only when you have 1 cell 
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
                        //console.log("Target mass: " + PlayerCell.mass);
                        if (PlayerCell.mass != 0 && PlayerCell.mass != "0") { //2nd time to check
                            doSplit = true;
                        }
                    } else if (PlayerCell.mass * 1.4 < biggercell.mass && !(PlayerCell.mass * 10 < biggercell.mass)) { //follow cell

                        if (window.SmallerCellFlag == true) {
                            window.SmallerCellFlag = false;
                            setTimeout(function() {
                                window.SmallerCellFlag = true;
                            }, 1000);
                            $('#pause-hud').html("<font color='" + PlayerCell.color + "'>" + PlayerCell.nick + "</font> (mass: " + PlayerCell.mass + ") is close, AI follows... X: " + parseInt(window.DistanceX[PlayerCell.id]) + " , Y: " + parseInt(window.DistanceY[PlayerCell.id]));
                        }
                        target2.x = PlayerCell.x;
                        target2.y = PlayerCell.y;
                        //console.log("Target mass: " + PlayerCell.mass);
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
    } else if (doSplittoAvoidCorner == true && window.doSplitFlag == true) {
        doSplittoAvoidCorner = false;
        window.doSplitFlag = false;
        setTimeout(function() {
            window.doSplitFlag = true;
        }, 8000);
        window.legendmod.sendAction(17);
    } else if (doFeed) {
        doFeed = false;
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
//function DefineVirusshootCase(){}

function DefineVirusshootCaseAndShoot(target2, doFeed, VirusCellDontDoTheRest) {
    if (window.FlagVirusCells.length > 0 && window.BadCellsDistanceName.length > 0) {
        for (var i = 0; i < window.FlagVirusCells.length; i++) {
            for (var j = 0; j < window.FlagDangerCells.length; j++) {
                if (Math.abs(window.VirusDistanceX[window.FlagVirusCells[i]]) < 700 && Math.abs(window.VirusDistanceX[window.FlagVirusCells[i]]) > 20 && Math.abs(window.BadCellsDistanceX[window.FlagDangerCells[j]]) < 760) {
                    if (legendmod3.lastSentClanTag != "" || !window.teammatenicks.includes(window.BadCellsDistanceName[window.FlagDangerCells[j]])) {
                        if (Math.abs(window.VirusDistanceX[window.FlagVirusCells[i]]) < Math.abs(window.BadCellsDistanceX[window.FlagDangerCells[j]]) && Math.abs(window.VirusDistanceY[window.FlagVirusCells[i]]) < Math.abs(window.BadCellsDistanceY[window.FlagDangerCells[j]])) {
                            if (window.VirusDistanceX[window.FlagVirusCells[i]] > 0 && window.BadCellsDistanceX[window.FlagDangerCells[j]] > 0 && window.VirusDistanceY[window.FlagVirusCells[i]] > 0 && window.BadCellsDistanceY[window.FlagDangerCells[j]] > 0) {
                                AnnounceBadCellShooting(window.VirusDistanceX[window.FlagVirusCells[i]], window.VirusDistanceY[window.FlagVirusCells[i]], window.BadCellsDistanceName[window.FlagDangerCells[j]], window.BadCellsDistanceX[window.FlagDangerCells[j]], window.BadCellsDistanceY[window.FlagDangerCells[j]]);
                                target2.x = window.VirusDistanceX[window.FlagVirusCells[i]];
                                target2.y = window.VirusDistanceY[window.FlagVirusCells[i]];
                                doFeed = true;
                                VirusCellDontDoTheRest = true;
                                return target2, doFeed, VirusCellDontDoTheRest;
                            } else if (window.VirusDistanceX[window.FlagVirusCells[i]] > 0 && window.BadCellsDistanceX[window.FlagDangerCells[j]] < 0 && window.VirusDistanceY[window.FlagVirusCells[i]] > 0 && window.BadCellsDistanceY[window.FlagDangerCells[j]] < 0) {
                                AnnounceBadCellShooting(window.VirusDistanceX[window.FlagVirusCells[i]], window.VirusDistanceY[window.FlagVirusCells[i]], window.BadCellsDistanceName[window.FlagDangerCells[j]], window.BadCellsDistanceX[window.FlagDangerCells[j]], window.BadCellsDistanceY[window.FlagDangerCells[j]]);
                                target2.x = window.VirusDistanceX[window.FlagVirusCells[i]];
                                target2.y = window.VirusDistanceY[window.FlagVirusCells[i]];
                                doFeed = true;
                                VirusCellDontDoTheRest = true;
                                return target2, doFeed, VirusCellDontDoTheRest;
                            } else if (window.VirusDistanceX[window.FlagVirusCells[i]] < 0 && window.BadCellsDistanceX[window.FlagDangerCells[j]] > 0 && window.VirusDistanceY[window.FlagVirusCells[i]] < 0 && window.BadCellsDistanceY[window.FlagDangerCells[j]] > 0) {
                                AnnounceBadCellShooting(window.VirusDistanceX[window.FlagVirusCells[i]], window.VirusDistanceY[window.FlagVirusCells[i]], window.BadCellsDistanceName[window.FlagDangerCells[j]], window.BadCellsDistanceX[window.FlagDangerCells[j]], window.BadCellsDistanceY[window.FlagDangerCells[j]]);
                                target2.x = window.VirusDistanceX[window.FlagVirusCells[i]];
                                target2.y = window.VirusDistanceY[window.FlagVirusCells[i]];
                                doFeed = true;
                                VirusCellDontDoTheRest = true;
                                return target2, doFeed, VirusCellDontDoTheRest;
                            } else if (window.VirusDistanceX[window.FlagVirusCells[i]] < 0 && window.BadCellsDistanceX[window.FlagDangerCells[j]] < 0 && window.VirusDistanceY[window.FlagVirusCells[i]] < 0 && window.BadCellsDistanceY[window.FlagDangerCells[j]] < 0) {
                                AnnounceBadCellShooting(window.VirusDistanceX[window.FlagVirusCells[i]], window.VirusDistanceY[window.FlagVirusCells[i]], window.BadCellsDistanceName[window.FlagDangerCells[j]], window.BadCellsDistanceX[window.FlagDangerCells[j]], window.BadCellsDistanceY[window.FlagDangerCells[j]]);
                                target2.x = window.VirusDistanceX[window.FlagVirusCells[i]];
                                target2.y = window.VirusDistanceY[window.FlagVirusCells[i]];
                                doFeed = true;
                                VirusCellDontDoTheRest = true;
                                return target2, doFeed, VirusCellDontDoTheRest;
                            }
                        }
                    }
                }
            }
        }
    }
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

function handleSandwichCellCase(target2) {
    var closestX = 1000;
    var closestY = 1000;
    var negativeX = false;
    var negativeY = false;
    Object.keys(window.FlagDangerCells).forEach(function(key) {
        //console.log(key, window.FlagDangerCells[key], window.DangerDistanceX[window.FlagDangerCells[key]], window.DangerDistanceY[window.FlagDangerCells[key]]);
        //console.log(window.DangerDistanceX[window.FlagDangerCells[key]], window.DangerDistanceY[window.FlagDangerCells[key]]);
        if (Math.abs(window.DangerDistanceX[window.FlagDangerCells[key]]) < closestX) {
            closestX = Math.abs(window.DangerDistanceX[window.FlagDangerCells[key]]);
            if (window.DangerDistanceX[window.FlagDangerCells[key]] < 0) {
                negativeX = true;
            } else {
                negativeX = false;
            }
        }
        if (Math.abs(window.DangerDistanceY[window.FlagDangerCells[key]]) < closestY) {
            closestY = Math.abs(window.DangerDistanceY[window.FlagDangerCells[key]]);
            if (window.DangerDistanceY[window.FlagDangerCells[key]] < 0) {
                negativeY = true;
            } else {
                negativeY = false;
            }
        }
    });
    if (negativeX) {
        closestX = -closestX;
    }
    if (negativeY) {
        closestY = -closestY;
    }
    //console.log(closestX, closestY);
    //here is the difference with the GeneralAvoiding
    if (Math.abs(-closestX) < Math.abs(-closestY)) {
        target2.x = -closestX;
        target2.y = closestY;
    } else {
        target2.x = closestX;
        target2.y = -closestY;
    }
    //target2.x = -closestX; normaly
    //target2.y = -closestY; normaly
    return target2;
}

function avoidCorners(biggercell, target2, PlayerCell, doSplittoAvoidCorner) {
    if ((biggercell.x < legendmod.mapMinX + 760 || biggercell.y < legendmod.mapMinY + 760 || biggercell.x > legendmod.mapMaxX - 760 || biggercell.y > legendmod.mapMaxY - 760) && (PlayerCell.x < legendmod.mapMinX + 760 || PlayerCell.y < legendmod.mapMinY + 760 || PlayerCell.x > legendmod.mapMaxX - 760 || PlayerCell.y > legendmod.mapMaxY - 760)) {
        let defineCornercaseX, defineCornercaseY, distanceCornerX, distanceCornerY;
        if (PlayerCell.x < legendmod.mapMinX + 760) {
            if (biggercell.y < PlayerCell.y) { //if i am more up
                target2.y = legendmod.mapMinY; //go up
            } else {
                target2.y = legendmod.mapMaxY; //go down
            }
            defineCornercaseX = "left";
            distanceCornerX = PlayerCell.x - legendmod.mapMinX;
            $('#pause-hud').html("Avoiding corners X- " + PlayerCell.x);
        }
        if (PlayerCell.y < legendmod.mapMinY + 760) {
            if (biggercell.x < PlayerCell.x) { //if i am more left
                target2.x = legendmod.mapMinX; //go left
            } else {
                target2.x = legendmod.mapMaxX; //go right
            }
            defineCornercaseY = "up";
            distanceCornerY = PlayerCell.y - legendmod.mapMinY;
            $('#pause-hud').html("Avoiding corners Y- " + PlayerCell.y);
        }
        if (PlayerCell.x > legendmod.mapMaxX - 760) {
            if (biggercell.y < PlayerCell.y) { //if i am more up
                target2.y = legendmod.mapMinY; //go up
            } else {
                target2.y = legendmod.mapMaxY; //go down
            }
            defineCornercaseX = "right";
            distanceCornerX = PlayerCell.x - legendmod.mapMinX;
            $('#pause-hud').html("Avoiding corners X+ " + PlayerCell.x);
        }
        if (PlayerCell.y > legendmod.mapMaxY - 760) {
            if (biggercell.x < PlayerCell.x) { //if i am more left
                target2.x = legendmod.mapMinX;
            } else {
                target2.x = legendmod.mapMaxX; //go right
            }
            defineCornercaseY = "down";
            distanceCornerY = PlayerCell.y - legendmod.mapMinY;
            $('#pause-hud').html("Avoiding corners Y+ " + PlayerCell.x);
        }
        //min are up left, max are down right

        if (defineCornercaseX == "left" && defineCornercaseY == "up" && (PlayerCell.x < legendmod.mapMinX + 520 || PlayerCell.y < legendmod.mapMinY + 520 || PlayerCell.x > legendmod.mapMaxX - 520 || PlayerCell.y > legendmod.mapMaxY - 520)) {
            if (Math.abs(distanceCornerX) < Math.abs(distanceCornerY)) { //is very left
                target2.x = legendmod.mapMaxX; //go right
            } else { //is very up
                target2.y = legendmod.mapMaxY; //go down 
            }
        } else if (defineCornercaseX == "left" && defineCornercaseY == "down" && (PlayerCell.x < legendmod.mapMinX + 520 || PlayerCell.y < legendmod.mapMinY + 520 || PlayerCell.x > legendmod.mapMaxX - 520 || PlayerCell.y > legendmod.mapMaxY - 520)) {
            if (Math.abs(distanceCornerX) < Math.abs(distanceCornerY)) { //is very left
                target2.x = legendmod.mapMaxX; //go right
            } else { //is very down
                target2.y = legendmod.mapMinY; //go up
            }
        } else if (defineCornercaseX == "right" && defineCornercaseY == "up" && (PlayerCell.x < legendmod.mapMinX + 520 || PlayerCell.y < legendmod.mapMinY + 520 || PlayerCell.x > legendmod.mapMaxX - 520 || PlayerCell.y > legendmod.mapMaxY - 520)) {
            if (Math.abs(distanceCornerX) < Math.abs(distanceCornerY)) { //is very right
                target2.x = legendmod.mapMaxX; //go left
            } else { //is very up
                target2.y = legendmod.mapMaxY; //go down
            }
        } else if (defineCornercaseX == "right" && defineCornercaseY == "down" && (PlayerCell.x < legendmod.mapMinX + 520 || PlayerCell.y < legendmod.mapMinY + 520 || PlayerCell.x > legendmod.mapMaxX - 520 || PlayerCell.y > legendmod.mapMaxY - 520)) {
            if (Math.abs(distanceCornerX) < Math.abs(distanceCornerY)) { //is vey right
                target2.x = legendmod.mapMinX; //go left
            } else { //is very down
                target2.y = legendmod.mapMinY; //go up
            }
        }
        doSplittoAvoidCorner = true;
    }
    return target2, doSplittoAvoidCorner;
}

function calcDist(x, y) {
    return Math.round(Math.sqrt(Math.pow(window.legendmod.playerX - x, 2) + Math.pow(window.legendmod.playerY - y, 2)));
}

function calcDistVirus(x, y, vx, vx) {
    return Math.round(Math.sqrt(Math.pow(vx - x, 2) + Math.pow(vy - y, 2)));
}

function AnnounceDangerCellOpposite(x, y) {
    $('#pause-hud').html("<font color='red'>Danger: <font> " + x + " and " + y + " are diametral");
}

function AnnounceBadCellShooting(vx, vy, name, x, y) {
    $('#pause-hud').html("<font color='yellow'>Shooting: <font> " + name + "(" + parseInt(x) + " , " + parseInt(y) + ")" + "from virus " + parseInt(vx) + "," + parseInt(vy));
}
