
// Full PixiJS Renderer Implementation for Ogario Test Environment
// Adapted from ExampleScripts/pixirenderer.js to work standalone with Pixi 7+

// Self-Loader: Ensure PixiJS is loaded before running
(function () {
    function initPixiRenderer() {
        (async function () {
            console.log("%c PixiJS " + PIXI.VERSION + " - " + "Loaded & Starting", "background: #E72264; color: #ffffff");

            // Compatibility Shim for Legacy UI/Minimap (allows ogario.js UI to function if legacy renderer is disabled)
            window.drawRender = window.drawRender || {
                fps: 0,
                getTheme: function () { return window.theme || {}; }, // Helper
                drawSectors: function (ctx, mapOffset, x, y, minX, minY, maxX, maxY, stroke, color, width, type) {
                    // Ported from ogario.js for Minimap support
                    if (!mapOffset && type) return;
                    // Simplified sector drawing for minimap context
                    var posX = ~~((maxX - minX) / x);
                    var posY = ~~((maxY - minY) / y);
                    ctx.strokeStyle = stroke;
                    ctx.fillStyle = color;
                    ctx.lineWidth = width;

                    // For minimap grid
                    ctx.beginPath();
                    for (var i = 0; i < x + 1; i++) {
                        var rePosX = minX + posX * i;
                        ctx.moveTo(i == x ? maxX : rePosX, minY);
                        ctx.lineTo(i == x ? maxX : rePosX, maxY);
                    }
                    for (var j = 0; j < y + 1; j++) {
                        var rePosY = minY + posY * j;
                        ctx.moveTo(minX - width / 2, j == y ? maxY : rePosY);
                        ctx.lineTo(maxX + width / 2, j == y ? maxY : rePosY);
                    }
                    ctx.stroke();

                    if (!type) { // MiniMap text
                        ctx.font = (window.gameSetupTheme && window.gameSetupTheme.miniMapFontWeight || '700') + ' ' + ~~(0.4 * posY) + 'px ' + (window.gameSetupTheme && window.gameSetupTheme.miniMapFontFamily || 'Ubuntu');
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        for (var j = 0; j < y; j++) {
                            for (var i = 0; i < x; i++) {
                                var text = String.fromCharCode(65 + j) + (i + 1);
                                var rx = ~~(minX + posX / 2 + i * posX);
                                var ry = ~~(minY + posY / 2 + j * posY);
                                ctx.fillText(text, rx, ry);
                            }
                        }
                    }
                },
                drawBattleAreaOnMinimap: function (ctx, width, heigth, newWidth, offsetX, offsetY) {
                    if (!window.Connection || !window.Connection.battleRoyale || !window.Connection.battleRoyale.state) return;
                    // Basic Safe/Danger Area draw on minimap context
                    var br = window.Connection.battleRoyale;
                    var newX = (br.x + offsetX) * newWidth;
                    var newY = (br.y + offsetY) * newWidth;
                    var newRadius = br.radius * newWidth;

                    // Danger
                    ctx.save();
                    ctx.fillStyle = (window.gameSetupTheme && window.gameSetupTheme.dangerAreaColor) || '#FF0000';
                    ctx.globalAlpha = 0.25;
                    ctx.fillRect(0, 0, width, heigth); // Fill all
                    ctx.globalCompositeOperation = 'destination-out';
                    ctx.globalAlpha = 1;
                    ctx.beginPath();
                    ctx.arc(newX, newY, newRadius, 0, 2 * Math.PI, false);
                    ctx.fill();
                    ctx.restore();

                    // Safe
                    var tx = ~~((br.targetX + offsetX) * newWidth);
                    var ty = ~~((br.targetY + offsetY) * newWidth);
                    var tr = ~~(br.targetRadius * newWidth);
                    ctx.strokeStyle = (window.gameSetupTheme && window.gameSetupTheme.safeAreaColor) || '#FFFFFF';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(tx, ty, tr, 0, 2 * Math.PI);
                    ctx.stroke();
                }
            };

            // Basic setup: Create Pixi App and overlay canvas
            const app = new PIXI.Application();
            await app.init({
                width: window.innerWidth,
                height: window.innerHeight,
                backgroundColor: 0x000000,
                antialias: true,
                resolution: window.devicePixelRatio || 1,
                autoDensity: true,
                hello: false, // Disable banner to prevent crash in restricted environments
                preference: 'webgl' // Prefer WebGL over WebGPU for stability
            });

            var oldCanvas = document.getElementById('canvas');
            if (oldCanvas) {
                oldCanvas.style.opacity = '0'; // Hide legacy canvas but keep layout
            }

            document.body.appendChild(app.canvas);
            app.canvas.id = "pixi-canvas";
            app.canvas.style.position = "absolute";
            app.canvas.style.top = "0";
            app.canvas.style.left = "0";
            app.canvas.style.zIndex = "1"; // Lower z-index so HUD (z=11+) stays on top
            app.canvas.style.pointerEvents = "none";

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

                    // Generate a shared white circle texture for all cells
                    // Usage: Canvas fallback for robustness across Pixi versions
                    var c = document.createElement('canvas');
                    c.width = 512; c.height = 512;
                    var ctx = c.getContext('2d');
                    ctx.fillStyle = '#FFFFFF';
                    ctx.beginPath();
                    ctx.arc(256, 256, 256, 0, Math.PI * 2);
                    ctx.fill();
                    this.circleTexture = PIXI.Texture.from(c);

                    // Map to store existing cell sprites: ID -> { container, bodySprite, skinSprite, text, massText, ... }
                    this.cellsMap = new Map();

                    this.gridGraphics = new PIXI.Graphics();
                    this.container.addChild(this.gridGraphics);

                    this.foodGraphics = new PIXI.Graphics();
                    this.container.addChild(this.foodGraphics);

                    this.indicatorGraphics = new PIXI.Graphics(); // Below cells
                    this.container.addChild(this.indicatorGraphics);

                    this.ghostContainer = new PIXI.Container();
                    this.container.addChild(this.ghostContainer);

                    this.cellContainer = new PIXI.Container();
                    this.cellContainer.sortableChildren = true;
                    // Use ParticleContainer for cells if we didn't have complex masking/text requirements.
                    // But since we need masking for skins and text, Container is safer for now, just better managed.
                    this.container.addChild(this.cellContainer);

                    this.commanderContainer = new PIXI.Container();
                    this.container.addChild(this.commanderContainer);


                    window.addEventListener('resize', this.resize.bind(this));
                },


                resize: function () {
                    this.app.renderer.resize(window.innerWidth, window.innerHeight);
                },

                renderFrame: function () {
                    try {

                        // Ensure we have the game object
                        if (!window.legendmod) return;
                        if (!this.container) return; // Wait for async init
                        var LM = window.legendmod;
                        var theme = this.getTheme();

                        // Ensure settings object is available
                        var settings = window.settings || window.defaultmapsettings || {};

                        // Update Shim FPS
                        if (window.drawRender) window.drawRender.fps = LM.fps || 0;

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
                        this.foodGraphics.clear();
                        // this.foodContainer.removeChildren();
                        this.ghostContainer.removeChildren();
                        // this.cellContainer.removeChildren(); // CHANGED: Retained Mode
                        this.commanderContainer.removeChildren();


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

                        // Teammate Indicators
                        if (settings.teammatesInd && LM.teamPlayers && LM.teamPlayers.length) {
                            this.drawTeammatesInd(this.indicatorGraphics, LM, theme);
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
                            this.drawFood(LM, theme, settings);
                        }


                        // Ghost Cells
                        if (settings.showGhostCells) {
                            this.drawGhostCells(LM, theme, settings);
                        }

                        // Cells
                        var currentFrameIds = new Set();
                        if (LM.cells) {
                            for (var i = 0; i < LM.cells.length; i++) {
                                var cell = LM.cells[i];
                                if (cell) {
                                    currentFrameIds.add(cell.id);
                                    this.drawCell(cell, theme, settings, i);
                                }
                            }
                        }

                        // Cleanup dead cells from the map
                        if (this.cellsMap) {
                            for (var id of this.cellsMap.keys()) {
                                if (!currentFrameIds.has(id)) {
                                    var cellData = this.cellsMap.get(id);
                                    if (cellData && cellData.container) {
                                        cellData.container.destroy({ children: true });
                                    }
                                    this.cellsMap.delete(id);
                                }
                            }
                        }

                    } catch (e) {
                        console.error("PixiRender Frame Error", e);
                    }
                },


                drawGrid: function (g, LM, theme) {
                    if (typeof LM.mapMinX !== 'number') return;
                    // v8 Syntax: Build path then stroke
                    var color = parseInt(theme.gridColor.replace('#', '0x'));
                    var alpha = 0.5;
                    var width = 1 / this.scale;

                    for (var x = LM.mapMinX; x <= LM.mapMaxX; x += 50) {
                        g.moveTo(x, LM.mapMinY);
                        g.lineTo(x, LM.mapMaxY);
                    }
                    for (var y = LM.mapMinY; y <= LM.mapMaxY; y += 50) {
                        g.moveTo(LM.mapMinX, y);
                        g.lineTo(LM.mapMaxX, y);
                    }
                    g.stroke({ width: width, color: color, alpha: alpha });
                },

                drawSectors: function (g, LM, theme, cols, rows) {
                    if (typeof LM.mapMinX !== 'number') return;
                    var w = LM.mapMaxX - LM.mapMinX;
                    var h = LM.mapMaxY - LM.mapMinY;
                    var secW = w / cols;
                    var secH = h / rows;

                    var width = theme.sectorsWidth || 40;
                    var color = parseInt(theme.sectorsColor.replace('#', '0x'));
                    var alpha = 0.2;

                    for (var i = 1; i < cols; i++) {
                        g.moveTo(LM.mapMinX + i * secW, LM.mapMinY);
                        g.lineTo(LM.mapMinX + i * secW, LM.mapMaxY);
                    }
                    for (var i = 1; i < rows; i++) {
                        g.moveTo(LM.mapMinX, LM.mapMinY + i * secH);
                        g.lineTo(LM.mapMaxX, LM.mapMinY + i * secH);
                    }
                    g.stroke({ width: width, color: color, alpha: alpha });
                },

                drawBorders: function (g, LM, theme) {
                    if (typeof LM.mapMinX !== 'number') return;
                    var width = theme.bordersWidth || 40;
                    var color = parseInt(theme.bordersColor.replace('#', '0x'));
                    var alpha = 1;

                    g.rect(LM.mapMinX, LM.mapMinY, LM.mapMaxX - LM.mapMinX, LM.mapMaxY - LM.mapMinY);
                    g.stroke({ width: width, color: color, alpha: alpha });
                },

                drawSplitRange: function (g, LM, theme) {
                    var players = LM.playerCells;
                    if (!players || !players.length) return;
                    var current = 0; // Simplified to 0
                    if (players[current]) {
                        var width = 6;
                        var color = parseInt(theme.splitRangeColor ? theme.splitRangeColor.replace('#', '0x') : 0xFFFFFF);
                        var alpha = 0.3;
                        g.circle(players[current].x, players[current].y, players[current].size + 760);
                        g.stroke({ width: width, color: color, alpha: alpha });
                    }
                },

                drawCursorTracking: function (g, LM, theme) {
                    var players = LM.playerCells;
                    if (!players || !players.length) return;
                    var width = theme.cursorTrackingSize || 5;
                    var color = parseInt(theme.cursorTrackingColor ? theme.cursorTrackingColor.replace('#', '0x') : 0xFFFFFF);
                    var alpha = 0.3;

                    for (var i = 0; i < players.length; i++) {
                        g.moveTo(players[i].x, players[i].y);
                        g.lineTo(LM.cursorX, LM.cursorY);
                    }
                    g.stroke({ width: width, color: color, alpha: alpha });
                },

                drawTeammatesInd: function (g, LM, theme) {
                    var players = LM.teamPlayers;
                    if (!players || !players.length) return;

                    var color = parseInt((theme.teammatesIndColor || '#FFFFFF').replace('#', '0x'));

                    for (var i = 0; i < players.length; i++) {
                        var p = players[i];
                        if (!p) continue;
                        var tx = p.x;
                        var ty = p.y - p.size - 50;

                        // Triangle
                        g.poly([tx, ty, tx - 20, ty - 40, tx + 20, ty - 40]);
                    }
                    g.fill({ color: color });
                    g.stroke({ width: 1, color: 0x000000 });
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
                    var drawSet = (list, colorStr) => {
                        if (!list || !list.length) return;
                        var color = parseInt((colorStr || '#FFFFFF').replace('#', '0x'));

                        for (var i = 0; i < list.length; i++) {
                            var item = list[i];
                            g.circle(item.x, item.y, item.size); // Ring around the cell
                        }
                        g.stroke({ width: width, color: color, alpha: 0.75 });
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

                    for (var i = 0; i < LM.viruses.length; i++) {
                        var v = LM.viruses[i];
                        if (!v.invisible) {
                            g.circle(v.x, v.y, v.size + 820);
                        }
                    }
                    g.fill({ color: color, alpha: 0.1 });
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
                            g.circle(wave.x, wave.y, r);
                            g.stroke({ width: 10, color: color, alpha: alpha });
                        }
                    }
                },

                drawDoubleSplitRange: function (g, LM, theme) {
                    var players = LM.playerCells;
                    if (!players || !players.length) return;
                    var current = 0;
                    if (players[current]) {
                        var width = 2;
                        var color = parseInt(theme.splitRangeColor ? theme.splitRangeColor.replace('#', '0x') : 0xFFFFFF);
                        var alpha = 0.3;
                        g.circle(players[current].x, players[current].y, players[current].size + 1520);
                        g.stroke({ width: width, color: color, alpha: alpha });
                    }
                },

                drawBattleArea: function (g, LM, theme) {
                    // Simplified BR Zone (Red Border)
                    if (typeof LM.mapMinX !== 'number') return;

                    g.rect(LM.mapMinX, LM.mapMinY, LM.mapMaxX - LM.mapMinX, LM.mapMaxY - LM.mapMinY);
                    g.stroke({ width: 15, color: 0xFF0000, alpha: 0.5 });
                },

                drawCommander: function (g, LM, theme, type) {
                    // Type 1: Spawn Point (Commander 1)
                    // Type 2: Targeting Lead (Commander 2)

                    var x, y, angle, angle1, images = [];

                    if (type === 1) {
                        if (!window.ogario || !window.ogario.spawnX) return;
                        x = window.ogario.spawnX;
                        y = window.ogario.spawnY;
                        angle = LM.cAngle;
                        angle1 = LM.cAngle1; // Usually negative/inverse

                        // Get Images (Settings or Defaults)
                        var s = window.defaultSettings || {};
                        images.push(s.commanderImage);  // Base
                        images.push(s.commanderImage1); // Mid
                        // images.push(s.commanderImage2); // Top? Legacy draws 3.
                    } else {
                        if (!window.targetingLeadX) return;
                        x = window.targetingLeadX;
                        y = window.targetingLeadY;
                        angle = LM.cAngle; // Reuse? Or cAngle2? Legacy uses same for animation usually
                        angle1 = LM.cAngle1;

                        var s = window.defaultSettings || {};
                        images.push(s.commanderImage3);
                        images.push(s.commanderImage4);
                        images.push(s.commanderImage5);
                    }

                    if (!x || !y || !LM.cRadius) return;

                    // Draw sprites
                    // Ideally we don't create new sprites every frame, but for now we follow the removeChildren/re-add pattern
                    // Optim: Cache textures.

                    var rotators = [angle, angle1, angle]; // Rotation for each layer

                    for (var i = 0; i < images.length; i++) {
                        if (!images[i]) continue;
                        try {
                            var sprite = PIXI.Sprite.from(images[i]);
                            sprite.anchor.set(0.5);
                            sprite.x = x;
                            sprite.y = y;
                            sprite.width = LM.cRadius;
                            sprite.height = LM.cRadius;
                            sprite.rotation = rotators[i] || 0;
                            sprite.alpha = LM.cAlpha || 0.5;

                            this.commanderContainer.addChild(sprite);
                        } catch (e) { }
                    }
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

                        g.circle(0, 0, cell.size);
                        g.fill({ color: color });
                        g.stroke({ width: 2, color: 0x000000 });

                        container.addChild(g);

                        if (cell.skinURL && settings.showSkins) {
                            // Basic skin for ghost
                            try {
                                var sprite = PIXI.Sprite.from(cell.skinURL);
                                sprite.width = cell.size * 2;
                                sprite.height = cell.size * 2;
                                sprite.anchor.set(0.5);
                                var mask = new PIXI.Graphics();
                                mask.circle(0, 0, cell.size);
                                mask.fill({ color: 0xFFFFFF });
                                sprite.mask = mask;
                                container.addChild(mask);
                                container.addChild(sprite);
                            } catch (e) { }
                        }

                        this.ghostContainer.addChild(container);
                    }
                },

                drawFood: function (LM, theme, settings) {
                    if (!LM.food) return;

                    // Check settings (passed from renderFrame)
                    var rainbow = settings && settings.rainbowFood;

                    var g = this.foodGraphics;

                    if (!rainbow) {
                        var color = parseInt((theme.foodColor || '#FFFFFF').replace('#', '0x'));
                        for (var j = 0; j < LM.food.length; j++) {
                            var f = LM.food[j];
                            if (Math.abs(f.x - this.camX) > window.innerWidth / this.scale / 2 + 50) continue;
                            if (Math.abs(f.y - this.camY) > window.innerHeight / this.scale / 2 + 50) continue;
                            g.circle(f.x, f.y, f.size);
                        }
                        g.fill({ color: color });
                    } else {
                        // Rainbow mode: Draw individual colored circles
                        for (var j = 0; j < LM.food.length; j++) {
                            var f = LM.food[j];
                            if (Math.abs(f.x - this.camX) > window.innerWidth / this.scale / 2 + 50) continue;
                            if (Math.abs(f.y - this.camY) > window.innerHeight / this.scale / 2 + 50) continue;

                            var color = f.color ? parseInt(f.color.replace('#', '0x')) : 0xFFFFFF;
                            g.circle(f.x, f.y, f.size);
                            g.fill({ color: color });
                        }
                    }
                    // this.foodContainer.addChild(g);
                },

                drawCell: function (cell, theme, settings, index) {
                    var cellData = this.cellsMap.get(cell.id);

                    // --- CREATION PHASE ---
                    if (!cellData) {
                        var container = new PIXI.Container();
                        this.cellContainer.addChild(container);

                        // Body (Sprite for normal cells)
                        var body = new PIXI.Sprite(this.circleTexture);
                        body.anchor.set(0.5);
                        container.addChild(body);

                        // Virus Body (Graphics, lazy load)
                        var virusG = null;

                        // Skin
                        var skin = new PIXI.Sprite();
                        skin.anchor.set(0.5);
                        container.addChild(skin);

                        // Skin Mask (Fast circular mask using texture)
                        var skinMask = new PIXI.Sprite(this.circleTexture);
                        skinMask.anchor.set(0.5);
                        skin.mask = skinMask;
                        container.addChild(skinMask);

                        // Name
                        var nameText = new PIXI.Text('', { fontFamily: 'Ubuntu, Arial', fontWeight: 'bold', fill: '#FFFFFF', stroke: '#000000', strokeThickness: 3, align: 'center' });
                        nameText.anchor.set(0.5);
                        nameText.resolution = 2;
                        container.addChild(nameText);

                        // Mass
                        var massText = new PIXI.Text('', { fontFamily: 'Ubuntu, Arial', fontWeight: 'bold', fill: '#FFFFFF', stroke: '#000000', strokeThickness: 3, align: 'center' });
                        massText.anchor.set(0.5);
                        massText.resolution = 2;
                        container.addChild(massText);

                        // --- TRANSPARENCY SUPPORT ---
                        if (settings.transparentCells) {
                            container.alpha = settings.cellsAlpha || 0.4;
                        } else {
                            container.alpha = 1;
                        }

                        // Effects Container
                        var effects = new PIXI.Container();
                        container.addChild(effects);

                        // Chat
                        var chatText = new PIXI.Text('', { fontFamily: 'Ubuntu, Arial', fill: '#FFFFFF', stroke: '#000000', strokeThickness: 3, wordWrap: true, align: 'center' });
                        chatText.anchor.set(0.5, 1);
                        chatText.resolution = 2; // High res chat
                        container.addChild(chatText);

                        cellData = {
                            container: container,
                            body: body,
                            virusG: virusG,
                            skin: skin,
                            skinMask: skinMask,
                            name: nameText,
                            mass: massText,
                            effects: effects,
                            chat: chatText,
                            lastSkin: null
                        };
                        this.cellsMap.set(cell.id, cellData);
                    }

                    // --- UPDATE PHASE ---
                    var d = cellData;
                    d.container.x = cell.x;
                    d.container.y = cell.y;
                    d.container.zIndex = index || 0; // Use iteration order for correct stacking (Ogario logic)
                    // Ideally: this.cellContainer.sortChildren(); but that requires zIndex enabled.
                    // For now, assume iteration order is sufficient if we didn't use zIndex. But since we Reuse, the child index is static.
                    // Parity Issue: Ogario sorts cells by size.
                    // If `LM.cells` is sorted, we should probably resort children or use zIndex.
                    // this.cellContainer.sortableChildren = true; d.container.zIndex = i?
                    // Let's rely on child index matching map insertion? No.
                    // We can just use `this.cellContainer.setChildIndex(d.container, i)` if we pass index `i`.
                    // But we don't have `i` here easily. 
                    // Let's ignore z-index perf for a moment and focus on memory.

                    var size2 = cell.size * 2;

                    if (cell.isVirus) {
                        d.body.visible = false;
                        d.skin.visible = false;
                        d.skinMask.visible = false;

                        if (!d.virusG) {
                            d.virusG = new PIXI.Graphics();
                            d.container.addChildAt(d.virusG, 0); // Bottom
                        }
                        d.virusG.visible = true;
                        d.virusG.clear();

                        // Dynamic Virus Color/Stroke
                        var vColor = parseInt((theme.virusColor || '#33FF33').replace('#', '0x'));
                        var vStrokeColor = parseInt((theme.virusStrokeColor || '#000000').replace('#', '0x'));
                        var vStrokeSize = theme.virusStrokeSize || 4;

                        // Ogario Logic for Stroke Color (e.g. if dangerous to player)
                        if (window.ogario && window.ogario.play && window.ogario.playerMaxMass) {
                            var floor = cell.size * cell.size / 100; // mass
                            var biggest = floor / (window.ogario.selectBiggestCell ? window.ogario.playerMaxMass : window.ogario.playerMinMass);
                            if (biggest > 0.76) {
                                vStrokeColor = 0xFFDC00; // Gold/Warning
                            } else {
                                vStrokeColor = 0xC80000; // Red/Danger
                            }
                        }

                        // d.virusG.lineStyle(vStrokeSize, vStrokeColor);
                        // d.virusG.beginFill(vColor, theme.virusAlpha || 0.6);
                        var points = 20;
                        var outer = cell.size;
                        var inner = cell.size * 0.9;
                        d.virusG.moveTo(outer, 0);
                        for (var j = 1; j <= points * 2; j++) {
                            var angle = (Math.PI / points) * j;
                            var r = (j % 2 === 0) ? outer : inner;
                            d.virusG.lineTo(r * Math.cos(angle), r * Math.sin(angle));
                        }
                        d.virusG.closePath();

                        d.virusG.fill({ color: vColor, alpha: theme.virusAlpha || 0.6 });
                        d.virusG.stroke({ width: vStrokeSize, color: vStrokeColor });
                    } else {
                        if (d.virusG) d.virusG.visible = false;
                        d.body.visible = true;
                        d.body.width = size2;
                        d.body.height = size2;
                        d.body.tint = cell.color ? parseInt(cell.color.replace('#', '0x')) : 0xFFFFFF;

                        // Skin Update
                        var skinTexture = null;
                        var isVideo = false;

                        // 1. Video Check
                        if (cell.skinURL) {
                            if (cell.skinURL.endsWith('.mp4') || cell.skinURL.endsWith('.webm') || (window.application && window.application.customSkinsMap && window.application.customSkinsMap[cell.name] && window.application.customSkinsMap[cell.name].endsWith && (window.application.customSkinsMap[cell.name].endsWith('.mp4')))) {
                                isVideo = true;
                            }
                        }

                        if (isVideo) {
                            // Pixi Texture Caching handles duplication if url is same
                            try {
                                skinTexture = PIXI.Texture.from(cell.skinURL);
                                var source = skinTexture.baseTexture.resource.source;
                                if (source && source.tagName === 'VIDEO') {
                                    source.loop = true;
                                    source.muted = true;
                                    source.play().catch(e => { });
                                }
                            } catch (e) { }
                        } else if (settings.showSkins) {
                            // 2. getCustomSkin
                            if (window.application && window.application.getCustomSkin) {
                                try {
                                    var skinObj = window.application.getCustomSkin(cell.name, cell.color);
                                    if (skinObj) skinTexture = PIXI.Texture.from(skinObj);
                                } catch (e) { }
                            }
                            // 3. Fallback
                            if (!skinTexture && cell.skinURL) {
                                skinTexture = PIXI.Texture.from(cell.skinURL);
                            }
                        }

                        if (skinTexture && skinTexture.valid !== false) {
                            d.skin.visible = true;
                            d.skin.texture = skinTexture;
                            d.skin.width = size2;
                            d.skin.height = size2;

                            if (!settings.transparentSkins) {
                                d.skinMask.visible = true;
                                d.skinMask.width = size2;
                                d.skinMask.height = size2;
                            } else {
                                d.skinMask.visible = false;
                                d.skin.mask = null;
                            }
                        } else {
                            d.skin.visible = false;
                            d.skinMask.visible = false;
                        }
                    }

                    // Name
                    if (settings.showNames && cell.name) {
                        d.name.visible = true;
                        if (d.name.text !== cell.name) d.name.text = cell.name;
                        var fSize = Math.max(10, cell.size / 2.5);
                        if (d.name.style.fontSize !== fSize) {
                            d.name.style.fontSize = fSize;
                            d.name.style.strokeThickness = Math.max(3, cell.size / 8);
                        }
                    } else {
                        d.name.visible = false;
                    }

                    // Mass
                    if (settings.showMass) {
                        d.mass.visible = true;
                        var massVal = Math.floor(cell.mass || cell.size * cell.size / 100).toString();
                        if (d.mass.text !== massVal) d.mass.text = massVal;
                        var fmSize = Math.max(10, cell.size / 3.5);
                        if (d.mass.style.fontSize !== fmSize) d.mass.style.fontSize = fmSize;
                        d.mass.y = cell.name ? cell.size / 2 : 0;
                    } else {
                        d.mass.visible = false;
                    }

                    // Special Effects (Simple redraw for now)
                    d.effects.removeChildren();
                    this.drawSpecialEffects(d.effects, cell, theme, settings);

                    // Chat
                    if (window.application && window.application.chatHistory && window.application.chatHistory.length) {
                        // Same logic as before but targeting d.chat
                        // To minimize logic, I'll allow drawChat to update d.chat. 
                        // Wait, drawChat expects to CREATE a Text.
                        // Refactor drawChat to UPDATE d.chat or hide it.
                        // I will inline the simple check here or call a modified drawChat.
                        // Let's inline logic to update d.chat.

                        var customTxt = null;
                        var temp = 0;
                        var chatHistory = window.application.chatHistory;
                        var now = Date.now();
                        for (var i = chatHistory.length - 1; i >= 0; i--) {
                            var entry = chatHistory[i];
                            if (entry.nick === cell.name && (now - entry.time < 15000)) {
                                if (entry.nick === window.nick_val || entry.nick === window.application.lastSentNick) {
                                    if (settings.showChatMyOwn) { customTxt = entry.message; temp = now - entry.time; break; }
                                } else {
                                    customTxt = entry.message; temp = now - entry.time; break;
                                }
                            }
                        }

                        if (customTxt) {
                            d.chat.visible = true;
                            d.chat.text = customTxt;
                            d.chat.style.wordWrapWidth = cell.size * 3;
                            d.chat.style.fontSize = Math.max(10, cell.size / 2);
                            d.chat.y = -cell.size - 10;
                            if (temp < 2000) d.chat.alpha = temp / 2000;
                            else if (temp > 13000) d.chat.alpha = (15000 - temp) / 2000;
                            else d.chat.alpha = 1;
                        } else {
                            d.chat.visible = false;
                        }
                    } else {
                        d.chat.visible = false;
                    }

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
                console.log("%c PixiJS " + PIXI.VERSION + " - " + "WebGL 2" + " %c https://pixijs.com", "background: #E72264; padding:5px; border-radius: 2px; color: #ffffff", "background: #fff; color: #E72264; padding:5px");
            } else {
                console.error("PIXI is not defined! Make sure pixi.js is loaded before this script.");
            }
            console.log("Full PixiRender loaded");

            // Debug helper
            setInterval(function () {
                if (window.legendmod) {
                    // logic
                } else {
                    // console.log("Pixi Debug - Waiting for legendmod...");
                }
            }, 5000);

        })(); // End async function
    } // End initPixiRenderer

    // Check for PIXI and load if missing
    if (typeof PIXI === 'undefined') {
        console.warn("PixiJS not found. Auto-loading from CDN...");
        var script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/pixi.js@8.6.6/dist/pixi.min.js";
        script.onload = function () {
            console.log("PixiJS Auto-loaded.");
            initPixiRenderer();
        };
        script.onerror = function () {
            console.error("Failed to auto-load PixiJS from CDN.");
        };
        document.head.appendChild(script);
    } else {
        initPixiRenderer();
    }
})();
