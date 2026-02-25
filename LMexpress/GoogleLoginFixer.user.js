// ==UserScript==
// @name         Universal Agar.io Google Login Fixer
// @namespace    http://jimboy3100.github.io/
// @version      6.6
// @description  Fixes Google Login for Delta v7. Uses GIS. Deletes Delta's broken Google button, adds new one.
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

    LOG('v6.6 starting...');

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
            removeGISContainer();
            // Mark our new button as active
            var myBtn = document.getElementById('lf-glogin');
            if (myBtn) myBtn.style.outline = '2px solid #0f0';
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
                showGISButton();
            } else if (notification.isSkippedMoment()) {
                LOG('One Tap skipped:', notification.getSkippedReason());
                showGISButton();
            }
        });
    }

    function showGISButton() {
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
        Object.assign(label.style, { color: '#ccc', fontSize: '12px', fontFamily: 'Ubuntu, sans-serif' });
        var btnDiv = document.createElement('div');
        btnDiv.id = 'gis-btn';
        var close = document.createElement('div');
        close.textContent = '✕';
        Object.assign(close.style, { position: 'absolute', top: '4px', right: '8px', color: '#666', cursor: 'pointer', fontSize: '12px' });
        close.onclick = function () { container.remove(); };
        container.appendChild(close);
        container.appendChild(label);
        container.appendChild(btnDiv);
        document.body.appendChild(container);
        google.accounts.id.renderButton(btnDiv, { theme: 'filled_blue', size: 'large', shape: 'rectangular', text: 'signin_with', width: 280 });
        LOG('GIS sign-in button shown.');
    }

    function removeGISContainer() {
        var el = document.getElementById('gis-container');
        if (el) el.remove();
    }

    // ────────────────────────────────────────
    // DELETE DELTA'S GOOGLE BUTTON
    // AND INSERT OUR NEW ONE IN ITS PLACE
    // ────────────────────────────────────────

    var _btnDone = false;

    function swapGoogleButton() {
        if (_btnDone) return;

        // Find all fa-google icons in the page
        var icons = document.querySelectorAll('.fa-google');
        for (var i = 0; i < icons.length; i++) {
            // Skip our own button if it exists
            var myExisting = document.getElementById('lf-glogin');
            if (myExisting && myExisting.contains(icons[i])) continue;

            // Walk up to find the wrapper div (flex flex-col w-1/2 or gy-1 col)
            var wrapper = icons[i].parentElement;
            while (wrapper) {
                // Check if this is the column wrapper
                if (wrapper.parentElement && wrapper.parentElement.id === 'realms') break;
                if (wrapper.className && (
                    wrapper.className.indexOf('w-1/2') >= 0 ||
                    wrapper.className.indexOf('gy-1') >= 0 ||
                    wrapper.className.indexOf('col') >= 0
                )) break;
                wrapper = wrapper.parentElement;
            }

            if (!wrapper) {
                // Fallback: just use the btn-colored parent
                wrapper = icons[i];
                while (wrapper && (!wrapper.classList || !wrapper.classList.contains('btn-colored'))) {
                    wrapper = wrapper.parentElement;
                }
            }

            if (!wrapper) continue;

            LOG('Found Delta Google button wrapper! Deleting and replacing...');

            // Create our new button — same visual look, completely new element
            var newBtn = document.createElement('div');
            newBtn.id = 'lf-glogin';
            newBtn.style.cssText = 'cursor: pointer;';
            // Copy the same wrapper class so it takes same space
            newBtn.className = wrapper.className;

            // Inner HTML — looks like Delta's button
            newBtn.innerHTML =
                '<div class="btn btn-colored size-small" style="--data-background:#DB4437">' +
                '<div class="btn-layer" role="tooltip" data-microtip-position="bottom">' +
                '<div class="tty">Google</div>' +
                '<div class="btn-logo"><div class="btn-icon fab fa-google"></div></div>' +
                '</div>' +
                '</div>';

            // Click → trigger GIS
            newBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                LOG('Our Google button clicked → GIS');
                initGIS();
            });

            // Replace: delete old, insert new in its place
            var parent = wrapper.parentElement;
            parent.replaceChild(newBtn, wrapper);

            _btnDone = true;
            LOG('✅ Old Google button deleted, new one inserted!');
            return;
        }
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
            auth2.attachClickHandler = function (el, opts, onSuccess, onFail) {
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

            // 1. Load GIS and show One Tap
            loadGIS(function () { initGIS(); });

            // 2. Watch for Delta's Google button with MutationObserver
            var observer = new MutationObserver(function () {
                if (_btnDone) { observer.disconnect(); return; }
                swapGoogleButton();
            });
            observer.observe(document.documentElement, { childList: true, subtree: true });
            // Also try immediately and on interval as fallback
            swapGoogleButton();
            var btnCheck = setInterval(function () {
                if (_btnDone) { clearInterval(btnCheck); return; }
                swapGoogleButton();
            }, 500);
            setTimeout(function () { clearInterval(btnCheck); observer.disconnect(); }, 120000);

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
