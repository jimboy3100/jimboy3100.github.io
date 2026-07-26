/*
 * ogario_client_wasm.c - High-Performance Client WebAssembly Engine for LegendMod
 * Compiles to WebAssembly (Wasm) with 128-bit SIMD for browser execution.
 */

#include <stdint.h>
#include <stdbool.h>

#if defined(__wasm_simd128__)
#include <wasm_simd128.h>
#endif

#define MAX_CLIENT_CELLS 65536

typedef struct {
    float x;
    float y;
    float radius;
    uint32_t color;
    uint8_t flags;
} ClientCellData;

static ClientCellData g_cells[MAX_CLIENT_CELLS];
static int32_t g_visible_indices[MAX_CLIENT_CELLS];

/* Fast SIMD / Vectorized AABB Viewport Frustum Culling */
int32_t wasm_cull_cells(const float* coords, int32_t count, float minX, float minY, float maxX, float maxY) {
    int32_t visible_count = 0;
    
#if defined(__wasm_simd128__)
    v128_t v_minX = vec_splat_f32x4(minX);
    v128_t v_minY = vec_splat_f32x4(minY);
    v128_t v_maxX = vec_splat_f32x4(maxX);
    v128_t v_maxY = vec_splat_f32x4(maxY);

    int32_t i = 0;
    for (; i <= count - 4; i += 4) {
        // Load 4 x coordinates, 4 y coordinates, 4 radii
        v128_t vx = wasm_v128_load(&coords[i * 3]);
        v128_t vy = wasm_v128_load(&coords[i * 3 + 4]);
        v128_t vr = wasm_v128_load(&coords[i * 3 + 8]);

        v128_t bbox_minX = f32x4_sub(vx, vr);
        v128_t bbox_maxX = f32x4_add(vx, vr);
        v128_t bbox_minY = f32x4_sub(vy, vr);
        v128_t bbox_maxY = f32x4_add(vy, vr);

        // Bounds test
        v128_t pass_x = wasm_v128_and(f32x4_ge(bbox_maxX, v_minX), f32x4_le(bbox_minX, v_maxX));
        v128_t pass_y = wasm_v128_and(f32x4_ge(bbox_maxY, v_minY), f32x4_le(bbox_minY, v_maxY));
        v128_t mask = wasm_v128_and(pass_x, pass_y);

        uint32_t bitmask = i32x4_bitmask(mask);
        if (bitmask & 1) g_visible_indices[visible_count++] = i;
        if (bitmask & 2) g_visible_indices[visible_count++] = i + 1;
        if (bitmask & 4) g_visible_indices[visible_count++] = i + 2;
        if (bitmask & 8) g_visible_indices[visible_count++] = i + 3;
    }
    for (; i < count; i++) {
        float x = coords[i * 3];
        float y = coords[i * 3 + 1];
        float r = coords[i * 3 + 2];
        if (x + r >= minX && x - r <= maxX && y + r >= minY && y - r <= maxY) {
            g_visible_indices[visible_count++] = i;
        }
    }
#else
    for (int32_t i = 0; i < count; i++) {
        float x = coords[i * 3];
        float y = coords[i * 3 + 1];
        float r = coords[i * 3 + 2];
        if (x + r >= minX && x - r <= maxX && y + r >= minY && y - r <= maxY) {
            g_visible_indices[visible_count++] = i;
        }
    }
#endif

    return visible_count;
}

/* Inlined O(N) QuickSelect for Client Viewport Truncation */
static inline void swap_f(float* a, float* b) { float t = *a; *a = *b; *b = t; }
static inline void swap_i(int32_t* a, int32_t* b) { int32_t t = *a; *a = *b; *b = t; }

int32_t wasm_quickselect_cells(float* dists, int32_t* ids, int32_t n, int32_t k) {
    if (n <= 0 || k <= 0) return 0;
    if (k >= n) return n;

    int32_t left = 0, right = n - 1;
    while (left < right) {
        float pivot = dists[right];
        int32_t i = left - 1;
        for (int32_t j = left; j < right; j++) {
            if (dists[j] <= pivot) {
                i++;
                swap_f(&dists[i], &dists[j]);
                swap_i(&ids[i], &ids[j]);
            }
        }
        swap_f(&dists[i + 1], &dists[right]);
        swap_i(&ids[i + 1], &ids[right]);
        int32_t pivotIdx = i + 1;

        if (pivotIdx == k) break;
        if (pivotIdx < k) left = pivotIdx + 1;
        else right = pivotIdx - 1;
    }
    return k;
}
