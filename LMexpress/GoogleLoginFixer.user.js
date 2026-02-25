// ==UserScript==
// @name         Universal Agar.io Google Login Fixer
// @namespace    http://jimboy3100.github.io/
// @version      6.2
// @description  Fixes Google Login for Delta v7. Replaces Delta's Google button with GIS-powered clone. Auto-login via One Tap.
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
    LOG('v6.2 starting...');

    let _token = null;
    let _gisInitialized = false;

    // ────────────────────────────────────────
    // GIS
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

    function initGIS(cb) {
        if (!_gisInitialized) {
            google.accounts.id.initialize({
                client_id: CLIENT_ID,
                callback: function (resp) {
                    if (resp.credential) onToken(resp.credential);
                },
                auto_select: true,
                cancel_on_tap_outside: false,
                itp_support: true
            });
            _gisInitialized = true;
        }
        if (cb) cb();
    }

    function promptGIS() {
        initGIS();
        LOG('Showing One Tap...');
        google.accounts.id.prompt(function (n) {
            if (n.isNotDisplayed()) {
                LOG('One Tap not shown:', n.getNotDisplayedReason());
            } else if (n.isSkippedMoment()) {
                LOG('One Tap skipped:', n.getSkippedReason());
            }
        });
    }

    // ────────────────────────────────────────
    // TOKEN DELIVERY
    // ────────────────────────────────────────

    function onToken(idToken) {
        _token = idToken;
        var p = {};
        try { p = JSON.parse(atob(idToken.split('.')[1])); } catch (e) { }
        LOG('✅ Token received! User:', p.name, '(' + p.email + ')');

        deliverToken();
    }

    function deliverToken() {
        if (!_token) return;

        // ── Delta v7: GlAccount ──
        var gl = window.GlAccount;
        if (gl) {
            var p = {};
            try { p = JSON.parse(atob(_token.split('.')[1])); } catch (e) { }

            gl.token = _token;
            gl.state.expiration = (p.exp || 0) * 1000;
            gl.state.logged = true;
            gl.memory.enabled = true;
            gl.user = gl.user || {};
            gl.user.picture = p.picture || '';
            gl.user.first_name = p.given_name || '';
            gl.user.last_name = p.family_name || '';
            gl.user.id = p.sub || '';
            gl.emit('user', gl);
            gl.emit('login', gl);
            LOG('✅ GlAccount: token set + login emitted!');

            // Update the cloned button to show active state
            var fakeBtn = document.getElementById('lf-google-btn');
            if (fakeBtn) fakeBtn.classList.add('active');
        }

        // ── Legend Mod: master.doLoginWithGPlus ──
        if (window.master && typeof window.master.doLoginWithGPlus === 'function') {
            window.master.doLoginWithGPlus(_token);
            LOG('✅ LM: doLoginWithGPlus called!');
        }

        // If neither is ready, retry
        if (!gl && !(window.master && window.master.doLoginWithGPlus)) {
            setTimeout(deliverToken, 1000);
        }
    }

    // Keep token alive on reconnects
    function watchReconnects() {
        setInterval(function () {
            if (_token && window.GlAccount && !window.GlAccount.token) {
                LOG('Token cleared — re-injecting...');
                deliverToken();
            }
        }, 3000);
    }

    // ────────────────────────────────────────
    // REPLACE DELTA'S GOOGLE BUTTON
    // ────────────────────────────────────────

    function replaceGoogleButton() {
        // Find Delta's Google button: the one with fa-google icon
        var icons = document.querySelectorAll('.btn-icon.fab.fa-google');
        if (!icons.length) return false;

        for (var i = 0; i < icons.length; i++) {
            // Walk up to find the btn-colored container
            var btn = icons[i];
            while (btn && !btn.classList.contains('btn-colored')) {
                btn = btn.parentElement;
            }
            if (!btn || btn.id === 'lf-google-btn') continue;

            LOG('Found Delta Google button, replacing...');

            // Clone it exactly
            var clone = btn.cloneNode(true);
            clone.id = 'lf-google-btn';

            // If we already have a token, show active
            if (_token) clone.classList.add('active');

            // Remove all original event listeners by replacing
            btn.parentNode.replaceChild(clone, btn);

            // Add our GIS click handler
            clone.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                if (_token) {
                    // Already logged in — toggle logout
                    LOG('Already logged in. Logging out...');
                    _token = null;
                    _gisInitialized = false;
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
                LOG('Google button clicked → GIS prompt');
                promptGIS();
            });

            LOG('✅ Google button replaced!');
        }
        return true;
    }

    // ────────────────────────────────────────
    // PATCH GAPI — prevent broken popup
    // ────────────────────────────────────────

    function patchGAPI() {
        if (!window.gapi) return;
        if (window.gapi._lf) return;
        window.gapi._lf = true;

        var origLoad = window.gapi.load;
        window.gapi.load = function (libs, cb) {
            return origLoad.call(this, libs, function () {
                if (typeof cb === 'function') cb();
                if (typeof libs === 'string' && libs.indexOf('auth2') >= 0) {
                    setTimeout(function () {
                        try {
                            var inst = window.gapi.auth2.getAuthInstance();
                            if (inst && !inst._lf) {
                                inst._lf = true;
                                inst.signIn = function () {
                                    LOG('GAPI.signIn() blocked');
                                    return Promise.resolve();
                                };
                                inst.signOut = function () {
                                    return Promise.resolve();
                                };
                                var origIsSignedIn = inst.isSignedIn.get;
                                inst.isSignedIn.get = function () {
                                    return !!(_token);
                                };
                                LOG('✅ GAPI instance patched.');
                            }
                        } catch (e) { }
                    }, 100);
                }
            });
        };
    }

    // ────────────────────────────────────────
    // BOOT
    // ────────────────────────────────────────

    function boot() {
        var bodyCheck = setInterval(function () {
            if (!document.body) return;
            clearInterval(bodyCheck);

            // 1. Load GIS and auto-login via One Tap
            loadGIS(function () { promptGIS(); });

            // 2. Watch for Delta's Google button and replace it
            var btnCheck = setInterval(function () {
                if (replaceGoogleButton()) clearInterval(btnCheck);
            }, 500);
            setTimeout(function () { clearInterval(btnCheck); }, 60000);

            // 3. Watch for GAPI and patch it
            var gapiCheck = setInterval(function () {
                if (window.gapi) patchGAPI();
            }, 300);
            setTimeout(function () { clearInterval(gapiCheck); }, 60000);

            // 4. Watch for reconnects
            watchReconnects();

        }, 50);
    }

    boot();
})();
