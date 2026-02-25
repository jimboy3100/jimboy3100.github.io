// ==UserScript==
// @name         Universal Agar.io Google Login Fixer
// @namespace    http://jimboy3100.github.io/
// @version      1.1
// @description  Fixes Google Login 400 errors for Agar.io mods by bridging login through the root domain.
// @author       Jimboy3100
// @match        https://agar.io/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

/* 
---------------------------------------------------------------------------------------------------
TECHNICAL DIAGNOSIS: Why the "Google 400 Bad Request" occurs in mods (like Delta):

1. ORIGIN MISMATCH: 
   Google's OAuth 2.0 security protocol is extremely strict. It checks the "Origin" of the 
   login request. The official Agar.io app is only authorized to login from "https://agar.io/".
   If a mod moves the user to a sub-path (like agar.io/delta or agar.io/legendmod) and 
   tries to login from there, Google sees the path mismatch and kills the request with a 400 error.

2. REGISTERED REDIRECT URIs:
   Agar.io has specific "Authorized redirect URIs" saved in their Google Developer Console.
   If a script tries to return the user to a path that isn't on that list, Google blocks it.

3. RECENT SECURITY UPDATES:
   Google recently restricted "cross-origin" and "iframe-based" logins even further. 
   Mods that worked for years by "masking" the URL or using helper frames are now failing 
   because Google's servers now detect and block these unauthorized login environments.

THE FIX:
   This script fixes the issue by forcing the login to occur on the absolute ROOT domain 
   (https://agar.io/) which Google trusts. Once the login is successful on the root, 
   this script captures the token and "bridges" it back to the mod path automatically.
---------------------------------------------------------------------------------------------------
-*/

(function () {
    'use strict';

    const ORIGIN = "https://agar.io";
    const IS_ROOT = location.pathname === "/" || location.pathname === "";

    // 1. BRIDGE LOGIC: Running on root domain to handle the actual login
    if (IS_ROOT) {
        if (window.location.search.includes('fixLogin=google')) {
            console.log('[Login Fixer] Bridge Active. Waiting for login success...');

            // Check for login success in intervals
            const checkLogin = setInterval(() => {
                const token = localStorage.getItem('google_access_token') || localStorage.getItem('access_token');
                if (token) {
                    console.log('[Login Fixer] Login detected! Closing bridge in 2s...');
                    clearInterval(checkLogin);
                    setTimeout(() => window.close(), 2000);
                }
            }, 1000);

            // Auto-click the login button if it's there
            setTimeout(() => {
                const loginBtn = document.querySelector('button[onclick*="google"], .g-signin2, #google-login');
                if (loginBtn) {
                    console.log('[Login Fixer] Triggering Google Login...');
                    loginBtn.click();
                }
            }, 1000);
        }
        return;
    }

    // 2. FIXER LOGIC: Running on sub-paths (like /legendmod or /delta)
    console.log('[Login Fixer] Monitoring for login attempts on path:', location.pathname);

    function triggerFixedLogin() {
        console.log('[Login Fixer] Opening login bridge on root domain...');
        const bridgeUrl = ORIGIN + "/?fixLogin=google" + location.hash;

        // Open a popup to the root domain to handle login
        const width = 500, height = 600;
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
            if (bridge.closed) {
                clearInterval(monitorToken);
                console.log('[Login Fixer] Bridge closed.');
            }
        }, 1000);
    }

    // Intercept common login button clicks
    document.addEventListener('click', (e) => {
        const target = e.target.closest('button, div, a');
        if (!target) return;

        // Check if this looks like a Google login button
        const text = (target.innerText || "").toLowerCase();
        const classes = target.className || "";
        const id = target.id || "";

        if (text.includes('google') || id.includes('google') || classes.includes('g-signin')) {
            console.log('[Login Fixer] Intercepted Google Login click.');
            e.preventDefault();
            e.stopPropagation();
            triggerFixedLogin();
        }
    }, true);

})();
