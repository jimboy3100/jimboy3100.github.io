// ==UserScript==
// @name         agario-bots
// @version      1.0.0
// @description  Free open source agar.io bots
// @author       Nel#Jimboy3100
// @run-at       document-start
// @match        *://agar.io/*
// ==/UserScript==

function modifyAgarioHTML(agarioHTML, modifiedCoreJS){
    return agarioHTML
        .replace(/<script>\n+const\s+EnvConfig[\s\S]+?<\/script>/, '') // Fix constant reassign error
        .replace(/<script\s+src="agario\.core\.js\?v=\w+"><\/script>/, `<script>${modifiedCoreJS}</script>`)
}

function modifyCoreJS(coreJS){
    return coreJS
        .replace(/\(function\(\w+\){/, `
            $&
            class Writer {
                constructor(size){
                    this.message = new DataView(new ArrayBuffer(size))
                    this.byteOffset = 0
                }
                writeUint8(value){
                    this.message.setUint8(this.byteOffset++, value)
                }
                writeInt32(value){
                    this.message.setInt32(this.byteOffset, value, true)
                    this.byteOffset += 4
                }
                writeUint32(value){
                    this.message.setUint32(this.byteOffset, value, true)
                    this.byteOffset += 4
                }
                writeString(string){
                    for(let i = 0; i < string.length; i++) this.writeUint8(string.charCodeAt(i))
                    this.writeUint8(0)
                }
            }
            const User = {
                isConnected: false,
                startedBots: false,
                protocolVersion: 0,
                clientVersion: 0,
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
                showAllPlayersMass: false,
                connection: {
                    botsName: '#Jimboy3100Bots',
                    botsAmount: 50,
                    useRemote: false,
                    serverHost: 'localhost',
                    serverPort: 1337,
                    ws: null,
                    messages: {
                        handshake(protocolVersion, clientVersion){
                            const writer = new Writer(9)
                            writer.writeUint8(0)
                            writer.writeUint32(protocolVersion)
                            writer.writeUint32(clientVersion)
                            return writer.message
                        },
                        startBots(botsName, botsAmount, isAlive, serverURL, serverKeyBytes){
                            const writer = new Writer(9 + serverURL.length + botsName.length)
                            writer.writeUint8(1)
                            writer.writeString(botsName)
                            writer.writeUint8(Number(botsAmount))
                            writer.writeUint8(Number(isAlive))
                            writer.writeString(serverURL)
                            writer.writeInt32(new Int32Array(new Int8Array(serverKeyBytes).buffer)[0])
                            return writer.message
                        },
                        mousePosition(mouseX, mouseY){
                            const writer = new Writer(9)
                            writer.writeUint8(7)
                            writer.writeInt32(mouseX)
                            writer.writeInt32(mouseY)
                            return writer.message
                        }
                    },
                    getURL(){
                        return \`\${this.useRemote ? 'wss://' : 'ws://'}\${this.serverHost}:\${this.serverPort}\`
                    },
                    connect(){
                        this.ws = new WebSocket(this.getURL())
                        this.ws.binaryType = 'arraybuffer'
                        this.ws.onopen = this.onopen.bind(this)
                        this.ws.onerror = this.onerror.bind(this)
                        this.ws.onclose = this.onclose.bind(this)
                    },
                    sendMessage(message){
                        if(this.ws && this.ws.readyState === WebSocket.OPEN) this.ws.send(message.buffer)
                    },
                    onopen(){
                        if(User.protocolVersion && User.clientVersion){
                            this.sendMessage(this.messages.handshake(User.protocolVersion, User.clientVersion))
                            document.getElementById('userStatus').style.color = 'green'
                            document.getElementById('userStatus').innerText = 'Connected'
                            User.isConnected = true
                        }
                        else {
                            alert('Find a new party to complete the handshake')
                            this.ws.close()
                        }
                    },
                    onerror(){
                        if(this.ws.readyState === WebSocket.CONNECTING || this.ws.readyState === WebSocket.OPEN) this.ws.close()
                    },
                    onclose(){
                        document.getElementById('userStatus').style.color = 'red'
                        document.getElementById('userStatus').innerText = 'Disconnected'
                        setTimeout(this.connect.bind(this), 1000)
                        User.isConnected = false
                    }
                }
            }
            WebSocket.prototype.storedSend = WebSocket.prototype.send
            WebSocket.prototype.send = function(buffer){
                this.storedSend(buffer)
                const message = new DataView(new Uint8Array(buffer).buffer)
                if(!User.protocolVersion && message.getUint8(0) === 254 && message.byteLength === 5) User.protocolVersion = message.getUint32(1, true)
                else if(message.getUint8(0) === 255 && message.byteLength === 5){
                    if(!User.clientVersion) User.clientVersion = message.getUint32(1, true)
                    else if(!User.isConnected) User.connection.connect()
                }
            }
            document.addEventListener('keydown', e => {
                if(!document.getElementById('overlays')){
                    switch(e.key){
                        case User.startBotsKey:
                            if(!User.startedBots && User.serverURL.includes('?party_id=')){
                                User.connection.sendMessage(User.connection.messages.startBots(User.connection.botsName, User.connection.botsAmount, User.isAlive, User.serverURL, User.serverKeyBytes))
                                document.getElementById('botsStatus').style.color = 'green'
                                document.getElementById('botsStatus').innerText = 'Started'
                                User.startedBots = true
                            }
                            else alert('You must be in party mode and have bots stopped in order to start them')
                            break
                        case User.stopBotsKey:
                            if(User.startedBots){
                                User.connection.sendMessage(new Uint8Array([2]))
                                document.getElementById('botsStatus').style.color = 'red'
                                document.getElementById('botsStatus').innerText = 'Stopped'
                                User.startedBots = false
                            }
                            else alert('You must have bots started in order to stop them')
                            break
                        case User.splitBotsKey:
                            User.connection.sendMessage(new Uint8Array([3]))
                            break
                        case User.ejectBotsKey:
                            User.connection.sendMessage(new Uint8Array([4]))
                            break
                        case User.aiBotsKey:
                            User.enabledBotsAI = !User.enabledBotsAI
                            User.connection.sendMessage(new Uint8Array([5, Number(User.enabledBotsAI)]))
                            break
                        case User.macroFeedKey:
                            if(!User.macroFeedInterval){
                                window.core.eject()
                                User.macroFeedInterval = setInterval(window.core.eject, 80)
                            }
                            break
                        case User.doubleSplitKey:
                            window.core.split()
                            setTimeout(window.core.split, 40)
                            break
                        case User.sixteenSplitKey:
                            window.core.split()
                            setTimeout(window.core.split, 40)
                            setTimeout(window.core.split, 80)
                            setTimeout(window.core.split, 120)
                            break
                        case User.stopMovementKey:
                            User.stopMovement = !User.stopMovement
                            break
                    }
                }
            })
            document.addEventListener('keyup', e => {
                if(!document.getElementById('overlays') && e.key === User.macroFeedKey && User.macroFeedInterval){
                    clearInterval(User.macroFeedInterval)
                    User.macroFeedInterval = null
                }
            })
            setTimeout(() => {
                document.getElementById('mainui-ads').style.height = '340px'
                document.getElementById('mainui-ads').innerHTML = \`
                    <div id="userPanel">
                        <br>
                        <div id="tabs">
                            <span id="tabInfo" style="font-weight: bold; cursor: pointer;">INFO</span>
                            <span> | </span>
                            <span id="tabSettings" style="font-weight: bold; cursor: pointer;">SETTINGS</span>
                            <span> | </span>
                            <span id="tabKeys" style="font-weight: bold; cursor: pointer;">KEYS</span>
                        </div>
                        <br>
                        <section id="tabInfoPanel" style="display: block; margin-left: 15px; margin-right: 15px;">
                            <span style="float: left;">User Server Status: <span id="userStatus" style="font-weight: bold; color: red;">Disconnected</span></span>
                            <br>
                            <br>
                            <span style="float: left;">Bots Status: <span id="botsStatus" style="font-weight: bold; color: red;">Stopped</span></span>
                            <br>
                            <br>
                            <span style="float: left;">Use Remote Server: <input type="checkbox" id="useRemote"></span>
                            <br>
                            <br>
                            <span style="float: left;">Bots Name: <input type="text" id="botsName" style="color: #31BAFF; border: none; outline: none;" placeholder="Bots Name" value="#FreeAgarioBots" maxlength="15" spellcheck="false"></span>
                            <br>
                            <br>
                            <span style="float: left;">Bots Amount: <input type="text" id="botsAmount" style="color: #F82626; border: none; outline: none;" placeholder="Min=50/Max=150" value="50" maxlength="3" spellcheck="false"></span>
                            <br>
                            <br>
                            <span style="float: left;">Server Host: <input type="text" id="serverHost" style="color: #31BAFF; border: none; outline: none;" placeholder="Hostname/IP" value="localhost" maxlength="50" spellcheck="false"></span>
                            <br>
                            <br>
                            <span style="float: left;">Server Port: <input type="text" id="serverPort" style="color: #FFAD31; border: none; outline: none;" placeholder="0-65535" value="1337" maxlength="5" spellcheck="false"></span>
                            <br>
                            <br>
                            <span>Developed by <a style="text-decoration: none;" target="_blank" href="https://github.com/nelthedev">Nel#0001</a></span>
                        </section>
                        <section id="tabSettingsPanel" style="display: none; margin-left: 15px; margin-right: 15px;">
                            <span style="float: left;">Zoom Speed: <input type="text" id="mouseWheelSpeed" style="border: none; outline: none;" placeholder="0.01-0.99" value="0.9" maxlength="4" spellcheck="false"></span>
                            <br>
                            <br>
                            <span style="float: left;">Extended Scale/Zoom: <input type="checkbox" id="extendedScale"></span>
                            <br>
                            <br>
                            <span style="float: left;">Hide Map Grid: <input type="checkbox" id="hideMapGrid"></span>
                            <br>
                            <br>
                            <span style="float: left;">Show Other Players Mass: <input type="checkbox" id="showAllPlayersMass"></span>
                        </section>
                        <section id="tabKeysPanel" style="display: none; margin-left: 15px; margin-right: 15px;">
                            <span style="float: left;">Start Bots: <input type="text" id="startBotsKey" style="color: #3FAAEF; border: none; outline: none;" placeholder="a-z0-9 (lowercase)" value="x" maxlength="1" spellcheck="false"></span>
                            <br>
                            <span style="float: left;">Stop Bots: <input type="text" id="stopBotsKey" style="color: #3FAAEF; border: none; outline: none;" placeholder="a-z0-9 (lowercase)" value="y" maxlength="1" spellcheck="false"></span>
                            <br>
                            <span style="float: left;">Split Bots: <input type="text" id="splitBotsKey" style="color: #3FAAEF; border: none; outline: none;" placeholder="a-z0-9 (lowercase)" value="t" maxlength="1" spellcheck="false"></span>
                            <br>
                            <span style="float: left;">Eject Bots: <input type="text" id="ejectBotsKey" style="color: #3FAAEF; border: none; outline: none;" placeholder="a-z0-9 (lowercase)" value="a" maxlength="1" spellcheck="false"></span>
                            <br>
                            <span style="float: left;">AI Bots: <input type="text" id="aiBotsKey" style="color: #3FAAEF; border: none; outline: none;" placeholder="a-z0-9 (lowercase)" value="f" maxlength="1" spellcheck="false"></span>
                            <br>
                            <span style="float: left;">Macro Feed: <input type="text" id="macroFeedKey" style="color: #3FAAEF; border: none; outline: none;" placeholder="a-z0-9 (lowercase)" value="e" maxlength="1" spellcheck="false"></span>
                            <br>
                            <span style="float: left;">Double Split: <input type="text" id="doubleSplitKey" style="color: #3FAAEF; border: none; outline: none;" placeholder="a-z0-9 (lowercase)" value="q" maxlength="1" spellcheck="false"></span>
                            <br>
                            <span style="float: left;">Sixteen Split: <input type="text" id="sixteenSplitKey" style="color: #3FAAEF; border: none; outline: none;" placeholder="a-z0-9 (lowercase)" value="r" maxlength="1" spellcheck="false"></span>
                            <br>
                            <span style="float: left;">Stop Move: <input type="text" id="stopMovementKey" style="color: #3FAAEF; border: none; outline: none;" placeholder="a-z0-9 (lowercase)" value="s" maxlength="1" spellcheck="false"></span>
                        </section>
                    </div>
                \`
                const tabs = ['tabInfo', 'tabSettings', 'tabKeys']
                for(const tab of tabs){
                    document.getElementById(tab).addEventListener('click', function(){
                        for(const t of tabs){
                            if(this !== document.getElementById(t)) document.getElementById(\`\${t}Panel\`).style.display = 'none'
                            else document.getElementById(\`\${t}Panel\`).style.display = 'block'
                        }
                    })
                }
                const checkboxes = ['useRemote', 'extendedScale', 'hideMapGrid', 'showAllPlayersMass']
                for(const checkbox of checkboxes){
                    if(localStorage.getItem(checkbox) !== null){
                        switch(checkbox){
                            case 'useRemote':
                                User.connection.useRemote = JSON.parse(localStorage.getItem(checkbox))
                                document.getElementById(checkbox).checked = User.connection.useRemote
                                break
                            default:
                                User[checkbox] = JSON.parse(localStorage.getItem(checkbox))
                                document.getElementById(checkbox).checked = User[checkbox]
                        }
                    }
                    document.getElementById(checkbox).addEventListener('click', function(){
                        switch(checkbox){
                            case 'useRemote':
                                User.connection.useRemote = this.checked
                                localStorage.setItem(checkbox, User.connection.useRemote)
                                break
                            default:
                                User[checkbox] = this.checked
                                localStorage.setItem(checkbox, User[checkbox])
                        }
                    })
                }
                const inputs = ['botsName', 'botsAmount', 'serverHost', 'serverPort', 'mouseWheelSpeed', 'startBotsKey', 'stopBotsKey', 'splitBotsKey', 'ejectBotsKey', 'aiBotsKey', 'macroFeedKey', 'doubleSplitKey', 'sixteenSplitKey', 'stopMovementKey']
                for(const input of inputs){
                    if(localStorage.getItem(input) !== null){
                        switch(input){
                            case 'botsName':
                                User.connection.botsName = localStorage.getItem(input)
                                document.getElementById(input).value = User.connection.botsName
                                break
                            case 'botsAmount':
                                User.connection.botsAmount = JSON.parse(localStorage.getItem(input))
                                document.getElementById(input).value = User.connection.botsAmount
                                break
                            case 'serverHost':
                                User.connection.serverHost = localStorage.getItem(input)
                                document.getElementById(input).value = User.connection.serverHost
                                break
                            case 'serverPort':
                                User.connection.serverPort = JSON.parse(localStorage.getItem(input))
                                document.getElementById(input).value = User.connection.serverPort
                                break
                            case 'mouseWheelSpeed':
                                User.mouseWheelSpeed = JSON.parse(localStorage.getItem(input))
                                document.getElementById(input).value = User.mouseWheelSpeed
                                break
                            default:
                                User[input] = localStorage.getItem(input)
                                document.getElementById(input).value = User[input]
                        }
                    }
                    document.getElementById(input).addEventListener('input', function(){
                        switch(input){
                            case 'botsName':
                                User.connection.botsName = this.value
                                localStorage.setItem(input, User.connection.botsName)
                                break
                            case 'botsAmount':
                                User.connection.botsAmount = Number(this.value)
                                localStorage.setItem(input, User.connection.botsAmount)
                                break
                            case 'serverHost':
                                User.connection.serverHost = this.value
                                localStorage.setItem(input, User.connection.serverHost)
                                break
                            case 'serverPort':
                                User.connection.serverPort = Number(this.value)
                                localStorage.setItem(input, User.connection.serverPort)
                                break
                            case 'mouseWheelSpeed':
                                User.mouseWheelSpeed = Number(this.value)
                                localStorage.setItem(input, User.mouseWheelSpeed)
                                break
                            default:
                                User[input] = this.value
                                localStorage.setItem(input, User[input])
                        }
                    })
                }
            }, 2000)
        `)
        .replace(/setTarget:function\((\w+),(\w+)\){/, `
            $&
            if(User.stopMovement){
                $1 = innerWidth / 2
                $2 = innerHeight / 2
            }
        `)
        .replace(/if\(\w+\.MC&&\w+\.MC\.onPlayerSpawn\)/, `
            $&
            User.isAlive = true
            User.connection.sendMessage(new Uint8Array([6, Number(User.isAlive)]))
        `)
        .replace(/if\(\w+\.MC&&\w+\.MC\.onPlayerDeath\)/, `
            $&
            User.isAlive = false
            User.connection.sendMessage(new Uint8Array([6, Number(User.isAlive)]))
        `)
        .replace(/new\s+WebSocket\((\w+\(\w+\))\)/, `
            $&
            if(User.startedBots){
                User.connection.sendMessage(new Uint8Array([2]))
                document.getElementById('botsStatus').style.color = 'red'
                document.getElementById('botsStatus').innerText = 'Stopped'
                User.startedBots = false
            }
            User.enabledBotsAI = false
            User.macroFeedInterval = null
            User.stopMovement = false
            User.isAlive = false
            User.serverURL = $1
            User.serverKeyBytes = []
        `)
        .replace(/\w+\[\w+>>2]=\w+>>>15\^\w+;\w+=0;do{\w+=\w+\+\w+\|0;\w+\[\w+>>0]=\w+\[\w+>>0]\^(\w+\[\w+\+\(\w+&3\)>>0])/, `
            $&
            if(User.serverKeyBytes.length !== 4) User.serverKeyBytes.push($1)
        `)
        .replace(/(\w+)=~~\(\+\w+\[\w+\+\d+>>3]\+\s+\+\(\(\w+\[\w+\+\d+>>2]\|0\)-\(\(\w+\[\d+]\|0\)\/2\|0\)\|0\)\/\w+\);(\w+)=~~\(\+\w+\[\w+\+\d+>>3]\+\s+\+\(\(\w+\[\w+\+\d+>>2]\|0\)-\(\(\w+\[\d+]\|0\)\/2\|0\)\|0\)\/\w+\)/, `
            $&
            User.mouseX = $1 - User.mapOffsetX
            User.mouseY = $2 - User.mapOffsetY
            User.connection.sendMessage(User.connection.messages.mousePosition(User.mouseX, User.mouseY))
        `)
        .replace(/\w+\[\w+\+272>>3]=(\w+);\w+\[\w+\+280>>3]=(\w+);\w+\[\w+\+288>>3]=(\w+);\w+\[\w+\+296>>3]=(\w+)/, `
            $&
            if(~~($3 - $1) === 14142 && ~~($4 - $2) === 14142){
                User.mapOffsetX = ($1 + $3) / 2
                User.mapOffsetY = ($2 + $4) / 2
            }
        `)
        .replace(/;if\((\w+)<1\.0\)/, ';if($1 < (User.extendedScale ? 0.05 : 1))')
        .replace(/\(\.9,/, '(User.mouseWheelSpeed,')
        .replace(/(\w+\(\d+,\w+\|0,\.5,\.5\)\|0);(\w+\(\d+,\w+\|0,\.5,50\.5\)\|0);(\w+\(\d+,\w+\|0,\.5,\.5\)\|0);(\w+\(\d+,\w+\|0,50\.5,\.5\)\|0)/, `
            $1
            if(!User.hideMapGrid) $2
            $3
            if(!User.hideMapGrid) $4
        `)
        .replace(/while\(0\);(\w+)=\(\w+\|0\)!=\(\w+\|0\);/, `
            $&
            if(User.showAllPlayersMass) $1 = true
        `)
}

(async () => {
    if(location.protocol === 'http:') location.replace('https://agar.io')
    else {
        stop()
        const agarioRes = await fetch('https://agar.io')
        const agarioHTML = await agarioRes.text()
        const coreRes = await fetch('https://agar.io/agario.core.js')
        const coreJS = await coreRes.text()
        document.open()
        document.write(modifyAgarioHTML(agarioHTML, modifyCoreJS(coreJS)))
        document.close()
    }
})()
