
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
    app.view.style.zIndex = "1"; // Lower z-index so HUD (z=11+) stays on top
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
            // Fallback to defaults if theme is missing
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
                // Ensure we have the game object
                if (!window.legendmod) return;
                var LM = window.legendmod;
                var theme = this.getTheme();

                // Ensure settings object is available
                var settings = window.settings || window.defaultmapsettings || {};

                // Camera & Scale
                // LM.viewX/Y are the target coordinates
                this.camX = LM.viewX || 0;
                this.camY = LM.viewY || 0;

                // Calculate scale similar to original: Math.max(width / 1920, height / 1080) * zoom
                // LM.viewScale seems to be the scale factor used in original
                this.scale = LM.viewScale || Math.max(window.innerWidth / 1920, window.innerHeight / 1080);

                this.container.scale.set(this.scale);
                this.container.position.set(window.innerWidth / 2, window.innerHeight / 2);
                this.container.pivot.set(this.camX, this.camY);

                // Clear
                this.gridGraphics.clear();
                this.indicatorGraphics.clear();
                this.foodContainer.removeChildren();
                this.cellContainer.removeChildren();

                // Draw Background Elements
                if (settings.customBackground) {
                    this.drawCustomBackgrounds(LM, settings);
                }

                if (settings.showGrid) {
                    if (settings.showOptimisedGrid) {
                        this.drawCustomNewGrid(LM, settings); // Image-based grid
                    } else {
                        this.drawGrid(this.gridGraphics, LM, theme); // Line-based grid
                    }
                }
                if (settings.showBgSectors) {
                    this.drawSectors(this.gridGraphics, LM, theme, 5, 5);
                }
                if (settings.showMapBorders) {
                    this.drawBorders(this.gridGraphics, LM, theme);
                }

                if (settings.virusesRange && LM.viruses) {
                    this.drawVirusesRange(this.gridGraphics, LM, theme, settings);
                }

                // Draw Indicators (Before cells)
                if (settings.splitRange && LM.playerCells) {
                    this.drawSplitRange(this.indicatorGraphics, LM, theme);
                    // Double split range
                    this.drawDoubleSplitRange(this.indicatorGraphics, LM, theme);
                }

                if (settings.oppRings && !settings.bubbleInd) {
                    this.drawOppRings(this.indicatorGraphics, LM, theme, settings);
                }
                if (settings.cursorTracking && LM.playerCells) {
                    this.drawCursorTracking(this.indicatorGraphics, LM, theme);
                }

                // Waves (Shockwaves)
                if (LM.Waves && LM.Waves.length) {
                    this.drawWaves(this.indicatorGraphics, LM);
                }

                // Draw Entities
                // Food
                if (settings.showFood && LM.food) {
                    this.drawFood(LM, theme);
                }

                // Ghost Cells
                if (settings.showGhostCells) {
                    this.drawGhostCells(LM, theme);
                }

                // Cells
                if (LM.cells) {
                    for (var i = 0; i < LM.cells.length; i++) {
                        this.drawCell(LM.cells[i], theme, settings);
                    }
                }

            } catch (e) {
                console.error("PixiRender Frame Error", e);
            }
        },

        drawGrid: function (g, LM, theme) {
            if (typeof LM.mapMinX !== 'number') return;
            g.lineStyle(1 / this.scale, parseInt(theme.gridColor.replace('#', '0x')), 0.5);
            for (var x = LM.mapMinX; x <= LM.mapMaxX; x += 50) {
                g.moveTo(x, LM.mapMinY);
                g.lineTo(x, LM.mapMaxY);
            }
            for (var y = LM.mapMinY; y <= LM.mapMaxY; y += 50) {
                g.moveTo(LM.mapMinX, y);
                g.lineTo(LM.mapMaxX, y);
            }
        },

        drawSectors: function (g, LM, theme, cols, rows) {
            if (typeof LM.mapMinX !== 'number') return;
            var w = LM.mapMaxX - LM.mapMinX;
            var h = LM.mapMaxY - LM.mapMinY;
            var secW = w / cols;
            var secH = h / rows;

            g.lineStyle(theme.sectorsWidth || 40, parseInt(theme.sectorsColor.replace('#', '0x')), 0.2);
            for (var i = 1; i < cols; i++) {
                g.moveTo(LM.mapMinX + i * secW, LM.mapMinY);
                g.lineTo(LM.mapMinX + i * secW, LM.mapMaxY);
            }
            for (var i = 1; i < rows; i++) {
                g.moveTo(LM.mapMinX, LM.mapMinY + i * secH);
                g.lineTo(LM.mapMaxX, LM.mapMinY + i * secH);
            }
        },

        drawBorders: function (g, LM, theme) {
            if (typeof LM.mapMinX !== 'number') return;
            g.lineStyle(theme.bordersWidth || 40, parseInt(theme.bordersColor.replace('#', '0x')), 1);
            g.drawRect(LM.mapMinX, LM.mapMinY, LM.mapMaxX - LM.mapMinX, LM.mapMaxY - LM.mapMinY);
        },

        drawSplitRange: function (g, LM, theme) {
            var players = LM.playerCells;
            if (!players || !players.length) return;
            var current = 0; // Simplified to 0
            if (players[current]) {
                g.lineStyle(6, parseInt(theme.splitRangeColor ? theme.splitRangeColor.replace('#', '0x') : 0xFFFFFF), 0.3);
                g.drawCircle(players[current].x, players[current].y, players[current].size + 760); // 760 is standard split range
            }
        },

        drawCursorTracking: function (g, LM, theme) {
            var players = LM.playerCells;
            if (!players || !players.length) return;
            g.lineStyle(theme.cursorTrackingSize || 5, parseInt(theme.cursorTrackingColor ? theme.cursorTrackingColor.replace('#', '0x') : 0xFFFFFF), 0.3);
            for (var i = 0; i < players.length; i++) {
                g.moveTo(players[i].x, players[i].y);
                g.lineTo(LM.cursorX, LM.cursorY);
            }
        },

        drawGhostCells: function (LM, theme) {
            if (!LM.ghostCells) return;
            var g = this.indicatorGraphics; // Use indicator graphics or make new container layer
            g.lineStyle(0);
            g.beginFill(parseInt((theme.ghostCellsColor || '#FFFFFF').replace('#', '0x')), 0.3);
            for (var i = 0; i < LM.ghostCells.length; i++) {
                var ghost = LM.ghostCells[i];
                g.drawCircle(ghost.x, ghost.y, ghost.size);
            }
            g.endFill();
        },

        drawCustomBackgrounds: function (LM, settings) {
            if (!this.backgroundSprite && settings.customBackground) {
                this.backgroundSprite = PIXI.Sprite.from(settings.customBackground);
                this.backgroundSprite.anchor.set(0);
                this.container.addChildAt(this.backgroundSprite, 0); // Add to bottom
            }

            if (this.backgroundSprite) {
                if (this.backgroundSprite.texture.baseTexture.valid) {
                    // Scaling logic from ogarioTest.js
                    var minX = this.camX - window.innerWidth / (2 * this.scale);
                    var maxX = this.camX + window.innerWidth / (2 * this.scale);
                    var minY = this.camY - window.innerHeight / (2 * this.scale);
                    var maxY = this.camY + window.innerHeight / (2 * this.scale);

                    // Simply fit map for now, logic in original is complex tiling/positioning
                    this.backgroundSprite.x = LM.mapMinX;
                    this.backgroundSprite.y = LM.mapMinY;
                    this.backgroundSprite.width = LM.mapMaxX - LM.mapMinX;
                    this.backgroundSprite.height = LM.mapMaxY - LM.mapMinY;
                    this.backgroundSprite.alpha = settings.backgroundAlpha || 1;
                }
            }
        },

        drawOppRings: function (g, LM, theme, settings) {
            // Arrays from LM logic: biggerSTEDCellsCache, biggerSTECellsCache, etc.
            // Colors from defaultSettings/settings

            var width = 14 + 2 / this.scale;
            // Helper to draw a set of circles
            var drawSet = (list, color) => {
                if (!list || !list.length) return;
                g.lineStyle(width, parseInt((color || '#FFFFFF').replace('#', '0x')), 0.75); // 0.75 alpha hardcoded in original
                for (var i = 0; i < list.length; i++) {
                    var item = list[i];
                    g.drawCircle(item.x, item.y, item.size); // Ring around the cell
                }
            };

            // Using simplified colors or from settings
            drawSet(LM.biggerSTEDCellsCache, settings.enemyBSTEDColor);
            drawSet(LM.biggerSTECellsCache, settings.enemyBSTEColor);
            drawSet(LM.biggerCellsCache, settings.enemyBColor);
            drawSet(LM.smallerCellsCache, settings.enemySColor);
            drawSet(LM.STECellsCache, settings.enemySSTEColor);
            drawSet(LM.STEDCellsCache, settings.enemySSTEDColor);
        },

        drawCustomNewGrid: function (LM, settings) {
            if (!this.gridSprite) {
                // Use the URL from ogarioTest.js
                this.gridSprite = PIXI.Sprite.from("https://www.legendmod.ml/banners/grid3.png");
                this.gridSprite.anchor.set(0);
                // Insert after background (index 1 if bg exists, else 0)
                var idx = this.backgroundSprite ? 1 : 0;
                this.container.addChildAt(this.gridSprite, idx);
            }

            if (this.gridSprite && this.gridSprite.texture.baseTexture.valid) {
                // Map the grid image to the map bounds logic
                // Original logic suggests the grid image corresponds to the map size
                this.gridSprite.x = LM.mapMinX;
                this.gridSprite.y = LM.mapMinY;
                this.gridSprite.width = LM.mapMaxX - LM.mapMinX;
                this.gridSprite.height = LM.mapMaxY - LM.mapMinY;
                this.gridSprite.alpha = 0.5; // Visual tweak
            }
        },

        drawVirusesRange: function (g, LM, theme, settings) {
            if (!LM.viruses || !LM.viruses.length) return;
            var color = parseInt((theme.virusColor || '#33FF33').replace('#', '0x'));
            g.beginFill(color, 0.1);
            g.lineStyle(0);
            for (var i = 0; i < LM.viruses.length; i++) {
                var v = LM.viruses[i];
                if (!v.invisible) {
                    // Start Drawing arc logic from ogarioTest.js
                    // size + 820
                    g.drawCircle(v.x, v.y, v.size + 820);
                }
            }
            g.endFill();
        },

        drawWaves: function (g, LM) {
            if (!LM.Waves) return;
            for (var i = 0; i < LM.Waves.length; i++) {
                var wave = LM.Waves[i];
                var r = (Date.now() - wave.time) / 2;
                if (r > 0) {
                    var alpha = Math.max(0, 1 - r / 1500); // 1.5s fade
                    if (alpha <= 0) continue;

                    var color = parseInt((wave.color || '#FFFFFF').replace('#', '0x'));
                    g.lineStyle(10, color, alpha);
                    g.drawCircle(wave.x, wave.y, r);
                }
            }
        },

        drawDoubleSplitRange: function (g, LM, theme) {
            var players = LM.playerCells;
            if (!players || !players.length) return;
            var current = 0;
            if (players[current]) {
                g.lineStyle(2, parseInt(theme.splitRangeColor ? theme.splitRangeColor.replace('#', '0x') : 0xFFFFFF), 0.3);
                g.drawCircle(players[current].x, players[current].y, players[current].size + 1520);
            }
        },

        drawFood: function (LM, theme) {
            if (!LM.food) return;
            var g = new PIXI.Graphics();
            var color = parseInt((theme.foodColor || '#FFFFFF').replace('#', '0x'));
            g.beginFill(color);
            for (var j = 0; j < LM.food.length; j++) {
                var f = LM.food[j];
                if (Math.abs(f.x - this.camX) > window.innerWidth / this.scale / 2 + 50) continue;
                if (Math.abs(f.y - this.camY) > window.innerHeight / this.scale / 2 + 50) continue;
                g.drawCircle(f.x, f.y, f.size);
            }
            g.endFill();
            this.foodContainer.addChild(g);
        },

        drawCell: function (cell, theme, settings) {
            var container = new PIXI.Container();
            container.x = cell.x;
            container.y = cell.y;

            var g = new PIXI.Graphics();
            var color = cell.color ? parseInt(cell.color.replace('#', '0x')) : 0xFFFFFF;

            // Skins
            if (cell.skinURL && settings.showSkins) {
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
            if (cell.name && settings.showNames) {
                var t = Texts.getNickText(cell.name, Math.max(10, cell.size / 2.5), '#FFFFFF');
                container.addChild(t);
            }

            // Mass
            if (settings.showMass) {
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

    if (window.PIXI) {
        console.log("PixiJS Version:", PIXI.VERSION);
        if (PIXI.utils && PIXI.utils.sayHello) {
            PIXI.utils.sayHello('WebGL 2');
        }
    }
    console.log("Full PixiRender loaded");

    // Debug helper
    setInterval(function () {
        if (window.legendmod) {
            console.log("Pixi Debug - LM State:", {
                cells: window.legendmod.cells ? window.legendmod.cells.length : 0,
                viewX: window.legendmod.viewX,
                viewY: window.legendmod.viewY,
                fps: window.legendmod.fps
            });
        } else {
            console.log("Pixi Debug - Waiting for legendmod...");
        }
    }, 5000);

})();
