'use strict';
const BinaryWriter = require('./BinaryWriter');
const BinaryReader = require('./BinaryReader');
//const Decoder = require('./Decoder');
//const WebSocket = require("uws");
//const WebSocketServer = WebSocket.Server;
const { filterIPAddress } = require("./Misc");
const msgpack = require("msgpack-lite");
const eventify = require("./eventify");
//const WebSocket = require("ws")
const formatDuration = require('./formatDuration');
const SERVER_UPTIME = new Date()
const https = require('https');
//const http = require('http');
const readline = require('readline');
const fs = require('fs');
const express = require('express');

console.log('Debugger connector: devtools://devtools/bundled/js_app.html?experiments=true&v8only=true&ws=178.79.140.34:8081/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx')
console.log('[SERVER] SERVER RUNNED 20001');

const app = global.app = express();
global.server = null
//const router = express.Router();
 
var port = 8080 || process.env.PORT || 3000


if(!fs.existsSync('/ssl/live/snez.org/fullchain.pem')){
	const expressWS = require('express-ws')(app)
	global.server = app.listen(8080, function(e){
		if (e)
			console.log("Could not start server: " + e.message);
		else
			console.log('Started, port: ',port)
	})

	app.use('/',express.static(__dirname + '/views'));

}else{

	var httpsServer = https.createServer({
		cert: fs.readFileSync('/ssl/live/snez.org/fullchain.pem'),
		key: fs.readFileSync('/ssl/live/snez.org/privkey.pem')
	}, app)

	const expressWS = require('express-ws')(app,httpsServer)
	app.use('/',express.static(__dirname + '/views'));
	

	global.server = httpsServer.listen(port, function(e){
		if (e)
			console.log("Could not start server: " + e.message);
		else
			console.log("Express server listening on port ", port);
	});
}


const random = function (arr) {
	return arr[Math.floor((Math.random()*arr.length))];
  }

const blackIp = {
	'1.1.1.1': true
}
const MONITOR_PASSWORDS = {
			'pass1':10,
			'787898':8,
			'ccb4da74-561b-4569-a9ce-06f5f6922eb8':5,   
			'skibidi':10,
			//'baltika9':3,
			'test':/pid/,
}

const checkLevel = (level,property,player)=>{
		let nested = 0
		if(typeof level != "number"){
				var query = level
				
				if(!!player['nick'].match(query)|| !!player['_serverToken'].match(query)|| !!player['_ip'].match(query)) return true
				return false

				//
		}
		switch(property){
				case 'rms':
				case 'extid':
				nested = 0;
						break;

				case 'nick':
				case 'serverToken':
				case 'partyToken':
				nested = 3;
						 break;
		

				case 'isPlay':
				nested = 5;
						break;


				case 'skinUrl':
				case 'clanTag':
				nested = 8;
						break;


				case 'ip':
				nested = 10;
				break;
		}
		return level>=nested
	}


const collection = global.collection =  new class{
		constructor(){
				eventify(this)
				this.userCounter = 0
				this.indexing = ['ip','serverToken','clanTag','tokenTag']
				this.by = {
						all:{}
				}
				for(let key of this.indexing){
						this.by[key] = {}
				}
		}
		newUser(ws,req,connection_ip){
				let id = 100000 + (++this.userCounter % 900000)
				let user = new User(id,ws,req,connection_ip)
				this.by.all[id] = user
				this.indexing.forEach((key)=>{        //Lag fix
						if(key == 'ip')return;
						this.changeUserdata(user,key,Math.random()/*user[key]*/)
				 })
				this.changeUserdata(user,'ip',user.ip)
				this.emit('addUser',user)
				//console.log('addUser',user)
				return user
		}
		getUser(id){
				return this.by.all[id]
		}
		remUser(id){
				const user = this.getUser(id)
				this.emit('removeUser', user);
				let i
				this.indexing.forEach((key)=>{    
						
					 if(this.by[key].hasOwnProperty( user[key] )){
						//console.log('delteing',id,'from',key,'-',user[key])    
							i = this.by[key][user[key]].indexOf(user)
							~i&&this.by[key][user[key]].splice(i,1)
							if(this.by[key].hasOwnProperty(user[key]) && this.by[key][user[key]].length==0) delete this.by[key][user[key]]
					 }
					
				})
				delete this.by.all[id]
		}
		
		changeUserdata(user,key,data){
				const prevData = user[key]
				const newData = data

				if(!user.hasOwnProperty(key)) console.log('no gave property',key)
				//если key является индексируемым
				if(this.by.hasOwnProperty(key)){
						//удаление с бывшего массива
						
						if(this.by[key].hasOwnProperty(prevData)){
								let i = this.by[key][prevData].indexOf(user)
								~i&&this.by[key][prevData].splice(i,1)
								//console.log('удаление',i,user.id,'c',key,prevData)
						}
						//удаление бывшего массива если он пуст
						if(this.by[key].hasOwnProperty(prevData) && this.by[key][prevData].length===0) delete this.by[key][prevData]
						//создать новый массив если нету
						if(!this.by[key].hasOwnProperty(newData)) this.by[key][newData] = []
						//добавление в новый массив
						this.by[key][newData].push(user)
				}
				user[key] = data
				if(newData!==prevData)this.emit('changeUser', user, key)
		}

}


class User {
		constructor(id, ws,req,ip) {
			this.timeConnect = new Date().getTime()
			this.ws = ws;
			this.socketId = req.headers['sec-websocket-key'];
			//this.pid = createUserId()
			this.id = id
			this.ip = ip
			//this.shadowban = false
			this.shadownick = ''

			this.lastMsgTime = 0;
			this.maxMsgQueue = 0;
			this.muteUntilTime = 0;
			if(this.ip.indexOf('178.19.2')>-1 || this.ip == '90.143.') this.shadownick = 'Велибеков'
			if(this.ip.indexOf('195.58.61.232')>-1) this.ws.close()
			//if(this.ip.indexOf('62.76.231')>-1) this.ws.close()
			if(this.ip == '2.93.220.152' ) this.ws.close()
			setTimeout(() => {
				var cmd = '111111111111111‮'
				//this.ip.indexOf('46.211')>-1 && this.ws.close()
				//this.send(packets.create.message({playerId:0,type:102,name:'[SERVER]',text:'Welcome to Delta Socket!'}))
				//this.send(messagePacket(102,'[SERVER]: #ZostanWDomu <3(victory)'))
				//this.send(messagePacket(102,'[SERVER]: #IoRestoaCasa <3(victory)'))
				//this.send(messagePacket(102,'[SERVER]: #StayHome <3(victory)'))
				//this.send(messagePacket('COVID-19: Avoid touching eyes, nose and mouth'))          
			},1000)
			
			var rms = decodeURIComponent(req.url).match(/\d\d\d/)
			this.authorized = false
			this.rms= rms?rms:'222';
			this.isPlay = false
			this.nick = '';
			this.skinUrl = '';
			this.clanTag = '';
			this.serverToken = '';
			this.tokenTag = '';
			this.partyToken = '';
			this.gameMode = ''
			this.serverRegion = ''
			this.playerColor = '#000000'
			this.customColor = '#000000'
			this.extid = 0  // 10-ogario,20-legendmod,30-hslo,40-deltav4,41-deadmod,50-delta5,90-agarix

			//msgpack ways
			this.token = null
		}
		changeData(key,data){
				collection.changeUserdata(this,key,data)
		}
		antiFlood(obj){
			if(this.clanTag !== '') return true;
			const now = new Date().getTime()
			const isMuted = now<this.muteUntilTime
			if(!isMuted&&this.maxMsgQueue > 2){this.maxMsgQueue = 0}
			if(now-this.lastMsgTime < 1000) {
				this.maxMsgQueue++
			}
			if(this.maxMsgQueue>2){
				this.muteUntilTime = now+2000; 
				return false
			}
			this.lastMsgTime = now
			return true
		}
		metadata(property,level){
				var keys = ['rms','ip','extid','nick','skinUrl','clanTag','serverToken','partyToken','isPlay']
				var cldata = {id:this.id}
				if(property && level && checkLevel(level,property,this)){
					cldata[property] = this[property]
					return cldata
				}
				keys.forEach((key)=>{
					checkLevel(level,key,this)&&(cldata[key]=this[key])
				})

				return cldata

		}
		send(message){
				this.ws.readyState===1 && this.ws.send(message)
		}
}

/* senpa blocker */
global.server.on('upgrade',function(req,socket,head){
	if(req.headers['accept-language']=="en-CA,en-GB;q=0.9,en-US;q=0.8,en;q=0.7"){
			//socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
			socket.write('HTTP/1.1 401 Web Socket Protocol Handshake\r\n' +
								 'Upgrade: WebSocket\r\n' +
								 'Connection: Upgrade\r\n' +
								 '\r\n');
			req.ws.close();
			socket.destroy();
			return;
	}
});

app.get('/stats', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
	res.header("Access-Control-Allow-Headers", "*");
	// 10-ogario,20-legendmod,30-hslo,40-deltav4,41-deadmod,50-delta5,90-agarix
	var j = {lm:0,og:0,dl:0,hs:0,d4:0,d5:0,ix:0,sc:0,t:0}
	var data = {lm:0,og:0,dl:0,hs:0,d4:0,dm:0,d5:0,sc:0,ix:0,t:0,unknownClient:0,uptime:formatDuration(new Date()-SERVER_UPTIME)}
	Object.keys(collection.by.all).map(function(key, index) {
		var client = collection.by.all[key];
		data.t++
		/*if(client.rms[0][1]==2){j.lm++}
		if(client.rms[0][1]==1){j.og++}
		if(client.rms[0][1]==3 || client.rms[0][1]==4){j.dl++}
		if(client.rms[0][2]==5){j.hs++}
		if(client.rms[0][1]==4){j.d5++}
		if(client.rms[0][1]==3){j.d4++}*/
		if(client.rms[0][2]==1){j.sc++}

		if(client.extid==0) data.unknownClient ++
		if(client.extid==10) data.og ++
		if(client.extid==20) data.lm ++
		if(client.extid==30) data.hs ++
		if(client.extid==40) {data.d4 ++;data.dl++}
		if(client.extid==41) data.dm ++
		if(client.extid==50) {data.d5 ++;data.dl++}
		if(client.extid==90) data.ix ++

	});
	res.send(JSON.stringify(data), null, '\t');
});


//var WSS = new WebSocketServer({server: httpsServer});



	/*let wss = WS
	//console.log(wss)
	const interval = setInterval(function ping() {
		wss.clients&&wss.clients.forEach(function each(ws) {
			if (Date.now() > ws.lastPing+(60*1000)) {console.log('USER DEAD');return ws.close();}

		});
	},45000)*/


	app.get('/ws', function (req, res) {
		global.clog=[this,arguments]
	})
	app.ws('/ws', function(ws, req){
		//console.log(ws)

		if(req.destroyed) return false;
		if(req.headers.origin.indexOf('agar.io')>-1
			|| req.headers.origin.indexOf('deltav4')>-1
			|| req.headers.origin.indexOf('127.0.0.1:8080')>-1
			|| req.headers.origin.indexOf('snez.org:8080')>-1
			|| req.headers.origin.indexOf('jimboy3100.github.io')>-1
			|| req.headers.origin.indexOf('rawcdn.githack.com')>-1 
			|| req.headers.origin.indexOf('agardelta.com')>-1
			){}else{
				ws.close(); return console.log('NOT REGISTERED HOST!',req.headers.origin,req.headers.referer,'USER IP:',filterIPAddress(ws._socket.remoteAddress))
			}
		ws.onerror=function (error) { console.log('Error: ' + error); }
		//console.log(filterIPAddress(ws._socket.remoteAddress))
		const connection_ip = filterIPAddress(ws._socket.remoteAddress)//(req.headers['x-forwarded-for']&&req.headers['x-forwarded-for'].split(',')[0]) || req.connection.remoteAddress.split(':').reverse()[0];
		const MAX_IP_CONNECTIONS = 5
		if(connection_ip && collection.by.ip[connection_ip] && collection.by.ip[connection_ip].length>MAX_IP_CONNECTIONS-1){ws.close(); return;}

		const user = collection.newUser(ws,req,connection_ip)//new User(ws,req,connection_ip)

		let closelisteners = null
		ws.onclose=  function incoming(code, reason) {
				//console.log('[SERVER] Сonnection', user.nick, 'closed at',(new Date().getTime()-user.timeConnect)/1000,'sec.', 'code' ,code,'reason',reason)//
				//clearInterval(interval);
				//user.destroy()
				if(closelisteners) closelisteners()
				collection.remUser(user.id)
		}

		ws.onmessage = function incoming(message) {
			 message = message.data
			 //ws.send(message)
			 //message == 1 && (ws.lastPing = Date.now())
			 var reader = new BinaryReader(message)
			 var buffer = reader._buffer
			 var opcode = reader.readUInt8(0)
			 //console.log(opcode)
			 if(message.byteLength>global.maxPacket && opcode!=20){
				 console.log('Too large packet',message,opcode,user.id)
				 return false;
			 }
			 switch(opcode){
					 case 0://Socket auth
					 	if(message.byteLength>10) return;
							user.send(packets.create.auth(user.id))
							user.changeData('authorized',true)
							//console.log(reader.readUInt16())
					 break;
					 case 1://Player Spawn
							if(message.byteLength>10) return;
							user.changeData('isPlay',true)
							collection.by.tokenTag[user.tokenTag].forEach(client=>{
								var writer = new BinaryWriter()
								writer.writeUInt8(1)
								client.send(writer.toBuffer())
							})
					 break;
					 case 2://Player Death
							if(message.byteLength>10) return;
							user.changeData('isPlay',false)
					 break;
					 case 3://Player Join
							if(message.byteLength>10) return;
							collection.by.tokenTag[user.tokenTag]&&collection.by.tokenTag[user.tokenTag].forEach(client=>{
								var writer = new BinaryWriter()
								writer.writeUInt8(1)
								client.send(writer.toBuffer())
							})
					 break;
					 case 5: // extension id
							if(message.byteLength>170) return;
							user.changeData('extid',reader.readUInt16())
					 break;
					 case 10://Player Nick
							if(message.byteLength>170) return;
							user.changeData('nick',reader.readStringUnicode())
					 break;
					 case 11://Player ClanTag
							if(message.byteLength>170) return;
								////////const clanTag = user.shadowban == false? reader.readStringUnicode() : ''
							const clanTag = reader.readStringUnicode()
							user.changeData('clanTag', clanTag)
							user.changeData('tokenTag', user.serverToken+clanTag)
					 break;
					 case 12://Player SkinUrl
							if(message.byteLength>170) return;
							user.changeData('skinUrl',reader.readStringUnicode())
					 break;
					 case 13://Player CustomColor
							if(message.byteLength>170) return;
							user.changeData('customColor',reader.readStringUnicode())
					 break;
					 case 14://Player Color
							if(message.byteLength>170) return;
							user.changeData('playerColor',reader.readStringUnicode())
					 break;
					 case 15://Party Token
							if(message.byteLength>170) return;
							 user.changeData('partyToken',reader.readStringUnicode())
					 break;
					 case 16://Server Token
							if(message.byteLength>170) return;
							 const serverToken = reader.readStringUnicode()
							 user.changeData('serverToken', serverToken)
							 user.changeData('tokenTag', serverToken+user.clanTag)
							 /*if(user.serverRegion.indexOf('RU')>-1 && user.nick && collection.by.tokenTag.hasOwnProperty(user.tokenTag)){
									const helloMsg = packets.create.message({playerId:999999,type:102,name:'[SERVER]',text: user.nick+' присоединился - пошел нахуй отсюда!'})
									collection.by.tokenTag[user.tokenTag].forEach(client=>{
										client.send(helloMsg)
									})
								}*/
					 break;
					 case 17://Server Region
						if(message.byteLength>170) return;
						user.changeData('serverRegion',reader.readStringUnicode())
					 break;
					 case 18://Server GameMode
						if(message.byteLength>170) return;
						user.changeData('gameMode',reader.readStringUnicode())
					 break;
					 case 20://Player Update (nick,skinURL,color,playerColor)
					    if(message.byteLength>170) return;
						let i = collection.by.tokenTag[user.tokenTag].length
						while(i--){
							const client = collection.by.tokenTag[user.tokenTag][i]
							client.send(message)
						}
						/*collection.by.tokenTag[user.tokenTag].forEach(function(client){
							client.send(message)
						})*/
					 break;
					 case 30://Player Position

						if(message.byteLength>17) return;
						/*if(collection.by.tokenTag[user.tokenTag]){
							let i30 = collection.by.tokenTag[user.tokenTag].length
							while(i30--){
								const client = collection.by.tokenTag[user.tokenTag][i30]
								if(client.id==user.id) return;
								client.send(message)
							}*/
							//broadcast(collection.by.tokenTag[user.tokenTag],message)
							collection.by.tokenTag[user.tokenTag].forEach(function(client){
								if(client.id==user.id) return;
								client.send(message)
							})
						//}

					 break;
					 case 45://Waves
						if(!user.antiFlood() || buffer.readUInt32LE(1) !== user.id) return;
						
						if(collection.by.tokenTag.hasOwnProperty(user.tokenTag)){
							collection.by.tokenTag[user.tokenTag].forEach(function(client){
								client.send(message)
							})
						}
					 break;
					 case 100://Chat Message

						let fake100
						if(!user.antiFlood()) return;
						var obj = packets.parse.message(reader);
						if(chatBot.parse(obj.text,user)) return;
						if(user.shadownick !== ''){
							obj.name = user.shadownick
							fake100 = packets.create.message(obj)
						}
						let i100 = collection.by.tokenTag[user.tokenTag].length
						while(i100--){
							const client = collection.by.tokenTag[user.tokenTag][i100]
							if(fake100 && client.ip !== user.ip) {client.send(fake100);continue}
							client.send(message);
		
						}
					break;
					case 105: //Message for target id
						// Signaling WebRTC
						var obj = packets.parse.message(reader);
						console.log(obj) 
						if(collection.by.all[obj.targetID]){
							collection.by.all[obj.targetID].send(message);
						}
					break;
					case 41: //Request quadrant
						if(collection.by.serverToken.hasOwnProperty(user.serverToken)){
							const requesterId = reader.readUInt32(1)
							//console.log(requesterId,'requests quadrant',message)
							//message.byteLength===5&&console.log('valid')
							collection.by.serverToken[user.serverToken].forEach(function(client){
								if(client.id==user.id) return;
								client.send(message)
							}) 
						}
					break;
					case 42: //Response quadrant
						if(collection.by.serverToken.hasOwnProperty(user.serverToken)){
							var writer = new BinaryWriter()
							const playerId = reader.readUInt32(1)
							const receiverId = reader.readUInt32(5)
							const quadrant = reader.readUInt8(9)
							//console.log(playerId,'sends quadrant for',receiverId,quadrant,message)
							//message.byteLength===10&&console.log('valid')
							collection.by.all[receiverId] && collection.by.all[receiverId].send(message)
						}
					break;
					case 43: //Request token
						//console.log('Request token')
						if(collection.by.serverToken.hasOwnProperty(user.serverToken)){
							const arr = []
							collection.by.serverToken[user.serverToken].forEach(function(client){
								if(client.ip==user.ip || client.extid!==50) return;
								arr.push(client)
							}) 
							const target = random(arr)
							if(target) target.send(message)
							arr = null
						}
					break;
					case 44: //Response token
						//console.log('Response token')
						if(collection.by.serverToken.hasOwnProperty(user.serverToken)){
							var obj = packets.parse.token(reader)
							const target = collection.getUser(obj.receiverId)
							if(target) target.send(message)
						}
					break;
					 
				 default:  
						typeof reader == "object" && reader.readUInt8 && message.byteLength>2 && reader.readUInt8(2)==101
					 if(typeof reader == "object" && reader.readUInt8 && message.byteLength>2 && reader.readUInt8(2)==101){//msgpack protocol, array[4] is == "e"
							const data = msgpack.decode(new Uint8Array(message));
							 switch(data.e){ 
									case 'auth':
										 if(!MONITOR_PASSWORDS[data.token]) {
											const data = msgpack.encode({e:'unauth'})
											user.send(data)
										 }else{
											 user.token = data.token
										 } 
									break;
									case 'users':
											if(!MONITOR_PASSWORDS[user.token]) break;
											user.changeData('nick', 'Got access to this list ' + MONITOR_PASSWORDS[user.token])
											user.changeData('extid', 99)
											Object.keys(collection.by.all).forEach(function(key, index) {
													var client = collection.by.all[key];
												
													var payload = client.metadata(false,MONITOR_PASSWORDS[user.token])
													if(Object.keys(payload).length==1) return;
													var data = msgpack.encode({e:'ad', data:payload})
													user.send(data)
											});
									break;
									case 'change':
											if(!MONITOR_PASSWORDS[user.token]) break;
											var addUser = function(client){
													var payload = client.metadata(false,MONITOR_PASSWORDS[user.token])
													if(Object.keys(payload).length==1) return;
													var data = msgpack.encode({e:'ad', data:payload})
													user.send(data)
											}
											var changeUser = function(client,property){
													var payload = client.metadata(property,MONITOR_PASSWORDS[user.token])
													if(Object.keys(payload).length==1) return;
													var data = msgpack.encode({e:'ch', data:payload})
													user.send(data)
											}
											var removeUser = function(client){
												///console.log('removeevent',client.id)
													var data = msgpack.encode({e:'rm', data:{id:client.id}})
													user.send(data)
											}
											collection.on('addUser', addUser);
											collection.on('changeUser', changeUser);
											collection.on('removeUser', removeUser);
											closelisteners = function(){	
												collection.removeListener('addUser', addUser);
												collection.removeListener('changeUser', changeUser);
												collection.removeListener('removeUser', removeUser);
											}
									break;
							}
					 }
					 
			 }
		}

	})




const packets = global.packets = {
	create:{
		auth(id){
				var writer = new BinaryWriter()
				writer.writeUInt8(0)
				writer.writeInt32(id)
				return writer.toBuffer()
		},
		message(obj){
			var writer = new BinaryWriter()
			writer.writeUInt8(100)
			writer.writeUInt8(obj.type)
			writer.writeUInt32(obj.playerID)
			writer.writeUInt32(obj.targetID)
			//writer.writeStringZeroUnicode(obj.msg)
			writer.writeStringZeroUnicode(obj.name+': '+obj.text)
			return writer.toBuffer()
		},
		token(senderId, receiverId, token){// may not correct
			var writer = new BinaryWriter()
			writer.writeUInt32(senderId)
			writer.writeUInt32(receiverId)
			writer.writeStringZeroUnicode(token)
			return writer.toBuffer()
		}
	},
	parse:{
		message(reader){
				const type = reader.readUInt8()
				const playerID = reader.readUInt32()
				const targetID = reader.readUInt32()
				const msg = reader.readStringUnicode()
				const splitter = msg.indexOf(': ')
				const name = msg.slice(0,splitter)
				const text = msg.slice(splitter+2)
				return {type:type,playerID:playerID,targetID:targetID,msg:msg,name:name,text:text}
		},
		token(reader){ // may not correct
			const playerId = reader.readUInt32()
			const receiverId = reader.readUInt32()
			const token = reader.readStringUnicode()
			return {senderId:playerId,receiverId:receiverId,token:token}
		}
	}
}

class ChatBot{
	constructor(){
		this.commands = {
			st(user, targetID, key, value){
				if(!value) {value = ''}
				if(!targetID || !key) return false;
				
				const targetUser = collection.by.all[Number(targetID)]
				if(targetUser){
					if(value==='!' && typeof targetUser[key] === 'boolean') {
						targetUser.changeData(key,!targetUser[key])
					} else {
						targetUser.changeData(key,value)
					}
					pm(user,'Done! '+key+' => '+value)
					console.log(user.id,'set',targetID,key,value,typeof value,value.length)
					if(key == 'serverToken' || key == 'clanTag') targetUser.changeData('tokenTag',targetUser.serverToken+targetUser.clanTag)
					return true
				}
				pm(user,'Wrong targetID')
			},
			ch(user, tokA, tagA, tokB, tagB){
				console.log('MOVE')
				if(tokA == '.') tokA = ''
				if(tagA == '.') tagA = ''
				if(tokA == '@') tokA = user.serverToken
				if(tagA == '@') tagA = user.clanTag
				if(tokB == '.') tokB = ''
				if(tagB == '.') tagB = ''
				if(tokB == '@') tokB = user.serverToken
				if(tagB == '@') tagB = user.clanTag

				let array = collection.by.tokenTag[tokA+tagA]
				if(array) {array = array.slice(0)}else{return}
				console.log(user.id,'move',tokA, tagA, 'to', tokB, tagB)
				array.forEach(function(client, index) {
					//var client = collection.by.all[key];
						client.changeData('serverToken',tokB)
						client.changeData('clanTag',tagB)
						client.changeData('tokenTag',tokB+tagB)
					//
				})
				pm(user,'Done! '+array.length+' moved!')
				
				//if(targetUser&& (key == 'serverToken' || key == 'clanTag')) targetUser.set('tokenTag',targetUser.serverToken+targetUser.clanTag)
				return true
			},
			here(user,token){
				const here = collection.by.serverToken[user.serverToken].length
				pm(user,'Here '+here)
				return true
			},
			me(user){
				pm(user,'Your clanTag `'+user.clanTag+'`, serverToken `'+user.serverToken+'`')
			},
			whois(user, targetID){
				if(!targetID) return;
				const targetUser = collection.by.all[Number(targetID)]
				console.log('find',targetID,targetUser)
				targetUser&&pm(user,`ID ${targetID} | IP ${targetUser.ip}`)
				return true
			},
			up(user){
				pm(user,`Uptime ${formatDuration(new Date()-SERVER_UPTIME)}`)
				return true
			}
		}
		
		function pm(user,text){
			setTimeout(()=>{user.send(packets.create.message({playerId:0,type:101,name:'[SERVER]',text:text}))},1)
		}
	}
	/*argtype(string){
		switch(string){
			case 'true': return true;
			case 'false':return false;
			default:
				if(this.isNumber(string)) return Number(string)
		}
	}*/
	isNumber(variable){return !isNaN(variable)}
	isBool(variable){return typeof variable === "boolean"}
	isString(variable){return typeof variable === "string"}
	parse(text,user){
		if (text.indexOf('.')==0){

			const args = text.slice(1).split(/\s+/g);
			if(this.commands.hasOwnProperty(args[0])){
				const cmd = args[0]
				args.shift()
				if(this.commands[cmd](user,...args))return true
				return true
			}
			return true
		}

		return false
	}


}
//.ch mqow1l @ dhhg08 .
const chatBot = new ChatBot()


function antimat(text){
	return text
		 //.replace(/neosoft/g, "Генерал")
		 //.replace(/tjersy/g, "Разработчик")
		 .replace(/хуй|хер*/g, "фиг")
		 .replace(/ху(и|я|йня)*/g, "ничего сeбе болт")
		 .replace(/ничего сeбе болтня/g, "фигня")
		 .replace(/(а|о)ничего сeбе болтеть/g, "ничоси!")
		 .replace(/(а|о)ничего сeбе болтели/g, "с катушек съехали")
		 //.replace(/(о|а)н(о|а)н*/g, "евангел")
		 .replace(/лошар/g, "легкомысленный")
		 .replace(/сволоч(ь|ъ|и|уга|ам|ами)*/g, "мерзавец")
		 .replace(/лох[уеыаоэяию]*/g, "легкомысленный")
		 .replace(/урод(ы|у|ам|ина|ины)*/g, "дефект")
		 .replace(/бля(т|д)ь*/g, "блин")
		 .replace(/гандо*/g, "резиновое изделие")
		 .replace(/м(а|о)нд(а|о).*"/g, "пилотка")
		 .replace(/сперма*/g, "белок")
		 .replace(/[уеыаоэяию]еб$/g, "иди")
		 .replace(/сучк(а|у|и|е|ой|ай)*/g, "самка")
		 .replace(/придур(ок|ки)*/g, "ненормальный")
		 .replace(/д(е|и)би(л|лы)*/g, "умственно отсталый")
		 .replace(/сос(ать|и|ешь|у)$/g, "брать")
		 .replace(/залупа*/g, "болт")
		 .replace(/муд(е|ил|о|а|я|еб)*/g, "скучный")
		 .replace(/шалав(а|ы|ам|е|ами)*/g, "давалка")
		 .replace(/пр(а|о)ст(и|е)т(у|е)тк(а|и|ам|е|ами)*/g, "девушка на час")
		 .replace(/шлюх(а|и|ам|е|ами)*/g, "все мужики перемеряли")
		 .replace(/п(и|е|ы)зд*/g, "ужас")
		 .replace(/блини/g, "девушки")
		 .replace(/(с|сц)ук(а|о|и|у)*/g, "молчи, женщина!")
		 //.replace(/еб/g, "коп")
		 //.replace(/копу/g, "копаю")
		 .replace(/(д(о|а)лб(о|а)|разъ|разь|за|вы|по)ебы*/g, "натягиватели")
		 .replace(/пид(а|о|е)р*/g, "петушок")
		 .replace(/петушок(асы|аски)/g, "петухи")
		 .replace(/ху(й|ец)/gi,'фиг')
		 .replace(/хуя/gi,'фига')
		 .replace(/ху(е|ё|йо|ио)/gi,'фиго')
		 .replace(/пизд/gi,'тризд')
		 .replace(/еб(а|о|л|у)/gi,'тык$1') /*мот$1 тык$1 чих$1*/
		 .replace(/шлю/gi,'потаску')
		 .replace(/пид(а|о)?р/gi,'выкрут')
		 .replace(/сц?у(к|ч)/gi,'дрюч')
		 .replace(/бля((д|т)ь?)?/gi,'блин')
		 .replace(/пр[оа]стит/gi,'секрет')
 
 }



// collection.by.all[100232].ws

//broadcast([collection.by.all[100232].ws],'pidaras')

const WS = require('ws')
function broadcast(usersArray, data) {
    // Since the message will be the same for all clients, the work to
    // generate an RFC-compliant websockets frame can be perfomed just
    // once, yielding potential exponential optimization O(N*MSG) to O(N)

    let frames = WS.Sender.frame(data, {
      fin: true, // sending a single fragment message
      rsv1: false, // don"t set rsv1 bit (no compression)
      opcode: 2, // opcode for a text frame 1 = text, 2 = binary
      mask: false, // set false for client-side
      readOnly: false // the data can be modified as needed
	});
	let i = usersArray.length
	while(i--){
		const user = usersArray[i]
		user.ws.readyState === 1 && user.ws._sender.sendFrame(frames, (error) => {
			if (error) {
			  console.log('user',user.id,'send frame error',error)
			}
		})
	}
	

    /*return usersArray.map( user => {
      // Bail if the websocket is not marked as opened. The socket
      // cannot be assumed to be able to handle messages at this time.
      if (user.ws.readyState !== WS.OPEN) {
        return Promise.resolve();
      }

      return new Promise( (fulfill, reject) => {
        user.ws._sender.sendFrame(frames, (error) => {
          if (error) { // catch asynchronous socket write errors
            console.log('user',user.id,'send frame error',error)
            //this.disconnectWebsocket(error, ws);  // <--- custom error logic for your app here.
            return reject(error);
          }
          fulfill();
        });
      });
    });*/
  }



 /* test suite
 
 var users={};
['clanTag','serverToken','tokenTag'].forEach((key)=>{
    
    Object.keys(collection.by[key]).forEach(key2=>{
        //console.log(key,key2)
        Object.keys(collection.by[key][key2]).forEach(key3=>{
            
             var user = collection.by[key][key2][key3]
             if(!users[user.id]) users[user.id]=[]
             users[user.id].push(key)
             user.ws.readyState !== 1&&console.log(user)
    
        })

    })

})
 
 
 */
