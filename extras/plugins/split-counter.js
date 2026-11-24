// ==LMPlugin==
// @id          split-counter
// @name        Split and merge counter
// @version     1.0.0
// @description Counts your splits and merges in each life and shows them when you die.
// @author      Legend Mod
// @minVersion  3.568
// @permissions reads game state, shows messages
// ==/LMPlugin==
(function () {
    'use strict';
    var E = window.LMEvents, P = window.LMPlugins;
    if (!E) return;
    var splits = 0, merges = 0;

    /* a split at 16 cells adds nothing; a double split sent at once counts 2 */
    function onSplit(e) { if (e.before < 16) splits += Math.min(16 - e.before, e.count || 1); }
    function onMerge(e) { merges += e.merged; }
    function onSpawn() { splits = 0; merges = 0; }
    function onDeath() {
        if (splits || merges) E.api.toast('This life: ' + splits + (splits === 1 ? ' split, ' : ' splits, ') + merges + (merges === 1 ? ' merge' : ' merges'));
        splits = 0;
        merges = 0;
    }
    function on() { E.on('split', onSplit); E.on('merge', onMerge); E.on('spawn', onSpawn); E.on('death', onDeath); }
    function off() { E.off('split', onSplit); E.off('merge', onMerge); E.off('spawn', onSpawn); E.off('death', onDeath); }

    if (P && typeof P.ready === 'function') P.ready({ onEnable: on, onDisable: off });
    on();
})();
