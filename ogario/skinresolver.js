/*
 * Skin asset resolver: one place that turns a skin identifier or skin URL into the URL to load,
 * the identity it is cached under, and a short list of genuinely different places to try when it
 * fails. ogario.v4.js (VanillaSkinUrlMap, loadSkin, getImg, getLink, vanillaskins, the profile
 * preview) asks it; it never touches third-party skins, agar.io's own URLs (other than offering our
 * copy when one fails), uploaded custom skins, data/blob URLs or video skins.
 *
 * Origins (checked 2026-11-27):
 *   https://www.legendmod.ml/      this repository, the authoritative copy (CORS *).
 *   https://legendmod.ml/, https://jimboy3100.github.io/   the same site (301 to www.legendmod.ml,
 *                                  without a CORS header): never a separate fallback.
 *   https://jimboy3000.github.io/  an independent mirror (CORS *, frozen 2026-08-02). VanillaSkinUrlMap
 *                                  has always loaded the vanilla skins from it, so it stays the first
 *                                  place for the vanilla files it holds byte-identical (same URLs,
 *                                  browser caches and traffic split as before); it also holds 84
 *                                  pictures this repository has not (level skins).
 * Identical files under several names (ogario/skinregistry.js, generated from file hashes by
 * developers/skins/build-registry.js) are one resource: one download, one decode, one texture.
 * Everything is computed once per distinct input and kept in a bounded map; nothing runs per frame.
 */
(function () {
    'use strict';
    if (window.LMSkinResolver && window.LMSkinResolver.version >= 1) return;

    var L = 'https://www.legendmod.ml/';
    var J = 'https://jimboy3000.github.io/';
    var SAME_SITE = /^https?:\/\/(?:www\.)?legendmod\.ml\/|^https?:\/\/jimboy3100\.github\.io\//i;
    var MIRROR = /^https?:\/\/jimboy3000\.github\.io\//i;
    var MANAGED = /^(vanillaskins2?|lowresskins|agario\/live\/flags)\/([^\/]+)$/;
    var AGAR_LIVE = /^https?:\/\/(configs(?:-web)?)\.agario\.miniclippt\.com\/live\/(?:[^?#]*\/)?([^\/?#]+)(?:[?#].*)?$/i;
    var VIDEO = /\.(mp4|webm|ogv)(?:[?#]|$)/i;
    var MAX_CANDIDATES = 3;
    var CACHE_MAX = 4000;

    var reg = { lr: null, a: null, x: null, j: null, src: '' };
    var cache = new Map();
    /* level skin pictures: canonical spine path -> the base-name guess, tried after it (the
     * configuration's spine name is the right file for all but "SongBird", whose file is
     * Songbird.png; the guess is no file for 13 skins). Set by buildVanillaMap. */
    var levelAlt = Object.create(null);
    var listeners = [];

    function setOf(s) {
        var o = Object.create(null);
        if (s) { var p = String(s).split('|'); for (var i = 0; i < p.length; i++) if (p[i]) o[p[i]] = 1; }
        return o;
    }
    function setRegistry(r) {
        if (!r || typeof r !== 'object') return;
        var a = Object.create(null);
        if (r.a) for (var k in r.a) if (Object.prototype.hasOwnProperty.call(r.a, k)) a[k] = r.a[k];
        reg = { lr: setOf(r.lr), a: a, x: setOf(r.x), j: setOf(r.j), src: r.src || '' };
        window.LMSkinRegistry = r;
        cache.clear();
        for (var i = 0; i < listeners.length; i++) { try { listeners[i](); } catch (e) { } }
    }
    function onChange(fn) { if (typeof fn === 'function') listeners.push(fn); }

    function encodePath(p) {
        var parts = p.split('/');
        for (var i = 0; i < parts.length; i++) parts[i] = encodeURIComponent(parts[i]);
        return parts.join('/');
    }
    function decodePath(p) {
        /* "%20" in a URL is an encoded space; a literal "%20" in a file name arrives as "%2520" */
        try { return decodeURIComponent(p); } catch (e) { return p; }
    }

    /* the canonical repository path of a managed file path (exact, case-sensitive) */
    function canonicalPath(p) {
        if (reg.a && reg.a[p]) return reg.a[p];
        var m = MANAGED.exec(p);
        if (!m) return p;
        var q = p;
        if (reg.lr && (m[1] === 'lowresskins' && !reg.lr[m[2]] || m[1] === 'vanillaskins2' && !reg.j[p])) q = 'vanillaskins/' + m[2];
        return (reg.a && reg.a[q]) || q;
    }
    /* where a canonical path can be downloaded, best first */
    function pathCandidates(c) {
        var e = encodePath(c);
        if (reg.j && reg.j[c]) return [J + e];
        var dir = c.slice(0, c.lastIndexOf('/'));
        var onMirror = !(reg.x && reg.x[c]);
        if (dir === 'vanillaskins' || dir === 'vanillaskins2') return dir === 'vanillaskins2' ? [J + e] : (onMirror ? [J + e, L + e] : [L + e]);
        if (dir === 'lowresskins') return onMirror ? [L + e, J + e] : [L + e];
        return [L + e];
    }
    function entry(key, cands, path, kind) {
        return { key: key, cands: cands, path: path || '', kind: kind };
    }
    function compute(url) {
        var s = url.trim();
        if (!/^https?:\/\//i.test(s)) return entry(s, [s], '', /^(data:|blob:)/i.test(s) ? 'data' : 'other');
        if (VIDEO.test(s)) return entry(s, [s], '', 'video');
        var host = SAME_SITE.exec(s) || MIRROR.exec(s);
        if (host) {
            var rest = s.slice(host[0].length);
            var cut = rest.search(/[?#]/);
            var filePath = decodePath(cut === -1 ? rest : rest.slice(0, cut));
            if (MANAGED.test(filePath)) {
                var c = canonicalPath(filePath);
                var cands = pathCandidates(c);
                var alt = levelAlt[c];
                if (alt) {
                    var ac = pathCandidates(alt);
                    for (var q = 0; q < ac.length && cands.length < MAX_CANDIDATES; q++) if (cands.indexOf(ac[q]) === -1) cands = cands.concat(ac[q]);
                }
                return entry(cands[0], cands, c, 'repo');
            }
            /* any other file of this site: one identity whatever spelling of the site was used */
            var u = MIRROR.test(s) ? s : L + rest;
            return entry(u, [u], '', 'site');
        }
        var m = AGAR_LIVE.exec(s);
        if (m) {
            var file = decodePath(m[2]);
            var list = [s];
            if (/^skin_custom_/.test(file)) {
                /* configs-web answers 403 for uploaded skins: they live on the custom-skin host */
                var cdn = window.LM_CUSTOM_SKINS_CDN;
                if (m[1].toLowerCase() === 'configs-web' && cdn) list.push(cdn + '/' + encodeURIComponent(file));
                return entry(s, list, '', 'custom');
            }
            if (/\.(png|jpe?g|webp)$/i.test(file)) {
                var vc = pathCandidates(canonicalPath('vanillaskins/' + file));
                for (var i = 0; i < vc.length && list.length < MAX_CANDIDATES; i++) list.push(vc[i]);
            }
            return entry(s, list, '', 'agario');
        }
        return entry(s, [s], '', 'other');
    }
    /* resolve(url) -> { key, cands, path, kind } (cached; the same object for the same input) */
    function resolve(url) {
        if (!url || typeof url !== 'string') return null;
        var r = cache.get(url);
        if (r) return r;
        r = compute(url);
        if (cache.size >= CACHE_MAX) cache.delete(cache.keys().next().value);
        cache.set(url, r);
        return r;
    }
    function key(url) { var r = resolve(url); return r ? r.key : url; }
    /* the candidate after netUrl in url's list ('' when none is left) */
    function next(url, netUrl) {
        var r = resolve(url);
        if (!r) return '';
        var i = r.cands.indexOf(netUrl);
        return i !== -1 && i + 1 < r.cands.length ? r.cands[i + 1] : '';
    }
    /* URL of a repository file path ("vanillaskins/doge.png"), as the cache identity */
    function fileUrl(p) {
        if (!p || typeof p !== 'string') return '';
        var c = canonicalPath(p);
        return pathCandidates(c)[0];
    }
    /* an image name from the agar.io configuration ("Banana.png", "fungi_warlord .png") */
    function vanilla(image) { return image ? fileUrl('vanillaskins/' + image) : ''; }
    /* flag (name) skins: agario/live/flags/<lower-case name>.png, spaces kept */
    function flag(name) { return name ? fileUrl('agario/live/flags/' + String(name).toLowerCase() + '.png') : ''; }
    /* level skins (skin_alien_kid_level_2, %alien_kid_level_2): the picture of the base skin */
    function level(id) {
        var p = levelGuessPath(id);
        return p ? pathCandidates(p)[0] : '';
    }
    /* the canonical path of that picture's name guess (Alien_Kid.png) */
    function levelGuessPath(id) {
        var n = String(id || '').replace(/^%/, '').replace(/^skin_/, '').replace(/_level_\d+$/, '');
        if (!n) return '';
        n = n.charAt(0).toUpperCase() + n.slice(1);
        n = n.replace(/_\s*([a-z])/g, function (d, e) { return '_' + e.toUpperCase(); });
        return canonicalPath('vanillaskins/' + n + '.png');
    }
    /* uploaded custom skins keep their id as is (official addCustomSkin: '%x' -> 'skin_x') */
    function custom(id) {
        var s = String(id || '').replace(/\.png(?:\?.*)?$/i, '');
        if (/^\d+$/.test(s)) s = 'skin_custom_' + s;
        else {
            if (s.charAt(0) === '%') s = 'skin_' + s.substring(1);
            if (s.indexOf('skin_custom') !== 0) s = 'skin_custom_' + s.replace(/^skin_/, '').replace(/^custom/, '').replace(/^_+/, '');
        }
        return (window.LM_CUSTOM_SKINS_CDN || 'https://configs.agario.miniclippt.com/live/custom_skins') + '/' + s + '.png';
    }
    /*
     * What kind of skin identifier this is, without changing it:
     *   empty | video | url | data | custom (uploaded: skin_custom_*, %custom*, custom_*, a number)
     *   | level (*_level_<n>) | premium / spine (a product of the configuration's VanillaSkinUrlMap)
     *   | unknown. Name skins (flag, free) are names, not identifiers: see classifyName.
     */
    function classify(id, map) {
        if (id == null || id === '') return 'empty';
        if (typeof id !== 'string') return 'unknown';
        if (id === '%empty' || id === 'skin_empty' || id === 'empty') return 'empty';
        if (/^https?:\/\//i.test(id)) return VIDEO.test(id) ? 'video' : 'url';
        if (/^(data:image\/|blob:)/i.test(id)) return 'data';
        if (/^\d+$/.test(id) || /^(?:%|skin_)?custom/i.test(id)) return 'custom';
        if (/_level_\d+$/.test(id)) return 'level';
        map = map || window.VanillaSkinUrlMap;
        if (map) {
            var bare = id.charAt(0) === '%' ? id.slice(1) : id.indexOf('skin_') === 0 ? id.slice(5) : id;
            var k = map[id] ? id : map['%' + bare] ? '%' + bare : map[bare] ? bare : map[('%' + bare).toLowerCase()] ? ('%' + bare).toLowerCase() : '';
            if (k) return map._lmSpine && map._lmSpine[k] ? 'spine' : 'premium';
        }
        /* an id that only contains "custom" (older relays): still an uploaded skin */
        if (id.indexOf('custom') !== -1) return 'custom';
        return 'unknown';
    }
    function classifyName(name, flags, free) {
        var n = String(name || '').toLowerCase();
        if (!n) return '';
        if (flags && flags[n]) return 'flag';
        if (free && free[n]) return 'free';
        return '';
    }
    /* the URL for an identifier of the kinds above ('' when it has none) */
    function idUrl(id, map) {
        var t = classify(id, map);
        map = map || window.VanillaSkinUrlMap;
        if (t === 'url' || t === 'video' || t === 'data') return id;
        if (t === 'custom') return custom(id);
        if (t === 'level') return level(id);
        if ((t === 'premium' || t === 'spine') && map) {
            var bare = id.charAt(0) === '%' ? id.slice(1) : id.indexOf('skin_') === 0 ? id.slice(5) : id;
            return map[id] || map['%' + bare] || map[bare] || map[('%' + bare).toLowerCase()] || map[bare.toLowerCase()] || '';
        }
        return '';
    }
    /*
     * The one VanillaSkinUrlMap builder (agar.io configuration loaded or replaced, login, registry
     * loaded): productId, "%name", "name" and their lower-case forms -> URL. Level skins take their
     * spine picture, as before ("choco_golem.png"; the base-name guess "Choco_Golem.png" is no file
     * for 13 skins); level 2, whose spine entry is "SkinEffects" (no skin picture), takes level 1's.
     */
    function levelSpine(pId, spineMap) {
        if (!spineMap) return '';
        var n = spineMap[pId];
        if (n && n !== 'SkinEffects') return n;
        var base = pId.replace(/_level_\d+$/, '_level_');
        for (var l = 1; l <= 3; l++) { n = spineMap[base + l]; if (n && n !== 'SkinEffects') return n; }
        return '';
    }
    function buildVanillaMap(equippable, spineMap) {
        var map = Object.create(null);
        var spine = Object.create(null);
        var altChanged = false;
        if (!equippable || !equippable.length) return map;
        for (var i = 0; i < equippable.length; i++) {
            var skin = equippable[i];
            if (!skin || !skin.productId) continue;
            var pId = String(skin.productId);
            var url = '', isSpine = false;
            if (/_level_\d+$/.test(pId)) {
                isSpine = skin.image === 'uses_spine';
                var lsp = isSpine ? levelSpine(pId, spineMap) : '';
                url = !isSpine && skin.image ? vanilla(skin.image) : lsp ? vanilla(lsp + '.png') : level(pId);
                if (lsp) {
                    var lc = canonicalPath('vanillaskins/' + lsp + '.png');
                    var gc = levelGuessPath(pId);
                    if (gc && gc !== lc && levelAlt[lc] !== gc) { levelAlt[lc] = gc; altChanged = true; }
                }
            }
            else if (skin.image && skin.image !== 'uses_spine') url = vanilla(skin.image);
            else if (skin.image === 'uses_spine' && spineMap && spineMap[pId]) { url = vanilla(spineMap[pId] + '.png'); isSpine = true; }
            if (!url) continue;
            var raw = pId.replace('skin_', '');
            var keys = ['%' + raw, ('%' + raw).toLowerCase(), pId, pId.toLowerCase(), raw, raw.toLowerCase()];
            for (var k = 0; k < keys.length; k++) { map[keys[k]] = url; if (isSpine) spine[keys[k]] = 1; }
        }
        /* resolved entries of those paths must list the new place */
        if (altChanged) cache.clear();
        Object.defineProperty(map, '_lmSpine', { value: spine, enumerable: false });
        return map;
    }

    window.LMSkinResolver = {
        version: 1,
        origins: { site: L, mirror: J },
        setRegistry: setRegistry,
        onChange: onChange,
        resolve: resolve,
        key: key,
        next: next,
        canonicalPath: canonicalPath,
        fileUrl: fileUrl,
        vanilla: vanilla,
        flag: flag,
        level: level,
        custom: custom,
        classify: classify,
        classifyName: classifyName,
        idUrl: idUrl,
        buildVanillaMap: buildVanillaMap,
        registryLoaded: function () { return !!reg.lr; },
        cacheSize: function () { return cache.size; }
    };
    /* ogario.v4.js loaded first (a page without the script tag): it rebuilds its map now */
    try { if (window._lmOnSkinResolver) window._lmOnSkinResolver(); } catch (e) { }
    if (window.LMSkinRegistry) setRegistry(window.LMSkinRegistry);
    else {
        /* pages that load this file without the registry: fetch it once, without blocking */
        try {
            var me = document.currentScript && document.currentScript.src || '';
            var v = (/[?&]v=([^&#]*)/.exec(me) || [])[1] || '';
            var s = document.createElement('script');
            s.src = L + 'ogario/skinregistry.js' + (v ? '?v=' + v : '');
            s.charset = 'utf-8';
            s.async = true;
            (document.head || document.documentElement).appendChild(s);
        } catch (e) { }
    }
})();
