/* Url: https://repl.it/@jimboy3100/CaptchaSenderBots
 Websocket: wss://CaptchaSenderBots--jimboy3100.repl.co

Make your own repl.it Websocket in the same way after testing 

If you get captcha here, it will be because of the many testers
You will not get captcha on your own VPS if you STOP bots properly 

REMEMBER: BEFORE CHANGING SERVER, First stop BOTS and wait 30 seconds, then change server, run this server and connect to bots

IF YOU GET RECAPTCHA, NO PROBLEM...
Fork this script, and use names agario-bots1, agarbots2 etc...
Example https://repl.it/@jimboy3100/agario-bots1
Websocket: wss://agario-bots1--jimboy3100.repl.co

Captcha's go away after some time. Use 10 websockets for your daily bot needs :D. 


*/
let myIP
let agarIP
global.botinterval
const WebSocket = require('ws'),
    {
        murmur2
    } = require('murmurhash-js'),
    buffers = require('./buffers'),
    algorithm = require('./algorithm'),
    Reader = require('./reader'),
    Entity = require('./entity'),
    requester = require("request-promise"),
    logger = require("./logger.js"),
    config = require('./config.json');
require('dns').lookup(require('os').hostname(), function(err, add, fam) {
    myIP = add
    logger.warn('[SERVER] Server side IP: ' + add);
})

const userBots = [];
let userWS = null,
    stoppingBots = false,
    connectedBots = 0,
    spawnedBots = 0,
    serverPlayers = 0,
    mapSize = 14142,
    timersplit = false;

if (config.server.update) {
    requester(config.server.link, (err, req, data) => {
        const requesterData = Buffer.from(data).toString()
        requesterConfig = JSON.parse(requesterData)

        if (config.server.version < requesterConfig.server.version) {
            logger.warn(`[SERVER] A new update was found!`)
            logger.warn(`[SERVER] Download -> https://jimboy3100.github.io/ExampleScripts/agario-bots2/`)
        } else {
            logger.good(`[SERVER] No updates found!`)
        }
    })
} else {
    logger.error('[SERVER] Update is false!')
}

logger.good(`[SERVER] Running version ${config.server.version} on port ${config.server.port}`)

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
    mouseY: 0
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
        this.ws = new WebSocket(game.url)
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
            logger.error('[SERVER] DataBot disconnected!')
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
                logger.good('[SERVER] DataBot connected!')
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
    }
    connect() {
        this.reset()
        this.ws = new WebSocket(game.url)
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
            if (this.ws.readyState === WebSocket.CONNECTING || this.ws.readyState === WebSocket.OPEN) this.ws.close()
        }, 1000)
    }
    onclose() {
        if (this.isConnected) {
            this.isConnected = false
            connectedBots--
            //userWS.send(Buffer.from([4, connectedBots, spawnedBots, serverPlayers]))
            //if(!this.gotCaptcha) setTimeout(this.connect.bind(this), 1000)
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
                        setInterval(() => {
                            for (const bot of userBots) {
                                if (bot.isAlive) bot.move()
                            }
                        }, 40)
                        userWS.send(Buffer.from([0]))
                        user.startedBots = true
                        logger.good('[SERVER] Bots started!')
                    }
                    if (!this.followMouseTimeout) {
                        this.followMouseTimeout = setTimeout(() => {
                            if (this.isAlive) this.followMouse = true
                        }, 18000)
                    }
                }
                break
            case 85:
                if (!user.handleCaptcha) { 
                    if (!user.startedBots) {
                        userWS.send(Buffer.from([3]))
                        setTimeout(process.exit, 1000)
                    }
                    this.gotCaptcha = true
                    this.ws.onmessage = null
                    this.reset()
                    setTimeout(() => {
                        userBots.push(new Bot())
                        if (userBots.includes(this)) userBots.splice(userBots.indexOf(this), 1)
                    }, 2000)
                } 
				else {
					if (bots.captchabots>0){
						console.log(bots.captchabots)
						bots.captchabots--
						userWS.send(Buffer.from([3]))
						var self = this;
						global.botinterval2 = setInterval(myTimer2, 1000);
					}					
                    else if (!global.botinterval) {
                        userWS.send(Buffer.from([3]))
                        var self = this;
						global.botinterval = setInterval(myTimer, 1000);
						
                    }
					else {
                        logger.warn('Bot Captchad')
                        this.ws.onmessage = null
                        this.reset()
                    }
                    function myTimer2() {
                        if (bots.captchatokensolved) {
                            bots.captchatokensolved = false
							if (bots.captchabots>0){
                            clearInterval(global.botinterval2)
							}
							if (user.solveCaptcha){
                            botinterval2 = null
							}
                            self.send(buffers.sendRecaptcha(bots.captchatoken, self.decryptionKey))
                            self.gotCaptcha = false
                            setTimeout(() => {
                                if (userBots.includes(this)) userBots.splice(userBots.indexOf(this), 1)
                            }, 2000)
                        }
                    }	
                    function myTimer() {
                        if (bots.captchatokensolved) {
                            bots.captchatokensolved = false
                            clearInterval(global.botinterval)
							if (user.solveCaptcha){
                            botinterval = null
							}
                            self.send(buffers.sendRecaptcha(bots.captchatoken, self.decryptionKey))
                            self.gotCaptcha = false
                            setTimeout(() => {
                                if (userBots.includes(this)) userBots.splice(userBots.indexOf(this), 1)
                            }, 2000)
                        }
                    }				
                    this.gotCaptcha = true
                    bots.gotCaptcha = this.gotCaptcha
                }
                break
            case 103:
                this.accessTokenSent = true;
                break;
            case 241:
                this.decryptionKey = reader.readInt32()
                this.encryptionKey = murmur2(`${game.url.match(/(live-arena-\w+\.agar\.io)/)[1]}${reader.readString()}`, 255)
                this.isConnected = true
                break
            case 242:
                this.send(buffers.spawn(bots.name))
                break
            case 255:
                this.handleCompressedBuffer(algorithm.uncompressBuffer(reader.buffer.slice(5), Buffer.allocUnsafe(reader.readUint32())))
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
            //  userWS.send(Buffer.from([6, spawnedBots]))
            if (this.followMouseTimeout) {
                clearTimeout(this.followMouseTimeout)
                this.followMouseTimeout = null
            }
            this.followMouse = false
            this.send(buffers.spawn(bots.name))
        }
    }
    updateOffset(reader) {
        const left = reader.readDouble()
        const top = reader.readDouble()
        const right = reader.readDouble()
        const bottom = reader.readDouble()
        if (~~(right - left) === mapSize && ~~(bottom - top) === mapSize) {
            this.offsetX = (left + right) / 2
            this.offsetY = (top + bottom) / 2
        }
    }
    getClosestEntity(type, botX, botY, botSize, botMass) {
        let closestDistance = Infinity
        let closestEntity = null
        for (const entity of Object.values(this.viewportEntities)) {
            entity.mass = ~~(entity.size * entity.size / 100);
            let isConditionMet = false
            switch (type) {
                case 'virus':
                    isConditionMet = entity.isVirus && !entity.isPellet
                    break
                case 'biggerPlayer':
                    isConditionMet = !entity.isVirus && !entity.isPellet && entity.mass > botMass * 1.15 && entity.name !== bots.name
                    break
                case 'smallerPlayer':
                    isConditionMet = !entity.isVirus && !entity.isPellet && entity.mass < botMass * 2 * 1.30 && entity.mass > 100 && entity.name !== bots.name
                    break
                case 'smallerPlayerFollow':
                    isConditionMet = !entity.isVirus && !entity.isPellet && entity.mass < botMass * 1.30 && entity.mass > 50 && entity.name !== bots.name
                    break
                case 'bot':
                    isConditionMet = !entity.isVirus && !entity.isPellet && entity.mass > botMass * 1.30 && botMass > 90 && entity.name == bots.name
                    break
                case 'pellet':
                    isConditionMet = !entity.isVirus && entity.isPellet
                    break
            }
            if (isConditionMet) {
                const distance = calculateDistance(botX, botY, entity.x, entity.y)
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
        this.send(buffers.move(x, y, this.decryptionKey))
    }
    randomMove(bot) {
        const random = Math.random()
        const randomX = ~~(1337 * Math.random())
        const randomY = ~~(1337 * Math.random())
        if (random > 0.5) this.sendPosition(bot.x + randomX, bot.y - randomY)
        else if (random < 0.5) this.sendPosition(bot.x - randomX, bot.y + randomY)
    }
    typicalMove(bot, closestBiggerPlayer, closestPellet, closestSmallerPlayer, closestSmallerPlayerFollow, closestVirus, closestBiggerBot) {
        if (closestVirus.entity && closestVirus.distance < closestVirus.entity.size + bot.size / 2 + 75 && bot.mass > 125 && this.cellsIDs.length != 16) {
            const angle = (Math.atan2(closestVirus.entity.y - bot.y, closestVirus.entity.x - bot.x) + Math.PI) % (2 * Math.PI)
            this.sendPosition(mapSize * Math.cos(angle), mapSize * Math.sin(angle))
        } else if (closestBiggerPlayer.entity && closestBiggerPlayer.distance < 760 + closestBiggerPlayer.size) { //if big enemy is close, run
            const angle = (Math.atan2(closestBiggerPlayer.entity.y - bot.y, closestBiggerPlayer.entity.x - bot.x) + Math.PI) % (2 * Math.PI)
            this.sendPosition(mapSize * Math.cos(angle), mapSize * Math.sin(angle))
        }
        /*
		else if (closestSmallerPlayer.entity && closestSmallerPlayer.distance < 150 && closestSmallerPlayer.entity.mass > 100 && bot.mass > 300 && this.cellsIDs.length == 1 && !timersplit) { //if cell is 1,distance and mass is smaller than 300 and your cells mass>2.6*enemy mass, split
            this.sendPosition(closestSmallerPlayer.entity.x, closestSmallerPlayer.entity.y)
            timersplit = true;
			setTimeout(function() {
                timersplit = false;
            }, 1000)
            this.send(Buffer.from([17]))
        } 		
		else if (closestSmallerPlayerFollow.entity && closestSmallerPlayerFollow.distance < 420 && closestSmallerPlayerFollow.entity.mass > 50 && bot.mass > 100) { //if cell is 1,distance and mass is smaller than 430 and your cells mass>1.3*enemy mass, follow
            this.sendPosition(closestSmallerPlayerFollow.entity.x, closestSmallerPlayerFollow.entity.y)			
        } 	
		*/
        else if (closestBiggerBot.entity && closestBiggerBot.distance < 700) {
            this.sendPosition(closestBiggerBot.entity.x, closestBiggerBot.entity.y)
        } else if (closestPellet.entity) {
            this.sendPosition(closestPellet.entity.x, closestPellet.entity.y)
        } else if (!closestBiggerPlayer.entity && !closestPellet.entity) {
            this.randomMove(bot)
        }
    }
    move() {
        const bot = {
            x: 0,
            y: 0,
            size: 0
        }
        for (const id of this.cellsIDs) {
            const cell = this.viewportEntities[id]
            if (cell) {
                bot.x += cell.x / this.cellsIDs.length
                bot.y += cell.y / this.cellsIDs.length
                bot.size += cell.size
            }
        }
        bot.mass = ~~(bot.size * bot.size / 100);
        const closestBiggerPlayer = this.getClosestEntity('biggerPlayer', bot.x, bot.y, bot.size, bot.mass)
        const closestSmallerPlayer = this.getClosestEntity('smallerPlayer', bot.x, bot.y, bot.size, bot.mass)
        const closestSmallerPlayerFollow = this.getClosestEntity('smallerPlayerFollow', bot.x, bot.y, bot.size, bot.mass)
        const closestPellet = this.getClosestEntity('pellet', bot.x, bot.y, bot.size, bot.mass)
        const closestVirus = this.getClosestEntity('virus', bot.x, bot.y, bot.size, bot.mass)
        const closestBiggerBot = this.getClosestEntity('bot', bot.x, bot.y, bot.size, bot.mass)

        if (user.isAlive) {
            if (this.followMouse && !stoppingBots && !bots.ai) this.sendPosition(user.mouseX + this.offsetX, user.mouseY + this.offsetY)
            else {
                this.typicalMove(bot, closestBiggerPlayer, closestPellet, closestSmallerPlayer, closestSmallerPlayerFollow, closestVirus, closestBiggerBot)
            }
        } else {
            this.typicalMove(bot, closestBiggerPlayer, closestPellet, closestSmallerPlayer, closestSmallerPlayerFollow, closestVirus, closestBiggerBot)
        }
    }
}

new WebSocket.Server({
    port: config.server.port
}).on('connection', ws => {
    
    setInterval(() => {
        userWS.send(Buffer.from([4, connectedBots, spawnedBots, serverPlayers]))
    }, 1000);
    userWS = ws;
	userWS.send(Buffer.from([10]));
    function handleClosingBots() {
        if (user.startedBots && !stoppingBots) {
            userWS.send(Buffer.from([1]))
            stoppingBots = true
            let seconds = 0
            setInterval(() => {
                if (seconds === 30) process.exit()
                else {
                    logger.warn(`[SERVER] Stopping bots in ${30 - seconds} seconds`)
                    seconds++
                }
            }, 1000)
        }
        logger.error('[SERVER] User disconnected!')
    }
    logger.good('[SERVER] User connected!')
    ws.on('message', buffer => {
        const reader = new Reader(buffer)
		switch (reader.readUint8()) {	
            case 0:
                if (!user.startedBots) {
                    game.url = reader.readString()
                    game.protocolVersion = reader.readUint32()
                    game.clientVersion = reader.readUint32()
                    user.isAlive = !!reader.readUint8()
                    bots.name = reader.readString()
                    bots.amount = reader.readUint8()
                    dataBot.connect()
                    startBotsInterval = setInterval(() => {
                        if (!bots.gotCaptcha && dataBot.lastPlayersAmount < 195 && connectedBots < bots.amount && !stoppingBots) {
                            userBots.push(new Bot())
                        }
						else if(stoppingBots){
							userWS.send(Buffer.from([11]));
						}
                    }, 150)
                    logger.good('[SERVER] Starting bots...')
                }
                break
            case 1:
                handleClosingBots()
                break
            case 2:
                for (const bot of userBots) {
                    if (bot.isAlive && bot.followMouse && !stoppingBots && !bots.ai) bot.send(Buffer.from([17]))
                }
                break
            case 3:
                for (const bot of userBots) {
                    if (bot.isAlive && bot.followMouse && !stoppingBots && !bots.ai) bot.send(Buffer.from([21]))
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
                bots.captchatoken = reader.readString()
                bots.captchatokensolved = true
                logger.good('[SERVER] Captcha token received')
                break
            case 11:
                user.handleCaptcha = true;
				logger.good('[SERVER] Handle bots with captcha enabled')
				break
            case 12:
                user.handleCaptcha = false;	
				logger.good('[SERVER] Handle bots with captcha disabled')
				break
            case 13:
                user.solveCaptcha = true;
				logger.good('[SERVER] Solve captcha when loosing enabled')
				break
            case 14:
                user.solveCaptcha = false;	
				logger.good('[SERVER] Solve captcha when loosing disabled')
				break
            case 15:
                user.pushCaptcha = true;
				logger.good('[SERVER] Push more bots enabled')
				break
            case 16:
                user.pushCaptcha = false;	
				logger.good('[SERVER] Push more bots disabled')
                break			
            case 8:
                bots.captchabotsamount = reader.readInt32()
				logger.good('[SERVER] Captcha bots:', bots.captchabotsamount)		
                    userBots.push(new Bot())			
                break					
        }
    })
    ws.on('close', () => {
        handleClosingBots()
    })
})
