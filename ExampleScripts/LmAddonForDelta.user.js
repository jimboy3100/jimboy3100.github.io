// ==UserScript==
// @name         LmAddonForDelta
// @namespace    Jimboy3100 LegendMod
// @version      1.0
// @description  Professional LegendMod 'adres' logic for Delta: Immutable window.url, Raw LM formatting (&?m=:ffa), and Auto-Connect.
// @author       Jimboy3100
// @icon         https://www.legendmod.ml/banners/icon48.png
// @match        https://agar.io/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const logPrefix = "[LM-Delta] ";

    // --- 1. THE STORAGE VAULT (Captures URL before Delta cleans it) ---
    if (window.location.href.includes('sip=')) {
        sessionStorage.setItem('LM_PERSISTENT_URL', window.location.href);
    }

    // Always pull from the vault if it exists, otherwise use current
    const URL_VAULT = sessionStorage.getItem('LM_PERSISTENT_URL') || window.location.href;

    // Define window.url and window.originalURL globally for console use
    // We use getters to ensure they always return the vaulted data even if Delta overwrites them
    Object.defineProperty(window, 'url', { get: () => URL_VAULT, configurable: true });
    Object.defineProperty(window, 'originalURL', { get: () => URL_VAULT, configurable: true });

    console.log(logPrefix + "URL Vaulted. Type 'window.url' in console to verify.");

    // --- 2. RAW PARAMETER PARSER (LM FORMAT) ---
    function getLMParam(name, urlSource) {
        if (!urlSource || urlSource.indexOf('=') === -1) return null;
        // Specifically handles &r=, &?r=, ?r= formats
        const results = new RegExp('[\\?&]\\??' + name + '=([^&#]*)').exec(urlSource);
        if (!results) return null;
        let val = decodeURIComponent(results[1].replace(/\+/g, " "));
        if (name === "sip") {
            // Strip the LM decorative prefix for the internal Delta input box
            val = val.replace("live-arena-", "").replace(".agar.io", "");
        }
        return val;
    }

    // --- 3. THE REACT STATE HIJACKER ---
    function forceDeltaUpdate(selector, value) {
        const el = document.querySelector(selector);
        if (!el) return;
        const prototype = (el instanceof HTMLSelectElement) ? window.HTMLSelectElement.prototype : window.HTMLInputElement.prototype;
        const nativeSetter = Object.getOwnPropertyDescriptor(prototype, "value").set;
        nativeSetter.call(el, value);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // --- 4. THE 'ADRES' GENERATOR (STRICT RAW FORMAT) ---
    // Builds: ?sip=live-arena-...&?r=...&?m=:ffa
    window.syncDeltaToURL = function() {
        const sipIn = document.querySelector('input[name="serverToken"]');
        const tagIn = document.querySelector('input[name="clantag"]');
        const regSel = document.querySelector('select[name="region"]');
        const modSel = document.querySelector('select[name="gamemode"]');

        const sip = sipIn?.value;
        const tag = tagIn?.value;
        const region = regSel?.value;
        const mode = modSel?.value;

        if (!sip || sip.length < 3) return;

        let lmSip = sip.includes(".") ? sip : "live-arena-" + sip + ".agar.io";

        // Build exact string format requested (Raw concat to prevent %3A)
        let newURL = window.location.origin + window.location.pathname + 
                     "?sip=" + lmSip + 
                     (tag ? "&pass=" + tag : "") + 
                     (region ? "&?r=" + region : "") + 
                     (mode ? "&?m=" + mode : "");

        if (window.location.href !== newURL) {
            window.history.replaceState(null, "", newURL);
        }
    };

    // --- 5. AUTO-CONNECT PIPELINE ---
    function executeStartup() {
        const sip = getLMParam("sip", URL_VAULT);
        const pass = getLMParam("pass", URL_VAULT);
        const region = getLMParam("r", URL_VAULT);
        const mode = getLMParam("m", URL_VAULT);

        if (!sip && !pass && !region && !mode) {
            window.syncDeltaToURL();
            return;
        }

        console.log(logPrefix + "Restoring settings from Vault...");

        if (pass) forceDeltaUpdate('input[name="clantag"]', pass);
        if (region) forceDeltaUpdate('select[name="region"]', region);
        if (mode) forceDeltaUpdate('select[name="gamemode"]', mode);
        
        if (sip) {
            forceDeltaUpdate('input[name="serverToken"]', sip);

            // Connect Trigger
            setTimeout(() => {
                const serverInput = document.querySelector('input[name="serverToken"]');
                const connectBtn = serverInput?.closest('.flex.items-stretch')?.querySelector('button');
                if (connectBtn) {
                    console.log(logPrefix + "Auto-Connecting to " + sip);
                    connectBtn.click();
                    // Clear the one-time startup vault
                    sessionStorage.removeItem('LM_PERSISTENT_URL');
                    setTimeout(window.syncDeltaToURL, 500);
                }
            }, 2500); 
        }
    }

    // --- 6. INTERACTIVE LISTENERS ---
    function initListeners() {
        // Dropdown listeners
        document.addEventListener('change', (e) => {
            if (['region', 'gamemode', 'clantag', 'serverToken'].includes(e.target.name)) {
                setTimeout(window.syncDeltaToURL, 100);
            }
        }, true);

        // UI Action listeners (Connect / Play / Dice / Server List)
        document.addEventListener('click', (e) => {
            if (e.target.closest('.list-style div, button, .btn, .fa-dice')) {
                setTimeout(window.syncDeltaToURL, 150);
            }
        }, true);
    }

    // --- 7. BOOTSTRAP WATCHER ---
    const bootCheck = setInterval(() => {
        const uiReady = document.querySelector('select[name="region"]') && 
                        document.querySelector('input[name="serverToken"]');

        if (uiReady) {
            clearInterval(bootCheck);
            
            // Delay 1.2s to wait for Delta's internal localStorage recovery to finish
            setTimeout(() => {
                executeStartup();
                initListeners();
                
                // Maintain URL formatting every 3 seconds as a safety backup
                setInterval(window.syncDeltaToURL, 3000);
            }, 1200);
        }
    }, 400);

})();
