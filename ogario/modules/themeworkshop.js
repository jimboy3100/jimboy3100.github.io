/* Legend Mod theme workshop.
 * My themes (save the current theme, rename, copy, delete, the last 5 saved versions of each),
 * live preview (Keep / Revert, back by itself after 15 s), import from a file or pasted text,
 * export to a file, comparison of any two themes and a gallery of themes shipped in the repo
 * (ogario/themes/catalogue.json). Opened from the Theme tab, a hotkey (no default key) or the
 * Command Centre. Nothing runs until the window is opened.
 *
 * A theme package is data only:
 *   { format: "lm-theme", version: 1, name, author, description, created,
 *     theme: { theme settings }, sounds: { messageSound, commandSound, virusSoundurl },
 *     cursor: url, background: url, hudLayout: "name" }
 * Every value is checked against the shipped theme schema (LM_THEME_DEFAULTS, lmThemeValue)
 * plus the colour check of Settings.loadThemeSettings; strings that are not colours must be a
 * known preset / font name or an https URL. Unknown keys are dropped, sizes are capped. URLs are
 * shown to the player before a theme that uses them is applied.
 * A theme stands for the whole look: settings it leaves out get their shipped defaults, except
 * the cursor, the background and the sounds, which stay as they are.
 */
(function () {
    'use strict';
    if (window._lmThemeWorkshopLoaded) return;
    window._lmThemeWorkshopLoaded = true;

    var W = window;
    var KEY_STORE = 'lmThemeWorkshop';
    var FORMAT = 'lm-theme', VERSION = 1;
    var MAX_THEMES = 30, MAX_HISTORY = 5;
    /* characters of JSON: the themes never fill the storage the settings themselves need */
    var MAX_STORE_CHARS = 400000;
    var MAX_PACKAGE_CHARS = 64 * 1024;
    var MAX_INPUT_KEYS = 600;
    var MAX_CATALOGUE_CHARS = 256 * 1024, MAX_CATALOGUE_THEMES = 50;
    var PREVIEW_MS = 15000;
    var NAME_MAX = 40, AUTHOR_MAX = 40, DESC_MAX = 200, LAYOUT_MAX = 40, URL_MAX = 400;
    var CATALOGUE_URL = 'https://www.legendmod.ml/ogario/themes/catalogue.json';

    var own = Object.prototype.hasOwnProperty;
    function has(o, k) { return !!o && own.call(o, k); }
    function isObj(v) { return !!v && typeof v === 'object' && !Array.isArray(v); }
    function clone(v) { return v == null ? v : JSON.parse(JSON.stringify(v)); }
    function same(a, b) { return a === b || (typeof a === 'number' && typeof b === 'number' && Math.abs(a - b) < 1e-9); }
    /* JSON with sorted keys, to compare two themes */
    function stable(v) {
        if (Array.isArray(v)) return '[' + v.map(stable).join(',') + ']';
        if (isObj(v)) return '{' + Object.keys(v).sort().map(function (k) { return JSON.stringify(k) + ':' + stable(v[k]); }).join(',') + '}';
        return JSON.stringify(v);
    }

    /* ── Texts (English, Greek; other languages show English) ── */
    var TEXT = {
        title: ['Theme workshop', 'Εργαστήριο θεμάτων'],
        openBtn: ['Theme workshop', 'Εργαστήριο θεμάτων'],
        tabMine: ['My themes', 'Τα θέματά μου'],
        tabGallery: ['Gallery', 'Συλλογή'],
        tabIo: ['Import / export', 'Εισαγωγή / εξαγωγή'],
        tabCompare: ['Compare', 'Σύγκριση'],
        close: ['Close', 'Κλείσιμο'],
        namePh: ['Theme name', 'Όνομα θέματος'],
        saveCurrent: ['Save current as theme', 'Αποθήκευση τρέχοντος ως θέμα'],
        mineNote: ['Kept in this browser only. Preview shows a theme for 15 s: press Keep, or your theme comes back by itself.', 'Μόνο σε αυτόν τον browser. Η Δοκιμή δείχνει ένα θέμα για 15 δ.: πάτα Κράτησε, αλλιώς το θέμα σου επιστρέφει μόνο του.'],
        empty: ['No themes yet: save the current theme or install one from the Gallery.', 'Δεν υπάρχουν θέματα: αποθήκευσε το τρέχον θέμα ή εγκατάστησε ένα από τη Συλλογή.'],
        preview: ['Preview', 'Δοκιμή'],
        update: ['Update', 'Ενημέρωση'],
        rename: ['Rename', 'Μετονομασία'],
        duplicate: ['Copy', 'Αντίγραφο'],
        exportBtn: ['Export', 'Εξαγωγή'],
        history: ['History ({0})', 'Ιστορικό ({0})'],
        del: ['Delete', 'Διαγραφή'],
        restore: ['Restore', 'Επαναφορά'],
        compare: ['Compare', 'Σύγκριση'],
        versionOf: ['{0}, version of {1}', '{0}, έκδοση {1}'],
        noHistory: ['No earlier versions yet: Update keeps the last 5.', 'Δεν υπάρχουν παλαιότερες εκδόσεις: η Ενημέρωση κρατά τις 5 τελευταίες.'],
        by: ['by {0}', 'από {0}'],
        needName: ['Type a name first.', 'Γράψε πρώτα ένα όνομα.'],
        tooMany: ['You have the maximum number of themes (30). Delete one first.', 'Έχεις τον μέγιστο αριθμό θεμάτων (30). Διάγραψε ένα πρώτα.'],
        storageFull: ['The browser storage is full: nothing was changed.', 'Ο χώρος αποθήκευσης είναι γεμάτος: δεν άλλαξε τίποτα.'],
        tooBigStore: ['Your themes are too large to save. Delete one first.', 'Τα θέματά σου είναι πολύ μεγάλα για αποθήκευση. Διάγραψε ένα πρώτα.'],
        saved: ['Theme saved: {0}', 'Το θέμα αποθηκεύτηκε: {0}'],
        updated: ['"{0}" updated (the previous version is in its history).', 'Το "{0}" ενημερώθηκε (η προηγούμενη έκδοση είναι στο ιστορικό του).'],
        sameTheme: ['"{0}" already has the current theme.', 'Το "{0}" έχει ήδη το τρέχον θέμα.'],
        confirmUpdate: ['Replace "{0}" with the current theme? The old version stays in its history.', 'Αντικατάσταση του "{0}" με το τρέχον θέμα; Η παλιά έκδοση μένει στο ιστορικό του.'],
        confirmDelete: ['Delete the theme "{0}" and its history?', 'Διαγραφή του θέματος "{0}" και του ιστορικού του;'],
        renamePrompt: ['New name:', 'Νέο όνομα:'],
        copySuffix: [' (copy)', ' (αντίγραφο)'],
        restored: ['"{0}": the version from {1} is back (the replaced one is in its history). Preview it to use it.', '"{0}": επανήλθε η έκδοση {1} (αυτή που αντικαταστάθηκε είναι στο ιστορικό). Δοκίμασέ το για να το χρησιμοποιήσεις.'],
        previewing: ['Preview: {0}', 'Δοκιμή: {0}'],
        revertsIn: ['back in {0} s', 'επιστροφή σε {0} δ.'],
        keep: ['Keep', 'Κράτησε'],
        revert: ['Revert', 'Επαναφορά'],
        kept: ['Theme applied: {0}', 'Εφαρμόστηκε το θέμα: {0}'],
        reverted: ['Preview ended: your theme is back.', 'Η δοκιμή τελείωσε: το θέμα σου επέστρεψε.'],
        revertedNewer: ['Preview ended before your other change: your theme is back, the new change stays.', 'Η δοκιμή τελείωσε πριν από την άλλη αλλαγή σου: το θέμα σου επέστρεψε, η νέα αλλαγή μένει.'],
        revertedAuto: ['Not kept within 15 s: your theme is back.', 'Δεν το κράτησες μέσα σε 15 δ.: το θέμα σου επέστρεψε.'],
        saveFailed: ['The theme is applied but could not be saved (browser storage full): a reload brings the old one back.', 'Το θέμα εφαρμόστηκε αλλά δεν αποθηκεύτηκε (γεμάτος χώρος): μετά από επαναφόρτωση επιστρέφει το παλιό.'],
        urlsTitle: ['This theme loads files from these addresses. Check them before you continue:', 'Αυτό το θέμα φορτώνει αρχεία από αυτές τις διευθύνσεις. Έλεγξέ τες πριν συνεχίσεις:'],
        go: ['Continue', 'Συνέχεια'],
        cancel: ['Cancel', 'Άκυρο'],
        galleryNote: ['Themes shipped with Legend Mod. Preview one or install it into My themes.', 'Θέματα που έρχονται με το Legend Mod. Δοκίμασε ένα ή εγκατάστησέ το στα θέματά σου.'],
        publishNote: ['Publish your own: export it to a file (Import / export) and share the file, e.g. on Discord. There is no upload service: nothing is sent anywhere.', 'Δημοσίευσε το δικό σου: κάνε εξαγωγή σε αρχείο (Εισαγωγή / εξαγωγή) και μοιράσου το αρχείο, π.χ. στο Discord. Δεν υπάρχει υπηρεσία ανεβάσματος: τίποτα δεν στέλνεται πουθενά.'],
        galleryLoading: ['Loading the gallery...', 'Φόρτωση της συλλογής...'],
        builtinTitle: ['Built-in presets', 'Ενσωματωμένα θέματα'],
        builtinNote: ['A game preset sets the game colours, fonts and sizes, a menu preset the menu colours; everything else stays as it is. Apply keeps it at once, Preview shows it for 15 s.', 'Ένα θέμα παιχνιδιού ορίζει χρώματα, γραμματοσειρές και μεγέθη του παιχνιδιού, ένα θέμα μενού τα χρώματα του μενού. Τα υπόλοιπα μένουν ως έχουν. Η Εφαρμογή το κρατά αμέσως, η Δοκιμή το δείχνει για 15 δευτ.'],
        kindGame: ['game', 'παιχνίδι'],
        kindMenu: ['menu', 'μενού'],
        apply: ['Apply', 'Εφαρμογή'],
        galleryTitle: ['Gallery themes', 'Θέματα συλλογής'],
        galleryFail: ['The gallery could not be loaded.', 'Η συλλογή δεν φορτώθηκε.'],
        retry: ['Retry', 'Ξανά'],
        install: ['Install', 'Εγκατάσταση'],
        installed: ['Installed', 'Εγκαταστάθηκε'],
        installedMsg: ['"{0}" installed in My themes.', 'Το "{0}" εγκαταστάθηκε στα θέματά σου.'],
        already: ['"{0}" is already in My themes.', 'Το "{0}" υπάρχει ήδη στα θέματά σου.'],
        importTitle: ['Import', 'Εισαγωγή'],
        importPh: ['Paste a theme (.json text) here', 'Επικόλλησε εδώ ένα θέμα (κείμενο .json)'],
        importBtn: ['Import pasted text', 'Εισαγωγή κειμένου'],
        importFile: ['Import from file', 'Εισαγωγή από αρχείο'],
        exportTitle: ['Export', 'Εξαγωγή'],
        currentTheme: ['Current theme', 'Τρέχον θέμα'],
        download: ['Download file', 'Λήψη αρχείου'],
        showJson: ['Show text', 'Εμφάνιση κειμένου'],
        copy: ['Copy text', 'Αντιγραφή κειμένου'],
        copied: ['Copied.', 'Αντιγράφηκε.'],
        exported: ['Exported: {0}', 'Εξαγωγή: {0}'],
        imported: ['Imported "{0}": {1} settings.', 'Εισαγωγή του "{0}": {1} ρυθμίσεις.'],
        importedDropped: [' {0} unknown or invalid values were left out.', ' {0} άγνωστες ή άκυρες τιμές παραλείφθηκαν.'],
        importedUrls: [' It loads files from: {0} (shown again before use).', ' Φορτώνει αρχεία από: {0} (εμφανίζονται ξανά πριν από τη χρήση).'],
        e_tooBig: ['The theme is too large (max 64 KB).', 'Το θέμα είναι πολύ μεγάλο (έως 64 KB).'],
        e_notJson: ['This is not valid theme text (JSON).', 'Αυτό δεν είναι έγκυρο κείμενο θέματος (JSON).'],
        e_notTheme: ['This is not a Legend Mod theme (format lm-theme).', 'Αυτό δεν είναι θέμα του Legend Mod (μορφή lm-theme).'],
        e_newer: ['This theme was made by a newer version of Legend Mod.', 'Αυτό το θέμα φτιάχτηκε από νεότερη έκδοση του Legend Mod.'],
        e_empty: ['The theme has no usable settings.', 'Το θέμα δεν έχει χρησιμοποιήσιμες ρυθμίσεις.'],
        cmpA: ['Theme A', 'Θέμα Α'],
        cmpB: ['Theme B', 'Θέμα Β'],
        diffNone: ['No differences.', 'Καμία διαφορά.'],
        diffCount: ['{0} differences', '{0} διαφορές'],
        colSetting: ['Setting', 'Ρύθμιση'],
        hudLayout: ['HUD layout', 'Διάταξη HUD'],
        notSet: ['(not set)', '(κανένα)'],
        on: ['ON', 'ΝΑΙ'],
        off: ['OFF', 'ΟΧΙ'],
        loadingMod: ['The theme workshop is loading, try again in a moment.', 'Το εργαστήριο θεμάτων φορτώνει, δοκίμασε σε λίγο.']
    };
    function lang() {
        var l = null;
        try { l = W.localStorage.getItem('languagemod'); } catch (e) { }
        return l === '2' ? 1 : 0;
    }
    function tx(key) {
        var row = TEXT[key];
        var s = row ? (row[lang()] || row[0]) : key;
        for (var i = 1; i < arguments.length; i++) s = s.split('{' + (i - 1) + '}').join(String(arguments[i]));
        return s;
    }
    function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }
    function stripTags(s) { return String(s == null ? '' : s).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim(); }

    /* ── Validation ── */
    var COLOR_DEFAULT = /^(#|rgba?\()/i;
    var COLOR_VALUE = /^(#[0-9a-f]{3,8}|rgba?\([0-9.,%\s]+\)|[a-z]+)$/i;
    /* https only; no quotes, brackets, spaces or backslashes (the URLs end up in CSS url(...)
     * and src attributes), no user:password@ part */
    var URL_RE = /^https:\/\/[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+(?::\d{1,5})?(?:[\/?#][A-Za-z0-9\-._~%!$&*+,;=:@\/?#]*)?$/i;
    /* not part of a theme: a one-time flag, the marker LMexpress reads, the commander images */
    function excluded(k) { return k === 'checkonetimeLc2' || k === 'lbTeammateColor' || /^commanderImage/.test(k); }
    var URL_KEYS = { menuBg: 1, customBackground: 1, customCursor: 1 };
    /* kept as they are when a theme leaves them out (optional parts of a package) */
    var KEEP_KEYS = { customBackground: 1, customCursor: 1 };
    var ENUMS = { chatPos: 'chatPositions', preset: 'themePresets', menuPreset: 'themeMenus', graphics: 'graphicMenus', indicators: 'indicatorMenus' };
    var FONTS = ['ubuntu', 'ubuntu-bold', 'roboto', 'roboto-bold', 'oswald', 'oswald-bold', 'shojumaru', 'shojumaru-bold', 'allura', 'allura-bold'];
    var FAMILIES = ['Ubuntu', 'Roboto', 'Oswald', 'Shojumaru', 'Allura'];
    /* the slider ranges of the Theme tab (Settings.setThemeMenu) */
    var RANGES = {
        sectorsX: [2, 10], sectorsY: [2, 10], sectorsFontSize: [200, 2000], namesScale: [0.5, 2], massScale: [1, 5],
        virMassScale: [1, 5], strokeScale: [1, 4], foodSize: [1, 50], virusSpikesRatio: [0.03, 0.8], virusSpikesSize: [1, 60],
        gameBrightness: [50, 150], gameSaturation: [0, 200], virusStrokeSize: [2, 40], bordersWidth: [2, 200],
        borderGlowSize: [0, 40], virusGlowSize: [0, 40], sectorsWidth: [2, 200], cellsAlpha: [0.01, 1], skinsAlpha: [0.01, 1],
        virusAlpha: [0, 1], textAlpha: [0.1, 1], ghostCellsAlpha: [0.01, 1], menuOpacity: [0.1, 1], hudScale: [0.5, 1.5],
        chatScale: [1, 2], miniMapWidth: [120, 400], miniMapSectorsOpacity: [0, 1], miniMapNickSize: [8, 16],
        miniMapNickStrokeSize: [0, 6], miniMapMyCellSize: [4, 10], miniMapMyCellStrokeSize: [0, 10], miniMapTeammatesSize: [4, 10],
        miniMapGhostCellsAlpha: [0.01, 1], backgroundAlpha: [0, 1], miniMapTop: [0, 200], cellShadowBlur: [0, 100],
        cellShadowOffsetX: [-50, 50], cellShadowOffsetY: [-50, 50]
    };
    var SOUND_KEYS = ['messageSound', 'commandSound', 'virusSoundurl'];
    var SOUND_SETTERS = { messageSound: 'setMessageSound', commandSound: 'setCommandSound', virusSoundurl: 'setvirusSound' };

    function schema() { return isObj(W.LM_THEME_DEFAULTS) ? W.LM_THEME_DEFAULTS : null; }
    /* free text: no tags, angle brackets or control / direction characters, at most max characters */
    function cleanText(s, max) {
        if (typeof s !== 'string') return '';
        s = s.slice(0, max * 8).replace(/<[^>]*>/g, ' ')
            .replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u2028-\u202e\u2066-\u2069\ufeff<>]/g, ' ')
            .replace(/\s+/g, ' ').trim();
        return Array.from(s).slice(0, max).join('').trim();
    }
    /* '' (none) or a checked https URL; undefined when it cannot be used */
    function cleanUrl(v) {
        if (typeof v !== 'string') return undefined;
        v = v.trim();
        if (v === '') return '';
        return v.length <= URL_MAX && URL_RE.test(v) ? v : undefined;
    }
    function cleanLayout(v) {
        var s = cleanText(v, LAYOUT_MAX);
        return s && /^[A-Za-z0-9 _.\-]+$/.test(s) ? s : undefined;
    }
    /* one theme value, or undefined when it cannot be used */
    function themeValue(k, v) {
        var defs = schema();
        if (!defs || typeof k !== 'string' || !own.call(defs, k) || excluded(k)) return undefined;
        if (typeof W.lmThemeValue !== 'function') return undefined;
        var t = W.lmThemeValue(k, v);
        if (t === undefined) return undefined;
        var d = defs[k];
        if (typeof d === 'number') {
            if (typeof t !== 'number' || !isFinite(t)) return undefined;
            var r = RANGES[k] || (/FontWeight$/.test(k) ? [100, 900] : [-10000, 100000]);
            return Math.min(r[1], Math.max(r[0], t));
        }
        if (typeof d === 'boolean') return typeof t === 'boolean' ? t : undefined;
        if (typeof d !== 'string' || typeof t !== 'string') return undefined;
        /* the colour check of Settings.loadThemeSettings: colours end up in CSS and style attributes */
        if (COLOR_DEFAULT.test(d)) return t.length <= 60 && COLOR_VALUE.test(t) ? t : undefined;
        if (own.call(URL_KEYS, k)) return cleanUrl(t);
        if (own.call(ENUMS, k)) {
            var m = W[ENUMS[k]];
            if (isObj(m)) return own.call(m, t) ? t : undefined;
            return /^[A-Za-z0-9_-]{1,30}$/.test(t) ? t : undefined;
        }
        if (/FontFamily$/.test(k)) return FAMILIES.indexOf(t) >= 0 ? t : undefined;
        if (/Font$/.test(k)) return FONTS.indexOf(t) >= 0 ? t : undefined;
        /* drawn on the canvas, at most 4 characters (_lmSectorLabel) */
        if (k === 'sectorsSymbol') return t === '' ? '' : (cleanText(t, 4) || undefined);
        /* any other text setting is left out: only values of a known kind are accepted */
        return undefined;
    }
    function soundValue(k, v) {
        if (SOUND_KEYS.indexOf(k) < 0) return undefined;
        var u = cleanUrl(v);
        if (u === undefined) return undefined;
        if (typeof W.lmSettingValue === 'function' && W.lmSettingValue(k, u) === undefined) return undefined;
        return u;
    }
    /* { k: v } of the usable theme values; dropped keys go to info.dropped; null when too many keys */
    function cleanThemeMap(o, info) {
        info = info || { dropped: [] };
        if (!isObj(o)) return {};
        var keys = Object.keys(o);
        if (keys.length > MAX_INPUT_KEYS) { info.tooMany = true; return null; }
        var out = {};
        keys.forEach(function (k) {
            var v = themeValue(k, o[k]);
            if (v === undefined) info.dropped.push(k);
            else out[k] = v;
        });
        return out;
    }
    function cleanSounds(o, info) {
        if (!isObj(o)) return null;
        var out = {}, n = 0;
        Object.keys(o).slice(0, MAX_INPUT_KEYS).forEach(function (k) {
            var v = soundValue(k, o[k]);
            if (v === undefined) { if (info) info.dropped.push('sounds.' + k); return; }
            out[k] = v; n++;
        });
        return n ? out : null;
    }
    function toTime(v, fallback) {
        var t = typeof v === 'number' ? v : (typeof v === 'string' && v.length < 40 ? Date.parse(v) : NaN);
        var lo = Date.UTC(2015, 0, 1), hi = Date.now() + 86400000;
        return isFinite(t) && t >= lo && t <= hi ? Math.floor(t) : fallback;
    }
    /* the theme part of a stored theme: { theme, sounds?, hudLayout? }, or null */
    function cleanBody(b, info) {
        if (!isObj(b)) return null;
        var theme = cleanThemeMap(b.theme, info);
        if (!theme || !Object.keys(theme).length) return null;
        var out = { theme: theme };
        var s = cleanSounds(b.sounds, info);
        if (s) out.sounds = s;
        var l = b.hudLayout != null ? cleanLayout(b.hudLayout) : undefined;
        if (l) out.hudLayout = l;
        return out;
    }
    var TOP_KEYS = { format: 1, version: 1, name: 1, author: 1, description: 1, created: 1, theme: 1, sounds: 1, cursor: 1, background: 1, hudLayout: 1 };
    /* Checks a package (text or parsed). { ok: true, pkg: { name, author, description, created,
     * body }, dropped: [keys], urls: [{ key, url }] } or { ok: false, error: code }. */
    function parsePackage(input) {
        var raw = input;
        if (typeof input === 'string') {
            if (input.length > MAX_PACKAGE_CHARS) return { ok: false, error: 'tooBig' };
            try { raw = JSON.parse(input); } catch (e) { return { ok: false, error: 'notJson' }; }
        }
        if (!isObj(raw) || raw.format !== FORMAT) return { ok: false, error: 'notTheme' };
        if (raw.version !== VERSION) return { ok: false, error: typeof raw.version === 'number' && raw.version > VERSION ? 'newer' : 'notTheme' };
        var info = { dropped: [] };
        Object.keys(raw).forEach(function (k) { if (!own.call(TOP_KEYS, k)) info.dropped.push(k); });
        if (info.dropped.length > MAX_INPUT_KEYS) return { ok: false, error: 'tooBig' };
        var theme = cleanThemeMap(raw.theme, info);
        if (!theme) return { ok: false, error: 'tooBig' };
        /* the optional cursor / background of the package are its theme's cursor / background */
        [['cursor', 'customCursor'], ['background', 'customBackground']].forEach(function (p) {
            if (!own.call(raw, p[0])) return;
            var u = cleanUrl(raw[p[0]]);
            if (u === undefined) info.dropped.push(p[0]);
            else theme[p[1]] = u;
        });
        if (!Object.keys(theme).length) return { ok: false, error: 'empty' };
        var body = { theme: theme };
        if (own.call(raw, 'sounds')) {
            var s = cleanSounds(raw.sounds, info);
            if (s) body.sounds = s;
            else if (!isObj(raw.sounds)) info.dropped.push('sounds');
        }
        if (own.call(raw, 'hudLayout')) {
            var l = cleanLayout(raw.hudLayout);
            if (l) body.hudLayout = l;
            else info.dropped.push('hudLayout');
        }
        var pkg = {
            name: cleanText(raw.name, NAME_MAX) || 'Theme',
            author: cleanText(raw.author, AUTHOR_MAX),
            description: cleanText(raw.description, DESC_MAX),
            created: toTime(raw.created, Date.now()),
            body: body
        };
        return { ok: true, pkg: pkg, dropped: info.dropped, urls: bodyUrls(body) };
    }
    /* the URLs a theme sets itself (not the defaults it falls back to) */
    function bodyUrls(body) {
        var out = [];
        if (!body) return out;
        Object.keys(URL_KEYS).forEach(function (k) {
            if (has(body.theme, k) && body.theme[k]) out.push({ key: k, url: body.theme[k] });
        });
        SOUND_KEYS.forEach(function (k) {
            if (has(body.sounds, k) && body.sounds[k]) out.push({ key: k, url: body.sounds[k] });
        });
        return out;
    }
    function hostOf(url) { var m = /^https:\/\/([^\/?#:]+)/i.exec(url || ''); return m ? m[1].toLowerCase() : ''; }
    /* the package of a theme, for a file */
    function toPackage(entry) {
        var b = entry.body || {}, theme = {};
        Object.keys(b.theme || {}).forEach(function (k) { if (k !== 'customCursor' && k !== 'customBackground') theme[k] = b.theme[k]; });
        var out = { format: FORMAT, version: VERSION, name: entry.name || 'Theme', author: entry.author || '', description: entry.description || '' };
        try { out.created = new Date(entry.created || Date.now()).toISOString(); } catch (e) { out.created = new Date().toISOString(); }
        out.theme = theme;
        if (b.theme && has(b.theme, 'customCursor')) out.cursor = b.theme.customCursor;
        if (b.theme && has(b.theme, 'customBackground')) out.background = b.theme.customBackground;
        if (b.sounds) out.sounds = clone(b.sounds);
        if (b.hudLayout) out.hudLayout = b.hudLayout;
        return out;
    }
    /* only the values that differ from the shipped defaults (a theme stands for the whole look:
     * what it leaves out is the default); the cursor and background are always kept */
    function sparseTheme(theme) {
        var defs = schema() || {}, out = {};
        Object.keys(theme || {}).forEach(function (k) {
            if (own.call(KEEP_KEYS, k) || !own.call(defs, k) || !same(defs[k], theme[k])) out[k] = theme[k];
        });
        return out;
    }
    /* every theme value a body sets when applied over `current` */
    function effectiveTheme(body, current) {
        var defs = schema() || {}, out = {}, t = (body && body.theme) || {};
        Object.keys(defs).forEach(function (k) {
            if (excluded(k)) return;
            if (own.call(t, k)) out[k] = t[k];
            else if (own.call(KEEP_KEYS, k)) { if (has(current, k)) out[k] = current[k]; }
            else out[k] = defs[k];
        });
        return out;
    }
    function sameBody(a, b) { return stable(a) === stable(b); }

    /* ── Comparison ── */
    function humanize(k) {
        var s = String(k).replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/_/g, ' ').toLowerCase();
        return s.charAt(0).toUpperCase() + s.slice(1);
    }
    function label(key) {
        if (key === 'hudLayout') return tx('hudLayout');
        var tl = W.textLanguage || {};
        var l = typeof tl[key] === 'string' ? stripTags(tl[key]) : '';
        return l || humanize(key);
    }
    /* differences between two bodies, as applied over `current`:
     * [{ key, part: 'theme' | 'sound' | 'layout', label, a, b }] sorted by label */
    function diffBodies(a, b, current, labelFn) {
        labelFn = typeof labelFn === 'function' ? labelFn : label;
        var ea = effectiveTheme(a, current), eb = effectiveTheme(b, current), rows = [];
        Object.keys(ea).forEach(function (k) {
            if (!same(ea[k], eb[k])) rows.push({ key: k, part: 'theme', label: labelFn(k), a: ea[k], b: eb[k] });
        });
        Object.keys(eb).forEach(function (k) {
            if (!own.call(ea, k)) rows.push({ key: k, part: 'theme', label: labelFn(k), a: undefined, b: eb[k] });
        });
        var sa = (a && a.sounds) || {}, sb = (b && b.sounds) || {};
        SOUND_KEYS.forEach(function (k) {
            if ((has(sa, k) || has(sb, k)) && sa[k] !== sb[k]) rows.push({ key: k, part: 'sound', label: labelFn(k), a: sa[k], b: sb[k] });
        });
        var la = (a && a.hudLayout) || '', lb = (b && b.hudLayout) || '';
        if (la !== lb) rows.push({ key: 'hudLayout', part: 'layout', label: labelFn('hudLayout'), a: la || undefined, b: lb || undefined });
        rows.sort(function (x, y) { return String(x.label).localeCompare(String(y.label)); });
        return rows;
    }

    /* ── Version history ── */
    /* the theme gets a new body; the one it had goes to the front of its history (last 5) */
    function pushHistory(entry, body, t) {
        if (!entry || !body || sameBody(entry.body, body)) return false;
        entry.history = [{ t: entry.updated || entry.created || t, body: entry.body }].concat(entry.history || []).slice(0, MAX_HISTORY);
        entry.body = body;
        entry.updated = t;
        return true;
    }
    /* version i of the history becomes the theme; the replaced body goes into the history */
    function restoreVersion(entry, i, t) {
        var h = entry && entry.history && entry.history[i];
        if (!h) return false;
        var cur = { t: entry.updated || entry.created || t, body: entry.body };
        entry.history.splice(i, 1);
        if (!sameBody(cur.body, h.body)) entry.history.unshift(cur);
        entry.history = entry.history.slice(0, MAX_HISTORY);
        entry.body = h.body;
        entry.updated = t;
        return true;
    }

    /* ── Storage ── */
    var ID_RE = /^[a-z0-9]{1,24}$/;
    var SRC_RE = /^(g:[a-z0-9-]{1,40}|import|saved)$/;
    function cleanEntry(e) {
        if (!isObj(e) || typeof e.id !== 'string' || !ID_RE.test(e.id)) return null;
        var body = cleanBody(e.body);
        if (!body) return null;
        var now = Date.now();
        var out = {
            id: e.id,
            name: cleanText(e.name, NAME_MAX) || 'Theme',
            author: cleanText(e.author, AUTHOR_MAX),
            description: cleanText(e.description, DESC_MAX),
            created: toTime(e.created, now),
            updated: toTime(e.updated, now),
            body: body,
            history: []
        };
        if (typeof e.src === 'string' && SRC_RE.test(e.src)) out.src = e.src;
        if (Array.isArray(e.history)) {
            e.history.slice(0, MAX_HISTORY).forEach(function (h) {
                if (!isObj(h)) return;
                var hb = cleanBody(h.body);
                if (hb) out.history.push({ t: toTime(h.t, out.created), body: hb });
            });
        }
        return out;
    }
    function cleanStore(raw) {
        var list = isObj(raw) && Array.isArray(raw.themes) ? raw.themes : [];
        var out = [], ids = {};
        for (var i = 0; i < list.length && i < MAX_THEMES * 2 && out.length < MAX_THEMES; i++) {
            var e = cleanEntry(list[i]);
            if (!e || own.call(ids, e.id)) continue;
            ids[e.id] = true;
            out.push(e);
        }
        return { v: 1, themes: out };
    }
    /* Drops the oldest history versions until the store fits in max characters. */
    function fitStore(st, max) {
        max = max || MAX_STORE_CHARS;
        for (var guard = 0; guard < MAX_THEMES * MAX_HISTORY + 1; guard++) {
            if (JSON.stringify(st).length <= max) return true;
            var oi = -1, oj = -1, ot = Infinity;
            st.themes.forEach(function (e, i) {
                (e.history || []).forEach(function (h, j) { if (h.t < ot) { ot = h.t; oi = i; oj = j; } });
            });
            if (oi < 0) return false;
            st.themes[oi].history.splice(oj, 1);
        }
        return JSON.stringify(st).length <= max;
    }
    function store() { try { return W.localStorage || null; } catch (e) { return null; } }
    function readText(key) { try { var s = store(); return s ? s.getItem(key) : null; } catch (e) { return null; } }
    function writeText(key, text) {
        try { var s = store(); if (!s) return false; if (text === null) s.removeItem(key); else s.setItem(key, text); return true; } catch (e) { return false; }
    }
    function loadStore() {
        var t = readText(KEY_STORE), raw = null;
        if (t && t.length <= MAX_STORE_CHARS * 2) { try { raw = JSON.parse(t); } catch (e) { raw = null; } }
        return cleanStore(raw);
    }
    /* '' when saved, else the message key of the reason (nothing is changed then) */
    function saveStore(st) {
        if (!fitStore(st)) return 'tooBigStore';
        return writeText(KEY_STORE, JSON.stringify(st)) ? '' : 'storageFull';
    }
    function newId() { return 't' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
    function uniqueName(name, list) {
        var n = name, i = 2;
        var taken = function (x) { return list.some(function (e) { return e.name === x; }); };
        while (taken(n) && i < 100) n = Array.from(name).slice(0, NAME_MAX - 4).join('') + ' ' + (i++);
        return n;
    }

    /* ── Placement: the largest part of the screen that covers none of the given rectangles ── */
    function fitRect(view, avoid, gap, minW, minH) {
        gap = gap == null ? 6 : gap;
        minW = minW || 0; minH = minH || 0;
        var R = { left: 8, top: 8, right: view.w - 8, bottom: view.h - 8 }, overlap = false;
        (avoid || []).forEach(function (a) {
            if (!a) return;
            var A = { left: a.left - gap, top: a.top - gap, right: a.right + gap, bottom: a.bottom + gap };
            if (A.right <= R.left || A.left >= R.right || A.bottom <= R.top || A.top >= R.bottom) return;
            var c = [
                { left: R.left, top: A.bottom, right: R.right, bottom: R.bottom },
                { left: R.left, top: R.top, right: R.right, bottom: A.top },
                { left: A.right, top: R.top, right: R.right, bottom: R.bottom },
                { left: R.left, top: R.top, right: A.left, bottom: R.bottom }
            ].filter(function (r) { return r.right - r.left >= minW && r.bottom - r.top >= minH; });
            if (!c.length) { overlap = true; return; }
            c.sort(function (x, y) { return (y.right - y.left) * (y.bottom - y.top) - (x.right - x.left) * (x.bottom - x.top); });
            R = c[0];
        });
        return { left: R.left, top: R.top, width: Math.max(0, R.right - R.left), height: Math.max(0, R.bottom - R.top), overlap: overlap };
    }

    /* ── Gallery ── */
    function slug(s) { return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 30) || 'theme'; }
    /* the catalogue's themes, each checked like an imported package */
    function cleanCatalogue(raw) {
        if (!isObj(raw) || raw.format !== 'lm-theme-catalogue' || !Array.isArray(raw.themes)) return null;
        var out = [], ids = {};
        raw.themes.slice(0, MAX_CATALOGUE_THEMES).forEach(function (t) {
            var r = parsePackage(t);
            if (!r.ok) return;
            var gid = slug(r.pkg.name), n = 2;
            while (own.call(ids, gid)) gid = slug(r.pkg.name) + '-' + (n++);
            ids[gid] = true;
            out.push({ gid: gid, pkg: r.pkg, urls: r.urls });
        });
        return out;
    }

    /* ═══ Built-in presets ═══
     * The "Theme preset" (themePresets) and "Menu theme" (themeMenus) lists that were in the Theme
     * tab. A preset only names some settings and is put over the current theme, so everything it
     * does not name stays as it is, as the lists did; it also records its name (preset /
     * menuPreset). Values go through the same checks as an imported theme. */
    var BUILTIN_SETS = [['game', 'themePresets', 'preset'], ['menu', 'themeMenus', 'menuPreset']];
    function builtins() {
        var out = [];
        BUILTIN_SETS.forEach(function (set) {
            var src = W[set[1]];
            if (!isObj(src)) return;
            Object.keys(src).forEach(function (key) {
                if (!isObj(src[key]) || !/^[a-z0-9]+$/i.test(key)) return;
                out.push({ bid: set[0] + '-' + key.toLowerCase(), kind: set[0], key: key, name: cleanText(src[key].name, NAME_MAX) || key });
            });
        });
        return out;
    }
    /* the checked values one preset sets */
    function presetMap(b) {
        var set = BUILTIN_SETS.filter(function (x) { return x[0] === b.kind; })[0];
        var src = set && W[set[1]], p = isObj(src) && own.call(src, b.key) ? src[b.key] : null;
        if (!isObj(p)) return null;
        var defs = schema() || {}, raw = {};
        Object.keys(p).forEach(function (k) { if (k !== 'name' && own.call(defs, k)) raw[k] = p[k]; });
        raw[set[2]] = b.key;
        return cleanThemeMap(raw) || null;
    }
    /* the preset over a theme body (shown in the gallery and in Compare) */
    function builtinBody(b, base) {
        var m = presetMap(b);
        if (!m || !base) return null;
        var body = clone(base);
        body.theme = Object.assign({}, body.theme || {}, m);
        return body;
    }

    var core = {
        builtins: builtins, presetMap: presetMap, builtinBody: builtinBody,
        parsePackage: parsePackage, themeValue: themeValue, soundValue: soundValue, cleanUrl: cleanUrl, cleanText: cleanText,
        cleanBody: cleanBody, cleanStore: cleanStore, fitStore: fitStore, toPackage: toPackage, sparseTheme: sparseTheme,
        effectiveTheme: effectiveTheme, diffBodies: diffBodies, pushHistory: pushHistory, restoreVersion: restoreVersion,
        bodyUrls: bodyUrls, fitRect: fitRect, cleanCatalogue: cleanCatalogue, saveStore: saveStore, loadStore: loadStore,
        KEY_STORE: KEY_STORE, MAX_HISTORY: MAX_HISTORY, MAX_THEMES: MAX_THEMES, MAX_PACKAGE_CHARS: MAX_PACKAGE_CHARS, MAX_STORE_CHARS: MAX_STORE_CHARS
    };
    var api = W.LMThemeWorkshop = { core: core };

    var D = W.document;
    if (!D || typeof D.createElement !== 'function') return;

    /* ═══ Live settings ═══ */
    function T() { return isObj(W.defaultSettings) ? W.defaultSettings : null; }
    function S() { return W.legendmod5 || W.defaultmapsettings || null; }
    function jq() { return W.jQuery || W.$ || null; }
    function ready() { return !!(T() && schema() && jq() && W.Settings && typeof W.lmThemeValue === 'function'); }
    function toast(kind, html) {
        var t = W.toastr;
        if (!t) return;
        try { (t[kind] || t.info).call(t, '<b>[THEMES]:</b> ' + html); } catch (e) { }
    }
    /* the current theme as a body (the enlarged minimap counts with its normal width) */
    function captureBody() {
        var t = Object.assign({}, T());
        var orig = W.Settings && W.Settings._lmMiniBigOrig;
        if (orig) { t.miniMapWidth = orig; t.miniMapTop = Math.round(20 * orig / 200); }
        var theme = sparseTheme(cleanThemeMap(t) || {});
        var body = { theme: theme };
        var s = S(), sd = W.LM_SETTINGS_DEFAULTS || {}, snd = {}, n = 0;
        if (s) SOUND_KEYS.forEach(function (k) {
            var v = soundValue(k, s[k]);
            if (v !== undefined && v !== sd[k]) { snd[k] = v; n++; }
        });
        if (n) body.sounds = snd;
        return body;
    }
    /* the current theme with one preset put over it: only the keys the preset names change
     * (the enlarged minimap counts with its normal width, as in captureBody) */
    function builtinTarget(b) {
        var m = presetMap(b), d = T();
        if (!m || !d) return null;
        var t = Object.assign({}, d), orig = W.Settings && W.Settings._lmMiniBigOrig;
        if (orig) { t.miniMapWidth = orig; t.miniMapTop = Math.round(20 * orig / 200); }
        return Object.assign(t, m);
    }
    function findBuiltin(bid) { return builtins().filter(function (x) { return x.bid === bid; })[0] || null; }
    /* a preset applied and saved at once, as the old lists did */
    function applyBuiltin(b) {
        var target = b && builtinTarget(b), St = W.Settings;
        if (!ready() || !target) return false;
        if (preview) endPreview(false, true);
        if (St._lmMiniBigOrig) St._lmMiniBigOrig = 0;
        setValues(target, false);
        var ok = true;
        try { St.saveThemeSettings(); } catch (e) { ok = false; }
        toast(ok ? 'success' : 'warning', esc(ok ? tx('kept', b.name) : tx('saveFailed')));
        return true;
    }
    var SELECT_IDS = { preset: 'themePreset', chatPos: 'chatPosition' };
    /* one theme value through its control, as a theme preset sets it (Settings.changePreset) */
    function setThemeOpt(k, v) {
        var $ = jq(), d = T();
        d[k] = v;
        if (W.ogario && has(W.ogario, k)) W.ogario[k] = v;
        try {
            var pk = $('#theme .' + k + '-picker');
            if (pk.length && pk.colorpicker) pk.colorpicker('setValue', v);
        } catch (e) { }
        d[k] = v;
        var sl = $('#' + k + '-slider');
        if (sl.length && sl.closest('#theme').length) { sl.val(v); $('#' + k + '-value').text(v); }
        var box = $('#theme input[type=text]#' + k + ', #theme select#' + (SELECT_IDS[k] || k));
        if (box.length) box.val(v);
        if (k === 'customCursor') {
            $('#theme-images .cursor-box a').removeClass('active').filter(function () { return $('img', this).attr('src') === v; }).addClass('active');
        }
    }
    /* Sets a full theme map live; with exact the values are put back once more after the setters
     * (the font setters derive their family / weight values). Returns the changed keys. */
    function setValues(target, exact) {
        var d = T(), St = W.Settings, changed = [];
        Object.keys(target).forEach(function (k) { if (has(d, k) && !same(d[k], target[k])) changed.push(k); });
        if (!changed.length) return changed;
        changed.forEach(function (k) { try { setThemeOpt(k, target[k]); } catch (e) { d[k] = target[k]; } });
        var put = function (keys) {
            keys.forEach(function (k) {
                if (!has(d, k) || same(d[k], target[k])) return;
                d[k] = target[k];
                if (W.ogario && has(W.ogario, k)) W.ogario[k] = target[k];
            });
        };
        put(changed);
        try { if (St.setTheme) St.setTheme(); } catch (e) { }
        ['setGameFilter', 'setFoodColor', 'setIndicatorColor'].forEach(function (f) { try { if (typeof St[f] === 'function') St[f](); } catch (e) { } });
        if (changed.indexOf('chatPos') >= 0) { try { St.setChatPosition(); } catch (e) { } }
        if (exact) put(Object.keys(target));
        return changed;
    }
    function setSounds(map) {
        var s = S(), app = W.application, $ = jq(), changed = [];
        if (!s || !map) return changed;
        SOUND_KEYS.forEach(function (k) {
            if (!has(map, k) || s[k] === map[k]) return;
            s[k] = map[k];
            changed.push(k);
            try { $('#' + k).val(map[k]); } catch (e) { }
            try { if (app && typeof app[SOUND_SETTERS[k]] === 'function') app[SOUND_SETTERS[k]](); } catch (e) { }
        });
        return changed;
    }
    function saveSounds() {
        var app = W.application;
        try { if (app && app.saveSettings) app.saveSettings(S(), 'ogarioSettings'); } catch (e) { }
    }

    /* ═══ Preview ═══ */
    var preview = null;
    function previewing() { return !!preview; }
    function snapshot() {
        var s = S(), snd = {};
        if (s) SOUND_KEYS.forEach(function (k) { snd[k] = s[k]; });
        return { t: Object.assign({}, T()), s: snd, big: (W.Settings && W.Settings._lmMiniBigOrig) || 0, stored: readText('ogarioThemeSettings') };
    }
    /* Shows a body for ms (default 15 s); Keep saves it, Revert or the timer put the theme back. */
    function startPreview(body, name, ms, target) {
        if (!ready() || !body) return false;
        if (preview) endPreview(false, true);
        guardSave();
        var St = W.Settings;
        var snap = snapshot();
        preview = { snap: snap, name: name || '', deadline: Date.now() + (ms > 0 ? ms : PREVIEW_MS), timer: null, sounds: [] };
        /* the theme sets the minimap width: the enlarged minimap (hotkey) ends */
        if (St._lmMiniBigOrig) St._lmMiniBigOrig = 0;
        setValues(target || effectiveTheme(body, T()), false);
        preview.sounds = setSounds(body.sounds);
        /* what the preview set: a value that differs from it later is a newer change (it is kept) */
        preview.applied = Object.assign({}, T());
        preview.appliedS = snapshot().s;
        preview.timer = setInterval(tick, 250);
        showFrame(false);
        renderBar();
        return true;
    }
    function tick() {
        if (!preview) return;
        if (Date.now() >= preview.deadline) { endPreview(false, false, true); return; }
        var el = D.querySelector('#lm-tw-pv .lm-tw-pv-left');
        if (el) el.textContent = tx('revertsIn', Math.max(0, Math.ceil((preview.deadline - Date.now()) / 1000)));
    }
    /* the theme changed after the preview set it (the player, a theme preset, another tool) */
    function changedSince(p) {
        var d = T();
        for (var k in p.applied) if (own.call(p.applied, k) && !same(d[k], p.applied[k])) return true;
        return false;
    }
    /* Keep: save the previewed theme. Otherwise put the snapshot back exactly, except values that
     * changed after the preview set them: those are newer than the preview and stay. Nothing
     * stored is written back either: the preview never saves, so a changed stored theme is newer. */
    function endPreview(keep, quiet, auto, newer) {
        var p = preview;
        if (!p) return;
        preview = null;
        clearInterval(p.timer);
        var bar = D.getElementById('lm-tw-pv');
        if (bar) bar.parentNode.removeChild(bar);
        var St = W.Settings;
        if (keep) {
            var ok = true;
            try { St.saveThemeSettings(); } catch (e) { ok = false; }
            if (p.sounds.length) saveSounds();
            if (!quiet) toast(ok ? 'success' : 'warning', esc(ok ? tx('kept', p.name) : tx('saveFailed')));
        } else {
            var d = T(), back = {}, s = S(), sback = {}, k;
            for (k in p.snap.t) if (own.call(p.snap.t, k) && (!has(p.applied, k) || same(d[k], p.applied[k]))) back[k] = p.snap.t[k];
            setValues(back, true);
            if (has(back, 'miniMapWidth')) St._lmMiniBigOrig = p.snap.big;
            if (p.sounds.length && s) {
                p.sounds.forEach(function (sk) { if (s[sk] === p.appliedS[sk]) sback[sk] = p.snap.s[sk]; });
                if (setSounds(sback).length) saveSounds();
            }
            if (!quiet) toast('info', esc(tx(newer ? 'revertedNewer' : auto ? 'revertedAuto' : 'reverted')));
        }
        if (!quiet) showFrame(true);
    }
    /* the theme is not saved while it is previewed (the Theme tab saves on every control change) */
    var guarded = false;
    function guardSave() {
        var St = W.Settings, orig = St && St.saveThemeSettings;
        if (guarded || typeof orig !== 'function') return;
        guarded = true;
        var w = function () {
            if (preview) {
                /* the preview's own values (the Theme tab saves 600 ms after the preview set its
                 * controls): not saved */
                if (!changedSince(preview)) return;
                /* a newer change during the preview (the player, a theme preset): the preview ends
                 * first, so its timer can never roll this change back, then the save goes through */
                endPreview(false, false, false, true);
            }
            return orig.apply(this, arguments);
        };
        w._lmTw = true;
        /* keep the marker of other wrappers (settings profiles) so they do not wrap twice */
        if (orig._lmSp) w._lmSp = true;
        St.saveThemeSettings = w;
    }

    /* ═══ Window ═══ */
    var tab = 'mine', openHist = {}, pending = null, gallery = null, galleryState = '', cmpA = 'cur', cmpB = '', ioText = '';
    function frame() { return D.getElementById('lm-tw'); }
    function isOpen() { return !!frame(); }
    function css() {
        if (D.getElementById('lm-tw-style')) return;
        var st = D.createElement('style');
        st.id = 'lm-tw-style';
        st.textContent =
            '#lm-tw{position:fixed;z-index:2000000;display:flex;align-items:center;justify-content:center;pointer-events:none;font-family:inherit}' +
            '#lm-tw .lm-tw-win{pointer-events:auto;background:var(--lm-pc,#1b1f2a);color:var(--lm-tc,#eee);border:1px solid var(--lm-pc2,transparent);border-top:3px solid var(--lm-mc,transparent);border-radius:var(--lm-radius,6px);width:760px;max-width:100%;max-height:100%;display:flex;flex-direction:column;font-size:12px;box-shadow:0 8px 32px rgba(0,0,0,.5);overflow:hidden}' +
            '#lm-tw .lm-tw-head{display:flex;align-items:center;justify-content:space-between;padding:2px 4px 2px 12px;border-bottom:1px solid var(--lm-pc2,rgba(255,255,255,.1));background:linear-gradient(180deg,var(--lm-pc2,transparent) 0%,var(--lm-pc,transparent) 100%)}' +
            '#lm-tw .lm-tw-head b{font-size:14px;color:var(--lm-mc,inherit);text-transform:uppercase;letter-spacing:1px}' +
            '#lm-tw .lm-tw-x{background:rgba(255,255,255,.05);border:0;border-radius:var(--lm-radius-s,4px);color:var(--lm-tc2,#bbb);font-size:24px;line-height:1;min-width:44px;min-height:36px;cursor:pointer}' +
            '#lm-tw .lm-tw-tabs{display:flex;gap:2px;padding:4px 8px 0;flex-wrap:wrap}' +
            '#lm-tw .lm-tw-tabs button{background:rgba(255,255,255,.06);border:1px solid var(--lm-pc2,rgba(255,255,255,.12));border-bottom:0;color:var(--lm-tc2,#ccc);font-family:inherit;padding:4px 10px;border-radius:var(--lm-radius-s,4px) var(--lm-radius-s,4px) 0 0;min-height:30px;cursor:pointer}' +
            '#lm-tw .lm-tw-tabs button.active{background:var(--lm-pc2,rgba(255,255,255,.16));color:var(--lm-mc,#fff)}' +
            '#lm-tw .lm-tw-body{overflow:auto;-webkit-overflow-scrolling:touch;padding:8px 10px 10px;flex:1;min-height:0;touch-action:pan-y;overscroll-behavior:contain;border-top:1px solid var(--lm-pc2,rgba(255,255,255,.12))}' +
            '#lm-tw .lm-tw-row{display:flex;flex-wrap:wrap;align-items:center;gap:4px;margin-bottom:6px}' +
            '#lm-tw .lm-tw-btn,#lm-tw-pv .lm-tw-btn{background:rgba(255,255,255,.05);color:var(--lm-tc,#eee);border:1px solid var(--lm-pc2,rgba(127,127,127,.45));border-radius:var(--lm-radius-s,4px);padding:3px 8px;min-height:28px;font-size:12px;font-family:inherit;cursor:pointer}' +
            '#lm-tw .lm-tw-btn:hover,#lm-tw-pv .lm-tw-btn:hover{background:rgba(255,255,255,.14)}' +
            '#lm-tw .lm-tw-go,#lm-tw-pv .lm-tw-go{border-color:#3c9e5a;background:rgba(60,158,90,.35)}' +
            '#lm-tw .lm-tw-warn{border-color:#c0504d}' +
            '#lm-tw input[type=text],#lm-tw select,#lm-tw textarea{background:var(--lm-pc2,#11141c);color:var(--lm-tc,#eee);border:1px solid rgba(255,255,255,.2);border-radius:var(--lm-radius-s,3px);padding:3px 6px;min-height:28px;font-size:12px;max-width:100%}' +
            '#lm-tw textarea{width:100%;height:90px;font-family:monospace;resize:vertical}' +
            '#lm-tw .lm-tw-note{opacity:.7;font-size:11px;margin:2px 0 6px}' +
            '#lm-tw .lm-tw-item{display:flex;flex-wrap:wrap;align-items:center;gap:6px;padding:6px 0;border-top:1px solid var(--lm-pc2,rgba(255,255,255,.08))}' +
            '#lm-tw .lm-tw-name{min-width:140px;flex:1;word-break:break-word}' +
            '#lm-tw .lm-tw-name small{opacity:.65;margin-left:4px}' +
            '#lm-tw .lm-tw-desc{opacity:.75;font-size:11px}' +
            '#lm-tw .lm-tw-acts{display:flex;flex-wrap:wrap;gap:3px}' +
            '#lm-tw .lm-tw-hist{flex-basis:100%;padding:2px 0 2px 104px}' +
            '#lm-tw .lm-tw-hist div{display:flex;flex-wrap:wrap;align-items:center;gap:4px;margin:2px 0}' +
            '#lm-tw .lm-tw-prev{position:relative;flex:0 0 96px;width:96px;height:48px;border-radius:var(--lm-radius-s,4px);border:2px solid;overflow:hidden}' +
            '#lm-tw .lm-tw-prev span{position:absolute;border-radius:50%}' +
            '#lm-tw .lm-tw-prev .c{left:8px;top:9px;width:26px;height:26px;font:700 9px Ubuntu,Arial,sans-serif;line-height:26px;text-align:center}' +
            '#lm-tw .lm-tw-prev .f{width:6px;height:6px}' +
            '#lm-tw .lm-tw-prev .v{left:44px;top:20px;width:18px;height:18px;border:2px solid}' +
            '#lm-tw .lm-tw-prev .m{right:4px;top:6px;width:22px;height:32px;border-radius:2px;border-bottom:4px solid}' +
            '#lm-tw .lm-tw-urls{border:1px solid #e6a23c;border-radius:var(--lm-radius-s,4px);padding:6px 8px;margin-bottom:8px;background:rgba(230,162,60,.1)}' +
            '#lm-tw .lm-tw-urls code{word-break:break-all;color:#ffd58a;background:none}' +
            '#lm-tw table{width:100%;border-collapse:collapse}' +
            '#lm-tw td,#lm-tw th{padding:3px 4px;border-top:1px solid var(--lm-pc2,rgba(255,255,255,.08));text-align:left;vertical-align:top;word-break:break-word}' +
            '#lm-tw th{opacity:.75;font-weight:600}' +
            '#lm-tw .lm-tw-chip{display:inline-block;width:12px;height:12px;border-radius:2px;border:1px solid rgba(255,255,255,.4);vertical-align:-2px;margin-right:4px}' +
            '#lm-tw h6{margin:8px 0 4px;font-size:12px;opacity:.85}' +
            '#lm-tw-pv{position:fixed;z-index:2000001;display:flex;flex-wrap:wrap;align-items:center;gap:6px;padding:6px 8px;background:var(--lm-pc,rgba(20,24,34,.94));color:var(--lm-tc,#eee);border:1px solid var(--lm-pc2,rgba(255,255,255,.25));border-top:3px solid var(--lm-mc,rgba(255,255,255,.25));border-radius:var(--lm-radius,6px);font-family:inherit;font-size:12px;box-shadow:0 4px 18px rgba(0,0,0,.5)}' +
            '#lm-tw-pv .lm-tw-pv-name{font-weight:600;max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
            '#lm-tw-pv .lm-tw-pv-left{opacity:.75}' +
            '@media (pointer:coarse){#lm-tw .lm-tw-btn,#lm-tw-pv .lm-tw-btn{min-height:36px;padding:3px 10px}#lm-tw .lm-tw-tabs button{min-height:36px}}' +
            '@media (max-width:600px){#lm-tw .lm-tw-hist{padding-left:0}}';
        D.head.appendChild(st);
    }
    /* what the window and the preview bar must not cover: the notification bell, the Command Centre quick bar */
    function avoidRects() {
        var out = [];
        ['lm-notif-bell', 'lm-cc-bar'].forEach(function (id) {
            var el = D.getElementById(id);
            if (!el) return;
            var cs = W.getComputedStyle ? W.getComputedStyle(el) : null;
            if (cs && (cs.display === 'none' || cs.visibility === 'hidden')) return;
            var r = el.getBoundingClientRect();
            if (r.width && r.height) out.push({ left: r.left, top: r.top, right: r.right, bottom: r.bottom });
        });
        return out;
    }
    function viewSize() { return { w: W.innerWidth || D.documentElement.clientWidth, h: W.innerHeight || D.documentElement.clientHeight }; }
    function place() {
        var f = frame();
        if (!f) return;
        var r = fitRect(viewSize(), avoidRects(), 6, 300, 220);
        f.style.left = r.left + 'px';
        f.style.top = r.top + 'px';
        f.style.width = r.width + 'px';
        f.style.height = r.height + 'px';
    }
    function placeBar() {
        var b = D.getElementById('lm-tw-pv');
        if (!b) return;
        var r = fitRect(viewSize(), avoidRects(), 6, 240, 60);
        b.style.maxWidth = r.width + 'px';
        var w = b.offsetWidth, h = b.offsetHeight;
        b.style.left = Math.round(r.left + Math.max(0, (r.width - w) / 2)) + 'px';
        b.style.top = Math.round(r.top + Math.max(0, r.height - h - 40)) + 'px';
    }
    function onResize() { place(); placeBar(); }
    /* touches, clicks, wheel and keys in the window do not reach the game */
    function shield(el) {
        ['mousedown', 'mouseup', 'touchstart', 'touchend', 'pointerdown', 'wheel', 'keydown', 'keyup', 'contextmenu'].forEach(function (n) {
            el.addEventListener(n, function (e) { e.stopPropagation(); }, false);
        });
    }
    function open() {
        if (!ready()) { toast('info', esc(tx('loadingMod'))); return; }
        if (preview) return;
        if (isOpen()) { showFrame(true); render(); return; }
        css();
        var $ = jq();
        var f = $('<div id="lm-tw"></div>');
        var win = $('<div class="lm-tw-win" role="dialog" aria-modal="false"></div>').attr('aria-label', tx('title')).appendTo(f);
        var head = $('<div class="lm-tw-head"></div>').appendTo(win);
        $('<b></b>').text(tx('title')).appendTo(head);
        $('<button type="button" class="lm-tw-x">&times;</button>').attr('aria-label', tx('close')).attr('title', tx('close')).appendTo(head);
        var tabs = $('<div class="lm-tw-tabs"></div>').appendTo(win);
        [['mine', 'tabMine'], ['gallery', 'tabGallery'], ['io', 'tabIo'], ['compare', 'tabCompare']].forEach(function (t) {
            $('<button type="button"></button>').attr('data-tab', t[0]).text(tx(t[1])).appendTo(tabs);
        });
        $('<div class="lm-tw-body"></div>').appendTo(win);
        win.on('click', '.lm-tw-x', function (e) { e.preventDefault(); close(); });
        tabs.on('click', 'button', function () { tab = $(this).attr('data-tab'); pending = null; render(); return false; });
        win.on('click', '[data-act]', function (e) {
            e.preventDefault();
            act($(this).attr('data-act'), $(this).attr('data-id'));
        }).on('change', 'select[data-field]', function () {
            var fld = $(this).attr('data-field');
            if (fld === 'cmpA') cmpA = this.value;
            else if (fld === 'cmpB') cmpB = this.value;
            if (fld === 'cmpA' || fld === 'cmpB') render();
        }).on('change', 'input[type=file]', function () { importFile(this); });
        win.on('keydown', function (e) { if (e.key === 'Escape' || e.keyCode === 27) { e.preventDefault(); close(); } });
        shield(f[0]);
        $('body').append(f);
        place();
        W.addEventListener('resize', onResize);
        render();
    }
    function close() {
        var f = frame();
        if (f) f.parentNode.removeChild(f);
        pending = null;
        if (!preview) W.removeEventListener('resize', onResize);
    }
    function toggle() { if (preview) return; if (isOpen()) close(); else open(); }
    function showFrame(on) {
        var f = frame();
        if (!f) return;
        f.style.display = on ? '' : 'none';
        if (on) { place(); render(); }
    }
    function renderBar() {
        var $ = jq();
        if (!preview) return;
        css();
        $('#lm-tw-pv').remove();
        var b = $('<div id="lm-tw-pv" role="status"></div>');
        $('<span class="lm-tw-pv-name"></span>').text(tx('previewing', preview.name)).appendTo(b);
        $('<span class="lm-tw-pv-left"></span>').text(tx('revertsIn', Math.ceil(PREVIEW_MS / 1000))).appendTo(b);
        $('<button type="button" class="lm-tw-btn lm-tw-go" data-pv="keep"></button>').text(tx('keep')).appendTo(b);
        $('<button type="button" class="lm-tw-btn" data-pv="revert"></button>').text(tx('revert')).appendTo(b);
        b.on('click', '[data-pv]', function (e) {
            e.preventDefault();
            endPreview($(this).attr('data-pv') === 'keep');
        });
        shield(b[0]);
        $('body').append(b);
        W.addEventListener('resize', onResize);
        placeBar();
        tick();
    }
    function btn(text, a, id, cls) {
        var $ = jq();
        var b = $('<button type="button" class="lm-tw-btn"></button>').text(text).attr('data-act', a);
        if (id != null) b.attr('data-id', id);
        if (cls) b.addClass(cls);
        return b;
    }
    function when(t) {
        if (!t) return '';
        try { return new Date(t).toLocaleString(); } catch (e) { return String(t); }
    }
    /* a small picture of the theme: field, border, a cell with its name, food, a virus, a menu panel */
    function previewPic(body) {
        var $ = jq(), e = effectiveTheme(body, T());
        var p = $('<div class="lm-tw-prev" aria-hidden="true"></div>').css({ background: e.bgColor, borderColor: e.bordersColor });
        $('<span class="c">Aa</span>').css({ background: e.mainColor, color: e.namesColor }).appendTo(p);
        [[38, 8], [70, 38], [30, 38]].forEach(function (xy) { $('<span class="f"></span>').css({ left: xy[0] + 'px', top: xy[1] + 'px', background: e.foodColor }).appendTo(p); });
        $('<span class="v"></span>').css({ background: e.virusColor, borderColor: e.virusStrokeColor }).appendTo(p);
        $('<span class="m"></span>').css({ background: e.menuPanelColor, borderBottomColor: e.menuMainColor }).appendTo(p);
        return p;
    }
    function render() {
        var $ = jq(), f = $('#lm-tw');
        if (!f.length) return;
        f.find('.lm-tw-tabs button').each(function () { $(this).toggleClass('active', $(this).attr('data-tab') === tab); });
        var body = f.find('.lm-tw-body').empty();
        if (pending) renderPending(body);
        if (tab === 'gallery') renderGallery(body);
        else if (tab === 'io') renderIo(body);
        else if (tab === 'compare') renderCompare(body);
        else renderMine(body);
    }
    function renderPending(body) {
        var $ = jq();
        var box = $('<div class="lm-tw-urls"></div>').appendTo(body);
        $('<div></div>').text(tx('urlsTitle')).appendTo(box);
        var ul = $('<ul style="margin:4px 0 6px 16px;padding:0"></ul>').appendTo(box);
        pending.urls.forEach(function (u) {
            var li = $('<li></li>').appendTo(ul);
            $('<span></span>').text(label(u.key) + ': ').appendTo(li);
            $('<code></code>').text(u.url).appendTo(li);
        });
        var row = $('<div class="lm-tw-row"></div>').appendTo(box);
        btn(tx('go'), 'pv-go', null, 'lm-tw-go').appendTo(row);
        btn(tx('cancel'), 'pv-cancel').appendTo(row);
    }
    function renderMine(body) {
        var $ = jq(), list = loadStore().themes;
        var row = $('<div class="lm-tw-row"></div>').appendTo(body);
        $('<input type="text" id="lm-tw-name" maxlength="40">').attr('placeholder', tx('namePh')).appendTo(row);
        btn(tx('saveCurrent'), 'save', null, 'lm-tw-go').appendTo(row);
        $('<div class="lm-tw-note"></div>').text(tx('mineNote')).appendTo(body);
        if (!list.length) { $('<div class="lm-tw-note"></div>').text(tx('empty')).appendTo(body); return; }
        list.forEach(function (e) {
            var it = $('<div class="lm-tw-item"></div>').appendTo(body);
            previewPic(e.body).appendTo(it);
            var nm = $('<div class="lm-tw-name"></div>').appendTo(it);
            $('<span></span>').text(e.name).appendTo(nm);
            $('<small></small>').text((e.author ? tx('by', e.author) + ' · ' : '') + when(e.updated)).appendTo(nm);
            if (e.description) $('<div class="lm-tw-desc"></div>').text(e.description).appendTo(nm);
            var acts = $('<div class="lm-tw-acts"></div>').appendTo(it);
            btn(tx('preview'), 'pv', e.id, 'lm-tw-go').appendTo(acts);
            btn(tx('update'), 'update', e.id).appendTo(acts);
            btn(tx('rename'), 'rename', e.id).appendTo(acts);
            btn(tx('duplicate'), 'dup', e.id).appendTo(acts);
            btn(tx('exportBtn'), 'export', e.id).appendTo(acts);
            btn(tx('compare'), 'cmp', 'm:' + e.id).appendTo(acts);
            btn(tx('history', e.history.length), 'hist', e.id).appendTo(acts);
            btn(tx('del'), 'del', e.id, 'lm-tw-warn').appendTo(acts);
            if (openHist[e.id]) {
                var h = $('<div class="lm-tw-hist"></div>').appendTo(it);
                if (!e.history.length) $('<div class="lm-tw-note"></div>').text(tx('noHistory')).appendTo(h);
                e.history.forEach(function (v, i) {
                    var r = $('<div></div>').appendTo(h);
                    $('<span></span>').text(when(v.t)).appendTo(r);
                    btn(tx('preview'), 'hpv', e.id + ':' + i).appendTo(r);
                    btn(tx('compare'), 'cmp', 'h:' + e.id + ':' + i).appendTo(r);
                    btn(tx('restore'), 'hrestore', e.id + ':' + i).appendTo(r);
                });
            }
        });
    }
    function renderBuiltins(body) {
        var $ = jq(), list = builtins(), base = captureBody();
        if (!list.length) return;
        $('<h6></h6>').text(tx('builtinTitle')).appendTo(body);
        $('<div class="lm-tw-note"></div>').text(tx('builtinNote')).appendTo(body);
        list.forEach(function (b) {
            var bb = builtinBody(b, base);
            if (!bb) return;
            var it = $('<div class="lm-tw-item lm-tw-bitem"></div>').attr('data-bid', b.bid).appendTo(body);
            previewPic(bb).appendTo(it);
            var nm = $('<div class="lm-tw-name"></div>').appendTo(it);
            $('<span></span>').text(b.name).appendTo(nm);
            $('<small></small>').text(tx(b.kind === 'menu' ? 'kindMenu' : 'kindGame')).appendTo(nm);
            var acts = $('<div class="lm-tw-acts"></div>').appendTo(it);
            btn(tx('preview'), 'bpv', b.bid, 'lm-tw-go').appendTo(acts);
            btn(tx('apply'), 'bapply', b.bid).appendTo(acts);
            btn(tx('compare'), 'cmp', 'b:' + b.bid).appendTo(acts);
        });
        $('<h6></h6>').text(tx('galleryTitle')).appendTo(body);
    }
    function renderGallery(body) {
        var $ = jq();
        renderBuiltins(body);
        $('<div class="lm-tw-note"></div>').text(tx('galleryNote')).appendTo(body);
        $('<div class="lm-tw-note"></div>').text(tx('publishNote')).appendTo(body);
        if (!gallery) {
            if (!galleryState) loadGallery();
            if (galleryState === 'fail') {
                var r = $('<div class="lm-tw-row"></div>').appendTo(body);
                $('<span></span>').text(tx('galleryFail')).appendTo(r);
                btn(tx('retry'), 'gretry').appendTo(r);
            } else $('<div class="lm-tw-note lm-tw-loading"></div>').text(tx('galleryLoading')).appendTo(body);
            return;
        }
        var mine = loadStore().themes;
        gallery.forEach(function (g) {
            var it = $('<div class="lm-tw-item lm-tw-gitem"></div>').attr('data-gid', g.gid).appendTo(body);
            previewPic(g.pkg.body).appendTo(it);
            var nm = $('<div class="lm-tw-name"></div>').appendTo(it);
            $('<span></span>').text(g.pkg.name).appendTo(nm);
            if (g.pkg.author) $('<small></small>').text(tx('by', g.pkg.author)).appendTo(nm);
            if (g.pkg.description) $('<div class="lm-tw-desc"></div>').text(g.pkg.description).appendTo(nm);
            var acts = $('<div class="lm-tw-acts"></div>').appendTo(it);
            btn(tx('preview'), 'gpv', g.gid, 'lm-tw-go').appendTo(acts);
            var inst = mine.some(function (e) { return e.src === 'g:' + g.gid; });
            btn(inst ? tx('installed') : tx('install'), 'ginstall', g.gid).prop('disabled', inst).appendTo(acts);
            btn(tx('compare'), 'cmp', 'g:' + g.gid).appendTo(acts);
        });
    }
    function renderIo(body) {
        var $ = jq(), list = loadStore().themes;
        $('<h6></h6>').text(tx('importTitle')).appendTo(body);
        $('<textarea id="lm-tw-text" spellcheck="false"></textarea>').attr('placeholder', tx('importPh')).val(ioText).appendTo(body);
        var r1 = $('<div class="lm-tw-row"></div>').appendTo(body);
        btn(tx('importBtn'), 'import', null, 'lm-tw-go').appendTo(r1);
        var fl = $('<label class="lm-tw-btn" style="margin:0;display:inline-flex;align-items:center"></label>').text(tx('importFile')).appendTo(r1);
        $('<input type="file" accept=".json,application/json,text/plain" style="display:none">').appendTo(fl);
        $('<h6></h6>').text(tx('exportTitle')).appendTo(body);
        var r2 = $('<div class="lm-tw-row"></div>').appendTo(body);
        var sel = $('<select id="lm-tw-exp"></select>').appendTo(r2);
        $('<option value="cur"></option>').text(tx('currentTheme')).appendTo(sel);
        list.forEach(function (e) { $('<option></option>').val('m:' + e.id).text(e.name).appendTo(sel); });
        btn(tx('download'), 'xdl').appendTo(r2);
        btn(tx('showJson'), 'xshow').appendTo(r2);
        btn(tx('copy'), 'xcopy').appendTo(r2);
        $('<div class="lm-tw-note"></div>').text(tx('publishNote')).appendTo(body);
    }
    function sources() {
        var out = [{ v: 'cur', name: tx('currentTheme') }];
        loadStore().themes.forEach(function (e) {
            out.push({ v: 'm:' + e.id, name: e.name });
            e.history.forEach(function (h, i) { out.push({ v: 'h:' + e.id + ':' + i, name: tx('versionOf', e.name, when(h.t)) }); });
        });
        builtins().forEach(function (b) { out.push({ v: 'b:' + b.bid, name: tx('builtinTitle') + ': ' + b.name + ' (' + tx(b.kind === 'menu' ? 'kindMenu' : 'kindGame') + ')' }); });
        (gallery || []).forEach(function (g) { out.push({ v: 'g:' + g.gid, name: tx('tabGallery') + ': ' + g.pkg.name }); });
        return out;
    }
    /* a source id ('cur', 'm:id', 'h:id:i', 'g:gid') as { name, body } */
    function resolve(v) {
        if (v === 'cur') return { name: tx('currentTheme'), body: captureBody() };
        var m = /^(m|h|g|b):([a-z0-9-]+)(?::(\d+))?$/.exec(v || '');
        if (!m) return null;
        if (m[1] === 'b') {
            var bi = findBuiltin(m[2]), bb = bi && builtinBody(bi, captureBody());
            return bb ? { name: bi.name, body: bb } : null;
        }
        if (m[1] === 'g') {
            var g = (gallery || []).filter(function (x) { return x.gid === m[2]; })[0];
            return g ? { name: g.pkg.name, body: g.pkg.body } : null;
        }
        var e = loadStore().themes.filter(function (x) { return x.id === m[2]; })[0];
        if (!e) return null;
        if (m[1] === 'm') return { name: e.name, body: e.body };
        var h = e.history[+m[3]];
        return h ? { name: tx('versionOf', e.name, when(h.t)), body: h.body } : null;
    }
    function fmt(v) {
        if (v === undefined || v === '') return tx('notSet');
        if (v === true) return tx('on');
        if (v === false) return tx('off');
        var s = String(v);
        return s.length > 80 ? s.slice(0, 77) + '...' : s;
    }
    function valueCell(td, v, key) {
        var $ = jq(), defs = schema() || {};
        if (typeof v === 'string' && typeof defs[key] === 'string' && COLOR_DEFAULT.test(defs[key]) && COLOR_VALUE.test(v)) {
            $('<span class="lm-tw-chip"></span>').css('background', v).appendTo(td);
        }
        $('<span></span>').text(fmt(v)).appendTo(td);
    }
    function renderCompare(body) {
        var $ = jq(), src = sources();
        if (!src.some(function (s) { return s.v === cmpA; })) cmpA = 'cur';
        if (!cmpB || !src.some(function (s) { return s.v === cmpB; })) cmpB = (src[1] && src[1].v) || 'cur';
        var row = $('<div class="lm-tw-row"></div>').appendTo(body);
        [['cmpA', cmpA], ['cmpB', cmpB]].forEach(function (p) {
            $('<span></span>').text(tx(p[0]) + ':').appendTo(row);
            var sel = $('<select></select>').attr('data-field', p[0]).appendTo(row);
            src.forEach(function (s) { $('<option></option>').val(s.v).text(s.name).appendTo(sel); });
            sel.val(p[1]);
        });
        var a = resolve(cmpA), b = resolve(cmpB);
        if (!a || !b) return;
        var rows = diffBodies(a.body, b.body, T(), label);
        $('<div class="lm-tw-note lm-tw-diffcount"></div>').text(rows.length ? tx('diffCount', rows.length) : tx('diffNone')).appendTo(body);
        if (!rows.length) return;
        var table = $('<table></table>').appendTo(body);
        var hr = $('<tr></tr>').appendTo(table);
        $('<th></th>').text(tx('colSetting')).appendTo(hr);
        $('<th></th>').text(tx('cmpA')).appendTo(hr);
        $('<th></th>').text(tx('cmpB')).appendTo(hr);
        rows.forEach(function (r) {
            var tr = $('<tr></tr>').appendTo(table);
            $('<td></td>').text(r.label).appendTo(tr);
            valueCell($('<td></td>').appendTo(tr), r.a, r.key);
            valueCell($('<td></td>').appendTo(tr), r.b, r.key);
        });
    }

    /* ═══ Gallery ═══ */
    function loadGallery() {
        galleryState = 'loading';
        var done = function (list) {
            gallery = list && list.length ? list : null;
            galleryState = gallery ? 'ok' : 'fail';
            if (isOpen() && (tab === 'gallery' || tab === 'compare')) render();
        };
        if (typeof W.fetch !== 'function') { done(null); return; }
        W.fetch(CATALOGUE_URL + '?v=' + encodeURIComponent(W.OgVer || ''), { cache: 'no-cache', credentials: 'omit' })
            .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
            .then(function (t) {
                if (t.length > MAX_CATALOGUE_CHARS) throw new Error('too big');
                done(cleanCatalogue(JSON.parse(t)));
            })
            .catch(function () { done(null); });
    }

    /* ═══ Import / export ═══ */
    function importText(text) {
        var r = parsePackage(text);
        if (!r.ok) { toast('error', esc(tx('e_' + r.error))); return null; }
        var st = loadStore();
        if (st.themes.length >= MAX_THEMES) { toast('error', esc(tx('tooMany'))); return null; }
        var now = Date.now();
        var e = { id: newId(), name: uniqueName(r.pkg.name, st.themes), author: r.pkg.author, description: r.pkg.description, created: r.pkg.created, updated: now, src: 'import', body: r.pkg.body, history: [] };
        st.themes.unshift(e);
        var err = saveStore(st);
        if (err) { toast('error', esc(tx(err))); return null; }
        var msg = tx('imported', e.name, Object.keys(e.body.theme).length + (e.body.sounds ? Object.keys(e.body.sounds).length : 0));
        if (r.dropped.length) msg += tx('importedDropped', r.dropped.length);
        if (r.urls.length) msg += tx('importedUrls', r.urls.map(function (u) { return hostOf(u.url); }).filter(function (h, i, a) { return a.indexOf(h) === i; }).join(', '));
        toast('success', esc(msg));
        ioText = '';
        tab = 'mine';
        render();
        return e;
    }
    function importFile(input) {
        var file = input.files && input.files[0];
        input.value = '';
        if (!file) return;
        if (file.size > MAX_PACKAGE_CHARS) { toast('error', esc(tx('e_tooBig'))); return; }
        var fr = new W.FileReader();
        fr.onload = function () { importText(String(fr.result || '')); };
        fr.onerror = function () { toast('error', esc(tx('e_notJson'))); };
        fr.readAsText(file);
    }
    function exportEntry(v) {
        if (v === 'cur') return { name: tx('currentTheme'), author: '', description: '', created: Date.now(), body: captureBody() };
        var m = /^m:([a-z0-9]+)$/.exec(v || '');
        return m ? loadStore().themes.filter(function (x) { return x.id === m[1]; })[0] || null : null;
    }
    function exportText(e) { return JSON.stringify(toPackage(e), null, 2); }
    function download(e) {
        var name = 'lm-theme-' + slug(e.name) + '.json';
        try {
            var blob = new W.Blob([exportText(e)], { type: 'application/json' });
            var url = W.URL.createObjectURL(blob);
            var a = D.createElement('a');
            a.href = url;
            a.download = name;
            a.style.display = 'none';
            D.body.appendChild(a);
            a.click();
            setTimeout(function () { try { W.URL.revokeObjectURL(url); a.parentNode.removeChild(a); } catch (er) { } }, 1000);
            toast('success', esc(tx('exported', name)));
        } catch (err) {
            /* no downloads (some embedded browsers): the text to copy instead */
            ioText = exportText(e);
            tab = 'io';
            render();
        }
    }

    /* ═══ Actions ═══ */
    function cleanName(n) { return cleanText(n, NAME_MAX); }
    function requestPreview(body, name) {
        var cur = T(), urls = bodyUrls(body).filter(function (u) {
            var now = SOUND_KEYS.indexOf(u.key) >= 0 ? (S() || {})[u.key] : cur[u.key];
            return now !== u.url;
        });
        if (urls.length) { pending = { body: body, name: name, urls: urls }; render(); return; }
        startPreview(body, name);
    }
    function act(a, id) {
        var $ = jq(), st = loadStore(), list = st.themes, now = Date.now();
        var key = String(id || '').split(':'), i = -1;
        for (var j = 0; j < list.length; j++) if (list[j].id === key[0]) { i = j; break; }
        var e = i >= 0 ? list[i] : null;
        var save = function (okMsg) {
            var err = saveStore(st);
            if (err) { toast('error', esc(tx(err))); return false; }
            if (okMsg) toast('success', esc(okMsg));
            return true;
        };
        if (a === 'pv-go') { var p = pending; pending = null; if (p) startPreview(p.body, p.name); return; }
        if (a === 'pv-cancel') { pending = null; render(); return; }
        pending = null;
        if (a === 'save') {
            var nm = cleanName($('#lm-tw-name').val());
            if (!nm) { toast('info', esc(tx('needName'))); $('#lm-tw-name').focus(); return; }
            if (list.length >= MAX_THEMES) { toast('error', esc(tx('tooMany'))); return; }
            list.unshift({ id: newId(), name: uniqueName(nm, list), author: '', description: '', created: now, updated: now, src: 'saved', body: captureBody(), history: [] });
            save(tx('saved', list[0].name));
        } else if (a === 'pv' && e) {
            requestPreview(e.body, e.name);
            return;
        } else if (a === 'update' && e) {
            var nb = captureBody();
            if (sameBody(e.body, nb)) { toast('info', esc(tx('sameTheme', e.name))); return; }
            if (!W.confirm(tx('confirmUpdate', e.name))) return;
            pushHistory(e, nb, now);
            save(tx('updated', e.name));
        } else if (a === 'rename' && e) {
            var nn = cleanName(W.prompt(tx('renamePrompt'), e.name));
            if (!nn || nn === e.name) return;
            e.name = uniqueName(nn, list.filter(function (x) { return x !== e; }));
            e.updated = now;
            save();
        } else if (a === 'dup' && e) {
            if (list.length >= MAX_THEMES) { toast('error', esc(tx('tooMany'))); return; }
            var base = Array.from(e.name).slice(0, NAME_MAX - 12).join('') + tx('copySuffix');
            list.splice(i + 1, 0, { id: newId(), name: uniqueName(cleanName(base), list), author: e.author, description: e.description, created: now, updated: now, src: 'saved', body: clone(e.body), history: [] });
            save();
        } else if (a === 'del' && e) {
            if (!W.confirm(tx('confirmDelete', e.name))) return;
            list.splice(i, 1);
            save();
        } else if (a === 'export' && e) {
            download(e);
            return;
        } else if (a === 'hist' && e) {
            openHist[e.id] = !openHist[e.id];
        } else if (a === 'hpv' && e) {
            var hv = e.history[+key[1]];
            if (hv) requestPreview(hv.body, tx('versionOf', e.name, when(hv.t)));
            return;
        } else if (a === 'hrestore' && e) {
            var t0 = e.history[+key[1]] && e.history[+key[1]].t;
            if (restoreVersion(e, +key[1], now)) save(tx('restored', e.name, when(t0)));
        } else if (a === 'cmp') {
            cmpA = 'cur';
            cmpB = id;
            tab = 'compare';
        } else if (a === 'gretry') {
            gallery = null;
            galleryState = '';
        } else if (a === 'bpv' || a === 'bapply') {
            /* shipped presets: their addresses (the menu pattern) need no review */
            var bi = findBuiltin(id);
            if (!bi) return;
            if (a === 'bpv') { var bt = builtinTarget(bi); if (bt) startPreview(builtinBody(bi, captureBody()), bi.name, 0, bt); return; }
            applyBuiltin(bi);
        } else if (a === 'gpv' || a === 'ginstall') {
            var g = (gallery || []).filter(function (x) { return x.gid === id; })[0];
            if (!g) return;
            if (a === 'gpv') { requestPreview(g.pkg.body, g.pkg.name); return; }
            if (list.some(function (x) { return x.src === 'g:' + g.gid; })) { toast('info', esc(tx('already', g.pkg.name))); return; }
            if (list.length >= MAX_THEMES) { toast('error', esc(tx('tooMany'))); return; }
            list.unshift({ id: newId(), name: uniqueName(g.pkg.name, list), author: g.pkg.author, description: g.pkg.description, created: g.pkg.created, updated: now, src: 'g:' + g.gid, body: clone(g.pkg.body), history: [] });
            save(tx('installedMsg', g.pkg.name));
        } else if (a === 'import') {
            ioText = String($('#lm-tw-text').val() || '');
            importText(ioText);
            return;
        } else if (a === 'xdl' || a === 'xshow' || a === 'xcopy') {
            var ex = exportEntry($('#lm-tw-exp').val());
            if (!ex) return;
            if (a === 'xdl') { download(ex); return; }
            ioText = exportText(ex);
            $('#lm-tw-text').val(ioText);
            if (a === 'xcopy') {
                var ta = D.getElementById('lm-tw-text');
                var copied = false;
                try { ta.focus(); ta.select(); copied = D.execCommand('copy'); } catch (er) { }
                if (!copied && W.navigator && W.navigator.clipboard) {
                    W.navigator.clipboard.writeText(ioText).then(function () { toast('success', esc(tx('copied'))); }, function () { });
                } else if (copied) toast('success', esc(tx('copied')));
            }
            return;
        }
        render();
    }

    /* ═══ Start ═══ */
    var started = false;
    function addButton() {
        var $ = jq();
        if (!$ || $('#theme .lm-tw-open').length) return !!$;
        var save = $('#theme > .btn-save');
        if (!save.length) return false;
        $('<button type="button" class="btn btn-block btn-info lm-tw-open"></button>').text(tx('openBtn')).insertBefore(save.first()).on('click', function (e) {
            e.preventDefault();
            open();
        });
        return true;
    }
    function init() {
        if (started) return;
        started = true;
        guardSave();
        addButton();
    }
    var tries = 0;
    function boot() {
        if (ready() && jq()('#theme > .btn-save').length) { init(); return; }
        if (++tries < 240) setTimeout(boot, 500);
    }
    setTimeout(boot, 0);

    api.open = open;
    api.close = close;
    api.toggle = toggle;
    api.isOpen = isOpen;
    /* for scripts and the smoke test */
    api.previewing = previewing;
    api.preview = function (body, name, ms) { return startPreview(cleanBody(body), cleanName(name) || 'Script', ms); };
    api.keep = function () { endPreview(true); };
    api.revert = function () { endPreview(false); };
    /* Before something else changes the settings (a settings profile, preset, import, restore):
     * ends a running preview (back to the theme from before it), so its timer never rolls the
     * newer change back. Returns whether a preview was running. */
    api.settle = function () { if (!preview) return false; endPreview(false); return true; };
    api.list = function () { return loadStore().themes.map(function (e) { return { id: e.id, name: e.name, src: e.src || '' }; }); };
    api.importText = importText;
    api.exportPackage = function (id) { var e = exportEntry(id ? 'm:' + id : 'cur'); return e ? toPackage(e) : null; };
})();
