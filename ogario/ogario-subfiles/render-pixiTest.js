
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

    // --- Helpers / Classes from pixirenderer.js ---

    var Texts = new (class {
        constructor() {
            this.nickCaches = new Map()
            this.massCaches = new Map()
            this.maxCacheLife = 1000
            this.massUpdateInterval = 500 // fallback
            // We'll use Pixi Text instead of caching canvas 2d texts if possible, 
            // but for exact replication we might need similar logic. 
            // However, caching to textures is better in Pixi.
            // For now, let's implement simple Text creation/updating first to ensure something SHOWS.
            // Keeping distinct objects for caching PIXI.Text objects.

            this.textPool = [];
        }

        // Simplified Text handling for Pixi
        getNickText(nick, size, color) {
            // Check cache or create new PIXI.Text
            // implementation simplified for immediate visibility
            var style = new PIXI.TextStyle({
                fontFamily: 'Ubuntu, Arial',
                fontSize: size,
                fill: color || '#FFFFFF',
                stroke: '#000000',
                strokeThickness: 3,
                align: 'center'
            });
            var text = new PIXI.Text(nick, style);
            text.anchor.set(0.5);
            return text;
        }
    })();


    var PixiRender = {
        app: app,
        container: null,
        cellContainer: null,
        foodContainer: null,
        gridGraphics: null,
        scale: 1,
        camX: 0,
        camY: 0,
        tempGraphics: null, // Shared graphics object for drawing shapes

        init: function () {
            this.container = new PIXI.Container();
            this.app.stage.addChild(this.container);

            // Layers
            this.gridGraphics = new PIXI.Graphics();
            this.container.addChild(this.gridGraphics);

            this.foodContainer = new PIXI.Container(); // Static/Many objects
            this.container.addChild(this.foodContainer);

            this.cellContainer = new PIXI.Container();
            this.container.addChild(this.cellContainer);

            this.tempGraphics = new PIXI.Graphics(); // For dynamic drawing per frame if needed
            this.container.addChild(this.tempGraphics);

            window.addEventListener('resize', this.resize.bind(this));
        },

        resize: function () {
            this.app.renderer.resize(window.innerWidth, window.innerHeight);
        },

        renderFrame: function () {
            // Main Loop
            try {
                // Ensure globals exist
                if (!window.application || !window.application.tab || !window.application.tab.master) return;
                var activeTab = window.application.tab.master;

                // Update Camera
                this.camX = activeTab.viewX || 0;
                this.camY = activeTab.viewY || 0;

                // Calculate Scale (Logic from ogario)
                this.scale = Math.max(window.innerWidth / 1920, window.innerHeight / 1080);
                if (activeTab.playerSize) {
                    this.scale *= Math.min(64 / activeTab.playerSize, 1) ** 0.2;
                }

                // Apply Transform
                this.container.scale.set(this.scale);
                this.container.position.set(window.innerWidth / 2, window.innerHeight / 2);
                this.container.pivot.set(this.camX, this.camY);

                // Clear
                this.gridGraphics.clear();
                this.tempGraphics.clear();
                this.cellContainer.removeChildren();
                this.foodContainer.removeChildren();

                // Draw Grid/Borders/Sectors
                if (window.settings && window.settings.showGrid) {
                    this.drawGrid(this.gridGraphics, activeTab);
                }
                if (window.settings && window.settings.showMapBorders) {
                    this.drawBorders(this.gridGraphics, activeTab);
                }

                // Iterate Tabs and Draw Entities
                if (window.application && window.application.tabs) {
                    for (var i = 0; i < window.application.tabs.length; i++) {
                        var tab = window.application.tabs[i];
                        if (tab) {
                            // Draw Food
                            if (window.settings && window.settings.showFood) {
                                this.drawFood(tab);
                            }

                            // Draw Cells
                            if (tab.cells) {
                                for (var j = 0; j < tab.cells.length; j++) {
                                    this.drawCell(tab.cells[j]);
                                }
                            }

                            // Draw Viruses
                            // In ogario cells list might contain viruses, check isVirus?
                            // usually handled within cells loop or separate list
                        }
                    }
                }

            } catch (e) {
                console.error("PixiRender Frame Error", e);
            }
        },

        drawGrid: function (g, tab) {
            // Simplified grid
            if (!tab || typeof tab.mapMinX !== 'number') return;
            var w = tab.mapMaxX - tab.mapMinX;
            var h = tab.mapMaxY - tab.mapMinY;
            g.lineStyle(2, 0x333333, 0.5);
            // Draw vertical lines
            for (var x = tab.mapMinX; x <= tab.mapMaxX; x += 50) {
                g.moveTo(x, tab.mapMinY);
                g.lineTo(x, tab.mapMaxY);
            }
            // Draw horizontal lines
            for (var y = tab.mapMinY; y <= tab.mapMaxY; y += 50) {
                g.moveTo(tab.mapMinX, y);
                g.lineTo(tab.mapMaxX, y);
            }
        },

        drawBorders: function (g, tab) {
            if (!tab || typeof tab.mapMinX !== 'number') return;
            g.lineStyle(20, 0xFF0000, 1); // Red thick border
            g.drawRect(tab.mapMinX, tab.mapMinY, tab.mapMaxX - tab.mapMinX, tab.mapMaxY - tab.mapMinY);
        },

        drawFood: function (tab) {
            // Food is high count, use Graphics batching (drawCircle on one Graphics object)
            // this.gridGraphics or a dedicated foodGraphics?
            // Let's use `tempGraphics` or a specific graphics in foodContainer

            // Reuse graphics object for food to be efficient
            var g = this.tempGraphics; // or logic to add one to foodContainer

            if (tab.food) {
                g.beginFill(window.theme ? parseInt(window.theme.foodColor.replace('#', '0x')) : 0xFFFFFF);
                for (var j = 0; j < tab.food.length; j++) {
                    var f = tab.food[j];
                    g.drawCircle(f.x, f.y, f.size);
                }
                g.endFill();
            }
        },

        drawCell: function (cell) {
            // Create Sprite/Graphics for cell
            // For high fidelity, we should cache these container/sprites rather than recreate every frame.
            // But for now, recreating ensures correctness.

            var container = new PIXI.Container();
            container.x = cell.x;
            container.y = cell.y;

            // Shape
            var g = new PIXI.Graphics();
            var color = cell.color ? parseInt(cell.color.replace('#', '0x')) : 0xFFFFFF;
            if (cell.isVirus) {
                color = 0x33FF33; // Green virus default
                // Draw spikes... simplified as circle for now or jagged
            }

            g.beginFill(color);
            g.lineStyle(4, 0x000000); // Stroke
            g.drawCircle(0, 0, cell.size);
            g.endFill();
            container.addChild(g);

            // Skin?
            if (cell.skinURL) {
                // Check texture cache or load
                // Simple impl:
                // var sprite = PIXI.Sprite.from(cell.skinURL);
                // sprite.width = cell.size * 2;
                // sprite.height = cell.size * 2;
                // sprite.anchor.set(0.5);
                // container.addChild(sprite);
                // (Masking needed to be circular)
            }

            // Name
            if (cell.name && window.settings && window.settings.showNames) {
                var text = Texts.getNickText(cell.name, cell.size / 2.5, '#FFFFFF');
                container.addChild(text);
            }

            // Mass
            if (window.settings && window.settings.showMass) {
                // var massText = ...
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
