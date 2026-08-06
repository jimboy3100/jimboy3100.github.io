/*
 * cell_parser.c — WASM binary cell update packet parser
 *
 * Extracts numeric fields (id, x, y, size, flags, color, accountID)
 * from the agar.io/EL binary cell update format into flat typed arrays.
 * String fields (name, skin) are returned as byte offsets into the
 * original buffer so JS can decode them with TextDecoder.
 *
 * Compiled with: emcc cell_parser.c -O3 -s STANDALONE_WASM
 *                -s EXPORTED_FUNCTIONS="['_parse_cells','_get_eat_buf',
 *                '_get_cell_buf','_get_str_buf','_get_remove_buf','_malloc','_free']"
 *                --no-entry -o cell_parser.wasm
 */

#include <stdint.h>
#include <string.h>

/* ── Output buffers (statically allocated in WASM linear memory) ────── */

/* Eat events: pairs of (eater_id, victim_id) as uint32 */
#define MAX_EAT_EVENTS 512
static uint32_t eat_buf[MAX_EAT_EVENTS * 2];

/* Cell records: flat struct per cell */
/* Layout per cell (36 bytes, 9 x uint32 slots):
 *   [0] id        (u32)
 *   [1] x         (i32)
 *   [2] y         (i32)
 *   [3] size      (u16 in low 16) | flags (u8 in bits 16-23) | ext_flags (u8 in bits 24-31)
 *   [4] color_rgb (r in low 8, g in 8-15, b in 16-23, has_color in 24-31)
 *   [5] account_id(u32, 0 if none)
 *   [6] skin_off  (u16 offset into buffer) | skin_len (u16)
 *   [7] name_off  (u16 offset into buffer) | name_len (u16)
 *   [8] owner_id  (u16 low) | cell_type (i16 high, -1 if none)
 */
#define MAX_CELLS 2048
#define CELL_SLOTS 9
static uint32_t cell_buf[MAX_CELLS * CELL_SLOTS];

/* Remove events (post-cells): array of cell IDs to remove */
#define MAX_REMOVES 512
static uint32_t remove_buf[MAX_REMOVES];

/* String byte ranges: offset+len pairs for strings that need JS decode */
#define MAX_STRINGS 4096
static uint32_t str_buf[MAX_STRINGS * 2]; /* [offset, len] pairs */

/* ── Export buffer pointers ─────────────────────────────────────────── */

__attribute__((used))
uint32_t *get_eat_buf(void) { return eat_buf; }

__attribute__((used))
uint32_t *get_cell_buf(void) { return cell_buf; }

__attribute__((used))
uint32_t *get_remove_buf(void) { return remove_buf; }

__attribute__((used))
uint32_t *get_str_buf(void) { return str_buf; }

/* ── Helper: skip a null-terminated string, return (offset, length) ── */
static inline void skip_string(const uint8_t *buf, uint32_t len,
                                uint32_t *pos, uint32_t *str_start, uint32_t *str_len) {
    uint32_t start = *pos;
    while (*pos < len && buf[*pos] != 0) {
        (*pos)++;
    }
    *str_start = start;
    *str_len = *pos - start;
    if (*pos < len) (*pos)++; /* skip null terminator */
}

/* ── Main parse function ────────────────────────────────────────────── */
/*
 * Returns packed: (eat_count in low 16) | (cell_count in bits 16-31)
 *                 | (remove_count in high 32 via separate return)
 *
 * Actually returns a struct-like layout via output params.
 * For simplicity, we pack into a result struct.
 */

typedef struct {
    uint32_t eat_count;
    uint32_t cell_count;
    uint32_t remove_count;
} ParseResult;

static ParseResult g_result;

/*
 * parse_cells(buf_ptr, buf_len, is_legacy_multiogar)
 *
 * Parses the binary cell update packet starting at offset 0
 * (caller already stripped the opcode byte).
 *
 * Returns pointer to ParseResult with counts.
 */
__attribute__((used))
ParseResult *parse_cells(const uint8_t *buf, uint32_t buf_len, int is_legacy) {
    uint32_t off = 0;
    uint32_t eat_count = 0;
    uint32_t cell_count = 0;
    uint32_t remove_count = 0;

    if (buf_len < 2) {
        g_result.eat_count = 0;
        g_result.cell_count = 0;
        g_result.remove_count = 0;
        return &g_result;
    }

    /* ── Section 1: Eat events (eater, victim pairs) ──────────────── */
    uint16_t eat_len = (uint16_t)(buf[off] | (buf[off + 1] << 8));
    off += 2;

    for (uint16_t i = 0; i < eat_len && off + 8 <= buf_len && eat_count < MAX_EAT_EVENTS; i++) {
        uint32_t eater = buf[off] | (buf[off+1] << 8) | (buf[off+2] << 16) | (buf[off+3] << 24);
        uint32_t victim = buf[off+4] | (buf[off+5] << 8) | (buf[off+6] << 16) | (buf[off+7] << 24);
        eat_buf[eat_count * 2] = eater;
        eat_buf[eat_count * 2 + 1] = victim;
        eat_count++;
        off += 8;
    }

    /* ── Section 2: Cell updates ──────────────────────────────────── */
    while (off + 4 <= buf_len && cell_count < MAX_CELLS) {
        uint32_t id = buf[off] | (buf[off+1] << 8) | (buf[off+2] << 16) | (buf[off+3] << 24);
        off += 4;
        if (id == 0) break; /* sentinel */

        if (off + 10 > buf_len) break; /* need at least x(4)+y(4)+size(2) */

        int32_t x = (int32_t)(buf[off] | (buf[off+1] << 8) | (buf[off+2] << 16) | (buf[off+3] << 24));
        off += 4;
        int32_t y = (int32_t)(buf[off] | (buf[off+1] << 8) | (buf[off+2] << 16) | (buf[off+3] << 24));
        off += 4;
        uint16_t size = (uint16_t)(buf[off] | (buf[off+1] << 8));
        off += 2;

        if (off >= buf_len) break;
        uint8_t flags = buf[off++];
        uint8_t ext_flags = 0;

        /* Non-legacy: read extended flags if bit 7 set */
        if (!is_legacy && (flags & 0x80) && off < buf_len) {
            ext_flags = buf[off++];
        }

        /* Color (flags & 0x02) */
        uint8_t r = 0, g = 0, b = 0, has_color = 0;
        if ((flags & 0x02) && off + 3 <= buf_len) {
            r = buf[off++];
            g = buf[off++];
            b = buf[off++];
            has_color = 1;
        }

        /* Skin string (flags & 0x04) */
        uint32_t skin_off_val = 0, skin_len_val = 0;
        if ((flags & 0x04)) {
            skip_string(buf, buf_len, &off, &skin_off_val, &skin_len_val);
        }

        /* Name string (flags & 0x08) */
        uint32_t name_off_val = 0, name_len_val = 0;
        if ((flags & 0x08)) {
            skip_string(buf, buf_len, &off, &name_off_val, &name_len_val);
        }

        /* Legacy MultiOgar: ownerID (flags & 0x40) after name/skin */
        uint16_t owner_id = 0;
        int16_t cell_type = -1;
        if (is_legacy && (flags & 0x40) && off + 2 <= buf_len) {
            owner_id = (uint16_t)(buf[off] | (buf[off+1] << 8));
            off += 2;
        }

        /* Legacy MultiOgar: cellType + partyCode (flags & 0x80) */
        if (is_legacy && (flags & 0x80) && off + 2 <= buf_len) {
            cell_type = (int16_t)(buf[off] | (buf[off+1] << 8));
            off += 2;
            /* Skip partyCode string */
            while (off < buf_len && buf[off] != 0) off++;
            if (off < buf_len) off++; /* skip null */
        }

        /* Account ID (ext_flags & 0x04) */
        uint32_t account_id = 0;
        if ((ext_flags & 0x04) && off + 4 <= buf_len) {
            account_id = buf[off] | (buf[off+1] << 8) | (buf[off+2] << 16) | (buf[off+3] << 24);
            off += 4;
        }

        /* Write to output buffer */
        uint32_t base = cell_count * CELL_SLOTS;
        cell_buf[base + 0] = id;
        cell_buf[base + 1] = (uint32_t)x;
        cell_buf[base + 2] = (uint32_t)y;
        cell_buf[base + 3] = (uint32_t)size | ((uint32_t)flags << 16) | ((uint32_t)ext_flags << 24);
        cell_buf[base + 4] = (uint32_t)r | ((uint32_t)g << 8) | ((uint32_t)b << 16) | ((uint32_t)has_color << 24);
        cell_buf[base + 5] = account_id;
        cell_buf[base + 6] = (uint32_t)(skin_off_val & 0xFFFF) | ((uint32_t)(skin_len_val & 0xFFFF) << 16);
        cell_buf[base + 7] = (uint32_t)(name_off_val & 0xFFFF) | ((uint32_t)(name_len_val & 0xFFFF) << 16);
        cell_buf[base + 8] = (uint32_t)owner_id | ((uint32_t)(cell_type & 0xFFFF) << 16);
        cell_count++;
    }

    /* ── Section 3: Remove events ─────────────────────────────────── */
    if (off + 2 <= buf_len) {
        uint16_t rem_len = (uint16_t)(buf[off] | (buf[off + 1] << 8));
        off += 2;

        for (uint16_t i = 0; i < rem_len && off + 4 <= buf_len && remove_count < MAX_REMOVES; i++) {
            uint32_t rid = buf[off] | (buf[off+1] << 8) | (buf[off+2] << 16) | (buf[off+3] << 24);
            remove_buf[remove_count++] = rid;
            off += 4;
        }
    }

    g_result.eat_count = eat_count;
    g_result.cell_count = cell_count;
    g_result.remove_count = remove_count;
    return &g_result;
}
