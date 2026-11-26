/* Legend Mod Command Centre: a search box for every hotkey command, gameplay setting, theme
 * setting and menu window. Ctrl+K opens it on the game page (unless Ctrl+K is bound to a
 * hotkey, or the focus is in a text field), as does the "Command Centre" hotkey (no default
 * key) and the button next to the settings search.
 * Starred items are kept in localStorage 'lmCommandCentre' ({fav: [...], recent: [...]}, checked
 * on read) and can be shown in game as a small quick bar (option commandCentreBar, off by default).
 * The quick bar is placed where it covers no HUD (leaderboard, minimap, chat, phone buttons).
 * The pure helpers (search, ranking, storage, bar placement) are tested in
 * developers/tests/commandcentre.js.
 */
(function () {
    'use strict';
    var W = typeof window !== 'undefined' ? window : this;
    if (W._lmCommandCentreLoaded) return;
    W._lmCommandCentreLoaded = true;

    var STORE_KEY = 'lmCommandCentre';
    var MAX_FAV = 30, MAX_RECENT = 12, MAX_BAR = 10;
    /* item ids: kind + ':' + the setting key / command / element id */
    var ID_RE = /^(hk|opt|set|sec|tab|win):[A-Za-z0-9_.#-]{1,80}$/;

    /* ═══ Pure helpers ═══ */

    var _nonWord = null;
    try { _nonWord = new RegExp('[^\\p{L}\\p{N}]+', 'gu'); } catch (e) { _nonWord = null; }
    /* lower case, no accents (Greek tonos too), no HTML, words separated by single spaces */
    function normalize(s) {
        s = String(s == null ? '' : s);
        s = s.replace(/<[^>]*>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ');
        try { s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); } catch (e) { }
        s = s.toLowerCase().replace(/\u03c2/g, '\u03c3');
        if (_nonWord) s = s.replace(_nonWord, ' ');
        else s = s.replace(/[\s!-\/:-@\[-`{-~\u00a0-\u00bf]+/g, ' ');
        return s.replace(/\s+/g, ' ').trim();
    }
    /* "showMiniMapGrid" / "hk-showMiniMapGrid" -> "show mini map grid showminimapgrid" */
    function splitKey(k) {
        k = String(k == null ? '' : k).replace(/^hk-/, '');
        var words = k.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2').replace(/[-_.#]+/g, ' ');
        return normalize(words + ' ' + k);
    }
    function wordStart(t, i) { return i === 0 || t.charAt(i - 1) === ' '; }
    /* first index of q in t at the start of a word, else -1 */
    function indexAtWord(t, q) {
        var i = t.indexOf(q);
        while (i !== -1) {
            if (wordStart(t, i)) return i;
            i = t.indexOf(q, i + 1);
        }
        return -1;
    }
    /* letters of q in order inside t: consecutive letters and word starts count most; letters
     * scattered over a long label are no match. 1..349 */
    function fuzzy(q, t) {
        if (q.length < 2) return 0;
        var ti = 0, run = 0, pts = 0, first = -1, last = -1;
        for (var qi = 0; qi < q.length; qi++) {
            var c = q.charAt(qi), found = t.indexOf(c, ti);
            if (found < 0) return 0;
            /* the same letter at a word start a little further on is the better pick */
            if (!wordStart(t, found) && !(last >= 0 && found === last + 1)) {
                var ws = found;
                while ((ws = t.indexOf(c, ws + 1)) !== -1 && ws - found < 12) {
                    if (wordStart(t, ws)) { found = ws; break; }
                }
            }
            if (first < 0) first = found;
            if (last >= 0 && found === last + 1) { run++; pts += 2 + run; } else run = 0;
            if (wordStart(t, found)) pts += 3;
            pts += 1;
            last = found;
            ti = found + 1;
        }
        var span = last - first + 1;
        if (span > q.length * 3 + 6) return 0;
        return Math.max(1, Math.min(349, 100 + pts * 4 - (span - q.length) * 2 - Math.min(30, first)));
    }
    /* how well normalized query q matches normalized text t (0 = no match):
     * whole text 1000, prefix 900, at a word start 750, inside a word 500,
     * every word found 400-500, letters in order up to 349 */
    function scoreText(q, t) {
        if (!q || !t) return 0;
        if (t === q) return 1000;
        var i = t.indexOf(q);
        if (i === 0) return 900 - Math.min(99, t.length - q.length);
        if (i > 0) {
            var w = indexAtWord(t, q);
            return w >= 0 ? 750 - Math.min(99, w) : 500 - Math.min(99, i);
        }
        var toks = q.split(' ');
        if (toks.length > 1) {
            var sum = 0, starts = 0, ok = true;
            for (var k = 0; k < toks.length; k++) {
                if (!toks[k]) continue;
                var p = indexAtWord(t, toks[k]);
                if (p >= 0) starts++;
                else p = t.indexOf(toks[k]);
                if (p < 0) { ok = false; break; }
                sum += p;
            }
            if (ok) return 400 + Math.round(99 * starts / toks.length) - Math.min(99, Math.round(sum / toks.length / 4));
        }
        return fuzzy(q.replace(/ /g, ''), t);
    }
    function prep(item) {
        if (!item._n) {
            item._n = {
                label: normalize(item.label),
                en: normalize(item.en),
                key: splitKey(item.key),
                sec: normalize(item.section)
            };
        }
        return item._n;
    }
    /* best of the translated label, the English label and the setting key; words spread over
     * label and section ("hud blur") count less */
    function scoreItem(item, q) {
        var n = prep(item);
        var s = Math.max(scoreText(q, n.label), scoreText(q, n.en) * 0.95, scoreText(q, n.key) * 0.8);
        if (s < 400 && q.indexOf(' ') > 0) {
            var all = scoreText(q, n.label + ' ' + n.en + ' ' + n.sec);
            if (all >= 400) s = Math.max(s, all * 0.6);
        }
        return Math.round(s);
    }
    /* items sorted for the query. Empty query: favourites, then recent, then everything in
     * list order. Otherwise by score, favourites and recent ones a little higher; ties go to
     * the shorter label. Returns [{item, score, group}] (group 0 favourite, 1 recent, 2 other). */
    function rank(items, query, st) {
        st = st || {};
        var fav = {}, rec = {}, out = [], i;
        (st.fav || []).forEach(function (id, n) { if (!fav.hasOwnProperty(id)) fav[id] = n; });
        (st.recent || []).forEach(function (id, n) { if (!rec.hasOwnProperty(id)) rec[id] = n; });
        var q = normalize(query);
        for (i = 0; i < items.length; i++) {
            var it = items[i];
            var g = fav.hasOwnProperty(it.id) ? 0 : rec.hasOwnProperty(it.id) ? 1 : 2;
            var s = 0;
            if (q) {
                s = scoreItem(it, q);
                if (s <= 0) continue;
                if (fav.hasOwnProperty(it.id)) s += 30;
                if (rec.hasOwnProperty(it.id)) s += Math.max(0, 24 - 3 * rec[it.id]);
            }
            out.push({ item: it, score: s, group: g, order: g === 0 ? fav[it.id] : g === 1 ? rec[it.id] : i });
        }
        out.sort(q ? function (a, b) {
            return b.score - a.score || String(a.item.label).length - String(b.item.label).length || a.order - b.order;
        } : function (a, b) {
            return a.group - b.group || a.order - b.order;
        });
        return out;
    }
    function cleanList(a, max) {
        var out = [], seen = {};
        if (!Array.isArray(a)) return out;
        for (var i = 0; i < a.length && out.length < max; i++) {
            var v = a[i];
            if (typeof v === 'string' && ID_RE.test(v) && !seen.hasOwnProperty(v)) { seen[v] = 1; out.push(v); }
        }
        return out;
    }
    /* stored state from a JSON string (or object); anything malformed reads as empty */
    function parseStore(raw) {
        var o = null;
        try { o = typeof raw === 'string' ? JSON.parse(raw) : raw; } catch (e) { o = null; }
        if (!o || typeof o !== 'object' || Array.isArray(o)) o = {};
        return { fav: cleanList(o.fav, MAX_FAV), recent: cleanList(o.recent, MAX_RECENT) };
    }
    function withRecent(st, id) {
        var r = [id].concat((st.recent || []).filter(function (x) { return x !== id; }));
        return { fav: (st.fav || []).slice(), recent: cleanList(r, MAX_RECENT) };
    }
    function withFav(st, id, on) {
        var f = (st.fav || []).filter(function (x) { return x !== id; });
        if (on) f.push(id);
        return { fav: cleanList(f, MAX_FAV), recent: (st.recent || []).slice() };
    }
    function overlap(a, b) {
        var w = Math.min(a.right, b.right) - Math.max(a.left, b.left);
        var h = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
        return w > 0 && h > 0 ? w * h : 0;
    }
    /* Where the quick bar goes. view {w, h}; row / col {w, h}: the bar's size as a row or as a
     * column; avoid: rects {left, top, right, bottom} to keep clear; busy(rect) (optional) says
     * whether something else is under a spot. Tries the top centre (moving down), then the right
     * and left edges (around the middle), then the bottom centre; returns the first clear spot,
     * else the one that covers least: {x, y, dir: 'row'|'col', overlap}. */
    function placeBar(view, row, col, avoid, busy, margin) {
        margin = margin == null ? 6 : margin;
        avoid = avoid || [];
        var c = [], x, y, k;
        x = Math.round((view.w - row.w) / 2);
        for (y = 4; y <= view.h * 0.4; y += 12) c.push({ x: x, y: y, dir: 'row' });
        var cy = Math.round((view.h - col.h) / 2), offs = [0, -40, 40, -80, 80, -120, 120, -160, 160];
        for (k = 0; k < offs.length; k++) c.push({ x: view.w - col.w - 4, y: cy + offs[k], dir: 'col' });
        for (k = 0; k < offs.length; k++) c.push({ x: 4, y: cy + offs[k], dir: 'col' });
        for (y = view.h - row.h - 4; y >= view.h * 0.6; y -= 12) c.push({ x: x, y: y, dir: 'row' });
        var best = null;
        for (k = 0; k < c.length; k++) {
            var s = c[k].dir === 'row' ? row : col;
            var r = { left: c[k].x, top: c[k].y, right: c[k].x + s.w, bottom: c[k].y + s.h };
            if (r.left < 0 || r.top < 0 || r.right > view.w || r.bottom > view.h) continue;
            var m = { left: r.left - margin, top: r.top - margin, right: r.right + margin, bottom: r.bottom + margin };
            var ov = 0;
            for (var j = 0; j < avoid.length; j++) ov += overlap(m, avoid[j]);
            if (!ov && busy && busy(r)) ov = 1;
            if (!ov) return { x: c[k].x, y: c[k].y, dir: c[k].dir, overlap: 0 };
            if (!best || ov < best.overlap) best = { x: c[k].x, y: c[k].y, dir: c[k].dir, overlap: ov };
        }
        return best || { x: 4, y: 4, dir: 'row', overlap: -1 };
    }

    /* a switch the menu shows as unavailable (disabled, read-only) is not changed from here
     * either: checked when it runs, the list may be older than the menu */
    function locked(cb) {
        if (!cb) return true;
        try {
            return !!(cb.disabled || cb.readOnly || cb.getAttribute('aria-disabled') === 'true' ||
                (typeof cb.closest === 'function' && cb.closest('fieldset[disabled]')));
        } catch (e) { return true; }
    }
    /* a switch goes through the real checkbox: the bubbling change runs setSettings (side
     * effects, save) and moves the Switchery, as the presets do; null when it is locked */
    function toggleOpt(cb) {
        if (locked(cb)) return null;
        var v = !cb.checked;
        cb.checked = v;
        try { cb.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) {
            try { if (W.application) W.application.setSettings(cb.id, v); } catch (e2) { }
        }
        return cb.checked;
    }
    /* A hold command (macro feed, scan trick...) run from here is pressed briefly. The input
     * that holds it owns its release: while a key, mouse button or gamepad button holds it
     * (o.held) this neither presses it again nor releases it, the release is skipped when such
     * an input took it over meanwhile, and overlapping presses from here make one longer press. */
    function makeTapper(o) {
        var pending = {};
        return function (id, ms) {
            var c = o.command(id);
            if (!c || typeof c.keyDown !== 'function') return false;
            if (typeof c.keyUp !== 'function') { c.keyDown(); return true; }
            if (!pending[id] && o.held(id)) return true;
            if (pending[id]) o.clearTimeout(pending[id]);
            else c.keyDown();
            pending[id] = o.setTimeout(function () {
                delete pending[id];
                if (!o.held(id)) c.keyUp();
            }, ms || 250);
            return true;
        };
    }

    /* ═══ Text ═══ */

    var P = 'modules.commandcentre.';
    function lang() {
        try { return W.LMi18n && typeof W.LMi18n.lang === 'function' ? W.LMi18n.lang() : 'en'; } catch (e) { return 'en'; }
    }
    /* texts from the language packs (developers/i18n/src) */
    function t(k, vars) { return typeof W.lmT === 'function' ? W.lmT(P + k, vars) : k; }
    /* the English text of a full key (searching finds items by their English label too) */
    var enCache = {};
    function enOf(key) {
        if (own(enCache, key)) return enCache[key];
        var s;
        try { s = W.LMi18n && typeof W.LMi18n.prefixed === 'function' ? W.LMi18n.prefixed(key, 'en')[''] : undefined; } catch (e) { s = undefined; }
        if (typeof s !== 'string') return typeof W.lmT === 'function' ? W.lmT(key) : key;
        return (enCache[key] = s);
    }
    function tEn(k) { return enOf(P + k); }

    var core = {
        normalize: normalize, splitKey: splitKey, scoreText: scoreText, scoreItem: scoreItem, rank: rank,
        parseStore: parseStore, withRecent: withRecent, withFav: withFav, placeBar: placeBar, ID_RE: ID_RE,
        locked: locked, toggleOpt: toggleOpt, makeTapper: makeTapper, t: t, enOf: enOf
    };
    var api = W.LMCommandCentre = { _core: core };

    var D = W.document;
    if (!D || typeof D.addEventListener !== 'function' || typeof D.createElement !== 'function') return;

    /* label text without markup, for textContent */
    function plain(s) {
        if (s == null) return '';
        return String(s).replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
    }
    function TL() { return W.textLanguage || {}; }
    function EN() { return W._lmEnglishLabels || W.textLanguage || {}; }

    /* ═══ Stored favourites / recent ═══ */

    var state = load();
    function load() {
        var raw = null;
        try { raw = W.localStorage.getItem(STORE_KEY); } catch (e) { }
        return parseStore(raw);
    }
    function save() {
        try { W.localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { }
    }

    /* ═══ Collecting the items ═══ */

    function own(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }
    function closest(el, sel) { return el && el.closest ? el.closest(sel) : null; }
    function sectionOf(el) {
        var box = closest(el, '.options-box');
        var h = box && box.querySelector('h5');
        return h ? plain(h.textContent) : '';
    }
    function tabTitle(a) {
        return plain(a.getAttribute('data-original-title') || a.getAttribute('title') || a.textContent);
    }
    function boxLabel(el) {
        var box = closest(el, '.slider-box, .input-box, .color-box, .preset-box, .font-box, label');
        if (!box) return '';
        var l = box.querySelector('.value-label, .title-box');
        return plain(l ? l.textContent : box.textContent).replace(/:\s*$/, '');
    }
    var THEME_TAB_KEYS = { 'theme-main': 'basicTheming', 'theme-menu': 'menuTheming', 'theme-hud': 'hudTheming', 'theme-chat': 'chatTheming', 'theme-minimap': 'miniMapTheming', 'theme-images': 'imagesTheming' };
    var MENU_TAB_KEYS = { 'main-panel': 'start', 'og-settings': 'settings', 'theme': 'theme', 'music': 'sounds', 'profile': 'profile' };
    function hotkeyKeys() {
        var hk = W.hotkeys, keyOf = {};
        if (!hk || typeof hk !== 'object') return keyOf;
        for (var k in hk) {
            if (!own(hk, k) || !k || k === 'spec-messageKey' || typeof hk[k] !== 'string') continue;
            if (!own(keyOf, hk[k])) keyOf[hk[k]] = k;
        }
        return keyOf;
    }

    var cache = null, cacheAt = 0;
    function collect() {
        var items = [], seen = {}, tl = TL(), en = EN(), i, id;
        var add = function (it) {
            if (!ID_RE.test(it.id) || own(seen, it.id)) return;
            seen[it.id] = 1;
            if (!it.label) it.label = it.en || it.key;
            items.push(it);
        };
        /* menu windows and tabs */
        var tabs = D.querySelectorAll('.menu-tabs a');
        for (i = 0; i < tabs.length; i++) {
            var a = tabs[i], href = (a.getAttribute('href') || '').replace(/^#/, '');
            var isHk = a.classList.contains('hotkeys-link');
            var tk = isHk ? 'hotkeys' : MENU_TAB_KEYS[href] || href;
            if (!tk) continue;
            add({ id: 'tab:' + (isHk ? 'hotkeys' : href), kind: isHk ? 'win' : 'tab', label: plain(tl[tk]) || tabTitle(a), en: plain(en[tk]), key: tk, section: t('tab'), el: a });
        }
        var themeTabs = D.querySelectorAll('#theme .submenu-tabs a[href^="#"]');
        for (i = 0; i < themeTabs.length; i++) {
            var ta = themeTabs[i], th = ta.getAttribute('href').slice(1), thk = THEME_TAB_KEYS[th] || th;
            add({ id: 'tab:' + th, kind: 'tab', label: plain(tl[thk]) || tabTitle(ta), en: plain(en[thk]), key: thk + ' theme', section: t('theme'), el: ta });
        }
        WINDOWS.forEach(function (w) {
            var ok = false;
            try { ok = w.avail(); } catch (e) { }
            if (ok) add({ id: 'win:' + w.id, kind: 'win', label: winLabel(w), en: plain(enOf(winKey(w))), key: w.id, section: t('win'), win: w });
        });
        /* hotkey commands */
        var hc = W.hotkeysCommand, keyOf = hotkeyKeys();
        if (hc && typeof hc === 'object') {
            for (id in hc) {
                if (!own(hc, id) || id === 'hk-commandCentre') continue;
                var c = hc[id];
                if (!c || typeof c.keyDown !== 'function') continue;
                var label = '', enl = plain(en[id]);
                try { label = plain(c.label); } catch (e) { }
                if (c.type === 'command') {
                    var cid = id.replace(/^hk-/, '');
                    label = plain((W.chatCommand || {})[cid]);
                    if (!label) continue;
                    enl = tEn('quickChat') + ' ' + cid.replace(/^comm/, '');
                }
                add({ id: 'hk:' + id, kind: 'hk', label: label || enl, en: enl, key: id, section: t('hk'), cmd: id, keyName: keyOf[id] || '', hold: typeof c.keyUp === 'function' });
            }
        }
        /* gameplay settings: switches toggle, the rest open the menu at the setting */
        var boxes = D.querySelectorAll('#og-options > .options-box');
        for (i = 0; i < boxes.length; i++) {
            var b = boxes[i], grp = null;
            for (var ci = 0; ci < b.classList.length; ci++) if (b.classList[ci] !== 'options-box' && !/^lm-/.test(b.classList[ci])) { grp = b.classList[ci]; break; }
            var h5 = b.querySelector('h5');
            if (grp && h5) add({ id: 'sec:' + grp, kind: 'sec', label: plain(h5.textContent), en: plain(en[grp]), key: grp, section: t('sec'), el: h5 });
        }
        var cbs = D.querySelectorAll('#og-options input[type="checkbox"][id]');
        for (i = 0; i < cbs.length; i++) {
            var cb = cbs[i];
            add({ id: 'opt:' + cb.id, kind: 'opt', label: plain(tl[cb.id]) || plain((closest(cb, 'label') || {}).textContent), en: plain(en[cb.id]), key: cb.id, section: sectionOf(cb), el: cb });
        }
        var ctl = D.querySelectorAll('#og-options input[id]:not([type="checkbox"]):not([type="hidden"]), #og-options select[id], #theme .submenu-panel input[id]:not([type="hidden"]), #theme .submenu-panel select[id]');
        for (i = 0; i < ctl.length; i++) {
            var el = ctl[i], key = el.id.replace(/-slider$/, '');
            var inTheme = !!closest(el, '#theme');
            var sec = inTheme ? t('theme') + ' \u00b7 ' + themePanelTitle(el) : sectionOf(el);
            add({ id: 'set:' + key, kind: 'set', label: plain(tl[key]) || boxLabel(el), en: plain(en[key]), key: key, section: sec, el: el, theme: inTheme });
        }
        /* the mouse buttons and gamepad of the Hotkeys window (ogario.v4.js buildHotkeysControls):
         * same ids as when they were in Settings; switches toggle, the rest open that window */
        var hkHeads = D.querySelectorAll('#lm-hk-controls h5[data-lm-sec]');
        for (i = 0; i < hkHeads.length; i++) {
            var hh = hkHeads[i], hs = hh.getAttribute('data-lm-sec');
            add({ id: 'sec:' + hs, kind: 'sec', label: plain(hh.textContent), en: enKey(hh.getAttribute('data-i18n')), key: hs, section: hkSection(hh), el: hh });
        }
        var hkCtl = D.querySelectorAll('#lm-hk-controls .lm-hk-ctl[data-lm-opt]');
        for (i = 0; i < hkCtl.length; i++) {
            var hr = hkCtl[i], ho = hr.getAttribute('data-lm-opt'), lab = hr.querySelector('.key-label');
            var hl = plain(lab ? lab.textContent : ''), he = enKey(lab && lab.getAttribute('data-i18n')), hsec = hkSection(hr);
            var hcb = D.getElementById(ho);
            if (hcb && hcb.type === 'checkbox') add({ id: 'opt:' + ho, kind: 'opt', label: hl, en: he, key: ho, section: hsec, el: hcb });
            var hsel = hr.querySelector('select[id]');
            if (hsel) add({ id: 'set:' + hsel.id, kind: 'set', label: hl, en: he, key: hsel.id, section: hsec, el: hsel });
        }
        cache = items;
        cacheAt = Date.now();
        return items;
    }
    function enKey(k) { return k ? plain(enOf(k)) : ''; }
    /* "Hotkeys · <block heading>" for a row (or heading) of the Hotkeys window */
    function hkSection(el) {
        var win = plain(TL().hotkeys) || 'Hotkeys';
        var h = el;
        while (h && !(h.tagName === 'H5' && h.hasAttribute('data-lm-sec'))) h = h.previousElementSibling;
        return h && h !== el ? win + ' · ' + plain(h.textContent) : win;
    }
    function themePanelTitle(el) {
        var p = closest(el, '.submenu-panel');
        if (!p || !p.id) return '';
        var a = D.querySelector('#theme .submenu-tabs a[href="#' + p.id + '"]');
        return a ? (plain(TL()[THEME_TAB_KEYS[p.id]]) || tabTitle(a)) : '';
    }
    function items(fresh) {
        if (fresh || !cache || Date.now() - cacheAt > 5000) collect();
        return cache;
    }
    function find(id) {
        var list = items(), i;
        for (i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
        list = items(true);
        for (i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
        return null;
    }

    /* existing windows that have no menu tab */
    function clickEl(sel) {
        var el = D.querySelector(sel);
        if (!el) return false;
        el.click();
        return true;
    }
    /* the label of a window: its own text, or the existing key of the window it opens (key) */
    function winKey(w) { return w.key || P + w.id; }
    function winLabel(w) { return plain(typeof W.lmT === 'function' ? W.lmT(winKey(w)) : w.id); }
    var WINDOWS = [
        { id: 'matchHistory', key: 'matchHistory', avail: function () { return typeof W._lmMatchHistoryOpen === 'function'; }, run: function () { W._lmMatchHistoryOpen(); } },
        { id: 'replays', avail: function () { return typeof W.lmReplayStudio === 'function'; }, run: function () { W.lmReplayStudio('open'); } },
        { id: 'exportImport', key: 'settings.exportImport', avail: function () { return !!D.querySelector('#og-settings .btn-export'); }, run: function () { clickEl('#og-settings .btn-export'); } },
        { id: 'searchSettings', avail: function () { return !!D.getElementById('lm-settings-search'); }, run: function () { openTab('og-settings'); setTimeout(function () { var s = D.getElementById('lm-settings-search'); if (s) s.focus(); }, 250); } },
        { id: 'friends', avail: function () { var b = D.getElementById('lm-friends-btn'); return !!(b && !b.disabled); }, run: function () { clickEl('#lm-friends-btn'); } },
        /* phones only: the touch control editor of LMmobile.js */
        { id: 'mobileControls', avail: function () { return !!(W._lmMobileHost && typeof W._lmMobileHost.openEditor === 'function'); }, run: function () { W._lmMobileHost.openEditor(); } },
        { id: 'companion', avail: function () { return !!(W.LMCompanion && W.LMCompanion.open); }, run: function () { W.LMCompanion.open(); } },
        { id: 'director', avail: function () { return !!(W.LMDirector && typeof W.LMDirector.open === 'function'); }, run: function () { W.LMDirector.open(); } },
        { id: 'hudEditor', avail: function () { return !!(W.LMHudEditor && W.LMHudEditor.open); }, run: function () { W.LMHudEditor.open(); } },
        /* ogario/modules/practice.js (loaded on first use by lmPractice in ogario.v4.js) */
        { id: 'practice', avail: function () { return typeof W.lmPractice === 'function'; }, run: function () { W.lmPractice('open'); } },
        /* the Lab experiments are in this window too (no Lab entry of their own) */
        { id: 'plugins', key: 'pkg.lb2.ccPlugins', avail: function () { return !!(W.LMPlugins && typeof W.LMPlugins.open === 'function'); }, run: function () { W.LMPlugins.open('plugins'); } },
        /* skinEditor removed — macroeditor.js still loads on first use */
        { id: 'macroEditor', avail: function () { return typeof W.lmMacroEditor === 'function'; }, run: function () { W.lmMacroEditor('open'); } },
        { id: 'discover', avail: function () { return !!(W.LMDiscovery && W.LMDiscovery.open); }, run: function () { W.LMDiscovery.open(); } },
        { id: 'serverCaps', avail: function () { return !!(W.LMDiscovery && W.LMDiscovery.openServer); }, run: function () { W.LMDiscovery.openServer(); } },
        { id: 'themeWorkshop', avail: function () { return !!(W.LMThemeWorkshop && typeof W.LMThemeWorkshop.open === 'function'); }, run: function () { W.LMThemeWorkshop.open(); } }
    ];

    /* ═══ Running items ═══ */

    function menuOpen() {
        var ov = D.getElementById('overlays');
        if (!ov || ov.style.display === 'none') return false;
        return ov.offsetParent !== null || ov.offsetHeight > 0;
    }
    function showMenu() {
        try { if (!menuOpen() && W.application && typeof W.application.showMenu === 'function') W.application.showMenu(); } catch (e) { }
        /* the menu page asked for comes in front of a window already open (ogario/modules/winstack.js) */
        if (W.LMWinStack) W.LMWinStack.front(D.getElementById('overlays'));
    }
    function openTab(href) {
        showMenu();
        clickEl('.menu-tabs a[href="#' + href + '"]');
    }
    function mainColor() {
        var ds = W.defaultSettings;
        var c = ds && typeof ds.menuMainColor === 'string' && /^#[0-9a-f]{3,8}$|^rgba?\([\d\s.,%]+\)$/i.test(ds.menuMainColor) ? ds.menuMainColor : '#01d9cc';
        /* the theme variable first, so a theme change shows at once */
        return 'var(--lm-mc,' + c + ')';
    }
    /* the mouse buttons and gamepad are in the Hotkeys window: open it (as its menu tab does),
     * scroll to the row and make it blink once the window has faded in */
    function revealHotkeys(el) {
        injectStyle();
        var win = D.getElementById('hotkeys');
        if (!win || !(win.offsetWidth || win.offsetHeight)) { showMenu(); clickEl('.hotkeys-link'); }
        var box = closest(el, '.row, h5') || el;
        var scroll = function () {
            try { box.scrollIntoView({ block: 'center' }); } catch (e) { try { box.scrollIntoView(); } catch (e2) { } }
            try { if (W.jQuery) W.jQuery('#hotkeys-cfg').perfectScrollbar('update'); } catch (e) { }
        };
        setTimeout(function () {
            scroll();
            box.style.setProperty('--lm-cc-mc', mainColor());
            box.classList.remove('lm-cc-flash');
            void box.offsetWidth;
            box.classList.add('lm-cc-flash');
            setTimeout(function () { box.classList.remove('lm-cc-flash'); }, 2400);
        }, 550);
    }
    /* open the menu at a setting, scroll to it and make it blink */
    function reveal(el) {
        if (!el) return;
        if (closest(el, '#hotkeys')) { revealHotkeys(el); return; }
        var inTheme = closest(el, '#theme');
        openTab(inTheme ? 'theme' : 'og-settings');
        if (inTheme) {
            var p = closest(el, '.submenu-panel');
            if (p && p.id) clickEl('#theme .submenu-tabs a[href="#' + p.id + '"]');
        }
        var box = closest(el, '.slider-box, .input-box, .color-box, .preset-box, .font-box, label') || el;
        /* the settings search may have filtered it out: clear it (display only) */
        var hidden = closest(box, '.lm-ss-hide');
        if (hidden) {
            var s = D.getElementById('lm-settings-search');
            if (s && s.value) {
                s.value = '';
                try { s.dispatchEvent(new Event('input', { bubbles: true })); } catch (e) { }
            }
            var h = box;
            while (h && h !== D.body) { if (h.classList) h.classList.remove('lm-ss-hide'); h = h.parentNode; }
        }
        var scroll = function () {
            try { box.scrollIntoView({ block: 'center' }); } catch (e) { try { box.scrollIntoView(); } catch (e2) { } }
            try { if (W.jQuery) W.jQuery(closest(box, '.submenu-panel, .menu-panel')).perfectScrollbar('update'); } catch (e) { }
        };
        setTimeout(function () {
            scroll();
            box.style.setProperty('--lm-cc-mc', mainColor());
            box.classList.remove('lm-cc-flash');
            void box.offsetWidth;
            box.classList.add('lm-cc-flash');
            setTimeout(function () { box.classList.remove('lm-cc-flash'); }, 2400);
        }, 200);
        setTimeout(scroll, 650);
    }
    /* shared with the radial menu (smalltools.js): W.LMCommandCentre.tapHotkey */
    var tapHotkey = makeTapper({
        command: function (id) {
            var c = W.hotkeysCommand && W.hotkeysCommand[id];
            if (!c || typeof c.keyDown !== 'function') return null;
            /* a failing command must not stop the palette */
            return {
                keyDown: function () { try { c.keyDown(); } catch (e) { console.warn('[LM] Command Centre:', id, e); } },
                keyUp: typeof c.keyUp === 'function' ? function () { try { c.keyUp(); } catch (e) { } } : null
            };
        },
        /* a key, mouse button (ogario.v4.js) or gamepad button holding the command */
        held: function (id) { try { return typeof W._lmHotkeyHeld === 'function' && !!W._lmHotkeyHeld(id); } catch (e) { return false; } },
        setTimeout: function (f, ms) { return setTimeout(f, ms); },
        clearTimeout: function (h) { clearTimeout(h); }
    });
    api.tapHotkey = function (id) { return tapHotkey(id); };
    function runHotkey(id) { tapHotkey(id); }
    /* run an item; returns true when the palette should stay open (switches) */
    function run(item, fromBar) {
        if (!item) return false;
        state = withRecent(load(), item.id);
        save();
        if (item.kind === 'opt') {
            if (!D.body.contains(item.el)) {
                /* the menu was rebuilt since the list was read */
                items(true);
                var f = find(item.id);
                if (!f || !D.body.contains(f.el)) return false;
                item = f;
            }
            if (toggleOpt(item.el) === null) {
                try { if (W.toastr) W.toastr.info(t('locked')); } catch (e) { }
            }
            syncBar();
            return !fromBar;
        }
        close();
        /* after the palette is gone, so a command that focuses something (chat) keeps it */
        setTimeout(function () {
            try {
                if (item.kind === 'hk') runHotkey(item.cmd);
                else if (item.kind === 'win' && item.win) item.win.run();
                else if (item.kind === 'win' || item.kind === 'tab') {
                    var href = (item.el.getAttribute('href') || '');
                    if (closest(item.el, '#theme')) { openTab('theme'); item.el.click(); }
                    else if (item.el.classList.contains('hotkeys-link')) item.el.click();
                    else openTab(href.replace(/^#/, ''));
                }
                else if (item.kind === 'set' || item.kind === 'sec') reveal(item.el);
            } catch (e) { console.warn('[LM] Command Centre:', item.id, e); }
            syncBar();
        }, 0);
        return false;
    }

    /* ═══ Palette ═══ */

    var root = null, input = null, list = null, rows = [], sel = 0, lastFocus = null, closeBtn = null, foot = null;
    function injectStyle() {
        /* the shared window look (LMexpress.js) */
        if (typeof W.lmUiKit === 'function') W.lmUiKit();
        if (D.getElementById('lm-cc-style')) return;
        var st = D.createElement('style');
        st.id = 'lm-cc-style';
        st.textContent =
            '#lm-cc{position:fixed;left:0;top:0;right:0;bottom:0;z-index:999993;display:flex;align-items:flex-start;justify-content:center;' +
            'background:rgba(0,0,0,.55);padding:10vh 16px 16px;box-sizing:border-box;font-family:inherit}' +
            '#lm-cc *{box-sizing:border-box}' +
            // i18n-ok: CSS
            '#lm-cc .lm-cc-panel{width:640px;max-width:100%;max-height:100%;display:flex;flex-direction:column;background:var(--lm-w-bg,var(--cc-bg));color:var(--cc-tx);font-size:var(--lm-w-fs,12px);' +
            'border:1px solid var(--cc-bg2);border-top:3px solid var(--cc-mc);border-radius:var(--lm-radius,6px);box-shadow:0 8px 32px rgba(0,0,0,.5);overflow:hidden}' +
            '#lm-cc .lm-cc-head{display:flex;align-items:center;gap:var(--lm-w-gap,6px);padding:var(--lm-w-hpad,8px);border-bottom:1px solid var(--cc-bg2);background:var(--lm-w-head,linear-gradient(180deg,var(--cc-bg2) 0%,var(--cc-bg) 100%));flex:0 0 auto}' +
            '#lm-cc-q{flex:1;min-width:0;height:var(--lm-w-x,38px);font-size:13px;padding:0 10px;background:var(--lm-w-field,rgba(0,0,0,.25));color:var(--cc-tx);border:1px solid var(--cc-bg2);border-radius:var(--lm-radius-s,4px);outline:none;font-family:inherit;-webkit-appearance:none}' +
            '#lm-cc-q:focus{border-color:var(--cc-mc)}' +
            '#lm-cc .lm-cc-x{flex:0 0 auto;width:var(--lm-w-x,44px);height:var(--lm-w-x,38px);border:0;border-radius:var(--lm-radius-s,4px);background:var(--lm-w-btn,rgba(255,255,255,.05));color:var(--cc-tx2);font-size:18px;line-height:1;cursor:pointer}' +
            '#lm-cc .lm-cc-list{flex:1 1 auto;overflow-y:auto;min-height:60px;max-height:60vh;-webkit-overflow-scrolling:touch;overscroll-behavior:contain}' +
            '#lm-cc .lm-cc-grp{padding:6px 10px 2px;font-size:10px;letter-spacing:1px;text-transform:uppercase;color:var(--cc-tx2)}' +
            '#lm-cc .lm-cc-row{display:flex;align-items:center;gap:8px;padding:3px 4px 3px 8px;min-height:32px;cursor:pointer;border-left:3px solid transparent}' +
            '#lm-cc .lm-cc-row.sel{background:var(--cc-bg2);border-left-color:var(--cc-mc)}' +
            '#lm-cc .lm-cc-kind{flex:0 0 auto;font-size:9px;text-transform:uppercase;letter-spacing:.5px;padding:2px 4px;border-radius:var(--lm-radius-s,3px);background:rgba(127,127,127,.2);color:var(--cc-tx2);width:62px;text-align:center;overflow:hidden;white-space:nowrap}' +
            '#lm-cc .lm-cc-main{flex:1 1 auto;min-width:0;display:flex;flex-direction:column}' +
            '#lm-cc .lm-cc-label{font-size:var(--lm-w-fs,13px);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
            '#lm-cc .lm-cc-sub{font-size:var(--lm-w-fs-s,10px);color:var(--cc-tx2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
            '#lm-cc .lm-cc-kbd{flex:0 0 auto;font:11px monospace;padding:1px 5px;border:1px solid var(--cc-tx2);border-radius:var(--lm-radius-s,3px);color:var(--cc-tx2);white-space:nowrap}' +
            '#lm-cc .lm-cc-tag{flex:0 0 auto;font-size:9px;padding:1px 4px;border-radius:var(--lm-radius-s,3px);border:1px dashed var(--cc-tx2);color:var(--cc-tx2)}' +
            '#lm-cc .lm-cc-pill{flex:0 0 auto;font-size:10px;font-weight:700;padding:2px 7px;border-radius:9px;background:rgba(127,127,127,.3);color:var(--cc-tx)}' +
            '#lm-cc .lm-cc-pill.on{background:var(--cc-mc);color:var(--cc-bg)}' +
            '#lm-cc .lm-cc-star{flex:0 0 auto;width:36px;height:32px;border:0;background:transparent;color:var(--cc-tx2);font-size:17px;line-height:1;cursor:pointer;border-radius:var(--lm-radius-s,4px);padding:0}' +
            '#lm-cc .lm-cc-star.on{color:#ffd54a}' +
            '#lm-cc .lm-cc-empty{padding:14px;text-align:center;color:var(--cc-tx2)}' +
            '#lm-cc .lm-cc-foot{flex:0 0 auto;padding:5px 12px;font-size:var(--lm-w-fs-s,10px);color:var(--cc-tx2);border-top:1px solid var(--cc-bg2)}' +
            '@media (max-height:500px){#lm-cc{padding-top:6px;padding-bottom:6px}#lm-cc .lm-cc-list{max-height:none}}' +
            '@media (pointer:coarse){#lm-cc .lm-cc-row{min-height:44px}#lm-cc .lm-cc-star{width:44px;height:44px}#lm-cc .lm-cc-foot{display:none}}' +
            '.lm-cc-flash{outline:2px solid var(--lm-cc-mc,#01d9cc)!important;outline-offset:2px;animation:lmccflash .6s ease-in-out 4}' +
            '@keyframes lmccflash{50%{outline-color:transparent}}' +
            '#lm-cc-bar{position:fixed;z-index:99;display:flex;flex-direction:row;gap:4px;pointer-events:auto;user-select:none;-webkit-user-select:none}' +
            '#lm-cc-bar.col{flex-direction:column;align-items:flex-start}' +
            /* HUD font weight and scale (Theme > HUD) */
            '#lm-cc-bar .lm-cc-bb{height:calc(26px * var(--lm-hud-scale,1));max-width:calc(110px * var(--lm-hud-scale,1));padding:0 .8em;font-weight:var(--lm-hud-fw,600);font-size:calc(11px * var(--lm-hud-scale,1));font-family:inherit;color:var(--lm-hud-tc,rgba(255,255,255,.9));background:var(--lm-hud-bg,rgba(0,0,0,.45));' +
            'border:1px solid rgba(255,255,255,.2);border-radius:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:pointer;touch-action:manipulation}' +
            '#lm-cc-bar .lm-cc-bb.on{border-color:var(--lm-hud-mc,var(--lm-cc-mc,#01d9cc));color:var(--lm-hud-mc,var(--lm-cc-mc,#01d9cc))}' +
            '#lm-cc-bar .lm-cc-bb:hover{background:rgba(0,0,0,.65)}' +
            '@media (pointer:coarse){#lm-cc-bar .lm-cc-bb{height:max(40px,calc(40px * var(--lm-hud-scale,1)));min-width:40px;border-radius:20px;font-size:calc(12px * var(--lm-hud-scale,1))}}';
        (D.head || D.documentElement).appendChild(st);
    }
    function mk(tag, cls, text) {
        var e = D.createElement(tag);
        if (cls) e.className = cls;
        if (text != null) e.textContent = text;
        return e;
    }
    function stopGame(e) { e.stopPropagation(); }
    /* mouse buttons and the wheel run game actions (feed, split, zoom) from window handlers */
    function shield(el) {
        ['mousedown', 'mouseup', 'click', 'dblclick', 'contextmenu', 'wheel', 'pointerdown', 'pointerup'].forEach(function (ev) {
            el.addEventListener(ev, stopGame, false);
        });
    }
    function build() {
        injectStyle();
        root = mk('div');
        root.id = 'lm-cc';
        root.setAttribute('role', 'dialog');
        root.setAttribute('aria-modal', 'true');
        var panel = mk('div', 'lm-cc-panel lm-modal-container lm-w');
        var head = mk('div', 'lm-cc-head');
        input = mk('input');
        input.id = 'lm-cc-q';
        input.type = 'search';
        input.setAttribute('autocomplete', 'off');
        input.setAttribute('spellcheck', 'false');
        input.setAttribute('aria-controls', 'lm-cc-list');
        var x = closeBtn = mk('button', 'lm-cc-x', '\u00d7');
        x.type = 'button';
        head.appendChild(input);
        head.appendChild(x);
        list = mk('div', 'lm-cc-list');
        list.id = 'lm-cc-list';
        list.setAttribute('role', 'listbox');
        foot = mk('div', 'lm-cc-foot');
        panel.appendChild(head);
        panel.appendChild(list);
        panel.appendChild(foot);
        root.appendChild(panel);
        shield(root);
        applyTexts();
        input.addEventListener('input', function () { sel = 0; render(); });
        root.addEventListener('keydown', onKey, false);
        root.addEventListener('keyup', stopGame, false);
        root.addEventListener('keypress', stopGame, false);
        x.addEventListener('click', function (e) { e.preventDefault(); close(); });
        root.addEventListener('click', function (e) {
            if (e.target === root) { close(); return; }
            var star = closest(e.target, '.lm-cc-star');
            var row = closest(e.target, '.lm-cc-row');
            if (!row) return;
            var r = rows[+row.getAttribute('data-i')];
            if (!r) return;
            e.preventDefault();
            if (star) { toggleFav(r.item); return; }
            sel = +row.getAttribute('data-i');
            activate(r.item);
        });
        /* a click on the panel took the focus off the box, and keys then went to the game */
        root.addEventListener('mouseup', function (e) {
            if (!isOpen() || coarse() || D.activeElement === input) return;
            if (closest(e.target, 'input, button, a')) return;
            setTimeout(function () { if (isOpen()) { try { input.focus(); } catch (er) { } } }, 0);
        });
        list.addEventListener('mousemove', function (e) {
            var row = closest(e.target, '.lm-cc-row');
            if (!row) return;
            var i = +row.getAttribute('data-i');
            if (i !== sel) { sel = i; mark(false); }
        });
    }
    /* the palette's own texts (again after a language change); Arabic reads right to left */
    function applyTexts() {
        if (!root) return;
        root.setAttribute('aria-label', t('title'));
        try { root.setAttribute('dir', W.LMi18n && W.LMi18n.dir ? W.LMi18n.dir() : 'ltr'); } catch (e) { }
        closeBtn.setAttribute('aria-label', t('close'));
        closeBtn.title = t('close');
        foot.textContent = t('help');
        input.placeholder = t('ph');
    }
    function onKey(e) {
        e.stopPropagation();
        var k = e.key, kc = e.keyCode;
        if (k === 'Escape' || kc === 27) { e.preventDefault(); close(); return; }
        if ((e.ctrlKey || e.metaKey) && !e.altKey && (kc === 75 || k === 'k' || k === 'K')) { e.preventDefault(); close(); return; }
        if (k === 'ArrowDown' || kc === 40) { e.preventDefault(); move(1); return; }
        if (k === 'ArrowUp' || kc === 38) { e.preventDefault(); move(-1); return; }
        if (k === 'PageDown' || kc === 34) { e.preventDefault(); move(8); return; }
        if (k === 'PageUp' || kc === 33) { e.preventDefault(); move(-8); return; }
        /* Tab moves through the list instead of leaving the palette for the game */
        if (k === 'Tab' || kc === 9) { e.preventDefault(); move(e.shiftKey ? -1 : 1); return; }
        if ((k === 'Enter' || kc === 13) && (e.target === input || closest(e.target, '.lm-cc-list'))) {
            e.preventDefault();
            var r = rows[sel];
            if (r) activate(r.item);
        }
    }
    function move(d) {
        if (!rows.length) return;
        if (Math.abs(d) === 1) sel = (sel + d + rows.length) % rows.length;
        else sel = Math.max(0, Math.min(rows.length - 1, sel + d));
        mark(true);
    }
    function mark(scroll) {
        var els = list.querySelectorAll('.lm-cc-row');
        for (var i = 0; i < els.length; i++) {
            var on = +els[i].getAttribute('data-i') === sel;
            els[i].classList.toggle('sel', on);
            els[i].setAttribute('aria-selected', on ? 'true' : 'false');
            if (on) {
                input.setAttribute('aria-activedescendant', els[i].id);
                if (scroll) { try { els[i].scrollIntoView({ block: 'nearest' }); } catch (e) { } }
            }
        }
    }
    /* 'set' (sliders, colours...) shows as "Setting" like the switches */
    function kindLabel(it) { return it.theme ? t('theme') : t(it.kind === 'set' ? 'opt' : it.kind); }
    function rowEl(r, i) {
        var it = r.item;
        var row = mk('div', 'lm-cc-row');
        row.id = 'lm-cc-r' + i;
        row.setAttribute('role', 'option');
        row.setAttribute('data-i', i);
        row.setAttribute('data-id', it.id);
        row.appendChild(mk('span', 'lm-cc-kind', kindLabel(it)));
        var main = mk('span', 'lm-cc-main');
        main.appendChild(mk('span', 'lm-cc-label', it.label));
        var sub = it.section || '';
        if (it.en && normalize(it.en) !== normalize(it.label)) sub = (sub ? sub + ' \u00b7 ' : '') + it.en;
        if (sub) main.appendChild(mk('span', 'lm-cc-sub', sub));
        row.appendChild(main);
        if (it.kind === 'hk') {
            if (it.hold) {
                var tag = mk('span', 'lm-cc-tag', t('hold'));
                tag.title = t('holdTip');
                row.appendChild(tag);
            }
            if (it.keyName) row.appendChild(mk('kbd', 'lm-cc-kbd', it.keyName));
        } else if (it.kind === 'opt') {
            var on = !!(it.el && it.el.checked);
            row.appendChild(mk('span', 'lm-cc-pill' + (on ? ' on' : ''), on ? t('on') : t('off')));
        } else if (it.kind === 'set' && it.el && it.el.type === 'range') {
            row.appendChild(mk('span', 'lm-cc-kbd', String(it.el.value)));
        }
        var fav = state.fav.indexOf(it.id) !== -1;
        var star = mk('button', 'lm-cc-star' + (fav ? ' on' : ''), fav ? '\u2605' : '\u2606');
        star.type = 'button';
        star.tabIndex = -1;
        star.title = t('star');
        star.setAttribute('aria-label', t('star'));
        star.setAttribute('aria-pressed', fav ? 'true' : 'false');
        row.appendChild(star);
        return row;
    }
    function render() {
        if (!list) return;
        var q = input.value;
        var ranked = rank(items(), q, state);
        if (q) ranked = ranked.slice(0, 60);
        else ranked = ranked.slice(0, 150);
        rows = ranked;
        if (sel >= rows.length) sel = Math.max(0, rows.length - 1);
        var top = list.scrollTop;
        list.textContent = '';
        if (!rows.length) {
            list.appendChild(mk('div', 'lm-cc-empty', t('none')));
            return;
        }
        var frag = D.createDocumentFragment(), grp = -1;
        for (var i = 0; i < rows.length; i++) {
            if (!q && rows[i].group !== grp) {
                grp = rows[i].group;
                frag.appendChild(mk('div', 'lm-cc-grp', grp === 0 ? t('fav') : grp === 1 ? t('recent') : t('all')));
            }
            frag.appendChild(rowEl(rows[i], i));
        }
        list.appendChild(frag);
        list.scrollTop = top;
        mark(false);
    }
    function activate(item) {
        var keep = run(item, false);
        if (keep && isOpen()) {
            render();
            /* it is now a recent item and may have moved: keep it selected */
            for (var i = 0; i < rows.length; i++) if (rows[i].item.id === item.id) { sel = i; break; }
            mark(true);
            if (!coarse()) input.focus();
        }
    }
    function toggleFav(item) {
        var on = state.fav.indexOf(item.id) === -1;
        state = withFav(load(), item.id, on);
        save();
        render();
        syncBar(true);
    }
    function coarse() {
        try { return !!(W.matchMedia && W.matchMedia('(pointer: coarse)').matches); } catch (e) { return false; }
    }
    function themeVars() {
        var ds = W.defaultSettings || {};
        var ok = function (v, d) { return typeof v === 'string' && /^#[0-9a-f]{3,8}$|^rgba?\([\d\s.,%]+\)$/i.test(v) ? v : d; };
        /* the theme variables (--lm-*) first, so the open palette follows a theme change */
        root.style.setProperty('--cc-mc', 'var(--lm-mc,' + ok(ds.menuMainColor, '#01d9cc') + ')');
        root.style.setProperty('--cc-bg', 'var(--lm-pc,' + ok(ds.menuPanelColor, '#00243e') + ')');
        root.style.setProperty('--cc-bg2', 'var(--lm-pc2,' + ok(ds.menuPanelColor2, '#002f52') + ')');
        root.style.setProperty('--cc-tx', 'var(--lm-tc,' + ok(ds.menuTextColor, '#ffffff') + ')');
        root.style.setProperty('--cc-tx2', 'var(--lm-tc2,' + ok(ds.menuTextColor2, '#8096a7') + ')');
    }
    function isOpen() { return !!(root && root.parentNode); }
    function open(query) {
        if (!D.body) return;
        if (!root) build();
        state = load();
        lastFocus = D.activeElement;
        themeVars();
        applyTexts();
        if (!isOpen()) D.body.appendChild(root);
        input.value = typeof query === 'string' ? query : '';
        sel = 0;
        items(true);
        render();
        list.scrollTop = 0;
        /* a phone keyboard would cover the list: there the box is focused only when tapped */
        if (!coarse()) { try { input.focus(); } catch (e) { } }
    }
    function close() {
        if (!isOpen()) return;
        if (root.contains(D.activeElement)) { try { D.activeElement.blur(); } catch (e) { } }
        root.parentNode.removeChild(root);
        try {
            if (lastFocus && lastFocus !== D.body && D.body.contains(lastFocus) && lastFocus.focus && !/^(INPUT|TEXTAREA|SELECT)$/.test(lastFocus.tagName)) lastFocus.focus();
        } catch (e) { }
        lastFocus = null;
    }
    function toggle() { if (isOpen()) close(); else open(); }

    /* ═══ Ctrl+K ═══ */

    function gamePage() { return !!(D.getElementById('canvas') && W.application); }
    function typingTarget(el) {
        if (!el) return false;
        var tn = el.tagName;
        return tn === 'INPUT' || tn === 'TEXTAREA' || tn === 'SELECT' || el.isContentEditable === true;
    }
    W.addEventListener('keydown', function (e) {
        /* Esc with the focus outside the palette (phone, or after a click elsewhere) closes it
         * and does not also open the game menu */
        if (isOpen() && (e.keyCode === 27 || e.key === 'Escape') && !root.contains(e.target)) {
            e.preventDefault();
            e.stopPropagation();
            close();
            return;
        }
        if (!e.ctrlKey || e.altKey || e.metaKey || e.keyCode !== 75) return;
        if (isOpen() && root.contains(e.target)) return; /* the palette's own handler closes it */
        if (e.repeat || !gamePage() || typingTarget(e.target) || typingTarget(D.activeElement)) return;
        /* Ctrl+K bound to a hotkey: the player's binding wins */
        var hk = W.hotkeys;
        if (hk && typeof hk['CTRL+K'] === 'string' && hk['CTRL+K'] && W.hotkeysCommand && W.hotkeysCommand[hk['CTRL+K']]) return;
        e.preventDefault(); /* the browser's Ctrl+K (search bar) */
        e.stopPropagation();
        toggle();
    }, true);

    /* ═══ Button in the Tools tab, under User Scripts ═══
     * The one direct way in without a keyboard (phones, tablets): Ctrl+K and the hotkey need
     * keys, the quick bar is off by default. Not in the Settings tab (its presets row stays
     * free of it). The menu builds the Tools tab late, so the 1 s timer below tries again. */

    function addMenuButton() {
        if (D.getElementById('lm-cc-open')) return true;
        var us = D.getElementById('OpenuserScripts');
        if (!us || !us.parentNode) return false;
        var b = mk('button', 'btn btn-primary lm-cc-open-btn');
        b.id = 'lm-cc-open';
        b.type = 'button';
        b.style.cssText = 'margin-top:2px;display:block;width:100%;padding:4px 0 6px 0;';
        menuButtonTexts(b);
        b.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); open(); });
        us.parentNode.insertBefore(b, us.nextSibling);
        return true;
    }

    function menuButtonTexts(b) {
        /* the icon like the other Tools buttons */
        b.textContent = t('title');
        b.insertBefore(mk('i', 'fa fa-search'), b.firstChild);
        b.title = t('title') + ' (Ctrl+K)';
    }

    /* ═══ Quick bar with the favourites (option commandCentreBar) ═══ */

    var bar = null, barSig = '', barPos = null;
    /* every HUD box (#overlays-hud children: stats, team, leaderboard, target icons...), the leaderboard
     * mass column (drawn outside its box) and the phone controls */
    var AVOID = '#overlays-hud > *, #leaderboard-hud, #leaderboard-data, #leaderboard-positions, #minimap-hud, #chat-box, #messages, #message-box, #top5-hud, #stats-hud, #time-hud, #target-hud, ' +
        '#pause-hud, #quest-hud, #lm-event-banner, #lm-net-graph, #lm-stats, #lm-mc-l, #lm-mc-r, #lm-mc-sm, #lm-drawer, #lm-sp, #lm-replay-bar, ' +
        '#lm-session-stats, .lm-jo, #lm-portrait-ov';
    function barWanted() {
        var s = W.legendmod5 || W.defaultmapsettings;
        return !!(s && s.commandCentreBar) && !!D.body && gamePage();
    }
    function visibleRect(el) {
        if (!el || !el.getBoundingClientRect) return null;
        var r = el.getBoundingClientRect();
        if (r.width < 1 || r.height < 1) return null;
        var cs = W.getComputedStyle ? W.getComputedStyle(el) : null;
        if (cs && (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0)) return null;
        return { left: r.left, top: r.top, right: r.right, bottom: r.bottom };
    }
    function avoidRects() {
        var out = [], els = D.querySelectorAll(AVOID);
        for (var i = 0; i < els.length; i++) { var r = visibleRect(els[i]); if (r) out.push(r); }
        return out;
    }
    /* something else that takes clicks under the spot (sampled points)? */
    function busy(r) {
        if (!D.elementFromPoint) return false;
        var pts = [[0.5, 0.5], [0.1, 0.2], [0.9, 0.2], [0.1, 0.8], [0.9, 0.8]];
        for (var i = 0; i < pts.length; i++) {
            var x = r.left + (r.right - r.left) * pts[i][0], y = r.top + (r.bottom - r.top) * pts[i][1];
            var el = D.elementFromPoint(x, y);
            if (!el || el === D.body || el === D.documentElement || el.tagName === 'CANVAS' || (bar && bar.contains(el))) continue;
            if (el.id === 'overlays' || el.id === 'helloContainer') continue;
            return true;
        }
        return false;
    }
    function favItems() {
        var out = [];
        for (var i = 0; i < state.fav.length && out.length < MAX_BAR; i++) {
            var it = find(state.fav[i]);
            if (it) out.push(it);
        }
        return out;
    }
    function barLabel(it) {
        var s = String(it.label || '');
        return s.length > 18 ? s.slice(0, 17) + '\u2026' : s;
    }
    function measure(dir) {
        bar.className = dir === 'col' ? 'col' : '';
        var r = bar.getBoundingClientRect();
        return { w: Math.ceil(r.width), h: Math.ceil(r.height) };
    }
    function placeNow() {
        if (!bar || !bar.parentNode) return;
        /* the open menu covers everything: keep the last spot */
        if (menuOpen() && barPos) return;
        bar.style.visibility = 'hidden';
        bar.style.left = '0px';
        bar.style.top = '0px';
        var row = measure('row'), col = measure('col');
        var p = placeBar({ w: W.innerWidth, h: W.innerHeight }, row, col, avoidRects(), menuOpen() ? null : busy);
        bar.className = p.dir === 'col' ? 'col' : '';
        bar.style.left = p.x + 'px';
        bar.style.top = p.y + 'px';
        bar.style.visibility = '';
        barPos = p;
    }
    function syncBar(force) {
        if (!barWanted()) {
            if (bar && bar.parentNode) bar.parentNode.removeChild(bar);
            barPos = null;
            return;
        }
        state = load();
        var favs = favItems();
        if (!favs.length) {
            if (bar && bar.parentNode) bar.parentNode.removeChild(bar);
            barPos = null;
            return;
        }
        injectStyle();
        if (!bar) {
            bar = mk('div');
            bar.id = 'lm-cc-bar';
            bar.setAttribute('role', 'toolbar');
            shield(bar);
            bar.addEventListener('click', function (e) {
                var b = closest(e.target, '.lm-cc-bb');
                if (!b) return;
                e.preventDefault();
                if (b.id === 'lm-cc-bar-open') { open(); return; }
                var it = find(b.getAttribute('data-id'));
                if (it) run(it, true);
            });
        }
        bar.setAttribute('aria-label', t('title'));
        var sig = lang() + '|' + favs.map(function (f) { return f.id + '=' + f.label; }).join('|');
        if (force || sig !== barSig || !bar.childNodes.length) {
            barSig = sig;
            bar.textContent = '';
            var ob = mk('button', 'lm-cc-bb', '\u2318');
            ob.id = 'lm-cc-bar-open';
            ob.type = 'button';
            ob.title = t('title');
            ob.setAttribute('aria-label', t('title'));
            bar.appendChild(ob);
            favs.forEach(function (it) {
                var b = mk('button', 'lm-cc-bb', barLabel(it));
                b.type = 'button';
                b.setAttribute('data-id', it.id);
                b.title = it.label + (it.keyName ? ' (' + it.keyName + ')' : '');
                bar.appendChild(b);
            });
        }
        bar.style.setProperty('--lm-cc-mc', mainColor());
        var btns = bar.querySelectorAll('.lm-cc-bb[data-id]');
        for (var i = 0; i < btns.length; i++) {
            var it = find(btns[i].getAttribute('data-id'));
            var on = !!(it && it.kind === 'opt' && it.el && it.el.checked);
            btns[i].classList.toggle('on', on);
            if (it && it.kind === 'opt') btns[i].setAttribute('aria-pressed', on ? 'true' : 'false');
        }
        if (!bar.parentNode) { barPos = null; D.body.appendChild(bar); }
        placeNow();
    }

    /* ═══ Start ═══ */

    var ticks = 0;
    setInterval(function () {
        ticks++;
        if (!D.getElementById('lm-cc-open')) addMenuButton();
        /* option off: only this check, once a second */
        if (barWanted() || bar && bar.parentNode) {
            try { syncBar(false); } catch (e) { }
        }
    }, 1000);
    D.addEventListener('change', function (e) {
        if (e.target && e.target.id === 'commandCentreBar') setTimeout(function () { syncBar(true); }, 0);
        else if (bar && bar.parentNode && e.target && e.target.type === 'checkbox') setTimeout(function () { syncBar(false); }, 0);
    }, false);
    W.addEventListener('resize', function () { if (bar && bar.parentNode) { barPos = null; setTimeout(placeNow, 50); } });
    /* another language: the labels are read again (after the menu got its new texts) */
    if (W.LMi18n && typeof W.LMi18n.onChange === 'function') {
        W.LMi18n.onChange(function () {
            setTimeout(function () {
                cache = null;
                var mb = D.getElementById('lm-cc-open');
                if (mb) menuButtonTexts(mb);
                if (root) applyTexts();
                if (isOpen()) { items(true); render(); }
                if (bar && bar.parentNode) syncBar(true);
            }, 0);
        });
    }

    api.open = open;
    api.close = close;
    api.toggle = toggle;
    api.isOpen = isOpen;
    api.items = function () { return items(true).slice(); };
    api.run = function (id) { var it = find(id); return it ? (run(it, true), true) : false; };
    api.favourites = function () { return state.fav.slice(); };
    api.syncBar = function () { syncBar(true); };
    /* open the menu at a setting (an option key or element id) and make it blink; for other windows (Discover features) */
    api.reveal = function (key) {
        if (typeof key !== 'string' || !/^[A-Za-z0-9_-]{1,80}$/.test(key)) return false;
        var el = D.getElementById(key + '-slider') || D.getElementById(key);
        if (!el || !closest(el, '#og-options, #theme, #lm-hk-controls')) return false;
        reveal(el);
        return true;
    };
})();
