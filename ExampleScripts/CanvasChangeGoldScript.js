//This code is an example of how to change the Canvas elements
//Trigger it with the below user.js

/*
// ==UserScript==
// @name			Agar.io Gold
// @namespace		agar.io/gold
// @version			1.1.1
// @description		Better than ever! Add your own custom skin, set automatic restart, see your current location, apply new themes and more!
// @match			http://agar.io/*
// @connect			agar.io
// @run-at			document-start
// @grant			GM_xmlhttpRequest
// ==/UserScript==

var javascript = "<script type='text/javascript' src='jimboy3100.github.io/ExampleScripts/CanvasChangeGoldScript.js'></script>";

function inject(page){
	var newPage = page;
   	 page = page.replace(/<script[^>]*>((?!<script)[\s\S])*?NREUM[\s\S]*?<\/script>/, "");
     page = page.replace(/<script[^>]*>((?!<script)[\s\S])*?Outstream[\s\S]*?<\/script>/, "");
   	 page = page.replace(/<script.*?src=".*?outstream\.js.*?><\/script>/, "");
   	 page = page.replace(/<script.*?src=".*?agario\.core\.js.*?><\/script>/, "");
	newPage = newPage.replace('</body>', javascript + '</body>');
	return newPage;
}

window.stop();
document.documentElement.innerHTML = null;
GM_xmlhttpRequest({
	method: 'GET',
	url: 'http://agar.io/',
	onload: function(e){
		var doc = inject(e.responseText);
		document.open();
		document.write(doc);
		document.close();
	}
});
*/



var lastCalledTime;
var lastRecord = 0;
var fps = 0;
var profile = 0;
var skins = [];
var defaultTheme = ['#000000', '#ffffff', '#ffffff', '#000000', '#ffffff'];
var currentTheme = 1;
var currentSelector = null;
var triggered = false;
var eventEject = false;

(function(){
	window.agario = {
		play: false,
		viewScale: 1,
		canvasScale: 1,
		mapSet: false,
		mapStartX: -7000,
		mapStartY: -7000,
		mapEndX: 7000,
		mapEndY: 7000,
		mapWidth: 14000,
		mapHeight: 14000,
		zoomValue: 0,
		playerNick: '',
		playerSkin: null,
		playerX: 0,
		playerY: 0,
		playerCellsSize: [],
		playerSmallestCell: 0,
		playerBiggestCell: 0,
		playerMass: 0,
		playerScore: 0,
		playerSTE: null,
		textColor: '#ffffff',
		bordersColor: '#333333',
		foodColor: '#999999',
		virusColor: '#111111',
		virusStrokeColor: '#e6e6e6',
		noSkins: false,
		noColors: false,
		noNames: false,
		showMass: false,
		textShadow: false,
		customSkins: false,
		transparentCells: false,
		hideMyName: false,
		hideMyMass: false,
		hideFood: false,
		autoHideNamesAndMass: false,
		autoHideFood: false,
		autoRestartGame: false,
		showGameStats: false,
		showIndicators: false,
		showMapBorders: false,
		showMiniMap: false,
		enableMouseControls: false,
		invertMouseControls: false,
		displayChat: false,
		disableCommands: false,
		getString: null,
		idOffset: null,
		idMemOffset: null,
		nameMemOffset: null,
		cellMemOffset: null,
		mapCoordinates: function(a, b, c, d, e, f){
			if(f - e == 24 && c - a > 14e3 && d - b > 14e3){
				this.mapSet = true;
				this.mapStartX = a;
				this.mapStartY = b;
				this.mapEndX = c;
				this.mapEndY = d;
				this.mapWidth = c - a;
				this.mapHeight = d - b;
			}
		},
		playerStats: function(){
			if(this.playerCellsSize.length){
				this.playerSmallestCell = this.playerCellsSize[0];
				this.playerBiggestCell = this.playerCellsSize[0];
				for(var i = 1; i < this.playerCellsSize.length; i++){
					if(this.playerCellsSize[i] < this.playerSmallestCell){
						this.playerSmallestCell = this.playerCellsSize[i];
					}
					else if(this.playerCellsSize[i] > this.playerBiggestCell){
						this.playerBiggestCell = this.playerCellsSize[i];
					}
				}
				if(this.playerMass > this.playerScore || !this.playerScore){
					this.playerScore = this.playerMass;
				}
				var mass = this.playerBiggestCell;
				this.playerSTE = mass > 35? Math.floor((mass < 1e3? 0.375: 0.35) * mass): null;
			}
		},
		calculateMass: function(size){
			return Math.floor(size * size / 100);
		},
		cellsInfo: function(context, str, x, y, size, offset){
			var fontSize = (offset? 0.1: 0.2) * size;
			var margin = offset? 0.2 * size: null;
			context.font = 'bold ' + fontSize + 'px Segoe UI';
			context.textAlign = 'center';
			context.textBaseline = 'middle';
			if(this.textShadow){
				context.shadowColor = '#000000';
				context.shadowBlur = 1;
			}
			context.globalAlpha = 1;
			context.fillStyle = this.textColor;
			context._fillText(str, x, y + margin);
		},
		hideCellsInfo: function(size){
			return size < 1e3 && this.viewScale < 0.5 && size < 25 / this.viewScale;
		},
		setColorIndicator: function(mass){
			var rate = mass / this.playerBiggestCell;
			return rate < 2.5? rate < 1.25? rate < 0.75? '#00ff00': '#ffffff': '#ffff00': '#ff0000';
		}
	};
	CanvasRenderingContext2D.prototype._fillRect = CanvasRenderingContext2D.prototype.fillRect;
	CanvasRenderingContext2D.prototype.fillRect = function(){};
	CanvasRenderingContext2D.prototype._strokeRect = CanvasRenderingContext2D.prototype.strokeRect;
	CanvasRenderingContext2D.prototype.strokeRect = function(){};
	CanvasRenderingContext2D.prototype._fillText = CanvasRenderingContext2D.prototype.fillText;
	CanvasRenderingContext2D.prototype.fillText = function(){};
	CanvasRenderingContext2D.prototype._strokeText = CanvasRenderingContext2D.prototype.strokeText;
	CanvasRenderingContext2D.prototype.strokeText = function(){};
	CanvasRenderingContext2D.prototype._fillCircle = function(x, y, r){
		this.beginPath();
		this.arc(x, y, r, 0, 2 * Math.PI);
		this.fill();
	};
	CanvasRenderingContext2D.prototype._strokeCircle = function(x, y, r){
		this.beginPath();
		this.arc(x, y, r, 0, 2 * Math.PI);
		this.stroke();
	};
	CanvasRenderingContext2D.prototype._fillStar = function(x, y, outerRadius, innerRadius, spikes){
		var angle = 0;
		var cx = x + outerRadius;
		var cy = y;
		var arc = Math.PI / spikes;
		this.beginPath();
		this.moveTo(cx, cy);
		for(var i = 0; i < spikes; i++){
			angle += arc;
			cx = x + innerRadius * Math.cos(angle);
			cy = y + innerRadius * Math.sin(angle);
			this.lineTo(cx, cy);
			angle += arc;
			cx = x + outerRadius * Math.cos(angle);
			cy = y + outerRadius * Math.sin(angle);
			this.lineTo(cx, cy);
		}
		this.fill();
	};
})();

function loadContent(){
	var mainDialog = {
		id: ['nickDialog', 'skinsDialog', 'partyDialog'],
		name: ['Agar.io Gold', 'Skins', 'Party']
	};
	var panelDialog = {
		id: ['profileDialog', 'settingsDialog', 'commandsDialog', 'themeDialog'],
		name: ['Profile', 'Settings', 'Commands', 'Theme']
	};
	var icons = ['person', 'settings', 'keyboard', 'color_lens'];
	var region = {
		value: ['US-Atlanta', 'BR-Brazil', 'EU-London', 'RU-Russia', 'TK-Turkey', 'JP-Tokyo', 'CN-China', 'SG-Singapore'],
		name: ['USA', 'Brazil', 'England', 'Russia', 'Turkey', 'Japan', 'China', 'Singapore']
	};
	var settings = {
		id: ['noSkins', 'noColors', 'noNames', 'showMass', 'textShadow', 'customSkins', 'transparentCells', 'hideMyName', 'hideMyMass', 'hideFood', 'autoHideNamesAndMass', 'autoHideFood', 'autoRestartGame', 'showGameStats', 'showIndicators', 'showMapBorders', 'showMiniMap', 'enableMouseControls', 'invertMouseControls', 'displayChat', 'disableCommands'],
		name: ['No skins', 'No colors', 'No names', 'Show mass', 'Text shadow', 'Custom skins', 'Transparent cells', 'Hide my name', 'Hide my mass', 'Hide food', 'Auto hide names and mass', 'Auto hide food', 'Auto restart game', 'Show game stats', 'Show indicators', 'Show map borders', 'Show mini map', 'Enable mouse controls', 'Invert mouse controls', 'Display chat', 'Disable commands']
	};
	var commands = {
		data: ['', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		name: ['New game', 'Stop movement', 'Double split', 'Split into 16', 'Eject mass', 'Toggle skins', 'Toggle colors', 'Toggle names', 'Toggle mass', 'Toggle food', 'Toggle indicators', 'Toggle map borders', 'Toggle mini map', 'Toggle chat']
	};
	var theme = {
		data: ['#f2fbff #bec7c9 #ff6400 #1aff0e #18e90f', '#000000 #333333 #999999 #111111 #e6e6e6'],
		name: ['Classic', 'Gold']
	};
	var color = {
		id: ['backgroundColor', 'bordersColor', 'foodColor', 'virusColor', 'virusStrokeColor'],
		name: ['Background color', 'Borders color', 'Food color', 'Virus color', 'Virus stroke color']
	};
	jQuery.fx.off = true;
	$(document.documentElement.childNodes).each(function(){
		$(this.childNodes).each(function(){
			if(this.nodeName != 'SCRIPT'){
				this.remove();
			}
		});
	});
	//	<title>
	document.title = 'Agar.io Gold';
	//	</title>
	//	<style>
	var newElement = document.createElement('style');
	newElement.type = 'text/css';
	$(newElement).append("*{margin: 0; padding: 0; font-family: Calibri; font-size: 18px; color: #666666; text-align: left;} body{overflow: hidden;} #canvas{position: absolute; top: 0; left: 0; background-color: #000000;} #stats{position: absolute; display: none; left: 8px; bottom: 8px;} #miniMap{position: absolute; display: none; bottom: 8px; right: 8px;} .overlay{cursor: default; position: absolute; display: none; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.4);} #sidePanel{z-index: 1; position: absolute; display: none; top: 0; left: 0; height: 100%; background-color: rgba(0, 0, 0, 0.8); text-align: center;} #menu{position: relative; top: 50%; margin-top: -221px; width: 88px; text-align: center;} .icons{position: relative; margin-top: 14px; padding: 14px;} .icons:hover{background-color: rgba(255, 255, 255, 0.2);} .dialog{padding: 14px; background-color: #ffffff; border-radius: 14px; font-weight: bold; text-align: center;} #nickDialog{position: absolute; top: 50%; right: 50%; margin: -242px -361px; width: 480px; height: 398px; padding-top: 72px; font-size: 72px;} span{font-size: inherit; font-weight: inherit; color: inherit;} .container{position: relative; overflow: hidden; font-weight: normal; text-align: center;} input:focus, button:focus, select:focus{outline: none;} .form-control{position: relative; padding: 6px;} #nick{width: 224px; border: 2px solid #999999; border-radius: 8px; font-size: 24px;} button{background: none; border: none; color: inherit;} .btn{cursor: pointer; position: relative; padding: 6px; font-weight: bold; text-align: center;} #play-btn{width: 96px; height: 60px; background-color: #ff7400; border: 2px solid rgba(0, 0, 0, 0.1); border-radius: 8px;} .play{position: absolute; top: 50%; left: 50%; margin: -18px;} #skinsDialog{position: absolute; top: 50%; left: 50%; margin: -242px -361px; width: 180px; font-size: 24px;} #preview{position: relative; left: 50%; margin-left: -50px; width: 100px; height: 100px; background-image: url('http://i.imgur.com/oLI4wVW.png'); background-position: center; background-size: cover; border-radius: 100px;} #previous{position: absolute; left: 0; bottom: 0;} #next{position: absolute; bottom: 0; right: 0;} #skinURL{width: 166px; border: 1px solid #999999; border-radius: 4px;} #partyDialog{position: absolute; left: 50%; bottom: 50%; margin: -242px -361px; width: 180px; font-size: 24px;} #region{position: relative; width: 180px; height: 36px; padding: 2px; border: 1px solid #999999; border-radius: 4px;} #joinPartyToken{float: left; width: 131px; border: 1px solid #999999; border-right: none; border-radius: 4px 0 0 4px;} #create-party-btn{float: left; width: 36px; height: 36px; border: 1px solid #999999; border-left: none; border-radius: 0 4px 4px 0;} .renew{position: absolute; top: 50%; left: 50%; margin: -12px;} #join-party-btn{width: 96px; background-color: #0074ff; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 4px; color: #ffffff;} #join-party-btn:hover{background-color: #0069e6; color: #e6e6e6;} .overlay-secondary{z-index: 2;} #socialLoginDialog{position: absolute; top: 50%; left: 50%; margin: -100px -194px; width: 360px; font-size: 36px;} .btn-login{position: relative; width: 360px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 4px;} #fbLogin{padding: 6px; background-color: #47639e; color: #ffffff;} #fbLogin:hover{background-color: #40598f; color: #e6e6e6;} #gplusLogin{padding: 6px; background-color: #dd4f43; color: #ffffff;} #gplusLogin:hover{background-color: #c7473c; color: #e6e6e6;} #profileDialog, #settingsDialog, #commandsDialog, #themeDialog{position: absolute; top: 50%; left: 50%; margin: -254px -314px; width: 600px; height: 480px; font-size: 36px;} .close{position: absolute; top: 6px; right: 6px;} .agario-wallet{position: relative; display: inline; float: left; width: 272px; padding: 14px; font-size: 24px; font-weight: bold; text-align: center;} .agario-wallet-container{position: relative; overflow: hidden; font-weight: normal; text-align: center;} .agario-profile-picture{border: 2px solid #999999; border-radius: 8px;} .container-scroll{overflow: auto;} ::-webkit-scrollbar{width: 6px; background-color: #e6e6e6; border-radius: 6px;} ::-webkit-scrollbar-thumb{background-color: #cccccc; border-radius: 6px;} .ground{position: relative; margin: 4px; padding: 14px; font-weight: normal;} .ground:hover{background-color: #e6e6e6;} .switch-off{position: absolute; top: 14px; right: 14px; width: 42px; height: 22px; background-color: #cccccc; border-radius: 22px;} .switch-off:after{content: ''; position: relative; float: left; margin: 1px; width: 20px; height: 20px; background-color: #ffffff; border-radius: 20px;} .switch-on{position: absolute; top: 14px; right: 14px; width: 42px; height: 22px; background-color: #8ed559; border-radius: 22px;} .switch-on:after{content: ''; position: relative; float: right; margin: 1px; width: 20px; height: 20px; background-color: #ffffff; border-radius: 20px;} .data-log{cursor: default; position: absolute; background: none; border: none;} .key{top: 14px; right: 14px; width: 22px; color: #a9a9a9; text-align: center;} .edit{position: absolute; top: 50%; right: 14px; margin-top: -9px;} #create-theme-btn{width: 600px; padding: 14px; color: #cccccc;} #create-theme-btn:hover{color: #999999;} #editDialog{position: absolute; top: 50%; left: 50%; margin: -205px -194px; width: 360px; font-size: 36px;} #themeName{position: relative; width: 240px; background: none; border: none; font-size: 36px; font-weight: bold; text-align: center;} .hex-color{top: 14px; right: 14px; width: 72px; padding-right: 28px; color: #a9a9a9;} .color-view{position: absolute; top: 14px; right: 14px; width: 20px; height: 20px; background-color: #000000; border: 1px solid rgba(0, 0, 0, 0.1);} #discard-theme-btn, #save-theme-btn{width: 180px; padding: 14px; color: #cccccc;} #discard-theme-btn:hover, #save-theme-btn:hover{color: #999999;}");
	$('head').append(newElement);
	//	</style>
	//	<style>
	newElement = document.createElement('style');
	newElement.type = 'text/css';
	$(newElement).append("@font-face{font-family: 'Material Icons'; font-style: normal; font-weight: 400; src: local('Material Icons'), local('MaterialIcons-Regular'), url('https://fonts.gstatic.com/s/materialicons/v17/2fcrYFNaTjcS6g4U3t-Y5ZjZjT5FdEJ140U2DJYC3mY.woff2') format('woff2');} .material-icons{font-family: 'Material Icons'; font-weight: normal; font-style: normal; font-size: 18px; line-height: 1; letter-spacing: normal; text-transform: none; display: inline-dialog; white-space: nowrap; word-wrap: normal; direction: ltr; -webkit-font-feature-settings: 'liga'; -webkit-font-smoothing: antialiased;} .material-icons.md-24{font-size: 24px;} .material-icons.md-36{font-size: 36px;} .material-icons.md-48{font-size: 48px;} .material-icons.md-60{font-size: 60px;} .material-icons.md-light{color: #ffffff;} .material-icons.md-dark{color: #cccccc;} .material-icons.md-dark:hover{color: #999999}");
	$('head').append(newElement);
	//	</style>
	//	<canvas id='canvas'>
	newElement = document.createElement('canvas');
	newElement.setAttribute('id', 'canvas');
	newElement.width = 0;
	newElement.height = 0;
	$('body').append(newElement);
	//	</canvas>
	//	<canvas id='stats'>
	newElement = document.createElement('canvas');
	newElement.setAttribute('id', 'stats');
	newElement.height = 28;
	$('body').append(newElement);
	//	</canvas>
	//	<canvas id='miniMap'>
	newElement = document.createElement('canvas');
	newElement.setAttribute('id', 'miniMap');
	newElement.width = 200;
	newElement.height = 200;
	$('body').append(newElement);
	//	</canvas>
	//	<div class='overlay' id='mainPanel'>
	newElement = document.createElement('div');
	newElement.setAttribute('class', 'overlay');
	newElement.setAttribute('id', 'mainPanel');
	$('body').append(newElement);
	//		<div id='sidePanel'>
	newElement = document.createElement('div');
	newElement.setAttribute('id', 'sidePanel');
	$('#mainPanel').append(newElement);
	//			<div id='menu'>
	newElement = document.createElement('div');
	newElement.setAttribute('id', 'menu');
	$('#sidePanel').append(newElement);
	for(var i = 0; i < icons.length; i++){
		//			<div class='icons'>
		newElement = document.createElement('div');
		newElement.setAttribute('class', 'icons');
		$('#menu').append(newElement);
		//				<i class='material-icons md-60 md-light'>
		newElement = document.createElement('i');
		newElement.setAttribute('class', 'material-icons md-60 md-light');
		newElement.innerHTML = icons[i];
		$('.icons').last().append(newElement);
		//				</i>
		//			</div>
	}
	//			</div>
	//		</div>
	for(i = 0; i < mainDialog.id.length; i++){
		//	<div class='dialog'>
		newElement = document.createElement('div');
		newElement.setAttribute('class', 'dialog');
		newElement.setAttribute('id', mainDialog.id[i]);
		$('#mainPanel').append(newElement);
		//		<span>
		newElement = document.createElement('span');
		newElement.innerHTML = mainDialog.name[i];
		$('.dialog').last().append(newElement);
		//		</span>
		//	</div>
	}
	//		<div class='dialog' id='nickDialog'>
	//			<div class='container'>
	newElement = document.createElement('div');
	newElement.setAttribute('class', 'container');
	newElement.style.marginTop = '28px';
	$('#nickDialog').append(newElement);
	//				<input type='text' class='form-control' id='nick'/>
	newElement = document.createElement('input');
	newElement.setAttribute('type', 'text');
	newElement.setAttribute('class', 'form-control');
	newElement.setAttribute('id', 'nick');
	newElement.placeholder = 'Nickname';
	newElement.maxLength = 15;
	$('.container').last().append(newElement);
	//			</div>
	//			<div class='container'>
	newElement = document.createElement('div');
	newElement.setAttribute('class', 'container');
	newElement.style.marginTop = '28px';
	$('#nickDialog').append(newElement);
	//				<button class='btn btn-needs-server' id='play-btn'>
	newElement = document.createElement('button');
	newElement.type = 'submit';
	newElement.setAttribute('class', 'btn btn-needs-server');
	newElement.setAttribute('id', 'play-btn');
	newElement.disabled = true;
	$('.container').last().append(newElement);
	//					<i class='material-icons md-36 md-light play'>
	newElement = document.createElement('i');
	newElement.setAttribute('class', 'material-icons md-36 md-light play');
	newElement.innerHTML = 'play_arrow';
	$('#play-btn').append(newElement);
	//					</i>
	//				</button>
	//			</div>
	//			<div class='container'>
	newElement = document.createElement('div');
	newElement.setAttribute('class', 'container');
	newElement.style.marginTop = '22px';
	$('#nickDialog').append(newElement);
	//				<span>
	newElement = document.createElement('span');
	newElement.innerHTML = 'Move your mouse to control your cell<br/>Press <b>Space</b> to split<br/>Press <b>W</b> to eject some mass';
	$('.container').last().append(newElement);
	//				</span>
	//			</div>
	//		</div>
	//		<div class='dialog' id='skinsDialog'>
	//			<div class='container'>
	newElement = document.createElement('div');
	newElement.setAttribute('class', 'container');
	newElement.style.marginTop = '14px';
	$('#skinsDialog').append(newElement);
	//				<div id='preview'>
	newElement = document.createElement('div');
	newElement.setAttribute('id', 'preview');
	$('.container').last().append(newElement);
	//				</div>
	//				<i class='material-icons md-36 md-dark change' id='previous'>
	newElement = document.createElement('i');
	newElement.setAttribute('class', 'material-icons md-36 md-dark change');
	newElement.setAttribute('id', 'previous');
	newElement.innerHTML = 'chevron_left';
	$('.container').last().append(newElement);
	//				</i>
	//				<i class='material-icons md-36 md-dark change' id='next'>
	newElement = document.createElement('i');
	newElement.setAttribute('class', 'material-icons md-36 md-dark change');
	newElement.setAttribute('id', 'next');
	newElement.innerHTML = 'chevron_right';
	$('.container').last().append(newElement);
	//				</i>
	//			</div>
	//			<div class='container'>
	newElement = document.createElement('div');
	newElement.setAttribute('class', 'container');
	newElement.style.marginTop = '14px';
	$('#skinsDialog').append(newElement);
	//				<input type='text' class='form-control' id='skinURL'/>
	newElement = document.createElement('input');
	newElement.setAttribute('type', 'text');
	newElement.setAttribute('class', 'form-control');
	newElement.setAttribute('id', 'skinURL');
	newElement.placeholder = 'Skin URL';
	$('.container').last().append(newElement);
	//			</div>
	//		</div>
	//		<div class='dialog' id='partyDialog'>
	//			<div class='container'>
	newElement = document.createElement('div');
	newElement.setAttribute('class', 'container');
	newElement.style.marginTop = '14px';
	$('#partyDialog').append(newElement);
	//				<span>
	newElement = document.createElement('span');
	newElement.innerHTML = 'Play with your friends in the same map';
	$('.container').last().append(newElement);
	//				</span>
	//			</div>
	//			<div class='container'>
	newElement = document.createElement('div');
	newElement.setAttribute('class', 'container');
	newElement.style.marginTop = '14px';
	$('#partyDialog').append(newElement);
	//				<select id='region'>
	newElement = document.createElement('select');
	newElement.setAttribute('id', 'region');
	newElement.setAttribute('onchange', "MC.setRegion($('#region').val());");
	newElement.required = true;
	$('.container').last().append(newElement);
	for(i = 0; i < region.value.length; i++){
		//				<option>
		newElement = document.createElement('option');
		newElement.value = region.value[i];
		newElement.innerHTML = region.name[i];
		$('#region').append(newElement);
		//				</option>
	}
	//				</select>
	//			</div>
	//			<div class='container'>
	newElement = document.createElement('div');
	newElement.setAttribute('class', 'container');
	newElement.style.marginTop = '6px';
	$('#partyDialog').append(newElement);
	//				<input type='text' class='form-control partyToken' id='joinPartyToken'/>
	newElement = document.createElement('input');
	newElement.setAttribute('type', 'text');
	newElement.setAttribute('class', 'form-control partyToken');
	newElement.setAttribute('id', 'joinPartyToken');
	newElement.placeholder = 'Party Token';
	$('.container').last().append(newElement);
	//				<button class='btn' id='create-party-btn'>
	newElement = document.createElement('button');
	newElement.setAttribute('class', 'btn');
	newElement.setAttribute('id', 'create-party-btn');
	$('.container').last().append(newElement);
	//					<i class='material-icons md-24 md-dark renew'>
	newElement = document.createElement('i');
	newElement.setAttribute('class', 'material-icons md-24 md-dark renew');
	newElement.innerHTML = 'autorenew';
	$('#create-party-btn').append(newElement);
	//					</i>
	//				</button>
	//			</div>
	//			<div class='container'>
	newElement = document.createElement('div');
	newElement.setAttribute('class', 'container');
	newElement.style.marginTop = '14px';
	$('#partyDialog').append(newElement);
	//				<button class='btn' id='join-party-btn'>
	newElement = document.createElement('button');
	newElement.setAttribute('class', 'btn');
	newElement.setAttribute('id', 'join-party-btn');
	newElement.innerHTML = 'JOIN';
	$('.container').last().append(newElement);
	//				</button>
	//			</div>
	//		</div>
	//		<div class='overlay overlay-secondary' id='socialLoginPanel'>
	newElement = document.createElement('div');
	newElement.setAttribute('class', 'overlay overlay-secondary');
	newElement.setAttribute('id', 'socialLoginPanel');
	$('#mainPanel').append(newElement);
	//			<div class='dialog' id='socialLoginDialog'>
	newElement = document.createElement('div');
	newElement.setAttribute('class', 'dialog');
	newElement.setAttribute('id', 'socialLoginDialog');
	$('#socialLoginPanel').append(newElement);
	//				<span>
	newElement = document.createElement('span');
	newElement.innerHTML = 'Login';
	$('#socialLoginDialog').append(newElement);
	//				</span>
	//				<i class='material-icons md-36 md-dark close'>
	newElement = document.createElement('i');
	newElement.setAttribute('class', 'material-icons md-36 md-dark close');
	newElement.setAttribute('onclick', "MC.setNick($('#nick').val()); return false;");
	newElement.innerHTML = 'close';
	$('#socialLoginDialog').append(newElement);
	//				</i>
	//				<div class='container'>
	newElement = document.createElement('div');
	newElement.setAttribute('class', 'container');
	newElement.style.marginTop = '14px';
	$('#socialLoginDialog').append(newElement);
	//					<span>
	newElement = document.createElement('span');
	newElement.innerHTML = 'Sign in with an external service';
	$('.container').last().append(newElement);
	//					</span>
	//				</div>
	//				<div class='container'>
	newElement = document.createElement('div');
	newElement.setAttribute('class', 'container');
	newElement.style.marginTop = '14px';
	$('#socialLoginDialog').append(newElement);
	//					<button class='btn btn-login' id='fbLogin'>
	newElement = document.createElement('button');
	newElement.setAttribute('class', 'btn btn-login');
	newElement.setAttribute('id', 'fbLogin');
	newElement.setAttribute('onclick', "facebookLogin(); return false;");
	newElement.innerHTML = 'Sign in with Facebook';
	$('.container').last().append(newElement);
	//					</button>
	//				</div>
	//				<div class='container'>
	newElement = document.createElement('div');
	newElement.setAttribute('class', 'container');
	newElement.style.marginTop = '6px';
	$('#socialLoginDialog').append(newElement);
	//					<button class='btn btn-login' id='gplusLogin'>
	newElement = document.createElement('button');
	newElement.setAttribute('class', 'btn btn-login');
	newElement.setAttribute('id', 'gplusLogin');
	newElement.innerHTML = 'Sign in with Google';
	$('.container').last().append(newElement);
	//					</button>
	//				</div>
	//			</div>
	//		</div>
	for(i = 0; i < panelDialog.id.length; i++){
		//	<div class='overlay overlay-secondary panel'>
		newElement = document.createElement('div');
		newElement.setAttribute('class', 'overlay overlay-secondary panel');
		$('#mainPanel').append(newElement);
		//		<div class='dialog'>
		newElement = document.createElement('div');
		newElement.setAttribute('class', 'dialog');
		newElement.setAttribute('id', panelDialog.id[i]);
		$('.panel').last().append(newElement);
		//			<span>
		newElement = document.createElement('span');
		newElement.innerHTML = panelDialog.name[i];
		$('.dialog').last().append(newElement);
		//			</span>
		//			<i class='material-icons md-36 md-dark close'>
		newElement = document.createElement('i');
		newElement.setAttribute('class', 'material-icons md-36 md-dark close');
		newElement.innerHTML = 'close';
		$('.dialog').last().append(newElement);
		//			</i>
		//		</div>
		//	</div>
	}
	//		<div class='overlay overlay-secondary panel'>
	//			<div class='dialog' id='profileDialog'>
	//				<div class='container'>
	newElement = document.createElement('div');
	newElement.setAttribute('class', 'container');
	newElement.style.marginTop = '14px';
	$('#profileDialog').append(newElement);
	//					<div class='agario-wallet'>
	newElement = document.createElement('div');
	newElement.setAttribute('class', 'agario-wallet');
	$('.container').last().append(newElement);
	//						<span class='agario-profile-name'>
	newElement = document.createElement('span');
	newElement.setAttribute('class', 'agario-profile-name');
	newElement.innerHTML = 'Guest';
	$('.agario-wallet').last().append(newElement);
	//						</span>
	//						<div class='agario-wallet-container'>
	newElement = document.createElement('div');
	newElement.setAttribute('class', 'agario-wallet-container');
	newElement.style.marginTop = '14px';
	$('.agario-wallet').last().append(newElement);
	//							<img class='agario-profile-picture'/>
	newElement = document.createElement('img');
	newElement.setAttribute('class', 'agario-profile-picture');
	newElement.src = 'mc/img/profilepic_guest.png';
	newElement.width = 120;
	newElement.height = 120;
	$('.agario-wallet-container').last().append(newElement);
	//						</div>
	//					</div>
	//					<div class='agario-wallet'>
	newElement = document.createElement('div');
	newElement.setAttribute('class', 'agario-wallet');
	$('.container').last().append(newElement);
	//						<span>
	newElement = document.createElement('span');
	newElement.innerHTML = 'Player Stats';
	$('.agario-wallet').last().append(newElement);
	//						</span>
	//					</div>
	//				</div>
	//			</div>
	//		</div>
	//		<div class='overlay overlay-secondary panel'>
	//			<div class='dialog' id='settingsDialog'>
	//				<div class='container container-scroll'>
	newElement = document.createElement('div');
	newElement.setAttribute('class', 'container container-scroll');
	newElement.style.marginTop = '14px';
	newElement.style.maxHeight = '422px';
	$('#settingsDialog').append(newElement);
	for(i = 0; i < settings.id.length; i++){
		//				<div class='ground settings'>
		newElement = document.createElement('div');
		newElement.setAttribute('class', 'ground settings');
		newElement.setAttribute('id', settings.id[i]);
		$('.container-scroll').last().append(newElement);
		//					<span>
		newElement = document.createElement('span');
		newElement.innerHTML = settings.name[i];
		$('.settings').last().append(newElement);
		//					</span>
		//					<div class='switch-off'>
		newElement = document.createElement('div');
		newElement.setAttribute('class', 'switch-off');
		$('.settings').last().append(newElement);
		//					</div>
		//				</div>
	}
	//				</div>
	//			</div>
	//		</div>
	//		<div class='overlay overlay-secondary panel'>
	//			<div class='dialog' id='commandsDialog'>
	//				<div class='container container-scroll'>
	newElement = document.createElement('div');
	newElement.setAttribute('class', 'container container-scroll');
	newElement.style.marginTop = '14px';
	newElement.style.maxHeight = '422px';
	$('#commandsDialog').append(newElement);
	for(i = 0; i < commands.data.length; i++){
		//				<div class='ground commands'>
		newElement = document.createElement('div');
		newElement.setAttribute('class', 'ground commands');
		newElement.setAttribute('data', commands.data[i]);
		$('.container-scroll').last().append(newElement);
		//					<span>
		newElement = document.createElement('span');
		newElement.innerHTML = commands.name[i];
		$('.commands').last().append(newElement);
		//					</span>
		//					<input type='text' class='data-log key'/>
		newElement = document.createElement('input');
		newElement.setAttribute('type', 'text');
		newElement.setAttribute('class', 'data-log key');
		$('.commands').last().append(newElement);
		//				</div>
	}
	//				</div>
	//			</div>
	//		</div>
	//		<div class='overlay overlay-secondary panel'>
	//			<div class='dialog' id='themeDialog'>
	//				<div class='container container-scroll'>
	newElement = document.createElement('div');
	newElement.setAttribute('class', 'container container-scroll');
	newElement.style.marginTop = '14px';
	newElement.style.maxHeight = '372px';
	$('#themeDialog').append(newElement);
	for(i = 0; i < theme.data.length; i++){
		//				<div class='ground theme'>
		newElement = document.createElement('div');
		newElement.setAttribute('class', 'ground theme');
		newElement.setAttribute('data', theme.data[i]);
		$('.container-scroll').last().append(newElement);
		//					<span>
		newElement = document.createElement('span');
		newElement.innerHTML = theme.name[i];
		$('.theme').last().append(newElement);
		//					</span>
		//					<i class='material-icons dark edit'>
		newElement = document.createElement('i');
		newElement.setAttribute('class', 'material-icons md-dark edit');
		newElement.innerHTML = 'edit';
		$('.theme').last().append(newElement);
		//					</i>
		//				</div>
	}
	//				</div>
	//				<div class='container'>
	newElement = document.createElement('div');
	newElement.setAttribute('class', 'container');
	$('#themeDialog').append(newElement);
	//					<button class='btn' id='create-theme-btn'>
	newElement = document.createElement('button');
	newElement.setAttribute('class', 'btn');
	newElement.setAttribute('id', 'create-theme-btn');
	newElement.innerHTML = 'CREATE A NEW THEME';
	$('.container').last().append(newElement);
	//					</button>
	//				</div>
	//			</div>
	//		</div>
	//		<div class='overlay overlay-secondary' id='editPanel'>
	newElement = document.createElement('div');
	newElement.setAttribute('class', 'overlay overlay-secondary');
	newElement.setAttribute('id', 'editPanel');
	$('#mainPanel').append(newElement);
	//			<div class='dialog' id='editDialog'>
	newElement = document.createElement('div');
	newElement.setAttribute('class', 'dialog');
	newElement.setAttribute('id', 'editDialog');
	$('#editPanel').append(newElement);
	//				<div class='container'>
	newElement = document.createElement('div');
	newElement.setAttribute('class', 'container');
	$('#editDialog').append(newElement);
	//					<input type='text' id='themeName'/>
	newElement = document.createElement('input');
	newElement.setAttribute('type', 'text');
	newElement.setAttribute('id', 'themeName');
	newElement.maxLength = 15;
	newElement.value = 'New theme';
	$('.container').last().append(newElement);
	//				</div>
	//				<i class='material-icons md-36 md-dark close'>
	newElement = document.createElement('i');
	newElement.setAttribute('class', 'material-icons md-36 md-dark close');
	newElement.innerHTML = 'close';
	$('#editDialog').append(newElement);
	//				</i>
	//				<div class='container'>
	newElement = document.createElement('div');
	newElement.setAttribute('class', 'container');
	newElement.style.marginTop = '14px';
	$('#editDialog').append(newElement);
	for(i = 0; i < color.id.length; i++){
		//				<div class='ground color'>
		newElement = document.createElement('div');
		newElement.setAttribute('class', 'ground color');
		$('.container').last().append(newElement);
		//					<span>
		newElement = document.createElement('span');
		newElement.innerHTML = color.name[i];
		$('.color').last().append(newElement);
		//					</span>
		//					<input type='text' class='data-log hex-color'/>
		newElement = document.createElement('input');
		newElement.setAttribute('type', 'text');
		newElement.setAttribute('class', 'data-log hex-color');
		newElement.setAttribute('id', color.id[i]);
		newElement.maxLength = 7;
		newElement.value = '#000000';
		$('.color').last().append(newElement);
		//					<i class='color-view'>
		newElement = document.createElement('i');
		newElement.setAttribute('class', 'color-view');
		$('.color').last().append(newElement);
		//					</i>
		//				</div>
	}
	//				</div>
	//				<div class='container'>
	newElement = document.createElement('div');
	newElement.setAttribute('class', 'container');
	$('#editDialog').append(newElement);
	//					<button class='btn' id='discard-theme-btn'>
	newElement = document.createElement('button');
	newElement.setAttribute('class', 'btn');
	newElement.setAttribute('id', 'discard-theme-btn');
	newElement.innerHTML = 'DISCARD';
	$('.container').last().append(newElement);
	//					</button>
	//					<button class='btn' id='save-theme-btn'>
	newElement = document.createElement('button');
	newElement.setAttribute('class', 'btn');
	newElement.setAttribute('id', 'save-theme-btn');
	newElement.innerHTML = 'SAVE';
	$('.container').last().append(newElement);
	//					</button>
	//				</div>
	//			</div>
	//		</div>
	//	</div>
}

function setGameContext(){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function(){
		if(xmlhttp.readyState == 4){
			var newContent = xmlhttp.responseText;
			newContent = newContent.replace(/(\(function\(([\w$]+)\)\{)/i, '$1 var agario = $2.agario, context = null;');
			newContent = newContent.replace(/(function\s*([\w$]+)\(\w\)\{return\s*[\w$]+\(\w,\w\)\})/i, '$1 agario.getString = $2;');
			newContent = newContent.replace(/(([\w$]+)=[\w$]+\.getContext\(\"2d\"\);)/i, "if($2.id == 'canvas'){$1 context = $2;} else{$1}");
			newContent = newContent.replace(/[\w$]+\(\w,\w\);[\w$]+\(\w,\w\);[\w$]+\(\w,\w\);[\w$]+\(\w,\w\);(\w\[\w\+\d+>>0\]=1;\w=\w;return\})/i, '$1');
			newContent = newContent.replace(/(if\(\(\w\[\d+\]\|0\)!=0\?\(\w\[\d+\]\|\w\[(\w)\+\d+>>0\]\)<<24>>24==0:0\))((\w)=\w\[\w\+\d+>>2\]\|0;)/i, 'agario.cellMemOffset = $2; $1 if(agario.customSkins){$4 = 0;} else{$3}');
			newContent = newContent.replace(/do\s*if\((\w)\)\{((\w)=!\((\+\w\[\w>>2\])<=20\.0\);)([\w$]+\(\d+,\w\[\w>>2]\|0\)\|0;[\w$]+\(\d+,\w\[\w>>2]\|0,(\+\(\+\w\[\w>>2\]\)),(\+\(\+\w\[\w>>2\]\)),\+\(\+\w\[\w>>2\])\+5\.0(\),0\.0,6\.283185307179586,0\)\|0;[\w$]+\(\d+,\w\[\w>>2]\|0\)\|0;\w=\w\[\w>>2\]\|0;)if\(\w\)\{([\w$]+\(\d+,\w\|0,\w&255\|0,\w&255\|0,\w&255\|0\)\|0;)[\w$]+\(\d+,\w\[\w>>2]\|0\)\|0;/i, "var cellX = null, cellY = null, cellSize = null, nick = null, skin = null, mass = null, isFood = false, isVirus = false, isPlayerCell = false; context.globalAlpha = 1; if(agario.showMapBorders && agario.mapSet){context.save(); context.globalCompositeOperation = 'destination-over'; context.lineWidth = 50; context.lineJoin = 'miter'; context.strokeStyle = agario.bordersColor; context._strokeRect(agario.mapStartX - 50, agario.mapStartY - 50, agario.mapWidth + 100, agario.mapHeight + 100); context.restore();} do if($1 = 1, $1){$2 cellX = $6; cellY = $7; if(!$3){isFood = true; if(!agario.hideFood && !(agario.autoHideFood && agario.playerMass > 999)){context.fillStyle = agario.foodColor; context._fillCircle(cellX, cellY, 10);} break;} $5 $8 if($3){cellSize = $4; mass = agario.calculateMass(cellSize); if(context.lineJoin == 'miter'){isVirus = true; context.globalAlpha = 0.75; context.fillStyle = agario.virusColor; context._fillCircle(cellX, cellY, cellSize); context.globalAlpha = 1; context.strokeStyle = agario.virusStrokeColor; context.stroke();} else{if(agario.nameMemOffset && agario.cellMemOffset && agario.getString){if((a[agario.cellMemOffset + agario.nameMemOffset + 4 >> 0] & 1) == 0 | 0){nick = agario.getString(agario.cellMemOffset + agario.nameMemOffset + 5);} else{nick = agario.getString(c[agario.cellMemOffset + agario.nameMemOffset + 12 >> 2] | 0);}} if(agario.play){if(agario.cellMemOffset && agario.idOffset && agario.idMemOffset){var idA = c[agario.cellMemOffset + agario.idOffset >> 2] | 0; var idB = c[agario.idMemOffset] | 0; var idC = c[agario.idMemOffset + 1] | 0; loop: do{if((idB | 0) != (idC | 0)){while(true){if((c[idB >> 2] | 0) == (idA | 0)){break loop;} idB = idB + 4 | 0; if((idB | 0) == (idC | 0)){idB = idC; break;}}}} while(false); isPlayerCell = (idB | 0) != (idC | 0);} if(agario.showIndicators && mass > agario.playerSTE && !isPlayerCell){context.save(); context.globalCompositeOperation = 'destination-over'; context.lineWidth = 1; context.strokeStyle = agario.setColorIndicator(mass); context._strokeCircle(cellX, cellY, cellSize + 500); context.restore();}} if(agario.transparentCells){context.globalAlpha = 0.75;} $9 context._fillCircle(cellX, cellY, cellSize); if(!agario.noSkins && agario.customSkins && isPlayerCell){skin = agario.playerSkin; if(skin){context.save(); context.clip(); context.drawImage(skin, cellX - cellSize, cellY - cellSize, 2 * cellSize, 2 * cellSize); context.restore();}}} break;");
			newContent = newContent.replace(/if\(\(\w\[\w\+\d+>>0\]\|0\)==0\?\(\(\(\(\w\[\w\+\d+>>2\]\|0\)\+\(\w\[\d+\]\|0\)\|0\)>>>0\)%10\|0\|0\)!=0:0\)\{\w=\w\[\w>>2\]\|0;[\w$]+\(\d+,\w\|0\)\|0;\w=\w;return\}([\w$]+\(\w,\w\);)/i, 'if(cellSize && !(agario.autoHideNamesAndMass && agario.hideCellsInfo(cellSize) && !isPlayerCell)){var hasName = false; $1 if(!agario.noNames && nick && !(agario.hideMyName && isPlayerCell)){hasName = true; agario.cellsInfo(context, nick, cellX, cellY, cellSize + 100);} if(agario.showMass && mass > 50 && !(agario.hideMyMass && isPlayerCell)){agario.cellsInfo(context, mass, cellX, cellY, cellSize + 100, hasName);}}');
			newContent = newContent.replace(/(\w=0;\w=\w\[\w\+(\d+)>>2\]\|0;\w=\w\[(\d+)\]\|0;\w=\w\[\d+\]\|0;)(\w:do)/i, '$1 agario.idOffset = $2; agario.idMemOffset = $3; $4');
			newContent = newContent.replace(/((\w)=\+[\w$]+\(\+\(\+[\w$]+\(\d+\)\*10.0\)\)\/10.0;)/i, '$1 if($2 < 0.3){$2 = 0.3}');
			newContent = newContent.replace(/do\s+if\((\w)\|(\(\w\[\d+\]\|0\)\!=0)\)\{/i, 'do if($2 && !($1 && agario.hideMyName) || !agario.nameMemOffset){');
			newContent = newContent.replace(/(\w=\w\+(\d+)\|0;\w=~~\(\+\w\[\w\+\d+>>2\]\*\.3\);)/i, '$1 agario.nameMemOffset = $2;');
			newContent = newContent.replace(/(\w=\w\+5\+\(\(\w\|0\)\/)2(\|0\)\|0)/i, '$1 1.5 $2');
			newContent = newContent.replace(/(if\(\w<=)20\.0(\)\{\w=\w;return\})if\(!(\w)\)\{if\(\(\w\[\d+\]\|0\)!=\(\w\[\d+\]\|0\)\)\{\w=\w;return\}if\(\(\w\[\w\+\d+>>0\]\|0\)!=0\?\(\w\[\w>>0\]\|0\)==0:0\)\{\w=\w;return\}\}(\w\[\w>>2\]=~~\+[\w$]+\(\+\(\w\*\w\/100\.0\)\);)/i, '$1 40.0 || $3 $2 $4');
			newContent = newContent.replace(/((\w)=\(\w\|0\)<20\?20.0:\+\(\w\|0\);)/i, '$1 $2 *= 2;');
			newContent = newContent.replace(/(do\{\w=\+\w\[\(\w\[\w>>2\]\|0\)\+\d+>>2];\w=\w\+\s*)(\+\(~~\+\w\(\+\(\w\*\w\/100\.0\)\)\|0\))(;\w=\w\+4\|0\}while\(\(\w\|0\)!=\(\w\|0\)\);\w=(\w);)/i, 'agario.playerCellsSize = []; $1 $2; agario.playerCellsSize.push($2) $3 agario.playerMass = $4; agario.playerStats();');
			newContent = newContent.replace(/([\w$]+\(\d+,\w\[\w>>2\]\|0,(\+\w),\+\w\)\|0;[\w$]+\(\d+,\w\[\w>>2\]\|0,\+-(\+\w\[\w\+\d+>>3\]),\+-(\+\w\[\w\+\d+>>3\])\)\|0;)/i, '$1 agario.viewScale = $2; agario.playerX = $3; agario.playerY = $4;');
			newContent = newContent.replace(/(\d\.\d;return\}function\s*)([\w$]+\(.,.\))\{/i, '$1 $2{return;');
			newContent = newContent.replace(/[\w$]+\(\w,\d+,15\);else/i, '{}');
			newContent = newContent.replace(/if\((\+\w\[\w>>3\])<1\.0\)/i, 'if($1 < agario.zoomValue)');
			newContent = newContent.replace(/(\w\[\w\+(\d+)>>3]=(\w);\w\[\w\+\d+>>3]=(\w);\w\[\w\+\d+>>3]=(\w);\w\[\w\+(\d+)>>3]=(\w);)/i, '$1 agario.mapCoordinates($3, $4, $5, $7, $2, $6);');
			var newScript = document.createElement('script');
			newScript.async = true;
			newScript.textContent = newContent;
			$('body').append(newScript);
		}
	};
	xmlhttp.open('GET', 'http://agar.io/agario.core.js', true);
	xmlhttp.send(null);
}

function setMiniclipAPI(){
	MC.showNickDialog = function(){
		if($('#mainPanel').is(':hidden')){
			$('.overlay-secondary').each(function(){
				$(this).hide();
			});
			$('#mainPanel').show();
		}
	};
	MC.onPlayerSpawn = function(){
		window.agario.play = true;
		window.agario.playerMass = 0;
		window.agario.playerScore = 0;
		window.agario.playerSTE = null;
	};
	MC.onPlayerDeath = function(){
		window.agario.play = false;
		if(window.agario.autoRestartGame){
			MC.setNick($('#nick').val());
		}
		else{
			window.setTimeout(MC.showNickDialog, 1000);
		}
	};
}

function getFramesPerSecond(){
	if(lastCalledTime){
		var s = (Date.now() - lastCalledTime) / 1000;
		lastRecord = Math.round(1 / s);
		lastCalledTime = Date.now();
	}
	else{
		lastCalledTime = Date.now();
	}
	window.requestAnimationFrame(getFramesPerSecond);
}

function showGameStats(){
	if(window.agario.showGameStats && $('#mainPanel').is(':hidden')){
		var canvas = document.getElementById('stats');
		var context = canvas.getContext('2d');
		var stats = 'FPS: ' + fps + '    Mass: ' + window.agario.playerMass + '    Score: ' + window.agario.playerScore + '    STE: ' + window.agario.playerSTE;
		canvas.width = context.measureText(stats).width + 12;
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.globalAlpha = 0.4;
		context.fillStyle = '#000000';
		context._fillRect(0, 0, canvas.width, canvas.height);
		context.font = '12px Segoe UI';
		context.textAlign = 'center';
		context.textBaseline = 'middle';
		context.globalAlpha = 1;
		context.fillStyle = '#ffffff';
		context._fillText(stats, canvas.width / 2, canvas.height / 2);
		if($('#stats').is(':hidden')){
			$('#stats').show();
		}
	}
	else if($('#stats').is(':visible')){
		$('#stats').hide();
	}
	window.requestAnimationFrame(showGameStats);
}

function renderMiniMap(){
	if(window.agario.showMiniMap && $('#mainPanel').is(':hidden')){
		var canvas = document.getElementById('miniMap');
		var context = canvas.getContext('2d');
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.globalAlpha = 0.4;
		context.fillStyle = '#000000';
		context._fillRect(0, 0, canvas.width, canvas.height);
		context.font = '18px Segoe UI';
		context.textAlign = 'center';
		context.textBaseline = 'middle';
		context.fillStyle = '#ffffff';
		for(var i = 0; i < 5; i++){
			for(var j = 0; j < 5; j++){
				context._fillText(String.fromCharCode(j + 65) + String.fromCharCode(i + 49), i * canvas.width / 5 + canvas.width / 10, j * canvas.height / 5 + canvas.height / 10);
			}
		}
		if(window.agario.mapSet){
			context.globalAlpha = 1;
			context.fillStyle = '#ffffff';
			context._fillCircle(canvas.width * (window.agario.playerX - window.agario.mapStartX) / window.agario.mapWidth, canvas.height * (window.agario.playerY - window.agario.mapStartY) / window.agario.mapHeight, 5);
		}
		if($('#miniMap').is(':hidden')){
			$('#miniMap').show();
		}
	}
	else if($('#miniMap').is(':visible')){
		$('#miniMap').hide();
	}
	window.requestAnimationFrame(renderMiniMap);
}

function checkPlayerSkin(){
	var img = new Image();
	img.src = $('#skinURL').val();
	img.onload = (function(){
		window.agario.playerSkin = img;
		$('#preview').css('background-image', 'url(' + img.src + ')');
		skins[profile] = img.src;
	});
	img.onerror = (function(){
		window.agario.playerSkin = null;
		$('#preview').css('background-image', "url('http://i.imgur.com/oLI4wVW.png')");
		$('#skinURL').val('');
		skins[profile] = null;
	});
}

function toggleSettings(id){
	var selector = '#' + id;
	var className = window.agario[id]? 'switch-off': 'switch-on';
	$(selector).children('div').attr('class', className);
	window.agario[id] = !window.agario[id];
	switch(id){
		case 'noSkins': window.core.setSkins(!window.agario[id]); break;
		case 'noColors': window.core.setColors(!window.agario[id]); break;
	}
}

function applyTheme(){
	var color = currentSelector.attr('data').split(' ');
	$('#canvas').css('background-color', color[0]);
	window.agario.bordersColor = color[1];
	window.agario.foodColor = color[2];
	window.agario.virusColor = color[3];
	window.agario.virusStrokeColor = color[4];
}

function editTheme(){
	var name = currentSelector? currentSelector.children('span').html(): 'New theme';
	var color = currentSelector? currentSelector.attr('data').split(' '): defaultTheme;
	$('#themeName').val(name);
	for(var i = 0; i < $('.hex-color').length; i++){
		$('.hex-color').eq(i).val(color[i]);
		$('.color-view').eq(i).css('background-color', color[i]);
	}
	$('#editPanel').show();
}

function newGame(){
	MC.joinParty($('#joinPartyToken').val());
	window.setTimeout(function(){
		MC.setNick($('#nick').val());
	}, 1000);
}

function stopMovement(){
	$('canvas').trigger($.Event('mousemove', {clientX: window.innerWidth / 2, clientY: window.innerHeight / 2}));
}

function split(n){
	for(var i = 0; i < n; i++){
		window.core.split();
	}
}

function eject(){
	eventEject = setInterval(function(){
		window.core.eject();
	}, null);
}

$(function(){
	loadContent();
	setGameContext();
	setMiniclipAPI();
	getFramesPerSecond();
	showGameStats();
	renderMiniMap();
	$(document).on('selectstart', function(){
		return false;
	});
	$(document).on('contextmenu', function(e){
		e.preventDefault();
	});
	$(document).on('mousemove', function(e){
		if(e.clientX === 0 && $('#mainPanel').is(e.target)){
			$('#sidePanel').show();
		}
		else if(e.clientX > 92 || $('.overlay-secondary').is(e.target)){
			$('#sidePanel').hide();
		}
	});
	$(document).on('click', '#play-btn', function(){
		if(!MC.isUserLoggedIn()){
			$('#socialLoginPanel').show();
		}
		else{
			MC.setNick($('#nick').val());
		}
	});
	$(document).on('click', '.btn-login', function(){
		$('#socialLoginPanel').hide();
	});
	$(document).on('change', '#skinURL', checkPlayerSkin);
	$(document).on('click', '#preview', function(){
		$('#skinURL').select();
	});
	$(document).on('click', '.change', function(){
		var id = this.id;
		if(id == 'previous'){
			if(profile > 0){
				profile--;
			}
			else{
				profile = 9;
			}
		}
		else if(id == 'next'){
			if(profile < 9){
				profile++;
			}
			else{
				profile = 0;
			}
		}
		$('#skinURL').val(skins[profile]);
		checkPlayerSkin();
	});
	$(document).on('click', '.icons', function(){
		var i = $(this).index();
		$('.panel').eq(i).show();
	});
	$(document).on('click', '.overlay-secondary', function(e){
		if(!$(this).has(e.target).length){
			$(this).hide();
		}
	});
	$(document).on('click', '.close', function(){
		$(this).parents('.overlay-secondary').hide();
	});
	$(document).on('click', '.settings', function(){
		var id = this.id;
		toggleSettings(id);
	});
	$(document).on('click', '.commands', function(){
		var i = $(this).index();
		$('.key').eq(i).focus();
		$(this).on('keydown', function(e){
			for(var n = 0; n < $('.commands').length; n++){
				if(e.keyCode == $('.commands').eq(n).attr('data')){
					$('.commands').eq(n).attr('data', null);
					$('.key').eq(n).val(null);
					break;
				}
			}
			if(e.keyCode == 46){
				$('.commands').eq(i).attr('data', null);
				$('.key').eq(i).val(null);
			}
			else{
				$('.commands').eq(i).attr('data', e.keyCode.toString());
				$('.key').eq(i).val(String.fromCharCode(e.keyCode));
			}
			$('.key').eq(i).blur();
		});
	});
	$(document).on('click', '.theme', function(e){
		if(!$(this).children('i').is(e.target)){
			currentTheme = $(this).index();
			currentSelector = $(this);
			applyTheme();
		}
	});
	$(document).on('click', '.edit', function(){
		currentSelector = $(this).parents('.theme');
		editTheme();
	});
	$(document).on('click', '#create-theme-btn', function(){
		currentSelector = null;
		editTheme();
	});
	$(document).on('click', '.color', function(){
		var i = $(this).index();
		$('.hex-color').eq(i).select();
	});
	$(document).on('change', '.hex-color', function(){
		var i = $(this).parents('.color').index();
		var str = this.value.toLowerCase();
		var pattern = new RegExp('^#?[0-9A-F]{6}$', 'i');
		this.value = pattern.test(str)? str.charAt(0) == '#'? str: '#' + str: '#000000';
		$('.color-view').eq(i).css('background-color', this.value);
	});
	$(document).on('click', '#discard-theme-btn', function(){
		if(currentSelector && currentSelector.index() !== currentTheme){
			if(currentSelector.index() < currentTheme){
				currentTheme--;
			}
			currentSelector.remove();
			currentSelector = null;
		}
		$('#editPanel').hide();
	});
	$(document).on('click', '#save-theme-btn', function(){
		var name = $('#themeName').val();
		var color = [];
		for(var i = 0; i < $('.hex-color').length; i++){
			color[i] = $('.hex-color').eq(i).val();
		}
		if(currentSelector){
			currentSelector.children('span').html(name);
			currentSelector.attr('data', color.join(' '));
			if(currentSelector.index() === currentTheme){
				applyTheme();
			}
		}
		else{
			var newElement = document.createElement('div');
			newElement.setAttribute('class', 'ground theme');
			newElement.setAttribute('data', color.join(' '));
			$('#themeDialog').children('.container-scroll').last().append(newElement);
			newElement = document.createElement('span');
			newElement.innerHTML = name;
			$('.theme').last().append(newElement);
			newElement = document.createElement('i');
			newElement.setAttribute('class', 'material-icons md-dark edit');
			newElement.innerHTML = 'edit';
			$('.theme').last().append(newElement);
			currentSelector = $('.theme').last();
		}
		$('#editPanel').hide();
	});
	$(document).on('keydown', function(e){
		if(!window.agario.disableCommands && !$('input').is(e.target) && !triggered){
			triggered = true;
			switch(e.keyCode){
				case parseInt($('.commands').eq(0).attr('data')): newGame(); break;
				case parseInt($('.commands').eq(1).attr('data')): stopMovement(); break;
				case parseInt($('.commands').eq(2).attr('data')): split(2); break;
				case parseInt($('.commands').eq(3).attr('data')): split(4); break;
				case parseInt($('.commands').eq(4).attr('data')): eject(); break;
				case parseInt($('.commands').eq(5).attr('data')): toggleSettings('noSkins'); break;
				case parseInt($('.commands').eq(6).attr('data')): toggleSettings('noColors'); break;
				case parseInt($('.commands').eq(7).attr('data')): toggleSettings('noNames'); break;
				case parseInt($('.commands').eq(8).attr('data')): toggleSettings('showMass'); break;
				case parseInt($('.commands').eq(9).attr('data')): toggleSettings('hideFood'); break;
				case parseInt($('.commands').eq(10).attr('data')): toggleSettings('showIndicators'); break;
				case parseInt($('.commands').eq(11).attr('data')): toggleSettings('showMapBorders'); break;
				case parseInt($('.commands').eq(12).attr('data')): toggleSettings('showMiniMap'); break;
				case parseInt($('.commands').eq(13).attr('data')): toggleSettings('displayChat'); break;
			}
		}
	});
	$(document).on('keyup', function(){
		triggered = false;
		if(eventEject){
			clearInterval(eventEject);
			eventEject = false;
		}
	});
	$(document).on('mousedown', function(e){
		if(window.agario.enableMouseControls && !window.agario.disableCommands && $('canvas').is(e.target) && !triggered){
			var leftClick = window.agario.invertMouseControls? eject: window.core.split;
			var rightClick = window.agario.invertMouseControls? window.core.split: eject;
			triggered = true;
			switch(e.which){
				case 1: leftClick(); break;
				case 3: rightClick(); break;
			}
		}
	});
	$(document).on('mouseup', function(){
		triggered = false;
		if(eventEject){
			clearInterval(eventEject);
			eventEject = false;
		}
	});
	window.setInterval(function(){
		fps = lastRecord;
	}, 1000);
});
