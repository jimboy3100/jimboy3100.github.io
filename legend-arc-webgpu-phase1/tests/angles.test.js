import test from 'node:test';
import assert from 'node:assert/strict';
import {
    normalizeArc,
    packSnorm16x2,
    packRGBA8,
    identityTransform,
    multiplyTransforms,
    transformPoint,
    transformVector,
    parseHexColor,
    parseFunctionalColor
} from '../src/legend-arc.js';

test('normalizeArc handles clockwise full circles', () => {
    const res = normalizeArc(0, Math.PI * 2, false);
    assert.equal(res.fullCircle, true);
    assert.equal(res.sweep, Math.PI * 2);
});

test('normalizeArc handles anticlockwise full circles', () => {
    const res = normalizeArc(0, -Math.PI * 2, true);
    assert.equal(res.fullCircle, true);
    assert.equal(res.sweep, Math.PI * 2);
});

test('normalizeArc does not mark opposite direction sweep as full circle', () => {
    // 0 -> -PI*2 clockwise is actually a 0-sweep or 2PI sweep depending on wrapping, but not a raw >= 2PI clockwise sweep
    const res = normalizeArc(0, -Math.PI * 2, false);
    assert.equal(res.fullCircle, false);
});

test('normalizeArc handles partial arcs clockwise', () => {
    const res = normalizeArc(0, Math.PI / 2, false);
    assert.equal(res.fullCircle, false);
    assert.ok(Math.abs(res.sweep - Math.PI / 2) < 1e-5);
});

test('normalizeArc handles anticlockwise partial arcs', () => {
    const res = normalizeArc(0, -Math.PI / 2, true);
    assert.equal(res.fullCircle, false);
    assert.ok(Math.abs(res.sweep - (Math.PI / 2)) < 1e-5);
});

test('packSnorm16x2 packs signed values correctly into unsigned 32-bit int', () => {
    const zero = packSnorm16x2(0, 0);
    assert.equal(zero, 0);

    const pos = packSnorm16x2(1.0, 1.0);
    const expectedPos = (32767 & 0xFFFF) | ((32767 & 0xFFFF) << 16);
    assert.equal(pos >>> 0, expectedPos >>> 0);

    const neg = packSnorm16x2(-1.0, -1.0);
    const expectedNeg = ((-32767) & 0xFFFF) | (((-32767) & 0xFFFF) << 16);
    assert.equal(neg >>> 0, expectedNeg >>> 0);
});

test('packRGBA8 correctly packs bytes into u32', () => {
    const packed = packRGBA8(255, 0, 128, 255);
    const expected = (255 << 24) | (128 << 16) | (0 << 8) | 255;
    assert.equal(packed >>> 0, expected >>> 0);
});

test('Matrix transform calculations', () => {
    const t = identityTransform();
    const p = transformPoint(t, 10, 20);
    assert.deepEqual(p, [10, 20]);

    const v = transformVector(t, 5, 5);
    assert.deepEqual(v, [5, 5]);

    const t2 = [2, 0, 0, 2, 100, 200];
    const p2 = transformPoint(t2, 10, 20);
    assert.deepEqual(p2, [120, 240]);
});

test('Color parsing', () => {
    const hex = parseHexColor('#ff0000');
    assert.deepEqual(hex, [255, 0, 0, 1]);

    const rgba = parseFunctionalColor('rgba(255, 128, 64, 0.5)');
    assert.deepEqual(rgba, [255, 128, 64, 0.5]);
});
