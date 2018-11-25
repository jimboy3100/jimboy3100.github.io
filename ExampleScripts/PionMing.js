// Pion PLUS rewrite from ogar
/*
 //Todo list
 1. preRender
 2. mipmap 文字渲染
 4. 刺球數字
 5. PIXI.js
 Bug:

 ///

 1. SplitRange / SplitIndicator 規則與V2/HKG相同(Display Rule same to V2)
 2. ZT樣式小地圖(選擇性)/ZT style MiniMap
 3. ChatBox(滑鼠中鍵開關)/Chat box(Mouse middle to toggle)
 4. Commander功能(滑鼠右鍵)/Commander function(Right click on map to send)
 5. Map選單 與 地圖背景圖片/Map selection and background Image map
 6. 複製房間資訊(含排行榜)/Copy GameInfo(Including the leaderboard)
 7. 指定觀戰(Targeting Focus)
 8. 傳送第一名位置至小地圖(Send #1's position to minimap)

 /* 複製符號 或 待用文字區

 */


//特別注意 P為Window.ogario 是插件的主架構
//Q等同 jQuery
//用以減少重複輸入與減少代碼量
! function(P, Q) {
    function PlayerSet(id, nick, skinID, skinURL, color) {
        this.id = id, this.nick = nick, this.skinID = skinID, this.skinURL = skinURL, 7 == color.length && (this.color = color)
    }

    function SettingsDefault() {}

    function HotkeyManager() {}

    function ThemeSet() {}

    function ChatRoom() {}

    /* ================ 監聽滑鼠移動取得座標 =============== */
    function getMouseCood() {
        var cvs = document.getElementById("canvas");
        if(cvs !== null) {
            cvs.addEventListener("mousemove", function(t) {
                if((P.play && P.cursorTracking) || (P.play && P.enableCommander) || P.selectTarget1 || P.selectTarget2) {
                    P.clientX = t.clientX;
                    P.clientY = t.clientY;
                    P.setCursorPosition && P.setCursorPosition();
                }
            }, !1)
            return void(0)
        }
        setTimeout(getMouseCood, 50)
    }
    /* ================ MC為MiniClip API函式, Hook所需函式為己用 =============== */
    function MCHandler() {
        return window.MC && window.MC.showNickDialog ? (window.MC._showNickDialog = window.MC.showNickDialog, window.MC.showNickDialog = function() {
            window.MC._showNickDialog.apply(this, arguments), Q("#main-panel").show(), Q(".btn-spectate").prop("disabled", false), window.onkeydown = function() {}
        }, window.MC._showStatsDialog = window.MC.showStatsDialog, window.MC.showStatsDialog = function() {
            window.MC._showStatsDialog.apply(this, arguments), window.onkeydown = function() {}
        }, window.MC._onPlayerSpawn = window.MC.onPlayerSpawn, window.MC.onPlayerSpawn = function() {
            window.MC._onPlayerSpawn.apply(this, arguments), P.play = !0, P.playerColor = null, f && f.cacheCustomSkin(profile.nick, profile.skinURL), f.sendPlayerSpawn()
        }, window.MC._onPlayerDeath = window.MC.onPlayerDeath, window.MC.onPlayerDeath = function() {
            window.MC._onPlayerDeath.apply(this, arguments), Q(".menu-panel").hide(), f.skipStats ? Q("#main-panel").show() : Q("#stats").show(), P.play = false, P.playerMass = 0, P.playerColor = null, f.sendPlayerDeath(), Q(".btn-spectate").prop("disabled", !1), window.onkeydown = function() {}
        }, window.MC._onAgarioCoreLoaded = window.MC.onAgarioCoreLoaded, window.MC.onAgarioCoreLoaded = function() {
            window.MC._onAgarioCoreLoaded.apply(this, arguments), HelloContainResize()
        }, window.MC._wasInitialized = window.MC.wasInitialized, void((window.MC.wasInitialized = function() {
            window.MC._wasInitialized.apply(this, arguments), setTimeout(function() {
                HelloContainResize(), f && f.getDefaultSettings(), Q(".btn-spectate").prop("disabled", !1), window.onkeydown = function() {}
            }, 1e3)
        }))) : void(setTimeout)(MCHandler, 50)
    }
    /* ================ 調整Hello Container大小 =============== */
    function HelloContainResize() {
        var width = window.innerWidth,
            height = window.innerHeight,
            i = Q("#helloContainer"),
            s = i.innerHeight();
        s > 0 ? P.menuHeight = s : s = P.menuHeight || 580;
        var n = Math.min(1, height / s),
            r = s * n,
            l = Math.round(height / 2 - .5 * r),
            c = "translate(-50%, 0%) scale(" + n + ")";
        i.css("transform", c), i.css("-ms-transform", c), i.css("-webkit-transform", c), i.css("top", "" + l + "px"), P.innerW = width, P.innerH = height
    }
    /* ================ 關閉警告窗 =============== */
    function ExitCheck() {
        return P.play ? Dict[lan].exit : void(0)
    }

    /* ================ 替換部分 agario.core.js 代碼, Hook我們要用的函式 =============== */
    ! function() {
        window.NREUM && (window.NREUM = null, delete window.NREUM);
        window.core && (window.core = null, delete window.core);
        Q.ajax("http://agar.io/agario.core.js", {
            success: function(e) {
                var t = e;
                t = t.replace(/(\(function\(([\w$]+)\){)/i, "$1 var ogario=$2.ogario,gameCtx=null;"),
                    t = t.replace(/(([\w$]+)=[\w$]+\.getContext\(\"2d\"\);)/i, "if($2.id===\"canvas\"){$1 gameCtx=$2;}else{$1}"),
                    t = t.replace(/(setTarget:function\((\w),(\w)\)\{)([\w$]+\(\w,\w\)})/i, "$1if(ogario.pause){$2=ogario.innerW/2*ogario.canvasScale; $3=ogario.innerH/2*ogario.canvasScale;}if(ogario.getFocusTargetEnable()){$2=ogario.focusX; $3=ogario.focusY;} $4"),
                    t = t.replace(/(function\s*([\w$]+)\(\w\){return\s*[\w$]+\(\w,\w\)})/i, "$1 ogario.getString=$2;"),
                    t = t.replace(/(\w\[\w\+(\d+)>>3]=(\w);\w\[\w\+(\d+)>>3]=(\w);\w\[\w\+(\d+)>>3]=(\w);\w\[\w\+(\d+)>>3]=(\w);)/i, "$1 if(ogario.setMapCoords){ogario.setMapCoords($3,$5,$7,$9,$2,$8);}"),
                    t = t.replace(/if\((\+\w\[\w>>3\])<1\.0\){/i, "if($1<ogario.zoomResetValue){"),
                    t = t.replace(/(\w)(=\+(\w\[\w>>3\])\*\+\w\()(\.\d)(,\+\w\);)/i, "if(!ogario.autoZoom){$3=ogario.zoomValue;} $1$2 (ogario.zoomSpeedValue||0.9) $5 ogario.zoomValue=$1;"),
                    t = t.replace(/(\w=\w\[\w>>2\]\|0;)((\w\[\w>>3\])=(\w);)(\w\[\w>>0\]=a\[\w>>0\];)/i, "$1 if(!ogario.autoZoom){$3=ogario.zoomValue;}else{$2}$5"),
                    t = t.replace(/(do{\w=\+\w\[\(\w\[\w>>2\]\|0\)\+\d+>>2];\w=\w\+\s*)(\+\(~~\+\w\(\+\(\w\*\w\/100\.0\)\)\|0\))(;\w=\w\+4\|0}while\(\(\w\|0\)!=\(\w\|0\)\);(\w)=(\w);)/i, "ogario.playerCellsMass=[]; $1$2; ogario.playerCellsMass.push($2)$3 ogario.playerMass=$5; if(ogario.calculateMass){ogario.calculateMass();}"),
                    t = t.replace(/([\w$]+\(\d+,\w\[\w>>2\]\|0,(\+\w),(\+\w)\)\|0;[\w$]+\(\d+,\w\[\w>>2\]\|0,\+-(\+\w\[\w\+\d+>>3\]),\+-(\+\w\[\w\+\d+>>3\])\)\|0;)/i, "$1 ogario.viewScale=$2; ogario.playerX=Math.floor($4); ogario.playerY=Math.floor($5); if(ogario.customDraw){ogario.customDraw(gameCtx);}"),
                    t = t.replace(/(while\(0\);)([\w$]+\(\w,\w\);)([\w$]+\(\w,\w\);)([\w$]+\(\w,\w\);)([\w$]+\(\w,\w\);)(\w\[\w\+\d+>>0\]=1;\w=\w;return})/i, "$1$6"),
                    t = t.replace(/[\w$]+\(\w,\d+,15\);else/i, "{}"),
                    t = t.replace(/(\d\.\d;return}function\s*)([\w$]+\(.,.\)){/i, "$1$2{return;"),
                    t = t.replace(/(if\(\(\w\[\d+\]\|0\)!=0\?\(\w\[\d+\]\|\w\[(\w)\+\d+>>0\]\)<<24>>24==0:0\))((\w)=\w\[(\w)\+\d+>>2\]\|0;)else/i, "ogario.cellMemOffset=$2; $1 if(ogario.customSkins){$4=0;}else{$3}else"),
                    t = t.replace(/do\s*if\((\w)\){((\w)=!\((\+\w\[\w>>2\])<=20\.0\);)([\w$]+\(\d+,\w\[\w>>2]\|0\)\|0;[\w$]+\(\d+,\w\[\w>>2]\|0,(\+\(\+\w\[\w>>2\]\)),(\+\(\+\w\[\w>>2\]\)),\+\(\+\w\[\w>>2\])\+5\.0(\),0\.0,6\.283185307179586,0\)\|0;[\w$]+\(\d+,\w\[\w>>2]\|0\)\|0;\w=\w\[\w>>2\]\|0;)if\(\w\){([\w$]+\(\d+,\w\|0,(\w&255\|0),(\w&255\|0),(\w&255\|0)\)\|0;)([\w$]+\(\d+,\w\[\w>>2]\|0\)\|0;)/i, "var nick=null,color=null,skin=null,cellSize=null,cellX=null,cellY=null,isFood=false,isVirus=false,isPlayerCell=false,skipCell=false;do if($1=1,$1){cellSize=$4;$2 if(!$3){isFood=true;if(!ogario.showFood){break;} if(ogario.autoHideFood&&ogario.playerMass>1000){ogario.showFood=false;} if(!ogario.rainbowFood){ogario.foodCache.push({x:Math.floor($6),y:Math.floor($7),size:cellSize});break;}} if(ogario.hideSmallBots&&cellSize<=36){skipCell=true;break;}$5$8 if($3){if(gameCtx){ogario.globalApha=gameCtx.globalAlpha;cellX=$6;cellY=$7;if(gameCtx.lineJoin==='miter'){isVirus=true;if(ogario.play&&ogario.virColors){gameCtx.fillStyle=ogario.setVirusColor(cellSize);gameCtx.strokeStyle=ogario.setVirusStrokeColor(cellSize);}else{gameCtx.fillStyle=ogario.virusColor;gameCtx.strokeStyle=ogario.virusStrokeColor;}gameCtx.stroke();if(ogario.transparentViruses){gameCtx.globalAlpha*=ogario.virusAlpha;} if(ogario.virusesRange&&ogario.play){ogario.virusesCache.push({x:Math.floor(cellX),y:Math.floor(cellY),size:cellSize});}}else{if(ogario.nameMemOffset&&ogario.cellMemOffset&&ogario.getString){if((a[ogario.cellMemOffset+ogario.nameMemOffset+4>>0]&1)==0|0){nick=ogario.getString(ogario.cellMemOffset+ogario.nameMemOffset+5);}else{nick=ogario.getString(c[ogario.cellMemOffset+ogario.nameMemOffset+12>>2]|0);}} if(ogario.rgb2Hex){color=ogario.rgb2Hex($10,$11,$12);} if(nick&&nick.length>0&&color){if(ogario.showCustomSkins&&ogario.customSkins&&ogario.getCustomSkin){skin=ogario.getCustomSkin(nick);}} if(ogario.targetSpec && cellSize>50){ogario.ballPool.push({nick:nick,x:cellX,y:cellY,size:cellSize})} if(ogario.play){if(ogario.cellMemOffset&&ogario.idOffset&&ogario.idMemOffset){var idA=c[ogario.cellMemOffset+ogario.idOffset>>2]|0;var idB=c[ogario.idMemOffset]|0;var idC=c[ogario.idMemOffset+1]|0;loop:do{if((idB|0)!=(idC|0)){while(true){if((c[idB>>2]|0)==(idA|0)){break loop;}idB=idB+4|0;if((idB|0)==(idC|0)){idB=idC;break;}}}}while(false);isPlayerCell=(idB|0)!=(idC|0);} if(isPlayerCell&&ogario.playerCells){ogario.playerCells.push({x:Math.floor(cellX),y:Math.floor(cellY),size:Math.floor(cellSize)});ogario.playerColor=color;} if(((ogario.oppColors&&!ogario.oppRings)||ogario.myCustomColor)&&ogario.setOppColor){gameCtx.fillStyle=ogario.setOppColor(cellSize,isPlayerCell);}else{$9} if(!isPlayerCell&&ogario.oppRings&&cellSize>50){ogario.CellsCache.push({x:Math.floor(cellX),y:Math.floor(cellY),size:Math.floor(cellSize)});}}else{$9} if(ogario.transparentCells){gameCtx.globalAlpha*=ogario.cellsAlpha;}}$13gameCtx.globalAlpha=ogario.globalApha;if(((ogario.transparentSkins||(ogario.play&&ogario.oppColors))&&!(isPlayerCell&&!ogario.myTransparentSkin))||isPlayerCell&&ogario.myTransparentSkin){gameCtx.globalAlpha*=ogario.skinsAlpha;} if(skin){if(ogario.play && !isPlayerCell && ogario.isEnableTeammateIndicator && cellSize < ogario.teammateIndicatorShowSize)gameCtx.drawImage(ogario.teammateIndicator, ~~(+(+g[z >> 2]) - 50), ~~(+(+g[A >> 2]) - cellSize - 100));gameCtx.save();gameCtx.clip();gameCtx.drawImage(skin,cellX-cellSize,cellY-cellSize,2*cellSize,2*cellSize);gameCtx.restore();}}else{$9$13}break;"),
                    t = t.replace(/(if\(\(\w\[\w\+\d+>>0\]\|0\)==0\?\(\(\(\(\w\[\w\+\d+>>2\]\|0\)\+\(\w\[\d+\]\|0\)\|0\)>>>0\)%10\|0\|0\)!=0:0\){\w=\w\[\w>>2\]\|0;[\w$]+\(\d+,\w\|0\)\|0;\w=\w;return})([\w$]+\(\w,\w\);)/i, "if(gameCtx&&ogario){gameCtx.globalAlpha=ogario.globalApha;}$1 if(!(skipCell||(ogario.autoHideCellsInfo&&ogario.setAutoHideCellsInfo&&cellSize&&!isFood&&!isVirus&&!isPlayerCell&&ogario.setAutoHideCellsInfo(cellSize)))){$2}"),
                    t = t.replace(/(\w=0;\w=\w\[\w\+(\d+)>>2\]\|0;\w=\w\[(\d+)\]\|0;\w=\w\[\d+\]\|0;)(\w:do)/i, "$1 ogario.idOffset=$2; ogario.idMemOffset=$3; $4"),
                    t = t.replace(/(\w=\w\+5\+\(\(\w\|0\)\/)2(\|0\)\|0)/i, "$1 1.5 $2"),
                    t = t.replace(/((\w)=\+[\w$]+\(\+\(\+[\w$]+\(\d+\)\*10.0\)\)\/10.0;)/i, "$1 if($2<0.3){$2=0.3}"),
                    t = t.replace(/((\w)=\(\w\|0\)<20\?20.0:\+\(\w\|0\);)/i, "$1 $2*=2;"),
                    t = t.replace(/do\s+if\((\w)\|(\(\w\[\d+\]\|0\)\!=0)\){/i, "do if(($2&&!($1&&ogario.hideMyName))||!ogario.nameMemOffset){"),
                    t = t.replace(/(\w=\w\+(\d+)\|0;\w=~~\(\+\w\[\w\+\d+>>2\]\*\.3\);)/i, "$1 ogario.nameMemOffset=$2;"),
                    t = t.replace(/(if\(\w<=)(20\.0)(\){\w=\w;return})(if\(!(\w)\){if\(\(\w\[\d+\]\|0\)!=\(\w\[\d+\]\|0\)\){\w=\w;return}if\(\(\w\[\w\+\d+>>0\]\|0\)!=0\?\(\w\[\w>>0\]\|0\)==0:0\){\w=\w;return}})((\w\[\w>>2\])=~~\+[\w$]+\(\+\((\w)\*\w\/100\.0\)\);)/i, "$140.0||$5&&ogario.hideMyMass$3$6");
                var a = document.createElement("script");
                a.textContent = t, a.async = !0, document.body.appendChild(a)
            },
            dataType: "text",
            method: "GET",
            cache: !1,
            crossDomain: !0
        })
    }();

    /* ================ Dict為字串庫 存放所需字串 方便語言轉換 =============== */
    var lan =  "";
    null !== window.localStorage.getItem ("PP_language") ? (lan = window.localStorage.getItem ("PP_language")) : lan = "en";
    var Dict = {
        en: {
            start: "Start",
            settings: "Settings",
            autoZoom: "Auto Zoom",
            autoHideCellsInfo: "Auto hide Cell Info",
            showFood: "Show Food",
            autoHideFood: "Auto hide Food",
            hideMyName: "Hide my Name",
            hideMyMass: "Hide my Mass",
            customSkins: "Custom skins",
            myTransparentSkin: "My transparent skin",
            myCustomColor: "My custom color",
            transparentCells: "Transparent cells",
            transparentViruses: "Transparent viruses",
            transparentSkins: "Transparent skins",
            showBgSectors: "Background sectors",
            showMapBorders: "Map Borders",
            showMiniMap: "Minimap",
            rainbowFood: "Rainbow food",
            popchat: "Popup Chat",
            oppColors: "Opponents Colors",
            oppRings: "Opponents Rings",
            virColors: "Viruses Warning",
            splitRange: "Split Range",
            virusesRange: "Viruses Range",
            textStroke: "Text Stroke",
            cursorTracking: "Cursor Line",
            enableCommander: "Commander Mode",
            isEnableTeammateIndicator: "Teammate Indicator",
            chatbox: "ChatBox",
            mouseFeed: "Mouse Feed",
            //showVirusCount: "Virus Count",
            showTop5: "Team Top 5",
            showGamebox: "Toggle GameInfoBox",
            showStatsMass: "Score",
            showStatsSTE: "STE",
            showStatsN16: "[n/16]",
            showStatsFPS: "FPS",
            hotkeys: "Hotkeys",
            "inst-assign": "Click on the item you want to change",
            "inst-delete": "Press the DELETE key to delete selected item.",
            "inst-keys": "Possible key combinations with the CTRL and ALT keys.",
            "Feed": "Feed",
            "MacroFeed": "Macro feed",
            "split": "Split",
            "doubleSplit": "Double Space",
            "tripleSplit": "Triple Space",
            "quickSplit": "Quick Space",
            "pause": "Stop Movement (Toggle)",
            "tempShowName": "Show Name for 3 sec",
            "showSplitRange": "Split/Attack Range (Toggle)",
            "showDoubleSplitRange": "Double attack Range (Temporary)",
            "showSplitInd": "Split indicators",
            "showOppColors": "Opponents Colors",
            "showSkins": "Skins",
            "toggleCells": "Toggle own Cells (Smallest/ Biggest)",
            "showFoods": "Show/ Hide Food",
            "showLb": "Leaderboard",
            "resetZoom": "Reset zoom",
            "zoomLevel": "Zoom level",
            "clearChat": "Show chat history / Clear chat",
            "hideBots": "On/ off Auto hide name/mass",
            "showNames": "Show/ Hide names",
            "showMass": "Show/ Hide mass",
            "chatMessage": "Enter chat message",
            "quickResp": "Quick respawn",
            "targetView1": "Target Focus 1(Press and Click on the ball)",
            "targetView2": "Target Focus 2(Press and Click on the ball)",
            commands: "Commands",
            saveComm: "Save commands",
            theme: "Theme",
            themePreset: "Theme preset",
            mapPreset: "Map",
            mainColor: "Main color",
            bgColor: "Background color",
            foodColor: "Food color",
            gridColor: "Grid / sectors color",
            bordersColor: "Borders color",
            commanderColor: "Commander Color",
            virusColor: "Virus Color",
            virusStrokeColor: "Virus Stroke color",
            customBackground: "Custom Background Image",
            normalLb: "Leaderboard header",
            centeredLb: "Centered leaderboard",
            fpsAtTop: "Game stats at top",
            ztMap: "ZT style MiniMap",
            ImgMap: "Map background Img",
            showSkinsMsgA: "Skins are visible!",
            showSkinsMsgB: "Skins are hidden!",
            hideSmallBotsMsgA: "Small bots are visible!",
            hideSmallBotsMsgB: "Small bots are hidden!",
            sendNo1: "Send #1 to MiniMap",
            profile: "Profile",
            saveSett: "Save settings",
            resetSett: "Reset to default",
            close: "Close",
            activePartys: "Active partys",
            mass: "Mass:",
            visit: "Visit",
            copy: "COPY",
            exit: "You are leaving Agar.io."
        },
        trch: {
            start: "開始",
            settings: "設定",
            autoZoom: "自動縮放",
            autoHideCellsInfo: "自動隱藏小球名子/質量",
            showFood: "食物",
            autoHideFood: "自動隱藏食物",
            hideMyName: "隱藏自己名子",
            hideMyMass: "隱藏自己質量",
            customSkins: "Skin",
            myTransparentSkin: "自己半透明Skin",
            myCustomColor: "自定義球顏色",
            transparentCells: "半透明 球球",
            transparentViruses: "半透明 刺球",
            transparentSkins: "半透明 Skin",
            showBgSectors: "背景地圖",
            showMapBorders: "地圖邊緣",
            showMiniMap: "小地圖",
            rainbowFood: "彩色豆豆",
            popchat: "聊天窗氣泡",
            oppColors: "增強色",
            oppRings: "增強環",
            virColors: "刺球警告",
            splitRange: "分裂範圍",
            virusesRange: "刺球範圍",
            textStroke: "文字陰影",
            cursorTracking: "滑鼠指示線",
            enableCommander: "指揮功能",
            isEnableTeammateIndicator: "隊友指示三角",
            chatbox: "聊天窗",
            mouseFeed: "滑鼠W",
            //showVirusCount: "Virus Count",
            showTop5: "隊友前五名",
            showGamebox: "房間資訊-開關",
            showStatsMass: "分數",
            showStatsSTE: "STE",
            showStatsN16: "[n/16]",
            showStatsFPS: "FPS",
            hotkeys: "熱鍵",
            "inst-assign": "就點你想改的 按下熱鍵就行啊",
            "inst-delete": "Delete刪除熱鍵",
            "inst-keys": "支持 CTRL 跟 ALT 組合鍵",
            "Feed": "餵食W",
            "MacroFeed": "快速 W",
            "split": "分裂",
            "doubleSplit": "雙拍",
            "tripleSplit": "三拍",
            "quickSplit": "秒空",
            "pause": "停止移動/靜止 (開關)",
            "tempShowName": "顯示名稱3秒鐘",
            "showSplitRange": "分裂範圍 (開關)",
            "showDoubleSplitRange": "雙拍範圍 (按住)",
            "showSplitInd": "增強環",
            "showOppColors": "增強色",
            "showSkins": "開關Skins",
            "toggleCells": "切換大小球(這不重要)",
            "showFoods": "開/關食物",
            "showLb": "排行榜",
            "resetZoom": "重設縮放",
            "zoomLevel": "縮放等級",
            "hideBots": "開/關 自動隱藏小球",
            "showNames": "開/關 名子",
            "showMass": "開/關 質量",
            "chatMessage": "輸入訊息",
            "quickResp": "快速重生",
            "targetView1": "指定觀戰 目標1 (按住點擊目標球)",
            "targetView2": "指定觀戰 目標2 (按住點擊目標球)",
            commands: "指令",
            saveComm: "保存指令",
            theme: "主題",
            themePreset: "主題樣式",
            mapPreset: "地圖樣式",
            mainColor: "主要顏色",
            bgColor: "背景顏色",
            foodColor: "食物顏色",
            gridColor: "地圖字顏色",
            bordersColor: "地圖邊緣顏色",
            commanderColor: "指揮功能顏色",
            virusColor: "刺球顏色",
            virusStrokeColor: "刺球邊緣顏色",
            customBackground: "自定義背景圖",
            normalLb: "排行榜正常標題",
            centeredLb: "排行榜置中",
            fpsAtTop: "左下那行字改上面",
            ztMap: "ZT式 小地圖",
            ImgMap: "地圖背景圖片",
            showSkinsMsgA: "看的見Skin!",
            showSkinsMsgB: "看不見Skin!",
            hideSmallBotsMsgA: "小球Bot看的見啦!",
            hideSmallBotsMsgB: "小球Bot看不見啦!",
            sendNo1: "傳送第一名至小地圖",
            saveSett: "保存",
            resetSett: "還原預設",
            close: "關閉",
            activePartys: "Active partys",
            mass: "量:",
            visit: "Visit",
            copy: "複製",
            exit: "確定關閉遊戲?"
        },
        simpch: {
            start: "开始",
            settings: "设定",
            autoZoom: "自动缩放",
            autoHideCellsInfo: "自动隐藏小球资讯",
            showFood: "食物",
            autoHideFood: "自动隐藏食物",
            hideMyName: "隐藏自己名子",
            hideMyMass: "隐藏自己质量",
            customSkins: "Skin",
            myTransparentSkin: "自己Skin半透明",
            myCustomColor: "自定义球颜色",
            transparentCells: "半透明 球球",
            transparentViruses: "半透明 刺球",
            transparentSkins: "半透明 Skin",
            showBgSectors: "背景地图",
            showMapBorders: "地图边缘",
            showMiniMap: "小地图",
            rainbowFood: "彩色豆豆",
            popchat: "聊天窗气泡",
            oppColors: "增强色",
            oppRings: "增强环",
            virColors: "刺球警告",
            splitRange: "分裂范围",
            virusesRange: "刺球范围",
            textStroke: "文字阴影",
            cursorTracking: "鼠标指示线",
            enableCommander: "指挥功能",
            isEnableTeammateIndicator: "队友指示三角",
            chatbox: "聊天窗",
            mouseFeed: "鼠标W",
            //showVirusCount: "Virus Count",
            showTop5: "队友前五名",
            showGamebox: "房间资讯-开关",
            showStatsMass: "分数",
            showStatsSTE: "STE",
            showStatsN16: "[n/16]",
            showStatsFPS: "FPS",
            hotkeys: "热键",
            "inst-assign": "点擊你想改的 按下热键就行了",
            "inst-delete": "Delete 删除選定热建",
            "inst-keys": "支持 CTRL 与 ALT 组合键",
            "Feed": "餵食W",
            "MacroFeed": "快速 W",
            "split": "分裂",
            "doubleSplit": "双拍",
            "tripleSplit": "三拍",
            "quickSplit": "秒空",
            "pause": "停止移动/静止 (开关)",
            "tempShowName": "显示名称3秒钟",
            "showSplitRange": "分裂范围 (开关)",
            "showDoubleSplitRange": "双拍范围 (按住)",
            "showSplitInd": "增强环",
            "showOppColors": "增强色",
            "showSkins": "开关Skins",
            "toggleCells": "切换大小球(这不重要)",
            "showFoods": "开/关食物",
            "showLb": "排行榜",
            "resetZoom": "重设缩放",
            "zoomLevel": "缩放等级",
            "hideBots": "开/关 自动隐藏 名子/质量",
            "showNames": "开/关 名子",
            "showMass": "开/关 质量",
            "chatMessage": "输入讯息",
            "quickResp": "快速重生",
            "targetView1": "指定观战 目标1 (按住点击目标球)",
            "targetView2": "指定观战 目标2 (按住点击目标球)",
            commands: "指令",
            saveComm: "保存指令",
            theme: "主题",
            themePreset: "主题样式",
            mapPreset: "地图样式",
            mainColor: "主要颜色",
            bgColor: "背景颜色",
            foodColor: "食物颜色",
            gridColor: "地图字颜色",
            bordersColor: "地图边缘颜色",
            commanderColor: "指挥功能颜色",
            virusColor: "刺球颜色",
            virusStrokeColor: "刺球边缘颜色",
            customBackground: "自定义地圖背景图",
            normalLb: "排行榜正常标题",
            centeredLb: "排行榜置中",
            fpsAtTop: "左下那行字改上面",
            ztMap: "ZT式 小地图",
            ImgMap: "地图背景图片",
            showSkinsMsgA: "看的见Skin!",
            showSkinsMsgB: "看不见Skin!",
            hideSmallBotsMsgA: "小球Bot看的见啦!",
            hideSmallBotsMsgB: "小球Bot看不见啦!",
            sendNo1: "传送第一名至小地图",
            saveSett: "保存",
            resetSett: "还原预设",
            close: "关闭",
            activePartys: "Active partys",
            mass: "量:",
            visit: "Visit",
            copy: "复制",
            exit: "确定关闭游戏?"
        }
    };

    /* ================ 命令集 =============== */
    var Command = {
        comm1: "Feed me!",
        comm2: "Split into me!",
        comm3: "Need backup at %currentSector%!",
        comm4: "Enemy spotted at %currentSector%!",
        comm5: "Need a teammate!",
        comm6: "Tank the virus!",
        comm7: "Eat the virus!",
        comm8: "Let's bait!",
        comm9: "Fake tricksplit!",
        comm0: "Fuck!",
        comm10: "Tricksplit!",
        comm11: "Left!",
        comm12: "Up!",
        comm13: "Right!",
        comm14: "Down!"
    };
    /* ================ 溢出字元 不過我好像沒用到他 ogar副產物 =============== */
    var escapeWord = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "\'": "&#39;",
        "/": "&#x2F;"
    };

    var theme = {
        mainColor: "#0849d4",
        bgColor: "#000000",
        foodColor: "#0849d4",
        gridColor: "#1d1d1d",
        commandsTextColor: "#ffffff",
        commanderColor: "#55FF55",
        centeredLb: true,
        fpsAtTop: false,
        bgColor: "#000000",
        bordersColor: "#b5a642",
        virusColor: "#666666",
        virusStrokeColor: "#666666"
    };

    var player_profile = [],
        profile = {
            nick: "",
            clanTag: "",
            skinURL: "",
            color: theme.mainColor
        },

    /* ================ Setting =============== */
        GameSetting = {
            hideMyName: true,
            hideMyMass: false,
            myTransparentSkin: false,
            myCustomColor: false,
            autoZoom: false,
            autoHideCellsInfo: true,
            autoHideFood: true,
            showFood: true,
            customSkins: true,
            transparentCells: false,
            transparentViruses: true,
            transparentSkins: false,
            showBgSectors: true,
            showMapBorders: true,
            showMiniMap: true,
            //showVirusCount: false,
            rainbowFood: false,
            isEnableTeammateIndicator: false,
            sendNo1: false,
            oppColors: false,
            oppRings: false,
            virColors: false,
            virusesRange: false,
            splitRange: false,
            popchat: true,
            textStroke: false,
            cursorTracking: true,
            enableCommander: true,
            mouseFeed: false,
            chatbox: true,
            showTop5: false,
            showStatsMass: true,
            showStatsSTE: true,
            showStatsN16: true,
            showStatsFPS: true,
            zoomSpeedValue: 0.9,
            attackRangeRadius: 655,
            streamMode: false,
            isDoubleSplitRange: false
        },
        themeList = {
            "pion": {
                name: "Pion Theme",
                mainColor: "#0849d4",
                bgColor: "#000000",
                foodColor: "#0849d4",
                gridColor: "#1A1A1A",
                bordersColor: "#0849d4",
                virusColor: "#666666",
                virusStrokeColor: "#666666",
            },
            "green_style": {
                name: "Green Theme",
                mainColor: "#02b5bc",
                bgColor: "#111111",
                gridColor: "#1d1d1d",
                bordersColor: "#005e62",
                foodColor: "#005e62",
                virusColor: "#111111",
                virusStrokeColor: "#02b5bc",
            },
            "hkg-style": {
                name: "HKG Style",
                mainColor: "#651fff",
                bgColor: "#000000",
                gridColor: "#1A1A1A",
                bordersColor: "#ffffff",
                foodColor: "#651fff",
                virusColor: "#666666",
                virusStrokeColor: "#666666",
            },
            "ZT V2": {
                name: "ZT V2",
                mainColor: "#0849d4",
                bgColor: "#000000",
                gridColor: "#111111",
                bordersColor: "#ffffff",
                foodColor: "#0849d4",
                virusColor: "#333333",
                virusStrokeColor: "#333333",
                    
            }
        },
    /* ================ 主題預設值 =============== */
        Theme_defaultset = {
            preset: "pion",
            normalLb: false,
            fpsAtTop: false,
            ztMap: true,
            centeredLb: true,
            MapImgURL: "",
            mainColor: "#0849d4",
            bgColor: "#000000",
            gridColor: "#292929",
            bordersColor: "#02b5bc",
            foodColor: "#0849d4",
            commandsTextColor: "#ffffff",
            commanderColor: "#55FF55",
            virusColor: "#666666",
            virusStrokeColor: "#666666",
            customBackground: "",
            font: "Arial",
            mapLine: 0,
            sectorsX: 5,
            sectorsY: 5,
            bordersWidth: 20,
            sectorsWidth: 40,
            cellsAlpha: 0.9,
            skinsAlpha: 0.7,
            virusAlpha: 0.6
        };

    PlayerSet.prototype = {
        id: 0,
        skinID: "",
        x: 0,
        y: 0,
        lastX: 0,
        lastY: 0,
        mass: 0,
        clanTag: "",
        nick: "",
        nickImg: null,
        skinURL: "",
        color: theme.mainColor,
        alive: false,
        updateTime: null,
        pi2: 2 * Math.PI,

        /* ================ 繪製小地圖點點 =============== */
        drawPosition: function(ctx, offset, _scale) {
            if(this.alive) {
                this.lastX = (29 * this.lastX + this.x) / 30, this.lastY = (29 * this.lastY + this.y) / 30;
                var posX = (this.lastX + offset) * _scale,
                    posY = (this.lastY + offset) * _scale;
                if(this.nick.length) {
                    ctx.fillStyle = Theme_defaultset.ztMap ? "#FFC0CB" : "#FFFFFF";
                    //ctx.fillText(this.nick, posX, posY - 10);
                    console.log("繪製小地圖點點");
                };
                ctx.beginPath();
                ctx.arc(posX, posY, 5, 0, 2 * Math.PI, false);
                ctx.closePath();
                ctx.fillStyle = Theme_defaultset.ztMap ? "#448AFF" : this.color;
                if(this.nick == "ENERMY #1") {
                    ctx.fillStyle = "#FF0000";
                }
                ctx.fill();
            }
        }
    };
    ThemeSet.prototype = {
        customStyle: null,
        loadThemeSettings: function() {
            var theme_setting = null;
            null !== window.localStorage.getItem ("PP_ThemeSettings") && (theme_setting = JSON.parse (window.localStorage.getItem ("PP_ThemeSettings")));
            for (var e in Theme_defaultset) {
                Theme_defaultset.hasOwnProperty (e) && (theme_setting && theme_setting.hasOwnProperty (e) && (Theme_defaultset[e] = theme_setting[e]), P.hasOwnProperty (e) && (P.e = Theme_defaultset[e]))
            }
        },
        /* ================ 設定Theme分頁相關 =============== */
        setThemeMenu: function() {
            var _this = this;
            Q("#theme").append (
                '<div class="color-box theme-box"><span class="title">' + Dict[lan].themePreset + '</span><select id="theme-presets" class="form-control"></select></div> ' +
                '<div class="map-box"><span class="title">' + Dict[lan].mapPreset + '</span><select id="map_font" class="form-control"></select><select id="map_line" class="form-control"></select></div> ' +
                '<div class="color-box"><span class="title">' + Dict[lan].mainColor + '</span><div class="input-group main-color-picker"><input type="text" value="' + Theme_defaultset.mainColor + '" id="mainColor" class="form-control" /><span class="input-group-addon"><i></i></span></div></div> ' +
                '<div class="color-box"><span class="title">' + Dict[lan].bgColor + '</span><div class="input-group background-color-picker"><input type="text" value="' + Theme_defaultset.bgColor + '" id="bgColor" class="form-control" /><span class="input-group-addon"><i></i></span></div></div> ' +
                '<div class="color-box"><span class="title">' + Dict[lan].foodColor + '</span><div class="input-group food-color-picker"><input type="text" value="' + Theme_defaultset.foodColor + '" id="foodColor" class="form-control" /><span class="input-group-addon"><i></i></span></div></div> ' +
                '<div class="color-box"><span class="title">' + Dict[lan].gridColor + '</span><div class="input-group grid-color-picker"><input type="text" value="' + Theme_defaultset.gridColor + '" id="gridColor" class="form-control" /><span class="input-group-addon"><i></i></span></div></div> ' +
                '<div class="color-box"><span class="title">' + Dict[lan].bordersColor + '</span><div class="input-group borders-color-picker"><input type="text" value="' + Theme_defaultset.bordersColor + '" id="bordersColor" class="form-control" /><span class="input-group-addon"><i></i></span></div></div> ' +
                '<div class="color-box"><span class="title">' + Dict[lan].commanderColor + '</span><div class="input-group comm-color-picker"><input type="text" value="' + Theme_defaultset.commanderColor + '" id="commanderColor" class="form-control" /><span class="input-group-addon"><i></i></span></div></div> ' +
                '<div class="color-box"><span class="title">' + Dict[lan].virusColor + '</span><div class="input-group vir-color-picker"><input type="text" value="' + Theme_defaultset.virusColor + '" id="virusColor" class="form-control" /><span class="input-group-addon"><i></i></span></div></div>' +
                '<div class="color-box"><span class="title">' + Dict[lan].virusStrokeColor + '</span><div class="input-group virStroke-color-picker"><input type="text" value="' + Theme_defaultset.virusStrokeColor + '" id="virusStrokeColor" class="form-control" /><span class="input-group-addon"><i></i></span></div></div>' +
                '<div class="color-box theme-box"><span class="title">' + Dict[lan].customBackground + '</span><input id="custom-background" class="form-control" placeholder="Image URL" value="' + Theme_defaultset.customBackground + '" /></div>'+
                '<div id="MapImgCenter" class="color-box theme-box"><span class="title">' + Dict[lan].ImgMap + '</span><input id="ImgMap" class="form-control" placeholder="Image URL" value="' + Theme_defaultset.MapImgURL + '" /></div>');
            for (var item in themeList) {
                themeList.hasOwnProperty (item) && Q("#theme-presets").append ('<option value="' + item + '">' + themeList[item].name + '</option>')
            };
            Q("#map_font").append ('<option value="Arial">Arial</option><option value="Ubuntu">Ubuntu</option><option value="Serif">Serif</option><option value="oswald">Oswald</option>');
            Q("#map_line").append ('<option value="0">' + "Default Line" + '</option><option value="1">' + "Color Line" + '</option>');
            Q("#theme-presets").val (Theme_defaultset.preset);
            Q("#theme-presets").change (function() {
                var selectedTheme = Q(this).val ();
                _this.changeThemePreset (selectedTheme)
            });
            Q("#map_font").val (Theme_defaultset.font);
            Q("#map_line").val (Theme_defaultset.mapLine);
            Q("#map_font").change (function() {
                var font = Q(this).val ();
                _this.changeMapFont (font);
            });
            Q("#map_line").change (function() {
                var line = Q(this).val ();
                _this.changeMapLine (line);
            });
            Q("#theme .main-color-picker").colorpicker ({
                format: "hex"
            }).on ("changeColor.colorpicker", function(e) {
                Theme_defaultset.mainColor = e.color.toHex (), _this.setMainColor ()
            }), Q("#theme .background-color-picker").colorpicker ({
                format: "hex"
            }).on ("changeColor.colorpicker", function(e) {
                Theme_defaultset.bgColor = e.color.toHex (), Q("body").css ("background-color", Theme_defaultset.bgColor)
            }), Q("#theme .food-color-picker").colorpicker ({
                format: "hex"
            }).on ("changeColor.colorpicker", function(e) {
                Theme_defaultset.foodColor = e.color.toHex (), P.foodColor = Theme_defaultset.foodColor,f.predrawPellet()
            }), Q("#theme .grid-color-picker").colorpicker ({
                format: "hex"
            }).on ("changeColor.colorpicker", function(e) {
                Theme_defaultset.gridColor = e.color.toHex ()
            }), Q("#theme .borders-color-picker").colorpicker ({
                format: "hex"
            }).on ("changeColor.colorpicker", function(e) {
                Theme_defaultset.bordersColor = e.color.toHex ()
            }), Q("#theme .comm-color-picker").colorpicker ({
                format: "hex"
            }).on ("changeColor.colorpicker", function(e) {
                Theme_defaultset.commanderColor = e.color.toHex ()
            }), Q("#theme .vir-color-picker").colorpicker ({
                format: "hex"
            }).on ("changeColor.colorpicker", function(e) {
                Theme_defaultset.virusColor = e.color.toHex (), P.virusColor = Theme_defaultset.virusColor
            }), Q("#theme .virStroke-color-picker").colorpicker ({
                format: "hex"
            }).on ("changeColor.colorpicker", function(e) {
                Theme_defaultset.virusStrokeColor = e.color.toHex (), P.virusStrokeColor = Theme_defaultset.virusStrokeColor
            }),
                Q("#theme").append ('<div id=\"theme-options\"><label><input type=\"checkbox\" onchange=\"setThemeSettings(\'centeredLb\', $(this).is(\':checked\'));\" id=\"centeredLb\">' + Dict[lan].centeredLb + '</label><label><input type=\"checkbox\" onchange=\"setThemeSettings(\'normalLb\', $(this).is(\':checked\'));\" id=\"normalLb\">' + Dict[lan].normalLb + '</label><label><input type=\"checkbox\" onchange=\"setThemeSettings(\'fpsAtTop\', $(this).is(\':checked\'));\" id=\"fpsAtTop\">' + Dict[lan].fpsAtTop + '</label><label><input type=\"checkbox\" onchange=\"setThemeSettings(\'ztMap\', $(this).is(\':checked\'));\" id=\"ztMap\">' + Dict[lan].ztMap + '</label></div>'),
                Q("#theme").append ('<button class="btn btn-block btn-success btn-save" onclick="saveThemeSettings();">' + Dict[lan].saveSett + '</button>'),
                Q("#custom-background").change (function() {
                    var bgImg = Q(this).val ();
                    Q("body").css ("background-image", "url(" + bgImg + ")");
                    Theme_defaultset.customBackground = bgImg
                }),
                Q("#ImgMap").change (function() {
                    Theme_defaultset.MapImgURL = Q(this).val ();
                    f.MapImg = new Image;
                    f.MapImg.src = Theme_defaultset.MapImgURL;
                }),
                Q(".skin").colorpicker ({
                    format: "hex",
                    input: "#color"
                }), this.setOptions ()
        },
        setOptions: function() {
            Q("#centeredLb").prop ("checked", Theme_defaultset.centeredLb);
            Q("#normalLb").prop ("checked", Theme_defaultset.normalLb);
            Q("#fpsAtTop").prop ("checked", Theme_defaultset.fpsAtTop);
            Q("#ztMap").prop ("checked", Theme_defaultset.ztMap);
        },
        setMainColor: function() {
            this.customStyle || (this.customStyle = Q("<style type='text/css'>").appendTo ("head")), this.customStyle.html (".main-color, .menu-tabs .active, center, #cancel-party-btn { color: " + Theme_defaultset.mainColor + "; } #main-menu, .agario-side-panel { border-color: " + Theme_defaultset.mainColor + "} .toast-warning { background-color: " + Theme_defaultset.mainColor + "; } .toast-warning .toast-message { color: " + Theme_defaultset.commandsTextColor + "; } .sender {color: " + Theme_defaultset.mainColor + ";} ")
        },
        setCenteredLb: function() {
            Theme_defaultset.centeredLb ? Q("#leaderboard-hud").addClass ("hud-text-center") : Q("#leaderboard-hud").removeClass ("hud-text-center")
        },
        setNormalLb: function() {
            Q("#leaderboard-hud h4").html (Theme_defaultset.normalLb ? "Leaderboard" : "Pion Plus")
        },
        setFpsAtTop: function() {
            Theme_defaultset.fpsAtTop ? Q("#stats-hud").removeClass ("hud-bottom").addClass ("hud-top") : Q("#stats-hud").removeClass ("hud-top").addClass ("hud-bottom")
        },
        changeThemePreset: function(preset_set) {
            if (themeList[preset_set]) {
                Theme_defaultset.preset = preset_set;
                var selected = themeList[preset_set];
                for (var e in selected) {
                    selected.hasOwnProperty (e) && Theme_defaultset.hasOwnProperty (e) && (Theme_defaultset[e] = selected[e], P.hasOwnProperty (e) && (P[e] = Theme_defaultset[e]))
                };
                this.setTheme (),
                    Q("#theme .main-color-picker").colorpicker ("setValue", Theme_defaultset.mainColor),
                    Q("#theme .background-color-picker").colorpicker ("setValue", Theme_defaultset.bgColor),
                    Q("#theme .food-color-picker").colorpicker ("setValue", Theme_defaultset.foodColor),
                    Q("#theme .grid-color-picker").colorpicker ("setValue", Theme_defaultset.gridColor),
                    Q("#theme .borders-color-picker").colorpicker ("setValue", Theme_defaultset.bordersColor),
                    Q("#theme .comm-color-picker").colorpicker ("setValue", Theme_defaultset.commanderColor),
                    Q("#theme .vir-color-picker").colorpicker ("setValue", Theme_defaultset.virusColor),
                    Q("#theme .virStroke-color-picker").colorpicker ("setValue", Theme_defaultset.virusStrokeColor)
            }
        },
        changeMapFont: function(font) {
            Theme_defaultset.font = font;
            window.saveThemeSettings();
        },
        changeMapLine: function(mapLine) {
            Theme_defaultset.mapLine = mapLine;
            window.saveThemeSettings();
        },
        setTheme: function() {
            this.setOptions ();
            this.setMainColor ();
            this.setCenteredLb ();
            this.setNormalLb ();
            this.setFpsAtTop ();
            f && f.resetMiniMapSectors ();
            P.virusColor = Theme_defaultset.virusColor;
            P.virusStrokeColor = Theme_defaultset.virusStrokeColor;
            Q("body").css ("background-color", Theme_defaultset.bgColor);
            Q("body").css ("background-image", "url(" + Theme_defaultset.customBackground + ")");
        },
        init: function() {
            this.loadThemeSettings ()
        }
    };
    var _ThemeSet = new ThemeSet;
    _ThemeSet.init ();
    window.setThemeSettings =  function(a, b) {
        if (Theme_defaultset.hasOwnProperty (a) && null !== b) {
            switch (Theme_defaultset[a] = b, a) {
                case "centeredLb":
                    _ThemeSet.setCenteredLb ();
                    break;
                case "normalLb":
                    _ThemeSet.setNormalLb ();
                    break;
                case "fpsAtTop":
                    _ThemeSet.setFpsAtTop ();
                    break;
                case "ZT_style_map":
                    f && f.setMiniGrid ();
                    break;
            }
        }
    };
    window.saveThemeSettings = function() {
        f && f.saveSettings (Theme_defaultset, "PP_ThemeSettings")
    };

    /* ================ 聊天室 =============== */
    ChatRoom.prototype = {
        width: 340,
        height: 350,
        createChatBox: function() {
            Q("body").append('<div id="chatroom"></div>');
            Q("body").append('<div id="chatboxArea2"><input id="message" type="text"></input></div>');
            Q("#chatboxArea2").hide();
            var _this = this;
            Q("#chatroom").mouseup(function() {
                _this.resize();
            });
        },
        resize: function() {
            if (Q("#chatroom").width() != this.width || Q("#chatroom").height() != this.height) {
                if (Q("#chatroom").perfectScrollbar) {
                    Q("#chatroom").perfectScrollbar("update");
                }
            }
        },
        enter: function() {
            if (this.isFocus()) {
                Q("#message").val().length && f && f.sendChatMessage(101, Q("#message").val());
                Q("#message").val("");
                Q("#message").blur();
                Q("#chatboxArea2").hide();
            } else {
                this.focus();
            }
        },
        show: function() {
            Q("#chatroom").show();
            this.scrollDown();
        },
        hide: function() {
            Q("#chatroom").hide();
        },
        isFocus: function() {
            return Q("#message").is(":focus");
        },
        focus: function() {
            Q("#chatboxArea2").show();
            Q("#message").focus();
        },
        getTimeStr: function() {
            var now = new Date;
            var index = now.getMinutes();
            return index = 10 > index ? "0" + index : index, now.getHours() + ":" + index + " ";
        },
        receiveMessage: function(msg, message) {
            var tabContent = Q("<div/>");
            var time = Q("<span class='time'>").text(this.getTimeStr());
            var sender = Q("<span class='sender'>").text(msg + " : ");
            tabContent.append(time);
            tabContent.append(sender);
            time = Q("<span class='msg'>").text(message);
            tabContent.append(time);
            Q("#chatroom").append(tabContent);
            this.scrollDown();
        },
        scrollDown: function() {
            if (Q("#chatroom").perfectScrollbar) {
                Q("#chatroom").scrollTop(Q("#chatroom").prop("scrollHeight"));
                Q("#chatroom").perfectScrollbar("update");
            }
        },
        createScrollBar: function() {
            Q("#chatroom").perfectScrollbar({
                minScrollbarLength : 50,
                suppressScrollX : false
            });
        },
        init: function() {
            this.createChatBox ();
            this.createScrollBar();
            GameSetting.chatbox ? chatRoom.show() : chatRoom.hide();
        }
    };

    var chatRoom = new ChatRoom;

    /* ================ 插件主功能都在這 =============== */
    SettingsDefault.prototype = {
        name: "Clcok Plus",
        version: "v1.8.2",
        publicIP: "ws://164.132.227.101:3000",
        privateMode: !1,
        updateInterval: 1e3,
        updateTick: 0,
        updateMaxTick: 2,
        partys: [],
        teamPlayers: [],
        customSkinsMap: {},
        selectedProfile: 0,
        playerMass: 0,
        rFps: 0,
        renderedFrames: 0,
        retryResp: 0,
        canvasScale: 1,
        commanderSize: 764,
        lastMessageSend: Date.now (),
        lastCmdSend: Date.now (),
        pi2: 2 * Math.PI,
        currentSector: "",
        gameMode: "",
        _region: "",
        partyToken: "",
        MapImg: new Image,
        privateIP: null,
        miniMap: null,
        miniMapCtx: null,
        top5HUD: null,
        socket: null,
        playerID: null,
        statsHUD: null,
        miniMapSectors: null,
        activePartys: null,
        feedInterval: null,
        fpsLastRequest: null,
        leaderboardPositionsHUD: null,
        focusTarget: [{
            enable: false,
            name: "",
            mass: 0,
            scrollX: 0,
            scrollY: 0,
            num: 0,
            sumMass: 0,
        }, {
            enable: false,
            name: "",
            mass: 0,
        }],
        selectBiggestCell: true,
        showMass:   true,
        noSkins:    false,
        noNames:    false,
        noColors:   false,
        skipStats:  true,
        showSplitInd: false,
        pause: false,
        getPlayerX: function() {
            return P.playerX + P.mapOffsetX
        },
        getPlayerY: function() {
            return P.playerY + P.mapOffsetY
        },
        getCursorX: function() {
            return P.cursorX + P.mapOffsetX
        },
        getCursorY: function() {
            return P.cursorY + P.mapOffsetY
        },
        feed: function(){
            window.core && window.core.eject && window.core.eject()
        },
        macroFeed: function(e) {
            if (e) {
                if (this.feedInterval)
                    return
                window.core && window.core.eject && window.core.eject(), this.feedInterval = setInterval(function() {
                    window.core && window.core.eject && window.core.eject()
                }, 80)
            } else {
                this.feedInterval && (clearInterval(this.feedInterval), this.feedInterval = null)
            }
        },
        split: function() {
            window.core && window.core.split && window.core.split ()
        },
        doubleSplit: function() {
            var _this = this;
            _this.split (), setTimeout(function() {
                _this.split ()
            }, 40)
        },
        tripleSplit: function() {
            var _this = this;
            _this.split (), setTimeout(function() {
                window.split ()
            }, 40), setTimeout(function() {
                _this.split ()
            }, 80)
        },
        quickSplit: function() {
            var _this = this;
            _this.split (), setTimeout(function() {
                _this.split ()
            }, 40), setTimeout(function() {
                _this.split ()
            }, 80), setTimeout(function() {
                _this.split ()
            }, 120)
        },
        //切換計算增強色/增強環時之依據(最大球/最小球) 我把這功能閹了 強制大球
        toggleCells: function() {
            this.selectBiggestCell = !this.selectBiggestCell, P.selectBiggestCell = this.selectBiggestCell
        },
        setTop5: function() {
            GameSetting.showTop5 && ":party" === this.gameMode ? Q("#top5-hud").show () : Q("#top5-hud").hide ()
        },
        setHideSmallBots: function() {
            P.hideSmallBots = !P.hideSmallBots, this.displayChatInfo (!P.hideSmallBots, "hideSmallBotsMsg")
        },
        /*
         setShowNames: function() {
         this.showNames = !this.showNames, window.core && window.core.setNames && window.core.setNames (!this.showNames)
         },
         setShowMass: function() {
         this.showMass = !this.showMass, window.core && window.core.setShowMass && window.core.setShowMass (this.showMass)
         },
         */
        setMiniMap: function() {
            GameSetting.showMiniMap ? Q("#minimap-hud").show () : Q("#minimap-hud").hide ()
        },
        resetZoom: function(e) {
            e ? (P.zoomResetValue = 1, P.zoomValue = 1) : P.zoomResetValue = 0
        },
        setZoom: function(e) {
            P.zoomValue = e
        },
        //快速重生防呆用 有時會卡住
        tryResp: function() {
            if (P.play || 20 == this.retryResp) {
                return void((this.retryResp = 0))
            };
            this.retryResp++;
            var _this = this;
            setTimeout(function() {
                Q(".btn-play").click (), P.play || _this.tryResp ()
            }, 250)
        },
        //快速重生
        quickResp: function() {
            this.gameMode === ":party" && Q("#join-party-btn").click (), P.play = !1, this.tryResp ()
        },
        //複製遊戲資訊
        copyGameInfo: function() {
            this.gameInfo_refresh();
            var Game_Info = "";
            var _partycode = "";
            var _tag = Q("#clantag").val();
            var temp = Q(".partyToken").val();
            var _lbInfo = P.leaderBoardInfo;
            if(temp == "")
                _partycode = "N/A";
            else
                _partycode = temp.split("/")[1];
            Game_Info += "Region : " + this._region + "<br>";
            Game_Info += "Game mode : " + this._gamemode + "<br>";
            Game_Info += "Party Code : " + _partycode + "<br>";
            Game_Info += "Team Tag : " + _tag + "<br>";
            if(_lbInfo.length != 0) {
                for (var i = 1; i <= 10; i++) {
                    Game_Info += _lbInfo[i] + "<br>";
                }
            };
            //複製內容用
            var copyDiv = document.createElement('div');
            copyDiv.contentEditable = true;
            document.body.appendChild(copyDiv);
            copyDiv.innerHTML = Game_Info;
            copyDiv.unselectable = "off";
            copyDiv.focus();
            document.execCommand('SelectAll');
            document.execCommand("Copy", false, null);
            document.body.removeChild(copyDiv);

        },
        //刷新右上角那個遊戲資訊 現行機制有點呆 考慮優化
        gameInfo_refresh: function() {
            this._region = window.MC.getRegion();
            this._gamemode = Q("#gamemode :selected").text ();;
            var _partycode = "", temp = Q(".partyToken").val();
            var exp = Q(".agario-exp-bar .progress-bar-text").text();
            var level = Q(".agario-profile-panel .progress-bar-star").text();
            var xp = exp.split("/")[0];
            var xpNeeded = (exp.split("/")[1]).split(" ")[0];
            var percent = ~~(xp/xpNeeded*100);
            switch(this._region) {
                case "US-Atlanta":
                    this._region = "North America";
                    break;
                case "BR-Brazil":
                    this._region = "South America";
                    break;
                case "EU-London":
                    this._region = "Europe";
                    break;
                case "RU-Russia":
                    this._region = "Russia";
                    break;
                case "TK-Turkey":
                    this._region = "Turkey";
                    break;
                case "JP-Tokyo":
                    this._region = "East Asia";
                    break;
                case "CN-China":
                    this._region = "China";
                    break;
                case "SG-Singapore":
                    this._region = "Oceania";
                    break;
                default:
                    this._region = "N/A";
            };
            if(temp == "")
                _partycode = "N/A";
            else
                _partycode = temp.split("/")[1];
            Q("#region_info").text ("Region : " + this._region);
            Q("#gamemode_info").text ("Game mode : " + this._gamemode);
            Q("#party_code_info").text ("Party Code : " + _partycode);
            Q("#level").html ("Lv. " + level + "<br/> EXP: " + xp + "/" + xpNeeded);
            Q("#progress-bar").css("width", percent + "%");
        },
        //提示使用者某些功能開啟/關閉
        displayChatInfo: function(option, optext) {
            option ? toastr.info (Dict[lan][optext + "A"]) : toastr.error (Dict[lan][optext + "B"])
        },
        loadSettings: function() {
            var ogario_Settings = null;
            null !== window.localStorage.getItem ("PP_settings") && (ogario_Settings = JSON.parse (window.localStorage.getItem ("PP_settings")));
            for (var t in GameSetting) {
                GameSetting.hasOwnProperty (t) && (ogario_Settings && ogario_Settings.hasOwnProperty (t)) && (GameSetting[t] = ogario_Settings[t]), P.hasOwnProperty (t) && (P[t] = GameSetting[t])
            }
        },
        saveSettings: function(keyValue, keyName) {
            window.localStorage.setItem (keyName, JSON.stringify (keyValue))
        },
        loadProfiles: function() {
            if (null !== window.localStorage.getItem ("ogarioPlayerProfiles")) {
                player_profile = JSON.parse (window.localStorage.getItem ("ogarioPlayerProfiles"))
            } else {
                for (var num = 1; num < 11; num++) {
                    player_profile.push ({
                        nick: "Profile #" + num ,
                        clanTag: "",
                        skinURL: "",
                        color: theme.mainColor
                    })
                }
            };
            null !== window.localStorage.getItem ("PP_selectedProfile") && (this.selectedProfile = JSON.parse(window.localStorage.getItem ("PP_selectedProfile")));
            profile.nick    = player_profile[this.selectedProfile].nick;
            profile.clanTag = player_profile[this.selectedProfile].clanTag;
            profile.skinURL = player_profile[this.selectedProfile].skinURL;
            profile.color   = player_profile[this.selectedProfile].color;
        },
        setSkinPreview: function(skinURL) {
            Q("#skin-preview").empty ().addClass ("skin-preview-default");
            if (skinURL.length) {
                var skinPrev = new Image;
                skinPrev.onload = function() {
                    Q("#skin-preview").removeClass ("skin-preview-default").append (Q(skinPrev).fadeIn (315))
                }, skinPrev.src = skinURL
            }
        },
        setProfile: function() {
            this.setSkinPreview (player_profile[this.selectedProfile].skinURL)
            Q("#nick").val (player_profile[this.selectedProfile].nick);
            Q("#clantag").val (player_profile[this.selectedProfile].clanTag);
            Q("#skin").val (player_profile[this.selectedProfile].skinURL);
            Q("#color").val (player_profile[this.selectedProfile].color);
            Q(".skin").colorpicker ("setValue", player_profile[this.selectedProfile].color)
        },
        prevProfile: function() {
            this.setPlayerSettings (), this.selectedProfile = (player_profile.length + this.selectedProfile - 1) % player_profile.length, this.setProfile ()
        },
        nextProfile: function() {
            this.setPlayerSettings (), this.selectedProfile = (this.selectedProfile + 1) % player_profile.length, this.setProfile ()
        },

        /* ================ 介面主要相關 =============== */
        setMenu: function() {
            var _settingDF = this;
            document.title = "Pion Plus",
                Q("#mainPanel").before ('<div id="main-menu" class="agario-panel"><ul class="menu-tabs en">' +
                    '<li id="starttab" class="start-tab active"><a href="#main-panel" class="active">&#x1F3E0;</a></li>' +
                    '<li class="settings-tab"><a href="#og-settings">' + Dict[lan].settings + '</a></li>' +
                    '<li class="hotkeys-tab"><a href="#" class="hotkeys-link">' + Dict[lan].hotkeys + '</a></li>'+
                    '<li class="theme-tab"><a href="#theme">' + Dict[lan].theme + '</a></li>' +
                    '<li class="profile-tab"><a href="#profile">Extra</a></li></ul>' +
                    '<div id="main-panel" class="menu-panel"></div>' +
                    '<div id="profile" class="menu-panel"></div>' +
                    '<div id="og-settings" class="menu-panel"></div>' +
                    '<div id="theme" class="menu-panel"></div></div>'),
                Q("#main-panel").append ('<div id="profiles"><div class="nav2 arrow-left"></div><div id="skin-preview"></div><div class="nav2 arrow-right"></div></div>'),
                Q("#mainPanel div[role=form]").appendTo (Q("#main-panel")),
                Q("#main-panel div[role=form] .form-group:first").remove (),
                Q("#nick").before ('<input id="clantag" class="form-control" placeholder="Tag" maxlength="10" /><div class="input-group nick"></div>'),
                Q("#nick").appendTo (Q(".nick")),
                Q(".nick").after ('<div class="input-group skin"><input id="skin" class="form-control" placeholder="Skin URL (imgur.com direct link)"  maxlength="60" /><input type="hidden" id="color" value="' + profile.color + '" maxlength="7" /><span class="input-group-addon"><i></i></span></div>'),
                Q("#locationKnown, #locationUnknown").insertAfter (Q(".skin")),
                Q("#locationUnknown").prepend('<button id="stream-mode" class ="btn">OFF</button>'),
                Q(".btn-spectate, .btn-logout").appendTo ("#agario-main-buttons"),
                Q("#agario-main-buttons").append('<br clear="both"/>'),
                Q("#helloContainer div[role=form]").after ('<div id="ogario-party"><input id="joinPartyToken" class="partyToken form-control" placeholder="Party token" /></div>'),
                Q("#ogario-party").append(Q("#join-party-btn")).append(Q("#create-party-btn")),
                Q("#create-party-btn").addClass ("btn-success"),
                Q("#ogario-party").append ('<button id="og-reconnect-btn" class="btn btn-success">&#x1F504;</button>'),
                Q("#settingsChoice, #options").appendTo (Q("#og-settings")),
                Q("#stats").appendTo (Q("#main-menu")).addClass ("menu-panel"),
                Q("#statsContinue").attr ("id", "statsContinue2"),
                Q("#mainPanel").empty ().remove (),
                Q("#leftPanel, #rightPanel").removeAttr ("id"),
                Q(".agario-profile-panel, .agario-panel-freecoins").appendTo (Q("#profile")).removeClass ("agario-side-panel"),
                Q(".left-container, .right-container").empty (),
                Q(".agario-panel-freecoins").after ('<div class="agario-panel ogario-yt-panel"><h5 class="main-color">Pion Plus</h5><div class="g-ytsubscribe" data-channelid="UCc5yrTIHPE-2ntWfvDhkRKw" data-layout="full" data-theme="dark" data-count="default"></div></div>'),
                Q("#tags-container, #promo-badge-container, #skinButton,.agario-shop-panel,.agario-party h4, #cancel-party-btn").remove (),
                Q(".agario-party-6").appendTo (Q(".center-container")),
                Q(".right-container").append ('<div class="agario-party"></div>'),
                Q(".agario-party-6").appendTo (Q(".agario-party")),
                Q(".agario-profile-panel").hide(),
                Q("#profile").append ('<label><input type=\"checkbox\" onchange=\"setlanguage(\'' + "trch" + '\', $(this).is(\':checked\'));\" id=\"trch\">' + "繁體中文" + '</label><label><input type=\"checkbox\" onchange=\"setlanguage(\'' + "simpch" + '\', $(this).is(\':checked\'));\" id=\"simpch\">' + "简体中文" + '</label>'),
                Q(".btn-settings, .text-muted, .tosBox, .agario-promo, #agario-web-incentive").remove (),
                Q("#options #darkTheme").parent().remove(),
                Q("#advertisement, #adbg, #a320x250, #g320x250, #s320x250, #adsBottom").css ("display", "none"),
                Q("#advertisement").removeClass ("agario-panel"),
                Q(".agario-party").addClass ("agario-side-panel").removeClass ("agario-party-6"),
                Q(".agario-party").html('<div id="game_info">' + '<p id="region_info"></p>' + '<p id="gamemode_info"></p>' + '<p id="party_code_info"></p>' + '<p id="lb_info"></p>' + '</div>' + '<button id ="btn_copy_gameinfo" class="btn btn-block"><span>' + Dict[lan].copy + '</span></button>' +
                    '<div id="expbar"><div id="level" style="padding:3px;">LV.</div><div id="exp_progreee_bar" style="width:168px; height:13px; border:2px solid #64c1ce;"> <div id="progress-bar" style="width:50%;height:9px;background-color:#2d9aa6;"> </div> </div></div>'),
                Q("#og-settings").prepend('<input id="zoom-speed" type="range" min="0.79" max="0.99" step="0.01" value="' + GameSetting.zoomSpeedValue + '"><div id="zoom-speed-value">Zoom speed: ' + GameSetting.zoomSpeedValue + '</div>'),
                Q("#adsBottom").css ({
                    "z-index": "1",
                    opacity: "0",
                    bottom: "-100px"
                }),
                Q("#zoom-speed").on ("change", function() {
                    var zoomValue = Q(this).val ();
                    GameSetting.zoomSpeedValue = zoomValue,
                        P.zoomSpeedValue = zoomValue,
                        Q("#zoom-speed-value").html ("Zoom speed: " + zoomValue),
                        _settingDF.saveSettings (GameSetting, "PP_settings")
                }),
                Q("#og-settings").append ('<div id="og-options"></div>');
            //添加選項
            for (var o in GameSetting) {
                if (GameSetting.hasOwnProperty (o)) {
                    if ("zoomSpeedValue" === o) {
                        break
                    };
                    Q("#og-options").append ('<label><input type=\"checkbox\" onchange=\"setSettings(\'' + o + '\', $(this).is(\':checked\'));\" id=\"' + o + '\">' + Dict[lan][o] + '</label>')
                }
            };
            //套用打勾與否
            Q("#og-settings input:checkbox").each (function() {
                var cid = Q(this).attr ("id");
                GameSetting.hasOwnProperty (cid) && Q(this).prop ("checked", GameSetting[cid])
            }),
                (Q("#skipStats").parent()).before(Q("#showFood").parent()),
            _ThemeSet && _ThemeSet.setThemeMenu (),
                //添加Menu之外的那些框框
                Q("body").append ('<div id="overlays-hud"> <div id="stats-hud" class="hud"></div> <div id="top5-hud" class="hud"><h5 class="main-color">Team top 5</h5><ol id="top5p-hud"></ol></div> <div id="pause-hud">' + "PAUSE!" + '</div> <div id="leaderboard-hud" class="hud"><h4 class="main-color">Pion Plus</h4><div id="leaderboard-positions"></div></div> <div id="minimap-hud"><canvas id="minimap-sectors"></canvas><canvas id="minimap"></canvas></div><div id="debugg"></div><div id="focusHud"><div id="focus_hud1"></div><div id="focus_hud2"></div></div></div>'),
                Q("body").append ('<ul id="messages"></ul>'),
                toastr.options = {
                    newestOnTop: !1,
                    positionClass: "toast-bottom-left",
                    timeOut: "15000"
                },
                //監聽點擊事件
                Q(document).ready (function() {
                    Q(".menu-tabs a").click (function(e) {
                        e.preventDefault ();
                        var _this = Q(this);
                        if(_this.hasClass ("hotkeys-link")) {
                            return void(showHotkeys)()
                        };
                        _this.addClass ("active");
                        _this.parent ().addClass ("active");
                        _this.parent ().siblings ().removeClass ("active");
                        _this.parent ().siblings ().find ("a").removeClass ("active");
                        var _herf = _this.attr ("href");
                        Q(".menu-panel").not(_herf).css ("display", "none");
                        Q(_herf).fadeIn ();
                        HelloContainResize();
                    })
                }), Q("#gamemode").on ("change", function() {
                _settingDF.gameMode = P.gameMode = this.value, ":party" !== this.value && _settingDF.isSocketOpen () && (_settingDF.socket.close (), Q(".partyToken").val ("")), _settingDF.setTop5 (), _settingDF.gameInfo_refresh ()
            }), Q("#skin").on ("input", function() {
                var skin = Q(this).val ();
                _settingDF.setSkinPreview (skin)
            }), Q(".arrow-left").on ("click", function() {
                _settingDF.prevProfile ()
            }), Q(".arrow-right").on ("click", function() {
                _settingDF.nextProfile ()
            }), Q("#canvas").bind ("contextmenu", function() {
                return false;
            }), Q("#stream-mode").on ("click", function() {
                GameSetting.streamMode = !GameSetting.streamMode, _settingDF.saveSettings (GameSetting, "PP_settings"), _settingDF.setStreamMode ()
            }), this.statsHUD = document.getElementById ("stats-hud"), this.activePartys = document.getElementById ("activepartys"), this.top5pHUD = document.getElementById ("top5p-hud"), this.leaderboardPositionsHUD = document.getElementById ("leaderboard-positions")
        },
        //取得agar原先選項與相關設置
        getDefaultSettings: function() {
            this.noSkins = Q("#noSkins").is (":checked");
            this.noNames = Q("#noNames").is (":checked");
            this.noColors = Q("#noColors").is (":checked");
            this.showMass = Q("#showMass").is (":checked");
            this.skipStats = Q("#skipStats").is (":checked");
            P.showCustomSkins = !this.noSkins;
            var seting = this;
            if (Q("#options input").on ("click", function() {
                    var _this = Q(this),
                        checkID = _this.attr ("id");
                    void(0) !== seting[checkID] && (seting[checkID] = _this.is (":checked"), "noSkins" === checkID && (P.showCustomSkins = !seting.noSkins))
                }), Q("#quality").on ("change", function() {
                    var qt = Q(this).val ();
                    seting.getQuality (qt)
                }), null !== window.localStorage.getItem ("scale_setting")) {
                var _scale_setting = JSON.parse (window.localStorage.getItem ("scale_setting"));
                this.setCanvasScale (_scale_setting)
            } else {
                var quality = Q("#quality").val ();
                this.getQuality (quality)
            };
            this.setParty (), ":party" === f.gameMode && window.location.hash && Q("#join-party-btn").click ()
        },
        getQuality: function(qt) {
            var Pixel = "devicePixelRatio" in _settingDF,
                num = 1;
            switch (Pixel && (num = _settingDF["devicePixelRatio"]), qt) {
                case "High":
                    this.setCanvasScale (1);
                    break;
                case "Medium":
                    this.setCanvasScale (0.9);
                    break;
                case "Low":
                    this.setCanvasScale (0.75);
                    break;
                case "VeryLow":
                    this.setCanvasScale (0.5);
                    break;
                default:
                    this.setCanvasScale (num)
            }
        },
        setCanvasScale: function(num) {
            this.canvasScale = num;
            P.canvasScale = num;
        },
        //獲取新party代碼
        setParty: function() {
            if (this.gameMode = Q("#gamemode").val (), this.setTop5 (), ":party" === this.gameMode) {
                var partytoken = Q(".partyToken").val ();
                partytoken && partytoken.length > 5 && (partytoken = partytoken.split ("#"), this.partyToken = partytoken[1]);
            }
        },
        //實況模式 隱藏tag與skin保障隱私
        setStreamMode: function() {
            GameSetting.streamMode ? (Q("#clantag, #skin").addClass ("stream-mode"),Q("#stream-mode").addClass ("stream_on").text("ON")) : (Q("#clantag, #skin").removeClass ("stream-mode"),Q("#stream-mode").removeClass ("stream_on").text("OFF"))
        },
        //按鈕設置與監聽
        setButtons: function() {
            var _this = this,
                t = document.getElementsByClassName("btn-play")[0],
                a = document.getElementsByClassName("btn-play-guest")[0],
                o = document.getElementsByClassName("btn-spectate")[0],
                i = document.getElementById("create-party-btn"),
                s = document.getElementById("join-party-btn"),
                n = document.getElementById ("statsContinue2"),
                u = document.getElementById ("og-reconnect-btn"),
                c = document.getElementById("btn_copy_gameinfo");

            t.addEventListener("click", function() {
                _this.handleConnect(), _this.play()
            }, !1),
                a.addEventListener("click", function() {
                    _this.handleConnect(), _this.play()
                }, !1),
                o.addEventListener("click", function() {
                    _this.handleConnect(), _this.spectate ()
                }, !1),
                i.addEventListener("click", function() {
                    _this.handleConnect(), _this.sendPlayerDeath()
                }, !1),
                s.addEventListener("click", function() {
                    _this.handleConnect(), _this.sendPlayerDeath(),_this.sendPlayerJoin()
                }, !1),
                n.addEventListener("click", function() {
                    Q("#stats, #main-panel").toggle ()
                }, !1),
                u.addEventListener ("click", function() {
                    ":party" === _this.gameMode && (Q("#og-reconnect-btn").prop ("disabled", true), _this.closeConnection (), _this.handleConnect ())
                }, !1),
                c.addEventListener ("click", function() {
                    _this.copyGameInfo()
                }, !1)
        },

        play: function() {
            Q("#main-panel").hide ();
            window.addKeyListeners ();
            P.spectate = false;
            P.playerBestMass = 0;
            window.ga && window.ga("create", "UA-67142685-2", "auto", "ogarioTracker");
            window.ga && window.ga("ogarioTracker.send", "pageview");
        },
        spectate: function() {
            Q("#main-panel").hide ();
            window.addKeyListeners ();
            P.play = false;
            P.spectate = true;
            GameSetting.sendNo1 ? this.sendPlayerSpawn() : this.sendPlayerDeath ();
            P.autoHideFood && (P.showFood = false);
        },
        //Profile個人設置
        setPlayerSettings: function() {
            var nick = Q("#nick").val(),
                team = Q("#clantag").val(),
                skin = Q("#skin").val(),
                color = Q("#color").val();
            profile.nick = nick || "";
            profile.clanTag = team.trim() || "";
            profile.skinURL = skin.trim() || "";
            7 == color.length && (profile.color = color);
            P.playerNick = profile.nick;
            profile.clanTag.length > 0 && (P.clanTag = profile.clanTag);
            player_profile[this.selectedProfile].nick = profile.nick;
            player_profile[this.selectedProfile].clanTag = profile.clanTag;
            player_profile[this.selectedProfile].skinURL = profile.skinURL;
            player_profile[this.selectedProfile].color = profile.color;
            this.saveSettings (player_profile, "ogarioPlayerProfiles");
            this.saveSettings (this.selectedProfile, "PP_selectedProfile");
        },

        /* ================ 依名子nick儲存skin =============== */
        cacheSkin: function(SkinsCache, nick, SkinURL) {
            SkinURL ? ( SkinsCache[nick] = new Image, SkinsCache[nick].crossOrigin = "Anonymous", SkinsCache[nick].src = SkinURL) : ( SkinsCache[nick] && delete SkinsCache[nick] )
        },
        getCachedSkin: function(SkinsCache, nick) {
            return SkinsCache[nick].width && SkinsCache[nick].complete ? SkinsCache[nick] : null
        },
        cacheCustomSkin: function(nick, SkinURL) {
            if (nick.length > 0) {
                if (this.customSkinsMap.hasOwnProperty(nick) && this.customSkinsMap[nick].src == SkinURL)
                    return;
                this.cacheSkin(this.customSkinsMap, nick, SkinURL)
            }
        },
        getCustomSkin: function(nick) {
            return nick && nick.length > 0 ? this.customSkinsMap.hasOwnProperty(nick) ? this.getCachedSkin(this.customSkinsMap, nick) : void 0 : null
        },
        //計算當前座標 command用
        calculateCurrentSector: function() {
            if(!P.mapOffsetFixed){
                return void((this.currentSector = ""))
            };
            var t = P.mapOffsetX + P.mapOffset,
                u = P.mapOffsetY + P.mapOffset,
                o = String.fromCharCode(65 + ~~((P.playerY + u) / (P.mapSize / Theme_defaultset.sectorsY))),
                i = "" + (~~((P.playerX + t) / (P.mapSize / Theme_defaultset.sectorsX)) + 1);
            this.currentSector = o + i
        },
        getMass: function(size) {
            return ~~(size * size / 100)
        },
        //=============================================================================================//
        //==================================         MAP         ======================================//
        //=============================================================================================//
        setMiniGrid: function() {
            this.miniMapSectors = null
        },
        drawMapBorders: function(ctx, a, o, i, s) {
            ctx.strokeStyle = Theme_defaultset.bordersColor;
            ctx.lineWidth = Theme_defaultset.bordersWidth * 2;
            ctx.beginPath();
            ctx.moveTo(a - 35, o - 35);
            ctx.lineTo(i + 35, o - 35);
            ctx.lineTo(i + 35, s + 35);
            ctx.lineTo(a - 35, s + 35);
            ctx.closePath();
            ctx.stroke();
        },
        drawMiniMap: function() {
            this.miniMap = document.getElementById("minimap");
            this.miniMapCtx = this.miniMap.getContext("2d");
            this.miniMapCtx.ogarioCtx = true;
            this.miniMap.width = this.miniMap.height = 200;
            this.miniMapCtx.globalAlpha = 1;
            this.miniMapCtx.fillStyle = "#FFFFFF";
            this.miniMapCtx.font = "bold 12px Ubuntu";
            this.miniMapCtx.textAlign = 'center';
            this.miniMapCtx.textBaseline = "middle";
            this.drawMiniMapSectors(200);
            var _this = this;
            setInterval(function() {
                _this.drawNode()
            }, 33);
        },

        //繪製小地圖玩家
        drawNode: function() {
            if (P.mapOffsetFixed) {
                var t = 200 / P.mapSize,
                    a = P.mapOffsetX + P.mapOffset,
                    o = P.mapOffsetY + P.mapOffset;
                this.miniMapCtx.clearRect(0, 0, 210, 210);
                this.calculateCurrentSector();
                this.miniMapCtx.fillStyle = "#FFFFFF";
                this.miniMapCtx.beginPath();
                this.miniMapCtx.arc(Math.floor ((P.playerX + a) * t), Math.floor ((P.playerY + o) * t), 6, 0, this.pi2, !1);
                this.miniMapCtx.closePath();
                this.miniMapCtx.fill();
                if(":party" === this.gameMode && this.teamPlayers.length > 0) {
                    for (var i = 0; i < this.teamPlayers.length; i++) {
                        this.teamPlayers[i].drawPosition(this.miniMapCtx, P.mapOffset, t)
                    }
                }
            }
        },
        drawMiniMapSectors: function(length) {
            this.miniMapSectors = document.getElementById("minimap-sectors");
            var ctx = this.miniMapSectors.getContext("2d");
            this.miniMapSectors.width = this.miniMapSectors.height = length;
            ctx.fillStyle = "#FFFFFF";
            var range = Math.floor (length / 5),
                leftext = 0,
                rightext = 0;
            ctx.font = "18px Verdana";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            for (var j = 0; 5 > j; j++) {
                for (var i = 0; 5 > i; i++) {
                    var coodina = String.fromCharCode (65 + j) + (i + 1);
                    leftext = ~~ (range / 2 + i * range);
                    rightext = ~~ (range / 2 + j * range);
                    //ctx.fillText (coodina, leftext, rightext);
                    console.log("drawMiniMapSectors");
}
            };
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, 200);
            ctx.lineTo(200, 200);
            ctx.lineTo(200, 0);
            ctx.closePath();
            ctx.strokeStyle = "#FFFFFF";
            ctx.stroke();

        },
        resetMiniMapSectors: function() {
            this.miniMapSectos = null
        },
        //drawSector: function(ctx, i=minX-mapOffsetX, s=minY-mapOffsetY, n=maxX-mapOffsetX, r=maxY-mapOffsetY)
        drawSectors: function(ctx, i, s, n, r) {
            var p = Math.floor ((n - i) / 5),
                h = Math.floor ((r - s) / 5),
                fontsize = Math.floor (0.5 * h),
                block = Theme_defaultset.sectorsWidth / 2;
            if(Theme_defaultset.mapLine == 1) {
                ctx.strokeStyle = Theme_defaultset.mainColor;
                ctx.fillStyle = Theme_defaultset.gridColor;
                ctx.lineWidth = 5;
                ctx.beginPath();
                for (var u = 0; 5 + 1 > u; u++) ctx.moveTo(u == 5 ? n : i + p * u, s ), ctx.lineTo(u == 5 ? n : i + p * u, r);
                for (var u = 0; 5 + 1 > u; u++) ctx.moveTo(i, u == 5 ? r  : s + h * u), ctx.lineTo(n, u == 5 ? r : s + h * u);
            }
            else {
                ctx.strokeStyle = Theme_defaultset.gridColor;
                ctx.fillStyle = Theme_defaultset.gridColor;
                ctx.lineWidth = 100;
                ctx.beginPath();
                for (var u = 0; 5 + 1 > u; u++) ctx.moveTo(u == 5 ? n : i + p * u, s), ctx.lineTo(u == 5 ? n : i + p * u, r);
                for (var u = 0; 5 + 1 > u; u++) ctx.moveTo(i - block, u == 5 ? r : s + h * u), ctx.lineTo(n + block, u == 5 ? r : s + h * u);
            }
            ctx.closePath();
            ctx.stroke();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = 1700 + "px " + Theme_defaultset.font;
            for (var u = 0; 5 > u; u++) {
                for (var f = 0; 5 > f; f++) {
                    var text = String.fromCharCode(65 + u) + (f + 1);
                    //ctx.fillText(text, Math.floor (i + p / 2 + f * p), Math.floor (s + h / 2 + u * h))
                                        console.log("drawSectors");

                }
            }
        },
        drawMapImg: function(ctx) {
            ctx.drawImage(this.MapImg, P.mapLeft, P.mapUp, 14142, 14142);
        },
        stk: function(ctx, size, alpha, x, y) {
            ctx.globalAlpha = alpha;
            ctx.lineWidth = Math.floor(size * 0.05);
            ctx.beginPath();
            ctx.arc(x, y, Math.floor(size), 0, this.pi2, false);
            ctx.closePath();
            ctx.stroke();
        },
        //指揮功能繪製
        drawCommander: function(ctx, x, y, time) {
            var elapsedTime = Date.now() - time;
            if(elapsedTime > 1200)
                return;
            var size1 = (this.commanderSize / 2) * (300 - elapsedTime) / 300;
            var size2 = this.commanderSize * (elapsedTime - 200) / 600;
            var size3 = this.commanderSize * (elapsedTime - 400) / 600;
            var size4 = this.commanderSize * (elapsedTime - 600) / 600;
            x = x - P.mapOffsetX;
            y = y - P.mapOffsetY;

            ctx.save();
            ctx.strokeStyle = Theme_defaultset.commanderColor;
            ctx.lineWidth = 5;
            ctx.globalAlpha = 1;

            if(elapsedTime < 300) this.stk(ctx, size1, (150 - Math.abs(elapsedTime - 150)) / 150, x, y);
            if(elapsedTime > 200 && elapsedTime < 800) this.stk(ctx, size2, (800 - elapsedTime) / 200, x, y);
            if(elapsedTime > 400 && elapsedTime < 1000) this.stk(ctx, size3, (1000 - elapsedTime) / 400, x, y);
            if(elapsedTime > 600 && elapsedTime < 1200) this.stk(ctx, size4, (1200 - elapsedTime) / 600, x, y);

            ctx.restore();
        },
        drawCircle: function(ctx, CellsCache, range, lineWidth, globalAlpha, strokeStyle) {
            ctx.lineWidth = lineWidth, ctx.globalAlpha = globalAlpha, ctx.strokeStyle = strokeStyle;
            for(var i = 0; i < CellsCache.length; i++) {
                ctx.beginPath(), ctx.arc(CellsCache[i].x, CellsCache[i].y, CellsCache[i].size + range, this.pi2, !1), ctx.closePath(), ctx.stroke()
            };
            ctx.globalAlpha = 1
        },
        setVirusColor: function(Size) {
            return this.getMass(Size) > 183 ? "#C80000" : Theme_defaultset.virusColor
        },
        setVirusStrokeColor: function(Size) {
            return Theme_defaultset.virusStrokeColor
        },
        setOppColor: function(Size, isMyCell) {
            if(isMyCell) return profile.color;
            var i = this.selectBiggestCell ? P.playerMaxMass : P.playerMinMass,
                s = this.getMass(Size) / i;
            if(s && s > 0) {
                var n = 1e3 > i ? .35 : .38;
                return s > 11 ? "#FF008C" : 2.5 > s ? 1.25 > s ? 1.25 > s && s > .75 ? "#FFDC00" : s > n ? "#00C8FF" : "#64FF00" : "#FF0A00" : "#BE00FF"
            }
        },
        displayLeaderboard: function(e) {
            this.leaderboardPositionsHUD && (this.leaderboardPositionsHUD.innerHTML = e)
        },
        countFPS: function() {
            if(!this.fpsLastRequest) return void(this.fpsLastRequest = Date.now());
            var e = Date.now(),
                t = e - this.fpsLastRequest;
            1e3 > t || (this.rFps = this.renderedFrames, this.renderedFrames = 0, this.fpsLastRequest = e), this.renderedFrames++
        },
        updateDebugDiv: function() {
            var debugString = [];
            debugString.push("PlayerPosition: " + ~~(this.getPlayerX()) + ", " + ~~(this.getPlayerY()));
            debugString.push("Cursor(fix): " + ~~(this.getCursorX()) + ", " + ~~(this.getCursorY()));
            debugString.push("CursorX: " + ~~(P.cursorX));
            debugString.push("CursorY: " + ~~(P.cursorY));
            debugString.push("cilent: " + ~~(P.clientX) + ", " + ~~(P.clientY));
            debugString.push("ViewScale: " + P.viewScale);
            debugString.push("Focus: " + (P.focusX == null ? " " : P.focusX) + ", " + (P.focusY == null ? " " : P.focusY));
            debugString.push("targetSpec: " + ((P.selectTarget1 || P.selectTarget2) ? "true" : "false"));
            document.getElementById("debugg").innerHTML = debugString.join("<br/>");
            var _this = this;
            setTimeout(function() {
                _this.updateDebugDiv()
            }, 300)
        },
        displayStats: function() {
            var content = [];
            if(P.play && P.playerCellsMass.length) {
                if(GameSetting.showStatsMass) {
                    P.playerMass != 0 && content.push("Score: " + P.playerMass);
                };
                if(GameSetting.showStatsSTE && P.STE) {
                    P.STE != null && content.push("STE: " + P.STE);
                };
                if(GameSetting.showStatsN16) {
                    content.push("[" + P.playerCellsMass.length + "/16]");
                };
            };
            if(GameSetting.showStatsFPS) {
                content.push("FPS: " + this.rFps);
            };
            if(!P.autoZoom) {
                content.push("&#x1F512;")
            };
            if(content.length > 0) {
                if(!Q("#stats-hud").is(":visible")) {
                    Q("#stats-hud").show()
                };
                document.getElementById("stats-hud").innerHTML = content.join("&nbsp;&nbsp;&nbsp;");
            } else {
                Q("#stats-hud").hide()
            };
            var _this = this;
            setTimeout(function() {
                _this.displayStats()
            }, 500)
        },
        findNearestCell: function(type, x, y) {
            var foucus_Hud = Q("#focusHud");

            var dst = (P.ballPool[0].x - x)*(P.ballPool[0].x - x) + (P.ballPool[0].y - y)*(P.ballPool[0].y - y);
            for(var i = 0; i < P.ballPool.length; i++) {
                var dx = P.ballPool[i].x - x;
                var dy = P.ballPool[i].y - y;
                if(dst >= (dx*dx + dy*dy)) {
                    dst = dx*dx + dy*dy;
                    this.focusTarget[type].enable = true;
                    this.focusTarget[type].nick = P.ballPool[i].nick;
                }
            };
            if(!foucus_Hud.is(":visible"))
                foucus_Hud.show();
            return true
        },
        targetFoucus: function(type) {
            this.focusTarget[0].num = 0;
            this.focusTarget[0].scrollX = 0;
            this.focusTarget[0].scrollY = 0;
            this.focusTarget[0].mass = 0;
            this.focusTarget[1].mass = 0;

            for(var i = 0; i < P.ballPool.length; i++) {
                if(this.focusTarget[0].enable && P.ballPool[i].nick == this.focusTarget[0].nick) {
                    this.focusTarget[0].scrollX += P.ballPool[i].x;
                    this.focusTarget[0].scrollY += P.ballPool[i].y;
                    this.focusTarget[0].num++;
                    this.focusTarget[0].mass += P.ballPool[i].size * P.ballPool[i].size;
                }
                else if(this.focusTarget[1].enable && P.ballPool[i].nick == this.focusTarget[1].nick) {
                    this.focusTarget[0].scrollX += P.ballPool[i].x;
                    this.focusTarget[0].scrollY += P.ballPool[i].y;
                    this.focusTarget[0].num++;
                    this.focusTarget[1].mass += P.ballPool[i].size * P.ballPool[i].size;
                }
            };
            this.focusTarget[0].scrollX /= this.focusTarget[0].num;
            this.focusTarget[0].scrollY /= this.focusTarget[0].num;
            this.focusTarget[0].mass = ~~(this.focusTarget[0].mass/100);
            this.focusTarget[1].mass = ~~(this.focusTarget[1].mass/100);
            this.focusTarget[0].sumMass = this.focusTarget[0].mass + this.focusTarget[1].mass;
            P.focusX = ~~(((this.focusTarget[0].scrollX - P.playerX) * P.viewScale + P.innerW / 2) * P.canvasScale);
            P.focusY = ~~(((this.focusTarget[0].scrollY - P.playerY) * P.viewScale + P.innerH / 2) * P.canvasScale);
            P.ballPool.length = 0;
            Q("#focus_hud1").text("Targeting: " + (this.focusTarget[0].enable ? this.focusTarget[0].nick : " ") + " (" + Dict[lan].mass + this.focusTarget[0].mass + ") (Key)");
            Q("#focus_hud2").text("Targeting: " + (this.focusTarget[1].enable ? this.focusTarget[1].nick : " ") + " (" + Dict[lan].mass + this.focusTarget[1].mass + ") (合:" + this.focusTarget[0].sumMass + ")");
            if(!type) {
                this.focusTarget[0].enable = false;
                this.focusTarget[1].enable = false;
                P.targetSpec = false;
                Q("#focusHud").hide();
            }
        },
        getFocusTargetEnable: function() {
            if(this.focusTarget[0].num == 0)
                return false
            return this.focusTarget[0].enable || this.focusTarget[1].enable
        },

        /* ================ 以下發送/接收處理封包資訊相關 =============== */

        //挺重要的函式 連線與相關設置
        connect: function() {
            if(this.closeConnection(), this.teamPlayers.length = 0, this.partys.length = 0, this.setParty(), ":party" === this.gameMode && this.partyToken.length <= 5) {
                console.log("Connecting to Ogar server"), this.socket = new WebSocket(this.publicIP), this.socket.ogarioWS = !0, this.socket.binaryType = "arraybuffer";
                var _this = this;
                this.socket.onopen = function() {
                    console.log("Socket open");
                    var mag = _this.createView(3);
                    mag.setUint8(0, 0);
                    mag.setUint16(1, 212, !0);
                    _this.sendBuffer(mag);
                    _this.sendBuffer(_this.strToBuff(15, _this.partyToken));
                    _this.sendBuffer(_this.strToBuff(10, profile.nick));
                    _this.sendBuffer(_this.strToBuff(11, profile.clanTag));
                    Q("#og-reconnect-btn").prop("disabled", false)
                };
                this.socket.onmessage = function(msg) {
                    _this.handleMessage(msg)
                };
                this.socket.onclose = function() {
                    console.log("Socket close")
                };
                this.socket.onerror = function() {
                    console.log("Socket error")
                };
            }
        },
        closeConnection: function() {
            if(this.socket) {
                this.socket.onmessage = null;
                try {
                    this.socket.close()
                } catch(e) {};
                this.socket = null
            }
        },
        handleConnect: function() {
            if(this.setPlayerSettings(), !this.isSocketOpen()) {
                var _this = this;
                setTimeout(function() {
                    _this.connect()
                }, 1e3)
            };
            this.updatePlayerInfo();
            this.gameInfo_refresh();
        },
        //不重要
        switchServerMode: function() {
            this.privateIP && (this.privateMode = !this.privateMode, this.isSocketOpen()) && (this.closeConnection(), this.privateMode ? (this.updateMaxTick = 5, toastr.info("Private Server!"), Q(".party-panel").show()) : (this.updateMaxTick = 2, Q("#activepartys").empty(), Q(".party-panel").hide()), this.handleConnect())
        },
        isSocketOpen: function() {
            return null != this.socket && this.socket.readyState == this.socket.OPEN
        },
        createView: function(e) {
            return new DataView(new ArrayBuffer(e))
        },
        strToBuff: function(e, t) {
            var a = this.createView(1 + 2 * t.length);
            a.setUint8(0, e);
            for(var o = 0; o < t.length; o++) {
                a.setUint16(1 + 2 * o, t.charCodeAt(o), !0);
            };
            return a
        },
        sendBuffer: function(e) {
            this.socket.send(e.buffer)
        },
        handleMessage: function(e) {
            this.readMessage(new DataView(e.data))
        },
        readMessage: function(e) {
            switch(e.getUint8(0)) {
                case 0:
                    this.playerID = e.getUint32(1, !0);
                    break;
                case 1:
                    this.sendPlayerUpdate();
                    break;
                case 20:
                    this.updateTeamPlayer(e);
                    break;
                case 30:
                    this.updateTeamPlayerPosition(e);
                    break;
                case 96:
                    this.updatePartys(e), this.displayPartys();
                    break;
                case 100:
                    this.readChatMessage(e);
            }
        },
        checkPlayerID: function(e) {
            for(var t = 0; t < this.teamPlayers.length; t++)
                if(this.teamPlayers[t].id == e) return t;
            return null
        },
        updateTeamPlayer: function(e) {
            function t() {
                for(var t = "";;) {
                    var a = e.getUint16(s, !0);
                    if(0 == a) {
                        break
                    };
                    t += String.fromCharCode(a), s += 2
                };
                return s += 2, t
            }
            var sctID = e.getUint32(1, !0),
                s = 5,
                nick = t(),
                skinURL = t(),
                color = t(),
                playerColor = t(),
                sctPlayer = this.checkPlayerID(sctID);
            if(null !== sctPlayer) {
                this.teamPlayers[sctPlayer].nick = nick;
                this.teamPlayers[sctPlayer].skinID = nick + playerColor;
                this.teamPlayers[sctPlayer].skinURL = skinURL;
                this.teamPlayers[sctPlayer].color = color;
            } else {
                var b = new PlayerSet(sctID, nick, nick + playerColor, skinURL, color);
                this.teamPlayers.push(b)
            };
            //先不加playerColor
            this.cacheCustomSkin(nick, skinURL)
        },
        updateTeamPlayerPosition: function(e) {
            var sctID = e.getUint32(1, !0),
                sctPlayer = this.checkPlayerID(sctID);
            null !== sctPlayer && (
                this.teamPlayers[sctPlayer].x = e.getInt32(5, !0),
                    this.teamPlayers[sctPlayer].y = e.getInt32(9, !0),
                    this.teamPlayers[sctPlayer].mass = e.getUint32(13, !0),
                    this.teamPlayers[sctPlayer].alive = !0,
                    this.teamPlayers[sctPlayer].updateTime = Date.now())
        },
        updateTeamPlayers: function() {
            if(":party" === this.gameMode) {
                this.isSocketOpen () && this.sendPlayerPosition();
                for(var i = 0; i < this.teamPlayers.length; i++) {
                    (this.teamPlayers[i].alive && Date.now() - this.teamPlayers[i].updateTime >= 2e3 || 0 == this.teamPlayers[i].mass) && (this.teamPlayers[i].alive = !1)
                };
                this.teamPlayers.sort(function(a, b) {
                    return b.mass - a.mass
                }), this.top5 = [];
                for(var a = 0; a < this.teamPlayers.length && (!this.teamPlayers[a].alive || (this.top5.push({
                    nick: this.teamPlayers[a].nick,
                    mass: this.teamPlayers[a].mass
                }), 5 != this.top5.length)); a++) {;
                };
                this.displayTop5()
            }
        },
        updatePartys: function(e) {
            this.partys.length = 0;
            for(var a = e.getUint8(1), b = 2, c = 0; a > c; c++) {
                for(var buffer = "";;) {
                    var d = e.getUint16(b, !0);
                    if(0 == d) {
                        break
                    };
                    buffer += String.fromCharCode(d), b += 2
                };
                b += 2, this.partys.push(buffer)
            }
        },
        displayPartys: function() {
            for(var e = "", t = 0, code = ""; t < this.partys.length; t++) {
                e += "<li><a href=\"http://agar.io/#" + this.partys[t] + "\" onclick=\"$('#joinPartyToken').val(\"" + this.partys[t] + "\"); $('#join-party-btn').click();\">http://agar.io/#" + this.partys[t] + "</a></li>";
                code += this.partys[t];
                Q("#party_code_info").text ("Party Code : #" + code);
            }
            this.activePartys.innerHTML = e;
        },
        displayTop5: function() {
            if(GameSetting.showTop5) {
                for(var e = "", t = 0; t < this.top5.length && (e += "<li><span class=\"main-color\">[" + this.top5[t].mass + "]</span>" + this.top5[t].nick + "</li>", 4 != t); t++);
                this.top5pHUD.innerHTML = e;
            }
        },
        escapeHTML: function(html) {
            return(html + "").replace(/[&<>"'\/]/g, function(html) {
                return escapeWord[html]
            })
        },
        //處理聊天訊息
        readChatMessage: function(e) {
            for(var t = e.getUint8(1), a = "", o = 2; o < e.byteLength; o += 2) {
                var i = e.getUint16(o, !0);
                if(0 == i) break;
                a += String.fromCharCode(i)
            }
            if(a.length > 0) {
                var s = a.split(": ", 1);
                a = a.replace(s + ": ", "");
                if(101 == t) {
                    //接收指揮信號
                    if(a.split(" ")[0] == "&#x1f43e;") {
                        if(enableCommander) {
                            P.mapEvent.push({
                                x: (a.split(" ")[1]).split(",")[0],
                                y: (a.split(" ")[1]).split(",")[1],
                                time: Date.now()
                            });
                        }
                    } else {
                        chatRoom.receiveMessage(s, a);
                        GameSetting.popchat && toastr.success('<span class="message-nick main-color">' + s + ": </span><br>" + a);
                    }
                } else if(102 == t) {
                    toastr.warning(s + ": " + a);
                } else {
                    Q("#messages").append(a)
                }
            }
        },
        sendChatMessage: function(e, t) {
            if(Date.now() - this.lastMessageSend >= 700 && t.length != 0 && profile.nick.length != 0 && this.isSocketOpen()) {
                var n = profile.nick + ": " + t,
                    a = this.createView(2 + 2 * n.length);
                a.setUint8(0, 100), a.setUint8(1, e);
                for(var o = 0; o < n.length; o++) a.setUint16(2 + 2 * o, n.charCodeAt(o), !0);
                this.sendBuffer(a), this.lastMessageSend = Date.now()
            }
        },
        prepareCommand: function(e) {
            return e.replace("%currentSector%", this.currentSector)
        },
        sendCommand: function(e) {
            if(Date.now() - this.lastCmdSend >3000) {
                var t = this.prepareCommand(Command["comm" + e]);
                this.sendChatMessage(102, t);
                this.lastCmdSend = Date.now()
            }
        },
        //傳送指揮訊號
        sendCmd: function() {
            var t = "&#x1f43e; "+ ~~(P.cursorX + P.mapOffsetX) + "," + ~~(P.cursorY + P.mapOffsetY);
            this.sendChatMessage(101, t);
        },
        enterChatMessage: function() {
            var msg = Q("#message");
            if(msg.is(":visible")) {
                var content = msg.val();
                content.length > 0 ? (this.sendChatMessage(101, content), P.play && (msg.blur(), msg.hide())) : (msg.blur(), msg.hide()), msg.val("")
            } else msg.show(), msg.focus(), msg.val("")
        },
        pause: function() {
            P.pause = !P.pause, P.pause ? Q("#pause-hud").show() : Q("#pause-hud").hide()
        },
        updatePlayer: function() {
            if (this.isSocketOpen()) {
                if (P.play) {
                    var t = this.createView(17);
                    t.setUint8(0, 30),
                        t.setInt32(1, this.playerID, !0),
                        t.setInt32(5, this.getPlayerX(), !0),
                        t.setInt32(9, this.getPlayerY(), !0),
                        void 0 !== P.playerMass ? t.setUint32(9, P.playerMass, !0) : t.setUint32(9, this.playerMass, !0), this.sendBuffer(t), this.sendPlayerSpawn()
                }
                else {
                    this.sendPlayerDeath()
                }
            }
        },
        sendPlayerSpawn: function() {
            this.isSocketOpen() && (view = this.createView(1), view.setUint8(0, 1), this.sendBuffer(view))
        },
        sendPlayerDeath: function() {
            this.isSocketOpen() && (view = this.createView(1), view.setUint8(0, 2), this.sendBuffer(view))
        },
        sendPlayerJoin: function() {
            this.isSocketOpen() && (view = this.createView(1), view.setUint8(0, 3), this.sendBuffer(view))
        },
        updatePlayerInfo: function() {
            this.cacheCustomSkin(profile.nick, profile.skinURL);
            if(this.isSocketOpen()) {
                this.sendBuffer(this.strToBuff(10, profile.nick));
                this.sendBuffer(this.strToBuff(11, profile.clanTag));
                this.sendBuffer(this.strToBuff(12, profile.skinURL));
                this.sendBuffer(this.strToBuff(13, profile.color));
                setTimeout(function() {
                    this.setParty(), this.sendBuffer(this.strToBuff(15, this.partyToken))
                }.bind(this), 1e3);
            }
        },
        sendPlayerUpdate: function() {
            function sent(e) {
                for(var i = 0; i < e.length; i++) {
                    buffer.setUint16 (w, e.charCodeAt (i), !0),
                        w += 2
                };
                buffer.setUint16 (w, 0, !0),
                    w += 2
            }
            if(this.playerID && P.play && P.playerColor) {
                var view = 41;
                view += 2 * profile.nick.length;
                view += 2 * profile.skinURL.length;
                var buffer = this.createView (view);
                buffer.setUint8 (0, 20),
                    buffer.setUint16 (1, this.playerID, !0);
                var w = 5;
                sent(profile.nick);
                sent(profile.skinURL);
                sent(profile.color);
                sent(P.playerColor);
                this.sendBuffer (buffer)
            }
            else if(this.playerID && GameSetting.sendNo1 && P.spectate) {
                var view = 59;
                var buffer = this.createView (view);
                buffer.setUint8 (0, 20),
                    buffer.setUint16 (1, this.playerID, !0);
                var w = 5;
                sent("ENERMY #1");
                sent("");
                sent("#FF0000");
                sent("#FF0000");
                this.sendBuffer (buffer)
            }
        },
        sendPlayerPosition: function() {
            if(P.play && this.playerID) {
                var t = this.createView (17);
                t.setUint8 (0, 30);
                t.setUint16 (1, this.playerID, !0);
                t.setInt32 (5, this.getPlayerX (), !0);
                t.setInt32 (9, this.getPlayerY (), !0);
                void(0) !== P.playerMass ? t.setUint32 (13, P.playerMass, !0) : t.setUint32 (13, this.playerMass, !0), this.sendBuffer (t)
            }
            else if(GameSetting.sendNo1 && P.spectate && this.playerID) {
                var t = this.createView (17);
                t.setUint8 (0, 30);
                t.setUint16 (1, this.playerID, !0);
                t.setInt32 (5, this.getPlayerX (), !0);
                t.setInt32 (9, this.getPlayerY (), !0);
                t.setUint32 (13, 1, !0);
                this.sendBuffer (t)
            }
        },
        manageMapEvent: function (ctx) {
            for(var e = 0;e < P.mapEvent.length; ++e){
                if(P.mapEvent[e]){
                    this.drawCommander(ctx, P.mapEvent[e].x, P.mapEvent[e].y, P.mapEvent[e].time);
                    if(Date.now() - P.mapEvent[e].time > 1200){
                        P.mapEvent.splice(e, 1);
                    }
                }
            }
        },
        //Teammate Indicator預渲染
        predrawTeamMateInd: function() {
            P.teammateIndicator = document.createElement("canvas");
            var ctx = P.teammateIndicator.getContext("2d");
            ctx.beginPath();
            ctx.lineWidth = 10;
            ctx.moveTo(0, 0);
            ctx.lineTo(100, 0);
            ctx.lineTo(50, 50);
            ctx.closePath();
            ctx.strokeStyle = "white";
            ctx.fillStyle = "white";
            ctx.stroke();
            ctx.fill();
        },
        predrawPellet: function() {
            P.preFood = document.createElement ("canvas");
            var ctx = P.preFood.getContext ("2d");
            ctx.beginPath();
            ctx.arc(10, 10, 10, f.pi2, false);
            ctx.fillStyle = Theme_defaultset.foodColor;
            ctx.closePath();
            ctx.fill();

            P.preFood2 = document.createElement ("canvas");
            ctx = P.preFood2.getContext ("2d");
            ctx.beginPath();
            ctx.rect(0, 0, 18, 18);
            ctx.fillStyle = Theme_defaultset.foodColor;
            ctx.closePath();
            ctx.fill();
        },
        init: function() {
            this.loadSettings();
            this.loadProfiles();
            this.setMenu();
            _ThemeSet && _ThemeSet.setTheme();
            this.setProfile();
            this.setButtons();
            this.setStreamMode();
            this.setMiniMap();
            this.setTop5();
            this.displayStats();
            //this.updateDebugDiv();
            this.drawMiniMap();
            this.predrawTeamMateInd();
            this.predrawPellet();
            this.focusTarget[0].enable = false;
            this.focusTarget[1].enable = false;
            var _this = this;
            setInterval(function() {
                _this.updateTeamPlayers()
            }, this.updateInterval);
            chatRoom.init ();

        }
    };

    /* ================ 插件主功能初始化/window層級函式設置=============== */
    var f = new SettingsDefault;
    f.init();
    getMouseCood();
    MCHandler();
    window.addEventListener("resize", function() {
        setTimeout(HelloContainResize(), 100)
    }, !1);
    window.onbeforeunload = ExitCheck;
    window.setSettings = function(item, e) {
        if (GameSetting.hasOwnProperty(item) && null !== e) {
            switch (GameSetting[item] = e, P.hasOwnProperty(item) && (P[item] = e), item) {
                case "showMiniMap":
                    f.setMiniMap();
                    break;
                case "showTop5":
                    f.setTop5();
                    break;
                case "chatbox":
                    GameSetting.chatbox ? chatRoom.show() : chatRoom.hide();
                    break;
            }
            ;
            f.saveSettings(GameSetting, "PP_settings")
        }
    };
    window.setlanguage = function(lan, s) {
        if(lan == "trch") {
            s && window.localStorage.setItem("PP_language", "trch");
        }
        else if(lan == "simpch") {
            s && window.localStorage.setItem("PP_language", "simpch");
        }
        !s && window.localStorage.setItem("PP_language", "en");
    };
    P.displayLeaderboard = function() {
        f.displayLeaderboard(P.leaderboardHTML)
    };

    /* ================ CustomDraw為所有每禎需重新繪製的函式入口,幾乎額外繪製的都在這呼叫, 沒有自行呼叫requestAnimationFrame(),而是綁在agar自己的requestAnimationFrame上  =============== */
    P.customDraw = function(ctx) {
        if(ctx) {
            f.countFPS();
            if(P.mapOffsetFixed) {
                GameSetting.showBgSectors && f.drawSectors(ctx, P.mapLeft, P.mapUp, P.mapRight, P.mapDown);
                GameSetting.showMapBorders && f.drawMapBorders(ctx, P.mapLeft, P.mapUp, P.mapRight, P.mapDown);
                Theme_defaultset.MapImgURL.length && f.drawMapImg(ctx);
            }

            if(P.virusesCache.length) {
                ctx.beginPath();
                for(var n = 0; n < P.virusesCache.length; n++) {
                    var r = P.virusesCache[n].x;
                    var l = P.virusesCache[n].y;
                    ctx.moveTo(r, l);
                    ctx.arc(r, l, P.virusesCache[n].size + 820, f.pi2, false)
                }
                ctx.fillStyle = Theme_defaultset.virusColor;
                ctx.globalAlpha = 0.1;
                ctx.fill();
                P.virusesCache.length = 0;
            };

            if(P.foodCache.length) {
                if(P.viewScale < 0.16) {
                    ctx.beginPath ();
                    for (var n = 0; n < P.foodCache.length; n++) {
                        var size = P.foodCache[n].size - 1;
                        ctx.rect(P.foodCache[n].x - size, P.foodCache[n].y - size, 2 * size, 2 * size);
                        //ctx.drawImage(P.preFood2, P.foodCache[n].x - 9, P.foodCache[n].y - 9);
                    }
                    ctx.fillStyle = Theme_defaultset.foodColor, ctx.globalAlpha = 1, ctx.fill();
                }
                else {
                    for (var n = 0; n < P.foodCache.length; n++) {
                        //ctx.moveTo(r, l), ctx.arc(P.foodCache[n].x - 15, P.foodCache[n].y - 15, P.foodCache[n].size + 5, f.pi2, !1)
                        ctx.drawImage(P.preFood, P.foodCache[n].x - 10, P.foodCache[n].y - 10);
                    }
                }
                P.foodCache.length = 0;
            };
            if(P.play) {
                //分裂範圍
                if(GameSetting.splitRange) {
                    if(P.playerCells.length) {
                        ctx.lineWidth = 6;
                        ctx.strokeStyle = "#FFFFFF";
                        for(var v = 0; v < P.playerCells.length; v++) {
                            ctx.beginPath();
                            ctx.arc(P.playerCells[v].x, P.playerCells[v].y, P.playerCells[v].size + GameSetting.attackRangeRadius, 0, f.pi2, !1);
                            ctx.closePath();
                        }
                        ctx.stroke();
                    }
                };
                //雙拍範圍
                if(GameSetting.isDoubleSplitRange) {
                    if(P.playerCells.length > 0) {
                        P.playerCells.sort(function(a, P) {
                            return P.size - a.size
                        });
                        ctx.lineWidth = 6;
                        ctx.strokeStyle = "#FBFF00";
                        ctx.beginPath();
                        ctx.arc(P.playerCells[0].x, P.playerCells[0].y, P.playerCells[0].size + 2 * GameSetting.attackRangeRadius, 0, f.pi2, !1);
                        ctx.closePath();
                        ctx.stroke();
                    }
                };
                //增強環
                if(GameSetting.oppRings) {
                    ctx.save();
                    ctx.globalAlpha = 0.7;
                    if(P.playerCells.length) {
                        P.playerCells.sort(function(a, b) {
                            return b.size - a.size
                        });
                    }
                    for (var j = 0;j < P.CellsCache.length;j++) {
                        var radius = P.CellsCache[j].size * P.CellsCache[j].size;
                        var i = 0;
                        for (;i < P.playerCells.length;i++) {
                            var r = P.playerCells[i].size * P.playerCells[i].size;
                            var distance = Math.sqrt(Math.pow(P.playerCells[i].x - P.CellsCache[j].x, 2) + Math.pow(P.playerCells[i].y - P.CellsCache[j].y, 2));
                            var mySplitRange = P.playerCells[i].size + 655;
                            var b = P.CellsCache[j].size + 655;
                            if (4 >= P.playerCells.length && (0.375 * r * 0.37 > radius && 2 * mySplitRange - 10 > distance)) {
                                P.CellsCache[j].type = 4;
                                break;
                            }
                            if (8 >= P.playerCells.length && (0.37 * r > radius && mySplitRange > distance)) {
                                P.CellsCache[j].type = 2;
                                break;
                            }
                            if (0.73 * r > radius && mySplitRange > distance) {
                                P.CellsCache[j].type = 1;
                                break;
                            }
                            if (0.37 * radius > r && b > distance) {
                                P.CellsCache[j].type = -2;
                                break;
                            }
                            if (0.73 * radius > r && b > distance) {
                                P.CellsCache[j].type = -1;
                                break;
                            }
                        }
                    }
                    var RingWidth = ~~Math.min(5 / P.viewScale, 50);
                    ctx.lineWidth = RingWidth;
                    for(var mm = 0; mm < P.oppColorMap.length; mm++) {
                        ctx.strokeStyle = P.oppColorMap[mm].color;
                        ctx.beginPath();
                        for(var m = 0; m < P.CellsCache.length; m++) {
                            if(P.CellsCache[m].type == P.oppColorMap[mm].type) {
                                radius = ~~(P.CellsCache[m].size + RingWidth + 8 + 2 / P.viewScale);
                                ctx.moveTo(P.CellsCache[m].x + radius, P.CellsCache[m].y);
                                ctx.arc(P.CellsCache[m].x, P.CellsCache[m].y, radius, 0, f.pi2, !1);
                            }
                        };
                        ctx.stroke();
                    };
                    ctx.restore()
                };
                if(GameSetting.cursorTracking) {
                    P.setCursorPosition();
                    ctx.lineWidth = 2;
                    ctx.globalAlpha = 0.8;
                    ctx.lineCap = "round";
                    ctx.lineJoin = "round";
                    ctx.strokeStyle = "#E3F2FD";
                    ctx.beginPath();
                    for(var t = 0; t < P.playerCells.length; t++) {
                        ctx.moveTo(P.playerCells[t].x, P.playerCells[t].y);
                        ctx.lineTo(P.cursorX, P.cursorY)
                    };
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                };
            };
            //指揮
            if(GameSetting.enableCommander) {
                f.manageMapEvent(ctx);
            };
            P.playerCells.length = 0, GameSetting.oppRings && (P.CellsCache.length = 0);
            //指定觀戰
            if(!P.play && f.focusTarget[0].enable || f.focusTarget[1].enable) {
                f && f.targetFoucus(1);
            }
        }
    };
    P.getCustomSkin = function (e) {
        return f.getCustomSkin(e)
    };
    P.setVirusColor = function (e) {
        return f.setVirusColor(e)
    };
    P.setVirusStrokeColor = function (e) {
        return f.setVirusStrokeColor(e)
    };
    P.setOppColor = function (e, t) {
        return f.setOppColor(e, t)
    };
    P.getFocusTargetEnable = function() {
        return f.getFocusTargetEnable()
    };

    /*============ 熱鍵相關設置 ============*/
    var _hotkey = {};
    var hotkey_temp = {};
    var keymap = {
        "Feed": {
            label: Dict[lan]["Feed"],
            defaultKey: "W",
            keyDown: function() {
                f && f.feed()
            },
            keyUp: null,
            type: "normal"
        },
        "MacroFeed": {
            label: Dict[lan]["MacroFeed"],
            defaultKey: "E",
            keyDown: function() {
                f && f.macroFeed(!0)
            },
            keyUp: function() {
                f && f.macroFeed(!1)
            },
            type: "normal"
        },
        "split": {
            label: Dict[lan]["split"],
            defaultKey: "SPACE",
            keyDown: function() {
                f && f.split()
            },
            keyUp: null,
            type: "normal"
        },
        "doubleSplit": {
            label: Dict[lan]["doubleSplit"],
            defaultKey: "G",
            keyDown: function() {
                f && f.doubleSplit()
            },
            keyUp: null,
            type: "normal"
        },
        "tripleSplit": {
            label: Dict[lan]["tripleSplit"],
            defaultKey: "",
            keyDown: function() {
                f && f.tripleSplit()
            },
            keyUp: null,
            type: "normal"
        },
        "quickSplit": {
            label: Dict[lan]["quickSplit"],
            defaultKey: "T",
            keyDown: function() {
                f && f.quickSplit()
            },
            keyUp: null,
            type: "normal"
        },
        "pause": {
            label: Dict[lan]["pause"],
            defaultKey: "S",
            keyDown: function() {
                P.play && (this.pause = !this.pause, P.pause = this.pause, this.pause ? Q("#pause-hud").show () : Q("#pause-hud").hide ())
            },
            keyUp: null,
            type: "normal"
        },
        "tempShowName": {
            label: Dict[lan]["tempShowName"],
            defaultKey: "K",
            keyDown: function() {
                window.core && window.core.setNames && window.core.setNames (!0),
                    setTimeout(function() {
                        window.core && window.core.setNames && window.core.setNames (!1)
                    }, 3000)
            },
            keyUp: null,
            type: "normal"
        },
        "showGamebox":{
            label: Dict[lan]["showGamebox"],
            defaultKey: "",
            keyDown: function() {
                Q(".right-container").toggle();
                chatRoom.init();
            },
            keyUp: null,
            type: "normal"
        },
        "showTop5": {
            label: Dict[lan]["showTop5"],
            defaultKey: "",
            keyDown: function() {
                Q("#showTop5").click()
            },
            keyUp: null,
            type: "normal"
        },
        "showSplitRange": {
            label: Dict[lan]["showSplitRange"],
            defaultKey: "A",
            keyDown: function() {
                Q("#splitRange").click()
            },
            keyUp: null,
            type: "normal"
        },
        "showSplitInd": {
            label: Dict[lan]["showSplitInd"],
            defaultKey: "I",
            keyDown: function() {
                Q("#oppRings").click()
            },
            keyUp: null,
            type: "normal"
        },
        "showDoubleSplitRange": {
            label: Dict[lan]["showDoubleSplitRange"],
            defaultKey: "D",
            keyDown: function() {
                GameSetting.isDoubleSplitRange = true
            },
            keyUp: function() {
                GameSetting.isDoubleSplitRange = false
            },
            type: "normal"
        },
        "showOppColors": {
            label: Dict[lan]["showOppColors"],
            defaultKey: "O",
            keyDown: function() {
                Q("#oppColors").click()
            },
            keyUp: null,
            type: "normal"
        },
        "showSkins": {
            label: Dict[lan]["showSkins"],
            defaultKey: "ALT+S",
            keyDown: function() {
                Q("#noSkins").click()
            },
            keyUp: null,
            type: "normal"
        },
        "toggleCells": {
            label: Dict[lan]["toggleCells"],
            defaultKey: "",
            keyDown: function() {
                f && f.toggleCells()
            },
            keyUp: null,
            type: "normal"
        },
        "isEnableTeammateIndicator": {
            label: Dict[lan]["isEnableTeammateIndicator"],
            defaultKey: "ALT+T",
            keyDown: function() {
                Q("#isEnableTeammateIndicator").click()
            },
            keyUp: null,
            type: "normal"
        },
        "showFood": {
            label: Dict[lan]["showFoods"],
            defaultKey: "F",
            keyDown: function() {
                Q("#showFood").click()
            },
            keyUp: null,
            type: "normal"
        },
        "showLb": {
            label: Dict[lan]["showLb"],
            defaultKey: "L",
            keyDown: function() {
                this.gameMode !== ":teams" && Q("#leaderboard-hud").toggle()
            },
            keyUp: null,
            type: "normal"
        },
        "resetZoom": {
            label: Dict[lan]["resetZoom"],
            defaultKey: "Z",
            keyDown: function() {
                f && f.resetZoom(!0)
            },
            keyUp: function() {
                f && f.resetZoom(!1)
            },
            type: "normal"
        },
        "showBgSectors": {
            label: Dict[lan]["showBgSectors"],
            defaultKey: "B",
            keyDown: function() {
                Q("#showBgSectors").click()
            },
            keyUp: null,
            type: "normal"
        },
        "hideBots": {
            label: Dict[lan]["hideBots"],
            defaultKey: "ALT+B",
            keyDown: function() {
                f && f.setHideSmallBots()
            },
            keyUp: null,
            type: "normal"
        },
        "showNames": {
            label: Dict[lan]["showNames"],
            defaultKey: "N",
            keyDown: function() {
                Q("#noNames").click()
            },
            keyUp: null,
            type: "normal"
        },
        "showMass": {
            label: Dict[lan]["showMass"],
            defaultKey: "M",
            keyDown: function() {
                Q("#showMass").click()
            },
            keyUp: null,
            type: "normal"
        },
        "showMiniMap": {
            label: Dict[lan]["showMiniMap"],
            defaultKey: "ALT+M",
            keyDown: function() {
                GameSetting.showMiniMap = !GameSetting.showMiniMap, f && f.setMiniMap()
            },
            keyUp: null,
            type: "normal"
        },
        "chatMessage": {
            label: Dict[lan]["chatMessage"],
            defaultKey: "ENTER",
            keyDown: function() {
                //f && f.enterChatMessage()
                chatRoom.enter()
            },
            keyUp: null,
            type: "special"
        },
        "quickResp": {
            label: Dict[lan]["quickResp"],
            defaultKey: "TILDE",
            keyDown: function() {
                f && f.quickResp()
            },
            keyUp: null,
            type: "normal"
        },
        "zoom1": {
            label: Dict[lan]["zoomLevel"] + " 1",
            defaultKey: "ALT+1",
            keyDown: function() {
                f && f.setZoom (0.5)
            },
            keyUp: null,
            type: "normal"
        },
        "zoom2": {
            label: Dict[lan]["zoomLevel"] + " 2",
            defaultKey: "ALT+2",
            keyDown: function() {
                f && f.setZoom (0.25)
            },
            keyUp: null,
            type: "normal"
        },
        "zoom3": {
            label: Dict[lan]["zoomLevel"] + " 3",
            defaultKey: "ALT+3",
            keyDown: function() {
                f && f.setZoom (0.125)
            },
            keyUp: null,
            type: "normal"
        },
        "zoom4": {
            label: Dict[lan]["zoomLevel"] + " 4",
            defaultKey: "ALT+4",
            keyDown: function() {
                f && f.setZoom (0.075)
            },
            keyUp: null,
            type: "normal"
        },
        "zoom5": {
            label: Dict[lan]["zoomLevel"] + " 5",
            defaultKey: "ALT+5",
            keyDown: function() {
                f && f.setZoom (0.05)
            },
            keyUp: null,
            type: "normal"
        },
        "targetView1": {
            label: Dict[lan].targetView1,
            defaultKey: "X",
            keyDown: function() {
                P.targetSpec = true;
                P.selectTarget1 = true;
            },
            keyUp: function() {
                P.selectTarget1 = false;
            },
            type: "normal"
        },
        "targetView2": {
            label: Dict[lan].targetView2,
            defaultKey: "C",
            keyDown: function() {
                P.targetSpec = true;
                P.selectTarget2 = true;
            },
            keyUp: function() {
                P.selectTarget2 = false;
            },
            type: "normal"
        },
        "comm1": {
            label: Command["comm1"],
            defaultKey: "1",
            keyDown: function() {
                f && f.sendCommand(1)
            },
            keyUp: null,
            type: "command"
        },
        "comm2": {
            label: Command["comm2"],
            defaultKey: "2",
            keyDown: function() {
                f && f.sendCommand(2)
            },
            keyUp: null,
            type: "command"
        },
        "comm3": {
            label: Command["comm3"],
            defaultKey: "3",
            keyDown: function() {
                f && f.sendCommand(3)
            },
            keyUp: null,
            type: "command"
        },
        "comm4": {
            label: Command["comm4"],
            defaultKey: "4",
            keyDown: function() {
                f && f.sendCommand(4)
            },
            keyUp: null,
            type: "command"
        },
        "comm5": {
            label: Command["comm5"],
            defaultKey: "5",
            keyDown: function() {
                f && f.sendCommand(5)
            },
            keyUp: null,
            type: "command"
        },
        "comm6": {
            label: Command["comm6"],
            defaultKey: "6",
            keyDown: function() {
                f && f.sendCommand(6)
            },
            keyUp: null,
            type: "command"
        },
        "comm7": {
            label: Command["comm7"],
            defaultKey: "7",
            keyDown: function() {
                f && f.sendCommand(7)
            },
            keyUp: null,
            type: "command"
        },
        "comm8": {
            label: Command["comm8"],
            defaultKey: "8",
            keyDown: function() {
                f && f.sendCommand(8)
            },
            keyUp: null,
            type: "command"
        },
        "comm9": {
            label: Command["comm9"],
            defaultKey: "9",
            keyDown: function() {
                f && f.sendCommand(9)
            },
            keyUp: null,
            type: "command"
        },
        "comm0": {
            label: Command["comm0"],
            defaultKey: "0",
            keyDown: function() {
                f && f.sendCommand(0)
            },
            keyUp: null,
            type: "command"
        },
        "comm10": {
            label: Command["comm10"],
            defaultKey: "MOUSE WHEEL",
            keyDown: function() {
                f && f.sendCommand(10)
            },
            keyUp: null,
            type: "command"
        },
        "comm11": {
            label: Command["comm11"],
            defaultKey: "LEFT",
            keyDown: function() {
                f && f.sendCommand(11)
            },
            keyUp: null,
            type: "command"
        },
        "comm12": {
            label: Command["comm12"],
            defaultKey: "UP",
            keyDown: function() {
                f && f.sendCommand(12)
            },
            keyUp: null,
            type: "command"
        },
        "comm13": {
            label: Command["comm13"],
            defaultKey: "RIGHT",
            keyDown: function() {
                f && f.sendCommand(13)
            },
            keyUp: null,
            type: "command"
        },
        "comm14": {
            label: Command["comm14"],
            defaultKey: "DOWN",
            keyDown: function() {
                f && f.sendCommand(14)
            },
            keyUp: null,
            type: "command"
        }
    };
    HotkeyManager.prototype = {
        selectedHotkeyRow: null,
        defaultMessageKey: "ENTER",
        inputClassName: "custom-key-in form-control input-sm",
        loadDefaultHotkeys: function() {
            _hotkey = {};
            for (var keyId in keymap) {
                _hotkey[keymap[keyId].defaultKey] = keyId;
            };
            _hotkey.spec_messageKey = this.defaultMessageKey
        },
        loadHotkeys: function() {
            null !== window.localStorage.getItem("PP_Hotkeys") ? _hotkey = JSON.parse(window.localStorage.getItem("PP_Hotkeys")) : this.loadDefaultHotkeys(),
            null !== window.localStorage.getItem("PP_Commands") && (Command = JSON.parse(window.localStorage.getItem("PP_Commands")))
        },
        saveHotkeys: function() {
            var codeSegments = Q("#hotkeys .custom-key-in");
            _hotkey = {};
            _hotkey.spec_messageKey = Q("#chatMessage").val();
            for (var i = 0;i < codeSegments.length;i++) {
                _hotkey[Q(codeSegments[i]).val()] = Q(codeSegments[i]).attr("id");
            };
            window.localStorage.setItem("PP_Hotkeys", JSON.stringify(_hotkey));
            this.saveCommands();
            Q("#hotkeys-cfg .table-row-selected").removeClass("table-row-selected");
        },
        saveCommands: function() {
            Q("#hotkeys .command-in").each(function() {
                var sctcomm = Q(this),
                    commid = sctcomm.attr("id");
                Command.hasOwnProperty(commid) && (Command[commid] = sctcomm.val())
            }), window.localStorage.setItem("PP_Commands", JSON.stringify(Command))
        },
        resetHotkeys: function() {
            Q("#hotkeys-cfg .table-row-selected").removeClass("table-row-selected");
            this.loadDefaultHotkeys(), Q("#hotkeys-cfg .custom-key-in").each(function() {
                var keyid = Q(this).attr("id");
                keymap[keyid] && Q(this).val(keymap[keyid].defaultKey)
            })
        },
        setHotkeysMenu: function() {
            Q("body").append('<div id="hotkeys"><div id="hotkeys-menu">' +
                '<button class="btn btn-primary" onclick="resetHotkeys();">' + Dict[lan].resetSett + '</button> ' +
                '<button class="btn btn-success" onclick="saveHotkeys();">' + Dict[lan].saveSett + '</button> ' +
                '<button class="btn btn-danger" onclick="closeHotkeys();">' + Dict[lan].close + '</button></div>' +
                '<div id="hotkeys-cfg"></div><div id="hotkeys-inst"><ul>' +
                '<li>' + Dict[lan]["inst-assign"] + '</li>' +
                '<li>' + Dict[lan]["inst-delete"] + '</li>' +
                '<li>' + Dict[lan]["inst-keys"] + '</li></ul></div></div>');
            for (keyId in keymap) {
                if (keymap.hasOwnProperty(keyId)) {
                    var selected_HotkeyManager = keymap[keyId],
                        keyContent = "";
                    for (var gg in _hotkey) {
                        if (_hotkey.hasOwnProperty(gg) && _hotkey[gg] === keyId) {
                            keyContent = gg;
                            break;
                        }
                    };
                    if ("command" === selected_HotkeyManager.type) {
                        Q("#hotkeys-cfg").append('<div class="row2"><div class="key-label"><input id="' + keyId + '" class="command-in form-control input-sm" value="' + Command[keyId] + '" maxlength="80" /></div><div class="default-key">' + selected_HotkeyManager.defaultKey + '</div><div class="custom-key"><input id="' + keyId + '" class="custom-key-in form-control input-sm" value="' + keyContent + '" /></div></div>')
                    } else {
                        Q("#hotkeys-cfg").append('<div class="row"><div class="key-label">' + selected_HotkeyManager.label + '</div><div class="default-key">' + selected_HotkeyManager.defaultKey + '</div><div class="custom-key"><input id="' + keyId + '" class="custom-key-in form-control input-sm" value="' + keyContent + '" /></div></div>')
                    }
                }
            };
            Q("#hotkeys-cfg .row").click(function () {
                Q("#hotkeys-cfg .table-row-selected").removeClass("table-row-selected");
                this.selectedHotkeyRow = Q(this);
                this.selectedHotkeyRow.addClass("table-row-selected");
                this.selectedHotkeyRow.find("input").focus();
            });
            Q("#hotkeys-cfg .row2").click(function () {
                Q("#hotkeys-cfg .table-row-selected").removeClass("table-row-selected");
                this.selectedHotkeyRow = Q(this);
                this.selectedHotkeyRow.addClass("table-row-selected");
            })
        },
        getPressedKey: function(event) {
            var specKey = "",
                normalKey = "";
            switch (event.ctrlKey || 17 == event.keyCode ? specKey = "CTRL" : (event.altKey || 18 == event.keyCode) && (specKey = "ALT"), event.keyCode) {
                case 9:
                    normalKey = "TAB";
                    break;
                case 13:
                    normalKey = "ENTER";
                    break;
                case 16:
                    normalKey = "SHIFT";
                    break;
                case 17:
                    break;
                case 18:
                    break;
                case 20:
                    break;
                case 32:
                    normalKey = "SPACE";
                    break;
                case 33:
                    normalKey = "Page_Up";
                    break;
                case 34:
                    normalKey = "Page_Down";
                    break;
                case 37:
                    normalKey = "LEFT";
                    break;
                case 38:
                    normalKey = "UP";
                    break;
                case 39:
                    normalKey = "RIGHT";
                    break;
                case 40:
                    normalKey = "DOWN";
                    break;
                case 46:
                    normalKey = "DEL";
                    break;
                case 61:
                    normalKey = "=";
                    break;
                case 187:
                    normalKey = "=";
                    break;
                case 192:
                    normalKey = "TILDE";
                    break;
                default:
                    normalKey = String.fromCharCode(event.keyCode)
            };
            return "" !== specKey ? "" !== normalKey ? specKey + "+" + normalKey : specKey : normalKey
        },
        setDefaultHotkey: function(keyId) {
            var flag = false;
            return keymap[keyId] && !_hotkey.hasOwnProperty(keymap[keyId].defaultKey) ? (flag = keymap[keyId].defaultKey, _hotkey[flag] = keyId, flag) : flag
        },
        setHotkey: function(keyString, targetID) {
            if (targetID) {
                var selectedKey = Q("#" + targetID);
                if("DEL" == keyString) {
                    delete _hotkey[selectedKey.val()];
                    selectedKey.val("");
                } else {
                    var codeSegments = Q("#hotkeys .custom-key-in");
                    for (var i = 0;i < codeSegments.length;i++) {
                        if (Q(codeSegments[i]).val() == keyString) {
                            return;
                        }
                    };
                    selectedKey.val(keyString);
                    "chatMessage" === targetID && (_hotkey.spec_messageKey = keyString);
                    this.selectedHotkeyRow.removeClass("table-row-selected");
                }
            }
        },
        init: function() {
            this.loadHotkeys(), this.setHotkeysMenu()
        }
    };
    var _HotkeyManager = new HotkeyManager;
    _HotkeyManager.init();
    document.onkeydown = function(event) {
        var keyString = _HotkeyManager.getPressedKey(event);
        //在hotkey設置介面
        if(("input" != event.target.tagName.toLowerCase() || event.target.className === _HotkeyManager.inputClassName || keyString === _hotkey.spec_messageKey) && "" !== keyString && !hotkey_temp[keyString]) {
            if(hotkey_temp[keyString] = true, event.target.className === _HotkeyManager.inputClassName) {
                return event.preventDefault(), void(_HotkeyManager).setHotkey(keyString, event.target.id)
            };
            if(_hotkey[keyString]) {
                event.preventDefault();
                var gettedKey = _hotkey[keyString];
                "" !== gettedKey && keymap[gettedKey] && keymap[gettedKey].keyDown && keymap[gettedKey].keyDown()
            }
        }
    }, document.onkeyup = function(event) {
        var keyString = _HotkeyManager.getPressedKey(event);
        if("" !== keyString) {
            if(_hotkey[keyString]) {
                var gettedKey = _hotkey[keyString];
                "" !== gettedKey && keymap[gettedKey] && keymap[gettedKey].keyUp && keymap[gettedKey].keyUp()
            };
            hotkey_temp[keyString] = !1;
        }
    }, window.addKeyListeners = function() {
        window.onkeydown = function(event) {
            switch(event.keyCode) {
                case 81:
                    window.core && window.core.specialOn && window.core.specialOn();
                    P.targetSpec && f.targetFoucus(0);
                    break;
                case 27:
                    event.preventDefault();
                    window.MC.showNickDialog(300);
                    Q("#oferwallContainer").is(":visible") && window.closeOfferwall();
                    Q("#videoContainer").is(":visible") && window.closeVideoContainer();
                    Q("#oferwallContainer").is(":visible") && window.MC.onOffwerwallClose();
            }
        }, window.onkeyup = function(event) {
            81 == event.keyCode && window.core.specialOff && window.core.specialOff()
        }
    };
    window.onmousedown = function(event) {
        if(!Q("#overlays").is(":visible")) {
            if(2 == event.which) {
                event.preventDefault();
                Q("#chatbox").click();
            };
            if(1 == event.which) {
                GameSetting.mouseFeed && P.play && f.macroFeed(true) && event.preventDefault();
                P.selectTarget1 && f.findNearestCell(0, P.cursorX, P.cursorY);
                P.selectTarget2 && f.findNearestCell(1, P.cursorX, P.cursorY);
            };
            if(GameSetting.enableCommander && 3 == event.which) {
                event.preventDefault();
                P.setCursorPosition();
                P.play && f && f.sendCmd();
            }
        }
    }, window.onmouseup = function(event) {
        GameSetting.mouseFeed && (1 == event.which) && f && f.macroFeed(false)
    }, window.resetHotkeys = function() {
        _HotkeyManager && _HotkeyManager.resetHotkeys()
    }, window.saveHotkeys = function() {
        _HotkeyManager && _HotkeyManager.saveHotkeys(), Q("#hotkeys").hide()
    }, window.showHotkeys = function() {
        window.onkeydown = function() {}, Q("#hotkeys").show()
    }, window.closeHotkeys = function() {
        Q("#hotkeys").hide();
        Q("#hotkeys-cfg .table-row-selected").removeClass("table-row-selected");
    }
}(window.ogario, window.jQuery);

$(document).ready (function() {
    toastr.info ("Welcome to PionPlus");
});
