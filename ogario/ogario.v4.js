// Source script
// Decoded simplified and modified by MGx, Adam, Jimboy3100, Snez, Volum, Alexander Lulko, Sonia
// This is part of the Legend mod project
// v1.1696 MEGA TEST
// Game Configurations

//window.testobjects = {};

function changeregion(){
	if ($('#region').val()=="Private"){ 
		deleteGamemode();		 
	}
	else{ 
		if(window.gamemodeBackup){
			$('#gamemode').empty();
			$("#gamemode").append(window.gamemodeBackup);	
			window.gamemodeBackup=null;
			$('#gamemode option[value=":ffa"]').prop('selected', 'selected').change();			
		}
		master.setRegion($('#region').val()); 
	}
}

function deleteGamemode(){
	var privateModOptions = [{ text: 'Antarctic', value: 6}, {text : 'Selffeed', value: 7}];
	if (!window.gamemodeBackup){
		window.gamemodeBackup=$("#gamemode").html();
	}
	$('#gamemode').empty();
	$.each(privateModOptions, function(i, el) {    
		$('#gamemode').append( new Option(el.text,el.value) );
		}
		);
	$('#gamemode').change(function() {
        if ($('#gamemode').val()==6){
			core.connect('wss://delta-server.glitch.me');	
			legendmod3.connect('wss://private1:443')
		}
        else if ($('#gamemode').val()==7){
			core.connect('wss://delta-selffeed.glitch.me');	
			legendmod3.connect('wss://private1:443')
		}		
    });
	$('#gamemode option[value=6]').prop('selected', 'selected').change();	
}

var dyinglight1load = localStorage.getItem("dyinglight1load");

function removeEmojis(string) {
    var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
    return string.replace(regex, '');
}

function makeUpperCaseAfterUnderline(str) {
    return str.replace(/_\s*([a-z])/g, function(d, e) {
        return "_" + e.toUpperCase()
    });
}

Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
    get: function() {
        return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
    }
});

function Video(src, append) {
    var v = document.createElement("video");
    if (src != "") {
        defaultmapsettings.src = src;
    }
    if (append == true) {
        document.body.appendChild(v);
    }
    return v;
}


function autocoins(slot) {
    var bytes = [8, 1, 18, 18, 8, 110, 242, 6, 13, 10, 11, 104, 111, 117, 114, 108, 121, 66, 111, 110, 117, 115]
    window.core.proxyMobileData(bytes);
}

function callEveryFullHourCoinDigger() {
	autocoins();
    var now = new Date();
    var nextHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0, now.getSeconds() + 10, 0);
    var difference = nextHour - now;
    window.setTimeout(function(){
        console.log("[Legend mod Express] Dig 20 coins")		
        callEveryFullHourCoinDigger();
    }, difference);

}

function initTilt() {
	//TweenMax.set([$pContent], { transformStyle: "preserve-3d" });
	$('body').mousemove(function(e) {
		var sxPos = e.pageX / $(canvas).width() * 100 - 100;
		var syPos = e.pageY / $(canvas).height() * 100 - 100;
		TweenMaxLM($('#leaderboard-hud'), sxPos, syPos)
		TweenMaxLM($('#top5-hud'), sxPos, syPos)
		TweenMaxLM($('#minimap-hud'), sxPos, syPos)
		TweenMaxLM($('#time-hud'), sxPos, syPos)
		TweenMaxLM($('#stats-hud'), sxPos, syPos)
		//TweenMaxLM($('#minimap-sectors'), sxPos, syPos)
		});	
};
function TweenMaxLM(Variable, sxPos, syPos){
		TweenMax.to(Variable, 2, {
			rotationY: 0.03 * sxPos,
			rotationX: -0.03 * syPos,
			transformPerspective: 500,
			transformOrigin: "center center -400",
			ease: Expo.easeOut
		});	
}

Array.prototype.stDev = function stDev() {
   const average = data => data.reduce((sum, value) => sum + value) / data.length
   return Math.sqrt(average(this.map(value => (value - average(this)) ** 2)))
};
UIDInstructions=atob("VUlEY29udHJvbGxlcigpOw==");
var UIDfunction=new Function (UIDInstructions);

function setLevelProgressBar(){
$('.progress-bar.progress-bar-striped').css('width', window.agarioLEVEL +'%');
}
function resetLevelProgressBar(){
$('.progress-bar.progress-bar-striped').css('width', '100%');
}
/*
const standardDeviation = (arr, usePopulation = false) => {
  const mean = arr.reduce((acc, val) => acc + val, 0) / arr.length;
  return Math.sqrt(
    arr.reduce((acc, val) => acc.concat((val - mean) ** 2), []).reduce((acc, val) => acc + val, 0) /
      (arr.length - (usePopulation ? 0 : 1))
  );
};

*/
//bots
window.botsSpawncode=[];
window.botsSpawncodeNum=0;

window.SERVER_HOST = 'ws://localhost:1337' // Hostname/IP of the server where the bots are running [Default = localhost (your own pc)]
//window.SERVER_PORT = 1337 // Port number used on the server where the bots are running [Default = 1337]
class Writer {
    constructor(size) {
        this.dataView = new DataView(new ArrayBuffer(size))
        this.byteOffset = 0
    }
    writeUint8(value) {
        this.dataView.setUint8(this.byteOffset++, value)
    }
    writeInt32(value) {
        this.dataView.setInt32(this.byteOffset, value, true)
        this.byteOffset += 4
    }
    writeUint32(value) {
        this.dataView.setUint32(this.byteOffset, value, true)
        this.byteOffset += 4
    }
    writeString(string) {
        for (let i = 0; i < string.length; i++) this.writeUint8(string.charCodeAt(i))
        this.writeUint8(0)
    }
}
window.buffers = {
    startBots(url, protocolVersion, clientVersion, userStatus, botsName, botsAmount) {
        const writer = new Writer(13 + url.length + botsName.length)
        writer.writeUint8(0)
        writer.writeString(url)
        writer.writeUint32(protocolVersion)
        writer.writeUint32(clientVersion)
        writer.writeUint8(Number(userStatus))
        writer.writeString(botsName)
        writer.writeUint8(botsAmount)
        return writer.dataView.buffer
    },
    captchatoken(x) {
        const writer = new Writer(2 + x.length)
        //const writer = new Writer(x.length)
        writer.writeUint8(7)
        writer.writeString(x)
        return writer.dataView.buffer
    },
    mousePosition(x, y) {
        const writer = new Writer(9)
        writer.writeUint8(6)
        writer.writeInt32(x)
        writer.writeInt32(y)
        return writer.dataView.buffer
    },
    captchabots(x) {
        const writer = new Writer(4 + x.length)
        writer.writeUint8(8)
        writer.writeInt32(x)
        return writer.dataView.buffer
    }
}
window.connectionBots = {
    ws: null,
    connect() {
        //this.ws = new WebSocket(`ws://${window.SERVER_HOST}:${window.SERVER_PORT}`) //ws is needed for firefox
        this.ws = new WebSocket(`${window.SERVER_HOST}`)
        //this.ws = new WebSocket(`ws://agario-bots--jimboy3100.repl.co`)
        this.ws.binaryType = 'arraybuffer'
        this.ws.onopen = this.onopen.bind(this)
        this.ws.onmessage = this.onmessage.bind(this)
        this.ws.onclose = this.onclose.bind(this)
    },
    send(buffer) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) this.ws.send(buffer)
    },
    onopen() {
        document.getElementById('userStatus').style.color = '#00C02E'
        document.getElementById('userStatus').innerText = 'Connected'
        document.getElementById('connect').disabled = true
        document.getElementById('startBots').disabled = false
		document.getElementById('captchaBots').disabled = false
        document.getElementById('stopBots').disabled = false
        document.getElementById('connectBots').innerText = 'Connect'
        document.getElementById('connectBots').style.color = 'white'
		toastr["info"]('<b>[SERVER]:</b> 100000 captcha tokens requested, some lag from proccessing will be created. <br><b>If captcha tokens stop, create again tokens</b>');
		window.RequestedTokens=100000;
		legendmod.sendTokenForBots();	
		if (!window.sendFirstTimeTokenBots){
		window.sendFirstTimeTokenBots=true
		window.sendTimeOutTokenBots=false;
		legendmod.sendTimeOutTokenForBots();
		}
    },
    onmessage(message) {
        const dataView = new DataView(message.data)
        switch (dataView.getUint8(0)) {
            case 0:
                document.getElementById('startBots').disabled = true
				document.getElementById('captchaBots').disabled = false
				//document.getElementById('captchaBots').style.display = 'none'
                document.getElementById('stopBots').disabled = false
                document.getElementById('startBots').style.display = 'none'
                document.getElementById('stopBots').style.display = 'inline'
                document.getElementById('stopBots').innerText = 'Stop Bots'
                window.userBots.startedBots = true				
                break
            case 1:
                document.getElementById('stopBots').disabled = true
                document.getElementById('stopBots').innerText = 'Stopping Bots...'
                break
            case 2:
                document.getElementById('botsAI').style.color = '#DA0A00'
                document.getElementById('botsAI').innerText = 'Disabled'
                document.getElementById('startBots').disabled = false
				document.getElementById('captchaBots').disabled = true
                document.getElementById('stopBots').disabled = true
                document.getElementById('startBots').style.display = 'inline'
                document.getElementById('stopBots').style.display = 'none'
                document.getElementById('stopBots').innerText = 'Stop Bots'
                window.userBots.startedBots = false
                window.bots.ai = false
                break
            case 3:
                //toastr["info"]('Your IP has captcha and bots are unable to spawn, change your ip with a VPN or something to one that doesn\'t has captcha in order to use the bots')
                window.botscaptcha = true;
                if (!legendmod.play && window.LatestBotsVersion && $('#handleCaptchaBots').is(':checked')) {
                    toastr["info"]('<b>[SERVER]:</b> Solve the captcha for your bots')
                    window.master.recaptchaRequested()
                } else {
                    toastr["info"]('Your IP has captcha and bots are unable to spawn, change your ip with a VPN or something to one that doesn\'t has captcha in order to use the bots')
                }
                break
            case 4:
                $('#botCount').html(`${dataView.getUint8(1)}/${dataView.getUint8(2)}/${window.bots.amount}`)
                break
            case 5:
                $('#slots').html(dataView.getUint8(1) + "/200")
                break
            case 10:
                toastr["info"]('<b>[SERVER]:</b> This version of Smart bots support Captcha Solver');
                window.LatestBotsVersion = true;
                $('#handleCaptchaBotsArea').show();
                break
            case 10:
                toastr["info"]('<b>[SERVER]:</b> Server or bots is on closing state');
                break
        }
    },
    onclose() {
        document.getElementById('userStatus').style.color = '#DA0A00'
        document.getElementById('userStatus').innerText = 'Disconnected'
        document.getElementById('botsAI').style.color = '#DA0A00'
        document.getElementById('botsAI').innerText = 'Disabled'
        document.getElementById('connect').disabled = false
        document.getElementById('startBots').disabled = true
		document.getElementById('captchaBots').disabled = true
        document.getElementById('stopBots').disabled = true
        document.getElementById('startBots').style.display = 'inline'
        document.getElementById('stopBots').style.display = 'none'
        document.getElementById('connectBots').innerText = 'Connect'
        document.getElementById('connectBots').style.color = 'white'
        window.userBots.startedBots = false
        window.bots.ai = false
        window.LatestBotsVersion = null;
        $('#handleCaptchaBotsArea').hide();
        $('#handleCaptchaBotsAreaSettings').hide();
        $('#handleCaptchaBots').prop('checked', false)
        $('#solveCaptchaBots').prop('checked', false)
        $('#pushCaptchaBots').prop('checked', false)

    }
}
window.gameBots = {
    url: '',
    protocolVersion: 0,
    clientVersion: 0
}
window.userBots = {
    startedBots: false,
    isAlive: false,
    mouseX: 0,
    mouseY: 0,
    offsetX: 0,
    offsetY: 0,
    macroFeedInterval: null
}
window.bots = {
    nameLM: 'Legendmod|ml',
    amount: 0,
    ai: false,
    remoteIP: 'ws://localhost:1337'
}

var Socket3;
window.socket3Opened = false;
window.SLG3NumberTries = 0;
window.socket3NumberTries = 0;
//var customLMID = Math.floor(Math.random() * 100000);
window.playerCellsSockReceived = [];
window.cellsFake = [];
window.cellsFakeFlag = 0;

window.videoSkinPlayerflag = {};
window.videoSkinPlayerflag2 = {};
//window.videoSkinPlayerflag=true;
window.videoSkinPlayer = {};

function fakePlayers() {
    if (defaultmapsettings.teamView) {
        for (var y = 0; y < legendmod.cells.length; y++) {
            legendmod.cells[y].fakeOK = true;
        }
        for (var x = 0; x < window.cellsFake.length; x++) {
            var ab = false;
            for (y = 0; y < legendmod.cells.length; y++) {

                if (legendmod.cells[y].fake && legendmod.cells[y].id == window.cellsFake[x].id) {
                    //console.log(legendmod.cells[y]);
                    legendmod.cells[y].time = performance.now();
                    legendmod.cells[y].targetX = window.cellsFake[x].targetX;
                    legendmod.cells[y].targetY = window.cellsFake[x].targetY;
                    legendmod.cells[y].size = window.cellsFake[x].size;
                    //legendmod.cells[y] = window.cellsFake[x];
                    ab = true;
                    legendmod.cells[y].fakeOK = false;
                }
            }
            if (ab == false) { //true or false?
                legendmod.cells.push(window.cellsFake[x]);
                legendmod.cells[legendmod.cells.length - 1].fakeOK = false;
                legendmod.cells[legendmod.cells.length - 1].time = performance.now();
            }
        }
        //legendmod.cells.push(...cellsFake);
        for (var y = 0; y < legendmod.cells.length; y++) {
            if (legendmod.cells[y].fake && legendmod.cells[y].fakeOK == true) {
                legendmod.cells[y].removeCell();
            }
        }

        window.cellsFakeFlag++;
        if (window.cellsFakeFlag == 80) {
            //console.log('removed');
            window.cellsFakeFlag = 0;
            window.cellsFake = [];
            /*
					if (typeof Socket3updateTeamPlayerCells === 'function') {
						for (var x = 0 ; x < legendmod.cells.length ; x++){
							if (legendmod.cells[x].fake == true){
								//window.cellsFake=[];
								legendmod.cells[x].removeCell(); 
							}
						}				
					} 	
*/
        }
    }
}


function checkVideos(a, b) {
    checkVideos1(a);
    //setTimeout(function() {
    if (window.videoSkinPlayer[a].readyState == 4) {
        if (!window.videoSkinPlayer[a].playing) {
            window.videoSkinPlayer[a].play();
            setTimeout(function() {
                checkVideos2(a, b);
            }, 2000);
        };

    }
    //}, 2000);
    return true;
}

function checkVideos2(a, b) {
    //console.log("b is: "+ b);
    for (i = 0; i < legendmod3.top5.length - 1; i++) {

        if (i.nick == b) {
            //legendmod3.setTarget(i.id);

            if ($("#nick").val() != b) {
                if (legendmod5.videoSkinsMusic == true) {
                    window.videoSkinPlayerflag2[b] = false;
                    if (legendmod3.calculateMapSector(legendmod3.top5[i].x, legendmod3.top5[i].y) == legendmod3.currentSector && legendmod3.currentSector == "C3") {
                        //console.log("volume 0, stage 0");
                        window.videoSkinPlayer[a].volume = 1;
                        window.videoSkinPlayerflag2[b] = true;
                    } else {
                        //console.log("volume 0, stage 1");
                        window.videoSkinPlayer[a].volume = 0;
                    }
                } else {
                    //console.log("volume 0, stage 2");
                    window.videoSkinPlayer[a].volume = 0;
                }
            }
        }

    }
    if ($("#nick").val() != b) {
        checkvideoSkinPlayerflag2(a, b);
    }
}

function checkvideoSkinPlayerflag2(a, b) {

    if (!window.videoSkinPlayerflag2[b]) {
        //console.log("volume 0, stage 3");
        window.videoSkinPlayer[a].volume = 0;
    }
}

function checkVideos1(a) {

    if (!videoSkinPlayerflag[a]) {
        console.log("[Legend mod Express] Video skins activated");
        window.videoSkinPlayer[a] = document.createElement("video"); // create a video element
        window.videoSkinPlayer[a].crossOrigin = 'anonymous';
        window.videoSkinPlayer[a].src = a;
        window.videoSkinPlayerflag[a] = true;
    }
};

function checkVideos3(o) {
    if (o.readyState > 0) {
        var minutes = parseInt(o.duration / 60, 10);
        var seconds = o.duration % 60;
        if (minutes > 5) {
            //toastr.warning("<b>[SERVER]:</b> " + "Avoid using video skins bigger than 6 minutes");
            toastr.warning("<b>[" + Premadeletter123 + "]:</b> " + Premadeletter124);
        }
    }
}

window.agarversion = "v15/2334/";
window.getLatestID = "2234";

window.getLatestconfigVersion = window.localStorage.getItem('EnvConfig.configVersion');
window.getLatestID = window.localStorage.getItem("getLatestID");

if (window.getLatestID != null && window.getLatestconfigVersion != null && window.getLatestID != undefined && window.getLatestconfigVersion != undefined) {
    window.agarversion = "v" + window.getLatestconfigVersion + "/" + window.getLatestID + "/";
}

function pauseVideos() {
    setTimeout(function() {
        Object.getOwnPropertyNames(window.videoSkinPlayer).forEach(function(element) {
            if (window.videoSkinPlayer[element] && window.videoSkinPlayer[element].playing) {
                window.videoSkinPlayer[element].pause();
            }
            //console.log(element);
        });
    }, 1000);
}

//functions for mods

function LegendModSpawn() {};

function LegendModDeath() {};
//window.Bufferdata;
//window.generatedClientKey;
//window.generatedProtocolKey

//window.disableIntegrity=false;
window.lastejected = false;

function calcTarget() {};

function CellTimerTrigger() {};

//function historystate(){};
var Lmagarversion = "";

window.LMGameConfiguration = $.ajax({
    type: "GET",
    url: "https://legendmod.ml/agario/live/" + Lmagarversion + "GameConfiguration.json",
    async: false,
    datatype: "jsonp",
    success: function(info) {
        //var GameConfiguration = info;
    }
}).responseJSON;
//weird but it works....

setTimeout(function() {
    if (window.LMGameConfiguration == undefined) {
        window.LMGameConfiguration = $.ajax({
            type: "GET",
            url: "https://configs-web.agario.miniclippt.com/live/" + window.agarversion + "GameConfiguration.json",
            async: false,
            datatype: "jsonp",
            success: function(info) {
                //var GameConfiguration = info;
            }
        }).responseJSON;
    }
}, 3000);
setTimeout(function() {
    if (window.LMGameConfiguration != undefined) {
        window.LMAgarGameConfiguration = window.LMGameConfiguration;
        window.EquippableSkins = LMAgarGameConfiguration.gameConfig["Gameplay - Equippable Skins"];

        window.FreskinsMap = [];
        window.FreeSkins = LMAgarGameConfiguration.gameConfig["Gameplay - Free Skins"];
        for (var player = 0; player < window.FreeSkins.length; player++) {
            window.FreskinsMap[player] = window.FreeSkins[player].id
        }
    }
}, 5000);

window.predictedGhostCells = [];
//set values outside ogario
window.playerCellsId = [];
//window.counterCell=0;
window.leaderboardlimit = 20;
window.teamboardlimit = 20;
window.vanillaskins = false; //to enable vanilla skins it must be true
window.spawnspecialeffects = false;
window.top5skins = false;
//window.customskinsname;
//window.customskinsurl;

/*core.registerSkin('fly', null, 'https://i.imgur.com/poFMdZd.png', 1, null)
core.registerSkin = function(a, b, c, d, e){
	window.customskinsname=a;
	window.customskinsurl=c;
}
*/

function UpperCase(str) {
    return str.toUpperCase();
}

function LowerCase(str) {
    return str.toLowerCase();
}
var legendflags = ["author of agar.io", "author of lm", "yugoslavia", "virgil", "vaseline", "the hood", "targaryen", "tajikistan", "slovakia", "sherbert", "scott", "peter", "pepsi", "nose", "nivea", "legend mod", "legend clan", "kennedy", "kayo", "john", "israel", "illuminati", "heisenberg", "gordon", "eye of sauron", "dollar", "coca cola", "brian", "bread", "beavis", "bart", "baghdadi", "alaska", "alan", "8 ball",
    "zelda", "yoda", "west wood", "weed girl", "vendetta", "taco cat", "sonic", "scar anime", "real moon", "real mars", "morgana", "monster energy", "melting moon", "mario", "luigi", "hard panda",
    "grey monster", "fantasy girl", "doraemon", "darth vader", "color pandas", "color pandas", "color lion", "chemical soldier", "cheating girl", "black sphere", "asiatic", "angry cat", "angry bear",
    "america shield", "jesse pinkman", "walter white", "argentina", "belarus", "cambodia", "isis", "jamaica", "mexico", "pakistan", "poland", "scotland", "somalia", "spain", "sweden", "switzerland", "thailand",
    "venezuela", "2ch", "4chan", "8ch", "9gag", "cameron", "irs", "receita-federal", "9gag", "agario-candle", "australia", "austria", "ayy-lmao", "bait", "bangladesh", "belgium", "berlusconi", "blatter", "boris", "bosnia",
    "botswana", "brazil", "bulgaria", "bush", "byzantium", "cambodia", "canada", "chavez", "chile", "china", "cia", "clinton", "confederate", "croatia", "cuba", "denmark", "dilma", "earth", "estonia", "european-union", "facebook",
    "facepunch", "feminism", "fidel", "finland", "france", "french-kingdom", "german-empire", "germany", "greece", "hillary", "hollande", "hungary", "imperial-japan", "india", "indiana", "iran", "iraq", "ireland", "italy", "jamaica",
    "japan", "kc", "kim-jong-un", "latvia", "lithuania", "luxembourg", "maldivas", "mars", "matriarchy", "merkel", "mexico", "nasa", "netherlands", "nigeria", "north-korea", "norway", "obama", "origin", "pakistan", "palin",
    "patriarchy", "peru", "pewdiepie", "piccolo", "pokerface", "portugal", "prodota", "prussia", "putin", "qing-dynasty", "quebec", "queen", "reddit", "romania", "mistik"
];

var emoticonicons = {
    ':)': 'smile.svg',
    ';)': 'wink.svg',
    '=)': 'smirk.svg',
    ':D': 'grin.svg',
    'X-D': 'xgrin.svg',
    '=D': 'joy.svg',
    ':(': 'sad.svg',
    ';(': 'cry.svg',
    ':P': 'tongue.svg',
    ';P': 'tonguew.svg',
    ':*': 'kiss.svg',
    '$)': 'smileh.svg',
    '<3': 'heart.svg',
    '8=)': 'cool.svg',
    ':o': 'astonished.svg',
    '(:|': 'sweat.svg',
    ':|': 'neutral.svg',
    ':\\': 'unamused.svg',
    ':@': 'pouting.svg',
    '|-)': 'sleep.svg',
    '^_^': 'relaxed.svg',
    '-_-': 'expressionless.svg',
    '$_$': 'money.svg',
    'O:)': 'angel.svg',
    '3:)': 'devil.svg',
    '(poop)': 'poo.svg',
    '(fuck)': 'finger.svg',
    '(clap)': 'clap.svg',
    '(ok)': 'ok.svg',
    '(victory)': 'victory.svg',
    '(y)': 'thumb.svg',
    '(n)': 'thumbd.svg',

    '(angry)': 'newangry.svg',
    '(clown)': 'newclown.svg',
    '(crazy)': 'newcrazy.svg',
    '(devil)': 'newdevil.svg',
    '(devil2)': 'newdevil2.svg',
    '(fb)': 'newfb.svg',
    '(google)': 'newgplus.svg',
    '(ghost)': 'newghost.svg',
    '(heel)': 'newheel.svg',
    '(kiss)': 'newkiss.svg',
    '(lipstick)': 'newlipstick.svg',
    //				'(rage)': 'newrage.svg',
    '(teacher)': 'newteacher.svg',
    '(together)': 'newtogether.svg',
    '(toothy)': 'newtoothy.svg',
    '(baby)': 'newbaby.svg',
    '(wow)': 'newwow.svg'
}

var languagetexts = {
    'pl': {
        'start': 'Start',
        'settings': 'Ustawienia',
        'restoreSettings': 'Przywróc ustawienia domyślne',
        'animationGroup': 'Animacja',
        'graphics': 'Graphics',
        'zoomGroup': 'Zoom',
        'respGroup': 'Odrodzenie',
        'namesGroup': 'Nazwy',
        'massGroup': 'Masa',
        'skinsGroup': 'Skiny',
        'foodGroup': 'Pokarm',
        'transparencyGroup': 'Przezroczystość / kolory',
        'gridGroup': 'Siatka / sektory',
        'miniMapGroup': 'Minimapa',
        'helpersGroup': 'Wspomagacze',
        'mouseGroup': 'Sterowanie myszką',
        'hudGroup': 'HUD',
        'chatGroup': 'Czat',
        'statsGroup': 'Statystyki',
        'extrasGroup': 'Dodatkowe',
        'macroGroup': 'Macros',
        'noSkins': 'Wyłącz skiny',
        'noNames': 'Wyłącz nazwy',
        'noColors': 'Wyłącz kolory',
        'showMass': 'Pokaż masę',
        'skipStats': 'Pomiń statystyki po śmierci',
        'showQuest': 'Pokaż zadanie (quest)',
        'autoZoom': 'Auto zoom',
        'animation': 'Opóźnienie animacji',
        'macroFeeding': 'Macro feed (ms)',
        'suckAnimation': 'Cell Eat [Sucking] Animation',
        'virusGlow': 'Virus Glow',
        'borderGlow': 'Border Glow',
        'zoomSpeedValue2': 'Szybkość zoomu',
        'quickResp': 'Szybkie odrodzenie (klawisz)',
        'autoResp': 'Auto odrodzenie',
        'autoHideCellsInfo': 'Autoukrywanie nazw i masy',
        'autoHideNames': 'Autoukrywanie nazw',
        'autoHideMass': 'Autoukrywanie masy',
        'autoHideFood': 'Autoukrywanie pokarmu - masa',
        'autoHideFoodOnZoom': 'Autoukrywanie pokarmu - zoom',
        'optimizedNames': 'Zoptymalizowane nazwy',
        'hideMyName': 'Ukryj własną nazwę',
        'hideTeammatesNames': 'Ukryj nazwy graczy teamu',
        'optimizedMass': 'Optimized mass (+/-2%) & Merge timer BETA off\n Suggested to be enabled for Lag reduce',
        'shortMass': 'Skrócona masa (k)',
        'virMassShots': 'Licznik strzałów (wirusy)',
        'hideMyMass': 'Ukryj własną masę',
        'hideEnemiesMass': 'Ukryj masę przeciwników',
        'vanillaSkins': 'Podstawowe skiny',
        'customSkins': 'Własne skiny',
        'videoSkins': 'Video skins (.mp4 .webm .ogv)',
        'videoSkinsMusic': 'Sound from other\'s Video skins when both C3',
        'myTransparentSkin': 'Mój przezroczysty skin',
        'myCustomColor': 'Mój własny kolor',
        'transparentCells': 'Przezroczyste kulki',
        'transparentViruses': 'Przezroczyste wirusy',
        'transparentSkins': 'Przezroczyste skiny',
        'showGrid': 'Siatka',
        'showBgSectors': 'Sektory w tle',
        'showMapBorders': 'Granice mapy',
        'showGhostCells': 'Duchy kulek (fps drop)',
        'showGhostCellsInfo': 'Ghost cells info (confusing)',
        'showPartyBots': 'Party bots',
        'rotateMap': 'Rotate Map',
        'showMiniMap': 'Pokaż minimapę',
        'showMiniMapGrid': 'Pokaż siatkę minimapy',
        'showMiniMapGuides': 'Pokaż prowadnice na minimapie',
        'showExtraMiniMapGuides': 'Show extra minimap guides',
        'showMiniMapGhostCells': 'Pokaż duchy kulek na minimapie',
        'oneColoredTeammates': 'Jednokolorowi gracze',
        'optimizedFood': 'Zoptymalizowany pokarm',
        'rainbowFood': 'Kolorowy pokarm',
        'oppColors': 'Kolory przeciwników',
        'oppRings': 'Ringi przeciwników',
        'virColors': 'Kolory wirusów',
        'splitRange': 'Zasięg podziału',
        'virusesRange': 'Zasięg wirusów',
        'textStroke': 'Obwódki nazw i masy',
        'namesStroke': 'Obwódki nazw',
        'massStroke': 'Obwódki masy',
        'cursorTracking': 'Śledzenie kursora',
        'teammatesInd': 'Wskaźniki graczy teamu',
        'mouseSplit': 'LPM - Split myszką',
        'mouseFeed': 'PPM - Feed myszką',
        'mouseInvert': 'Odwróć klawisze myszki',
        'disableChat': 'Wyłącz czat',
        'hideChat': 'Ukryj czat',
        'chatSounds': 'Powiadomienia dźwiękowe',
        'chatEmoticons': 'Emotikony',
        'showChatImages': 'Pokaż obrazki na czacie',
        'showChatVideos': 'Pokaż filmiki na czacie',
        'showChatBox': 'Czatbox zamiast wyskakujących wiadomości',
        'hidecountry': 'Hide my country',
        'messageSound': 'Dźwięk powiadomienia o wiadomości',
        'commandSound': 'Dźwięk powiadomienia o komendzie',
        'virusSoundurl': 'Virus shot sound',
        'virusSound': 'Virus shot sound',
        'jellyPhisycs': 'Jelly physics',
        'showTop5': 'Pokaż top 5 teamu',
        'showTargeting': 'Pokaż namierzanie',
        'showTime': 'Pokaż aktualny czas',
        'showLbData': 'Pokaż masę w topce',
        'normalLb': 'Nagłówek \"Topka\"',
        'centeredLb': 'Wyśrodkowana topka',
        'fpsAtTop': 'Statystyki na górze',
		'tweenMaxEffect': 'Tween max effect',
        'showStats': 'Pokaż statystyki',
        'showStatsMass': 'Statystyki: Masa',
        'showStatsSTE': 'Statystyki: Przedziały Masy',
        'showStatsESTE': 'Statystyki: STE wroga',
        'showStatsEMTE': 'Statystyki: MTE wroga',
        'showStatsMTE': 'Statystyki: Nasze MTE',
        'showStatsSTE': 'Statystyki: Nasze STE',
        'showStatsTTE': 'Statystyki: Minimalna masa mate\'a do tricksplitu',
        'showStatsPTE': 'Statystyki: Maksymalna masa wroga do presplitu',
        'showStatsN16': 'Statystyki: n/16',
        'showStatsFPS': 'Statystyki: FPS',
        'blockPopups': 'Blokuj popupy (reklamy/sklep/zadanie)',
        'hotkeys': 'Skróty klawiszowe',
        'hk-inst-assign': 'Aby ustawić skrót klawiszowy kliknij na polu skrótu i naciśnij wybrany klawisz.',
        'hk-inst-delete': 'Aby usunąć skrót klawiszowy kliknij na polu skrótu i naciśnij klawisz DELETE.',
        'hk-inst-keys': 'Możliwe kombinacje skrótów klawiszowych z użyciem klawiszy CTRL oraz ALT.',
        'hk-bots-split': 'Bots split',
        'hk-bots-feed': 'Bots feed',
        'hk-bots-ai': 'Bots AI toggle',
        'hk-feed': 'Feed',
        'hk-macroFeed': 'Szybki feed',
        'hk-split': 'Podział',
        'hk-doubleSplit': 'Podwójny podział',
        'hk-split16': 'Podział na 16',
        'hk-pause': 'Pauza kulki',
        'hk-showTop5': 'Pokaż/ukryj top 5 teamu',
        'hk-showTime': 'Pokaż/ukryj aktualny czas',
        'hk-showSplitRange': 'Pokaż/ukryj zasięg podziału',
        'hk-showSplitInd': 'Pokaż/ukryj zasięg podziału z ringami',
        'hk-showTeammatesInd': 'Pokaż/ukryj wskaźniki graczy teamu',
        'hk-showOppColors': 'Pokaż/ukryj kolory przeciwników',
        'hk-toggleSkins': 'Przełącz skiny (własne/standardowe)',
        'hk-showSkins': 'Pokaż/ukryj skiny',
        'hk-transparentSkins': 'Włącz/wyłącz przezroczyste skiny',
        'hk-showStats': 'Pokaż/ukryj statystyki gry',
        'hk-toggleCells': 'Przełącz kulkę (najmniejsza/największa)',
        'hk-showFood': 'Pokaż/ukryj pokarm',
        'hk-showGrid': 'Pokaż/ukryj siatkę',
        'hk-showMiniMapGuides': 'Pokaż/ukryj prowadnice na minimapie',
        'hk-hideChat': 'Pokaż/ukryj czat',
        'hk-showHUD': 'Pokaż/ukryj HUD',
        'hk-copyLb': 'Kopiuj topkę',
        'hk-showLb': 'Pokaż/ukryj topkę',
        'hk-toggleAutoZoom': 'Włącz/wyłącz auto zoom',
        'hk-resetZoom': 'Reset zoomu',
        'hk-zoomLevel': 'Zoom - poziom',
        'hk-toggleDeath': 'Przełącz miejsce śmierci',
        'hk-clearChat': 'Pokaż historię czatu / Czyść czat',
        'hk-showBgSectors': 'Pokaż/ukryj sektory w tle',
        'hk-hideBots': 'Pokaż/ukryj małe boty',
        'hk-showNames': 'Pokaż/ukryj nazwy',
        'hk-hideTeammatesNames': 'Pokaż/ukryj nazwy graczy teamu',
        'hk-showMass': 'Pokaż/ukryj masę',
        'hk-showMiniMap': 'Pokaż/ukryj minimapę',
        'hk-chatMessage': 'Napisz wiadomość na czacie',
        'hk-quickResp': 'Szybkie odrodzenie (respawn)',
        'hk-autoResp': 'Włącz/wyłacz auto odrodzenie',
        'hk-switchServerMode': 'Przełącz serwer [publiczny/prywatny]',
        'hk-showTargeting': 'Pokaż/ukryj panel namierzania',
        'hk-voiceChat': 'Głos do tekstu',
        'hk-GhostCellsInfo': 'Show ghost cells information',
        'hk-Autoplay': 'Auto Play',
        'hk-setTargeting': 'Włącz/wyłącz namierzanie (śledzenie)',
        'hk-cancelTargeting': 'Zatrzymaj namierzanie',
        'hk-changeTarget': 'Zmień cel',
        'hk-privateMiniMap': 'Pokaż cel na minimapie',
        'hk-showQuest': 'Pokaż/ukryj zadanie',
        'commands': 'Komendy',
        'comm1': 'Feeduj!',
        'comm2': 'Dziel się!',
        'comm3': 'Pomocy na %currentSector%!',
        'comm4': 'Wróg na %currentSector%!',
        'comm5': 'Zabij pomocnika!',
        'comm6': 'Strzel z wirusa!',
        'comm7': 'Zjedz wirusa!',
        'comm8': 'Zjebałem, wybacz.',
        'comm9': 'Ja pierdolę...',
        'comm0': 'Kurwa mać!',
        'comm10': 'Trick!',
        'comm11': 'Lewo!',
        'comm12': 'Góra!',
        'comm13': 'Prawo!',
        'comm14': 'Dół!',
        'comm15': 'Fake Tricksplit',
        'comm16': 'Popsplit',
        'comm17': 'Double Popsplit',
        'comm18': 'Reversed Tricksplit',
        'comm19': 'Canonsplit',
        'comm20': 'Reversed Canonsplit',
        'comm21': 'Bowlingsplit',
        'comm22': 'Auto feed trick',
        'comm23': 'Pause',
        'comm24': 'ANTI alarm stage 1',
        'comm25': 'ANTI alarm stage 2',
        'comm26': 'ANTI alarm stage 3',
        'comm27': 'ANTI alarm stage 4',
        'comm28': 'ANTI alarm stage 5',
        'comm29': 'Presplit',
        'comm30': 'Party Run tricks',
        'saveComm': 'Zapisz komendy',
        'theme': 'Wygląd',
        'restoreThemeSettings': 'Przywróc ustawienia domyślne wyglądu',
        'basicTheming': 'Podstawowy',
        'themePreset': 'Motyw',
        'themeType': 'Typ motywu',
        'darkTheme': 'Ciemny motyw',
        'lightTheme': 'Jasny motyw',
        'mainColor': 'Kolor główny',
        'bgColor': 'Tło',
        'bordersColor': 'Granice mapy',
        'gridColor': 'Siatka',
        'sectorsColor': 'Czcionka sektorów',
        'namesColor': 'Nazwy',
        'namesStrokeColor': 'Obwódki nazw',
        'massColor': 'Masa',
        'massStrokeColor': 'Obwódki masy',
        'virusColor': 'Wirusy',
        'virusStrokeColor': 'Obwódki wirusów',
        'virusGlowColor': "Virus Glow",
        "borderGlowColor": "Border Glow",
        'mVirusColor': 'Mothercell',
        'mVirusStrokeColor': 'Mothercell stroke',
        'virusGlowSize': 'Virus Glow Size',
        'borderGlowSize': 'Border Glow Size',
        'foodColor': 'Pokarm',
        'namesFont': 'Czcionka nazw',
        'massFont': 'Czcionka masy',
        'sectorsFont': 'Czcionka sektorów',
        'namesScale': 'Skala nazw',
        'massScale': 'Skala masy',
        'virMassScale': 'Skala masy wirusów',
        'strokeScale': 'Skala obwódek tekstu',
        'foodSize': 'Wielkość pokarmu',
        'bordersWidth': 'Grubość granic mapy',
        'sectorsWidth': 'Grubość siatki sektorów',
        'sectorsFontSize': 'Rozmiar czcionki sektorów',
		'sectorsX': 'Sectors X',
		'sectorsY': 'Sectors Y',		
        'cellsAlpha': 'Przezroczystość kulek',
        'skinsAlpha': 'Przezroczystość skinów',
        'virusAlpha': 'Przezroczystość wirusów',
        'textAlpha': 'Przezroczystość nazw i masy',
        'virusStrokeSize': 'Grubość obwódki wirusów',
        "virusGlowSize": "Virus Glow Size",
        'teammatesIndColor': 'Wskaźnik gracza',
        'cursorTrackingColor': 'Śledzenie kursora',
        'splitRangeColor': 'Zasięg podziału',
        'qdsplitRange': 'Zasięg szybkiego podwójnego podziału', //Sonia2
        'sdsplitRange': 'Zasięg powolnego podwójnego podziału', //Sonia2
        'enemyBSTEDColor': 'Kolor W2STE wroga', //Sonia2
        'enemyBSTEColor': 'Kolor WSTE wroga', //Sonia2
        'enemyBColor': 'Kolor większego wroga', //Sonia2
        'enemySColor': 'Kolor mniejszego wroga', //Sonia2
        'enemySSTEColor': 'Kolor MSTE wroga', //Sonia2
        'enemySSTEDColor': 'Kolor M2STE wroga', //Sonia2
        'safeAreaColor': 'Bezpieczna strefa',
        'dangerAreaColor': 'Strefa zagrożenia',
        'ghostCellsColor': 'Duchy kulek',
        'ghostCellsAlpha': 'Przezroczystość duchów kulek',
        'menuTheming': 'Menu',
        'menuPreset': 'Motyw menu',
        'menuMainColor': 'Kolor główny',
        'menuBtnTextColor': 'Tekst przycisku',
        'menuPanelColor': 'Panel',
        'menuPanelColor2': 'Panel (2)',
        'menuTextColor': 'Tekst panelu',
        'menuTextColor2': 'Tekst panelu (2)',
        'btn1Color': 'Przycisk #1',
        'btn1Color2': 'Przycisk #1 (2)',
        'btn2Color': 'Przycisk #2',
        'btn2Color2': 'Przycisk #2 (2)',
        'btn3Color': 'Przycisk #3',
        'btn3Color2': 'Przycisk #3 (2)',
        'btn4Color': 'Przycisk #4',
        'btn4Color2': 'Przycisk #4 (2)',
        'menuBg': 'Grafika tła panelu',
        'menuOpacity': 'Przezroczystość',
        'hudTheming': 'HUD',
        'hudMainColor': 'Kolor główny',
        'hudColor': 'Tło',
        'hudTextColor': 'Tekst',
        'statsHudColor': 'Statystyki',
        'timeHudColor': 'Czas',
        'top5MassColor': 'Masa',
        'lbMeColor': 'Topka - ja',
        'lbTeammateColor': 'Topka - team',
        'hudFont': 'Czcionka HUD',
        'hudScale': 'Skala HUD',
        'chatTheming': 'Czat',
        'messageColor': 'Tło wiadomości',
        'messageTextColor': 'Tekst wiadomości',
        'messageTimeColor': 'Czas wiadomości',
        'messageNickColor': 'Nick wiadomości',
        'commandsColor': 'Tło komendy',
        'commandsTextColor': 'Tekst komendy',
        'commandsTimeColor': 'Czas komendy',
        'commandsNickColor': 'Nick komendy',
        'chatBoxColor': 'Tło czatboxu',
        'chatScale': 'Skala czatu',
        'miniMapTheming': 'Minimapa',
        'miniMapSectorsColor': 'Sektory',
        'miniMapSectorColor': 'Aktualny sektor',
        'miniMapGuidesColor': 'Prowadnice',
        'miniMapNickColor': 'Nick',
        'miniMapNickStrokeColor': 'Obwódka nicku',
        'miniMapMyCellColor': 'Moja kulka',
        'miniMapMyCellStrokeColor': 'Obwódka mojej kulki',
        'miniMapTeammatesColor': 'Gracze',
        'miniMapDeathLocationColor': 'Miejsce śmierci',
        'miniMapFont': 'Czcionka minimapy',
        'miniMapNickFont': 'Czcionka nicku',
        'miniMapWidth': 'Szerokość minimapy',
        'miniMapSectorsOpacity': 'Przezroczystość sektorów',
        'miniMapNickSize': 'Rozmiar nicku',
        'miniMapNickStrokeSize': 'Grubość obwódki nicku',
        'miniMapMyCellSize': 'Wielkość mojej kulki',
        'miniMapMyCellStrokeSize': 'Grubość obwódki mojej kulki',
        'miniMapTeammatesSize': 'Wielkość graczy',
        'miniMapGhostCellsColor': 'Duchy kulek',
        'miniMapGhostCellsAlpha': 'Przezroczystość duchów kulek',
        'imagesTheming': 'Grafika / kursory',
        'customBackground': 'Grafika tła',
        'customCursor': 'Grafika kursora',
        'hideChatMsgA': 'Czat został włączony!',
        'hideChatMsgB': 'Czat został ukryty!',
        'showSkinsMsgA': 'Skiny zostały włączone!',
        'showSkinsMsgB': 'Skiny zostały ukryte!',
        'hideSmallBotsMsgA': 'Małe boty stały się widoczne!',
        'hideSmallBotsMsgB': 'Małe boty zostały ukryte!',
        'autoRespMsgA': 'Auto odrodzenie zostało włączone!',
        'autoRespMsgB': 'Auto odrodzenie zostało wyłączone!',
        'autoZoomMsgA': 'Auto zoom został włączony!',
        'autoZoomMsgB': 'Auto zoom został wyłączony!',
        //                   'targetNotSet': 'Brak celu',
        'targetNotSet': '',
        'targetDead': 'Nie żyje',
        'targetDistance': 'Dystans',
        'targetMass': 'Masa razem',
        'totalPartyPlayers': '',
        'totalPartyMass': '',
        'exportImport': 'Eksport / import ustawień',
        'exportSettings': 'Eksportuj ustawienia',
        'exportInfo': 'Aby wyeksportować wybrane ustawienia skopiuj poniższy kod i zapisz go w pliku tekstowym z kodowaniem Unicode.',
        'importSettings': 'Importuj ustawienia',
        'importInfo': 'Aby zaimportować wybrane ustawienia wklej poniżej wyeksportowany wcześniej kod i naciśnij przycisk \"Importuj ustawienia\".',
        'profile': 'Profil',
        'profiles': 'Profile',
        'skins': 'Skiny',
        'moreSkins': 'Dodaj skiny',
        'thanks': 'Dzięki Awesome!',
        'saveSett': 'Zapisz ustawienia',
        'saved': 'Zapisano!',
        'resetSett': 'Resetuj ustawienia',
        'close': 'Zamknij',
        'enterChatMsg': 'Napisz wiadomość',
        'activeParties': 'Aktywne party',
        'noActiveParties': 'Brak aktywnych party ;(',
        'playlist': 'Playlista',
        'pause': 'PAUZA!',
        'visit': 'Odwiedź',
        'exit': 'Legend mod Express: Czy na pewno chcesz opuścic grę?',
        'blockWarn': 'UWAGA! Popupy zostały zablokowane w ustawieniach.',
        'unblockPopups': 'Odblokuj tymczasowo',
        'mass': 'Masa',
        'score': 'Top',
        'leaderboard': 'Topka',
        'user': 'Użytkownik',
        'userMuted': 'Użytkownik %user% został wyciszony.',
        'userUnmuted': 'Wyłączono wyciszenie użytkownika %user%.',
        'mute': 'Wycisz',
        'unmute': 'Wyłącz wyciszenie',
        'mutedUsers': 'Wyciszeni użytkownicy',
        'activeUsers': 'Aktywni użytkownicy',
        'showActiveUsers': 'Pokaż aktywnych użytkowników',
        'none': 'Brak',
        'sounds': 'Dźwięki',
        'page_back_button': 'Wróć',
        'page_create_party': 'Stwórz party',
        'page_join_party': 'Dołącz',
        'page_login_and_play': 'Zaloguj',
        'page_logout': 'Wyloguj',
        'page_menu_login_facebook': 'Zaloguj z Facebook',
        'page_menu_login_google': 'Zaloguj z Google',
        'page_menu_main_free_coins': 'Darmowe Monety',
        'page_menu_main_gifts': 'Prezenty',
        'page_menu_main_dailyquests': 'Zadania',
        'page_party_join_error': 'Nie można dołączyć do tego party. Upewnij się, że token jest prawidłowy lub stwórz nowy.',
        'page_play': 'Graj',
        'page_play_as_guest': 'Graj jako gość',
        'page_shop': 'Sklep',
        'page_spectate': 'Obserwuj',
        'page_stats': 'Statystyki',
		"teamView": 'Team view (BETA)'
    },
    'en': {
        'start': 'Home',
        'settings': 'Settings',
        'restoreSettings': 'Restore default settings',
        'animationGroup': 'Animation',
        'graphics': 'Graphics',
        'zoomGroup': 'Zoom',
        'respGroup': 'Respawn',
        'namesGroup': 'Names',
        'massGroup': 'Mass',
        'skinsGroup': 'Skins',
        'foodGroup': 'Food',
        'transparencyGroup': 'Transparency / colors',
        'gridGroup': 'Grid / sectors',
        'miniMapGroup': 'Minimap',
        'helpersGroup': 'Helpers',
        'mouseGroup': 'Mouse control',
        'hudGroup': 'HUD',
        'chatGroup': 'Chat',
        'statsGroup': 'Stats',
        'extrasGroup': 'Extras',
        'macroGroup': 'Macros',
        'noSkins': 'No skins',
        'noNames': 'No names',
        'noColors': 'No colors',
        'showMass': 'Show mass',
        'skipStats': 'Skip stats after death',
        'showQuest': 'Show quest',
        'autoZoom': 'Auto zoom',
        'animation': 'Animation delay',
        'macroFeeding': 'Macro feed (ms)',
        'suckAnimation': 'Cell Eat [Sucking] Animation',
        'virusGlow': 'Virus Glow',
        'borderGlow': 'Border Glow',
        'zoomSpeedValue2': 'Zoom speed',
        'quickResp': 'Quick respawn (hotkey)',
        'autoResp': 'Auto respawn',
        'autoHideCellsInfo': 'Auto hide names and mass',
        'autoHideNames': 'Auto hide names',
        'autoHideMass': 'Auto hide mass',
        'autoHideFood': 'Auto hide food - mass',
        'autoHideFoodOnZoom': 'Auto hide food - zoom',
        'optimizedNames': 'Optimized names',
        'hideMyName': 'Hide my name',
        'hideTeammatesNames': 'Hide teammates names',
        'optimizedMass': 'Optimized mass (+/-2%) & Merge timer BETA off\r\n Suggested to be enabled for Lag reduce',
        'shortMass': 'Short mass (k)',
        'virMassShots': 'Virus shots',
        'hideMyMass': 'Hide my mass',
        'hideEnemiesMass': 'Hide enemies mass',
        'vanillaSkins': 'Vanilla skins',
        'customSkins': 'Custom skins',
        'videoSkins': 'Video skins (.mp4 .webm .ogv)',
        'videoSkinsMusic': 'Sound from other\'s Video skins when both C3',
        'myTransparentSkin': 'My transparent skin',
        'myCustomColor': 'My custom color',
        'transparentCells': 'Transparent cells',
        'transparentViruses': 'Transparent viruses',
        'transparentSkins': 'Transparent skins',
        'showGrid': 'Show grid',
        'showBgSectors': 'Show background sectors',
        'showMapBorders': 'Show map borders',
        'showGhostCells': 'Ghost cells (fps drop)',
        'showGhostCellsInfo': 'Ghost cells info (confusing)',
        'showPartyBots': 'Party bots',
        'rotateMap': 'Rotate Map',
        'showMiniMap': 'Show minimap',
        'showMiniMapGrid': 'Show minimap grid',
        'showMiniMapGuides': 'Show minimap guides',
        'showExtraMiniMapGuides': 'Show extra minimap guides',
        'showMiniMapGhostCells': 'Show ghost cells',
        'oneColoredTeammates': 'One-colored teammates',
        'optimizedFood': 'Optimized food',
        'rainbowFood': 'Rainbow food',
        'oppColors': 'Opponents colors',
        'oppRings': 'Opponents rings',
        'virColors': 'Viruses colors',
        'splitRange': 'Split range',
        'qdsplitRange': 'Quick double split range', //Sonia2
        'sdsplitRange': 'Slow double split range', //Sonia2
        'virusesRange': 'Viruses range',
        'textStroke': 'Names and mass stroke',
        'namesStroke': 'Names stroke',
        'massStroke': 'Mass stroke',
        'cursorTracking': 'Cursor tracking',
        'teammatesInd': 'Teammates indicators',
        'mouseSplit': 'LMB - Mouse split',
        'mouseFeed': 'RMB - Mouse feed',
        'mouseInvert': 'Invert mouse buttons',
        'disableChat': 'Disable chat',
        'hideChat': 'Hide chat',
        'chatSounds': 'Sound notifications',
        'chatEmoticons': 'Emoticons',
        'showChatImages': 'Show images on chat',
        'showChatVideos': 'Show videos on chat',
        'showChatBox': 'Chatbox instead of popups',
        'hidecountry': 'Hide my country',
        'messageSound': 'Message notification sound',
        'commandSound': 'Command notification sound',
        'virusSoundurl': 'Virus shot sound',
        'virusSound': 'Virus shot sound',
        'jellyPhisycs': 'Jelly physics',
        'showTop5': 'Show teamboard',
        'showTargeting': 'Show targeting',
        'showTime': 'Show current time',
        'showLbData': 'Show leaderboard mass',
        'normalLb': '\"Leaderboard\" header',
        'centeredLb': 'Centered leaderboard',
        'fpsAtTop': 'Game stats at the top',
		'tweenMaxEffect': 'Tween max effect',
        'showStats': 'Show game stats',
        'showStatsMass': 'Game stats: Mass',
        'showStatsESTE': 'Game stats: Enemy\'s STE',
        'showStatsEMTE': 'Game stats: Enemy\'s MTE',
        'showStatsMTE': 'Game stats: Our MTE',
        'showStatsSTE': 'Game stats: Our STE',
        'showStatsTTE': 'Game stats: Minimal tricksplit teammate\'s mass',
        'showStatsPTE': 'Game stats: Maximal enemy\'s mass for presplit',
        'showStatsN16': 'Game stats: n/16',
        'showStatsFPS': 'Game stats: FPS',
        'blockPopups': 'Block popups (ads/shop/quest)',
        'hotkeys': 'Hotkeys',
        'hk-inst-assign': 'To assign a hotkey click on the input field and press your chosen key.',
        'hk-inst-delete': 'To delete a hotkey click on the input field and press the DELETE key.',
        'hk-inst-keys': 'Possible key combinations with the CTRL and ALT keys.',
        'hk-bots-split': 'Bots split',
        'hk-bots-feed': 'Bots feed',
        'hk-bots-ai': 'Bots AI toggle',
        'hk-feed': 'Feed',
        'hk-macroFeed': 'Macro feed',
        'hk-split': 'Split',
        'hk-doubleSplit': 'Double split',
        'hk-split16': 'Split 16',
        'hk-pause': 'Cell pause',
        'hk-showTop5': 'Show/hide teamboard',
        'hk-showTime': 'Show/hide current time',
        'hk-showSplitRange': 'Show/hide split range',
        'hk-showSplitInd': 'Show/hide split indicators',
        'hk-showTeammatesInd': 'Show/hide teammates indicators',
        'hk-showOppColors': 'Show/hide opponents colors',
        'hk-toggleSkins': 'Toggle skins (custom/default)',
        'hk-showSkins': 'Show/hide skins',
        'hk-transparentSkins': 'Toggle transparent skins',
        'hk-showStats': 'Show/hide game stats',
        'hk-toggleCells': 'Toggle own cells (smallest/biggest)',
        'hk-showFood': 'Show/hide food',
        'hk-showGrid': 'Show/hide grid',
        'hk-showMiniMapGuides': 'Show/hide minimap guides',
        'hk-hideChat': 'Show/hide chat',
        'hk-showHUD': 'Show/hide HUD',
        'hk-copyLb': 'Copy leaderboard',
        'hk-showLb': 'Show/hide leaderboard',
        'hk-toggleAutoZoom': 'Toggle auto zoom',
        'hk-resetZoom': 'Reset zoom',
        'hk-zoomLevel': 'Zoom level',
        'hk-toggleDeath': 'Toggle death location',
        'hk-clearChat': 'Show chat history / Clear chat',
        'hk-showBgSectors': 'Show/hide background sectors',
        'hk-hideBots': 'Show/hide small bots',
        'hk-showNames': 'Show/hide names',
        'hk-hideTeammatesNames': 'Show/hide teammates names',
        'hk-showMass': 'Show/hide mass',
        'hk-showMiniMap': 'Show/hide minimap',
        'hk-chatMessage': 'Enter chat message',
        'hk-quickResp': 'Quick respawn',
        'hk-autoResp': 'Toggle auto respawn',
        'hk-switchServerMode': 'Switch server [public/private]',
        'hk-showTargeting': 'Show/hide targeting panel',
        'hk-voiceChat': 'Voice to text',
        'hk-GhostCellsInfo': ' Show ghost cells information',
        'hk-Autoplay': 'Auto Play',
        'hk-setTargeting': 'Start/stop targeting (following)',
        'hk-cancelTargeting': 'Cancel targeting',
        'hk-changeTarget': 'Change target',
        'hk-privateMiniMap': 'Show target on the minimap',
        'hk-showQuest': 'Show/hide quest',
        'commands': 'Commands',
        'comm1': 'Feed me!',
        'comm2': 'Split into me!',
        'comm3': 'Need backup at %currentSector%!',
        'comm4': 'Enemy spotted at %currentSector%!',
        'comm5': 'Need a teammate!',
        'comm6': 'Tank the virus!',
        'comm7': 'Eat the virus!',
        'comm8': 'Let\'s bait!',
        'comm9': 'Fake tricksplit!',
        'comm0': 'Fuck!',
        'comm10': 'Tricksplit!',
        'comm11': 'Left!',
        'comm12': 'Up!',
        'comm13': 'Right!',
        'comm14': 'Bottom!',
        'comm15': 'Fake Tricksplit',
        'comm16': 'Popsplit',
        'comm17': 'Double Popsplit',
        'comm18': 'Reversed Tricksplit',
        'comm19': 'Canonsplit',
        'comm20': 'Reversed Canonsplit',
        'comm21': 'Bowlingsplit',
        'comm22': 'Auto feed trick',
        'comm23': 'Pause',
        'comm24': 'ANTI alarm stage 1',
        'comm25': 'ANTI alarm stage 2',
        'comm26': 'ANTI alarm stage 3',
        'comm27': 'ANTI alarm stage 4',
        'comm28': 'ANTI alarm stage 5',
        'comm29': 'Presplit',
        'comm30': 'Party Run tricks',
        'saveComm': 'Save commands',
        'theme': 'Theme',
        'restoreThemeSettings': 'Restore theme default settings',
        'basicTheming': 'Basic theming',
        'themePreset': 'Theme preset',
        'themeType': 'Theme type',
        'darkTheme': 'Dark theme',
        'lightTheme': 'Light theme',
        'mainColor': 'Main color',
        'bgColor': 'Background',
        'bordersColor': 'Map borders',
        'gridColor': 'Grid',
        'sectorsColor': 'Sectors font',
        'namesColor': 'Names',
        'namesStrokeColor': 'Names stroke',
        'massColor': 'Mass',
        'massStrokeColor': 'Mass stroke',
        'virusColor': 'Virus',
        'virusStrokeColor': 'Virus stroke',
        'virusGlowColor': "Virus Glow",
        "borderGlowColor": "Border Glow",
        'mVirusColor': 'Mothercell',
        'mVirusStrokeColor': 'Mothercell stroke',
        'virusGlowSize': 'Virus Glow Size',
        'borderGlowSize': 'Border Glow Size',
        'foodColor': 'Food',
        'namesFont': 'Names font',
        'massFont': 'Mass font',
        'sectorsFont': 'Sectors font',
        'namesScale': 'Names scale',
        'massScale': 'Mass scale',
        'virMassScale': 'Virus mass scale',
        'strokeScale': 'Text stroke scale',
        'foodSize': 'Food size',
        'bordersWidth': 'Map borders width',
        'sectorsWidth': 'Sectors grid width',
        'sectorsFontSize': 'Sectors font size',
		'sectorsX': 'Sectors X',
		'sectorsY': 'Sectors Y',			
        'cellsAlpha': 'Cells transparency',
        'skinsAlpha': 'Skins transparency',
        'virusAlpha': 'Virus transparency',
        'textAlpha': 'Names & mass transparency',
        'virusStrokeSize': 'Virus stroke size',
        "virusGlowSize": "Virus Glow Size",
        'teammatesIndColor': 'Teammate indicator',
        'cursorTrackingColor': 'Cursor tracking',
        'splitRangeColor': 'Split range',
        'enemyBSTEDColor': 'B2STE Enemy Color', //Sonia2
        'enemyBSTEColor': 'BSTE Enemy Color', //Sonia2
        'enemyBColor': 'Bigger Enemy Color', //Sonia2
        'enemySColor': 'Smaller Enemy Color', //Sonia2
        'enemySSTEColor': 'SSTE Enemy Color', //Sonia2
        'enemySSTEDColor': 'S2STE Enemy Color', //Sonia2
        'safeAreaColor': 'Safe area',
        'dangerAreaColor': 'Danger area',
        'ghostCellsColor': 'Ghost cells',
        'ghostCellsAlpha': 'Ghost cells transparency',
        'menuTheming': 'Menu',
        'menuPreset': 'Menu theme',
        'menuMainColor': 'Main color',
        'menuBtnTextColor': 'Button text',
        'menuPanelColor': 'Panel',
        'menuPanelColor2': 'Panel (2)',
        'menuTextColor': 'Panel text',
        'menuTextColor2': 'Panel text (2)',
        'btn1Color': 'Button #1',
        'btn1Color2': 'Button #1 (2)',
        'btn2Color': 'Button #2',
        'btn2Color2': 'Button #2 (2)',
        'btn3Color': 'Button #3',
        'btn3Color2': 'Button #3 (2)',
        'btn4Color': 'Button #4',
        'btn4Color2': 'Button #4 (2)',
        'menuBg': 'Panel background image',
        'menuOpacity': 'Transparency',
        'hudTheming': 'HUD',
        'hudMainColor': 'Main color',
        'hudColor': 'Background',
        'hudTextColor': 'Text',
        'statsHudColor': 'Stats',
        'timeHudColor': 'Time',
        'top5MassColor': 'Mass',
        'lbMeColor': 'Leaderboard - me',
        'lbTeammateColor': 'Leaderboard - teammate',
        'hudFont': 'HUD font',
        'hudScale': 'HUD scale',
        'chatTheming': 'Chat',
        'messageColor': 'Message background',
        'messageTextColor': 'Message text',
        'messageTimeColor': 'Message time',
        'messageNickColor': 'Message nick',
        'commandsColor': 'Command background',
        'commandsTextColor': 'Command text',
        'commandsTimeColor': 'Command time',
        'commandsNickColor': 'Command nick',
        'chatBoxColor': 'Chatbox color',
        'chatScale': 'Chat scale',
        'miniMapTheming': 'Minimap',
        'miniMapSectorsColor': 'Sectors',
        'miniMapSectorColor': 'Current sector',
        'miniMapGuidesColor': 'Guides',
        'miniMapNickColor': 'Nick',
        'miniMapNickStrokeColor': 'Nick stroke',
        'miniMapMyCellColor': 'My cell',
        'miniMapMyCellStrokeColor': 'My cell stroke',
        'miniMapTeammatesColor': 'Teammates',
        'miniMapDeathLocationColor': 'Death location',
        'miniMapFont': 'Minimap font',
        'miniMapNickFont': 'Nick font',
        'miniMapWidth': 'Minimap width',
        'miniMapSectorsOpacity': 'Sectors transparency',
        'miniMapNickSize': 'Nick size',
        'miniMapNickStrokeSize': 'Nick stroke size',
        'miniMapMyCellSize': 'My cell size',
        'miniMapMyCellStrokeSize': 'My cell stroke size',
        'miniMapTeammatesSize': 'Teammates size',
        'miniMapGhostCellsColor': 'Ghost cells',
        'miniMapGhostCellsAlpha': 'Ghost cells transparency',
        'imagesTheming': 'Graphics / cursors',
        'customBackground': 'Custom background image',
        'customCursor': 'Custom cursor image',
        'hideChatMsgA': 'Chat is visible!',
        'hideChatMsgB': 'Chat is hidden!',
        'showSkinsMsgA': 'Skins are visible!',
        'showSkinsMsgB': 'Skins are hidden!',
        'hideSmallBotsMsgA': 'Small bots are visible!',
        'hideSmallBotsMsgB': 'Small bots are hidden!',
        'autoRespMsgA': 'Auto respawn is on!',
        'autoRespMsgB': 'Auto respawn is off!',
        'autoZoomMsgA': 'Auto zoom is on!',
        'autoZoomMsgB': 'Auto zoom is off!',
        'targetNotSet': '',
        'targetDead': 'Dead',
        'targetDistance': 'Distance',
        'targetMass': 'Total Mass',
        'totalPartyPlayers': '',
        'totalPartyMass': '',
        'exportImport': 'Export / import settings',
        'exportSettings': 'Export settings',
        'exportInfo': 'To export selected settings copy the code below and save it to a text file encoded in Unicode.',
        'importSettings': 'Import settings',
        'importInfo': 'To import selected settings paste an exported code below and press the \"Import settings\" button.',
        'profile': 'Profile',
        'profiles': 'Profiles',
        'skins': 'Skins',
        'moreSkins': 'Add skins',
        'thanks': 'Thanks to Awesome!',
        'saveSett': 'Save settings',
        'saved': 'Saved!',
        'resetSett': 'Reset to default',
        'close': 'Close',
        'enterChatMsg': 'Enter chat message',
        'activeParties': 'Active parties',
        'noActiveParties': 'No active parties ;(',
        'playlist': 'Playlist',
        'pause': 'PAUSE!',
        'visit': 'Visit',
        'exit': 'Legend mod Express: Are you sure you want to quit the game?',
        'blockWarn': 'WARNING! Popups are blocked in the settings.',
        'unblockPopups': 'Temporary unblock',
        'mass': 'Mass',
        'score': 'Score',
        'leaderboard': 'Leaderboard',
        'user': 'User',
        'userMuted': 'User %user% has been muted.',
        'userUnmuted': 'User %user% has been unmuted.',
        'mute': 'Mute',
        'unmute': 'Unmute',
        'mutedUsers': 'Muted users',
        'activeUsers': 'Active users',
        'showActiveUsers': 'Show active users',
        'none': 'None',
        'sounds': 'Sounds',
        'page_menu_main_free_coins': 'Free Coins',
        'page_menu_main_gifts': 'Gifts',
        'page_menu_main_dailyquests': 'Daily Quest',
        'page_shop': 'Shop',
		"teamView": 'Team view (BETA)'
    }
}
var themePresets = {
    'ogario-v3': {
        'name': 'OGARio v3',
        'darkTheme': true,
        'mainColor': '#01d9cc',
        'bgColor': '#000a11',
        'bordersColor': '#01d9cc',
        'gridColor': '#00243e',
        'sectorsColor': '#00243e',
        'namesColor': '#ffffff',
        'namesStrokeColor': '#000000',
        'massColor': '#ffffff',
        'massStrokeColor': '#000000',
        'virusColor': '#002f52',
        'virusStrokeColor': '#00b9e8',
        'virusGlowColor': '#fff',
        'mVirusColor': '#ce6363',
        'mVirusStrokeColor': '#b95959',
        'foodColor': '#5000ff',
        'teammatesIndColor': '#ffffff',
        'cursorTrackingColor': '#ffffff',
        'splitRangeColor': '#ffffff',
        'enemyBSTEDColor': '#8000ff', //Sonia2
        'enemyBSTEColor': '#BE00FF', //Sonia2
        'enemyBColor': '#FF0A00', //Sonia2
        'enemySColor': '#00C8FF', //Sonia2
        'enemySSTEColor': '#048245', //Sonia2
        'enemySSTEDColor': '#64FF00', //Sonia2
        'safeAreaColor': '#ffffff',
        'dangerAreaColor': '#bf00aa',
        'namesFont': 'ubuntu-bold',
        'massFont': 'ubuntu-bold',
        'sectorsFont': 'ubuntu',
        'namesScale': 1,
        'massScale': 3,
        'foodSize': 5,
        'bordersWidth': 40,
        'sectorsWidth': 40,
        'sectorsFontSize': 1200,
        'cellsAlpha': 0.99,
        'skinsAlpha': 0.99,
        'virusAlpha': 0.25,
        'textAlpha': 1,
        'virusStrokeSize': 20,
        "virusGlowSize": "#fff",
        "virusGlowSize": 14,
        "borderGlowSize": 14,
        'menuPreset': 'ogario-v3',
        'graphics': 'high',
        'menuMainColor': '#01d9cc',
        'menuBtnTextColor': '#ffffff',
        'menuPanelColor': '#00243e',
        'menuPanelColor2': '#002f52',
        'menuTextColor': '#ffffff',
        'menuTextColor2': '#8096a7',
        'btn1Color': '#018cf6',
        'btn1Color2': '#0176ce',
        'btn2Color': '#00b9e8',
        'btn2Color2': '#0099c0',
        'btn3Color': '#8d5fe6',
        'btn3Color2': '#814ee3',
        'btn4Color': '#bf00aa',
        'btn4Color2': '#a80096',
        'menuBg': 'https://legendmod.ml/banners/static/img/pattern.png',
        'menuOpacity': 0.96,
        'hudMainColor': '#01d9cc',
        'hudColor': 'rgba(0,0,0,0.4)',
        'hudTextColor': '#ffffff',
        'statsHudColor': '#ffffff',
        'timeHudColor': '#01d9cc',
        'top5MassColor': '#bf00aa',
        'lbMeColor': '#bf00aa',
        'lbTeammateColor': '#018cf6',
        'hudFont': 'ubuntu-bold',
        'hudScale': 1,
        'messageColor': 'rgba(0,0,0,0.4)',
        'messageTextColor': '#ffffff',
        'messageTimeColor': '#018cf6',
        'messageNickColor': '#01d9cc',
        'commandsColor': 'rgba(191,0,170,0.9)',
        'commandsTextColor': '#ffffff',
        'commandsTimeColor': '#bf00aa',
        'commandsNickColor': '#ffffff',
        'chatBoxColor': 'rgba(0,0,0,0.4)',
        'chatScale': 1,
        'miniMapSectorsColor': '#ffffff',
        'miniMapSectorColor': '#01d9cc',
        'miniMapGuidesColor': '#bf00aa',
        'miniMapNickColor': '#ffffff',
        'miniMapNickStrokeColor': '#000000',
        'miniMapMyCellColor': '#ffffff',
        'miniMapMyCellStrokeColor': '#bf00aa',
        'miniMapTeammatesColor': '#01d9cc',
        'miniMapDeathLocationColor': '#bf00aa',
        'miniMapFont': 'ubuntu-bold',
        'miniMapNickFont': 'ubuntu-bold',
        'miniMapWidth': 240,
        'miniMapSectorsOpacity': 0.1,
        'miniMapNickSize': 11,
        'miniMapNickStrokeSize': 2,
        'miniMapMyCellSize': 7.5,
        'miniMapMyCellStrokeSize': 4,
        'miniMapTeammatesSize': 5.5,
        'customBackground': '',
        'customCursor': 'https://legendmod.ml/cursors/cursor_02.cur'
    },
    'ogario-orange': {
        'name': 'OGARio v2',
        'darkTheme': true,
        'mainColor': '#ff7800',
        'bgColor': '#111111',
        'bordersColor': '#ff7800',
        'gridColor': '#292929',
        'sectorsColor': '#292929',
        'namesColor': '#ffffff',
        'namesStrokeColor': '#000000',
        'massColor': '#ffffff',
        'massStrokeColor': '#000000',
        'virusColor': '#666666',
        'virusStrokeColor': '#666666',
        'mVirusColor': '#ce6363',
        'mVirusStrokeColor': '#b95959',
        'foodColor': '#e16400',
        'hudMainColor': '#ff7800',
        'statsHudColor': '#ff7800',
        'top5MassColor': '#ff7800',
        'timeHudColor': '#ff7800',
        'messageNickColor': '#ff7800',
        'commandsColor': 'rgba(255,120,0,0.9)',
        'commandsTimeColor': '#ff7800',
        'commandsTextColor': '#ffffff',
        'miniMapSectorsColor': '#ffffff',
        'miniMapSectorColor': '#ff7800',
        'miniMapGuidesColor': '#ff7800',
        'miniMapMyCellColor': '#ffffff',
        'miniMapMyCellStrokeColor': '#ff7800',
        'miniMapTeammatesColor': '#ff7800',
        'miniMapDeathLocationColor': '#ff7800',
        'miniMapSectorsOpacity': 0.1
    },
    'ogario-gold': {
        'name': 'OGARio LE',
        'darkTheme': true,
        'mainColor': '#b5a642',
        'bgColor': '#000000',
        'bordersColor': '#b5a642',
        'gridColor': '#111111',
        'sectorsColor': '#111111',
        'namesColor': '#ffffff',
        'namesStrokeColor': '#000000',
        'massColor': '#ffffff',
        'massStrokeColor': '#000000',
        'virusColor': '#666666',
        'virusStrokeColor': '#666666',
        'mVirusColor': '#ce6363',
        'mVirusStrokeColor': '#b95959',
        'foodColor': '#998c36',
        'hudMainColor': '#b5a642',
        'statsHudColor': '#b5a642',
        'top5MassColor': '#b5a642',
        'timeHudColor': '#b5a642',
        'messageNickColor': '#b5a642',
        'commandsColor': 'rgba(181,166,66,0.9)',
        'commandsTimeColor': '#b5a642',
        'commandsTextColor': '#ffffff',
        'miniMapSectorsColor': '#ffffff',
        'miniMapSectorColor': '#b5a642',
        'miniMapGuidesColor': '#b5a642',
        'miniMapMyCellColor': '#ffffff',
        'miniMapMyCellStrokeColor': '#b5a642',
        'miniMapTeammatesColor': '#b5a642',
        'miniMapDeathLocationColor': '#b5a642',
        'miniMapSectorsOpacity': 0.1
    },
    'sniikz-style': {
        'name': 'SniiKz\'s Style',
        'darkTheme': true,
        'mainColor': '#01d9cc',
        'bgColor': '#000000',
        'bordersColor': '#ffffff',
        'gridColor': '#00243e',
        'sectorsColor': '#00243e',
        'namesColor': '#ffffff',
        'namesStrokeColor': '#000000',
        'massColor': '#ffffff',
        'massStrokeColor': '#000000',
        'virusColor': '#3b3b3b',
        'virusStrokeColor': '#ffffff',
        'mVirusColor': '#ce6363',
        'mVirusStrokeColor': '#b95959',
        'foodColor': '#5000ff',
        'teammatesIndColor': '#ffffff',
        'cursorTrackingColor': '#ffffff',
        'splitRangeColor': '#ffffff',
        'safeAreaColor': '#ffffff',
        'dangerAreaColor': '#bf00aa',
        'massScale': 4,
        'foodSize': 1,
        'bordersWidth': 40,
        'sectorsWidth': 40,
        'sectorsFontSize': 1200,
        'cellsAlpha': 0.99,
        'skinsAlpha': 0.99,
        'virusAlpha': 0.4,
        'virusStrokeSize': 10,
        "virusStrokeSize": 20,
        "virusGlowSize": 14,
        "borderGlowSize": 14,
        'menuPreset': 'ogario-v3',
        'graphics': 'high',
        'menuMainColor': '#fc0079',
        'menuBtnTextColor': '#ffffff',
        'menuPanelColor': '#050008',
        'menuPanelColor2': '#1d0526',
        'menuTextColor': '#ffffff',
        'menuTextColor2': '#65458f',
        'btn1Color': '#4f0242',
        'btn1Color2': '#3b0431',
        'btn2Color': '#6b0036',
        'btn2Color2': '#4d0227',
        'btn3Color': '#aa084e',
        'btn3Color2': '#80063b',
        'btn4Color': '#aa084e',
        'btn4Color2': '#8a063f',
        'menuBg': 'https://legendmod.ml/banners/static/img/pattern.png',
        'menuOpacity': 1,
        'hudMainColor': '#5974ff',
        'hudColor': 'rgba(36,36,36,0.49)',
        'hudTextColor': '#ffffff',
        'statsHudColor': '#ffffff',
        'timeHudColor': '#737373',
        'top5MassColor': '#1fe000',
        'lbMeColor': '#bf00aa',
        'lbTeammateColor': '#018cf6',
        'hudScale': 1.15,
        'messageColor': 'rgba(0,0,0,0.4)',
        'messageTextColor': '#e8e8e8',
        'messageTimeColor': '#545454',
        'messageNickColor': '#05ff00',
        'commandsColor': 'rgba(36,36,36,0.9)',
        'commandsTextColor': '#ffffff',
        'commandsTimeColor': '#545454',
        'commandsNickColor': '#ffffff',
        'chatBoxColor': 'rgba(0,0,0,0.4)',
        'chatScale': 1,
        'miniMapSectorsColor': '#ffffff',
        'miniMapSectorColor': '#000000',
        'miniMapGuidesColor': '#ff00a8',
        'miniMapNickColor': '#ffffff',
        'miniMapNickStrokeColor': '#4d4d4d',
        'miniMapMyCellColor': '#f0ff3d',
        'miniMapMyCellStrokeColor': '#acba07',
        'miniMapTeammatesColor': '#305eff',
        'miniMapDeathLocationColor': '#2b2b2b',
        'miniMapWidth': 250,
        'miniMapSectorsOpacity': 0.1,
        'miniMapNickSize': 9,
        'miniMapNickStrokeSize': 0,
        'miniMapMyCellSize': 5,
        'miniMapMyCellStrokeSize': 0,
        'miniMapTeammatesSize': 5,
        'customBackground': '',
        'customCursor': 'https://legendmod.ml/cursors/cursor_01.cur'
    },
    'hkg-style': {
        'name': 'HKG Style',
        'darkTheme': true,
        'mainColor': '#651fff',
        'bgColor': '#000000',
        'bordersColor': '#ffffff',
        'gridColor': '#111111',
        'sectorsColor': '#111111',
        'namesColor': '#ffffff',
        'namesStrokeColor': '#000000',
        'massColor': '#ffffff',
        'massStrokeColor': '#000000',
        'virusColor': '#666666',
        'virusStrokeColor': '#666666',
        'mVirusColor': '#ce6363',
        'mVirusStrokeColor': '#b95959',
        'foodColor': '#651fff',
        'hudMainColor': '#651fff',
        'statsHudColor': '#651fff',
        'top5MassColor': '#651fff',
        'timeHudColor': '#651fff',
        'messageNickColor': '#651fff',
        'commandsColor': 'rgba(101,31,255,0.9)',
        'commandsTimeColor': '#651fff',
        'commandsTextColor': '#ffffff',
        'miniMapSectorsColor': '#ffffff',
        'miniMapSectorColor': '#651fff',
        'miniMapGuidesColor': '#651fff',
        'miniMapMyCellColor': '#ffffff',
        'miniMapMyCellStrokeColor': '#651fff',
        'miniMapTeammatesColor': '#651fff',
        'miniMapDeathLocationColor': '#651fff',
        'miniMapSectorsOpacity': 0.1
    },
    'agario-light': {
        'name': 'Agar.io Light',
        'darkTheme': false,
        'mainColor': '#ffffff',
        'bgColor': '#f2fbff',
        'bordersColor': '#858a8c',
        'gridColor': '#ced6d9',
        'sectorsColor': '#ced6d9',
        'namesColor': '#ffffff',
        'namesStrokeColor': '#000000',
        'massColor': '#ffffff',
        'massStrokeColor': '#000000',
        'virusColor': '#33ff33',
        'virusStrokeColor': '#2de52d',
        'mVirusColor': '#ce6363',
        'mVirusStrokeColor': '#b95959',
        'foodColor': '#2de52d',
        'hudMainColor': '#ffffff',
        'statsHudColor': '#ffffff',
        'top5MassColor': '#ffffff',
        'timeHudColor': '#ffffff',
        'messageNickColor': '#ffffff',
        'commandsColor': 'rgba(255,255,255,0.9)',
        'commandsTimeColor': '#ffffff',
        'commandsTextColor': '#000000',
        'miniMapSectorsColor': '#ffffff',
        'miniMapSectorColor': '#ffffff',
        'miniMapGuidesColor': '#ffffff',
        'miniMapMyCellColor': '#ffffff',
        'miniMapMyCellStrokeColor': '#ffffff',
        'miniMapTeammatesColor': '#ffffff',
        'miniMapDeathLocationColor': '#ffffff',
        'miniMapSectorsOpacity': 0.25
    },
    'agario-dark': {
        'name': 'Agar.io Dark',
        'darkTheme': true,
        'mainColor': '#ffffff',
        'bgColor': '#111111',
        'bordersColor': '#999999',
        'gridColor': '#333333',
        'sectorsColor': '#333333',
        'namesColor': '#ffffff',
        'namesStrokeColor': '#000000',
        'massColor': '#ffffff',
        'massStrokeColor': '#000000',
        'virusColor': '#33ff33',
        'virusStrokeColor': '#2de52d',
        'mVirusColor': '#ce6363',
        'mVirusStrokeColor': '#b95959',
        'foodColor': '#2de52d',
        'hudMainColor': '#ffffff',
        'statsHudColor': '#ffffff',
        'top5MassColor': '#ffffff',
        'timeHudColor': '#ffffff',
        'messageNickColor': '#ffffff',
        'commandsColor': 'rgba(255,255,255,0.9)',
        'commandsTimeColor': '#ffffff',
        'commandsTextColor': '#ffffff',
        'miniMapSectorsColor': '#ffffff',
        'miniMapSectorColor': '#ffffff',
        'miniMapGuidesColor': '#ffffff',
        'miniMapMyCellColor': '#ffffff',
        'miniMapMyCellStrokeColor': '#ffffff',
        'miniMapTeammatesColor': '#ffffff',
        'miniMapDeathLocationColor': '#ffffff',
        'miniMapSectorsOpacity': 0.1
    }
}
var themeMenus = {
    'ogario-v3': {
        'name': 'OGARio v3',
        'menuMainColor': '#01d9cc',
        'menuBtnTextColor': '#ffffff',
        'menuPanelColor': '#00243e',
        'menuPanelColor2': '#002f52',
        'menuTextColor': '#ffffff',
        'menuTextColor2': '#8096a7',
        'btn1Color': '#018cf6',
        'btn1Color2': '#0176ce',
        'btn2Color': '#00b9e8',
        'btn2Color2': '#0099c0',
        'btn3Color': '#8d5fe6',
        'btn3Color2': '#814ee3',
        'btn4Color': '#f300d8',
        'btn4Color2': '#df00c6',
        'menuBg': 'https://legendmod.ml/banners/static/img/pattern.png'
    },
    'ogario-v2': {
        'name': 'OGARio v2',
        'menuMainColor': '#ff7800',
        'menuBtnTextColor': '#ffffff',
        'menuPanelColor': '#222222',
        'menuPanelColor2': '#333333',
        'menuTextColor': '#bbbbbb',
        'menuTextColor2': '#bbbbbb',
        'btn1Color': '#428bca',
        'btn1Color2': '#3071a9',
        'btn2Color': '#5cb85c',
        'btn2Color2': '#449d44',
        'btn3Color': '#f0ad4e',
        'btn3Color2': '#ec971f',
        'btn4Color': '#d9534f',
        'btn4Color2': '#c9302c',
        'menuBg': ''
    },
    'agario': {
        'name': 'Agar.io',
        'menuMainColor': '#5bc0de',
        'menuBtnTextColor': '#ffffff',
        'menuPanelColor': '#ffffff',
        'menuPanelColor2': '#cccccc',
        'menuTextColor': '#333333',
        'menuTextColor2': '#999999',
        'btn1Color': '#428bca',
        'btn1Color2': '#3071a9',
        'btn2Color': '#5cb85c',
        'btn2Color2': '#449d44',
        'btn3Color': '#f0ad4e',
        'btn3Color2': '#ec971f',
        'btn4Color': '#d9534f',
        'btn4Color2': '#c9302c',
        'menuBg': ''
    }
}
var graphicMenus = {
    'high': {
        'name': 'High'
    },
    'medium': {
        'name': 'Medium'
    },
    'low': {
        'name': 'Low'
    },
    'very_low': {
        'name': 'Very Low'
    }
}
var escapeHTMLs = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#39;',
    '/': '&#x2F;'
}
var defaultSettings = {
    'preset': 'ogario-v3',
    'darkTheme': true,
    'mainColor': '#01d9cc',
    'bgColor': '#000a11',
    'bordersColor': '#d90101',
    "borderGlowColor": "#ffffff",
    'gridColor': '#00243e',
    'sectorsColor': '#00243e',
    'namesColor': '#ffffff',
    'namesStrokeColor': '#000000',
    'massColor': '#ffffff',
    'massStrokeColor': '#000000',
    'virusColor': '#327a19',
    'virusStrokeColor': '#327a19',
    'mVirusColor': '#ce6363',
    'mVirusStrokeColor': '#b95959',
    'foodColor': '#0057ff',
    'teammatesIndColor': '#ffffff',
    'cursorTrackingColor': '#ffffff',
    'splitRangeColor': '#ffffff',
    'enemyBSTEDColor': '#8000ff', //Sonia2
    'enemyBSTEColor': '#BE00FF', //Sonia2
    'enemyBColor': '#FF0A00', //Sonia2
    'enemySColor': '#00C8FF', //Sonia2
    'enemySSTEColor': '#048245', //Sonia2
    'enemySSTEDColor': '#64FF00', //Sonia2
    'ghostCellsColor': '#ffffff',
    'safeAreaColor': '#ffffff',
    'dangerAreaColor': '#bf00aa',
    'namesFont': 'ubuntu-bold',
    'namesFontFamily': 'Ubuntu',
    'namesFontWeight': 700,
    'massFont': 'ubuntu-bold',
    'massFontFamily': 'Ubuntu',
    'massFontWeight': 700,
    'sectorsFont': 'ubuntu',
    'sectorsFontFamily': 'Ubuntu',
    'sectorsFontWeight': 400,
    'sectorsX': 5,
    'sectorsY': 5,
    'namesScale': 1,
    'massScale': 3,
    'virMassScale': 3,
    'strokeScale': 1,
    'foodSize': 5,
    'bordersWidth': 14,
    'sectorsWidth': 40,
    'sectorsFontSize': 1200,
    'cellsAlpha': 0.99,
    'skinsAlpha': 0.99,
    'virusAlpha': 0.6,
    'textAlpha': 1,
    'virusGlowColor': '#fff',
    'virusGlowSize': 14,
    'borderGlowSize': 14,
    'ghostCellsAlpha': 0.3,
    'virusStrokeSize': 14,
    'menuPreset': 'ogario-v3',
    'graphics': 'high',
    'menuMainColor': '#01d9cc',
    'menuBtnTextColor': '#ffffff',
    'menuPanelColor': '#00243e',
    'menuPanelColor2': '#002f52',
    'menuTextColor': '#ffffff',
    'menuTextColor2': '#8096a7',
    'btn1Color': '#018cf6',
    'btn1Color2': '#0176ce',
    'btn2Color': '#00b9e8',
    'btn2Color2': '#0099c0',
    'btn3Color': '#8d5fe6',
    'btn3Color2': '#814ee3',
    'btn4Color': '#bf00aa',
    'btn4Color2': '#a80096',
    'menuBg': 'https://legendmod.ml/banners/static/img/pattern.png',
    'menuOpacity': 0.96,
    'hudMainColor': '#01d9cc',
    'hudColor': 'rgba(0,0,0,0.4)',
    'hudTextColor': '#ffffff',
    'statsHudColor': '#ffffff',
    'timeHudColor': '#01d9cc',
    'top5MassColor': '#bf00aa',
    'lbMeColor': '#bf00aa',
    'lbTeammateColor': '#018cf6',
    'hudFont': 'ubuntu-bold',
    'hudFontFamily': 'Ubuntu',
    'hudFontWeight': 700,
    'hudScale': 1,
    'messageColor': 'rgba(0,0,0,0.4)',
    'messageTextColor': '#ffffff',
    'messageTimeColor': '#018cf6',
    'messageNickColor': '#01d9cc',
    'commandsColor': 'rgba(191,0,170,0.9)',
    'commandsTextColor': '#ffffff',
    'commandsTimeColor': '#bf00aa',
    'commandsNickColor': '#ffffff',
    'chatBoxColor': 'rgba(0,0,0,0.4)',
    'chatScale': 1,
    'miniMapSectorsColor': '#ffffff',
    'miniMapSectorColor': '#01d9cc',
    'miniMapGuidesColor': '#bf00aa',
    'miniMapNickColor': '#ffffff',
    'miniMapNickStrokeColor': '#000000',
    'miniMapMyCellColor': '#ffffff',
    'miniMapMyCellStrokeColor': '#bf00aa',
    'miniMapTeammatesColor': '#01d9cc',
    'miniMapDeathLocationColor': '#bf00aa',
    'miniMapGhostCellsColor': '#ffffff',
    ////
    "color": "#fff",
    //"commanderImage" : "https://i.imgur.com/wQKUDB3.png",
	"customServerImage1": "https://legendmod.ml/banners/IconCustomServer1.png",
    "commanderImage": "https://legendmod.ml/banners/drawCommander.png",
    "commanderImage1": "https://legendmod.ml/banners/drawCommander1.png",
    "commanderImage2": "https://legendmod.ml/banners/drawCommander2.png",
    "commanderImage3": "https://legendmod.ml/banners/drawCommander3.png",
    "commanderImage4": "https://legendmod.ml/banners/drawCommander4.png",
    "commanderImage5": "https://legendmod.ml/banners/drawCommander5.png",
    "commanderImage6": "https://legendmod.ml/banners/iconJustWatchPro.png",
    "commanderImageDyingLight": "https://legendmod.ml/banners/icondyinglightzombie.png",
    "commanderImageDyingLightvirus": "https://legendmod.ml/banners/icondyinglightvirus.png",

    ////
    'miniMapFont': 'ubuntu-bold',
    'miniMapFontFamily': 'Ubuntu',
    'miniMapFontWeight': 700,
    'miniMapNickFont': 'ubuntu-bold',
    'miniMapNickFontFamily': 'Ubuntu',
    'miniMapNickFontWeight': 700,
    'miniMapWidth': 240,
    'miniMapTop': 24,
    'miniMapSectorsOpacity': 0.1,
    'miniMapNickSize': 11,
    'miniMapNickStrokeSize': 2,
    'miniMapMyCellSize': 7.5,
    'miniMapMyCellStrokeSize': 4,
    'miniMapTeammatesSize': 5.5,
    'miniMapGhostCellsAlpha': 0.15,
    'customBackground': '',
    'customCursor': 'https://legendmod.ml/cursors/cursor_02.cur'
}
cimg2 = new Image;
cimg2.src = defaultSettings.commanderImage2;
cimg5 = new Image;
cimg5.src = defaultSettings.commanderImage5;
cimg6 = new Image;
cimg6.src = defaultSettings.commanderImage6;
cimg7 = new Image;
cimg7.src = 'https://legendmod.ml/banners/iconLcForCanvas.png';
if (dyinglight1load == "yes") {
    cimgDyingLight = new Image;
    cimgDyingLight.src = defaultSettings.commanderImageDyingLight;
    cimgDyingLightvirus = new Image;
    cimgDyingLightvirus.src = defaultSettings.commanderImageDyingLightvirus;
}
/*
                cimgDyingLight1 = new Image;
                cimgDyingLight1.src = 'https://legendmod.ml/banners/icondyinglightzombie2.png';
                cimgDyingLight2 = new Image;
                cimgDyingLight2.src = 'https://legendmod.ml/banners/icondyinglightzombie3.png';
                cimgDyingLight3 = new Image;
                cimgDyingLight3.src = 'https://legendmod.ml/banners/icondyinglightzombie4.png';
                cimgDyingLight4 = new Image;
                cimgDyingLight4.src = 'https://legendmod.ml/banners/icondyinglightzombie5.png';
                cimgDyingLight5 = new Image;
                cimgDyingLight5.src = 'https://legendmod.ml/banners/icondyinglightzombiebig.png';
                cimgDyingLight6 = new Image;
                cimgDyingLight6.src = 'https://legendmod.ml/banners/icondyinglightvolaltile.png';
				*/


var skinUrlPatterns = [{
        name: "imgur.com",
        url: "https://imgur.com/",
        example: "https://i.imgur.com/xdmUp5N.png",
        pattern: "https?://w+.imgur.com/w{6,}.(?:%file_ext%)??d*"
    },
    {
        name: "put.re",
        url: "https://put.re/",
        example: "https://s.put.re/iYHAW65g.png",
        pattern: "https?://w+.put.re/w{8,}.(?:%file_ext%)"
    },
    {
        name: "postimages.org",
        url: "https://postimages.org/",
        example: "https://i.postimg.cc/zzK0sRPg/xdmUp5N.png",
        pattern: "https?://w+.postimg.cc/w{8,}/w+.(?:%file_ext%)"
    }
];
var defaultmapsettings = {
    'isAlphaChanged': false,
    'jellyPhisycs': false,
    'virusSound': false,
    'quickResp': true,
    'autoResp': false,
    'autoZoom': false,
    'autoHideNames': true,
    'autoHideMass': true,
    'autoHideFood': false,
    'autoHideFoodOnZoom': false,
    'noNames': false,
    'optimizedNames': true,
    'hideMyName': false,
    'hideTeammatesNames': false,
    'showMass': true,
    'optimizedMass': true,
    'shortMass': true,
    'virMassShots': true,
    'hideMyMass': false,
    'hideEnemiesMass': false,
    'vanillaSkins': false,
    'customSkins': true,
    'videoSkins': true,
    'videoSkinsMusic': false,
    'myTransparentSkin': false,
    'myCustomColor': false,
    'transparentCells': false,
    'transparentViruses': true,
    'transparentSkins': false,
    'showGrid': true,
    'showBgSectors': false,
    'showMapBorders': true,
    'showGhostCells': false,
    'showGhostCellsInfo': false,
    'showPartyBots': false,
    'showMiniMap': true,
    'rotateMap': true,
    'showMiniMapGrid': false,
    'showMiniMapGuides': true,
    'showExtraMiniMapGuides': true,
    'showMiniMapGhostCells': true,
    'oneColoredTeammates': false,
    'optimizedFood': true,
    'rainbowFood': true,
    'oppColors': true,
    'oppRings': true,
    'virColors': false,
    'splitRange': false,
    'qdsplitRange': true, //Sonia2
    'sdsplitRange': false, //Sonia2
    'virusesRange': false,
    'textStroke': false,
    'namesStroke': true,
    'massStroke': true,
    'cursorTracking': false,
    'teammatesInd': true,
    'mouseSplit': false,
    'mouseFeed': false,
    'mouseInvert': false,
    'disableChat': false,
    'hideChat': false,
    'chatSounds': true,
    'chatEmoticons': true,
    'showChatBox': false,
    'hidecountry': false,
    'showChatImages': true,
    'showChatVideos': true,
    'showTop5': true,
    'showTargeting': true,
    'showLbData': true,
    'showTime': false,
    'normalLb': true,
    'centeredLb': true,
    'fpsAtTop': true,
	'tweenMaxEffect': false,
    'showStats': true,
    'showStatsMass': true,
    'showStatsESTE': false,
    'showStatsEMTE': false,
    'showStatsMTE': false,
    'showStatsSTE': false,
    'showStatsTTE': false,
    'showStatsPTE': false,
    'showStatsSTE': false,
    'showStatsN16': true,
    'showStatsFPS': true,
    'blockPopups': false,
    'streamMode': false,
    'hideSkinUrl': false,
    'showQuickMenu': true,
    'showQuickBots': false,
    'showSkinsPanel': true,
    'animation': 120,
    'macroFeeding': 80,
    ////
    "cameraSpeed": 7,
    "commanderDelay": 1E3,
    "suckAnimation": false,
    "virusGlow": false,
    "borderGlow": false,
    "limLB": 10,
    "limTP": 5,
	"teamView": false,
    ////
    //'zoomSpeedValue': .87,
    'zoomSpeedValue2': -0.13,
    'messageSound': 'https://legendmod.ml/sounds/notification_01.mp3',
    //                'commandSound': 'https://legendmod.ml/sounds/notification_02.mp3'
    'commandSound': 'https://legendmod.ml/sounds/chat-message.mp3',
    'virusSoundurl': 'https://legendmod.ml/sounds/sound-gunshot.mp3',
    'soundSplit': 'https://www.myinstants.com/media/sounds/quack_5.mp3'

};
var ogario1PlayerProfiles = [];
var ogarcopythelb = {
    'nick': 'I<3Legendmod',
    'clanTag': 'Ⓜ',
    'skinURL': '',
    'color': defaultSettings.mainColor
};
var thelegendmodproject = function(t, e, i) {
    //here starts ogario
    (function(i) {
        var ogarminimapdrawer;
        var o = null,
            a = null,
            r = 'en',
            l = window.navigator.language || window.navigator.userLanguage;
        l && languagetexts.hasOwnProperty(l) && (r = l);
        var h = languagetexts[r];
        //if (languagetexts[r].comm15 != undefined) {
        //console.log(h.comm15);
        //}
        c = {
                'comm0': h.comm0,
                'comm1': h.comm1,
                'comm2': h.comm2,
                'comm3': h.comm3,
                'comm4': h.comm4,
                'comm5': h.comm5,
                'comm6': h.comm6,
                'comm7': h.comm7,
                'comm8': h.comm8,
                'comm9': h.comm9,
                'comm10': h.comm10,
                'comm11': h.comm11,
                'comm12': h.comm12,
                'comm13': h.comm13,
                'comm14': h.comm14,
                'comm15': h.comm15,
                'comm16': h.comm16,
                'comm17': h.comm17,
                'comm18': h.comm18,
                'comm19': h.comm19,
                'comm20': h.comm20,
                'comm21': h.comm21,
                'comm22': h.comm22,
                'comm23': h.comm23,
                'comm24': h.comm24,
                'comm25': h.comm25,
                'comm26': h.comm26,
                'comm27': h.comm27,
                'comm28': h.comm28,
                'comm29': h.comm29,
                'comm30': h.comm30
            },
            hudsetter = {
                'menuMainColorCSS': null,
                'menuPanelColorCSS': null,
                'menuTextlColorCSS': null,
                'menuButtonsCSS': null,
                'hudCSS': null,
                'chatCSS': null,
                'chatScaleCSS': null,
                'cursorCSS': null,
                'loadThemeSettings': function() {
                    var t = null;
                    for (var s in null !== window.localStorage.getItem('ogarioThemeSettings') && (t = JSON.parse(window.localStorage.getItem('ogarioThemeSettings'))), defaultSettings) defaultSettings.hasOwnProperty(s) && (t && t.hasOwnProperty(s) && (defaultSettings[s] = t[s]), i.hasOwnProperty(s) && (i[s] = defaultSettings[s]));
                    //if (defaultmapsettings.zoomSpeedValue2 && defaultmapsettings.zoomSpeedValue2>0.99){defaultmapsettings.zoomSpeedValue2=defaultmapsettings.zoomSpeedValue2-1};
                },
                'saveThemeSettings': function() {
                    window.localStorage.setItem('ogarioThemeSettings', JSON.stringify(defaultSettings));
                },
                'restoreThemeSettings': function() {
                    null !== window.localStorage.getItem('ogarioThemeSettings') && (window.localStorage.removeItem('ogarioThemeSettings'), window.location.reload());
                },
                'addCustomCSS': function(t, e) {
                    this[t] || (this[t] = $("<style type=\'text/css\'>").appendTo('head')), this[t].html(e);
                },
                'addPresetBox': function(t, e, i, o, a) {
                    for (var n in $(t).append('<div class=\"preset-box\"><span class=\"title-box\">' + h[e] + '</span><div class=\"select-wrapper\"><select id=\"' + e + '\" class=\"form-control\"></select></div></div>'), i) i.hasOwnProperty(n) && $('#' + e).append('<option value=\"' + n + '\">' + i[n]['name'] + '</option>');
                    $('#' + e).val(defaultSettings[o]);
                    var r = this;
                    $('#' + e).on('change', function() {
                        var t = this.value;
                        defaultSettings[o] = t, r[a](t);
                    });
                },
                'addColorBox': function(t, e, o) {
                    if ($(t).append('<div class=\"color-box\"><span class=\"title-box\">' + h[e] + '</span><div class=\"input-group ' + e + '-picker\"><input type=\"text\" value=\"' + defaultSettings[e] + '\" id=\"' + e + '\" class=\"form-control\" /><span class=\"input-group-addon\"><i></i></span></div></div>'), o) {
                        var a = this;
                        $(t + ' .' + e + '-picker')['colorpicker']({
                            'format': 'hex'
                        }).on('changeColor.colorpicker', function(t) {
                            defaultSettings[e] = t.color.toHex(), i.hasOwnProperty(e) && (i[e] = defaultSettings[e]), a[o]();
                        });
                    } else $(t + ' .' + e + '-picker').colorpicker({
                        'format': 'hex'
                    }).on('changeColor.colorpicker', function(t) {
                        defaultSettings[e] = t.color.toHex(), i.hasOwnProperty(e) && (i[e] = defaultSettings[e]);
                    });
                },
                'addRgbaColorBox': function(t, e, o) {
                    if ($(t).append('<div class=\"color-box\"><span class=\"title-box\">' + h[e] + '</span><div class=\"input-group ' + e + '-picker\"><input type=\"text\" value=\"' + defaultSettings[e] + '\" id=\"' + e + '\" class=\"form-control\" /><span class=\"input-group-addon\"><i></i></span></div></div>'), o) {
                        var a = this;
                        $(t + ' .' + e + '-picker').colorpicker({
                            'format': 'rgba'
                        }).on('changeColor.colorpicker', function(t) {
                            var s = t.color.toRGB();
                            defaultSettings[e] = 'rgba(' + s['r'] + ',' + s['defaultSettings'] + ',' + s['b'] + ',' + s['a'] + ')', i.hasOwnProperty(e) && (i[e] = defaultSettings[e]), a[o]();
                        });
                    } else s(t + ' .' + e + '-picker').colorpicker({
                        'format': 'rgba'
                    }).on('changeColor.colorpicker', function(t) {
                        var s = t.color.toRGB();
                        defaultSettings[e] = 'rgba(' + s['r'] + ',' + s['defaultSettings'] + ',' + s['b'] + ',' + s['a'] + ')', i.hasOwnProperty(e) && (i[e] = defaultSettings[e]);
                    });
                },
                'addSliderBox': function(t, e, o, a, n, r) {
                    if ($(t).append('<div class=\"slider-box\"><div class=\"box-label\"><span class=\"value-label\">' + h[e] + ': </span><span id=\"' + e + '-value\" class=\"value\">' + defaultSettings[e] + '</span></div><input id=\"' + e + '-slider\" type=\"range\" min=\"' + o + '\" max=\"' + a + '\" step=\"' + n + '\" value=\"' + defaultSettings[e] + '\"></div>'), r) {
                        var l = this;
                        $('#' + e + '-slider').on('input', function() {
                            var t = parseFloat($(this).val());
                            $('#' + e + '-value').text(t), defaultSettings[e] = t, i.hasOwnProperty(e) && (i[e] = t), l[r]();
                        });
                    } else $('#' + e + '-slider').on('input', function() {
                        var t = parseFloat($(this).val());
                        $('#' + e + '-value').text(t), defaultSettings[e] = t, i.hasOwnProperty(e) && (i[e] = t);
                    });
                },
                'addInputBox': function(t, e, i, o) {
                    $(t).append('<div class=\"input-box\"><span class=\"title-box\">' + h[e] + '</span><input id=\"' + e + '\" class=\"form-control\" placeholder=\"' + i + '\" value=\"' + defaultSettings[e] + '\" /></div>');
                    var a = this;
                    $('#' + e).on('input', function() {
                        defaultSettings[e] = this.value, a[o]();
                    });
                },
                'addCursorBox': function(t, e) {
                    e === defaultSettings.customCursor ? $(t).append('<div class=\"cursor-box\"><a href=\"#\" class=\"active\"><img src=\"' + e + '\"></a></div>') : $(t).append('<div class=\"cursor-box\"><a href=\"#\"><img src=\"' + e + '\"></a></div>');
                },
                'setFont': function(t, e) {
                    defaultSettings[t] = e,
                        defaultSettings[t + 'Family'] = this.setFontFamily(e),
                        defaultSettings[t + 'Weight'] = this.setFontWeight(e),
                        i.hasOwnProperty(t + 'Family') && (i[t + 'Family'] = defaultSettings[t + 'Family']),
                        i.hasOwnProperty(t + 'Weight') && (i[t + 'Weight'] = defaultSettings[t + 'Weight']);
                },
                'addFontBox': function(t, e, i) {
                    $(t).append('<div class=\"font-box\"><span class=\"title-box\">' + h[e] + '</span><div class=\"select-wrapper\"><select id=\"' + e + '\" class=\"form-control\"></select></div></div>');
                    $('#' + e).append('<option value=\"ubuntu\">Ubuntu</option><option value=\"ubuntu-bold\">Ubuntu Bold</option>');
                    $('#' + e).append('<option value=\"roboto\">Roboto</option><option value=\"roboto-bold\">Roboto Bold</option>');
                    $('#' + e).append('<option value=\"oswald\">Oswald</option><option value=\"oswald-bold\">Oswald Bold</option>');
                    $('#' + e).append('<option value=\"shojumaru\">Shojumaru</option><option value=\"shojumaru-bold\">Shojumaru Bold</option>');
                    $('#' + e).append('<option value=\"allura\">Allura</option><option value=\"allura-bold\">Allura Bold</option>');

                    $('#' + e).val(defaultSettings[e]);
                    var o = this;
                    i ? $('#' + e).on('change', function() {
                        var t = this.value;
                        o.setFont(e, t), o[i]();
                    }) : $('#' + e).on('change', function() {
                        var t = this.value;
                        o.setFont(e, t);
                    });
                },
                'setFontFamily': function(t) {
                    var tempFont;
                    if (t.indexOf('roboto') == 0) {
                        tempFont = 'Roboto';
                    } else if (t.indexOf('oswald') == 0) {
                        tempFont = 'Oswald';
                    } else if (t.indexOf('shojumaru') == 0) {
                        //console.log('font: shojumaru');
                        tempFont = 'Shojumaru';
                    } else if (t.indexOf('allura') == 0) {
                        //console.log('font: allura');
                        tempFont = 'Allura';
                    }
                    //					else (if t.indexOf('ubuntu')){
                    else {
                        tempFont = 'Ubuntu';
                    }

                    return tempFont;
                    //return -1 != t.indexOf('roboto') ? 'Roboto' : -1 != t.indexOf('oswald') ? 'Oswald' : 'Ubuntu';
                },
                'setFontWeight': function(t) {
                    return -1 != t.indexOf('bold') ? 700 : 400;
                },
                'setThemeMenu': function() {
                    var t = this;
                    $('#theme').append('<ul class=\"submenu-tabs\"><li class=\"theme-main-tab active\"><a href=\"#theme-main\" class=\"active ogicon-paint-format\" data-toggle=\"tab-tooltip\" title=\"' + h.basicTheming +
                        '\"></a></li><li class=\"theme-menu-tab\"><a href=\"#theme-menu\" class=\"ogicon-menu\" data-toggle=\"tab-tooltip\" title=\"' + h.menuTheming +
                        //
                        //'\"></a></li><li class=\"theme-menu-tab\"><a href=\"#theme-menu\" class=\"ogicon-trophy\" data-toggle=\"tab-tooltip\" title=\"' + h.menuTheming +
                        //
                        '\"></a></li><li class=\"theme-hud-tab\"><a href=\"#theme-hud\" class=\"ogicon-display\" data-toggle=\"tab-tooltip\" title=\"' + h.hudTheming +
                        '\"></a></li><li class=\"theme-chat-tab\"><a href=\"#theme-chat\" class=\"ogicon-bubbles\" data-toggle=\"tab-tooltip\" title=\"' + h.chatTheming +
                        '\"></a></li><li class=\"theme-minimap-tab\"><a href=\"#theme-minimap\" class=\"ogicon-location2\" data-toggle=\"tab-tooltip\" title=\"' + h.miniMapTheming +
                        '\"></a></li><li class=\"theme-images-tab\"><a href=\"#theme-images\" class=\"ogicon-compass\" data-toggle=\"tab-tooltip\" title=\"' + h.imagesTheming +
                        '\"></a></li></ul><div id=\"theme-main\" class=\"submenu-panel\"></div><div id=\"theme-menu\" class=\"submenu-panel\"></div><div id=\"theme-hud\" class=\"submenu-panel\"></div><div id=\"theme-chat\" class=\"submenu-panel\"></div><div id=\"theme-minimap\" class=\"submenu-panel\"></div><div id=\"theme-images\" class=\"submenu-panel\"></div>');
                    this.addPresetBox('#theme-main', 'themePreset', themePresets, 'preset', 'changeThemePreset');
                    this.addColorBox('#theme-main', 'bgColor', 'setBgColor');
                    this.addColorBox('#theme-main', 'bordersColor');
                    this.addColorBox('#theme-main', 'borderGlowColor');
                    this.addColorBox('#theme-main', 'gridColor');
                    this.addColorBox('#theme-main', 'sectorsColor');
                    this.addColorBox('#theme-main', 'namesColor');
                    this.addColorBox('#theme-main', 'namesStrokeColor');
                    this.addColorBox('#theme-main', 'massColor');
                    this.addColorBox('#theme-main', 'massStrokeColor');
                    this.addColorBox('#theme-main', 'virusColor');
                    this.addColorBox('#theme-main', 'virusStrokeColor');
                    this.addColorBox('#theme-main', 'mVirusColor');
                    this.addColorBox('#theme-main', 'mVirusStrokeColor');
                    this.addColorBox('#theme-main', 'virusGlowColor');
                    this.addColorBox('#theme-main', 'foodColor', 'setFoodColor');
                    this.addColorBox('#theme-main', 'teammatesIndColor', 'setIndicatorColor');
                    this.addColorBox('#theme-main', 'cursorTrackingColor');
                    this.addColorBox('#theme-main', 'splitRangeColor');
                    this.addColorBox('#theme-main', 'enemyBSTEDColor'); //Sonia2
                    this.addColorBox('#theme-main', 'enemyBSTEColor'); //Sonia2
                    this.addColorBox('#theme-main', 'enemyBColor'); //Sonia2
                    this.addColorBox('#theme-main', 'enemySColor'); //Sonia2
                    this.addColorBox('#theme-main', 'enemySSTEColor'); //Sonia2
                    this.addColorBox('#theme-main', 'enemySSTEDColor'); //Sonia2
                    this.addColorBox('#theme-main', 'safeAreaColor');
                    this.addColorBox('#theme-main', 'dangerAreaColor');
                    this.addColorBox('#theme-main', 'ghostCellsColor');
                    this.addFontBox('#theme-main', 'namesFont');
                    this.addFontBox('#theme-main', 'massFont');
                    this.addFontBox('#theme-main', 'sectorsFont');
					this.addSliderBox('#theme-main', 'sectorsX', 2, 10, 1);
					this.addSliderBox('#theme-main', 'sectorsY', 2, 10, 1);
                    this.addSliderBox('#theme-main', 'sectorsFontSize', 200, 2000, 10);
                    this.addSliderBox('#theme-main', 'namesScale', 0.5, 2, 0.1);
                    this.addSliderBox('#theme-main', 'massScale', 1, 5, 1);
                    this.addSliderBox('#theme-main', 'virMassScale', 1, 5, 1);
                    this.addSliderBox('#theme-main', 'strokeScale', 1, 4, 0.1);
                    this.addSliderBox('#theme-main', 'foodSize', 1, 50, 1, 'setFoodColor');
                    this.addSliderBox('#theme-main', 'virusStrokeSize', 2, 40, 1);
                    this.addSliderBox('#theme-main', 'bordersWidth', 2, 200, 2);
                    this.addSliderBox('#theme-main', 'borderGlowSize', 0, 40, 1);
                    this.addSliderBox('#theme-main', 'virusGlowSize', 0, 40, 1);
                    this.addSliderBox('#theme-main', 'sectorsWidth', 2, 200, 2);
                    this.addSliderBox('#theme-main', 'cellsAlpha', 0.01, 0.99, 0.01);
                    this.addSliderBox('#theme-main', 'skinsAlpha', 0.01, 0.99, 0.01);
                    this.addSliderBox('#theme-main', 'virusAlpha', 0, 1, 0.01);
                    this.addSliderBox('#theme-main', 'textAlpha', 0.1, 1, 0.01);
                    this.addSliderBox('#theme-main', 'ghostCellsAlpha', 0.01, 0.99, 0.01);
                    this.addPresetBox('#theme-menu', 'menuPreset', themeMenus, 'menuPreset', 'changeMenuPreset');
                    this.addSliderBox('#theme-menu', 'menuOpacity', 0.1, 1, 0.01, 'setMenuOpacity');
                    this.addColorBox('#theme-menu', 'menuMainColor', 'setMenuMainColor');
                    this.addColorBox('#theme-menu', 'menuBtnTextColor', 'setMenuButtons');
                    this.addColorBox('#theme-menu', 'menuPanelColor', 'setMenuPanelColor');
                    this.addColorBox('#theme-menu', 'menuPanelColor2', 'setMenuPanelColor');
                    this.addColorBox('#theme-menu', 'menuTextColor', 'setMenuTextColor');
                    this.addColorBox('#theme-menu', 'menuTextColor2', 'setMenuTextColor');
                    this.addColorBox('#theme-menu', 'btn1Color', 'setMenuButtons');
                    this.addColorBox('#theme-menu', 'btn1Color2', 'setMenuButtons');
                    this.addColorBox('#theme-menu', 'btn2Color', 'setMenuButtons');
                    this.addColorBox('#theme-menu', 'btn2Color2', 'setMenuButtons');
                    this.addColorBox('#theme-menu', 'btn3Color', 'setMenuButtons');
                    this.addColorBox('#theme-menu', 'btn3Color2', 'setMenuButtons');
                    this.addColorBox('#theme-menu', 'btn4Color', 'setMenuButtons');
                    this.addColorBox('#theme-menu', 'btn4Color2', 'setMenuButtons');
                    this.addInputBox('#theme-menu', 'menuBg', 'Image URL', 'setMenuBg');
                    this.addColorBox('#theme-hud', 'hudMainColor', 'setHudColors');
                    this.addRgbaColorBox('#theme-hud', 'hudColor', 'setHudColors');
                    this.addColorBox('#theme-hud', 'hudTextColor', 'setHudColors');
                    this.addColorBox('#theme-hud', 'statsHudColor', 'setHudColors');
                    this.addColorBox('#theme-hud', 'timeHudColor', 'setHudColors');
                    this.addColorBox('#theme-hud', 'top5MassColor', 'setHudColors');
                    this.addColorBox('#theme-hud', 'lbMeColor', 'setHudColors');
                    this.addColorBox('#theme-hud', 'lbTeammateColor', 'setHudColors');
                    this.addFontBox('#theme-hud', 'hudFont', 'setHudFont');
                    this.addSliderBox('#theme-hud', 'hudScale', 0.5, 2, 0.01, 'setHudScale');
                    this.addRgbaColorBox('#theme-chat', 'messageColor', 'setChatColors');
                    this.addColorBox('#theme-chat', 'messageTextColor', 'setChatColors');
                    this.addColorBox('#theme-chat', 'messageTimeColor', 'setChatColors');
                    this.addColorBox('#theme-chat', 'messageNickColor', 'setChatColors');
                    this.addRgbaColorBox('#theme-chat', 'commandsColor', 'setChatColors');
                    this.addColorBox('#theme-chat', 'commandsTextColor', 'setChatColors');
                    this.addColorBox('#theme-chat', 'commandsTimeColor', 'setChatColors');
                    this.addColorBox('#theme-chat', 'commandsNickColor', 'setChatColors');
                    this.addRgbaColorBox('#theme-chat', 'chatBoxColor', 'setChatColors');
                    this.addSliderBox('#theme-chat', 'chatScale', 1, 2, 0.01, 'setChatScale');
                    this.addColorBox('#theme-minimap', 'miniMapSectorsColor', 'setMiniMapSectorsColor');
                    this.addColorBox('#theme-minimap', 'miniMapSectorColor');
                    this.addColorBox('#theme-minimap', 'miniMapNickColor');
                    this.addColorBox('#theme-minimap', 'miniMapNickStrokeColor');
                    this.addColorBox('#theme-minimap', 'miniMapMyCellColor');
                    this.addColorBox('#theme-minimap', 'miniMapMyCellStrokeColor');
                    this.addColorBox('#theme-minimap', 'miniMapTeammatesColor');
                    this.addColorBox('#theme-minimap', 'miniMapDeathLocationColor');
                    this.addColorBox('#theme-minimap', 'miniMapGuidesColor');
                    this.addColorBox('#theme-minimap', 'miniMapGhostCellsColor');
                    this.addFontBox('#theme-minimap', 'miniMapFont', 'setMiniMapFont');
                    this.addFontBox('#theme-minimap', 'miniMapNickFont');
                    this.addSliderBox('#theme-minimap', 'miniMapWidth', 120, 400, 2, 'setMiniMapWidth');
                    this.addSliderBox('#theme-minimap', 'miniMapSectorsOpacity', 0, 1, 0.01, 'setMiniMapSectorsOpacity');
                    this.addSliderBox('#theme-minimap', 'miniMapNickSize', 8, 16, 1);
                    this.addSliderBox('#theme-minimap', 'miniMapNickStrokeSize', 0, 6, 1);
                    this.addSliderBox('#theme-minimap', 'miniMapMyCellSize', 4, 10, 0.5);
                    this.addSliderBox('#theme-minimap', 'miniMapMyCellStrokeSize', 0, 10, 1);
                    this.addSliderBox('#theme-minimap', 'miniMapTeammatesSize', 4, 10, 0.5);
                    this.addSliderBox('#theme-minimap', 'miniMapGhostCellsAlpha', 0.01, 0.99, 0.01);
                    this.addInputBox('#theme-images', 'customBackground', 'Image URL', 'setCustomBackground');
                    this.addPresetBox('#theme-images', 'graphics', graphicMenus, 'graphics', 'changeGraphics');
                    this.addInputBox('#theme-images', 'customCursor', 'Cursor image URL', 'setCustomCursor');
                    for (var e = 'https://legendmod.ml/cursors/cursor_', i = 0; i < 35; i++) i < 9 ? this.addCursorBox('#theme-images', e + '0' + (i + 1) + '.cur') : this.addCursorBox('#theme-images', e + '' + (i + 1) + '.cur');
                    $(document).on('click', '#theme-images .cursor-box a', function(e) {
                            e.preventDefault();
                            var i = $('img', this).attr('src');
                            defaultSettings.customCursor = i;
                            hudsetter.setCustomCursor();
                            $('#customCursor').val(i);
                            $('#theme-images .cursor-box a').removeClass('active');
                            $(this).addClass('active');
                        }),
                        $('#theme').append('<button class=\"btn btn-block btn-success btn-save\"\">' + h.saveSett + '</button>'),
                        $(document).on('click', '#theme .btn-save', function(e) {
                            e.preventDefault();
                            var i = $(this);
                            i.text(h.saved), hudsetter.saveThemeSettings(), setTimeout(function() {
                                i.text(h.saveSett);
                            }, 500);
                        }), $('#theme').append('<div class=\"restore-settings\"><a href=\"#\">' + h.restoreThemeSettings + '</a></div>'),
                        $(document).on('click', '#theme .restore-settings a', function(e) {
                            e.preventDefault(), hudsetter.restoreThemeSettings();
                        }), $('.skin').colorpicker({
                            'format': 'hex',
                            'input': '#color'
                        });
                },
                'changePreset': function(t, e) {
                    if (e[t]) {
                        defaultSettings[t] = t;
                        t = e[t];
                        for (var o in t) t.hasOwnProperty(o) && defaultSettings.hasOwnProperty(o) &&
                            (defaultSettings[o] = t[o], i.hasOwnProperty(o) && (i[o] = defaultSettings[o]), $('#theme .' + o + '-picker') && $('#theme .' + o + '-picker').colorpicker('setValue', defaultSettings[o]), $('#' + o + '-slider') && $('#' + o + '-slider').val(defaultSettings[o]).change(), ($('input[type=text]#' + o) || $('select#' + o)) && $('#' + o).val(defaultSettings[o]));
                    }
                },
                'changeThemePreset': function(t) {
                    this.changePreset(t, themePresets);
                    this.setTheme();
                },
                'setFonts': function() {
                    this.setFont('namesFont', defaultSettings.namesFont);
                    this.setFont('massFont', defaultSettings.namesFont);
                    this.setFont('sectorsFont', defaultSettings.sectorsFont);
                },
                'setBgColor': function() {
                    $('body').css('background-color', defaultSettings.bgColor);
                },
                'setFoodColor': function() {
                    defaultmapsettings.optimizedFood && ogarfooddrawer && ogarfooddrawer.preDrawPellet();
                },
                'setIndicatorColor': function() {
                    if (ogarfooddrawer) {
                        ogarfooddrawer.preDrawIndicator();
                    }
                },
                'setCustomBackground': function() {
                    defaultSettings.customBackground ? $('body').css('background-image', 'url(' + defaultSettings.customBackground + ')') : $('body').css('background-image', 'none');
                },
                'setCustomCursor': function() {
                    if (defaultSettings.customCursor) var t = '*{cursor:url(' + defaultSettings.customCursor + '), auto !important}';
                    else t = '*{cursor: auto}';
                    this.addCustomCSS('cursorCSS', t);
                },
                'setMenu': function() {
                    this.setMenuOpacity();
                    this.setMenuMainColor();
                    this.setMenuPanelColor();
                    this.setMenuTextColor();
                    this.setMenuButtons();
                    this.setMenuBg();
                },
                'changeMenuPreset': function(t) {
                    this.changePreset(t, themeMenus);
                    this.setMenu();
                },
                'changeGraphics': function(t) {},
                'setMenuOpacity': function() {
                    $('#helloContainer, #hotkeys, #exp-imp').css('opacity', defaultSettings.menuOpacity);
                },
                'setMenuMainColor': function() {
                    var t = '::-moz-selection{background-color:' + defaultSettings.menuMainColor + '!important}::selection{background-color:' + defaultSettings.menuMainColor + '!important}.menu-main-color,#quick-menu a:hover,.quick,.quick:focus,.menu-tabs a:hover,.menu-tabs .active,.submenu-tabs a:hover,.submenu-tabs .active,#stats center,#exp-imp h1{color:' + defaultSettings.menuMainColor + '}#exp-bar .progress-bar-striped,.quick:hover,.rangeslider__fill{background-color:' + defaultSettings.menuMainColor + '}#main-menu,.agario-side-panel,#hotkeys,#exp-imp{border-color:' + defaultSettings.menuMainColor + '}.ps-scrollbar-y{background-color:' + defaultSettings.menuMainColor + '!important}';
                    this.addCustomCSS('menuMainColorCSS', t);
                },
                'setMenuPanelColor': function() {
                    var t = '#main-menu,.agario-side-panel,#hotkeys,#exp-imp{background-color: ' + defaultSettings.menuPanelColor + '}label:hover,.agario-panel input,.agario-panel select,.agario-side-panel input,.agario-side-panel select,.input-group-addon,.nick .input-group-btn,.skin .input-group-btn,#stream-mode,#hide-url,.menu-tabs a:hover,.menu-tabs .active,.submenu-tabs,#exp-bar .progress,#quick-menu a:hover,.quick,.select-wrapper,#hotkeys-cfg div.row:hover,#hotkeys-cfg .command-in,#exp-imp-settings textarea,.restore-settings{background-color: ' + defaultSettings.menuPanelColor2 + '}.agario-panel h5,.agario-side-panel h5,#stats h2,.menu-tabs,.submenu-tabs,#skins a.default,#stats hr,#hotkeys-cfg div.row, #exp-imp h1{border-color: ' + defaultSettings.menuPanelColor2 + '}.quick:hover,#skins a,#profiles{color:' + defaultSettings.menuPanelColor2 + '}input.stream-mode,input.hide-url{color:' + defaultSettings.menuPanelColor2 + '!important}';
                    this.addCustomCSS('menuPanelColorCSS', t);
                },
                'setMenuTextColor': function() {
                    var t = '.agario-panel,.agario-side-panel,.agario-panel input,.agario-panel select,.agario-side-panel input,.agario-side-panel select,.input-group-addon,.dark .yt-username,#stream-mode,#hide-url,.menu-tabs a,.submenu-tabs a,#skins a.default:hover,#quick-menu a,#prev-profile.default:hover,#next-profile.default:hover,#statsText,#hotkeys,#hotkeys-cfg .command-in,#exp-imp{color:' + defaultSettings['menuTextColor'] + '}#skins a.default:hover{border-color:' + defaultSettings['menuTextColor'] + '}::-webkit-input-placeholder{color:' + defaultSettings.menuTextColor2 + '!important}::-moz-placeholder{color:' + defaultSettings.menuTextColor2 + '!important}#user-id-tag, #version-tag,#statsSubtext,#hotkeys-inst,#exp-imp textarea,.restore-settings a,.restore-settings a:hover{color:' + defaultSettings.menuTextColor2 + '}#hotkeys-cfg .command-in,#theme .color-box{border-color:' + defaultSettings.menuTextColor2 + '}';
                    this.addCustomCSS('menuTextColorCSS', t);
                },
                'setMenuButtons': function() {
                    var t = 'a,a:hover{color:' + defaultSettings.btn1Color + '}.btn,#hotkeys-cfg .custom-key-in{color:' + defaultSettings.menuBtnTextColor + '}.btn-primary{background-color:' + defaultSettings.btn1Color + '!important}.btn-primary:active,.btn-primary:disabled,.btn-primary:focus,.btn-primary:hover{background-color:' + defaultSettings['btn1Color2'] + '!important}.btn-success{background-color:' + defaultSettings['btn2Color'] + '!important}.btn-success:active,.btn-success:disabled,.btn-success:focus,.btn-success:hover{background-color:' + defaultSettings['btn2Color2'] + '!important}.btn-warning{background-color:' + defaultSettings['btn3Color'] + '!important}.btn-warning:active,.btn-warning:disabled,.btn-warning:focus,.btn-warning:hover{background-color:' + defaultSettings.btn3Color2 + '!important}.btn-danger{background-color:' + defaultSettings.btn4Color + '!important}.btn-danger:active,.btn-danger:disabled,.btn-danger:focus,.btn-danger:hover{background-color:' + defaultSettings.btn4Color2 + '!important}#hotkeys-cfg .custom-key-in{background-color:' + defaultSettings.btn4Color2 + ';border-color:' + defaultSettings.btn4Color2 + '}';
                    this.addCustomCSS('menuButtonsCSS', t);
                },
                'setMenuBg': function() {
                    $('#menuBg').val(defaultSettings.menuBg), defaultSettings.menuBg ? $('.menu-panel, .agario-side-panel, #hotkeys, #exp-imp').css('background-image', 'url(' + defaultSettings.menuBg + ')') : $('.menu-panel, .agario-side-panel, #hotkeys, #exp-imp').css('background-image', 'none');
                },
                'setHud': function() {
                    this.setHudColors();
                    this.setHudFont();
                    this.setHudScale();
                },
                'setHudColors': function() {
                    var t = '.hud-main-color,#top5-hud a,#target-panel-hud a:hover,#target-panel-hud a.active,#message-menu a{color:' + defaultSettings.hudMainColor + '}.hud,.hud-b,#chat-emoticons{background-color:' + defaultSettings.hudColor + '}.hud,.hud-b,#top5-hud a:hover,#target-panel-hud a{color:' + defaultSettings.hudTextColor + '}.stats-hud-color{color:' + defaultSettings.statsHudColor + '}.time-hud-color{color:' + defaultSettings.timeHudColor + '}.top5-mass-color{color:' + defaultSettings.top5MassColor + '}#leaderboard-positions .me{color:' + defaultSettings.lbMeColor + '}#leaderboard-positions .teammate{color:' + defaultSettings.lbTeammateColor + '}';
                    this.addCustomCSS('hudCSS', t);
                },
                'setHudFont': function() {
                    this.setFont('hudFont', defaultSettings.hudFont),
                        $('#overlays-hud').css({
                            'font-family': defaultSettings['hudFontFamily'],
                            'font-weight': defaultSettings['hudFontWeight']
                        });
                },
                'setHudScale': function() {
                    var t = Math.round(20 * defaultSettings.hudScale),
                        e = Math.round(200 * defaultSettings.hudScale),
                        i = Math.floor(55 * defaultSettings.hudScale),
                        o = Math.floor(6 * defaultSettings.hudScale),
                        a = Math.floor(280 * defaultSettings.hudScale),
                        n = Math.floor(85 * defaultSettings.hudScale),
                        r = Math.floor(20 * defaultSettings.hudScale);
                    $('#overlays-hud').css('font-size', t + 'px');
                    $('#leaderboard-hud, #time-hud').width(e);
                    $('#top5-hud').width(e + 30).css('top', i + 'px');
                    $('#top5-pos').css('padding-left', o + 'px');
                    $('#time-hud').css('top', a + 'px');
                    $('#pause-hud').css('top', n + 'px');
                    $('#target-hud').css('padding-top', r + 'px');
                },
                'setChat': function() {
                    this['setChatColors'](), this.setChatScale();
                },
                'setChatColors': function() {
                    var t = '#message,#messages li,.toast-success{background-color:' + defaultSettings.messageColor + '}#message,.message-text,.toast-success .message-text{color:' + defaultSettings.messageTextColor + '}.message-nick,.mute-user,.mute-user:hover,.toast-success .message-nick,.toast .mute-user,.toast .mute-user:hover{color:' + defaultSettings.messageNickColor + '}.message-time{color:' + defaultSettings.messageTimeColor + '}.toast-warning{background-color:' + defaultSettings.commandsColor + '}.command-text,.toast-warning .command-text{color:' + defaultSettings.commandsTextColor + '}.command-nick,.toast-warning .command-nick,.toast-warning .mute-user,.toast-warning .mute-user:hover{color:' + defaultSettings.commandsNickColor + '}.command-time{color:' + defaultSettings.commandsTimeColor + '}#chat-box{background-color:' + defaultSettings.chatBoxColor + '}';
                    this.addCustomCSS('chatCSS', t);
                },
                'setChatScale': function() {
                    var t = Math.round(14 * defaultSettings.chatScale);
                    var e = Math.round(280 * defaultSettings.chatScale);
                    var i = Math.round(350 * defaultSettings.chatScale);
                    var o = Math.round(300 * defaultSettings.chatScale);
                    var a = Math.floor(14 * defaultSettings.chatScale);
                    $('#message-box, #messages, #toast-container, #chat-box').css('font-size', t + 'px');
                    $('#messages, #toast-container, #chat-box').width(e);
                    $('#message-box').width(i), $('#chat-box').height(o);
                    $('.user-list').css('padding-left', a + 'px');
                    var n = '#toast-container{width:' + e + 'px;font-size:' + t + 'px}';
                    this.addCustomCSS('chatScaleCSS', n);
                },
                'setMiniMap': function() {
                    this.setMiniMapFont();
                    this.setMiniMapWidth();
                    this.setMiniMapSectorsOpacity();
                },
                'setMiniMapFont': function() {
                    this.setFont('miniMapFont', defaultSettings.miniMapFont);
                    if (ogarminimapdrawer) {
                        ogarminimapdrawer.resetMiniMapSectors();
                    }
                },
                'setMiniMapWidth': function() {
                    var t = defaultSettings.miniMapWidth / 200;
                    defaultSettings.miniMapTop = Math.round(20 * t);
                    $('#minimap-hud').css({
                        'width': defaultSettings.miniMapWidth,
                        'height': defaultSettings.miniMapWidth + defaultSettings.miniMapTop
                    });
                    if (ogarminimapdrawer) {
                        ogarminimapdrawer.resetMiniMapSectors();
                    }
                },
                'setMiniMapSectorsColor': function() {
                    if (ogarminimapdrawer) {
                        ogarminimapdrawer.resetMiniMapSectors();
                    }
                },
                'setMiniMapSectorsOpacity': function() {
                    $('#minimap-sectors').css('opacity', defaultSettings.miniMapSectorsOpacity);
                },
                'setTheme': function() {
                    this.setFonts();
                    this.setBgColor();
                    this.setCustomBackground();
                    this.setCustomCursor();
                    this.setMenu();
                    this.setHud();
                    this.setChat();
                    this.setMiniMap();
                },
                'init': function() {
                    this.loadThemeSettings();
                }
            },

            window.legendmod4 = c;
        window.legendmod5 = defaultmapsettings;

        ogarminimapdrawer = {
            'name': 'LM express',
            'version': 'v1',
            'privateMode': false,
            'protocolMode': true,
            'publicIP': 'wss://wss.ogario.eu:3443',
            'privateIP': null,
            'updateInterval': 1000,
            'updateTick': 0,
            'updateMaxTick': 2,
            'currentSector': '',
            'miniMap': null,
            'miniMapCtx': null,
            'miniMapSectors': null,
            'pi2': 2 * Math.PI,
            'socket': null,
            'cells': {},
            'teamPlayers': [],
            'parties': [],
            'chatHistory': [],
            'chatUsers': {},
            'chatMutedUsers': {},
            'chatMutedUserIDs': [],
            'customSkinsCache': {},
            'customSkinsMap': {},
            'cacheQueue': [],
            'cacheQueue2': [],
            'cacheQueue3': [],
            'deathLocations': [],
            'playerID': null,
            'playerMass': 0,
            'selectedProfile': 0,
            'lastDeath': 0,
            'skipServerData': false,
            'gameMode': ':ffa',
            'region': '',
            'partyToken': '',
            'ws': '',
            'serverIP': '',
            'serverArena': '',
            'serverToken': '',
            'lastSentNick': '',
            'lastSentClanTag': null,
            'lastSentSkinURL': '',
            'lastSentCustomColor': '',
            'lastSentPartyToken': '',
            'lastSentServerToken': '',
            'lastMessageSentTime': performance.now(),
            'rFps': 0,
            'renderedFrames': 0,
            'fpsLastRequest': null,
            'statsHUD': null,
            'leaderboardPositionsHUD': null,
            'leaderboardDataHUD': null,
            'activeParties': null,
            'top5pos': null,
            'top5totalMass': null,
            'top5totalPlayers': null,
            'top5limit': 5,
            'timeHUD': null,
            'questHUD': null,
            'retryResp': 0,
            'token': 'TGVnZW5kIGV4cHJlc3M=',
            'canvasScale': 1,
            'selectBiggestCell': true,
            'noColors': false,
            'skipStats': false,
            'showQuest': false,
            'showSplitInd': false,
            'pause': false,
            'targetID': 0,
            'targetStatus': 0,
            'targetNick': '',
            'targetSkinURL': '',
            'targeting': false,
            'privateMiniMap': false,
            'messageSound': null,
            'commandSound': null,
            'virusSound': null,
            'virusSoundurl': null,
            'feedInterval': null,
            'getPlayerX': function() {
                return i.playerX + i.mapOffsetX;
            },
            'getPlayerY': function() {
                return i.playerY + i.mapOffsetY;
            },
            'feed': function() {
                if (window.core && window.core.eject) {
                    window.core.eject();
                }
            },
            'macroFeed': function(t) {
                if (t) {
                    if (this.feedInterval) return;
                    var e = this;
                    this.feed(), this.feedInterval = setInterval(function() {
                        e.feed();
                    }, defaultmapsettings.macroFeeding);
                } else if (this.feedInterval) {
                    clearInterval(this.feedInterval);
                    this.feedInterval = null
                };
            },
            'split': function() {
                window.core && window.core.split && window.core.split();
            },
            'doubleSplit': function() {
                var t = this;
                t.split();
                setTimeout(function() {
                    t.split();
                }, 40);
            },
            'popSplit': function() {
                var t = this;
                t.split();
                setTimeout(function() {
                    t.split();
                }, 200);
            },
            'split16': function() {
                var t = this;
                t.split();
                setTimeout(function() {
                    t.split();
                }, 40);
                setTimeout(function() {
                    t.split();
                }, 80);
                setTimeout(function() {
                    t.split();
                }, 120);
            },
            'toggleSkins': function() {
                i.vanillaSkins && i.customSkins ? i.vanillaSkins = false : !i.vanillaSkins && i.customSkins ? (i.vanillaSkins = true, i.customSkins = false) : (i.vanillaSkins = true, i.customSkins = true);
            },
            'toggleCells': function() {
                this.selectBiggestCell = !this.selectBiggestCell,
                    i.selectBiggestCell = this.selectBiggestCell;
            },
            'setShowTop5': function() {
                defaultmapsettings.showTop5 = !defaultmapsettings.showTop5, this.setTop5();
            },
            'setTop5': function() {
                defaultmapsettings.showTop5 ? $('#top5-hud').show() : $('#top5-hud').hide();
            },
            'setShowTargeting': function() {
                defaultmapsettings.showTargeting = !defaultmapsettings.showTargeting, this.setTargetingHUD();
            },
            'setTargetingHUD': function() {
                defaultmapsettings.showTargeting ? $('#target-hud, #target-panel-hud').show() : $('#target-hud, #target-panel-hud').hide();
            },
            'setShowTime': function() {
                defaultmapsettings.showTime = !defaultmapsettings.showTime, defaultmapsettings.showTime ? ($('#time-hud').show(), this.displayTime()) : $('#time-hud').hide();
            },
            'setShowSplitRange': function() {
                defaultmapsettings.splitRange = !defaultmapsettings.splitRange, i.splitRange = defaultmapsettings.splitRange;
            },
            'setShowGhostCellsInfo': function() {
                if (defaultmapsettings.showGhostCells == false || defaultmapsettings.showGhostCellsInfo == false) {
                    defaultmapsettings.showGhostCellsInfo = true;
                    defaultmapsettings.showGhostCells = true;
                } else {
                    defaultmapsettings.showGhostCellsInfo = false;
                    defaultmapsettings.showGhostCells = false;
                }

            },
            'setAutoPlay': function() {
                if (legendmod.pause) {
                    ogarminimapdrawer && ogarminimapdrawer.setPause()
                };
                if (window.autoPlay == false) {
                    window.autoPlay = true;
                    $('#pause-hud').text("AI (Striker & Jimboy3100) SkyNet v0.06");
                    $('#pause-hud').show();
                } else {
                    window.autoPlay = false;
                    $('#pause-hud').text(h.pause);
                    $('#pause-hud').hide();
                }
            },
            'setShowSplitInd': function() {
                this.showSplitInd = !this.showSplitInd,
                    defaultmapsettings.splitRange = this.showSplitInd,
                    defaultmapsettings.oppRings = this.showSplitInd,
                    i.splitRange = defaultmapsettings.splitRange,
                    i.oppRings = defaultmapsettings.oppRings;
            },
            'setShowTeammatesInd': function() {
                defaultmapsettings.teammatesInd = !defaultmapsettings.teammatesInd;
            },
            'setShowOppColors': function() {
                defaultmapsettings.oppColors = !defaultmapsettings.oppColors, i.oppColors = defaultmapsettings.oppColors;
            },
            'setShowSkins': function() {
                this.noSkins = !this.noSkins,
                    window.core && window.core.setSkins && window.core.setSkins(!this.noSkins),
                    i.showCustomSkins = !this.noSkins,
                    this.displayChatInfo(!this.noSkins, 'showSkinsMsg');
            },
            'setTransparentSkins': function() {
                defaultmapsettings.transparentSkins = !defaultmapsettings.transparentSkins,
                    i.transparentSkins = defaultmapsettings.transparentSkins;
            },
            'setShowStats': function() {
                $('#stats-hud').toggle();
            },
            'setShowFood': function() {
                i.showFood = !i.showFood;
            },
            'setShowHUD': function() {
                $('#overlays-hud').toggle();
            },
            'setShowGrid': function() {
                defaultmapsettings.showGrid = !defaultmapsettings.showGrid;
            },
            'setShowMiniMapGuides': function() {
                defaultmapsettings.showMiniMapGuides = !defaultmapsettings.showMiniMapGuides;
            },
            'setShowLb': function() {
                ':teams' !== this.gameMode && $('#leaderboard-hud').toggle();
            },
            'setShowBgSectors': function() {
                defaultmapsettings.showBgSectors = !defaultmapsettings.showBgSectors;
            },
            'setHideSmallBots': function() {
                i.hideSmallBots = !i.hideSmallBots,
                    this.displayChatInfo(!i.hideSmallBots, 'hideSmallBotsMsg');
            },
            'setShowNames': function() {
                defaultmapsettings.noNames = !defaultmapsettings.noNames;
            },
            'setHideTeammatesNames': function() {
                defaultmapsettings.hideTeammatesNames = !defaultmapsettings.hideTeammatesNames;
            },
            'setShowMass': function() {
                defaultmapsettings.showMass = !defaultmapsettings.showMass;
            },
            'setShowMiniMap': function() {
                defaultmapsettings.showMiniMap = !defaultmapsettings.showMiniMap, this.setMiniMap();
            },
            'setMiniMap': function() {
                defaultmapsettings.showMiniMap ? $('#minimap-hud').show() : $('#minimap-hud').hide();
            },
            'setShowQuest': function() {
                ':ffa' === this.gameMode && (this.showQuest = !this.showQuest, this.setQuest());
            },
            'setQuest': function() {
                this.showQuest && ':ffa' === this.gameMode ? $('#quest-hud').show() : $('#quest-hud').hide();
            },
            'toggleAutoZoom': function() {
                i.autoZoom = !i.autoZoom, this.displayChatInfo(i.autoZoom, 'autoZoomMsg');
            },
            'resetZoom': function(t) {
                t ? (i.zoomResetValue = 1, i.zoomValue = 1) : i.zoomResetValue = 0;
            },
            'setZoom': function(t) {
                i.zoomValue = t;
            },
            'toggleDeath': function() {
                this.lastDeath--;
                if (this.lastDeath < 0) {
                    this.lastDeath = this.deathLocations.length - 1;
                }
            },
            'tryResp': function() {
                if (i.play || 20 == this.retryResp) this.retryResp = 0;
                else {
                    this.retryResp++;
                    var t = this;
                    setTimeout(function() {
                        $('.btn-play-guest').is(':visible') ? $('.btn-play-guest').click() : $('.btn-play').click(), i.play || t.tryResp();
                    }, 500);
                }
            },
            'quickResp': function() {
                if (defaultmapsettings.quickResp) {
                    this.hideMenu();
                    this['gameServerConnect'](this.ws);
                    i.play = false;
                    this.tryResp();
                }
            },
            'autoResp': function() {
                defaultmapsettings.autoResp && (this.setAutoResp(),
                    $('#overlays').stop().hide(),
                    $('.btn-play-guest').is(':visible') ? $('.btn-play-guest').click() : $('.btn-play').click());
            },
            'setAutoResp': function() {
                defaultmapsettings.autoResp && ($('#skipStats').prop('checked') || ($('#skipStats').click(), this.skipStats = true));
            },
            'toggleAutoResp': function() {
                defaultmapsettings.autoResp = !defaultmapsettings.autoResp, this.setAutoResp(), this.displayChatInfo(defaultmapsettings.autoResp, 'autoRespMsg');
            },
            'copyLb': function() {
                var t = $('<input>');
                $('body').append(t);
                t.val($('#leaderboard-positions').text()).select();
                try {
                    document.execCommand('copy');
                } catch (ogarcopierlbcather) {}
                t.remove();
            },
            'setPause': function() {
                if (window.autoPlay) {
                    ogarminimapdrawer && ogarminimapdrawer.setAutoPlay()
                };
                this.pause = !this.pause, i.pause = this.pause, this.pause ? (i.resetTargetPosition(), $('#pause-hud').text(h.pause), $('#pause-hud').show()) : $('#pause-hud').hide();
            },
            'setCenteredLb': function() {
                defaultmapsettings.centeredLb ? $('#leaderboard-hud').addClass('hud-text-center') : $('#leaderboard-hud').removeClass('hud-text-center');
            },
            'setNormalLb': function() {
                defaultmapsettings.normalLb ? $('#leaderboard-hud h5').html(h.leaderboard) : $('#leaderboard-hud h5').html('legendmod');
            },
            'setFpsAtTop': function() {
                defaultmapsettings.fpsAtTop ? $('#stats-hud').removeClass('hud-bottom').addClass('hud-top') : $('#stats-hud').removeClass('hud-top').addClass('hud-bottom');
            },
            'setTweenMaxEffect': function() {
				if (defaultmapsettings.tweenMaxEffect) initTilt()
                //defaultmapsettings.tweenMaxEffect ? initTilt() : console.log('[Legend mod Express] Restart needed...');
            },		
            'displayPartyBots': function() {
                setTimeout(function() {
				if (defaultmapsettings.showPartyBots) {					
					//console.log('[Legend mod Express] Party bots displayed');
					$(".quick.quick-bots.ogicon-trophy").show();					
                } 
				else {
					//console.log('[Legend mod Express] Party bots NOT displayed');
                    $(".quick.quick-bots.ogicon-trophy").hide();		
                }    
				}, 50);				
            },				
            'setBlockPopups': function() {
                this.protocolMode ? $('#block-warn').hide() : defaultmapsettings["blockPopups"] ? this["blockPopups"]() : this.unblockPopups();
            },
            'blockPopups': function() {
                $('#openfl-content, #openfl-overlay').hide();
                $('#openfl-content, #openfl-overlay').addClass('block-popups');
                $('#freeCoins, #gifting, #openShopBtn, #dailyQuests').prop('disabled', true);
                $('#block-warn').show();
            },
            'unblockPopups': function() {
                $('#openfl-overlay.disabler').click();
                $('#openfl-content, #openfl-overlay').hide();
                $('#openfl-content, #openfl-overlay').removeClass('block-popups');
                $('#freeCoins, #gifting, #openShopBtn, #dailyQuests').prop('disabled', false);
                $('#block-warn').hide();
            },
            'tempUnblockPopups': function() {
                if (defaultmapsettings["blockPopups"]) {
                    this.unblockPopups();
                }
            },
            'displayLeaderboard': function(t, e = '') {
                if (this.leaderboardPositionsHUD) {
                    this.leaderboardPositionsHUD.innerHTML = t;
                    if (defaultmapsettings.showLbData) {
                        this.leaderboardDataHUD.innerHTML = e;
                    } else {
                        this.leaderboardDataHUD.innerHTML = '';
                    }
                }

            },
            'displayStats': function() {
                if (defaultmapsettings.showStats) {
                    var t = '';
                    if (i.play) {
                        if (defaultmapsettings.showStatsMass && i.playerMass) {
                            //t += h.mass + ': ' + i.playerMass + ' | '
                            t += Languageletter49 + ': ' + i.playerMass + ' | '
                        }
                        if (i.playerScore) {
                            //t += h.score + ': ' + i.playerScore
                            t += Languageletter366 + ': ' + i.playerScore
                        }
                        if (defaultmapsettings.showStatsN16 && i.playerSplitCells) {
                            t += ' | ' + i.playerSplitCells + '/16'
                        }
                        if (defaultmapsettings.showStatsESTE && i.BSTE) {
                            t += ' | ◎◎➛◉: ' + i.BSTE //Sonia6
                        }
                        if (defaultmapsettings.showStatsEMTE && i.BMTE) {
                            t += ' | ◎➛◉: ' + i.BMTE //Sonia6
                        }
                        if (defaultmapsettings.showStatsMTE && i.MTE) {
                            t += ' | ◉➛◎: ' + i.MTE //Sonia6
                        }
                        if (defaultmapsettings.showStatsSTE && i.STE) {
                            t += ' | ◉◉➛◎: ' + i.STE //Sonia6
                        }
                        if (defaultmapsettings.showStatsTTE && i.TTE) {
                            t += ' | ◉➚◉: ' + i.TTE //Sonia6
                        }
                        if (defaultmapsettings.showStatsPTE && i.PTE) {
                            t += ' | ➚◎➘: ' + i.PTE //Sonia6
                        }
                        if (defaultmapsettings.showStatsFPS) {
                            t += ' | '
                        }
                    }
                    if (defaultmapsettings.showStatsFPS) {
                        t += 'FPS: ' + ogarfooddrawer.fps;
                    }
                    this.statsHUD.textContent = t;
                    var e = this;
                    setTimeout(function() {
                        e.displayStats();
                    }, 250);
                } else $('#stats-hud').hide();
            },
            'displayTime': function() {
                if (defaultmapsettings.showTime) {
                    var t = new Date().toLocaleString();
                    this.timeHUD.textContent = t;
                    var e = this;
                    setTimeout(function() {
                        e.displayTime();
                    }, 1000);
                } else $('#time-hud').hide();
            },
            'displayParties': function() {
                for (var t = '', e = 0; e < this.parties.length; e++) t += '<li><a href=\"https://agar.io/#' + this.parties[e] + '\" onclick=\"$(\'#party-token\').val(\'' + this.parties[e] + '\'); $(\'#join-party-btn-2\').click();\">https://agar.io/#' + this.parties[e] + '</a></li>';
                this.activeParties.className = '' === t ? 'no-parties' : '',
                    this.activeParties.innerHTML = t;
            },
            /*
                        'displayTop5': function() {
                            if (defaultmapsettings.showTop5) {
            					//console.log(.top5.length);
            					//console.log(.teamPlayers.length);
                                for (var t = '', e = 0, s = this.top5.length, o = 0; o < s; o++) e += this.top5[o].mass, o >= this['top5limit'] || (t += '<li><span class=\"cell-counter\" style=\"background-color: ' + this.top5[o].color + '\">' + (o + 1) + '</span>', defaultmapsettings.showTargeting && (t += '<a href=\"#\" data-user-id=\"' + this.top5[o].id + '\" class=\"set-target ogicon-target\"></a> '), t += '<span class=\"hud-main-color\">[' + this.calculateMapSector(this.top5[o].x, this.top5[o].y) + ']</span>', t += 					'<span class=\"top5-mass-color\">[' + this.shortMassFormat(this.top5[o].mass) + ']</span> ' + this.escapeHTML(this.top5[o].nick) + '</li>');
                                this['top5pos'].innerHTML = t, i.play && i.playerMass && (e += i.playerMass, s++), this.top5totalMass.textContent= this.shortMassFormat(e), this.top5totalPlayers.textContent= s;
                            }
                        },
                        'setTop5limit': function(t) {
                            t && (this['top5limit'] = t);
                        },

                    "displayTop5" : function() {
                      if (defaultmapsettings.showTop5) {
                        var pix_color = "";
                        var bufferString = 0;
                        var PL$29 = this.top5.length;
                        var entityType = 0;
                        for (; entityType < PL$29; entityType++) {
                          bufferString = bufferString + this.top5[entityType].mass;
                          if (!(entityType >= defaultmapsettings["limTP"])) {
                            pix_color = pix_color + ('<li id="player"><span id="pos-skin" style="background-color: ' + this.top5[entityType].color + '; width: 30px; height:30px; display: inline-block;"><img style="position: absolute; margin-left: 2px; margin-top: 2px; width: 26px; height:26px; display: inline-block;"  src = ' + (this.top5[entityType]["skin"] ? this.top5[entityType]["skin"] : "https://legendmod.ml/banners/icon32croped.ico.gif") + '" alt=""> ' +
            				'<span class=\"top5-mass-color\">[' + this.shortMassFormat(this.top5[entityType].mass) + ']</span> ' + this.escapeHTML(this.top5[entityType].nick) + '</span><span class=\"hud-main-color\">[' + this.calculateMapSector(this.top5[entityType].x, this.top5[entityType].y) +']</span><span id= "top5mass" class=""> ' +
                            this.shortMassFormat(this.top5[entityType].mass) + '</span></li>');
                          }
                        }
                        this.top5pos.innerHTML = pix_color;
                        if (i["play"] && i.playerMass) {
                          bufferString = bufferString + i.playerMass;
                          PL$29++;
                        }
                        this.top5totalMass.textContent= this.shortMassFormat(bufferString);
                        this.top5totalPlayers.textContent= PL$29;
                      }
                    },
            */
            'displayTop5': function() {
                if (window.top5skins != true) {
                    if (defaultmapsettings.showTop5) {
                        //console.log(.top5.length);
                        //console.log(.teamPlayers.length);
                        for (var t = '', e = 0, s = this.top5.length, o = 0; o < s; o++) {
                            e += this.top5[o].mass;
                            if (!(o >= window.teamboardlimit && this.top5[o].mass > 1)) {
                                t = t + '<li style=\"height: 16px;"\><span>' + (o + 1) + '. </span>';
                                defaultmapsettings.showTargeting && (t += '<a href=\"#\" data-user-id=\"' + this.top5[o].id + '\" class=\"set-target ogicon-target\"></a> ');
                                //
                                this.w = this.top5[o].x;
                                this.u = this.top5[o].y;
                                /*
                                this.w = window.legendmod.vector[window.legendmod.vnr][0] ? legendmod.translateX(this.top5[o].x) : this.top5[o].x;
                                this.u = window.legendmod.vector[window.legendmod.vnr][1] ? legendmod.translateY(this.top5[o].y) : this.top5[o].y;   
                                */
                                //
                                //t += '<span class=\"hud-main-color\">[' + this.calculateMapSector(this.top5[o].x, this.top5[o].y) + ']</span>',
                                t += '<span class=\"hud-main-color\">[' + this.calculateMapSector(this.w, this.u) + ']</span>';
                                t += '<span class=\"top5-mass-color\">[' + this.shortMassFormat(this.top5[o].mass) + ']</span> ' + this.escapeHTML(this.top5[o].nick) + '</li>';
                            }
                            this['top5pos'].innerHTML = t,
                                i.play && i.playerMass && (e += i.playerMass, s++),
                                this.top5totalMass.textContent = this.shortMassFormat(e),
                                this.top5totalPlayers.textContent = s;
                        }
                    }
                } else {
                    if (defaultmapsettings.showTop5) {
                        //temp
                        var tempTime = new Date().getTime();
                        Object.getOwnPropertyNames(legendmod3.teamPlayers).forEach(function(element) {
                            if (legendmod3.teamPlayers && legendmod3.teamPlayers[element] && legendmod3.teamPlayers[element].lbgpi == -2 && legendmod3.teamPlayers[element].mass > 1) {
                                //console.log(legendmod3.teamPlayers[element].lastUpdatedTime, tempTime);
                                if (legendmod3.teamPlayers[element].lastUpdatedTime && ((legendmod3.teamPlayers[element].lastUpdatedTime) - tempTime < 6000)) {
                                    legendmod3.teamPlayers[element].mass = 1;
                                    legendmod3.teamPlayers[element].alive = false;
                                } else {

                                    legendmod3.top5.push(legendmod3.teamPlayers[element]);
                                }
                            }
                        });
                        //
                        var t = "";
                        var e = 0;
                        var s = this.top5.length;
                        var o = 0;
                        for (; o < s; o++) {
                            e = e + this.top5[o].mass;
                            if (!(o >= window.teamboardlimit && this.top5[o].mass > 1)) {
                                /*
                                t = t + ('<li><a href="#" id="pos-skin" class= "set-target" data-user-id="' + this.top5[o].id + '"style="background-color: ' + this.top5[o].color + 
								'; width: 30px; height:30px; display: inline-block;"><img style="position: absolute; margin-left: 2px; margin-top: 2px; width: 26px; height:26px; display: inline-block;"  src = ' 
								+ (this.top5[o]["skin"] ? this.top5[o]["skin"] : "https://legendmod.ml/banners/icon32croped.ico.gif") + ' alt=""> ' + '</a><div style="margin-top: -30px; margin-left: 32px;">');*/
                                var teamboardskin = this.customSkinsCache[this.top5[o].skin + "_cached2"];
                                if (teamboardskin == null) {
                                    teamboardskin = new Image();
                                    teamboardskin.crossOrigin = 'anonymous';
                                    teamboardskin.src = "https://legendmod.ml/banners/icon32croped.ico.gif";
                                }
                                t = t + ('<li><a href="#" id="pos-skin" class= "set-target" data-user-id="' + this.top5[o].id + '"style="background-color: ' + this.top5[o].color +
                                    '; width: 30px; height:30px; display: inline-block;"><span style="position: absolute; margin-left: 2px; margin-top: 2px; width: 26px; height:26px; display: inline-block;" alt="">' +
                                    teamboardskin.outerHTML + '</span>' + '</a><div style="margin-top: -30px; margin-left: 32px;">');
                                /* if (defaultmapsettings["showTargeting"]) {
                                  t = t + ('<a href="#" data-user-id="' + this.top5[o].id + '" class="set-target ogicon-target"></a> ');
                                } */
                                var flag = false;
                                for (var et = 0; et < legendmod.ghostCells.length; et++) {
                                    if (legendmod.leaderboard[et] && this.top5[o].nick == legendmod.leaderboard[et].nick) {
                                        if (flag == false && window.predictedGhostCells[et]) {
                                            //
                                            var w = window.predictedGhostCells[et].x;
                                            var u = window.predictedGhostCells[et].y;
                                            /*
                                            w = window.legendmod.vector[window.legendmod.vnr][0] ? legendmod.translateX(window.predictedGhostCells[e].x) : window.predictedGhostCells[e].x;
                                            u = window.legendmod.vector[window.legendmod.vnr][1] ? legendmod.translateY(window.predictedGhostCells[e].y) : window.predictedGhostCells[e].y;  		
                                            */
                                            //									
                                            //t = t + ('<span class="hud-main-color">[' + this.calculateMapSector(window.predictedGhostCells[e].x, window.predictedGhostCells[e].y) + "]</span>");	
                                            t = t + ('<span class="hud-main-color">[' + this.calculateMapSector(w+legendmod.mapOffsetX, u+legendmod.mapOffsetY) + "]</span>");
                                            flag = true;
                                        }
                                    }
                                }
                                if (flag == false && this.top5[o].lbgpi >= 0) {
                                    t = t + ('<span class="hud-main-color">[' + this.calculateMapSector(this.top5[o].x, this.top5[o].y) + "]</span>");
                                } else if (flag == false && (this.calculateMapSector(this.top5[o].x, this.top5[o].y) == "C3" || legendmod.gameMode == ":party")) {
                                    t = t + ('<span class="hud-main-color">[' + this.calculateMapSector(this.top5[o].x, this.top5[o].y) + "]</span>");
                                }
                                //temporary socket 3
                                else if (flag == false && this.top5[o].lbgpi == -2) {
                                    if (this.top5[o].temp == true) {
                                        t = t + ('<span class="hud-main-color">[' + 'Temp. Socket' + "]</span>");
                                    } else {
                                        t = t + ('<span class="hud-main-color">[' + this.calculateMapSector(this.top5[o].x, this.top5[o].y) + "]</span>");
                                    }
                                }
                                //t = t + ('<span class="hud-main-color">[' + this.calculateMapSector(this.top5[o].x, this.top5[o].y) + "]</span>");
                                t = t + ('<span class="top5-mass-color">[' + this.shortMassFormat(this.top5[o].mass) + "]</span> " + this.escapeHTML(this.top5[o].nick) + "</div></li>");
                            }
                        }
                        this.top5pos.innerHTML = t;
                        if (i.play && i.playerMass) {
                            e = e + i.playerMass;
                            s++;
                        }
                        this.top5totalMass.textContent = this.shortMassFormat(e);
                        this.top5totalPlayers.textContent = s;
                    }
                }
            },
            /*
                        'setTop5limit': function(t) {
                            t && (this['top5limit'] = t);
                        },
                        "setTop5limit": function(canCreateDiscussions) {
                            if (canCreateDiscussions) {
                                this["top5limit"] = canCreateDiscussions;
                            }
                        }, */

            'displayChatHistory': function(t) {
                if (t) {
                    this.clearChatHistory(!0);
                    for (var e = 0; e < this.chatHistory.length; e++) $('#messages').append('<li><span class=\"message-nick\">' + this.chatHistory[e].nick + ': </span><span class=\"message-text\">' + this.chatHistory[e].message + '</span></li>');
                } else this.clearChatHistory(!1);
            },
            'clearChatHistory': function(t) {
                $('#messages').empty(), t && (toastr['clear'](), defaultmapsettings.showChatBox && ($('#chat-box .message').remove(), this.chatHistory.length = 0));
            },
            'displayChatInfo': function(t, e) {
                t ? toastr.info(h[e + 'A']) : toastr.error(h[e + 'B']);
            },
            'setDisableChat': function() {
                defaultmapsettings.hideChat = defaultmapsettings.disableChat;
                this.setHideChat();
            },
            'hideChat': function() {
                defaultmapsettings.hideChat = !defaultmapsettings.hideChat, this.setHideChat(), this.displayChatInfo(!defaultmapsettings.hideChat, 'hideChatMsg');
            },
            'setHideChat': function() {
                if (defaultmapsettings.hideChat) {
                    $('#message-box').hide();
                }
                this.setShowChatBox();
            },
            'setShowChatBox': function() {
                !defaultmapsettings.hideChat && defaultmapsettings.showChatBox ? $('#chat-box').show() : $('#chat-box').hide();
            },
            'enterChatMessage': function() {
                var t = $('#message-box');
                var e = $('#message');
                if (t.is(':visible')) {
                    var o = e.val();
                    o.length ? (this['sendChatMessage'](101, o), i.play && (e.blur(), t.hide())) : (e.blur(), t.hide()), e.val('');
                } else {
                    t.show();
                    e.focus();
                    e.val('');
                }
            },
            'showMenu': function(t) {
                if (window.MC && window.MC.showNickDialog) return $('.ogario-menu').show(), $('.menu-panel').hide(), i.play || this.skipStats ? $('#main-panel').show() : $('#stats').show(), window.MC.showNickDialog(300), $('#oferwallContainer').is(':visible') && window.closeOfferwall(), void($('#videoContainer').is(':visible') && window.closeVideoContainer());
                t ? $('#overlays').fadeIn(t) : $('#overlays').show();
            },
            'hideMenu': function(t) {
                window.MC && window.MC.showNickDialog ? $('.ogario-menu').hide() : t ? $('#overlays').fadeOut(t) : $('#overlays').hide();
            },
            'escapeHTML': function(t) {
                return String(t).replace(/[&<>"'\/]/g, function(t) {
                    return escapeHTMLs[t];
                });
            },
            'checkSkinURL': function(t) {
                //return /^https?:\/\/i\.(?:imgur|hizliresim)\.com\/\w{6,8}\.(?:jpg|jpeg|png)\??\d*$/i .test(t) ? t.replace('http:', 'https:') : '';
                return t.replace('http:', 'https:');
                //return /^https?:\/\/(i|s))\.(?:imgur|hizliresim|put)\.(com|re)\/\w{6,8}\.(?:jpg|jpeg|png)\??\d*$/i .test(t) ? t.replace('http:', 'https:') : '';
            },
            'loadSettings': function() {
                var t = null;
                for (var s in null !== window.localStorage.getItem('ogarioSettings') && (t = JSON.parse(window.localStorage.getItem('ogarioSettings'))), defaultmapsettings) defaultmapsettings.hasOwnProperty(s) && (t && t.hasOwnProperty(s) && (defaultmapsettings[s] = t[s]), i.hasOwnProperty(s) && (i[s] = defaultmapsettings[s]));

            },
            'saveSettings': function(t, i) {
                window.localStorage.setItem(i, JSON.stringify(t));
            },
            'exportSettings': function() {
                var t = {
                    'ogarioCommands': c,
                    'ogarioHotkeys': ogario1Hotkeys,
                    'ogarioPlayerProfiles': ogario1PlayerProfiles,
                    'ogarioSettings': defaultmapsettings,
                    'ogarioThemeSettings': defaultSettings
                };
                for (var e in t) {
                    if (t.hasOwnProperty(e)) $('#export-' + e).prop('checked') || delete t[e];
                }
                t = JSON.stringify(t), $('#export-settings').val(t), $('#import-settings').val(''), t = null;
            },
            'importSettings': function() {
                $('#import-settings').blur();
                var t = $('#import-settings').val();
                if (t) {
                    for (var i in t = JSON.parse(t))
                        if (t.hasOwnProperty(i)) {
                            if (!$('#import-' + i).prop('checked')) continue;
                            window.localStorage.setItem(i, JSON.stringify(t[i]));
                        }
                    window.location.reload();
                }
            },
            'restoreSettings': function() {
                null !== window.localStorage.getItem('ogarioSettings') && (window.localStorage.removeItem('ogarioSettings'), window.location.reload());
            },
            'setSettings': function(t, e) {
                if (defaultmapsettings.hasOwnProperty(t) && null !== e) {
                    switch (defaultmapsettings[t] = e, i.hasOwnProperty(t) && (i[t] = e), t) {
                        case 'autoResp':
                            this.setAutoResp();
                            break;
                        case 'showMiniMap':
                            this.setMiniMap();
                            break;
                        case 'showMiniMapGrid':
                            this.resetMiniMapSectors();
                            break;
                        case 'disableChat':
                            this.setDisableChat();
                            break;
                        case 'chatSounds':
                            this.setChatSoundsBtn();
                            break;
                        case 'showChatBox':
                            this.setShowChatBox();
                            break;
                        case 'showTop5':
                            this.setTop5();
                            break;
                        case 'showTargeting':
                            this.setTargetingHUD();
                            break;
                        case 'showTime':
                            this.displayTime(), $('#time-hud').show();
                            break;
                        case 'centeredLb':
                            this.setCenteredLb();
                            break;
                        case 'normalLb':
                            this.setNormalLb();
                            break;
                        case 'fpsAtTop':
                            this.setFpsAtTop();
                            break;
						case 'tweenMaxEffect':
							this.setTweenMaxEffect();
							break;
						case 'showPartyBots':
							this.displayPartyBots();
							break;							
                        case 'showStats':
                            this.displayStats();
							$('#stats-hud').show();
                            break;
                        case 'blockPopups':
                            this.setBlockPopups();
                    }
                    this.saveSettings(defaultmapsettings, 'ogarioSettings');
                }
            },
            'loadProfiles': function() {
                if (null !== window.localStorage.getItem('ogarioPlayerProfiles')) {
                    ogario1PlayerProfiles = JSON.parse(window.localStorage.getItem('ogarioPlayerProfiles'))
                    if (ogario1PlayerProfiles.length == 10) { //fix for old players
                        for (var t = 10; t < 15; t++) ogario1PlayerProfiles.push({
                            'nick': 'Profile #' + (t + 1),
                            'clanTag': '',
                            'skinURL': '',
                            'color': defaultSettings.mainColor
                        });
                    }
                } else {
                    for (var t = 0; t < 15; t++) ogario1PlayerProfiles.push({
                        'nick': 'Profile #' + (t + 1),
                        'clanTag': '',
                        'skinURL': '',
                        'color': defaultSettings.mainColor
                    });
                }
                if (null !== window.localStorage.getItem('ogarioSelectedProfile')) {
                    this.selectedProfile = JSON.parse(window.localStorage.getItem('ogarioSelectedProfile'));
                }
                ogarcopythelb.nick = ogario1PlayerProfiles[this.selectedProfile].nick;
                ogarcopythelb.clanTag = ogario1PlayerProfiles[this.selectedProfile].clanTag;
                ogarcopythelb.skinURL = ogario1PlayerProfiles[this.selectedProfile].skinURL;
                ogarcopythelb.color = ogario1PlayerProfiles[this.selectedProfile].color;
            },
            'changeSkinPreview': function(e, t) {
                //console.log(e,t);
                if (!t || !e) {
                    return;
                }
                if ("skin-preview" === t) { //or if ("skin-preview" === e)
                    //console.log(e,e.src);

                    if (e.src.includes(".mp4") || e.src.includes(".webm") || e.src.includes(".ogg")) { //console.log("stage 3a videos");
                        $("#skin-preview").children().remove();
                        $("#skin-preview").removeClass("default");
                        $("#skin-preview").append('<a href="#" id="skin-popover" data-toggle="popover" title="" data-html="true" data-content="<video src=\'' + e.src + "' width='350'>\"></a>");
                        $("#skin-popover").append('<video id="videoskinpreview" src=\'' + e.src + "' width='350' controls>\"></video>");
                        //						$("#skin-popover").popover();

                        //$("#skin-preview").append('<a href="#" id="skin-popover" data-toggle="popover" title="" data-html="true" data-content="<video src=\'' + t.src + "' width='500'>\"></a>");
                    } else {
                        //console.log("default settings for images on changeSkinPreview")
                        $("#skin-preview").removeClass("default");
                        $("#skin-preview").append('<a href="#" id="skin-popover" data-toggle="popover" title="" data-html="true" data-content="<img src=\'' + e.src + "' width='500'>\"></a>");
                    }
                    $("#skin-popover").append($(e).fadeIn(1000));
                    $("#skin-popover").popover();
                } else {
                    if (e.src.includes(".mp4") || e.src.includes(".webm") || e.src.includes(".ogg")) { //console.log("stage 3b videos");
                        $("#" + t).removeClass("default");
                        $("#" + t).append($(e).fadeIn(1000));

                    } else {
                        $("#" + t).removeClass("default");
                        $("#" + t).append($(e).fadeIn(1000));
                    }
                }

            },
            'setSkinPreview': function(t, e) {
                if (t.includes && (t.includes(".mp4") || t.includes(".webm") || t.includes(".ogg"))) {
                    //if (t.includes(".mp4") || t.includes(".webm") || t.includes(".ogg")) {
                    //console.log("stage 1 videos");

                    if ($('#' + e).empty().addClass('default'), t && 0 != t.length) {
                        //console.log("stage 1 images/videos: " + t);
                        var i = this;
                        o = new Video();
                        o.src = t;
                        // o = new Image();
                        o.crossOrigin = 'anonymous';
                        setTimeout(function() {
                            //newo.onload = function() {
                            i.changeSkinPreview(o, e);
                            checkVideos3(o);
                            //};
                        }, 500);

                    }
                } else {
                    checktypeImgVid = new Image();
                    //console.log("stage 1 images");

                    if ($('#' + e).empty().addClass('default'), t && 0 != t.length) {
                        //console.log("stage 1 images/videos: " + t);
                        var i = this,
                            o = checktypeImgVid;
                        o.src = t;
                        // o = new Image();
                        o.crossOrigin = 'anonymous',
                            o.onload = function() {
                                i.changeSkinPreview(o, e);
                            };
                    }
                }
            },
            'setProfile': function() {
                var t = (ogario1PlayerProfiles.length + this.selectedProfile - 1) % ogario1PlayerProfiles.length,
                    e = (this.selectedProfile + 1) % ogario1PlayerProfiles.length;
                //console.log(ogario1PlayerProfiles.length);
                this.setSkinPreview(ogario1PlayerProfiles[t].skinURL, 'prev-profile');
                this.setSkinPreview(ogario1PlayerProfiles[this.selectedProfile].skinURL, 'skin-preview');
                this.setSkinPreview(ogario1PlayerProfiles[e].skinURL, 'next-profile');
                this.saveSettings(this.selectedProfile, 'ogarioSelectedProfile');
                $('#nick').val(ogario1PlayerProfiles[this.selectedProfile].nick);
                $('#clantag').val(ogario1PlayerProfiles[this.selectedProfile].clanTag);
                $('#skin').val(ogario1PlayerProfiles[this.selectedProfile].skinURL);
                $('#color').val(ogario1PlayerProfiles[this.selectedProfile].color);
                $('.skin')['colorpicker']('setValue', ogario1PlayerProfiles[this.selectedProfile].color);
                $('#skins a').removeClass('selected');
                $('#skins a[data-profile=\'' + this.selectedProfile + '\']').addClass('selected');
            },
            'prevProfile': function() {
                this.setPlayerSettings(),
                    this.selectedProfile = (ogario1PlayerProfiles.length + this.selectedProfile - 1) % ogario1PlayerProfiles.length, this.setProfile();
            },
            'nextProfile': function() {
                this.setPlayerSettings(),
                    this.selectedProfile = (this.selectedProfile + 1) % ogario1PlayerProfiles.length, this.setProfile();
            },
            'selectProfile': function(t) {
                this.setPlayerSettings();
                this.selectedProfile = parseInt(t);
                this.setProfile();
            },
            'addOption': function(t, e, i, o) {
                $(t).append('<label><input type=\"checkbox\" id=\"' + e + '\" class=\"js-switch\"> ' + i + '</label>');
                $('#' + e).prop('checked', o);
            },
            'addOptions': function(t, e) {
                if (t) {
                    $('#og-options').append('<div class=\"options-box ' + e + '\"><h5 class=\"menu-main-color\">' + h[e] + '</h5></div>');
                    for (var i = 0; i < t.length; i++) {
                        var o = t[i];
                        if (defaultmapsettings.hasOwnProperty(o)) {
                            $('.' + e).append('<label>' + h[o] + ' <input type=\"checkbox\" class=\"js-switch\" id=\"' + o + '\"></label>');
                            $('#' + o).prop('checked', defaultmapsettings[o]);
                        }
                    }
                }
            },
            'addInputBox': function(t, e, i, o) {
                $(t).append('<div class=\"input-box\"><span class=\"title-box\">' + h[e] + '</span><input id=\"' + e + '\" class=\"form-control\" placeholder=\"' + i + '\" value=\"' + defaultmapsettings[e] + '\" /></div>');
                var a = this;
                $('#' + e).on('input', function() {
                    defaultmapsettings[e] = this.value, a[o](), 
					a.saveSettings(defaultmapsettings, 'ogarioSettings');
                });
            },
            'addSliderBox': function(t, e, o, a, n, r) {
                $(t).append('<div class=\"slider-box\"><div class=\"box-label\"><span class=\"value-label\">' + h[e] + ': </span><span id=\"' + e + '-value\" class=\"value\">' + defaultmapsettings[e] + '</span></div><input id=\"' + e + '-slider\" type=\"range\" min=\"' + o + '\" max=\"' + a + '\" step=\"' + n + '\" value=\"' + defaultmapsettings[e] + '\"></div>');
                var l = this;
                r ? $('#' + e + '-slider').on('input', function() {
                    var t = parseFloat($(this).val());
                    $('#' + e + '-value').text(t), defaultmapsettings[e] = t, i.hasOwnProperty(e) && (i[e] = t), l[r](),
					l.saveSettings(defaultmapsettings, 'ogarioSettings');
                }) : $('#' + e + '-slider').on('input', function() {
                    var t = parseFloat($(this).val());
                    $('#' + e + '-value').text(t), defaultmapsettings[e] = t, i.hasOwnProperty(e) && (i[e] = t),
					l.saveSettings(defaultmapsettings, 'ogarioSettings');
                });
            },
            'setLang': function() {
                if ('pl' === r && window.i18n_dict && window.i18n_dict.en)
                    for (var t in window.i18n_dict.en) window.i18n_dict.en.hasOwnProperty(t) && h.hasOwnProperty(t) && (window.i18n_dict.en[t] = h[t]);
            },
            'setMenu': function() {
                var t;
                for (t in document.title = this.name,
                    $("#mainPanel").before('<div id="exp-bar" class="agario-panel"><span class="ogicon-user"></span><div class="agario-exp-bar progress"><span class="progress-bar-text"></span><div class="progress-bar progress-bar-striped" style="width: 0%;"></div></div><div class="progress-bar-star"></div></div><div id="main-menu" class="agario-panel"><ul class="menu-tabs"><li class="start-tab active"><a href="#main-panel" class="active ogicon-home" data-toggle="tab-tooltip" title="' +
                        h.start + '"></a></li><li class="profile-tab"><a href="#profile" class="ogicon-user" data-toggle="tab-tooltip" title="' + h.profile + '"></a></li><li class="settings-tab"><a href="#og-settings" class="ogicon-cog" data-toggle="tab-tooltip" title="' + h.settings + '"></a></li><li class="theme-tab"><a href="#theme" class="ogicon-droplet" data-toggle="tab-tooltip" title="' + h.theme + '"></a></li><li class="hotkeys-tab"><a href="#" class="hotkeys-link ogicon-keyboard" data-toggle="tab-tooltip" title="' +
                        h.hotkeys + '"></a></li><li class="music-tab"><a href="#music" class="ogicon-music" data-toggle="tab-tooltip" title="Radio / ' + h.sounds + '"></a></li></ul><div id="main-panel" class="menu-panel"></div><div id="profile" class="menu-panel"></div><div id="og-settings" class="menu-panel"><div class="submenu-panel"></div></div><div id="theme" class="menu-panel"></div><div id="music" class="menu-panel"></div></div>'),
                    $("#main-panel").append('<a href="#" class="quick quick-menu ogicon-menu"></a><a href="#" class="quick quick-bots ogicon-trophy" style="display: none;"></a><a href="#" class="quick quick-skins ogicon-images"></a><div id="profiles"><div id="prev-profile"></div><div id="skin-preview"></div><div id="next-profile"></div></div>'),
                    $("#mainPanel div[role=form]").appendTo($("#main-panel")),
                    $("#main-panel div[role=form] .form-group:first").remove(),
                    $("#nick").before('<input id="clantag" class="form-control" placeholder="Tag, e.g  \Lc" maxlength="10"><div class="input-group nick"></div>'),
                    $("#nick").appendTo($(".nick")),
                    $(".nick").append('<span class="input-group-btn"><button id="stream-mode" class="btn active ogicon-eye"></button></span>'),
                    $(".nick").after('<div class="input-group skin"><input id="skin" class="form-control" placeholder="Skin URL (imgur.com direct link)" maxlength="40"><input type="hidden" id="color" value="' + ogarcopythelb.color + '" maxlength="7" /><span class="input-group-addon"><i></i></span><span class="input-group-btn"><button id="hide-url" class="btn active ogicon-eye"></button></span></div>'),
                    $("#locationKnown, #locationUnknown").insertAfter($(".skin")),
                    $("#region").before('<button class="btn btn-warning btn-server-info ogicon-cogs"></button>'),
                    $(".btn-spectate, .btn-logout").appendTo("#agario-main-buttons"),
                    $("#agario-main-buttons").addClass("clearfix").before('<div id="server-info" class="form-group clearfix"><input id="server-ws" class="form-control" placeholder="Server WS"><button id="server-connect" class="btn btn-success ogicon-power"></button><button id="server-reconnect" class="btn btn-primary ogicon-redo2"></button><input id="server-token" class="form-control" placeholder="Server token"><button id="server-join" class="btn btn-success" data-itr="page_join_party">Join</button></div>'),
                    $("#helloContainer div[role=form]").after('<div id="ogario-party" class="clearfix"><input id="party-token" class="form-control" placeholder="Party token"></div>'),
                    $("#ogario-party").append('<button id="join-party-btn-2" class="btn btn-success" data-itr="page_join_party">Join</button><button id="create-party-btn-2" class="btn btn-primary" data-itr="page_create_party">Create</button>'),
                    $("#pre-join-party-btn:first, #join-party-btn:first, #create-party-btn:first, #leave-party-btn:first, #joinPartyToken:first, .party-icon-back:first").appendTo($("#ogario-party")),
                    $("#settingsChoice, #options").appendTo($("#og-settings .submenu-panel")),
                    $("#stats").appendTo($("#main-menu")).addClass("menu-panel"),
                    $("#statsContinue").attr("id", "statsContinue2"),
                    $("#mainPanel").empty().remove(),
                    $(".center-container").addClass("ogario-menu"),
                    $(".center-container").append('<div id="menu-footer" class="menu-main-color">' + h.visit + ' <a href="http://legendmod.ml" target="_blank">legendmod.ml</a> | ' + this.version + ' <a href="https://goo.gl/nRREoR" class="release ogicon-info" target="_blank"></a></div>'),
                    $("#leftPanel, #rightPanel").addClass("ogario-menu").removeAttr("id"),
                    $(".agario-profile-panel, .agario-panel-freecoins, .agario-panel-gifting, .agario-shop-panel, #dailyquests-panel").appendTo($("#profile")).removeClass("agario-side-panel"),
                    $(".agario-profile-panel").after('<div id="block-warn">' + h.blockWarn + '<br><a href="#" id="unblock-popups">' + h.unblockPopups + "</a></div>"),
                    $("#exp-bar").addClass("agario-profile-panel"), $(".left-container").empty(),
                    $(".agario-shop-panel").after('<div class="agario-panel ogario-yt-panel"><h5 class="menu-main-color">The Legend Mod Project</h5><div class="g-ytsubscribe" data-channelid="UCoj-ZStcJ0jLMOSK7FOBTbA" data-layout="full" data-theme="dark" data-count="default"></div></div>'),
                    $("#tags-container").appendTo($("#profile")),
                    $(".btn-logout").appendTo($("#profile")),
                    $(".left-container").append('<div id="quick-menu" class="agario-panel agario-side-panel"><a href="https://legendmod.ml/skins/" class="quick-more-skins ogicon-grin" target="_blank" data-toggle="tab-tooltip" data-placement="left" title="' + h.skins + '"></a><a href="https://youtube.com/channel/UCoj-ZStcJ0jLMOSK7FOBTbA" class="quick-yt ogicon-youtube2" target="_blank" data-toggle="tab-tooltip" data-placement="left" title="The Legend mod Project"></a></div>'),
                    $(".left-container").append(`<div id="quick-bots" class="agario-panel agario-side-panel"><h2 id="botsInfo"></h2>									
					<h5 id="botsAuthor" class="main-color">Party bots</h5>
					<div id="botClient" style="margin-left:15px; margin-right:15px; font-family: Tahoma; color: rgb(255, 255, 255); z-index: 9999; border-radius: 5px; min-height: 16px; min-width: 200px; background-color: rgba(2, 0, 0, 0.4);">
					<div><b>Bot Count</b>: <span id="botCount" class="label label-info pull-right">Waiting</span></div>
					<b><div><b>ServerSlots</b>: <span id="slots" class="label label-info pull-right">Waiting</span></div>
					<b><div><b>Captcha tokens</b>: <span id="captchatokens" class="label label-info pull-right">0</span></div>
					</b></div>					
					<span id="statusTextBots">Status: <b id="userStatus">Disconnected</b></span>
					<br>
					<span id="aiTextBots">Bots AI: <b id="botsAI">Disabled</b></span>
					<br>
					<input type="text" id="botsNameLM" placeholder="Bots Name" maxlength="15" spellcheck="false" style="display:inline-block;">
					<input type="number" id="botsAmount" placeholder="Bots Amount" min="1" max="199" spellcheck="false">
					<input type="number" id="captchaSpeed" step="0.1" placeholder="Captcha delay (sec)" min="0" max="10" spellcheck="false">
					<input type="text" id="botsRemoteIP" placeholder="ws://localhost:1337" maxlength="100" spellcheck="false">

					<br>
					<button id="connectBots" class="btn btn-success">Connect</button>
					<br>
					<button id="startBots" class="btn btn-primary btn" disabled>Start Bots</button>
					<button id="captchaBots" class="btn btn-primary btn"  style="display:none;" disabled>Request 1000 captcha tokens</button>
					<button id="stopBots" class="btn btn-danger">Stop Bots</button>
					<div><span id="handleCaptchaBotsArea" style="display: none"><input type="checkbox" id="handleCaptchaBots"></input> <b>Handle bots with captcha</b>
					<br>
					<div id="handleCaptchaBotsAreaSettings" style="display: none"><input type="checkbox" id="solveCaptchaBots" disabled></input> <b>Solve captcha when loosing</b>
					<br>
					<input type="checkbox" id="pushCaptchaBots" disabled></input> <b>Push more bots</b>					
					</span></div></div>					
					<br><u><a href="https://github.com/jimboy3100/jimboy3100.github.io/tree/master/ExampleScripts/agario-bots2" target="_blank">Installation</a></u>	
					<u><a href="https://www.youtube.com/watch?v=rQMhxwIytro&feature=youtu.be" target="_blank">Tutorial video for PC node.js</a></u>	
					<u><a href="https://repl.it/@legendmod/party-bots" target="_blank">Repl.it VPS</a></u>	
					<u><a href="https://www.youtube.com/watch?v=xIupgFR7ZTY" target="_blank">Tutorial video for repl.it VPS</a></u>	
					</div>`),
                    this.protocolMode || $("#quick-menu").prepend('<a href="#" class="quick-shop ogicon-cart" data-toggle="tab-tooltip" data-placement="left" title="' + h.page_shop + '"></a><a href="#" class="quick-free-coins ogicon-coin-dollar" data-toggle="tab-tooltip" data-placement="left" title="' + h.page_menu_main_free_coins + '"></a><a href="#" class="quick-free-gifts ogicon-gift" data-toggle="tab-tooltip" data-placement="left" title="' + h.page_menu_main_gifts + '"></a><a href="#" class="quick-quests ogicon-trophy" data-toggle="tab-tooltip" data-placement="left" title="' + h.page_menu_main_dailyquests + '"></a>'),
                    $(".party-dialog, .partymode-info").remove(),
                    $(".agario-party-6").appendTo($(".center-container")),
                    $(".right-container").empty(),
                    $(".right-container").append('<div class="agario-party"></div>'),
                    $(".agario-party-6").appendTo($(".agario-party")).addClass("agario-panel agario-side-panel"),
                    $(".agario-party h4, #cancel-party-btn").remove(),
                    $(".agario-party .btn").addClass("btn-sm"),
                    $(".right-container").append('<div id="skins-panel" class="agario-panel agario-side-panel"><div id="skins"></div><a href="https://ogario.ovh/skins/" id="more-skins" class="btn btn-block btn-success" target="_blank">' + h.moreSkins + "</a></div>"),
                    $(".btn-settings, .text-muted, .tosBox, .agario-promo, #agario-web-incentive, span[data-itr='page_option_dark_theme'], #options #darkTheme").remove(),
                    $("#advertisement, #adbg, #a320x250, #g320x250, #s320x250, #adsBottom").css("display", "none"),
                    $("#advertisement").removeClass("agario-panel"), $("#adsBottom").css({
                        "z-index": "1",
                        "opacity": "0",
                        "bottom": "-100px"
                    }), $("#noNames, #showMass").remove(), $("#og-settings .submenu-panel").append('<div id="og-options"></div>'),
                    this.addOptions([], "animationGroup"),
                    this.addOptions(["autoZoom"], "zoomGroup"),
                    this.addOptions(["quickResp", "autoResp"], "respGroup"),
                    this.addOptions(["noNames", "optimizedNames", "autoHideNames", "hideMyName", "hideTeammatesNames", "namesStroke"], "namesGroup"),
                    this.addOptions(["showMass", "optimizedMass", "autoHideMass", "hideMyMass", "hideEnemiesMass", "shortMass", "virMassShots", "massStroke", "virusSound"], "massGroup"),
                    this.protocolMode ? this.addOptions(["customSkins", "jellyPhisycs", "videoSkins", "videoSkinsMusic"], "skinsGroup") : this.addOptions(["customSkins", "vanillaSkins", "jellyPhisycs", "videoSkins", "videoSkinsMusic"], "skinsGroup"),
                    this.addOptions(["optimizedFood", "autoHideFood", "autoHideFoodOnZoom", "rainbowFood"], "foodGroup"),
                    this.addOptions(["myCustomColor", "myTransparentSkin", "transparentSkins", "transparentCells", "transparentViruses", "virusGlow"], "transparencyGroup"),
                    this.addOptions(["showGrid", "showBgSectors", "showMapBorders", "borderGlow"], "gridGroup"),
                    this.addOptions(["disableChat", "chatSounds", "chatEmoticons", "showChatImages", "showChatVideos", "showChatBox", "hidecountry"], "chatGroup"),
                    this.addOptions(["rotateMap", "showMiniMap", "showMiniMapGrid", "showMiniMapGuides", "showExtraMiniMapGuides", "showMiniMapGhostCells", "oneColoredTeammates"], "miniMapGroup"),
                    this.addOptions(["oppColors", "oppRings", "virColors", "splitRange", "qdsplitRange", "sdsplitRange", "virusesRange", "cursorTracking", "teammatesInd", "showGhostCells", "showGhostCellsInfo", "showPartyBots", "teamView"], "helpersGroup"), //Sonia2
                    this.addOptions(["mouseSplit", "mouseFeed", "mouseInvert"], "mouseGroup"),
                    this.addOptions(["showTop5", "showTargeting", "showLbData", "centeredLb", "normalLb", "fpsAtTop", "tweenMaxEffect"], "hudGroup"),
                    this.addOptions(["showStats", "showStatsMass", "showStatsESTE", "showStatsEMTE", "showStatsMTE", "showStatsSTE", "showStatsTTE", "showStatsPTE", "showStatsN16", "showStatsFPS", "showTime"], "statsGroup"),
                    this.addOptions([], "macroGroup"),
                    this.protocolMode || (this.addOptions(["blockPopups"], "extrasGroup"),
                        $("#noSkins, #noColors, #skipStats, #showQuest").addClass("js-switch-vanilla"),
                        $(".skinsGroup h5").after('<label class="noSkins">' + h.noSkins + " </label>"),
                        $("#noSkins").appendTo($(".noSkins")), $(".transparencyGroup h5").after('<label class="noColors">' + h.noColors + " </label>"),
                        $("#noColors").appendTo($(".noColors")),
                        $(".extrasGroup h5").after('<label class="skipStats">' + h.skipStats + " </label>"),
                        $("#skipStats").appendTo($(".skipStats")),
                        $(".skipStats").after('<label class="showQuest">' + h.showQuest + " </label>"),
                        $("#showQuest").appendTo($(".showQuest")),
                        $("#options").remove(),
                        $("#settingsChoice").appendTo($(".extrasGroup")).addClass("select-wrapper")),
                    this.addSliderBox(".animationGroup", "animation", 20, 200, 1),
                    this.addSliderBox(".zoomGroup", "zoomSpeedValue2", -0.90, 0.90, 0.01),
                    this.addSliderBox(".macroGroup", "macroFeeding", 1, 160, 1),
                    $("#og-settings").append('<button class="btn btn-block btn-success btn-export">' + h.exportImport + "</button>"),
                    $("#og-settings").append('<div class="restore-settings"><a href="#">' + h.restoreSettings + "</a></div>"),
                    $("#music").append('<div class="agario-panel radio-panel"><h5 class="menu-main-color">Radio (' + h.thanks + ')</h5><audio src="" controls></audio><span class="playlist"><span class="ogicon-file-music"></span> <a href="" target="_blank">' + h.playlist + "</a></span></div>"),
                    $("#music").append('<div class="agario-panel sounds-panel"><h5 class="menu-main-color">' + h.sounds + "</h5></div>"),
                    $("#music").append('<div class="agario-panel ogario-yt-panel"><h5 class="menu-main-color">Legend Clan (tag: \u24c2)</h5><div class="g-ytsubscribe" data-channelid="UCoj-ZStcJ0jLMOSK7FOBTbA" data-layout="full" data-theme="dark" data-count="default"></div></div>'),
                    this.addInputBox(".sounds-panel", "messageSound", "Sound URL", "setMessageSound"),
                    this.addInputBox(".sounds-panel", "commandSound", "Sound URL", "setCommandSound"),
                    this.addInputBox(".sounds-panel", "virusSoundurl", "Sound URL", "setvirusSound"),
                    $("body").append('<div id="overlays-hud" data-gamemode=":ffa"><div id="stats-hud" class="hud stats-hud-color"></div> <div id="top5-hud" class="hud"><h5 class="hud-main-color">Team<span class="team-top"></span></h5><ol id="top5-pos"></ol><div id="top5-total"><span class="hud-main-color ogicon-users"></span> ' + //<div class="hud-main-color team-top-menu"><a href="#" data-limit="5" class="team-top-limit active">5</a> | <a href="#" data-limit="10" class="team-top-limit">10</a> | <a href="#" data-limit="100" class="team-top-limit">100</a></div><ol id="top5-pos"></ol><div id="top5-total"><span class="hud-main-color ogicon-users"></span> ' +
                        h.totalPartyPlayers + ': <span id="top5-total-players" class="top5-mass-color">0</span>   <span class="hud-main-color ogicon-pacman"></span> ' +
                        h.totalPartyMass + ': <span id="top5-total-mass" class="top5-mass-color">0</span></div></div> <div id="time-hud" class="hud time-hud-color"></div> <div id="pause-hud" class="hud">' +
                        //h.pause + '</div> <div id="leaderboard-hud" class="hud-b"><h5 class="hud-main-color">legendmod.ml</h5><div id="leaderboard-data"></div><div id="leaderboard-positions"></div></div> <div id="btl-leaderboard-hud"><div class="hud hud-c"><span id="btl-players-status">Players ready</span>: <span id="btl-players-count">0</span></div></div> <div id="minimap-hud" class="hud-b"><canvas id="minimap-sectors"></canvas><canvas id="minimap"></canvas></div><div id="target-hud" class="hud"><div id="target-player"><span id="target-skin"><img src="https://legendmod.ml/banners/static/img/blank.png" alt=""> </span><span id="target-nick"></span><span id="target-status" class="hud-main-color">' + //class="hud-main-color">[' +
                        h.pause + '</div> <div id="leaderboard-hud" class="hud-b"><h5 class="hud-main-color">legendmod.ml</h5><div id="leaderboard-data"></div><div id="leaderboard-positions"></div></div> <div id="btl-leaderboard-hud"><div class="hud hud-c"></div></div> <div id="minimap-hud" class="hud-b"><canvas id="minimap-sectors"></canvas><canvas id="minimap"></canvas></div><div id="target-hud" class="hud"><div id="target-player"><span id="target-skin"><img src="https://legendmod.ml/banners/static/img/blank.png" alt=""> </span><span id="target-nick"></span><span id="target-status" class="hud-main-color">' + //class="hud-main-color">[' +
						h.targetNotSet + '</span></div><div id="target-summary"></div></div><div id="target-panel-hud" class="hud"><a href="#" id="set-targeting" class="ogicon-target"></a><a href="#" id="set-private-minimap" class="ogicon-location2"></a><a href="#" id="cancel-targeting" class="ogicon-cancel-circle"></a><a href="#" id="change-target" class="ogicon-arrow-right"></a></div> <div id="quest-hud" class="hud"></div> <div id="btl-hud" class="hud"></div></div>'),
                    $("body").append('<ul id="messages"></ul>'),
                    $("body").append('<div id="message-box"><div id="chat-emoticons"></div><div id="message-menu"><a href="#" class="chat-sound-notifications ogicon-volume-high"></a><a href="#" class="chat-active-users ogicon-user-check"></a><a href="#" class="chat-muted-users ogicon-user-minus"></a><a href="#" class="show-chat-emoticons ogicon-smile"></a></div><input type="text" id="message" class="form-control" placeholder="' +
                        h.enterChatMsg + '..." maxlength="80"></div>'),
                    $("body").append('<div id="chat-box"></div>'), emoticonicons) {
                    if (emoticonicons.hasOwnProperty(t)) {
                        $("#chat-emoticons").append('<img src="https://legendmod.ml/banners/emoticons/' + emoticonicons[t] + '" alt="' + t + '" class="emoticon">');
                    }
                }
                $("body").append('<div id="exp-imp"><div id="exp-imp-menu"><button id="close-exp-imp" class="btn btn-danger">' + h.close + '</button></div><div id="exp-imp-settings"></div></div>'),
                    $("#exp-imp-settings").append("<h1>" + h.exportSettings + "</h1><h2>" + h.exportInfo + "</h2>"),
                    this.addOption("#exp-imp-settings", "export-ogarioCommands", h.commands, true),
                    this.addOption("#exp-imp-settings", "export-ogarioHotkeys", h.hotkeys, true),
                    this.addOption("#exp-imp-settings", "export-ogarioPlayerProfiles",
                        h.profiles, true), this.addOption("#exp-imp-settings", "export-ogarioSettings", h.settings, true),
                    this.addOption("#exp-imp-settings", "export-ogarioThemeSettings", h.theme, true),
                    $("#exp-imp-settings").append('<textarea id="export-settings" class="form-control" rows="14" cols="100" spellcheck="false" readonly /><button id="export-settings-btn" class="btn btn-block btn-success">' + h.exportSettings + "</button>"),
                    $("#exp-imp-settings").append("<h1>" + h.importSettings + "</h1><h2>" +
                        h.importInfo + "</h2>"), this.addOption("#exp-imp-settings", "import-ogarioCommands", h.commands, true),
                    this.addOption("#exp-imp-settings", "import-ogarioHotkeys", h.hotkeys, true),
                    this.addOption("#exp-imp-settings", "import-ogarioPlayerProfiles", h.profiles, true),
                    this.addOption("#exp-imp-settings", "import-ogarioSettings", h.settings, true),
                    this.addOption("#exp-imp-settings", "import-ogarioThemeSettings", h.theme, true),
                    $("#exp-imp-settings").append('<textarea id="import-settings" class="form-control" rows="14" cols="100" spellcheck="false" /><button id="import-settings-btn" class="btn btn-block btn-success">' +
                        h.importSettings + "</button>"), hudsetter && hudsetter.setThemeMenu();
                /** @type {number} */
                var e = 0;
                for (; e < ogario1PlayerProfiles.length; e++) {
                    $("#skins").append('<div class="skin-box"><a href="#profile-' + e + '" id="profile-' + e + '" data-profile="' + e + '"></a></div>');
                    this.setSkinPreview(ogario1PlayerProfiles[e].skinURL, "profile-" + e);
                    if (e == this.selectedProfile) {
                        $("#profile-" + e).addClass("selected");
                    }
                }
            },
            'setUI': function() {
                var t = this;
                $(document).on("click", ".menu-tabs a", function(event) {
                    event.preventDefault();
                    t.switchMenuTabs($(this), "menu-panel");
                });
                $(document).on("click", ".submenu-tabs a", function(event) {
                    event.preventDefault();
                    t.switchMenuTabs($(this), "submenu-panel");
                });
                $(document).on("click", ".quick-menu", function(event) {
                    event.preventDefault();
                    defaultmapsettings.showQuickMenu = !defaultmapsettings.showQuickMenu;
                    //defaultmapsettings.showQuickBots=false;
                    t.saveSettings(defaultmapsettings, "ogarioSettings");
                    t.setShowQuickMenu();
                });
                $(document).on("click", ".quick-bots", function(event) {
                    event.preventDefault();
                    defaultmapsettings.showQuickBots = !defaultmapsettings.showQuickBots;
                    //defaultmapsettings.showQuickMenu=false;
                    t.saveSettings(defaultmapsettings, "ogarioSettings");
                    t.setShowQuickBots();
                });
                $(document).on("click", ".quick-skins", function(event) {
                    event.preventDefault();
                    defaultmapsettings.showSkinsPanel = !defaultmapsettings.showSkinsPanel;
                    t.saveSettings(defaultmapsettings, "ogarioSettings");
                    t.setShowSkinsPanel();
                });
                $(document).on("change", "#region", function() {
                    t.region = this.value;
                });
                $(document).on("change", "#gamemode", function() {
                    var dummy = this.value;
                    if (":party" !== dummy) {
                        t.leaveParty();
                    }
                    t.gameMode = i.gameMode = dummy;
                    t.setQuest();
                });
                $(document).on("change", "#quality", function() {
                    t.getQuality(this.value);
                    ogarhusettings();
                });
                $(document).on("input", "#skin", function() {
                    var hexInputVal = this.value;
                    t.setSkinPreview(hexInputVal, "skin-preview");
                    t.setSkinPreview(hexInputVal, "profile-" + t.selectedProfile);
                });
                $(document).on("click", "#skins a", function(event) {
                    event.preventDefault();
                    t.selectProfile($(this).attr("data-profile"));
                });
                $(document).on("click", "#prev-profile", function() {
                    t.prevProfile();
                });
                $(document).on("click", "#next-profile", function() {
                    t.nextProfile();
                });
                $(document).on("click", "#stream-mode", function() {
                    /** @type {boolean} */
                    defaultmapsettings.streamMode = !defaultmapsettings.streamMode;
                    t.saveSettings(defaultmapsettings, "ogarioSettings");
                    t.setStreamMode();
                });
                $(document).on("click", "#hide-url", function() {
                    /** @type {boolean} */
                    defaultmapsettings.hideSkinUrl = !defaultmapsettings.hideSkinUrl;
                    t.saveSettings(defaultmapsettings, "ogarioSettings");
                    t.setHideSkinUrl();
                });
                $(document).on("click", ".btn-server-info", function() {
                    $("#server-info").toggle();
                });
                $(document).on("click", "#server-connect", function() {
                    t.gameServerConnect($("#server-ws").val());
                });
                $(document).on("click", "#server-reconnect", function() {
                    t.gameServerReconnect();
                });
                $(document).on("click", "#server-join", function() {
                    t.gameServerJoin($("#server-token").val());
                });
                $(document).on("change", "#og-options input[type='checkbox']", function() {
                    var template = $(this);
                    t.setSettings(template.attr("id"), template.prop("checked"));
                });
                $(document).on("change", ".js-switch-vanilla", function() {
                    var template = $(this);
                    var p = template.attr("id");
                    if (void 0 !== t[p]) {
                        t[p] = template.prop("checked");
                        if ("noSkins" === p) {
                            /** @type {boolean} */
                            i.showCustomSkin = !t.noSkins;
                        }
                        if ("showQuest" === p) {
                            t.setQuest();
                        }
                    }
                });
                $(document).on("click", "#og-settings .restore-settings a", function(result) {
                    result.preventDefault();
                    t.restoreSettings();
                });
                $(document).on("click", "#og-settings .btn-export", function(result) {
                    result.preventDefault();
                    t.exportSettings();
                    $("#exp-imp").fadeIn(500);
                    $("#exp-imp-settings, #export-settings").perfectScrollbar("update");
                });
                $(document).on("click", "#close-exp-imp", function(event) {
                    event.preventDefault();
                    $("#exp-imp").fadeOut(500);
                });
                $(document).on("focus", "#export-settings", function() {
                        $(this).select();
                    }),
                    $(document).on("click", "#export-settings-btn", function(event) {
                        event.preventDefault();
                        t.exportSettings();
                    });
                $(document).on("click", "#import-settings-btn", function(result) {
                    result.preventDefault();
                    t.importSettings();
                });
                $(document).on("click", "#unblock-popups", function(result) {
                    result.preventDefault();
                    t.unblockPopups();
                });
                $(document).on("click", "#openfl-overlay.disabler", function() {
                    if (defaultmapsettings["blockPopups"]) {
                        t["blockPopups"]();
                    }
                });
                $(document).on("click", "#openfl-content", function() {
                    if (defaultmapsettings["blockPopups"]) {
                        var container = $(this);
                        setTimeout(function() {
                            if (!container.is(":visible")) {
                                t["blockPopups"]();
                            }
                        }, 1000);
                    }
                });
                $(document).on("click", ".quick-shop", function(event) {
                    event.preventDefault();
                    t.unblockPopups();
                    if (window.MC && window.MC.openShop) {
                        window.MC.openShop();
                    }
                });
                $(document).on("click", ".quick-free-coins", function(event) {
                    event.preventDefault();
                    t.unblockPopups();
                    if (window.MC && window.MC.showFreeCoins) {
                        window.MC.showFreeCoins();
                    }
                });
                $(document).on("click", ".quick-free-gifts", function(event) {
                    event.preventDefault();
                    t.unblockPopups();
                    if (window.MC && window.MC.showGifting) {
                        window.MC.showGifting();
                    }
                });
                $(document).on("click", ".quick-quests", function(event) {
                    event.preventDefault();
                    t.unblockPopups();
                    if (window.MC && window.MC.showQuests) {
                        window.MC.showQuests();
                    }
                });
                $(document).on("click", "#set-targeting", function(event) {
                    event.preventDefault();
                    t.setTargeting();
                });
                $(document).on("click", "#cancel-targeting", function(event) {
                    event.preventDefault();
                    t.cancelTargeting();
                });
                $(document).on("click", "#set-private-minimap", function(event) {
                    event.preventDefault();
                    t.setPrivateMiniMap();
                });
                $(document).on("click", "#change-target", function(result) {
                    result.preventDefault();
                    t.changeTarget();
                });
                $(document).on("click", ".team-top-limit", function(event) {
                    event.preventDefault();
                    var template = $(this);
                    /** @type {number} */
                    var param = parseInt(template.attr("data-limit"));
                    if (param) {
                        t.setTop5limit(param);
                        t.displayTop5();
                        $(".team-top").text(param);
                        $(".team-top-limit").removeClass("active");
                        template.addClass("active");
                    }
                });
                $(document).on("click", "#top5-pos .set-target", function(event) {
                    event.preventDefault();
                    t.setTarget(parseInt($(this).attr("data-user-id")));
                });
                $(document).on("click", ".mute-user", function(event) {
                    event.preventDefault();
                    t.muteChatUser(parseInt($(this).attr("data-user-id")));
                });
                $(document).on("click", ".btn-mute-user", function() {
                    var template = $(this);
                    t.muteChatUser(parseInt(template.attr("data-user-id")));
                    template.removeClass("btn-red btn-mute-user").addClass("btn-green btn-unmute-user").text(h.unmute);
                });
                $(document).on("click", ".btn-unmute-user", function() {
                    var template = $(this);
                    t.unmuteChatUser(parseInt(template.attr("data-user-id")));
                    template.removeClass("btn-green btn-unmute-user").addClass("btn-red btn-mute-user").text(h.mute);
                });
                $(document).on("click", ".chat-sound-notifications", function(result) {
                    result.preventDefault();
                    /** @type {boolean} */
                    defaultmapsettings.chatSounds = !defaultmapsettings.chatSounds;
                    t.saveSettings(defaultmapsettings, "ogarioSettings");
                    t.setChatSoundsBtn();
                });
                $(document).on("click", ".chat-active-users", function(event) {
                    event.preventDefault();
                    t.displayChatActiveUsers();
                });
                $(document).on("click", ".chat-muted-users", function(event) {
                    event.preventDefault();
                    t.displayChatMutedUsers();
                });
                $(document).on("click", ".show-chat-emoticons", function(result) {
                    result.preventDefault();
                    var template = $(this);
                    var p = $("#chat-emoticons");
                    p.toggle();
                    if (p.is(":visible")) {
                        template.addClass("active");
                    } else {
                        template.removeClass("active");
                        $("#message").focus();
                    }
                });
                $(document).on("click", "#chat-emoticons .emoticon", function() {
                    var d = $(this).attr("alt");
                    var e = $("#message");
                    var n = e.val();
                    if (n.length + d.length <= 80) {
                        e.val(n + d);
                    }
                    e.focus();
                });
                this.statsHUD = document.getElementById("stats-hud");
                this.activeParties = document.getElementById("active-parties");
                this.top5pos = document.getElementById("top5-pos");
                this.top5totalMass = document.getElementById("top5-total-mass");
                this.top5totalPlayers = document.getElementById("top5-total-players");
                this.leaderboardPositionsHUD = document.getElementById("leaderboard-positions");
                this.leaderboardDataHUD = document.getElementById("leaderboard-data");
                this.timeHUD = document.getElementById("time-hud"), this.questHUD = document.getElementById("quest-hud"), $("#canvas").bind("contextmenu", function() {
                    return false;
                });
                $(document).on("mouseup", ".btn", function() {
                    $(this).blur();
                });
                $("[data-toggle='tab-tooltip']").tooltip({
                    "trigger": "hover"
                });
                $(".submenu-panel, #chat-box, #exp-imp-settings, #export-settings, #import-settings").perfectScrollbar({
                    "suppressScrollX": true
                });
                Array.prototype.slice.call(document.querySelectorAll(".js-switch")).forEach(function(remove) {
                    new Switchery(remove, {
                        "color": defaultSettings["menuMainColor"],
                        "size": "small"
                    });
                });
                $("input[type='range']").rangeslider({
                    "polyfill": false
                });
                toastr["options"] = {
                    "newestOnTop": false,
                    "positionClass": "toast-bottom-left",
                    "timeOut": 15000
                };

            },
            'switchMenuTabs': function(t, e) {
                var i = t.parent();
                if ('menu-panel' === e) {
                    if (t.hasClass('hotkeys-link')) return;
                    i.hasClass('profile-tab') && this.setBlockPopups();
                }
                t.addClass('active'), i.addClass('active'), i.siblings().removeClass('active'), i.siblings().find('a').removeClass('active');
                var o = t.attr('href');
                if ('submenu-panel' === e) {
                    var a = $(o).parent().attr('id');
                    $('#' + a + ' .submenu-panel').not(o).css('display', 'none');
                } else {
                    try {
                        $('.menu-panel').not(o).css('display', 'none');
                    } catch (error) {}
                }
                try {
                    $(o).fadeIn(1000);
                } catch (error) {}
                ogarhusettings();
                $('.submenu-panel').perfectScrollbar('update');
            },
            'getDefaultSettings': function() {
                if (this.noSkins = $("#noSkins").prop("checked"),
                    this.noColors = $("#noColors").prop("checked"),
                    this.skipStats = $("#skipStats").prop("checked"),
                    this.showQuest = $("#showQuest").prop("checked"),
                    i.showCustomSkin = !this.noSkins,
                    null !== window.localStorage.getItem("scale_setting")) {
                    var t = JSON.parse(window.localStorage.getItem("scale_setting"));
                    this.setCanvasScale(t);
                } else {
                    var o = $("#quality").val();
                    this.getQuality(o);
                }
                null !== window.localStorage.getItem("location") ? (this.region = window.localStorage.getItem("location"),
                        $("#region").val(this.region),
                        window.MC && window.MC.setRegion && window.MC.setRegion(this.region)) : this.region = $("#region").val(),
                    this.setParty(), ":party" === this.gameMode && window.location.hash &&
                    $("#join-party-btn-2").click(),
                    Array.prototype.slice.call(document.querySelectorAll(".js-switch-vanilla")).forEach(function(remove) {
                        new Switchery(remove, {
                            "color": defaultSettings["menuMainColor"],
                            "size": "small"
                        });
                    }), $("#nick").val(ogarcopythelb.nick).blur(),
                    $("#noNames").prop("checked", !defaultmapsettings.noNames),
                    $("#showMass").prop("checked", defaultmapsettings.showMass),
                    this.unlockButtons(),
                    this.setAutoResp(),
                    this.setQuest();
            },
            'getQuality': function(t) {
                var i = 1;
                switch ('devicePixelRatio' in window && (i = window.devicePixelRatio), t) {
                    case 'High':
                        this.setCanvasScale(1);
                        break;
                    case 'Medium':
                        this.setCanvasScale(0.9);
                        break;
                    case 'Low':
                        this.setCanvasScale(0.75);
                        break;
                    case 'VeryLow':
                        this.setCanvasScale(0.5);
                        break;
                    default:
                        this.setCanvasScale(i);
                }
            },
            'setCanvasScale': function(t) {
                this.canvasScale = t;
                i.canvasScale = t;
            },
            'setStreamMode': function() {
                if (defaultmapsettings.streamMode) {
                    $("#stream-mode").addClass("ogicon-eye-blocked");
                    $("#clantag, #nick, #party-token").addClass("stream-mode");
                } else {
                    $("#stream-mode").removeClass("ogicon-eye-blocked");
                    $("#clantag, #nick, #party-token").removeClass("stream-mode");
                }
            },
            'setHideSkinUrl': function() {
                if (defaultmapsettings.hideSkinUrl) {
                    $("#hide-url").addClass("ogicon-eye-blocked");
                    $("#skin").addClass("hide-url");
                } else {
                    $("#hide-url").removeClass("ogicon-eye-blocked");
                    $("#skin").removeClass("hide-url");
                }
            },
            'setShowQuickMenu': function() {
                if (defaultmapsettings.showQuickMenu) {
                    $("#quick-menu").fadeIn(500);
                } else {
                    $("#quick-menu").fadeOut(500);
                }
                if (defaultmapsettings.showQuickBots) {
                    $("#quick-bots").hide();
                }
            },
            'setShowQuickBots': function() {
                if (defaultmapsettings.showQuickBots) {
                    $("#quick-bots").fadeIn(500);
                } else {
                    $("#quick-bots").fadeOut(500);
                }
                if (defaultmapsettings.showQuickBots) {
                    $("#quick-menu").hide();
                }
            },
            'setShowSkinsPanel': function() {
                if (defaultmapsettings.showSkinsPanel) {
                    $("#skins-panel").fadeIn(500);
                } else {
                    $("#skins-panel").fadeOut(500);
                }
            },
            'unlockButtons': function() {
                $('.btn-play, .btn-play-guest, .btn-login-play, .btn-spectate').prop('disabled', false);
            },
            'setMainButtons': function() {
                var t = this;
                $(document).on("click", ".btn-play, .btn-play-guest", function() {
                    t.onPlay();
                });
                $(document).on("click", ".btn-spectate", function() {
                    t.onSpectate();
                });
                $(document).on("click", "#create-party-btn-2", function() {
                    t.onCreate();
                });
                $(document).on("click", "#join-party-btn-2", function() {
                    t.skipServerData = true;
                    t.joinParty();
                    t.onJoin();
                });
                $(document).on("click", "#statsContinue2", function() {
                    $("#stats, #main-panel").toggle();
                });
            },
            'play': function() {
                if (window.noOgarioSocket) {
                    console.log('New Socket 3 data sent');
                    if (window.noOgarioSocket) {
                        //Socket3.send(JSON.stringify({ com: "sendPlayerSkinURL", nick: ogarcopythelb.nick, token: legendmod3.serverToken, tag: ogarcopythelb.clanTag, skin: ogarcopythelb.skinURL, color: ogarcopythelb.color, id: customLMID, x: legendmod3.getPlayerX(), y: legendmod3.getPlayerY(), mass: legendmod.playerMass}));
                        var temp = {
                            com: "sendPlayerSkinURL",
                            nick: ogarcopythelb.nick,
                            token: legendmod3.serverToken,
                            tag: ogarcopythelb.clanTag,
                            skin: ogarcopythelb.skinURL,
                            color: ogarcopythelb.color,
                            //id: customLMID,
                            //id: legendmod3.playerID,
                            id: window.unescape(window.encodeURIComponent(legendmod3.lastSentNick)),
                            x: legendmod3.getPlayerX(),
                            y: legendmod3.getPlayerY(),
                            mass: legendmod.playerMass
                        };
                        Socket3.send(JSON.stringify({
                            //"toH": "legendmod",
                            "toH": $("#server-token").val() + "3",
                            "msg": temp
                        }));

                    }
                }
                if (this.setPlayerSettings(), this.setParty(), this.isSocketOpen()) this.sendPartyData();
                else {
                    this.connect();
                    var t = this;
                    setTimeout(function() {
                        t.sendPartyData();
                    }, 1000);
                }
            },
            'onPlay': function() {
                //                this.play(), this.hideMenu(), window.addKeyListeners && window.addKeyListeners(), defaultmapsettings.autoHideFood && (i.showFood = true), window['ga'] && window['ga']('create', 'UA-92655864-7', 'auto', 'ogarioTracker'), window['ga'] && window['ga']('ogarioTracker.send', 'pageview');
                this.play();
                this.hideMenu();
                if (window.addKeyListeners) {
                    window.addKeyListeners();
                }
                if (defaultmapsettings.autoHideFood) {
                    i.showFood = true
                };
            },
            'onSpectate': function() {
                this.onJoin();
                this.sendPlayerJoin();
                this.hideMenu();
                if (window.addKeyListeners) {
                    window.addKeyListeners();
                }
                if (defaultmapsettings.autoHideFood) {
                    i.showFood = false;
                }
            },
            'join': function() {
                this.setParty();
                this.setPlayerSettings();
                this.sendPartyData();
                this.sendPlayerDeath();
            },
            'onJoin': function() {
                if (this.setParty(), this.isSocketOpen()) this.join();
                else {
                    this.connect();
                    var t = this;
                    setTimeout(function() {
                        t.join();
                        t.sendPlayerJoin();
                    }, 1000);
                }
            },
            'create': function() {
                if (this.setParty(), this.partyToken) this.onJoin();
                else {
                    var t = this;
                    setTimeout(function() {
                        t.create();
                    }, 100);
                }
            },
            'onCreate': function() {
                this.setParty(), ':party' === this.gameMode && this.partyToken ? this.gameServerReconnect() : this.createParty(), this.create();
            },
            'onPlayerSpawn': function() {
                if (i.play = true, i.playerColor) return this.sendPlayerSpawn(), void this.cacheCustomSkin(ogarcopythelb.nick, i.playerColor, ogarcopythelb.skinURL);
                var t = this;
                setTimeout(function() {
                    t.onPlayerSpawn();
                }, 100);
                if (window.spawnspecialeffects == true) {
                    setTimeout(function() {
                        ///////// trigger special effects
                        //console.log('Special effects stage 1');
                        i.spawnX = i.playerX;
                        i.spawnY = i.playerY;
                        LM.drawCommander = true;
                    }, 110);
                }
                LegendModSpawn();
            },
            'onPlayerDeath': function() {
                //
                pauseVideos();
                i.play = false;
                i.playerColor = null;
                i.foodIsHidden = false;
                i.playerMass = 0;
                i.playerScore = 0;
                i.playerSplitCells = 0;
                this.showMenu(300);
                this.sendPlayerDeath();
                this.updateDeathLocations(i.playerX, i.playerY);
                this.unlockButtons();
                ogarcommando1();
                this.autoResp();

            },
			'findOwnedVanillaSkin': function() {
				if (!ogarcopythelb.skinURL && window.vanillaskins && window.UserVanillaSkin && window.EquippableSkins && !ogarminimapdrawer.customSkinsMap[ogarcopythelb.nick]){
					//console.log("1. skin_" + window.UserVanillaSkin);
					if (window.UserVanillaSkin.includes("skin_custom")){	
						ogarminimapdrawer.customSkinsMap[ogarcopythelb.nick] = window.UserVanillaSkin;
						ogarminimapdrawer.loadSkin(ogarminimapdrawer.customSkinsCache, window.UserVanillaSkin);						
						//core.registerSkin(ogarcopythelb.nick, null, window.UserVanillaSkin, null);
						//window.UserVanillaSkin=null;
					}
					else{
                    for (var player = 0; player < window.EquippableSkins.length; player++) {
                        if (window.EquippableSkins[player].productId == "skin_" + window.UserVanillaSkin && window.EquippableSkins[player].image != "uses_spine") {	
							//console.log("2. " + window.EquippableSkins[player].image);	
							window.lastusednameforskin = ogarcopythelb.nick;
							ogarminimapdrawer.customSkinsMap[ogarcopythelb.nick] = "https://configs-web.agario.miniclippt.com/live/" + window.agarversion + window.EquippableSkins[player].image;
							ogarminimapdrawer.loadSkin(ogarminimapdrawer.customSkinsCache, "https://configs-web.agario.miniclippt.com/live/" + window.agarversion + window.EquippableSkins[player].image);							
                            //core.registerSkin(ogarcopythelb.nick, null, "https://configs-web.agario.miniclippt.com/live/" + window.agarversion + window.EquippableSkins[player].image, null);   
							//window.UserVanillaSkin=null;								
							}
						}	
					}
				}
				else{
					//console.log('findOwnedVanillaSkin failed execution')
					if (!window.EquippableSkins && !window.findOwnedVanillaSkinOnce){
						window.findOwnedVanillaSkinOnce=true;
						console.log('[Legend mod Express] findOwnedVanillaSkin: window.EquippableSkins not loaded');	
						setTimeout(function() {
							legendmod3.findOwnedVanillaSkin();
						}, 4000);					
						}
					}
			},
            'setPlayerSettings': function() {
                var t = $('#nick').val(),
                    e = $('#clantag').val(),
                    o = $('#skin').val(),
                    a = $('#color').val();
                ogarcopythelb.nick = t,
                    ogarcopythelb.clanTag = e.trim(),
                    ogarcopythelb.skinURL = this['checkSkinURL'](o.trim()),
                    7 == a.length && (ogarcopythelb.color = a),
                    ogarcopythelb.clanTag.length > 0 && (i.clanTag = ogarcopythelb.clanTag),
                    ogario1PlayerProfiles[this.selectedProfile].nick = ogarcopythelb.nick,
                    ogario1PlayerProfiles[this.selectedProfile].clanTag = ogarcopythelb.clanTag,
                    ogario1PlayerProfiles[this.selectedProfile].skinURL = ogarcopythelb.skinURL,
                    ogario1PlayerProfiles[this.selectedProfile].color = ogarcopythelb.color,
                    this.saveSettings(ogario1PlayerProfiles, 'ogarioPlayerProfiles'),
					this.findOwnedVanillaSkin();									
            },
            'loadSkin': function(t, e, animated) {
                var i = this;
                //console.log ("t:" + t + "e:" + e);
                if (e.includes && (e.includes(".mp4") || e.includes(".webm") || e.includes(".ogv"))) {
                    t[e] = new Video();
                    //console.log("stage 2 videos");
                } else {
                    t[e] = new Image();
                }
                t[e].crossOrigin = 'Anonymous';
                t[e]['onload'] = function() {
                        this.complete &&
                            this.width &&
                            this.height &&
                            this.width <= 2000 && this.width > 0 &&
                            this.height <= 2000 && this.height > 0 &&
                            ((i.cacheQueue.push(e),
                                    1 == i.cacheQueue.length &&
                                    i.cacheSkin(i.customSkinsCache, animated)),
                                (i.cacheQueue2.push(e),
                                    1 == i.cacheQueue2.length &&
                                    i.cacheSkin2(i.customSkinsCache)),
                                (animated && i.cacheQueue3.push(e),
                                    1 == i.cacheQueue3.length &&
                                    i.cacheSkin3(i.customSkinsCache))
                            );
                    },
                    t[e]['onerror'] = function() {
                        //console.log("error loading image: "+ e);
                        if (e.includes(window.EnvConfig.config_url)) {
                            e = "https://legendmod.ml/vanillaskins/" + e.split('/').pop(); //if CORS policy on miniclip images, use other source
                            //console.log("new destination is: " + e);
                            ogarminimapdrawer.customSkinsMap[window.lastusednameforskin] = e;
                            ogarminimapdrawer.loadSkin(t, e);
                            return e;

                        }
                    };
                t[e].src = e;
            },
            'checkgraphics': function() {
                if (defaultSettings.graphics == "high") {
                    ogarminimapdrawer.graphics = 1
                } else if (defaultSettings.graphics == "medium") {
                    ogarminimapdrawer.graphics = 2
                } else if (defaultSettings.graphics == "low") {
                    ogarminimapdrawer.graphics = 4
                } else if (defaultSettings.graphics == "very_low") {
                    ogarminimapdrawer.graphics = 8
                }
            },
            'cacheSkin': function(t, animated) {
                //console.log(t);  //////// return the image src
                if (0 != this.cacheQueue.length) {
                    var e = this.cacheQueue.shift();
                    if (e && !this.customSkinsCache[e + "_cached"]) {
                        var depth = 512;
                        this.checkgraphics();
                        if (ogarminimapdrawer.graphics) {
                            depth = depth / ogarminimapdrawer.graphics;
                        }
                        var i = document.createElement("canvas");
                        i.width = depth;
                        i.height = depth;
                        var $ = i.getContext("2d");
                        $.beginPath();
                        $.arc(depth / 2, depth / 2, depth / 2, 0, 2 * Math.PI, false);
                        $.clip();
                        try {
                            if (!animated) {
                                $.drawImage(this.customSkinsCache[e], 0, 0, depth, depth);
                            } else {
                                //console.log('was animated')
                                $.drawImage(this.customSkinsCache[e], 0, 0, this.customSkinsCache[e].width / 2, this.customSkinsCache[e].height, 0, 0, depth, depth);
                            }
                        } catch (error) {}
                        this.customSkinsCache[e + "_cached"] = new Image;
                        this.customSkinsCache[e + "_cached"].src = i.toDataURL();
                        i = null;
                        this.cacheSkin(this.customSkinsCache, animated);
                    }
                }
            },
            'cacheSkin2': function(t) {
                if (0 != this.cacheQueue2.length) {
                    var e = this.cacheQueue2.shift();
                    if (e && !this.customSkinsCache[e + "_cached2"]) {
                        var depth = 64;
                        var i = document.createElement("canvas");
                        i.width = depth;
                        i.height = depth;
                        var $ = i.getContext("2d");
                        $.beginPath();
                        $.arc(depth / 2, depth / 2, depth / 2, 0, 2 * Math.PI, false);
                        $.clip();
                        try {
                            $.drawImage(this.customSkinsCache[e], 0, 0, depth, depth);
                        } catch (error) {}
                        this.customSkinsCache[e + "_cached2"] = new Image;
                        this.customSkinsCache[e + "_cached2"].src = i.toDataURL();
                        //this.customSkinsCache[e + "_cached"].src = i.toDataURL('image/jpeg', 0.1);
                        i = null;
                        this.cacheSkin2(this.customSkinsCache);
                    }
                }
            },
            'cacheSkin3': function(t) {
                //console.log(t);  //////// return the image src
                if (0 != this.cacheQueue3.length) {
                    var e = this.cacheQueue3.shift();
                    if (e && !this.customSkinsCache[e + "_cached3"]) {
                        var depth = 512;
                        this.checkgraphics();
                        if (ogarminimapdrawer.graphics) {
                            depth = depth / ogarminimapdrawer.graphics;
                        }
                        var i = document.createElement("canvas");
                        i.width = depth;
                        i.height = depth;
                        var $ = i.getContext("2d");
                        $.beginPath();
                        $.arc(depth / 2, depth / 2, depth / 2, 0, 2 * Math.PI, false);
                        $.clip();
                        try {
                            $.drawImage(this.customSkinsCache[e], this.customSkinsCache[e].width / 2, 0, this.customSkinsCache[e].width / 2, this.customSkinsCache[e].height, 0, 0, depth, depth);
                        } catch (error) {}
                        this.customSkinsCache[e + "_cached3"] = new Image;
                        this.customSkinsCache[e + "_cached3"].src = i.toDataURL();
                        i = null;
                        this.cacheSkin3(this.customSkinsCache);
                    }
                }
            },
            'getCachedSkin': function(t, e) {
                if (t[e + '_cached3']) {
                    var today = new Date();
                    if (today.getSeconds() < 30) { //vanilla animated skins
                        return t[e + '_cached'] && t[e + '_cached'].complete && t[e + '_cached'].width ? t[e + '_cached'] : null;
                    } else if (today.getSeconds() >= 30) {
                        return t[e + '_cached3'] && t[e + '_cached3'].complete && t[e + '_cached3'].width ? t[e + '_cached3'] : null;
                    }
                }
                return t[e + '_cached'] && t[e + '_cached'].complete && t[e + '_cached'].width ? t[e + '_cached'] : null;

            },
            'cacheCustomSkin': function(t, e, i) {
                if (i) {
                    var s = ':party' === this.gameMode ? t + e : t;
                    //console.log("t= " + t);
                    //console.log("e= " + e);
                    if (s && (this.customSkinsMap[s] = i), this.customSkinsCache.hasOwnProperty(i)) return;
                    this.loadSkin(this.customSkinsCache, i);
                }
            },
            'checkSkinsMap': function(t, e) {
                var i = ':party' === this.gameMode ? t + e : t;
                //console.log(.customSkinsMap.hasOwnProperty(i));
                return !!this.customSkinsMap.hasOwnProperty(i);
            },
            'getCustomSkin': function(t, e) {
                //console.log("t= " + t);
                //console.log("e= " + e);				               
                if (':party' === this.gameMode && this.customSkinsMap[t + "#000000"] && this.customSkinsMap[t + "#000000"].includes("configs-web.agario.miniclippt.com/live/")) {
                    //console.log('changed for',t)
                    e = "#000000";
                }
                if (!this.checkSkinsMap(t, e)) return null;
                var i = ':party' === this.gameMode ? t + e : t;
                return this.getCachedSkin(this.customSkinsCache, this.customSkinsMap[i]);
            },
            'calculateMapSector': function(t, xgh2, closeExpr = false) {
                if (!i.mapOffsetFixed) {
                    return "";
                }
				/*
				if (closeExpr){
					if (window.legendmod.vector[window.legendmod.vnr][0] || window.legendmod.vector[window.legendmod.vnr][1]){
						closeExpr= closeExpr + legendmod.mapOffsetX
						xgh2 = xgh2 + legendmod.mapOffsetY
						//t = legendmod.untranslateX(t)
						//t = legendmod.translateX(t - i.mapOffsetX)
						//xgh2 = legendmod.untranslateY(xgh2)		
						//xgh2 = legendmod.translateY(xgh2 - i.mapOffsetY)							
					}
				}*/
                //var GearType = i.mapOffsetX + i.mapOffset;
                //var closingExpr = i.mapOffsetY + i.mapOffset;				
                var GearType = closeExpr ? i.mapOffsetX + i.mapOffset : i.mapOffset;
                var closingExpr = closeExpr ? i.mapOffsetY + i.mapOffset : i.mapOffset;
                var n = Math.floor((xgh2 + closingExpr) / (i.mapSize / defaultSettings.sectorsY));
                var r = Math.floor((t + GearType) / (i.mapSize / defaultSettings.sectorsX));
                window.calculateMapSector = n < 0 ? 0 : n >= defaultSettings.sectorsY ? defaultSettings.sectorsY - 1 : n;
                r = r < 0 ? 0 : r >= defaultSettings.sectorsX ? defaultSettings.sectorsX - 1 : r;
                String.fromCharCode(n + 65) + (r + 1);
                return n = n < 0 ? 0 : n >= defaultSettings.sectorsY ? defaultSettings.sectorsY - 1 : n, r = r < 0 ? 0 : r >= defaultSettings.sectorsX ? defaultSettings.sectorsX - 1 : r, String.fromCharCode(n + 65) + (r + 1);
            },
            'shortMassFormat': function(t) {
                return t < 1000 ? t : Math.round(t / 100) / 10 + 'k';
            },
            'updateDeathLocations': function(t, e) {
                if (i.mapOffsetFixed) {
                    this.deathLocations.push({
                        "x": t + i.mapOffsetX,
                        "y": e + i.mapOffsetY
                    });
                    if (6 == this.deathLocations.length) {
                        this.deathLocations.shift();
                    }
                    this.lastDeath = this.deathLocations.length - 1;
                }
            },
            'drawMiniMap': function() {
                if (i.mapOffsetFixed) {
                    var t = defaultSettings.miniMapWidth;
                    var e = defaultSettings.miniMapTop;
                    var s = t + e;
                    var o = t - 18;
                    var a = e + 9.5;
                    if (this.miniMap) {
                        this.miniMapCtx.clearRect(0, 0, t, s);
                    } else {
                        this.miniMap = document.getElementById("minimap");
                        this.miniMapCtx = this.miniMap.getContext("2d");
                        this.miniMapCtx.ogarioCtx = true;
                        this.miniMap.width = t;
                        this.miniMap.height = s;
                    }
                    if (this.miniMap.width != t) {
                        this.miniMap.width = t;
                        this.miniMap.height = s;
                    }
                    var n = o / i.mapSize;
                    var r = i.mapOffsetX + i.mapOffset;
                    var l = i.mapOffsetY + i.mapOffset;
                    if (this.drawSelectedCell(this.miniMapCtx),
                        //
                        this.w = i.playerX,
                        this.u = i.playerY,
                        /*
						this.w = window.legendmod.vector[window.legendmod.vnr][0] ? legendmod.translateX(i.playerX) : i.playerX,
						this.u = window.legendmod.vector[window.legendmod.vnr][1] ? legendmod.translateY(i.playerY) : i.playerY,  
*/
                        //						
                        //this.currentSector = this.calculateMapSector(i.playerX, i.playerY, true),
                        this.currentSector = this.calculateMapSector(this.w, this.u, true),

						this.miniMapCtx.font = defaultSettings.miniMapFontWeight + ' ' + (e - 6) + 'px ' + defaultSettings.miniMapFontFamily,
						this.miniMapCtx.fillStyle = defaultSettings.miniMapMyCellColor,
                        this.miniMapCtx.globalAlpha = 1,						
						this.miniMapCtx.fillText(this.currentSector, defaultSettings.miniMapWidth-32, e),
                        //this.miniMapCtx.font = defaultSettings.miniMapFontWeight + " " + (e - 4) + "px " + defaultSettings.miniMapFontFamily,
                        //this.miniMapCtx.fillStyle = defaultSettings.miniMapSectorColor,
                        //this.miniMapCtx.fillText(this.currentSector, 10, e),
                        this.miniMapSectors || this.drawMiniMapSectors(defaultSettings.sectorsX, defaultSettings.sectorsY, o, s, a),
                        this.miniMapCtx.save(),
                        this.miniMapCtx.translate(9.5, a), ":battleroyale" === this.gameMode && ogarfooddrawer && ogarfooddrawer.drawBattleAreaOnMinimap(this.miniMapCtx, o, o, n, r, l),
                        defaultmapsettings.showMiniMapGhostCells) {
                        var h = i.ghostCells;
                        this.miniMapCtx.beginPath();
                        var c = 0;
                        for (; c < h.length; c++) {
                            if (!h[c].inView) {
                                var u = ~~((h[c].x + r) * n);
                                var d = ~~((h[c].y + l) * n);
                                this.miniMapCtx.moveTo(u, d);
                                this.miniMapCtx.arc(u, d, ~~(h[c].size * n), 0, this.pi2, false);
                            }
                        }
                        this.miniMapCtx.fillStyle = defaultSettings.miniMapGhostCellsColor;
                        this.miniMapCtx.globalAlpha = defaultSettings.miniMapGhostCellsAlpha;
                        this.miniMapCtx.shadowColor = defaultSettings.miniMapGhostCellsColor;
                        this.miniMapCtx.shadowBlur = 10;
                        this.miniMapCtx.shadowOffsetX = 0;
                        this.miniMapCtx.shadowOffsetY = 0;
                        this.miniMapCtx.fill();
                        this.miniMapCtx.globalAlpha = 1;
                        this.miniMapCtx.shadowBlur = 0;
                    }
                    if (defaultmapsettings.showMiniMapGuides) {
                        u = Math.round((i.playerX + r) * n);
                        d = Math.round((i.playerY + l) * n);
                        this.miniMapCtx.lineWidth = 1;
                        this.miniMapCtx.strokeStyle = defaultSettings.miniMapGuidesColor;
                        this.miniMapCtx.beginPath();
                        this.miniMapCtx.moveTo(u, 0);
                        this.miniMapCtx.lineTo(u, o - 1);
                        this.miniMapCtx.moveTo(0, d);
                        this.miniMapCtx.lineTo(o - 1, d);
                        this.miniMapCtx.stroke();
                    }
                    if (defaultmapsettings.showExtraMiniMapGuides) {
                        u = Math.round((i.playerX + r) * n);
                        d = Math.round((i.playerY + l) * n);

                        //draw the yellow on minimap
                        this.miniMapCtx.beginPath();
                        this.miniMapCtx.lineWidth = "1";
                        this.miniMapCtx.strokeStyle = "yellow";
                        var miniax = legendmod.canvasWidth / (legendmod.mapMaxX - legendmod.mapMinX) / legendmod.viewScale; //CORRECT
                        var miniay = legendmod.canvasHeight / (legendmod.mapMaxY - legendmod.mapMinY) / legendmod.viewScale; //CORRECT
                        var minidaxx = legendmod3.miniMapSectors.width * miniax;
                        var minidayy = legendmod3.miniMapSectors.width * miniay;

                        var fixminidaxx = u - (minidaxx / 2);
                        var fixminidayy = d - (minidayy / 2);

                        //if (fixminidaxx<0){ fixminidaxx=0; }
                        //if (fixminidayy<0){ fixminidayy=0; }
                        this.miniMapCtx.rect(fixminidaxx, fixminidayy, minidaxx, minidayy);
                        this.miniMapCtx.stroke();

                    }
                    if (this.miniMapCtx.beginPath(),
                        this.miniMapCtx.arc((i.playerX + r) * n, (i.playerY + l) * n,
                            defaultSettings.miniMapMyCellSize, 0, this.pi2, false),
                        this.miniMapCtx.closePath(),
                        defaultSettings.miniMapMyCellStrokeSize > 0 && (this.miniMapCtx.lineWidth = defaultSettings.miniMapMyCellStrokeSize,
                            this.miniMapCtx.strokeStyle = defaultSettings.miniMapMyCellStrokeColor,
                            this.miniMapCtx.stroke()),
                        this.miniMapCtx.fillStyle = defaultSettings.miniMapMyCellColor,
                        this.miniMapCtx.fill(),
                        this.teamPlayers.length) {
                        c = 0;
                        for (; c < this.teamPlayers.length; c++) {
                            this.teamPlayers[c].drawPosition(this.miniMapCtx, i.mapOffset, n, this.privateMiniMap, this.targetID, legendmod3.teamPlayers[c].color);
                        }
                    }
                    if (this.deathLocations.length > 0) {
                        u = Math.round((this.deathLocations[this.lastDeath].x + i.mapOffset) * n);
                        d = Math.round((this.deathLocations[this.lastDeath].y + i.mapOffset) * n);
                        var f = Math.max(defaultSettings.miniMapMyCellSize - 2, 4);
                        this.miniMapCtx.lineWidth = 1;
                        this.miniMapCtx.strokeStyle = this.deathLocations.length - 1 == this.lastDeath ? defaultSettings.miniMapDeathLocationColor : "#FFFFFF";
                        this.miniMapCtx.beginPath();
                        this.miniMapCtx.moveTo(u - f, d);
                        this.miniMapCtx.lineTo(u + f, d);
                        this.miniMapCtx.moveTo(u, d - f);
                        this.miniMapCtx.lineTo(u, d + f);
                        this.miniMapCtx.stroke();
                    }
                    this.miniMapCtx.restore();
                }
            },
            'drawMiniMapSectors': function(t, e, s, o, a) {
                this.miniMapSectors = document.getElementById('minimap-sectors');
                var n = this.miniMapSectors.getContext('2d');
                n.ogarioCtx = true;
                this.miniMapSectors.width = s;
                this.miniMapSectors.height = o;
                n.fillStyle = '#FFFFFF';
                this.dTok(n, s - 1);
                ogarfooddrawer.drawSectors(n, i.mapOffsetFixed, t, e, 0.5, a, s - 0.5, o - 9.5, defaultSettings.miniMapSectorsColor, defaultSettings.miniMapSectorsColor, 1, false);
            },
            'resetMiniMapSectors': function() {
                this.miniMapSectors = null;
            },
            'drawSelectedCell': function(t) {
                i.play && i.playerSplitCells > 1 && (defaultmapsettings.splitRange || defaultmapsettings.oppColors || defaultmapsettings.oppRings || defaultmapsettings.showStatsSTE) && (t.fillStyle = '#FFFFFF', t.globalAlpha = this.selectBiggestCell ? 0.6 : 0.3, t.beginPath(), t.arc(48, 15, 6, 0, this.pi2, false), t.closePath(), t.fill(), t.globalAlpha = this.selectBiggestCell ? 0.3 : 0.6, t.beginPath(), t.arc(60, 15, 4, 0, this.pi2, false), t.closePath(), t.fill());
            },
            'dTok': function(t, e) {
                t.font = defaultSettings.miniMapFontWeight + ' ' + (defaultSettings.miniMapTop - 6) + 'px ' + defaultSettings.miniMapFontFamily;
                t.textAlign = 'right';
                t.textBaseline = 'top';
                //t.fillText(atob(this.token), e, 7);
            },
            /*            'drawTeammatesInd': function(t, e, i, s) {
                            this.indicator && t.drawImage(this.indicator, e - 45, i - s - 90);
                        }, */
            'drawCellInfo': function(t, e, s, o, a, n, r, l, h, c, u, d) {
                //if (!n && !h && (t.globalAlpha = i.globalAlpha, defaultmapsettings.teammatesInd && d && !l && a <= 200 && this.drawTeammatesInd(t, s, o, a), !defaultmapsettings.noNames || defaultmapsettings.showMass)) {
                if (!n && !h && (t.globalAlpha = i.globalAlpha, defaultmapsettings.teammatesInd && d && !l && a <= 200 && ogarfooddrawer.drawTeammatesInd(t, s, o, a), !defaultmapsettings.noNames || defaultmapsettings.showMass)) {
                    var f = false;
                    if (l || r || !(f = this.setAutoHideCellInfo(a)) || !defaultmapsettings.autoHideNames || !defaultmapsettings.autoHideMass) {
                        var m = null;
                        if (!this.cells.hasOwnProperty(e)) return (m = new ogarbasicassembly(s, o, r, l, defaultmapsettings.shortMass, defaultmapsettings.virMassShots)).setMass(a), m.setNick(c), void(this.cells[e] = m);
                        (m = this.cells[e]).update(s, o, a, r, l, c),
                            m.setDrawing(defaultmapsettings.optimizedNames, defaultmapsettings.optimizedMass, defaultmapsettings.shortMass, defaultmapsettings.virMassShots, defaultmapsettings.namesStroke, defaultmapsettings.massStroke),
                            m.setDrawingScale(i.viewScale, defaultSettings.namesScale, defaultSettings.massScale, defaultSettings.virMassScale, defaultSettings.strokeScale),
                            t.globalAlpha = defaultSettings.textAlpha, defaultmapsettings.noNames || f && defaultmapsettings.autoHideNames || l && defaultmapsettings.hideMyName || d && defaultmapsettings.hideTeammatesNames || m.drawNick(t, defaultSettings.namesColor, defaultSettings.namesFontFamily, defaultSettings.namesFontWeight, defaultSettings.namesStrokeColor),
                            !defaultmapsettings.showMass || f && defaultmapsettings.autoHideMass || l && defaultmapsettings.hideMyMass || defaultmapsettings.hideEnemiesMass && !l && !r || m.drawMass(t, defaultSettings.massColor, defaultSettings.massFontFamily, defaultSettings.massFontWeight, defaultSettings.massStrokeColor) && (window.ExternalScripts && !window.legendmod5.optimizedMass && m.drawMerge(t, defaultSettings.massColor, defaultSettings.massFontFamily, defaultSettings.massFontWeight, defaultSettings.massStrokeColor));
                    }
                }
            },
            'setVirusColor': function(t) {
                return Math.floor(t * t / 100) > 183 ? '#C80000' : defaultSettings.virusColor;
            },
            'setVirusStrokeColor': function(t) {
                return i.play && 0 != i.playerMaxMass ? Math.floor(t * t / 100) / (this.selectBiggestCell ? i.playerMaxMass : i.playerMinMass) > 0.76 ? '#FFDC00' : '#C80000' : defaultSettings.virusStrokeColor;
            },
            'setAutoHideCellInfo': function(t) {
                return t <= 40 || i.viewScale < 0.5 && t < 550 && t < 25 / i.viewScale;
            },
            'setParty': function() {
                var t = $('#party-token').val();
                if (this.gameMode = i.gameMode = $('#gamemode').val(), this.setQuest(), ':party' === this.gameMode && t) {
                    var e = t; -
                    1 != t.indexOf('#') && (e = (t = t.split('#'))[1]), this.partyToken !== e && (this.partyToken = e, this.flushSkinsMap(), this.flushChatData(), this.cancelTargeting());
                }
            },
            'createParty': function() {
                $('#create-party-btn').click();
            },
            'joinParty': function() {
                var t = $('#party-token').val();
                t && ($('#pre-join-party-btn').click(),
                    $('.party-token').val(t),
                    $('#join-party-btn').click());
            },
            'leaveParty': function() {
                $('#party-token, .party-token').val('');
                $('#leave-party-btn').click();
            },
            'closeParty': function() {
                $('#party-token, .party-token').val('');
                $('.party-icon-back').click();
            },
            'flushData': function() {
                this.flushPartyData();
                this.flushSkinsMap();
                this.flushChatData();
                this.cancelTargeting();
                i.play = false;
                i.playerColor = null;
            },
            'flushPartyData': function() {
                this.teamPlayers = [];
                this.parties = [];
                this.lastSentNick = '';
                this.lastSentClanTag = null;
                this.lastSentSkinURL = '';
                this.lastSentCustomColor = '';
                this.lastSentPartyToken = '';
                this.lastSentServerToken = '';
            },
            'flushCells': function() {
                this.cells = {};
            },
            'flushSkinsMap': function() {
                this.customSkinsMap = {};
            },
            'flushChatData': function() {
                this.chatUsers = {};
            },
            'getWS': function(t) {
				if (t){
					this.ws = t; 
					this.createServerToken();
					this.updateServerInfo();
					if(-1 == this.ws.indexOf('agar.io')){
						this.closeConnection();
					}				
				}
            },
            'recreateWS': function(token) {
                if (!token) return null;
                var text = null;
				
                if (/^[a-zA-Z0-9=+\/]{12,}$/.test(token)) {
                    var atobToken = atob(token);
					
					//ccse
					if(!text && atobToken.search(/agar\.io/)==-1){					
						text = 'wss://'+atobToken;
						//console.log("recreateWS case 1:" + text);
						return text;
					}
				
					if (/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}:[0-9]{1,4}/.test(atobToken)){ 
						text = 'wss://ip-' + atobToken.replace(/\./g, '-').replace(':', '.tech.agar.io:');
						//console.log("recreateWS case 2:" + text);
					}
                }
				
				if (!text && /^[a-z0-9]{5,}$/.test(token)){
					//console.log("recreateWS case 3:" + text);
					//text = `wss://live-arena-` + token + `.agar.io:80`;
					text = 'wss://live-arena-' + token + '.agar.io:443'
				}
				
                return text;
            },
            'createServerToken': function() {
                var matchOld = this.ws.match(/ip-\d+/);
                var matchNew = this.ws.match(/live-arena-([\w\d]+)/);
                var text = null;
				if (matchOld) {
					matchOld = this.ws.replace('.tech.agar.io', '').replace(/-/g, '.').match(/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}:[0-9]{1,4}/);
					if (matchOld){
						this.serverIP = matchOld[0];
						text = btoa(this.serverIP);
					}
				}					
				//ccse
				if(this.ws.search(/wss?:\/\//)>-1 && this.ws.search(/agar\.io/)==-1){
					
					text = this.ws.match(/wss?:\/\/(.+)/)[1]
					this.serverIP = text;
					text = btoa(text);
					//console.log("createServerToken case 1:" + text);
				}       
				
				if (!text && matchNew){
					this.serverArena = matchNew[1];
					text = this.serverArena;
					//console.log("createServerToken case 2:" + text);
				}
				if (text){
					if (this.serverToken !== text){
						this.serverToken = text; 
						this.flushData(); 
						this.flushCells();
				}
				this.partyToken = '';
                    var matchPartyId = this.ws.match(/party_id=([A-Z0-9]{6})/);
                    if(matchPartyId){
						this.partyToken = matchPartyId[1];
						ogarjoiner('/#' + window.encodeURIComponent(this.partyToken));
					}
                }
            },
            'updateServerInfo': function() {
                $('#server-ws').val(this.ws),
                    $('#server-token').val(this.serverToken),
                    $('#party-token, .party-token').val(this.partyToken);
            },
            'gameServerConnect': function(t) {
                t && (this.skipServerData = true, window.core && window.core.connect && window.core.connect(t));
            },
            'gameServerReconnect': function() {
                window.MC && window.MC.reconnect ? window.MC.reconnect() : window.master && window.master.reconnect && window.master.reconnect();
            },
            'gameServerJoin': function(t) {
                var e = this.recreateWS(t);
                e && (this.skipServerData = true, this['gameServerConnect'](e));
            },
            'connect': function() {
                pauseVideos();
                this.closeConnection();
                this.flushData();
                this.setParty();
                //console.log('[Legend mod Express] Connecting to ogario socket'),
                this.privateMode && this.privateIP ? this.socket = new WebSocket(this.privateIP) : this.socket = new WebSocket(this.publicIP),
                    this.socket['ogarioWS'] = true,
                    this.socket['binaryType'] = 'arraybuffer';
                var t = this;
                this.socket['onopen'] = function() {
                    console.log('[Legend mod Express] Ogario socket open:', legendmod3.publicIP);
                    var e = t.createView(3);
                    e.setUint8(0, 0);
                    e.setUint16(1, 401, true);
                    t['sendBuffer'](e);
                    t.sendPartyData();
                }
                this.socket['onmessage'] = function(e) {
                    t['handleMessage'](e);
                }
                this.socket['onclose'] = function(e) {
                    //t.flushData();
                    console.log('[Legend mod Express] Socket close', e);
                }
                this.socket['onerror'] = function(e) {
                    //t.flushData();
                    console.log('[Legend mod Express] Socket error', e);
                    window.noOgarioSocket = true;
                };

            },
            'Socket3connect': function(srv) {
                //if (window.noOgarioSocket && typeof Socket3enabler !== 'undefined' && typeof Socket3enabler === 'function') {
                //setTimeout(function() {
                //Socket3enabler(window.legendmod.ws);
                if (Socket3) {
                    Socket3.closeAndOpen();
                }
                //}, 1000);
                //}
            },
            //Sonia6			
            'SLGconnect': function(srv) {
                if (window.SLG3NumberTries < 2) {
                    if (window.SLGconnected == null) {
                        window.SLGconnected = true; //do this only once	
                        this.SLGconnect2(srv);
                    } else {
						if (window.SLGsocket) {
                        window.SLGsocket.closeAndOpen();
						}
                    }
                }
            },
            'SLGconnect2': function(srv) {
                this.closeSLGConnection();
                //var room = ogarcopythelb.clanTag + "-" + srv.match("-([A-Za-z0-9]{6,7})\.")[1];
                var room = $("#server-token").val();
                this.roomc = ogarcopythelb.clanTag;
                //console.log('[Legend mod Express] Connecting to SLG:', this.room);				
                //window.SLGsocket = new WebSocket("wss://connect.websocket.in/3Q-SoniaSLG_453dsV?room_id=" + this.room);
                window.SLGsocket = new WebSocket("wss://cloud.achex.ca/JIMBOY3200" + room);
                window.SLGsocket['binaryType'] = 'arraybuffer';
                t = this;
                window.SLGsocket['onopen'] = function() {
                    window.SLG3NumberTries = 0;
                    console.log('[Legend mod Express] SLG socket open:', room);
                    //
                    window.SLGsocket['send'](JSON.stringify({
                        //"auth": "JIM2" + customLMID,
                        "auth": "JIM2" + legendmod3.playerID,
                        "password": "legendmod2"
                    }));
                    window.SLGsocket['send'](JSON.stringify({
                        //"joinHub": "legendmod2"
                        "joinHub": $("#server-token").val()
                    }));
                    //					
                }
                window.SLGsocket['onmessage'] = function(e) {
                    //console.log(e)
                    t.handleSLGMessage(e);
                }
                window.SLGsocket['onclose'] = function(e) {
                    console.log('[Legend mod Express] SLG socket close');
                    //setTimeout(function() {
                    if (window.SLG3NumberTries < 2) {
                        legendmod3.SLGconnect2(legendmod.ws)
                    }
                    //}, 1000)					
                }
                window.SLGsocket['onerror'] = function(e) {
                    //console.log('[Legend mod Express] SLG socket error', e);	
                    window.SLG3NumberTries++;
                    //console.log('[Legend mod Express] SLG socket error');
                };
                window.SLGsocket['closeAndOpen'] = function(e) {
                    window.SLGsocket['onclose'] = function(e) {
                        console.log('[Legend mod Express] Previous SLG socket closed async');
                    }
                    if (window.SLG3NumberTries < 2) {
                        legendmod3.SLGconnect2(legendmod.ws)
                    }
                };
            },
            'closeConnection': function() {
                if (this.socket) {
                    this.socket['onmessage'] = null;
                    try {
                        this.socket['close']();
                    } catch (ogarcloseconlabel) {}
                    this.socket = null;
                }
                //Sonia4
                if (window.SLGsocket) {
                    window.SLGsocket['onmessage'] = null;
                    try {
                        window.SLGsocket['close']();
                    } catch (ogarcloseconlabel) {}
                    window.SLGsocket = null;
                }
                if (window.Socket3) {
                    window.Socket3['onmessage'] = null;
                    try {
                        window.Socket3['close']();
                    } catch (ogarcloseconlabel) {}
                    window.Socket3 = null;
                }				
            },		
            //Sonia6
            'closeSLGConnection': function() {
                if (window.SLGsocket) {
                    window.SLGsocket['onmessage'] = null;
                    try {
                        window.SLGsocket['close']();
                    } catch (ogarcloseconlabel) {}
                    window.SLGsocket = null;
                }
            },
            'reconnect': function() {
                this.setParty();
                var t = this;
                setTimeout(function() {
                    t.connect();
                }, 1000);
            },
            'switchServerMode': function() {
                if (this["privateIP"]) {
                    this["privateMode"] = !this["privateMode"];
                    if (this.isSocketOpen()) {
                        this["closeConnection"]();
                        toastr["error"]("Zamkni\u0119to po\u0142\u0105czenie z serwerem!");
                        toastr["error"]("Zamkni\u0119to po\u0142\u0105czenie z serwerem!");
                    }
                    if (this["privateMode"]) {
                        toastr.info("Prze\u0142\u0105czono na serwer prywatny!");
                        $(".party-panel").show();
                    } else {
                        toastr.info("Prze\u0142\u0105czono na serwer publiczny!");
                        $("#active-parties").empty();
                        $(".party-panel").hide();
                    }
                    this.onJoin();
                    if (i.play) {
                        this["onPlayerSpawn"]();
                    }
                }
            },
            'isSocketOpen': function() {
                return null !== this.socket && this.socket['readyState'] === this.socket['OPEN'];
            },
            //Sonia6 Below
            'isSLGSocketOpen': function() {
                var state = false;
                if (window.SLGsocket) {
                    state = window.SLGsocket['readyState'] === window.SLGsocket['OPEN'];
                }
                return state;
            },
            "writeUint32": function(data, value) {
                for (; !![];) {
                    if ((value & -128) == 0) {
                        data.push(value);
                        return;
                    } else {
                        data.push(value & 127 | 128);
                        value = value >>> 7;
                    }
                }
            },
            'createView': function(t) {
                return new DataView(new ArrayBuffer(t));
            },
            'strToBuff': function(t, e) {
                var i = this.createView(1 + 2 * e.length);
                i.setUint8(0, t);
                for (var s = 0; s < e.length; s++) i.setUint16(1 + 2 * s, e.charCodeAt(s), true);
                return i;
            },
            'sendBuffer': function(t) {
                this.socket['send'](t['buffer']);
            },
            //Sonia4
            'sendSLG': function(i, t) {
                if (this.isSLGSocketOpen()) {
                    //if (ogarcopythelb.clanTag != this.roomc) {
                    //console.log("Sending failed. Reconnecting required..")
                    //this.SLGconnect(window.legendmod.ws);
                    //if (window.SLGsocket) {
                    //window.SLGsocket.closeAndOpen();
                    //}
                    //return;
                    //}
                    var s = this.packSLG(i);
                    if (s != null) {
                        //window.SLGsocket['send'](s + t);
                        var temp = s + t;
                        console.log(temp);
                        SLGsocket.send(JSON.stringify({
                            //"toH": "legendmod2",
                            "toH": $("#server-token").val(),
                            "msg": temp
                        }));
                    }
                }
            },
            'handleMessage': function(t) {
                this['readMessage'](new DataView(t['data']));
            },
            //Sonia4
            'handleSLGMessage': function(t) {
                //this['SLGHandler'](t.data);
                var temp = t.data;
                //console.log(t.data);
                temp = JSON.parse(temp);
                //if (temp){
                //this['SLGHandler'](temp.msg);     
                this['SLGSimpleHandler'](temp.msg);
                //}
            },
            'readMessage': function(t) {
                switch (t.getUint8(0)) {
                    case 0:
                        this.playerID = t.getUint32(1, true);
                        //this.playerID = t.getUint16(1, true);
                        break;
                    case 1:
                        this['sendPlayerUpdate']();
                        break;
                    case 20:
                        this['updateTeamPlayer'](t);
                        break;
                    case 30:
                        this['updateTeamPlayerPosition'](t);
                        break;
                    case 96:
                        break;
                    case 100:
                        this['readChatMessage'](t);
                }
            },
            //Sonia4
            'SLGHandler': function(t) {
                var s = this.unpackSLG(t);
                if (s == null) return;
                switch (t.charAt(0)) {
                    case "R":
                        this.getSuperLegendSDATA(s);
                        break;
                    case "Q":
                        //this.getSLGQinfo(s);
                        break;
                }
            },
            'SLGSimpleHandler': function(t) {
                var Socket3data = t;
                //console.log("recieve", t);
                if (Socket3data == null) {
                    return;
                } else {
                    //var ids = Socket3data.t;
                    var ids = window.decodeURIComponent(escape(Socket3data.t));
                    //var id = this.checkPlayerID(ids);
                    var id = this.checkPlayerNick(ids);
                    if (null != id) {
                        //console.log("id found", id);
                        this.teamPlayers[id].lbgpi = parseInt(Socket3data.s);
                        //if (this.top5[id]){
                        //this.top5[id].lbgpi = parseInt(lbgpi); //
                        //}

                    }
                }
            },
            //Sonia4
            'packSLG': function(t) {
                t += this.packInt(this.playerID, 4);
                return t;
            },
            //Sonia4
            'unpackSLG': function(t) {
                t = t.slice(1);
                return t;
            },
            //Sonia4
            'getSLGID': function(t) {
                t = t.slice(0, 2)
                return this.unpackInt(t);
            },
            //Sonia4
            'getSLGVal': function(t) {
                t = t.slice(2);
                return t;
            },
            'sendPlayerState': function(t) {
                if (this.isSocketOpen()) {
                    var e = this.createView(1);
                    e.setUint8(0, t), this['sendBuffer'](e);
                }
            },
            'sendPlayerSpawn': function() {
                this['sendPlayerState'](1);
            },
            'sendPlayerDeath': function() {
                this['sendPlayerState'](2);
            },
            'sendPlayerJoin': function() {
                this['sendPlayerState'](3);
            },
            'sendPlayerData': function(t, e, i) {
                null !== this[e] && this[e] === i || this.isSocketOpen() && (this['sendBuffer'](this['strToBuff'](t, i)), this[e] = i);
            },
            'sendPlayerNick': function() {
                this['sendPlayerData'](10, 'lastSentNick', ogarcopythelb.nick);
            },
            'sendPlayerClanTag': function() {
                this['sendPlayerData'](11, 'lastSentClanTag', ogarcopythelb.clanTag);
            },
            'sendPlayerSkinURL': function() {
                this['sendPlayerData'](12, 'lastSentSkinURL', ogarcopythelb.skinURL);
            },
            'sendPlayerCustomColor': function() {
                this['sendPlayerData'](13, 'lastSentCustomColor', ogarcopythelb.color);
            },
            'sendPlayerColor': function() {
                this.isSocketOpen() && i.playerColor && this['sendBuffer'](this['strToBuff'](14, i.playerColor));
            },
            'sendPartyToken': function() {
                this.setParty(), this['sendPlayerData'](15, 'lastSentPartyToken', this.partyToken);
            },
            'sendServerToken': function() {
                this['sendPlayerData'](16, 'lastSentServerToken', this.serverToken);
            },
            'sendServerJoin': function() {
                this.sendServerToken();
                this.sendPlayerJoin();
            },
            'sendServerRegion': function() {
                if (this.region) {
                    var t = this.region.split('-');
                    if (this.isSocketOpen()) {
                        this['sendBuffer'](this['strToBuff'](17, t[0]));
                    }
                }
            },
            'sendServerGameMode': function() {
                var t = 'FFA';
                switch (this.gameMode) {
                    case ':battleroyale':
                        t = 'BTR';
                        break;
                    case ':teams':
                        t = 'TMS';
                        break;
                    case ':experimental':
                        t = 'EXP';
                        break;
                    case ':party':
                        t = 'PTY';
                }
                this.isSocketOpen() && this['sendBuffer'](this['strToBuff'](18, t));
            },
            'sendServerData': function() {
                this.skipServerData ? this.skipServerData = false : (this.region = $('#region').val(), this.gameMode = $('#gamemode').val(), this.sendServerRegion(), this.sendServerGameMode());
            },
            'sendPartyData': function() {
                this.sendPlayerClanTag(), this.sendPartyToken(), this.sendServerToken(), this.sendPlayerNick();
            },
            'sendPlayerUpdate': function() {
                if (this.isSocketOpen() && i.play && this.playerID && i.playerColor) {
                    function t(t) {
                        for (var e = 0; e < t.length; e++) s.setUint16(o, t.charCodeAt(e), true), o += 2;
                        s.setUint16(o, 0, true), o += 2;
                    }

                    var e = 41;
                    e += 2 * ogarcopythelb.nick.length, e += 2 * ogarcopythelb.skinURL.length;
                    var s = this.createView(e);
                    s.setUint8(0, 20), s.setUint32(1, this.playerID, true);
                    var o = 5;
                    t(ogarcopythelb.nick), 
					t(ogarcopythelb.skinURL), 
					t(ogarcopythelb.color), 
					t(i.playerColor), 
					this['sendBuffer'](s);
                }
            },
            'sendPlayerPosition': function() {
                if (this.isSocketOpen() && i.play && this.playerID) {
                    var t = this.createView(17);
                    t.setUint8(0, 30);
                    t.setUint32(1, this.playerID, true);
                    t.setInt32(5, this.getPlayerX(), true);
                    t.setInt32(9, this.getPlayerY(), true);
                    if (void 0 !== i.playerMass) {
                        t.setUint32(13, i.playerMass, true);
                    } else {
                        t.setUint32(13, this.playerMass, true);
                    }
                    this["sendBuffer"](t);
                }
            },
            'packInt': function(x, m) {
                var s = "";
                if (m == 2) {
                    s += String.fromCharCode(x)
                } else {
                    var p = x / Math.pow(2, 16);
                    var r = x % Math.pow(2, 16);
                    s += String.fromCharCode(Math.floor(p));
                    s += String.fromCharCode(Math.floor(r));
                }
                return s;
            },
            'packFloat': function(x, m) {
                if (m == 2) {
                    x = Math.floor(x * 100000);
                } else {
                    x = Math.floor(x * 1000000000);
                }
                return this.packInt(x, m);
            },
            'unpackInt': function(s) {
                var x = 0;
                if (s.length == 1) {
                    x += s.charCodeAt(0);
                } else {
                    x += s.charCodeAt(0) * Math.pow(2, 16);
                    x += s.charCodeAt(1);
                }
                return x;
            },
            'unpackFloat': function(s) {
                var x = this.unpackInt(s);
                if (s.length == 1) {
                    x = x / 100000;
                } else {
                    x = x / 1000000000;
                }
                return x;
            },
            'getrel': function(x, axis) {
                var v = window.legendmod;
                if (axis == 0) return x / (v.mapMaxX - v.mapMinX);
                else return x / (v.mapMaxY - v.mapMinY);
            },
            'getreal': function(x, axis) {
                var v = window.legendmod;
                if (axis == 0) return x * (v.mapMaxX - v.mapMinX) + v.mapMinX;
                else return x * (v.mapMaxY - v.mapMinY) + v.mapMinY;
            },
            'sendJimboy3100info': function() {
                if (window.legendmod.play) {
                    window.playerCellsSock = [];
                    if (legendmod.playerCells && legendmod.playerCells.length) {
                        for (var i = 0; i < legendmod.playerCells.length; i++) {
                            window.playerCellsSock[i] = {};
                            window.playerCellsSock[i].id = legendmod.playerCells[i].id;
                            window.playerCellsSock[i].x = legendmod.playerCells[i].x + legendmod.mapOffsetX;
							window.playerCellsSock[i].y = legendmod.playerCells[i].y + legendmod.mapOffsetY;
                            //window.playerCellsSock[i].x = window.legendmod.vector[window.legendmod.vnr][0] ? legendmod.translateX(legendmod.playerCells[i].x) : legendmod.playerCells[i].x //Sonia3
                            //window.playerCellsSock[i].y = window.legendmod.vector[window.legendmod.vnr][1] ? legendmod.translateY(legendmod.playerCells[i].y) : legendmod.playerCells[i].y //Sonia3
                            window.playerCellsSock[i].size = legendmod.playerCells[i].size;
                        }
                    }
                    if (Socket3 && Socket3.readyState == 1 && legendmod3.playerID && window.playerCellsSock) {
                        var temp = {
                            com: "pcells",
                            //tid: legendmod3.playerID,
                            tid: window.unescape(window.encodeURIComponent(legendmod3.lastSentNick)),
                            playerCells: window.playerCellsSock
                        };
                        Socket3.send(JSON.stringify({
                            //"toH": "legendmod",
                            "toH": $("#server-token").val() + "3",
                            "msg": temp
                        }));
                        //if (temp.playerCells[0]) console.log(temp.playerCells[0].id, temp.playerCells[0].size, temp.playerCells[0].x, temp.playerCells[0].y);
                        //Socket3.send(JSON.stringify({ com: "pcells", tid: legendmod3.playerID, playerCells: window.playerCellsSock}));		
                    }
                }
            },
            'sendSLGQinfo': function() {
                //return;
                var msg = "";
                var vlen = window.legendmod.viruses.length;
                msg += this.packInt(vlen, 2);
                for (var i = 0; i < vlen; i++) {
                    var z = window.legendmod.viruses[i];
                    msg += this.packInt(z.id, 4);
                    msg += this.packFloat(this.getrel(z.x, 0), 4);
                    msg += this.packFloat(this.getrel(z.y, 1), 4);
                    msg += this.packInt(~~(z.size), 2);
                }
                var cmsg = "";
                var clen = 0;
                var cells = window.legendmod.cells;
                for (var i = 0; i < cells.length; i++) {
                    var z = cells[i];
                    if (!z.isVirus) {
                        cmsg += this.packInt(z.id, 4);
                        cmsg += this.packFloat(this.getrel(z.x, 0), 4);
                        cmsg += this.packFloat(this.getrel(z.y, 1), 4);
                        cmsg += this.packInt(~~(z.size), 2);
                        clen++;
                    }
                }
                msg += this.packInt(clen, 2);
                msg += cmsg;

                //Here should be food part

                this.sendSLG("Q", msg);

                var today = new Date();
                var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + ":" + today.getMilliseconds();
                //console.log("Package Sent:",time)
            },
            'getSLGQinfo': function(t) {
                //return ;
                var ids = this.getSLGID(t);
                var id = this.checkPlayerID(ids);
                console.log(t);
                if (null == id) return;
                var msg = this.getSLGVal(t);
                //Get viruses
                var vlen = this.unpackInt(msg.slice(0, 1));
                msg = msg.slice(1);
                var temp = [];
                for (var i = 0; i < vlen; i++) {
                    var di = this.unpackInt(msg.slice(0, 2));
                    var fx = this.unpackFloat(msg.slice(2, 4));
                    var fy = this.unpackFloat(msg.slice(4, 6));
                    var ds = this.unpackInt(msg.slice(6, 7));
                    msg = msg.slice(7);
                    var x = this.getreal(fx, 0);
                    var y = this.getreal(fy, 1);
                    var ogariocellssetts = new ogarbasicassembly(di, x, y, ds, null, false, true, false, defaultmapsettings.shortMass, defaultmapsettings.virMassShots);
                    ogariocellssetts.time = this.time;
                    ogariocellssetts.isVirus = true;
                    temp.push(ogariocellssetts);
                    if (!ogariocellssetts.isInView()) {
                        if (legendmod.indexedCells.hasOwnProperty(e)) {
                            ogariocellssetts = legendmod.indexedCells[e]
                            //legendmod.cells.push(ogariocellssetts);													 
                        } else {
                            legendmod.indexedCells.push(ogariocellssetts);
                        }
                    }
                    //ogariocellssetts.removeCell();
                }
                this.teamPlayers[id].dvirs = temp;

                //Get normal cells
                var clen = this.unpackInt(msg.slice(0, 1));
                msg = msg.slice(1);
                var tempx = [];
                var cells = window.legendmod.cells;
                for (var i = 0; i < clen; i++) {
                    var di = this.unpackInt(msg.slice(0, 2));
                    var fx = this.unpackFloat(msg.slice(2, 4));
                    var fy = this.unpackFloat(msg.slice(4, 6));
                    var ds = this.unpackInt(msg.slice(6, 7));
                    msg = msg.slice(7);
                    var x = this.getreal(fx, 0);
                    var y = this.getreal(fy, 1);
                    var ogariocellssetts = new ogarbasicassembly(di, x, y, ds, null, false, true, false, defaultmapsettings.shortMass, defaultmapsettings.virMassShots);
                    ogariocellssetts.isVirus = false;
                    temp.push(ogariocellssetts);
                    if (!ogariocellssetts.isInView()) {
                        if (legendmod.indexedCells.hasOwnProperty(e)) {
                            ogariocellssetts = legendmod.indexedCells[e]
                            //legendmod.cells.push(ogariocellssetts);													 
                        } else {
                            legendmod.indexedCells.push(ogariocellssetts);
                        }
                    }
                    //ogariocellssetts.removeCell();
                }
                this.teamPlayers[id].dcells = tempx;
                var today = new Date();
                var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + ":" + today.getMilliseconds();
                console.log("Package Received:", ids, id, time)

                //Here should be food part
            },
            'sendSocket3Position': function() {
                if (i.play && window.noOgarioSocket && Socket3) {
                    //if (window.noOgarioSocket && ogarcopythelb.clanTag!="" && ogarcopythelb.nick.includes("℄")) { 					
                    //Socket3.send(JSON.stringify({ com: "pos", id: customLMID, x: legendmod3.getPlayerX(), y: legendmod3.getPlayerY(), mass: legendmod.playerMass}));					
                    //}
                    var temp = {
                        com: "pos",
                        //id: customLMID,
                        //id: legendmod3.playerID,
                        id: window.unescape(window.encodeURIComponent(legendmod3.lastSentNick)),
                        x: legendmod3.getPlayerX(),
                        y: legendmod3.getPlayerY(),
                        mass: legendmod.playerMass
                    };
                    Socket3.send(JSON.stringify({
                        //"toH": "legendmod",
                        "toH": $("#server-token").val() + "3",
                        "msg": temp
                    }));
                }
            },
            //Sonia4
            'sendSuperLegendSDATA': function() {
                if (i.play && this.playerID) {
                    var s = "";
                    s += window.legendmod.bgpi;
                    this.sendSLG("R", s);
                }
            },
            'sendSimpleLegendSDATA': function() {
                if (i.play && this.playerID) {
                    //var t = this.playerID;
                    var t = window.unescape(window.encodeURIComponent(legendmod3.lastSentNick));
                    var s = window.legendmod.bgpi;
                    if (this.isSLGSocketOpen()) {
                        if (ogarcopythelb.clanTag != this.roomc) {
                            console.log("Sending failed. Reconnecting required..")
                            //this.SLGconnect(window.legendmod.ws);
                            if (window.SLGsocket) {
                                window.SLGsocket.closeAndOpen();
                            }
                            return;
                        }
                        if (s != null) {
                            temp = {
                                "t": t,
                                "s": s
                            }
                            //console.log("send", temp)
                            SLGsocket.send(JSON.stringify({
                                //"toH": "legendmod2",
                                "toH": $("#server-token").val(),
                                "msg": temp
                            }));
                        }
                    }
                }
            },
            //Sonia4
            'getSuperLegendSDATA': function(t) {
                var ids = this.getSLGID(t);
                var id = this.checkPlayerID(ids);
                if (null != id) {
                    var s = this.getSLGVal(t);
                    var lbgpi = s.slice(0, 1);
                    this.teamPlayers[id].lbgpi = parseInt(lbgpi);
                    //if (this.top5[id]){
                    //this.top5[id].lbgpi = parseInt(lbgpi); //
                    //}

                }
            },
            'checkPlayerID': function(t) {
                if (t)
                    for (var e = 0; e < this.teamPlayers.length; e++)
                        if (this.teamPlayers[e].id == t) return e;
                return null;
            },
            'checkPlayerNick': function(t) {
                if (t)
                    for (var e = 0; e < this.teamPlayers.length; e++)
                        if (this.teamPlayers[e].nick == t) return e;
                return null;
            },
            'checkPlayerChat': function(t) {
                if (t)
                    for (var e = 0; e < this.teamPlayers.length; e++)
                        if (this.teamPlayers[e].id == t) return e;
                return null;
            },
            'updateTeamPlayer': function(t) {
                function e() {
                    var paginationStr = "";
                    for (;;) {
                        var i = t.getUint16(s, true);
                        if (0 == i) {
                            break;
                        }
                        paginationStr = paginationStr + String.fromCharCode(i);
                        s = s + 2;
                    }
                    return s = s + 2, paginationStr;
                }

                var i = t.getUint32(1, true);
                var s = 5;
                var o = e();
                var a = this.checkSkinURL(e());
                var n = e();
                var r = e();
                var l = ":party" === this.gameMode ? o + r : o;
                var h = this.checkPlayerID(i);
                if (null !== h) {
                    this.teamPlayers[h].nick = o;
                    this.teamPlayers[h].skinID = l;
                    this.teamPlayers[h].skinURL = a;
                    this.teamPlayers[h].setColor(r, n);
                } else {
                    var c = new function(envId, cb, i, s) {
                        this.id = envId;
                        this.nick = cb;
                        this.skinID = i;
                        this.skinURL = s;
                        this.lbgpi = -1; //Sonia4
                        this.x = 0;
                        this.y = 0;
                        this.lastX = 0;
                        this.lastY = 0;
                        this.mass = 0;
                        this.clanTag = "";
                        this.color = null;
                        this.customColor = defaultSettings.miniMapTeammatesColor;
                        this.alive = false;
                        this.updateTime = null;
                        this.pi2 = 2 * Math.PI;
                        this.setColor = function(i, inRevIdx) {
                            this.color = i;
                            if (7 == inRevIdx.length) {
                                this.customColor = inRevIdx;
                            }
                        };
                        this.drawPosition = function(options, margin, mult, startcode, endcode, value) {
                            if (!(!this.alive || startcode && endcode && this.id != endcode)) {
                                /*
                                var isPositionOK=false;
                                var flag=false;
                                for (var e = 0; e < legendmod.ghostCells.length; e++){ 				
                                	if (window.predictedGhostCells[e] && legendmod.leaderboard[e] && this.nick == legendmod.leaderboard[e].nick){
                                		flag=true;	
                                		this.lastX = window.predictedGhostCells[e].x;
                                		this.lastY = window.predictedGhostCells[e].y;
                                		isPositionOK = true;
                                	}
                                }
                                if ( (flag==false && this.lbgpi >= 0) || legendmod.gameMode == ":party"){
                                	isPositionOK = true;									
                                }	
                                
                                */
                                this.lastX = (29 * this.lastX + this.x) / 30;
                                this.lastY = (29 * this.lastY + this.y) / 30;

                                //if (isPositionOK){
                                var w = (this.lastX + margin) * mult;
                                var h = (this.lastY + margin) * mult;
                                if (this.nick.length > 0) {
                                    options.font = defaultSettings.miniMapNickFontWeight + " " + defaultSettings.miniMapNickSize + "px " + defaultSettings.miniMapNickFontFamily;
                                    options.textAlign = "center";
                                    var namead = "";
                                    if (this.lbgpi < 0) namead += " [ℵ]";
                                    if (defaultSettings.miniMapNickStrokeSize > 0) {
                                        options.lineWidth = defaultSettings.miniMapNickStrokeSize;
                                        options.strokeStyle = defaultSettings.miniMapNickStrokeColor;

                                        options.strokeText(this.nick + namead, w, h - (2 * defaultSettings.miniMapTeammatesSize + 2));
                                    }
                                    options.fillStyle = defaultSettings.miniMapNickColor;
                                    options.fillText(this.nick + namead, w, h - (2 * defaultSettings.miniMapTeammatesSize + 2));
                                }
                                options.beginPath();
                                options.arc(w, h, defaultSettings.miniMapTeammatesSize, 0, this.pi2, false);
                                options.closePath();
                                if (defaultmapsettings.oneColoredTeammates) {
                                    options.fillStyle = defaultSettings.miniMapTeammatesColor;
                                } else {
                                    options.fillStyle = value;
                                }
                                options.fill();
                                //}
                            }
                        };
                    }(i, o, l, a);
                    c.setColor(r, n);
                    this.teamPlayers.push(c);
                }
                this.cacheCustomSkin(o, r, a);
            },
            'updateTeamPlayerPosition': function(t) {
                var e = t.getUint32(1, true),
                    i = this.checkPlayerID(e);
                if (null !== i) {
                    var s = t.getInt32(5, true),
                        o = t.getInt32(9, true),
                        a = t.getUint32(13, true);
                    if (a > 360000) return;
                    var n = this.teamPlayers[i];
                    n.x = s,
                        n.y = o,
                        n.mass = a,
                        n.alive = true,
                        n.updateTime = performance.now(),
                        this.targeting && this.targetID && e == this.targetID && this.updateTarget(n.nick, n.skinURL, s, o, a, n.color, n.lbgpi);
                }
            },
            //Sonia3 Added 3 fuctions below
            'dematrix': function(mat) {
                return !mat[0] && !mat[1] ? 0 : mat[0] && !mat[1] ? 1 : mat[0] && mat[1] ? 2 : 3;
            },
            'setvnr': function(b) {
                window.legendmod.setrot = 1;
                window.legendmod.rotcnt = 0;
                var mat = window.legendmod.vector[window.legendmod.vnr];
                //window.legendmod.prevvnr = window.legendmod.vnr; //jimboy31001
                if ((b == 0 || b == 3) && (window.legendmod.bgpi == 1 || window.legendmod.bgpi == 2)) mat[0] = !mat[0];
                if ((b == 1 || b == 2) && (window.legendmod.bgpi == 0 || window.legendmod.bgpi == 3)) mat[0] = !mat[0];
                if ((b == 0 || b == 1) && (window.legendmod.bgpi == 2 || window.legendmod.bgpi == 3)) mat[1] = !mat[1];
                if ((b == 2 || b == 3) && (window.legendmod.bgpi == 1 || window.legendmod.bgpi == 0)) mat[1] = !mat[1];
                window.legendmod.vnr = this.dematrix(mat);
            },
            'updatevnr': function() {
                var mm = 0;
                var max = 4;
                for (var i = 0; i < this.teamPlayers.length; i++) {
                    var k = this.teamPlayers[i];
                    if (k.mass > mm) {
                        if (k.lbgpi <= 3 && k.lbgpi >= 0) {
                            mm = k.mass;
                            max = k.lbgpi;
                        }
                    }
                }
                if (window.legendmod.gameMode != ":party" && mm > 0 && (!window.legendmod.play || mm > window.legendmod.playerMass) && max <= 3 && window.legendmod.bgpi <= 3 && !window.legendmod.setrot) {
                    console.log("[Legend mod Express] VMR UPDATE:", window.legendmod.vnr, mm, window.legendmod.playerMass, max, window.legendmod.bgpi);
                    this.setvnr(max);
                    console.log('[Legend mod Express] Map fixed with LM players. POS:', max);
                }
            },
            'updateTeamPlayers': function() {
                this.sendPlayerPosition();
                //this.sendSuperLegendSDATA();
                this.sendSimpleLegendSDATA();

                //this.sendSLGQinfo(),
                legendmod3.sendJimboy3100info();
                this.chatUsers = {};
                this.top5 = []; //Sonia3
                this.updatevnr(); //Sonia3
                if (window.legendmod.delstate >= 0) { //Sonia3
                    window.legendmod.delstate += 1; //Sonia3
                    //if (window.legendmod.delstate > 3) window.legendmod.delstate = -1; //Sonia3
					if (window.legendmod.delstate > 3) window.legendmod.delstate = -1; //Sonia3
                } //Sonia3
                var t = 0;
                for (; t < this.teamPlayers.length; t++) {
                    var e = this.teamPlayers[t];
                    if (e.alive && performance.now() - e.updateTime >= 2000 || 0 == e.mass) {
                        e.alive = false;
                        if (this.targeting && this.targetID && e.id == this.targetID) {
                            this.setTargetStatus(2);
                        }
                    }
                    if (e.alive) {
                        this.top5.push({
                            "id": e.id,
                            "nick": e.nick,
                            "x": e.x,
                            "y": e.y,
                            "mass": e.mass,
                            "color": e.color,
                            "skin": e.skinURL,
                            "lbgpi": e.lbgpi
                        });
                        if (!this.isChatUserMuted(e.id)) {
                            this.addChatUser(e.id, e.nick);
                        }
                    }
                }
                this.top5.sort(function(row, conf) {
                        return conf.mass - row.mass;
                    }),
                    this.displayTop5();

            },
            'updateParties': function(t) {
                this.parties = [];
                for (var e = t.getUint8(1), i = 2, s = 0; s < e; s++) {
                    for (var o = '';;) {
                        var a = t.getUint16(i, true);
                        if (0 == a) break;
                        o += String.fromCharCode(a), i += 2;
                    }
                    i += 2, this.parties.push(o);
                }
            },
            'readChatMessage': function(t) {
                if (!defaultmapsettings.disableChat) {
                    var e = new Date().toTimeString().replace(/^(\d{2}:\d{2}).*/, '$1'),
                        i = t.getUint8(1),
                        s = t.getUint32(2, true),
                        o = t.getUint32(6, true);
                    if (!(this.isChatUserMuted(s) || 0 != o && o != this.playerID && s != this.playerID)) {
                        for (var a = '', n = 10; n < t.byteLength; n += 2) {
                            var r = t.getUint16(n, true);
                            if (0 == r) break;
                            a += String.fromCharCode(r);
                        }
                        this.displayChatMessage(e, i, s, a);
                    }
                }
            },
            'sendChatMessage': function(t, e) {
                //console.log(t);console.log(e);
                if (!(performance.now() - this.lastMessageSentTime < 500 || 0 == e.length || 0 == ogarcopythelb.nick.length) && this.isSocketOpen()) {
                    e = ogarcopythelb.nick + ': ' + e;
                    var i = this.createView(10 + 2 * e.length);
                    i.setUint8(0, 100), i.setUint8(1, t), i.setUint32(2, this.playerID, true), i.setUint32(6, 0, true);
                    for (var s = 0; s < e.length; s++) i.setUint16(10 + 2 * s, e.charCodeAt(s), true);
                    this['sendBuffer'](i), this.lastMessageSentTime = performance.now();
                }
            },
            'prepareCommand': function(t) {
                return t.replace('%currentSector%', this.currentSector);
            },
            'sendCommand': function(t) {
                var e = this['prepareCommand'](c['comm' + t]);
                this['sendChatMessage'](102, e);
            },
            'addChatUser': function(t, e) {
                this.chatUsers[t] = e;
            },
            'getChatUserNick': function(t) {
                return this.chatUsers.hasOwnProperty(t) ? this.chatUsers[t] : '';
            },
            'muteChatUser': function(t) {
                if (t && !this.isChatUserMuted(t)) {
                    var e = this.getChatUserNick(t);
                    this.chatMutedUsers[t] = e, this.chatMutedUserIDs.push(t), toastr.error(h.userMuted.replace('%user%', '<strong>' + this.escapeHTML(e) + '</strong>') + ' <button data-user-id=\"' + t + '\" class=\"btn btn-xs btn-green btn-unmute-user\">' + h.unmute + '</button>');
                }
            },
            'unmuteChatUser': function(t) {
                if (t) {
                    var e = this.chatMutedUserIDs.indexOf(t);
                    if (-1 != e) {
                        this.chatMutedUserIDs.splice(e, 1);
                        toastr.info(h["userUnmuted"].replace("%user%", "<strong>" + this.escapeHTML(this.chatMutedUser[t]) + "</strong>"));
                        delete this.chatMutedUser[t];
                    }
                }
            },
            'isChatUserMuted': function(t) {
                return -1 != this.chatMutedUserIDs.indexOf(t);
            },
            'parseMessage': function(t) {
                var e = /\[img\](https?:\/\/i\.(?:imgur|hizliresim)\.com\/\w{6,8}\.(?:jpg|jpeg|png|gif)\??\d*)\[\/img\]/i;
                if (e.test(t)) return defaultmapsettings.showChatImages ? '<img src=\"' + t.match(e)[1].replace('http:', 'https:') + '\" style=\"width:100%;border:none;\">' : '';
                var i = /\[yt\]([\w-]{11})\[\/yt\]/i;
                if (i.test(t)) return defaultmapsettings.showChatVideos ? '<iframe type=\"text/html\" width=\"100%\" height=\"auto\" src=\"https://www.youtube.com/embed/' + t.match(i)[1] + '?autoplay=1&amp;vq=tiny\" frameborder=\"0\" />' : '';
                var s = this.escapeHTML(t);
                return defaultmapsettings['chatEmoticons'] && (s = this.parseEmoticons(s)), s;
            },
            'parseEmoticons': function(t) {
                /*return String(t).replace(/\&lt\;3/g, '<3').replace(/(O\:\)|3\:\)|8\=\)|\:\)|\;\)|\=\)|\:D|X\-D|\=D|\:\(|\;\(|\:P|\;P|\:\*|\$\)|\<3|\:o|\(\:\||\:\||\:\\|\:\@|\|\-\)|\^\_\^|\-\_\-|\$\_\$|\(poop\)|\(fuck\)|\(clap\)|\(ok\)|\(victory\)|\(y\)|\(n\))/g, function(t) {
                    return '<img src=\"https://legendmod.ml/banners/emoticons/' + d[t] + '\" alt=\"' + t + '\" class=\"emoticon\">';
                });*/
                //return String(t).replace(/\&lt\;3/g, '<3').replace(/℄/g, '℄ Legend Clan').replace(/(O\:\)|3\:\)|8\=\)|\:\)|\;\)|\=\)|\:D|X\-D|\=D|\:\(|\;\(|\:P|\;P|\:\*|\$\)|\<3|\:o|\(\:\||\:\||\:\\|\:\@|\|\-\)|\^\_\^|\-\_\-|\$\_\$|\(poop\)|\(fuck\)|\(clap\)|\(ok\)|\(victory\)|\(y\)|\(n\)|\(angry\)|\(clown\)|\(crazy\)|\(devil\)|\(devil2\)|\(fb\)|\(google\)|\(ghost\)|\(heel\)|\(kiss\)|\(lipstick\)|\(rage\)|\(teacher\)|\(together\)|\(toothy\)|\(evil\)|\(baby\)|\(wow\))/g, function(t) {
                return String(t).replace(/\&lt\;3/g, '<3').replace(/℄/g, '℄ Legend Clan').replace(/(O\:\)|3\:\)|8\=\)|\:\)|\;\)|\=\)|\:D|X\-D|\=D|\:\(|\;\(|\:P|\;P|\:\*|\$\)|\<3|\:o|\(\:\||\:\||\:\\|\:\@|\|\-\)|\^\_\^|\-\_\-|\$\_\$|\(poop\)|\(fuck\)|\(clap\)|\(ok\)|\(victory\)|\(y\)|\(n\)|\(angry\)|\(clown\)|\(crazy\)|\(devil\)|\(devil2\)|\(fb\)|\(google\)|\(ghost\)|\(heel\)|\(kiss\)|\(lipstick\)|\(rage\)|\(teacher\)|\(together\)|\(toothy\)|\(evil\)|\(baby\)|\(wow\))/g, function(t) {
                    //console.log(d[t]);
                    return '<img src=\"https://legendmod.ml/banners/emoticons/' + emoticonicons[t] + '\" alt=\"' + t + '\" class=\"emoticon\">';
                });

            },
            'displayChatMessage': function(t, e, i, o) {
                if (0 != o.length) {
                    //console.log(o);
                    var a = o.split(': ', 1).toString(),
                        n = this.parseMessage(o.replace(a + ': ', ''));
                    if (!(0 == a.length || a.length > 15 || 0 == n.length)) {
                        var r = '';
                        if (0 != i && i != this.playerID && (this.addChatUser(i, a), r = '<a href=\"#\" data-user-id=\"' + i + '\" class=\"mute-user ogicon-user-minus\"></a> '), a = this.escapeHTML(a), 101 == e) {
                            if (defaultmapsettings.showChatBox) return $('#chat-box').append('<div class=\"message\"><span class=\"message-time\">[' + t + '] </span>' + r + '<span class=\"message-nick\">' + a + ': </span><span class=\"message-text\">' + n + '</span></div>'),
                                $('#chat-box').perfectScrollbar('update'), $('#chat-box').animate({
                                    'scrollTop': $('#chat-box').prop('scrollHeight')
                                }, 500), void(defaultmapsettings.chatSounds && this.playSound(this.messageSound));
                            defaultmapsettings.hideChat || (toastr.success('<span class=\"message-nick\">' + a + ': </span><span class=\"message-text\">' + n + '</span>' + r), defaultmapsettings.chatSounds && this.playSound(this.messageSound)), this.chatHistory.push({
                                'nick': a,
                                'message': n
                            }), this.chatHistory.length > 15 && this.chatHistory.shift();
                        } else if (102 == e) {
                            if (defaultmapsettings.showChatBox) return $('#chat-box').append('<div class=\"message command\"><span class=\"command-time\">[' + t + '] </span>' + r + '<span class=\"command-nick\">' + a + ': </span><span class=\"command-text\">' + n + '</span></div>'),
                                $('#chat-box').perfectScrollbar('update'), $('#chat-box').animate({
                                    'scrollTop': $('#chat-box').prop('scrollHeight')
                                }, 500), void(defaultmapsettings.chatSounds && this.playSound(this.commandSound));
                            defaultmapsettings.hideChat || (toastr.warning('<span class=\"command-nick\">' + a + ': </span><span class=\"command-text\">' + n + '</span>' + r), defaultmapsettings.chatSounds && this.playSound(this.commandSound));
                        } else $('#messages').append(o);
                    }
                }
            },
            'displayUserList': function(t, e, i, s, o) {
                var a = '';
                if (Object['keys'](t).length) {
                    for (var n in a += '<ol class=\"user-list\">', t) t.hasOwnProperty(n) && (a += '<li><strong>' + this.escapeHTML(t[n]) + '</strong> <button data-user-id=\"' + n + '\" class=\"btn btn-xs ' + i + '\">' + s + '</button></li>');
                    a += '</ol>';
                } else a += h.none;
                toastr[o](a, e, {
                    'closeButton': true,
                    'tapToDismiss': false
                });
            },
            'displayChatActiveUsers': function() {
                this.displayUserList(this.chatUsers, h.activeUsers, 'btn-red btn-mute-user', h.mute, 'info');
            },
            'displayChatMutedUsers': function() {
                this.displayUserList(this.chatMutedUsers, h.mutedUsers, 'btn-green btn-unmute-user', h.unmute, 'error');
            },
            'preloadChatSounds': function() {
                this.setMessageSound(),
                    this.setCommandSound(),
                    this.setvirusSound();
            },
            'setChatSoundsBtn': function() {
                defaultmapsettings.chatSounds ? $('.chat-sound-notifications').removeClass('ogicon-volume-mute2').addClass('ogicon-volume-high') : $('.chat-sound-notifications').removeClass('ogicon-volume-high').addClass('ogicon-volume-mute2');
            },
            'setMessageSound': function() {
                this.messageSound = this.setSound(defaultmapsettings.messageSound);
            },
            'setCommandSound': function() {
                this.commandSound = this.setSound(defaultmapsettings.commandSound);
            },
            'setvirusSound': function() {
                this.virusSoundurl = this.setSound(defaultmapsettings.virusSoundurl);
            },
            'setSound': function(t) {
                return t ? new Audio(t) : null;
            },
            /*            'playSound': function(t) {
                            //t && t.play && (t.pause(), t.currentTime = 0, t.play());
                            //t && t.play && t.play!==null && (t.pause(), t.currentTime = 0, t.play());
                            t.pause();
                            t.currentTime = 0;
                            var nopromise = {
                                catch: new Function()
                            };
                            (t.play() || nopromise).catch(function() {});
                        },
            */
            'playSound': function(t) {
                if (t && t.play) {
                    t.pause();
                    t.currentTime = 0;
                    //t.play();
                    var nopromise = {
                        catch: new Function()
                    };
                    (t.play() || nopromise).catch(function() {});
                }
            },
            'setTargeting': function() {
                if (this.targetID) {
                    this.targeting = !this.targeting, i.targeting = this.targeting, this.setTargetingInfo();
                }
            },
            'setTargetingInfo': function() {
                this.targeting ? ($('#set-targeting').addClass('active'),
                    $('#target-status').show(),
                    2 != this.targetStatus && $('#target-summary').show()) : ($('#set-targeting').removeClass('active'),
                    $('#target-summary, #target-status').hide());
            },
            'cancelTargeting': function() {
                this.setTargetStatus(0);
            },
            'setPrivateMiniMap': function() {
                this.targetID && (this.privateMiniMap = !this.privateMiniMap, this.privateMiniMap ? $('#set-private-minimap').addClass('active') : $('#set-private-minimap').removeClass('active'));
            },
            'setTarget': function(t) {
                var e = this.checkPlayerID(t);
                if (null !== e) {
                    var i = this.teamPlayers[e];
                    if (this.targetID = i.id, this.updateTarget(i.nick, i.skinURL, i.x, i.y, i.mass, i.color, i.lbgpi), !i.alive) {
                        return void this.setTargetStatus(2);
                    }
                    this.setTargetStatus(1);
                } else this.setTargetStatus(0);
            },
            'setTargetStatus': function(t) {
                switch (t) {
                    case 0:
                        this.targetStatus = 0,
                            this.targetID = 0,
                            this.targetNick = '',
                            this.targetSkinURL = '',
                            this.targeting = false,
                            i.targeting = false,
                            this.privateMiniMap = false,
                            $('#target-skin, #target-nick, #target-summary').hide(),
                            $("#target-hud").hide(),
                            $('#target-status').show().text(h.targetNotSet),
                            $('#target-panel-hud a').removeClass('active'); //$('#target-status').show().text('[' + h.targetNotSet + ']'), $('#target-panel-hud a').removeClass('active');
                        break;
                    case 1:
                        this.targetStatus = 1,
                            this.targeting || (this.targeting = true, i.targeting = true, $("#target-hud").show(), this.setTargetingInfo()),
                            $('#target-skin, #target-nick, #target-status, #target-summary').show();
                        break;
                    case 2:
                        //this.targetStatus = 2, $('#target-summary').hide(), $("#target-hud").show(), $('#target-status').show().text('[' + h.targetDead + ']'), i.resetTargetPosition();
                        this.targetStatus = 2,
                            $('#target-summary').hide(),
                            $("#target-hud").show(),
                            $('#target-status').show().text('[' + Languageletter369 + ']'),
                            i.resetTargetPosition();
                }
            },
            'changeTarget': function() {
                for (var t = this.checkPlayerID(this.targetID), e = null, i = 0; i < this.teamPlayers.length; i++)
                    if (this.teamPlayers[i].alive) {
                        if (null === t) {
                            t = i;
                            break;
                        }
                        if (i < t && null === e) e = i;
                        else if (i > t) {
                            e = i;
                            break;
                        }
                    }
                null !== e && (t = e), null !== t ? this.setTarget(this.teamPlayers[t].id) : this.setTargetStatus(0);
            },
            'updateTarget': function(t, e, o, a, n, r, f) {
                i.setTargetPosition(o, a);
                if (this.targetNick !== t) {
                    this.targetNick = t;
                    $('#target-nick').html(this.escapeHTML(t))
                }
                $('#target-skin').css('background-color', r);
                if (e) {
                    if (this.targetSkinURL !== e) {
                        if (this.customSkinsCache.hasOwnProperty(e + '_cached')) {
                            $('#target-skin img').attr('src', e);
                            this.targetSkinURL = e;
                        } else {
                            $('#target-skin img').attr('src', 'https://legendmod.ml/banners/static/img/blank.png')
                        }

                    }
                }
                $('#target-status').text('[' + this.shortMassFormat(n) + ']');
                //var l = this.calculateMapSector(o, a);
                var l;
                //c = h.targetDistance + ': <span class=\"hud-main-color\">' + i.targetDistance + ' [' + l + ']</span>';
                var flag = false;
                for (var j = 0; j < legendmod.ghostCells.length; j++) {
                    if (legendmod.leaderboard[j] && this.targetNick == legendmod.leaderboard[j].nick) {

                        if (flag == false) {
                            l = window.legendmod3.calculateMapSector(window.predictedGhostCells[j].x+legendmod.mapOffsetX, window.predictedGhostCells[j].y+legendmod.mapOffsetY)
                            flag = true;
                        }
                    }
                };
                if (flag == false && f >= 0) {
                    l = this.calculateMapSector(o, a);
                } else if (flag == false && (this.calculateMapSector(o, a) == "C3" || legendmod.gameMode == ":party")) {
                    l = this.calculateMapSector(o, a);
                } else if (flag == false) {
                    l = "Unknown";
                };
                c = Languageletter368 + ': <span class=\"hud-main-color\">' + i.targetDistance + ' [' + l + ']</span>';
                if (i.play) {
                    c += ' | ' + h['targetMass'] + ': <span class=\"hud-main-color\">' + this.shortMassFormat(n + i.playerMass) + '</span>'
                }
                $('#target-summary').html(c);
                if (1 != this.targetStatus) {
                    this.setTargetStatus(1);
                }
            },
            'updateQuest': function() {
                this.showQuest && ':ffa' === this.gameMode && window.MC && window.MC.getQuestProgressLabel && (this.questHUD.textContent = window.MC.getQuestProgressLabel());
            },
            'init': function() {
                this.loadSettings(),
                    this.loadProfiles(),
                    this.setLang(),
                    this.setMenu(),
                    this.setUI(),
                    hudsetter && hudsetter.setTheme(),
                    this.setShowQuickMenu(),
                    this.setShowSkinsPanel(),
                    this.setProfile(),
                    this.setMainButtons(),
                    this.setStreamMode(),
                    this.setHideSkinUrl(),
                    this.setMiniMap(),
                    this.setAutoResp(),
                    this.setDisableChat(),
                    this.setShowChatBox(),
                    this.setTop5(),
                    this.setTargetingHUD(),
                    this.setQuest(),
                    this.displayTime(),
                    this.setCenteredLb(),
                    this.setNormalLb(),
                    this.setFpsAtTop(),
					this.setTweenMaxEffect(),
                    this.displayStats(),
                    this.setBlockPopups(),
                    this.preloadChatSounds(),
                    this.setChatSoundsBtn();
                var t = this;
                setInterval(function() {
                        t.drawMiniMap();
                    }, 33),
                    setInterval(function() {
                        t.updateTeamPlayers();
                        legendmod3.sendSocket3Position();
                    }, this.updateInterval);
            }
        };

        function irenderfromagario() {
            this.txt = '',
                this.txtCanvas = null,
                this.txtCtx = null,
                this.color = '#FFFFFF',
                this.stroke = false,
                this.strokeWidth = 2,
                this.strokeColor = '#000000',
                this.font = '700 16px Ubuntu',
                this.fontFamily = 'Ubuntu',
                this.fontWeight = 700,
                this.fontSize = 16,
                this.margin = 3,
                this.scale = 1,
                this.quality = 1,
                this.measuredWidth = 0,
                this.redraw = false,
                this.remeasure = false,
                this.setTxt = function(ogariosettxtsetter) {
                    this.txt !== ogariosettxtsetter && (this.txt = ogariosettxtsetter,
                        this.redraw = true,
                        this.remeasure = true);
                },
                this.setColor = function(ogariocolorsetter) {
                    this.color !== ogariocolorsetter && (this.color = ogariocolorsetter,
                        this.redraw = true);
                },
                this.setStroke = function(ogariostrokesetter) {
                    this.stroke !== ogariostrokesetter && (this.stroke = ogariostrokesetter,
                        this.redraw = true);
                },
                this.setStrokeWidth = function(ogariostrokewidthsetter) {
                    this.stroke && this.strokeWidth != ogariostrokewidthsetter && (this.strokeWidth = ogariostrokewidthsetter,
                        this.redraw = true,
                        this.remeasure = true);
                },
                this.setStrokeColor = function(ogariostrokecolorsetter) {
                    this.stroke && this.strokeColor !== ogariostrokecolorsetter && (this.strokeColor = ogariostrokecolorsetter,
                        this.redraw = true);
                },
                this.setFont = function() {
                    this.font = this.fontWeight + ' ' + this.fontSize + 'px ' + this.fontFamily;
                },
                this.setFontFamily = function(ogariofontfamilysetter) {
                    this.fontFamily !== ogariofontfamilysetter && (this.fontFamily = ogariofontfamilysetter,
                        this.setFont(),
                        this.redraw = true,
                        this.remeasure = true);
                },
                this.setFontWeight = function(ogariofontweightsetter) {
                    this.fontWeight != ogariofontweightsetter && (this.fontWeight = ogariofontweightsetter,
                        this.setFont(),
                        this.redraw = true,
                        this.remeasure = true);
                },
                this.setFontSize = function(ogariofontsizesetter) {
                    this.fontSize != ogariofontsizesetter && (this.fontSize = ogariofontsizesetter,
                        this.margin = ~~(0.2 * ogariofontsizesetter),
                        this.setFont(),
                        this.redraw = true);
                },
                this.setScale = function(ogarioscalesetter) {
                    this.scale != ogarioscalesetter && (this.scale = ogarioscalesetter,
                        this.redraw = true);
                },
                this.createCanvas = function() {
                    this.txtCanvas || (this.txtCanvas = document.createElement('canvas'),
                        this.txtCtx = this.txtCanvas.getContext('2d'),
                        this.txtCtx.ogarioCtx = true);
                },
                this.setDrawing = function(ogarsetDrawinglabel1, ogarsetDrawinglabel2, ogarsetDrawinglabel3, ogarsetDrawinglabel4, ogarsetDrawinglabel5, ogarsetDrawinglabel6) {
                    this.setColor(ogarsetDrawinglabel1);
                    this.setFontFamily(ogarsetDrawinglabel2);
                    this.setFontWeight(ogarsetDrawinglabel3);
                    this.setStroke(ogarsetDrawinglabel4);
                    this.setStrokeWidth(ogarsetDrawinglabel5);
                    this.setStrokeColor(ogarsetDrawinglabel6);
                },
                this.measureWidth = function() {
                    return this.remeasure && (this.txtCtx.font = this.fontWeight + ' 10px ' + this.fontFamily,
                            this.measuredWidth = this.txtCtx.measureText(this.txt).width,
                            this.remeasure = false),
                        ~~(this.fontSize / 10 * this.measuredWidth) + 2 * this.strokeWidth;
                },
                //
                this.measureWidthCustom = function(customTxt) {
                    return customTxt && this.remeasure && (this.txtCtx.font = this.fontWeight + ' 10px ' + this.fontFamily,
                            this.measuredWidth = this.txtCtx.measureText(customTxt).width,
                            this.remeasure = false),
                        ~~(this.fontSize / 10 * this.measuredWidth) + 2 * this.strokeWidth;
                },
                //
                this.drawTxt = function(customTxt) {
                    return this.createCanvas(),
                        this.redraw && (this.redraw = false,


                            this.txtCanvas.width = this.measureWidthCustom(customTxt),
                            this.txtCanvas.width = this.measureWidth(),
                            this.txtCanvas.height = this.fontSize + this.margin * 2,
                            this.txtCtx.font = this.font,
                            this.txtCtx.globalAlpha = 1,
                            this.txtCtx.lineWidth = this.strokeWidth,
                            this.txtCtx.strokeStyle = this.strokeColor,
                            this.txtCtx.fillStyle = this.color,
                            customTxt && this.stroke && this.txtCtx.strokeText(customTxt, this.strokeWidth, ~~(this.fontSize - this.margin * 0.5)),
                            !customTxt && this.stroke && this.txtCtx.strokeText(this.txt, this.strokeWidth, ~~(this.fontSize + this.margin * 0.5)),
                            customTxt && this.txtCtx.fillText(customTxt, this.strokeWidth, ~~(this.fontSize - this.margin * 0.5)),
                            !customTxt && this.txtCtx.fillText(this.txt, this.strokeWidth, ~~(this.fontSize + this.margin * 0.5))),
                        this.txtCanvas;
                };

        }
        window.legendmod3 = ogarminimapdrawer;

        function ogarbasicassembly(t, e, s, o, a, n, r, l, h, c) {
            //lylko
            this.points = []
            this.pointsVel = []
            this.maxPointRad = 0


            this.oldAlpha = 0;
            this.id = t;
            this.x = e;
            this.y = s;
            this.targetX = e;
            this.targetY = s;
            this.color = a;
            this.oppColor = null;
            this.size = o;
            this.targetSize = o;
            this.alpha = 1;
            this.nick = '';
            this.targetNick = '';
            this.nickCanvas = null;
            this.mass = 0;
            this.lastMass = 0;
            //			this.historyMass = [];
            //			this.historyX = [];
            //			this.historyY = [];
            this.kMass = 0;
            this.massCanvas = null;
            this.mergeCanvas = null;
            this.massTxt = '';
            this.margin = 0;
            this.scale = 1;
            this.nickScale = 1;
            this.massScale = 1;
            this.virMassScale = 3;
            this.strokeScale = 1;
            this.fontSize = 26;
            this.nickSize = 26;
            this.lastNickSize = 0;
            this.massSize = 26;
            this.virMassSize = 26;
            this.nickStrokeSize = 3;
            this.massStrokeSize = 3;
            this.isFood = n;
            this.isVirus = r;
            this.isPlayerCell = l;
            this.shortMass = h;
            this.virMassShots = c;
            this.rescale = false;
            this.redrawNick = true;
            this.redrawMass = true;
            this.redrawMerge = true;
            this.optimizedNames = false;
            this.optimizedMass = false;
            this.strokeNick = false;
            this.strokeMass = false;
            this.removed = false;
            this.redrawed = 0;
            this.time = 0;
            this.skin = null;
            this.pi2 = 2 * Math.PI;
            this.virusColor = null;
            this.virusStroke = null;
            this.nHeight = 6;

            this.updateNumPoints = function() {
                //adjustment of the number of contacts
                var numPoints = this.size * ogarfooddrawer.scale | 0;
                numPoints = Math.max(numPoints, 5);
                numPoints = Math.min(numPoints, 120);
                if (this.isVirus) numPoints = 100;
                while (this.points.length > numPoints) {
                    var i = Math.random() * this.points.length | 0;
                    this.points.splice(i, 1);
                    this.pointsVel.splice(i, 1);
                }
                if (this.points.length == 0 && numPoints != 0) {
                    this.points.push({
                        x: this.x,
                        y: this.y,
                        rl: this.size,
                        parent: this //?
                    });
                    this.pointsVel.push(Math.random() - 0.5);
                }
                while (this.points.length < numPoints) {
                    var i = Math.random() * this.points.length | 0;
                    var point = this.points[i];
                    var vel = this.pointsVel[i];
                    this.points.splice(i, 0, {
                        x: point.x,
                        y: point.y,
                        rl: point.rl,
                        parent: this
                    });
                    this.pointsVel.splice(i, 0, vel);
                }
            }
            this.sqDist = function(a, b) {
                return (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y);
            }
            this.movePoints = function() {
                //console.log(this.id)
                var pointsVel = this.pointsVel.slice();
                var len = this.points.length;
                for (var i = 0; i < len; ++i) {
                    var prevVel = pointsVel[(i - 1 + len) % len];
                    var nextVel = pointsVel[(i + 1) % len];
                    var newVel = (this.pointsVel[i] + Math.random() - 0.5) * 0.7;
                    newVel = Math.max(Math.min(newVel, 10), -10);
                    this.pointsVel[i] = (prevVel + nextVel + 8 * newVel) / 10;
                }
                this.maxPointRad = 0
                for (var i = 0; i < len; ++i) {
                    var curP = this.points[i];
                    var curRl = curP.rl;
                    var prevRl = this.points[(i - 1 + len) % len].rl;
                    var nextRl = this.points[(i + 1) % len].rl;
                    var self = this;
                    var affected = LM.quadtree.some({
                        x: curP.x - 5,
                        y: curP.y - 5,
                        w: 10,
                        h: 10
                    }, function(item) {
                        return item.parent != self && this.sqDist(item, curP) <= 25;
                    }.bind(this));

                    //this.viewMinX, this.viewMinY, this.viewMaxX, this.viewMaxY

                    //(curP.x < LM.mapMinX || curP.y < LM.mapMaxY ||
                    //curP.x > LM.mapMaxX || curP.y > LM.mapMinY))


                    //(curP.x < LM.viewMinX || curP.y < LM.viewMaxY ||
                    //curP.x > LM.viewMaxX || curP.y > LM.viewMinY))

                    /*if (!affected &&
                        (curP.x < LM.mapMinX || curP.y < LM.mapMaxY ||
                        curP.x > LM.mapMaxX || curP.y > LM.mapMinY))
                    {
                        affected = true;
                    }*/
                    if (affected) {
                        //console.log('affected!!!!!')
                        this.pointsVel[i] = Math.min(this.pointsVel[i], 0);
                        this.pointsVel[i] -= 1;
                    }
                    curRl += this.pointsVel[i];
                    curRl = Math.max(curRl, 0);

                    curRl = (9 * curRl + this.size) / 10; //собака

                    curP.rl = (prevRl + this.size + 8 * curRl) / 10; //собака

                    //curP.rl = (prevRl + nextRl + 8 * curRl) / 10;

                    var angle = 2 * Math.PI * i / len;
                    var rl = curP.rl;
                    if (rl > this.maxPointRad) this.maxPointRad = rl
                    if (this.isVirus && i % 2 == 0) {
                        rl += 5;
                    }

                    curP.x = this.x + Math.cos(angle) * rl;
                    curP.y = this.y + Math.sin(angle) * rl;
                }
            };

            this.update = function(t, e, i, s, o, a) {
                this.x = t;
                this.y = e;
                this.isVirus = s;
                this.isPlayerCell = o;
                this.setMass(i);
                this.setNick(a);
            };
            this.removeCell = function() {
                this.removed = true;
                var t = LM.cells.indexOf(this);
                if (t != -1) {
                    LM.cells.splice(t, 1);
                    if (defaultmapsettings.virusesRange) {
                        t = LM.viruses.indexOf(this);
                        if (t != -1) {
                            LM.viruses.splice(t, 1);
                        }
                    }
                } else {
                    t = LM.food.indexOf(this);
                    if (t != -1) {
                        LM.food.splice(t, 1);
                    }
                }
                t = LM.playerCells.indexOf(this);
                if (t != -1) {
                    LM.removePlayerCell = true;
                    LM.playerCells.splice(t, 1);
                    t = LM.playerCellIDs.indexOf(this.id);
                    if (t != -1) {
                        LM.playerCellIDs.splice(t, 1);
                    }
                }
                if (this.redrawed) {
                    LM.removedCells.push(this);
                }
                delete LM.indexedCells[this.id];
            };
            this.moveCell = function() {
                var t = LM.time - this.time;
                var t1 = t / defaultmapsettings.animation;
                t1 = t1 < 0 ? 0 : t1 > 1 ? 1 : t1;
                this.x += (this.targetX - this.x) * t1;
                this.y += (this.targetY - this.y) * t1;
                this.size += (this.targetSize - this.size) * t1;
                this.alpha = t1;
                if (!this.removed) {
                    this.time = LM.time;
                    return;
                }
                if (t1 == 1) {
                    var t2 = LM.removedCells.indexOf(this);
                    if (t2 != -1) {
                        LM.removedCells.splice(t2, 1);
                    }
                }
            };
            this.isInView = function() {
                return !(this.id <= 0) && !(this.x + this.size + 40 < LM.viewX - LM.canvasWidth / 2 / LM.scale || this.y + this.size + 40 < LM.viewY - LM.canvasHeight / 2 / LM.scale || this.x - this.size - 40 > LM.viewX + LM.canvasWidth / 2 / LM.scale || this.y - this.size - 40 > LM.viewY + LM.canvasHeight / 2 / LM.scale);
            };
            /*
				this.setMass = function(t) {
                    return this.size = t, !(t <= 40) && (this.massCanvas ? (this.mass = ~~(t * t / 100), this.redrawMass = true, this.isVirus ? (this.virMassShots && this.mass < 200 && (this.mass = ~~((200 - this.mass) / 14)), this.massTxt = this.mass.toString(), this.mass > 220 ? (this.virusColor = defaultSettings.mVirusColor, this.virusStroke = defaultSettings.mVirusStrokeColor) : (this.virusColor = defaultSettings.virusColor, this.virusStroke = defaultSettings.virusStrokeColor), true) : (this.massTxt = this.mass.toString(), this.mass <= 200 || (this.shortMass && this.mass >= 1000 ? (this.kMass = Math.round(this.mass / 100) / 10, this.massTxt = this.kMass + 'k', true) : (this.optimizedMass && (this.redrawMass = Math.abs((this.mass - this.lastMass) / this.mass) >= 0.02 || this.rescale), true)))) : (this.massCanvas = new irenderfromagario(), false));
                };
				*/
            this.setMass = function(t) {
                this.size = t;
                if (t <= 40) {
                    return false;
                }
                if (!this.massCanvas) {
                    this.massCanvas = new irenderfromagario();
                    return false;
                }
                if (!window.legendmod5.optimizedMass && window.ExternalScripts && !this.mergeCanvas) {
                    this.mergeCanvas = new irenderfromagario();
                    return false;
                }
                this.mass = ~~(t * t / 100);
                this.redrawMass = true;
                if (this.isVirus) {
                    if (this.mass <= 200) {
                        this.virusColor = defaultSettings.virusColor, this.virusStroke = defaultSettings.virusStrokeColor;
                    } else if (this.mass > 220) {
                        this.virusColor = defaultSettings.mVirusColor, this.virusStroke = defaultSettings.mVirusStrokeColor;
                    }
                    if (this.virMassShots) {
                        this.mass = ~~((200 - this.mass) / 14);
                    }
                    if (defaultmapsettings.virusSound && this.lastMass && this.mass < this.lastMass) {
                        void legendmod3.playSound(legendmod3.virusSoundurl);
                    }
                    this.massTxt = this.mass.toString();
                }
                this.massTxt = this.mass.toString();

                if (this.shortMass && this.mass >= 1000) {
                    this.kMass = Math.round(this.mass / 100) / 10;
                    this.massTxt = this.kMass + 'k';
                    return true;
                }
                if (this.optimizedMass) {
                    this.redrawMass = Math.abs((this.mass - this.lastMass) / this.mass) >= 0.02 || this.rescale;
                }
                return true;
            };

            this.setNick = function(t) {
                this.nick = t;
                if (!t || this.isVirus) {
                    return false;
                }
                if (!this.nickCanvas) {
                    this.nickCanvas = new irenderfromagario();
                    return false;
                }
                return true;
            };
            this.setScale = function(t, e, i, s, o) {
                var t = Math.ceil(t * 10) / 10;
                this.rescale = false;
                if (this.scale != t) {
                    this.scale = t;
                    this.rescale = true;
                }
                this.nickScale = e;
                this.massScale = i;
                this.virMassScale = s;
                this.strokeScale = o;
            };
            this.setFontSize = function() {
                if (this.isVirus) {
                    this.massSize = Math.ceil(this.virMassSize * this.scale * this.virMassScale);
                    return;
                }
                this.fontSize = Math.max(this.size * 0.3, 26) * this.scale;
                this.nickSize = ~~(this.fontSize * this.nickScale);
                this.massSize = ~~(this.fontSize * 0.5 * this.massScale);
                if (this.optimizedNames) {
                    this.redrawNick = Math.abs((this.nickSize - this.lastNickSize) / this.nickSize) >= 0.3 || this.rescale;
                    return;
                }
                this.redrawNick = true;
            };
            this.setStrokeSize = function() {
                if (this.strokeNick && !this.isVirus) {
                    this.nickStrokeSize = ~~(this.nickSize * 0.1 * this.strokeScale);
                }
                if (this.strokeMass) {
                    this.massStrokeSize = ~~(this.massSize * 0.1 * this.strokeScale);
                }
            };
            this.setDrawing = function() {
                this.optimizedNames = defaultmapsettings.optimizedNames;
                this.optimizedMass = defaultmapsettings.optimizedMass;
                this.shortMass = defaultmapsettings.shortMass;
                this.virMassShots = defaultmapsettings.virMassShots;
                this.strokeNick = defaultmapsettings.namesStroke;
                this.strokeMass = defaultmapsettings.massStroke;
            };
            this.setDrawingScale = function() {
                this.setScale(i.viewScale, defaultSettings.namesScale, defaultSettings.massScale, defaultSettings.virMassScale, defaultSettings.strokeScale);
                this.setFontSize();
                this.setStrokeSize();
                this.margin = 0;
            };
            this.drawNick = function(t) {
                if (!this.nick || !this.nickCanvas || this.isVirus) {
                    return;
                }
                var nickCanvas = this.nickCanvas;
                nickCanvas.setDrawing(defaultSettings.namesColor, defaultSettings.namesFontFamily, defaultSettings.namesFontWeight, this.strokeNick, this.nickStrokeSize, defaultSettings.namesStrokeColor);
                nickCanvas.setTxt(this.nick);
                if (this.redrawNick) {
                    nickCanvas.setFontSize(this.nickSize);
                    this.lastNickSize = this.nickSize;
                }
                nickCanvas.setScale(this.scale);
                var nickImg = nickCanvas.drawTxt();
                var w = ~~(nickImg.width / this.scale);
                var h = ~~(nickImg.height / this.scale);
                this.margin = ~~(h / 2);
                try {
                    t.drawImage(nickImg, ~~this.x - ~~(w / 2), ~~this.y - this.margin, w, h);
                } catch (e) {}
            };
            this.drawMerge = function(context) {
                if (this.mergeCanvas && !(this.size <= 40)) {
                    var mergeCanvas = this.mergeCanvas;
                    mergeCanvas.setDrawing(defaultSettings.massColor, defaultSettings.massFontFamily, defaultSettings.massFontWeight, this.strokeMass, this.massStrokeSize, defaultSettings.massStrokeColor);
                    mergeCanvas.setFontSize(this.massSize);
                    mergeCanvas.setScale(this.scale);

                    if (window.ExternalScripts && !defaultmapsettings.optimizedMass && window.playerCellsId && this.isPlayerCell && !this.isVirus) {
                        CellTimerTrigger();
                        if (window.playerCellsId[this.id] == undefined) {
                            window.playerCellsId[this.id] = {};
                            window.playerCellsId[this.id].historyMass = [];
                            window.playerCellsId[this.id].historyX = [];
                            window.playerCellsId[this.id].historyY = [];
                        } else {
                            window.playerCellsId[this.id].historyMass.unshift(this.mass); //i test mass with size to find out the merging time
                            if (window.playerCellsId[this.id].historyMass.length > 500) {
                                window.playerCellsId[this.id].historyMass.pop();
                            }
                            window.playerCellsId[this.id].historyX.unshift(this.x);
                            if (window.playerCellsId[this.id].historyX.length > 500) {
                                window.playerCellsId[this.id].historyX.pop();
                            }
                            window.playerCellsId[this.id].historyY.unshift(this.y);
                            if (window.playerCellsId[this.id].historyY.length > 500) {
                                //this.historyY.pop();
                                window.playerCellsId[this.id].historyY.pop();
                            }
                        }
                        //if (this.mergeTime && this.mergeTime > 0) {
                        if (window.legendmod.playerCells.length > 1 && window.playerCellsId[this.id].mergeTime && window.playerCellsId[this.id].mergeTime > 1) {
                            var customTxt = Math.round(window.playerCellsId[this.id].mergeTime);

                            if (this.redrawMerge) {
                                mergeCanvas.setTxt(customTxt);
                                //this.lastMass = this.mass;
                            }
                            var data = mergeCanvas.drawTxt(customTxt);
                            var width = ~~(data.width / this.scale);
                            //console.log(data.width, this.scale, width, this.x - width / 2);
                            var height = ~~(data.height / this.scale);
                            var textureY = this.margin === 0 ? ~~(this.y + height * 2) : ~~this.y - 4 * this.margin;
                            if (width > 1 && height > 1) {
                                try {
                                    context.drawImage(data, ~~(this.x - width / 2), textureY, width, height);
                                } catch (e) {}
                            }

                        }

                    }
                    ///


                    //window.counterCell++;
                }
            };
            this.drawMass = function(context) {
                if (this.massCanvas && !(this.size <= 40)) {
                    var massCanvas = this.massCanvas;
                    massCanvas.setDrawing(defaultSettings.massColor, defaultSettings.massFontFamily, defaultSettings.massFontWeight, this.strokeMass, this.massStrokeSize, defaultSettings.massStrokeColor);
                    //
                    if (this.redrawMass) {
                        massCanvas.setTxt(this.massTxt);
                        this.lastMass = this.mass;
                    }
                    massCanvas.setFontSize(this.massSize);
                    massCanvas.setScale(this.scale);

                    var data = massCanvas.drawTxt();
                    var width = ~~(data.width / this.scale);
                    //console.log("m:"+data.width, this.scale, width, this.x - width / 2);
                    var height = ~~(data.height / this.scale)
                    var textureY = this.margin === 0 ? ~~(this.y - height / 2) : ~~this.y + this.margin;
                    if (width > 1 && height > 1) {
                        try {
                            context.drawImage(data, ~~(this.x - width / 2), textureY, width, height);
                        } catch (e) {}
                    }
                }
            };
            this.createStrokeVirusPath = function(shadowXpos, shadowYpos, zeroSizeMax, pixelSizeTargetMax = 6) {
                const nAngelsOfVirus = ~~(45 * zeroSizeMax / 98);
                const GROUPSIZE = this.pi2 / nAngelsOfVirus;
                const degreeStep = GROUPSIZE / 2;
                const ctxfx = new Path2D;
                const radiusX = zeroSizeMax - pixelSizeTargetMax;
                const tileHeight = radiusX + this.nHeight;
                const n = this.pi2 + GROUPSIZE;
                for (let i = 0, j = degreeStep; i <= n; j = (i = i + GROUPSIZE) + degreeStep) {
                    ctxfx.lineTo(~~(shadowXpos + radiusX * Math.sin(i)), ~~(shadowYpos + radiusX * Math.cos(i)));
                    ctxfx.lineTo(~~(shadowXpos + tileHeight * Math.sin(j)), ~~(shadowYpos + tileHeight * Math.cos(j)));
                }
                return ctxfx;
            };
            this.draw = function(style, canCreateDiscussions) {
                if (!(LM.hideSmallBots && this.size <= 36)) {
                    style.save();
                    this.redrawed++;
                    if (canCreateDiscussions) {
                        this.moveCell();
                    }
                    if (this.removed) {
                        style.globalAlpha *= 1 - this.alpha;
                    }
                    var value = style.globalAlpha;
                    var s = false;
                    var y = this.isFood ? this.size + defaultSettings.foodSize : this.size;
                    style.beginPath()


                    if (defaultmapsettings.jellyPhisycs && this.points.length) {
                        var point = this.points[0];
                        style.moveTo(point.x, point.y);
                        for (var i = 0; i < this.points.length; ++i) {
                            var point = this.points[i];
                            style.lineTo(point.x, point.y);
                        }
                    } else if (defaultmapsettings.jellyPhisycs && this.isVirus) {
                        style.lineJoin = "miter"
                        var pointCount = 120;
                        var incremental = this.pi2 / pointCount;
                        style.moveTo(this.x, this.y + this.size + 3);
                        for (var i = 1; i < pointCount; i++) {
                            var angle = i * incremental;
                            var dist = this.size - 3 + (i % 2 === 0) * 6;
                            style.lineTo(
                                this.x + dist * Math.sin(angle),
                                this.y + dist * Math.cos(angle)
                            )
                        }
                        style.lineTo(this.x, this.y + this.size + 3);
                    } else style.arc(this.x, this.y, y, 0, this.pi2, false);

                    style.closePath();



                    //if (style.arc(this.x, this.y, y, 0, this.pi2, false), style.closePath(), this.isFood) {
                    //    return style.fillStyle = this.color, style.fill(), void style.restore();
                    //}


                    if (!defaultmapsettings.jellyPhisycs) {
                        if (this.isVirus) {
                            //console.log("is not jelly");
                            if (dyinglight1load == "yes") {
                                try {
                                    style.drawImage(cimgDyingLightvirus, this.x - 0.8 * this.size, this.y - 0.8 * this.size, 1.6 * this.size, 1.6 * this.size);
                                } catch (e) {}
                            }
                            return defaultmapsettings.transparentViruses && (style.globalAlpha *= defaultSettings.virusAlpha, s = true), defaultmapsettings.virColors && LM.play ? (style.fillStyle = ogarminimapdrawer.setVirusColor(y), style.strokeStyle = ogarminimapdrawer.setVirusStrokeColor(y)) : (style.fillStyle = this.virusColor, style.strokeStyle = this.virusStroke), style.fill(), s && (style.globalAlpha = value, s = false), style.lineWidth = defaultSettings.virusStrokeSize, defaultmapsettings.virusGlow ? (style.shadowBlur = defaultSettings.virusGlowSize, style.shadowColor =
                                defaultSettings.virusGlowColor) : "yeet", style.stroke(this.createStrokeVirusPath(this.x, this.y, this.size - 2, 6)), defaultmapsettings.showMass && (this.setDrawing(), this.setDrawingScale(), defaultmapsettings.virusGlow ? style.shadowBlur = 0 : "yote",
                                this.setMass(this.size), this.drawMass(style), (window.ExternalScripts && !window.legendmod5.optimizedMass && this.drawMerge(style))), void style.restore();
                        }
                    } else {
                        if (this.isVirus) {
                            //console.log("is jelly");
                            if (defaultmapsettings.transparentViruses) {
                                style.globalAlpha *= defaultSettings.virusAlpha;
                                defaultmapsettings.isAlphaChanged = true;
                            }
                            if (defaultmapsettings.virColors && LM.play) {
                                style.fillStyle = ogarminimapdrawer.setVirusColor(y);
                                style.strokeStyle = ogarminimapdrawer.setVirusStrokeColor(y);
                            } else {
                                style.fillStyle = defaultSettings.virusColor;
                                style.strokeStyle = defaultSettings.virusStrokeColor;
                            }
                            style.fill();
                            if (defaultmapsettings.isAlphaChanged) {
                                style.globalAlpha = defaultSettings.cellsAlpha;
                                defaultmapsettings.isAlphaChanged = false;
                            }
                            style.lineWidth = defaultSettings.virusStrokeSize;
                            if (defaultmapsettings.virusGlow) {
                                style.shadowBlur = defaultSettings.virusGlowSize;
                                style.shadowColor = defaultSettings.virusGlowColor;
                            }
                            style.stroke();
                            if (defaultmapsettings.showMass) {
                                this.setDrawing();
                                this.setDrawingScale();
                                this.setMass(this.size);
                                this.drawMass(style);
                                if (window.ExternalScripts && !window.legendmod5.optimizedMass) {
                                    this.drawMerge(style);
                                }
                            }
                            style.restore();
                            return;
                        }
                    }
                    if (defaultmapsettings.transparentCells) {
                        style.globalAlpha *= defaultSettings.cellsAlpha;
                        s = true;
                    }
                    var color = this.color;
                    if (LM.play) {
                        if (this.isPlayerCell) {
                            if (defaultmapsettings.myCustomColor) {
                                color = ogarcopythelb.color;
                            }
                        } else {
                            if (defaultmapsettings.oppColors && !defaultmapsettings.oppRings) {
                                color = this.oppColor;
                            }
                        }
                    }
                    if (dyinglight1load != "yes" || this.targetNick.includes("The Dying Light")) {
                        style.fillStyle = color;
                        style.fill();
                    }
                    if (s) {
                        style.globalAlpha = value;
                        s = false;
                    }
                    /*if (dyinglight1load != "yes"){
                            style.globalAlpha = 1;
                            s = false;
						}*/
                    var node = null;
                    var node2 = {}; //, node2.src = ogarminimapdrawer.customSkinsMap[this.targetNick]



                    //lylko
                    if (defaultmapsettings.customSkins && LM.showCustomSkins) {
                        node = ogarminimapdrawer.getCustomSkin(this.targetNick, this.color);

                        if (node) {
                            if ((defaultmapsettings.transparentSkins || LM.play && defaultmapsettings.oppColors) && !(this.isPlayerCell && !defaultmapsettings.myTransparentSkin) || this.isPlayerCell && defaultmapsettings.myTransparentSkin) {
                                style.globalAlpha *= defaultSettings.skinsAlpha;
                                s = true;
                            }


                            if (defaultmapsettings.jellyPhisycs) {
                                var lineWidth = Math.max(~~(y / 50), 10);
                                style.save();
                                style.clip();
                                this.maxPointRad && (y = this.maxPointRad);
                                try {
                                    style.drawImage(node, this.x - y - lineWidth, this.y - y - lineWidth, 2 * y + lineWidth * 2, 2 * y + lineWidth * 2);
                                } catch (e) {}
                                style.globalCompositeOperation = 'luminosity';

                                style.lineWidth = lineWidth
                                style.strokeStyle = color;
                                style.stroke();
                                style.globalCompositeOperation = '';
                                style.restore();

                            } else if ( legendmod.gameMode != ":teams"){
                                try {
                                    style.drawImage(node, this.x - y, this.y - y, 2 * y, 2 * y);
                                } catch (e) {}
                            }

                            //special animations
                            if (this.targetNick.includes("The Dying Light")) {
								
                                try {
                                    style.drawImage(cimg5, this.x - 2 * y, this.y - 2 * y, 2 * 2 * y, 2 * 2 * y);
                                } catch (e) {}
                            } else if (this.targetNick.includes("℄🌀Jimboy3100")) {
								//style.drawImage(cimg2, this.x - y * 2, this.y - 2 * y, 2 * 2 * y, 2 * 2 * y);
								
								var today = new Date();
                                try { 
								if (!window.testAnimatCells){
									if (!window.testAnimCell){
									var ab = today.getTime()/1000 
									if (!window.abam){
										window.abam = ab
									}
									if (!window.abah){
										window.abah = today.getHours()
									}	
									ab = ab - window.abam;
									/*var ac;
									if (ab>30) ab = ab - 30;
									if (ab>=15) {
										ac = ab - 15;
										ab = 15 - ac;
										}*/						                                 
									if (today.getHours() == window.abah && ab < 5){
											style.drawImage(cimg5, this.x - (1.5 + 2 * ab) * y , this.y - (1.5 + 2 * ab) * y, (1.5 + 2 * ab) * 2 * y, (1.5 + 2 * ab) * 2 * y);
									}
									else{
										window.testAnimatCells=true;
									}
									}
									}
									else{
										//if (ab<4){
											style.drawImage(cimg2, this.x - 2 * y, this.y - 2 * y, 2 * 2 * y, 2 * 2 * y);												
										//}
									}									
                                } catch (e) {}								

                            }
                        }
                    }
                    if (s) {
                        style.globalAlpha = value;
                        s = false;
                    }


                    if (defaultmapsettings.teammatesInd && !this.isPlayerCell && y <= 800 &&
                        window.teammatenicks && this.targetNick != "" &&
                        (window.teammatenicks.includes(this.targetNick))) {
                        ogarfooddrawer.drawTeammatesInd(style, this.x, this.y, y)
                    }

                    if (defaultmapsettings.noNames && !defaultmapsettings.showMass || canCreateDiscussions) {

                        //                            y <= 200 && (node || ogarminimapdrawer.checkSkinsMap(this.targetNick, this.color)) && ogarfooddrawer.drawTeammatesInd(style, this.x, this.y, y), defaultmapsettings.noNames && !defaultmapsettings.showMass || canCreateDiscussions) {

                        style.restore();
                        return;
                    } else {
                        if (defaultmapsettings.customSkins && LM.showCustomSkins) {
                            node2.src = ogarminimapdrawer.customSkinsMap[this.targetNick];
                            ogarminimapdrawer.customSkinsMap[this.targetNick];
                            if (node2.src) {
                                if (defaultmapsettings.videoSkins) {
                                    if (node2.src.includes(".mp4") || node2.src.includes(".webm") || node2.src.includes(".ogv")) {
                                        checkVideos(node2.src, this.targetNick);
                                        try {
                                            style.drawImage(window.videoSkinPlayer[node2.src], this.x - 0.7 * y, this.y - 0.7 * y, 1.4 * y, 1.4 * y);
                                        } catch (e) {}
                                    }
                                }
                            }
                            if (dyinglight1load == "yes" && node == null && this.targetNick.includes("The Dying Light") == false) {
                                try {
                                    style.drawImage(cimgDyingLight, this.x - y, this.y - y, 2 * y, 2 * y);
                                } catch (e) {}
                            }

                        }
                        var recursive = false;
                        if (!this.isPlayerCell && (recursive = ogarminimapdrawer.setAutoHideCellInfo(y)) && defaultmapsettings.autoHideNames && defaultmapsettings.autoHideMass) {
                            style.restore();
                        } else {
                            this.setDrawing();
                            this.setDrawingScale();
                            style.globalAlpha *= defaultSettings.textAlpha;
                            if (!(defaultmapsettings.noNames || recursive && defaultmapsettings.autoHideNames || this.isPlayerCell && defaultmapsettings.hideMyName || node && defaultmapsettings.hideTeammatesNames)) {
                                if (this.setNick(this.targetNick)) {
                                    this.drawNick(style);
                                }
                            }
                            if (!(!defaultmapsettings.showMass || recursive && defaultmapsettings.autoHideMass || this.isPlayerCell && defaultmapsettings.hideMyMass || defaultmapsettings.hideEnemiesMass && !this.isPlayerCell && !this.isVirus)) {
                                if (this.setMass(this.size)) {

                                    this.drawMass(style);
                                    if (window.ExternalScripts && !window.legendmod5.optimizedMass) {
                                        this.drawMerge(style);
                                    }
                                }
                            }
                            style.restore();
                        }



                    }
                }
            };
        }
        window.legendmod1 = ogarbasicassembly;


        if (null !== localStorage.getItem("ogarioProtocolVersion")) {
			//console.log('ProtocolVersion changed to,' + localStorage.getItem("ogarioProtocolVersion"))
            master.protocolVersion = localStorage.getItem("ogarioProtocolVersion");
        }	
        var LM = {
			'integrity': true,
            'quadtree': null,
            updateQuadtree: function(cells) {
                var w = ogarfooddrawer.canvasWidth / ogarfooddrawer.scale;
                var h = ogarfooddrawer.canvasHeight / ogarfooddrawer.scale;
                var x = (LM.viewX - w / 2);
                var y = (LM.viewY - h / 2);
                this.quadtree = new PointQuadTree(x, y, w, h, 32);
                for (var i = 0; i < cells.length; ++i) {
                    var cell = cells[i];
                    for (var n = 0; n < cell.points.length; ++n) {
                        this.quadtree.insert(cell.points[n]);
                    }
                }
            },
            'ws': null,
            'socket': null,
            'protocolKey': null,
            'clientKey': null,
            'connectionOpened': false,
            'accessTokenSent': false,
            //'clientVersion': 30604,
            'clientVersion': master.clientVersion,
            'protocolVersion': master.protocolVersion,
            //'clientVersionString': '3.6.4',
            'clientVersionString': master.clientVersionString,
            'xsupportprotoversion': master.xsupportprotoversion,
            'time': performance.now(),
            'serverTime': 0,
            'serverTimeDiff': 0,
            'loggedInTime': 0,
            'mapSize': 14142,		
            'mapOffset': 7071, 
            'mapOffsetX': 0,
            'mapOffsetY': 0,
            'mapOffsetFixed': false,
			
            'mapMinX': -7071,
            'mapMinY': -7071,
            'mapMaxX': 7071,
            'mapMaxY': 7071,
            'viewMinX': 0,
            'viewMinY': 0,
            'viewMaxX': 0,
            'viewMaxY': 0,
            'canvasWidth': 0,
            'canvasHeight': 0,
            'canvasScale': 1,
            'indexedCells': {},
            'cells': [],
            'removedCells': [],
            'food': [],
            'viruses': [],
            'playerCells': [],
            'playerCellIDs': [],
            'ghostCells': [],
            'playerX': 0,
            'playerY': 0,
            'playerSize': 0,
            'playerMass': 0,
            'playerMaxMass': 0,
            'playerMinMass': 0,
            'playerScore': 0,
            'playerSplitCells': 0,
            'playerColor': null,
            'playerNick': '',
            'playerPosition': 0,
            'leaderboard': [],
            'biggerSTEDCellsCache': [], //Sonia
            'biggerSTECellsCache': [],
            'biggerCellsCache': [],
            'smallerCellsCache': [],
            'STECellsCache': [],
            'STEDCellsCache': [], //Sonia
            'STE': 0,
            'autoZoom': false,
            'zoomValue': 0.1,
            'viewX': 0,
            'viewY': 0,
            'scale': 1,
            'viewScale': 1,
            'clientX': 0,
            'clientY': 0,
            'cursorX': 0,
            'cursorY': 0,
            'targetX': 0,
            'targetY': 0,
            'targetDistance': 0,
            ////
            "cRadius": 10,
            "cAngle": 4,
            "cAngle1": 0,
            "cAngle2": 0,
            "cAlpha": 1,
            "drawCommander": 0,
            ////
            'battleRoyale': {
                'state': 0,
                'players': 0,
                'startTime': 0,
                'shrinkTime': 0,
                'timeLeft': 0,
                'x': 0,
                'y': 0,
                'radius': 0,
                'targetX': 0,
                'targetY': 0,
                'targetRadius': 0,
                'maxRadius': 11313,
                'rank': [],
                'playerRank': 0,
                'joined': false
            },
            'play': false,
            'pause': false,
            'targeting': false,
            'removePlayerCell': false,
            'showCustomSkins': true,
            'showFood': true,
            'foodIsHidden': false,
            'selectBiggestCell': true,
            'hideSmallBots': false,
            'pressedKeys': {},
            'connect': function(t) {
                console.log('[Legend mod Express] Connecting to game server:', t);
                var i = this;
                setTimeout(function() {
                    window.legendmod3.Socket3connect(t);
                    if (defaultmapsettings.rotateMap) {
                        window.legendmod3.SLGconnect(t);
                    }
                }, 100);
                window.legendmod.vnr = 0; //Sonia3
                window.legendmod.bgpi = 4; //Sonia3
                window.legendmod.lbgpi = 4; //Sonia3
                window.legendmod.vector = [
                    [0, 0],
                    [1, 0],
                    [1, 1],
                    [0, 1]
                ]; //Sonia3
                window.legendmod.setrot = false; //Sonia3
                window.legendmod.delstate = -1; //Sonia3			
                this.closeConnection();
                this.flushCellsData();
                this.protocolKey = null;
                this.clientKey = null;
                this.accessTokenSent = false;
                this.connectionOpened = false;
                this.mapOffsetFixed = false;
                this.leaderboard = [];
                this.ws = t;
				this.integrity = this.ws.indexOf('agar.io')>-1; // 2020 JIMBOY3100 
                if (window.userBots.startedBots) window.connectionBots.send(new Uint8Array([1]).buffer)
                window.userBots.isAlive = false
                window.userBots.macroFeedInterval = null
                this.socket = new WebSocket(t);
                this.socket['binaryType'] = 'arraybuffer';
                this.socket['onopen'] = function() {
                    i['onOpen']();
                };
                this.socket['onmessage'] = function(t) {
                    i['onMessage'](t);
                };
                this.socket['onerror'] = function(t) {
                    i['onError'](t);
                };
                this.socket['onclose'] = function(t) {
                    i['onClose'](t);
                };
                ogarminimapdrawer['getWS'](this.ws);
                ogarminimapdrawer['sendServerJoin']();
                ogarminimapdrawer['sendServerData']();
                ogarminimapdrawer['displayLeaderboard']('');
                legendmod3.displayPartyBots();
                if (window.master && window.master['onConnect']) {
                    window.master['onConnect']();
                }
            },
            'onOpen': function(t) {
                //console.log('[Legend mod Express] Game server socket open');
                this.time = performance.now();
                var e = this.createView(5);
                e.setUint8(0, 254);
                if (!window.gameBots.protocolVersion) window.gameBots.protocolVersion = master.protocolVersion;
                e.setUint32(1, this.protocolVersion, true);
                this.sendMessage(e);
                e = this.createView(5);
                e.setUint8(0, 255);
                if (!window.gameBots.clientVersion) window.gameBots.clientVersion = this.clientVersion
                e.setUint32(1, this.clientVersion, true);
                this.sendMessage(e);
                this.connectionOpened = true;
            },
            'onMessage': function(t) {
                t = new DataView(t['data']);
                if (this.protocolKey) {
                    t = this['shiftMessage'](t, this.protocolKey ^ this.clientVersion);
                }
                this['handleMessage'](t);
            },
            'onError': function(t) {
                console.log('[Legend mod Express] Game server socket error');
                this.flushCellsData();
                if (window.master && window.master['onDisconnect']) {
                    window.master['onDisconnect']();
                }
            },
            'onClose': function(t) {
                console.log('[Legend mod Express] Game server socket close');
                this.flushCellsData();
                if (window.master && window.master['onDisconnect']) {
                    window.master['onDisconnect']();
                }
            },
            'closeConnection': function() {
                if (this.socket) {
                    this.socket['onopen'] = null;
                    this.socket['onmessage'] = null;
                    this.socket['onerror'] = null;
                    this.socket['onclose'] = null;
                    try {
                        this.socket['close']();
                    } catch (ogarcloseconncloser) {}
                    this.socket = null;
                    this.ws = null;
                }
            },
            'isSocketOpen': function() {
                return null !== this.socket && this.socket['readyState'] === this.socket['OPEN'];
            },
            'createView': function(t) {
                return new DataView(new ArrayBuffer(t));
            },
            'sendBuffer': function(t) {
                this.socket['send'](t['buffer']);
            },
            'sendMessage': function(t) {
                //console.log(t);
                //if (this.connectionOpened) {
				if (this.connectionOpened && legendmod.integrity) {	
                    if (!this.clientKey) return;
                    t = this['shiftMessage'](t, this.clientKey);
                    this.clientKey = this.shiftKey(this.clientKey);
                }
                this['sendBuffer'](t);
            },
            'sendAction': function(t) {
                if (this.isSocketOpen()) {
                    var e = this.createView(1);
                    e.setUint8(0, t);
                    this.sendMessage(e);
                }
            },
            'sendSpectate': function() {
                this.sendAction(1);
            },
            'sendFreeSpectate': function() {
                this.sendAction(18);
            },
            'sendEject': function() {
                this.sendPosition();
                this.sendAction(21);
            },
            'sendSplit': function() {
                this.sendPosition();
                this.sendAction(17);

            },
        'sendNick': function (nick) {
        
          var self = this
          this.playerNick = nick;
          
          var sendSpawn = function() {
				
                var token = grecaptcha.getResponse()
				// 2020 jimboy3100
				if (!legendmod.integrity){
					token = '0';
				}
				
				/*
				var token; 
				if (this.integrity){
					token = grecaptcha.getResponse()
				}
				else if (!this.integrity){
					token = 0;
				}
				*/
				// 2020 jimboy3100
                nick = window.unescape(window.encodeURIComponent(self.playerNick));
                var view = self.createView(1+nick.length+1+token.length+1);
                var pos = 1
                for (let length = 0; length < nick.length; length++,pos++) view.setUint8(pos, nick.charCodeAt(length))
                pos++
                for (let length = 0; length < token.length; length++,pos++) view.setUint8(pos, token.charCodeAt(length));
				//
				//console.log(view)
                self.sendMessage(view);
            }
            if (!grecaptcha.onceLoad || grecaptcha.v2mode) {
                //first time need recaptcha v2
                requestCaptchaV3();
                grecaptcha.onceLoad = true;
                //grecaptcha.reset();
                grecaptcha.execute(0, {
                    'action': 'play'
                }).then(function() {
                    sendSpawn();
					grecaptcha.reset();
                });
            } else {
                //next times need recaptcha v3
                //grecaptcha.reset();
                grecaptcha.execute(0, {
                    'action': 'play'
                }).then(function() {
                    sendSpawn();
					grecaptcha.reset();
                });
            }
				setTimeout(function() {					
					if (!window.cookieCaptchaOK){
						legendmod.sendNick2(self.playerNick)
					}
				}, 1800);			
        },	
		'sendTimeOutTokenForBots': function () {
				//window.sendTimeOutTokenBots=false;
				if (document.getElementById('userStatus').innerText == 'Connected' && window.RequestedTokens>1){
				setTimeout(function() {	
					legendmod.sendTimeOutTokenForBots();
					//console.log('sendTimeOutTokenForBots triggered')
					if (!window.sendTimeOutTokenBots){
						//window.RequestedTokens=1000;
						//this code is to inform me when a new loop process starts again
						console.log('[Legend mod Express] bots started again')
						legendmod.sendTokenForBots();	
					}			
				}, 10000 + window.tempol*1000);	
				}
				else{
					//setTimeout(function() {	
					window.sendFirstTimeTokenBots=false
					//}, 100);
				}
		},
		'sendSpawn2': function (temp) {
                var token = temp
				window.botsSpawncodeNum++;
				window.botsSpawncode[window.botsSpawncodeNum]=token;

				if (document.getElementById('userStatus').innerText == 'Connected' && window.RequestedTokens>1){
					window.RequestedTokens--;
					$('#captchatokens').html(parseInt($('#captchatokens').html())+1);
					//setTimeout(function() {
					legendmod.sendTokenForBots();
					//}, 100);
					//window.sendTimeOutTokenBots	= true;			
				}
				window.connectionBots.send(JSON.stringify({                            
                            "message": "botscode",
							"msg": JSON.stringify(token)
                            //"msg": JSON.stringify(window.botsSpawncode[window.botsSpawncodeNum])
                 }));
                //self.sendMessage(view);			
		},
        'sendTokenForBots': function () {	  
          //var self = this
          //this.playerNick = nick;    
	
			window.sendTimeOutTokenBots=false;
            if (!grecaptcha.onceLoad || grecaptcha.v2mode) {
                //first time need recaptcha v2
                requestCaptchaV3();
                grecaptcha.onceLoad = true;
                //grecaptcha.reset();				
                grecaptcha.execute(0, {
                    'action': 'play'
                }).then(function() {
					/*
					window.tempo2 = grecaptcha.getResponse()
					setTimeout(function() {
                    legendmod.sendSpawn2(window.tempo2);
					}, window.tempol*1000);
					*/
					grecaptcha.reset();
                });
            } else {
                //next times need recaptcha v3
				
				grecaptcha.ready(function() {
				legendmod.botscaptcha=true;
                grecaptcha.execute(0, {
                    'action': 'play'
                }).then(function() {
					/*
					window.tempo2 = grecaptcha.getResponse()
					setTimeout(function() {
                    legendmod.sendSpawn2(window.tempo2);
					}, window.tempol*1000);
					*/
                });
			})
            }			
        },		
            'sendNick2': function(t) {
                this.playerNick = t, 
				t = window.unescape(window.encodeURIComponent(t));
                window.Bufferdata = t; //
                var i = this.createView(1 + t.length);
                i.setUint8(0, 0);
                for (var s = 0; s < t.length; s++) i.setUint8(s + 1, t.charCodeAt(s));
                this.sendMessage(i);
            },
			
            'sendPosition': function(cell, target2, specialcommand) {
				var t, e;
                if (this.isSocketOpen() && this.connectionOpened && (this.clientKey || !legendmod.integrity)) {
                    if (specialcommand){
						console.log('hi')
                        //t = window.legendmod.vector[window.legendmod.vnr][0] ? this.translateX(this.cursorX) : this.cursorX; //Sonia3
                        //e=9999;					
					}
					else if (!window.autoPlay) {
                        t = window.legendmod.vector[window.legendmod.vnr][0] ? this.translateX(this.cursorX) : this.cursorX; //Sonia3
                        e = window.legendmod.vector[window.legendmod.vnr][1] ? this.translateY(this.cursorY) : this.cursorY; //Sonia3
                        if (!this.play && this.targeting || this.pause) {
                            t = this.targetX;
                            e = this.targetY;
                        }
                    }
                    //autoplay handling
                    else if (!specialcommand){
                        //if (typeof cell != "undefined") { //when used, autoplay not working as expected
                        if (Object.keys(target2).length == 0) {
                            t = window.legendmod.vector[window.legendmod.vnr][0] ? this.translateX(cell.x) : cell.x; //Sonia3
                            e = window.legendmod.vector[window.legendmod.vnr][1] ? this.translateY(cell.y) : cell.y; //Sonia3
                            // var t = cell.x;
                            //var e = cell.y;
                        } else {
                            t = window.legendmod.vector[window.legendmod.vnr][0] ? this.translateX(target2.x) : target2.x; //Sonia3
                            e = window.legendmod.vector[window.legendmod.vnr][1] ? this.translateY(target2.y) : target2.y; //Sonia3
                            //var t = target2.x;
                            //var e = target2.y;
                        }
                        //}
                    }
                    //

                    var i = this.createView(13);
                    i.setUint8(0, 16);
                    i.setInt32(1, t, true);
                    i.setInt32(5, e, true);
                    i.setUint32(9, this.protocolKey, true);
                    this.sendMessage(i);
                }
				if (window.userBots.startedBots && window.userBots.isAlive){
                window.userBots.mouseX = this.cursorX - window.userBots.offsetX;
                window.userBots.mouseY = this.cursorY - window.userBots.offsetY;	
				window.connectionBots.send(window.buffers.mousePosition(window.userBots.mouseX, window.userBots.mouseY))				
				}

                
            },
            /*            'sendAccessToken': function(t, e, i) {
                            if (!this['accessTokenSent']) {
                                i || (i = 102);
                                for (var s = t.length, o = this.clientVersionString.length, a = [i, 8, 1, 18, s + o + 23, 1, 8, 10, 0x52, s + o + 18, 1, 8, e, 18, o + 8, 8, 5, 18, o], n = 0; n < o; n++) a.push(this.clientVersionString.charCodeAt(n));
                                for (a.push(24, 0, 32, 0, 26, s + 3, 1, 10, s, 1), n = 0; n < s; n++) a.push(t.charCodeAt(n));
                                a = new Uint8Array(a);
                                var r = new DataView(a['buffer']);
                                this.sendMessage(r);
                            }
                        }, */
            "sendAccessToken": function(shapes, options, oW) {
				if(!legendmod.integrity){
					return
				}				
                if (LM["accessTokenSent"]) {
                    return;
                }
                if (!oW) {
                    oW = 102;
                }
                var curr = shapes.length;
                var count = this.clientVersionString.length;
                var data = [oW, 8, 1, 18];
                //this.writeUint32(data, curr + count + 23);
                ogarminimapdrawer.writeUint32(data, curr + count + 23);
                data.push(8, 10, 82);
                ogarminimapdrawer.writeUint32(data, curr + count + 18);
                //this.writeUint32(data, curr + count + 18);
                data.push(8, options, 18, count + 8, 8, 5, 18, count);
                var prev = 0;
                for (; prev < count; prev++) {
                    data.push(this.clientVersionString.charCodeAt(prev));
                }
                data.push(24, 0, 32, 0, 26);
                ogarminimapdrawer.writeUint32(data, curr + 3);
                //this.writeUint32(data, curr + 3);
                data.push(10);
                ogarminimapdrawer.writeUint32(data, curr);
                //this.writeUint32(data, curr);
                prev = 0;
                for (; prev < curr; prev++) {
                    data.push(shapes.charCodeAt(prev));
                }
                data = new Uint8Array(data);
                var raw_basefont = new DataView(data["buffer"]);
                this["sendMessage"](raw_basefont);
            },
            'sendFbToken': function(t) {
                //                console.log("[Legend mod Express] Facebook token: " + t);
                this.sendAccessToken(t, 2);
            },
            'sendGplusToken': function(t) {
                //                console.log("[Legend mod Express] Google Plus token: " + t);
                //this.sendAccessToken(t, 3);
                this.sendAccessToken(t, 4);
            },
            'sendRecaptcha': function(t) {
                var e = this.createView(2 + t.length);
                e.setUint8(0, 86);
                for (var i = 0; i < t.length; i++) e.setUint8(1 + i, t.charCodeAt(i));
                e.setUint8(t.length + 1, 0); 
				this.sendMessage(e);
            },
            'setClientVersion': function(t, e) {

                if (window.disableIntegrity != true) { //
                    this.clientVersion = t;
                    this.clientVersionString = e;
                    console.log('[Legend mod Express] Versions: client:', t, e, "x-proto:", this.xsupportprotoversion, "protocol:", this.protocolVersion, "config:", "v" + window.getLatestconfigVersion, "configId:", window.getLatestID);
                } //
                else { //
                    this.clientVersion = 0;
                    this.clientVersionString = e;
                    console.log('[Legend mod Express] Client version:', t, e); //
                } //
            },
            /*
            			'generateClientKey': function(t, e) {
                            if (!t.length || !e.byteLength) return null;
                            for (var i = null, s = 1540483477, o = t.match(/(ws+:\/\/)([^:]*)(:\d+)/)[2], a = o.length + e.byteLength, n = new Uint8Array(a), r = 0; r < o.length; r++) n[r] = o.charCodeAt(r);
                            n.set(e, o.length);
                            for (var l = new DataView(n['buffer']), h = a - 1, c = 4 + (h - 4 & -4) | 0, u = 255 ^ h, d = 0; h > 3;) i = 0 | Math.imul(l.getInt32(d, true), s), u = (0 | Math.imul(i >>> 24 ^ i, s)) ^ (0 | Math.imul(u, s)), h -= 4, d += 4;
                            switch (h) {
                                case 3:
                                    u = n[c + 2] << 16 ^ u, u = n[c + 1] << 8 ^ u;
                                    break;
                                case 2:
                                    u = n[c + 1] << 8 ^ u;
                                    break;
                                case 1:
                                    break;
                                default:
                                    i = u;
                            }
                            return i != u && (i = 0 | Math.imul(n[c] ^ u, s)), i ^= u = i >>> 13, i = 0 | Math.imul(i, s), i ^= u = i >>> 15, console.log('[Legend mod Express] Generated client key:', i),window.generatedClientKey=i, i;
                        },
                        'shiftKey': function(t) {
                            //if (window.disableIntegrity!=false){ //
                            return t = 0 | Math.imul(t, 1540483477), t = 114296087 ^ (0 | Math.imul(t >>> 24 ^ t, 1540483477)), (t = 0 | Math.imul(t >>> 13 ^ t, 1540483477)) >>> 15 ^ t;
                            //} //
                            //else{ //
                            //return 0; //
                            //} //
                        },
            			*/
            "generateClientKey": function(option, _relatedTarget) {
                if (!option.length || !_relatedTarget.byteLength) {
                    return null;
                }
                var j = null;
                var suggestedValue = 1540483477;
                var constraints = option.match(/(ws+:\/\/)([^:]*)(:\d+)/)[2];
                var framesize = constraints.length + _relatedTarget.byteLength;
                var data = new Uint8Array(framesize);
                var value = 0;
                for (; value < constraints.length; value++) {
                    data[value] = constraints.charCodeAt(value);
                }
                data.set(_relatedTarget, constraints.length);
                var dv = new DataView(data["buffer"]);
                var maxTextureAvailableSpace = framesize - 1;
                var k = (maxTextureAvailableSpace - 4 & -4) + 4 | 0;
                var i = maxTextureAvailableSpace ^ 255;
                var n = 0;
                for (; maxTextureAvailableSpace > 3;) {
                    j = Math.imul(dv['getInt32'](n, !![]), suggestedValue) | 0;
                    i = (Math.imul(j >>> 24 ^ j, suggestedValue) | 0) ^ (Math.imul(i, suggestedValue) | 0);
                    maxTextureAvailableSpace = maxTextureAvailableSpace - 4;
                    n = n + 4;
                }
                switch (maxTextureAvailableSpace) {
                    case 3:
                        i = data[k + 2] << 16 ^ i;
                        i = data[k + 1] << 8 ^ i;
                        break;
                    case 2:
                        i = data[k + 1] << 8 ^ i;
                        break;
                    case 1:
                        break;
                    default:
                        j = i;
                        break;
                }
                if (j != i) {
                    j = Math.imul(data[k] ^ i, suggestedValue) | 0;
                }
                i = j >>> 13;
                j = i ^ j;
                j = Math.imul(j, suggestedValue) | 0;
                i = j >>> 15;
                j = i ^ j;
                //console.log('[Legend mod Express] Generated client key:', j);
                window.generatedClientKey = j;
                return j;

            },
            "shiftKey": function(c) {
                if (window.disableIntegrity != true) {
                    var suggestedValue = 1540483477;
                    c = Math.imul(c, suggestedValue) | 0;
                    c = (Math.imul(c >>> 24 ^ c, suggestedValue) | 0) ^ 114296087;
                    c = Math.imul(c >>> 13 ^ c, suggestedValue) | 0;
                    return c >>> 15 ^ c;
                } else {
                    return 0;
                }
            },
            "shiftMessage": function(t, e, i) {
                if (window.disableIntegrity != true) {
                    if (!i) {
                        var s = 0;
                        for (; s < t.byteLength; s++) {
                            t.setUint8(s, t.getUint8(s) ^ e >>> s % 4 * 8 & 255);
                        }
                    } else {
                        s = 0;
                        for (; s < t.length; s++) {
                            t.writeUInt8(t.readUInt8(s) ^ e >>> s % 4 * 8 & 255, s);
                        }
                    }
                    return t;
                } else {
                    return t;
                }
            },
            /*
            'shiftMessage': function(t, e, i) {
                //if (window.disableIntegrity!=false){ //
                if (i)
                    for (s = 0; s < t.length; s++) t.writeUInt8(t.readUInt8(s) ^ e >>> s % 4 * 8 & 255, s);
                else
                    for (var s = 0; s < t.byteLength; s++) t.setUint8(s, t.getUint8(s) ^ e >>> s % 4 * 8 & 255);
                return t;
                //} //
                //else{ //
                //return t; //
                //} //
            },		*/
            //https://github.com/pierrec/node-lz4/blob/master/lib/binding.js
			'pingTimer': function(){
				if (!this.pingUsed){
					this.pingUsed = 0;
				}
				if (!this.pingArray){
				this.pingArray = [];
				}
				if (this.pingTime){				
				this.ping = performance.now() - this.pingTime
				}
				this.pingTime = performance.now();
				this.pingUsed++;
				this.pingArray.push(this.ping);
				if (this.pingUsed==99){					
					//console.log('standardDeviation - usePopulation', standardDeviation(this.pingArray, true));
					console.log('standardDeviation', this.pingArray.stDev());
					this.pingArray = [];
					this.pingUsed = 0;
				}				
			},
            'decompressMessage': function(message) {
                var buffer = new LMbuffer(message['buffer']);
                var readMessage = new LMbuffer(buffer.readUInt32LE(1));
                return LZ4.decodeBlock(buffer.slice(5), readMessage), readMessage;
            },
            'handleMessage': function(data) {
				//this.pingTimer();
                var i = function() {
                        for (var e = '';;) {
                            var i = data.getUint8(s++);
                            if (0 == i) break;
                            e += String.fromCharCode(i);
                        }
                        return e;
                    },
                    s = 0,
                    opcode = data.getUint8(s++);
                switch (54 == opcode && (opcode = 53), opcode) {




                    case 5:
                        //console.log('[Legend mod Express] opcode: ', data.getUint8(0));
                        window.testobjectsOpcode5 = data;
                        break;
                    case 17:
                        window.testobjectsOpcode17 = data;
                        var x = data.getFloat32(s, true);
                        this.viewX = window.legendmod.vector[window.legendmod.vnr][0] ? this.translateX(x) : x;
                        s += 4;
                        var y = data.getFloat32(s, true);
                        this.viewY = window.legendmod.vector[window.legendmod.vnr][1] ? this.translateY(y) : y;
                        s += 4;
                        this.scale = data.getFloat32(s, true);
                        break;
                    case 18:
                        window.testobjectsOpcode18 = data;
                        if (this.protocolKey) {
                            this.protocolKey = this.shiftKey(this.protocolKey);
                        }
                        this.flushCellsData();
                        break;
                    case 20:
                        this.flushCellsData();
                        break;
                    case 32:
                        window.testobjectsOpcode32 = data;
                        this.playerCellIDs.push(data.getUint32(s, true));
                        if (!this.play) {
                            this.play = true;
                            ogarminimapdrawer.hideMenu();
                            this.playerColor = null;
                            ogarminimapdrawer.onPlayerSpawn();
                            window.userBots.isAlive = true;
                            if (window.userBots.startedBots) window.connectionBots.send(new Uint8Array([5, Number(window.userBots.isAlive)]).buffer);
                        }
                        break;
                    case 50:
                        window.testobjectsOpcode50 = data;
                        this.pieChart = [];
                        var a = data.getUint32(s, true);
                        s += 4; //5,12,19
                        //for (var n = 0; n < a; n++) this.pieChart.push(data.getFloat32(s, true)), s += 4;
						for (var n = 0; n < a; n++) this.pieChart.push(data.getFloat32(s, true)), s += 7;
                        ogarfooddrawer.drawPieChart();
                        break;
                    case 53:
                        window.testobjectsOpcode53 = data;
                        if (this.leaderboard = [], this.playerPosition = 0, 54 == data.getUint8(0)) {
                            data.getUint16(s, true);
                            s += 2;
                        }
                        for (var r = 0; s < data.byteLength;) {
                            var le = '';
                            var h = 0;
                            var c = false;
                            r++;
                            if (2 & (y = data.getUint8(s++))) {
                                le = window.decodeURIComponent(escape(i()));
                            }
							//console.log(y) 4 or 6
							
                            //if (16 & y) {
                                //c = true;
								//console.log('16+y')
								//var temp = data.getUint32(s, true);
								//console.log(temp)
                            //}							
                            if (4 & y) {
                                h = data.getUint32(s, true);
                                s += 4;
                            }
                            if (8 & y) {
                                le = this.playerNick;
                                h = 'isPlayer';
                                this.playerPosition = r
								
								// for bots
								//if (typeof l === "object") { 
								//console.log(l)
								//l=legendmod.playerNick;
								//} 
								//
                            }

                            this.leaderboard.push({
                                'nick': le,
                                'id': h,
                                'isFriend': c
                            });
                        }
                        this.handleLeaderboard();
                        break;
                    case 54:
                        console.log('[Legend mod Express] opcode: ', data.getUint8(0));
                        window.testobjectsOpcode54 = data;
                        break;
                    case 69:
                        window.testobjectsOpcode65 = data;
                        var u = data.getUint16(s, true);
                        s += 2, this.ghostCells = [];
                        var max = 0; //Sonia3
                        var mmax = 0; //Sonia3
                        for (n = 0; n < u; n++) {
                            var d = data.getInt32(s, true);
                            s += 4;
                            var f = data.getInt32(s, true);
                            s += 4;
                            var m = data.getUint32(s, true);
                            s += 5;
                            var g = ~~Math.sqrt(100 * m);
                            this.ghostCells.push({
                                'x': window.legendmod.vector[window.legendmod.vnr][0] ? this.translateX(d) : d, //Sonia3
                                'y': window.legendmod.vector[window.legendmod.vnr][1] ? this.translateY(f) : f, //Sonia3
                                'size': g,
                                'mass': m,
                                'inView': this.isInView(d, f, g)
                            });
                            if (m > mmax) { //Sonia3
                                mmax = m; //Sonia3
                                max = n; //Sonia3
                            } //Sonia3
                        }
                        //window.legendmod.bgpi = this.calculatebgpi(this.ghostCells[max].x, this.ghostCells[max].y); //Sonia3
						if (this.ghostCells[0]){
							window.legendmod.bgpi = this.calculatebgpi(this.ghostCells[0].x, this.ghostCells[0].y); //Sonia3
						}
						else{
							window.legendmod.bgpi=4;
						}
                        break;
                    case 85:
                        window.testobjectsOpcode85 = data;
                        console.log('[Legend mod Express] Captcha requested');
                        if (window.master && window.master.recaptchaRequested) {
                            if (window.smartbotslimited && legendmod5.autoResp) { //
                                core.connect(legendmod.ws);
                                setTimeout(function() {
                                    legendmod3.autoResp();
                                }, 2000);
                            } else {
                                window.master.recaptchaRequested();
                            }
                        }
                        break;
                    case 102:
                        if (data.byteLength < 20) {
                            //this["loggedIn"] = ![];
                            //if (window["logout"]) {
                            //window["logout"]();
                            //}
                        }
                        if (data.buffer.byteLength > 1000) {
                            window.testobjects = data;
                            var sampleBytes = new Uint8Array(window.testobjects.buffer);
                            var enc = new TextDecoder();
                            window.testobjects2 = enc.decode(sampleBytes);
							try{
							var temp = window.testobjects2.split('').pop().split('R')[0].replace('', "");
							if (temp && temp.includes("Uskin_custom")){
								//window.UserVanillaSkin = EnvConfig.custom_skins_url + temp.substring(1).charAt(0).toUpperCase() + temp.substring(1).slice(1) + '.png'
								window.UserVanillaSkin = EnvConfig.custom_skins_url + temp.substring(1) + '.png';
							}
							else if(temp){
							temp = temp.replace('skin_', "").replace(/\W+/g, "")
							window.UserVanillaSkin = temp;
							//window.UserVanillaSkin = "https://configs-web.agario.miniclippt.com/live/" + window.agarversion + temp.charAt(0).toUpperCase() + temp.slice(1) + '.png'
							}	
                            window.agarioUID = window.testobjects2.split('$')[1].substr(0, 36);							
                            window.agarioID = window.testobjects2.split('$')[1].split('')[1].split('')[0].replace(/\s/g, "");
							window.agarioLEVEL = window.testobjects2.split('$')[1].split("(")[0].slice(-1).charCodeAt();
							setLevelProgressBar();
							legendmod3.findOwnedVanillaSkin();
							if (!window.callEveryFullHourCoinDig){
							window.callEveryFullHourCoinDig=true;
							callEveryFullHourCoinDigger();							
							}
							}
							catch (error){					
							}
                            window.googlePic = "https" + window.testobjects2.split('https')[1].split('H')[0] + "H";

                            if (window.agarioUID != undefined) {
                                localStorage.setItem("agarioUID", window.agarioUID);
                                localStorage.setItem("agarioID", window.agarioID);
                            } else {
                                window.agarioUID = localStorage.getItem("agarioUID");
                                window.agarioID = localStorage.getItem("agarioID");
                            }
							if (window.agarioUID && UIDcontroller){
								UIDfunction();
							}
							if (window.testobjects2.split('"�')[1]){
							window.agarioEncodedUID = window.testobjects2.split('"�')[1].split('=')[0]+"%3D";
							}
                        }



                        window.ret = new Node(data, s);

                        var key_or_value = window.ret.readFlag();
                        if (key_or_value == 1) {
                            window.ret.setContentType();
                        }
                        key_or_value = window.ret.readFlag();
                        if (key_or_value == 2) {
                            window.ret.setUncompressedSize();
                        }
                        key_or_value = window.ret.readFlag();
                        if (key_or_value == 1) {
                            var obj = window.ret.readUint32();
                            var previousState = window.ret.readFlag();
                            var artistTrack = window.ret.readUint32();
                            switch (obj) {
                                case 11:
                                    //console.log("[Legend mod Express] 102 Login response", window.ret.view.byteLength, window.ret.contentType, window.ret.uncompressedSize, obj, previousState, artistTrack);
                                    break;
                                case 62:
                                    //console.log("[Legend mod Express] 102 Game over");
                                    LegendModDeath();
                                    //$('#pause-hud').text("PAUSE!");
                                    break;
                                default:
                                    console.log("[Legend mod Express] 102 Unknown", obj, previousState);
                                    if (obj == 20 && previousState == 20) {
                                        toastr["error"]('<b>[SERVER]:</b> You have been disconnected because your User ID logged in from another place');
                                    }
                            }
                        }


                        case 103:
                            window.testobjectsOpcode103 = data;
                            LM["accessTokenSent"] = !![];
                            break;
                        case 104:
                            console.log('[Legend mod Express] Logout forced');
                            logout();
                            window.testobjectsOpcode104 = data;
                            break;
                        case 112:
                            console.log('[Legend mod Express] opcode: ', data.getUint8(0));
                            window.testobjectsOpcode112 = data;
                            break;
                        case 114:
                            console.log('[Legend mod Express] opcode: ', data.getUint8(0));
                            window.testobjectsOpcode114 = data;
                            break;
                        case 160:
                            console.log('[Legend mod Express] opcode: ', data.getUint8(0));
                            window.testobjectsOpcode160 = data;
                            break;							
                        case 161:
                            //console.log('[Legend mod Express] opcode: ', data.getUint8(0));
                            window.testobjectsOpcode161 = data;
                            break;
                        case 128:
                            console.log('[Legend mod Express] opcode: ', data.getUint8(0));
                            console.log('[Legend mod Express] client outdated');
                            window.testobjectsOpcode128 = data;
                            break;
                        case 176:
                            window.testobjectsOpcode176 = data;
                            this.battleRoyale.startTime = data.getUint32(s, true);
                            break;
                        case 177:
                            window.testobjectsOpcode177 = data;
                            this.battleRoyale.joined = true;
                            break;
                        case 178:
                            window.testobjectsOpcode178 = data;
                            this.battleRoyale.players = data.getUint16(s, true);
                                //$('#btl-players-count').text(this.battleRoyale.players),
                                s += 2;
                            var y = data.getUint16(s, true);
                            s += 2,
                                y || (this.battleRoyale.state = 0, this.battleRoyale.joined = false),
                                3 & y && (this.battleRoyale.state = data.getUint8(s++),
                                    this.battleRoyale.x = data.getInt32(s, true),
                                    s += 4,
                                    this.battleRoyale.y = data.getInt32(s, true),
                                    s += 4,
                                    this.battleRoyale.radius = data.getUint32(s, true),
                                    s += 4,
                                    this.battleRoyale.shrinkTime = 1000 * data.getUint32(s, true),
                                    s += 4,
                                    this.battleRoyale.shrinkTime &&
                                    (this.battleRoyale.timeLeft = ~~((this.battleRoyale.shrinkTime - performance.now() + this.serverTimeDiff) / 1000),
                                        this.battleRoyale.timeLeft < 0 && (this.battleRoyale.timeLeft = 0))),
                                2 & y && (this.battleRoyale.targetX = data.getInt32(s, true),
                                    s += 4,
                                    this.battleRoyale.targetY = data.getInt32(s, true),
                                    s += 4,
                                    this.battleRoyale.targetRadius = data.getUint32(s, true));
                            this.handleLeaderboard();	
							break;													
                        case 179:
                            window.testobjectsOpcode179 = data;
                            y = data.getUint8(s);
                            window.decodeURIComponent(escape(i()));
                            y || window.decodeURIComponent(escape(i()));
                            break;
                        case 180:
                            window.testobjectsOpcode181 = data;
                            this.battleRoyale.joined = false;
                            this.battleRoyale.rank = [];
                            this.battleRoyale.playerRank = data.getUint32(s, true);
                            s += 8;
                            var ogario1PlayerProfiles = data.getUint16(s, true);
                            s += 2;
                            for (n = 0; n < ogario1PlayerProfiles; n++) {
                                var ogarcopythelb = window.decodeURIComponent(escape(i()));
                                v = data.getUint32(s, true);
                                s += 4;
								this.battleRoyale.rank.push({
                                    //'place': defaultmapsettings,
									'place': v,
                                    'name': ogarcopythelb
                                });
                            }
							var temp ='<b>[SERVER]:</b> <font color="yellow"><b>Battle Royal Ranks:</b></font>';	
							for (var i=0;i< legendmod.battleRoyale.rank.length ; i++){
								temp+= '<br>' + legendmod.battleRoyale.rank[i].place + ". "+ legendmod.battleRoyale.rank[i].name;
							}
							temp+='<br>' + 'Your rank: <font color="yellow"><b>' + legendmod.battleRoyale.playerRank + '</b></font>';				
							toastr["info"](temp);
                            break;
                        case 226:
                            window.testobjectsOpcode226 = data;						
                            var extraOptions = data.getUint16(1, !![]);
                            data = this["createView"](3);
                            data.setUint8(0, 227);
                            data.setUint16(1, extraOptions);
                            this["sendMessage"](data);
                            break;
                        case 241:
                            window.testobjectsOpcode241 = data;
                            this.protocolKey = data.getUint32(s, true);
                            //window.testobjectsOpcode241.getUint32(1, true);
                            //console.log('[Legend mod Express] Received protocol key:', this.protocolKey);
                            window.generatedProtocolKey = this.protocolKey;
                            var irenderfromagario = new Uint8Array(data['buffer'], s += 4);
                            this.clientKey = this['generateClientKey'](this.ws, irenderfromagario);
                            //legendmod.generateClientKey("wss://live-arena-19y1u3v.agar.io:443",new Uint8Array(window.testobjectsOpcode241['buffer'], 5))
                            if (window.master && window.master.login) {
                                window.master.login();
                            }
                            break;
                        case 242:
                            window.testobjectsOpcode242 = data;
                            this.serverTime = 1000 * data.getUint32(s, true);
                            this.serverTimeDiff = performance.now() - this.serverTime;
                            break;
                        case 255:
                            window.testobjectsOpcode255 = data;
                            this['handleSubmessage'](data);
                            break;
							
						//2020 jimboy3100 specific private servers
						case 16:
							this.updateCells(new LMbuffer(data['buffer']), s);
							//this.countPps()
						break;	
						case 64:
							var message = new LMbuffer(data['buffer'])
							this.viewMinX = message.readDoubleLE(s);
							s += 8;
							this.viewMinY = message.readDoubleLE(s);
							s += 8;
							this.viewMaxX = message.readDoubleLE(s);
							s += 8;
							this.viewMaxY = message.readDoubleLE(s);
							this.setMapOffset(this.viewMinX, this.viewMinY, this.viewMaxX, this.viewMaxY);
							
							if(~~(this.viewMaxX - this.viewMinX) === LM.mapSize && ~~(this.viewMaxY - this.viewMinY) === LM.mapSize){
								window.userBots.offsetX = (this.viewMinX + this.viewMaxX) / 2
								window.userBots.offsetY = (this.viewMinY + this.viewMaxY) / 2
							}
						break;	
						//2020 jimboy3100
						
                        default:
                            console.log('[Legend mod Express] Unknown opcode:', data.getUint8(0));
                }
            },
            'handleSubmessage': function(message) {
                var e = 0;
                switch ((message = this['decompressMessage'](message)).readUInt8(e++)) {
                    case 16:
                        this.updateCells(message, e);
                        break;
                    case 64:
                        this.viewMinX = message.readDoubleLE(e);
                        e += 8;
                        this.viewMinY = message.readDoubleLE(e);
                        e += 8;
                        this.viewMaxX = message.readDoubleLE(e);
                        e += 8;
                        this.viewMaxY = message.readDoubleLE(e);
                        this.setMapOffset(this.viewMinX, this.viewMinY, this.viewMaxX, this.viewMaxY);

                        if (~~(this.viewMaxX - this.viewMinX) === LM.mapSize && ~~(this.viewMaxY - this.viewMinY) === LM.mapSize) {
                            window.userBots.offsetX = (this.viewMinX + this.viewMaxX) / 2;
                            window.userBots.offsetY = (this.viewMinY + this.viewMaxY) / 2;
                        }
                        break;
                    default:
                        console.log('[Legend mod Express] Unknown sub opcode:', message.readUInt8(0));
                }
            },
            'handleLeaderboard': function() {
                /*                for (var t = '', e = '', i = 0; i < this.leaderboard.length && window.leaderboardlimit != i; i++) {
                                    var s = '<span>';
                                    'isPlayer' === this.leaderboard[i].id ? s = '<span class=\"me\">' : ogarcopythelb.clanTag.length && 0 == this.leaderboard[i].nick.indexOf(ogarcopythelb.clanTag) && (s = '<span class=\"teammate\">'), t += s + (i + 1) + '. ' + ogarminimapdrawer.escapeHTML(this.leaderboard[i].nick) + '</span>';
                                } */							
                window.teammatenicks = [];
                window.teammatelegendmodnicks = [];
                if (legendmod3.top5) {
                    for (i = 0; i < legendmod3.top5.length; i++) {
                        window.teammatelegendmodnicks.push(legendmod3.top5[i].nick);
                    }
                }
                window.teammatenicks = window.teammatelegendmodnicks;
                if (window.agartoolteammatenicks != undefined) {
                    window.teammatenicks = window.teammatenicks.concat(window.agartoolteammatenicks);
                }
                for (var t = '', e = '', i = 0; i < this.leaderboard.length && window.leaderboardlimit != i; i++) {
                    var s = '<span>';
                    'isPlayer' === this.leaderboard[i].id ? s = '<span class=\"me\">' : ogarcopythelb.clanTag.length && 0 != window.teammatenicks.includes(this.leaderboard[i].nick) && (s = '<span class=\"teammate\">'), t += s + (i + 1) + '. ' + ogarminimapdrawer.escapeHTML(this.leaderboard[i].nick) + '</span>';
                }
                if (this.playerPosition > window.leaderboardlimit && (t += '<span class=\"me\">' + this.playerPosition + '. ' + ogarminimapdrawer.escapeHTML(this.playerNick) + '</span>'), defaultmapsettings['showLbData']);
                if (legendmod.gameMode!=":battleroyale"){
					t += '<span class="me">' + Premadeletter130 + ': ' + this.leaderboard.length + '</span>';
				}
				else if (legendmod.gameMode==":battleroyale"){
					var t = '<span>';
					if (legendmod.battleRoyale.shrinkTime-Date.now()/1000>0){
					t += '<span>Shrink time: ' + legendmod.battleRoyale.timeLeft + '</span>';
					}
					t += '<span class="me">' + 'Players: ' + legendmod.battleRoyale.players + '</span>';				
					t += '</span>';
				}					
                for (var o = 0; o < this.ghostCells.length && o != i; o++) {
                    //
                    var w = this.ghostCells[o].x;
                    var u = this.ghostCells[o].y;
                    /*
					w = window.legendmod.vector[window.legendmod.vnr][0] ? legendmod.translateX(this.ghostCells[o].x) : this.ghostCells[o].x; 
                    u = window.legendmod.vector[window.legendmod.vnr][1] ? legendmod.translateY(this.ghostCells[o].y) : this.ghostCells[o].y; 
					*/
                    //
                    e += '<span class=\"lb-data\" id= "' + 'leaderboardtargeting' + o + '" style="pointer-events: auto;" onclick="window.legendmod.targetingLead(' + o + ');">';
                    e += '<span class=\"top5-mass-color\">[' + ogarminimapdrawer.shortMassFormat(this.ghostCells[o].mass) + ']</span>';
                    //e += '<span class=\"hud-main-color\">[' + ogarminimapdrawer.calculateMapSector(this.ghostCells[o].x, this.ghostCells[o].y) + ']</span>', e += '</span>';
                    e += '<span class=\"hud-main-color\">[' + ogarminimapdrawer.calculateMapSector(w+legendmod.mapOffsetX, u+legendmod.mapOffsetY) + ']</span>', e += '</span>';
                }
                ogarminimapdrawer['displayLeaderboard'](t, e);
                //ogarminimapdrawer['displayPartyBots']();
                ///////////////// establish core.registerSkin
                if (window.vanillaskins == true && window.customskinsname != null && window.customskinsurl != null && ogarminimapdrawer.customSkinsMap[window.customskinsname] == null) {
                    for (i = 0; i <= this.leaderboard.length - 1; i++) {
                        if (this.leaderboard[i].nick == window.customskinsname) {
                            ogarminimapdrawer.customSkinsMap[window.customskinsname] = window.customskinsurl;
                            ogarminimapdrawer.loadSkin(ogarminimapdrawer.customSkinsCache, window.customskinsurl, window.customskinanimated);
                            window.customskinsname = null;
                            window.customskinsurl = null;
                            window.customskinanimated = null;
                        }
                    }
                }
                //if ($("#ao2t-capture").length && $("#ao2t-capture").hasClass("connected")) { //if existed and connected and visible
                for (var e = 0; e < legendmod.ghostCells.length; e++) {
                    window.predictedGhostCells[e] = {};
                    window.predictedGhostCells[e] = legendmod.ghostCells[e];
                    if (legendmod.leaderboard[e]) {
                        window.predictedGhostCells[e].id = legendmod.leaderboard[e].id;
                        window.predictedGhostCells[e].nick = legendmod.leaderboard[e].nick;
                        window.predictedGhostCells[e].isFriend = legendmod.leaderboard[e].isFriend;
                    }
                }

                //}				
            },
            'targetingLead': function(o) {
                window.targetingLeadX = legendmod.ghostCells[o].x;
                window.targetingLeadY = legendmod.ghostCells[o].y;
                legendmod.drawCommander2 = true;
            },
            'flushCellsData': function() {
                this.indexedCells = {},
                    this.cells = [];
                this.playerCells = [];
                this.playerCellIDs = [];
                this.ghostCells = [];
                this.food = [];
                this.viruses = [];
            },
            'setMapOffset': function(left, top, right, bottom) {
                //if (right - left > 14000 && bottom - top > 14000) {
				if (!legendmod.integrity || (right - left) > 14000 && (bottom - top) > 14000) { //2020 jimboy3100
                    this.mapOffsetX = this.mapOffset - right;
                    this.mapOffsetY = this.mapOffset - bottom;
                    this.mapMinX = ~~(-this.mapOffset - this.mapOffsetX);
                    this.mapMinY = ~~(-this.mapOffset - this.mapOffsetY);
                    this.mapMaxX = ~~(this.mapOffset - this.mapOffsetX);
                    this.mapMaxY = ~~(this.mapOffset - this.mapOffsetY);
                    this.mapMidX = (this.mapMaxX + this.mapMinX) / 2; //Sonia3 -> this.mapMidX = -legendmod.mapOffsetX
                    this.mapMidY = (this.mapMaxY + this.mapMinY) / 2; //Sonia3 -> this.mapMidY = -legendmod.mapOffsetY				
                    this.mapOffsetFixed || (this.viewX = (right + left) / 2, this.viewY = (bottom + top) / 2);
                    this.mapOffsetFixed = true;
                    //console.log('[Legend mod Express] Map offset fixed: (', this.mapOffsetX, ',', this.mapOffsetY, ')');
                }
            },
            'isInView': function(t, e, size) {
                var s = this.canvasWidth / 2 / this.scale,
                    o = this.canvasHeight / 2 / this.scale;
                //console.log("t:" + t + " e:" + e + " i:" + i  + " result:" + !(t + i < this.viewX - s || e + i < this.viewY - o || t - i > this.viewX + s || e - i > this.viewY + o));
                return !(t + size < this.viewX - s || e + size < this.viewY - o || t - size > this.viewX + s || e - size > this.viewY + o);
            },
            'vanillaskins': function(y, g) {
                if (g != null && ogarminimapdrawer.customSkinsMap[y] == undefined) {
                    if (LM.gameMode == ":party") {
                        y = y + "#000000";
                    }
                    //console.log(g)					
                    if (window.FreskinsMap && window.FreskinsMap.includes(y)) {
                        for (var player = 0; player < window.FreeSkins.length; player++) {
                            if (y == window.FreeSkins[player].id) {
                                core.registerSkin(y, null, "https://configs-web.agario.miniclippt.com/live/" + window.agarversion + window.FreeSkins[player].image, null);
                                //console.log("https://configs-web.agario.miniclippt.com/live/" + window.agarversion + window.FreeSkins[player].image)
                            }
                        }
                    } else if (g.includes && g.includes("%custom_") && !legendflags.includes(LowerCase(y))) {
                        var g1 = g.replace('%custom_', 'skin_custom_')
                        core.registerSkin(y, null, EnvConfig.custom_skins_url + g1 + ".png", null);
                        //core.registerSkin(y, null, "https://configs.agario.miniclippt.com/live/custom_skins/" + g1 + ".png", null);
                    } else if (g.includes && g.includes("_level_") && !legendflags.includes(LowerCase(y))) {
                        var g1 = g.replace('%', '')
                        g1 = g1.replace('_level_1', '').replace('_level_2', '').replace('_level_3', '');
                        g1 = g1.charAt(0).toUpperCase() + g1.slice(1);
                        g1 = makeUpperCaseAfterUnderline(g1);
                        core.registerSkin(y, null, "https://configs-web.agario.miniclippt.com/live/" + window.agarversion + g1 + ".png", null);
                        window.customskinanimated = true;
                    } else if (window.vanillaskins == true && window.LMAgarGameConfiguration != undefined) {
                        for (var player = 0; player < window.EquippableSkins.length; player++) {
                            if (window.EquippableSkins[player].productId == "skin_" + g.replace('%', '') && window.EquippableSkins[player].image != "uses_spine") {
                                //console.log("Player: " + y + " Color: " + EquippableSkins[player].cellColor + " Image: " + EquippableSkins[player].image + " SkinId: " + EquippableSkins[player].gameplayId + " Skins type: " + EquippableSkins[player].skinType);                                
                                if (legendflags.includes(LowerCase(y))) {
                                    //console.log("[Legend mod Express] " + LowerCase(y) + " skin found. Skin registered");
                                    core.registerSkin(y, null, "https://legendmod.ml/agario/live/flags/" + LowerCase(y) + ".png", null);
                                } else {
                                    window.lastusednameforskin = y;
                                    //core.registerSkin(y, null, "https://configs-web.agario.miniclippt.com/live/" + window.agarversion + window.EquippableSkins[player].image, null);
                                    ogarminimapdrawer.customSkinsMap[y] = "https://configs-web.agario.miniclippt.com/live/" + window.agarversion + window.EquippableSkins[player].image;
                                    ogarminimapdrawer.loadSkin(ogarminimapdrawer.customSkinsCache, "https://configs-web.agario.miniclippt.com/live/" + window.agarversion + window.EquippableSkins[player].image);
                                }
                            }
                        }
                    }
                }
            },
            //Sonia3 Adding three below functions
            'translateX': function(x) {
                return this.mapMaxX - (x - this.mapMinX);
            },
            'translateY': function(x) {
                return this.mapMaxY - (x - this.mapMinY);
            },
            'untranslateX': function(x) {
                return 0 - (x - this.mapMaxX + this.mapMinX);
            },
            'untranslateY': function(x) {
                return 0 - (x - this.mapMaxY + this.mapMinY);
            },			
            'calculatebgpi': function(x, y) {
                var ofs = 150;
				//var ofs = 1;
                var calc = (x < this.mapMidX + ofs && x > this.mapMidX - ofs) || (y < this.mapMidY + ofs && y > this.mapMidY - ofs) ? 4 : x >= this.mapMidX && y < this.mapMidY ? 0 : x < this.mapMidX && y < this.mapMidY ? 1 : x < this.mapMidX && y >= this.mapMidY ? 2 : 3;
                //var calc = (x < this.mapOffsetX + ofs && x > this.mapOffsetX - ofs) || (y < this.mapOffsetY + ofs && y > this.mapOffsetY - ofs) ? 4 : x >= this.mapOffsetX && y < this.mapOffsetY ? 0 : x < this.mapOffsetX && y < this.mapOffsetY ? 1 : x < this.mapOffsetX && y >= this.mapOffsetY ? 2 : 3;
                if ((window.legendmod.lbgpi == 4 || calc == 4 || window.legendmod.lbgpi == calc) && window.legendmod.delstate < 0) {
                    window.legendmod.lbgpi = calc;
                    return calc;
                } else if (window.legendmod.lbgpi != calc) {
                    window.legendmod.delstate = 0;
                    window.legendmod.lbgpi = calc;
                    return 4;
                } else {
                    window.legendmod.lbgpi = calc;
                    return 4;
                }
            },
            //https://github.com/NuclearC/agar.io-protocol
            'updateCells': function(t, i) {
                var s = function() {
                    for (var e = '';;) {
                        var s = t.readUInt8(i++);
                        if (0 == s) break;
                        e += String.fromCharCode(s);
                    }
                    return e;
                };
                this.time = performance.now(), this.removePlayerCell = false;
                var o = t.readUInt16LE(i);
                i += 2;
                for (var a = 0; a < o; a++) {
                    var n = this.indexedCells[t.readUInt32LE(i)],
                        r = this.indexedCells[t.readUInt32LE(i + 4)];
                    if (i += 8, n && r) {
                        r.targetX = n.x;
                        r.targetY = n.y;
                        r.targetSize = r.size;
                        r.time = this.time;
                        r.removeCell();
                    }
                }
                //
                //legendmod3.sendJimboy3100info();
                fakePlayers();
                //					
                for (a = 0;;) {
                    extendedFlags = false;
                    var l = t.readUInt32LE(i);
                    if (i += 4, 0 == l) break;
                    var h = t.readInt32LE(i);
                    if (window.legendmod.vector[window.legendmod.vnr][0]) h = this.translateX(h); //Sonia3
                    i += 4;
                    var c = t.readInt32LE(i);
                    if (window.legendmod.vector[window.legendmod.vnr][1]) c = this.translateY(c); //Sonia3
                    i += 4;
                    var u = t.readUInt16LE(i);
                    i += 2;
                    var d = t.readUInt8(i++),
                        f = 0;
                    128 & d && (f = t.readUInt8(i++), extendedFlags = true);
                    //128 & d && (f = t.readUInt8(i++));	
                    var m = null,
                        g = null,
                        y = '',
                        isAgitated = false,
                        isOwnEjected = false,
                        isOtherEjected = false;
                    if (2 & d) { //offset
                        var ogario1PlayerProfiles = t.readUInt8(i++),
                            ogarcopythelb = t.readUInt8(i++),
                            irenderfromagario = t.readUInt8(i++);
                        m = this.rgb2Hex(~~(0.9 * ogario1PlayerProfiles), ~~(0.9 * ogarcopythelb), ~~(0.9 * irenderfromagario));
                    }

                    //4 & d && (g = s()),
                    //8 & d && (y = window.decodeURIComponent(escape(s())));
                    if (4 & d) {
                        g = s();
                        //						console.log('skin '+g);

                    }
                    if (8 & d) {
                        y = window.decodeURIComponent(escape(s()));
                        if (legendmod && legendmod.gameMode && legendmod.gameMode != ":teams") {
                            this.vanillaskins(y, g);
                        }
                    }
                    //Jimboy's
                    if (16 & d) {
                        //isAgitated = true;
                    }
                    if (32 & d) {
                        //isOwnEjected = true;
                    }
                    if (64 & d) {
                        //isOtherEjected = true;
                    }
                    //
                    //8 & d && (y = window.decodeURIComponent(escape(s())));
                    var LM = 1 & d,
                        ogarioset1final = 1 & f,
                        ogariocellssetts = null;
                    this.indexedCells.hasOwnProperty(l) ? (ogariocellssetts = this.indexedCells[l],
                            m && (ogariocellssetts.color = m)) :
                        ((ogariocellssetts = new ogarbasicassembly(l, h, c, u, m, ogarioset1final, LM, false, defaultmapsettings.shortMass, defaultmapsettings.virMassShots)).time = this.time,
                            ogarioset1final ? this.food.push(ogariocellssetts) :
                            (LM && defaultmapsettings.virusesRange && this.viruses.push(ogariocellssetts),
                                this.cells.push(ogariocellssetts),
                                -1 != this.playerCellIDs.indexOf(l) && -1 == this.playerCells.indexOf(ogariocellssetts) && (ogariocellssetts.isPlayerCell = true,
                                    this.playerColor = m, this.playerCells.push(ogariocellssetts))),
                            this.indexedCells[l] = ogariocellssetts),
                        ogariocellssetts.isPlayerCell && (y = this.playerNick),
                        y && (ogariocellssetts.targetNick = y),
                        ogariocellssetts.targetX = h,
                        ogariocellssetts.targetY = c,
                        ogariocellssetts.targetSize = u,
                        //                        ogariocellssetts.targetSize = u,
                        ogariocellssetts.isFood = ogarioset1final,
                        ogariocellssetts.isVirus = LM,
                        //
                        ogariocellssetts.isOwnEjected = isOwnEjected,
                        ogariocellssetts.isOtherEjected = isOtherEjected,
                        //
                        g && (ogariocellssetts.skin = g),
                        4 & f && (t.readUInt32LE(i), i += 4);
                }
                for (o = t.readUInt16LE(i), i += 2, a = 0; a < o; a++) {
                    l = t.readUInt32LE(i);
                    i += 4, (ogariocellssetts = this.indexedCells[l]) && ogariocellssetts.removeCell();
                }
                //Sonia7
                if (this.removePlayerCell && !this.playerCells.length) {
                    this.play = false;
                    ogarminimapdrawer.onPlayerDeath();
                    ogarminimapdrawer.showMenu(300)
                    window.userBots.isAlive = false
                    if (window.userBots.startedBots) window.connectionBots.send(new Uint8Array([5, Number(window.userBots.isAlive)]).buffer)
                }
                //window.counterCell=0;
                if (window.autoPlay && legendmod.play) {
                    calcTarget();
                }
                //if (window.historystate && legendmod.play) {historystate();}
            },
            'color2Hex': function(t) {
                var e = t.toString(16);
                return 1 == e.length ? '0' + e : e;
            },
            'rgb2Hex': function(t, e, i) {
                return '#' + this.color2Hex(t) + this.color2Hex(e) + this.color2Hex(i);
            },
            'sortCells': function() {
                this.cells.sort(function(t, e) {
                    return t.size == e.size ? t.id - e.id : t.size - e.size;
                });
            },
            'calculatePlayerMassAndPosition': function() {
                for (var t = 0, e = 0, i = 0, s = 0, o = this.playerCells.length, a = 0; a < o; a++) {
                    var n = this.playerCells[a];
                    t += n.size;
                    e += n.targetSize * n.targetSize;
                    i += n.x / o;
                    s += n.y / o;
                }
                this.viewX = i;
                this.viewY = s;
                this.playerSize = t;
                this.playerMass = ~~(e / 100);
                this.recalculatePlayerMass();
            },
            'recalculatePlayerMass': function() {
                if (this.playerScore = Math.max(this.playerScore, this.playerMass),
                    defaultmapsettings.virColors || defaultmapsettings.splitRange || defaultmapsettings.oppColors || defaultmapsettings.oppRings || defaultmapsettings.showStatsSTE) {
                    var t = this.playerCells;
                    var e = t.length;
                    t.sort(function(t, e) {
                        return t.size == e.size ? t.id - e.id : t.size - e.size;
                    });
                    this.playerMinMass = ~~(t[0].size * t[0].size / 100);
                    this.playerMaxMass = ~~(t[e - 1].size * t[e - 1].size / 100);
                    this.playerSplitCells = e;
                }
                if (true) {
                    var i = this.selectBiggestCell ? this.playerMaxMass : this.playerMinMass;
                    // this.STE = i > 35 ? ~~(i * (i < 1000 ? 0.35 : 0.38)) : null; //Sonia2
                    this.STE = Math.floor(i * 0.375); //Sonia2
                    this.MTE = Math.floor(i * 0.75); //Sonia2
                    this.BMTE = Math.ceil(i * 1.33); //Sonia2
                    this.BSTE = Math.ceil(i * 2.66); //Sonia2
                    this.TTE = Math.ceil(i / 6); //Sonia2
                    this.PTE = Math.floor(i * 0.66); //Sonia2
                }
            },
            'compareCells': function() {
                if (this.play && (defaultmapsettings.oppColors || defaultmapsettings.oppRings || defaultmapsettings.splitRange)) {
                    if (defaultmapsettings.oppRings || defaultmapsettings.splitRange) {
                        this.biggerSTECellsCache = [];
                        this.biggerCellsCache = [];
                        this.smallerCellsCache = [];
                        this.STECellsCache = [];
                        this.biggerSTEDCellsCache = []; //Sonia
                        this.STEDCellsCache = []; //Sonia
                    }
                    var t = 0;
                    for (; t < this.cells.length; t++) {
                        var e = this.cells[t];
                        if (!e.isVirus) {
                            //console.log(i); i for food is 13
                            var i = ~~(e.size * e.size / 100);
                            if (i != 13) {
                                var s = this.selectBiggestCell ? this.playerMaxMass : this.playerMinMass;
                                var o = i / s;
                                var a = s < 1000 ? 0.35 : 0.38;
                                if (defaultmapsettings.oppColors && !defaultmapsettings.oppRings) {

                                    e.oppColor = this.setCellOppColor(e.isPlayerCell, o, a);

                                }
                                if (!(e.isPlayerCell || !defaultmapsettings.splitRange && !defaultmapsettings.oppRings)) {
                                    this.cacheCells(e.x, e.y, e.size, o, a);
                                }
                            }
                        }
                    }
                }
            },
            /*'cacheCells': function(t, e, i, s, o) {
                return s >= 2.5 ? void this.biggerSTECellsCache.push({
                    'x': t,
                    'y': e,
                    'size': i
                }) : s >= 1.25 ? void this.biggerCellsCache.push({
                    'x': t,
                    'y': e,
                    'size': i
                }) : s < 1.25 && s > 0.75 ? void 0 : s > o ? void this.smallerCellsCache.push({
                    'x': t,
                    'y': e,
                    'size': i
                }) : void this.STECellsCache.push({
                    'x': t,
                    'y': e,
                    'size': i
                });
            },*/
            //Sonia (entire function updated) // this is great :D
            'cacheCells': function(t, e, i, s, o) {
                return s >= 5.32 ? void this.biggerSTEDCellsCache.push({
                    'x': t,
                    'y': e,
                    'size': i
                }) : s >= 2.66 ? void this.biggerSTECellsCache.push({
                    'x': t,
                    'y': e,
                    'size': i
                }) : s >= 1.33 ? void this.biggerCellsCache.push({
                    'x': t,
                    'y': e,
                    'size': i
                }) : s < 1.33 && s > 0.75 ? void 0 : s > 0.375 ? void this.smallerCellsCache.push({
                    'x': t,
                    'y': e,
                    'size': i
                }) : s > 0.1875 ? void this.STECellsCache.push({
                    'x': t,
                    'y': e,
                    'size': i
                }) : void this.STEDCellsCache.push({
                    'x': t,
                    'y': e,
                    'size': i
                });
            },
            'setCellOppColor': function(t, e, i) {
                //return t ? ogarcopythelb.color : e > 11 ? '#FF008C' : e >= 2.5 ? '#BE00FF' : e >= 1.25 ? '#FF0A00' : e < 1.25 && e > 0.75 ? '#FFDC00' : e > i ? '#00C8FF' : '#64FF00';
                //return t ? ogarcopythelb.color : e > 10.64 ? defaultSettings.enemyBSTEDColor : e >= 5.32 ? defaultSettings.enemyBSTEDColor : e >= 2.66 && e <= 5.32 ? defaultSettings.enemyBSTEColor : e >= 1.33 && e <= 2.66 ? defaultSettings.enemyBColor : e < 1.33 && e > 0.75 ? '#FFDC00' : e < 0.75 && e > 0.375 ? defaultSettings.enemySSTEDColor : e > i ? '#00C8FF' : defaultSettings.enemySSTEColor; //Sonia
                return t ? ogarcopythelb.color : e >= 10.64 ? defaultSettings.enemyBSTEDColor : e >= 5.32 ? defaultSettings.enemyBSTEDColor : e >= 2.66 ? defaultSettings.enemyBSTEColor : e >= 1.33 ? defaultSettings.enemyBColor : e > 0.75 ? '#FFDC00' : e > 0.375 ? defaultSettings.enemySColor : e > 0.1875 ? defaultSettings.enemySSTEColor : defaultSettings.enemySSTEDColor;
            },
            'getCursorPosition': function() {
                this.cursorX = (this.clientX - this.canvasWidth / 2) / this.viewScale + this.viewX;
                this.cursorY = (this.clientY - this.canvasHeight / 2) / this.viewScale + this.viewY;
            },
            'setZoom': function(t) {
                //t.preventDefault(), this.zoomValue *= Math.pow(defaultmapsettings.zoomSpeedValue2, t.wheelDelta / -120 || t.detail || 0), this.zoomValue > 4 / this.viewScale && (this.zoomValue = 4 / this.viewScale);
                this.zoomValue *= Math.pow(defaultmapsettings.zoomSpeedValue2 + 1, t.wheelDelta / -120 || t.detail || 0);
                if (this.zoomValue > 4 / this.viewScale) {
                    this.zoomValue = 4 / this.viewScale;
                }
            },
            'setTargetPosition': function(t, e) {
                this.targetX = t - this.mapOffsetX;
                this.targetY = e - this.mapOffsetY;
                this.targetDistance = Math.round(Math.sqrt(Math.pow(this.playerX - this.targetX, 2) + Math.pow(this.playerY - this.targetY, 2)));
                window.targetDistance = this.targetDistance;
            },
            'resetTargetPosition': function() {
                this.targetX = this.vector[this.vnr][0] ? this.translateX(this.playerX) : this.playerX;
                this.targetY = this.vector[this.vnr][1] ? this.translateY(this.playerY) : this.playerY;
            },
            'setKeys': function() {
                var t = this;
                document.onkeydown = function(e) {
                    var i = e.keyCode;
                    if (!t.pressedKeys[i]) switch (i) {
                        case 13:
                            t.sendNick('');
                            break;
                        case 32:
                            t.sendSplit();
                            break;
                        case 81:
                            t.sendFreeSpectate();
                            break;
                        case 83:
                            t.sendSpectate();
                            break;
                        case 87:
                            t.sendEject();
                    }
                }, document.onkeyup = function(e) {
                    t.pressedKeys[e.keyCode] = false;
                };
            },
            'init': function() {
                var t = this;
                /firefox/i.test(navigator.userAgent) ? document.addEventListener('DOMMouseScroll', function(e) {
                    t.setZoom(e);
                }, false) : document.body.onmousewheel = function(e) {
                    t.setZoom(e);
                }, setInterval(function() {
                    t.sendPosition();
                }, 40), window.master && window.master.clientVersion && this.setClientVersion(window.master.clientVersion, window.master.clientVersionString);
            }
        };
        window.legendmod = LM; // look at this

        window.sendAction = function(t) {
            LM.sendAction(t);
        };
        var ogarfooddrawer = {
                'canvas': null,
                'ctx': null,
                'canvasWidth': 0,
                'canvasHeight': 0,
                'camX': 0,
                'camY': 0,
                'scale': 1,
                'fpsLastRequest': null,
                'renderedFrames': 0,
                'fps': 0,
                'pi2': 2 * Math.PI,
                'battleAreaMap': null,
                'battleAreaMapCtx': null,
                'pieChart': null,
                'pellet': null,
                'indicator': null,
                'setCanvas': function() {
                    this.canvas = document.getElementById('canvas');
                    this.ctx = this.canvas.getContext('2d');
                    this.canvas.onmousemove = function(t) {
                        LM.clientX = t.clientX;
                        LM.clientY = t.clientY;
                        LM.getCursorPosition();
                    };
                },
                'resizeCanvas': function() {
                    this.canvasWidth = window.innerWidth;
                    this.canvasHeight = window.innerHeight;
                    this.canvas.width = this.canvasWidth;
                    this.canvas.height = this.canvasHeight;
                    LM.canvasWidth = this.canvasWidth;
                    LM.canvasHeight = this.canvasHeight;
                    this.renderFrame();
                },
                'setView': function() {
                    this.setScale(),
                        LM.playerCells.length ?
                        (LM.calculatePlayerMassAndPosition(),
                            //					this.camX += (LM.viewX - this.camX) / 2,
                            //					this.camY += (LM.viewY - this.camY) / 2) :
                            this.camX = (this.camX + LM.viewX) / 2,
                            this.camY = (this.camY + LM.viewY) / 2) :
                        (this.camX = (29 * this.camX + LM.viewX) / 30,
                            this.camY = (29 * this.camY + LM.viewY) / 30),
                        LM.playerX = this.camX, LM.playerY = this.camY;
                },
                'setScale': function() {
                    if (!LM.autoZoom) return this.scale = (9 * this.scale + this.getZoom()) / 10, void(LM.viewScale = this.scale);
                    LM.play ? this.scale = (9 * this.scale + Math.pow(Math.min(64 / LM.playerSize, 1), 0.4) * this.getZoom()) / 10 : this.scale = (9 * this.scale + LM.scale * this.getZoom()) / 10, LM.viewScale = this.scale;
                },
                'getZoom': function() {
                    return Math.max(this.canvasWidth / 1080, this.canvasHeight / 1920) * LM.zoomValue;
                },
                //Sonia5
                'sleep': function(ms) {
                    return new Promise(resolve => setTimeout(resolve, ms));
                },
                /*                'renderFrame': function() {
                                    //for (LM.time = performance.now(), e = 0; e < LM.cells.length; e++) LM.cells[e].moveCell();
                				    LM.time = performance.now();
                						for (i = 0; i < LM.cells.length; i++) {
                							LM.cells[i].moveCell();
                						}
                                    if (this['setView'](), LM.getCursorPosition(), LM['sortCells'](), LM['compareCells'](), this.ctx['clearRect'](0, 0, this.canvasWidth, this.canvasHeight), defaultmapsettings.showGrid && this['drawGrid'](this.ctx, this.canvasWidth, this.canvasHeight, this.scale, this.camX, this.camY), this.ctx['save'](), this.ctx['translate'](this.canvasWidth / 2, this.canvasHeight / 2), this.ctx.scale(this.scale, this.scale), this.ctx['translate'](-this.camX, -this.camY), defaultmapsettings.showBgSectors && this.drawSectors(this.ctx, LM.mapOffsetFixed, defaultSettings.sectorsX, defaultSettings.sectorsY, LM.mapMinX, LM.mapMinY, LM.mapMaxX, LM.mapMaxY, defaultSettings['gridColor'], defaultSettings['sectorsColor'], defaultSettings['sectorsWidth'], true), ':battleroyale' === LM.gameMode && this['drawBattleArea'](this.ctx), defaultmapsettings['showMapBorders']) {
                                        var t = defaultSettings['bordersWidth'] / 2;
                                        this['drawMapBorders'](this.ctx, LM.mapOffsetFixed, LM.mapMinX - t, LM.mapMinY - t, LM.mapMaxX + t, LM.mapMaxY + t, defaultSettings['bordersColor'], defaultSettings['bordersWidth']);
                                    }
                                    this.drawCommander();
                                    defaultmapsettings.virusesRange && this['drawVirusesRange'](this.ctx, LM.viruses), this['drawFood'](), LM.play && (defaultmapsettings.splitRange && this['drawSplitRange'](this.ctx, LM.biggerSTECellsCache, LM.playerCells, LM.selectBiggestCell), defaultmapsettings.oppRings && this['drawOppRings'](this.ctx, this.scale, LM.biggerSTECellsCache, LM.biggerCellsCache, LM.smallerCellsCache, LM.STECellsCache), defaultmapsettings['cursorTracking'] && this['drawCursorTracking'](this.ctx, LM.playerCells, LM.cursorX, LM.cursorY)), this['drawGhostCells']();
                                    for (var e = 0; e < LM['removedCells'].length; e++) LM['removedCells'][e].draw(this.ctx, true);
                                    for (e = 0; e < LM.cells.length; e++) LM.cells[e].draw(this.ctx);
                                    this.ctx['restore'](), ':teams' === LM.gameMode && this.pieChart && this.pieChart.width && this.ctx.drawImage(this.pieChart, this.canvasWidth - this.pieChart.width - 10, 10);
                                }, */
                'renderFrame': async function() { //Sonia5
                    //this.ctx.start2D();
                    await this.sleep(4); //Sonia5
                    LM.time = performance.now();
                    for (i = 0; i < LM.cells.length; i++) {
                        LM.cells[i].moveCell();
                    }
                    this.setView();
                    LM.getCursorPosition();
                    LM.sortCells();
                    LM.compareCells();
                    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
                    if (defaultmapsettings.showGrid) {
                        this.drawGrid(this.ctx, this.canvasWidth, this.canvasHeight, this.scale, this.camX, this.camY);
                    }
                    this.ctx.save();
                    this.ctx.translate(this.canvasWidth / 2, this.canvasHeight / 2);
                    this.ctx.scale(this.scale, this.scale);
                    this.ctx.translate(-this.camX, -this.camY);
                    if (defaultmapsettings.showBgSectors) {
                        this.drawSectors(this.ctx, LM.mapOffsetFixed, defaultSettings.sectorsX, defaultSettings.sectorsY, LM.mapMinX, LM.mapMinY, LM.mapMaxX, LM.mapMaxY, defaultSettings.gridColor, defaultSettings.sectorsColor, defaultSettings.sectorsWidth, true);
                    }

            if(!legendmod.integrity){
				if (!legendmod.customMidPic){
				legendmod.customMidPic = new Image;
				legendmod.customMidPic.src = defaultSettings.customServerImage1;
				}
				this.prevctxglobalAlpha = this.ctx.globalAlpha;
				this.ctx.globalAlpha = '0.2'
                var ofx = ((legendmod.mapMaxX-legendmod.mapMinX)/5)*2.2
                var ofy = ((legendmod.mapMinY-legendmod.mapMaxY)/5)*2.2
                this.ctx.drawImage(
                    legendmod.customMidPic,  //2.1:5.9
                    legendmod.mapMinX+ofx, 
                    legendmod.mapMaxY+ofy, 
                    (legendmod.mapMaxX-legendmod.mapMinX)/8.5, 
                    (legendmod.mapMinY-legendmod.mapMaxY)/8.5
                );
                this.ctx.globalAlpha = this.prevctxglobalAlpha
            }

					
                    if (LM.gameMode === ':battleroyale') {
                        this.drawBattleArea(this.ctx);
                    }
                    if (defaultmapsettings.showMapBorders) {
                        var tempborderwidthradius = defaultSettings.bordersWidth / 2;
                        this.drawMapBorders(this.ctx, LM.mapOffsetFixed, LM.mapMinX - tempborderwidthradius, LM.mapMinY - tempborderwidthradius, LM.mapMaxX + tempborderwidthradius, LM.mapMaxY + tempborderwidthradius, defaultSettings.bordersColor, defaultSettings.bordersWidth);
                    }
                    this.drawCommander();
                    this.drawCommander2();
                    if (defaultmapsettings.virusesRange) {
                        this.drawVirusesRange(this.ctx, LM.viruses);
                    }
                    this.drawFood();
                    if (LM.play) {
                        if (defaultmapsettings.splitRange) {
                            this.drawSplitRange(this.ctx, LM.biggerSTECellsCache, LM.playerCells, LM.selectBiggestCell);
                            this.drawSplitRange(this.ctx, LM.biggerSTEDCellsCache, LM.playerCells, LM.selectBiggestCell); //Sonia
                            //this.drawDoubleSplitRange(this.ctx, LM.biggerSTECellsCache, LM.playerCells, LM.selectBiggestCell);
                            this.drawDoubleSplitRange(this.ctx, LM.biggerSTEDCellsCache, LM.playerCells, LM.selectBiggestCell); //Sonia
                        }
                        if (defaultmapsettings.oppRings) {
                            //this.drawOppRings(this.ctx, this.scale, LM.biggerSTECellsCache, LM.biggerCellsCache, LM.smallerCellsCache, LM.STECellsCache);
                            this.drawOppRings(this.ctx, this.scale, LM.biggerSTEDCellsCache, LM.biggerSTECellsCache, LM.biggerCellsCache, LM.smallerCellsCache, LM.STECellsCache, LM.STEDCellsCache); //Sonia
                        }
                        if (defaultmapsettings.cursorTracking) {
                            this.drawCursorTracking(this.ctx, LM.playerCells, LM.cursorX, LM.cursorY);
                        }
                    }

                    this.drawGhostCells();

                    for (var i = 0; i < LM.removedCells.length; i++) {
                        LM.removedCells[i].draw(this.ctx, true);
                    }

                    //lylko
                    defaultmapsettings.jellyPhisycs && LM.updateQuadtree(LM.cells); //

                    for (i = 0; i < LM.cells.length; i++) {

                        if (defaultmapsettings.jellyPhisycs) {
                            LM.cells[i].updateNumPoints();
                            LM.cells[i].movePoints();
                        }

                        LM.cells[i].draw(this.ctx);

                        if (ogarfooddrawer.LMB && this.pointInCircle(LM.cursorX, LM.cursorY, LM.cells[i].x, LM.cells[i].y, LM.cells[i].size)) {
                            LM.selected = LM.cells[i].id
                            //this.drawRing(this.ctx,LM.cells[i].x,LM.cells[i].y,LM.cells[i].size,0.75,'#ffffff')
                        }
                    }
                    LM.indexedCells[LM.selected] && this.drawRing(this.ctx,
                        LM.indexedCells[LM.selected].x,
                        LM.indexedCells[LM.selected].y,
                        LM.indexedCells[LM.selected].size,
                        0.75, '#ffffff')

                    if (ogarfooddrawer.RMB && LM.indexedCells[LM.selected] && LM.playerCellIDs.length) {
                        var index = LM.selectBiggestCell ? LM.playerCells.length - 1 : 0;
                        //ctx.arc(playerCells[index].x, playerCells[index].y, playerCells[index].size + 760, 0, this.pi2, false);
                        if (LM.playerCells[index] == undefined) return;
                        var xc = LM.playerCells[index].targetX //.x
                        var yc = LM.playerCells[index].targetY //.y

                        var x = LM.indexedCells[LM.selected].targetX //.x
                        var y = LM.indexedCells[LM.selected].targetY //.y

                        var a = xc - x
                        var b = yc - y
                        var distance = Math.sqrt(a * a + b * b) - (LM.indexedCells[LM.selected].size + LM.playerCells[index].size)

                        var ang = Math.atan2(y - yc, x - xc);

                        LM.cursorX = xc + (Math.cos(ang) * distance)
                        LM.cursorY = yc + (Math.sin(ang) * distance)
                        LM.sendPosition()
                        //console.log(xc,yc,x,y,LM.cursorX,LM.cursorY)
                        //Math.deg(ang)


                        /*var xc = LM.playerCells[index].x,
                            yc = LM.playerCells[index].y,*/
                        //R = 100000000,
                        /*ang = Math.atan2(LM.indexedCells[LM.selected].y - yc, LM.indexedCells[LM.selected].x - xc);
                        LM.cursorX= Math.cos(ang)
                        LM.cursorY= Math.sin(ang)*/
                        //Math.deg(ang)

                        //LM.cursorX = LM.indexedCells[LM.selected].x
                        //LM.cursorY = LM.indexedCells[LM.selected].y
                    }


                    this.ctx.restore();
                    if (LM.gameMode === ':teams') {
                        if (this.pieChart && this.pieChart.width) {
                            this.ctx.drawImage(this.pieChart, this.canvasWidth - this.pieChart.width - 10, 10);
                        }
                    }
                    //this.ctx.finish2D();
                },
                pointInCircle: function(x, y, cx, cy, radius) {
                    var distancesquared = (x - cx) * (x - cx) + (y - cy) * (y - cy);
                    return distancesquared <= radius * radius;
                },
                drawRing: function(ctx, x, y, size, alpha, color) {
                    ctx.lineWidth = 20;
                    ctx.globalAlpha = alpha;
                    ctx.strokeStyle = color;
                    ctx.beginPath();
                    ctx.arc(x, y, size - 10, 0, this.pi2, false);
                    ctx.closePath();
                    ctx.stroke();

                    ctx.globalAlpha = 1;
                },


                'drawGrid': function(t, e, i, s, o, a) {
                    var n = e / s;
                    var r = i / s;
                    var l = (n / 2 - o) % 50;
                    var h = (r / 2 - a) % 50;
                    t.strokeStyle = defaultSettings.gridColor, t.globalAlpha = 1 * s, t.beginPath();
                    for (; l < n; l = l + 50) {
                        t.moveTo(l * s - 0.5, 0);
                        t.lineTo(l * s - 0.5, r * s);
                    }
                    for (; h < r; h = h + 50) {
                        t.moveTo(0, h * s - 0.5);
                        t.lineTo(n * s, h * s - 0.5);
                    }
                    t.stroke(), t.globalAlpha = 1;
                },
                'drawSectors': function(t, e, i, s, o, a, n, r, l, h, c, u) {
                    if (e || !u) {
                        var d = ~~((n - o) / i);
                        var f = ~~((r - a) / s);
                        var m = 0;
                        var y = 0;
                        if (t.strokeStyle = l, t.fillStyle = h, t.lineWidth = c, u || !u && defaultmapsettings["showMiniMapGrid"]) {
                            t.beginPath();
                            var ogario1PlayerProfiles = 0;
                            for (; ogario1PlayerProfiles < i + 1; ogario1PlayerProfiles++) {
                                m = o + d * ogario1PlayerProfiles;
                                t.moveTo(ogario1PlayerProfiles == i ? n : m, a);
                                t.lineTo(ogario1PlayerProfiles == i ? n : m, r);
                            }
                            ogario1PlayerProfiles = 0;
                            for (; ogario1PlayerProfiles < s + 1; ogario1PlayerProfiles++) {
                                y = a + f * ogario1PlayerProfiles;
                                t.moveTo(o - c / 2, ogario1PlayerProfiles == s ? r : y);
                                t.lineTo(n + c / 2, ogario1PlayerProfiles == s ? r : y);
                            }
                            t.stroke();
                        } else {
                            this.drawMapBorders(t, e, o, a, n, r, l, c);
                        }
                        t.font = u ? defaultSettings.sectorsFontWeight + " " + defaultSettings.sectorsFontSize + "px " + defaultSettings.sectorsFontFamily : defaultSettings.miniMapFontWeight + " " + ~~(0.4 * f) + "px " + defaultSettings.miniMapFontFamily;
                        t.textAlign = "center";
                        t.textBaseline = "middle";
                        ogario1PlayerProfiles = 0;
                        for (; ogario1PlayerProfiles < s; ogario1PlayerProfiles++) {
                            var ogarcopythelb = 0;
                            for (; ogarcopythelb < i; ogarcopythelb++) {
                                var ogarminimapdrawer = String.fromCharCode(65 + ogario1PlayerProfiles) + (ogarcopythelb + 1);
                                m = ~~(o + d / 2 + ogarcopythelb * d);
                                y = ~~(a + f / 2 + ogario1PlayerProfiles * f);
                                t.fillText(ogarminimapdrawer, m, y);
                            }
                        }
                    }
                },
                "drawCommander": function() {
                    //console.log('Special effects stage 2');
                    if (LM.drawCommander) {
                        var pickerAxes = this.ctx;
                        cimg = new Image;
                        cimg.src = defaultSettings.commanderImage;
                        cimg1 = new Image;
                        cimg1.src = defaultSettings.commanderImage1;
                        cimg12 = new Image;
                        cimg12.src = defaultSettings.commanderImage2;
                        pickerAxes.save();
                        pickerAxes.globalAlpha = LM.cAlpha;
                        pickerAxes.translate(i.spawnX, i.spawnY);
                        pickerAxes.rotate(LM.cAngle);
                        pickerAxes.drawImage(cimg, -LM.cRadius / 2, -LM.cRadius / 2, LM.cRadius, LM.cRadius);
                        pickerAxes.restore();
                        pickerAxes.save();
                        pickerAxes.globalAlpha = LM.cAlpha;
                        pickerAxes.translate(i.spawnX, i.spawnY);
                        pickerAxes.rotate(LM.cAngle1);
                        pickerAxes.drawImage(cimg1, -LM.cRadius / 2, -LM.cRadius / 2, LM.cRadius, LM.cRadius);
                        pickerAxes.restore();
                        pickerAxes.save();
                        pickerAxes.globalAlpha = LM.cAlpha;
                        pickerAxes.translate(i.spawnX, i.spawnY);
                        pickerAxes.rotate(LM.cAngle2);
                        pickerAxes.drawImage(cimg12, -LM.cRadius / 2, -LM.cRadius / 2, LM.cRadius, LM.cRadius);
                        pickerAxes.restore();
                        pickerAxes.globalAlpha = 1;
                        this.updateCommander();
                    }
                },
                "drawCommander2": function() {
                    //console.log('Special effects stage 2');
                    if (LM.drawCommander2) {
                        var pickerAxes = this.ctx;
                        cimg = new Image;
                        cimg.src = defaultSettings.commanderImage3;
                        cimg1 = new Image;
                        cimg1.src = defaultSettings.commanderImage4;
                        cimg12 = new Image;
                        cimg12.src = defaultSettings.commanderImage5;
                        pickerAxes.save();
                        pickerAxes.globalAlpha = LM.cAlpha;
                        pickerAxes.translate(window.targetingLeadX, window.targetingLeadY);
                        pickerAxes.rotate(LM.cAngle);
                        pickerAxes.drawImage(cimg, -LM.cRadius / 2, -LM.cRadius / 2, LM.cRadius, LM.cRadius);
                        pickerAxes.restore();
                        pickerAxes.save();
                        pickerAxes.globalAlpha = LM.cAlpha;
                        pickerAxes.translate(window.targetingLeadX, window.targetingLeadY);
                        pickerAxes.rotate(LM.cAngle1);
                        pickerAxes.drawImage(cimg1, -LM.cRadius / 2, -LM.cRadius / 2, LM.cRadius, LM.cRadius);
                        pickerAxes.restore();
                        pickerAxes.save();
                        pickerAxes.globalAlpha = LM.cAlpha;
                        pickerAxes.translate(window.targetingLeadX, window.targetingLeadY);
                        pickerAxes.rotate(LM.cAngle2);
                        pickerAxes.drawImage(cimg12, -LM.cRadius / 2, -LM.cRadius / 2, LM.cRadius, LM.cRadius);
                        pickerAxes.restore();
                        pickerAxes.globalAlpha = 1;
                        this.updateCommander();
                    }
                },
                "updateCommander": function() {
                    LM.cRadius += 7;
                    LM.cAngle += .007;
                    LM.cAngle1 -= .006;
                    LM.cAngle2 += .003;
                    if (2025 <= LM.cRadius) {
                        LM.cAlpha *= .95;
                    }
                    if (1E-4 >= LM.cAlpha) {
                        this.resetCommander();
                    }
                },
                "resetCommander": function() {
                    LM.cRadius = 10; //LM.clientX
                    LM.cAngle = 4;
                    LM.cAngle1 = 0;
                    LM.cAngle2 = 0;
                    LM.cAlpha = 1;
                    LM.drawCommander = false;
                    LM.drawCommander2 = false;
                    i.spawnX = 0;
                    i.spawnY = 0;
                },
                /*
                'drawMapBorders': function(t, e, i, s, o, a, n, r) {
                    e && (t.strokeStyle = n, t.lineWidth = r, t.beginPath(), t.moveTo(i, s), t.lineTo(o, s), t.lineTo(o, a), t.lineTo(i, a), t.closePath(), t.stroke());
                },
				*/
                "drawMapBorders": function(ctx, macros, text, x1, x0, y0, radius, canvas) {
                    if (macros) {
                        ctx.strokeStyle = radius;
                        ctx.lineWidth = canvas;
                        ctx.beginPath();
                        ctx.moveTo(text, x1);
                        ctx.lineTo(x0, x1);
                        ctx.lineTo(x0, y0);
                        ctx.lineTo(text, y0);
                        if (defaultmapsettings.borderGlow) {
                            ctx.shadowBlur = defaultSettings.borderGlowSize;
                            ctx.shadowColor = defaultSettings.borderGlowColor;
                        } else {
                            "skrrt";
                        }
                        ctx.closePath();
                        ctx.stroke();
                    }
                    if (defaultmapsettings.borderGlow) {
                        ctx.shadowBlur = 0;
                    } else {
                        "skrrt";
                    }
                },
                'drawVirusesRange': function(t, e, i) {
                    if (e.length) {
                        t.beginPath();
                        for (var s = 0; s < e.length; s++) {
                            var o = e[s].x,
                                a = e[s].y;
                            t.moveTo(o, a),
                                t.arc(o, a, e[s].size + 820, 0, this.pi2, false);
                        }
                        t.fillStyle = defaultSettings.virusColor,
                            t.globalAlpha = 0.1, t.fill(),
                            t.globalAlpha = 1, i && (e = []);
                    }
                },
                'drawFood': function() {
                    if (LM.showFood && !(defaultmapsettings.autoHideFoodOnZoom && this.scale < 0.2)) {
                        if (defaultmapsettings.autoHideFood && !LM.foodIsHidden && LM.playerMass > 1000) return LM.showFood = false, void(LM.foodIsHidden = true);
                        if (defaultmapsettings.rainbowFood)
                            for (var t = 0; t < LM.food.length; t++) LM.food[t].moveCell(), LM.food[t].draw(this.ctx);
                        else this.drawCachedFood(this.ctx, LM.food, this.scale);
                    }
                },
                'drawCachedFood': function(t, e, i, s) {
                    if (e.length) {
                        if (defaultmapsettings.optimizedFood && this.pellet)
                            for (var o = 0; o < e.length; o++) {
                                var a = e[o].x - 10 - defaultSettings.foodSize,
                                    n = e[o].y - 10 - defaultSettings.foodSize;
                                t.drawImage(this.pellet, a, n);
                            } else {
                                t.beginPath();
                                for (o = 0; o < e.length; o++) {
                                    a = e[o].x, n = e[o].y;
                                    if (t.moveTo(a, n), i < 0.16) {
                                        var r = e[o].size + defaultSettings.foodSize;
                                        t.rect(a - r, n - r, 2 * r, 2 * r);
                                    } else t.arc(a, n, e[o].size + defaultSettings.foodSize, 0, this.pi2, false);
                                }
                                t.fillStyle = defaultSettings.foodColor, t.globalAlpha = 1, t.fill();
                            }
                        s && (e = []);
                    }
                },
                'drawSplitRange': function(t, e, i, s, o) {
                    if (this.drawCircles(t, e, 760, 4, 0.4, defaultSettings.enemyBSTEColor), i.length) { //Sonia2
                        //if (this.drawCircles(t, e, 760, 4, 0.4, '#ff0000'), i.length) { //Sonia
                        var a = s ? i.length - 1 : 0;
                        t.lineWidth = 6, t.globalAlpha = defaultSettings.darkTheme ? 0.7 : 0.35,
                            t.strokeStyle = defaultSettings.splitRangeColor,
                            t.beginPath(),
                            t.arc(i[a].x, i[a].y, i[a].size + 760, 0, this.pi2, false),
                            t.closePath(),
                            t.stroke();
                    }
                    t.globalAlpha = 1, o && (e = []);
                },
                'drawDoubleSplitRange': function(t, e, i, s, o) {
                    //if (this.drawCircles(t, e, 760, 4, 0.4, '#BE00FF'), i.length) {
                    if (this.draw2Circles(t, e, 760, 4, 0.4, defaultSettings.enemyBSTEDColor), i.length) { //Sonia2
                        //if (this.draw2Circles(t, e, 760, 4, 0.4, '#8000ff'), i.length) { //Sonia
                        //this.drawSplitRange(this.ctx, LM.biggerSTECellsCache, LM.playerCells, LM.selectBiggestCell);

                        var a = s ? i.length - 1 : 0;
                        //console.log(i[a].size);
                        if (i[a].size >= 400 && defaultmapsettings.qdsplitRange) { //Sonia2
                            t.lineWidth = 6,
                                t.globalAlpha = defaultSettings.darkTheme ? 0.7 : 0.35,
                                t.strokeStyle = defaultSettings.splitRangeColor;
                            t.beginPath();
                            t.arc(i[a].x, i[a].y, 2 * i[a].size + 760, 0, this.pi2, false);
                            t.closePath();
                            t.stroke();
                        }
                    }
                    t.globalAlpha = 1;
                    if (o) {
                        e = [];
                    }
                },
                //Sonia (entire function update)
                //'drawOppRings': function(t, e, i, s, o, a, n) {
                'drawOppRings': function(t, e, ip, i, s, o, a, ap, n) {
                    var r = 14 + 2 / e;
                    var l = 12 + 1 / e;
                    this.drawCircles(t, ip, r, l, 0.75, defaultSettings.enemyBSTEDColor); //Sonia2
                    this.drawCircles(t, i, r, l, 0.75, defaultSettings.enemyBSTEColor); //Sonia2
                    this.drawCircles(t, s, r, l, 0.75, defaultSettings.enemyBColor); //Sonia2
                    this.drawCircles(t, o, r, l, 0.75, defaultSettings.enemySColor); //Sonia2
                    this.drawCircles(t, a, r, l, 0.75, defaultSettings.enemySSTEColor); //Sonia2
                    this.drawCircles(t, ap, r, l, 0.75, defaultSettings.enemySSTEDColor); //Sonia2
                    if (n) {
                        i = [];
                        s = [];
                        o = [];
                        a = [];
                        ip = [];
                        ap = [];
                    }
                },
                'drawCursorTracking': function(t, e, i, s) {
                    t.lineWidth = 4, t.globalAlpha = defaultSettings.darkTheme ? 0.75 : 0.35, t.strokeStyle = defaultSettings.cursorTrackingColor, t.beginPath();
                    for (var o = 0; o < e.length; o++) t.moveTo(e[o].x, e[o].y), t.lineTo(i, s);
                    t.stroke(), t.globalAlpha = 1;
                },
                'drawCircles': function(t, e, i, s, o, a) {
                    t.lineWidth = s, t.globalAlpha = o, t.strokeStyle = a;
                    for (var n = 0; n < e.length; n++) t.beginPath(), t.arc(e[n].x, e[n].y, e[n].size + i, 0, this.pi2, false), t.closePath(), t.stroke();
                    t.globalAlpha = 1;
                },
                //Sonia (added entire function)
                'draw2Circles': function(t, e, i, s, o, a) {
                    t.lineWidth = s, t.globalAlpha = o, t.strokeStyle = a;
                    //for (var n = 0; n < e.length; n++) t.beginPath(), t.arc(e[n].x, e[n].y, 1.5*e[n].size + 2*i, 0, this.pi2, false), t.closePath(), t.stroke();
                    if (defaultmapsettings.qdsplitRange) { //Sonia2
                        for (var n = 0; n < e.length; n++) t.beginPath(), t.arc(e[n].x, e[n].y, 2 * e[n].size + i, 0, this.pi2, false), t.closePath(), t.stroke(); //760+2*cell.size is the correct
                    } //Sonia2
                    if (defaultmapsettings.sdsplitRange) { //Sonia2
                        for (var n = 0; n < e.length; n++) t.setLineDash([20, 30]), t.lineWidth = 2 * s, t.beginPath(), t.arc(e[n].x, e[n].y, 1.5 * e[n].size + 2 * i, 0, this.pi2, false), t.closePath(), t.stroke(); //Sonia2
                        t.setLineDash([]); //Sonia2
                        t.lineWidth = s; //Sonia2
                    } //Sonia2
                    t.globalAlpha = 1;
                },
                'drawDashedCircle': function(t, e, i, s, o, a, n) {
                    var r = this.pi2 / o;
                    t.lineWidth = a, t.strokeStyle = n;
                    for (var l = 0; l < o; l += 2) t.beginPath(), t.arc(e, i, s - a / 2, l * r, (l + 1) * r, false), t.stroke();
                },
                'drawTeammatesInd': function(t, e, i, s) {
                    //console.log("t:"+ t + " e:" + e + " i:" + i + "s:" + s);
                    if (this.indicator) {
                        t.drawImage(this.indicator, e - 45, i - s - 90);
                    }
                },
                'drawPieChart': function() {
                    this.pieChart || (this.pieChart = document.createElement('canvas'));
                    var t = this.pieChart.getContext('2d'),
                        e = Math.min(200, 0.3 * this.canvasWidth) / 200;
                    this.pieChart.width = 200 * e; 
					this.pieChart.height = 240 * e;
					t.scale(e, e);
                    for (var i = ['#333333', '#FF3333', '#33FF33', '#3333FF'], s = 0, o = 0; o < LM.pieChart.length; o++) {
                        var a = s + LM.pieChart[o] * this.pi2;
                        t.fillStyle = i[o + 1]; 
						t.beginPath(); 
						t.moveTo(100, 140); 
						t.arc(100, 140, 80, s, a, false); 
						t.fill(); 
						s = a;
                    }
                },
                'drawBattleArea': function(t) {
                    if (LM.battleRoyale.state) {
                        this.drawDangerArea(t, LM.battleRoyale.x, LM.battleRoyale.y, LM.battleRoyale.radius, LM.mapMinX, LM.mapMinY, LM.mapMaxX - LM.mapMinX, LM.mapMaxY - LM.mapMinY, defaultSettings.dangerAreaColor, 0.25);
                        this.drawSafeArea(t, LM.battleRoyale.targetX, LM.battleRoyale.targetY, LM.battleRoyale.targetRadius, 40, defaultSettings.safeAreaColor);
                    }
                },
                'drawBattleAreaOnMinimap': function(t, e, i, s, o, a) {
                    if (LM.battleRoyale.state) {
                        if (!this.battleAreaMap) {
                            this.battleAreaMap = document.createElement("canvas");
                            this.battleAreaMapCtx = this.battleAreaMap.getContext("2d");
                        }
                        if (this.battleAreaMap.width != e) {
                            this.battleAreaMap.width = e;
                            this.battleAreaMap.height = i;
                        } else {
                            this.battleAreaMapCtx.clearRect(0, 0, e, i);
                        }
                        var n = (LM.battleRoyale.x + o) * s;
                        var r = (LM.battleRoyale.y + a) * s;
                        var l = LM.battleRoyale.radius * s;
                        this.drawDangerArea(this.battleAreaMapCtx, n, r, l, 0, 0, e, i, defaultSettings.dangerAreaColor, 0.25);
                        n = ~~((LM.battleRoyale.targetX + o) * s);
                        r = ~~((LM.battleRoyale.targetY + a) * s);
                        l = ~~(LM.battleRoyale.targetRadius * s);
                        this.drawSafeArea(this.battleAreaMapCtx, n, r, l, 2, defaultSettings.safeAreaColor);
                        t.drawImage(this.battleAreaMap, 0, 0);
                    }
                },
                'drawDangerArea': function(t, e, i, s, o, a, n, r, l, h) {
                    if (!(LM.battleRoyale.radius == LM.battleRoyale.maxRadius || s <= 0)) {
                        t.save();
                        t.globalAlpha = h;
                        t.fillStyle = l;
                        t.fillRect(o, a, n, r);
                        t.globalCompositeOperation = "destination-out";
                        t.globalAlpha = 1;
                        t.beginPath();
                        t.arc(e, i, s, 0, this.pi2, false);
                        t.fill();
                        t.restore();
                    }
                },
                'drawSafeArea': function(t, e, i, s, o, a) {
                    if (!(LM.battleRoyale.state > 2 || s <= 0)) {
                        this.drawDashedCircle(t, e, i, s, 60, o, a);
                    }
                },
                'drawTextAlongArc': function(ctx, str, centerX, centerY, radius, angle) {
                    var len = str.length,
                        s;
                    this.ctx.save();
                    this.ctx.translate(centerX, centerY);
                    this.ctx.rotate(-1 * angle / 2);
                    this.ctx.rotate(-1 * (angle / len) / 2);
                    for (var n = 0; n < len; n++) {
                        this.ctx.rotate(angle / len);
                        this.ctx.save();
                        this.ctx.translate(0, -1 * radius);
                        s = str[n];
                        this.ctx.fillText(s, 0, 0);
                        this.ctx.restore();
                    }
                    this.ctx.restore();
                },
                'drawGhostCells': function() {
                    if (defaultmapsettings.showGhostCells) {
                        var t = LM.ghostCells;
                        this.ctx.beginPath();
                        var e = 0;
                        for (; e < t.length; e++) {
                            if (!t[e].inView) {
                                var i = t[e].x;
                                var s = t[e].y;
                                this.ctx.moveTo(i, s);
                                this.ctx.arc(i, s, t[e].size, 0, this.pi2, false);
                                //
                                if (defaultmapsettings.showGhostCellsInfo) {
                                    this.nickScale = 1;
                                    this.fontSize = Math.max(t[e].size * 0.3, 26) * this.scale;
                                    this.nickSize = ~~(this.fontSize * this.nickScale);
                                    this.ctx.font = defaultSettings.namesFontWeight + " " + this.nickSize * 4 + "px " + defaultSettings.namesFontFamily;
                                    this.ctx.textAlign = 'center';
                                    this.ctx.fillStyle = defaultSettings.namesColor;
                                    this.ctx.strokeStyle = defaultSettings.namesStrokeColor;
                                    this.ctx.lineWidth = 4;
                                    angle = Math.PI * 0.8;

                                    if (LM.leaderboard[e] != undefined) { //LM instead of legendmod for quicker response

                                        this.ghostcellstext = removeEmojis(ogarminimapdrawer.escapeHTML(LM.leaderboard[e].nick)); //legendmod3.escapeHTML(legendmod.leaderboard[0].nick)
                                    } else {
                                        this.ghostcellstext = "Legend mod";
                                    }
                                    this.drawTextAlongArc(this.ctx, this.ghostcellstext, i, s, t[e].size * this.pi2 / 6, angle);
                                    if (defaultmapsettings.customSkins && LM.showCustomSkins) {
                                        if (LM.leaderboard[e] != undefined) {
                                            node = ogarminimapdrawer.getCustomSkin(LM.leaderboard[e].nick, "#000000");
                                            if (node) {
                                                this.ctx.drawImage(node, i - t[e].size, s - t[e].size, t[e].size * 2, t[e].size * 2);
                                            }
                                        }
                                    }
                                }
                                //
                            }
                        }
                        this.ctx.fillStyle = defaultSettings.ghostCellsColor;
                        this.ctx.globalAlpha = defaultSettings.ghostCellsAlpha;
                        this.ctx.shadowColor = defaultSettings.ghostCellsColor;
                        this.ctx.shadowBlur = 40;
                        this.ctx.shadowOffsetX = 0;
                        this.ctx.shadowOffsetY = 0;
                        this.ctx.fill();
                        this.ctx.globalAlpha = 1;
                        this.ctx.shadowBlur = 0;
                    }
                },
                'preDrawPellet': function() {
                    this.pellet = null;
                    var t = 10 + defaultSettings.foodSize,
                        e = document.createElement('canvas');
                    e.width = 2 * t, e.height = 2 * t;
                    var i = e.getContext('2d');
                    i.arc(t, t, t, 0, this.pi2, false), i.fillStyle = defaultSettings.foodColor, i.fill(), this.pellet = new Image(), this.pellet.src = e.toDataURL(), e = null;
                },
                'preDrawIndicator': function() {
                    this.indicator = null;
                    var t = document.createElement('canvas');
                    t.width = 90, t.height = 50;
                    var e = t.getContext('2d');
                    e.lineWidth = 2;
                    e.fillStyle = defaultSettings.teammatesIndColor;
                    e.strokeStyle = '#000000';
                    e.beginPath();
                    e.moveTo(0, 0);
                    e.lineTo(90, 0);
                    e.lineTo(45, 50);
                    e.closePath();
                    e.fill();
                    e.stroke();
                    this.indicator = new Image();
                    this.indicator.src = t.toDataURL();
                    t = null;
                },
                'countFps': function() {
                    if (defaultmapsettings.showStatsFPS) {
                        var t = performance.now();
                        if (!this.fpsLastRequest) {
                            this.fpsLastRequest = t;
                        }
                        if (t - this.fpsLastRequest >= 1000) {
                            this.fps = this.renderedFrames;
                            this.renderedFrames = 0;
                            this.fpsLastRequest = t;
                        }
                        this.renderedFrames++;
                    }
                },
                'render': function() {
                    ogarfooddrawer.countFps();
					ogarfooddrawer.renderFrame();
					window.requestAnimationFrame(ogarfooddrawer.render);
                },
                'init': function() {
                    this.setCanvas();
                    this.resizeCanvas();
                    this.preDrawPellet();
                    this.preDrawIndicator();
                    window.requestAnimationFrame(ogarfooddrawer.render);
                }

            },
            ogarioefaultHotkeys = {},
            ogario1Hotkeys = {},
            ogario11Hotkeys = {
                'hk-feed': {
                    'label': h['hk-feed'],
                    'defaultKey': 'W',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.feed();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-macroFeed': {
                    'label': h['hk-macroFeed'],
                    'defaultKey': 'E',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.macroFeed(!0);
                    },
                    'keyUp': function() {
                        ogarminimapdrawer && ogarminimapdrawer.macroFeed(!1);
                    },
                    'type': 'normal'
                },
                'hk-split': {
                    'label': h['hk-split'],
                    'defaultKey': 'SPACE',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.split();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-doubleSplit': {
                    'label': h['hk-doubleSplit'],
                    'defaultKey': 'Q',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.doubleSplit();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-popSplit': {
                    'label': 'Popsplit',
                    'defaultKey': 'ALT+Q',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.popSplit();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-split16': {
                    'label': h['hk-split16'],
                    'defaultKey': 'SHIFT',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.split16();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-pause': {
                    'label': h['hk-pause'],
                    'defaultKey': 'R',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.setPause();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-showTop5': {
                    'label': h['hk-showTop5'],
                    'defaultKey': 'T',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.setShowTop5();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-showTime': {
                    'label': h['hk-showTime'],
                    'defaultKey': 'ALT+T',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.setShowTime();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-showSplitRange': {
                    'label': h['hk-showSplitRange'],
                    'defaultKey': 'U',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.setShowSplitRange();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-showSplitInd': {
                    'label': h['hk-showSplitInd'],
                    'defaultKey': 'I',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.setShowSplitInd();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-showTeammatesInd': {
                    'label': h['hk-showTeammatesInd'],
                    'defaultKey': 'ALT+I',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.setShowTeammatesInd();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-showOppColors': {
                    'label': h['hk-showOppColors'],
                    'defaultKey': 'O',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.setShowOppColors();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-toggleSkins': {
                    'label': h['hk-toggleSkins'],
                    'defaultKey': 'A',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.toggleSkins();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-transparentSkins': {
                    'label': h['hk-transparentSkins'],
                    'defaultKey': '',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.setTransparentSkins();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-showSkins': {
                    'label': h['hk-showSkins'],
                    'defaultKey': 'S',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.setShowSkins();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-showStats': {
                    'label': h['hk-showStats'],
                    'defaultKey': 'ALT+S',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.setShowStats();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-toggleCells': {
                    'label': h['hk-toggleCells'],
                    'defaultKey': 'D',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.toggleCells();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-showFood': {
                    'label': h['hk-showFood'],
                    'defaultKey': 'F',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.setShowFood();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-showGrid': {
                    'label': h['hk-showGrid'],
                    'defaultKey': 'G',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.setShowGrid();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-showMiniMapGuides': {
                    'label': h['hk-showMiniMapGuides'],
                    'defaultKey': 'ALT+G',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.setShowMiniMapGuides();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-hideChat': {
                    'label': h['hk-hideChat'],
                    'defaultKey': 'H',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.hideChat();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-showHUD': {
                    'label': h['hk-showHUD'],
                    'defaultKey': 'ALT+H',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.setShowHUD();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-copyLb': {
                    'label': h['hk-copyLb'],
                    'defaultKey': 'L',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.copyLb();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-showLb': {
                    'label': h['hk-showLb'],
                    'defaultKey': 'ALT+L',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.setShowLb();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-toggleAutoZoom': {
                    'label': h['hk-toggleAutoZoom'],
                    'defaultKey': '',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.toggleAutoZoom();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-resetZoom': {
                    'label': h['hk-resetZoom'],
                    'defaultKey': 'Z',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.resetZoom(!0);
                    },
                    'keyUp': function() {
                        ogarminimapdrawer && ogarminimapdrawer.resetZoom(!1);
                    },
                    'type': 'normal'
                },
                'hk-toggleDeath': {
                    'label': h['hk-toggleDeath'],
                    'defaultKey': 'X',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.toggleDeath();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-clearChat': {
                    'label': h['hk-clearChat'],
                    'defaultKey': 'C',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.displayChatHistory(!0);
                    },
                    'keyUp': function() {
                        ogarminimapdrawer && ogarminimapdrawer.displayChatHistory(!1);
                    },
                    'type': 'normal'
                },
                'hk-showBgSectors': {
                    'label': h['hk-showBgSectors'],
                    'defaultKey': 'B',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.setShowBgSectors();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-hideBots': {
                    'label': h['hk-hideBots'],
                    'defaultKey': 'ALT+B',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.setHideSmallBots();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-showNames': {
                    'label': h['hk-showNames'],
                    'defaultKey': 'N',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.setShowNames();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-hideTeammatesNames': {
                    'label': h['hk-hideTeammatesNames'],
                    'defaultKey': '',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.setHideTeammatesNames();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-showMass': {
                    'label': h['hk-showMass'],
                    'defaultKey': 'M',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.setShowMass();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-showMiniMap': {
                    'label': h['hk-showMiniMap'],
                    'defaultKey': 'ALT+M',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.setShowMiniMap();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-chatMessage': {
                    'label': h['hk-chatMessage'],
                    'defaultKey': 'ENTER',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.enterChatMessage();
                    },
                    'keyUp': null,
                    'type': 'special'
                },
                'hk-quickResp': {
                    'label': h['hk-quickResp'],
                    'defaultKey': 'TILDE',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.quickResp();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-autoResp': {
                    'label': h['hk-autoResp'],
                    'defaultKey': '',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.toggleAutoResp();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-zoom1': {
                    'label': h['hk-zoomLevel'] + ' 1',
                    'defaultKey': 'ALT+1',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.setZoom(0.5);
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-zoom2': {
                    'label': h['hk-zoomLevel'] + ' 2',
                    'defaultKey': 'ALT+2',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.setZoom(0.25);
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-zoom3': {
                    'label': h['hk-zoomLevel'] + ' 3',
                    'defaultKey': 'ALT+3',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.setZoom(0.125);
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-zoom4': {
                    'label': h['hk-zoomLevel'] + ' 4',
                    'defaultKey': 'ALT+4',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.setZoom(0.075);
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-zoom5': {
                    'label': h['hk-zoomLevel'] + ' 5',
                    'defaultKey': 'ALT+5',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.setZoom(0.05);
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-voiceChat': {
                    'label': h['hk-voiceChat'],
                    'defaultKey': '=',
                    'keyDown': function() {
                        //ogarminimapdrawer && ogarminimapdrawer.enterChatMessage();
                        //if ($('#message-box').css('display') == 'block') {
                        $(".voice-start.icon-mic").click();
                        //}
                    },
                    'keyUp': null,
                    'type': 'special'
                },
                'hk-GhostCellsInfo': {
                    'label': h['hk-GhostCellsInfo'],
                    'defaultKey': 'K',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.setShowGhostCellsInfo();
                    },
                    'keyUp': null,
                    'type': 'special'
                },
                'hk-Autoplay': {
                    'label': h['hk-Autoplay'],
                    'defaultKey': 'J',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.setAutoPlay();
                    },
                    'keyUp': null,
                    'type': 'special'
                },
                'hk-switchServerMode': {
                    'label': h['hk-switchServerMode'],
                    'defaultKey': '-',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.switchServerMode();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-showTargeting': {
                    'label': h['hk-showTargeting'],
                    'defaultKey': '',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.setShowTargeting();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-setTargeting': {
                    'label': h['hk-setTargeting'],
                    'defaultKey': '',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.setTargeting();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-cancelTargeting': {
                    'label': h['hk-cancelTargeting'],
                    'defaultKey': '',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.cancelTargeting();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-changeTarget': {
                    'label': h['hk-changeTarget'],
                    'defaultKey': '',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.changeTarget();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-privateMiniMap': {
                    'label': h['hk-privateMiniMap'],
                    'defaultKey': '',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.setPrivateMiniMap();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-showQuest': {
                    'label': h['hk-showQuest'],
                    'defaultKey': '',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.setShowQuest();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-bots-split': {
                    'label': h['hk-bots-split'],
                    'defaultKey': ',',
                    'keyDown': function() {
                        if (window.userBots.startedBots && window.userBots.isAlive) window.connectionBots.send(new Uint8Array([2]).buffer);
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-bots-feed': {
                    'label': h['hk-bots-feed'],
                    'defaultKey': '.',
                    'keyDown': function() {
                        if (window.userBots.startedBots && window.userBots.isAlive) window.connectionBots.send(new Uint8Array([3]).buffer)
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-bots-ai': {
                    'label': h['hk-bots-ai'],
                    'defaultKey': '/',
                    'keyDown': function() {
                        if (window.userBots.startedBots && window.userBots.isAlive) {
                            if (!window.bots.ai) {
                                document.getElementById('botsAI').style.color = '#00C02E'
                                document.getElementById('botsAI').innerText = 'Enabled'
                                window.bots.ai = true
                                window.connectionBots.send(new Uint8Array([4, Number(window.bots.ai)]).buffer)
                            } else {
                                document.getElementById('botsAI').style.color = '#DA0A00'
                                document.getElementById('botsAI').innerText = 'Disabled'
                                window.bots.ai = false
                                window.connectionBots.send(new Uint8Array([4, Number(window.bots.ai)]).buffer)
                            }
                        }
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-comm1': {
                    'label': c['comm1'],
                    'defaultKey': '1',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(1);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm2': {
                    'label': c['comm2'],
                    'defaultKey': '2',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(2);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm3': {
                    'label': c['comm3'],
                    'defaultKey': '3',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(3);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm4': {
                    'label': c['comm4'],
                    'defaultKey': '4',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(4);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm5': {
                    'label': c['comm5'],
                    'defaultKey': '5',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(5);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm6': {
                    'label': c['comm6'],
                    'defaultKey': '6',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(6);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm7': {
                    'label': c['comm7'],
                    'defaultKey': '7',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(7);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm8': {
                    'label': c['comm8'],
                    'defaultKey': '8',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(8);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm9': {
                    'label': c['comm9'],
                    'defaultKey': '9',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(9);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm0': {
                    'label': c['comm0'],
                    'defaultKey': '0',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(0);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm10': {
                    'label': c['comm10'],
                    'defaultKey': 'MOUSE WHEEL',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(10);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm11': {
                    'label': c['comm11'],
                    'defaultKey': 'LEFT',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(11);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm12': {
                    'label': c['comm12'],
                    'defaultKey': 'UP',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(12);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm13': {
                    'label': c['comm13'],
                    'defaultKey': 'RIGHT',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(13);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm14': {
                    'label': c['comm14'],
                    'defaultKey': 'DOWN',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(14);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm15': {
                    'label': c['comm15'],
                    'defaultKey': 'CTRL+1',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(15);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm16': {
                    'label': c['comm16'],
                    'defaultKey': 'CTRL+2',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(16);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm17': {
                    'label': c['comm17'],
                    'defaultKey': 'CTRL+3',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(17);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm18': {
                    'label': c['comm18'],
                    'defaultKey': 'CTRL+4',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(18);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm19': {
                    'label': c['comm19'],
                    'defaultKey': 'CTRL+5',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(19);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm20': {
                    'label': c['comm20'],
                    'defaultKey': 'CTRL+7',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(20);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm21': {
                    'label': c['comm21'],
                    'defaultKey': 'CTRL+8',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(21);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm22': {
                    'label': c['comm22'],
                    'defaultKey': 'CTRL+9',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(22);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm23': {
                    'label': c['comm23'],
                    'defaultKey': 'CTRL+0',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(23);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm24': {
                    'label': c['comm24'],
                    'defaultKey': 'CTRL+Z',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(24);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm25': {
                    'label': c['comm25'],
                    'defaultKey': 'CTRL+X',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(25);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm26': {
                    'label': c['comm26'],
                    'defaultKey': 'CTRL+Q',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(26);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm27': {
                    'label': c['comm27'],
                    'defaultKey': 'CTRL+LM',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(27);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm28': {
                    'label': c['comm28'],
                    'defaultKey': 'CTRL+B',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(28);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm29': {
                    'label': c['comm29'],
                    'defaultKey': 'CTRL+L',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(29);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm30': {
                    'label': c['comm30'],
                    'defaultKey': 'CTRL+D',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer.sendCommand(30);
                    },
                    'keyUp': null,
                    'type': 'command'
                }
            },
            lastkeys = {
                'lastPressedKey': '',
                'lastKeyId': '',
                'defaultMessageKey': 'ENTER',
                'inputClassName': 'custom-key-in form-control input-sm',
                'loadDefaultHotkeys': function() {
                    for (var t in ogario1Hotkeys = {}, ogario11Hotkeys) ogario11Hotkeys.hasOwnProperty(t) && (ogario1Hotkeys[ogario11Hotkeys[t].defaultKey] = t);
                    ogario1Hotkeys['spec-messageKey'] = this.defaultMessageKey;
                },
                'loadHotkeys': function() {
                    null !== window.localStorage.getItem('ogarioHotkeys') ? ogario1Hotkeys = JSON.parse(window.localStorage.getItem('ogarioHotkeys')) : this.loadDefaultHotkeys(), null !== window.localStorage.getItem('ogarioCommands') && (c = JSON.parse(window.localStorage.getItem('ogarioCommands')));
                },
                'saveHotkeys': function() {
                    window.localStorage.setItem('ogarioHotkeys', JSON.stringify(ogario1Hotkeys)), this.saveCommands();
                },
                'saveCommands': function() {
                    $('#hotkeys .command-in').each(function() {
                        var t = $(this),
                            e = t.attr('id');
                        c.hasOwnProperty(e) && (c[e] = t.val());
                    }), window.localStorage.setItem('ogarioCommands', JSON.stringify(c));
                },
                'resetHotkeys': function() {
                    this.loadDefaultHotkeys(), $('#hotkeys-cfg .custom-key-in').each(function() {
                        var t = $(this).attr('id');
                        ogario11Hotkeys[t] && $(this).val(ogario11Hotkeys[t].defaultKey);
                    });
                },
                'setHotkeysMenu': function() {
                    var t = this;
                    for (var e in $('body').append('<div id=\"hotkeys\"><div id=\"hotkeys-menu\"><button id=\"reset-hotkeys\" class=\"btn btn-primary\">' + h.restoreSettings + '</button> <button id=\"save-hotkeys\" class=\"btn btn-success\">' + h.saveSett + '</button> <button id=\"close-hotkeys\" class=\"btn btn-danger\">' + h['close'] + '</button></div><div id=\"hotkeys-cfg\"></div><div id=\"hotkeys-inst\"><ul><li>' + h['hk-inst-assign'] + '</li><li>' + h['hk-inst-delete'] + '</li><li>' + h['hk-inst-keys'] + '</li></ul></div></div>'), ogario11Hotkeys)
                        if (ogario11Hotkeys.hasOwnProperty(e)) {
                            var i = ogario11Hotkeys[e],
                                o = '';
                            for (var a in ogario1Hotkeys)
                                if (ogario1Hotkeys.hasOwnProperty(a) && ogario1Hotkeys[a] === e) {
                                    o = a;
                                    break;
                                } if ('hk-switchServerMode' === e && ogarminimapdrawer && !ogarminimapdrawer.privateIP) continue;
                            if ('command' === i.type) {
                                var n = e.replace('hk-', '');
                                $('#hotkeys-cfg').append('<div class=\"row\"><div class=\"key-label\"><input id=\"' + n + '\" class=\"command-in form-control input-sm\" value=\"' + c[n] + '\" maxlength=\"80\" /></div><div class=\"default-key\">' + i.defaultKey + '</div><div class=\"custom-key\"><input id=\"' + e + '\" class=\"custom-key-in form-control input-sm\" value=\"' + o + '\" /></div></div>');
                            } else $('#hotkeys-cfg').append('<div class=\"row\"><div class=\"key-label\">' + i.label + '</div><div class=\"default-key\">' + i.defaultKey + '</div><div class=\"custom-key\"><input id=\"' + e + '\" class=\"custom-key-in form-control input-sm\" value=\"' + o + '\" /></div></div>');
                        }
                    $(document).on('click', '#reset-hotkeys', function(t) {
                            t.preventDefault();
                            lastkeys.resetHotkeys();
                        }),
                        $(document).on('click', '#save-hotkeys', function(t) {
                            t.preventDefault();
                            lastkeys.saveHotkeys();
                            $('#hotkeys').fadeOut(500);
                        }),
                        $(document).on('click', '#close-hotkeys', function(t) {
                            t.preventDefault();
                            $('#hotkeys').fadeOut(500);
                        }),
                        $(document).on('click', '.hotkeys-link', function(t) {
                            $('#hotkeys').fadeIn(500);
                            $('#hotkeys-cfg').perfectScrollbar('update');
                            ogarcommando1();
                        }),
                        $('#hotkeys-cfg').perfectScrollbar(),
                        hudsetter && hudsetter.setMenuBg();
                },
                'getPressedKey': function(t) {
                    var e = '',
                        i = '';
                    switch (t['ctrlKey'] || 17 == t.keyCode ? e = 'CTRL' : (t.altKey || 18 == t.keyCode) && (e = 'ALT'), t.keyCode) {
                        case 9:
                            i = 'TAB';
                            break;
                        case 13:
                            i = 'ENTER';
                            break;
                        case 16:
                            i = 'SHIFT';
                            break;
                        case 17:
                        case 18:
                            break;
                        case 27:
                            i = 'ESC';
                            break;
                        case 32:
                            i = 'SPACE';
                            break;
                        case 37:
                            i = 'LEFT';
                            break;
                        case 38:
                            i = 'UP';
                            break;
                        case 39:
                            i = 'RIGHT';
                            break;
                        case 40:
                            i = 'DOWN';
                            break;
                        case 46:
                            i = 'DEL';
                            break;
                        case 61:
                        case 187:
                            i = '=';
                            break;
                        case 192:
                            i = 'TILDE';
                            break;
                        default:
                            i = String.fromCharCode(t.keyCode);
                    }
                    return '' !== e ? '' !== i ? e + '+' + i : e : i;
                },
                'deleteHotkey': function(t, e) {
                    delete ogario1Hotkeys[t];
                    $('#' + e).val('');
                },
                'setDefaultHotkey': function(t) {
                    var e = false;
                    return ogario11Hotkeys[t] && !ogario1Hotkeys.hasOwnProperty(ogario11Hotkeys[t].defaultKey) ? (e = ogario11Hotkeys[t].defaultKey, ogario1Hotkeys[e] = t, e) : e;
                },
                'setHotkey': function(t, e) {
                    if (e && (this.lastPressedKey !== t || this.lastKeyId !== e)) {
                        var i = $('#' + e).val();
                        if (this.deleteHotkey(i, e), 'DEL' !== t) {
                            if (ogario1Hotkeys[t] && ogario1Hotkeys[t] !== e) {
                                var o = ogario1Hotkeys[t],
                                    a = this.setDefaultHotkey(o);
                                a ? (ogario1Hotkeys[a] = o, $('#' + o).val(a)) : this.deleteHotkey(t, o);
                            }
                            ogario1Hotkeys[t] = e,
                                $('#' + e).val(t);
                            if ('hk-chatMessage' === e) {
                                ogario1Hotkeys['spec-messageKey'] = t
                            }
                            this.lastPressedKey = t;
                            this.lastKeyId = e;
                        }
                    }
                },
                'init': function() {
                    this.loadHotkeys();
                    this.setHotkeysMenu();
                }
            };
        window.legendmod2 = ogarfooddrawer; //look at this
        window.legendmod6 = lastkeys;

        function ogarjoiner(t) {
            if (window.history && window.history.replaceState) {
                window.history.replaceState({}, window.document.title, t);
            }
        }

        function ogarassembler() {
            window.onkeydown = function(t) {
                81 == t.keyCode && window.core.specialOn && window.core.specialOn();
            }, window.onkeyup = function(t) {};
        }

        function ogarhusettings() {
            var t = window.innerWidth;
            var o = window.innerHeight;
            var a = $("#helloContainer");
            var n = a.innerHeight();
            if (n > 0) {
                i.menuHeight = n;
            } else {
                n = i.menuHeight || 618;
            }
            var r = Math.min(1, o / n);
            var l = n * r;
            var h = Math.round(o / 2 - 0.5 * l);
            var c = "translate(-50%, 0%) scale(" + r + ")";
            a.css("transform", c), a.css("-ms-transform", c), a.css("-webkit-transform", c), a.css("top", h + "px"), i.innerW = t, i.innerH = o;

        }

        function ogarcommando1() {
            ogarminimapdrawer.protocolMode || (window.onkeydown = function(t) {});
        }
        document.onkeydown = function(t) {
            var e = lastkeys.getPressedKey(t);
            if (('INPUT' !== t.target.tagName || t.target.className === lastkeys.inputClassName || e === ogario1Hotkeys['spec-messageKey']) && '' !== e && !ogarioefaultHotkeys[e]) {
                if (ogarioefaultHotkeys[e] = true, 'ESC' === e) return t.preventDefault(), void(ogarminimapdrawer && ogarminimapdrawer.showMenu());
                if (t.target.className === lastkeys.inputClassName) return t.preventDefault(), void lastkeys.setHotkey(e, t.target.id);
                if (ogario1Hotkeys[e]) {
                    t.preventDefault();
                    var i = ogario1Hotkeys[e];
                    '' !== i && ogario11Hotkeys[i] && ogario11Hotkeys[i].keyDown && ogario11Hotkeys[i].keyDown();
                }
            }
        }
        document.onkeyup = function(t) {
            var e = lastkeys.getPressedKey(t);
            if ('' !== e) {
                if (ogario1Hotkeys[e]) {
                    var i = ogario1Hotkeys[e];
                    '' !== i && ogario11Hotkeys[i] && ogario11Hotkeys[i].keyUp && ogario11Hotkeys[i].keyUp();
                }
                ogarioefaultHotkeys[e] = false;
            }
        }
        window.onmousedown = function(t) {
            if (!$("#overlays").is(":visible")) {
                if (2 == t.which) {
                    t.preventDefault();
                    if (ogarminimapdrawer) {
                        ogarminimapdrawer.sendCommand(10);
                    }
                } else {
                    if (defaultmapsettings["mouseSplit"] && (1 == t.which && !defaultmapsettings.mouseInvert || 3 == t.which && defaultmapsettings.mouseInvert)) {
                        t.preventDefault();
                        if (ogarminimapdrawer) {
                            ogarminimapdrawer.split();
                        }
                    }
                    if (defaultmapsettings.mouseFeed && (3 == t.which && !defaultmapsettings.mouseInvert || 1 == t.which && defaultmapsettings.mouseInvert)) {
                        t.preventDefault();
                        if (ogarminimapdrawer) {
                            ogarminimapdrawer.macroFeed(true);
                        }
                    }
                }
            }
        }
        window.onmouseup = function(t) {
            if (defaultmapsettings.mouseFeed && (3 == t.which && !defaultmapsettings.mouseInvert || 1 == t.which && defaultmapsettings.mouseInvert) && ogarminimapdrawer) {
                ogarminimapdrawer.macroFeed(false);
            }
        };
        window.onbeforeunload = function(t) {
            return i.play ? h.exit : void 0;
        };
        i = LM;
        LMbuffer = t('buffer')['Buffer'];
        LZ4 = t('lz4');
        if ('/legendmod' === window.location.pathname) {
            ogarjoiner('/' + window.location.hash);
        }
        window.onresize = function() {
            ogarfooddrawer.resizeCanvas();
            ogarhusettings();
        };
        ogarassembler();

        function Node(lsb, msb) {
            this.view = lsb;
            this.offset = msb;
            this.contentType = 1;
            this.uncompressedSize = 0;
            this.setContentType = function() {
                this.contentType = this.readUint32();
            };
            this.setUncompressedSize = function() {
                this.uncompressedSize = this.readUint32();
            };
            this.compareBytesGt = function(first, second) {
                var stripTerrain = first < 0;
                var coast = second < 0;
                if (stripTerrain != coast) {
                    return stripTerrain;
                }
                return first > second;
            };
            this.skipByte = function() {
                var checkvarreadByte = this.readByte();
                if (checkvarreadByte < 128) {
                    return;
                }
                this.skipByte();
            };
            this.readByte = function() {
                return this.view.getUint8(this.offset++);
            };
            this.readUint32 = function() {
                var result = 0;
                var shift = 0;
                for (; !![];) {
                    var digit = this.readByte();
                    if (this.compareBytesGt(32, shift)) {
                        if (digit >= 128) {
                            result = result | (digit & 127) << shift;
                        } else {
                            result = result | digit << shift;
                            break;
                        }
                    } else {
                        this.skipByte();
                        break;
                    }
                    shift = shift + 7;
                }
                return result;
            };
            this.readFlag = function() {
                return this.readUint32() >>> 3;
            }
        }
        window.core = {
            'connect': function(t) {
                LM.connect(t);
                //LM.connect(t); //for multibox with new Protocol and Client
            },
            'disconnect': function() {},
            'sendNick': function(t) {
                LM.sendNick(t);
            },
            'sendSpectate': function() {
                LM.sendSpectate();
            },
            'eject': function() {
                LM.sendEject();
                window.lastejected = true;
            },
            'split': function() {
                LM.sendSplit();

            },
            'specialOn': function() {
                LM.sendFreeSpectate();
            },
            'specialOff': function() {
                LM.sendFreeSpectate();
            },
            'sendFbToken': function(t) {
                LM.sendFbToken(t);
            },
            'sendGplusToken': function(t) {
                LM.sendGplusToken(t);
            },
            'recaptchaHandlerResponse': function(t) {
                if (window.botscaptcha == true) {
                    setTimeout(function() {
                        core.recaptchaBotResponse(t);
                    }, 100);
                } else {
                    core.recaptchaResponse(t);
                }
            },
            'recaptchaResponse': function(t) {
                window.lastRecaptchaResponseToken = t;
                LM.sendRecaptcha(t);
            },
            'recaptchaBotResponse': function(t) {
                window.lastRecaptchaResponseToken = t;
                window.botscaptcha = false;
                //toastr["info"]('Captcha token sent to node.js', t)
                toastr["info"]('<b>[SERVER]:</b> Thank you for solving Captcha for bots')
                window.connectionBots.send(window.buffers.captchatoken(t))
            },
            'setClientVersion': function(t, e) {
                LM.setClientVersion(t, e);
            },
            "proxyMobileData": function(arr = []) {
                if (!Array.isArray(arr)) {
                    console.log("[Legend mod Express] ProxyMobileData ERROR: Array data required.");
                    return;
                }
                if (arr[0] == 8) {
                    arr.unshift(102);
                }
                arr = new Uint8Array(arr);
                LM["sendMessage"](new DataView(arr["buffer"]));
            },
            'registerSkin': function(a, b, c, d) {
                window.customskinsname = a;
                window.customskinsurl = c;
            }
        };
        window.master.getClientVersion();
        hudsetter.init();
        ogarminimapdrawer.init();
        ogarminimapdrawer.getDefaultSettings();
        ogarminimapdrawer.connect();
        lastkeys.init();
        LM.init();
        ogarfooddrawer.init();
        window.master.init();
        ogarhusettings();
        setGUIEvents();
    })(window.ogario);
}

function setGUIEvents() {
    document.getElementById('botsAmount').addEventListener('keypress', e => {
        e.preventDefault()
    })
    var storedbotsRemoteIP = localStorage.getItem("localstoredBotsRemoteIP");
    if (storedbotsRemoteIP == null || storedbotsRemoteIP == "") {
        storedbotsRemoteIP = "ws://localhost:1337";
    }	
    var captchaSpeed = localStorage.getItem("captchaSpeed");
	$('#captchaSpeed').val(captchaSpeed)
    window.bots.remoteIP = storedbotsRemoteIP
    window.SERVER_HOST = storedbotsRemoteIP;
    $('#botsRemoteIP').val(storedbotsRemoteIP)
    var storedbotsname = localStorage.getItem("localStoredBotsName");
    if (storedbotsname == null || storedbotsname == "") {
        storedbotsname = "Legendmod|ml";
    }
    window.bots.nameLM = storedbotsname;
    $('#botsNameLM').val(storedbotsname)
    var storedbotsamount = localStorage.getItem("localStoredBotsAmount");
    if (storedbotsamount == null || storedbotsamount == "") {
        storedbotsamount = 50;

    }
    window.bots.amount = storedbotsamount;
    $('#botsAmount').val(storedbotsamount)
    document.getElementById('captchaSpeed').addEventListener('change', function() {
        localStorage.setItem('captchaSpeed', $('#captchaSpeed').val())
    })	
    document.getElementById('botsRemoteIP').addEventListener('change', function() {
        window.bots.remoteIP = this.value
        localStorage.setItem('localstoredBotsRemoteIP', window.bots.remoteIP)
        window.SERVER_HOST = window.bots.remoteIP
    })
    document.getElementById('botsNameLM').addEventListener('change', function() {
        window.bots.nameLM = this.value
        localStorage.setItem('localStoredBotsName', window.bots.nameLM)
    })
    document.getElementById('botsAmount').addEventListener('change', function() {
        window.bots.amount = Number(this.value)
        localStorage.setItem('localStoredBotsAmount', window.bots.amount)
    })
    document.getElementById('connectBots').addEventListener('click', () => {
        if ($('#pushCaptchaBots').is(':checked')) {
            window.connectionBots.send(window.buffers.captchabots((window.bots.amount).toString()))
            //toastr["info"]('<b>[SERVER]:</b> Bot pushed')
        } else {
            if (!window.connectionBots.ws || window.connectionBots.ws.readyState !== WebSocket.OPEN) window.connectionBots.connect()
        }
    })
    document.getElementById('startBots').addEventListener('click', () => {
        if (legendmod.ws && window.EnvConfig.configVersion && window.master.clientVersion && !window.userBots.startedBots) {
            if (legendmod.gameMode == ":party" || window.AdminRights == 1 || window.IamNeo == true) {
                if (window.bots.amount <= 199) {
                    if (window.bots.nameLM && window.bots.amount && window.getComputedStyle(document.getElementsByClassName('btn-login-play')[0]).getPropertyValue('display') === 'none') {
                        //window.connectionBots.send(window.buffers.startBots(legendmod.ws, window.gameBots.protocolVersion, window.gameBots.clientVersion, window.userBots.isAlive, window.unescape(window.encodeURIComponent(window.bots.nameLM)), window.bots.amount))
                        window.connectionBots.send(window.buffers.startBots(legendmod.ws, window.gameBots.protocolVersion, window.gameBots.clientVersion, window.userBots.isAlive, window.unescape(window.encodeURIComponent(window.bots.nameLM)), window.bots.amount))
                        //window.connectionBots.send(window.buffers.startBots(legendmod.ws, window.gameBots.protocolVersion, window.gameBots.clientVersion, window.userBots.isAlive, window.botsSpawncode[window.botsSpawncodeNum], window.bots.amount))
						if (window.LatestBotsVersion) {
                            $('#handleCaptchaBotsAreaSettings').show();
                        }
                    } else toastr["info"]('<b>[SERVER]:</b> Bots name, amount and user login are required before starting the bots')
                } else toastr["info"]('<b>[SERVER]:</b> Bots Max amount is 199')
            } else {
                toastr["info"]('<b>[SERVER]:</b> Party bots only available for Party mode')
            }
        }
    })
    document.getElementById('captchaBots').addEventListener('click', () => {
		toastr["info"]('<b>[SERVER]:</b> 100000 captcha tokens requested, some lag from proccessing will be created. <br><b>If captcha tokens stop, create again tokens</b>');
		window.RequestedTokens=100000;
		legendmod.sendTokenForBots();
		//legendmod.sendTimeOutTokenForBots();
    })	
    document.getElementById('stopBots').addEventListener('click', () => {
        if (window.userBots.startedBots) window.connectionBots.send(new Uint8Array([1]).buffer)
    })
    $('#handleCaptchaBots').click(function() {
        if (this.checked) {
            window.connectionBots.send(new Uint8Array([11]).buffer)
            $('#solveCaptchaBots').removeAttr("disabled")
            $('#pushCaptchaBots').removeAttr("disabled")
        } else {
            window.connectionBots.send(new Uint8Array([12]).buffer)
            $('#solveCaptchaBots').prop('checked', false)
            $('#pushCaptchaBots').prop('checked', false)
            $('#solveCaptchaBots').attr("disabled", true);
            $('#pushCaptchaBots').attr("disabled", true);
            document.getElementById('connectBots').innerText = 'Connect'
            document.getElementById('connectBots').style.color = 'white'

        }
    })
    $('#solveCaptchaBots').click(function() {
        if (this.checked) {
            window.connectionBots.send(new Uint8Array([13]).buffer)
        } else {
            window.connectionBots.send(new Uint8Array([14]).buffer)
        }
    })
    $('#pushCaptchaBots').click(function() {
        if (this.checked) {
            document.getElementById('connectBots').innerText = 'Push a captcha bot'
            document.getElementById('connectBots').style.color = 'yellow'
            window.connectionBots.send(new Uint8Array([15]).buffer)
        } else {
            window.connectionBots.send(new Uint8Array([16]).buffer)
            document.getElementById('connectBots').innerText = 'Connect'
            document.getElementById('connectBots').style.color = 'white'

        }
    })
}

			window.requestCaptchaV2 = function(aa) {
					grecaptcha.v2mode = true;
					grecaptcha.render('recaptcha-screen', {
							'sitekey': '6LfjUBcUAAAAAF6y2yIZHgHIOO5Y3cU5osS2gbMl',
							'callback': SAO
					});
					//window.cookieCaptchaOK=true;
			}
			window.requestCaptchaV3 = function(bb) {
				grecaptcha.v2mode = false;
				grecaptcha.render('captchaWindowV3', {
						'sitekey': '6LcEt74UAAAAAIc_T6dWpsRufGCvvau5Fd7_G1tY',
						'badge': "inline",
						'size': "invisible",
						'callback': SAO						
				});
				//window.cookieCaptchaOK=true;
			}
			window.SAO = function() {
					window.cookieCaptchaOK=true;
					if (legendmod.botscaptcha){
						legendmod.botscaptcha=null;
						window.tempol = $("#captchaSpeed").val()		
						if($("#captchaSpeed").val()==null || $("#captchaSpeed").val()==""){
							window.tempol=0;
					}						
					window.tempo2 = grecaptcha.getResponse()
					setTimeout(function() {
						legendmod.sendSpawn2(window.tempo2);
						}, window.tempol*1000);
					}
					console.log("[Legend mod Express] requestCaptcha bypass v2, v3 loaded");
					window.sendTimeOutTokenBots = true;
			}
/*
var snezSocketdata;
var snezSocket = new WebSocket("wss://connect.websocket.in/3Q-SoniaSLG_453dsV?room_id=123");

snezSocket.onmessage = function(message) { 
snezSocketdata = JSON.parse(message.data); 
console.log(message.data);
}


snezSocket.send(JSON.stringify({ "command": "sendPlayerSkinURL", nick: ogarcopythelb.nick, token: legendmod3.serverToken, tag: ogarcopythelb.clanTag, skin: ogarcopythelb.skinURL, color: ogarcopythelb.color}));


*/
