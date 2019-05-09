var MGxOne = function(e) {
    ! function(b, w, d) {
        function s() {
            this.txt = "", this.txtCanvas = null, this.txtCtx = null, this.color = "#FFFFFF", this.stroke = !1, this.strokeWidth = 2, this.strokeColor = "#000000", this.font = "700 16px Ubuntu", this.fontFamily = "Ubuntu", this.fontWeight = 700, this.fontSize = 16, this.margin = 3, this.scale = 1, this.quality = 1, this.measuredWidth = 0, this.redraw = !1, this.remeasure = !1, this.setTxt = function(e) {
                this.txt !== e && (this.txt = e, this.redraw = !0, this.remeasure = !0)
            }, this.setColor = function(e) {
                this.color !== e && (this.color = e, this.redraw = !0)
            }, this.setStroke = function(e) {
                this.stroke !== e && (this.stroke = e, this.redraw = !0)
            }, this.setStrokeWidth = function(e) {
                this.stroke && this.strokeWidth != e && (this.strokeWidth = e, this.redraw = !0, this.remeasure = !0)
            }, this.setStrokeColor = function(e) {
                this.stroke && this.strokeColor !== e && (this.strokeColor = e, this.redraw = !0)
            }, this.setFont = function() {
                this.font = this.fontWeight + " " + this.fontSize + "px " + this.fontFamily
            }, this.setFontFamily = function(e) {
                this.fontFamily !== e && (this.fontFamily = e, this.setFont(), this.redraw = !0, this.remeasure = !0)
            }, this.setFontWeight = function(e) {
                this.fontWeight != e && (this.fontWeight = e, this.setFont(), this.redraw = !0, this.remeasure = !0)
            }, this.setFontSize = function(e) {
                this.fontSize != e && (this.fontSize = e, this.margin = ~~(.2 * e), this.setFont(), this.redraw = !0)
            }, this.setScale = function(e) {
                this.scale != e && (this.scale = e, this.redraw = !0)
            }, this.createCanvas = function() {
                this.txtCanvas || (this.txtCanvas = document.createElement("canvas"), this.txtCtx = this.txtCanvas.getContext("2d"), "yote")
            }, this.setDrawing = function(n, t, e, r, s, o) {
                this.setColor(n), this.setFontFamily(t), this.setFontWeight(e), this.setStroke(r), this.setStrokeWidth(s), this.setStrokeColor(o)
            }, this.measureWidth = function() {
                return this.remeasure && (this.txtCtx.font = this.fontWeight + " 10px " + this.fontFamily, this.measuredWidth = this.txtCtx.measureText(this.txt).width, this.remeasure = !1), ~~(this.fontSize / 10 * this.measuredWidth) + 2 * this.strokeWidth
            }, this.drawTxt = function() {
                return this.createCanvas(), this.redraw && (this.redraw = !1, this.txtCanvas.width = this.measureWidth(), this.txtCanvas.height = this.fontSize + this.margin, this.txtCtx.font = this.font, this.txtCtx.globalAlpha = 1, this.txtCtx.lineWidth = this.strokeWidth, this.txtCtx.strokeStyle = this.strokeColor, this.txtCtx.fillStyle = this.color, this.stroke && this.txtCtx.strokeText(this.txt, this.strokeWidth, this.fontSize - this.margin / 2), this.txtCtx.fillText(this.txt, this.strokeWidth, this.fontSize - this.margin / 2)), this.txtCanvas
            }
        }

        function n(i, t, e, d, o, a, n, r, l, p) {
            this.id = i, this.x = t, this.y = e, this.targetX = t, this.targetY = e, this.color = o, this.oppColor = null, this.size = d, this.targetSize = d, this.alpha = 1, this.nick = "", this.targetNick = "", this.nickCanvas = null, this.mass = 0, this.lastMass = 0, this.kMass = 0, this.massCanvas = null, this.massTxt = "", this.margin = 0, this.scale = 1, this.nickScale = 1, this.massScale = 1, this.virMassScale = 3, this.strokeScale = 1, this.fontSize = 26, this.nickSize = 26, this.lastNickSize = 0, this.massSize = 26, this.virMassSize = 26, this.nickStrokeSize = 3, this.massStrokeSize = 3, this.isFood = a, this.isVirus = n, this.isPlayerCell = r, this.shortMass = l, this.virMassShots = p, this.rescale = !1, this.redrawNick = !0, this.redrawMass = !0, this.optimizedNames = !1, this.optimizedMass = !1, this.strokeNick = !1, this.strokeMass = !1, this.removed = !1, this.redrawed = 0, this.time = 0, this.skin = null, this.pi2 = 2 * Math.PI, this.update = function(n, t, e, r, s, o) {
                this.x = n, this.y = t, this.isVirus = r, this.isPlayerCell = s, this.setMass(e), this.setNick(o)
            }, this.removeCell = function() {
                this.removed = !0;
                var e = A.cells.indexOf(this); - 1 == e ? -1 != (e = A.food.indexOf(this)) && A.food.splice(e, 1) : (A.cells.splice(e, 1), B.virusesRange && -1 != (e = A.viruses.indexOf(this)) && A.viruses.splice(e, 1)), -1 != (e = A.playerCells.indexOf(this)) && (A.removePlayerCell = !0, A.playerCells.splice(e, 1), -1 != (e = A.playerCellIDs.indexOf(this.id)) && A.playerCellIDs.splice(e, 1)), B.suckAnimation ? this.redrawed && A.removedCells.push(this) : this.redrawed, delete A.indexedCells[this.id]
            }, this.moveCell = function() {
                var a = (A.time - this.time) / B.animation;
                if (!(a = 0 > a ? 0 : 1 < a ? 1 : a, this.x += (this.targetX - this.x) * a, this.y += (this.targetY - this.y) * a, this.size += (this.targetSize - this.size) * a, this.alpha = a, this.removed)) this.time = A.time;
                else if (1 == a) {
                    var o = A.removedCells.indexOf(this); - 1 != o && A.removedCells.splice(o, 1)
                }
            }, this.isInView = function() {
                return !(0 >= this.id) && !(this.x + this.size + 40 < A.viewX - A.canvasWidth / 2 / A.scale || this.y + this.size + 40 < A.viewY - A.canvasHeight / 2 / A.scale || this.x - this.size - 40 > A.viewX + A.canvasWidth / 2 / A.scale || this.y - this.size - 40 > A.viewY + A.canvasHeight / 2 / A.scale)
            }, this.setMass = function(e) {
                return this.size = e, !(40 >= e) && (this.massCanvas ? (this.mass = ~~(e * e / 100), this.redrawMass = !0, this.isVirus ? (this.virMassShots && 200 > this.mass && (this.mass = ~~((200 - this.mass) / 14)), this.massTxt = this.mass.toString(), !0) : (this.massTxt = this.mass.toString(), 200 >= this.mass || (this.shortMass && 1e3 <= this.mass ? (this.kMass = Math.round(this.mass / 100) / 10, this.massTxt = this.kMass + "k", !0) : (this.optimizedMass && (this.redrawMass = .02 <= Math.abs((this.mass - this.lastMass) / this.mass) || this.rescale), !0)))) : (this.massCanvas = new s, !1))
            }, this.setNick = function(e) {
                return this.nick = e, e && !this.isVirus && (!!this.nickCanvas || (this.nickCanvas = new s, !1))
            }, this.setScale = function(n, t, e, r, s) {
                var o = Math.ceil(10 * n) / 10;
                this.rescale = !1, this.scale != o && (this.scale = o, this.rescale = !0), this.nickScale = t, this.massScale = e, this.virMassScale = r, this.strokeScale = s
            }, this.setFontSize = function() {
                this.isVirus ? this.massSize = Math.ceil(this.virMassSize * this.scale * this.virMassScale) : (this.fontSize = Math.max(.3 * this.size, 26) * this.scale, this.nickSize = ~~(this.fontSize * this.nickScale), this.massSize = ~~(.5 * this.fontSize * this.massScale), this.redrawNick = !this.optimizedNames || .3 <= Math.abs((this.nickSize - this.lastNickSize) / this.nickSize) || this.rescale)
            }, this.setStrokeSize = function() {
                this.strokeNick && !this.isVirus && (this.nickStrokeSize = ~~(.1 * this.nickSize * this.strokeScale)), this.strokeMass && (this.massStrokeSize = ~~(.1 * this.massSize * this.strokeScale))
            }, this.setDrawing = function() {
                this.optimizedNames = B.optimizedNames, this.optimizedMass = B.optimizedMass, this.shortMass = B.shortMass, this.virMassShots = B.virMassShots, this.strokeNick = B.namesStroke, this.strokeMass = B.massStroke
            }, this.setDrawingScale = function() {
                this.setScale(w.viewScale, x.namesScale, x.massScale, x.virMassScale, x.strokeScale), this.setFontSize(), this.setStrokeSize(), this.margin = 0
            }, this.drawNick = function(a) {
                if (this.nick && this.nickCanvas && !this.isVirus) {
                    var t = this.nickCanvas;
                    t.setDrawing(x.namesColor, x.namesFontFamily, x.namesFontWeight, this.strokeNick, this.nickStrokeSize, x.namesStrokeColor), t.setTxt(this.nick), this.redrawNick && (t.setFontSize(this.nickSize), this.lastNickSize = this.nickSize), t.setScale(this.scale);
                    var e = t.drawTxt(),
                        n = ~~(e.width / this.scale),
                        s = ~~(e.height / this.scale);
                    this.margin = ~~(s / 2), a.drawImage(e, ~~this.x - ~~(n / 2), ~~this.y - this.margin, n, s)
                }
            }, this.drawMass = function(n) {
                if (this.massCanvas && !(40 >= this.size)) {
                    var t = this.massCanvas;
                    t.setDrawing(x.massColor, x.massFontFamily, x.massFontWeight, this.strokeMass, this.massStrokeSize, x.massStrokeColor), this.redrawMass && (t.setTxt(this.massTxt), this.lastMass = this.mass), t.setFontSize(this.massSize), t.setScale(this.scale);
                    var e = t.drawTxt(),
                        r = ~~(e.width / this.scale),
                        s = ~~(e.height / this.scale),
                        o = 0 == this.margin ? ~~this.y - ~~(s / 2) : ~~this.y + this.margin;
                    n.drawImage(e, ~~this.x - ~~(r / 2), o, r, s)
                }
            }, this.draw = function(l, t) {
                if (!(A.hideSmallBots && 76 >= this.size)) {
                    l.save(), this.redrawed++, t && this.moveCell(), this.removed && (l.globalAlpha *= 1 - this.alpha);
                    var e = l.globalAlpha,
                        i = !1,
                        d = this.isFood ? this.size + x.foodSize : this.size;
                    if (l.beginPath(), l.arc(this.x, this.y, d, 0, this.pi2, !1), l.closePath(), this.isFood) return l.fillStyle = this.color, l.fill(), void l.restore();
                    if (this.isVirus) return B.transparentViruses && (l.globalAlpha *= x.virusAlpha, i = !0), B.virColors && A.play ? (l.fillStyle = U.setVirusColor(d), l.strokeStyle = U.setVirusStrokeColor(d)) : (l.fillStyle = x.virusColor, l.strokeStyle = x.virusStrokeColor), l.fill(), i && (l.globalAlpha = e, i = !1), l.lineWidth = x.virusStrokeSize, B.virusGlow ? (l.shadowBlur = x.virusGlowSize, l.shadowColor = x.virusGlowColor) : "yeet", l.stroke(), B.showMass && B.showVirusMass && (this.setDrawing(), this.setDrawingScale(), B.virusGlow ? l.shadowBlur = 0 : "yote", this.setMass(this.size), this.drawMass(l)), void l.restore();
                    B.transparentCells && (l.globalAlpha *= x.cellsAlpha, i = !0);
                    var o = this.color;
                    A.play && (this.isPlayerCell ? B.myCustomColor && (o = D.color) : B.oppColors && !B.oppRings && (o = this.oppColor)), l.fillStyle = o, l.fill(), i && (l.globalAlpha = e, i = !1);
                    var p = null;
                    if (B.customSkins && A.showCustomSkins && (p = U.getCustomSkin(this.targetNick, this.color)) && (((B.transparentSkins || A.play && B.oppColors) && (!this.isPlayerCell || B.myTransparentSkin) || this.isPlayerCell && B.myTransparentSkin) && (l.globalAlpha *= x.skinsAlpha, i = !0), l.drawImage(p, this.x - d, this.y - d, 2 * d, 2 * d), i && (l.globalAlpha = e, i = !1)), B.teammatesInd && !this.isPlayerCell && 200 >= d && (p || U.checkSkinsMap(this.targetNick, this.color)) && R.drawTeammatesInd(l, this.x, this.y, d), B.noNames && !B.showMass || t) l.restore();
                    else {
                        var c = !1;
                        !this.isPlayerCell && (c = U.setAutoHideCellInfo(d)) && B.autoHideNames && B.autoHideMass ? l.restore() : (this.setDrawing(), this.setDrawingScale(), l.globalAlpha *= x.textAlpha, B.noNames || c && B.autoHideNames || this.isPlayerCell && B.hideMyName || p && B.hideTeammatesNames || this.setNick(this.targetNick) && this.drawNick(l), !B.showMass || c && B.autoHideMass || this.isPlayerCell && B.hideMyMass || B.hideEnemiesMass && !this.isPlayerCell && !this.isVirus || this.setMass(this.size) && this.drawMass(l), l.restore())
                    }
                }
            }
        }

        function r(e) {
            b.history && b.history.replaceState && b.history.replaceState({}, b.document.title, e)
        }

        function p() {
            var e = b.innerWidth,
                t = b.innerHeight,
                o = d("#helloContainer"),
                a = o.innerHeight();
            0 < a ? w.menuHeight = a : a = w.menuHeight || 618;
            var s = Math.min(1, t / a),
                r = a * s,
                i = Math.round(t / 2 - .5 * r),
                l = "translate(-50%, 0%) scale(" + s + ")";
            o.css("transform", l), o.css("-ms-transform", l), o.css("-webkit-transform", l), o.css("top", i + "px"), w.innerW = e, w.innerH = t
        }

        function t() {
            U.protocolMode || (b.onkeydown = function() {})
        }
        var c = null,
            m = null,
            u = {
                en: {
                    start: "Home",
                    settings: "Settings",
                    restoreSettings: "Restore default settings",
                    animationGroup: "Animation",
                    commanderGroup: "Commander",
                    glowGroup: "Glow [Turn Off If You Lag]",
                    zoomGroup: "Zoom",
                    respGroup: "Respawn",
                    namesGroup: "Names",
                    massGroup: "Mass",
                    skinsGroup: "Skins",
                    foodGroup: "Food",
                    transparencyGroup: "Transparency / Colors",
                    gridGroup: "Grid / Sectors",
                    miniMapGroup: "Minimap",
                    helpersGroup: "Helpers",
                    mouseGroup: "Mouse Control",
                    hudGroup: "HUD",
                    chatGroup: "Chat",
                    statsGroup: "Stats",
                    extrasGroup: "Extras",
                    noSkins: "No skins",
                    noNames: "No Names",
                    noColors: "No Colors",
                    showMass: "Show Mass",
                    showVirusMass: "Show Virus Mass",
                    skipStats: "Skip Stats After Death",
                    showQuest: "Show Quest",
                    autoZoom: "Auto Zoom",
                    animation: "Animation Delay",
                    cameraSpeed: "Camera Speed",
                    commanderDelay: "Commander Delay",
                    suckAnimation: "Cell Eat [Sucking] Animation",
                    virusGlow: "Virus Glow",
                    borderGlow: "Border Glow",
                    zoomSpeedValue: "Zoom Speed",
                    quickResp: "Quick Respawn [Hotkey]",
                    autoResp: "Auto Respawn",
                    autoHideCellsInfo: "Auto Hide Names And Mass",
                    autoHideNames: "Auto Hide Names",
                    autoHideMass: "Auto Hide Mass",
                    autoHideFood: "Auto Hide Food [Mass]",
                    autoHideFoodOnZoom: "Auto Hide Food [Zoom)]",
                    optimizedNames: "Optimized Names",
                    hideMyName: "Hide My Name",
                    hideTeammatesNames: "Hide Teammates Names",
                    optimizedMass: "Optimized Mass [+/-2%]",
                    shortMass: "Short Mass [K]",
                    virMassShots: "Virus Shots",
                    hideMyMass: "Hide My Mass",
                    hideEnemiesMass: "Hide Enemies Mass",
                    vanillaSkins: "Vanilla Skins",
                    customSkins: "Custom Skins",
                    myTransparentSkin: "My Transparent Skin",
                    myCustomColor: "My Custom Color",
                    transparentCells: "Transparent Cells",
                    transparentViruses: "Transparent Viruses",
                    transparentSkins: "Transparent Skins",
                    showGrid: "Show Grid",
                    showBgSectors: "Show Background Sectors",
                    showMapBorders: "Show Map Borders",
                    showGhostCells: "Ghost Cells",
                    showMiniMap: "Show Minimap",
                    showMiniMapGrid: "Show Minimap Grid",
                    showMiniMapGuides: "Show Minimap Guides",
                    showMiniMapGhostCells: "Show Ghost Cells",
                    oneColoredTeammates: "One-Colored Teammates",
                    optimizedFood: "Optimized Food",
                    rainbowFood: "Rainbow Food",
                    oppColors: "Opponents Colors",
                    oppRings: "Opponents Rings",
                    virColors: "Viruses Colors",
                    splitRange: "Split Range",
                    virusesRange: "Viruses Range",
                    textStroke: "Names And Mass Stroke",
                    namesStroke: "Names Stroke",
                    massStroke: "Mass Stroke",
                    cursorTracking: "Cursor Tracking",
                    teammatesInd: "Teammates Indicators",
                    mouseSplit: "LMB - Mouse Split",
                    mouseFeed: "RMB - Mouse Feed",
                    mouseInvert: "Invert mouse buttons",
                    disableChat: "Disable Chat",
                    hideChat: "Hide Chat",
                    chatSounds: "Sound Notifications",
                    chatEmoticons: "Emoticons",
                    showChatImages: "Show Images On Chat",
                    showChatVideos: "Show Videos On Chat",
                    showChatBox: "Chatbox Instead Of Popups",
                    messageSound: "Message Notification Sound",
                    commandSound: "Command Notification Sound",
                    showTop5: "Show Team Players",
                    showTargeting: "Show targeting",
                    showTime: "Show current time",
                    showLbData: "Show leaderboard mass",
                    normalLb: "\"Leaderboard\" header",
                    limLB: "Leaderboard Players Limit",
                    limTP: "Team Players Limit",
                    centeredLb: "Centered leaderboard",
                    fpsAtTop: "Game stats at the top",
                    showStats: "Show game stats",
                    showStatsMass: "Game stats: Mass",
                    showStatsSTE: "Game stats: STE",
                    showStatsMassSplit: "Game stats: X4 | X16 Mass Split",
                    showStatsN16: "Game stats: n/16",
                    showStatsFPS: "Game stats: FPS",
                    blockPopups: "Block popups (ads/shop/quest)",
                    hotkeys: "",
                    "hk-inst-assign": "To assign a hotkey click on the input field and press your chosen key.",
                    "hk-inst-delete": "To delete a hotkey click on the input field and press the DELETE key.",
                    "hk-inst-keys": "Possible key combinations with the CTRL and ALT keys.",
                    "hk-feed": "Feed",
                    "hk-macroFeed": "Macro feed",
                    "hk-split": "Split",
                    "hk-doubleSplit": "Double split",
                    "hk-split16": "Split 16",
                    "hk-pause": "Cell pause",
                    "hk-showTop5": "Show/hide Team Players",
                    "hk-showTime": "Show/hide current time",
                    "hk-showSplitRange": "Show/hide split range",
                    "hk-showSplitInd": "Show/hide split indicators",
                    "hk-showTeammatesInd": "Show/hide teammates indicators",
                    "hk-showOppColors": "Show/hide opponents colors",
                    "hk-toggleSkins": "Toggle skins (custom/default)",
                    "hk-showSkins": "Show/hide skins",
                    "hk-transparentSkins": "Toggle transparent skins",
                    "hk-showStats": "Show/hide game stats",
                    "hk-toggleCells": "Toggle own cells (smallest/biggest)",
                    "hk-showFood": "Show/hide food",
                    "hk-showGrid": "Show/hide grid",
                    "hk-showMiniMapGuides": "Show/hide minimap guides",
                    "hk-hideChat": "Show/hide chat",
                    "hk-showHUD": "Show/hide HUD",
                    "hk-copyLb": "Copy leaderboard",
                    "hk-showLb": "Show/hide leaderboard",
                    "hk-toggleAutoZoom": "Toggle auto zoom",
                    "hk-resetZoom": "Reset zoom",
                    "hk-zoomLevel": "Zoom level",
                    "hk-toggleDeath": "Toggle death location",
                    "hk-clearChat": "Show chat history / Clear chat",
                    "hk-showBgSectors": "Show/hide background sectors",
                    "hk-hideBots": "Show/hide small bots",
                    "hk-showNames": "Show/hide names",
                    "hk-hideTeammatesNames": "Show/hide teammates names",
                    "hk-showMass": "Show/hide mass",
                    "hk-showMiniMap": "Show/hide minimap",
                    "hk-chatMessage": "Enter chat message",
                    "hk-quickResp": "Quick respawn",
                    "hk-autoResp": "Toggle auto respawn",
                    "hk-switchServerMode": "Switch server [public/private]",
                    "hk-showTargeting": "Show/hide targeting panel",
                    "hk-setTargeting": "Start/stop targeting (following)",
                    "hk-cancelTargeting": "Cancel targeting",
                    "hk-changeTarget": "Change target",
                    "hk-privateMiniMap": "Show target on the minimap",
                    "hk-showQuest": "Show/hide quest",
                    commands: "Commands",
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
                    comm14: "Bottom!",
                    saveComm: "Save commands",
                    theme: "Theme",
                    restoreThemeSettings: "Restore theme default settings",
                    basicTheming: "Basic theming",
                    themePreset: "Theme preset",
                    themeType: "Theme type",
                    darkTheme: "Dark theme",
                    lightTheme: "Light theme",
                    mainColor: "Main color",
                    bgColor: "Background",
                    bordersColor: "Map borders",
                    gridColor: "Grid",
                    sectorsColor: "Sectors font",
                    namesColor: "Names",
                    namesStrokeColor: "Names stroke",
                    massColor: "Mass",
                    massStrokeColor: "Mass stroke",
                    virusColor: "Virus",
                    virusStrokeColor: "Virus stroke",
                    virusGlowColor: "Virus Glow",
                    borderGlowColor: "Border Glow",
                    foodColor: "Food",
                    namesFont: "Names font",
                    massFont: "Mass font",
                    sectorsFont: "Sectors font",
                    namesScale: "Names scale",
                    massScale: "Mass scale",
                    virMassScale: "Virus mass scale",
                    strokeScale: "Text stroke scale",
                    foodSize: "Food size",
                    bordersWidth: "Map borders width",
                    sectorsWidth: "Sectors grid width",
                    sectorsFontSize: "Sectors font size",
                    cellsAlpha: "Cells transparency",
                    skinsAlpha: "Skins transparency",
                    virusAlpha: "Virus transparency",
                    textAlpha: "Names & mass transparency",
                    virusStrokeSize: "Virus Stroke Size",
                    virusGlowSize: "Virus Glow Size",
                    borderGlowSize: "Border Glow Size",
                    teammatesIndColor: "Teammate indicator",
                    cursorTrackingColor: "Cursor tracking",
                    splitRangeColor: "Split range",
                    safeAreaColor: "Safe area",
                    dangerAreaColor: "Danger area",
                    ghostCellsColor: "Ghost cells",
                    color: "Self Color",
                    commanderImage: "Commander Image",
                    commanderImage1: "Commander Image [2]",
                    commanderImage2: "Commander Image [3]",
                    ghostCellsAlpha: "Ghost cells transparency",
                    menuTheming: "Menu",
                    menuPreset: "Menu theme",
                    menuMainColorMGx: "Main color",
                    menuPanelColorMGx: "Panel",
                    menuPanelColorMGx2: "Panel [2]",
                    menuPanelColorMGx3: "Panel [3]",
                    menuImg: "Panel Image",
                    menuImgOpacity: "Panel Image Opacity",
                    menuOpacity: "Transparency",
                    hudTheming: "HUD",
                    hudMainColor: "Main color",
                    hudColor: "Background",
                    hudTextColor: "Text",
                    statsHudColor: "Stats",
                    timeHudColor: "Time",
                    top5MassColor: "Mass",
                    lbMeColor: "Leaderboard - me",
                    lbTeammateColor: "Leaderboard - teammate",
                    hudFont: "HUD font",
                    hudScale: "HUD scale",
                    chatTheming: "Chat",
                    messageColor: "Message background",
                    messageTextColor: "Message text",
                    messageTimeColor: "Message time",
                    messageNickColor: "Message nick",
                    commandsColor: "Command background",
                    commandsTextColor: "Command text",
                    commandsTimeColor: "Command time",
                    commandsNickColor: "Command nick",
                    chatBoxColor: "Chatbox color",
                    chatScale: "Chat scale",
                    miniMapTheming: "Minimap",
                    miniMapSectorsColor: "Sectors",
                    miniMapSectorColor: "Current sector",
                    miniMapGuidesColor: "Guides",
                    miniMapNickColor: "Nick",
                    miniMapNickStrokeColor: "Nick stroke",
                    miniMapMyCellColor: "My cell",
                    miniMapMyCellStrokeColor: "My cell stroke",
                    miniMapTeammatesColor: "Teammates",
                    miniMapDeathLocationColor: "Death location",
                    miniMapFont: "Minimap font",
                    miniMapNickFont: "Nick font",
                    miniMapWidth: "Minimap width",
                    miniMapSectorsOpacity: "Sectors transparency",
                    miniMapNickSize: "Nick size",
                    miniMapNickStrokeSize: "Nick stroke size",
                    miniMapMyCellSize: "My cell size",
                    miniMapMyCellStrokeSize: "My cell stroke size",
                    miniMapTeammatesSize: "Teammates size",
                    miniMapGhostCellsColor: "Ghost cells",
                    miniMapGhostCellsAlpha: "Ghost cells transparency",
                    imagesTheming: "Graphics / cursors",
                    customBackground: "Custom background image",
                    customCursor: "Custom cursor image",
                    hideChatMsgA: "Chat is visible!",
                    hideChatMsgB: "Chat is hidden!",
                    showSkinsMsgA: "Skins are visible!",
                    showSkinsMsgB: "Skins are hidden!",
                    hideSmallBotsMsgA: "Small bots below 76 are visible!",
                    hideSmallBotsMsgB: "Small bots below 76 are hidden!",
                    autoRespMsgA: "Auto respawn is on!",
                    autoRespMsgB: "Auto respawn is off!",
                    autoZoomMsgA: "Auto zoom is on!",
                    autoZoomMsgB: "Auto zoom is off!",
                    targetNotSet: "Target not set",
                    targetDead: "Dead",
                    targetDistance: "Distance",
                    targetMass: "Mass altogether",
                    totalPartyPlayers: "Active players",
                    totalPartyMass: "Total mass",
                    exportImport: "Export / import settings",
                    exportSettings: "Export settings",
                    exportInfo: "To export selected settings copy the code below and save it to a text file encoded in Unicode.",
                    importSettings: "Import settings",
                    importInfo: "To import selected settings paste an exported code below and press the \"Import settings\" button.",
                    profile: "Profile",
                    profiles: "Profiles",
                    skins: "Skins",
                    moreSkins: "Add skins",
                    thanks: "Thanks to Awesome!",
                    saveSett: "Save settings",
                    saved: "Saved!",
                    resetSett: "Reset to default",
                    close: "Close",
                    enterChatMsg: "Enter chat message",
                    activeParties: "Active parties",
                    noActiveParties: "No active parties ;(",
                    playlist: "Playlist",
                    pause: "PAUSE!",
                    visit: "Visit",
                    exit: "Agar.io: Are you sure you want to quit the game?",
                    blockWarn: "WARNING! Popups are blocked in the settings.",
                    unblockPopups: "Temporary unblock",
                    mass: "Mass",
                    score: "Score",
                    leaderboard: "Leaderboard",
                    user: "User",
                    userMuted: "User %user% has been muted.",
                    userUnmuted: "User %user% has been unmuted.",
                    mute: "Mute",
                    unmute: "Unmute",
                    mutedUsers: "Muted users",
                    activeUsers: "Active users",
                    showActiveUsers: "Show active users",
                    none: "None",
                    sounds: "Sounds",
                    page_menu_main_free_coins: "Free Coins",
                    page_menu_main_gifts: "Gifts",
                    page_menu_main_dailyquests: "Daily Quest",
                    page_shop: "Shop"
                }
            },
            g = "en",
            f = b.navigator.language || b.navigator.userLanguage;
        f && u.hasOwnProperty(f) && (g = f);
        var y = u[g],
            l = {
                comm1: y.comm1,
                comm2: y.comm2,
                comm3: y.comm3,
                comm4: y.comm4,
                comm5: y.comm5,
                comm6: y.comm6,
                comm7: y.comm7,
                comm8: y.comm8,
                comm9: y.comm9,
                comm0: y.comm0,
                comm10: y.comm10,
                comm11: y.comm11,
                comm12: y.comm12,
                comm13: y.comm13,
                comm14: y.comm14
            },
            h = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;",
                "/": "&#x2F;"
            },
            S = {
                ":)": "smile.svg",
                ";)": "wink.svg",
                "=)": "smirk.svg",
                ":D": "grin.svg",
                "X-D": "xgrin.svg",
                "=D": "joy.svg",
                ":(": "sad.svg",
                ";(": "cry.svg",
                ":P": "tongue.svg",
                ";P": "tonguew.svg",
                ":*": "kiss.svg",
                "$)": "smileh.svg",
                "<3": "heart.svg",
                "8=)": "cool.svg",
                ":o": "astonished.svg",
                "(:|": "sweat.svg",
                ":|": "neutral.svg",
                ":\\": "unamused.svg",
                ":@": "pouting.svg",
                "|-)": "sleep.svg",
                "^_^": "relaxed.svg",
                "-_-": "expressionless.svg",
                $_$: "money.svg",
                "O:)": "angel.svg",
                "3:)": "devil.svg",
                "(poop)": "poo.svg",
                "(fuck)": "finger.svg",
                "(clap)": "clap.svg",
                "(ok)": "ok.svg",
                "(victory)": "victory.svg",
                "(y)": "thumb.svg",
                "(n)": "thumbd.svg"
            },
            M = {
                "ogario-v3": {
                    name: "Agar.io",
                    darkTheme: !0,
                    mainColor: "#ff006e",
                    bgColor: "#000000",
                    bordersColor: "#ffd7e9",
                    borderGlowColor: "ff006e",
                    gridColor: "#000513",
                    sectorsColor: "#000513",
                    namesColor: "#000000",
                    namesStrokeColor: "#ffffff",
                    massColor: "#000000",
                    massStrokeColor: "#ffffff",
                    virusColor: "#1e123d",
                    virusStrokeColor: "#ffd7e9",
                    virusGlowColor: "#ff006e",
                    foodColor: "#ff006e",
                    teammatesIndColor: "#ff006e",
                    cursorTrackingColor: "#ff006e",
                    splitRangeColor: "#ffffff",
                    safeAreaColor: "#ffffff",
                    dangerAreaColor: "#ff006e",
                    namesFont: "ubuntu-bold",
                    massFont: "ubuntu-bold",
                    sectorsFont: "ubuntu",
                    namesScale: 1,
                    massScale: 3,
                    foodSize: 5,
                    bordersWidth: 34,
                    sectorsWidth: 82,
                    sectorsFontSize: 1770,
                    cellsAlpha: .9,
                    skinsAlpha: .7,
                    virusAlpha: .6,
                    textAlpha: 1,
                    virusStrokeSize: 20,
                    virusGlowSize: 14,
                    borderGlowSize: 15,
                    menuPreset: "ogario-v3",
                    menuMainColorMGx: "#ff006e",
                    menuPanelColorMGx: "#14062b",
                    menuPanelColorMGx2: "#1a0d30",
                    menuPanelColorMGx3: "rgba(26,13,48,0.4)",
                    menuImg: "https://i.imgur.com/gW8l5rb.png",
                    menuImgOpacity: .55,
                    hudMainColor: "#ff006e",
                    hudColor: "rgba(36,36,36,0.63)",
                    hudTextColor: "#ffffff",
                    statsHudColor: "#ffffff",
                    timeHudColor: "#ff006e",
                    top5MassColor: "#00c2ff",
                    lbMeColor: "#ff006e",
                    lbTeammateColor: "#ff006e",
                    hudFont: "ubuntu-bold",
                    hudScale: 1,
                    messageColor: "rgba(0,0,0,0.4)",
                    messageTextColor: "#ffffff",
                    messageTimeColor: "#ff006e",
                    messageNickColor: "#ff006e",
                    commandsColor: "rgba(255,0,110,1)",
                    commandsTextColor: "#ffffff",
                    commandsTimeColor: "#ff006e",
                    commandsNickColor: "#ffffff",
                    chatBoxColor: "rgba(0,0,0,0.4)",
                    chatScale: 1,
                    miniMapSectorsColor: "#ffffff",
                    miniMapSectorColor: "#ff006e",
                    miniMapGuidesColor: "#ff006e",
                    miniMapNickColor: "#ffffff",
                    miniMapNickStrokeColor: "#000000",
                    miniMapMyCellColor: "#000000",
                    miniMapMyCellStrokeColor: "#ff006e",
                    miniMapTeammatesColor: "#ff006e",
                    miniMapDeathLocationColor: "#ff006e",
                    miniMapFont: "ubuntu-bold",
                    miniMapNickFont: "ubuntu-bold",
                    miniMapWidth: 205,
                    miniMapSectorsOpacity: .33,
                    miniMapNickSize: 11,
                    miniMapNickStrokeSize: 2,
                    miniMapMyCellSize: 7.5,
                    miniMapMyCellStrokeSize: 4,
                    miniMapTeammatesSize: 5.5,
                    customBackground: "",
                    customCursor: "https://cdn.ogario.ovh/static/img/cursors/cursor_01.cur"
                }
            },
            v = {
                "ogario-v3": {
                    name: "Agar.io",
                    menuMainColorMGx: "#ff006e",
                    menuPanelColorMGx: "#14062b",
                    menuPanelColorMGx2: "#1a0d30",
                    menuPanelColorMGx3: "rgba(26,13,48,0.4)",
                    menuImg: "https://i.imgur.com/gW8l5rb.png",
                    menuImgOpacity: .55
                }
            },
            x = {
                preset: "ogario-v3",
                darkTheme: !0,
                mainColor: "#ff006e",
                bgColor: "#000000",
                bordersColor: "#ffd7e9",
                borderGlowColor: "ff006e",
                gridColor: "#000513",
                sectorsColor: "#000513",
                namesColor: "#000000",
                namesStrokeColor: "#ffffff",
                massColor: "#000000",
                massStrokeColor: "#ffffff",
                virusColor: "#1e123d",
                virusStrokeColor: "#ffd7e9",
                virusGlowColor: "#ff006e",
                foodColor: "#ff006e",
                teammatesIndColor: "#ff006e",
                cursorTrackingColor: "#ff006e",
                splitRangeColor: "#ffffff",
                safeAreaColor: "#ffffff",
                dangerAreaColor: "#ff006e",
                namesFont: "ubuntu-bold",
                namesFontFamily: "Ubuntu",
                namesFontWeight: 700,
                massFont: "ubuntu-bold",
                massFontFamily: "Ubuntu",
                massFontWeight: 700,
                sectorsFont: "ubuntu",
                sectorsFontFamily: "Ubuntu",
                sectorsFontWeight: 400,
                sectorsX: 5,
                sectorsY: 5,
                namesScale: 1,
                massScale: 3,
                virMassScale: 3,
                strokeScale: 1,
                foodSize: 5,
                bordersWidth: 34,
                sectorsWidth: 82,
                sectorsFontSize: 1770,
                cellsAlpha: .9,
                skinsAlpha: .7,
                virusAlpha: .6,
                textAlpha: 1,
                ghostCellsAlpha: .66,
                virusStrokeSize: 20,
                virusGlowSize: 14,
                borderGlowSize: 14,
                menuPreset: "ogario-v3",
                menuMainColorMGx: "#ff006e",
                menuPanelColorMGx: "#14062b",
                menuPanelColorMGx2: "#1a0d30",
                menuPanelColorMGx3: "rgba(26,13,48,0.4)",
                menuImg: "https://i.imgur.com/gW8l5rb.png",
                menuImgOpacity: .55,
                hudMainColor: "#ff006e",
                hudColor: "rgba(36,36,36,0.63)",
                hudTextColor: "#ffffff",
                statsHudColor: "#ffffff",
                timeHudColor: "#ff006e",
                top5MassColor: "#00c2ff",
                lbMeColor: "#ff006e",
                lbTeammateColor: "#ff006e",
                hudFont: "ubuntu-bold",
                hudFontFamily: "Ubuntu",
                hudFontWeight: 700,
                hudScale: 1,
                messageColor: "rgba(0,0,0,0.4)",
                messageTextColor: "#ffffff",
                messageTimeColor: "#ff006e",
                messageNickColor: "#ff006e",
                commandsColor: "rgba(255,0,110,1)",
                commandsTextColor: "#ffffff",
                commandsTimeColor: "#ff006e",
                commandsNickColor: "#ffffff",
                chatBoxColor: "rgba(0,0,0,0.4)",
                chatScale: 1,
                miniMapSectorsColor: "#ffffff",
                miniMapSectorColor: "#ff006e",
                miniMapGuidesColor: "#ff006e",
                miniMapNickColor: "#ffffff",
                miniMapNickStrokeColor: "#000000",
                miniMapMyCellColor: "#000000",
                miniMapMyCellStrokeColor: "#ff006e",
                miniMapTeammatesColor: "#ff006e",
                miniMapDeathLocationColor: "#ff006e",
                miniMapGhostCellsColor: "#00c2ff",
                color: "#ff006e",
                commanderImage: "https://i.imgur.com/c3B84HD.png",
                commanderImage1: "https://i.imgur.com/9KgFrgX.png",
                commanderImage2: "https://i.imgur.com/cLeb3EE.png",
                miniMapFont: "ubuntu-bold",
                miniMapFontFamily: "Ubuntu",
                miniMapFontWeight: 700,
                miniMapNickFont: "ubuntu-bold",
                miniMapNickFontFamily: "Ubuntu",
                miniMapNickFontWeight: 700,
                miniMapWidth: 205,
                miniMapSectorsOpacity: .33,
                miniMapNickSize: 11,
                miniMapNickStrokeSize: 2,
                miniMapMyCellSize: 7.5,
                miniMapMyCellStrokeSize: 4,
                miniMapTeammatesSize: 5.5,
                miniMapGhostCellsAlpha: .65,
                customBackground: "",
                customCursor: "https://cdn.ogario.ovh/static/img/cursors/cursor_01.cur"
            },
            P = {
                menuMainColorCSS: null,
                menuPanelColorCSS: null,
                menuTextlColorCSS: null,
                menuButtonsCSS: null,
                hudCSS: null,
                chatCSS: null,
                chatScaleCSS: null,
                cursorCSS: null,
                loadThemeSettings: function() {
                    var e = null;
                    for (var a in null !== b.localStorage.getItem("MGxThemeSettings") && (e = JSON.parse(b.localStorage.getItem("MGxThemeSettings"))), x) x.hasOwnProperty(a) && (e && e.hasOwnProperty(a) && (x[a] = e[a]), w.hasOwnProperty(a) && (w[a] = x[a]))
                },
                saveThemeSettings: function() {
                    b.localStorage.setItem("MGxThemeSettings", JSON.stringify(x))
                },
                restoreThemeSettings: function() {
                    null !== b.localStorage.getItem("MGxThemeSettings") && (b.localStorage.removeItem("MGxThemeSettings"), b.location.reload())
                },
                addCustomCSS: function(a, t) {
                    this[a] || (this[a] = d("<style type='text/css'>").appendTo("head")), this[a].html(t)
                },
                addPresetBox: function(s, t, e, i, o) {
                    for (var a in d(s).append("<div class=\"preset-box\"><span class=\"title-box\">" + y[t] + "</span><div class=\"select-wrapper\"><select id=\"" + t + "\" class=\"form-control\"></select></div></div>"), e) e.hasOwnProperty(a) && d("#" + t).append("<option value=\"" + a + "\">" + e[a].name + "</option>");
                    d("#" + t).val(x[i]);
                    var n = this;
                    d("#" + t).on("change", function() {
                        var e = this.value;
                        x[i] = e, n[o](e)
                    })
                },
                addColorBox: function(s, n, e) {
                    if (d(s).append("<div class=\"color-box\"><span class=\"title-box\">" + y[n] + "</span><div class=\"input-group " + n + "-picker\"><input type=\"text\" value=\"" + x[n] + "\" id=\"" + n + "\" class=\"form-control\" /><span class=\"input-group-addon\"><i></i></span></div></div>"), e) {
                        var o = this;
                        d(s + " ." + n + "-picker").colorpicker({
                            format: "hex"
                        }).on("changeColor.colorpicker", function(a) {
                            x[n] = a.color.toHex(), w.hasOwnProperty(n) && (w[n] = x[n]), o[e]()
                        })
                    } else d(s + " ." + n + "-picker").colorpicker({
                        format: "hex"
                    }).on("changeColor.colorpicker", function(e) {
                        x[n] = e.color.toHex(), w.hasOwnProperty(n) && (w[n] = x[n])
                    })
                },
                addRgbaColorBox: function(s, n, e) {
                    if (d(s).append("<div class=\"color-box\"><span class=\"title-box\">" + y[n] + "</span><div class=\"input-group " + n + "-picker\"><input type=\"text\" value=\"" + x[n] + "\" id=\"" + n + "\" class=\"form-control\" /><span class=\"input-group-addon\"><i></i></span></div></div>"), e) {
                        var o = this;
                        d(s + " ." + n + "-picker").colorpicker({
                            format: "rgba"
                        }).on("changeColor.colorpicker", function(a) {
                            var t = a.color.toRGB();
                            x[n] = "rgba(" + t.r + "," + t.g + "," + t.b + "," + t.a + ")", w.hasOwnProperty(n) && (w[n] = x[n]), o[e]()
                        })
                    } else d(s + " ." + n + "-picker").colorpicker({
                        format: "rgba"
                    }).on("changeColor.colorpicker", function(e) {
                        var t = e.color.toRGB();
                        x[n] = "rgba(" + t.r + "," + t.g + "," + t.b + "," + t.a + ")", w.hasOwnProperty(n) && (w[n] = x[n])
                    })
                },
                addSliderBox: function(s, i, e, t, a, o) {
                    if (d(s).append("<div class=\"slider-box\"><div class=\"box-label\"><span class=\"value-label\">" + y[i] + ": </span><span id=\"" + i + "-value\" class=\"value\">" + x[i] + "</span></div><input id=\"" + i + "-slider\" type=\"range\" min=\"" + e + "\" max=\"" + t + "\" step=\"" + a + "\" value=\"" + x[i] + "\"></div>"), o) {
                        var n = this;
                        d("#" + i + "-slider").on("input", function() {
                            var e = parseFloat(d(this).val());
                            d("#" + i + "-value").text(e), x[i] = e, w.hasOwnProperty(i) && (w[i] = e), n[o]()
                        })
                    } else d("#" + i + "-slider").on("input", function() {
                        var e = parseFloat(d(this).val());
                        d("#" + i + "-value").text(e), x[i] = e, w.hasOwnProperty(i) && (w[i] = e)
                    })
                },
                addInputBox: function(s, t, e, n) {
                    d(s).append("<div class=\"input-box\"><span class=\"title-box\">" + y[t] + "</span><input id=\"" + t + "\" class=\"form-control\" placeholder=\"" + e + "\" value=\"" + x[t] + "\" /></div>");
                    var o = this;
                    d("#" + t).on("input", function() {
                        x[t] = this.value, o[n]()
                    })
                },
                addCursorBox: function(a, t) {
                    t === x.customCursor ? d(a).append("<div class=\"cursor-box\"><a href=\"#\" class=\"active\"><img src=\"" + t + "\"></a></div>") : d(a).append("<div class=\"cursor-box\"><a href=\"#\"><img src=\"" + t + "\"></a></div>")
                },
                setFont: function(a, t) {
                    x[a] = t, x[a + "Family"] = this.setFontFamily(t), x[a + "Weight"] = this.setFontWeight(t), w.hasOwnProperty(a + "Family") && (w[a + "Family"] = x[a + "Family"]), w.hasOwnProperty(a + "Weight") && (w[a + "Weight"] = x[a + "Weight"])
                },
                addFontBox: function(a, s, e) {
                    d(a).append("<div class=\"font-box\"><span class=\"title-box\">" + y[s] + "</span><div class=\"select-wrapper\"><select id=\"" + s + "\" class=\"form-control\"></select></div></div>"), d("#" + s).append("<option value=\"ubuntu\">Ubuntu</option><option value=\"ubuntu-bold\">Ubuntu Bold</option>"), d("#" + s).append("<option value=\"roboto\">Roboto</option><option value=\"roboto-bold\">Roboto Bold</option>"), d("#" + s).append("<option value=\"oswald\">Oswald</option><option value=\"oswald-bold\">Oswald Bold</option>"), d("#" + s).val(x[s]);
                    var n = this;
                    e ? d("#" + s).on("change", function() {
                        var a = this.value;
                        n.setFont(s, a), n[e]()
                    }) : d("#" + s).on("change", function() {
                        var e = this.value;
                        n.setFont(s, e)
                    })
                },
                setFontFamily: function(e) {
                    return -1 == e.indexOf("roboto") ? -1 == e.indexOf("oswald") ? "Ubuntu" : "Oswald" : "Roboto"
                },
                setFontWeight: function(e) {
                    return -1 == e.indexOf("bold") ? 400 : 700
                },
                setThemeMenu: function() {
                    var a = this;
                    this.addPresetBox("#theme-main", "themePreset", M, "preset", "changeThemePreset"), this.addColorBox("#theme-main", "bgColor", "setBgColor"), this.addColorBox("#theme-main", "bordersColor"), this.addColorBox("#theme-main", "borderGlowColor"), this.addColorBox("#theme-main", "gridColor"), this.addColorBox("#theme-main", "sectorsColor"), this.addColorBox("#theme-main", "namesColor"), this.addColorBox("#theme-main", "namesStrokeColor"), this.addColorBox("#theme-main", "massColor"), this.addColorBox("#theme-main", "massStrokeColor"), this.addColorBox("#theme-main", "virusColor"), this.addColorBox("#theme-main", "virusStrokeColor"), this.addColorBox("#theme-main", "virusGlowColor"), this.addColorBox("#theme-main", "foodColor", "setFoodColor"), this.addColorBox("#theme-main", "teammatesIndColor", "setIndicatorColor"), this.addColorBox("#theme-main", "cursorTrackingColor"), this.addColorBox("#theme-main", "splitRangeColor"), this.addColorBox("#theme-main", "safeAreaColor"), this.addColorBox("#theme-main", "dangerAreaColor"), this.addColorBox("#theme-main", "ghostCellsColor"), this.addColorBox("#theme-main", "color"), this.addInputBox("#theme-main", "commanderImage", "Image URL"), this.addInputBox("#theme-main", "commanderImage1", "Image URL"), this.addInputBox("#theme-main", "commanderImage2", "Image URL"), this.addFontBox("#theme-main", "namesFont"), this.addFontBox("#theme-main", "massFont"), this.addFontBox("#theme-main", "sectorsFont"), this.addSliderBox("#theme-main", "sectorsFontSize", 200, 2e3, 10), this.addSliderBox("#theme-main", "namesScale", .5, 2, .1), this.addSliderBox("#theme-main", "massScale", 1, 5, 1), this.addSliderBox("#theme-main", "virMassScale", 1, 5, 1), this.addSliderBox("#theme-main", "strokeScale", 1, 4, .1), this.addSliderBox("#theme-main", "foodSize", 1, 50, 1, "setFoodColor"), this.addSliderBox("#theme-main", "virusStrokeSize", 2, 40, 1), this.addSliderBox("#theme-main", "virusGlowSize", 0, 40, 1), this.addSliderBox("#theme-main", "borderGlowSize", 0, 40, 1), this.addSliderBox("#theme-main", "bordersWidth", 2, 200, 2), this.addSliderBox("#theme-main", "sectorsWidth", 2, 200, 2), this.addSliderBox("#theme-main", "cellsAlpha", .01, .99, .01), this.addSliderBox("#theme-main", "skinsAlpha", .01, .99, .01), this.addSliderBox("#theme-main", "virusAlpha", 0, 1, .01), this.addSliderBox("#theme-main", "textAlpha", .1, 1, .01), this.addSliderBox("#theme-main", "ghostCellsAlpha", .01, .99, .01), this.addColorBox("#theme-menu", "menuMainColorMGx", "setMenuMainColor"), this.addColorBox("#theme-menu", "menuPanelColorMGx", "setMenuPanelColor"), this.addColorBox("#theme-menu", "menuPanelColorMGx2", "setMenuPanelColor"), this.addRgbaColorBox("#theme-menu", "menuPanelColorMGx3", "setMenuPanelColor"), this.addInputBox("#theme-menu", "menuImg", "Image URL", "setMenuBg"), this.addSliderBox("#theme-menu", "menuImgOpacity", 0, 1, .01, "setMenuOpacity"), this.addColorBox("#theme-hud", "hudMainColor", "setHudColors"), this.addRgbaColorBox("#theme-hud", "hudColor", "setHudColors"), this.addColorBox("#theme-hud", "hudTextColor", "setHudColors"), this.addColorBox("#theme-hud", "statsHudColor", "setHudColors"), this.addColorBox("#theme-hud", "timeHudColor", "setHudColors"), this.addColorBox("#theme-hud", "top5MassColor", "setHudColors"), this.addColorBox("#theme-hud", "lbMeColor", "setHudColors"), this.addColorBox("#theme-hud", "lbTeammateColor", "setHudColors"), this.addFontBox("#theme-hud", "hudFont", "setHudFont"), this.addSliderBox("#theme-hud", "hudScale", 1, 2, .01, "setHudScale"), this.addRgbaColorBox("#theme-chat", "messageColor", "setChatColors"), this.addColorBox("#theme-chat", "messageTextColor", "setChatColors"), this.addColorBox("#theme-chat", "messageTimeColor", "setChatColors"), this.addColorBox("#theme-chat", "messageNickColor", "setChatColors"), this.addRgbaColorBox("#theme-chat", "commandsColor", "setChatColors"), this.addColorBox("#theme-chat", "commandsTextColor", "setChatColors"), this.addColorBox("#theme-chat", "commandsTimeColor", "setChatColors"), this.addColorBox("#theme-chat", "commandsNickColor", "setChatColors"), this.addRgbaColorBox("#theme-chat", "chatBoxColor", "setChatColors"), this.addSliderBox("#theme-chat", "chatScale", 1, 2, .01, "setChatScale"), this.addColorBox("#theme-minimap", "miniMapSectorsColor", "setMiniMapSectorsColor"), this.addColorBox("#theme-minimap", "miniMapSectorColor"), this.addColorBox("#theme-minimap", "miniMapNickColor"), this.addColorBox("#theme-minimap", "miniMapNickStrokeColor"), this.addColorBox("#theme-minimap", "miniMapMyCellColor"), this.addColorBox("#theme-minimap", "miniMapMyCellStrokeColor"), this.addColorBox("#theme-minimap", "miniMapTeammatesColor"), this.addColorBox("#theme-minimap", "miniMapDeathLocationColor"), this.addColorBox("#theme-minimap", "miniMapGuidesColor"), this.addColorBox("#theme-minimap", "miniMapGhostCellsColor"), this.addFontBox("#theme-minimap", "miniMapFont", "setMiniMapFont"), this.addFontBox("#theme-minimap", "miniMapNickFont"), this.addSliderBox("#theme-minimap", "miniMapWidth", 200, 400, 1, "setMiniMapWidth"), this.addSliderBox("#theme-minimap", "miniMapSectorsOpacity", 0, 1, .01, "setMiniMapSectorsOpacity"), this.addSliderBox("#theme-minimap", "miniMapNickSize", 8, 16, 1), this.addSliderBox("#theme-minimap", "miniMapNickStrokeSize", 0, 6, 1), this.addSliderBox("#theme-minimap", "miniMapMyCellSize", 4, 10, .5), this.addSliderBox("#theme-minimap", "miniMapMyCellStrokeSize", 0, 10, 1), this.addSliderBox("#theme-minimap", "miniMapTeammatesSize", 4, 10, .5), this.addSliderBox("#theme-minimap", "miniMapGhostCellsAlpha", .01, .99, .01), this.addInputBox("#theme-images", "customBackground", "Image URL", "setCustomBackground"), this.addInputBox("#theme-images", "customCursor", "Cursor image URL", "setCustomCursor");
                    for (var e = 0; 35 > e; e++) 9 > e ? this.addCursorBox("#theme-images", "https://cdn.ogario.ovh/static/img/cursors/cursor_0" + (e + 1) + ".cur") : this.addCursorBox("#theme-images", "https://cdn.ogario.ovh/static/img/cursors/cursor_" + (e + 1) + ".cur");
                    d(document).on("click", "#theme-images .cursor-box a", function(t) {
                        t.preventDefault();
                        var e = d("img", this).attr("src");
                        x.customCursor = e, a.setCustomCursor(), d("#customCursor").val(e), d("#theme-images .cursor-box a").removeClass("active"), d(this).addClass("active")
                    }), d("#theme").append("<button class=\"btn btn-block btn-success btn-save\"\">" + y.saveSett + "</button>"), d(document).on("click", "#theme .btn-save", function(t) {
                        t.preventDefault();
                        var e = d(this);
                        e.text(y.saved), a.saveThemeSettings(), setTimeout(function() {
                            e.text(y.saveSett)
                        }, 500)
                    }), d("#theme").append("<div class=\"restore-settings\"><a href=\"#\">" + y.restoreThemeSettings + "</a></div>"), d(document).on("click", "#theme .restore-settings a", function(t) {
                        t.preventDefault(), a.restoreThemeSettings()
                    }), d(".skin").colorpicker({
                        format: "hex",
                        input: "#color"
                    })
                },
                changePreset: function(a, s) {
                    if (s[a])
                        for (var e in x[a] = a, a = s[a], a) a.hasOwnProperty(e) && x.hasOwnProperty(e) && (x[e] = a[e], w.hasOwnProperty(e) && (w[e] = x[e]), d("#theme ." + e + "-picker") && d("#theme ." + e + "-picker").colorpicker("setValue", x[e]), d("#" + e + "-slider") && d("#" + e + "-slider").val(x[e]).change(), (d("input[type=text]#" + e) || d("select#" + e)) && d("#" + e).val(x[e]))
                },
                changeThemePreset: function(e) {
                    this.changePreset(e, M), this.setTheme()
                },
                setFonts: function() {
                    this.setFont("namesFont", x.namesFont), this.setFont("massFont", x.namesFont), this.setFont("sectorsFont", x.sectorsFont)
                },
                setBgColor: function() {
                    d("body").css("background-color", x.bgColor)
                },
                setFoodColor: function() {
                    B.optimizedFood && R && R.preDrawPellet()
                },
                setIndicatorColor: function() {
                    R && R.preDrawIndicator()
                },
                setCustomBackground: function() {
                    x.customBackground ? d("body").css("background-image", "url(" + x.customBackground + ")") : d("body").css("background-image", "none")
                },
                setCustomCursor: function() {
                    if (x.customCursor) var e = "*{cursor:url(" + x.customCursor + "), auto !important}";
                    else e = "*{cursor: auto}";
                    this.addCustomCSS("cursorCSS", e)
                },
                setMenu: function() {
                    this.setMenuOpacity(), this.setMenuMainColor(), this.setMenuPanelColor(), this.setMenuTextColor(), this.setMenuBg()
                },
                changeMenuPreset: function(e) {
                    this.changePreset(e, v), this.setMenu()
                },
                setMenuOpacity: function() {
                    d(".menu-image").css("opacity", x.menuImgOpacity)
                },
                setMenuMainColor: function() {
                    var e = "::-moz-selection{background-color:" + x.menuMainColorMGx + "!important}::selection{background-color:" + x.menuMainColorMGx + "!important}.menu-main-color,#quick-menu a:hover,.quick,.quick:focus,.menu-tabs a:hover,.menu-tabs .active,.submenu-tabs a:hover,.submenu-tabs .active,#stats center,#exp-imp h1{color:" + x.menuMainColorMGx + "}#exp-bar .progress-bar-striped,.quick:hover,.rangeslider__fill{background-color:" + x.menuMainColorMGx + "}#main-menu,.agario-side-panel,#hotkeys,#exp-imp{border-color:" + x.menuMainColorMGx + "}.ps-scrollbar-y, .btn-setting, #join-party-btn-2, #create-party-btn-2{background-color:" + x.menuMainColorMGx + "!important}a,a:hover, .btnmgx{color:" + x.menuMainColorMGx + "}.btn,#hotkeys-cfg .custom-key-in{color:#FFF;}.btn-primary{background-color:" + x.menuMainColorMGx + "!important}.btn-primary:active,.btn-primary:disabled,.btn-primary:focus,.btn-primary:hover{background-color:" + x.menuMainColorMGx + "!important}.btn-success{background-color:" + x.menuMainColorMGx + "!important}.btn-success:active,.btn-success:disabled,.btn-success:focus,.btn-success:hover{background-color:" + x.menuMainColorMGx + "!important}.btn-warning{background-color:" + x.menuMainColorMGx + "!important}.btn-warning:active,.btn-warning:disabled,.btn-warning:focus,.btn-warning:hover{background-color:" + x.menuMainColorMGx + "!important}.btn-danger{background-color:" + x.menuMainColorMGx + "!important}.btn-danger:active,.btn-danger:disabled,.btn-danger:focus,.btn-danger:hover, .restore-settings{background-color:" + x.menuMainColorMGx + "!important}#hotkeys-cfg .custom-key-in{background-color:" + x.menuMainColorMGx + ";border-color:" + x.menuMainColorMGx + "}.menu-bar-button:hover, .barf {border-bottom: 3px solid " + x.menuMainColorMGx + "}hr{border-top: 1px solid " + x.menuMainColorMGx + "}";
                    this.addCustomCSS("menuMainColorCSS", e)
                },
                setMenuPanelColor: function() {
                    var e = "#main-menu,.agario-side-panel,#hotkeys,#exp-imp, #panelm, #panelx, .menu-panel, .menu-bar-button, #ip-box, #pa-box{background-color: " + x.menuPanelColorMGx + "}.form-control, .input-group-addon, .agario-panel input,.agario-panel select,.agario-side-panel input,.agario-side-panel select,.input-group-addon,.nick .input-group-btn,.skin .input-group-btn,#stream-mode,#hide-url,.menu-tabs a:hover,.menu-tabs .active,.submenu-tabs,#exp-bar .progress,#quick-menu a:hover,.quick,.select-wrapper,#hotkeys-cfg div.row:hover,#hotkeys-cfg .command-in,#exp-imp-settings textarea{background-color: " + x.menuPanelColorMGx2 + "}.agario-panel h5,.agario-side-panel h5,#stats h2,.menu-tabs,.submenu-tabs,#skins a.default,#stats hr,#hotkeys-cfg div.row, #exp-imp h1{border-color: " + x.menuPanelColorMGx2 + "}.quick:hover,#skins a,#profiles{color:" + x.menuPanelColorMGx2 + "}#panelmgx, .menu-bar{background-color:" + x.menuPanelColorMGx3 + "!important}.skin-wheel-bg{border: 70px solid " + x.menuPanelColorMGx3 + "!important;}";
                    this.addCustomCSS("menuPanelColorCSS", e)
                },
                setMenuTextColor: function() {
                    this.addCustomCSS("menuTextColorCSS", ".agario-panel,.agario-side-panel,.agario-panel input,.agario-panel select,.agario-side-panel input,.agario-side-panel select,.input-group-addon,.dark .yt-username,#stream-mode,#hide-url,.menu-tabs a,.submenu-tabs a,#skins a.default:hover,#quick-menu a,#prev-profile.default:hover,#next-profile.default:hover,#statsText,#hotkeys,#hotkeys-cfg .command-in,#exp-imp{color:#fff;}::-webkit-input-placeholder{color:#fff!important;}::-moz-placeholder{color:#fff!important;}#user-id-tag, #version-tag,#statsSubtext,#hotkeys-inst,#exp-imp textarea,.restore-settings a,.restore-settings a:hover{color:#fff;}#hotkeys-cfg .command-in,#theme .color-box{border-color: #fff;}")
                },
                setMenuBg: function() {
                    d("#menuImg").val(x.menuImg), x.menuImg ? d(".menu-image").css("background-image", "url(" + x.menuImg + ")") : d(".menu-image").css("background-image", "none")
                },
                setHud: function() {
                    this.setHudColors(), this.setHudFont(), this.setHudScale()
                },
                setHudColors: function() {
                    var e = ".hud-main-color,#top5-hud a,#target-panel-hud a:hover,#target-panel-hud a.active,#message-menu a{color:" + x.hudMainColor + "}.hud,.hud-b,#chat-emoticons{background-color:" + x.hudColor + "}.hud,.hud-b,#top5-hud a:hover,#target-panel-hud a{color:" + x.hudTextColor + "}.stats-hud-color{color:" + x.statsHudColor + "}.time-hud-color{color:" + x.timeHudColor + "}.top5-mass-color{color:" + x.top5MassColor + "}#leaderboard-positions .me{color:" + x.lbMeColor + "}#leaderboard-positions .teammate{color:" + x.lbTeammateColor + "}#player{background: linear-gradient(to right," + x.hudColor + ",rgba(255,255,255,0));}";
                    this.addCustomCSS("hudCSS", e)
                },
                setHudFont: function() {
                    this.setFont("hudFont", x.hudFont), d("#overlays-hud").css({
                        "font-family": x.hudFontFamily,
                        "font-weight": x.hudFontWeight
                    })
                },
                setHudScale: function() {
                    var s = Math.round(20 * x.hudScale),
                        t = Math.round(200 * x.hudScale),
                        e = Math.floor(55 * x.hudScale),
                        i = Math.floor(6 * x.hudScale),
                        o = Math.floor(280 * x.hudScale),
                        a = Math.floor(85 * x.hudScale),
                        n = Math.floor(20 * x.hudScale);
                    d("#overlays-hud").css("font-size", s + "px"), d("#leaderboard-hud, #time-hud").width(t), d("#top5-hud").width(t + 30).css("top", e + "px"), d("#top5-pos").css("padding-left", i + "px"), d("#time-hud").css("top", o + "px"), d("#pause-hud").css("top", a + "px"), d("#target-hud").css("padding-top", n + "px")
                },
                setChat: function() {
                    this.setChatColors(), this.setChatScale()
                },
                setChatColors: function() {
                    var e = "#message,#messages li,.toast-success{background-color:" + x.messageColor + "}#message,.message-text,.toast-success .message-text{color:" + x.messageTextColor + "}.message-nick,.mute-user,.mute-user:hover,.toast-success .message-nick,.toast .mute-user,.toast .mute-user:hover{color:" + x.messageNickColor + "}.message-time{color:" + x.messageTimeColor + "}.toast-warning{background-color:" + x.commandsColor + "}.command-text,.toast-warning .command-text{color:" + x.commandsTextColor + "}.command-nick,.toast-warning .command-nick,.toast-warning .mute-user,.toast-warning .mute-user:hover{color:" + x.commandsNickColor + "}.command-time{color:" + x.commandsTimeColor + "}#chat-box{background-color:" + x.chatBoxColor + "}";
                    this.addCustomCSS("chatCSS", e)
                },
                setChatScale: function() {
                    var s = Math.round(14 * x.chatScale),
                        t = Math.round(280 * x.chatScale),
                        e = Math.round(350 * x.chatScale),
                        n = Math.round(300 * x.chatScale),
                        o = Math.floor(14 * x.chatScale);
                    d("#message-box, #messages, #toast-container, #chat-box").css("font-size", s + "px"), d("#messages, #toast-container, #chat-box").width(t), d("#message-box").width(e), d("#chat-box").height(n), d(".user-list").css("padding-left", o + "px");
                    this.addCustomCSS("chatScaleCSS", "#toast-container{width:" + t + "px;font-size:" + s + "px}")
                },
                setMiniMap: function() {
                    this.setMiniMapFont(), this.setMiniMapWidth(), this.setMiniMapSectorsOpacity()
                },
                setMiniMapFont: function() {
                    this.setFont("miniMapFont", x.miniMapFont), U && U.resetMiniMapSectors()
                },
                setMiniMapWidth: function() {
                    var e = x.miniMapWidth / 200;
                    x.miniMapTop = e, d("#minimap-hud").css({
                        width: x.miniMapWidth,
                        height: x.miniMapWidth
                    }), d("#fps-hud").css({
                        bottom: x.miniMapWidth + 10
                    }), U && U.resetMiniMapSectors()
                },
                setMiniMapSectorsColor: function() {
                    U && U.resetMiniMapSectors()
                },
                setMiniMapSectorsOpacity: function() {
                    d("#minimap-sectors").css("opacity", x.miniMapSectorsOpacity)
                },
                setTheme: function() {
                    this.setFonts(), this.setBgColor(), this.setCustomBackground(), this.setCustomCursor(), this.setMenu(), this.setHud(), this.setChat(), this.setMiniMap()
                },
                init: function() {
                    this.loadThemeSettings()
                }
            },
            I = [],
            D = {
                nick: "I <3 MGx",
                clanTag: "MGx",
                skinURL: "https://i.imgur.com/L4X5ArV.png",
                color: x.mainColor
            },
            B = {
                quickResp: !0,
                autoResp: !1,
                autoZoom: !1,
                autoHideNames: !0,
                autoHideMass: !0,
                autoHideFood: !1,
                autoHideFoodOnZoom: !1,
                noNames: !1,
                optimizedNames: !0,
                hideMyName: !0,
                hideTeammatesNames: !1,
                showMass: !0,
                showVirusMass: !0,
                optimizedMass: !0,
                shortMass: !0,
                virMassShots: !0,
                hideMyMass: !1,
                hideEnemiesMass: !1,
                vanillaSkins: !1,
                customSkins: !0,
                myTransparentSkin: !1,
                myCustomColor: !1,
                transparentCells: !1,
                transparentViruses: !0,
                transparentSkins: !1,
                showGrid: !1,
                showBgSectors: !1,
                showMapBorders: !0,
                showGhostCells: !0,
                showMiniMap: !0,
                showMiniMapGrid: !1,
                showMiniMapGuides: !0,
                showMiniMapGhostCells: !1,
                oneColoredTeammates: !1,
                optimizedFood: !0,
                rainbowFood: !1,
                oppColors: !1,
                oppRings: !1,
                virColors: !1,
                splitRange: !1,
                virusesRange: !1,
                textStroke: !1,
                namesStroke: !1,
                massStroke: !1,
                cursorTracking: !1,
                teammatesInd: !1,
                mouseSplit: !1,
                mouseFeed: !1,
                mouseInvert: !1,
                disableChat: !1,
                hideChat: !1,
                chatSounds: !0,
                chatEmoticons: !0,
                showChatBox: !1,
                showChatImages: !0,
                showChatVideos: !0,
                showTop5: !0,
                showTargeting: !0,
                showLbData: !1,
                showTime: !0,
                normalLb: !1,
                centeredLb: !0,
                fpsAtTop: !0,
                showStats: !0,
                showStatsMass: !0,
                showStatsSTE: !1,
                showStatsMassSplit: !0,
                showStatsN16: !1,
                showStatsFPS: !0,
                blockPopups: !1,
                streamMode: !1,
                hideSkinUrl: !1,
                showQuickMenu: !0,
                showSkinsPanel: !0,
                animation: 171,
                cameraSpeed: 7,
                commanderDelay: 300,
                suckAnimation: !1,
                virusGlow: !1,
                borderGlow: !1,
                limLB: 10,
                limTP: 5,
                zoomSpeedValue: .87,
                messageSound: "",
                commandSound: ""
            },
            U = {
                name: "Agar.io V1.7.1",
                version: "v1.7.1",
                privateMode: !1,
                protocolMode: !0,
                publicIP: "wss://srv.ogario.eu",
                privateIP: null,
                updateInterval: 1e3,
                updateTick: 0,
                updateMaxTick: 2,
                currentSector: "",
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
                cacheQueue: [],
                deathLocations: [],
                playerID: null,
                playerMass: 0,
                selectedProfile: 0,
                lastDeath: 0,
                skipServerData: !1,
                gameMode: ":ffa",
                region: "",
                partyToken: "",
                ws: "",
                serverIP: "",
                serverArena: "",
                serverToken: "",
                lastSentNick: "",
                lastSentClanTag: null,
                lastSentSkinURL: "",
                lastSentCustomColor: "",
                lastSentPartyToken: "",
                lastSentServerToken: "",
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
                token: "b2dhcmlvLm92aA==",
                canvasScale: 1,
                selectBiggestCell: !0,
                noColors: !1,
                skipStats: !1,
                showQuest: !1,
                showSplitInd: !1,
                pause: !1,
                targetID: 0,
                targetStatus: 0,
                targetNick: "",
                targetSkinURL: "",
                targeting: !1,
                privateMiniMap: !1,
                messageSound: null,
                commandSound: null,
                feedInterval: null,
                getPlayerX: function() {
                    return w.playerX + w.mapOffsetX
                },
                getPlayerY: function() {
                    return w.playerY + w.mapOffsetY
                },
                feed: function() {
                    b.core && b.core.eject && b.core.eject()
                },
                macroFeed: function(a) {
                    if (a) {
                        if (this.feedInterval) return;
                        var t = this;
                        this.feed(), this.feedInterval = setInterval(function() {
                            t.feed()
                        }, 80)
                    } else this.feedInterval && (clearInterval(this.feedInterval), this.feedInterval = null)
                },
                split: function() {
                    b.core && b.core.split && b.core.split()
                },
                doubleSplit: function() {
                    var e = this;
                    e.split(), setTimeout(function() {
                        e.split()
                    }, 40)
                },
                popSplit: function() {
                    var e = this;
                    e.split(), setTimeout(function() {
                        e.split()
                    }, 200)
                },
                split16: function() {
                    var e = this;
                    e.split(), setTimeout(function() {
                        e.split()
                    }, 40), setTimeout(function() {
                        e.split()
                    }, 80), setTimeout(function() {
                        e.split()
                    }, 120)
                },
                toggleSkins: function() {
                    w.vanillaSkins && w.customSkins ? w.vanillaSkins = !1 : !w.vannillaSkins && w.customSkins ? (w.vanillaSkins = !0, w.customSkins = !1) : (w.vanillaSkins = !0, w.customSkins = !0)
                },
                toggleCells: function() {
                    this.selectBiggestCell = !this.selectBiggestCell, w.selectBiggestCell = this.selectBiggestCell
                },
                setShowTop5: function() {
                    B.showTop5 = !B.showTop5, this.setTop5()
                },
                setTop5: function() {
                    B.showTop5 ? d("#top5-hud").show() : d("#top5-hud").hide()
                },
                setShowTargeting: function() {
                    B.showTargeting = !B.showTargeting, this.setTargetingHUD()
                },
                setTargetingHUD: function() {
                    B.showTargeting ? d("#target-hud, #target-panel-hud").show() : d("#target-hud, #target-panel-hud").hide()
                },
                setShowTime: function() {
                    B.showTime = !B.showTime, B.showTime ? (d("#time-hud").show(), this.displayTime()) : d("#time-hud").hide()
                },
                setShowSplitRange: function() {
                    B.splitRange = !B.splitRange, w.splitRange = B.splitRange
                },
                setShowSplitInd: function() {
                    this.showSplitInd = !this.showSplitInd, B.splitRange = this.showSplitInd, B.oppRings = this.showSplitInd, w.splitRange = B.splitRange, w.oppRings = B.oppRings
                },
                setShowTeammatesInd: function() {
                    B.teammatesInd = !B.teammatesInd
                },
                setShowOppColors: function() {
                    B.oppColors = !B.oppColors, w.oppColors = B.oppColors
                },
                setShowSkins: function() {
                    this.noSkins = !this.noSkins, b.core && b.core.setSkins && b.core.setSkins(!this.noSkins), w.showCustomSkins = !this.noSkins, this.displayChatInfo(!this.noSkins, "showSkinsMsg")
                },
                setTransparentSkins: function() {
                    B.transparentSkins = !B.transparentSkins, w.transparentSkins = B.transparentSkins
                },
                setShowStats: function() {
                    d("#stats-hud").toggle()
                },
                setShowFood: function() {
                    w.showFood = !w.showFood
                },
                setShowHUD: function() {
                    d("#overlays-hud").toggle()
                },
                setShowGrid: function() {
                    B.showGrid = !B.showGrid
                },
                setShowMiniMapGuides: function() {
                    B.showMiniMapGuides = !B.showMiniMapGuides
                },
                setShowLb: function() {
                    ":teams" !== this.gameMode && d("#leaderboard-hud").toggle()
                },
                setShowBgSectors: function() {
                    B.showBgSectors = !B.showBgSectors
                },
                setHideSmallBots: function() {
                    w.hideSmallBots = !w.hideSmallBots, this.displayChatInfo(!w.hideSmallBots, "hideSmallBotsMsg")
                },
                setShowNames: function() {
                    B.noNames = !B.noNames
                },
                setHideTeammatesNames: function() {
                    B.hideTeammatesNames = !B.hideTeammatesNames
                },
                setShowMass: function() {
                    B.showMass = !B.showMass
                },
                setShowMiniMap: function() {
                    B.showMiniMap = !B.showMiniMap, this.setMiniMap()
                },
                setMiniMap: function() {
                    B.showMiniMap ? d("#minimap-hud").show() : d("#minimap-hud").hide()
                },
                setShowQuest: function() {
                    ":ffa" === this.gameMode && (this.showQuest = !this.showQuest, this.setQuest())
                },
                setQuest: function() {
                    this.showQuest && ":ffa" === this.gameMode ? d("#quest-hud").show() : d("#quest-hud").hide()
                },
                toggleAutoZoom: function() {
                    w.autoZoom = !w.autoZoom, this.displayChatInfo(w.autoZoom, "autoZoomMsg")
                },
                resetZoom: function(e) {
                    e ? (w.zoomResetValue = 1, w.zoomValue = 1) : w.zoomResetValue = 0
                },
                setZoom: function(e) {
                    w.zoomValue = e
                },
                toggleDeath: function() {
                    this.lastDeath--, 0 > this.lastDeath && (this.lastDeath = this.deathLocations.length - 1)
                },
                tryResp: function() {
                    if (w.play || 20 == this.retryResp) this.retryResp = 0;
                    else {
                        this.retryResp++;
                        var e = this;
                        setTimeout(function() {
                            d(".btn-play-guest").is(":visible") ? d(".btn-play-guest").click() : d(".btn-play").click(), w.play || e.tryResp()
                        }, 500)
                    }
                },
                quickResp: function() {
                    B.quickResp && (this.hideMenu(), this.gameServerConnect(this.ws), w.play = !1, this.tryResp())
                },
                autoResp: function() {
                    B.autoResp && (this.setAutoResp(), d("#overlays").stop().hide(), d(".btn-play-guest").is(":visible") ? d(".btn-play-guest").click() : d(".btn-play").click())
                },
                setAutoResp: function() {
                    B.autoResp && (d("#skipStats").prop("checked") || (d("#skipStats").click(), this.skipStats = !0))
                },
                toggleAutoResp: function() {
                    B.autoResp = !B.autoResp, this.setAutoResp(), this.displayChatInfo(B.autoResp, "autoRespMsg")
                },
                copyLb: function() {
                    var e = d("<input>");
                    d("body").append(e), e.val(d("#leaderboard-positions").text()).select();
                    try {
                        document.execCommand("copy")
                    } catch (e) {}
                    e.remove()
                },
                setPause: function() {
                    this.pause = !this.pause, w.pause = this.pause, this.pause ? (w.resetTargetPosition(), d("#pause-hud").show()) : d("#pause-hud").hide()
                },
                setCenteredLb: function() {
                    B.centeredLb ? d("#leaderboard-hud").addClass("hud-text-center") : d("#leaderboard-hud").removeClass("hud-text-center")
                },
                setNormalLb: function() {
                    B.normalLb ? d("#leaderboard-hud h4").html(y.leaderboard) : d("#leaderboard-hud h4").html("Agar.io")
                },
                displayLeaderboard: function(a, t = "") {
                    this.leaderboardPositionsHUD && (this.leaderboardPositionsHUD.innerHTML = a, this.leaderboardDataHUD.innerHTML = t)
                },
                displayStats: function() {
                    if (B.showStats) {
                        var a = "",
                            o = "y";
                        76 < w.playerMass && (w.xFour = Math.round(w.playerMass / 4)), 307 < w.playerMass && (w.xSixTeen = Math.round(w.playerMass / 16)), w.play && (B.showStatsMass && w.playerMass && (a += y.mass + ": " + w.playerMass + " | "), w.playerScore && (a += y.score + ": " + w.playerScore), B.showStatsMassSplit && w.xFour && (a += " | S4: " + w.xFour), B.showStatsMassSplit && w.xSixTeen && (a += " | S16: " + w.xSixTeen), B.showStatsSTE && w.STE && (a += " | STE: " + w.STE), B.showStatsN16 && w.playerSplitCells && (a += " | " + w.playerSplitCells + "/16"), B.showStatsFPS && (a += " | ")), B.showStatsFPS && (a += this.currentSector), o = "FPS: " + R.fps, this.fpsHUD.textContent = o, this.statsHUD.textContent = a;
                        var s = this;
                        setTimeout(function() {
                            s.displayStats()
                        }, 250)
                    } else d("#stats-hud").hide()
                },
                displayTime: function() {
                    if (B.showTime) {
                        var a = new Date().toLocaleString();
                        this.timeHUD.textContent = a;
                        var t = this;
                        setTimeout(function() {
                            t.displayTime()
                        }, 1e3)
                    } else d("#time-hud").hide()
                },
                displayParties: function() {
                    for (var a = "", o = 0; o < this.parties.length; o++) a += "<li><a href=\"https://agar.io/#" + this.parties[o] + "\" onclick=\"$(\"#party-token\").val(" + this.parties[o] + "); $(\"#join-party-btn-2\").click();\">https://agar.io/#" + this.parties[o] + "</a></li>";
                    this.activeParties.className = "" == a ? "no-parties" : "", this.activeParties.innerHTML = a
                },
                displayTop5: function() {
                    if (B.showTop5) {
                        for (var a = "", n = 0, r = this.top5.length, i = 0; i < r; i++) n += this.top5[i].mass, i >= B.limTP || (a += "<li id=\"player\"><span id=\"pos-skin\" style=\"background-color: " + this.top5[i].color + "; width: 30px; height:30px; display: inline-block;\"><img src=\"" + (this.top5[i].skin ? this.top5[i].skin : "https://i.imgur.com/FDbM6yv.png") + "\" alt=\"\"> " + this.escapeHTML(this.top5[i].nick) + "</span><span id=\"top5marker\" class=\"fa fa-map-marker\"> " + this.calculateMapSector(this.top5[i].x, this.top5[i].y) + "</span><span id= \"top5mass\" class=\"fa fa-eercast\"> " + this.shortMassFormat(this.top5[i].mass) + "</span></li>");
                        this.top5pos.innerHTML = a, w.play && w.playerMass && (n += w.playerMass, r++), this.top5totalMass.textContent = this.shortMassFormat(n), this.top5totalPlayers.textContent = r
                    }
                },
                setTop5limit: function(e) {
                    e && (this.top5limit = e)
                },
                displayChatHistory: function(a) {
                    if (a) {
                        this.clearChatHistory(!0);
                        for (var t = 0; t < this.chatHistory.length; t++) d("#messages").append("<li><span class=\"message-nick\">" + this.chatHistory[t].nick + ": </span><span class=\"message-text\">" + this.chatHistory[t].message + "</span></li>")
                    } else this.clearChatHistory(!1)
                },
                clearChatHistory: function(e) {
                    d("#messages").empty(), e && (toastr.clear(), B.showChatBox && (d("#chat-box .message").remove(), this.chatHistory.length = 0))
                },
                displayChatInfo: function(a, t) {
                    a ? toastr.info(y[t + "A"]) : toastr.error(y[t + "B"])
                },
                setDisableChat: function() {
                    B.hideChat = B.disableChat, this.setHideChat()
                },
                hideChat: function() {
                    B.hideChat = !B.hideChat, this.setHideChat(), this.displayChatInfo(!B.hideChat, "hideChatMsg")
                },
                setHideChat: function() {
                    B.hideChat && d("#message-box").hide(), this.setShowChatBox()
                },
                setShowChatBox: function() {
                    !B.hideChat && B.showChatBox ? d("#chat-box").show() : d("#chat-box").hide()
                },
                enterChatMessage: function() {
                    var a = d("#message-box"),
                        t = d("#message");
                    if (a.is(":visible")) {
                        var e = t.val();
                        e.length ? (this.sendChatMessage(101, e), w.play && (t.blur(), a.hide())) : (t.blur(), a.hide()), t.val("")
                    } else a.show(), t.focus(), t.val("")
                },
                showMenu: function() {
                    d("#overlays").fadeIn(250)
                },
                hideMenu: function() {
                    d("#overlays").fadeOut(250)
                },
                escapeHTML: function(e) {
                    return (e + "").replace(/[&<>"'\/]/g, function(e) {
                        return h[e]
                    })
                },
                loadSettings: function() {
                    var e = null;
                    for (var a in null !== b.localStorage.getItem("ogarioSettings") && (e = JSON.parse(b.localStorage.getItem("ogarioSettings"))), B) B.hasOwnProperty(a) && (e && e.hasOwnProperty(a) && (B[a] = e[a]), w.hasOwnProperty(a) && (w[a] = B[a]))
                },
                saveSettings: function(e, t) {
                    b.localStorage.setItem(t, JSON.stringify(e))
                },
                exportSettings: function() {
                    var a = {
                        ogarioCommands: l,
                        ogarioHotkeys: C,
                        ogarioPlayerProfiles: I,
                        ogarioSettings: B,
                        MGxThemeSettings: x
                    };
                    for (var o in a) a.hasOwnProperty(o) && (d("#export-" + o).prop("checked") || delete a[o]);
                    a = JSON.stringify(a), d("#export-settings").val(a), d("#import-settings").val(""), a = null
                },
                importSettings: function() {
                    d("#import-settings").blur();
                    var e = d("#import-settings").val();
                    if (e) {
                        for (var a in e = JSON.parse(e))
                            if (e.hasOwnProperty(a)) {
                                if (!d("#import-" + a).prop("checked")) continue;
                                b.localStorage.setItem(a, JSON.stringify(e[a]))
                            } b.location.reload()
                    }
                },
                restoreSettings: function() {
                    null !== b.localStorage.getItem("ogarioSettings") && (b.localStorage.removeItem("ogarioSettings"), b.location.reload())
                },
                setSettings: function(a, t) {
                    if (B.hasOwnProperty(a) && null !== t) {
                        switch (B[a] = t, w.hasOwnProperty(a) && (w[a] = t), a) {
                            case "autoResp":
                                this.setAutoResp();
                                break;
                            case "showMiniMap":
                                this.setMiniMap();
                                break;
                            case "showMiniMapGrid":
                                this.resetMiniMapSectors();
                                break;
                            case "disableChat":
                                this.setDisableChat();
                                break;
                            case "chatSounds":
                                this.setChatSoundsBtn();
                                break;
                            case "showChatBox":
                                this.setShowChatBox();
                                break;
                            case "showTop5":
                                this.setTop5();
                                break;
                            case "showTargeting":
                                this.setTargetingHUD();
                                break;
                            case "showTime":
                                this.displayTime(), d("#time-hud").show();
                                break;
                            case "centeredLb":
                                this.setCenteredLb();
                                break;
                            case "normalLb":
                                this.setNormalLb();
                                break;
                            case "showStats":
                                this.displayStats(), d("#stats-hud").show();
                        }
                        this.saveSettings(B, "ogarioSettings")
                    }
                },
                loadProfiles: function() {
                    if (null !== b.localStorage.getItem("ogarioPlayerProfiles")) I = JSON.parse(b.localStorage.getItem("ogarioPlayerProfiles"));
                    else
                        for (var e = 0; 8 > e; e++) I.push({
                            nick: "Profile #" + (e + 1),
                            clanTag: "",
                            skinURL: "",
                            color: x.mainColor
                        });
                    null !== b.localStorage.getItem("ogarioSelectedProfile") && (this.selectedProfile = JSON.parse(b.localStorage.getItem("ogarioSelectedProfile"))), D.nick = I[this.selectedProfile].nick, D.clanTag = I[this.selectedProfile].clanTag, D.skinURL = I[this.selectedProfile].skinURL, D.color = I[this.selectedProfile].color
                },
                changeSkinPreview: function(a, t) {
                    a && t && ("skin-preview" === t ? (d("#skin-preview").removeClass("default").append("<a href=\"#\" id=\"skin-popover\" data-toggle=\"popover\" title=\"\" data-html=\"true\"</a>"), d("#skin-popover").append(d(a).fadeIn(1e3)), d("#skin-popover").popover()) : d("#" + t).removeClass("default").append(d(a).fadeIn(1e3)))
                },
                setSkinPreview: function(s, t) {
                    var e = "skin-preview" == t;
                    if (d("#" + t + " img").attr("src") !== s)
                        if (d("#" + t).empty().addClass("default"), s) {
                            var n = this,
                                o = new Image;
                            o.crossOrigin = "Anonymous", o.onload = function() {
                                n.changeSkinPreview(o, t), e && d("#skin").popover("hide")
                            }, o.onerror = function() {
                                e && ("<p>Check if image URL is valid.</p>", d("#skin").attr("data-content", "<p><strong>Error while loading image.</strong></p><p>Check if image URL is valid.</p>"), d("#skin").popover("show"), d("#skin").focus())
                            }, o.src = s
                        } else e && d("#skin").popover("hide")
                },
                setProfile: function() {
                    var a = (I.length + this.selectedProfile - 1) % I.length,
                        t = (this.selectedProfile + 1) % I.length;
                    this.setSkinPreview(I[a].skinURL, "prev-profile"), this.setSkinPreview(I[this.selectedProfile].skinURL, "skin-preview"), this.setSkinPreview(I[t].skinURL, "next-profile"), this.saveSettings(this.selectedProfile, "ogarioSelectedProfile"), d("#nick").val(I[this.selectedProfile].nick), d("#clantag").val(I[this.selectedProfile].clanTag), d("#skin").val(I[this.selectedProfile].skinURL), d("#color").val(I[this.selectedProfile].color), d(".skin").colorpicker("setValue", I[this.selectedProfile].color), d(".skin-wheel-bg a").removeClass("selected"), d(".skin-wheel-bg a[data-profile=" + this.selectedProfile + "]").addClass("selected")
                },
                prevProfile: function() {
                    this.setPlayerSettings(), this.selectedProfile = (I.length + this.selectedProfile - 1) % I.length, this.setProfile()
                },
                nextProfile: function() {
                    this.setPlayerSettings(), this.selectedProfile = (this.selectedProfile + 1) % I.length, this.setProfile()
                },
                selectProfile: function(e) {
                    this.setPlayerSettings(), this.selectedProfile = parseInt(e), this.setProfile()
                },
                addOption: function(a, t, e, s) {
                    d(a).append("<label><input type=\"checkbox\" id=\"" + t + "\" class=\"js-switch\"> " + e + "</label>"), d("#" + t).prop("checked", s)
                },
                addOptions: function(a, t) {
                    if (a) {
                        d("#og-options").append("<div class=\"options-box " + t + "\"><h5 class=\"menu-main-color\">" + y[t] + "</h5></div>");
                        for (var e = 0, s; e < a.length; e++) s = a[e], B.hasOwnProperty(s) && (d("." + t).append("<label>" + y[s] + " <input type=\"checkbox\" class=\"js-switch\" id=\"" + s + "\"></label>"), d("#" + s).prop("checked", B[s]))
                    }
                },
                addInputBox: function(s, t, e, n) {
                    d(s).append("<div class=\"input-box\"><span class=\"title-box\">" + y[t] + "</span><input id=\"" + t + "\" class=\"form-control\" placeholder=\"" + e + "\" value=\"" + B[t] + "\" /></div>");
                    var o = this;
                    d("#" + t).on("input", function() {
                        B[t] = this.value, o[n](), o.saveSettings(B, "ogarioSettings")
                    })
                },
                addSliderBox: function(s, i, e, t, a, o) {
                    d(s).append("<div class=\"slider-box\"><div class=\"box-label\"><span class=\"value-label\">" + y[i] + ": </span><span id=\"" + i + "-value\" class=\"value\">" + B[i] + "</span></div><input id=\"" + i + "-slider\" type=\"range\" min=\"" + e + "\" max=\"" + t + "\" step=\"" + a + "\" value=\"" + B[i] + "\"></div>");
                    var n = this;
                    o ? d("#" + i + "-slider").on("input", function() {
                        var e = parseFloat(d(this).val());
                        d("#" + i + "-value").text(e), B[i] = e, w.hasOwnProperty(i) && (w[i] = e), n[o](), n.saveSettings(B, "ogarioSettings")
                    }) : d("#" + i + "-slider").on("input", function() {
                        var e = parseFloat(d(this).val());
                        d("#" + i + "-value").text(e), B[i] = e, w.hasOwnProperty(i) && (w[i] = e), n.saveSettings(B, "ogarioSettings")
                    })
                },
                setLang: function() {
                    if ("pl" === g && b.i18n_dict && b.i18n_dict.en)
                        for (var e in b.i18n_dict.en) b.i18n_dict.en.hasOwnProperty(e) && y.hasOwnProperty(e) && (b.i18n_dict.en[e] = y[e])
                },
                setMenu: function() {
                    for (var a in document.title = this.name, this.addOptions(["suckAnimation"], "animationGroup"), this.addOptions(["virusGlow", "borderGlow"], "glowGroup"), this.addOptions([], "commanderGroup"), this.addOptions(["autoZoom"], "zoomGroup"), this.addOptions(["quickResp", "autoResp"], "respGroup"), this.addOptions(["noNames", "optimizedNames", "autoHideNames", "hideMyName", "hideTeammatesNames", "namesStroke"], "namesGroup"), this.addOptions(["showMass", "showVirusMass", "optimizedMass", "autoHideMass", "hideMyMass", "hideEnemiesMass", "shortMass", "virMassShots", "massStroke"], "massGroup"), this.addOptions(["customSkins", "vanillaSkins"], "skinsGroup"), this.addOptions(["optimizedFood", "autoHideFood", "autoHideFoodOnZoom", "rainbowFood"], "foodGroup"), this.addOptions(["myCustomColor", "myTransparentSkin", "transparentSkins", "transparentCells", "transparentViruses"], "transparencyGroup"), this.addOptions(["showGrid", "showBgSectors", "showMapBorders"], "gridGroup"), this.addOptions(["disableChat", "chatSounds", "chatEmoticons", "showChatImages", "showChatVideos", "showChatBox"], "chatGroup"), this.addOptions(["showMiniMap", "showMiniMapGrid", "showMiniMapGuides", "showMiniMapGhostCells", "oneColoredTeammates"], "miniMapGroup"), this.addOptions(["oppColors", "oppRings", "virColors", "splitRange", "virusesRange", "cursorTracking", "teammatesInd", "showGhostCells"], "helpersGroup"), this.addOptions(["mouseSplit", "mouseFeed", "mouseInvert"], "mouseGroup"), this.addOptions(["showTop5", "showTargeting", "showLbData", "centeredLb", "normalLb"], "hudGroup"), this.addOptions(["showStats", "showStatsMass", "showStatsSTE", "showStatsMassSplit", "showStatsN16", "showStatsFPS", "showTime"], "statsGroup"), d("#settingsChoice").appendTo(d(".extrasGroup")).addClass("select-wrapper"), this.addSliderBox(".animationGroup", "animation", 70, 225, 1), this.addSliderBox(".animationGroup", "cameraSpeed", 1, 25, 1), this.addSliderBox(".commanderGroup", "commanderDelay", 25, 1e3, 5), this.addSliderBox(".zoomGroup", "zoomSpeedValue", .75, .99, .01), this.addSliderBox(".hudGroup", "limLB", 10, 30, 1), this.addSliderBox(".hudGroup", "limTP", 5, 30, 1), d("#og-settings").append("<button class=\"btn btn-block btn-success btn-export\">" + y.exportImport + "</button>"), d("#og-settings").append("<div class=\"restore-settings\"><a href=\"#\">" + y.restoreSettings + "</a></div>"), this.addInputBox(".sounds-panel", "messageSound", "Sound URL", "setMessageSound"), this.addInputBox(".sounds-panel", "commandSound", "Sound URL", "setCommandSound"), S) S.hasOwnProperty(a) && d("#chat-emoticons").append("<img src=\"https://cdn.ogario.ovh/static/emoticons/" + S[a] + "\" alt=\"" + a + "\" class=\"emoticon\">");
                    d("body").append("<div id=\"exp-imp\"><div id=\"exp-imp-menu\"><button id=\"close-exp-imp\" class=\"btn btn-danger\">" + y.close + "</button></div><div id=\"exp-imp-settings\"></div></div>"), d("#exp-imp-settings").append("<h1>" + y.exportSettings + "</h1><h2>" + y.exportInfo + "</h2>"), this.addOption("#exp-imp-settings", "export-ogarioCommands", y.commands, !0), this.addOption("#exp-imp-settings", "export-ogarioHotkeys", y.hotkeys, !0), this.addOption("#exp-imp-settings", "export-ogarioPlayerProfiles", y.profiles, !0), this.addOption("#exp-imp-settings", "export-ogarioSettings", y.settings, !0), this.addOption("#exp-imp-settings", "export-ogarioThemeSettings", y.theme, !0), d("#exp-imp-settings").append("<textarea id=\"export-settings\" class=\"form-control\" rows=\"14\" cols=\"100\" spellcheck=\"false\" readonly /><button id=\"export-settings-btn\" class=\"btn btn-block btn-success\">" + y.exportSettings + "</button>"), d("#exp-imp-settings").append("<h1>" + y.importSettings + "</h1><h2>" + y.importInfo + "</h2>"), this.addOption("#exp-imp-settings", "import-ogarioCommands", y.commands, !0), this.addOption("#exp-imp-settings", "import-ogarioHotkeys", y.hotkeys, !0), this.addOption("#exp-imp-settings", "import-ogarioPlayerProfiles", y.profiles, !0), this.addOption("#exp-imp-settings", "import-ogarioSettings", y.settings, !0), this.addOption("#exp-imp-settings", "import-ogarioThemeSettings", y.theme, !0), d("#exp-imp-settings").append("<textarea id=\"import-settings\" class=\"form-control\" rows=\"14\" cols=\"100\" spellcheck=\"false\" /><button id=\"import-settings-btn\" class=\"btn btn-block btn-success\">" + y.importSettings + "</button>"), P && P.setThemeMenu();
                    for (var t = 0; t < I.length; t++) d(".skin-wheel-bg").append("<div class=\"pick-skin pick-skin-" + t + "\"><a href=\"#profile-" + t + "\" id=\"profile-" + t + "\" data-profile=\"" + t + "\" class=\"skin-switch\"></a></div>"), this.setSkinPreview(I[t].skinURL, "profile-" + t), t == this.selectedProfile && d("#profile-" + t).addClass("selected")
                },
                setUI: function() {
                    var a = this;
                    d(document).on("click", ".menu-tabs a", function(t) {
                        t.preventDefault(), a.switchMenuTabs(d(this), "menu-panel")
                    }), d(document).on("click", ".submenu-tabs a", function(t) {
                        t.preventDefault(), a.switchMenuTabs(d(this), "submenu-panel")
                    }), d(document).on("click", ".quick-menu", function(t) {
                        t.preventDefault(), B.showQuickMenu = !B.showQuickMenu, a.saveSettings(B, "ogarioSettings"), a.setShowQuickMenu()
                    }), d(document).on("click", ".quick-skins", function(t) {
                        t.preventDefault(), B.showSkinsPanel = !B.showSkinsPanel, a.saveSettings(B, "ogarioSettings"), a.setShowSkinsPanel()
                    }), d(document).on("change", "#regions", function() {
                        a.region = this.value
                    }), d(document).on("change", "#gamemode", function() {
                        var t = this.value;
                        ":party" !== t && a.leaveParty(), a.gameMode = w.gameMode = t, a.setQuest()
                    }), d(document).on("change", "#quality", function() {
                        a.getQuality(this.value), p()
                    }), d("#skin").popover({
                        html: !0,
                        placement: "bottom",
                        trigger: "manual",
                        animation: !1
                    }), d(document).on("input click", "#skin", function() {
                        var t = this.value;
                        a.setSkinPreview(t, "skin-preview"), a.setSkinPreview(t, "profile-" + a.selectedProfile)
                    }), d(document).on("click", ".skin .example-url a", function(e) {
                        e.preventDefault(), d("#skin").val(this.href).click()
                    }), d(document).on("click", "#overlays", function() {
                        d(".skin:hover").length || d(".skin-switch:hover").length || d("#skin").popover("hide")
                    }), d(document).on("click", ".skin-wheel-bg a", function(t) {
                        t.preventDefault(), a.selectProfile(d(this).attr("data-profile"))
                    }), d(document).on("click", "#prev-profile", function() {
                        a.prevProfile()
                    }), d(document).on("click", "#next-profile", function() {
                        a.nextProfile()
                    }), d(document).on("click", "#stream-mode", function() {
                        B.streamMode = !B.streamMode, a.saveSettings(B, "ogarioSettings"), a.setStreamMode()
                    }), d(document).on("click", "#hide-url", function() {
                        B.hideSkinUrl = !B.hideSkinUrl, a.saveSettings(B, "ogarioSettings"), a.setHideSkinUrl()
                    }), d(document).on("click", ".btn-server-info", function() {
                        d("#server-info").toggle()
                    }), d(document).on("click", "#server-connect", function() {
                        a.gameServerConnect(d("#server-ws").val())
                    }), d(document).on("click", "#server-reconnect", function() {
                        a.gameServerReconnect()
                    }), d(document).on("click", "#server-join", function() {
                        a.gameServerJoin(d("#server-token").val())
                    }), d(document).on("change", "#og-options input[type='checkbox']", function() {
                        var t = d(this);
                        a.setSettings(t.attr("id"), t.prop("checked"))
                    }), d(document).on("change", ".js-switch-vanilla", function() {
                        var t = d(this),
                            e = t.attr("id");
                        void 0 !== a[e] && (a[e] = t.prop("checked"), "noSkins" === e && (w.showCustomSkins = !a.noSkins), "showQuest" === e && a.setQuest())
                    }), d(document).on("click", "#og-settings .restore-settings a", function(t) {
                        t.preventDefault(), a.restoreSettings()
                    }), d(document).on("click", "#og-settings .btn-export", function(t) {
                        t.preventDefault(), a.exportSettings(), d("#exp-imp").fadeIn(500), d("#exp-imp-settings, #export-settings").perfectScrollbar("update")
                    }), d(document).on("click", "#close-exp-imp", function(e) {
                        e.preventDefault(), d("#exp-imp").fadeOut(500)
                    }), d(document).on("focus", "#export-settings", function() {
                        d(this).select()
                    }), d(document).on("click", "#export-settings-btn", function(t) {
                        t.preventDefault(), a.exportSettings()
                    }), d(document).on("click", "#import-settings-btn", function(t) {
                        t.preventDefault(), a.importSettings()
                    }), d(document).on("click", "#unblock-popups", function(t) {
                        t.preventDefault(), a.unblockPopups()
                    }), d(document).on("click", "#openfl-overlay.disabler", function() {
                        B.blockPopups && a.blockPopups()
                    }), d(document).on("click", "#openfl-content", function() {
                        if (B.blockPopups) {
                            var t = d(this);
                            setTimeout(function() {
                                t.is(":visible") || a.blockPopups()
                            }, 1e3)
                        }
                    }), d(document).on("click", ".quick-shop", function(e) {
                        e.preventDefault(), a.unblockPopups(), b.MC && b.MC.openShop && b.MC.openShop()
                    }), d(document).on("click", ".quick-free-coins", function(e) {
                        e.preventDefault(), a.unblockPopups(), b.MC && b.MC.showFreeCoins && b.MC.showFreeCoins()
                    }), d(document).on("click", ".quick-free-gifts", function(e) {
                        e.preventDefault(), a.unblockPopups(), b.MC && b.MC.showGifting && b.MC.showGifting()
                    }), d(document).on("click", ".quick-quests", function(e) {
                        e.preventDefault(), a.unblockPopups(), b.MC && b.MC.showQuests && b.MC.showQuests()
                    }), d(document).on("click", "#set-targeting", function(t) {
                        t.preventDefault(), a.setTargeting()
                    }), d(document).on("click", "#cancel-targeting", function(t) {
                        t.preventDefault(), a.cancelTargeting()
                    }), d(document).on("click", "#set-private-minimap", function(t) {
                        t.preventDefault(), a.setPrivateMiniMap()
                    }), d(document).on("click", "#change-target", function(t) {
                        t.preventDefault(), a.changeTarget()
                    }), d(document).on("click", ".team-top-limit", function(t) {
                        t.preventDefault();
                        var e = d(this),
                            s = parseInt(e.attr("data-limit"));
                        s && (a.setTop5limit(s), a.displayTop5(), d(".team-top").text(s), d(".team-top-limit").removeClass("active"), e.addClass("active"))
                    }), d(document).on("click", "#top5-pos .set-target", function(t) {
                        t.preventDefault(), a.setTarget(parseInt(d(this).attr("data-user-id")))
                    }), d(document).on("click", ".mute-user", function(t) {
                        t.preventDefault(), a.muteChatUser(parseInt(d(this).attr("data-user-id")))
                    }), d(document).on("click", ".btn-mute-user", function() {
                        var t = d(this);
                        a.muteChatUser(parseInt(t.attr("data-user-id"))), t.removeClass("btn-red btn-mute-user").addClass("btn-green btn-unmute-user").text(y.unmute)
                    }), d(document).on("click", ".btn-unmute-user", function() {
                        var t = d(this);
                        a.unmuteChatUser(parseInt(t.attr("data-user-id"))), t.removeClass("btn-green btn-unmute-user").addClass("btn-red btn-mute-user").text(y.mute)
                    }), d(document).on("click", ".chat-sound-notifications", function(t) {
                        t.preventDefault(), B.chatSounds = !B.chatSounds, a.saveSettings(B, "ogarioSettings"), a.setChatSoundsBtn()
                    }), d(document).on("click", ".chat-active-users", function(t) {
                        t.preventDefault(), a.displayChatActiveUsers()
                    }), d(document).on("click", ".chat-muted-users", function(t) {
                        t.preventDefault(), a.displayChatMutedUsers()
                    }), d(document).on("click", ".show-chat-emoticons", function(a) {
                        a.preventDefault();
                        var t = d(this),
                            e = d("#chat-emoticons");
                        e.toggle(), e.is(":visible") ? t.addClass("active") : (t.removeClass("active"), d("#message").focus())
                    }), d(document).on("click", "#chat-emoticons .emoticon", function() {
                        var a = d(this).attr("alt"),
                            t = d("#message"),
                            e = t.val();
                        80 >= e.length + a.length && t.val(e + a), t.focus()
                    }), this.statsHUD = document.getElementById("stats-hud"), this.fpsHUD = document.getElementById("fps-hud"), this.activeParties = document.getElementById("active-parties"), this.top5pos = document.getElementById("top5-pos"), this.top5totalMass = document.getElementById("top5-total-mass"), this.top5totalPlayers = document.getElementById("top5-total-players"), this.leaderboardPositionsHUD = document.getElementById("leaderboard-positions"), this.leaderboardDataHUD = document.getElementById("leaderboard-data"), this.timeHUD = document.getElementById("time-hud"), this.questHUD = document.getElementById("quest-hud"), d("#canvas").bind("contextmenu", function() {
                        return !1
                    }), d(document).on("mouseup", ".btn", function() {
                        $(this).blur()
                    }), d("[data-toggle='tab-tooltip']").tooltip({
                        trigger: "hover"
                    }), d(".submenu-panel, #chat-box, #exp-imp-settings, #export-settings, #import-settings").perfectScrollbar({
                        suppressScrollX: !0
                    }), Array.prototype.slice.call(document.querySelectorAll(".js-switch")).forEach(function(e) {
                        new Switchery(e, {
                            color: x.menuMainColorMGx,
                            size: "small"
                        })
                    }), d("input[type='range']").rangeslider({
                        polyfill: !1
                    }), toastr.options = {
                        newestOnTop: !1,
                        positionClass: "toast-bottom-left",
                        timeOut: 15e3
                    }
                },
                switchMenuTabs: function(s, t) {
                    var e = s.parent();
                    if ("menu-panel" === t) {
                        if (s.hasClass("hotkeys-link")) return;
                        e.hasClass("profile-tab")
                    }
                    s.addClass("active"), e.addClass("active"), e.siblings().removeClass("active"), e.siblings().find("a").removeClass("active");
                    var n = s.attr("href");
                    if ("submenu-panel" === t) {
                        var o = d(n).parent().attr("id");
                        d("#" + o + " .submenu-panel").not(n).css("display", "none")
                    } else d(".menu-panel").not(n).css("display", "none");
                    d(n).fadeIn(1e3), p(), d(".submenu-panel").perfectScrollbar("update")
                },
                getDefaultSettings: function() {
                    if (this.noSkins = d("#noSkins").prop("checked"), this.noColors = d("#noColors").prop("checked"), this.skipStats = d("#skipStats").prop("checked"), this.showQuest = d("#showQuest").prop("checked"), w.showCustomSkins = !this.noSkins, null !== b.localStorage.getItem("scale_setting")) {
                        var e = JSON.parse(b.localStorage.getItem("scale_setting"));
                        this.setCanvasScale(e)
                    } else {
                        var t = d("#quality").val();
                        this.getQuality(t)
                    }
                    null === b.localStorage.getItem("location") ? this.region = d("#regions").val() : (this.region = b.localStorage.getItem("location"), d("#regions").val(this.region), b.MC && b.MC.setRegion && b.MC.setRegion(this.region)), this.setParty(), ":party" === this.gameMode && b.location.hash && d("#join-party-btn-2").click(), Array.prototype.slice.call(document.querySelectorAll(".js-switch-vanilla")).forEach(function(e) {
                        new Switchery(e, {
                            color: x.menuMainColorMGx,
                            size: "small"
                        })
                    }), d("#nick").val(D.nick).blur(), d("#noNames").prop("checked", !B.noNames), d("#showMass").prop("checked", B.showMass), this.unlockButtons(), this.setAutoResp(), this.setQuest()
                },
                getQuality: function(e) {
                    var t = 1;
                    switch ("devicePixelRatio" in b && (t = b.devicePixelRatio), e) {
                        case "High":
                            this.setCanvasScale(1);
                            break;
                        case "Medium":
                            this.setCanvasScale(.9);
                            break;
                        case "Low":
                            this.setCanvasScale(.75);
                            break;
                        case "VeryLow":
                            this.setCanvasScale(.5);
                            break;
                        default:
                            this.setCanvasScale(t);
                    }
                },
                setCanvasScale: function(e) {
                    this.canvasScale = e, w.canvasScale = e
                },
                setStreamMode: function() {
                    B.streamMode ? (d("#stream-mode").addClass("ogicon-eye-blocked"), d("#nick, #party-token").addClass("stream-mode")) : (d("#stream-mode").removeClass("ogicon-eye-blocked"), d("#clantag, #nick, #party-token").removeClass("stream-mode"))
                },
                setHideSkinUrl: function() {
                    B.hideSkinUrl ? (d("#hide-url").addClass("ogicon-eye-blocked"), d("#skin").addClass("hide-url")) : (d("#hide-url").removeClass("ogicon-eye-blocked"), d("#skin").removeClass("hide-url"))
                },
                setShowQuickMenu: function() {
                    B.showQuickMenu ? d("#quick-menu").fadeIn(500) : d("#quick-menu").fadeOut(500)
                },
                setShowSkinsPanel: function() {
                    B.showSkinsPanel ? d("#skins-panel").fadeIn(500) : d("#skins-panel").fadeOut(500)
                },
                unlockButtons: function() {
                    d(".btn-play, .btn-play-guest, .btn-login-play, .btn-spectate").prop("disabled", !1)
                },
                setMainButtons: function() {
                    var e = this;
                    d(document).on("click", ".btn-play, .btn-play-guest", function() {
                        e.onPlay()
                    }), d(document).on("click", ".btn-spectate", function() {
                        e.onSpectate()
                    }), d(document).on("click", "#create-party-btn-2", function() {
                        e.onCreate()
                    }), d(document).on("click", "#join-party-btn-2", function() {
                        e.skipServerData = !0, e.joinParty(), e.onJoin()
                    }), d(document).on("click", "#statsContinue2", function() {
                        d("#stats, #main-panel").toggle()
                    })
                },
                play: function() {
                    if (this.setPlayerSettings(), this.setParty(), this.isSocketOpen()) this.sendPartyData();
                    else {
                        this.connect();
                        var e = this;
                        setTimeout(function() {
                            e.sendPartyData()
                        }, 1e3)
                    }
                },
                onPlay: function() {
                    this.play(), this.hideMenu(), b.addKeyListeners && b.addKeyListeners(), B.autoHideFood && (w.showFood = !0), b.ga && b.ga("create", "UA-67142685-2", "auto", "ogarioTracker"), b.ga && b.ga("ogarioTracker.send", "pageview")
                },
                onSpectate: function() {
                    this.onJoin(), this.sendPlayerJoin(), this.hideMenu(), b.addKeyListeners && b.addKeyListeners(), B.autoHideFood && (w.showFood = !1)
                },
                join: function() {
                    this.setParty(), this.setPlayerSettings(), this.sendPartyData(), this.sendPlayerDeath()
                },
                onJoin: function() {
                    if (this.setParty(), this.isSocketOpen()) this.join();
                    else {
                        this.connect();
                        var e = this;
                        setTimeout(function() {
                            e.join(), e.sendPlayerJoin()
                        }, 1e3)
                    }
                },
                create: function() {
                    if (this.setParty(), this.partyToken) this.onJoin();
                    else {
                        var e = this;
                        setTimeout(function() {
                            e.create()
                        }, 100)
                    }
                },
                onCreate: function() {
                    this.setParty(), ":party" === this.gameMode && this.partyToken ? this.gameServerReconnect() : this.createParty(), this.create()
                },
                onPlayerSpawn: function() {
                    if (w.play = !0, w.playerColor) return this.sendPlayerSpawn(), void this.cacheCustomSkin(D.nick, w.playerColor, D.skinURL);
                    var e = this;
                    setTimeout(function() {
                        e.onPlayerSpawn()
                    }, 100), setTimeout(function() {
                        w.spawnX = w.playerX, w.spawnY = w.playerY, A.drawCommander = !0
                    }, B.commanderDelay)
                },
                onPlayerDeath: function() {
                    w.play = !1, w.playerColor = null, w.foodIsHidden = !1, w.playerMass = 0, w.playerScore = 0, w.xFour = 0, w.xSixTeen = 0, w.playerSplitCells = 0, this.showMenu(300), this.sendPlayerDeath(), this.updateDeathLocations(w.playerX, w.playerY), this.unlockButtons(), t(), this.autoResp()
                },
                setPlayerSettings: function() {
                    var s = d("#nick").val(),
                        t = d("#clantag").val(),
                        e = d("#skin").val(),
                        o = d("#color").val();
                    D.nick = s, D.clanTag = t.trim(), D.skinURL = e.trim(), 7 == o.length && (D.color = o), 0 < D.clanTag.length && (w.clanTag = D.clanTag), I[this.selectedProfile].nick = D.nick, I[this.selectedProfile].clanTag = D.clanTag, I[this.selectedProfile].skinURL = D.skinURL, I[this.selectedProfile].color = D.color, this.saveSettings(I, "ogarioPlayerProfiles")
                },
                loadSkin: function(a, t) {
                    var e = this;
                    a[t] = new Image, a[t].crossOrigin = "Anonymous", a[t].onload = function() {
                        this.complete && this.width && this.height && 2e3 >= this.width && 2e3 >= this.height && (e.cacheQueue.push(t), 1 == e.cacheQueue.length && e.cacheSkin(e.customSkinsCache))
                    }, a[t].src = t
                },
                cacheSkin: function() {
                    if (0 != this.cacheQueue.length) {
                        var t = this.cacheQueue.shift();
                        if (t) {
                            var e = document.createElement("canvas");
                            e.width = 512, e.height = 512;
                            var a = e.getContext("2d");
                            a.beginPath(), a.arc(256, 256, 256, 0, 2 * Math.PI, !1), a.clip(), a.drawImage(this.customSkinsCache[t], 0, 0, 512, 512), this.customSkinsCache[t + "_cached"] = new Image, this.customSkinsCache[t + "_cached"].src = e.toDataURL(), e = null, this.cacheSkin(this.customSkinsCache)
                        }
                    }
                },
                getCachedSkin: function(a, t) {
                    return a[t + "_cached"] && a[t + "_cached"].complete && a[t + "_cached"].width ? a[t + "_cached"] : null
                },
                cacheCustomSkin: function(a, t, e) {
                    if (e) {
                        var o = ":party" === this.gameMode ? a + t : a;
                        if (o && (this.customSkinsMap[o] = e), this.customSkinsCache.hasOwnProperty(e)) return;
                        this.loadSkin(this.customSkinsCache, e)
                    }
                },
                checkSkinsMap: function(a, t) {
                    var e = ":party" === this.gameMode ? a + t : a;
                    return !!this.customSkinsMap.hasOwnProperty(e)
                },
                getCustomSkin: function(a, t) {
                    if (!this.checkSkinsMap(a, t)) return null;
                    var e = ":party" === this.gameMode ? a + t : a;
                    return this.getCachedSkin(this.customSkinsCache, this.customSkinsMap[e])
                },
                calculateMapSector: function(i, t, e = !1) {
                    if (!w.mapOffsetFixed) return "";
                    var s = e ? w.mapOffsetX + w.mapOffset : w.mapOffset,
                        o = e ? w.mapOffsetY + w.mapOffset : w.mapOffset,
                        a = Math.floor((t + o) / (w.mapSize / x.sectorsY)),
                        l = Math.floor((i + s) / (w.mapSize / x.sectorsX));
                    return a = 0 > a ? 0 : a >= x.sectorsY ? x.sectorsY - 1 : a, l = 0 > l ? 0 : l >= x.sectorsX ? x.sectorsX - 1 : l, String.fromCharCode(a + 65) + (l + 1)
                },
                shortMassFormat: function(e) {
                    return 1e3 > e ? e : Math.round(e / 100) / 10 + "k"
                },
                updateDeathLocations: function(a, t) {
                    w.mapOffsetFixed && (this.deathLocations.push({
                        x: a + w.mapOffsetX,
                        y: t + w.mapOffsetY
                    }), 6 == this.deathLocations.length && this.deathLocations.shift(), this.lastDeath = this.deathLocations.length - 1)
                },
                drawMiniMap: function() {
                    if (w.mapOffsetFixed) {
                        var i = x.miniMapWidth,
                            t = x.miniMapTop,
                            e = i + t,
                            s = i,
                            o = t;
                        this.miniMap ? this.miniMapCtx.clearRect(0, 0, i, e) : (this.miniMap = document.getElementById("minimap"), this.miniMapCtx = this.miniMap.getContext("2d"), this.miniMap.width = i, this.miniMap.height = e), this.miniMap.width != i && (this.miniMap.width = i, this.miniMap.height = e);
                        var a = s / w.mapSize,
                            n = w.mapOffsetX + w.mapOffset,
                            r = w.mapOffsetY + w.mapOffset;
                        if (this.currentSector = this.calculateMapSector(w.playerX, w.playerY, !0), this.miniMapCtx.globalAlpha = 1, this.miniMapCtx.font = x.miniMapFontWeight + " px " + x.miniMapFontFamily, this.miniMapCtx.fillStyle = x.miniMapSectorColor, this.miniMapSectors || this.drawMiniMapSectors(x.sectorsX, x.sectorsY, s, e, o), this.miniMapCtx.save(), this.miniMapCtx.translate(10, o), ":battleroyale" === this.gameMode && R && R.drawBattleAreaOnMinimap(this.miniMapCtx, s, s, a, n, r), B.showMiniMapGhostCells) {
                            var l = w.ghostCells;
                            this.miniMapCtx.beginPath();
                            for (var m = 0; m < l.length; m++)
                                if (!l[m].inView) {
                                    var h = ~~((l[m].x + n) * a - 10),
                                        g = ~~((l[m].y + r) * a);
                                    this.miniMapCtx.moveTo(h - 9.5, g), this.miniMapCtx.arc(h, g, ~~(l[m].size * a), 0, this.pi2, !1)
                                } this.miniMapCtx.fillStyle = x.miniMapGhostCellsColor, this.miniMapCtx.globalAlpha = x.miniMapGhostCellsAlpha, this.miniMapCtx.fill(), this.miniMapCtx.globalAlpha = 1
                        }
                        if (B.showMiniMapGuides && (h = Math.round((w.playerX + n) * a - 10), g = Math.round((w.playerY + r) * a), this.miniMapCtx.lineWidth = 1, this.miniMapCtx.strokeStyle = x.miniMapGuidesColor, this.miniMapCtx.beginPath(), this.miniMapCtx.moveTo(h, 0), this.miniMapCtx.lineTo(h, s), this.miniMapCtx.moveTo(-9.5, g), this.miniMapCtx.lineTo(s, g), this.miniMapCtx.stroke()), this.miniMapCtx.beginPath(), this.miniMapCtx.arc((w.playerX + n) * a - 10, (w.playerY + r) * a, x.miniMapMyCellSize, 0, this.pi2, !1), this.miniMapCtx.closePath(), 0 < x.miniMapMyCellStrokeSize && (this.miniMapCtx.lineWidth = x.miniMapMyCellStrokeSize, this.miniMapCtx.strokeStyle = x.miniMapMyCellStrokeColor, this.miniMapCtx.stroke()), this.miniMapCtx.fillStyle = x.miniMapMyCellColor, this.miniMapCtx.fill(), this.teamPlayers.length)
                            for (m = 0; m < this.teamPlayers.length; m++) this.teamPlayers[m].drawPosition(this.miniMapCtx, w.mapOffset, a, this.privateMiniMap, this.targetID);
                        if (0 < this.deathLocations.length) {
                            h = Math.round((this.deathLocations[this.lastDeath].x + w.mapOffset) * a - 10), g = Math.round((this.deathLocations[this.lastDeath].y + w.mapOffset) * a);
                            var f = Math.max(x.miniMapMyCellSize - 2, 4);
                            this.miniMapCtx.lineWidth = 1, this.miniMapCtx.strokeStyle = this.deathLocations.length - 1 == this.lastDeath ? x.miniMapDeathLocationColor : "#FFFFFF", this.miniMapCtx.beginPath(), this.miniMapCtx.moveTo(h - f, g), this.miniMapCtx.lineTo(h + f, g), this.miniMapCtx.moveTo(h, g - f), this.miniMapCtx.lineTo(h, g + f), this.miniMapCtx.stroke()
                        }
                        this.miniMapCtx.restore()
                    }
                },
                drawMiniMapSectors: function(r, t, e, s, o) {
                    this.miniMapSectors = document.getElementById("minimap-sectors");
                    var a = this.miniMapSectors.getContext("2d");
                    this.miniMapSectors.width = e, this.miniMapSectors.height = s, a.fillStyle = "#FFFFFF", this.dTok(a, e), R.drawSectors(a, w.mapOffsetFixed, r, t, 0, o, e, s, x.miniMapSectorsColor, x.miniMapSectorsColor, 0, !1)
                },
                resetMiniMapSectors: function() {
                    this.miniMapSectors = null
                },
                dTok: function(e) {
                    e.font = x.miniMapFontWeight + " " + x.miniMapFontFamily
                },
                drawTeammatesInd: function(a, t, e, o) {
                    this.indicator && a.drawImage(this.indicator, t - 45, e - o - 90)
                },
                drawCellInfo: function(i, t, e, s, o, a, m, r, l, h, c, u) {
                    if (!a && !l && (i.globalAlpha = w.globalAlpha, B.teammatesInd && u && !r && 200 >= o && this.drawTeammatesInd(i, e, s, o), !B.noNames || B.showMass)) {
                        var d = !1;
                        if (r || m || !(d = this.setAutoHideCellInfo(o)) || !B.autoHideNames || !B.autoHideMass) {
                            var g = null;
                            if (!this.cells.hasOwnProperty(t)) return (g = new n(e, s, m, r, B.shortMass, B.virMassShots)).setMass(o), g.setNick(h), void(this.cells[t] = g);
                            (g = this.cells[t]).update(e, s, o, m, r, h), g.setDrawing(B.optimizedNames, B.optimizedMass, B.shortMass, B.virMassShots, B.namesStroke, B.massStroke), g.setDrawingScale(w.viewScale, x.namesScale, x.massScale, x.virMassScale, x.strokeScale), i.globalAlpha = x.textAlpha, B.noNames || d && B.autoHideNames || r && B.hideMyName || u && B.hideTeammatesNames || g.drawNick(i, x.namesColor, x.namesFontFamily, x.namesFontWeight, x.namesStrokeColor), !B.showMass || d && B.autoHideMass || r && B.hideMyMass || B.hideEnemiesMass && !r && !m || g.drawMass(i, x.massColor, x.massFontFamily, x.massFontWeight, x.massStrokeColor)
                        }
                    }
                },
                setVirusColor: function(e) {
                    return 183 < Math.floor(e * e / 100) ? "#C80000" : x.virusColor
                },
                setVirusStrokeColor: function(e) {
                    return w.play && 0 != w.playerMaxMass ? .76 < Math.floor(e * e / 100) / (this.selectBiggestCell ? w.playerMaxMass : w.playerMinMass) ? "#FFDC00" : "#C80000" : x.virusStrokeColor
                },
                setAutoHideCellInfo: function(e) {
                    return 40 >= e || .5 > w.viewScale && 550 > e && e < 25 / w.viewScale
                },
                setParty: function() {
                    var a = d("#party-token").val();
                    if (this.gameMode = w.gameMode = d("#gamemode").val(), this.setQuest(), ":party" === this.gameMode && a) {
                        var o = a; - 1 != a.indexOf("#") && (o = (a = a.split("#"))[1]), this.partyToken !== o && (this.partyToken = o, this.flushSkinsMap(), this.flushChatData(), this.cancelTargeting())
                    }
                },
                createParty: function() {
                    d("#create-party-btn").click()
                },
                joinParty: function() {
                    var e = d("#party-token").val();
                    e && (d("#pre-join-party-btn").click(), d(".party-token").val(e), d("#join-party-btn").click())
                },
                leaveParty: function() {
                    d("#party-token, .party-token").val(""), d("#leave-party-btn").click()
                },
                closeParty: function() {
                    d("#party-token, .party-token").val(""), d(".party-icon-back").click()
                },
                flushData: function() {
                    this.flushPartyData(), this.flushSkinsMap(), this.flushChatData(), this.cancelTargeting(), w.play = !1, w.playerColor = null
                },
                flushPartyData: function() {
                    this.teamPlayers = [], this.parties = [], this.lastSentNick = "", this.lastSentClanTag = null, this.lastSentSkinURL = "", this.lastSentCustomColor = "", this.lastSentPartyToken = "", this.lastSentServerToken = ""
                },
                flushCells: function() {
                    this.cells = {}
                },
                flushSkinsMap: function() {
                    this.customSkinsMap = {}
                },
                flushChatData: function() {
                    this.chatUsers = {}
                },
                getWS: function(e) {
                    e && (this.ws = e, this.createServerToken(), this.updateServerInfo(), -1 == this.ws.indexOf("agar.io") && this.closeConnection())
                },
                recreateWS: function(a) {
                    if (!a) return null;
                    var t = null;
                    if (/^[a-zA-Z0-9=+\/]{12,}$/.test(a)) {
                        var o = atob(a);
                        /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}:[0-9]{1,4}/.test(o) && (t = "wss://ip-" + o.replace(/\./g, "-").replace(":", ".tech.agar.io:"))
                    }
                    return !t && /^[a-z0-9]{5,}$/.test(a) && (t = "wss://live-arena-" + a + ".agar.io:443"), t
                },
                createServerToken: function() {
                    var e = this.ws.match(/ip-\d+/),
                        a = this.ws.match(/live-arena-([\w\d]+)/),
                        n = null;
                    if (e && (e = this.ws.replace(".tech.agar.io", "").replace(/-/g, ".").match(/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}:[0-9]{1,4}/)) && (this.serverIP = e[0], n = btoa(this.serverIP)), !n && a && (this.serverArena = a[1], n = this.serverArena), n) {
                        this.serverToken !== n && (this.serverToken = n, this.flushData(), this.flushCells()), this.partyToken = "";
                        var i = this.ws.match(/party_id=([A-Z0-9]{6})/);
                        i && (this.partyToken = i[1], r("/#" + b.encodeURIComponent(this.partyToken)))
                    }
                },
                updateServerInfo: function() {
                    var e = this.ws;
                    e = e.split("wss://").join(""), e = e.substring(0, e.indexOf("?")), d("#ip-box").text("IP: [ " + e + " ]"), d("#server-token").val(this.serverToken), d("#party-token, .party-token").val(this.partyToken)
                },
                gameServerConnect: function(e) {
                    e && (this.skipServerData = !0, b.core && b.core.connect && b.core.connect(e))
                },
                gameServerReconnect: function() {
                    b.MC && b.MC.reconnect ? b.MC.reconnect() : b.master && b.master.reconnect && b.master.reconnect()
                },
                gameServerJoin: function(a) {
                    var t = this.recreateWS(a);
                    t && (this.skipServerData = !0, this.gameServerConnect(t))
                },
                connect: function() {
                    this.closeConnection(), this.flushData(), this.setParty(), console.log("[Agar.io] Connecting to server"), this.socket = this.privateMode && this.privateIP ? new WebSocket(this.privateIP) : new WebSocket(this.publicIP), this.socket.ogarioWS = !0, this.socket.binaryType = "arraybuffer";
                    var a = this;
                    this.socket.onopen = function() {
                        console.log("[Agar.io] Socket open");
                        var t = a.createView(3);
                        t.setUint8(0, 0), t.setUint16(1, 401, !0), a.sendBuffer(t), a.sendPartyData()
                    }, this.socket.onmessage = function(t) {
                        a.handleMessage(t)
                    }, this.socket.onclose = function(t) {
                        a.flushData(), console.log("[Agar.io] Socket close", t)
                    }, this.socket.onerror = function(t) {
                        a.flushData(), console.log("[Agar.io] Socket error", t)
                    }
                },
                closeConnection: function() {
                    if (this.socket) {
                        this.socket.onmessage = null;
                        try {
                            this.socket.close()
                        } catch (e) {}
                        this.socket = null
                    }
                },
                reconnect: function() {
                    this.setParty();
                    var e = this;
                    setTimeout(function() {
                        e.connect()
                    }, 1e3)
                },
                switchServerMode: function() {
                    this.privateIP && (this.privateMode = !this.privateMode, this.isSocketOpen() && (this.closeConnection(), toastr.error("Zamkni\xC3\u201E\xE2\u201E\xA2to po\xC3\u2026\xE2\u20AC\u0161\xC3\u201E\xE2\u20AC\xA6czenie z serwerem!")), this.privateMode ? (toastr.info("Prze\xC3\u2026\xE2\u20AC\u0161\xC3\u201E\xE2\u20AC\xA6czono na serwer prywatny!"), d(".party-panel").show()) : (toastr.info("Prze\xC3\u2026\xE2\u20AC\u0161\xC3\u201E\xE2\u20AC\xA6czono na serwer publiczny!"), d("#active-parties").empty(), d(".party-panel").hide()), this.onJoin(), w.play && this.onPlayerSpawn())
                },
                isSocketOpen: function() {
                    return null !== this.socket && this.socket.readyState === this.socket.OPEN
                },
                writeUint32: function(a, t) {
                    for (;;) {
                        if (0 == (-128 & t)) return void a.push(t);
                        a.push(128 | 127 & t), t >>>= 7
                    }
                },
                createView: function(e) {
                    return new DataView(new ArrayBuffer(e))
                },
                strToBuff: function(a, t) {
                    var e = this.createView(1 + 2 * t.length);
                    e.setUint8(0, a);
                    for (var o = 0; o < t.length; o++) e.setUint16(1 + 2 * o, t.charCodeAt(o), !0);
                    return e
                },
                sendBuffer: function(e) {
                    this.socket.send(e.buffer)
                },
                handleMessage: function(e) {
                    this.readMessage(new DataView(e.data))
                },
                readMessage: function(e) {
                    switch (e.getUint8(0)) {
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
                            break;
                        case 100:
                            this.readChatMessage(e);
                    }
                },
                sendPlayerState: function(a) {
                    if (this.isSocketOpen()) {
                        var t = this.createView(1);
                        t.setUint8(0, a), this.sendBuffer(t)
                    }
                },
                sendPlayerSpawn: function() {
                    this.sendPlayerState(1)
                },
                sendPlayerDeath: function() {
                    this.sendPlayerState(2)
                },
                sendPlayerJoin: function() {
                    this.sendPlayerState(3)
                },
                sendPlayerData: function(a, t, e) {
                    null !== this[t] && this[t] === e || this.isSocketOpen() && (this.sendBuffer(this.strToBuff(a, e)), this[t] = e)
                },
                sendPlayerNick: function() {
                    this.sendPlayerData(10, "lastSentNick", D.nick)
                },
                sendPlayerClanTag: function() {
                    this.sendPlayerData(11, "lastSentClanTag", D.clanTag)
                },
                sendPlayerSkinURL: function() {
                    this.sendPlayerData(12, "lastSentSkinURL", D.skinURL)
                },
                sendPlayerCustomColor: function() {
                    this.sendPlayerData(13, "lastSentCustomColor", D.color)
                },
                sendPlayerColor: function() {
                    this.isSocketOpen() && w.playerColor && this.sendBuffer(this.strToBuff(14, w.playerColor))
                },
                sendPartyToken: function() {
                    this.setParty(), this.sendPlayerData(15, "lastSentPartyToken", this.partyToken)
                },
                sendServerToken: function() {
                    this.sendPlayerData(16, "lastSentServerToken", this.serverToken)
                },
                sendServerJoin: function() {
                    this.sendServerToken(), this.sendPlayerJoin()
                },
                sendServerRegion: function() {
                    if (this.region) {
                        var e = this.region.split("-");
                        this.isSocketOpen() && this.sendBuffer(this.strToBuff(17, e[0]))
                    }
                },
                sendServerGameMode: function() {
                    var e = "FFA";
                    switch (this.gameMode) {
                        case ":battleroyale":
                            e = "BTR";
                            break;
                        case ":teams":
                            e = "TMS";
                            break;
                        case ":experimental":
                            e = "EXP";
                            break;
                        case ":party":
                            e = "PTY";
                    }
                    this.isSocketOpen() && this.sendBuffer(this.strToBuff(18, e))
                },
                sendServerData: function() {
                    this.skipServerData ? this.skipServerData = !1 : (this.region = d("#regions").val(), this.gameMode = d("#gamemode").val(), this.sendServerRegion(), this.sendServerGameMode())
                },
                sendPartyData: function() {
                    this.sendPlayerClanTag(), this.sendPartyToken(), this.sendServerToken(), this.sendPlayerNick()
                },
                sendPlayerUpdate: function() {
                    if (this.isSocketOpen() && w.play && this.playerID && w.playerColor) {
                        function e(a) {
                            for (var t = 0; t < a.length; t++) n.setUint16(s, a.charCodeAt(t), !0), s += 2;
                            n.setUint16(s, 0, !0), s += 2
                        }
                        var a = 41;
                        a += 2 * D.nick.length, a += 2 * D.skinURL.length, console.log(a);
                        var n = this.createView(a);
                        n.setUint8(0, 20), n.setUint32(1, this.playerID, !0);
                        var s = 5;
                        e(D.nick), e(D.skinURL), e(D.color), e(w.playerColor), this.sendBuffer(n)
                    }
                },
                sendPlayerPosition: function() {
                    if (this.isSocketOpen() && w.play && this.playerID) {
                        var e = this.createView(17);
                        e.setUint8(0, 30), e.setUint32(1, this.playerID, !0), e.setInt32(5, this.getPlayerX(), !0), e.setInt32(9, this.getPlayerY(), !0), void 0 === w.playerMass ? e.setUint32(13, this.playerMass, !0) : e.setUint32(13, w.playerMass, !0), this.sendBuffer(e)
                    }
                },
                checkPlayerID: function(a) {
                    if (a)
                        for (var t = 0; t < this.teamPlayers.length; t++)
                            if (this.teamPlayers[t].id == a) return t;
                    return null
                },
                updateTeamPlayer: function(d) {
                    function t() {
                        for (var t = "", a;;) {
                            if (a = d.getUint16(p, !0), 0 == a) break;
                            t += String.fromCharCode(a), p += 2
                        }
                        return p += 2, t
                    }
                    var e = d.getUint32(1, !0),
                        p = 5,
                        i = t(),
                        o = t(),
                        a = t(),
                        n = t(),
                        r = ":party" === this.gameMode ? i + n : i,
                        l = this.checkPlayerID(e);
                    if (null !== l) this.teamPlayers[l].nick = i, this.teamPlayers[l].skinID = r, this.teamPlayers[l].skinURL = o, this.teamPlayers[l].setColor(n, a);
                    else {
                        var m = new function(a, t, e, o) {
                            this.id = a, this.nick = t, this.skinID = e, this.skinURL = o, this.x = 0, this.y = 0, this.lastX = 0, this.lastY = 0, this.mass = 0, this.clanTag = "", this.color = null, this.customColor = x.miniMapTeammatesColor, this.alive = !1, this.updateTime = null, this.pi2 = 2 * Math.PI, this.setColor = function(a, t) {
                                this.color = a, 7 == t.length && (this.customColor = t)
                            }, this.drawPosition = function(r, t, e, i, s) {
                                if (!(!this.alive || i && s && this.id != s)) {
                                    this.lastX = (29 * this.lastX + this.x) / 30, this.lastY = (29 * this.lastY + this.y) / 30;
                                    var o = (this.lastX + t) * e - 10,
                                        a = (this.lastY + t) * e;
                                    0 < this.nick.length && (r.font = x.miniMapNickFontWeight + " " + x.miniMapNickSize + "px " + x.miniMapNickFontFamily, r.textAlign = "center", 0 < x.miniMapNickStrokeSize && (r.lineWidth = x.miniMapNickStrokeSize, r.strokeStyle = x.miniMapNickStrokeColor, r.strokeText(this.nick, o, a - (2 * x.miniMapTeammatesSize + 2))), r.fillStyle = x.miniMapNickColor, r.fillText(this.nick, o, a - (2 * x.miniMapTeammatesSize + 2))), r.beginPath(), r.arc(o, a, x.miniMapTeammatesSize, 0, this.pi2, !1), r.closePath(), r.fillStyle = B.oneColoredTeammates ? x.miniMapTeammatesColor : this.color, r.fill()
                                }
                            }
                        }(e, i, r, o);
                        m.setColor(n, a), this.teamPlayers.push(m)
                    }
                    this.cacheCustomSkin(i, n, o)
                },
                updateTeamPlayerPosition: function(r) {
                    var t = r.getUint32(1, !0),
                        e = this.checkPlayerID(t);
                    if (null !== e) {
                        var i = r.getInt32(5, !0),
                            s = r.getInt32(9, !0),
                            o = r.getUint32(13, !0);
                        if (36e4 < o) return;
                        var a = this.teamPlayers[e];
                        a.x = i, a.y = s, a.mass = o, a.alive = !0, a.updateTime = Date.now(), this.targeting && this.targetID && t == this.targetID && this.updateTarget(a.nick, a.skinURL, i, s, o, a.color)
                    }
                },
                updateTeamPlayers: function() {
                    this.sendPlayerPosition(), this.chatUsers = {}, this.top5 = [];
                    for (var a = 0, o; a < this.teamPlayers.length; a++) o = this.teamPlayers[a], (o.alive && 2e3 <= Date.now() - o.updateTime || 0 == o.mass) && (o.alive = !1, this.targeting && this.targetID && o.id == this.targetID && this.setTargetStatus(2)), o.alive && (this.top5.push({
                        id: o.id,
                        nick: o.nick,
                        x: o.x,
                        y: o.y,
                        mass: o.mass,
                        color: o.color,
                        skin: o.skinURL
                    }), this.isChatUserMuted(o.id) || this.addChatUser(o.id, o.nick));
                    this.top5.sort(function(a, t) {
                        return t.mass - a.mass
                    }), this.displayTop5()
                },
                updateParties: function(n) {
                    this.parties = [];
                    for (var t = n.getUint8(1), e = 2, r = 0; r < t; r++) {
                        for (var l = "", d;;) {
                            if (d = n.getUint16(e, !0), 0 == d) break;
                            l += String.fromCharCode(d), e += 2
                        }
                        e += 2, this.parties.push(l)
                    }
                },
                readChatMessage: function(l) {
                    if (!B.disableChat) {
                        var t = new Date().toTimeString().replace(/^(\d{2}:\d{2}).*/, "$1"),
                            e = l.getUint8(1),
                            i = l.getUint32(2, !0),
                            s = l.getUint32(6, !0);
                        if (!(this.isChatUserMuted(i) || 0 != s && s != this.playerID && i != this.playerID)) {
                            for (var o = "", d = 10, p; d < l.byteLength && (p = l.getUint16(d, !0), 0 != p); d += 2) o += String.fromCharCode(p);
                            this.displayChatMessage(t, e, i, o)
                        }
                    }
                },
                sendChatMessage: function(a, t) {
                    if (!(500 > Date.now() - this.lastMessageSentTime || 0 == t.length || 0 == D.nick.length) && this.isSocketOpen()) {
                        t = D.nick + ": " + t;
                        var o = this.createView(10 + 2 * t.length);
                        o.setUint8(0, 100), o.setUint8(1, a), o.setUint32(2, this.playerID, !0), o.setUint32(6, 0, !0);
                        for (var n = 0; n < t.length; n++) o.setUint16(10 + 2 * n, t.charCodeAt(n), !0);
                        this.sendBuffer(o), this.lastMessageSentTime = Date.now()
                    }
                },
                prepareCommand: function(e) {
                    return e.replace("%currentSector%", this.currentSector)
                },
                sendCommand: function(a) {
                    var t = this.prepareCommand(l["comm" + a]);
                    this.sendChatMessage(102, t)
                },
                addChatUser: function(a, t) {
                    this.chatUsers[a] = t
                },
                getChatUserNick: function(e) {
                    return this.chatUsers.hasOwnProperty(e) ? this.chatUsers[e] : ""
                },
                muteChatUser: function(a) {
                    if (a && !this.isChatUserMuted(a)) {
                        var t = this.getChatUserNick(a);
                        this.chatMutedUsers[a] = t, this.chatMutedUserIDs.push(a), toastr.error(y.userMuted.replace("%user%", "<strong>" + this.escapeHTML(t) + "</strong>") + " <button data-user-id=\"" + a + "\" class=\"btn btn-xs btn-green btn-unmute-user\">" + y.unmute + "</button>")
                    }
                },
                unmuteChatUser: function(a) {
                    if (a) {
                        var t = this.chatMutedUserIDs.indexOf(a); - 1 != t && (this.chatMutedUserIDs.splice(t, 1), toastr.info(y.userUnmuted.replace("%user%", "<strong>" + this.escapeHTML(this.chatMutedUsers[a]) + "</strong>")), delete this.chatMutedUsers[a])
                    }
                },
                isChatUserMuted: function(e) {
                    return -1 != this.chatMutedUserIDs.indexOf(e)
                },
                parseMessage: function(a) {
                    var t = /\[img\]([\w\:\/\.\?]+)\[\/img\]/i;
                    if (t.test(a)) {
                        var e = a.match(t)[1];
                        return B.showChatImages && this.checkImgURL(e) ? "<img src=\"" + e + "\" style=\"width:100%;border:none;\">" : ""
                    }
                    var n = /\[yt\]([\w-]{11})\[\/yt\]/i;
                    if (n.test(a)) return B.showChatVideos ? "<iframe type=\"text/html\" width=\"100%\" height=\"auto\" src=\"https://www.youtube.com/embed/" + a.match(n)[1] + "?autoplay=1&amp;vq=tiny\" frameborder=\"0\" />" : "";
                    var s = this.escapeHTML(a);
                    return B.chatEmoticons && (s = this.parseEmoticons(s)), s
                },
                parseEmoticons: function(e) {
                    return (e + "").replace(/\&lt\;3/g, "<3").replace(/(O\:\)|3\:\)|8\=\)|\:\)|\;\)|\=\)|\:D|X\-D|\=D|\:\(|\;\(|\:P|\;P|\:\*|\$\)|\<3|\:o|\(\:\||\:\||\:\\|\:\@|\|\-\)|\^\_\^|\-\_\-|\$\_\$|\(poop\)|\(fuck\)|\(clap\)|\(ok\)|\(victory\)|\(y\)|\(n\))/g, function(e) {
                        return "<img src=\"https://cdn.ogario.ovh/static/emoticons/" + S[e] + "\" alt=\"" + e + "\" class=\"emoticon\">"
                    })
                },
                displayChatMessage: function(s, t, e, i) {
                    if (0 != i.length) {
                        var o = i.split(": ", 1).toString(),
                            l = this.parseMessage(i.replace(o + ": ", ""));
                        if (!(0 == o.length || 15 < o.length || 0 == l.length)) {
                            var n = "";
                            if (0 != e && e != this.playerID && (this.addChatUser(e, o), n = "<a href=\"#\" data-user-id=\"" + e + "\" class=\"mute-user ogicon-user-minus\"></a> "), o = this.escapeHTML(o), 101 == t) {
                                if (B.showChatBox) return d("#chat-box").append("<div class=\"message\"><span class=\"message-time\">[" + s + "] </span>" + n + "<span class=\"message-nick\">" + o + ": </span><span class=\"message-text\">" + l + "</span></div>"), d("#chat-box").perfectScrollbar("update"), d("#chat-box").animate({
                                    scrollTop: d("#chat-box").prop("scrollHeight")
                                }, 500), void(B.chatSounds && this.playSound(this.messageSound));
                                B.hideChat || (toastr.success("<span class=\"message-nick\">" + o + ": </span><span class=\"message-text\">" + l + "</span>" + n), B.chatSounds && this.playSound(this.messageSound)), this.chatHistory.push({
                                    nick: o,
                                    message: l
                                }), 15 < this.chatHistory.length && this.chatHistory.shift()
                            } else if (102 == t) {
                                if (B.showChatBox) return d("#chat-box").append("<div class=\"message command\"><span class=\"command-time\">[" + s + "] </span>" + n + "<span class=\"command-nick\">" + o + ": </span><span class=\"command-text\">" + l + "</span></div>"), d("#chat-box").perfectScrollbar("update"), d("#chat-box").animate({
                                    scrollTop: d("#chat-box").prop("scrollHeight")
                                }, 500), void(B.chatSounds && this.playSound(this.commandSound));
                                B.hideChat || (toastr.warning("<span class=\"command-nick\">" + o + ": </span><span class=\"command-text\">" + l + "</span>" + n), B.chatSounds && this.playSound(this.commandSound))
                            } else d("#messages").append(i)
                        }
                    }
                },
                displayUserList: function(r, t, e, i, s) {
                    var o = "";
                    if (void 0 !== Object.keys(r) && Object.keys(r).length) {
                        for (var l in o += "<ol class=\"user-list\">", r) r.hasOwnProperty(l) && (o += "<li><strong>" + this.escapeHTML(r[l]) + "</strong> <button data-user-id=\"" + l + "\" class=\"btn btn-xs " + e + "\">" + i + "</button></li>");
                        o += "</ol>"
                    } else o += y.none;
                    toastr[s](o, t, {
                        closeButton: !0,
                        tapToDismiss: !1
                    })
                },
                displayChatActiveUsers: function() {
                    this.displayUserList(this.chatUsers, y.activeUsers, "btn-red btn-mute-user", y.mute, "info")
                },
                displayChatMutedUsers: function() {
                    this.displayUserList(this.chatMutedUsers, y.mutedUsers, "btn-green btn-unmute-user", y.unmute, "error")
                },
                preloadChatSounds: function() {
                    this.setMessageSound(), this.setCommandSound()
                },
                setChatSoundsBtn: function() {
                    B.chatSounds ? d(".chat-sound-notifications").removeClass("ogicon-volume-mute2").addClass("ogicon-volume-high") : d(".chat-sound-notifications").removeClass("ogicon-volume-high").addClass("ogicon-volume-mute2")
                },
                setMessageSound: function() {
                    this.messageSound = this.setSound(B.messageSound)
                },
                setCommandSound: function() {
                    this.commandSound = this.setSound(B.commandSound)
                },
                setSound: function(e) {
                    return e ? new Audio(e) : null
                },
                playSound: function(e) {
                    e && e.play && (e.pause(), e.currentTime = 0, e.play())
                },
                setTargeting: function() {
                    this.targetID && (this.targeting = !this.targeting, w.targeting = this.targeting, this.setTargetingInfo())
                },
                setTargetingInfo: function() {
                    this.targeting ? (d("#set-targeting").addClass("active"), d("#target-status").show(), 2 != this.targetStatus && d("#target-summary").show()) : (d("#set-targeting").removeClass("active"), d("#target-summary, #target-status").hide())
                },
                cancelTargeting: function() {
                    this.setTargetStatus(0)
                },
                setPrivateMiniMap: function() {
                    this.targetID && (this.privateMiniMap = !this.privateMiniMap, this.privateMiniMap ? d("#set-private-minimap").addClass("active") : d("#set-private-minimap").removeClass("active"))
                },
                setTarget: function(a) {
                    var t = this.checkPlayerID(a);
                    if (null !== t) {
                        var e = this.teamPlayers[t];
                        if (this.targetID = e.id, this.updateTarget(e.nick, e.skinURL, e.x, e.y, e.mass, e.color), !e.alive) return void this.setTargetStatus(2);
                        this.setTargetStatus(1)
                    } else this.setTargetStatus(0)
                },
                setTargetStatus: function(e) {
                    0 === e ? (this.targetStatus = 0, this.targetID = 0, this.targetNick = "", this.targetSkinURL = "", this.targeting = !1, w.targeting = !1, this.privateMiniMap = !1, d("#target-skin, #target-nick, #target-summary").hide(), d("#target-status").show().text("[" + y.targetNotSet + "]"), d("#target-panel-hud a").removeClass("active")) : 1 === e ? (this.targetStatus = 1, this.targeting || (this.targeting = !0, w.targeting = !0, this.setTargetingInfo()), d("#target-skin, #target-nick, #target-status, #target-summary").show()) : 2 === e ? (this.targetStatus = 2, d("#target-summary").hide(), d("#target-status").show().text("[" + y.targetDead + "]"), w.resetTargetPosition()) : void 0
                },
                changeTarget: function() {
                    for (var a = this.checkPlayerID(this.targetID), o = null, s = 0; s < this.teamPlayers.length; s++)
                        if (this.teamPlayers[s].alive) {
                            if (null === a) {
                                a = s;
                                break
                            }
                            if (s < a && null == o) o = s;
                            else if (s > a) {
                                o = s;
                                break
                            }
                        } null !== o && (a = o), null === a ? this.setTargetStatus(0) : this.setTarget(this.teamPlayers[a].id)
                },
                updateTarget: function(s, t, e, o, a, n) {
                    w.setTargetPosition(e, o), this.targetNick !== s && (this.targetNick = s, d("#target-nick").html(this.escapeHTML(s))), d("#target-skin").css("background-color", n), t && this.targetSkinURL !== t && (this.customSkinsCache.hasOwnProperty(t + "_cached") ? (d("#target-skin img").attr("src", t), this.targetSkinURL = t) : d("#target-skin img").attr("src", "https://cdn.ogario.ovh/static/img/blank.png")), d("#target-status").text("[" + this.shortMassFormat(a) + "]");
                    var r = this.calculateMapSector(e, o),
                        i = y.targetDistance + ": <span class=\"hud-main-color\">" + w.targetDistance + " [" + r + "]</span>";
                    w.play && (i += " | " + y.targetMass + ": <span class=\"hud-main-color\">" + this.shortMassFormat(a + w.playerMass) + "</span>"), d("#target-summary").html(i), 1 != this.targetStatus && this.setTargetStatus(1)
                },
                updateQuest: function() {
                    this.showQuest && ":ffa" === this.gameMode && b.MC && b.MC.getQuestProgressLabel && (this.questHUD.textContent = b.MC.getQuestProgressLabel())
                },
                init: function() {
                    this.loadSettings(), this.loadProfiles(), this.setLang(), this.setMenu(), this.setUI(), P && P.setTheme(), this.setShowQuickMenu(), this.setShowSkinsPanel(), this.setProfile(), this.setMainButtons(), this.setStreamMode(), this.setHideSkinUrl(), this.setMiniMap(), this.setAutoResp(), this.setDisableChat(), this.setShowChatBox(), this.setTop5(), this.setTargetingHUD(), this.setQuest(), this.displayTime(), this.setCenteredLb(), this.setNormalLb(), this.displayStats(), this.preloadChatSounds(), this.setChatSoundsBtn();
                    var e = this;
                    setInterval(function() {
                        e.drawMiniMap()
                    }, 33), setInterval(function() {
                        e.updateTeamPlayers()
                    }, this.updateInterval)
                }
            },
            A = {
                ws: null,
                socket: null,
                protocolKey: null,
                clientKey: null,
                connectionOpened: !1,
                accessTokenSent: !1,
                loggedIn: !1,
                clientVersion: 30400,
                clientVersionString: "3.4.0",
                time: Date.now(),
                serverTime: 0,
                serverTimeDiff: 0,
                loggedInTime: 0,
                mapSize: 14142,
                mapOffset: 7071,
                mapOffsetX: 0,
                mapOffsetY: 0,
                mapOffsetFixed: !1,
                mapMinX: -7071,
                mapMinY: -7071,
                mapMaxX: 7071,
                mapMaxY: 7071,
                viewMinX: 0,
                viewMinY: 0,
                viewMaxX: 0,
                viewMaxY: 0,
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
                ghostCells: [],
                playerX: 0,
                playerY: 0,
                spawnX: null,
                spawnY: null,
                playerSize: 0,
                playerMass: 0,
                playerMaxMass: 0,
                playerMinMass: 0,
                playerScore: 0,
                playerSplitCells: 0,
                playerColor: null,
                playerNick: "",
                playerPosition: 0,
                leaderboard: [],
                biggerSTECellsCache: [],
                biggerCellsCache: [],
                smallerCellsCache: [],
                STECellsCache: [],
                STE: 0,
                xFour: 0,
                xSixTeen: 0,
                autoZoom: !1,
                zoomValue: .1,
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
                cRadius: 10,
                cAngle: 4,
                cAngle1: 0,
                cAngle2: 0,
                cAlpha: 1,
                drawCommander: 0,
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
                    joined: !1
                },
                play: !1,
                pause: !1,
                targeting: !1,
                removePlayerCell: !1,
                showCustomSkins: !0,
                showFood: !0,
                foodIsHidden: !1,
                selectBiggestCell: !0,
                hideSmallBots: !1,
                pressedKeys: {},
                connect: function(e) {
                    console.log("[Agar.io] Connecting to game server:", e);
                    var a = this;
                    this.closeConnection(), this.flushCellsData(), this.protocolKey = null, this.clientKey = null, this.accessTokenSent = !1, this.connectionOpened = !1, this.loggedIn = !1, this.mapOffsetFixed = !1, this.leaderboard = [], this.ws = e, this.socket = new WebSocket(e), this.socket.binaryType = "arraybuffer", this.socket.onopen = function() {
                        a.onOpen()
                    }, this.socket.onmessage = function(e) {
                        a.onMessage(e)
                    }, this.socket.onerror = function(e) {
                        a.onError(e)
                    }, this.socket.onclose = function(e) {
                        a.onClose(e)
                    }, U.getWS(this.ws), U.sendServerJoin(), U.sendServerData(), U.displayLeaderboard(""), b.master && b.master.onConnect && b.master.onConnect()
                },
                onOpen: function() {
                    console.log("[Agar.io] Game server socket open"), this.time = Date.now();
                    var t = this.createView(5);
                    t.setUint8(0, 254), t.setUint32(1, 20, !0), this.sendMessage(t), (t = this.createView(5)).setUint8(0, 255), t.setUint32(1, this.clientVersion, !0), this.sendMessage(t), this.connectionOpened = !0
                },
                onMessage: function(e) {
                    e = new DataView(e.data), this.protocolKey && (e = this.shiftMessage(e, this.protocolKey ^ this.clientVersion)), this.handleMessage(e)
                },
                onError: function() {
                    console.log("[Agar.io] Game server socket error"), this.flushCellsData(), b.master && b.master.onDisconnect && b.master.onDisconnect()
                },
                onClose: function() {
                    console.log("[Agar.io] Game server socket close"), this.flushCellsData(), b.master && b.master.onDisconnect && b.master.onDisconnect()
                },
                closeConnection: function() {
                    if (this.socket) {
                        this.socket.onopen = null, this.socket.onmessage = null, this.socket.onerror = null, this.socket.onclose = null;
                        try {
                            this.socket.close()
                        } catch (e) {}
                        this.socket = null, this.ws = null
                    }
                },
                isSocketOpen: function() {
                    return null !== this.socket && this.socket.readyState === this.socket.OPEN
                },
                createView: function(e) {
                    return new DataView(new ArrayBuffer(e))
                },
                sendBuffer: function(e) {
                    this.socket.send(e.buffer)
                },
                sendMessage: function(e) {
                    if (this.connectionOpened) {
                        if (!this.clientKey) return;
                        e = this.shiftMessage(e, this.clientKey), this.clientKey = this.shiftKey(this.clientKey)
                    }
                    this.sendBuffer(e)
                },
                sendAction: function(a) {
                    if (this.isSocketOpen()) {
                        var t = this.createView(1);
                        t.setUint8(0, a), this.sendMessage(t)
                    }
                },
                sendSpectate: function() {
                    this.sendAction(1)
                },
                sendFreeSpectate: function() {
                    this.sendAction(18)
                },
                sendEject: function() {
                    this.sendPosition(), this.sendAction(21)
                },
                sendSplit: function() {
                    this.sendPosition(), this.sendAction(17)
                },
                sendNick: function(e) {
                    this.playerNick = e, e = b.unescape(b.encodeURIComponent(e));
                    for (var a = this.createView(2 + e.length), o = 0; o < e.length; o++) a.setUint8(o + 1, e.charCodeAt(o));
                    this.sendMessage(a)
                },
                sendPosition: function() {
                    if (this.isSocketOpen() && this.connectionOpened && this.clientKey) {
                        var a = this.cursorX,
                            o = this.cursorY;
                        (!this.play && this.targeting || this.pause) && (a = this.targetX, o = this.targetY);
                        var s = this.createView(13);
                        s.setUint8(0, 16), s.setInt32(1, a, !0), s.setInt32(5, o, !0), s.setUint32(9, this.protocolKey, !0), this.sendMessage(s)
                    }
                },
                sendAccessToken: function(e, t, a) {
                    if (!this.accessTokenSent) {
                        a || (a = 102);
                        var o = e.length,
                            s = this.clientVersionString.length,
                            n = [a, 8, 1, 18];
                        U.writeUint32(n, o + s + 23), n.push(8, 10, 82), U.writeUint32(n, o + s + 18), n.push(8, t, 18, s + 8, 8, 5, 18, s);
                        for (var r = 0; r < s; r++) n.push(this.clientVersionString.charCodeAt(r));
                        for (n.push(24, 0, 32, 0, 26), U.writeUint32(n, o + 3), n.push(10), U.writeUint32(n, o), r = 0; r < o; r++) n.push(e.charCodeAt(r));
                        n = new Uint8Array(n);
                        var i = new DataView(n.buffer);
                        this.sendMessage(i)
                    }
                },
                sendFbToken: function(e) {
                    console.log("[Agar.io] Facebook Token: " + e), this.sendAccessToken(e, 2)
                },
                sendGplusToken: function(e) {
                    console.log("[Agar.io] Google Token: " + e), this.sendAccessToken(e, 4)
                },
                sendRecaptcha: function(a) {
                    var t = this.createView(2 + a.length);
                    t.setUint8(0, 86);
                    for (var e = 0; e < a.length; e++) t.setUint8(1 + e, a.charCodeAt(e));
                    t.setUint8(a.length + 1, 0), this.sendMessage(t)
                },
                setClientVersion: function(a, t) {
                    this.clientVersion = a, this.clientVersionString = t, console.log("[Agar.io] Client version:", a, t)
                },
                generateClientKey: function(d, t) {
                    if (!d.length || !t.byteLength) return null;
                    for (var e = null, p = d.match(/(ws+:\/\/)([^:]*)(:\d+)/)[2], s = p.length + t.byteLength, o = new Uint8Array(s), a = 0; a < p.length; a++) o[a] = p.charCodeAt(a);
                    o.set(t, p.length);
                    for (var m = new DataView(o.buffer), r = s - 1, g = 0 | 4 + (-4 & r - 4), h = 255 ^ r, f = 0; 3 < r;) e = 0 | Math.imul(m.getInt32(f, !0), 1540483477), h = (0 | Math.imul(e >>> 24 ^ e, 1540483477)) ^ (0 | Math.imul(h, 1540483477)), r -= 4, f += 4;
                    switch (r) {
                        case 3:
                            h = o[g + 2] << 16 ^ h, h = o[g + 1] << 8 ^ h;
                            break;
                        case 2:
                            h = o[g + 1] << 8 ^ h;
                            break;
                        case 1:
                            break;
                        default:
                            e = h;
                    }
                    return e != h && (e = 0 | Math.imul(o[g] ^ h, 1540483477)), e ^= h = e >>> 13, e = 0 | Math.imul(e, 1540483477), e ^= h = e >>> 15, console.log("[Agar.io] Generated client key:", e), e
                },
                shiftKey: function(e) {
                    return e = 0 | Math.imul(e, 1540483477), e = 114296087 ^ (0 | Math.imul(e >>> 24 ^ e, 1540483477)), (e = 0 | Math.imul(e >>> 13 ^ e, 1540483477)) >>> 15 ^ e
                },
                shiftMessage: function(a, t, e) {
                    if (e)
                        for (o = 0; o < a.length; o++) a.writeUInt8(a.readUInt8(o) ^ 255 & t >>> 8 * (o % 4), o);
                    else
                        for (var o = 0; o < a.byteLength; o++) a.setUint8(o, a.getUint8(o) ^ 255 & t >>> 8 * (o % 4));
                    return a
                },
                decompressMessage: function(a) {
                    var t = new c(a.buffer),
                        e = new c(t.readUInt32LE(1));
                    return m.decodeBlock(t.slice(5), e), e
                },
                handleMessage: function(e) {
                    var y = function() {
                            for (var t = "", a;;) {
                                if (a = e.getUint8(k++), 0 == a) break;
                                t += String.fromCharCode(a)
                            }
                            return t
                        },
                        k = 0,
                        i = e.getUint8(k++);
                    switch (54 == i && (i = 53), i) {
                        case 5:
                            break;
                        case 17:
                            this.viewX = e.getFloat32(k, !0), k += 4, this.viewY = e.getFloat32(k, !0), k += 4, this.scale = e.getFloat32(k, !0);
                            break;
                        case 18:
                            this.protocolKey && (this.protocolKey = this.shiftKey(this.protocolKey)), console.log(18, "protocolKey", this.protocolKey), this.flushCellsData();
                            break;
                        case 32:
                            this.playerCellIDs.push(e.getUint32(k, !0)), this.play || (this.play = !0, U.hideMenu(), this.playerColor = null, U.onPlayerSpawn());
                            break;
                        case 50:
                            this.pieChart = [];
                            var S = e.getUint32(k, !0);
                            k += 4;
                            for (var a = 0; a < S; a++) this.pieChart.push(e.getFloat32(k, !0)), k += 4;
                            R.drawPieChart();
                            break;
                        case 53:
                            (this.leaderboard = [], this.playerPosition = 0, 54 == e.getUint8(0)) && (e.getUint16(k, !0), k += 2);
                            for (var C = 0; k < e.byteLength;) {
                                var w = "",
                                    M = 0,
                                    v = !1;
                                C++, 2 & (x = e.getUint8(k++)) && (w = b.decodeURIComponent(b.escape(y()))), 4 & x && (M = e.getUint32(k, !0), k += 4), 8 & x && (w = this.playerNick, M = "isPlayer", this.playerPosition = C), 16 & x && (v = !0), this.leaderboard.push({
                                    nick: w,
                                    id: M,
                                    isFriend: v
                                })
                            }
                            this.handleLeaderboard();
                            break;
                        case 54:
                        case 69:
                            var x = e.getUint16(k, !0);
                            for (k += 2, this.ghostCells = [], a = 0; a < x; a++) {
                                var _ = e.getUint32(k, !0);
                                k += 4;
                                var T = e.getUint32(k, !0);
                                k += 4;
                                var P = e.getUint32(k, !0);
                                k += 5;
                                var I = ~~Math.sqrt(100 * P);
                                this.ghostCells.push({
                                    x: _,
                                    y: T,
                                    size: I,
                                    mass: P,
                                    inView: this.isInView(_, T, I)
                                })
                            }
                            break;
                        case 85:
                            console.log("[Agar.io] Captcha requested"), b.master && b.master.recaptchaRequested && b.master.recaptchaRequested();
                            break;
                        case 102:
                            20 > e.byteLength && (this.loggedIn = !1, b.logout && b.logout());
                            break;
                        case 103:
                            this.accessTokenSent = !0;
                            break;
                        case 114:
                        case 161:
                            break;
                        case 176:
                            this.battleRoyale.startTime = e.getUint32(k, !0);
                            break;
                        case 177:
                            this.battleRoyale.joined = !0;
                            break;
                        case 178:
                            this.battleRoyale.players = e.getUint16(k, !0), k += 2;
                            var x = e.getUint16(k, !0);
                            k += 2, x || (this.battleRoyale.state = 0, this.battleRoyale.joined = !1), 3 & x && (this.battleRoyale.state = e.getUint8(k++), this.battleRoyale.x = e.getInt32(k, !0), k += 4, this.battleRoyale.y = e.getInt32(k, !0), k += 4, this.battleRoyale.radius = e.getUint32(k, !0), k += 4, this.battleRoyale.shrinkTime = 1e3 * e.getUint32(k, !0), k += 4, this.battleRoyale.shrinkTime && (this.battleRoyale.timeLeft = ~~((this.battleRoyale.shrinkTime - Date.now() + this.serverTimeDiff) / 1e3), 0 > this.battleRoyale.timeLeft && (this.battleRoyale.timeLeft = 0))), 2 & x && (this.battleRoyale.targetX = e.getInt32(k, !0), k += 4, this.battleRoyale.targetY = e.getInt32(k, !0), k += 4, this.battleRoyale.targetRadius = e.getUint32(k, !0));
                            break;
                        case 179:
                            x = e.getUint8(k), b.decodeURIComponent(b.escape(y())), x || b.decodeURIComponent(b.escape(y()));
                            break;
                        case 180:
                            this.battleRoyale.joined = !1, this.battleRoyale.rank = [], this.battleRoyale.playerRank = e.getUint32(k, !0), k += 8;
                            var _ = e.getUint16(k, !0);
                            for (k += 2, a = 0; a < _; a++) {
                                var D = b.decodeURIComponent(b.escape(y())),
                                    T = e.getUint32(k, !0);
                                k += 4, this.battleRoyale.rank.push({
                                    place: T,
                                    name: D
                                })
                            }
                            break;
                        case 226:
                            var P = e.getUint16(1, !0);
                            (e = this.createView(3)).setUint8(0, 227), e.setUint16(1, P), this.sendMessage(e);
                            break;
                        case 241:
                            this.protocolKey = e.getUint32(k, !0), console.log("[Agar.io] Received protocol key:", this.protocolKey);
                            var I = new Uint8Array(e.buffer, k += 4);
                            this.clientKey = this.generateClientKey(this.ws, I), b.master && b.master.login && b.master.login();
                            break;
                        case 242:
                            this.serverTime = 1e3 * e.getUint32(k, !0), this.serverTimeDiff = Date.now() - this.serverTime;
                            break;
                        case 255:
                            this.handleSubmessage(e);
                            break;
                        default:
                            console.log("[Agar.io] Unknown opcode:", e.getUint8(0));
                    }
                },
                handleSubmessage: function(a) {
                    var o = 0;
                    switch ((a = this.decompressMessage(a)).readUInt8(o++)) {
                        case 16:
                            this.updateCells(a, o);
                            break;
                        case 64:
                            this.viewMinX = a.readDoubleLE(o), o += 8, this.viewMinY = a.readDoubleLE(o), o += 8, this.viewMaxX = a.readDoubleLE(o), o += 8, this.viewMaxY = a.readDoubleLE(o), this.setMapOffset(this.viewMinX, this.viewMinY, this.viewMaxX, this.viewMaxY);
                            break;
                        default:
                            console.log("[Agar.io] Unknown sub opcode:", a.readUInt8(0));
                    }
                },
                handleLeaderboard: function() {
                    for (var a = "", n = "", r = 0, l; r < this.leaderboard.length && B.limLB != r; r++) l = "<span>", "isPlayer" === this.leaderboard[r].id ? l = "<span class=\"me\">" : D.clanTag.length && 0 == this.leaderboard[r].nick.indexOf(D.clanTag) && (l = "<span class=\"teammate\">"), a += l + (r + 1) + ". " + U.escapeHTML(this.leaderboard[r].nick) + "</span>", $("#pa-box").text("Players: [ " + this.leaderboard.length + " ]");
                    if (this.playerPosition > B.limLB && (a += "<span class=\"me\">" + this.playerPosition + ". " + U.escapeHTML(this.playerNick) + "</span>"), B.showLbData)
                        for (var d = 0; d < this.ghostCells.length && d != r; d++) n += "<span class=\"lb-data\"><span id=\"lbmarker\" class=\"fa fa-map-marker\"> " + U.calculateMapSector(this.ghostCells[d].x, this.ghostCells[d].y) + "</span><span id=\"lbmass\" class=\"fa fa-eercast\"> " + U.shortMassFormat(this.ghostCells[d].mass) + "</span></span>";
                    U.displayLeaderboard(a, n)
                },
                flushCellsData: function() {
                    this.indexedCells = {}, this.cells = [], this.playerCells = [], this.playerCellIDs = [], this.ghostCells = [], this.food = [], this.viruses = []
                },
                setMapOffset: function(a, t, e, o) {
                    14e3 < e - a && 14e3 < o - t && (this.mapOffsetX = this.mapOffset - e, this.mapOffsetY = this.mapOffset - o, this.mapMinX = ~~(-this.mapOffset - this.mapOffsetX), this.mapMinY = ~~(-this.mapOffset - this.mapOffsetY), this.mapMaxX = ~~(this.mapOffset - this.mapOffsetX), this.mapMaxY = ~~(this.mapOffset - this.mapOffsetY), this.mapOffsetFixed || (this.viewX = (e + a) / 2, this.viewY = (o + t) / 2), this.mapOffsetFixed = !0, console.log("[Agar.io] Map offset fixed (x, y):", this.mapOffsetX, this.mapOffsetY))
                },
                isInView: function(a, t, e) {
                    var n = this.canvasWidth / 2 / this.scale,
                        s = this.canvasHeight / 2 / this.scale;
                    return !(a + e < this.viewX - n || t + e < this.viewY - s || a - e > this.viewX + n || t - e > this.viewY + s)
                },
                updateCells: function(e, t) {
                    var w = function() {
                        for (var a = "", o;;) {
                            if (o = e.readUInt8(t++), 0 == o) break;
                            a += String.fromCharCode(o)
                        }
                        return a
                    };
                    this.time = Date.now(), this.removePlayerCell = !1;
                    var s = e.readUInt16LE(t);
                    t += 2;
                    for (var v = 0; v < s; v++) {
                        var _ = this.indexedCells[e.readUInt32LE(t)],
                            T = this.indexedCells[e.readUInt32LE(t + 4)];
                        t += 8, _ && T && (T.targetX = _.x, T.targetY = _.y, T.targetSize = T.size, T.time = this.time, T.removeCell())
                    }
                    for (v = 0;;) {
                        var r = e.readUInt32LE(t);
                        if (t += 4, 0 == r) break;
                        var P = e.readInt32LE(t);
                        t += 4;
                        var h = e.readInt32LE(t);
                        t += 4;
                        var c = e.readUInt16LE(t);
                        t += 2;
                        var u = e.readUInt8(t++),
                            d = 0;
                        128 & u && (d = e.readUInt8(t++));
                        var I = null,
                            D = null,
                            A = "";
                        if (2 & u) {
                            var R = e.readUInt8(t++),
                                y = e.readUInt8(t++),
                                k = e.readUInt8(t++);
                            I = this.rgb2Hex(~~(.9 * R), ~~(.9 * y), ~~(.9 * k))
                        }
                        4 & u && (D = w()), 8 & u && (A = b.decodeURIComponent(b.escape(w())));
                        var C = 1 & u,
                            S = 1 & d,
                            M = null;
                        this.indexedCells.hasOwnProperty(r) ? (M = this.indexedCells[r], I && (M.color = I)) : ((M = new n(r, P, h, c, I, S, C, !1, B.shortMass, B.virMassShots)).time = this.time, S ? this.food.push(M) : (C && B.virusesRange && this.viruses.push(M), this.cells.push(M), -1 != this.playerCellIDs.indexOf(r) && -1 == this.playerCells.indexOf(M) && (M.isPlayerCell = !0, this.playerColor = I, this.playerCells.push(M))), this.indexedCells[r] = M), M.isPlayerCell && (A = this.playerNick), A && (M.targetNick = A), M.targetX = P, M.targetY = h, M.targetSize = c, M.isFood = S, M.isVirus = C, D && (M.skin = D), 4 & d && (e.readUInt32LE(t), t += 4)
                    }
                    for (s = e.readUInt16LE(t), t += 2, v = 0; v < s; v++) r = e.readUInt32LE(t), t += 4, (M = this.indexedCells[r]) && M.removeCell();
                    this.removePlayerCell && !this.playerCells.length && (this.play = !1, U.onPlayerDeath(), U.showMenu(300))
                },
                color2Hex: function(a) {
                    var t = a.toString(16);
                    return 1 == t.length ? "0" + t : t
                },
                rgb2Hex: function(a, t, e) {
                    return "#" + this.color2Hex(a) + this.color2Hex(t) + this.color2Hex(e)
                },
                sortCells: function() {
                    this.cells.sort(function(a, t) {
                        return a.size == t.size ? a.id - t.id : a.size - t.size
                    })
                },
                calculatePlayerMassAndPosition: function() {
                    for (var r = 0, l = 0, d = 0, p = 0, c = this.playerCells.length, o = 0, m; o < c; o++) m = this.playerCells[o], r += m.size, l += m.targetSize * m.targetSize, d += m.x / c, p += m.y / c;
                    this.viewX = d, this.viewY = p, this.playerSize = r, this.playerMass = ~~(l / 100), this.recalculatePlayerMass()
                },
                recalculatePlayerMass: function() {
                    if (this.playerScore = Math.max(this.playerScore, this.playerMass), B.virColors || B.splitRange || B.oppColors || B.oppRings || B.showStatsSTE) {
                        var a = this.playerCells,
                            t = a.length;
                        a.sort(function(a, t) {
                            return a.size == t.size ? a.id - t.id : a.size - t.size
                        }), this.playerMinMass = ~~(a[0].size * a[0].size / 100), this.playerMaxMass = ~~(a[t - 1].size * a[t - 1].size / 100), this.playerSplitCells = t
                    }
                    if (B.showStatsSTE) {
                        var e = this.selectBiggestCell ? this.playerMaxMass : this.playerMinMass;
                        this.STE = 35 < e ? ~~(e * (1e3 > e ? .35 : .38)) : null
                    }
                },
                compareCells: function() {
                    if (this.play && (B.oppColors || B.oppRings || B.splitRange)) {
                        (B.oppRings || B.splitRange) && (this.biggerSTECellsCache = [], this.biggerCellsCache = [], this.smallerCellsCache = [], this.STECellsCache = []);
                        for (var n = 0, r; n < this.cells.length; n++)
                            if (r = this.cells[n], !r.isVirus) {
                                var l = ~~(r.size * r.size / 100),
                                    i = this.selectBiggestCell ? this.playerMaxMass : this.playerMinMass,
                                    s = l / i,
                                    o = 1e3 > i ? .35 : .38;
                                B.oppColors && !B.oppRings && (r.oppColor = this.setCellOppColor(r.isPlayerCell, s, o)), !r.isPlayerCell && (B.splitRange || B.oppRings) && this.cacheCells(r.x, r.y, r.size, s, o)
                            }
                    }
                },
                cacheCells: function(a, t, e, n, s) {
                    return 2.5 <= n ? void this.biggerSTECellsCache.push({
                        x: a,
                        y: t,
                        size: e
                    }) : 1.25 <= n ? void this.biggerCellsCache.push({
                        x: a,
                        y: t,
                        size: e
                    }) : 1.25 > n && .75 < n ? void 0 : n > s ? void this.smallerCellsCache.push({
                        x: a,
                        y: t,
                        size: e
                    }) : void this.STECellsCache.push({
                        x: a,
                        y: t,
                        size: e
                    })
                },
                setCellOppColor: function(a, t, e) {
                    return a ? D.color : 11 < t ? "#FF008C" : 2.5 <= t ? "#BE00FF" : 1.25 <= t ? "#FF0A00" : 1.25 > t && .75 < t ? "#FFDC00" : t > e ? "#00C8FF" : "#64FF00"
                },
                getCursorPosition: function() {
                    this.cursorX = (this.clientX - this.canvasWidth / 2) / this.viewScale + this.viewX, this.cursorY = (this.clientY - this.canvasHeight / 2) / this.viewScale + this.viewY
                },
                setZoom: function(e) {
                    e.preventDefault(), this.zoomValue *= Math.pow(B.zoomSpeedValue, e.wheelDelta / -120 || e.detail || 0), this.zoomValue > 4 / this.viewScale && (this.zoomValue = 4 / this.viewScale)
                },
                setTargetPosition: function(a, t) {
                    this.targetX = a - this.mapOffsetX, this.targetY = t - this.mapOffsetY, this.targetDistance = Math.round(Math.sqrt(Math.pow(this.playerX - this.targetX, 2) + Math.pow(this.playerY - this.targetY, 2)))
                },
                resetTargetPosition: function() {
                    this.targetX = this.playerX, this.targetY = this.playerY
                },
                setKeys: function() {
                    var a = this;
                    document.onkeydown = function(t) {
                        var e = t.keyCode;
                        a.pressedKeys[e] || (13 === e ? a.sendNick("") : 32 === e ? a.sendSplit() : 81 === e ? a.sendFreeSpectate() : 83 === e ? a.sendSpectate() : 87 === e ? a.sendEject() : void 0)
                    }, document.onkeyup = function(t) {
                        a.pressedKeys[t.keyCode] = !1
                    }
                },
                init: function() {
                    var a = this;
                    /firefox/i.test(navigator.userAgent) ? document.addEventListener("DOMMouseScroll", function(t) {
                        a.setZoom(t)
                    }, !1) : document.body.onmousewheel = function(t) {
                        a.setZoom(t)
                    }, setInterval(function() {
                        a.sendPosition()
                    }, 40), b.master && b.master.clientVersion && this.setClientVersion(b.master.clientVersion, b.master.clientVersionString)
                }
            };
        b.sendAction = function(e) {
            A.sendAction(e)
        };
        var R = {
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
                setCanvas: function() {
                    this.canvas = document.getElementById("canvas"), this.ctx = this.canvas.getContext("2d"), this.canvas.onmousemove = function(e) {
                        A.clientX = e.clientX, A.clientY = e.clientY, A.getCursorPosition()
                    }
                },
                resizeCanvas: function() {
                    this.canvasWidth = b.innerWidth, this.canvasHeight = b.innerHeight, this.canvas.width = this.canvasWidth, this.canvas.height = this.canvasHeight, A.canvasWidth = this.canvasWidth, A.canvasHeight = this.canvasHeight, this.renderFrame()
                },
                setView: function() {
                    this.setScale(), A.playerCells.length ? (A.calculatePlayerMassAndPosition(), this.camX += (A.viewX - this.camX) / B.cameraSpeed, this.camY += (A.viewY - this.camY) / B.cameraSpeed) : (this.camX = (29 * this.camX + A.viewX) / 30, this.camY = (29 * this.camY + A.viewY) / 30), A.playerX = this.camX, A.playerY = this.camY
                },
                setScale: function() {
                    return A.autoZoom ? void(this.scale = A.play ? (9 * this.scale + Math.pow(Math.min(64 / A.playerSize, 1), .4) * this.getZoom()) / 10 : (9 * this.scale + A.scale * this.getZoom()) / 10, A.viewScale = this.scale) : (this.scale = (9 * this.scale + this.getZoom()) / 10, void(A.viewScale = this.scale))
                },
                getZoom: function() {
                    return Math.max(this.canvasWidth / 1080, this.canvasHeight / 1920) * A.zoomValue
                },
                renderFrame: function() {
                    for (A.time = Date.now(), t = 0; t < A.cells.length; t++) A.cells[t].moveCell();
                    if (this.setView(), A.getCursorPosition(), A.sortCells(), A.compareCells(), this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight), B.showGrid && this.drawGrid(this.ctx, this.canvasWidth, this.canvasHeight, this.scale, this.camX, this.camY), this.ctx.save(), this.ctx.translate(this.canvasWidth / 2, this.canvasHeight / 2), this.ctx.scale(this.scale, this.scale), this.ctx.translate(-this.camX, -this.camY), B.showBgSectors && this.drawSectors(this.ctx, A.mapOffsetFixed, x.sectorsX, x.sectorsY, A.mapMinX, A.mapMinY, A.mapMaxX, A.mapMaxY, x.gridColor, x.sectorsColor, x.sectorsWidth, !0), ":battleroyale" === A.gameMode && this.drawBattleArea(this.ctx), B.showMapBorders) {
                        var a = x.bordersWidth / 2;
                        this.drawMapBorders(this.ctx, A.mapOffsetFixed, A.mapMinX - a, A.mapMinY - a, A.mapMaxX + a, A.mapMaxY + a, x.bordersColor, x.bordersWidth)
                    }
                    this.drawCommander(), B.virusesRange && this.drawVirusesRange(this.ctx, A.viruses), this.drawFood(), A.play && (B.splitRange && this.drawSplitRange(this.ctx, A.biggerSTECellsCache, A.playerCells, A.selectBiggestCell), B.oppRings && this.drawOppRings(this.ctx, this.scale, A.biggerSTECellsCache, A.biggerCellsCache, A.smallerCellsCache, A.STECellsCache), B.cursorTracking && this.drawCursorTracking(this.ctx, A.playerCells, A.cursorX, A.cursorY)), this.drawGhostCells();
                    for (var t = 0; t < A.removedCells.length; t++) A.removedCells[t].draw(this.ctx, !0);
                    for (t = 0; t < A.cells.length; t++) A.cells[t].draw(this.ctx);
                    this.ctx.restore(), ":teams" === A.gameMode && this.pieChart && this.pieChart.width && this.ctx.drawImage(this.pieChart, this.canvasWidth - this.pieChart.width - 10, 10)
                },
                drawGrid: function(d, t, e, i, s, o) {
                    var a = t / i,
                        n = e / i,
                        r = (a / 2 - s) % 50,
                        p = (n / 2 - o) % 50;
                    for (d.strokeStyle = x.gridColor, d.globalAlpha = 1 * i, d.beginPath(); r < a; r += 50) d.moveTo(r * i - .5, 0), d.lineTo(r * i - .5, n * i);
                    for (; p < n; p += 50) d.moveTo(0, p * i - .5), d.lineTo(a * i, p * i - .5);
                    d.stroke(), d.globalAlpha = 1
                },
                drawSectors: function(g, t, e, i, s, o, a, n, r, l, h, c) {
                    if (t || !c) {
                        var u = ~~((a - s) / e),
                            d = ~~((n - o) / i),
                            p = 0,
                            S = 0;
                        if (g.strokeStyle = r, g.fillStyle = l, g.lineWidth = h, c || !c && B.showMiniMapGrid) {
                            g.beginPath();
                            for (var b = 0; b < e + 1; b++) p = s + u * b, g.moveTo(b == e ? a : p, o), g.lineTo(b == e ? a : p, n);
                            for (b = 0; b < i + 1; b++) S = o + d * b, g.moveTo(s - h / 2, b == i ? n : S), g.lineTo(a + h / 2, b == i ? n : S);
                            g.stroke()
                        }
                        for (g.font = c ? x.sectorsFontWeight + " " + x.sectorsFontSize + "px " + x.sectorsFontFamily : x.miniMapFontWeight + " " + ~~(.4 * d) + "px " + x.miniMapFontFamily, g.textAlign = "center", g.textBaseline = "middle", b = 0; b < i; b++)
                            for (var w = 0, M; w < e; w++) M = String.fromCharCode(65 + b) + (w + 1), p = ~~(s + u / 2 + w * u), S = ~~(o + d / 2 + b * d), g.fillText(M, p, S)
                    }
                },
                drawMapBorders: function(l, t, e, i, s, o, a, n) {
                    t && (l.strokeStyle = a, l.lineWidth = n, l.beginPath(), l.moveTo(e, i), l.lineTo(s, i), l.lineTo(s, o), l.lineTo(e, o), B.borderGlow ? (l.shadowBlur = x.borderGlowSize, l.shadowColor = x.borderGlowColor) : "skrrt", l.closePath(), l.stroke()), B.borderGlow ? l.shadowBlur = 0 : "skrrt"
                },
                drawCommander: function() {
                    if (A.drawCommander) {
                        var e = this.ctx;
                        cimg = new Image, cimg.src = x.commanderImage, cimg1 = new Image, cimg1.src = x.commanderImage1, cimg2 = new Image, cimg2.src = x.commanderImage2, e.save(), e.globalAlpha = A.cAlpha, e.translate(w.spawnX, w.spawnY), e.rotate(A.cAngle), e.drawImage(cimg, -A.cRadius / 2, -A.cRadius / 2, A.cRadius, A.cRadius), e.restore(), e.save(), e.globalAlpha = A.cAlpha, e.translate(w.spawnX, w.spawnY), e.rotate(A.cAngle1), e.drawImage(cimg1, -A.cRadius / 2, -A.cRadius / 2, A.cRadius, A.cRadius), e.restore(), e.save(), e.globalAlpha = A.cAlpha, e.translate(w.spawnX, w.spawnY), e.rotate(A.cAngle2), e.drawImage(cimg2, -A.cRadius / 2, -A.cRadius / 2, A.cRadius, A.cRadius), e.restore(), e.globalAlpha = 1, this.updateCommander()
                    }
                },
                updateCommander: function() {
                    A.cRadius += 7, A.cAngle += .007, A.cAngle1 -= .006, A.cAngle2 += .003, 2025 <= A.cRadius && (A.cAlpha *= .95), 1e-4 >= A.cAlpha && this.resetCommander()
                },
                resetCommander: function() {
                    A.cRadius = 10, A.cAngle = 4, A.cAngle1 = 0, A.cAngle2 = 0, A.cAlpha = 1, A.drawCommander = !1, w.spawnX = 0, w.spawnY = 0
                },
                drawVirusesRange: function(n, t, r) {
                    if (t.length) {
                        n.beginPath();
                        for (var i = 0; i < t.length; i++) {
                            var l = t[i].x,
                                o = t[i].y;
                            n.moveTo(l, o), n.arc(l, o, t[i].size + 820, 0, this.pi2, !1)
                        }
                        n.fillStyle = x.virusColor, n.globalAlpha = .1, n.fill(), n.globalAlpha = 1, r && (t = [])
                    }
                },
                drawFood: function() {
                    if (A.showFood && !(B.autoHideFoodOnZoom && .2 > this.scale)) {
                        if (B.autoHideFood && !A.foodIsHidden && 1e3 < A.playerMass) return A.showFood = !1, void(A.foodIsHidden = !0);
                        if (B.rainbowFood)
                            for (var e = 0; e < A.food.length; e++) A.food[e].moveCell(), A.food[e].draw(this.ctx);
                        else this.drawCachedFood(this.ctx, A.food, this.scale)
                    }
                },
                drawCachedFood: function(l, t, d, i) {
                    if (t.length) {
                        if (B.optimizedFood && this.pellet)
                            for (var s = 0; s < t.length; s++) {
                                var p = t[s].x - 10 - x.foodSize,
                                    c = t[s].y - 10 - x.foodSize;
                                l.drawImage(this.pellet, p, c)
                            } else {
                                for (l.beginPath(), s = 0; s < t.length; s++)
                                    if (p = t[s].x, c = t[s].y, (l.moveTo(p, c), .16 > d)) {
                                        var m = t[s].size + x.foodSize;
                                        l.rect(p - m, c - m, 2 * m, 2 * m)
                                    } else l.arc(p, c, t[s].size + x.foodSize, 0, this.pi2, !1);
                                l.fillStyle = x.foodColor, l.globalAlpha = 1, l.fill()
                            }
                        i && (t = [])
                    }
                },
                drawSplitRange: function(n, t, r, i, s) {
                    if (this.drawCircles(n, t, 760, 4, .4, "#BE00FF"), r.length) {
                        var o = i ? r.length - 1 : 0;
                        n.lineWidth = 6, n.globalAlpha = x.darkTheme ? .7 : .35, n.strokeStyle = x.splitRangeColor, n.beginPath(), n.arc(r[o].x, r[o].y, r[o].size + 760, 0, this.pi2, !1), n.closePath(), n.stroke()
                    }
                    n.globalAlpha = 1, s && (t = [])
                },
                drawOppRings: function(d, t, e, p, c, m, h) {
                    var n = 14 + 2 / t,
                        r = 12 + 1 / t;
                    this.drawCircles(d, e, n, r, .75, "#BE00FF"), this.drawCircles(d, p, n, r, .75, "#FF0A00"), this.drawCircles(d, c, n, r, .75, "#00C8FF"), this.drawCircles(d, m, n, r, .75, "#64FF00"), h && (e = [], p = [], c = [], m = [])
                },
                drawCursorTracking: function(a, t, e, n) {
                    a.lineWidth = 4, a.globalAlpha = x.darkTheme ? .75 : .35, a.strokeStyle = x.cursorTrackingColor, a.beginPath();
                    for (var s = 0; s < t.length; s++) a.moveTo(t[s].x, t[s].y), a.lineTo(e, n);
                    a.stroke(), a.globalAlpha = 1
                },
                drawCircles: function(r, t, e, i, s, o) {
                    r.lineWidth = i, r.globalAlpha = s, r.strokeStyle = o;
                    for (var a = 0; a < t.length; a++) r.beginPath(), r.arc(t[a].x, t[a].y, t[a].size + e, 0, this.pi2, !1), r.closePath(), r.stroke();
                    r.globalAlpha = 1
                },
                drawDashedCircle: function(d, t, e, i, s, o, a) {
                    var n = this.pi2 / s;
                    d.lineWidth = o, d.strokeStyle = a;
                    for (var r = 0; r < s; r += 2) d.beginPath(), d.arc(t, e, i - o / 2, r * n, (r + 1) * n, !1), d.stroke()
                },
                drawTeammatesInd: function(a, t, e, o) {
                    this.indicator && a.drawImage(this.indicator, t - 45, e - o - 62)
                },
                drawPieChart: function() {
                    this.pieChart || (this.pieChart = document.createElement("canvas"));
                    var n = this.pieChart.getContext("2d"),
                        t = Math.min(200, .3 * this.canvasWidth) / 200;
                    this.pieChart.width = 200 * t, this.pieChart.height = 240 * t, n.scale(t, t);
                    for (var e = ["#333333", "#FF3333", "#33FF33", "#3333FF"], r = 0, i = 0, l; i < A.pieChart.length; i++) l = r + A.pieChart[i] * this.pi2, n.fillStyle = e[i + 1], n.beginPath(), n.moveTo(100, 140), n.arc(100, 140, 80, r, l, !1), n.fill(), r = l
                },
                drawBattleArea: function(e) {
                    A.battleRoyale.state && (this.drawDangerArea(e, A.battleRoyale.x, A.battleRoyale.y, A.battleRoyale.radius, A.mapMinX, A.mapMinY, A.mapMaxX - A.mapMinX, A.mapMaxY - A.mapMinY, x.dangerAreaColor, .25), this.drawSafeArea(e, A.battleRoyale.targetX, A.battleRoyale.targetY, A.battleRoyale.targetRadius, 40, x.safeAreaColor))
                },
                drawBattleAreaOnMinimap: function(d, t, e, i, s, o) {
                    if (A.battleRoyale.state) {
                        this.battleAreaMap || (this.battleAreaMap = document.createElement("canvas"), this.battleAreaMapCtx = this.battleAreaMap.getContext("2d")), this.battleAreaMap.width == t ? this.battleAreaMapCtx.clearRect(0, 0, t, e) : (this.battleAreaMap.width = t, this.battleAreaMap.height = e);
                        var a = (A.battleRoyale.x + s) * i,
                            p = (A.battleRoyale.y + o) * i,
                            c = A.battleRoyale.radius * i;
                        this.drawDangerArea(this.battleAreaMapCtx, a, p, c, 0, 0, t, e, x.dangerAreaColor, .25), a = ~~((A.battleRoyale.targetX + s) * i), p = ~~((A.battleRoyale.targetY + o) * i), c = ~~(A.battleRoyale.targetRadius * i), this.drawSafeArea(this.battleAreaMapCtx, a, p, c, 2, x.safeAreaColor), d.drawImage(this.battleAreaMap, 0, 0)
                    }
                },
                drawDangerArea: function(d, t, e, i, s, o, a, n, r, l) {
                    A.battleRoyale.radius == A.battleRoyale.maxRadius || 0 >= i || (d.save(), d.globalAlpha = l, d.fillStyle = r, d.fillRect(s, o, a, n), d.globalCompositeOperation = "destination-out", d.globalAlpha = 1, d.beginPath(), d.arc(t, e, i, 0, this.pi2, !1), d.fill(), d.restore())
                },
                drawSafeArea: function(n, t, e, r, s, o) {
                    2 < A.battleRoyale.state || 0 >= r || this.drawDashedCircle(n, t, e, r, 60, s, o)
                },
                drawGhostCells: function() {
                    if (B.showGhostCells) {
                        var a = A.ghostCells;
                        this.ctx.beginPath();
                        for (var t = 0; t < a.length; t++)
                            if (!a[t].inView) {
                                var o = a[t].x,
                                    n = a[t].y;
                                this.ctx.moveTo(o, n), this.ctx.arc(o, n, a[t].size, 0, this.pi2, !1)
                            } this.ctx.fillStyle = x.ghostCellsColor, this.ctx.globalAlpha = x.ghostCellsAlpha, this.ctx.fill(), this.ctx.globalAlpha = 1
                    }
                },
                preDrawPellet: function() {
                    this.pellet = null;
                    var a = 10 + x.foodSize,
                        t = document.createElement("canvas");
                    t.width = 2 * a, t.height = 2 * a;
                    var o = t.getContext("2d");
                    o.arc(a, a, a, 0, this.pi2, !1), o.fillStyle = x.foodColor, o.fill(), this.pellet = new Image, this.pellet.src = t.toDataURL(), t = null
                },
                preDrawIndicator: function() {
                    this.indicator = null;
                    var a = document.createElement("canvas");
                    a.width = 90, a.height = 50;
                    var o = a.getContext("2d");
                    o.lineWidth = 15, o.fillStyle = x.teammatesIndColor, o.strokeStyle = x.teammatesIndColor, o.beginPath(), o.lineCap = "round", o.moveTo(77, 11), o.lineTo(46, 39), o.moveTo(13, 11), o.lineTo(44, 39), o.stroke(), o.fill(), o.closePath(), this.indicator = new Image, this.indicator.src = a.toDataURL(), a = null
                },
                countFps: function() {
                    if (B.showStatsFPS) {
                        var e = Date.now();
                        this.fpsLastRequest || (this.fpsLastRequest = e), 1e3 <= e - this.fpsLastRequest && (this.fps = this.renderedFrames, this.renderedFrames = 0, this.fpsLastRequest = e), this.renderedFrames++
                    }
                },
                render: function() {
                    R.countFps(), R.renderFrame(), b.requestAnimationFrame(R.render)
                },
                init: function() {
                    this.setCanvas(), this.resizeCanvas(), this.preDrawPellet(), this.preDrawIndicator(), b.requestAnimationFrame(R.render)
                }
            },
            L = {},
            C = {},
            _ = {
                "hk-feed": {
                    label: y["hk-feed"],
                    defaultKey: "W",
                    keyDown: function() {
                        U && U.feed()
                    },
                    keyUp: null,
                    type: "normal"
                },
                "hk-macroFeed": {
                    label: y["hk-macroFeed"],
                    defaultKey: "E",
                    keyDown: function() {
                        U && U.macroFeed(!0)
                    },
                    keyUp: function() {
                        U && U.macroFeed(!1)
                    },
                    type: "normal"
                },
                "hk-split": {
                    label: y["hk-split"],
                    defaultKey: "SPACE",
                    keyDown: function() {
                        U && U.split()
                    },
                    keyUp: null,
                    type: "normal"
                },
                "hk-doubleSplit": {
                    label: y["hk-doubleSplit"],
                    defaultKey: "Q",
                    keyDown: function() {
                        U && U.doubleSplit()
                    },
                    keyUp: null,
                    type: "normal"
                },
                "hk-popSplit": {
                    label: "Popsplit",
                    defaultKey: "ALT+Q",
                    keyDown: function() {
                        U && U.popSplit()
                    },
                    keyUp: null,
                    type: "normal"
                },
                "hk-split16": {
                    label: y["hk-split16"],
                    defaultKey: "SHIFT",
                    keyDown: function() {
                        U && U.split16()
                    },
                    keyUp: null,
                    type: "normal"
                },
                "hk-pause": {
                    label: y["hk-pause"],
                    defaultKey: "R",
                    keyDown: function() {
                        U && U.setPause()
                    },
                    keyUp: null,
                    type: "normal"
                },
                "hk-showTop5": {
                    label: y["hk-showTop5"],
                    defaultKey: "T",
                    keyDown: function() {
                        U && U.setShowTop5()
                    },
                    keyUp: null,
                    type: "normal"
                },
                "hk-showTime": {
                    label: y["hk-showTime"],
                    defaultKey: "ALT+T",
                    keyDown: function() {
                        U && U.setShowTime()
                    },
                    keyUp: null,
                    type: "normal"
                },
                "hk-showSplitRange": {
                    label: y["hk-showSplitRange"],
                    defaultKey: "U",
                    keyDown: function() {
                        U && U.setShowSplitRange()
                    },
                    keyUp: null,
                    type: "normal"
                },
                "hk-showSplitInd": {
                    label: y["hk-showSplitInd"],
                    defaultKey: "I",
                    keyDown: function() {
                        U && U.setShowSplitInd()
                    },
                    keyUp: null,
                    type: "normal"
                },
                "hk-showTeammatesInd": {
                    label: y["hk-showTeammatesInd"],
                    defaultKey: "ALT+I",
                    keyDown: function() {
                        U && U.setShowTeammatesInd()
                    },
                    keyUp: null,
                    type: "normal"
                },
                "hk-showOppColors": {
                    label: y["hk-showOppColors"],
                    defaultKey: "O",
                    keyDown: function() {
                        U && U.setShowOppColors()
                    },
                    keyUp: null,
                    type: "normal"
                },
                "hk-toggleSkins": {
                    label: y["hk-toggleSkins"],
                    defaultKey: "A",
                    keyDown: function() {
                        U && U.toggleSkins()
                    },
                    keyUp: null,
                    type: "normal"
                },
                "hk-transparentSkins": {
                    label: y["hk-transparentSkins"],
                    defaultKey: "",
                    keyDown: function() {
                        U && U.setTransparentSkins()
                    },
                    keyUp: null,
                    type: "normal"
                },
                "hk-showSkins": {
                    label: y["hk-showSkins"],
                    defaultKey: "S",
                    keyDown: function() {
                        U && U.setShowSkins()
                    },
                    keyUp: null,
                    type: "normal"
                },
                "hk-showStats": {
                    label: y["hk-showStats"],
                    defaultKey: "ALT+S",
                    keyDown: function() {
                        U && U.setShowStats()
                    },
                    keyUp: null,
                    type: "normal"
                },
                "hk-toggleCells": {
                    label: y["hk-toggleCells"],
                    defaultKey: "D",
                    keyDown: function() {
                        U && U.toggleCells()
                    },
                    keyUp: null,
                    type: "normal"
                },
                "hk-showFood": {
                    label: y["hk-showFood"],
                    defaultKey: "F",
                    keyDown: function() {
                        U && U.setShowFood()
                    },
                    keyUp: null,
                    type: "normal"
                },
                "hk-showGrid": {
                    label: y["hk-showGrid"],
                    defaultKey: "G",
                    keyDown: function() {
                        U && U.setShowGrid()
                    },
                    keyUp: null,
                    type: "normal"
                },
                "hk-showMiniMapGuides": {
                    label: y["hk-showMiniMapGuides"],
                    defaultKey: "ALT+G",
                    keyDown: function() {
                        U && U.setShowMiniMapGuides()
                    },
                    keyUp: null,
                    type: "normal"
                },
                "hk-hideChat": {
                    label: y["hk-hideChat"],
                    defaultKey: "H",
                    keyDown: function() {
                        U && U.hideChat()
                    },
                    keyUp: null,
                    type: "normal"
                },
                "hk-showHUD": {
                    label: y["hk-showHUD"],
                    defaultKey: "ALT+H",
                    keyDown: function() {
                        U && U.setShowHUD()
                    },
                    keyUp: null,
                    type: "normal"
                },
                "hk-copyLb": {
                    label: y["hk-copyLb"],
                    defaultKey: "L",
                    keyDown: function() {
                        U && U.copyLb()
                    },
                    keyUp: null,
                    type: "normal"
                },
                "hk-showLb": {
                    label: y["hk-showLb"],
                    defaultKey: "ALT+L",
                    keyDown: function() {
                        U && U.setShowLb()
                    },
                    keyUp: null,
                    type: "normal"
                },
                "hk-toggleAutoZoom": {
                    label: y["hk-toggleAutoZoom"],
                    defaultKey: "",
                    keyDown: function() {
                        U && U.toggleAutoZoom()
                    },
                    keyUp: null,
                    type: "normal"
                },
                "hk-resetZoom": {
                    label: y["hk-resetZoom"],
                    defaultKey: "Z",
                    keyDown: function() {
                        U && U.resetZoom(!0)
                    },
                    keyUp: function() {
                        U && U.resetZoom(!1)
                    },
                    type: "normal"
                },
                "hk-toggleDeath": {
                    label: y["hk-toggleDeath"],
                    defaultKey: "X",
                    keyDown: function() {
                        U && U.toggleDeath()
                    },
                    keyUp: null,
                    type: "normal"
                },
                "hk-clearChat": {
                    label: y["hk-clearChat"],
                    defaultKey: "C",
                    keyDown: function() {
                        U && U.displayChatHistory(!0)
                    },
                    keyUp: function() {
                        U && U.displayChatHistory(!1)
                    },
                    type: "normal"
                },
                "hk-showBgSectors": {
                    label: y["hk-showBgSectors"],
                    defaultKey: "B",
                    keyDown: function() {
                        U && U.setShowBgSectors()
                    },
                    keyUp: null,
                    type: "normal"
                },
                "hk-hideBots": {
                    label: y["hk-hideBots"],
                    defaultKey: "ALT+B",
                    keyDown: function() {
                        U && U.setHideSmallBots()
                    },
                    keyUp: null,
                    type: "normal"
                },
                "hk-showNames": {
                    label: y["hk-showNames"],
                    defaultKey: "N",
                    keyDown: function() {
                        U && U.setShowNames()
                    },
                    keyUp: null,
                    type: "normal"
                },
                "hk-hideTeammatesNames": {
                    label: y["hk-hideTeammatesNames"],
                    defaultKey: "",
                    keyDown: function() {
                        U && U.setHideTeammatesNames()
                    },
                    keyUp: null,
                    type: "normal"
                },
                "hk-showMass": {
                    label: y["hk-showMass"],
                    defaultKey: "M",
                    keyDown: function() {
                        U && U.setShowMass()
                    },
                    keyUp: null,
                    type: "normal"
                },
                "hk-showMiniMap": {
                    label: y["hk-showMiniMap"],
                    defaultKey: "ALT+M",
                    keyDown: function() {
                        U && U.setShowMiniMap()
                    },
                    keyUp: null,
                    type: "normal"
                },
                "hk-chatMessage": {
                    label: y["hk-chatMessage"],
                    defaultKey: "ENTER",
                    keyDown: function() {
                        U && U.enterChatMessage()
                    },
                    keyUp: null,
                    type: "special"
                },
                "hk-quickResp": {
                    label: y["hk-quickResp"],
                    defaultKey: "TILDE",
                    keyDown: function() {
                        U && U.quickResp()
                    },
                    keyUp: null,
                    type: "normal"
                },
                "hk-autoResp": {
                    label: y["hk-autoResp"],
                    defaultKey: "",
                    keyDown: function() {
                        U && U.toggleAutoResp()
                    },
                    keyUp: null,
                    type: "normal"
                },
                "hk-zoom1": {
                    label: y["hk-zoomLevel"] + " 1",
                    defaultKey: "ALT+1",
                    keyDown: function() {
                        U && U.setZoom(.5)
                    },
                    keyUp: null,
                    type: "normal"
                },
                "hk-zoom2": {
                    label: y["hk-zoomLevel"] + " 2",
                    defaultKey: "ALT+2",
                    keyDown: function() {
                        U && U.setZoom(.25)
                    },
                    keyUp: null,
                    type: "normal"
                },
                "hk-zoom3": {
                    label: y["hk-zoomLevel"] + " 3",
                    defaultKey: "ALT+3",
                    keyDown: function() {
                        U && U.setZoom(.125)
                    },
                    keyUp: null,
                    type: "normal"
                },
                "hk-zoom4": {
                    label: y["hk-zoomLevel"] + " 4",
                    defaultKey: "ALT+4",
                    keyDown: function() {
                        U && U.setZoom(.075)
                    },
                    keyUp: null,
                    type: "normal"
                },
                "hk-zoom5": {
                    label: y["hk-zoomLevel"] + " 5",
                    defaultKey: "ALT+5",
                    keyDown: function() {
                        U && U.setZoom(.05)
                    },
                    keyUp: null,
                    type: "normal"
                },
                "hk-switchServerMode": {
                    label: y["hk-switchServerMode"],
                    defaultKey: "=",
                    keyDown: function() {
                        U && U.switchServerMode()
                    },
                    keyUp: null,
                    type: "normal"
                },
                "hk-showTargeting": {
                    label: y["hk-showTargeting"],
                    defaultKey: "",
                    keyDown: function() {
                        U && U.setShowTargeting()
                    },
                    keyUp: null,
                    type: "normal"
                },
                "hk-setTargeting": {
                    label: y["hk-setTargeting"],
                    defaultKey: "",
                    keyDown: function() {
                        U && U.setTargeting()
                    },
                    keyUp: null,
                    type: "normal"
                },
                "hk-cancelTargeting": {
                    label: y["hk-cancelTargeting"],
                    defaultKey: "",
                    keyDown: function() {
                        U && U.cancelTargeting()
                    },
                    keyUp: null,
                    type: "normal"
                },
                "hk-changeTarget": {
                    label: y["hk-changeTarget"],
                    defaultKey: "",
                    keyDown: function() {
                        U && U.changeTarget()
                    },
                    keyUp: null,
                    type: "normal"
                },
                "hk-privateMiniMap": {
                    label: y["hk-privateMiniMap"],
                    defaultKey: "",
                    keyDown: function() {
                        U && U.setPrivateMiniMap()
                    },
                    keyUp: null,
                    type: "normal"
                },
                "hk-showQuest": {
                    label: y["hk-showQuest"],
                    defaultKey: "",
                    keyDown: function() {
                        U && U.setShowQuest()
                    },
                    keyUp: null,
                    type: "normal"
                },
                "hk-comm1": {
                    label: l.comm1,
                    defaultKey: "1",
                    keyDown: function() {
                        U && U.sendCommand(1)
                    },
                    keyUp: null,
                    type: "command"
                },
                "hk-comm2": {
                    label: l.comm2,
                    defaultKey: "2",
                    keyDown: function() {
                        U && U.sendCommand(2)
                    },
                    keyUp: null,
                    type: "command"
                },
                "hk-comm3": {
                    label: l.comm3,
                    defaultKey: "3",
                    keyDown: function() {
                        U && U.sendCommand(3)
                    },
                    keyUp: null,
                    type: "command"
                },
                "hk-comm4": {
                    label: l.comm4,
                    defaultKey: "4",
                    keyDown: function() {
                        U && U.sendCommand(4)
                    },
                    keyUp: null,
                    type: "command"
                },
                "hk-comm5": {
                    label: l.comm5,
                    defaultKey: "5",
                    keyDown: function() {
                        U && U.sendCommand(5)
                    },
                    keyUp: null,
                    type: "command"
                },
                "hk-comm6": {
                    label: l.comm6,
                    defaultKey: "6",
                    keyDown: function() {
                        U && U.sendCommand(6)
                    },
                    keyUp: null,
                    type: "command"
                },
                "hk-comm7": {
                    label: l.comm7,
                    defaultKey: "7",
                    keyDown: function() {
                        U && U.sendCommand(7)
                    },
                    keyUp: null,
                    type: "command"
                },
                "hk-comm8": {
                    label: l.comm8,
                    defaultKey: "8",
                    keyDown: function() {
                        U && U.sendCommand(8)
                    },
                    keyUp: null,
                    type: "command"
                },
                "hk-comm9": {
                    label: l.comm9,
                    defaultKey: "9",
                    keyDown: function() {
                        U && U.sendCommand(9)
                    },
                    keyUp: null,
                    type: "command"
                },
                "hk-comm0": {
                    label: l.comm0,
                    defaultKey: "0",
                    keyDown: function() {
                        U && U.sendCommand(0)
                    },
                    keyUp: null,
                    type: "command"
                },
                "hk-comm10": {
                    label: l.comm10,
                    defaultKey: "MOUSE WHEEL",
                    keyDown: function() {
                        U && U.sendCommand(10)
                    },
                    keyUp: null,
                    type: "command"
                },
                "hk-comm11": {
                    label: l.comm11,
                    defaultKey: "LEFT",
                    keyDown: function() {
                        U && U.sendCommand(11)
                    },
                    keyUp: null,
                    type: "command"
                },
                "hk-comm12": {
                    label: l.comm12,
                    defaultKey: "UP",
                    keyDown: function() {
                        U && U.sendCommand(12)
                    },
                    keyUp: null,
                    type: "command"
                },
                "hk-comm13": {
                    label: l.comm13,
                    defaultKey: "RIGHT",
                    keyDown: function() {
                        U && U.sendCommand(13)
                    },
                    keyUp: null,
                    type: "command"
                },
                "hk-comm14": {
                    label: l.comm14,
                    defaultKey: "DOWN",
                    keyDown: function() {
                        U && U.sendCommand(14)
                    },
                    keyUp: null,
                    type: "command"
                }
            },
            O = {
                lastPressedKey: "",
                lastKeyId: "",
                defaultMessageKey: "ENTER",
                inputClassName: "custom-key-in form-control input-sm",
                loadDefaultHotkeys: function() {
                    for (var e in C = {}, _) _.hasOwnProperty(e) && (C[_[e].defaultKey] = e);
                    C["spec-messageKey"] = this.defaultMessageKey
                },
                loadHotkeys: function() {
                    null === b.localStorage.getItem("ogarioHotkeys") ? this.loadDefaultHotkeys() : C = JSON.parse(b.localStorage.getItem("ogarioHotkeys")), null !== b.localStorage.getItem("ogarioCommands") && (l = JSON.parse(b.localStorage.getItem("ogarioCommands")))
                },
                saveHotkeys: function() {
                    b.localStorage.setItem("ogarioHotkeys", JSON.stringify(C)), this.saveCommands()
                },
                saveCommands: function() {
                    d("#hotkeys .command-in").each(function() {
                        var a = d(this),
                            t = a.attr("id");
                        l.hasOwnProperty(t) && (l[t] = a.val())
                    }), b.localStorage.setItem("ogarioCommands", JSON.stringify(l))
                },
                resetHotkeys: function() {
                    this.loadDefaultHotkeys(), d("#hotkeys-cfg .custom-key-in").each(function() {
                        var e = d(this).attr("id");
                        _[e] && d(this).val(_[e].defaultKey)
                    })
                },
                setHotkeysMenu: function() {
                    var s = this;
                    for (var r in d("body").append("<div id=\"hotkeys\"><div id=\"hotkeys-menu\"><button id=\"reset-hotkeys\" class=\"btn btn-primary\">" + y.restoreSettings + "</button> <button id=\"save-hotkeys\" class=\"btn btn-success\">" + y.saveSett + "</button> <button id=\"close-hotkeys\" class=\"btn btn-danger\">" + y.close + "</button></div><div id=\"hotkeys-cfg\"></div><div id=\"hotkeys-inst\"><ul><li>" + y["hk-inst-assign"] + "</li><li>" + y["hk-inst-delete"] + "</li><li>" + y["hk-inst-keys"] + "</li></ul></div></div>"), _)
                        if (_.hasOwnProperty(r)) {
                            var e = _[r],
                                i = "";
                            for (var p in C)
                                if (C.hasOwnProperty(p) && C[p] === r) {
                                    i = p;
                                    break
                                } if ("hk-switchServerMode" == r && U && !U.privateIP) continue;
                            if ("command" === e.type) {
                                var a = r.replace("hk-", "");
                                d("#hotkeys-cfg").append("<div class=\"row\"><div class=\"key-label\"><input id=\"" + a + "\" class=\"command-in form-control input-sm\" value=\"" + l[a] + "\" maxlength=\"80\" /></div><div class=\"default-key\">" + e.defaultKey + "</div><div class=\"custom-key\"><input id=\"" + r + "\" class=\"custom-key-in form-control input-sm\" value=\"" + i + "\" /></div></div>")
                            } else d("#hotkeys-cfg").append("<div class=\"row\"><div class=\"key-label\">" + e.label + "</div><div class=\"default-key\">" + e.defaultKey + "</div><div class=\"custom-key\"><input id=\"" + r + "\" class=\"custom-key-in form-control input-sm\" value=\"" + i + "\" /></div></div>")
                        } d(document).on("click", "#reset-hotkeys", function(t) {
                        t.preventDefault(), s.resetHotkeys()
                    }), d(document).on("click", "#save-hotkeys", function(t) {
                        t.preventDefault(), s.saveHotkeys(), d("#hotkeys").fadeOut(500)
                    }), d(document).on("click", "#close-hotkeys", function(e) {
                        e.preventDefault(), d("#hotkeys").fadeOut(500)
                    }), d(document).on("click", ".hotkeys-link", function() {
                        d("#hotkeys").fadeIn(500), d("#hotkeys-cfg").perfectScrollbar("update"), t()
                    }), d("#hotkeys-cfg").perfectScrollbar()
                },
                getPressedKey: function(a) {
                    var t = "",
                        o = "";
                    switch (a.ctrlKey || 17 == a.keyCode ? t = "CTRL" : (a.altKey || 18 == a.keyCode) && (t = "ALT"), a.keyCode) {
                        case 9:
                            o = "TAB";
                            break;
                        case 13:
                            o = "ENTER";
                            break;
                        case 16:
                            o = "SHIFT";
                            break;
                        case 17:
                        case 18:
                            break;
                        case 27:
                            o = "ESC";
                            break;
                        case 32:
                            o = "SPACE";
                            break;
                        case 37:
                            o = "LEFT";
                            break;
                        case 38:
                            o = "UP";
                            break;
                        case 39:
                            o = "RIGHT";
                            break;
                        case 40:
                            o = "DOWN";
                            break;
                        case 46:
                            o = "DEL";
                            break;
                        case 61:
                        case 187:
                            o = "=";
                            break;
                        case 192:
                            o = "TILDE";
                            break;
                        default:
                            o = String.fromCharCode(a.keyCode);
                    }
                    return "" == t ? o : "" === o ? t : t + "+" + o
                },
                deleteHotkey: function(a, t) {
                    delete C[a], d("#" + t).val("")
                },
                setDefaultHotkey: function(a) {
                    var t = !1;
                    return _[a] && !C.hasOwnProperty(_[a].defaultKey) ? (t = _[a].defaultKey, C[t] = a, t) : t
                },
                setHotkey: function(s, t) {
                    if (t && (this.lastPressedKey !== s || this.lastKeyId !== t)) {
                        var e = d("#" + t).val();
                        if (this.deleteHotkey(e, t), "DEL" !== s) {
                            if (C[s] && C[s] !== t) {
                                var n = C[s],
                                    o = this.setDefaultHotkey(n);
                                o ? (C[o] = n, d("#" + n).val(o)) : this.deleteHotkey(s, n)
                            }
                            C[s] = t, d("#" + t).val(s), "hk-chatMessage" === t && (C["spec-messageKey"] = s), this.lastPressedKey = s, this.lastKeyId = t
                        }
                    }
                },
                init: function() {
                    this.loadHotkeys(), this.setHotkeysMenu()
                }
            };
        document.onkeydown = function(a) {
                var t = O.getPressedKey(a);
                if (("INPUT" !== a.target.tagName || a.target.className === O.inputClassName || t === C["spec-messageKey"]) && "" !== t && !L[t]) {
                    if (L[t] = !0, "ESC" === t) return a.preventDefault(), void(U && U.showMenu());
                    if (a.target.className === O.inputClassName) return a.preventDefault(), void O.setHotkey(t, a.target.id);
                    if (C[t]) {
                        a.preventDefault();
                        var e = C[t];
                        "" !== e && _[e] && _[e].keyDown && _[e].keyDown()
                    }
                }
            }, document.onkeyup = function(a) {
                var t = O.getPressedKey(a);
                if ("" !== t) {
                    if (C[t]) {
                        var e = C[t];
                        "" !== e && _[e] && _[e].keyUp && _[e].keyUp()
                    }
                    L[t] = !1
                }
            }, b.onmousedown = function(e) {
                d("#overlays").is(":visible") || (2 == e.which ? (e.preventDefault(), U && U.sendCommand(10)) : (B.mouseSplit && (1 == e.which && !B.mouseInvert || 3 == e.which && B.mouseInvert) && (e.preventDefault(), U && U.split()), B.mouseFeed && (3 == e.which && !B.mouseInvert || 1 == e.which && B.mouseInvert) && (e.preventDefault(), U && U.macroFeed(!0))))
            }, b.onmouseup = function(e) {
                B.mouseFeed && (3 == e.which && !B.mouseInvert || 1 == e.which && B.mouseInvert) && U && U.macroFeed(!1)
            }, b.onbeforeunload = function() {
                return w.play ? y.exit : void 0
            }, w = A, c = e("buffer").Buffer, m = e("lz4"), "/ogario" === b.location.pathname && r("/" + b.location.hash), b.onresize = function() {
                R.resizeCanvas(), p()
            },
            function() {
                b.onkeydown = function(e) {
                    81 == e.keyCode && b.core.specialOn && b.core.specialOn()
                }, b.onkeyup = function() {}
            }(), b.core = {
                connect: function(e) {
                    A.connect(e)
                },
                disconnect: function() {},
                sendNick: function(e) {
                    A.sendNick(e)
                },
                sendSpectate: function() {
                    A.sendSpectate()
                },
                eject: function() {
                    A.sendEject()
                },
                split: function() {
                    A.sendSplit()
                },
                specialOn: function() {
                    A.sendFreeSpectate()
                },
                specialOff: function() {
                    A.sendFreeSpectate()
                },
                sendFbToken: function(e) {
                    A.sendFbToken(e)
                },
                sendGplusToken: function(e) {
                    A.sendGplusToken(e)
                },
                recaptchaResponse: function(e) {
                    A.sendRecaptcha(e)
                },
                setClientVersion: function(a, t) {
                    A.setClientVersion(a, t)
                },
                proxyMobileData: function(e = []) {
                    Array.isArray(e) ? (8 == e[0] && e.unshift(102), e = new Uint8Array(e), A.sendMessage(new DataView(e.buffer))) : console.log("ProxyMobileData ERROR: Array data required.")
                }
            }, b.master.getClientVersion(), P.init(), U.init(), U.getDefaultSettings(), U.connect(), O.init(), A.init(), R.init(), b.master.init(), p()
    }(window, window.ogario, window.jQuery)
};
! function d(p, e, t) {
    function s(a, n) {
        if (!e[a]) {
            if (!p[a]) {
                var r = "function" == typeof require && require;
                if (!n && r) return r(a, !0);
                if (o) return o(a, !0);
                var i = new Error("Cannot find module '" + a);
                throw i.code = "MODULE_NOT_FOUND", i
            }
            var l = e[a] = {
                exports: {}
            };
            p[a][0].call(l.exports, function(e) {
                var t = p[a][1][e];
                return s(t || e)
            }, l, l.exports, d, p, e, t)
        }
        return e[a].exports
    }
    for (var o = "function" == typeof require && require, a = 0; a < t.length; a++) s(t[a]);
    return s
}({
    1: [function(d, t, e) {
        "use strict";

        function p(a) {
            var t = a.length;
            if (0 < t % 4) throw new Error("Invalid string. Length must be a multiple of 4");
            return "=" === a[t - 2] ? 2 : "=" === a[t - 1] ? 1 : 0
        }

        function m(s, t, e) {
            for (var i = [], n = t, l, d; n < e; n += 3) l = (s[n] << 16) + (s[n + 1] << 8) + s[n + 2], i.push(c[63 & (d = l) >> 18] + c[63 & d >> 12] + c[63 & d >> 6] + c[63 & d]);
            return i.join("")
        }
        e.byteLength = function(e) {
            return 3 * e.length / 4 - p(e)
        }, e.toByteArray = function(a) {
            var t = a.length,
                l, d, m, u, g;
            u = p(a), g = new o(3 * t / 4 - u), d = 0 < u ? t - 4 : t;
            var f = 0;
            for (l = 0; l < d; l += 4) m = h[a.charCodeAt(l)] << 18 | h[a.charCodeAt(l + 1)] << 12 | h[a.charCodeAt(l + 2)] << 6 | h[a.charCodeAt(l + 3)], g[f++] = 255 & m >> 16, g[f++] = 255 & m >> 8, g[f++] = 255 & m;
            return 2 === u ? (m = h[a.charCodeAt(l)] << 2 | h[a.charCodeAt(l + 1)] >> 4, g[f++] = 255 & m) : 1 === u && (m = h[a.charCodeAt(l)] << 10 | h[a.charCodeAt(l + 1)] << 4 | h[a.charCodeAt(l + 2)] >> 2, g[f++] = 255 & m >> 8, g[f++] = 255 & m), g
        }, e.fromByteArray = function(s) {
            for (var t = s.length, i = t % 3, o = "", d = [], n = 0, p = t - i, l; n < p; n += 16383) d.push(m(s, n, n + 16383 > p ? p : n + 16383));
            return 1 == i ? (l = s[t - 1], o += c[l >> 2], o += c[63 & l << 4], o += "==") : 2 == i && (l = (s[t - 2] << 8) + s[t - 1], o += c[l >> 10], o += c[63 & l >> 4], o += c[63 & l << 2], o += "="), d.push(o), d.join("")
        };
        for (var c = [], h = [], o = "undefined" == typeof Uint8Array ? Array : Uint8Array, a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", s = 0, n = a.length; s < n; ++s) c[s] = a[s], h[a.charCodeAt(s)] = s;
        h[45] = 62, h[95] = 63
    }, {}],
    2: [function() {}, {}],
    3: [function(a, t, L) {
        "use strict";

        function F(a) {
            if (a > 2147483647) throw new RangeError("Invalid typed array length");
            var t = new Uint8Array(a);
            return t.__proto__ = G.prototype, t
        }

        function G(a, t, e) {
            if ("number" == typeof a) {
                if ("string" == typeof t) throw new Error("If encoding is specified then the first argument must be a string");
                return i(a)
            }
            return n(a, t, e)
        }

        function n(a, t, o) {
            if ("number" == typeof a) throw new TypeError("\"value\" argument must not be a number");
            return a instanceof ArrayBuffer ? function(a, t, e) {
                if (0 > t || a.byteLength < t) throw new RangeError("'offset' is out of bounds");
                if (a.byteLength < t + (e || 0)) throw new RangeError("'length' is out of bounds");
                var o;
                return o = void 0 === t && void 0 === e ? new Uint8Array(a) : void 0 === e ? new Uint8Array(a, t) : new Uint8Array(a, t, e), o.__proto__ = G.prototype, o
            }(a, t, o) : "string" == typeof a ? function(a, t) {
                if ("string" == typeof t && "" !== t || (t = "utf8"), !G.isEncoding(t)) throw new TypeError("\"encoding\" must be a valid string encoding");
                var n = 0 | d(a, t),
                    r = F(n),
                    i = r.write(a, t);
                return i !== n && (r = r.slice(0, i)), r
            }(a, t) : function(a) {
                if (G.isBuffer(a)) {
                    var t = 0 | l(a.length),
                        o = F(t);
                    return 0 === o.length ? o : (a.copy(o, 0, 0, t), o)
                }
                if (a) {
                    if (U(a) || "length" in a) return "number" != typeof a.length || A(a.length) ? F(0) : e(a);
                    if ("Buffer" === a.type && Array.isArray(a.data)) return e(a.data)
                }
                throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")
            }(a)
        }

        function r(e) {
            if ("number" != typeof e) throw new TypeError("\"size\" argument must be a number");
            if (0 > e) throw new RangeError("\"size\" argument must not be negative")
        }

        function i(e) {
            return r(e), F(0 > e ? 0 : 0 | l(e))
        }

        function e(a) {
            for (var t = 0 > a.length ? 0 : 0 | l(a.length), e = F(t), o = 0; o < t; o += 1) e[o] = 255 & a[o];
            return e
        }

        function l(e) {
            if (e >= 2147483647) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + 2147483647.toString(16) + " bytes");
            return 0 | e
        }

        function d(a, o) {
            if (G.isBuffer(a)) return a.length;
            if (U(a) || a instanceof ArrayBuffer) return a.byteLength;
            "string" != typeof a && (a = "" + a);
            var n = a.length;
            if (0 === n) return 0;
            for (var r = !1;;) switch (o) {
                case "ascii":
                case "latin1":
                case "binary":
                    return n;
                case "utf8":
                case "utf-8":
                case void 0:
                    return P(a).length;
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                    return 2 * n;
                case "hex":
                    return n >>> 1;
                case "base64":
                    return I(a).length;
                default:
                    if (r) return P(a).length;
                    o = ("" + o).toLowerCase(), r = !0;
            }
        }

        function p(a, t, e) {
            var o = a[t];
            a[t] = a[e], a[e] = o
        }

        function c(a, t, n, r, l) {
            if (0 === a.length) return -1;
            if ("string" == typeof n ? (r = n, n = 0) : 2147483647 < n ? n = 2147483647 : -2147483648 > n && (n = -2147483648), A(n = +n) && (n = l ? 0 : a.length - 1), 0 > n && (n = a.length + n), n >= a.length) {
                if (l) return -1;
                n = a.length - 1
            } else if (0 > n) {
                if (!l) return -1;
                n = 0
            }
            if ("string" == typeof t && (t = G.from(t, r)), G.isBuffer(t)) return 0 === t.length ? -1 : m(a, t, n, r, l);
            if ("number" == typeof t) return t &= 255, "function" == typeof Uint8Array.prototype.indexOf ? l ? Uint8Array.prototype.indexOf.call(a, t, n) : Uint8Array.prototype.lastIndexOf.call(a, t, n) : m(a, [t], n, r, l);
            throw new TypeError("val must be string, number or Buffer")
        }

        function m(p, t, e, m, g) {
            function o(a, t) {
                return 1 === h ? a[t] : a.readUInt16BE(t * h)
            }
            var h = 1,
                f = p.length,
                y = t.length,
                k;
            if (void 0 !== m && ("ucs2" === (m = (m + "").toLowerCase()) || "ucs-2" === m || "utf16le" === m || "utf-16le" === m)) {
                if (2 > p.length || 2 > t.length) return -1;
                h = 2, f /= 2, y /= 2, e /= 2
            }
            if (g) {
                var S = -1;
                for (k = e; k < f; k++)
                    if (o(p, k) !== o(t, -1 === S ? 0 : k - S)) - 1 !== S && (k -= k - S), S = -1;
                    else if (-1 === S && (S = k), k - S + 1 === y) return S * h
            } else
                for (e + y > f && (e = f - y), k = e; 0 <= k; k--) {
                    for (var C = !0, b = 0; b < y; b++)
                        if (o(p, k + b) !== o(t, b)) {
                            C = !1;
                            break
                        } if (C) return k
                }
            return -1
        }

        function g(l, t, e, d) {
            e = +e || 0;
            var p = l.length - e;
            d ? (d = +d) > p && (d = p) : d = p;
            var o = t.length;
            if (0 != o % 2) throw new TypeError("Invalid hex string");
            d > o / 2 && (d = o / 2);
            for (var a = 0, c; a < d; ++a) {
                if (c = parseInt(t.substr(2 * a, 2), 16), A(c)) return a;
                l[e + a] = c
            }
            return a
        }

        function y(a, t, e, o) {
            return D(function(a) {
                for (var t = [], e = 0; e < a.length; ++e) t.push(255 & a.charCodeAt(e));
                return t
            }(t), a, e, o)
        }

        function h(a, t, e) {
            return 0 === t && e === a.length ? R.fromByteArray(a) : R.fromByteArray(a.slice(t, e))
        }

        function u(d, t, e) {
            e = Math.min(d.length, e);
            for (var p = [], s = t; s < e;) {
                var m = d[s],
                    h = null,
                    g = 239 < m ? 4 : 223 < m ? 3 : 191 < m ? 2 : 1,
                    f, y, k, S;
                s + g <= e && (1 == g ? 128 > m && (h = m) : 2 == g ? 128 == (192 & (f = d[s + 1])) && 127 < (S = (31 & m) << 6 | 63 & f) && (h = S) : 3 == g ? (f = d[s + 1], y = d[s + 2], 128 == (192 & f) && 128 == (192 & y) && 2047 < (S = (15 & m) << 12 | (63 & f) << 6 | 63 & y) && (55296 > S || 57343 < S) && (h = S)) : 4 == g ? (f = d[s + 1], y = d[s + 2], k = d[s + 3], 128 == (192 & f) && 128 == (192 & y) && 128 == (192 & k) && 65535 < (S = (15 & m) << 18 | (63 & f) << 12 | (63 & y) << 6 | 63 & k) && 1114112 > S && (h = S)) : void 0);
                null === h ? (h = 65533, g = 1) : 65535 < h && (h -= 65536, p.push(55296 | 1023 & h >>> 10), h = 56320 | 1023 & h), p.push(h), s += g
            }
            return function(a) {
                var t = a.length;
                if (t <= o) return String.fromCharCode.apply(String, a);
                for (var e = "", n = 0; n < t;) e += String.fromCharCode.apply(String, a.slice(n, n += o));
                return e
            }(p)
        }

        function f(a, t, e) {
            var n = "";
            e = Math.min(a.length, e);
            for (var r = t; r < e; ++r) n += String.fromCharCode(127 & a[r]);
            return n
        }

        function k(a, t, e) {
            var n = "";
            e = Math.min(a.length, e);
            for (var r = t; r < e; ++r) n += String.fromCharCode(a[r]);
            return n
        }

        function S(n, t, r) {
            var l = n.length;
            (!t || 0 > t) && (t = 0), (!r || 0 > r || r > l) && (r = l);
            for (var s = "", d = t; d < r; ++d) s += T(n[d]);
            return s
        }

        function C(n, t, e) {
            for (var r = n.slice(t, e), s = "", i = 0; i < r.length; i += 2) s += String.fromCharCode(r[i] + 256 * r[i + 1]);
            return s
        }

        function w(a, t, e) {
            if (0 != a % 1 || 0 > a) throw new RangeError("offset is not uint");
            if (a + t > e) throw new RangeError("Trying to access beyond buffer length")
        }

        function M(n, t, e, r, s, o) {
            if (!G.isBuffer(n)) throw new TypeError("\"buffer\" argument must be a Buffer instance");
            if (t > s || t < o) throw new RangeError("\"value\" argument is out of bounds");
            if (e + r > n.length) throw new RangeError("Index out of range")
        }

        function v(a, t, e, o) {
            if (e + o > a.length) throw new RangeError("Index out of range");
            if (0 > e) throw new RangeError("Index out of range")
        }

        function x(o, t, n, r, s) {
            return t = +t, n >>>= 0, s || v(o, 0, n, 4), O.write(o, t, n, r, 23, 4), n + 4
        }

        function _(o, t, n, r, s) {
            return t = +t, n >>>= 0, s || v(o, 0, n, 8), O.write(o, t, n, r, 52, 8), n + 8
        }

        function T(e) {
            return 16 > e ? "0" + e.toString(16) : e.toString(16)
        }

        function P(r, t) {
            var l;
            t = t || 1 / 0;
            for (var d = r.length, s = null, p = [], a = 0; a < d; ++a) {
                if (55295 < (l = r.charCodeAt(a)) && 57344 > l) {
                    if (!s) {
                        if (56319 < l) {
                            -1 < (t -= 3) && p.push(239, 191, 189);
                            continue
                        }
                        if (a + 1 === d) {
                            -1 < (t -= 3) && p.push(239, 191, 189);
                            continue
                        }
                        s = l;
                        continue
                    }
                    if (56320 > l) {
                        -1 < (t -= 3) && p.push(239, 191, 189), s = l;
                        continue
                    }
                    l = 65536 + (s - 55296 << 10 | l - 56320)
                } else s && -1 < (t -= 3) && p.push(239, 191, 189);
                if (s = null, 128 > l) {
                    if (0 > (t -= 1)) break;
                    p.push(l)
                } else if (2048 > l) {
                    if (0 > (t -= 2)) break;
                    p.push(192 | l >> 6, 128 | 63 & l)
                } else if (65536 > l) {
                    if (0 > (t -= 3)) break;
                    p.push(224 | l >> 12, 128 | 63 & l >> 6, 128 | 63 & l)
                } else {
                    if (!(1114112 > l)) throw new Error("Invalid code point");
                    if (0 > (t -= 4)) break;
                    p.push(240 | l >> 18, 128 | 63 & l >> 12, 128 | 63 & l >> 6, 128 | 63 & l)
                }
            }
            return p
        }

        function I(e) {
            return R.toByteArray(function(e) {
                if (2 > (e = e.trim().replace(s, "")).length) return "";
                for (; 0 != e.length % 4;) e += "=";
                return e
            }(e))
        }

        function D(a, t, e, n) {
            for (var s = 0; s < n && !(s + e >= t.length || s >= a.length); ++s) t[s + e] = a[s];
            return s
        }

        function U(e) {
            return "function" == typeof ArrayBuffer.isView && ArrayBuffer.isView(e)
        }

        function A(e) {
            return e != e
        }
        var R = a("base64-js"),
            O = a("ieee754");
        L.Buffer = G, L.SlowBuffer = function(e) {
            return +e != e && (e = 0), G.alloc(+e)
        }, L.INSPECT_MAX_BYTES = 50;
        L.kMaxLength = 2147483647, G.TYPED_ARRAY_SUPPORT = function() {
            try {
                var e = new Uint8Array(1);
                return e.__proto__ = {
                    __proto__: Uint8Array.prototype,
                    foo: function() {
                        return 42
                    }
                }, 42 === e.foo()
            } catch (e) {
                return !1
            }
        }(), G.TYPED_ARRAY_SUPPORT || "undefined" == typeof console || "function" != typeof console.error || console.error("This browser lacks typed array (Uint8Array) support which is required by buffer v5.x. Use v4.x if you require old browser support."), "undefined" != typeof Symbol && Symbol.species && G[Symbol.species] === G && Object.defineProperty(G, Symbol.species, {
            value: null,
            configurable: !0,
            enumerable: !1,
            writable: !1
        }), G.poolSize = 8192, G.from = function(a, t, e) {
            return n(a, t, e)
        }, G.prototype.__proto__ = Uint8Array.prototype, G.__proto__ = Uint8Array, G.alloc = function(n, t, e) {
            return l = t, d = e, r(i = n), 0 >= i ? F(i) : void 0 === l ? F(i) : "string" == typeof d ? F(i).fill(l, d) : F(i).fill(l);
            var i, l, d
        }, G.allocUnsafe = function(e) {
            return i(e)
        }, G.allocUnsafeSlow = function(e) {
            return i(e)
        }, G.isBuffer = function(e) {
            return null != e && !0 === e._isBuffer
        }, G.compare = function(n, t) {
            if (!G.isBuffer(n) || !G.isBuffer(t)) throw new TypeError("Arguments must be Buffers");
            if (n === t) return 0;
            for (var e = n.length, r = t.length, l = 0, d = Math.min(e, r); l < d; ++l)
                if (n[l] !== t[l]) {
                    e = n[l], r = t[l];
                    break
                } return e < r ? -1 : r < e ? 1 : 0
        }, G.isEncoding = function(e) {
            switch ((e + "").toLowerCase()) {
                case "hex":
                case "utf8":
                case "utf-8":
                case "ascii":
                case "latin1":
                case "binary":
                case "base64":
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                    return !0;
                default:
                    return !1;
            }
        }, G.concat = function(n, t) {
            if (!Array.isArray(n)) throw new TypeError("\"list\" argument must be an Array of Buffers");
            if (0 === n.length) return G.alloc(0);
            var r;
            if (void 0 === t)
                for (t = 0, r = 0; r < n.length; ++r) t += n[r].length;
            var l = G.allocUnsafe(t),
                s = 0;
            for (r = 0; r < n.length; ++r) {
                var d = n[r];
                if (!G.isBuffer(d)) throw new TypeError("\"list\" argument must be an Array of Buffers");
                d.copy(l, s), s += d.length
            }
            return l
        }, G.byteLength = d, G.prototype._isBuffer = !0, G.prototype.swap16 = function() {
            var a = this.length;
            if (0 != a % 2) throw new RangeError("Buffer size must be a multiple of 16-bits");
            for (var t = 0; t < a; t += 2) p(this, t, t + 1);
            return this
        }, G.prototype.swap32 = function() {
            var a = this.length;
            if (0 != a % 4) throw new RangeError("Buffer size must be a multiple of 32-bits");
            for (var t = 0; t < a; t += 4) p(this, t, t + 3), p(this, t + 1, t + 2);
            return this
        }, G.prototype.swap64 = function() {
            var a = this.length;
            if (0 != a % 8) throw new RangeError("Buffer size must be a multiple of 64-bits");
            for (var t = 0; t < a; t += 8) p(this, t, t + 7), p(this, t + 1, t + 6), p(this, t + 2, t + 5), p(this, t + 3, t + 4);
            return this
        }, G.prototype.toString = function() {
            var e = this.length;
            return 0 === e ? "" : 0 === arguments.length ? u(this, 0, e) : function(a, o, n) {
                var r = !1;
                if ((void 0 === o || 0 > o) && (o = 0), o > this.length) return "";
                if ((void 0 === n || n > this.length) && (n = this.length), 0 >= n) return "";
                if ((n >>>= 0) <= (o >>>= 0)) return "";
                for (a || (a = "utf8");;) switch (a) {
                    case "hex":
                        return S(this, o, n);
                    case "utf8":
                    case "utf-8":
                        return u(this, o, n);
                    case "ascii":
                        return f(this, o, n);
                    case "latin1":
                    case "binary":
                        return k(this, o, n);
                    case "base64":
                        return h(this, o, n);
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return C(this, o, n);
                    default:
                        if (r) throw new TypeError("Unknown encoding: " + a);
                        a = (a + "").toLowerCase(), r = !0;
                }
            }.apply(this, arguments)
        }, G.prototype.equals = function(e) {
            if (!G.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
            return this === e || 0 === G.compare(this, e)
        }, G.prototype.inspect = function() {
            var a = "",
                o = L.INSPECT_MAX_BYTES;
            return 0 < this.length && (a = this.toString("hex", 0, o).match(/.{2}/g).join(" "), this.length > o && (a += " ... ")), "<Buffer " + a + ">"
        }, G.prototype.compare = function(r, t, d, p, m) {
            if (!G.isBuffer(r)) throw new TypeError("Argument must be a Buffer");
            if (void 0 === t && (t = 0), void 0 === d && (d = r ? r.length : 0), void 0 === p && (p = 0), void 0 === m && (m = this.length), 0 > t || d > r.length || 0 > p || m > this.length) throw new RangeError("out of range index");
            if (p >= m && t >= d) return 0;
            if (p >= m) return -1;
            if (t >= d) return 1;
            if (this === r) return 0;
            for (var g = (m >>>= 0) - (p >>>= 0), f = (d >>>= 0) - (t >>>= 0), y = Math.min(g, f), l = this.slice(p, m), h = r.slice(t, d), c = 0; c < y; ++c)
                if (l[c] !== h[c]) {
                    g = l[c], f = h[c];
                    break
                } return g < f ? -1 : f < g ? 1 : 0
        }, G.prototype.includes = function(a, t, e) {
            return -1 !== this.indexOf(a, t, e)
        }, G.prototype.indexOf = function(a, t, e) {
            return c(this, a, t, e, !0)
        }, G.prototype.lastIndexOf = function(a, t, e) {
            return c(this, a, t, e, !1)
        }, G.prototype.write = function(m, t, k, S) {
            if (void 0 === t) S = "utf8", k = this.length, t = 0;
            else if (void 0 === k && "string" == typeof t) S = t, k = this.length, t = 0;
            else {
                if (!isFinite(t)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
                t >>>= 0, isFinite(k) ? (k >>>= 0, void 0 === S && (S = "utf8")) : (S = k, k = void 0)
            }
            var C = this.length - t;
            if ((void 0 === k || k > C) && (k = C), 0 < m.length && (0 > k || 0 > t) || t > this.length) throw new RangeError("Attempt to write outside buffer bounds");
            S || (S = "utf8");
            for (var o = !1, b, w, M, v, x, _, T, B, U;;) switch (S) {
                case "hex":
                    return g(this, m, t, k);
                case "utf8":
                case "utf-8":
                    return B = t, U = k, D(P(m, (T = this).length - B), T, B, U);
                case "ascii":
                    return y(this, m, t, k);
                case "latin1":
                case "binary":
                    return y(this, m, t, k);
                case "base64":
                    return v = this, x = t, _ = k, D(I(m), v, x, _);
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                    return w = t, M = k, D(function(r, t) {
                        for (var l = [], a = 0, d, p, c; a < r.length && !(0 > (t -= 2)); ++a) d = r.charCodeAt(a), p = d >> 8, c = d % 256, l.push(c), l.push(p);
                        return l
                    }(m, (b = this).length - w), b, w, M);
                default:
                    if (o) throw new TypeError("Unknown encoding: " + S);
                    S = ("" + S).toLowerCase(), o = !0;
            }
        }, G.prototype.toJSON = function() {
            return {
                type: "Buffer",
                data: Array.prototype.slice.call(this._arr || this, 0)
            }
        };
        var o = 4096;
        G.prototype.slice = function(a, o) {
            var n = this.length;
            0 > (a = ~~a) ? 0 > (a += n) && (a = 0) : a > n && (a = n), 0 > (o = void 0 === o ? n : ~~o) ? 0 > (o += n) && (o = 0) : o > n && (o = n), o < a && (o = a);
            var r = this.subarray(a, o);
            return r.__proto__ = G.prototype, r
        }, G.prototype.readUIntLE = function(n, r, l) {
            n >>>= 0, r >>>= 0, l || w(n, r, this.length);
            for (var i = this[n], d = 1, p = 0; ++p < r && (d *= 256);) i += this[n + p] * d;
            return i
        }, G.prototype.readUIntBE = function(a, n, r) {
            a >>>= 0, n >>>= 0, r || w(a, n, this.length);
            for (var i = this[a + --n], l = 1; 0 < n && (l *= 256);) i += this[a + --n] * l;
            return i
        }, G.prototype.readUInt8 = function(a, o) {
            return a >>>= 0, o || w(a, 1, this.length), this[a]
        }, G.prototype.readUInt16LE = function(a, o) {
            return a >>>= 0, o || w(a, 2, this.length), this[a] | this[a + 1] << 8
        }, G.prototype.readUInt16BE = function(a, o) {
            return a >>>= 0, o || w(a, 2, this.length), this[a] << 8 | this[a + 1]
        }, G.prototype.readUInt32LE = function(a, o) {
            return a >>>= 0, o || w(a, 4, this.length), (this[a] | this[a + 1] << 8 | this[a + 2] << 16) + 16777216 * this[a + 3]
        }, G.prototype.readUInt32BE = function(a, o) {
            return a >>>= 0, o || w(a, 4, this.length), 16777216 * this[a] + (this[a + 1] << 16 | this[a + 2] << 8 | this[a + 3])
        }, G.prototype.readIntLE = function(n, r, l) {
            n >>>= 0, r >>>= 0, l || w(n, r, this.length);
            for (var i = this[n], d = 1, p = 0; ++p < r && (d *= 256);) i += this[n + p] * d;
            return i >= (d *= 128) && (i -= Math.pow(2, 8 * r)), i
        }, G.prototype.readIntBE = function(n, r, l) {
            n >>>= 0, r >>>= 0, l || w(n, r, this.length);
            for (var i = r, d = 1, p = this[n + --i]; 0 < i && (d *= 256);) p += this[n + --i] * d;
            return p >= (d *= 128) && (p -= Math.pow(2, 8 * r)), p
        }, G.prototype.readInt8 = function(a, o) {
            return a >>>= 0, o || w(a, 1, this.length), 128 & this[a] ? -1 * (255 - this[a] + 1) : this[a]
        }, G.prototype.readInt16LE = function(a, o) {
            a >>>= 0, o || w(a, 2, this.length);
            var e = this[a] | this[a + 1] << 8;
            return 32768 & e ? 4294901760 | e : e
        }, G.prototype.readInt16BE = function(a, o) {
            a >>>= 0, o || w(a, 2, this.length);
            var e = this[a + 1] | this[a] << 8;
            return 32768 & e ? 4294901760 | e : e
        }, G.prototype.readInt32LE = function(a, o) {
            return a >>>= 0, o || w(a, 4, this.length), this[a] | this[a + 1] << 8 | this[a + 2] << 16 | this[a + 3] << 24
        }, G.prototype.readInt32BE = function(a, o) {
            return a >>>= 0, o || w(a, 4, this.length), this[a] << 24 | this[a + 1] << 16 | this[a + 2] << 8 | this[a + 3]
        }, G.prototype.readFloatLE = function(a, o) {
            return a >>>= 0, o || w(a, 4, this.length), O.read(this, a, !0, 23, 4)
        }, G.prototype.readFloatBE = function(a, o) {
            return a >>>= 0, o || w(a, 4, this.length), O.read(this, a, !1, 23, 4)
        }, G.prototype.readDoubleLE = function(a, o) {
            return a >>>= 0, o || w(a, 8, this.length), O.read(this, a, !0, 52, 8)
        }, G.prototype.readDoubleBE = function(a, o) {
            return a >>>= 0, o || w(a, 8, this.length), O.read(this, a, !1, 52, 8)
        }, G.prototype.writeUIntLE = function(n, r, l, d) {
            (n = +n, r >>>= 0, l >>>= 0, d) || M(this, n, r, l, Math.pow(2, 8 * l) - 1, 0);
            var s = 1,
                p = 0;
            for (this[r] = 255 & n; ++p < l && (s *= 256);) this[r + p] = 255 & n / s;
            return r + l
        }, G.prototype.writeUIntBE = function(n, r, l, d) {
            (n = +n, r >>>= 0, l >>>= 0, d) || M(this, n, r, l, Math.pow(2, 8 * l) - 1, 0);
            var s = l - 1,
                p = 1;
            for (this[r + s] = 255 & n; 0 <= --s && (p *= 256);) this[r + s] = 255 & n / p;
            return r + l
        }, G.prototype.writeUInt8 = function(a, o, s) {
            return a = +a, o >>>= 0, s || M(this, a, o, 1, 255, 0), this[o] = 255 & a, o + 1
        }, G.prototype.writeUInt16LE = function(a, o, s) {
            return a = +a, o >>>= 0, s || M(this, a, o, 2, 65535, 0), this[o] = 255 & a, this[o + 1] = a >>> 8, o + 2
        }, G.prototype.writeUInt16BE = function(a, o, s) {
            return a = +a, o >>>= 0, s || M(this, a, o, 2, 65535, 0), this[o] = a >>> 8, this[o + 1] = 255 & a, o + 2
        }, G.prototype.writeUInt32LE = function(a, o, s) {
            return a = +a, o >>>= 0, s || M(this, a, o, 4, 4294967295, 0), this[o + 3] = a >>> 24, this[o + 2] = a >>> 16, this[o + 1] = a >>> 8, this[o] = 255 & a, o + 4
        }, G.prototype.writeUInt32BE = function(a, o, s) {
            return a = +a, o >>>= 0, s || M(this, a, o, 4, 4294967295, 0), this[o] = a >>> 24, this[o + 1] = a >>> 16, this[o + 2] = a >>> 8, this[o + 3] = 255 & a, o + 4
        }, G.prototype.writeIntLE = function(l, d, p, i) {
            if (l = +l, d >>>= 0, !i) {
                var s = Math.pow(2, 8 * p - 1);
                M(this, l, d, p, s - 1, -s)
            }
            var o = 0,
                c = 1,
                m = 0;
            for (this[d] = 255 & l; ++o < p && (c *= 256);) 0 > l && 0 == m && 0 !== this[d + o - 1] && (m = 1), this[d + o] = 255 & (l / c >> 0) - m;
            return d + p
        }, G.prototype.writeIntBE = function(l, d, p, i) {
            if (l = +l, d >>>= 0, !i) {
                var s = Math.pow(2, 8 * p - 1);
                M(this, l, d, p, s - 1, -s)
            }
            var o = p - 1,
                c = 1,
                m = 0;
            for (this[d + o] = 255 & l; 0 <= --o && (c *= 256);) 0 > l && 0 == m && 0 !== this[d + o + 1] && (m = 1), this[d + o] = 255 & (l / c >> 0) - m;
            return d + p
        }, G.prototype.writeInt8 = function(a, o, s) {
            return a = +a, o >>>= 0, s || M(this, a, o, 1, 127, -128), 0 > a && (a = 255 + a + 1), this[o] = 255 & a, o + 1
        }, G.prototype.writeInt16LE = function(a, o, s) {
            return a = +a, o >>>= 0, s || M(this, a, o, 2, 32767, -32768), this[o] = 255 & a, this[o + 1] = a >>> 8, o + 2
        }, G.prototype.writeInt16BE = function(a, o, s) {
            return a = +a, o >>>= 0, s || M(this, a, o, 2, 32767, -32768), this[o] = a >>> 8, this[o + 1] = 255 & a, o + 2
        }, G.prototype.writeInt32LE = function(a, o, s) {
            return a = +a, o >>>= 0, s || M(this, a, o, 4, 2147483647, -2147483648), this[o] = 255 & a, this[o + 1] = a >>> 8, this[o + 2] = a >>> 16, this[o + 3] = a >>> 24, o + 4
        }, G.prototype.writeInt32BE = function(a, o, s) {
            return a = +a, o >>>= 0, s || M(this, a, o, 4, 2147483647, -2147483648), 0 > a && (a = 4294967295 + a + 1), this[o] = a >>> 24, this[o + 1] = a >>> 16, this[o + 2] = a >>> 8, this[o + 3] = 255 & a, o + 4
        }, G.prototype.writeFloatLE = function(a, t, e) {
            return x(this, a, t, !0, e)
        }, G.prototype.writeFloatBE = function(a, t, e) {
            return x(this, a, t, !1, e)
        }, G.prototype.writeDoubleLE = function(a, t, e) {
            return _(this, a, t, !0, e)
        }, G.prototype.writeDoubleBE = function(a, t, e) {
            return _(this, a, t, !1, e)
        }, G.prototype.copy = function(n, t, r, l) {
            if (r || (r = 0), l || 0 === l || (l = this.length), t >= n.length && (t = n.length), t || (t = 0), 0 < l && l < r && (l = r), l === r) return 0;
            if (0 === n.length || 0 === this.length) return 0;
            if (0 > t) throw new RangeError("targetStart out of bounds");
            if (0 > r || r >= this.length) throw new RangeError("sourceStart out of bounds");
            if (0 > l) throw new RangeError("sourceEnd out of bounds");
            l > this.length && (l = this.length), n.length - t < l - r && (l = n.length - t + r);
            var d = l - r,
                a;
            if (this === n && r < t && t < l)
                for (a = d - 1; 0 <= a; --a) n[a + t] = this[a + r];
            else if (1e3 > d)
                for (a = 0; a < d; ++a) n[a + t] = this[a + r];
            else Uint8Array.prototype.set.call(n, this.subarray(r, r + d), t);
            return d
        }, G.prototype.fill = function(r, d, p, c) {
            if ("string" == typeof r) {
                if ("string" == typeof d ? (c = d, d = 0, p = this.length) : "string" == typeof p && (c = p, p = this.length), 1 === r.length) {
                    var m = r.charCodeAt(0);
                    256 > m && (r = m)
                }
                if (void 0 !== c && "string" != typeof c) throw new TypeError("encoding must be a string");
                if ("string" == typeof c && !G.isEncoding(c)) throw new TypeError("Unknown encoding: " + c)
            } else "number" == typeof r && (r &= 255);
            if (0 > d || this.length < d || this.length < p) throw new RangeError("Out of range index");
            if (p <= d) return this;
            var o;
            if (d >>>= 0, p = void 0 === p ? this.length : p >>> 0, r || (r = 0), "number" == typeof r)
                for (o = d; o < p; ++o) this[o] = r;
            else {
                var h = G.isBuffer(r) ? r : new G(r, c),
                    n = h.length;
                for (o = 0; o < p - d; ++o) this[o + d] = h[o % n]
            }
            return this
        };
        var s = /[^+\/0-9A-Za-z-_]/g
    }, {
        "base64-js": 1,
        ieee754: 9
    }],
    4: [function(a, t, o) {
        (function(a) {
            function s(e) {
                return Object.prototype.toString.call(e)
            }
            o.isArray = function(e) {
                return Array.isArray ? Array.isArray(e) : "[object Array]" === s(e)
            }, o.isBoolean = function(e) {
                return "boolean" == typeof e
            }, o.isNull = function(e) {
                return null === e
            }, o.isNullOrUndefined = function(e) {
                return null == e
            }, o.isNumber = function(e) {
                return "number" == typeof e
            }, o.isString = function(e) {
                return "string" == typeof e
            }, o.isSymbol = function(e) {
                return "symbol" == typeof e
            }, o.isUndefined = function(e) {
                return void 0 === e
            }, o.isRegExp = function(e) {
                return "[object RegExp]" === s(e)
            }, o.isObject = function(e) {
                return "object" == typeof e && null !== e
            }, o.isDate = function(e) {
                return "[object Date]" === s(e)
            }, o.isError = function(e) {
                return "[object Error]" === s(e) || e instanceof Error
            }, o.isFunction = function(e) {
                return "function" == typeof e
            }, o.isPrimitive = function(e) {
                return null === e || "boolean" == typeof e || "number" == typeof e || "string" == typeof e || "symbol" == typeof e || void 0 === e
            }, o.isBuffer = a.isBuffer
        }).call(this, {
            isBuffer: a("../../is-buffer/index.js")
        })
    }, {
        "../../is-buffer/index.js": 11
    }],
    5: [function(a, t, e) {
        e.UINT32 = a("./lib/uint32"), e.UINT64 = a("./lib/uint64")
    }, {
        "./lib/uint32": 6,
        "./lib/uint64": 7
    }],
    6: [function(a, n) {
        ! function(e) {
            function r(a, t) {
                return this instanceof r ? (this._low = 0, this._high = 0, this.remainder = null, void 0 === t ? s.call(this, a) : "string" == typeof a ? o.call(this, a, t) : void i.call(this, a, t)) : new r(a, t)
            }

            function i(a, t) {
                return this._low = 0 | a, this._high = 0 | t, this
            }

            function s(e) {
                return this._low = 65535 & e, this._high = e >>> 16, this
            }

            function o(a, t) {
                var e = parseInt(a, t || 10);
                return this._low = 65535 & e, this._high = e >>> 16, this
            }
            r(Math.pow(36, 5)), r(Math.pow(16, 7)), r(Math.pow(10, 9)), r(Math.pow(2, 30)), r(36), r(16), r(10), r(2), r.prototype.fromBits = i, r.prototype.fromNumber = s, r.prototype.fromString = o, r.prototype.toNumber = function() {
                return 65536 * this._high + this._low
            }, r.prototype.toString = function(e) {
                return this.toNumber().toString(e || 10)
            }, r.prototype.add = function(a) {
                var t = this._low + a._low,
                    e = t >>> 16;
                return e += this._high + a._high, this._low = 65535 & t, this._high = 65535 & e, this
            }, r.prototype.subtract = function(e) {
                return this.add(e.clone().negate())
            }, r.prototype.multiply = function(r) {
                var t = this._high,
                    s = this._low,
                    o = r._high,
                    a = r._low,
                    n, l;
                return n = (l = s * a) >>> 16, n += t * a, n &= 65535, n += s * o, this._low = 65535 & l, this._high = 65535 & n, this
            }, r.prototype.div = function(a) {
                if (0 == a._low && 0 == a._high) throw Error("division by zero");
                if (0 == a._high && 1 == a._low) return this.remainder = new r(0), this;
                if (a.gt(this)) return this.remainder = this.clone(), this._low = 0, this._high = 0, this;
                if (this.eq(a)) return this.remainder = new r(0), this._low = 1, this._high = 0, this;
                for (var t = a.clone(), e = -1; !this.lt(t);) t.shiftLeft(1, !0), e++;
                for (this.remainder = this.clone(), this._low = 0, this._high = 0; 0 <= e; e--) t.shiftRight(1), this.remainder.lt(t) || (this.remainder.subtract(t), 16 <= e ? this._high |= 1 << e - 16 : this._low |= 1 << e);
                return this
            }, r.prototype.negate = function() {
                var e = 1 + (65535 & ~this._low);
                return this._low = 65535 & e, this._high = 65535 & ~this._high + (e >>> 16), this
            }, r.prototype.equals = r.prototype.eq = function(e) {
                return this._low == e._low && this._high == e._high
            }, r.prototype.greaterThan = r.prototype.gt = function(e) {
                return this._high > e._high || !(this._high < e._high) && this._low > e._low
            }, r.prototype.lessThan = r.prototype.lt = function(e) {
                return this._high < e._high || !(this._high > e._high) && this._low < e._low
            }, r.prototype.or = function(e) {
                return this._low |= e._low, this._high |= e._high, this
            }, r.prototype.and = function(e) {
                return this._low &= e._low, this._high &= e._high, this
            }, r.prototype.not = function() {
                return this._low = 65535 & ~this._low, this._high = 65535 & ~this._high, this
            }, r.prototype.xor = function(e) {
                return this._low ^= e._low, this._high ^= e._high, this
            }, r.prototype.shiftRight = r.prototype.shiftr = function(e) {
                return 16 < e ? (this._low = this._high >> e - 16, this._high = 0) : 16 == e ? (this._low = this._high, this._high = 0) : (this._low = this._low >> e | 65535 & this._high << 16 - e, this._high >>= e), this
            }, r.prototype.shiftLeft = r.prototype.shiftl = function(a, t) {
                return 16 < a ? (this._high = this._low << a - 16, this._low = 0, t || (this._high &= 65535)) : 16 == a ? (this._high = this._low, this._low = 0) : (this._high = this._high << a | this._low >> 16 - a, this._low = 65535 & this._low << a, t || (this._high &= 65535)), this
            }, r.prototype.rotateLeft = r.prototype.rotl = function(a) {
                var t = this._high << 16 | this._low;
                return t = t << a | t >>> 32 - a, this._low = 65535 & t, this._high = t >>> 16, this
            }, r.prototype.rotateRight = r.prototype.rotr = function(a) {
                var t = this._high << 16 | this._low;
                return t = t >>> a | t << 32 - a, this._low = 65535 & t, this._high = t >>> 16, this
            }, r.prototype.clone = function() {
                return new r(this._low, this._high)
            }, "undefined" != typeof define && define.amd ? define([], function() {
                return r
            }) : void 0 !== n && n.exports ? n.exports = r : e.UINT32 = r
        }(this)
    }, {}],
    7: [function(a, l) {
        ! function(e) {
            function d(r, t, e, i) {
                return this instanceof d ? (this.remainder = null, "string" == typeof r ? n.call(this, r, t) : void 0 === t ? a.call(this, r) : void o.apply(this, arguments)) : new d(r, t, e, i)
            }

            function o(a, t, e, o) {
                return void 0 === e ? (this._a00 = 65535 & a, this._a16 = a >>> 16, this._a32 = 65535 & t, this._a48 = t >>> 16, this) : (this._a00 = 0 | a, this._a16 = 0 | t, this._a32 = 0 | e, this._a48 = 0 | o, this)
            }

            function a(e) {
                return this._a00 = 65535 & e, this._a16 = e >>> 16, this._a32 = 0, this._a48 = 0, this
            }

            function n(o, t) {
                t = t || 10, this._a00 = 0, this._a16 = 0, this._a32 = 0, this._a48 = 0;
                for (var i = p[t] || new d(Math.pow(t, 5)), s = 0, c = o.length; s < c; s += 5) {
                    var n = Math.min(5, c - s),
                        r = parseInt(o.slice(s, s + n), t);
                    this.multiply(5 > n ? new d(Math.pow(t, n)) : i).add(new d(r))
                }
                return this
            }
            var p = {
                    16: d(Math.pow(16, 5)),
                    10: d(Math.pow(10, 5)),
                    2: d(Math.pow(2, 5))
                },
                r = {
                    16: d(16),
                    10: d(10),
                    2: d(2)
                };
            d.prototype.fromBits = o, d.prototype.fromNumber = a, d.prototype.fromString = n, d.prototype.toNumber = function() {
                return 65536 * this._a16 + this._a00
            }, d.prototype.toString = function(o) {
                var s = r[o = o || 10] || new d(o);
                if (!this.gt(s)) return this.toNumber().toString(o);
                for (var e = this.clone(), i = Array(64), a = 63; 0 <= a && (e.div(s), i[a] = e.remainder.toNumber().toString(o), e.gt(s)); a--);
                return i[a - 1] = e.toNumber().toString(o), i.join("")
            }, d.prototype.add = function(a) {
                var t = this._a00 + a._a00,
                    e = t >>> 16,
                    n = (e += this._a16 + a._a16) >>> 16,
                    r = (n += this._a32 + a._a32) >>> 16;
                return r += this._a48 + a._a48, this._a00 = 65535 & t, this._a16 = 65535 & e, this._a32 = 65535 & n, this._a48 = 65535 & r, this
            }, d.prototype.subtract = function(e) {
                return this.add(e.clone().negate())
            }, d.prototype.multiply = function(d) {
                var t = this._a00,
                    e = this._a16,
                    i = this._a32,
                    s = this._a48,
                    o = d._a00,
                    a = d._a16,
                    n = d._a32,
                    r = t * o,
                    l = r >>> 16,
                    p = (l += t * a) >>> 16;
                l &= 65535, p += (l += e * o) >>> 16;
                var m = (p += t * n) >>> 16;
                return p &= 65535, m += (p += e * a) >>> 16, p &= 65535, m += (p += i * o) >>> 16, m += t * d._a48, m &= 65535, m += e * n, m &= 65535, m += i * a, m &= 65535, m += s * o, this._a00 = 65535 & r, this._a16 = 65535 & l, this._a32 = 65535 & p, this._a48 = 65535 & m, this
            }, d.prototype.div = function(a) {
                if (0 == a._a16 && 0 == a._a32 && 0 == a._a48) {
                    if (0 == a._a00) throw Error("division by zero");
                    if (1 == a._a00) return this.remainder = new d(0), this
                }
                if (a.gt(this)) return this.remainder = this.clone(), this._a00 = 0, this._a16 = 0, this._a32 = 0, this._a48 = 0, this;
                if (this.eq(a)) return this.remainder = new d(0), this._a00 = 1, this._a16 = 0, this._a32 = 0, this._a48 = 0, this;
                for (var t = a.clone(), e = -1; !this.lt(t);) t.shiftLeft(1, !0), e++;
                for (this.remainder = this.clone(), this._a00 = 0, this._a16 = 0, this._a32 = 0, this._a48 = 0; 0 <= e; e--) t.shiftRight(1), this.remainder.lt(t) || (this.remainder.subtract(t), 48 <= e ? this._a48 |= 1 << e - 48 : 32 <= e ? this._a32 |= 1 << e - 32 : 16 <= e ? this._a16 |= 1 << e - 16 : this._a00 |= 1 << e);
                return this
            }, d.prototype.negate = function() {
                var e = 1 + (65535 & ~this._a00);
                return this._a00 = 65535 & e, e = (65535 & ~this._a16) + (e >>> 16), this._a16 = 65535 & e, e = (65535 & ~this._a32) + (e >>> 16), this._a32 = 65535 & e, this._a48 = 65535 & ~this._a48 + (e >>> 16), this
            }, d.prototype.equals = d.prototype.eq = function(e) {
                return this._a48 == e._a48 && this._a00 == e._a00 && this._a32 == e._a32 && this._a16 == e._a16
            }, d.prototype.greaterThan = d.prototype.gt = function(e) {
                return this._a48 > e._a48 || !(this._a48 < e._a48) && (this._a32 > e._a32 || !(this._a32 < e._a32) && (this._a16 > e._a16 || !(this._a16 < e._a16) && this._a00 > e._a00))
            }, d.prototype.lessThan = d.prototype.lt = function(e) {
                return this._a48 < e._a48 || !(this._a48 > e._a48) && (this._a32 < e._a32 || !(this._a32 > e._a32) && (this._a16 < e._a16 || !(this._a16 > e._a16) && this._a00 < e._a00))
            }, d.prototype.or = function(e) {
                return this._a00 |= e._a00, this._a16 |= e._a16, this._a32 |= e._a32, this._a48 |= e._a48, this
            }, d.prototype.and = function(e) {
                return this._a00 &= e._a00, this._a16 &= e._a16, this._a32 &= e._a32, this._a48 &= e._a48, this
            }, d.prototype.xor = function(e) {
                return this._a00 ^= e._a00, this._a16 ^= e._a16, this._a32 ^= e._a32, this._a48 ^= e._a48, this
            }, d.prototype.not = function() {
                return this._a00 = 65535 & ~this._a00, this._a16 = 65535 & ~this._a16, this._a32 = 65535 & ~this._a32, this._a48 = 65535 & ~this._a48, this
            }, d.prototype.shiftRight = d.prototype.shiftr = function(e) {
                return 48 <= (e %= 64) ? (this._a00 = this._a48 >> e - 48, this._a16 = 0, this._a32 = 0, this._a48 = 0) : 32 <= e ? (e -= 32, this._a00 = 65535 & (this._a32 >> e | this._a48 << 16 - e), this._a16 = 65535 & this._a48 >> e, this._a32 = 0, this._a48 = 0) : 16 <= e ? (e -= 16, this._a00 = 65535 & (this._a16 >> e | this._a32 << 16 - e), this._a16 = 65535 & (this._a32 >> e | this._a48 << 16 - e), this._a32 = 65535 & this._a48 >> e, this._a48 = 0) : (this._a00 = 65535 & (this._a00 >> e | this._a16 << 16 - e), this._a16 = 65535 & (this._a16 >> e | this._a32 << 16 - e), this._a32 = 65535 & (this._a32 >> e | this._a48 << 16 - e), this._a48 = 65535 & this._a48 >> e), this
            }, d.prototype.shiftLeft = d.prototype.shiftl = function(a, o) {
                return 48 <= (a %= 64) ? (this._a48 = this._a00 << a - 48, this._a32 = 0, this._a16 = 0, this._a00 = 0) : 32 <= a ? (a -= 32, this._a48 = this._a16 << a | this._a00 >> 16 - a, this._a32 = 65535 & this._a00 << a, this._a16 = 0, this._a00 = 0) : 16 <= a ? (a -= 16, this._a48 = this._a32 << a | this._a16 >> 16 - a, this._a32 = 65535 & (this._a16 << a | this._a00 >> 16 - a), this._a16 = 65535 & this._a00 << a, this._a00 = 0) : (this._a48 = this._a48 << a | this._a32 >> 16 - a, this._a32 = 65535 & (this._a32 << a | this._a16 >> 16 - a), this._a16 = 65535 & (this._a16 << a | this._a00 >> 16 - a), this._a00 = 65535 & this._a00 << a), o || (this._a48 &= 65535), this
            }, d.prototype.rotateLeft = d.prototype.rotl = function(n) {
                if (0 == (n %= 64)) return this;
                if (32 <= n) {
                    var r = this._a00;
                    if (this._a00 = this._a32, this._a32 = r, r = this._a48, this._a48 = this._a16, this._a16 = r, 32 == n) return this;
                    n -= 32
                }
                var l = this._a48 << 16 | this._a32,
                    i = this._a16 << 16 | this._a00,
                    s = l << n | i >>> 32 - n,
                    o = i << n | l >>> 32 - n;
                return this._a00 = 65535 & o, this._a16 = o >>> 16, this._a32 = 65535 & s, this._a48 = s >>> 16, this
            }, d.prototype.rotateRight = d.prototype.rotr = function(n) {
                if (0 == (n %= 64)) return this;
                if (32 <= n) {
                    var r = this._a00;
                    if (this._a00 = this._a32, this._a32 = r, r = this._a48, this._a48 = this._a16, this._a16 = r, 32 == n) return this;
                    n -= 32
                }
                var l = this._a48 << 16 | this._a32,
                    i = this._a16 << 16 | this._a00,
                    s = l >>> n | i << 32 - n,
                    o = i >>> n | l << 32 - n;
                return this._a00 = 65535 & o, this._a16 = o >>> 16, this._a32 = 65535 & s, this._a48 = s >>> 16, this
            }, d.prototype.clone = function() {
                return new d(this._a00, this._a16, this._a32, this._a48)
            }, "undefined" != typeof define && define.amd ? define([], function() {
                return d
            }) : void 0 !== l && l.exports ? l.exports = d : e.UINT64 = d
        }(this)
    }, {}],
    8: [function(r, t) {
        function l() {
            this._events = this._events || {}, this._maxListeners = this._maxListeners || void 0
        }

        function d(e) {
            return "function" == typeof e
        }

        function o(e) {
            return "object" == typeof e && null !== e
        }

        function a(e) {
            return void 0 === e
        }
        t.exports = l, l.EventEmitter = l, l.prototype._events = void 0, l.prototype._maxListeners = void 0, l.defaultMaxListeners = 10, l.prototype.setMaxListeners = function(e) {
            if ("number" != typeof e || 0 > e || isNaN(e)) throw TypeError("n must be a positive number");
            return this._maxListeners = e, this
        }, l.prototype.emit = function(n) {
            var t, p, m, u, g, f;
            if (this._events || (this._events = {}), "error" === n && (!this._events.error || o(this._events.error) && !this._events.error.length)) {
                if ((t = arguments[1]) instanceof Error) throw t;
                var y = new Error("Uncaught, unspecified \"error\" event. (" + t + ")");
                throw y.context = t, y
            }
            if (a(p = this._events[n])) return !1;
            if (d(p)) switch (arguments.length) {
                case 1:
                    p.call(this);
                    break;
                case 2:
                    p.call(this, arguments[1]);
                    break;
                case 3:
                    p.call(this, arguments[1], arguments[2]);
                    break;
                default:
                    u = Array.prototype.slice.call(arguments, 1), p.apply(this, u);
            } else if (o(p))
                for (u = Array.prototype.slice.call(arguments, 1), m = (f = p.slice()).length, g = 0; g < m; g++) f[g].apply(this, u);
            return !0
        }, l.prototype.addListener = function(s, t) {
            var e;
            if (!d(t)) throw TypeError("listener must be a function");
            return this._events || (this._events = {}), this._events.newListener && this.emit("newListener", s, d(t.listener) ? t.listener : t), this._events[s] ? o(this._events[s]) ? this._events[s].push(t) : this._events[s] = [this._events[s], t] : this._events[s] = t, o(this._events[s]) && !this._events[s].warned && (e = a(this._maxListeners) ? l.defaultMaxListeners : this._maxListeners) && 0 < e && this._events[s].length > e && (this._events[s].warned = !0, console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.", this._events[s].length), "function" == typeof console.trace && console.trace()), this
        }, l.prototype.on = l.prototype.addListener, l.prototype.once = function(a, t) {
            function e() {
                this.removeListener(a, e), o || (o = !0, t.apply(this, arguments))
            }
            if (!d(t)) throw TypeError("listener must be a function");
            var o = !1;
            return e.listener = t, this.on(a, e), this
        }, l.prototype.removeListener = function(a, t) {
            var e, l, p, c;
            if (!d(t)) throw TypeError("listener must be a function");
            if (!this._events || !this._events[a]) return this;
            if (p = (e = this._events[a]).length, l = -1, e === t || d(e.listener) && e.listener === t) delete this._events[a], this._events.removeListener && this.emit("removeListener", a, t);
            else if (o(e)) {
                for (c = p; 0 < c--;)
                    if (e[c] === t || e[c].listener && e[c].listener === t) {
                        l = c;
                        break
                    } if (0 > l) return this;
                1 === e.length ? (e.length = 0, delete this._events[a]) : e.splice(l, 1), this._events.removeListener && this.emit("removeListener", a, t)
            }
            return this
        }, l.prototype.removeAllListeners = function(a) {
            var t, o;
            if (!this._events) return this;
            if (!this._events.removeListener) return 0 === arguments.length ? this._events = {} : this._events[a] && delete this._events[a], this;
            if (0 === arguments.length) {
                for (t in this._events) "removeListener" !== t && this.removeAllListeners(t);
                return this.removeAllListeners("removeListener"), this._events = {}, this
            }
            if (d(o = this._events[a])) this.removeListener(a, o);
            else if (o)
                for (; o.length;) this.removeListener(a, o[o.length - 1]);
            return delete this._events[a], this
        }, l.prototype.listeners = function(e) {
            return this._events && this._events[e] ? d(this._events[e]) ? [this._events[e]] : this._events[e].slice() : []
        }, l.prototype.listenerCount = function(a) {
            if (this._events) {
                var t = this._events[a];
                if (d(t)) return 1;
                if (t) return t.length
            }
            return 0
        }, l.listenerCount = function(a, t) {
            return a.listenerCount(t)
        }
    }, {}],
    9: [function(a, t, e) {
        e.read = function(m, t, e, i, s) {
            var o = 8 * s - i - 1,
                r = (1 << o) - 1,
                l = r >> 1,
                h = -7,
                g = e ? s - 1 : 0,
                f = e ? -1 : 1,
                d = m[t + g],
                y, k;
            for (g += f, y = d & (1 << -h) - 1, d >>= -h, h += o; 0 < h; y = 256 * y + m[t + g], g += f, h -= 8);
            for (k = y & (1 << -h) - 1, y >>= -h, h += i; 0 < h; k = 256 * k + m[t + g], g += f, h -= 8);
            if (0 === y) y = 1 - l;
            else {
                if (y === r) return k ? NaN : 1 / 0 * (d ? -1 : 1);
                k += Math.pow(2, i), y -= l
            }
            return (d ? -1 : 1) * k * Math.pow(2, y - i)
        }, e.write = function(g, t, y, i, s, k) {
            var a = 8 * k - s - 1,
                S = (1 << a) - 1,
                c = S >> 1,
                u = 23 === s ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
                d = i ? 0 : k - 1,
                C = i ? 1 : -1,
                f = 0 > t || 0 === t && 0 > 1 / t ? 1 : 0,
                m, b, w;
            for (t = Math.abs(t), isNaN(t) || t === 1 / 0 ? (b = isNaN(t) ? 1 : 0, m = S) : (m = Math.floor(Math.log(t) / Math.LN2), 1 > t * (w = Math.pow(2, -m)) && (m--, w *= 2), 2 <= (t += 1 <= m + c ? u / w : u * Math.pow(2, 1 - c)) * w && (m++, w /= 2), m + c >= S ? (b = 0, m = S) : 1 <= m + c ? (b = (t * w - 1) * Math.pow(2, s), m += c) : (b = t * Math.pow(2, c - 1) * Math.pow(2, s), m = 0)); 8 <= s; g[y + d] = 255 & b, d += C, b /= 256, s -= 8);
            for (m = m << s | b, a += s; 0 < a; g[y + d] = 255 & m, d += C, m /= 256, a -= 8);
            g[y + d - C] |= 128 * f
        }
    }, {}],
    10: [function(a, t) {
        t.exports = "function" == typeof Object.create ? function(a, t) {
            a.super_ = t, a.prototype = Object.create(t.prototype, {
                constructor: {
                    value: a,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            })
        } : function(a, t) {
            a.super_ = t;
            var e = function() {};
            e.prototype = t.prototype, a.prototype = new e, a.prototype.constructor = a
        }
    }, {}],
    11: [function(a, t) {
        function o(e) {
            return !!e.constructor && "function" == typeof e.constructor.isBuffer && e.constructor.isBuffer(e)
        }
        t.exports = function(a) {
            return null != a && (o(a) || "function" == typeof(t = a).readFloatLE && "function" == typeof t.slice && o(t.slice(0, 0)) || !!a._isBuffer);
            var t
        }
    }, {}],
    12: [function(a, t) {
        var e = {}.toString;
        t.exports = Array.isArray || function(a) {
            return "[object Array]" == e.call(a)
        }
    }, {}],
    13: [function(a, t, o) {
        function n(a, t, e, s, n, r) {
            var i = n,
                l = r - n,
                p = 0;
            if (a.length >= 2113929216) throw new Error("input too large");
            if (12 < a.length) {
                var c = o.compressBound(a.length);
                if (l < c) throw Error("output too small: " + l + " < " + c);
                for (var m = 67, h = a.length - 12; e + 4 < h;) {
                    var u = a[e + 1] << 8 | a[e],
                        f = a[e + 3] << 8 | a[e + 2],
                        y = Math.imul(u | f << 16, 2654435761) >>> 16,
                        S = s[y] - 1;
                    if (s[y] = e + 1, 0 > S || 0 < e - S >>> 16 || (a[S + 3] << 8 | a[S + 2]) != f || (a[S + 1] << 8 | a[S]) != u) e += m++ >> 6;
                    else {
                        m = 67;
                        var C = e - p,
                            b = e - S;
                        S += 4;
                        for (var w = e += 4; e < h && a[e] == a[S];) e++, S++;
                        var M = 15 > (w = e - w) ? w : 15;
                        if (15 <= C) {
                            t[i++] = 240 + M;
                            for (var T = C - 15; 254 < T; T -= 255) t[i++] = 255;
                            t[i++] = T
                        } else t[i++] = (C << 4) + M;
                        for (var P = 0; P < C; P++) t[i++] = a[p + P];
                        if (t[i++] = b, t[i++] = b >> 8, 15 <= w) {
                            for (w -= 15; 255 <= w;) w -= 255, t[i++] = 255;
                            t[i++] = w
                        }
                        p = e
                    }
                }
            }
            if (0 == p) return 0;
            if (15 <= (C = a.length - p)) {
                t[i++] = 240;
                for (var I = C - 15; 254 < I; I -= 255) t[i++] = 255;
                t[i++] = I
            } else t[i++] = C << 4;
            for (e = p; e < a.length;) t[i++] = a[e++];
            return i
        }
        a("cuint").UINT32, Math.imul || (Math.imul = function(a, t) {
            var e = 65535 & a,
                o = 65535 & t;
            return 0 | e * o + ((a >>> 16) * o + e * (t >>> 16) << 16)
        }), o.uncompress = function(m, t, e, g) {
            for (var f = e = e || 0, y = g = g || m.length - e, a = 0; f < y;) {
                var k = m[f++],
                    r = k >> 4;
                if (0 < r) {
                    for (var S = r + 240; 255 === S;) r += S = m[f++];
                    for (var C = f + r; f < C;) t[a++] = m[f++];
                    if (f === y) return a
                }
                var b = m[f++] | m[f++] << 8;
                if (0 == b || b > a) return -(f - 2);
                var u = 15 & k;
                for (S = u + 240; 255 === S;) u += S = m[f++];
                var w = a - b;
                for (C = a + u + 4; a < C;) t[a++] = t[w++]
            }
            return a
        };
        o.compressBound = function(e) {
            return e > 2113929216 ? 0 : 0 | e + e / 255 + 16
        }, o.compress = function(r, t, e, i) {
            for (var s = Array(65536), o = 0; 65536 > o; o++) s[o] = 0;
            return n(r, t, 0, s, e || 0, i || t.length)
        }, o.compressHC = o.compress, o.compressDependent = n
    }, {
        cuint: 5
    }],
    14: [function(a, t, o) {
        (function(n) {
            var e = a("./decoder_stream");
            o.LZ4_uncompress = function(s, t) {
                var r = [],
                    o = new e(t);
                return o.on("data", function(e) {
                    r.push(e)
                }), o.end(s), n.concat(r)
            }
        }).call(this, a("buffer").Buffer)
    }, {
        "./decoder_stream": 15,
        buffer: 3
    }],
    15: [function(d, t) {
        (function(p) {
            function e(a) {
                return this instanceof e ? void(i.call(this, a), this.options = a || {}, this.binding = this.options.useJS ? n : o, this.buffer = null, this.pos = 0, this.descriptor = null, this.state = r.MAGIC, this.notEnoughData = !1, this.descriptorStart = 0, this.streamSize = null, this.dictId = null, this.currentStreamChecksum = null, this.dataBlockSize = 0, this.skippableSize = 0) : new e(a)
            }
            var i = d("stream").Transform,
                s = d("util").inherits,
                m = d("./static"),
                a = m.utils,
                o = a.bindings,
                n = d("./binding"),
                r = m.STATES,
                l = m.SIZES;
            s(e, i), e.prototype._transform = function(a, o, e) {
                if (0 < this.skippableSize) {
                    if (this.skippableSize -= a.length, 0 < this.skippableSize) return void e();
                    a = a.slice(-this.skippableSize), this.skippableSize = 0, this.state = r.MAGIC
                }
                this.buffer = this.buffer ? p.concat([this.buffer, a], this.buffer.length + a.length) : a, this._main(e)
            }, e.prototype.emit_Error = function(e) {
                this.emit("error", new Error(e + " @" + this.pos))
            }, e.prototype.check_Size = function(a) {
                var t = this.buffer.length - this.pos;
                return 0 >= t || t < a ? (this.notEnoughData && this.emit_Error("Unexpected end of LZ4 stream"), !0) : (this.pos += a, !1)
            }, e.prototype.read_MagicNumber = function() {
                var o = this.pos;
                if (this.check_Size(l.MAGIC)) return !0;
                var t = a.readInt32LE(this.buffer, o);
                return (4294967280 & t) === m.MAGICNUMBER_SKIPPABLE ? void(this.state = r.SKIP_SIZE) : t === m.MAGICNUMBER ? void(this.state = r.DESCRIPTOR) : (this.pos = o, this.emit_Error("Invalid magic number: " + t.toString(16).toUpperCase()), !0)
            }, e.prototype.read_SkippableSize = function() {
                var e = this.pos;
                return !!this.check_Size(l.SKIP_SIZE) || void(this.state = r.SKIP_DATA, this.skippableSize = a.readInt32LE(this.buffer, e))
            }, e.prototype.read_Descriptor = function() {
                var a = this.pos;
                if (this.check_Size(l.DESCRIPTOR)) return !0;
                this.descriptorStart = a;
                var t = this.buffer[a],
                    e = t >> 6;
                if (e !== m.VERSION) return this.pos = a, this.emit_Error("Invalid version: " + e + " != " + m.VERSION), !0;
                if (1 & t >> 1) return this.pos = a, this.emit_Error("Reserved bit set"), !0;
                var n = 7 & this.buffer[a + 1] >> 4,
                    s = m.blockMaxSizes[n];
                return null === s ? (this.pos = a, this.emit_Error("Invalid block max size: " + n), !0) : void(this.descriptor = {
                    blockIndependence: !!(1 & t >> 5),
                    blockChecksum: !!(1 & t >> 4),
                    blockMaxSize: s,
                    streamSize: !!(1 & t >> 3),
                    streamChecksum: !!(1 & t >> 2),
                    dict: !!(1 & t),
                    dictId: 0
                }, this.state = r.SIZE)
            }, e.prototype.read_Size = function() {
                if (this.descriptor.streamSize) {
                    var e = this.pos;
                    if (this.check_Size(l.SIZE)) return !0;
                    this.streamSize = this.buffer.slice(e, e + 8)
                }
                this.state = r.DICTID
            }, e.prototype.read_DictId = function() {
                if (this.descriptor.dictId) {
                    var e = this.pos;
                    if (this.check_Size(l.DICTID)) return !0;
                    this.dictId = a.readInt32LE(this.buffer, e)
                }
                this.state = r.DESCRIPTOR_CHECKSUM
            }, e.prototype.read_DescriptorChecksum = function() {
                var o = this.pos;
                if (this.check_Size(l.DESCRIPTOR_CHECKSUM)) return !0;
                var t = this.buffer[o];
                return a.descriptorChecksum(this.buffer.slice(this.descriptorStart, o)) === t ? void(this.state = r.DATABLOCK_SIZE) : (this.pos = o, this.emit_Error("Invalid stream descriptor checksum"), !0)
            }, e.prototype.read_DataBlockSize = function() {
                var o = this.pos;
                if (this.check_Size(l.DATABLOCK_SIZE)) return !0;
                var t = a.readInt32LE(this.buffer, o);
                t === m.EOS ? this.state = r.EOS : (this.dataBlockSize = t, this.state = r.DATABLOCK_DATA)
            }, e.prototype.read_DataBlockData = function() {
                var a = this.pos,
                    t = this.dataBlockSize;
                return !(2147483648 & t && (t &= 2147483647), !this.check_Size(t)) || void(this.dataBlock = this.buffer.slice(a, a + t), this.state = r.DATABLOCK_CHECKSUM)
            }, e.prototype.read_DataBlockChecksum = function() {
                var o = this.pos;
                if (this.descriptor.blockChecksum) {
                    if (this.check_Size(l.DATABLOCK_CHECKSUM)) return !0;
                    var t = a.readInt32LE(this.buffer, this.pos - 4);
                    if (a.blockChecksum(this.dataBlock) !== t) return this.pos = o, this.emit_Error("Invalid block checksum"), !0
                }
                this.state = r.DATABLOCK_UNCOMPRESS
            }, e.prototype.uncompress_DataBlock = function() {
                var o;
                if (2147483648 & this.dataBlockSize) o = this.dataBlock;
                else {
                    o = new p(this.descriptor.blockMaxSize);
                    var s = this.binding.uncompress(this.dataBlock, o);
                    if (0 > s) return this.emit_Error("Invalid data block: " + -s), !0;
                    s < this.descriptor.blockMaxSize && (o = o.slice(0, s))
                }
                this.dataBlock = null, this.push(o), this.descriptor.streamChecksum && (this.currentStreamChecksum = a.streamChecksum(o, this.currentStreamChecksum)), this.state = r.DATABLOCK_SIZE
            }, e.prototype.read_EOS = function() {
                if (this.descriptor.streamChecksum) {
                    var o = this.pos;
                    if (this.check_Size(l.EOS)) return !0;
                    var t = a.readInt32LE(this.buffer, o);
                    if (t !== a.streamChecksum(null, this.currentStreamChecksum)) return this.pos = o, this.emit_Error("Invalid stream checksum: " + t.toString(16).toUpperCase()), !0
                }
                this.state = r.MAGIC
            }, e.prototype._flush = function(e) {
                this.notEnoughData = !0, this._main(e)
            }, e.prototype._main = function(a) {
                for (var t = this.pos, o; !o && this.pos < this.buffer.length;) this.state === r.MAGIC && (o = this.read_MagicNumber()), this.state === r.SKIP_SIZE && (o = this.read_SkippableSize()), this.state === r.DESCRIPTOR && (o = this.read_Descriptor()), this.state === r.SIZE && (o = this.read_Size()), this.state === r.DICTID && (o = this.read_DictId()), this.state === r.DESCRIPTOR_CHECKSUM && (o = this.read_DescriptorChecksum()), this.state === r.DATABLOCK_SIZE && (o = this.read_DataBlockSize()), this.state === r.DATABLOCK_DATA && (o = this.read_DataBlockData()), this.state === r.DATABLOCK_CHECKSUM && (o = this.read_DataBlockChecksum()), this.state === r.DATABLOCK_UNCOMPRESS && (o = this.uncompress_DataBlock()), this.state === r.EOS && (o = this.read_EOS());
                this.pos > t && (this.buffer = this.buffer.slice(this.pos), this.pos = 0), a()
            }, t.exports = e
        }).call(this, d("buffer").Buffer)
    }, {
        "./binding": 13,
        "./static": 19,
        buffer: 3,
        stream: 37,
        util: 42
    }],
    16: [function(a, t, o) {
        (function(n) {
            var e = a("./encoder_stream");
            o.LZ4_compress = function(s, t) {
                var r = [],
                    o = new e(t);
                return o.on("data", function(e) {
                    r.push(e)
                }), o.end(s), n.concat(r)
            }
        }).call(this, a("buffer").Buffer)
    }, {
        "./encoder_stream": 17,
        buffer: 3
    }],
    17: [function(p, t) {
        (function(m) {
            function g(n) {
                if (!(this instanceof g)) return new g(n);
                d.call(this, n);
                var l = n || r;
                l !== r && Object.keys(r).forEach(function(e) {
                    l.hasOwnProperty(e) || (l[e] = r[e])
                }), this.options = l, this.binding = this.options.useJS ? s : a, this.compress = l.highCompression ? this.binding.compressHC : this.binding.compress;
                var e = 0;
                e |= f.VERSION << 6, e |= (1 & l.blockIndependence) << 5, e |= (1 & l.blockChecksum) << 4, e |= (1 & l.streamSize) << 3, e |= (1 & l.streamChecksum) << 2, e |= 1 & l.dict;
                var t = f.blockMaxSizes.indexOf(l.blockMaxSize);
                if (0 > t) throw new Error("Invalid blockMaxSize: " + l.blockMaxSize);
                this.descriptor = {
                    flg: e,
                    bd: (7 & t) << 4
                }, this.buffer = [], this.length = 0, this.first = !0, this.checksum = null
            }
            var d = p("stream").Transform,
                e = p("util").inherits,
                f = p("./static"),
                i = f.utils,
                a = i.bindings,
                s = p("./binding"),
                n = f.STATES,
                l = f.SIZES,
                r = {
                    blockIndependence: !0,
                    blockChecksum: !1,
                    blockMaxSize: 4194304,
                    streamSize: !1,
                    streamChecksum: !0,
                    dict: !1,
                    dictId: 0,
                    highCompression: !1
                };
            e(g, d), g.prototype.headerSize = function() {
                var a = this.options.streamSize ? l.DESCRIPTOR : 0,
                    t = this.options.dict ? l.DICTID : 0;
                return l.MAGIC + 1 + 1 + a + t + 1
            }, g.prototype.header = function() {
                var a = this.headerSize(),
                    t = new m(a);
                this.state = n.MAGIC, t.writeInt32LE(f.MAGICNUMBER, 0, !0), this.state = n.DESCRIPTOR;
                var e = t.slice(l.MAGIC, t.length - 1);
                e.writeUInt8(this.descriptor.flg, 0, !0), e.writeUInt8(this.descriptor.bd, 1, !0);
                var s = 2;
                return this.state = n.SIZE, this.options.streamSize && (e.writeInt32LE(0, s, !0), e.writeInt32LE(this.size, s + 4, !0), s += l.SIZE), this.state = n.DICTID, this.options.dict && (e.writeInt32LE(this.dictId, s, !0), s += l.DICTID), this.state = n.DESCRIPTOR_CHECKSUM, t.writeUInt8(i.descriptorChecksum(e), l.MAGIC + s, !1), t
            }, g.prototype.update_Checksum = function(e) {
                this.state = n.CHECKSUM_UPDATE, this.options.streamChecksum && (this.checksum = i.streamChecksum(e, this.checksum))
            }, g.prototype.compress_DataBlock = function(d) {
                this.state = n.DATABLOCK_COMPRESS;
                var t = this.options.blockChecksum ? l.DATABLOCK_CHECKSUM : 0,
                    e = this.binding.compressBound(d.length),
                    s = new m(l.DATABLOCK_SIZE + e + t),
                    p = s.slice(l.DATABLOCK_SIZE, l.DATABLOCK_SIZE + e),
                    a = this.compress(d, p);
                return (this.state = n.DATABLOCK_SIZE, 0 < a && a <= this.options.blockMaxSize ? (s.writeUInt32LE(a, 0, !0), s = s.slice(0, l.DATABLOCK_SIZE + a + t)) : (s.writeInt32LE(2147483648 | d.length, 0, !0), s = s.slice(0, l.DATABLOCK_SIZE + d.length + t), d.copy(s, l.DATABLOCK_SIZE)), this.state = n.DATABLOCK_CHECKSUM, this.options.blockChecksum) && s.slice(-t).writeInt32LE(i.blockChecksum(p), 0, !0), this.update_Checksum(d), this.size += d.length, s
            }, g.prototype._transform = function(i, t, e) {
                i && (this.buffer.push(i), this.length += i.length), this.first && (this.push(this.header()), this.first = !1);
                var s = this.options.blockMaxSize;
                if (this.length < s) return e();
                for (var o = m.concat(this.buffer, this.length), a = 0, l = o.length; l >= s; l -= s, a += s) this.push(this.compress_DataBlock(o.slice(a, a + s)));
                0 < l ? (this.buffer = [o.slice(a)], this.length = this.buffer[0].length) : (this.buffer = [], this.length = 0), e()
            }, g.prototype._flush = function(a) {
                if (this.first && (this.push(this.header()), this.first = !1), 0 < this.length) {
                    var t = m.concat(this.buffer, this.length);
                    this.buffer = [], this.length = 0;
                    var e = this.compress_DataBlock(t);
                    this.push(e)
                }
                if (this.options.streamChecksum) this.state = n.CHECKSUM, (s = new m(l.EOS + l.CHECKSUM)).writeInt32LE(i.streamChecksum(null, this.checksum), l.EOS, !0);
                else var s = new m(l.EOS);
                this.state = n.EOS, s.writeInt32LE(f.EOS, 0, !0), this.push(s), a()
            }, t.exports = g
        }).call(this, p("buffer").Buffer)
    }, {
        "./binding": 13,
        "./static": 19,
        buffer: 3,
        stream: 37,
        util: 42
    }],
    18: [function(a, t) {
        t.exports = a("./static"), t.exports.version = "0.5.1", t.exports.createDecoderStream = a("./decoder_stream"), t.exports.decode = a("./decoder").LZ4_uncompress, t.exports.createEncoderStream = a("./encoder_stream"), t.exports.encode = a("./encoder").LZ4_compress;
        var e = t.exports.utils.bindings;
        t.exports.decodeBlock = e.uncompress, t.exports.encodeBound = e.compressBound, t.exports.encodeBlock = e.compress, t.exports.encodeBlockHC = e.compressHC
    }, {
        "./decoder": 14,
        "./decoder_stream": 15,
        "./encoder": 16,
        "./encoder_stream": 17,
        "./static": 19
    }],
    19: [function(a, t, o) {
        (function(t) {
            o.MAGICNUMBER = 407708164, o.MAGICNUMBER_BUFFER = new t(4), o.MAGICNUMBER_BUFFER.writeUInt32LE(o.MAGICNUMBER, 0, !1), o.EOS = 0, o.EOS_BUFFER = new t(4), o.EOS_BUFFER.writeUInt32LE(o.EOS, 0, !1), o.VERSION = 1, o.MAGICNUMBER_SKIPPABLE = 407710288, o.blockMaxSizes = [null, null, null, null, 65536, 262144, 1048576, 4194304], o.extension = ".lz4", o.STATES = {
                MAGIC: 0,
                DESCRIPTOR: 1,
                SIZE: 2,
                DICTID: 3,
                DESCRIPTOR_CHECKSUM: 4,
                DATABLOCK_SIZE: 5,
                DATABLOCK_DATA: 6,
                DATABLOCK_CHECKSUM: 7,
                DATABLOCK_UNCOMPRESS: 8,
                DATABLOCK_COMPRESS: 9,
                CHECKSUM: 10,
                CHECKSUM_UPDATE: 11,
                EOS: 90,
                SKIP_SIZE: 101,
                SKIP_DATA: 102
            }, o.SIZES = {
                MAGIC: 4,
                DESCRIPTOR: 2,
                SIZE: 8,
                DICTID: 4,
                DESCRIPTOR_CHECKSUM: 1,
                DATABLOCK_SIZE: 4,
                DATABLOCK_CHECKSUM: 4,
                CHECKSUM: 4,
                EOS: 4,
                SKIP_SIZE: 4
            }, o.utils = a("./utils")
        }).call(this, a("buffer").Buffer)
    }, {
        "./utils": 20,
        buffer: 3
    }],
    20: [function(a, t, e) {
        var o = a("xxhashjs");
        e.descriptorChecksum = function(e) {
            return 255 & o(e, 0).toNumber() >> 8
        }, e.blockChecksum = function(e) {
            return o(e, 0).toNumber()
        }, e.streamChecksum = function(a, t) {
            return null === a ? t.digest().toNumber() : (null === t && (t = o(0)), t.update(a))
        }, e.readInt32LE = function(a, t) {
            return a[t] | a[t + 1] << 8 | a[t + 2] << 16 | a[t + 3] << 24
        }, e.bindings = a("./binding")
    }, {
        "./binding": 13,
        xxhashjs: 46
    }],
    21: [function(a, o) {
        (function(l) {
            "use strict";
            o.exports = l.version && 0 !== l.version.indexOf("v0.") && (0 !== l.version.indexOf("v1.") || 0 === l.version.indexOf("v1.8.")) ? l.nextTick : function(t, e, i, s) {
                if ("function" != typeof t) throw new TypeError("\"callback\" argument must be a function");
                var o = arguments.length,
                    r, d;
                switch (o) {
                    case 0:
                    case 1:
                        return l.nextTick(t);
                    case 2:
                        return l.nextTick(function() {
                            t.call(null, e)
                        });
                    case 3:
                        return l.nextTick(function() {
                            t.call(null, e, i)
                        });
                    case 4:
                        return l.nextTick(function() {
                            t.call(null, e, i, s)
                        });
                    default:
                        for (r = Array(o - 1), d = 0; d < r.length;) r[d++] = arguments[d];
                        return l.nextTick(function() {
                            t.apply(null, r)
                        });
                }
            }
        }).call(this, a("_process"))
    }, {
        _process: 22
    }],
    22: [function(i, t) {
        function e() {
            throw new Error("setTimeout has not been defined")
        }

        function n() {
            throw new Error("clearTimeout has not been defined")
        }

        function r(o) {
            if (a === setTimeout) return setTimeout(o, 0);
            if ((a === e || !a) && setTimeout) return a = setTimeout, setTimeout(o, 0);
            try {
                return a(o, 0)
            } catch (t) {
                try {
                    return a.call(null, o, 0)
                } catch (t) {
                    return a.call(this, o, 0)
                }
            }
        }

        function l() {
            S && b && (S = !1, b.length ? k = b.concat(k) : C = -1, k.length && p())
        }

        function p() {
            if (!S) {
                var a = r(l);
                S = !0;
                for (var t = k.length; t;) {
                    for (b = k, k = []; ++C < t;) b && b[C].run();
                    C = -1, t = k.length
                }
                b = null, S = !1,
                    function(a) {
                        if (y === clearTimeout) return clearTimeout(a);
                        if ((y === n || !y) && clearTimeout) return y = clearTimeout, clearTimeout(a);
                        try {
                            y(a)
                        } catch (t) {
                            try {
                                return y.call(null, a)
                            } catch (t) {
                                return y.call(this, a)
                            }
                        }
                    }(a)
            }
        }

        function f(a, t) {
            this.fun = a, this.array = t
        }

        function m() {}
        var g = t.exports = {},
            a, y;
        ! function() {
            try {
                a = "function" == typeof setTimeout ? setTimeout : e
            } catch (o) {
                a = e
            }
            try {
                y = "function" == typeof clearTimeout ? clearTimeout : n
            } catch (e) {
                y = n
            }
        }();
        var k = [],
            S = !1,
            C = -1,
            b;
        g.nextTick = function(a) {
            var t = Array(arguments.length - 1);
            if (1 < arguments.length)
                for (var e = 1; e < arguments.length; e++) t[e - 1] = arguments[e];
            k.push(new f(a, t)), 1 !== k.length || S || r(p)
        }, f.prototype.run = function() {
            this.fun.apply(null, this.array)
        }, g.title = "browser", g.browser = !0, g.env = {}, g.argv = [], g.version = "", g.versions = {}, g.on = m, g.addListener = m, g.once = m, g.off = m, g.removeListener = m, g.removeAllListeners = m, g.emit = m, g.prependListener = m, g.prependOnceListener = m, g.listeners = function() {
            return []
        }, g.binding = function() {
            throw new Error("process.binding is not supported")
        }, g.cwd = function() {
            return "/"
        }, g.chdir = function() {
            throw new Error("process.chdir is not supported")
        }, g.umask = function() {
            return 0
        }
    }, {}],
    23: [function(a, t) {
        t.exports = a("./lib/_stream_duplex.js")
    }, {
        "./lib/_stream_duplex.js": 24
    }],
    24: [function(i, t) {
        "use strict";

        function e(o) {
            return this instanceof e ? void(a.call(this, o), n.call(this, o), o && !1 === o.readable && (this.readable = !1), o && !1 === o.writable && (this.writable = !1), this.allowHalfOpen = !0, o && !1 === o.allowHalfOpen && (this.allowHalfOpen = !1), this.once("end", m)) : new e(o)
        }

        function m() {
            this.allowHalfOpen || this._writableState.ended || p(d, this)
        }

        function d(e) {
            e.end()
        }
        var p = i("process-nextick-args"),
            s = Object.keys || function(a) {
                var t = [];
                for (var e in a) t.push(e);
                return t
            };
        t.exports = e;
        var o = i("core-util-is");
        o.inherits = i("inherits");
        var a = i("./_stream_readable"),
            n = i("./_stream_writable");
        o.inherits(e, a);
        for (var r = s(n.prototype), l = 0, u; l < r.length; l++) u = r[l], e.prototype[u] || (e.prototype[u] = n.prototype[u]);
        Object.defineProperty(e.prototype, "destroyed", {
            get: function() {
                return void 0 !== this._readableState && void 0 !== this._writableState && this._readableState.destroyed && this._writableState.destroyed
            },
            set: function(e) {
                void 0 !== this._readableState && void 0 !== this._writableState && (this._readableState.destroyed = e, this._writableState.destroyed = e)
            }
        }), e.prototype._destroy = function(a, t) {
            this.push(null), this.end(), p(t, a)
        }
    }, {
        "./_stream_readable": 26,
        "./_stream_writable": 28,
        "core-util-is": 4,
        inherits: 10,
        "process-nextick-args": 21
    }],
    25: [function(n, t) {
        "use strict";

        function e(o) {
            return this instanceof e ? void a.call(this, o) : new e(o)
        }
        t.exports = e;
        var a = n("./_stream_transform"),
            s = n("core-util-is");
        s.inherits = n("inherits"), s.inherits(e, a), e.prototype._transform = function(a, t, e) {
            e(null, a)
        }
    }, {
        "./_stream_transform": 27,
        "core-util-is": 4,
        inherits: 10
    }],
    26: [function(S, t) {
        (function(R, e) {
            "use strict";

            function s(t, a) {
                n = n || S("./_stream_duplex"), t = t || {}, this.objectMode = !!t.objectMode, a instanceof n && (this.objectMode = this.objectMode || !!t.readableObjectMode);
                var r = t.highWaterMark,
                    s = this.objectMode ? 16 : 16384;
                this.highWaterMark = r || 0 === r ? r : s, this.highWaterMark = Math.floor(this.highWaterMark), this.buffer = new d, this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.resumeScheduled = !1, this.destroyed = !1, this.defaultEncoding = t.defaultEncoding || "utf8", this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, t.encoding && (u || (u = S("string_decoder/").StringDecoder), this.decoder = new u(t.encoding), this.encoding = t.encoding)
            }

            function i(t) {
                return (n = n || S("./_stream_duplex"), !(this instanceof i)) ? new i(t) : void(this._readableState = new s(t, this), this.readable = !0, t && ("function" == typeof t.read && (this._read = t.read), "function" == typeof t.destroy && (this._destroy = t.destroy)), r.call(this))
            }

            function k(d, t, p, i, s) {
                var o = d._readableState,
                    c, m, h;
                return null === t ? (o.reading = !1, function(a, t) {
                    if (!t.ended) {
                        if (t.decoder) {
                            var e = t.decoder.end();
                            e && e.length && (t.buffer.push(e), t.length += t.objectMode ? 1 : e.length)
                        }
                        t.ended = !0, w(a)
                    }
                }(d, o)) : (s || (c = function(a, t) {
                    var e;
                    o = t, O.isBuffer(o) || o instanceof l || "string" == typeof t || void 0 === t || a.objectMode || (e = new TypeError("Invalid non-string/buffer chunk"));
                    var o;
                    return e
                }(o, t)), c ? d.emit("error", c) : o.objectMode || t && 0 < t.length ? ("string" == typeof t || o.objectMode || Object.getPrototypeOf(t) === O.prototype || (m = t, t = O.from(m)), i ? o.endEmitted ? d.emit("error", new Error("stream.unshift() after end event")) : C(d, o, t, !0) : o.ended ? d.emit("error", new Error("stream.push() after EOF")) : (o.reading = !1, o.decoder && !p ? (t = o.decoder.write(t), o.objectMode || 0 !== t.length ? C(d, o, t, !1) : v(d, o)) : C(d, o, t, !1))) : i || (o.reading = !1)), !(h = o).ended && (h.needReadable || h.length < h.highWaterMark || 0 === h.length)
            }

            function C(a, t, e, o) {
                t.flowing && 0 === t.length && !t.sync ? (a.emit("data", e), a.read(0)) : (t.length += t.objectMode ? 1 : e.length, o ? t.buffer.unshift(e) : t.buffer.push(e), t.needReadable && w(a)), v(a, t)
            }

            function b(a, t) {
                return 0 >= a || 0 === t.length && t.ended ? 0 : t.objectMode ? 1 : a == a ? (a > t.highWaterMark && (t.highWaterMark = ((e = a) >= 8388608 ? e = 8388608 : (e--, e |= e >>> 1, e |= e >>> 2, e |= e >>> 4, e |= e >>> 8, e |= e >>> 16, e++), e)), a <= t.length ? a : t.ended ? t.length : (t.needReadable = !0, 0)) : t.flowing && t.length ? t.buffer.head.data.length : t.length;
                var e
            }

            function w(a) {
                var t = a._readableState;
                t.needReadable = !1, t.emittedReadable || (F("emitReadable", t.flowing), t.emittedReadable = !0, t.sync ? U(M, a) : M(a))
            }

            function M(e) {
                F("emit readable"), e.emit("readable"), P(e)
            }

            function v(a, t) {
                t.readingMore || (t.readingMore = !0, U(x, a, t))
            }

            function x(a, t) {
                for (var e = t.length; !t.reading && !t.flowing && !t.ended && t.length < t.highWaterMark && (F("maybeReadMore read 0"), a.read(0), e !== t.length);) e = t.length;
                t.readingMore = !1
            }

            function _(e) {
                F("readable nexttick read 0"), e.read(0)
            }

            function T(a, t) {
                t.reading || (F("resume read 0"), a.read(0)), t.resumeScheduled = !1, t.awaitDrain = 0, a.emit("resume"), P(a), t.flowing && !t.reading && a.read(0)
            }

            function P(a) {
                var t = a._readableState;
                for (F("flow", t.flowing); t.flowing && null !== a.read(););
            }

            function A(a, t) {
                return 0 === t.length ? null : (t.objectMode ? e = t.buffer.shift() : !a || a >= t.length ? (e = t.decoder ? t.buffer.join("") : 1 === t.buffer.length ? t.buffer.head.data : t.buffer.concat(t.length), t.buffer.clear()) : e = function(a, t, e) {
                    var o;
                    return a < t.head.data.length ? (o = t.head.data.slice(0, a), t.head.data = t.head.data.slice(a)) : o = a === t.head.data.length ? t.shift() : e ? function(r, l) {
                        var e = l.head,
                            d = 1,
                            p = e.data;
                        for (r -= p.length; e = e.next;) {
                            var c = e.data,
                                a = r > c.length ? c.length : r;
                            if (p += a === c.length ? c : c.slice(0, r), 0 === (r -= a)) {
                                a === c.length ? (++d, l.head = e.next ? e.next : l.tail = null) : (l.head = e, e.data = c.slice(a));
                                break
                            }++d
                        }
                        return l.length -= d, p
                    }(a, t) : function(r, l) {
                        var e = O.allocUnsafe(r),
                            i = l.head,
                            d = 1;
                        for (i.data.copy(e), r -= i.data.length; i = i.next;) {
                            var p = i.data,
                                a = r > p.length ? p.length : r;
                            if (p.copy(e, e.length - r, 0, a), 0 === (r -= a)) {
                                a === p.length ? (++d, l.head = i.next ? i.next : l.tail = null) : (l.head = i, i.data = p.slice(a));
                                break
                            }++d
                        }
                        return l.length -= d, e
                    }(a, t), o
                }(a, t.buffer, t.decoder), e);
                var e
            }

            function B(a) {
                var t = a._readableState;
                if (0 < t.length) throw new Error("\"endReadable()\" called on non-empty stream");
                t.endEmitted || (t.ended = !0, U(D, t, a))
            }

            function D(a, t) {
                a.endEmitted || 0 !== a.length || (a.endEmitted = !0, t.readable = !1, t.emit("end"))
            }

            function I(a, t) {
                for (var e = 0, o = a.length; e < o; e++)
                    if (a[e] === t) return e;
                return -1
            }
            var U = S("process-nextick-args");
            t.exports = i;
            var o = S("isarray"),
                n;
            i.ReadableState = s, S("events").EventEmitter;
            var L = function(a, t) {
                    return a.listeners(t).length
                },
                r = S("./internal/streams/stream"),
                O = S("safe-buffer").Buffer,
                l = e.Uint8Array || function() {},
                c = S("core-util-is");
            c.inherits = S("inherits");
            var h = S("util"),
                F;
            F = h && h.debuglog ? h.debuglog("stream") : function() {};
            var d = S("./internal/streams/BufferList"),
                m = S("./internal/streams/destroy"),
                u;
            c.inherits(i, r);
            var g = ["error", "close", "destroy", "pause", "resume"];
            Object.defineProperty(i.prototype, "destroyed", {
                get: function() {
                    return void 0 !== this._readableState && this._readableState.destroyed
                },
                set: function(e) {
                    this._readableState && (this._readableState.destroyed = e)
                }
            }), i.prototype.destroy = m.destroy, i.prototype._undestroy = m.undestroy, i.prototype._destroy = function(a, t) {
                this.push(null), t(a)
            }, i.prototype.push = function(a, o) {
                var n = this._readableState,
                    s;
                return n.objectMode ? s = !0 : "string" == typeof a && ((o = o || n.defaultEncoding) !== n.encoding && (a = O.from(a, o), o = ""), s = !0), k(this, a, o, !1, s)
            }, i.prototype.unshift = function(e) {
                return k(this, e, null, !0, !1)
            }, i.prototype.isPaused = function() {
                return !1 === this._readableState.flowing
            }, i.prototype.setEncoding = function(t) {
                return u || (u = S("string_decoder/").StringDecoder), this._readableState.decoder = new u(t), this._readableState.encoding = t, this
            };
            i.prototype.read = function(a) {
                F("read", a), a = parseInt(a, 10);
                var n = this._readableState,
                    e = a;
                if (0 !== a && (n.emittedReadable = !1), 0 === a && n.needReadable && (n.length >= n.highWaterMark || n.ended)) return F("read: emitReadable", n.length, n.ended), 0 === n.length && n.ended ? B(this) : w(this), null;
                if (0 === (a = b(a, n)) && n.ended) return 0 === n.length && B(this), null;
                var r = n.needReadable,
                    i;
                return F("need readable", r), (0 === n.length || n.length - a < n.highWaterMark) && F("length less than watermark", r = !0), n.ended || n.reading ? F("reading or ended", r = !1) : r && (F("do read"), n.reading = !0, n.sync = !0, 0 === n.length && (n.needReadable = !0), this._read(n.highWaterMark), n.sync = !1, n.reading || (a = b(e, n))), null === (i = 0 < a ? A(a, n) : null) ? (n.needReadable = !0, a = 0) : n.length -= a, 0 === n.length && (n.ended || (n.needReadable = !0), e !== a && n.ended && B(this)), null !== i && this.emit("data", i), i
            }, i.prototype._read = function() {
                this.emit("error", new Error("_read() is not implemented"))
            }, i.prototype.pipe = function(n, t) {
                function r(t, e) {
                    F("onunpipe"), t === S && e && !1 === e.hasUnpiped && (e.hasUnpiped = !0, F("cleanup"), n.removeListener("close", g), n.removeListener("finish", y), n.removeListener("drain", a), n.removeListener("error", h), n.removeListener("unpipe", r), S.removeListener("end", p), S.removeListener("end", k), S.removeListener("data", c), l = !0, !s.awaitDrain || n._writableState && !n._writableState.needDrain || a())
                }

                function p() {
                    F("onend"), n.end()
                }

                function c(t) {
                    F("ondata"), d = !1, !1 !== n.write(t) || d || ((1 === s.pipesCount && s.pipes === n || 1 < s.pipesCount && -1 !== I(s.pipes, n)) && !l && (F("false write response, pause", S._readableState.awaitDrain), S._readableState.awaitDrain++, d = !0), S.pause())
                }

                function h(t) {
                    F("onerror", t), k(), n.removeListener("error", h), 0 === L(n, "error") && n.emit("error", t)
                }

                function g() {
                    n.removeListener("finish", y), k()
                }

                function y() {
                    F("onfinish"), n.removeListener("close", g), k()
                }

                function k() {
                    F("unpipe"), S.unpipe(n)
                }
                var S = this,
                    s = this._readableState;
                switch (s.pipesCount) {
                    case 0:
                        s.pipes = n;
                        break;
                    case 1:
                        s.pipes = [s.pipes, n];
                        break;
                    default:
                        s.pipes.push(n);
                }
                s.pipesCount += 1, F("pipe count=%d opts=%j", s.pipesCount, t);
                var e = t && !1 === t.end || n === R.stdout || n === R.stderr ? k : p;
                s.endEmitted ? U(e) : S.once("end", e), n.on("unpipe", r);
                var a = (i = S, function() {
                        var e = i._readableState;
                        F("pipeOnDrain", e.awaitDrain), e.awaitDrain && e.awaitDrain--, 0 === e.awaitDrain && L(i, "data") && (e.flowing = !0, P(i))
                    }),
                    i;
                n.on("drain", a);
                var l = !1,
                    d = !1;
                return S.on("data", c),
                    function(a, t, e) {
                        return "function" == typeof a.prependListener ? a.prependListener(t, e) : void(a._events && a._events[t] ? o(a._events[t]) ? a._events[t].unshift(e) : a._events[t] = [e, a._events[t]] : a.on(t, e))
                    }(n, "error", h), n.once("close", g), n.once("finish", y), n.emit("pipe", S), s.flowing || (F("pipe resume"), S.resume()), n
            }, i.prototype.unpipe = function(r) {
                var l = this._readableState,
                    e = {
                        hasUnpiped: !1
                    };
                if (0 === l.pipesCount) return this;
                if (1 === l.pipesCount) return r && r !== l.pipes ? this : (r || (r = l.pipes), l.pipes = null, l.pipesCount = 0, l.flowing = !1, r && r.emit("unpipe", this, e), this);
                if (!r) {
                    var i = l.pipes,
                        s = l.pipesCount;
                    l.pipes = null, l.pipesCount = 0, l.flowing = !1;
                    for (var o = 0; o < s; o++) i[o].emit("unpipe", this, e);
                    return this
                }
                var d = I(l.pipes, r);
                return -1 === d ? this : (l.pipes.splice(d, 1), l.pipesCount -= 1, 1 === l.pipesCount && (l.pipes = l.pipes[0]), r.emit("unpipe", this, e), this)
            }, i.prototype.on = function(a, t) {
                var e = r.prototype.on.call(this, a, t);
                if ("data" === a) !1 !== this._readableState.flowing && this.resume();
                else if ("readable" === a) {
                    var o = this._readableState;
                    o.endEmitted || o.readableListening || (o.readableListening = o.needReadable = !0, o.emittedReadable = !1, o.reading ? o.length && w(this) : U(_, this))
                }
                return e
            }, i.prototype.addListener = i.prototype.on, i.prototype.resume = function() {
                var a = this._readableState,
                    o, s;
                return a.flowing || (F("resume"), a.flowing = !0, o = this, (s = a).resumeScheduled || (s.resumeScheduled = !0, U(T, o, s))), this
            }, i.prototype.pause = function() {
                return F("call pause flowing=%j", this._readableState.flowing), !1 !== this._readableState.flowing && (F("pause"), this._readableState.flowing = !1, this.emit("pause")), this
            }, i.prototype.wrap = function(n) {
                var r = this._readableState,
                    t = !1,
                    e = this;
                for (var s in n.on("end", function() {
                        if (F("wrapped end"), r.decoder && !r.ended) {
                            var a = r.decoder.end();
                            a && a.length && e.push(a)
                        }
                        e.push(null)
                    }), n.on("data", function(a) {
                        (F("wrapped data"), r.decoder && (a = r.decoder.write(a)), r.objectMode && null == a) || (r.objectMode || a && a.length) && (e.push(a) || (t = !0, n.pause()))
                    }), n) void 0 === this[s] && "function" == typeof n[s] && (this[s] = function(t) {
                    return function() {
                        return n[t].apply(n, arguments)
                    }
                }(s));
                for (var o = 0; o < g.length; o++) n.on(g[o], e.emit.bind(e, g[o]));
                return e._read = function(a) {
                    F("wrapped _read", a), t && (t = !1, n.resume())
                }, e
            }, i._fromList = A
        }).call(this, S("_process"), "undefined" == typeof global ? "undefined" == typeof self ? "undefined" == typeof window ? {} : window : self : global)
    }, {
        "./_stream_duplex": 24,
        "./internal/streams/BufferList": 29,
        "./internal/streams/destroy": 30,
        "./internal/streams/stream": 31,
        _process: 22,
        "core-util-is": 4,
        events: 8,
        inherits: 10,
        isarray: 12,
        "process-nextick-args": 21,
        "safe-buffer": 36,
        "string_decoder/": 38,
        util: 2
    }],
    27: [function(i, t) {
        "use strict";

        function l(a) {
            this.afterTransform = function(t, e) {
                return function(n, t, e) {
                    var r = n._transformState;
                    r.transforming = !1;
                    var s = r.writecb;
                    if (!s) return n.emit("error", new Error("write callback called multiple times"));
                    r.writechunk = null, r.writecb = null, null != e && n.push(e), s(t);
                    var o = n._readableState;
                    o.reading = !1, (o.needReadable || o.length < o.highWaterMark) && n._read(o.highWaterMark)
                }(a, t, e)
            }, this.needTransform = !1, this.transforming = !1, this.writecb = null, this.writechunk = null, this.writeencoding = null
        }

        function a(o) {
            if (!(this instanceof a)) return new a(o);
            r.call(this, o), this._transformState = new l(this);
            var s = this;
            this._readableState.needReadable = !0, this._readableState.sync = !1, o && ("function" == typeof o.transform && (this._transform = o.transform), "function" == typeof o.flush && (this._flush = o.flush)), this.once("prefinish", function() {
                "function" == typeof this._flush ? this._flush(function(e, t) {
                    n(s, e, t)
                }) : n(s)
            })
        }

        function n(a, t, e) {
            if (t) return a.emit("error", t);
            null != e && a.push(e);
            var n = a._writableState,
                s = a._transformState;
            if (n.length) throw new Error("Calling transform done when ws.length != 0");
            if (s.transforming) throw new Error("Calling transform done when still transforming");
            return a.push(null)
        }
        t.exports = a;
        var r = i("./_stream_duplex"),
            e = i("core-util-is");
        e.inherits = i("inherits"), e.inherits(a, r), a.prototype.push = function(a, t) {
            return this._transformState.needTransform = !1, r.prototype.push.call(this, a, t)
        }, a.prototype._transform = function() {
            throw new Error("_transform() is not implemented")
        }, a.prototype._write = function(a, t, e) {
            var n = this._transformState;
            if (n.writecb = e, n.writechunk = a, n.writeencoding = t, !n.transforming) {
                var s = this._readableState;
                (n.needTransform || s.needReadable || s.length < s.highWaterMark) && this._read(s.highWaterMark)
            }
        }, a.prototype._read = function() {
            var t = this._transformState;
            null !== t.writechunk && t.writecb && !t.transforming ? (t.transforming = !0, this._transform(t.writechunk, t.writeencoding, t.afterTransform)) : t.needTransform = !0
        }, a.prototype._destroy = function(a, o) {
            var e = this;
            r.prototype._destroy.call(this, a, function(a) {
                o(a), e.emit("close")
            })
        }
    }, {
        "./_stream_duplex": 24,
        "core-util-is": 4,
        inherits: 10
    }],
    28: [function(M, t) {
        (function(e, i) {
            "use strict";

            function x(a) {
                var t = this;
                this.next = null, this.entry = null, this.finish = function() {
                    ! function(a, t, e) {
                        var n = a.entry;
                        for (a.entry = null; n;) {
                            var r = n.callback;
                            t.pendingcb--, r(e), n = n.next
                        }
                        t.corkedRequestsFree ? t.corkedRequestsFree.next = a : t.corkedRequestsFree = a
                    }(t, a)
                }
            }

            function _() {}

            function a(t, a) {
                r = r || M("./_stream_duplex"), t = t || {}, this.objectMode = !!t.objectMode, a instanceof r && (this.objectMode = this.objectMode || !!t.writableObjectMode);
                var n = t.highWaterMark,
                    s = this.objectMode ? 16 : 16384;
                this.highWaterMark = n || 0 === n ? n : s, this.highWaterMark = Math.floor(this.highWaterMark), this.finalCalled = !1, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1, this.destroyed = !1;
                var i = !1 === t.decodeStrings;
                this.decodeStrings = !i, this.defaultEncoding = t.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, this.onwrite = function(e) {
                    ! function(r, t) {
                        var e = r._writableState,
                            i = e.sync,
                            s = e.writecb;
                        if (M = e, M.writing = !1, M.writecb = null, M.length -= M.writelen, M.writelen = 0, t) n = r, m = e, f = i, C = t, b = s, --m.pendingcb, f ? (w(b, C), w(S, n, m), n._writableState.errorEmitted = !0, n.emit("error", C)) : (b(C), n._writableState.errorEmitted = !0, n.emit("error", C), S(n, m));
                        else {
                            var a = k(e);
                            a || e.corked || e.bufferProcessing || !e.bufferedRequest || y(r, e), i ? o(g, r, e, a, s) : g(r, e, a, s)
                        }
                        var n, m, f, C, b, M
                    }(a, e)
                }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished = !1, this.errorEmitted = !1, this.bufferedRequestCount = 0, this.corkedRequestsFree = new x(this)
            }

            function s(t) {
                return (r = r || M("./_stream_duplex"), !(c.call(s, this) || this instanceof r)) ? new s(t) : void(this._writableState = new a(t, this), this.writable = !0, t && ("function" == typeof t.write && (this._write = t.write), "function" == typeof t.writev && (this._writev = t.writev), "function" == typeof t.destroy && (this._destroy = t.destroy), "function" == typeof t.final && (this._final = t.final)), h.call(this))
            }

            function m(r, t, e, i, s, o, a) {
                t.writelen = i, t.writecb = a, t.writing = !0, t.sync = !0, e ? r._writev(s, t.onwrite) : r._write(s, o, t.onwrite), t.sync = !1
            }

            function g(n, t, e, r) {
                var s, i;
                e || (s = n, 0 === (i = t).length && i.needDrain && (i.needDrain = !1, s.emit("drain"))), t.pendingcb--, r(), S(n, t)
            }

            function y(a, t) {
                t.bufferProcessing = !0;
                var e = t.bufferedRequest;
                if (a._writev && e && e.next) {
                    var d = t.bufferedRequestCount,
                        s = Array(d),
                        o = t.corkedRequestsFree;
                    o.entry = e;
                    for (var n = 0, p = !0; e;) s[n] = e, e.isBuf || (p = !1), e = e.next, n += 1;
                    s.allBuffers = p, m(a, t, !0, t.length, s, "", o.finish), t.pendingcb++, t.lastBufferedRequest = null, o.next ? (t.corkedRequestsFree = o.next, o.next = null) : t.corkedRequestsFree = new x(t)
                } else {
                    for (; e;) {
                        var g = e.chunk,
                            h = e.encoding,
                            c = e.callback;
                        if (m(a, t, !1, t.objectMode ? 1 : g.length, g, h, c), e = e.next, t.writing) break
                    }
                    null === e && (t.lastBufferedRequest = null)
                }
                t.bufferedRequestCount = 0, t.bufferedRequest = e, t.bufferProcessing = !1
            }

            function k(e) {
                return e.ending && 0 === e.length && null === e.bufferedRequest && !e.finished && !e.writing
            }

            function C(a, t) {
                a._final(function(e) {
                    t.pendingcb--, e && a.emit("error", e), t.prefinished = !0, a.emit("prefinish"), S(a, t)
                })
            }

            function S(o, t) {
                var e = k(t),
                    a, n;
                return e && (a = o, (n = t).prefinished || n.finalCalled || ("function" == typeof a._final ? (n.pendingcb++, n.finalCalled = !0, w(C, a, n)) : (n.prefinished = !0, a.emit("prefinish"))), 0 === t.pendingcb && (t.finished = !0, o.emit("finish"))), e
            }
            var w = M("process-nextick-args");
            t.exports = s;
            var o = !e.browser && -1 < ["v0.10", "v0.9."].indexOf(e.version.slice(0, 5)) ? setImmediate : w,
                r;
            s.WritableState = a;
            var b = M("core-util-is");
            b.inherits = M("inherits");
            var l = {
                    deprecate: M("util-deprecate")
                },
                h = M("./internal/streams/stream"),
                T = M("safe-buffer").Buffer,
                u = i.Uint8Array || function() {},
                d = M("./internal/streams/destroy"),
                c;
            b.inherits(s, h), a.prototype.getBuffer = function() {
                    for (var a = this.bufferedRequest, o = []; a;) o.push(a), a = a.next;
                    return o
                },
                function() {
                    try {
                        Object.defineProperty(a.prototype, "buffer", {
                            get: l.deprecate(function() {
                                return this.getBuffer()
                            }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
                        })
                    } catch (e) {}
                }(), "function" == typeof Symbol && Symbol.hasInstance && "function" == typeof Function.prototype[Symbol.hasInstance] ? (c = Function.prototype[Symbol.hasInstance], Object.defineProperty(s, Symbol.hasInstance, {
                    value: function(e) {
                        return !!c.call(this, e) || e && e._writableState instanceof a
                    }
                })) : c = function(e) {
                    return e instanceof this
                }, s.prototype.pipe = function() {
                    this.emit("error", new Error("Cannot pipe, not readable"))
                }, s.prototype.write = function(o, d, k) {
                    var S = this._writableState,
                        C = !1,
                        M = (b = o, (T.isBuffer(b) || b instanceof u) && !S.objectMode),
                        b, x, P, I, D, B, U, A, R, L, O;
                    return M && !T.isBuffer(o) && (x = o, o = T.from(x)), "function" == typeof d && (k = d, d = null), M ? d = "buffer" : d || (d = S.defaultEncoding), "function" != typeof k && (k = _), S.ended ? (R = this, L = k, O = new Error("write after end"), R.emit("error", O), w(L, O)) : (M || (P = this, I = S, B = k, U = !0, A = !1, null === (D = o) ? A = new TypeError("May not write null values to stream") : "string" == typeof D || void 0 === D || I.objectMode || (A = new TypeError("Invalid non-string/buffer chunk")), A && (P.emit("error", A), w(B, A), U = !1), U)) && (S.pendingcb++, C = function(d, t, e, p, c, u) {
                        if (!e) {
                            var a = function(a, t, o) {
                                return a.objectMode || !1 === a.decodeStrings || "string" != typeof t || (t = T.from(t, o)), t
                            }(t, p, c);
                            p !== a && (e = !0, c = "buffer", p = a)
                        }
                        var n = t.objectMode ? 1 : p.length;
                        t.length += n;
                        var r = t.length < t.highWaterMark;
                        if (r || (t.needDrain = !0), t.writing || t.corked) {
                            var l = t.lastBufferedRequest;
                            t.lastBufferedRequest = {
                                chunk: p,
                                encoding: c,
                                isBuf: e,
                                callback: u,
                                next: null
                            }, l ? l.next = t.lastBufferedRequest : t.bufferedRequest = t.lastBufferedRequest, t.bufferedRequestCount += 1
                        } else m(d, t, !1, n, p, c, u);
                        return r
                    }(this, S, M, o, d, k)), C
                }, s.prototype.cork = function() {
                    this._writableState.corked++
                }, s.prototype.uncork = function() {
                    var e = this._writableState;
                    e.corked && (e.corked--, e.writing || e.corked || e.finished || e.bufferProcessing || !e.bufferedRequest || y(this, e))
                }, s.prototype.setDefaultEncoding = function(e) {
                    if ("string" == typeof e && (e = e.toLowerCase()), !(-1 < ["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((e + "").toLowerCase()))) throw new TypeError("Unknown encoding: " + e);
                    return this._writableState.defaultEncoding = e, this
                }, s.prototype._write = function(a, t, e) {
                    e(new Error("_write() is not implemented"))
                }, s.prototype._writev = null, s.prototype.end = function(a, o, n) {
                    var r = this._writableState;
                    "function" == typeof a ? (n = a, a = null, o = null) : "function" == typeof o && (n = o, o = null), null != a && this.write(a, o), r.corked && (r.corked = 1, this.uncork()), r.ending || r.finished || function(a, t, e) {
                        t.ending = !0, S(a, t), e && (t.finished ? w(e) : a.once("finish", e)), t.ended = !0, a.writable = !1
                    }(this, r, n)
                }, Object.defineProperty(s.prototype, "destroyed", {
                    get: function() {
                        return void 0 !== this._writableState && this._writableState.destroyed
                    },
                    set: function(e) {
                        this._writableState && (this._writableState.destroyed = e)
                    }
                }), s.prototype.destroy = d.destroy, s.prototype._undestroy = d.undestroy, s.prototype._destroy = function(a, t) {
                    this.end(), t(a)
                }
        }).call(this, M("_process"), "undefined" == typeof global ? "undefined" == typeof self ? "undefined" == typeof window ? {} : window : self : global)
    }, {
        "./_stream_duplex": 24,
        "./internal/streams/destroy": 30,
        "./internal/streams/stream": 31,
        _process: 22,
        "core-util-is": 4,
        inherits: 10,
        "process-nextick-args": 21,
        "safe-buffer": 36,
        "util-deprecate": 39
    }],
    29: [function(a, t) {
        "use strict";
        var l = a("safe-buffer").Buffer;
        t.exports = function() {
            function e() {
                ! function(a, t) {
                    if (!(a instanceof t)) throw new TypeError("Cannot call a class as a function")
                }(this, e), this.head = null, this.tail = null, this.length = 0
            }
            return e.prototype.push = function(a) {
                var t = {
                    data: a,
                    next: null
                };
                0 < this.length ? this.tail.next = t : this.head = t, this.tail = t, ++this.length
            }, e.prototype.unshift = function(a) {
                var t = {
                    data: a,
                    next: this.head
                };
                0 === this.length && (this.tail = t), this.head = t, ++this.length
            }, e.prototype.shift = function() {
                if (0 !== this.length) {
                    var e = this.head.data;
                    return this.head = 1 === this.length ? this.tail = null : this.head.next, --this.length, e
                }
            }, e.prototype.clear = function() {
                this.head = this.tail = null, this.length = 0
            }, e.prototype.join = function(a) {
                if (0 === this.length) return "";
                for (var t = this.head, o = "" + t.data; t = t.next;) o += a + t.data;
                return o
            }, e.prototype.concat = function(s) {
                if (0 === this.length) return l.alloc(0);
                if (1 === this.length) return this.head.data;
                for (var t = l.allocUnsafe(s >>> 0), a = this.head, d = 0, p, c, m; a;) p = a.data, c = t, m = d, p.copy(c, m), d += a.data.length, a = a.next;
                return t
            }, e
        }()
    }, {
        "safe-buffer": 36
    }],
    30: [function(a, t) {
        "use strict";

        function r(a, t) {
            a.emit("error", t)
        }
        var o = a("process-nextick-args");
        t.exports = {
            destroy: function(s, l) {
                var e = this,
                    t = this._readableState && this._readableState.destroyed,
                    a = this._writableState && this._writableState.destroyed;
                t || a ? l ? l(s) : !s || this._writableState && this._writableState.errorEmitted || o(r, this, s) : (this._readableState && (this._readableState.destroyed = !0), this._writableState && (this._writableState.destroyed = !0), this._destroy(s || null, function(a) {
                    !l && a ? (o(r, e, a), e._writableState && (e._writableState.errorEmitted = !0)) : l && l(a)
                }))
            },
            undestroy: function() {
                this._readableState && (this._readableState.destroyed = !1, this._readableState.reading = !1, this._readableState.ended = !1, this._readableState.endEmitted = !1), this._writableState && (this._writableState.destroyed = !1, this._writableState.ended = !1, this._writableState.ending = !1, this._writableState.finished = !1, this._writableState.errorEmitted = !1)
            }
        }
    }, {
        "process-nextick-args": 21
    }],
    31: [function(a, t) {
        t.exports = a("events").EventEmitter
    }, {
        events: 8
    }],
    32: [function(a, t) {
        t.exports = a("./readable").PassThrough
    }, {
        "./readable": 33
    }],
    33: [function(a, t, e) {
        (e = t.exports = a("./lib/_stream_readable.js")).Stream = e, e.Readable = e, e.Writable = a("./lib/_stream_writable.js"), e.Duplex = a("./lib/_stream_duplex.js"), e.Transform = a("./lib/_stream_transform.js"), e.PassThrough = a("./lib/_stream_passthrough.js")
    }, {
        "./lib/_stream_duplex.js": 24,
        "./lib/_stream_passthrough.js": 25,
        "./lib/_stream_readable.js": 26,
        "./lib/_stream_transform.js": 27,
        "./lib/_stream_writable.js": 28
    }],
    34: [function(a, t) {
        t.exports = a("./readable").Transform
    }, {
        "./readable": 33
    }],
    35: [function(a, t) {
        t.exports = a("./lib/_stream_writable.js")
    }, {
        "./lib/_stream_writable.js": 28
    }],
    36: [function(r, t, e) {
        function i(a, t) {
            for (var e in a) t[e] = a[e]
        }

        function a(a, t, e) {
            return l(a, t, e)
        }
        var n = r("buffer"),
            l = n.Buffer;
        l.from && l.alloc && l.allocUnsafe && l.allocUnsafeSlow ? t.exports = n : (i(n, e), e.Buffer = a), i(l, a), a.from = function(a, t, e) {
            if ("number" == typeof a) throw new TypeError("Argument must not be a number");
            return l(a, t, e)
        }, a.alloc = function(a, t, e) {
            if ("number" != typeof a) throw new TypeError("Argument must be a number");
            var o = l(a);
            return void 0 === t ? o.fill(0) : "string" == typeof e ? o.fill(t, e) : o.fill(t), o
        }, a.allocUnsafe = function(e) {
            if ("number" != typeof e) throw new TypeError("Argument must be a number");
            return l(e)
        }, a.allocUnsafeSlow = function(e) {
            if ("number" != typeof e) throw new TypeError("Argument must be a number");
            return n.SlowBuffer(e)
        }
    }, {
        buffer: 3
    }],
    37: [function(a, t) {
        function e() {
            o.call(this)
        }
        t.exports = e;
        var o = a("events").EventEmitter;
        a("inherits")(e, o), e.Readable = a("readable-stream/readable.js"), e.Writable = a("readable-stream/writable.js"), e.Duplex = a("readable-stream/duplex.js"), e.Transform = a("readable-stream/transform.js"), e.PassThrough = a("readable-stream/passthrough.js"), e.Stream = e, e.prototype.pipe = function(s, t) {
            function e(t) {
                s.writable && !1 === s.write(t) && c.pause && c.pause()
            }

            function d() {
                c.readable && c.resume && c.resume()
            }

            function a() {
                i || (i = !0, s.end())
            }

            function r() {
                i || (i = !0, "function" == typeof s.destroy && s.destroy())
            }

            function l(e) {
                if (p(), 0 === o.listenerCount(this, "error")) throw e
            }

            function p() {
                c.removeListener("data", e), s.removeListener("drain", d), c.removeListener("end", a), c.removeListener("close", r), c.removeListener("error", l), s.removeListener("error", l), c.removeListener("end", p), c.removeListener("close", p), s.removeListener("close", p)
            }
            var c = this;
            c.on("data", e), s.on("drain", d), s._isStdio || t && !1 === t.end || (c.on("end", a), c.on("close", r));
            var i = !1;
            return c.on("error", l), s.on("error", l), c.on("end", p), c.on("close", p), s.on("close", p), s.emit("pipe", c), s
        }
    }, {
        events: 8,
        inherits: 10,
        "readable-stream/duplex.js": 23,
        "readable-stream/passthrough.js": 32,
        "readable-stream/readable.js": 33,
        "readable-stream/transform.js": 34,
        "readable-stream/writable.js": 35
    }],
    38: [function(m, t, e) {
        "use strict";

        function i(a) {
            var t;
            switch (this.encoding = function(a) {
                var t = function(a) {
                    if (!a) return "utf8";
                    for (var o;;) switch (a) {
                        case "utf8":
                        case "utf-8":
                            return "utf8";
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return "utf16le";
                        case "latin1":
                        case "binary":
                            return "latin1";
                        case "base64":
                        case "ascii":
                        case "hex":
                            return a;
                        default:
                            if (o) return;
                            a = ("" + a).toLowerCase(), o = !0;
                    }
                }(a);
                if ("string" != typeof t && (p.isEncoding === s || !s(a))) throw new Error("Unknown encoding: " + a);
                return t || a
            }(a), this.encoding) {
                case "utf16le":
                    this.text = r, this.end = l, t = 4;
                    break;
                case "utf8":
                    this.fillLast = n, t = 4;
                    break;
                case "base64":
                    this.text = h, this.end = c, t = 3;
                    break;
                default:
                    return this.write = u, void(this.end = d);
            }
            this.lastNeed = 0, this.lastTotal = 0, this.lastChar = p.allocUnsafe(t)
        }

        function a(e) {
            return 127 >= e ? 0 : 6 == e >> 5 ? 2 : 14 == e >> 4 ? 3 : 30 == e >> 3 ? 4 : -1
        }

        function n(a) {
            var t = this.lastTotal - this.lastNeed,
                e = function(a, t, e) {
                    if (128 != (192 & t[0])) return a.lastNeed = 0, "\xC3\xAF\xC2\xBF\xC2\xBD".repeat(e);
                    if (1 < a.lastNeed && 1 < t.length) {
                        if (128 != (192 & t[1])) return a.lastNeed = 1, "\xC3\xAF\xC2\xBF\xC2\xBD".repeat(e + 1);
                        if (2 < a.lastNeed && 2 < t.length && 128 != (192 & t[2])) return a.lastNeed = 2, "\xC3\xAF\xC2\xBF\xC2\xBD".repeat(e + 2)
                    }
                }(this, a, t);
            return void 0 === e ? this.lastNeed <= a.length ? (a.copy(this.lastChar, t, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal)) : (a.copy(this.lastChar, t, 0, a.length), void(this.lastNeed -= a.length)) : e
        }

        function r(a, t) {
            if (0 == (a.length - t) % 2) {
                var e = a.toString("utf16le", t);
                if (e) {
                    var o = e.charCodeAt(e.length - 1);
                    if (55296 <= o && 56319 >= o) return this.lastNeed = 2, this.lastTotal = 4, this.lastChar[0] = a[a.length - 2], this.lastChar[1] = a[a.length - 1], e.slice(0, -1)
                }
                return e
            }
            return this.lastNeed = 1, this.lastTotal = 2, this.lastChar[0] = a[a.length - 1], a.toString("utf16le", t, a.length - 1)
        }

        function l(a) {
            var t = a && a.length ? this.write(a) : "";
            if (this.lastNeed) {
                var e = this.lastTotal - this.lastNeed;
                return t + this.lastChar.toString("utf16le", 0, e)
            }
            return t
        }

        function h(a, t) {
            var e = (a.length - t) % 3;
            return 0 == e ? a.toString("base64", t) : (this.lastNeed = 3 - e, this.lastTotal = 3, 1 == e ? this.lastChar[0] = a[a.length - 1] : (this.lastChar[0] = a[a.length - 2], this.lastChar[1] = a[a.length - 1]), a.toString("base64", t, a.length - e))
        }

        function c(a) {
            var t = a && a.length ? this.write(a) : "";
            return this.lastNeed ? t + this.lastChar.toString("base64", 0, 3 - this.lastNeed) : t
        }

        function u(e) {
            return e.toString(this.encoding)
        }

        function d(e) {
            return e && e.length ? this.write(e) : ""
        }
        var p = m("safe-buffer").Buffer,
            s = p.isEncoding || function(e) {
                switch ((e = "" + e) && e.toLowerCase()) {
                    case "hex":
                    case "utf8":
                    case "utf-8":
                    case "ascii":
                    case "binary":
                    case "base64":
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                    case "raw":
                        return !0;
                    default:
                        return !1;
                }
            };
        e.StringDecoder = i, i.prototype.write = function(a) {
            if (0 === a.length) return "";
            var t, o;
            if (this.lastNeed) {
                if (void 0 === (t = this.fillLast(a))) return "";
                o = this.lastNeed, this.lastNeed = 0
            } else o = 0;
            return o < a.length ? t ? t + this.text(a, o) : this.text(a, o) : t || ""
        }, i.prototype.end = function(a) {
            var t = a && a.length ? this.write(a) : "";
            return this.lastNeed ? t + "\xC3\xAF\xC2\xBF\xC2\xBD".repeat(this.lastTotal - this.lastNeed) : t
        }, i.prototype.text = function(o, t) {
            var e = function(n, t, e) {
                var r = t.length - 1;
                if (r < e) return 0;
                var i = a(t[r]);
                return 0 <= i ? (0 < i && (n.lastNeed = i - 1), i) : --r < e ? 0 : 0 <= (i = a(t[r])) ? (0 < i && (n.lastNeed = i - 2), i) : --r < e ? 0 : 0 <= (i = a(t[r])) ? (0 < i && (2 === i ? i = 0 : n.lastNeed = i - 3), i) : 0
            }(this, o, t);
            if (!this.lastNeed) return o.toString("utf8", t);
            this.lastTotal = e;
            var n = o.length - (e - this.lastNeed);
            return o.copy(this.lastChar, 0, n), o.toString("utf8", t, n)
        }, i.prototype.fillLast = function(e) {
            return this.lastNeed <= e.length ? (e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal)) : void(e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, e.length), this.lastNeed -= e.length)
        }
    }, {
        "safe-buffer": 36
    }],
    39: [function(a, o) {
        (function(a) {
            function n(t) {
                try {
                    if (!a.localStorage) return !1
                } catch (e) {
                    return !1
                }
                var e = a.localStorage[t];
                return null != e && "true" === (e + "").toLowerCase()
            }
            o.exports = function(a, t) {
                if (n("noDeprecation")) return a;
                var e = !1;
                return function() {
                    if (!e) {
                        if (n("throwDeprecation")) throw new Error(t);
                        n("traceDeprecation") ? console.trace(t) : console.warn(t), e = !0
                    }
                    return a.apply(this, arguments)
                }
            }
        }).call(this, "undefined" == typeof global ? "undefined" == typeof self ? "undefined" == typeof window ? {} : window : self : global)
    }, {}],
    40: [function(a, t, e) {
        arguments[4][10][0].apply(e, arguments)
    }, {
        dup: 10
    }],
    41: [function(a, t) {
        t.exports = function(e) {
            return e && "object" == typeof e && "function" == typeof e.copy && "function" == typeof e.fill && "function" == typeof e.readUInt8
        }
    }, {}],
    42: [function(P, t, I) {
        (function(i, e) {
            function D(a, t) {
                var e = {
                    seen: [],
                    stylize: l
                };
                return 3 <= arguments.length && (e.depth = arguments[2]), 4 <= arguments.length && (e.colors = arguments[3]), p(t) ? e.showHidden = t : t && I._extend(e, t), g(e.showHidden) && (e.showHidden = !1), g(e.depth) && (e.depth = 2), g(e.colors) && (e.colors = !1), g(e.customInspect) && (e.customInspect = !0), e.colors && (e.stylize = r), h(e, a, e.depth)
            }

            function r(a, t) {
                var e = D.styles[t];
                return e ? "\x1B[" + D.colors[e][0] + "m" + a + "\x1B[" + D.colors[e][1] + "m" : a
            }

            function l(e) {
                return e
            }

            function h(k, t, e) {
                if (k.customInspect && t && S(t.inspect) && t.inspect !== I.inspect && (!t.constructor || t.constructor.prototype !== t)) {
                    var i = t.inspect(e, k);
                    return m(i) || (i = h(k, i, e)), i
                }
                var w = function(a, t) {
                    if (g(t)) return a.stylize("undefined", "undefined");
                    if (m(t)) {
                        var e = "" + JSON.stringify(t).replace(/^"|"$/g, "").replace(/'/g, "'").replace(/\\"/g, "\"");
                        return a.stylize(e, "string")
                    }
                    return s(t) ? a.stylize("" + t, "number") : p(t) ? a.stylize("" + t, "boolean") : f(t) ? a.stylize("null", "null") : void 0
                }(k, t);
                if (w) return w;
                var a = Object.keys(t),
                    T = (l = {}, a.forEach(function(e) {
                        l[e] = !0
                    }), l),
                    l;
                if (k.showHidden && (a = Object.getOwnPropertyNames(t)), b(t) && (0 <= a.indexOf("message") || 0 <= a.indexOf("description"))) return c(t);
                if (0 === a.length) {
                    if (S(t)) {
                        var P = t.name ? ": " + t.name : "";
                        return k.stylize("[Function" + P + "]", "special")
                    }
                    if (y(t)) return k.stylize(RegExp.prototype.toString.call(t), "regexp");
                    if (C(t)) return k.stylize(Date.prototype.toString.call(t), "date");
                    if (b(t)) return c(t)
                }
                var D = "",
                    B = !1,
                    U = ["{", "}"],
                    A;
                return (d(t) && (B = !0, U = ["[", "]"]), S(t)) && (D = " [Function" + (t.name ? ": " + t.name : "") + "]"), y(t) && (D = " " + RegExp.prototype.toString.call(t)), C(t) && (D = " " + Date.prototype.toUTCString.call(t)), b(t) && (D = " " + c(t)), 0 !== a.length || B && 0 != t.length ? 0 > e ? y(t) ? k.stylize(RegExp.prototype.toString.call(t), "regexp") : k.stylize("[Object]", "special") : (k.seen.push(t), A = B ? function(l, t, e, i, s) {
                    for (var d = [], a = 0, o = t.length; a < o; ++a) v(t, a + "") ? d.push(u(l, t, e, i, a + "", !0)) : d.push("");
                    return s.forEach(function(a) {
                        a.match(/^\d+$/) || d.push(u(l, t, e, i, a, !0))
                    }), d
                }(k, t, e, T, a) : a.map(function(a) {
                    return u(k, t, e, T, a, B)
                }), k.seen.pop(), function(a, t, e) {
                    return 60 < a.reduce(function(a, t) {
                        return 0, 0 <= t.indexOf("") && 0, a + t.replace(/\u001b\[\d\d?m/g, "").length + 1
                    }, 0) ? e[0] + ("" === t ? "" : t + "") + " " + a.join(",") + " " + e[1] : e[0] + t + " " + a.join(", ") + " " + e[1]
                }(A, D, U)) : U[0] + D + U[1]
            }

            function c(e) {
                return "[" + Error.prototype.toString.call(e) + "]"
            }

            function u(d, t, e, i, s, o) {
                var a, p, c;
                if ((c = Object.getOwnPropertyDescriptor(t, s) || {
                        value: t[s]
                    }).get ? p = c.set ? d.stylize("[Getter/Setter]", "special") : d.stylize("[Getter]", "special") : c.set && (p = d.stylize("[Setter]", "special")), v(i, s) || (a = "[" + s + "]"), p || (0 > d.seen.indexOf(c.value) ? -1 < (p = f(e) ? h(d, c.value, null) : h(d, c.value, e - 1)).indexOf("") && (p = o ? p.split("").map(function(e) {
                        return "  " + e
                    }).join("").substr(2) : "" + p.split("").map(function(e) {
                        return "   " + e
                    }).join("")) : p = d.stylize("[Circular]", "special")), g(a)) {
                    if (o && s.match(/^\d+$/)) return p;
                    (a = JSON.stringify("" + s)).match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/) ? (a = a.substr(1, a.length - 2), a = d.stylize(a, "name")) : (a = a.replace(/'/g, "'").replace(/\\"/g, "\"").replace(/(^"|"$)/g, ""), a = d.stylize(a, "string"))
                }
                return a + ": " + p
            }

            function d(e) {
                return Array.isArray(e)
            }

            function p(e) {
                return "boolean" == typeof e
            }

            function f(e) {
                return null === e
            }

            function s(e) {
                return "number" == typeof e
            }

            function m(e) {
                return "string" == typeof e
            }

            function g(e) {
                return void 0 === e
            }

            function y(e) {
                return k(e) && "[object RegExp]" === w(e)
            }

            function k(e) {
                return "object" == typeof e && null !== e
            }

            function C(e) {
                return k(e) && "[object Date]" === w(e)
            }

            function b(e) {
                return k(e) && ("[object Error]" === w(e) || e instanceof Error)
            }

            function S(e) {
                return "function" == typeof e
            }

            function w(e) {
                return Object.prototype.toString.call(e)
            }

            function M(e) {
                return 10 > e ? "0" + e.toString(10) : e.toString(10)
            }

            function v(a, t) {
                return Object.prototype.hasOwnProperty.call(a, t)
            }
            var x = /%[sdj%]/g;
            I.format = function(o) {
                if (!m(o)) {
                    for (var t = [], e = 0; e < arguments.length; e++) t.push(D(arguments[e]));
                    return t.join(" ")
                }
                e = 1;
                for (var r = arguments, s = r.length, a = (o + "").replace(x, function(a) {
                        if ("%%" === a) return "%";
                        if (e >= s) return a;
                        switch (a) {
                            case "%s":
                                return r[e++] + "";
                            case "%d":
                                return +r[e++];
                            case "%j":
                                try {
                                    return JSON.stringify(r[e++])
                                } catch (e) {
                                    return "[Circular]"
                                }
                                default:
                                    return a;
                        }
                    }), d = r[e]; e < s; d = r[++e]) a += f(d) || !k(d) ? " " + d : " " + D(d);
                return a
            }, I.deprecate = function(s, t) {
                if (g(e.process)) return function() {
                    return I.deprecate(s, t).apply(this, arguments)
                };
                if (!0 === i.noDeprecation) return s;
                var o = !1;
                return function() {
                    if (!o) {
                        if (i.throwDeprecation) throw new Error(t);
                        i.traceDeprecation ? console.trace(t) : console.error(t), o = !0
                    }
                    return s.apply(this, arguments)
                }
            };
            var o = {},
                n;
            I.debuglog = function(a) {
                if (g(n) && (n = i.env.NODE_DEBUG || ""), a = a.toUpperCase(), !o[a])
                    if (new RegExp("\b" + a + "\b", "i").test(n)) {
                        var r = i.pid;
                        o[a] = function() {
                            var t = I.format.apply(I, arguments);
                            console.error("%s %d: %s", a, r, t)
                        }
                    } else o[a] = function() {};
                return o[a]
            }, I.inspect = D, D.colors = {
                bold: [1, 22],
                italic: [3, 23],
                underline: [4, 24],
                inverse: [7, 27],
                white: [37, 39],
                grey: [90, 39],
                black: [30, 39],
                blue: [34, 39],
                cyan: [36, 39],
                green: [32, 39],
                magenta: [35, 39],
                red: [31, 39],
                yellow: [33, 39]
            }, D.styles = {
                special: "cyan",
                number: "yellow",
                boolean: "yellow",
                undefined: "grey",
                null: "bold",
                string: "green",
                date: "magenta",
                regexp: "red"
            }, I.isArray = d, I.isBoolean = p, I.isNull = f, I.isNullOrUndefined = function(e) {
                return null == e
            }, I.isNumber = s, I.isString = m, I.isSymbol = function(e) {
                return "symbol" == typeof e
            }, I.isUndefined = g, I.isRegExp = y, I.isObject = k, I.isDate = C, I.isError = b, I.isFunction = S, I.isPrimitive = function(e) {
                return null === e || "boolean" == typeof e || "number" == typeof e || "string" == typeof e || "symbol" == typeof e || void 0 === e
            }, I.isBuffer = P("./support/isBuffer");
            var T = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            I.log = function() {
                var a, o;
                console.log("%s - %s", (a = new Date, o = [M(a.getHours()), M(a.getMinutes()), M(a.getSeconds())].join(":"), [a.getDate(), T[a.getMonth()], o].join(" ")), I.format.apply(I, arguments))
            }, I.inherits = P("inherits"), I._extend = function(a, t) {
                if (!t || !k(t)) return a;
                for (var e = Object.keys(t), o = e.length; o--;) a[e[o]] = t[e[o]];
                return a
            }
        }).call(this, P("_process"), "undefined" == typeof global ? "undefined" == typeof self ? "undefined" == typeof window ? {} : window : self : global)
    }, {
        "./support/isBuffer": 41,
        _process: 22,
        inherits: 40
    }],
    43: [function(a, t, e) {
        arguments[4][5][0].apply(e, arguments)
    }, {
        "./lib/uint32": 44,
        "./lib/uint64": 45,
        dup: 5
    }],
    44: [function(a, t, e) {
        arguments[4][6][0].apply(e, arguments)
    }, {
        dup: 6
    }],
    45: [function(a, t, e) {
        arguments[4][7][0].apply(e, arguments)
    }, {
        dup: 7
    }],
    46: [function(p, t) {
        (function(l) {
            ! function(e) {
                function s() {
                    return 2 == arguments.length ? new s(arguments[1]).update(arguments[0]).digest() : this instanceof s ? void i.call(this, arguments[0]) : new s(arguments[0])
                }

                function i(e) {
                    return this.seed = e instanceof m ? e.clone() : m(e), this.v1 = this.seed.clone().add(d), this.v2 = this.seed.clone().add(a), this.v3 = this.seed.clone(), this.v4 = this.seed.clone().subtract(g), this.total_len = 0, this.memsize = 0, this.memory = null, this
                }
                var m = p("cuint").UINT32;
                m.prototype.xxh_update = function(n, t) {
                    var e = a._low,
                        d = a._high,
                        p, m;
                    p = (m = n * e) >>> 16, p += t * e, p &= 65535, p += n * d;
                    var u = this._low + (65535 & m),
                        f = u >>> 16,
                        y = (f += this._high + (65535 & p)) << 16 | 65535 & u;
                    f = (y = y << 13 | y >>> 19) >>> 16, p = (m = (u = 65535 & y) * (e = g._low)) >>> 16, p += f * e, p &= 65535, p += u * (d = g._high), this._low = 65535 & m, this._high = 65535 & p
                };
                var g = m("2654435761"),
                    a = m("2246822519"),
                    o = m("3266489917"),
                    n = m("668265263"),
                    r = m("374761393"),
                    d = g.clone().add(a);
                s.prototype.init = i, s.prototype.update = function(i) {
                    var d = "string" == typeof i,
                        p;
                    d && (i = function(a) {
                        for (var t = [], e = 0, n = a.length, s; e < n; e++) s = a.charCodeAt(e), 128 > s ? t.push(s) : 2048 > s ? t.push(192 | s >> 6, 128 | 63 & s) : 55296 > s || 57344 <= s ? t.push(224 | s >> 12, 128 | 63 & s >> 6, 128 | 63 & s) : (e++, s = 65536 + ((1023 & s) << 10 | 1023 & a.charCodeAt(e)), t.push(240 | s >> 18, 128 | 63 & s >> 12, 128 | 63 & s >> 6, 128 | 63 & s));
                        return new Uint8Array(t)
                    }(i), d = !1, p = !0), "undefined" != typeof ArrayBuffer && i instanceof ArrayBuffer && (p = !0, i = new Uint8Array(i));
                    var c = 0,
                        m = i.length,
                        a = c + m;
                    if (0 == m) return this;
                    if (this.total_len += m, 0 == this.memsize && (this.memory = d ? "" : p ? new Uint8Array(16) : new l(16)), 16 > this.memsize + m) return d ? this.memory += i : p ? this.memory.set(i.subarray(0, m), this.memsize) : i.copy(this.memory, this.memsize, 0, m), this.memsize += m, this;
                    if (0 < this.memsize) {
                        d ? this.memory += i.slice(0, 16 - this.memsize) : p ? this.memory.set(i.subarray(0, 16 - this.memsize), this.memsize) : i.copy(this.memory, this.memsize, 0, 16 - this.memsize);
                        var n = 0;
                        d ? (this.v1.xxh_update(this.memory.charCodeAt(n + 1) << 8 | this.memory.charCodeAt(n), this.memory.charCodeAt(n + 3) << 8 | this.memory.charCodeAt(n + 2)), n += 4, this.v2.xxh_update(this.memory.charCodeAt(n + 1) << 8 | this.memory.charCodeAt(n), this.memory.charCodeAt(n + 3) << 8 | this.memory.charCodeAt(n + 2)), n += 4, this.v3.xxh_update(this.memory.charCodeAt(n + 1) << 8 | this.memory.charCodeAt(n), this.memory.charCodeAt(n + 3) << 8 | this.memory.charCodeAt(n + 2)), n += 4, this.v4.xxh_update(this.memory.charCodeAt(n + 1) << 8 | this.memory.charCodeAt(n), this.memory.charCodeAt(n + 3) << 8 | this.memory.charCodeAt(n + 2))) : (this.v1.xxh_update(this.memory[n + 1] << 8 | this.memory[n], this.memory[n + 3] << 8 | this.memory[n + 2]), n += 4, this.v2.xxh_update(this.memory[n + 1] << 8 | this.memory[n], this.memory[n + 3] << 8 | this.memory[n + 2]), n += 4, this.v3.xxh_update(this.memory[n + 1] << 8 | this.memory[n], this.memory[n + 3] << 8 | this.memory[n + 2]), n += 4, this.v4.xxh_update(this.memory[n + 1] << 8 | this.memory[n], this.memory[n + 3] << 8 | this.memory[n + 2])), c += 16 - this.memsize, this.memsize = 0, d && (this.memory = "")
                    }
                    if (c <= a - 16) {
                        do d ? (this.v1.xxh_update(i.charCodeAt(c + 1) << 8 | i.charCodeAt(c), i.charCodeAt(c + 3) << 8 | i.charCodeAt(c + 2)), c += 4, this.v2.xxh_update(i.charCodeAt(c + 1) << 8 | i.charCodeAt(c), i.charCodeAt(c + 3) << 8 | i.charCodeAt(c + 2)), c += 4, this.v3.xxh_update(i.charCodeAt(c + 1) << 8 | i.charCodeAt(c), i.charCodeAt(c + 3) << 8 | i.charCodeAt(c + 2)), c += 4, this.v4.xxh_update(i.charCodeAt(c + 1) << 8 | i.charCodeAt(c), i.charCodeAt(c + 3) << 8 | i.charCodeAt(c + 2))) : (this.v1.xxh_update(i[c + 1] << 8 | i[c], i[c + 3] << 8 | i[c + 2]), c += 4, this.v2.xxh_update(i[c + 1] << 8 | i[c], i[c + 3] << 8 | i[c + 2]), c += 4, this.v3.xxh_update(i[c + 1] << 8 | i[c], i[c + 3] << 8 | i[c + 2]), c += 4, this.v4.xxh_update(i[c + 1] << 8 | i[c], i[c + 3] << 8 | i[c + 2])), c += 4; while (c <= a - 16)
                    }
                    return c < a && (d ? this.memory += i.slice(c) : p ? this.memory.set(i.subarray(c, a), this.memsize) : i.copy(this.memory, this.memsize, c, a), this.memsize = a - c), this
                }, s.prototype.digest = function() {
                    var l = this.memory,
                        i = "string" == typeof l,
                        s = 0,
                        p = this.memsize,
                        h = new m,
                        d, u;
                    for ((d = 16 <= this.total_len ? this.v1.rotl(1).add(this.v2.rotl(7).add(this.v3.rotl(12).add(this.v4.rotl(18)))) : this.seed.add(r)).add(h.fromNumber(this.total_len)); s <= p - 4;) i ? h.fromBits(l.charCodeAt(s + 1) << 8 | l.charCodeAt(s), l.charCodeAt(s + 3) << 8 | l.charCodeAt(s + 2)) : h.fromBits(l[s + 1] << 8 | l[s], l[s + 3] << 8 | l[s + 2]), d.add(h.multiply(o)).rotl(17).multiply(n), s += 4;
                    for (; s < p;) h.fromBits(i ? l.charCodeAt(s++) : l[s++], 0), d.add(h.multiply(r)).rotl(11).multiply(g);
                    return u = d.clone().shiftRight(15), d.xor(u).multiply(a), u = d.clone().shiftRight(13), d.xor(u).multiply(o), u = d.clone().shiftRight(16), d.xor(u), this.init(this.seed), d
                }, "undefined" != typeof define && define.amd ? define([], function() {
                    return s
                }) : void 0 !== t && t.exports ? t.exports = s : e.XXH = s
            }(this)
        }).call(this, p("buffer").Buffer)
    }, {
        buffer: 3,
        cuint: 43
    }],
    47: [MGxOne, {
        buffer: 3,
        lz4: 18
    }]
}, {}, [47]);
