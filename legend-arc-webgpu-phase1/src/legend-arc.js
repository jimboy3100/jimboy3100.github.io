import {
    CIRCLE_SHADER,
    ELLIPSE_RING_SHADER,
    PARTIAL_ARC_SHADER,
    ARC_SEGMENT_SHADER,
} from './shaders.js';

const TWO_PI = Math.PI * 2;
const EPSILON = 1e-7;

const PIPELINE_KIND = Object.freeze({
    CIRCLE: 'circle',
    ELLIPSE_RING: 'ellipse-ring',
    PARTIAL_ARC: 'partial-arc',
    ARC_SEGMENT: 'arc-segment',
});

function clamp01(v) {
    return Math.max(0, Math.min(1, v));
}

function isFiniteNumber(...vals) {
    return vals.every((v) => typeof v === 'number' && Number.isFinite(v));
}

export function packRGBA8(r, g, b, a) {
    return ((a & 0xFF) << 24) | ((b & 0xFF) << 16) | ((g & 0xFF) << 8) | (r & 0xFF);
}

export function packSnorm16x2(x, y) {
    const sx = Math.round(Math.max(-1, Math.min(1, x)) * 32767);
    const sy = Math.round(Math.max(-1, Math.min(1, y)) * 32767);
    return ((sx & 0xFFFF) | ((sy & 0xFFFF) << 16)) >>> 0;
}

export function parseHexColor(style) {
    if (!style || !style.startsWith('#')) return null;
    const hex = style.slice(1);
    if (hex.length === 3 || hex.length === 4) {
        const r = parseInt(hex[0] + hex[0], 16);
        const g = parseInt(hex[1] + hex[1], 16);
        const b = parseInt(hex[2] + hex[2], 16);
        const a = hex.length === 4 ? parseInt(hex[3] + hex[3], 16) / 255 : 1;
        return [r, g, b, a];
    }
    if (hex.length === 6 || hex.length === 8) {
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        const a = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1;
        return [r, g, b, a];
    }
    return null;
}

export function parseFunctionalColor(style) {
    if (!style) return null;
    const match = style.match(/^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)$/);
    if (!match) return null;
    const r = parseInt(match[1], 10);
    const g = parseInt(match[2], 10);
    const b = parseInt(match[3], 10);
    const a = match[4] !== undefined ? parseFloat(match[4]) : 1;
    return [r, g, b, a];
}

function normalizeClearColor(color) {
    if (!color) return { r: 0, g: 0, b: 0, a: 0 };
    if (typeof color === 'object') {
        return {
            r: Number(color.r ?? 0),
            g: Number(color.g ?? 0),
            b: Number(color.b ?? 0),
            a: Number(color.a ?? 0),
        };
    }
    return { r: 0, g: 0, b: 0, a: 0 };
}

export function identityTransform() {
    return [1, 0, 0, 1, 0, 0];
}

export function multiplyTransforms(t1, t2) {
    return [
        t1[0] * t2[0] + t1[2] * t2[1],
        t1[1] * t2[0] + t1[3] * t2[1],
        t1[0] * t2[2] + t1[2] * t2[3],
        t1[1] * t2[2] + t1[3] * t2[3],
        t1[0] * t2[4] + t1[2] * t2[5] + t1[4],
        t1[1] * t2[4] + t1[3] * t2[5] + t1[5],
    ];
}

export function transformPoint(t, x, y) {
    return [
        t[0] * x + t[2] * y + t[4],
        t[1] * x + t[3] * y + t[5],
    ];
}

export function transformVector(t, vx, vy) {
    return [
        t[0] * vx + t[2] * vy,
        t[1] * vx + t[3] * vy,
    ];
}

export function normalizeArc(startAngle, endAngle, anticlockwise = false) {
    const rawDelta = endAngle - startAngle;
    if (!anticlockwise && rawDelta >= TWO_PI - EPSILON) {
        return { startAngle, endAngle: startAngle + TWO_PI, sweep: TWO_PI, fullCircle: true };
    }
    if (anticlockwise && rawDelta <= -TWO_PI + EPSILON) {
        return { startAngle, endAngle: startAngle - TWO_PI, sweep: TWO_PI, fullCircle: true };
    }
    let sweep = rawDelta;
    if (anticlockwise) {
        sweep = -sweep;
    }
    sweep = ((sweep % TWO_PI) + TWO_PI) % TWO_PI;
    if (Math.abs(sweep) < EPSILON) {
        sweep = 0;
    }
    const actualStart = startAngle;
    const actualEnd = startAngle + (anticlockwise ? -sweep : sweep);
    return {
        startAngle: actualStart,
        endAngle: actualEnd,
        sweep,
        fullCircle: false,
    };
}

class GrowableInstanceBatch {
    constructor(device, stride, initialCapacity, label) {
        this.device = device;
        this.stride = stride;
        this.capacity = Math.max(1, initialCapacity | 0);
        this.label = label;
        this.count = 0;
        this.cpuBuffer = new ArrayBuffer(this.capacity * this.stride);
        this.floatView = new Float32Array(this.cpuBuffer);
        this.uintView = new Uint32Array(this.cpuBuffer);
        this.gpuBuffer = this.#createGpuBuffer(this.capacity);
    }

    #createGpuBuffer(capacity) {
        return this.device.createBuffer({
            label: `${this.label} instance buffer`,
            size: capacity * this.stride,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
        });
    }

    ensureCapacity(requiredCount) {
        if (requiredCount <= this.capacity) return;
        let nextCapacity = this.capacity;
        while (nextCapacity < requiredCount) nextCapacity *= 2;
        const oldCpu = new Uint8Array(this.cpuBuffer);
        const nextCpuBuffer = new ArrayBuffer(nextCapacity * this.stride);
        new Uint8Array(nextCpuBuffer).set(oldCpu);
        const oldGpuBuffer = this.gpuBuffer;
        this.capacity = nextCapacity;
        this.cpuBuffer = nextCpuBuffer;
        this.floatView = new Float32Array(nextCpuBuffer);
        this.uintView = new Uint32Array(nextCpuBuffer);
        this.gpuBuffer = this.#createGpuBuffer(nextCapacity);

        if (this.device.queue.onSubmittedWorkDone) {
            this.device.queue.onSubmittedWorkDone().then(() => oldGpuBuffer.destroy()).catch(() => {});
        }
    }

    reserveOne() {
        const index = this.count;
        this.ensureCapacity(index + 1);
        this.count++;
        return index;
    }

    upload() {
        if (this.count === 0) return;
        this.device.queue.writeBuffer(
            this.gpuBuffer,
            0,
            this.cpuBuffer,
            0,
            this.count * this.stride
        );
    }

    reset() {
        this.count = 0;
    }
}

class ColorCache {
    constructor() {
        this.cache = new Map();
        this.resolverContext = null;
    }

    parse(style, globalAlpha = 1) {
        const alpha = clamp01(Number.isFinite(globalAlpha) ? globalAlpha : 1);
        if (typeof style === 'number' && Number.isFinite(style)) {
            const value = style >>> 0;
            if (value <= 0xFFFFFF) {
                const r = (value >>> 16) & 0xFF;
                const g = (value >>> 8) & 0xFF;
                const b = value & 0xFF;
                return packRGBA8(r, g, b, Math.round(alpha * 255));
            }
            const r = value & 0xFF;
            const g = (value >>> 8) & 0xFF;
            const b = (value >>> 16) & 0xFF;
            const sourceAlpha = (value >>> 24) & 0xFF;
            return packRGBA8(r, g, b, Math.round((sourceAlpha / 255) * alpha * 255));
        }

        const normalizedStyle = String(style ?? '#000000').trim().toLowerCase();
        const key = `${normalizedStyle}|${alpha}`;
        const cached = this.cache.get(key);
        if (cached !== undefined) return cached;

        const rgba = this.#parseString(normalizedStyle);
        const packed = packRGBA8(rgba[0], rgba[1], rgba[2], Math.round(rgba[3] * alpha * 255));
        this.cache.set(key, packed);
        return packed;
    }

    #parseString(style) {
        const hex = parseHexColor(style);
        if (hex) return hex;
        const functional = parseFunctionalColor(style);
        if (functional) return functional;
        const resolved = this.#resolveNamedColor(style);
        if (resolved && resolved !== style) {
            return parseHexColor(resolved) ?? parseFunctionalColor(resolved) ?? [0, 0, 0, 1];
        }
        return [0, 0, 0, 1];
    }

    #resolveNamedColor(style) {
        if (typeof document === 'undefined') return null;
        if (!this.resolverContext) {
            const canvas = document.createElement('canvas');
            canvas.width = 1;
            canvas.height = 1;
            this.resolverContext = canvas.getContext('2d', { willReadFrequently: false });
        }
        if (!this.resolverContext) return null;
        this.resolverContext.fillStyle = '#010203';
        this.resolverContext.fillStyle = style;
        const resolved = String(this.resolverContext.fillStyle).toLowerCase();
        return resolved === '#010203' ? null : resolved;
    }
}

export class LegendArcEngine {
    static async create(canvas, options = {}) {
        if (!navigator.gpu) {
            throw new Error('WebGPU is unavailable.');
        }
        const adapter = await navigator.gpu.requestAdapter({
            powerPreference: options.powerPreference ?? 'high-performance',
        });
        if (!adapter) throw new Error('No compatible WebGPU adapter found.');
        const device = await adapter.requestDevice();
        const context = canvas.getContext('webgpu');
        if (!context) throw new Error('Unable to obtain WebGPU canvas context.');

        return new LegendArcEngine(canvas, adapter, device, context, options);
    }

    constructor(canvas, adapter, device, context, options = {}) {
        this.canvas = canvas;
        this.adapter = adapter;
        this.device = device;
        this.context = context;
        this.format = navigator.gpu.getPreferredCanvasFormat();
        this.mode = options.mode === 'fast' ? 'fast' : 'ordered';
        this.clearColor = normalizeClearColor(options.clearColor);
        this.colorCache = new ColorCache();
        this.sequence = [];
        this.frameOpen = false;

        this.fillStyle = '#000000';
        this.strokeStyle = '#000000';
        this.globalAlpha = 1;
        this.lineWidth = 1;
        this.lineCap = 'butt';
        this.transformMatrix = identityTransform();
        this.stateStack = [];
        this.currentPath = [];

        this.context.configure({
            device: this.device,
            format: this.format,
            alphaMode: 'premultiplied',
        });

        this.frameUniformBuffer = this.device.createBuffer({
            label: 'LegendArc frame uniforms',
            size: 16,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        this.bindGroupLayout = this.device.createBindGroupLayout({
            label: 'LegendArc frame bind-group layout',
            entries: [{ binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' } }],
        });

        this.pipelineLayout = this.device.createPipelineLayout({
            label: 'LegendArc shared pipeline layout',
            bindGroupLayouts: [this.bindGroupLayout],
        });

        this.frameBindGroup = this.device.createBindGroup({
            label: 'LegendArc frame bind group',
            layout: this.bindGroupLayout,
            entries: [{ binding: 0, resource: { buffer: this.frameUniformBuffer } }],
        });

        const initialCapacity = options.initialCapacity ?? 4096;

        this.batches = {
            [PIPELINE_KIND.CIRCLE]: new GrowableInstanceBatch(device, 16, initialCapacity, 'circle'),
            [PIPELINE_KIND.ELLIPSE_RING]: new GrowableInstanceBatch(device, 32, initialCapacity, 'ellipse-ring'),
            [PIPELINE_KIND.PARTIAL_ARC]: new GrowableInstanceBatch(device, 44, initialCapacity, 'partial-arc'),
            [PIPELINE_KIND.ARC_SEGMENT]: new GrowableInstanceBatch(device, 36, initialCapacity, 'arc-segment'),
        };

        this.pipelines = {
            [PIPELINE_KIND.CIRCLE]: this.#createCirclePipeline(),
            [PIPELINE_KIND.ELLIPSE_RING]: this.#createEllipseRingPipeline(),
            [PIPELINE_KIND.PARTIAL_ARC]: this.#createPartialArcPipeline(),
            [PIPELINE_KIND.ARC_SEGMENT]: this.#createArcSegmentPipeline(),
        };

        this.device.lost.then((info) => {
            console.error('[LegendArc] WebGPU device lost:', info.message, info.reason);
        });
    }

    #createPipeline(label, shaderSource, vertexBuffers) {
        const module = this.device.createShaderModule({ label: `${label} shader`, code: shaderSource });
        return this.device.createRenderPipeline({
            label,
            layout: this.pipelineLayout,
            vertex: { module, entryPoint: 'vs_main', buffers: vertexBuffers },
            fragment: {
                module,
                entryPoint: 'fs_main',
                targets: [{
                    format: this.format,
                    blend: {
                        color: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha', operation: 'add' },
                        alpha: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha', operation: 'add' },
                    },
                    writeMask: GPUColorWrite.ALL,
                }],
            },
            primitive: { topology: 'triangle-strip', cullMode: 'none' },
            multisample: { count: 1 },
        });
    }

    #createCirclePipeline() {
        return this.#createPipeline('LegendArc circles', CIRCLE_SHADER, [{
            arrayStride: 16, stepMode: 'instance',
            attributes: [
                { shaderLocation: 0, offset: 0, format: 'float32x2' },
                { shaderLocation: 1, offset: 8, format: 'float32' },
                { shaderLocation: 2, offset: 12, format: 'unorm8x4' },
            ],
        }]);
    }

    #createEllipseRingPipeline() {
        return this.#createPipeline('LegendArc full ellipses and rings', ELLIPSE_RING_SHADER, [{
            arrayStride: 32, stepMode: 'instance',
            attributes: [
                { shaderLocation: 0, offset: 0, format: 'float32x2' },
                { shaderLocation: 1, offset: 8, format: 'float32x2' },
                { shaderLocation: 2, offset: 16, format: 'float32x2' },
                { shaderLocation: 3, offset: 24, format: 'float32' },
                { shaderLocation: 4, offset: 28, format: 'unorm8x4' },
            ],
        }]);
    }

    #createPartialArcPipeline() {
        return this.#createPipeline('LegendArc partial arcs and sectors', PARTIAL_ARC_SHADER, [{
            arrayStride: 44, stepMode: 'instance',
            attributes: [
                { shaderLocation: 0, offset: 0, format: 'float32x2' },
                { shaderLocation: 1, offset: 8, format: 'float32x2' },
                { shaderLocation: 2, offset: 16, format: 'float32x2' },
                { shaderLocation: 3, offset: 24, format: 'float32' },
                { shaderLocation: 4, offset: 28, format: 'snorm16x2' },
                { shaderLocation: 5, offset: 32, format: 'snorm16x2' },
                { shaderLocation: 6, offset: 36, format: 'uint32' },
                { shaderLocation: 7, offset: 40, format: 'unorm8x4' },
            ],
        }]);
    }

    #createArcSegmentPipeline() {
        return this.#createPipeline('LegendArc Canvas arc segments', ARC_SEGMENT_SHADER, [{
            arrayStride: 36, stepMode: 'instance',
            attributes: [
                { shaderLocation: 0, offset: 0, format: 'float32x2' },
                { shaderLocation: 1, offset: 8, format: 'float32x2' },
                { shaderLocation: 2, offset: 16, format: 'float32x2' },
                { shaderLocation: 3, offset: 24, format: 'snorm16x2' },
                { shaderLocation: 4, offset: 28, format: 'float32' },
                { shaderLocation: 5, offset: 32, format: 'unorm8x4' },
            ],
        }]);
    }

    resize(cssWidth = this.canvas.clientWidth, cssHeight = this.canvas.clientHeight, dpr = globalThis.devicePixelRatio || 1) {
        const width = Math.max(1, Math.round((cssWidth || this.canvas.width || 800) * dpr));
        const height = Math.max(1, Math.round((cssHeight || this.canvas.height || 600) * dpr));
        if (this.canvas.width !== width) this.canvas.width = width;
        if (this.canvas.height !== height) this.canvas.height = height;
        return { width, height, dpr };
    }

    beginFrame(clearColor = this.clearColor) {
        this.clearColor = normalizeClearColor(clearColor);
        for (const batch of Object.values(this.batches)) batch.reset();
        this.sequence.length = 0;
        this.frameOpen = true;
        return this;
    }

    flush() {
        if (!this.frameOpen) this.beginFrame(this.clearColor);
        const width = Math.max(1, this.canvas.width | 0);
        const height = Math.max(1, this.canvas.height | 0);
        this.device.queue.writeBuffer(this.frameUniformBuffer, 0, new Float32Array([width, height, 0, 0]));
        for (const batch of Object.values(this.batches)) batch.upload();

        const encoder = this.device.createCommandEncoder({ label: 'LegendArc frame encoder' });
        const pass = encoder.beginRenderPass({
            label: 'LegendArc render pass',
            colorAttachments: [{
                view: this.context.getCurrentTexture().createView(),
                clearValue: this.clearColor,
                loadOp: 'clear',
                storeOp: 'store',
            }],
        });

        pass.setBindGroup(0, this.frameBindGroup);
        if (this.mode === 'fast') {
            for (const kind of Object.values(PIPELINE_KIND)) {
                const batch = this.batches[kind];
                if (batch.count === 0) continue;
                pass.setPipeline(this.pipelines[kind]);
                pass.setVertexBuffer(0, batch.gpuBuffer);
                pass.draw(4, batch.count, 0, 0);
            }
        } else {
            let currentKind = null;
            for (const span of this.sequence) {
                if (span.kind !== currentKind) {
                    currentKind = span.kind;
                    pass.setPipeline(this.pipelines[currentKind]);
                    pass.setVertexBuffer(0, this.batches[currentKind].gpuBuffer);
                }
                pass.draw(4, span.count, 0, span.start);
            }
        }
        pass.end();
        this.device.queue.submit([encoder.finish()]);
        this.frameOpen = false;
        return this;
    }

    async flushAndWait() {
        this.flush();
        if (this.device.queue.onSubmittedWorkDone) {
            await this.device.queue.onSubmittedWorkDone();
        }
        return this;
    }

    #record(kind, index) {
        const previous = this.sequence[this.sequence.length - 1];
        if (previous && previous.kind === kind && previous.start + previous.count === index) {
            previous.count++;
        } else {
            this.sequence.push({ kind, start: index, count: 1 });
        }
    }

    #ensureFrame() {
        if (!this.frameOpen) {
            this.beginFrame(this.clearColor);
        }
    }

    #addCircle(centerX, centerY, radius, packedColor) {
        this.#ensureFrame();
        if (!(radius > 0) || !isFiniteNumber(centerX, centerY, radius)) return;
        const batch = this.batches[PIPELINE_KIND.CIRCLE];
        const index = batch.reserveOne();
        const base = index * 4;
        batch.floatView[base] = centerX;
        batch.floatView[base + 1] = centerY;
        batch.floatView[base + 2] = radius;
        batch.uintView[base + 3] = packedColor;
        this.#record(PIPELINE_KIND.CIRCLE, index);
    }

    #addEllipseRing(command, innerRatio, packedColor) {
        this.#ensureFrame();
        const batch = this.batches[PIPELINE_KIND.ELLIPSE_RING];
        const index = batch.reserveOne();
        const base = index * 8;
        writeAxes(batch.floatView, base, command);
        batch.floatView[base + 6] = clamp01(innerRatio);
        batch.uintView[base + 7] = packedColor;
        this.#record(PIPELINE_KIND.ELLIPSE_RING, index);
    }

    #addPartialArc(command, innerRatio, packedColor, sectorFill = false) {
        this.#ensureFrame();
        const batch = this.batches[PIPELINE_KIND.PARTIAL_ARC];
        const index = batch.reserveOne();
        const baseBytes = index * 44;
        const baseFloat = baseBytes >>> 2;
        writeAxes(batch.floatView, baseFloat, command);
        batch.floatView[baseFloat + 6] = sectorFill ? 0 : clamp01(innerRatio);
        batch.uintView[baseFloat + 7] = packSnorm16x2(command.startDirection[0], command.startDirection[1]);
        batch.uintView[baseFloat + 8] = packSnorm16x2(command.endDirection[0], command.endDirection[1]);
        batch.uintView[baseFloat + 9] = command.sweep > Math.PI ? 1 : 0;
        batch.uintView[baseFloat + 10] = packedColor;
        this.#record(PIPELINE_KIND.PARTIAL_ARC, index);
    }

    #addArcSegment(command, packedColor) {
        this.#ensureFrame();
        const batch = this.batches[PIPELINE_KIND.ARC_SEGMENT];
        const index = batch.reserveOne();
        const base = index * 9;
        writeAxes(batch.floatView, base, command);

        const midX = (command.startDirection[0] + command.endDirection[0]) * 0.5;
        const midY = (command.startDirection[1] + command.endDirection[1]) * 0.5;
        const midLen = Math.hypot(midX, midY) || 1;
        const normMidX = midX / midLen;
        const normMidY = midY / midLen;
        const chordOffset = Math.cos(command.sweep * 0.5);

        batch.uintView[base + 6] = packSnorm16x2(normMidX, normMidY);
        batch.floatView[base + 7] = chordOffset;
        batch.uintView[base + 8] = packedColor;
        this.#record(PIPELINE_KIND.ARC_SEGMENT, index);
    }

    fillCircle(x, y, radius, color = this.fillStyle, alpha = this.globalAlpha) {
        const packedColor = this.colorCache.parse(color, alpha);
        const command = createCircleCommand(x, y, radius, 0, TWO_PI, false, this.transformMatrix);
        if (command.isCircle) {
            this.#addCircle(command.centerX, command.centerY, command.worldRadius, packedColor);
        } else {
            this.#addEllipseRing(command, 0, packedColor);
        }
        return this;
    }

    fillEllipse(x, y, radiusX, radiusY, rotation = 0, color = this.fillStyle, alpha = this.globalAlpha) {
        const command = createEllipseCommand(x, y, radiusX, radiusY, rotation, 0, TWO_PI, false, this.transformMatrix);
        const packedColor = this.colorCache.parse(color, alpha);
        if (command.isCircle) {
            this.#addCircle(command.centerX, command.centerY, command.worldRadius, packedColor);
        } else {
            this.#addEllipseRing(command, 0, packedColor);
        }
        return this;
    }

    strokeCircle(x, y, radius, width = this.lineWidth, color = this.strokeStyle, alpha = this.globalAlpha) {
        if (!(radius > 0) || !(width > 0)) return this;
        const command = createCircleCommand(x, y, radius, 0, TWO_PI, false, this.transformMatrix);
        const innerRatio = Math.max(0, 1 - width / radius);
        this.#addEllipseRing(command, innerRatio, this.colorCache.parse(color, alpha));
        return this;
    }

    strokeArc(x, y, radius, startAngle, endAngle, width = this.lineWidth, color = this.strokeStyle, alpha = this.globalAlpha, anticlockwise = false) {
        if (!(width > 0)) return this;
        const command = createCircleCommand(x, y, radius, startAngle, endAngle, anticlockwise, this.transformMatrix);
        const innerRatio = Math.max(0, 1 - width / radius);
        const packedColor = this.colorCache.parse(color, alpha);

        if (command.fullCircle) {
            this.#addEllipseRing(command, innerRatio, packedColor);
        } else if (command.sweep > EPSILON) {
            this.#addPartialArc(command, innerRatio, packedColor, false);
        }
        return this;
    }

    fillSector(x, y, radius, startAngle, endAngle, color = this.fillStyle, alpha = this.globalAlpha, anticlockwise = false) {
        const command = createCircleCommand(x, y, radius, startAngle, endAngle, anticlockwise, this.transformMatrix);
        const packedColor = this.colorCache.parse(color, alpha);

        if (command.fullCircle) {
            if (command.isCircle) {
                this.#addCircle(command.centerX, command.centerY, command.worldRadius, packedColor);
            } else {
                this.#addEllipseRing(command, 0, packedColor);
            }
        } else if (command.sweep > EPSILON) {
            this.#addPartialArc(command, 0, packedColor, true);
        }
        return this;
    }

    beginPath() {
        this.currentPath.length = 0;
        return this;
    }

    arc(x, y, radius, startAngle = 0, endAngle = TWO_PI, anticlockwise = false) {
        if (!(radius >= 0)) throw new RangeError('arc radius must be non-negative.');
        this.currentPath.push(createCircleCommand(x, y, radius, startAngle, endAngle, anticlockwise, this.transformMatrix));
        return this;
    }

    ellipse(x, y, radiusX, radiusY, rotation = 0, startAngle = 0, endAngle = TWO_PI, anticlockwise = false) {
        if (!(radiusX >= 0) || !(radiusY >= 0)) throw new RangeError('ellipse radii must be non-negative.');
        this.currentPath.push(createEllipseCommand(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise, this.transformMatrix));
        return this;
    }

    closePath() {
        return this;
    }

    fill() {
        const packedColor = this.colorCache.parse(this.fillStyle, this.globalAlpha);
        for (const command of this.currentPath) {
            if (command.fullCircle) {
                if (command.isCircle) {
                    this.#addCircle(command.centerX, command.centerY, command.worldRadius, packedColor);
                } else {
                    this.#addEllipseRing(command, 0, packedColor);
                }
            } else if (command.sweep > EPSILON) {
                this.#addArcSegment(command, packedColor);
            }
        }
        return this;
    }

    stroke() {
        if (!(this.lineWidth > 0)) return this;
        const packedColor = this.colorCache.parse(this.strokeStyle, this.globalAlpha);
        for (const command of this.currentPath) {
            const referenceRadius = Math.max(command.localRadiusX, command.localRadiusY, EPSILON);
            const innerRatio = Math.max(0, 1 - this.lineWidth / referenceRadius);
            if (command.fullCircle) {
                this.#addEllipseRing(command, innerRatio, packedColor);
            } else if (command.sweep > EPSILON) {
                this.#addPartialArc(command, innerRatio, packedColor, false);
            }
        }
        return this;
    }

    save() {
        this.stateStack.push({
            fillStyle: this.fillStyle,
            strokeStyle: this.strokeStyle,
            globalAlpha: this.globalAlpha,
            lineWidth: this.lineWidth,
            lineCap: this.lineCap,
            transformMatrix: [...this.transformMatrix],
        });
        return this;
    }

    restore() {
        const state = this.stateStack.pop();
        if (!state) return this;
        this.fillStyle = state.fillStyle;
        this.strokeStyle = state.strokeStyle;
        this.globalAlpha = state.globalAlpha;
        this.lineWidth = state.lineWidth;
        this.lineCap = state.lineCap;
        this.transformMatrix = state.transformMatrix;
        return this;
    }

    resetTransform() {
        this.transformMatrix = identityTransform();
        return this;
    }

    setTransform(a, b, c, d, e, f) {
        if (typeof a === 'object' && a !== null) {
            this.transformMatrix = [
                Number(a.a ?? 1),
                Number(a.b ?? 0),
                Number(a.c ?? 0),
                Number(a.d ?? 1),
                Number(a.e ?? 0),
                Number(a.f ?? 0),
            ];
        } else {
            this.transformMatrix = [a, b, c, d, e, f].map(Number);
        }
        return this;
    }

    transform(a, b, c, d, e, f) {
        this.transformMatrix = multiplyTransforms(this.transformMatrix, [a, b, c, d, e, f].map(Number));
        return this;
    }

    translate(x, y) {
        return this.transform(1, 0, 0, 1, x, y);
    }

    scale(x, y = x) {
        return this.transform(x, 0, 0, y, 0, 0);
    }

    rotate(angle) {
        const cosine = Math.cos(angle);
        const sine = Math.sin(angle);
        return this.transform(cosine, sine, -sine, cosine, 0, 0);
    }

    clearRect(x = 0, y = 0, width = this.canvas?.width || 800, height = this.canvas?.height || 600) {
        return this.beginFrame({ r: 0, g: 0, b: 0, a: 0 });
    }
}

export const LegendArc = Object.freeze({
    create: (canvas, options) => LegendArcEngine.create(canvas, options),
});

export default LegendArc;

function writeAxes(floatView, base, command) {
    floatView[base] = command.centerX;
    floatView[base + 1] = command.centerY;
    floatView[base + 2] = command.axisXx;
    floatView[base + 3] = command.axisXy;
    floatView[base + 4] = command.axisYx;
    floatView[base + 5] = command.axisYy;
}

function createCircleCommand(x, y, radius, startAngle, endAngle, anticlockwise, transform) {
    return createEllipseCommand(x, y, radius, radius, 0, startAngle, endAngle, anticlockwise, transform);
}

function createEllipseCommand(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise, transform) {
    const normalized = normalizeArc(startAngle, endAngle, Boolean(anticlockwise));
    const cosine = Math.cos(rotation);
    const sine = Math.sin(rotation);
    const localAxisXx = cosine * radiusX;
    const localAxisXy = sine * radiusX;
    const localAxisYx = -sine * radiusY;
    const localAxisYy = cosine * radiusY;

    const center = transformPoint(transform, x, y);
    const axisX = transformVector(transform, localAxisXx, localAxisXy);
    const axisY = transformVector(transform, localAxisYx, localAxisYy);

    const isCircle = Math.abs(radiusX - radiusY) < EPSILON && Math.abs(transform[0] - transform[3]) < EPSILON && Math.abs(transform[1]) < EPSILON && Math.abs(transform[2]) < EPSILON;
    const worldRadius = isCircle ? radiusX * Math.abs(transform[0]) : Math.max(Math.hypot(axisX[0], axisX[1]), Math.hypot(axisY[0], axisY[1]));

    const startDirX = Math.cos(normalized.startAngle);
    const startDirY = Math.sin(normalized.startAngle);
    const endDirX = Math.cos(normalized.endAngle);
    const endDirY = Math.sin(normalized.endAngle);

    return {
        centerX: center[0],
        centerY: center[1],
        axisXx: axisX[0],
        axisXy: axisX[1],
        axisYx: axisY[0],
        axisYy: axisY[1],
        localRadiusX: radiusX,
        localRadiusY: radiusY,
        worldRadius,
        isCircle,
        fullCircle: normalized.fullCircle,
        sweep: normalized.sweep,
        startDirection: [startDirX, startDirY],
        endDirection: [endDirX, endDirY],
    };
}
