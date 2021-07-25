//SPECS v4.7 WORKS UNTIL HERE

function loadMultiCellSkin(){
	
  if (profiles[application.selectedOldProfile].nick && !application.customSkinsMap[profiles[application.selectedOldProfile].nick]){
	 setTimeout(function() {
		core.registerSkin(profiles[application.selectedOldProfile].nick , null, profiles[application.selectedOldProfile].skinURL , null); 
	 }, 500); 
  }
}
function addBox() {  
  let spect = new Spect();
  spect.player = true;
  legendmod.multiBoxPlayerExists = spect.player
  spects.unshift(spect); 
}
function addSpectator() {
  let spect = new Spect();
  spects.push(spect)
}

function addFullSpectator() {
        let mtp = 4.95,
            w = ~~(1024*mtp),
            h = ~~(600*mtp);
  let stop = 0,
      x = 0,
      y = 0;
	  
  var times = parseInt(legendmod.mapSize/471.4)
  //for (;stop<30;stop++){

  if (legendmod.integrity && times<80){
  for (;stop<times;stop++){
	  
    if(stop == 0) {
      let spect = new Spect();
      x = legendmod.mapMinX + 2400;
      y = legendmod.mapMinY + 1000;
      spect.staticX = x;
      spect.staticY = y;
      spects.push(spect)
      stop++
    } 
	else {
      if(x > legendmod.mapMaxX - 2400){
        x = legendmod.mapMinX + 2400;
        y = y+h;
      } 
	  else {x = x + w;}
      if (y>legendmod.mapMaxY-1000) { 
        //stop = 100;
		stop = 10000;
        break 
      }
      let spect = new Spect();
      spect.staticX = x;
      spect.staticY = y;
      spects.push(spect)
      stop++
    }
  }
  }
  else{
	  toastr.error("Full spectator does not work for Private servers. <br>There is not such thing as <i>FreeSpectate</i> on Private Servers")
	  //toastr.error("Too many spects needed: " + times/2 + "<br> Attempt canceled")
	  window.fullSpectator=false
  }
}
var spects = [];
class Spect {
    constructor() {
        this.number = spects.length + 1
		//this.number = spects.length
        this.ws = null
		this.nick = null
		this.accessTokenSent = false
        this.socket = null
        this.protocolKey = null
        this.clientKey = null
        this.clientVersion = null
        this.connectionOpened = false
        this.mapOffset = 7071 //7071.067811865476
        this.mapOffsetX = 0
        this.mapOffsetY = 0
        this.fixX = 1
        this.fixY = 1
        this.staticX = null
        this.staticY = null
        this.ghostsFixed = false
        this.closedByUser = false
        this.positionController = null
        this.player = false
        this.active = null
        this.targetX = null
        this.targetY = null
		this.playerCellIDs = []
		legendmod.playerCellsMulti = []
		legendmod.multiBoxPlayerExists = null
		this.playerScore = 0
		this.fix3x = 0
		this.fix3y = 0	
		this.playerSize	= 0
        this.connect()
    }
    reset() {
        this.ws = null
		this.nick = null
		this.accessTokenSent = false
        //this.socket = null
        this.protocolKey = null
        this.clientKey = null
        this.clientVersion = null
        this.connectionOpened = false
        this.mapOffsetX = 0
        this.mapOffsetY = 0
        this.ghostsFixed = false
        this.closedByUser = false
        this.positionController = null
        this.player = false
        this.active = null
        this.targetX = null
        this.targetY = null
		this.playerCellIDs = []
		legendmod.playerCellsMulti = []
		legendmod.multiBoxPlayerExists = null
		this.playerScore = 0
		this.fix3x = 0
		this.fix3y = 0
		this.playerSize	= 0
    }
    connect() {
        this.reset()
		this.timeStarted = Date.now()
        this.ws = legendmod.ws
        this.socket = new WebSocket(legendmod.ws)
        this.socket.binaryType = 'arraybuffer'
        this.socket.onopen = this.onopen.bind(this)
        this.socket.onmessage = this.onmessage.bind(this)
        this.socket.onerror = this.onerror.bind(this)
        this.socket.onclose = this.onclose.bind(this)
    }
    onopen() {
            console.log('[SPECT] Game server socket ' + this.number + ' open')
      
	  
            this.clientVersion = window.master.clientVersion
            this.protocolVersion = window.master.protocolVersion
      
            let view = this.createView(5);
            view.setUint8(0, 254);
			if (!legendmod.integrity){ view.setUint32(1, 6, true); }
			else{ view.setUint32(1, this.protocolVersion, true);  } 
            this.sendMessage(view);
            view = this.createView(5);
            view.setUint8(0, 255);
			if (!legendmod.integrity){ view.setUint32(1, 1, true); } 
			else{ view.setUint32(1, this.clientVersion, true); }			
            this.sendMessage(view);
            this.connectionOpened = true;
      

        }
    onmessage(message) {
        message = new DataView(message.data);
        //if (this.buffersKey) message.data = algorithm.rotateBufferBytes(message.data, this.buffersKey)

        if (this.protocolKey) {
            message = this.shiftMessage(message, this.protocolKey ^ this.clientVersion);
        }
        this.handleMessage(message);
    }
    onerror() {
        setTimeout(() => {
            if (this.socket.readyState === WebSocket.CONNECTING || this.socket.readyState === WebSocket.OPEN) this.socket.close()
        }, 1000)
      console.log('error')
    }
    onclose() {
        if (this.connectionOpened) {
            this.connectionOpened = false
          
            this.flushCellsData() 
          
            this.reset()
          console.log('closed')
        if(!this.closedByUser) {
          this.connect()
        }

        }
    }
    closeConnection() {
        if (this.socket) {
            this.socket.onopen = null;
            this.socket.onmessage = null;
            this.socket.onerror = null;
            this.socket.onclose = null;
            try {
                this.socket.close();
            } catch (error) {}
            this.socket = null;
            this.ws = null;
          
            this.flushCellsData() 
          
            this.reset() 

            this.closedByUser = true

        }
    }
    flushCellsData() {
            this.isSpectateEnabled = false
            this.isFreeSpectate = false;
            this.ghostCells = [];
            //this.indexedCells = {};
            //this.deletefromObject("indexedCells")
            //this.cells = [];
            //this.deleteFromArray("cells")
            legendmod.playerCellsMulti = [];
            this.playerCellIDs = [];
            //this.food = [];
            //this.viruses = [];
            //this.deleteFromArray("viruses")
            for(let cell of Object.values(legendmod.indexedCells)) {
              if(cell.spectator == this.number) {
                cell.removeCell();
              }
            }
            for(let cell of Object.values(legendmod.cells)) {
              if(cell.spectator == this.number) {
                cell.removeCell();
              }
            }				

    }
    isSocketOpen() {
        return this.socket !== null && this.socket.readyState === this.socket.OPEN;
    }
    createView(value) {
            return new DataView(new ArrayBuffer(value));


    }
    sendBuffer(data) {
            this.socket.send(data.buffer);
    }
    sendMessage(message) {
            if (this.connectionOpened && legendmod.integrity) {
                if (!this.clientKey) {
                    return;
                }
                message = this.shiftMessage(message, this.clientKey);
                this.clientKey = this.shiftKey(this.clientKey);
            }
            this.sendBuffer(message);

    }
    sendAction(action) {
        if (!this.isSocketOpen()) {
            return;
        }
        const view = this.createView(1);
        view.setUint8(0, action);
        this.sendMessage(view);

    }
	//spects[0].sendGplusToken(master.accessToken)
	getTheOppositeSocialToken(){
		if (master.context == "facebook"){
			if (master.accessTokenGPlus){
				MultiTokenReady(this)
			}
			else {			
				window.MultiPending=this
				document.getElementById("gplusLogin").click()	
				//this.handleSendNick()			
				console.log('[SPECT] Login Tokens - Main: Google, Multi: Facebook')	
			}			
		}
		else if (master.context == "google"){
			if (master.accessTokenFB){
				MultiTokenReady(this)
			}
			else{
				window.MultiPending=this
				master.facebookLogin()					
				console.log('[SPECT] Login Tokens - Main: Facebook, Multi: Google')
			}
			//this.handleSendNick()
		}	
		else if (!master.context){
			//this.sendGplusToken(localStorage.getItem("accessTokenGPlus"))
			console.log('[SPECT] Login Tokens - Main: No, Multi: No')
			this.handleSendNick()
		}		
		else {
			console.log('[SPECT] Login Tokens - Main: No, Multi: No')
			this.handleSendNick()
		}			
	}	
        sendFbToken(token) {
            this.sendAccessToken(token, 2);
        }
        sendGplusToken(token) {
            this.sendAccessToken(token, 4);
        }	
        sendAccessToken(shapes, options, oW) {
            if (!legendmod.integrity) {
                return
            }
            if (this.accessTokenSent) {
                return;
            }
            if (!oW) {
                oW = 102;
            }
            var curr = shapes.length;
            var count = legendmod.clientVersionString.length;
            var data = [oW, 8, 1, 18];
            application.writeUint32(data, curr + count + 23);
            data.push(8, 10, 82);
            application.writeUint32(data, curr + count + 18);
            data.push(8, options, 18, count + 8, 8, 5, 18, count);
            var prev = 0;
            for (; prev < count; prev++) {
                data.push(legendmod.clientVersionString.charCodeAt(prev));
            }
            data.push(24, 0, 32, 0, 26);
            application.writeUint32(data, curr + 3);
            data.push(10);
            application.writeUint32(data, curr);
            prev = 0;
            for (; prev < curr; prev++) {
                data.push(shapes.charCodeAt(prev));
            }
            data = new Uint8Array(data);
            var raw_basefont = new DataView(data.buffer);
            this.sendMessage(raw_basefont);
        }	
    sendCursor() {
            this.positionController = setInterval(() => {

			if (legendmod.pause){
				this.sendPosition(this.convertX(this.playerX), this.convertY(this.playerY));
			}
			else if (window.multiboxPlayerEnabled || this.isFreeSpectate || window.multiboxFollowMouse){
					this.sendPosition(this.convertX(legendmod.cursorX), this.convertY(legendmod.cursorY));
					
					this.distX  = this.convertX(legendmod.cursorX) - this.playerX	
					this.distY  = this.convertY(legendmod.cursorY) - this.playerY					
				}
			else if (!window.multiboxPlayerEnabled || this.isFreeSpectate || window.multiboxFollowMouse){
					if (defaultmapsettings.multiKeepMoving){
						this.sendPosition(this.playerX + this.distX, this.playerY + this.distY);
					}
				}
            }, 50);
            //this.sendSpectate()
            //this.sendFreeSpectate()
    }
    sendSpectate() {
        this.isSpectateEnabled = true
        this.sendAction(1);
    }
    sendFreeSpectate() {
        this.isFreeSpectate = !this.isFreeSpectate
        if(this.staticX==0) {
         if(this.isFreeSpectate) {
          this.sendCursor()
         } else {
          clearInterval(this.positionController)
         }
        }
        this.sendAction(18);
    }
	sendBotEject(){ //specific private servers
		this.sendAction(23);
	}	
    sendBotSplit() { //specific private servers
        this.sendAction(22);
    }	
    sendEject() {
        this.sendPosition(this.convertX(legendmod.cursorX), this.convertY(legendmod.cursorY));
        this.sendAction(21);
    }
    sendSplit() {
        this.sendPosition(this.convertX(legendmod.cursorX), this.convertY(legendmod.cursorY));
        this.sendAction(17);
    }
    sendNick(nick) {
		if (!this.active){ //if cell didn't start
		//console.log(nick)
		//this.sendNickOnce=true
        var self = this
		this.playerNick = nick;
            var sendSpawn = function(token) {
                //var token = grecaptcha.getResponse();
                nick = window.unescape(window.encodeURIComponent(self.playerNick));
                var view = self.createView(1 + nick.length + 1 + token.length + 1);
                var pos = 1
                for (let length = 0; length < nick.length; length++, pos++) view.setUint8(pos, nick.charCodeAt(length))
                pos++
                for (let length = 0; length < token.length; length++, pos++) view.setUint8(pos, token.charCodeAt(length));
                self.sendMessage(view);
            }
        legendmod.integrity && agarCaptcha.requestCaptchaV3("play", function(token) {
            sendSpawn('0'); // 25/7/2021
			//sendSpawn(token) 
        });
        !legendmod.integrity && sendSpawn('0')
		}
    }
    sendPosition(x, y) {
        if (!this.isSocketOpen() || !this.connectionOpened || (!this.clientKey && legendmod.integrity)) {          
			return;
        }
        const view = this.createView(13);
        view.setUint8(0, 16);
      if(this.player==true&&!this.active==true) { 
        
        view.setInt32(1, this.targetX, true);
        view.setInt32(5, this.targetY, true);
        console.log(this.targetX, this.targetY)
      } 
	  else {

        view.setInt32(1, x, true);
        view.setInt32(5, y, true);
        this.targetX = x;
        this.targetY = y;
      }
        view.setUint32(9, this.protocolKey, true);
        this.sendMessage(view);
    }
    generateClientKey(ip, options) {
        if (!ip.length || !options.byteLength) {
            return null;
        }
        let x = null;
        const Length = 1540483477;
        const ipCheck = ip.match(/(ws+:\/\/)([^:]*)(:\d+)/)[2];
        const newLength = ipCheck.length + options.byteLength;
        const uint8Arr = new Uint8Array(newLength);
        for (let length = 0; length < ipCheck.length; length++) {
            uint8Arr[length] = ipCheck.charCodeAt(length);
        }
        uint8Arr.set(options, ipCheck.length);
        const dataview = new DataView(uint8Arr.buffer);
        let type = newLength - 1;
        const value = (type - 4 & -4) + 4 | 0;
        let newValue = type ^ 255;
        let offset = 0;
        while (type > 3) {
            x = Math.imul(dataview.getInt32(offset, true), Length) | 0;
            newValue = (Math.imul(x >>> 24 ^ x, Length) | 0) ^ (Math.imul(newValue, Length) | 0);
            type -= 4;
            offset += 4;
        }
        switch (type) {
            case 3:
                newValue = uint8Arr[value + 2] << 16 ^ newValue;
                newValue = uint8Arr[value + 1] << 8 ^ newValue;
                break;
            case 2:
                newValue = uint8Arr[value + 1] << 8 ^ newValue;
                break;
            case 1:
                break;
            default:
                x = newValue;
                break;
        }
        if (x != newValue) {
            x = Math.imul(uint8Arr[value] ^ newValue, Length) | 0;
        }
        newValue = x >>> 13;
        x = newValue ^ x;
        x = Math.imul(x, Length) | 0;
        newValue = x >>> 15;
        x = newValue ^ x;
        //console.log('[SPECT] Generated client key:', x);
        return x;
    }
    shiftKey(key) {
        const value = 1540483477;
        key = Math.imul(key, value) | 0;
        key = (Math.imul(key >>> 24 ^ key, value) | 0) ^ 114296087;
        key = Math.imul(key >>> 13 ^ key, value) | 0;
        return key >>> 15 ^ key;
    }
    shiftMessage(view, key, write) {
        if (!write) {
            for (var length = 0; length < view.byteLength; length++) {
                view.setUint8(length, view.getUint8(length) ^ key >>> length % 4 * 8 & 255);
            }
        } else {
            for (var length = 0; length < view.length; length++) {
                view.writeUInt8(view.readUInt8(length) ^ key >>> length % 4 * 8 & 255, length);
            }
        }
        return view;
    }
    decompressMessage(message) {
        const buffer = window.buffer.Buffer;
        const messageBuffer = new buffer(message.buffer);
        const readMessage = new buffer(messageBuffer.readUInt32LE(1));
        LZ4.decodeBlock(messageBuffer.slice(5), readMessage);
        return readMessage;
    }
    handleMessage(view) {
        const encode = () => {
            for (var text = '';;) {
                const string = view.getUint8(offset++);
                if (string == 0) {
                    break;
                }
                text += String.fromCharCode(string);
            }
            return text;
        };
        var offset = 0;
        let opCode = view.getUint8(offset++);
        if (opCode == 54) {
            opCode = 53;
        }
        switch (opCode) {
            case 5:

              console.log('[SPECT] case 5');
                     
                break;
				
            case 17:
			
                this.viewX = view.getFloat32(offset, true);	
				window.middleMultiViewFlag = defaultmapsettings.middleMultiViewWhenClose && legendmod.play && profiles[application.selectedOldProfile] && checkIfPlayerIsInView(profiles[application.selectedProfile].nick)
				if (defaultmapsettings.middleMultiView && legendmod.play){
					legendmod.viewX = (legendmod.viewXTrue + this.viewX) / 2;	
				}	
				else if (window.middleMultiViewFlag){					
					legendmod.viewX = (legendmod.viewXTrue + this.viewX) / 2;	
				}				
				else if (this.player && window.multiboxPlayerEnabled && spects[window.multiboxPlayerEnabled - 1]) {				
					legendmod.viewX = this.viewX 
				}				
				//var x=this.viewX = view.getFloat32(offset, true);
				//this.viewX = window.legendmod.vector[window.legendmod.vnr][0] ? this.translateX(x) : x;
                offset += 4;
				this.viewY = view.getFloat32(offset, true);	
				if (defaultmapsettings.middleMultiView && legendmod.play){				
					legendmod.viewY = (legendmod.viewYTrue + this.viewY) / 2;
				}	
				else if (window.middleMultiViewFlag){
					legendmod.viewY = (legendmod.viewYTrue + this.viewY) / 2;	
				}				
				else if (this.player && window.multiboxPlayerEnabled && spects[window.multiboxPlayerEnabled - 1]) {
					legendmod.viewY = this.viewY 
				}
				//var y=this.viewX = view.getFloat32(offset, true);
				//this.viewY = window.legendmod.vector[window.legendmod.vnr][1] ? this.translateY(y) : y;
                offset += 4;
                this.scale = view.getFloat32(offset, true);
                break;
            case 18:
                if (this.protocolKey) {
                    this.protocolKey = this.shiftKey(this.protocolKey);
                }
                this.flushCellsData();
              console.log('[SPECT] case 18');

                break;
            case 32:	
			  var temp = view.getUint32(offset, true)			  
			  this.playerCellIDs.push(this.newID(temp));
			  
			    this.isSpectateEnabled = false
			  
			  //this.active = true
              console.log('[SPECT] case 32');
				/*if (!this.openSecond){ 
					this.openSecond = true			  
					this.getTheOppositeSocialToken()
				}*/
                break;
            case 50:
              console.log('[SPECT] case 50');

                break;
			case 49: //leaderboard for specific private servers
				this.leaderboard = [];
				var count = view.getUint32(offset, true);
				offset += 4;
				for (i = 0; i < count; ++i) {
					var isMe = !!view.getUint32(offset, true);
					offset += 4;
					if (isMe){ 
						isMe = 'isPlayer'
					}
					let nick = window.decodeURIComponent(window.escape(encode())); //view.getStringUTF8();
					var temp;
						
					if (nick.includes('}')){
						temp = nick.split('}')[0].split('{')[1]
						nick = nick.split('}')[1]
					}	
					if (!application.customSkinsMap[nick] && temp){
						core.registerSkin(nick, null, "https://dkyriak.github.io/imsolo/" + temp + ".png", null);
						application.customSkinsMap[nick + "\'s imsolo.pro bot"]= "https://dkyriak.github.io/imsolo/" + temp + ".png"
							//core.registerSkin(nick, null, "https://imsolo.pro/web/skins/" + temp + ".png", null);
					}
						
						this.leaderboard.push({
						id: isMe,
						nick: nick
						});
					}
					//this.handleLeaderboard();				
            case 53:
				this.leaderboard = [];
                    for (let position = 0; offset <view.byteLength;) {
                        var flags = view.getUint8(offset++);
                        let nick = '';
                        let id = 0;
                        let isFriend = false;
                        let isFBFriend = false;
                        position++;
                        if (flags & 2) {
                            nick = window.decodeURIComponent(window.escape(encode()));
                        }
                        if (flags & 4) {
                            id = view.getUint32(offset, true);
                            offset += 4;
                        }
                        if (flags & 8) {
                            nick = this.playerNick;
                            id = 'isPlayer';
                            this.playerPosition = position;
							
                        }
                        if (flags & 16) {
                            isFriend = true;
                            this.friends++;
                        }
                        this.leaderboard.push({
                            nick: nick,
                            id: id,
                            isFriend: isFriend,
                            isFBFriend: isFBFriend
                        });
                    }				
              //console.log('case 53');

                break;
            case 54:

              console.log('[SPECT] case 54');
                break;

            case 69:
                var length = view.getUint16(offset, true);
                offset += 2;
                this.ghostCells = [];
                for(let i = 0; i < length; i++) {
                    var x = view.getInt32(offset, true);
                    offset += 4;
                    var y = view.getInt32(offset, true);
                    offset += 4;
                    var mass = view.getUint32(offset, true);
                    offset += 4;
                    //false&&console.log(view.getUint8(offset))
                    offset += 1

                    var size = ~~Math.sqrt(100 * mass);
                    this.ghostCells.push({
                        'x': x,
                        'y': y,
                        'size': size,
                        'mass': mass,
                        'inView': this.isInView(x, y, size)
                    });
                }
				this.GhostFix()				
                break;
				
            case 85:
			  toastr.warning("<b>[" + Premadeletter123 + "]:</b> " + "Captcha requested from Multibox client. Multibox closed");
              console.log('[SPECT] case 85');
			  this.terminate()
                
                break;
	    	case 87:
			//(function anonymous(t) {
				window.agarCaptcha.requestCaptchaV3("play", function(a) {
				var b = this.createView(2 + a.length);
				b.setUint8(0, 88);
				for (var c = 0; c < a.length; c++) b.setUint8(1 + c, a.charCodeAt(c));
				b.setUint8(a.length + 1, 0);
				this.sendMessage(b)
				});				
            case 102:
						//this.sendCursor()
						//console.log("[SPECT] SendNick with")						
						this.handleSendNick()
              console.log('[SPECT] case 102');
			  //console.log(Date.now() - this.timeStarted, this.player, this.active, this.annoucementTold)
			  if (Date.now() - this.timeStarted > 4000 && this.player && !this.active && !this.annoucementTold){
				  this.annoucementTold = true
				   toastr.warning("<b>[" + Premadeletter123 + "]:</b> " + "Seems there is an excessive delay for Multibox to start. Please hold the line...");
			  }
                break;
            case 103:
			  this.accessTokenSent = true
              console.log('[SPECT] case 103');
			  application.cacheCustomSkin(ogarcopythelb.nick, ogario.playerColor, ogarcopythelb.skinURL);
			  this.getTheOppositeSocialToken();			  
                break;
            case 104:
              console.log('[SPECT] case 104');

                break;
            case 114:
                console.error('[Agario] Spectate mode is full')
              console.log('[SPECT] case 114');

                break;
            case 160:

              console.log('[SPECT] case 160');

                    break;
            case 161:
              //console.log('case 161');

                break;
            case 176:
              console.log('[SPECT] case 176');

                break;
            case 177:
              console.log('[SPECT] case 177');

                break;
            case 178:

              console.log('[SPECT] case 178');

                break;
            case 179:

              console.log('[SPECT] case 179');

                break;
            case 180:

              console.log('[SPECT] case 180');

                break;
            case 226:
                const ping = view.getUint16(1, true);
                view = this.createView(3);
                view.setUint8(0, 227);
                view.setUint16(1, ping);
                this.sendMessage(view);

                break;
            case 241:
                this.protocolKey = view.getUint32(offset, true);
                //console.log('[SPECT] Received protocol key:', this.protocolKey);
                const agarioReader = new Uint8Array(view.buffer, offset += 4);
                this.clientKey = this.generateClientKey(this.ws, agarioReader);
                break;
            case 242:
                console.log('[SPECT] case 242')
                this.serverTime = view.getUint32(offset, true) * 1000;
                this.serverTimeDiff = Date.now() - this.serverTime;
                
                if(this.player==true){
					if (!window.MultiWS || window.MultiWS!=this.ws){ 
						window.MultiWS = this.ws			  
						this.getTheOppositeSocialToken()
					}
					else{
						//console.log("[SPECT] SendNick without")
						//this.sendCursor()
						MultiTokenReady(this)
						this.handleSendNick()
					}
                } 
				else {
                  this.sendSpectate();
                }
                if(this.staticX!=null&&this.staticY!=null) {
                    setInterval(() => {
                        this.sendPosition(this.convertX(this.staticX), this.convertY(this.staticY));
                    }, 50);
					if (!this.player){
						
						this.sendFreeSpectate()
					}
                }				
                break;
            case 255:
				//this.constantrecalculation2()
                this.handleSubmessage(view);
				this.beforecalculation() //render calculations i put them here to avoid another interval
                break;
            case 16: //specific private servers
              //console.log('[SPECT] case 16');
			  this.updateCells(new window.buffer.Buffer(view.buffer), offset);
				//jimboy3100
				//if (this.player && this.active && legendmod.playerCellsMulti.length==0 && this.timer && Date.now()-this.timer>3000){
				if (this.player && this.active && legendmod.playerCellsMulti.length==0){
					console.log('[SPECT] Multibox Player ' + this.number + ' lost');	
					this.terminate()			
				}	
				this.beforecalculation()				
                break;	
            case 64: //specific private servers
				if (!this.openFirst){ //jimboy3100
					this.openFirst = true					
                    var message = new window.buffer.Buffer(view.buffer)
                    this.viewMinX = message.readDoubleLE(offset);
                    offset += 8;
                    this.viewMinY = message.readDoubleLE(offset);
                    offset += 8;
                    this.viewMaxX = message.readDoubleLE(offset);
                    offset += 8;
                    this.viewMaxY = message.readDoubleLE(offset);
                    this.setMapOffset(this.viewMinX, this.viewMinY, this.viewMaxX, this.viewMaxY);
					}
                    /*if (~~(this.viewMaxX - this.viewMinX) === legendmod.mapSize && ~~(this.viewMaxY - this.viewMinY) === legendmod.mapSize) {
                        window.userBots.offsetX = (this.viewMinX + this.viewMaxX) / 2
                        window.userBots.offsetY = (this.viewMinY + this.viewMaxY) / 2
                    }*/
                    break;
              //console.log('[SPECT] case 64');

                break;
            default:
                console.log('[SPECT] Unknown opcode:', view.getUint8(0));
                break;
        }
    }
	handleSendNick(){
		if (profiles[application.selectedOldProfile] && profiles[application.selectedOldProfile].nick && defaultmapsettings.multiBoxShadow){
			this.sendNick(profiles[application.selectedOldProfile].nick)
			this.nick=profiles[application.selectedOldProfile].nick
		}
		else{
			this.sendNick($("#nick").val())
			this.nick=$("#nick").val()
		}	
	}	
	GhostFix(){
		//if(!this.ghostFixed && this.mapOffsetFixed && this.ghostCells.length!=0 && Math.abs(application.getghostX())>1000 && Math.abs(application.getghostY()) >1000) {
		if(!this.ghostFixed && this.mapOffsetFixed && this.ghostCells.length!=0 && Math.abs(application.getghostX())>100 && Math.abs(application.getghostY()) >100) {
			this.fixX = /*Math.round*/(application.getghostX()/(this.ghostCells[0].x+this.mapOffsetX))<0?-1:1;
            this.fixY = /*Math.round*/(application.getghostY()/(this.ghostCells[0].y+this.mapOffsetY))<0?-1:1;
			this.ghostFixed = true			
        }					
	}	
    getX(x) {
      if((this.ghostFixed || !legendmod.integrity) && this.mapOffsetFixed) {
		  return ((x + this.mapOffsetX) * this.fixX - legendmod.mapOffsetX + this.fix3x)
		  
		  /*if (!window.multifixOffset) return ((x + this.mapOffsetX) * this.fixX - legendmod.mapOffsetX + this.fix3x)
		  else if (window.multifixOffset==0) return ((x + this.mapOffsetX) * this.fixX - legendmod.mapOffsetX - this.fix3x)
		  else if (window.multifixOffset==1) return ((x + this.mapOffsetX) * this.fixX - legendmod.mapOffsetX)	*/
        //return ((x + this.mapOffsetX + this.fix3x)*this.fixX - legendmod.mapOffsetX) The reason why this is wrong is because map is rotated already when cells meet for the first time			
		//return ~~((x + this.mapOffsetX)*this.fixX - legendmod.mapOffsetX)
      }
    }
    getY(y) {
      if((this.ghostFixed || !legendmod.integrity) && this.mapOffsetFixed) {
		 return ((y + this.mapOffsetY) * this.fixY - legendmod.mapOffsetY + this.fix3y)
		 
		 /*if (!window.multifixOffset) 
		 else if (window.multifixOffset==0) return ((y + this.mapOffsetY) * this.fixY - legendmod.mapOffsetY - this.fix3y)
		 else if (window.multifixOffset==1) return ((y + this.mapOffsetY) * this.fixY - legendmod.mapOffsetY)*/
        //return ~~((y + this.mapOffsetY)*this.fixY - legendmod.mapOffsetY)
      }
    }
    convertX(x) { //is used only for SendPosition
		return ~~((x + legendmod.mapOffsetX) * this.fixX - this.mapOffsetX - this.fix3x)
        //return ((x + legendmod.mapOffsetX) * this.fixX - this.mapOffsetX)
    }    
    convertY(y) {
		//return ((y + legendmod.mapOffsetY) * this.fixY - this.mapOffsetY)
        return ~~((y + legendmod.mapOffsetY) * this.fixY - this.mapOffsetY - this.fix3y)
    } 	
	constantrecalculation2(){
		//snez
        var mapX = legendmod.mapMaxX - legendmod.mapMinX;
        var mapY = legendmod.mapMaxY - legendmod.mapMinY;
        this.maxX = Math.round(mapX / legendmod.zoomValue / 10);
        this.maxY = Math.round(mapY / legendmod.zoomValue / 10); //or 1
	}	
	
	constantrecalculation3(x,y,z){	
		//this.fix3x = legendmod.playerCells[0].x - cell.x
		//this.fix3y = legendmod.playerCells[0].y - cell.y
		this.fix3x = -(legendmod.playerCells[0].x - x) * this.fixX
		this.fix3y = -(legendmod.playerCells[0].y - y) * this.fixY
		if (z){
			//this.moveExistedCells();
			//if (this.player){
			console.log('[SPECT] Found user cell, Offset fixed',x,y,legendmod.playerCells[0].x,legendmod.playerCells[0].y)
			toastr.warning("<b>[" + Premadeletter123 + "]:</b> " + "Multibox offset slightly changed (" + Math.round(this.fix3x) + "," +  Math.round(this.fix3y) + ") px" );
		}
		//}
	}
/*
	constantrecalculation3(x,y){	
		this.fix3x = (legendmod.playerCells[0].x - x)
		this.fix3y = (legendmod.playerCells[0].y - y)
		//this.fix3x = (legendmod.playerCells[0].x - x) * this.fixX
		//this.fix3y = (legendmod.playerCells[0].y - y) * this.fixY
		//toastr.warning(this.number +  " px: " + legendmod.playerCells[0].x + " x: " + x + " py: " +  legendmod.playerCells[0].y + " y: " + y);
		//toastr.warning(this.number +  " fixX: " + this.fixX + " fixY: " + this.fixY);
		
		this.moveExistedCells()
		if (this.player){
			console.log('[SPECT] Found user cell, Offset fixed',x,y,legendmod.playerCells[0].x,legendmod.playerCells[0].y)
			var result;
			var temp = Math.abs(Math.round(this.fix3x)) + Math.abs(Math.round(this.fix3y))
			if (temp<15) result="<font color='Green'><b>Good</b></font>"
			else if	(temp >= 15 && temp < 30) result="<font color='Yellow'><b>Fair</b></font>"
			else if	(temp >= 30 && temp < 40) result="<font color='Orange'><b>Medium</b></font>"
			else if	(temp >= 40 && temp < 60) result="<font color='Red'><b>Bad</b></font>"
			else if	(temp >= 60) result="<font color='Red'><b>Very bad</b></font>"
			toastr.warning("<b>[" + Premadeletter123 + "]:</b> " + "Offset slightly changed (" + Math.round(this.fix3x) + "," +  Math.round(this.fix3y) + ") px. Result: " + result + "<br> Multibox under development");
		}
	}
	constantrecalculation(){
			//3rd fix - excess processing
		if (this.ghostCells && this.ghostCells[0] && this.player){
			this.fix3x = this.convertX(legendmod.ghostCells[0].x) - this.ghostCells[0].x
			this.fix3y = this.convertY(legendmod.ghostCells[0].y) - this.ghostCells[0].y				
			//this.fix3x = legendmod.ghostCells[0].x - this.getX(this.ghostCells[0].x)
			//this.fix3y = legendmod.ghostCells[0].y - this.getY(this.ghostCells[0].y)		
		}
	}*/	
    isInView(x, y) {
        let mtp = 4.95,
            w = 1024/2*mtp,
            h = 600/2*mtp;
        if (x  < this.viewX-w || y  < this.viewY-h || x > this.viewX + w || y  > this.viewY + h) {
            return true;
        }
        return false;
    }
    isInViewCustom (x , y, size) {
			var randomNum = 0 // randomNum=40
			var distance = size + randomNum
			//var distance = size + randomNum + this.playerSize
            return !(x + distance < legendmod.camMinX ||
			y + distance < legendmod.camMinY ||
			x - distance > legendmod.camMaxX || 
			y - distance > legendmod.camMaxY) 			
    }
    isInViewCustom2 (x , y, size) {
			var x2s = legendmod.canvasWidth / 2 / legendmod.scale
			var y2s = legendmod.canvasHeight / 2 / legendmod.scale
			var randomNum = 0 // randomNum=40
			var distance = size + randomNum
			return !(x + distance < legendmod.viewXTrue - x2s || //<legendmod.camMinX
			y + distance < legendmod.viewYTrue - y2s || //<legendmod.camMinY
			x - distance > legendmod.viewXTrue + x2s || //>legendmod.camMaxX
			y - distance > legendmod.viewYTrue + y2s) //>legendmod.camMaxY
    }		
    isInViewCustom3 (x , y, size) {
			var randomNum = 0 // randomNum=-20
			var distance = size + randomNum
			//var distance = size + randomNum + this.playerSize
            return !(x + distance < legendmod.camMinMultiX ||
			y + distance < legendmod.camMinMultiY ||
			x - distance > legendmod.camMaxMultiX || 
			y - distance > legendmod.camMaxMultiY) 			
    }
    isInViewCustom4 (x , y, size) {
			var randomNum = 20 // randomNum=40
			var distance = size + randomNum
            return !(x + distance < legendmod.camMinMultiX ||
			y + distance < legendmod.camMinMultiY ||
			x - distance > legendmod.camMaxMultiX || 
			y - distance > legendmod.camMaxMultiY) 			
    }		
	//isMultiInView(x , y, size){
		//x + size < 
	//}
	moveExistedCells(){
		legendmod.cells.forEach((found) => {
								if ((found.isVirus || found.isFood) && found.spectator == this.number){ 
									//found.x = found.x + this.fix3x
									//found.y = found.y + this.fix3y
									legendmod.indexedCells[found.id].x += this.fix3x
									legendmod.indexedCells[found.id].y += this.fix3x
									legendmod.indexedCells[found.id].targetX += this.fix3x
									legendmod.indexedCells[found.id].targetY += this.fix3x																		
								} 
		})
	}
    setMapOffset(left, top, right, bottom) {
		
		if (!legendmod.integrity){ 
			this.mapSize = Math.abs((left - right)); 
			this.mapOffset = 0
		}
		else if (legendmod.integrity){ 
			this.mapSize = 14142; //14142.13562
			this.mapOffset = this.mapSize / 2
		}
		if (!legendmod.integrity || (right - left) > (this.mapSize - 142) && (bottom - top) > (this.mapSize - 142)) { 
		//if (!legendmod.integrity || (right - left) > 14000 && (bottom - top) > 14000) { //2020 jimboy3100	
		
			if (legendmod.integrity){
				/*
				this.stretchX = this.mapSize - right + left
				this.stretchY = this.mapSize - bottom + top
				console.log("stretch", this.stretchX, this.stretchY)
				right += this.stretchX/2
				left -=  this.stretchX/2
				bottom += this.stretchY/2
				top -=  this.stretchY/2		
				*/				
				this.mapOffsetX = this.mapOffset - right;
				this.mapOffsetY = this.mapOffset - bottom;					
				this.mapMinX = ~~(-this.mapOffset - this.mapOffsetX);
				this.mapMinY = ~~(-this.mapOffset - this.mapOffsetY);
				this.mapMaxX = ~~(this.mapOffset - this.mapOffsetX);
				this.mapMaxY = ~~(this.mapOffset - this.mapOffsetY);
			}
			else{
				this.mapOffsetX = this.mapSize / 2
				this.mapOffsetY = this.mapSize / 2
				this.mapMinX = left
				this.mapMinY = top
				this.mapMaxX = right
				this.mapMaxY = bottom
			}
				
			/*
            this.mapMidX = (this.mapMaxX + this.mapMinX) / 2;
            this.mapMidY = (this.mapMaxY + this.mapMinY) / 2;
			*/
            if (!this.mapOffsetFixed) {
                this.viewX = (right + left) / 2;
                this.viewY = (bottom + top) / 2;
            }
            this.mapOffsetFixed = true;
            console.log('[SPECT] Map offset fixed (x, y):', this.mapOffsetX, this.mapOffsetY);
			
			
        }
		if (!legendmod.integrity){
			if (this.player){
				this.handleSendNick()			
			}
			//else if (!this.player && !window.fullSpectator){
			else if (!this.player){	
				//console.log(this.number)
				this.sendSpectate();
			}
			if(this.staticX!=null&&this.staticY!=null) {
				setInterval(() => {
					this.sendPosition(this.convertX(this.staticX), this.convertY(this.staticY));
				}, 50);
				if (!this.player){
					this.sendFreeSpectate()
				}
			}
		}		
    }	
	
	terminate(){
		this.active = null;		
		window.multiboxPlayerEnabled = null
		if (!legendmod.play){
			application.showMenu()
		}	
		var temp = this.number-1
		if (spects[temp]){
			spects[temp].closeConnection()
			spects = spects.slice(temp+1);
		}				
	}	
    handleSubmessage(message) {
        message = this.decompressMessage(message);
        let offset = 0;
        switch (message.readUInt8(offset++)) {
            case 16:
                this.updateCells(message, offset);
				//jimboy3100
				//if (this.player && this.active && legendmod.playerCellsMulti.length==0 && this.timer && Date.now()-this.timer>3000){
				if (this.player && this.active && legendmod.playerCellsMulti.length==0){
					console.log('[SPECT] Multibox Player ' + this.number + ' lost');	
					this.terminate()			
				}				
                break;			
            case 64:
				if (!this.openFirst){ //jimboy3100
				this.openFirst = true
                this.viewMinX = (message.readDoubleLE(offset));
                offset += 8;
                this.viewMinY = (message.readDoubleLE(offset));
                offset += 8;
                this.viewMaxX = (message.readDoubleLE(offset));
                offset += 8;
                this.viewMaxY = (message.readDoubleLE(offset));
                this.setMapOffset(this.viewMinX, this.viewMinY, this.viewMaxX, this.viewMaxY);
				} //
				//this.timer=Date.now();			
				break;
            default:
                console.log('[SPECT] Unknown sub opcode:', message.readUInt8(0));
                break;
        }
    }
    updateCells(view, offset) {
        const encode = () => {
            for (var text = '';;) {
                const string = view.readUInt8(offset++);
                if (string == 0) {
                    break;
                }
                text += String.fromCharCode(string);
            }
            return text;
        };
		//
		if (this.time) this.timerDifference = Date.now() - this.time
		//
        this.time = Date.now();
        this.removePlayerCell = false;
        let eatEventsLength = view.readUInt16LE(offset);
        offset += 2;
        for (var length = 0; length < eatEventsLength; length++) {
            const eaterID = legendmod.indexedCells[this.newID(view.readUInt32LE(offset))];
            const victimID = legendmod.indexedCells[this.newID(view.readUInt32LE(offset + 4))];
			if (legendmod.playerCellsMulti.includes(victimID)){
				this.removePlayerCell = true;
				legendmod.playerCellsMulti.splice(legendmod.playerCellsMulti.indexOf(victimID), 1) 
				if (this.playerCellIDs.includes(victimID)){
					console.log('cell ids', this.playerCellIDs)
					console.log('erase cell id', victimID)
					this.playerCellIDs.splice(this.playerCellIDs.indexOf(victimID), 1) 
					console.log('cells after erase', this.playerCellIDs)
				}				
			}
			
			//remove user cell id if victim was his cell
			//delete legendmod.indexedCells[victimID] //don't even wait for Legend mod, delete eaten cells here
            //console.log('victim isFood',victimID.isFood)
            offset += 8;
            if (eaterID && victimID) {
                victimID.targetX = eaterID.x;
                victimID.targetY = eaterID.y;
                victimID.targetSize = victimID.size;
                victimID.time = this.time;
                victimID.removeCell();
            }
        }				
        for (length = 0;;) {
            var id = view.readUInt32LE(offset);
            offset += 4;
            if (id == 0) {
                break;
            }
            let x = view.readInt32LE(offset);
            offset += 4;
            let y = view.readInt32LE(offset);
            offset += 4;
            const size = view.readUInt16LE(offset);
            offset += 2;			
			//snez
			var invisible;

		
			if (!this.player && (this.ghostFixed || !legendmod.integrity) ){
				invisible = this.staticX!=null?this.isInView(x, y):false;
			}	
				
			//test
			//this.constantrecalculation()			
			if (this.getX){
				x = this.getX(x)	
				//x = this.getX(x)+this.fix3x
			}
			if (this.getY){ 
				y = this.getY(y)
				//y = this.getY(y)+this.fix3y
			}	
		
			/*else {
				console.log("Error","Spect",this.number,"ghostFixed",this.ghostFixed,"mapOffsetFixed",this.mapOffsetFixed,"x",x,"mapOffsetX",this.mapOffsetX,"LM mapOffsetX",legendmod.mapOffsetX,"fixX",this.fixX)
			}*/			
			var remove = false;		
			//!this.player
			//if (!this.player){
			if (this.ghostFixed || !legendmod.integrity){	
				var a = x - legendmod.playerX;
				var b = y - legendmod.playerY;
				var distanceX = Math.round(Math.sqrt(a * a));
				var distanceY = Math.round(Math.sqrt(b * b));		
				if (distanceX > this.maxX || distanceY > this.maxY){ 
						remove = true;
				}
			}
			
			//

            const flags = view.readUInt8(offset++);
            let extendedFlags = 0;
            if (flags & 128) {
                extendedFlags = view.readUInt8(offset++);
            }						
			let color = null
            let skin = null;
            let name = '';
            let accountID = null;
            if (flags & 2) {
                const r = view.readUInt8(offset++);
                const g = view.readUInt8(offset++);
                const b = view.readUInt8(offset++);
			   //snez		
			color = legendmod.rgb2Hex(~~(r * 0.9), ~~(g * 0.9), ~~(b * 0.9));			   
            }
            if (flags & 4) {
                skin = encode();
            }
            if (flags & 8) {			
                    name = window.decodeURIComponent(escape(encode()));					
                    if (legendmod && legendmod.gameMode && legendmod.gameMode != ":teams") {
                        legendmod.vanillaskins(name, skin);
                    }				
            }
            if (flags & 10) {
            }
            const isVirus = flags & 1;
            var isFood = extendedFlags & 1;
            const isFriend = extendedFlags & 2;

			if (!legendmod.integrity){ //fix of food for private servers
				if (size<21) isFood = 1
			}
			/*if (this.player && !this.active && !legendmod.playerCellsMulti.includes(id)){
				invisible = true
			}
			else if  (this.player && this.active){
				invisible = false
			}*/
			
                  id = this.newID(id);

				//FOR COLOR
				if (!isVirus && !isFood && name!=""){
					if (legendmod.cellcolors[name]){ 
						color = legendmod.cellcolors[name]
					}
					else{	
                        if (this.playerCellIDs.indexOf(id) != -1) {
							if (defaultmapsettings.myCustomColor) {
								color = profiles[application.selectedProfile].color
							}
                        }									
						else{
							application.teamPlayers.forEach((found) => {
								if (found.nick == name){ 
									color = found.color		
								} 
							})		
						}						
					}
					if (!legendmod.cellcolors[name]) legendmod.cellcolors[name]= color
				}
				//
				
			if (!this.player && (this.ghostFixed || !legendmod.integrity)){				
				if (!isFood){
					if (!invisible) invisible = this.isInViewCustom(x , y, size)	
				}
				else if (isFood){	
					if (window.ingameSpectator && legendmod.isSpectateEnabled){
						invisible = true
					}				
					else if (!window.fullSpectator){	
						if (!invisible) invisible = this.isInViewCustom(x , y, size)	
					}				
				}			
			}			
			//if (this.player && isVirus && !isFood && !invisible){
			if (this.player && (isVirus || isFood)){
				if (isFood) remove = this.isInViewCustom(x , y, size)
				if (isVirus) invisible = (this.isInViewCustom(x , y, size) && !this.isInViewCustom3(x , y, size)) //THIS IS THE MAIN PROBLEM CAUSING VIRUSES TO DUPLICATE OR HIDE
				
			
			
				if (!this.active){
					invisible = true
				}
			}	

			if (isFood && !defaultmapsettings.rainbowFood){
				color = defaultSettings.foodColor
			}
			if(defaultmapsettings.oneColoredSpectator && !isFood) {
				color = defaultSettings.foodColor
            }			
            var cell = null;
            if (legendmod.indexedCells.hasOwnProperty(id)) {
                cell = legendmod.indexedCells[id];
                cell.spectator = this.number;
				
            } 		
			else {
                cell = new window.legendmod1(id, x, y, size, color, isFood, isVirus, false, defaultmapsettings.shortMass, defaultmapsettings.virMassShots);
                cell.time = this.time;
                cell.spectator = this.number;
				//if (!isFood) {
				if (!isFood && !remove) {
                    if (isVirus && defaultmapsettings.virusesRange) {
                        legendmod.viruses.push(cell);
                    }
                    //legendmod.cells.push(cell);
                        if (this.playerCellIDs.indexOf(id) != -1 && legendmod.playerCellsMulti.indexOf(cell) == -1) {
                            cell.isPlayerCell = true;
                            //this.playerColor = color;
							this.playerColor = profiles[application.selectedOldProfile].color;
							cell.color = profiles[application.selectedOldProfile].color;		
							
                            legendmod.playerCellsMulti.push(cell);
							if (legendmod.playerCellsMulti.length==1){
								console.log('[SPECT] Player cell is active')
								this.active = true
								this.sendCursor()
								loadMultiCellSkin()
								
							}
                        }	
                } 
				else if (isFood){
                    legendmod.foodMulti.push(cell); //this causes problems					
                }
				if (defaultmapsettings.oneColoredSpectator && !this.player) {
					if (!isFood && !remove) legendmod.cells.push(cell);				
				}
				else{
					//if (!remove && (!invisible && isVirus)){
					if (!remove){	
						legendmod.cells.push(cell);
					}
				}
                legendmod.indexedCells[id] = cell;
            }
            
            if (name) {
                cell.targetNick = name;
            }
			if (cell.isPlayerCell){
				cell.targetNick = this.nick
				cell.isPlayerCellMulti=true
			}
			//if (!cell.isPlayerCell && (cell.targetNick == profiles[application.selectedOldProfile].nick || cell.targetNick == profiles[application.selectedProfile].nick) && (Date.now() - legendmod.playerCells[0].time < 10) && cell.targetNick!="" && legendmod.playerCells[0] && ~~legendmod.playerCells[0].size == ~~cell.size && !this.openFourth){
			if (!cell.isPlayerCell && (cell.targetNick == profiles[application.selectedOldProfile].nick || cell.targetNick == profiles[application.selectedProfile].nick) && cell.targetNick!="" && legendmod.playerCells[0] && ~~legendmod.playerCells[0].size == ~~cell.size){
				this.openFourth = true	
				if (!this.openFourth){
					this.constantrecalculation3(cell.x, cell.y, true)
				}
				else{
					//this.constantrecalculation3(cell.x, cell.y, false)
					//console.log(this.fix3x,this.fix3y)
				}				
			}		
            cell.targetX = x;
            cell.targetY = y;
            cell.targetSize = size;
			cell.size = size;
            cell.isFood = isFood;
            cell.isVirus = isVirus;		
            cell.invisible = invisible;
            if (skin) {
                cell.skin = skin;
            }
            if (extendedFlags & 4) {
                accountID = view.readUInt32LE(offset);
                offset += 4;
                cell.accID = accountID;
                let friend = legendmod.fbOnline.find(element => {return element.id == accountID});
                friend != undefined?cell.fbID = friend.fbId:void(0);
            }
            if (extendedFlags & 2) {
                cell.isFriend = isFriend;
                //console.log('FB friend cell in view', isFriend)
            }
        }
       // var rmaxedX=rmaxedY=rminedX=rminedY=0

       eatEventsLength = view.readUInt16LE(offset);
        offset += 2;
        for (length = 0; length < eatEventsLength; length++) {
            var id = view.readUInt32LE(offset);
            offset += 4;
            cell = legendmod.indexedCells[this.newID(id)];
            if (cell) {
                cell.removeCell();
            }
        }
		
    }

	beforecalculation(){	
        if (legendmod.playerCellsMulti.length) {
			if (!this.openSecond){
				this.openSecond = true;
				window.multiboxPlayerEnabled = this.number
			}			
            this.calculatePlayerMassAndPosition();
		}
	    else{
			window.multiboxPlayerEnabled = null
		}
	}	
    newID(id) {
      //return id
	  return id + this.number * 1000000000
    }
	calculatePlayerMassAndPosition(){
			
            var size = 0;
            var targetSize = 0;
            var x = 0;
            var y = 0;
            var playersLength = legendmod.playerCellsMulti.length;
            for (let length = 0; length < playersLength; length++) {
                var n = legendmod.playerCellsMulti[length];
                size += n.size;
                targetSize += n.targetSize * n.targetSize;
                x += n.x / playersLength;
                y += n.y / playersLength;
            }
			window.middleMultiViewFlag = defaultmapsettings.middleMultiViewWhenClose && legendmod.play && profiles[application.selectedOldProfile] && checkIfPlayerIsInView(profiles[application.selectedProfile].nick)
			if (defaultmapsettings.middleMultiView && legendmod.play){
				legendmod.viewX = (legendmod.viewXTrue + x + this.fix3x) / 2;
				legendmod.viewY = (legendmod.viewYTrue + y + this.fix3y) / 2;	
			}
			else if (window.middleMultiViewFlag){
				legendmod.viewX = (legendmod.viewXTrue + x + this.fix3x) / 2;
				legendmod.viewY = (legendmod.viewYTrue + y + this.fix3y) / 2;					
			}
			else if (window.multiboxPlayerEnabled){
				//legendmod.viewX = x;
				//legendmod.viewY = y;		
				legendmod.viewX = x + this.fix3x;
				legendmod.viewY = y + this.fix3y;				
			}			
			this.playerX = x;
			this.playerY = y;
			
			if (!this.openThird){ 
				this.openThird = true	
				window.targetingLeadX = this.playerX
				window.targetingLeadY = this.playerY
				legendmod.drawCommander2 = true;			
			}
            this.playerSize = size;
            this.playerMass = ~~(targetSize / 100);
			this.recalculatePlayerMass();
			
			this.constantrecalculation2()
			if (this.timerDifference > 10){
				setTimeout(function() {
					this.timerDifference = this.timerDifference - 10
					if (window.multiboxPlayerEnabled && spects[window.multiboxPlayerEnabled-1]) spects[window.multiboxPlayerEnabled-1].calculatePlayerMassAndPosition()
				}, 10); 
			}
	}	
    recalculatePlayerMass() {
            if (this.playerScore = Math.max(this.playerScore, this.playerMass),
                defaultmapsettings.virColors || defaultmapsettings.splitRange || defaultmapsettings.oppColors || defaultmapsettings.oppRings || defaultmapsettings.showStatsSTE) {
                var cells = legendmod.playerCellsMulti;
                var CellLength = cells.length;
                cells.sort(function(cells, CellLength) {
                    return cells.size == CellLength.size ? cells.id - CellLength.id : cells.size - CellLength.size;
                });
                this.playerMinMass = ~~(cells[0].size * cells[0].size / 100);
                this.playerMaxMass = ~~(cells[CellLength - 1].size * cells[CellLength - 1].size / 100);
                this.playerSplitCells = CellLength;
            }
            if (true) {
                var mass = legendmod.selectBiggestCell ? this.playerMaxMass : this.playerMinMass;
                // this.STE = i > 35 ? ~~(i * (i < 1000 ? 0.35 : 0.38)) : null; //Sonia2
                //this.STE = Math.floor(mass * Math.pow(1.15, 2)/4); //Sonia2
				this.STE = Math.floor(mass * defaultmapsettings.dominationRate/4); //Sonia2
                this.MTE = Math.floor(mass * defaultmapsettings.dominationRate/2); //Sonia2
                this.BMTE = Math.ceil(mass * defaultmapsettings.dominationRate); //Sonia2
                this.BSTE = Math.ceil(mass * defaultmapsettings.dominationRate*2); //Sonia2
                this.TTE = Math.ceil(mass / 6); //Sonia2
                this.PTE = Math.floor(mass * 0.66); //Sonia2
            }			
        }	
}

    window.sendAction = action => {
        legendmod.sendAction(action);
    };
function MultiTokenReady(spector){
	if (spector && master.accessTokenFB){
		spector.sendFbToken(master.accessTokenFB)
	}
	else if (spector && master.accessTokenGPlus){
		spector.sendGplusToken(master.accessTokenGPlus)
	}
}	
function checkIfMultiPlayerIsInView(b){
	for (var i=0;i<legendmod.cells.length;i++){	
		if (b!="" && legendmod.cells[i].nick == b && !legendmod.cells[i].isPlayerCell){
			return true		
		}
	}
	return false
}
