import {
    CIRCLE_SHADER,
    ELLIPSE_RING_SHADER,
    CIRCLE_PARTIAL_ARC_SHADER,
    PARTIAL_ARC_SHADER,
    CIRCLE_ARC_SEGMENT_SHADER,
    ARC_SEGMENT_SHADER,
} from './shaders.js';

const TWO_PI = Math.PI * 2;
const EPSILON = 1e-7;
const TRANSFORM_EPSILON = 1e-10;

const MODE_ORDERED = 'ordered';
const MODE_FAST = 'fast';

const KIND_CIRCLE = 0;
const KIND_ELLIPSE_RING = 1;
const KIND_CIRCLE_PARTIAL_ARC = 2;
const KIND_ELLIPSE_PARTIAL_ARC = 3;
const KIND_CIRCLE_ARC_SEGMENT = 4;
const KIND_ELLIPSE_ARC_SEGMENT = 5;
const KIND_COUNT = 6;

const KIND_ORDER = [
    KIND_CIRCLE,
    KIND_ELLIPSE_RING,
    KIND_CIRCLE_PARTIAL_ARC,
    KIND_ELLIPSE_PARTIAL_ARC,
    KIND_CIRCLE_ARC_SEGMENT,
    KIND_ELLIPSE_ARC_SEGMENT,
];

const COMMAND_STRIDE = 16;
const CMD_CENTER_X = 0;
const CMD_CENTER_Y = 1;
const CMD_AXIS_XX = 2;
const CMD_AXIS_XY = 3;
const CMD_AXIS_YX = 4;
const CMD_AXIS_YY = 5;
const CMD_LOCAL_RADIUS_X = 6;
const CMD_LOCAL_RADIUS_Y = 7;
const CMD_WORLD_RADIUS = 8;
const CMD_START_X = 9;
const CMD_START_Y = 10;
const CMD_END_X = 11;
const CMD_END_Y = 12;
const CMD_SWEEP = 13;
const CMD_DIRECTION = 14;
const CMD_FLAGS = 15;

const COMMAND_FULL_CIRCLE = 1;
const COMMAND_IS_CIRCLE = 2;

const ARC_FLAG_MAJOR = 1;
const ARC_FLAG_ANTICLOCKWISE = 2;

function clamp01(value) {
    return Math.max(0, Math.min(1, value));
}

function finite3(a, b, c) {
    return Number.isFinite(a) &&
        Number.isFinite(b) &&
        Number.isFinite(c);
}

function finite5(a, b, c, d, e) {
    return Number.isFinite(a) &&
        Number.isFinite(b) &&
        Number.isFinite(c) &&
        Number.isFinite(d) &&
        Number.isFinite(e);
}

function positiveModulo(value, modulus) {
    return ((value % modulus) + modulus) % modulus;
}

export function packRGBA8(r, g, b, a) {
    return (
        ((a & 0xFF) << 24) |
        ((b & 0xFF) << 16) |
        ((g & 0xFF) << 8) |
        (r & 0xFF)
    ) >>> 0;
}

export function packSnorm16x2(x, y) {
    const sx = Math.round(
        Math.max(-1, Math.min(1, x)) * 32767
    );
    const sy = Math.round(
        Math.max(-1, Math.min(1, y)) * 32767
    );

    return (
        (sx & 0xFFFF) |
        ((sy & 0xFFFF) << 16)
    ) >>> 0;
}

export function parseHexColor(style) {
    if (
        typeof style !== 'string' ||
        !style.startsWith('#')
    ) {
        return null;
    }

    const hex = style.slice(1);

    if (hex.length === 3 || hex.length === 4) {
        const r = parseInt(hex[0] + hex[0], 16);
        const g = parseInt(hex[1] + hex[1], 16);
        const b = parseInt(hex[2] + hex[2], 16);
        const a = hex.length === 4
            ? parseInt(hex[3] + hex[3], 16) / 255
            : 1;

        if (![r, g, b, a].every(Number.isFinite)) {
            return null;
        }

        return [r, g, b, a];
    }

    if (hex.length === 6 || hex.length === 8) {
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        const a = hex.length === 8
            ? parseInt(hex.slice(6, 8), 16) / 255
            : 1;

        if (![r, g, b, a].every(Number.isFinite)) {
            return null;
        }

        return [r, g, b, a];
    }

    return null;
}

export function parseFunctionalColor(style) {
    if (typeof style !== 'string') {
        return null;
    }

    const match = style.match(
        /^rgba?\s*\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)(?:\s*[,/]\s*([\d.]+)%?)?\s*\)$/i
    );

    if (!match) {
        return null;
    }

    const r = Math.max(
        0,
        Math.min(255, Number(match[1]))
    );
    const g = Math.max(
        0,
        Math.min(255, Number(match[2]))
    );
    const b = Math.max(
        0,
        Math.min(255, Number(match[3]))
    );

    let a = match[4] === undefined
        ? 1
        : Number(match[4]);

    if (
        match[0].includes('%') &&
        match[4] !== undefined
    ) {
        a *= 0.01;
    }

    if (![r, g, b, a].every(Number.isFinite)) {
        return null;
    }

    return [
        Math.round(r),
        Math.round(g),
        Math.round(b),
        clamp01(a),
    ];
}

function normalizeClearColor(color) {
    if (!color || typeof color !== 'object') {
        return {
            r: 0,
            g: 0,
            b: 0,
            a: 0,
        };
    }

    return {
        r: clamp01(
            Number.isFinite(Number(color.r))
                ? Number(color.r)
                : 0
        ),
        g: clamp01(
            Number.isFinite(Number(color.g))
                ? Number(color.g)
                : 0
        ),
        b: clamp01(
            Number.isFinite(Number(color.b))
                ? Number(color.b)
                : 0
        ),
        a: clamp01(
            Number.isFinite(Number(color.a))
                ? Number(color.a)
                : 0
        ),
    };
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

export function transformPoint(transform, x, y) {
    return [
        transform[0] * x +
            transform[2] * y +
            transform[4],
        transform[1] * x +
            transform[3] * y +
            transform[5],
    ];
}

export function transformVector(transform, x, y) {
    return [
        transform[0] * x + transform[2] * y,
        transform[1] * x + transform[3] * y,
    ];
}

export function normalizeArc(
    startAngle,
    endAngle,
    anticlockwise = false
) {
    const rawDelta = endAngle - startAngle;
    const ccw = Boolean(anticlockwise);

    if (
        (!ccw && rawDelta >= TWO_PI - EPSILON) ||
        (ccw && rawDelta <= -TWO_PI + EPSILON)
    ) {
        return {
            startAngle,
            endAngle: startAngle +
                (ccw ? -TWO_PI : TWO_PI),
            sweep: TWO_PI,
            fullCircle: true,
            anticlockwise: ccw,
        };
    }

    let sweep = ccw ? -rawDelta : rawDelta;
    sweep = positiveModulo(sweep, TWO_PI);

    if (sweep < EPSILON) {
        sweep = 0;
    }

    return {
        startAngle,
        endAngle: startAngle +
            (ccw ? -sweep : sweep),
        sweep,
        fullCircle: false,
        anticlockwise: ccw,
    };
}

class GrowableInstanceBatch {
    constructor(
        device,
        stride,
        initialCapacity,
        label,
        retireBuffer
    ) {
        this.device = device;
        this.stride = stride;
        this.capacity = Math.max(
            1,
            initialCapacity | 0
        );
        this.label = label;
        this.retireBuffer = retireBuffer;
        this.count = 0;
        this.version = 1;

        this.cpuBuffer = new ArrayBuffer(
            this.capacity * this.stride
        );
        this.floatView = new Float32Array(
            this.cpuBuffer
        );
        this.uintView = new Uint32Array(
            this.cpuBuffer
        );
        this.gpuBuffer = this.#createGpuBuffer(
            this.capacity
        );
    }

    #createGpuBuffer(capacity) {
        return this.device.createBuffer({
            label: `${this.label} instance buffer`,
            size: capacity * this.stride,
            usage:
                GPUBufferUsage.VERTEX |
                GPUBufferUsage.COPY_DST,
        });
    }

    ensureCapacity(requiredCount) {
        if (requiredCount <= this.capacity) {
            return;
        }

        let nextCapacity = this.capacity;

        while (nextCapacity < requiredCount) {
            nextCapacity *= 2;
        }

        const usedBytes =
            this.count * this.stride;

        const nextCpuBuffer = new ArrayBuffer(
            nextCapacity * this.stride
        );

        if (usedBytes > 0) {
            new Uint8Array(
                nextCpuBuffer,
                0,
                usedBytes
            ).set(
                new Uint8Array(
                    this.cpuBuffer,
                    0,
                    usedBytes
                )
            );
        }

        const oldGpuBuffer = this.gpuBuffer;

        this.capacity = nextCapacity;
        this.cpuBuffer = nextCpuBuffer;
        this.floatView = new Float32Array(
            nextCpuBuffer
        );
        this.uintView = new Uint32Array(
            nextCpuBuffer
        );
        this.gpuBuffer = this.#createGpuBuffer(
            nextCapacity
        );
        this.version++;

        this.retireBuffer(oldGpuBuffer);
    }

    reserveOne() {
        const index = this.count;

        this.ensureCapacity(index + 1);
        this.count = index + 1;

        return index;
    }

    upload(queue) {
        const byteLength =
            this.count * this.stride;

        if (byteLength === 0) {
            return 0;
        }

        queue.writeBuffer(
            this.gpuBuffer,
            0,
            this.cpuBuffer,
            0,
            byteLength
        );

        return byteLength;
    }

    reset() {
        this.count = 0;
    }

    destroy() {
        this.gpuBuffer.destroy();
    }
}

class DrawSequence {
    constructor(initialCapacity = 256) {
        this.capacity = Math.max(
            1,
            initialCapacity | 0
        );
        this.length = 0;

        this.kinds = new Uint8Array(
            this.capacity
        );
        this.starts = new Uint32Array(
            this.capacity
        );
        this.counts = new Uint32Array(
            this.capacity
        );
    }

    #ensureCapacity(required) {
        if (required <= this.capacity) {
            return;
        }

        let next = this.capacity;

        while (next < required) {
            next *= 2;
        }

        const kinds = new Uint8Array(next);
        const starts = new Uint32Array(next);
        const counts = new Uint32Array(next);

        kinds.set(
            this.kinds.subarray(0, this.length)
        );
        starts.set(
            this.starts.subarray(0, this.length)
        );
        counts.set(
            this.counts.subarray(0, this.length)
        );

        this.capacity = next;
        this.kinds = kinds;
        this.starts = starts;
        this.counts = counts;
    }

    record(kind, index) {
        const last = this.length - 1;

        if (
            last >= 0 &&
            this.kinds[last] === kind &&
            this.starts[last] +
                this.counts[last] === index
        ) {
            this.counts[last]++;
            return;
        }

        this.#ensureCapacity(
            this.length + 1
        );

        const slot = this.length++;

        this.kinds[slot] = kind;
        this.starts[slot] = index;
        this.counts[slot] = 1;
    }

    reset() {
        this.length = 0;
    }
}

class PathCommandBuffer {
    constructor(initialCapacity = 64) {
        this.capacity = Math.max(
            1,
            initialCapacity | 0
        );
        this.count = 0;
        this.data = new Float64Array(
            this.capacity * COMMAND_STRIDE
        );
    }

    #ensureCapacity(required) {
        if (required <= this.capacity) {
            return;
        }

        let next = this.capacity;

        while (next < required) {
            next *= 2;
        }

        const data = new Float64Array(
            next * COMMAND_STRIDE
        );

        data.set(
            this.data.subarray(
                0,
                this.count * COMMAND_STRIDE
            )
        );

        this.capacity = next;
        this.data = data;
    }

    push(command) {
        this.#ensureCapacity(
            this.count + 1
        );

        const base =
            this.count * COMMAND_STRIDE;

        this.data.set(command, base);
        this.count++;
    }

    reset() {
        this.count = 0;
    }
}

class ColorCache {
    constructor(maxEntries = 1024) {
        this.maxEntries = Math.max(
            16,
            maxEntries | 0
        );
        this.cache = new Map();
        this.resolverContext = null;
        this.lastStyle = null;
        this.lastPacked = 0;
    }

    parse(style, globalAlpha = 1) {
        const alpha = clamp01(
            Number.isFinite(globalAlpha)
                ? globalAlpha
                : 1
        );

        if (
            typeof style === 'number' &&
            Number.isFinite(style)
        ) {
            const value = style >>> 0;

            if (value <= 0xFFFFFF) {
                const r =
                    (value >>> 16) & 0xFF;
                const g =
                    (value >>> 8) & 0xFF;
                const b =
                    value & 0xFF;

                return packRGBA8(
                    r,
                    g,
                    b,
                    Math.round(alpha * 255)
                );
            }

            const sourceAlpha =
                (value >>> 24) & 0xFF;

            return (
                (value & 0x00FFFFFF) |
                (
                    Math.round(
                        sourceAlpha * alpha
                    ) << 24
                )
            ) >>> 0;
        }

        const key =
            typeof style === 'string'
                ? style
                : '#000000';

        let basePacked;

        if (key === this.lastStyle) {
            basePacked = this.lastPacked;
        } else {
            basePacked =
                this.cache.get(key);

            if (basePacked === undefined) {
                basePacked =
                    this.#parseStringToPacked(
                        key
                    );

                if (
                    this.cache.size >=
                    this.maxEntries
                ) {
                    this.cache.clear();
                }

                this.cache.set(
                    key,
                    basePacked
                );
            }

            this.lastStyle = key;
            this.lastPacked = basePacked;
        }

        const sourceAlpha =
            (basePacked >>> 24) & 0xFF;

        return (
            (basePacked & 0x00FFFFFF) |
            (
                Math.round(
                    sourceAlpha * alpha
                ) << 24
            )
        ) >>> 0;
    }

    #parseStringToPacked(style) {
        const normalized =
            style.trim().toLowerCase();

        const hex =
            parseHexColor(normalized);

        if (hex) {
            return packRGBA8(
                hex[0],
                hex[1],
                hex[2],
                Math.round(hex[3] * 255)
            );
        }

        const functional =
            parseFunctionalColor(normalized);

        if (functional) {
            return packRGBA8(
                functional[0],
                functional[1],
                functional[2],
                Math.round(
                    functional[3] * 255
                )
            );
        }

        const resolved =
            this.#resolveNamedColor(
                normalized
            );

        if (
            resolved &&
            resolved !== normalized
        ) {
            const resolvedHex =
                parseHexColor(resolved);

            if (resolvedHex) {
                return packRGBA8(
                    resolvedHex[0],
                    resolvedHex[1],
                    resolvedHex[2],
                    Math.round(
                        resolvedHex[3] * 255
                    )
                );
            }

            const resolvedFunctional =
                parseFunctionalColor(
                    resolved
                );

            if (resolvedFunctional) {
                return packRGBA8(
                    resolvedFunctional[0],
                    resolvedFunctional[1],
                    resolvedFunctional[2],
                    Math.round(
                        resolvedFunctional[3] *
                        255
                    )
                );
            }
        }

        return packRGBA8(
            0,
            0,
            0,
            255
        );
    }

    #resolveNamedColor(style) {
        if (
            typeof document ===
            'undefined'
        ) {
            return null;
        }

        if (!this.resolverContext) {
            const canvas =
                document.createElement(
                    'canvas'
                );

            canvas.width = 1;
            canvas.height = 1;

            this.resolverContext =
                canvas.getContext(
                    '2d',
                    {
                        willReadFrequently:
                            false,
                    }
                );
        }

        if (!this.resolverContext) {
            return null;
        }

        this.resolverContext.fillStyle =
            '#010203';
        this.resolverContext.fillStyle =
            style;

        const resolved = String(
            this.resolverContext.fillStyle
        ).toLowerCase();

        return resolved === '#010203'
            ? null
            : resolved;
    }
}

export class LegendArcEngine {
    static async create(
        canvas,
        options = {}
    ) {
        if (!canvas) {
            throw new TypeError(
                'A canvas is required.'
            );
        }

        if (!globalThis.navigator?.gpu) {
            throw new Error(
                'WebGPU is unavailable. Use a current browser in a secure context.'
            );
        }

        const adapterOptions = {
            powerPreference:
                options.powerPreference ??
                'high-performance',
        };

        if (
            options.forceFallbackAdapter !==
            undefined
        ) {
            adapterOptions.forceFallbackAdapter =
                Boolean(
                    options.forceFallbackAdapter
                );
        }

        const adapter =
            await navigator.gpu.requestAdapter(
                adapterOptions
            );

        if (!adapter) {
            throw new Error(
                'No compatible WebGPU adapter was found.'
            );
        }

        const deviceDescriptor = {};

        if (
            Array.isArray(
                options.requiredFeatures
            )
        ) {
            deviceDescriptor.requiredFeatures =
                options.requiredFeatures;
        }

        if (
            options.requiredLimits &&
            typeof options.requiredLimits ===
                'object'
        ) {
            deviceDescriptor.requiredLimits =
                options.requiredLimits;
        }

        const device =
            await adapter.requestDevice(
                deviceDescriptor
            );

        const context =
            canvas.getContext('webgpu');

        if (!context) {
            throw new Error(
                'Unable to obtain a WebGPU canvas context.'
            );
        }

        return new LegendArcEngine(
            canvas,
            adapter,
            device,
            context,
            options
        );
    }

    constructor(
        canvas,
        adapter,
        device,
        context,
        options = {}
    ) {
        this.canvas = canvas;
        this.adapter = adapter;
        this.device = device;
        this.context = context;
        this.format =
            options.format ??
            navigator.gpu
                .getPreferredCanvasFormat();

        this._mode =
            options.mode === MODE_FAST
                ? MODE_FAST
                : MODE_ORDERED;

        this._aaPixels =
            Number.isFinite(
                options.aaPixels
            )
                ? Math.max(
                    0.5,
                    Math.min(
                        4,
                        Number(
                            options.aaPixels
                        )
                    )
                )
                : 1.25;

        this.useRenderBundles =
            options.useRenderBundles !== false;

        this.renderBundleThreshold =
            Math.max(
                1,
                options.renderBundleThreshold ??
                    16
            );

        this.clearColor =
            normalizeClearColor(
                options.clearColor
            );

        this.colorCache = new ColorCache(
            options.colorCacheSize ?? 1024
        );

        this.sequence = new DrawSequence(
            options.initialSequenceCapacity ??
                256
        );

        this.currentPath =
            new PathCommandBuffer(
                options.initialPathCapacity ??
                    64
            );

        this._scratch =
            new Float64Array(
                COMMAND_STRIDE
            );

        this._boundsScratch =
            new Float32Array(4);

        this._uniformScratch =
            new Float32Array(4);

        this.frameOpen = false;
        this.geometryValid = false;
        this.destroyed = false;

        this.fillStyle = '#000000';
        this.strokeStyle = '#000000';
        this.globalAlpha = 1;
        this.lineWidth = 1;
        this.lineCap = 'butt';
        this.transformMatrix =
            identityTransform();
        this.stateStack = [];

        this._transformIsSimilarity = true;
        this._transformScale = 1;

        this._retiredBuffers = [];

        this._renderBundle = null;
        this._bundleMode = null;
        this._bundleCounts =
            new Uint32Array(KIND_COUNT);
        this._bundleVersions =
            new Uint32Array(KIND_COUNT);
        this._bundleSpans =
            new Uint32Array(0);
        this._bundleSpanCount = 0;

        this._lastUniformWidth = -1;
        this._lastUniformHeight = -1;
        this._lastUniformAA = -1;

        this._stats = {
            frames: 0,
            redraws: 0,
            uploadedBytes: 0,
            lastUploadedBytes: 0,
            lastDrawCalls: 0,
            renderBundleHits: 0,
            renderBundleBuilds: 0,
        };

        const configureDescriptor = {
            device: this.device,
            format: this.format,
            usage:
                GPUTextureUsage
                    .RENDER_ATTACHMENT,
            alphaMode:
                options.alphaMode ??
                'premultiplied',
        };

        if (options.colorSpace) {
            configureDescriptor.colorSpace =
                options.colorSpace;
        }

        this.context.configure(
            configureDescriptor
        );

        this.frameUniformBuffer =
            this.device.createBuffer({
                label:
                    'LegendArc frame uniforms',
                size: 16,
                usage:
                    GPUBufferUsage.UNIFORM |
                    GPUBufferUsage.COPY_DST,
            });

        this.bindGroupLayout =
            this.device.createBindGroupLayout({
                label:
                    'LegendArc frame bind-group layout',
                entries: [{
                    binding: 0,
                    visibility:
                        GPUShaderStage.VERTEX,
                    buffer: {
                        type: 'uniform',
                    },
                }],
            });

        this.pipelineLayout =
            this.device.createPipelineLayout({
                label:
                    'LegendArc shared pipeline layout',
                bindGroupLayouts: [
                    this.bindGroupLayout,
                ],
            });

        this.frameBindGroup =
            this.device.createBindGroup({
                label:
                    'LegendArc frame bind group',
                layout:
                    this.bindGroupLayout,
                entries: [{
                    binding: 0,
                    resource: {
                        buffer:
                            this.frameUniformBuffer,
                    },
                }],
            });

        const initialCapacity =
            Math.max(
                1,
                options.initialCapacity ??
                    4096
            );

        const retire = (buffer) =>
            this.#retireBuffer(buffer);

        this.batches = [
            new GrowableInstanceBatch(
                device,
                20,
                initialCapacity,
                'circle-ring',
                retire
            ),
            new GrowableInstanceBatch(
                device,
                32,
                initialCapacity,
                'ellipse-ring',
                retire
            ),
            new GrowableInstanceBatch(
                device,
                40,
                initialCapacity,
                'circle-partial-arc',
                retire
            ),
            new GrowableInstanceBatch(
                device,
                52,
                initialCapacity,
                'ellipse-partial-arc',
                retire
            ),
            new GrowableInstanceBatch(
                device,
                32,
                initialCapacity,
                'circle-arc-segment',
                retire
            ),
            new GrowableInstanceBatch(
                device,
                44,
                initialCapacity,
                'ellipse-arc-segment',
                retire
            ),
        ];

        this.pipelines = [
            this.#createCirclePipeline(),
            this.#createEllipseRingPipeline(),
            this.#createCirclePartialArcPipeline(),
            this.#createPartialArcPipeline(),
            this.#createCircleArcSegmentPipeline(),
            this.#createArcSegmentPipeline(),
        ];

        this.device.lost.then((info) => {
            if (!this.destroyed) {
                console.error(
                    '[LegendArc] WebGPU device lost:',
                    info.message,
                    info.reason
                );
            }
        });
    }

    get mode() {
        return this._mode;
    }

    set mode(value) {
        const next =
            value === MODE_FAST
                ? MODE_FAST
                : MODE_ORDERED;

        if (
            this.frameOpen &&
            this.#instanceCount() > 0 &&
            next !== this._mode
        ) {
            throw new Error(
                'Change LegendArc mode only between frames.'
            );
        }

        if (next !== this._mode) {
            this._mode = next;
            this.geometryValid = false;
            this.#invalidateRenderBundle();
        }
    }

    get aaPixels() {
        return this._aaPixels;
    }

    set aaPixels(value) {
        const numeric = Number(value);

        if (!Number.isFinite(numeric)) {
            throw new TypeError(
                'aaPixels must be a finite number.'
            );
        }

        const next = Math.max(
            0.5,
            Math.min(4, numeric)
        );

        if (
            this.frameOpen &&
            this.#instanceCount() > 0 &&
            next !== this._aaPixels
        ) {
            throw new Error(
                'Change aaPixels only between frames.'
            );
        }

        if (next !== this._aaPixels) {
            this._aaPixels = next;
            this._lastUniformAA = -1;
            this.geometryValid = false;
        }
    }

    #createPipeline(
        label,
        shaderSource,
        vertexBuffers
    ) {
        const module =
            this.device.createShaderModule({
                label: `${label} shader`,
                code: shaderSource,
            });

        return this.device.createRenderPipeline({
            label,
            layout: this.pipelineLayout,
            vertex: {
                module,
                entryPoint: 'vs_main',
                buffers: vertexBuffers,
            },
            fragment: {
                module,
                entryPoint: 'fs_main',
                targets: [{
                    format: this.format,
                    blend: {
                        color: {
                            srcFactor: 'one',
                            dstFactor:
                                'one-minus-src-alpha',
                            operation: 'add',
                        },
                        alpha: {
                            srcFactor: 'one',
                            dstFactor:
                                'one-minus-src-alpha',
                            operation: 'add',
                        },
                    },
                    writeMask:
                        GPUColorWrite.ALL,
                }],
            },
            primitive: {
                topology:
                    'triangle-strip',
                cullMode: 'none',
            },
            multisample: {
                count: 1,
            },
        });
    }

    #createCirclePipeline() {
        return this.#createPipeline(
            'LegendArc circles and circular rings',
            CIRCLE_SHADER,
            [{
                arrayStride: 20,
                stepMode: 'instance',
                attributes: [
                    {
                        shaderLocation: 0,
                        offset: 0,
                        format:
                            'float32x2',
                    },
                    {
                        shaderLocation: 1,
                        offset: 8,
                        format:
                            'float32',
                    },
                    {
                        shaderLocation: 2,
                        offset: 12,
                        format:
                            'float32',
                    },
                    {
                        shaderLocation: 3,
                        offset: 16,
                        format:
                            'unorm8x4',
                    },
                ],
            }]
        );
    }

    #createEllipseRingPipeline() {
        return this.#createPipeline(
            'LegendArc ellipses and elliptical rings',
            ELLIPSE_RING_SHADER,
            [{
                arrayStride: 32,
                stepMode: 'instance',
                attributes: [
                    {
                        shaderLocation: 0,
                        offset: 0,
                        format:
                            'float32x2',
                    },
                    {
                        shaderLocation: 1,
                        offset: 8,
                        format:
                            'float32x2',
                    },
                    {
                        shaderLocation: 2,
                        offset: 16,
                        format:
                            'float32x2',
                    },
                    {
                        shaderLocation: 3,
                        offset: 24,
                        format:
                            'float32',
                    },
                    {
                        shaderLocation: 4,
                        offset: 28,
                        format:
                            'unorm8x4',
                    },
                ],
            }]
        );
    }

    #createCirclePartialArcPipeline() {
        return this.#createPipeline(
            'LegendArc circular partial arcs and sectors',
            CIRCLE_PARTIAL_ARC_SHADER,
            [{
                arrayStride: 40,
                stepMode: 'instance',
                attributes: [
                    {
                        shaderLocation: 0,
                        offset: 0,
                        format:
                            'float32x2',
                    },
                    {
                        shaderLocation: 1,
                        offset: 8,
                        format:
                            'float32',
                    },
                    {
                        shaderLocation: 2,
                        offset: 12,
                        format:
                            'float32',
                    },
                    {
                        shaderLocation: 3,
                        offset: 16,
                        format:
                            'snorm16x2',
                    },
                    {
                        shaderLocation: 4,
                        offset: 20,
                        format:
                            'snorm16x2',
                    },
                    {
                        shaderLocation: 5,
                        offset: 24,
                        format:
                            'uint32',
                    },
                    {
                        shaderLocation: 6,
                        offset: 28,
                        format:
                            'snorm16x4',
                    },
                    {
                        shaderLocation: 7,
                        offset: 36,
                        format:
                            'unorm8x4',
                    },
                ],
            }]
        );
    }

    #createPartialArcPipeline() {
        return this.#createPipeline(
            'LegendArc elliptical partial arcs and sectors',
            PARTIAL_ARC_SHADER,
            [{
                arrayStride: 52,
                stepMode: 'instance',
                attributes: [
                    {
                        shaderLocation: 0,
                        offset: 0,
                        format:
                            'float32x2',
                    },
                    {
                        shaderLocation: 1,
                        offset: 8,
                        format:
                            'float32x2',
                    },
                    {
                        shaderLocation: 2,
                        offset: 16,
                        format:
                            'float32x2',
                    },
                    {
                        shaderLocation: 3,
                        offset: 24,
                        format:
                            'float32',
                    },
                    {
                        shaderLocation: 4,
                        offset: 28,
                        format:
                            'snorm16x2',
                    },
                    {
                        shaderLocation: 5,
                        offset: 32,
                        format:
                            'snorm16x2',
                    },
                    {
                        shaderLocation: 6,
                        offset: 36,
                        format:
                            'uint32',
                    },
                    {
                        shaderLocation: 7,
                        offset: 40,
                        format:
                            'snorm16x4',
                    },
                    {
                        shaderLocation: 8,
                        offset: 48,
                        format:
                            'unorm8x4',
                    },
                ],
            }]
        );
    }

    #createCircleArcSegmentPipeline() {
        return this.#createPipeline(
            'LegendArc circular filled arc segments',
            CIRCLE_ARC_SEGMENT_SHADER,
            [{
                arrayStride: 32,
                stepMode: 'instance',
                attributes: [
                    {
                        shaderLocation: 0,
                        offset: 0,
                        format:
                            'float32x2',
                    },
                    {
                        shaderLocation: 1,
                        offset: 8,
                        format:
                            'float32',
                    },
                    {
                        shaderLocation: 2,
                        offset: 12,
                        format:
                            'snorm16x2',
                    },
                    {
                        shaderLocation: 3,
                        offset: 16,
                        format:
                            'float32',
                    },
                    {
                        shaderLocation: 4,
                        offset: 20,
                        format:
                            'snorm16x4',
                    },
                    {
                        shaderLocation: 5,
                        offset: 28,
                        format:
                            'unorm8x4',
                    },
                ],
            }]
        );
    }

    #createArcSegmentPipeline() {
        return this.#createPipeline(
            'LegendArc elliptical filled arc segments',
            ARC_SEGMENT_SHADER,
            [{
                arrayStride: 44,
                stepMode: 'instance',
                attributes: [
                    {
                        shaderLocation: 0,
                        offset: 0,
                        format:
                            'float32x2',
                    },
                    {
                        shaderLocation: 1,
                        offset: 8,
                        format:
                            'float32x2',
                    },
                    {
                        shaderLocation: 2,
                        offset: 16,
                        format:
                            'float32x2',
                    },
                    {
                        shaderLocation: 3,
                        offset: 24,
                        format:
                            'snorm16x2',
                    },
                    {
                        shaderLocation: 4,
                        offset: 28,
                        format:
                            'float32',
                    },
                    {
                        shaderLocation: 5,
                        offset: 32,
                        format:
                            'snorm16x4',
                    },
                    {
                        shaderLocation: 6,
                        offset: 40,
                        format:
                            'unorm8x4',
                    },
                ],
            }]
        );
    }

    resize(
        cssWidth =
            this.canvas.clientWidth,
        cssHeight =
            this.canvas.clientHeight,
        dpr =
            globalThis.devicePixelRatio ||
            1
    ) {
        const safeDpr =
            Number.isFinite(dpr) &&
            dpr > 0
                ? dpr
                : 1;

        const fallbackWidth =
            this.canvas.width > 0
                ? this.canvas.width /
                    safeDpr
                : 800;

        const fallbackHeight =
            this.canvas.height > 0
                ? this.canvas.height /
                    safeDpr
                : 600;

        const logicalWidth =
            Number.isFinite(cssWidth) &&
            cssWidth > 0
                ? cssWidth
                : fallbackWidth;

        const logicalHeight =
            Number.isFinite(cssHeight) &&
            cssHeight > 0
                ? cssHeight
                : fallbackHeight;

        const width = Math.max(
            1,
            Math.round(
                logicalWidth * safeDpr
            )
        );

        const height = Math.max(
            1,
            Math.round(
                logicalHeight * safeDpr
            )
        );

        if (this.canvas.width !== width) {
            this.canvas.width = width;
        }

        if (this.canvas.height !== height) {
            this.canvas.height = height;
        }

        return {
            width,
            height,
            dpr: safeDpr,
        };
    }

    beginFrame(
        clearColor = this.clearColor
    ) {
        this.#assertAlive();

        this.clearColor =
            normalizeClearColor(
                clearColor
            );

        for (
            let i = 0;
            i < KIND_COUNT;
            i++
        ) {
            this.batches[i].reset();
        }

        this.sequence.reset();
        this.frameOpen = true;
        this.geometryValid = false;

        return this;
    }

    flush() {
        this.#assertAlive();

        if (!this.frameOpen) {
            this.beginFrame(
                this.clearColor
            );
        }

        this.#writeFrameUniforms();

        let uploadedBytes = 0;

        for (
            let i = 0;
            i < KIND_COUNT;
            i++
        ) {
            uploadedBytes +=
                this.batches[i].upload(
                    this.device.queue
                );
        }

        this.#submitFrame();

        this.frameOpen = false;
        this.geometryValid = true;

        this._stats.frames++;
        this._stats.lastUploadedBytes =
            uploadedBytes;
        this._stats.uploadedBytes +=
            uploadedBytes;

        return this;
    }

    redraw(
        clearColor = this.clearColor
    ) {
        this.#assertAlive();

        if (!this.geometryValid) {
            throw new Error(
                'No uploaded LegendArc geometry is available to redraw.'
            );
        }

        if (this.frameOpen) {
            throw new Error(
                'Finish the open frame with flush() before calling redraw().'
            );
        }

        this.clearColor =
            normalizeClearColor(
                clearColor
            );

        this.#writeFrameUniforms();
        this.#submitFrame();

        this._stats.redraws++;
        this._stats.lastUploadedBytes = 0;

        return this;
    }

    async flushAndWait() {
        this.flush();

        await this.device.queue
            .onSubmittedWorkDone();

        return this;
    }

    getStats() {
        return {
            ...this._stats,
            mode: this._mode,
            instances:
                this.#instanceCount(),
            drawSpans:
                this.sequence.length,
            capacities:
                this.batches.map(
                    (batch) =>
                        batch.capacity
                ),
        };
    }

    destroy() {
        if (this.destroyed) {
            return;
        }

        this.destroyed = true;
        this._renderBundle = null;

        for (const batch of this.batches) {
            batch.destroy();
        }

        for (
            const buffer of
            this._retiredBuffers
        ) {
            buffer.destroy();
        }

        this._retiredBuffers.length = 0;
        this.frameUniformBuffer.destroy();

        if (
            typeof this.context
                .unconfigure ===
            'function'
        ) {
            this.context.unconfigure();
        }
    }

    #submitFrame() {
        const encoder =
            this.device
                .createCommandEncoder({
                    label:
                        'LegendArc frame encoder',
                });

        const pass =
            encoder.beginRenderPass({
                label:
                    'LegendArc render pass',
                colorAttachments: [{
                    view:
                        this.context
                            .getCurrentTexture()
                            .createView(),
                    clearValue:
                        this.clearColor,
                    loadOp: 'clear',
                    storeOp: 'store',
                }],
            });

        const bundle =
            this.#getRenderBundle();

        if (bundle) {
            pass.executeBundles([
                bundle,
            ]);

            this._stats
                .renderBundleHits++;
        } else {
            pass.setBindGroup(
                0,
                this.frameBindGroup
            );

            this.#encodeDrawCommands(
                pass
            );
        }

        pass.end();

        this.device.queue.submit([
            encoder.finish(),
        ]);

        this.#destroyRetiredBuffersAfterSubmission();
    }

    #encodeDrawCommands(encoder) {
        let drawCalls = 0;

        if (this._mode === MODE_FAST) {
            for (
                let i = 0;
                i < KIND_ORDER.length;
                i++
            ) {
                const kind =
                    KIND_ORDER[i];

                const batch =
                    this.batches[kind];

                if (batch.count === 0) {
                    continue;
                }

                encoder.setPipeline(
                    this.pipelines[kind]
                );

                encoder.setVertexBuffer(
                    0,
                    batch.gpuBuffer
                );

                encoder.draw(
                    4,
                    batch.count,
                    0,
                    0
                );

                drawCalls++;
            }
        } else {
            let currentKind = -1;

            for (
                let i = 0;
                i < this.sequence.length;
                i++
            ) {
                const kind =
                    this.sequence.kinds[i];

                if (
                    kind !== currentKind
                ) {
                    currentKind = kind;

                    encoder.setPipeline(
                        this.pipelines[kind]
                    );

                    encoder.setVertexBuffer(
                        0,
                        this.batches[kind]
                            .gpuBuffer
                    );
                }

                encoder.draw(
                    4,
                    this.sequence.counts[i],
                    0,
                    this.sequence.starts[i]
                );

                drawCalls++;
            }
        }

        this._stats.lastDrawCalls =
            drawCalls;
    }

    #getRenderBundle() {
        const drawCount =
            this._mode === MODE_FAST
                ? this.#activeBatchCount()
                : this.sequence.length;

        if (
            !this.useRenderBundles ||
            drawCount <
                this.renderBundleThreshold
        ) {
            return null;
        }

        if (
            this._renderBundle &&
            this.#renderBundleMatches()
        ) {
            return this._renderBundle;
        }

        const encoder =
            this.device
                .createRenderBundleEncoder({
                    label:
                        'LegendArc cached render bundle encoder',
                    colorFormats: [
                        this.format,
                    ],
                    sampleCount: 1,
                });

        encoder.setBindGroup(
            0,
            this.frameBindGroup
        );

        this.#encodeDrawCommands(
            encoder
        );

        this._renderBundle =
            encoder.finish({
                label:
                    'LegendArc cached render bundle',
            });

        this.#snapshotRenderBundleLayout();
        this._stats
            .renderBundleBuilds++;

        return this._renderBundle;
    }

    #renderBundleMatches() {
        if (
            this._bundleMode !==
            this._mode
        ) {
            return false;
        }

        for (
            let i = 0;
            i < KIND_COUNT;
            i++
        ) {
            const batch =
                this.batches[i];

            if (
                this._bundleCounts[i] !==
                    batch.count ||
                this._bundleVersions[i] !==
                    batch.version
            ) {
                return false;
            }
        }

        if (this._mode === MODE_FAST) {
            return true;
        }

        if (
            this._bundleSpanCount !==
            this.sequence.length
        ) {
            return false;
        }

        for (
            let i = 0;
            i < this.sequence.length;
            i++
        ) {
            const base = i * 3;

            if (
                this._bundleSpans[base] !==
                    this.sequence.kinds[i] ||
                this._bundleSpans[
                    base + 1
                ] !==
                    this.sequence.starts[i] ||
                this._bundleSpans[
                    base + 2
                ] !==
                    this.sequence.counts[i]
            ) {
                return false;
            }
        }

        return true;
    }

    #snapshotRenderBundleLayout() {
        this._bundleMode =
            this._mode;

        for (
            let i = 0;
            i < KIND_COUNT;
            i++
        ) {
            this._bundleCounts[i] =
                this.batches[i].count;

            this._bundleVersions[i] =
                this.batches[i].version;
        }

        this._bundleSpanCount =
            this._mode === MODE_ORDERED
                ? this.sequence.length
                : 0;

        const required =
            this._bundleSpanCount * 3;

        if (
            this._bundleSpans.length <
            required
        ) {
            this._bundleSpans =
                new Uint32Array(required);
        }

        for (
            let i = 0;
            i < this._bundleSpanCount;
            i++
        ) {
            const base = i * 3;

            this._bundleSpans[base] =
                this.sequence.kinds[i];

            this._bundleSpans[
                base + 1
            ] =
                this.sequence.starts[i];

            this._bundleSpans[
                base + 2
            ] =
                this.sequence.counts[i];
        }
    }

    #invalidateRenderBundle() {
        this._renderBundle = null;
        this._bundleMode = null;
        this._bundleSpanCount = 0;
    }

    #writeFrameUniforms() {
        const width = Math.max(
            1,
            this.canvas.width | 0
        );

        const height = Math.max(
            1,
            this.canvas.height | 0
        );

        if (
            width ===
                this._lastUniformWidth &&
            height ===
                this._lastUniformHeight &&
            this.aaPixels ===
                this._lastUniformAA
        ) {
            return;
        }

        this._uniformScratch[0] =
            width;
        this._uniformScratch[1] =
            height;
        this._uniformScratch[2] =
            this.aaPixels;
        this._uniformScratch[3] = 0;

        this.device.queue.writeBuffer(
            this.frameUniformBuffer,
            0,
            this._uniformScratch
        );

        this._lastUniformWidth =
            width;
        this._lastUniformHeight =
            height;
        this._lastUniformAA =
            this.aaPixels;
    }

    #retireBuffer(buffer) {
        this._retiredBuffers.push(
            buffer
        );

        this.#invalidateRenderBundle();
    }

    #destroyRetiredBuffersAfterSubmission() {
        if (
            this._retiredBuffers.length ===
            0
        ) {
            return;
        }

        const retiring =
            this._retiredBuffers.splice(
                0,
                this._retiredBuffers.length
            );

        this.device.queue
            .onSubmittedWorkDone()
            .then(() => {
                for (
                    const buffer of
                    retiring
                ) {
                    buffer.destroy();
                }
            })
            .catch(() => {});
    }

    #assertAlive() {
        if (this.destroyed) {
            throw new Error(
                'LegendArcEngine has been destroyed.'
            );
        }
    }

    #instanceCount() {
        let total = 0;

        for (
            let i = 0;
            i < KIND_COUNT;
            i++
        ) {
            total +=
                this.batches[i].count;
        }

        return total;
    }

    #activeBatchCount() {
        let total = 0;

        for (
            let i = 0;
            i < KIND_COUNT;
            i++
        ) {
            if (
                this.batches[i].count >
                0
            ) {
                total++;
            }
        }

        return total;
    }

    #record(kind, index) {
        if (
            this._mode ===
            MODE_ORDERED
        ) {
            this.sequence.record(
                kind,
                index
            );
        }
    }

    #ensureFrame() {
        if (!this.frameOpen) {
            this.beginFrame(
                this.clearColor
            );
        }
    }

    #refreshTransformMetrics() {
        const transform =
            this.transformMatrix;

        const a = transform[0];
        const b = transform[1];
        const c = transform[2];
        const d = transform[3];

        const xLengthSquared =
            a * a + b * b;

        const yLengthSquared =
            c * c + d * d;

        const dot = a * c + b * d;

        const scaleReference =
            Math.max(
                xLengthSquared,
                yLengthSquared,
                1e-24
            );

        this._transformIsSimilarity =
            Math.abs(
                xLengthSquared -
                yLengthSquared
            ) <=
                TRANSFORM_EPSILON *
                scaleReference &&
            Math.abs(dot) <=
                TRANSFORM_EPSILON *
                scaleReference;

        this._transformScale =
            this._transformIsSimilarity
                ? Math.sqrt(
                    Math.max(
                        0,
                        (
                            xLengthSquared +
                            yLengthSquared
                        ) * 0.5
                    )
                )
                : 0;
    }

    #writeFullCircleCommand(
        x,
        y,
        radius,
        output
    ) {
        const t = this.transformMatrix;

        output[CMD_CENTER_X] =
            t[0] * x +
            t[2] * y +
            t[4];

        output[CMD_CENTER_Y] =
            t[1] * x +
            t[3] * y +
            t[5];

        output[CMD_AXIS_XX] =
            t[0] * radius;

        output[CMD_AXIS_XY] =
            t[1] * radius;

        output[CMD_AXIS_YX] =
            t[2] * radius;

        output[CMD_AXIS_YY] =
            t[3] * radius;

        output[CMD_LOCAL_RADIUS_X] =
            radius;

        output[CMD_LOCAL_RADIUS_Y] =
            radius;

        const axx =
            output[CMD_AXIS_XX];

        const axy =
            output[CMD_AXIS_XY];

        const ayx =
            output[CMD_AXIS_YX];

        const ayy =
            output[CMD_AXIS_YY];

        const xLengthSquared =
            axx * axx + axy * axy;

        const yLengthSquared =
            ayx * ayx + ayy * ayy;

        const dot =
            axx * ayx + axy * ayy;

        const reference =
            Math.max(
                xLengthSquared,
                yLengthSquared,
                1e-24
            );

        const isCircle =
            Math.abs(
                xLengthSquared -
                yLengthSquared
            ) <=
                TRANSFORM_EPSILON *
                reference &&
            Math.abs(dot) <=
                TRANSFORM_EPSILON *
                reference;

        output[CMD_WORLD_RADIUS] =
            isCircle
                ? Math.sqrt(
                    Math.max(
                        0,
                        (
                            xLengthSquared +
                            yLengthSquared
                        ) * 0.5
                    )
                )
                : Math.sqrt(
                    Math.max(
                        xLengthSquared,
                        yLengthSquared
                    )
                );

        output[CMD_START_X] = 1;
        output[CMD_START_Y] = 0;
        output[CMD_END_X] = 1;
        output[CMD_END_Y] = 0;
        output[CMD_SWEEP] = TWO_PI;
        output[CMD_DIRECTION] = 1;

        output[CMD_FLAGS] =
            COMMAND_FULL_CIRCLE |
            (
                isCircle
                    ? COMMAND_IS_CIRCLE
                    : 0
            );
    }

    #writeEllipseCommand(
        x,
        y,
        radiusX,
        radiusY,
        rotation,
        startAngle,
        endAngle,
        anticlockwise,
        output
    ) {
        const rawDelta =
            endAngle - startAngle;

        const ccw =
            Boolean(anticlockwise);

        const fullCircle =
            (
                !ccw &&
                rawDelta >=
                    TWO_PI -
                    EPSILON
            ) ||
            (
                ccw &&
                rawDelta <=
                    -TWO_PI +
                    EPSILON
            );

        let sweep = TWO_PI;

        if (!fullCircle) {
            sweep = positiveModulo(
                ccw
                    ? -rawDelta
                    : rawDelta,
                TWO_PI
            );

            if (sweep < EPSILON) {
                sweep = 0;
            }
        }

        let localAxisXx;
        let localAxisXy;
        let localAxisYx;
        let localAxisYy;

        if (rotation === 0) {
            localAxisXx = radiusX;
            localAxisXy = 0;
            localAxisYx = 0;
            localAxisYy = radiusY;
        } else {
            const cosine =
                Math.cos(rotation);

            const sine =
                Math.sin(rotation);

            localAxisXx =
                cosine * radiusX;

            localAxisXy =
                sine * radiusX;

            localAxisYx =
                -sine * radiusY;

            localAxisYy =
                cosine * radiusY;
        }

        const t = this.transformMatrix;

        output[CMD_CENTER_X] =
            t[0] * x +
            t[2] * y +
            t[4];

        output[CMD_CENTER_Y] =
            t[1] * x +
            t[3] * y +
            t[5];

        output[CMD_AXIS_XX] =
            t[0] * localAxisXx +
            t[2] * localAxisXy;

        output[CMD_AXIS_XY] =
            t[1] * localAxisXx +
            t[3] * localAxisXy;

        output[CMD_AXIS_YX] =
            t[0] * localAxisYx +
            t[2] * localAxisYy;

        output[CMD_AXIS_YY] =
            t[1] * localAxisYx +
            t[3] * localAxisYy;

        output[CMD_LOCAL_RADIUS_X] =
            radiusX;

        output[CMD_LOCAL_RADIUS_Y] =
            radiusY;

        const axx =
            output[CMD_AXIS_XX];

        const axy =
            output[CMD_AXIS_XY];

        const ayx =
            output[CMD_AXIS_YX];

        const ayy =
            output[CMD_AXIS_YY];

        const xLengthSquared =
            axx * axx + axy * axy;

        const yLengthSquared =
            ayx * ayx + ayy * ayy;

        const dot =
            axx * ayx + axy * ayy;

        const reference =
            Math.max(
                xLengthSquared,
                yLengthSquared,
                1e-24
            );

        const isCircle =
            Math.abs(
                xLengthSquared -
                yLengthSquared
            ) <=
                TRANSFORM_EPSILON *
                reference &&
            Math.abs(dot) <=
                TRANSFORM_EPSILON *
                reference;

        output[CMD_WORLD_RADIUS] =
            isCircle
                ? Math.sqrt(
                    Math.max(
                        0,
                        (
                            xLengthSquared +
                            yLengthSquared
                        ) * 0.5
                    )
                )
                : Math.sqrt(
                    Math.max(
                        xLengthSquared,
                        yLengthSquared
                    )
                );

        const actualEnd =
            startAngle +
            (
                ccw
                    ? -sweep
                    : sweep
            );

        if (fullCircle) {
            output[CMD_START_X] = 1;
            output[CMD_START_Y] = 0;
            output[CMD_END_X] = 1;
            output[CMD_END_Y] = 0;
        } else {
            if (startAngle === 0) {
                output[CMD_START_X] = 1;
                output[CMD_START_Y] = 0;
            } else {
                output[CMD_START_X] =
                    Math.cos(startAngle);

                output[CMD_START_Y] =
                    Math.sin(startAngle);
            }

            output[CMD_END_X] =
                Math.cos(actualEnd);

            output[CMD_END_Y] =
                Math.sin(actualEnd);
        }

        output[CMD_SWEEP] =
            sweep;

        output[CMD_DIRECTION] =
            ccw ? -1 : 1;

        output[CMD_FLAGS] =
            (
                fullCircle
                    ? COMMAND_FULL_CIRCLE
                    : 0
            ) |
            (
                isCircle
                    ? COMMAND_IS_CIRCLE
                    : 0
            );
    }

    #addCircleRing(
        centerX,
        centerY,
        radius,
        innerRatio,
        packedColor
    ) {
        this.#ensureFrame();

        if (
            !(radius > 0) ||
            !finite3(
                centerX,
                centerY,
                radius
            )
        ) {
            return;
        }

        const batch =
            this.batches[
                KIND_CIRCLE
            ];

        const index =
            batch.reserveOne();

        const base = index * 5;

        batch.floatView[base] =
            centerX;

        batch.floatView[base + 1] =
            centerY;

        batch.floatView[base + 2] =
            radius;

        batch.floatView[base + 3] =
            clamp01(innerRatio);

        batch.uintView[base + 4] =
            packedColor;

        this.#record(
            KIND_CIRCLE,
            index
        );
    }

    #addEllipseRing(
        command,
        base,
        innerRatio,
        packedColor
    ) {
        this.#ensureFrame();

        if (
            !this.#commandHasArea(
                command,
                base
            )
        ) {
            return;
        }

        const batch =
            this.batches[
                KIND_ELLIPSE_RING
            ];

        const index =
            batch.reserveOne();

        const target =
            index * 8;

        this.#writeAxes(
            batch.floatView,
            target,
            command,
            base
        );

        batch.floatView[target + 6] =
            clamp01(innerRatio);

        batch.uintView[target + 7] =
            packedColor;

        this.#record(
            KIND_ELLIPSE_RING,
            index
        );
    }

    #addPartialArc(
        command,
        base,
        innerRatio,
        packedColor,
        sectorFill
    ) {
        this.#ensureFrame();

        if (
            !this.#commandHasArea(
                command,
                base
            )
        ) {
            return;
        }

        const sweep =
            command[
                base +
                CMD_SWEEP
            ];

        if (!(sweep > EPSILON)) {
            return;
        }

        const effectiveInner =
            sectorFill
                ? 0
                : clamp01(
                    innerRatio
                );

        let flags =
            sweep > Math.PI
                ? ARC_FLAG_MAJOR
                : 0;

        if (
            command[
                base +
                CMD_DIRECTION
            ] < 0
        ) {
            flags |=
                ARC_FLAG_ANTICLOCKWISE;
        }

        this.#computePartialArcBounds(
            command,
            base,
            effectiveInner,
            sectorFill
        );

        const packedBoundsMin =
            packSnorm16x2(
                this._boundsScratch[0],
                this._boundsScratch[1]
            );

        const packedBoundsMax =
            packSnorm16x2(
                this._boundsScratch[2],
                this._boundsScratch[3]
            );

        const isCircle =
            (
                (
                    command[
                        base +
                        CMD_FLAGS
                    ] | 0
                ) &
                COMMAND_IS_CIRCLE
            ) !== 0;

        if (isCircle) {
            const batch =
                this.batches[
                    KIND_CIRCLE_PARTIAL_ARC
                ];

            const index =
                batch.reserveOne();

            const target =
                index * 10;

            batch.floatView[target] =
                command[
                    base +
                    CMD_CENTER_X
                ];

            batch.floatView[target + 1] =
                command[
                    base +
                    CMD_CENTER_Y
                ];

            batch.floatView[target + 2] =
                command[
                    base +
                    CMD_WORLD_RADIUS
                ];

            batch.floatView[target + 3] =
                effectiveInner;

            batch.uintView[target + 4] =
                packSnorm16x2(
                    command[
                        base +
                        CMD_START_X
                    ],
                    command[
                        base +
                        CMD_START_Y
                    ]
                );

            batch.uintView[target + 5] =
                packSnorm16x2(
                    command[
                        base +
                        CMD_END_X
                    ],
                    command[
                        base +
                        CMD_END_Y
                    ]
                );

            batch.uintView[target + 6] =
                flags;

            batch.uintView[target + 7] =
                packedBoundsMin;

            batch.uintView[target + 8] =
                packedBoundsMax;

            batch.uintView[target + 9] =
                packedColor;

            this.#record(
                KIND_CIRCLE_PARTIAL_ARC,
                index
            );

            return;
        }

        const batch =
            this.batches[
                KIND_ELLIPSE_PARTIAL_ARC
            ];

        const index =
            batch.reserveOne();

        const target =
            index * 13;

        this.#writeAxes(
            batch.floatView,
            target,
            command,
            base
        );

        batch.floatView[target + 6] =
            effectiveInner;

        batch.uintView[target + 7] =
            packSnorm16x2(
                command[
                    base +
                    CMD_START_X
                ],
                command[
                    base +
                    CMD_START_Y
                ]
            );

        batch.uintView[target + 8] =
            packSnorm16x2(
                command[
                    base +
                    CMD_END_X
                ],
                command[
                    base +
                    CMD_END_Y
                ]
            );

        batch.uintView[target + 9] =
            flags;

        batch.uintView[target + 10] =
            packedBoundsMin;

        batch.uintView[target + 11] =
            packedBoundsMax;

        batch.uintView[target + 12] =
            packedColor;

        this.#record(
            KIND_ELLIPSE_PARTIAL_ARC,
            index
        );
    }

    #addArcSegment(
        command,
        base,
        packedColor
    ) {
        this.#ensureFrame();

        if (
            !this.#commandHasArea(
                command,
                base
            )
        ) {
            return;
        }

        const sweep =
            command[
                base +
                CMD_SWEEP
            ];

        if (!(sweep > EPSILON)) {
            return;
        }

        const halfSignedSweep =
            command[
                base +
                CMD_DIRECTION
            ] *
            sweep *
            0.5;

        const cosine =
            Math.cos(
                halfSignedSweep
            );

        const sine =
            Math.sin(
                halfSignedSweep
            );

        const startX =
            command[
                base +
                CMD_START_X
            ];

        const startY =
            command[
                base +
                CMD_START_Y
            ];

        const middleX =
            startX * cosine -
            startY * sine;

        const middleY =
            startY * cosine +
            startX * sine;

        const packedMiddle =
            packSnorm16x2(
                middleX,
                middleY
            );

        const chordOffset =
            Math.cos(
                sweep * 0.5
            );

        this.#computeSegmentBounds(
            command,
            base
        );

        const packedBoundsMin =
            packSnorm16x2(
                this._boundsScratch[0],
                this._boundsScratch[1]
            );

        const packedBoundsMax =
            packSnorm16x2(
                this._boundsScratch[2],
                this._boundsScratch[3]
            );

        const isCircle =
            (
                (
                    command[
                        base +
                        CMD_FLAGS
                    ] | 0
                ) &
                COMMAND_IS_CIRCLE
            ) !== 0;

        if (isCircle) {
            const batch =
                this.batches[
                    KIND_CIRCLE_ARC_SEGMENT
                ];

            const index =
                batch.reserveOne();

            const target =
                index * 8;

            batch.floatView[target] =
                command[
                    base +
                    CMD_CENTER_X
                ];

            batch.floatView[target + 1] =
                command[
                    base +
                    CMD_CENTER_Y
                ];

            batch.floatView[target + 2] =
                command[
                    base +
                    CMD_WORLD_RADIUS
                ];

            batch.uintView[target + 3] =
                packedMiddle;

            batch.floatView[target + 4] =
                chordOffset;

            batch.uintView[target + 5] =
                packedBoundsMin;

            batch.uintView[target + 6] =
                packedBoundsMax;

            batch.uintView[target + 7] =
                packedColor;

            this.#record(
                KIND_CIRCLE_ARC_SEGMENT,
                index
            );

            return;
        }

        const batch =
            this.batches[
                KIND_ELLIPSE_ARC_SEGMENT
            ];

        const index =
            batch.reserveOne();

        const target =
            index * 11;

        this.#writeAxes(
            batch.floatView,
            target,
            command,
            base
        );

        batch.uintView[target + 6] =
            packedMiddle;

        batch.floatView[target + 7] =
            chordOffset;

        batch.uintView[target + 8] =
            packedBoundsMin;

        batch.uintView[target + 9] =
            packedBoundsMax;

        batch.uintView[target + 10] =
            packedColor;

        this.#record(
            KIND_ELLIPSE_ARC_SEGMENT,
            index
        );
    }

    #writeAxes(
        target,
        targetBase,
        command,
        commandBase
    ) {
        target[targetBase] =
            command[
                commandBase +
                CMD_CENTER_X
            ];

        target[targetBase + 1] =
            command[
                commandBase +
                CMD_CENTER_Y
            ];

        target[targetBase + 2] =
            command[
                commandBase +
                CMD_AXIS_XX
            ];

        target[targetBase + 3] =
            command[
                commandBase +
                CMD_AXIS_XY
            ];

        target[targetBase + 4] =
            command[
                commandBase +
                CMD_AXIS_YX
            ];

        target[targetBase + 5] =
            command[
                commandBase +
                CMD_AXIS_YY
            ];
    }

    #commandHasArea(
        command,
        base
    ) {
        const axx =
            command[
                base +
                CMD_AXIS_XX
            ];

        const axy =
            command[
                base +
                CMD_AXIS_XY
            ];

        const ayx =
            command[
                base +
                CMD_AXIS_YX
            ];

        const ayy =
            command[
                base +
                CMD_AXIS_YY
            ];

        return (
            Number.isFinite(axx) &&
            Number.isFinite(axy) &&
            Number.isFinite(ayx) &&
            Number.isFinite(ayy) &&
            Math.abs(
                axx * ayy -
                axy * ayx
            ) > 1e-12
        );
    }

    #directionInsideArc(
        command,
        base,
        x,
        y
    ) {
        const direction =
            command[
                base +
                CMD_DIRECTION
            ];

        const startX =
            command[
                base +
                CMD_START_X
            ];

        const startY =
            command[
                base +
                CMD_START_Y
            ];

        const endX =
            command[
                base +
                CMD_END_X
            ];

        const endY =
            command[
                base +
                CMD_END_Y
            ];

        const sideStart =
            direction *
            (
                startX * y -
                startY * x
            );

        const sideEnd =
            direction *
            (
                x * endY -
                y * endX
            );

        return (
            command[
                base +
                CMD_SWEEP
            ] > Math.PI
        )
            ? Math.max(
                sideStart,
                sideEnd
            ) >= -EPSILON
            : Math.min(
                sideStart,
                sideEnd
            ) >= -EPSILON;
    }

    #computePartialArcBounds(
        command,
        base,
        innerRatio,
        includeCenter
    ) {
        const startX =
            command[
                base +
                CMD_START_X
            ];

        const startY =
            command[
                base +
                CMD_START_Y
            ];

        const endX =
            command[
                base +
                CMD_END_X
            ];

        const endY =
            command[
                base +
                CMD_END_Y
            ];

        let minX = Math.min(
            startX,
            endX
        );

        let minY = Math.min(
            startY,
            endY
        );

        let maxX = Math.max(
            startX,
            endX
        );

        let maxY = Math.max(
            startY,
            endY
        );

        if (innerRatio > 0) {
            const innerStartX =
                startX * innerRatio;

            const innerStartY =
                startY * innerRatio;

            const innerEndX =
                endX * innerRatio;

            const innerEndY =
                endY * innerRatio;

            minX = Math.min(
                minX,
                innerStartX,
                innerEndX
            );

            minY = Math.min(
                minY,
                innerStartY,
                innerEndY
            );

            maxX = Math.max(
                maxX,
                innerStartX,
                innerEndX
            );

            maxY = Math.max(
                maxY,
                innerStartY,
                innerEndY
            );
        } else if (includeCenter) {
            minX = Math.min(minX, 0);
            minY = Math.min(minY, 0);
            maxX = Math.max(maxX, 0);
            maxY = Math.max(maxY, 0);
        }

        if (
            this.#directionInsideArc(
                command,
                base,
                1,
                0
            )
        ) {
            maxX = 1;
        }

        if (
            this.#directionInsideArc(
                command,
                base,
                0,
                1
            )
        ) {
            maxY = 1;
        }

        if (
            this.#directionInsideArc(
                command,
                base,
                -1,
                0
            )
        ) {
            minX = -1;
        }

        if (
            this.#directionInsideArc(
                command,
                base,
                0,
                -1
            )
        ) {
            minY = -1;
        }

        this._boundsScratch[0] = minX;
        this._boundsScratch[1] = minY;
        this._boundsScratch[2] = maxX;
        this._boundsScratch[3] = maxY;
    }

    #computeSegmentBounds(
        command,
        base
    ) {
        const startX =
            command[
                base +
                CMD_START_X
            ];

        const startY =
            command[
                base +
                CMD_START_Y
            ];

        const endX =
            command[
                base +
                CMD_END_X
            ];

        const endY =
            command[
                base +
                CMD_END_Y
            ];

        let minX = Math.min(
            startX,
            endX
        );

        let minY = Math.min(
            startY,
            endY
        );

        let maxX = Math.max(
            startX,
            endX
        );

        let maxY = Math.max(
            startY,
            endY
        );

        if (
            this.#directionInsideArc(
                command,
                base,
                1,
                0
            )
        ) {
            maxX = 1;
        }

        if (
            this.#directionInsideArc(
                command,
                base,
                0,
                1
            )
        ) {
            maxY = 1;
        }

        if (
            this.#directionInsideArc(
                command,
                base,
                -1,
                0
            )
        ) {
            minX = -1;
        }

        if (
            this.#directionInsideArc(
                command,
                base,
                0,
                -1
            )
        ) {
            minY = -1;
        }

        this._boundsScratch[0] = minX;
        this._boundsScratch[1] = minY;
        this._boundsScratch[2] = maxX;
        this._boundsScratch[3] = maxY;
    }

    fillCircle(
        x,
        y,
        radius,
        color = this.fillStyle,
        alpha = this.globalAlpha
    ) {
        if (
            !(radius > 0) ||
            !finite3(x, y, radius)
        ) {
            return this;
        }

        const packedColor =
            this.colorCache.parse(
                color,
                alpha
            );

        if (
            this._transformIsSimilarity
        ) {
            const t =
                this.transformMatrix;

            const centerX =
                t[0] * x +
                t[2] * y +
                t[4];

            const centerY =
                t[1] * x +
                t[3] * y +
                t[5];

            this.#addCircleRing(
                centerX,
                centerY,
                radius *
                    this._transformScale,
                0,
                packedColor
            );
        } else {
            this.#writeFullCircleCommand(
                x,
                y,
                radius,
                this._scratch
            );

            this.#addEllipseRing(
                this._scratch,
                0,
                0,
                packedColor
            );
        }

        return this;
    }

    fillEllipse(
        x,
        y,
        radiusX,
        radiusY,
        rotation = 0,
        color = this.fillStyle,
        alpha = this.globalAlpha
    ) {
        if (
            !(radiusX > 0) ||
            !(radiusY > 0) ||
            !finite5(
                x,
                y,
                radiusX,
                radiusY,
                rotation
            )
        ) {
            return this;
        }

        const packedColor =
            this.colorCache.parse(
                color,
                alpha
            );

        this.#writeEllipseCommand(
            x,
            y,
            radiusX,
            radiusY,
            rotation,
            0,
            TWO_PI,
            false,
            this._scratch
        );

        if (
            (
                this._scratch[
                    CMD_FLAGS
                ] &
                COMMAND_IS_CIRCLE
            ) !== 0
        ) {
            this.#addCircleRing(
                this._scratch[
                    CMD_CENTER_X
                ],
                this._scratch[
                    CMD_CENTER_Y
                ],
                this._scratch[
                    CMD_WORLD_RADIUS
                ],
                0,
                packedColor
            );
        } else {
            this.#addEllipseRing(
                this._scratch,
                0,
                0,
                packedColor
            );
        }

        return this;
    }

    strokeCircle(
        x,
        y,
        radius,
        width = this.lineWidth,
        color = this.strokeStyle,
        alpha = this.globalAlpha
    ) {
        if (
            !(radius > 0) ||
            !(width > 0) ||
            !Number.isFinite(width) ||
            !finite3(x, y, radius)
        ) {
            return this;
        }

        const innerRatio =
            Math.max(
                0,
                1 - width / radius
            );

        const packedColor =
            this.colorCache.parse(
                color,
                alpha
            );

        if (
            this._transformIsSimilarity
        ) {
            const t =
                this.transformMatrix;

            const centerX =
                t[0] * x +
                t[2] * y +
                t[4];

            const centerY =
                t[1] * x +
                t[3] * y +
                t[5];

            this.#addCircleRing(
                centerX,
                centerY,
                radius *
                    this._transformScale,
                innerRatio,
                packedColor
            );
        } else {
            this.#writeFullCircleCommand(
                x,
                y,
                radius,
                this._scratch
            );

            this.#addEllipseRing(
                this._scratch,
                0,
                innerRatio,
                packedColor
            );
        }

        return this;
    }

    strokeArc(
        x,
        y,
        radius,
        startAngle,
        endAngle,
        width = this.lineWidth,
        color = this.strokeStyle,
        alpha = this.globalAlpha,
        anticlockwise = false
    ) {
        if (
            !(radius > 0) ||
            !(width > 0) ||
            !Number.isFinite(width) ||
            !finite5(
                x,
                y,
                radius,
                startAngle,
                endAngle
            )
        ) {
            return this;
        }

        this.#writeEllipseCommand(
            x,
            y,
            radius,
            radius,
            0,
            startAngle,
            endAngle,
            anticlockwise,
            this._scratch
        );

        const packedColor =
            this.colorCache.parse(
                color,
                alpha
            );

        const innerRatio =
            Math.max(
                0,
                1 - width / radius
            );

        if (
            (
                this._scratch[
                    CMD_FLAGS
                ] &
                COMMAND_FULL_CIRCLE
            ) !== 0
        ) {
            if (
                (
                    this._scratch[
                        CMD_FLAGS
                    ] &
                    COMMAND_IS_CIRCLE
                ) !== 0
            ) {
                this.#addCircleRing(
                    this._scratch[
                        CMD_CENTER_X
                    ],
                    this._scratch[
                        CMD_CENTER_Y
                    ],
                    this._scratch[
                        CMD_WORLD_RADIUS
                    ],
                    innerRatio,
                    packedColor
                );
            } else {
                this.#addEllipseRing(
                    this._scratch,
                    0,
                    innerRatio,
                    packedColor
                );
            }
        } else {
            this.#addPartialArc(
                this._scratch,
                0,
                innerRatio,
                packedColor,
                false
            );
        }

        return this;
    }

    fillSector(
        x,
        y,
        radius,
        startAngle,
        endAngle,
        color = this.fillStyle,
        alpha = this.globalAlpha,
        anticlockwise = false
    ) {
        if (
            !(radius > 0) ||
            !finite5(
                x,
                y,
                radius,
                startAngle,
                endAngle
            )
        ) {
            return this;
        }

        this.#writeEllipseCommand(
            x,
            y,
            radius,
            radius,
            0,
            startAngle,
            endAngle,
            anticlockwise,
            this._scratch
        );

        const packedColor =
            this.colorCache.parse(
                color,
                alpha
            );

        if (
            (
                this._scratch[
                    CMD_FLAGS
                ] &
                COMMAND_FULL_CIRCLE
            ) !== 0
        ) {
            if (
                (
                    this._scratch[
                        CMD_FLAGS
                    ] &
                    COMMAND_IS_CIRCLE
                ) !== 0
            ) {
                this.#addCircleRing(
                    this._scratch[
                        CMD_CENTER_X
                    ],
                    this._scratch[
                        CMD_CENTER_Y
                    ],
                    this._scratch[
                        CMD_WORLD_RADIUS
                    ],
                    0,
                    packedColor
                );
            } else {
                this.#addEllipseRing(
                    this._scratch,
                    0,
                    0,
                    packedColor
                );
            }
        } else {
            this.#addPartialArc(
                this._scratch,
                0,
                0,
                packedColor,
                true
            );
        }

        return this;
    }

    beginPath() {
        this.currentPath.reset();
        return this;
    }

    arc(
        x,
        y,
        radius,
        startAngle = 0,
        endAngle = TWO_PI,
        anticlockwise = false
    ) {
        if (!(radius >= 0)) {
            throw new RangeError(
                'arc radius must be non-negative.'
            );
        }

        if (
            !finite5(
                x,
                y,
                radius,
                startAngle,
                endAngle
            )
        ) {
            throw new TypeError(
                'arc arguments must be finite numbers.'
            );
        }

        this.#writeEllipseCommand(
            x,
            y,
            radius,
            radius,
            0,
            startAngle,
            endAngle,
            anticlockwise,
            this._scratch
        );

        this.currentPath.push(
            this._scratch
        );

        return this;
    }

    ellipse(
        x,
        y,
        radiusX,
        radiusY,
        rotation = 0,
        startAngle = 0,
        endAngle = TWO_PI,
        anticlockwise = false
    ) {
        if (
            !(radiusX >= 0) ||
            !(radiusY >= 0)
        ) {
            throw new RangeError(
                'ellipse radii must be non-negative.'
            );
        }

        if (
            ![
                x,
                y,
                radiusX,
                radiusY,
                rotation,
                startAngle,
                endAngle,
            ].every(Number.isFinite)
        ) {
            throw new TypeError(
                'ellipse arguments must be finite numbers.'
            );
        }

        this.#writeEllipseCommand(
            x,
            y,
            radiusX,
            radiusY,
            rotation,
            startAngle,
            endAngle,
            anticlockwise,
            this._scratch
        );

        this.currentPath.push(
            this._scratch
        );

        return this;
    }

    closePath() {
        return this;
    }

    fill() {
        const packedColor =
            this.colorCache.parse(
                this.fillStyle,
                this.globalAlpha
            );

        const data =
            this.currentPath.data;

        for (
            let i = 0;
            i < this.currentPath.count;
            i++
        ) {
            const base =
                i * COMMAND_STRIDE;

            const flags =
                data[
                    base +
                    CMD_FLAGS
                ] | 0;

            if (
                (
                    flags &
                    COMMAND_FULL_CIRCLE
                ) !== 0
            ) {
                if (
                    (
                        flags &
                        COMMAND_IS_CIRCLE
                    ) !== 0
                ) {
                    this.#addCircleRing(
                        data[
                            base +
                            CMD_CENTER_X
                        ],
                        data[
                            base +
                            CMD_CENTER_Y
                        ],
                        data[
                            base +
                            CMD_WORLD_RADIUS
                        ],
                        0,
                        packedColor
                    );
                } else {
                    this.#addEllipseRing(
                        data,
                        base,
                        0,
                        packedColor
                    );
                }
            } else {
                this.#addArcSegment(
                    data,
                    base,
                    packedColor
                );
            }
        }

        return this;
    }

    stroke() {
        if (
            !(this.lineWidth > 0) ||
            !Number.isFinite(
                this.lineWidth
            )
        ) {
            return this;
        }

        const packedColor =
            this.colorCache.parse(
                this.strokeStyle,
                this.globalAlpha
            );

        const data =
            this.currentPath.data;

        for (
            let i = 0;
            i < this.currentPath.count;
            i++
        ) {
            const base =
                i * COMMAND_STRIDE;

            const referenceRadius =
                Math.max(
                    data[
                        base +
                        CMD_LOCAL_RADIUS_X
                    ],
                    data[
                        base +
                        CMD_LOCAL_RADIUS_Y
                    ],
                    EPSILON
                );

            const innerRatio =
                Math.max(
                    0,
                    1 -
                        this.lineWidth /
                        referenceRadius
                );

            const flags =
                data[
                    base +
                    CMD_FLAGS
                ] | 0;

            if (
                (
                    flags &
                    COMMAND_FULL_CIRCLE
                ) !== 0
            ) {
                if (
                    (
                        flags &
                        COMMAND_IS_CIRCLE
                    ) !== 0
                ) {
                    this.#addCircleRing(
                        data[
                            base +
                            CMD_CENTER_X
                        ],
                        data[
                            base +
                            CMD_CENTER_Y
                        ],
                        data[
                            base +
                            CMD_WORLD_RADIUS
                        ],
                        innerRatio,
                        packedColor
                    );
                } else {
                    this.#addEllipseRing(
                        data,
                        base,
                        innerRatio,
                        packedColor
                    );
                }
            } else {
                this.#addPartialArc(
                    data,
                    base,
                    innerRatio,
                    packedColor,
                    false
                );
            }
        }

        return this;
    }

    save() {
        const t =
            this.transformMatrix;

        this.stateStack.push({
            fillStyle:
                this.fillStyle,
            strokeStyle:
                this.strokeStyle,
            globalAlpha:
                this.globalAlpha,
            lineWidth:
                this.lineWidth,
            lineCap:
                this.lineCap,
            a: t[0],
            b: t[1],
            c: t[2],
            d: t[3],
            e: t[4],
            f: t[5],
        });

        return this;
    }

    restore() {
        const state =
            this.stateStack.pop();

        if (!state) {
            return this;
        }

        this.fillStyle =
            state.fillStyle;

        this.strokeStyle =
            state.strokeStyle;

        this.globalAlpha =
            state.globalAlpha;

        this.lineWidth =
            state.lineWidth;

        this.lineCap =
            state.lineCap;

        const t =
            this.transformMatrix;

        t[0] = state.a;
        t[1] = state.b;
        t[2] = state.c;
        t[3] = state.d;
        t[4] = state.e;
        t[5] = state.f;

        this.#refreshTransformMetrics();

        return this;
    }

    resetTransform() {
        const t =
            this.transformMatrix;

        t[0] = 1;
        t[1] = 0;
        t[2] = 0;
        t[3] = 1;
        t[4] = 0;
        t[5] = 0;

        this.#refreshTransformMetrics();

        return this;
    }

    setTransform(
        a,
        b,
        c,
        d,
        e,
        f
    ) {
        const t =
            this.transformMatrix;

        if (
            typeof a === 'object' &&
            a !== null
        ) {
            t[0] = Number(
                a.a ?? 1
            );
            t[1] = Number(
                a.b ?? 0
            );
            t[2] = Number(
                a.c ?? 0
            );
            t[3] = Number(
                a.d ?? 1
            );
            t[4] = Number(
                a.e ?? 0
            );
            t[5] = Number(
                a.f ?? 0
            );
        } else {
            t[0] = Number(a);
            t[1] = Number(b);
            t[2] = Number(c);
            t[3] = Number(d);
            t[4] = Number(e);
            t[5] = Number(f);
        }

        this.#refreshTransformMetrics();

        return this;
    }

    transform(
        a,
        b,
        c,
        d,
        e,
        f
    ) {
        a = Number(a);
        b = Number(b);
        c = Number(c);
        d = Number(d);
        e = Number(e);
        f = Number(f);

        const t =
            this.transformMatrix;

        const t0 = t[0];
        const t1 = t[1];
        const t2 = t[2];
        const t3 = t[3];
        const t4 = t[4];
        const t5 = t[5];

        t[0] =
            t0 * a + t2 * b;

        t[1] =
            t1 * a + t3 * b;

        t[2] =
            t0 * c + t2 * d;

        t[3] =
            t1 * c + t3 * d;

        t[4] =
            t0 * e +
            t2 * f +
            t4;

        t[5] =
            t1 * e +
            t3 * f +
            t5;

        this.#refreshTransformMetrics();

        return this;
    }

    translate(x, y) {
        return this.transform(
            1,
            0,
            0,
            1,
            x,
            y
        );
    }

    scale(x, y = x) {
        return this.transform(
            x,
            0,
            0,
            y,
            0,
            0
        );
    }

    rotate(angle) {
        const cosine =
            Math.cos(angle);

        const sine =
            Math.sin(angle);

        return this.transform(
            cosine,
            sine,
            -sine,
            cosine,
            0,
            0
        );
    }

    clearRect(
        x = 0,
        y = 0,
        width =
            this.canvas?.width ||
            800,
        height =
            this.canvas?.height ||
            600
    ) {
        void x;
        void y;
        void width;
        void height;

        return this.beginFrame({
            r: 0,
            g: 0,
            b: 0,
            a: 0,
        });
    }
}

export const LegendArc =
    Object.freeze({
        create: (
            canvas,
            options
        ) =>
            LegendArcEngine.create(
                canvas,
                options
            ),
    });

export default LegendArc;