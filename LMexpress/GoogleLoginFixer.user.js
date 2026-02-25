// ==UserScript==
// @name         Universal Agar.io Google Login Fixer
// @namespace    http://jimboy3100.github.io/
// @version      1.5
// @description  Fixes Google Login 400 errors for Agar.io mods by fixing CSP and bridging login through the root domain.
// @author       Jimboy3100
// @match        https://agar.io/*
// @match        https://deltio.pages.dev/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

/* 
---------------------------------------------------------------------------------------------------
TECHNICAL DIAGNOSIS & REPAIR (v1.5):

1. THE CSP PROBLEM:
   Delta Mod's page sets a Content Security Policy that only allows:
     script-src 'unsafe-inline' 'unsafe-eval' blob: data:
   This BLOCKS Google's login SDK from loading because it lives on:
     https://www.gstatic.com/_/mss/boq-identity/...
     https://accounts.google.com/...
   Without these scripts, Google Login cannot function at all.

2. THE FIX - CSP NEUTRALIZER:
   This script runs at document-start (before anything else loads) and:
   a) Removes all <meta> CSP tags from the page
   b) Watches for dynamically injected CSP tags and removes them instantly
   c) Allows Google's identity scripts from gstatic.com and accounts.google.com to load

3. THE BRIDGE (unchanged from v1.4):
   If the login still fails due to redirect_uri mismatch, the bridge opens 
   a clean agar.io window for authentication and syncs the token back.
---------------------------------------------------------------------------------------------------
-*/

(function () {
    'use strict';

    // =====================================================================
    // PHASE 0: CSP NEUTRALIZER (Runs immediately at document-start)
    // This MUST run before any other code to allow Google scripts to load.
    // =====================================================================

    function stripCSP() {
        // Remove all existing CSP meta tags
        const cspTags = document.querySelectorAll('meta[http-equiv="Content-Security-Policy"], meta[http-equiv="Content-Security-Policy-Report-Only"]');
        cspTags.forEach(tag => {
            console.log('[Login Fixer] Removed CSP meta tag:', tag.getAttribute('content'));
            tag.remove();
        });
    }

    // Run immediately
    stripCSP();

    // Watch for dynamically added CSP meta tags and remove them instantly
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === 1) { // Element node
                    // Check if the added node itself is a CSP meta tag
                    if (node.tagName === 'META' &&
                        (node.httpEquiv === 'Content-Security-Policy' || node.httpEquiv === 'Content-Security-Policy-Report-Only')) {
                        console.log('[Login Fixer] Blocked dynamic CSP injection:', node.content);
                        node.remove();
                    }
                    // Check children (e.g. if a <head> fragment is inserted)
                    const innerCSP = node.querySelectorAll ? node.querySelectorAll('meta[http-equiv="Content-Security-Policy"], meta[http-equiv="Content-Security-Policy-Report-Only"]') : [];
                    innerCSP.forEach(tag => {
                        console.log('[Login Fixer] Blocked nested CSP injection:', tag.content);
                        tag.remove();
                    });
                }
            }
        }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Stop observing after 10 seconds (CSP tags are always added early)
    setTimeout(() => observer.disconnect(), 10000);

    console.log('[Login Fixer] CSP Neutralizer Active.');

    // =====================================================================
    // PHASE 1-3: LOGIN BRIDGE LOGIC (same as v1.4)
    // =====================================================================

    const ORIGIN = "https://agar.io";
    const urlParams = new URLSearchParams(window.location.search);
    const syncToken = urlParams.get('syncToken');
    const fixLogin = urlParams.get('fixLogin');
    const requester = urlParams.get('requester');

    // --- PHASE 1: TOKEN RECEPTION (Running on Mod Domain) ---
    if (syncToken) {
        console.log('[Login Fixer] Receiving secure token...');
        localStorage.setItem('google_access_token', syncToken);
        localStorage.setItem('access_token', syncToken);

        // Remove token from URL and refresh
        const cleanUrl = location.href.split('?')[0] + location.hash;
        console.log('[Login Fixer] Sync Complete. Refreshing...');

        if (window.name === 'AgarLoginFixer') {
            window.close();
        } else {
            location.href = cleanUrl;
        }
        return;
    }

    // --- PHASE 2: LOGIN BRIDGE (Running on Official agar.io) ---
    if (location.host === "agar.io" && fixLogin === 'google') {
        console.log('[Login Fixer] Bridge Active on Root Domain.');

        // 1. Clear old state to ensure fresh Google popup
        // localStorage.removeItem('google_access_token');

        // 2. Monitor for success
        const monitorSuccess = setInterval(() => {
            const token = localStorage.getItem('google_access_token') || localStorage.getItem('access_token');
            if (token) {
                console.log('[Login Fixer] Authentication Success! Bouncing token back...');
                clearInterval(monitorSuccess);
                const syncUrl = `https://${requester}/?syncToken=${token}${location.hash}`;
                location.href = syncUrl;
            }
        }, 800);

        // 3. Click the official button
        const clickOfficialBtn = () => {
            const btn = document.querySelector('button[onclick*="google"], .g-signin2, #google-login, button i.fa-google-plus, .btn-login-google, [data-provider="google"]');
            if (btn) {
                console.log('[Login Fixer] Clicking official login button...');
                btn.click();
            }
        };
        const loop = setInterval(clickOfficialBtn, 2000);
        setTimeout(() => clearInterval(loop), 20000);
        return;
    }

    // --- PHASE 3: STEALTH INTERCEPTION (Running on Mod UI) ---
    if (location.pathname.startsWith("/legendmod") || location.host === "deltio.pages.dev") {

        console.log('[Login Fixer] Stealth Interceptor Active.');

        const startBridge = () => {
            const bridgeUrl = `${ORIGIN}/?fixLogin=google&requester=${location.host}${location.hash}`;
            const width = 550, height = 650;
            const left = (window.screen.width / 2) - (width / 2);
            const top = (window.screen.height / 2) - (height / 2);

            console.log('[Login Fixer] Triggering Stealth Bridge...');
            // "noopener" is CRITICAL to bypass COOP security policies
            window.open(bridgeUrl, 'AgarLoginFixer', `width=${width},height=${height},left=${left},top=${top},noopener`);
        };

        // A. Capture all Google-related window.open calls from the mod
        const originalOpen = window.open;
        window.open = function (url, name, features) {
            if (url && url.toString().includes('google.com/o/oauth2')) {
                console.log('[Login Fixer] Blocked mod\'s malformed Google request. Redirecting to bridge.');
                startBridge();
                return null;
            }
            return originalOpen.apply(this, arguments);
        };

        // B. Capture manual clicks on Google buttons
        document.addEventListener('mousedown', (e) => {
            const target = e.target.closest('button, div, a, i');
            if (!target) return;

            const text = (target.innerText || "").toLowerCase();
            const classes = (target.className || "").toLowerCase();
            const id = (target.id || "").toLowerCase();

            if (text.includes('google') || id.includes('google') || classes.includes('google') || classes.includes('fa-google')) {
                console.log('[Login Fixer] User clicked Google button. Activating bridge...');
                e.preventDefault();
                e.stopPropagation();
                startBridge();
            }
        }, true);

        // C. Clean up Mod UI (Add Fix Button)
        window.addEventListener('load', () => {
            setTimeout(() => {
                const container = document.querySelector('#main-menu, .menu, .agario-panel');
                if (container && !document.getElementById('google-fixer-btn')) {
                    const btn = document.createElement('div');
                    btn.id = 'google-fixer-btn';
                    btn.innerHTML = '🛡️ Force Fix Login';
                    btn.style = "position:absolute; top:5px; right:5px; background:#d32f2f; color:white; padding:6px 12px; border-radius:4px; font-weight:bold; cursor:pointer; z-index:99999; border:1px solid white; font-size:12px; box-shadow:0 0 10px rgba(0,0,0,0.5);";
                    btn.onclick = startBridge;
                    container.appendChild(btn);
                    console.log('[Login Fixer] Manual UI Helper added.');
                }
            }, 3000);
        });
    }

})();
