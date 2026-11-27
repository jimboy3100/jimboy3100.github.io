// Bot core: the bot session of the bot server, shared by
//   - server.js and server-fast.js (Node, the bot server started with start.bat), and
//   - Legend Mod's browser bots (ogario.v4.js fetches this file and runs it in a Web Worker,
//     so the bots need no bot server).
// No Node modules and no Buffer here: Uint8Array/DataView only, the WebSocket constructor and
// murmur2 are passed in (createServer), so the same file runs in Node and in a browser worker.
//
// Captcha: bots spawn like the player. A queued captcha token is used when one
// is available, otherwise the token '0'. When the game server asks a bot for a
// captcha (opcode 85, or 87 for v3) the session enters captcha mode: the client
// gets message 12 once, bots keep their connection and wait, and each token the
// client sends ({"message":"botscode"}) spawns one waiting bot. Tokens are
// single use. Captcha mode ends when a bot spawns with '0' or after 5 minutes
// without 85/87 (85 later turns it on again, with a new 12). Stop/reset leaves
// captcha mode and drops queued tokens. The browser bots take no tokens (acceptTokens
// false): in captcha mode they only wait. A game URL that is not an agar.io game
// server (live-arena-*.agar.io or *.agario.miniclippt.com) is refused with 13, then 2.
(function (root, factory) {
    if (typeof module === 'object' && module.exports) module.exports = factory()
    else root.LMBotCore = factory()
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict'

    const TOKEN_TTL = 110000        // captcha tokens expire after about two minutes
    const TOKEN_MAX = 300           // queued tokens kept at most
    const RECONNECT_MIN = 1000
    const RECONNECT_MAX = 15000
    const CAPTCHA_HOLD = 5 * 60 * 1000 // captcha mode ends after this long without opcode 85/87
    /* A socket that hangs (no 242 this long after it was created, or no 32/85/87 this long after a
       spawn packet) is closed and the bot reconnects; it never sits there counted as connected. */
    const HANDSHAKE_DEADLINE = 10000
    const SPAWN_DEADLINE = 10000
    /* Connections in a row lost before the bot spawned on them (refused, closed, hung): the bot stops.
       When every bot of the session stopped this way, the client gets 14 and the session ends. */
    const MAX_FAILURES = 6
    const CONNECTING = 0, OPEN = 1     // WebSocket readyState values (ws and browsers)
    // Canonical map width: the mouse (opcode 6) and the ghost cells (opcode 10) come from the
    // client centred and scaled to it; each bot maps them into its own connection's map.
    const MAP_SIZE = 14142.135623730952

    // murmurhash-js 1.0.0 murmur2 (murmurhash2_32_gc, Gary Court, MIT): the cipher key for
    // the browser bots. developers/tests/bots.js compares it with the npm package's output.
    function murmur2(str, seed) {
        let l = str.length, h = seed ^ l, i = 0, k
        while (l >= 4) {
            k = ((str.charCodeAt(i) & 0xff)) | ((str.charCodeAt(++i) & 0xff) << 8) | ((str.charCodeAt(++i) & 0xff) << 16) | ((str.charCodeAt(++i) & 0xff) << 24)
            k = (((k & 0xffff) * 0x5bd1e995) + ((((k >>> 16) * 0x5bd1e995) & 0xffff) << 16))
            k ^= k >>> 24
            k = (((k & 0xffff) * 0x5bd1e995) + ((((k >>> 16) * 0x5bd1e995) & 0xffff) << 16))
            h = (((h & 0xffff) * 0x5bd1e995) + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16)) ^ k
            l -= 4
            ++i
        }
        switch (l) {
            case 3: h ^= (str.charCodeAt(i + 2) & 0xff) << 16 // falls through
            case 2: h ^= (str.charCodeAt(i + 1) & 0xff) << 8  // falls through
            case 1:
                h ^= (str.charCodeAt(i) & 0xff)
                h = (((h & 0xffff) * 0x5bd1e995) + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16))
        }
        h ^= h >>> 13
        h = (((h & 0xffff) * 0x5bd1e995) + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16))
        h ^= h >>> 15
        return h >>> 0
    }

    // Packet cipher and LZ4 block decoder (algorithm.js re-exports these).
    const algorithm = {
        rotateEncryptionKey(key) {
            key = Math.imul(key, 1540483477) | 0
            key = (Math.imul(key >>> 24 ^ key, 1540483477) | 0) ^ 114296087
            key = Math.imul(key >>> 13 ^ key, 1540483477) | 0
            return key >>> 15 ^ key
        },
        rotateBufferBytes(buffer, key) {
            for (let i = 0; i < buffer.byteLength; i++) buffer[i] = buffer[i] ^ key >>> (i % 4 * 8) & 255
            return buffer
        },
        uncompressBuffer(input, output) {
            for (let i = 0, j = 0; i < input.length;) {
                const byte = input[i++]
                let literalsLength = byte >> 4
                if (literalsLength > 0) {
                    let length = literalsLength + 240
                    while (length === 255) {
                        length = input[i++]
                        literalsLength += length
                    }
                    const end = i + literalsLength
                    while (i < end) output[j++] = input[i++]
                    if (i === input.length) return output
                }
                const offset = input[i++] | (input[i++] << 8)
                if (offset === 0 || offset > j) return -(i - 2)
                let matchLength = byte & 15
                let length = matchLength + 240
                while (length === 255) {
                    length = input[i++]
                    matchLength += length
                }
                let pos = j - offset
                const end = j + matchLength + 4
                while (j < end) output[j++] = output[pos++]
            }
            return output
        }
    }

    // Little-endian reader over a Uint8Array (a Node Buffer is one too). Reads past the end throw.
    class Reader {
        constructor(buffer) {
            this.buffer = buffer
            this.view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength)
            this.byteOffset = 0
        }
        readUint8() {
            return this.view.getUint8(this.byteOffset++)
        }
        readUint16() {
            const value = this.view.getUint16(this.byteOffset, true)
            this.byteOffset += 2
            return value
        }
        readInt32() {
            const value = this.view.getInt32(this.byteOffset, true)
            this.byteOffset += 4
            return value
        }
        readUint32() {
            const value = this.view.getUint32(this.byteOffset, true)
            this.byteOffset += 4
            return value
        }
        readDouble() {
            const value = this.view.getFloat64(this.byteOffset, true)
            this.byteOffset += 8
            return value
        }
        readString() {
            let string = ''
            while (true) {
                const charCode = this.readUint8()
                if (charCode === 0) break
                string += String.fromCharCode(charCode)
            }
            return string
        }
    }

    class Entity {
        constructor() {
            this.id = 0
            this.x = 0
            this.y = 0
            this.size = 0
            this.name = ''
            this.isVirus = false
            this.isPellet = false
        }
    }

    // Any binary message (Buffer, typed array, ArrayBuffer, ws fragments) as a Uint8Array, else null.
    function toU8(data) {
        if (ArrayBuffer.isView(data)) return new Uint8Array(data.buffer, data.byteOffset, data.byteLength)
        if (Object.prototype.toString.call(data) === '[object ArrayBuffer]') return new Uint8Array(data)
        if (Array.isArray(data)) {
            const parts = data.map(toU8)
            if (parts.some(p => !p)) return null
            const all = new Uint8Array(parts.reduce((n, p) => n + p.length, 0))
            let at = 0
            for (const p of parts) { all.set(p, at); at += p.length }
            return all
        }
        return null
    }

    function utf8Bytes(string) {
        if (typeof TextEncoder !== 'undefined') return new TextEncoder().encode(string)
        return latin1Bytes(unescape(encodeURIComponent(string)))
    }
    function latin1Bytes(string) {
        const bytes = new Uint8Array(string.length)
        for (let i = 0; i < string.length; i++) bytes[i] = string.charCodeAt(i)
        return bytes
    }
    function utf8Text(bytes) {
        if (typeof TextDecoder !== 'undefined') return new TextDecoder().decode(bytes)
        let s = ''
        for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i])
        return s
    }

    // Bytes of a nick or token as they go on the wire.
    // Names from the client arrive already UTF-8 encoded, one byte per character
    // (the client sends unescape(encodeURIComponent(nick)) and Reader.readString
    // keeps one character per byte), so characters 0x00-0xFF are written as single
    // bytes, exactly like the client writes its own spawn packet. A string with a
    // character above 0xFF is a plain JavaScript string and is encoded to UTF-8 here.
    // Zero bytes are dropped: they would end the field early.
    function toBytes(value) {
        const string = value == null ? '' : String(value)
        const bytes = /[^\x00-\xff]/.test(string) ? utf8Bytes(string) : latin1Bytes(string)
        return bytes.includes(0) ? bytes.filter(byte => byte !== 0) : bytes
    }

    // Packets to the game server (buffers.js wraps them in Buffers for Node).
    const buffers = {
        toBytes,
        protocolVersion(version) {
            const buf = new Uint8Array(5)
            buf[0] = 254
            new DataView(buf.buffer).setUint32(1, version, true)
            return buf
        },
        clientVersion(version) {
            const buf = new Uint8Array(5)
            buf[0] = 255
            new DataView(buf.buffer).setUint32(1, version, true)
            return buf
        },
        // Spawn: uint8 0, nick bytes, 0, token bytes, 0 (same layout as the player's
        // spawn in the client). Token '0' means "no captcha token".
        spawn(name, token) {
            const nick = toBytes(name)
            const code = toBytes(token == null || token === '' ? '0' : token)
            const buf = new Uint8Array(3 + nick.length + code.length)
            buf.set(nick, 1)
            buf.set(code, 2 + nick.length)
            return buf
        },
        // Spawn without the token field (old protocol), kept for compatibility.
        spawn2(name) {
            const nick = toBytes(name)
            const buf = new Uint8Array(2 + nick.length)
            buf.set(nick, 1)
            return buf
        },
        // Answer to a captcha v3 request (opcode 87): uint8 88, token bytes, 0.
        captchaV3(token) {
            const code = toBytes(token)
            const buf = new Uint8Array(2 + code.length)
            buf[0] = 88
            buf.set(code, 1)
            return buf
        },
        move(x, y, key) {
            const buf = new Uint8Array(13)
            const view = new DataView(buf.buffer)
            buf[0] = 16
            view.setInt32(1, x, true)
            view.setInt32(5, y, true)
            view.setInt32(9, key, true)
            return buf
        }
    }

    function decodeName(name) {
        try { return decodeURIComponent(escape(name)) } catch (e) { return name }
    }

    function isValidToken(token) {
        return typeof token === 'string' && token !== '0' && /^[\x21-\x7e]{1,8192}$/.test(token)
    }

    function clamp8(value) {
        return Math.max(0, Math.min(255, value | 0))
    }

    // Host part of the cipher key, like the client's generateClientKey:
    // hostname + pathname without a trailing slash. null when the URL is not an
    // agar.io game server: live-arena-*.agar.io (old) or *.agario.miniclippt.com, where the
    // matchmaker now sends players, e.g. web-arenas-live-v25-0.agario.miniclippt.com/eu-west-2/<ip>.
    const AGAR_GAME_HOST = /^(live-arena-[a-z0-9.-]+\.agar\.io|[a-z0-9.-]+\.agario\.miniclippt\.com)$/i
    function gameHost(url) {
        try {
            const u = new URL(url)
            if (!/^wss?:$/.test(u.protocol) || !AGAR_GAME_HOST.test(u.hostname)) return null
            return u.hostname + u.pathname.replace(/\/$/, '')
        } catch (e) {
            return null
        }
    }

    // Control connections to the Node bot server are accepted from these pages (and from tools without an Origin).
    function isAllowedOrigin(origin) {
        if (!origin) return true
        return /^https:\/\/(www\.)?agar\.io$/.test(origin) ||
            origin === 'https://jimboy3100.github.io' ||
            /^https:\/\/(www\.)?legendmod\.ml$/.test(origin) ||
            /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
    }

    function calculateDistance(botX, botY, targetX, targetY) {
        return Math.hypot(targetX - botX, targetY - botY)
    }

    const noop = () => {}

    // One bot session server. options:
    //   WebSocket      constructor for the bots' game connections (ws in Node, the browser's in a worker)
    //   murmur2        (string, seed) -> uint32, default the copy above
    //   socketOptions  second argument of new WebSocket (Node: { origin: 'https://agar.io' }); browsers set the Origin
    //   binaryType     set on each bot socket when given ('arraybuffer' in browsers)
    //   acceptTokens   false: {"message":"botscode"} captcha tokens are ignored (browser bots)
    //   log            { good, warn, error } (no-ops when left out)
    function createServer(options) {
        const opts = options || {}
        const WebSocket = opts.WebSocket
        const hash = opts.murmur2 || murmur2
        const logger = Object.assign({ good: noop, warn: noop, error: noop }, opts.log)
        const acceptTokens = opts.acceptTokens !== false

        const userBots = []
        let userWS = null,
            stoppingBots = false,
            connectedBots = 0,
            spawnedBots = 0,
            startBotsInterval = null,
            statusInterval = null,
            moveInterval = null,
            shutdownInterval = null

        const game = {
            url: '',
            protocolVersion: 0,
            clientVersion: 0
        }

        const user = {
            startedBots: false,
            nickName: '',       // the player's nick (sendMode), never a bot target
            isAlive: false,
            mouseX: 0,
            mouseY: 0,
            // Player's ghost cells (top players) in centred coords, from control opcode 10
            ghostRef: [],
            ghostRefAt: 0
        }

        const bots = {
            name: '',
            // The name as other players see it (decoded UTF-8), to recognise sibling bots
            displayName: '',
            amount: 0,
            ai: false
        }

        // Bot session: active from start (opcode 0) until stop/reset.
        const session = {
            active: false,
            captchaRequired: false,
            lastCaptchaAt: 0,
            tokens: []
        }

        function sendToUser(data) {
            sendTo(userWS, data)
        }

        function sendTo(ws, data) {
            if (ws && ws.readyState === OPEN) {
                try { ws.send(data) } catch (e) {}
            }
        }

        function pruneTokens() {
            const now = Date.now()
            let keep = 0
            for (const entry of session.tokens) {
                if (now - entry.time < TOKEN_TTL) session.tokens[keep++] = entry
            }
            session.tokens.length = keep
        }

        // Newest token first: it has the most time left before it expires.
        function takeToken() {
            pruneTokens()
            const entry = session.tokens.pop()
            return entry ? entry.token : null
        }

        function addToken(token) {
            if (!isValidToken(token)) return false
            pruneTokens()
            session.tokens.push({ token, time: Date.now() })
            if (session.tokens.length > TOKEN_MAX) session.tokens.shift()
            serveWaitingBots()
            return true
        }

        function serveWaitingBots() {
            for (const bot of userBots) {
                if (!session.tokens.length) break
                bot.useToken()
            }
        }

        function enterCaptchaMode() {
            session.lastCaptchaAt = Date.now()
            if (session.captchaRequired) return
            session.captchaRequired = true
            sendToUser(new Uint8Array([12]))
            logger.warn(acceptTokens ? 'The game server asks for a captcha, bots wait for tokens' : 'The game server asks for a captcha, bots wait')
        }

        // Leaves captcha mode and spawns the waiting bots with '0' (except = the bot
        // that is spawning right now).
        function exitCaptchaMode(except) {
            if (!session.captchaRequired) return
            session.captchaRequired = false
            logger.good('Captcha mode ended, bots spawn with token 0 again')
            for (const bot of userBots) {
                if (bot !== except && bot.waitingToken) {
                    bot.waitingToken = null
                    bot.trySpawn()
                }
            }
        }

        // Captcha mode ends when no bot was asked for a captcha for CAPTCHA_HOLD:
        // waiting bots then spawn with '0' (a new 85 turns captcha mode on again).
        function checkCaptchaExpiry() {
            if (!session.captchaRequired || Date.now() - session.lastCaptchaAt < CAPTCHA_HOLD) return
            exitCaptchaMode()
        }

        // Every bot of the session stopped after MAX_FAILURES failed connections: the client gets
        // 14 (u16 last close code) and the session ends (1, then 2), instead of retrying for ever.
        function checkAllGaveUp(code) {
            if (!session.active || stoppingBots || userBots.length < bots.amount || !userBots.every(bot => bot.gaveUp)) return
            const c = (code || 0) & 0xffff
            sendToUser(new Uint8Array([14, c & 255, c >> 8]))
            logger.error('The game server refused every bot, bots stopped')
            beginShutdown(userWS)
        }

        // Bots waiting for a captcha token, and bots that stopped after failed connections
        function countBots(test) {
            let n = 0
            for (const bot of userBots) if (test(bot)) n++
            return n
        }

        // The player's own cells are never a bot target (sendMode nick, opcode 7).
        function isPlayerEntity(entity) {
            return !!user.nickName && entity.name === user.nickName
        }

        class Bot {
            constructor() {
                this.ws = null
                this.encryptionKey = 0
                this.decryptionKey = 0
                this.isConnected = false
                this.cellsIDs = []
                this.isAlive = false
                this.followMouseTimeout = null
                this.followMouse = false
                this.viewportEntities = {}
                this.offsetX = 0
                this.offsetY = 0
                // This connection's map width and height / MAP_SIZE (agar.io scales each connection's map)
                this.scaleX = 1
                this.scaleY = 1
                // Smooth direction: wander angle maintained for a period
                this.wanderAngle = Math.random() * Math.PI * 2
                this.wanderExpiry = 0
                // Target pellet persistence: keep chasing the same pellet
                this.targetPelletId = 0
                // Smoothed target position for gradual direction changes
                this.lastSentX = 0
                this.lastSentY = 0
                this.isSplited = false
                // Map orientation against the player's connection (FFA/EXP may mirror an axis)
                this.fixX = 1
                this.fixY = 1
                this.orientFixed = false
                this.ghostCells = []
                this.offsetFixed = false
                this.offsetFixedAt = 0
                // Spawn / captcha state
                this.handshakeDone = false      // game server sent 242: spawn packets are accepted
                this.waitingToken = null        // 'spawn' or 'v3' while waiting for a captcha token
                this.spawnToken = null          // '0' or 'token': what the last spawn packet carried
                this.reconnectTimeout = null
                this.reconnectAttempts = 0
                this.destroyed = false
                // Hung-socket deadline and consecutive connections lost before a spawn on them
                this.deadlineTimeout = null
                this.spawnedHere = false
                this.failures = 0
                this.lastCloseCode = 0
                this.gaveUp = false
                this.orientProvisional = false
                this.connect()
            }
            reset() {
                this.markDead()
                this.clearDeadline()
                if (this.isConnected) {
                    this.isConnected = false
                    connectedBots--
                }
                this.encryptionKey = 0
                this.decryptionKey = 0
                this.cellsIDs = []
                this.followMouseTimeout = null
                this.followMouse = false
                this.viewportEntities = {}
                this.offsetX = 0
                this.offsetY = 0
                this.scaleX = 1
                this.scaleY = 1
                this.wanderAngle = Math.random() * Math.PI * 2
                this.wanderExpiry = 0
                this.targetPelletId = 0
                this.lastSentX = 0
                this.lastSentY = 0
                this.isSplited = false
                this.fixX = 1
                this.fixY = 1
                this.orientFixed = false
                this.orientProvisional = false
                this.ghostCells = []
                this.offsetFixed = false
                this.offsetFixedAt = 0
                this.handshakeDone = false
                this.waitingToken = null
                this.spawnToken = null
                this.spawnedHere = false
            }
            connect() {
                this.reset()
                try {
                    this.ws = opts.socketOptions === undefined ? new WebSocket(game.url) : new WebSocket(game.url, opts.socketOptions)
                } catch (e) {
                    this.ws = null
                    logger.error('Bot cannot connect:', e.message)
                    this.lost(0, 'cannot connect')
                    return
                }
                if (opts.binaryType) this.ws.binaryType = opts.binaryType
                this.ws.onopen = this.onopen.bind(this)
                this.ws.onmessage = this.onmessage.bind(this)
                this.ws.onerror = this.onerror.bind(this)
                this.ws.onclose = this.onclose.bind(this)
                this.setDeadline(HANDSHAKE_DEADLINE, 'no handshake')
            }
            setDeadline(ms, why) {
                this.clearDeadline()
                this.deadlineTimeout = setTimeout(() => {
                    this.deadlineTimeout = null
                    if (this.destroyed || !session.active || stoppingBots || !this.ws) return
                    this.abandon(why)
                }, ms)
            }
            clearDeadline() {
                if (this.deadlineTimeout) {
                    clearTimeout(this.deadlineTimeout)
                    this.deadlineTimeout = null
                }
            }
            // Closes a hung socket (also one still connecting) without waiting for its close event.
            abandon(why) {
                const ws = this.ws
                this.detachSocket()
                if (ws) { try { ws.close() } catch (e) {} }
                this.lost(0, why)
            }
            // The socket is gone (code: its close code, 0 when we closed it). Counts a failure when
            // the bot never spawned on it and was not waiting for a captcha, then reconnects or stops.
            lost(code, why) {
                const failed = !this.spawnedHere && !this.waitingToken
                this.reset()
                if (this.destroyed || !session.active || stoppingBots) return
                if (failed) {
                    this.failures++
                    this.lastCloseCode = code || 0
                    logger.warn('Bot could not join the game server (' + (why || 'closed') + (code ? ', close code ' + code : '') + '), ' + this.failures + '/' + MAX_FAILURES)
                    if (this.failures >= MAX_FAILURES) {
                        this.giveUp()
                        return
                    }
                }
                this.scheduleReconnect()
            }
            giveUp() {
                this.gaveUp = true
                if (this.reconnectTimeout) {
                    clearTimeout(this.reconnectTimeout)
                    this.reconnectTimeout = null
                }
                logger.error('Bot stopped after ' + this.failures + ' failed connections in a row' + (this.lastCloseCode ? ' (last close code ' + this.lastCloseCode + ')' : ''))
                checkAllGaveUp(this.lastCloseCode)
            }
            sendSpawn(token) {
                this.send(buffers.spawn(bots.name, token))
                this.setDeadline(SPAWN_DEADLINE, 'no answer to spawn')
            }
            detachSocket() {
                if (this.ws) {
                    this.ws.onopen = null
                    this.ws.onmessage = null
                    this.ws.onerror = null
                    this.ws.onclose = null
                    this.ws = null
                }
            }
            // Leaves the session for good (stop/reset): no reconnect, counters released.
            destroy() {
                this.destroyed = true
                if (this.reconnectTimeout) {
                    clearTimeout(this.reconnectTimeout)
                    this.reconnectTimeout = null
                }
                const ws = this.ws
                this.detachSocket()
                this.reset()
                if (ws) { try { ws.close() } catch (e) {} }
            }
            markDead() {
                if (this.isAlive) {
                    this.isAlive = false
                    spawnedBots--
                }
                this.cellsIDs = []
                if (this.followMouseTimeout) {
                    clearTimeout(this.followMouseTimeout)
                    this.followMouseTimeout = null
                }
                this.followMouse = false
            }
            scheduleReconnect() {
                if (this.destroyed || this.gaveUp || this.reconnectTimeout || !session.active || stoppingBots) return
                const delay = Math.min(RECONNECT_MIN * Math.pow(2, this.reconnectAttempts), RECONNECT_MAX)
                this.reconnectAttempts++
                this.reconnectTimeout = setTimeout(() => {
                    this.reconnectTimeout = null
                    if (!this.destroyed && session.active && !stoppingBots) this.connect()
                }, delay)
            }
            send(buffer) {
                if (this.ws && this.ws.readyState === OPEN) {
                    if (this.encryptionKey) {
                        buffer = algorithm.rotateBufferBytes(buffer, this.encryptionKey)
                        this.encryptionKey = algorithm.rotateEncryptionKey(this.encryptionKey)
                    }
                    this.ws.send(buffer)
                }
            }
            canSpawn() {
                return !!(this.ws && this.ws.readyState === OPEN && this.handshakeDone && !stoppingBots && session.active)
            }
            // Spawn with a queued token, else with '0'; in captcha mode wait for a token.
            trySpawn() {
                if (this.isAlive || !this.canSpawn()) return
                if (session.captchaRequired && Date.now() - session.lastCaptchaAt >= CAPTCHA_HOLD) exitCaptchaMode(this)
                let token = takeToken()
                if (!token) {
                    if (session.captchaRequired) {
                        this.waitingToken = 'spawn'
                        return
                    }
                    token = '0'
                }
                this.waitingToken = null
                this.spawnToken = token === '0' ? '0' : 'token'
                this.sendSpawn(token)
            }
            // Hands a queued token to this bot if it waits for one. Returns true when used.
            useToken() {
                if (!this.waitingToken || !this.canSpawn()) return false
                const token = takeToken()
                if (!token) return false
                if (this.waitingToken === 'v3') {
                    this.send(buffers.captchaV3(token))
                    this.setDeadline(SPAWN_DEADLINE, 'no answer to the captcha')
                } else {
                    this.spawnToken = 'token'
                    this.sendSpawn(token)
                }
                this.waitingToken = null
                return true
            }
            // Counted as connected only from the game server's 242 (an open socket can still hang).
            onopen() {
                this.send(buffers.protocolVersion(game.protocolVersion))
                this.send(buffers.clientVersion(game.clientVersion))
            }
            onmessage(message) {
                try {
                    if (typeof message.data === 'string') return
                    const data = toU8(message.data)
                    if (!data) return
                    if (this.decryptionKey) algorithm.rotateBufferBytes(data, this.decryptionKey ^ game.clientVersion)
                    this.handleBuffer(data)
                } catch (e) {
                    logger.error('Bot ignored a malformed packet:', e.message)
                }
            }
            onerror() {
                // close only the socket that failed, not a newer one after a reconnect
                const ws = this.ws
                setTimeout(() => {
                    if (ws && (ws.readyState === CONNECTING || ws.readyState === OPEN)) ws.close()
                }, 1000)
            }
            onclose(event) {
                // Null the ws reference so GC can collect the socket
                this.detachSocket()
                this.lost(event && event.code, event && event.reason)
            }
            handleBuffer(buffer) {
                const reader = new Reader(buffer)
                switch (reader.readUint8()) {
                    case 32:
                        this.cellsIDs.push(reader.readUint32())
                        this.clearDeadline()
                        this.spawnedHere = true
                        this.failures = 0
                        if (!this.isAlive) {
                            this.isAlive = true
                            this.waitingToken = null
                            // spawned without a captcha: the game server no longer asks for one
                            if (this.spawnToken === '0') exitCaptchaMode(this)
                            this.reconnectAttempts = 0
                            spawnedBots++
                            if (!user.startedBots) {
                                if (!moveInterval) {
                                    moveInterval = setInterval(() => {
                                        for (const bot of userBots) {
                                            if (bot.isAlive) bot.move()
                                        }
                                    }, 40)
                                }
                                sendToUser(new Uint8Array([0]))
                                user.startedBots = true
                                logger.good('Bots started!')
                            }
                            if (!this.followMouseTimeout) {
                                this.followMouseTimeout = setTimeout(() => {
                                    if (this.isAlive) this.followMouse = true
                                }, 18000)
                            }
                        }
                        break
                    case 85:
                        // Captcha required: keep the connection and spawn on the next token.
                        this.clearDeadline()
                        enterCaptchaMode()
                        this.waitingToken = 'spawn'
                        this.useToken()
                        break
                    case 87:
                        // Captcha v3 required: answer with opcode 88 + token.
                        this.clearDeadline()
                        enterCaptchaMode()
                        this.waitingToken = 'v3'
                        this.useToken()
                        break
                    case 69:
                        this.updateGhostCells(reader)
                        break
                    case 241: {
                        const decryptionKey = reader.readInt32()
                        const host = gameHost(game.url)
                        if (!host) { logger.error('Unexpected URL format:', game.url); return }
                        this.decryptionKey = decryptionKey
                        this.encryptionKey = hash(host + reader.readString(), 255)
                        break
                    }
                    case 242:
                        this.handshakeDone = true
                        this.clearDeadline()
                        if (!this.isConnected) {
                            this.isConnected = true
                            connectedBots++
                        }
                        if (this.waitingToken) this.useToken()
                        else this.trySpawn()
                        break
                    case 255: {
                        const compressedSize = reader.readUint32()
                        if (compressedSize > 1048576) break // 1MB safety cap
                        this.handleCompressedBuffer(algorithm.uncompressBuffer(reader.buffer.subarray(5), new Uint8Array(compressedSize)))
                        break
                    }
                }
            }
            handleCompressedBuffer(buffer) {
                if (!buffer || typeof buffer !== 'object') return // uncompressBuffer returns a negative number on bad input
                const reader = new Reader(buffer)
                switch (reader.readUint8()) {
                    case 16:
                        this.updateViewportEntities(reader)
                        break
                    case 64:
                        this.updateOffset(reader)
                        break
                    case 69:
                        this.updateGhostCells(reader)
                        break
                }
            }
            // Opcode 69: u16 n, then n x (i32 x, i32 y, u32 mass, u8 flag). Stored
            // relative to this connection's map centre, in canonical units (like opcode 10).
            updateGhostCells(reader) {
                if (!this.offsetFixed) return
                const length = reader.readUint16()
                const cells = []
                for (let i = 0; i < length; i++) {
                    const x = reader.readInt32()
                    const y = reader.readInt32()
                    const mass = reader.readUint32()
                    reader.byteOffset += 1
                    cells.push({ x: (x - this.offsetX) / this.scaleX, y: (y - this.offsetY) / this.scaleY, mass })
                }
                this.ghostCells = cells
                this.detectOrientation()
            }
            // The top players (ghost cells) are the same players on the player's and on
            // this bot's connection, so their distance from the map centre must match
            // per axis, either as is (same) or with the sign flipped (mirrored).
            // After the 10 s fallback (orientProvisional) it keeps looking: a real decision replaces it.
            detectOrientation() {
                if ((this.orientFixed && !this.orientProvisional) || !this.offsetFixed) return
                const refs = user.ghostRef
                if (!refs || !refs.length || !this.ghostCells.length) return
                // the two lists must be from about the same moment
                if (!(Date.now() - user.ghostRefAt <= 3000)) return
                const used = {}
                let pairs = 0, sameX = 0, flipX = 0, sameY = 0, flipY = 0
                for (let i = 0; i < refs.length && pairs < 10; i++) {
                    const m = refs[i]
                    if (!m || !Number.isFinite(m.x) || !Number.isFinite(m.y) || !(m.mass > 0)) continue
                    // same player on this connection: the closest mass, within 10%
                    let best = -1, bestDiff = Infinity
                    for (let j = 0; j < this.ghostCells.length; j++) {
                        const g = this.ghostCells[j]
                        if (used[j] || !g || !(g.mass > 0)) continue
                        const diff = Math.abs(g.mass - m.mass) / Math.max(g.mass, m.mass)
                        if (diff < bestDiff) {
                            bestDiff = diff
                            best = j
                        }
                    }
                    if (best < 0 || bestDiff > 0.1) continue
                    used[best] = true
                    const s = this.ghostCells[best]
                    sameX += Math.abs(m.x - s.x)
                    flipX += Math.abs(m.x + s.x)
                    sameY += Math.abs(m.y - s.y)
                    flipY += Math.abs(m.y + s.y)
                    pairs++
                }
                if (!pairs) return
                // Decide an axis only when one answer fits and clearly beats the other
                // (a player near the centre line fits both); else wait for the next list.
                const decide = (same, flip) => {
                    same /= pairs
                    flip /= pairs
                    if (same < 600 && flip - same >= 400) return 1
                    if (flip < 600 && same - flip >= 400) return -1
                    return 0
                }
                const fx = decide(sameX, flipX)
                const fy = decide(sameY, flipY)
                if (!fx || !fy) return
                this.fixX = fx
                this.fixY = fy
                this.orientFixed = true
                this.orientProvisional = false
            }
            // No decision 10 s after the map border was known: follow with 1/1 for now (provisional:
            // the ghost cells keep being compared and a real decision replaces it).
            checkOrientationFallback() {
                if (!this.orientFixed && this.offsetFixed && Date.now() - this.offsetFixedAt >= 10000) {
                    this.orientFixed = true
                    this.orientProvisional = true
                }
            }
            removeEntity(id) {
                const at = this.cellsIDs.indexOf(id)
                if (at >= 0) this.cellsIDs.splice(at, 1)
                delete this.viewportEntities[id]
            }
            updateViewportEntities(reader) {
                // Eat records (eater, eaten): the eaten cell is gone, also when the remove list leaves it out
                const eatRecordLength = reader.readUint16()
                for (let i = 0; i < eatRecordLength; i++) {
                    reader.byteOffset += 4
                    this.removeEntity(reader.readUint32())
                }
                while (true) {
                    const id = reader.readUint32()
                    if (id === 0) break
                    const entity = new Entity()
                    entity.id = id
                    entity.x = reader.readInt32()
                    entity.y = reader.readInt32()
                    entity.size = reader.readUint16()
                    const flags = reader.readUint8()
                    const extendedFlags = flags & 128 ? reader.readUint8() : 0
                    if (flags & 1) entity.isVirus = true
                    if (flags & 2) reader.byteOffset += 3
                    if (flags & 4) reader.readString()
                    if (flags & 8) entity.name = decodeName(reader.readString())
                    if (extendedFlags & 1) entity.isPellet = true
                    if (extendedFlags & 4) reader.byteOffset += 4
                    if (this.viewportEntities[entity.id] && this.viewportEntities[entity.id].name && entity.name) entity.name = this.viewportEntities[entity.id].name
                    this.viewportEntities[entity.id] = entity
                }
                const removeRecordLength = reader.readUint16()
                for (let i = 0; i < removeRecordLength; i++) this.removeEntity(reader.readUint32())
                if (this.isAlive && this.cellsIDs.length === 0) {
                    // Died: respawn with the same token rule as the first spawn
                    this.markDead()
                    this.trySpawn()
                }
            }
            // Opcode 64. agar.io gives every connection its own map: the full border is 14073..14210
            // wide and high (a scale per axis) with its own centre, sent twice at the handshake, and
            // playing connections also get view-rect borders (about 4250 x 2560) that are not the map.
            // The first border wider and taller than 14000 is this connection's map.
            updateOffset(reader) {
                const left = reader.readDouble()
                const top = reader.readDouble()
                const right = reader.readDouble()
                const bottom = reader.readDouble()
                if (this.offsetFixed || !(right - left > 14000 && bottom - top > 14000)) return
                this.offsetX = (left + right) / 2
                this.offsetY = (top + bottom) / 2
                this.scaleX = (right - left) / MAP_SIZE
                this.scaleY = (bottom - top) / MAP_SIZE
                this.offsetFixed = true
                this.offsetFixedAt = Date.now()
            }
            getClosestEntity(type, bot) {
                let closestDistance = Infinity
                let closestEntity = null
                for (const entity of Object.values(this.viewportEntities)) {
                    let isConditionMet = false
                    switch (type) {
                        case 'virus':
                            isConditionMet = entity.isVirus && entity.size > 115 && this.cellsIDs.length !== 16
                            break
                        case 'biggerPlayer':
                            isConditionMet = !entity.isVirus && !entity.isPellet && entity.size > bot.size * 1.15 && entity.name !== bots.displayName && !isPlayerEntity(entity)
                            break
                        case 'pellet':
                            isConditionMet = !entity.isVirus && entity.isPellet
                            break
                        case 'upperhand':
                            isConditionMet = !entity.isVirus && !entity.isPellet && entity.size < bot.smallestCellsize * 1.4 && !isPlayerEntity(entity) && entity.size > bot.size / 10 && bot.size > 120 && this.cellsIDs.length == 1
                            break
                    }
                    if (isConditionMet) {
                        let distance = calculateDistance(bot.x, bot.y, entity.x, entity.y)
                        // Subtract sizes for clever distance estimation (bigger cells are closer)
                        distance = distance - bot.size - entity.size
                        if (distance < closestDistance) {
                            closestDistance = distance
                            closestEntity = entity
                        }
                    }
                }
                return {
                    distance: closestDistance,
                    entity: closestEntity
                }
            }
            sendPosition(x, y) {
                // Smooth direction: lerp toward the new target so the visual rotation is stable
                const lerpFactor = 0.35
                if (this.lastSentX === 0 && this.lastSentY === 0) {
                    this.lastSentX = x
                    this.lastSentY = y
                } else {
                    this.lastSentX += (x - this.lastSentX) * lerpFactor
                    this.lastSentY += (y - this.lastSentY) * lerpFactor
                }
                this.send(buffers.move(~~this.lastSentX, ~~this.lastSentY, this.decryptionKey))
            }
            sendPositionDirect(x, y) {
                // No smoothing — for urgent actions like split-kill
                this.lastSentX = x
                this.lastSentY = y
                this.send(buffers.move(~~x, ~~y, this.decryptionKey))
            }
            move() {
                this.checkOrientationFallback()
                const bot = {
                    x: 0,
                    y: 0,
                    size: 0,
                    biggestCellsize: 0,
                    smallestCellsize: 12000
                }
                for (const id of this.cellsIDs) {
                    const cell = this.viewportEntities[id]
                    if (cell) {
                        bot.x += cell.x / this.cellsIDs.length
                        bot.y += cell.y / this.cellsIDs.length
                        bot.size += cell.size
                        if (cell.size > bot.biggestCellsize) bot.biggestCellsize = cell.size
                        if (cell.size < bot.smallestCellsize) bot.smallestCellsize = cell.size
                    }
                }
                const closestVirus = this.getClosestEntity('virus', bot)
                const closestBiggerPlayer = this.getClosestEntity('biggerPlayer', bot)
                const closestPellet = this.getClosestEntity('pellet', bot)
                const closestVictimPlayer = this.getClosestEntity('upperhand', bot)
                if (user.isAlive && this.followMouse && !stoppingBots && !bots.ai) {
                    this.sendPosition(user.mouseX * this.fixX * this.scaleX + this.offsetX, user.mouseY * this.fixY * this.scaleY + this.offsetY)
                } else {
                    // AI Handling — smooth directional movement
                    if (closestVirus.entity && closestVirus.distance < 125) {
                        const angle = (Math.atan2(closestVirus.entity.y - bot.y, closestVirus.entity.x - bot.x) + Math.PI) % (2 * Math.PI)
                        this.sendPosition(bot.x + 14142 * Math.cos(angle), bot.y + 14142 * Math.sin(angle))
                    }
                    else if (closestBiggerPlayer.entity && closestBiggerPlayer.distance < 760) {
                        const angle = (Math.atan2(closestBiggerPlayer.entity.y - bot.y, closestBiggerPlayer.entity.x - bot.x) + Math.PI) % (2 * Math.PI)
                        this.sendPosition(bot.x + 14142 * Math.cos(angle), bot.y + 14142 * Math.sin(angle))
                    }
                    else if (closestVictimPlayer.entity && closestVictimPlayer.distance < 320) {
                        if (!this.isSplited) {
                            this.isSplited = true
                            this.sendPositionDirect(closestVictimPlayer.entity.x, closestVictimPlayer.entity.y)
                            this.send(new Uint8Array([17]))
                        }
                        else if (this.isSplited) { this.isSplited = false }
                    }// End of AI Handling
                    else if (closestPellet.entity) {
                        // Persistent pellet targeting: keep chasing the same pellet for stable direction
                        let pellet = closestPellet.entity
                        if (this.targetPelletId && this.viewportEntities[this.targetPelletId]) {
                            const kept = this.viewportEntities[this.targetPelletId]
                            const keptDist = calculateDistance(bot.x, bot.y, kept.x, kept.y)
                            // Keep the old pellet if it is within 1.5x the closest pellet distance
                            if (kept.isPellet && keptDist < closestPellet.distance * 1.5) pellet = kept
                        }
                        this.targetPelletId = pellet.id
                        this.sendPosition(pellet.x, pellet.y)
                    }
                    else {
                        // Random wander
                        const now = Date.now()
                        if (now > this.wanderExpiry) {
                            this.wanderAngle += (Math.random() - 0.5) * Math.PI * 0.8
                            this.wanderExpiry = now + 2000 + ~~(Math.random() * 3000)
                        }
                        const wanderDist = 800 + ~~(Math.random() * 500)
                        this.sendPosition(bot.x + wanderDist * Math.cos(this.wanderAngle), bot.y + wanderDist * Math.sin(this.wanderAngle))
                    }
                }
            }
        }

        function resetServer() {
            if (shutdownInterval) { clearInterval(shutdownInterval); shutdownInterval = null }
            // Close every bot for good: cancels follow-mouse and reconnect timers
            for (const bot of userBots) bot.destroy()
            userBots.length = 0
            // Reset session state; do NOT clear statusInterval (it belongs to the
            // control connection, not the bot session, and is recreated on reconnect)
            session.active = false
            session.captchaRequired = false
            session.lastCaptchaAt = 0
            session.tokens.length = 0
            stoppingBots = false
            connectedBots = 0
            spawnedBots = 0
            user.startedBots = false
            user.isAlive = false
            user.nickName = ''
            user.mouseX = 0
            user.mouseY = 0
            user.ghostRef = []
            user.ghostRefAt = 0
            bots.ai = false
            if (moveInterval) { clearInterval(moveInterval); moveInterval = null }
            if (startBotsInterval) { clearInterval(startBotsInterval); startBotsInterval = null }
            logger.good('Session ended. Ready for new connection.')
        }

        // One step of the start loop: adds a bot while below the amount. Bots that lose their connection reconnect themselves, so
        // userBots never holds more than bots.amount bots.
        function addBotTick() {
            if (!session.active || stoppingBots) return
            checkCaptchaExpiry()
            if (userBots.length >= bots.amount) return
            userBots.push(new Bot())
        }

        // Stop: tells the client (1 stopping, then 2 stopped) when ws is given.
        function beginShutdown(ws) {
            if (!session.active) {
                if (ws) sendTo(ws, new Uint8Array([2]))
                return
            }
            if (stoppingBots) return
            stoppingBots = true
            if (ws) sendTo(ws, new Uint8Array([1]))
            let seconds = 0
            if (shutdownInterval) clearInterval(shutdownInterval)
            shutdownInterval = setInterval(() => {
                if (seconds === 1) {
                    clearInterval(shutdownInterval)
                    shutdownInterval = null
                    if (ws) sendTo(ws, new Uint8Array([2]))
                    resetServer()
                } else {
                    logger.warn(`Stopping bots in ${1 - seconds} seconds`)
                    seconds++
                }
            }, 1000)
        }

        // {"message":"botscode","msg":JSON.stringify(token)}. Token contents are never logged.
        function handleTokenMessage(text) {
            if (!acceptTokens) return
            let token = null
            try {
                const packet = JSON.parse(text)
                if (!packet || packet.message !== 'botscode') return
                let value = packet.msg
                if (typeof value === 'string') {
                    try { value = JSON.parse(value) } catch (e) {}
                }
                if (value && typeof value === 'object') value = Object.values(value).join('')
                token = typeof value === 'string' ? value : null
            } catch (e) {
                logger.error('Ignored a malformed token message')
                return
            }
            addToken(token)
        }

        function handleUserMessage(ws, data) {
            if (ws !== userWS) return // a replaced client
            try {
                if (typeof data === 'string') {
                    handleTokenMessage(data)
                    return
                }
                const buffer = toU8(data)
                if (!buffer || !buffer.length) return
                if (buffer[0] === 123) {
                    handleTokenMessage(utf8Text(buffer))
                    return
                }
                const reader = new Reader(buffer)
                switch (reader.readUint8()) {
                    case 0: {
                        if (session.active) break
                        // Read everything first: a truncated packet must not leave half a session
                        const url = reader.readString()
                        const protocolVersion = reader.readUint32()
                        const clientVersion = reader.readUint32()
                        const isAlive = !!reader.readUint8()
                        const name = reader.readString()
                        const amount = reader.readUint8()
                        if (!gameHost(url)) {
                            // not an agar.io game server: tell the client (13) and stay stopped (2)
                            sendTo(ws, new Uint8Array([13]))
                            sendTo(ws, new Uint8Array([2]))
                            logger.error('Game server not supported by bots:', url)
                            break
                        }
                        game.url = url
                        game.protocolVersion = protocolVersion
                        game.clientVersion = clientVersion
                        logger.good('Server:', game.url, ' protocol version:', game.protocolVersion, ' client version: ', game.clientVersion)
                        user.isAlive = isAlive
                        bots.name = name
                        bots.displayName = decodeName(name)
                        bots.amount = amount
                        session.active = true
                        session.captchaRequired = false
                        stoppingBots = false
                        if (startBotsInterval) clearInterval(startBotsInterval)
                        startBotsInterval = setInterval(addBotTick, 150)
                        logger.good('Starting bots...')
                        break
                    }
                    case 1:
                        beginShutdown(ws)
                        break
                    case 2:
                        for (const bot of userBots) {
                            if (bot.isAlive && bot.followMouse && !stoppingBots && !bots.ai) bot.send(new Uint8Array([17])) //sendSplit
                        }
                        break
                    case 3:
                        for (const bot of userBots) {
                            if (bot.isAlive && bot.followMouse && !stoppingBots && !bots.ai) bot.send(new Uint8Array([21])) //sendEject
                        }
                        break
                    case 4:
                        bots.ai = !!reader.readUint8()
                        break
                    case 5:
                        user.isAlive = !!reader.readUint8()
                        break
                    case 6:
                        user.mouseX = reader.readInt32()
                        user.mouseY = reader.readInt32()
                        break
                    case 10: {
                        // Player's ghost cells: u8 n (<= 10), n x (i32 x, i32 y, u32 mass)
                        const count = reader.readUint8()
                        if (count > 10 || 2 + count * 12 > buffer.length) break
                        const refs = []
                        for (let i = 0; i < count; i++) {
                            const x = reader.readInt32()
                            const y = reader.readInt32()
                            const mass = reader.readUint32()
                            refs.push({ x, y, mass })
                        }
                        user.ghostRef = refs
                        user.ghostRefAt = Date.now()
                        for (const bot of userBots) {
                            if (!bot.orientFixed || bot.orientProvisional) bot.detectOrientation()
                        }
                        break
                    }
                    case 7:
                        // sendMode: 7, 1, player's nick, 0. Other opcode 7 forms (old token path) are ignored.
                        if (buffer.length >= 3 && reader.readUint8() === 1) user.nickName = decodeName(reader.readString())
                        break
                }
            } catch (e) {
                logger.error('Malformed control message:', e.message)
            }
        }

        // A control client: anything with readyState and send(data). A ws socket (Node) also
        // gets its message/close/error handlers here; other clients call handleUserMessage and
        // onUserClose themselves (the browser worker).
        function onUserConnection(ws) {
            // A new client takes over: the previous client is told its bots stopped (2)
            if (userWS && userWS !== ws) {
                sendTo(userWS, new Uint8Array([2]))
                if (session.active) resetServer()
            }
            // Clear any previous status interval before creating a new one
            if (statusInterval) { clearInterval(statusInterval); statusInterval = null }
            statusInterval = setInterval(() => {
                // no server player total here (54 is the top-10 leaderboard): Legend Mod counts the
                // players itself from the whole leaderboard (opcode 53) it gets as the player.
                // 4, connected (from 242), spawned, waiting for a captcha, stopped after failed connections
                sendToUser(new Uint8Array([4, clamp8(connectedBots), clamp8(spawnedBots),
                    clamp8(countBots(bot => !!bot.waitingToken)), clamp8(countBots(bot => bot.gaveUp))]))
            }, 1000)
            userWS = ws
            logger.good('User connected!')
            if (typeof ws.on === 'function') {
                ws.on('error', () => {})
                ws.on('message', data => handleUserMessage(ws, data))
                ws.on('close', () => onUserClose(ws))
            }
        }

        function onUserClose(ws) {
            if (ws !== userWS) return // an older client that was already replaced
            // Clean up status interval on disconnect
            if (statusInterval) { clearInterval(statusInterval); statusInterval = null }
            userWS = null
            // End the session now: bots, timers, captcha mode, orientation reference
            if (session.active || stoppingBots) resetServer()
            logger.error('User disconnected!')
        }

        return {
            Bot, game, user, bots, session, userBots,
            gameHost,
            addToken, takeToken, enterCaptchaMode, checkCaptchaExpiry, addBotTick, beginShutdown, resetServer,
            handleUserMessage, onUserConnection, onUserClose,
            state: () => ({ userWS, stoppingBots, connectedBots, spawnedBots, startBotsInterval, statusInterval, moveInterval, shutdownInterval })
        }
    }

    // Browser bots: run in a Web Worker (scope = the worker's self). The page talks to it with
    // the bot server's control protocol: binary messages both ways, as over the WebSocket to
    // server.js. The string 'close' ends the session (bots' sockets closed, timers cleared).
    function runWorker(scope) {
        const client = {
            readyState: OPEN,
            send(data) {
                const copy = toU8(data).slice().buffer
                scope.postMessage(copy, [copy])
            }
        }
        const server = createServer({
            WebSocket: scope.WebSocket,
            binaryType: 'arraybuffer',
            acceptTokens: false,
            log: { error: (...args) => { try { console.warn('[LM bots]', ...args) } catch (e) {} } }
        })
        server.onUserConnection(client)
        scope.onmessage = function (event) {
            if (event.data === 'close') {
                server.onUserClose(client)
                client.readyState = 3
                return
            }
            server.handleUserMessage(client, event.data)
        }
        return server
    }

    return { murmur2, algorithm, Reader, Entity, buffers, gameHost, isAllowedOrigin, createServer, runWorker }
})
