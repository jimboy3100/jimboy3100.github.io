/*
    PixiJS Renderer for Ogario
    Based on ExampleScripts/pixirenderer.js
*/

// Initialize Pixi Application
var app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x000000,
    antialias: true,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    view: document.getElementById('canvas') // We will replace the canvas or use a new one
});

// Since we want to disable the old canvas, we should probably append this View to the document
// and hide the old one. But the user said "uses canvas or pixi.js".
// If we use the existing canvas ID 'canvas', Pixi can take it over if we pass it in 'view' option.
// However, the legacy code might still try to getContext('2d') on it.
// Best approach: Create a NEW canvas for Pixi, overlay it, and hide the old 'canvas'.

var oldCanvas = document.getElementById('canvas');
if (oldCanvas) {
    oldCanvas.style.display = 'none';
}

document.body.appendChild(app.view);
app.view.id = "pixi-canvas";
app.view.style.position = "absolute";
app.view.style.top = "0";
app.view.style.left = "0";
app.view.style.zIndex = "100"; // Ensure it's on top of background but maybe below UI overlays
app.view.style.pointerEvents = "none"; // Let clicks pass through to game logic if needed

// We need to implement the drawing logic. 
// We can use the CanvasRender object from the example as a starting point.
// I'll copy the logic from pixirenderer.js but adapt it to use 'app' we just created.

var PixiRender = {
    app: app,
    scale: 1,
    camX: 0,
    camY: 0,
    cellsFrame: [],
    virusesFrame: [],

    init: function () {
        console.log("PixiRender initialized");
        this.container = new PIXI.Container();
        this.app.stage.addChild(this.container);

        this.gridGraphics = new PIXI.Graphics();
        this.container.addChild(this.gridGraphics);

        this.cellContainer = new PIXI.Container();
        this.container.addChild(this.cellContainer);

        // Listen for resize
        window.addEventListener('resize', this.resize.bind(this));
    },

    resize: function () {
        this.app.renderer.resize(window.innerWidth, window.innerHeight);
    },

    renderFrame: function () {
        // This function will be called by the game loop

        // 1. Update Camera/View
        if (window.application && window.application.tab && window.application.tab.master) {
            var activeTab = window.application.tab.master;
            this.camX = activeTab.viewX;
            this.camY = activeTab.viewY;
            // Calculate Scale (simplified)
            this.scale = Math.max(window.innerWidth / 1920, window.innerHeight / 1080);
            if (activeTab.playerSize) {
                this.scale *= Math.min(64 / activeTab.playerSize, 1) ** 0.2;
                // Note: Actual zoom logic is more complex in ogario, reusing what we can.
            }
        }

        this.container.scale.set(this.scale);
        this.container.position.set(window.innerWidth / 2, window.innerHeight / 2);
        this.container.pivot.set(this.camX, this.camY);

        // 2. Draw Grid/Borders (Simplified)
        this.gridGraphics.clear();
        this.gridGraphics.lineStyle(50, 0xFFFFFF, 0.5);
        // Assuming map size roughly... need to get actual map boundaries
        if (window.application && window.application.tab && window.application.tab.master) {
            var m = window.application.tab.master;
            this.gridGraphics.drawRect(m.mapMinX, m.mapMinY, m.mapMaxX - m.mapMinX, m.mapMaxY - m.mapMinY);
        }

        // 3. Draw Cells
        // We need to access the cells from the game state.
        // In ogario, it seems to be application.tabs[i].cells

        // Use a simple pool or create/destroy sprites for now (inefficient but works for "precise" starting point)
        // Optimization comes later.

        this.cellContainer.removeChildren(); // clear previous frame

        if (window.application && window.application.tabs) {
            for (var i = 0; i < window.application.tabs.length; i++) {
                var tab = window.application.tabs[i];
                if (tab && tab.cells) {
                    for (var j = 0; j < tab.cells.length; j++) {
                        var cell = tab.cells[j];
                        this.drawCell(cell);
                    }
                }
            }
        }
    },

    drawCell: function (cell) {
        var graphics = new PIXI.Graphics();
        graphics.beginFill(cell.color ? parseInt(cell.color.replace('#', '0x')) : 0xFFFFFF);
        graphics.drawCircle(0, 0, cell.size);
        graphics.endFill();
        graphics.x = cell.x;
        graphics.y = cell.y;
        this.cellContainer.addChild(graphics);

        // Name? Mass?
        if (cell.name) {
            var text = new PIXI.Text(cell.name, { fontFamily: 'Arial', fontSize: cell.size / 2, fill: 0xFFFFFF, align: 'center' });
            text.anchor.set(0.5);
            graphics.addChild(text);
        }
    }
};

PixiRender.init();

// Hook into requestAnimationFrame
// We can use PIXI's ticker, but we need to sync with Ogario's logic updates.
// If Ogario uses requestAnimationFrame for logic + render, we should let Ogario run logic, but prevent its render,
// and run our render.

// Global hook
var _originalReq = window.requestAnimationFrame;
window.requestAnimationFrame = function (callback) {
    // We assume the callback contains the game loop.
    // We want to execute the callback (which updates logic)
    // BUT we want to capture when it tries to draw.
    // Since we disabled the old canvas, the old draw calls might fail or do nothing (off-screen).
    // We just need to ensure OUR render function is called.

    PixiRender.renderFrame();

    return _originalReq(callback);
};

console.log("PixiRender hooked");
