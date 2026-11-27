/* Legend Mod window stacking: the window opened or touched last is in front.
 * Each module window has a fixed z-index tier (999990 standard, 999992 stacking windows, panels at
 * 100000-100005; the menu #overlays 100), so a window opened later could open behind one already
 * open (User Scripts, a menu page, behind Custom Macros; Profiles behind Custom Macros).
 * While two or more of these windows are open, their z-index follows the order they were opened or
 * touched in: the last one gets the highest value among the open ones, each older one stays at most
 * at its own value and below the newer ones. Nothing goes above 999992, so the full-screen editors
 * (999993: HUD editor), the gamepad window, the toasts and the notification
 * bell stay above as before; with one window open every value is back to its own.
 * Windows: direct children of <body> that are or hold a .lm-modal-container, z-index up to 999992.
 * The menu takes part only when a page of it is opened from outside it (LMWinStack.front from the
 * script API LMPlugins.open). It keeps its own value (the Hotkeys window, colour
 * pickers and tooltips stay above it): the older windows go just under it until it closes or
 * another window is opened or touched, or Esc is pressed in the menu, then everything is as usual
 * again. Opened from the menu's own tabs, Esc or menu button, the menu stays under the windows.
 * A window's backdrop of its own (an empty full-screen element just before it, taking taps, under
 * it) moves with it. A z-index a window's module sets while it is stacked becomes its own value.
 * Nothing runs per frame: a MutationObserver on <body>'s children and the windows' attributes,
 * pointerdown and focusin listeners, and one Esc keydown listener. */
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
    /* an empty full-screen element right before the window that takes taps and lies under it: its
     * backdrop (a layer above the window or one taps go through is something else, e.g. an effect) */
    function backdropOf(el) {
        var p = el.previousElementSibling;
        if (!p || p.children.length) return null;
        var cs = W.getComputedStyle(p);
        if (cs.position !== 'fixed' || cs.pointerEvents === 'none' || baseZ(p) > el._lmWs.base) return null;
        var r = p.getBoundingClientRect();
        return r.width >= W.innerWidth - 2 && r.height >= W.innerHeight - 2 ? p : null;
    }
    /* the z-index on the element is still the one set here (not one its module set since) */
    function ours(el) {
        var o = el._lmWsZ;
        return !!o && el.style.getPropertyValue('z-index') === o.set && el.style.getPropertyPriority('z-index') === 'important';
    }
    function setZ(el, z) {
        if (!el) return;
        /* the element's own value, read again when its module changed it meanwhile */
        if (!el._lmWsZ || !ours(el)) el._lmWsZ = { v: el.style.getPropertyValue('z-index'), p: el.style.getPropertyPriority('z-index') };
        el._lmWsZ.set = String(z);
        if (el.style.getPropertyValue('z-index') !== String(z) || el.style.getPropertyPriority('z-index') !== 'important') el.style.setProperty('z-index', String(z), 'important');
    }
    function restoreZ(el) {
        if (!el || !el._lmWsZ) return;
        var mine = ours(el), o = el._lmWsZ;
        el._lmWsZ = null;
        /* a value its module set meanwhile stays */
        if (!mine) return;
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
            if (mo) try { mo.observe(el, { attributes: true, attributeFilter: ['style', 'class', 'hidden'] }); } catch (e) { }
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
                /* its module set another z-index: that is its own value from now on */
                if (el._lmWsZ ? !ours(el) : !el._lmWs.menu && baseZ(el) !== el._lmWs.base) {
                    el._lmWsZ = null;
                    el._lmWs.base = baseZ(el);
                    changed = true;
                }
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
        /* a touch or click on a window, or the keyboard focus moving into one (Tab), brings it to
         * the front */
        var touched = function (e) {
            var r = rootOf(e.target);
            if (r && (r._lmWs || eligible(r)) && stack[stack.length - 1] !== r) front(r);
        };
        D.addEventListener('pointerdown', touched, true);
        D.addEventListener('focusin', touched, true);
        /* Esc while a menu page is in front of windows (opened over them from
         * a hotkey): the windows come back in front, instead of one of them closing unseen under the
         * menu (their own Esc handlers on window are added when they open, after this one). Only
         * for a key in the menu or on the page: not while typing in a field (a search box clears),
         * nor with the Hotkeys window or anything above the windows open (HUD
         * editor, gamepad window), whose Esc is their own. */
        W.addEventListener('keydown', function (e) {
            if (!(e.key === 'Escape' || e.keyCode === 27) || e.ctrlKey || e.altKey || e.metaKey || e.shiftKey) return;
            var top = stack[stack.length - 1], t = e.target || {};
            if (!top || !top._lmWs.menu || !visible(top)) return;
            if (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable) return;
            /* a target that is not a Node (window, from window.dispatchEvent, or none) is left to the
             * other Esc handlers: contains() throws on it */
            if (t !== D.body && t !== D.documentElement && t !== D && !(t.nodeType && top.contains(t))) return;
            if (!stack.some(function (el) { return !el._lmWs.menu && el.isConnected && visible(el); })) return;
            for (var c = D.body.children, i = 0; i < c.length; i++) {
                var o = c[i];
                if (o === top || o._lmWs) continue;
                var cs = W.getComputedStyle(o), z = parseInt(cs.zIndex, 10);
                if ((o.id === 'hotkeys' || z > MAX) && cs.display !== 'none' && cs.visibility !== 'hidden' && cs.pointerEvents !== 'none' && o.getClientRects().length) return;
            }
            e.preventDefault();
            e.stopImmediatePropagation();
            untrack(top);
            restack();
        }, true);
        /* windows already open when this loads, in the order they were added */
        Array.prototype.forEach.call(D.body.children, function (el) { if (eligible(el) && visible(el)) track(el, false); });
        if (stack.length > 1) restack();
        return true;
    }
    if (!init()) D.addEventListener('DOMContentLoaded', init);

    /* Windows that close on Esc (their root has _lmEsc) each listen on window, oldest first, so
     * with two of them open one Esc closed both, or only the one underneath. A window asks here
     * whether the Esc (e) is its own: yes when no newer open window that closes on Esc is in front
     * of it (or it is not tracked here), and only one window takes the same key press. */
    function escFor(el, e) {
        if (e && e._lmEscTaken) return false;
        var r = rootOf(el), mine = true;
        /* a full-screen window above all of these (the HUD editor: root._lmEscTop) that is open takes the Esc
         * first: a window opened under it is hidden there, and that Esc closed the hidden one */
        var kids = D.body ? D.body.children : [];
        for (var k = 0; k < kids.length; k++) {
            if (kids[k]._lmEscTop && kids[k] !== r && visible(kids[k])) return false;
        }
        if (r && r._lmWs) {
            for (var i = stack.length - 1; i >= 0; i--) {
                var o = stack[i];
                if (o === r) break;
                if (o._lmEsc && o.isConnected && visible(o)) { mine = false; break; }
            }
        }
        if (mine && e) e._lmEscTaken = true;
        return mine;
    }

    W.LMWinStack = { front: front, escFor: escFor, _core: { order: order }, _stack: function () { return stack.slice(); } };
})();
