/*
 * quadtree.c — WASM flat-memory PointQuadTree
 *
 * Zero-allocation quadtree using a pre-allocated node pool in WASM
 * linear memory. Rebuilds every frame without GC pressure.
 *
 * Compiled with: emcc quadtree.c -O3 -s STANDALONE_WASM ...
 */

#include <stdint.h>

/* ── Configuration ──────────────────────────────────────────────────── */
#define MAX_NODES    16384   /* pre-allocated node pool */
#define MAX_POINTS   32768   /* max points across all nodes */
#define NODE_CAP     32      /* max points per leaf before split */
#define GROWTH       1.1f    /* capacity growth on split depth */

/* ── Point storage ──────────────────────────────────────────────────── */
typedef struct {
    float x;
    float y;
    int32_t id;      /* reference back to JS cell index */
} Point;

static Point points[MAX_POINTS];
static int32_t point_count = 0;

/* ── Node storage (flat array, no malloc) ───────────────────────────── */
typedef struct {
    float x, y, w, h;
    int32_t point_start;  /* index into points[] */
    int32_t point_count;  /* number of points in this leaf */
    int32_t child_idx;    /* index of first child in nodes[] (-1 if leaf) */
    int32_t max_points;   /* capacity before split (grows with depth) */
} QTNode;

static QTNode nodes[MAX_NODES];
static int32_t node_count = 0;

/* ── Query results ──────────────────────────────────────────────────── */
#define MAX_RESULTS 4096
static int32_t result_ids[MAX_RESULTS];
static int32_t result_count = 0;

/* ── Export result buffer pointer ───────────────────────────────────── */
__attribute__((used))
int32_t *get_result_buf(void) { return result_ids; }

/* ── Initialize root node ──────────────────────────────────────────── */
__attribute__((used))
void qt_init(float x, float y, float w, float h) {
    node_count = 1;
    point_count = 0;
    result_count = 0;

    nodes[0].x = x;
    nodes[0].y = y;
    nodes[0].w = w;
    nodes[0].h = h;
    nodes[0].point_start = 0;
    nodes[0].point_count = 0;
    nodes[0].child_idx = -1;
    nodes[0].max_points = NODE_CAP;
}

/* ── Clear (reset pools) ───────────────────────────────────────────── */
__attribute__((used))
void qt_clear(void) {
    node_count = 0;
    point_count = 0;
    result_count = 0;
}

/* ── Internal: split a leaf node into 4 children ───────────────────── */
static void split_node(int32_t ni) {
    if (node_count + 4 > MAX_NODES) return; /* pool exhausted */

    QTNode *n = &nodes[ni];
    float hw = n->w * 0.5f;
    float hh = n->h * 0.5f;
    int32_t ci = node_count;
    n->child_idx = ci;
    node_count += 4;

    int child_cap = (int)(n->max_points * GROWTH);

    /* TL=0, TR=1, BL=2, BR=3 */
    for (int r = 0; r < 2; r++) {
        for (int c = 0; c < 2; c++) {
            int idx = ci + c + r * 2;
            nodes[idx].x = n->x + c * hw;
            nodes[idx].y = n->y + r * hh;
            nodes[idx].w = hw;
            nodes[idx].h = hh;
            nodes[idx].point_start = 0;
            nodes[idx].point_count = 0;
            nodes[idx].child_idx = -1;
            nodes[idx].max_points = child_cap;
        }
    }

    /* Re-insert points from parent into children */
    float midx = n->x + hw;
    float midy = n->y + hh;
    for (int i = 0; i < n->point_count; i++) {
        Point *p = &points[n->point_start + i];
        int col = p->x > midx ? 1 : 0;
        int row = p->y > midy ? 1 : 0;
        int child = ci + col + row * 2;
        QTNode *cn = &nodes[child];

        /* Add point to child — points are contiguous per-node */
        if (cn->point_count == 0) {
            cn->point_start = point_count;
        }
        if (point_count < MAX_POINTS) {
            points[point_count++] = *p;
            cn->point_count++;
        }
    }

    n->point_count = 0; /* parent no longer holds points */
}

/* ── Insert a point ────────────────────────────────────────────────── */
static void insert_into(int32_t ni, float px, float py, int32_t pid) {
    QTNode *n = &nodes[ni];

    /* Bounds check */
    if (px < n->x || px > n->x + n->w || py < n->y || py > n->y + n->h)
        return;

    if (n->child_idx >= 0) {
        /* Internal node — route to correct child */
        float midx = n->x + n->w * 0.5f;
        float midy = n->y + n->h * 0.5f;
        int col = px > midx ? 1 : 0;
        int row = py > midy ? 1 : 0;
        insert_into(n->child_idx + col + row * 2, px, py, pid);
    } else {
        /* Leaf node — add point */
        if (n->point_count == 0) {
            n->point_start = point_count;
        }
        if (point_count < MAX_POINTS) {
            points[point_count].x = px;
            points[point_count].y = py;
            points[point_count].id = pid;
            point_count++;
            n->point_count++;
        }

        /* Split if over capacity and node is large enough */
        if (n->point_count > n->max_points && n->w > 1.0f) {
            split_node(ni);
        }
    }
}

__attribute__((used))
void qt_insert(float px, float py, int32_t pid) {
    insert_into(0, px, py, pid);
}

/* ── Bulk insert: array of (x, y, id) triples ─────────────────────── */
__attribute__((used))
void qt_bulk_insert(const float *data, int32_t count) {
    for (int32_t i = 0; i < count; i++) {
        float px = data[i * 3];
        float py = data[i * 3 + 1];
        int32_t pid = (int32_t)data[i * 3 + 2];
        insert_into(0, px, py, pid);
    }
}

/* ── Query: find all points within an AABB ─────────────────────────── */
static void query_node(int32_t ni, float ax, float ay, float aw, float ah) {
    QTNode *n = &nodes[ni];

    /* AABB overlap test */
    if (ax >= n->x + n->w || ax + aw <= n->x ||
        ay >= n->y + n->h || ay + ah <= n->y)
        return;

    if (n->child_idx >= 0) {
        /* Internal — recurse children */
        for (int i = 0; i < 4 && result_count < MAX_RESULTS; i++) {
            query_node(n->child_idx + i, ax, ay, aw, ah);
        }
    } else {
        /* Leaf — check points */
        for (int i = 0; i < n->point_count && result_count < MAX_RESULTS; i++) {
            Point *p = &points[n->point_start + i];
            if (p->x >= ax && p->x <= ax + aw &&
                p->y >= ay && p->y <= ay + ah) {
                result_ids[result_count++] = p->id;
            }
        }
    }
}

__attribute__((used))
int32_t qt_query(float ax, float ay, float aw, float ah) {
    result_count = 0;
    query_node(0, ax, ay, aw, ah);
    return result_count;
}

/* ── Some: returns 1 if ANY point in AABB matches (early exit) ────── */
static int some_node(int32_t ni, float ax, float ay, float aw, float ah) {
    QTNode *n = &nodes[ni];

    if (ax >= n->x + n->w || ax + aw <= n->x ||
        ay >= n->y + n->h || ay + ah <= n->y)
        return 0;

    if (n->child_idx >= 0) {
        for (int i = 0; i < 4; i++) {
            if (some_node(n->child_idx + i, ax, ay, aw, ah))
                return 1;
        }
    } else {
        for (int i = 0; i < n->point_count; i++) {
            Point *p = &points[n->point_start + i];
            if (p->x >= ax && p->x <= ax + aw &&
                p->y >= ay && p->y <= ay + ah) {
                /* Store the matching point ID for JS to inspect */
                result_ids[0] = p->id;
                result_count = 1;
                return 1;
            }
        }
    }
    return 0;
}

__attribute__((used))
int32_t qt_some(float ax, float ay, float aw, float ah) {
    result_count = 0;
    return some_node(0, ax, ay, aw, ah);
}

/* ── Stats for debugging ───────────────────────────────────────────── */
__attribute__((used))
int32_t qt_node_count(void) { return node_count; }

__attribute__((used))
int32_t qt_point_count(void) { return point_count; }
