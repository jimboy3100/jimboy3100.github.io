
// Full PixiJS Renderer Implementation for Ogario Test Environment
// Adapted from ExampleScripts/pixirenderer.js to work standalone with Pixi 7+

(function () {
    // Basic setup: Create Pixi App and overlay canvas
    var app = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x000000,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true
    });

    var oldCanvas = document.getElementById('canvas');
    if (oldCanvas) {
        oldCanvas.style.opacity = '0'; // Hide legacy canvas but keep layout
    }

    document.body.appendChild(app.view);
    app.view.id = "pixi-canvas";
    app.view.style.position = "absolute";
    app.view.style.top = "0";
    app.view.style.left = "0";
    app.view.style.zIndex = "100";
    app.view.style.pointerEvents = "none";

    // --- Advanced Helpers ---

    var Texts = new (class {
        constructor() {
            this.nickCaches = new Map();
        }

        getNickText(nick, size, color) {
            // Simple caching key
            var key = nick + "_" + size + "_" + color;
            if (this.nickCaches.has(key)) return this.nickCaches.get(key);

            var style = new PIXI.TextStyle({
                fontFamily: 'Ubuntu, Arial',
                fontSize: size,
                fontWeight: 'bold',
                fill: color || '#FFFFFF',
                stroke: '#000000',
                strokeThickness: Math.max(2, size / 10),
                align: 'center'
            });
            var text = new PIXI.Text(nick, style);
            text.anchor.set(0.5);
            // Cache it (in a real app we'd need cleanup/LRU)
            this.nickCaches.set(key, text);
            return text;
        }
    })();


    var PixiRender = {
        app: app,
        container: null,
        cellContainer: null,
        foodContainer: null,
        gridGraphics: null,
        indicatorGraphics: null, // For split ranges, cursors
        scale: 1,
        camX: 0,
        camY: 0,

        // Settings from window.theme or defaults
        getTheme: function () {
            return window.theme || {
                gridColor: '#111111',
                sectorsColor: '#333333',
                sectorsWidth: 40,
                sectorsFontSize: 1000,
                sectorsFontFamily: 'Ubuntu',
                sectorsFontWeight: 600,
                bordersColor: '#FF0000',
                bordersWidth: 40,
                foodColor: '#FFFFFF',
                foodSize: 10,
                virusColor: '#33FF33',
                splitRangeColor: '#FFFFFF',
                cursorTrackingColor: '#FFFFFF',
                cursorTrackingSize: 5
            };
        },

        init: function () {
            this.container = new PIXI.Container();
            this.app.stage.addChild(this.container);

            this.gridGraphics = new PIXI.Graphics();
            this.container.addChild(this.gridGraphics);

            this.foodContainer = new PIXI.Container();
            this.container.addChild(this.foodContainer);

            this.indicatorGraphics = new PIXI.Graphics(); // Below cells
            this.container.addChild(this.indicatorGraphics);

            this.cellContainer = new PIXI.Container();
            this.container.addChild(this.cellContainer);

            window.addEventListener('resize', this.resize.bind(this));
        },

        resize: function () {
            this.app.renderer.resize(window.innerWidth, window.innerHeight);
        },

        renderFrame: function () {
            try {
                if (!window.application || !window.application.tab || !window.application.tab.master) return;
                var activeTab = window.application.tab.master;
                var theme = this.getTheme();

                // Camera & Scale
                this.camX = activeTab.viewX || 0;
                this.camY = activeTab.viewY || 0;

                this.scale = Math.max(window.innerWidth / 1920, window.innerHeight / 1080);
                if (activeTab.playerSize) {
                    this.scale *= Math.min(64 / activeTab.playerSize, 1) ** 0.2;
                }

                this.container.scale.set(this.scale);
                this.container.position.set(window.innerWidth / 2, window.innerHeight / 2);
                this.container.pivot.set(this.camX, this.camY);

                // Clear
                this.gridGraphics.clear();
                this.indicatorGraphics.clear();
                this.foodContainer.removeChildren();
                this.cellContainer.removeChildren();

                // Draw Background Elements
                if (window.settings && window.settings.showGrid) {
                    this.drawGrid(this.gridGraphics, activeTab, theme);
                }
                if (window.settings && window.settings.showBgSectors) {
                    this.drawSectors(this.gridGraphics, activeTab, theme, 5, 5);
                }
                if (window.settings && window.settings.showMapBorders) {
                    this.drawBorders(this.gridGraphics, activeTab, theme);
                }

                // Draw Indicators (Before cells)
                if (window.settings && window.settings.splitRange && activeTab.playerCells) {
                    this.drawSplitRange(this.indicatorGraphics, activeTab, theme);
                }
                if (window.settings && window.settings.cursorTracking && activeTab.playerCells) {
                    this.drawCursorTracking(this.indicatorGraphics, activeTab, theme);
                }

                // Draw Entities
                var tabs = window.application.tabs;
                if (tabs) {
                    for (var i = 0; i < tabs.length; i++) {
                        var tab = tabs[i];
                        if (tab) {
                            if (window.settings && window.settings.showFood) {
                                this.drawFood(tab, theme);
                            }
                            if (window.settings && window.settings.showGhostCells) {
                                this.drawGhostCells(tab, theme);
                            }
                            if (tab.cells) {
                                for (var j = 0; j < tab.cells.length; j++) {
                                    this.drawCell(tab.cells[j], theme);
                                }
                            }
                        }
                    }
                }
            } catch (e) {
                console.error("PixiRender Frame Error", e);
            }
        },

        drawGrid: function (g, tab, theme) {
            if (!tab || typeof tab.mapMinX !== 'number') return;
            g.lineStyle(1 / this.scale, parseInt(theme.gridColor.replace('#', '0x')), 0.5);
            for (var x = tab.mapMinX; x <= tab.mapMaxX; x += 50) {
                g.moveTo(x, tab.mapMinY);
                g.lineTo(x, tab.mapMaxY);
            }
            for (var y = tab.mapMinY; y <= tab.mapMaxY; y += 50) {
                g.moveTo(tab.mapMinX, y);
                g.lineTo(tab.mapMaxX, y);
            }
        },

        drawSectors: function (g, tab, theme, cols, rows) {
            if (!tab || typeof tab.mapMinX !== 'number') return;
            var w = tab.mapMaxX - tab.mapMinX;
            var h = tab.mapMaxY - tab.mapMinY;
            var secW = w / cols;
            var secH = h / rows;

            g.lineStyle(theme.sectorsWidth || 40, parseInt(theme.sectorsColor.replace('#', '0x')), 0.2);
            for (var i = 1; i < cols; i++) {
                g.moveTo(tab.mapMinX + i * secW, tab.mapMinY);
                g.lineTo(tab.mapMinX + i * secW, tab.mapMaxY);
            }
            for (var i = 1; i < rows; i++) {
                g.moveTo(tab.mapMinX, tab.mapMinY + i * secH);
                g.lineTo(tab.mapMaxX, tab.mapMinY + i * secH);
            }
        },

        drawBorders: function (g, tab, theme) {
            if (!tab || typeof tab.mapMinX !== 'number') return;
            g.lineStyle(theme.bordersWidth || 40, parseInt(theme.bordersColor.replace('#', '0x')), 1);
            g.drawRect(tab.mapMinX, tab.mapMinY, tab.mapMaxX - tab.mapMinX, tab.mapMaxY - tab.mapMinY);
        },

        drawSplitRange: function (g, tab, theme) {
            var players = tab.playerCells;
            if (!players || !players.length) return;
            var current = 0; // Simplified to 0
            if (players[current]) {
                g.lineStyle(6, parseInt(theme.splitRangeColor ? theme.splitRangeColor.replace('#', '0x') : 0xFFFFFF), 0.3);
                g.drawCircle(players[current].x, players[current].y, players[current].size + 760); // 760 is standard split range
            }
        },

        drawCursorTracking: function (g, tab, theme) {
            var players = tab.playerCells;
            if (!players || !players.length) return;
            g.lineStyle(theme.cursorTrackingSize || 5, parseInt(theme.cursorTrackingColor ? theme.cursorTrackingColor.replace('#', '0x') : 0xFFFFFF), 0.3);
            for (var i = 0; i < players.length; i++) {
                g.moveTo(players[i].x, players[i].y);
                g.lineTo(tab.cursorX, tab.cursorY);
            }
        },

        drawGhostCells: function (tab, theme) {
            if (!tab.ghostCells) return;
            var g = this.indicatorGraphics; // Use indicator graphics or make new container layer
            g.lineStyle(0);
            g.beginFill(parseInt((theme.ghostCellsColor || '#FFFFFF').replace('#', '0x')), 0.3);
            for (var i = 0; i < tab.ghostCells.length; i++) {
                var ghost = tab.ghostCells[i];
                g.drawCircle(ghost.x, ghost.y, ghost.size);
            }
            g.endFill();
        },

        drawFood: function (tab, theme) {
            if (!tab.food) return;
            var g = new PIXI.Graphics();
            var color = parseInt((theme.foodColor || '#FFFFFF').replace('#', '0x'));
            g.beginFill(color);
            for (var j = 0; j < tab.food.length; j++) {
                var f = tab.food[j];
                if (Math.abs(f.x - this.camX) > window.innerWidth / this.scale / 2 + 50) continue;
                if (Math.abs(f.y - this.camY) > window.innerHeight / this.scale / 2 + 50) continue;
                g.drawCircle(f.x, f.y, f.size);
            }
            g.endFill();
            this.foodContainer.addChild(g);
        },

        drawCell: function (cell, theme) {
            var container = new PIXI.Container();
            container.x = cell.x;
            container.y = cell.y;

            var g = new PIXI.Graphics();
            var color = cell.color ? parseInt(cell.color.replace('#', '0x')) : 0xFFFFFF;

            // Skins
            if (cell.skinURL && window.settings && window.settings.showSkins) {
                try {
                    var sprite = PIXI.Sprite.from(cell.skinURL);
                    sprite.width = cell.size * 2;
                    sprite.height = cell.size * 2;
                    sprite.anchor.set(0.5);

                    var mask = new PIXI.Graphics();
                    mask.beginFill(0xFFFFFF);
                    mask.drawCircle(0, 0, cell.size);
                    mask.endFill();
                    sprite.mask = mask;
                    container.addChild(mask);
                    container.addChild(sprite);
                } catch (e) { }
            }

            // Body
            if (cell.isVirus) {
                var vColor = parseInt((theme.virusColor || '#33FF33').replace('#', '0x'));
                g.lineStyle(4, vColor);
                g.beginFill(vColor, 0.6);
                var points = 20;
                var outer = cell.size;
                var inner = cell.size * 0.9;
                g.moveTo(outer, 0);
                for (var i = 1; i <= points * 2; i++) {
                    var angle = (Math.PI / points) * i;
                    var r = (i % 2 === 0) ? outer : inner;
                    g.lineTo(r * Math.cos(angle), r * Math.sin(angle));
                }
                g.closePath();
            } else {
                g.beginFill(color);
                g.lineStyle(2, 0x000000);
                g.drawCircle(0, 0, cell.size);
                g.endFill();
            }
            container.addChild(g);

            // Name
            if (cell.name && window.settings && window.settings.showNames) {
                var t = Texts.getNickText(cell.name, Math.max(10, cell.size / 2.5), '#FFFFFF');
                container.addChild(t);
            }

            // Mass
            if (window.settings && window.settings.showMass) {
                var mass = Math.floor(cell.mass || cell.size * cell.size / 100);
                var mt = Texts.getNickText(mass.toString(), Math.max(10, cell.size / 3.5), '#FFFFFF');
                mt.y = cell.name ? cell.size / 2 : 0;
                container.addChild(mt);
            }

            this.cellContainer.addChild(container);
        }

    };

    PixiRender.init();

    // Hook
    var _originalReq = window.requestAnimationFrame;
    window.requestAnimationFrame = function (callback) {
        PixiRender.renderFrame();
        return _originalReq(callback);
    };

    console.log("Full PixiRender loaded");

})();
