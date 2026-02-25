// ==UserScript==
// @name         Universal Agar.io Google Login Fixer
// @namespace    http://jimboy3100.github.io/
// @version      6.1
// @description  Fixes Google Login for Delta v7. Uses GIS (Google Identity Services) to bypass GAPI's broken popup. Fully automatic — no manual buttons needed.
// @author       Jimboy3100
// @match        https://agar.io/*
// @run-at       document-start
// @grant        none
// @downloadURL none
// ==/UserScript==

(function () {
    'use strict';
    if (location.host !== "agar.io") return;

    const CLIENT_ID = "686981379285-oroivr8u2ag1dtm3ntcs6vi05i3cpv0j.apps.googleusercontent.com";
    const LOG = (msg, ...a) => console.log('[LoginFix]', msg, ...a);

    LOG('v6.1 starting...');

    // ══════════════════════════════════════════════════════════
    // HOW LEGEND MOD DOES IT (ogario.v4.master.js lines 118-171):
    //
    //   setup():
    //     gapi.auth2.init({ client_id, cookie_policy, scope, app_package_name })
    //     api.attachClickHandler(gplusLoginButton)
    //     api.currentUser.listen(transform)  ← fires when user signs in
    //     api.then(get)                      ← auto sign-in if previous session
    //
    //   transform(event):
    //     idToken = event.getAuthResponse().id_token
    //     master.doLoginWithGPlus(idToken)
    //     → core.sendGplusToken(idToken)     ← sends over WebSocket
    //
    // PROBLEM: GAPI popup is broken (400 error from Google).
    //          Both LM and Delta hit this same issue.
    //
    // FIX: Use Google Identity Services (GIS) to get the id_token
    //      via One Tap (iframe, no popup needed), then inject into
    //      Delta v7's GlAccount OR into the GAPI auth2 instance
    //      so both LM and Delta flows work.
    //
    // FLOW:
    //   1. Load GIS library at document-start
    //   2. When page loads, show One Tap automatically
    //   3. When token received, inject into Delta/LM
    //   4. Patch GAPI signIn() to use GIS instead of popup
    //   5. ZERO manual interaction beyond accepting One Tap
    // ══════════════════════════════════════════════════════════

    let _token = null;
    let _tokenDelivered = false;

    // ────────────────────────────────────────
    // TOKEN DELIVERY
    // ────────────────────────────────────────

    function onTokenReceived(idToken) {
        _token = idToken;
        LOG('✅ Got id_token:', idToken.substring(0, 30) + '...');

        // Decode JWT for user info
        try {
            var p = JSON.parse(atob(idToken.split('.')[1]));
            LOG('User:', p.name, '(' + p.email + ')');
        } catch (e) { }

        deliverToken();
    }

    function deliverToken() {
        if (!_token) return;
        var delivered = false;

        // ── Delta v7: GlAccount (from v7/js/Miniclip/Accs.js) ──
        if (window.GlAccount) {
            LOG('Delivering to GlAccount...');
            window.GlAccount.token = _token;
            window.GlAccount.state && (window.GlAccount.state.logged = true);
            window.GlAccount.memory && (window.GlAccount.memory.enabled = true);

            // Set user info from JWT
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

            // Emit events → triggers sendAccessToken(token, 4)
            if (typeof window.GlAccount.emit === 'function') {
                window.GlAccount.emit('user', window.GlAccount);
                window.GlAccount.emit('login', window.GlAccount);
                LOG('✅ GlAccount login emitted!');
                delivered = true;
            }
        }

        // ── Also try via accs.realms.Google ──
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

        // ── Legend Mod: master.doLoginWithGPlus ──
        if (window.master && typeof window.master.doLoginWithGPlus === 'function') {
            window.master.doLoginWithGPlus(_token);
            LOG('✅ master.doLoginWithGPlus() called!');
            delivered = true;
        }

        if (delivered) {
            _tokenDelivered = true;
            removeGISContainer();
        } else {
            // Not ready yet — retry when Delta/LM initializes
            LOG('Delta/LM not ready yet — will retry...');
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

    // Re-deliver when WebSocket reconnects (Delta re-emits on new connection)
    function watchForReconnects() {
        // Delta v7 re-sends token on 'estabilished' event via initClientEvents
        // We just need to make sure GlAccount.token stays set
        setInterval(function () {
            if (_token && window.GlAccount && !window.GlAccount.token) {
                LOG('Token was cleared — re-injecting...');
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
        s.onerror = function () { LOG('ERROR: Failed to load GIS.'); };
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

        // Show One Tap automatically
        LOG('Showing One Tap...');
        google.accounts.id.prompt(function (notification) {
            if (notification.isNotDisplayed()) {
                LOG('One Tap not shown:', notification.getNotDisplayedReason());
                // If One Tap can't show (e.g. user never signed into Google),
                // render a sign-in button as fallback
                showGISButton();
            } else if (notification.isSkippedMoment()) {
                LOG('One Tap skipped:', notification.getSkippedReason());
                showGISButton();
            }
            // If displayed, user will see "Continue as..." and click it
        });
    }

    // ── v6.1 DESIGN CHANGE: hide original Google btn, put real GIS btn in its place ──
    var _origHidden = false;

    function findOriginalGoogleButton() {
        // Method 1: look for .fa-google icon
        var icons = document.querySelectorAll('.fa-google');
        for (var i = 0; i < icons.length; i++) {
            if (icons[i].closest('#lf-google-btn')) continue;
            var el = icons[i];
            while (el && (!el.classList || !el.classList.contains('btn-colored'))) el = el.parentElement;
            if (el) return el;
        }
        // Method 2: look for btn-colored buttons — the Google one is typically the 2nd
        var btns = document.querySelectorAll('.btn-colored.size-small');
        for (var j = 0; j < btns.length; j++) {
            var txt = btns[j].textContent.trim();
            // Google button contains "G" or "google" (not "f" for Facebook)
            if (txt === 'G' || txt.toLowerCase().indexOf('google') >= 0) return btns[j];
        }
        // Method 3: if there are exactly 2 btn-colored.size-small, second is Google
        if (btns.length >= 2) return btns[1];
        return null;
    }

    function hideOriginalGoogleButton() {
        if (_origHidden) return;
        var btn = findOriginalGoogleButton();
        if (btn) {
            btn.style.display = 'none';
            _origHidden = true;
            LOG('Original Google button hidden.');
        }
    }

    function showGISButton() {
        if (document.getElementById('lf-google-btn')) return;

        var origBtn = findOriginalGoogleButton();
        if (origBtn) {
            origBtn.style.display = 'none';
            _origHidden = true;
        }

        // Create container for real GIS-rendered button
        var btnDiv = document.createElement('div');
        btnDiv.id = 'lf-google-btn';
        btnDiv.style.cssText = 'display:inline-block;position:relative;z-index:9999;transform:scale(0.7);transform-origin:left center;margin:0;';

        // Insert where original was
        if (origBtn && origBtn.parentElement) {
            origBtn.parentElement.insertBefore(btnDiv, origBtn);
        } else {
            document.body.appendChild(btnDiv);
        }

        // Render REAL Google sign-in button (same as v6.0 — this actually works)
        google.accounts.id.renderButton(btnDiv, {
            theme: 'filled_blue', size: 'medium', shape: 'rectangular',
            text: 'signin_with', width: 150
        });
        LOG('GIS button placed.');
    }

    function removeGISContainer() {
        var el = document.getElementById('lf-google-btn');
        if (el) el.remove();
    }

    // ────────────────────────────────────────
    // GAPI PATCHES
    // Intercept GAPI so Delta/LM's own Google
    // button triggers GIS instead of popup
    // ────────────────────────────────────────

    function patchGAPI() {
        // Hook gapi.load to catch when auth2 module loads
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

        // Check if auth2 already loaded
        if (gapi.auth2) patchAuth2();
    }

    function patchAuth2() {
        if (!gapi.auth2) return;

        // Hook auth2.init
        var origInit = gapi.auth2.init;
        if (origInit._lf) return;

        gapi.auth2.init = function () {
            var inst = origInit.apply(this, arguments);
            inst.then(function () { patchInstance(inst); });
            return inst;
        };
        gapi.auth2.init._lf = true;

        // Patch existing instance
        try {
            var existing = gapi.auth2.getAuthInstance();
            if (existing) patchInstance(existing);
        } catch (e) { }

        LOG('auth2.init hooked.');
    }

    function patchInstance(auth2) {
        if (auth2._lf) return;
        auth2._lf = true;

        // Patch signIn → use GIS instead
        var origSignIn = auth2.signIn.bind(auth2);
        auth2.signIn = function () {
            LOG('signIn() intercepted → using GIS.');
            if (_token) {
                deliverToken();
                return Promise.resolve();
            }
            // Show GIS prompt
            initGIS();
            return Promise.resolve();
        };

        // Patch attachClickHandler → intercept click with GIS
        if (auth2.attachClickHandler) {
            var origAttach = auth2.attachClickHandler.bind(auth2);
            auth2.attachClickHandler = function (el, opts, onSuccess, onFail) {
                LOG('attachClickHandler intercepted.');
                // Don't register original — it would open the broken popup
                // Instead, add our own click handler that uses GIS
                var elem = typeof el === 'string' ? document.getElementById(el) : el;
                if (elem) {
                    elem.addEventListener('click', function (e) {
                        e.stopImmediatePropagation();
                        e.preventDefault();
                        if (_token && onSuccess) {
                            // Fake a GoogleUser-like object
                            onSuccess({
                                getAuthResponse: function () {
                                    return { id_token: _token, expires_at: Date.now() + 3600000 };
                                },
                                getBasicProfile: function () {
                                    var p = {};
                                    try { p = JSON.parse(atob(_token.split('.')[1])); } catch (e) { }
                                    return {
                                        getImageUrl: function () { return p.picture || ''; },
                                        getName: function () { return p.name || ''; },
                                        getGivenName: function () { return p.given_name || ''; },
                                        getFamilyName: function () { return p.family_name || ''; },
                                        getId: function () { return p.sub || ''; },
                                        getEmail: function () { return p.email || ''; }
                                    };
                                }
                            });
                        } else {
                            initGIS();
                        }
                    }, true);
                }
                return auth2;
            };
        }

        LOG('✅ Auth2 instance patched.');
    }

    // ────────────────────────────────────────
    // BOOT
    // ────────────────────────────────────────

    function boot() {
        // Wait for body
        var bodyCheck = setInterval(function () {
            if (!document.body) return;
            clearInterval(bodyCheck);

            // 1. Load GIS and show One Tap
            loadGIS(function () {
                initGIS();
            });

            // 2. Watch for GAPI loading and patch it
            var gapiCheck = setInterval(function () {
                if (window.gapi) {
                    patchGAPI();
                    if (window.gapi.auth2) {
                        patchAuth2();
                    }
                }
            }, 300);
            setTimeout(function () { clearInterval(gapiCheck); }, 60000);

            // 3. Watch for reconnects
            watchForReconnects();

            // 4. Keep trying to hide original Google button (it may render late)
            var hideCheck = setInterval(function () {
                if (_origHidden) { clearInterval(hideCheck); return; }
                hideOriginalGoogleButton();
            }, 500);
            setTimeout(function () { clearInterval(hideCheck); }, 60000);

        }, 100);
        setTimeout(function () { clearInterval(bodyCheck); }, 30000);
    }

    boot();
})();
