window.LMBotsEnabled=true;
const UserBots = {
    isConnected: false,
    startedBots: false,
    //                protocolVersion: 0,
    //                clientVersion: 0,
    enabledBotsAI: false,
    macroFeedInterval: null,
    stopMovement: false,
    isAlive: false,
    serverURL: '',
    serverKeyBytes: [],
    mouseX: 0,
    mouseY: 0,
    mapOffsetX: 0,
    mapOffsetY: 0,
    startBotsKey: 'x',
    stopBotsKey: 'y',
    splitBotsKey: 't',
    ejectBotsKey: 'a',
    aiBotsKey: 'f',
    macroFeedKey: 'e',
    doubleSplitKey: 'q',
    sixteenSplitKey: 'r',
    stopMovementKey: 's',
    extendedScale: false,
    mouseWheelSpeed: 0.9,
    hideMapGrid: false,
    //                showAllPlayersMass: false,
    server: legendmod.ws,
    isAlive: legendmod.play,
    connection: {
        botsName: '#Jimboy3100Bots',
        botsAmount: 50,
        useRemote: false,
        serverHost: 'localhost',
        serverPort: 1337,
        ws: null,
        messages: {
            handshake(protocolVersion, clientVersion) {

                const writer = new Writer(9)
                writer.writeUint8(0)
                writer.writeUint32(protocolVersion)
                writer.writeUint32(clientVersion)
                return writer.message
            },
            //                        startBots(botsName, botsAmount, isAlive, serverURL, serverKeyBytes){
            //                            const writer = new Writer(9 + serverURL.length + botsName.length)
            startBots(botsName, botsAmount, isAlive, server, serverKeyBytes) {
                const writer = new Writer(9 + server.length + botsName.length)
                writer.writeUint8(1)
                writer.writeString(botsName)
                writer.writeUint8(Number(botsAmount))
                writer.writeUint8(Number(isAlive))
                writer.writeString(server)
                //writer.writeString(serverURL)
                writer.writeInt32(window.generatedClientKey)
                //writer.writeInt32(new Int32Array(new Int8Array(serverKeyBytes).buffer)[0])
                return writer.message
            },
            mousePosition(mouseX, mouseY) {
                const writer = new Writer(9)
                writer.writeUint8(7)
                writer.writeInt32(mouseX)
                writer.writeInt32(mouseY)
                return writer.message
            }
        },
        getURL() {
            return 'ws://localhost:1337'
            /* return \`\${this.useRemote ? 'wss://' : 'ws://'}\${this.serverHost}:\${this.serverPort}\` */
        },
        connect() {
            this.ws = new WebSocket(this.getURL())
            this.ws.binaryType = 'arraybuffer'
            this.ws.onopen = this.onopen.bind(this)
            this.ws.onerror = this.onerror.bind(this)
            this.ws.onclose = this.onclose.bind(this)
        },
        sendMessage(message) {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) this.ws.send(message.buffer)
        },
        onopen() {
            //if(UserBots.protocolVersion && UserBots.clientVersion){
            if (window.generatedClientKey && window.master.clientVersion) {
                //this.sendMessage(this.messages.handshake(UserBots.protocolVersion, UserBots.clientVersion))
                this.sendMessage(this.messages.handshake("21", window.master.clientVersion))
                //document.getElementById('userStatusBots').style.color = 'green'							
                //document.getElementById('userStatusBots').innerText = 'Connected'
                $('span#userStatusBots').css('color', 'green')
                $('span#userStatusBots').text("Connected")
                UserBots.isConnected = true
            } else {
                toastr.warning("<b>[SERVER]:</b> " + "Find a new party to complete the handshake");
                this.ws.close()
            }
        },
        onerror() {
            if (this.ws.readyState === WebSocket.CONNECTING || this.ws.readyState === WebSocket.OPEN) this.ws.close()
        },
        onclose() {
            //document.getElementById('userStatusBots').style.color = 'red'
            //document.getElementById('userStatusBots').innerText = 'Disconnected'
            $('span#userStatusBots').css('color', 'red');
            $('span#userStatusBots').text("Disconnected")
            setTimeout(this.connect.bind(this), 1000)
            UserBots.isConnected = false
        }
    }
}

class Writer {
    constructor(size) {
        this.message = new DataView(new ArrayBuffer(size))
        this.byteOffset = 0
    }
    writeUint8(value) {
        this.message.setUint8(this.byteOffset++, value)
    }
    writeInt32(value) {
        this.message.setInt32(this.byteOffset, value, true)
        this.byteOffset += 4
    }
    writeUint32(value) {
        this.message.setUint32(this.byteOffset, value, true)
        this.byteOffset += 4
    }
    writeString(string) {
        for (let i = 0; i < string.length; i++) this.writeUint8(string.charCodeAt(i))
        this.writeUint8(0)
    }
}
$(".agario-panel.ogario-yt-panel").after('<div id="userPanel">' +
    '<h5 class="main-color">BOTS</h5>' +
    '<div id="tabBots" class="title" style="text-align: center;">' +
    '<span id="tabInfo" style="font-weight: bold; cursor: pointer;">INFO</span>' +
    '<span> | </span>' +
    '<span id="tabKeys" style="font-weight: bold; cursor: pointer;">KEYS</span>' +
    '</div>' +
    '<br>' +
    '<section id="tabInfoPanel" style="display: block; margin-left: 15px; margin-right: 15px;">' +
    '<span style="float: left;">User Server Status: <span id="userStatusBots" style="font-weight: bold; color: red;">Disconnected</span></span>' +
    '<br>' +
    '<br>' +
    '<span style="float: left;">Bots Status: <span id="botsStatus" style="font-weight: bold; color: red;">Stopped</span></span>' +
    '<br>' +
    '<br>' +
    '<span style="float: left;">Use Remote Server: <input type="checkbox" id="useRemote"></span>' +
    '<br>' +
    '<br>' +
    '<span style="float: left;">Bots Name: <input type="text" id="botsName" style="color: #31BAFF; border: none; outline: none;" placeholder="Bots Name" value="#Jimboy3100" maxlength="15" spellcheck="false"></span>' +
    '<br>' +
    '<br>' +
    '<span style="float: left;">Bots Amount: <input type="text" id="botsAmount" style="color: #F82626; border: none; outline: none;" placeholder="Min=50/Max=150" value="50" maxlength="3" spellcheck="false"></span>' +
    '<br>' +
    '<br>' +
    '<span style="float: left;">Server Host: <input type="text" id="serverHost" style="color: #31BAFF; border: none; outline: none;" placeholder="Hostname/IP" value="localhost" maxlength="50" spellcheck="false"></span>' +
    '<br>' +
    '<br>' +
    '<span style="float: left;">Server Port: <input type="text" id="serverPort" style="color: #FFAD31; border: none; outline: none;" placeholder="0-65535" value="1337" maxlength="5" spellcheck="false"></span>' +
    '<br>' +
    '<br>' +
    '<span><i>Developed by <a style="text-decoration: none;" target="_blank" href="https://github.com/nelthedev">Nel#0001</a></i></span>' +
    '</section>' +
    '<section id="tabKeysPanel" style="display: none; margin-left: 15px; margin-right: 15px;">' +
    '<span style="float: left;">Start Bots: <input type="text" id="startBotsKey" style="color: #3FAAEF; border: none; outline: none;" placeholder="a-z0-9 (lowercase)" value="x" maxlength="1" spellcheck="false"></span>' +
    '<br>' +
    '<span style="float: left;">Stop Bots: <input type="text" id="stopBotsKey" style="color: #3FAAEF; border: none; outline: none;" placeholder="a-z0-9 (lowercase)" value="y" maxlength="1" spellcheck="false"></span>' +
    '<br>' +
    '<span style="float: left;">Split Bots: <input type="text" id="splitBotsKey" style="color: #3FAAEF; border: none; outline: none;" placeholder="a-z0-9 (lowercase)" value="t" maxlength="1" spellcheck="false"></span>' +
    '<br>' +
    '<span style="float: left;">Eject Bots: <input type="text" id="ejectBotsKey" style="color: #3FAAEF; border: none; outline: none;" placeholder="a-z0-9 (lowercase)" value="a" maxlength="1" spellcheck="false"></span>' +
    '<br>' +
    '<span style="float: left;">AI Bots: <input type="text" id="aiBotsKey" style="color: #3FAAEF; border: none; outline: none;" placeholder="a-z0-9 (lowercase)" value="f" maxlength="1" spellcheck="false"></span>' +
    '</section>' +
    '</div>');
$('span#tabInfo').click(function() {
    $('section#tabInfoPanel').show();
    $('section#tabKeysPanel').hide();
});
$('span#tabKeys').click(function() {
    $('section#tabInfoPanel').hide();
    $('section#tabKeysPanel').show();
});
//const tabs = ['tabInfo', 'tabSettings', 'tabKeys']
//for(const tab of tabs){
//document.getElementById(tab).addEventListener('click', function(){

//for(const t of tabs){
//if(this !== document.getElementById(t)) document.getElementById('\${t}Panel').style.display = 'none'
//else document.getElementById('\${t}Panel').style.display = 'block'
// }
//})
//}
//const checkboxBots = ['useRemote', 'extendedScale', 'hideMapGrid', 'showAllPlayersMass']
const checkboxBots = ['useRemote']
for (const checkbox of checkboxBots) {
    if (localStorage.getItem(checkbox) != null) {
        switch (checkbox) {
            case 'useRemote':
                UserBots.connection.useRemote = JSON.parse(localStorage.getItem(checkbox))
                $('input#' + checkbox).checked = UserBots.connection.useRemote
                break
            default:
                UserBots[checkbox] = JSON.parse(localStorage.getItem(checkboxBots))
                $('input#' + checkbox).checked = UserBots[checkbox]
        }
    }
	$('input#' + checkbox).on('click', function() {
        switch (checkbox) {
            case 'useRemote':
                UserBots.connection.useRemote = this.checked
                localStorage.setItem(checkbox, UserBots.connection.useRemote)
                break
            default:
                UserBots[checkbox] = this.checked
                localStorage.setItem(checkboxBots, UserBots[checkbox])
        }
    })
}
//const inputBots = ['botsName', 'botsAmount', 'serverHost', 'serverPort', 'mouseWheelSpeed', 'startBotsKey', 'stopBotsKey', 'splitBotsKey', 'ejectBotsKey', 'aiBotsKey', 'macroFeedKey', 'doubleSplitKey', 'sixteenSplitKey', 'stopMovementKey']
const inputBots = ['botsName', 'botsAmount', 'serverHost', 'serverPort', 'startBotsKey', 'stopBotsKey', 'splitBotsKey', 'ejectBotsKey', 'aiBotsKey']
for (const input of inputBots) {
    if (localStorage.getItem(input) != null) {
        switch (input) {
            case 'botsName':
                UserBots.connection.botsName = localStorage.getItem(input);
                $('input#' + input).val(UserBots.connection.botsName);
                break
            case 'botsAmount':
                UserBots.connection.botsAmount = JSON.parse(localStorage.getItem(input));
                $('input#' + input).val(UserBots.connection.botsAmount);
                break
            case 'serverHost':
                UserBots.connection.serverHost = localStorage.getItem(input);
                $('input#' + input).val(UserBots.connection.serverHost);
                break
            case 'serverPort':
                UserBots.connection.serverPort = JSON.parse(localStorage.getItem(input));
                $('input#' + input).val(UserBots.connection.serverPort);
                break
            default:
                UserBots[input] = localStorage.getItem(input)
                $('input#' + input).val(UserBots[input]);
        }
    }
        $('input#' + input).on('change', function() {			
		switch (input) {	
            case 'botsName':
                UserBots.connection.botsName = this.value
                localStorage.setItem(input, UserBots.connection.botsName)
                break
            case 'botsAmount':
                UserBots.connection.botsAmount = Number(this.value)
                localStorage.setItem(input, UserBots.connection.botsAmount)
                break
            case 'serverHost':
                UserBots.connection.serverHost = this.value
                localStorage.setItem(input, UserBots.connection.serverHost)
                break
            case 'serverPort':
                UserBots.connection.serverPort = Number(this.value)
                localStorage.setItem(input, UserBots.connection.serverPort)
                break
            default:
                UserBots[input] = this.value
                localStorage.setItem(input, UserBots[input])
        }
    })
}


UserBots.connection.connect();


document.addEventListener('keydown', e => {
    //    if (!document.getElementById('overlays')) {
    switch (e.key) {
        case UserBots.startBotsKey:
            //if(!UserBots.startedBots && UserBots.serverURL.includes('?party_id=')){
            if (!UserBots.startedBots && window.legendmod.ws) {
                //UserBots.connection.sendMessage(UserBots.connection.messages.startBots(UserBots.connection.botsName, UserBots.connection.botsAmount, UserBots.isAlive, UserBots.serverURL, UserBots.serverKeyBytes))
                UserBots.connection.sendMessage(UserBots.connection.messages.startBots(UserBots.connection.botsName, UserBots.connection.botsAmount, legendmod.play, window.legendmod.ws, window.generatedClientKey))
                $('span#botsStatus').css('color', 'green')
                $('span#botsStatus').text("Started")
                //document.getElementById('botsStatus').style.color = 'green'
                //document.getElementById('botsStatus').innerText = 'Started'
                UserBots.startedBots = true
            } else {
                toastr.warning("<b>[SERVER]:</b> " + "You must be in party mode and have bots stopped in order to start them");
            }
            break
        case UserBots.stopBotsKey:
            if (UserBots.startedBots) {
                UserBots.connection.sendMessage(new Uint8Array([2]))
                $('span#botsStatus').css('color', 'red')
                $('span#botsStatus').text("Stopped")
                //document.getElementById('botsStatus').style.color = 'red'
                //document.getElementById('botsStatus').innerText = 'Stopped'
                UserBots.startedBots = false
            } else {
                toastr.warning("<b>[SERVER]:</b> " + "You must have bots started in order to stop them");
            }
            break
        case UserBots.splitBotsKey:
            UserBots.connection.sendMessage(new Uint8Array([3]))
            break
        case UserBots.ejectBotsKey:
            UserBots.connection.sendMessage(new Uint8Array([4]))
            break
        case UserBots.aiBotsKey:
            UserBots.enabledBotsAI = !UserBots.enabledBotsAI
            UserBots.connection.sendMessage(new Uint8Array([5, Number(UserBots.enabledBotsAI)]))
            break
    }
    //    }
})

//$("#server-ws").show();
//$("#server-connect").show();

var sendPosBots;

function LegendModSpawn() { //i have handlers for this...
    sendPosBots = setInterval(sendPosBots, 1000);
    UserBots.connection.sendMessage(new Uint8Array([6, Number(true)]))
    return sendPosBots;
};

function LegendModDeath() { //i have handlers for this...
    //UserBots.connection.sendMessage(new Uint8Array([6, Number(UserBots.isAlive)]))
    clearInterval(sendPosBots);
    UserBots.connection.sendMessage(new Uint8Array([6, Number(false)]))

};

function sendPosBots() {
    //	console.log("ding");
    UserBots.connection.sendMessage(UserBots.connection.messages.mousePosition(legendmod.playerX, legendmod.playerY))
}
function LegendModServerConnect(){
	UserBots.connection.onerror();
}
