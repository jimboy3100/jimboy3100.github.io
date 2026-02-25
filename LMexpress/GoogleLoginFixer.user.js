// ==UserScript==
// @name         Universal Agar.io Google Login Fixer
// @namespace    http://jimboy3100.github.io/
// @version      5.1
// @description  Fixes Google Login for Delta v7 mod. Patches GAPI.signIn to bypass popup when already signed in, and hooks attachClickHandler for older HSLO versions.
// @author       Jimboy3100
// @match        https://agar.io/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    if (location.host !== "agar.io") return;

    const CLIENT_ID = "686981379285-oroivr8u2ag1dtm3ntcs6vi05i3cpv0j.apps.googleusercontent.com";
    console.log('[Login Fixer v5.1] Starting...');

    // ══════════════════════════════════════════════════════════
    // DELTA V7 FLOW (from v7/js/Miniclip/Accs.js):
    //
    // 1. GlAccount.init() loads GAPI, calls gapi.auth2.init()
    //    then sets: GAPI.currentUser.listen(data => readUser(data))
    //
    // 2. When Google button clicked:
    //    Auth.clickButton('Google') → GlAccount.connect()
    //    → GAPI.signIn()  ← THIS opens the popup (blocked by COOP)
    //
    // 3. If signIn succeeds, currentUser.listen fires:
    //    readUser(data) extracts id_token → emits 'login'
    //
    // 4. initClientEvents hears 'login':
    //    → client.protocol.sendAccessToken(token, 4)
    //    sends protobuf to agar.io game server
    //
    // FIX: Patch GAPI.signIn() — when already signed in,
    // resolve immediately. The currentUser listener fires naturally.
    // Also expose GlAccount.readUser() to force-trigger login.
    //
    // HSLO FLOW (from hslo536/core-hslo.js):
    // Uses attachClickHandler instead of signIn — we patch that too.
    // ══════════════════════════════════════════════════════════

    let _patchedSignIn = false;
    let _patchedAttach = false;

    // ────────────────────────────────────────────────────
    // PATCH 1: GAPI.signIn() bypass (for Delta v7)
    // If already signed in, resolve immediately instead of popup
    // ────────────────────────────────────────────────────
    function patchSignIn(auth2) {
        if (_patchedSignIn) return;
        _patchedSignIn = true;

        var origSignIn = auth2.signIn.bind(auth2);

        auth2.signIn = function (options) {
            // If already signed in, skip the popup entirely
            if (auth2.isSignedIn && auth2.isSignedIn.get()) {
                var user = auth2.currentUser.get();
                var resp = user.getAuthResponse(true);
                if (resp && resp.id_token) {
                    console.log('[Login Fixer] ✅ Already signed in — skipping popup!');
                    console.log('[Login Fixer] User: ' + (user.getBasicProfile ? user.getBasicProfile().getName() : 'unknown'));
                    console.log('[Login Fixer] Token: ' + resp.id_token.substring(0, 30) + '...');

                    // Force the currentUser listener to fire by re-setting the user
                    // This triggers GlAccount.readUser(data) → emit('login')
                    try {
                        auth2.currentUser.get().reloadAuthResponse().then(function () {
                            console.log('[Login Fixer] Auth response reloaded — listener should fire.');
                        }).catch(function () {
                            // Fallback: manually trigger the listener
                            console.log('[Login Fixer] Reload failed — triggering listener manually.');
                            triggerCurrentUserListener(auth2);
                        });
                    } catch (e) {
                        triggerCurrentUserListener(auth2);
                    }

                    // Return a resolved promise like the original signIn would
                    return Promise.resolve(user);
                }
            }

            console.log('[Login Fixer] Not signed in — calling original signIn...');
            return origSignIn(options);
        };

        console.log('[Login Fixer] ✅ GAPI.signIn() patched (v7 bypass)!');
    }

    // Force the currentUser.listen() callback to fire
    // Delta v7 registered: GAPI.currentUser.listen(data => GlAccount.readUser(data))
    function triggerCurrentUserListener(auth2) {
        try {
            var user = auth2.currentUser.get();
            // Access the internal listener — GAPI stores listeners on currentUser
            if (auth2.currentUser && auth2.currentUser.Ab && typeof auth2.currentUser.Ab === 'function') {
                // Some GAPI versions use Ab
                auth2.currentUser.Ab(user);
            }

            // Also try to directly call GlAccount.readUser if available
            if (window.GlAccount && typeof window.GlAccount.readUser === 'function') {
                console.log('[Login Fixer] Calling GlAccount.readUser() directly...');
                window.GlAccount.readUser(user);
            }
        } catch (e) {
            console.log('[Login Fixer] triggerCurrentUserListener error:', e);
        }
    }

    // ────────────────────────────────────────────────────
    // PATCH 2: attachClickHandler bypass (for HSLO versions)
    // ────────────────────────────────────────────────────
    function patchAttachClickHandler(auth2) {
        if (_patchedAttach || !auth2.attachClickHandler) return;
        _patchedAttach = true;

        var origAttach = auth2.attachClickHandler.bind(auth2);

        auth2.attachClickHandler = function (element, options, onSuccess, onFailure) {
            console.log('[Login Fixer] attachClickHandler intercepted');

            var result = origAttach(element, options, onSuccess, onFailure);

            var el = typeof element === 'string' ? document.getElementById(element) : element;
            if (el) {
                el.addEventListener('click', function (e) {
                    if (auth2.isSignedIn && auth2.isSignedIn.get()) {
                        var user = auth2.currentUser.get();
                        var resp = user.getAuthResponse(true);
                        if (resp && resp.id_token) {
                            console.log('[Login Fixer] ✅ attachClickHandler: already signed in!');
                            e.stopImmediatePropagation();
                            e.preventDefault();
                            if (onSuccess) onSuccess(user);
                            return;
                        }
                    }
                }, true); // capture phase
            }
            return result;
        };
        console.log('[Login Fixer] ✅ attachClickHandler patched (HSLO bypass)!');
    }

    // ────────────────────────────────────────────────────
    // PATCH 3: Hook gapi.auth2.init to auto-patch
    // ────────────────────────────────────────────────────
    function hookAuth2Init() {
        if (!window.gapi || !window.gapi.auth2) return;
        var origInit = gapi.auth2.init;
        gapi.auth2.init = function () {
            var instance = origInit.apply(this, arguments);
            instance.then(function () {
                patchSignIn(instance);
                patchAttachClickHandler(instance);
            });
            return instance;
        };
        try {
            var existing = gapi.auth2.getAuthInstance();
            if (existing) {
                patchSignIn(existing);
                patchAttachClickHandler(existing);
            }
        } catch (e) { }
        console.log('[Login Fixer] gapi.auth2.init hooked.');
    }

    // ────────────────────────────────────────────────────
    // Fix button (manual sign-in trigger)
    // ────────────────────────────────────────────────────
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
                if (!auth2) { btn.innerHTML = '❌ No auth2'; return; }

                if (auth2.isSignedIn.get()) {
                    // Already signed in — trigger login flow manually
                    btn.innerHTML = '✅ Signed in!';
                    btn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';

                    // For v7: call GlAccount.readUser directly
                    if (window.GlAccount) {
                        var user = auth2.currentUser.get();
                        window.GlAccount.readUser(user);
                        btn.innerHTML = '✅ Token sent!';
                        console.log('[Login Fixer] Manually triggered GlAccount.readUser()');
                    }

                    // For HSLO: trigger click on login-google
                    var gBtn = document.getElementById('login-google');
                    if (gBtn) {
                        setTimeout(function () { gBtn.click(); }, 200);
                    }
                } else {
                    btn.innerHTML = '⏳ Signing in...';
                    // Use real signIn (bypasses our patch since we check isSignedIn)
                    var origSignIn = auth2.signIn.__original || auth2.signIn;
                    auth2.signIn({ prompt: 'select_account' }).then(function (user) {
                        btn.innerHTML = '✅ Signed in! Token sent!';
                        btn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';

                        // V7: readUser should fire from currentUser.listen
                        // But trigger it manually too just in case
                        if (window.GlAccount) {
                            window.GlAccount.readUser(user);
                        }
                    }, function (err) {
                        console.log('[Login Fixer] signIn error:', err);
                        btn.innerHTML = '❌ Popup blocked — try popup unblocker';
                        // Poll for cookie-based sign-in
                        pollForSignIn(auth2, btn);
                    });
                }
            } catch (ex) {
                btn.innerHTML = '❌ GAPI not ready';
                console.error('[Login Fixer]', ex);
            }
        };
        document.body.appendChild(btn);
    }

    function pollForSignIn(auth2, btn) {
        var n = 0;
        var iv = setInterval(function () {
            if (++n > 20) { clearInterval(iv); return; }
            try {
                if (auth2.isSignedIn.get()) {
                    clearInterval(iv);
                    btn.innerHTML = '✅ Signed in!';
                    btn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
                    if (window.GlAccount) {
                        window.GlAccount.readUser(auth2.currentUser.get());
                        btn.innerHTML = '✅ Token sent!';
                    }
                }
            } catch (e) { }
        }, 1000);
    }

    // ────────────────────────────────────────────────────
    // Boot sequence
    // ────────────────────────────────────────────────────
    function boot() {
        var check = setInterval(function () {
            if (!document.body) return;
            clearInterval(check);

            // Wait for GAPI to load (Delta v7 loads it via gapiAsyncInit)
            var gapiCheck = setInterval(function () {
                if (window.gapi && window.gapi.auth2) {
                    clearInterval(gapiCheck);
                    hookAuth2Init();

                    // Also patch existing instance if Delta already created one
                    try {
                        var existing = gapi.auth2.getAuthInstance();
                        if (existing) {
                            patchSignIn(existing);
                            patchAttachClickHandler(existing);
                            console.log('[Login Fixer] Patched existing auth2 instance.');

                            if (existing.isSignedIn && existing.isSignedIn.get()) {
                                var name = '';
                                try { name = existing.currentUser.get().getBasicProfile().getName(); } catch (e) { }
                                console.log('[Login Fixer] ✅ Already signed in as ' + name);
                            }
                        }
                    } catch (e) { }

                    injectFixButton();
                }

                // Also hook gapi.load to catch when auth2 module loads
                if (window.gapi && !window.gapi._lfHooked) {
                    window.gapi._lfHooked = true;
                    var origLoad = gapi.load;
                    gapi.load = function (libs, cb) {
                        var result = origLoad.call(this, libs, function () {
                            if (typeof cb === 'function') cb();
                            // After auth2 loads, hook init
                            if (libs.indexOf('auth2') >= 0) {
                                setTimeout(function () {
                                    hookAuth2Init();
                                    injectFixButton();
                                }, 100);
                            }
                        });
                        return result;
                    };
                    console.log('[Login Fixer] gapi.load hooked.');
                }
            }, 200);

            setTimeout(function () { clearInterval(gapiCheck); }, 30000);
        }, 100);
        setTimeout(function () { clearInterval(check); }, 30000);
    }

    boot();
})();
