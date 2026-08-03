const COMMON = /* wgsl */`
struct FrameUniforms {
    resolution : vec2<f32>,
    aaPixels   : f32,
    _padding   : f32,
};

@group(0) @binding(0)
var<uniform> frame : FrameUniforms;

const FLAG_MAJOR    : u32 = 1u;
const FLAG_CCW      : u32 = 2u;
const FLAG_FULL     : u32 = 4u;
const FLAG_SEGMENT  : u32 = 8u;
const FLAG_ORIENTED : u32 = 16u;

fn quad_corner(index : u32) -> vec2<f32> {
    switch index {
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

fn quad_uv(index : u32) -> vec2<f32> {
    return quad_corner(index) * 0.5 +
        vec2<f32>(0.5);
}

fn world_to_clip(
    world : vec2<f32>
) -> vec4<f32> {
    let safeResolution = max(
        frame.resolution,
        vec2<f32>(1.0)
    );

    var clip =
        world / safeResolution * 2.0 -
        vec2<f32>(1.0);

    clip.y = -clip.y;

    return vec4<f32>(
        clip,
        0.0,
        1.0
    );
}

fn cross2(
    a : vec2<f32>,
    b : vec2<f32>
) -> f32 {
    return a.x * b.y -
        a.y * b.x;
}

fn safe_normalize(
    v : vec2<f32>,
    fallback : vec2<f32>
) -> vec2<f32> {
    let lengthSquared =
        dot(v, v);

    return select(
        fallback,
        v * inverseSqrt(lengthSquared),
        lengthSquared > 1e-12
    );
}

fn arc_middle(
    startDirection : vec2<f32>,
    endDirection : vec2<f32>,
    flags : u32
) -> vec2<f32> {
    let ccw =
        (flags & FLAG_CCW) != 0u;

    let direction =
        select(
            1.0,
            -1.0,
            ccw
        );

    let halfTurnFallback =
        vec2<f32>(
            -startDirection.y * direction,
            startDirection.x * direction
        );

    let minorMiddle =
        safe_normalize(
            startDirection +
                endDirection,
            halfTurnFallback
        );

    let major =
        (flags & FLAG_MAJOR) != 0u;

    return select(
        minorMiddle,
        -minorMiddle,
        major
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

fn angular_coverage(
    local : vec2<f32>,
    startDirection : vec2<f32>,
    endDirection : vec2<f32>,
    flags : u32
) -> f32 {
    if (
        (flags & FLAG_FULL) != 0u
    ) {
        return 1.0;
    }

    let ccw =
        (flags & FLAG_CCW) != 0u;

    let direction =
        select(
            1.0,
            -1.0,
            ccw
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

    let major =
        (flags & FLAG_MAJOR) != 0u;

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
            major
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

fn segment_coverage(
    local : vec2<f32>,
    startDirection : vec2<f32>,
    endDirection : vec2<f32>,
    flags : u32
) -> f32 {
    let major =
        (flags & FLAG_MAJOR) != 0u;

    let middle =
        arc_middle(
            startDirection,
            endDirection,
            flags
        );

    let endpointDot =
        clamp(
            dot(
                startDirection,
                endDirection
            ),
            -1.0,
            1.0
        );

    let minorHalfCosine =
        sqrt(
            max(
                0.0,
                (
                    1.0 +
                    endpointDot
                ) * 0.5
            )
        );

    let chordOffset =
        select(
            minorHalfCosine,
            -minorHalfCosine,
            major
        );

    let signedDistance =
        dot(
            middle,
            local
        ) -
        chordOffset;

    let aa =
        max(
            fwidth(
                signedDistance
            ),
            1e-6
        );

    return smoothstep(
        -aa,
        aa,
        signedDistance
    );
}

fn premultiplied(
    color : vec4<f32>,
    coverage : f32
) -> vec4<f32> {
    let alpha =
        color.a *
        clamp(
            coverage,
            0.0,
            1.0
        );

    return vec4<f32>(
        color.rgb * alpha,
        alpha
    );
}
`;

export const ARC_SHADER = /* wgsl */`
${COMMON}

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
    let safeRadius =
        max(
            abs(input.radius),
            1e-4
        );

    // snorm16 bounds have a maximum local quantization error of 1 / 32767.
    // Include that error in the padding so extremely large arcs cannot clip.
    let padding =
        frame.aaPixels /
            safeRadius +
        0.00003051944;

    let boundsMin =
        input.bounds.xy -
        vec2<f32>(padding);

    let boundsMax =
        input.bounds.zw +
        vec2<f32>(padding);

    let boundedPoint =
        mix(
            boundsMin,
            boundsMax,
            quad_uv(
                input.vertexIndex
            )
        );

    var local = boundedPoint;

    if (
        (
            input.flags &
            FLAG_ORIENTED
        ) != 0u
    ) {
        let middle =
            arc_middle(
                input.startDirection,
                input.endDirection,
                input.flags
            );

        let tangent =
            vec2<f32>(
                -middle.y,
                middle.x
            );

        local =
            middle *
                boundedPoint.x +
            tangent *
                boundedPoint.y;
    }

    let world =
        input.center +
        local *
            input.radius;

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
    let radial =
        radial_coverage(
            input.local,
            input.innerRatio
        );

    var shapeCoverage = 1.0;

    if (
        (
            input.flags &
            FLAG_SEGMENT
        ) != 0u &&
        (
            input.flags &
            FLAG_FULL
        ) == 0u
    ) {
        shapeCoverage =
            segment_coverage(
                input.local,
                input.startDirection,
                input.endDirection,
                input.flags
            );
    } else {
        shapeCoverage =
            angular_coverage(
                input.local,
                input.startDirection,
                input.endDirection,
                input.flags
            );
    }

    let coverage =
        radial *
        shapeCoverage;

    if (coverage <= 0.0) {
        discard;
    }

    return premultiplied(
        input.color,
        coverage
    );
}
`;

export default ARC_SHADER;

// Sparse retained updates: one contiguous CPU upload followed by a GPU scatter.
// The first u32 is the live patch count. Every patch after it contains one
// destination index followed by the exact ten u32 words of an arc instance.
export const PATCH_SHADER = /* wgsl */`
@group(0) @binding(0)
var<storage, read>
patchWords : array<u32>;

@group(0) @binding(1)
var<storage, read_write>
instanceWords : array<u32>;

@compute
@workgroup_size(64)
fn cs_main(
    @builtin(global_invocation_id)
    globalId : vec3<u32>
) {
    let patchIndex =
        globalId.x;

    let patchCount =
        patchWords[0];

    if (
        patchIndex >=
        patchCount
    ) {
        return;
    }

    let patchBase =
        1u +
        patchIndex *
            11u;

    let destinationBase =
        patchWords[patchBase] *
        10u;

    instanceWords[
        destinationBase
    ] =
        patchWords[
            patchBase + 1u
        ];

    instanceWords[
        destinationBase + 1u
    ] =
        patchWords[
            patchBase + 2u
        ];

    instanceWords[
        destinationBase + 2u
    ] =
        patchWords[
            patchBase + 3u
        ];

    instanceWords[
        destinationBase + 3u
    ] =
        patchWords[
            patchBase + 4u
        ];

    instanceWords[
        destinationBase + 4u
    ] =
        patchWords[
            patchBase + 5u
        ];

    instanceWords[
        destinationBase + 5u
    ] =
        patchWords[
            patchBase + 6u
        ];

    instanceWords[
        destinationBase + 6u
    ] =
        patchWords[
            patchBase + 7u
        ];

    instanceWords[
        destinationBase + 7u
    ] =
        patchWords[
            patchBase + 8u
        ];

    instanceWords[
        destinationBase + 8u
    ] =
        patchWords[
            patchBase + 9u
        ];

    instanceWords[
        destinationBase + 9u
    ] =
        patchWords[
            patchBase + 10u
        ];
}
`;