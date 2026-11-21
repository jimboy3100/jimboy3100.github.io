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

/* "View on middle of both (when close)": true when the main player and the multibox unit
 * (client-space centre ux/uy) are both alive and the unit's centre lies inside the main
 * player's visible area. The old test looked for a non-own cell with the main nick, but
 * the unit's copies of the main cells are kept out of LM.cells, so it was almost never true. */
function lmMultiUnitIsClose(ux, uy) {
    if (!defaultmapsettings.middleMultiViewWhenClose || !legendmod.play) return false;
    if (!legendmod.playerCells || !legendmod.playerCells.length) return false;
    var mx = legendmod.viewXTrue, my = legendmod.viewYTrue;
    if (!Number.isFinite(ux) || !Number.isFinite(uy) || !Number.isFinite(mx) || !Number.isFinite(my)) return false;
    var sc = legendmod.viewScale > 0 ? legendmod.viewScale : 1;
    var halfW = (legendmod.canvasWidth || window.innerWidth || 1920) / sc / 2;
    var halfH = (legendmod.canvasHeight || window.innerHeight || 1080) / sc / 2;
    return Math.abs(mx - ux) < halfW && Math.abs(my - uy) < halfH;
}
window.lmMultiUnitIsClose = lmMultiUnitIsClose;

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
        this.pingInterval = null;
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
        if (this.pingInterval) clearInterval(this.pingInterval);
        this.positionController = null;
        this.staticPositionController = null;
        this.socketErrorTimer = null;
        this.reconnectTimer = null;
        this.massPositionTimer = null;
        this.pingInterval = null;
    }

    /*
     * Type-30 ping keepalive every 3 s, like the main socket (ReqPing) and Delta
     * (one ping loop per unit). Sent as opcode 102 through this unit's own cipher.
     */
    sendPing() {
        if (!this.integrity || !this.clientKey || !this.isSocketOpen()) return;
        const pingPayload = [8];
        application.writeUint32(pingPayload, Math.floor(Math.random() * 1000)); // pingId
        pingPayload.push(16, 1); // previousRoundtrip = 1
        let uncompressed = [8, 30, 242, 1];
        application.writeUint32(uncompressed, pingPayload.length);
        uncompressed = uncompressed.concat(pingPayload);
        let packet = [102, 8, 1, 18];
        application.writeUint32(packet, uncompressed.length);
        packet = packet.concat(uncompressed);
        this.sendMessage(new DataView(new Uint8Array(packet).buffer));
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
        /* orientation belongs to one connection: a reconnect finds it again */
        this.fixX = 1
        this.fixY = 1
        this._lmOffsetFixedAt = 0
        this._lmFoodRejects = 0
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
        /* Do not reset the backoff here: a server that accepts and then kicks (login
         * elsewhere, expired token) would loop every second. onclose resets it only
         * after the socket stayed open for a while. */
        this._openedAt = Date.now();


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
            /*
             * Exponential backoff with a cap. Reconnecting every second forever
             * resent a dead/expired token and, after "login elsewhere", kicked
             * the other session every second.
             */
            if (this._openedAt && Date.now() - this._openedAt > 60000) this._reconnectAttempts = 0;
            this._openedAt = 0;
            this._reconnectAttempts = (this._reconnectAttempts || 0) + 1;
            if (this._reconnectAttempts > 8) {
                console.warn('[SPECT] Unit ' + this.number + ' gave up reconnecting after 8 attempts');
                return;
            }
            var reconnectDelay = Math.min(30000, 1000 * Math.pow(2, this._reconnectAttempts - 1));
            this.reconnectTimer = setTimeout(() => {
                this.reconnectTimer = null;
                if (!this.closedByUser && this.connectionGeneration === generation) this.connect();
            }, reconnectDelay);
        }
    }

    closeConnection() {
        this.closedByUser = true
        /* A closed unit must not keep the multibox login slot. */
        if (window.MultiPending === this) window.MultiPending = null
        if (this._multiPendingTimer) { clearTimeout(this._multiPendingTimer); this._multiPendingTimer = null }
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

    /*
     * If the multibox login popup is cancelled or blocked, window.MultiPending
     * stayed set and hijacked the next MAIN login. Release it after 60 s and let
     * this unit play as guest.
     */
    _armMultiPendingTimeout() {
        var spect = this;
        if (this._multiPendingTimer) clearTimeout(this._multiPendingTimer);
        this._multiPendingTimer = setTimeout(function () {
            spect._multiPendingTimer = null;
            if (window.MultiPending === spect) {
                window.MultiPending = null;
                console.warn('[SPECT] Multibox login not completed; continuing as guest');
                if (!spect.closedByUser && typeof spect.handleSendNick === 'function') spect.handleSendNick();
            }
        }, 60000);
    }

    //spects[0].sendGplusToken(master.accessToken)
    getTheOppositeSocialToken() {
        /* Google id_tokens live 1 h and FB tokens 1-2 h: drop cached multibox tokens
         * older than 45 min so the login flow runs again instead of resending a dead one. */
        var maxTokenAge = 45 * 60 * 1000;
        if (master.accessTokenGPlus && !(Date.now() - (master.accessTokenGPlusAt || 0) < maxTokenAge)) master.accessTokenGPlus = null;
        if (master.accessTokenFB && !(Date.now() - (master.accessTokenFBAt || 0) < maxTokenAge)) master.accessTokenFB = null;
        if (master.context === "facebook") {
            if (master.accessTokenGPlus) {
                MultiTokenReady(this)
            } else {
                window.MultiPending = this
                this._armMultiPendingTimeout()
                document.getElementById("gplusLogin").click()
                //this.handleSendNick()
                console.log('[SPECT] Login Tokens - Main: Google, Multi: Facebook')
            }
        } else if (master.context === "google") {
            if (master.accessTokenFB) {
                MultiTokenReady(this)
            } else if (!(window.FB && typeof window.FB.login === "function")) {
                /* Facebook SDK not available (blocked): master.facebookLogin() would show a
                 * blocking alert inside the socket handler. Play this unit as guest. */
                if (!this._fbUnavailableToastShown && typeof toastr !== "undefined") {
                    this._fbUnavailableToastShown = true;
                    toastr.warning("<b>[MULTIBOX]:</b> Facebook login is unavailable, the multibox unit plays as guest.");
                }
                this.handleSendNick()
            } else {
                window.MultiPending = this
                this._armMultiPendingTimeout()
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
        /* Servers no longer send 103, so mark the token as sent here (as the main
         * client does); re-sending it on an authenticated socket gets it kicked.
         * resetConnectionState() clears it for the next connection. */
        this.accessTokenSent = true;
    }

    sendCursor() {
        if (this.positionController) clearInterval(this.positionController);
        this.positionController = setInterval(() => {

            if (legendmod.pause) {
                this.sendPosition(this.convertX(this.playerX), this.convertY(this.playerY));
            } else if (window.multiboxPlayerEnabled === this.number || this.isFreeSpectate || window.multiboxFollowMouse) {
                /* Only the controlled unit follows the cursor (any truthy value moved every unit). */
                this.sendPosition(this.convertX(legendmod.cursorX), this.convertY(legendmod.cursorY));

                /* Keep-moving offset in server space (playerX/Y are client space). */
                this.distX = this.convertX(legendmod.cursorX) - this.convertX(this.playerX)
                this.distY = this.convertY(legendmod.cursorY) - this.convertY(this.playerY)
            } else {
                /* "Freeze inactive multibox unit": hold it at its own centre. */
                if (defaultmapsettings.mbFreeze && Number.isFinite(this.playerX) && Number.isFinite(this.playerY)) {
                    this.sendPosition(this.convertX(this.playerX), this.convertY(this.playerY));
                } else if (defaultmapsettings.multiKeepMoving) {
                    this.sendPosition(this.convertX(this.playerX) + this.distX, this.convertY(this.playerY) + this.distY);
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
        /* In-game spectator (no static tile position): free spectate follows the
         * cursor. staticX is null for it, never 0, so this branch was dead. */
        if (this.staticX == null) {
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

    /*
     * window.core routes double/triple/quad split and freeze to the active
     * multibox unit; these were missing and threw a TypeError. Same opcodes as
     * the main client (LM.sendDoubleSplit etc.).
     */
    _usesMultiSplitOpcodes() {
        var type = window.legendmod && window.legendmod.serverType;
        return type === 'imsolo' || type === 'agar2' || type === 'garix' || type === 'private';
    }

    sendDoubleSplit() {
        if (this._usesMultiSplitOpcodes()) {
            this.sendPosition(this.convertX(legendmod.cursorX), this.convertY(legendmod.cursorY));
            this.sendAction(28);
        } else {
            this.sendSplit(); this.sendSplit();
        }
    }

    sendTripleSplit() {
        if (this._usesMultiSplitOpcodes()) {
            this.sendPosition(this.convertX(legendmod.cursorX), this.convertY(legendmod.cursorY));
            this.sendAction(26);
        } else {
            this.sendSplit(); this.sendSplit(); this.sendSplit();
        }
    }

    sendQuadSplit() {
        if (this._usesMultiSplitOpcodes()) {
            this.sendPosition(this.convertX(legendmod.cursorX), this.convertY(legendmod.cursorY));
            this.sendAction(27);
        } else {
            this.sendSplit(); this.sendSplit(); this.sendSplit(); this.sendSplit();
        }
    }

    sendPlayerFreeze() {
        if (this._usesMultiSplitOpcodes()) this.sendAction(32);
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
            /* Like the main client (LM.sendNick) and Delta: spawn with token "0" on every
             * server. agar.io asks for a v3 token with opcode 87 when it wants one (case 87
             * answers it with 88), so the unit no longer waits up to 20 s for reCAPTCHA. */
            sendSpawn("0");
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

        var src = new Uint8Array(
            message.buffer,
            (message.byteOffset || 0) + 5,
            compressedSize
        );

        /* ── Try WASM path (shared with main client) ── */
        var wasm = window._lz4wasm;
        if (wasm &&
            compressedSize <= 262144 &&
            outputSize <= 1048576) {
            wasm.mem.set(src, wasm.srcPtr);
            var decoded = wasm.decode(
                compressedSize, outputSize
            );
            if (decoded >= 0) {
                var out = new Uint8Array(outputSize);
                out.set(
                    wasm.mem.subarray(
                        wasm.dstPtr,
                        wasm.dstPtr + decoded
                    )
                );
                return new buffer(out.buffer);
            }
            throw new RangeError(
                "Spectator LZ4 WASM decompression failed"
            );
        }

        /* ── JS fallback (typed arrays) ── */
        var dst = new Uint8Array(outputSize);
        var sPos = 0, dPos = 0;
        var sEnd = compressedSize;

        while (sPos < sEnd) {
            var token = src[sPos++];

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

            var offset =
                src[sPos] | (src[sPos + 1] << 8);
            sPos += 2;
            if (offset === 0) {
                throw new RangeError(
                    "LZ4: zero match offset (spectator)"
                );
            }

            var matchLen = (token & 0xF) + 4;
            if ((token & 0xF) === 15) {
                var addByte2;
                do {
                    addByte2 = src[sPos++];
                    matchLen += addByte2;
                } while (addByte2 === 255);
            }

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

        if (dPos < 0 || dPos > outputSize) {
            throw new RangeError(
                "Spectator LZ4 decompression failed"
            );
        }

        return new buffer(dst.buffer);
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
                /* Until this connection's offset and orientation are known its position
                 * can't be placed on the main map: don't move the camera with it. */
                if (!this.transformReady()) {
                    if (this.player) window.middleMultiViewFlag = false;
                    this.viewY = view.getFloat32(offset + 4, true);
                    this.scale = view.getFloat32(offset + 8, true);
                    break;
                }
                /* viewX is this connection's server space: convert before mixing it into the
                 * main camera; only the multibox player unit moves the camera. */
                var _cvX = this.getX(this.viewX);
                /* only a living player unit decides (spectator sockets used to overwrite the flag) */
                if (this.player) window.middleMultiViewFlag = !!(this.active && this.playerCellIDs.length && lmMultiUnitIsClose(_cvX, this.getY(view.getFloat32(offset + 4, true))));
                if (this.player && defaultmapsettings.middleMultiView && legendmod.play) {
                    legendmod.viewX = (legendmod.viewXTrue + _cvX) / 2;
                } else if (this.player && window.middleMultiViewFlag) {
                    legendmod.viewX = (legendmod.viewXTrue + _cvX) / 2;
                } else if (this.player && window.multiboxPlayerEnabled === this.number && getActiveSpect(window.multiboxPlayerEnabled)) {
                    legendmod.viewX = _cvX
                }
                //var x=this.viewX = view.getFloat32(offset, true);
                //this.viewX = window.legendmod.vector[window.legendmod.vnr][0] ? this.translateX(x) : x;
                offset += 4;
                this.viewY = view.getFloat32(offset, true);
                /* viewY is this connection's server space: convert before mixing it into the
                 * main camera; only the multibox player unit moves the camera. */
                var _cvY = this.getY(this.viewY);
                if (this.player && defaultmapsettings.middleMultiView && legendmod.play) {
                    legendmod.viewY = (legendmod.viewYTrue + _cvY) / 2;
                } else if (this.player && window.middleMultiViewFlag) {
                    legendmod.viewY = (legendmod.viewYTrue + _cvY) / 2;
                } else if (this.player && window.multiboxPlayerEnabled === this.number && getActiveSpect(window.multiboxPlayerEnabled)) {
                    legendmod.viewY = _cvY
                }
                //var y=this.viewX = view.getFloat32(offset, true);
                //this.viewY = window.legendmod.vector[window.legendmod.vnr][1] ? this.translateY(y) : y;
                offset += 4;
                this.scale = view.getFloat32(offset, true);
                break;
            case 18:
                /* No key rotation on 18 (same as the main client since PROTO-3 and Delta). */
                this.flushCellsData();
                console.log('[SPECT] case 18');

                break;
            case 32:
                temp = view.getUint32(offset, true);
                this.playerCellIDs.push(this.newID(temp));
                this._lmHasSpawned = true;

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
                /* The v2 captcha is not answered on this socket, so really close the
                 * unit: left connected it stayed in multibox switching and every
                 * respawn() on it got another 85. */
                this.closeConnection()
                var closedIndex = spects.indexOf(this)
                if (closedIndex !== -1) spects.splice(closedIndex, 1)
                if (window.multiboxPlayerEnabled === this.number) window.multiboxPlayerEnabled = null
                if (this.player && !spects.some(function (s) { return s && s.player; })) legendmod.multiBoxPlayerExists = false

                break;
            case 87:
                window.agarCaptcha.requestCaptchaV3("play", (a) => {
                    if (!a) return; /* as the main client */
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
                /* Every 102 used to (re)spawn the unit: honour "Background auto-respawn" after
                 * the first life, and never start a new spawn within 2 s of the last one. */
                /* Since these sockets ping every 3 s, the server's pong (type 31) is a 102 too:
                 * it must not trigger a spawn (spectators spawned, dead units captcha'd every 3 s). */
                var _lm102Type = -1;
                try {
                    var _lm102 = window.decodeMobileData(new Uint8Array(view.buffer, view.byteOffset + 1, view.byteLength - 1));
                    if (_lm102 && _lm102.uncompressedData) _lm102Type = _lm102.uncompressedData.type;
                } catch (e102) { }
                /* Spectator sockets never spawn. */
                if (this.player && _lm102Type !== 31 &&
                    (!this._lmHasSpawned || defaultmapsettings.mbAutoRespawn !== false) &&
                    Date.now() - (this._lmLastSpawnReq || 0) > 2000) {
                    this._lmLastSpawnReq = Date.now();
                    this.handleSendNick()
                }
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
                /* little-endian, like the read above (main client and Delta do the same) */
                view.setUint16(1, ping, true);
                this.sendMessage(view);

                break;
            case 241:
                this.protocolKey = view.getUint32(offset, true);
                //console.log('[SPECT] Received protocol key:', this.protocolKey);
                const agarioReader = new Uint8Array(view.buffer, offset += 4);
                this.clientKey = this.generateClientKey(this.ws, agarioReader);
                if (this.integrity && !this.pingInterval) this.pingInterval = setInterval(() => this.sendPing(), 3000);
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
                /* setMapOffset keeps the first usable (on agar.io: full-map) border;
                 * taking only the very first packet could fix a partial one. */
                if (!this.mapOffsetFixed) {
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

    /* Kept for older callers: orientation now comes from detectOrientation(). */
    GhostFix() {
        this.detectOrientation();
    }

    /* Offset and orientation known: positions (and the camera) can be trusted. */
    transformReady() {
        if (!this.mapOffsetFixed) return false;
        if (this.ghostFixed || !this.integrity) return true;
        /* No usable top-player list for 10 s: go on as not mirrored rather than
         * keep the camera off this unit for good. */
        if (Date.now() - (this._lmOffsetFixedAt || 0) > 10000) {
            console.warn('[SPECT] Unit ' + this.number + ': orientation not found from the top players in 10 s; assuming the same as the main connection');
            this.ghostFixed = true;
            return true;
        }
        return false;
    }

    /*
     * Is this connection's map mirrored compared with the main one?
     *
     * agar.io can give each connection a mirrored map (per axis). The top
     * players (opcode 69 "ghost cells") are the same players on both
     * connections, so their distance from the map centre must match on each
     * axis, either as is (same orientation) or with the sign flipped
     * (mirrored). Both lists are compared in RAW server coordinates; the main
     * client's ghost cells are stored rotated (Rotate Map), so its rawX/rawY
     * are used. The old test compared one player's sign against the rotated
     * main position (or the main player's own position), which picked the
     * wrong side whenever Rotate Map had flipped that axis.
     *
     * Private servers don't mirror: nothing to detect there.
     */
    detectOrientation() {
        if (this.ghostFixed || !this.mapOffsetFixed) return;
        if (!this.integrity) {
            this.ghostFixed = true;
            return;
        }
        var mainList = legendmod.ghostCells;
        if (!mainList || !mainList.length || !this.ghostCells || !this.ghostCells.length) return;
        /* the two lists must be from about the same moment */
        if (!(Date.now() - (legendmod.ghostCellsTime || 0) < 3000)) return;
        var used = {};
        var pairs = 0;
        var sameX = 0, flipX = 0, sameY = 0, flipY = 0;
        for (var i = 0; i < mainList.length && pairs < 10; i++) {
            var m = mainList[i];
            if (!m || !Number.isFinite(m.rawX) || !Number.isFinite(m.rawY) || !(m.mass > 0)) continue;
            /* same player on this connection: the closest mass, within 10% */
            var best = -1, bestDiff = Infinity;
            for (var j = 0; j < this.ghostCells.length; j++) {
                var g = this.ghostCells[j];
                if (used[j] || !g || !(g.mass > 0)) continue;
                var diff = Math.abs(g.mass - m.mass) / Math.max(g.mass, m.mass);
                if (diff < bestDiff) {
                    bestDiff = diff;
                    best = j;
                }
            }
            if (best < 0 || bestDiff > 0.1) continue;
            used[best] = true;
            var s = this.ghostCells[best];
            /* distance from the map centre on each connection */
            var mx = m.rawX + legendmod.mapOffsetX, my = m.rawY + legendmod.mapOffsetY;
            var sx = s.x + this.mapOffsetX, sy = s.y + this.mapOffsetY;
            sameX += Math.abs(mx - sx);
            flipX += Math.abs(mx + sx);
            sameY += Math.abs(my - sy);
            flipY += Math.abs(my + sy);
            pairs++;
        }
        if (!pairs) return;
        /* Decide an axis only when one answer fits (players move between the two
         * packets) and clearly beats the other (a player near the centre line
         * fits both). Otherwise wait for the next opcode 69. */
        var decide = function (same, flip) {
            same /= pairs;
            flip /= pairs;
            if (same < 600 && flip - same > 400) return 1;
            if (flip < 600 && same - flip > 400) return -1;
            return 0;
        };
        var fx = decide(sameX, flipX);
        var fy = decide(sameY, flipY);
        if (!fx || !fy) return;
        this.setOrientation(fx, fy);
        console.log('[SPECT] Unit ' + this.number + ' orientation vs main (x, y):', fx, fy, '(' + pairs + ' top players compared)');
    }

    /* Set fixX/fixY and move the cells already placed with the old values. */
    setOrientation(fixX, fixY) {
        var changed = fixX !== this.fixX || fixY !== this.fixY;
        var self = this;
        var saved = [];
        if (changed) {
            /* back to this connection's raw coordinates with the old transform */
            this._lmForEachUnitCell(function (cell) {
                saved.push([cell, self._lmRawOf(cell)]);
            });
        }
        this.fixX = fixX;
        this.fixY = fixY;
        this.ghostFixed = true;
        for (var i = 0; i < saved.length; i++) {
            this._lmPlaceFromRaw(saved[i][0], saved[i][1]);
        }
    }

    /* Every cell of this unit, including those still animating their removal. */
    _lmForEachUnitCell(fn) {
        var cells = legendmod.indexedCells;
        if (cells) {
            for (var id in cells) {
                if (!Object.prototype.hasOwnProperty.call(cells, id)) continue;
                if (cells[id] && cells[id].spectator === this.number) fn(cells[id]);
            }
        }
        var removed = legendmod.removedCells;
        if (removed) {
            for (var r = 0; r < removed.length; r++) {
                if (removed[r] && removed[r].spectator === this.number) fn(removed[r]);
            }
        }
    }

    _lmRawOf(cell) {
        var raw = {};
        var keysX = ['x', 'targetX', 'startX', 'oldX'];
        var keysY = ['y', 'targetY', 'startY', 'oldY'];
        for (var k = 0; k < 4; k++) {
            if (Number.isFinite(cell[keysX[k]])) raw[keysX[k]] = this.convertX(cell[keysX[k]]);
            if (Number.isFinite(cell[keysY[k]])) raw[keysY[k]] = this.convertY(cell[keysY[k]]);
        }
        return raw;
    }

    _lmPlaceFromRaw(cell, raw) {
        for (var key in raw) {
            if (!Object.prototype.hasOwnProperty.call(raw, key)) continue;
            cell[key] = key.charAt(key.length - 1) === 'X' || key === 'x' ? this.getX(raw[key]) : this.getY(raw[key]);
        }
    }

    /*
     * This connection's raw coordinates -> the main client's local (drawn)
     * coordinates: this connection's offset, its orientation against the main
     * one, the main offset, the small food-calibrated rest (fix3), then the
     * main client's Rotate Map flip. Until the orientation is known the unit is
     * placed as not mirrored; setOrientation() moves it if that was wrong.
     */
    getX(x) {
        if (this.mapOffsetFixed) {
            var res = ((x + this.mapOffsetX) * this.fixX - legendmod.mapOffsetX + this.fix3x);
            if (window.legendmod && window.legendmod.vector && window.legendmod.vector[window.legendmod.vnr] && window.legendmod.vector[window.legendmod.vnr][0]) {
                res = legendmod.mapMaxX - (res - legendmod.mapMinX);
            }
            return res;
        }
        return x;
    }

    getY(y) {
        if (this.mapOffsetFixed) {
            var res = ((y + this.mapOffsetY) * this.fixY - legendmod.mapOffsetY + this.fix3y);
            if (window.legendmod && window.legendmod.vector && window.legendmod.vector[window.legendmod.vnr] && window.legendmod.vector[window.legendmod.vnr][1]) {
                res = legendmod.mapMaxY - (res - legendmod.mapMinY);
            }
            return res;
        }
        return y;
    }

    convertX(x) { //is used only for SendPosition
        if (!this.mapOffsetFixed) return x; /* getX is the identity until then too */
        var res = x;
        if (window.legendmod && window.legendmod.vector && window.legendmod.vector[window.legendmod.vnr] && window.legendmod.vector[window.legendmod.vnr][0]) {
            res = legendmod.mapMaxX - (res - legendmod.mapMinX);
        }
        return ((res + legendmod.mapOffsetX - this.fix3x) * this.fixX - this.mapOffsetX); /* exact inverse of getX */
    }

    convertY(y) {
        if (!this.mapOffsetFixed) return y;
        var res = y;
        if (window.legendmod && window.legendmod.vector && window.legendmod.vector[window.legendmod.vnr] && window.legendmod.vector[window.legendmod.vnr][1]) {
            res = legendmod.mapMaxY - (res - legendmod.mapMinY);
        }
        return ((res + legendmod.mapOffsetY - this.fix3y) * this.fixY - this.mapOffsetY); /* exact inverse of getY */
    }

    /*
     * Fine-tune the placement with food both connections see (same cell id):
     * the rest left after the border offsets is a few units at most. A sample
     * that is far off is a different cell (or a server that numbers cells per
     * connection), so it's skipped instead of shifting the unit across the map.
     * Worked out in the main client's RAW space, where fix3 is applied; it was
     * taken from the rotated positions, which had the wrong sign when Rotate
     * Map flipped an axis.
     */
    calibrateWithFood(spectCell, isFood) {
        if (this.foodCalibrated || !legendmod || !this.transformReady()) return;
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
        if (!mainCell || mainCell.spectator || !(mainCell.isFood || mainCell.size < 21 || isFood || spectCell.size < 21)) return;
        var vec = legendmod.vector && legendmod.vector[legendmod.vnr];
        var flipX = !!(vec && vec[0]), flipY = !!(vec && vec[1]);
        /* both positions in the main client's raw space; translateX/Y undo Rotate Map */
        var mainX = flipX ? legendmod.translateX(mainCell.x) : mainCell.x;
        var mainY = flipY ? legendmod.translateY(mainCell.y) : mainCell.y;
        var unitX = (flipX ? legendmod.translateX(spectCell.x) : spectCell.x) - this.fix3x;
        var unitY = (flipY ? legendmod.translateY(spectCell.y) : spectCell.y) - this.fix3y;
        var dX = mainX - unitX;
        var dY = mainY - unitY;

        if (!this.foodSampleIDs) this.foodSampleIDs = {};
        if (this.foodSampleIDs[rawID]) return;
        this.foodSampleIDs[rawID] = true;
        if (!(Math.abs(dX) <= 64 && Math.abs(dY) <= 64)) {
            this._lmFoodRejects = (this._lmFoodRejects || 0) + 1;
            if (this._lmFoodRejects === 1 || this._lmFoodRejects % 50 === 0) {
                console.warn('[SPECT] Unit ' + this.number + ': food ' + rawID + ' is ' + Math.round(dX) + ', ' + Math.round(dY) +
                    ' away from the main client\'s copy; not used for calibration (' + this._lmFoodRejects + ' skipped)');
            }
            return;
        }
        this.foodSamples.push({ x: dX, y: dY });
        if (this.foodSamples.length < 4) return;
        var sumX = 0, sumY = 0, minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        for (var i = 0; i < this.foodSamples.length; i++) {
            var p = this.foodSamples[i];
            sumX += p.x;
            sumY += p.y;
            minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
            minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y);
        }
        /* food doesn't move: samples that disagree mean mismatched cells */
        if (maxX - minX > 16 || maxY - minY > 16) {
            this.foodSamples.shift();
            return;
        }
        var adjX = sumX / this.foodSamples.length;
        var adjY = sumY / this.foodSamples.length;
        this.fix3x += adjX;
        this.fix3y += adjY;
        this.foodCalibrated = true;
        /* raw-space shift -> drawn-space shift (Rotate Map flips the sign) */
        this.moveExistedCells(flipX ? -adjX : adjX, flipY ? -adjY : adjY);
        console.log('[SPECT] Unit ' + this.number + ' food calibration (fix3x, fix3y):', this.fix3x.toFixed(2), this.fix3y.toFixed(2));
    }

    moveExistedCells(deltaX, deltaY) {
        if (!deltaX && !deltaY) return;
        this._lmForEachUnitCell(function (found) {
            if (Number.isFinite(found.x)) found.x += deltaX;
            if (Number.isFinite(found.y)) found.y += deltaY;
            if (Number.isFinite(found.targetX)) found.targetX += deltaX;
            if (Number.isFinite(found.targetY)) found.targetY += deltaY;
            if (Number.isFinite(found.startX)) found.startX += deltaX;
            if (Number.isFinite(found.startY)) found.startY += deltaY;
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

    /*
     * This connection's map offset, from its own border packet (opcode 64).
     *
     * Every agar.io connection gets its own coordinate offset (and a MultiOgar
     * server that scrambles coordinates does the same per client), so a unit's
     * raw coordinates are not the main client's. The offset used to be copied
     * from the main client whenever the main one was known, which left the unit
     * thousands of units off, often outside the map, until 4 shared food cells
     * were seen (never, when the units were far apart).
     *
     * agar.io also sends smaller borders during play: as on the main client,
     * only the full map (over 14000 x 14000) is used there, and the first one
     * fixes the offset for this connection.
     */
    setMapOffset(left, top, right, bottom) {
        var pWidth = Math.abs(right - left);
        var pHeight = Math.abs(bottom - top);
        if (!Number.isFinite(pWidth) || !Number.isFinite(pHeight) || !pWidth || !pHeight) return;
        if (this.mapOffsetFixed) return;
        var fullMap = pWidth > 14000 && pHeight > 14000;
        var official = this.integrity && !legendmod.isLegendWorld && legendmod.serverType !== 'deltio';
        if (official && !fullMap) return;

        if (legendmod.isLegendWorld) {
            /* Expanding Land: no per-connection offset and its own map convention;
             * unchanged from before. */
            if (legendmod.mapOffsetFixed && legendmod.mapOffsetX != null) {
                this.mapSize = legendmod.mapSize || 14142;
                this.mapOffset = legendmod.mapOffset || (this.mapSize / 2);
                this.mapOffsetX = legendmod.mapOffsetX;
                this.mapOffsetY = legendmod.mapOffsetY;
                this.mapMinX = legendmod.mapMinX;
                this.mapMinY = legendmod.mapMinY;
                this.mapMaxX = legendmod.mapMaxX;
                this.mapMaxY = legendmod.mapMaxY;
            } else {
                this.mapSize = (this.integrity || fullMap) ? 14142 : pWidth;
                this.mapOffset = this.mapSize / 2;
                this.mapOffsetX = this.mapOffset - right;
                this.mapOffsetY = this.mapOffset - bottom;
                this.mapMinX = -this.mapOffset - this.mapOffsetX;
                this.mapMinY = -this.mapOffset - this.mapOffsetY;
                this.mapMaxX = this.mapOffset - this.mapOffsetX;
                this.mapMaxY = this.mapOffset - this.mapOffsetY;
            }
        } else {
            this.mapSize = (official || fullMap) ? 14142 : pWidth;
            this.mapOffset = this.mapSize / 2;
            if (official) {
                /* Same formula as the main client uses on agar.io, so the two match exactly. */
                this.mapOffsetX = this.mapOffset - right;
                this.mapOffsetY = this.mapOffset - bottom;
            } else {
                /* Same as the main client on private servers: centre of the border. */
                this.mapOffsetX = -(left + right) / 2;
                this.mapOffsetY = -(top + bottom) / 2;
            }
            this.mapMinX = left;
            this.mapMinY = top;
            this.mapMaxX = right;
            this.mapMaxY = bottom;
        }

        this.viewX = (right + left) / 2;
        this.viewY = (bottom + top) / 2;
        this.mapOffsetFixed = true;
        this._lmOffsetFixedAt = Date.now();
        console.log('[SPECT] Unit ' + this.number + ' map offset (x, y):', this.mapOffsetX, this.mapOffsetY,
            '| main:', legendmod.mapOffsetX, legendmod.mapOffsetY);
        /* Ghost cells may already be here. */
        this.detectOrientation();

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
        /* The player switched to this dead unit: keep the focus on it until it
         * spawns (beforecalculation used to hand it back on the next packet). */
        this._lmWantFocusAt = Date.now();
        if (this.isSocketOpen()) {
            /* Repeated Tab presses must not start a captcha + spawn each. */
            if (Date.now() - (this._lmLastSpawnReq || 0) <= 2000) return;
            this._lmLastSpawnReq = Date.now();
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
                /* see the other case 64: the first usable border wins */
                if (!this.mapOffsetFixed) {
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
                            this._lmWantFocusAt = 0
                            this.sendCursor()
                            loadMultiCellSkin(this)

                        }
                    }
                } else if (isFood) {
                    legendmod.foodMulti.push(cell); cell._lmInFoodMulti = true; //this causes problems					
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
        } else if (window.multiboxPlayerEnabled === this.number &&
            !(this._lmWantFocusAt && Date.now() - this._lmWantFocusAt < 25000)) {
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
        if (!this.transformReady()) {
            /* Not placed on the main map yet (see getX): leave the camera alone. */
            if (this.player) window.middleMultiViewFlag = false;
        } else {
            if (this.player) window.middleMultiViewFlag = lmMultiUnitIsClose(x, y);
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
    if (!spector) return;
    /*
     * The multibox player must log in with the OTHER provider's account.
     * Sending the main account's token logs the main connection out
     * ("Login elsewhere"), so pick the token by the main login context.
     */
    var maxTokenAge = 45 * 60 * 1000;
    var neededAt = master.context === "facebook" ? master.accessTokenGPlusAt : master.accessTokenFBAt;
    var needed = master.context === "facebook" ? master.accessTokenGPlus : master.accessTokenFB;
    if (needed && !(Date.now() - (neededAt || 0) < maxTokenAge)) {
        /* Expired cached token: getTheOppositeSocialToken drops it and logs in again. */
        spector.getTheOppositeSocialToken();
        return;
    }
    if (master.context === "facebook" && master.accessTokenGPlus) {
        spector.sendGplusToken(master.accessTokenGPlus)
    } else if (master.context === "google" && master.accessTokenFB) {
        spector.sendFbToken(master.accessTokenFB)
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
