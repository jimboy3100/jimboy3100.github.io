const WebSocket = require('ws')
const {createServer} = require('https')
const {readFileSync} = require('fs')
const Config = require('./config')
const Algorithm = require('./algorithm')
const Messages = require('./messages')
const Reader = require('./reader')
const Entity = require('./entity')

const User = {
    server: Config.useRemote 
    ? 
        new WebSocket.Server({
            server: createServer({
                cert: readFileSync(Config.certPath),
                key: readFileSync(Config.keyPath)
            }).listen(Config.serverPort)
        })
    :
        new WebSocket.Server({
            port: Config.serverPort
        })
    ,
    bots: [],
    botsName: '',
    botsAmount: 0,
    stoppedBots: false,
    protocolVersion: 0,
    clientVersion: 0,
    enabledBotsAI: false,
    isAlive: false,
    serverURL: '',
    serverKey: 0,
    mouseX: 0,
    mouseY: 0
}

class Bot {
    constructor(index){
        this.index = index
        this.ws = null
        this.encryptionKey = 0
        this.decryptionKey = 0
        this.mapOffsetX = 0
        this.mapOffsetY = 0
        this.isAlive = false
        this.viewportEntities = {}
        this.cellsIDs = []
        this.connect()
    }
    reset(){
        this.encryptionKey = 0
        this.decryptionKey = 0
        this.isAlive = false
        this.viewportEntities = {}
        this.cellsIDs = []
    }
    connect(){
        this.reset()
        this.ws = new WebSocket(User.serverURL, {
            origin: 'https://agar.io',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36'
            }
        })
        this.ws.onopen = this.onopen.bind(this)
        this.ws.onmessage = this.onmessage.bind(this)
        this.ws.onerror = this.onerror.bind(this)
        this.ws.onclose = this.onclose.bind(this)
    }
    sendMessage(message){
        if(this.ws && this.ws.readyState === WebSocket.OPEN){
            if(this.encryptionKey){
                message = Algorithm.rotateMessageBytes(message, this.encryptionKey)
                this.encryptionKey = Algorithm.rotateMessageKey(this.encryptionKey)
            }
            this.ws.send(message)
        }
    }
    onopen(){
        this.sendMessage(Messages.protocolVersion(User.protocolVersion))
        this.sendMessage(Messages.clientVersion(User.clientVersion))
        this.encryptionKey = User.serverKey
        setTimeout(function(){
            this.sendMessage(Messages.spawn(User.botsName))
        }.bind(this), 50)
    }
    onmessage(message){
        message = Buffer.from(message.data)
        if(this.decryptionKey) message = Algorithm.rotateMessageBytes(message, this.decryptionKey ^ User.clientVersion)
        this.handleMessage(message)
    }
    onerror(){
        if(this.ws.readyState === WebSocket.CONNECTING || this.ws.readyState === WebSocket.OPEN) this.ws.close()
    }
    onclose(){
        setTimeout(this.connect.bind(this), 250)
    }
    handleMessage(message){
        const reader = new Reader(message)
        switch(reader.readUint8()){
            case 32:
                this.cellsIDs.push(reader.readUint32())
                if(!this.isAlive) this.isAlive = true
                break
            case 85:
                this.ws.onmessage = null
                this.reset()
                setTimeout(() => {
                    User.bots.push(new Bot(User.bots.length))
                }, 2500)
                break
            case 241:
                this.decryptionKey = reader.readInt32()
                break
            case 255:
                this.handleCompressedMessage(Algorithm.uncompressMessage(reader.message.slice(5), Buffer.allocUnsafe(reader.readUint32())))
                break
        }
    }
    handleCompressedMessage(message){
        const reader = new Reader(message)
        switch(reader.readUint8()){
            case 16:
                this.updateViewportEntities(reader)
                break
            case 64:
                this.updateMap(reader)
                break
        }
    }
    updateViewportEntities(reader){
        const eatRecordLength = reader.readUint16()
        for(let i = 0; i < eatRecordLength; i++) reader.byteOffset += 8
        while(true){
            const id = reader.readUint32()
            if(id === 0) break
            const entity = new Entity()
            entity.id = id
            entity.x = reader.readInt32()
            entity.y = reader.readInt32()
            entity.size = reader.readUint16()
            const flags = reader.readUint8()
            const extendedFlags = flags & 128 ? reader.readUint8() : 0
            if(flags & 1) entity.isVirus = true
            if(flags & 2) reader.byteOffset += 3
            if(flags & 4) reader.readString()
            if(flags & 8) entity.name = decodeURIComponent(escape(reader.readString()))
            if(flags & 32) entity.isOwnEjected = true
            if(flags & 64) entity.isOtherEjected = true
            if(extendedFlags & 1) entity.isPellet = true
            if(extendedFlags & 4) reader.byteOffset += 4
            this.viewportEntities[entity.id] = entity
        }
        const removeRecordLength = reader.readUint16()
        for(let i = 0; i < removeRecordLength; i++){
            const removedEntityID = reader.readUint32()
            if(this.cellsIDs.includes(removedEntityID)) this.cellsIDs.splice(this.cellsIDs.indexOf(removedEntityID), 1)
            if(this.viewportEntities[removedEntityID]) delete this.viewportEntities[removedEntityID]
        }
        if(this.isAlive && !this.cellsIDs.length){
            this.isAlive = false
            setTimeout(function(){
                this.sendMessage(Messages.spawn(User.botsName))
            }.bind(this), 50)
        }
    }
    updateMap(reader){
        const left = reader.readDouble()
        const top = reader.readDouble()
        const right = reader.readDouble()
        const bottom = reader.readDouble()
        if(~~(right - left) === 14142 && ~~(bottom - top) === 14142){
            this.mapOffsetX = (left + right) / 2
            this.mapOffsetY = (top + bottom) / 2
        }
    }
    calculateDistance(botX, botY, targetX, targetY){
        return Math.hypot(targetX - botX, targetY - botY)
    }
    getClosestSmallerVirus(botX, botY, botSize){
        let closestDistance = Infinity
        let closestVirus = null
        for(const entity of Object.values(this.viewportEntities)){
            if(entity.isVirus && !entity.isOwnEjected && !entity.isOtherEjected && !entity.isPellet && entity.size < botSize){
                const distance = this.calculateDistance(botX, botY, entity.x, entity.y)
                if(distance < closestDistance){
                    closestDistance = distance
                    closestVirus = entity
                }
            }
        }
        return {
            distance: closestDistance,
            virus: closestVirus
        }
    }
    getClosestBiggerPlayer(botX, botY, botSize){
        let closestDistance = Infinity
        let closestPlayer = null
        for(const entity of Object.values(this.viewportEntities)){
            if(!entity.isVirus && !entity.isOwnEjected && !entity.isOtherEjected && !entity.isPellet && entity.size > botSize && entity.name !== User.botsName){
                const distance = this.calculateDistance(botX, botY, entity.x, entity.y)
                if(distance < closestDistance){
                    closestDistance = distance
                    closestPlayer = entity
                }
            }
        }
        return {
            distance: closestDistance,
            player: closestPlayer
        }
    }
    getClosestSmallerPlayer(botX, botY, botSize){
        let closestDistance = Infinity
        let closestPlayer = null
        for(const entity of Object.values(this.viewportEntities)){
            if(!entity.isVirus && !entity.isOwnEjected && !entity.isOtherEjected && !entity.isPellet && entity.size < botSize && entity.name !== User.botsName){
                const distance = this.calculateDistance(botX, botY, entity.x, entity.y)
                if(distance < closestDistance){
                    closestDistance = distance
                    closestPlayer = entity
                }
            }
        }
        return {
            distance: closestDistance,
            player: closestPlayer
        }
    }
    getClosestOwnEjected(botX, botY){
        let closestDistance = Infinity
        let closestEjected = null
        for(const entity of Object.values(this.viewportEntities)){
            if(!entity.isVirus && entity.isOwnEjected && !entity.isOtherEjected && !entity.isPellet){
                const distance = this.calculateDistance(botX, botY, entity.x, entity.y)
                if(distance < closestDistance){
                    closestDistance = distance
                    closestEjected = entity
                }
            }
        }
        return {
            distance: closestDistance,
            ejected: closestEjected
        }
    }
    getClosestOtherEjected(botX, botY){
        let closestDistance = Infinity
        let closestEjected = null
        for(const entity of Object.values(this.viewportEntities)){
            if(!entity.isVirus && !entity.isOwnEjected && entity.isOtherEjected && !entity.isPellet){
                const distance = this.calculateDistance(botX, botY, entity.x, entity.y)
                if(distance < closestDistance){
                    closestDistance = distance
                    closestEjected = entity
                }
            }
        }
        return {
            distance: closestDistance,
            ejected: closestEjected
        }
    }
    getClosestPellet(botX, botY){
        let closestDistance = Infinity
        let closestPellet = null
        for(const entity of Object.values(this.viewportEntities)){
            if(!entity.isVirus && !entity.isOwnEjected && !entity.isOtherEjected && entity.isPellet){
                const distance = this.calculateDistance(botX, botY, entity.x, entity.y)
                if(distance < closestDistance){
                    closestDistance = distance
                    closestPellet = entity
                }
            }
        }
        return {
            distance: closestDistance,
            pellet: closestPellet
        }
    }
    move(){
        const bot = {
            x: 0,
            y: 0,
            size: 0
        }
        for(const id of this.cellsIDs){
            const cell = this.viewportEntities[id]
            if(cell){
                bot.x += cell.x / this.cellsIDs.length
                bot.y += cell.y / this.cellsIDs.length
                bot.size += cell.size
            }
        }
        const closestBiggerPlayer = this.getClosestBiggerPlayer(bot.x, bot.y, bot.size)
        const closestSmallerVirus = this.getClosestSmallerVirus(bot.x, bot.y, bot.size)
        const closestSmallerPlayer = this.getClosestSmallerPlayer(bot.x, bot.y, bot.size)
        const closestOwnEjected = this.getClosestOwnEjected(bot.x, bot.y)
        const closestOtherEjected = this.getClosestOtherEjected(bot.x, bot.y)
        const closestPellet = this.getClosestPellet(bot.x, bot.y)
        if(User.isAlive && !User.stoppedBots){
            if(User.enabledBotsAI || bot.size < 60){
                if(closestBiggerPlayer.player && closestBiggerPlayer.distance < 250){
                    const angle = (Math.atan2(closestBiggerPlayer.player.y - bot.y, closestBiggerPlayer.player.x - bot.x) + Math.PI) % (Math.PI * 2)
                    this.sendMessage(Messages.move(Math.cos(angle) * 14142, Math.sin(angle) * 14142, this.decryptionKey))
                }
                else if(closestSmallerVirus.virus && closestSmallerVirus.distance < 150){
                    const angle = (Math.atan2(closestSmallerVirus.virus.y - bot.y, closestSmallerVirus.virus.x - bot.x) + Math.PI) % (Math.PI * 2)
                    this.sendMessage(Messages.move(Math.cos(angle) * 14142, Math.sin(angle) * 14142, this.decryptionKey))
                }
                else if(closestSmallerPlayer.player && closestSmallerPlayer.distance < 250) this.sendMessage(Messages.move(closestSmallerPlayer.player.x, closestSmallerPlayer.player.y, this.decryptionKey))
                else if(closestOwnEjected.ejected) this.sendMessage(Messages.move(closestOwnEjected.ejected.x, closestOwnEjected.ejected.y, this.decryptionKey))
                else if(closestOtherEjected.ejected) this.sendMessage(Messages.move(closestOtherEjected.ejected.x, closestOtherEjected.ejected.y, this.decryptionKey))
                else if(closestPellet.pellet) this.sendMessage(Messages.move(closestPellet.pellet.x, closestPellet.pellet.y, this.decryptionKey))
                else if(!closestBiggerPlayer.player && !closestSmallerVirus.virus && !closestSmallerPlayer.player && !closestOwnEjected.ejected && !closestOtherEjected.ejected && !closestPellet.pellet) this.sendMessage(Messages.move(bot.x + ~~(Math.random() * 1000), bot.y + ~~(Math.random() * 1000), this.decryptionKey))
            }
            else this.sendMessage(Messages.move(User.mouseX + this.mapOffsetX, User.mouseY + this.mapOffsetY, this.decryptionKey))
        }
        else {
            if(closestBiggerPlayer.player && closestBiggerPlayer.distance < 250){
                const angle = (Math.atan2(closestBiggerPlayer.player.y - bot.y, closestBiggerPlayer.player.x - bot.x) + Math.PI) % (Math.PI * 2)
                this.sendMessage(Messages.move(Math.cos(angle) * 14142, Math.sin(angle) * 14142, this.decryptionKey))
            }
            else if(closestSmallerVirus.virus && closestSmallerVirus.distance < 150){
                const angle = (Math.atan2(closestSmallerVirus.virus.y - bot.y, closestSmallerVirus.virus.x - bot.x) + Math.PI) % (Math.PI * 2)
                this.sendMessage(Messages.move(Math.cos(angle) * 14142, Math.sin(angle) * 14142, this.decryptionKey))
            }
            else if(closestSmallerPlayer.player && closestSmallerPlayer.distance < 250) this.sendMessage(Messages.move(closestSmallerPlayer.player.x, closestSmallerPlayer.player.y, this.decryptionKey))
            else if(closestOwnEjected.ejected) this.sendMessage(Messages.move(closestOwnEjected.ejected.x, closestOwnEjected.ejected.y, this.decryptionKey))
            else if(closestOtherEjected.ejected) this.sendMessage(Messages.move(closestOtherEjected.ejected.x, closestOtherEjected.ejected.y, this.decryptionKey))
            else if(closestPellet.pellet) this.sendMessage(Messages.move(closestPellet.pellet.x, closestPellet.pellet.y, this.decryptionKey))
            else if(!closestBiggerPlayer.player && !closestSmallerVirus.virus && !closestSmallerPlayer.player && !closestOwnEjected.ejected && !closestOtherEjected.ejected && !closestPellet.pellet) this.sendMessage(Messages.move(bot.x + ~~(Math.random() * 1000), bot.y + ~~(Math.random() * 1000), this.decryptionKey))
        }
    }
}

User.server.on('connection', ws => {
    console.log('[SERVER] User connected')
    ws.on('message', message => {
        const reader = new Reader(message)
        switch(reader.readUint8()){
            case 0:
                User.protocolVersion = reader.readUint32()
                User.clientVersion = reader.readUint32()
                console.log(`[SERVER] Protocol version: ${User.protocolVersion}\n[SERVER] Client Version: ${User.clientVersion}`)
                break
            case 1:
                User.botsName = reader.readString()
                User.botsAmount = reader.readUint8()
                User.isAlive = !!reader.readUint8()
                User.serverURL = reader.readString()
                User.serverKey = reader.readInt32()
                if(User.botsAmount >= 50 && User.botsAmount <= 150){
                    let index = 0
                    let startBotsInterval = setInterval(() => {
                        if(index <= User.botsAmount){
                            User.bots.push(new Bot(index))
                            index++
                        }
                        else clearInterval(startBotsInterval)
                    }, 100)
                }
                else console.log('[SERVER] Max bot amount exceeded')
                console.log(`[SERVER] User started bots\n[SERVER] Server URL: ${User.serverURL}\n[SERVER] Server Key: ${User.serverKey}`)
                break
            case 2:
                if(User.bots.length && !User.stoppedBots){
                    User.stoppedBots = true
                    let seconds = 0
                    let secondsInterval = setInterval(() => {
                        if(seconds < 120) console.log(`[SERVER] Avoiding captcha, please wait ${120 - seconds} seconds before doing anything`)
                        else clearInterval(secondsInterval)
                        seconds++
                    }, 1000)
                    setTimeout(() => {
                        process.exit()
                    }, 120000)
                    console.log(`[SERVER] User stopped bots`)
                }
                break
            case 3:
                for(const bot of User.bots){
                    if(bot.isAlive && !User.stoppedBots) bot.sendMessage(Buffer.from([17]))
                }
                break
            case 4:
                for(const bot of User.bots){
                    if(bot.isAlive && !User.stoppedBots) bot.sendMessage(Buffer.from([21]))
                }
                break
            case 5:
                User.enabledBotsAI = !!reader.readUint8()
                break
            case 6:
                User.isAlive = !!reader.readUint8()
                break
            case 7:
                User.mouseX = reader.readInt32()
                User.mouseY = reader.readInt32()
                for(const bot of User.bots){
                    if(bot.isAlive) bot.move()
                }
                break
        }
    })
    ws.on('close', () => {
        if(User.bots.length){
            setInterval(() => {
                for(const bot of User.bots){
                    if(bot.isAlive) bot.move()
                }
            }, 40)
            if(!User.stoppedBots){
                User.stoppedBots = true
                let seconds = 0
                let secondsInterval = setInterval(() => {
                    if(seconds < 120) console.log(`[SERVER] Avoiding captcha, please wait ${120 - seconds} seconds before doing anything`)
                    else clearInterval(secondsInterval)
                    seconds++
                }, 1000)
                setTimeout(() => {
                    process.exit()
                }, 120000)
            }
            console.log('[SERVER] User disconnected and bots stopped')
        }
        else console.log('[SERVER] User disconnected')
    })
})
