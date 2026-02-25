// ==UserScript==
// @name         Universal Agar.io Google Login Fixer
// @namespace    http://jimboy3100.github.io/
// @version      6.1
// @description  Fixes Google Login for Delta v7. Overrides GlAccount.connect() to use GIS instead of broken GAPI popup. Delta's own Google button works as intended.
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

    LOG('v6.1 starting...');

    // ══════════════════════════════════════════════════════════
    // Delta v7 Google flow (Accs.js):
    //
    //   Button click → clickButton('Google')
    //     → Accs.realms['Google'].connect()
    //       → GAPI.signIn()          ← BROKEN (400 error)
    //       → GAPI.currentUser.listen fires
    //       → GlAccount.readUser(gapiUser)
    //         → gapiUser.getAuthResponse().id_token
    //         → gapiUser.getBasicProfile().getImageUrl() etc
    //         → this.emit('login', this)
    //           → initClientEvents listener
    //           → sendAccessToken(token, 4)
    //           → Auth UI updates button to .active
    //
    // FIX: Override GlAccount.connect() to use GIS.
    //      When GIS returns token, call GlAccount.readUser()
    //      with a fake GAPI-compatible user object.
    //      This way ALL of Delta's internal handlers fire normally.
    // ══════════════════════════════════════════════════════════

    let _gisReady = false;
    let _gisInitialized = false;

    // ────────────────────────────────────────
    // LOAD GIS
    // ────────────────────────────────────────

    function loadGIS(cb) {
        if (window.google && window.google.accounts) {
            _gisReady = true;
            cb && cb();
            return;
        }
        var s = document.createElement('script');
        s.src = 'https://accounts.google.com/gsi/client';
        s.async = true;
        s.onload = function () {
            LOG('GIS loaded.');
            _gisReady = true;
            cb && cb();
        };
        s.onerror = function () { LOG('ERROR: Failed to load GIS.'); };
        (document.head || document.documentElement).appendChild(s);
    }

    // ────────────────────────────────────────
    // GIS LOGIN — returns token via callback
    // ────────────────────────────────────────

    function doGISLogin(onToken) {
        if (!_gisReady) {
            LOG('GIS not ready, loading...');
            loadGIS(function () { doGISLogin(onToken); });
            return;
        }

        if (!_gisInitialized) {
            google.accounts.id.initialize({
                client_id: CLIENT_ID,
                callback: function (resp) {
                    if (resp.credential) {
                        LOG('✅ GIS credential received!');
                        onToken(resp.credential);
                    }
                },
                auto_select: true,
                cancel_on_tap_outside: false,
                itp_support: true
            });
            _gisInitialized = true;
        }

        // Show One Tap prompt
        LOG('Showing GIS prompt...');
        google.accounts.id.prompt(function (notification) {
            if (notification.isNotDisplayed()) {
                LOG('One Tap not shown:', notification.getNotDisplayedReason());
                showGISButton(onToken);
            } else if (notification.isSkippedMoment()) {
                LOG('One Tap skipped:', notification.getSkippedReason());
                showGISButton(onToken);
            }
        });
    }

    function showGISButton(onToken) {
        if (document.getElementById('gis-container')) return;

        var container = document.createElement('div');
        container.id = 'gis-container';
        Object.assign(container.style, {
            position: 'fixed', top: '10px', right: '10px', zIndex: '999999',
            background: 'rgba(0,0,0,0.9)', padding: '12px 16px', borderRadius: '10px',
            border: '1px solid rgba(0,255,204,0.3)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px'
        });

        var label = document.createElement('div');
        label.textContent = 'Sign in to play with your account:';
        Object.assign(label.style, {
            color: '#ccc', fontSize: '12px', fontFamily: 'Ubuntu, sans-serif'
        });

        var btnDiv = document.createElement('div');
        btnDiv.id = 'gis-btn';

        var close = document.createElement('div');
        close.textContent = '✕';
        Object.assign(close.style, {
            position: 'absolute', top: '4px', right: '8px',
            color: '#666', cursor: 'pointer', fontSize: '12px'
        });
        close.onclick = function () { container.remove(); };

        container.appendChild(close);
        container.appendChild(label);
        container.appendChild(btnDiv);
        document.body.appendChild(container);

        // Re-init GIS with new callback if needed
        google.accounts.id.initialize({
            client_id: CLIENT_ID,
            callback: function (resp) {
                if (resp.credential) {
                    LOG('✅ GIS credential from button!');
                    container.remove();
                    onToken(resp.credential);
                }
            },
            auto_select: false,
            cancel_on_tap_outside: false
        });

        google.accounts.id.renderButton(btnDiv, {
            theme: 'filled_blue', size: 'large', shape: 'rectangular',
            text: 'signin_with', width: 280
        });
        LOG('GIS sign-in button shown.');
    }

    // ────────────────────────────────────────
    // BUILD FAKE GAPI USER OBJECT
    // Compatible with GlAccount.readUser(data)
    // which calls data.getAuthResponse() and
    // data.getBasicProfile()
    // ────────────────────────────────────────

    function buildFakeGAPIUser(idToken) {
        // Decode JWT payload
        var payload = {};
        try { payload = JSON.parse(atob(idToken.split('.')[1])); } catch (e) { }

        LOG('User:', payload.name, '(' + payload.email + ')');

        return {
            getAuthResponse: function () {
                return {
                    id_token: idToken,
                    access_token: idToken,
                    expires_at: (payload.exp || 0) * 1000,
                    expires_in: 3600
                };
            },
            getBasicProfile: function () {
                return {
                    getImageUrl: function () { return payload.picture || ''; },
                    getName: function () { return payload.name || ''; },
                    getGivenName: function () { return payload.given_name || ''; },
                    getFamilyName: function () { return payload.family_name || ''; },
                    getId: function () { return payload.sub || ''; },
                    getEmail: function () { return payload.email || ''; }
                };
            },
            isSignedIn: function () { return true; }
        };
    }

    // ────────────────────────────────────────
    // PATCH DELTA V7
    // Override GlAccount.connect() and GAPI
    // ────────────────────────────────────────

    function patchDelta() {
        var gl = window.GlAccount;
        if (!gl || gl._lf_patched) return false;
        gl._lf_patched = true;

        LOG('Patching GlAccount.connect()...');

        // Save original connect
        var origConnect = gl.connect.bind(gl);

        // Override connect() — this is what clickButton('Google') calls
        gl.connect = function () {
            LOG('GlAccount.connect() intercepted → using GIS');
            gl.memory.enabled = true;

            doGISLogin(function (idToken) {
                // Build fake GAPI user object that readUser() expects
                var fakeUser = buildFakeGAPIUser(idToken);

                // We need GAPI.isSignedIn.get() to return true
                // for readUser() to proceed (line 57 of Accs.js)
                ensureGAPISignedIn();

                // Call Delta's own readUser — this does everything:
                // sets token, user info, emits 'login' + 'user' events
                gl.readUser(fakeUser);

                // Remove GIS container if present
                var gis = document.getElementById('gis-container');
                if (gis) gis.remove();
            });
        };

        // Also override start() which calls connect() when memory.enabled
        var origStart = gl.start.bind(gl);
        gl.start = function () {
            LOG('GlAccount.start() called');
            if (gl.memory.enabled) gl.connect();
        };

        LOG('✅ GlAccount patched!');
        return true;
    }

    // Make GAPI.isSignedIn.get() return true
    // GlAccount.readUser checks this at line 57
    function ensureGAPISignedIn() {
        // If GAPI exists, patch isSignedIn
        try {
            var auth2 = window.gapi && window.gapi.auth2 && window.gapi.auth2.getAuthInstance();
            if (auth2 && auth2.isSignedIn) {
                var origGet = auth2.isSignedIn.get;
                auth2.isSignedIn.get = function () { return true; };
                LOG('GAPI.isSignedIn patched to return true');
            }
        } catch (e) { }

        // If GAPI doesn't exist yet, the variable GAPI in Accs.js is module-scoped
        // We can't access it directly. But readUser checks it:
        //   if (!data || !GAPI || !this.memory.enabled) return;
        //   if (GAPI.isSignedIn.get()) { ... }
        //
        // Since GAPI is module-scoped, we need to either:
        // 1. Wait for GAPI to init (via gapiAsyncInit) and then patch
        // 2. Or bypass readUser entirely by calling the token directly
        //
        // Let's also set up a direct fallback:
    }

    // Direct token injection — bypasses readUser entirely
    // Used when GAPI module-scoped variable isn't accessible
    function directTokenInject(idToken) {
        var gl = window.GlAccount;
        if (!gl) return false;

        var payload = {};
        try { payload = JSON.parse(atob(idToken.split('.')[1])); } catch (e) { }

        gl.token = idToken;
        gl.state.expiration = (payload.exp || 0) * 1000;
        gl.user.picture = payload.picture || '';
        gl.user.first_name = payload.given_name || '';
        gl.user.last_name = payload.family_name || '';
        gl.user.id = payload.sub || '';
        gl.emit('user', gl);
        gl.emit('login', gl);
        LOG('✅ Direct token injection + events emitted!');
        return true;
    }

    // Auto-login on page load if user was previously logged in
    function autoLogin() {
        var gl = window.GlAccount;
        if (!gl) return;

        // Only auto-login if Delta remembers the user wanted Google
        if (gl.memory && gl.memory.enabled) {
            LOG('Auto-login: memory.enabled is true, starting GIS...');
            gl.connect(); // This now uses our patched version
        }
    }

    // ────────────────────────────────────────
    // PATCH GAPI — prevent the broken popup
    // Delta's gapiAsyncInit loads GAPI and sets
    // GAPI = gapi.auth2.init(...)
    // We intercept this to prevent popup attempts
    // ────────────────────────────────────────

    function patchGAPI() {
        if (!window.gapi || window.gapi._lf) return;
        window.gapi._lf = true;

        // Hook gapi.auth2.init to patch the instance
        var origLoad = window.gapi.load;
        window.gapi.load = function (libs, cb) {
            return origLoad.call(this, libs, function () {
                if (typeof cb === 'function') cb();
                if (typeof libs === 'string' && libs.indexOf('auth2') >= 0) {
                    setTimeout(patchAuth2Instance, 100);
                }
            });
        };

        // If auth2 already loaded
        if (window.gapi.auth2) {
            patchAuth2Instance();
        }

        LOG('gapi.load hooked.');
    }

    function patchAuth2Instance() {
        try {
            var inst = window.gapi.auth2.getAuthInstance();
            if (!inst || inst._lf) return;
            inst._lf = true;

            // Patch signIn to not open popup
            inst.signIn = function () {
                LOG('GAPI.signIn() blocked — GlAccount.connect() handles login via GIS');
                return Promise.resolve();
            };

            // Make isSignedIn.get() return true when we have a token
            var origIsSignedIn = inst.isSignedIn.get;
            inst.isSignedIn.get = function () {
                if (window.GlAccount && window.GlAccount.token) return true;
                return origIsSignedIn.call(inst.isSignedIn);
            };

            // Patch signOut to be a no-op (Delta handles logout internally)
            inst.signOut = function () {
                LOG('GAPI.signOut() intercepted');
                return Promise.resolve();
            };

            LOG('✅ GAPI auth2 instance patched.');
        } catch (e) {
            LOG('auth2 not ready yet');
        }
    }

    // ── ALSO: Override GlAccount.readUser to work without
    //    the module-scoped GAPI variable ──
    function patchReadUser() {
        var gl = window.GlAccount;
        if (!gl || gl._lf_readUser) return;
        gl._lf_readUser = true;

        var origReadUser = gl.readUser.bind(gl);

        gl.readUser = function (data) {
            if (!data || !gl.memory.enabled) return;

            // Try original first (works if GAPI is initialized)
            try {
                // Check if GAPI module var exists and isSignedIn
                var auth2 = window.gapi && window.gapi.auth2 && window.gapi.auth2.getAuthInstance();
                if (auth2 && auth2.isSignedIn.get()) {
                    origReadUser(data);
                    return;
                }
            } catch (e) { }

            // Fallback: do what readUser does manually
            // (lines 57-72 of Accs.js)
            try {
                var authResponse = data.getAuthResponse();
                var basicProfile = data.getBasicProfile();
                gl.state.expiration = authResponse.expires_at;
                gl.token = authResponse.id_token;
                gl.user.picture = basicProfile.getImageUrl();
                gl.user.first_name = basicProfile.getGivenName();
                gl.user.last_name = basicProfile.getFamilyName();
                gl.user.id = basicProfile.getId();
                gl.emit('user', gl);
                gl.emit('login', gl);
                LOG('✅ readUser fallback succeeded!');
                if (typeof globalThis.umami?.track === 'function') {
                    globalThis.umami.track('login', { provider: 'google' });
                }
            } catch (e) {
                LOG('readUser fallback error:', e);
                // Last resort: direct injection
                if (data.getAuthResponse) {
                    directTokenInject(data.getAuthResponse().id_token);
                }
            }
        };

        LOG('✅ readUser patched to work without module-scoped GAPI.');
    }

    // ── Also deliver to Legend Mod if present ──
    function deliverToLM(idToken) {
        if (window.master && typeof window.master.doLoginWithGPlus === 'function') {
            window.master.doLoginWithGPlus(idToken);
            LOG('✅ LM: master.doLoginWithGPlus() called!');
        }
    }

    // ────────────────────────────────────────
    // BOOT
    // ────────────────────────────────────────

    function boot() {
        var bodyCheck = setInterval(function () {
            if (!document.body) return;
            clearInterval(bodyCheck);

            // Load GIS early
            loadGIS(function () { LOG('GIS ready.'); });

            // Watch for GlAccount to appear and patch it
            var deltaCheck = setInterval(function () {
                if (window.GlAccount) {
                    if (patchDelta()) {
                        patchReadUser();
                        clearInterval(deltaCheck);
                        // Auto-login after small delay
                        setTimeout(autoLogin, 1000);
                    }
                }
            }, 200);
            setTimeout(function () { clearInterval(deltaCheck); }, 60000);

            // Watch for GAPI to appear and patch it
            var gapiCheck = setInterval(function () {
                if (window.gapi) {
                    patchGAPI();
                    if (window.gapi.auth2) patchAuth2Instance();
                }
            }, 200);
            setTimeout(function () { clearInterval(gapiCheck); }, 60000);

        }, 50);
        setTimeout(function () { clearInterval(bodyCheck); }, 30000);
    }

    boot();
})();
