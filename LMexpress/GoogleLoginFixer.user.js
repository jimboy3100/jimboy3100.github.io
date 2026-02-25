// ==UserScript==
// @name         Universal Agar.io Google Login Fixer
// @namespace    http://jimboy3100.github.io/
// @version      1.3
// @description  Fixes Google Login 400 errors for Agar.io mods by bridging login through the root domain.
// @author       Jimboy3100
// @match        https://agar.io/*
// @match        https://deltio.pages.dev/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

/* 
---------------------------------------------------------------------------------------------------
TECHNICAL DIAGNOSIS & REPAIR (v1.3):

1. WHY IT FAILED (v1.2):
   Browsers prevent "deltio.pages.dev" from reading "agar.io" cookies or localStorage. 
   Even if the login was successful in the bridge window, the mod couldn't "see" it.

2. CROSS-DOMAIN Opener Policy (COOP):
   Modern Chrome blocks windows from talking to each other if they are from different domains. 
   This is why we saw "window.closed" and "Auth popup declined" errors.

3. THE v1.3 SOLUTION (TOKEN SYNCHRONIZATION): 
   - When you click Login on "deltio.pages.dev", we open "agar.io" and tell it who asked for the login.
   - You log in on official Agar.io.
   - Once the token exists on the official site, our script REDIRECTS that window back to your mod URL 
     with the token attached: "deltio.pages.dev/?syncToken=XXX".
   - Now that the bridge is on the SAME domain as your mod, the scripts can finally talk and 
     save the token.

This bypasses all Google 400 errors and browser security blocks.
---------------------------------------------------------------------------------------------------
-*/

(function () {
    'use strict';

    const ORIGIN = "https://agar.io";
    const MOD_HOSTS = ["deltio.pages.dev", "agar.io"]; // Approved mod domains

    const urlParams = new URLSearchParams(window.location.search);
    const syncToken = urlParams.get('syncToken');
    const fixLogin = urlParams.get('fixLogin');
    const requester = urlParams.get('requester');

    // --- PHASE 1: TOKEN RECEPTION (Running on the Mod's domain) ---
    if (syncToken) {
        console.log('[Login Fixer] Receiving synced token...');
        localStorage.setItem('google_access_token', syncToken);
        localStorage.setItem('access_token', syncToken);

        // Remove the token from URL and refresh to log in
        const cleanUrl = location.href.split('?')[0] + location.hash;
        console.log('[Login Fixer] Token saved! Logging in...');

        // If this is the bridge window, it will close. If it's the main window, it will reload.
        if (window.name === 'AgarLoginFixer') {
            window.close();
        } else {
            location.href = cleanUrl;
        }
        return;
    }

    // --- PHASE 2: LOGIN BRIDGE (Running on Official agar.io) ---
    if (location.host === "agar.io" && fixLogin === 'google') {
        console.log('[Login Fixer] Bridge Active for requester:', requester);

        const checkTokenAndRedirect = setInterval(() => {
            const token = localStorage.getItem('google_access_token') || localStorage.getItem('access_token');
            if (token) {
                console.log('[Login Fixer] Login Success! Synchronizing token back to requester...');
                clearInterval(checkTokenAndRedirect);

                // Construct the sync URL back to the requester mod
                const syncUrl = `https://${requester}/?syncToken=${token}${location.hash}`;
                location.href = syncUrl;
            }
        }, 1000);

        // Auto-trigger official button
        const triggerBtn = () => {
            const btn = document.querySelector('button[onclick*="google"], .g-signin2, #google-login, button i.fa-google-plus, .btn-login-google');
            if (btn) btn.click();
        };
        setInterval(triggerBtn, 1500);
        return;
    }

    // --- PHASE 3: INTERCEPTION (Running on Mod UI) ---
    if (location.pathname.startsWith("/legendmod") || location.host === "deltio.pages.dev") {
        console.log('[Login Fixer] Guarding Login UI...');

        function startBridge() {
            const requesterHost = location.host; // e.g. "deltio.pages.dev"
            const bridgeUrl = `${ORIGIN}/?fixLogin=google&requester=${requesterHost}${location.hash}`;

            const width = 550, height = 650;
            const left = (window.screen.width / 2) - (width / 2);
            const top = (window.screen.height / 2) - (height / 2);

            console.log('[Login Fixer] Opening Bridge...');
            window.open(bridgeUrl, 'AgarLoginFixer', `width=${width},height=${height},left=${left},top=${top}`);
        }

        // Catch the login clicks
        document.addEventListener('mousedown', (e) => {
            const target = e.target.closest('button, div, a, i');
            if (!target) return;

            const text = (target.innerText || "").toLowerCase();
            const classes = (target.className || "").toLowerCase();
            const id = (target.id || "").toLowerCase();

            if (text.includes('google') || id.includes('google') || classes.includes('google') || classes.includes('fa-google')) {
                console.log('[Login Fixer] Redirecting login attempt to Bridge...');
                e.preventDefault();
                e.stopPropagation();
                startBridge();
            }
        }, true);

        // Add Manual Fix UI
        window.addEventListener('load', () => {
            setTimeout(() => {
                const menu = document.querySelector('#main-menu, .menu, .agario-panel');
                if (menu && !document.getElementById('fixer-btn')) {
                    const btn = document.createElement('div');
                    btn.id = 'fixer-btn';
                    btn.innerHTML = '🛡️ Fix Google';
                    btn.style = "position:absolute; top:10px; right:10px; background:#d32f2f; color:white; padding:6px 12px; border-radius:4px; font-weight:bold; cursor:pointer; z-index:10001; border:1px solid white; font-size:13px; box-shadow:0 2px 5px rgba(0,0,0,0.5);";
                    btn.onclick = startBridge;
                    menu.appendChild(btn);
                }
            }, 3000);
        });
    }

})();
