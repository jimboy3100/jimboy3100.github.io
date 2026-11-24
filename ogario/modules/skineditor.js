/* Legend Mod skin editor (loaded the first time it is opened: skins panel button, Command Centre).
 * Load an image from a URL or a file on this device, move it under the round crop, zoom and
 * rotate it, and see it inside cells of several sizes with the name and mass drawn the way the
 * game draws them. The result is downloaded as a PNG or kept in this browser (a short list in
 * localStorage) for local preview only: nothing is uploaded, and other players never see a local
 * image. A custom skin still needs a hosted image URL in the skin field.
 */
(function () {
    'use strict';
    var W = window, D = document;
    if (W._lmSkinEditorLoaded) return;
    W._lmSkinEditorLoaded = true;

    var KEY = 'lmSkinEditorSaved';
    var MAX_SAVED = 6;              /* saved images kept in this browser */
    var MAX_ITEM = 420000;          /* characters per saved data URL (about 300 KB) */
    var SAVE_SIZES = [256, 192, 128];
    var EXPORT_SIZE = 512;          /* the size agar.io skins use */
    var MAX_FILE = 20 * 1024 * 1024;
    var ZOOM_MIN = 0.2, ZOOM_MAX = 8;
    /* preview cells: world size (mass = size*size/100) and radius on screen */
    var PREVIEW = [{ size: 60, r: 22 }, { size: 160, r: 40 }, { size: 500, r: 62 }];

    /* ═══ Pure helpers (unit tested in developers/tests/skinmacro.js) ═══ */

    function clamp(v, a, b, d) { v = Number(v); if (!isFinite(v)) v = d == null ? a : d; return v < a ? a : v > b ? b : v; }
    function normRot(r) {
        r = Number(r);
        if (!isFinite(r)) return 0;
        r = ((r + 180) % 360 + 360) % 360 - 180;
        return Math.round(r * 10) / 10;
    }
    /* x / y: offset of the image centre from the crop centre, in crop diameters */
    function cleanState(s) {
        s = s || {};
        return { x: clamp(s.x, -2, 2, 0), y: clamp(s.y, -2, 2, 0), zoom: clamp(s.zoom, ZOOM_MIN, ZOOM_MAX, 1), rot: normRot(s.rot || 0) };
    }
    /* Where to draw an iw x ih image so that the crop circle fills an out x out square.
     * At zoom 1 the shorter image side covers the circle. */
    function transform(state, iw, ih, out) {
        var s = cleanState(state);
        var side = Math.max(1, Math.min(iw || 1, ih || 1));
        return { tx: out / 2 + s.x * out, ty: out / 2 + s.y * out, rad: s.rot * Math.PI / 180, scale: s.zoom * out / side };
    }
    function massText(size, shortMass) {
        var m = ~~(size * size / 100);
        if (shortMass && m >= 1000) return (Math.round(m / 100) / 10) + 'k';
        return String(m);
    }
    /* Name and mass of an own cell, in world units around the cell centre, from the same formulas
     * as the renderer (setFontSize, irenderfromagario.drawTxt, drawNick, drawMass). */
    function textLayout(size, o) {
        o = o || {};
        var ns = Number(o.namesScale); if (!isFinite(ns)) ns = 1;
        var ms = Number(o.massScale); if (!isFinite(ms)) ms = 3;
        var ss = Number(o.strokeScale); if (!isFinite(ss)) ss = 1;
        var showName = o.showName !== false && !!o.nick;
        var showMass = o.showMass !== false && size > 40;
        var F = Math.max(size * 0.3, 26) * ns;
        var M = F * 0.85 * Math.max(0, ms) / 3;
        var res = { mass: ~~(size * size / 100), massTxt: massText(size, o.shortMass), name: null, massT: null };
        if (showName) res.name = { size: F, base: 0.4 * F, stroke: o.namesStroke ? 0.1 * F * ss : 0 };
        if (showMass && M > 0) {
            var base = showName ? 0.7 * F + 1.1 * M : 0.4 * M;
            res.massT = { size: M, base: base, stroke: o.massStroke ? 0.1 * M * ss : 0 };
        }
        return res;
    }
    var PNG_RE = /^data:image\/png;base64,[A-Za-z0-9+/]+={0,2}$/;
    function isPngDataUrl(s) { return typeof s === 'string' && s.length <= MAX_ITEM && PNG_RE.test(s); }
    function cleanName(n) { return String(n == null ? '' : n).replace(/[\u0000-\u001f\u007f<>]/g, '').trim().slice(0, 40); }
    /* the stored list, newest first: anything malformed is dropped */
    function cleanList(raw) {
        var arr = raw;
        if (typeof raw === 'string') { try { arr = JSON.parse(raw); } catch (e) { return []; } }
        if (!Array.isArray(arr)) return [];
        var out = [], seen = {};
        for (var i = 0; i < arr.length && out.length < MAX_SAVED; i++) {
            var e = arr[i];
            if (!e || typeof e !== 'object' || !isPngDataUrl(e.d) || seen[e.d]) continue;
            seen[e.d] = 1;
            var t = Number(e.t);
            out.push({ n: cleanName(e.n) || 'Skin', d: e.d, t: isFinite(t) && t > 0 ? Math.round(t) : 0 });
        }
        return out;
    }
    function addToList(list, entry) {
        var l = cleanList(list).filter(function (x) { return x.d !== entry.d; });
        l.unshift({ n: cleanName(entry.n) || 'Skin', d: entry.d, t: entry.t || Date.now() });
        return cleanList(l);
    }
    /* image addresses the editor loads: http(s) links and image data URLs */
    function validSrc(u) {
        u = String(u == null ? '' : u).trim();
        if (/^data:image\/(png|jpe?g|gif|webp);base64,[A-Za-z0-9+/]+={0,2}$/i.test(u)) return u;
        if (u.length > 2048 || /\s/.test(u)) return '';
        return /^https?:\/\/[^/?#]+\.[^/?#]+/i.test(u) ? u : '';
    }
    function fileName(nick, now) {
        var n = cleanName(nick).replace(/[^A-Za-z0-9_-]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 24);
        var d = new Date(now || Date.now());
        var p = function (v) { return (v < 10 ? '0' : '') + v; };
        return 'skin-' + (n || 'legendmod') + '-' + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + '-' + p(d.getHours()) + p(d.getMinutes()) + '.png';
    }
    var core = { cleanState: cleanState, transform: transform, textLayout: textLayout, massText: massText, isPngDataUrl: isPngDataUrl, cleanList: cleanList, addToList: addToList, validSrc: validSrc, fileName: fileName, normRot: normRot, PREVIEW: PREVIEW, MAX_SAVED: MAX_SAVED, KEY: KEY };

    /* ═══ Text ═══ */

    var STR = {
        title: ['Skin editor', 'Επεξεργασία skin'],
        close: ['Close', 'Κλείσιμο'],
        local: ['Local preview only: an image from this device or saved here is shown only to you, in this editor. agar.io and other players cannot see it. To wear it as a custom skin, download the PNG, host it yourself and paste its link (https://...) in the skin URL field.',
            'Μόνο τοπική προεπισκόπηση: μια εικόνα από αυτή τη συσκευή ή αποθηκευμένη εδώ τη βλέπεις μόνο εσύ, σε αυτόν τον επεξεργαστή. Το agar.io και οι άλλοι παίκτες δεν τη βλέπουν. Για να τη φορέσεις ως skin, κατέβασε το PNG, φιλοξένησέ το μόνος σου και βάλε τον σύνδεσμο (https://...) στο πεδίο URL του skin.'],
        urlPh: ['Image URL (https://...)', 'URL εικόνας (https://...)'],
        loadUrl: ['Load', 'Φόρτωση'],
        file: ['Image from this device', 'Εικόνα από τη συσκευή'],
        zoom: ['Zoom', 'Ζουμ'],
        rotate: ['Rotate', 'Περιστροφή'],
        reset: ['Reset', 'Επαναφορά'],
        left90: ['Rotate left 90°', 'Αριστερά 90°'],
        right90: ['Rotate right 90°', 'Δεξιά 90°'],
        hint: ['Drag the image to place it in the circle; wheel or two fingers to zoom.', 'Σύρε την εικόνα μέσα στον κύκλο· ροδέλα ή δύο δάχτυλα για ζουμ.'],
        empty: ['Load an image (URL or file)', 'Φόρτωσε μια εικόνα (URL ή αρχείο)'],
        preview: ['In game (your name and mass as drawn in game)', 'Στο παιχνίδι (όνομα και μάζα όπως στο παιχνίδι)'],
        namePh: ['Name in the preview', 'Όνομα στην προεπισκόπηση'],
        download: ['Download PNG', 'Λήψη PNG'],
        save: ['Keep in this browser', 'Κράτησε σε αυτόν τον browser'],
        copy: ['Copy data URL', 'Αντιγραφή data URL'],
        saved: ['Kept in this browser (local preview only)', 'Αποθηκευμένα σε αυτόν τον browser (μόνο τοπικά)'],
        none: ['Nothing kept yet.', 'Τίποτα αποθηκευμένο ακόμα.'],
        open: ['Open in the editor', 'Άνοιγμα στον επεξεργαστή'],
        del: ['Delete', 'Διαγραφή'],
        noLoad: ['The image could not be loaded.', 'Η εικόνα δεν φορτώθηκε.'],
        badUrl: ['Enter an image link that starts with https://', 'Βάλε σύνδεσμο εικόνας που αρχίζει με https://'],
        tooBig: ['The file is too large (20 MB at most).', 'Το αρχείο είναι πολύ μεγάλο (έως 20 MB).'],
        notImage: ['That file is not an image.', 'Το αρχείο δεν είναι εικόνα.'],
        tainted: ['This site does not allow its images to be exported. The preview works; to export, save the image and open it as a file.', 'Αυτός ο ιστότοπος δεν επιτρέπει εξαγωγή των εικόνων του. Η προεπισκόπηση δουλεύει· για εξαγωγή, αποθήκευσε την εικόνα και άνοιξέ την ως αρχείο.'],
        keptOk: ['Kept in this browser. Only you see it, only here.', 'Αποθηκεύτηκε σε αυτόν τον browser. Τη βλέπεις μόνο εσύ, μόνο εδώ.'],
        full: ['Browser storage is full or blocked: the image was not kept.', 'Ο χώρος του browser είναι γεμάτος ή μπλοκαρισμένος: η εικόνα δεν αποθηκεύτηκε.'],
        copied: ['Data URL copied (it works only on this device; the skin field needs a hosted https link).', 'Το data URL αντιγράφηκε (δουλεύει μόνο σε αυτή τη συσκευή· το πεδίο skin θέλει φιλοξενημένο σύνδεσμο https).'],
        copyFail: ['Copying is blocked in this browser.', 'Η αντιγραφή είναι μπλοκαρισμένη σε αυτόν τον browser.']
    };
    function lang() { try { return W.localStorage.getItem('languagemod') === '2' ? 1 : 0; } catch (e) { return 0; } }
    function t(k) { var r = STR[k]; return r ? (r[lang()] || r[0]) : k; }
    function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return '&#' + c.charCodeAt(0) + ';'; }); }
    function toast(kind, text) { try { if (W.toastr) W.toastr[kind](esc(text)); } catch (e) { } }

    /* ═══ Storage ═══ */

    function loadList() { try { return cleanList(W.localStorage.getItem(KEY)); } catch (e) { return []; } }
    function storeList(list) {
        try {
            if (!list.length) W.localStorage.removeItem(KEY);
            else W.localStorage.setItem(KEY, JSON.stringify(list));
            return true;
        } catch (e) { return false; }
    }

    /* ═══ Game look (read only) ═══ */

    function gameLook() {
        var ds = W.defaultSettings || {}, ms = W.legendmod5 || W.defaultmapsettings || {};
        var fam = function (f) { f = String(f || 'Ubuntu'); return f.indexOf('sans-serif') >= 0 ? f : f + ', sans-serif'; };
        return {
            namesScale: ds.namesScale, massScale: ds.massScale, strokeScale: ds.strokeScale,
            namesStroke: ms.namesStroke !== false, massStroke: ms.massStroke !== false, shortMass: !!ms.shortMass,
            showName: !(ms.noNames || ms.hideMyName), showMass: ms.showMass !== false && !ms.hideMyMass,
            namesColor: ds.namesColor || '#ffffff', namesStrokeColor: ds.namesStrokeColor || '#000000',
            massColor: ds.massColor || '#ffffff', massStrokeColor: ds.massStrokeColor || '#000000',
            namesFont: (ds.namesFontWeight || 700) + ' ', namesFamily: fam(ds.namesFontFamily),
            massFont: (ds.massFontWeight || 700) + ' ', massFamily: fam(ds.massFontFamily),
            bg: ds.bgColor || '#000a11'
        };
    }
    function ownNick() {
        var n = '';
        try { var el = D.getElementById('nick'); if (el && el.value) n = el.value; } catch (e) { }
        if (!n && W.ogarcopythelb && W.ogarcopythelb.nick) n = W.ogarcopythelb.nick;
        return String(n || 'Legend Mod').slice(0, 30);
    }
    function ownColor() {
        var c = W.ogarcopythelb && W.ogarcopythelb.color;
        return /^#[0-9a-f]{6}$/i.test(String(c || '')) ? c : '#01d9cc';
    }

    /* ═══ State ═══ */

    var root = null, panel = null, edCv = null, pvCv = null, statusEl = null, urlIn = null, nameIn = null;
    var zoomIn = null, rotIn = null, listEl = null, fileIn = null, actBtns = [];
    var img = null, tainted = false, state = cleanState(), outCache = null, drawQueued = false;
    var pointers = {}, pinch = null, loadSeq = 0, objUrl = null;

    function isOpen() { return !!(root && root.parentNode); }

    function injectStyle() {
        if (D.getElementById('lm-se-css')) return;
        var s = D.createElement('style');
        s.id = 'lm-se-css';
        s.textContent =
            '#lm-se{position:fixed;left:0;top:0;right:0;bottom:0;z-index:2147481500;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;font:13px/1.35 Ubuntu,Roboto,sans-serif;color:#eee}' +
            '#lm-se-p{width:min(880px,calc(100vw - 12px));max-height:calc(100vh - 12px);box-sizing:border-box;display:flex;flex-direction:column;background:rgba(8,16,24,.97);border:1px solid rgba(1,217,204,.45);border-radius:8px;box-shadow:0 4px 18px rgba(0,0,0,.6)}' +
            '#lm-se-p .lm-se-h{display:flex;align-items:center;gap:6px;padding:4px 6px;border-bottom:1px solid rgba(255,255,255,.12)}' +
            '#lm-se-p .lm-se-t{flex:1;font-weight:700;color:#01d9cc;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
            '#lm-se-p .lm-se-body{display:flex;flex-wrap:wrap;gap:8px;padding:6px;overflow-y:auto;-webkit-overflow-scrolling:touch;min-height:0}' +
            '#lm-se-p .lm-se-l{flex:none;display:flex;flex-direction:column;gap:4px;align-items:center}' +
            '#lm-se-p .lm-se-r{flex:1;min-width:240px;display:flex;flex-direction:column;gap:6px}' +
            '#lm-se-ed{touch-action:none;cursor:grab;border-radius:6px;background:#111b24;display:block}' +
            '#lm-se-p .lm-se-note{font-size:11.5px;line-height:1.35;background:rgba(255,210,0,.12);border:1px solid rgba(255,210,0,.45);border-radius:5px;padding:4px 6px;color:#ffe680}' +
            '#lm-se-p .lm-se-row{display:flex;flex-wrap:wrap;align-items:center;gap:4px}' +
            '#lm-se-p input[type=text]{flex:1;min-width:120px;background:#111b24;color:#eee;border:1px solid rgba(255,255,255,.25);border-radius:3px;height:30px;padding:0 6px;font:inherit}' +
            '#lm-se-p input[type=range]{flex:1;min-width:100px}' +
            '#lm-se-p .lm-se-lb{min-width:56px;font-size:12px;opacity:.85}' +
            '#lm-se-p .lm-se-b{background:rgba(127,127,127,.2);color:#eee;border:1px solid rgba(127,127,127,.45);border-radius:3px;min-width:30px;min-height:30px;padding:0 8px;font:inherit;cursor:pointer;touch-action:manipulation}' +
            '#lm-se-p .lm-se-b:hover{background:rgba(127,127,127,.35)}#lm-se-p .lm-se-b[disabled]{opacity:.45;cursor:not-allowed}' +
            '#lm-se-p .lm-se-b.go{border-color:#3c9e5a;background:rgba(60,158,90,.35)}' +
            '#lm-se-p .lm-se-x{min-width:36px;min-height:36px;font-size:18px;line-height:1;padding:0}' +
            '#lm-se-p .lm-se-st{font-size:11.5px;opacity:.8;min-height:15px;max-width:330px;text-align:center}' +
            '#lm-se-p .lm-se-sub{font-weight:700;font-size:12px;color:#01d9cc;margin-top:2px}' +
            '#lm-se-pv{display:block;border-radius:6px;max-width:100%}' +
            '#lm-se-p .lm-se-list{display:flex;flex-wrap:wrap;gap:6px}' +
            '#lm-se-p .lm-se-it{display:flex;flex-direction:column;align-items:center;gap:2px;width:72px}' +
            '#lm-se-p .lm-se-it img{width:56px;height:56px;border-radius:50%;background:#111b24;cursor:pointer}' +
            '#lm-se-p .lm-se-it span{font-size:10.5px;max-width:72px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
            '@media (pointer:coarse){#lm-se-p .lm-se-b{min-height:36px;min-width:36px}}';
        (D.head || D.documentElement).appendChild(s);
    }

    function mk(tag, cls, text) {
        var e = D.createElement(tag);
        if (cls) e.className = cls;
        if (text != null) e.textContent = text;
        return e;
    }
    function btn(text, title, fn, cls) {
        var b = mk('button', 'lm-se-b' + (cls ? ' ' + cls : ''), text);
        b.type = 'button';
        if (title) { b.title = title; b.setAttribute('aria-label', title); }
        b.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); fn(b); });
        return b;
    }
    function edSize() {
        var h = W.innerHeight || 412, w = W.innerWidth || 915;
        return Math.max(150, Math.min(320, h - 100, w - 40));
    }
    function setStatus(text, warn) {
        if (!statusEl) return;
        statusEl.textContent = text || '';
        statusEl.style.color = warn ? '#ffb4a8' : '';
    }

    /* ═══ Rendering ═══ */

    function drawImageAt(ctx, out) {
        var tr = transform(state, img.naturalWidth || img.width, img.naturalHeight || img.height, out);
        ctx.save();
        ctx.translate(tr.tx, tr.ty);
        ctx.rotate(tr.rad);
        ctx.scale(tr.scale, tr.scale);
        ctx.imageSmoothingEnabled = true;
        if ('imageSmoothingQuality' in ctx) ctx.imageSmoothingQuality = 'high';
        var w = img.naturalWidth || img.width, h = img.naturalHeight || img.height;
        ctx.drawImage(img, -w / 2, -h / 2, w, h);
        ctx.restore();
    }
    /* the cropped round skin, transparent outside the circle */
    function renderOut(size) {
        var c = D.createElement('canvas');
        c.width = c.height = size;
        var ctx = c.getContext('2d');
        if (!img) return c;
        ctx.save();
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.clip();
        drawImageAt(ctx, size);
        ctx.restore();
        return c;
    }
    function drawEditor() {
        if (!edCv) return;
        var css = edSize(), dpr = Math.min(3, W.devicePixelRatio || 1);
        if (edCv.width !== Math.round(css * dpr)) { edCv.width = edCv.height = Math.round(css * dpr); }
        edCv.style.width = edCv.style.height = css + 'px';
        var ctx = edCv.getContext('2d');
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, css, css);
        ctx.fillStyle = '#111b24';
        ctx.fillRect(0, 0, css, css);
        var dia = css * 0.82, off = (css - dia) / 2;
        if (img) {
            ctx.save();
            ctx.translate(off, off);
            ctx.globalAlpha = 0.35;
            drawImageAt(ctx, dia);
            ctx.globalAlpha = 1;
            ctx.beginPath();
            ctx.arc(dia / 2, dia / 2, dia / 2, 0, Math.PI * 2);
            ctx.clip();
            drawImageAt(ctx, dia);
            ctx.restore();
        } else {
            ctx.fillStyle = 'rgba(255,255,255,.55)';
            ctx.font = '13px Ubuntu, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(t('empty'), css / 2, css / 2);
        }
        ctx.beginPath();
        ctx.arc(css / 2, css / 2, dia / 2, 0, Math.PI * 2);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#01d9cc';
        ctx.setLineDash([6, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
    }
    function drawText(ctx, txt, spec, font, family, fill, stroke) {
        ctx.font = font + spec.size + 'px ' + family;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        if (spec.stroke > 0) {
            ctx.lineWidth = spec.stroke;
            ctx.strokeStyle = stroke;
            ctx.lineJoin = 'round';
            ctx.strokeText(txt, 0, spec.base);
        }
        ctx.fillStyle = fill;
        ctx.fillText(txt, 0, spec.base);
    }
    function drawPreview() {
        if (!pvCv) return;
        var look = gameLook(), nick = nameIn && nameIn.value ? nameIn.value.slice(0, 30) : ownNick();
        var gap = 12, w = gap, h = 0;
        PREVIEW.forEach(function (p) { w += p.r * 2 + gap; h = Math.max(h, p.r * 2); });
        h += 16;
        var dpr = Math.min(3, W.devicePixelRatio || 1);
        pvCv.width = Math.round(w * dpr); pvCv.height = Math.round(h * dpr);
        pvCv.style.width = w + 'px'; pvCv.style.height = h + 'px';
        var ctx = pvCv.getContext('2d');
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.fillStyle = look.bg;
        ctx.fillRect(0, 0, w, h);
        if (img && !outCache) outCache = renderOut(256);
        var x = gap;
        PREVIEW.forEach(function (p) {
            var k = p.r / p.size, cx = x + p.r, cy = h / 2;
            ctx.save();
            ctx.translate(cx, cy);
            ctx.scale(k, k);
            ctx.beginPath();
            ctx.arc(0, 0, p.size, 0, Math.PI * 2);
            ctx.fillStyle = ownColor();
            ctx.fill();
            if (outCache) ctx.drawImage(outCache, -p.size, -p.size, p.size * 2, p.size * 2);
            var lay = textLayout(p.size, { namesScale: look.namesScale, massScale: look.massScale, strokeScale: look.strokeScale, namesStroke: look.namesStroke, massStroke: look.massStroke, shortMass: look.shortMass, showName: look.showName, showMass: look.showMass, nick: nick });
            if (lay.name) drawText(ctx, nick, lay.name, look.namesFont, look.namesFamily, look.namesColor, look.namesStrokeColor);
            if (lay.massT) drawText(ctx, lay.massTxt, lay.massT, look.massFont, look.massFamily, look.massColor, look.massStrokeColor);
            ctx.restore();
            x += p.r * 2 + gap;
        });
    }
    /* full: the crop changed, so the preview skin is rendered again (a name change only redraws) */
    function redraw(full) {
        if (full) outCache = null;
        if (drawQueued) return;
        drawQueued = true;
        var go = function () { drawQueued = false; if (!isOpen()) return; drawEditor(); drawPreview(); };
        if (W.requestAnimationFrame) W.requestAnimationFrame(go); else setTimeout(go, 16);
    }
    function syncControls() {
        if (zoomIn) zoomIn.value = String(Math.round(state.zoom * 100));
        if (rotIn) rotIn.value = String(Math.round(state.rot));
        var dis = !img || tainted;
        actBtns.forEach(function (b) { b.disabled = dis; });
    }
    function setState(s) { state = cleanState(s); syncControls(); redraw(true); }

    /* ═══ Loading ═══ */

    function checkTaint(im) {
        try {
            var c = D.createElement('canvas');
            c.width = c.height = 2;
            var ctx = c.getContext('2d');
            ctx.drawImage(im, 0, 0, 2, 2);
            ctx.getImageData(0, 0, 1, 1);
            return false;
        } catch (e) { return true; }
    }
    function useImage(im) {
        img = im;
        tainted = checkTaint(im);
        state = cleanState();
        syncControls();
        setStatus(tainted ? t('tainted') : ((im.naturalWidth || im.width) + ' x ' + (im.naturalHeight || im.height) + ' · ' + t('hint')), tainted);
        redraw(true);
    }
    function loadSrc(src) {
        var seq = ++loadSeq;
        var local = /^(data|blob):/i.test(src);
        var tryLoad = function (cors) {
            var im = new Image();
            if (cors) im.crossOrigin = 'anonymous';
            im.onload = function () { if (seq === loadSeq) useImage(im); };
            im.onerror = function () {
                if (seq !== loadSeq) return;
                /* no CORS headers: show it anyway (preview only, export stays off) */
                if (cors) tryLoad(false);
                else { setStatus(t('noLoad'), true); toast('warning', t('noLoad')); }
            };
            im.src = src;
        };
        tryLoad(!local);
    }
    function loadUrl() {
        var u = validSrc(urlIn && urlIn.value);
        if (!u) { setStatus(t('badUrl'), true); return; }
        loadSrc(u);
    }
    function loadFile(f) {
        if (!f) return;
        if (!/^image\//.test(f.type || '')) { setStatus(t('notImage'), true); return; }
        if (f.size > MAX_FILE) { setStatus(t('tooBig'), true); return; }
        try { if (objUrl) URL.revokeObjectURL(objUrl); } catch (e) { }
        objUrl = URL.createObjectURL(f);
        loadSrc(objUrl);
    }

    /* ═══ Export ═══ */

    function download() {
        if (!img || tainted) return;
        var c = renderOut(EXPORT_SIZE), name = fileName(nameIn && nameIn.value || ownNick());
        var save = function (href, revoke) {
            var a = D.createElement('a');
            a.href = href; a.download = name; a.rel = 'noopener';
            a.style.display = 'none';
            D.body.appendChild(a);
            a.click();
            setTimeout(function () { a.remove(); if (revoke) try { URL.revokeObjectURL(href); } catch (e) { } }, 1500);
        };
        try {
            if (c.toBlob) c.toBlob(function (b) { if (b) save(URL.createObjectURL(b), true); else save(c.toDataURL('image/png')); }, 'image/png');
            else save(c.toDataURL('image/png'));
        } catch (e) { setStatus(t('tainted'), true); }
    }
    function smallDataUrl() {
        for (var i = 0; i < SAVE_SIZES.length; i++) {
            var d = renderOut(SAVE_SIZES[i]).toDataURL('image/png');
            if (isPngDataUrl(d)) return d;
        }
        return '';
    }
    function keep() {
        if (!img || tainted) return;
        var d = '';
        try { d = smallDataUrl(); } catch (e) { setStatus(t('tainted'), true); return; }
        if (!d) { toast('warning', t('full')); return; }
        var list = addToList(loadList(), { n: nameIn && nameIn.value || ownNick(), d: d, t: Date.now() });
        if (storeList(list)) { toast('success', t('keptOk')); setStatus(t('keptOk')); }
        else toast('warning', t('full'));
        renderList();
    }
    function copyDataUrl() {
        if (!img || tainted) return;
        var d = '';
        try { d = smallDataUrl(); } catch (e) { setStatus(t('tainted'), true); return; }
        var ok = function () { toast('info', t('copied')); };
        var bad = function () { toast('warning', t('copyFail')); };
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(d).then(ok, bad);
            else bad();
        } catch (e) { bad(); }
    }
    function renderList() {
        if (!listEl) return;
        listEl.textContent = '';
        var list = loadList();
        if (!list.length) { listEl.appendChild(mk('div', 'lm-se-st', t('none'))); return; }
        list.forEach(function (e, i) {
            var it = mk('div', 'lm-se-it');
            var im = D.createElement('img');
            im.alt = e.n; im.title = t('open'); im.src = e.d;
            im.addEventListener('click', function () { if (nameIn) nameIn.value = e.n; loadSrc(e.d); });
            it.appendChild(im);
            it.appendChild(mk('span', '', e.n));
            it.appendChild(btn(t('del'), t('del'), function () {
                var l = loadList(); l.splice(i, 1); storeList(l); renderList();
            }));
            listEl.appendChild(it);
        });
    }

    /* ═══ Pointer: drag to move, wheel / pinch to zoom ═══ */

    function onDown(e) {
        if (!img) return;
        pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
        try { edCv.setPointerCapture(e.pointerId); } catch (er) { }
        var ids = Object.keys(pointers);
        if (ids.length === 2) {
            var a = pointers[ids[0]], b = pointers[ids[1]];
            pinch = { d: Math.hypot(a.x - b.x, a.y - b.y) || 1, zoom: state.zoom };
        }
        e.preventDefault();
    }
    function onMove(e) {
        var p = pointers[e.pointerId];
        if (!p || !img) return;
        var ids = Object.keys(pointers);
        if (ids.length >= 2 && pinch) {
            p.x = e.clientX; p.y = e.clientY;
            var a = pointers[ids[0]], b = pointers[ids[1]];
            var d = Math.hypot(a.x - b.x, a.y - b.y) || 1;
            setState({ x: state.x, y: state.y, rot: state.rot, zoom: pinch.zoom * d / pinch.d });
        } else {
            var dia = edSize() * 0.82;
            var nx = state.x + (e.clientX - p.x) / dia, ny = state.y + (e.clientY - p.y) / dia;
            p.x = e.clientX; p.y = e.clientY;
            setState({ x: nx, y: ny, rot: state.rot, zoom: state.zoom });
        }
        e.preventDefault();
    }
    function onUp(e) {
        delete pointers[e.pointerId];
        if (Object.keys(pointers).length < 2) pinch = null;
    }
    function onWheel(e) {
        if (!img) return;
        e.preventDefault();
        setState({ x: state.x, y: state.y, rot: state.rot, zoom: state.zoom * Math.exp(-clamp(e.deltaY, -200, 200, 0) * 0.0015) });
    }

    /* ═══ Window ═══ */

    function build() {
        injectStyle();
        root = mk('div');
        root.id = 'lm-se';
        root.addEventListener('pointerdown', function (e) { if (e.target === root) close(); });
        panel = mk('div');
        panel.id = 'lm-se-p';
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-label', t('title'));
        var head = mk('div', 'lm-se-h');
        head.appendChild(mk('div', 'lm-se-t', t('title')));
        head.appendChild(btn('×', t('close'), close, 'lm-se-x'));
        panel.appendChild(head);
        var body = mk('div', 'lm-se-body');
        var left = mk('div', 'lm-se-l');
        edCv = D.createElement('canvas');
        edCv.id = 'lm-se-ed';
        edCv.addEventListener('pointerdown', onDown);
        edCv.addEventListener('pointermove', onMove);
        edCv.addEventListener('pointerup', onUp);
        edCv.addEventListener('pointercancel', onUp);
        edCv.addEventListener('wheel', onWheel, { passive: false });
        left.appendChild(edCv);
        statusEl = mk('div', 'lm-se-st', t('hint'));
        left.appendChild(statusEl);
        body.appendChild(left);

        var right = mk('div', 'lm-se-r');
        right.appendChild(mk('div', 'lm-se-note', t('local')));
        var r1 = mk('div', 'lm-se-row');
        urlIn = D.createElement('input');
        urlIn.type = 'text'; urlIn.id = 'lm-se-url'; urlIn.placeholder = t('urlPh'); urlIn.maxLength = 2048;
        urlIn.setAttribute('autocomplete', 'off');
        urlIn.addEventListener('keydown', function (e) { e.stopPropagation(); if (e.key === 'Enter') loadUrl(); });
        r1.appendChild(urlIn);
        r1.appendChild(btn(t('loadUrl'), t('loadUrl'), loadUrl));
        fileIn = D.createElement('input');
        fileIn.type = 'file'; fileIn.accept = 'image/*'; fileIn.style.display = 'none';
        fileIn.addEventListener('change', function () { loadFile(fileIn.files && fileIn.files[0]); fileIn.value = ''; });
        r1.appendChild(fileIn);
        r1.appendChild(btn(t('file'), t('file'), function () { fileIn.click(); }));
        right.appendChild(r1);

        var r2 = mk('div', 'lm-se-row');
        r2.appendChild(mk('span', 'lm-se-lb', t('zoom')));
        zoomIn = D.createElement('input');
        zoomIn.type = 'range'; zoomIn.min = String(ZOOM_MIN * 100); zoomIn.max = String(ZOOM_MAX * 100); zoomIn.step = '1';
        zoomIn.setAttribute('aria-label', t('zoom'));
        zoomIn.addEventListener('input', function () { setState({ x: state.x, y: state.y, rot: state.rot, zoom: Number(zoomIn.value) / 100 }); });
        r2.appendChild(zoomIn);
        right.appendChild(r2);
        var r3 = mk('div', 'lm-se-row');
        r3.appendChild(mk('span', 'lm-se-lb', t('rotate')));
        rotIn = D.createElement('input');
        rotIn.type = 'range'; rotIn.min = '-180'; rotIn.max = '180'; rotIn.step = '1';
        rotIn.setAttribute('aria-label', t('rotate'));
        rotIn.addEventListener('input', function () { setState({ x: state.x, y: state.y, zoom: state.zoom, rot: Number(rotIn.value) }); });
        r3.appendChild(rotIn);
        r3.appendChild(btn('↺', t('left90'), function () { setState({ x: state.x, y: state.y, zoom: state.zoom, rot: state.rot - 90 }); }));
        r3.appendChild(btn('↻', t('right90'), function () { setState({ x: state.x, y: state.y, zoom: state.zoom, rot: state.rot + 90 }); }));
        r3.appendChild(btn(t('reset'), t('reset'), function () { setState(null); }));
        right.appendChild(r3);

        right.appendChild(mk('div', 'lm-se-sub', t('preview')));
        nameIn = D.createElement('input');
        nameIn.type = 'text'; nameIn.id = 'lm-se-name'; nameIn.placeholder = t('namePh'); nameIn.maxLength = 30;
        nameIn.value = ownNick();
        nameIn.addEventListener('input', function () { redraw(false); });
        nameIn.addEventListener('keydown', function (e) { e.stopPropagation(); });
        right.appendChild(nameIn);
        pvCv = D.createElement('canvas');
        pvCv.id = 'lm-se-pv';
        right.appendChild(pvCv);

        var r4 = mk('div', 'lm-se-row');
        actBtns = [btn(t('download'), t('download'), download, 'go lm-se-dl'), btn(t('save'), t('save'), keep, 'lm-se-keep'), btn(t('copy'), t('copy'), copyDataUrl)];
        actBtns.forEach(function (b) { r4.appendChild(b); });
        right.appendChild(r4);
        right.appendChild(mk('div', 'lm-se-sub', t('saved')));
        listEl = mk('div', 'lm-se-list');
        right.appendChild(listEl);
        body.appendChild(right);
        panel.appendChild(body);
        root.appendChild(panel);
    }
    function onKey(e) {
        if (!isOpen()) return;
        if (e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); close(); }
    }
    function onResize() { if (isOpen()) redraw(false); }

    function open(src) {
        if (!isOpen()) {
            build();
            D.body.appendChild(root);
            W.addEventListener('keydown', onKey, true);
            W.addEventListener('resize', onResize);
            /* the current skin link as a starting point */
            var cur = '';
            try { var sk = D.getElementById('skin'); cur = sk && validSrc(sk.value); } catch (e) { }
            if (urlIn && cur && cur.indexOf('data:') !== 0) urlIn.value = cur;
            renderList();
            syncControls();
            redraw(true);
        }
        var u = validSrc(src);
        if (u) { if (urlIn && u.indexOf('data:') !== 0) urlIn.value = u; loadSrc(u); }
        return true;
    }
    function close() {
        if (!root) return;
        W.removeEventListener('keydown', onKey, true);
        W.removeEventListener('resize', onResize);
        if (root.parentNode) root.parentNode.removeChild(root);
        root = panel = edCv = pvCv = statusEl = urlIn = nameIn = zoomIn = rotIn = listEl = fileIn = null;
        actBtns = []; pointers = {}; pinch = null; outCache = null;
        /* the loaded image stays for a reopen in this session (it is decoded, so the file's
         * object URL can go); a load still running is ignored */
        loadSeq++;
        try { if (objUrl) URL.revokeObjectURL(objUrl); } catch (e) { }
        objUrl = null;
    }
    function toggle() { if (isOpen()) close(); else open(); }
    function run(action, arg) {
        if (action === 'close') return close();
        if (action === 'toggle') return toggle();
        return open(arg);
    }

    W.LMSkinEditor = {
        core: core, open: open, close: close, toggle: toggle, isOpen: isOpen, run: run,
        savedList: loadList,
        _state: function () { return { state: cleanState(state), hasImage: !!img, tainted: tainted }; },
        _useImage: useImage
    };
})();
