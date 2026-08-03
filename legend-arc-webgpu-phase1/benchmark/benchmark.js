import { LegendArcEngine } from '../src/legend-arc.js';

async function run() {
    const canvas = document.getElementById('canvas');
    if (!navigator.gpu) {
        document.getElementById('fps').innerText = 'WebGPU Not Supported in this Browser';
        return;
    }
    const engine = await LegendArcEngine.create(canvas, { mode: 'fast' });
    const count = 10000;
    const arcs = [];

    for (let i = 0; i < count; i++) {
        arcs.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            radius: 5 + Math.random() * 20,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`,
        });
    }

    let frames = 0;
    let lastTime = performance.now();

    function render() {
        engine.resize();
        engine.beginFrame();

        for (let i = 0; i < count; i++) {
            const a = arcs[i];
            engine.fillCircle(a.x, a.y, a.radius, a.color);
        }

        engine.flush();

        frames++;
        const now = performance.now();
        if (now - lastTime >= 1000) {
            document.getElementById('fps').innerText = `FPS: ${frames}`;
            frames = 0;
            lastTime = now;
        }

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

run();
