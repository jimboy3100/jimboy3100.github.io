// ==UserScript==
// @name         Universal Agar.io Google Login Fixer
// @namespace    http://jimboy3100.github.io/
// @version      6.4
// @description  Fixes Google Login for Delta v7. Uses GIS (Google Identity Services) to bypass GAPI's broken popup. Replaces Delta's Google button with GIS-powered clone.
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

    LOG('v6.4 starting...');

    let _token = null;
    let _tokenDelivered = false;

    // ────────────────────────────────────────
    // TOKEN DELIVERY (same as working v6.0)
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

        // Delta v7: GlAccount
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

        // accs.realms.Google fallback
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

        // Legend Mod
        if (window.master && typeof window.master.doLoginWithGPlus === 'function') {
            window.master.doLoginWithGPlus(_token);
            LOG('✅ master.doLoginWithGPlus() called!');
            delivered = true;
        }

        if (delivered) {
            _tokenDelivered = true;
            // Update our fake button to active
            var fakeBtn = document.getElementById('lf-google-btn');
            if (fakeBtn) fakeBtn.classList.add('active');
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
    // GIS (Google Identity Services)
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
    // REPLACE DELTA'S GOOGLE BUTTON
    // Hide original, insert identical clone
    // that triggers GIS on click
    // ────────────────────────────────────────

    function replaceButton() {
        // Already done?
        if (document.getElementById('lf-google-btn')) return true;

        // Find the original: look for the btn-colored that contains fa-google
        var googleIcons = document.querySelectorAll('.fa-google');
        if (!googleIcons.length) return false;

        var originalBtn = null;
        var originalWrapper = null;
        for (var i = 0; i < googleIcons.length; i++) {
            var node = googleIcons[i];
            // Walk up to find btn-colored
            while (node && !node.classList.contains('btn-colored')) {
                node = node.parentElement;
            }
            if (node && node.classList.contains('btn-colored')) {
                originalBtn = node;
                // The wrapper is the parent (e.g. <div class="flex flex-col w-1/2"> or <div class="gy-1 col">)
                originalWrapper = node.parentElement;
                break;
            }
        }

        if (!originalBtn || !originalWrapper) return false;

        LOG('Found original Google button, hiding and inserting clone...');

        // Hide original
        originalBtn.style.display = 'none';

        // Create our clone — looks exactly the same
        var clone = document.createElement('div');
        clone.id = 'lf-google-btn';
        clone.className = originalBtn.className; // "btn btn-colored size-small"
        if (_token) clone.classList.add('active');
        clone.setAttribute('style', '--data-background:#DB4437; cursor:pointer;');

        clone.innerHTML =
            '<div role="tooltip" data-microtip-position="bottom" class="btn-layer">' +
            '<div class="tty">Google</div>' +
            '<div class="btn-logo"><div class="btn-icon fab fa-google"></div></div>' +
            '</div>';

        // Click handler
        clone.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            if (_token) {
                // Already logged in — logout
                LOG('Logging out Google...');
                _token = null;
                _tokenDelivered = false;
                clone.classList.remove('active');
                if (window.GlAccount) {
                    window.GlAccount.token = null;
                    window.GlAccount.state.logged = false;
                    window.GlAccount.user = {};
                    window.GlAccount.emit('logout', window.GlAccount);
                }
                return;
            }

            // Not logged in — trigger GIS
            LOG('Google button clicked → GIS');
            initGIS();
        });

        // Insert clone right after the hidden original
        originalWrapper.appendChild(clone);

        LOG('✅ Google button replaced!');
        return true;
    }

    // ────────────────────────────────────────
    // GAPI PATCHES (same as v6.0)
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
            LOG('signIn() intercepted → using GIS.');
            if (_token) { deliverToken(); return Promise.resolve(); }
            initGIS();
            return Promise.resolve();
        };

        if (auth2.attachClickHandler) {
            auth2.attachClickHandler = function (el, opts, onSuccess, onFail) {
                LOG('attachClickHandler intercepted (no-op).');
                return auth2;
            };
        }

        LOG('✅ Auth2 instance patched.');
    }

    // ────────────────────────────────────────
    // BOOT
    // ────────────────────────────────────────

    function boot() {
        var bodyCheck = setInterval(function () {
            if (!document.body) return;
            clearInterval(bodyCheck);

            // 1. Load GIS and show One Tap
            loadGIS(function () { initGIS(); });

            // 2. Watch for Delta's Google button and replace it
            var btnCheck = setInterval(function () {
                if (replaceButton()) clearInterval(btnCheck);
            }, 500);
            setTimeout(function () { clearInterval(btnCheck); }, 120000);

            // 3. Watch for GAPI and patch it
            var gapiCheck = setInterval(function () {
                if (window.gapi) {
                    patchGAPI();
                    if (window.gapi.auth2) patchAuth2();
                }
            }, 300);
            setTimeout(function () { clearInterval(gapiCheck); }, 60000);

            // 4. Watch for reconnects
            watchForReconnects();

        }, 100);
        setTimeout(function () { clearInterval(bodyCheck); }, 30000);
    }

    boot();
})();
