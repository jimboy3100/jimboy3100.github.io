(module
  ;; 4 pages = 256KB, enough for 4096 cells × 40 bytes + sort buffers
  (memory (export "memory") 4)

  ;; Constants
  ;; FLOATS_PER_CELL = 10
  ;; MAX_CELLS = 4096
  ;; Buffer layout in memory:
  ;;   0x00000 - 0x27FFF: cells buffer (4096 * 10 * 4 = 163840 bytes)
  ;;   0x28000 - 0x2BFFF: sort_buf (4096 * 4 = 16384 bytes)
  ;;   0x2C000 - 0x2FFFF: sort_keys (4096 * 4 = 16384 bytes)
  ;;   0x30000+: ids scratch area

  (func $init (export "init") (result i32)
    (i32.const 4096)
  )

  (func $get_buffer (export "get_buffer") (result i32)
    (i32.const 0)
  )

  (func $get_sort_buffer (export "get_sort_buffer") (result i32)
    (i32.const 163840) ;; 0x28000
  )

  ;; interp_cells(count: i32, now: f32, anim: f32, suck_anim: i32) -> i32
  (func $interp_cells (export "interp_cells")
    (param $count i32) (param $now f32) (param $anim f32) (param $suck_anim i32)
    (result i32)
    (local $i i32)
    (local $off i32)
    (local $time f32)
    (local $delay f32)
    (local $inv_anim f32)
    (local $startX f32) (local $startY f32)
    (local $targetX f32) (local $targetY f32)
    (local $startSz f32) (local $targetSz f32)
    (local $sz f32)

    ;; Clamp count
    (if (i32.gt_s (local.get $count) (i32.const 4096))
      (then (local.set $count (i32.const 4096)))
    )
    ;; Guard anim
    (if (f32.le (local.get $anim) (f32.const 0))
      (then (local.set $anim (f32.const 120)))
    )
    (local.set $inv_anim (f32.div (f32.const 1) (local.get $anim)))

    (local.set $i (i32.const 0))
    (block $break
      (loop $loop
        (br_if $break (i32.ge_s (local.get $i) (local.get $count)))

        ;; off = i * 10 * 4 = i * 40
        (local.set $off (i32.mul (local.get $i) (i32.const 40)))

        ;; Load inputs
        (local.set $startX  (f32.load (local.get $off)))
        (local.set $startY  (f32.load offset=4 (local.get $off)))
        (local.set $targetX (f32.load offset=8 (local.get $off)))
        (local.set $targetY (f32.load offset=12 (local.get $off)))
        (local.set $startSz (f32.load offset=16 (local.get $off)))
        (local.set $targetSz (f32.load offset=20 (local.get $off)))

        ;; time = now - updateTime
        (local.set $time (f32.sub (local.get $now) (f32.load offset=24 (local.get $off))))

        ;; delay = time * inv_anim, clamped to [0, 1]
        (local.set $delay (f32.mul (local.get $time) (local.get $inv_anim)))
        (if (f32.lt (local.get $delay) (f32.const 0))
          (then (local.set $delay (f32.const 0)))
        )
        (if (f32.gt (local.get $delay) (f32.const 1))
          (then (local.set $delay (f32.const 1)))
        )

        ;; x_out = startX + (targetX - startX) * delay
        (f32.store offset=28 (local.get $off)
          (f32.add (local.get $startX)
            (f32.mul (f32.sub (local.get $targetX) (local.get $startX)) (local.get $delay))
          )
        )

        ;; y_out = startY + (targetY - startY) * delay
        (f32.store offset=32 (local.get $off)
          (f32.add (local.get $startY)
            (f32.mul (f32.sub (local.get $targetY) (local.get $startY)) (local.get $delay))
          )
        )

        ;; size interpolation
        (if (local.get $suck_anim)
          (then
            ;; suck: sz = startSz + (targetSz - startSz) * (time / 800)
            (local.set $sz
              (f32.add (local.get $startSz)
                (f32.mul
                  (f32.sub (local.get $targetSz) (local.get $startSz))
                  (f32.mul (local.get $time) (f32.const 0.00125)) ;; 1/800
                )
              )
            )
            (if (f32.lt (local.get $sz) (f32.const 0))
              (then (local.set $sz (f32.const 0)))
            )
            (f32.store offset=36 (local.get $off) (local.get $sz))
          )
          (else
            ;; normal: size_out = startSz + (targetSz - startSz) * delay
            (f32.store offset=36 (local.get $off)
              (f32.add (local.get $startSz)
                (f32.mul (f32.sub (local.get $targetSz) (local.get $startSz)) (local.get $delay))
              )
            )
          )
        )

        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $loop)
      )
    )
    (local.get $count)
  )

  ;; sort_cells(count: i32, ids_ptr: i32) -> i32
  ;; Insertion sort by (size ASC, id ASC)
  ;; Reads size from cells buffer slot 9 (offset 36)
  ;; Writes sorted indices to sort_buf at 0x28000
  (func $sort_cells (export "sort_cells")
    (param $count i32) (param $ids_ptr i32)
    (result i32)
    (local $i i32) (local $j i32)
    (local $tmpIdx i32) (local $tmpSize f32) (local $tmpId i32)
    (local $jIdx i32) (local $jSize f32)
    (local $sort_base i32) (local $keys_base i32)

    (if (i32.gt_s (local.get $count) (i32.const 4096))
      (then (local.set $count (i32.const 4096)))
    )

    (local.set $sort_base (i32.const 163840))  ;; 0x28000
    (local.set $keys_base (i32.const 180224))  ;; 0x2C000

    ;; Initialize sort_buf[i] = i, sort_keys[i] = cells[i].size_out
    (local.set $i (i32.const 0))
    (block $init_break
      (loop $init_loop
        (br_if $init_break (i32.ge_s (local.get $i) (local.get $count)))
        ;; sort_buf[i] = i
        (i32.store
          (i32.add (local.get $sort_base) (i32.mul (local.get $i) (i32.const 4)))
          (local.get $i)
        )
        ;; sort_keys[i] = cells[i * 40 + 36] (size_out)
        (f32.store
          (i32.add (local.get $keys_base) (i32.mul (local.get $i) (i32.const 4)))
          (f32.load (i32.add (i32.mul (local.get $i) (i32.const 40)) (i32.const 36)))
        )
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $init_loop)
      )
    )

    ;; Insertion sort
    (local.set $i (i32.const 1))
    (block $sort_break
      (loop $sort_loop
        (br_if $sort_break (i32.ge_s (local.get $i) (local.get $count)))

        ;; tmpIdx = sort_buf[i]
        (local.set $tmpIdx
          (i32.load (i32.add (local.get $sort_base) (i32.mul (local.get $i) (i32.const 4))))
        )
        ;; tmpSize = sort_keys[tmpIdx]
        (local.set $tmpSize
          (f32.load (i32.add (local.get $keys_base) (i32.mul (local.get $tmpIdx) (i32.const 4))))
        )
        ;; tmpId = ids[tmpIdx]
        (local.set $tmpId
          (i32.load (i32.add (local.get $ids_ptr) (i32.mul (local.get $tmpIdx) (i32.const 4))))
        )

        (local.set $j (i32.sub (local.get $i) (i32.const 1)))

        (block $inner_break
          (loop $inner_loop
            (br_if $inner_break (i32.lt_s (local.get $j) (i32.const 0)))

            ;; jIdx = sort_buf[j]
            (local.set $jIdx
              (i32.load (i32.add (local.get $sort_base) (i32.mul (local.get $j) (i32.const 4))))
            )
            ;; jSize = sort_keys[jIdx]
            (local.set $jSize
              (f32.load (i32.add (local.get $keys_base) (i32.mul (local.get $jIdx) (i32.const 4))))
            )

            ;; if (jSize > tmpSize || (jSize == tmpSize && ids[jIdx] > tmpId))
            (if (i32.or
              (f32.gt (local.get $jSize) (local.get $tmpSize))
              (i32.and
                (f32.eq (local.get $jSize) (local.get $tmpSize))
                (i32.gt_s
                  (i32.load (i32.add (local.get $ids_ptr) (i32.mul (local.get $jIdx) (i32.const 4))))
                  (local.get $tmpId)
                )
              )
            )
              (then
                ;; sort_buf[j+1] = sort_buf[j]
                (i32.store
                  (i32.add (local.get $sort_base) (i32.mul (i32.add (local.get $j) (i32.const 1)) (i32.const 4)))
                  (local.get $jIdx)
                )
                (local.set $j (i32.sub (local.get $j) (i32.const 1)))
                (br $inner_loop)
              )
            )
          )
        )

        ;; sort_buf[j+1] = tmpIdx
        (i32.store
          (i32.add (local.get $sort_base) (i32.mul (i32.add (local.get $j) (i32.const 1)) (i32.const 4)))
          (local.get $tmpIdx)
        )

        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $sort_loop)
      )
    )
    (local.get $count)
  )
)
