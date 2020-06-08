window.changeOnline = function(option) {
  console.log("online switcher")

                //8, 1, 18, 13, 8, 80, 130, 5, 8, 10, 6, 8, 2, 16, 13, 32, 0
    var bytes = [8, 1, 18, 13, 8, 80, 130, 5, 8, 10, 6, 8, 2, 16, 13, 32, option];
    window.core.proxyMobileData(bytes);
}
window.openPotion = function(slot) {
  console.log("open pot", slot)

                //8, 1, 18, 7, 8, 124, 226, 7, 2, 8, 1
    var bytes = [8, 1, 18, 7, 8, 124, 226, 7, 2, 8, slot];
    window.core.proxyMobileData(bytes);
}

window.brewPotion= function(slot) {
  console.log("drew pot", slot)

                 //8, 1, 18, 7, 8, 122, 210, 7, 2, 8, 2
    var bytes = [8, 1, 18, 7, 8, 122, 210, 7, 2, 8, slot];
    window.core.proxyMobileData(bytes);
}

window.questActivationReq = function() {
  console.log("quest req")
    var bytes = [8, 1, 18, 17, 8, 110, 242, 6, 12, 10, 10, 100, 97, 105, 108, 121, 81, 117, 101, 115, 116];//agario_proto_Activate_$timed_$event_$request {eventId: "dailyQuest"}
               //8, 1, 18, 17, 8, 110, 242, 6, 12, 10, 10, 100, 97, 105, 108, 121, 81, 117, 101, 115, 116
    window.core.proxyMobileData(bytes);
}
window.activateQuest = function() {
  console.log("quest act")
    var bytes = [8, 1, 18, 27, 8, 114, 146, 7, 22, 10, 20, 113, 117, 101, 115, 116, 95, 97, 99, 116, 105, 118, 97, 116, 105, 111, 110, 95, 50, 52, 104];//agario_proto_Activate_$quest_$request {productId: "quest_activation_24h"}
               //8, 1, 18, 27, 8, 114, 146, 7, 22, 10, 20, 113, 117, 101, 115, 116, 95, 97, 99, 116, 105, 118, 97, 116, 105, 111, 110, 95, 50, 52, 104
    window.core.proxyMobileData(bytes);
}
window.changeSkin = function(productID) {
  console.log("quchange skin", productID)

  if(productID==null) return
    //agario_proto_User_$setting {hasField__0: 0, type: 1, key: 1, valueString: "skin_empty"}
  //8, 1, 18, 23, 8, 80, 130, 5, 18, 10, 16, 8, 1, 16, 1, 26, 10, 115, 107, 105, 110, 95, 101, 109, 112, 116, 121
  //8, 1, 18, 23, 8, 80, 130, 5, 16, 8, 1, 16, 1, 26, 10, 115, 107, 105, 110, 95, 101, 109, 112, 116, 121
  //agario_proto_User_$setting {hasField__0: 0, type: 1, key: 1, valueString: "skin_kraken"}
  //8, 1, 18, 24, 8, 80, 130, 5, 19, 10, 17, 8, 1, 16, 1, 26, 11, 115, 107, 105, 110, 95, 107, 114, 97, 107, 101, 110
  //agario_proto_User_$setting {hasField__0: 0, type: 1, key: 1, valueString: "skin_custom_50b62972-d334-4878-b4c8-8ea5f3fade18_4b5dadc9-2543-4401-8ce5-1cf220dba247"}
  //8, 1, 18, 98, 8, 80, 130, 5, 93, 10, 91, 8, 1, 16, 1, 26, 85, 115, 107, 105, 110, 95, 99, 117, 115, 116, 111, 109, 95, 53, 48, 98, 54, 50, 57, 55, 50, 45, 100, 51, 51, 52, 45, 52, 56, 55, 56, 45, 98, 52, 99, 56, 45, 56, 101, 97, 53, 102, 51, 102, 97, 100, 101, 49, 56, 95, 52, 98, 53, 100, 97, 100, 99, 57, 45, 50, 53, 52, 51, 45, 52, 52, 48, 49, 45, 56, 99, 101, 53, 45, 49, 99, 102, 50, 50, 48, 100, 98, 97, 50, 52, 55
    
			var encode = function(str) {
				bytes.push(str.length);
				for(var i = 0; i < str.length; i++) {
					bytes.push(str.charCodeAt(i));
				}
			};
			var bytes = [8, 1, 18, productID.length + 13, 8, 80, 130, 5, productID.length + 8, 10, productID.length + 6, 8, 1, 16, 1, 26];
			encode(productID);
      console.log(bytes)

			window.core.proxyMobileData(bytes);
},
  
window.autocoins= function() {
  console.log("autocoins")

    var bytes = [8, 1, 18, 18, 8, 110, 242, 6, 13, 10, 11, 104, 111, 117, 114, 108, 121, 66, 111, 110, 117, 115]
    window.core.proxyMobileData(bytes);
}

function buyBoost(req) {
  console.log("bue boost", req)

    var bytes = [],
        type = "1_"+req;
    
    switch (type) {
            case "1_mass_boost_2x_1h":
              console.log('"1_mass_boost_2x_1h"');
              bytes= [8, 1, 18, 25, 8, 70, 178, 4, 20, 10, 18, 49, 95, 109, 97, 115, 115, 95, 98, 111, 111, 115, 116, 95, 50, 120, 95, 49, 104];
              break;
            case "1_mass_boost_2x_24h":
              console.log('"1_mass_boost_2x_24h"');
              bytes= [8, 1, 18, 26, 8, 70, 178, 4, 21, 10, 19, 49, 95, 109, 97, 115, 115, 95, 98, 111, 111, 115, 116, 95, 50, 120, 95, 50, 52, 104];
              break;
            case "1_mass_boost_3x_1h":
              console.log('"1_mass_boost_3x_1h"');
              bytes=  [8, 1, 18, 25, 8, 70, 178, 4, 20, 10, 18, 49, 95, 109, 97, 115, 115, 95, 98, 111, 111, 115, 116, 95, 51, 120, 95, 49, 104];
              break;
            case "1_mass_boost_3x_24h":
              console.log('"1_mass_boost_3x_24h"');
              bytes= [8, 1, 18, 26, 8, 70, 178, 4, 21, 10, 19, 49, 95, 109, 97, 115, 115, 95, 98, 111, 111, 115, 116, 95, 51, 120, 95, 50, 52, 104];
              break;
            case "1_xp_boost_2x_1h":
              console.log('"1_xp_boost_2x_1h"');
              bytes= [8, 1, 18, 23, 8, 70, 178, 4, 18, 10, 16, 49, 95, 120, 112, 95, 98, 111, 111, 115, 116, 95, 50, 120, 95, 49, 104];
              break;
            case "1_xp_boost_2x_24h":
              console.log('"1_xp_boost_2x_24h"');
              bytes= [8, 1, 18, 24, 8, 70, 178, 4, 19, 10, 17, 49, 95, 120, 112, 95, 98, 111, 111, 115, 116, 95, 50, 120, 95, 50, 52, 104];
              break;
            case "1_xp_boost_3x_1h":
              console.log('"1_xp_boost_3x_1h"');
              bytes= [8, 1, 18, 23, 8, 70, 178, 4, 18, 10, 16, 49, 95, 120, 112, 95, 98, 111, 111, 115, 116, 95, 51, 120, 95, 49, 104];
              break;
            case "1_xp_boost_3x_24h":
              console.log('"1_xp_boost_3x_24h"');
              bytes= [8, 1, 18, 24, 8, 70, 178, 4, 19, 10, 17, 49, 95, 120, 112, 95, 98, 111, 111, 115, 116, 95, 51, 120, 95, 50, 52, 104];
              break;
            default:
              console.log('unknown');
    }
    window.core.proxyMobileData(bytes);
}
function useBoost(type) {
  console.log("use boost", type)

    var bytes = []

    switch (type) {
            case "mass_boost_2x_1h":
              console.log('"mass_boost_2x_1h"');
              bytes= [8, 1, 18, 23, 8, 112, 130, 7, 18, 10, 16, 109, 97, 115, 115, 95, 98, 111, 111, 115, 116, 95, 50, 120, 95, 49, 104];
              break;
            case "mass_boost_2x_24h":
              console.log('"mass_boost_2x_24h"');
              bytes= [8, 1, 18, 24, 8, 112, 130, 7, 19, 10, 17, 109, 97, 115, 115, 95, 98, 111, 111, 115, 116, 95, 50, 120, 95, 50, 52, 104];
              break;
            case "mass_boost_3x_1h":
              console.log('"mass_boost_3x_1h"');
              bytes=  [8, 1, 18, 23, 8, 112, 130, 7, 18, 10, 16, 109, 97, 115, 115, 95, 98, 111, 111, 115, 116, 95, 51, 120, 95, 49, 104];
              break;
            case "mass_boost_3x_24h":
              console.log('"mass_boost_3x_24h"');
              bytes= [8, 1, 18, 24, 8, 112, 130, 7, 19, 10, 17, 109, 97, 115, 115, 95, 98, 111, 111, 115, 116, 95, 51, 120, 95, 50, 52, 104];
              break;
            case "xp_boost_2x_1h":
              console.log('"xp_boost_2x_1h"');
              bytes= [8, 1, 18, 21, 8, 112, 130, 7, 16, 10, 14, 120, 112, 95, 98, 111, 111, 115, 116, 95, 50, 120, 95, 49, 104];
              break; 
            case "xp_boost_2x_24h":
              console.log('"xp_boost_2x_24h"');
              bytes= [8, 1, 18, 22, 8, 112, 130, 7, 17, 10, 15, 120, 112, 95, 98, 111, 111, 115, 116, 95, 50, 120, 95, 50, 52, 104];
              break;
            case "xp_boost_3x_1h":
              console.log('"xp_boost_3x_1h"');
              bytes= [8, 1, 18, 21, 8, 112, 130, 7, 16, 10, 14, 120, 112, 95, 98, 111, 111, 115, 116, 95, 51, 120, 95, 49, 104];
              break;
            case "xp_boost_3x_24h":
              console.log('"xp_boost_3x_24h"');
              bytes= [8, 1, 18, 22, 8, 112, 130, 7, 17, 10, 15, 120, 112, 95, 98, 111, 111, 115, 116, 95, 51, 120, 95, 50, 52, 104];
              break;
            default:
              console.log('unknown');
    }
    window.core.proxyMobileData(bytes);
}



var windows = []
var workers = {}
var fakeTag = ''
var step = 0;
var addWindow = function(){
    win = window.open('https://agar.io/generator', "", "toolbar,scrollbars,resizable,top=500,left=500,width=500,height=200")
    windows.push(win)
}

window.addEventListener("message", function(event) {
    try{
    var id = event.source.ID//windows.indexOf(event.source)
    if(event.data.type == 'ready_'){
        workers[id] = {ready:true,window:event.source}
        console.log('[worker id '+id+' ready]')
    }
    if(event.data.type == 'processing_'){
        workers[id].ready=false
    }
    if(event.data.type == 'token_'){
        console.log(id,'token:')//,event.data.data)
        workers[id].ready=true
        connection.getAndSendToken(event.data.data,id)
    }
    if(event.data.type == 'unload_'){
       
        windows.splice(windows.indexOf(workers[id].window),1);
        delete workers[id]
    }
}catch(e){}
});


window.addEventListener('beforeunload',function(){
    windows.forEach(function(win){
        win.close()
    })   
})


window.server = {
    host: 'ws://pidaras-gomosek-master.repl.co'
}
class Writer {
    constructor(size){
        this.dataView = new DataView(new ArrayBuffer(size))
        this.byteOffset = 0
    }
    writeUint8(value){
        this.dataView.setUint8(this.byteOffset++, value)
    }
    writeInt32(value){
        this.dataView.setInt32(this.byteOffset, value, true)
        this.byteOffset += 4
    }
    writeUint32(value){
        this.dataView.setUint32(this.byteOffset, value, true)
        this.byteOffset += 4
    }
    writeString(string){
        for(let i = 0; i < string.length; i++) this.writeUint8(string.charCodeAt(i))
        this.writeUint8(0)
    }
}
window.buffers = {
    startBots(url, protocolVersion, clientVersion, userStatus, botsName, targetSkin, targetNick, botsAmount){
        const writer = new Writer(13 + 2 + url.length + botsName.length + targetSkin.length + targetNick.length)
        writer.writeUint8(0)
        writer.writeString(url)
        writer.writeUint32(protocolVersion)
        writer.writeUint32(clientVersion)
        writer.writeUint8(Number(userStatus))
        writer.writeString(botsName)
        writer.writeString(targetSkin)
        writer.writeString(targetNick)
        writer.writeUint8(botsAmount)
        return writer.dataView.buffer
    },
    mousePosition(x, y, gX, gY){//Yahnych
        const writer = new Writer(17)
        writer.writeUint8(6)
        writer.writeInt32(x)
        writer.writeInt32(y)
        writer.writeInt32(gX)
        writer.writeInt32(gY)
        return writer.dataView.buffer
    }
}
window.connection = {
    ws: null,
    connect(){
        this.ws = new WebSocket(`${window.server.host}`)
        this.ws.binaryType = 'arraybuffer'
        this.ws.onopen = this.onopen.bind(this)
        this.ws.onmessage = this.onmessage.bind(this)
        this.ws.onclose = this.onclose.bind(this)
    },
    send(buffer){
        if(this.ws && this.ws.readyState === WebSocket.OPEN) this.ws.send(buffer)
    },
    onopen(){
        document.getElementById('userStatus').style.color = '#00C02E'
        document.getElementById('userStatus').innerText = 'Connected'
        document.getElementById('connect').disabled = true
        document.getElementById('startBots').disabled = false
        document.getElementById('stopBots').disabled = false
    },
    /*sendToken(token) {
        if (token === undefined) return;
        let buf = new Writer(2 + token.length);
        buf.writeUint8(7);
        buf.writeString(token);
        window.connection.send(buf.dataView.buffer)
    },*/
    getAndSendToken(token,windowID){
        var self = this
        if(bots.tokenqueue.length==0) return;
        //if(grecaptcha.v2mode==true) window.requestCaptchaV3()
        var id = 0
        function sendToken(){
            console.log('передать для',id)
            const writer = new Writer(3 + token.length)
            writer.writeUint8(9)
            writer.writeUint8(id)
            writer.writeString(token)
            self.ws.send(writer.dataView.buffer)
        }
        id = bots.tokenqueue.pop()
        sendToken(token)

        for(var id in workers){
            var isFree = workers[id].ready
            if(!isFree) continue;
            //console.log('пизда пизда пизда')
            workers[id].ready=false
            workers[id].window.postMessage({type:'request_'})
            
        }

       // workers[windowID].window.postMessage({type:'request_'})
        /*for(var id in window.workers){
            var isFree = window.workers[id]
            windows[id]
        }
        Object.keys(window.workers).forEach(function(id){
            var isFree = window.workers[id]
        })*/
        //newWin.postMessage({type:'request_'})
        
    
    },
    sendNick(nick){
        let send = window.unescape(window.encodeURIComponent(nick))
        const writer = new Writer(2 + send.length)
        writer.writeUint8(10)
        writer.writeString(send)
        if(this.ws&&nick.length!=0)this.ws.send(writer.dataView.buffer)
    },
    sendTargetNick(nick){
        let send = window.unescape(window.encodeURIComponent(nick))
        const writer = new Writer(2 + send.length)
        writer.writeUint8(11)
        writer.writeString(send)
        if(this.ws&&nick.length!=0)this.ws.send(writer.dataView.buffer)
    },
    sendTargetSkin(skin){
        const writer = new Writer(2 + skin.length)
        writer.writeUint8(12)
        writer.writeString(skin)
        if(this.ws&&skin.length!=0)this.ws.send(writer.dataView.buffer)
    },
    sendAmount(amount){
        const writer = new Writer(1 + 4)
        writer.writeUint8(13)
        writer.writeUint32(amount)
        this.ws&&this.ws.send(writer.dataView.buffer)
    },
    onmessage(message){
        const dataView = new DataView(message.data)
        switch(dataView.getUint8(0)){
            case 0:
                document.getElementById('startBots').disabled = true
                document.getElementById('stopBots').disabled = false
                document.getElementById('startBots').style.display = 'none'
                document.getElementById('stopBots').style.display = 'inline'
                document.getElementById('stopBots').innerText = 'Stop Bots'
                window.user.startedBots = true
                break
            case 1:
                document.getElementById('stopBots').disabled = true
                document.getElementById('stopBots').innerText = 'Stopping Bots...'
                bots.tokenqueue.length=0
                break
            case 2:
                document.getElementById('botsAI').style.color = '#DA0A00'
                document.getElementById('botsAI').innerText = 'Disabled'
                document.getElementById('startBots').disabled = false
                document.getElementById('stopBots').disabled = true
                document.getElementById('startBots').style.display = 'inline'
                document.getElementById('stopBots').style.display = 'none'
                document.getElementById('stopBots').innerText = 'Stop Bots'
                bots.tokenqueue.length=0
                window.user.startedBots = false
                window.bots.ai = false
                break
            case 3:
                toastr.info('Your IP has captcha and bots are unable to spawn, change your ip with a VPN or something to one that doesn\'t has captcha in order to use the bots')
                break
            case 4:
            $('#botCount').html(`${dataView.getUint8(1)}/${dataView.getUint8(2)}/${window.bots.amount}`)
                break;
            case 5:
            //$('#slots').html(dataView.getUint8(1) + "/200")
                break;
            case 9:
                var id=dataView.getUint8(1);
                var isFirst = bots.tokenqueue.length==0
                bots.tokenqueue.unshift(id)
                //isFirst&&newWin.postMessage({type:'request_'})
                if(!isFirst)return;


                var i = bots.tokenqueue.length
                for(var id in workers){
                    var isFree = workers[id].ready
                    if(!isFree) continue;
                    console.log('пизда пизда пизда')
                    workers[id].ready=false
                    workers[id].window.postMessage({type:'request_'})
                    break;
                }

                console.log('TOKEN REQUESTED',dataView,dataView.getUint8(1))
                break;
        }
    },
    onclose(){
        document.getElementById('userStatus').style.color = '#DA0A00'
        document.getElementById('userStatus').innerText = 'Disconnected'
        document.getElementById('botsAI').style.color = '#DA0A00'
        document.getElementById('botsAI').innerText = 'Disabled'
        document.getElementById('connect').disabled = false
        document.getElementById('startBots').disabled = true
        document.getElementById('stopBots').disabled = true
        document.getElementById('startBots').style.display = 'inline'
        document.getElementById('stopBots').style.display = 'none'
        bots.tokenqueue=[]
        window.user.startedBots = false
        window.bots.ai = false
    }
}
window.game = {
    url: '',
    protocolVersion: 0,
    clientVersion: 0
}
window.user = {
    startedBots: false,
    isAlive: false,
    mouseX: 0,
    mouseY: 0,
    offsetX: 0,
    offsetY: 0,
    ghostX: 0,//Yahnych
    ghostY: 0,
    macroFeedInterval: null
}
window.bots = {
    tokenqueue:[],
    name: '',
    targetSkin: '',
    targetNick: '',
    amount: 0,
    ai: false
}
console.log('[APP] Loaded')

const displayText = {
    pl: {
        start: `Start`,
        settings: `Ustawienia`,
        restoreSettings: `Przywróc ustawienia domyślne`,
        animationGroup: `Animacja`,
        zoomGroup: `Zoom`,
        newGroup:'New',
        stickyCell:'Sticky cell (RMB & LMB)',
        reverseTrick:'Reverse trick',
        clickTargeting: 'Click targeting',
        deltaSocket: 'Delta socket',
        autobrewing: 'Autobrewing',
        onlineStatus: 'Show me online(Facebook)',
        autosearchFB: 'Autosearch Facebook friends',
        'macroFeeding': 'Macro feed (80ms)',
        'renderQuality':'Rendering quality (1)',
        'debug':'Debug',
        'mapLocalFix3':'Map Fix on re-join',
        'mapGlobalFix4':'Map Global Fix (from LM)',
        'cameraDelay':'Camera delay (0)',
        'showExtraMiniMapGuides':'Show extra minimap guides',
        respGroup: `Odrodzenie`,
        namesGroup: 'Nazwy',
        massGroup: 'Masa',
        skinsGroup: `Skiny`,
        foodGroup: `Pokarm`,
        transparencyGroup: `Przezroczystość / kolory`,
        gridGroup: `Siatka / sektory`,
        miniMapGroup: `Minimapa`,
        helpersGroup: `Wspomagacze`,
        mouseGroup: `Sterowanie myszką`,
        hudGroup: `HUD`,
        chatGroup: `Czat`,
        statsGroup: 'Statystyki',
        extrasGroup: `Dodatkowe`,
        noSkins: `Wyłącz skiny`,
        cellContours: `Only cells contours`,
        noNames: 'Wyłącz nazwy',
        noColors: `Wyłącz kolory`,
        showMass: 'Pokaż masę',
        skipStats: `Pomiń statystyki po śmierci`,
        showQuest: `Pokaż zadanie (quest)`,
        autoZoom: `Auto zoom`,
        animation: `Opóźnienie animacji`,
        zoomSpeedValue: `Szybkość zoomu`,
        quickResp: `Szybkie odrodzenie (klawisz)`,
        autoResp: 'Auto odrodzenie',
        autoHideCellsInfo: `Autoukrywanie nazw i masy`,
        autoHideNames: `Autoukrywanie nazw`,
        autoHideMass: `Autoukrywanie masy`,
        autoHideFood: `Autoukrywanie pokarmu (masa)`,
        autoHideFoodOnZoom: `Autoukrywanie pokarmu (zoom)`,
        optimizedNames: `Zoptymalizowane nazwy`,
        hideMyName: `Ukryj własną nazwę`,
        hideTeammatesNames: `Ukryj nazwy graczy teamu`,
        optimizedMass: `Zoptymalizowana masa (+/-2%)`,
        shortMass: `Skrócona masa (k)`,
        virMassShots: `Licznik strzałów (wirusy)`,
        hideMyMass: `Ukryj własną masę`,
        hideEnemiesMass: 'Ukryj masę przeciwników',
        vanillaSkins: `Podstawowe skiny`,
        customSkins: 'Własne skiny',
        FBSkins: 'Facebook avatars as skin',
        myTransparentSkin: `Mój przezroczysty skin`,
        myCustomColor: `Mój własny kolor`,
        transparentCells: `Przezroczyste kulki`,
        transparentViruses: `Przezroczyste wirusy`,
        transparentSkins: 'Przezroczyste skiny',
        showGrid: `Siatka`,
        showBgSectors: 'Sektory w tle',
        showMapBorders: `Granice mapy`,
        rainbowBorders: `Rainbow borders`,
        newRainbowBorders: `New rainbow borders (less FPS)`,
        showGhostCells: `Duchy kulek`,
        showMiniMap: `Pokaż minimapę`,
        showMiniMapGrid: `Pokaż siatkę minimapy`,
        showMiniMapGuides: 'Pokaż prowadnice na minimapie',
        showMiniMapGhostCells: `Pokaż duchy kulek na minimapie`,
        oneColoredTeammates: `Jednokolorowi gracze`,
        rainbowFood: `Kolorowy pokarm`,
        oppColors: 'Kolory przeciwników',
        oppRings: `Ringi przeciwników`,
        bubbleInd: `Bubble indicators`,
        virColors: `Kolory wirusów`,
        splitRange: `Zasięg podziału`,
    'qdsplitRange': 'Quick double split range', //Sonia2
    'sdsplitRange': 'Slow double split range', //Sonia2
        virusesRange: `Zasięg wirusów`,
        textStroke: `Obwódki nazw i masy`,
        namesStroke: `Obwódki nazw`,
        massStroke: `Obwódki masy`,
        cursorTracking: 'Śledzenie kursora',
        bubbleCursorTracker: 'Bubble tracker',
        FBTracking: 'Facebook bubble tracker',
        ingameSpectator: 'Ingame spectator',
        fullSpectator: 'Full spectator',
        oneColoredSpectator: 'One-colored spectator',
        teammatesInd: `Wskaźniki graczy teamu`,
        mouseSplit: `LPM - Split myszką`,
        mouseFeed: `PPM - Feed myszką`,
        mouseInvert: `Odwróć klawisze myszki`,
        disableChat: `Wyłącz czat`,
        coloredNicks: `Colored nicknames`,
        hideChat: `Ukryj czat`,
        chatSounds: 'Powiadomienia dźwiękowe',
        chatEmoticons: `Emotikony`,
        showChatImages: 'Pokaż obrazki na czacie',
        showChatVideos: 'Pokaż filmiki na czacie',
        showChatBox: `Czatbox zamiast wyskakujących wiadomości`,
        messageSound: `Dźwięk powiadomienia o wiadomości`,
        commandSound: `Dźwięk powiadomienia o komendzie`,
        virusSounds:'Virus eject sound',
        virusSoundURL:'Virus eject sound URL',
        FacebookIDs: `Facebook IDs`,
        skinsForSearch: 'Target skin',//`Небо затягнуте хмарами`,
        nicksForSearch: 'Target nick',//`Стільки всього не сказали ми`,
        extras: 'Stickers',
        discord: 'Discord webhook URL',
        showTop5: `Pokaż top 5 teamu`,
        showTop5Sectors:'Show top 5 sectors',
        showTargeting: 'Pokaż namierzanie',
        showTime: `Pokaż aktualny czas`,
        showLbData: 'Pokaż masę w topce',
        normalLb: `Nagłówek "Topka"`,
        centeredLb: `Wyśrodkowana topka`,
        fpsAtTop: `Statystyki na górze`,
        targetSearch: 'Target search',//`Небо затягнуте хмарами`,
        showStats: `Pokaż statystyki`,
        showStatsMass: `Statystyki: Masa`,
        showStatsSTE: `Statystyki: STE`,
        showStatsN16: `Statystyki: n/16`,
        showStatsFPS: `Statystyki: FPS`,
        'showStatsPPS': 'Statystyki: PPS',
        blockPopups: `Blokuj popupy (reklamy/sklep/zadanie)`,
        hotkeys: 'Skróty klawiszowe',
        'hk-inst-assign': `Aby ustawić skrót klawiszowy kliknij na polu skrótu i naciśnij wybrany klawisz.`,
        'hk-inst-delete': `Aby usunąć skrót klawiszowy kliknij na polu skrótu i naciśnij klawisz DELETE.`,
        'hk-inst-keys': `Możliwe kombinacje skrótów klawiszowych z użyciem klawiszy CTRL oraz ALT.`,
        'hk-bots-split': 'Bots split',
        'hk-bots-feed': 'Bots feed',
        'hk-bots-ai': 'Bots AI toggle',
        'hk-feed': `Feed`,
        'hk-macroFeed': 'Szybki feed',
        'hk-split': `Podział`,
        'hk-doubleSplit': `Podwójny podział`,
        'hk-tripleSplit': `Triple split`,
        'hk-split16': `Podział na 16`,
        'hk-pause': `Pauza kulki`,
        'hk-skt': `Infinite mouse distance`,
        'hk-afk': `AFK`,
        'hk-fixSpect': `Spectator fix`,
        'hk-onoffSpect': `Spectator on/off`,
        'hk-dance': `Dance`,
        'hk-showTop5': `Pokaż/ukryj top 5 teamu`,
        'hk-showTime': `Pokaż/ukryj aktualny czas`,
        'hk-showSplitRange': `Pokaż/ukryj zasięg podziału`,
        'hk-showSplitInd': `Pokaż/ukryj zasięg podziału z ringami`,
        'hk-showTeammatesInd': `Pokaż/ukryj wskaźniki graczy teamu`,
        'hk-showOppColors': `Pokaż/ukryj kolory przeciwników`,
        'hk-toggleSkins': `Przełącz skiny (własne/standardowe)`,
        'hk-invis': `invisible`,
        'hk-saveReplay': `Save replay`,
        'hk-showSkins': `Pokaż/ukryj skiny`,
        'hk-transparentSkins': `Włącz/wyłącz przezroczyste skiny`,
        'hk-showStats': `Pokaż/ukryj statystyki gry`,
        'hk-toggleCells': `Przełącz kulkę (najmniejsza/największa)`,
        'hk-showFood': 'Pokaż/ukryj pokarm',
        'hk-showGrid': 'Pokaż/ukryj siatkę',
        'hk-showMiniMapGuides': `Pokaż/ukryj prowadnice na minimapie`,
        'hk-hideChat': `Pokaż/ukryj czat`,
        'hk-showHUD': `Pokaż/ukryj HUD`,
        'hk-copyLb': `Kopiuj topkę`,
        'hk-showLb': `Pokaż/ukryj topkę`,
        'hk-toggleAutoZoom': 'Włącz/wyłącz auto zoom',
        'hk-resetZoom': `Reset zoomu`,
        'hk-zoomLevel': `Zoom - poziom`,
        'hk-toggleDeath': `Przełącz miejsce śmierci`,
        'hk-clearChat': `Pokaż historię czatu / Czyść czat`,
        'hk-showBgSectors': 'Pokaż/ukryj sektory w tle',
        'hk-hideBots': 'Pokaż/ukryj małe boty',
        'hk-showNames': `Pokaż/ukryj nazwy`,
        'hk-hideTeammatesNames': `Pokaż/ukryj nazwy graczy teamu`,
        'hk-showMass': 'Pokaż/ukryj masę',
        'hk-showMiniMap': `Pokaż/ukryj minimapę`,
        'hk-chatMessage': `Napisz wiadomość na czacie`,
        'hk-quickResp': `Szybkie odrodzenie (respawn)`,
        'hk-autoResp': `Włącz/wyłacz auto odrodzenie`,
        'hk-ingameSpectatorMode': `Switch in-game spectator`,
        'hk-switchServerMode': `Przełącz serwer [publiczny/prywatny]`,
        'hk-showTargeting': `Pokaż/ukryj panel namierzania`,
        'hk-setTargeting': 'Włącz/wyłącz namierzanie (śledzenie)',
        'hk-cancelTargeting': `Zatrzymaj namierzanie`,
        'hk-changeTarget': `Zmień cel`,
        'hk-privateMiniMap': `Pokaż cel na minimapie`,
        'hk-showQuest': `Pokaż/ukryj zadanie`,
        commands: `Komendy`,
        comm1: 'Feeduj!',
        comm2: 'Dziel się!',
        comm3: `Pomocy na %currentSector%!`,
        comm4: `Wróg na %currentSector%!`,
        comm5: `Zabij pomocnika!`,
        comm6: `Strzel z wirusa!`,
        comm7: `Zjedz wirusa!`,
        comm8: `Zjebałem, wybacz.`,
        comm9: `Ja pierdolę...`,
        comm0: `Kurwa mać!`,
        comm10: 'Trick!',
        comm11: `Lewo!`,
        comm12: `Góra!`,
        comm13: `Prawo!`,
        comm14: `Dół!`,
        saveComm: `Zapisz komendy`,
        theme: 'Wygląd',
        restoreThemeSettings: `Przywróc ustawienia domyślne wyglądu`,
        basicTheming: `Podstawowy`,
        themePreset: `Motyw`,
        themeType: 'Typ motywu',
        darkTheme: `Ciemny motyw`,
        lightTheme: 'Jasny motyw',
        mainColor: `Kolor główny`,
        bgColor: 'Tło',
        bordersColor: `Granice mapy`,
        gridColor: `Siatka`,
        sectorsColor: `Czcionka sektorów`,
        namesColor: `Nazwy`,
        namesStrokeColor: `Obwódki nazw`,
        massColor: `Masa`,
        massStrokeColor: `Obwódki masy`,
        virusColor: `Wirusy`,
        virusStrokeColor: 'Obwódki wirusów',
        foodColor: `Pokarm`,
        namesFont: 'Czcionka nazw',
        massFont: `Czcionka masy`,
        sectorsFont: `Czcionka sektorów`,
        namesScale: 'Skala nazw',
        massScale: 'Skala masy',
        virMassScale: `Skala masy wirusów`,
        strokeScale: `Skala obwódek tekstu`,
        foodSize: 'Wielkość pokarmu',
        bordersWidth: 'Grubość granic mapy',
        sectorsWidth: `Grubość siatki sektorów`,
        sectorsFontSize: `Rozmiar czcionki sektorów`,
        cellsAlpha: `Przezroczystość kulek`,
        skinsAlpha: `Przezroczystość skinów`,
        virusAlpha: `Przezroczystość wirusów`,
        textAlpha: 'Przezroczystość nazw i masy',
        virusStrokeSize: `Grubość obwódki wirusów`,
        teammatesIndColor: `Wskaźnik gracza`,
        cursorTrackingColor: 'Śledzenie kursora',
        splitRangeColor: `Zasięg podziału`,
    'enemyBSTEDColor': 'B2STE Enemy Color', //Sonia2
    'enemyBSTEColor': 'BSTE Enemy Color', //Sonia2
    'enemyBColor': 'Bigger Enemy Color', //Sonia2
    'enemySColor': 'Smaller Enemy Color', //Sonia2
    'enemySSTEColor': 'SSTE Enemy Color', //Sonia2
    'enemySSTEDColor': 'S2STE Enemy Color', //Sonia2
        safeAreaColor: `Bezpieczna strefa`,
        dangerAreaColor: 'Strefa zagrożenia',
        ghostCellsColor: `Duchy kulek`,
        ghostCellsAlpha: 'Przezroczystość duchów kulek',
        menuTheming: `Menu`,
        menuPreset: `Motyw menu`,
        menuMainColor: `Kolor główny`,
        menuBtnTextColor: 'Tekst przycisku',
        menuPanelColor: `Panel`,
        menuPanelColor2: `Panel (2)`,
        menuTextColor: `Tekst panelu`,
        menuTextColor2: 'Tekst panelu (2)',
        btn1Color: `Przycisk #1`,
        btn1Color2: 'Przycisk #1 (2)',
        btn2Color: `Przycisk #2`,
        btn2Color2: `Przycisk #2 (2)`,
        btn3Color: `Przycisk #3`,
        btn3Color2: 'Przycisk #3 (2)',
        btn4Color: `Przycisk #4`,
        btn4Color2: `Przycisk #4 (2)`,
        menuBg: 'Grafika tła panelu',
        menuOpacity: 'Przezroczystość',
        hudTheming: `HUD`,
        hudMainColor: `Kolor główny`,
        hudColor: `Tło`,
        hudTextColor: 'Tekst',
        statsHudColor: `Statystyki`,
        timeHudColor: 'Czas',
        top5MassColor: `Masa`,
        lbMeColor: `Topka - ja`,
        lbTeammateColor: `Topka - team`,
        hudFont: `Czcionka HUD`,
        hudScale: `Skala HUD`,
        chatTheming: 'Czat',
        messageColor: 'Tło wiadomości',
        messageTextColor: 'Tekst wiadomości',
        messageTimeColor: `Czas wiadomości`,
        messageNickColor: `Nick wiadomości`,
        commandsColor: `Tło komendy`,
        commandsTextColor: `Tekst komendy`,
        commandsTimeColor: 'Czas komendy',
        commandsNickColor: `Nick komendy`,
        chatBoxColor: `Tło czatboxu`,
        chatScale: `Skala czatu`,
        miniMapTheming: `Minimapa`,
        miniMapSectorsColor: `Sektory`,
        miniMapSectorColor: `Aktualny sektor`,
        miniMapGuidesColor: `Prowadnice`,
        miniMapNickColor: 'Nick',
        miniMapNickStrokeColor: `Obwódka nicku`,
        miniMapMyCellColor: 'Moja kulka',
        miniMapMyCellStrokeColor: `Obwódka mojej kulki`,
        miniMapTeammatesColor: 'Gracze',
        miniMapDeathLocationColor: `Miejsce śmierci`,
        miniMapFont: `Czcionka minimapy`,
        miniMapNickFont: `Czcionka nicku`,
        miniMapWidth: `Szerokość minimapy`,
        miniMapSectorsOpacity: 'Przezroczystość sektorów',
        miniMapNickSize: `Rozmiar nicku`,
        miniMapNickStrokeSize: `Grubość obwódki nicku`,
        miniMapMyCellSize: `Wielkość mojej kulki`,
        miniMapMyCellStrokeSize: `Grubość obwódki mojej kulki`,
        miniMapTeammatesSize: `Wielkość graczy`,
        miniMapGhostCellsColor: `Duchy kulek`,
        miniMapGhostCellsAlpha: `Przezroczystość duchów kulek`,
        imagesTheming: 'Grafika / kursory',
        customBackground: `Grafika tła`,
        'customMapTexture': 'Grafika mapy',
        'customMapLogo': 'Logo mapy',
        customCursor: `Grafika kursora`,
        hideChatMsgA: `Czat został włączony!`,
        hideChatMsgB: `Czat został ukryty!`,
        showSkinsMsgA: 'Skiny zostały włączone!',
        showSkinsMsgB: `Skiny zostały ukryte!`,
        hideSmallBotsMsgA: 'Małe boty stały się widoczne!',
        hideSmallBotsMsgB: 'Małe boty zostały ukryte!',
        autoRespMsgA: `Auto odrodzenie zostało włączone!`,
        autoRespMsgB: `Auto odrodzenie zostało wyłączone!`,
        autoZoomMsgA: `Auto zoom został włączony!`,
        autoZoomMsgB: 'Auto zoom został wyłączony!',
        targetNotSet: `Brak celu`,
        targetDead: `Nie żyje`,
        targetDistance: 'Dystans',
        targetMass: `Masa razem`,
        totalPartyPlayers: 'Aktywnych graczy',
        totalPartyMass: 'Łącznie masy',
        exportImport: `Eksport / import ustawień`,
        exportSettings: `Eksportuj ustawienia`,
        exportInfo: 'Aby wyeksportować wybrane ustawienia skopiuj poniższy kod i zapisz go w pliku tekstowym z kodowaniem Unicode.',
        importSettings: 'Importuj ustawienia',
        importInfo: `Aby zaimportować wybrane ustawienia wklej poniżej wyeksportowany wcześniej kod i naciśnij przycisk "Importuj ustawienia".`,
        profile: `Profil`,
        profiles: `Profile`,
        skins: 'Skiny',
        moreSkins: `Dodaj skiny`,
        thanks: `Dzięki Awesome!`,
        saveSett: `Zapisz ustawienia`,
        saved: 'Zapisano!',
        resetSett: `Resetuj ustawienia`,
        close: `Zamknij`,
        enterChatMsg: `Napisz wiadomość`,
        activeParties: `Aktywne party`,
        noActiveParties: `Brak aktywnych party ;(`,
        playlist: `Playlista`,
        pause: `PAUZA!`,
        visit: ` Edited by`,
        exit: 'APP: Czy na pewno chcesz opuścic grę?',
        blockWarn: `UWAGA! Popupy zostały zablokowane w ustawieniach.`,
        unblockPopups: `Odblokuj tymczasowo`,
        mass: `Masa`,
        score: `Top`,
        leaderboard: `Topka`,
        leaderboardLength:'Length of Leaderboard (10)',
        user: `Użytkownik`,
        userMuted: `Użytkownik %user% został wyciszony.`,
        userUnmuted: `Wyłączono wyciszenie użytkownika %user%.`,
        mute: `Wycisz`,
        unmute: 'Wyłącz wyciszenie',
        mutedUsers: `Wyciszeni użytkownicy`,
        activeUsers: `Aktywni użytkownicy`,
        showActiveUsers: 'Pokaż aktywnych użytkowników',
        none: `Brak`,
        sounds: 'Dźwięki',
        facebook: `Facebook`,
        search: 'Search',//`Сонечко, вийди з-за хмар`,
        page_back_button: `Wróć`,
        page_create_party: `Stwórz party`,
        page_join_party: `Dołącz`,
        page_login_and_play: `Zaloguj`,
        page_logout: `Wyloguj`,
        page_menu_login_facebook: `Zaloguj z Facebook`,
        page_menu_login_google: 'Zaloguj z Google',
        page_menu_main_free_coins: `Darmowe Monety`,
        page_menu_main_gifts: 'Prezenty',
        page_menu_main_dailyquests: `Zadania`,
        page_party_join_error: 'Nie można dołączyć do tego party. Upewnij się, że token jest prawidłowy lub stwórz nowy.',
        page_play: `Graj`,
        page_play_as_guest: `Graj jako gość`,
        page_shop: `Sklep`,
        page_spectate: `Obserwuj`,
        page_stats: `Statystyki`
    },
    en: {
        start: `Home`,
        settings: `Settings`,
        restoreSettings: `Restore default settings`,
        animationGroup: `Animation`,
        zoomGroup: `Zoom`,
        newGroup:'New',
        stickyCell:'Sticky cell (RMB & LMB)',
        reverseTrick:'Reverse trick',
        clickTargeting: 'Click targeting',
        deltaSocket: 'Delta socket',
        autobrewing: 'Autobrewing',
        onlineStatus: 'Show me online(Facebook)',
        autosearchFB: 'Autosearch Facebook friends',
        'macroFeeding': 'Macro feeding (80ms)',
        'renderQuality':'Rendering quality (1)',
        'debug':'Debug',
        'mapLocalFix3':'Map Fix on re-join',
        'mapGlobalFix4':'Map Global Fix (from LM)',
        cameraDelay:'Camera delay (0)',
        'showExtraMiniMapGuides':'Show extra minimap guides',
        respGroup: `Respawn`,
        namesGroup: `Names`,
        massGroup: 'Mass',
        skinsGroup: `Skins`,
        foodGroup: `Food`,
        transparencyGroup: 'Transparency / colors',
        gridGroup: 'Grid / sectors',
        miniMapGroup: `Minimap`,
        helpersGroup: `Helpers`,
        mouseGroup: `Mouse control`,
        hudGroup: `HUD`,
        chatGroup: `Chat`,
        statsGroup: `Stats`,
        extrasGroup: `Extras`,
        noSkins: `No skins`,
        cellContours: `Only cells contours`,
        noNames: 'No names',
        noColors: 'No colors',
        showMass: `Show mass`,
        skipStats: 'Skip stats after death',
        showQuest: `Show quest`,
        autoZoom: `Auto zoom`,
        animation: `Animation delay`,
        zoomSpeedValue: `Zoom speed`,
        quickResp: `Quick respawn (hotkey)`,
        autoResp: `Auto respawn`,
        autoHideCellsInfo: `Auto hide names and mass`,
        autoHideNames: `Auto hide names`,
        autoHideMass: `Auto hide mass`,
        autoHideFood: `Auto hide food (mass)`,
        autoHideFoodOnZoom: 'Auto hide food (zoom)',
        optimizedNames: `Optimized names`,
        hideMyName: `Hide my name`,
        hideTeammatesNames: `Hide teammates names`,
        optimizedMass: `Optimized mass (+/-2%)`,
        shortMass: `Short mass (k)`,
        virMassShots: `Virus shots`,
        hideMyMass: `Hide my mass`,
        hideEnemiesMass: `Hide enemies mass`,
        vanillaSkins: `Vanilla skins`,
        customSkins: `Custom skins`,
        FBSkins: 'Facebook avatars as skin',
        myTransparentSkin: `My transparent skin`,
        myCustomColor: `My custom color`,
        transparentCells: `Transparent cells`,
        transparentViruses: 'Transparent viruses',
        transparentSkins: 'Transparent skins',
        showGrid: 'Show grid',
        showBgSectors: `Show background sectors`,
        showMapBorders: `Show map borders`,
        rainbowBorders: `Rainbow borders`,
        newRainbowBorders: `New rainbow borders (less FPS)`,
        showGhostCells: `Ghost cells`,
        showMiniMap: `Show minimap`,
        showMiniMapGrid: `Show minimap grid`,
        showMiniMapGuides: `Show minimap guides`,
        showMiniMapGhostCells: `Show ghost cells`,
        oneColoredTeammates: 'One-colored teammates',
        rainbowFood: `Rainbow food`,
        oppColors: `Opponents colors`,
        oppRings: `Opponents rings`,
        bubbleInd: `Bubble indicators`,
        virColors: `Viruses colors`,
        splitRange: `Split range`,
        'qdsplitRange': 'Quick double split range', //Sonia2
        'sdsplitRange': 'Slow double split range', //Sonia2
        virusesRange: 'Viruses range',
        textStroke: `Names and mass stroke`,
        namesStroke: 'Names stroke',
        massStroke: `Mass stroke`,
        cursorTracking: 'Cursor tracking',
        bubbleCursorTracker: 'Bubble tracker',
        FBTracking: 'Facebook bubble tracker',
        ingameSpectator: 'Ingame spectator',
        fullSpectator: 'Full spectator',
        oneColoredSpectator: 'One-colored spectator',
        teammatesInd: `Teammates indicators`,
        mouseSplit: `LMB - Mouse split`,
        waves: `MMB - Waves`,
        mouseFeed: `RMB - Mouse feed`,
        mouseInvert: `Invert mouse buttons`,
        disableChat: 'Disable chat',
        coloredNicks: `Colored nicknames`,
        hideChat: `Hide chat`,
        chatSounds: `Sound notifications`,
        chatEmoticons: `Emoticons`,
        showChatImages: 'Show images on chat',
        showChatVideos: `Show videos on chat`,
        showChatBox: `Chatbox instead of popups`,
        messageSound: `Message notification sound`,
        commandSound: `Command notification sound`,
        virusSounds: `Virus eject sound`,
        virusSoundURL:'Virus eject sound URL',
        FacebookIDs: `Facebook IDs `,
        skinsForSearch: 'Target skin',//`Небо затягнуте хмарами`,
        nicksForSearch: 'Target nick',//`Стільки всього не сказали ми`,
        extras: 'Stickers',
        discord: 'Discord webhook URL',
        showTop5: 'Show team top 5',
        showTop5Sectors:'Show team top 5 sectors',
        showTargeting: `Show targeting`,
        showTime: 'Show current time',
        showLbData: `Show leaderboard mass`,
        normalLb: `"Leaderboard" header`,
        centeredLb: `Centered leaderboard`,
        fpsAtTop: `Game stats at the top`,
        targetSearch: 'Target search',//`Небо затягнуте хмарами`,
        showStats: `Show game stats`,
        showStatsMass: `Game stats: Mass`,
        showStatsSTE: `Game stats: STE`,
        showStatsN16: `Game stats: n/16`,
        showStatsFPS: `Game stats: FPS`,
        'showStatsPPS': 'Game stats: PPS',
        blockPopups: `Block popups (ads/shop/quest)`,
        hotkeys: 'Hotkeys',
        'hk-inst-assign': `To assign a hotkey click on the input field and press your chosen key.`,
        'hk-inst-delete': `To delete a hotkey click on the input field and press the DELETE key.`,
        'hk-inst-keys': `Possible key combinations with the CTRL and ALT keys.`,
        'hk-bots-split': 'Bots split',
        'hk-bots-feed': 'Bots feed',
        'hk-bots-ai': 'Bots AI toggle',
        'hk-feed': 'Feed',
        'hk-macroFeed': 'Macro feed',
        'hk-split': `Split`,
        'hk-doubleSplit': `Double split`,
        'hk-tripleSplit': `Triple split`,
        'hk-split16': `Split 16`,
        'hk-pause': `Cell pause`,
        'hk-skt': `Infinite mouse distance`,
        'hk-afk': `AFK`,
        'hk-fixSpect': `Spectator fix`,
        'hk-onoffSpect': `Spectator on/off`,
        'hk-dance': `Dance`,
        'hk-showTop5': `Show/hide team top 5`,
        'hk-showTime': `Show/hide current time`,
        'hk-showSplitRange': `Show/hide split range`,
        'hk-showSplitInd': 'Show/hide split indicators',
        'hk-showTeammatesInd': 'Show/hide teammates indicators',
        'hk-showOppColors': `Show/hide opponents colors`,
        'hk-toggleSkins': 'Toggle skins (custom/default)',
        'hk-invis': `invisible`,
        'hk-saveReplay': `Save replay`,
        'hk-showSkins': `Show/hide skins`,
        'hk-transparentSkins': 'Toggle transparent skins',
        'hk-showStats': `Show/hide game stats`,
        'hk-toggleCells': `Toggle own cells (smallest/biggest)`,
        'hk-showFood': `Show/hide food`,
        'hk-showGrid': `Show/hide grid`,
        'hk-showMiniMapGuides': 'Show/hide minimap guides',
        'hk-hideChat': `Show/hide chat`,
        'hk-showHUD': `Show/hide HUD`,
        'hk-copyLb': `Copy leaderboard`,
        'hk-showLb': 'Show/hide leaderboard',
        'hk-toggleAutoZoom': `Toggle auto zoom`,
        'hk-resetZoom': `Reset zoom`,
        'hk-zoomLevel': 'Zoom level',
        'hk-toggleDeath': `Toggle death location`,
        'hk-clearChat': `Show chat history / Clear chat`,
        'hk-showBgSectors': `Show/hide background sectors`,
        'hk-hideBots': `Show/hide small bots`,
        'hk-showNames': 'Show/hide names',
        'hk-hideTeammatesNames': `Show/hide teammates names`,
        'hk-showMass': `Show/hide mass`,
        'hk-showMiniMap': 'Show/hide minimap',
        'hk-chatMessage': `Enter chat message`,
        'hk-quickResp': `Quick respawn`,
        'hk-autoResp': `Toggle auto respawn`,
        'hk-ingameSpectatorMode': `Switch in-game spectator`,
        'hk-switchServerMode': `Switch server [public/private]`,
        'hk-showTargeting': 'Show/hide targeting panel',
        'hk-setTargeting': `Start/stop targeting (following)`,
        'hk-cancelTargeting': 'Cancel targeting',
        'hk-changeTarget': 'Change target',
        'hk-privateMiniMap': 'Show target on the minimap',
        'hk-showQuest': 'Show/hide quest',
        commands: `Commands`,
        comm1: `Feed me!`,
        comm2: `Split into me!`,
        comm3: 'Need backup at %currentSector%!',
        comm4: 'Enemy spotted at %currentSector%!',
        comm5: `Need a teammate!`,
        comm6: 'Tank the virus!',
        comm7: `Eat the virus!`,
        comm8: `Let's bait!`,
        comm9: `Fake tricksplit!`,
        comm0: `Fuck!`,
        comm10: `Tricksplit!`,
        comm11: `Left!`,
        comm12: `Up!`,
        comm13: 'Right!',
        comm14: 'Bottom!',
        saveComm: 'Save commands',
        theme: `Theme`,
        restoreThemeSettings: `Restore theme default settings`,
        basicTheming: 'Basic theming',
        themePreset: `Theme preset`,
        themeType: 'Theme type',
        darkTheme: 'Dark theme',
        lightTheme: `Light theme`,
        mainColor: 'Main color',
        bgColor: `Background`,
        bordersColor: 'Map borders',
        gridColor: `Grid`,
        sectorsColor: `Sectors font`,
        namesColor: `Names`,
        namesStrokeColor: `Names stroke`,
        massColor: 'Mass',
        massStrokeColor: `Mass stroke`,
        virusColor: `Virus`,
        virusStrokeColor: `Virus stroke`,
        foodColor: `Food`,
        namesFont: 'Names font',
        massFont: `Mass font`,
        sectorsFont: 'Sectors font',
        namesScale: `Names scale`,
        massScale: 'Mass scale',
        virMassScale: 'Virus mass scale',
        strokeScale: `Text stroke scale`,
        foodSize: `Food size`,
        bordersWidth: 'Map borders width',
        sectorsWidth: `Sectors grid width`,
        sectorsFontSize: `Sectors font size`,
        cellsAlpha: `Cells transparency`,
        skinsAlpha: 'Skins transparency',
        virusAlpha: `Virus transparency`,
        textAlpha: `Names & mass transparency`,
        virusStrokeSize: `Virus stroke size`,
        teammatesIndColor: `Teammate indicator`,
        cursorTrackingColor: `Cursor tracking`,
        splitRangeColor: `Split range`,
    'enemyBSTEDColor': 'B2STE Enemy Color', //Sonia2
    'enemyBSTEColor': 'BSTE Enemy Color', //Sonia2
    'enemyBColor': 'Bigger Enemy Color', //Sonia2
    'enemySColor': 'Smaller Enemy Color', //Sonia2
    'enemySSTEColor': 'SSTE Enemy Color', //Sonia2
    'enemySSTEDColor': 'S2STE Enemy Color', //Sonia2
        safeAreaColor: `Safe area`,
        dangerAreaColor: `Danger area`,
        ghostCellsColor: `Ghost cells`,
        ghostCellsAlpha: 'Ghost cells transparency',
        menuTheming: `Menu`,
        menuPreset: `Menu theme`,
        menuMainColor: `Main color`,
        menuBtnTextColor: `Button text`,
        menuPanelColor: `Panel`,
        menuPanelColor2: `Panel (2)`,
        menuTextColor: 'Panel text',
        menuTextColor2: `Panel text (2)`,
        btn1Color: `Button #1`,
        btn1Color2: `Button #1 (2)`,
        btn2Color: 'Button #2',
        btn2Color2: `Button #2 (2)`,
        btn3Color: `Button #3`,
        btn3Color2: `Button #3 (2)`,
        btn4Color: `Button #4`,
        btn4Color2: `Button #4 (2)`,
        menuBg: 'Panel background image',
        menuOpacity: `Transparency`,
        hudTheming: `HUD`,
        hudMainColor: `Main color`,
        hudColor: 'Background',
        hudTextColor: `Text`,
        statsHudColor: `Stats`,
        timeHudColor: 'Time',
        top5MassColor: `Mass`,
        lbMeColor: `Leaderboard - me`,
        lbTeammateColor: `Leaderboard - teammate`,
        hudFont: `HUD font`,
        hudScale: `HUD scale`,
        chatTheming: `Chat`,
        messageColor: 'Message background',
        messageTextColor: 'Message text',
        messageTimeColor: `Message time`,
        messageNickColor: `Message nick`,
        commandsColor: `Command background`,
        commandsTextColor: 'Command text',
        commandsTimeColor: `Command time`,
        commandsNickColor: `Command nick`,
        chatBoxColor: `Chatbox color`,
        chatScale: `Chat scale`,
        miniMapTheming: `Minimap`,
        miniMapSectorsColor: `Sectors`,
        miniMapSectorColor: `Current sector`,
        miniMapGuidesColor: `Guides`,
        miniMapNickColor: `Nick`,
        miniMapNickStrokeColor: `Nick stroke`,
        miniMapMyCellColor: `My cell`,
        miniMapMyCellStrokeColor: `My cell stroke`,
        miniMapTeammatesColor: `Teammates`,
        miniMapDeathLocationColor: `Death location`,
        miniMapFont: `Minimap font`,
        miniMapNickFont: `Nick font`,
        miniMapWidth: `Minimap width`,
        miniMapSectorsOpacity: `Sectors transparency`,
        miniMapNickSize: 'Nick size',
        miniMapNickStrokeSize: 'Nick stroke size',
        miniMapMyCellSize: `My cell size`,
        miniMapMyCellStrokeSize: `My cell stroke size`,
        miniMapTeammatesSize: 'Teammates size',
        miniMapGhostCellsColor: `Ghost cells`,
        miniMapGhostCellsAlpha: `Ghost cells transparency`,
        imagesTheming: `Graphics / cursors`,
        customBackground: `Custom background image`,
        'customMapTexture': 'Custom map texture',
        'customMapLogo': 'Custom map logo',
        customCursor: `Custom cursor image`,
        hideChatMsgA: `Chat is visible!`,
        hideChatMsgB: `Chat is hidden!`,
        showSkinsMsgA: `Skins are visible!`,
        showSkinsMsgB: `Skins are hidden!`,
        hideSmallBotsMsgA: `Small bots are visible!`,
        hideSmallBotsMsgB: `Small bots are hidden!`,
        autoRespMsgA: `Auto respawn is on!`,
        autoRespMsgB: `Auto respawn is off!`,
        autoZoomMsgA: `Auto zoom is on!`,
        autoZoomMsgB: `Auto zoom is off!`,
        targetNotSet: `Target not set`,
        founded: 'Founded',//'Сонечко вийшло з-за хмар',
        targetDead: 'Dead',
        targetDistance: 'Distance',
        targetMass: `Mass altogether`,
        totalPartyPlayers: `Active players`,
        totalPartyMass: `Total mass`,
        exportImport: `Export / import settings`,
        exportSettings: 'Export settings',
        exportInfo: 'To export selected settings copy the code below and save it to a text file encoded in Unicode.',
        importSettings: `Import settings`,
        importInfo: `To import selected settings paste an exported code below and press the "Import settings" button.`,
        profile: `Profile`,
        profiles: 'Profiles',
        skins: `Skins`,
        moreSkins: `Add skins`,
        thanks: `Thanks to Awesome!`,
        saveSett: 'Save settings',
        saved: `Saved!`,
        resetSett: `Reset to default`,
        close: `Close`,
        enterChatMsg: `Enter chat message`,
        activeParties: `Active parties`,
        noActiveParties: `No active parties ;(`,
        playlist: `Playlist`,
        pause: `PAUSE!`,
        visit: ` Edited by`,
        exit: 'APP: Are you sure you want to quit the game?',
        blockWarn: `WARNING! Popups are blocked in the settings.`,
        unblockPopups: `Temporary unblock`,
        mass: 'Mass',
        score: `Score`,
        leaderboard: `Leaderboard`,
        leaderboardLength:'Length of Leaderboard (10)',
        user: 'User',
        userMuted: 'User %user% has been muted.',
        userUnmuted: `User %user% has been unmuted.`,
        mute: `Mute`,
        unmute: 'Unmute',
        mutedUsers: `Muted users`,
        activeUsers: `Active users`,
        showActiveUsers: `Show active users`,
        none: `None`,
        sounds: `Sounds`,
        facebook: `Facebook`,
        search: 'Search',//`Сонечко, вийди з-за хмар`,
        page_menu_main_free_coins: 'Free Coins',
        page_menu_main_gifts: 'Gifts',
        page_menu_main_dailyquests: `Daily Quest`,
        page_shop: `Shop`
    },
    'ru-RU': {
        'start': 'Главная',
        'settings': 'Настройки',
        'restoreSettings': 'Восстановить настройки по умолчанию',
        'animationGroup': 'Анимация',
        'zoomGroup': 'Масштабирование',
        newGroup:'Новое',
        stickyCell:'Прилипание к шару (ПКМ-ЛКМ)',
        reverseTrick:'Reverse trick',
        clickTargeting: 'Click targeting',
        deltaSocket: 'Delta socket',
        autobrewing: 'Autobrewing',
        onlineStatus: 'Show me online(Facebook)',
        autosearchFB: 'Autosearch Facebook friends',
        'macroFeeding': 'Задержка макро-фида (80мс)',
        'renderQuality':'Качество отрисовки (1)',
        'debug':'Debug',
        'mapLocalFix3':'Запоминать положение карты',
        'mapGlobalFix4':'Вращать карту в правильное положение (Легенд) ',
        'cameraDelay':'Задержка камеры (0)',
        'showExtraMiniMapGuides':'Доп. указатели на миникарте',
        'respGroup': 'Респавн',
        'namesGroup': 'Имена',
        'massGroup': 'Масса',
        'skinsGroup': 'Скины',
        'foodGroup': 'Еда',
        'transparencyGroup': 'Прозрачность / цвета',
        'gridGroup': 'Сетка / секторы',
        'miniMapGroup': 'Миникарта',
        'helpersGroup': 'Подсказки',
        'mouseGroup': 'Управление мышью',
        'hudGroup': 'HUD',
        'chatGroup': 'Чат',
        'statsGroup': 'Статистика',
        'extrasGroup': 'Дополнительно',
        'noSkins': 'Без скинов',
        cellContours: `Only cells contours`,
        'noNames': 'Без имен',
        'noColors': 'Без цветов',
        'showMass': 'Показывать массу',
        'skipStats': 'Пропустить статистику после смерти',
        'showQuest': 'Показать квест',
        'autoZoom': 'Авто зум',
        'animation': 'Задержка анимации',
        'zoomSpeedValue': 'Чувствительность зума',
        'quickResp': 'Быстрый респавн (по горячей клавише)',
        'autoResp': 'Авто респавн',
        'autoHideCellsInfo': 'Автоскрытие имён и массы',
        'autoHideNames': 'Авто-скрыть имена',
        'autoHideMass': 'Авто-скрыть массу',
        'autoHideFood': 'Авто-скрыть еду (при большой массе)',
        'autoHideFoodOnZoom': 'Авто-скрыть еду (при зуме)',
        'optimizedNames': 'Оптимизировать имена',
        'hideMyName': 'Скрыть мое имя',
        'hideTeammatesNames': 'Скрыть имена товарищей по команде',
        'optimizedMass': 'Оптимизированная масса (+/- 2%)',
        'shortMass': 'Укороченная масса (k)',
        'virMassShots': 'Вирусные выстрелы, счётчик до выстрела',
        'hideMyMass': 'Скрыть мою массу',
        'hideEnemiesMass': 'Скрыть массу врагов',
        'vanillaSkins': 'Агаровские скины',
        'customSkins': 'Кастомные скины',
        FBSkins: 'Facebook avatars as skin',
        'myTransparentSkin': 'Мой скин прозрачный',
        'myCustomColor': 'Мой кастомный цвет',
        'transparentCells': 'Прозрачные клетки',
        'transparentViruses': 'Прозрачные вирусы',
        'transparentSkins': 'Прозрачные скины',
        'showGrid': 'Сетка',
        'showBgSectors': 'Сектора',
        'showMapBorders': 'Границы карты',
        rainbowBorders: `Rainbow borders`,
        newRainbowBorders: `New rainbow borders (less FPS)`,
        'showGhostCells': 'Призрачные клетки',
        'showMiniMap': 'Показать миникарту',///
        'showMiniMapGrid': 'Показать сетку миникарты',
        'showMiniMapGuides': 'Показать мини-карты',
        'showMiniMapGhostCells': 'Показать призрачные клетки',
        'oneColoredTeammates': 'Одноцветные товарищи по команде',
        'rainbowFood': 'Разноцветная еда',
        'oppColors': 'Цвета противников',
        'oppRings': 'Кольца противников',
        bubbleInd: `Bubble indicators`,
        'virColors': 'Цвет вирусов',
        'splitRange': 'Радиус дальности сплита',
    'qdsplitRange': 'Quick double split range', //Sonia2
    'sdsplitRange': 'Slow double split range', //Sonia2
        'virusesRange': 'Диапазон вирусов',
        'textStroke': 'Обводка текста',
        'namesStroke': 'Обводка имени',
        'massStroke': 'Обводка массы',
        'cursorTracking': 'Линии к курсору',
        bubbleCursorTracker: 'Bubble tracker',
        FBTracking: 'Facebook bubble tracker',
        ingameSpectator: 'Ingame spectator',
        fullSpectator: 'Full spectator',
        oneColoredSpectator: 'One-colored spectator',
        'teammatesInd': 'Показатели товарищей по команде',
        'mouseSplit': 'ЛКМ - Сплит мышкой',
        waves: `MMB - Waves`,
        'mouseFeed': 'ПКМ - Кормить мышкой',
        'mouseInvert': 'Поменять местами ПКМ и ЛКМ',
        'disableChat': 'Отключить чат',
        coloredNicks: `Colored nicknames`,
        'hideChat': 'Скрыть чат',
        'chatSounds': 'Звуки чата',
        'chatEmoticons': 'Смайлы',
        'showChatImages': 'Картинки',
        'showChatVideos': 'Видео',
        'showChatBox': 'Чатбокс вместо уведомлений',
        'messageSound': 'Звук сообщений',
        'commandSound': 'Звук команд',
        'virusSounds': 'Звук выстрела вируса',
         virusSoundURL:'Звук выстрела вируса URL',
        FacebookIDs: `Facebook IDs `,
        skinsForSearch: 'Target skin',//`Небо затягнуте хмарами`,
        nicksForSearch: 'Target nick',//`Стільки всього не сказали ми`,
        extras: 'Stickers',
        discord: 'Discord webhook URL',
        'showTop5': 'Показать топ 5 команды',
        showTop5Sectors:'Показать сектора в топ 5',
        'showTargeting': 'Показать таргетинг',
        'showTime': 'Показать текущее время',
        'showLbData': 'Показать массу в LEADERBOARD',
        'normalLb': 'Заголовок \ "LEADERBOARD \"',
        'centeredLb': 'По-центру LEADERBOARD',
        'fpsAtTop': 'FPS сверху',
        targetSearch: 'Target search',//`Небо затягнуте хмарами`,
        'showStats': 'Показывать строку статистики',
        'showStatsMass': 'Текущая масса',
        'showStatsSTE': 'STE: Максимально набрано',
        'showStatsN16': 'Количество шаров n / 16',
        'showStatsFPS': 'FPS - кадры в секунду',
        'showStatsPPS': 'PPS - пакеты в секунду',
        'blockPopups': 'Блокировать всплывающие окна (реклама / магазин / квест)',
        'hotkeys': 'Клавиатура',
        'hk-inst-assign': 'Чтобы назначить горячую клавишу, нажмите на поле ввода и нажмите выбранную клавишу.',
        'hk-inst-delete': 'Чтобы удалить горячую клавишу, нажмите на поле ввода и нажмите клавишу DELETE.',
        'hk-inst-keys': 'Возможные комбинации клавиш с клавишами CTRL и ALT.',
        'hk-bots-split': 'Bots split',
        'hk-bots-feed': 'Bots feed',
        'hk-bots-ai': 'Bots AI toggle',
        'hk-feed': 'Кормить',
        'hk-macroFeed': 'Быстро кормить',
        'hk-split': 'Сплит',
        'hk-doubleSplit': 'Двойной сплит',
        'hk-tripleSplit': `Тройной сплит`,
        'hk-split16': 'Сплит на 16',
        'hk-pause': 'Пауза',
        'hk-skt': `Infinite mouse distance`,
        'hk-afk': `AFK`,
        'hk-fixSpect': `Spectator fix`,
        'hk-onoffSpect': `Spectator on/off`,
        'hk-dance': `Dance`,
        'hk-showTop5': 'Показать / скрыть топ товарищей',
        'hk-showTime': 'Показать / скрыть текущее время',
        'hk-showSplitRange': 'Показать / скрыть радиус дальности сплита',
        'hk-showSplitInd': 'Показать / скрыть индикатор сплитов',
        'hk-showTeammatesInd': 'Показать / скрыть показатели товарищей по команде',
        'hk-showOppColors': 'Показать / скрыть цвета противников',
        'hk-toggleSkins': 'Переключить скины (пользовательские / по умолчанию)',
        'hk-invis': `invisible`,
        'hk-saveReplay': `Save replay`,
        'hk-showSkins': 'Показать / скрыть скины',
        'hk-transparentSkins': 'Переключить прозрачные скины',
        'hk-showStats': 'Показать / скрыть игровую статистику',
        'hk-toggleCells': 'Переключить собственные ячейки (самые маленькие / самые большие)',
        'hk-showFood': 'Показать / скрыть еду',
        'hk-showGrid': 'Показать / скрыть сетку',
        'hk-showMiniMapGuides': 'Показать / скрыть направляющие миникарты',
        'hk-hideChat': 'Показать / скрыть чат',
        'hk-showHUD': 'Показать / скрыть HUD',
        'hk-copyLb': 'Копировать список лидеров',
        'hk-showLb': 'Показать / скрыть таблицу лидеров',
        'hk-toggleAutoZoom': 'Переключить автоматический зум',
        'hk-resetZoom': 'Сбросить масштаб',
        'hk-zoomLevel': 'Уровень масштабирования',
        'hk-toggleDeath': 'Переключить место смерти',
        'hk-clearChat': 'Показать историю чата / Очистить чат',
        'hk-showBgSectors': 'Показать / скрыть фоновые сектора',
        'hk-hideBots': 'Показать / скрыть маленьких ботов',
        'hk-showNames': 'Показать / скрыть имена',
        'hk-hideTeammatesNames': 'Показать / скрыть имена товарищей по команде',
        'hk-showMass': 'Показать / скрыть массу',
        'hk-showMiniMap': 'Показать / скрыть миникарту',
        'hk-chatMessage': 'Введите сообщение чата',
        'hk-quickResp': 'Быстрое возрождение',
        'hk-autoResp': 'Переключить авто респаун',
        'hk-ingameSpectatorMode': `Switch in-game spectator`,
        'hk-switchServerMode': 'Переключить сервер [публичный / частный]',
        'hk-showTargeting': 'Показать / скрыть панель таргетинга',
        'hk-setTargeting': 'Начать / остановить таргетинг (следующий)',
        'hk-cancelTargeting': 'Отмена таргетинга',
        'hk-changeTarget': 'Изменить цель',
        'hk-privateMiniMap': 'Показать цель на миникарте',
        'hk-showQuest': 'Показать / спрятать квест',
        'commands': 'Команды',
        'comm1': 'Feed me!',
        'comm2': 'Split into me!',
        'comm3': 'Need backup at %currentSector%!',
        'comm4': 'Enemy spotted at %currentSector%!',
        'comm5': 'Need a teammate!',
        'comm6': 'Tank the virus!',
        'comm7': 'Eat the virus!',
        'comm8': 'Let\'s bait!',
        'comm9': 'Fake tricksplit!',
        'comm0': 'Fuck!',
        'comm10': 'Tricksplit!',
        'comm11': 'Left!',
        'comm12': 'Up!',
        'comm13': 'Right!',
        'comm14': 'Bottom!',
        'saveComm': 'Сохранить команды',
        'theme': 'Тема',
        'restoreThemeSettings': 'Восстановить настройки темы по умолчанию',
        'basicTheming': 'Основная тема',
        'themePreset': 'Предустановка темы',
        'themeType': 'Тип темы',
        'darkTheme': 'Темная тема',
        'lightTheme': 'Светлая тема',
        'mainColor': 'Основной цвет',
        'bgColor': 'Фон',
        'bordersColor': 'Границы карты',
        'gridColor': 'Сетка',
        'sectorsColor': 'Цвет секторов',
        'namesColor': 'Имена',
        'namesStrokeColor': 'Обводка имен',
        'massColor': 'Масса',
        'massStrokeColor': 'Обводка массы',
        'virusColor': 'Вирус',
        'virusStrokeColor': 'Обводка вируска',
        'foodColor': 'Еда',
        'namesFont': 'Шрифт имени',
        'massFont': 'Шрифт массы',
        'sectorsFont': 'Шрифт секторов',
        'namesScale': 'Размер имен',
        'massScale': 'Размер массы',
        'virMassScale': 'Размер массы вирусов',
        'strokeScale': 'Толщина обводки',
        'foodSize': 'Размер еды',
        'bordersWidth': 'Ширина границ карты',
        'sectorsWidth': 'Ширина секторов карты',
        'sectorsFontSize': 'Размер шрифта секторов',
        'cellsAlpha': 'Прозрачность шаров',
        'skinsAlpha': 'Прозрачность скинов',
        'virusAlpha': 'Прозрачность вирусов',
        'textAlpha': 'Прозрачность имен и массы',
        'virusStrokeSize': 'Толщина обводки вируса',
        'teammatesIndColor': 'Индикатор товарища',
        'cursorTrackingColor': 'Линии курсора',
        'splitRangeColor': 'Радиус сплита',
    'enemyBSTEDColor': 'B2STE Enemy Color', //Sonia2
    'enemyBSTEColor': 'BSTE Enemy Color', //Sonia2
    'enemyBColor': 'Bigger Enemy Color', //Sonia2
    'enemySColor': 'Smaller Enemy Color', //Sonia2
    'enemySSTEColor': 'SSTE Enemy Color', //Sonia2
    'enemySSTEDColor': 'S2STE Enemy Color', //Sonia2
        'safeAreaColor': 'Безопасная зона',
        'dangerAreaColor': 'Опасная Зона',
        'ghostCellsColor': 'Привидения игроков',
        'ghostCellsAlpha': 'Прозрачность привидений игроков',
        'menuTheming': 'Меню',
        'menuPreset': 'Тема меню',
        'menuMainColor': 'Основной цвет',
        'menuBtnTextColor': 'Button text',
        'menuPanelColor': 'Panel',
        'menuPanelColor2': 'Panel (2)',
        'menuTextColor': 'Panel text',
        'menuTextColor2': 'Panel text (2)',
        'btn1Color': 'Button #1',
        'btn1Color2': 'Button #1 (2)',
        'btn2Color': 'Button #2',
        'btn2Color2': 'Button #2 (2)',
        'btn3Color': 'Button #3',
        'btn3Color2': 'Button #3 (2)',
        'btn4Color': 'Button #4',
        'btn4Color2': 'Button #4 (2)',
        'menuBg': 'Фоновая картинка',
        'menuOpacity': 'Прозрачность',
        'hudTheming': 'HUD',
        'hudMainColor': 'Основной цвет HUD',
        'hudColor': 'Фон HUD',
        'hudTextColor': 'Текст',
        'statsHudColor': 'Статы',
        'timeHudColor': 'Время',
        'top5MassColor': 'Масса',
        'lbMeColor': 'Я в топе',
        'lbTeammateColor': 'Товарищ в топе',
        'hudFont': 'HUD шрифт',
        'hudScale': 'HUD размер',
        'chatTheming': 'Чат',
        'messageColor': 'Фон сообщения',
        'messageTextColor': 'Текст сообщения',
        'messageTimeColor': 'Время сообщения',
        'messageNickColor': 'Ник в сообщении',
        'commandsColor': 'Фон команды',
        'commandsTextColor': 'Текст  команды',
        'commandsTimeColor': 'Время  команды',
        'commandsNickColor': 'Ник в  команде',
        'chatBoxColor': 'Цвет чатбокса',
        'chatScale': 'Размер чата',
        'miniMapTheming': 'Миникарта',
        'miniMapSectorsColor': 'Сектора',
        'miniMapSectorColor': 'Текущий сектор',
        'miniMapGuidesColor': 'Оси X/Y',
        'miniMapNickColor': 'Ник',
        'miniMapNickStrokeColor': 'Обводка ника',
        'miniMapMyCellColor': 'Мой шар',
        'miniMapMyCellStrokeColor': 'Обводка моего шара',
        'miniMapTeammatesColor': 'Товарищи',
        'miniMapDeathLocationColor': 'Место смерти',
        'miniMapFont': 'Шрифт миникарты',
        'miniMapNickFont': 'Шрифт ника',
        'miniMapWidth': 'Ширина миникарты',
        'miniMapSectorsOpacity': 'Прозрачность секторов',
        'miniMapNickSize': 'Размер ника',
        'miniMapNickStrokeSize': 'Толщина обводки ника',
        'miniMapMyCellSize': 'Размер моего шара',
        'miniMapMyCellStrokeSize': 'Толщина обводки моего шара',
        'miniMapTeammatesSize': 'Размер товарищей',
        'miniMapGhostCellsColor': 'Цвет привидений',
        'miniMapGhostCellsAlpha': 'Прозрачность привидений',
        'imagesTheming': 'Graphics / cursors',
        'customBackground': 'Картинка Фон карты',
        'customMapTexture': 'Картинка Текстура карты',
        'customMapLogo': 'Картинка Лого карты',
        'customCursor': 'Custom cursor image',
        'hideChatMsgA': 'Chat is visible!',
        'hideChatMsgB': 'Chat is hidden!',
        'showSkinsMsgA': 'Skins are visible!',
        'showSkinsMsgB': 'Skins are hidden!',
        'hideSmallBotsMsgA': 'Small bots are visible!',
        'hideSmallBotsMsgB': 'Small bots are hidden!',
        'autoRespMsgA': 'Auto respawn is on!',
        'autoRespMsgB': 'Auto respawn is off!',
        'autoZoomMsgA': 'Auto zoom is on!',
        'autoZoomMsgB': 'Auto zoom is off!',
        'targetNotSet': 'Target not set',
        founded: 'Founded',//'Сонечко вийшло з-за хмар',
        'targetDead': 'Dead',
        'targetDistance': 'Distance',
        'targetMass': 'Mass altogether',
        'totalPartyPlayers': 'Active players',
        'totalPartyMass': 'Total mass',
        'exportImport': 'Export / import settings',
        'exportSettings': 'Export settings',
        'exportInfo': 'To export selected settings copy the code below and save it to a text file encoded in Unicode.',
        'importSettings': 'Import settings',
        'importInfo': 'To import selected settings paste an exported code below and press the \"Import settings\" button.',
        'profile': 'Профиль',
        'profiles': 'Профили',
        'skins': 'Skins',
        'moreSkins': 'Add skins',
        'thanks': 'Thanks to Awesome!',
        'saveSett': 'Save settings',
        'saved': 'Saved!',
        'resetSett': 'Reset to default',
        'close': 'Close',
        'enterChatMsg': 'Enter chat message',
        'activeParties': 'Active parties',
        'noActiveParties': 'No active parties ;(',
        'playlist': 'Playlist',
        'pause': 'ПАУЗА!',
        visit: ` Edited by`,
        'exit': 'Вы уверены что хотите покинуть игру?',
        'blockWarn': 'WARNING! Popups are blocked in the settings.',
        'unblockPopups': 'Temporary unblock',
        'mass': 'Mass',
        'score': 'Score',
        'leaderboard': 'Leaderboard',
        'leaderboardLength':'Количество в Leaderboard (10)',
        'user': 'Пользователь',
        'userMuted': 'Пользователь %user% теперь заглушен.',
        'userUnmuted': 'Пользователь %user% снова виден.',
        'mute': 'Заглушить',
        'unmute': 'Видеть',
        'mutedUsers': 'Заглушенные пользователи',
        'activeUsers': 'Активные пользователи',
        'showActiveUsers': 'показать активных пользователей',
        'none': 'Нет',
        'sounds': 'Звуки',
        facebook: `Facebook`,
        search: 'Search',//`Сонечко, вийди з-за хмар`,
        'page_menu_main_free_coins': 'Бесплатные монеты',
        'page_menu_main_gifts': 'Подарки',
        'page_menu_main_dailyquests': 'Квест дня',
        'page_shop': 'Магазин'
    },
'uk-UA': {
    'start': 'Головна',
    'settings': 'Налаштування',
    'restoreSettings': 'Скинути',
    'animationGroup': 'Анімація',
    'zoomGroup': 'Масштабування',
    newGroup:'Нове',
    stickyCell:'Прилипання до клітини (ПКМ-ЛКМ)',
        reverseTrick:'Reverse trick',
        clickTargeting: 'Click targeting',
        deltaSocket: 'Delta socket',
        autobrewing: 'Autobrewing',
        onlineStatus: 'Show me online(Facebook)',
        autosearchFB: 'Autosearch Facebook friends',
    'macroFeeding': 'Інтервал макро-фіду (80мс)',
    'renderQuality':'Якість візуалізації (1)',
    'debug':'Debug',
    'mapLocalFix3':`Запам'ятовувати положення карти`,
    'mapGlobalFix4':'Повертати карту в правильне положення (LM) ',
    'cameraDelay':'Затримка камери (0)',
    'showExtraMiniMapGuides':'Додаткові вказівники мінікарти',
    'respGroup': 'Респаун',
    'namesGroup': 'Імена',
    'massGroup': 'Маса',
    'skinsGroup': 'Скіни',
    'foodGroup': 'Їжа',
    'transparencyGroup': 'Прозорість / Кольори',
    'gridGroup': 'Сітка / Сектори',
    'miniMapGroup': 'Мінікарта',
    'helpersGroup': 'Підказки',
    'mouseGroup': 'Управління мишею',
    'hudGroup': 'HUD',
    'chatGroup': 'Чат',
    'statsGroup': 'Статистика',
    'extrasGroup': 'Додатково',
    'noSkins': 'Без скінів',
    cellContours: `Відлбражати лише контури клітин`,
    'noNames': 'Без імен',
    'noColors': 'Без кольорів',
    'showMass': 'Відображати масу',
    'skipStats': 'Пропускати статистику після смерті',
    'showQuest': 'Відображати квест',
    'autoZoom': 'Авто-зум',
    'animation': 'Затримка анімації',
    'zoomSpeedValue': 'Крок зуму',
    'quickResp': 'Швидкий респаун (по хоткею)',
    'autoResp': 'Авто респаун',
    'autoHideCellsInfo': 'Автоматичне приховування імен і маси',
    'autoHideNames': 'Авто-приховування імен',
    'autoHideMass': 'Авто-приховування маси',
    'autoHideFood': 'Авто-приховування їжі (при великій масі)',
    'autoHideFoodOnZoom': 'Авто-приховування їжі (при зумі)',
    'optimizedNames': 'Оптимизувати імена',
    'hideMyName': `Приховати моє ім'я`,
    'hideTeammatesNames': 'Приховати імена товаришів по команді',
    'optimizedMass': 'Оптимізована маса (+/- 2%)',
    'shortMass': 'Скорочений запис (k)',
    'virMassShots': 'Лічильник до вистрілу віруса',
    'hideMyMass': 'Приховати мою масу',
    'hideEnemiesMass': 'Приховати масу ворогів',
    'vanillaSkins': 'Скіни агару',
    'customSkins': 'Користувацькі скіни',
    FBSkins: 'Facebook аватарки замість скінів',
    'myTransparentSkin': 'Мій скин прозорий',
    'myCustomColor': 'Мій колір настроюваний',
    'transparentCells': 'Прозорі клітини',
    'transparentViruses': 'Прозорі віруси',
    'transparentSkins': 'Прозорі скіни',
    'showGrid': 'Сітка',
    'showBgSectors': 'Сектори',
    'showMapBorders': 'Межі карти',
    rainbowBorders: `Кольорові межі`,
        newRainbowBorders: `New rainbow borders (less FPS)`,
    'showGhostCells': 'Привиди',
    'showMiniMap': 'Відображати мінікарту',///
    'showMiniMapGrid': 'Відображати сітку мінікарти',
    'showMiniMapGuides': 'Відображати підказки мінікарти',
    'showMiniMapGhostCells': 'Відображати привидів',
    'oneColoredTeammates': 'Товариші по команді одного кольору',
    'rainbowFood': 'Різнокольорова їжа',
    'oppColors': 'Кольори противників',
    'oppRings': 'Кільця противників',
    bubbleInd: `Індикатори-бульбашки`,
    'virColors': 'Колір вірусів',
    'splitRange': 'Радіус спліта',
    'qdsplitRange': 'Радіус швидкого даблу', //Sonia2
    'sdsplitRange': 'Радіус повільного даблу', //Sonia2
    'virusesRange': 'Дальність вірусів',
    'textStroke': 'Тіні тексту',
    'namesStroke': 'Тіні имені',
    'massStroke': 'Тіні маси',
    'cursorTracking': 'Лінія до курсора',
    bubbleCursorTracker: 'Трекер-бульбашка до курсору',
    FBTracking: 'Facebook вказівник-бульбашка',
    ingameSpectator: 'Режим спостереження в грі(ТОП-1)',
    fullSpectator: 'Режим спостереження в грі(Вся карта)',
    oneColoredSpectator: 'Клітини одного кольору за вьюпортом',
    'teammatesInd': 'Вказівники на товаришів по команді',
    'mouseSplit': 'ЛКМ - Спліт мишкою',
    waves: `СКМ - Хвилі`,
    'mouseFeed': 'ПКМ - Годувати мишкою',
    'mouseInvert': 'Інвкртувати управління мишею (ПКМ, ЛКМ)',
    'disableChat': 'Вимкнути чат',
    coloredNicks: `Кольорові ніки`,
    'hideChat': 'Приховати чат',
    'chatSounds': 'Звуки чату',
    'chatEmoticons': 'Смайлики',
    'showChatImages': 'Зображення',
    'showChatVideos': 'Відео',
    'showChatBox': 'Чатбокс замість сповіщень',
    'messageSound': 'Звук повідомлень',
    'commandSound': 'Звук команд',
    'virusSounds': 'Звук пострілу вірусу',
     virusSoundURL:'Звук пострілу вірусу URL',
     FacebookIDs: `Facebook IDs `,
     skinsForSearch: 'Target skin',//`Небо затягнуте хмарами`,
     nicksForSearch: 'Target nick',//`Стільки всього не сказали ми`,
        extras: 'Stickers',
        discord: 'Discord webhook URL',
    'showTop5': 'Відображати тім-топ',
    showTop5Sectors:'Відображати сектори в тім-топ',
    'showTargeting': 'Відображати таргетинг',
    'showTime': 'Відображати поточний час',
    'showLbData': 'Відображати масу в LEADERBOARD',
    'normalLb': 'Заголовок \ "LEADERBOARD \"',
    'centeredLb': 'Вирівнювання по центру LEADERBOARD',
    'fpsAtTop': 'FPS зверху',
    targetSearch: 'Target search',//`Небо затягнуте хмарами`,
    'showStats': 'Відображати рядок статистики',
    'showStatsMass': 'Поточна маса',
    'showStatsSTE': 'STE: Максимально набрано',
    'showStatsN16': 'Кількість частин n / 16',
    'showStatsFPS': 'FPS - кадри в секунду',
    'showStatsPPS': 'PPS - пакети в секунду',
    'blockPopups': 'Блокувати спливаючі вікна (реклама / магазин / квест)',
    'hotkeys': 'Клавіатура',
    'hk-inst-assign': 'Щоб задати гарячу клавішу, клікніть на поле вводу натисніть вибрану клавішу.',
    'hk-inst-delete': 'Щоб видалити гарячу клавішу, клікніть на поле вводу натисніть клавішу DELETE.',
    'hk-inst-keys': 'Можливі комбінації клавіш з клавішами CTRL і ALT.',
        'hk-bots-split': 'Bots split',
        'hk-bots-feed': 'Bots feed',
        'hk-bots-ai': 'Bots AI toggle',
    'hk-feed': 'Годувати',
    'hk-macroFeed': 'Макро-фід',
    'hk-split': 'Спліт',
    'hk-doubleSplit': 'Подвійний спліт',
    'hk-tripleSplit': `Потрійний спліт`,
    'hk-split16': 'Спліт на 16',
    'hk-pause': 'Пауза',
    'hk-skt': `Збільшена дистанція до курсора`,
        'hk-afk': `AFK`,
        'hk-fixSpect': `Spectator fix`,
        'hk-onoffSpect': `Spectator on/off`,
    'hk-dance': `Танець`,
    'hk-showTop5': 'Відобразити / приховати тімтоп',
    'hk-showTime': 'Відобразити / приховати поточний час',
    'hk-showSplitRange': 'Відобразити / приховати радіус спліта',
    'hk-showSplitInd': 'Відобразити / приховати індикатор сплітів',
    'hk-showTeammatesInd': 'Відобразити / приховати вказівники товаришів по команді',
    'hk-showOppColors': 'Відобразити / приховати кольори противників',
    'hk-toggleSkins': 'Перемкнути скіни (користувацькі / Agar.io)',
    'hk-invis': `Невидимка`,
    'hk-saveReplay': `Save replay`,
    'hk-showSkins': 'Відобразити / приховати скіни',
    'hk-transparentSkins': 'Перемкнути прозорі скіни',
    'hk-showStats': 'Відобразити / приховати ігрову статистику',
    'hk-toggleCells': `Перемкнути прив'язку індикаторів (найменші / найбільші клітини гравця)`,
    'hk-showFood': 'Відобразити / приховати їжу',
    'hk-showGrid': 'Відобразити / приховати сітку',
    'hk-showMiniMapGuides': 'Відобразити / приховати підказки мінікарти',
    'hk-hideChat': 'Відобразити / приховати чат',
    'hk-showHUD': 'Відобразити / приховати HUD',
    'hk-copyLb': 'Копіювати список лідерів',
    'hk-showLb': 'Відобразити / приховати таблицю лідерів',
    'hk-toggleAutoZoom': 'Перемкнути авто-зум',
    'hk-resetZoom': 'Скинути масштаб',
    'hk-zoomLevel': 'Рівень масштабування',
    'hk-toggleDeath': 'Відобразити / приховати місце смерті',
    'hk-clearChat': 'Відобразити історію чату / Очистити чат',
    'hk-showBgSectors': 'Відобразити / приховати фонові сектори',
    'hk-hideBots': 'Відобразити / приховати малих ботів',
    'hk-showNames': 'Відобразити / приховати імена',
    'hk-hideTeammatesNames': 'Відобразити / приховати імена товаришів по команді',
    'hk-showMass': 'Відобразити / приховати масу',
    'hk-showMiniMap': 'Відобразити / приховати мінікарту',
    'hk-chatMessage': 'Ввести повідомлення чату',
    'hk-quickResp': 'Швидке відродження',
    'hk-autoResp': 'Перемкнути авто-респаун',
    'hk-ingameSpectatorMode': `Перемкнути слідування вьюпорта-спостерігача в грі`,
    'hk-switchServerMode': 'Перемкнути сервер [публічний / приватний]',
    'hk-showTargeting': 'Відобразити / приховати панель стеження',
    'hk-setTargeting': 'Почати / зупинити стеження (наступний гравець)',
    'hk-cancelTargeting': 'Відміна стеження',
    'hk-changeTarget': 'Змінити ціль',
    'hk-privateMiniMap': 'Відобразити ціль на мінікарті',
    'hk-showQuest': 'Відобразити / приховати квест',
    'commands': 'Команди',
    'comm1': 'Feed me!',
    'comm2': 'Split into me!',
    'comm3': 'Need backup at %currentSector%!',
    'comm4': 'Enemy spotted at %currentSector%!',
    'comm5': 'Need a teammate!',
    'comm6': 'Tank the virus!',
    'comm7': 'Eat the virus!',
    'comm8': 'Let\'s bait!',
    'comm9': 'Fake tricksplit!',
    'comm0': 'Fuck!',
    'comm10': 'Tricksplit!',
    'comm11': 'Left!',
    'comm12': 'Up!',
    'comm13': 'Right!',
    'comm14': 'Bottom!',
    'saveComm': 'Зберегти команди',
    'theme': 'Тема',
    'restoreThemeSettings': 'Скидання теми',
    'basicTheming': 'Основна тема',
    'themePreset': 'Стандартні теми',
    'themeType': 'Тип теми',
    'darkTheme': 'Темна тема',
    'lightTheme': 'Світла тема',
    'mainColor': 'Основний колір',
    'bgColor': 'Фон',
    'bordersColor': 'Межі карти',
    'gridColor': 'Сітка',
    'sectorsColor': 'Колір секторів',
    'namesColor': 'Імена',
    'namesStrokeColor': 'Тіні імен',
    'massColor': 'Маса',
    'massStrokeColor': 'Тіні масси',
    'virusColor': 'Віруси',
    'virusStrokeColor': 'Тіні вірусів',
    'foodColor': 'Їжа',
    'namesFont': 'Шрифт імені',
    'massFont': 'Шрифт маси',
    'sectorsFont': 'Шрифт секторів',
    'namesScale': 'Розмір імен',
    'massScale': 'Розмір маси',
    'virMassScale': 'Розмір маси вірусів',
    'strokeScale': 'Товщина тіней',
    'foodSize': 'Розмір їжі',
    'bordersWidth': 'Ширина меж карти',
    'sectorsWidth': 'Ширина секторів карти',
    'sectorsFontSize': 'Розмір шрифту секторів',
    'cellsAlpha': 'Прозорість клітин',
    'skinsAlpha': 'Прозорість скінів',
    'virusAlpha': 'Прозорість вірусів',
    'textAlpha': 'Прозорість імен і маси',
    'virusStrokeSize': 'Товщина тіней вірусів',
    'teammatesIndColor': 'Індикатори товаришів',
    'cursorTrackingColor': 'Лінія курсора',
    'splitRangeColor': 'Радіус спліта',
    'enemyBSTEDColor': 'B2STE Enemy Color', //Sonia2
    'enemyBSTEColor': 'BSTE Enemy Color', //Sonia2
    'enemyBColor': 'Bigger Enemy Color', //Sonia2
    'enemySColor': 'Smaller Enemy Color', //Sonia2
    'enemySSTEColor': 'SSTE Enemy Color', //Sonia2
    'enemySSTEDColor': 'S2STE Enemy Color', //Sonia2
    'safeAreaColor': 'Безпечна зона',
    'dangerAreaColor': 'Небезпечна зона',
    'ghostCellsColor': 'Привиди гравців',
    'ghostCellsAlpha': 'Прозорість привидів',
    'menuTheming': 'Меню',
    'menuPreset': 'Стандартні стилі меню',
    'menuMainColor': 'Основний колір',
    'menuBtnTextColor': 'Button text',
    'menuPanelColor': 'Panel',
    'menuPanelColor2': 'Panel (2)',
    'menuTextColor': 'Panel text',
    'menuTextColor2': 'Panel text (2)',
    'btn1Color': 'Button #1',
    'btn1Color2': 'Button #1 (2)',
    'btn2Color': 'Button #2',
    'btn2Color2': 'Button #2 (2)',
    'btn3Color': 'Button #3',
    'btn3Color2': 'Button #3 (2)',
    'btn4Color': 'Button #4',
    'btn4Color2': 'Button #4 (2)',
    'menuBg': 'Фонове зображення',
    'menuOpacity': 'Прозорість',
    'hudTheming': 'HUD',
    'hudMainColor': 'Основний колір HUD',
    'hudColor': 'Фон HUD',
    'hudTextColor': 'Текст',
    'statsHudColor': 'Статистика',
    'timeHudColor': 'Час',
    'top5MassColor': 'Маса',
    'lbMeColor': 'Користувач в топі',
    'lbTeammateColor': 'Товариш в топі',
    'hudFont': 'HUD шрифт',
    'hudScale': 'HUD розмір',
    'chatTheming': 'Чат',
    'messageColor': 'Фон повідомлення',
    'messageTextColor': 'Текст повідомлення',
    'messageTimeColor': 'Час повідомлення',
    'messageNickColor': 'Нік в повідомленні',
    'commandsColor': 'Фон команди',
    'commandsTextColor': 'Текст  команди',
    'commandsTimeColor': 'Час  команди',
    'commandsNickColor': 'Нік в  команді',
    'chatBoxColor': 'Колір чатбоксу',
    'chatScale': 'Розмір чату',
    'miniMapTheming': 'Мінікарта',
    'miniMapSectorsColor': 'Сектори',
    'miniMapSectorColor': 'Поточний сектор',
    'miniMapGuidesColor': 'Осі X/Y',
    'miniMapNickColor': 'Нік',
    'miniMapNickStrokeColor': 'Тінь ніку',
    'miniMapMyCellColor': 'Власна клітина',
    'miniMapMyCellStrokeColor': 'Тінь власної клітини',
    'miniMapTeammatesColor': 'Товариші',
    'miniMapDeathLocationColor': 'Місце смерті',
    'miniMapFont': 'Шрифт мінікарти',
    'miniMapNickFont': 'Шрифт імен',
    'miniMapWidth': 'Ширина мінікарти',
    'miniMapSectorsOpacity': 'Прозорість секторів',
    'miniMapNickSize': 'Розмір імен',
    'miniMapNickStrokeSize': 'Товщина тіней імен',
    'miniMapMyCellSize': 'Розмір власної клітини',
    'miniMapMyCellStrokeSize': 'Товщина тіні власної клітини',
    'miniMapTeammatesSize': 'Розмір товаришів',
    'miniMapGhostCellsColor': 'Колір привидів',
    'miniMapGhostCellsAlpha': 'Прозрачность привидів',
    'imagesTheming': 'Graphics / cursors',
    'customBackground': 'Зображення Фон карти',
    'customMapTexture': 'Зображення Текстура карти',
    'customMapLogo': 'Зображення Логотип карти',
    'customCursor': 'Custom cursor image',
    'hideChatMsgA': 'Chat is visible!',
    'hideChatMsgB': 'Chat is hidden!',
    'showSkinsMsgA': 'Skins are visible!',
    'showSkinsMsgB': 'Skins are hidden!',
    'hideSmallBotsMsgA': 'Small bots are visible!',
    'hideSmallBotsMsgB': 'Small bots are hidden!',
    'autoRespMsgA': 'Auto respawn is on!',
    'autoRespMsgB': 'Auto respawn is off!',
    'autoZoomMsgA': 'Auto zoom is on!',
    'autoZoomMsgB': 'Auto zoom is off!',
    'targetNotSet': 'Target not set',
    founded: 'Founded',//'Сонечко вийшло з-за хмар',
    'targetDead': 'Dead',
    'targetDistance': 'Distance',
    'targetMass': 'Mass altogether',
    'totalPartyPlayers': 'Active players',
    'totalPartyMass': 'Total mass',
    'exportImport': 'Export / import settings',
    'exportSettings': 'Export settings',
    'exportInfo': 'To export selected settings copy the code below and save it to a text file encoded in Unicode.',
    'importSettings': 'Import settings',
    'importInfo': 'To import selected settings paste an exported code below and press the \"Import settings\" button.',
    'profile': 'Профіль',
    'profiles': 'Профілі',
    'skins': 'Skins',
    'moreSkins': 'Add skins',
    'thanks': 'Thanks to Awesome!',
    'saveSett': 'Зберегти',
    'saved': 'Збережено!',
    'resetSett': 'Скинути',
    'close': 'Close',
    'enterChatMsg': 'Enter chat message',
    'activeParties': 'Active parties',
    'noActiveParties': 'No active parties ;(',
    'playlist': 'Playlist',
    'pause': 'ПАУЗА!',
        visit: ` Edited by`,
    'exit': 'Ви впевнені що хочете покинути гру?',
    'blockWarn': 'WARNING! Popups are blocked in the settings.',
    'unblockPopups': 'Temporary unblock',
    'mass': 'Mass',
    'score': 'Score',
    'leaderboard': 'Leaderboard',
    'leaderboardLength':'Кількість в Leaderboard (10)',
    'user': 'Користувач',
    'userMuted': 'Користувач %user% тепер заглушений.',
    'userUnmuted': 'Користувач %user% знову видимий.',
    'mute': 'Заглушити',
    'unmute': 'Відображати',
    'mutedUsers': 'Заглушені користувачі',
    'activeUsers': 'Активні користувачі',
    'showActiveUsers': 'Показати активних користувачів',
    'none': 'Нема',
    'sounds': 'Звуки',
    facebook: `Facebook`,
    search: 'Search',//`Сонечко, вийди з-за хмар`,
    'page_menu_main_free_coins': 'Безплатні монети',
    'page_menu_main_gifts': 'Подарунки',
    'page_menu_main_dailyquests': 'Квест дня',
    'page_shop': 'Магазин'
}
};

let lang = 'en';
displayText['uk'] = displayText['uk-UA'] 
const userLanguage = window.navigator.language || window.navigator.userLanguage;
if (userLanguage && displayText.hasOwnProperty(userLanguage)) {
    lang = userLanguage;
}
const textLanguage = displayText[lang];
let chatCommand = {
    comm1: textLanguage.comm1,
    comm2: textLanguage.comm2,
    comm3: textLanguage.comm3,
    comm4: textLanguage.comm4,
    comm5: textLanguage.comm5,
    comm6: textLanguage.comm6,
    comm7: textLanguage.comm7,
    comm8: textLanguage.comm8,
    comm9: textLanguage.comm9,
    comm0: textLanguage.comm0,
    comm10: textLanguage.comm10,
    comm11: textLanguage.comm11,
    comm12: textLanguage.comm12,
    comm13: textLanguage.comm13,
    comm14: textLanguage.comm14
};
const escapeChar = {
    '&': `&amp;`,
    '<': `&lt;`,
    '>': `&gt;`,
    '"': `&quot;`,
    '\'': '&#39;',
    '/': `&#x2F;`
};
const emojiChar = {
    ':)': `smile.svg`,
    ';)': `wink.svg`,
    '=)': 'smirk.svg',
    ':D': `grin.svg`,
    'X-D': `xgrin.svg`,
    '=D': `joy.svg`,
    ':(': 'sad.svg',
    ';(': `cry.svg`,
    ':P': `tongue.svg`,
    ';P': 'tonguew.svg',
    ':*': 'kiss.svg',
    '$)': 'smileh.svg',
    '<3': `heart.svg`,
    '8=)': 'cool.svg',
    ':o': `astonished.svg`,
    '(:|': `sweat.svg`,
    ':|': `neutral.svg`,
    ':': 'unamused.svg',
    ':@': 'pouting.svg',
    '|-)': 'sleep.svg',
    '^_^': 'relaxed.svg',
    '-_-': `expressionless.svg`,
    '$_$': `money.svg`,
    'O:)': `angel.svg`,
    '3:)': `devil.svg`,
    '(poop)': `poo.svg`,
    '(fuck)': 'finger.svg',
    '(clap)': `clap.svg`,
    '(ok)': `ok.svg`,
    '(victory)': 'victory.svg',
    '(y)': 'thumb.svg',
    '(n)': `thumbd.svg`
};
const SkinExplain = [{
    name: `imgur.com`,
    url: `https://imgur.com/`,
    example: `https://i.imgur.com/xdmUp5N.png`,
    pattern: `https?:\/\/\w+\.imgur\.com\/\w{6,}\.(?:%file_ext%)\??\d*`
}, {
    name: `put.re`,
    url: 'https://put.re/',
    example: 'https://s.put.re/iYHAW65g.png',
    pattern: `https?:\/\/\w+\.put\.re\/\w{8,}\.(?:%file_ext%)`
}, {
    name: `postimages.org`,
    url: `https://postimages.org/`,
    example: 'https://i.postimg.cc/zzK0sRPg/xdmUp5N.png',
    pattern: 'https?:\/\/\w+\.postimg\.cc\/\w{8,}\/\w+\.(?:%file_ext%)'
}];
const gameTheme = {
    'ogario-v3': {            name: `OGARio v3`,            darkTheme: true,            mainColor: '#01d9cc',            bgColor: '#000a11',            bordersColor: `#01d9cc`,            gridColor: `#00243e`,            sectorsColor: `#00243e`,            namesColor: '#ffffff',            namesStrokeColor: `#000000`,            massColor: `#ffffff`,            massStrokeColor: '#000000',            virusColor: `#002f52`,            virusStrokeColor: `#00b9e8`,            foodColor: `#5000ff`,            teammatesIndColor: `#ffffff`,            cursorTrackingColor: `#ffffff`,            splitRangeColor: `#ffffff`,        'enemyBSTEDColor': '#8000ff',        'enemyBSTEColor': '#BE00FF',      'enemyBColor': '#FF0A00',        'enemySColor': '#00C8FF',        'enemySSTEColor': '#048245',        'enemySSTEDColor': '#64FF00',            safeAreaColor: `#ffffff`,            dangerAreaColor: `#bf00aa`,            namesFont: 'ubuntu-bold',           massFont: `ubuntu-bold`,            sectorsFont: 'ubuntu',            namesScale: 1,            massScale: 3,            foodSize: 5,            bordersWidth: 40,            sectorsWidth: 40,            sectorsFontSize: 1200,            cellsAlpha: 0.9,            skinsAlpha: 0.7,            virusAlpha: 0.6,            textAlpha: 1,            virusStrokeSize: 14,            menuPreset: `ogario-v3`,            menuMainColor: `#01d9cc`,            menuBtnTextColor: `#ffffff`,            menuPanelColor: `#00243e`,            menuPanelColor2: '#002f52',            menuTextColor: `#ffffff`,            menuTextColor2: `#8096a7`,            btn1Color: `#018cf6`,            btn1Color2: '#0176ce',            btn2Color: `#00b9e8`,            btn2Color2: `#0099c0`,            btn3Color: '#8d5fe6',            btn3Color2: `#814ee3`,            btn4Color: `#bf00aa`,           btn4Color2: '#a80096',            menuBg: `https://cdn.ogario.ovh/static/img/pattern.png`,            menuOpacity: 0.96,            hudMainColor: `#01d9cc`,            hudColor: `rgba(0,0,0,0.4)`,            hudTextColor: `#ffffff`,            statsHudColor: `#ffffff`,            timeHudColor: `#01d9cc`,            top5MassColor: '#bf00aa',            lbMeColor: '#bf00aa',            lbTeammateColor: `#018cf6`,            hudFont: 'ubuntu-bold',            hudScale: 1,            messageColor: `rgba(0,0,0,0.4)`,            messageTextColor: `#ffffff`,            messageTimeColor: '#018cf6',            messageNickColor: `#01d9cc`,            commandsColor: 'rgba(191,0,170,0.9)',            commandsTextColor: `#ffffff`,            commandsTimeColor: `#bf00aa`,            commandsNickColor: `#ffffff`,            chatBoxColor: 'rgba(0,0,0,0.4)',            chatScale: 1,            miniMapSectorsColor: '#ffffff',            miniMapSectorColor: `#01d9cc`,            miniMapGuidesColor: `#bf00aa`,            miniMapNickColor: `#ffffff`,            miniMapNickStrokeColor: '#000000',            miniMapMyCellColor: `#ffffff`,            miniMapMyCellStrokeColor: `#bf00aa`,            miniMapTeammatesColor: `#01d9cc`,            miniMapDeathLocationColor: `#bf00aa`,            miniMapFont: `ubuntu-bold`,            miniMapNickFont: `ubuntu-bold`,            miniMapWidth: 240,            miniMapSectorsOpacity: 0.1,            miniMapNickSize: 11,            miniMapNickStrokeSize: 2,            miniMapMyCellSize: 7.5,            miniMapMyCellStrokeSize: 4,            miniMapTeammatesSize: 5.5,            customBackground: '',            'customMapTexture': '',            customCursor: `https://cdn.ogario.ovh/static/img/cursors/cursor_02.cur`        },
    'masscare':{"name":"Masscare (dark)","darkTheme":true,"mainColor":"#651fff","bgColor":"#000000","bordersColor":"#ffffff","gridColor":"#0a0a0a","sectorsColor":"#0a0a0a","namesColor":"#ffffff","namesStrokeColor":"#000000","massColor":"#ffffff","massStrokeColor":"#000000","virusColor":"#000000","virusStrokeColor":"#ffffff","foodColor":"#002a80","teammatesIndColor":"#ffffff","cursorTrackingColor":"#ffffff","splitRangeColor":"#ffffff","ghostCellsColor":"#ffffff","safeAreaColor":"#ffffff","dangerAreaColor":"#ffffff","namesFont":"ubuntu","namesFontFamily":"Ubuntu","namesFontWeight":400,"massFont":"ubuntu","massFontFamily":"Ubuntu","massFontWeight":400,"sectorsFont":"ubuntu","sectorsFontFamily":"Ubuntu","sectorsFontWeight":400,"sectorsX":5,"sectorsY":5,"namesScale":0.5,"massScale":1,"virMassScale":3,"strokeScale":1,"foodSize":1,"bordersWidth":40,"sectorsWidth":40,"sectorsFontSize":900,"cellsAlpha":0.9,"skinsAlpha":0.99,"virusAlpha":0.6,"textAlpha":1,"ghostCellsAlpha":0.3,"virusStrokeSize":14,"menuPreset":"agario","menuMainColor":"#c880ff","menuBtnTextColor":"#ffffff","menuPanelColor":"#0a0a0a","menuPanelColor2":"#0a0a0a","menuTextColor":"#ffffff","menuTextColor2":"#ffffff","btn1Color":"#0a0a0a","btn1Color2":"#0a0a0a","btn2Color":"#0a0a0a","btn2Color2":"#0a0a0a","btn3Color":"#0a0a0a","btn3Color2":"#0a0a0a","btn4Color":"#0a0a0a","btn4Color2":"#0a0a0a","menuBg":"https://i.imgur.com/HMy2hry.png","menuOpacity":1,"hudMainColor":"#000000","hudColor":"rgba(0,0,0,0)","hudTextColor":"#ffffff","statsHudColor":"#ffffff","timeHudColor":"#ff80cc","top5MassColor":"#f380ff","lbMeColor":"#80ffff","lbTeammateColor":"#80ffff","hudFont":"ubuntu","hudFontFamily":"Ubuntu","hudFontWeight":400,"hudScale":1,"messageColor":"rgba(0,0,0,0)","messageTextColor":"#ffffff","messageTimeColor":"#262626","messageNickColor":"#c880ff","commandsColor":"rgba(0,0,0,0)","commandsTextColor":"#ffffff","commandsTimeColor":"#262626","commandsNickColor":"#c880ff","chatBoxColor":"rgba(0,0,0,0)","chatScale":1,"miniMapSectorsColor":"#ffffff","miniMapSectorColor":"#000000","miniMapGuidesColor":"#f380ff","miniMapNickColor":"#ffffff","miniMapNickStrokeColor":"#000000","miniMapMyCellColor":"#f380ff","miniMapMyCellStrokeColor":"#f380ff","miniMapTeammatesColor":"#ff80cc","miniMapDeathLocationColor":"#ff80cc","miniMapGhostCellsColor":"#ffffff","miniMapFont":"ubuntu","miniMapFontFamily":"Ubuntu","miniMapFontWeight":400,"miniMapNickFont":"ubuntu","miniMapNickFontFamily":"Ubuntu","miniMapNickFontWeight":400,"miniMapWidth":200,"miniMapTop":0,"miniMapSectorsOpacity":0.15,"miniMapNickSize":9,"miniMapNickStrokeSize":0,"miniMapMyCellSize":4.5,"miniMapMyCellStrokeSize":0,"miniMapTeammatesSize":4.5,"miniMapGhostCellsAlpha":0.05,"customBackground":"","customMapTexture":"","customMapLogo":"","customCursor":""},
    'ogario-orange': {            name: `OGARio v2`,            darkTheme: true,            mainColor: `#ff7800`,            bgColor: `#111111`,            bordersColor: `#ff7800`,            gridColor: '#292929',            sectorsColor: `#292929`,            namesColor: '#ffffff',            namesStrokeColor: `#000000`,            massColor: `#ffffff`,            massStrokeColor: '#000000',            virusColor: `#666666`,            virusStrokeColor: `#666666`,            foodColor: `#e16400`,            hudMainColor: '#ff7800',            statsHudColor: `#ff7800`,            top5MassColor: `#ff7800`,            timeHudColor: `#ff7800`,            messageNickColor: `#ff7800`,            commandsColor: `rgba(255,120,0,0.9)`,            commandsTimeColor: `#ff7800`,            commandsTextColor: `#ffffff`,            miniMapSectorsColor: `#ffffff`,            miniMapSectorColor: `#ff7800`,            miniMapGuidesColor: `#ff7800`,            miniMapMyCellColor: `#ffffff`,            miniMapMyCellStrokeColor: `#ff7800`,            miniMapTeammatesColor: '#ff7800',            miniMapDeathLocationColor: `#ff7800`,            miniMapSectorsOpacity: 0.1        },
    'ogario-gold': {            name: `OGARio LE`,            darkTheme: true,            mainColor: `#b5a642`,            bgColor: `#000000`,            bordersColor: `#b5a642`,            gridColor: `#111111`,            sectorsColor: `#111111`,            namesColor: '#ffffff',            namesStrokeColor: `#000000`,            massColor: `#ffffff`,            massStrokeColor: '#000000',            virusColor: `#666666`,            virusStrokeColor: '#666666',            foodColor: `#998c36`,            hudMainColor: '#b5a642',            statsHudColor: `#b5a642`,            top5MassColor: `#b5a642`,            timeHudColor: '#b5a642',            messageNickColor: '#b5a642',            commandsColor: 'rgba(181,166,66,0.9)',            commandsTimeColor: `#b5a642`,            commandsTextColor: `#ffffff`,            miniMapSectorsColor: `#ffffff`,            miniMapSectorColor: `#b5a642`,            miniMapGuidesColor: `#b5a642`,            miniMapMyCellColor: `#ffffff`,            miniMapMyCellStrokeColor: `#b5a642`,            miniMapTeammatesColor: `#b5a642`,            miniMapDeathLocationColor: `#b5a642`,            miniMapSectorsOpacity: 0.1        },
    'ref-style': {            name: "ReF's Style",            bgColor: "#000000",            bordersColor: "#0074fc",            bordersWidth: 80,            btn1Color: "#0074fc",            btn1Color2: "#3592ff",            btn2Color: "#3592ff",            btn2Color2: "#3592ff",            btn3Color: "#3592ff",            btn3Color2: "#3592ff",            btn4Color: "#3592ff",            btn4Color2: "#3592ff",            cellsAlpha: 0.99,            chatBoxColor: "rgba(0,0,0,0.4)",            chatScale: 1,            commandsColor: "rgba(0,116,252,1)",            commandsNickColor: "#ffffff",            commandsTextColor: "#ffffff",           commandsTimeColor: "#000000",            cursorTrackingColor: "#ffffff",            customBackground: "",            customCursor: "",            dangerAreaColor: "#0074fc",            darkTheme: true,            foodColor: "#0074fc",            foodSize: 1,            ghostCellsAlpha: 0.3,            ghostCellsColor: "#ffffff",            gridColor: "#0094ff",            hudColor: "rgba(0,0,0,0.49)",            hudFont: "ubuntu-bold",            hudFontFamily: "Ubuntu",            hudFontWeight: 700,            hudMainColor: "#0074fc",            hudScale: 1.15,            hudTextColor: "#ffffff",            lbMeColor: "#0074fc",            lbTeammateColor: "#0074fc",            mainColor: "#01d9cc",            massColor: "#ffffff",            massFont: "ubuntu-bold",            massFontFamily: "Ubuntu",            massFontWeight: 700,            massScale: 0.9,            massStrokeColor: "#000000",            menuBg: "",            menuBtnTextColor: "#ffffff",            menuMainColor: "#0074fc",            menuOpacity: 1,            menuPanelColor: "#050008",            menuPanelColor2: "#1d0526",            menuPreset: "ogario-v3",            menuTextColor: "#ffffff",            menuTextColor2: "#65458f",            messageColor: "rgba(0,0,0,0.4)",            messageNickColor: "#0074fc",           messageTextColor: "#e8e8e8",            messageTimeColor: "#545454",            miniMapDeathLocationColor: "#2b2b2b",            miniMapFont: "ubuntu-bold",            miniMapFontFamily: "Ubuntu",            miniMapFontWeight: 700,            miniMapGhostCellsAlpha: 0.15,            miniMapGhostCellsColor: "#ffffff",            miniMapGuidesColor: "#ff00a8",            miniMapMyCellColor: "#f0ff3d",            miniMapMyCellSize: 5,            miniMapMyCellStrokeColor: "#acba07",            miniMapMyCellStrokeSize: 0,            miniMapNickColor: "#ffffff",            miniMapNickFont: "ubuntu-bold",            miniMapNickFontFamily: "Ubuntu",            miniMapNickFontWeight: 700,            miniMapNickSize: 9,            miniMapNickStrokeColor: "#4d4d4d",            miniMapNickStrokeSize: 0,            miniMapSectorColor: "#000000",            miniMapSectorsColor: "#ffffff",            miniMapSectorsOpacity: 0.1,            miniMapTeammatesColor: "#305eff",            miniMapTeammatesSize: 5,            miniMapTop: 25,            miniMapWidth: 250,            namesColor: "#ffffff",            namesFont: "ubuntu-bold",            namesFontFamily: "Ubuntu",            namesFontWeight: 700,            namesScale: 0.9,            namesStrokeColor: "#000000",            safeAreaColor: "#ffffff",            sectorsColor: "#0074fc",            sectorsFont: "ubuntu",            sectorsFontFamily: "Ubuntu",            sectorsFontSize: 940,            sectorsFontWeight: 400,            sectorsWidth: 6,            sectorsX: 5,            sectorsY: 5,            skinsAlpha: 0.7,            splitRangeColor: "#ffffff",        'enemyBSTEDColor': '#8000ff',         'enemyBSTEColor': '#BE00FF',         'enemyBColor': '#FF0A00',         'enemySColor': '#00C8FF',         'enemySSTEColor': '#048245',         'enemySSTEDColor': '#64FF00',             statsHudColor: "#ffffff",           strokeScale: 1,            teammatesIndColor: "#ffffff",            textAlpha: 1,            timeHudColor: "#0074fc",            top5MassColor: "#0074fc",            virMassScale: 2,            virusAlpha: 0.4,            virusColor: "#3b3b3b",            virusStrokeColor: "#ffffff",            virusStrokeSize: 10,            customBackground: '',            customCursor: ``        },
    'turbo-style': {            name: "Turbo's Style",            bgColor: "#000000",            bordersColor: "#ff2b77",            bordersWidth: 80,            btn1Color: "#ff2b77",            btn1Color2: "#ff005b",            btn2Color: "#ff2b77",            btn2Color2: "#ff005b",            btn3Color: "#ff2b77",            btn3Color2: "#ff005b",            btn4Color: "#ff2b77",            btn4Color2: "#ff005b",            cellsAlpha: 0.99,            chatBoxColor: "rgba(0,0,0,0.4)",            chatScale: 1,            commandsColor: "rgba(255,43,119,1)",            commandsNickColor: "#ffffff",            commandsTextColor: "#ffffff",            commandsTimeColor: "#000000",            cursorTrackingColor: "#ffffff",            customBackground: "",            customCursor: "",            dangerAreaColor: "#ff2b77",            darkTheme: true,            foodColor: "#ff2b77",            foodSize: 1,            ghostCellsAlpha: 0.3,            ghostCellsColor: "#ffffff",            gridColor: "#ff2b77",            hudColor: "rgba(0,0,0,0.49)",            hudFont: "ubuntu-bold",            hudFontFamily: "Ubuntu",            hudFontWeight: 700,            hudMainColor: "#ff2b77",            hudScale: 1.15,            hudTextColor: "#ffffff",            lbMeColor: "#ff2b77",            lbTeammateColor: "#ff2b77",            mainColor: "#ff2b77",            massColor: "#000000",            massFont: "ubuntu-bold",            massFontFamily: "Ubuntu",            massFontWeight: 700,            massScale: 0.9,            massStrokeColor: "#ffffff",            menuBg: "",            menuBtnTextColor: "#ffffff",            menuMainColor: "#ff2b77",            menuOpacity: 1,            menuPanelColor: "#23192c",            menuPanelColor2: "#382946",            menuPreset: "ogario-v3",            menuTextColor: "#ffffff",            menuTextColor2: "#65458f",            messageColor: "rgba(0,0,0,0.4)",            messageNickColor: "#ff2b77",            messageTextColor: "#e8e8e8",            messageTimeColor: "#545454",            miniMapDeathLocationColor: "#2b2b2b",            miniMapFont: "ubuntu-bold",            miniMapFontFamily: "Ubuntu",            miniMapFontWeight: 700,            miniMapGhostCellsAlpha: 0.15,            miniMapGhostCellsColor: "#ffffff",            miniMapGuidesColor: "#ff2b77",            miniMapMyCellColor: "#ffdd56",            miniMapMyCellSize: 5,            miniMapMyCellStrokeColor: "#ff9a6b",            miniMapMyCellStrokeSize: 0,            miniMapNickColor: "#ffffff",            miniMapNickFont: "ubuntu-bold",            miniMapNickFontFamily: "Ubuntu",            miniMapNickFontWeight: 700,            miniMapNickSize: 9,            miniMapNickStrokeColor: "#4d4d4d",            miniMapNickStrokeSize: 0,            miniMapSectorColor: "#000000",            miniMapSectorsColor: "#ffffff",            miniMapSectorsOpacity: 0.1,            miniMapTeammatesColor: "#ff005b",            miniMapTeammatesSize: 5,            miniMapTop: 25,            miniMapWidth: 250,            namesColor: "#000000",            namesFont: "ubuntu-bold",            namesFontFamily: "Ubuntu",            namesFontWeight: 700,            namesScale: 0.9,            namesStrokeColor: "#ffffff",            safeAreaColor: "#ffffff",            sectorsColor: "#ff2b77",            sectorsFont: "ubuntu",            sectorsFontFamily: "Ubuntu",            sectorsFontSize: 940,            sectorsFontWeight: 400,            sectorsWidth: 6,            sectorsX: 5,            sectorsY: 5,            skinsAlpha: 0.7,            splitRangeColor: "#ffffff",        'enemyBSTEDColor': '#8000ff',         'enemyBSTEColor': '#BE00FF',         'enemyBColor': '#FF0A00',         'enemySColor': '#00C8FF',         'enemySSTEColor': '#048245',         'enemySSTEDColor': '#64FF00',             statsHudColor: "#ffffff",            strokeScale: 1,            teammatesIndColor: "#ffffff",            textAlpha: 1,            timeHudColor: "#ff2b77",            top5MassColor: "#ff2b77",            virMassScale: 2,            virusAlpha: 0.4,            virusColor: "#3b3b3b",            virusStrokeColor: "#ff2b77",            virusStrokeSize: 10,            customBackground: '',            customCursor: ``        },
    'sniikz-style': {            name: `SniiKz's Style`,            darkTheme: true,            mainColor: `#01d9cc`,            bgColor: `#000000`,            bordersColor: '#ffffff',            gridColor: `#00243e`,            sectorsColor: '#00243e',            namesColor: `#ffffff`,            namesStrokeColor: '#000000',            massColor: '#ffffff',            massStrokeColor: `#000000`,            virusColor: '#3b3b3b',            virusStrokeColor: `#ffffff`,            foodColor: `#5000ff`,            teammatesIndColor: `#ffffff`,            cursorTrackingColor: `#ffffff`,            splitRangeColor: '#ffffff',        'enemyBSTEDColor': '#8000ff',         'enemyBSTEColor': '#BE00FF',         'enemyBColor': '#FF0A00',         'enemySColor': '#00C8FF',         'enemySSTEColor': '#048245',         'enemySSTEDColor': '#64FF00',             safeAreaColor: `#ffffff`,            dangerAreaColor: '#bf00aa',            massScale: 4,            foodSize: 1,            bordersWidth: 40,            sectorsWidth: 40,            sectorsFontSize: 1200,            cellsAlpha: 0.99,            skinsAlpha: 0.7,            virusAlpha: 0.4,            virusStrokeSize: 10,            menuPreset: `ogario-v3`,            menuMainColor: `#fc0079`,            menuBtnTextColor: `#ffffff`,            menuPanelColor: '#050008',            menuPanelColor2: `#1d0526`,            menuTextColor: `#ffffff`,            menuTextColor2: `#65458f`,            btn1Color: '#4f0242',            btn1Color2: `#3b0431`,            btn2Color: `#6b0036`,            btn2Color2: `#4d0227`,            btn3Color: `#aa084e`,            btn3Color2: `#80063b`,            btn4Color: `#aa084e`,            btn4Color2: '#8a063f',            menuBg: `https://cdn.ogario.ovh/static/img/pattern.png`,            menuOpacity: 1,            hudMainColor: '#5974ff',            hudColor: 'rgba(36,36,36,0.49)',            hudTextColor: `#ffffff`,            statsHudColor: `#ffffff`,            timeHudColor: '#737373',            top5MassColor: `#1fe000`,            lbMeColor: '#bf00aa',            lbTeammateColor: `#018cf6`,            hudScale: 1.15,            messageColor: 'rgba(0,0,0,0.4)',            messageTextColor: `#e8e8e8`,            messageTimeColor: '#545454',            messageNickColor: '#05ff00',            commandsColor: `rgba(36,36,36,0.9)`,            commandsTextColor: `#ffffff`,            commandsTimeColor: '#545454',            commandsNickColor: `#ffffff`,            chatBoxColor: `rgba(0,0,0,0.4)`,            chatScale: 1,            miniMapSectorsColor: '#ffffff',           miniMapSectorColor: `#000000`,            miniMapGuidesColor: `#ff00a8`,            miniMapNickColor: `#ffffff`,            miniMapNickStrokeColor: `#4d4d4d`,            miniMapMyCellColor: '#f0ff3d',            miniMapMyCellStrokeColor: `#acba07`,            miniMapTeammatesColor: '#305eff',            miniMapDeathLocationColor: '#2b2b2b',            miniMapWidth: 250,            miniMapSectorsOpacity: 0.1,            miniMapNickSize: 9,            miniMapNickStrokeSize: 0,            miniMapMyCellSize: 5,            miniMapMyCellStrokeSize: 0,            miniMapTeammatesSize: 5,            customBackground: '',            customCursor: `https://cdn.ogario.ovh/static/img/cursors/cursor_01.cur`        },
    'hkg-style': {            name: `HKG Style`,            darkTheme: true,            mainColor: '#651fff',            bgColor: `#000000`,            bordersColor: `#ffffff`,            gridColor: `#111111`,            sectorsColor: `#111111`,            namesColor: `#ffffff`,            namesStrokeColor: `#000000`,            massColor: `#ffffff`,            massStrokeColor: `#000000`,            virusColor: `#666666`,            virusStrokeColor: `#666666`,            foodColor: `#651fff`,            hudMainColor: `#651fff`,            statsHudColor: '#651fff',            top5MassColor: '#651fff',            timeHudColor: `#651fff`,            messageNickColor: `#651fff`,            commandsColor: `rgba(101,31,255,0.9)`,            commandsTimeColor: `#651fff`,            commandsTextColor: `#ffffff`,            miniMapSectorsColor: '#ffffff',            miniMapSectorColor: `#651fff`,            miniMapGuidesColor: `#651fff`,            miniMapMyCellColor: `#ffffff`,            miniMapMyCellStrokeColor: `#651fff`,            miniMapTeammatesColor: '#651fff',            miniMapDeathLocationColor: '#651fff',            miniMapSectorsOpacity: 0.1        },
    'agario-light': {            name: `Agar.io Light`,            darkTheme: false,            mainColor: `#ffffff`,            bgColor: `#f2fbff`,            bordersColor: `#858a8c`,            gridColor: `#ced6d9`,            sectorsColor: '#ced6d9',            namesColor: '#ffffff',            namesStrokeColor: '#000000',            massColor: `#ffffff`,            massStrokeColor: '#000000',            virusColor: `#33ff33`,            virusStrokeColor: `#2de52d`,            foodColor: '#2de52d',            hudMainColor: `#ffffff`,            statsHudColor: `#ffffff`,            top5MassColor: `#ffffff`,            timeHudColor: `#ffffff`,            messageNickColor: '#ffffff',            commandsColor: `rgba(255,255,255,0.9)`,            commandsTimeColor: `#ffffff`,            commandsTextColor: `#000000`,            miniMapSectorsColor: `#ffffff`,            miniMapSectorColor: '#ffffff',            miniMapGuidesColor: '#ffffff',            miniMapMyCellColor: `#ffffff`,            miniMapMyCellStrokeColor: '#ffffff',            miniMapTeammatesColor: `#ffffff`,            miniMapDeathLocationColor: `#ffffff`,            miniMapSectorsOpacity: 0.25        },
    'agario-dark': {            name: `Agar.io Dark`,            darkTheme: true,            mainColor: `#ffffff`,            bgColor: `#111111`,            bordersColor: `#999999`,            gridColor: `#333333`,            sectorsColor: `#333333`,            namesColor: `#ffffff`,            namesStrokeColor: `#000000`,            massColor: `#ffffff`,            massStrokeColor: `#000000`,            virusColor: `#33ff33`,            virusStrokeColor: `#2de52d`,            foodColor: `#2de52d`,            hudMainColor: `#ffffff`,            statsHudColor: '#ffffff',            top5MassColor: `#ffffff`,            timeHudColor: `#ffffff`,            messageNickColor: `#ffffff`,            commandsColor: `rgba(255,255,255,0.9)`,            commandsTimeColor: `#ffffff`,            commandsTextColor: '#ffffff',            miniMapSectorsColor: `#ffffff`,            miniMapSectorColor: `#ffffff`,            miniMapGuidesColor: `#ffffff`,            miniMapMyCellColor: `#ffffff`,            miniMapMyCellStrokeColor: '#ffffff',            miniMapTeammatesColor: `#ffffff`,            miniMapDeathLocationColor: `#ffffff`,            miniMapSectorsOpacity: 0.1        },
    "sniiKz-pink":{"name":"SniiKz's pink","darkTheme":true,"mainColor":"#731010","bgColor":"#230126","gridColor":"#4f0473","bordersColor":"#ad00ff","foodColor":"#ad00ff","virusColor":"#500c52","virusStrokeColor":"#ad00ff","cursorTrackingColor":"#bd00ff","splitRangeColor":"#ffffff","namesFont":"oswald-bold","namesFontFamily":"Oswald","namesFontWeight":700,"sectorsFont":"oswald-bold","sectorsFontFamily":"Oswald","sectorsFontWeight":700,"sectorsX":5,"sectorsY":5,"nameScale":1,"massScale":2,"massScaleMargin":1.5,"foodSize":1,"bordersWidth":30,"sectorsWidth":30,"sectorsFontSize":1360,"cellsAlpha":0.8,"skinsAlpha":0.8,"virusAlpha":0.5,"virusStrokeSize":16,"menuPreset":"ogario-v3","menuMainColor":"#ad00ff","menuBtnTextColor":"#ffffff","menuPanelColor":"#360428","menuPanelColor2":"#3b0035","menuTextColor":"#ffffff","menuTextColor2":"#ff00f5","btn1Color":"#4c0070","btn1Color2":"#4c0070","btn2Color":"#eb00ff","btn2Color2":"#eb00ff","btn3Color":"#7900b3","btn3Color2":"#814ee3","btn4Color":"#7d006f","btn4Color2":"#7d006f","menuBg":"https://www.desktopimages.org/pictures/2014/0303/1/dark-pink-vintage-pattern-wallpaper-60016.jpg","menuOpacity":0.9,"hudMainColor":"#000000","hudColor":"rgba(0,0,0,0)","hudTextColor":"#ad00ff","statsHudColor":"#ffffff","timeHudColor":"#01d9cc","top5MassColor":"#bf00aa","lbMeColor":"#bf00aa","lbTeammateColor":"#018cf6","hudFont":"ubuntu-bold","hudFontFamily":"Ubuntu","hudFontWeight":700,"hudScale":1,"messageColor":"rgba(204,0,255,0.15)","messageTextColor":"#ffffff","messageTimeColor":"#ad00ff","messageNickColor":"#ffffff","commandsColor":"rgba(204,0,255,0.15)","commandsTextColor":"#ff00f5","commandsTimeColor":"#ad00ff","commandsNickColor":"#ffffff","chatBoxColor":"rgba(0,0,0,0)","chatScale":1.01,"miniMapSectorColor":"#ad00ff","miniMapGuidesColor":"#ffffff","miniMapNickColor":"#ffffff","miniMapNickStrokeColor":"#ad00ff","miniMapMyCellColor":"#ff00d6","miniMapMyCellStrokeColor":"#750068","miniMapTeammatesColor":"#ff00b8","miniMapDeathLocationColor":"#ffffff","miniMapFont":"oswald-bold","miniMapFontFamily":"Oswald","miniMapFontWeight":700,"miniMapNickFont":"oswald-bold","miniMapNickFontFamily":"Oswald","miniMapNickFontWeight":700,"miniMapWidth":244,"miniMapTop":24,"miniMapSectorsOpacity":0.28,"miniMapNickSize":9,"miniMapNickStrokeSize":2,"miniMapMyCellSize":8,"miniMapMyCellStrokeSize":3,"miniMapTeammatesSize":6.5,"customBackground":"","customCursor":"https://cdn.ogario.ovh/static/img/cursors/cursor_12.cur"},
    "snipez-style":{"name":"Snipez's Style","darkTheme":true,"mainColor":"#ff7800","bgColor":"#000000","gridColor":"#292929","bordersColor":"#ff0000","foodColor":"#ff0000","virusColor":"#000000","virusStrokeColor":"#ff0000","cursorTrackingColor":"#ffffff","splitRangeColor":"#ffffff","namesFont":"roboto-bold","namesFontFamily":"Roboto","namesFontWeight":700,"sectorsFont":"oswald","sectorsFontFamily":"Oswald","sectorsFontWeight":400,"sectorsX":5,"sectorsY":5,"nameScale":1.4,"massScale":4,"massScaleMargin":1.575,"foodSize":1,"bordersWidth":32,"sectorsWidth":2,"sectorsFontSize":200,"cellsAlpha":0.99,"skinsAlpha":0.99,"virusAlpha":0.24,"virusStrokeSize":25,"menuPreset":"ogario-v3","menuMainColor":"#ff0000","menuBtnTextColor":"#ff0000","menuPanelColor":"#000000","menuPanelColor2":"#000000","menuTextColor":"#ff0000","menuTextColor2":"#ff0000","btn1Color":"#0a0a0a","btn1Color2":"#0a0a0a","btn2Color":"#0a0a0a","btn2Color2":"#0a0a0a","btn3Color":"#0a0a0a","btn3Color2":"#0a0a0a","btn4Color":"#0a0a0a","btn4Color2":"#0a0a0a","menuBg":"https://wallpapercave.com/wp/Np83gl0.jpg","menuOpacity":1,"hudMainColor":"#ff002e","hudColor":"rgba(20,82,78,0)","hudTextColor":"#ff0000","statsHudColor":"#ff0000","timeHudColor":"#ff0000","top5MassColor":"#ff0000","lbMeColor":"#ffffff","lbTeammateColor":"#ffffff","hudFont":"ubuntu","hudFontFamily":"Ubuntu","hudFontWeight":400,"hudScale":1,"messageColor":"rgba(0,0,0,0)","messageTextColor":"#ff0000","messageTimeColor":"#ff0000","messageNickColor":"#ff0000","commandsColor":"rgba(255,0,0,1)","commandsTextColor":"#000000","commandsTimeColor":"#ff0000","commandsNickColor":"#000000","chatBoxColor":"rgba(255,255,255,0)","chatScale":1,"miniMapSectorColor":"#ff0000","miniMapGuidesColor":"#ff0000","miniMapNickColor":"#f00000","miniMapNickStrokeColor":"#cf0404","miniMapMyCellColor":"#ff0000","miniMapMyCellStrokeColor":"#ff0000","miniMapTeammatesColor":"#5e5e5e","miniMapDeathLocationColor":"#ff0000","miniMapFont":"roboto","miniMapFontFamily":"Roboto","miniMapFontWeight":400,"miniMapNickFont":"roboto","miniMapNickFontFamily":"Roboto","miniMapNickFontWeight":400,"miniMapWidth":228,"miniMapTop":23,"miniMapSectorsOpacity":0.18,"miniMapNickSize":9,"miniMapNickStrokeSize":1,"miniMapMyCellSize":6,"miniMapMyCellStrokeSize":6,"miniMapTeammatesSize":5.5,"customBackground":"","customCursor":""},
    "hamzuke-style":{"name":"Hamzuke's Style","darkTheme":true,"mainColor":"#01d9cc","bgColor":"#000000","gridColor":"#5c0000","bordersColor":"#fc0000","foodColor":"#ff004c","virusColor":"#000000","virusStrokeColor":"#ff0000","cursorTrackingColor":"#ffffff","splitRangeColor":"#ffffff","namesFont":"ubuntu-bold","namesFontFamily":"Ubuntu","namesFontWeight":700,"sectorsFont":"ubuntu","sectorsFontFamily":"Ubuntu","sectorsFontWeight":400,"sectorsX":5,"sectorsY":5,"nameScale":1,"massScale":3,"massScaleMargin":1.25,"foodSize":5,"bordersWidth":40,"sectorsWidth":40,"sectorsFontSize":1200,"cellsAlpha":0.9,"skinsAlpha":0.7,"virusAlpha":0.6,"virusStrokeSize":14,"menuPreset":"ogario-v3","menuMainColor":"#ff0000","menuBtnTextColor":"#ffffff","menuPanelColor":"#000000","menuPanelColor2":"#000626","menuTextColor":"#ffffff","menuTextColor2":"#8096a7","btn1Color":"#f60101","btn1Color2":"#ce0101","btn2Color":"#e8002a","btn2Color2":"#c00073","btn3Color":"#ff0000","btn3Color2":"#814ee3","btn4Color":"#bf00aa","btn4Color2":"#a80096","menuBg":"https://cdn.ogario.ovh/static/img/pattern.png","menuOpacity":0.96,"hudMainColor":"#d90101","hudColor":"rgba(0,0,0,0.4)","hudTextColor":"#ffffff","statsHudColor":"#ffffff","timeHudColor":"#d90101","top5MassColor":"#bf0000","lbMeColor":"#bf00aa","lbTeammateColor":"#f60110","hudFont":"ubuntu-bold","hudFontFamily":"Ubuntu","hudFontWeight":700,"hudScale":1,"messageColor":"rgba(0,0,0,0.4)","messageTextColor":"#ffffff","messageTimeColor":"#f60101","messageNickColor":"#01d9cc","commandsColor":"rgba(191,0,170,0.9)","commandsTextColor":"#ffffff","commandsTimeColor":"#bf00aa","commandsNickColor":"#ffffff","chatBoxColor":"rgba(0,0,0,0.4)","chatScale":1,"miniMapSectorColor":"#01d9cc","miniMapGuidesColor":"#bf0000","miniMapNickColor":"#ffffff","miniMapNickStrokeColor":"#000000","miniMapMyCellColor":"#000000","miniMapMyCellStrokeColor":"#bf0000","miniMapTeammatesColor":"#01d9cc","miniMapDeathLocationColor":"#bf00aa","miniMapFont":"ubuntu-bold","miniMapFontFamily":"Ubuntu","miniMapFontWeight":700,"miniMapNickFont":"ubuntu-bold","miniMapNickFontFamily":"Ubuntu","miniMapNickFontWeight":700,"miniMapWidth":238,"miniMapTop":24,"miniMapSectorsOpacity":0.28,"miniMapNickSize":11,"miniMapNickStrokeSize":2,"miniMapMyCellSize":7.5,"miniMapMyCellStrokeSize":4,"miniMapTeammatesSize":5.5,"customBackground":"","customCursor":""},
    "kozi-style":{"name":"Kozi's Style","darkTheme":true,"mainColor":"#651fff","bgColor":"#000000","gridColor":"#111111","bordersColor":"#ffffff","foodColor":"#7c1fff","virusColor":"#666666","virusStrokeColor":"#666666","cursorTrackingColor":"#ffffff","splitRangeColor":"#ffffff","namesFont":"ubuntu-bold","namesFontFamily":"Ubuntu","namesFontWeight":700,"sectorsFont":"ubuntu","sectorsFontFamily":"Ubuntu","sectorsFontWeight":400,"sectorsX":5,"sectorsY":5,"nameScale":1,"massScale":3,"massScaleMargin":1.25,"foodSize":5,"bordersWidth":40,"sectorsWidth":40,"sectorsFontSize":1200,"cellsAlpha":0.9,"skinsAlpha":0.7,"virusAlpha":0.6,"virusStrokeSize":14,"menuPreset":"agario","menuMainColor":"#5bc0de","menuBtnTextColor":"#ffffff","menuPanelColor":"#ffffff","menuPanelColor2":"#cccccc","menuTextColor":"#333333","menuTextColor2":"#999999","btn1Color":"#428bca","btn1Color2":"#3071a9","btn2Color":"#5cb85c","btn2Color2":"#449d44","btn3Color":"#f0ad4e","btn3Color2":"#ec971f","btn4Color":"#d9534f","btn4Color2":"#c9302c","menuBg":"","menuOpacity":0.96,"hudMainColor":"#0085ff","hudColor":"rgba(0,0,0,0.4)","hudTextColor":"#ffffff","statsHudColor":"#0085ff","timeHudColor":"#0085ff","top5MassColor":"#0085ff","lbMeColor":"#0085ff","lbTeammateColor":"#0085ff","hudFont":"ubuntu-bold","hudFontFamily":"Ubuntu","hudFontWeight":700,"hudScale":1,"messageColor":"rgba(0,0,0,0.4)","messageTextColor":"#ffffff","messageTimeColor":"#858585","messageNickColor":"#00ff29","commandsColor":"rgba(101,31,255,0.9)","commandsTextColor":"#ffffff","commandsTimeColor":"#858585","commandsNickColor":"#00ff29","chatBoxColor":"rgba(0,0,0,0.4)","chatScale":1,"miniMapSectorColor":"#651fff","miniMapGuidesColor":"#651fff","miniMapNickColor":"#ffffff","miniMapNickStrokeColor":"#000000","miniMapMyCellColor":"#ffffff","miniMapMyCellStrokeColor":"#651fff","miniMapTeammatesColor":"#651fff","miniMapDeathLocationColor":"#651fff","miniMapFont":"ubuntu-bold","miniMapFontFamily":"Ubuntu","miniMapFontWeight":700,"miniMapNickFont":"ubuntu-bold","miniMapNickFontFamily":"Ubuntu","miniMapNickFontWeight":700,"miniMapWidth":240,"miniMapTop":24,"miniMapSectorsOpacity":0.1,"miniMapNickSize":11,"miniMapNickStrokeSize":2,"miniMapMyCellSize":6,"miniMapMyCellStrokeSize":4,"miniMapTeammatesSize":5.5,"customBackground":"","customCursor":""}

};
const themeSetup = {
    'ogario-v3': {
        name: `OGARio v3`,
        menuMainColor: '#01d9cc',
        menuBtnTextColor: `#ffffff`,
        menuPanelColor: `#00243e`,
        menuPanelColor2: `#002f52`,
        menuTextColor: `#ffffff`,
        menuTextColor2: `#8096a7`,
        btn1Color: `#018cf6`,
        btn1Color2: '#0176ce',
        btn2Color: `#00b9e8`,
        btn2Color2: `#0099c0`,
        btn3Color: `#8d5fe6`,
        btn3Color2: '#814ee3',
        btn4Color: `#f300d8`,
        btn4Color2: `#df00c6`,
        menuBg: 'https://cdn.ogario.ovh/static/img/pattern.png'
    },
    'ogario-v2': {
        name: `OGARio v2`,
        menuMainColor: `#ff7800`,
        menuBtnTextColor: '#ffffff',
        menuPanelColor: `#222222`,
        menuPanelColor2: `#333333`,
        menuTextColor: `#bbbbbb`,
        menuTextColor2: `#bbbbbb`,
        btn1Color: `#428bca`,
        btn1Color2: `#3071a9`,
        btn2Color: `#5cb85c`,
        btn2Color2: `#449d44`,
        btn3Color: `#f0ad4e`,
        btn3Color2: `#ec971f`,
        btn4Color: `#d9534f`,
        btn4Color2: `#c9302c`,
        menuBg: ''
    },
    agario: {
        name: `Agar.io`,
        menuMainColor: '#5bc0de',
        menuBtnTextColor: '#ffffff',
        menuPanelColor: `#ffffff`,
        menuPanelColor2: '#cccccc',
        menuTextColor: '#333333',
        menuTextColor2: '#999999',
        btn1Color: `#428bca`,
        btn1Color2: `#3071a9`,
        btn2Color: '#5cb85c',
        btn2Color2: `#449d44`,
        btn3Color: `#f0ad4e`,
        btn3Color2: `#ec971f`,
        btn4Color: '#d9534f',
        btn4Color2: `#c9302c`,
        menuBg: ''
    }
};
const gameSetupTheme = {
    preset: `ogario-v3`,
    darkTheme: true,
    mainColor: '#01d9cc',
    bgColor: `#000000`,
    bordersColor: `#fc0000`,
    gridColor: '#5c0000',
    sectorsColor: `#00243e`,
    namesColor: `#ffffff`,
    namesStrokeColor: `#000000`,
    massColor: `#ffffff`,
    massStrokeColor: `#000000`,
    virusColor: `#ff0000`,
    virusStrokeColor: '#ff0000',
    foodColor: '#ff004c',
    teammatesIndColor: `#ffffff`,
    cursorTrackingColor: `#ffffff`,
    splitRangeColor: `#ffffff`,
    'enemyBSTEDColor': '#8000ff',
    'enemyBSTEColor': '#BE00FF',
    'enemyBColor': '#FF0A00',
    'enemySColor': '#00C8FF',
    'enemySSTEColor': '#048245',
    'enemySSTEDColor': '#64FF00',
    ghostCellsColor: `#ffffff`,
    safeAreaColor: `#ffffff`,
    dangerAreaColor: `#bf00aa`,
    namesFont: `ubuntu-bold`,
    namesFontFamily: `Ubuntu`,
    namesFontWeight: 700,
    massFont: 'ubuntu-bold',
    massFontFamily: `Ubuntu`,
    massFontWeight: 700,
    sectorsFont: `ubuntu`,
    sectorsFontFamily: `Ubuntu`,
    sectorsFontWeight: 400,
    sectorsX: 5,
    sectorsY: 5,
    namesScale: 1,
    massScale: 3,
    virMassScale: 3,
    strokeScale: 1,
    foodSize: 5,
    bordersWidth: 60,
    sectorsWidth: 40,
    sectorsFontSize: 1200,
    cellsAlpha: 0.9,
    skinsAlpha: 0.7,
    virusAlpha: 0.6,
    textAlpha: 1,
    ghostCellsAlpha: 0.3,
    virusStrokeSize: 14,
    menuPreset: `ogario-v3`,
    menuMainColor: `#ff0000`,
    menuBtnTextColor: `#ffffff`,
    menuPanelColor: '#000000',
    menuPanelColor2: `#000626`,
    menuTextColor: '#ffffff',
    menuTextColor2: `#8096a7`,
    btn1Color: `#f60101`,
    btn1Color2: '#ce0101',
    btn2Color: '#e8002a',
    btn2Color2: `#c00073`,
    btn3Color: `#ff0000`,
    btn3Color2: '#814ee3',
    btn4Color: '#bf00aa',
    btn4Color2: '#a80096',
    menuBg: `https://cdn.ogario.ovh/static/img/pattern.png`,
    menuOpacity: 0.96,
    hudMainColor: `#d90101`,
    hudColor: 'rgba(0,0,0,0.4)',
    hudTextColor: '#ffffff',
    statsHudColor: `#ffffff`,
    timeHudColor: `#d90101`,
    top5MassColor: `#bf0000`,
    lbMeColor: '#bf00aa',
    lbTeammateColor: `#f60110`,
    hudFont: `ubuntu-bold`,
    hudFontFamily: `Ubuntu`,
    hudFontWeight: 700,
    hudScale: 1,
    messageColor: `rgba(0,0,0,0.4)`,
    messageTextColor: `#ffffff`,
    messageTimeColor: `#f60101`,
    messageNickColor: '#01d9cc',
    commandsColor: `rgba(191,0,170,0.9)`,
    commandsTextColor: `#ffffff`,
    commandsTimeColor: '#bf00aa',
    commandsNickColor: `#ffffff`,
    chatBoxColor: `rgba(0,0,0,0.4)`,
    chatScale: 1,
    miniMapSectorsColor: `#ffffff`,
    miniMapSectorColor: `#01d9cc`,
    miniMapGuidesColor: '#bf0000',
    miniMapNickColor: '#ffffff',
    miniMapNickStrokeColor: `#000000`,
    miniMapMyCellColor: `#000000`,
    miniMapMyCellStrokeColor: `#bf0000`,
    miniMapTeammatesColor: `#01d9cc`,
    miniMapDeathLocationColor: `#bf00aa`,
    miniMapGhostCellsColor: `#ffffff`,
    miniMapFont: `ubuntu-bold`,
    miniMapFontFamily: 'Ubuntu',
    miniMapFontWeight: 700,
    miniMapNickFont: `ubuntu-bold`,
    miniMapNickFontFamily: `Ubuntu`,
    miniMapNickFontWeight: 700,
    miniMapWidth: 240,
    miniMapTop: 0,//24,
    miniMapSectorsOpacity: 0.28,
    miniMapNickSize: 11,
    miniMapNickStrokeSize: 2,
    miniMapMyCellSize: 7.5,
    miniMapMyCellStrokeSize: 4,
    miniMapTeammatesSize: 5.5,
    miniMapGhostCellsAlpha: 0.15,
    customBackground: '',
    customMapTexture:'',
    customMapLogo:'',
    customCursor: 'https://cdn.ogario.ovh/static/img/cursors/cursor_02.cur'
};
const OgarioSettings = {
        menuMainColorCSS: null,
        menuPanelColorCSS: null,
        menuTextlColorCSS: null,
        menuButtonsCSS: null,
        hudCSS: null,
        chatCSS: null,
        chatScaleCSS: null,
        cursorCSS: null,
        customMapTextureCanvas:{},
        customMapTextureLogo:{},
        loadThemeSettings() {
            let storage = null;
            if (window.localStorage.getItem('ogarioThemeSettings') !== null) {
                storage = JSON.parse(window.localStorage.getItem('ogarioThemeSettings'));
            }
            for (const setup in gameSetupTheme) {
                if (gameSetupTheme.hasOwnProperty(setup)) {
                    if (storage && storage.hasOwnProperty(setup)) {
                        gameSetupTheme[setup] = storage[setup];
                    }
                    if (ogario.hasOwnProperty(setup)) {
                        ogario[setup] = gameSetupTheme[setup];
                    }
                }
            }
        },
        saveThemeSettings() {
            window.localStorage.setItem(`ogarioThemeSettings`, JSON.stringify(gameSetupTheme));
        },
        restoreThemeSettings() {
            if (window.localStorage.getItem(`ogarioThemeSettings`) !== null) {
                window.localStorage.removeItem('ogarioThemeSettings');
                window.location.reload();
            }
        },
        addCustomCSS(name, css) {
            if (!this[name]) {
                this[name] = $(`<style type='text/css'>`).appendTo('head');
            }
            this[name].html(css);
        },
        addPresetBox(id, name, options, value, callback) {
            $(id).append(`<div class="preset-box"><span class="title-box">` + textLanguage[name] + `</span><div class="select-wrapper"><select id="` + name + `" class="form-control"></select></div></div>`);
            for (const option in options) {
                if (options.hasOwnProperty(option)) {
                    $(`#${name}`).append(`${`<option value="` + option}">${options[option].name}</option>`);
            }
        }
        $(`#${name}`).val(gameSetupTheme[value]);
        const app = this;
        $(`#${name}`).on(`change`, function() {
            const optionValue = this.value;
            gameSetupTheme[value] = optionValue;
            app[callback](optionValue);
        });
    },
    addColorBox(id, name, callback) {
        $(id).append(`${`<div class="color-box"><span class="title-box">` + textLanguage[name] + `</span><div class="input-group ` + name}-picker"><input type="text" value="${gameSetupTheme[name]}" id="${name}" class="form-control" /><span class="input-group-addon"><i></i></span></div></div>`);
        if (callback) {
            const app = this;
            $(`${id} .${name}-picker`).colorpicker({
                format: `hex`
            }).on(`changeColor.colorpicker`, event => {
                gameSetupTheme[name] = event.color.toHex();
                if (ogario.hasOwnProperty(name)) {
                    ogario[name] = gameSetupTheme[name];
                }
                app[callback]();
            });
        } else {
            $(`${id} .${name}-picker`).colorpicker({
                format: `hex`
            }).on(`changeColor.colorpicker`, event => {
                gameSetupTheme[name] = event.color.toHex();
                if (ogario.hasOwnProperty(name)) {
                    ogario[name] = gameSetupTheme[name];
                }
            });
        }
    },
    addRgbaColorBox(id, name, callback) {
        $(id).append(`<div class="color-box"><span class="title-box">${textLanguage[name]}</span><div class="input-group ${name}-picker"><input type="text" value="${gameSetupTheme[name]}" id="${name}" class="form-control" /><span class="input-group-addon"><i></i></span></div></div>`);
        if (callback) {
            const app = this;
            $(`${id} .${name}-picker`).colorpicker({
                format: `rgba`
            }).on('changeColor.colorpicker', event => {
                const color = event.color.toRGB();
                gameSetupTheme[name] = `rgba(${color.r},${color.g},${color.b},${color.a})`;
                if (ogario.hasOwnProperty(name)) {
                    ogario[name] = gameSetupTheme[name];
                }
                app[callback]();
            });
        } else {
            $(`${id} .${name}-picker`).colorpicker({
                format: `rgba`
            }).on(`changeColor.colorpicker`, event => {
                const color = event.color.toRGB();
                gameSetupTheme[name] = `${`rgba(` + color.r},${color.g},${color.b},${color.a})`;
                if (ogario.hasOwnProperty(name)) {
                    ogario[name] = gameSetupTheme[name];
                }
            });
        }
    },
    addSliderBox(id, name, min, max, step, callback) {
        $(id).append(`<div class="slider-box"><div class="box-label"><span class="value-label">${textLanguage[name]}: </span><span id="${name}-value" class="value">${gameSetupTheme[name]}</span></div><input id="${name}-slider" type="range" min="${min}" max="${max}" step="${step}" value="${gameSetupTheme[name]}"></div>`);
        if (callback) {
            const app = this;
            $(`#${name}-slider`).on(`input`, function() {
                const parse = parseFloat($(this).val());
                $(`#${name}-value`).text(parse);
                gameSetupTheme[name] = parse;
                if (ogario.hasOwnProperty(name)) {
                    ogario[name] = parse;
                }
                app[callback]();
            });
        } else {
            $(`#${name}-slider`).on('input', function() {
                const parse = parseFloat($(this).val());
                $(`#${name}-value`).text(parse);
                gameSetupTheme[name] = parse;
                if (ogario.hasOwnProperty(name)) {
                    ogario[name] = parse;
                }
            });
        }
    },
    addInputBox(id, name, holder, callback) {
        $(id).append(`${`<div class="input-box"><span class="title-box">` + textLanguage[name] + `</span><input id="` + name + `" class="form-control" placeholder="` + holder}" value="${gameSetupTheme[name]}" /></div>`);
        const app = this;
        $(`#${name}`).on(`input`, function() {
            gameSetupTheme[name] = this.value;
            app[callback]();
        });
    },
    addCursorBox(id, url) {
        if (url === gameSetupTheme.customCursor) {
            $(id).append(`<div class="cursor-box"><a href="#" class="active"><img src="` + url + `"></a></div>`);
        } else {
            $(id).append(`<div class="cursor-box"><a href="#"><img src="` + url + `"></a></div>`);
        }
    },
    setFont(name, fontFamily) {
        gameSetupTheme[name] = fontFamily;
        gameSetupTheme[`${name}Family`] = this.setFontFamily(fontFamily);
        gameSetupTheme[name + `Weight`] = this.setFontWeight(fontFamily);
        if (ogario.hasOwnProperty(name + `Family`)) {
            ogario[name + `Family`] = gameSetupTheme[name + `Family`];
        }
        if (ogario.hasOwnProperty(`${name}Weight`)) {
            ogario[`${name}Weight`] = gameSetupTheme[`${name}Weight`];
        }
    },
    addFontBox(id, name, callback) {
        $(id).append(`${`<div class="font-box"><span class="title-box">` + textLanguage[name]}</span><div class="select-wrapper"><select id="${name}" class="form-control"></select></div></div>`);
        $(`#${name}`).append(`<option value="ubuntu">Ubuntu</option><option value="ubuntu-bold">Ubuntu Bold</option>`);
        $(`#${name}`).append(`<option value="roboto">Roboto</option><option value="roboto-bold">Roboto Bold</option>`);
        $(`#${name}`).append('<option value="oswald">Oswald</option><option value="oswald-bold">Oswald Bold</option>');
        $(`#${name}`).val(gameSetupTheme[name]);
        const app = this;
        if (callback) {
            $(`#${name}`).on('change', function() {
                const value = this.value;
                app.setFont(name, value);
                app[callback]();
            });
        } else {
            $(`#${name}`).on(`change`, function() {
                const value = this.value;
                app.setFont(name, value);
            });
        }
    },
    setFontFamily(name) {
        if (name.indexOf(`roboto`) != -1) {
            return `Roboto`;
        } else if (name.indexOf(`oswald`) != -1) {
            return `Oswald`;
        } else {
            return 'Ubuntu';
        }
    },
    setFontWeight(name) {
        if (name.indexOf(`bold`) != -1) {
            return 700;
        }
        return 400;
    },
    setThemeMenu() {
        const app = this;
        $(`#theme`).append(`<ul class="submenu-tabs"><li class="theme-main-tab active"><a href="#theme-main" class="active ogicon-paint-format" data-toggle="tab-tooltip" title="${textLanguage.basicTheming}"></a></li><li class="theme-menu-tab"><a href="#theme-menu" class="ogicon-menu" data-toggle="tab-tooltip" title="${textLanguage.menuTheming}"></a></li><li class="theme-hud-tab"><a href="#theme-hud" class="ogicon-display" data-toggle="tab-tooltip" title="${textLanguage.hudTheming}"></a></li><li class="theme-chat-tab"><a href="#theme-chat" class="ogicon-bubbles" data-toggle="tab-tooltip" title="${textLanguage.chatTheming}"></a></li><li class="theme-minimap-tab"><a href="#theme-minimap" class="ogicon-location2" data-toggle="tab-tooltip" title="${textLanguage.miniMapTheming}"></a></li><li class="theme-images-tab"><a href="#theme-images" class="ogicon-compass" data-toggle="tab-tooltip" title="${textLanguage.imagesTheming}"></a></li></ul><div id="theme-main" class="submenu-panel"></div><div id="theme-menu" class="submenu-panel"></div><div id="theme-hud" class="submenu-panel"></div><div id="theme-chat" class="submenu-panel"></div><div id="theme-minimap" class="submenu-panel"></div><div id="theme-images" class="submenu-panel"></div>`);
        this.addPresetBox(`#theme-main`, `themePreset`, gameTheme, `preset`, `changeThemePreset`);
        this.addColorBox('#theme-main', `bgColor`, `setBgColor`);
        this.addColorBox(`#theme-main`, `bordersColor`);
        this.addColorBox(`#theme-main`, `gridColor`);
        this.addColorBox('#theme-main', `sectorsColor`);
        this.addColorBox(`#theme-main`, 'namesColor');
        this.addColorBox('#theme-main', `namesStrokeColor`);
        this.addColorBox(`#theme-main`, `massColor`);
        this.addColorBox(`#theme-main`, `massStrokeColor`);
        this.addColorBox(`#theme-main`, `virusColor`);
        this.addColorBox(`#theme-main`, `virusStrokeColor`);
        this.addColorBox(`#theme-main`, 'foodColor');
        this.addColorBox(`#theme-main`, `teammatesIndColor`, 'setIndicatorColor');
        this.addColorBox(`#theme-main`, `cursorTrackingColor`);
        this.addColorBox(`#theme-main`, `splitRangeColor`);
                this.addColorBox('#theme-main', 'enemyBSTEDColor'); //Sonia2
                this.addColorBox('#theme-main', 'enemyBSTEColor'); //Sonia2
                this.addColorBox('#theme-main', 'enemyBColor'); //Sonia2
                this.addColorBox('#theme-main', 'enemySColor'); //Sonia2
                this.addColorBox('#theme-main', 'enemySSTEColor'); //Sonia2
                this.addColorBox('#theme-main', 'enemySSTEDColor'); //Sonia2
        this.addColorBox('#theme-main', `safeAreaColor`);
        this.addColorBox(`#theme-main`, `dangerAreaColor`);
        this.addColorBox('#theme-main', 'ghostCellsColor');
        this.addFontBox(`#theme-main`, 'namesFont');
        this.addFontBox(`#theme-main`, `massFont`);
        this.addFontBox(`#theme-main`, `sectorsFont`);
        this.addSliderBox(`#theme-main`, `sectorsFontSize`, 200, 2000, 10);
        this.addSliderBox(`#theme-main`, `namesScale`, 0.5, 2, 0.1);
        this.addSliderBox(`#theme-main`, `massScale`, 1, 5, 1);
        this.addSliderBox(`#theme-main`, `virMassScale`, 1, 5, 1);
        this.addSliderBox('#theme-main', 'strokeScale', 1, 4, 0.1);
        this.addSliderBox(`#theme-main`, 'foodSize', 1, 50, 1);
        this.addSliderBox(`#theme-main`, `virusStrokeSize`, 2, 40, 1);
        this.addSliderBox('#theme-main', `bordersWidth`, 2, 200, 2);
        this.addSliderBox(`#theme-main`, `sectorsWidth`, 2, 200, 2);
        this.addSliderBox(`#theme-main`, `cellsAlpha`, 0.01, 0.99, 0.01);
        this.addSliderBox(`#theme-main`, `skinsAlpha`, 0.01, 0.99, 0.01);
        this.addSliderBox('#theme-main', `virusAlpha`, 0, 1, 0.01);
        this.addSliderBox(`#theme-main`, 'textAlpha', 0.1, 1, 0.01);
        this.addPresetBox(`#theme-menu`, 'menuPreset', themeSetup, `menuPreset`, 'changeMenuPreset');
        this.addSliderBox(`#theme-menu`, `menuOpacity`, 0.1, 1, 0.01, `setMenuOpacity`);
        this.addColorBox(`#theme-menu`, `menuMainColor`, `setMenuMainColor`);
        this.addColorBox(`#theme-menu`, `menuBtnTextColor`, `setMenuButtons`);
        this.addColorBox(`#theme-menu`, `menuPanelColor`, `setMenuPanelColor`);
        this.addColorBox('#theme-menu', `menuPanelColor2`, `setMenuPanelColor`);
        this.addColorBox(`#theme-menu`, `menuTextColor`, `setMenuTextColor`);
        this.addColorBox(`#theme-menu`, 'menuTextColor2', `setMenuTextColor`);
        this.addColorBox(`#theme-menu`, `btn1Color`, `setMenuButtons`);
        this.addColorBox(`#theme-menu`, `btn1Color2`, `setMenuButtons`);
        this.addColorBox(`#theme-menu`, 'btn2Color', `setMenuButtons`);
        this.addColorBox(`#theme-menu`, `btn2Color2`, `setMenuButtons`);
        this.addColorBox(`#theme-menu`, `btn3Color`, 'setMenuButtons');
        this.addColorBox(`#theme-menu`, `btn3Color2`, `setMenuButtons`);
        this.addColorBox(`#theme-menu`, `btn4Color`, `setMenuButtons`);
        this.addColorBox(`#theme-menu`, `btn4Color2`, `setMenuButtons`);
        this.addInputBox(`#theme-menu`, `menuBg`, `Image URL`, `setMenuBg`);
        this.addColorBox(`#theme-hud`, `hudMainColor`, `setHudColors`);
        this.addRgbaColorBox(`#theme-hud`, 'hudColor', 'setHudColors');
        this.addColorBox(`#theme-hud`, 'hudTextColor', 'setHudColors');
        this.addColorBox('#theme-hud', `statsHudColor`, `setHudColors`);
        this.addColorBox(`#theme-hud`, `timeHudColor`, 'setHudColors');
        this.addColorBox(`#theme-hud`, `top5MassColor`, `setHudColors`);
        this.addColorBox(`#theme-hud`, `lbMeColor`, 'setHudColors');
        this.addColorBox(`#theme-hud`, `lbTeammateColor`, `setHudColors`);
        this.addFontBox(`#theme-hud`, `hudFont`, `setHudFont`);
        this.addSliderBox('#theme-hud', 'hudScale', 0.5, 2, 0.01, `setHudScale`);
        this.addRgbaColorBox('#theme-chat', `messageColor`, `setChatColors`);
        this.addColorBox(`#theme-chat`, `messageTextColor`, 'setChatColors');
        this.addColorBox(`#theme-chat`, `messageTimeColor`, `setChatColors`);
        this.addColorBox('#theme-chat', `messageNickColor`, `setChatColors`);
        this.addRgbaColorBox(`#theme-chat`, `commandsColor`, 'setChatColors');
        this.addColorBox('#theme-chat', `commandsTextColor`, 'setChatColors');
        this.addColorBox(`#theme-chat`, `commandsTimeColor`, 'setChatColors');
        this.addColorBox(`#theme-chat`, `commandsNickColor`, `setChatColors`);
        this.addRgbaColorBox(`#theme-chat`, `chatBoxColor`, `setChatColors`);
        this.addSliderBox(`#theme-chat`, `chatScale`, 1, 2, 0.01, `setChatScale`);
        this.addColorBox(`#theme-minimap`, `miniMapSectorsColor`, `setMiniMapSectorsColor`);
        this.addColorBox(`#theme-minimap`, `miniMapSectorColor`);
        this.addColorBox(`#theme-minimap`, `miniMapNickColor`);
        this.addColorBox(`#theme-minimap`, `miniMapNickStrokeColor`);
        this.addColorBox(`#theme-minimap`, `miniMapMyCellColor`);
        this.addColorBox(`#theme-minimap`, `miniMapMyCellStrokeColor`);
        this.addColorBox(`#theme-minimap`, `miniMapTeammatesColor`);
        this.addColorBox(`#theme-minimap`, `miniMapDeathLocationColor`);
        this.addColorBox(`#theme-minimap`, `miniMapGuidesColor`);
        this.addColorBox('#theme-minimap', 'miniMapGhostCellsColor');
        this.addFontBox(`#theme-minimap`, `miniMapFont`, `setMiniMapFont`);
        this.addFontBox(`#theme-minimap`, 'miniMapNickFont');
        this.addSliderBox('#theme-minimap', 'miniMapWidth', 200, 400, 2, 'setMiniMapWidth');
        this.addSliderBox(`#theme-minimap`, `miniMapSectorsOpacity`, 0, 1, 0.01, `setMiniMapSectorsOpacity`);
        this.addSliderBox(`#theme-minimap`, `miniMapNickSize`, 8, 16, 1);
        this.addSliderBox(`#theme-minimap`, `miniMapNickStrokeSize`, 0, 6, 1);
        this.addSliderBox(`#theme-minimap`, `miniMapMyCellSize`, 4, 10, 0.5);
        this.addSliderBox(`#theme-minimap`, `miniMapMyCellStrokeSize`, 0, 10, 1);
        this.addSliderBox(`#theme-minimap`, 'miniMapTeammatesSize', 4, 10, 0.5);
        this.addSliderBox('#theme-minimap', 'miniMapGhostCellsAlpha', 0.01, 0.99, 0.01);
        this.addInputBox(`#theme-images`, `customMapTexture`, `Image URL`, `setCustomMapTexture`);
        this.addInputBox(`#theme-images`, `customMapLogo`, `Image URL`, `setCustomMapLogo`);
        this.addInputBox(`#theme-images`, `customBackground`, `Image URL`, `setCustomBackground`);
        this.addInputBox(`#theme-images`, `customCursor`, `Cursor image URL`, 'setCustomCursor');
        const cursorUrl = `https://cdn.ogario.ovh/static/img/cursors/cursor_`;
        for (let length = 0; length < 35; length++) {
            if (length < 9) {
                this.addCursorBox(`#theme-images`, `${cursorUrl}0${length + 1}.cur`);
                continue;
            }
            this.addCursorBox(`#theme-images`, `${cursorUrl}${length + 1}.cur`);
        }
        $(document).on(`click`, `#theme-images .cursor-box a`, function(event) {
            event.preventDefault();
            const url = $(`img`, this).attr(`src`);
            gameSetupTheme.customCursor = url;
            app.setCustomCursor();
            $(`#customCursor`).val(url);
            $(`#theme-images .cursor-box a`).removeClass(`active`);
            $(this).addClass(`active`);
        });
        $(`#theme`).append(`<button class="btn btn-block btn-success btn-save"">` + textLanguage.saveSett + `</button>`);
        $(document).on('click', `#theme .btn-save`, function(event) {
            event.preventDefault();
            const theme = $(this);
            theme.text(textLanguage.saved);
            app.saveThemeSettings();
            setTimeout(() => {
                theme.text(textLanguage.saveSett);
            }, 500);
        });
        $(`#theme`).append(`<div class="restore-settings"><a href="#">` + textLanguage.restoreThemeSettings + `</a></div>`);
        $(document).on(`click`, `#theme .restore-settings a`, event => {
            event.preventDefault();
            app.restoreThemeSettings();
        });
        $(`.skin`).colorpicker({
            format: `hex`,
            input: `#color`
        });
    },
    changePreset(names, theme) {
        if (theme[names]) {
            gameSetupTheme[names] = names;
            var names = theme[names];
        } else {
            return;
        }
        for (const name in names) {
            if (names.hasOwnProperty(name) && gameSetupTheme.hasOwnProperty(name)) {
                gameSetupTheme[name] = names[name];
                if (ogario.hasOwnProperty(name)) {
                    ogario[name] = gameSetupTheme[name];
                }
                //console.log(name)
                if ($(`#theme .` + name + `-picker`)) {
                    $(`#theme .` + name + `-picker`).colorpicker(`setValue`, gameSetupTheme[name]);
                }
                if ($(`#${name}-slider`)) {
                    $(`#${name}-slider`).val(gameSetupTheme[name]).change();
                }
                if ($(`input[type=text]#${name}`) || $(`select#` + name)) {
                    $(`#${name}`).val(gameSetupTheme[name]);
                }
            }
        }
    },
    changeThemePreset(name) {
        this.changePreset(name, gameTheme);
        this.setTheme();
    },
    setFonts() {
        this.setFont(`namesFont`, gameSetupTheme.namesFont);
        this.setFont('massFont', gameSetupTheme.namesFont);
        this.setFont('sectorsFont', gameSetupTheme.sectorsFont);
    },
    setBgColor() {
        $(`body`).css('background-color', gameSetupTheme.bgColor);
    },
    setIndicatorColor() {
        drawRender && drawRender.preDrawIndicator();
    },
    setCustomBackground() {
        if (gameSetupTheme.customBackground) {
            $('body').css(`background-image`, `${`url(` + gameSetupTheme.customBackground})`);
        } else {
            $('body').css('background-image', `none`);
        }
    },
    setCustomMapTexture() {
        if (gameSetupTheme.customMapTexture) {
            OgarioSettings.customMapTextureCanvas = new Image()
            OgarioSettings.customMapTextureCanvas.onload = function(){this.complet = true}
            OgarioSettings.customMapTextureCanvas.src = gameSetupTheme.customMapTexture
        } else {
            OgarioSettings.customMapTextureCanvas = {}
        }
    },
    setCustomMapLogo() {
        if (gameSetupTheme.customMapLogo) {
            OgarioSettings.customMapLogoCanvas = new Image()
            OgarioSettings.customMapLogoCanvas.onload = function(){this.complet = true}
            OgarioSettings.customMapLogoCanvas.src = gameSetupTheme.customMapLogo
        } else {
            OgarioSettings.customMapLogoCanvas = {}
        }
    },
    setCustomCursor() {
        if (gameSetupTheme.customCursor) {
            var css = `*{cursor:url(` + gameSetupTheme.customCursor + `), auto !important}`;
        } else {
            var css = '*{cursor: auto}';
        }
        this.addCustomCSS(`cursorCSS`, css);
    },
    setMenu() {
        this.setMenuOpacity();
        this.setMenuMainColor();
        this.setMenuPanelColor();
        this.setMenuTextColor();
        this.setMenuButtons();
        this.setMenuBg();
    },
    changeMenuPreset(name) {
        this.changePreset(name, themeSetup);
        this.setMenu();
    },
    setMenuOpacity() {
        $('#helloContainer, #hotkeys, #exp-imp').css('opacity', gameSetupTheme.menuOpacity);
    },
    setMenuMainColor() {
        const css = `::-moz-selection{background-color:` + gameSetupTheme.menuMainColor + `!important}::selection{background-color:` + gameSetupTheme.menuMainColor + `!important}.menu-main-color,#quick-menu a:hover,.quick,.quick:focus,.menu-tabs a:hover,.menu-tabs .active,.submenu-tabs a:hover,.submenu-tabs .active,#stats center,#exp-imp h1{color:` + gameSetupTheme.menuMainColor + `}#exp-bar .progress-bar-striped,.quick:hover,.rangeslider__fill{background-color:` + gameSetupTheme.menuMainColor + `}#main-menu,.agario-side-panel,#hotkeys,#exp-imp{border-color:` + gameSetupTheme.menuMainColor + `}.ps-scrollbar-y{background-color:` + gameSetupTheme.menuMainColor + `!important}`;
        this.addCustomCSS(`menuMainColorCSS`, css);
    },
    setMenuPanelColor() {
        const css = `${`#main-menu,.agario-side-panel,#hotkeys,#exp-imp{background-color: ` + gameSetupTheme.menuPanelColor + `}label:hover,.agario-panel input,.agario-panel select,.agario-side-panel input,.agario-side-panel select,.input-group-addon,.nick .input-group-btn,.skin .input-group-btn,#stream-mode,#hide-url,.menu-tabs a:hover,.menu-tabs .active,.submenu-tabs,#exp-bar .progress,#quick-menu a:hover,.quick,.select-wrapper,#hotkeys-cfg div.row:hover,#hotkeys-cfg .command-in,#exp-imp-settings textarea,.restore-settings{background-color: ` + gameSetupTheme.menuPanelColor2 + `}.agario-panel h5,.agario-side-panel h5,#stats h2,.menu-tabs,.submenu-tabs,#skins a.default,#stats hr,#hotkeys-cfg div.row, #exp-imp h1{border-color: ` + gameSetupTheme.menuPanelColor2}}.quick:hover,#skins a,#profiles{color:${gameSetupTheme.menuPanelColor2}}input.stream-mode,input.hide-url{color:${gameSetupTheme.menuPanelColor2}!important}`;
        this.addCustomCSS('menuPanelColorCSS', css);
    },
    setMenuTextColor() {
        const css = `${`.agario-panel,.agario-side-panel,.agario-panel input,.agario-panel select,.agario-side-panel input,.agario-side-panel select,.input-group-addon,.dark .yt-username,#stream-mode,#hide-url,.menu-tabs a,.submenu-tabs a,#skins a.default:hover,#quick-menu a,#prev-profile.default:hover,#next-profile.default:hover,#statsText,#hotkeys,#hotkeys-cfg .command-in,#exp-imp{color:` + gameSetupTheme.menuTextColor + `}#skins a.default:hover{border-color:` + gameSetupTheme.menuTextColor + `}::-webkit-input-placeholder{color:` + gameSetupTheme.menuTextColor2 + `!important}::-moz-placeholder{color:` + gameSetupTheme.menuTextColor2 + `!important}#user-id-tag, #version-tag,#statsSubtext,#hotkeys-inst,#exp-imp textarea,.restore-settings a,.restore-settings a:hover{color:` + gameSetupTheme.menuTextColor2 + `}#hotkeys-cfg .command-in,#theme .color-box{border-color:` + gameSetupTheme.menuTextColor2}}`;
        this.addCustomCSS(`menuTextColorCSS`, css);
    },
    setMenuButtons() {
        const css = `${`a,a:hover{color:` + gameSetupTheme.btn1Color}}.btn,#hotkeys-cfg .custom-key-in{color:${gameSetupTheme.menuBtnTextColor}${`}.btn-primary{background-color:`}${gameSetupTheme.btn1Color}${`!important}.btn-primary:active,.btn-primary:disabled,.btn-primary:focus,.btn-primary:hover{background-color:`}${gameSetupTheme.btn1Color2}${`!important}.btn-success{background-color:`}${gameSetupTheme.btn2Color}${`!important}.btn-success:active,.btn-success:disabled,.btn-success:focus,.btn-success:hover{background-color:`}${gameSetupTheme.btn2Color2}!important}.btn-warning{background-color:${gameSetupTheme.btn3Color}${`!important}.btn-warning:active,.btn-warning:disabled,.btn-warning:focus,.btn-warning:hover{background-color:`}${gameSetupTheme.btn3Color2}${`!important}.btn-danger{background-color:`}${gameSetupTheme.btn4Color}!important}.btn-danger:active,.btn-danger:disabled,.btn-danger:focus,.btn-danger:hover{background-color:${gameSetupTheme.btn4Color2}${`!important}#hotkeys-cfg .custom-key-in{background-color:`}${gameSetupTheme.btn4Color2};border-color:${gameSetupTheme.btn4Color2}}`;
        this.addCustomCSS(`menuButtonsCSS`, css);
    },
    setMenuBg() {
        $(`#menuBg`).val(gameSetupTheme.menuBg);
        if (gameSetupTheme.menuBg) {
            $('.menu-panel, .agario-side-panel, #hotkeys, #exp-imp').css(`background-image`, `${`url(` + gameSetupTheme.menuBg})`);
        } else {
            $('.menu-panel, .agario-side-panel, #hotkeys, #exp-imp').css(`background-image`, `none`);
        }
    },
    setHud() {
        this.setHudColors();
        this.setHudFont();
        this.setHudScale();
    },
    setHudColors() {
        const css = `${`.hud-main-color,#top5-hud a,#target-panel-hud a:hover,#target-panel-hud a.active,#message-menu a{color:` + gameSetupTheme.hudMainColor + `}.hud,.hud-b,#chat-emoticons{background-color:` + gameSetupTheme.hudColor + `}.hud,.hud-b,#top5-hud a:hover,#target-panel-hud a{color:` + gameSetupTheme.hudTextColor}}.stats-hud-color{color:${gameSetupTheme.statsHudColor}${`}.time-hud-color{color:`}${gameSetupTheme.timeHudColor}${`}.top5-mass-color{color:`}${gameSetupTheme.top5MassColor}${`}#leaderboard-positions .me{color:`}${gameSetupTheme.lbMeColor}${`}#leaderboard-positions .teammate{color:`}${gameSetupTheme.lbTeammateColor}}`;
        this.addCustomCSS('hudCSS', css);
    },
    setHudFont() {
        this.setFont('hudFont', gameSetupTheme.hudFont);
        $('#overlays-hud').css({
            'font-family': gameSetupTheme.hudFontFamily,
            'font-weight': gameSetupTheme.hudFontWeight
        });
    },
    setHudScale() {
        const overlays = Math.round(20 * gameSetupTheme.hudScale);
        const leadeboard = Math.round(200 * gameSetupTheme.hudScale);
        const top5 = Math.floor(55 * gameSetupTheme.hudScale);
        const top5_pos = Math.floor(1 * gameSetupTheme.hudScale);
        const pause = Math.floor(85 * gameSetupTheme.hudScale);
        const target = Math.floor(20 * gameSetupTheme.hudScale);
        $('#overlays-hud').css(`font-size`, `${overlays}px`);
        $('#leaderboard-hud, #botClient').width(leadeboard);
        $(`#top5-hud`).width(leadeboard + 30).css(`top`, `${top5}px`);
        $(`#top5-pos`).css('padding-left', `${top5_pos}px`);
        $(`#pause-hud`).css(`top`, `${pause}px`);
        $(`#target-hud`).css('padding-top', `${target}px`);
    },
    setChat() {
        this.setChatColors();
        this.setChatScale();
    },
    setChatColors() {
        const css = `${`#message,#messages li,.toast-success{background-color:` + gameSetupTheme.messageColor + `}#message,.message-text,.toast-success .message-text{color:` + gameSetupTheme.messageTextColor + `}.message-nick,.mute-user,.mute-user:hover,.toast-success .message-nick,.toast .mute-user,.toast .mute-user:hover{color:` + gameSetupTheme.messageNickColor + `}.message-time{color:` + gameSetupTheme.messageTimeColor}}.toast-warning{background-color:${gameSetupTheme.commandsColor}${`}.command-text,.toast-warning .command-text{color:`}${gameSetupTheme.commandsTextColor}${`}.command-nick,.toast-warning .command-nick,.toast-warning .mute-user,.toast-warning .mute-user:hover{color:`}${gameSetupTheme.commandsNickColor}${`}.command-time{color:`}${gameSetupTheme.commandsTimeColor}${`}#chat-box{background-color:`}${gameSetupTheme.chatBoxColor}}`;
        this.addCustomCSS(`chatCSS`, css);
    },
    setChatScale() {
        const message = Math.round(14 * gameSetupTheme.chatScale);
        const toastContainer = Math.round(280 * gameSetupTheme.chatScale);
        const messageBox = Math.round(350 * gameSetupTheme.chatScale);
        const chatBox = Math.round(300 * gameSetupTheme.chatScale);
        const userList = Math.floor(14 * gameSetupTheme.chatScale);
        $(`#message-box, #messages, #toast-container, #chat-box`).css(`font-size`, `${message}px`);
        $('#messages, #toast-container, #chat-box').width(toastContainer);
        $(`#message-box`).width(messageBox);
        $(`#chat-box`).height(chatBox);
        $('.user-list').css(`padding-left`, `${userList}px`);
        const css = `#toast-container{width:` + toastContainer + `px;font-size:` + message + `px}`;
        this.addCustomCSS(`chatScaleCSS`, css);
    },
    setMiniMap() {
        this.setMiniMapFont();
        this.setMiniMapWidth();
        this.setMiniMapSectorsOpacity();
    },
    setMiniMapFont() {
        this.setFont(`miniMapFont`, gameSetupTheme.miniMapFont);
        application && application.resetMiniMapSectors();
    },
    setMiniMapWidth() {
        const resizeWidth = gameSetupTheme.miniMapWidth / 200;
        gameSetupTheme.miniMapTop = 0//Math.round(20 * resizeWidth);
        $('#minimap-hud').css({
            width: gameSetupTheme.miniMapWidth,
            height: gameSetupTheme.miniMapWidth + gameSetupTheme.miniMapTop
        });
        application && application.resetMiniMapSectors();
    },
    setMiniMapSectorsColor() {
        application && application.resetMiniMapSectors();
    },
    setMiniMapSectorsOpacity() {
        $('#minimap-sectors').css(`opacity`, gameSetupTheme.miniMapSectorsOpacity);
    },
    setTheme() {
        this.setFonts();
        this.setBgColor();
        this.setCustomBackground();
        this.setCustomMapTexture();
        this.setCustomMapLogo();
        this.setCustomCursor();
        this.setMenu();
        this.setHud();
        this.setChat();
        this.setMiniMap();
    },
    init() {
        this.loadThemeSettings();
    }
};
let PlayerProfiles = [];
const mainProfile = {
    nick: `I <3 OGARio`,
    clanTag: 'Ⓜ',
    skinURL: '',
    color: gameSetupTheme.mainColor
};
var gameOptionSettings = window.gameOptionSettings = {
    quickResp: false,
    autoResp: false,
    autoZoom: false,
    autoHideNames: true,
    autoHideMass: true,
    autoHideFood: true,
    autoHideFoodOnZoom: true,
    noNames: false,
    optimizedNames: true,
    hideMyName: false,
    hideTeammatesNames: false,
    showMass: true,
    optimizedMass: true,
    shortMass: true,
    cellContours: false,
    virMassShots: true,
    hideMyMass: false,
    hideEnemiesMass: false,
    vanillaSkins: true,
    customSkins: true,
    FBSkins: true,
    myTransparentSkin: false,
    myCustomColor: false,
    transparentCells: false,
    transparentViruses: true,
    transparentSkins: false,
    showGrid: false,
    showBgSectors: false,
    showMapBorders: true,
    rainbowBorders: true,
        newRainbowBorders: false,
    showGhostCells: false,
    showMiniMap: true,
    showMiniMapGrid: false,
    showMiniMapGuides: true,
    showMiniMapGhostCells: true,
    oneColoredTeammates: false,
    rainbowFood: false,
    oppColors: false,
    oppRings: true,
    bubbleInd: false,
    virColors: false,
    splitRange: true,
'qdsplitRange': true, //Sonia2
'sdsplitRange': true, //Sonia2
    virusesRange: true,
    textStroke: false,
    namesStroke: true,
    massStroke: true,
    cursorTracking: false,
    bubbleCursorTracker: false,
    FBTracking: true,
    ingameSpectator: false,
    fullSpectator: false,
    oneColoredSpectator: false,
    teammatesInd: false,
    mouseSplit: false,
    waves: true,
    mouseFeed: false,
    mouseInvert: false,
    disableChat: false,
    coloredNicks: true,
    hideChat: false,
    chatSounds: true,
    chatEmoticons: true,
    showChatBox: true,
    showChatImages: true,
    showChatVideos: true,
    showTop5: true,
    showTop5Sectors:false,
    showTargeting: false,
    showLbData: true,
    showTime: true,
    normalLb: false,
    centeredLb: false,
    fpsAtTop: true,
    targetSearch: false,
    search: false,
    showStats: true,
    showStatsMass: true,
    showStatsSTE: false,
    showStatsN16: true,
    showStatsFPS: true,
    showStatsPPS: true,
    blockPopups: false,
    streamMode: false,
    hideSkinUrl: false,
    showQuickMenu: true,
    showQuickBots: true,
    showSkinsPanel: true,
    animation: 140,
    macroFeeding: 80,
    stickyCell:false,
        reverseTrick:false,
        clickTargeting: true,
    deltaSocket: true,
        autobrewing: true,
        onlineStatus: true,
        autosearchFB: false,
    zoomSpeedValue: 0.9,
    messageSound: `https://cdn.ogario.ovh/static/sounds/notification_01.mp3`,
    commandSound: `https://cdn.ogario.ovh/static/sounds/notification_02.mp3`,
    virusSoundURL:'https://freesound.org/data/previews/163/163457_2263027-lq.mp3',
    FacebookIDs: ``,
        skinsForSearch: ``,
        nicksForSearch: ``,
        extras: ``,
        discord: '',
    virusSounds:false,
    leaderboardLength:10,
    renderQuality: 1,
    debug:false,
    invis: false,
    mapLocalFix3:false,
    mapGlobalFix4:false,
    cameraDelay:0,
    showExtraMiniMapGuides:true,
};

function minimapCell(id, name, skinID, skinUrl, extras, fake) {
    this.id = id;
    this.nick = name;
    this.skinID = skinID;
    this.skinURL = skinUrl;
    this.extras = extras;
    this.fake = fake;
    this.quadrant = -1
    this.x = 0;
    this.y = 0;
    this.lastX = 0;
    this.lastY = 0;
    this.mass = 0;
    this.clanTag = '';
    this.color = null;
    this.customColor = gameSetupTheme.miniMapTeammatesColor;
    this.alive = false;
    this.updateTime = null;
    this.pi2 = 2 * Math.PI;
    this.setColor = function(color, customColor) {
        this.color = color;
        if (customColor.length == 7) {
            this.customColor = customColor;
        }
    };
    this.drawPosition = function(ctx, offset, size, privateMap, targetID) {
        if (!this.alive || privateMap && targetID && this.id != targetID) {
            return;
        }
        this.lastX = (29 * this.lastX + this.x) / 30;
        this.lastY = (29 * this.lastY + this.y) / 30;
        const posX = (this.lastX + offset) * size;
        const posY = (this.lastY + offset) * size;
        if (this.nick.length > 0) {
            ctx.font = `${gameSetupTheme.miniMapNickFontWeight} ${gameSetupTheme.miniMapNickSize}px ${gameSetupTheme.miniMapNickFontFamily}`;
            ctx.textAlign = `center`;
            ctx.textBaseline = "bottom";
            if (gameSetupTheme.miniMapNickStrokeSize > 0) {
                ctx.lineWidth = gameSetupTheme.miniMapNickStrokeSize;
                ctx.strokeStyle = gameSetupTheme.miniMapNickStrokeColor;
                ctx.strokeText(this.nick, posX, posY - (gameSetupTheme.miniMapTeammatesSize * 2 + 2.5));
            }
            ctx.fillStyle = gameSetupTheme.miniMapNickColor;
           
            ctx.fillText(this.nick, posX, posY - (gameSetupTheme.miniMapTeammatesSize * 2 + 2));
        }
        if(this.quadrant<0){
            ctx.beginPath();
            ctx.arc(posX, posY, gameSetupTheme.miniMapTeammatesSize, 0, this.pi2, false);
            ctx.closePath();
        }else{
            const posY3 = posY-gameSetupTheme.miniMapTeammatesSize/3
            const height = gameSetupTheme.miniMapTeammatesSize * Math.cos(Math.PI / 6);
            ctx.beginPath();
            ctx.moveTo(posX-gameSetupTheme.miniMapTeammatesSize, posY3+gameSetupTheme.miniMapTeammatesSize);
            ctx.lineTo(posX+gameSetupTheme.miniMapTeammatesSize, posY3+gameSetupTheme.miniMapTeammatesSize);
            ctx.lineTo(posX, posY3 - height);
            ctx.closePath();
        }
        if (gameOptionSettings.oneColoredTeammates) {
            ctx.fillStyle = gameSetupTheme.miniMapTeammatesColor;
        } else {
            ctx.fillStyle = this.color;
        }
        ctx.fill();
        
    };
}


var mirror = {
    token:'',
    socket:null,
    send:function(nick,quadrant) {
        if(gameOptionSettings.mapGlobalFix4 == false &&  this.socket && this.socket.readyState == 1){this.socket.close();this.socket=null;return;}
        if(Connection.play && application.playerID &&  this.socket && this.socket.readyState == 1) {
            nick = window.unescape(window.encodeURIComponent(nick));
            if (quadrant != null) {
                this.socket.send(JSON.stringify({
                    "toH": this.token,
                    "msg": {
                        "t": nick,
                        "s": quadrant
                    }
                }));
            }
        }
    },
    connect:function(token){
       this.token = token
       if(gameOptionSettings.mapGlobalFix4 == false) return;
       if(this.socket) {this.socket.url = 'wss://cloud.achex.ca/JIMBOY3200'+this.token ;return this.socket.refresh()}
       var onMessage = function(e){
         var data = JSON.parse(e.data)
         
         if(!data.msg) return;
         var quadrant = data.msg.s
         var name = window.decodeURIComponent(escape(data.msg.t));
         var id = application.checkPlayerNick(name);
         if (null != id) {
            application.teamPlayers[id].quadrant = quadrant;
            //console.log(name,quadrant)
         }
        
     }
     var onOpen = function(){
       this.socket.send(JSON.stringify({"auth":"JIM2"+application.playerID,"password":"legendmod2"}))
       this.socket.send(JSON.stringify({"joinHub":this.token}))
     }.bind(this)
 
     var onClose = function(){
     }
     this.socket = new ReconnectingWebSocket('wss://cloud.achex.ca/JIMBOY3200'+this.token, null, {
       reconnectInterval: 3000,
       maxReconnectAttempts:3
     });
     //socket.binaryType = 'arraybuffer';
     this.socket.onmessage = onMessage
     this.socket.onopen = onOpen
     this.socket.onclose = onClose     
    }
}


const application = window.application = {
    name: `Dead▲Mod`,
    version: `v4 (4.0.0 b38)`,
    privateMode: false,
    protocolMode: true,
    publicIP: 'wss://wss.ogario.eu:3443',//`wss://srv.ogario.eu`,
    privateIP: null,
    updateInterval: 1000,
    updateTick: 0,
    updateMaxTick: 2,
    currentSector: '',
    miniMap: null,
    miniMapCtx: null,
    miniMapSectors: null,
    pi2: 2 * Math.PI,
    socket: null,
    cells: {},
    teamPlayers: [],
    parties: [],
    chatHistory: [],
    chatUsers: {},
    chatMutedUsers: {},
    chatMutedUserIDs: [],
    customSkinsCache: {},
    customSkinsMap: {},
    fontCache: {},
    cacheQueue: [],
    deathLocations: [],
    playerID: null,
    playerMass: 0,
    selectedProfile: 0,
    lastDeath: 0,
    skipServerData: false,
    gameMode: `:ffa`,
    region: '',
    partyToken: '',
    ws: '',
    serverIP: '',
    serverArena: '',
    serverToken: '',
    lastSentNick: '',
    lastSentClanTag: null,
    lastSentSkinURL: '',
    lastSentCustomColor: '',
    lastSentPartyToken: '',
    lastSentServerToken: '',
    lastMessageSentTime: Date.now(),
    rFps: 0,
    renderedFrames: 0,
    fpsLastRequest: null,
    statsHUD: null,
    leaderboardPositionsHUD: null,
    leaderboardDataHUD: null,
    activeParties: null,
    top5pos: null,
    top5totalMass: null,
    top5totalPlayers: null,
    top5limit: 5,
    timeHUD: null,
    questHUD: null,
    retryResp: 0,
    token: 'ＤＥＬＴＡ Ｖ４',
    canvasScale: 1,
    selectBiggestCell: true,
    noColors: false,
    skipStats: false,
    showQuest: false,
    showSplitInd: false,
    pause: false,
    spectatorFollow: false,
    targetID: 0,
    targetStatus: 0,
    targetNick: '',
    targetSkinURL: '',
    targeting: false,
    privateMiniMap: false,
    messageSound: null,
    commandSound: null,
    virusSound: null,
    FacebookIDs: [],
        skinsForSearch: [],
        nicksForSearch: [],
        extras: [],
        extrasCache: {},
        founded: false,
        discord: '',
        lastSended: {
          ws:'',
          skin:'',
          nick:'',
          color:'',
          tag:'',
          region:'',
          gameMode:'',
          time: null
        },
    feedInterval: null,
    blacklist: ['Senpa','Admin','xAzz','obobemnai'],
    brokenSkins: {'https://raw.githubusercontent.com/Yahnych/vanilla_skins/master/agar/Guitarist.png':1,
                 'https://raw.githubusercontent.com/Yahnych/vanilla_skins/master/agar/Dancer.png':1},
    boostsInfo:{
                "mass_boost_3x_24h":{price:990,name:"Mass 3X/24H"},
                "mass_boost_3x_1h":{price:490,name:"Mass 3X/1H"},
                "mass_boost_2x_24h":{price:790,name:"Mass 2X/24H"},
                "mass_boost_2x_1h":{price:290,name:"Mass 2X/1H"},
                "xp_boost_3x_24h":{price:990,name:"XP 3X/24H"},
                "xp_boost_3x_1h":{price:490,name:"XP 3X/1H"},
                "xp_boost_2x_24h":{price:790,name:"XP 2X/24H"},
                "xp_boost_2x_1h":{price:290,name:"XP 2X/1H"}
    },
    replayData: [],
    replays: {r:[]},
    replayMode: false,
    //socketDead: false,
    getPlayerX() {
        return ogario.playerX + ogario.mapOffsetX;
    },
    getPlayerY() {
        return ogario.playerY + ogario.mapOffsetY;
    },
    filterNick(nick) {
      if(nick.includes('Aᴜʀᴏ')) return 'піздаліз'
      return nick
    },
    feed() {
        window.core && window.core.eject && window.core.eject();
    },
    macroFeed(on) {
        if (on) {
            if (this.feedInterval) {
                return;
            }
            const app = this;
            this.feed();
            this.feedInterval = setInterval(() => {
                app.feed();
            }, gameOptionSettings.macroFeeding);
        } else {
            if (this.feedInterval) {
                clearInterval(this.feedInterval);
                this.feedInterval = null;
            }
        }
    },
    sct(on) {
        if (on) {
            Connection.sct=true;
        } else {
            Connection.sct=false;
        }
    },
    afk(on) {
        if (on) {
            Connection.afk=true;
        } else {
            Connection.afk=false;
        }
    },
    fixSpect() {
         spects.forEach(e=>{e.fixMirroring()});
    },
    onoffSpect() {
      if(spects.length>0) {
         spects.forEach(e=>{e.closeConnection()});
         spects=[];
      } else {
        addSpectator()
      }
    },
    dance(on) {
        if (on) {
            Connection.dance=true;
        } else {
            Connection.dance=false;
        }
    },
    split() {
        window.core && window.core.split && window.core.split();
    },
    doubleSplit() {
        const app = this;
        app.split();
        setTimeout(() => {
            app.split();
        }, 40);
    },
    popSplit() {
        const app = this;
        app.split();
        setTimeout(() => {
            app.split();
        }, 200);
    },
    tripleSplit() {
        const app = this;
        app.split();
        setTimeout(() => {
            app.split();
        }, 40);
        setTimeout(() => {
            app.split();
        }, 80);
    },
    split16() {
        const app = this;
        app.split();
        setTimeout(() => {
            app.split();
        }, 40);
        setTimeout(() => {
            app.split();
        }, 80);
        setTimeout(() => {
            app.split();
        }, 120);
    },
    toggleSkins() {
        if (ogario.vanillaSkins && ogario.customSkins) {
            ogario.vanillaSkins = false;
        } else if (!ogario.vannillaSkins && ogario.customSkins) {
            ogario.vanillaSkins = true;
            ogario.customSkins = false;
        } else {
            ogario.vanillaSkins = true;
            ogario.customSkins = true;
        }
    },
    switchInvis() {
      gameOptionSettings.invis = !gameOptionSettings.invis;
      this.saveSettings(gameOptionSettings, 'ogarioSettings');
        if (gameOptionSettings.invis && Connection.play) {
            this.sendPlayerDeath();
        } else if (!gameOptionSettings.invis && Connection.play) {
            this.sendPlayerSpawn();
        }
    },
    saveReplay(){
      /*function extend(obj1, obj2){
    function copyObject(obj){
        var result = {};
        for (key in obj) {
            if(typeof(obj[key]) != 'object'){
                result[key] = obj[key];
            }
            else {
                result[key] = copyObject(obj[key])
            }
        }
        return result;
    }
    for (key in obj2){
        if(typeof(obj2[key]) != 'object'){
            obj1[key] = obj2[key];
        }
        else {
            obj1[key] = copyObject(obj2[key]);
        }
    }
    return obj1;
}*/
      /*  _.extend = function(obj) {
    if (!_.isObject(obj)) return obj;
    var source, prop;
    for (var i = 1, length = arguments.length; i < length; i++) {
      source = arguments[i];
      for (prop in source) {
        if (hasOwnProperty.call(source, prop)) {
            obj[prop] = source[prop];
        }
      }
    }
    return obj;
  };*/
      /*let obj3 = JSON.parse(JSON.stringify(obj1));*/
      /*var original = {a:1, b:{c:3}}
var cloned = {};
jQuery.extend(true, cloned, original);
cloned.b.c = 10;
console.log(original);*/
      /*const food = { beef: '🥩', bacon: '🥓' }

// "Spread"
{ ...food }

// "Object.assign"
Object.assign({}, food)

// "JSON"
JSON.parse(JSON.stringify(food))

// RESULT:
// { beef: '🥩', bacon: '🥓' }*/
      var replay = [];
      for(let l=0;l<application.replayData.length;l++){
        var obj = {};
        var o = application.replayData[l];
        if(l!=0){
          obj.data = o.data;
          obj.time = o.time;
        } else {
          obj.data = o.data;
          obj.time = o.time;
          obj.mode = o.mode;
          obj.region = o.region;
          obj.cells = o.cells;
          obj.indexedCells = Object.assign({},o.indexedCells);
          obj.viruses = o.viruses;

        }
       replay.push(obj);
      }
      application.replays.r.push(replay);
      toastr.info('Replay saved');
      application.displayReplaysList();
    },
    importReplay(){
      application.replays.r.push(JSON.parse(document.querySelector('#importReplayData').textContent));
      application.displayReplaysList();
    },
    displayReplaysList(){
      const r = application.replays.r;
      const list = document.querySelector('#replaysInfo');
      list.innerHTML = ``;
      for(let i = 0; i<r.length; i++){
        var div = document.createElement('div');
               div.setAttribute("data-itr", i);
               var name = document.createElement('span');
               var copy = document.createElement('span');
               var del = document.createElement('span');

               name.innerText = r[i][0].region+r[i][0].mode+new Date(r[i][0].time).toTimeString().replace(/^(\d{2}:\d{2}).*/, '$1');
               copy.innerText = '📤';
               del.innerText = '🧺';

               name.style.width= '80%';
               copy.style.width= '10%';
               del.style.width= '10%';
               name.style.float= 'left';
               copy.style.float= 'right';
               del.style.float= 'right';

               name.onclick = function(e) {
                 var index = e.target.parentNode.getAttribute("data-itr");
                 Connection.startReplay(application.replays.r[index]);
               }
               copy.onclick = function(e) {
                 var index = e.target.parentNode.getAttribute("data-itr");
                 var text = JSON.stringify(application.replays.r[index]);
                 navigator.clipboard.writeText(text).then(function() {
                 console.log('Async: Copying to clipboard was successful!');
                 }, function(err) {
                 console.error('Async: Could not copy text: ', err);
                 });
                 var index = e.target.parentNode.getAttribute("data-itr");
                 Connection.startReplay(application.replays.r[index]);
               }
               del.onclick = function(e) {
                 var index = e.target.parentNode.getAttribute("data-itr");
                 application.replays.r.splice(index,1);
                 application.displayReplaysList();
               }
               div.appendChild(name);
               div.appendChild(copy);
               div.appendChild(del);

               div.style.width = '170px'

               list.appendChild(div);
               list.appendChild(document.createElement('br'))      }
    },
    toggleCells() {
        this.selectBiggestCell = !this.selectBiggestCell;
        ogario.selectBiggestCell = this.selectBiggestCell;
    },
    setShowTop5() {
        gameOptionSettings.showTop5 = !gameOptionSettings.showTop5;
        this.setTop5();
    },
    setTop5() {
        if (gameOptionSettings.showTop5) {
            $(`#top5-hud`).show();
        } else {
            $('#top5-hud').hide();
        }
    },
    setShowTargeting() {
        gameOptionSettings.showTargeting = !gameOptionSettings.showTargeting;
        this.setTargetingHUD();
    },
    setTargetingHUD() {
        if (gameOptionSettings.showTargeting) {
            $('#target-hud, #target-panel-hud').show();
        } else {
            $('#target-hud, #target-panel-hud').hide();
        }
    },
    setShowTime() {
        gameOptionSettings.showTime = !gameOptionSettings.showTime;
        if (gameOptionSettings.showTime) {
            $(`#time-hud`).show();
            this.displayTime();
        } else {
            $(`#time-hud`).hide();
        }
    },
    setShowSplitRange() {
        gameOptionSettings.splitRange = !gameOptionSettings.splitRange;
        ogario.splitRange = gameOptionSettings.splitRange;
    },
    setShowSplitInd() {
        this.showSplitInd = !this.showSplitInd;
        gameOptionSettings.splitRange = this.showSplitInd;
        gameOptionSettings.oppRings = this.showSplitInd;
        ogario.splitRange = gameOptionSettings.splitRange;
        ogario.oppRings = gameOptionSettings.oppRings;
    },
    setShowTeammatesInd() {
        gameOptionSettings.teammatesInd = !gameOptionSettings.teammatesInd;
    },
    setShowOppColors() {
        gameOptionSettings.oppColors = !gameOptionSettings.oppColors;
        ogario.oppColors = gameOptionSettings.oppColors;
    },
    setShowSkins() {
        this.noSkins = !this.noSkins;
        window.core && window.core.setSkins && window.core.setSkins(!this.noSkins);
        ogario.showCustomSkins = !this.noSkins;
        this.displayChatInfo(!this.noSkins, `showSkinsMsg`);
    },
    setTransparentSkins() {
        gameOptionSettings.transparentSkins = !gameOptionSettings.transparentSkins;
        ogario.transparentSkins = gameOptionSettings.transparentSkins;
    },
    setShowStats() {
        $(`#stats-hud`).toggle();
    },
    setShowFood() {
        ogario.showFood = !ogario.showFood;
    },
    setShowHUD() {
        $(`#overlays-hud`).toggle();
    },
    setShowGrid() {
        gameOptionSettings.showGrid = !gameOptionSettings.showGrid;
    },
    setShowMiniMapGuides() {
        gameOptionSettings.showMiniMapGuides = !gameOptionSettings.showMiniMapGuides;
    },
    setShowLb() {
        if (this.gameMode === `:teams`) {
            return;
        }
        $(`#leaderboard-hud`).toggle();
    },
    setShowBgSectors() {
        gameOptionSettings.showBgSectors = !gameOptionSettings.showBgSectors;
    },
    setHideSmallBots() {
        ogario.hideSmallBots = !ogario.hideSmallBots;
        this.displayChatInfo(!ogario.hideSmallBots, `hideSmallBotsMsg`);
    },
    setShowNames() {
        gameOptionSettings.noNames = !gameOptionSettings.noNames;
    },
    setHideTeammatesNames() {
        gameOptionSettings.hideTeammatesNames = !gameOptionSettings.hideTeammatesNames;
    },
    setShowMass() {
        gameOptionSettings.showMass = !gameOptionSettings.showMass;
    },
    setShowMiniMap() {
        gameOptionSettings.showMiniMap = !gameOptionSettings.showMiniMap;
        this.setMiniMap();
    },
    setMiniMap() {
        if (gameOptionSettings.showMiniMap) {
            $(`#minimap-hud`).show();
        } else {
            $(`#minimap-hud`).hide();
        }
    },
    switchOnlineStatus() {
        if (gameOptionSettings.onlineStatus==true) {
           window.changeOnline(1);
        } else {
           window.changeOnline(0);
        }
    },
    setShowQuest() {
        if (this.gameMode !== `:ffa`) {
            return;
        }
        this.showQuest = !this.showQuest;
        this.setQuest();
    },
    setQuest() {
        if (this.showQuest && this.gameMode === `:ffa`) {
            $(`#quest-hud`).show();
        } else {
            $(`#quest-hud`).hide();
        }
    },
    toggleAutoZoom() {
        ogario.autoZoom = !ogario.autoZoom;
        this.displayChatInfo(ogario.autoZoom, `autoZoomMsg`);
    },
    resetZoom(on) {
        if (on) {
            ogario.zoomResetValue = 1;
            ogario.zoomValue = 1;
        } else {
            ogario.zoomResetValue = 0;
        }
    },
    setZoom(value) {
        ogario.zoomValue = value;
    },
    toggleDeath() {
        this.lastDeath--;
        if (this.lastDeath < 0) {
            this.lastDeath = this.deathLocations.length - 1;
        }
    },
    tryResp() {
        if (ogario.play || this.retryResp == 20) {
            this.retryResp = 0;
            return;
        }
        this.retryResp++;
        const app = this;
        setTimeout(() => {
            if ($(`.btn-play-guest`).is(`:visible`)) {
                $(`.btn-play-guest`).click();
            } else {
                $('.btn-play').click();
            }
            if (!ogario.play) {
                app.tryResp();
            }
        }, 500);
    },
    quickResp() {
        if (!gameOptionSettings.quickResp) {
            return;
        }
        this.hideMenu();
        this.gameServerConnect(this.ws);
        ogario.play = false;
        this.tryResp();
    },
    autoResp() {
        if (!gameOptionSettings.autoResp) {
            return;
        }
        this.setAutoResp();
        $('#overlays').stop().hide();
        if ($('.btn-play-guest').is(`:visible`)) {
            $(`.btn-play-guest`).click();
            return;
        }
        $('.btn-play').click();
    },
    setAutoResp() {
        if (gameOptionSettings.autoResp) {
            if (!$(`#skipStats`).prop(`checked`)) {
                $(`#skipStats`).click();
                this.skipStats = true;
            }
        }
    },
    toggleAutoResp() {
        gameOptionSettings.autoResp = !gameOptionSettings.autoResp;
        this.setAutoResp();
        this.displayChatInfo(gameOptionSettings.autoResp, `autoRespMsg`);
    },
    copyLb() {
        const input = $(`<input>`);
        $(`body`).append(input);
        input.val($('#leaderboard-positions').text()).select();
        try {
            document.execCommand(`copy`);
        } catch (error) {
            console.log("can't copy..")
        }
        input.remove();
    },
    changeSpectatorMode() {
        this.spectatorFollow = !this.spectatorFollow;
        ogario.spectatorFollow = this.spectatorFollow;
        if (this.spectatorFollow && spects.length>0 && spects[0].staticX==null && spects[0].isSpectateEnabled==true /*&& spects[0].isFreeSpectateEnabled==false*/) {
            spects[0].sendFreeSpectate();
        } else {
            void(0);
        }
    },
    setPause() {
        this.pause = !this.pause;
        ogario.pause = this.pause;
        if (this.pause) {
            ogario.resetTargetPosition();
            $(`#pause-hud`).show();
        } else {
            $(`#pause-hud`).hide();
        }
    },
    setCenteredLb() {
        if (gameOptionSettings.centeredLb) {
            $(`#leaderboard-hud`).addClass('hud-text-center');
        } else {
            $(`#leaderboard-hud`).removeClass('hud-text-center');
        }
    },
    setNormalLb() {
        if (gameOptionSettings.normalLb) {
            $(`#leaderboard-adress`).hide();
            $('#leaderboard-header').show();
        } else {
            $('#leaderboard-header').hide();
            $('#leaderboard-adress').show();
        }
    },
    setFpsAtTop() {
        if (gameOptionSettings.fpsAtTop) {
            $('#stats-hud').removeClass('hud-bottom').addClass(`hud-top`);
        } else {
            $(`#stats-hud`).removeClass(`hud-top`).addClass(`hud-bottom`);
        }
    },
    setBlockPopups() {
        if (this.protocolMode) {
            $(`#block-warn`).hide();
            return;
        }
        if (gameOptionSettings.blockPopups) {
            this.blockPopups();
        } else {
            this.unblockPopups();
        }
    },
    blockPopups() {
        $(`#openfl-content, #openfl-overlay`).hide();
        $(`#openfl-content, #openfl-overlay`).addClass(`block-popups`);
        $(`#freeCoins, #gifting, #openShopBtn, #dailyQuests`).prop(`disabled`, true);
        $(`#block-warn`).show();
    },
    unblockPopups() {
        $(`#openfl-overlay.disabler`).click();
        $(`#openfl-content, #openfl-overlay`).hide();
        $(`#openfl-content, #openfl-overlay`).removeClass(`block-popups`);
        $(`#freeCoins, #gifting, #openShopBtn, #dailyQuests`).prop(`disabled`, false);
        $(`#block-warn`).hide();
    },
    tempUnblockPopups() {
        if (!gameOptionSettings.blockPopups) {
            return;
        }
        this.unblockPopups();
    },
    displayLeaderboard(position, data = '') {
        if (!this.leaderboardPositionsHUD) {
            return;
        }
        this.leaderboardPositionsHUD.innerHTML = position;
        this.leaderboardDataHUD.innerHTML = data;
    },
    displayStats() {
        if (!gameOptionSettings.showStats) {
            $(`#stats-hud`).hide();
            return;
        }
        let text = '';
        if (ogario.play) {
            if (gameOptionSettings.showStatsMass && ogario.playerMass) {
                //text += `${textLanguage.mass}: ${ogario.playerMass} | `;
                text += textLanguage.mass+": "+ogario.playerMass+" "+~~(ogario.playerMass/4)+" "+~~(ogario.playerMass/16)+" | ";
            }
            if (ogario.playerScore) {
                text += `${textLanguage.score}: ${ogario.playerScore}`;
            }
            if (gameOptionSettings.showStatsSTE && ogario.STE) {
                text += ` | STE: ` + ogario.STE;
            }
            if (gameOptionSettings.showStatsN16 && ogario.playerSplitCells) {
                text += ` | ` + (ogario.playerSplitCells===16?'<span style="background:green">'+ogario.playerSplitCells+'/16</span>':ogario.playerSplitCells+"/16")
            }
            /*if (gameOptionSettings.showStatsFPS) {
                text += ` | `;
            }*/
        }

        if (gameOptionSettings.showStatsFPS) {
            text += ogario.play?' | ':'';
            text += `FPS: ` + drawRender.fps;
        }
        
        if (gameOptionSettings.showStatsPPS) {
            if (gameOptionSettings.showStatsFPS || ogario.play ) text += ` | `;
            var color = ''
            if(Connection.pps<23 || Connection.pps>29) color = 'color:#ff4c4c'
            if(Connection.pps<20 || Connection.pps>32) color = 'color:red'
            text += 'PPS: <span style="'+color+'">'+Connection.pps+'</span>';
        }
        this.statsHUD.innerHTML = text;
        const app = this;
        setTimeout(() => {
            app.displayStats();
        }, 250);
    },
    displayTime() {
        if (!gameOptionSettings.showTime) {
            $(`#time-hud`).hide();
            return;
        }
        const time = new Date().toLocaleString();
        this.timeHUD.textContent = time;
        const app = this;
        setTimeout(() => {
            app.displayTime();
        }, 1000);
    },
    displayParties() {
        let text = '';
        for (let length = 0; length < this.parties.length; length++) {
            text += `<li><a href="https://agar.io/#` + this.parties[length] + `" onclick="$('#party-token').val('` + this.parties[length] + `'); $('#join-party-btn-2').click();">https://agar.io/#` + this.parties[length] + `</a></li>`;
        }
        if (text === '') {
            this.activeParties.className = `no-parties`;
        } else {
            this.activeParties.className = '';
        }
        this.activeParties.innerHTML = text;
    },
    displayTop5() {
        if (!gameOptionSettings.showTop5) {
            return;
        }
        let text = '';
        let mass = 0;
        let top5length = this.top5.length;
        for (let length = 0; length < top5length; length++) {
            mass += this.top5[length].mass;
            if (length >= this.top5limit) {
                continue;
            }
            text += `<li><span class="cell-counter" style="background-color: ${this.top5[length].color}"></span>`;
            if (gameOptionSettings.showTargeting) {
                text += `<a href="#" data-user-id="` + this.top5[length].id + `" class="set-target ogicon-target"></a> `;
            }
            gameOptionSettings.showTop5Sectors && (text += `<span class="hud-main-color">[` + this.calculateMapSector(this.top5[length].x, this.top5[length].y) + `]</span> `);
            text += `<span class="top5-mass-color">${this.shortMassFormat(this.top5[length].mass)}</span> ${this.escapeHTML(this.top5[length].nick)}</li>`;
        }
        this.top5pos.innerHTML = text;
        if (ogario.play && ogario.playerMass) {
            mass += ogario.playerMass;
            top5length++;
        }
        this.top5totalMass.textContent = this.shortMassFormat(mass);
        this.top5totalPlayers.textContent = top5length;
    },
    setTop5limit(value) {
        if (!value) {
            return;
        }
        this.top5limit = value;
    },
    displayChatHistory(on) {
        if (on) {
            this.clearChatHistory(true);
            for (let length = 0; length < this.chatHistory.length; length++) {
                $(`#messages`).append(`<li><span class="message-nick">` + this.chatHistory[length].nick + `: </span><span class="message-text">` + this.chatHistory[length].message + `</span></li>`);
            }
            return;
        }
        this.clearChatHistory(false);
    },
    clearChatHistory(on) {
        $(`#messages`).empty();
        if (on) {
            toastr.clear();
            if (gameOptionSettings.showChatBox) {
                $(`#chat-box .message`).remove();
                this.chatHistory.length = 0;
            }
        }
    },
    displayChatInfo(on, info) {
        if (on) {
            toastr.info(textLanguage[`${info}A`]);
        } else {
            toastr.error(textLanguage[`${info}B`]);
        }
    },
    setDisableChat() {
        gameOptionSettings.hideChat = gameOptionSettings.disableChat;
        this.setHideChat();
    },
    hideChat() {
        gameOptionSettings.hideChat = !gameOptionSettings.hideChat;
        this.setHideChat();
        this.displayChatInfo(!gameOptionSettings.hideChat, `hideChatMsg`);
    },
    setHideChat() {
        if (gameOptionSettings.hideChat) {
            $(`#message-box`).hide();
        }
        this.setShowChatBox();
    },
    setShowChatBox() {
        if (!gameOptionSettings.hideChat && gameOptionSettings.showChatBox) {
            $('#chat-box').show();
        } else {
            $(`#chat-box`).hide();
        }
    },
    enterChatMessage() {
        const messageBox = $(`#message-box`);
        const message = $(`#message`);
        if (!messageBox.is(`:visible`)) {
            messageBox.show();
            message.focus();
            message.val('');
        } else {
            const value = message.val();
            if (value.length) {
                this.sendChatMessage(101, value);
                if (ogario.play) {
                    message.blur();
                    messageBox.hide();
                }
            } else {
                message.blur();
                messageBox.hide();
            }
            message.val('');
        }
    },
    showMenu(value) {
        if (window.MC && window.MC.showNickDialog) {
            $('.ogario-menu').show();
            $('.menu-panel').hide();
            if (!ogario.play && !this.skipStats) {
                $('#stats').show();
            } else {
                $(`#main-panel`).show();
            }
            window.MC.showNickDialog(300);
            $('#oferwallContainer').is(`:visible`) && window.closeOfferwall();
            $(`#videoContainer`).is(`:visible`) && window.closeVideoContainer();
            return;
        }
        if (value) {
            $(`#overlays`).fadeIn(value);
        } else {
            $(`#overlays`).show();
        }
    },
    hideMenu(value) {
        if (window.MC && window.MC.showNickDialog) {
            $(`.ogario-menu`).hide();
            return;
        }
        if (value) {
            $(`#overlays`).fadeOut(value);
        } else {
            $(`#overlays`).hide();
        }
    },
    escapeHTML(string) {
        return String(string).replace(/[&<>"'/]/g, event => escapeChar[event]);
    },
    checkImgURL(url) {
        if (url.includes("png") || url.includes("jpg") || url.includes("jpeg")) {
            return url;
        } else {
            return false;
        }
    },
    checkSkinURL(url) {
        return this.checkImgURL(url)
    },
    loadSettings() {
        let settings = null;
        if (window.localStorage.getItem(`ogarioSettings`) !== null) {
            settings = JSON.parse(window.localStorage.getItem(`ogarioSettings`));
        }
        for (const option in gameOptionSettings) {
            if (gameOptionSettings.hasOwnProperty(option)) {
                if (settings && settings.hasOwnProperty(option)) {
                    gameOptionSettings[option] = settings[option];
                }
                if (ogario.hasOwnProperty(option)) {
                    ogario[option] = gameOptionSettings[option];
                }
            }
        }
    },
    saveSettings(option, name) {
        window.localStorage.setItem(name, JSON.stringify(option));
    },
    exportSettings() {
        let options = {
            ogarioCommands: chatCommand,
            ogarioHotkeys: hotkeys,
            ogarioPlayerProfiles: PlayerProfiles,
            ogarioSettings: gameOptionSettings,
            ogarioThemeSettings: gameSetupTheme
        };
        for (const option in options) {
            if (options.hasOwnProperty(option)) {
                const checked = $(`#export-` + option).prop(`checked`);
                if (!checked) {
                    delete options[option];
                }
            }
        }
        options = JSON.stringify(options);
        $(`#export-settings`).val(options);
        $(`#import-settings`).val('');
        options = null;
    },
    importSettings() {
        $(`#import-settings`).blur();
        let importValue = $(`#import-settings`).val();
        if (importValue) {
            importValue = JSON.parse(importValue);
            for (const value in importValue) {
                if (importValue.hasOwnProperty(value)) {
                    const checked = $(`#import-` + value).prop(`checked`);
                    if (!checked) {
                        continue;
                    }
                    window.localStorage.setItem(value, JSON.stringify(importValue[value]));
                }
            }
            window.location.reload();
        }
    },
    restoreSettings() {
        if (window.localStorage.getItem('ogarioSettings') !== null) {
            window.localStorage.removeItem(`ogarioSettings`);
            window.location.reload();
        }
    },
    setSettings(id, checked) {
        if (gameOptionSettings.hasOwnProperty(id) && checked !== null) {
            gameOptionSettings[id] = checked;
            if (ogario.hasOwnProperty(id)) {
                ogario[id] = checked;
            }
            switch (id) {
                case `autoResp`:
                    this.setAutoResp();
                    break;
                case `showMiniMap`:
                    this.setMiniMap();
                    break;
                case `showMiniMapGrid`:
                    this.resetMiniMapSectors();
                    break;
                case `disableChat`:
                    this.setDisableChat();
                    break;
                case `chatSounds`:
                    this.setChatSoundsBtn();
                    break;
                case 'showChatBox':
                    this.setShowChatBox();
                    break;
                case `showTop5`:
                    this.setTop5();
                    break;
                case 'showTargeting':
                    this.setTargetingHUD();
                    break;
                case `showTime`:
                    this.displayTime();
                    $('#time-hud').show();
                    break;
                case `centeredLb`:
                    this.setCenteredLb();
                    break;
                case 'normalLb':
                    this.setNormalLb();
                    break;
                case `fpsAtTop`:
                    this.setFpsAtTop();
                    break;
                case `showStats`:
                    this.displayStats();
                    $(`#stats-hud`).show();
                    break;
                case 'blockPopups':
                    this.setBlockPopups();
                    break;
            }
            this.saveSettings(gameOptionSettings, 'ogarioSettings');
        }
    },
    loadProfiles() {
        if (window.localStorage.getItem(`ogarioPlayerProfiles`) !== null) {
            PlayerProfiles = JSON.parse(window.localStorage.getItem('ogarioPlayerProfiles'));
        } else {
            let profilesLength = 10;
            for (let length = 0; length < profilesLength; length++) {
                PlayerProfiles.push({
                    nick: `Profile #` + (length + 1),
                    clanTag: '',
                    skinURL: '',
                    color: gameSetupTheme.mainColor
                });
            }
        }
        if (window.localStorage.getItem(`ogarioSelectedProfile`) !== null) {
            this.selectedProfile = JSON.parse(window.localStorage.getItem(`ogarioSelectedProfile`));
        }
        if(this.selectedProfile>PlayerProfiles.length) this.selectedProfile = PlayerProfiles.length-1
        console.log(this.selectedProfile,PlayerProfiles.length-1)
        try{
        mainProfile.nick = PlayerProfiles[this.selectedProfile].nick;
        mainProfile.clanTag = PlayerProfiles[this.selectedProfile].clanTag;
        mainProfile.skinURL = PlayerProfiles[this.selectedProfile].skinURL;
        mainProfile.color = PlayerProfiles[this.selectedProfile].color;
    }catch(e){}
    },
    changeSkinPreview(img, id) {
        if (!img || !id) {
            return;
        }
        if (id === `skin-preview`) {
            $(`#skin-preview`).removeClass(`default`).append(`<a href="#" id="skin-popover" data-toggle="popover" title="" data-html="true" data-content="<img src='${img.src}' width='500'>"></a>`);
            $(`#skin-popover`).append($(img).fadeIn(1000));
            $('#skin-popover').popover();
        } else {
            $(`#${id}`).removeClass(`default`).append($(img).fadeIn(1000));
        }
    },
    setSkinPreview(t, e) {		
                checktypeImgVid = new Image();
                if ($('#' + e).empty().addClass('default'), t && 0 != t.length) {
                    var i = this,
                        o = checktypeImgVid;
                    o.src = t;
                    o.crossOrigin = 'anonymous',
                        o.onload = function() {
                            i.changeSkinPreview(o, e);
                        };
                }		
    },
    setProfile() {
        const prevProfile = (PlayerProfiles.length + this.selectedProfile - 1) % PlayerProfiles.length;
        const nextProfile = (this.selectedProfile + 1) % PlayerProfiles.length;
        this.setSkinPreview(PlayerProfiles[prevProfile].skinURL, 'prev-profile');
        this.setSkinPreview(PlayerProfiles[this.selectedProfile].skinURL, `skin-preview2`);
        this.setSkinPreview(PlayerProfiles[nextProfile].skinURL, `next-profile`);
        this.saveSettings(this.selectedProfile, `ogarioSelectedProfile`);
        $(`#nick`).val(PlayerProfiles[this.selectedProfile].nick);
        $(`#clantag`).val(PlayerProfiles[this.selectedProfile].clanTag);
        $(`#skin`).val(PlayerProfiles[this.selectedProfile].skinURL);
        $(`#color`).val(PlayerProfiles[this.selectedProfile].color);
        $(`.skin`).colorpicker(`setValue`, PlayerProfiles[this.selectedProfile].color);
        $('#skins a').removeClass('selected');
        $(`#skins a[data-profile=${this.selectedProfile}]`).addClass(`selected`);
    },
    prevProfile() {
        this.setPlayerSettings();
        this.selectedProfile = (PlayerProfiles.length + this.selectedProfile - 1) % PlayerProfiles.length;
        this.setProfile();
    },
    nextProfile() {
        this.setPlayerSettings();
        this.selectedProfile = (this.selectedProfile + 1) % PlayerProfiles.length;
        this.setProfile();
    },
    selectProfile(value) {
        this.setPlayerSettings();
        this.selectedProfile = parseInt(value);
        this.setProfile();
    },
    addOption(id, name, text, checked) {
        $(id).append(`<label><input type="checkbox" id="${name}" class="js-switch"> ${text}</label>`);
        $(`#${name}`).prop(`checked`, checked);
    },
    addOptions(options, section) {
        if (!options) {
            return;
        }
        $('#og-options').append(`${`<div class="options-box ` + section}"><h5 class="menu-main-color">${textLanguage[section]}</h5></div>`);

        for (const option of options) {
            if (gameOptionSettings.hasOwnProperty(option)) {
                $(`.${section}`).append(`${`<label><input type="checkbox" class="js-switch" id="${option}"> ` + textLanguage[option]} </label>`);
                $(`#${option}`).prop(`checked`, gameOptionSettings[option]);
            }
        }
    },
    addSelectBox(id, name, options, value, callback) {
        $(id).append(`<div class="preset-box"><span class="title-box">` + textLanguage[name] + `</span><div class="select-wrapper"><select id="` + name + `" class="form-control"></select></div></div>`);
        for (const option in options) {
            if (options.hasOwnProperty(option)) {
                $(`#${name}`).append(`${`<option value="` + option}">${options[option].name}</option>`);
            }
        }
        $(`#${name}`).val(gameOptionSettings[value]);
        const app = this;
        $(`#${name}`).on(`change`, function() {
            const optionValue = this.value;
            gameOptionSettings[value] = optionValue;
            app[callback](optionValue);
        });
    },
    addInputBox(id, name, holder, callback) {
        $(id).append(`${`<div class="input-box"><span class="title-box">` + textLanguage[name]}</span><input id="${name}" class="form-control" placeholder="${holder}" value="${gameOptionSettings[name]}" /></div>`);
        const app = this;
        $(`#${name}`).on(`input`, function() {
            gameOptionSettings[name] = this.value;
            app[callback]();
            app.saveSettings(gameOptionSettings, `ogarioSettings`);
        });
    },
    addSliderBox(id, name, min, max, step, callback) {
        $(id).append(`${`<div class="slider-box"><div class="box-label"><span class="value-label">` + textLanguage[name] + `: </span><span id="` + name}-value" class="value">${gameOptionSettings[name]}</span></div><input id="${name}-slider" type="range" min="${min}" max="${max}" step="${step}" value="${gameOptionSettings[name]}"></div>`);
        const app = this;
        if (callback) {
            $(`#${name}-slider`).on(`input`, function() {
                const parse = parseFloat($(this).val());
                $(`#${name}-value`).text(parse);
                gameOptionSettings[name] = parse;
                if (ogario.hasOwnProperty(name)) {
                    ogario[name] = parse;
                }
                app[callback]();
                app.saveSettings(gameOptionSettings, `ogarioSettings`);
            });
        } else {
            $(`#${name}-slider`).on('input', function() {
                const parse = parseFloat($(this).val());
                $(`#${name}-value`).text(parse);
                gameOptionSettings[name] = parse;
                if (ogario.hasOwnProperty(name)) {
                    ogario[name] = parse;
                }
                app.saveSettings(gameOptionSettings, 'ogarioSettings');
            });
        }
    },
    setLang() {
        if (lang !== 'pl') {
            return;
        }
        if (window.i18n_dict && window.i18n_dict.en) {
            for (var lang in window.i18n_dict.en) {
                if (window.i18n_dict.en.hasOwnProperty(lang) && textLanguage.hasOwnProperty(lang)) {
                    window.i18n_dict.en[lang] = textLanguage[lang];
                }
            }
        }
    },
    setMenu() {
        const app = this;
        document.title = this.name;
        //$(`#mainPanel`).before(`<div id="exp-bar" class="agario-panel"><span class="ogicon-user"></span><div class="agario-exp-bar progress"><span class="progress-bar-text"></span><div class="progress-bar progress-bar-striped" style="width: 0%;"></div></div><div class="progress-bar-star"></div></div><div id="main-menu" class="agario-panel"><ul class="menu-tabs"><li class="start-tab active"><a href="#main-panel" class="active ogicon-home" data-toggle="tab-tooltip" title="${textLanguage.start}"></a></li><li class="profile-tab"><a href="#profile" class="ogicon-user" data-toggle="tab-tooltip" title="${textLanguage.profile}"></a></li><li class="settings-tab"><a href="#og-settings" class="ogicon-cog" data-toggle="tab-tooltip" title="${textLanguage.settings}"></a></li><li class="theme-tab"><a href="#theme" class="ogicon-droplet" data-toggle="tab-tooltip" title="${textLanguage.theme}"></a></li><li class="hotkeys-tab"><a href="#" class="hotkeys-link ogicon-keyboard" data-toggle="tab-tooltip" title="${textLanguage.hotkeys}"></a></li><li class="music-tab"><a href="#music" class="ogicon-music" data-toggle="tab-tooltip" title="Radio / ${textLanguage.sounds}"></a></li></ul><div id="main-panel" class="menu-panel"></div><div id="profile" class="menu-panel"></div><div id="og-settings" class="menu-panel"><div class="submenu-panel"></div></div><div id="theme" class="menu-panel"></div><div id="music" class="menu-panel"></div></div>`);
        $('[href="#main-panel"]').attr('title',textLanguage.start)
        $('[href="#profile"]').attr('title',textLanguage.profile)
        $('[href="#og-settings"]').attr('title',textLanguage.settings)
        $('.hotkeys-link').attr('title',textLanguage.hotkeys)
        $('[href="#theme"]').attr('title',textLanguage.theme)
        $('[href="#music"]').attr('title',textLanguage.sounds)
        
        //$('#main-panel').append('<a href="#" class="quick quick-menu ogicon-menu"></a><a href="#" class="quick quick-skins ogicon-images"></a><div id="profiles"><div id="prev-profile" class="skin-switch"></div><div id="skin-preview"></div><div id="next-profile" class="skin-switch"></div></div>');
        //$(`#mainPanel div[role=form]`).appendTo($('#main-panel'));
        //$(`#main-panel div[role=form] .form-group:first`).remove();
        //$('#nick').before(`<input id="clantag" class="form-control" placeholder="Tag, e.g. Ⓜ" maxlength="10"><div class="input-group nick"></div>`);
        //$(`#nick`).appendTo($(`.nick`));
        //$(`.nick`).append(`<span class="input-group-btn"><button id="stream-mode" class="btn active ogicon-eye"></button></span>`);
        //$(`.nick`).after(`<div class="input-group skin"><input id="skin" class="form-control" placeholder="Skin URL (direct link)" maxlength="60"><input type="hidden" id="color" value="` + mainProfile.color + `" maxlength="7" /><span class="input-group-addon"><i></i></span><span class="input-group-btn"><button id="hide-url" class="btn active ogicon-eye"></button></span></div>`);
        //$(`#locationKnown, #locationUnknown`).insertAfter($(`.skin`));
        //$(`#region`).before(`<button class="btn btn-warning btn-server-info ogicon-cogs"></button>`);
        //$(`.btn-spectate, .btn-logout`).appendTo(`#agario-main-buttons`);
        //$(`#agario-main-buttons`).addClass('clearfix').before(`<div id="server-info" class="form-group clearfix"><input id="server-ws" class="form-control" placeholder="Server WS"><button id="server-connect" class="btn btn-success ogicon-power"></button><button id="server-reconnect" class="btn btn-primary ogicon-redo2"></button><input id="server-token" class="form-control" placeholder="Server token"><button id="server-join" class="btn btn-success" data-itr="page_join_party">Join</button></div>`);
        //$(`#helloContainer div[role=form]`).after(`<div id="ogario-party" class="clearfix"><input id="party-token" class="form-control" placeholder="Party token"></div>`);
        //$(`#ogario-party`).append(`<button id="join-party-btn-2" class="btn btn-success" data-itr="page_join_party">Join</button><button id="create-party-btn-2" class="btn btn-primary" data-itr="page_create_party">Create</button>`);
        ///$('#pre-join-party-btn:first, #join-party-btn:first, #create-party-btn:first, #leave-party-btn:first, #joinPartyToken:first, .party-icon-back:first').appendTo($(`#ogario-party`));
        ///.appendTo($(`#og-settings .submenu-panel`));
        ///.appendTo($(`#main-menu`)).addClass(`menu-panel`);
        //$(`#statsContinue`).attr('id', 'statsContinue2');
        //$(`#mainPanel`).empty().remove();
        //$(`.center-container`).addClass(`ogario-menu`);
        //$(`.center-container`).append(`<div id="menu-footer" class="menu-main-color">` + textLanguage.visit + ` <a href="https://ogario.ovh" target="_blank">ogario.ovh</a> | ` + this.version + ` <a href="https://goo.gl/nRREoR" class="release ogicon-info" target="_blank"></a></div>`);
        $('#menu-footer').html(``  + `
                <a href="https://agar.io/ogario">OGARio</a>|
                                    <a href="https://agar.io/lm">LegendMod</a>|
                                    <a href="https://agar.io/hslo">HSLO</a>|
                                    <a href="https://agar.io/hslo5">HSLO v5</a>|
                                    <a href="https://agar.io/at">Agartool</a>|
                                    <a href="https://agar.io/va">VANILLA</a>|
                                    <a href="https://agar.io/pixi">D▲M(PIXI)</a>|
                                    <a href="https://agar.io/dead">D▲M</a>|
                                    <a href="https://agar.io/v4">Delta v4</a>|
                                    <a href="https://agar.io/v5">Delta v5</a></br>

                <a href="https://deltav4.glitch.me" target="_blank">Delta Mod</a> ( based on <a href="https://ogario.ovh" target="_blank">OGARio by szymy</a> ). ${textLanguage.visit} <a href="https://vk.com/yahnych" target="_blank">ІЯ</a>|
                <a href="https://discord.gg/3VDa5bH" style="color:red" target="_blank">Discord</a>`)
        
          $(".left-container").append(`<div id="quick-bots" class="agario-panel agario-side-panel">			
					<h5 class="main-color">Replays</h5>
					<div id="replays" style="margin-left:15px; margin-right:15px; font-family: Tahoma; color: rgb(255, 255, 255); z-index: 9999; border-radius: 5px; min-height: 16px; min-width: 150px; background-color: rgba(2, 0, 0, 0.4);">			
          <div id="replaysInfo" class="menu-main-color">

          </div>
					<input type="text" id="importReplayData" placeholder="Paste import data here" spellcheck="false">

					<br>
					<button id="importReplay" class="btn btn-success">Import replay</button>

          </div>					

					</div>`);

        //$(`#leftPanel, #rightPanel`).addClass('ogario-menu').removeAttr('id');
        //$(`.agario-profile-panel, .agario-panel-freecoins, .agario-panel-gifting, .agario-shop-panel, #dailyquests-panel`).appendTo($(`#profile`)).removeClass('agario-side-panel');
        //$(`.agario-profile-panel`).after(`<div id="block-warn">` + textLanguage.blockWarn + `<br><a href="#" id="unblock-popups">` + textLanguage.unblockPopups + `</a></div>`);
        //$(`#exp-bar`).addClass(`agario-profile-panel`);
        //$(`.left-container`).empty();
        //$(`.agario-shop-panel`).after(`<div class="agario-panel ogario-yt-panel"><h5 class="menu-main-color">Team OGARio (tag: Ⓜ)</h5><div class="g-ytsubscribe" data-channelid="UCaWiPNJWnhzYDrBQoXokn6w" data-layout="full" data-theme="dark" data-count="default"></div></div>`);
        //$(`#tags-container`).appendTo($('#profile'));
        //$(`.btn-logout`).appendTo($(`#profile`));
        //$(`.left-container`).append(`<div id="quick-menu" class="agario-panel agario-side-panel"><a href="https://ogario.ovh/skins/" class="quick-more-skins ogicon-grin" target="_blank" data-toggle="tab-tooltip" data-placement="left" title="` + textLanguage.skins + `"></a><a href="https://youtube.com/channel/UCaWiPNJWnhzYDrBQoXokn6w" class="quick-yt ogicon-youtube2" target="_blank" data-toggle="tab-tooltip" data-placement="left" title="Team OGARio"></a></div>`);
        /*if (!this.protocolMode) {
            $(`#quick-menu`).prepend(`${`<a href="#" class="quick-shop ogicon-cart" data-toggle="tab-tooltip" data-placement="left" title="` + textLanguage.page_shop + `"></a><a href="#" class="quick-free-coins ogicon-coin-dollar" data-toggle="tab-tooltip" data-placement="left" title="` + textLanguage.page_menu_main_free_coins + `"></a><a href="#" class="quick-free-gifts ogicon-gift" data-toggle="tab-tooltip" data-placement="left" title="` + textLanguage.page_menu_main_gifts}"></a><a href="#" class="quick-quests ogicon-trophy" data-toggle="tab-tooltip" data-placement="left" title="${textLanguage.page_menu_main_dailyquests}"></a>`);
        }*/
        //$(`.party-dialog, .partymode-info`).remove();
        //$(`.agario-party-6`).appendTo($(`.center-container`));
        //$(`.right-container`).empty();
        //$(`.right-container`).append(`<div class="agario-party"></div>`);
        //$(`.agario-party-6`).appendTo($(`.agario-party`)).addClass(`agario-panel agario-side-panel`);
        //$(`.agario-party h4, #cancel-party-btn`).remove();
        //$(`.agario-party .btn`).addClass(`btn-sm`);
        //$(`.right-container`).append(`${`<div id="skins-panel" class="agario-panel agario-side-panel"><div id="skins"></div><a href="https://ogario.ovh/skins/" id="more-skins" class="btn btn-block btn-success" target="_blank">` + textLanguage.moreSkins}</a></div>`);
        //$(`.btn-settings, .text-muted, .tosBox, .agario-promo, #agario-web-incentive, span[data-itr='page_option_dark_theme'], #options #darkTheme`).remove();
        //$('#advertisement, #adbg, #a32592, #g32592, #s32592, #adsBottom').css(`display`, `none`);
        //$('#advertisement').removeClass(`agario-panel`);
        /*$(`#adsBottom`).css({
            'z-index': '1',
            opacity: '0',
            bottom: `-100px`
        });*/
        //$(`#noNames, #showMass`).remove();
        //$(`#og-settings .submenu-panel`).append('<div id="og-options"></div>');
        this.addOptions([], `animationGroup`);
        this.addOptions(['autoZoom'], `zoomGroup`);
        this.addOptions([`quickResp`, `autoResp`], `respGroup`);
        this.addOptions(['virusSounds','stickyCell', 'reverseTrick', 'clickTargeting', 'deltaSocket', 'debug','mapLocalFix3','mapGlobalFix4', 'autobrewing', 'onlineStatus', 'autosearchFB'], `newGroup`);
        
        this.addOptions(['noNames', `optimizedNames`, `autoHideNames`, `hideMyName`, `hideTeammatesNames`, `namesStroke`], `namesGroup`);
        this.addOptions(['showMass', `optimizedMass`, `autoHideMass`, `hideMyMass`, 'hideEnemiesMass', `shortMass`, `virMassShots`, `massStroke`], `massGroup`);
        if (!this.protocolMode) {
            this.addOptions(['customSkins'], `skinsGroup`);
        } else {
            this.addOptions([`customSkins`, 'vanillaSkins', 'FBSkins'], 'skinsGroup');
        }
        this.addOptions(['autoHideFood', 'autoHideFoodOnZoom', `rainbowFood`], `foodGroup`);
        this.addOptions([`myCustomColor`, 'myTransparentSkin', `transparentSkins`, `cellContours`, 'transparentCells', 'transparentViruses'], `transparencyGroup`);
        this.addOptions([`showGrid`, `showBgSectors`, `showMapBorders`, `rainbowBorders`, `newRainbowBorders`], `gridGroup`);
        this.addOptions([`disableChat`, 'chatSounds', `chatEmoticons`, `showChatImages`, `showChatVideos`, `coloredNicks`, `showChatBox`], `chatGroup`);
        this.addOptions(['showMiniMap', `showMiniMapGrid`, `showMiniMapGuides`,'showMiniMapGhostCells', `oneColoredTeammates`], `miniMapGroup`);
        this.addOptions([`oppColors`, `oppRings`, `bubbleInd`, 'virColors', `splitRange`, "qdsplitRange", "sdsplitRange", `virusesRange`, `cursorTracking`, `bubbleCursorTracker`, `FBTracking`, 'teammatesInd', 'showGhostCells', 'ingameSpectator', 'fullSpectator', 'oneColoredSpectator'], `helpersGroup`);
        this.addOptions([`mouseSplit`, `waves`, 'mouseFeed', `mouseInvert`], `mouseGroup`);
        this.addOptions([`showTop5`, 'showTop5Sectors', 'showTargeting', `showLbData`, 'centeredLb', `normalLb`, `fpsAtTop`, `targetSearch`], `hudGroup`);
        this.addOptions(['showStats', `showStatsMass`, `showStatsSTE`, 'showStatsN16', `showStatsFPS`,`showStatsPPS`, `showTime`], `statsGroup`);
        if (!this.protocolMode) {
            this.addOptions('blockPopups', 'extrasGroup');
            $(`#noSkins, #noColors, #skipStats, #showQuest`).addClass(`js-switch-vanilla`);
            $(`.skinsGroup h5`).after(`<label class="noSkins">${textLanguage.noSkins} </label>`);
            $(`#noSkins`).appendTo($(`.noSkins`));
            $(`.transparencyGroup h5`).after(`<label class="noColors">${textLanguage.noColors} </label>`);
            $('#noColors').appendTo($('.noColors'));
            $(`.extrasGroup h5`).after(`<label class="skipStats">` + textLanguage.skipStats + ` </label>`);
            $(`#skipStats`).appendTo($(`.skipStats`));
            $(`.skipStats`).after(`<label class="showQuest">` + textLanguage.showQuest + ` </label>`);
            $('#showQuest').appendTo($(`.showQuest`));
            $(`#options`).remove();
            $(`#settingsChoice`).appendTo($(`.extrasGroup`)).addClass(`select-wrapper`);
        }
        this.addSliderBox(`.newGroup`, `leaderboardLength`, 5, 30, 5);
        this.addSliderBox(`.newGroup`, `renderQuality`, 0.5, 1.75, 0.25);
             $(`#renderQuality-slider`).on(`change`, function() {
                drawRender.setCanvas()
                drawRender.resizeCanvas()                    
             })
        this.addSliderBox(`.newGroup`, `cameraDelay`, 0, 15, 1);
        this.addSliderBox(`.newGroup`, `macroFeeding`, 10, 160, 10);

        this.addSliderBox(`.animationGroup`, `animation`, 40, 200, 1);
        this.addSliderBox(`.zoomGroup`, `zoomSpeedValue`, 0.75, 0.99, 0.01);
        $(`#og-settings`).append(`<button class="btn btn-block btn-success btn-export">` + textLanguage.exportImport + `</button>`);
        $(`#og-settings`).append(`<div class="restore-settings"><a href="#">` + textLanguage.restoreSettings + `</a></div>`);
        $(`#music`).append(`<div id="music-main" class="submenu-panel"></div>`);
        //$(`#music`).append(`${`<div class="agario-panel radio-panel"><h5 class="menu-main-color">Radio</h5><audio src="http://shoutcast1.hardcoreradio.nl:9000/" controls></audio><span class="playlist"><span class="ogicon-file-music"></span> <a href="http://uk6.internet-radio.com:8346/listen.pls&t=.pls" target="_blank">` + textLanguage.playlist}</a></span></div>`);
        $(`#music-main`).append(`<div class="agario-panel sounds-panel"><h5 class="menu-main-color">` + textLanguage.sounds + `</h5></div>`);
       // $(`#music`).append(`<div class="agario-panel ogario-yt-panel"><h5 class="menu-main-color">Team OGARio (tag: Ⓜ)</h5><div class="g-ytsubscribe" data-channelid="UCaWiPNJWnhzYDrBQoXokn6w" data-layout="full" data-theme="dark" data-count="default"></div></div>`);
        this.addInputBox(`.sounds-panel`, `messageSound`, 'Sound URL', 'setMessageSound');
        this.addInputBox('.sounds-panel', 'commandSound', `Sound URL`, `setCommandSound`);
        this.addInputBox('.sounds-panel', 'virusSoundURL', `Sound URL`, `setVirusSound`);
        $(`#music-main`).append(`<div class="agario-panel facebook-panel"><h5 class="menu-main-color">` + textLanguage.facebook + `</h5></div>`);
        this.addInputBox('.facebook-panel', 'FacebookIDs', `e.g. 123456789012345:John K,543210987654321:Jimbo`, `setFBIDs`);
        $(`#music-main`).append(`<div class="agario-panel search-panel"><h5 class="menu-main-color">` + textLanguage.search + `</h5></div>`);
        this.addInputBox('.search-panel', 'skinsForSearch', 'ID,ID,...'/*`Твій силует бачу в кожній із них`*/, `setSearchSkins`);
        this.addInputBox('.search-panel', 'nicksForSearch', 'Nick,nick,...'/*`Твоє ім'я на устах , весь світ притих`*/, `setSearchNicks`);
        $(`#music-main`).append(`<div class="agario-panel extras-panel"><h5 class="menu-main-color">STICKERS</h5></div>`);
        $(`#music-main`).append(`<div style="text-align:center;"><h6>Use "," to separate stickers. Examples <a href="https://blooming-tulip.glitch.me/dead/core/index.html" target="_blank"> here.</a></h6></div>`)
        this.addInputBox('.extras-panel', 'extras', 'e.g https://i.imgur.com/vB7LqQz.png+1+2.66+2+2+0', `setExtras`);
        $(`#music-main`).append(`<div class="agario-panel discord-panel"><h5 class="menu-main-color">Discord</h5></div>`);
        this.addInputBox('.discord-panel', 'discord', 'Discord webhook URL', `setDiscordWH`);
        /*$('body').append(`
        <div id="overlays-hud" data-gamemode=":ffa">
<div id="stats-hud" class="hud stats-hud-color"></div>
<div id="top5-hud" class="hud">
    <!--h5 class="hud-main-color">Team top <span class="team-top">5</span></h5-->
    <div class="hud-main-color team-top-menu"><a href="#" data-limit="5" class="team-top-limit active">5</a> | <a href="#" data-limit="10" class="team-top-limit">10</a> | <a href="#" data-limit="100" class="team-top-limit">100</a>   
    
    <div style="float:left"><span id="top5-total-players" class="top5-mass-color">0</span> x = <span id="top5-total-mass" class="top5-mass-color">0</span></div>
    </div>
    <!--div id="top5-total"></div-->
    <ol id="top5-pos"></ol>
</div>
<div id="time-hud" class="hud time-hud-color"></div>
<div id="pause-hud" class="hud">` + textLanguage.pause + `</div>
<div id="leaderboard-hud" class="hud-b">
    <h4 class="hud-main-color">ogario.ovh</h4>
    <div id="leaderboard-data"></div>
    <div id="leaderboard-positions"></div>
</div>
<div id="btl-leaderboard-hud">
    <div class="hud hud-c"><span id="btl-players-status">Players ready</span>: <span id="btl-players-count">0</span></div>
</div>
<div id="minimap-hud" class="hud-b"><canvas id="minimap-sectors"></canvas><canvas id="minimap"></canvas></div>
<div id="target-hud" class="hud">
    <div id="target-player"><span id="target-skin"><img src="https://cdn.ogario.ovh/static/img/blank.png" alt=""> </span><span id="target-nick"></span> <span id="target-status" class="hud-main-color">[` + textLanguage.targetNotSet + `]</span></div>
    <div id="target-summary"></div>
</div>
<div id="target-panel-hud" class="hud"><a href="#" id="set-targeting" class="ogicon-target"></a><a href="#" id="set-private-minimap" class="ogicon-location2"></a><a href="#" id="cancel-targeting" class="ogicon-cancel-circle"></a><a href="#" id="change-target" class="ogicon-arrow-right"></a></div>
<div id="quest-hud" class="hud"></div>
<div id="btl-hud" class="hud"></div>
</div>

        `);*/
        //$(`body`).append(`<ul id="messages"></ul>`);
        //$(`body`).append(`<div id="message-box"><div id="chat-emoticons"></div><div id="message-menu"><a href="#" class="chat-sound-notifications ogicon-volume-high"></a><a href="#" class="chat-active-users ogicon-user-check"></a><a href="#" class="chat-muted-users ogicon-user-minus"></a><a href="#" class="show-chat-emoticons ogicon-smile"></a></div><input type="text" id="message" class="form-control" placeholder="${textLanguage.enterChatMsg}..." maxlength="80"></div>`);
        //$(`body`).append('<div id="chat-box"></div>');
        for (const emoji in emojiChar) {
            if (emojiChar.hasOwnProperty(emoji)) {
                  $('#chat-emoticons').append(`<img src="https://cdn.ogario.ovh/static/emoticons/${emojiChar[emoji]}" alt="${emoji}" class="emoticon">`);
            }
        }


        //$('body').append(`<div id="exp-imp"><div id="exp-imp-menu"><button id="close-exp-imp" class="btn btn-danger">` + textLanguage.close + `</button></div><div id="exp-imp-settings"></div></div>`);
        $(`#exp-imp-settings`).append(`<h1>` + textLanguage.exportSettings + `</h1><h2>` + textLanguage.exportInfo + `</h2>`);
        this.addOption(`#exp-imp-settings`, `export-ogarioCommands`, textLanguage.commands, true);
        this.addOption(`#exp-imp-settings`, `export-ogarioHotkeys`, textLanguage.hotkeys, true);
        this.addOption(`#exp-imp-settings`, 'export-ogarioPlayerProfiles', textLanguage.profiles, true);
        this.addOption('#exp-imp-settings', `export-ogarioSettings`, textLanguage.settings, true);
        this.addOption(`#exp-imp-settings`, `export-ogarioThemeSettings`, textLanguage.theme, true);
        $('#exp-imp-settings').append(`<textarea id="export-settings" class="form-control" rows="14" cols="100" spellcheck="false" readonly /><button id="export-settings-btn" class="btn btn-block btn-success">${textLanguage.exportSettings}</button>`);
        $(`#exp-imp-settings`).append(`${`<h1>` + textLanguage.importSettings}</h1><h2>${textLanguage.importInfo}</h2>`);
        this.addOption(`#exp-imp-settings`, `import-ogarioCommands`, textLanguage.commands, true);
        this.addOption(`#exp-imp-settings`, 'import-ogarioHotkeys', textLanguage.hotkeys, true);
        this.addOption(`#exp-imp-settings`, `import-ogarioPlayerProfiles`, textLanguage.profiles, true);
        this.addOption(`#exp-imp-settings`, `import-ogarioSettings`, textLanguage.settings, true);
        this.addOption(`#exp-imp-settings`, `import-ogarioThemeSettings`, textLanguage.theme, true);
        $('#exp-imp-settings').append(`<textarea id="import-settings" class="form-control" rows="14" cols="100" spellcheck="false" /><button id="import-settings-btn" class="btn btn-block btn-success">` + textLanguage.importSettings + `</button>`);
        OgarioSettings && OgarioSettings.setThemeMenu();
        
        /*for (let length = 0; length < PlayerProfiles.length; length++) {
            $(`#skins`).append(`${`<div class="skin-box"><a href="#profile-` + length}" id="profile-${length}" data-profile="${length}" class="skin-switch"></a></div>`);
            this.setSkinPreview(PlayerProfiles[length].skinURL, `profile-` + length);
            if (length == this.selectedProfile) {
                $(`#profile-` + length).addClass(`selected`);
            }
        }*/


        Math.rad = function (degrees) {
            return degrees * Math.PI / 180
        }
        Math.deg = function (radians) {
            return radians * 180 / Math.PI
        }
        
        //profiles = JSON.parse(unescape("%5B%7B%22nick%22%3A%22%u0F17%u0F3D%u0F72%u0487%B7%u033D%uD835%uDD44%u1160%u1160%u1160%u1160%u1160%u1160%u2726%22%2C%22clanTag%22%3A%22%22%2C%22skinURL%22%3A%22https%3A//i.imgur.com/79PTcvz.png%22%2C%22color%22%3A%22%23ce2578%22%7D%2C%7B%22nick%22%3A%22%u202A%u202E%u0280%u1D0F%u1D1B%u1D04%u1D0F%u1D05%u1D38%u1D2C%u1D3A%u1D2C%u261D%u202A%22%2C%22clanTag%22%3A%22%22%2C%22skinURL%22%3A%22https%3A//i.imgur.com/hF4FQvq.png%22%2C%22color%22%3A%22%23d42c70%22%7D%2C%7B%22nick%22%3A%22%u202A%u202E%u0280%u1D0F%u1D1B%u1D04%u1D0F%u1D05%u1D38%u1D2C%u1D3A%u1D2C%u261D%u202A%22%2C%22clanTag%22%3A%22%22%2C%22skinURL%22%3A%22https%3A//i.imgur.com/bbAJjq3.png%22%2C%22color%22%3A%22%2301d9cc%22%7D%2C%7B%22nick%22%3A%22%u261D%u1D2C%u1D3A%u1D3A%u1D2C%u1D38%u1D05%u1D0F%u029F%u0262%u1D0F%u1D20%u1D00%22%2C%22clanTag%22%3A%22%22%2C%22skinURL%22%3A%22https%3A//i.imgur.com/XUemRoAb.jpg%22%2C%22color%22%3A%22%23d90151%22%7D%2C%7B%22nick%22%3A%22team%20%3D%20ctrl+w%22%2C%22clanTag%22%3A%22%22%2C%22skinURL%22%3A%22https%3A//i.imgur.com/Jxvc1CA.png%22%2C%22color%22%3A%22%23fc004f%22%7D%2C%7B%22nick%22%3A%22%u0442%u03C5%u044F%u043A%u03B9%u0455%u043D%20%u03B2%u0259%u03B3%uD83C%uDF3A%22%2C%22clanTag%22%3A%22%22%2C%22skinURL%22%3A%22https%3A//i.imgur.com/vbcVkqv.png%22%2C%22color%22%3A%22%2301d9cc%22%7D%2C%7B%22nick%22%3A%22%uD800%uDE95%u33CD%u262Ap%u0131zdun%FCr%u2728%22%2C%22clanTag%22%3A%22%22%2C%22skinURL%22%3A%22https%3A//i.imgur.com/IrwQeI3.png%22%2C%22color%22%3A%22%2301d9cc%22%7D%2C%7B%22nick%22%3A%22%u2104%uD83C%uDF00%20%u1D05%u1D0F%u1D04%u1D1B%u1D0F%u0280%22%2C%22clanTag%22%3A%22%22%2C%22skinURL%22%3A%22https%3A//i.imgur.com/Ii9HBrP.png%22%2C%22color%22%3A%22%2301d9cc%22%7D%2C%7B%22nick%22%3A%22%u262B%u1160%u1160%u0274%u2C7B%u1D0F%u1160%u1160%u262B%22%2C%22clanTag%22%3A%22%22%2C%22skinURL%22%3A%22https%3A//i.imgur.com/GffUXYy.png%22%2C%22color%22%3A%22%2301d9cc%22%7D%2C%7B%22nick%22%3A%22%u0421%u043B%u0430%u0434%u043A%u0430%u044F%20%u0442%u0430%u0442%u0430%u0440%u043A%u0430%22%2C%22clanTag%22%3A%22%22%2C%22skinURL%22%3A%22https%3A//i.imgur.com/gJujp4o.jpg%22%2C%22color%22%3A%22%2301d9cc%22%7D%2C%7B%22nick%22%3A%22%u202E%u0280%u1D0F%u1D1B%u1D04%u1D0F%u1D05%u1D38%u1D2C%u1D3A%u1D2C%u261D%u202B%22%2C%22clanTag%22%3A%22%22%2C%22skinURL%22%3A%22https%3A//i.imgur.com/hhMbO5P.png%22%2C%22color%22%3A%22%23ff7800%22%7D%2C%7B%22nick%22%3A%22%u041C%u0438%u043D%u0435%u0442%20%u0420%u043E%u043A%u0443%22%2C%22clanTag%22%3A%22%22%2C%22skinURL%22%3A%22https%3A//i.imgur.com/XUemRoA.jpg%22%2C%22color%22%3A%22%23ff7800%22%7D%2C%7B%22nick%22%3A%22%5Ct%u982D%u6587%u5B57%20%uD835%uDC6B%22%2C%22clanTag%22%3A%22%22%2C%22skinURL%22%3A%22https%3A//i.imgur.com/o7YjBnF.png%22%2C%22color%22%3A%22%23ff7800%22%7D%2C%7B%22nick%22%3A%22%u271DS%u0354%u0351oloG%u0354%u0351irl%uD83C%uDF39%22%2C%22clanTag%22%3A%22%22%2C%22skinURL%22%3A%22https%3A//i.imgur.com/23Dtc8j.png%22%2C%22color%22%3A%22%23ff7800%22%7D%2C%7B%22nick%22%3A%22%uFDFD%uFDFD%uFDFD%uFDFD%uFDFD%uFDFD%uFDFD%uFDFD%uFDFD%uFDFD%uFDFD%uFDFD%uFDFD%uFDFD%uFDFD%22%2C%22clanTag%22%3A%22%22%2C%22skinURL%22%3Afalse%2C%22color%22%3A%22%2301d9cc%22%7D%5D"))
        //console.log(profiles)
        //theta = Math.PI * theta / 180      // convert to radians.
        radius = 60
        centerX = 50
        centerY = 50
        
        function calc() {
            var els = document.getElementsByClassName('thumb')
            var len = els.length
            var theta = Math.rad(40)
            var deg = Math.rad(100 * 2 / (len - 2))
        
            var theta2 = Math.rad(-40)
            var deg2 = Math.rad(-100 * 2 / (len - 2))
        
            for (var i = 0; els.length > i; i++) {
                if (i > Math.ceil(len / 2)) break
                var x = centerX + radius * Math.cos(theta)
                var y = centerY - radius * Math.sin(theta)
                els[i].style =
                    'top: ' + x + '%;left: ' + y + '%;z-index:' + (200 - i)
                theta += deg
        
            }
        
            for (var i = Math.floor(els.length / 2); els.length > i; i++) {
                var x = centerX + radius * Math.cos(theta2)
                var y = centerY - radius * Math.sin(theta2)
            
                els[i].style =
                    'top: ' + x + '%;left: ' + y + '%;z-index:' + (200 - i)
                theta2 += deg2
        
            }
        
        }
        calc()
        
        
        
        
        function add(profile,n) {
          var thumb = document.createElement('div')
          thumb.id='profile-'+n
          thumb.setAttribute('data-profile',n)
              thumb.innerHTML = `<img src="${profile.skinURL||'https://i.imgur.com/pkw159c.png'}">`
            thumb.className = 'thumb'
            document.getElementById('skins2')
                .appendChild(thumb)
            calc()
        }
        
        PlayerProfiles.forEach(function(profile,n){
          add(profile,n)
          
        })
        
        function setSkinPreview(n){
              $('#skin-preview2').html(`<img src="${PlayerProfiles[n].skinURL||'https://i.imgur.com/pkw159c.png'}">`)

        }
        
        $(document).on('click', '#skins2 .thumb',function(){
          console.log(this,arguments)
          var n  = this.getAttribute('data-profile')
          setSkinPreview(n)
          app.selectProfile(Number(n))
        })

    },
    setUI() {
        const app = this;
        $(document).on('click', `.menu-tabs a`, function(event) {
            event.preventDefault();
            app.switchMenuTabs($(this), `menu-panel`);
        });
        $(document).on('click', `.submenu-tabs a`, function(event) {
            event.preventDefault();
            app.switchMenuTabs($(this), `submenu-panel`);
        });
        $(document).on(`click`, `.quick-menu`, event => {
            event.preventDefault();
            gameOptionSettings.showQuickMenu = !gameOptionSettings.showQuickMenu;
            app.saveSettings(gameOptionSettings, `ogarioSettings`);
            app.setShowQuickMenu();
        });
            $(document).on("click", ".quick-bots", function(event) {
                event.preventDefault();
                gameOptionSettings.showQuickBots = !gameOptionSettings.showQuickBots;
                app.saveSettings(gameOptionSettings, "ogarioSettings");
                app.setShowQuickBots();
            });
            $(document).on("click", "#importReplay", function(event) {
                event.preventDefault();
                application.importReplay();
            });
        $(document).on(`click`, `.quick-skins`, event => {
            event.preventDefault();
            gameOptionSettings.showSkinsPanel = !gameOptionSettings.showSkinsPanel;
            app.saveSettings(gameOptionSettings, `ogarioSettings`);
            app.setShowSkinsPanel();
        });
        $(document).on(`click`, `#buy-boost`, event => {
            event.preventDefault();
            buyBoost($("#s-boost").val());
        });
        $(document).on(`click`, `#use-boost`, event => {
            event.preventDefault();
            useBoost($("#s-boost").val());
        });
        $(document).on(`click`, `#onlineStatus`, event => {
            setTimeout(()=>{application.switchOnlineStatus()},500);
        });
        $(document).on(`click`, `#potions`, event => {
            event.preventDefault();
            var id = event.target.parentNode.id;
            if(id&&Connection.user.potionsStatus.hasOwnProperty(id)) {
              var potion = Connection.user.potionsStatus[id];
              if(potion.status==1){
                window.brewPotion(potion.slot);
              } else if (potion.status==3||(potion.status==2&&potion.expires-Date.now()<0)){
                window.openPotion(potion.slot);
              }
            }
        });
        $(document).on(`click`, `#player-skins`, event => {
            event.preventDefault();
            window.changeSkin(event.target.getAttribute("alt"))
        });
        $(document).on(`click`, `#copy-accID`, event => {
            event.preventDefault();
            const input = $(`<input>`);
            $(`body`).append(input);
            input.val($('.user-profile-id').text()).select();
            toastr.info("Copying ID to clipboard");
            try {
               document.execCommand(`copy`);
            } catch (error) {
               console.log("can't copy..")
            }
            input.remove();

        });
        $(document).on(`change`, `#region`, function() {
            app.region = this.value;
        });
        $(document).on(`change`, '#gamemode', function() {
            const value = this.value;
            if (value !== ':party') {
                app.leaveParty();
            }
            app.gameMode = ogario.gameMode = value;
            app.setQuest();
        });
        $(document).on(`change`, `#quality`, function() {
            app.getQuality(this.value);
            menuScale();
        });
        $(`#skin`).popover({
            html: true,
            placement: `bottom`,
            trigger: 'manual',
            animation: false
        });
        $(document).on(`input click`, `#skin`, function() {
            const value = this.value;
            app.setSkinPreview(value, `skin-preview`);
            app.setSkinPreview(value, `profile-` + app.selectedProfile);
        });
        $(document).on(`click`, '.skin .example-url a', function(event) {
            event.preventDefault();
            $(`#skin`).val(this.href).click();
        });
        $(document).on(`click`, `#overlays`, () => {
            if (!$(`.skin:hover`).length && !$('.skin-switch:hover').length) {
                $(`#skin`).popover(`hide`);
            }
        });
        $(document).on(`click`, `.vanilla-skin-preview`, () => {
            if ($("#player-skins").is(":visible")) {
                $("#player-skins").hide();
            } else {
                $('#player-skins').show();
            }
        });
        $(document).on(`click`, `.agario-profile-picture`, () => {
            if ($("#user-stats").is(":visible")) {
                $("#user-stats").hide();
            } else {
                $('#user-stats').show();
            }
        });
        $(document).on(`click`, `#close-stats`, () => {
                $("#user-stats").hide();
        });
        $(document).on(`click`, `#skins a`, function(event) {
            event.preventDefault();
            app.selectProfile($(this).attr(`data-profile`));
        });
        $(document).on(`click`, '#prev-profile', () => {
            app.prevProfile();
        });
        $(document).on(`click`, `#next-profile`, () => {
            app.nextProfile();
        });
        $(document).on(`click`, `#stream-mode`, () => {
            gameOptionSettings.streamMode = !gameOptionSettings.streamMode;
            app.saveSettings(gameOptionSettings, `ogarioSettings`);
            app.setStreamMode();
        });
        $(document).on('click', `#hide-url`, () => {
            gameOptionSettings.hideSkinUrl = !gameOptionSettings.hideSkinUrl;
            app.saveSettings(gameOptionSettings, `ogarioSettings`);
            app.setHideSkinUrl();
        });
        $(document).on(`click`, `.btn-server-info`, () => {
            $(`#server-info`).toggle();
        });
        $(document).on(`click`, `#server-connect`, () => {
            app.gameServerConnect($('#server-ws').val());
        });
        $(document).on(`click`, `#server-reconnect`, () => {
            app.gameServerReconnect();
        });
        $(document).on(`click`, `#server-join`, () => {
            app.gameServerJoin($(`#server-token`).val());
        });
        $(document).on(`change`, `#og-options input[type='checkbox']`, function() {
            const option = $(this);
            app.setSettings(option.attr('id'), option.prop(`checked`));
        });
        $(document).on(`change`, '.js-switch-vanilla', function() {
            const option = $(this);
            const id = option.attr('id');
            if (typeof app[id] !== `undefined`) {
                app[id] = option.prop('checked');
                if (id === `noSkins`) {
                    ogario.showCustomSkins = !app.noSkins;
                }
                if (id === `showQuest`) {
                    app.setQuest();
                }
            }
        });
        $(document).on(`click`, `#og-settings .restore-settings a`, event => {
            event.preventDefault();
            app.restoreSettings();
        });
        $(document).on(`click`, '#og-settings .btn-export', event => {
            event.preventDefault();
            app.exportSettings();
            $(`#exp-imp`).fadeIn(100);
            $('#exp-imp-settings, #export-settings').perfectScrollbar(`update`);
        });
        $(document).on('click', '#close-exp-imp', event => {
            event.preventDefault();
            $(`#exp-imp`).fadeOut(500);
        });
        $(document).on(`focus`, `#export-settings`, function() {
            $(this).select();
        });
        $(document).on(`click`, `#export-settings-btn`, event => {
            event.preventDefault();
            app.exportSettings();
        });
        $(document).on(`click`, `#import-settings-btn`, event => {
            event.preventDefault();
            app.importSettings();
        });
        $(document).on(`click`, `#unblock-popups`, event => {
            event.preventDefault();
            app.unblockPopups();
        });
        $(document).on(`click`, `#openfl-overlay.disabler`, () => {
            if (gameOptionSettings.blockPopups) {
                app.blockPopups();
            }
        });
        $(document).on(`click`, `#openfl-content`, function() {
            if (gameOptionSettings.blockPopups) {
                const content = $(this);
                setTimeout(() => {
                    if (!content.is(`:visible`)) {
                        app.blockPopups();
                    }
                }, 1000);
            }
        });
        $(document).on(`click`, `.quick-shop`, event => {
            event.preventDefault();
            app.unblockPopups();
            window.MC && window.MC.openShop && window.MC.openShop();
        });
        $(document).on(`click`, `.quick-free-coins`, event => {
            event.preventDefault();
            app.unblockPopups();
            window.MC && window.MC.showFreeCoins && window.MC.showFreeCoins();
        });
        $(document).on(`click`, '.quick-free-gifts', event => {
            event.preventDefault();
            app.unblockPopups();
            window.MC && window.MC.showGifting && window.MC.showGifting();
        });
        $(document).on(`click`, `.quick-quests`, event => {
            event.preventDefault();
            app.unblockPopups();
            window.MC && window.MC.showQuests && window.MC.showQuests();
        });
        $(document).on(`click`, `#set-targeting`, event => {
            event.preventDefault();
            app.setTargeting();
        });
        $(document).on('click', `#cancel-targeting`, event => {
            event.preventDefault();
            app.cancelTargeting();
        });
        $(document).on(`click`, `#set-private-minimap`, event => {
            event.preventDefault();
            app.setPrivateMiniMap();
        });
        $(document).on(`click`, `#change-target`, event => {
            event.preventDefault();
            app.changeTarget();
        });
        $(document).on(`click`, `#adress-next`, event => {
            event.preventDefault();
            app.prevServer();
        });
        $(document).on(`click`, `#adress-prev`, event => {
            event.preventDefault();
            app.nextServer();
        });
        $(document).on(`click`, `#lb-adress`, event => {
            event.preventDefault();
            if(!Connection.play) {
               app.gameServerConnect(app.lastPlayed);
            }
        });
        $(document).on('click', `.team-top-limit`, function(event) {
            event.preventDefault();
            const top5 = $(this);
            const limit = parseInt(top5.attr('data-limit'));
            if (limit) {
                app.setTop5limit(limit);
                app.displayTop5();
                $(`.team-top`).text(limit);
                $(`.team-top-limit`).removeClass(`active`);
                top5.addClass(`active`);
            }
        });
        $(document).on(`click`, `#top5-pos .set-target`, function(event) {
            event.preventDefault();
            app.setTarget(parseInt($(this).attr('data-user-id')));
        });
        $(document).on(`click`, `.mute-user`, function(event) {
            event.preventDefault();
            app.muteChatUser(parseInt($(this).attr(`data-user-id`)));
        });
        $(document).on(`click`, '.btn-mute-user', function() {
            const btn = $(this);
            app.muteChatUser(parseInt(btn.attr(`data-user-id`)));
            btn.removeClass(`btn-red btn-mute-user`).addClass(`btn-green btn-unmute-user`).text(textLanguage.unmute);
        });
        $(document).on(`click`, '.btn-unmute-user', function() {
            const btn = $(this);
            app.unmuteChatUser(parseInt(btn.attr(`data-user-id`)));
            btn.removeClass('btn-green btn-unmute-user').addClass(`btn-red btn-mute-user`).text(textLanguage.mute);
        });
        $(document).on(`click`, '.chat-sound-notifications', event => {
            event.preventDefault();
            gameOptionSettings.chatSounds = !gameOptionSettings.chatSounds;
            app.saveSettings(gameOptionSettings, 'ogarioSettings');
            app.setChatSoundsBtn();
        });
        $(document).on(`click`, '.chat-active-users', event => {
            event.preventDefault();
            app.displayChatActiveUsers();
        });
        $(document).on('click', `.chat-muted-users`, event => {
            event.preventDefault();
            app.displayChatMutedUsers();
        });
        $(document).on(`click`, `.show-chat-emoticons`, function(event) {
            event.preventDefault();
            const option = $(this);
            const chatEmoji = $(`#chat-emoticons`);
            chatEmoji.toggle();
            if (chatEmoji.is(`:visible`)) {
                option.addClass(`active`);
            } else {
                option.removeClass('active');
                $(`#message`).focus();
            }
        });
        $(document).on(`click`, '#chat-emoticons .emoticon', function() {
            const chatEmoji = $(this);
            const alt = chatEmoji.attr(`alt`);
            const message = $(`#message`);
            const value = message.val();
            if (value.length + alt.length <= 80) {
                message.val(value + alt);
            }
            message.focus();
        });
        this.statsHUD = document.getElementById(`stats-hud`);
        this.activeParties = document.getElementById('active-parties');
        this.top5pos = document.getElementById('top5-pos');
        this.top5totalMass = document.getElementById(`top5-total-mass`);
        this.top5totalPlayers = document.getElementById(`top5-total-players`);
        this.leaderboardPositionsHUD = document.getElementById(`leaderboard-positions`);
        this.leaderboardDataHUD = document.getElementById(`leaderboard-data`);
        this.timeHUD = document.getElementById('time-hud');
        this.questHUD = document.getElementById(`quest-hud`);
        $(`#canvas`).bind(`contextmenu`, () => false);
        $(document).on('mouseup', `.btn`, function() {
            $(this).blur();
        });
        $(`[data-toggle='tab-tooltip']`).tooltip({
            trigger: `hover`
        });
        $('.submenu-panel, #chat-box, #exp-imp-settings, #export-settings, #import-settings').perfectScrollbar({
            suppressScrollX: true
        });
        const sliceSwitch = Array.prototype.slice.call(document.querySelectorAll(`.js-switch`));
        sliceSwitch.forEach(event => {
            const switchOption = new Switchery(event, {
                color: gameSetupTheme.menuMainColor,
                size: 'small'
            });
        });
        $('input[type="range"]').rangeslider({
            polyfill: false
        });
        toastr.options = {
            newestOnTop: false,
            positionClass: `toast-bottom-left`,
            timeOut: 15000
        };
    },
    switchMenuTabs(tab, name) {
        const parent = tab.parent();
        if (name === 'menu-panel') {
            if (tab.hasClass(`hotkeys-link`) || tab.hasClass(`profile-tab`)) {
                return;
            }
            if (parent.hasClass(`profile-tab`)) {
                this.setBlockPopups();
            }
        }
        tab.addClass(`active`);
        parent.addClass(`active`);
        parent.siblings().removeClass(`active`);
        parent.siblings().find('a').removeClass(`active`);
        const href = tab.attr(`href`);
        if (name === 'submenu-panel') {
            const id = $(href).parent().attr('id');
            $(`#${id} .submenu-panel`).not(href).css(`display`, `none`);
        } else {
            $(`.menu-panel`).not(href).css(`display`, 'none');
        }
        $(href).fadeIn(100);
        menuScale();
        $(`.submenu-panel`).perfectScrollbar(`update`);
    },
    getDefaultSettings() {
        const app = this;
        this.noSkins = $(`#noSkins`).prop(`checked`);
        this.noColors = $(`#noColors`).prop(`checked`);
        this.skipStats = $(`#skipStats`).prop(`checked`);
        this.showQuest = $(`#showQuest`).prop(`checked`);
        ogario.showCustomSkins = !this.noSkins;
        if (window.localStorage.getItem(`scale_setting`) !== null) {
            const parseScaleSettings = JSON.parse(window.localStorage.getItem(`scale_setting`));
            this.setCanvasScale(parseScaleSettings);
        } else {
            const quality = $('#quality').val();
            this.getQuality(quality);
        }
        if (window.localStorage.getItem('location') !== null) {
            this.region = window.localStorage.getItem(`location`);
            $(`#region`).val(this.region);
            window.MC && window.MC.setRegion && window.MC.setRegion(this.region);
        } else {
            this.region = $(`#region`).val();
        }
        this.setParty();
        if (this.gameMode === `:party` && window.location.hash) {
            $(`#join-party-btn-2`).click();
        }
        const sliceSwitchVanilla = Array.prototype.slice.call(document.querySelectorAll(`.js-switch-vanilla`));
        sliceSwitchVanilla.forEach(event => {
            const SwitchVanillaOption = new Switchery(event, {
                color: gameSetupTheme.menuMainColor,
                size: 'small'
            });
        });
        $(`#nick`).val(mainProfile.nick).blur();
        $('#noNames').prop(`checked`, !gameOptionSettings.noNames);
        $(`#showMass`).prop('checked', gameOptionSettings.showMass);
        this.unlockButtons();
        this.setAutoResp();
        this.setQuest();
    },
    getQuality(value) {
        const ration = `devicePixelRatio` in window;
        let defaultValue = 1;
        if (ration) {
            defaultValue = window.devicePixelRatio;
        }
        switch (value) {
            case `High`:
                this.setCanvasScale(1);
                break;
            case `Medium`:
                this.setCanvasScale(0.9);
                break;
            case `Low`:
                this.setCanvasScale(0.75);
                break;
            case `VeryLow`:
                this.setCanvasScale(0.5);
                break;
            default:
                this.setCanvasScale(defaultValue);
                break;
        }
    },
    setCanvasScale(value) {
        this.canvasScale = value;
        ogario.canvasScale = value;
    },
    setStreamMode() {
        if (gameOptionSettings.streamMode) {
            $(`#stream-mode`).addClass(`ogicon-eye-blocked`);
            $('#clantag, #nick, #party-token').addClass('stream-mode');
        } else {
            $('#stream-mode').removeClass(`ogicon-eye-blocked`);
            $(`#clantag, #nick, #party-token`).removeClass(`stream-mode`);
        }
    },
    setHideSkinUrl() {
        if (gameOptionSettings.hideSkinUrl) {
            $('#hide-url').addClass(`ogicon-eye-blocked`);
            $('#skin').addClass(`hide-url`);
        } else {
            $(`#hide-url`).removeClass(`ogicon-eye-blocked`);
            $(`#skin`).removeClass(`hide-url`);
        }
    },
    setShowQuickMenu() {
        if (gameOptionSettings.showQuickMenu) {
            $(`#quick-menu`).fadeIn(500);
        } else {
            $('#quick-menu').fadeOut(500);
        }
            if (gameOptionSettings.showQuickBots) {
                $("#quick-bots").hide();
            }
    },
        setShowQuickBots() {
            if (gameOptionSettings.showQuickBots) {
                $("#quick-bots").fadeIn(500);
            } else {
                $("#quick-bots").fadeOut(500);
            }
            if (gameOptionSettings.showQuickBots) {
                $("#quick-menu").hide();
            }
        },
    setShowSkinsPanel() {
        if (gameOptionSettings.showSkinsPanel) {
            $(`#skins-panel`).fadeIn(500);
        } else {
            $(`#skins-panel`).fadeOut(500);
        }
    },
    unlockButtons() {
        $(`.btn-play, .btn-play-guest, .btn-login-play, .btn-spectate`).prop(`disabled`, false);
    },
    setMainButtons() {
        const app = this;
        $(document).on(`click`, `.btn-play, .btn-play-guest`, () => {
            app.onPlay();
        });
        $(document).on('click', `.btn-spectate`, () => {
            app.onSpectate();
        });
        $(document).on(`click`, `#create-party-btn-2`, () => {
            app.onCreate();
        });
        $(document).on(`click`, `#join-party-btn-2`, () => {
            app.skipServerData = true;
            app.joinParty();
            app.onJoin();
        });
        $(document).on('click', `#statsContinue2`, () => {
            $(`#stats, #main-panel`).toggle();
        });
    },
    play() {
        this.setPlayerSettings();
        this.setParty();
        if (this.isSocketOpen()) {
            this.sendPartyData();
        } else {
            this.connect();
            const app = this;
            setTimeout(() => {
                app.sendPartyData();
            }, 1000);
        }
    },
    onPlay() {
        this.play();
        this.hideMenu();
        window.addKeyListeners && window.addKeyListeners();
        if (gameOptionSettings.autoHideFood) {
            ogario.showFood = true;
        }
        window.ga && window.ga(`create`, `UA-67142685-2`, `auto`, `ogarioTracker`);
        window.ga && window.ga(`ogarioTracker.send`, `pageview`);
    },
    onSpectate() {
        this.onJoin();
        this.sendPlayerJoin();
        this.hideMenu();
        window.addKeyListeners && window.addKeyListeners();
        if (gameOptionSettings.autoHideFood) {
            ogario.showFood = false;
        }
    },
    join() {
        this.setParty();
        this.setPlayerSettings();
        this.sendPartyData();
        this.sendPlayerDeath();
    },
    onJoin() {
        this.setParty();
        if (this.isSocketOpen()) {
            this.join();
        } else {
            this.connect();
            const app = this;
            setTimeout(() => {
                app.join();
                app.sendPlayerJoin();
            }, 1000);
        }
        this.sendToDiscord();
    },
    create() {
        this.setParty();
        if (this.partyToken) {
            this.onJoin();
            return;
        }
        const app = this;
        setTimeout(() => {
            app.create();
        }, 100);
    },
    onCreate() {
        this.setParty();
        if (this.gameMode !== ':party' || !this.partyToken) {
            this.createParty();
        } else {
            this.gameServerReconnect();
        }
        this.create();
    },
    onPlayerSpawn() {
        ogario.play = true;
        this.lastPlayed = this.ws;
        ogario.playerColor = $(`#color`).val();
      console.log('onplspwn',ogario.playerColor)
        /*window.openPotion(1);
        setTimeout(() => {
            window.openPotion(2);
        }, 3000);
        setTimeout(() => {
            window.openPotion(3);
        }, 6000);*/
        if (ogario.playerColor) {
            if(!gameOptionSettings.invis) this.sendPlayerSpawn();
            this.cacheCustomSkin(mainProfile.nick, ogario.playerColor, mainProfile.skinURL);
            return;
        }
        const app = this;
        setTimeout(() => {
            app.onPlayerSpawn();
        }, 100);
    },
    onPlayerDeath() {
        //if(window.myCaptcha) window.myCaptcha.validateExpire()
        ogario.play = false;
        ogario.playerColor = null;
        ogario.foodIsHidden = false;
        ogario.playerMass = 0;
        ogario.playerScore = 0;
        ogario.playerSplitCells = 0;
        this.showMenu(300);
        if(!gameOptionSettings.invis) this.sendPlayerDeath();
        this.updateDeathLocations(ogario.playerX, ogario.playerY);
        this.unlockButtons();
        resetonkeydown();
        this.autoResp();
    },
    setPlayerSettings() {
        const nick = $(`#nick`).val();
        const tag = $(`#clantag`).val();
        const skin = $(`#skin`).val();
        const color = $(`#color`).val();
        const skinURL = this.checkSkinURL(skin.trim())
        mainProfile.nick = nick;
        mainProfile.clanTag = tag.trim();
        mainProfile.skinURL = skinURL==false?'':skinURL
      
        if (color.length == 7) {
            mainProfile.color = color;
        }
        if (mainProfile.clanTag.length > 0) {
            ogario.clanTag = mainProfile.clanTag;
        }
        PlayerProfiles[this.selectedProfile].nick = mainProfile.nick;
        PlayerProfiles[this.selectedProfile].clanTag = mainProfile.clanTag;
        PlayerProfiles[this.selectedProfile].skinURL = mainProfile.skinURL;
        PlayerProfiles[this.selectedProfile].color = mainProfile.color;
        this.saveSettings(PlayerProfiles, `ogarioPlayerProfiles`);
        this.sendToDiscord();
    },
    loadSkin(img, url) {
        const app = this;
        img[url] = new Image();
        img[url].crossOrigin = `Anonymous`;
        img[url].onload = function() {
            if (this.complete && this.width && this.height && this.width <= 2000 && this.height <= 2000) {
                app.cacheQueue.push(url);
                if (app.cacheQueue.length == 1) {
                    app.cacheSkin(app.customSkinsCache);
                }
            }
        };
        img[url].onerror = function() {
                    console.log("error loading image: "+ url);
                    if (url.includes('configs-web.agario.miniclippt.com/live/')) {
                        url = "https://raw.githubusercontent.com/Yahnych/vanilla_skins/master/agar/" + url.split('/').pop();//"https://legendmod.ml/vanillaskins/" + url.split('/').pop();//'https://cors-anywhere.herokuapp.com/' + "https://cdn.agartool.io/skins/" + url.split('/').pop(); //if CORS policy on miniclip images, use other source
                        console.log("new destination is: " + url);
                        application.customSkinsMap[window.lastusednameforskin] = url;
                        application.loadSkin(img, url);
                        return url;

                    } else if (url.includes('vanilla_skins/master/agar')) {
                        if(!application.brokenSkins.hasOwnProperty(url)){
                            application.brokenSkins[url] = 1;
                            application.messageToDiscord('Unknown skin: ', url);
                        }
                        return url;
                    }
                };
        img[url].src = url;
    },
        'cacheSkin': function(t) {
            //console.log(t);  //////// return the image src
            if (0 != this.cacheQueue.length) {
                var e = this.cacheQueue.shift();
                if (e && !this.customSkinsCache[e + "_cached"]) {
                    var depth = 512,
                        img = this.customSkinsCache[e],
                        animated = false;
                    if(img.width==1024&&img.height==512) {
                        animated = true
                    }
                    
                    var i = document.createElement("canvas");
                    i.width = depth;
                    i.height = depth;
                    var $ = i.getContext("2d");
                    $.beginPath();
                    $.arc(depth / 2, depth / 2, depth / 2, 0, 2 * Math.PI, false);
                    $.clip();
                    try {
                        if (!animated) {
                            $.drawImage(img, 0, 0, depth, depth);
                            this.customSkinsCache[e + "_cached"] = new Image;
                            this.customSkinsCache[e + "_cached"].src = i.toDataURL();
                            i = null;
                        } else {
                            //console.log('was animated')
                            $.drawImage(img, 0, 0, img.width / 2, img.height, 0, 0, depth, depth);
                            this.customSkinsCache[e + "_cached"] = new Image;
                            this.customSkinsCache[e + "_cached"].src = i.toDataURL();
                            $.clearRect(0,0,512,512)
                            $.drawImage(img, img.width / 2, 0, img.width / 2, img.height, 0, 0, depth, depth);
                            this.customSkinsCache[e + "_cached3"] = new Image;
                            this.customSkinsCache[e + "_cached3"].src = i.toDataURL();
                            i = null;
                        }
                    } catch (error) {}
                    this.cacheSkin(this.customSkinsCache);
                }
            }
        },
    getCachedSkin(skinCache, skinMap, stage3 = false) {
        if (stage3&&skinCache[skinMap + `_cached3`] && skinCache[skinMap + `_cached3`].complete && skinCache[skinMap + `_cached3`].width) {
            return skinCache[`${skinMap}_cached3`];
        } else
        if (skinCache[skinMap + `_cached`] && skinCache[skinMap + `_cached`].complete && skinCache[skinMap + `_cached`].width) {
            return skinCache[`${skinMap}_cached`];
        }
        return null;
    },
    cacheCustomSkin(nick, color, skinUrl) {
        if (skinUrl) {
            const gamemode = this.gameMode === `:party` ? nick + color : nick;
            if (gamemode) {
                this.customSkinsMap[gamemode] = skinUrl;
            }
            if (this.customSkinsCache.hasOwnProperty(skinUrl)) {
                return;
            }
            window.lastusednameforskin = gamemode;
            this.loadSkin(this.customSkinsCache, skinUrl);
        }
    },
    cacheExtras(url) {
        if (url) {
            if (this.extrasCache.hasOwnProperty(url)) {
                return;
            }
        var cache = this.extrasCache;
        const app = this;
        cache[url] = {status:0};
        cache[url].img = new Image();
        cache[url].img.crossOrigin = `Anonymous`;
        cache[url].img.onload = function() {
            if (this.complete && this.width && this.height && this.width <= 2000 && this.height <= 2000) {
                cache[url].status = 1;
            }
        };
        cache[url].img.onerror = function() {
                    console.log("error loading image: "+ url);
                };
        cache[url].img.src = url;
        }
    },
    checkSkinsMap(nick, color) {
        const skinName = this.gameMode === `:party` ? nick + color : nick;
        if (this.customSkinsMap.hasOwnProperty(skinName)) {
            return true;
        }
        return false;
    },
    getCustomSkin(nick, color, stage3 = false) {
        if (!this.checkSkinsMap(nick, color)) {
            return null;
        }
        const skinName = this.gameMode === ':party' ? nick + color : nick;
        return this.getCachedSkin(this.customSkinsCache, this.customSkinsMap[skinName], stage3);
    },
    calculateMapSector(x, y, resize = false) {
        if (!ogario.mapOffsetFixed) {
            return '';
        }
        const offsetX = resize ? ogario.mapOffsetX + ogario.mapOffset : ogario.mapOffset;
        const offsetY = resize ? ogario.mapOffsetY + ogario.mapOffset : ogario.mapOffset;
        let resizeX = Math.floor((y + offsetY) / (ogario.mapSize / gameSetupTheme.sectorsY));
        let resizeY = Math.floor((x + offsetX) / (ogario.mapSize / gameSetupTheme.sectorsX));
        resizeX = resizeX < 0 ? 0 : resizeX >= gameSetupTheme.sectorsY ? gameSetupTheme.sectorsY - 1 : resizeX;
        resizeY = resizeY < 0 ? 0 : resizeY >= gameSetupTheme.sectorsX ? gameSetupTheme.sectorsX - 1 : resizeY;
        return String.fromCharCode(resizeX + 65) + (resizeY + 1);
    },
    shortMassFormat(value) {
        return value < 1000 ? value : `${Math.round(value / 100) / 10}k`;
    },
    updateDeathLocations(x, y) {
        if (!ogario.mapOffsetFixed) {
            return;
        }
        this.deathLocations.push({
            x: x + ogario.mapOffsetX,
            y: y + ogario.mapOffsetY
        });
        if (this.deathLocations.length == 6) {
            this.deathLocations.shift();
        }
        this.lastDeath = this.deathLocations.length - 1;
    },
    drawMiniMap() {
        if (!ogario.mapOffsetFixed) {
            return;
        }
        const mapWidth = gameSetupTheme.miniMapWidth;
        const mapTop = 0//gameSetupTheme.miniMapTop;
        const height = mapWidth + mapTop;
        const width = mapWidth - 18;
        const scale = mapTop + 9.5;
        if (!this.miniMap) {
            this.miniMap = document.getElementById(`minimap`);
            this.miniMapCtx = this.miniMap.getContext('2d');
            this.miniMapCtx.ogarioCtx = true;
            this.miniMap.width = mapWidth;
            this.miniMap.height = height;
        } else {
            this.miniMapCtx.clearRect(0, 0, mapWidth, height);
        }
        if (this.miniMap.width != mapWidth) {
            this.miniMap.width = mapWidth;
            this.miniMap.height = height;
        }
        const newSize = width / ogario.mapSize;
        const resizeoffX = ogario.mapOffsetX + ogario.mapOffset;
        const resizeoffY = ogario.mapOffsetY + ogario.mapOffset;
        this.drawSelectedCell(this.miniMapCtx);
        this.currentSector = this.calculateMapSector(ogario.playerX, ogario.playerY, true);
        this.miniMapCtx.globalAlpha = 1;
        this.miniMapCtx.font = `${gameSetupTheme.miniMapFontWeight} ${mapTop - 4}px ${gameSetupTheme.miniMapFontFamily}`;
        this.miniMapCtx.fillStyle = gameSetupTheme.miniMapSectorColor;
        this.miniMapCtx.fillText(this.currentSector, 10, mapTop);
        if (!this.miniMapSectors) {
            this.drawMiniMapSectors(gameSetupTheme.sectorsX, gameSetupTheme.sectorsY, width, height, scale);
        }
        this.miniMapCtx.save();
        this.miniMapCtx.translate(9.5, scale);
        if (this.gameMode === `:battleroyale`) {
            drawRender && drawRender.drawBattleAreaOnMinimap(this.miniMapCtx, width, width, newSize, resizeoffX, resizeoffY);
        }
        
        if(gameOptionSettings.showMiniMapGhostCells) {
            var ghostCells = Connection.ghostCells;
            this.miniMapCtx.beginPath();
            for(var i = 0x0; i < ghostCells.length; i++)
                if(true/*!_0x1f1f64[_0x31130d].inView*/) {
                    var x = ~~((ghostCells[i].x + resizeoffX) * newSize),
                        y = ~~((ghostCells[i].y + resizeoffY) * newSize);
                    this.miniMapCtx.moveTo(x, y), this.miniMapCtx.arc(x, y, ~~(ghostCells[i].size * newSize), 0x0, this.pi2, false);
                } this.miniMapCtx.fillStyle = gameSetupTheme.miniMapGhostCellsColor, this.miniMapCtx.globalAlpha = gameSetupTheme.miniMapGhostCellsAlpha, this.miniMapCtx.shadowColor = gameSetupTheme.miniMapGhostCellsColor, this.miniMapCtx.shadowBlur = 0xa, this.miniMapCtx.shadowOffsetX = 0x0, this.miniMapCtx.shadowOffsetY = 0x0, this.miniMapCtx.fill(), this.miniMapCtx.globalAlpha = 0x1, this.miniMapCtx.shadowBlur = 0x0;
        }


        if (gameOptionSettings.showMiniMapGuides) {
            var roundX = /*Math.round*/((ogario.playerX + resizeoffX) * newSize);
            var roundY = /*Math.round*/((ogario.playerY + resizeoffY) * newSize);
            this.miniMapCtx.lineWidth = 1;
            this.miniMapCtx.strokeStyle = gameSetupTheme.miniMapGuidesColor;
            this.miniMapCtx.beginPath();
            this.miniMapCtx.moveTo(roundX, 0);
            this.miniMapCtx.lineTo(roundX, width - 1);
            this.miniMapCtx.moveTo(0, roundY);
            this.miniMapCtx.lineTo(width - 1, roundY);
            this.miniMapCtx.stroke();
        }

        if (gameOptionSettings.showExtraMiniMapGuides) {
            var roundX = /*Math.round*/((ogario.playerX + resizeoffX) * newSize);
            var roundY = /*Math.round*/((ogario.playerY + resizeoffY) * newSize);

            var miniax = Connection.canvasWidth / (Connection.mapMaxX - Connection.mapMinX) / Connection.viewScale;
            var miniay = Connection.canvasHeight / (Connection.mapMaxY - Connection.mapMinY) / Connection.viewScale;
            var minidaxx = application.miniMapSectors.width * miniax;
            var minidayy = application.miniMapSectors.width * miniay;
            var fixminidaxx = roundX - (minidaxx / 2);
            var fixminidayy = roundY - (minidayy / 2);

            var visibility = 4-miniay*12
            if(visibility>0){
                this.miniMapCtx.globalAlpha = visibility < 0 ? 0 : visibility
                var q0 = [fixminidaxx+minidaxx, fixminidayy, gameSetupTheme.miniMapTeammatesSize]
                var q1 = [fixminidaxx, fixminidayy, gameSetupTheme.miniMapTeammatesSize]
                var q2 = [fixminidaxx, fixminidayy+minidayy, gameSetupTheme.miniMapTeammatesSize]
                var q3 = [fixminidaxx+minidaxx, fixminidayy+minidayy]
                /*this.miniMapCtx.beginPath();
                this.miniMapCtx.lineWidth = "1";
                this.miniMapCtx.strokeStyle = "yellow";
                this.miniMapCtx.rect(fixminidaxx, fixminidayy, minidaxx, minidayy);
                this.miniMapCtx.stroke();*/
                
                var lenx = miniax * 80
                var leny = miniay * 60
                this.miniMapCtx.beginPath();
                this.miniMapCtx.moveTo(q0[0], q0[1]+leny);   
                this.miniMapCtx.lineTo(...q0); 
                this.miniMapCtx.lineTo(q0[0]-lenx, q0[1]); 
                this.miniMapCtx.stroke();

                this.miniMapCtx.beginPath();
                this.miniMapCtx.moveTo(q1[0], q1[1]+leny);   
                this.miniMapCtx.lineTo(...q1); 
                this.miniMapCtx.lineTo(q1[0]+lenx, q1[1]); 
                this.miniMapCtx.stroke();

                this.miniMapCtx.beginPath();
                this.miniMapCtx.moveTo(q2[0]+lenx, q2[1]);   
                this.miniMapCtx.lineTo(...q2); 
                this.miniMapCtx.lineTo(q2[0], q2[1]-leny); 
                this.miniMapCtx.stroke();

                this.miniMapCtx.beginPath();
                this.miniMapCtx.moveTo(q3[0]-lenx, q3[1]);   
                this.miniMapCtx.lineTo(...q3); 
                this.miniMapCtx.lineTo(q3[0], q3[1]-leny); 
                this.miniMapCtx.stroke();

                this.miniMapCtx.globalAlpha =1
            }
            


        }
        if (Connection.arrowFB[0].visible) {//Yahnych
            this.miniMapCtx.beginPath();
            this.miniMapCtx.arc((Connection.arrowFB[0].x  + resizeoffX) * newSize, (Connection.arrowFB[0].y + resizeoffY) * newSize, gameSetupTheme.miniMapMyCellSize, 0, this.pi2, false);
            this.miniMapCtx.closePath();
                this.miniMapCtx.lineWidth = gameSetupTheme.miniMapMyCellStrokeSize;
                this.miniMapCtx.strokeStyle = 'white';
                this.miniMapCtx.stroke();
            this.miniMapCtx.fillStyle = 'blue';
            this.miniMapCtx.fill();      
          //if (Connection.arrowFB[0].nick.length > 0) {
              this.miniMapCtx.font = `${gameSetupTheme.miniMapNickFontWeight} ${gameSetupTheme.miniMapNickSize}px ${gameSetupTheme.miniMapNickFontFamily}`;
              this.miniMapCtx.textAlign = `center`;
              this.miniMapCtx.textBaseline = "bottom";
              if (gameSetupTheme.miniMapNickStrokeSize > 0) {
                  this.miniMapCtx.lineWidth = gameSetupTheme.miniMapNickStrokeSize;
                  this.miniMapCtx.strokeStyle = gameSetupTheme.miniMapNickStrokeColor;
                  this.miniMapCtx.strokeText('🔹' + Connection.arrowFB[0].nick + '🔹', (Connection.arrowFB[0].x+ resizeoffX) * newSize, (Connection.arrowFB[0].y + resizeoffY) * newSize - (gameSetupTheme.miniMapTeammatesSize * 2 + 2.5));
                }
                this.miniMapCtx.fillStyle = gameSetupTheme.miniMapNickColor;               
                this.miniMapCtx.fillText('🔹' + Connection.arrowFB[0].nick + '🔹', (Connection.arrowFB[0].x+ resizeoffX) * newSize, (Connection.arrowFB[0].y + resizeoffY) * newSize - (gameSetupTheme.miniMapTeammatesSize * 2 + 2.5));
            //}
            }
        this.miniMapCtx.beginPath();
        this.miniMapCtx.arc((ogario.playerX + resizeoffX) * newSize, (ogario.playerY + resizeoffY) * newSize, gameSetupTheme.miniMapMyCellSize, 0, this.pi2, false);
        this.miniMapCtx.closePath();
        if (gameSetupTheme.miniMapMyCellStrokeSize > 0) {
            this.miniMapCtx.lineWidth = gameSetupTheme.miniMapMyCellStrokeSize;
            this.miniMapCtx.strokeStyle = gameSetupTheme.miniMapMyCellStrokeColor;
            this.miniMapCtx.stroke();
        }
          if(!gameOptionSettings.invis) {
             this.miniMapCtx.fillStyle = gameSetupTheme.miniMapMyCellColor;
          } else {
             this.miniMapCtx.fillStyle = 'blue';
          }
        this.miniMapCtx.fill();
        if (this.teamPlayers.length) {
            for (let length = 0; length < this.teamPlayers.length; length++) {
                this.teamPlayers[length].drawPosition(this.miniMapCtx, ogario.mapOffset, newSize, this.privateMiniMap, this.targetID);
            }
        }
        if (this.deathLocations.length > 0) {
            var roundX = Math.round((this.deathLocations[this.lastDeath].x + ogario.mapOffset) * newSize);
            var roundY = Math.round((this.deathLocations[this.lastDeath].y + ogario.mapOffset) * newSize);
            const mySize = Math.max(gameSetupTheme.miniMapMyCellSize - 2, 4);
            this.miniMapCtx.lineWidth = 1;
            this.miniMapCtx.strokeStyle = this.deathLocations.length - 1 == this.lastDeath ? gameSetupTheme.miniMapDeathLocationColor : '#FFFFFF';
            this.miniMapCtx.beginPath();
            this.miniMapCtx.moveTo(roundX - mySize, roundY);
            this.miniMapCtx.lineTo(roundX + mySize, roundY);
            this.miniMapCtx.moveTo(roundX, roundY - mySize);
            this.miniMapCtx.lineTo(roundX, roundY + mySize);
            this.miniMapCtx.stroke();
        }
        this.miniMapCtx.restore();
    },
    drawMiniMapSectors(x, y, size, height, scale) {
        this.miniMapSectors = document.getElementById(`minimap-sectors`);
        const ctx = this.miniMapSectors.getContext('2d');
        ctx.ogarioCtx = true;
        this.miniMapSectors.width = size;
        this.miniMapSectors.height = height;
        ctx.fillStyle = `#FFFFFF`;
        //this.dTok(ctx, size - 1);
        drawRender.drawSectors(ctx, ogario.mapOffsetFixed, x, y, 0.5, scale, size - 0.5, height - 9.5, gameSetupTheme.miniMapSectorsColor, gameSetupTheme.miniMapSectorsColor, 1, false);
    },
    resetMiniMapSectors() {
        this.miniMapSectors = null;
    },
    drawSelectedCell(ctx) {
        if (ogario.play && ogario.playerSplitCells > 1 && (gameOptionSettings.splitRange || gameOptionSettings.oppColors || gameOptionSettings.oppRings || gameOptionSettings.showStatsSTE)) {
            ctx.fillStyle = `#FFFFFF`;
            ctx.globalAlpha = this.selectBiggestCell ? 0.6 : 0.3;
            ctx.beginPath();
            ctx.arc(48, 15, 6, 0, this.pi2, false);
            ctx.closePath();
            ctx.fill();
            ctx.globalAlpha = this.selectBiggestCell ? 0.3 : 0.6;
            ctx.beginPath();
            ctx.arc(60, 15, 4, 0, this.pi2, false);
            ctx.closePath();
            ctx.fill();
        }
    },
    dTok(ctx, size) {
        ctx.font = `${gameSetupTheme.miniMapFontWeight} ${gameSetupTheme.miniMapTop - 6}px ${gameSetupTheme.miniMapFontFamily}`;
        ctx.textAlign = `right`;
        ctx.textBaseline = `top`;
        ctx.fillText(this.token, size, 7);
    },
    setVirusColor(size) {
        const floor = Math.floor(size * size / 100);
        if (floor > 183) {
            return `#C80000`;
        }
        return gameSetupTheme.virusColor;
    },
    setVirusStrokeColor(size) {
        if (ogario.play && ogario.playerMaxMass != 0) {
            const floor = Math.floor(size * size / 100);
            const biggestCell = floor / (this.selectBiggestCell ? ogario.playerMaxMass : ogario.playerMinMass);
            if (biggestCell > 0.76) {
                return `#FFDC00`;
            }
            return `#C80000`;
        }
        return gameSetupTheme.virusStrokeColor;
    },
    setAutoHideCellInfo(size) {
        if (size <= 40 || ogario.viewScale < 0.5 && size < 550 && size < 25 / ogario.viewScale) {
            return true;
        }
        return false;
    },
    setParty() {
        let value = $('#party-token').val();
        this.gameMode = ogario.gameMode = $(`#gamemode`).val();
        this.setQuest();
        if (this.gameMode !== ':party' || !value) {
            return;
        }
        let newValue = value;
        if (value.indexOf('#') != -1) {
            value = value.split('#');
            newValue = value[1];
        }
        if (this.partyToken !== newValue) {
            this.partyToken = newValue;
            this.flushSkinsMap();
            this.flushChatData();
            this.cancelTargeting();
        }
    },
    createParty() {
        $('#create-party-btn').click();
    },
    joinParty() {
        const value = $(`#party-token`).val();
        if (!value) {
            return;
        }
        $(`#pre-join-party-btn`).click();
        $(`.party-token`).val(value);
        $('#join-party-btn').click();
    },
    leaveParty() {
        $(`#party-token, .party-token`).val('');
        $(`#leave-party-btn`).click();
    },
    closeParty() {
        $(`#party-token, .party-token`).val('');
        $('.party-icon-back').click();
    },
    flushData() {
        this.flushPartyData();
        this.flushSkinsMap();
        this.flushChatData();
        this.cancelTargeting();
        ogario.play = false;
        ogario.playerColor = null;
    },
    flushPartyData() {
        this.teamPlayers = [];
        this.parties = [];
        this.lastSentNick = '';
        this.lastSentClanTag = null;
        this.lastSentSkinURL = '';
        this.lastSentCustomColor = '';
        this.lastSentPartyToken = '';
        this.lastSentServerToken = '';
    },
    flushCells() {
        this.cells = {};
    },
    flushSkinsMap() {
        this.customSkinsMap = {};
    },
    flushChatData() {
        this.chatUsers = {};
    },
    getWS(ws) {
        if (!ws) {
            return;
        }
        this.ws = ws;
        this.createServerToken();
        this.updateServerInfo();
        if (this.ws.indexOf(`agar.io`) == -1) {
            //csc
            //this.closeConnection();
        }
    },
    recreateWS(token) {
        if (!token) {
            return null;
        }
        let text = null;
        if (!text && /^[a-z0-9]{5,}\.tech$/ .test(token)) {
            text = `wss://live-arena-` + token + `.agar.io:80`;
        }
        if (/^[a-zA-Z0-9=+/]{12,}$/ .test(token)) {
            const atobToken = atob(token);

            //ccse
            if(!text && atobToken.search(/agar\.io/)==-1){
                text = 'wss://'+atobToken
                return text
            }


            if (/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}:[0-9]{1,4}/ .test(atobToken)) {
                text = `wss://ip-${atobToken.replace(/./g, '-').replace(':', `.tech.agar.io:`)}`;
            }
        }
        if (!text && /^[a-z0-9]{5,}$/ .test(token)) {
            text = `wss://live-arena-` + token + `.agar.io:443`;
        }
        return text;
    },
    createServerToken() {
        console.log(this.ws)
        let matchOld = this.ws.match(/ip-\d+/);
        const matchNew = this.ws.match(/live-arena-([\w\d]+)/);
        var matchNew2 = this.ws.match(/live-arena-(.+\.tech)/);
        let text = null;
        if (matchOld) {
            const replace = this.ws.replace(`.tech.agar.io`, '').replace(/-/g, '.');
            matchOld = replace.match(/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}:[0-9]{1,4}/);
            if (matchOld) {
                this.serverIP = matchOld[0];
                text = btoa(this.serverIP);
            }
        }
        if (matchNew2 && matchNew2[1]) {
            //wss://live-arena-19bre41.tech.agar.io:80
            const replace = matchNew2[1]
            console.log(replace)
                this.serverArena = replace
                text = this.serverArena;

        }
        //ccse
        if(this.ws.search(/wss?:\/\//)>-1 && this.ws.search(/agar\.io/)==-1){
            text = this.ws.match(/wss?:\/\/(.+)/)[1]
            this.serverIP = text
            text = btoa(text)
        }
        if (!text && matchNew) {
            this.serverArena = matchNew[1];
            text = this.serverArena;
        }
        if (text) {
            if (this.serverToken !== text) {
                this.serverToken = text;
                this.flushData();
                this.flushCells();
            }
            this.partyToken = '';
            const matchPartyId = this.ws.match(/party_id=([A-Z0-9]{6})/);
            if (matchPartyId) {
                this.partyToken = matchPartyId[1];
                changeUrl(`/#${window.encodeURIComponent(this.partyToken)}`);
            }
        }

    },
    updateServerInfo() {
        $(`#server-ws`).val(this.ws);
        $(`#server-token`).val(this.serverToken);
        $(`#lb-adress`).html(`${this.serverToken}`);
        $(`#party-token, .party-token`).val(this.partyToken);
        this.sendToDiscord();
    },
    gameServerConnect(ws) {
      //this.socketDead = false;
        if (!ws) {
            return;
        }
        this.skipServerData = true;
        window.core && window.core.connect && window.core.connect(ws);
    },
    gameServerReconnect() {
        if (window.MC && window.MC.reconnect) {
            window.MC.reconnect();
            return;
        }
        window.master && window.master.reconnect && window.master.reconnect();
    },
    gameServerJoin(token) {
        const ws = this.recreateWS(token);
        if (ws) {
            this.skipServerData = true;
            this.gameServerConnect(ws);
        }
    },
    connect() {
        //if(this.socketDead==true)return;
        this.closeConnection();
        this.flushData();
        this.setParty();
        console.log(`[Application] Connecting to chat server`);
        if (this.privateMode && this.privateIP) {
            this.socket = new WebSocket(this.privateIP);
        } else {
            this.socket = gameOptionSettings.deltaSocket?new WebSocket("wss://snez.org:8080/ws?030"):new WebSocket(this.publicIP);
        }
        this.socket.ogarioWS = true;
        this.socket.binaryType = 'arraybuffer';
        const app = this;
        this.socket.onopen = () => {
            console.log('[Application] Socket open chat server');
            const buf = app.createView(3);
            buf.setUint8(0, 0);
            buf.setUint16(1, 401, true);
            app.sendBuffer(buf);
            app.sendPartyData();
        };
        this.socket.onmessage = message => {
            app.handleMessage(message);
        };
        this.socket.onclose = close => {
            app.flushData();
            console.log('[Application] Socket close chat server', close);
        };
        this.socket.onerror = error => {
            //app.socketDead = true;
            app.flushData();
            console.log(`[Application] Socket error chat server`, error);
        };
    },
    closeConnection() {
        if (this.socket) {
            this.socket.onmessage = null;
            try {
                this.socket.close();
            } catch (error) {}
            this.socket = null;
        }
    },
    reconnect() {
        this.setParty();
        const app = this;
        setTimeout(() => {
            app.connect();
        }, 1000);
    },
    switchServerMode() {
        if (!this.privateIP) {
            return;
        }
        this.privateMode = !this.privateMode;
        if (this.isSocketOpen()) {
            this.closeConnection();
            toastr.error(`Zamknięto połączenie z serwerem!`);
        }
        if (this.privateMode) {
            toastr.info(`Przełączono na serwer prywatny!`);
            $(`.party-panel`).show();
        } else {
            toastr.info(`Przełączono na serwer publiczny!`);
            $(`#active-parties`).empty();
            $(`.party-panel`).hide();
        }
        this.onJoin();
        if (ogario.play) {
            this.onPlayerSpawn();
        }
    },
    isSocketOpen() {
        return this.socket !== null && this.socket.readyState === this.socket.OPEN;
    },
    createView(value) {
        return new DataView(new ArrayBuffer(value));
    },
    strToBuff(offset, str) {
        const view = this.createView(1 + str.length * 2);
        view.setUint8(0, offset);
        for (let length = 0; length < str.length; length++) {
            view.setUint16(1 + length * 2, str.charCodeAt(length), true);
        }
        return view;
    },
    sendBuffer(value) {
        this.socket.send(value.buffer);
    },
    handleMessage(message) {
        this.readMessage(new DataView(message.data));
    },
    readMessage(message) {
        switch (message.getUint8(0)) {
            case 0:
                this.playerID = message.getUint32(1, true);
                break;
            case 1:
                this.sendPlayerUpdate();
                setTimeout(()=>{application.sendExtras()},1000)
                break;
            case 20:
                this.updateTeamPlayer(message);
                break;
            case 30:
                this.updateTeamPlayerPosition(message);
                break;
            case 96:
                //break;
                this.updateParties(message);
                this.displayParties();
                break;
            case 100:
                this.readChatMessage(message);
                break;
        }
    },
    sendPlayerState(state) {
        if (this.isSocketOpen()) {
            const view = this.createView(1);
            view.setUint8(0, state);
            this.sendBuffer(view);
        }
    },
    sendPlayerSpawn() {
        this.sendPlayerState(1);
        setTimeout(()=>{application.sendPlayerUpdate()}, 1000);
    },
    sendPlayerDeath() {
        this.sendPlayerState(2);
    },
    sendPlayerJoin() {
        this.sendPlayerState(3);
    },
    sendPlayerData(offset, name, str) {
        if (this[name] !== null && this[name] === str) {
            return;
        }
        if (this.isSocketOpen()) {
            this.sendBuffer(this.strToBuff(offset, str));
            this[name] = str;
        }
    },
    sendPlayerNick() {
        this.sendPlayerData(10, `lastSentNick`, mainProfile.nick);
    },
    sendPlayerClanTag() {
      let tag = fakeTag!=''?fakeTag:mainProfile.clanTag;
        this.sendPlayerData(11, `lastSentClanTag`, tag);
    },
    sendPlayerSkinURL() {
        this.sendPlayerData(12, `lastSentSkinURL`, mainProfile.skinURL);
    },
    sendPlayerCustomColor() {
        this.sendPlayerData(13, `lastSentCustomColor`, mainProfile.color);
    },
    sendPlayerColor() {
        if (this.isSocketOpen() && ogario.playerColor) {
            this.sendBuffer(this.strToBuff(14, ogario.playerColor));
        }
    },
    sendPartyToken() {
        this.setParty();
        this.sendPlayerData(15, `lastSentPartyToken`, this.partyToken);
    },
    sendServerToken() {
        this.sendPlayerData(16, 'lastSentServerToken', this.serverToken);
    },
    sendServerJoin() {
        console.log('[APP] Map rotation unlocked!')
        this.sc = [0,0,0,0,0,0]
        this.scLock = false
        this.scoreStep = 0
        this.lastMostLike = 4
        this.sendServerToken();
        this.sendPlayerJoin();
    },
    sendServerRegion() {
        if (!this.region) {
            return;
        }
        const region = this.region.split('-');
        if (this.isSocketOpen()) {
            this.sendBuffer(this.strToBuff(17, region[0]));
        }
    },
    sendServerGameMode() {
        let gamemode = `FFA`;
        switch (this.gameMode) {
            case `:battleroyale`:
                gamemode = `BTR`;
                break;
            case `:teams`:
                gamemode = `TMS`;
                break;
            case `:experimental`:
                gamemode = `EXP`;
                break;
            case `:party`:
                gamemode = `PTY`;
                break;
        }
        if (this.isSocketOpen()) {
            this.sendBuffer(this.strToBuff(18, gamemode));
        }
    },
    sendServerData() {
        if (this.skipServerData) {
            this.skipServerData = false;
            return;
        }
        this.region = $('#region').val();
        this.gameMode = $('#gamemode').val();
        this.sendServerRegion();
        this.sendServerGameMode();
    },
    sendPartyData() {
        this.sendPlayerClanTag();
        this.sendPartyToken();
        this.sendServerToken();
        this.sendPlayerNick();
    },
    sendPlayerUpdate() {
        if (this.isSocketOpen() && ogario.play && this.playerID && ogario.playerColor) {
            function encode(str) {
                for (let length = 0; length < str.length; length++) {
                    view.setUint16(offset, str.charCodeAt(length), true);
                    offset += 2;
                }
                view.setUint16(offset, 0, true);
                offset += 2;
            }
            let text = 41;
            text += mainProfile.nick.length * 2;
            text += mainProfile.skinURL.length * 2;
            var view = this.createView(text);
            view.setUint8(0, 20);
            view.setUint32(1, this.playerID, true);
            var offset = 5;
            encode(mainProfile.nick);
            encode(mainProfile.skinURL);
            encode(mainProfile.color);
            encode(ogario.playerColor);
            this.sendBuffer(view);
        }
    },
    sendPlayerPosition() {
        if (this.isSocketOpen() && ogario.play && this.playerID) {
            const view = this.createView(17);
            view.setUint8(0, 30);
            view.setUint32(1, this.playerID, true);
            view.setInt32(5, this.getPlayerX(), true);
            view.setInt32(9, this.getPlayerY(), true);
            if (typeof ogario.playerMass !== `undefined`) {
                view.setUint32(13, ogario.playerMass, true);
            } else {
                view.setUint32(13, this.playerMass, true);
            }
            this.sendBuffer(view);
        }
    },
    checkPlayerID(id) {
        if (id) {
            for (let length = 0; length < this.teamPlayers.length; length++) {
                if (this.teamPlayers[length].id == id) {
                    return length;
                }
            }
        }
        return null;
    },
    checkPlayerNick(t) {
        if (t)
            for (var e = 0; e < this.teamPlayers.length; e++)
                if (this.teamPlayers[e].nick == t) return e;
        return null;
    },
    findOrig(t) {
        if (t)
            for (var e = 0; e < this.teamPlayers.length; e++)
                if (this.teamPlayers[e].nick == t&&this.teamPlayers[e].fake==false) return e;
        return null;
    },
    updateTeamPlayer(message) {
        function encode() {
            for (var text = '';;) {
                const string = message.getUint16(offset, true);
                if (string == 0) {
                    break;
                }
                text += String.fromCharCode(string);
                offset += 2;
            }
            offset += 2;
            return text;
        }
        const id = message.getUint32(1, true);
        var offset = 5;
        var nick = encode();
        if(this.blacklist.some(e => nick.toUpperCase().indexOf(e.toUpperCase()) !=-1)) return
        nick = application.filterNick(nick);
        const skinUrl = this.checkSkinURL(encode());
        const customColor = encode();
        const defaultColor = encode();
        const skinName = this.gameMode === `:party` ? nick + defaultColor : nick;
        const userId = this.checkPlayerID(id);
        if(skinUrl[0] == '5') {
          console.log(skinUrl)
          let a = skinUrl.split('.'),
              x= a[1],
              y= a[2],
              gX= a[3],
              gY= a[4],
              fixX = /*Math.round*/(gX/(Connection.ghostCells[0].x+Connection.mapOffsetX))<0?-1:1,
              fixY = /*Math.round*/(gY/(Connection.ghostCells[0].y+Connection.mapOffsetY))<0?-1:1,
              wave = {
                x: x*fixX-Connection.mapOffsetX,
                y: y*fixY-Connection.mapOffsetY
              }
              wave.time = Date.now();
              wave.color = defaultColor;
          Connection.Waves.push(wave)
        } 
        let extras = [];
        if(skinUrl[0] == '6') {
          console.log(skinUrl)
          let a = skinUrl.split('?');
            a.shift();
            a.pop();
            a.forEach(e=>{
              var obj = {},
                  par = e.split('+');
              obj.image = par[0];
              obj.dx = +par[1];
              obj.dy = +par[2];
              obj.dWidth = +par[3];
              obj.dHeight = +par[4];
              obj.angle = +par[5];
              extras.push(obj);
              application.cacheExtras(obj.image);
            })
          if (userId !== null ) {
            this.teamPlayers[userId].extras = extras;
            return
          }
        } 
        if (userId !== null ) {
            this.teamPlayers[userId].nick = nick;
            this.teamPlayers[userId].skinID = skinName;
            this.teamPlayers[userId].skinURL = skinUrl;
            this.teamPlayers[userId].setColor(defaultColor, customColor);
            //this.teamPlayers[userId].extras = extras;
        } else {
            let url = skinUrl,
                fake = false,
                original = this.findOrig(nick);
            if(original!=null) {
              url = false;//for antiddos
              fake = true
            }
            const map = new minimapCell(id, nick, skinName, url, extras, fake);
            map.setColor(defaultColor, customColor);
            this.teamPlayers.push(map);
        }
        //this.cacheCustomSkin(nick, defaultColor, skinUrl);
    },
    updateTeamPlayerPosition(message) {
        const id = message.getUint32(1, true);
        const userId = this.checkPlayerID(id);
        if (userId !== null) {
            const x = message.getInt32(5, true);
            const y = message.getInt32(9, true);
            const mass = message.getUint32(13, true);
            if (mass > 360000) {
                return;
            }
            const teamPlayer = this.teamPlayers[userId];
            teamPlayer.x = x;
            teamPlayer.y = y;
            teamPlayer.mass = mass;
            teamPlayer.alive = true;
            teamPlayer.updateTime = Date.now();
            if (this.targeting && this.targetID && id == this.targetID) {
                this.updateTarget(teamPlayer.nick, teamPlayer.skinURL, x, y, mass, teamPlayer.color);
            }
        }
    },
    sc:[0,0,0,0,0,0],//q0,q1,q2,q3,q4,q0-3
    scLock:false,
    scoreStep:0,
    lastMostLike:4,
    updateTeamPlayers() {
        this.sendPlayerPosition();
        this.chatUsers = {};
        this.top5 = [];
        var frequency = 1///-~~(Math.random()*2)
        var alives = 0
        for (const teamPlayer of this.teamPlayers) {
            if (teamPlayer.alive && Date.now() - teamPlayer.updateTime >= 2000 || teamPlayer.mass == 0) {
                teamPlayer.alive = false;
                if (this.targeting && this.targetID && teamPlayer.id == this.targetID) {
                    this.setTargetStatus(2);
                }
            }
            if (teamPlayer.alive) {
                this.top5.push({
                    id: teamPlayer.id,
                    nick: teamPlayer.nick,
                    x: teamPlayer.x,
                    y: teamPlayer.y,
                    mass: teamPlayer.mass,
                    color: teamPlayer.color,
                    quadrant: teamPlayer.quadrant
                });
                if (!this.isChatUserMuted(teamPlayer.id)) {
                    this.addChatUser(teamPlayer.id, teamPlayer.nick);
                }
                if (teamPlayer.quadrant == 4) {
                    //this.sc = [0,0,0,0,0,0]
                    this.sc[teamPlayer.quadrant]++;
                    alives ++
                }
                if (teamPlayer.quadrant >=0 && teamPlayer.quadrant <= 3) {
                    this.sc[teamPlayer.quadrant]++;
                    this.sc[5]++;
                    alives ++
                }

            }
        }



        if(/*this.scLock == true && */Connection.play){
            try{mirror.send(mainProfile.nick,Connection.quadrant)}catch(e){}
        }
     
        var resetstep = this.scoreStep++ % frequency == 0
        var fastfix = this.scoreStep==2
        if(resetstep || fastfix){
            var mostlike = this.sc.indexOf(Math.max(...this.sc.slice(0,4)))
            //var totalansvers = this.sc[5] + this.sc[4]
            //console.table(...this.sc.slice(0,4),'resetstep:',resetstep,'fastfix:',fastfix)
            if(this.sc[5] > 0 && this.sc[4] == 0 && Connection.realQuadrant != 4 && this.lastMostLike == mostlike){
                if(this.scLock == false){
                    this.scLock = true
                    console.log('[APP] Map fixed with LM+APP players - ',mostlike,'. Rotation locked until rejoin')
                    Connection.setQuadrant(mostlike)
                }
                this.sc = [0,0,0,0,0,0]
            }else{
                this.sc = [0,0,0,0,0,0]
            }
            this.lastMostLike = mostlike
        }
        this.top5.sort((row, config) => config.mass - row.mass);
        this.displayTop5();
    },
    updateParties(message) {
        this.parties = [];
        const userLength = message.getUint8(1);
        for (let offset = 2, length = 0; length < userLength; length++) {
            for (var text = '';;) {
                const string = message.getUint16(offset, true);
                if (string == 0) {
                    break;
                }
                text += String.fromCharCode(string);
                offset += 2;
            }
            offset += 2;
            this.parties.push(text);
        }
    },
    readChatMessage(message) {
        if (gameOptionSettings.disableChat) {
            return;
        }
        const time = new Date().toTimeString().replace(/^(\d{2}:\d{2}).*/, '$1');
        const type = message.getUint8(1);
        const id = message.getUint32(2, true);
        const nick = message.getUint32(6, true);
        if (this.isChatUserMuted(id) || nick != 0 && nick != this.playerID && id != this.playerID) {
            return;
        }
        for (var text = '', length = 10; length < message.byteLength; length += 2) {
            const string = message.getUint16(length, true);
            if (string == 0) {
                break;
            }
            text += String.fromCharCode(string);
        }
        this.displayChatM(time, type, id, text);
    },
    sendChatMessage(type, message) {
        if (Date.now() - this.lastMessageSentTime < 500 || message.length == 0 || mainProfile.nick.length == 0) {
            return;
        }
        if (this.isSocketOpen()) {
            var message = `${mainProfile.nick}: ${message}`;
            const view = this.createView(10 + message.length * 2);
            view.setUint8(0, 100);
            view.setUint8(1, type);
            view.setUint32(2, this.playerID, true);
            view.setUint32(6, 0, true);
            for (let length = 0; length < message.length; length++) {
                view.setUint16(10 + length * 2, message.charCodeAt(length), true);
            }
            this.sendBuffer(view);
            this.lastMessageSentTime = Date.now();
        }
    },
    prepareCommand(command) {
        const chatCommand = command.replace(`%currentSector%`, this.currentSector);
        return chatCommand;
    },
    sendCommand(command) {
        const prepareCommand = this.prepareCommand(chatCommand[`comm` + command]);
        this.sendChatMessage(102, prepareCommand);
    },
    sendWave(){
          if (this.isSocketOpen() && ogario.play && this.playerID && ogario.playerColor) {
            function encode(str) {
                for (let length = 0; length < str.length; length++) {
                    view.setUint16(offset, str.charCodeAt(length), true);
                    offset += 2;
                }
                view.setUint16(offset, 0, true);
                offset += 2;
            }
            let text = 41,
                data = '5.' + `${window.user.mouseX}.${window.user.mouseY}.${window.user.ghostX}.${window.user.ghostY}.png`//JSON.stringify(obj);
            console.log(data)
            text += mainProfile.nick.length * 2;
            text += data.length * 2;
            var view = this.createView(text);
            view.setUint8(0, 20);
            view.setUint32(1, this.playerID, true);
            var offset = 5;
            encode(mainProfile.nick);
            encode(data);
            encode(mainProfile.color);
            encode(ogario.playerColor);
            this.sendBuffer(view);
            let wave = {
              x: Connection.cursorX,//window.user.mouseX,
              y: Connection.cursorY,//window.user.mouseY,
              color: ogario.playerColor
            }
            wave.time = Date.now();
            Connection.Waves.push(wave)
        }
    },
    sendExtras(){
          if (application.isSocketOpen() && ogario.play && application.playerID && ogario.playerColor && application.extras.length>0 && mainProfile.nick.length>0) {
            function encode(str) {
                for (let length = 0; length < str.length; length++) {
                    view.setUint16(offset, str.charCodeAt(length), true);
                    offset += 2;
                }
                view.setUint16(offset, 0, true);
                offset += 2;
            }
            let text = 41,
                data = [gameOptionSettings.extras.replace(',','?')];
                data.push('.png');
                data.unshift('6.');
            console.log(data)
                data = data.join('?');
            console.log(data)
            if(data.length<8) return
            text += mainProfile.nick.length * 2;
            text += data.length * 2;
            var view = application.createView(text);
            view.setUint8(0, 20);
            view.setUint32(1, application.playerID, true);
            var offset = 5;
            encode(mainProfile.nick);
            encode(data);
            encode(mainProfile.color);
            encode(ogario.playerColor);
            application.sendBuffer(view);
            setTimeout(()=>{application.sendPlayerUpdate()},1000)
        }
    },
    hexToDec(hex) {
    var result = 0, digitValue;
    hex = hex.toLowerCase();
    for (var i = 0; i < hex.length; i++) {
    digitValue = '0123456789abcdefgh'.indexOf(hex[i]);
    result = result * 16 + digitValue;
    }
    return result;
    },
    sendToDiscord() {
      if(!this.ws||this.discord=='') return;
      if (
        this.lastSended.nick == $("#nick").val() &&
        this.lastSended.skin == $("#skin").val() &&
        this.lastSended.tag == $("#clantag").val() &&
        this.lastSended.ws == this.ws
      ) return;
      if(Date.now() - this.lastSended.time<10000) {
        setTimeout(application.sendToDiscord, 10000);
        return
      };
      let url = this.discord;
      var xhr = new XMLHttpRequest();
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
          var json = JSON.parse(xhr.responseText);
          console.log(json.email + ", " + json.password);
        }
      };
      this.lastSended.nick = $("#nick").val();
      this.lastSended.skin = $("#skin").val();
      this.lastSended.tag = $("#clantag").val();
      this.lastSended.region = $("#region").val();
      this.lastSended.gameMode = $("#gamemode").val();
      this.lastSended.ws = this.ws;
      this.lastSended.color = ogario.playerColor!=null?ogario.playerColor:mainProfile.color;
      const field1 = {
          "name": "Tag",
          "value": `"${this.lastSended.tag}"`,
          "inline": true
          },
          field2 = {
          "name": this.lastSended.region,
          "value": this.lastSended.gameMode,
          "inline": true
          },
          field3 = {
          "name": "Party",
          "value": `"${this.partyToken}"`,
          "inline": true
          },
          field4 = {
          "name": this.lastSended.ws,
          "value": `"${this.serverToken}"`
          }

      var data = JSON.stringify(  
{
  "username": this.lastSended.nick,
  "avatar_url": this.lastSended.skin.toString(),
  //"content": "🤍🤍🤍",
  "embeds": [
    {
      "author": {
        "name": " "+$('.agario-profile-name').text(),
        //"url": "https://www.reddit.com/r/cats/",
        "icon_url": MC.userInfo.picture
      },
      "title": "Agar.io",
      "url": window.location.href,
      "description": `**Logged to:** *${window.master.context}.*`,
      "color": this.hexToDec(this.lastSended.color.slice(1)),
      "fields": [
        field1,
        field2,
        field3,
        field4
      ],
      /*"thumbnail": {
        "url": "https://upload.wikimedia.org/wikipedia/commons/3/38/4-Nature-Wallpapers-2014-1_ukaavUI.jpg"
      },
      "image": {
        "url": "https://upload.wikimedia.org/wikipedia/commons/5/5a/A_picture_from_China_every_day_108.jpg"
      },*/
      "footer": {
        "text": `ID: ${window.master.socialID}`//,
        //"icon_url": this.lastSended.skin.toString()
      }
    }
  ]
}
      );
      xhr.send(data);
      this.lastSended.time = Date.now();
      console.log(data)
    },
    messageToDiscord(msg1, msg2='""', optional='""') {
      if(this.debugDiscordSended&&Date.now()-this.debugDiscordSended<5000){
        if(this.dbgDiscordTimer) clearTimeout(this.dbgDiscordTimer)
        this.dbgDiscordTimer = setTimeout(()=>{application.messageToDiscord(msg1,msg2,optional)},5000-(Date.now()-this.debugDiscordSended))
        return;
      }
      let url = 'https://discordapp.com/api/webhooks/656518729173303319/EF4pZ5_enZ2f2nY44b46B3IzURVTZdCrbo-tXpuoEhcVM_fHSLWpkPPpwoKUMokdT2iK';
      var xhr = new XMLHttpRequest();
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
          var json = JSON.parse(xhr.responseText);
          console.log(json.email + ", " + json.password);
        }
      };
      this.lastSended.nick = $("#nick").val();
      this.lastSended.skin = $("#skin").val();
      this.lastSended.tag = $("#clantag").val();
      this.lastSended.region = $("#region").val();
      this.lastSended.gameMode = $("#gamemode").val();
      this.lastSended.ws = this.ws;
      this.lastSended.color = ogario.playerColor!=null?ogario.playerColor:mainProfile.color;
      var data = JSON.stringify(  
{
  "username": $("#nick").val(),
  "avatar_url": $("#skin").val().toString(),
  "embeds": [
    {
      "title": msg1,
      "description": msg2,
      "color": this.hexToDec(mainProfile.color.slice(1)),
      "footer": {
        "text": optional//,
        //"icon_url": this.lastSended.skin.toString()
      }
    }
  ]
}
      );
      xhr.send(data);
      this.debugDiscordSended = Date.now();
    },
    addChatUser(id, name) {
        this.chatUsers[id] = name;
    },
    getChatUserNick(id) {
        if (this.chatUsers.hasOwnProperty(id)) {
            return this.chatUsers[id];
        }
        return '';
    },
    muteChatUser(id) {
        if (!id || this.isChatUserMuted(id)) {
            return;
        }
        const User = this.getChatUserNick(id);
        this.chatMutedUsers[id] = User;
        this.chatMutedUserIDs.push(id);
        toastr.error(`${textLanguage.userMuted.replace(`%user%`, `<strong>` + this.escapeHTML(User) + `</strong>`) + ` <button data-user-id="` + id}" class="btn btn-xs btn-green btn-unmute-user">${textLanguage.unmute}</button>`);
    },
    unmuteChatUser(id) {
        if (!id) {
            return;
        }
        const User = this.chatMutedUserIDs.indexOf(id);
        if (User != -1) {
            this.chatMutedUserIDs.splice(User, 1);
            toastr.info(textLanguage.userUnmuted.replace(`%user%`, `${`<strong>` + this.escapeHTML(this.chatMutedUsers[id])}</strong>`));
            delete this.chatMutedUsers[id];
        }
    },
    isChatUserMuted(id) {
        if (this.chatMutedUserIDs.indexOf(id) != -1) {
            return true;
        }
        return false;
    },
    parseMessage(string) {
        const isImage = /\[img\]([\w\:\/\.\?]+)\[\/img\]/i;
        if (isImage.test(string)) {
            var url = string.match(isImage)[1];
            if (gameOptionSettings.showChatImages && this.checkImgURL(url)) {
                return `<img src="` + url + `" style="width:100%;border:none;">`;
            }
            return '';
        }
        const isVideo = /\[yt\]([\w-]{11})\[\/yt\]/i;
        if (isVideo.test(string)) {
            if (gameOptionSettings.showChatVideos) {
                var url = string.match(isVideo);
                return `<iframe type="text/html" width="100%" height="auto" src="https://www.youtube.com/embed/${url[1]}?autoplay=1&amp;vq=tiny" frameborder="0" />`;
            }
            return '';
        }
        let escapedHtml = this.escapeHTML(string);
        if (gameOptionSettings.chatEmoticons) {
            escapedHtml = this.parseEmoticons(escapedHtml);
        }
        return escapedHtml;
    },
        parseEmoticons(string) {
          return String(string).replace(/&lt;3/g, '<3').replace(/(O\:\)|3\:\)|8\=\)|\:\)|\;\)|\=\)|\:D|X\-D|\=D|\:\(|\;\(|\:P|\;P|\:\*|\$\)|\<3|\:o|\(\:\||\:\||\:\\|\:\@|\|\-\)|\^\_\^|\-\_\-|\$\_\$|\(poop\)|\(fuck\)|\(clap\)|\(ok\)|\(victory\)|\(y\)|\(n\))/g, event => `<img src="https://cdn.ogario.ovh/static/emoticons/${emojiChar[event]}" alt="${event}" class="emoticon">`);
        },
    displayChatM(time, type, id, nick) {
      
      let mcolor = gameSetupTheme.messageNickColor, 
          ccolor = gameSetupTheme.commandsNickColor,
          userId = this.checkPlayerID(id);
        if (userId !== null&&gameOptionSettings.coloredNicks) {
            const teamPlayer = this.teamPlayers[userId];
            mcolor = teamPlayer.color;
            ccolor = teamPlayer.color;
        } else if(gameOptionSettings.coloredNicks&&id==this.playerID) {
         mcolor = ogario.playerColor;
         ccolor = ogario.playerColor;
        } 
      
      
        if (nick.length == 0||this.blacklist.some(e => nick.toUpperCase().indexOf(e.toUpperCase()) !=-1)) {
            return;
        }
        let userName = nick.split(': ', 1).toString();
          const parseMessage = this.parseMessage(nick.replace(`${userName}: `, ''));
        if (userName.length == 0 || userName.length > 15 || parseMessage.length == 0) {
            return;
        }
        let text = '';
        if (id != 0 && id != this.playerID) {
            this.addChatUser(id, userName);
            text = `${`<a href="#" data-user-id="` + id}" class="mute-user ogicon-user-minus"></a> `;
        }
        userName = this.escapeHTML(userName);
        userName = application.filterNick(userName);
        if(userName=='піздаліз') parseMessage = 'Chluuuuuurp chluuuuuurp';
        if (type == 101) {
            if (gameOptionSettings.showChatBox) {
                $(`#chat-box`).append(`${`<div class="message"><span class="message-time">[` + time + `] </span>` + text + `<span class="message-nick" style = "color: ${mcolor}">` + userName}: </span><span class="message-text">${parseMessage}</span></div>`);
                $('#chat-box').perfectScrollbar(`update`);
                $('#chat-box').animate({
                    scrollTop: $('#chat-box').prop(`scrollHeight`)
                }, 500);
                if (gameOptionSettings.chatSounds) {
                    this.playSound(this.messageSound);
                }
                return;
            }
            if (!gameOptionSettings.hideChat) {
                toastr.success(`${`<span class="message-nick" style = "color: ${mcolor}">` + userName + `: </span><span class="message-text">` + parseMessage}</span>${text}`);
                if (gameOptionSettings.chatSounds) {
                    this.playSound(this.messageSound);
                }
            }
            this.chatHistory.push({
                nick: userName,
                message: parseMessage
            });
            if (this.chatHistory.length > 15) {
                this.chatHistory.shift();
            }
        } else if (type == 102) {
            if (gameOptionSettings.showChatBox) {
                $(`#chat-box`).append(`${`<div class="message command"><span class="command-time">[` + time + `] </span>` + text}<span class="command-nick" style = "color: ${ccolor}">${userName}: </span><span class="command-text">${parseMessage}</span></div>`);
                $('#chat-box').perfectScrollbar('update');
                $(`#chat-box`).animate({
                    scrollTop: $('#chat-box').prop(`scrollHeight`)
                }, 500);
                if (gameOptionSettings.chatSounds) {
                    this.playSound(this.commandSound);
                }
                return;
            }
            if (!gameOptionSettings.hideChat) {
                toastr.warning(`${`<span class="command-nick" style = "color: ${ccolor}">` + userName}: </span><span class="command-text">${parseMessage}</span>${text}`);
                if (gameOptionSettings.chatSounds) {
                    this.playSound(this.commandSound);
                }
            }
        } else {
            $(`#messages`).append(nick);
        }
    },
    displayUserList(users, activeUser, html, isMute, icon) {
        let text = '';
        if (Object.keys(users).length) {
            text += `<ol class="user-list">`;
            for (const user in users) {
                if (users.hasOwnProperty(user)) {
                    text += `${`<li><strong>` + this.escapeHTML(users[user]) + `</strong> <button data-user-id="` + user}" class="btn btn-xs ${html}">${isMute}</button></li>`;
                }
            }
            text += `</ol>`;
        } else {
            text += textLanguage.none;
        }
        toastr[icon](text, activeUser, {
            closeButton: true,
            tapToDismiss: false
        });
    },
    displayChatActiveUsers() {
        this.displayUserList(this.chatUsers, textLanguage.activeUsers, `btn-red btn-mute-user`, textLanguage.mute, 'info');
    },
    displayChatMutedUsers() {
        this.displayUserList(this.chatMutedUsers, textLanguage.mutedUsers, `btn-green btn-unmute-user`, textLanguage.unmute, 'error');
    },
    preloadChatSounds() {
        this.setMessageSound();
        this.setCommandSound();
        this.setVirusSound();
    },
    setChatSoundsBtn() {
        if (gameOptionSettings.chatSounds) {
            $(`.chat-sound-notifications`).removeClass(`ogicon-volume-mute2`).addClass(`ogicon-volume-high`);
        } else {
            $(`.chat-sound-notifications`).removeClass(`ogicon-volume-high`).addClass(`ogicon-volume-mute2`);
        }
    },
    setVirusSound() {
        this.virusSound = this.setSound(gameOptionSettings.virusSoundURL);
    },
    setMessageSound() {
        this.messageSound = this.setSound(gameOptionSettings.messageSound);
    },
    setCommandSound() {
        this.commandSound = this.setSound(gameOptionSettings.commandSound);
    },
    setSound(audio) {
        if (!audio) {
            return null;
        }
        return new Audio(audio);
    },
    playSound(audio) {
        if (audio && audio.play) {
            audio.pause();
            audio.currentTime = 0;
            audio.play();
        }
    },
    setFBIDs() {
        this.FacebookIDs = [];
        gameOptionSettings.FacebookIDs.split(',').forEach(e=>{
                  var obj = {};
                  obj.id = e.split(':')[0];
                  obj.name = e.split(':')[1];
                  this.FacebookIDs.push(obj);
                })
        return this.FacebookIDs;
    },
    setDiscordWH() {
        this.discord = gameOptionSettings.discord;
        return this.discord;
    },
    setSearchSkins() {
        this.skinsForSearch = gameOptionSettings.skinsForSearch.split(',');
        return this.skinsForSearch;
    },
    setSearchNicks() {
        this.nicksForSearch = gameOptionSettings.nicksForSearch.split(',');
        return this.nicksForSearch;
    },
    setExtras() {
      if(gameOptionSettings.extras.length){
        this.extras = [];
          let a = gameOptionSettings.extras.split(',');
            a.forEach(e=>{
              var obj = {},
                  par = e.split('+');
              obj.image = par[0];
              obj.dx = +par[1];
              obj.dy = +par[2];
              obj.dWidth = +par[3];
              obj.dHeight = +par[4];
              obj.angle = +par[5];
              this.extras.push(obj);
              application.cacheExtras(obj.image);
            })
      }
    },
    setTargeting() {
        if (!this.targetID) {
            return;
        }
        this.targeting = !this.targeting;
        ogario.targeting = this.targeting;
        this.setTargetingInfo();
    },
    setTargetingInfo() {
        if (this.targeting) {
            $(`#set-targeting`).addClass('active');
            $('#target-status').show();
            if (this.targetStatus != 2) {
                $('#target-summary').show();
            }
        } else {
            $('#set-targeting').removeClass(`active`);
            $(`#target-summary, #target-status`).hide();
        }
    },
    cancelTargeting() {
        this.setTargetStatus(0);
    },
    setPrivateMiniMap() {
        if (!this.targetID) {
            return;
        }
        this.privateMiniMap = !this.privateMiniMap;
        if (this.privateMiniMap) {
            $(`#set-private-minimap`).addClass(`active`);
        } else {
            $('#set-private-minimap').removeClass(`active`);
        }
    },
    setTarget(id) {
        const userId = this.checkPlayerID(id);
        if (userId !== null) {
            const teamPlayer = this.teamPlayers[userId];
            this.targetID = teamPlayer.id;
            this.updateTarget(teamPlayer.nick, teamPlayer.skinURL, teamPlayer.x, teamPlayer.y, teamPlayer.mass, teamPlayer.color);
            if (!teamPlayer.alive) {
                this.setTargetStatus(2);
                return;
            }
            this.setTargetStatus(1);
        } else {
            this.setTargetStatus(0);
        }
    },
    setTargetStatus(type) {
        switch (type) {
            case 0:
                this.targetStatus = 0;
                this.targetID = 0;
                this.targetNick = '';
                this.targetSkinURL = '';
                this.targeting = false;
                ogario.targeting = false;
                this.privateMiniMap = false;
                  clickTargeting.account1 = null;
                  clickTargeting.name1 = null;
                  clickTargeting.account2 = null;
                  clickTargeting.name2 = null;
                $(`#target-skin, #target-nick, #target-summary`).hide();
                $('#target-status').show().text(`[${textLanguage.targetNotSet}]`);
                $('#target-panel-hud a').removeClass(`active`);
                break;
            case 1:
                this.targetStatus = 1;
                if (!this.targeting) {
                    this.targeting = true;
                    ogario.targeting = true;
                    this.setTargetingInfo();
                }
                $(`#target-skin, #target-nick, #target-status, #target-summary`).show();
                break;
            case 2:
                this.targetStatus = 2;
                $(`#target-summary`).hide();
                $(`#target-status`).show().text(`[${textLanguage.targetDead}]`);
                ogario.resetTargetPosition();
                break;
        }
    },
    nextServer(){
      if(Connection.play) return;
      const srvrs = window.master.aliveServers;
      if(srvrs.length==0) {
        application.gameServerReconnect()
      } else {
        const srv = $('#lb-adress').text(),
              i = srvrs.indexOf(srv);
        if(i!=-1){
          let ws = srvrs.length<i+2?srvrs[0]:srvrs[i+1];
          this.gameServerJoin(ws);
        }
      }
    },
    prevServer(){
      if(Connection.play) return;
      const srvrs = window.master.aliveServers;
      if(srvrs.length==0) {
        application.gameServerReconnect()
      } else {
        const srv = $('#lb-adress').text(),
              i = srvrs.indexOf(srv);
        if(i!=-1){
          let ws = 0>i-1?srvrs[srvrs.length-1]:srvrs[i-1];
          this.gameServerJoin(ws);
        }
      }
    },
    changeTarget() {
        let targetId = this.checkPlayerID(this.targetID);
        for (var target = null, length = 0; length < this.teamPlayers.length; length++) {
            if (!this.teamPlayers[length].alive) {
                continue;
            }
            if (targetId !== null) {
                if (length < targetId && target === null) {
                    target = length;
                    continue;
                }
                if (length > targetId) {
                    target = length;
                    break;
                }
            } else {
                targetId = length;
                break;
            }
        }
        if (target !== null) {
            targetId = target;
        }
        if (targetId !== null) {
            this.setTarget(this.teamPlayers[targetId].id);
        } else {
            this.setTargetStatus(0);
        }
    },
    updateTarget(nick, skinUrl, x, y, mass, color) {
        ogario.setTargetPosition(x, y);
        if (this.targetNick !== nick) {
            this.targetNick = nick;
            $(`#target-nick`).html(this.escapeHTML(nick));
        }
        $(`#target-skin`).css(`background-color`, color);
        if (skinUrl && this.targetSkinURL !== skinUrl) {
            if (this.customSkinsCache.hasOwnProperty(skinUrl + `_cached`)) {
                $('#target-skin img').attr(`src`, skinUrl);
                this.targetSkinURL = skinUrl;
            } else {
                $(`#target-skin img`).attr(`src`, `https://cdn.ogario.ovh/static/img/blank.png`);
            }
        }
        $(`#target-status`).text(`[${this.shortMassFormat(mass)}]`);
        const mapSector = this.calculateMapSector(x, y);
        let html = `${textLanguage.targetDistance + `: <span class="hud-main-color">` + ogario.targetDistance} [${mapSector}]</span>`;
        if (ogario.play) {
            html += ` | ` + textLanguage.targetMass + `: <span class="hud-main-color">` + this.shortMassFormat(mass + ogario.playerMass) + `</span>`;
        }
        $('#target-summary').html(html);
        if (this.targetStatus != 1) {
            this.setTargetStatus(1);
        }
    },
    updateQuest() {
        if (!this.showQuest || this.gameMode !== `:ffa`) {
            return;
        }
        if (window.MC && window.MC.getQuestProgressLabel) {
            this.questHUD.textContent = window.MC.getQuestProgressLabel();
        }
    },
    init() {
        this.loadSettings();
        this.loadProfiles();
        this.setLang();
        this.setMenu();
        this.setUI();
        OgarioSettings && OgarioSettings.setTheme();
        this.setShowQuickMenu();
        this.setShowSkinsPanel();
        this.setProfile();
        this.setMainButtons();
        this.setStreamMode();
        this.setHideSkinUrl();
        this.setMiniMap();
        this.setAutoResp();
        this.setDisableChat();
        this.setShowChatBox();
        this.setTop5();
        this.setTargetingHUD();
        this.setQuest();
        this.displayTime();
        this.setCenteredLb();
        this.setNormalLb();
        this.setFpsAtTop();
        this.displayStats();
        this.setBlockPopups();
        this.preloadChatSounds();
        this.setChatSoundsBtn();
        this.setFBIDs();
        this.setSearchSkins();
        this.setSearchNicks();
        this.setExtras();
        this.setDiscordWH();
        const app = this;
        setInterval(() => {
            requestAnimationFrame(app.drawMiniMap.bind(this))
        }, 33);
        setInterval(() => {
            app.updateTeamPlayers();
        }, this.updateInterval);
    }
};
function newCanvas() {
    this.txt = '';
    this.txtCanvas = null;
    this.txtCtx = null;
    this.color = '#FFFFFF';
    this.stroke = false;
    this.strokeWidth = 2;
    this.strokeColor = '#000000';
    this.font = `700 16px Ubuntu`;
    this.fontFamily = `Ubuntu`;
    this.fontWeight = 700;
    this.fontSize = 16;
    this.margin = 3;
    this.scale = 1;
    this.quality = 1;
    this.measuredWidth = 0;
    this.redraw = false;
    this.remeasure = false;
    this.setTxt = function(text) {
        if (this.txt !== text) {
            this.txt = text;
            this.redraw = true;
            this.remeasure = true;
        }
    };
    this.setColor = function(color) {
        if (this.color !== color) {
            this.color = color;
            this.redraw = true;
        }
    };
    this.setStroke = function(stroke) {
        if (this.stroke !== stroke) {
            this.stroke = stroke;
            this.redraw = true;
        }
    };
    this.setStrokeWidth = function(width) {
        if (!this.stroke) {
            return;
        }
        if (this.strokeWidth != width) {
            this.strokeWidth = width;
            this.redraw = true;
            this.remeasure = true;
        }
    };
    this.setStrokeColor = function(color) {
        if (!this.stroke) {
            return;
        }
        if (this.strokeColor !== color) {
            this.strokeColor = color;
            this.redraw = true;
        }
    };
    this.setFont = function() {
        this.font = `${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`;
    };
    this.setFontFamily = function(font) {
        if (this.fontFamily !== font) {
            this.fontFamily = font;
            this.setFont();
            this.redraw = true;
            this.remeasure = true;
        }
    };
    this.setFontWeight = function(weigth) {
        if (this.fontWeight != weigth) {
            this.fontWeight = weigth;
            this.setFont();
            this.redraw = true;
            this.remeasure = true;
        }
    };
    this.setFontSize = function(size) {
        if (this.fontSize != size) {
            this.fontSize = size;
            this.margin = ~~(size * 0.2);
            this.setFont();
            this.redraw = true;
        }
    };
    this.setScale = function(scale) {
        if (this.scale != scale) {
            this.scale = scale;
            this.redraw = true;
        }
    };
    this.createCanvas = function() {
        if (this.txtCanvas) {
            return;
        }
        this.txtCanvas = document.createElement(`canvas`);
        this.txtCtx = this.txtCanvas.getContext('2d');
        this.txtCtx.imageSmoothingEnabled = false
        this.txtCtx.ogarioCtx = true;
    };
    this.setDrawing = function(color, font, weigth, stroke, width, strokeColor) {
        this.setColor(color);
        this.setFontFamily(font);
        this.setFontWeight(weigth);
        this.setStroke(stroke);
        this.setStrokeWidth(width);
        this.setStrokeColor(strokeColor);
    };
    this.measureWidth = function() {
        if (this.remeasure) {
            this.txtCtx.font = this.fontWeight + ` 10px ` + this.fontFamily;
            this.measuredWidth = this.txtCtx.measureText(this.txt).width;
            this.remeasure = false;
        }
        return ~~(this.fontSize / 10 * this.measuredWidth) + this.strokeWidth * 2;
    };
    this.drawTxt = function() {
        this.createCanvas();
        if (this.redraw) {
            this.redraw = false;
            this.txtCanvas.width = this.measureWidth();
            this.txtCanvas.height = this.fontSize + this.margin;
            this.txtCtx.font = this.font;
            this.txtCtx.globalAlpha = 1;
            this.txtCtx.lineWidth = this.strokeWidth;
            this.txtCtx.strokeStyle = this.strokeColor;
            this.txtCtx.fillStyle = this.color;
            if (this.stroke) {
                this.txtCtx.strokeText(this.txt, this.strokeWidth, this.fontSize - this.margin / 2);
            }
            this.txtCtx.fillText(this.txt, this.strokeWidth, this.fontSize - this.margin / 2);
        }
        return this.txtCanvas;
    };
}

function Cell(id, x, y, size, color, isFood, isVirus, isPlayer, shortMass, virusMassShots) {
    function gcd(a,b) {if(b>a) {temp = a; a = b; b = temp} while(b!=0) {m=a%b; a=b; b=m;} return a;}
    function ratio(x,y) {c=gcd(x,y); return ""+(x/c)+":"+(y/c)}
    this.xiid = ratio(Math.abs(x),Math.abs(y))
    this.debugCanvas = null
    this.id = id;
    this.accID = null;
    this.x = x;
    this.y = y;
    this.targetX = x;
    this.targetY = y;
    this.color = color;
    this.oppColor = null;
    this.size = size;
    this.targetSize = size;
    this.alpha = 1;
    this.nick = '';
    this.targetNick = '';
    this.nickCanvas = null;
    this.mass = 0;
    this.lastMass = 0;
    this.kMass = 0;
    this.massCanvas = null;
    this.massTxt = '';
    this.margin = 0;
    this.scale = 1;
    this.nickScale = 1;
    this.massScale = 1;
    this.virMassScale = 3;
    this.strokeScale = 1;
    this.fontSize = 26;
    this.nickSize = 26;
    this.lastNickSize = 0;
    this.massSize = 26;
    this.virMassSize = 26;
    this.nickStrokeSize = 3;
    this.massStrokeSize = 3;
    this.isFood = isFood;
    this.isVirus = isVirus;
    this.isPlayerCell = isPlayer;
    this.shortMass = shortMass;
    this.virMassShots = virusMassShots;
    this.rescale = false;
    this.redrawNick = true;
    this.redrawMass = true;
    this.optimizedNames = false;
    this.optimizedMass = false;
    this.strokeNick = false;
    this.strokeMass = false;
    this.removed = false;
    this.redrawed = 0;
    this.time = 0;
    this.skin = null;
    this.pi2 = 2 * Math.PI;


    this.update = function(x, y, mass, isVirus, isPlayer, nick) {
        this.x = x;
        this.y = y;
        this.isVirus = isVirus;
        this.isPlayerCell = isPlayer;
        this.setMass(mass);
        this.setNick(nick);
    };
    this.removeCell = function() {
        this.removed = true;
        let cells = Connection.cells.indexOf(this);
        if (cells != -1) {
            Connection.cells.splice(cells, 1);
            if (gameOptionSettings.virusesRange) {
                cells = Connection.viruses.indexOf(this);
                if (cells != -1) {
                    Connection.viruses.splice(cells, 1);
                }
            }
        } else {
            cells = Connection.food.indexOf(this);
            if (cells != -1) {
                Connection.food.splice(cells, 1);
            }
        }
        if(!this.spectator&&Connection.accounts.hasOwnProperty(this.accID)){
          cells = Connection.accounts[this.accID].cells.indexOf(this);
          if (cells != -1) {
            Connection.accounts[this.accID].cells.splice(cells, 1);
            if(Connection.accounts[this.accID].cells.length==0) delete Connection.accounts[this.accID];
          }
        }
        cells = Connection.playerCells.indexOf(this);
        if (cells != -1) {
            Connection.removePlayerCell = true;
            Connection.playerCells.splice(cells, 1);
            cells = Connection.playerCellIDs.indexOf(this.id);
            if (cells != -1) {
                Connection.playerCellIDs.splice(cells, 1);
            }
        }
        if (this.redrawed) {
            Connection.removedCells.push(this);
        }
        delete Connection.indexedCells[this.id];
    };
    this.moveCell = function() {
        const time = Connection.time - this.time;
        let delay = time / gameOptionSettings.animation;
        delay = delay < 0 ? 0 : delay > 1 ? 1 : delay;
        this.x += (this.targetX - this.x) * delay;
        this.y += (this.targetY - this.y) * delay;
        this.size += (this.targetSize - this.size) * delay;
        this.alpha = delay;
        if (!this.removed) {
            this.time = Connection.time;
            return;
        }
        if (delay == 1) {
            const removedCells = Connection.removedCells.indexOf(this);
            if (removedCells != -1) {
                Connection.removedCells.splice(removedCells, 1);
            }
        }
    };
    this.isInView = function() {
        return this.id <= 0 ? false : this.x + this.size + 40 < Connection.viewX - Connection.canvasWidth / 2 / Connection.scale || this.y + this.size + 40 < Connection.viewY - Connection.canvasHeight / 2 / Connection.scale || this.x - this.size - 40 > Connection.viewX + Connection.canvasWidth / 2 / Connection.scale || this.y - this.size - 40 > Connection.viewY + Connection.canvasHeight / 2 / Connection.scale ? false : true;
    };
    this.isInV = function() {
      if (this.x + this.size < Connection.camMinX || this.y + this.size < Connection.camMinY || this.x - this.size > Connection.camMaxX || this.y - this.size > Connection.camMaxY) {
         return false;
      }
      return true;
    }
    this.isInDisplay = function(x, y, size){
        let daxx = drawRender.scale + drawRender.camX
        let dayy = drawRender.scale + drawRender.camY
        let x2s = drawRender.canvasWidth  / 2 / drawRender.scale
        let y2s = drawRender.canvasHeight / 2 / drawRender.scale

        /*  var q0 = [x2s + this.camX, -y2s + this.camY]
            var q1 = [-x2s + this.camX, -y2s + this.camY]
            var q2 = [-x2s + this.camX, y2s + this.camY]
            var q3 = [x2s + this.camX, y2s + this.camY]
        */
            if (x + size < drawRender.camX - x2s || y + size < drawRender.camY - y2s || x - size > drawRender.camX + x2s || y - size > drawRender.camY + y2s) {
                return false;
            }
            return true;
    }
    this.setMass = function(mass) {
        this.size = mass;
        if (mass <= 40) {
            return false;
        }
            if (!this.massCanvas) {
                this.massCanvas = new newCanvas();
                return false;
            }
        this.mass = ~~(mass * mass / 100);
        this.redrawMass = true;
        if (this.isVirus) {
            if (this.virMassShots && this.mass < 200) {
                this.mass = ~~((200 - this.mass) / 14);
                if(gameOptionSettings.virusSounds && this.lastMass && this.mass < this.lastMass) application.playSound(application.virusSound)
                this.lastMass = this.mass
            }
            this.massTxt = this.mass.toString();
            return true;
        }
        this.massTxt = this.mass.toString();
        if (this.mass <= 200) {
            return true;
        }
        if (this.shortMass && this.mass >= 1000) {
            this.kMass = Math.round(this.mass / 100) / 10;
            this.massTxt = `${this.kMass}k`;
            return true;
        }
        if (this.optimizedMass) {
            this.redrawMass = Math.abs((this.mass - this.lastMass) / this.mass) >= 0.02 || this.rescale;
        }
        return true;
    };
    this.setNick = function(nick) {
        this.nick = nick;
        if (!nick || this.isVirus) {
            return false;
        }
        if (!this.nickCanvas) {
            this.nickCanvas = new newCanvas();
            return false;
        }
        return true;
    };
    this.setScale = function(scale, nickScale, massScale, virusScale, strokeScale) {
        const ceilScale = Math.ceil(scale * 10) / 10;
        this.rescale = false;
        if (this.scale != ceilScale) {
            // patch 1
            if(ceilScale > 0.5) return;
            this.scale = ceilScale;
            
                //console.log('rescale',ceilScale)
            this.rescale = true;
        }
        this.nickScale = nickScale;
        this.massScale = massScale;
        this.virMassScale = virusScale;
        this.strokeScale = strokeScale;
    };
    this.setFontSize = function() {
        if (this.isVirus) {
            this.massSize = Math.ceil(this.virMassSize * this.scale * this.virMassScale);
            return;
        }
        this.fontSize = Math.max(this.size * 0.3, 26) * this.scale;
        this.nickSize = ~~(this.fontSize * this.nickScale);
        this.massSize = ~~(this.fontSize * 0.5 * this.massScale);
        if (this.optimizedNames) {
            this.redrawNick = Math.abs((this.nickSize - this.lastNickSize) / this.nickSize) >= 0.3 || this.rescale;
            return;
        }
        this.redrawNick = true;
    };
    this.setStrokeSize = function() {
        if (this.strokeNick && !this.isVirus) {
            this.nickStrokeSize = /*~~*/(this.nickSize * 0.1 * this.strokeScale);
        }
        if (this.strokeMass) {
            this.massStrokeSize = /*~~*/(this.massSize * 0.1 * this.strokeScale);
        }
    };
    this.setDrawing = function() {
        this.optimizedNames = gameOptionSettings.optimizedNames;
        this.optimizedMass = gameOptionSettings.optimizedMass;
        this.shortMass = gameOptionSettings.shortMass;
        this.virMassShots = gameOptionSettings.virMassShots;
        this.strokeNick = gameOptionSettings.namesStroke;
        this.strokeMass = gameOptionSettings.massStroke;
    };
    this.setDrawingScale = function() {
                    // patch 1
            
        this.setScale(ogario.viewScale, gameSetupTheme.namesScale, gameSetupTheme.massScale, gameSetupTheme.virMassScale, gameSetupTheme.strokeScale);
        this.setFontSize();
        this.setStrokeSize();
        this.margin = 0;
    };
    this.drawNick = function(ctx) {
        // patch 1
        if (!this.nick || !this.nickCanvas || this.isVirus) {
            return;
        }
        const canvas = this.nickCanvas;
        canvas.setDrawing(gameSetupTheme.namesColor, gameSetupTheme.namesFontFamily, gameSetupTheme.namesFontWeight, this.strokeNick, this.nickStrokeSize, gameSetupTheme.namesStrokeColor);
        canvas.setTxt(this.nick);
        if (this.redrawNick) {
            canvas.setFontSize(this.nickSize);
            this.lastNickSize = this.nickSize;
        }
        canvas.setScale(this.scale);
        const imgTxt = canvas.drawTxt();
        const width = /*~~*/(imgTxt.width / this.scale);
        const heigth = /*~~*/(imgTxt.height / this.scale);
        this.margin = /*~~*/(heigth / 2);
        if(width!=0 && heigth!=0) {
            // patch 1
            //var pr = ctx.imageSmoothingQuality
            //ctx.imageSmoothingQuality = "high"
            ctx.drawImage(imgTxt, /*~~*/this.x - /*~~*/(width / 2), /*~~*/this.y - this.margin, width, heigth);
            //ctx.imageSmoothingQuality = pr
        }
    };
    this.drawMass = function(ctx) {
        // patch 1
        if (!this.massCanvas || this.size <= 40) {
            return;
        }
        const canvas = this.massCanvas;
        canvas.setDrawing(gameSetupTheme.massColor, gameSetupTheme.massFontFamily, gameSetupTheme.massFontWeight, this.strokeMass, this.massStrokeSize, gameSetupTheme.massStrokeColor);
        if (this.redrawMass) {
            canvas.setTxt(this.massTxt);
            this.lastMass = this.mass;
        }
        canvas.setFontSize(this.massSize);
        canvas.setScale(this.scale);
        const imgTxt = canvas.drawTxt();
        const width = /*~~*/(imgTxt.width / this.scale);
        const heigth = /*~~*/(imgTxt.height / this.scale);
        const margin = this.margin == 0 ? /*~~*/this.y - /*~~*/(heigth / 2) : /*~~*/this.y + this.margin;
        if(width!=0 && heigth!=0) {
            // patch 1
            //var pr = ctx.imageSmoothingQuality
            //ctx.imageSmoothingQuality = "high"
            ctx.drawImage(imgTxt, /*~~*/this.x - /*~~*/(width / 2), margin, width, heigth);
            //ctx.imageSmoothingQuality = pr     

        }

    };
    this.drawDebug = function(ctx) {
        if (this.size <= 40) {
            return;
        }
        if (!this.debugCanvas) {
            this.debugCanvas = new newCanvas();
            //return false;
        }
        const canvas = this.debugCanvas;
        canvas.setDrawing(gameSetupTheme.namesColor, gameSetupTheme.namesFontFamily, gameSetupTheme.namesFontWeight, this.strokeNick, this.nickStrokeSize, gameSetupTheme.namesStrokeColor);
        canvas.setTxt('x'+Math.round(this.x)+':y'+Math.round(this.y));

        canvas.setFontSize(this.nickSize);
        canvas.setScale(this.scale);
        const imgTxt = canvas.drawTxt();
        const width = ~~(imgTxt.width / this.scale);
        const heigth = ~~(imgTxt.height / this.scale);
        const margin = /*this.margin == 0 ? */~~this.y - ~~(heigth / 2) - (this.size-this.size/3)/*: ~~this.y + this.margin;*/
        if(width!=0 && height!=0) {
            ctx.drawImage(imgTxt, ~~this.x - ~~(width / 2), margin, width, heigth);
        }

    };
    this.draw = function(ctx, update) {
        if (Connection.hideSmallBots && this.size <= 36) {
            return;
        }
        ctx.save();
        this.redrawed++;
        if (update) {
            this.moveCell();
        }
        if (this.spectator>0 && this.isInV()||this.invisible==true) {
           ctx.restore();
          return;
        }
        if (!this.isInDisplay(this.x, this.y, this.size)) {
           ctx.restore();
          return;
        }
        if (this.removed) {
            ctx.globalAlpha *= 1 - this.alpha;
        }
        const alpha = ctx.globalAlpha;
        let isAplha = false;
        const size = this.isFood ? this.size + gameSetupTheme.foodSize : this.size;
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(this.x, this.y, size, 0, this.pi2, false);
        ctx.closePath();
        if (this.isFood) {
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.restore();
            return;
        }
        if (this.isVirus) {
            if (gameOptionSettings.transparentViruses) {
                ctx.globalAlpha *= gameSetupTheme.virusAlpha;
                isAplha = true;
            }
            if (gameOptionSettings.virColors && Connection.play) {
                ctx.fillStyle = application.setVirusColor(size);
                ctx.strokeStyle = application.setVirusStrokeColor(size);
            } else {
                ctx.fillStyle = gameSetupTheme.virusColor;
                ctx.strokeStyle = gameSetupTheme.virusStrokeColor;
            }
            ctx.fill();
            if (isAplha) {
                ctx.globalAlpha = alpha;
                isAplha = false;
            }
            ctx.lineWidth = gameSetupTheme.virusStrokeSize;
            ctx.stroke();
            if (gameOptionSettings.showMass) {
                this.setDrawing();
                this.setDrawingScale();
                this.setMass(this.size);
                this.drawMass(ctx);
            }
            ctx.restore();
            return;
        }
        if (gameOptionSettings.transparentCells) {
            ctx.globalAlpha *= gameSetupTheme.cellsAlpha;
            isAplha = true;
        }
        let color = this.color;
        if (Connection.play) {
            if (this.isPlayerCell) {
                if (gameOptionSettings.myCustomColor) {
                    //color = mainProfile.color;
                    color = `hsl(${~~((Date.now()-drawRender.renderStart)/60)%360},100%,50%)`
                }
            } else if (gameOptionSettings.oppColors && !gameOptionSettings.oppRings) {
                color = this.oppColor;
            }
        }
        if (gameOptionSettings.cellContours) {
        ctx.lineWidth = 20; ///
        ctx.strokeStyle = this.color;///
        ctx.stroke();///
        } else {
        ctx.fillStyle = color;
        ctx.fill();
        }
        if (isAplha) {
            ctx.globalAlpha = alpha;
            isAplha = false;
        }
        let skin = null;
        if (gameOptionSettings.customSkins && Connection.showCustomSkins && this.accID) {//Yahnych
          var animated = false;
          if(Connection.accounts.hasOwnProperty(this.accID)) animated=Connection.accounts[this.accID].animated;
          if(this.fbID&&gameOptionSettings.FBSkins){
            skin = application.getCustomSkin(this.fbID, '#000000', animated);
          } else if(this.targetNick && application.checkSkinsMap(this.targetNick, this.color)) {
            skin = application.getCustomSkin(this.targetNick, this.color, animated);
          } else if(gameOptionSettings.vanillaSkins&&this.skin){
            skin = application.getCustomSkin(this.skin, null, animated);
          }
            if (skin) {
                if ((gameOptionSettings.transparentSkins || Connection.play && gameOptionSettings.oppColors) && !(this.isPlayerCell && !gameOptionSettings.myTransparentSkin) || this.isPlayerCell && gameOptionSettings.myTransparentSkin) {
                    ctx.globalAlpha *= gameSetupTheme.skinsAlpha;
                    isAplha = true;
                }
                ctx.drawImage(skin, this.x - size, this.y - size, 2*size, 2*size);
                if (isAplha) {
                    ctx.globalAlpha = alpha;
                    isAplha = false;
                }
            }
		      	if ((this.extras||(this.isPlayerCell&&application.extras.length>0))&&this.size > 55) {
             const extras = this.isPlayerCell?application.extras:this.extras;
             for(let i=0; i<extras.length; i++){
              let extra = extras[i];
		       		if (application.extrasCache[extra.image].status==1) {
                let image = application.extrasCache[extra.image].img,
                    d = ((Date.now()-drawRender.renderStart)/5000)%(Math.PI*4)*extra.angle,
                    transparency = Math.max(1 - Math.max(extra.dWidth,extra.dHeight)/8,0.0);
		         		ctx.save();
                ctx.translate(this.x, this.y);
                if(d&&d!=0) ctx.rotate(d);
		        		ctx.globalAlpha *= gameSetupTheme.skinsAlpha*transparency;//0.9;
		        		ctx.drawImage(image, 0 - this.size*extra.dx, 0 - this.size*extra.dy, this.size*extra.dWidth, this.size*extra.dHeight);
			        	ctx.restore();
              }
            }
            }
        }

        if (gameOptionSettings.teammatesInd && !this.isPlayerCell && size <= 200 && (skin || application.checkSkinsMap(this.targetNick, this.color))) {
            drawRender.drawTeammatesInd(ctx, this.x, this.y, size);
        }
        if (gameOptionSettings.noNames && !gameOptionSettings.showMass || update) {
            ctx.restore();
            return;
        }
        let hideCells = false;
        if (!this.isPlayerCell) {
            hideCells = application.setAutoHideCellInfo(size);
            if (hideCells && gameOptionSettings.autoHideNames && gameOptionSettings.autoHideMass) {
                ctx.restore();
                return;
            }
        }
        this.setDrawing();
        this.setDrawingScale();
        //this.drawDebug(ctx)
        ctx.globalAlpha *= gameSetupTheme.textAlpha;
        if (!gameOptionSettings.noNames && !(hideCells && gameOptionSettings.autoHideNames) && !(this.isPlayerCell && gameOptionSettings.hideMyName) && !(skin && gameOptionSettings.hideTeammatesNames)) {
            if (this.setNick(this.targetNick)) {
                this.drawNick(ctx);
            }
        }
        if (gameOptionSettings.showMass && !(hideCells && gameOptionSettings.autoHideMass) && !(this.isPlayerCell && gameOptionSettings.hideMyMass) && !(gameOptionSettings.hideEnemiesMass && !this.isPlayerCell && !this.isVirus)) {
            if (this.setMass(this.size)) {
                this.drawMass(ctx);
            }
        }
        ctx.restore();
    };
}

const Connection = window.aa = {
    integrity:true,
    quadrant:null,
    realQuadrant:null,
    lastQuadrant:null,
    mirrorV:false,
    mirrorH:false,
    ghostCellsStep:0,
    totalPackets:0,
    isFreeSpectate:false,
    isSpectateEnabled:false,
    ppsLastRequest:null,
    pps:0,
    ws: null,
    lastws:null,
    socket: null,
    protocolKey: null,
    clientKey: null,
    connectionOpened: false,
    accessTokenSent: false,
    loggedIn: false,
    clientVersion: 30500,
    clientVersionString: `3.5.0`,
    time: Date.now(),
    serverTime: 0,
    serverTimeDiff: 0,
    loggedInTime: 0,
    mapSize: 14142,
    mapOffset: 7071,
    mapOffsetX: 0,
    mapOffsetY: 0,
    mapOffsetFixed: false,
    mapMinX: -7071,
    mapMinY: -7071,
    mapMaxX: 7071,
    mapMaxY: 7071,
    mapMidX:0,
    mapMidY:0,
    viewMinX: 0,
    viewMinY: 0,
    viewMaxX: 0,
    viewMaxY: 0,

    camMaxX:0,
    camMaxY:0,
    camMinX:0,
    camMinY:0,

    canvasWidth: 0,
    canvasHeight: 0,
    canvasScale: 1,
    indexedCells: {},
    cells: [],
    removedCells: [],
    food: [],
    viruses: [],
    playerCells: [],
    playerCellIDs: [],
    fbOnline: [],
    arrowFB: [{}],  
    Waves: [],
    accID: null,
    accounts: {},
    ghostCells: [],
    playerX: 0,
    playerY: 0,
    playerSize: 0,
    playerMass: 0,
    playerMaxMass: 0,
    playerMinMass: 0,
    playerScore: 0,
    playerSplitCells: 0,
    playerColor: null,
    playerNick: '',
    playerPosition: 0,
    playerTopPoint: 0,
    leaderboard: [],
    'biggerSTEDCellsCache': [], //Sonia
    'biggerSTECellsCache': [],
    'biggerCellsCache': [],
    'smallerCellsCache': [],
    'STECellsCache': [],
    'STEDCellsCache': [], //Sonia
    'SSCellsCache': [],
    STE: 0,
    autoZoom: false,
    zoomValue: 0.1,
    viewX: 0,
    viewY: 0,
    scale: 1,
    viewScale: 1,
    clientX: 0,
    clientY: 0,
    cursorX: 0,
    cursorY: 0,
    targetX: 0,
    targetY: 0,
    targetDistance: 0,
    active: true,
    battleRoyale: {
        state: 0,
        players: 0,
        startTime: 0,
        shrinkTime: 0,
        timeLeft: 0,
        x: 0,
        y: 0,
        radius: 0,
        targetX: 0,
        targetY: 0,
        targetRadius: 0,
        maxRadius: 11313,
        rank: [],
        playerRank: 0,
        joined: false
    },
    play: false,
    pause: false,
    targeting: false,
    removePlayerCell: false,
    showCustomSkins: true,
    showFood: true,
    foodIsHidden: false,
    selectBiggestCell: true,
    hideSmallBots: false,
    pressedKeys: {},
    sct: false,
    afk: false,
    dance: false,
    connect(url) {
        console.log(`[Client 1] Connecting to game server:`, url);
        const app = this;
        this.closeConnection();
        this.ws = url;
        this.flushCellsData();
        this.lastws = url
        this.protocolKey = null;
        this.clientKey = null;
        this.accessTokenSent = false;
        this.connectionOpened = false;
        this.loggedIn = false;
        this.mapOffsetFixed = false;
        this.leaderboard = [];

        //if(window.user.startedBots) window.connection.send(new Uint8Array([1]).buffer)
        window.game.url = url
        window.user.isAlive = false
        window.user.macroFeedInterval = null
        this.integrity = url.indexOf('agar.io')>-1
        this.socket = new WebSocket(url);
        this.socket.binaryType = `arraybuffer`;
        this.socket.onopen = () => {
            this.onOpen();
        };
        this.socket.onmessage = message => {
            this.onMessage(message);
        };
        this.socket.onerror = error => {
            this.onError(error);
        };
        this.socket.onclose = close => {
            this.onClose(close);
        };
        application.getWS(this.ws);
        application.sendServerJoin();
        application.sendServerData();
        application.displayLeaderboard('');
        if (window.master && window.master.onConnect) {
            window.master.onConnect();
        }
        if(gameOptionSettings.mapGlobalFix4) mirror.connect(application.serverToken)
    },
    onOpen() {
        console.log(`[Client 1] Game server socket open`);
        this.time = Date.now();
        let view = this.createView(5);
        view.setUint8(0, 254);
        if(!window.game.protocolVersion) window.game.protocolVersion = 22
        view.setUint32(1, 22, true);
        this.sendMessage(view);
        view = this.createView(5);
        view.setUint8(0, 255);
        if(!window.game.clientVersion) window.game.clientVersion = this.clientVersion
        view.setUint32(1, this.clientVersion, true);
        this.sendMessage(view);
        this.connectionOpened = true;
    },
    onMessage(message) {
        if(application.replayMode) return
        message = new DataView(message.data);
        if (this.protocolKey) {
            message = this.shiftMessage(message, this.protocolKey ^ this.clientVersion);
        }
        this.handleMessage(message);
    },
    onError() {
        console.log(`[Client 1] Game server socket error`);
        this.flushCellsData();
        if (window.master && window.master.onDisconnect) {
            window.master.onDisconnect();
        }
    },
    onClose() {
        console.log('[Client 1] Game server socket close');
        this.flushCellsData();
        if (window.master && window.master.onDisconnect) {
            window.master.onDisconnect();
        }
    },
    closeConnection() {
        if (this.socket) {
            this.socket.onopen = null;
            this.socket.onmessage = null;
            this.socket.onerror = null;
            this.socket.onclose = null;
            try {
                this.socket.close();
            } catch (error) {}
            this.socket = null;
            this.ws = null;
        }
    },
    isSocketOpen() {
        return this.socket !== null && this.socket.readyState === this.socket.OPEN;
    },
    writeUint32(data, value) {
        while (true) {
            if ((value & -128) == 0) {
                data.push(value);
                return;
            } else {
                data.push(value & 127 | 128);
                value = value >>> 7;
            }
        }
    },
    createView(value) {
        return new DataView(new ArrayBuffer(value));
    },
    sendBuffer(data) {
        this.socket.send(data.buffer);
    },
    sendMessage(message) {
        if (this.connectionOpened && this.integrity) {
            if (!this.clientKey) {
                return;
            }
            message = this.shiftMessage(message, this.clientKey);
            this.clientKey = this.shiftKey(this.clientKey);
        }
        this.sendBuffer(message);
    },
    sendAction(action) {
        if (!this.isSocketOpen()) {
            return;
        }
        const view = this.createView(1);
        view.setUint8(0, action);
        this.sendMessage(view);
    },
    sendSpectate() {
        this.isSpectateEnabled = true
        this.sendAction(1);
    },
    sendFreeSpectate() {
        this.isFreeSpectate = !this.isFreeSpectate
        this.sendAction(18);
    },
    sendEject() {
        this.sendPosition();
        this.sendAction(21);
    },
    sendSplit() {
        this.sendPosition();
        this.sendAction(17);
    },
    sendNick(nick) {


        /*setTimeout(function(){window.core.proxyMobileData([8, 1, 18, 7, 8, 124, 226, 7, 2, 8, 1])}, 0);
        setTimeout(function(){window.core.proxyMobileData([8, 1, 18, 7, 8, 124, 226, 7, 2, 8, 2])}, 3000);
        setTimeout(function(){window.core.proxyMobileData([8, 1, 18, 7, 8, 124, 226, 7, 2, 8, 3])}, 6000);*/

        this.playerNick = nick;
        /*if(master.socialID=="107037780487637"){
           nick+="🤍ІЯ"
        }*/
        var self = this
        var sendSpawn = function(token) {
            nick = window.unescape(window.encodeURIComponent(nick));
            var view = self.createView(1+nick.length+1+token.length+1);
            var pos = 1
            for (let length = 0; length < nick.length; length++,pos++) view.setUint8(pos, nick.charCodeAt(length))
            pos++
            for (let length = 0; length < token.length; length++,pos++) view.setUint8(pos, token.charCodeAt(length));
            self.sendMessage(view);
        }

        this.integrity && agarCaptcha.requestCaptchaV3("play", function(token) {
            sendSpawn(token)
            
            //window.core.sendNick(nick, token)
        });
        !this.integrity && sendSpawn('0')
    },
    sendFBIDS(data) {//Yahnych
        var friendsIDs  = "";

        var pIDs = application.FacebookIDs;
        for (let length = 0; length < pIDs.length; length++) {
          if(friendsIDs.length == 0) {                
           friendsIDs += pIDs[length].id;
          } else {
           friendsIDs += "|" + pIDs[length].id;
          }
        }
        for (let length = 0; length < data.length; length++) {
          if(friendsIDs.length == 0) {
            friendsIDs += data[length].id 
          } else {
            friendsIDs += "|" + data[length].id 
          }
        }
      friendsIDs = unescape(encodeURIComponent(friendsIDs));
      const view = this.createView(2 + friendsIDs.length);
        view.setUint8(0, 5);
        for (let length = 0; length < friendsIDs.length; length++) {
            view.setUint8(1+length, friendsIDs.charCodeAt(length));
        }
        view.setUint8(friendsIDs.length+1, 0);
        this.sendMessage(view);
      
    },
    sendPosition() {
        if (this.afk || !this.isSocketOpen() || !this.connectionOpened || (!this.clientKey && this.integrity)) {
            return;
        }
        let cursorX = this.cursorX;
        let cursorY = this.cursorY;
        if(Connection.sct==true) {
          let limit = 999000;
          cursorX = this.playerX+((this.cursorX-this.playerX)*200);
          cursorY = this.playerY+((this.cursorY-this.playerY)*200);
          if(cursorX>=limit||cursorX<=-limit) {
            cursorY=Math.abs(limit/cursorX)*cursorY;
            cursorX=limit*Math.sign(cursorX);
          }
          if(cursorY>=limit||cursorY<=-limit) {
            cursorX=Math.abs(limit/cursorY)*cursorX;
            cursorY=limit*Math.sign(cursorY);
          }
        }
        if(Connection.dance==true) {
          let d = ~~((Date.now()/40)%8),
              distance = 50000;
          switch (d) {
            case 7:
                cursorX = this.playerX-distance;
                cursorY = this.playerY-distance;
                break;
            case 6:
                cursorX = this.playerX-distance;
                cursorY = this.playerY;
                break;
            case 5:
                cursorX = this.playerX-distance;
                cursorY = this.playerY+distance;
                break;
            case 4:
                cursorX = this.playerX;
                cursorY = this.playerY+distance;
                break;
            case 3:
                cursorX = this.playerX+distance;
                cursorY = this.playerY+distance;
                break;
            case 2:
                cursorX = this.playerX+distance;
                cursorY = this.playerY;
                break;
            case 1:
                cursorX = this.playerX+distance;
                cursorY = this.playerY-distance;
                break;
            case 0:
                cursorX = this.playerX;
                cursorY = this.playerY-distance;
                break;
            default:
                console.log(d);
                break;
         }

        }
        window.user.mouseX = ~~(cursorX + Connection.mapOffsetX)//Yahnych
        window.user.mouseY = ~~(cursorY + Connection.mapOffsetY)
        if(window.user.startedBots /*&& window.user.isAlive*/) window.connection.send(window.buffers.mousePosition(window.user.mouseX, window.user.mouseY, window.user.ghostX, window.user.ghostY))//Yahnych
        if (!this.play && this.targeting || this.pause) {
            cursorX = this.targetX;
            cursorY = this.targetY;
        }
        const view = this.createView(13);
        view.setUint8(0, 16);
        view.setInt32(1, ~~this.serverX(cursorX), true);
        view.setInt32(5, ~~this.serverY(cursorY), true);
        view.setUint32(9, this.protocolKey, true);
        this.sendMessage(view);
    },
    sendAccessToken(shapes, options, oW) {
        //csse
        if(!this.integrity){
            return
        }
        if (this.accessTokenSent) {
            return;
        }
        if (!oW) {
            oW = 102;
        }
        const curr = shapes.length;
        const count = this.clientVersionString.length;
        let data = [oW, 8, 1, 18];
        this.writeUint32(data, curr + count + 23);
        data.push(8, 10, 82);
        this.writeUint32(data, curr + count + 18);
        data.push(8, options, 18, count + 8, 8, 5, 18, count);
        for (var length = 0; length < count; length++) {
            data.push(this.clientVersionString.charCodeAt(length));
        }
        data.push(24, 0, 32, 0, 26);
        this.writeUint32(data, curr + 3);
        data.push(10);
        this.writeUint32(data, curr);
        for (length = 0; length < curr; length++) {
            data.push(shapes.charCodeAt(length));
        }
        data = new Uint8Array(data);
        const dataView = new DataView(data.buffer);
        this.sendMessage(dataView);
    },
    sendFbToken(token) {
        this.sendAccessToken(token, 2);
    },
    sendGplusToken(token) {
        this.sendAccessToken(token, 4);
    },
    sendRecaptcha(token) {
        const view = this.createView(2 + token.length);
        view.setUint8(0, 86);
        for (let length = 0; length < token.length; length++) {
            view.setUint8(1 + length, token.charCodeAt(length));
        }
        view.setUint8(token.length + 1, 0);
        this.sendMessage(view);
    },
    setClientVersion(version, string) {
        this.clientVersion = version;
        this.clientVersionString = string;
        console.log(`[Client 1] Client version:`, version, string);
    },
    generateClientKey(ip, options) {
        if (!ip.length || !options.byteLength) {
            return null;
        }
        let x = null;
        const Length = 1540483477;
        const ipCheck = ip.match(/(ws+:\/\/)([^:]*)(:\d+)/)[2];
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
        if (x != newValue) {
            x = Math.imul(uint8Arr[value] ^ newValue, Length) | 0;
        }
        newValue = x >>> 13;
        x = newValue ^ x;
        x = Math.imul(x, Length) | 0;
        newValue = x >>> 15;
        x = newValue ^ x;
        console.log(`[Client 1] Generated client key:`, x);
        return x;
    },
    shiftKey(key) {
        const value = 1540483477;
        key = Math.imul(key, value) | 0;
        key = (Math.imul(key >>> 24 ^ key, value) | 0) ^ 114296087;
        key = Math.imul(key >>> 13 ^ key, value) | 0;
        return key >>> 15 ^ key;
    },
    shiftMessage(view, key, write) {
        if (!write) {
            for (var length = 0; length < view.byteLength; length++) {
                view.setUint8(length, view.getUint8(length) ^ key >>> length % 4 * 8 & 255);
            }
        } else {
            for (var length = 0; length < view.length; length++) {
                view.writeUInt8(view.readUInt8(length) ^ key >>> length % 4 * 8 & 255, length);
            }
        }
        return view;
    },
    decompressMessage(message) {
        const buffer = window.buffer.Buffer;
        const messageBuffer = new buffer(message.buffer);
        const readMessage = new buffer(messageBuffer.readUInt32LE(1));
        LZ4.decodeBlock(messageBuffer.slice(5), readMessage);
        return readMessage;
    },
    startReplay(e){
      this.flushCellsData();
      application.replayData=e;
      if(application.replayData.length>0) {
        application.replayMode=true;
        application.timeOffset = Date.now()-application.replayData[0].time;
        this.cells=application.replayData[0].cells;
        this.indexedCells=application.replayData[0].indexedCells;
        this.viruses=application.replayData[0].viruses;
        Connection.playing();
      }
    },
    playing(){
      //console.log(Connection.replayData, Connection.replayData[0].time, Connection.replayData[0].data, Connection.replayData[0].time+Connection.timeOffset, Date.now())
      if(application.replayData.length==0){
        application.replayMode=false;
        Connection.flushCellsData();
        return
      }
      if(application.replayData[0].time+application.timeOffset<Date.now()){
        Connection.handleMessage(application.replayData.shift().data)
        $('#target-status').show().text(`[PLAYING:${application.replayData.length} packets left]`);
      }
      setTimeout(Connection.playing,5)
    },
    handleMessage(view) {
      if(!application.replayMode&&gameOptionSettings.replays){
        const time = Date.now();
        application.replayData.push({time:time,mode:application.gameMode,region:application.region,data:view,cells:this.cells,indexedCells:Object.assign({},this.indexedCells),viruses:this.viruses});
        while (time-application.replayData[0].time>10000) {
               application.replayData.shift();
        }
      }
        const encode = () => {
            for (var text = '';;) {
                const string = view.getUint8(offset++);
                if (string == 0) {
                    break;
                }
                text += String.fromCharCode(string);
            }
            return text;
        };
        var offset = 0;
        let opCode = view.getUint8(offset++);
        if (opCode == 54) {
            opCode = 53;
        }
        switch (opCode) {
            case 5://Yahnych
            this.fbOnline = [];

            for (; offset < view.byteLength;) {
                        let user = {};

                        user.id = view.getUint32(offset, true);
                        offset += 4;
                        user.fbId = window.decodeURIComponent(window.escape(encode()));
                               
              application.cacheCustomSkin(user.fbId, '#000000', `https://graph.facebook.com/${user.fbId}/picture?type=square&width=720&height=720`);

              this.fbOnline.push(user);
        }             
                break;
            case 17:
                this.viewX = this.receiveX(view.getFloat32(offset, true));
                offset += 4;
                this.viewY = this.receiveY(view.getFloat32(offset, true));
                offset += 4;
                this.scale = view.getFloat32(offset, true);

                //this.viewX = Connection.mapOffsetX
                //this.viewY = Connection.mapOffsetY

                break;
            case 18:
                if (this.protocolKey) {
                    this.protocolKey = this.shiftKey(this.protocolKey);
                }
                this.flushCellsData();
                break;
            case 32:
                this.playerCellIDs.push(view.getUint32(offset, true));
                this.isSpectateEnabled = false
                if (!this.play) {
                    this.play = true;
                    application.hideMenu();
                    this.playerColor = null;
                    application.onPlayerSpawn();
                    window.user.isAlive = true
                    if(window.user.startedBots) window.connection.send(new Uint8Array([5, Number(window.user.isAlive)]).buffer)
                }
                break;
            case 50:
                this.pieChart = [];
                const pieLength = view.getUint32(offset, true);
                offset += 4;
                for (var length = 0; length < pieLength; length++) {
                    this.pieChart.push(view.getFloat32(offset, true));
                    offset += 4;
                }
                drawRender.drawPieChart();
                break;
            case 53://Yahnych
                this.leaderboard = [];
                this.friends = this.fbOnline.length;
                this.playerPosition = 0;
                if (view.getUint8(0) == 54) {
                    const pos = view.getUint16(offset, true);
                    offset += 2;
                    console.log('Friends:' , pos)
                }
                for (let position = 0; offset < view.byteLength;) {
                    var flags = view.getUint8(offset++);
                    let nick = '';
                    let id = 0;
                    let isFriend = false;
                    let isFBFriend = false;
                    position++;
                    if (flags & 2) {
                        nick = window.decodeURIComponent(window.escape(encode()));
                        nick = application.filterNick(nick);
                    }
                    if (flags & 4) {
                        id = view.getUint32(offset, true);
                        offset += 4;
                    }
                    if (flags & 8) {
                        nick = this.playerNick;
                        id = `isPlayer`;
                        this.playerPosition = position;
                      if(position>10&&position!==0) this.playerTopPoint = Date.now();
                      if(window.master.context!=''&&gameOptionSettings.autobrewing&&this.user.emptySlots==0&&position!==0&&position<10&&this.playerTopPoint!=0){
                        if(Date.now()-this.playerTopPoint>30000) {
                          this.playerTopPoint = Date.now();
                          this.getPotionForOpen();
                        }
                      }

                    }
                    if (flags & 16) {
                        isFriend = true;
                        this.friends ++
                    }
                    let friend = Connection.fbOnline.find(element => {return element.id == id});
                    friend != undefined?isFBFriend = friend.fbId:isFBFriend = false;                     
                    this.leaderboard.push({
                        nick: nick,
                        id: id,
                        isFriend: isFriend,
                        isFBFriend: isFBFriend,
                    });
                  
                    if (gameOptionSettings.targetSearch==true && application.founded!=true && application.nicksForSearch.some((e) => {if(e.length>0&&nick.indexOf(e) !=-1) {return true}})) {
                      console.log('Сонечко вийшло з-за хмар', nick, Connection.ws);
                      foundedSound()
                      application.founded=true
                    }
                }
                this.handleLeaderboard();
                break;
            case 54:
                console.log(view)
                break;

            case 69:
                var length = view.getUint16(offset, true);
                offset += 0x2;
                this.ghostCells = [];
                this.ghostCellsStep ++
                for(let i = 0x0; i < length; i++) {
                    var x = view.getInt32(offset, true);
                    offset += 4;
                    var y = view.getInt32(offset, true);
                    offset += 4;
                    var mass = view.getUint32(offset, true);
                    offset += 4;
                    //false&&console.log(view.getUint8(offset))
                    offset += 1

                    var size = ~~Math.sqrt(100 * mass);
                    this.ghostCells.push({
                        'x': this.receiveX(x),
                        'y': this.receiveY(y),
                        'size': size,
                        'mass': mass,
                        'inView': this.isInView(this.receiveX(x), this.receiveY(y), size)
                    });
                if(Connection.playerPosition == 1 || Connection.ghostCells.length == 0) {//Yahnych координати призраков или игрока если он топ1
                window.user.ghostX = ~~(Connection.playerX + Connection.mapOffsetX);
                window.user.ghostY = ~~(Connection.playerY + Connection.mapOffsetY);
                } else {//Yahnych
                    window.user.ghostX = ~~(Connection.ghostCells[0].x + Connection.mapOffsetX);
                    window.user.ghostY = ~~(Connection.ghostCells[0].y + Connection.mapOffsetY);
                 }
                }

                if(gameOptionSettings.mapLocalFix3 && this.ghostCellsStep==1 && this.ghostCells[0]) {
                    this.realQuadrant =  this.calcQuadrant(this.receiveX(this.ghostCells[0].x), this.receiveY(this.ghostCells[0].y))
                    this.setQuadrant(this.lastQuadrant)
                }
                if (this.ghostCells[0]){
                    this.quadrant = this.calcQuadrant(this.ghostCells[0].x, this.ghostCells[0].y)
                    this.realQuadrant = this.calcQuadrant(this.receiveX(this.ghostCells[0].x), this.receiveY(this.ghostCells[0].y))
                    this.lastQuadrant = this.quadrant
                } else {
                    this.quadrant = 4;
                }

                break;
            case 85:
                console.log(`[Client 1] Captcha requested`);
                if (window.master && window.master.recaptchaRequested) {
                    myCaptcha.widget!=null && grecaptcha.reset(myCaptcha.widget)
                    //window.recaptchaClientId!=null && grecaptcha.reset(window.recaptchaClientId)
                    agarCaptcha.requestCaptcha()
                    //grecaptcha.reset()
                    //grecaptcha.v3mode = false
                    //window.master.recaptchaRequested();
                    
                }
                break;
            case 102:
                var msg = new buffer.Buffer(view.buffer.slice(1));
                    this.onMobileData(msg);
                break;
            case 103:
                this.accessTokenSent = true;
              if(window.master.context == 'facebook') {//Yahnych
              this.sendFBIDS(window.master.fbUsers);
              }
                break;
            case 104:
                //window.logout && window.logout();
                break;
            case 114:
                console.error('[Agario] Spectate mode is full')
                break;
            case 160://Yahnych
                //this.arrowFB = [];
                let num =0
                let friendX = 0,
                    friendY = 0,
                    friendNick = null;
                for (; offset < view.byteLength;) {
                  num++
                            friendX = view.getUint16(offset, true);
                  if (friendX > 32250) {
                    friendX  -= 65500 ;
                  }
                            offset += 2;
                            friendY = view.getUint16(offset, true);
                  if (friendY > 32250) {
                    friendY  -= 65500 ;
                  }
                            offset += 2;
                if (offset < view.byteLength) {
                            friendNick = window.decodeURIComponent(window.escape(encode()));
                } else {
                            friendNick = "";
                }
                        //this.arrowFB.push({
                        //    nick: friendNick,
                        //    x: friendX,
                        //    y: friendY
                        //});   
                  console.log(num)
                  this.arrowFB[0].visible = true;
                  this.arrowFB[0].x = this.receiveX(friendX);
                  this.arrowFB[0].y = this.receiveY(friendY);
                  this.arrowFB[0].nick = friendNick!=""?friendNick:this.arrowFB[0].nick;
            }
                    break;
            case 161:
                  this.arrowFB[0].visible = false;
                break;
            case 176:
                this.battleRoyale.startTime = view.getUint32(offset, true);
                break;
            case 177:
                this.battleRoyale.joined = true;
                break;
            case 178:
                this.battleRoyale.players = view.getUint16(offset, true);
                offset += 2;
                var flags = view.getUint16(offset, true);
                offset += 2;
                if (!flags) {
                    this.battleRoyale.state = 0;
                    this.battleRoyale.joined = false;
                }
                if (flags & 3) {
                    this.battleRoyale.state = view.getUint8(offset++);
                    this.battleRoyale.x = view.getInt32(offset, true);
                    offset += 4;
                    this.battleRoyale.y = view.getInt32(offset, true);
                    offset += 4;
                    this.battleRoyale.radius = view.getUint32(offset, true);
                    offset += 4;
                    this.battleRoyale.shrinkTime = view.getUint32(offset, true) * 1000;
                    offset += 4;
                    if (this.battleRoyale.shrinkTime) {
                        this.battleRoyale.timeLeft = ~~((this.battleRoyale.shrinkTime - Date.now() + this.serverTimeDiff) / 1000);
                        if (this.battleRoyale.timeLeft < 0) {
                            this.battleRoyale.timeLeft = 0;
                        }
                    }
                }
                if (flags & 2) {
                    this.battleRoyale.targetX = view.getInt32(offset, true);
                    offset += 4;
                    this.battleRoyale.targetY = view.getInt32(offset, true);
                    offset += 4;
                    this.battleRoyale.targetRadius = view.getUint32(offset, true);
                }
                break;
            case 179:
                console.log(179)
                var flags = view.getUint8(offset);
                const string = window.decodeURIComponent(window.escape(encode()));
                let test = null;
                if (!flags) {
                    test = window.decodeURIComponent(window.escape(encode()));
                    console.log('179',string,test)
                }
                break;
            case 180:
                this.battleRoyale.joined = false;
                this.battleRoyale.rank = [];
                this.battleRoyale.playerRank = view.getUint32(offset, true);
                offset += 8;
                const royaleLength = view.getUint16(offset, true);
                offset += 2;
                for (var length = 0; length < royaleLength; length++) {
                    const name = window.decodeURIComponent(window.escape(encode()));
                    const place = view.getUint32(offset, true);
                    offset += 4;
                    this.battleRoyale.rank.push({
                        place: place,
                        name: name
                    });
                }
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
                console.log('[Client 1] Received protocol key:', this.protocolKey);
                const agarioReader = new Uint8Array(view.buffer, offset += 4);
                this.clientKey = this.generateClientKey(this.ws, agarioReader);
                if (window.master && window.master.login) {
                    window.master.login();
                }

                break;
            case 242:
                this.serverTime = view.getUint32(offset, true) * 1000;
                this.serverTimeDiff = Date.now() - this.serverTime;
                break;
            case 255:
                this.handleSubmessage(view);
                break;
            case 16:
                this.updateCells(new buffer.Buffer(view.buffer), offset);
                this.countPps()
                break;
            case 64:
                var message = new buffer.Buffer(view.buffer)
                this.viewMinX = message.readDoubleLE(offset);
                offset += 8;
                this.viewMinY = message.readDoubleLE(offset);
                offset += 8;
                this.viewMaxX = message.readDoubleLE(offset);
                offset += 8;
                this.viewMaxY = message.readDoubleLE(offset);

                this.setMapOffset(this.viewMinX, this.viewMinY, this.viewMaxX, this.viewMaxY);
                break;
            default:
                
                console.log(`[Client 1] Unknown opcode:`, view.getUint8(0));
                break;
        }
    },
    countPps() {
        if (!gameOptionSettings.showStatsPPS) {
            return;
        }
        const Time = Date.now();
        if (!this.ppsLastRequest) {
            this.ppsLastRequest = Time;
        }
        if (Time - this.ppsLastRequest >= 1000) {
            this.pps = this.totalPackets;
            this.totalPackets = 0;
            this.ppsLastRequest = Time;
        }
        this.totalPackets++;
    },
    onMobileData: function (msg) {
            if (msg == null) {
                return
            }
            const response = window.decodeMobileData(msg);
            console.log(response);
            this.unpackageMessage(response);
    },
    unpackageMessage: function (r) {
            //var returnMessage = r;

            var type = r.uncompressedData.type;
            switch (type) {
            case 71:
                console.log("returnMessage = r.get_softPurchaseResponseField();");
                break;
            case 74:
                console.log("returnMessage = r.get_inappPurchaseResponseField();");
                break;
            case 20:
                var u = r.uncompressedData.disconnectField;
                    this.disconnectMessage(u.reason);

                    this.loggedIn = false;
                    window.logout && window.logout();

                break;
            case 113:
                var u = r.uncompressedData.activateBoostResponseField;
                this.updateWalletInfo([u.productUpdates[0].userWalletItem]);
                this.displayActiveBoosts([u.userBoostItem]);
                break;
            case 11:
                this.user = {coins:0,
                             dna:0,
                             trophy:0,
                             boosts:{},
                             rushBoosts:{},
                             skins:{},
                             skinPieces:{},
                             potions:{},
                             potionsStatus:{},
                             skipBrew:{}};
                var u = r.uncompressedData.loginResponseField;
                
                if(window.coinsTimer) clearTimeout(window.coinsTimer);
                window.coinsTimer = setTimeout(()=>{window.autocoins()},3000);
                
                window.localStorage.setItem("getLatestID", u.latestConfiguration);
                
                this.updateWalletInfo(u.userWallet);
                
                this.displayActiveBoosts(u.userBoosts);
                
                this.user.stats = u.userStats;
                this.displayStats(u.userStats);
                
                this.updateEvents(u.userTimedEvents)
                
                this.displayActiveQuests(u.userActiveQuests);//FIX IT
                
                this.createSkinsHTML();
                
                this.updateUserSettings(u.userSettings)
                
                this.updateUserInfo(u.userInfo)

                this.updatePotions(u.userPotions)
                break;
            case 81:
                var u = r.uncompressedData.updateUserSettingsResponseField;
                this.updateUserSettings(u.updatedUserSettings)
                break;
            case 111:
                var u = r.uncompressedData.activateTimedEventResponseField;
                this.updateProducts(u.productUpdates);
                this.updateEvents([u.userTimedEvent])
                break;
            case 76:
                console.log("returnMessage = r.get_purchaseWalletUpdatesField();");
                break;
            case 62:
                var u = r.uncompressedData.gameOverField;
                this.displayStats(u.userStats);
                var exp = 100,
                    i = u.xpLevelUpdates[0];
                if(i.finalLevel!=100) exp = ~~(i.finalXpForLevel*100/this.agarExp(i.finalLevel));
                $('.progress-bar-striped').width(exp + '%');
                $('.progress-bar-star').text(i.finalLevel);
                this.updateProducts(u.productUpdates);
                if(u.potionInfo&&u.potionInfo.newUserPotion){
                  this.newPotion(u.potionInfo.newUserPotion);
                };
                this.showSessionStats(u.gameSessionStats);
                break;
            case 75:
                console.log("returnMessage = r.get_walletUpdatesField();");
                break;
            case 116:
                console.log("returnMessage = r.get_userTimedEventUpdatesField();");
                break;
            case 33:
                console.log("returnMessage = r.get_configurationChangeField();");
                break;
            case 101:
                console.log("returnMessage = r.get_claimGiftsResponseField();");
                break;
            case 115:
                var u = r.uncompressedData.activateQuestResponseField;
                this.updateProducts(u.productUpdates);
                this.displayActiveQuests([u.userQuest])
                break;
            case 78:
                console.log("returnMessage = r.get_offerBundleResponseField();");
                break;
            case 123:
                var u = r.uncompressedData.brewPotionForSlotResponseField;
                this.updatePotions(u.userPotions)
                break;
            case 121:
                console.log("returnMessage = r.get_openPotionForProductResponseField();");
                break;
            case 125:
                var u = r.uncompressedData.openPotionForSlotResponseField;
                this.updateProducts(u.productUpdates);
                this.updatePotions(u.userPotions)
                break;
            case 131:
                console.log("returnMessage = r.get_userLeaguesInfoResponseField();");
                break;
            case 132:
                console.log("returnMessage = r.get_userLeaguesPassUpdateField();");
                break;
            case 83:
                console.log("returnMessage = r.get_userStatsResponseField();");
                break;
            case 105:
                console.log("returnMessage = r.get_facebookInvitationRewardUpdatesField();");
                break;
            case 22:
                console.log("returnMessage = r.get_noProperResponseField();");
                break;
            case 184:
                console.log("returnMessage = r.get_activateRewardLinkResponseField();");
                break;
            case 186:
                console.log("returnMessage = r.get_genericVideoAdRewardTokenResponseField();");
                break;
            case 151:
                console.log("returnMessage = r.get_userSkinsCreateResponseField();");
                break;
            case 170:
                var u = r.uncompressedData.actionCountersUpdateField,
                    prev = this.user.actionCounters;
                if(u.potionsObtained>prev.potionsObtained)  toastr.info(`New potion`);
                if(u.questsCompleted>prev.questsCompleted)  toastr.info(`Quest completed`);
                if(u.skinsCreated>prev.skinsCreated)  toastr.info(`Skin created`);
                break;
            default:
                //null
                console.log("unknown type",type)            
            }
            //return returnMessage
        },
    disconnectMessage(type) {
        switch (type) {
            case 1:
                toastr.error('User disconnected. Incompatible client')
                break;
            case 2:
                toastr.error('User disconnected. Packet not authorized')
                break;
            case 3:
                toastr.error('User disconnected. Login elsewhere')
                break;
            case 4:
                toastr.error('User disconnected. Server offline')
                break;
            case 5:
                toastr.error('User disconnected. User banned')
                break;
            case 6:
                toastr.error('User disconnected. Ping error')
                break;
            case 7:
                toastr.error('User disconnected. Unknown game type')
                break;
            case 8:
                toastr.error('User disconnected. Too many operations')
                break;
            case 9:
                toastr.error('User disconnected. Unreachable realm')
                break;
            case 10:
                toastr.error('User disconnected. User deleted')
                break;
            case 11:
                toastr.error('User disconnected. Not authorized by realm')
                break;
            case 12:
                toastr.error('User disconnected. Bad request')
                break;
            case 13:
                toastr.error('User disconnected. Reset by peer')
                break;
            case 14:
                toastr.error('User disconnected. Invalid token')
                break;
            case 15:
                toastr.error('User disconnected. Expired token')
                break;
            case 16:
                toastr.error('User disconnected. State transfer error')
                break;
            default:
                toastr.error('User disconnected. Unknown error: ' + type)
        }
    },
    updateProducts(prod){
      for(var i=0;i<prod.length;i++){
        this.updateWalletInfo([prod[i].userWalletItem])
      }
    },
    updateWalletInfo(items){
      for(var i=0; i<items.length; i++){
         var type = items[i].type;
         switch (type) {
            case 1:
                        var name = items[i].productId;
                        switch (name) {
                                case "coin":
                                              this.user.coins = items[i].amount;
                                              $("#coins").html(`💰`+this.user.coins);
                                              break;
                                case "dna":
                                              this.user.dna = items[i].amount;
                                              $("#dna").html(`🧬`+this.user.dna);
                                              break;
                                case "create_skin_token_for_vip_weekly":
                                              //this.user.skinCreateVIPTokens = items[i].amount;
                                              break;
                                default:
                                              console.log("unknown item",items[i])   
                        }
                break;
            case 2:
                        this.user.boosts[items[i].productId] = items[i].amount;
						            $('#s-boost option[value=\"' + items[i].productId + '\"]').text(' (' + items[i].amount + ') '+ ' ['+ application.boostsInfo[items[i].productId].price + ']  ' + application.boostsInfo[items[i].productId].name);
                break;
            case 3:
                        /*var name = items[i].productId;
                        if (name.includes && name.includes("_level_")) {
                          var level = name[name.length-1],
                              s = name.slice(0,name.length-1);
                          console.log(s, level)
                          if(level == "1") {
                            if(this.user.skins.hasOwnProperty(s+"2")) {break;}
                            if(this.user.skins.hasOwnProperty(s+"3")) {break;}
                          } else if(level == "2") {
                            if(this.user.skins.hasOwnProperty(s+"1")) {
                              //this.user.skins[name+"1"].disabled = true;
                              delete this.user.skins[s+"1"];}
                            if(this.user.skins.hasOwnProperty(s+"3")) {break;}
                          } else if(level == "3") {
                            if(this.user.skins.hasOwnProperty(s+"1")) {
                              //this.user.skins[name+"2"].disabled = true;
                              delete this.user.skins[s+"1"];}
                            if(this.user.skins.hasOwnProperty(s+"2")) {
                              //this.user.skins[name+"2"].disabled = true;
                              delete this.user.skins[s+"2"];}
                          }
                        }*/
                        var skin = this.getLink(items[i].productId);
                        if(skin){
                        var url = this.urlReplaces.hasOwnProperty(skin[0])?this.urlReplaces[skin[0]]:skin[0],
                            pID = items[i].productId;
                        if(pID.includes("_level_") && this.user.skins.hasOwnProperty(skin[0])){
                          if(Number(pID[pID.length-1])<Number(this.user.skins[skin[0]].productId[pID.length-1])){
                            pID = this.user.skins[skin[0]].productId;
                          }
                        } 
                        this.user.skins[skin[0]] = {amount:items[i].amount,type:skin[1],url:url, productId: pID};
                        } else {console.log("undefined skin", items[i].productId, skin ) };
                break;
            case 4:
                        if(items[i].amount>0) window.activateQuest();
                break;
            case 5:
                        this.user.rushBoosts[items[i].productId] = items[i].amount;
                break;
            case 6:
                        this.user.potions[items[i].productId] = items[i].amount;
                break;
            case 7:
                        this.user.trophy = items[i].amount;
                        $("#trophy").html(`🏆`+this.user.trophy);
                break;
            case 8:
                        this.user.skinPieces[items[i].productId] = items[i].amount;
                break;
            case 9:
                        this.user.skipBrew[items[i].productId] = items[i].amount;
                break;
            case 10:
                        //this.user.skinCreateTokens = items[i].amount;
                break;
            case 11:
                        var skin = this.getLink(items[i].productId),
                            url = this.urlReplaces.hasOwnProperty(skin[0])?this.urlReplaces[skin[0]]:skin[0];
                        if(skin) this.user.skins[skin[0]] = {amount:items[i].amount,type:skin[1],url:url, productId: items[i].productId};
                break;
            case 12:
                        //this.user.gameContinueToken = items[i].amount;
                break;
            case 13:
                        var name = items[i].productId;
                        switch (name) {
                                case "arena_event_token":
                                              //this.user.arenaEventToken = items[i].amount;
                                              break;
                                case "season_token":
                                              //this.user.seasonToken = items[i].amount;
                                              break;
                                default:
                                              console.log("unknown item",items[i])   
                        }
                break;
            case 14:
                        //this.user.videoRewards = items[i].amount;
                break;
            default:
                console.log("unknown item",items[i])            
         }
      }
    },
    showSessionStats(u){
      toastr.info(`
Final mass: ${u.finalMass}<br>
Final position: ${u.finalPosition}<br>
Food eaten: ${u.foodEaten}<br>
Highest mass: ${u.highestMass}<br>
Longest time alive: ${u.longestTimeAlive}<br>
Mass consumed: ${u.massConsumed}<br>
Normal cells eaten: ${u.normalCellsEaten}<br>
Players eaten: ${u.playersEaten}<br>
Time in leaderboard: ${u.timeInLeaderboard}<br>
Total time: ${u.timeTotal}<br>
Top position: ${u.topPosition}<br>
Viruses eaten: ${u.virusesEaten}`)
    },
    updateEvents(event){
      if(event.length==0) window.questActivationReq()
      for(var i=0; i<event.length; i++){
        var e = event[i],
            type = e.eventId,
            timer = e.nextAvailableInSeconds*1000;
        switch (type) {
            case "dailyQuest":
                 if(window.dailyQuestTimer) clearTimeout(window.dailyQuestTimer);
                 window.dailyQuestTimer = setTimeout(()=>{window.questActivationReq()},timer);
                break;
            case "hourlyBonus":
                 if(window.coinsTimer) clearTimeout(window.coinsTimer);
                 window.coinsTimer = setTimeout(()=>{window.autocoins()},timer);
                break;
            case "potionSkipBrew"://maybe it help to autobrewing
                 console.log("can open after", timer/60000)
                 //if(window.coinsTimer) clearTimeout(window.coinsTimer);
                 //window.coinsTimer = setTimeout(()=>{window.activateQuest()},timer);
                break;
            default:
                  console.log("unknown event", e)
        }
      }
    },
    newPotion(s) {
      if(window.autobrewTimer) clearTimeout(window.autobrewTimer);
      window.autobrewTimer = setTimeout(()=>{Connection.autobrew()},3000);
          var t = s.productId,
              r = s.secondsRemaining,
              potion = "potion"+s.slot,
              time = new Date(Date.now()+r*1000),
              expire = time.toTimeString().replace(/^(\d{2}:\d{2}).*/, '$1');
        this.user.potionsStatus[potion]={type:t,status: s.status, expires: time,slot:s.slot};
        $(`#${potion} img`).attr('src', `https://blooming-tulip.glitch.me/dead/img/${t}.png`);
        if(s.status==1) {
          if(gameOptionSettings.autobrewing&&this.user.brewingEnd<Date.now()) window.brewPotion(s.slot);
          $(`#${potion} img`).css("border-color", "red");
          $(`#${potion} div`).css("border-color", "red");
          $(`#${potion} div`).text('brew');
        } ;
      
      this.user.emptySlots -= 1;
    },
    updatePotions(slots){
      var empty = ["potion1","potion2","potion3"];
      this.user.brewedSlots = 0;
      if(window.autobrewTimer) clearTimeout(window.autobrewTimer);
      window.autobrewTimer = setTimeout(()=>{Connection.autobrew()},3000);
      for(var i=0;i<slots.length;i++){
        var s = slots[i],
              t = s.productId,
              r = s.secondsRemaining,
              potion = "potion"+s.slot,
              time = new Date(Date.now()+r*1000),
              expire = time.toTimeString().replace(/^(\d{2}:\d{2}).*/, '$1'),
              index = empty.indexOf(potion);
        if(index>-1) empty.splice(index, 1);
        this.user.potionsStatus[potion]={type:t,status: s.status, expires: time,slot:s.slot};
        $(`#${potion} img`).attr('src', `https://blooming-tulip.glitch.me/dead/img/${t}.png`);
        if(s.status==1) {
          $(`#${potion} img`).css("border-color", "red");
          $(`#${potion} div`).css("border-color", "red");
          $(`#${potion} div`).text('brew');
        } else if(s.status==2) {
          this.user.brewingEnd = time;
          if(window.autobrewTimer) clearTimeout(window.autobrewTimer);
          window.autobrewTimer = setTimeout(()=>{Connection.autobrew()},r*1000);
          $(`#${potion} img`).css("border-color", "yellow");
          $(`#${potion} div`).css("border-color", "yellow");
          $(`#${potion} div`).text(expire);
        } else if(s.status==3) {
          this.user.brewedSlots ++;
          $(`#${potion} img`).css("border-color", "green");
          $(`#${potion} div`).css("border-color", "green");
          $(`#${potion} div`).text('open');
        };
      }
      this.user.emptySlots = empty.length;
      empty.forEach((potion)=>{
          $(`#${potion} img`).attr('src', `https://blooming-tulip.glitch.me/dead/img/potion_empty.png`);
          $(`#${potion} img`).css("border-color", "grey");
          $(`#${potion} div`).css("border-color", "grey");
          $(`#${potion} div`).text('empty');
      })
    },
    autobrew(){
      if(gameOptionSettings.autobrewing&&(window.master.context=="facebook"||window.master.context=="google")){
        for(var potion of Object.values(Connection.user.potionsStatus)){
          if(potion.status==1){
            window.brewPotion(potion.slot);
            break;
          }
        };
      }
    },
    getPotionForOpen(){
      if((window.master.context=="facebook"||window.master.context=="google")){
        for(var potion of Object.values(Connection.user.potionsStatus)){
          if(potion.status==3||(potion.status==2&&this.user.brewingEnd<Date.now())){
            window.openPotion(potion.slot);
            break;
          }
        };
      }
    },
    updateUserSettings(s) {
      for(var i=0; i<s.length; i++){
         var key = s[i].key;
         switch (key) {
            case 1:
                   var skin = this.getLink(s[i].valueString),
                       url = this.urlReplaces.hasOwnProperty(skin[0])?this.urlReplaces[skin[0]]:skin[0];
                   $('.vanilla-skin-preview').attr('src', url);
                break;
            case 2:
                   //stop moving on relise (1,0)
                break;
            case 3:
                   //direction on touch (1,0)
                break;
            case 4:
                   //touch button position (string)
                break;
            case 5:
                   //show mass (1,0)
                break;
            case 6:
                   //show arrow(to cursor) (1,0)
                break;
            case 7:
                   //dark theme (1,0)
                break;
            case 8:
                   //show level (1,0)
                break;
            case 9:
                   //language (string)
                break;
            case 10:
                   //game sounds (1,0)
                break;
            case 11:
                   //menu sounds (1,0)
                break;
            case 12:
                   //show quest (1,0)
                break;
            case 13:
                   //show quest (1,0)
                   this.user.showOnline = s[i].valueInt32;//FIX IT
                break;
            default:
                console.log("unknown settings",s[i])            
         }
      }
    },
    urlReplaces: {},
    getImg(url, name, callback) {
        const app = this;
        var img = new Image();
        img.crossOrigin = `Anonymous`;
        img.setAttribute("alt",name);
        img.onload = function() {
            if (this.complete && this.width && this.height) {
                callback(img);
            }
        };
        img.onerror = function() {
            console.log("error loading image: "+ url);
            if (url.includes('configs-web.agario.miniclippt')) {
                var newURL = "https://raw.githubusercontent.com/Yahnych/vanilla_skins/master/agar/" + url.split('/').pop();
                app.urlReplaces[url] = newURL;
                console.log("new destination is: " + newURL);
                app.user.skins[url].url = newURL;
                app.getImg(newURL, name, callback);
                return newURL;

            } else if (url.includes('vanilla_skins/master/agar')) {
                if(!application.brokenSkins.hasOwnProperty(url)){
                   application.brokenSkins[url] = 1;
                   application.messageToDiscord('Unknown skin: ', url);
                }
                return url;
            }
        };
        img.src = url;
    },
    getLink(link) {
      var type = "premium";
            if (link != null) {

                if (link.includes && link.includes("custom_")) {
                    type = "custom";
                    return ["https://configs.agario.miniclippt.com/live/custom_skins/" + link + ".png",type];
                } else if (link.includes && link.includes("_level_")) {
                    type = "potion";
                    var link1 = link.replace('skin_', '')
                    link1 = link1.replace('_level_1', '').replace('_level_2', '').replace('_level_3', '');
                    link1 = link1.charAt(0).toUpperCase() + link1.slice(1);
                    link1 = makeUpperCaseAfterUnderline(link1);
                    return ["https://configs-web.agario.miniclippt.com/live/" + window.agarversion + link1 + ".png", type];
                } else if (window.LMAgarGameConfiguration != undefined) {
                    for (var player = 0; player < window.EquippableSkins.length; player++) {
                        if (window.EquippableSkins[player].productId == link && window.EquippableSkins[player].image != "uses_spine") {
                            return ["https://configs-web.agario.miniclippt.com/live/" + window.agarversion + window.EquippableSkins[player].image, type];
                        }
                    }
                }
            }
    },
    createSkinsHTML() {
      const s = this.user.skins;
      $("#player-skins").html(``);
      var callback = function(img){
         img.style = "display:inline-block;width:100px;height:100px;border-radius: 50px;";
         $("#player-skins").append(img);
      };
      for(var [key,value] of Object.entries(s)){
        //if(value.hasOwnProperty('disabled')) return;
        this.getImg(value.url, value.productId, callback);
      }
    },
    displayActiveBoosts(items){
      for(var i=0; i<items.length; i++){
        var item = items[i];
                if(item.productId[0]=="x") {
                  $("#xp-active").html(`${application.boostsInfo[item.productId].name} expires at ${new Date(Date.now()+item.expiresInSeconds*1000).toTimeString().replace(/^(\d{2}:\d{2}).*/, '$1')}`)
                } else if(item.productId[0]=="m") {
                  $("#mass-active").html(`${application.boostsInfo[item.productId].name} expires at ${new Date(Date.now()+item.expiresInSeconds*1000).toTimeString().replace(/^(\d{2}:\d{2}).*/, '$1')}`)
                }
      }
    },
    displayActiveQuests(items){
      if(items.length==0) window.questActivationReq()
      for(var i=0; i<items.length; i++){
        var item = items[i],
            type = item.type;
        switch (type) {
            case "normal_cells_eaten":
                  $("#quest-active").html(`Eat ${item.goal} cells. Expires at ${new Date(Date.now()+item.expiresInSeconds*1000).toTimeString().replace(/^(\d{2}:\d{2}).*/, '$1')}`)
                break;
            case "viruses_eaten":
                  $("#quest-active").html(`Eat ${item.goal} viruses. Expires at ${new Date(Date.now()+item.expiresInSeconds*1000).toTimeString().replace(/^(\d{2}:\d{2}).*/, '$1')}`)
                break;
            case "food_eaten":
                  $("#quest-active").html(`Eat ${item.goal} dots. Expires at ${new Date(Date.now()+item.expiresInSeconds*1000).toTimeString().replace(/^(\d{2}:\d{2}).*/, '$1')}`)
                break;
            case "highest_mass":
                  $("#quest-active").html(`Reach ${item.goal} mass. Expires at ${new Date(Date.now()+item.expiresInSeconds*1000).toTimeString().replace(/^(\d{2}:\d{2}).*/, '$1')}`)
                break;
            case "top_position":
                  $("#quest-active").html(`Reach TOP-${item.goal} position. Expires at ${new Date(Date.now()+item.expiresInSeconds*1000).toTimeString().replace(/^(\d{2}:\d{2}).*/, '$1')}`)
                break;
            case "time_total":
                  $("#quest-active").html(`Survive ${item.goal/60} minutes. Expires at ${new Date(Date.now()+item.expiresInSeconds*1000).toTimeString().replace(/^(\d{2}:\d{2}).*/, '$1')}`)
                break;
            default:
                  $("#quest-active").html(`${type} : ${item.goal}. Expires at ${new Date(Date.now()+item.expiresInSeconds*1000).toTimeString().replace(/^(\d{2}:\d{2}).*/, '$1')}`)
        }
      }
    },
    displayStats(s){
      $("#stats-content").html(`
All time score     : ${s.allTimeScore}<br/>
Games played      : ${s.gamesPlayed}<br/>
Highest mass      : ${s.highestMass}<br/>
Longest time alive : ${(s.longestTimeAlive/3600).toFixed(3)} H<br/>
Mass consumed     : ${s.massConsumed}<br/>
Most cells eaten   : ${s.mostCellsEaten}
      `)
    },
    updateUserInfo(i) {
      var exp = 100;
      if(i.level!=100) exp = ~~(i.xp*100/this.agarExp(i.level));
      $('.progress-bar-striped').width(exp + '%');
      $('.progress-bar-star').text(i.level);
      this.user.actionCounters = i.actionCounters;
      $("#user-info").html(`
Account age     : ${~~(i.accountAge/3600/24)}D<br/>
Potions obtained : ${i.actionCounters.potionsObtained}<br/>
Quests completed      : ${i.actionCounters.questsCompleted}<br/>
Skins created : ${i.actionCounters.skinsCreated}<br/>
Country     : ${i.latestCountryCode}<br/>
Game name     : ${i.displayName}<br/>
Game Id   : ${i.userId}
      `)
    },
    agarExp(q) {
      var s = {};
      var i = 0, exp = 0;
      for(i = 1; i <= q; i++) { exp += i * 100; }
      exp -= 500;
      if(q <= 4) { exp = q == 1 ? 50 : q == 2 ? 125 : q == 3 ? 250 : 500; }
      return exp
    },
    handleSubmessage(message) {

        message = this.decompressMessage(message);

        let offset = 0;
        switch (message.readUInt8(offset++)) {
            case 16:
                this.updateCells(message, offset);
                this.countPps()
                break;
            case 64:
                this.viewMinX = (message.readDoubleLE(offset));
                offset += 8;
                this.viewMinY = (message.readDoubleLE(offset));
                offset += 8;
                this.viewMaxX = (message.readDoubleLE(offset));
                offset += 8;
                this.viewMaxY = (message.readDoubleLE(offset));

                this.setMapOffset(this.viewMinX, this.viewMinY, this.viewMaxX, this.viewMaxY);
                break;
            default:
                console.log(`[Connection] Unknown sub opcode:`, message.readUInt8(0));
                break;
        }
    },
    flipX(x){
        return !this.mirrorH?x: this.mapMaxX - (x - this.mapMinX)
        //return !this.mirrorH?x:-x
    },
    flipY(y){
        return !this.mirrorV?y: this.mapMaxY - (y - this.mapMinY)
        //return !Connection.mirrorV?y:-y
    },
    setQuadrant(n){
        //if(this.gameMode == ':party') return false;
        var prevV = this.mirrorV, prevH = this.mirrorH
        if(n == undefined){
            this.mirrorV = false
            this.mirrorH = false
        }
        if(      this.realQuadrant == 0){
            this.mirrorV = n==2||n==3
            this.mirrorH = n==1||n==2
        }else if(this.realQuadrant == 1){
            this.mirrorV = n==2||n==3
            this.mirrorH = n==0||n==3
        }else if(this.realQuadrant == 2){
            this.mirrorV = n==1||n==0
            this.mirrorH = n==0||n==3
        }else if(this.realQuadrant == 3){
            this.mirrorV = n==1||n==0
            this.mirrorH = n==1||n==2
        }

        if(prevV!=this.mirrorV||prevH != this.mirrorH){
            console.log('Q - changed')
            for (var id in this.indexedCells){
                this.indexedCells[id].x=this.flipX(this.indexedCells[id].x)
                this.indexedCells[id].y=this.flipY(this.indexedCells[id].y)
                this.indexedCells[id].targetX=this.flipX(this.indexedCells[id].targetX)
                this.indexedCells[id].targetY=this.flipY(this.indexedCells[id].targetY)
                

            }
        }
        //this.mirrorH = ((this.realQuadrant == 1 || this.realQuadrant == 0) && (n == 2 || n == 3)) || ((this.realQuadrant == 2 || this.realQuadrant == 3) && (n == 1 || n == 0))
        //this.mirrorV = ((this.realQuadrant == 1 || this.realQuadrant == 2) && (n == 0 || n == 3)) || ((this.realQuadrant == 0 || this.realQuadrant == 3) && (n == 1 || n == 2))
    },
    calcQuadrant(x, y) {
        var ofs = 150;
        var calc = (x < this.mapMidX + ofs && x > this.mapMidX - ofs) || (y < this.mapMidY + ofs && y > this.mapMidY - ofs) ? 4 : x >= this.mapMidX && y < this.mapMidY ? 0 : x < this.mapMidX && y < this.mapMidY ? 1 : x < this.mapMidX && y >= this.mapMidY ? 2 : 3;
        
        //var calc = (x < this.mapOffsetX + ofs && x > this.mapOffsetX - ofs) || (y < this.mapOffsetY + ofs && y > this.mapOffsetY - ofs) ? 4 : x >= this.mapOffsetX && y < this.mapOffsetY ? 0 : x < this.mapOffsetX && y < this.mapOffsetY ? 1 : x < this.mapOffsetX && y >= this.mapOffsetY ? 2 : 3;
        /*if ((window.legendmod.lbgpi == 4 || calc == 4 || window.legendmod.lbgpi == calc) && window.legendmod.delstate < 0) {
            window.legendmod.lbgpi = calc;
            return calc;
        } else if (window.legendmod.lbgpi != calc) {
            window.legendmod.delstate = 0;
            window.legendmod.lbgpi = calc;
            return 4;
        } else {
            window.legendmod.lbgpi = calc;
            return 4;
        }*/
        return calc
    },
    handleLeaderboard() {
        let text = '';
        let teamText = '';
        for (var length = 0; length < this.leaderboard.length; length++) {
            let html = '<span>';
            if (this.leaderboard[length].isFBFriend) {
                var teamboardskin = application.getCustomSkin(this.leaderboard[length].isFBFriend, '#000000')
                  if (teamboardskin == null) {
                      teamboardskin = new Image();
                      teamboardskin.crossOrigin = 'anonymous';
                      teamboardskin.src = "https://legendmod.ml/banners/icon32croped.ico.gif";
                  }
                  let skinhtml = '<span style="margin-left: 0px; margin-top: 0px; width: 24px; height: 24px; display: inline-block;" alt="">' +
                                teamboardskin.outerHTML + '</span>';
                  html = `<span class="teammate">`;
                    text += `${html + (length + 1)}${skinhtml}${application.escapeHTML(this.leaderboard[length].nick)}</span>`;
            } else if (this.leaderboard[length].isFriend ) {
                  html = `<span class="teammate">`;
                  text += `${html + (length + 1)}. ${application.escapeHTML(this.leaderboard[length].nick)}</span>`;
            } else if (length >= gameOptionSettings.leaderboardLength) {
                    
            } else {
            if (this.leaderboard[length].id === `isPlayer` ) {
                html = `<span class="me">`;
            } else {
                if (mainProfile.clanTag.length && this.leaderboard[length].nick.indexOf(mainProfile.clanTag) == 0 ) {
                    html = `<span class="teammate">`;
                } else if (this.leaderboard[length].isFriend || this.leaderboard[length].isFBFriend) {
                    html = `<span class="teammate">`;
                }
            }
            text += `${html + (length + 1)}. ${application.escapeHTML(this.leaderboard[length].nick)}</span>`;
            }
        }
        if (this.playerPosition > gameOptionSettings.leaderboardLength) {
            text += `<span class="me">${this.playerPosition}. ${application.escapeHTML(this.playerNick)}</span>`;
        }
        text+='<span class="me">Total : '+this.leaderboard.length+'</span>'
        text+='<span class="teammate">Friends : '+ Connection.friends+'</span>'

      
  
        if (gameOptionSettings.showLbData) {

            for (var l2ngth = 0; l2ngth < this.ghostCells.length; l2ngth++) {
                if (l2ngth == gameOptionSettings.leaderboardLength) {
                    break;
                }
                teamText += '<span class="lb-data">';
                teamText += `<span class="top5-mass-color">` + application.shortMassFormat(this.ghostCells[l2ngth].mass) + `</span>`;
                teamText += '<span class="hud-main-color">[' + application.calculateMapSector(this.ghostCells[l2ngth].x + Connection.mapOffsetX, this.ghostCells[l2ngth].y+Connection.mapOffsetY) + ']</span>', teamText += '</span>';
            }
        }
        application.displayLeaderboard(text, teamText);
    },
    flushCellsData() {
        for(let value of Object.values(this.indexedCells)) {
            value.removeCell()
         }
        this.isFreeSpectate = false
        this.isSpectateEnabled = false
        this.quadrant = null
        this.realQuadrant = null
        this.lastQuadrant =  this.lastQuadrant = this.ws != this.lastws? null :this.lastQuadrant
        this.mirrorH = false
        this.mirrorV = false
        this.ghostCellsStep = 0
        this.ghostCells = []

        this.indexedCells = {};
        this.accounts = {};
        this.cells = [];
        this.playerCells = [];
        this.playerCellIDs = [];
        this.ghostCells = [];
        this.food = [];
        this.viruses = [];
        window.spects.forEach((spect)=>{spect.closeConnection()})
        window.spects = [];
    },
unshrinkX(x){return x / this.mapShrinkW},
unshrinkY(y){return y / this.mapShrinkH},
shrinkX(x){return x * this.mapShrinkW},
shrinkY(y){return y * this.mapShrinkH},

unshiftX(x){return x-(-this.mapShiftX)},
unshiftY(y){return y-(-this.mapShiftY)},
shiftX(x,sh){return !sh?x-this.mapShiftX:x},
shiftY(y,sh){return !sh?y-this.mapShiftY:y},


invflipX(x){return !!this.mirrorH?x: this.mapMaxX - (x - this.mapMinX)},
invflipY(y){return !!this.mirrorV?y: this.mapMaxY - (y - this.mapMinY)},
flipX(x){return !this.mirrorH?x: this.mapMaxX - (x - this.mapMinX)},
flipY(y){return !this.mirrorV?y: this.mapMaxY - (y - this.mapMinY)},

receiveX(x){
    x = this.shrinkX(x)
    x = this.shiftX(x)
    x = this.flipX(x)
    return x
},
receiveY(y){
    y = this.shrinkY(y)
    y = this.shiftY(y)
    y = this.flipY(y)
    return y
},
serverX(x){
    x = this.flipX(x)
    x = this.unshiftX(x)
    x = this.unshrinkX(x)
    return x
},
serverY(y){
    y = this.flipY(y)
    y = this.unshiftY(y)
    y = this.unshrinkY(y)
    return y
},
setMapOffset(left, top, right, bottom) {
    if ((right - left) > 14000 && (bottom - top) > 14000) {
        if(this.mapOffsetFixed) return;
        var side = 14142.135623730952
        this.mapShrinkW = side / (right-left)
        this.mapShrinkH = side / (bottom-top)
        console.log(this.mapShrinkW, this.mapShrinkH)
        left  = this.shrinkX( left, (right-left), side)
        top   = this.shrinkY( top, (bottom-top), side)
        right = this.shrinkX( right, (right-left), side)
        bottom =this.shrinkY( bottom, (bottom-top), side)

        this.mapShiftY=0
        this.mapShiftX=0
        var prX=-((right-left)/2),
            prY=-((bottom-top)/2),
            ofX=0,ofY=0


        let diffX = prX-left+ofX
        let diffY = prY-top+ofY

        this.mapShiftX=ofX-diffX
        this.mapShiftY=ofY-diffY

        //left  = this.flipX(left)
        //top   = this.flipY(top)
        //right = this.flipX(right)
        //bottom =this.flipY(bottom)

        left  = this.shiftX(left)
        top   = this.shiftY(top)
        right = this.shiftX(right)
        bottom =this.shiftY(bottom)

/////////////////////////////////////////////////

        this.mapOffsetX = ((right-left)/2) - right;
        this.mapOffsetY = ((bottom-top)/2) - bottom;

        this.mapMinX = left
        this.mapMinY = top
        this.mapMaxX = right
        this.mapMaxY = bottom
        this.mapMidX = (this.mapMaxX + this.mapMinX) / 2;
        this.mapMidY = (this.mapMaxY + this.mapMinY) / 2;

        if (!this.mapOffsetFixed) {
            this.viewX = (right + left) / 2;
            this.viewY = (bottom + top) / 2;
            //application.emit('offset',this)
        }
            window.user.offsetX = this.mapOffsetX;//Yahnych
            window.user.offsetY = this.mapOffsetY;
        this.mapOffsetFixed = true;
        //application.emit('offset',this)
        console.log(`[Client 1] Map offset fixed (x, y):`, this.mapOffsetX, this.mapOffsetY);
        if(!this.play&&!gameOptionSettings.normalLb) this.sendSpectate();
            if(gameOptionSettings.fullSpectator && spects.length==0) {
                addFullSpectator();
            } else if(gameOptionSettings.ingameSpectator && spects.length==0) {
                addSpectator();
            }
    }else{
        this.viewportMinX = this.receiveX(left)
        this.viewportMinY = this.receiveY(top)
        this.viewportMaxX = this.receiveX(right)
        this.viewportMaxY = this.receiveY(bottom)
    }
},
    isInView(x, y, size) {
        var x2s = this.canvasWidth / 2 / this.scale;
        var y2s = this.canvasHeight / 2 / this.scale;
        if (x + size < this.viewX - x2s || y + size < this.viewY - y2s || x - size > this.viewX + x2s || y - size > this.viewY + y2s) {
            return false;
        }
        return true;
    },
    vanillaskins(name, link, nick) {
            if (link != null && application.customSkinsMap[name] == undefined) {
                /*if (Connection.gameMode == ":party") {
                    name = name + "#000000";
                }*/
                //console.log(g)					
                if (window.FreskinsMap && window.FreskinsMap.includes(nick)) {
                    for (var player = 0; player < window.FreeSkins.length; player++) {
                        if (nick == window.FreeSkins[player].id) {
                            application.cacheCustomSkin(nick, null, "https://configs-web.agario.miniclippt.com/live/" + window.agarversion + window.FreeSkins[player].image);
                            //console.log("https://configs-web.agario.miniclippt.com/live/" + window.agarversion + window.FreeSkins[player].image)
                        }
                    }
                } else if (link.includes && link.includes("%custom_") && !legendflags.includes(LowerCase(name))) {//working
                    var link1 = link.replace('%custom_', 'skin_custom_')
                    //application.cacheCustomSkin(nick, null, window.localStorage.getItem("EnvConfig.custom_skins_url") + link1 + ".png");
                    application.cacheCustomSkin(name, null, "https://configs.agario.miniclippt.com/live/custom_skins/" + link1 + ".png");
                } else if (link.includes && link.includes("_level_") && !legendflags.includes(LowerCase(nick))) {//working, need fix
                    var link1 = link.replace('%', '')
                    link1 = link1.replace('_level_1', '').replace('_level_2', '').replace('_level_3', '');
                    link1 = link1.charAt(0).toUpperCase() + link1.slice(1);
                    link1 = makeUpperCaseAfterUnderline(link1);
                    application.cacheCustomSkin(name, null, "https://configs-web.agario.miniclippt.com/live/" + window.agarversion + link1 + ".png");
                    window.customskinanimated = true;
                } else if (gameOptionSettings.vanillaSkins == true && window.LMAgarGameConfiguration != undefined) {
                    for (var player = 0; player < window.EquippableSkins.length; player++) {
                        if (window.EquippableSkins[player].productId == "skin_" + link.replace('%', '') && window.EquippableSkins[player].image != "uses_spine") {
                            //console.log("Player: " + y + " Color: " + EquippableSkins[player].cellColor + " Image: " + EquippableSkins[player].image + " SkinId: " + EquippableSkins[player].gameplayId + " Skins type: " + EquippableSkins[player].skinType);                                
                            if (legendflags.includes(LowerCase(nick))) {
                                //console.log("[Legend mod Express] " + LowerCase(y) + " skin found. Skin registered");
                                application.cacheCustomSkin(nick, null, "https://legendmod.ml/agario/live/flags/" + LowerCase(nick) + ".png");
                            } else {
                                //core.registerSkin(y, null, "https://configs-web.agario.miniclippt.com/live/" + window.agarversion + window.EquippableSkins[player].image, null);
                                application.cacheCustomSkin(name, null, "https://configs-web.agario.miniclippt.com/live/" + window.agarversion + window.EquippableSkins[player].image);
                            }
                        }
                    }
                }
            }
    },
    hslToRgb(h, s, l){
        var r, g, b;
    
        if(s == 0){
            r = g = b = l; // achromatic
        }else{
            var hue2rgb = function hue2rgb(p, q, t){
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }
    
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
    
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    },
    hslToHex(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;
    if (s === 0) {
    r = g = b = l; // achromatic
    } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
    }
    const toHex = x => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    },
    updateCells(view, offset) {
        const encode = () => {
            for (var text = '';;) {
                const string = view.readUInt8(offset++);
                if (string == 0) {
                    break;
                }
                text += String.fromCharCode(string);
            }
            return text;
        };
        this.time = Date.now();
        this.removePlayerCell = false;
        let eatEventsLength = view.readUInt16LE(offset);
        offset += 2;
        for (var length = 0; length < eatEventsLength; length++) {
            const eaterID = this.indexedCells[view.readUInt32LE(offset)];
            const victimID = this.indexedCells[view.readUInt32LE(offset + 4)];
            //console.log('victim isFood',victimID.isFood)
            offset += 8;
            if (eaterID && victimID) {
                victimID.targetX = eaterID.x;
                victimID.targetY = eaterID.y;
                victimID.targetSize = victimID.size;
                victimID.time = this.time;
                victimID.removeCell();
                if(eaterID.accID&&eaterID.skin!=null&&(victimID.accID||victimID.isVirus))  {
                  Connection.accounts[eaterID.accID].animated = true;
                  Connection.accounts[eaterID.accID].animationStart = Date.now();
                }             
            }
        }

        //var maxedX=maxedY=minedX=minedY=0


        for (length = 0;;) {
            var id = view.readUInt32LE(offset);
            offset += 4;
            if (id == 0) {
                break;
            }
            let x = this.receiveX(view.readInt32LE(offset));
            offset += 4;
            let y = this.receiveY(view.readInt32LE(offset));
            offset += 4;


            /*x =//mm
            y =//mm
*/

            const size = view.readUInt16LE(offset);
            offset += 2;
            const flags = view.readUInt8(offset++);
            let extendedFlags = 0;
            if (flags & 128) {
                extendedFlags = view.readUInt8(offset++);
            }
            let color = null,
                skin = null,
                name = '',
                accountID = null,
                extras = null,
                newCell = false;
            if (flags & 2) {
                const r = view.readUInt8(offset++);
                const g = view.readUInt8(offset++);
                const b = view.readUInt8(offset++);
                color = this.rgb2Hex(~~(r * 0.9), ~~(g * 0.9), ~~(b * 0.9));
            }
            if (flags & 4) {
                skin = encode();
            }
            if (flags & 8) {
                name = window.decodeURIComponent(window.escape(encode()));
                name = application.filterNick(name);
            }
            if (flags & 10) {
                newCell = true;
            }
           
            if (skin!=null || (name!=null && name!='')) {
              if(gameOptionSettings.vanillaSkins && Connection && Connection.gameMode && Connection.gameMode != ":teams") {
                        this.vanillaskins(skin, skin, name);
              }
            }
            if (name!=null && name!='') {
              let orig = application.teamPlayers[application.findOrig(name)];
                    if (orig!=null) {
                        if(orig.extras.length) extras = orig.extras;
                        application.cacheCustomSkin(orig.nick, orig.color, orig.skinURL);
                    }
            }
            if (skin!=null && gameOptionSettings.targetSearch==true && application.founded!=true && application.skinsForSearch.some((e) => {if(e.length>0&&skin.indexOf(e) !=-1) {return true}})) {
                      console.log('Сонечко вийшло з-за хмар', name, Connection.ws);
                      foundedSound()
                      application.founded=true
            }

            const isVirus = flags & 1;
            const isFood = extendedFlags & 1;
            const isFriend = extendedFlags & 2;
            var cell = null;
            if (extendedFlags & 4) {
                accountID = view.readUInt32LE(offset);
                offset += 4;
            }
            if (this.indexedCells.hasOwnProperty(id)) {
                cell = this.indexedCells[id];
                if (color) {
                    cell.color = color;
                }
            } else {
                let c = color;
                if(accountID!=null&&(application.gameMode==":ffa"||application.gameMode==":experimental")) {
                   c= `hsl(${accountID%360},100%,50%)`;
                   }
                cell = new Cell(id, x, y, size, c, isFood, isVirus, false, gameOptionSettings.shortMass, gameOptionSettings.virMassShots);
                cell.time = this.time;
                if (!isFood) {
                    if (isVirus && gameOptionSettings.virusesRange) {
                        this.viruses.push(cell);
                    }
                    this.cells.push(cell);
                    if (this.playerCellIDs.indexOf(id) != -1 && this.playerCells.indexOf(cell) == -1) {
                        cell.isPlayerCell = true;
                        this.playerColor = color;
                        Connection.accID = accountID;
                        this.playerCells.push(cell);
                    }
                } else {
                    this.food.push(cell);
                }
                this.indexedCells[id] = cell;
            }
            

             

            if (cell.isPlayerCell) {
                name = this.playerNick;
            }
            if (name) {
                cell.targetNick = name;
            }
            if (accountID) {
                cell.accID = accountID;
                if(!Connection.accounts.hasOwnProperty(accountID)) Connection.accounts[accountID] = {color: `hsl(${accountID%360},100%,50%)`, cells: []};
                Connection.accounts[accountID].cells.push(cell);
                let friend = Connection.fbOnline.find(element => {return element.id == accountID});
                friend != undefined?cell.fbID = friend.fbId:void(0);
            }
            if (extendedFlags & 2) {
                cell.isFriend = isFriend;
                console.log('FB friend cell in view', isFriend)
            }
            cell.targetX = x;
            cell.targetY = y;
            cell.targetSize = size;
            cell.isFood = isFood;
            cell.isVirus = isVirus;

            if (skin) {
                cell.skin = skin;
            }
            if (extras) {
                cell.extras = extras;
            }

        }
       // var rmaxedX=rmaxedY=rminedX=rminedY=0
        eatEventsLength = view.readUInt16LE(offset);
        offset += 2;
        for (length = 0; length < eatEventsLength; length++) {
            var id = view.readUInt32LE(offset);
            offset += 4;
            cell = this.indexedCells[id];
            if (cell) {
                cell.removeCell();
            }
        }
        if (this.removePlayerCell && !this.playerCells.length) {
            this.play = false;
            this.isSpectateEnabled = false

            this.isFreeSpectate==true&&this.sendFreeSpectate()
            this.sendSpectate()
            

            application.onPlayerDeath();
            application.showMenu(300);
            window.user.isAlive = false
            if(window.user.startedBots) window.connection.send(new Uint8Array([5, Number(window.user.isAlive)]).buffer)
        }
        Connection.camMaxX = Connection.playerX
        Connection.camMaxY = Connection.playerY
        Connection.camMinX = Connection.playerX
        Connection.camMinY = Connection.playerY

            for (var length = 0, food = Connection.food; length < food.length; length++) {
                var x = food[length].x ;
                var y = food[length].y ;

                    if( x > Connection.camMaxX ) Connection.camMaxX = x        
                    if( y > Connection.camMaxY ) Connection.camMaxY = y
                    if( x < Connection.camMinX ) Connection.camMinX = x
                    if( y < Connection.camMinY ) Connection.camMinY = y

            }
        for(let [key,value] of Object.entries(Connection.accounts)) {
            if(value.animated&&(Date.now()-value.animationStart)>5000) {
              Connection.accounts[key].animated = false;
            }
        }
        if(gameOptionSettings.reverseTrick) reverseTrick.check();
        if(gameOptionSettings.clickTargeting) clickTargeting.check();

    },
    color2Hex(number) {
        const color = number.toString(16);
        return color.length == 1 ? `0${color}` : color;
    },
    rgb2Hex(r, g, b) {
        return `#${this.color2Hex(r)}${this.color2Hex(g)}${this.color2Hex(b)}`;
    },
    sortCells() {
        this.cells.sort((row, conf) => row.size == conf.size ? row.id - conf.id : row.size - conf.size);
    },
    calculatePlayerMassAndPosition2() {
        let size = 0;
        let targetSize = 0;
        let x = 0;
        let y = 0;
        const playersLength = this.playerCells.length;
        for (let length = 0; length < playersLength; length++) {
            const currentPlayer = this.playerCells[length];
            size += currentPlayer.size;
            targetSize += currentPlayer.targetSize * currentPlayer.targetSize;
            x += currentPlayer.x / playersLength;
            y += currentPlayer.y / playersLength;
        }
        var sp30 = gameOptionSettings.cameraDelay
        var sp29 = gameOptionSettings.cameraDelay-1
        this.viewX = (sp29 * this.viewX + x) / sp30;
        this.viewY = (sp29 * this.viewY + y) / sp30;

        this.playerSize = size;
        this.playerMass = ~~(targetSize / 100);
        this.recalculatePlayerMass();
    },
    calculatePlayerMassAndPosition() {
        let size = 0;
        let targetSize = 0;
        let x = 0;
        let y = 0;
        const playersLength = this.playerCells.length;
        for (let length = 0; length < playersLength; length++) {
            const currentPlayer = this.playerCells[length];
            size += currentPlayer.size;
            targetSize += currentPlayer.targetSize * currentPlayer.targetSize;
            x += currentPlayer.x / playersLength;
            y += currentPlayer.y / playersLength;
        }
        this.viewX = x;
        this.viewY = y;
        this.playerSize = size;
        this.playerMass = ~~(targetSize / 100);
        this.recalculatePlayerMass();
    },
    recalculatePlayerMass() {
        this.playerScore = Math.max(this.playerScore, this.playerMass);
        if (gameOptionSettings.virColors || gameOptionSettings.splitRange || gameOptionSettings.oppColors || gameOptionSettings.oppRings || gameOptionSettings.showStatsSTE) {
            const cells = this.playerCells;
            const CellLength = cells.length;
            cells.sort((row, conf) => row.size == conf.size ? row.id - conf.id : row.size - conf.size);
            this.playerMinMass = ~~(cells[0].size * cells[0].size / 100);
            this.playerMaxMass = ~~(cells[CellLength - 1].size * cells[CellLength - 1].size / 100);
            this.playerSplitCells = CellLength;
        }
        if (gameOptionSettings.showStatsSTE) {
            const mass = this.selectBiggestCell ? this.playerMaxMass : this.playerMinMass;
            if (mass > 35) {
                this.STE = ~~(mass * (mass < 1000 ? 0.35 : 0.38));
            } else {
                this.STE = null;
            }
        }
    },
    compareCells() {
        if (!this.play) {
            return;
        }
        if (gameOptionSettings.oppColors || gameOptionSettings.oppRings || gameOptionSettings.splitRange) {
            if (gameOptionSettings.oppRings || gameOptionSettings.splitRange) {
                this.biggerSTECellsCache = [];
                this.biggerCellsCache = [];
                this.smallerCellsCache = [];
                this.STECellsCache = [];
                    this.biggerSTEDCellsCache = []; //Sonia
                    this.STEDCellsCache = []; //Sonia
                    this.SSCellsCache = [];
            }

            for (const cell of this.cells) {
                if (cell.isVirus|| cell.spectator>0/*cell.invisible*/) {
                    continue;
                }
                const size = ~~(cell.size * cell.size / 100);
                if (size != 13) {
                 const mass = this.selectBiggestCell ? this.playerMaxMass : this.playerMinMass;
                 const fixMass = size / mass;
                 const smallMass = mass < 1000 ? 0.35 : 0.38;
                 if (gameOptionSettings.oppColors && !gameOptionSettings.oppRings) {
                     cell.oppColor = this.setCellOppColor(cell.isPlayerCell, fixMass, smallMass);
                 }
                 if (!cell.isPlayerCell && (gameOptionSettings.splitRange || gameOptionSettings.oppRings)) {
                     this.cacheCells(cell.x, cell.y, cell.targetX, cell.targetY, cell.size, fixMass, smallMass);
                }
              }
            }
        }
    },
        //Sonia (entire function updated) // this is great :D
        'cacheCells': function(x, y, targetX, targetY, size, mass, smallMass) {
            return mass >= 5.32 ? void this.biggerSTEDCellsCache.push({
                x: x,
                y: y,
                targetX: targetX,
                targetY: targetY,
                size: size
            }) : mass >= 2.66 ? void this.biggerSTECellsCache.push({
                x: x,
                y: y,
                targetX: targetX,
                targetY: targetY,
                size: size
            }) : mass >= 1.33 ? void this.biggerCellsCache.push({
                x: x,
                y: y,
                targetX: targetX,
                targetY: targetY,
                size: size
            }) : mass < 1.33 && mass > 0.75 ? void this.SSCellsCache.push({
                x: x,
                y: y,
                targetX: targetX,
                targetY: targetY,
                size: size
            }) : mass > 0.375 ? void this.smallerCellsCache.push({
                x: x,
                y: y,
                targetX: targetX,
                targetY: targetY,
                size: size
            }) : mass > 0.1875 ? void this.STECellsCache.push({
                x: x,
                y: y,
                targetX: targetX,
                targetY: targetY,
                size: size
            }) : void this.STEDCellsCache.push({
                x: x,
                y: y,
                targetX: targetX,
                targetY: targetY,
                size: size
            });
        },
    'setCellOppColor': function(t, e, i) {
            return t ? mainProfile.color : e > 11 ? '#FF008C' : e >= 2.5 ? '#BE00FF' : e >= 1.25 ? '#FF0A00' : e < 1.25 && e > 0.75 ? '#FFDC00' : e > i ? '#00C8FF' : '#64FF00';
            //return t ? ogarcopythelb.color : e > 10.64 ? defaultSettings.enemyBSTEDColor : e >= 5.32 ? defaultSettings.enemyBSTEDColor : e >= 2.66 && e <= 5.32 ? defaultSettings.enemyBSTEColor : e >= 1.33 && e <= 2.66 ? defaultSettings.enemyBColor : e < 1.33 && e > 0.75 ? '#FFDC00' : e < 0.75 && e > 0.375 ? defaultSettings.enemySSTEDColor : e > i ? '#00C8FF' : defaultSettings.enemySSTEColor; //Sonia
            //return t ? mainProfile.color : e >= 10.64 ? defaultSettings.enemyBSTEDColor : e >= 5.32 ? defaultSettings.enemyBSTEDColor : e >= 2.66 ? defaultSettings.enemyBSTEColor : e >= 1.33 ? defaultSettings.enemyBColor : e > 0.75 ? '#FFDC00' : e > 0.375 ? defaultSettings.enemySColor : e > 0.1875 ? defaultSettings.enemySSTEColor : defaultSettings.enemySSTEDColor;
        },
    getCursorPosition() {
        this.cursorX = (this.clientX - this.canvasWidth / 2) / this.viewScale + this.viewX;
        this.cursorY = (this.clientY - this.canvasHeight / 2) / this.viewScale + this.viewY;
    },
    setZoom(event) {
        this.zoomValue *= gameOptionSettings.zoomSpeedValue ** (event.wheelDelta / -120 || event.detail || 0);
        if (this.zoomValue > 4 / this.viewScale) {
            this.zoomValue = 4 / this.viewScale;
        }
    },
    setTargetPosition(x, y) {
        this.targetX = x - this.mapOffsetX;
        this.targetY = y - this.mapOffsetY;
        this.targetDistance = Math.round(Math.sqrt((this.playerX - this.targetX) ** 2 + (this.playerY - this.targetY) ** 2));
    },
    resetTargetPosition() {
        this.targetX = this.playerX;
        this.targetY = this.playerY;
    },
    setKeys() {
        const app = this;
        document.onkeydown = event => {
            const key = event.keyCode;
            if (app.pressedKeys[key]) {
                return;
            }
            switch (key) {
                case 13:
                    app.sendNick('');
                    break;
                case 32:
                    app.sendSplit();
                    break;
                case 81:
                    app.sendFreeSpectate();
                    break;
                case 83:
                    app.sendSpectate();
                    break;
                case 87:
                    app.sendEject();
                    break;
            }
        };
        document.onkeyup = event => {
            app.pressedKeys[event.keyCode] = false;
        };
    },
    init() {
        const app = this;/*,
              el=document.getElementById("canvas");
              el.onpointerdown = zoom.pointerdown_handler;
              el.onpointermove = evt => { 
                evt.preventDefault();
                zoom.pointermove_handler;
              }

              // Use same handler for pointer{up,cancel,out,leave} events since
              // the semantics for these events - in this app - are the same.
              el.onpointerup = zoom.pointerup_handler;
              el.onpointercancel = zoom.pointerup_handler;
              el.onpointerout = zoom.pointerup_handler;
              el.onpointerleave = zoom.pointerup_handler;
*/
        if (/firefox/i .test(navigator.userAgent)) {
            document.addEventListener(`DOMMouseScroll`, value => {
                app.setZoom(value);
            }, false);
        } else {
            document.body.onmousewheel = value => {
                app.setZoom(value);
            };
        }
        setInterval(() => {
            app.sendPosition();
        }, 40);
        if (window.master && window.master.clientVersion) {
            this.setClientVersion(window.master.clientVersion, window.master.clientVersionString);
        }
    }
};

var zoom = {

evCache : [],
prevDiff: -1,
pointerdown_handler(ev) {

zoom.evCache.push(ev);
console.log("pointerDown", ev);
},
pointermove_handler(ev) {

console.log("pointerMove", ev);

for (var i = 0; i < zoom.evCache.length; i++) {
if (ev.pointerId == zoom.evCache[i].pointerId) {
  zoom.evCache[i] = ev;
break;
}
}

if (zoom.evCache.length == 2) {

var curDiff = Math.abs(zoom.evCache[0].clientX - zoom.evCache[1].clientX);

if (zoom.prevDiff > 0) {
 if (curDiff > zoom.prevDiff) {

   console.log("Pinch moving OUT -> Zoom in", ev);
   setZoom(curDiff-zoom.prevDiff)

 }
 if (curDiff < zoom.prevDiff) {

   console.log("Pinch moving IN -> Zoom out",ev);
   setZoom(curDiff-zoom.prevDiff)

 }
}

zoom.prevDiff = curDiff;
}
},
pointerup_handler(ev) {
console.log(ev.type, ev);

zoom.remove_event(ev);

if (zoom.evCache.length < 2) {
zoom.prevDiff = -1;
}
},
remove_event(ev) {
for (var i = 0; i < zoom.evCache.length; i++) {
if (zoom.evCache[i].pointerId == ev.pointerId) {
 zoom.evCache.splice(i, 1);
 break;
}
}
}
}
function setZoom(event) {
        zoom.zoomValue *= gameOptionSettings.zoomSpeedValue ** (event.wheelDelta / -120);
        if (this.zoomValue > 4 / this.viewScale) {
            this.zoomValue = 4 / this.viewScale;
        }
};




function foundedSound() {
                         if(gameOptionSettings.targetSearch==true) {
                         $('#target-status').show().text(`[${textLanguage.founded}]`);
                         application.playSound(application.commandSound);
                         setTimeout(foundedSound, 1000)
                         }
}

window.agarversion = "v15/2799/";
window.getLatestID = "2799";

window.getLatestconfigVersion = window.localStorage.getItem('EnvConfig.configVersion');
window.getLatestID = window.localStorage.getItem("getLatestID");

if (window.getLatestID != null && window.getLatestconfigVersion != null && window.getLatestID != undefined && window.getLatestconfigVersion != undefined) {
window.agarversion = "v" + window.getLatestconfigVersion + "/" + window.getLatestID + "/";
}

var Lmagarversion = "";

window.LMGameConfiguration = $.ajax({
        type: "GET",
        url: "https://configs-web.agario.miniclippt.com/live/" + window.agarversion + "GameConfiguration.json",
        async: false,
        datatype: "jsonp",
        success: function(info) {
            //var GameConfiguration = info;
        }
}).responseJSON;

//weird but it works....

setTimeout(function() {
if (window.LMGameConfiguration == undefined) {
window.LMGameConfiguration = $.ajax({
type: "GET",
url: "https://raw.githubusercontent.com/Yahnych/vanilla_skins/master/GameConfiguration.json",
async: false,
datatype: "jsonp",
success: function(info) {
    //var GameConfiguration = info;
}
}).responseJSON;
}
}, 3000);
setTimeout(function() {
if (window.LMGameConfiguration != undefined) {
    window.LMAgarGameConfiguration = window.LMGameConfiguration;
    window.EquippableSkins = LMAgarGameConfiguration.gameConfig["Gameplay - Equippable Skins"];

    window.FreskinsMap = [];
    window.FreeSkins = LMAgarGameConfiguration.gameConfig["Gameplay - Free Skins"];
    for (var player = 0; player < window.FreeSkins.length; player++) {
        window.FreskinsMap[player] = window.FreeSkins[player].id
    }
}
}, 5000);

function LowerCase(str) {
return str.toLowerCase();
}
var legendflags = ["author of agar.io", "author of lm", "yugoslavia", "virgil", "vaseline", "the hood", "targaryen", "tajikistan", "slovakia", "sherbert", "scott", "peter", "pepsi", "nose", "nivea", "legend mod", "legend clan", "kennedy", "kayo", "john", "israel", "illuminati", "heisenberg", "gordon", "eye of sauron", "dollar", "coca cola", "brian", "bread", "beavis", "bart", "baghdadi", "alaska", "alan", "8 ball",
"zelda", "yoda", "west wood", "weed girl", "vendetta", "taco cat", "sonic", "scar anime", "real moon", "real mars", "morgana", "monster energy", "melting moon", "mario", "luigi", "hard panda",
"grey monster", "fantasy girl", "doraemon", "darth vader", "color pandas", "color pandas", "color lion", "chemical soldier", "cheating girl", "black sphere", "asiatic", "angry cat", "angry bear",
"america shield", "jesse pinkman", "walter white", "argentina", "belarus", "cambodia", "isis", "jamaica", "mexico", "pakistan", "poland", "scotland", "somalia", "spain", "sweden", "switzerland", "thailand",
"venezuela", "2ch", "4chan", "8ch", "9gag", "cameron", "irs", "receita-federal", "9gag", "agario-candle", "australia", "austria", "ayy-lmao", "bait", "bangladesh", "belgium", "berlusconi", "blatter", "boris", "bosnia",
"botswana", "brazil", "bulgaria", "bush", "byzantium", "cambodia", "canada", "chavez", "chile", "china", "cia", "clinton", "confederate", "croatia", "cuba", "denmark", "dilma", "earth", "estonia", "european-union", "facebook",
"facepunch", "feminism", "fidel", "finland", "france", "french-kingdom", "german-empire", "germany", "greece", "hillary", "hollande", "hungary", "imperial-japan", "india", "indiana", "iran", "iraq", "ireland", "italy", "jamaica",
"japan", "kc", "kim-jong-un", "latvia", "lithuania", "luxembourg", "maldivas", "mars", "matriarchy", "merkel", "mexico", "nasa", "netherlands", "nigeria", "north-korea", "norway", "obama", "origin", "pakistan", "palin",
"patriarchy", "peru", "pewdiepie", "piccolo", "pokerface", "portugal", "prodota", "prussia", "putin", "qing-dynasty", "quebec", "queen", "reddit", "romania", "mistik"
];
function makeUpperCaseAfterUnderline(str) {
return str.replace(/_\s*([a-z])/g, function(d, e) {
    return "_" + e.toUpperCase()
});
}



function addBox() {
let spect = new Spect();
spect.player = true;
spects.unshift(spect);
}
function addSpectator() {
let spect = new Spect();
spects.push(spect)
}
function addFullSpectator() {
    let mtp = 4.95,
        w = ~~(1024*mtp),
        h = ~~(600*mtp);
let stop = 0,
  x = 0,
  y = 0;
for (;stop<30;stop++){
if(stop == 0) {
  let spect = new Spect();
  x = Connection.mapMinX + 2400;
  y = Connection.mapMinY + 1000;
  spect.staticX = x;
  spect.staticY = y;
  spects.push(spect)
  stop++
} else {
  if(x > Connection.mapMaxX - 2400){
    x = Connection.mapMinX + 2400;
    y = y+h;
  } else {x = x + w;}
  if (y>Connection.mapMaxY-1000) { 
    stop = 100;
    break 
  }
  let spect = new Spect();
  spect.staticX = x;
  spect.staticY = y;
  spects.push(spect)
  stop++
}
}
}
var spects = [];
class Spect {
constructor() {
    this.number = spects.length + 1
    this.ws = null
    this.socket = null
    this.protocolKey = null
    this.clientKey = null
    this.clientVersion = null
    this.connectionOpened = false
    this.mapOffset = 7071
    this.mapOffsetX = 0
    this.mapOffsetY = 0
    this.fixX = 1
    this.fixY = 1
    this.staticX = null
    this.staticY = null
    this.ghostsFixed = false
    this.closedByUser = false
    this.positionController = null
    this.player = false
    this.active = false
    this.targetX = null
    this.targetY = null
    this.connect()
}
reset() {
    this.ws = null
    //this.socket = null
    this.protocolKey = null
    this.clientKey = null
    this.clientVersion = null
    this.connectionOpened = false
    this.mapOffsetX = 0
    this.mapOffsetY = 0
    this.ghostsFixed = false
    this.closedByUser = false
    this.positionController = null
    this.player = false
    this.active = false
    this.targetX = null
    this.targetY = null

}
connect() {
    this.reset()
    this.ws = Connection.ws
    this.socket = new WebSocket(Connection.ws)
    this.socket.binaryType = 'arraybuffer'
    this.socket.onopen = this.onopen.bind(this)
    this.socket.onmessage = this.onmessage.bind(this)
    this.socket.onerror = this.onerror.bind(this)
    this.socket.onclose = this.onclose.bind(this)
}
onopen() {
        console.log(`[SPECT] Game server socket open`)
  
        this.clientVersion = window.game.clientVersion
        this.protocolVersion = window.game.protocolVersion
  
        let view = this.createView(5);
        view.setUint8(0, 254);
        //if(!window.game.protocolVersion) window.game.protocolVersion = 22
        view.setUint32(1, window.game.protocolVersion, true);
        this.sendMessage(view);
        view = this.createView(5);
        view.setUint8(0, 255);
        //if(!window.game.clientVersion) window.game.clientVersion = this.clientVersion
        view.setUint32(1, window.game.clientVersion, true);
        this.sendMessage(view);
        this.connectionOpened = true;
  

    }
onmessage(message) {
    message = new DataView(message.data);
    //if (this.buffersKey) message.data = algorithm.rotateBufferBytes(message.data, this.buffersKey)

    if (this.protocolKey) {
        message = this.shiftMessage(message, this.protocolKey ^ this.clientVersion);
    }
    this.handleMessage(message);
}
onerror() {
    setTimeout(() => {
        if (this.socket.readyState === WebSocket.CONNECTING || this.socket.readyState === WebSocket.OPEN) this.socket.close()
    }, 1000)
  console.log('error')
}
onclose() {
    if (this.connectionOpened) {
        this.connectionOpened = false
      
        this.flushCellsData() 
      
        this.reset()
      console.log('closed')
    if(!this.closedByUser) {
      this.connect()
    }

    }
}
closeConnection() {
    if (this.socket) {
        this.socket.onopen = null;
        this.socket.onmessage = null;
        this.socket.onerror = null;
        this.socket.onclose = null;
        try {
            this.socket.close();
        } catch (error) {}
        this.socket = null;
        this.ws = null;
      
        this.flushCellsData() 
      
        this.reset() 

        this.closedByUser = true

    }
}
flushCellsData() {
        this.isSpectateEnabled = false
        this.isFreeSpectate = false;
        this.ghostCells = [];
        //this.indexedCells = {};
        //this.deletefromObject("indexedCells")
        //this.cells = [];
        //this.deleteFromArray("cells")
        //this.playerCells = [];
        //this.playerCellIDs = [];
        //this.food = [];
        //this.viruses = [];
        //this.deleteFromArray("viruses")
        for(let cell of Object.values(Connection.indexedCells)) {
          if(cell.spectator == this.number) {
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
        this.socket.send(data.buffer);
}
sendMessage(message) {
        if (this.connectionOpened /*&& this.integrity*/) {
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
convertX(x) {
    return ~~((x + Connection.mapOffsetX)*this.fixX - this.mapOffsetX)
}    
convertY(y) {
    return ~~((y + Connection.mapOffsetY)*this.fixY - this.mapOffsetY)
}  
sendCursor() {
        this.positionController = setInterval(() => {
            this.sendPosition(this.convertX(Connection.cursorX), this.convertY(Connection.cursorY));
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
    if(this.staticX==0) {
     if(this.isFreeSpectate) {
      this.sendCursor()
     } else {
      clearInterval(this.positionController)
     }
    }
    this.sendAction(18);
}
sendEject() {
    this.sendPosition(this.convertX(Connection.cursorX), this.convertY(Connection.cursorY));
    this.sendAction(21);
}
sendSplit() {
    this.sendPosition(this.convertX(Connection.cursorX), this.convertY(Connection.cursorY));
    this.sendAction(17);
}
sendNick(nick) {
    Connection.playerNick = nick;
    var self = this
    var sendSpawn = function(token) {
        nick = window.unescape(window.encodeURIComponent(self.playerNick));
        var view = self.createView(1+nick.length+1+token.length+1);
        var pos = 1
        for (let length = 0; length < nick.length; length++,pos++) view.setUint8(pos, nick.charCodeAt(length))
        pos++
        for (let length = 0; length < token.length; length++,pos++) view.setUint8(pos, token.charCodeAt(length));
        self.sendMessage(view);
    }
    Connection.integrity && agarCaptcha.requestCaptchaV3("play", function(token) {
        sendSpawn(token)
    });
    !Connection.integrity && sendSpawn('0')
}
fixMirroring() {
              this.fixX = /*Math.round*/(window.user.ghostX/(this.ghostCells[0].x+this.mapOffsetX))<0?-1:1;
              this.fixY = /*Math.round*/(window.user.ghostY/(this.ghostCells[0].y+this.mapOffsetY))<0?-1:1;
              this.ghostFixed = true
              for(var [key,value] of Object.entries(Connection.indexedCells)) {
                if(value.spectator&&value.spectator==this.number) {
                  Connection.indexedCells[key].targetX *= this.fixX;
                  Connection.indexedCells[key].targetY *= this.fixY;
                }
              }
}
sendPosition(x, y) {
    if (!this.isSocketOpen() || !this.connectionOpened || (!this.clientKey && this.integrity)) {
        return;
    }
    const view = this.createView(13);
    view.setUint8(0, 16);
  if(this.player==true&&!this.active==true) { 
    
    view.setInt32(1, this.serverX(this.targetX), true);
    view.setInt32(5, this.serverY(this.targetY), true);
    console.log(this.targetX, this.targetY)
  } else {

    view.setInt32(1, this.serverX(x), true);
    view.setInt32(5, this.serverY(y), true);
    this.targetX = x;
    this.targetY = y;
  }
    view.setUint32(9, this.protocolKey, true);
    this.sendMessage(view);
}
generateClientKey(ip, options) {
    if (!ip.length || !options.byteLength) {
        return null;
    }
    let x = null;
    const Length = 1540483477;
    const ipCheck = ip.match(/(ws+:\/\/)([^:]*)(:\d+)/)[2];
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
    if (x != newValue) {
        x = Math.imul(uint8Arr[value] ^ newValue, Length) | 0;
    }
    newValue = x >>> 13;
    x = newValue ^ x;
    x = Math.imul(x, Length) | 0;
    newValue = x >>> 15;
    x = newValue ^ x;
    console.log(`[SPECT] Generated client key:`, x);
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
    if (!write) {
        for (var length = 0; length < view.byteLength; length++) {
            view.setUint8(length, view.getUint8(length) ^ key >>> length % 4 * 8 & 255);
        }
    } else {
        for (var length = 0; length < view.length; length++) {
            view.writeUInt8(view.readUInt8(length) ^ key >>> length % 4 * 8 & 255, length);
        }
    }
    return view;
}
decompressMessage(message) {
    const buffer = window.buffer.Buffer;
    const messageBuffer = new buffer(message.buffer);
    const readMessage = new buffer(messageBuffer.readUInt32LE(1));
    LZ4.decodeBlock(messageBuffer.slice(5), readMessage);
    return readMessage;
}
handleMessage(view) {
    const encode = () => {
        for (var text = '';;) {
            const string = view.getUint8(offset++);
            if (string == 0) {
                break;
            }
            text += String.fromCharCode(string);
        }
        return text;
    };
    var offset = 0;
    let opCode = view.getUint8(offset++);
    if (opCode == 54) {
        opCode = 53;
    }
    switch (opCode) {
        case 5:

          console.log('case 5');
                 
            break;
        case 17:
            this.viewX = this.receiveX(view.getFloat32(offset, true));
            offset += 4;
            this.viewY = this.receiveY(view.getFloat32(offset, true));
            offset += 4;
            this.scale = view.getFloat32(offset, true);

            //this.viewX = Connection.mapOffsetX
            //this.viewY = Connection.mapOffsetY

            break;
        case 18:
            if (this.protocolKey) {
                this.protocolKey = this.shiftKey(this.protocolKey);
            }
            this.flushCellsData();
          console.log('case 18');

            break;
        case 32:

          console.log('case 32');

            break;
        case 50:
          console.log('case 50');

            break;
        case 53:

          //console.log('case 53');

            break;
        case 54:

          console.log('case 54');
            break;

        case 69:
            var length = view.getUint16(offset, true);
            offset += 0x2;
            this.ghostCells = [];
            for(let i = 0x0; i < length; i++) {
                var x = view.getInt32(offset, true);
                offset += 4;
                var y = view.getInt32(offset, true);
                offset += 4;
                var mass = view.getUint32(offset, true);
                offset += 4;
                //false&&console.log(view.getUint8(offset))
                offset += 1

                var size = ~~Math.sqrt(100 * mass);
                this.ghostCells.push({
                    'x': this.receiveX(x),
                    'y': this.receiveY(y),
                    'size': size,
                    'mass': mass,
                    'inView': this.isInView(x, y, size)
                });
            }

            if(!this.ghostFixed && this.mapOffsetFixed && this.ghostCells.length!=0 && Math.abs(window.user.ghostX)>1000 && Math.abs(window.user.ghostY) >1000) {
               this.fixMirroring();
            }
            break;
        case 85:

          console.log('case 85');

            
            break;
        case 102:

          console.log('case 102');

            break;
        case 103:

          console.log('case 103');

            break;
        case 104:
          console.log('case 104');

            break;
        case 114:
            console.error('[Agario] Spectate mode is full')
          console.log('case 114');

            break;
        case 160:

          console.log('case 160');

                break;
        case 161:
          //console.log('case 161');

            break;
        case 176:
          console.log('case 176');

            break;
        case 177:
          console.log('case 177');

            break;
        case 178:

          console.log('case 178');

            break;
        case 179:

          console.log('case 179');

            break;
        case 180:

          console.log('case 180');

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
            console.log('[SPECT] Received protocol key:', this.protocolKey);
            const agarioReader = new Uint8Array(view.buffer, offset += 4);
            this.clientKey = this.generateClientKey(this.ws, agarioReader);

            break;
        case 242:
            console.log('242')
            this.serverTime = view.getUint32(offset, true) * 1000;
            this.serverTimeDiff = Date.now() - this.serverTime;
            
            if(this.player==true){
              this.active = true
              this.sendCursor()
              this.sendNick()
            } else {
              this.sendSpectate();
            }
            if(this.staticX!=null&&this.staticY!=null) {
                setInterval(() => {
                    this.sendPosition(this.convertX(this.staticX), this.convertY(this.staticY));
                }, 200);
               this.sendFreeSpectate()
            }
            break;
        case 255:
            this.handleSubmessage(view);

            break;
        case 16:

          console.log('case 16');

            break;
        case 64:

          console.log('case 64');

            break;
        default:
            
            console.log(`[APP] Unknown opcode:`, view.getUint8(0));
            break;
    }
}
getX(x) {
  if(this.mapOffsetFixed) {
    if(this.ghostFixed){
    return ~~((x + this.mapOffsetX)*this.fixX - Connection.mapOffsetX)
    } else {
    return ~~((x + this.mapOffsetX) - Connection.mapOffsetX)
    }
  }
}
getY(y) {
  if(this.mapOffsetFixed) {
    if(this.ghostFixed){
    return ~~((y + this.mapOffsetY)*this.fixY - Connection.mapOffsetY)
    } else {
    return ~~((y + this.mapOffsetY) - Connection.mapOffsetY)
    }
  }
}
handleSubmessage(message) {
    message = this.decompressMessage(message);
    let offset = 0;
    switch (message.readUInt8(offset++)) {
        case 16:
            this.updateCells(message, offset);
            break;
        case 64:
            this.viewMinX = (message.readDoubleLE(offset));
            offset += 8;
            this.viewMinY = (message.readDoubleLE(offset));
            offset += 8;
            this.viewMaxX = (message.readDoubleLE(offset));
            offset += 8;
            this.viewMaxY = (message.readDoubleLE(offset));


            this.setMapOffset(this.viewMinX, this.viewMinY, this.viewMaxX, this.viewMaxY);

            break;
        default:
            console.log(`[APP] Unknown sub opcode:`, message.readUInt8(0));
            break;
    }
}
/*isInView(x, y, size) {
    var x2s = Connection.canvasWidth / 2 / Connection.scale;
    var y2s = Connection.canvasHeight / 2 / Connection.scale;
    if (x + size < Connection.viewX - x2s || y + size < Connection.viewY - y2s || x - size > Connection.viewX + x2s || y - size > Connection.viewY + y2s) {
        return false;
    }
    return true;
}*/
isInView(x, y) {
    let mtp = 4.95,
        w = 1024/2*mtp,
        h = 600/2*mtp;
    if (x  < this.viewX-w || y  < this.viewY-h || x > this.viewX + w || y  > this.viewY + h) {
        return true;
    }
    return false;
}
unshrinkX(x){return x / this.mapShrinkW}
unshrinkY(y){return y / this.mapShrinkH}
shrinkX(x){return x * this.mapShrinkW}
shrinkY(y){return y * this.mapShrinkH}

unshiftX(x){return x-(-this.mapShiftX)}
unshiftY(y){return y-(-this.mapShiftY)}
shiftX(x,sh){return !sh?x-this.mapShiftX:x}
shiftY(y,sh){return !sh?y-this.mapShiftY:y}


invflipX(x){return !!this.mirrorH?x: this.mapMaxX - (x - this.mapMinX)}
invflipY(y){return !!this.mirrorV?y: this.mapMaxY - (y - this.mapMinY)}
flipX(x){return !this.mirrorH?x: this.mapMaxX - (x - this.mapMinX)}
flipY(y){return !this.mirrorV?y: this.mapMaxY - (y - this.mapMinY)}

receiveX(x){
    x = this.shrinkX(x)
    x = this.shiftX(x)
    x = this.flipX(x)
    return x
}
receiveY(y){
    y = this.shrinkY(y)
    y = this.shiftY(y)
    y = this.flipY(y)
    return y
}
serverX(x){
    x = this.flipX(x)
    x = this.unshiftX(x)
    x = this.unshrinkX(x)
    return x
}
serverY(y){
    y = this.flipY(y)
    y = this.unshiftY(y)
    y = this.unshrinkY(y)
    return y
}
setMapOffset(left, top, right, bottom) {

    if ((right - left) > 14000 && (bottom - top) > 14000) {
        if(this.mapOffsetFixed) return;
        var side = 14142.135623730952
        this.mapShrinkW = side / (right-left)
        this.mapShrinkH = side / (bottom-top)
        console.log(this.mapShrinkW, this.mapShrinkH)
        left  = this.shrinkX( left, (right-left), side)
        top   = this.shrinkY( top, (bottom-top), side)
        right = this.shrinkX( right, (right-left), side)
        bottom =this.shrinkY( bottom, (bottom-top), side)

        this.mapShiftY=0
        this.mapShiftX=0
        var prX=-((right-left)/2),
            prY=-((bottom-top)/2),
            ofX=0,ofY=0


        let diffX = prX-left+ofX
        let diffY = prY-top+ofY

        this.mapShiftX=ofX-diffX
        this.mapShiftY=ofY-diffY

        //left  = this.flipX(left)
        //top   = this.flipY(top)
        //right = this.flipX(right)
        //bottom =this.flipY(bottom)

        left  = this.shiftX(left)
        top   = this.shiftY(top)
        right = this.shiftX(right)
        bottom =this.shiftY(bottom)

/////////////////////////////////////////////////

        this.mapOffsetX = ((right-left)/2) - right;
        this.mapOffsetY = ((bottom-top)/2) - bottom;

        this.mapMinX = left
        this.mapMinY = top
        this.mapMaxX = right
        this.mapMaxY = bottom
        this.mapMidX = (this.mapMaxX + this.mapMinX) / 2;
        this.mapMidY = (this.mapMaxY + this.mapMinY) / 2;

        if (!this.mapOffsetFixed) {
            this.viewX = (right + left) / 2;
            this.viewY = (bottom + top) / 2;
            //application.emit('offset',this)
        }
            window.user.offsetX = this.mapOffsetX;//Yahnych
            window.user.offsetY = this.mapOffsetY;
        this.mapOffsetFixed = true;
        //application.emit('offset',this)
        console.log(` Map offset fixed (x, y):`, this.mapOffsetX, this.mapOffsetY);
    }else{
        this.viewportMinX = this.receiveX(left)
        this.viewportMinY = this.receiveY(top)
        this.viewportMaxX = this.receiveX(right)
        this.viewportMaxY = this.receiveY(bottom)
    }
}
updateCells(view, offset) {
    const encode = () => {
        for (var text = '';;) {
            const string = view.readUInt8(offset++);
            if (string == 0) {
                break;
            }
            text += String.fromCharCode(string);
        }
        return text;
    };
    this.time = Date.now();
    this.removePlayerCell = false;
    let eatEventsLength = view.readUInt16LE(offset);
    offset += 2;
    for (var length = 0; length < eatEventsLength; length++) {
        const eaterID = Connection.indexedCells[this.newID(view.readUInt32LE(offset))];
        const victimID = Connection.indexedCells[this.newID(view.readUInt32LE(offset + 4))];
        //console.log('victim isFood',victimID.isFood)
        offset += 8;
        if (eaterID && victimID) {
            victimID.targetX = eaterID.x;
            victimID.targetY = eaterID.y;
            victimID.targetSize = victimID.size;
            victimID.time = this.time;
            victimID.removeCell();
        }
    }

    for (length = 0;;) {
        var id = view.readUInt32LE(offset);
        offset += 4;
        if (id == 0) {
            break;
        }
        let x = this.receiveX(view.readInt32LE(offset));
        offset += 4;
        let y = this.receiveY(view.readInt32LE(offset));
        offset += 4;


        const size = view.readUInt16LE(offset);
        offset += 2;
        const flags = view.readUInt8(offset++);
        let extendedFlags = 0;
        if (flags & 128) {
            extendedFlags = view.readUInt8(offset++);
        }
        let color = null,
            skin = null,
            name = '',
            accountID = null;
        if (flags & 2) {
            const r = view.readUInt8(offset++);
            const g = view.readUInt8(offset++);
            const b = view.readUInt8(offset++);
          if(gameOptionSettings.oneColoredSpectator) {
            color = Connection.rgb2Hex(255, 255, 255);
          } else {
            color = Connection.rgb2Hex(~~(r * 0.9), ~~(g * 0.9), ~~(b * 0.9));
          }
        }
        if (flags & 4) {
            skin = encode();
        }
        if (flags & 8) {
            name = window.decodeURIComponent(window.escape(encode()));
            name = application.filterNick(name);
        }
        if (flags & 10) {
        }
            if (skin!=null || (name!=null && name!='')) {
              if(gameOptionSettings.vanillaSkins && Connection && Connection.gameMode && Connection.gameMode != ":teams") {
                        Connection.vanillaskins(skin, skin, name);
              }
            }
        const isVirus = flags & 1;
        const isFood = extendedFlags & 1;
        const isFriend = extendedFlags & 2;
        const invisible = this.staticX!=null?this.isInView(x, y):false;
              id = this.newID(id),
              x = this.getX(x),
              y = this.getY(y);
        var cell = null;
            if (extendedFlags & 4) {
                accountID = view.readUInt32LE(offset);
                offset += 4;
            }
        if (Connection.indexedCells.hasOwnProperty(id)) {
            cell = Connection.indexedCells[id];
            cell.invisible = invisible;

            if (color) {
                cell.color = color;
            }

        } else {
                let c = color;
                if(accountID!=null&&(application.gameMode==":ffa"||application.gameMode==":experimental")) {
                   c= `hsl(${accountID%360},100%,50%)`;
                   }
            cell = new Cell(id, x, y, size, c, isFood, isVirus, false, gameOptionSettings.shortMass, gameOptionSettings.virMassShots);
            cell.time = this.time;
            cell.spectator = this.number;
            if (!isFood) {
                if (isVirus && gameOptionSettings.virusesRange) {

                    Connection.viruses.push(cell);
                }
                Connection.cells.push(cell);

            } else {
                //Connection.food.push(cell);
            }
            Connection.indexedCells[id] = cell;
        }
            if (name!=null && name!='') {
               for (length = 0; length < application.teamPlayers.length; length++) {
                    if (application.teamPlayers[length].nick == name) {
                        application.cacheCustomSkin(application.teamPlayers[length].nick, application.teamPlayers[length].color, application.teamPlayers[length].skinURL);
                    break;
                    }
              }
            }
        if (skin!=null && gameOptionSettings.targetSearch==true && application.founded!=true && application.skinsForSearch.some((e) => {if(e.length>0&&skin.indexOf(e) !=-1) {return true}})) {
                      console.log('Сонечко вийшло з-за хмар', name, Connection.ws);
                      foundedSound()
                      application.founded=true
        }
        if (name) {
            cell.targetNick = name;
        }
        cell.targetX = x;
        cell.targetY = y;
        cell.targetSize = size;
        cell.isFood = isFood;
        cell.isVirus = isVirus;
        //cell.invisible = invisible;
        if (skin) {
            cell.skin = skin;
        }

            if (accountID) {
                cell.accID = accountID;
                //if(!Connection.accounts.hasOwnProperty(accountID)) Connection.accounts[accountID] = {color: `hsl(${accountID%360},100%,50%)`, cells: []};
                //Connection.accounts[accountID].cells.push(cell);
                let friend = Connection.fbOnline.find(element => {return element.id == accountID});
                friend != undefined?cell.fbID = friend.fbId:void(0);
            }
        if (extendedFlags & 2) {
            cell.isFriend = isFriend;
            console.log('FB friend cell in view', isFriend)
        }
    }
   // var rmaxedX=rmaxedY=rminedX=rminedY=0
   eatEventsLength = view.readUInt16LE(offset);
    offset += 2;
    for (length = 0; length < eatEventsLength; length++) {
        var id = view.readUInt32LE(offset);
        offset += 4;
        cell = Connection.indexedCells[this.newID(id)];
        if (cell) {
            cell.removeCell();
        }
    }
}
newID(id) {
  return id + this.number * 10000000000
}
}

window.sendAction = action => {
    Connection.sendAction(action);
};

var clickTargeting = {
  account1: null,
  name1: null,
  account2: null,
  name2: null,
  getDistance(x1,y1,x2,y2){
          return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
  },
  pointInCircle: function(x, y, type) {
        for (length = 0; length < Connection.cells.length; length++) {
            var distancesquared = (x - Connection.cells[length].x) * (x - Connection.cells[length].x) + (y - Connection.cells[length].y) * (y - Connection.cells[length].y);

            if(type ==1 && distancesquared <= Connection.cells[length].size * Connection.cells[length].size){
                if(clickTargeting.account1 == Connection.cells[length].accID){
                  clickTargeting.account1 = null;
                  if(clickTargeting.account2==null) application.setTargetStatus(0);
                  clickTargeting.name1 = null;
                  return
                } else {
                  clickTargeting.account1 = Connection.cells[length].accID;
                  clickTargeting.name1 = Connection.cells[length].targetNick;
                };
            } else if(type ==3 && distancesquared <= Connection.cells[length].size * Connection.cells[length].size) {
                if(clickTargeting.account2 == Connection.cells[length].accID){
                  clickTargeting.account2 = null;
                  if(clickTargeting.account1==null) application.setTargetStatus(0);
                  clickTargeting.name2 = null;
                  return
                } else {
                  clickTargeting.account2 = Connection.cells[length].accID;
                  clickTargeting.name2 = Connection.cells[length].targetNick;
                };
            }
        }
  },
  check(){
      if(application.targetID!=0){
                  this.account1 = null;
                  this.name1 = null;
                  this.account2 = null;
                  this.name2 = null;
        return
      }
      if(this.account1 != null||this.account2 != null){
        if(ogario.play) {
               application.setTargetStatus(0);
               return
        }
        var acc1 = { summX:0, summY:0, x:0, y:0, l:0, name:0, mass:0, color:null},
            acc2 = { summX:0, summY:0, x:0, y:0, l:0, name:0, mass:0, color:null};
        if(this.account1&&Connection.accounts.hasOwnProperty(this.account1)) {
          let a1 = Connection.accounts[this.account1].cells;
          for(let i=0;i<a1.length;i++) {
            acc1.summX+=a1[i].targetX;
            acc1.summY+=a1[i].targetY;
            acc1.l ++;
            acc1.mass+= ~~(a1[i].size*a1[i].size/100);
            acc1.name = a1[i].targetNick;
            this.name1 = acc1.name;
            acc1.color = a1[i].color;
          }
          acc1.x = acc1.summX/acc1.l;
          acc1.y = acc1.summY/acc1.l;
        }
        if(this.account2&&Connection.accounts.hasOwnProperty(this.account2)) {
          let a2 = Connection.accounts[this.account2].cells;
          for(let i=0;i<a2.length;i++) {
            acc2.summX+=a2[i].targetX;
            acc2.summY+=a2[i].targetY;
            acc2.l ++;
            acc2.mass+= ~~(a2[i].size*a2[i].size/100);
            acc2.name = a2[i].targetNick;
            this.name2 = acc2.name;
            acc2.color = a2[i].color;
          }
          acc2.x = acc2.summX/acc2.l;
          acc2.y = acc2.summY/acc2.l;
        } 
        if(acc1.mass>0&&acc2.mass>0) {
          if(this.getDistance(acc1.x,acc1.y,acc2.x,acc2.y)<1800) {
             application.updateTarget(acc1.name + '/' + acc2.name, false, (acc1.x+acc2.x)/2, (acc1.y+acc2.y)/2, acc1.mass+acc2.mass, acc1.color);
                  if(!Connection.isFreeSpectate) {
                    Connection.sendFreeSpectate();
                    Connection.isFreeSpectate=true;
                  }
          } else {
            var acc = acc1.mass>acc2.mass?acc1:acc2;
             application.updateTarget(acc.name, false, acc.x, acc.y, acc.mass, acc.color);
                  if(!Connection.isFreeSpectate) {
                    Connection.sendFreeSpectate();
                    Connection.isFreeSpectate=true;
                  }
          }

        } else if(acc1.mass>0) {
             application.updateTarget(acc1.name, false, acc1.x, acc1.y, acc1.mass, acc1.color);
                  if(!Connection.isFreeSpectate) {
                    Connection.sendFreeSpectate();
                    Connection.isFreeSpectate=true;
                  }
        } else if(acc2.mass>0) {
             application.updateTarget(acc2.name, false, acc2.x, acc2.y, acc2.mass, acc2.color);
                  if(!Connection.isFreeSpectate) {
                    Connection.sendFreeSpectate();
                    Connection.isFreeSpectate=true;
                  }
        } else {
         if(Connection.ghostCells.length){
             for(let i=0; i<Connection.ghostCells.length; i++) {
               var ghost = Connection.ghostCells[i],
                   lb = Connection.leaderboard;
               if(lb[i].id == this.account1) {
                 this.name1 = lb[i].nick;
                 application.updateTarget(this.name1, false, ghost.x, ghost.y, ghost.mass, '#000000');
                  if(!Connection.isFreeSpectate) {
                    Connection.sendFreeSpectate();
                    Connection.isFreeSpectate=true;
                  }
                 return
               } else if (lb[i].id == this.account2){
                 this.name2 = lb[i].nick;
                 application.updateTarget(this.name2, false, ghost.x, ghost.y, ghost.mass, '#000000');
                  if(!Connection.isFreeSpectate) {
                    Connection.sendFreeSpectate();
                    Connection.isFreeSpectate=true;
                  }
                 return
               }
             }
          if((this.name1!=null&&this.name1!='')||(this.name2!=null&&this.name2!='')) {
             for(let i=0; i<Connection.ghostCells.length; i++) {
               var ghost = Connection.ghostCells[i],
                   lb = Connection.leaderboard;
               if(lb[i].nick == this.name1) {
                 this.account1 = lb[i].id;
                 application.updateTarget(this.name1, false, ghost.x, ghost.y, ghost.mass, '#000000');
                  if(!Connection.isFreeSpectate) {
                    Connection.sendFreeSpectate();
                    Connection.isFreeSpectate=true;
                  }
                 return
               } else if(lb[i].nick == this.name2) {
                 this.account2 = lb[i].id;
                 application.updateTarget(this.name2, false, ghost.x, ghost.y, ghost.mass, '#000000');
                  if(!Connection.isFreeSpectate) {
                    Connection.sendFreeSpectate();
                    Connection.isFreeSpectate=true;
                  }
                 return
               }
             }
          }
         }
         if(this.name1!=null&&this.name1!=''||this.name2!=null&&this.name2!='') {
          for (length = 0; length < Connection.cells.length; length++) {
            var cell = Connection.cells[length];
            if(cell.targetNick!='' && cell.targetNick==this.name1){
                  clickTargeting.account1 = cell.accID;
                  clickTargeting.name1 = cell.targetNick;
                  application.updateTarget(cell.targetNick, false, cell.targetX, cell.targetY, ~~(cell.size*cell.size/100), cell.color);
                  if(!Connection.isFreeSpectate) {
                    Connection.sendFreeSpectate();
                    Connection.isFreeSpectate=true;
                  }
                    return
            } else if(cell.targetNick!='' && cell.targetNick==this.name2) {
                  clickTargeting.account2 = cell.accID;
                  clickTargeting.name2 = cell.targetNick;
                  application.updateTarget(cell.targetNick, false, cell.targetX, cell.targetY, ~~(cell.size*cell.size/100), cell.color);
                  if(!Connection.isFreeSpectate) {
                    Connection.sendFreeSpectate();
                    Connection.isFreeSpectate=true;
                  }
                    return
            }
          }
        }
          var distance = Math.round(Math.sqrt((ogario.playerX - ogario.targetX) ** 2 + (ogario.playerY - ogario.targetY) ** 2));
             if(application.targetStatus!=2&&distance<250) {
               application.setTargetStatus(2);
               if(Connection.isFreeSpectate) {
                    Connection.sendFreeSpectate();
                    Connection.isFreeSpectate=false;
               }
             } 
        }

      }
  }
}
var reverseTrick = {
  biggerEnemy: null,
  biggerEnemyAcc: null,
  smallerEnemy: null,
  smallerEnemyAcc: null,
  smallerSize: null,
  biggerSize: null,
  smallerSumm: 0,
  biggerSumm: 0,
  biggerCells: 0,
  smallerCells: 0,
  getAngle(x1,y1,x2,y2,dis) {
         var angl = Math.round((Math.acos((y2 - y1) / dis) / Math.PI) * 180);
          //if target on left side
      
         if ((x2 - x1 > 0 && y2 - y1 < 0) || (x2 - x1 > 0 && y2 - y1 > 0)) {
            angl = 180 + (180 - angl);
         }
    return angl
  },
  getDistance(x1,y1,x2,y2){
          return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
  },
  pointInCircle: function(x, y, type) {
        for (length = 0; length < Connection.cells.length; length++) {
            var distancesquared = (x - Connection.cells[length].x) * (x - Connection.cells[length].x) + (y - Connection.cells[length].y) * (y - Connection.cells[length].y);

            if(type ==1 && distancesquared <= Connection.cells[length].size * Connection.cells[length].size){
                reverseTrick.biggerEnemy = Connection.cells[length].id;
                reverseTrick.biggerEnemyAcc = Connection.cells[length].accID;
                reverseTrick.biggerSize = ~~(Connection.cells[length].size*Connection.cells[length].size/100);
            } else if(type ==3 && distancesquared <= Connection.cells[length].size * Connection.cells[length].size) {
                reverseTrick.smallerEnemy = Connection.cells[length].id;
                reverseTrick.smallerEnemyAcc = Connection.cells[length].accID;
                reverseTrick.smallerSize = ~~(Connection.cells[length].size*Connection.cells[length].size/100);
            }
        }
  },
  check(){
      if(this.biggerEnemy && this.smallerEnemy && Connection.playerCellIDs.length){
        if(!Connection.indexedCells.hasOwnProperty(this.biggerEnemy)) {
          this.biggerEnemy= null;
          this.biggerEnemyAcc= null;
          this.biggerSize= null;
          return
        }
        if(!Connection.indexedCells.hasOwnProperty(this.smallerEnemy)) {
          this.smallerEnemy= null;
          this.smallerEnemyAcc= null;
          this.smallerSize= null;
          return
        }

            var index = Connection.selectBiggestCell ? Connection.playerCells.length - 0x1 : 0x0;
            var p = Connection.playerCells[index];
            if(Connection.playerCells[index] == undefined) return;
        
            var small = Connection.indexedCells[this.smallerEnemy],
                distToP = this.getDistance(p.targetX,p.targetY,small.targetX,small.targetY);
            //ctx.arc(players[current].x, players[current].y, players[current].size + 760, 0, this.pi2, false);
            this.smallerSize = ~~(Connection.indexedCells[this.smallerEnemy].size * Connection.indexedCells[this.smallerEnemy].size / 100);
            
            if(small.size+760+p.size<distToP) return
        
            var xc = Connection.playerCells[index].targetX//.x
            var yc = Connection.playerCells[index].targetY//.y
            
            /*var x = Connection.indexedCells[Connection.selected].targetX//.x
            var y = Connection.indexedCells[Connection.selected].targetY//.y
            
            var a = xc - x
            var b = yc - y
            var distance = Math.sqrt( a*a + b*b ) - (Connection.indexedCells[Connection.selected].size+Connection.playerCells[index].size)

            var ang = Math.atan2(y - yc, x - xc);
            Connection.cursorX= xc +(Math.cos(ang)*distance)
            Connection.cursorY= yc +(Math.sin(ang)*distance)
            Connection.sendPosition()*/
            console.log(reverseTrick)
      }
  }
}


window.addEventListener('mousedown',function(e){
    if(gameOptionSettings.stickyCell) {
      e.which == 1 ? (drawRender.LMB=true) : (drawRender.RMB=true)
    } else if(gameOptionSettings.reverseTrick) {
      reverseTrick.pointInCircle(Connection.cursorX, Connection.cursorY, e.which);
    } else if(gameOptionSettings.clickTargeting&&$('#helloContainer').is(':hidden')) {
      console.log('event')
      clickTargeting.pointInCircle(Connection.cursorX, Connection.cursorY, e.which);
    }
      
  })
  window.addEventListener('mouseup',function(e){
    if(!gameOptionSettings.stickyCell) return false
      e.which == 1 ? (drawRender.LMB=false) : (drawRender.RMB=false)
  })




let mcanvas = document.createElement('canvas');

function vis(canvas) {
//let canvas = drawRender.canvas;
//let ctx = drawRender.ctx;
let ctx = mcanvas.getContext('2d');
//document.body.appendChild(canvas)
canvas.width = 1024;
canvas.height = 1024;
let centerX = canvas.width / 2;
let centerY = canvas.height / 2;
let radius = canvas.width / 4//document.body.clientWidth <= 425 ? 120 : 160;
let steps = document.body.clientWidth <= 425 ? 60 : 120;
let interval = 360 / steps;
let pointsUp = [];
let pointsDown = [];
let running = false;
let pCircle = 2 * Math.PI * radius;
let angleExtra = 90;

// Create points
for(let angle = 0; angle < 360; angle += interval) {
let distUp = 1.1;
let distDown = 0.9;

pointsUp.push({
angle: angle + angleExtra,
x: centerX + radius * Math.cos((-angle + angleExtra) * Math.PI / 180) * distUp,
y: centerY + radius * Math.sin((-angle + angleExtra) * Math.PI / 180) * distUp,
dist: distUp
});

pointsDown.push({
angle: angle + angleExtra + 5,
x: centerX + radius * Math.cos((-angle + angleExtra + 5) * Math.PI / 180) * distDown,
y: centerY + radius * Math.sin((-angle + angleExtra + 5) * Math.PI / 180) * distDown,
dist: distDown
});
}

// -------------
// Audio stuff
// -------------

// make a Web Audio Context
const context = new AudioContext();
const splitter = context.createChannelSplitter();

const analyserL = context.createAnalyser();
analyserL.fftSize = 8192;

const analyserR = context.createAnalyser();
analyserR.fftSize = 8192;

splitter.connect(analyserL, 0, 0);
splitter.connect(analyserR, 1, 0);

// Make a buffer to receive the audio data
const bufferLengthL = analyserL.frequencyBinCount;
const audioDataArrayL = new Uint8Array(bufferLengthL);

const bufferLengthR = analyserR.frequencyBinCount;
const audioDataArrayR = new Uint8Array(bufferLengthR);

// Make a audio node
const audio = new Audio();

function loadAudio() {
audio.loop = false;
audio.autoplay = false;
audio.crossOrigin = "anonymous";

// call `handleCanplay` when it music can be played
audio.addEventListener('canplay', handleCanplay);
audio.src = "https://s3.eu-west-2.amazonaws.com/nelsoncodepen/Audiobinger_-_The_Garden_State.mp3";
audio.load();

running = true;
}

function handleCanplay() {
// connect the audio element to the analyser node and the analyser node
// to the main Web Audio context
const source = context.createMediaElementSource(audio);
source.connect(splitter);
splitter.connect(context.destination);
}

function toggleAudio() {
if (running === false) {
loadAudio();
}

if (audio.paused) {
audio.play();
} else {
audio.pause();
}
}

// -------------
// Canvas stuff
// -------------

function drawLine(points) {
let origin = points[0];

ctx.beginPath();
ctx.strokeStyle = 'blue';
ctx.lineWidth = 10;
ctx.lineJoin = 'round';
ctx.moveTo(origin.x, origin.y);

for (let i = 0; i < points.length; i++) {
ctx.lineTo(points[i].x, points[i].y);
}

ctx.lineTo(origin.x, origin.y);
ctx.stroke();
}

function connectPoints(pointsA, pointsB) {
for (let i = 0; i < pointsA.length; i++) {
ctx.beginPath();
ctx.strokeStyle = 'blue';
ctx.lineWidth = 10;
ctx.moveTo(pointsA[i].x, pointsA[i].y);
ctx.lineTo(pointsB[i].x, pointsB[i].y);
ctx.stroke();
}
}

function update(dt) {
let audioIndex, audioValue;

// get the current audio data
analyserL.getByteFrequencyData(audioDataArrayL);
analyserR.getByteFrequencyData(audioDataArrayR);

for (let i = 0; i < pointsUp.length; i++) {
audioIndex = Math.ceil(pointsUp[i].angle * (bufferLengthL / (pCircle * 2))) | 0;
// get the audio data and make it go from 0 to 1
audioValue = audioDataArrayL[audioIndex] / 255;

pointsUp[i].dist = 1.1 + audioValue * 0.8;
pointsUp[i].x = centerX + radius * Math.cos(-pointsUp[i].angle * Math.PI / 180) * pointsUp[i].dist;
pointsUp[i].y = centerY + radius * Math.sin(-pointsUp[i].angle * Math.PI / 180) * pointsUp[i].dist;

audioIndex = Math.ceil(pointsDown[i].angle * (bufferLengthR / (pCircle * 2))) | 0;
// get the audio data and make it go from 0 to 1
audioValue = audioDataArrayR[audioIndex] / 255;

pointsDown[i].dist = 0.9 + audioValue * 0.2;
pointsDown[i].x = centerX + radius * Math.cos(-pointsDown[i].angle * Math.PI / 180) * pointsDown[i].dist;
pointsDown[i].y = centerY + radius * Math.sin(-pointsDown[i].angle * Math.PI / 180) * pointsDown[i].dist;
}
}

function draw(dt) {
requestAnimationFrame(draw);

if (running) {
update(dt);
}

ctx.clearRect(0, 0, canvas.width, canvas.height);

drawLine(pointsUp);
drawLine(pointsDown);
connectPoints(pointsUp, pointsDown);
}

draw();
toggleAudio()

}

var drawRender = {
    canvas: null,
    ctx: null,
    canvasWidth: 0,
    canvasHeight: 0,
    camX: 0,
    camY: 0,
    scale: 1,
    fpsLastRequest: null,
    renderedFrames: 0,
    fps: 0,
    pi2: 2 * Math.PI,
    battleAreaMap: null,
    battleAreaMapCtx: null,
    pieChart: null,
    pellet: null,
    indicator: null,
    stats: null,
    fpsLimit: 144,
    music: false,
    setCanvas() {
        this.canvas = document.getElementById(`canvas`);
        this.ctx = this.canvas.getContext('2d');
        /*var context = this.ctx
        var drawImage = this.ctx.drawImage
        this.ctx.drawImage = async function(){drawImage.apply(context,arguments)}*/
        this.stats = new Stats();
        this.ppsPanel = this.stats.addPanel( new Stats.Panel( 'PPS', '#ff8', '#221' ) );
        this.stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild( drawRender.stats.dom );
        this.canvas.onmousemove = event => {
            Connection.clientX = event.clientX * gameOptionSettings.renderQuality;
            Connection.clientY = event.clientY * gameOptionSettings.renderQuality;
            Connection.getCursorPosition();
        };
    },
    resizeCanvas() {

        this.canvasWidth = window.innerWidth * gameOptionSettings.renderQuality//* window.devicePixelRatio;
        this.canvasHeight = window.innerHeight * gameOptionSettings.renderQuality//* window.devicePixelRatio;
        this.canvas.width = this.canvasWidth;
        this.canvas.height = this.canvasHeight;
        Connection.canvasWidth = this.canvasWidth;
        Connection.canvasHeight = this.canvasHeight;
        this.renderFrame();
    },
    setView() {
        this.setScale();
        var speed = 30
        if (Connection.playerCells.length) {
            gameOptionSettings.cameraDelay==0?Connection.calculatePlayerMassAndPosition():Connection.calculatePlayerMassAndPosition2()
            this.camX = (this.camX + Connection.viewX) / 2;
            this.camY = (this.camY + Connection.viewY) / 2;
        } else {
            this.camX = (29 * this.camX + Connection.viewX) / 30;
            this.camY = (29 * this.camY + Connection.viewY) / 30;
        }
        //this.camX=Connection.viewX
       //this.camY=Connection.viewY
        Connection.playerX = this.camX;
        Connection.playerY = this.camY;
    },
    setScale() {
        if (!Connection.autoZoom) {
            this.scale = (9 * this.scale + this.getZoom()) / 10;
            Connection.viewScale = this.scale;
            return;
        }
        if (Connection.play) {
            this.scale = (9 * this.scale + Math.min(64 / Connection.playerSize, 1) ** 0.4 * this.getZoom()) / 10;
        } else {
            this.scale = (9 * this.scale + Connection.scale * this.getZoom()) / 10;
        }
        Connection.viewScale = this.scale;
    },
    getZoom() {
        return Math.max(this.canvasWidth / 1080, this.canvasHeight / 1920) * Connection.zoomValue;
    },
    async renderFrame() {
        Connection.time = Date.now();
        for (length = 0; length < Connection.cells.length; length++) {
            Connection.cells[length].moveCell();
        }
        this.setView();
        Connection.getCursorPosition();
        Connection.sortCells();
        Connection.compareCells();
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        if (gameOptionSettings.showGrid) {
            this.drawGrid(this.ctx, this.canvasWidth, this.canvasHeight, this.scale, this.camX, this.camY);
        }

        this.ctx.save();

        this.ctx.translate(this.canvasWidth / 2, this.canvasHeight / 2);
        this.ctx.scale(this.scale, this.scale);
        this.ctx.translate(-this.camX, -this.camY);
        //this.ctx.imageSmoothingEnabled = false

        if(Connection.mapOffsetFixed && OgarioSettings.customMapTextureCanvas.complet){
            gameOptionSettings.showGrid && (this.ctx.globalCompositeOperation = 'destination-over')
            this.ctx.drawImage(OgarioSettings.customMapTextureCanvas, Connection.mapMinX, Connection.mapMaxY, Connection.mapMaxX-Connection.mapMinX, Connection.mapMinY-Connection.mapMaxY);
            gameOptionSettings.showGrid && (this.ctx.globalCompositeOperation = 'source-over')
        }


        if (gameOptionSettings.showBgSectors) {
            this.drawSectors(this.ctx, Connection.mapOffsetFixed, gameSetupTheme.sectorsX, gameSetupTheme.sectorsY, Connection.mapMinX, Connection.mapMinY, Connection.mapMaxX, Connection.mapMaxY, gameSetupTheme.gridColor, gameSetupTheme.sectorsColor, gameSetupTheme.sectorsWidth, true);
        }

        if(Connection.mapOffsetFixed && OgarioSettings.customMapLogoCanvas.complet){
            //gameOptionSettings.showGrid && (this.ctx.globalCompositeOperation = 'destination-over')
            this.ctx.globalAlpha = '0.5'
            var ofx = ((Connection.mapMaxX-Connection.mapMinX)/5)*2.2
            var ofy = ((Connection.mapMinY-Connection.mapMaxY)/5)*2.2
            /*this.ctx.drawImage(
                OgarioSettings.customMapLogoCanvas,  //2.1:5.9
                Connection.mapMinX+ofx, 
                Connection.mapMaxY+ofy, 
                (Connection.mapMaxX-Connection.mapMinX)/8.5, 
                (Connection.mapMinY-Connection.mapMaxY)/8.5
            );*/
            /*if(this.music==false) {
              vis(mcanvas)
              this.music=true
            }*/
            this.ctx.drawImage(
                mcanvas,  //2.1:5.9
                -5000-Connection.mapOffsetX, 
                -5000-Connection.mapOffsetY, 
                10000, 
                10000
            );


            this.ctx.globalAlpha = '1'
            //gameOptionSettings.showGrid && (this.ctx.globalCompositeOperation = 'source-over')
        }

        if (Connection.gameMode === ':battleroyale') {
            this.drawBattleArea(this.ctx);
        }
        if (gameOptionSettings.rainbowBorders) {//Yahnych
            const borderWidth = gameSetupTheme.bordersWidth / 2;
          if(gameOptionSettings.newRainbowBorders) {
            this.drawRainbowBorders(this.ctx, Connection.mapOffsetFixed, Connection.mapMinX - borderWidth, Connection.mapMinY - borderWidth, Connection.mapMaxX + borderWidth, Connection.mapMaxY + borderWidth, gameSetupTheme.bordersColor, gameSetupTheme.bordersWidth*10);
          } else {
            this.drawOldRainbow(this.ctx, Connection.mapOffsetFixed, Connection.mapMinX - borderWidth, Connection.mapMinY - borderWidth, Connection.mapMaxX + borderWidth, Connection.mapMaxY + borderWidth, gameSetupTheme.bordersColor, gameSetupTheme.bordersWidth*10);
          }
        } //else
        if (gameOptionSettings.showMapBorders) {
            const borderWidth = gameSetupTheme.bordersWidth / 2;
            this.drawMapBorders(this.ctx, Connection.mapOffsetFixed, Connection.mapMinX - borderWidth, Connection.mapMinY - borderWidth, Connection.mapMaxX + borderWidth, Connection.mapMaxY + borderWidth, gameSetupTheme.bordersColor, gameSetupTheme.bordersWidth);
        }
        if (gameOptionSettings.virusesRange) {
            this.drawVirusesRange(this.ctx, Connection.viruses);
        }
        if (gameOptionSettings.waves) {
            this.drawWaves();
        }
        this.drawFood();
        if (Connection.play) {
            if (gameOptionSettings.splitRange) {
                this.drawSplitRange(this.ctx, Connection.biggerSTECellsCache, Connection.playerCells, Connection.selectBiggestCell);
                this.drawSplitRange(this.ctx, Connection.biggerSTEDCellsCache, Connection.playerCells, Connection.selectBiggestCell);
                this.drawDoubleSplitRange(this.ctx, Connection.biggerSTEDCellsCache, Connection.playerCells, Connection.selectBiggestCell); //Sonia

            }
            if (gameOptionSettings.oppRings&& !gameOptionSettings.bubbleInd) {
                this.drawOppRings(this.ctx, this.scale, Connection.biggerSTEDCellsCache, Connection.biggerSTECellsCache, Connection.biggerCellsCache, Connection.smallerCellsCache, Connection.STECellsCache, Connection.STEDCellsCache, Connection.SSCellsCache);
            }
            if (gameOptionSettings.cursorTracking&& !gameOptionSettings.bubbleCursorTracker) {
                this.drawCursorTracking(this.ctx, Connection.playerCells, Connection.cursorX, Connection.cursorY);
            }
        }
        this.drawGhostCells();
        for (var length = 0; length < Connection.removedCells.length; length++) {
            Connection.removedCells[length].draw(this.ctx, true);
        }
        for (length = 0; length < Connection.cells.length; length++) {
            Connection.cells[length].draw(this.ctx);
            ///Sticky cell
            if(drawRender.LMB && this.pointInCircle(Connection.cursorX, Connection.cursorY, Connection.cells[length].x, Connection.cells[length].y, Connection.cells[length].size)){
                Connection.selected = Connection.cells[length].id
                this.drawRing(this.ctx,Connection.cells[length].x,Connection.cells[length].y,Connection.cells[length].size,0.75,'#ffffff')
             }
        }
        Connection.indexedCells[reverseTrick.biggerEnemy] && this.drawRing(this.ctx,
            Connection.indexedCells[reverseTrick.biggerEnemy].x,
            Connection.indexedCells[reverseTrick.biggerEnemy].y,
            Connection.indexedCells[reverseTrick.biggerEnemy].size,
        0.75,'red');
        Connection.indexedCells[reverseTrick.smallerEnemy] && this.drawRing(this.ctx,
            Connection.indexedCells[reverseTrick.smallerEnemy].x,
            Connection.indexedCells[reverseTrick.smallerEnemy].y,
            Connection.indexedCells[reverseTrick.smallerEnemy].size,
        0.75,'blue');
         ///Sticky cell
        Connection.indexedCells[Connection.selected] && this.drawRing(this.ctx,
            Connection.indexedCells[Connection.selected].x,
            Connection.indexedCells[Connection.selected].y,
            Connection.indexedCells[Connection.selected].size,
        0.75,'#ffffff');

        if (Connection.play) {///

            if (gameOptionSettings.bubbleInd) {
                this.drawBOppRings(this.ctx, this.scale, Connection.biggerSTEDCellsCache, Connection.biggerSTECellsCache, Connection.biggerCellsCache, Connection.smallerCellsCache, Connection.STECellsCache, Connection.STEDCellsCache, Connection.SSCellsCache);
            }
            if (gameOptionSettings.bubbleCursorTracker) {
                this.drawBCursorTracking(this.ctx, Connection.playerCells, Connection.cursorX, Connection.cursorY);
            }
            if (gameOptionSettings.FBTracking && Connection.arrowFB[0].visible) {
                this.drawFBTracking(this.ctx, Connection.playerCells, Connection.arrowFB[0].x, Connection.arrowFB[0].y);
            }
        }

        if(drawRender.RMB && Connection.indexedCells[Connection.selected] && Connection.playerCellIDs.length){
            var index = Connection.selectBiggestCell ? Connection.playerCells.length - 0x1 : 0x0;

            if(Connection.playerCells[index] == undefined) return;
            var xc = Connection.playerCells[index].targetX//.x
            var yc = Connection.playerCells[index].targetY//.y
            
            var x = Connection.indexedCells[Connection.selected].targetX//.x
            var y = Connection.indexedCells[Connection.selected].targetY//.y
            
            var a = xc - x
            var b = yc - y
            var distance = Math.sqrt( a*a + b*b ) - (Connection.indexedCells[Connection.selected].size+Connection.playerCells[index].size)

            var ang = Math.atan2(y - yc, x - xc);
            Connection.cursorX= xc +(Math.cos(ang)*distance)
            Connection.cursorY= yc +(Math.sin(ang)*distance)
            Connection.sendPosition()

        }

        if(gameOptionSettings.debug){
            this.drawViewport(this.ctx, 'Viewport', Connection.camMinX, Connection.camMinY, Connection.camMaxX, Connection.camMaxY, gameSetupTheme.bordersColor, 15);

            //this.newViewport( this.ctx, 'Client', Connection.viewX, Connection.viewY, Connection.isSpectateEnabled, Connection.isFreeSpectate, Connection.leaderboard, Connection.playerCells)
            if(gameOptionSettings.fullSpectator){
                for (let i = 0; i<spects.length; i++) {
                     this.newViewport( this.ctx, spects[i].number, spects[i].getX(spects[i].viewX), spects[i].getY(spects[i].viewY), spects[i].isSpectateEnabled, spects[i].isFreeSpectate, [], [])
                }

            }
        }

        this.ctx.restore();
        if (Connection.gameMode === `:teams`) {
            if (this.pieChart && this.pieChart.width) {
                this.ctx.drawImage(this.pieChart, this.canvasWidth - this.pieChart.width - 10, 10);
            }
        }

        if(gameOptionSettings.debug){
            this.ctx.fillStyle  = "white";
            this.ctx.font = "15px sans-serif";
            this.ctx.textAlign = "start";
            var lw=(this.canvasHeight/2)
            this.ctx.fillText("playerID: "+application.playerID, 50, lw+=25);
            this.ctx.fillText("isFreeSpectate: "+Connection.isFreeSpectate, 50, lw+=25);
            this.ctx.fillText("isSpectateEnabled: "+Connection.isSpectateEnabled, 50, lw+=25);
            this.ctx.fillText("realQuadrant: "+Connection.realQuadrant, 50, lw+=25);
            this.ctx.fillText("lastQuadrant: "+Connection.lastQuadrant, 50, lw+=25);
            this.ctx.fillText("quadrant: "+Connection.quadrant, 50, lw+=25);
            this.ctx.fillText("application.lastMostLike: "+application.lastMostLike, 50, lw+=25);
            //Connection.camMaxX && this.ctx.fillText("cMaxX: "+Connection.camMaxX, 50, lw+=30);
            //Connection.camMaxY && this.ctx.fillText("cMaxY: "+Connection.camMaxY, 50, lw+=30);
            //Connection.camMinX && this.ctx.fillText("cMinX: "+Connection.camMinX, 50, lw+=30);
            //Connection.camMinY && this.ctx.fillText("cMinY: "+Connection.camMinY, 50, lw+=30);
        }
    },
    drawWaves(){
        let waves = Connection.Waves

        this.ctx.globalAlpha = gameSetupTheme.darkTheme ? 0.75 : 0.35;
        for (let length = waves.length-1; length >0; length--) {

            let r = (Date.now()-waves[length].time)/2
            

            let gradient = this.ctx.createRadialGradient(waves[length].x, waves[length].y, r-r/4, waves[length].x, waves[length].y, r);

            gradient.addColorStop(0, waves[length].color+"00");
            gradient.addColorStop(1, waves[length].color);
          
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = r/4;
            this.ctx.beginPath();
            this.ctx.arc(waves[length].x, waves[length].y, r-r/8, 0, this.pi2, false);
            this.ctx.closePath();
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.strokeStyle = gameSetupTheme.splitRangeColor;
            this.ctx.lineWidth = 5;
            this.ctx.beginPath();
            this.ctx.arc(waves[length].x, waves[length].y, r, 0, this.pi2, false);
            this.ctx.closePath();
            this.ctx.stroke();
          if(r>500){
            Connection.Waves.splice(length, 1);
          }
        }
        this.ctx.globalAlpha = 1;
    },
    drawFBTracking(ctx, players, x, y) {//Yahnych
        for (let length = 0; length < players.length; length++) {
          let t = players[length];
          let r = t.size/3;
                            //distance to target
          var dis = Math.sqrt((x - t.x) * (x - t.x) + (y - t.y) * (y - t.y));
          //angle 
          var angl = Math.round((Math.acos((t.y - y) / dis) / Math.PI) * 180);
          //if target on left side
      
         if ((t.x - x > 0 && t.y - y < 0) || (t.x  - x > 0 && t.y - y > 0)) {
            angl = 180 + (180 - angl);
         }

         // Store the current context state (i.e. rotation, translation etc..)
         ctx.save()

         //Convert degrees to radian 
         var rad = angl * Math.PI / 180;

         //Set the origin to the center of the image
         ctx.translate(t.x, t.y);

        //Rotate the canvas around the origin
        ctx.rotate(rad);

        //draw the image    
        //ctx.drawImage(c, t.size * (-1),t.size * (-1),t.size*2,t.size*2);
          let grad=ctx.createLinearGradient(0, -t.size, 0, r*2-t.size);//Yahnych
          grad.addColorStop(0, gameSetupTheme.splitRangeColor);
          grad.addColorStop(1, gameSetupTheme.splitRangeColor+"00");

          
          ctx.fillStyle = grad;
          ctx.globalAlpha = gameSetupTheme.darkTheme ? 0.75 : 0.35;
          ctx.beginPath();
          ctx.arc(0, 0-(t.size-r), r, 0, Math.PI * 2, false)
          ctx.fill();
          ctx.globalAlpha = 1;
          // Restore canvas state as saved from above
          ctx.restore();
        }          
    },
    newViewport(ctx, name, viewX, viewY, isSpectateEnabled = false, isFreeSpectate = false, leaderboard = [],  cells=[]){
            var size = 0
            var mtp = 1.985
            
            if(cells.length>0){
                for (var im = 0; cells.length > im; im++) 
                    size += cells[im].size
            }else if( isFreeSpectate==false && isSpectateEnabled==true ){
                    for (var i = 0; leaderboard.length > i; i++) {
                        for (var im = 0; cells.length > im; im++) 
                            if (cells[im].nick == leaderboard[i].nick)
                                size += cells[im].size
                        break
                    }
            }else{
                if(isFreeSpectate && isSpectateEnabled) mtp = 4.95
            }
            var s = Math.pow(Math.min(64 / size, 1), 0.4000);
            var w = 1024/ s / 2 * mtp; //WSVGA
            var h = 600 / s / 2 * mtp;
            this.drawViewport(ctx, `Viewport# ${name}`, viewX - w, viewY - h, viewX + w, viewY + h, gameSetupTheme.bordersColor, 15);
            //this.drawRing(this.ctx, Connection.viewX, Connection.viewY, 15, 1, '#ff00ff') 
    },
    drawViewport:function(ctx, text, minX, maxY, maxX, minY, stroke, width){

        ctx.strokeStyle = stroke;
        ctx.lineWidth = width;

        ctx.fillStyle  = "white";
        ctx.font = "100px sans-serif";
        ctx.textAlign = "end";
        ctx.textBaseline = "hanging"
        ctx.fillText(text, maxX, maxY);

        ctx.beginPath();
        ctx.moveTo(minX, maxY);
        ctx.lineTo(maxX, maxY);
        ctx.lineTo(maxX, minY);
        ctx.lineTo(minX, minY);
        ctx.closePath();
        ctx.stroke();

    },
    pointInCircle: function(x, y, cx, cy, radius) {
        var distancesquared = (x - cx) * (x - cx) + (y - cy) * (y - cy);
        return distancesquared <= radius * radius;
    },
    drawRing : function (ctx, x, y, size, alpha, color) {
        ctx.lineWidth = 20;
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, size-10, 0x0, this.pi2, false);
            ctx.closePath();
            ctx.stroke();
        
        ctx.globalAlpha = 1;
    },
    drawGrid(ctx, width, heigth, scale, camX, camY) {
        const reWidth = width / scale;
        const reHeigth = heigth / scale;
        let x = (-camX + reWidth / 2) % 50;
        let y = (-camY + reHeigth / 2) % 50;
        ctx.strokeStyle = gameSetupTheme.gridColor;
        ctx.globalAlpha = 1 * scale;
        ctx.beginPath();
        for (; x < reWidth; x += 50) {
            ctx.moveTo(x * scale - 0.5, 0);
            ctx.lineTo(x * scale - 0.5, reHeigth * scale);
        }
        for (; y < reHeigth; y += 50) {
            ctx.moveTo(0, y * scale - 0.5);
            ctx.lineTo(reWidth * scale, y * scale - 0.5);
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
    },
    drawSectors(ctx, mapOffset, x, y, minX, minY, maxX, maxY, stroke, color, width, type) {
        if (!mapOffset && type) {
            return;
        }
        const posX = ~~((maxX - minX) / x);
        const posY = ~~((maxY - minY) / y);
        let rePosX = 0;
        let rePosY = 0;
        ctx.strokeStyle = stroke;
        ctx.fillStyle = color;
        ctx.lineWidth = width;
        if (type || !type && gameOptionSettings.showMiniMapGrid) {
            ctx.beginPath();
            for (var length = 0; length < x + 1; length++) {
                rePosX = minX + posX * length;
                ctx.moveTo(length == x ? maxX : rePosX, minY);
                ctx.lineTo(length == x ? maxX : rePosX, maxY);
            }
            for (var length = 0; length < y + 1; length++) {
                rePosY = minY + posY * length;
                ctx.moveTo(minX - width / 2, length == y ? maxY : rePosY);
                ctx.lineTo(maxX + width / 2, length == y ? maxY : rePosY);
            }
            ctx.stroke();
        } else {
            this.drawMapBorders(ctx, mapOffset, minX, minY, maxX, maxY, stroke, width);
        }
        if (type) {
            ctx.font = `${gameSetupTheme.sectorsFontWeight} ${gameSetupTheme.sectorsFontSize}px ${gameSetupTheme.sectorsFontFamily}`;
        } else {
            ctx.font = `${gameSetupTheme.miniMapFontWeight} ${~~(0.4 * posY)}px ${gameSetupTheme.miniMapFontFamily}`;
        }
        ctx.textAlign = 'center';
        ctx.textBaseline = `middle`;
        for (var length = 0; length < y; length++) {
            for (let length_2 = 0; length_2 < x; length_2++) {
                const text = String.fromCharCode(65 + length) + (length_2 + 1);
                rePosX = ~~(minX + posX / 2 + length_2 * posX);
                rePosY = ~~(minY + posY / 2 + length * posY);
                ctx.fillText(text, rePosX, rePosY);
            }
        }
    },
    drawMapBorders(ctx, mapOffset, minX, maxY, maxX, minY, stroke, width) {
        if (!mapOffset) {
            return;
        }
        ctx.strokeStyle = stroke;
        ctx.lineWidth = width;

        ctx.beginPath();
        ctx.moveTo(minX, maxY);
        ctx.lineTo(maxX, maxY);
        ctx.lineTo(maxX, minY);
        ctx.lineTo(minX, minY);
        ctx.closePath();
        ctx.stroke();

        /*if(!window.firstrender){
            window.firstrender = true
            console.log(mapOffset,minX, maxY, maxX, minY)
            console.log(Math.sqrt(((maxX - minX) ** 2) + ((maxY - minY) ** 2)))          
        }*/


        //ctx.fillStyle = "#FF0000";
        //ctx.fillRect(minX,minY,maxY,maxX);

    },
    getGrad(ctx, x1,y1,x2,y2) {
      let grad=ctx.createLinearGradient(x1, y1, x2, y2);//Yahnych
      grad.addColorStop(0, "black");
      grad.addColorStop(0.25, "rgba(255,255,255,0.8)");
      grad.addColorStop(0.4, "rgba(255,255,255,0.5)");
      grad.addColorStop(0.5, "rgba(255,255,255,0)");
      grad.addColorStop(0.6, "rgba(255,255,255,0.5)");
      grad.addColorStop(0.75, "rgba(255,255,255,0.8)");
      grad.addColorStop(1, "black");
      return grad
    },
    gradLine(ctx, fillStyle, x1,y1, x2,y2, x3,y3, x4,y4) {
        ctx.fillStyle = fillStyle;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.lineTo(x4, y4);

        ctx.closePath();
        ctx.fill();
    },
    drawOldRainbow(ctx, mapOffset, minX, minY, maxX, maxY, stroke, width) {//Yahnych
        if (!mapOffset) {
            return;
        }
      ctx.save();
      let m = (width/2)*1.1,
          m2= width/2,
          time = Connection.time,
          saturate = "100%", 
          lightness = "50%";
      
      var g1 = ctx.createLinearGradient(minX, 0, maxX, 0);
      g1.addColorStop(0,    `hsl(${~~((time)/30+0)%360},${saturate},${lightness})`);
      g1.addColorStop(0.33, `hsl(${~~((time)/30+60)%360},${saturate},${lightness})`);
      g1.addColorStop(0.67, `hsl(${~~((time)/30+120)%360},${saturate},${lightness})`);
      g1.addColorStop(1, `hsl(${~~((time)/30+180)%360},${saturate},${lightness})`);
      var g2 = ctx.createLinearGradient(minX, 0, maxX, 0);
      g2.addColorStop(0, `hsl(${~~((time)/30+180)%360},${saturate},${lightness})`);
      g2.addColorStop(0.33, `hsl(${~~((time)/30+240)%360},${saturate},${lightness})`);
      g2.addColorStop(0.67, `hsl(${~~((time)/30+300)%360},${saturate},${lightness})`);
      g2.addColorStop(1,    `hsl(${~~((time)/30+0)%360},${saturate},${lightness})`);
      
      this.gradLine(ctx, g1, minX+m2-1,minY+m2, maxX-m2+1,minY+m2, maxX+m2+1,minY-m2, minX-m2-1,minY-m2)//Yahnych
      ctx.rotate(Math.PI / 2);
      this.gradLine(ctx, g2, minX+m2-1,minY+m2, maxX-m2+1,minY+m2, maxX+m2+1,minY-m2, minX-m2-1,minY-m2)//Yahnych
      ctx.rotate(Math.PI / 2);
      this.gradLine(ctx, g1, minX+m2-1,minY+m2, maxX-m2+1,minY+m2, maxX+m2+1,minY-m2, minX-m2-1,minY-m2)//Yahnych
      ctx.rotate(Math.PI / 2);
      this.gradLine(ctx, g2, minX+m2-1,minY+m2, maxX-m2+1,minY+m2, maxX+m2+1,minY-m2, minX-m2-1,minY-m2)//Yahnych
      ctx.rotate(Math.PI / 2);
      
      let top=this.getGrad(ctx, 0, minY-m, 0, minY+m);//Yahnych
      
      ctx.globalCompositeOperation = 'destination-out';
      this.gradLine(ctx, top, minX+m-1,minY+m, maxX-m+1,minY+m, maxX+m+1,minY-m, minX-m-1,minY-m)//Yahnych
      ctx.rotate(Math.PI / 2);
      this.gradLine(ctx, top, minX+m-1,minY+m, maxX-m+1,minY+m, maxX+m+1,minY-m, minX-m-1,minY-m)
      ctx.rotate(Math.PI / 2);
      this.gradLine(ctx, top, minX+m-1,minY+m, maxX-m+1,minY+m, maxX+m+1,minY-m, minX-m-1,minY-m)
      ctx.rotate(Math.PI / 2);
      this.gradLine(ctx, top, minX+m-1,minY+m, maxX-m+1,minY+m, maxX+m+1,minY-m, minX-m-1,minY-m)
      ctx.rotate(Math.PI / 2);
      ctx.globalCompositeOperation = 'source-over';
      ctx.restore();
    },
    drawRainbowBorders(ctx, mapOffset, minX, minY, maxX, maxY, stroke, width) {
        if (!mapOffset) {
            return;
        }
      ctx.save();

      ctx.filter = `blur(${~~(width/2*this.scale)}px)`;
      let m = (width/2)*1.1,
          time = Connection.time,
          saturate = "100%", 
          lightness = "50%";
      
      var g1 = ctx.createLinearGradient(minX, 0, maxX, 0);
      g1.addColorStop(0,    `hsl(${~~((time)/30+0)%360},${saturate},${lightness})`);
      g1.addColorStop(0.33, `hsl(${~~((time)/30+60)%360},${saturate},${lightness})`);
      g1.addColorStop(0.67, `hsl(${~~((time)/30+120)%360},${saturate},${lightness})`);
      g1.addColorStop(1, `hsl(${~~((time)/30+180)%360},${saturate},${lightness})`);
      var g2 = ctx.createLinearGradient(minX, 0, maxX, 0);
      g2.addColorStop(0, `hsl(${~~((time)/30+180)%360},${saturate},${lightness})`);
      g2.addColorStop(0.33, `hsl(${~~((time)/30+240)%360},${saturate},${lightness})`);
      g2.addColorStop(0.67, `hsl(${~~((time)/30+300)%360},${saturate},${lightness})`);
      g2.addColorStop(1,    `hsl(${~~((time)/30+0)%360},${saturate},${lightness})`);
      
      ctx.fillStyle = g1;
      ctx.fillRect(minX-m, minY-m, maxX*2+m, width);//Yahnych
      ctx.rotate(Math.PI / 2);
      ctx.fillStyle = g2;
      ctx.fillRect(minX-m, minY-m, maxX*2+m, width);
      ctx.rotate(Math.PI / 2);
      ctx.fillStyle = g1;
      ctx.fillRect(minX-m, minY-m, maxX*2+m, width);
      ctx.rotate(Math.PI / 2);
      ctx.fillStyle = g2;
      ctx.fillRect(minX-m, minY-m, maxX*2+m, width);
      ctx.filter = 'none';
      ctx.restore();

    },
    drawVirusesRange(ctx, viruses, reset) {
        var getAngle = function(x1,y1,x2,y2,dis) {
         var angl = Math.round((Math.acos((y2 - y1) / dis) / Math.PI) * 180);
          //if target on left side
      
         if ((x2 - x1 > 0 && y2 - y1 < 0) || (x2 - x1 > 0 && y2 - y1 > 0)) {
            angl = 180 + (180 - angl);
         }
         return angl
       },
       getDistance = function(x1,y1,x2,y2){
          return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
       },
       angleWidth = function(d, l) {return 2*Math.atan(d/(2*l))/ Math.PI * 180}
        if (!viruses.length) {
            return;
        }
        ctx.beginPath();
        for (let length = 0; length < viruses.length; length++) {
            const x = viruses[length].x;
            const y = viruses[length].y;

            ctx.moveTo(x, y);
            ctx.arc(x, y, viruses[length].size + 820, 0, this.pi2, false);
        }
        ctx.fillStyle = gameSetupTheme.virusColor;
        ctx.globalAlpha = 0.1;
        ctx.fill();
        if(gameOptionSettings.cursorTracking&&Connection.playerCells.length) {
        ctx.beginPath();
         for (let length = 0; length < viruses.length; length++) {
            const x = viruses[length].x;
            const y = viruses[length].y;
            
              for (let i = 0; i < Connection.playerCells.length; i++) {
                const cell = Connection.playerCells[i];
                const l = getDistance(cell.x,cell.y,x,y);
                if(l>cell.size+900) continue
                const a = getAngle(cell.x,cell.y,x,y,l);
                const ca = getAngle(cell.x,cell.y,Connection.cursorX,Connection.cursorY,getDistance(cell.x,cell.y,Connection.cursorX,Connection.cursorY));
                const aw = angleWidth(viruses[length].size, l)
                //const limit = 7071;
                //var dotX = cell.x+((Connection.cursorX-cell.x)*200);
                //var dotY = cell.y+((Connection.cursorY-cell.y)*200);
                //if(dotX>=limit||dotX<=-limit) {
                //   dotY=Math.abs(limit/dotX)*dotY;
                //   dotX=limit*Math.sign(dotX);
                //}
                //if(dotY>=limit||dotY<=-limit) {
                //   dotX=Math.abs(limit/dotY)*dotX;
                //   dotY=limit*Math.sign(dotY);
                //}
             
                if(a+aw>ca&&a-aw<ca) {
                  console.log('virus', viruses[length], l, aw)
                   ctx.moveTo(x, y);
                   ctx.arc(x, y, viruses[length].size + 820, (ca+90)/360*this.pi2-Math.PI*0.15, (ca+90)/360*this.pi2+Math.PI*0.15, false);
                   //ctx.moveTo(x, y);
                   //ctx.lineTo(dotX, dotY);
                }
             }
          }
        //ctx.lineWidth = 4;
        //ctx.strokeStyle = gameSetupTheme.cursorTrackingColor;
        ctx.fillStyle = gameSetupTheme.virusColor;
        ctx.globalAlpha = 0.3;
        ctx.fill();
        //ctx.stroke();
        }

        ctx.globalAlpha = 1;
        if (reset) {
            viruses = [];
        }
    },
    drawFood() {
        if (!Connection.showFood || gameOptionSettings.autoHideFoodOnZoom && this.scale < 0.2) {
            return;
        }
        if (gameOptionSettings.autoHideFood && !Connection.foodIsHidden && Connection.playerMass > 1000) {
            Connection.showFood = false;
            Connection.foodIsHidden = true;
            return;
        }
        if (!gameOptionSettings.rainbowFood) {
                this.drawCachedFood(this.ctx, Connection.food, this.scale);
                return;
        }
        for (let length = 0; length < Connection.food.length; length++) {
            Connection.food[length].moveCell();
            Connection.food[length].draw(this.ctx);
        }
    },
    drawCachedFood(ctx, food, scale, reset) {
            if (!food.length) {
                return;
            }

                ctx.beginPath();
                for (var length = 0; length < food.length; length++) {
                    var x = food[length].x;
                    var y = food[length].y;
                    if (!food[length].isInDisplay(x, y, food[length].size)) {
                        continue;
                    }
                    ctx.moveTo(x, y);
                    if (scale < 0.16) {
                        const size = food[length].size + gameSetupTheme.foodSize;
                        ctx.rect(x - size, y - size, 2 * size, 2 * size);
                        continue;
                    }
                    ctx.arc(x, y, food[length].size + gameSetupTheme.foodSize, 0, this.pi2, false);
                }
                ctx.fillStyle = gameSetupTheme.foodColor;
                ctx.globalAlpha = 1;
                ctx.fill();
            
            if (reset) {
                food = [];
            }
    },
    drawSplitRange(ctx, biggestCell, players, currentBiggestCell, reset) {
        this.drawCircles(ctx, biggestCell, 760, 4, 0.4, gameSetupTheme.enemyBSTEColor);
        if (players.length) {
            const current = currentBiggestCell ? players.length - 1 : 0;
            ctx.lineWidth = 6;
            ctx.globalAlpha = gameSetupTheme.darkTheme ? 0.7 : 0.35;
            ctx.strokeStyle = gameSetupTheme.splitRangeColor;
            ctx.beginPath();
            ctx.arc(players[current].x, players[current].y, players[current].size + 760, 0, this.pi2, false);
            ctx.closePath();
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
        if (reset) {
            biggestCell = [];
        }
    },
    'drawDoubleSplitRange': function(t, e, i, s, o) {
                //if (this.drawCircles(t, e, 760, 4, 0.4, '#BE00FF'), i.length) {
                if (this.draw2Circles(t, e, 760, 4, 0.4, gameSetupTheme.enemyBSTEDColor), i.length) { //Sonia2
                    //if (this.draw2Circles(t, e, 760, 4, 0.4, '#8000ff'), i.length) { //Sonia
                    //this.drawSplitRange(this.ctx, LM.biggerSTECellsCache, LM.playerCells, LM.selectBiggestCell);

                    var a = s ? i.length - 1 : 0;
                    //console.log(i[a].size);
                    if (i[a].size >= 400 /*&& defaultmapsettings.qdsplitRange*/) { //Sonia2
                        t.lineWidth = 6,
                            t.globalAlpha = gameSetupTheme.darkTheme ? 0.7 : 0.35,
                            t.strokeStyle = gameSetupTheme.splitRangeColor;
                        t.beginPath();
                        t.arc(i[a].x, i[a].y, 2 * i[a].size + 760, 0, this.pi2, false);
                        t.closePath();
                        t.stroke();
                    }
                }
                t.globalAlpha = 1;
                if (o) {
                    e = [];
                }
    },
    drawBOppRings(ctx, scale, ip, biggerSte, biggetCell, smallerCell, smallSte, ap, ss, reset) {
        const width = 14 + 2 / scale;
        const alpha = 12 + 1 / scale;
        this.drawBubbleCircles(ctx, ip, width, alpha, 0.75, gameSetupTheme.enemyBSTEDColor); //Sonia2
        this.drawBubbleCircles(ctx, biggerSte, width, alpha, 0.75, gameSetupTheme.enemyBSTEColor);
        this.drawBubbleCircles(ctx, biggetCell, width, alpha, 0.75, gameSetupTheme.enemyBColor);
        this.drawBubbleCircles(ctx, ss, width, alpha, 0.75, gameSetupTheme.splitRangeColor);
        this.drawBubbleCircles(ctx, smallerCell, width, alpha, 0.75, gameSetupTheme.enemySColor);
        this.drawBubbleCircles(ctx, smallSte, width, alpha, 0.75, gameSetupTheme.enemySSTEColor);
        this.drawBubbleCircles(ctx, ap, width, alpha, 0.75, gameSetupTheme.enemySSTEDColor); //Sonia2
        if (reset) {
            biggerSte = [];
            biggetCell = [];
            smallerCell = [];
            smallSte = [];
            ip = [];
            ap = [];
            ss = [];
        }
    },
    drawOppRings(ctx, scale, ip, biggerSte, biggetCell, smallerCell, smallSte, ap, ss, reset) {
        const width = 14 + 2 / scale;
        const alpha = 12 + 1 / scale;
        this.drawCircles(ctx, ip, width, alpha, 0.75, gameSetupTheme.enemyBSTEDColor); //Sonia2
        this.drawCircles(ctx, biggerSte, width, alpha, 0.75, gameSetupTheme.enemyBSTEColor);
        this.drawCircles(ctx, biggetCell, width, alpha, 0.75, gameSetupTheme.enemyBColor);
        this.drawCircles(ctx, ss, width, alpha, 0.75, gameSetupTheme.splitRangeColor);
        this.drawCircles(ctx, smallerCell, width, alpha, 0.75, gameSetupTheme.enemySColor);
        this.drawCircles(ctx, smallSte, width, alpha, 0.75, gameSetupTheme.enemySSTEColor);
        this.drawCircles(ctx, ap, width, alpha, 0.75, gameSetupTheme.enemySSTEDColor); //Sonia2
      
        if (reset) {
            biggerSte = [];
            biggetCell = [];
            smallerCell = [];
            smallSte = [];
            ip = [];
            ap = [];
            ss = [];
        }
    },
    drawBCursorTracking(ctx, players, cursorX, cursorY) {//Yahnych
        for (let length = 0; length < players.length; length++) {
            let t = Connection.playerCells[length];
            if (Connection.playerCells[length].angle == undefined) {
                Connection.playerCells[length].angle = 0
            }
            let r = t.size/3;
            //distance to target
            var dis = Math.sqrt((cursorX - t.x) * (cursorX - t.x) + (cursorY - t.y) * (cursorY - t.y));
            //angle in deg
            var angl = Math.round((Math.acos((t.y - cursorY) / dis) / Math.PI) * 180);
            //if target on left side
        
            if ((t.x - cursorX > 0 && t.y - cursorY < 0) || (t.x  - cursorX > 0 && t.y - cursorY > 0)) {
              angl = 180 + (180 - angl);
            }
            var d = 4;
            if (angl - t.angle > d && angl - t.angle < 180 -d || angl - t.angle < 180 * (-1) + d) {
                t.angle += d/2;
                if(t.angle > 360) {
                   t.angle = t.angle - 360
                }
            } else if(angl - t.angle < d * (-1) && angl - t.angle > 180 * (-1) + d|| angl - t.angle > 180 + d) {
                t.angle -= d/2;
                if(t.angle < 0) {
                   t.angle = 360 - t.angle
                }
           }

           ctx.save()

          //Convert degrees to radian 
          var rad = t.angle * Math.PI / 180;

          ctx.translate(t.x, t.y);

          ctx.rotate(rad);

        //ctx.drawImage(c, t.size * (-1),t.size * (-1),t.size*2,t.size*2);
        let grad=ctx.createLinearGradient(0, -t.size, 0, r*2-t.size);//Yahnych
        grad.addColorStop(0, gameSetupTheme.cursorTrackingColor);
        grad.addColorStop(1, gameSetupTheme.cursorTrackingColor+"00");

          
          ctx.fillStyle = grad;
          ctx.globalAlpha = gameSetupTheme.darkTheme ? 0.75 : 0.35;
          ctx.beginPath();
          ctx.arc(0, 0-(t.size-r), r, 0, Math.PI * 2, false)
          ctx.fill();
          ctx.globalAlpha = 1;
        // Restore canvas state as saved from above
        ctx.restore();
        }
    },
    drawCursorTracking(ctx, players, cursorX, cursorY) {
     for (let length = 0; length < players.length; length++) {
      ctx.lineWidth = 4;
        ctx.globalAlpha = gameSetupTheme.darkTheme ? 0.75 : 0.35;
        ctx.strokeStyle = gameSetupTheme.cursorTrackingColor;
        ctx.beginPath();
        for (let length = 0; length < players.length; length++) {
            ctx.moveTo(players[length].x, players[length].y);
            ctx.lineTo(cursorX, cursorY);
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
     }
    },
    //Sonia (added entire function)
    'draw2Circles': function(t, e, i, s, o, a) {
                t.lineWidth = s, t.globalAlpha = o, t.strokeStyle = a;
                //for (var n = 0; n < e.length; n++) t.beginPath(), t.arc(e[n].x, e[n].y, 1.5*e[n].size + 2*i, 0, this.pi2, false), t.closePath(), t.stroke();
                if (gameOptionSettings.qdsplitRange) { //Sonia2
                    for (var n = 0; n < e.length; n++) t.beginPath(), t.arc(e[n].x, e[n].y, 2 * e[n].size + i, 0, this.pi2, false), t.closePath(), t.stroke(); //760+2*cell.size is the correct
                } //Sonia2
                if (gameOptionSettings.sdsplitRange) { //Sonia2
                    for (var n = 0; n < e.length; n++) t.setLineDash([20, 30]), t.lineWidth = 2 * s, t.beginPath(), t.arc(e[n].x, e[n].y, 1.5 * e[n].size + 2 * i, 0, this.pi2, false), t.closePath(), t.stroke(); //Sonia2
                    t.setLineDash([]); //Sonia2
                    t.lineWidth = s; //Sonia2
                } //Sonia2
                t.globalAlpha = 1;
    },
    drawCircles(ctx, players, scale, width, alpha, stroke) {
        ctx.lineWidth = width;
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = stroke;
        for (let length = 0; length < players.length; length++) {
            ctx.beginPath();
            ctx.arc(players[length].x, players[length].y, players[length].size + scale, 0, this.pi2, false);
            ctx.closePath();
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
    },
/*        drawBubbleCircles(ctx, players, scale, width, alpha, stroke, c=0) {//Yahnych
       if(c==0) {
        ctx.lineWidth = width;
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = stroke;
        for (let length = 0; length < players.length; length++) {
            ctx.beginPath();
            ctx.arc(players[length].x, players[length].y, players[length].size + scale, 0, this.pi2, false);
            ctx.closePath();
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
      } else {
        for (let length = 0; length < players.length; length++) {
          let t = players[length];
          var dis = Math.sqrt((t.targetX - t.x) * (t.targetX - t.x) + (t.targetY - t.y) * (t.targetY - t.y));
          var angl = Math.acos((t.y - t.targetY) / dis);
          var newX = t.x + (t.size-t.size/3) * Math.cos(angl);
          var newY = t.y + (t.size-t.size/3) * Math.sin(angl);
          ctx.save();
          ctx.strokeStyle = stroke;
          ctx.globalAlpha = alpha;
          ctx.lineWidth = width;
          ctx.beginPath();
          ctx.arc(newX, newY, t.size/3, 0, Math.PI * 2, false)
          ctx.stroke();
          ctx.globalAlpha = 1;
          ctx.restore();
        }
      }
    },*/
    drawBubbleCircles(ctx, players, scale, width, alpha, stroke) {//Yahnych
        for (let length = 0; length < players.length; length++) {
          let t = players[length];
          let r = t.size/3;
                            //distance to target
          var dis = Math.sqrt((t.targetX - t.x) * (t.targetX - t.x) + (t.targetY - t.y) * (t.targetY - t.y));
          //angle 
          var angl = Math.round((Math.acos((t.y - t.targetY) / dis) / Math.PI) * 180);
          //if target on left side
      
         if ((t.x - t.targetX > 0 && t.y - t.targetY < 0) || (t.x  - t.targetX > 0 && t.y - t.targetY > 0)) {
            angl = 180 + (180 - angl);
         }

         // Store the current context state (i.e. rotation, translation etc..)
         ctx.save()

         //Convert degrees to radian 
         var rad = angl * Math.PI / 180;

         //Set the origin to the center of the image
         ctx.translate(t.x, t.y);

        //Rotate the canvas around the origin
        ctx.rotate(rad);

        //draw the image    
        //ctx.drawImage(c, t.size * (-1),t.size * (-1),t.size*2,t.size*2);
        let grad=ctx.createLinearGradient(0, -t.size, 0, r*2-t.size);//Yahnych
        grad.addColorStop(0, stroke);
        grad.addColorStop(1, stroke+"00");

          
          ctx.fillStyle = grad;
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(0, 0-(t.size-r), r, 0, Math.PI * 2, false)
          ctx.fill();
          ctx.globalAlpha = 1;
        // Restore canvas state as saved from above
        ctx.restore();
        }
      
    },
    drawDashedCircle(ctx, x, y, radius, times, width, color) {
        const pi2 = this.pi2 / times;
        ctx.lineWidth = width;
        ctx.strokeStyle = color;
        for (let length = 0; length < times; length += 2) {
            ctx.beginPath();
            ctx.arc(x, y, radius - width / 2, length * pi2, (length + 1) * pi2, false);
            ctx.stroke();
        }
    },
    drawTeammatesInd(ctx, x, y, size) {
        if (!this.indicator) {
            return;
        }
        ctx.drawImage(this.indicator, x - 45, y - size - 90);
    },
    drawPieChart() {
        if (!this.pieChart) {
            this.pieChart = document.createElement(`canvas`);
        }
        const ctx = this.pieChart.getContext('2d');
        const mincanvasWidth = Math.min(200, 0.3 * this.canvasWidth) / 200;
        this.pieChart.width = 200 * mincanvasWidth;
        this.pieChart.height = 240 * mincanvasWidth;
        ctx.scale(mincanvasWidth, mincanvasWidth);
        const colors = [`#333333`, '#FF3333', '#33FF33', `#3333FF`];
        for (let time = 0, length = 0; length < Connection.pieChart.length; length++) {
            const currentPie = time + Connection.pieChart[length] * this.pi2;
            ctx.fillStyle = colors[length + 1];
            ctx.beginPath();
            ctx.moveTo(100, 140);
            ctx.arc(100, 140, 80, time, currentPie, false);
            ctx.fill();
            time = currentPie;
        }
    },
    drawBattleArea(ctx) {
        if (!Connection.battleRoyale.state) {
            return;
        }
        this.drawDangerArea(ctx, Connection.battleRoyale.x, Connection.battleRoyale.y, Connection.battleRoyale.radius, Connection.mapMinX, Connection.mapMinY, Connection.mapMaxX - Connection.mapMinX, Connection.mapMaxY - Connection.mapMinY, gameSetupTheme.dangerAreaColor, 0.25);
        this.drawSafeArea(ctx, Connection.battleRoyale.targetX, Connection.battleRoyale.targetY, Connection.battleRoyale.targetRadius, 40, gameSetupTheme.safeAreaColor);
    },
    drawBattleAreaOnMinimap(ctx, width, heigth, newWidth, offsetX, offsetY) {
        if (!Connection.battleRoyale.state) {
            return;
        }
        if (!this.battleAreaMap) {
            this.battleAreaMap = document.createElement(`canvas`);
            this.battleAreaMapCtx = this.battleAreaMap.getContext('2d');
        }
        if (this.battleAreaMap.width != width) {
            this.battleAreaMap.width = width;
            this.battleAreaMap.height = heigth;
        } else {
            this.battleAreaMapCtx.clearRect(0, 0, width, heigth);
        }
        let newX = (Connection.battleRoyale.x + offsetX) * newWidth;
        let newY = (Connection.battleRoyale.y + offsetY) * newWidth;
        let newRadius = Connection.battleRoyale.radius * newWidth;
        this.drawDangerArea(this.battleAreaMapCtx, newX, newY, newRadius, 0, 0, width, heigth, gameSetupTheme.dangerAreaColor, 0.25);
        newX = ~~((Connection.battleRoyale.targetX + offsetX) * newWidth);
        newY = ~~((Connection.battleRoyale.targetY + offsetY) * newWidth);
        newRadius = ~~(Connection.battleRoyale.targetRadius * newWidth);
        this.drawSafeArea(this.battleAreaMapCtx, newX, newY, newRadius, 2, gameSetupTheme.safeAreaColor);
        ctx.drawImage(this.battleAreaMap, 0, 0);
    },
    drawDangerArea(ctx, x, y, radius, minX, minY, maxX, maxY, color, aplha) {
        if (Connection.battleRoyale.radius == Connection.battleRoyale.maxRadius || radius <= 0) {
            return;
        }
        ctx.save();
        ctx.globalAlpha = aplha;
        ctx.fillStyle = color;
        ctx.fillRect(minX, minY, maxX, maxY);
        ctx.globalCompositeOperation = 'destination-out';
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, this.pi2, false);
        ctx.fill();
        ctx.restore();
    },
    drawSafeArea(ctx, targetX, targetY, radius, width, color) {
        if (Connection.battleRoyale.state > 2 || radius <= 0) {
            return;
        }
        this.drawDashedCircle(ctx, targetX, targetY, radius, 60, width, color);
    },
    drawGhostCells() {
        if (!gameOptionSettings.showGhostCells) {
            return;
        }
        const ghostsCells = Connection.ghostCells;
        this.ctx.beginPath();
        for (let length = 0; length < ghostsCells.length; length++) {
            if (ghostsCells[length].inView) {
                continue;
            }
            const x = ghostsCells[length].x;
            const y = ghostsCells[length].y;
            this.ctx.moveTo(x, y);
            this.ctx.arc(x, y, ghostsCells[length].size, 0, this.pi2, false);
        }
        this.ctx.fillStyle = gameSetupTheme.ghostCellsColor;
        this.ctx.globalAlpha = gameSetupTheme.ghostCellsAlpha;
        this.ctx.shadowColor = gameSetupTheme.ghostCellsColor;
        this.ctx.shadowBlur = 40;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
        this.ctx.shadowBlur = 0;
    },
    preDrawIndicator() {
        this.indicator = null;
        let canvas = document.createElement('canvas');
        canvas.width = 90;
        canvas.height = 50;
        const ctx = canvas.getContext('2d');
        ctx.lineWidth = 2;
        ctx.fillStyle = gameSetupTheme.teammatesIndColor;
        ctx.strokeStyle = `#000000`;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(90, 0);
        ctx.lineTo(45, 50);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        this.indicator = new Image();
        this.indicator.src = canvas.toDataURL();
        canvas = null;
    },
    countFps() {
        if (!gameOptionSettings.showStatsFPS) {
            return;
        }
        const Time = Date.now();
        if (!this.fpsLastRequest) {
            this.fpsLastRequest = Time;
        }
        if (Time - this.fpsLastRequest >= 1000) {
            this.fps = this.renderedFrames;
            this.renderedFrames = 0;
            this.fpsLastRequest = Time;
        }
        this.renderedFrames++;
    },
    'sleep': function(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
    },
    render() {
        drawRender.countFps();
        drawRender.stats.begin();
        drawRender.renderFrame();
        drawRender.stats.end();
        drawRender.ppsPanel.update( Connection.pps, 50 );
        window.requestAnimationFrame(drawRender.render);
    },
    init() {
        this.setCanvas();
        this.resizeCanvas();
        this.preDrawIndicator();
        this.renderStart = Date.now()
        window.requestAnimationFrame(drawRender.render);
    }
};
const keyBlind = {};
var hotkeys = {};
const hotkeysCommand = {
    'hk-bots-split': {
        label: textLanguage[`hk-bots-split`],
        defaultKey: 'T',
        keyDown() {//Yahnych
            if(window.user.startedBots /*&& window.user.isAlive*/) window.connection.send(new Uint8Array([2]).buffer)
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-bots-feed': {
        label: textLanguage[`hk-bots-feed`],
        defaultKey: 'A',
        keyDown() {//Yahnych
            if(window.user.startedBots /*&& window.user.isAlive*/) window.connection.send(new Uint8Array([3]).buffer)
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-bots-ai': {
        label: textLanguage[`hk-bots-ai`],
        defaultKey: 'F',
        keyDown() {
            if(window.user.startedBots /*&& window.user.isAlive*/){
                if(!window.bots.ai){
                    document.getElementById('botsAI').style.color = '#00C02E'
                    document.getElementById('botsAI').innerText = 'Enabled'
                    window.bots.ai = true
                    window.connection.send(new Uint8Array([4, Number(window.bots.ai)]).buffer)
                }
                else {
                    document.getElementById('botsAI').style.color = '#DA0A00'
                    document.getElementById('botsAI').innerText = 'Disabled'
                    window.bots.ai = false
                    window.connection.send(new Uint8Array([4, Number(window.bots.ai)]).buffer)
                }
            }
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-feed': {
        label: textLanguage[`hk-feed`],
        defaultKey: 'W',
        keyDown() {
            application && application.feed();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-macroFeed': {
        label: textLanguage[`hk-macroFeed`],
        defaultKey: 'E',
        keyDown() {
            application && application.macroFeed(true);
        },
        keyUp() {
            application && application.macroFeed(false);
        },
        type: `normal`
    },
    'hk-split': {
        label: textLanguage[`hk-split`],
        defaultKey: 'SPACE',
        keyDown() {
            application && application.split();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-doubleSplit': {
        label: textLanguage[`hk-doubleSplit`],
        defaultKey: 'Q',
        keyDown() {
            application && application.doubleSplit();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-popSplit': {
        label: `Popsplit`,
        defaultKey: `ALT+Q`,
        keyDown() {
            application && application.popSplit();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-tripleSplit': {
        label: `Triplesplit`,
        defaultKey: ``,
        keyDown() {
            application && application.tripleSplit();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-split16': {
        label: textLanguage[`hk-split16`],
        defaultKey: 'SHIFT',
        keyDown() {
            application && application.split16();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-pause': {
        label: textLanguage['hk-pause'],
        defaultKey: 'R',
        keyDown() {
            application && application.setPause();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-sct': {
        label: textLanguage[`hk-skt`],
        defaultKey: '`',
        keyDown() {
            application && application.sct(true);
        },
        keyUp() {
            application && application.sct(false);
        },
        type: `normal`
    },
    'hk-dance': {
        label: textLanguage[`hk-dance`],
        defaultKey: ';',
        keyDown() {
            application && application.dance(true);
        },
        keyUp() {
            application && application.dance(false);
        },
        type: `normal`
    },
    'hk-afk': {
        label: textLanguage[`hk-afk`],
        defaultKey: 'ALT+A',
        keyDown() {
            application && application.afk(true);
        },
        keyUp() {
            application && application.afk(false);
        },
        type: `normal`
    },
    'hk-fixSpect': {
        label: textLanguage[`hk-fixSpect`],
        defaultKey: 'ALT+F',
        keyDown() {
            application && application.fixSpect();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-onoffSpect': {
        label: textLanguage[`hk-onoffSpect`],
        defaultKey: 'ALT+K',
        keyDown() {
            application && application.onoffSpect();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-showTop5': {
        label: textLanguage[`hk-showTop5`],
        defaultKey: 'V',
        keyDown() {
            application && application.setShowTop5();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-showTime': {
        label: textLanguage['hk-showTime'],
        defaultKey: 'ALT+T',
        keyDown() {
            application && application.setShowTime();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-showSplitRange': {
        label: textLanguage[`hk-showSplitRange`],
        defaultKey: 'U',
        keyDown() {
            application && application.setShowSplitRange();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-showSplitInd': {
        label: textLanguage[`hk-showSplitInd`],
        defaultKey: 'I',
        keyDown() {
            application && application.setShowSplitInd();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-showTeammatesInd': {
        label: textLanguage[`hk-showTeammatesInd`],
        defaultKey: `ALT+I`,
        keyDown() {
            application && application.setShowTeammatesInd();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-showOppColors': {
        label: textLanguage[`hk-showOppColors`],
        defaultKey: 'O',
        keyDown() {
            application && application.setShowOppColors();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-toggleSkins': {
        label: textLanguage['hk-toggleSkins'],
        defaultKey: 'K',
        keyDown() {
            application && application.toggleSkins();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-invis': {
        label: textLanguage['hk-invis'],
        defaultKey: `ALT+P`,
        keyDown() {
            application && application.switchInvis();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-saveReplay': {
        label: textLanguage['hk-saveReplay'],
        defaultKey: `ALT+R`,
        keyDown() {
            application && application.saveReplay();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-transparentSkins': {
        label: textLanguage[`hk-transparentSkins`],
        defaultKey: '',
        keyDown() {
            application && application.setTransparentSkins();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-showSkins': {
        label: textLanguage[`hk-showSkins`],
        defaultKey: 'S',
        keyDown() {
            application && application.setShowSkins();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-showStats': {
        label: textLanguage[`hk-showStats`],
        defaultKey: `ALT+S`,
        keyDown() {
            application && application.setShowStats();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-toggleCells': {
        label: textLanguage[`hk-toggleCells`],
        defaultKey: 'D',
        keyDown() {
            application && application.toggleCells();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-showFood': {
        label: textLanguage[`hk-showFood`],
        defaultKey: 'X',
        keyDown() {
            application && application.setShowFood();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-showGrid': {
        label: textLanguage[`hk-showGrid`],
        defaultKey: 'G',
        keyDown() {
            application && application.setShowGrid();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-showMiniMapGuides': {
        label: textLanguage[`hk-showMiniMapGuides`],
        defaultKey: `ALT+G`,
        keyDown() {
            application && application.setShowMiniMapGuides();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-hideChat': {
        label: textLanguage[`hk-hideChat`],
        defaultKey: 'H',
        keyDown() {
            application && application.hideChat();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-showHUD': {
        label: textLanguage['hk-showHUD'],
        defaultKey: 'ALT+H',
        keyDown() {
            application && application.setShowHUD();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-copyLb': {
        label: textLanguage[`hk-copyLb`],
        defaultKey: 'L',
        keyDown() {
            application && application.copyLb();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-showLb': {
        label: textLanguage[`hk-showLb`],
        defaultKey: `ALT+L`,
        keyDown() {
            application && application.setShowLb();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-toggleAutoZoom': {
        label: textLanguage[`hk-toggleAutoZoom`],
        defaultKey: '',
        keyDown() {
            application && application.toggleAutoZoom();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-resetZoom': {
        label: textLanguage[`hk-resetZoom`],
        defaultKey: 'ALT+Z',
        keyDown() {
            application && application.resetZoom(true);
        },
        keyUp() {
            application && application.resetZoom(false);
        },
        type: `normal`
    },
    'hk-toggleDeath': {
        label: textLanguage['hk-toggleDeath'],
        defaultKey: 'Z',
        keyDown() {
            application && application.toggleDeath();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-clearChat': {
        label: textLanguage[`hk-clearChat`],
        defaultKey: 'C',
        keyDown() {
            application && application.displayChatHistory(true);
        },
        keyUp() {
            application && application.displayChatHistory(false);
        },
        type: `normal`
    },
    'hk-showBgSectors': {
        label: textLanguage[`hk-showBgSectors`],
        defaultKey: 'B',
        keyDown() {
            application && application.setShowBgSectors();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-hideBots': {
        label: textLanguage[`hk-hideBots`],
        defaultKey: 'ALT+B',
        keyDown() {
            application && application.setHideSmallBots();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-showNames': {
        label: textLanguage['hk-showNames'],
        defaultKey: 'N',
        keyDown() {
            application && application.setShowNames();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-hideTeammatesNames': {
        label: textLanguage[`hk-hideTeammatesNames`],
        defaultKey: '',
        keyDown() {
            application && application.setHideTeammatesNames();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-showMass': {
        label: textLanguage[`hk-showMass`],
        defaultKey: 'M',
        keyDown() {
            application && application.setShowMass();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-showMiniMap': {
        label: textLanguage[`hk-showMiniMap`],
        defaultKey: `ALT+M`,
        keyDown() {
            application && application.setShowMiniMap();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-chatMessage': {
        label: textLanguage[`hk-chatMessage`],
        defaultKey: `ENTER`,
        keyDown() {
            application && application.enterChatMessage();
        },
        keyUp: null,
        type: `special`
    },
    'hk-quickResp': {
        label: textLanguage[`hk-quickResp`],
        defaultKey: '',
        keyDown() {
            application && application.quickResp();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-autoResp': {
        label: textLanguage[`hk-autoResp`],
        defaultKey: '',
        keyDown() {
            application && application.toggleAutoResp();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-ingameSpectatorMode': {
        label: textLanguage[`hk-ingameSpectatorMode`],
        defaultKey: `ALT+U`,
        keyDown() {
            application && application.changeSpectatorMode();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-zoom1': {
        label: `${textLanguage[`hk-zoomLevel`]} 1`,
        defaultKey: `ALT+1`,
        keyDown() {
            application && application.setZoom(0.5);
        },
        keyUp: null,
        type: `normal`
    },
    'hk-zoom2': {
        label: `${textLanguage[`hk-zoomLevel`]} 2`,
        defaultKey: `ALT+2`,
        keyDown() {
            application && application.setZoom(0.25);
        },
        keyUp: null,
        type: `normal`
    },
    'hk-zoom3': {
        label: `${textLanguage[`hk-zoomLevel`]} 3`,
        defaultKey: `ALT+3`,
        keyDown() {
            application && application.setZoom(0.125);
        },
        keyUp: null,
        type: `normal`
    },
    'hk-zoom4': {
        label: `${textLanguage[`hk-zoomLevel`]} 4`,
        defaultKey: `ALT+4`,
        keyDown() {
            application && application.setZoom(0.075);
        },
        keyUp: null,
        type: `normal`
    },
    'hk-zoom5': {
        label: `${textLanguage[`hk-zoomLevel`]} 5`,
        defaultKey: `ALT+5`,
        keyDown() {
            application && application.setZoom(0.05);
        },
        keyUp: null,
        type: `normal`
    },
    'hk-switchServerMode': {
        label: textLanguage[`hk-switchServerMode`],
        defaultKey: '=',
        keyDown() {
            application && application.switchServerMode();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-showTargeting': {
        label: textLanguage[`hk-showTargeting`],
        defaultKey: '',
        keyDown() {
            application && application.setShowTargeting();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-setTargeting': {
        label: textLanguage['hk-setTargeting'],
        defaultKey: '',
        keyDown() {
            application && application.setTargeting();
        },
        keyUp: null,
        type: 'normal'
    },
    'hk-cancelTargeting': {
        label: textLanguage['hk-cancelTargeting'],
        defaultKey: '',
        keyDown() {
            application && application.cancelTargeting();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-changeTarget': {
        label: textLanguage[`hk-changeTarget`],
        defaultKey: '',
        keyDown() {
            application && application.changeTarget();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-privateMiniMap': {
        label: textLanguage[`hk-privateMiniMap`],
        defaultKey: '',
        keyDown() {
            application && application.setPrivateMiniMap();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-showQuest': {
        label: textLanguage[`hk-showQuest`],
        defaultKey: '',
        keyDown() {
            application && application.setShowQuest();
        },
        keyUp: null,
        type: `normal`
    },
    'hk-comm1': {
        label: chatCommand.comm1,
        defaultKey: '1',
        keyDown() {
            application && application.sendCommand(1);
        },
        keyUp: null,
        type: `command`
    },
    'hk-comm2': {
        label: chatCommand.comm2,
        defaultKey: '2',
        keyDown() {
            application && application.sendCommand(2);
        },
        keyUp: null,
        type: `command`
    },
    'hk-comm3': {
        label: chatCommand.comm3,
        defaultKey: '3',
        keyDown() {
            application && application.sendCommand(3);
        },
        keyUp: null,
        type: `command`
    },
    'hk-comm4': {
        label: chatCommand.comm4,
        defaultKey: '4',
        keyDown() {
            application && application.sendCommand(4);
        },
        keyUp: null,
        type: `command`
    },
    'hk-comm5': {
        label: chatCommand.comm5,
        defaultKey: '5',
        keyDown() {
            application && application.sendCommand(5);
        },
        keyUp: null,
        type: `command`
    },
    'hk-comm6': {
        label: chatCommand.comm6,
        defaultKey: '6',
        keyDown() {
            application && application.sendCommand(6);
        },
        keyUp: null,
        type: `command`
    },
    'hk-comm7': {
        label: chatCommand.comm7,
        defaultKey: '7',
        keyDown() {
            application && application.sendCommand(7);
        },
        keyUp: null,
        type: `command`
    },
    'hk-comm8': {
        label: chatCommand.comm8,
        defaultKey: '8',
        keyDown() {
            application && application.sendCommand(8);
        },
        keyUp: null,
        type: 'command'
    },
    'hk-comm9': {
        label: chatCommand.comm9,
        defaultKey: '9',
        keyDown() {
            application && application.sendCommand(9);
        },
        keyUp: null,
        type: `command`
    },
    'hk-comm0': {
        label: chatCommand.comm0,
        defaultKey: '0',
        keyDown() {
            application && application.sendCommand(0);
        },
        keyUp: null,
        type: `command`
    },
    'hk-comm10': {
        label: chatCommand.comm10,
        defaultKey: `MOUSE WHEEL`,
        keyDown() {
            application && application.sendCommand(10);
        },
        keyUp: null,
        type: 'command'
    },
    'hk-comm11': {
        label: chatCommand.comm11,
        defaultKey: `LEFT`,
        keyDown() {
            application && application.sendCommand(11);
        },
        keyUp: null,
        type: 'command'
    },
    'hk-comm12': {
        label: chatCommand.comm12,
        defaultKey: 'UP',
        keyDown() {
            application && application.sendCommand(12);
        },
        keyUp: null,
        type: `command`
    },
    'hk-comm13': {
        label: chatCommand.comm13,
        defaultKey: 'RIGHT',
        keyDown() {
            application && application.sendCommand(13);
        },
        keyUp: null,
        type: `command`
    },
    'hk-comm14': {
        label: chatCommand.comm14,
        defaultKey: 'DOWN',
        keyDown() {
            application && application.sendCommand(14);
        },
        keyUp: null,
        type: `command`
    }
};
const hotkeysSetup = {
    lastPressedKey: '',
    lastKeyId: '',
    defaultMessageKey: `ENTER`,
    inputClassName: 'custom-key-in form-control input-sm',
    loadDefaultHotkeys() {
        hotkeys = {};
        for (const command in hotkeysCommand) {
            if (hotkeysCommand.hasOwnProperty(command)) {
                hotkeys[hotkeysCommand[command].defaultKey] = command;
            }
        }
        hotkeys[`spec-messageKey`] = this.defaultMessageKey;
    },
    loadHotkeys() {
        if (window.localStorage.getItem(`ogarioHotkeys`) !== null) {
            hotkeys = JSON.parse(window.localStorage.getItem('ogarioHotkeys'));
        } else {
            this.loadDefaultHotkeys();
        }
        if (window.localStorage.getItem(`ogarioCommands`) !== null) {
            chatCommand = JSON.parse(window.localStorage.getItem('ogarioCommands'));
        }
    },
    saveHotkeys() {
        window.localStorage.setItem('ogarioHotkeys', JSON.stringify(hotkeys));
        this.saveCommands();
    },
    saveCommands() {
        $('#hotkeys .command-in').each(function() {
            const element = $(this);
            const id = element.attr('id');
            if (chatCommand.hasOwnProperty(id)) {
                chatCommand[id] = element.val();
            }
        });
        window.localStorage.setItem(`ogarioCommands`, JSON.stringify(chatCommand));
    },
    resetHotkeys() {
        this.loadDefaultHotkeys();
        $('#hotkeys-cfg .custom-key-in').each(function() {
            const id = $(this).attr('id');
            if (hotkeysCommand[id]) {
                $(this).val(hotkeysCommand[id].defaultKey);
            }
        });
    },
    setHotkeysMenu() {
        const setup = this;
        $('body').append(`<div id="hotkeys"><div id="hotkeys-menu"><button id="reset-hotkeys" class="btn btn-primary">${textLanguage.restoreSettings}</button> <button id="save-hotkeys" class="btn btn-success">${textLanguage.saveSett}</button> <button id="close-hotkeys" class="btn btn-danger">${textLanguage.close}</button></div><div id="hotkeys-cfg"></div><div id="hotkeys-inst"><ul><li>${textLanguage['hk-inst-assign']}</li><li>${textLanguage[`hk-inst-delete`]}</li><li>${textLanguage[`hk-inst-keys`]}</li></ul></div></div>`);
        for (const command in hotkeysCommand) {
            if (hotkeysCommand.hasOwnProperty(command)) {
                const currentCommand = hotkeysCommand[command];
                let text = '';
                for (const key in hotkeys) {
                    if (hotkeys.hasOwnProperty(key) && hotkeys[key] === command) {
                        text = key;
                        break;
                    }
                }
                if (command === `hk-switchServerMode` && application && !application.privateIP) {
                    continue;
                }
                if (currentCommand.type === `command`) {
                    const replaceHk = command.replace(`hk-`, '');
                    $(`#hotkeys-cfg`).append(`${`<div class="row"><div class="key-label"><input id="` + replaceHk + `" class="command-in form-control input-sm" value="` + chatCommand[replaceHk] + `" maxlength="80" /></div><div class="default-key">` + currentCommand.defaultKey + `</div><div class="custom-key"><input id="` + command + `" class="custom-key-in form-control input-sm" value="` + text}" /></div></div>`);
                } else {
                    $('#hotkeys-cfg').append(`<div class="row"><div class="key-label">${currentCommand.label}</div><div class="default-key">${currentCommand.defaultKey}</div><div class="custom-key"><input id="${command}" class="custom-key-in form-control input-sm" value="${text}" /></div></div>`);
                }
            }
        }
        $(document).on('click', `#reset-hotkeys`, event => {
            event.preventDefault();
            setup.resetHotkeys();
        });
        $(document).on(`click`, `#save-hotkeys`, event => {
            event.preventDefault();
            setup.saveHotkeys();
            $('#hotkeys').fadeOut(500);
        });
        $(document).on(`click`, `#close-hotkeys`, event => {
            event.preventDefault();
            $('#hotkeys').fadeOut(500);
        });
        $(document).on(`click`, `.hotkeys-link`, event => {
            $(`#hotkeys`).fadeIn(500);
            $(`#hotkeys-cfg`).perfectScrollbar(`update`);
            resetonkeydown();
        });
        $(`#hotkeys-cfg`).perfectScrollbar();
        OgarioSettings && OgarioSettings.setMenuBg();
    },
    getPressedKey(key) {
        let specialKey = '';
        let normalKey = '';
        if (key.ctrlKey || key.keyCode == 17) {
            specialKey = 'CTRL';
        } else if (key.altKey || key.keyCode == 18) {
            specialKey = `ALT`;
        }
        switch (key.keyCode) {
            case 9:
                normalKey = `TAB`;
                break;
            case 13:
                normalKey = `ENTER`;
                break;
            case 16:
                normalKey = 'SHIFT';
                break;
            case 17:
                break;
            case 18:
                break;
            case 27:
                normalKey = `ESC`;
                break;
            case 32:
                normalKey = 'SPACE';
                break;
            case 37:
                normalKey = `LEFT`;
                break;
            case 38:
                normalKey = 'UP';
                break;
            case 39:
                normalKey = `RIGHT`;
                break;
            case 40:
                normalKey = `DOWN`;
                break;
            case 46:
                normalKey = `DEL`;
                break;
            case 61:
                normalKey = '=';
                break;
            case 187:
                normalKey = '=';
                break;
            case 192:
                normalKey = `TILDE`;
                break;
            default:
                normalKey = String.fromCharCode(key.keyCode);
                break;
        }
        if (specialKey !== '') {
            if (normalKey !== '') {
                return `${specialKey}+${normalKey}`;
            }
            return specialKey;
        }
        return normalKey;
    },
    deleteHotkey(name, id) {
        delete hotkeys[name];
        $(`#${id}`).val('');
    },
    setDefaultHotkey(id) {
        let key = false;
        if (hotkeysCommand[id] && !hotkeys.hasOwnProperty(hotkeysCommand[id].defaultKey)) {
            key = hotkeysCommand[id].defaultKey;
            hotkeys[key] = id;
            return key;
        }
        return key;
    },
    setHotkey(key, id) {
        if (!id || this.lastPressedKey === key && this.lastKeyId === id) {
            return;
        }
        const value = $(`#${id}`).val();
        this.deleteHotkey(value, id);
        if (key === 'DEL') {
            return;
        }
        if (hotkeys[key] && hotkeys[key] !== id) {
            const hotkey = hotkeys[key];
            const defaultKey = this.setDefaultHotkey(hotkey);
            if (defaultKey) {
                hotkeys[defaultKey] = hotkey;
                $(`#${hotkey}`).val(defaultKey);
            } else {
                this.deleteHotkey(key, hotkey);
            }
        }
        hotkeys[key] = id;
        $(`#${id}`).val(key);
        if (id === 'hk-chatMessage') {
            hotkeys[`spec-messageKey`] = key;
        }
        this.lastPressedKey = key;
        this.lastKeyId = id;
    },
    init() {
        this.loadHotkeys();
        this.setHotkeysMenu();
    }
};
document.onkeydown = event => {
    const pressKey = hotkeysSetup.getPressedKey(event);
    if (event.target.tagName === `INPUT` && event.target.className !== hotkeysSetup.inputClassName && pressKey !== hotkeys['spec-messageKey']) {
        return;
    }
    if (pressKey !== '' && !keyBlind[pressKey]) {
        keyBlind[pressKey] = true;
        if (pressKey === `ESC`) {
            event.preventDefault();
            //application && application.showMenu();
            $('#overlays').toggle()
            return;
        }
        if (event.target.className === hotkeysSetup.inputClassName) {
            event.preventDefault();
            hotkeysSetup.setHotkey(pressKey, event.target.id);
            return;
        }
        if (hotkeys[pressKey]) {
            event.preventDefault();
            const key = hotkeys[pressKey];
            if (key !== '' && hotkeysCommand[key]) {
                if (hotkeysCommand[key].keyDown) {
                    hotkeysCommand[key].keyDown();
                }
            }
        }
    }
};
document.onkeyup = event => {
    const pressedKey = hotkeysSetup.getPressedKey(event);
    if (pressedKey !== '') {
        if (hotkeys[pressedKey]) {
            const key = hotkeys[pressedKey];
            if (key !== '' && hotkeysCommand[key]) {
                if (hotkeysCommand[key].keyUp) {
                    hotkeysCommand[key].keyUp();
                }
            }
        }
        keyBlind[pressedKey] = false;
    }
};
window.onmousedown = event => {
    if (!$(`#overlays`).is(`:visible`)) {
        if (event.which == 2) {
          if(!gameOptionSettings.waves) {
            event.preventDefault();
            application && application.sendCommand(10);
          } else {
            application && application.sendWave();
          }
        } else {
            if (gameOptionSettings.mouseSplit) {
                if (event.which == 1 && !gameOptionSettings.mouseInvert || event.which == 3 && gameOptionSettings.mouseInvert) {
                    event.preventDefault();
                    application && application.split();
                }
            }
            if (gameOptionSettings.mouseFeed) {
                if (event.which == 3 && !gameOptionSettings.mouseInvert || event.which == 1 && gameOptionSettings.mouseInvert) {
                    event.preventDefault();
                    application && application.macroFeed(true);
                }
            }
        }
    }
};
window.onmouseup = event => {
    if (gameOptionSettings.mouseFeed) {
        if (event.which == 3 && !gameOptionSettings.mouseInvert || event.which == 1 && gameOptionSettings.mouseInvert) {
            application && application.macroFeed(false);
        }
    }
};
window.onbeforeunload = event => {
    if (ogario.play) {
        return textLanguage.exit;
    } else {
        return;
    }
};

function changeHistory(value) {
    if (window.history && window.history.replaceState) {
        window.history.replaceState({}, window.document.title, value);
    }
}

function changeUrl() {
    if (window.location.pathname === `/ogario`) {
        changeHistory(`/${window.location.hash}`);
    }
}

function spectateBlind() {
    window.onkeydown = event => {
        81 == event.keyCode && window.core.specialOn && window.core.specialOn();
    };
    window.onkeyup = event => {};
}

function menuScale() {
    const innerWidth = window.innerWidth;
    const innerHeigth = window.innerHeight;
    const helloContainer = $('#helloContainer');
    let helloContainerWidth = helloContainer.innerHeight();
    if (helloContainerWidth > 0) {
        ogario.menuHeight = helloContainerWidth;
    } else {
        helloContainerWidth = ogario.menuHeight || 618;
    }
    const scale = Math.min(1, innerHeigth / helloContainerWidth);
    const top = helloContainerWidth * scale;
    const resizeTop = Math.round(innerHeigth / 2 - 0.5 * top);
    const transform = `${`translate(-50%, 0%) scale(` + scale})`;
    helloContainer.css('transform', transform);
    helloContainer.css('-ms-transform', transform);
    helloContainer.css('-webkit-transform', transform);
    helloContainer.css('top', `${resizeTop}px`);
    ogario.innerW = innerWidth;
    ogario.innerH = innerHeigth;
}

function resetonkeydown() {
    if (application.protocolMode) {
        return;
    }
    window.onkeydown = event => {};
}

function start() {
    window.core = {
        connect(url) {
            Connection.connect(url);
        },
        disconnect() {},
        sendNick(nick) {
            Connection.sendNick(nick);
        },
        sendSpectate() {
            Connection.sendSpectate();
        },
        eject() {
            Connection.sendEject();
        },
        split() {
            Connection.sendSplit();
        },
        specialOn() {
            Connection.sendFreeSpectate();
        },
        specialOff() {
            Connection.sendFreeSpectate();
        },
        sendFbToken(token) {
            Connection.sendFbToken(token);
        },
        sendGplusToken(token) {
            Connection.sendGplusToken(token);
        },
        recaptchaResponse(token) {
            Connection.sendRecaptcha(token);
        },
        setClientVersion(version, strVersion) {
            Connection.setClientVersion(version, strVersion);
        },
        playerHasCells(){
            return Connection.playerCells.length>0
        },
        proxy(data){
            if (!Array.isArray(data)) {
                console.log('Proxy ERROR: Array data required.');
                return;
            }
            if (data[0] == 8) {
                data.unshift(102);
            }
            data = new Uint8Array(data);
            Connection.sendBuffer(new DataView(data.buffer));
        },
        proxyMobileData(data = []) {
            if (!Array.isArray(data)) {
                console.log('ProxyMobileData ERROR: Array data required.');
                return;
            }
            if (data[0] == 8) {
                data.unshift(102);
            }
            data = new Uint8Array(data);
            Connection.sendMessage(new DataView(data.buffer));
        }
    };
}

function setGUI(){
document.getElementById('skins-panel').innerHTML = `
    <div style="text-align:center">
    <span id="statusText">Status: <b id="userStatus">Disconnected</b></span>
    <br>
    <br>
    <span id="aiText">Bots AI: <b id="botsAI">Disabled</b></span>
    <br>
    <input type="text" id="botsName" placeholder="Bots Name" maxlength="100000000" spellcheck="false">
    <input type="text" id="targetSkin" placeholder="Target skin" maxlength="100000000" spellcheck="false">
    <input type="text" id="targetNick" placeholder="Target nick" maxlength="100000000" spellcheck="false">

    <input type="number" id="botsAmount" placeholder="Bots Amount" min="1" max="500" spellcheck="false">
    <button id="connect" class="btn-primary">Connect</button>
    <br>
    <button id="openWorker" class="btn-warning">Open worker</button>
    <br>
    <button id="openRemote" class="btn-warning">Remote worker</button>
    <br>
    <button id="startBots" class="btn-warning" disabled>Start Bots</button>
    <button id="stopBots" class="btn-warning">Stop Bots</button>

    <br>
    <br>
    <input type="text" id="serverHost" placeholder="ws://localhost:8083" value="ws://localhost:8083" spellcheck="false">
    <br><br>
    </div>

`
if(localStorage.getItem('localStoredBotsName') !== null){
    window.bots.name = localStorage.getItem('localStoredBotsName')
    document.getElementById('botsName').value = window.bots.name
}
if(localStorage.getItem('localStoredTargetNick') !== null){
    window.bots.targetNick = localStorage.getItem('localStoredTargetNick')
    document.getElementById('targetNick').value = window.bots.targetNick
}
if(localStorage.getItem('localStoredTargetSkin') !== null){
    window.bots.targetSkin = localStorage.getItem('localStoredTargetSkin')
    document.getElementById('targetSkin').value = window.bots.targetSkin
}
if(localStorage.getItem('localStoredBotsAmount') !== null){
    window.bots.amount = JSON.parse(localStorage.getItem('localStoredBotsAmount'))
    document.getElementById('botsAmount').value = String(window.bots.amount)
}
if(localStorage.getItem('localStoredServerHost') !== null){
    
    if (window.server.host !=null && window.server.host != ""){
        window.server.host = localStorage.getItem('localStoredServerHost') 
    }
    document.getElementById('serverHost').value = window.server.host
}
}

function setGUIStyle(){
document.head.appendChild(document.createElement('style')).innerHTML=`
        #skins-panel {
            width: 200px !important;
            -height: 363px !important;
        }
        #botsInfo > a, #botsAuthor > a {
            color: #fff;
            text-decoration: none;
        }
        #botsAuthor {
            margin-top: -15px;
            letter-spacing: 1px;
        }
        #statusText, #aiText {
            font-weight: bold;
            -position: absolute;
            -left: -5px;
        }
        #userStatus, #botsAI {
            color: #DA0A00;
        }
        #botsName, #targetNick, #targetSkin, #botsAmount, #serverHost, #serverPort {
            margin-top: 15px;
            width: 190px;
            padding: 8px;
            font-size: 14.5px;
            outline: none;
            -margin-left: 60px;
        }
        #connect, #startBots, #stopBots, #openWorker,#openRemote {
            color: white;
            border: none;
            padding: 7px;
            width: 160px;
            font-size: 18px;
            outline: none;
            margin-top: 15px;
            letter-spacing: 1px;
            -margin-left: 50px;
        }
        #connect {
            display: inline;
            background-color: #0074C0;
        }
        #openWorker,#openRemote {
            display: inline;
            background-color: #296e52 !important;
        }
        #startBots {
            display: inline;
            background-color: #00C02E;
        }
        #stopBots {
            display: none;
            background-color: #DA0A00;
        }
        #connect:active {
            background-color: #004E82;
        }
        #startBots:active {
            background-color: #009A25;
        }
        #stopBots:active {
            background-color: #9A1B00;
        }
    
`
}

function loadUI(){
$('#overlays-hud').append(`
<div id="botClient" class="hud-text-center" style="/* text-align: center; *//* color: #fff; */ position: fixed; /* pointer-events: none; */font-size: 75%;/* white-space: nowrap; */padding: 0;top: 42%;display: block;/* width: 200px; */right: 10px;">
<div style="margin: 6px;"> <span id="botCount" class="label hud-main-color pull-right" style="margin: 0.55em 0 0 0; padding: 0 0.55em 0 0;">Waiting</span></div>
<b><!---div style="padding: 0 10px 6px;"> <span id="slots" class="label hud-main-color pull-right" style="margin: 0.55em 0 0 0;">Waiting</span></div--->
</b></div>`);

}

function setGUIEvents(){
document.getElementById('botsAmount').addEventListener('keypress', e => {
    e.preventDefault()
})


document.getElementById('botsName').addEventListener('focusout', function(){
    window.bots.name = this.value
    localStorage.setItem('localStoredBotsName', window.bots.name)
    window.connection.sendNick(window.bots.name);
    console.log(window.bots.name)

})
document.getElementById('targetNick').addEventListener('focusout', function(){
    window.bots.targetNick = this.value
    localStorage.setItem('localStoredTargetNick', window.bots.targetNick)
    window.connection.sendTargetNick(window.bots.targetNick);
    console.log(window.bots.targetNick)

})
document.getElementById('targetSkin').addEventListener('focusout', function(){
    window.bots.targetSkin = this.value
    localStorage.setItem('localStoredTargetSkin', window.bots.targetSkin)
    window.connection.sendTargetSkin(window.bots.targetSkin);
    console.log(window.bots.targetSkin)

})
document.getElementById('botsAmount').addEventListener('focusout', function(){
    window.bots.amount = Number(this.value)
    localStorage.setItem('localStoredBotsAmount', window.bots.amount)
    window.connection.sendAmount(window.bots.amount);
    console.log(window.bots.amount)
})
document.getElementById('connect').addEventListener('click', () => {
    if (application.gameMode/*==":party"*/){
        if(!window.connection.ws || window.connection.ws.readyState !== WebSocket.OPEN) window.connection.connect()
    }
    else{
        toastr["info"]('Party bots only available for Party mode')
    }				
})
document.getElementById('startBots').addEventListener('click', () => {
    if(window.game.url && window.game.protocolVersion && window.game.clientVersion && !window.user.startedBots){
        if( window.bots.amount ) window.connection.send(window.buffers.startBots(window.game.url, window.game.protocolVersion, window.game.clientVersion, window.user.isAlive, window.unescape(window.encodeURIComponent(window.bots.name)), window.bots.targetSkin, window.unescape(window.encodeURIComponent(window.bots.targetNick)), window.bots.amount))
        else toastr.info('Bots name, amount and user login are required before starting the bots')
    }
})
document.getElementById('stopBots').addEventListener('click', () => {
    if(window.user.startedBots) window.connection.send(new Uint8Array([1]).buffer)
})
document.getElementById('openWorker').addEventListener('click', () => {
    addWindow()
})
document.getElementById('openRemote').addEventListener('click', () => {
    window.open('https://agar.io/remote?'+window.server.host, "", "toolbar,scrollbars,resizable,top=500,left=500,width=500,height=200")
})
document.getElementById('serverHost').addEventListener('change', function(){
    window.server.host = this.value
    localStorage.setItem('localStoredServerHost', window.server.host)
})
}

function resize() {
    window.onresize = () => {
        drawRender.resizeCanvas();
        menuScale();
    };
}

//((() => {
var ogario = Connection;
changeUrl();
resize();
spectateBlind();
start();
window.master.getClientVersion();
OgarioSettings.init();
application.init();
application.getDefaultSettings();
application.connect();
hotkeysSetup.init();
Connection.init();
drawRender.init();
window.master.init();
menuScale();
/*location.search.indexOf('bot')>-1&&*/setTimeout(() => {
    setGUI()
    setGUIStyle()
    setGUIEvents()
    loadUI()
}, 3500)
//})());
//}

//init(window, window.ogario, window.jQuery);
