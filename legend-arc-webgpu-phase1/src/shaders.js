const COMMON_UNIFORMS = /* wgsl */`
struct FrameUniforms {
    resolution : vec2<f32>,
    _padding   : vec2<f32>,
};

@group(0) @binding(0)
var<uniform> frame : FrameUniforms;

fn quad_position(vertexIndex : u32) -> vec2<f32> {
    switch vertexIndex {
        case 0u: { return vec2<f32>(-1.0, -1.0); }
        case 1u: { return vec2<f32>( 1.0, -1.0); }
        case 2u: { return vec2<f32>(-1.0,  1.0); }
        default: { return vec2<f32>( 1.0,  1.0); }
    }
}

fn world_to_clip(world : vec2<f32>) -> vec4<f32> {
    let safeResolution = max(frame.resolution, vec2<f32>(1.0, 1.0));
    var clip = world / safeResolution * 2.0 - vec2<f32>(1.0, 1.0);
    clip.y = -clip.y;
    return vec4<f32>(clip, 0.0, 1.0);
}

fn premultiplied(color : vec4<f32>, coverage : f32) -> vec4<f32> {
    let alpha = color.a * clamp(coverage, 0.0, 1.0);
    return vec4<f32>(color.rgb * alpha, alpha);
}
`;

export const CIRCLE_SHADER = /* wgsl */`
${COMMON_UNIFORMS}

struct VertexInput {
    @builtin(vertex_index) vertexIndex : u32,
    @location(0) center : vec2<f32>,
    @location(1) radius : f32,
    @location(2) color : vec4<f32>,
};

struct VertexOutput {
    @builtin(position) position : vec4<f32>,
    @location(0) local : vec2<f32>,
    @location(1) color : vec4<f32>,
};

@vertex
fn vs_main(input : VertexInput) -> VertexOutput {
    let local = quad_position(input.vertexIndex);
    let world = input.center + local * input.radius;

    var output : VertexOutput;
    output.position = world_to_clip(world);
    output.local = local;
    output.color = input.color;
    return output;
}

@fragment
fn fs_main(input : VertexOutput) -> @location(0) vec4<f32> {
    let distance = length(input.local);
    let aa = max(fwidth(distance), 1e-5);
    let coverage = 1.0 - smoothstep(1.0 - aa, 1.0 + aa, distance);

    if coverage <= 0.0 {
        discard;
    }

    return premultiplied(input.color, coverage);
}
`;

export const ELLIPSE_RING_SHADER = /* wgsl */`
${COMMON_UNIFORMS}

struct VertexInput {
    @builtin(vertex_index) vertexIndex : u32,
    @location(0) center : vec2<f32>,
    @location(1) axisX : vec2<f32>,
    @location(2) axisY : vec2<f32>,
    @location(3) innerRatio : f32,
    @location(4) color : vec4<f32>,
};

struct VertexOutput {
    @builtin(position) position : vec4<f32>,
    @location(0) local : vec2<f32>,
    @location(1) innerRatio : f32,
    @location(2) color : vec4<f32>,
};

@vertex
fn vs_main(input : VertexInput) -> VertexOutput {
    let local = quad_position(input.vertexIndex);
    let world =
        input.center +
        input.axisX * local.x +
        input.axisY * local.y;

    var output : VertexOutput;
    output.position = world_to_clip(world);
    output.local = local;
    output.innerRatio = input.innerRatio;
    output.color = input.color;
    return output;
}

@fragment
fn fs_main(input : VertexOutput) -> @location(0) vec4<f32> {
    let distance = length(input.local);
    let aa = max(fwidth(distance), 1e-5);

    let outerCoverage =
        1.0 - smoothstep(1.0 - aa, 1.0 + aa, distance);

    let innerCoverage = select(
        1.0,
        smoothstep(
            input.innerRatio - aa,
            input.innerRatio + aa,
            distance
        ),
        input.innerRatio > 0.0
    );

    let coverage = outerCoverage * innerCoverage;

    if coverage <= 0.0 {
        discard;
    }

    return premultiplied(input.color, coverage);
}
`;

export const PARTIAL_ARC_SHADER = /* wgsl */`
${COMMON_UNIFORMS}

struct VertexInput {
    @builtin(vertex_index) vertexIndex : u32,
    @location(0) center : vec2<f32>,
    @location(1) axisX : vec2<f32>,
    @location(2) axisY : vec2<f32>,
    @location(3) innerRatio : f32,
    @location(4) startDirection : vec2<f32>,
    @location(5) endDirection : vec2<f32>,
    @location(6) majorArc : u32,
    @location(7) color : vec4<f32>,
};

struct VertexOutput {
    @builtin(position) position : vec4<f32>,
    @location(0) local : vec2<f32>,
    @location(1) innerRatio : f32,
    @location(2) startDirection : vec2<f32>,
    @location(3) endDirection : vec2<f32>,
    @location(4) @interpolate(flat) majorArc : u32,
    @location(5) color : vec4<f32>,
};

fn cross2(a : vec2<f32>, b : vec2<f32>) -> f32 {
    return a.x * b.y - a.y * b.x;
}

@vertex
fn vs_main(input : VertexInput) -> VertexOutput {
    let local = quad_position(input.vertexIndex);
    let world =
        input.center +
        input.axisX * local.x +
        input.axisY * local.y;

    var output : VertexOutput;
    output.position = world_to_clip(world);
    output.local = local;
    output.innerRatio = input.innerRatio;
    output.startDirection = input.startDirection;
    output.endDirection = input.endDirection;
    output.majorArc = input.majorArc;
    output.color = input.color;
    return output;
}

@fragment
fn fs_main(input : VertexOutput) -> @location(0) vec4<f32> {
    let distance = length(input.local);
    let radialAA = max(fwidth(distance), 1e-5);

    let outerCoverage =
        1.0 - smoothstep(
            1.0 - radialAA,
            1.0 + radialAA,
            distance
        );

    let innerCoverage = select(
        1.0,
        smoothstep(
            input.innerRatio - radialAA,
            input.innerRatio + radialAA,
            distance
        ),
        input.innerRatio > 0.0
    );

    let sideStart =
        cross2(input.startDirection, input.local);

    let sideEnd =
        cross2(input.local, input.endDirection);

    let angularSignedDistance = select(
        min(sideStart, sideEnd),
        max(sideStart, sideEnd),
        input.majorArc != 0u
    );

    let angularAA = max(
        max(fwidth(sideStart), fwidth(sideEnd)),
        1e-5
    );

    let angularCoverage = smoothstep(
        -angularAA,
        angularAA,
        angularSignedDistance
    );

    let coverage =
        outerCoverage *
        innerCoverage *
        angularCoverage;

    if coverage <= 0.0 {
        discard;
    }

    return premultiplied(input.color, coverage);
}
`;

export const ARC_SEGMENT_SHADER = /* wgsl */`
${COMMON_UNIFORMS}

struct VertexInput {
    @builtin(vertex_index) vertexIndex : u32,
    @location(0) center : vec2<f32>,
    @location(1) axisX : vec2<f32>,
    @location(2) axisY : vec2<f32>,
    @location(3) middleDirection : vec2<f32>,
    @location(4) chordOffset : f32,
    @location(5) color : vec4<f32>,
};

struct VertexOutput {
    @builtin(position) position : vec4<f32>,
    @location(0) local : vec2<f32>,
    @location(1) middleDirection : vec2<f32>,
    @location(2) chordOffset : f32,
    @location(3) color : vec4<f32>,
};

@vertex
fn vs_main(input : VertexInput) -> VertexOutput {
    let local = quad_position(input.vertexIndex);
    let world =
        input.center +
        input.axisX * local.x +
        input.axisY * local.y;

    var output : VertexOutput;
    output.position = world_to_clip(world);
    output.local = local;
    output.middleDirection = input.middleDirection;
    output.chordOffset = input.chordOffset;
    output.color = input.color;
    return output;
}

@fragment
fn fs_main(input : VertexOutput) -> @location(0) vec4<f32> {
    let distance = length(input.local);
    let radialAA = max(fwidth(distance), 1e-5);

    let outerCoverage =
        1.0 - smoothstep(
            1.0 - radialAA,
            1.0 + radialAA,
            distance
        );

    let chordDistance =
        dot(input.middleDirection, input.local) -
        input.chordOffset;

    let chordAA =
        max(fwidth(chordDistance), 1e-5);

    let chordCoverage =
        smoothstep(
            -chordAA,
            chordAA,
            chordDistance
        );

    let coverage =
        outerCoverage *
        chordCoverage;

    if coverage <= 0.0 {
        discard;
    }

    return premultiplied(input.color, coverage);
}
`;
