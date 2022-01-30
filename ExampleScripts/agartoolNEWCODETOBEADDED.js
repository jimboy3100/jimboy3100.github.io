class ApiTool extends ClientApi{
    constructor(client){
        super(client)
        Debugger(true, this,'[[31mAT ⇄ '+client.tabName+'[105m]:')
        this.apiName = 'apiTool'
        
        this.playerID = null
        this.socket = null
        this.playerID = null
        this.sendPlayerJoin = this.sendPlayerCellUpdate = this.sendWave = ()=>{}
        this.changed = {
            nick:undefined,
            skinURL:undefined,
            player_protocol_skin:undefined,
            skinID:undefined,
            isAlive:undefined,
            x:undefined,
            y:undefined,
            mass:undefined,
            json:undefined,apiOgarID:undefined
        }

        this.onPlayerSpawn = ()=>{
            this.sendPlayerSpawn()
        }
        /*setInterval(()=>{
            this.sendPlayerPosition()
        },2000)*/

        let _eventOnEnableAgartool
        settings.on('enableAgartool',_eventOnEnableAgartool = ()=>{
            if(!settings.enableAgartool){
                this.closeConnection()
            }else{
                this.connect()
            }
        })()
        client.once('removeEvents',()=>{
            settings.removeListener('enableAgartool',_eventOnEnableAgartool)
        })
        this.comebackTimeout = 5000
    }
    destroy(){
        this.closeConnection()
    }
    onUpdateTick(){
        this.sendPlayerPosition()
    }
    connect() {
        if(!settings.enableAgartool) return this.closeConnection();
        this.publicIP = 'wss://minimap.agartool.io:443'
        this.closeConnection();
        this.log(`Connecting`);
        this.socket = new WebSocket(this.publicIP);
        //this.socket.ogarioWS = true;
        this.socket.binaryType = 'arraybuffer';
        this.socket.onopen = () => {
            this.comebackTimeout = 5000
            this.log('Connected');
            var p = new Packet
            p.setCommandID(155);
            p.writeUInt8(5);
            this.sendBuffer(p);
            this.emit('estabilished')
        };
        this.socket.onmessage = message => this.readMessage(message);
        this.socket.onclose = close => {
            this.log('Disconnected', close);
            this.reconnect()
        };
        this.socket.onerror = error => this.log(`Connect error`, error);
    }
    closeConnection() {
        if (this.socket) {
            try {
            this.socket.onopen = null;
            this.socket.onmessage = null;
            this.socket.onerror = null;
            this.socket.onclose = null;
            this.socket.close();
            this.log('Disconnected')
            } catch (error) {}
            this.socket = null;
        }
    }
    increaseComeback(){
        this.comebackTimeout  = this.comebackTimeout<40000? this.comebackTimeout*2 : 40000
    }
    reconnect() {setTimeout(() => {this.connect()}, this.comebackTimeout); this.increaseComeback()}
    isSocketOpen() {return this.socket !== null && this.socket.readyState === this.socket.OPEN;}
    sendBuffer(value) {
        if(!this.isSocketOpen()) return this.error('Not connected')
        this.socket.send(new Uint8Array(value.get()));
    }
    readMessage(message) {
        var p = new Packet(message.data)
        var opcode = p.readUInt8()
        switch (opcode) {
            case 97:
                var p97 = new Packet;
                p97.setCommandID(97);
                p97.writeUTF8String(function() {
                    return 'agartool@gay.io' + " - " + 'Lylko' + " - " + 'Alexander' + " - " + 'https://i.imgur.com/7cugADY.png';
                }());
                this.sendBuffer(p97);
                break;
            case 66: /* Message */
                const message_type = p.readUInt8()
                const chat_name = p.readUTF8String()
                const chat_message = p.readUTF8String()
                const type = message_type === 0?ChatMessageType.MESSAGE:ChatMessageType.COMMAND
                const time = new Date().toTimeString().replace(/^(\d{2}:\d{2}).*/, '$1');
                this.emit('message',this, time, type, chat_name, chat_name, chat_message,chat_name == this.client.profile.playerName);
                break
            case 155: /* Player ID */
                this.playerID =  p.readUTF8String()
                this.onConnect()
                break;
            case 197: /* Maybe ping */
                const p2 = new Packet()
                p2.setCommandID(197);
                this.sendBuffer(p2);
                break;
            case 130: /* Player info on enter in room */
                //console.log('присылается при джоине в комнату', 130)
                var total = p.readUInt16()
                for(var i=0;total>i;i++){
                    let playerID,nick,skinURL,skinID,isAlive,x,y,mass,json
                    playerID = p.readUTF8String()
                    nick = p.readUTF8String()
                    skinURL = p.readUTF8String()
                    skinID = p.readUTF8String()
                    isAlive = p.readBoolean()
                    x = p.readInt32()
                    y = p.readInt32()
                    mass = p.readUInt32()
                    json = p.readUTF8String()
                    if(this.playerID === playerID) break;
                    this.emit('player',{api:this,playerID,nick,skinURL,skinID,isAlive,x,y,mass,json,color:'#8C81C7',customColor:'#8C81C7'});
                    //(skinID||skinURL)&&console.log(130,{api:this,playerID,nick,skinURL,skinID,isAlive,x,y,mass,json,color:'#8C81C7',customColor:'#8C81C7'})
                }
                break;
            case 200: /* Player info */
            //console.log('op', 200)
                var total = p.readUInt16()
                for(var i=0;total>i;i++){
                    let playerID,nick,skinURL,skinID,isAlive,x,y,mass,json
                    playerID = p.readUTF8String()
                    var flags = p.readUInt8()
                    if (flags & 1) nick = p.readUTF8String()
                    if (flags & 2) skinURL = p.readUTF8String()
                    if (flags & 4) skinID = p.readUTF8String()
                    if (flags & 8) isAlive = p.readBoolean()
                    if (flags & 16) x = p.readInt32()
                    if (flags & 32) y = p.readInt32()
                    if (flags & 64) mass = p.readUInt32()
                    if (flags & 128) {
                        var flags2 = p.readUInt8()
                        if (flags2 & 1) json = p.readUTF8String()
                    }
                    if(this.playerID === playerID) continue;
                    this.emit('player',{api:this,playerID,nick,skinURL,skinID,isAlive,x,y,mass,json,color:'#8C81C7',customColor:'#8C81C7'});
                    //(skinID||skinURL)&&console.log(200,{api:this,playerID,nick,skinURL,skinID,isAlive,x,y,mass,json,color:'#8C81C7',customColor:'#8C81C7'})
                }
                break;
            case 201: /* Player info  when someone enter in room */
            
                    let playerID,nick,skinURL,skinID,isAlive,x,y,mass,json
                    playerID = p.readUTF8String()
                    nick = p.readUTF8String()
                    skinURL = p.readUTF8String()
                    skinID = p.readUTF8String()
                    isAlive = p.readBoolean()
                    x = p.readInt32()
                    y = p.readInt32()
                    mass = p.readUInt32()
                    json = p.readUTF8String()
                    if(this.playerID === playerID) break;
                    this.emit('player',{api:this,playerID,nick,skinURL,skinID,isAlive,x,y,mass,json,color:'#8C81C7',customColor:'#8C81C7'});
                    //(skinID||skinURL)&&console.log(201,{api:this,playerID,nick,skinURL,skinID,isAlive,x,y,mass,json,color:'#8C81C7',customColor:'#8C81C7'})
                    //console.log('op', 201, {api:this,playerID,nick,skinURL,skinID,isAlive,x,y,mass,json,color:'#8C81C7',customColor:'#8C81C7'})
                break;
            case 202: /* remove player from room */
                this.emit('playerRemove', p.readUTF8String())
                break;
            default: this.log('Unknown opcode',opcode)
        }
    }
    onConnect(){
        if(this.isSocketOpen()){
            this.sendPlayerDeath()
            this.send_serverToken()
            this.client.play && this.sendPlayerPosition(true)
        }
    }

    /* Below protocol functions and event handlers*/
    sendPlayerDisconnected() { // пропадают 
        var p = new Packet;
        p.setCommandID(163);
        this.sendBuffer(p);
    }
    send_clanTag(val = profiles.masterProfile.clanTag, val2 = application.server.serverToken){
        var p = new Packet;
        p.setCommandID(157);
        p.writeUTF8String(val);
        p.writeUTF8String(val2);
        this.sendBuffer(p);
    }
    send_serverToken(val = profiles.masterProfile.clanTag, val2 = application.server.serverToken){
        var p = new Packet;
        p.setCommandID(157);
        p.writeUTF8String(val);
        p.writeUTF8String(val2);
        this.sendBuffer(p);
    }
    sendPlayerSpawn() {
        this.sendPlayerPosition(true)
    }
    sendPlayerDeath() {
        this.sendPlayerPosition(true)
    }
    sendPlayerPosition(dontCheckClientPlay) { //
        if (this.isSocketOpen() && (this.client.play || dontCheckClientPlay) ) {
            let flags = 0
            if(this.changed.nick !== this.client.profile.nick) this.changed.nick = this.client.profile.nick ;flags |= 1 
            if(this.changed.skinURL !== this.client.profile.skinURL) this.changed.skinURL !== this.client.profile.skinURL;  flags |= 2
            if(this.changed.skinID !== this.client.player_protocol_skin) this.changed.skinID !== this.client.player_protocol_skin;  flags |= 4
            if(this.changed.isAlive !== this.client.play) this.changed.isAlive = this.client.play;  flags |= 8
            if(this.changed.x !== this.client.protocol_viewX) this.changed.x = this.client.protocol_viewX;  flags |= 16
            if(this.changed.y !== this.client.protocol_viewY) this.changed.y = this.client.protocol_viewY;  flags |= 32
            if(this.changed.mass !== this.client.playerMass) this.changed.mass = this.client.playerMass;  flags |= 64
            if(this.changed.apiOgarID !== this.client.apiOgar.playerID) this.changed.apiOgarID = this.client.apiOgar.playerID;  flags |= 128
            let p = new Packet
            p.setCommandID(161)
            p.writeUInt8(flags)
            if (flags & 1) p.writeUTF8String(this.client.profile.nick)
            if (flags & 2) p.writeUTF8String(this.client.profile.skinURL)
            if (flags & 4) p.writeUTF8String(this.client.player_protocol_skin)
            if (flags & 8) p.writeBoolean(this.client.play)
            if (flags & 16) p.writeInt32(this.client.protocol_viewX)
            if (flags & 32) p.writeInt32(this.client.protocol_viewY)
            if (flags & 64) p.writeUInt32(this.client.playerMass)
            if (flags & 128) {
                var flags2 = 0
                flags2 |= 1
                p.writeUInt8(flags2)
                if (flags2 & 1) p.writeUTF8String(JSON.stringify({apiOgarID:this.client.apiOgar.playerID}))
            }
            this.sendBuffer(p)
        }
    }
    sendChatMessage(type = ChatMessageType.COMMAND, nick = '', message = '') {
        const typ = type===ChatMessageType.MESSAGE?0:1
        if(message.indexOf('.')==0) return;
        const p = new Packet();
        p.setCommandID(66);
        p.writeUInt8(typ);
        p.writeUTF8String(nick);
        p.writeUTF8String(message);
        this.sendBuffer(p)
    }

}
