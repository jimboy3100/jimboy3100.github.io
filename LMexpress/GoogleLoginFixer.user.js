// ==UserScript==
// @name         Universal Agar.io Google Login Fixer
// @namespace    http://jimboy3100.github.io/
// @version      5.2
// @description  Fixes Google Login for Delta v7 mod using Google Identity Services (GIS) instead of broken GAPI popup.
// @author       Jimboy3100
// @match        https://agar.io/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    if (location.host !== "agar.io") return;

    const CLIENT_ID = "686981379285-oroivr8u2ag1dtm3ntcs6vi05i3cpv0j.apps.googleusercontent.com";
    console.log('[Login Fixer v5.2] Starting — GIS approach...');

    // ══════════════════════════════════════════════════════════
    // WHY v5.1 FAILED:
    //   GAPI's signIn() opens a popup to accounts.google.com
    //   → Google returns 400 (malformed request)
    //   → User was never "already signed in" so bypass never fired
    //
    // NEW APPROACH (v5.2):
    //   Use Google Identity Services (GIS) — the modern replacement
    //   for GAPI Sign-In. GIS uses iframe-based flow (no popup).
    //   Returns a JWT credential (id_token) directly.
    //
    //   Then inject the token into Delta v7's GlAccount system:
    //   - Set GlAccount.token = credential
    //   - Call GlAccount.emit('login', GlAccount)
    //   - This triggers sendAccessToken(token, 4) via event system
    //
    // ALSO: Patch GAPI.signIn() to use our GIS flow instead.
    // ══════════════════════════════════════════════════════════

    let _gisLoaded = false;
    let _gisInitialized = false;
    let _lastToken = null;

    // ────────────────────────────────────────────────────
    // 1. Load Google Identity Services library
    // ────────────────────────────────────────────────────
    function loadGIS(cb) {
        if (window.google && window.google.accounts) {
            cb();
            return;
        }
        var s = document.createElement('script');
        s.src = 'https://accounts.google.com/gsi/client';
        s.async = true;
        s.onload = function () {
            console.log('[Login Fixer] GIS library loaded.');
            _gisLoaded = true;
            cb();
        };
        s.onerror = function () {
            console.error('[Login Fixer] Failed to load GIS library.');
        };
        (document.head || document.documentElement).appendChild(s);
    }

    // ────────────────────────────────────────────────────
    // 2. Handle the GIS credential response
    //    credential.credential is the JWT id_token
    // ────────────────────────────────────────────────────
    function handleCredentialResponse(response) {
        var idToken = response.credential;
        if (!idToken) {
            console.error('[Login Fixer] No credential in response!');
            return;
        }

        console.log('[Login Fixer] ✅ Got GIS credential!');
        console.log('[Login Fixer] Token: ' + idToken.substring(0, 40) + '...');
        _lastToken = idToken;

        // Decode the JWT to show user info
        try {
            var payload = JSON.parse(atob(idToken.split('.')[1]));
            console.log('[Login Fixer] User: ' + payload.name + ' (' + payload.email + ')');
            updateButton('✅ ' + payload.name, true);
        } catch (e) { }

        // Deliver token to Delta v7's GlAccount
        deliverTokenToV7(idToken);

        // Also try HSLO delivery
        deliverTokenToHSLO(idToken);
    }

    // ────────────────────────────────────────────────────
    // 3. Deliver token to Delta v7 (GlAccount)
    // ────────────────────────────────────────────────────
    function deliverTokenToV7(idToken) {
        // V7 exposes GlAccount globally (from Accs.js line 34)
        if (window.GlAccount) {
            console.log('[Login Fixer] Injecting token into GlAccount...');

            // Set the token directly
            window.GlAccount.token = idToken;
            window.GlAccount.state.logged = true;
            window.GlAccount.memory.enabled = true;

            // Decode expiration from JWT
            try {
                var payload = JSON.parse(atob(idToken.split('.')[1]));
                window.GlAccount.state.expiration = payload.exp * 1000; // convert to ms

                // Set user info
                window.GlAccount.user = window.GlAccount.user || {};
                window.GlAccount.user.first_name = payload.given_name || '';
                window.GlAccount.user.last_name = payload.family_name || '';
                window.GlAccount.user.picture = payload.picture || '';
                window.GlAccount.user.id = payload.sub || '';
            } catch (e) { }

            // Emit events — this is what triggers sendAccessToken
            // (from Accs.js line 324-326: listenTo(realm, 'login', ...))
            if (typeof window.GlAccount.emit === 'function') {
                window.GlAccount.emit('user', window.GlAccount);
                window.GlAccount.emit('login', window.GlAccount);
                console.log('[Login Fixer] ✅ GlAccount login event emitted!');
            }

            return true;
        }

        // Fallback: try via window.accs
        if (window.accs && window.accs.realms && window.accs.realms.Google) {
            var gl = window.accs.realms.Google;
            gl.token = idToken;
            gl.state.logged = true;
            gl.memory.enabled = true;
            if (typeof gl.emit === 'function') {
                gl.emit('user', gl);
                gl.emit('login', gl);
                console.log('[Login Fixer] ✅ Token injected via accs.realms.Google!');
            }
            return true;
        }

        console.log('[Login Fixer] GlAccount not found (not v7?)');
        return false;
    }

    // ────────────────────────────────────────────────────
    // 4. Deliver token to HSLO versions
    // ────────────────────────────────────────────────────
    function deliverTokenToHSLO(idToken) {
        // HSLO stores google auth in _4188507 (not accessible by name)
        // But we can trigger it via the login-google button UI
        var loginBtn = document.getElementById('login-google');
        if (loginBtn && loginBtn.classList && !loginBtn.classList.contains('active')) {
            // Store token for HSLO's internal handler
            try {
                // Try localStorage approach that HSLO uses
                var storageKey = 'extras';
                var existing = localStorage.getItem(storageKey);
                if (existing) {
                    var parsed = JSON.parse(existing);
                    parsed.googleToken = {
                        token: idToken,
                        expiry: Date.now() + 3600000 // 1 hour
                    };
                    localStorage.setItem(storageKey, JSON.stringify(parsed));
                    console.log('[Login Fixer] Stored token in localStorage for HSLO.');
                }
            } catch (e) { }
        }
    }

    // ────────────────────────────────────────────────────
    // 5. Patch GAPI.signIn() to use GIS instead
    // ────────────────────────────────────────────────────
    function patchGAPISignIn() {
        // Wait for GAPI to be loaded by Delta
        var check = setInterval(function () {
            try {
                var auth2 = gapi.auth2.getAuthInstance();
                if (auth2 && !auth2._lfPatched) {
                    auth2._lfPatched = true;
                    clearInterval(check);

                    var origSignIn = auth2.signIn.bind(auth2);
                    auth2.signIn = function (options) {
                        console.log('[Login Fixer] GAPI.signIn() intercepted — using GIS instead.');

                        // If we already have a token from GIS, deliver it
                        if (_lastToken) {
                            console.log('[Login Fixer] Reusing last GIS token.');
                            deliverTokenToV7(_lastToken);
                            return Promise.resolve();
                        }

                        // Otherwise, prompt GIS login
                        promptGISLogin();
                        return Promise.resolve();
                    };

                    // Also patch attachClickHandler for HSLO
                    if (auth2.attachClickHandler) {
                        var origAttach = auth2.attachClickHandler.bind(auth2);
                        auth2.attachClickHandler = function (element, options, onSuccess, onFailure) {
                            console.log('[Login Fixer] attachClickHandler intercepted.');
                            var result = origAttach(element, options, onSuccess, onFailure);
                            var el = typeof element === 'string' ? document.getElementById(element) : element;
                            if (el) {
                                el.addEventListener('click', function (e) {
                                    if (_lastToken) {
                                        e.stopImmediatePropagation();
                                        e.preventDefault();
                                        console.log('[Login Fixer] Intercepted click — using GIS token.');
                                        promptGISLogin();
                                    }
                                }, true);
                            }
                            return result;
                        };
                    }

                    console.log('[Login Fixer] ✅ GAPI.signIn() patched to use GIS!');
                }
            } catch (e) { }
        }, 500);
        setTimeout(function () { clearInterval(check); }, 60000);
    }

    // ────────────────────────────────────────────────────
    // 6. Prompt GIS login (shows Google one-tap or button)
    // ────────────────────────────────────────────────────
    function promptGISLogin() {
        if (!window.google || !window.google.accounts) {
            console.error('[Login Fixer] GIS not loaded yet!');
            updateButton('❌ GIS not loaded', false);
            return;
        }

        if (!_gisInitialized) {
            google.accounts.id.initialize({
                client_id: CLIENT_ID,
                callback: handleCredentialResponse,
                auto_select: true,
                cancel_on_tap_outside: false
            });
            _gisInitialized = true;
        }

        // Show the One Tap prompt
        console.log('[Login Fixer] Showing GIS One Tap prompt...');
        updateButton('⏳ Check Google prompt...', false);
        google.accounts.id.prompt(function (notification) {
            console.log('[Login Fixer] GIS prompt notification:', notification);
            if (notification.isNotDisplayed()) {
                console.log('[Login Fixer] One Tap not displayed. Reason:', notification.getNotDisplayedReason());
                // Fallback: render a sign-in button
                showGISButton();
            } else if (notification.isSkippedMoment()) {
                console.log('[Login Fixer] One Tap skipped. Reason:', notification.getSkippedReason());
                showGISButton();
            } else if (notification.isDismissedMoment()) {
                console.log('[Login Fixer] One Tap dismissed. Reason:', notification.getDismissedReason());
                updateButton('🔑 Try again', false);
            }
        });
    }

    // ────────────────────────────────────────────────────
    // 7. Fallback: render a GIS sign-in button
    // ────────────────────────────────────────────────────
    function showGISButton() {
        var container = document.getElementById('gis-signin-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'gis-signin-container';
            Object.assign(container.style, {
                position: 'fixed', bottom: '60px', right: '15px', zIndex: '99999',
                background: 'rgba(0,0,0,0.85)', padding: '15px', borderRadius: '12px',
                border: '2px solid rgba(0,255,204,0.4)',
                boxShadow: '0 0 30px rgba(0,255,204,0.2)'
            });

            var label = document.createElement('div');
            label.innerHTML = 'Sign in with Google:';
            Object.assign(label.style, {
                color: '#00ffcc', fontSize: '13px', fontFamily: 'Ubuntu, sans-serif',
                marginBottom: '10px', textAlign: 'center'
            });
            container.appendChild(label);

            var btnDiv = document.createElement('div');
            btnDiv.id = 'gis-signin-btn';
            container.appendChild(btnDiv);

            var closeBtn = document.createElement('div');
            closeBtn.innerHTML = '✕';
            Object.assign(closeBtn.style, {
                position: 'absolute', top: '5px', right: '8px',
                color: '#888', cursor: 'pointer', fontSize: '14px'
            });
            closeBtn.onclick = function () { container.remove(); };
            container.appendChild(closeBtn);

            document.body.appendChild(container);
        }

        google.accounts.id.renderButton(
            document.getElementById('gis-signin-btn'),
            {
                theme: 'filled_blue', size: 'large',
                shape: 'rectangular', text: 'signin_with',
                width: 250
            }
        );
        console.log('[Login Fixer] GIS button rendered.');
        updateButton('👆 Click Google button above', false);
    }

    // ────────────────────────────────────────────────────
    // 8. Fix button (main control)
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

            if (_lastToken) {
                // Already have a token — re-deliver it
                deliverTokenToV7(_lastToken);
                deliverTokenToHSLO(_lastToken);
                updateButton('✅ Token re-sent!', true);
                return;
            }

            promptGISLogin();
        };

        document.body.appendChild(btn);
    }

    function updateButton(text, success) {
        var btn = document.getElementById('lm-fix-btn');
        if (btn) {
            btn.innerHTML = text;
            if (success) {
                btn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
                btn.style.color = '#fff';
            }
        }
    }

    // ────────────────────────────────────────────────────
    // 9. Also intercept Delta's Google button click
    // ────────────────────────────────────────────────────
    function interceptDeltaGoogleButton() {
        // Watch for clicks on Delta's Google login button
        document.addEventListener('click', function (e) {
            var target = e.target;
            // Check if click is on Google login button (v7 uses class-based buttons)
            while (target && target !== document.body) {
                // V7 button has onclick that calls clickButton('Google')
                if (target.classList &&
                    (target.classList.contains('fa-google') ||
                        target.id === 'login-google' ||
                        (target.getAttribute && target.getAttribute('style') === '--data-background:#DB4437'))) {

                    if (_lastToken) {
                        console.log('[Login Fixer] Intercepted Delta Google button click.');
                        // Let the original click handler run first, then re-deliver our token
                        setTimeout(function () {
                            deliverTokenToV7(_lastToken);
                        }, 500);
                    }
                    break;
                }
                target = target.parentElement;
            }
        }, true);
    }

    // ────────────────────────────────────────────────────
    // BOOT
    // ────────────────────────────────────────────────────
    function boot() {
        var check = setInterval(function () {
            if (!document.body) return;
            clearInterval(check);

            // Load GIS library
            loadGIS(function () {
                // Pre-initialize GIS
                try {
                    google.accounts.id.initialize({
                        client_id: CLIENT_ID,
                        callback: handleCredentialResponse,
                        auto_select: true,
                        cancel_on_tap_outside: false
                    });
                    _gisInitialized = true;
                    console.log('[Login Fixer] GIS initialized.');

                    // Try One Tap auto-prompt
                    google.accounts.id.prompt(function (notification) {
                        if (notification.isNotDisplayed()) {
                            console.log('[Login Fixer] Auto One Tap not shown:', notification.getNotDisplayedReason());
                        }
                    });
                } catch (e) {
                    console.log('[Login Fixer] GIS init error:', e);
                }

                injectFixButton();
                interceptDeltaGoogleButton();
            });

            // Also patch GAPI when it loads
            patchGAPISignIn();

        }, 100);
        setTimeout(function () { clearInterval(check); }, 30000);
    }

    boot();
})();
