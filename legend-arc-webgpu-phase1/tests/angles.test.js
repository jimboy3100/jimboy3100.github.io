import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeArc } from '../src/legend-arc.js';

test('normalizeArc handles full circles', () => {
    const res = normalizeArc(0, Math.PI * 2);
    assert.equal(res.fullCircle, true);
    assert.equal(res.sweep, Math.PI * 2);
});

test('normalizeArc handles partial arcs clockwise', () => {
    const res = normalizeArc(0, Math.PI / 2, false);
    assert.equal(res.fullCircle, false);
    assert.ok(Math.abs(res.sweep - Math.PI / 2) < 1e-5);
});

test('normalizeArc handles anticlockwise arcs', () => {
    const res = normalizeArc(0, Math.PI / 2, true);
    assert.equal(res.fullCircle, false);
    assert.ok(Math.abs(res.sweep - (Math.PI * 1.5)) < 1e-5);
});
