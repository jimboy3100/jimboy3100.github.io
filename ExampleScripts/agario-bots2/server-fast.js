// Fast variant of server.js (no update check, console logging, port from config.json).
// Same bot lifecycle and captcha handling as server.js:
// bots spawn like the player. A queued captcha token is used when one is
// available, otherwise the token '0'. When the game server asks a bot for a
// captcha (opcode 85, or 87 for v3) the session enters captcha mode: the client
// gets message 12 once, bots keep their connection and wait, and each token the
// client sends ({"message":"botscode"}) spawns one waiting bot. Tokens are
// single use. Captcha mode ends when a bot spawns with '0' or after 5 minutes
// without 85/87 (85 later turns it on again, with a new 12). Stop/reset leaves
// captcha mode and drops queued tokens. A game URL that is not an agar.io game
// server (live-arena-*.agar.io) is refused with 13, then 2.
const WebSocket = require('ws')
const {murmur2} = require('murmurhash-js')

const buffers = require('./buffers')
const Reader = require('./reader')
const algorithm = require('./algorithm')
const Entity = require('./entity')

const config = require('./config.json')

const PORT = config.server.port
const TOKEN_TTL = 110000        // captcha tokens expire after about two minutes
const TOKEN_MAX = 300           // queued tokens kept at most
const RECONNECT_MIN = 1000
const RECONNECT_MAX = 15000
const CAPTCHA_HOLD = 5 * 60 * 1000 // captcha mode ends after this long without opcode 85/87

const userBots = [];
let userWS = null,
    stoppingBots = false,
    connectedBots = 0,
    spawnedBots = 0,
    startBotsInterval = null,
    statusInterval = null,
    moveInterval = null,
    shutdownInterval = null;

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
    if (ws && ws.readyState === WebSocket.OPEN) {
        try { ws.send(data) } catch (e) {}
    }
}

function decodeName(name) {
    try { return decodeURIComponent(escape(name)) } catch (e) { return name }
}

function isValidToken(token) {
    return typeof token === 'string' && token !== '0' && /^[\x21-\x7e]{1,8192}$/.test(token)
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
    sendToUser(Buffer.from([12]))
    console.log('[SERVER] The game server asks for a captcha, bots wait for tokens')
}

// Leaves captcha mode and spawns the waiting bots with '0' (except = the bot
// that is spawning right now).
function exitCaptchaMode(except) {
    if (!session.captchaRequired) return
    session.captchaRequired = false
    console.log('[SERVER] Captcha mode ended, bots spawn with token 0 again')
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

function clamp8(value) {
    return Math.max(0, Math.min(255, value | 0))
}

// Host part of the cipher key, like the client's generateClientKey:
// hostname + pathname without a trailing slash. null when the URL is not an
// agar.io game server (live-arena-*.agar.io).
function gameHost(url) {
    try {
        const u = new URL(url)
        if (!/^wss?:$/.test(u.protocol) || !/^live-arena-[a-z0-9.-]+\.agar\.io$/i.test(u.hostname)) return null
        return u.hostname + u.pathname.replace(/\/$/, '')
    } catch (e) {
        return null
    }
}

// Control connections are accepted from these pages (and from tools without an Origin).
function isAllowedOrigin(origin) {
    if (!origin) return true
    return /^https:\/\/(www\.)?agar\.io$/.test(origin) ||
        origin === 'https://jimboy3100.github.io' ||
        /^https:\/\/(www\.)?legendmod\.ml$/.test(origin) ||
        /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
}

// The player's own cells are never a bot target (sendMode nick, opcode 7).
function isPlayerEntity(entity) {
    return !!user.nickName && entity.name === user.nickName
}

function calculateDistance(botX, botY, targetX, targetY) {
    return Math.hypot(targetX - botX, targetY - botY)
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
        this.connect()
    }
    reset() {
        this.markDead()
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
        this.wanderAngle = Math.random() * Math.PI * 2
        this.wanderExpiry = 0
        this.targetPelletId = 0
        this.lastSentX = 0
        this.lastSentY = 0
        this.isSplited = false
        this.fixX = 1
        this.fixY = 1
        this.orientFixed = false
        this.ghostCells = []
        this.offsetFixed = false
        this.offsetFixedAt = 0
        this.handshakeDone = false
        this.waitingToken = null
        this.spawnToken = null
    }
    connect() {
        this.reset()
        try {
            this.ws = new WebSocket(game.url, { origin: 'https://agar.io' })
        } catch (e) {
            this.ws = null
            console.log('[SERVER] Bot cannot connect:', e.message)
            this.scheduleReconnect()
            return
        }
		//this.ws.binaryType = 'arraybuffer';
        this.ws.onopen = this.onopen.bind(this)
        this.ws.onmessage = this.onmessage.bind(this)
        this.ws.onerror = this.onerror.bind(this)
        this.ws.onclose = this.onclose.bind(this)
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
        if (this.destroyed || this.reconnectTimeout || !session.active || stoppingBots) return
        const delay = Math.min(RECONNECT_MIN * Math.pow(2, this.reconnectAttempts), RECONNECT_MAX)
        this.reconnectAttempts++
        this.reconnectTimeout = setTimeout(() => {
            this.reconnectTimeout = null
            if (!this.destroyed && session.active && !stoppingBots) this.connect()
        }, delay)
    }
    send(buffer) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            if (this.encryptionKey) {
                buffer = algorithm.rotateBufferBytes(buffer, this.encryptionKey)
                this.encryptionKey = algorithm.rotateEncryptionKey(this.encryptionKey)
            }
            this.ws.send(buffer)
        }
    }
    canSpawn() {
        return !!(this.ws && this.ws.readyState === WebSocket.OPEN && this.handshakeDone && !stoppingBots && session.active)
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
        this.send(buffers.spawn(bots.name, token))
    }
    // Hands a queued token to this bot if it waits for one. Returns true when used.
    useToken() {
        if (!this.waitingToken || !this.canSpawn()) return false
        const token = takeToken()
        if (!token) return false
        if (this.waitingToken === 'v3') this.send(buffers.captchaV3(token))
        else {
            this.spawnToken = 'token'
            this.send(buffers.spawn(bots.name, token))
        }
        this.waitingToken = null
        return true
    }
    onopen() {
        this.send(buffers.protocolVersion(game.protocolVersion))
        this.send(buffers.clientVersion(game.clientVersion))
        if (!this.isConnected) {
            this.isConnected = true
            connectedBots++
        }
    }
    onmessage(message) {
        try {
            if (!Buffer.isBuffer(message.data)) return
            if (this.decryptionKey) message.data = algorithm.rotateBufferBytes(message.data, this.decryptionKey ^ game.clientVersion)
            this.handleBuffer(message.data)
        } catch (e) {
            console.log('[SERVER] Bot ignored a malformed packet:', e.message)
        }
    }
    onerror() {
        // close only the socket that failed, not a newer one after a reconnect
        const ws = this.ws
        setTimeout(() => {
            if (ws && (ws.readyState === WebSocket.CONNECTING || ws.readyState === WebSocket.OPEN)) ws.close()
        }, 1000)
    }
    onclose() {
        // Null the ws reference so GC can collect the socket
        this.detachSocket()
        this.reset()
        this.scheduleReconnect()
    }
    handleBuffer(buffer) {
        const reader = new Reader(buffer)
        switch (reader.readUint8()) {
            case 32:
                this.cellsIDs.push(reader.readUint32())
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
                        sendToUser(Buffer.from([0]))
                        user.startedBots = true
                        console.log('[SERVER] Bots started!')
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
                enterCaptchaMode()
                this.waitingToken = 'spawn'
                this.useToken()
                break
            case 87:
                // Captcha v3 required: answer with opcode 88 + token.
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
                if (!host) { console.log('[SERVER] Unexpected URL format:', game.url); return; }
                this.decryptionKey = decryptionKey
                this.encryptionKey = murmur2(host + reader.readString(), 255)
                break
            }
            case 242:
                this.handshakeDone = true
                if (this.waitingToken) this.useToken()
                else this.trySpawn()
                break
            case 255: {
                const compressedSize = reader.readUint32()
                if (compressedSize > 1048576) break // 1MB safety cap
                this.handleCompressedBuffer(algorithm.uncompressBuffer(reader.buffer.slice(5), Buffer.allocUnsafe(compressedSize)))
                break
            }
        }
    }
    handleCompressedBuffer(buffer) {
        if (!Buffer.isBuffer(buffer)) return // uncompressBuffer returns a negative number on bad input
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
    // relative to this connection's map centre.
    updateGhostCells(reader) {
        if (!this.offsetFixed) return
        const length = reader.readUint16()
        const cells = []
        for (let i = 0; i < length; i++) {
            const x = reader.readInt32()
            const y = reader.readInt32()
            const mass = reader.readUint32()
            reader.byteOffset += 1
            cells.push({ x: x - this.offsetX, y: y - this.offsetY, mass })
        }
        this.ghostCells = cells
        this.detectOrientation()
    }
    // The top players (ghost cells) are the same players on the player's and on
    // this bot's connection, so their distance from the map centre must match
    // per axis, either as is (same) or with the sign flipped (mirrored).
    detectOrientation() {
        if (this.orientFixed || !this.offsetFixed) return
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
    }
    // No decision 10 s after the map border was known: keep today's 1/1.
    checkOrientationFallback() {
        if (!this.orientFixed && this.offsetFixed && Date.now() - this.offsetFixedAt >= 10000) this.orientFixed = true
    }
    updateViewportEntities(reader) {
        const eatRecordLength = reader.readUint16()
        for (let i = 0; i < eatRecordLength; i++) reader.byteOffset += 8
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
        for (let i = 0; i < removeRecordLength; i++) {
            const removedEntityID = reader.readUint32()
            if (this.cellsIDs.includes(removedEntityID)) this.cellsIDs.splice(this.cellsIDs.indexOf(removedEntityID), 1)
            delete this.viewportEntities[removedEntityID]
        }
        if (this.isAlive && this.cellsIDs.length === 0) {
            // Died: respawn with the same token rule as the first spawn
            this.markDead()
            this.trySpawn()
        }
    }
    updateOffset(reader){
        const left = reader.readDouble()
        const top = reader.readDouble()
        const right = reader.readDouble()
        const bottom = reader.readDouble()
        if(~~(right - left) === 14142 && ~~(bottom - top) === 14142){
            this.offsetX = (left + right) / 2
            this.offsetY = (top + bottom) / 2
            if (!this.offsetFixed) {
                this.offsetFixed = true
                this.offsetFixedAt = Date.now()
            }
        }
    }
    getClosestEntity(type, bot){
        let closestDistance = Infinity
        let closestEntity = null
        for(const entity of Object.values(this.viewportEntities)){
            let isConditionMet = false
            switch(type){
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
            if(isConditionMet){
                var distance = calculateDistance(bot.x, bot.y, entity.x, entity.y)
                // Subtract sizes for clever distance estimation
                distance = distance - bot.size - entity.size
                if(distance < closestDistance){
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
    sendPosition(x, y){
        // Smooth direction: lerp toward the new target so the visual rotation is stable
        var lerpFactor = 0.35;
        if (this.lastSentX === 0 && this.lastSentY === 0) {
            this.lastSentX = x;
            this.lastSentY = y;
        } else {
            this.lastSentX += (x - this.lastSentX) * lerpFactor;
            this.lastSentY += (y - this.lastSentY) * lerpFactor;
        }
        this.send(buffers.move(~~this.lastSentX, ~~this.lastSentY, this.decryptionKey));
    }
    sendPositionDirect(x, y){
        // No smoothing — for urgent actions like split-kill
        this.lastSentX = x;
        this.lastSentY = y;
        this.send(buffers.move(~~x, ~~y, this.decryptionKey));
    }
    move(){
        this.checkOrientationFallback()
        const bot = {
            x: 0,
            y: 0,
            size: 0,
            biggestCellsize: 0,
            smallestCellsize: 12000
        }
        for(const id of this.cellsIDs){
            const cell = this.viewportEntities[id]
            if(cell){
                bot.x += cell.x / this.cellsIDs.length
                bot.y += cell.y / this.cellsIDs.length
                bot.size += cell.size
                if(cell.size > bot.biggestCellsize) bot.biggestCellsize = cell.size
                if(cell.size < bot.smallestCellsize) bot.smallestCellsize = cell.size
            }
        }
        const closestVirus = this.getClosestEntity('virus', bot)
        const closestBiggerPlayer = this.getClosestEntity('biggerPlayer', bot)
        const closestPellet = this.getClosestEntity('pellet', bot)
        const closestVictimPlayer = this.getClosestEntity('upperhand', bot)
        if(user.isAlive && this.followMouse && !stoppingBots && !bots.ai){
            this.sendPosition(user.mouseX * this.fixX + this.offsetX, user.mouseY * this.fixY + this.offsetY)
        } else {
            // AI Handling — smooth directional movement
            if(closestVirus.entity && closestVirus.distance < 125){
                const angle = (Math.atan2(closestVirus.entity.y - bot.y, closestVirus.entity.x - bot.x) + Math.PI) % (2 * Math.PI)
                this.sendPosition(bot.x + 14142 * Math.cos(angle), bot.y + 14142 * Math.sin(angle))
            }
            else if(closestBiggerPlayer.entity && closestBiggerPlayer.distance < 760){
                const angle = (Math.atan2(closestBiggerPlayer.entity.y - bot.y, closestBiggerPlayer.entity.x - bot.x) + Math.PI) % (2 * Math.PI)
                this.sendPosition(bot.x + 14142 * Math.cos(angle), bot.y + 14142 * Math.sin(angle))
            }
            else if(closestVictimPlayer.entity && closestVictimPlayer.distance < 320){
                if(!this.isSplited){
                    this.isSplited = true
                    this.sendPositionDirect(closestVictimPlayer.entity.x, closestVictimPlayer.entity.y)
                    this.send(Buffer.from([17]))
                }
                else if(this.isSplited){ this.isSplited = false }
            }// End of AI Handling
            else if(closestPellet.entity){
                // Persistent pellet targeting for stable direction
                var pellet = closestPellet.entity
                if(this.targetPelletId && this.viewportEntities[this.targetPelletId]) {
                    var kept = this.viewportEntities[this.targetPelletId]
                    var keptDist = calculateDistance(bot.x, bot.y, kept.x, kept.y)
                    if(kept.isPellet && keptDist < closestPellet.distance * 1.5) pellet = kept
                }
                this.targetPelletId = pellet.id
                this.sendPosition(pellet.x, pellet.y)
            }
            else {
                // Random wander
                var now = Date.now()
                if(now > this.wanderExpiry) {
                    this.wanderAngle += (Math.random() - 0.5) * Math.PI * 0.8
                    this.wanderExpiry = now + 2000 + ~~(Math.random() * 3000)
                }
                var wanderDist = 800 + ~~(Math.random() * 500)
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
    console.log('[SERVER] Session ended. Ready for new connection.')
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
        if (ws) sendTo(ws, Buffer.from([2]))
        return
    }
    if (stoppingBots) return
    stoppingBots = true
    if (ws) sendTo(ws, Buffer.from([1]))
    let seconds = 0
    if (shutdownInterval) clearInterval(shutdownInterval)
    shutdownInterval = setInterval(() => {
        if (seconds === 1) {
            clearInterval(shutdownInterval)
            shutdownInterval = null
            if (ws) sendTo(ws, Buffer.from([2]))
            resetServer()
        } else {
            console.log(`[SERVER] Stopping bots in ${1 - seconds} seconds`)
            seconds++
        }
    }, 1000)
}

// {"message":"botscode","msg":JSON.stringify(token)}. Token contents are never logged.
function handleTokenMessage(text) {
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
        console.log('[SERVER] Ignored a malformed token message')
        return
    }
    addToken(token)
}

function handleUserMessage(ws, data) {
    if (ws !== userWS) return // a replaced client
    try {
        if (Array.isArray(data)) data = Buffer.concat(data)
        else if (data instanceof ArrayBuffer) data = Buffer.from(data)
        if (typeof data === 'string' || (Buffer.isBuffer(data) && data[0] === 123)) {
            handleTokenMessage(data.toString())
            return
        }
        if (!Buffer.isBuffer(data) || !data.length) return
        const buffer = data
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
                    sendTo(ws, Buffer.from([13]))
                    sendTo(ws, Buffer.from([2]))
                    console.log('[SERVER] Game server not supported by bots:', url)
                    break
                }
                game.url = url
                game.protocolVersion = protocolVersion
                game.clientVersion = clientVersion
                console.log('[SERVER] Server:', game.url, ' protocol version:', game.protocolVersion, ' client version: ', game.clientVersion)
                user.isAlive = isAlive
                bots.name = name
                bots.displayName = decodeName(name)
                bots.amount = amount
                session.active = true
                session.captchaRequired = false
                stoppingBots = false
                if (startBotsInterval) clearInterval(startBotsInterval)
                startBotsInterval = setInterval(addBotTick, 150)
                console.log('[SERVER] Starting bots...')
                break
            }
            case 1:
                beginShutdown(ws)
                break
            case 2:
                for (const bot of userBots) {
                    if (bot.isAlive && bot.followMouse && !stoppingBots && !bots.ai) bot.send(Buffer.from([17])) //sendSplit
                }
                break
            case 3:
                for (const bot of userBots) {
                    if (bot.isAlive && bot.followMouse && !stoppingBots && !bots.ai) bot.send(Buffer.from([21])) //sendEject
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
                    if (!bot.orientFixed) bot.detectOrientation()
                }
                break
            }
            case 7:
                // sendMode: 7, 1, player's nick, 0. Other opcode 7 forms (old token path) are ignored.
                if (buffer.length >= 3 && reader.readUint8() === 1) user.nickName = decodeName(reader.readString())
                break
        }
    } catch (e) {
        console.log('[SERVER] Malformed control message:', e.message)
    }
}

function onUserConnection(ws) {
    // A new client takes over: the previous client is told its bots stopped (2)
    if (userWS && userWS !== ws) {
        sendTo(userWS, Buffer.from([2]))
        if (session.active) resetServer()
    }
    // Clear any previous status interval before creating a new one
    if (statusInterval) { clearInterval(statusInterval); statusInterval = null; }
    statusInterval = setInterval(() => {
        sendToUser(Buffer.from([4, clamp8(connectedBots), clamp8(spawnedBots)]))
        // the protocol gives no server player total (54 is the top-10 leaderboard): 0 = unknown
        sendToUser(Buffer.from([5, 0]))
    }, 1000);
    userWS = ws
    console.log('[SERVER] User connected!')
    ws.on('error', () => {})
    ws.on('message', data => handleUserMessage(ws, data))
    ws.on('close', () => {
        if (ws !== userWS) return // an older client that was already replaced
        // Clean up status interval on disconnect
        if (statusInterval) { clearInterval(statusInterval); statusInterval = null; }
        userWS = null
        // End the session now: bots, timers, captcha mode, orientation reference
        if (session.active || stoppingBots) resetServer()
        console.log('[SERVER] User disconnected!')
    })
}

function start(port = PORT) {
    console.log('[SERVER] Server has started. Awaiting user connection...');
    return new WebSocket.Server({ port, verifyClient: info => isAllowedOrigin(info.origin) }).on('connection', onUserConnection)
}

module.exports = {
    Bot, game, user, bots, session, userBots,
    gameHost, isAllowedOrigin,
    addToken, takeToken, enterCaptchaMode, checkCaptchaExpiry, addBotTick, beginShutdown, resetServer,
    handleUserMessage, onUserConnection, start,
    state: () => ({ userWS, stoppingBots, connectedBots, spawnedBots, startBotsInterval, moveInterval, shutdownInterval })
}

if (require.main === module) start()
