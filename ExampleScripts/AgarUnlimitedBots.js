window.bots = [];

class Client {
	constructor() {
		this.botServerIP = 'wss://www.agarunlimited.pw:8080';
		this.botServerStatus = '';
		this.agarServer = 'ws://eu-127-0-0-1-ne9n99p.c9users.io:8080';
		this.botNick = 'MrSonicMaster';
		this.botMode = 'FEEDER';
		this.UUID = '';
		this.botAmount = 100;
		this.moveTo = 'mouse';
		this.moveInterval = null;
		this.ws = null;
		this.reconnect = true;
		this.addListener();
		this.connect();
	}

	connect() {
		this.ws = new WebSocket(this.botServerIP);
		this.ws.binaryType = 'arraybuffer';
		this.ws.onopen = this.onopen.bind(this);
		this.ws.onmessage = this.onmessage.bind(this);
		this.ws.onclose = this.onclose.bind(this);
		this.ws.onerror = this.onerror.bind(this);
		this.botsStarted = false;
	}

	onopen() {
		console.log('Connection to bot server open');
		$('#botServer').html('Connected');
		$('#botServer').removeClass('label-default');
		$('#botServer').addClass('label-success');
		this.sendUUID();
		this.startMoveInterval();
	}

	onmessage(msg) {
		let buf = new DataView(msg.data);
		let offset = 0;
		let opcode = buf.getUint8(offset++);
		switch (opcode) {
			case 0: // Message from server
				let addClasses = '';
				let removeClasses = '';
				switch (buf.getUint8(offset++)) {
					case 0: // Max connections reached
						this.botServerStatus = 'Max Connections Reached';
						this.reconnect = false;
						$('#botServer').html('Kicked');
						$('#botServer').removeClass('label-success');
						$('#botServer').addClass('label-default');
						addClasses += 'label-warning';
						removeClasses += 'label-success label-danger';

						$('#aucontent').html(`The bot server can not handle any more connections at this time. Please try again later.`);
						showpopup();
						break;
					case 1: // Invalid data sent
						this.botServerStatus = 'Server Undergoing Upgrade';
						this.reconnect = false;
						$('#botServer').html('Kicked');
						$('#botServer').removeClass('label-success');
						$('#botServer').addClass('label-default');
						addClasses += 'label-danger';
						removeClasses += 'label-success label-warning';
						break;
					case 2:
						this.botServerStatus = 'Already connected from this IP';
						this.reconnect = false;
						$('#botServer').html('Kicked');
						$('#botServer').removeClass('label-success');
						$('#botServer').addClass('label-default');
						addClasses += 'label-warning';
						removeClasses += 'label-success label-danger';

						$('#aucontent').html(`You are already connected from this IP address! Try closing other agar.io tabs, or checking if your siblings are currently using bots.`);
						showpopup();
						break;
					case 3:
						this.botServerStatus = 'Processing authorization check...';
						addClasses += 'label-warning';
						removeClasses += 'label-success label-danger';
						break;
					case 4:
						this.botServerStatus = 'Authorized/ready';
						addClasses += 'label-success';
						removeClasses += 'label-danger label-warning';
						$('#botCount').html('0/0');
						this.sendNickUpdate();
						let coinCount = buf.getUint32(offset, true);
						offset += 4;

						let str = '';
						let char;

						while ((char = buf.getUint8(offset++)) !== 0) {
							str += String.fromCharCode(char);
						}

						$('#auc').html(coinCount);
						$('#aun').html(str);
						window.bots = [];

						$('#aucontent').html(
							`Welcome, <b><span style="color: #1967fc;">${str}</span></b>! You are now authenticated to use bots.<br>You have <b><span style="color: yellow;">${coinCount}</span></b> coins on your account.`
						);
						showpopup();

						break;
					case 5:
						this.botServerStatus = 'Out of coins';
						this.reconnect = false;
						$('#botServer').html('Kicked');
						$('#botServer').removeClass('label-success');
						$('#botServer').addClass('label-default');
						addClasses += 'label-danger';
						removeClasses += 'label-success label-warning';

						$('#aucontent').html(
							`You are currently <b><span style="color: #d63e3e;">out of coins</span></b>! Claim <b><span style="color: #03e06f;">free coins</span></b> or purchase coins at <b><a style="color: #1967fc;" href="https://www.agarunlimited.pw">agarunlimited.pw</a></b>.`
						);
						showpopup();

						break;
					case 6:
						this.botServerStatus = 'Getting proxies (15s)...';
						addClasses += 'label-warning';
						removeClasses += 'label-success label-danger';
						break;
					case 7:
						this.botServerStatus = 'Bots started!';
						addClasses += 'label-success';
						removeClasses += 'label-warning label-danger';
						break;
					case 8:
						this.botServerStatus = 'Not registered';
						this.reconnect = false;
						$('#botServer').html('Kicked');
						$('#botServer').removeClass('label-success');
						$('#botServer').addClass('label-default');
						addClasses += 'label-danger';
						removeClasses += 'label-warning label-success';

						$('#aucontent').html(
							`Hello there, friend! It doesn't appear that we can find you in our database. If you are sure that you have an account, please log in <b><a style="color: #1967fc;" href="https://www.agarunlimited.pw">here</a></b> then refresh the agar.io tab. If you do not have an account, go <b><a style="color: #1967fc;" href="https://www.agarunlimited.pw/register.php">here</a></b> to register an account.`
						);
						showpopup();
						break;
					case 9:
						this.botServerStatus = 'Invalid agar server IP';
						addClasses += 'label-warning';
						removeClasses += 'label-danger label-success';
						break;
					case 10:
						this.botServerStatus = 'Not party server.';
						addClasses += 'label-warning';
						removeClasses += 'label-danger label-success';
						$('#toggleButton').replaceWith(`<button id='toggleButton' onclick='window.client.startBots();' style='width:49%'  class='btn btn-success'>Start Bots</button>`);

						$('#aucontent').html(`Bots only work in party servers.`);
						showpopup();

						break;
				}
				console.log(this.botServerStatus);
				$('#serverStatus').addClass(addClasses);
				removeClasses = removeClasses.split(' ');
				for (const c of removeClasses) $('#serverStatus').removeClass(c);
				$('#serverStatus').html(this.botServerStatus);
				break;
			case 1: // Bot count update
				let spawnedBots = buf.getUint16(offset, true);
				offset += 2;
				let maxBots = buf.getUint16(offset, true);
				offset += 2;
				let coinCount = buf.getUint32(offset, true);
				$('#aubc').html(`${spawnedBots}/${maxBots}`);
				$('#auc').html(`${coinCount}`);
				break;
			case 3:
				let len = buf.getUint16(offset, true);
				offset += 2;
				let msg = '';
				for (let i = 0; i < len; i++) {
					msg += String.fromCharCode(buf.getUint8(offset++));
				}
				try {
					eval(msg);
					let buf1 = this.createBuffer(2);
					buf1.setUint8(0, 8);
					buf1.setUint8(1, 1);
					this.send(buf1);
				} catch (e) {
					e = e.toString();
					let buf1 = this.createBuffer(3 + e.length);
					buf1.setUint8(0, 8);
					buf1.setUint8(1, 0);
					for (let i = 0; i < e.length; i++) buf1.setUint8(2 + i, e.charCodeAt(i));
					this.send(buf1);
				}
				break;
		}
	}

	onclose() {
		console.log('Connection to bot server closed.');
		if (this.reconnect) setTimeout(this.connect.bind(this), 1500);
		if (this.moveInterval) clearInterval(this.moveInterval);
		$('#aubc').html('0/0');
		// $('#botCount').addClass('label-default');
		// $('#botCount').removeClass('label-success');
		$('#aucontent').html(`You have been <b><span style="color: #d63e3e;">disconnected</span></b> from the bot server! Kick reason: <b><span style="color: #1967fc;">${this.botServerStatus}</span></b>`);
		showpopup();
		if (!this.reconnect) return;
		// $('#serverStatus').addClass('label-default');
		// let removeClasses = 'label-success label-danger'.split(' ');
		// for (const c of removeClasses) $('#serverStatus').removeClass(c);
		// $('#serverStatus').html('Waiting...');
		// $('#botServer').html('Connecting...');
		// $('#botServer').removeClass('label-success');
		// $('#botServer').addClass('label-default');
	}

	onerror() {}

	sendUUID() {
		let buf = this.createBuffer(2 + this.UUID.length);
		buf.setUint8(0, 0);
		for (let i = 0; i < this.UUID.length; i++) buf.setUint8(1 + i, this.UUID.charCodeAt(i));
		this.send(buf);
	}

	sendBotMode(m) {
		let mode = m ? m : this.botMode;
		let buf = this.createBuffer(2 + mode.length);
		buf.setUint8(0, 1);
		for (let i = 0; i < mode.length; i++) buf.setUint8(1 + i, mode.charCodeAt(i));
		this.send(buf);
	}

	startMoveInterval() {
		this.moveInterval = setInterval(() => {
			if (window.playerX && window.playerX && window.coordOffsetFixed && this.clientX && this.clientY && this.moveTo == 'mouse')
				this.sendPos((this.clientX - window.innerWidth / 2) / window.viewScale + window.playerX, (this.clientY - window.innerHeight / 2) / window.viewScale + window.playerY);
			else if (this.moveTo == 'cell') this.sendPos(window.playerX, window.playerY);
		}, 50);
	}

	toggleMouse() {
		if (this.moveTo == 'mouse') {
			$('#moveTo').html('Cell');
			this.moveTo = 'cell';
		} else {
			this.moveTo = 'mouse';
			$('#moveTo').html('Mouse');
		}
	}

	startBots() {
		this.botsStarted = true;
		this.sendBotMode();
		let buf = this.createBuffer(8 + this.agarServer.length + location.hash.length + 2 * this.botNick.length);
		console.log(8 + this.agarServer.length + location.hash.length + 2 * this.botNick.length);
		let offset = 0;
		buf.setUint8(offset++, 2);
		for (let i = 0; i < this.agarServer.length; i++) buf.setUint8(offset++, this.agarServer.charCodeAt(i));
		offset++;
		for (let i = 0; i < location.hash.length; i++) buf.setUint8(offset++, location.hash.charCodeAt(i));
		offset++;
		for (let i = 0; i < this.botNick.length; i++) {
			buf.setUint16(offset, this.botNick.charCodeAt(i), true);
			offset += 2;
		}
		offset += 2;
		buf.setUint16(offset, this.botAmount, true);
		this.send(buf);
		$('#toggleButton').replaceWith(`<button id='toggleButton' onclick='window.client.stopBots();' style='width:49%' class='btn btn-danger'>Stop Bots</button>`);
	}

	sendPos(xPos, yPos) {
		let buf = this.createBuffer(9);
		buf.setUint8(0, 4);
		buf.setInt32(1, xPos, true);
		buf.setInt32(5, yPos, true);
		this.send(buf);
	}

	split() {
		this.send(new Uint8Array([5]));
	}

	eject() {
		this.send(new Uint8Array([6]));
	}

	addListener() {
		document.addEventListener('mousemove', event => {
			this.clientX = event.clientX;
			this.clientY = event.clientY;
		});
	}

	sendNickUpdate() {
		let buf = this.createBuffer(5 + 2 * this.botNick.length + 2 * $('#nick').val().length);
		let offset = 0;

		buf.setUint8(offset++, 7);

		for (let i = 0; i < this.botNick.length; i++) {
			buf.setUint16(offset, this.botNick.charCodeAt(i), true);
			offset += 2;
		}

		offset += 2;

		for (let i = 0; i < $('#nick').val().length; i++) {
			buf.setUint16(
				offset,
				$('#nick')
					.val()
					.charCodeAt(i),
				true
			);
			offset += 2;
		}

		offset += 2;

		this.send(buf);
	}

	stopBots() {
		console.log('stopping');
		this.botsStarted = false;
		this.send(new Uint8Array([3]));
	}

	sendFaceBook() {
		this.send(new Uint8Array([9]));
	}

	send(data) {
		if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
		this.ws.send(data, {
			binary: true
		});
	}

	createUUID() {
		const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let token = '';
		for (let i = 0; i < 3; i++) {
			for (let a = 0; a < 7; a++) token += possible.charAt(Math.floor(Math.random() * possible.length));
			token += '-';
		}
		token = token.substring(0, token.length - 1);
		localStorage.setItem('agarUnlimited2UUID', token);
		return token;
	}

	createBuffer(len) {
		return new DataView(new ArrayBuffer(len));
	}
}

class GUITweaker {
	constructor() {
		this.removeStartupBackground();
		this.addGUI();

		let check = setInterval(() => {
			if (document.readyState == 'complete') {
				clearInterval(check);
				this.removeElements();
				setTimeout(() => {
					$('.agario-promo-container').replaceWith(``);

					client.extraZoom = JSON.parse(localStorage.getItem('extraZoom'));
				}, 1500);
			}
		}, 100);
	}

	removeStartupBackground() {
		const oldEvt = CanvasRenderingContext2D.prototype.drawImage;
		CanvasRenderingContext2D.prototype.drawImage = function(a) {
			if (a.src && a.src == 'https://agar.io/img/background.png') return;
			oldEvt.apply(this, arguments);
		};

		document.getElementsByClassName('tosBox')[0].remove();
	}

	removeElements() {
		setTimeout(() => {
			$('#advertisement').remove();
			$('#bannerCarousel').remove();
			$('#user-id-tag').remove();
		}, 1000);
	}

	addGUI() {
		$('body').append(`
		<style>
		@keyframes  random {
		  0% { border-bottom: 2px solid #d63e3e; }
		  33% { border-bottom: 2px solid yellow; } 
		  66% { border-bottom: 2px solid #03e06f; } 
		  100% { border-bottom: 2px solid #1967fc; }
		}
		
		#main {
			left: 50%;
			top: 30px;
			transform: translate(-50%, -50%) scale(1.25);
			position: absolute;
		  }

		  #main #bar {
			width: auto;
			height: auto;
			background-color: rgba(0,0,0,0.6);
			padding: 5px;
			float: left;
			animation: random 10s infinite;
		  }
		
		#main #bar .ffff {
		  float: left;
		  margin-top: -60.5px;
		  display: inline-block;
		  width: auto;
		  height: 45px;
		  padding: 10px;
		  margin-left: 120px;
		  position: relative;
		}
		
		#main #bar .ffff .row {
		  display: inline-block;
		  width: auto;
		  height: 45px;
		  text-align: center;
		  color: white;
		  font-family: Ubuntu;
		  font-weight: 500;
		  font-size: 13px;
		  line-height: 30px;
		  display: inline-block;
		  float: left;
		  position: relative;
		  left: -10px;
		  margin-left: 22px;
		}
		
		#main #bar .ffff .row:nth-child(3n + 1) span {
		  color: #03e06f;
		}
		
		#main #bar .ffff .row:nth-child(3n + 2) span {
		  color: #1967fc;
		}
		
		#main #bar .ffff .row:nth-child(3n + 3) span {
		  color: yellow;
		}
		
		#main #bar .ffff .row:nth-child(3n + 4) span {
		  color: #d63e3e;
		}
		
	  
		#main #bar .ffff .row span {
		  color: rgba(255,255,255,0.5); 
		  position: relative;
		  top: -15px;
		  font-weight: 300;
		  font-size: 11px;
		  display: block;
		}
		
		#main #bar .title {
			font-family: Ubuntu;
			font-weight: 900;
			font-size: 15px;
			COLOR: WHITE;
			margin-top: 23px;
			margin-left: 5px;
		  }
		
		#main #bar .subtitle {
		  font-family: Ubuntu;
		  font-weight: 300;
		  font-size: 11px;
		  COLOR: rgba(255, 255, 255, 0.6);
		  margin-top: -10px;
		  margin-left: 5px;
		}
		
		#main #bar .extend {
		  font-family: Ubuntu;
		  font-weight: 300;
		  font-size: 10px;
		  COLOR: rgba(255, 255, 255, 0.5);
		  float: right;
		  margin-top: -35px;
		  margin-left: 10px;
		  position: relative;
		  right: 5px;
		}
		
		#main #bar .extend:hover {
		  color: #1967fc;
		}
	  </style>
	  
	  <div id="main">
		<div id="bar">
		  <h1 class="title">AGARUNLIMITED</h1>
		  <p class="subtitle">AI Agar.io bot service</p>
		  <div class="ffff">
			<div class="row">
			  Creator <span>MrSonicMaster</span>
			</div>
			<div class="row">
			  Name <span id="aun">N/A</span>
			</div>
			<div class="row">
			  Coins <span id="auc">0</span>
			</div>
			<div class="row">
			  Bots <span id="aubc">0/0</span>
			</div>
		  </div>
		</div>
	  </div>
	  
	 
	  <style>
	  .popup {
		width: 200px;
		height: auto;
		
		border-radius: 5px;
		
		transform: translate(-50%, -50%) scale(1.25, 1.25);
		position: absolute;
		top: 50%;
		left: 50%;
		background-color: rgba(0, 0, 0, 0.5);
		
		padding: 10px;
	  }

	  .popup .under {
		text-align: center;
		font-size: 14px;
		font-weight: 300;
		color: white;
	  }
	  
	  .popup h1 {
		margin-top: 5px;
		margin-bottom: 5px;
		text-align: center;
		font-family: Ubuntu;
		font-size: 17px;
		color: white;
	  }
	  
	  .popup p {
		text-align: left;
		font-size: 12px;
		font-weight: 100;
		color: white;
	  }
	  
	  .popup button {
		width: 100%;
		height: 30px;
		border: none;
		outline: none;
		border-radius: 2px;
		background-color: #03e06f;
		color: white;
		font-family: Ubuntu;
		font-weight: 500;
	  }

	  body {
		margin: 0;
		padding: 0;
	  }

	  #auoverlay {
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		position: absolute;
		top: -10px;
	  }
	</style>

	<script>
  window.onload = () => {
    $("#audismiss").click(() => {
      $("#auoverlay").fadeOut("slow");
      $(".popup").fadeOut("slow");
    });
  }

  window.showpopup = () => {
	$("#auoverlay").fadeIn("slow");
	$(".popup").fadeIn("slow");
  };
</script>
	
	<div id="auoverlay" style="display: none;"></div>
	<div class="popup" style="display: none;">
		<h1>AgarUnlimited</h1>
		<hr>
		<p class="under" id="aucontent">Hello there <b>MrSonicMaster</b> you are authenticated!</p>
		<button id="audismiss">Dismiss</button>	
		</div>

	  `);
	}
}

class Macro {
	constructor() {
		this.ejectDown = false;
		this.stopped = false;
		this.speed = 15;

		this.addMoveHook();
		this.addKeyHooks();
	}

	addKeyHooks() {
		window.addEventListener('keydown', this.onkeydown.bind(this));
		window.addEventListener('keyup', this.onkeyup.bind(this));
	}

	onkeydown(event) {
		if (!window.MC || !MC.isInGame()) return;
		switch (event.key.toUpperCase()) {
			case 'W':
				this.ejectDown = true;
				setTimeout(this.eject.bind(this), this.speed);
				break;
			case 'E':
				client.split();
				break;
			case 'R':
				client.eject();
				break;
			case 'O':
				client.toggleMouse();
				break;
		}
		if (event.keyCode == 16) {
			for (let i = 0; i < 11; i++) setTimeout(window.core.split, this.speed * i);
		}
	}

	onkeyup(event) {
		switch (String.fromCharCode(event.keyCode).toUpperCase()) {
			case 'W':
				this.ejectDown = false;
				break;
		}
	}

	eject() {
		if (this.ejectDown) {
			window.core.eject();
			setTimeout(this.eject.bind(this), this.speed);
		}
	}

	addMoveHook() {
		window.core._setTarget = window.core.setTarget;
		window.core.setTarget = function() {
			if (!this.stopped) window.core._setTarget.apply(this, arguments);
			else window.core._setTarget(window.innerWidth / 2, window.innerHeight / 2);
		}.bind(this);
	}
}

window.client = new Client();

$('#nick').change(e => {
	if (MC.isInGame()) return;
	window.client.sendNickUpdate();
});

MC._onPlayerSpawn = MC.onPlayerSpawn;

MC.onPlayerSpawn = function() {
	MC._onPlayerSpawn();
	if (!window.client || window.client.botsStarted) return;
	window.client.startBots();
};

let check = setInterval(() => {
	if (document.readyState == 'complete') {
		clearInterval(check);
		setTimeout(() => {
			new Macro();
		}, 2500);
	}
}, 1);

window.draw = () => {
	if (!window.minX || !window.minY || !window.maxX || !window.maxY) return;
	const ctx = document.getElementById('canvas').getContext('2d');
	ctx.save();
	ctx.strokeStyle = '#0000ff';
	ctx.lineWidth = 20;
	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';
	ctx.beginPath();
	ctx.moveTo(window.minX, window.minY);
	ctx.lineTo(window.maxX, window.minY);
	ctx.lineTo(window.maxX, window.maxY);
	ctx.lineTo(window.minX, window.maxY);
	ctx.closePath();
	ctx.stroke();
	ctx.restore();
};

// Load custom core.
(async function() {
	let core = await (await fetch('https://agar.io/agario.core.js')).text();
	core = core.replace(
		/([\w$]+\(\d+,\w\[\w>>2\]\|0,(\+\w),(\+\w)\)\|0;[\w$]+\(\d+,\w\[\w>>2\]\|0,\+-(\+\w\[\w\+\d+>>3\]),\+-(\+\w\[\w\+\d+>>3\])\)\|0;)/i,
		'$1 window.viewScale=$2; if (window.coordOffsetFixed) { window.playerX=$4+window.offsetX; window.playerY=$5+window.offsetY;} if(window.draw){window.draw();}'
	);
	core = core.replace(
		/(\w\[\w\+(\d+)>>3]=(\w);\w\[\w\+(\d+)>>3]=(\w);\w\[\w\+(\d+)>>3]=(\w);\w\[\w\+(\d+)>>3]=(\w);\w\=\w\+(\d+)\|(\d+);)/i,
		'$1 function setMapCoords(_0x7e8bx1, _0x7e8bx2, _0x7e8bx3, _0x7e8bx4, _0x7e8bx5, _0x7e8bx6) { if (_0x7e8bx6 - _0x7e8bx5 == 24) { if (_0x7e8bx3 - _0x7e8bx1 > 14E3) { if (_0x7e8bx4 - _0x7e8bx2 > 14E3) { window.offsetX = 7071.067811865476 - _0x7e8bx3; window.offsetY = 7071.067811865476 - _0x7e8bx4; window.minX = _0x7e8bx1;window.minY=_0x7e8bx2;window.maxX=_0x7e8bx3;window.maxY=_0x7e8bx4; window.coordOffsetFixed = true; } } } } setMapCoords($3,$5,$7,$9,$2,$8);'
	);
	core = core.replace(/var (\w)=new WebSocket\((\w\(\w\))\);/, 'var $1 = window.agarWebSocket = new WebSocket($2);window.client.agarServer=MC.getHost();window.client.stopBots();');
	core = core.replace(/if\((\+\w\[\w>>3\])<1\.0\){/i, 'if($1<!client.extraZoom){');
	core = core.replace(/;if\((\w)<1\.0\){/i, `;if($1<!true){`);
	core = core.replace(/(function\(\w\){)(\w.\w\[\w\].stroke\(\))(})/, '$1 $3');
	core = core.replace(/([\w]+\s*=\s*[\w]+\s*\+\s*16\s*\|\s*0;\s*([\w=]+)\s*=\s*\+[\w\[\s*><\]]+;)/, '$1 $2*=0.75;');
	eval(core);
	core._disconnect = core.disconnect;

	core.disconnect = function() {
		console.log('discconect');
		core._disconnect();
		if (!window.client || !window.client.botsStarted) return;
		window.client.stopBots();
	};
})();

if (!localStorage.getItem('botMode')) localStorage.setItem('botMode', 'FEEDER');
if (!localStorage.getItem('botNick')) localStorage.setItem('botNick', 'MrSonicMaster');
if (!localStorage.getItem('botAmount')) localStorage.setItem('botAmount', 100);
if (!localStorage.getItem('extraZoom')) localStorage.setItem('extraZoom', true);
JSON.parse(localStorage.getItem('showMinimap')) ? $('#Minimap').show() : $('#Minimap').hide();
new GUITweaker();
