//https://github.com/Izzy129/slasher-ai/blob/ef4a8e412585c3dfd7d93e3eb35ff1b2e7064035/index.js

const { murmur2 } = require('murmurhash-js')
const { readFileSync } = require('fs')
console.log(readFileSync('bigtitle.txt', 'utf8'.blue).toString())

var SocksProxyAgent = require('socks-proxy-agent');
var HttpProxyAgent = require('http-proxy-agent');
var figlet = require('figlet');
var colors = require("colors");
setTimeout(function(){process.exit(1);}, 15 * 60 * 1000); // 15 minutes

figlet('Bots-client',(err, data) => {
    console.log(data);
    console.log('					AI v2 Slasher'.cyan)
	console.log(('				------------------------------').green);
    console.log(('					Loaded Client').cyan);
    console.log(('				------------------------------').green);
});
const Reader = require('./reader')
const proxyAgent = require('proxy-agent');
const http = require('http');
const chalk =require ('chalk');
const Protocol = require('./Protocol')
const LegacyProtocol = require('./LegacyProtocol')
const ModernProtocol = require('./ModernProtocol')
const ProtocolStore = require('./ProtocolStore')
const encryption = require('./encryption')
const test = require('./test.js')
const phantomserver = require('./phantomServer.js')
const beta = require('./Beta.js')
const request = require('request');
const WebSocket = require('ws');
let requestingSpectate = require('request');
const fs = require('fs');

const game = {
    url: 'https://fanix.io/',
    protocolVersion: 6,
    clientVersion: 21003,
}
let bufKey = 8 ^ 0x146124 >>> Math.imul(12376123678123, 6) >>> 0x12673718723;
let sBuf = 8 ^ (12371928736123871 ^ 125230845723) >>> Math.imul(1123123, 2183123) ^ 12345623478;
const compatProtocolVersion = 6;
const initKey1 = new Buffer([254, compatProtocolVersion, 0, 0, 0]); // First init key changes with the protocol version.
let initKey2 = new Buffer([255, 114, 97, 103, 79]); // Got by our phantom server, changes hourly.
const defaultBorders = { // Default map borders
	minX: -7071.067811865475,
	minY: -7071.067811865475,
	maxX:  7071.067811865475,
	maxY:  7071.067811865475
};

const defaultHeaders = {};
defaultHeaders["Accept-Encoding"] = "gzip, deflate";
defaultHeaders["Accept-Language"] = "en-CA,en-GB;q=0.9,en-US;q=0.8,en;q=0.7";
defaultHeaders["Cache-Control"] = "no-cache";
defaultHeaders["Connection"] = "Upgrade";
defaultHeaders["Cookie"] = "__cfduid=d557d93bdc916c9975b9a56a883e425021533342031; _ga=GA1.2.115770575.1533950899";
defaultHeaders["Pragma"] = "no-cache";
defaultHeaders["Key"] = "ef9dedc";
defaultHeaders["Origin"] = "Origin";
defaultHeaders["Sec-WebSocket-Extensions"] = "permessage-deflate; client_max_window_bits";
defaultHeaders["User-Agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36";


let allProxyAgents = [];
let connectedUsers = 0;
let proxyAgents = [];
let config = {};
let id = Math.floor(Math.random() * 1000);
var clientX = 0,
	clientY = 0,
	aiMode =false;



function getProxy() {
	if (proxyAgents.length == 0) proxyAgents = allProxyAgents;
	return proxyAgents.shift();
}
if (fs.existsSync('./config.json')) {
	fs.readFile('./config.json', (err, data) => {
		let text = Buffer.from(data).toString();
		config = JSON.parse(text);
		getProxys();
	});
} else {
	let _default = {};
	_default.botNames = ["Slxsher"];
	_default.accounts = [""];
	_default.botskin = ""; +botNames
	_default.useProxyApi = true;
    _default.useCaptcha = false;
	_default.encryptMainKey = true;
	_default.useAccount = false;
	_default._0x431f = true;
	_default.maxBots = 100;
  _default.usecapchasolve = true;
	fs.writeFile('config.json', Buffer.from(JSON.stringify(_default, null, 20)), () => {});
	config = _default;
}

const dataBot = {
    ws: null,
    buffersKey: 0,
    isConnected: false,
    playersAmount: 0,
    lastPlayersAmount: 0,
    connect() {
        this.buffersKey = 0
        this.isConnected = false
        this.playersAmount = 0
        this.lastPlayersAmount = 0
        this.ws = new WebSocket(game.url)
        this.ws.onopen = this.onopen.bind(this)
        this.ws.onmessage = this.onmessage.bind(this)
        this.ws.onclose = this.onclose.bind(this)
    },		
		
    send(buffer) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) this.ws.send(buffer)
		 if (this.encryptionKey) {
                buffer = algorithm.rotateBufferBytes(buffer, this.encryptionKey)
                this.encryptionKey = algorithm.rotateEncryptionKey(this.encryptionKey)
            }	
    },
     onopen(){
        this.send(buffers.protocolVersion(game.protocolVersion))
        this.send(buffers.clientVersion(game.clientVersion))
        this.isConnected = true
    },
    onmessage(message) {
        if (this.buffersKey) message.data = algorithm.rotateBufferBytes(message.data, this.buffersKey)
        this.handleBuffer(message.data)
    },
    onclose() {
        if (this.isConnected) {
            this.isConnected = false
            this.connect()
            console.log('[SERVER] DataBot disconnected')
        }
    },
}

function getProxys() {
	if (config.useProxyApi) {
		request('https://api.proxyscrape.com?request=getproxies&proxytype=socks5&timeout=10000&country=all', (err, req, body) => {
			let proxies = body.replace(/\r/g, '').split('\n');
			proxies.forEach(proxy => {
				allProxyAgents.push(new proxyAgent(`socks://${proxy}`));
			});
			console.log(`Got ${proxies.length} proxies!`.green);
		});
	} else {
		fs.readFile('./Sproxies.txt', (err, data) => {
			let proxies = data.toString().replace(/\r/g, '').split('\n');
			proxies.forEach(proxy => {
				allProxyAgents.push(new proxyAgent(`socks://${proxy}`));
			});
			console.log(`Got ${proxies.length} proxies!`.yellow);
		});
	}
}
class Bot {
	constructor(origin, client) {
		this.client = client;
		this.pelletsMode= false;
		this.playerNodes = [];
		this._borders = Object.assign({}, defaultBorders); // Copy of default borders
		this.playerNodeIds = [];
		this.allNodes = [];
		this.eatingEvents = [];
		this.headers = JSON.parse(JSON.stringify(defaultHeaders));
		this.originSplit = origin.split('/')[2];
		this.nameInterval = null;
		this.name = true;
		this.proxy = getProxy();
		this.origin = origin;
		this.stopped = true;
		this.ws = true;
		this.ip = true;
		this.sId = 0;
		this.id = id;
        this.started = false;
        this.x = this.y = this.clientX = this.clientY = 0;
        this.moveTo = 'mouse';
        this.mouseInt = 0;
        var encryptionKey = true;

	}
reset() { // Reset the bot class for it to be used another time.
		agarViewBots[this._agarViewBotID] = false;
		this._cells = {};
		this._bestCell = null;
		this._waitingForToken = false;
		this._unuseableProxy = false;
		this._spawned = false;
		this._bestDistance = 99999999;
		this._unknownPackets = 0;
		this._decryptionKey = 0;
		this._encryptionKey = 0;
		this._agarViewBotID = -1;
		this._leaderboard = {};
		this._botCellIDS = [];
		this._offsetX = 0;
		this._offsetY = 0;
		this._key241 = 0;
		this._key255 = 0;
		this._lastBorderTime = Date.now();
	}
 
	connect(ip, balz) {
		if (!balz && this.originSplit == 'bubble.am') return this.balz(ip);
		this.stopped = false;
		this.ip = ip;
		this.headers.Origin = this.origin;
		this.ws = new WebSocket(this.ip, {
			headers: this.headers,
			agent: this.proxy
		});
		this.ws.binaryType = 'nodebuffer';
		this.ws.onopen = this.onopen.bind(this);
		this.ws.onmessage = this.onmessage.bind(this);
		this.ws.onerror = this.onerror.bind(this);
		this.ws.onclose = this.onclose.bind(this);
	}

	handleWorldUpdate(buf) {
		
		let off = 0;
		if (buf.readUInt8(off++) != 16) return false;
		let eatRecordLength = buf.readUInt16LE(off);
		off += 2;
		
		this.eatingEvents = [];
		for (let i = 0; i < eatRecordLength; i++) {
			this.eatingEvents.push({
				eater: buf.readUInt32LE(off),
				victim: buf.readUInt32LE(off + 4)
			});

			off += 8;
		}
		
		while (true) {
			let n = new Node();

			n.id = buf.readUInt32LE(off);
			off += 4;
			if (!n.id) break;

			n.x = buf.readInt16LE(off);
			off += 2;
			n.y = buf.readInt16LE(off);
			off += 2;
			n.size = buf.readInt16LE(off);
			off += 2;

			n.color = {
				r: buf.readUInt8(off++),
				g: buf.readUInt8(off++),
				b: buf.readUInt8(off++)
			};

			n.flags = buf.readUInt8(off++);

			if (n.flags & 2) off += 4;
			if (n.flags & 4) off += 8;
			if (n.flags & 8) off += 16;

			let ch = 0;
			n.name = '';
			do {
				n.name += String.fromCharCode((ch = buf.readUInt16LE(off)));
				off += 2;
			} while (ch != 0);

			if (this.allNodes.hasOwnProperty(n.id)) {
				this.allNodes[n.id] = n;
			} else {
				this.allNodes[n.id] = n;
			}
		}
		
		let removeQueueLength = buf.readUInt32LE(off);
		off += 4;
		for (let i = 0; i < removeQueueLength; i++) {
			let id = buf.readUInt32LE(off);
			off += 4;

			if (this.allNodes.hasOwnProperty(id)) {
				delete this.allNodes[id];
			}
		}

		return true;
	}

	collectPellets(botUserX, botUserY, byteLen) {
		let clientX = 0,
			clientY = 0,
			count = 0,
			smallestSize = 10000;

		for (let i = 0; i < this.playerNodeIds.length; i++) {
			if (this.allNodes.hasOwnProperty(this.playerNodeIds[i])) {
				let node = this.allNodes[this.playerNodeIds[i]];
				clientX += node.x;
				clientY += node.y;
				if (node.size < smallestSize) smallestSize = node.size;
				count++;
			}
		}

		clientX /= count;
		clientY /= count;

		let followNode = true;

		let bestDistance = 10000.0;

		Object.keys(this.allNodes).forEach(key => {
			let node = this.allNodes[key];
			if (node.size < smallestSize * 0.85) {
				let dist = Math.abs(node.x - clientX) + Math.abs(node.y - clientY);
				if (dist < bestDistance) {
					bestDistance = dist;
					followNode = node;
				}
			}
		});
		if (followNode) {
			let moveBuffer = Buffer.alloc(byteLen);
			moveBuffer.writeUInt8(16, 0);
			switch (byteLen) {
				case 13:
				case 9:
					moveBuffer.writeInt32LE(followNode.x, 1);
					moveBuffer.writeInt32LE(followNode.y, 5);
					break;
				case 21:
					moveBuffer.writeDoubleLE(followNode.x, 1); 
					moveBuffer.writeDoubleLE(followNode.y, 9);
					break;
				case 16:
					moveBuffer.writeIntDoubleLE(followNode.x, 1) + moveBuffer.writeInDoubleLE(followNode.x, 17) / 2;
					moveBuffer.writeIntDoubleLE(followNode.y, 9) + moveBuffer.writeInDoubleLE(followNode.y, 25) / 2;			 
					break;
					
			    case 241:
                    this.decryptionKey = reader.readInt32()
                     this.encryptionKey = murmur2(`${game.url.match(/(live-arena-\w+\.bubble\.am)/)[1]}${reader.readString()}`, 255)
                     this.isConnected = true
                     break;
			    
			}
			this.send(moveBuffer);
		}
		//this.sendMoveTo(clientX, clientY);
	}
function (useCaptcha) {
	if (config.useCaptcha)
    var buf = new Buffer(1 + (token.length + 1));
    buf.writeUInt8(100, 0);
    for (let i = 1;i < token.length + 1; i++) buf.writeUInt8(token.charCodeAt(i), i);
    this.send(buf);
	console.log(`${token.length} token!`.green);
  }
	balz(ip) {
		let finIp = ip.split('?')[0];
		let ws = new WebSocket('wss://bubble.am/', {
			agent: this.proxy
		});
		ws.onclose = ws.onerror = ws.onopen = () => {};
		ws.onmessage = msg => {
			msg = JSON.parse(msg.data);
			switch (msg[0]) {
				case 0:
					this.sId = msg[1][0];
					finIp += '?session=' + msg[1][1];
					this.connect(finIp, true);
					break;
				case 1:
					ws.send('[1]');
					break;
			}
		};
	}
	onopen() {
		let inits = Buffer.alloc(5);
		inits.writeUInt8(254, 0); + global.ProtocolVersion;
		switch (this.originSplit) {
			case 'agocell.eu':
			case 'slig.io':
			case 'ixgar.net':
			case 'popsplit.us':
			case 'nagar.eu':
			case 'balz.io':
			case 'agar.vin':
			case 'agarix.ru':
			case 'cells.ga':
			case 'game.ex-script.com':
				case 'www.agarserv.com/':
				case 'ogar.be':
							case 'studio.tialight.com':
				case 'ultrex.io':
			case 'agario.top':
				case 'agario.us':
			case 'cellagar.ml':
				case 'game.ex-script.com':
			case 'germs.io':	
			case 'mk-agario.glitch.me':
			case 'agix.pw':
			case 'germs.io':
			case 'agarios.org':
			case 'dummyclient.glitch.me':
			case 'www.agar-kicoo.tk':
			case 'ac-clan.glitch.me':
			case 'gota.io':
				case 'ixagar.net':
			case 'agarcell.ml':
			case 'zgar.glitch.me':
			case 'agar.ovh':
			case 'sxold.glitch.me':
			case 'agarx.biz' :
			case 'powerline.io':
			case 'de.agar.bio':
			case 'gaver.io':
				case 'play.mitos.is':
				case 'agariocity.pro':
				case 'gota.io':
			case 'agariobox.org':
				case 'play.agario0.com':
					case 'zgar.glitch.me':
        case 'cell.sh':
				inits.writeUInt32LE(1, 1);
				break;
				case 'agarflix.com':
					case 'www.agarserv.com/':
					inits.writeUInt32LE(4, 1, true);
					break;
			case 'army.ovh':
				case 'game.ex-script.com':
			case 'gaver.io':
				case 'ixagar.net':
					case 'www.agarserv.com/':
			case 'agar.space':
				case 'gota.io':
									case 'agario.us':
				case 'ultrex.io':
					case 'www.agarserv.com/':
					case 'play.mitos.is':
					case 'http://agar.wiki':
				case 'm.agar.bio':
					case 'de.agar.bio':
					case 'agarz.com':
						case 'blobgame.io':
							case 'agarioserver.club':
			case 'agarprivateservers.org':
				inits.writeUInt32LE(5, 1);
				break;
			case 'balz.io':
				inits.writeUInt32LE(6, 1);
				break;
				let strings = [config.botNames[Math.floor(Math.random() * config.botNames.length)], '', '', '', ''];  // ['onxcnk_101', Math.random().toString(36).substr(2, 5)];
				let stringsLen = 0;
				strings.map(a => stringsLen += a.length * 2);
				inits = Buffer.alloc(1 + strings.length * 2 + stringsLen);
				var i = 0;
				inits.writeUInt8(252, i++);
				strings.forEach(string => {
					inits.writeUInt16LE(string.length, i);
					i += 2;
					inits.write(string, i, 'utf16le');
					i += string.length * 2;
				});
				break;
		}
		this.send(inits);
	var t = Buffer.alloc(5);
		inits = Buffer.alloc(5); + global.Protocolkey;
		inits.writeUInt8(255, 0);
		switch (this.originSplit) {
			case '3.8.133.173':
						case 'studio.tialight.com':
			case 'cells.ga':
			case 'slig.io':
			case 'ixgar.net':
			case 'agar.vin':
			case 'agarix.ru':
			case 'popsplit.us':
			case 'm.agar.bio':
			case 'ogar.be':
			case 'nagar.eu':
				case 'de.agar.bio':
			case 'army.ovh':
			case 'balz.io':
			case 'agar.space':
			case 'cellagar.ml':
			case 'agocell.eu':
			case 'moomoo.io':
			case 'germs.io':
				case 'game.ex-script.com':
			case 'mk-agario.glitch.me':
			case 'agix.pw':
			case 'agarios.org':
			case 'biobots.tk':
			case 'dummyclient.glitch.me':
			case 'dual-agar.me':
								case 'agario.us':
			case 'ac-clan.glitch.me':
			case 'agarcell.ml':
			case 'zgar.glitch.me':
				case 'www.agarserv.com/':
				case 'ultrex.io':
			case 'agar.ovh':
				case 'm.agar.bio':
					case 'de.agar.bio':
			case 'sxold.glitch.me':
			case 'ixagar.net':
			case 'powerline.io':
				case 'play.mitos.is':
			case 'agariopvp.org':
			case 'agarprivateservers.org':
			case 'www.agar-kicoo.tk':
			case 'gaver.io':
				case 'gota.io':
					case 'agariocity.pro':
			case 'agariobox.org':
						case 'agarflix.com':
				case 'de.agar.bio':
				case 'game.ex-script.com':
				case 'zgar.glitch.me':
        case 'cell.sh':
				inits.writeUInt32LE(1332175218, 1, true);
				break;	
				case 'agarioserver.club':
					case 'www.agarserv.com/':
						inits.writeUInt32LE(2200049715, 1);
					break;
				case 'm.agar.bio':
					case 'www.agarserv.com/':
					case 'game.ex-script.com':
					case 'de.agar.bio':
						case 'play.mitos.is':
					case 'ultrex.io':
			case 'http://targ.io/':	
					case 'http://agar.wiki':
									case 'agario.us':
					case 'ixagar.net':
						case 'www.agarserv.com/':
			case 'http://agario.tech/':			
                inits.writeUInt32LE(1, 123456789, true);
                break;
				case 'www.agarserv.com/':
				case 'play.mitos.is':
					case 'game.ex-script.com':
				case 'ultrex.io':
						case 'agar.rs':
				inits.writeUInt32LE(1332775218, 1);
				break;
				case 'gar.pro':
			case 'balz.io':
					case 'agar.rs':
			inits.writeUInt32LE(1, 1);
			break;
			
			case 'agarix.ru':
			inits.writeUInt32LE(6, 1);
			break;
			
			              case 'agar.rs':
						  case 'bubble.am':
						   inits = Buffer.alloc(5);
						   inits.writeUInt8(254, 0);
                           break;  
						   
						 		case 'agar.rs':
								case 'bubble.am':
						  inits = Buffer.alloc(5);
						  inits.writeUInt8(255, 0);
						  break;
						  
			case 'agar.lol':
            inits = Buffer.alloc(5); 
            inits.writeUInt8(254, 0);
            inits.writeUInt32LE(5, 1, true);
            inits = Buffer.alloc(5);
            inits.writeUInt8(255, 0);
            inits.writeUInt32LE(2200049715, 1, true);
            this.send(inits);
            break;
			
			case 'agarabi.com':
			inits = Buffer.alloc(5); 
		    inits.writeUInt8(254, 0);
			inits.writeUInt32LE(5, 1, true);			
			inits = Buffer.alloc(5);
			inits.writeUInt8(255, 0);
			inits.writeUInt32LE(154669603, 1, true);
			this.send(inits);
			break;
			
			case 'agariomachos.com':
            inits = Buffer.alloc(5); 
			inits.writeUInt8(254, 0);
            inits.writeUInt32LE(13, 1, true);            
            inits.writeUInt32LE(5);
			inits.writeUInt8(255, 0);
            inits.writeUInt32LE(4203044711, 1, true);
            this.send(inits);
			//*inits = createDataView(1 + name.length);
			inits.writeUInt8(80, 0);
			this.send(inits);
            break;
			
			case 'agar.style':
			inits = Buffer.alloc(5); + global.ProtocolVersion;
		    inits.writeUInt8(254, 0);
			inits.writeUInt32LE(5, 1, true);			
			inits = Buffer.alloc(5);
			inits.writeUInt8(255, 0);
			inits.writeUInt32LE(1332775218, 1);
			this.send(inits);
			break;
			
			
			case 'www.ogarion.com':
			inits = Buffer.alloc(5); + global.ProtocolVersion;
		    inits.writeUInt8(254, 0);
			inits.writeUInt32LE(4, 1);			
			inits = Buffer.alloc(5);
			inits.writeUInt8(255, 0);
			inits.writeUInt32LE(154669603, 1);
			this.send(inits);
			break;
			
		 case 'agar.cc':
			inits = Buffer.alloc(5); + global.ProtocolVersion;
		    inits.writeUInt8(254, 0);
			inits.writeUInt32LE(5, 1);			
			inits = Buffer.alloc(5);
			inits.writeUInt8(255, 0);
			inits.writeUInt32LE(123456789, 1, true);
			this.send(inits);
			break;
			
			
		 case 'agar.rip':
			inits = Buffer.alloc(5); + global.ProtocolVersion;
		    inits.writeUInt8(254, 0);
			inits.writeUInt32LE(5, 1);			
			inits = Buffer.alloc(5);
			inits.writeUInt8(255, 0);
			inits.writeUInt32LE(123456789, 1, true);
			this.send(inits);
			break;
			
			
		case 'agario.org.uk':
			inits = Buffer.alloc(5); + global.ProtocolVersion;
		    inits.writeUInt8(254, 0);
			inits.writeUInt32LE(5, 1);			
			inits = Buffer.alloc(5);
			inits.writeUInt8(255, 0);
			inits.writeUInt32LE(123456789, 1, true);
			this.send(inits);
			break;	
			
		case 'bestagario.org':
			inits = Buffer.alloc(5); + global.ProtocolVersion;
		    inits.writeUInt8(254, 0);
			inits.writeUInt32LE(5, 1);			
			inits = Buffer.alloc(5);
			inits.writeUInt8(255, 0);
			inits.writeUInt32LE(123456789, 1, true);
			this.send(inits);
			break;	
			
			
			 case 'agariogame.club':
			inits = Buffer.alloc(5); + global.ProtocolVersion;
		    inits.writeUInt8(254, 0);
			inits.writeUInt32LE(6, 1);			
			inits = Buffer.alloc(5);
			inits.writeUInt8(255, 0);
			inits.writeUInt32LE(154669603, 1, true);
			this.send(inits);
			break;
			
			case 'agario.website':
			inits = Buffer.alloc(5); + global.ProtocolVersion;
		    inits.writeUInt8(254, 0);
			inits.writeUInt32LE(5, 1, true);			
			inits = Buffer.alloc(5);
			inits.writeUInt8(255, 0);
			inits.writeUInt32LE(154669603, 1, 1);
			this.send(inits);
			break;
			
		case 'agario.se':	
        inits = Buffer.alloc(5); + global.ProtocolVersion;
        inits.writeUInt8(254, 0);
        inits.writeUInt32LE(1, 1, true);
        inits = Buffer.alloc(5); + global.ProtocolVersion;
        inits.writeUInt8(255, 0);
        inits.writeUInt32LE(1332175218, 1, true);
        break;
			
			
			case 'prosplit.io':
			inits = Buffer.alloc(5); + global.ProtocolVersion;
		    inits.writeUInt8(254, 0);
			inits.writeUInt32LE(5, 1, true);			
			inits = Buffer.alloc(5);
			inits.writeUInt8(255, 0);
			inits.writeUInt32LE(154669603, 1, 1);
			this.send(inits);
			break;
			
			case 'agar.ist':
			inits = Buffer.alloc(5); + global.ProtocolVersion;
		    inits.writeUInt8(254, 0);
			inits.writeUInt32LE(5, 1);			
			inits = Buffer.alloc(5);
			inits.writeUInt8(255, 0);
			inits.writeUInt32LE(154669603, 1, true);
			this.send(inits);
			break;
			
			case 'agariox.net':
			inits = Buffer.alloc(5); + global.ProtocolVersion;
		    inits.writeUInt8(254, 0);
			inits.writeUInt32LE(5, 1);			
			inits = Buffer.alloc(5);
			inits.writeUInt8(255, 0);
			inits.writeUInt32LE(154669603, 1, true);
			this.send(inits);
			break;
			
			case 'pok.ist':
			inits = Buffer.alloc(5); + global.ProtocolVersion;
		    inits.writeUInt8(254, 0);
			inits.writeUInt32LE(5, 1);			
			inits = Buffer.alloc(5);
			inits.writeUInt8(255, 0);
			inits.writeUInt32LE(1332175218, 1, true);
			this.send(inits);
			break;
			
			case 'agariotime.space':
			inits = Buffer.alloc(5); + global.ProtocolVersion;
		    inits.writeUInt8(254, 0);
			inits.writeUInt32LE(5, 1);			
			inits = Buffer.alloc(5);
			inits.writeUInt8(255, 0);
			inits.writeUInt32LE(1332175218, 1, true);
			this.send(inits);
			break;
			
			case 'agariohub.club':
			inits = Buffer.alloc(5); + global.ProtocolVersion;
		    inits.writeUInt8(254, 0);
			inits.writeUInt32LE(5, 1);			
			inits = Buffer.alloc(5);
			inits.writeUInt8(255, 0);
			inits.writeUInt32LE(1332175218, 1, true);
			this.send(inits);
			break;
			
			case 'agar.vin':
			inits = Buffer.alloc(5); + global.ProtocolVersion;
		    inits.writeUInt8(254, 0);
			inits.writeUInt32LE(4, 1);			
			inits = Buffer.alloc(5);
			inits.writeUInt8(255, 0);
			inits.writeUInt32LE(1332175218, 1, true);
			this.send(inits);
			break;
			
			
			case 'betteragario.com':
			inits = Buffer.alloc(5); + global.ProtocolVersion;
		    inits.writeUInt8(254, 0);
			inits.writeUInt32LE(5, 1);			
			inits = Buffer.alloc(5);
			inits.writeUInt8(255, 0);
			inits.writeUInt32LE(154669603, 1, true);
			this.send(inits);
			break;
			
		    case 'cells.ga':
			inits.writeUInt32LE(5, 1);
			inits.writeUInt32LE(1332175218, 1, 1);
			this.send(inits);
			break;
			
			case 'agar.team':
			inits = Buffer.alloc(5); + global.ProtocolVersion;
		    inits.writeUInt8(254, 0);
			inits.writeUInt32LE(5, 1);			
			inits = Buffer.alloc(5);
			inits.writeUInt8(255, 0);
			inits.writeUInt32LE(123456789, 1, true);
			this.send(inits);
			break;
			
			 case 'agarprivateservers.net':
			inits = Buffer.alloc(5); + global.ProtocolVersion;
		    inits.writeUInt8(254, 0);
			inits.writeUInt32LE(5, 1, true);
			inits = Buffer.alloc(5);
			inits.writeUInt8(255, 0);
			inits.writeUInt32LE(154669603, 1, true);
			this.send(inits);
			break;
			
			case 'mogar.io':
			case 'agar.one':
			case 'agario.top':
            inits = Buffer.alloc(5);
			inits.writeUInt8(224, 0);
            inits.writeUInt32LE(5, 1, true);
			inits.writeUInt8(225, 0);
            inits.writeUInt32LE(154669603, 1, true);
            this.send(inits);
            break;
			 case 'agario.fun':
			inits = Buffer.alloc(5); + global.ProtocolVersion;
		    inits.writeUInt8(254, 0);
			inits.writeUInt32LE(5, 1, true);
			inits = Buffer.alloc(5);
			inits.writeUInt8(255, 0);
			inits.writeUInt32LE(154669603, 1, true);
			this.send(inits);
			break;
			
			case 'agar,yt':
			inits = Buffer.alloc(5); + global.ProtocolVersion;
		    inits.writeUInt8(254, 0);
			inits.writeUInt32LE(5, 1, 0);
			inits = Buffer.alloc(5);
			inits.writeUInt8(255, 0);
			inits.writeUInt32LE(2200049715, 1, 0);
			this.send(inits);
			break;
			
			case 'ogar.be':
			inits.writeUInt32LE(1, 1);
			inits.writeUInt32LE(1332175218, 1, 1);
			this.send(inits);
			break;
				
			case 'fanix.io':
			inits = Buffer.alloc(5);
			inits.writeUInt8(255, 0);
			inits.writeUInt32LE(154669603, 1, true);
			this.send(inits);
		    break;
			
			case 'fanix.io':
			this.send(Buffer.from([254, 6, 0, 0, 0]));
			this.send(Buffer.from([255, 0, 0, 0, 37]));
			this.send(Buffer.from([1]));
			this.send(Buffer.from([19]));
			this.send(Buffer.from([254]));
		    break;
			
			case 'agario2.space':
			this.send(Buffer.from([254, 5, 0, 0, 0]));
			this.send(Buffer.from([255, 21, 205, 91, 7]));
			this.send(Buffer.from([19]));
		    break;
			
			case 'agar.team':
			this.send(Buffer.from([254, 5, 0, 0, 0]));
			this.send(Buffer.from([255, 21, 205, 91, 7]));
			this.send(Buffer.from([19]));
		    break;
			
			case 'agar.cx':
			this.send(Buffer.from([254, 5, 0, 0, 0]));
			this.send(Buffer.from([255, 21, 205, 91, 7]));
			this.send(Buffer.from([19]));
		    break;
			
			case 'agarix.ru':
			this.send(Buffer.from([254, 6, 0, 0, 0]));
			this.send(Buffer.from([255, 1, 0, 0, 0]));
			this.send(Buffer.from([115, 231]));
		    break;
			 
			
			case 'agar.vin':
			inits.writeUInt32LE(4, 1, true);			
			inits.writeUInt32LE(1332175218, 1, true);
			this.send(inits);
			break;
							case 'agarz.com':
				case 'm.agar.bio':
					case 'de.agar.bio':
						case 'www.agarserv.com/':
						case 'blobgame.io':
						case 'ultrex.io':
				inits.writeUInt32LE(154669603, 1);
				break;
			
		}
		this.send(inits);

		switch (this.originSplit) {
		
		    case 'agar.pro':
			 inits.writeUInt32LE(31);
			 inits.writeUInt32LE(19);
			 this.send(inits);
			break;
			
			
				case 'krunker.io':
					this.send(Buffer.from([[146, 162, 112, 111, 144, 13, 5]]));
					break;
								case 'agariobox.org':
				this.send(Buffer.from([254]));
				break;
				
			case 'agario.cafe':
			this.send(Buffer.from([19]));
			break;
			
			case 'nagar.eu':
				this.send(Buffer.from([254]));
                break;
            case 'vanis.io':				
				 setInterval(() => {
					this.send(Buffer.from([3]));
					this.send(Buffer.from([11, 0]));
					this.send(Buffer.from([12, 0]));
				}, 500);
            		break;
				break;
			case 'agar.one':
				this.send(Buffer.from([254, 5, 0, 0, 0]));
				this.send(Buffer.from([255,35,18,56,9]));
                this.send(Buffer.from([19]))
				break;
			case 'cellz.io':
				this.send(Buffer.from([254, 5, 0, 0, 0]));
				this.send(Buffer.from([255, 0, 0, 0, 0]));
                this.send(Buffer.from([32, 0]));
				this.send(Buffer.from([32, 118, 93, 4, 0]));
				this.send(Buffer.from([78]));
					break;
			case 'slig.io':
				this.send(Buffer.from([254, 5, 0, 0, 0]));
				this.send(Buffer.from([255, 35, 18, 56, 9]));
				this.send(Buffer.from([80, 35, 18, 56, 9]));
                this.send(Buffer.from([19]));
				break;
			case 'minions.vin':
				this.send(Buffer.from([254, 5, 0, 0, 0]));
				this.send(Buffer.from([255, 35, 18, 56, 9]));
				this.send(Buffer.from([80, 35, 18, 56, 9]));
                this.send(Buffer.from([19]));
				break;	
            
            case 'agario.ioschool.space':
				this.send(Buffer.from([254, 5, 0, 0, 0]));
				this.send(Buffer.from([255, 21, 205, 91, 7]));
                this.send(Buffer.from([19]));
				break;	
					
			case 'inciagario.net':
				this.send(Buffer.from([87, 1, 0, 0, 0]));
				this.send(Buffer.from([100, 114, 97, 103, 79]));
                this.send(Buffer.from([19]));
				break;
				
				
			case 'paper-io.com':
				this.send(Buffer.from([254, 111, 0, 0, 0]));
				this.send(Buffer.from([255, 87, 4, 0, 0]));
                this.send(Buffer.from([253, 2]));
				this.send(Buffer.from([0, 80, 0, 65, 0, 80, 0, 69, 0, 82, 0, 46, 0, 73, 0, 79, 0, 58, 0, 58, 0, 58, 0, 58, 0, 58, 0, 58, 0, 58, 0, 58, 0, 58, 0, 58, 0, 51, 0]));
                this.send(Buffer.from([77, 42, 0]));
				this.send(Buffer.from([99, 0, 42, 0, 42, 0, 42, 0, 112, 0, 108, 0, 97, 0, 121, 0, 101, 0, 114, 0, 101, 0, 110, 0, 116, 0, 101, 0, 114, 0, 42, 0, 42, 0, 42, 0]));
				break;
					
				case 'agar.style':
				case 'minions.vin':
                this.send(Buffer.from([19]));
				break;
				
				case 'agarflix.com':
				this.send(Buffer.from([254,4,0,0,0]));
				this.send(Buffer.from([255,114,97,103,79]));
								this.send(Buffer.from([17]));
			//	this.send(Buffer.from([192,78,0,101,0,121,0,66,0,111,0,116,0,115,0,46,0,99,0,111,0,109,0]));
					break;
			case 'agar.rs':
				this.send(Buffer.from([254, 1, 0, 0, 0]));
				this.send(Buffer.from([255, 114, 97, 103, 79]));
			    this.send(Buffer.from([0, 74, 0, 74, 0, 105, 0, 109, 0, 101, 0, 110, 0, 101, 0, 122, 0, 95, 0, 49, 0, 53, 0, 32, 0, 66, 0, 111, 0, 116, 0]));
		 	    this.send(Buffer.from([21]));
				this.send(Buffer.from([19]));
				break;
				
			case 'ixgar.net':
			setInterval(() => {
		 	    this.send(Buffer.from([131]));
				this.send(Buffer.from([130]));
				}, 500);
            	break;
				
				case 'cell.sh':
				this.send(Buffer.from([17, Math.floor(Math.random() *5)]));
                this.send(Buffer.from([254, 145, 1, 0, 0]));
				this.send(Buffer.from([255, 150, 86, 189, 73]));
				this.send(Buffer.from([0]));
				this.send(Buffer.from([19]));
                break;
				case 'ixagar.net':
				this.send(Buffer.from([252,8,0,108,0,119,0,103,0,97,0,45,0,49,0,49,0,48,0,6,0,69,0,55,0,57,0,111,0,118,0,81,0]));
				this.send(Buffer.from([30,8,0,80,0,114,0,111,0,102,0,105,0,108,0,101,0,49,0,0,0,32,0,104,0,116,0,116,0,112,0,58,0,47,0,47,0,105,0,120,0,97,0,103,0,97,0,114,0,46,0,110,0,101,0,116,0,47,0,115,0,107,0,105,0,110,0,115,0,47,0,114,0,105,0,110,0,103,0,46,0,112,0,110,0,103,0,6,0,69,0,55,0,57,0,111,0,118,0,81,0,32,0,104,0,116,0,116,0,112,0,58,0,47,0,47,0,105,0,120,0,97,0,103,0,97,0,114,0,46,0,110,0,101,0,116,0,47,0,115,0,107,0,105,0,110,0,115,0,47,0,114,0,105,0,110,0,103,0,46,0,112,0,110,0,103,0]));
								this.send(Buffer.from([1]));
				break;
			
			case 'agarabi.com':
			this.send(Buffer.from([254, 5, 0, 0, 0]))
			this.send(Buffer.from([255,21,205,91,7]))
			this.send(Buffer.from([19]));
			break;
							case 'play.mitos.is':
				                this.send(Buffer.from([0,0,0,4,0,0,0,4,64,0,0,0,0]));
                this.send(Buffer.from([0,0,0,20,0,0,0,19,48,39,163,162,165,132,112,203,217,216,227,251,23,40,66,114,7,171,225,229,8]));
              //  this.send(Buffer.from([254]));
				break;
				case 'agario.fun':
                this.send(Buffer.from([19]));
                break;
				
                case 'germs.io':
                	this.send(Buffer.from([255]));
                	this.send(Buffer.from([123]));
                	break
                case 'powerline.io':
                this.send(Buffer.from([191, 160, 0, 78, 0]));
                this.send(Buffer.from([0]));
				this.send(Buffer.from([7, 94, 0, 78, 0]));
                setInterval(function() {
				this.send(Buffer.from([3, 83, 0, 108, 0, 97, 0, 115, 0, 104, 0, 101, 0, 114, 0, 45, 0, 65, 0, 73, 0, 0, 0]));
                this.send(Buffer.from([12, Math.floor(Math.random() *9)]));	
                }.bind(this), 1750 * 2)
                break;		
				case 'yoyowars.io':
                this.send(Buffer.from([123, 34, 110, 97, 109, 101, 34, 58, 34, 34, 125]));
                this.send(Buffer.from([19]));
				this.send(Buffer.from([123, 34, 116, 121, 112, 101, 34, 58, 53, 125]));
                break;	
			case 'play.agar.black':
	        var a = this;
			this["send"](Buffer.from([254 ,5, 0, 0, 0]));
            this["send"](Buffer.from([255, 35, 18, 56, 9]));
            this["send"](Buffer.from([90, 176, 33, 231, 85]));
			this["send"](Buffer.from([19]));
                setInterval(function() {
                this.send(Buffer.from([19]));				
                }.bind(this), 1750 * 2)
            	break;
			case 'agar.school':
	        var a = this;
			this["send"](Buffer.from([254 ,5, 0, 0, 0]));
            this["send"](Buffer.from([255, 35, 18, 56, 9]));
            this["send"](Buffer.from([90, 176, 33, 231, 85]));
			this["send"](Buffer.from([19]));
				setInterval(function() {
                this.send(Buffer.from([19]));				
                }.bind(this), 1750 *2)
            	break;
		    case 'agario.blue':
	        var a = this;
			this["send"](Buffer.from([254 ,5, 0, 0, 0]));
            this["send"](Buffer.from([255, 21, 205, 91, 7]));
			this["send"](Buffer.from([19]));
				setInterval(function() {
                this.send(Buffer.from([19]));				
                }.bind(this), 1750 *2)
            	break;	
			case 'astr.io':
            this.send(Buffer.from([0, 2, 4, 2, 0, 0]));
            this.send(Buffer.from([222, 78, 108, 63, 2]));
			this.send(Buffer.from([1, 0]));
            this.send(Buffer.from([2, 0, 0, 0]));
			this.send(Buffer.from([10, 0]));
			this.send(Buffer.from([30]));
			this.send(Buffer.from([80]));
            setInterval(function() {
                this.send(Buffer.from([222, 78, 108, 63, 2]));				
                }.bind(this), 2750)
            setInterval(function() {
                this.send(Buffer.from([30]));	
                this.send(Buffer.from([80]));
                }.bind(this), 1750 * 2)
            	break;
			case 'popsplit.us':
	        var a = this;
			this["send"](Buffer.from([32, 0]));
            setInterval(function() {
                }.bind(this), 1750 * 2)
            	break;	
				
			case 'agario-here.com':
	        var a = this;
			this["send"](Buffer.from([254 ,5, 0, 0, 0]));
            this["send"](Buffer.from([255, 35, 18, 56, 9]));
            this["send"](Buffer.from([90, 176, 33, 231, 85]));
			this["send"](Buffer.from([19]))
			 setInterval(function() {
                this.send(Buffer.from([90, 176, 33, 231, 85]));				
                }.bind(this), 2750)
                setInterval(function() {
                this.send(Buffer.from([19]));				
                }.bind(this), 1750 * 2)
            	break;
			case 'agar.life':
	        var a = this;
			this["send"](Buffer.from([254 ,5, 0, 0, 0]));
            this["send"](Buffer.from([255, 35, 18, 56, 9]));
            this["send"](Buffer.from([90, 176, 33, 231, 85]));
			this["send"](Buffer.from([19]));
                setInterval(function() {
                this.send(Buffer.from([19]));				
                }.bind(this), 1750 * 2)
				 setInterval(function() {
                this.send(Buffer.from([90, 176, 33, 231, 85]));				
                }.bind(this), 2750)
            	break;
				
		    case 'cellzio.website':
				this.send(Buffer.from([17]));
                this.send(Buffer.from([21]));
            	break
            case 'www.ogarion.com':
			case 'mk-agario.glitch.me':
			case 'dummyclient.glitch.me':
			case 'ac-clan.glitch.me':
			case 'agarcell.ml':
			case 'sxold.glitch.me':
			case 'zgar.glitch.me':
            case '3.8.133.173':
				this.send(Buffer.from([254, 5, 0, 0, 0]));
				this.send(Buffer.from([255, 0, 0, 0, 0]));
				break;
			case 'myagar.pro':
				this.send(Buffer.from([254, 6, 0, 0, 0]));
				this.send(Buffer.from([255, 1, 0, 0, 0]));
				this.send(Buffer.from([1]));
        this.send(Buffer.from([19]));
        this.send(Buffer.from([254]));
				break;
			case 'gota.io':
            					setInterval(() => {
					this.send(Buffer.from([71]));
				}, 500);
				break;
            case 'agariopvp.org':
				this.send(Buffer.from([254, 1, 0, 0, 0]));
                this.send(Buffer.from([255, 114, 97, 103, 79]));
                this.send(Buffer.from([19]));
             case 'www.agar-kicoo.tk':
            	this.send(Buffer.from([254, 6, 0, 0, 0]));
            //	this.send(Buffer.from([123,103,114,101,97,116,95,122,105,108,108,97,125,78,101,121,66,111,116,115,45,99,111,109,0]));
            	this.send(Buffer.from([255, 1, 0, 0, 0]));
            					setInterval(() => {
					this.send(Buffer.from([254]));
				}, 500);
            	break;
            	case 'army.ovh':
            					setInterval(() => {
					this.send(Buffer.from([254]));
				}, 500);
            		break;
       case 'cellcraft.io':
		    var a = this;
            this["send"](Buffer.from([254, 5, 0, 0, 0]));
            this["send"](Buffer.from([255, 50, 137, 112, 79]));
            this["send"](Buffer.from([90, 51, 24, 34, 131]));
			this["send"](Buffer.from([42]));
		     setInterval(function() {
                this.send(Buffer.from([90, 51, 24, 34, 131]));					
                }.bind(this), 2750)
			 setInterval(function() {
                this.send(Buffer.from([42]));
                this.send(Buffer.from([17]));				
                }.bind(this), 1750 * 2)
		    break;
		case 'ogar.be':
            this.send(Buffer.from([254, 5, 0, 0, 0]));
            this.send(Buffer.from([255, 114, 97, 103, 79]));
            setInterval(function() {
                this.send(Buffer.from([19]));					
                }.bind(this), 2750)
            break;
			
			case 'cellzio.website':
			    var a = this;
				this["send"](new Buffer([254, 5, 0, 0, 0]));
                this["send"](new Buffer([255, 0, 0, 0]));
				this["send"](new Buffer([0, 32, 0]));
				setInterval(function() {
                a["send"](new Buffer([0, 32, 0]))
                }, 1750 *2)
				break;
			
			
			case 'agar.red':
			this.send(Buffer.from([254, 6, 0, 0, 0]));
            this.send(Buffer.from([255, 1, 0, 0, 0]));
			this.send(Buffer.from([99, 0, 115, 0]));
			this.send(Buffer.from([254]));
		    break;	
            		            	case 'agarioserver.club':
            						this.send(Buffer.from([254,5,0,0,0]));
				this.send(Buffer.from([255,51,24,34,131]));
			//	this.send(Buffer.from([80]));
			//		this.send(Buffer.from([19]));
            		break;
			 case 'agix.pw':
				this.send(Buffer.from([0, 100, 0, 117, 0, 109, 0, 109, 0, 121, 0, 98, 0, 111, 0, 116, 0, 115, 0, 46, 0, 110, 0, 101, 0, 116, 0]));
				break;
						case 'www.agarserv.com/':
				this.send(Buffer.from([254, 1, 0, 0, 0]));
            	this.send(Buffer.from([255,114,97,103,79]));
            	break;	
				
			case 'agariomachos.com':
				this.send(Buffer.from([254, 13, 0, 0, 0]));
            	this.send(Buffer.from([255, 103, 95, 133, 250]));
				this.send(Buffer.from([18]));
            	break;	
				
			case 'bubble.am':
     		   this.send(Buffer.from([255, 51, 24, 146, 131]));
			   this.send(Buffer.from([254, 4, 0, 0, 0]));
			   this.send(Buffer.from([253, 56, 56, 48, 57, 54, 50, 98, 56, 102, 55, 98, 98, 100, 102, 97, 56, 53, 50, 48, 52, 97, 102, 99, 102, 52, 97, 52, 53, 57, 54, 99, 50, 100, 56, 102, 57, 48, 51, 55, 101]));
			   break;
				
			case 'mogar.io':
						case 'agario.top':
				this.send(Buffer.from([224, 5, 0, 0, 0]));
            	this.send(Buffer.from([225, 35, 18, 56, 9]));
				this.send(Buffer.from([19]));
            	break;	
				
				
			case 'gaver.io':
				this.send(Buffer.from([254, 5, 0, 0, 0]));
            	this.send(Buffer.from([255, 35, 18, 56, 9]));
            	this.send(Buffer.from([19]));
				setInterval(() => {
				this.send(Buffer.from([19]));
				}, 1750* 2);
            	break;
				
			case 'studio.tialight.com':
				this.send(Buffer.from([254, 6, 0, 0, 0]));
            	this.send(Buffer.from([255, 1, 0, 0, 0]));
				setInterval(() => {
				this.send(Buffer.from([254]));
				}, 500);
            	break;
				
			case 'cellsbox.io':
				this.send(Buffer.from([173, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
            	this.send(Buffer.from([239, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
            	this.send(Buffer.from([239, 211, 201, 255, 255, 168, 228, 255, 255, 0, 0, 0, 0]))
				this.send(Buffer.from([223]));
				this.send(Buffer.from([133]));
				this.send(Buffer.from([27]));
				setInterval(() => {
					this.send(Buffer.from([223]));
				}, 500);
            	break;	
				
            case 'agarprivateservers.org':
                this.send(Buffer.from([19]));
                break;
                			case 'ultrex.io':
									this.send(Buffer.from([254,6,0,0,0]));
					this.send(Buffer.from([145,110,111,116,97,98,111,116,0]));
					this.send(Buffer.from([146,116,114,117,101,0]));
					this.send(Buffer.from([255,1,0,0,0]));
					this.send(Buffer.from([0,60,110,111,110,101,62,102,114,101,101,116,122,121,116,42,33,42,0]));
				setInterval(() => {
					this.send(Buffer.from([254]));
				}, 500);
				break;
			case 'bubble.am':
				setInterval(() => {
					this.send(Buffer.from([254]));
				}, 1750* 2);
				break;
		}

            this.spawn();
		this.nameInterval = setInterval(() => {
			//console.log('Spawned');
			            // this.sendChat('-');
			this.spawn();
		}, 1000);
	}

	nameBypass() {
		function _0x67e0x24(_0x67e0x3) {
			for (var _0x67e0x4 = _0x67e0x3; _0x67e0x4 >= 36;) {
				_0x67e0x4 = ~~(_0x67e0x4 / 36) + _0x67e0x4 % 36
			};
			return _0x67e0x4.toString(36)
		}
		var _0x67e0x3 = Math.round(Date.now() / 1e3) % 1e3,
			_0x67e0x4 = 1e3 * (1e3 * (100 + Math.floor(900 * Math.random())) + _0x67e0x3) + (100 + Math.floor(900 * Math.random()));
		return _0x67e0x24(_0x67e0x4) + _0x67e0x4.toString(36) + function (_0x67e0x3) {
			var _0x67e0x4 = 1 / _0x67e0x3;
			for (; _0x67e0x4 < 100;) {
				_0x67e0x4 *= 19
			};
			return _0x67e0x24(~~_0x67e0x4)
		}(_0x67e0x4)
	}
			
	spawn() {
			let inits = Buffer.alloc(5);
		inits.writeUInt8(254, 0);
		let name = config.botNames[Math.floor(Math.random() * config.botNames.length)];
		let spawnBuffer = null;
		switch (this.originSplit) {
			case 'client.blobgame.io':
				case 'de.agar.bio':
				case 'agar.rs':
        var skins = ['inferno', 'chibi3-1', 'natsu', '133', 'agar', 'alexism'];
        var skin = skins[~~(Math.random() * skins.length)];
         name = `[${skin}]` + name + id;
				case 'www.ogarion.com':
							case 'agarabi.com':
					name = this.nameBypass() + '&' + name;
				spawnBuffer = Buffer.alloc(1 + Buffer.byteLength(name, 'ucs2'));
				spawnBuffer.write(name, 1, 'ucs2');
				break;
				name = this.nameBypass() + '&' + name;

			case 'dual-agar.me':
			case 'cellagar.ml':
				name = name + id;
			case 'agario.top':
				name = name + id;
				name = name + id;

      name = name;
        			//	spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
            //    spawnBuffer.write(name, 3, 'utf16le'); + this.bypassCaptcha();
                  spawnBuffer = Buffer.alloc(3 * Buffer.byteLength(name, 'utf16le'));
     spawnBuffer.write(name, 1, 'utf16le');
				break;
				case 'gota.io':
				name = name + Math.floor(Math.random() * 1000);
			//	spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
            //    spawnBuffer.write(name, 3, 'utf16le');
                  spawnBuffer = Buffer.alloc(3 * Buffer.byteLength(name, 'utf16le'));
     spawnBuffer.write(name, 1, 'utf16le');
				break;
												case 'www.agarserv.com/':
												case 'game.ex-script.com':
				name = name + Math.floor(Math.random() * 1000);
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
                spawnBuffer.write(name, 1, 'utf16le');
				break;
				case 'agar.lol' :
				case 'play.agario0.com':
					case 'ultrex.io':
					case 'agar.live':
						case 'agarioserver.club':
				name = name + Math.floor(Math.random() * 1000);
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
                spawnBuffer.write(name, 1, 'utf16le');
				break;
				
			case 'sxold.glitch.me':
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
                spawnBuffer.write(name, 5, 'utf16le');
                break;
                case 'blobgame.io':
                //			        name = name;
			//	spawnBuffer = Buffer.alloc(1 + Buffer.byteLength(name, 'utf16le'));
              //  spawnBuffer.write(name, 1, 'utf16le');
                      var skins = ['fly', 'fish', 'amber', 'spider', 'small_chick', 'carp', 'lobster', 'wasp', 'gopher', 'chick', 'sea_turtle', 'octopus', 'lizard', 'rabbit', 'pug', 'mouse', 'birdie', 'bat', 'owl', 'squirrel', 'rooster', 'cat', 'snake', 'crow', 'parrot', 'prey', 'chihuahua', 'fox', 'desert_fox', 'pig', 'dog', 'blackcat', 'coyote', 'goat', 'deer', 'bullking', 'seal', 'fury_cat', 'penguin', 'blueswirl', 'sly', 'husky', 'sheep', 'panda', 'cute_panda', 'angry_panda', 'bear', 'bear_', 'bearr', 'rhino_boxer', 'cougar', 'wolf', 'wolff', 'spirxo', 'sabertooth', 'panther', 'kempo_tiger', 'dark_wings', 'firebird', 'wolf_', 'lion_', 'yeti', 'lion', 'leo', 'king_lion', 'crocodile', 'croc', 'jackal', 'taurus', 'shark', 'colossus', 'orc_grunt', 'behemoth', 'mammoth', 'silver_tusk', 'dragon', 'beast', 'raptor', 't_rex', 'godzilla', 'basilisk', 'sentinel', 'poseidon', 'kraken', 'red_fiend', 'wendigo', 'jotun', 'ice_lord', 'medusa', 'reaper'];
        var skin = skins[~~(Math.random() * skins.length)];
        var rand = Math.random().toString(36).slice(2 + ~~(Math.random() * 6)); // temporary
         name = `<${skin}>${rand}`;
        spawnBuffer = Buffer.alloc(1 + Buffer.byteLength(name, 'utf16le'));
        spawnBuffer.write(name, 1, 'utf16le');
      //  this.send(spawnBuffer);
       spawnBuffer = Buffer.alloc(1);
       spawnBuffer.writeUInt8(1, 0);
       // this.send(spawnBuffer);
                break;
      case 'dummyclient.glitch.me':
    var skins = ['ammy', 'war', '13', 'berry', 'bub'];
    var skin = skins[~~(Math.random() * skins.length)];
    var rand = Math.random().toString(36).slice(2 + ~~(Math.random() * 6)); // temporary
    name = `<${skin}>` + name + id;
                		    case 'agariobox.org':
        case 'cell.sh':
		    name = name + id;
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
                spawnBuffer.write(name, 1, 'utf16le');
                break;
				
				
	    case 'inciagario.net':
		      name = this.nameBypass() + '&' + name;
		      spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
			  spawnBuffer.write(name, 3, 'utf16le');
              break
			  
            case 'agarx.biz' :
		        name = name + id;
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf8'));
                spawnBuffer.write(name, 3, 'utf8');
                break;
				
				
            case 'army.ovh':
			case 'vanis.io':
		        name = name + Math.floor(Math.random() * 1000);
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'ucs2'));
                spawnBuffer.write(name, 1, 'ucs2');
                	break
                	case 'www.agar-kicoo.tk':
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
				spawnBuffer.writeUInt16LE(59, 1);
				spawnBuffer.write(name, 3, 'utf16le');
                	break;
                	case 'germs.io':
		        name = name + Math.floor(Math.random() * 1000);
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'ucs2'));
                spawnBuffer.write(name, 1, 'ucs2');
                	break
				case 'agariomachos.com':
				var rand = Math.random().toString(36).slice(2 + ~~(Math.random() * 6)); // solve ip proxies
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'ucs2'));
                spawnBuffer.write(name, 3, 'ucs2');
                break	
		
		        name = name + Math.floor(Math.random() * 900);
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'ucs2'));
                spawnBuffer.write(name, 1, 'ucs2');
                	break
				case 'bubble.am':
				name = name;
				spawnBuffer = Buffer.alloc(1 + Buffer.byteLength(name, 'utf16le'));
                spawnBuffer.write(name, 1, 'utf16le');
				break;
				case 'sllig.io':
		        name = name + Math.floor(Math.random() * 500);
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'ucs2'));
                spawnBuffer.write(name, 1, 'ucs2');
                break;
				
				case 'popsplit.us':
		        name = name + Math.floor(Math.random() * 500);
				name = name + id;
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'ucs2'));
                spawnBuffer.write(name, 1, 'ucs2');
                break	
				
				case 'agario-here.com':
				name = name + id;
		        name = name + Math.floor(Math.random() * 900);
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'ucs2'));
                spawnBuffer.write(name, 1, 'ucs2');
                break
			
            case 'studio.tialight.com':
			    name = name + id;
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
				spawnBuffer.writeUInt8(0, 0);
				spawnBuffer.write(name, 1, 'utf16le');
				break;
			 case 'agarz.com':
			 case 'ixgar.net':
			    name = name + Math.floor(Math.random() * 500);
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
				spawnBuffer.write(name, 1, 'utf16le');
				break;	
            case 'agar.ovh':
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf8le'));
                spawnBuffer.write(name, 1, 'utf8le');
                break;
            case 'agar.io':
            	name = name + id;
                spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf8'));
				spawnBuffer.write(name, 3, 'utf8');
                break;
			case 'cellsbox.io':
            	name = name + id;
                spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf8'));
				spawnBuffer.write(name, 3, 'utf8');
                break;	
				
            case 'myagar.pro':
            	 name = name + Math.floor(Math.random() * 500);
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
				spawnBuffer.writeUInt16LE(0, 0);
				spawnBuffer.write(name, 1, 'utf16le');
                break;
				
            case 'mogar.io':
						case 'agario.top':
			case 'agariomachos.com':
			    name = name + Math.floor(Math.random() * 9000);
                var rand = Math.random().toString(36).slice(2 + ~~(Math.random() * 6)); // solve ip proxies
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
				spawnBuffer.write(name, 1, 'utf16le');
				this.send(new Uint8Array([19]));
                break;	
				
				
			case 'agario.fun':
            	 var rand = Math.random().toString(36).slice(2 + ~~(Math.random() * 6)); // solve ip proxies
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
				spawnBuffer.writeUInt16LE(59, 1);
				spawnBuffer.write(name, 1, 'utf16le');
                break;
			case 'agario.ioschool.space':
            	 var skins = ['24', '100', '60', '250', '66', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
                var skin = skins[~~(Math.random() * skins.length)];
                var rand = Math.random().toString(36).slice(2 + ~~(Math.random() * 6)); // solve ip proxies
		        name = `{${skin}}` + name + id;
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
				spawnBuffer.writeUInt16LE(192, 0);
				spawnBuffer.write(name, 1, 'utf16le');
                break;
			case 'agario.blue':
			     name = this.nameBypass() + '&' + name;
            	 var skins = ['24', '100', '60', '250', '66', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
                var skin = skins[~~(Math.random() * skins.length)];
                var rand = Math.random().toString(36).slice(2 + ~~(Math.random() * 6)); // solve ip proxies
		        name = `{${skin}}` + name + id;
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
				spawnBuffer.writeUInt16LE(192, 0);
				spawnBuffer.write(name, 1, 'utf16le');
                break;	
			
				case 'agar.red':
				name = this.nameBypass() + '&' + name;
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
				spawnBuffer.write(name, 1, 'utf16le');
                break;
				
				case 'betteragario.com':
                var rand = Math.random().toString(36).slice(2 + ~~(Math.random() * 6)); // solve ip proxies
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
				name = `{${skin}}` + name + id;
				spawnBuffer.writeUInt16LE(192, 0);
				spawnBuffer.write(name, 1, 'utf16le');
                break;
				
				case 'agario.website':
				var rand = Math.random().toString(36).slice(2 + ~~(Math.random() * 6)); // solve ip proxies
		        name = `{${skin}}` + name + id;
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
				spawnBuffer.write(name, 1, 'utf16le');
                break;
				
                case 'bomb.agar.bio':
                var rand = Math.random().toString(36).slice(2 + ~~(Math.random() * 6)); // solve ip proxies
                spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
                spawnBuffer.write(name, 1, 'utf16le');
                this.send(new Uint8Array([19]));
                setInterval(() => {
                    this.send(Buffer.from([65]))
                }, 3000);
                break;
			
				
				case 'minions.vin':
				 name = name + Math.floor(Math.random() * 500);
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
				spawnBuffer.writeUInt16LE(192, 0);
				spawnBuffer.write(name, 1, 'utf16le');
                break;
				
				 case 'agario.cafe':
            	 name = name + Math.floor(Math.random() * 500);
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
				spawnBuffer.writeUInt16LE(192, 0);
				spawnBuffer.write(name, 1, 'utf16le');
                break;
				
            	case 'powerline.io':
            	name = name + Math.floor(Math.random() * 1000);
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
				spawnBuffer.write(name, 1, 'utf16le');
                break;
                case 'agarflix.com':
                	            	name = name + Math.floor(Math.random() * 1000);
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
				spawnBuffer.writeUInt16LE(192, 0);
				spawnBuffer.write(name, 1, 'utf16le');
                	break;
            case 'www.agar-kicoo.tk':
            case 'agariopvp.org':
                name = this.nameBypass() + '&' + name + id;
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
				spawnBuffer.writeUInt16LE(59, 1);
                spawnBuffer.write(name, 3, 'utf16le');
                break;
                case 'pok.ist':
                 var skins = ['24', '100', '60', '250', '66', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
                var skin = skins[~~(Math.random() * skins.length)];
                var rand = Math.random().toString(36).slice(2 + ~~(Math.random() * 6)); // solve ip proxies
		        name = `{${skin}}` + name + id;
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
				spawnBuffer.writeUInt16LE(192, 0);
                spawnBuffer.write(name, 1, 'utf16le');
                break;
				
			 case 'agario2.space':
                 var skins = ['24', '100', '60', '250', '66', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
                var skin = skins[~~(Math.random() * skins.length)];
                var rand = Math.random().toString(36).slice(2 + ~~(Math.random() * 6)); // solve ip proxies
		        name = `{${skin}}` + name + id;
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
				spawnBuffer.writeUInt16LE(192, 0);
                spawnBuffer.write(name, 1, 'utf16le');
                break;
			
			case 'nagar.eu':
                name = name + Math.floor(Math.random() * 1000);;
				name = name + Math.floor(Math.random() * 77);
                var rand = Math.random().toString(36).slice(2 + ~~(Math.random() * 6)); // solve ip proxies
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
				spawnBuffer.write(name, 1, 'utf16le');
				this.send(new Uint8Array([254]));
                break;	
			case 'agar.team':
                 var skins = ['24', '100', '60', '250', '66', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
                var skin = skins[~~(Math.random() * skins.length)];
                var rand = Math.random().toString(36).slice(2 + ~~(Math.random() * 6)); // solve ip proxies
		        name = `{${skin}}` + name + id;
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
				spawnBuffer.writeUInt16LE(192, 0);
                spawnBuffer.write(name, 1, 'utf16le');
                break;	
				
			 case 'agar.cx':
                 var skins = ['24', '100', '60', '250', '66', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
                var skin = skins[~~(Math.random() * skins.length)];
                var rand = Math.random().toString(36).slice(2 + ~~(Math.random() * 6)); // solve ip proxies
		        name = `{${skin}}` + name + id;
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
				spawnBuffer.writeUInt16LE(192, 0);
                spawnBuffer.write(name, 1, 'utf16le');
                break;	
				
			case 'agariotime.space':
                 var skins = ['24', '100', '60', '250', '66', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
                var skin = skins[~~(Math.random() * skins.length)];
                var rand = Math.random().toString(36).slice(2 + ~~(Math.random() * 6)); // solve ip proxies
		        name = `{${skin}}` + name + id;
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
				spawnBuffer.writeUInt16LE(192, 0);
                spawnBuffer.write(name, 1, 'utf16le');
                break;
			case 'agariohub.club':
                 var skins = ['24', '100', '60', '250', '66', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
                var skin = skins[~~(Math.random() * skins.length)];
                var rand = Math.random().toString(36).slice(2 + ~~(Math.random() * 6)); // solve ip proxies
		        name = `{${skin}}` + name + id;
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
				spawnBuffer.writeUInt16LE(192, 0);
                spawnBuffer.write(name, 1, 'utf16le');
                break;	
		    case 'agar.vin':
			   name = this.nameBypass() + '&' + name + id;
                var rand = Math.random().toString(36).slice(2 + ~~(Math.random() * 6)); // solve ip proxies
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
				spawnBuffer.writeUInt16LE(192, 0);
                spawnBuffer.write(name, 1, 'utf16le');
                break;
			 case 'yoyowars.io':
			   name = this.nameBypass() + '&' + name + id;
                var rand = Math.random().toString(36).slice(2 + ~~(Math.random() * 6)); // solve ip proxies
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
				spawnBuffer.writeUInt16LE(192, 0);
                spawnBuffer.write(name, 1, 'utf16le');
                break;
            case 'ac-clan.glitch.me':
            	name = name + id;
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
				spawnBuffer.writeUInt16LE(59, 1);
				spawnBuffer.write(name, 3, 'utf16le');
                break;
            case 'biobots.tk':
            	name = name + id;
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
				spawnBuffer.writeUInt16LE(59, 1);
				spawnBuffer.write(name, 3, 'utf16le');
                break;
             case 'astr.io':
			    name = name + Math.floor(Math.random() * 500);
				spawnBuffer = Buffer.alloc(1 + Buffer.byteLength(name, 'utf16le'));
				spawnBuffer.writeUInt16LE(192, 0);
				spawnBuffer.write(name, 1, 'utf16le');
				break;
				case 'germs.io':
					            	name = name + id;
      var buffer = new Buffer(1 + 2 * name.length);
    //  buffer.writeUInt8(123, 0);
      buffer.writeUInt16LE(123, 0);
      for (let i = 0; i < name.length; i++)
        buffer.writeUInt16LE(name.charCodeAt(i), 1 + 2 * i);
        this.send(buffer);
					break;
			case 'targ.io':
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
                spawnBuffer.write(name, 3, 'utf16le');
				break;
			case 'agarcell.ml':
			    name = name + id;
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
                spawnBuffer.write(name, 3, 'utf16le');
                break;
			case 'game.ex-script.com':
			case 'zgar.glitch.me':
				name = this.nameBypass() + '&' + name;
			case '3.8.133.173':
			    name = name + Math.floor(Math.random() * 150);
                spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf8'));

                spawnBuffer.write(name, 1, 'utf8');
                break;

			   case 'agar.yt':
				  name = name + Math.floor(Math.random() * 150);
				var rand = Math.random().toString(36).slice(2 + ~~(Math.random() * 6)); // solve ip proxies
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
				spawnBuffer.writeUInt16LE(192, 0);
				spawnBuffer.write(name, 1, 'utf16le');
				break;
				
				case 'slig.io':
				name = name + id;
                var rand = Math.random().toString(36).slice(2 + ~~(Math.random() * 6)); // solve ip proxies
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
				spawnBuffer.write(name, 1, 'utf16le');
				break;
				
				case 'agarios.org':
				 name = name + Math.floor(Math.random() * 150);
                var rand = Math.random().toString(36).slice(2 + ~~(Math.random() * 6)); // solve ip proxies
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
				spawnBuffer.write(name, 1, 'utf16le');
				break;
				
				case 'ogar.be':
				 name = name + Math.floor(Math.random() * 150);
				 var skins = ['30', 'ari', 'devil', 'jhin', 'bd', 'pokerpro'];
                 var skin = skins[~~(Math.random() * skins.length)];
                name = `[${skin}]` + name + id;
				spawnBuffer = Buffer.alloc(1 + Buffer.byteLength(name, 'utf16le'));
				spawnBuffer.write(name, 1, 'utf16le');
				break;
				
            case 'play.agar.black':
                var rand = Math.random().toString(36).slice(2 + ~~(Math.random() * 6)); // solve ip proxies
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
				spawnBuffer.writeUInt16LE(59, 1);
				spawnBuffer.write(name, 3, 'utf16le');
                break;
			 case 'agar.school':
                var rand = Math.random().toString(36).slice(2 + ~~(Math.random() * 6)); // solve ip proxies
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
				spawnBuffer.writeUInt16LE(59, 1);
				spawnBuffer.write(name, 3, 'utf16le');
                break;	
				
				case 'agocell.eu':
                name = name + id;
				spawnBuffer = Buffer.alloc(1 + Buffer.byteLength(name, 'utf16le'));
				spawnBuffer.write(name, 3, 'utf16le');
                break;
				
             case 'agar.cc':
			 name = name + Math.floor(Math.random() * 115);
               var skins = ['26', '30', '32', '40', '60', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
                var skin = skins[~~(Math.random() * skins.length)];
		        name = `{${skin}}` + name + id;
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
				spawnBuffer.writeUInt16LE(192, 0);
				spawnBuffer.write(name, 1, 'utf16le');
                break;
			  case 'agar.rip':
                var skins = ['26', '30', '32', '40', '60', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
                var skin = skins[~~(Math.random() * skins.length)];
                var rand = Math.random().toString(36).slice(2 + ~~(Math.random() * 6)); // solve ip proxies
		        name = `{${skin}}` + name + id;
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
				spawnBuffer.writeUInt16LE(192, 0);
				spawnBuffer.write(name, 1, 'utf16le');
                break;
				
			case 'agario.org.uk':
               var skins = ['26', '30', '32', '40', '60', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
                var skin = skins[~~(Math.random() * skins.length)];
                var rand = Math.random().toString(36).slice(2 + ~~(Math.random() * 6)); // solve ip proxies
		        name = `{${skin}}` + name + id;
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
				spawnBuffer.writeUInt16LE(192, 0);
				spawnBuffer.write(name, 1, 'utf16le');
                break;	
				
			 case 'bestagario.org':
               var skins = ['26', '30', '32', '40', '60', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
                var skin = skins[~~(Math.random() * skins.length)];
                var rand = Math.random().toString(36).slice(2 + ~~(Math.random() * 6)); // solve ip proxies
		        name = `{${skin}}` + name + id;
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
				spawnBuffer.writeUInt16LE(192, 0);
				spawnBuffer.write(name, 1, 'utf16le');
                break;	
				
				
				case 'agariogame.club':
				var rand = Math.random().toString(36).slice(2 + ~~(Math.random() * 6)); // solve ip proxies
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
				spawnBuffer.write(name, 1, 'utf16le');
				this.send(new Uint8Array([19]));
                break;
				
			case 'cellcraft.io':
			name = name + Math.floor(Math.random() * 600);
			   name = name + id;
			   var skins = ['ayushreal', 'ais', 'bumie', 'bkmc', 'blenderbots', 'm8'];
                var skin = skins[~~(Math.random() * skins.length)];
                name = `[${skin}]` + name + id;
		      spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
			  spawnBuffer.writeUInt8(0, 0);
			  spawnBuffer.writeUInt16LE(59, 1);
			  spawnBuffer.write(name, 3, 'utf16le');
			  this.send(new Uint8Array([42]));
	           break;
				
				case 'cell.sh':
				name = name + Math.floor(Math.random() * 250);
				name = this.nameBypass() + '&' + name;
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
				spawnBuffer.write(name, 1, 'utf16le');
                break;
				
				case 'agar.life':
                var rand = Math.random().toString(36).slice(2 + ~~(Math.random() * 6)); // solve ip proxies
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
				spawnBuffer.writeUInt16LE(59, 1);
				spawnBuffer.write(name, 3, 'utf16le');
                break;
				
					
				 case 'agar.vin':
                            	name = name + Math.floor(Math.random() * 500);
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
				spawnBuffer.writeUInt16LE(192, 0);
				spawnBuffer.write(name, 1, 'utf16le');
                break;
				
				case 'cellzio.website':
				name = name + Math.floor(Math.random() * 500);
				name = name + id;
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
				spawnBuffer.write(name, 1, 'utf16le');
                break;
				
				case 'studio.tialight.com':
                var rand = Math.random().toString(36).slice(2 + ~~(Math.random() * 6)); // solve ip proxies
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
				spawnBuffer.write(name, 1, 'utf16le');
                break;
				
               case 'agar.wiki':
                 name = name + Math.floor(Math.random() * 1000);
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
				spawnBuffer.writeUInt16LE(192, 0);
				spawnBuffer.write(name, 1, 'utf16le');
                break;
            case 'agix.pw':
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
				spawnBuffer.writeUInt16LE(59, 1);
				spawnBuffer.write(name, 3, 'utf16le');
                break;
			case 'agar.style':
             var skins = ['26', '30', '32', '40', '60', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
                var skin = skins[~~(Math.random() * skins.length)];
                var rand = Math.random().toString(36).slice(2 + ~~(Math.random() * 6)); // solve ip proxies
		        name = `{${skin}}` + name + id;
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
				spawnBuffer.writeUInt16LE(192, 0);
				spawnBuffer.write(name, 1, 'utf16le');
                break;
			case 'agarix.ru':
			    name = this.nameBypass() + '&' + name;
                var rand = Math.random().toString(36).slice(2 + ~~(Math.random() * 6)); // solve ip proxies
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
				spawnBuffer.write(name, 1, 'utf16le');
                break;
				
			case 'agariox.net':
              name = name + Math.floor(Math.random() * 600);
			  var skins = ['26', '30', '32', '40', '60', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
                var skin = skins[~~(Math.random() * skins.length)];
                var rand = Math.random().toString(36).slice(2 + ~~(Math.random() * 6)); // solve ip proxies
		        name = `{${skin}}` + name + id;
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf16le'));
				spawnBuffer.writeUInt16LE(192, 0);
				spawnBuffer.write(name, 1, 'utf16le');
				this.send(new Uint8Array([19]));
                break;
				
				case 'agar.pro':
				name = name + Math.floor(Math.random() * 125);
				spawnBuffer = Buffer.alloc(3 + Buffer.byteLength(name, 'utf8'));
				spawnBuffer.write(name, 1, 'utf8');
				break;
		}
		this.send(spawnBuffer);
	}

	sendChat(message) {
		let chatBuffer;
		switch (this.originSplit) {
				case 'ixagar.net':
					case 'game.ex-script.com':
					case 'agar.cc':
					case 'agar.rip':
			case 'agario.ioschool.space':
			case 'agarios.org':
			case 'agario2.space':
			case 'agar.red':
			case 'agar.team':
			case 'agar.cx':
			case 'slig.io':
			case 'agarimachos.com':
			case 'bestagario.org':
			case 'cellcraft.io':
			case 'cell.sh':
			case 'agario.org.uk':
			case 'agario.fun':
			case 'agar.life':
			case 'agar.yt':
			case 'cellsbox.io':
			case 'pok.ist':
			case 'agariotime.space':
			case 'agariohub.club':
			case 'agar.vin':
			case 'agario.se':
			case 'agario.cafe':
			case 'minions.vin':
			case 'agario-here.com':
			case 'agariogame.club':
			case 'de.agar.bio':
			case 'agar.vin':
			case 'agarprivateservers.net':
			case 'agar.rs':
			case 'inciagario.net':
		    case 'bomb.agar.bio':
			case 'army.ovh':
			chatBuffer = chatBuffer + Math.floor(Math.random() * 1000);
			case 'play.agario0.com':
			case 'agario.top':
			case 'ogar.be':
			case 'cells.ga':
				case 'agariocity.pro':
			case 'cellagar.ml':
			case 'zgar.glitch.me':
			case 'germs.io':
			case 'agariox.net':
			case 'mk-agario.glitch.me':
			case 'agocell.eu':
			case 'agix.pw':
			case 'agar.ist':
			case 'betteragario.com':
			case 'ac-clan.glitch.me':
			case 'dummyclient.glitch.me':
			case 'play.agar.black':
			case 'agar.school':
			case 'cellzio.website':
			case 'prosplit.io':
			case 'agar.style':
				case 'blobgame.io':
				case 'gota.io':
				case 'mogar.io':
							case 'agario.top':
			case 'agariobox.org':
					case 'agar.rs':
			case 'nagar.eu':
				chatBuffer = Buffer.alloc(2 + message.length * 2);
				chatBuffer.writeUInt8(99, 0);
				chatBuffer.write(message, 2, 'utf16le');
				break;
			case 'balz.io':
			case 'targ.io':
				case 'blobgame.io':
					case 'game.ex-script.com':
					case 'ixagar.net':
			case 'mk-agario.glitch.me':
			case 'zgar.glitch.me':
					case 'gaver.io':
				chatBuffer = Buffer.alloc(3 + message.length);
				chatBuffer.writeUInt8(99, 0);
				chatBuffer.write(message, 2);
				break;
				
			case 'agar.ist':
			case 'agar.rs':
				chatBuffer = Buffer.alloc(1 + message.length * 2);
				chatBuffer.writeUInt8(99, 0);
				chatBuffer.write(message, 2, 'ucs2');
				break;
				
			case'agar.pro':
				chatBuffer = Buffer.alloc(3 + message.length);
				chatBuffer.writeUInt8(99, 0);
				chatBuffer.write(message, 2);
				break;
		}
		this.send(chatBuffer);
	}


	onmessage(msg) { //not needed at the moment
		msg = msg.data;
		let opcode = msg.readUInt8(0);
		switch (opcode) {
		  
			case 16:
                try {
                    this.handleWorldUpdate(msg);
                } catch (e) {}
                break;
		    case 22:
                    if (!this.gotKey || !this.settings.minionEnableERTPControls) break;
                    for (let i = 0, l = this.connection.minions.length; i < l; i++)
                    this.connection.minions[i].splitAttempts++;
                    break;
            case 23:
                 if (!this.gotKey || !this.settings.minionEnableERTPControls) break;
                 for (let i = 0, l = this.connection.minions.length; i < l; i++)
                 this.connection.minions[i].ejectAttempts++;
                 break;
				 this.playerNodeIds.push(msg.readUInt32LE(1));
				 break;
            case 24:
                if (!this.gotKey || !this.settings.minionEnableERTPControls) break;
                this.connection.minionsFrozen = !this.connection.minionsFrozen;
                break;
			 
		}
	}
	onclose(error) {
		clearInterval(this.nameInterval);
		if (this.stopped) return;
		this.proxy = getProxy();

		if (this.ip)
			this.connect(this.ip);
	}

	onerror(error) {}

/*	send(buffer) {
		if (this.ws && this.ws.readyState == 1)
			this.ws.send(buffer);
	}*/
	



/*	send(buffer) {
		if (this.ws && this.ws.readyState == 1)
			this.ws.send(buffer);
	}*/
		send(buffer) {
		if (!this.ws || this.ws.readyState !== WebSocket.OPEN == 1) return;
		if(this.started == true) return;
        if(this.origin == "bubble.am") this.ws.send(buffer);
        else this.ws.send(buffer);
       //console.log(buffer);
	}

}

class Node {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.size = 0;
        this.id = 0;
        this.flags = 0;
        this.name = null;
		this.color = null;
    }
}

class Client {

	constructor(ws, req) {
		this.origin = req.headers.origin;
		this.botConnectInt = [];
		this.started = false;
		this.bots = [];
		this.pelletsMode = true;
		this.ws = ws;
		this.setup();
		connectedUsers++;
		console.log(`A user has connected! Connected users: ${connectedUsers}`.yellow);
	}

	setup() {
		this.ws.on('message', this.onmessage.bind(this));
		this.ws.on('close', this.onclose.bind(this));
		this.ws.on('error', this.onerror.bind(this));
		for (let i = 0; i < config.maxBots; i++)
			this.bots.push(new Bot(this.origin, this));
		this.startBotCount();
	}

	onmessage(message) {
		const json = JSON.parse(message);
		switch (json.type) {

			case 'start':
				this.startBots(json.ip, this.origin);
				console.log('user started bots on '.red, this.origin.cyan, json.ip.yellow)
				break;

			case 'updatePos':
        var offset = true;
				if(this.bots[0].pelletsMode) {
					for(let i = 0; i < this.bots.length; i++) this.bots[i].collectPellets(json.x, json.y, json.byteLen);
					break;
				}
				this.sendBotPos(json.x, json.y, json.byteLen);
                break;

			case 'split':
				this.bots.forEach(bot => {
					bot.send(Buffer.from([17]));
				});
				break;
			case 'pellets':
				this.pelletsMode = !this.pelletsMode;
				for(let i = 0; i < this.bots.length; i++) {
					if(this.pelletsMode) this.bots[i].pelletsMode = true;
					else this.bots[i].pelletsMode = false;
				}
				break;
			case 'chat':
				this.bots.forEach(bot => {
					bot.sendChat(json.msg);
				});
				break;

			case 'eject':
				this.bots.forEach(bot => {
					bot.send(Buffer.from([21]));
					bot.send(Buffer.from([36]));
				});
				break;
		}

	}

	sendMitosis() {
		let buffer = new Buffer(1);
		buffer.writeUInt8(17, 0);

		this.send(buffer);
	}

	sendBotPos(x, y, byteLen) {
		if (!byteLen) return;
		let moveBuffer = Buffer.alloc(byteLen);

		moveBuffer.writeUInt8(16, 0);
		switch (byteLen) {
			case 13:
			case 9:
				moveBuffer.writeInt32LE(x, 1);
				moveBuffer.writeInt32LE(y, 5);
				break;
			case 21:
				moveBuffer.writeDoubleLE(x, 1); 
				moveBuffer.writeDoubleLE(y, 9);
				break;
			case 16:
                             moveBuffer.writeIntDoubleLE(offsetx, 1) + moveBuffer.writeInDoubleLE(offsetx, 17) / 2;
                             moveBuffer.writeIntDoubleLE(offsety, 9) + moveBuffer.writeInDoubleLE(offsety, 25) / 2;
                             
                     break;
			case 241: // Packet 241, part of decryption.
				try {
					this._key241 = buf.readInt32LE(offset);
					this._decryptionKey = this._key241 ^ this._key255;
					this.log(`Got key241=${this._key241} set encryptionKey=${this._encryptionKey} set decryptionKey=${this._decryptionKey}`, 1);
					if (botMode == 'AGARVIEW' || botMode == 'CRASHER') setTimeout(this.sendSpectate.bind(this), 1000 + Math.random() * 500);
				} catch (e) {
					this.log('Failed to get correct 241key, closing WebSocket connection!', 0);
					this._ws.close();
				}
				break;	 
		}

		this.bots.forEach(bot => {
			bot.send(moveBuffer);
		});
	}

	startBotCount() {
		this.botCountInt = setInterval(() => {
			let json = {
				type: 'botCount',
				connected: 0,
				maxBots: config.maxBots
			};
			this.bots.forEach(bot => {
				if (bot.ws && bot.ws.readyState == 1)
					json.connected++;
			});
			this.send(json);
		}, 100);
	}

	stopBotCount() {
		clearInterval(this.botCountInt);
	}

	onclose() {
		this.stopBotCount();
		connectedUsers--;
		console.log(`A user has disconnected! Connected users: ${connectedUsers}`);
	}

	startBots(serverip) {
		if (this.started) return;
		this.bots.forEach((bot, i) => {
			this.botConnectInt.push(setTimeout(() => {
				if (!this.started) return;
				bot.connect(serverip.replace('https', 'wss'));
			//	console.log(serverip);
			}, 70* i));
		});
		this.started = true;
	}

	onerror() {}

	send(message) {
		if (this.ws && this.ws.readyState == 1) this.ws.send(JSON.stringify(message));
	}

}
/*const wss = new WebSocket.Server({
	port: 8081
});

wss.on('connection', (ws, req) => {
	ws.Client = new Client(ws, req);
});*/
var useSSL = false;

if (useSSL) {
    var https = require('https');

    var app = https.createServer({
        key: fs.readFileSync('/root/key.pem'),
        cert: fs.readFileSync('/root/cert.pem')
    }).listen(8443);
    const wss = new WebSocket.Server({ server: app });
    wss.on('connection', (ws, req) => {
        ws.Client = new Client(ws, req);
    });
} else {
    const wss = new WebSocket.Server({ port: 3000 })
var clients = [];
    wss.on('connection', (ws, req) => {
        ws.Client = new Client(ws, req);
    });
wss.on('connection', function connection(ws) {
	ws.on('message', function incoming(message) {
		let opcode = message.readUInt8;
	//	console.log(message);
		let off = 1;
		switch (opcode) {
			case 0x10:
				clientX = message.readDoubleLE(1);
				clientY = message.readDoubleLE(9);
				break;
			case 0x20:
				for (let i = 0; i < clients.length; i++) {
					clients[i].sendMitosis();
				}
				break;
			case 0x21:
				for (let i = 0; i < clients.length; i++) {
					clients[i].sendEject();
				}
				break;
			case 0x22:
				aiMode = !aiMode;
				break;
			case 0xff:
				if (clients.length > 0) {
					break;
				}

				let ip = '',
					ch = 0;
				let amount = 0;

				amount = Math.min(message.readUInt16LE(off), 500);
				off += 2;

				while (true) {
					ch = message.readUInt16LE(off);
					off += 2;
					if (!ch) break;
					ip += String.fromCharCode(ch);
				}

				console.log(ip, amount);

				for (let i = 0; i < amount; i++) {
					let c = new Client();

					c.connect(ip);
					clients.push(c);
				}
				break;
			case 0xfe:
				clients = [];

				break;
				
		}
	});
});
}
