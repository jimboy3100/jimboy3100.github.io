// ==UserScript==
// @name         Universal Agar.io Google Login Fixer
// @namespace    http://jimboy3100.github.io/
// @version      1.2
// @description  Fixes Google Login 400 errors for Agar.io mods by bridging login through the root domain.
// @author       Jimboy3100
// @match        https://agar.io/*
// @match        https://deltio.pages.dev/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

/* 
---------------------------------------------------------------------------------------------------
TECHNICAL DIAGNOSIS: Why the "Google 400 Bad Request" occurs in mods (like Delta):

1. ORIGIN MISMATCH: 
   Google OAuth requirements changed. It now strictly checks the "Redirect URI". 
   If a mod (like Delta) is running on a custom domain (deltio.pages.dev) or a 
   sub-path (agar.io/delta), Google rejects the login request because that URL 
   isn't in its "Accepted" list for Agar.io.

2. MALFORMED REQUESTS:
   Some mods use outdated login libraries that send parameters Google no longer accepts.
   Even on the main domain, if the script sends a "bad" request, you get a 400 error.

THE FIX:
   This script bypasses the mod's broken login logic. When you click "Login", 
   it opens a clean window on the root domain (https://agar.io/). 
   It then clicks the OFFICIAL Agar.io login button for you. 
   Once you are logged into official Agar.io, it syncs your account to the mod.
---------------------------------------------------------------------------------------------------
-*/

(function () {
    'use strict';

    const ORIGIN = "https://agar.io";
    const IS_ROOT = location.host === "agar.io" && (location.pathname === "/" || location.pathname === "");

    // 1. BRIDGE LOGIC: Running on root domain to handle the actual login
    if (IS_ROOT) {
        if (window.location.search.includes('fixLogin=google')) {
            console.log('[Login Fixer] Bridge Active. Waiting for login success...');

            // Clear any old tokens to ensure a fresh login
            // localStorage.removeItem('google_access_token');
            // localStorage.removeItem('access_token');

            // Check for login success in intervals
            const checkLogin = setInterval(() => {
                const token = localStorage.getItem('google_access_token') || localStorage.getItem('access_token');
                if (token) {
                    console.log('[Login Fixer] Login detected! Closing bridge...');
                    clearInterval(checkLogin);
                    setTimeout(() => window.close(), 1000);
                }
            }, 500);

            // Trigger the official login button
            const triggerOfficialLogin = () => {
                // Try various official button selectors
                const loginBtn = document.querySelector('button[onclick*="google"], .g-signin2, #google-login, button i.fa-google-plus, .btn-login-google');
                if (loginBtn) {
                    console.log('[Login Fixer] Triggering Official Google Login...');
                    loginBtn.click();
                } else {
                    console.log('[Login Fixer] Searching for login button...');
                }
            };

            // Keep trying to click until it works or window closes
            const clickLoop = setInterval(triggerOfficialLogin, 1000);
            setTimeout(() => clearInterval(clickLoop), 10000);
        }
        return;
    }

    // 2. FIXER LOGIC: Running on sub-paths or external domains
    console.log('[Login Fixer] Active on path:', location.href);

    function triggerFixedLogin() {
        console.log('[Login Fixer] Opening login bridge on root domain...');
        const bridgeUrl = ORIGIN + "/?fixLogin=google" + location.hash;

        // Open a popup to the root domain to handle login
        const width = 550, height = 650;
        const left = (window.screen.width / 2) - (width / 2);
        const top = (window.screen.height / 2) - (height / 2);

        const bridge = window.open(bridgeUrl, 'AgarLoginFixer', `width=${width},height=${height},left=${left},top=${top}`);

        if (!bridge) {
            alert("Login Fixer: Popup blocked! Please allow popups for this site to fix Google Login.");
            return;
        }

        // Wait for bridge to close or token to appear
        const monitorToken = setInterval(() => {
            const token = localStorage.getItem('google_access_token') || localStorage.getItem('access_token');
            if (token) {
                console.log('[Login Fixer] Token synced! Refreshing to apply...');
                clearInterval(monitorToken);
                location.reload();
            }
            if (bridge && bridge.closed) {
                clearInterval(monitorToken);
                console.log('[Login Fixer] Bridge closed.');
            }
        }, 1000);
    }

    // Intercept common login button clicks
    document.addEventListener('mousedown', (e) => {
        const target = e.target.closest('button, div, a, i');
        if (!target) return;

        // Common mod login button identifiers
        const text = (target.innerText || "").toLowerCase();
        const classes = (target.className || "").toLowerCase();
        const id = (target.id || "").toLowerCase();
        const parentClasses = (target.parentElement ? target.parentElement.className : "").toLowerCase();

        const isGoogleBtn = text.includes('google') ||
            id.includes('google') ||
            classes.includes('google') ||
            classes.includes('g-signin') ||
            classes.includes('fa-google') ||
            parentClasses.includes('btn-login-google');

        if (isGoogleBtn) {
            console.log('[Login Fixer] Google Login click intercepted!');
            e.preventDefault();
            e.stopPropagation();
            triggerFixedLogin();
        }
    }, true);

    // Add a manual fix button to the UI if nothing is detected
    window.addEventListener('load', () => {
        setTimeout(() => {
            const container = document.querySelector('#main-menu, .menu, .agario-panel');
            if (container) {
                const fixIcon = document.createElement('div');
                fixIcon.innerHTML = '⚙️ Fix Login';
                fixIcon.style = "position:absolute; top:5px; right:5px; background:rgba(0,0,0,0.7); color:#00ffcc; padding:5px 10px; border-radius:5px; font-size:12px; cursor:pointer; z-index:9999; border:1px solid #00ffcc;";
                fixIcon.onclick = triggerFixedLogin;
                container.appendChild(fixIcon);
            }
        }, 3000);
    });

})();
