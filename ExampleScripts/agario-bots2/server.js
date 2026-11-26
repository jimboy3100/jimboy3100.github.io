// These bots are working with www.jimboy3100.github.io extension or agar.io
// version 1.3 version B
// creator Jimboy3100

// Url https://repl.it/@legendmod/party-bots
// Websocket wss://party-bots--legendmod.repl.co

// By comparing Url and Websocket, imagine how your websocket should below
// If repl.it not loading, wait or make a new repo. Sometimes repl.it bugs
// TLS: only skip cert verification on request-promise calls to agar.io proxies
// (they use self-signed certs). Do NOT globally disable TLS via process.env.
const WebSocket = require('ws'),
    { murmur2 } = require('murmurhash-js'),
    buffers = require('./buffers'),
    algorithm = require('./algorithm'),
    Reader = require('./reader'),
    Entity = require('./entity'),
    requester = require("request-promise").defaults({
    strictSSL: false,
    rejectUnauthorized: false
 }),
    logger = require("./logger.js"),
    config = require('./config.json');

global.globalData=[];
global.globalDataCounter=0;
const userBots = [];
let userWS = null,
    stoppingBots = false,
    connectedBots = 0,
    spawnedBots = 0,
    serverPlayers = 0,
    startBotsInterval = null,
    statusInterval = null,
    moveInterval = null;

logger.warn(`[SERVER]: If error occurs on port ${config.server.port} try 8083 on config.json and websocket`);
if (config.server.update) {
    requester(config.server.link, (err, req, data) => {
        if (err) { logger.error('[SERVER]: Update check failed:', err.message); return; }
        try {
            const requesterData = Buffer.from(data).toString()
            const requesterConfig = JSON.parse(requesterData)

            if (config.server.version < requesterConfig.server.version) {
                logger.warn('[SERVER]: A new update was found!')
                logger.warn('[SERVER]: Download -> https://jimboy3100.github.io/ExampleScripts/agario-bots2')
            } else {
                logger.good('[SERVER]: No updates found!')
            }
        } catch (e) {
            logger.error('[SERVER]: Update check: invalid response:', e.message)
        }
    })
} else {
    logger.error('[SERVER]: Update is false!')
}

logger.good(`[SERVER]: Running version ${config.server.version} on port ${config.server.port}`)

const game = {
    url: '',
    protocolVersion: 0,
    clientVersion: 0
}

const user = {
    ws: null,
    bots: [],
    startedBots: false,
    stoppingBots: false,
    isAlive: false,
    mouseX: 0,
    mouseY: 0,
    // Player's absolute world position (from client opcode 7)
    playerX: 0,
    playerY: 0
}

const bots = {
    name: '',
    amount: 0,
    ai: false
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
        this.ws = new WebSocket(game.url, { origin: 'https://agar.io' })
		//this.ws.binaryType = 'arraybuffer';
        this.ws.onopen = this.onopen.bind(this)
        this.ws.onmessage = this.onmessage.bind(this)
        this.ws.onclose = this.onclose.bind(this)
    },
    send(buffer) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) this.ws.send(buffer)
    },
    onopen() {
        this.send(buffers.protocolVersion(game.protocolVersion))
        this.send(buffers.clientVersion(game.clientVersion))

    },
    onmessage(message) {
        if (this.buffersKey) message.data = algorithm.rotateBufferBytes(message.data, this.buffersKey)
        this.handleBuffer(message.data)
    },
    onclose() {
        if (this.isConnected) {
            this.isConnected = false
            this.connect()
            logger.error('[SERVER]: DataBot disconnected!')
        }
    },
    handleBuffer(buffer) {
        const reader = new Reader(buffer)
        switch (reader.readUint8()) {
            case 54:
                this.playersAmount = 0
                serverPlayers = 0;
                reader.byteOffset += 2
                while (reader.byteOffset < reader.buffer.byteLength) {
                    const flags = reader.readUint8()
                    if (flags & 2) reader.readString()
                    if (flags & 4) reader.byteOffset += 4
                    this.playersAmount++
                        serverPlayers++
                }
                this.lastPlayersAmount = this.playersAmount

                break
            case 241:
                this.buffersKey = reader.readInt32() ^ game.clientVersion
                this.isConnected = true
                logger.good('[SERVER]: DataBot connected!')
                break
        }
    }
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
        this.gotCaptcha = false
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
        this.connect()
    }
    reset() {
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
        this.wanderAngle = Math.random() * Math.PI * 2
        this.wanderExpiry = 0
        this.targetPelletId = 0
        this.lastSentX = 0
        this.lastSentY = 0
        this.isSplited = false
    }
    connect() {
        this.reset()
        this.ws = new WebSocket(game.url, { origin: 'https://agar.io' })
		//this.ws.binaryType = 'arraybuffer';
        this.ws.onopen = this.onopen.bind(this)
        this.ws.onmessage = this.onmessage.bind(this)
        this.ws.onerror = this.onerror.bind(this)
        this.ws.onclose = this.onclose.bind(this)
    }
    send(buffer) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            if (this.encryptionKey) {
                buffer = algorithm.rotateBufferBytes(buffer, this.encryptionKey)
                this.encryptionKey = algorithm.rotateEncryptionKey(this.encryptionKey)
            }
            this.ws.send(buffer)
			//console.log(buffer)
        }
    }
    onopen() {
        this.send(buffers.protocolVersion(game.protocolVersion))
        this.send(buffers.clientVersion(game.clientVersion))
        this.isConnected = true
        connectedBots++
    }
    onmessage(message) {
        if (this.decryptionKey) message.data = algorithm.rotateBufferBytes(message.data, this.decryptionKey ^ game.clientVersion)
        this.handleBuffer(message.data)
    }
    onerror() {
        setTimeout(() => {
            if (this.ws && (this.ws.readyState === WebSocket.CONNECTING || this.ws.readyState === WebSocket.OPEN)) this.ws.close()
        }, 1000)
    }
    onclose() {
        if (this.isConnected) {
            this.isConnected = false
            connectedBots--
            if (this.followMouseTimeout) {
                clearTimeout(this.followMouseTimeout)
                this.followMouseTimeout = null
            }
            this.followMouse = false
        }
        // Null the ws reference so GC can collect the socket
        if (this.ws) {
            this.ws.onmessage = null
            this.ws.onerror = null
            this.ws.onclose = null
            this.ws = null
        }
    }
	handletokens(){
				var temp;
				var i=0;
				if (global.globalData.length>300) i = global.globalData.length - 300
				for (;i<global.globalData.length;i++){
					if (global.globalData[i]) temp = i
				}
				if (global.globalData[temp]){
					//console.log(bots.name)
					this.send(buffers.spawn(bots.name,global.globalData[temp]))
					global.globalData[temp] = null
				}
				else{
					//this.send(buffers.spawn2(bots.name))
					//this.gotCaptcha = true
					if (userBots.includes(this)){
						userBots.splice(userBots.indexOf(this), 1)
						//userBots.push(new Bot()) 						
					}
					if (this.isConnected) connectedBots--
					if (this.ws) { this.ws.onmessage = null; this.ws.onerror = null; this.ws.onclose = null; this.ws.close(); }
					this.reset()
					
				}	
	}
    handleBuffer(buffer) {
        const reader = new Reader(buffer)
        switch (reader.readUint8()) {			
            case 32:
                this.cellsIDs.push(reader.readUint32())
                if (!this.isAlive) {
                    this.isAlive = true
                    spawnedBots++
                    //userWS.send(Buffer.from([6, spawnedBots]))
                    if (!user.startedBots) {
                        if (!moveInterval) {
                            moveInterval = setInterval(() => {
                                for (const bot of userBots) {
                                    if (bot.isAlive) bot.move()
                                }
                            }, 40)
                        }
                        userWS.send(Buffer.from([0]))
                        user.startedBots = true
                        logger.good('[SERVER]: Bots started!')
                    }
                    if (!this.followMouseTimeout) {
                        this.followMouseTimeout = setTimeout(() => {
                            if (this.isAlive) this.followMouse = true
                        }, 18000)
                    }
                }
                break
            case 85:
                /*if (!user.startedBots) {
                    userWS.send(Buffer.from([3]))
                    setTimeout(process.exit, 1000)
                }*/
				if (userBots.includes(this)){
					userBots.splice(userBots.indexOf(this), 1)
                    userBots.push(new Bot())     
				}				
                this.gotCaptcha = true
                this.ws.onmessage = null
                this.reset()
                break
			case 102:
				//console.log('case 102')
                //this.handletokens()
                //break			
            case 241:
                this.decryptionKey = reader.readInt32()
				const urlMatch = game.url.match(/(live-arena-([\w\d]+(\.tech)?)\.agar\.io)/)
				if (!urlMatch) { logger.error('[SERVER]: Unexpected URL format:', game.url); return; }
				this.encryptionKey = murmur2(`${urlMatch[1]}${reader.readString()}`, 255) 
                //this.encryptionKey = murmur2(`${game.url.match(/(live-arena-\w+\.agar\.io)/)[1]}${reader.readString()}`, 255) //original
				//this.encryptionKey = murmur2(`${game.url.match(/(live-arena-\w+\.tech+\.agar\.io)/)[1]}${reader.readString()}`, 255)		
                this.isConnected = true
                break
            case 242:
				//console.log('case 242')
				this.handletokens()
                //this.send(buffers.spawn(bots.name))
                break
            case 255:
                const compressedSize = reader.readUint32()
                if (compressedSize > 1048576) break // 1MB safety cap
                this.handleCompressedBuffer(algorithm.uncompressBuffer(reader.buffer.slice(5), Buffer.allocUnsafe(compressedSize)))
                break
        }		
    }
    handleCompressedBuffer(buffer) {
        const reader = new Reader(buffer)
        switch (reader.readUint8()) {
            case 16:
                this.updateViewportEntities(reader)
                break
            case 64:
                this.updateOffset(reader)
                break
        }
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
            if (flags & 8) entity.name = decodeURIComponent(escape(reader.readString()))
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
            this.isAlive = false
            spawnedBots--
            //	userWS.send(Buffer.from([6, spawnedBots]))
            if (this.followMouseTimeout) {
                clearTimeout(this.followMouseTimeout)
                this.followMouseTimeout = null
            }
            this.followMouse = false
				this.handletokens()		
            //this.send(buffers.spawn(bots.name))
        }
    }
    updateOffset(reader) {
        const left = reader.readDouble()
        const top = reader.readDouble()
        const right = reader.readDouble()
        const bottom = reader.readDouble()
        if (~~(right - left) === 14142 && ~~(bottom - top) === 14142) {
            this.offsetX = (left + right) / 2
            this.offsetY = (top + bottom) / 2
        }
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
					isConditionMet = (!entity.isVirus && !entity.isPellet && entity.size > bot.size * 1.15 && entity.name !== bots.name)
                    break
                case 'pellet':
                    isConditionMet = !entity.isVirus && entity.isPellet
                    break					
				case 'upperhand':
					isConditionMet = !entity.isVirus && !entity.isPellet && entity.size < bot.smallestCellsize * 1.4 && entity.size > bot.size / 10 && bot.size > 120 && this.cellsIDs.length == 1
					break
            }
            if (isConditionMet) {
                var distance = calculateDistance(bot.x, bot.y, entity.x, entity.y)
                //add sizes CLEVER BOTS
				distance = distance - bot.size - entity.size //assume that distance is getting smaller with bigger cells
				
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
    move() {
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
            this.sendPosition(user.mouseX + this.offsetX, user.mouseY + this.offsetY)
        } else {
			// AI Handling — smooth directional movement
			if (closestVirus.entity && closestVirus.distance < 125){
                const angle = (Math.atan2(closestVirus.entity.y - bot.y, closestVirus.entity.x - bot.x) + Math.PI) % (2 * Math.PI)
                this.sendPosition(bot.x + 14142 * Math.cos(angle), bot.y + 14142 * Math.sin(angle))
			}
			else if (closestBiggerPlayer.entity && closestBiggerPlayer.distance < 760) {
                const angle = (Math.atan2(closestBiggerPlayer.entity.y - bot.y, closestBiggerPlayer.entity.x - bot.x) + Math.PI) % (2 * Math.PI)
                this.sendPosition(bot.x + 14142 * Math.cos(angle), bot.y + 14142 * Math.sin(angle))
            }
			else if (closestVictimPlayer.entity && closestVictimPlayer.distance < 320){
				if (!this.isSplited){
					this.isSplited = true
					this.sendPositionDirect(closestVictimPlayer.entity.x, closestVictimPlayer.entity.y)
					this.send(Buffer.from([17]))
                }
				else if (this.isSplited){ this.isSplited = false}
			}// End of AI Handling
			else if (closestPellet.entity) {
				// Persistent pellet targeting: keep chasing the same pellet for stable direction
				var pellet = closestPellet.entity
				if (this.targetPelletId && this.viewportEntities[this.targetPelletId]) {
					var kept = this.viewportEntities[this.targetPelletId]
					var keptDist = calculateDistance(bot.x, bot.y, kept.x, kept.y)
					// Keep the old pellet if it is within 1.5x the closest pellet distance
					if (kept.isPellet && keptDist < closestPellet.distance * 1.5) pellet = kept
				}
				this.targetPelletId = pellet.id
				this.sendPosition(pellet.x, pellet.y)
			}
            else {
				// Smart wandering: orbit near the player if alive, otherwise random
				var now = Date.now()
				if (now > this.wanderExpiry) {
					this.wanderAngle += (Math.random() - 0.5) * Math.PI * 0.8
					this.wanderExpiry = now + 2000 + ~~(Math.random() * 3000)
				}
				if (user.isAlive && (user.playerX !== 0 || user.playerY !== 0)) {
					// Convert player's absolute position to bot's local coordinates
					var playerLocalX = user.playerX + this.offsetX
					var playerLocalY = user.playerY + this.offsetY
					var distToPlayer = calculateDistance(bot.x, bot.y, playerLocalX, playerLocalY)
					if (distToPlayer > 2000) {
						// Too far from player: move directly toward them
						this.sendPosition(playerLocalX, playerLocalY)
					} else if (distToPlayer > 400) {
						// Near player: orbit around them using wander angle
						var orbitDist = 600 + ~~(Math.random() * 300)
						this.sendPosition(playerLocalX + orbitDist * Math.cos(this.wanderAngle), playerLocalY + orbitDist * Math.sin(this.wanderAngle))
					} else {
						// Very close: gentle random drift around player
						var driftDist = 200 + ~~(Math.random() * 200)
						this.sendPosition(bot.x + driftDist * Math.cos(this.wanderAngle), bot.y + driftDist * Math.sin(this.wanderAngle))
					}
				} else {
					// No player position known: original random wander
					var wanderDist = 800 + ~~(Math.random() * 500)
					this.sendPosition(bot.x + wanderDist * Math.cos(this.wanderAngle), bot.y + wanderDist * Math.sin(this.wanderAngle))
				}
            }
        }
    }
}

let shutdownInterval = null

new WebSocket.Server({
    port: config.server.port
}).on('connection', ws => {
    // Clear any previous status interval before creating a new one
    if (statusInterval) { clearInterval(statusInterval); statusInterval = null; }
    statusInterval = setInterval(() => {
        if (userWS && userWS.readyState === WebSocket.OPEN) {
            userWS.send(Buffer.from([4, connectedBots, spawnedBots]))
            userWS.send(Buffer.from([5, serverPlayers]))
            // Opcode 9: send alive bot positions (absolute world coords) so the
            // client can display them as ghost cells on the minimap.
            // Format: [9, count, x1(i32), y1(i32), x2(i32), y2(i32), ...]
            var aliveBots = []
            for (var bi = 0; bi < userBots.length; bi++) {
                var b = userBots[bi]
                if (!b.isAlive || b.cellsIDs.length === 0) continue
                var bx = 0, by = 0
                for (var ci = 0; ci < b.cellsIDs.length; ci++) {
                    var cell = b.viewportEntities[b.cellsIDs[ci]]
                    if (cell) { bx += cell.x; by += cell.y }
                }
                if (b.cellsIDs.length > 0) {
                    bx = ~~(bx / b.cellsIDs.length)
                    by = ~~(by / b.cellsIDs.length)
                }
                // Convert from bot-local to absolute world coords (subtract bot's offset)
                aliveBots.push({ x: bx - b.offsetX, y: by - b.offsetY })
            }
            var posBuf = Buffer.alloc(2 + aliveBots.length * 8)
            posBuf.writeUInt8(9, 0)
            posBuf.writeUInt8(Math.min(aliveBots.length, 255), 1)
            for (var pi = 0; pi < aliveBots.length && pi < 255; pi++) {
                posBuf.writeInt32LE(aliveBots[pi].x, 2 + pi * 8)
                posBuf.writeInt32LE(aliveBots[pi].y, 2 + pi * 8 + 4)
            }
            userWS.send(posBuf)
        }
    }, 1000);
    userWS = ws
    logger.good('[SERVER]: User connected!')
    ws.on('message', buffer => {
		var bufStr = buffer.toString()
		if (bufStr.includes('"message"')){
			try {
				var data = JSON.parse(bufStr).msg;
				var temp = Object.values(JSON.parse(data))
				global.globalDataCounter++;
				global.globalData[global.globalDataCounter]=temp.join("")

				if (dataBot.lastPlayersAmount < 195 && connectedBots < bots.amount && user.startedBots){
					userBots.push(new Bot())
				}
			} catch (e) {
				logger.error('[SERVER]: Malformed control message:', e.message)
			}
		}
		else{
        const reader = new Reader(buffer)
        switch (reader.readUint8()) {
            case 0:
                if (!user.startedBots) {
                    game.url = reader.readString()
                    game.protocolVersion = reader.readUint32()
                    game.clientVersion = reader.readUint32()
					logger.good('[SERVER]: Server:', game.url, ' protocol version:', game.protocolVersion, ' client version: ', game.clientVersion)
                    user.isAlive = !!reader.readUint8()
					bots.name = reader.readString()
                    bots.amount = reader.readUint8()
                    dataBot.connect()
                    if (startBotsInterval) clearInterval(startBotsInterval)
                    startBotsInterval = setInterval(() => {
                        if (dataBot.lastPlayersAmount < 195 && connectedBots < bots.amount && !stoppingBots) userBots.push(new Bot())
                    }, 150)
                    logger.good('[SERVER]: Starting bots...')
                }
                break
            case 1:
                if (user.startedBots && !stoppingBots) {
                    stoppingBots = true
                    ws.send(Buffer.from([1]))
                    let seconds = 0
                    if (shutdownInterval) clearInterval(shutdownInterval)
                    shutdownInterval = setInterval(() => {
                        if (seconds === 1) {
                            ws.send(Buffer.from([2]))
                            clearInterval(shutdownInterval)
                            shutdownInterval = null
                            setTimeout(process.exit, 1000)
                        } else {
                            logger.warn(`[SERVER]: Stopping bots in ${1 - seconds} seconds`)
                            seconds++
                        }
                    }, 1000)
                }
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
            case 7:
                // Player's absolute world position (for AI bots to orbit near the player)
                user.playerX = reader.readInt32()
                user.playerY = reader.readInt32()
                break
        }
		}
    })
    ws.on('close', () => {
        // Clean up status interval on disconnect
        if (statusInterval) { clearInterval(statusInterval); statusInterval = null; }
        if (user.startedBots && !stoppingBots) {
            stoppingBots = true
            let seconds = 0
            if (shutdownInterval) clearInterval(shutdownInterval)
            shutdownInterval = setInterval(() => {
                if (seconds === 1) {
                    clearInterval(shutdownInterval)
                    shutdownInterval = null
                    process.exit()
                }
                else {
                    logger.warn(`[SERVER]: Stopping bots in ${1 - seconds} seconds`)
                    seconds++
                }
            }, 1000)
        }
        userWS = null
        logger.error('[SERVER]: User disconnected!')
    })
})
