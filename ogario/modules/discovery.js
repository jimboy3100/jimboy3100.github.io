/* Legend Mod "Discover features" guide.
 *
 * Discover features: one short card per optional feature (HUD helpers, Replay Studio,
 * Analytics, ...) with what it does, one-tap switches for its options (the real menu checkboxes, so
 * setSettings, saving and the NEW badges stay as they are), "Open" for its window and "Show in
 * settings", which opens the menu at the option and makes it blink (LMSmallTools.jump). A
 * switch with a HUD part (bell, cell panel) highlights where it appeared.
 *
 * It never opens by itself (it used to open once after an update, with a "Show after updates"
 * switch, and from a link in the "What's new" toast).
 * Cards the player has not seen are marked NEW (a card changed since gets cv: 2, 3... and is NEW
 * again); the card ids seen and the last version are in localStorage 'lmDiscover' (validated on read).
 * It has no menu entry; scripts open it with LMDiscovery.open(). (Its "What works on this
 * server" table window is removed; Settings keeps its own table for the dimmed "Not available on this server" notes.)
 *
 * The pure parts are in LMDiscovery.core (developers/tests/discovery.js runs this file in a vm).
 */
(function () {
    'use strict';
    var W = typeof window !== 'undefined' ? window : this;
    if (W._lmDiscoveryLoaded) return;
    W._lmDiscoveryLoaded = true;

    var KEY = 'lmDiscover';
    var MAX_SEEN = 100;

    /* texts from the language packs (developers/i18n/src) */
    var P = 'modules.discovery.';
    function t(k, vars) { return typeof W.lmT === 'function' ? W.lmT(P + k, vars) : k; }

    /* ═══ Stored state ═══ */

    function parseStore(raw) {
        var o = null;
        if (typeof raw === 'string' && raw.length < 20000) { try { o = JSON.parse(raw); } catch (e) { o = null; } }
        if (!o || typeof o !== 'object' || Array.isArray(o)) return { v: '', seen: [], had: false };
        var seen = [];
        if (Array.isArray(o.seen)) {
            for (var i = 0; i < o.seen.length && seen.length < MAX_SEEN; i++) {
                var s = o.seen[i];
                if (typeof s === 'string' && /^[A-Za-z0-9_-]{1,40}$/.test(s) && seen.indexOf(s) < 0) seen.push(s);
            }
        }
        /* 'off' of older versions (the "Show after updates" switch) is dropped: nothing opens by itself */
        return { v: typeof o.v === 'string' ? o.v.slice(0, 40) : '', seen: seen, had: true };
    }
    function serializeStore(st) {
        return JSON.stringify({ v: st.v || '', seen: (st.seen || []).slice(0, MAX_SEEN) });
    }
    function unseenIds(st, ids) {
        return ids.filter(function (id) { return st.seen.indexOf(id) < 0; });
    }
    /* what is kept in 'seen' for a card: its id, plus '-v2'... once the card was changed (cv), so
     * a changed card is NEW again by itself; the stored format stays a list of ids */
    function seenKey(card) {
        var v = card && +card.cv;
        return v > 1 ? card.id + '-v' + Math.floor(v) : card.id;
    }
    /* marks the cards seen, dropping older versions of the same cards */
    function markSeen(st, cards) {
        cards.forEach(function (c) {
            var k = seenKey(c), re = new RegExp('^' + c.id + '(-v[0-9]+)?$');
            st.seen = st.seen.filter(function (s) { return s === k || !re.test(s); });
            if (st.seen.indexOf(k) < 0) st.seen.push(k);
        });
        if (st.seen.length > MAX_SEEN) st.seen = st.seen.slice(st.seen.length - MAX_SEEN);
        return st;
    }

    /* ═══ Feature cards ═══ */

    /* name and text: card.<id> and card.<id>.desc in the packs; opts: option keys (checkboxes of the settings menu); show: where a switched-on option appears;
     * open: the window, avail: whether it can be opened here */
    function fn(path) {
        return function () {
            var o = W, p = path.split('.');
            for (var i = 0; i < p.length - 1; i++) { o = o && o[p[i]]; }
            return o && typeof o[p[p.length - 1]] === 'function' ? o : null;
        };
    }
    function opener(path, arg) {
        var get = fn(path), name = path.split('.').pop();
        return { avail: function () { return !!get(); }, run: function () { var o = get(); if (o) o[name](arg); } };
    }
    /* the game stats (Dashboard, Heatmaps, Coach, Objectives) are views of the Replays window */
    var statsWin = {
        avail: function () { return typeof W.lmReplayStudio === 'function'; },
        run: function () { if (typeof W.lmReplayStudio === 'function') W.lmReplayStudio('view', 'dash'); }
    };
    /* (removed since, so without a card: the merge countdown and cell panel, the Record replays and
     * Analytics switches (every game is recorded), the kill feed and the mass-loss alert, Performance mode and its window,
     * the settings profiles window, the stream companion and the custom macros) */
    var CARDS = [
        { id: 'hudHelpers', opts: ['hudMoveDir', 'hudMergeSound', 'hudRelativeMass', 'hudEdgeTeammates', 'hudEdgeThreats'] },
        { id: 'replayStudio', opts: [], win: opener('lmReplayStudio', 'open') },
        { id: 'analytics', opts: [], win: statsWin },
        { id: 'deathRecap', opts: ['gameOverStats'] },
        { id: 'gamepad', opts: [], win: opener('LMGamepad.openWindow') },
        { id: 'notifications', opts: ['notificationCentre'], show: { notificationCentre: '#lm-notif-bell' }, win: opener('LMNotifications.open') },
        { id: 'hudEditor', opts: [], win: opener('LMHudEditor.open') },
        { id: 'director', opts: [], win: opener('LMDirector.open') },
        { id: 'touchEditor', opts: [], win: opener('_lmMobileHost.openEditor'), phoneOnly: true },
        { id: 'practice', opts: [], win: opener('lmPractice', 'open') },
        { id: 'themeWorkshop', opts: [], win: opener('LMThemeWorkshop.open') },
        { id: 'accessibility', opts: ['reducedMotion'] },
        /* the Lab experiments are in the User Scripts window (no card of their own) */
        { id: 'plugins', opts: [], win: opener('LMPlugins.open', 'plugins') }
    ];
    var CARD_IDS = CARDS.map(function (c) { return c.id; });

    /* a switch goes through the real checkbox, as the presets do: the
     * bubbling change runs setSettings (side effects, save) and moves the Switchery. A switch the
     * menu shows as unavailable (disabled, read-only) is refused: null */
    function toggleBox(cb) {
        try {
            if (!cb || cb.disabled || cb.readOnly || cb.getAttribute('aria-disabled') === 'true' ||
                (typeof cb.closest === 'function' && cb.closest('fieldset[disabled]'))) return null;
        } catch (e) { return null; }
        cb.checked = !cb.checked;
        try { cb.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) {
            try { if (W.application) W.application.setSettings(cb.id, cb.checked); } catch (e2) { }
        }
        return cb.checked;
    }

    var core = {
        toggleBox: toggleBox,
        CARDS: CARDS, KEY: KEY, MAX_SEEN: MAX_SEEN,
        parseStore: parseStore, serializeStore: serializeStore, unseenIds: unseenIds,
        seenKey: seenKey, markSeen: markSeen, t: t
    };
    var api = W.LMDiscovery = { core: core };

    var D = W.document;
    if (!D || typeof D.createElement !== 'function' || typeof D.addEventListener !== 'function') return;

    function plain(s) {
        if (s == null) return '';
        return String(s).replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
    }

    function load() {
        var raw = null;
        try { raw = W.localStorage.getItem(KEY); } catch (e) { }
        return parseStore(raw);
    }
    function save(st) {
        try { W.localStorage.setItem(KEY, serializeStore(st)); } catch (e) { }
    }
    function ver() { return W.OgVer != null ? String(W.OgVer) : ''; }
    function isPhone() { return !!(W._lmMobileHost && typeof W._lmMobileHost.openEditor === 'function'); }
    function visibleCards() { return CARDS.filter(function (c) { return !c.phoneOnly || isPhone(); }); }
    function mainColor() {
        var ds = W.defaultSettings;
        var c = ds && typeof ds.menuMainColor === 'string' && /^#[0-9a-f]{3,8}$|^rgba?\([\d\s.,%]+\)$/i.test(ds.menuMainColor) ? ds.menuMainColor : '#01d9cc';
        /* the theme variable first, so a theme change shows at once */
        return 'var(--lm-mc,' + c + ')';
    }

    /* ═══ Window ═══ */

    var root = null, body = null, msgTimer = null, lastFocus = null;
    function mk(tag, cls, text) {
        var e = D.createElement(tag);
        if (cls) e.className = cls;
        if (text != null) e.textContent = text;
        return e;
    }
    function injectStyle() {
        /* the shared window look (LMexpress.js) */
        if (typeof W.lmUiKit === 'function') W.lmUiKit();
        if (D.getElementById('lm-dc-style')) return;
        var st = D.createElement('style');
        st.id = 'lm-dc-style';
        st.textContent =
            '#lm-dc{position:fixed;left:0;top:0;right:0;bottom:0;z-index:999993;display:flex;align-items:center;justify-content:center;' +
            'background:rgba(0,0,0,.55);padding:8px;box-sizing:border-box;font-family:inherit}#lm-dc:focus{outline:none}' +
            '#lm-dc *{box-sizing:border-box}' +
            // i18n-ok: CSS
            '#lm-dc .lm-dc-panel{width:760px;max-width:100%;max-height:100%;display:flex;flex-direction:column;background:var(--lm-w-bg,var(--lm-pc,#1b1d22));color:var(--lm-tc,#e8e8e8);font-size:var(--lm-w-fs,12px);' +
            'border:1px solid var(--lm-pc2,#333);border-top:3px solid var(--dc-mc);border-radius:var(--lm-radius,6px);box-shadow:0 8px 32px rgba(0,0,0,.5);overflow:hidden}' +
            '#lm-dc .lm-dc-head{display:flex;align-items:center;gap:6px;padding:var(--lm-w-hpad,6px 6px 6px 12px);border-bottom:1px solid var(--lm-pc2,#333);background:var(--lm-w-head,linear-gradient(180deg,var(--lm-pc2,transparent) 0%,var(--lm-pc,transparent) 100%));flex:0 0 auto}' +
            '#lm-dc .lm-dc-title{flex:1 1 auto;min-width:0;font-size:var(--lm-w-title,15px);font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--dc-mc,inherit);text-transform:uppercase;letter-spacing:1px}' +
            '#lm-dc .lm-dc-x{flex:0 0 auto;width:var(--lm-w-x,40px);height:var(--lm-w-x,40px);border:0;border-radius:var(--lm-radius-s,4px);background:var(--lm-w-btn,rgba(255,255,255,.05));color:var(--lm-tc2,#eee);font-size:18px;line-height:1;cursor:pointer}' +
            '#lm-dc .lm-dc-body{flex:1 1 auto;overflow-y:auto;padding:var(--lm-w-pad,8px 10px);-webkit-overflow-scrolling:touch;overscroll-behavior:contain}' +
            '#lm-dc .lm-dc-intro{font-size:var(--lm-w-fs-s,11px);color:var(--lm-tc2,#aaa);margin:0 0 6px}' +
            '#lm-dc .lm-dc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:6px}' +
            '#lm-dc .lm-dc-card{border:1px solid var(--lm-pc2,#333);border-radius:var(--lm-radius,6px);padding:7px 8px;background:var(--lm-pc2,#22252b);display:flex;flex-direction:column;gap:5px}' +
            '#lm-dc .lm-dc-name{font-size:13px;font-weight:700}' +
            '#lm-dc .lm-dc-desc{font-size:var(--lm-w-fs-s,11px);color:var(--lm-tc2,#bbb);line-height:1.35}' +
            '#lm-dc .lm-dc-sw{display:flex;flex-wrap:wrap;gap:4px}' +
            '#lm-dc .lm-dc-chip{min-height:var(--lm-w-ctl,30px);max-width:100%;padding:2px 8px;border:1px solid var(--lm-tc2,#555);border-radius:15px;background:transparent;color:var(--lm-tc,#ddd);font-size:11px;' +
            'cursor:pointer;text-align:left;white-space:normal;touch-action:manipulation}' +
            '#lm-dc .lm-dc-chip b{font-size:9px;margin-right:4px;padding:1px 4px;border-radius:7px;background:rgba(0,0,0,.25);color:var(--lm-tc,#ddd)}' +
            '#lm-dc .lm-dc-chip.on{border-color:var(--dc-mc)}#lm-dc .lm-dc-chip.on b{background:var(--dc-mc);color:var(--lm-pc,#000)}' +
            '#lm-dc .lm-dc-chip:disabled{opacity:.45;cursor:default}' +
            '#lm-dc .lm-dc-acts{display:flex;flex-wrap:wrap;gap:4px;margin-top:auto}' +
            '#lm-dc .lm-dc-btn{min-height:var(--lm-w-ctl,30px);padding:2px 10px;border:1px solid var(--lm-pc2,#555);border-radius:var(--lm-radius-s,4px);background:var(--lm-w-btn,rgba(255,255,255,.05));color:var(--lm-tc,#eee);font-size:var(--lm-w-fs,11px);cursor:pointer;touch-action:manipulation}' +
            '#lm-dc .lm-dc-btn:hover{background:var(--lm-w-btn-h,rgba(255,255,255,.12))}' +
            '#lm-dc .lm-dc-btn.pri{border-color:var(--dc-mc);color:var(--lm-w-acc,var(--dc-mc))}' +
            '#lm-dc .lm-dc-msg{font-size:11px;color:var(--dc-mc);min-height:0}' +
            '#lm-dc .lm-new-badge{display:inline-block;background:#e74c3c;color:#fff;font-size:9px;font-weight:700;line-height:1;padding:2px 4px;border-radius:var(--lm-radius-s,3px);vertical-align:middle;margin-left:5px}' +
            '.lm-dc-flash{outline:3px solid var(--lm-dc-mc,#01d9cc)!important;outline-offset:3px;animation:lmdcflash .6s ease-in-out 5}' +
            '@keyframes lmdcflash{50%{outline-color:transparent}}' +
            '@media (max-height:500px){#lm-dc{padding:4px}#lm-dc .lm-dc-head{padding:3px 3px 3px 10px}#lm-dc .lm-dc-body{padding:6px 8px}}' +
            '@media (pointer:coarse){#lm-dc .lm-dc-chip,#lm-dc .lm-dc-btn{min-height:38px}}';
        (D.head || D.documentElement).appendChild(st);
    }
    function stop(e) { e.stopPropagation(); }
    function build() {
        injectStyle();
        root = mk('div');
        root.id = 'lm-dc';
        root.setAttribute('role', 'dialog');
        root.setAttribute('aria-modal', 'true');
        /* the focus stays in the window when its text is clicked: on the page, Esc did not close
         * it and keys went to the game */
        root.tabIndex = -1;
        /* the game reads mouse buttons, the wheel and keys from window handlers */
        ['mousedown', 'mouseup', 'click', 'dblclick', 'contextmenu', 'wheel', 'pointerdown', 'pointerup', 'keyup', 'keypress'].forEach(function (ev) {
            root.addEventListener(ev, stop, false);
        });
        root.addEventListener('keydown', function (e) {
            e.stopPropagation();
            if (e.key === 'Escape' || e.keyCode === 27) { e.preventDefault(); close(); }
        }, false);
        /* it covers the screen: Esc closes it first wherever the focus is, also over a window opened
         * under it (winstack.js escFor), which that Esc closed while Discover stayed open */
        root._lmEsc = true;
        root._lmEscTop = true;
        root.addEventListener('click', function (e) { if (e.target === root) close(); }, false);
        var panel = mk('div', 'lm-dc-panel lm-modal-container lm-w');
        var head = mk('div', 'lm-dc-head');
        head.appendChild(mk('div', 'lm-dc-title'));
        var x = mk('button', 'lm-dc-x', '\u00d7');
        x.type = 'button';
        x.addEventListener('click', function () { close(); });
        head.appendChild(x);
        body = mk('div', 'lm-dc-body');
        panel.appendChild(head);
        panel.appendChild(body);
        root.appendChild(panel);
    }
    /* the window's fixed texts (again after a language change); Arabic reads right to left */
    function applyTexts() {
        if (!root) return;
        root.setAttribute('aria-label', t('title'));
        try { root.setAttribute('dir', W.LMi18n && W.LMi18n.dir ? W.LMi18n.dir() : 'ltr'); } catch (e) { }
        root.querySelector('.lm-dc-title').textContent = t('title');
        var x = root.querySelector('.lm-dc-x');
        x.title = t('close');
        x.setAttribute('aria-label', t('close'));
    }

    function checkbox(key) {
        var el = D.getElementById(key);
        return el && el.type === 'checkbox' ? el : null;
    }
    function optLabel(key) {
        var tl = W.textLanguage || {};
        return plain(tl[key]) || key;
    }
    function setMsg(card, text) {
        var m = card.querySelector('.lm-dc-msg');
        if (m) m.textContent = text || '';
    }
    function toggle(key) { return toggleBox(checkbox(key)); }
    function visible(el) {
        if (!el || !el.getBoundingClientRect) return false;
        var r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && r.bottom > 0 && r.right > 0 && r.top < W.innerHeight && r.left < W.innerWidth;
    }
    /* live demo: wait for the HUD part of a switched-on option and make it blink */
    function highlight(sel, card) {
        var tries = 0;
        var look = function () {
            var el = D.querySelector(sel);
            if (visible(el)) {
                el.style.setProperty('--lm-dc-mc', mainColor());
                el.classList.remove('lm-dc-flash');
                void el.offsetWidth;
                el.classList.add('lm-dc-flash');
                setTimeout(function () { el.classList.remove('lm-dc-flash'); }, 3200);
                setMsg(card, t('look'));
                return;
            }
            if (++tries < 8) setTimeout(look, 400);
            else setMsg(card, t('later'));
        };
        setTimeout(look, 150);
    }
    function renderChip(chip, key) {
        var cb = checkbox(key);
        var on = !!(cb && cb.checked);
        chip.classList.toggle('on', on);
        chip.setAttribute('aria-pressed', on ? 'true' : 'false');
        chip.disabled = !cb;
        chip.innerHTML = '';
        chip.appendChild(mk('b', null, on ? t('on') : t('off')));
        chip.appendChild(D.createTextNode(optLabel(key)));
    }
    function revealOpt(key) {
        var ST = W.LMSmallTools;
        if (!ST || typeof ST.jump !== 'function') return false;
        close();
        return ST.jump(key);
    }
    function renderFeatures() {
        body.innerHTML = '';
        body.appendChild(mk('p', 'lm-dc-intro', t('intro')));
        var st = load();
        var grid = mk('div', 'lm-dc-grid');
        visibleCards().forEach(function (c) {
            var card = mk('div', 'lm-dc-card');
            card.setAttribute('data-card', c.id);
            var name = mk('div', 'lm-dc-name', t('card.' + c.id));
            if (st.seen.indexOf(seenKey(c)) < 0) {
                /* the settings' NEW badge text (core key lmNewBadge) */
                name.appendChild(mk('span', 'lm-new-badge', plain(typeof W.lmT === 'function' ? W.lmT('lmNewBadge') : '')));
            }
            card.appendChild(name);
            card.appendChild(mk('div', 'lm-dc-desc', t('card.' + c.id + '.desc')));
            if (c.opts.length) {
                var sw = mk('div', 'lm-dc-sw');
                c.opts.forEach(function (key) {
                    var chip = mk('button', 'lm-dc-chip');
                    chip.type = 'button';
                    chip.setAttribute('data-opt', key);
                    renderChip(chip, key);
                    if (chip.disabled) chip.title = t('noMenu');
                    chip.addEventListener('click', function () {
                        var on = toggle(key);
                        renderChip(chip, key);
                        if (on === null) { setMsg(card, checkbox(key) ? t('locked') : t('noMenu')); return; }
                        if (on && c.show && c.show[key]) highlight(c.show[key], card);
                        else setMsg(card, on ? t('later') : t('offNow'));
                    });
                    sw.appendChild(chip);
                });
                card.appendChild(sw);
            }
            card.appendChild(mk('div', 'lm-dc-msg'));
            var acts = mk('div', 'lm-dc-acts');
            if (c.win && c.win.avail()) {
                var ob = mk('button', 'lm-dc-btn pri', t('open'));
                ob.type = 'button';
                ob.setAttribute('data-act', 'open');
                ob.addEventListener('click', function () {
                    close();
                    setTimeout(function () { try { c.win.run(); } catch (e) { console.warn('[LM] Discover:', c.id, e); } }, 0);
                });
                acts.appendChild(ob);
            }
            if (c.opts.length && checkbox(c.opts[0]) && W.LMSmallTools && typeof W.LMSmallTools.jump === 'function') {
                var sb = mk('button', 'lm-dc-btn', t('showMe'));
                sb.type = 'button';
                sb.setAttribute('data-act', 'reveal');
                sb.addEventListener('click', function () { revealOpt(c.opts[0]); });
                acts.appendChild(sb);
            }
            if (acts.childNodes.length) card.appendChild(acts);
            grid.appendChild(card);
        });
        body.appendChild(grid);
    }
    function isOpen() { return !!(root && root.parentNode); }
    W.addEventListener('keydown', function (e) {
        if (!(e.key === 'Escape' || e.keyCode === 27) || e.ctrlKey || e.altKey || e.metaKey || !isOpen()) return;
        /* a window opened over it that took this Esc closes first */
        if (e._lmEscTaken) return;
        e._lmEscTaken = true;
        e.preventDefault();
        e.stopPropagation();
        close();
    }, true);
    function open() {
        if (!D.body) return;
        if (!root) build();
        root.style.setProperty('--dc-mc', mainColor());
        applyTexts();
        if (!isOpen()) {
            lastFocus = D.activeElement;
            D.body.appendChild(root);
        }
        renderFeatures();
        body.scrollTop = 0;
        var x = root.querySelector('.lm-dc-x');
        try { if (x) x.focus(); } catch (e) { }
    }
    /* closing marks the cards as seen (their NEW badges go) and the version as handled */
    function close() {
        if (!isOpen()) return;
        root.parentNode.removeChild(root);
        var st = markSeen(load(), visibleCards());
        st.v = ver();
        save(st);
        try { if (lastFocus && lastFocus.focus && D.body.contains(lastFocus)) lastFocus.focus(); } catch (e) { }
        lastFocus = null;
    }

    /* another language: the open window is drawn again */
    if (W.LMi18n && typeof W.LMi18n.onChange === 'function') {
        W.LMi18n.onChange(function () {
            if (!isOpen()) return;
            applyTexts();
            var top = body.scrollTop;
            renderFeatures();
            body.scrollTop = top;
        });
    }

    api.open = function () { open(); };
    api.close = close;
    api.isOpen = isOpen;
})();
