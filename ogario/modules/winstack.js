/* Legend Mod window stacking: the window opened or touched last is in front.
 * Each module window has a fixed z-index tier (999990 standard, 999992 stacking windows, panels at
 * 100000-100005; the menu #overlays 100), so a window opened later could open behind one already
 * open (User Scripts, a menu page, behind Custom Macros; Profiles behind Custom Macros).
 * While two or more of these windows are open, their z-index follows the order they were opened or
 * touched in: the last one gets the highest value among the open ones, each older one stays at most
 * at its own value and below the newer ones. Nothing goes above 999992, so the full-screen editors
 * (999993: Command Centre, HUD editor, Discover), the gamepad window, the toasts and the notification
 * bell stay above as before; with one window open every value is back to its own.
 * Windows: direct children of <body> that are or hold a .lm-modal-container, z-index up to 999992.
 * The menu takes part only when a page of it is opened from outside it (LMWinStack.front from the
 * User Scripts hotkey and the Command Centre). It keeps its own value (the Hotkeys window, colour
 * pickers and tooltips stay above it): the older windows go just under it until it closes or
 * another window is opened or touched, then everything is as usual again.
 * A window's backdrop of its own (an empty full-screen element just before it) moves with it.
 * Nothing runs per frame: a MutationObserver on <body>'s children and the windows' style, and one
 * pointerdown listener. */
(function () {
    'use strict';
    var W = window, D = W.document;
    if (W._lmWinStackLoaded) return;
    W._lmWinStackLoaded = true;

    var MAX = 999992;

    /* z-index per window from their own values, oldest first: the newest gets the highest of them
     * (keepTop: its own, for the menu), each older one at most its own value and below the next
     * newer one */
    function order(bases, keepTop) {
        var n = bases.length, out = new Array(n);
        if (!n) return out;
        out[n - 1] = keepTop ? bases[n - 1] : Math.min(MAX, Math.max.apply(null, bases));
        for (var i = n - 2; i >= 0; i--) out[i] = Math.max(1, Math.min(bases[i], out[i + 1] - 1));
        return out;
    }

    var stack = [];     /* tracked windows, oldest first */
    var mo = null;

    function rootOf(el) {
        var b = D.body;
        while (el && el.parentElement && el.parentElement !== b) el = el.parentElement;
        return el && el.parentElement === b ? el : null;
    }
    function baseZ(el) {
        var z = parseInt(W.getComputedStyle(el).zIndex, 10);
        return isNaN(z) ? 0 : z;
    }
    /* a module window (not the menu, not the toasts, not a full-screen editor) */
    function eligible(el) {
        if (!el || el.nodeType !== 1 || el.parentElement !== D.body || el.id === 'overlays') return false;
        if (!(el.classList.contains('lm-modal-container') || el.querySelector('.lm-modal-container'))) return false;
        var cs = W.getComputedStyle(el), z = parseInt(cs.zIndex, 10);
        return (cs.position === 'fixed' || cs.position === 'absolute') && z >= 1 && z <= MAX;
    }
    function visible(el) {
        if (!el.isConnected) return false;
        var cs = W.getComputedStyle(el);
        return cs.display !== 'none' && cs.visibility !== 'hidden' && el.getClientRects().length > 0;
    }
    /* an empty full-screen element right before the window: its backdrop */
    function backdropOf(el) {
        var p = el.previousElementSibling;
        if (!p || p.children.length || W.getComputedStyle(p).position !== 'fixed') return null;
        var r = p.getBoundingClientRect();
        return r.width >= W.innerWidth - 2 && r.height >= W.innerHeight - 2 ? p : null;
    }
    function setZ(el, z) {
        if (!el) return;
        if (!el._lmWsZ) el._lmWsZ = { v: el.style.getPropertyValue('z-index'), p: el.style.getPropertyPriority('z-index') };
        if (el.style.getPropertyValue('z-index') !== String(z) || el.style.getPropertyPriority('z-index') !== 'important') el.style.setProperty('z-index', String(z), 'important');
    }
    function restoreZ(el) {
        if (!el || !el._lmWsZ) return;
        var o = el._lmWsZ;
        el._lmWsZ = null;
        if (o.v) el.style.setProperty('z-index', o.v, o.p); else el.style.removeProperty('z-index');
    }
    function untrack(el) {
        var i = stack.indexOf(el);
        if (i >= 0) stack.splice(i, 1);
        restoreZ(el);
        if (el._lmWsBd) { restoreZ(el._lmWsBd); el._lmWsBd = null; }
        el._lmWs = null;
    }
    function track(el, menu) {
        if (!el._lmWs) {
            /* its own value, read before anything is changed */
            el._lmWs = { base: baseZ(el), menu: !!menu, vis: true };
            if (mo) try { mo.observe(el, { attributes: true, attributeFilter: ['style', 'class'] }); } catch (e) { }
        }
        var i = stack.indexOf(el);
        if (i >= 0) stack.splice(i, 1);
        stack.push(el);
    }
    function restack() {
        var vis = [];
        stack.slice().forEach(function (el) {
            if (!el.isConnected) { untrack(el); return; }
            var v = visible(el);
            el._lmWs.vis = v;
            /* the menu leaves the stack when it closes */
            if (!v && el._lmWs.menu) { untrack(el); return; }
            if (v) vis.push(el);
            else { restoreZ(el); if (el._lmWsBd) restoreZ(el._lmWsBd); }
        });
        /* the menu stays in front only until another window opens or is touched: then the windows
         * are above it again as usual */
        for (var i = vis.length - 2; i >= 0; i--) if (vis[i]._lmWs.menu) { untrack(vis[i]); vis.splice(i, 1); }
        if (vis.length < 2) {
            vis.forEach(function (el) { restoreZ(el); if (el._lmWsBd) restoreZ(el._lmWsBd); });
            return;
        }
        var menu = vis[vis.length - 1]._lmWs.menu;
        var z = order(vis.map(function (el) { return el._lmWs.base; }), menu);
        vis.forEach(function (el, i) {
            if (el._lmWs.menu) return;
            setZ(el, z[i]);
            /* its backdrop stays just under it (it would cover the window once the window goes lower) */
            var bd = el._lmWsBd || backdropOf(el);
            if (!bd) return;
            restoreZ(bd);
            if (baseZ(bd) >= z[i]) { el._lmWsBd = bd; setZ(bd, z[i]); } else el._lmWsBd = null;
        });
    }
    /* brings a window (or the menu, #overlays) to the front of the open windows */
    function front(el) {
        var r = el && el.id === 'overlays' ? el : rootOf(el);
        if (!r) return;
        if (r.id === 'overlays') { if (!r._lmWs && !visible(r)) return; track(r, true); }
        else if (r._lmWs || eligible(r)) track(r, false);
        else return;
        restack();
    }

    function onMutations(list) {
        var raise = [], changed = false;
        list.forEach(function (m) {
            if (m.type === 'childList') {
                Array.prototype.forEach.call(m.addedNodes, function (n) { if (eligible(n)) raise.push(n); });
                Array.prototype.forEach.call(m.removedNodes, function (n) { if (n._lmWs) { untrack(n); changed = true; } });
            } else if (m.target._lmWs) {
                var el = m.target, was = el._lmWs.vis, now = visible(el);
                /* shown again: opened last; hidden: the others may go back to their own values */
                if (now && !was) raise.push(el);
                else if (!now && was) changed = true;
            }
        });
        raise.forEach(function (el) { if (el.isConnected) track(el, el._lmWs ? el._lmWs.menu : false); });
        if (raise.length || changed) restack();
    }

    function init() {
        if (!D.body) return false;
        if (W.MutationObserver) {
            mo = new MutationObserver(onMutations);
            mo.observe(D.body, { childList: true });
        }
        /* a touch or click on a window brings it to the front */
        D.addEventListener('pointerdown', function (e) {
            var r = rootOf(e.target);
            if (r && (r._lmWs || eligible(r)) && stack[stack.length - 1] !== r) front(r);
        }, true);
        return true;
    }
    if (!init()) D.addEventListener('DOMContentLoaded', init);

    W.LMWinStack = { front: front, _core: { order: order }, _stack: function () { return stack.slice(); } };
})();
