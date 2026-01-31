
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
                strokeThickness: Math.max(3, size / 8), // Thicker stroke for visibility
                align: 'center',
                lineJoin: 'round'
            });
            var text = new PIXI.Text(nick, style);
            text.resolution = 2; // High DPI rendering for sharp text
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

                // Battle Royale Safe Zone
                if (LM.gameMode === ':battleroyale') {
                    this.drawBattleArea(this.gridGraphics, LM, theme); // Draw on grid layer
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

                // Commanders (Special effects)
                if (LM.drawCommander) {
                    this.drawCommander(this.indicatorGraphics, LM, theme, 1);
                }
                if (LM.drawCommander2) {
                    this.drawCommander(this.indicatorGraphics, LM, theme, 2);
                }

                // Draw Entities
                // Food
                if (settings.showFood && LM.food) {
                    this.drawFood(LM, theme);
                }

                // Ghost Cells
                if (settings.showGhostCells) {
                    this.drawGhostCells(LM, theme, settings);
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

        drawBattleArea: function (g, LM, theme) {
            // Ported from ogarioTest.js logic (drawViewport)
            // Draws the safe zone boundaries
            // We need a way to get the safe zone coordinates. 
            // ogarioTest.js uses LM.mapMinX etc for the VIEWPORT, but for BR it likely uses a specific obj.
            // Looking at ogarioTest.js: this.drawViewport(ctx, 'Viewport', LM.camMinX...)
            // But drawBattleArea(ctx) call in ogarioTest.js is empty? No, checking logic.
            // It calls this.drawBattleArea(this.ctx);
            // It seems to rely on global/settings?

            // Simplified BR Zone (Red Border)
            if (typeof LM.mapMinX !== 'number') return;
            // Assuming the map boundaries shrink in BR? Or is it a separate overlay?
            // Usually, mapMinX/MaxX ARE the safe zone.

            g.lineStyle(15, 0xFF0000, 0.5); // Red border
            g.drawRect(LM.mapMinX, LM.mapMinY, LM.mapMaxX - LM.mapMinX, LM.mapMaxY - LM.mapMinY);
        },

        drawCommander: function (g, LM, theme, type) {
            // Placeholder for Commander visuals (rotating images)
            // Implementing full rotation/animation logic might be overkill for this pass 
            // unless user explicitly provided assets.
            // Using simple indicator for now.

            var x = (type === 1) ? (window.ogario && window.ogario.spawnX) : window.targetingLeadX;
            var y = (type === 1) ? (window.ogario && window.ogario.spawnY) : window.targetingLeadY;

            if (!x || !y) return;

            g.lineStyle(5, 0xFFFF00, 0.8);
            g.drawCircle(x, y, 50); // Simple indicator
        },

        drawGhostCells: function (LM, theme, settings) {
            if (!LM.ghostCells) return;
            // Ghost cells should look like normal cells but transparent
            for (var i = 0; i < LM.ghostCells.length; i++) {
                var cell = LM.ghostCells[i];
                // Use the main drawCell logic but force transparency
                // We mock a settings object to force transparency for ghosts
                var ghostSettings = Object.assign({}, settings, {
                    showNames: settings.showNames,
                    showMass: settings.showMass,
                    showSkins: settings.showSkins // Ghosts often show skins
                });

                // Draw into the main cell container or a separate ghost layer?
                // Using cellContainer might mess up z-index with live cells. 
                // Let's use indicatorGraphics for now or a new container.
                // Actually, reusing drawCell requires it to be added to a container.
                // For simplicity/parity, we can iterate and draw them semi-transparently.

                var container = new PIXI.Container();
                container.x = cell.x;
                container.y = cell.y;
                container.alpha = 0.3; // Ghost transparency

                // ... (simplified drawCell logic for ghost)
                var g = new PIXI.Graphics();
                var color = cell.color ? parseInt(cell.color.replace('#', '0x')) : 0xFFFFFF;
                g.beginFill(color);
                g.lineStyle(2, 0x000000);
                g.drawCircle(0, 0, cell.size);
                g.endFill();
                container.addChild(g);

                if (cell.skinURL && settings.showSkins) {
                    // Basic skin for ghost
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

                this.cellContainer.addChild(container); // Add to main cell layer? Or separate?
                // Issues: overlapping live cells. 
                // Ideally, ghosts are drawn BEFORE live cells. 
                // We should probably add a ghostContainer to PixiRender.
            }
        },

        drawFood: function (LM, theme) {
            if (!LM.food) return;
            // Food batching is efficient, but for "Rainbow Food" we need individual colors.
            // If rainbowFood is OFF, strict batching works.
            // If ON, we need to draw distinct colors.

            // Check settings (assuming window.settings or passed settings)
            // We need to access 'settings.rainbowFood'
            var rainbow = window.settings && window.settings.rainbowFood;

            var g = new PIXI.Graphics();

            if (!rainbow) {
                var color = parseInt((theme.foodColor || '#FFFFFF').replace('#', '0x'));
                g.beginFill(color);
                for (var j = 0; j < LM.food.length; j++) {
                    var f = LM.food[j];
                    if (Math.abs(f.x - this.camX) > window.innerWidth / this.scale / 2 + 50) continue;
                    if (Math.abs(f.y - this.camY) > window.innerHeight / this.scale / 2 + 50) continue;
                    g.drawCircle(f.x, f.y, f.size);
                }
                g.endFill();
            } else {
                // Rainbow mode: Draw individual colored circles
                // This is slower than batching same-color, but necessary for parity.
                for (var j = 0; j < LM.food.length; j++) {
                    var f = LM.food[j];
                    if (Math.abs(f.x - this.camX) > window.innerWidth / this.scale / 2 + 50) continue;
                    if (Math.abs(f.y - this.camY) > window.innerHeight / this.scale / 2 + 50) continue;

                    var color = f.color ? parseInt(f.color.replace('#', '0x')) : 0xFFFFFF;
                    g.beginFill(color);
                    g.drawCircle(f.x, f.y, f.size);
                    g.endFill();
                }
            }
            this.foodContainer.addChild(g);
        },

        drawCell: function (cell, theme, settings) {
            var container = new PIXI.Container();
            container.x = cell.x;
            container.y = cell.y;

            var g = new PIXI.Graphics();
            var color = cell.color ? parseInt(cell.color.replace('#', '0x')) : 0xFFFFFF;

            // Skins
            // Skins
            if (cell.skinURL && settings.showSkins) {
                try {
                    // Video Skin Support
                    var isVideo = cell.skinURL.endsWith('.mp4') || cell.skinURL.endsWith('.webm') || (window.application && window.application.customSkinsMap && window.application.customSkinsMap[cell.name] && window.application.customSkinsMap[cell.name].endsWith && (window.application.customSkinsMap[cell.name].endsWith('.mp4')));

                    if (isVideo) {
                        // Create video element if not exists (Pixi handles this via Texture.from)
                        // But we might need to mute it / loop it.
                        // For now, let Pixi try auto-detection.
                        var texture = PIXI.Texture.from(cell.skinURL);
                        var sprite = new PIXI.Sprite(texture);

                        // Ensure video plays
                        var source = texture.baseTexture.resource.source;
                        if (source && source.tagName === 'VIDEO') {
                            source.loop = true;
                            source.muted = true;
                            source.play().catch(e => { });
                        }

                        sprite.anchor.set(0.5);
                        sprite.width = cell.size * 2;
                        sprite.height = cell.size * 2;

                        // Masking
                        if (!settings.transparentSkins) {
                            var mask = new PIXI.Graphics();
                            mask.beginFill(0xFFFFFF);
                            mask.drawCircle(0, 0, cell.size);
                            mask.endFill();
                            sprite.mask = mask;
                            container.addChild(mask);
                        }
                        container.addChild(sprite);

                    } else {
                        // Image Skin
                        var sprite = new PIXI.Sprite();
                        var texture = PIXI.Texture.from(cell.skinURL);

                        if (texture.valid) {
                            sprite.texture = texture;
                        } else {
                            texture.on('update', () => { sprite.texture = texture; });
                            texture.on('error', () => { container.removeChild(sprite); });
                        }

                        sprite.anchor.set(0.5);
                        sprite.width = cell.size * 2;
                        sprite.height = cell.size * 2;

                        if (!settings.transparentSkins) {
                            var mask = new PIXI.Graphics();
                            mask.beginFill(0xFFFFFF);
                            mask.drawCircle(0, 0, cell.size);
                            mask.endFill();
                            sprite.mask = mask;
                            container.addChild(mask);
                        }
                        container.addChild(sprite);
                    }
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

            // Special Effects
            this.drawSpecialEffects(container, cell, theme, settings);

            // Chat Messages
            if (window.application && window.application.chatHistory && window.application.chatHistory.length) {
                this.drawChat(container, cell, settings);
            }


            this.cellContainer.addChild(container);

        },

        drawChat: function (container, cell, settings) {
            if (!window.application || !window.application.chatHistory) return;

            // Look for recent message
            var customTxt = null;
            var temp = 0;
            var chatHistory = window.application.chatHistory;
            var now = Date.now();

            for (var i = chatHistory.length - 1; i >= 0; i--) {
                var entry = chatHistory[i];
                if (entry.nick === cell.name && (now - entry.time < 15000)) {
                    // Filtering logic from legacy
                    // ... (simplified for Pixi)
                    if (entry.nick === window.nick_val || entry.nick === window.application.lastSentNick) {
                        if (settings.showChatMyOwn) {
                            customTxt = entry.message;
                            temp = now - entry.time;
                            break; // Found recent
                        }
                    } else {
                        customTxt = entry.message;
                        temp = now - entry.time;
                        break;
                    }
                }
            }

            if (!customTxt) return;

            var fontSize = Math.max(10, cell.size / 2);
            var style = new PIXI.TextStyle({
                fontFamily: 'Ubuntu, Arial',
                fontSize: fontSize,
                fill: '#FFFFFF',
                stroke: '#000000',
                strokeThickness: 3,
                wordWrap: true,
                wordWrapWidth: cell.size * 3,
                align: 'center'
            });

            var text = new PIXI.Text(customTxt, style);
            text.resolution = 2;
            text.anchor.set(0.5, 1);
            text.y = -cell.size - 10;

            // Alpha fading
            if (temp < 2000) {
                text.alpha = temp / 2000;
            } else if (temp > 13000) {
                text.alpha = (15000 - temp) / 2000;
            } else {
                text.alpha = 1;
            }

            container.addChild(text);
        },


        drawSpecialEffects: function (container, cell, theme, settings) {
            var effectToCheck = null;
            var effectToCheck2 = null;

            if (window.SpecialEffectPlayers && window.SpecialEffectPlayers[cell.name]) {
                var effects = window.SpecialEffectPlayers[cell.name].split(';');
                if (effects[0]) effectToCheck = effects[0];
                if (effects.length > 1) {
                    for (var i = 0; i < effects.length; i++) {
                        if (effects[i] !== effectToCheck) effectToCheck2 = effects[i];
                    }
                }
            }

            if (cell.SpecialEffect) effectToCheck = cell.SpecialEffect;
            if (cell.SpecialEffect2) effectToCheck2 = cell.SpecialEffect2;

            if (!effectToCheck && !effectToCheck2 && !cell.targetNick) return;

            var draw = (name) => {
                if (!name) return;
                var config = this.getSpecialEffectConfig(name);
                if (!config) return;

                if (name === "BabyBoss" || name === "BabyBoss1") {
                    if (cell.mass < 3000) config = this.getSpecialEffectConfig("BabyBoss");
                    else config = this.getSpecialEffectConfig("BabyBoss1");
                }

                var url = "https://www.legendmod.ml/banners/" + config.icon + ".png";

                try {
                    var texture = PIXI.Texture.from(url);
                    if (texture.valid) {
                        var sprite = new PIXI.Sprite(texture);
                        sprite.anchor.set(0);
                        sprite.x = config.x * cell.size;
                        sprite.y = config.y * cell.size;
                        sprite.width = config.w * cell.size;
                        sprite.height = config.h * cell.size;

                        if (name === "Gladiator") {
                            var d = new Date();
                            var n = d.getSeconds();
                            var hue = n / 60 * 360;
                            var filter = new PIXI.filters.ColorMatrixFilter();
                            filter.hue(hue, false);
                            sprite.filters = [filter];
                        }
                        if (name === "Hero1") {
                            var d = new Date();
                            var n = d.getSeconds();
                            var alphaObj = (n < 30) ? n / 30 : (60 - n) / 30;
                            sprite.alpha = alphaObj;
                        }

                        container.addChild(sprite);
                    } else {
                        texture.once('update', () => {
                            // Redraw? For now, next frame will catch it if texture is valid.
                        });
                    }
                } catch (e) { }
            };

            if (effectToCheck) draw(effectToCheck);
            if (effectToCheck2) draw(effectToCheck2);
        },

        getSpecialEffectConfig: function (name) {
            var map = {
                "Hat": { icon: "iconSpecialSkinEffectsHat3", x: -0.5, y: -1.5, w: 1, h: 1 },
                "JellyFish": { icon: "iconSpecialSkinEffectsJellyFish", x: -1 / 3, y: -1.5, w: 1, h: 1 },
                "King": { icon: "iconSpecialSkinEffectsCrown", x: -0.25, y: -1.325, w: 0.5, h: 0.5 },
                "Smoke": { icon: "iconSpecialSkinEffectsSmoke", x: -2 / 3, y: -1.333, w: 1, h: 1 },
                "USA": { icon: "iconSpecialSkinEffectsUSA", x: -0.714, y: -0.5, w: 2, h: 2 },
                "SunGlasses": { icon: "iconSpecialSkinEffectsSunGlasses", x: -0.85, y: -1.1, w: 1.7, h: 1.4 },
                "Moderator": { icon: "iconSpecialSkinEffectsModerator", x: -0.333, y: -1.325, w: 0.666, h: 0.166 },
                "Turtle": { icon: "iconSpecialSkinEffectsTurtle", x: -0.999, y: -0.81, w: 2, h: 2 },
                "Shiro": { icon: "iconSpecialSkinEffectsShiro", x: 0.05, y: -1.2, w: 1, h: 1 },
                "Bird": { icon: "iconSpecialSkinEffectsBird", x: 0, y: -1.3, w: 1, h: 1 },
                "AbsolutVodka": { icon: "iconSpecialSkinEffectsAbsolutVodka", x: 0.1, y: 0.15, w: 0.666, h: 1 },
                "Chemistry": { icon: "iconSpecialSkinEffectsChemistry", x: 0.3, y: -1.1, w: 0.5, h: 0.5 },
                "Japan": { icon: "iconSpecialSkinEffectsJapan", x: -0.8, y: -1, w: 2, h: 2 },
                "Japan2": { icon: "iconSpecialSkinEffectsJapan2", x: -0.5, y: 0.47, w: 1, h: 1 },
                "Byzantium": { icon: "iconSpecialSkinEffectsByzantium", x: 0.6, y: 0.7, w: 0.333, h: 0.333 },
                "Close": { icon: "iconSpecialSkinEffectsClose", x: 0.6, y: 0.7, w: 0.333, h: 0.333 },
                "Earth": { icon: "iconSpecialSkinEffectsEarth", x: 0.65, y: 0.7, w: 0.333, h: 0.333 },
                "FootStep": { icon: "iconSpecialSkinEffectsFootStep", x: 0.6, y: 0.7, w: 0.333, h: 0.333 },
                "Forward": { icon: "iconSpecialSkinEffectsForward", x: 0.65, y: 0.7, w: 0.333, h: 0.333 },
                "Forever": { icon: "iconSpecialSkinEffectsFriendsForever", x: 0.65, y: 0.7, w: 0.333, h: 0.333 },
                "Forever2": { icon: "iconSpecialSkinEffectsFriendsForever2", x: 0.6, y: 0.7, w: 0.333, h: 0.333 },
                "Forever3": { icon: "iconSpecialSkinEffectsFriendsForever3", x: 0.65, y: 0.7, w: 0.333, h: 0.333 },
                "Police": { icon: "iconSpecialSkinEffectsPolice", x: 0.65, y: 0.7, w: 0.333, h: 0.333 },
                "Police2": { icon: "iconSpecialSkinEffectsPolice2", x: 0.65, y: 0.7, w: 0.333, h: 0.333 },
                "Unrest": { icon: "iconSpecialSkinEffectsUnrest", x: 0.65, y: 0.7, w: 0.333, h: 0.333 },
                "Eagle": { icon: "iconSpecialSkinEffectsEagle", x: 0.65, y: 0.7, w: 0.333, h: 0.333 },
                "BobMarley": { icon: "iconSpecialSkinEffectsBobMarley", x: 0.6, y: 0.6, w: 0.333, h: 0.333 },
                "Einstein": { icon: "iconSpecialSkinEffectsEinstein", x: 0.65, y: 0.65, w: 0.4, h: 0.4 },
                "DeadTable": { icon: "iconSpecialSkinEffectsDeadTable", x: 0.7, y: 0.7, w: 0.333, h: 0.333 },
                "Kebab": { icon: "iconSpecialSkinEffectsKebab", x: 0.4, y: -1, w: 0.5, h: 0.5 },
                "Meditation": { icon: "iconSpecialSkinEffectsMeditation", x: 0.4, y: -1, w: 0.5, h: 0.5 },
                "Splash": { icon: "iconSpecialSkinEffectsSplash", x: -1.15, y: -1.3, w: 2.77, h: 2.77 },
                "Butterfly": { icon: "iconSpecialSkinEffectsButterfly", x: -1, y: -0.6, w: 0.5, h: 0.25 },
                "Mouse": { icon: "iconSpecialSkinEffectsMouse", x: 0.5, y: -0.1, w: 0.333, h: 1 },
                "Sword": { icon: "iconSpecialSkinEffectsSword", x: -0.8, y: -0.6, w: 1.6, h: 1.6 },
                "Mask": { icon: "iconSpecialSkinEffectsMask", x: -0.5, y: 0.25, w: 1, h: 1 },
                "Heart": { icon: "iconSpecialSkinEffectsHeart", x: -0.5, y: 0.333, w: 1, h: 1 },
                "Vip": { icon: "iconSpecialSkinEffectsVip", x: -0.125, y: -1.325, w: 0.2, h: 0.2 },
                "Ddev": { icon: "iconSpecialSkinEffectsDdev", x: -0.125, y: -1.15, w: 0.333, h: 0.2 },
                "Youtube": { icon: "iconSpecialSkinEffectsYoutube", x: -0.166, y: -1.325, w: 0.333, h: 0.333 },
                "LegendHeroes": { icon: "iconSpecialSkinEffectsLegendclan", x: -0.95, y: -1.325, w: 2, h: 0.25 },
                "LegendClan": { icon: "iconSpecialSkinEffectsLegendclan2", x: -0.333, y: -1.325, w: 0.666, h: 0.166 },
                "BabyBoss": { icon: "iconSpecialSkinEffectsBabyBoss", x: -0.95, y: -1.2, w: 0.666, h: 0.666 },
                "BabyBoss1": { icon: "iconSpecialSkinEffectsBabyBoss1", x: -0.95, y: -1.2, w: 0.666, h: 0.666 },
                "Gladiator": { icon: "iconSpecialSkinEffectsGladiator", x: -0.85, y: -1.2, w: 0.666, h: 0.666 },
                "Hero": { icon: "iconSpecialSkinEffectsHero", x: -0.35, y: -1.35, w: 0.666, h: 0.666 },
                "Hero1": { icon: "iconSpecialSkinEffectsHero1", x: -0.1, y: -1.35, w: 1, h: 1 },
                "Hero2": { icon: "iconSpecialSkinEffectsHero2", x: -0.3, y: -1.48, w: 0.5, h: 0.5 },
                "Key": { icon: "iconSpecialSkinEffectsKey", x: 0.4, y: -1.15, w: 0.5, h: 0.5 },
                "MetalOfHonor": { icon: "iconSpecialSkinEffectsMetalOfHonor", x: -0.25, y: 0.8, w: 0.5, h: 0.5 },
                "PeaceMaker": { icon: "iconSpecialSkinEffectsPeaceMaker", x: -0.6, y: -1.2, w: 0.5, h: 0.5 },
                "Survivor": { icon: "iconSpecialSkinEffectsSurvivor", x: -0.6, y: -1.2, w: 0.5, h: 0.666 },
                "Tiger": { icon: "iconSpecialSkinEffectsTiger", x: -1.1, y: -1.3, w: 0.666, h: 0.666 },
                "PanicAtDisco": { icon: "iconSpecialSkinEffectsPanicAtDisco", x: -1, y: -1, w: 1, h: 0.25 },
                "RedArrow": { icon: "iconSpecialSkinEffectsRedArrow", x: -0.5, y: -1.5, w: 1, h: 1 },
            };
            return map[name];
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
