// ==UserScript==
// @name         Universal Agar.io Google Login Fixer
// @namespace    http://jimboy3100.github.io/
// @version      2.0
// @description  Fixes Google Login 400 errors for Agar.io mods by injecting Legend Mod's working GAPI auth flow.
// @author       Jimboy3100
// @match        https://agar.io/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

/* 
---------------------------------------------------------------------------------------------------
TECHNICAL DIAGNOSIS & REPAIR (v2.0 - THE REAL FIX):

HOW LEGEND MOD'S GOOGLE LOGIN WORKS (from ogario.v4.master.js):
  1. Loads Google's GAPI library: apis.google.com/js/client:platform.js
  2. Calls gapi.auth2.init() with:
     - client_id: "686981379285-oroivr8u2ag1dtm3ntcs6vi05i3cpv0j.apps.googleusercontent.com"
     - cookie_policy: "single_host_origin"
     - scope: "profile"
     - app_package_name: "com.miniclip.agar.io"
  3. Attaches to the Google button via api.attachClickHandler()
  4. Gets id_token from getAuthResponse() on success
  5. Calls master.doLoginWithGPlus(idToken) to send it to the game server

WHY DELTA MOD BREAKS:
  Delta Mod uses a different/broken Google login implementation.
  This script overrides Delta's broken flow with Legend Mod's working one.
---------------------------------------------------------------------------------------------------
*/

(function () {
    'use strict';

    // Only run on agar.io (Delta runs as a userscript on agar.io)
    if (location.host !== "agar.io") return;

    // The official Agar.io/Miniclip Google OAuth Client ID
    const GPLUS_CLIENT_ID = "686981379285-oroivr8u2ag1dtm3ntcs6vi05i3cpv0j.apps.googleusercontent.com";

    console.log('[Login Fixer v2.0] Initializing Legend Mod auth bridge...');

    // Wait for page to be ready (Delta rewrites the DOM)
    function waitForReady(callback) {
        const check = setInterval(() => {
            // Wait for either Delta's Google button or gapi to be available
            if (document.readyState === 'complete' || document.querySelector('#gplusLogin, .btn-gplus, [data-provider="google"]')) {
                clearInterval(check);
                callback();
            }
        }, 500);
        // Safety timeout
        setTimeout(() => clearInterval(check), 30000);
    }

    // STEP 1: Ensure the GAPI library is loaded
    function loadGAPI(callback) {
        if (window.gapi && window.gapi.auth2) {
            console.log('[Login Fixer] GAPI already loaded.');
            callback();
            return;
        }

        console.log('[Login Fixer] Loading GAPI library from Google...');

        // Define the callback before loading the script
        window.loginFixerGapiLoaded = function () {
            console.log('[Login Fixer] GAPI library loaded successfully.');
            callback();
        };

        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/client:platform.js?onload=loginFixerGapiLoaded';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
    }

    // STEP 2: Initialize gapi.auth2 with Legend Mod's exact configuration
    function initAuth(callback) {
        if (window.gapi.auth2 && window.gapi.auth2.getAuthInstance()) {
            console.log('[Login Fixer] Auth2 already initialized.');
            callback(window.gapi.auth2.getAuthInstance());
            return;
        }

        window.gapi.load('auth2', function () {
            const auth2 = window.gapi.auth2.init({
                client_id: GPLUS_CLIENT_ID,
                cookie_policy: "single_host_origin",
                scope: "profile",
                app_package_name: "com.miniclip.agar.io"
            });

            auth2.then(function () {
                console.log('[Login Fixer] Google Auth2 initialized with Legend Mod config. ✅');
                callback(auth2);
            }, function (err) {
                console.error('[Login Fixer] Auth2 init failed:', err);
            });
        });
    }

    // STEP 3: Handle successful login (same as Legend Mod's "transform" function)
    function handleLoginSuccess(googleUser) {
        const idToken = googleUser.getAuthResponse().id_token;
        const profile = googleUser.getBasicProfile();
        const imageUrl = profile ? profile.getImageUrl() : null;

        console.log('[Login Fixer] Google Login SUCCESS! id_token obtained. ✅');

        // Feed the token to the game server (same as Legend Mod)
        if (window.master && window.master.doLoginWithGPlus) {
            window.master.doLoginWithGPlus(idToken);
            window.master.context = "google";
            window.master.accessToken = idToken;
            console.log('[Login Fixer] Token sent to game server via master.doLoginWithGPlus()');
        }

        // Update the UI (same as Legend Mod)
        if (window.jQuery) {
            jQuery('#helloContainer').attr('data-logged-in', '1');
            if (imageUrl) {
                jQuery('.agario-profile-picture').attr('src', imageUrl);
            }
        }

        window.loggedIn = true;

        // Also store token in case other scripts need it
        try {
            localStorage.setItem('google_access_token', idToken);
            localStorage.setItem('access_token', idToken);
        } catch (e) { }
    }

    // STEP 4: Perform the sign-in
    function doGoogleSignIn(auth2) {
        console.log('[Login Fixer] Opening Google sign-in popup...');
        auth2.signIn().then(function (googleUser) {
            handleLoginSuccess(googleUser);
        }, function (err) {
            if (err.error === 'popup_closed_by_user') {
                console.log('[Login Fixer] User closed the popup.');
            } else {
                console.error('[Login Fixer] Sign-in failed:', err);
            }
        });
    }

    // STEP 5: Hook into the page
    waitForReady(function () {
        console.log('[Login Fixer] Page ready. Setting up auth hooks...');

        loadGAPI(function () {
            initAuth(function (auth2) {

                // A. Intercept window.open calls to Google OAuth (block Delta's broken popup)
                const originalOpen = window.open;
                window.open = function (url, name, features) {
                    if (url && url.toString().includes('google.com/o/oauth2')) {
                        console.log('[Login Fixer] Intercepted broken OAuth popup. Using GAPI instead.');
                        doGoogleSignIn(auth2);
                        return null;
                    }
                    return originalOpen.apply(this, arguments);
                };

                // B. Attach to existing Google login buttons
                const googleBtns = document.querySelectorAll('#gplusLogin, .btn-gplus, [data-provider="google"]');
                googleBtns.forEach(btn => {
                    // Remove old handlers by cloning
                    const newBtn = btn.cloneNode(true);
                    btn.parentNode.replaceChild(newBtn, btn);

                    newBtn.addEventListener('click', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('[Login Fixer] Google button clicked. Using Legend Mod auth flow.');
                        doGoogleSignIn(auth2);
                    });
                });

                // C. Capture any click on Google-related elements (catch-all)
                document.addEventListener('click', function (e) {
                    const target = e.target.closest('button, div, a, i, span');
                    if (!target) return;

                    const text = (target.innerText || "").toLowerCase();
                    const classes = (target.className || "").toLowerCase();
                    const id = (target.id || "").toLowerCase();
                    const parentClasses = (target.parentElement && target.parentElement.className || "").toLowerCase();

                    if ((text.includes('google') || id.includes('google') || id.includes('gplus') ||
                        classes.includes('google') || classes.includes('gplus') || classes.includes('fa-google') ||
                        parentClasses.includes('gplus') || parentClasses.includes('google'))) {

                        // Don't intercept if we didn't set up auth2 somehow
                        if (auth2) {
                            console.log('[Login Fixer] Google element clicked. Triggering GAPI sign-in.');
                            e.preventDefault();
                            e.stopPropagation();
                            doGoogleSignIn(auth2);
                        }
                    }
                }, true);

                // D. Check if already signed in (auto-login)
                if (auth2.isSignedIn.get()) {
                    console.log('[Login Fixer] User already signed in. Auto-applying token...');
                    handleLoginSuccess(auth2.currentUser.get());
                }

                // E. Listen for future sign-in changes
                auth2.currentUser.listen(function (googleUser) {
                    if (auth2.isSignedIn.get()) {
                        handleLoginSuccess(googleUser);
                    }
                });

                console.log('[Login Fixer] All hooks installed. Google login is now powered by Legend Mod auth. 🛡️✅');
            });
        });
    });

})();
