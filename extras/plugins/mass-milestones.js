// ==LMPlugin==
// @id          mass-milestones
// @name        Mass milestone toasts
// @version     1.0.0
// @description A short message when your mass passes 1k, 5k, 10k, 25k and 50k (once per life; the steps can be changed in its settings).
// @author      Legend Mod
// @minVersion  3.568
// @permissions reads game state, shows messages
// ==/LMPlugin==
(function () {
    'use strict';
    var E = window.LMEvents, P = window.LMPlugins;
    if (!E) return;
    var DEFAULT = '1000, 5000, 10000, 25000, 50000';
    var ctx = null, steps = [], passed = {}, fresh = true;

    /* "1000, 5k, 10000" -> [1000, 5000, 10000] */
    function parse(text) {
        var out = [];
        String(text || '').split(/[,;\s]+/).forEach(function (w) {
            var m = /^(\d+(?:\.\d+)?)(k)?$/i.exec(w.trim());
            if (!m) return;
            var n = Math.round(parseFloat(m[1]) * (m[2] ? 1000 : 1));
            if (n > 0 && n < 1e7 && out.indexOf(n) === -1) out.push(n);
        });
        return out.sort(function (a, b) { return a - b; }).slice(0, 20);
    }
    function fmt(n) { return n >= 1000 ? (Math.round(n / 100) / 10) + 'k' : String(n); }
    function read() { steps = parse(ctx && ctx.id ? ctx.get('milestones') : DEFAULT); if (!steps.length) steps = parse(DEFAULT); }

    function onMass(e) {
        var best = 0;
        for (var i = 0; i < steps.length; i++) {
            if (e.mass >= steps[i] && !passed[steps[i]]) { passed[steps[i]] = true; best = steps[i]; }
        }
        /* loaded in the middle of a life: what was reached before is no news */
        if (fresh) { fresh = false; return; }
        if (best) E.api.toast('Mass ' + fmt(best) + '!');
    }
    function onSpawn() { passed = {}; fresh = false; }
    function on() { E.on('massUpdate', onMass); E.on('spawn', onSpawn); }
    function off() { E.off('massUpdate', onMass); E.off('spawn', onSpawn); }

    if (P && typeof P.ready === 'function') {
        ctx = P.ready({
            settings: [{ key: 'milestones', type: 'text', label: 'Milestones (mass, separated by commas, e.g. 1000, 5k)', 'default': DEFAULT }],
            onSettingsChange: read,
            onEnable: on,
            onDisable: off
        });
    }
    read();
    on();
})();
