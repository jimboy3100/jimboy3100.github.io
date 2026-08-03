import { LegendArcEngine } from '../src/legend-arc.js';

let engine = null;
let primitiveCount = 10000;
let primitiveType = 'mixed';
let offscreenRatio = 0;
let radiusProfile = 'small';
let renderMode = 'fast';

let primitives = [];

function showError(msg) {
    const el = document.getElementById('error-msg');
    if (el) {
        el.innerText = msg;
        el.style.display = 'block';
    }
    console.error('[Benchmark Error]', msg);
}

function generatePrimitives() {
    primitives = [];

    const minRadius = radiusProfile === 'small' ? 5 : 50;
    const maxRadius = radiusProfile === 'small' ? 20 : 200;

    for (let i = 0; i < primitiveCount; i++) {
        const isOffscreen = Math.random() < offscreenRatio;
        let relX, relY;

        if (isOffscreen) {
            relX = Math.random() < 0.5 ? -0.3 : 1.3;
            relY = Math.random() < 0.5 ? -0.3 : 1.3;
        } else {
            relX = Math.random();
            relY = Math.random();
        }

        const radius = minRadius + Math.random() * (maxRadius - minRadius);
        const color = `hsl(${Math.floor(Math.random() * 360)}, 90%, 55%)`;
        const relVx = (Math.random() - 0.5) * 0.002;
        const relVy = (Math.random() - 0.5) * 0.002;

        let type = primitiveType;
        if (primitiveType === 'mixed') {
            const types = ['circle', 'ring', 'arc5', 'arc30', 'arc180'];
            type = types[i % types.length];
        }

        primitives.push({ relX, relY, relVx, relVy, radius, color, type });
    }
}

async function init() {
    const canvas = document.getElementById('canvas');
    if (!navigator.gpu) {
        showError('WebGPU is not supported in this browser environment.');
        return;
    }

    try {
        engine = await LegendArcEngine.create(canvas, { mode: renderMode });
    } catch (e) {
        showError(`Engine initialization failed: ${e.message}`);
        return;
    }

    // Bind controls
    document.getElementById('count-select').addEventListener('change', (e) => {
        primitiveCount = parseInt(e.target.value, 10);
        generatePrimitives();
    });

    document.getElementById('type-select').addEventListener('change', (e) => {
        primitiveType = e.target.value;
        generatePrimitives();
    });

    document.getElementById('offscreen-select').addEventListener('change', (e) => {
        offscreenRatio = parseFloat(e.target.value);
        generatePrimitives();
    });

    document.getElementById('radius-select').addEventListener('change', (e) => {
        radiusProfile = e.target.value;
        generatePrimitives();
    });

    document.getElementById('mode-select').addEventListener('change', (e) => {
        renderMode = e.target.value;
        engine.mode = renderMode;
    });

    window.addEventListener('resize', () => {
        if (engine) engine.resize();
    });

    engine.resize();
    generatePrimitives();

    let frameCount = 0;
    let lastFpsTime = performance.now();
    let isRendering = false;

    async function loop() {
        if (isRendering) {
            requestAnimationFrame(loop);
            return;
        }

        isRendering = true;

        const width = canvas.width;
        const height = canvas.height;

        const recordStart = performance.now();
        engine.beginFrame();

        for (let i = 0; i < primitiveCount; i++) {
            const p = primitives[i];

            // Animate positions relative to screen dimensions
            p.relX += p.relVx;
            p.relY += p.relVy;

            if (p.relX < 0 || p.relX > 1) p.relVx = -p.relVx;
            if (p.relY < 0 || p.relY > 1) p.relVy = -p.relVy;

            const posX = p.relX * width;
            const posY = p.relY * height;

            switch (p.type) {
                case 'circle':
                    engine.fillCircle(posX, posY, p.radius, p.color);
                    break;
                case 'ring':
                    engine.strokeCircle(posX, posY, p.radius, Math.max(1, p.radius * 0.2), p.color);
                    break;
                case 'arc5':
                    engine.strokeArc(posX, posY, p.radius, 0, (5 * Math.PI) / 180, Math.max(1, p.radius * 0.2), p.color);
                    break;
                case 'arc30':
                    engine.strokeArc(posX, posY, p.radius, 0, (30 * Math.PI) / 180, Math.max(1, p.radius * 0.2), p.color);
                    break;
                case 'arc180':
                    engine.strokeArc(posX, posY, p.radius, 0, Math.PI, Math.max(1, p.radius * 0.2), p.color);
                    break;
            }
        }

        const recordEnd = performance.now();

        const submitStart = performance.now();
        engine.flush();
        const submitEnd = performance.now();

        const recordTime = recordEnd - recordStart;
        const submitTime = submitEnd - submitStart;

        let gpuTime = 0;
        if (engine.device.queue.onSubmittedWorkDone) {
            const gpuStart = performance.now();
            await engine.device.queue.onSubmittedWorkDone();
            gpuTime = performance.now() - gpuStart;
        }

        frameCount++;
        const now = performance.now();
        const delta = now - lastFpsTime;

        if (delta >= 1000) {
            const fps = Math.round((frameCount * 1000) / delta);
            const mprims = ((fps * primitiveCount) / 1e6).toFixed(2);

            document.getElementById('stat-fps').innerText = fps;
            document.getElementById('stat-mprims').innerText = mprims;
            document.getElementById('stat-cpu-rec').innerText = `${recordTime.toFixed(2)} ms`;
            document.getElementById('stat-cpu-sub').innerText = `${submitTime.toFixed(2)} ms`;
            document.getElementById('stat-gpu-done').innerText = `${gpuTime.toFixed(2)} ms`;

            frameCount = 0;
            lastFpsTime = now;
        }

        isRendering = false;
        requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
}

init();
