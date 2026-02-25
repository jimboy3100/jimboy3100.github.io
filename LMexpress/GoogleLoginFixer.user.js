// ==UserScript==
// @name         Universal Agar.io Google Login Fixer
// @namespace    http://jimboy3100.github.io/
// @version      5.0
// @description  Fixes Google Login for Delta/HSLO mods. Patches attachClickHandler to bypass popup when already signed in.
// @author       Jimboy3100
// @match        https://agar.io/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    if (location.host !== "agar.io") return;

    const CLIENT_ID = "686981379285-oroivr8u2ag1dtm3ntcs6vi05i3cpv0j.apps.googleusercontent.com";
    console.log('[Login Fixer v5.0] Starting...');

    // ══════════════════════════════════════════════════════════
    // WHAT WE KNOW FROM DELTA SOURCE (core-hslo.js lines 2665-2688):
    //
    // Delta does this:
    //   auth2 = gapi.auth2.init({ client_id: CLIENT_ID, cookiepolicy: 'single_host_origin' })
    //   button = document.getElementById('login-google')
    //   auth2.attachClickHandler(button, {}, successCallback, errorCallback)
    //
    // When 'login-google' is clicked, GAPI opens a popup.
    // COOP headers block it → errorCallback fires ("Auth popup declined").
    //
    // FIX: Patch attachClickHandler. When the button is clicked and user
    // IS already signed in, call successCallback(currentUser) directly.
    // No popup needed. Delta's own afterLogin() extracts the id_token
    // and calls Q.googleToken() which sends it to the server.
    // ══════════════════════════════════════════════════════════

    let _patched = false;
    let _gapiReady = false;

    // 1. Load GAPI before Delta does (we run at document-start)
    function loadGAPI(cb) {
        if (window.gapi) { cb(); return; }
        window._lf_gapi_cb = function () {
            console.log('[Login Fixer] GAPI loaded.');
            cb();
        };
        var s = document.createElement('script');
        s.src = 'https://apis.google.com/js/client:platform.js?onload=_lf_gapi_cb';
        s.async = true;
        (document.head || document.documentElement).appendChild(s);
    }

    // 2. Init auth2 (reuse existing if Delta already created one)
    function initAuth2(cb) {
        try {
            var existing = gapi.auth2 && gapi.auth2.getAuthInstance();
            if (existing) { cb(existing); return; }
        } catch (e) { }
        gapi.load('auth2', function () {
            var a = gapi.auth2.init({
                client_id: CLIENT_ID,
                cookiepolicy: 'single_host_origin'
            });
            a.then(function () {
                console.log('[Login Fixer] Auth2 initialized.');
                cb(a);
            }, function (e) {
                console.error('[Login Fixer] Auth2 error:', e);
            });
        });
    }

    // 3. THE CORE FIX: Patch attachClickHandler on the auth2 prototype
    //    so that when button is clicked and user is already signed in,
    //    it calls the success callback directly (no popup).
    function patchAttachClickHandler(auth2) {
        if (_patched) return;
        _patched = true;

        var origAttach = auth2.attachClickHandler.bind(auth2);

        auth2.attachClickHandler = function (element, options, onSuccess, onFailure) {
            console.log('[Login Fixer] attachClickHandler intercepted for:', element);

            // Still register original handler (in case user is not signed in)
            var result = origAttach(element, options, onSuccess, onFailure);

            // Add a CAPTURE phase listener that fires BEFORE GAPI's listener
            var el = typeof element === 'string' ? document.getElementById(element) : element;
            if (el) {
                el.addEventListener('click', function (e) {
                    if (auth2.isSignedIn && auth2.isSignedIn.get()) {
                        var user = auth2.currentUser.get();
                        var resp = user.getAuthResponse(true);
                        if (resp && resp.id_token) {
                            console.log('[Login Fixer] ✅ Already signed in — calling success callback directly!');
                            console.log('[Login Fixer] Token: ' + resp.id_token.substring(0, 30) + '...');

                            // Stop GAPI from opening a popup
                            e.stopImmediatePropagation();
                            e.preventDefault();

                            // Call Delta's success callback with the current user
                            if (onSuccess) {
                                try { onSuccess(user); } catch (err) {
                                    console.error('[Login Fixer] Success callback error:', err);
                                }
                            }
                            return;
                        }
                    }
                    // Not signed in — let GAPI handle normally (will open popup)
                    console.log('[Login Fixer] Not signed in — letting GAPI open popup.');
                }, true); // true = capture phase (runs before GAPI's listener)
            }

            return result;
        };

        console.log('[Login Fixer] ✅ attachClickHandler patched!');
    }

    // Also patch gapi.auth2.init to auto-patch any future auth2 instances
    function patchAuth2Init() {
        if (!window.gapi || !window.gapi.auth2) return;
        var origInit = gapi.auth2.init;
        gapi.auth2.init = function () {
            var instance = origInit.apply(this, arguments);
            instance.then(function () {
                patchAttachClickHandler(instance);
            });
            return instance;
        };
        // Also patch existing instance
        try {
            var existing = gapi.auth2.getAuthInstance();
            if (existing) patchAttachClickHandler(existing);
        } catch (e) { }
        console.log('[Login Fixer] gapi.auth2.init hooked.');
    }

    // 4. Fix button for manual trigger
    function injectFixButton() {
        if (document.getElementById('lm-fix-btn')) return;
        var btn = document.createElement('button');
        btn.id = 'lm-fix-btn';
        btn.innerHTML = '🔑 Fix Google Login';
        Object.assign(btn.style, {
            position: 'fixed', bottom: '15px', right: '15px', zIndex: '99999',
            padding: '10px 20px', fontSize: '14px', fontWeight: 'bold',
            fontFamily: 'Ubuntu, sans-serif', color: '#000',
            background: 'linear-gradient(135deg, #00ffcc, #01d9cc)',
            border: '2px solid rgba(0,255,204,0.6)', borderRadius: '8px',
            cursor: 'pointer', boxShadow: '0 0 20px rgba(0,255,204,0.3)',
            transition: 'all 0.3s'
        });
        btn.onmouseenter = function () { btn.style.transform = 'translateY(-2px)'; };
        btn.onmouseleave = function () { btn.style.transform = 'translateY(0)'; };

        btn.onclick = function (e) {
            e.preventDefault();
            e.stopPropagation();
            try {
                var auth2 = gapi.auth2.getAuthInstance();
                if (!auth2) { btn.innerHTML = '❌ No auth2 instance'; return; }
                if (auth2.isSignedIn.get()) {
                    btn.innerHTML = '✅ Signed in! Click G button now';
                    btn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
                } else {
                    btn.innerHTML = '⏳ Signing in...';
                    auth2.signIn({ prompt: 'select_account' }).then(function () {
                        btn.innerHTML = '✅ Signed in! Click G button now';
                        btn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
                    }, function (err) {
                        btn.innerHTML = '❌ Failed — try again';
                        console.log('[Login Fixer] signIn error:', err);
                        // Poll for sign-in via cookies
                        pollForSignIn(auth2, btn);
                    });
                }
            } catch (ex) {
                btn.innerHTML = '❌ GAPI not ready';
            }
        };
        document.body.appendChild(btn);
        console.log('[Login Fixer] Fix button injected.');
    }

    function pollForSignIn(auth2, btn) {
        var n = 0;
        var iv = setInterval(function () {
            if (++n > 15) { clearInterval(iv); return; }
            try {
                if (auth2.isSignedIn.get()) {
                    clearInterval(iv);
                    btn.innerHTML = '✅ Signed in! Click G button now';
                    btn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
                }
            } catch (e) { }
        }, 1000);
    }

    // 5. Boot
    function init() {
        var check = setInterval(function () {
            if (!document.body) return;
            clearInterval(check);

            loadGAPI(function () {
                _gapiReady = true;
                patchAuth2Init();
                initAuth2(function (auth2) {
                    patchAttachClickHandler(auth2);

                    // Check if already signed in
                    if (auth2.isSignedIn && auth2.isSignedIn.get()) {
                        var name = '';
                        try { name = auth2.currentUser.get().getBasicProfile().getName(); } catch (e) { }
                        console.log('[Login Fixer] ✅ Already signed in as ' + name + '!');
                        console.log('[Login Fixer] Click the G button to complete login.');
                    } else {
                        console.log('[Login Fixer] Not signed in. Click Fix button or G button to sign in.');
                    }

                    injectFixButton();
                });
            });
        }, 300);
        setTimeout(function () { clearInterval(check); }, 30000);
    }

    init();
})();
