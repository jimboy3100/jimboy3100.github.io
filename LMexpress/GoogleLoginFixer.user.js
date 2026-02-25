// ==UserScript==
// @name         Universal Agar.io Google Login Fixer
// @namespace    http://jimboy3100.github.io/
// @version      6.7
// @description  Fixes Google Login for Delta v7. Uses GIS. Embeds Google sign-in button in Delta's UI.
// @author       Jimboy3100
// @match        https://agar.io/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    if (location.host !== "agar.io") return;

    const CLIENT_ID = "686981379285-oroivr8u2ag1dtm3ntcs6vi05i3cpv0j.apps.googleusercontent.com";
    const LOG = (msg, ...a) => console.log('[LoginFix]', msg, ...a);

    LOG('v6.7 starting...');

    let _token = null;
    let _tokenDelivered = false;

    // ────────────────────────────────────────
    // TOKEN DELIVERY (from working v6.0)
    // ────────────────────────────────────────

    function onTokenReceived(idToken) {
        _token = idToken;
        LOG('✅ Got id_token:', idToken.substring(0, 30) + '...');
        try {
            var p = JSON.parse(atob(idToken.split('.')[1]));
            LOG('User:', p.name, '(' + p.email + ')');
        } catch (e) { }
        deliverToken();
    }

    function deliverToken() {
        if (!_token) return;
        var delivered = false;

        if (window.GlAccount) {
            LOG('Delivering to GlAccount...');
            window.GlAccount.token = _token;
            window.GlAccount.state && (window.GlAccount.state.logged = true);
            window.GlAccount.memory && (window.GlAccount.memory.enabled = true);
            try {
                var p = JSON.parse(atob(_token.split('.')[1]));
                window.GlAccount.state.expiration = p.exp * 1000;
                window.GlAccount.user = {
                    first_name: p.given_name || '',
                    last_name: p.family_name || '',
                    picture: p.picture || '',
                    id: p.sub || ''
                };
            } catch (e) { }
            if (typeof window.GlAccount.emit === 'function') {
                window.GlAccount.emit('user', window.GlAccount);
                window.GlAccount.emit('login', window.GlAccount);
                LOG('✅ GlAccount login emitted!');
                delivered = true;
            }
        }

        if (!delivered && window.accs && window.accs.realms && window.accs.realms.Google) {
            var gl = window.accs.realms.Google;
            gl.token = _token;
            if (gl.state) gl.state.logged = true;
            if (gl.memory) gl.memory.enabled = true;
            if (typeof gl.emit === 'function') {
                gl.emit('user', gl);
                gl.emit('login', gl);
                LOG('✅ accs.realms.Google login emitted!');
                delivered = true;
            }
        }

        if (window.master && typeof window.master.doLoginWithGPlus === 'function') {
            window.master.doLoginWithGPlus(_token);
            LOG('✅ master.doLoginWithGPlus() called!');
            delivered = true;
        }

        if (delivered) {
            _tokenDelivered = true;
        } else {
            LOG('Not ready yet — retrying...');
            retryDelivery();
        }
    }

    function retryDelivery() {
        var n = 0;
        var iv = setInterval(function () {
            if (++n > 60 || _tokenDelivered) { clearInterval(iv); return; }
            if (window.GlAccount || (window.master && window.master.doLoginWithGPlus)) {
                clearInterval(iv);
                deliverToken();
            }
        }, 1000);
    }

    function watchForReconnects() {
        setInterval(function () {
            if (_token && window.GlAccount && !window.GlAccount.token) {
                LOG('Token cleared — re-injecting...');
                window.GlAccount.token = _token;
                if (window.GlAccount.state) window.GlAccount.state.logged = true;
                if (typeof window.GlAccount.emit === 'function') {
                    window.GlAccount.emit('login', window.GlAccount);
                }
            }
        }, 3000);
    }

    // ────────────────────────────────────────
    // GIS (from working v6.0)
    // ────────────────────────────────────────

    function loadGIS(cb) {
        if (window.google && window.google.accounts) { cb(); return; }
        var s = document.createElement('script');
        s.src = 'https://accounts.google.com/gsi/client';
        s.async = true;
        s.onload = function () { LOG('GIS loaded.'); cb(); };
        s.onerror = function () { LOG('Failed to load GIS.'); };
        (document.head || document.documentElement).appendChild(s);
    }

    function initGIS() {
        google.accounts.id.initialize({
            client_id: CLIENT_ID,
            callback: function (resp) {
                if (resp.credential) onTokenReceived(resp.credential);
            },
            auto_select: true,
            cancel_on_tap_outside: false,
            itp_support: true
        });
        LOG('Showing One Tap...');
        google.accounts.id.prompt(function (notification) {
            if (notification.isNotDisplayed()) {
                LOG('One Tap not shown:', notification.getNotDisplayedReason());
            } else if (notification.isSkippedMoment()) {
                LOG('One Tap skipped:', notification.getSkippedReason());
            }
        });
    }

    // ────────────────────────────────────────
    // DELETE OLD GOOGLE BUTTON +
    // EMBED GIS BUTTON IN DELTA'S UI
    // ────────────────────────────────────────

    var _oldBtnDeleted = false;
    var _gisBtnPlaced = false;

    function deleteOldGoogleButton() {
        if (_oldBtnDeleted) return;
        var icons = document.querySelectorAll('.fa-google');
        for (var i = 0; i < icons.length; i++) {
            // Skip our own embedded button
            if (icons[i].closest('#lf-gis-embed')) continue;

            // Walk up to the wrapper (flex flex-col w-1/2, or gy-1 col, etc.)
            var el = icons[i];
            while (el) {
                if (el.classList && el.classList.contains('btn-colored')) {
                    // Found the button itself, now go up one more to its wrapper
                    var wrapper = el.parentElement;
                    if (wrapper) {
                        LOG('Deleting old Google button wrapper...');
                        wrapper.remove();
                        _oldBtnDeleted = true;
                        return;
                    }
                }
                el = el.parentElement;
            }
        }
    }

    function placeGISButton() {
        if (_gisBtnPlaced) return;
        if (!window.google || !window.google.accounts) return;

        // Find div.fcols with width: 28%
        var fcolsDivs = document.querySelectorAll('.fcols');
        var target = null;
        for (var i = 0; i < fcolsDivs.length; i++) {
            if (fcolsDivs[i].style.width === '28%') {
                target = fcolsDivs[i];
                break;
            }
        }
        if (!target) return;

        LOG('Found fcols (28%), embedding GIS button...');

        // Create container — small, no label, no HUD
        var container = document.createElement('div');
        container.id = 'lf-gis-embed';
        container.style.cssText = 'margin: 4px 0; display: flex; justify-content: center; transform: scale(0.85); transform-origin: center;';

        // Render the actual Google sign-in button
        google.accounts.id.renderButton(container, {
            theme: 'filled_blue',
            size: 'medium',
            shape: 'rectangular',
            text: 'signin_with',
            width: 200
        });

        // Insert at the top of fcols
        target.insertBefore(container, target.firstChild);
        _gisBtnPlaced = true;
        LOG('✅ GIS button embedded in fcols!');
    }

    // ────────────────────────────────────────
    // GAPI PATCHES (from working v6.0)
    // ────────────────────────────────────────

    function patchGAPI() {
        if (!window.gapi) return;
        if (window.gapi._lf) return;
        window.gapi._lf = true;
        var origLoad = gapi.load;
        gapi.load = function (libs, cb) {
            return origLoad.call(this, libs, function () {
                if (typeof cb === 'function') cb();
                if (typeof libs === 'string' && libs.indexOf('auth2') >= 0) {
                    setTimeout(patchAuth2, 50);
                }
            });
        };
        LOG('gapi.load hooked.');
        if (gapi.auth2) patchAuth2();
    }

    function patchAuth2() {
        if (!gapi.auth2) return;
        var origInit = gapi.auth2.init;
        if (origInit._lf) return;
        gapi.auth2.init = function () {
            var inst = origInit.apply(this, arguments);
            inst.then(function () { patchInstance(inst); });
            return inst;
        };
        gapi.auth2.init._lf = true;
        try {
            var existing = gapi.auth2.getAuthInstance();
            if (existing) patchInstance(existing);
        } catch (e) { }
        LOG('auth2.init hooked.');
    }

    function patchInstance(auth2) {
        if (auth2._lf) return;
        auth2._lf = true;
        auth2.signIn = function () {
            LOG('signIn() intercepted → GIS.');
            if (_token) { deliverToken(); return Promise.resolve(); }
            initGIS();
            return Promise.resolve();
        };
        if (auth2.attachClickHandler) {
            auth2.attachClickHandler = function () {
                LOG('attachClickHandler intercepted (no-op).');
                return auth2;
            };
        }
        LOG('✅ Auth2 patched.');
    }

    // ────────────────────────────────────────
    // BOOT
    // ────────────────────────────────────────

    function boot() {
        var bodyCheck = setInterval(function () {
            if (!document.body) return;
            clearInterval(bodyCheck);

            // 1. Load GIS and auto One Tap
            loadGIS(function () { initGIS(); });

            // 2. Watch DOM for Delta's Google button to delete + fcols to embed
            var observer = new MutationObserver(function () {
                deleteOldGoogleButton();
                placeGISButton();
                if (_oldBtnDeleted && _gisBtnPlaced) observer.disconnect();
            });
            observer.observe(document.documentElement, { childList: true, subtree: true });

            // Fallback interval
            var check = setInterval(function () {
                deleteOldGoogleButton();
                placeGISButton();
                if (_oldBtnDeleted && _gisBtnPlaced) clearInterval(check);
            }, 500);
            setTimeout(function () { clearInterval(check); observer.disconnect(); }, 120000);

            // 3. Patch GAPI
            var gapiCheck = setInterval(function () {
                if (window.gapi) {
                    patchGAPI();
                    if (window.gapi.auth2) patchAuth2();
                }
            }, 300);
            setTimeout(function () { clearInterval(gapiCheck); }, 60000);

            // 4. Watch reconnects
            watchForReconnects();

        }, 100);
        setTimeout(function () { clearInterval(bodyCheck); }, 30000);
    }

    boot();
})();
