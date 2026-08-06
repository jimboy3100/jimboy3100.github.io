/*
 * cell_interp.c — WASM batch cell interpolation + sort
 *
 * Replaces the per-cell JS moveCell() loop with a single WASM call
 * that interpolates ALL cells in flat typed-array memory.
 *
 * Layout per cell (10 floats = 40 bytes):
 *   [0] startX   [1] startY   [2] targetX  [3] targetY
 *   [4] startSize [5] targetSize [6] updateTime [7] x_out
 *   [8] y_out    [9] size_out
 *
 * The JS side fills slots 0-6, WASM computes 7-9 (interpolated output).
 *
 * Compile:
 *   emcc cell_interp.c -O3 -s WASM=1 -s STANDALONE_WASM=1 \
 *        -s EXPORTED_FUNCTIONS="['_interp_cells','_sort_cells','_get_buffer','_get_sort_buffer','_init']" \
 *        --no-entry -o cell_interp.wasm
 */

#define MAX_CELLS 4096
#define FLOATS_PER_CELL 10

/* Flat buffer for cell data */
static float cells[MAX_CELLS * FLOATS_PER_CELL];

/* Sort index buffer: stores cell indices sorted by size */
static int sort_buf[MAX_CELLS];
/* Sort key buffer: size values for comparison */
static float sort_keys[MAX_CELLS];

int init(void) {
    return MAX_CELLS;
}

float* get_buffer(void) {
    return cells;
}

int* get_sort_buffer(void) {
    return sort_buf;
}

/*
 * interp_cells: batch-interpolate all cells
 *
 * @param count      number of cells
 * @param now        current time (LM.time)
 * @param anim       animation duration (defaultmapsettings.animation || 120)
 * @param suck_anim  1 if suckAnimation enabled, 0 otherwise
 *
 * For each cell, computes:
 *   delay = clamp((now - updateTime) / anim, 0, 1)
 *   x_out = startX + (targetX - startX) * delay
 *   y_out = startY + (targetY - startY) * delay
 *   size_out = startSize + (targetSize - startSize) * delay  (or suck variant)
 *
 * Returns the number of cells processed.
 */
int interp_cells(int count, float now, float anim, int suck_anim) {
    if (count > MAX_CELLS) count = MAX_CELLS;
    if (anim <= 0.0f) anim = 120.0f;

    float inv_anim = 1.0f / anim;
    float inv_800 = 1.0f / 800.0f;

    for (int i = 0; i < count; i++) {
        float *c = &cells[i * FLOATS_PER_CELL];
        float startX   = c[0];
        float startY   = c[1];
        float targetX  = c[2];
        float targetY  = c[3];
        float startSz  = c[4];
        float targetSz = c[5];
        float updTime  = c[6];

        float time = now - updTime;
        float delay = time * inv_anim;

        /* Clamp delay to [0, 1] */
        if (delay < 0.0f) delay = 0.0f;
        else if (delay > 1.0f) delay = 1.0f;

        /* Lerp position */
        c[7] = startX + (targetX - startX) * delay;
        c[8] = startY + (targetY - startY) * delay;

        /* Lerp size */
        if (!suck_anim) {
            c[9] = startSz + (targetSz - startSz) * delay;
        } else {
            float sz = startSz + (targetSz - startSz) * (time * inv_800);
            if (sz < 0.0f) sz = 0.0f;
            c[9] = sz;
        }
    }
    return count;
}

/*
 * sort_cells: insertion sort by size (ascending), with ID tiebreak.
 *
 * @param count  number of cells
 * @param ids    pointer to int32 array of cell IDs (parallel with cells buffer)
 *
 * Fills sort_buf with indices sorted by (size ASC, id ASC).
 * Insertion sort is optimal here: cells are nearly sorted between frames.
 */
int sort_cells(int count, int *ids) {
    if (count > MAX_CELLS) count = MAX_CELLS;

    /* Initialize index array and extract sort keys (current size = slot 9) */
    for (int i = 0; i < count; i++) {
        sort_buf[i] = i;
        sort_keys[i] = cells[i * FLOATS_PER_CELL + 9]; /* size_out */
    }

    /* Insertion sort — O(N) on nearly-sorted data */
    for (int i = 1; i < count; i++) {
        int tmpIdx = sort_buf[i];
        float tmpSize = sort_keys[tmpIdx];
        int tmpId = ids[tmpIdx];
        int j = i - 1;

        while (j >= 0) {
            int jIdx = sort_buf[j];
            float jSize = sort_keys[jIdx];
            if (jSize > tmpSize || (jSize == tmpSize && ids[jIdx] > tmpId)) {
                sort_buf[j + 1] = sort_buf[j];
                j--;
            } else {
                break;
            }
        }
        sort_buf[j + 1] = tmpIdx;
    }

    return count;
}
