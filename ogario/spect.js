//SPECS v4.8 WORKS UNTIL HERE

function loadMultiCellSkin(spect) {
    var profileIdx = (application.mbSlots && spect && spect.number < application.mbSlots.length)
        ? application.mbSlots[spect.number] : application.selectedOldProfile;
    var prof = profiles[profileIdx];
    if (prof && prof.nick && prof.skinURL) {
        if (typeof application !== 'undefined' && application.cacheCustomSkin) {
            application.cacheCustomSkin(prof.nick, prof.color || '#000000', prof.skinURL);
        }
        if (typeof core !== 'undefined' && core && typeof core.registerSkin === 'function') {
            core.registerSkin(prof.nick, null, prof.skinURL, null);
        }
    }
}

if (typeof window.spects === "undefined" || !window.spects) {
    window.spects = [];
}
var spects = window.spects;

function addBox() {
    let spect = new Spect({ player: true });
    legendmod.multiBoxPlayerExists = true;
    spects.push(spect);
}
window.addBox = addBox;

function addSpectator() {
    let spect = new Spect();
    spects.push(spect);
}
window.addSpectator = addSpectator;

function addFullSpectator() {
    let mtp = 4.95,
        w = ~~(1024 * mtp),
        h = ~~(600 * mtp);
    let stop = 0,
        x = 0,
        y = 0;

    const times = parseInt(legendmod.mapSize / 471.4);
    //for (;stop<30;stop++){

    if (legendmod.integrity && times < 80) {
        for (; stop < times; stop++) {

            if (stop === 0) {
                x = legendmod.mapMinX + 2400;
                y = legendmod.mapMinY + 1000;
                let spect = new Spect({ staticX: x, staticY: y });
                spects.push(spect)
                stop++
            } else {
                if (x > legendmod.mapMaxX - 2400) {
                    x = legendmod.mapMinX + 2400;
                    y = y + h;
                } else {
                    x = x + w;
                }
                if (y > legendmod.mapMaxY - 1000) {
                    //stop = 100;
                    stop = 10000;
                    break
                }
                let spect = new Spect({ staticX: x, staticY: y });
                spects.push(spect)
                stop++
            }
        }
    } else {
        toastr.error("Full spectator does not work for Private servers. <br>There is not such thing as <i>FreeSpectate</i> on Private Servers")
        //toastr.error("Too many spects needed: " + times/2 + "<br> Attempt canceled")
        window.fullSpectator = false
    }
}

if (!window.spects) window.spects = [];
spects = window.spects;

class Spect {
    constructor(options) {
        options = options || {};
        this.number = spects.reduce(function (max, spect) {
            return spect && spect.number > max ? spect.number : max;
        }, 0) + 1;
        this.player = options.player === true;
        this.staticX = options.staticX != null ? options.staticX : null;
        this.staticY = options.staticY != null ? options.staticY : null;
        this.socket = null;
        this.connectionGeneration = 0;
        this.positionController = null;
        this.staticPositionController = null;
        this.socketErrorTimer = null;
        this.reconnectTimer = null;
        this.massPositionTimer = null;
        this.mapOffset = 7071 //7071.067811865476
        this.fixX = 1
        this.fixY = 1
        this.closedByUser = false
        if (!legendmod.playerCellsMulti) legendmod.playerCellsMulti = []
        this.integrity = null;
        this.resetConnectionState();
        this.connect()
    }

    clearAsyncState() {
        if (this.positionController) clearInterval(this.positionController);
        if (this.staticPositionController) clearInterval(this.staticPositionController);
        if (this.socketErrorTimer) clearTimeout(this.socketErrorTimer);
        if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
        if (this.massPositionTimer) clearTimeout(this.massPositionTimer);
        this.positionController = null;
        this.staticPositionController = null;
        this.socketErrorTimer = null;
        this.reconnectTimer = null;
        this.massPositionTimer = null;
    }

    resetConnectionState() {
        this.clearAsyncState();
        this.ws = null
        this.nick = null
        this.accessTokenSent = false
        this.protocolKey = null
        this.clientKey = null
        this.clientVersion = null
        this.connectionOpened = false
        this.mapOffsetX = 0
        this.mapOffsetY = 0
        this.mapOffsetFixed = false
        this.ghostFixed = false
        this.active = null
        this.targetX = null
        this.targetY = null
        this.playerCellIDs = []
        this.playerScore = 0
        this.fix3x = 0
        this.fix3y = 0
        this.foodCalibrated = false
        this.foodSamples = []
        this.foodSampleIDs = {}
        this.openFirst = false
        this.openSecond = false
        this.openThird = false
        this.annoucementTold = false
        this.friends = 0
        this.leaderboard = []
        this.ghostCells = []
        this.playerSize = 0
        this.playerMass = 0
        this.playerMinMass = 0
        this.playerMaxMass = 0
        this.playerSplitCells = 0
    }

    connect() {
        this.resetConnectionState()
        this.closedByUser = false
        this.timeStarted = Date.now()
        this.ws = legendmod.ws
        const generation = ++this.connectionGeneration;
        const createSocket = window.createLegendWebSocket || function (url) { return new WebSocket(url); };
        const socket = createSocket(legendmod.ws);
        this.socket = socket;
        this.integrity =
            typeof socket._lwIntegrity === "boolean"
                ? socket._lwIntegrity
                : Boolean(legendmod.integrity);
        socket.binaryType = 'arraybuffer'
        socket.onopen = () => {
            if (this.socket === socket && this.connectionGeneration === generation) this.onopen();
        };
        socket.onmessage = (message) => {
            if (this.socket === socket && this.connectionGeneration === generation) this.onmessage(message);
        };
        socket.onerror = () => {
            if (this.socket === socket && this.connectionGeneration === generation) this.onerror(socket, generation);
        };
        socket.onclose = () => {
            if (this.socket === socket && this.connectionGeneration === generation) this.onclose(socket, generation);
        };
    }

    onopen() {
        console.log('[SPECT] Game server socket ' + this.number + ' open')


        this.clientVersion = window.master.clientVersion
        this.protocolVersion = window.master.protocolVersion

        let view = this.createView(5);
        view.setUint8(0, 254);
        if (!this.integrity) {
            view.setUint32(1, 6, true);
        } else {
            view.setUint32(1, this.protocolVersion, true);
        }
        this.sendMessage(view);
        view = this.createView(5);
        view.setUint8(0, 255);
        if (!this.integrity) {
            view.setUint32(1, 1, true);
        } else {
            view.setUint32(1, this.clientVersion, true);
        }
        this.sendMessage(view);
        this.connectionOpened = true;


    }

    onmessage(message) {
        message = new DataView(message.data);
        //if (this.buffersKey) message.data = algorithm.rotateBufferBytes(message.data, this.buffersKey)

        if (this.protocolKey) {
            message = this.shiftMessage(message, this.protocolKey ^ this.clientVersion);
        }
        try {
            this.handleMessage(message);
        } catch (e) {
            if (!(e instanceof RangeError)) console.error('[SPECT] onmessage error:', e);
        }
    }

    onerror(socket, generation) {
        if (this.socketErrorTimer) clearTimeout(this.socketErrorTimer);
        this.socketErrorTimer = setTimeout(() => {
            this.socketErrorTimer = null;
            if (this.socket !== socket || this.connectionGeneration !== generation) return;
            if (socket && (socket.readyState === WebSocket.CONNECTING || socket.readyState === WebSocket.OPEN)) socket.close()
        }, 1000)
        console.log('error')
    }

    onclose(socket, generation) {
        if (this.socket !== socket || this.connectionGeneration !== generation) return;
        const shouldReconnect = !this.closedByUser;
        this.connectionOpened = false
        this.socket = null;
        this.flushCellsData()
        this.resetConnectionState()
        console.log('closed')
        if (shouldReconnect) {
            this.reconnectTimer = setTimeout(() => {
                this.reconnectTimer = null;
                if (!this.closedByUser && this.connectionGeneration === generation) this.connect();
            }, 1000);
        }
    }

    closeConnection() {
        this.closedByUser = true
        this.connectionGeneration++
        this.clearAsyncState()
        if (this.socket) {
            this.socket.onopen = null;
            this.socket.onmessage = null;
            this.socket.onerror = null;
            this.socket.onclose = null;
            try {
                this.socket.close();
            } catch (error) {
            }
            this.socket = null;
            this.ws = null;
        }
        this.flushCellsData()
        this.resetConnectionState()
        this.closedByUser = true
    }

    flushCellsData() {
        this.isSpectateEnabled = false
        this.isFreeSpectate = false;
        this.ghostCells = [];
        //this.indexedCells = {};
        //this.deletefromObject("indexedCells")
        //this.cells = [];
        //this.deleteFromArray("cells")
        // Only remove this unit's cells from playerCellsMulti, not all units'
        legendmod.playerCellsMulti = legendmod.playerCellsMulti.filter(function(c) {
            return c.spectator !== this.number;
        }.bind(this));
        this.playerCellIDs = [];
        //this.food = [];
        //this.viruses = [];
        //this.deleteFromArray("viruses")
        const ownedCells = new Set(Object.values(legendmod.indexedCells).concat(legendmod.cells));
        for (let cell of ownedCells) {
            if (cell.spectator === this.number) {
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
        if (this.isSocketOpen()) this.socket.send(data.buffer);
    }

    sendMessage(message) {
        if (this.connectionOpened && this.integrity) {
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
    getTheOppositeSocialToken() {
        if (master.context === "facebook") {
            if (master.accessTokenGPlus) {
                MultiTokenReady(this)
            } else {
                window.MultiPending = this
                document.getElementById("gplusLogin").click()
                //this.handleSendNick()
                console.log('[SPECT] Login Tokens - Main: Google, Multi: Facebook')
            }
        } else if (master.context === "google") {
            if (master.accessTokenFB) {
                MultiTokenReady(this)
            } else {
                window.MultiPending = this
                master.facebookLogin()
                console.log('[SPECT] Login Tokens - Main: Facebook, Multi: Google')
            }
            //this.handleSendNick()
        } else if (!master.context) {
            //this.sendGplusToken(localStorage.getItem("accessTokenGPlus"))
            console.log('[SPECT] Login Tokens - Main: No, Multi: No')
            this.handleSendNick()
        } else {
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
        if (!this.integrity) {
            return
        }
        if (this.accessTokenSent) {
            return;
        }
        if (!oW) {
            oW = 102;
        }
        const curr = shapes.length;
        const count = legendmod.clientVersionString.length;
        let data = [oW, 8, 1, 18];
        application.writeUint32(data, curr + count + 23);
        data.push(8, 10, 82);
        application.writeUint32(data, curr + count + 18);
        data.push(8, options, 18, count + 8, 8, 5, 18, count);
        let prev = 0;
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
        const raw_basefont = new DataView(data.buffer);
        this.sendMessage(raw_basefont);
    }

    sendCursor() {
        if (this.positionController) clearInterval(this.positionController);
        this.positionController = setInterval(() => {

            if (legendmod.pause) {
                this.sendPosition(this.convertX(this.playerX), this.convertY(this.playerY));
            } else if (window.multiboxPlayerEnabled || this.isFreeSpectate || window.multiboxFollowMouse) {
                this.sendPosition(this.convertX(legendmod.cursorX), this.convertY(legendmod.cursorY));

                this.distX = this.convertX(legendmod.cursorX) - this.playerX
                this.distY = this.convertY(legendmod.cursorY) - this.playerY
            } else if (!window.multiboxPlayerEnabled || this.isFreeSpectate || window.multiboxFollowMouse) {
                if (defaultmapsettings.multiKeepMoving) {
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
        if (this.staticX === 0) {
            if (this.isFreeSpectate) {
                this.sendCursor()
            } else {
                clearInterval(this.positionController)
                this.positionController = null
            }
        }
        this.sendAction(18);
    }

    startStaticPositionController() {
        if (this.staticPositionController) clearInterval(this.staticPositionController);
        if (this.staticX == null || this.staticY == null) return;
        this.staticPositionController = setInterval(() => {
            this.sendPosition(this.convertX(this.staticX), this.convertY(this.staticY));
        }, 50);
    }

    sendBotEject() { //specific private servers
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
        if (!this.active) { //if cell didn't start
            //console.log(nick)
            //this.sendNickOnce=true
            const self = this;
            this.playerNick = nick;
            const sendSpawn = function (token) {
                //var token = grecaptcha.getResponse();
                nick = window.unescape(window.encodeURIComponent(self.playerNick));
                const view = self.createView(1 + nick.length + 1 + token.length + 1);
                let pos = 1;
                for (let length = 0; length < nick.length; length++, pos++) view.setUint8(pos, nick.charCodeAt(length))
                pos++
                for (let length = 0; length < token.length; length++, pos++) view.setUint8(pos, token.charCodeAt(length));
                self.sendMessage(view);
            };
            if (self.integrity) {
                agarCaptcha.requestCaptchaV3(
                    "play",
                    function (token) {
                        if (typeof token !== "string" ||
                            token.length === 0) {
                            console.warn(
                                "[SPECT] CAPTCHA returned no usable token"
                            );
                            return;
                        }

                        sendSpawn(token);
                    }
                );
            } else {
                sendSpawn("0");
            }
        }
    }

    sendPosition(x, y) {
        if (!this.isSocketOpen() || !this.connectionOpened || (!this.clientKey && this.integrity)) {
            return;
        }
        let sendX = x;
        let sendY = y;
        if (this.player === true && !this.active && Number.isFinite(this.targetX) && Number.isFinite(this.targetY)) {
            sendX = this.targetX;
            sendY = this.targetY;
        }
        if (!Number.isFinite(sendX) || !Number.isFinite(sendY)) return;
        const view = this.createView(13);
        view.setUint8(0, 16);
        view.setInt32(1, sendX, true);
        view.setInt32(5, sendY, true);
        this.targetX = sendX;
        this.targetY = sendY;
        view.setUint32(9, this.protocolKey, true);
        this.sendMessage(view);
    }

    generateClientKey(ip, options) {
        if (!ip.length || !options.byteLength) {
            return null;
        }
        let x = null;
        const Length = 1540483477;
		
        //const ipCheck = ip.match(/(ws+:\/\/)([^:]*)(:\d+)/)[2];
		// new code 6/8/2024
		var parsedUrl = new URL(ip);
		var ipCheck = parsedUrl.hostname + parsedUrl.pathname.replace(/\/$/g, '');
		
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
        if (x !== newValue) {
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
        let length;
        if (!write) {
            for (length = 0; length < view.byteLength; length++) {
                view.setUint8(length, view.getUint8(length) ^ key >>> length % 4 * 8 & 255);
            }
        } else {
            for (length = 0; length < view.length; length++) {
                view.writeUInt8(view.readUInt8(length) ^ key >>> length % 4 * 8 & 255, length);
            }
        }
        return view;
    }

    decompressMessage(message) {
        const buffer = window.buffer.Buffer;

        if (!message ||
            !message.buffer ||
            typeof message.byteLength !== "number") {
            throw new TypeError(
                "Invalid compressed spectator packet object"
            );
        }

        const messageBuffer =
            new buffer(
                message.buffer,
                message.byteOffset || 0,
                message.byteLength
            );

        const MAX_COMPRESSED_PACKET_SIZE =
            8 * 1024 * 1024;

        const MAX_DECOMPRESSED_PACKET_SIZE =
            32 * 1024 * 1024;

        const MAX_COMPRESSION_RATIO =
            256;

        if (messageBuffer.length < 6) {
            throw new RangeError(
                "Compressed spectator packet is too short"
            );
        }

        if (messageBuffer.length >
            MAX_COMPRESSED_PACKET_SIZE) {
            throw new RangeError(
                "Compressed spectator packet exceeds size limit"
            );
        }

        const outputSize =
            messageBuffer.readUInt32LE(1);

        const compressedSize =
            messageBuffer.length - 5;

        if (!Number.isSafeInteger(outputSize) ||
            outputSize <= 0 ||
            outputSize >
                MAX_DECOMPRESSED_PACKET_SIZE) {
            throw new RangeError(
                "Invalid spectator decompressed size"
            );
        }

        if (compressedSize <= 0 ||
            outputSize >
                compressedSize *
                MAX_COMPRESSION_RATIO) {
            throw new RangeError(
                "Invalid spectator compression ratio"
            );
        }

        const readMessage =
            new buffer(outputSize);

        /* ── Optimized inline LZ4 block decoder (typed arrays) ── */
        var src = new Uint8Array(
            message.buffer,
            (message.byteOffset || 0) + 5,
            compressedSize
        );
        var dst = new Uint8Array(outputSize);
        var sPos = 0, dPos = 0;
        var sEnd = compressedSize;

        while (sPos < sEnd) {
            var token = src[sPos++];

            /* ── Literals ── */
            var litLen = token >>> 4;
            if (litLen === 15) {
                var addByte;
                do {
                    addByte = src[sPos++];
                    litLen += addByte;
                } while (addByte === 255);
            }
            if (litLen > 0) {
                dst.set(
                    src.subarray(sPos, sPos + litLen),
                    dPos
                );
                sPos += litLen;
                dPos += litLen;
            }
            if (sPos >= sEnd) break;

            /* ── Match offset (2 bytes LE) ── */
            var offset =
                src[sPos] | (src[sPos + 1] << 8);
            sPos += 2;
            if (offset === 0) {
                throw new RangeError(
                    "LZ4: zero match offset (spectator)"
                );
            }

            /* ── Match length ── */
            var matchLen = (token & 0xF) + 4;
            if ((token & 0xF) === 15) {
                var addByte2;
                do {
                    addByte2 = src[sPos++];
                    matchLen += addByte2;
                } while (addByte2 === 255);
            }

            /* ── Copy match bytes ── */
            var matchPos = dPos - offset;
            if (offset >= matchLen) {
                dst.set(
                    dst.subarray(
                        matchPos,
                        matchPos + matchLen
                    ),
                    dPos
                );
                dPos += matchLen;
            } else {
                var mEnd = dPos + matchLen;
                while (dPos < mEnd) {
                    dst[dPos++] = dst[matchPos++];
                }
            }
        }

        /* Copy decoded data into the pre-allocated Buffer */
        new Uint8Array(
            readMessage.buffer,
            readMessage.byteOffset,
            outputSize
        ).set(dst);

        if (dPos < 0 || dPos > outputSize) {
            throw new RangeError(
                "Spectator LZ4 decompression failed"
            );
        }

        return readMessage;
    }

    handleMessage(view) {
         let offset;
//view.getStringUTF8();
        let temp;
        const encode = () => {
            let text;
            for (text = ''; ;) {
                const string = view.getUint8(offset++);
                if (string === 0) {
                    break;
                }
                text += String.fromCharCode(string);
            }
            return text;
        };
        offset = 0;
        let opCode = view.getUint8(offset++);
        if (opCode === 54) {
            opCode = 53;
        }
        switch (opCode) {
            case 5:

                console.log('[SPECT] case 5');

                break;

            case 17:

                this.viewX = view.getFloat32(offset, true);
                window.middleMultiViewFlag = defaultmapsettings.middleMultiViewWhenClose && legendmod.play && profiles[application.selectedOldProfile] && checkIfPlayerIsInView(profiles[application.selectedProfile].nick)
                if (defaultmapsettings.middleMultiView && legendmod.play) {
                    legendmod.viewX = (legendmod.viewXTrue + this.viewX) / 2;
                } else if (window.middleMultiViewFlag) {
                    legendmod.viewX = (legendmod.viewXTrue + this.viewX) / 2;
                } else if (this.player && window.multiboxPlayerEnabled === this.number && getActiveSpect(window.multiboxPlayerEnabled)) {
                    legendmod.viewX = this.viewX
                }
                //var x=this.viewX = view.getFloat32(offset, true);
                //this.viewX = window.legendmod.vector[window.legendmod.vnr][0] ? this.translateX(x) : x;
                offset += 4;
                this.viewY = view.getFloat32(offset, true);
                if (defaultmapsettings.middleMultiView && legendmod.play) {
                    legendmod.viewY = (legendmod.viewYTrue + this.viewY) / 2;
                } else if (window.middleMultiViewFlag) {
                    legendmod.viewY = (legendmod.viewYTrue + this.viewY) / 2;
                } else if (this.player && window.multiboxPlayerEnabled === this.number && getActiveSpect(window.multiboxPlayerEnabled)) {
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
                temp = view.getUint32(offset, true);
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
                const count = view.getUint32(offset, true);
                offset += 4;
                for (i = 0; i < count; ++i) {
                    let isMe = !!view.getUint32(offset, true);
                    offset += 4;
                    if (isMe) {
                        isMe = 'isPlayer'
                    }
                    let nick;
                    const rawNick = encode();
                    try {
                        nick = window.decodeURIComponent(window.escape(rawNick));
                    } catch (e) {
                        nick = rawNick || '';
                    }
                    temp = null;

                    if (nick.includes('}')) {
                        temp = nick.split('}')[0].split('{')[1]
                        nick = nick.split('}')[1]
                    }
                    if (!application.customSkinsMap[nick] && temp) {
                        core.registerSkin(nick, null, "https://dkyriak.github.io/imsolo/" + temp + ".png", null);
                        application.customSkinsMap[nick + "\'s imsolo.pro bot"] = "https://dkyriak.github.io/imsolo/" + temp + ".png"
                        //core.registerSkin(nick, null, "https://imsolo.pro/web/skins/" + temp + ".png", null);
                    }

                    this.leaderboard.push({
                        id: isMe,
                        nick: nick
                    });
                }
                break;
            //this.handleLeaderboard();
            case 53:
                this.leaderboard = [];
                this.friends = 0;
                for (let position = 0; offset < view.byteLength;) {
                    const flags = view.getUint8(offset++);
                    let nick = '';
                    let id = 0;
                    let isFriend = false;
                    let isFBFriend = false;
                    position++;
                    if (flags & 2) {
                        try {
                            nick = window.decodeURIComponent(window.escape(encode()));
                        } catch (e) {
                            nick = '';
                        }
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
                break;
            case 54:

                console.log('[SPECT] case 54');
                break;

            case 69:
                const length = view.getUint16(offset, true);
                offset += 2;
                this.ghostCells = [];
                for (let i = 0; i < length; i++) {
                    const x = view.getInt32(offset, true);
                    offset += 4;
                    const y = view.getInt32(offset, true);
                    offset += 4;
                    const mass = view.getUint32(offset, true);
                    offset += 4;
                    //false&&console.log(view.getUint8(offset))
                    offset += 1

                    const size = ~~Math.sqrt(100 * mass);
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
                window.agarCaptcha.requestCaptchaV3("play", (a) => {
                    const b = this.createView(2 + a.length);
                    b.setUint8(0, 88);
                    for (let c = 0; c < a.length; c++) b.setUint8(1 + c, a.charCodeAt(c));
                    b.setUint8(a.length + 1, 0);
                    this.sendMessage(b)
                });
                break;
            case 102:
                //this.sendCursor()
                //console.log("[SPECT] SendNick with")
                this.handleSendNick()
                console.log('[SPECT] case 102');
                //console.log(Date.now() - this.timeStarted, this.player, this.active, this.annoucementTold)
                if (Date.now() - this.timeStarted > 4000 && this.player && !this.active && !this.annoucementTold) {
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

                if (this.player == true) {
                    if (!window.MultiWS || window.MultiWS != this.ws) {
                        window.MultiWS = this.ws
                        this.getTheOppositeSocialToken()
                    } else {
                        //console.log("[SPECT] SendNick without")
                        //this.sendCursor()
                        MultiTokenReady(this)
                        this.handleSendNick()
                    }
                } else {
                    this.sendSpectate();
                }
                if (this.staticX != null && this.staticY != null) {
                    this.startStaticPositionController();
                    if (!this.player) {

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
                if (this.player && this.active && this.getOwnPlayerCells().length === 0) {
                    console.log('[SPECT] Multibox Player ' + this.number + ' lost');
                    this.terminate()
                }
                this.beforecalculation()
                break;
            case 64: //specific private servers
                if (!this.openFirst) { //jimboy3100
                    this.openFirst = true
                    const message = new window.buffer.Buffer(view.buffer);
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
            case 56:
            case 130:
            case 182:
            case 214:
            case 240:
            case 243:
            case 254:
                break;
            default:
                console.log('[SPECT] Unknown opcode:', view.getUint8(0));
                break;
        }
    }

    handleSendNick() {
        var profileIdx = (application.mbSlots && this.number < application.mbSlots.length)
            ? application.mbSlots[this.number] : application.selectedOldProfile;
        var prof = profiles[profileIdx] || profiles[0];
        if (prof && prof.nick && defaultmapsettings.multiBoxShadow) {
            this.sendNick(prof.nick);
            this.nick = prof.nick;
            if (prof.skinURL) {
                if (typeof application !== 'undefined' && application.cacheCustomSkin) {
                    application.cacheCustomSkin(prof.nick, prof.color || '#000000', prof.skinURL);
                }
                if (typeof core !== 'undefined' && core && typeof core.registerSkin === 'function') {
                    core.registerSkin(prof.nick, null, prof.skinURL, null);
                }
            }
        } else {
            this.sendNick($("#nick").val());
            this.nick = $("#nick").val();
        }
    }

    GhostFix() {
        //if(!this.ghostFixed && this.mapOffsetFixed && this.ghostCells.length!=0 && Math.abs(application.getghostX())>1000 && Math.abs(application.getghostY()) >1000) {
        if (!this.ghostFixed && this.mapOffsetFixed && this.ghostCells.length !== 0 && Math.abs(application.getghostX()) > 100 && Math.abs(application.getghostY()) > 100) {
            this.fixX = /*Math.round*/(application.getghostX() / (this.ghostCells[0].x + this.mapOffsetX)) < 0 ? -1 : 1;
            this.fixY = /*Math.round*/(application.getghostY() / (this.ghostCells[0].y + this.mapOffsetY)) < 0 ? -1 : 1;
            this.ghostFixed = true
        }
    }

    getX(x) {
        if ((this.ghostFixed || !this.integrity) && this.mapOffsetFixed) {
            var res = ((x + this.mapOffsetX) * this.fixX - legendmod.mapOffsetX + this.fix3x);
            if (window.legendmod && window.legendmod.vector && window.legendmod.vector[window.legendmod.vnr] && window.legendmod.vector[window.legendmod.vnr][0]) {
                res = legendmod.mapMaxX - (res - legendmod.mapMinX);
            }
            return res;
        }
        return x;
    }

    getY(y) {
        if ((this.ghostFixed || !this.integrity) && this.mapOffsetFixed) {
            var res = ((y + this.mapOffsetY) * this.fixY - legendmod.mapOffsetY + this.fix3y);
            if (window.legendmod && window.legendmod.vector && window.legendmod.vector[window.legendmod.vnr] && window.legendmod.vector[window.legendmod.vnr][1]) {
                res = legendmod.mapMaxY - (res - legendmod.mapMinY);
            }
            return res;
        }
        return y;
    }

    convertX(x) { //is used only for SendPosition
        var res = x;
        if (window.legendmod && window.legendmod.vector && window.legendmod.vector[window.legendmod.vnr] && window.legendmod.vector[window.legendmod.vnr][0]) {
            res = legendmod.mapMaxX - (res - legendmod.mapMinX);
        }
        return ((res + legendmod.mapOffsetX) * this.fixX - this.mapOffsetX - this.fix3x);
    }

    convertY(y) {
        var res = y;
        if (window.legendmod && window.legendmod.vector && window.legendmod.vector[window.legendmod.vnr] && window.legendmod.vector[window.legendmod.vnr][1]) {
            res = legendmod.mapMaxY - (res - legendmod.mapMinY);
        }
        return ((res + legendmod.mapOffsetY) * this.fixY - this.mapOffsetY - this.fix3y);
    }

    calibrateWithFood(spectCell, isFood) {
        if (this.foodCalibrated || !legendmod) return;
        var rawID = spectCell.id % 1000000000;
        var mainCell = (legendmod.indexedCells && legendmod.indexedCells[rawID]) ? legendmod.indexedCells[rawID] : null;
        if (!mainCell && legendmod.food) {
            for (var f = 0; f < legendmod.food.length; f++) {
                if (legendmod.food[f] && legendmod.food[f].id === rawID) {
                    mainCell = legendmod.food[f];
                    break;
                }
            }
        }
        if (mainCell && (mainCell.isFood || mainCell.size < 21 || isFood || spectCell.size < 21)) {
            var unFixedX = spectCell.x - this.fix3x;
            var unFixedY = spectCell.y - this.fix3y;
            var dX = mainCell.x - unFixedX;
            var dY = mainCell.y - unFixedY;

            if (!this.foodSampleIDs) this.foodSampleIDs = {};
            if (!this.foodSampleIDs[rawID]) {
                this.foodSampleIDs[rawID] = true;
                this.foodSamples.push({ x: dX, y: dY });

                if (this.foodSamples.length >= 4) {
                    var sumX = 0, sumY = 0;
                    for (var i = 0; i < 4; i++) {
                        sumX += this.foodSamples[i].x;
                        sumY += this.foodSamples[i].y;
                    }
                    var avgX = sumX / 4;
                    var avgY = sumY / 4;
                    var adjX = avgX - this.fix3x;
                    var adjY = avgY - this.fix3y;

                    this.fix3x = avgX;
                    this.fix3y = avgY;
                    this.foodCalibrated = true;
                    if (Math.abs(adjX) > 0.001 || Math.abs(adjY) > 0.001) {
                        this.moveExistedCells(adjX, adjY);
                    }
                    console.log('[SPECT] Intelligent 4-Food Offset Calibrated (fix3x, fix3y):', avgX.toFixed(3), avgY.toFixed(3));
                }
            }
        }
    }

    moveExistedCells(deltaX, deltaY) {
        if (!deltaX && !deltaY) return;
        legendmod.cells.forEach((found) => {
            if (found && found.spectator === this.number) {
                found.x += deltaX;
                found.y += deltaY;
                found.targetX += deltaX;
                found.targetY += deltaY;
            }
        });
    }

    isInView(x, y) {
        let mtp = 4.95,
            w = 1024 / 2 * mtp,
            h = 600 / 2 * mtp;
        return x < this.viewX - w || y < this.viewY - h || x > this.viewX + w || y > this.viewY + h;

    }

    isInViewCustom(x, y, size) {
        // Use MAIN PLAYER's actual position, not display camera (which follows active multibox)
        var mainX = ogario.playerX || 0;
        var mainY = ogario.playerY || 0;
        var _invScale = 1.0 / (legendmod.scale || 1);
        var halfW = (legendmod.canvasWidth || 1920) * 0.5 * _invScale;
        var halfH = (legendmod.canvasHeight || 1080) * 0.5 * _invScale;
        var distance = size;
        return !(x + distance < mainX - halfW ||
            y + distance < mainY - halfH ||
            x - distance > mainX + halfW ||
            y - distance > mainY + halfH)
    }

    isInViewCustom2(x, y, size) {
        const x2s = legendmod.canvasWidth / 2 / legendmod.scale;
        const y2s = legendmod.canvasHeight / 2 / legendmod.scale;
        const randomNum = 0; // randomNum=40
        const distance = size + randomNum;
        return !(x + distance < legendmod.viewXTrue - x2s || //<legendmod.camMinX
            y + distance < legendmod.viewYTrue - y2s || //<legendmod.camMinY
            x - distance > legendmod.viewXTrue + x2s || //>legendmod.camMaxX
            y - distance > legendmod.viewYTrue + y2s) //>legendmod.camMaxY
    }

    isInViewCustom3(x, y, size) {
        const randomNum = 0; // randomNum=-20
        const distance = size + randomNum;
        //var distance = size + randomNum + this.playerSize
        return !(x + distance < legendmod.camMinMultiX ||
            y + distance < legendmod.camMinMultiY ||
            x - distance > legendmod.camMaxMultiX ||
            y - distance > legendmod.camMaxMultiY)
    }

    isInViewCustom4(x, y, size) {
        const randomNum = 20; // randomNum=40
        const distance = size + randomNum;
        return !(x + distance < legendmod.camMinMultiX ||
            y + distance < legendmod.camMinMultiY ||
            x - distance > legendmod.camMaxMultiX ||
            y - distance > legendmod.camMaxMultiY)
    }

    setMapOffset(left, top, right, bottom) {
        var pWidth = Math.abs(right - left);
        var pHeight = Math.abs(bottom - top);
        var temp2 = pWidth > 14000 && pHeight > 14000;

        if (typeof legendmod !== 'undefined' && legendmod.mapOffsetFixed && legendmod.mapOffsetX != null) {
            this.mapSize = legendmod.mapSize || 14142;
            this.mapOffset = legendmod.mapOffset || (this.mapSize / 2);
            this.mapOffsetX = legendmod.mapOffsetX;
            this.mapOffsetY = legendmod.mapOffsetY;
            this.mapMinX = legendmod.mapMinX;
            this.mapMinY = legendmod.mapMinY;
            this.mapMaxX = legendmod.mapMaxX;
            this.mapMaxY = legendmod.mapMaxY;
        } else {
            this.mapSize = (this.integrity || temp2) ? 14142 : (pWidth || 14142);
            this.mapOffset = this.mapSize / 2;
            this.mapOffsetX = this.mapOffset - right;
            this.mapOffsetY = this.mapOffset - bottom;
            this.mapMinX = -this.mapOffset - this.mapOffsetX;
            this.mapMinY = -this.mapOffset - this.mapOffsetY;
            this.mapMaxX = this.mapOffset - this.mapOffsetX;
            this.mapMaxY = this.mapOffset - this.mapOffsetY;
        }

        if (!this.mapOffsetFixed) {
            this.viewX = (right + left) / 2;
            this.viewY = (bottom + top) / 2;
        }
        this.mapOffsetFixed = true;
        console.log('[SPECT] Map offset fixed (x, y):', this.mapOffsetX, this.mapOffsetY);

        if (!this.integrity) {
            if (this.player) {
                this.handleSendNick();
            } else if (!this.player) {
                this.sendSpectate();
            }
            if (this.staticX != null && this.staticY != null) {
                this.startStaticPositionController();
                if (!this.player) {
                    this.sendFreeSpectate();
                }
            }
        }
    }

    terminate() {
        this.active = false;
        this.playerCellIDs = [];
        if (this.positionController) clearInterval(this.positionController);
        if (this.massPositionTimer) clearTimeout(this.massPositionTimer);
        this.positionController = null;
        this.massPositionTimer = null;

        // Auto-switch active camera to surviving multibox unit if available
        if (window.multiboxPlayerEnabled === this.number) {
            if (legendmod.play) {
                window.multiboxPlayerEnabled = null;
            } else {
                for (var s = 0; s < spects.length; s++) {
                    if (spects[s] && spects[s] !== this && spects[s].active) {
                        window.multiboxPlayerEnabled = spects[s].number;
                        break;
                    }
                }
            }
        }

        // Check if any unit is still alive (main player or other spects)
        var anyAlive = legendmod.play;
        if (!anyAlive) {
            for (var i = 0; i < spects.length; i++) {
                if (spects[i] && spects[i].active) { anyAlive = true; break; }
            }
        }

        if (!anyAlive) {
            // Last unit died — show menu
            application.showMenu();
        }
    }

    respawn() {
        if (!this.player) return;
        if (this.isSocketOpen()) {
            this.handleSendNick();
        } else {
            this.connect();
        }
    }

    handleSubmessage(message) {
        try {
            message =
                this.decompressMessage(message);
        } catch (error) {
            console.warn(
                "[SPECT] Rejected invalid compressed packet:",
                error
            );
            return;
        }

        if (!message || message.length < 1) {
            console.warn(
                "[SPECT] Rejected empty decompressed packet"
            );
            return;
        }

        let offset = 0;
        switch (message.readUInt8(offset++)) {
            case 16:
                this.updateCells(message, offset);
                //jimboy3100
                //if (this.player && this.active && legendmod.playerCellsMulti.length==0 && this.timer && Date.now()-this.timer>3000){
                if (this.player && this.active && this.getOwnPlayerCells().length === 0) {
                    console.log('[SPECT] Multibox Player ' + this.number + ' lost');
                    this.terminate()
                }
                break;
            case 64:
                if (!this.openFirst) { //jimboy3100
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
        let cell;
        let length;
        let id;
        const encode = () => {
            let text;
            for (text = ''; ;) {
                const string = view.readUInt8(offset++);
                if (string === 0) {
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
        for (length = 0; length < eatEventsLength; length++) {
            const eaterKey = this.newID(view.readUInt32LE(offset));
            const victimKey = this.newID(view.readUInt32LE(offset + 4));
            const eaterCell = legendmod.indexedCells[eaterKey];
            const victimCell = legendmod.indexedCells[victimKey];
            if (legendmod.playerCellsMulti.includes(victimCell)) {
                this.removePlayerCell = true;
                legendmod.playerCellsMulti.splice(legendmod.playerCellsMulti.indexOf(victimCell), 1)
                const playerCellIndex = this.playerCellIDs.indexOf(victimKey);
                if (playerCellIndex !== -1) this.playerCellIDs.splice(playerCellIndex, 1)
            }

            //remove user cell id if victim was his cell
            //delete legendmod.indexedCells[victimID] //don't even wait for Legend mod, delete eaten cells here
            //console.log('victim isFood',victimID.isFood)
            offset += 8;
            if (eaterCell && victimCell) {
                victimCell.targetX = eaterCell.x;
                victimCell.targetY = eaterCell.y;
                victimCell.targetSize = victimCell.size;
                victimCell.time = this.time;
                victimCell.removeCell();
            }
        }
        for (length = 0; ;) {
            id = view.readUInt32LE(offset);
            offset += 4;
            if (id === 0) {
                break;
            }
            let x = view.readInt32LE(offset);
            offset += 4;
            let y = view.readInt32LE(offset);
            offset += 4;
            const size = view.readUInt16LE(offset);
            offset += 2;
            //snez
            let invisible;


            if (!this.player && (this.ghostFixed || !this.integrity)) {
                invisible = this.staticX != null ? this.isInView(x, y) : false;
            }

            //test
            //this.constantrecalculation()
            if (this.getX) {
                x = this.getX(x)
                //x = this.getX(x)+this.fix3x
            }
            if (this.getY) {
                y = this.getY(y)
                //y = this.getY(y)+this.fix3y
            }

            /*else {
                console.log("Error","Spect",this.number,"ghostFixed",this.ghostFixed,"mapOffsetFixed",this.mapOffsetFixed,"x",x,"mapOffsetX",this.mapOffsetX,"LM mapOffsetX",legendmod.mapOffsetX,"fixX",this.fixX)
            }*/
            let remove = false;
            if (!this.player && (this.ghostFixed || !this.integrity)) {
                const a = x - legendmod.playerX;
                const b = y - legendmod.playerY;
                const distanceX = Math.round(Math.sqrt(a * a));
                const distanceY = Math.round(Math.sqrt(b * b));
                if (distanceX > this.maxX || distanceY > this.maxY) {
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
                const rawName = encode();
                try {
                    name = window.decodeURIComponent(escape(rawName));
                } catch (e) {
                    name = rawName;
                }
                if (legendmod && legendmod.gameMode && legendmod.gameMode !== ":teams") {
                    legendmod.vanillaskins(name, skin);
                }
            }
            if (flags & 10) {
            }
            const isVirus = flags & 1;
            let isFood = extendedFlags & 1;
            const isFriend = extendedFlags & 2;

            if (!this.integrity) { //fix of food for private servers
                if (size < 21) isFood = 1
            }
            /*if (this.player && !this.active && !legendmod.playerCellsMulti.includes(id)){
                invisible = true
            }
            else if  (this.player && this.active){
                invisible = false
            }*/

            id = this.newID(id);

            //FOR COLOR
            if (!isVirus && !isFood && name !== "") {
                if (legendmod.cellcolors[name]) {
                    color = legendmod.cellcolors[name]
                } else {
                    if (this.playerCellIDs.indexOf(id) !== -1) {
                        if (defaultmapsettings.myCustomColor) {
                            color = profiles[application.selectedProfile].color
                        }
                    } else {
                        application.teamPlayers.forEach((found) => {
                            if (found.nick === name) {
                                color = found.color
                            }
                        })
                    }
                }
                if (!legendmod.cellcolors[name]) legendmod.cellcolors[name] = color
            }
            //

            // Sockets only receive cells within their active viewport — never mark cells invisible
            invisible = false;
            remove = false;

            if (isFood && !defaultmapsettings.rainbowFood) {
                color = defaultSettings.foodColor
            }
            if (defaultmapsettings.oneColoredSpectator && !isFood) {
                color = defaultSettings.foodColor
            }
            cell = null;
            if (legendmod.indexedCells.hasOwnProperty(id)) {
                cell = legendmod.indexedCells[id];
                cell.spectator = this.number;
                if (cell._renderSuppressed) {
                    var suppressedRawID = id % 1000000000;
                    var preferredCopy = legendmod.indexedCells[suppressedRawID];
                    if (preferredCopy === cell || (preferredCopy && preferredCopy.removed)) preferredCopy = null;
                    if (!preferredCopy) {
                        for (var preferredNumber = 1; preferredNumber < this.number; preferredNumber++) {
                            var lowerCopy = legendmod.indexedCells[suppressedRawID + preferredNumber * 1000000000];
                            if (lowerCopy && lowerCopy !== cell && !lowerCopy.removed) {
                                preferredCopy = lowerCopy;
                                break;
                            }
                        }
                    }
                    if (!preferredCopy) {
                        cell._renderSuppressed = false;
                        if (legendmod.cells.indexOf(cell) === -1) legendmod.cells.push(cell);
                    }
                }

            } else {
                cell = new window.legendmod1(id, x, y, size, color, isFood, isVirus, false, defaultmapsettings.shortMass, defaultmapsettings.virMassShots);
                cell.time = this.time;
                cell.spectator = this.number;
                //if (!isFood) {
                if (!isFood && !remove) {
                    if (isVirus && defaultmapsettings.virusesRange) {
                        legendmod.viruses.push(cell);
                    }
                    //legendmod.cells.push(cell);
                    if (this.playerCellIDs.indexOf(id) !== -1 && legendmod.playerCellsMulti.indexOf(cell) === -1) {
                        cell.isPlayerCell = true;
                        var _mbPIdx = (application.mbSlots && this.number < application.mbSlots.length)
                            ? application.mbSlots[this.number] : application.selectedOldProfile;
                        var _mbProf = profiles[_mbPIdx];
                        if (_mbProf) {
                            this.playerColor = _mbProf.color || '#000000';
                            cell.color = _mbProf.color || '#000000';
                            if (_mbProf.nick) {
                                this.nick = _mbProf.nick;
                                cell.targetNick = _mbProf.nick;
                            }
                            if (_mbProf.skinURL) {
                                cell.skin = _mbProf.skinURL;
                                if (typeof application !== 'undefined' && application.cacheCustomSkin) {
                                    application.cacheCustomSkin(_mbProf.nick, _mbProf.color || '#000000', _mbProf.skinURL);
                                }
                                if (typeof core !== 'undefined' && core && typeof core.registerSkin === 'function') {
                                    core.registerSkin(_mbProf.nick, null, _mbProf.skinURL, null);
                                }
                            }
                        }

                        legendmod.playerCellsMulti.push(cell);
                        if (!this.active) {
                            console.log('[SPECT] Player cell is active (unit ' + this.number + ')')
                            this.active = true
                            this.sendCursor()
                            loadMultiCellSkin(this)

                        }
                    }
                } else if (isFood) {
                    legendmod.foodMulti.push(cell); //this causes problems					
                }
                if (defaultmapsettings.oneColoredSpectator && !this.player) {
                    if (!isFood && !remove) legendmod.cells.push(cell);
                } else {
                    //if (!remove && (!invisible && isVirus)){
                    if (!remove) {
                        legendmod.cells.push(cell);
                    }
                }
                legendmod.indexedCells[id] = cell;
            }

            if (name) {
                cell.targetNick = name;
            }
            if (cell.isPlayerCell) {
                cell.targetNick = this.nick
                cell.isPlayerCellMulti = true
            }
            cell.targetX = x;
            cell.targetY = y;
            cell.targetSize = size;
            cell.size = size;
            cell.isFood = isFood;
            cell.isVirus = isVirus;
            cell.invisible = invisible;

            // Intelligent 4-Food Map Offset Calibration
            if ((isFood || size < 21) && !this.foodCalibrated) {
                this.calibrateWithFood(cell, isFood);
            }

            // In multibox mode or for player cells, cells must NEVER be hidden
            if (this.player || cell.isPlayerCell || cell.isPlayerCellMulti) {
                cell.invisible = false;
            }
            if (skin) {
                cell.skin = skin;
            }
            if (extendedFlags & 4) {
                accountID = view.readUInt32LE(offset);
                offset += 4;
                cell.accID = accountID;
                let friend = legendmod.fbOnline.find(element => {
                    return element.id === accountID
                });
                friend !== undefined ? cell.fbID = friend.fbId : void (0);
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
            id = view.readUInt32LE(offset);
            offset += 4;
            cell = legendmod.indexedCells[this.newID(id)];
            if (cell) {
                cell.removeCell();
            }
        }

    }

    beforecalculation() {
        if (!this.player) return;
        const ownCells = this.getOwnPlayerCells();
        if (ownCells.length) {
            if (!this.openSecond) {
                this.openSecond = true;
                window.multiboxPlayerEnabled = this.number
            }
            this.calculatePlayerMassAndPosition(ownCells);
        } else if (window.multiboxPlayerEnabled === this.number) {
            window.multiboxPlayerEnabled = null;
            for (let i = 0; i < spects.length; i++) {
                if (spects[i] && spects[i] !== this && spects[i].active) {
                    window.multiboxPlayerEnabled = spects[i].number;
                    break;
                }
            }
        }
    }

    getOwnPlayerCells() {
        return legendmod.playerCellsMulti.filter((cell) => {
            return cell && !cell.removed && cell.spectator === this.number;
        });
    }

    newID(id) {
        //return id
        return id + this.number * 1000000000
    }

    calculatePlayerMassAndPosition(ownCells) {

        let size = 0;
        let targetSize = 0;
        let x = 0;
        let y = 0;
        ownCells = ownCells || this.getOwnPlayerCells();
        const playersLength = ownCells.length;
        if (!playersLength) return;
        for (let length = 0; length < playersLength; length++) {
            const n = ownCells[length];
            size += n.size;
            targetSize += n.targetSize * n.targetSize;
            x += n.x / playersLength;
            y += n.y / playersLength;
        }
        window.middleMultiViewFlag = defaultmapsettings.middleMultiViewWhenClose && legendmod.play && profiles[application.selectedOldProfile] && checkIfPlayerIsInView(profiles[application.selectedProfile].nick)
        if (defaultmapsettings.middleMultiView && legendmod.play) {
            legendmod.viewX = (legendmod.viewXTrue + x) / 2;
            legendmod.viewY = (legendmod.viewYTrue + y) / 2;
        } else if (window.middleMultiViewFlag) {
            legendmod.viewX = (legendmod.viewXTrue + x) / 2;
            legendmod.viewY = (legendmod.viewYTrue + y) / 2;
        } else if (window.multiboxPlayerEnabled === this.number) {
            legendmod.viewX = x;
            legendmod.viewY = y;
        }
        this.playerX = x;
        this.playerY = y;

        if (!this.openThird) {
            this.openThird = true
            window.targetingLeadX = this.playerX
            window.targetingLeadY = this.playerY
            //legendmod.drawCommander2 = true; // disabled — spawn effects unwanted
        }
        this.playerSize = size;
        this.playerMass = ~~(targetSize / 100);
        this.recalculatePlayerMass();

        if (this.timerDifference > 10 && !this.massPositionTimer) {
            this.massPositionTimer = setTimeout(() => {
                this.massPositionTimer = null;
                this.timerDifference = this.timerDifference - 10
                if (this.active) this.calculatePlayerMassAndPosition()
            }, 10);
        }
    }

    recalculatePlayerMass() {
        if (this.playerScore = Math.max(this.playerScore, this.playerMass),
        defaultmapsettings.virColors || defaultmapsettings.splitRange || defaultmapsettings.oppColors || defaultmapsettings.oppRings || defaultmapsettings.showStatsSTE) {
            const cells = this.getOwnPlayerCells().slice();
            const CellLength = cells.length;
            if (CellLength > 0) {
                cells.sort(function (cells, CellLength) {
                    return cells.size === CellLength.size ? cells.id - CellLength.id : cells.size - CellLength.size;
                });
                this.playerMinMass = ~~(cells[0].size * cells[0].size / 100);
                this.playerMaxMass = ~~(cells[CellLength - 1].size * cells[CellLength - 1].size / 100);
            } else {
                this.playerMinMass = 0;
                this.playerMaxMass = 0;
            }
            this.playerSplitCells = CellLength;
        }
        const mass = (legendmod.selectBiggestCell ? this.playerMaxMass : this.playerMinMass) || 0;
        this.STE = Math.floor(mass * defaultmapsettings.dominationRate / 4);
        this.MTE = Math.floor(mass * defaultmapsettings.dominationRate / 2);
        this.BMTE = Math.ceil(mass * defaultmapsettings.dominationRate);
        this.BSTE = Math.ceil(mass * defaultmapsettings.dominationRate * 2);
        this.TTE = Math.ceil(mass / 6);
        this.PTE = Math.floor(mass * 0.66);
    }
}

window.sendAction = action => {
    legendmod.sendAction(action);
};

function MultiTokenReady(spector) {
    if (spector && master.accessTokenFB) {
        spector.sendFbToken(master.accessTokenFB)
    } else if (spector && master.accessTokenGPlus) {
        spector.sendGplusToken(master.accessTokenGPlus)
    }
}

function checkIfMultiPlayerIsInView(b) {
    for (let i = 0; i < legendmod.cells.length; i++) {
        if (b !== "" && legendmod.cells[i].nick === b && !legendmod.cells[i].isPlayerCell) {
            return true
        }
    }
    return false
}
