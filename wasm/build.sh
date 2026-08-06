#!/bin/bash
# Build WASM modules for cell_parser and quadtree
# Requires Emscripten SDK (emcc)
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

source /opt/emsdk/emsdk_env.sh 2>/dev/null || true

echo "=== Building cell_parser.wasm ==="
emcc cell_parser.c -O3 \
    -s STANDALONE_WASM=1 \
    -s EXPORTED_FUNCTIONS="['_parse_cells','_get_eat_buf','_get_cell_buf','_get_remove_buf','_get_str_buf']" \
    -s ERROR_ON_UNDEFINED_SYMBOLS=0 \
    --no-entry \
    -o cell_parser.wasm

echo "=== Building quadtree.wasm ==="
emcc quadtree.c -O3 \
    -s STANDALONE_WASM=1 \
    -s EXPORTED_FUNCTIONS="['_qt_init','_qt_clear','_qt_insert','_qt_bulk_insert','_qt_query','_qt_some','_qt_node_count','_qt_point_count','_get_result_buf']" \
    -s ERROR_ON_UNDEFINED_SYMBOLS=0 \
    --no-entry \
    -o quadtree.wasm

echo "=== Done! ==="
ls -la *.wasm
