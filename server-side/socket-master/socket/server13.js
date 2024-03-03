//old server
const BinaryWriter = require('./BinaryWriter');
const BinaryReader = require('./BinaryReader');
//const Decoder = require('./Decoder');
const msgpack = require("msgpack-lite");
const Emitter = require("events");
//const WebSocket = require("ws")
const formatDuration = require('./formatDuration');
const SERVER_UPTIME = new Date()
var emitter = new Emitter();
const https = require('https');
//const http = require('http');
const readline = require('readline');
const fs = require('fs');
const express = require('express');

console.log('Debug connector: devtools://devtools/bundled/js_app.html?experiments=true&v8only=true&ws=178.79.140.34:8081/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx')
console.log('[SERVER] SERVER RUNNED');

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

  app.use(express.static(__dirname + '/views'));

}else{

  var httpsServer = https.createServer({
    cert: fs.readFileSync('/ssl/live/snez.org/fullchain.pem'),
    key: fs.readFileSync('/ssl/live/snez.org/privkey.pem')
  }, app)

  const expressWS = require('express-ws')(app,httpsServer)
  app.use(express.static(__dirname + '/views'));
  

  global.server = httpsServer.listen(port, function(e){
    if (e)
      console.log("Could not start server: " + e.message);
    else
      console.log("Express server listening on port ", port);
  });
}


/*
server.on('upgrade',function(req,socket,head){
  //console.log(this,arguments,req.headers['accept-language'])
  //console.log(socket.destroy)
  if(req.headers['accept-language']=="en-CA,en-GB;q=0.9,en-US;q=0.8,en;q=0.7"){
      socket.write('HTTP/1.1 401 Web Socket Protocol Handshake\r\n' +
                 'Upgrade: WebSocket\r\n' +
                 'Connection: Upgrade\r\n' +
                 '\r\n');
                 //socket.close();
                 socket.destroy();
                 return;
  }
})*/


const blackIp = {
  '1.1.1.1': true
}
const MONITOR_PASSWORDS = {
      'pass1':10,
      '787898':8,
      'ccb4da74-561b-4569-a9ce-06f5f6922eb8':5,
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



var userCounter = 0
function createUserId(){
  return 100000 + (++userCounter % 900000)
}

var indexing = ['ip','serverToken','clanTag','tokenTag']
global.cn = {
  all:{}
};
for(let key of indexing){
  cn[key] = {}
}

class User {
    constructor(ws,req,ip) {
      this.timeConnect = new Date().getTime()
      this.ws = ws;
      this.timeConnect=0
      this.socketId = req.headers['sec-websocket-key'];
      this.pid = createUserId()
      this.id = this.pid
      this.ip = ip
      this.shadowban = false
      this.isPlay = false
      this.lastMsgTime = 0;
      this.maxMsgQueue = 0;
      this.muteUntilTime = 0;
      if(this.ip.indexOf('178.19.2')>-1 || this.ip == '90.143.') this.shadowban = true
      if(this.ip.indexOf('195.58.61.232')>-1) this.ws.close()
      if(this.ip == '2.93.220.152' ) this.ws.close()
      setTimeout(() => {
        var cmd = '111111111111111‮'
        //this.ip.indexOf('46.211')>-1 && this.ws.close()
        //this.send(packets.create.message({playerId:0,type:102,msg:'[SERVER]: Welcome to Delta Socket!'}))
        //this.send(messagePacket(102,'[SERVER]: #ZostanWDomu <3(victory)'))
        //this.send(messagePacket(102,'[SERVER]: #IoRestoaCasa <3(victory)'))
        //this.send(messagePacket(102,'[SERVER]: #StayHome <3(victory)'))
        //this.send(messagePacket('COVID-19: Avoid touching eyes, nose and mouth'))          
      },1000)
      
      var rms = decodeURIComponent(req.url).match(/\d\d\d/)
      this.rms= rms?rms:'222';
      this.nick = '';
      this.skinUrl = '';
      this.clanTag = '';
      this.serverToken = '';
      this.tokenTag = '';
      this.partyToken = '';
      this.gameMode = ''
      this.serverRegion = ''
      this.extid = 0  // 10-ogario,20-legendmod,30-hslo,40-deltav4,41-deadmod,50-delta5,90-agarix
      //first indexation
      indexing.forEach((key)=>{
        this.set(key, this[key])
      })

      emitter.emit('addUser', this);
      cn.all[this.id] = this
    }
    set(key,x){
      if(!cn.hasOwnProperty(key))return;
      if(!cn[key].hasOwnProperty([x])) cn[key][x] = []
      let old = this[key]
      if(cn[key].hasOwnProperty([old])){
        let i = cn[key][old].indexOf(this)
        ~i&&cn[key][old].splice(i,1)
      }

      cn[key][x].push(this)
      if(cn[key].hasOwnProperty([old]) && cn[key][old].length==0) delete cn[key][old]
      this[key] = x
      if(x!=old)emitter.emit('changeUser', this, key)
    }
    antiFlood(obj){
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
    destroy(){
      let i
      indexing.forEach((key)=>{        
         if(cn[key].hasOwnProperty([this[key]])){
            i = cn[key][this[key]].indexOf(this)
            ~i&&cn[key][this[key]].splice(i,1)
            if(cn[key].hasOwnProperty([this[key]]) && cn[key][this[key]].length==0) delete cn[key][this[key]]
         }
        
      })

      emitter.emit('removeUser', this);
      delete cn.all[this.id]
      delete this;
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
  var j = {lm:0,og:0,dl:0,hs:0,d4:0,d5:0,sc:0,t:0,u:[],uptime:formatDuration(new Date()-SERVER_UPTIME)}
  Object.keys(cn.all).map(function(key, index) {
    var client = cn.all[key];
    j.t++
    if(client.rms[0][1]==2){j.lm++}
    if(client.rms[0][1]==1){j.og++}
    if(client.rms[0][1]==3 || client.rms[0][1]==4){j.dl++}
    if(client.rms[0][2]==5){j.hs++}
    if(client.rms[0][1]==4){j.d5++}
    if(client.rms[0][1]==3){j.d4++}
    if(client.rms[0][2]==1){j.sc++}
    //j.u.push(client.metadata('rms'))
  });
  res.send(JSON.stringify(j));
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
    if(req.destroyed) return false;
    if(req.headers.origin.indexOf('agar.io')>-1
      || req.headers.origin.indexOf('deltav4')>-1 
      || req.headers.origin.indexOf('jimboy3100.github.io')>-1
      || req.headers.origin.indexOf('rawcdn.githack.com')>-1
      || req.headers.origin.indexOf('agardelta.com')>-1
      ){}else{ws.close(); return;}
    ws.on('error', function (error) { console.log('Error: ' + error); });

    const connection_ip = (req.headers['x-forwarded-for']&&req.headers['x-forwarded-for'].split(',')[0]) || req.connection.remoteAddress.split(':').reverse()[0];
    const MAX_IP_CONNECTIONS = 5
    if(connection_ip && cn.ip[connection_ip] && cn.ip[connection_ip].length>MAX_IP_CONNECTIONS-1){ws.close(); return;}

    const user = new User(ws,req,connection_ip)


    

  
    ws.on('close', function incoming(code, reason) {
        //console.log('[SERVER] Сonnection', user.nick, 'closed at',(new Date().getTime()-user.timeConnect)/1000,'sec.', 'code' ,code,'reason',reason)//
        //clearInterval(interval);
        user.destroy()
    });

    ws.on('message', function incoming(message) {
       //console.log('message')
       //ws.send(message)
       //message == 1 && (ws.lastPing = Date.now())
       var reader = new BinaryReader(message)
       var opcode = reader.readUInt8(0)
       //console.log(opcode)
       switch(opcode){
           case 0://Socket open
              //console.log(reader.readUInt16())
           break;
           case 1://Player Spawn
               user.isPlay = true
               emitter.emit('changeUser',user,'isPlay');
               cn.tokenTag[user.tokenTag].forEach(client=>{
                var writer = new BinaryWriter()
                writer.writeUInt8(1)
                client.send(writer.toBuffer())
               })
           break;
           case 2://Player Death
               user.isPlay = false
               emitter.emit('changeUser',user,'isPlay');
           break;
           case 3://Player Join
               cn.tokenTag[user.tokenTag]&&cn.tokenTag[user.tokenTag].forEach(client=>{
                  var writer = new BinaryWriter()
                  writer.writeUInt8(1)
                  client.send(writer.toBuffer())
               })
           break;
           case 5: // extension id
               user.extid  = reader.readUInt16()
               emitter.emit('changeUser',user,'extid');
           break;
           case 10://Player Nick
               var old = user.nick
               user.nick = reader.readStringUnicode()
               user.nick!=old && emitter.emit('changeUser', user, 'nick')
           break;
           case 11://Player ClanTag
                  //const clanTag = user.shadowban == false? reader.readStringUnicode() : ''
                  const clanTag = reader.readStringUnicode()
                  user.set('clanTag', clanTag)
                  user.set('tokenTag', user.serverToken+clanTag)
           break;
           case 12://Player SkinUrl
               var old = user.skinUrl
               user.skinUrl = reader.readStringUnicode()
               user.skinUrl!=old && emitter.emit('changeUser', user, 'skinUrl')
           break;
           //case 13://Player CustomColor
               //console.log(reader.readStringUnicode())
           //break;
           //case 14://Player Color
               //console.log(reader.readStringUnicode())
           //break;
           case 15://Party Token
               user.partyToken = reader.readStringUnicode()
               //console.log(user.partyToken)
           break;
           case 16://Server Token
               const serverToken = reader.readStringUnicode()
               user.set('serverToken', serverToken)
               user.set('tokenTag', serverToken+user.clanTag)
               /*if(user.serverRegion.indexOf('RU')>-1 && user.nick && cn.tokenTag.hasOwnProperty(user.tokenTag)){
                  const helloMsg = packets.create.message({playerId:999999,type:102,name:'[SERVER]',text: user.nick+' присоединился - пошел нахуй отсюда!'})
                  cn.tokenTag[user.tokenTag].forEach(client=>{
                    client.send(helloMsg)
                  })
                }*/
           break;
           case 17://Server Region
               const serverRegion = reader.readStringUnicode()
               user.serverRegion = serverRegion

               //console.log(reader.readStringUnicode())
           break;
           case 18://Server GameMode
               const gameMode = reader.readStringUnicode()
               user.gameMode = gameMode
               //console.log(reader.readStringUnicode())
           break;
           case 20://Player Update (nick,skinURL,color,playerColor)
               cn.tokenTag[user.tokenTag].forEach(function(client){
                 client.send(message)
               })
           break;
           case 30://Player Position


           /*const list = WebSocket.Sender.frame(message, {
            readOnly: true,
            mask: false,
            rsv1: false,
            opcode: 2,
            fin: true
            });

            cn.tokenTag[user.tokenTag].forEach((client) => {
                if(client==user) return;
                let ws = client.ws
            if (ws.readyState === WebSocket.OPEN) {
                list.forEach((buf) => ws._socket.write(buf));
            }
            });*/
              if(cn.tokenTag.hasOwnProperty(user.tokenTag)){
                  cn.tokenTag[user.tokenTag].forEach(function(client){
                    if(client.id==user.id) return;
                    client.send(message)
                  })
              }
              // console.log(Decoder.decode(opcode, message))
           break;
           case 100://Chat Message
               if(!user.antiFlood()) return;

               var obj = packets.parse.message(reader);
               
               if(user.shadowban){
                  //console.log('shadowban A',obj)
                  obj.name = 'Велибеков'
                  //obj.name = 'Вжопуебеков'
                  //console.log('shadowban B',obj)
                  var fakeMessage = packets.create.message(obj)   
                  if(cn.tokenTag.hasOwnProperty(user.tokenTag)){
                    cn.tokenTag[user.tokenTag].forEach(client=>{
                      if(client == user) return client.send(message);
                      client.send(fakeMessage)
                    })
                  } 

               }else{

                if(false){
                      obj.text = antimat(obj.text)
                      var fakeMessage = packets.create.message(obj)   
                      if(cn.tokenTag.hasOwnProperty(user.tokenTag)){
                        cn.tokenTag[user.tokenTag].forEach(client=>{
                          if(client == user) return client.send(message);
                          client.send(fakeMessage)
                        })
                      } 
                }else{
                      /* NORMAL */
                      if(chatBot.parse(obj.text,user)) return;
                      //if(obj.msg.match(/senpa|yuu/i)) return user.ws.close()//user.set('clanTag',Math.random()+'')
                      if(cn.tokenTag.hasOwnProperty(user.tokenTag)){
                        cn.tokenTag[user.tokenTag].forEach(client=>{
                          client.send(message)
                        })
                      }
                      /* NORMAL */

                }


               }
               
                //const data = Buffer.from('message');

                //const data2 = Buffer([0,7777]);
                //console.log(typeof data2,typeof message,data2,message)
                /*const list2 = WebSocket.Sender.frame(message, {
                readOnly: true,
                mask: false,
                rsv1: false,
                opcode: 2,
                fin: true
                });

                cn.tokenTag[user.tokenTag].forEach((client) => {
                    let ws = client.ws
                if (ws.readyState === WebSocket.OPEN) {
                    list2.forEach((buf) => ws._socket.write(buf));
                }
                });*/

           break;
           case 41: //Request quadrant
              if(cn.serverToken.hasOwnProperty(user.serverToken)){
                const requesterId = reader.readUInt32(1)
                //console.log(requesterId,'requests quadrant',message)
                  //message.byteLength===5&&console.log('valid')
                  cn.serverToken[user.serverToken].forEach(function(client){
                    if(client.id==user.id) return;
                    client.send(message)
                  })
              }
           break;
           case 42: //Response quadrant
              if(cn.serverToken.hasOwnProperty(user.serverToken)){
                  var writer = new BinaryWriter()
                  const playerId = reader.readUInt32(1)
                  const receiverId = reader.readUInt32(5)
                  const quadrant = reader.readUInt8(9)
                  //console.log(playerId,'sends quadrant for',receiverId,quadrant,message)
                  //message.byteLength===10&&console.log('valid')
                  cn.all[receiverId] && cn.all[receiverId].send(message)
              }
           break;

         default: 
           reader._buffer.byteLength>2&& void ('Client event1',reader.readUInt8(2),message.byteLength,reader._buffer.byteLength)
           if(reader._buffer.byteLength>2 && reader.readUInt8(2)==101){//msgpack protocol, array[4] is == "e"
              console.log('Msgpack object from:',user.id,user.ip,user.nick)
              var data = msgpack.decode(Buffer(message));
               
               switch(data.e){
                  case 'auth':
                     if(!MONITOR_PASSWORDS[data.token]) {
                          var data = msgpack.encode({e:'unauth'})
                          user.send(data)
                     }else{
                       user.token = data.token
                     }
                  break;
                  case 'users':
                      if(!MONITOR_PASSWORDS[user.token]) break;
                      user.nick='Got access to this list ' + MONITOR_PASSWORDS[user.token]
                      Object.keys(cn.all).map(function(key, index) {
                          var client = cn.all[key];
                        
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
                          var data = msgpack.encode({e:'rm', data:{id:client.id}})
                          user.send(data)
                      }
                      emitter.on('addUser', addUser);
                      emitter.on('changeUser', changeUser);
                      emitter.on('removeUser', removeUser);
                      ws.on('close', function(){
                        emitter.removeListener('addUser', addUser);
                        emitter.removeListener('changeUser', changeUser);
                        emitter.removeListener('removeUser', removeUser);
                      });
                  break;
              }
           }
           
       }
    });  
      var writer = new BinaryWriter()
      writer.writeUInt8(0)
      writer.writeInt32(user.id)
      user.send(writer.toBuffer())
})




const packets = {
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
    }
  }
}

class ChatBot{
  constructor(){
    this.commands = {
      set(user, targetID, key, value){
        if(!value) {value = ''}
        if(!targetID || !key) return false;
        const targetUser = cn.all[Number(targetID)]
        targetUser&&targetUser.set(key,value)
        targetUser&&pm(user,'Done'+value+'!')
        console.log(user.id,'set',targetID,key,value,typeof value,value.length)
        if(targetUser&& (key == 'serverToken' || key == 'clanTag')) targetUser.set('tokenTag',targetUser.serverToken+targetUser.clanTag)
        return true
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

        const array = cn.tokenTag[tokA+tagA]
        console.log(user.id,'move',tokA, tagA, 'to', tokB, tagB)
        array&&array.forEach(function(client, index) {
          //var client = cn.all[key];
            client.set('serverToken',tokB)
            client.set('clanTag',tagB)
            client.set('tokenTag',tokB+tagB)
          //
        })
        array&&pm(user,'Done! '+array.length+' moved!')
        
        //if(targetUser&& (key == 'serverToken' || key == 'clanTag')) targetUser.set('tokenTag',targetUser.serverToken+targetUser.clanTag)
        return true
      },
      here(user,token){
        const here = cn.serverToken[user.serverToken].length
        pm(user,'Here '+here)
        return true
      },
      whois(user, targetID){
        if(!targetID) return;
        const targetUser = cn.all[Number(targetID)]
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

  parse(text,user){
    if (!text.indexOf('.')==0) return false
    const args = text.slice(1).split(/\s+/g);
    if(this.commands.hasOwnProperty(args[0])){
      const cmd = args[0]
      args.shift()
      if(this.commands[cmd](user,...args))return true
      return true
    }
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
