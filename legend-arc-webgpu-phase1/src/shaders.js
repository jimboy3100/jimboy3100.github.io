const COMMON_UNIFORMS = /* wgsl */`
struct FrameUniforms {
    resolution : vec2<f32>,
    aaPixels   : f32,
    _padding   : f32,
};

@group(0) @binding(0)
var<uniform> frame : FrameUniforms;

fn quad_corner(vertexIndex : u32) -> vec2<f32> {
    switch vertexIndex {
        case 0u: {
            return vec2<f32>(-1.0, -1.0);
        }
        case 1u: {
            return vec2<f32>(1.0, -1.0);
        }
        case 2u: {
            return vec2<f32>(-1.0, 1.0);
        }
        default: {
            return vec2<f32>(1.0, 1.0);
        }
    }
}

fn quad_uv(vertexIndex : u32) -> vec2<f32> {
    return quad_corner(vertexIndex) * 0.5 +
        vec2<f32>(0.5, 0.5);
}

fn world_to_clip(world : vec2<f32>) -> vec4<f32> {
    let safeResolution = max(
        frame.resolution,
        vec2<f32>(1.0, 1.0)
    );

    var clip =
        world / safeResolution * 2.0 -
        vec2<f32>(1.0, 1.0);

    clip.y = -clip.y;

    return vec4<f32>(
        clip,
        0.0,
        1.0
    );
}

fn premultiplied(
    color : vec4<f32>,
    coverage : f32
) -> vec4<f32> {
    let alpha =
        color.a *
        clamp(coverage, 0.0, 1.0);

    return vec4<f32>(
        color.rgb * alpha,
        alpha
    );
}

fn radial_coverage(
    local : vec2<f32>,
    innerRatio : f32
) -> f32 {
    let radiusSquared =
        dot(local, local);

    let aa =
        max(
            fwidth(radiusSquared),
            1e-6
        );

    let outerCoverage =
        1.0 -
        smoothstep(
            1.0 - aa,
            1.0 + aa,
            radiusSquared
        );

    let innerSquared =
        innerRatio * innerRatio;

    let innerCoverage =
        select(
            1.0,
            smoothstep(
                innerSquared - aa,
                innerSquared + aa,
                radiusSquared
            ),
            innerRatio > 0.0
        );

    return outerCoverage *
        innerCoverage;
}

fn conservative_local_padding(
    axisX : vec2<f32>,
    axisY : vec2<f32>
) -> f32 {
    let determinant =
        abs(
            axisX.x * axisY.y -
            axisX.y * axisY.x
        );

    let frobenius =
        sqrt(
            max(
                dot(axisX, axisX) +
                dot(axisY, axisY),
                1e-12
            )
        );

    let conservativeMinScale =
        max(
            determinant / frobenius,
            1e-4
        );

    return frame.aaPixels /
        conservativeMinScale;
}
`;

const ARC_HELPERS = /* wgsl */`
fn cross2(
    a : vec2<f32>,
    b : vec2<f32>
) -> f32 {
    return a.x * b.y -
        a.y * b.x;
}

fn angular_coverage(
    local : vec2<f32>,
    startDirection : vec2<f32>,
    endDirection : vec2<f32>,
    flags : u32
) -> f32 {
    let anticlockwise =
        (flags & 2u) != 0u;

    let direction =
        select(
            1.0,
            -1.0,
            anticlockwise
        );

    let sideStart =
        direction *
        cross2(
            startDirection,
            local
        );

    let sideEnd =
        direction *
        cross2(
            local,
            endDirection
        );

    let majorArc =
        (flags & 1u) != 0u;

    let signedDistance =
        select(
            min(
                sideStart,
                sideEnd
            ),
            max(
                sideStart,
                sideEnd
            ),
            majorArc
        );

    let aa =
        max(
            max(
                fwidth(sideStart),
                fwidth(sideEnd)
            ),
            1e-6
        );

    return smoothstep(
        -aa,
        aa,
        signedDistance
    );
}
`;

export const CIRCLE_SHADER = /* wgsl */`
${COMMON_UNIFORMS}

struct VertexInput {
    @builtin(vertex_index)
    vertexIndex : u32,

    @location(0)
    center : vec2<f32>,

    @location(1)
    radius : f32,

    @location(2)
    innerRatio : f32,

    @location(3)
    color : vec4<f32>,
};

struct VertexOutput {
    @builtin(position)
    position : vec4<f32>,

    @location(0)
    local : vec2<f32>,

    @location(1)
    innerRatio : f32,

    @location(2)
    color : vec4<f32>,
};

@vertex
fn vs_main(
    input : VertexInput
) -> VertexOutput {
    let safeRadius =
        max(
            abs(input.radius),
            1e-4
        );

    let padding =
        frame.aaPixels /
        safeRadius;

    let local =
        quad_corner(
            input.vertexIndex
        ) *
        (1.0 + padding);

    let world =
        input.center +
        local * input.radius;

    var output : VertexOutput;

    output.position =
        world_to_clip(world);

    output.local =
        local;

    output.innerRatio =
        input.innerRatio;

    output.color =
        input.color;

    return output;
}

@fragment
fn fs_main(
    input : VertexOutput
) -> @location(0) vec4<f32> {
    let coverage =
        radial_coverage(
            input.local,
            input.innerRatio
        );

    if coverage <= 0.0 {
        discard;
    }

    return premultiplied(
        input.color,
        coverage
    );
}
`;

export const ELLIPSE_RING_SHADER = /* wgsl */`
${COMMON_UNIFORMS}

struct VertexInput {
    @builtin(vertex_index)
    vertexIndex : u32,

    @location(0)
    center : vec2<f32>,

    @location(1)
    axisX : vec2<f32>,

    @location(2)
    axisY : vec2<f32>,

    @location(3)
    innerRatio : f32,

    @location(4)
    color : vec4<f32>,
};

struct VertexOutput {
    @builtin(position)
    position : vec4<f32>,

    @location(0)
    local : vec2<f32>,

    @location(1)
    innerRatio : f32,

    @location(2)
    color : vec4<f32>,
};

@vertex
fn vs_main(
    input : VertexInput
) -> VertexOutput {
    let padding =
        conservative_local_padding(
            input.axisX,
            input.axisY
        );

    let local =
        quad_corner(
            input.vertexIndex
        ) *
        (1.0 + padding);

    let world =
        input.center +
        input.axisX * local.x +
        input.axisY * local.y;

    var output : VertexOutput;

    output.position =
        world_to_clip(world);

    output.local =
        local;

    output.innerRatio =
        input.innerRatio;

    output.color =
        input.color;

    return output;
}

@fragment
fn fs_main(
    input : VertexOutput
) -> @location(0) vec4<f32> {
    let coverage =
        radial_coverage(
            input.local,
            input.innerRatio
        );

    if coverage <= 0.0 {
        discard;
    }

    return premultiplied(
        input.color,
        coverage
    );
}
`;

export const CIRCLE_PARTIAL_ARC_SHADER = /* wgsl */`
${COMMON_UNIFORMS}
${ARC_HELPERS}

struct VertexInput {
    @builtin(vertex_index)
    vertexIndex : u32,

    @location(0)
    center : vec2<f32>,

    @location(1)
    radius : f32,

    @location(2)
    innerRatio : f32,

    @location(3)
    startDirection : vec2<f32>,

    @location(4)
    endDirection : vec2<f32>,

    @location(5)
    flags : u32,

    @location(6)
    bounds : vec4<f32>,

    @location(7)
    color : vec4<f32>,
};

struct VertexOutput {
    @builtin(position)
    position : vec4<f32>,

    @location(0)
    local : vec2<f32>,

    @location(1)
    innerRatio : f32,

    @location(2)
    startDirection : vec2<f32>,

    @location(3)
    endDirection : vec2<f32>,

    @location(4)
    @interpolate(flat)
    flags : u32,

    @location(5)
    color : vec4<f32>,
};

@vertex
fn vs_main(
    input : VertexInput
) -> VertexOutput {
    let padding =
        frame.aaPixels /
        max(
            abs(input.radius),
            1e-4
        );

    let boundsMin =
        input.bounds.xy -
        vec2<f32>(padding);

    let boundsMax =
        input.bounds.zw +
        vec2<f32>(padding);

    let local =
        mix(
            boundsMin,
            boundsMax,
            quad_uv(
                input.vertexIndex
            )
        );

    let world =
        input.center +
        local * input.radius;

    var output : VertexOutput;

    output.position =
        world_to_clip(world);

    output.local =
        local;

    output.innerRatio =
        input.innerRatio;

    output.startDirection =
        input.startDirection;

    output.endDirection =
        input.endDirection;

    output.flags =
        input.flags;

    output.color =
        input.color;

    return output;
}

@fragment
fn fs_main(
    input : VertexOutput
) -> @location(0) vec4<f32> {
    let coverage =
        radial_coverage(
            input.local,
            input.innerRatio
        ) *
        angular_coverage(
            input.local,
            input.startDirection,
            input.endDirection,
            input.flags
        );

    if coverage <= 0.0 {
        discard;
    }

    return premultiplied(
        input.color,
        coverage
    );
}
`;

export const PARTIAL_ARC_SHADER = /* wgsl */`
${COMMON_UNIFORMS}
${ARC_HELPERS}

struct VertexInput {
    @builtin(vertex_index)
    vertexIndex : u32,

    @location(0)
    center : vec2<f32>,

    @location(1)
    axisX : vec2<f32>,

    @location(2)
    axisY : vec2<f32>,

    @location(3)
    innerRatio : f32,

    @location(4)
    startDirection : vec2<f32>,

    @location(5)
    endDirection : vec2<f32>,

    @location(6)
    flags : u32,

    @location(7)
    bounds : vec4<f32>,

    @location(8)
    color : vec4<f32>,
};

struct VertexOutput {
    @builtin(position)
    position : vec4<f32>,

    @location(0)
    local : vec2<f32>,

    @location(1)
    innerRatio : f32,

    @location(2)
    startDirection : vec2<f32>,

    @location(3)
    endDirection : vec2<f32>,

    @location(4)
    @interpolate(flat)
    flags : u32,

    @location(5)
    color : vec4<f32>,
};

@vertex
fn vs_main(
    input : VertexInput
) -> VertexOutput {
    let padding =
        conservative_local_padding(
            input.axisX,
            input.axisY
        );

    let boundsMin =
        input.bounds.xy -
        vec2<f32>(padding);

    let boundsMax =
        input.bounds.zw +
        vec2<f32>(padding);

    let local =
        mix(
            boundsMin,
            boundsMax,
            quad_uv(
                input.vertexIndex
            )
        );

    let world =
        input.center +
        input.axisX * local.x +
        input.axisY * local.y;

    var output : VertexOutput;

    output.position =
        world_to_clip(world);

    output.local =
        local;

    output.innerRatio =
        input.innerRatio;

    output.startDirection =
        input.startDirection;

    output.endDirection =
        input.endDirection;

    output.flags =
        input.flags;

    output.color =
        input.color;

    return output;
}

@fragment
fn fs_main(
    input : VertexOutput
) -> @location(0) vec4<f32> {
    let coverage =
        radial_coverage(
            input.local,
            input.innerRatio
        ) *
        angular_coverage(
            input.local,
            input.startDirection,
            input.endDirection,
            input.flags
        );

    if coverage <= 0.0 {
        discard;
    }

    return premultiplied(
        input.color,
        coverage
    );
}
`;

export const CIRCLE_ARC_SEGMENT_SHADER = /* wgsl */`
${COMMON_UNIFORMS}

struct VertexInput {
    @builtin(vertex_index)
    vertexIndex : u32,

    @location(0)
    center : vec2<f32>,

    @location(1)
    radius : f32,

    @location(2)
    middleDirection : vec2<f32>,

    @location(3)
    chordOffset : f32,

    @location(4)
    bounds : vec4<f32>,

    @location(5)
    color : vec4<f32>,
};

struct VertexOutput {
    @builtin(position)
    position : vec4<f32>,

    @location(0)
    local : vec2<f32>,

    @location(1)
    middleDirection : vec2<f32>,

    @location(2)
    chordOffset : f32,

    @location(3)
    color : vec4<f32>,
};

@vertex
fn vs_main(
    input : VertexInput
) -> VertexOutput {
    let padding =
        frame.aaPixels /
        max(
            abs(input.radius),
            1e-4
        );

    let boundsMin =
        input.bounds.xy -
        vec2<f32>(padding);

    let boundsMax =
        input.bounds.zw +
        vec2<f32>(padding);

    let local =
        mix(
            boundsMin,
            boundsMax,
            quad_uv(
                input.vertexIndex
            )
        );

    let world =
        input.center +
        local * input.radius;

    var output : VertexOutput;

    output.position =
        world_to_clip(world);

    output.local =
        local;

    output.middleDirection =
        input.middleDirection;

    output.chordOffset =
        input.chordOffset;

    output.color =
        input.color;

    return output;
}

@fragment
fn fs_main(
    input : VertexOutput
) -> @location(0) vec4<f32> {
    let radialCoverage =
        radial_coverage(
            input.local,
            0.0
        );

    let chordDistance =
        dot(
            input.middleDirection,
            input.local
        ) -
        input.chordOffset;

    let chordAA =
        max(
            fwidth(chordDistance),
            1e-6
        );

    let chordCoverage =
        smoothstep(
            -chordAA,
            chordAA,
            chordDistance
        );

    let coverage =
        radialCoverage *
        chordCoverage;

    if coverage <= 0.0 {
        discard;
    }

    return premultiplied(
        input.color,
        coverage
    );
}
`;

export const ARC_SEGMENT_SHADER = /* wgsl */`
${COMMON_UNIFORMS}

struct VertexInput {
    @builtin(vertex_index)
    vertexIndex : u32,

    @location(0)
    center : vec2<f32>,

    @location(1)
    axisX : vec2<f32>,

    @location(2)
    axisY : vec2<f32>,

    @location(3)
    middleDirection : vec2<f32>,

    @location(4)
    chordOffset : f32,

    @location(5)
    bounds : vec4<f32>,

    @location(6)
    color : vec4<f32>,
};

struct VertexOutput {
    @builtin(position)
    position : vec4<f32>,

    @location(0)
    local : vec2<f32>,

    @location(1)
    middleDirection : vec2<f32>,

    @location(2)
    chordOffset : f32,

    @location(3)
    color : vec4<f32>,
};

@vertex
fn vs_main(
    input : VertexInput
) -> VertexOutput {
    let padding =
        conservative_local_padding(
            input.axisX,
            input.axisY
        );

    let boundsMin =
        input.bounds.xy -
        vec2<f32>(padding);

    let boundsMax =
        input.bounds.zw +
        vec2<f32>(padding);

    let local =
        mix(
            boundsMin,
            boundsMax,
            quad_uv(
                input.vertexIndex
            )
        );

    let world =
        input.center +
        input.axisX * local.x +
        input.axisY * local.y;

    var output : VertexOutput;

    output.position =
        world_to_clip(world);

    output.local =
        local;

    output.middleDirection =
        input.middleDirection;

    output.chordOffset =
        input.chordOffset;

    output.color =
        input.color;

    return output;
}

@fragment
fn fs_main(
    input : VertexOutput
) -> @location(0) vec4<f32> {
    let radialCoverage =
        radial_coverage(
            input.local,
            0.0
        );

    let chordDistance =
        dot(
            input.middleDirection,
            input.local
        ) -
        input.chordOffset;

    let chordAA =
        max(
            fwidth(chordDistance),
            1e-6
        );

    let chordCoverage =
        smoothstep(
            -chordAA,
            chordAA,
            chordDistance
        );

    let coverage =
        radialCoverage *
        chordCoverage;

    if coverage <= 0.0 {
        discard;
    }

    return premultiplied(
        input.color,
        coverage
    );
}
`;