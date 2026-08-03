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
    const width = window.innerWidth || 800;
    const height = window.innerHeight || 600;

    const minRadius = radiusProfile === 'small' ? 5 : 50;
    const maxRadius = radiusProfile === 'small' ? 20 : 200;

    for (let i = 0; i < primitiveCount; i++) {
        const isOffscreen = Math.random() < offscreenRatio;
        let x, y;

        if (isOffscreen) {
            x = Math.random() < 0.5 ? -300 : width + 300;
            y = Math.random() < 0.5 ? -300 : height + 300;
        } else {
            x = Math.random() * width;
            y = Math.random() * height;
        }

        const radius = minRadius + Math.random() * (maxRadius - minRadius);
        const color = `hsl(${Math.floor(Math.random() * 360)}, 90%, 55%)`;
        const vx = (Math.random() - 0.5) * 2;
        const vy = (Math.random() - 0.5) * 2;

        let type = primitiveType;
        if (primitiveType === 'mixed') {
            const types = ['circle', 'ring', 'arc5', 'arc30', 'arc180'];
            type = types[i % types.length];
        }

        primitives.push({ x, y, vx, vy, radius, color, type });
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
        generatePrimitives();
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

            // Animate positions every frame
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > width) p.vx = -p.vx;
            if (p.y < 0 || p.y > height) p.vy = -p.vy;

            switch (p.type) {
                case 'circle':
                    engine.fillCircle(p.x, p.y, p.radius, p.color);
                    break;
                case 'ring':
                    engine.strokeCircle(p.x, p.y, p.radius, Math.max(1, p.radius * 0.2), p.color);
                    break;
                case 'arc5':
                    engine.strokeArc(p.x, p.y, p.radius, 0, (5 * Math.PI) / 180, Math.max(1, p.radius * 0.2), p.color);
                    break;
                case 'arc30':
                    engine.strokeArc(p.x, p.y, p.radius, 0, (30 * Math.PI) / 180, Math.max(1, p.radius * 0.2), p.color);
                    break;
                case 'arc180':
                    engine.strokeArc(p.x, p.y, p.radius, 0, Math.PI, Math.max(1, p.radius * 0.2), p.color);
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
