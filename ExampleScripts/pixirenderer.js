/*var stats1=new Stats();
document.body.appendChild(stats1.dom);*/


Texts = new (class{
    constructor(){
        this.nickCaches = new Map()
        this.massCaches = new Map()
        this.maxCacheLife = 1000
        this.massUpdateInterval = settings.massUpdateInterval || 500
        this.quality = 0.4
        this.nickShadowCtx = this.newShadowContext()
        this.massShadowCtx = this.newShadowContext()
        this.canvasPool = [];

        this.nickObject = class{
            constructor(){
                this.lastUsedAt = Date.now(), this.level = [null, null, null, null, null, null, null, null];
            }
        }

        this.massObject = class {
            constructor(){
                this.lastUsedAt = Date.now()
                this.lastUpdateAt = Date.now()
                this.canvas = null
                this.ctx = null
                this._mass = 0
                this.lastMass = 0
                this._fontSize = 5
                this.needsRedraw = true;
            }
            set mass(argMass){
                this._mass = argMass
                if(this._mass!==this.lastMass) {this.lastMass = this._mass, this.needsRedraw = true}
            }
            get mass(){
                return this._mass;
            }
            set fontSize(argZoom) {
                5 > argZoom || (0 | argZoom) == (0 | this._fontSize) || this._fontSize > argZoom && 0.8 < argZoom / this._fontSize || argZoom > this._fontSize && 0.8 < this._fontSize / argZoom || (this._fontSize = argZoom, this.needsRedraw = true);
            }
            get fontSize(){
                return this._fontSize;
            }
        }
    }
    setMassUpdateInterval() {
        this.massUpdateInterval = settings.massUpdateInterval || 500;
    }
    nick(targetNick, cell) {
        var cellNickSize = theme.namesScale
        if (targetNick==='') return false;
        const lvl = cell.targetSize * drawRender.scale * cellNickSize
        if (10 > lvl && settings.autoHideNames) return false;
        const NickName = this.nickCaches.get(targetNick) || this.newNickCache(targetNick);
        NickName.lastUsedAt = Date.now();
        const needLevel =  0| Math.min(lvl / 50, 7),
            canvas = NickName.level[needLevel];
        if (canvas) return canvas;
        const newCanvas = this.getNewCanvas(),
            ctx = newCanvas.getContext('2d'),
            fontSize = 50 * (needLevel + 1) * this.quality,
            margin = theme.strokeScale*(fontSize/10),
            OriginFontSize = 50 * 5 * 0.8,
            OriginMargin = theme.strokeScale*(OriginFontSize/10)
        newCanvas.height =  fontSize + margin*4
        newCanvas.width =  0| this.getNickWidth(targetNick, fontSize) + margin//*4
        newCanvas.originW = (this.getNickWidth(targetNick, OriginFontSize)+OriginMargin) /650
        newCanvas.originH = newCanvas.height*(newCanvas.originW/newCanvas.width)
        ctx.font = theme.namesFontWeight+' ' + (fontSize) + 'px ' + theme.namesFontFamily
        ctx.textBaseline = 'middle'
        ctx.textAlign = "center"

        if(settings.namesStroke2 === 1){
            ctx.strokeStyle = theme.namesStrokeColor
            ctx.lineWidth = margin*theme.strokeScale
            ctx.lineJoin  = 'miter';
            ctx.miterLimit = 0;
            ctx.strokeText(targetNick, newCanvas.width>>1, newCanvas.height >> 1)
        }else if(settings.namesStroke2 === 2){
            ctx.fillStyle = theme.namesStrokeColor
            ctx.globalAlpha = 0.75
            ctx.fillRect(0, 0, newCanvas.width, newCanvas.height)
            ctx.globalAlpha = 1
        }
        ctx.fillStyle = theme.namesColor
        ctx.fillText(targetNick, newCanvas.width>>1, newCanvas.height >> 1),
            NickName.level[needLevel] = newCanvas
        return newCanvas;
    }
    newNickCache(text) {
        const nickObj = new this.nickObject();
        return this.nickCaches.set(text, nickObj), nickObj;
    }
    getNickHeight(nick, fontSize) {
        return fontSize + ~~(fontSize * 0.4);
    }
    getNickWidth(nick, fontSize) {
        return this.nickShadowCtx.measureText(nick).width*fontSize/25
    }
    setNickCtxFont() {
        this.nickCaches.clear(), this.nickShadowCtx.font = '700 25px ' + theme.namesFontFamily;
    }

    mass(cell) {
        var cellNickSize = cell.isVirus?theme.virMassScale/2:theme.namesScale/3
        const lvl = cell.targetSize * drawRender.scale * cellNickSize
        const needLevel =  0| Math.min(lvl / 50, 7)
        if (!cell.isVirus && 10 > lvl && settings.autoHideMass || cell.size<40) return false;
        const Massa = this.massCaches.get(cell.id) || this.newMassCache(cell.id);
        Massa.lastUsedAt = Date.now();
        let massTxt = settings.shortMass && 999 < cell.mass ? (0 | cell.mass / 100) / 10 + 'k' : cell.mass;
        if(cell.isVirus && cell.mass < 200) {
            const targetMass = ~~(cell.targetSize * cell.targetSize / 100)
            if(settings.virMassType === 2) {massTxt = this.calcVirusShots(targetMass)}else{massTxt = targetMass}
            if(massTxt!==Massa.mass){Massa.needsRedraw=true}
        }
        Massa.fontSize = 50 * (needLevel + 1) * 0.9//this.quality//1.5//lvl;
        const time = Date.now() - Massa.lastUpdateAt;
        if(Massa.needsRedraw || time > this.massUpdateInterval) {
            Massa.mass = massTxt
            //Massa.lastmass = massTxt
        }
        Massa.canvas || (Massa.canvas = this.getNewCanvas(), Massa.ctx = Massa.canvas.getContext('2d'))
        if (Massa.needsRedraw) {
            Massa.needsRedraw = false;
            const canvas = Massa.canvas,
                ctx = Massa.ctx,
                margin = theme.strokeScale*(Massa.fontSize/10),
                OriginFontSize = 50 * 5 * 0.8,
                OriginMargin = theme.strokeScale*(OriginFontSize/10)
            canvas.height =  Massa.fontSize + margin// + ~~(Massa.fontSize * 0.4);
            canvas.width = 0 | this.getMassWidth(Massa.mass, Massa.fontSize) + margin//*4,
            canvas.originW = ((this.getMassWidth(Massa.mass, OriginFontSize) + OriginMargin) /650)
            canvas.originH = canvas.height*(canvas.originW/canvas.width)
            ctx.font = theme.massFontWeight+' ' + (0 | Massa.fontSize) + 'px ' + theme.massFontFamily,
                ctx.textBaseline = 'middle'
            ctx.textAlign = "center"
            if (settings.massStroke2 === 1) {
                ctx.strokeStyle = theme.massStrokeColor;
                ctx.lineWidth = margin//*theme.strokeScale;
                ctx.lineJoin  = 'miter';
                ctx.miterLimit = 0;
                ctx.strokeText(Massa.mass, canvas.width >> 1, canvas.height >> 1);
            } else {
                if (settings.massStroke2 === 2) {
                    ctx.fillStyle = theme.massStrokeColor;
                    ctx.globalAlpha = 0.75;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.globalAlpha = 1;
                }
            }
            ctx.fillStyle = theme.massColor,
                ctx.fillText(Massa.mass, canvas.width >> 1, canvas.height >> 1),
                Massa.lastUpdateAt = Date.now();
        }
        return Massa.canvas;
    }
    newMassCache(id) {
        const obj = new this.massObject();
        return this.massCaches.set(id, obj), obj;
    }
    getMassWidth(text, fontSize) {
        return this.massShadowCtx.measureText(text).width * fontSize / 25;
    }
    setMassCtxFont() {
        this.massCaches.clear(), this.massShadowCtx.font = '700 25px ' + theme.massFontFamily;
    }
    getScreenRadius (radius){ return radius * drawRender.scale}
    isSmall(cell) {
        return 'on' === settings.autoHideText && 20 > this.getScreenRadius(cell.targetSize);
    }
    calcVirusShots(mass){
        return ~~((200 - mass) / 14);
    }
    getNewCanvas() {
        return this.canvasPool.shift() || document.createElement('canvas');
    }
    newShadowContext() {
        const _4421815 = document.createElement('canvas').getContext('2d');
        return _4421815.font = '700 25px ubuntu', _4421815;
    }
    clear(type){
        if(type === 'nick'){
            this.nickCaches.forEach((nickObject, id) => {
                this.nickCaches.delete(id);
                var nickObjectLevel;
                var levels = nickObject.level;
                for (var i = 0; i < levels.length; i++) {
                    if (nickObjectLevel = levels[i]) {
                        this.resetCanvas(nickObjectLevel);
                    }
                }
            })
        }
        if(type === 'mass'){
            this.massCaches.forEach((massObject, id) => {
                this.massCaches.delete(id)
                if (50 <= this.canvasPool.length) return;
                var massObjectCanvas = massObject.canvas;
                this.resetCanvas(massObjectCanvas);
            });
        }
    }
    cleaner() {
        this.nickCaches.forEach((nickObject, id) => {
            if (Date.now() - nickObject.lastUsedAt > this.maxCacheLife) {
                this.nickCaches.delete(id);
                var nickObjectLevel;
                var levels = nickObject.level;
                for (var i = 0; i < levels.length; i++) {
                    if (nickObjectLevel = levels[i]) {
                        this.resetCanvas(nickObjectLevel);
                    }
                }
            }
        }), this.massCaches.forEach((massObject, id) => {
            if (Date.now() - massObject.lastUsedAt > this.maxCacheLife) {
                this.massCaches.delete(id)
                if (50 <= this.canvasPool.length) return;
                var massObjectCanvas = massObject.canvas;
                this.resetCanvas(massObjectCanvas);
            }
        });
    }
    resetCanvas(massObjectCanvas) {
        !massObjectCanvas || 75 <= this.canvasPool.length || (massObjectCanvas.width = 0, this.canvasPool.push(massObjectCanvas));
    }
})


CanvasRender = {
    currentTime: 0,
    lastTime: Date.now(),
    canvas: null,
    ctx: null,
    canvasWidth: 0,
    canvasHeight: 0,
    camX: 0,
    camY: 0,
    scale: 1,
    zoomValue: 0.1,
    mouseClientX:0,
    mouseClientY:0,
    fpsLastRequest: null,
    renderedFrames: 0,
    renderedObjects:0,
    fps: 0,
    pi2: 2 * Math.PI,
    battleAreaMap: null,
    battleAreaMapCtx: null,
    pieChart: null,
    pellet: null,
    indicator: null,
    foodIsHidden:false,
    nickCache:{},
    massCache:{},
    polygonCache:null,
    cellsFrame:[],
    foodFrame:[],
    virusesFrame:[],
    setCanvas() {
        this.canvas = document.getElementById(`canvas`);
        this.ctx = this.canvas.getContext('2d' /*{ alpha: false }*/);
        /*var context = this.ctx
        var drawImage = this.ctx.drawImage
        this.ctx.drawImage = async function(){drawImage.apply(context,arguments)}*/
    },
    setCanvasSmoothing(bool){
        this.canvas.style.imageRendering=!bool?'pixelated':''
    },
    setCanvasAntialiasing(num){
        this.ctx.imageSmoothingEnabled = true
        switch(num){
            case 0:
                this.ctx.imageSmoothingEnabled = false
                this.ctx.imageSmoothingQuality = 'high'
            break;
            case 1:
                this.ctx.imageSmoothingQuality = 'low'
            break;
            case 2:
                this.ctx.imageSmoothingQuality = 'medium'
            break;
            case 3:
                this.ctx.imageSmoothingQuality = 'high'
            break;
        }
    },
    resizeCanvas(w,h) {
        this.canvasWidth = (w||window.innerWidth) * settings.renderQuality//* window.devicePixelRatio;
        this.canvasHeight = (h||window.innerHeight) * settings.renderQuality//* window.devicePixelRatio;
        this.canvas.width = this.canvasWidth;
        this.canvas.height = this.canvasHeight;
        //this.renderFrame();

        this.app._resizeTo = {clientWidth: this.canvasWidth,clientHeight: this.canvasHeight}
        this.app.resize()
    },
    setCursorPosition(Client) {
        Client.cursorX = (this.mouseClientX - this.canvasWidth / 2) / this.scale + this.camX; 
        Client.cursorY = (this.mouseClientY - this.canvasHeight / 2) / this.scale +this.camY;
    },
    setCursorPositionKeepPos(Client) {
        Client.cursorX = (Client._mouseClientX - this.canvasWidth / 2) / Client._scale + Client._camX; 
        Client.cursorY = (Client._mouseClientY - this.canvasHeight / 2) / Client._scale +Client._camY;
    },
    setZoom(event) {
        this.zoomValue = this.zoomValue * settings.zoomSpeedValue ** (event.wheelDelta / -120 || event.detail || 0);
        if (this.zoomValue > 1 / this.scale) {
            this.zoomValue = 1 / this.scale;
        }
        if (this.zoomValue < 0.00008 / this.scale) {
            this.zoomValue = 0.00008 / this.scale;
        }
    },
    setView() {
        var middleViewX = 0
        var middleViewY = 0
        var totalPlaying = 0
        var maxMass = 0
        //const Connection=application.tabs[application.tabCurrent]
        for(var client of application.tabs){
            if(client.play){
                totalPlaying++
            }
        }
        if(settings.autoZoom){
            if(application.tab.slave && application.tab.master){
                application.tab.slave.playerSize > application.tab.master.playerSize? this.calcAutoScale(application.tab.slave):this.calcAutoScale(application.tab.master)
            }else{
                this.calcAutoScale(application.tab.master)
            }
        }else{
            this.calcScale()
        }
        // Вычисление среднего с играющих
        for (let i = 0; i < application.tabs.length; i++) {
            if(!application.tabs[i].play){continue}
            const c = application.tabs[i];
            middleViewX += c.viewX / totalPlaying;
            middleViewY += c.viewY / totalPlaying;
            
            //Для паузы
            //client.viewX = middleViewX
            //client.viewY = middleViewY
        }
        if(!settings.mbCenterCamera || totalPlaying===0){
            middleViewX=application.tabs[0].viewX
            middleViewY=application.tabs[0].viewY
        }



        if(application.play){
            if (settings.cameraDelay === 0) { // Камера с нулевой плавностью
                this.camX = (this.camX + middleViewX) / 2;
                this.camY = (this.camY + middleViewY) / 2;
            } else { // Камера с плавностью
                var sp30 = settings.cameraDelay
                var sp29 = settings.cameraDelay-1
                this.camX = (sp29 * this.camX + middleViewX) / sp30;
                this.camY = (sp29 * this.camY + middleViewY) / sp30;
            }
            //client.viewX = this.camX;
            //client.viewY = this.camY;
        }else{
            this.camX = (29 * this.camX + middleViewX) / 30;
            this.camY = (29 * this.camY + middleViewY) / 30;
        }

        for(var client of application.tabs){
            client.playerX = client.viewX;
            client.playerY = client.viewY;
        }
    },
    getZoom() {
        return Math.max(this.canvasWidth / 1080, this.canvasHeight / 1920) * this.zoomValue;
        //return Math.max(this.canvasWidth / 600, this.canvasHeight / 1024) * this.zoomValue;
    },
    setScale(Connection) {
        let sp10 = settings.zoomSmoothness
        let sp9 = sp10 - 1
        if (!settings.autoZoom) { // Автозум отключен
            this.scale = (sp9 * this.scale + this.getZoom()) / sp10;
            //Connection.viewScale = this.scale;
            return;
        }

        // Автозум включен
        if (Connection.play) {// playing
            this.scale = (sp9 * this.scale + Math.min(64 / Connection.playerSize, 1) ** 0.2 * this.getZoom()) / sp10;
        } else {// spectate
            this.scale = (sp9 * this.scale + Connection.scale * this.getZoom()) / sp10;
        }
        //Connection.viewScale = this.scale;
    },

    calcScale() {
        let sp10 = settings.zoomSmoothness
        let sp9 = sp10 - 1
        this.scale = (sp9 * this.scale + this.getZoom()) / sp10;

    },
    calcAutoScale(Connection){
        let sp10 = settings.zoomSmoothness
        let sp9 = sp10 - 1

        // Автозум включен
        if (Connection.play) {// playing
            this.scale = (sp9 * this.scale + Math.min(64 / Connection.playerSize, 1) ** 0.2 * this.getZoom()) / sp10;
        } else {// spectate
            this.scale = (sp9 * this.scale + Connection.scale * this.getZoom()) / sp10;
        }
        //Connection.viewScale = this.scale;
    },
    reverseCheckView(cell,tabIndex){
        for(let i=tabIndex-1;-1<i;i--){
            if(application.tabs[i].isInViewHSLO(cell)) return true;
        }
        return false
    },
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
        //return new Promise(requestAnimationFrame);
    },
     renderFrame() {
        //this.currentTime = Date.now()
        //this.delta = (this.currentTime - this.lastTime) / settings.animation;
        //this.lastTime = this.currentTime
        
        //stats1.begin();
        //await this.sleep(4)
        this.countFps();
        this.renderedObjects=0
        const activeTab = application.tab.master

        for(let i=0,len1 = application.tabs.length;len1>i;i++){
            //if(!application.tabs[i]) continue
            application.tabs[i].time = Date.now();
                for (var j = 0,length = application.tabs[i].cells.length; j < length; j++) {
                    application.tabs[i].cells[j].moveCell()
                    if( !this.reverseCheckView(application.tabs[i].cells[j],i) ) {
                        this.cellsFrame.push(application.tabs[i].cells[j])
                        if(application.tabs[i].cells[j].isVirus) this.virusesFrame.push(application.tabs[i].cells[j])
                    }
                    
                }
            if(application.tabs[i].playerCells.length) application.tabs[i].calculatePlayerMassAndPosition()
        }


         this.cellsFrame.sort((A, B) => A.size === B.size ? A.id - B.id : A.size - B.size);
         this.setView();

        
        for(var Connection of application.tabs){
            if(!Connection)continue
            if(application.tabs.indexOf(Connection) === 0){
                this.setCursorPosition(Connection);
            }
            //Connection.sortCellsBySize()
            //Connection.compareCells();
            //Connection.calcViewport()
        }

        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        if (settings.showGrid) {
            this.drawGrid(this.ctx, this.canvasWidth, this.canvasHeight, this.scale, this.camX, this.camY);
        }



        
        //this.anotherFoodDrawer()

         this.ctx.save();
         this.ctx.translate(~~this.canvasWidth >> 1, ~~this.canvasHeight >> 1);
         this.ctx.scale(this.scale, this.scale);
         this.ctx.translate(-this.camX, -this.camY);

         //this.ctx.save();
         //this.ctx.translate((~~this.canvasWidth >> 1)-(this.camX*this.scale), (~~this.canvasHeight >> 1)-(this.camY*this.scale));
         //this.ctx.scale(this.scale, this.scale);
         //this.ctx.scale(-this.scale, -this.scale);
         //this.ctx.translate(-this.camX, -this.camY);


         //this.ctx.imageSmoothingEnabled = true
         //this.ctx.imageSmoothingQuality = "high"
        //for(var Connection of application.tabs){


        if(activeTab.mapOffsetFixed === true && Settings.customMapTextureCanvas.complet === true){
            settings.showGrid === true && (this.ctx.globalCompositeOperation = 'destination-over')
            this.ctx.drawImage(Settings.customMapTextureCanvas, activeTab.mapMinX, activeTab.mapMaxY, activeTab.mapMaxX-activeTab.mapMinX, activeTab.mapMinY-activeTab.mapMaxY);
            settings.showGrid === true && (this.ctx.globalCompositeOperation = 'source-over')
        }
        if (settings.showBgSectors === true) {
            this.drawSectors(this.ctx, activeTab.mapOffsetFixed, theme.sectorsX, theme.sectorsY, activeTab.mapMinX, activeTab.mapMinY, activeTab.mapMaxX, activeTab.mapMaxY, theme.gridColor, theme.sectorsColor, theme.sectorsWidth, true);
        }



        if(activeTab.mapOffsetFixed === true&& Settings.customMapLogoCanvas.complet === true){
            //settings.showGrid && (this.ctx.globalCompositeOperation = 'destination-over')
            this.ctx.globalAlpha = 0.2
            var ofx = ((activeTab.mapMaxX-activeTab.mapMinX)/5)*2.2
            var ofy = ((activeTab.mapMinY-activeTab.mapMaxY)/5)*2.2

            this.ctx.drawImage(
                Settings.customMapLogoCanvas,  //2.1:5.9
                //0,0,540,540,
                activeTab.mapMinX+ofx, 
                activeTab.mapMaxY+ofy, 
                (activeTab.mapMaxX-activeTab.mapMinX)/8.5, 
                (activeTab.mapMinY-activeTab.mapMaxY)/8.5
            );
            this.ctx.globalAlpha = 1
            //settings.showGrid && (this.ctx.globalCompositeOperation = 'source-over')
        }
        if (activeTab.gameMode === ':battleroyale') {
            this.drawBattleArea(this.ctx);
        }
        if (settings.showMapBorders === true) {
            const borderWidth = theme.bordersWidth >> 1;
            this.drawMapBorders(this.ctx, activeTab.mapOffsetFixed, activeTab.mapMinX - borderWidth, activeTab.mapMinY - borderWidth, activeTab.mapMaxX + borderWidth, activeTab.mapMaxY + borderWidth, theme.bordersColor, theme.bordersWidth);
        }

        /*if (settings.virusesRange) for(var Connection of application.tabs){if(!Connection) continue;
            this.drawVirusesRange(this.ctx, Connection.viruses, Connection);
        }*/
        if (settings.virusesRange === true) {
             this.drawVirusesRange(this.ctx, this.virusesFrame);
        }

        for(let i=0,len1 = application.tabs.length;len1>i;i++){
            if(application.tabs[i].type >= 3) continue
             this.drawFood(application.tabs[i],i);
        }
        /*for(let i=0,len1 = application.tabs.length;len1>i;i++){
            //if(!application.tabs[i]) continue
            this.ctx.beginPath();
            for(let j=0,len=application.tabs[i].food.length;len>j;j++){

                if( this.reverseCheckView(application.tabs[i].food[j],i))continue

                this.renderedObjects++
                const food = application.tabs[i].food[j]
                this.ctx.moveTo(food.x, food.y);
                if (this.scale < 0.16) {
                    const size = food.size + theme.foodSize;
                    this.ctx.rect(food.x - size, food.y - size, 2 * size, 2 * size);
                    continue;
                }
                this.ctx.arc(food.x, food.y, food.size + theme.foodSize, 0, this.pi2, false);
            }

            this.ctx.fillStyle = theme.foodColor;
            this.ctx.globalAlpha = 1;
            this.ctx.fill();
        }*/

    for(let i=0,len1 = application.tabs.length;len1>i;i++){
        //if(!application.tabs[i]) continue
        const Connection = application.tabs[i]
        settings.debug&&this.drawViewport(this.ctx, 'Bound '+application.tabs[i].tabName, Connection.bound.left, Connection.bound.bottom, Connection.bound.right, Connection.bound.top, 'red', 20);
        //_Connection && _Connection.play && this.drawCircles(this.ctx, _Connection.playerCells, 150, 5, 0.75, `#00FFFF`);
        if (Connection && Connection.play && i === 0) {
            if (settings.splitRange) {
                this.drawSplitRange(this.ctx, Connection, tempsett.selectBiggestCell);
            }
            if (settings.splitRange && settings.doubleSplitRange) {
                this.drawDoubleSplitRange(this.ctx, Connection, tempsett.selectBiggestCell);
            }
            if (settings.splitRange && settings.tripleSplitRange) {
                this.drawTripleSplitRange(this.ctx, Connection);
            }
            if (settings.oppRings) {
                this.drawOppRings(this.ctx, this.scale, Connection);
            }
            if (settings.cursorTracking) {
                //Connection.isInViewport(Connection.cursorX,Connection.cursorY,1)&&
                this.drawCursorTracking(this.ctx, Connection.playerCells, Connection.cursorX, Connection.cursorY);
            }
        }

    }
    application.ghostCells.length&&this.drawGhostCells(application)
    /*for(let i=0,len1 = application.tabs.length;len1>i;i++){
        //if(!application.tabs[i]) continue
        var Connection = application.tabs[i]
        settings.debug === true &&this.drawViewport(this.ctx, application.tabs[i].tabName+application.tabs[i].tabName+application.tabs[i].tabName+application.tabs[i].tabName, application.tabs[i].bound.left, application.tabs[i].bound.bottom, application.tabs[i].bound.right, application.tabs[i].bound.top, 'purple', 20);
    }*/


    for(let i=0,len1 = application.tabs.length;len1>i;i++){
        //if(!application.tabs[i]) continue
        for(let j=0;application.tabs[i].removedCells.length>j;j++){//len нельзя потому что удаление клетки в процессе и смещение индекса
            this.renderedObjects++
            this.drawCell(application.tabs[i].removedCells[j],true)

        }
        this.ctx.closePath();
    }


    for(let i=0,len = this.cellsFrame.length;len>i;i++){
        //this.cellsFrame[i]
        if(this.isInDisplay(this.cellsFrame[i].targetX,this.cellsFrame[i].targetY,this.cellsFrame[i].size) === false){
            continue;
        }
        this.renderedObjects++
        this.drawCell(this.cellsFrame[i],undefined, application.tabs[1])
    }
    //this.ctx.closePath();

    //delete this.cellsFrame
    //delete this.foodFrame
    this.cellsFrame = []
    this.foodFrame = []
    this.virusesFrame = []

        if(settings.debug){
            //this.drawViewport(this.ctx, 'Viewport '+application.tabs.indexOf(Connection), Connection.camMinX, Connection.camMinY, Connection.camMaxX, Connection.camMaxY, theme.bordersColor, 15);

            var polygonDiffViewport = [[[0,0],[0,0],[0,0],[0,0]]]
            var polygonUnionViewport = [[[0,0],[0,0],[0,0],[0,0]]]
                for(var j=0;application.tabs.length>j;j++){
                    var Connection = application.tabs[j]
                    if(!Connection) continue

                    continue
                    var Connection = application.tabs[j<2&&(Number(!application.activeTab))||j]
                    if(!Connection) continue

                    //this.drawViewport(this.ctx, 'Protocol Viewport '+application.tabs.indexOf(Connection), Connection.viewportMinX, Connection.viewportMinY, Connection.viewportMaxX, Connection.viewportMaxY, '#FF00FF', 15);
                    //this.drawViewport(this.ctx, 'Client Viewport '+application.tabs.indexOf(Connection), Connection.protocol_viewX - Connection.viewportW2s, Connection.protocol_viewY - Connection.viewportH2s, Connection.protocol_viewX + Connection.viewportW2s, Connection.protocol_viewY + Connection.viewportH2s, theme.bordersColor, 15);

                    var minX = Connection.protocol_viewX - Connection.viewportW2s
                    var maxY = Connection.protocol_viewY - Connection.viewportH2s
                    var maxX = Connection.protocol_viewX + Connection.viewportW2s
                    var minY = Connection.protocol_viewY + Connection.viewportH2s
                    //[[[minX,maxY],[minX, minY],[maxX, minY],[maxX,maxY]]]
                    
                    //this.drawPolygon(this.ctx, [[[[minX,maxY],[minX, minY],[maxX, minY],[maxX,maxY]]]],'red','green',1 )

                    //var uni = [mp[0]]
                    
                    Connection.unavailableViewport = polygonUnionViewport
                    //this.drawPolygon(this.ctx,polygonUnionViewport,'red','red',30)
                    var polygonViewport=[[[minX,maxY],[minX, minY],[maxX, minY],[maxX,maxY]]]
                        polygonDiffViewport = polygonClipping.difference(polygonViewport, polygonUnionViewport)
                        polygonUnionViewport = polygonClipping.union(polygonViewport, polygonUnionViewport)
                        //console.log(uni)
                        //this.drawPolygon(this.ctx,diff,'red','green',10)


                    //console.log(uni)
                    //this.drawPolygon(this.ctx,diff[0],'red','green',50)
                    
                    

                    //this.drawViewport(this.ctx, 'Client Viewport '+application.tabs.indexOf(Connection), Connection.viewMinX, Connection.viewMinY, Connection.viewMaxX, Connection.viewMaxY, theme.bordersColor, 15);
                    
                    //this.drawRing(this.ctx, Connection.viewX, Connection.viewY, 15, 1, '#ff00ff') 

                /*this.drawRing(this.ctx, minX, minY, 160, 1, '#ff00ff') 
                this.drawRing(this.ctx, maxX, maxY, 160, 1, '#ff00ff') 
                this.drawRing(this.ctx, maxX, minY, 160, 1, '#ff00ff') 
                this.drawRing(this.ctx, minX, maxY, 160, 1, '#ff00ff') */

            }
            //this.drawPolygon(this.ctx,polygonUnionViewport,'green','green',50)
        }
        Texts.cleaner()
        this.ctx.restore()
        if (activeTab.gameMode === `:teams`) {
            if (this.pieChart && this.pieChart.width) {
                this.ctx.drawImage(this.pieChart, this.canvasWidth - this.pieChart.width - 10, 10);
            }
        }

        if(settings.debug){
            this.ctx.fillStyle  = "white";
            this.ctx.font = "15px sans-serif";
            this.ctx.textAlign = "start";
            var lw=(this.canvasHeight/2)
            //this.ctx.fillText("playerID: "+polygonUnionViewport, 50, lw+=25);
            this.ctx.fillText("playerID: "+comm.playerID, 50, lw+=25);
            this.ctx.fillText("isFreeSpectate: "+activeTab.isFreeSpectate, 50, lw+=25);
            this.ctx.fillText("isSpectateEnabled: "+activeTab.isSpectateEnabled, 50, lw+=25);
            this.ctx.fillText("realQuadrant: "+activeTab.realQuadrant, 50, lw+=25);
            this.ctx.fillText("lastQuadrant: "+activeTab.lastQuadrant, 50, lw+=25);
            this.ctx.fillText("quadrant: "+activeTab.quadrant, 50, lw+=25);
            this.ctx.fillText("comm.lastMostLike: "+comm.lastMostLike, 50, lw+=25);
            this.ctx.fillText("renderedObjects: "+this.renderedObjects, 50, lw+=25);
            
            //Connection.camMaxX && this.ctx.fillText("cMaxX: "+Connection.camMaxX, 50, lw+=30);
            //Connection.camMaxY && this.ctx.fillText("cMaxY: "+Connection.camMaxY, 50, lw+=30);
            //Connection.camMinX && this.ctx.fillText("cMinX: "+Connection.camMinX, 50, lw+=30);
            //Connection.camMinY && this.ctx.fillText("cMinY: "+Connection.camMinY, 50, lw+=30);
        }
        //stats1.end()
        //this.pixiren.render(this.stage)
        
    },
    renderFrame2(){

                //stats1.begin();
        //await this.sleep(4)
        this.countFps();
        this.renderedObjects=0
        const activeTab = application.tab.master

        for(let i=0,len1 = application.tabs.length;len1>i;i++){
            //if(!application.tabs[i]) continue
            application.tabs[i].time = Date.now();
                for (var j = 0,length = application.tabs[i].cells.length; j < length; j++) {
                    application.tabs[i].cells[j].moveCell()
                    //if( !this.reverseCheckView(application.tabs[i].cells[j],i) ) {
                        this.cellsFrame.push(application.tabs[i].cells[j])
                        if(application.tabs[i].cells[j].isVirus) this.virusesFrame.push(application.tabs[i].cells[j])
                    //}
                    
                }
            if(application.tabs[i].playerCells.length) application.tabs[i].calculatePlayerMassAndPosition()
        }


         this.cellsFrame.sort((A, B) => A.size === B.size ? A.id - B.id : A.size - B.size);
         this.setView();

        
        for(var Connection of application.tabs){
            if(!Connection)continue
            if(application.tabs.indexOf(Connection) === 0){
                this.setCursorPosition(Connection);
            }
            //Connection.sortCellsBySize()
            //Connection.compareCells();
            //Connection.calcViewport()
        }

        //this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        if (settings.showGrid) {
            //this.drawGrid(this.ctx, this.canvasWidth, this.canvasHeight, this.scale, this.camX, this.camY);
        }

         this.app.stage.scale = new PIXI.Point(this.scale, this.scale);
         this.app.stage.pivot.x=this.camX
         this.app.stage.pivot.y=this.camY
         this.app.stage.x=(this.canvasWidth /2)
         this.app.stage.y=(this.canvasHeight /2)
         //this.ctx.imageSmoothingEnabled = true
         //this.ctx.imageSmoothingQuality = "high"
        //for(var Connection of application.tabs){
/*

        if(activeTab.mapOffsetFixed === true && Settings.customMapTextureCanvas.complet === true){
            settings.showGrid === true && (this.ctx.globalCompositeOperation = 'destination-over')
            this.ctx.drawImage(Settings.customMapTextureCanvas, activeTab.mapMinX, activeTab.mapMaxY, activeTab.mapMaxX-activeTab.mapMinX, activeTab.mapMinY-activeTab.mapMaxY);
            settings.showGrid === true && (this.ctx.globalCompositeOperation = 'source-over')
        }
        if (settings.showBgSectors === true) {
            this.drawSectors(this.ctx, activeTab.mapOffsetFixed, theme.sectorsX, theme.sectorsY, activeTab.mapMinX, activeTab.mapMinY, activeTab.mapMaxX, activeTab.mapMaxY, theme.gridColor, theme.sectorsColor, theme.sectorsWidth, true);
        }



        if(activeTab.mapOffsetFixed === true&& Settings.customMapLogoCanvas.complet === true){
            this.ctx.globalAlpha = 0.2
            var ofx = ((activeTab.mapMaxX-activeTab.mapMinX)/5)*2.2
            var ofy = ((activeTab.mapMinY-activeTab.mapMaxY)/5)*2.2

            this.ctx.drawImage(
                Settings.customMapLogoCanvas,  //2.1:5.9
                activeTab.mapMinX+ofx, 
                activeTab.mapMaxY+ofy, 
                (activeTab.mapMaxX-activeTab.mapMinX)/8.5, 
                (activeTab.mapMinY-activeTab.mapMaxY)/8.5
            );
            this.ctx.globalAlpha = 1
        }
        if (activeTab.gameMode === ':battleroyale') {
            this.drawBattleArea(this.ctx);
        }
        if (settings.showMapBorders === true) {
            const borderWidth = theme.bordersWidth >> 1;
            this.drawMapBorders(this.ctx, activeTab.mapOffsetFixed, activeTab.mapMinX - borderWidth, activeTab.mapMinY - borderWidth, activeTab.mapMaxX + borderWidth, activeTab.mapMaxY + borderWidth, theme.bordersColor, theme.bordersWidth);
        }
        if (settings.virusesRange === true) {
             this.drawVirusesRange(this.ctx, this.virusesFrame);
        }
        for(let i=0,len1 = application.tabs.length;len1>i;i++){
            //if(!application.tabs[i]) continue
             this.drawFood(application.tabs[i],i);
        }*/
        for(let i=0,len1 = application.tabs.length;len1>i;i++){
            //if(!application.tabs[i]) continue
            //this.graphics.lineStyle(0); // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
            //this.graphics.beginFill(parseInt(theme.foodColor.slice(1), 16), 1);
            for(let j=0,len=application.tabs[i].food.length;len>j;j++){

                if( this.reverseCheckView(application.tabs[i].food[j],i))continue

                this.renderedObjects++
                const food = application.tabs[i].food[j]
                food.renderPixi()
                //this.graphics.drawCircle(food.x, food.y, food.size + theme.foodSize);
                
            }

            //this.ctx.fillStyle = theme.foodColor;
            //this.graphics.endFill();
        }
        /*for(let i=0,len1 = application.tabs.length;len1>i;i++){
            //if(!application.tabs[i]) continue
            this.graphics.lineStyle(0); // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
            this.graphics.beginFill(parseInt(theme.foodColor.slice(1), 16), 1);
            for(let j=0,len=application.tabs[i].food.length;len>j;j++){

                if( this.reverseCheckView(application.tabs[i].food[j],i))continue

                this.renderedObjects++
                const food = application.tabs[i].food[j]
                this.graphics.drawCircle(food.x, food.y, food.size + theme.foodSize);
                
            }

            //this.ctx.fillStyle = theme.foodColor;
            this.graphics.endFill();
        }*/

    /*for(let i=0,len1 = application.tabs.length;len1>i;i++){
        //if(!application.tabs[i]) continue
        const Connection = application.tabs[i]
        settings.debug&&this.drawViewport(this.ctx, 'Bound '+application.tabs[i].tabName, Connection.bound.left, Connection.bound.bottom, Connection.bound.right, Connection.bound.top, 'red', 20);
        //_Connection && _Connection.play && this.drawCircles(this.ctx, _Connection.playerCells, 150, 5, 0.75, `#00FFFF`);
        if (Connection && Connection.play && i === 0) {
            if (settings.splitRange) {
                this.drawSplitRange(this.ctx, Connection.biggerSTECellsCache, Connection.playerCells, tempsett.selectBiggestCell);
            }
            if (settings.oppRings) {
                this.drawOppRings(this.ctx, this.scale, Connection.biggerSTECellsCache, Connection.biggerCellsCache, Connection.smallerCellsCache, Connection.STECellsCache);
            }
            if (settings.cursorTracking) {
                //Connection.isInViewport(Connection.cursorX,Connection.cursorY,1)&&
                this.drawCursorTracking(this.ctx, Connection.playerCells, Connection.cursorX, Connection.cursorY);
            }
        }

    }
    application.ghostCells.length&&this.drawGhostCells(application)*/
    /*for(let i=0,len1 = application.tabs.length;len1>i;i++){
        //if(!application.tabs[i]) continue
        var Connection = application.tabs[i]
        settings.debug === true &&this.drawViewport(this.ctx, application.tabs[i].tabName+application.tabs[i].tabName+application.tabs[i].tabName+application.tabs[i].tabName, application.tabs[i].bound.left, application.tabs[i].bound.bottom, application.tabs[i].bound.right, application.tabs[i].bound.top, 'purple', 20);
    }*/


    /*for(let i=0,len1 = application.tabs.length;len1>i;i++){
        //if(!application.tabs[i]) continue
        for(let j=0;application.tabs[i].removedCells.length>j;j++){//len нельзя потому что удаление клетки в процессе и смещение индекса
            this.renderedObjects++
            application.tabs[i].removedCells[j].draw(this.ctx, true);

        }
        this.ctx.closePath();
    }*/


    for(let i=0,len = this.cellsFrame.length;len>i;i++){
        //this.cellsFrame[i]
        if(this.isInDisplay(this.cellsFrame[i].targetX,this.cellsFrame[i].targetY,this.cellsFrame[i].size) === false){
            continue;
        }
        //this.renderedObjects++
        //  this.cellsFrame[i].draw(this.ctx, undefined, application.tabs[1]);
        this.cellsFrame[i].renderPixi()
    }
    //this.ctx.closePath();

 
    this.cellsFrame = []
    this.foodFrame = []
    this.virusesFrame = []


        //Texts.cleaner()
        //this.ctx.restore()
        /*if (activeTab.gameMode === `:teams`) {
            if (this.pieChart && this.pieChart.width) {
                this.ctx.drawImage(this.pieChart, this.canvasWidth - this.pieChart.width - 10, 10);
            }
        }*/

        //stats1.end()
        this.app.renderer.render(this.app.stage)
        this.graphics.clear()
    },
























































    renderFrame___() {
        this.renderedObjects=0

        
        for(var Connection of application.tabs){if(!Connection) continue;
            Connection.time = Date.now();
            for (var i = 0,length = Connection.cells.length; i < length; i++) {
                Connection.cells[i].moveCell();
                Connection.updateBound()
                Connection.updateStaticBound(Connection.cells[i])
            }
            if(Connection.playerCells.length) Connection.calculatePlayerMassAndPosition()
            
        }
        this.setView();
        /*this.app.stage.scale = new PIXI.Point(this.scale, this.scale);
        this.app.stage.pivot.x=this.camX
        this.app.stage.pivot.y=this.camY
        this.app.stage.x=(this.canvasWidth / 2)
        this.app.stage.y=(this.canvasHeight / 2)*/

        for(var Connection of application.tabs){
            if(!Connection)continue

            if(application.tabs.indexOf(Connection) == application.activeTab){
                this.setCursorPosition(Connection);
            }
      
            Connection.sortCellsBySize()
            Connection.compareCells();
            //Connection.calcViewport()
        }

        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        if (settings.showGrid) {
            this.drawGrid(this.ctx, this.canvasWidth, this.canvasHeight, this.scale, this.camX, this.camY);
        }

        this.ctx.save();
        this.ctx.translate(this.canvasWidth / 2, this.canvasHeight / 2);
        this.ctx.scale(this.scale, this.scale);
        this.ctx.translate(-this.camX, -this.camY);
        //this.ctx.imageSmoothingEnabled = false
        //for(var Connection of application.tabs){


              
        Connection=application.tabs[0]
        if(Connection.mapOffsetFixed && Settings.customMapTextureCanvas.complet){
            settings.showGrid && (this.ctx.globalCompositeOperation = 'destination-over')
            this.ctx.drawImage(Settings.customMapTextureCanvas, Connection.mapMinX, Connection.mapMaxY, Connection.mapMaxX-Connection.mapMinX, Connection.mapMinY-Connection.mapMaxY);
            settings.showGrid && (this.ctx.globalCompositeOperation = 'source-over')
        }
        if (settings.showBgSectors) {
            this.drawSectors(this.ctx, Connection.mapOffsetFixed, theme.sectorsX, theme.sectorsY, ~~Connection.mapMinX, ~~Connection.mapMinY, ~~Connection.mapMaxX, ~~Connection.mapMaxY, theme.gridColor, theme.sectorsColor, theme.sectorsWidth, true);
        }
        if(Connection.mapOffsetFixed && Settings.customMapLogoCanvas.complet){
            //settings.showGrid && (this.ctx.globalCompositeOperation = 'destination-over')
            this.ctx.globalAlpha = 0.2
            var ofx = ((Connection.mapMaxX-Connection.mapMinX)/5)*2.2
            var ofy = ((Connection.mapMinY-Connection.mapMaxY)/5)*2.2
            this.ctx.drawImage(
                Settings.customMapLogoCanvas,  //2.1:5.9
                Connection.mapMinX+ofx, 
                Connection.mapMaxY+ofy, 
                (Connection.mapMaxX-Connection.mapMinX)/8.5, 
                (Connection.mapMinY-Connection.mapMaxY)/8.5
            );
            this.ctx.globalAlpha = 1
            //settings.showGrid && (this.ctx.globalCompositeOperation = 'source-over')
        }
        if (Connection.gameMode === ':battleroyale') {
            this.drawBattleArea(this.ctx);
        }
        if (settings.showMapBorders) {
            const borderWidth = theme.bordersWidth / 2;
            this.drawMapBorders(this.ctx, Connection.mapOffsetFixed, Connection.mapMinX - borderWidth, Connection.mapMinY - borderWidth, Connection.mapMaxX + borderWidth, Connection.mapMaxY + borderWidth, theme.bordersColor, theme.bordersWidth);
        }
        application.eachTabByPriority((Connection,_Connection,priority,index)=>{
            if (settings.virusesRange) {
                this.drawVirusesRange(this.ctx, Connection.viruses, Connection,_Connection);
            }
        })



    application.eachTabByPriority((Connection,_Connection,priority)=>{
            this.drawFood(Connection,_Connection);
    })
    application.eachTabByPriority((Connection,_Connection,priority)=>{
        //_Connection && _Connection.play && this.drawCircles(this.ctx, _Connection.playerCells, 150, 5, 0.75, `#00FFFF`);
        if (Connection&& Connection.play && priority == 0) {
            if (settings.splitRange) {
                this.drawSplitRange(this.ctx, Connection, Connection.selectBiggestCell);
            }
            if (settings.oppRings) {
                this.drawOppRings(this.ctx, this.scale, Connection);
            }
            if (settings.cursorTracking) {
                
                //Connection.isInViewport(Connection.cursorX,Connection.cursorY,1)&&
                this.drawCursorTracking(this.ctx, Connection.playerCells, Connection.cursorX, Connection.cursorY);
            }
        }

    })
    application.eachTabByPriority((Connection,_Connection,priority)=>{
        priority == 0&&this.drawGhostCells(Connection,_Connection);
    })



    application.eachTabByPriority((Connection,_Connection,priority)=>{
        for (var i = 0; i < Connection.removedCells.length; i++) {
            if(_Connection && _Connection.isInViewport(Connection.removedCells[i].targetX,Connection.removedCells[i].targetY,0/*Connection.removedCells[i].size*/))
            continue;
            this.drawCell(Connection.removedCells[i], true);
        }
    })



   /* for(var Connection of application.tabs){
        if(!Connection)continue
        Connection.updateBound()
        for( var i in Connection.indexedCells) Connection.updateStaticBound(Connection.indexedCells[i])
        this.drawViewport(this.ctx, 'Bound '+application.tabs.indexOf(Connection), Connection.bound.left, Connection.bound.bottom, Connection.bound.right, Connection.bound.top, 'purple', 20);
    }*/

   /* var polygonDiffViewport = [[[0,0],[0,0],[0,0],[0,0]]]
    var polygonUnionViewport = [[[0,0],[0,0],[0,0],[0,0]]]
        for(var i=0;application.tabs.length>i;i++){
            var Connection = application.tabs[i]//application.tabs[application.activeTab==1&&i==1?0:application.activeTab==1&&i==0?1:i]//application.tabs[application.activeTab==1&&i==1?0:application.activeTab==0&&i==0?1:i]//application.tabs[i<2&&(Number(!application.activeTab))||i]
            //console.log(application.activeTab==1&&i==1?0:application.activeTab==1&&i==0?1:i,Connection)
            if(!Connection) continue

            Connection.updateBound()
            for( var j in Connection.indexedCells) Connection.updateStaticBound(Connection.indexedCells[j])
            //console.log(application.tabs.indexOf(Connection),i)
            this.drawViewport(this.ctx, 'Bound '+application.tabs.indexOf(Connection), Connection.bound.left, Connection.bound.bottom, Connection.bound.right, Connection.bound.top, 'purple', 20);
     
           //this.drawViewport(this.ctx, 'Identify as '+application.tabs.indexOf(Connection), Connection.protocol_viewX - Connection.viewportW2s, Connection.protocol_viewY - Connection.viewportH2s, Connection.protocol_viewX + Connection.viewportW2s, Connection.protocol_viewY + Connection.viewportH2s, 'transparent', 15);
            var minX = Connection.protocol_viewX - Connection.viewportW2s
            var maxY = Connection.protocol_viewY - Connection.viewportH2s
            var maxX = Connection.protocol_viewX + Connection.viewportW2s
            var minY = Connection.protocol_viewY + Connection.viewportH2s

            
            Connection.unavailableViewport = polygonUnionViewport
            this.drawPolygon(this.ctx,polygonUnionViewport,'red','red',30)
            //var polygonViewport=[[[minX,maxY],[minX, minY],[maxX, minY],[maxX,maxY]]]
            var polygonViewport=[[[Connection.bound.left,Connection.bound.top],[Connection.bound.left, Connection.bound.bottom],[Connection.bound.right, Connection.bound.bottom],[Connection.bound.right,Connection.bound.top]]]
                //Connection.availableViewport = polygonDiffViewport = polygonClipping.difference(polygonViewport, polygonUnionViewport)
               // console.log(i,Connection.availableViewport)
             polygonUnionViewport = polygonClipping.union(polygonViewport, polygonUnionViewport)

    }
    this.drawPolygon(this.ctx,polygonUnionViewport,'green','green',40)*/

    application.eachTabByPriority((Connection,_Connection,priority,index)=>{
        /*this.graphics.clear();
        this.graphics.lineStyle(1);
        this.graphics.beginFill(0xFFFF0B, 0.5);*/
        //console.log(Connection,_Connection)
        //Connection.calcViewport()
        for (const cell of Connection.cells) {
            if(_Connection){
                //if(_Connection.isInViewport(cell.targetX,cell.targetY,cell.size  ))
                if(_Connection.isInViewHSLO(cell))
                continue
            }
            if(!this.isInDisplay(cell.targetX,cell.targetY,cell.size)){
                continue;
            }
            this.renderedObjects++
            //try{
                //this.drawPolygon(this.ctx,Connection.availableViewport,'green','green',50)
            //!drawRender.poinInPolygon(cell.targetX,cell.targetY,Connection.unavailableViewport[0][0]) && 
            this.drawCell(cell,undefined,index == application.activeTab && application.tabs[1]);
           // }catch(e){
                //console.log('error')
            //}

            //var x1 = Connection.cells[length].targetX//((Connection.cells[length].targetX-this.camX)*this.scale)+this.canvasWidth / 2
            //var y1 = Connection.cells[length].targetY//((Connection.cells[length].targetY-this.camY)*this.scale)+this.canvasHeight / 2
            //this.graphics.drawCircle(x1,y1,Connection.cells[length].size);

        }
    //}
    })

    /*var isInView = function(cell,n){
        return application.tabs[n].isInViewHSLO(cell)
    }

    for (const cell of application.tabs[0].cells) {
        if(application.tabs[2]){
            !application.tabs[2].isInViewHSLO(cell) && cell.draw(this.ctx, undefined);
            continue
        }
        if(application.tabs[1]){
            !application.tabs[1].isInViewHSLO(cell) && cell.draw(this.ctx, undefined);
            continue
        }
        cell.draw(this.ctx, undefined);
    }

    if(application.tabs[1]) for (const cell of application.tabs[1].cells) {
        var can = false
        application.tabs[0].isInViewHSLO(cell)&&(can=true)
        application.tabs[2]&&application.tabs[2].isInViewHSLO(cell)&&can==false&&(can=true)
        application.tabs[2]&&application.tabs[0].isInViewHSLO(cell)&&application.tabs[2].isInViewHSLO(cell)&&(can=true)
        can && cell.draw(this.ctx, undefined);
    }

    if(application.tabs[2]) for (const cell of application.tabs[2].cells) {

        var can = true
        !application.tabs[0].isInViewHSLO(cell) && !application.tabs[1].isInViewHSLO(cell) && cell.draw(this.ctx, undefined);
        //!application.tabs[1].isInViewHSLO(cell) && (can=false)

        can && cell.draw(this.ctx, undefined);
    }*/
    /*for (const cell of application.tabs[2].cells) {
        cell.draw(this.ctx, undefined);
    }*/


    /*for (const cell of application.tabs[0].cells) {
        if(application.tabs[2]){
            var a = application.tabs[2].isInViewHSLO(cell)
            var b = application.tabs[1].isInViewHSLO(cell)
            if( (!a || !b)  ) cell.draw(this.ctx, undefined);
        }else if(application.tabs[1]){
            var r = application.tabs[1].isInViewHSLO(cell)
            if(!r) cell.draw(this.ctx, undefined);
        }else{
            cell.draw(this.ctx, undefined);
        }
    }
    
    if(application.tabs[1]) for (const cell of application.tabs[1].cells) {
        if(application.tabs[2]){

            if(application.tabs[0].isInViewHSLO(cell)) cell.draw(this.ctx, undefined)
            else
            if(!application.tabs[2].isInViewHSLO(cell)) cell.draw(this.ctx, undefined)
            else cell.draw(this.ctx, undefined)

            //( application.tabs[0].isInViewHSLO(cell) || !application.tabs[2].isInViewHSLO(cell) ) && cell.draw(this.ctx, undefined); //правильно
        }else if(application.tabs[0]){
            application.tabs[0].isInViewHSLO(cell) && cell.draw(this.ctx, undefined);
        }
        
    }

    if(application.tabs[2]) for (const cell of application.tabs[2].cells) {
        //if(!(application.tabs[0].isInViewHSLO(cell) || application.tabs[1].isInViewHSLO(cell))) 
        //if(!application.tabs[0].isInViewport2(cell.targetX,cell.targetY,cell.size))
        var w0 = application.tabs[0].isInViewHSLO(cell)
        var w1 = application.tabs[1].isInViewHSLO(cell)
        if( !(w0&&w1) ) cell.draw(this.ctx, undefined)
        else
        if( !w1 ) cell.draw(this.ctx, undefined)
        //cell.draw(this.ctx, undefined)

    }*/

        if(settings.debug){
            //this.drawViewport(this.ctx, 'Viewport '+application.tabs.indexOf(Connection), Connection.camMinX, Connection.camMinY, Connection.camMaxX, Connection.camMaxY, theme.bordersColor, 15);

            var polygonDiffViewport = [[[0,0],[0,0],[0,0],[0,0]]]
            var polygonUnionViewport = [[[0,0],[0,0],[0,0],[0,0]]]
                for(var i=0;application.tabs.length>i;i++){
                    var Connection = application.tabs[i]
                    if(!Connection) continue

                    continue
                    var Connection = application.tabs[i<2&&(Number(!application.activeTab))||i]
                    if(!Connection) continue

                    //this.drawViewport(this.ctx, 'Protocol Viewport '+application.tabs.indexOf(Connection), Connection.viewportMinX, Connection.viewportMinY, Connection.viewportMaxX, Connection.viewportMaxY, '#FF00FF', 15);
                    //this.drawViewport(this.ctx, 'Client Viewport '+application.tabs.indexOf(Connection), Connection.protocol_viewX - Connection.viewportW2s, Connection.protocol_viewY - Connection.viewportH2s, Connection.protocol_viewX + Connection.viewportW2s, Connection.protocol_viewY + Connection.viewportH2s, theme.bordersColor, 15);

                    var minX = Connection.protocol_viewX - Connection.viewportW2s
                    var maxY = Connection.protocol_viewY - Connection.viewportH2s
                    var maxX = Connection.protocol_viewX + Connection.viewportW2s
                    var minY = Connection.protocol_viewY + Connection.viewportH2s
                    //[[[minX,maxY],[minX, minY],[maxX, minY],[maxX,maxY]]]
                    
                    //this.drawPolygon(this.ctx, [[[[minX,maxY],[minX, minY],[maxX, minY],[maxX,maxY]]]],'red','green',1 )

                    //var uni = [mp[0]]
                    
                    Connection.unavailableViewport = polygonUnionViewport
                    //this.drawPolygon(this.ctx,polygonUnionViewport,'red','red',30)
                    var polygonViewport=[[[minX,maxY],[minX, minY],[maxX, minY],[maxX,maxY]]]
                        polygonDiffViewport = polygonClipping.difference(polygonViewport, polygonUnionViewport)
                        polygonUnionViewport = polygonClipping.union(polygonViewport, polygonUnionViewport)
                        //console.log(uni)
                        //this.drawPolygon(this.ctx,diff,'red','green',10)


                    //console.log(uni)
                    //this.drawPolygon(this.ctx,diff[0],'red','green',50)
                    
                    

                    //this.drawViewport(this.ctx, 'Client Viewport '+application.tabs.indexOf(Connection), Connection.viewMinX, Connection.viewMinY, Connection.viewMaxX, Connection.viewMaxY, theme.bordersColor, 15);
                    
                    //this.drawRing(this.ctx, Connection.viewX, Connection.viewY, 15, 1, '#ff00ff') 

                /*this.drawRing(this.ctx, minX, minY, 160, 1, '#ff00ff') 
                this.drawRing(this.ctx, maxX, maxY, 160, 1, '#ff00ff') 
                this.drawRing(this.ctx, maxX, minY, 160, 1, '#ff00ff') 
                this.drawRing(this.ctx, minX, maxY, 160, 1, '#ff00ff') */

            }
            //this.drawPolygon(this.ctx,polygonUnionViewport,'green','green',50)
        }
        this.ctx.restore();
        if (application.tabs[0].gameMode === `:teams`) {
            if (this.pieChart && this.pieChart.width) {
                this.ctx.drawImage(this.pieChart, this.canvasWidth - this.pieChart.width - 10, 10);
            }
        }

        if(settings.debug){
            this.ctx.fillStyle  = "white";
            this.ctx.font = "15px sans-serif";
            this.ctx.textAlign = "start";
            var lw=(this.canvasHeight/2)
            //this.ctx.fillText("playerID: "+polygonUnionViewport, 50, lw+=25);
            this.ctx.fillText("playerID: "+comm.playerID, 50, lw+=25);
            this.ctx.fillText("isFreeSpectate: "+application.tabs[0].isFreeSpectate, 50, lw+=25);
            this.ctx.fillText("isSpectateEnabled: "+application.tabs[0].isSpectateEnabled, 50, lw+=25);
            this.ctx.fillText("realQuadrant: "+application.tabs[0].realQuadrant, 50, lw+=25);
            this.ctx.fillText("lastQuadrant: "+application.tabs[0].lastQuadrant, 50, lw+=25);
            this.ctx.fillText("quadrant: "+application.tabs[0].quadrant, 50, lw+=25);
            this.ctx.fillText("comm.lastMostLike: "+comm.lastMostLike, 50, lw+=25);
            this.ctx.fillText("renderedObjects: "+this.renderedObjects, 50, lw+=25);
            
            //Connection.camMaxX && this.ctx.fillText("cMaxX: "+Connection.camMaxX, 50, lw+=30);
            //Connection.camMaxY && this.ctx.fillText("cMaxY: "+Connection.camMaxY, 50, lw+=30);
            //Connection.camMinX && this.ctx.fillText("cMinX: "+Connection.camMinX, 50, lw+=30);
            //Connection.camMinY && this.ctx.fillText("cMinY: "+Connection.camMinY, 50, lw+=30);
        }
        //this.pixiren.render(this.stage)
    },
    drawViewport:function(ctx, text, minX, maxY, maxX, minY, stroke, width){

        ctx.strokeStyle = stroke;
        ctx.lineWidth = width;

        ctx.fillStyle  = "white";
        ctx.font = "100px sans-serif";
        ctx.textAlign = "end";
        ctx.textBaseline = "hanging"

        ctx.beginPath();
        ctx.moveTo(minX, maxY);
        ctx.lineTo(maxX, maxY);
        ctx.lineTo(maxX, minY);
        ctx.lineTo(minX, minY);
        ctx.closePath();
        ctx.stroke();
        ctx.fillText(text, maxX, maxY);
    },
    drawPolygon(ctx, m_polygon, strokeStyle, fillStyle,h) {
        ctx.lineWidth = h
        ctx.strokeStyle = strokeStyle;
        ctx.fillStyle = fillStyle;
        ctx.font = "100px sans-serif";
        ctx.textAlign = "end";
        ctx.textBaseline = "hanging"
        //ctx.globalAlpha=0.5
        ctx.beginPath();
        for(var j=0;m_polygon.length>j;j++){
            //console.log(0)
            var polygon = m_polygon[j][0]
            ctx.moveTo(polygon[0][0],polygon[0][1]); 
                for (var i = 1; i < polygon.length ; i++){
                    //console.log(1)
                    ctx.lineTo(polygon[i][0],polygon[i][1]);  
                }
                ctx.lineTo(polygon[0][0],polygon[0][1]);
        }
        ctx.stroke();
        ctx.closePath();
    },
    poinInPolygon(x, y, vs) {
        // ray-casting algorithm based on
        // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
        
        var inside = false;
        for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
            var xi = vs[i][0], yi = vs[i][1];
            var xj = vs[j][0], yj = vs[j][1];

            var intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        
        return inside;
    },
    pointInCircle: function(x, y, cx, cy, radius) {
        var distancesquared = (x - cx) * (x - cx) + (y - cy) * (y - cy);
        return distancesquared <= radius * radius;
    },
    isInDisplay: function(x, y, size){
        //if(!settings.experimental1){return true}
        const x2s = (this.canvasWidth  >>1) / this.scale
        const y2s = (this.canvasHeight >>1) / this.scale

        /*  var q0 = [x2s + this.camX, -y2s + this.camY]
            var q1 = [-x2s + this.camX, -y2s + this.camY]
            var q2 = [-x2s + this.camX, y2s + this.camY]
            var q3 = [x2s + this.camX, y2s + this.camY]
        */
            if (x + size < this.camX - x2s 
                || y + size < this.camY - y2s 
                || x - size > this.camX + x2s 
                || y - size > this.camY + y2s) {
                return false;
            }
            return true;
    },
    
    setAutoHideCellInfo(size) {
        if (size <= 40 || this.scale < 0.5 && size < 550 && size < /*25*/ 20  / this.scale) {
            return true;
        }
        return false;
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
        ctx.strokeStyle = theme.gridColor;
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
        if (type || !type && settings.showMiniMapGrid) {
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
            ctx.font = theme.sectorsFontWeight+' '+theme.sectorsFontSize+'px '+theme.sectorsFontFamily;
        } else {
            ctx.font = `${theme.miniMapFontWeight} ${~~(0.4 * posY)}px ${theme.miniMapFontFamily}`;
        }
        ctx.textAlign = 'center';
        ctx.textBaseline = `middle`;

        for (var length = 0; length < y; length++) {
            for (let length_2 = 0; length_2 < x; length_2++) {
                const text = String.fromCharCode(65 + length) + (length_2 + 1);
                rePosX = ~~(minX + posX / 2 + length_2 * posX);
                rePosY = ~~(minY + posY / 2 + length * posY);
                //console.log(rePosY)
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
    drawVirusesRange(ctx, viruses, Connection,_Connection) {
        if (!viruses || !viruses.length) {
            return;
        }
        ctx.beginPath();
        for (let length = 0; length < viruses.length; length++) {
            const x = viruses[length].x;
            const y = viruses[length].y;
            const size = viruses[length].size + 820
            //if(_Connection && _Connection.isInViewport(x,y,size))
            //continue;
            ctx.moveTo(x, y);
            ctx.arc(x, y, size, 0, this.pi2, false);
        }
        ctx.fillStyle = theme.virusColor;
        ctx.globalAlpha = 0.1;
        ctx.fill();
        ctx.globalAlpha = 1;
        /*if (reset) {
            viruses = [];
        }*/
    },
    anotherFoodDrawer(){
        for(let i=0,len1 = application.tabs.length;len1>i;i++){
            //if(!application.tabs[i]) continue
            this.ctx.beginPath();
            for(let j=0,len=application.tabs[i].food.length;len>j;j++){

                if( this.reverseCheckView(application.tabs[i].food[j],i))continue
                this.renderedObjects++
                const food = application.tabs[i].food[j]
                var x = ((food.x-(this.camX))*this.scale) + (this.canvasWidth >> 1)
                var y = ((food.y-(this.camY))*this.scale) + (this.canvasHeight >> 1)
                this.ctx.moveTo(x, y);
                if (this.scale < 0.16) {
                    const size = (food.size + theme.foodSize)*this.scale;
                    this.ctx.rect(x - size, y - size, 2 * size, 2 * size);
                    continue;
                }
                this.ctx.arc(x, y, (food.size + theme.foodSize)*this.scale, 0, this.pi2, false);
            }

            this.ctx.fillStyle = '#ff0000';
            this.ctx.globalAlpha = 1;
            this.ctx.fill();
        }
    },
    drawFood(Connection,index) {
        if (!Connection || !tempsett.showFood || settings.autoHideFoodOnZoom && this.scale < 0.2) {
            return;
        }
        if (settings.autoHideFood && !tempsett.foodIsHidden && Connection.playerMass > 1000) {
            tempsett.showFood = false;
            tempsett.foodIsHidden = true;
            return;
        }
        if (!settings.rainbowFood) {
            this.drawCachedFood(this.ctx, Connection, index);
            return;
        }
        for (let i = 0; i < Connection.food.length; i++) {
            //if(!this.isInDisplay(Connection.food[i].targetX,Connection.food[i].targetY,0)){continue}
            //if( this.reverseCheckView(Connection.food[i],index))continue
            this.renderedObjects++
            //Connection.food[i].moveCell();
            this.drawCell(Connection.food[i]);
        }
    },
    drawCell(cell, update, drawRing){
        //let this.ctx=this.ctx;
        /*if (cell.c.hideSmallBots && cell.size <= 36) {
            return;
        }*/
        //return;
        //ctx.save();
        cell.redrawed++;
        if (update) {
            cell.moveCell();
        }
        const startAlpha = this.ctx.globalAlpha
        if (cell.removed) {
            this.ctx.globalAlpha *= 1 - cell.alpha;
            //ctx.globalAlpha = ctx.globalAlpha * (1 - cell.alpha);
        }


        const alpha = this.ctx.globalAlpha;
        let isAplha = false;
        const size = (cell.isFood ? cell.size + theme.foodSize : cell.size);

        this.ctx.beginPath();
        this.ctx.arc(cell.x, cell.y, size, 0, cell.pi2, false);
        //this.ctx.closePath(); // не указан в конце цикла отрисоки шаров

        if (cell.isFood) {
            this.ctx.fillStyle = cell.color;
            this.ctx.fill();
            this.ctx.globalAlpha = startAlpha
            //ctx.restore();
            return;
        }
        if (cell.isVirus) {
            if (settings.transparentViruses) {
                this.ctx.globalAlpha *= theme.virusAlpha;
                //ctx.globalAlpha = ctx.globalAlpha * theme.virusAlpha;
                isAplha = true;
            }
            if (settings.virColors && cell.c.play) {
                this.ctx.fillStyle = application.setVirusColor(size);
                this.ctx.strokeStyle = application.setVirusStrokeColor(size);
            } else {
                this.ctx.fillStyle = theme.virusColor;
                this.ctx.strokeStyle = theme.virusStrokeColor
            }

            if(cell.size >= 148) this.ctx.fillStyle = `#000000`;// Определения Mothercell
            this.ctx.fill();
            if (isAplha) {
                this.ctx.globalAlpha = alpha;
                isAplha = false;
            }
            this.ctx.lineWidth = theme.virusStrokeSize;
            this.ctx.stroke();
            if(settings.virMassType === 0){
                // OFF
            } else if(settings.virMassType === 3 && cell.size < 148){
                // SIMPLE
                this.ctx.fillStyle = this.ctx.strokeStyle
                this.ctx.beginPath();
                this.ctx.arc(cell.x, cell.y , (3 * (cell.size - 100)), 0, cell.pi2, true);
                this.ctx.closePath();
                this.ctx.fill();
            } else {
                // SHORT, FULL
                cell.mass = ~~(cell.size * cell.size / 100);
                var massCanvas = Texts.mass(cell)
                if(massCanvas){
                    var sWidth = massCanvas.originW  * cell.size * theme.virMassScale
                    var sHeight = massCanvas.originH * cell.size * theme.virMassScale
                    this.ctx.drawImage(massCanvas, ~~(cell.x - (sWidth >> 1))  , ~~(cell.y - (sHeight >> 1)), ~~sWidth, ~~sHeight);
                }
            }



            this.ctx.globalAlpha = startAlpha
            //ctx.restore();
            return;
        }
        if (settings.transparentCells) {
            this.ctx.globalAlpha *= theme.cellsAlpha;
            //ctx.globalAlpha = ctx.globalAlpha * theme.cellsAlpha;
            isAplha = true;
        }
        let color = cell.color;
        if (application.play) {
            if (cell.isPlayerCell) {
                if (settings.myCustomColor) {
                    color = profiles.masterProfile.color;
                }
            } else if (settings.oppColors && !settings.oppRings) {
                color = cell.oppColor;
            }
        }
        this.ctx.fillStyle = color;
        this.ctx.fill();

        if (isAplha) {
            this.ctx.globalAlpha = alpha;
            isAplha = false;
        }
        let skin = null;
        if(tempsett.showAnySkins){
            //if (settings.customSkins && tempsett.showCustomSkins) {
            //skin = comm.getCustomSkin(cell.targetNick, cell.color);
            if(settings.customSkins) skin = Texture.getCustomSkin(cell.targetNick);
            if(!skin && settings.vanillaSkins) {if(cell.hasVanillaCustomSkin) {skin = Texture.getVanillaCustomSkin(cell.skin)}else{skin = Texture.getVanillaSkin(cell.skin)}}
            if (skin) {
                if ((settings.transparentSkins || cell.c.play && settings.oppColors) && !(cell.isPlayerCell && !settings.myTransparentSkin) || cell.isPlayerCell && settings.myTransparentSkin) {
                    this.ctx.globalAlpha *= theme.skinsAlpha;
                    //ctx.globalAlpha = ctx.globalAlpha* theme.skinsAlpha;
                    isAplha = true;
                }
                this.ctx.drawImage(skin, (cell.x - size), (cell.y - size), (2*size), (2*size));
                if (isAplha) {
                    this.ctx.globalAlpha = alpha;
                    isAplha = false;
                }
            }
            //}

        }

        if (settings.teammatesInd && !cell.isPlayerCell && size <= 200 && (skin || Texture.skinMap.has(cell.targetNick))) {//comm.checkSkinsMap(cell.targetNick, cell.color))) {
            this.drawTeammatesInd(this.ctx, ~~cell.x, ~~cell.y, size);
        }
        /*if (settings.noNames && !settings.showMass || update) {
            //ctx.restore();
            return;
        }*/
        let hideCells = false;
        if (!cell.isPlayerCell) {
            hideCells = this.setAutoHideCellInfo(size);
            if (hideCells && settings.autoHideNames && settings.autoHideMass) {
                this.ctx.globalAlpha = startAlpha
                return;
            }
        }

        //if(cell.isPlayerCell && drawRing && settings.mbRings && application.activeTab === cell.c.type){
        if(settings.mbRings && cell.playerOriginTab >-1 && drawRing){
            const cellBorder = (size/100*theme.mbRingWidth)
            this.ctx.lineWidth = cellBorder
            this.ctx.globalAlpha = alpha;
            this.ctx.strokeStyle = (application.activeTab === cell.playerOriginTab ? theme.mboxActiveCellStroke : theme.mboxUnactiveCellStroke)
            //this.ctx.strokeStyle = theme.mboxActiveCellStroke
            this.ctx.beginPath();
            this.ctx.arc(cell.x, cell.y, size-cellBorder/2, 0x0, cell.pi2, false);
            this.ctx.closePath();
            this.ctx.stroke()
            this.ctx.globalAlpha = 1;
        }

        if(cell.isPlayerCell && settings.mergeIndicator){
            cell.calcMerge()
            const ratio = (cell.mergeTimeLeft/cell.cellMergeFull)*2
            if(ratio>=0){
                var startAngle = Math.PI*(1.5+(2-ratio))
                var endAngle =  Math.PI*3.5;
                const cellBorder = (size/100*15)
                this.ctx.lineWidth = cellBorder
                this.ctx.globalAlpha = alpha;
                this.ctx.strokeStyle = theme.mergeIndicatorColor
                this.ctx.beginPath();
                this.ctx.arc(cell.x, cell.y, size-cellBorder/2, startAngle, endAngle, false);
                this.ctx.stroke()
                this.ctx.closePath();
                this.ctx.globalAlpha = 1;
            }
        }



        this.ctx.globalAlpha *= theme.textAlpha;
        //ctx.globalAlpha = ctx.globalAlpha * theme.textAlpha;
        var sizeTextScaleMode = settings.textScaleMode === 0 ? cell.targetSize : cell.size
        if (settings.showNames && !(cell.isPlayerCell && settings.hideMyName) && !(skin && settings.hideTeammatesNames)) {
            /*var helpCanvas = Texts.nick(ratio,cell)
            if(helpCanvas){
                var sWidth1 = helpCanvas.originW  * sizeTextScaleMode * theme.namesScale
                var sHeight2 = helpCanvas.originH * sizeTextScaleMode * theme.namesScale
                ctx.drawImage(helpCanvas, (cell.x - (sWidth1 >> 1))  , (cell.y - (sHeight2)), sWidth1, sHeight2);
            }*/
            var nickCanvas = Texts.nick(cell.targetNick,cell)
            if(nickCanvas){
                var sWidth = nickCanvas.originW  * sizeTextScaleMode * theme.namesScale
                var sHeight = nickCanvas.originH * sizeTextScaleMode * theme.namesScale
                //var margin = ~~cell.y - ~~(sHeight / 2)
                this.ctx.drawImage(nickCanvas, /*~~*/(cell.x - (sWidth >> 1))  , /*~~*/(cell.y - (sHeight >> 1)), /*~~*/sWidth, /*~~*/sHeight);
            }
        }


        if (settings.showMass  && !(cell.isPlayerCell && settings.hideMyMass) && !(settings.hideEnemiesMass && !cell.isPlayerCell && !cell.isVirus)) {
            cell.mass = ~~(sizeTextScaleMode * sizeTextScaleMode / 100);
            var massCanvas = Texts.mass(cell)
            if(massCanvas){
                var sWidth = massCanvas.originW  * sizeTextScaleMode * theme.massScale/2
                var sHeight = massCanvas.originH * sizeTextScaleMode * theme.massScale/2
                //var margin = settings.noNames|| (cell.isPlayerCell && settings.hideMyName)?(cell.y - (sHeight >> 1)): cell.size/3 + ~~cell.y - ~~(sHeight  / 4);
                //ctx.drawImage(massCanvas, ~~(cell.x - (sWidth >> 1))  , ~~margin, ~~sWidth, ~~sHeight); // cell.size/3+margin,
                var margin = !settings.showNames|| (cell.isPlayerCell && settings.hideMyName)?(cell.y - (sHeight >> 1)): cell.size/4     + /*~~*/cell.y;
                this.ctx.drawImage(massCanvas, /*~~*/(cell.x - (sWidth >> 1))  , /*~~*/margin, /*~~*/sWidth, /*~~*/sHeight); // cell.size/3+margin,
            }
        }
        //ctx.restore();
        this.ctx.globalAlpha = startAlpha
    },
    drawCachedFood(ctx, Connection, index) {
        var food = Connection.food
        var displayChecks = settings.experimental1
        if (!food.length) {
            return;
        }
        if (settings.optimizedFood && this.pellet) {
            for (var i = 0; i < food.length; i++) {
                //food[length].x - 10 - theme.foodSize
                //var x = food[i].x - 10 - theme.foodSize;
                //var y = food[i].y - 10 - theme.foodSize;

                //if(displayChecks && this.isInDisplay(x,y,0)){}else{continue}
                //if( this.reverseCheckView(food[length],index))continue;
                this.renderedObjects++

                ctx.drawImage(this.pellet, ~~(food[i].x - 10 - theme.foodSize), ~~(food[i].y - 10 - theme.foodSize));
            }
        } else {
            ctx.beginPath();
            ctx.fillStyle = theme.foodColor;
            ctx.globalAlpha = 1;
            //for (var food of Connection.food) {
            //Connection.food.forEach((food) => {
            for (var i=0;Connection.food.length>i;i++) {
                const food = Connection.food[i]
                if(displayChecks && !this.isInDisplay(food.x,food.y,food.size))continue; 
                if(this.reverseCheckView(food,index)) continue;
                this.renderedObjects++

                if (this.scale < 0.16) {
                    const size = food.size + theme.foodSize;
                    ctx.rect(~~(food.x - size), ~~(food.y - size), size<<1, size<<1);//*2
                    continue;
                }
                ctx.moveTo(~~food.x, ~~food.y);
                ctx.arc(~~food.x, ~~food.y, ~~(food.size + theme.foodSize), 0, this.pi2, false);
            //});
            }

            ctx.fill();
        }/*
        if (reset) {
            food = [];
        }*/
    },
    drawSplitRange(ctx, Connection, currentBiggestCell) {
        const drawList = [
            Connection.biggerHSTECellsCache,
            Connection.biggerDSTECellsCache,
            Connection.biggerSTECellsCache,
        ];
        for (let i = 0; i < drawList.length; i++) {
            this.drawCircles(ctx, drawList[i], 760, 4, 0.4, theme.bSTEColor,1);
        }
        let players = Connection.playerCells;
        if (players.length) {
            const current = currentBiggestCell ? players.length - 1 : 0;
            ctx.lineWidth = 6;
            ctx.globalAlpha = theme.darkTheme ? 0.7 : 0.35;
            ctx.strokeStyle = theme.splitRangeColor;
            ctx.beginPath();
            ctx.arc(players[current].x, players[current].y, players[current].size + 760, 0, this.pi2, false);
            ctx.closePath();
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
    },
    drawDoubleSplitRange(ctx, Connection, currentBiggestCell) {
        const drawList = [
            Connection.biggerHSTECellsCache,
            Connection.biggerDSTECellsCache,
        ];
        for (let i = 0; i < drawList.length; i++) {
            this.drawCircles(ctx, drawList[i], 760, 4, 0.4, theme.bDSTEColor,2);
        }
        let players = Connection.playerCells;
        if (players.length) {
            const current = currentBiggestCell ? players.length - 1 : 0;
            if (players[current].size*players[current].size/100 < 666) return;
            ctx.lineWidth = 4;
            ctx.globalAlpha = theme.darkTheme ? 0.7 : 0.35;
            ctx.strokeStyle = theme.splitRangeColor;
            ctx.beginPath();
            ctx.arc(players[current].x, players[current].y, 2*players[current].size + 760, 0, this.pi2, false);
            ctx.closePath();
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
    },
    drawTripleSplitRange(ctx, Connection) {
        this.drawCircles(ctx, Connection.biggerHSTECellsCache, 760, 4, 0.4, theme.bHSTEColor,3);
        ctx.globalAlpha = 1;
    },
    drawOppRings(ctx, scale, Connection) {
        const width = 14 + 2 / scale;
        const alpha = 12 + 1 / scale;
        const drawColors = [
            Connection.biggerHSTECellsCache, theme.bHSTEColor,
            Connection.biggerDSTECellsCache, theme.bDSTEColor,
            Connection.biggerSTECellsCache, theme.bSTEColor,
            Connection.biggerCellsCache, theme.bColor,
            Connection.smallerCellsCache, theme.sColor,
            Connection.smallerSTECellsCache, theme.sSTEColor,
            Connection.smallerDSTECellsCache, theme.sDSTEColor,
            Connection.smallerHSTECellsCache, theme.sHSTEColor
        ]
        for (let i = 0; i < drawColors.length; i += 2) {
            this.drawCircles(ctx, drawColors[i], width, alpha, 0.75, drawColors[i + 1],1);
        }
    },
    drawCursorTracking(ctx, players, cursorX, cursorY) {
        ctx.lineWidth = theme.cursorTrackingSize;
        ctx.globalAlpha = theme.darkTheme ? 0.75 : 0.35;
        ctx.strokeStyle = theme.cursorTrackingColor;
        ctx.beginPath();
        for (let length = 0; length < players.length; length++) {
            ctx.moveTo(players[length].x, players[length].y);
            ctx.lineTo(cursorX, cursorY);
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
    },
    drawCircles(ctx, players, scale, width, alpha, stroke, mult) {
        ctx.lineWidth = width;
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = stroke;
        for (let length = 0; length < players.length; length++) {
            ctx.beginPath();
            ctx.arc(players[length].x, players[length].y, mult * players[length].size + scale, 0, this.pi2, false);
            ctx.closePath();
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
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
        this.drawDangerArea(ctx, Connection.battleRoyale.x, Connection.battleRoyale.y, Connection.battleRoyale.radius, Connection.mapMinX, Connection.mapMinY, Connection.mapMaxX - Connection.mapMinX, Connection.mapMaxY - Connection.mapMinY, theme.dangerAreaColor, 0.25);
        this.drawSafeArea(ctx, Connection.battleRoyale.targetX, Connection.battleRoyale.targetY, Connection.battleRoyale.targetRadius, 40, theme.safeAreaColor);
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
        this.drawDangerArea(this.battleAreaMapCtx, newX, newY, newRadius, 0, 0, width, heigth, theme.dangerAreaColor, 0.25);
        newX = ~~((Connection.battleRoyale.targetX + offsetX) * newWidth);
        newY = ~~((Connection.battleRoyale.targetY + offsetY) * newWidth);
        newRadius = ~~(Connection.battleRoyale.targetRadius * newWidth);
        this.drawSafeArea(this.battleAreaMapCtx, newX, newY, newRadius, 2, theme.safeAreaColor);
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
    drawGhostCells(Connection,index) {
        if (!settings.showGhostCells) {
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
            if(!this.isInDisplay(x,y,ghostsCells[length].size)){
                continue;
            }
            if(ghostsCells.inView){continue}
            /*if(this.reverseCheckGhost(ghostsCells[length],index))
            continue;*/

            this.renderedObjects++
            this.ctx.moveTo(x, y);
            this.ctx.arc(x, y, ghostsCells[length].size, 0, this.pi2, false);
        }
        this.ctx.fillStyle = theme.ghostCellsColor;
        this.ctx.globalAlpha = theme.ghostCellsAlpha;
        this.ctx.shadowColor = theme.ghostCellsColor;
        this.ctx.shadowBlur = 40;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
        this.ctx.shadowBlur = 0;
    },
    preDrawPellet() {
        this.pellet = null;
        const size = 10 + theme.foodSize;
        let canvas = document.createElement(`canvas`);
        canvas.width = size * 2;
        canvas.height = size * 2;
        const ctx = canvas.getContext('2d');
        ctx.arc(size, size, size, 0, this.pi2, false);
        ctx.fillStyle = theme.foodColor;
        ctx.fill();
        this.pellet = new Image();
        this.pellet.src = canvas.toDataURL();
        canvas = null;
    },
    preDrawIndicator() {
        this.indicator = null;
        let canvas = document.createElement('canvas');
        canvas.width = 90;
        canvas.height = 50;
        const ctx = canvas.getContext('2d');
        ctx.lineWidth = 2;
        ctx.fillStyle = theme.teammatesIndColor;
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
        if (!settings.showStatsFPS) {
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
    render() {
        //drawRender.renderFrame();
        //drawRender.renderFrame2();
        //drawRender.lastTime = drawRender.time

        requestAnimationFrame(drawRender.render);
        drawRender.renderFrame()
        //comm.drawMiniMap()
        //setTimeout(drawRender.render,1)
    },
    init() {
        this.app = new PIXI.Application({transparent: true,antialias: true,width:window.innerWidth,height:window.innerHeight, view: document.getElementById('webgl')});
        this.graphics = new PIXI.Graphics()
        this.app.stage.addChild(this.graphics);


        this.setCanvas();
        this.resizeCanvas();

        this.preDrawPellet();
        this.preDrawIndicator();

        function handleMouseWheel(value){this.setZoom(value)}
        if (/firefox/i .test(navigator.userAgent)) {
            document.addEventListener(`DOMMouseScroll`, handleMouseWheel.bind(this));
        } else {
            document.body.onmousewheel = handleMouseWheel.bind(this)
        }
        this.canvas.onmousemove = event => {
            for(let i=0,len1 = application.tabs.length;len1>i;i++){
                this.mouseClientX = event.clientX * settings.renderQuality;
                this.mouseClientY = event.clientY * settings.renderQuality;
                if(i == 0){
                    this.setCursorPosition(application.tabs[i]);
                }


            }
        };

        //!window.pix&&window.requestAnimationFrame(this.render);
        this.app.ticker.add((delta) => {
            this.renderFrame2()
        });
        window.addEventListener('resize',()=>{
            //window.requestAnimationFrame(()=>
            this.resizeCanvas()
            //)
        })
    }
}


if (window.pix) drawRender = PixiRender;
else drawRender = CanvasRender;

