// ==UserScript==
// @name         Universal Agar.io Google Login Fixer
// @namespace    http://jimboy3100.github.io/
// @version      6.3
// @description  Fixes Google Login for Delta v7. Intercepts Google button click, uses GIS instead of broken GAPI popup.
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
    LOG('v6.3 starting...');

    let _token = null;
    let _gisInitialized = false;
    let _delivered = false;

    // ════════════════════════════════════════
    // GIS
    // ════════════════════════════════════════

    function loadGIS(cb) {
        if (window.google && window.google.accounts) { cb(); return; }
        var s = document.createElement('script');
        s.src = 'https://accounts.google.com/gsi/client';
        s.async = true;
        s.onload = function () { LOG('GIS loaded.'); cb(); };
        s.onerror = function () { LOG('Failed to load GIS.'); };
        (document.head || document.documentElement).appendChild(s);
    }

    function promptGIS() {
        if (!window.google || !window.google.accounts) return;
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
        LOG('Showing GIS prompt...');
        google.accounts.id.prompt(function (n) {
            if (n.isNotDisplayed()) LOG('One Tap not shown:', n.getNotDisplayedReason());
            else if (n.isSkippedMoment()) LOG('One Tap skipped:', n.getSkippedReason());
        });
    }

    // ════════════════════════════════════════
    // TOKEN
    // ════════════════════════════════════════

    function onToken(idToken) {
        _token = idToken;
        var p = {};
        try { p = JSON.parse(atob(idToken.split('.')[1])); } catch (e) { }
        LOG('✅ Token! User:', p.name, '(' + p.email + ')');
        deliverToken();
    }

    function deliverToken() {
        if (!_token) return;

        // Delta v7: GlAccount
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
            _delivered = true;
            LOG('✅ GlAccount: token + login emitted!');
        }

        // Legend Mod
        if (window.master && typeof window.master.doLoginWithGPlus === 'function') {
            window.master.doLoginWithGPlus(_token);
            _delivered = true;
            LOG('✅ LM: doLoginWithGPlus!');
        }

        if (!_delivered) setTimeout(deliverToken, 1000);
    }

    // Re-inject on reconnects
    setInterval(function () {
        if (_token && window.GlAccount && !window.GlAccount.token) {
            LOG('Re-injecting token...');
            deliverToken();
        }
    }, 3000);

    // ════════════════════════════════════════
    // INTERCEPT GOOGLE BUTTON CLICKS
    // Capture phase — fires BEFORE Delta's
    // Preact onclick handler
    // ════════════════════════════════════════

    function isGoogleButton(el) {
        // Walk up from click target to check if it's inside the Google button
        var node = el;
        while (node && node !== document.body) {
            // Check for fa-google icon
            if (node.classList && node.classList.contains('fa-google')) return true;
            // Check for the btn-colored with Google's red color
            if (node.classList && node.classList.contains('btn-colored')) {
                // Check if this button contains fa-google
                if (node.querySelector('.fa-google')) return true;
            }
            // Check for tty/div with text "Google"
            if (node.tagName === 'DIV' && node.textContent === 'Google' &&
                (node.classList.contains('tty') || node.tagName === 'TTY')) return true;
            node = node.parentElement;
        }
        return false;
    }

    document.addEventListener('click', function (e) {
        if (!isGoogleButton(e.target)) return;

        // Stop the click from reaching Delta's Preact handler
        e.stopImmediatePropagation();
        e.preventDefault();
        LOG('Google button click intercepted!');

        if (_token) {
            // Already logged in — log out
            LOG('Logging out...');
            _token = null;
            _delivered = false;
            _gisInitialized = false;
            if (window.GlAccount) {
                window.GlAccount.token = null;
                window.GlAccount.state.logged = false;
                window.GlAccount.user = {};
                window.GlAccount.emit('logout', window.GlAccount);
            }
            return;
        }

        // Not logged in — trigger GIS
        promptGIS();

    }, true); // ← true = CAPTURE PHASE

    // ════════════════════════════════════════
    // BLOCK GAPI POPUP
    // ════════════════════════════════════════

    function blockGAPIPopup() {
        if (!window.gapi || window.gapi._lf) return;
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
                                    LOG('GAPI.signIn() blocked.');
                                    return Promise.resolve();
                                };
                                inst.signOut = function () { return Promise.resolve(); };
                                inst.isSignedIn.get = function () { return !!_token; };
                                LOG('✅ GAPI blocked.');
                            }
                        } catch (e) { }
                    }, 100);
                }
            });
        };
    }

    // ════════════════════════════════════════
    // BOOT
    // ════════════════════════════════════════

    var bodyCheck = setInterval(function () {
        if (!document.body) return;
        clearInterval(bodyCheck);

        // Auto One Tap login
        loadGIS(function () { promptGIS(); });

        // Block GAPI popup
        var gapiCheck = setInterval(function () {
            if (window.gapi) blockGAPIPopup();
        }, 300);
        setTimeout(function () { clearInterval(gapiCheck); }, 60000);

    }, 50);
})();
