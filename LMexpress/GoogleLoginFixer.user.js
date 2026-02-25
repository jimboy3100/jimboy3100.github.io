// ==UserScript==
// @name         Universal Agar.io Google Login Fixer
// @namespace    http://jimboy3100.github.io/
// @version      2.0
// @description  Fixes Google Login 400 errors for Delta Mod by loading it on the agar.io domain (same method as Legend Mod).
// @author       Jimboy3100
// @match        https://agar.io/*
// @match        https://deltio.pages.dev/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      deltav4.glitch.me
// @connect      deltio.pages.dev
// ==/UserScript==

/* 
---------------------------------------------------------------------------------------------------
TECHNICAL DIAGNOSIS & REPAIR (v2.0):

WHY LEGEND MOD'S GOOGLE LOGIN WORKS:
  Legend Mod uses the Legend Express extension to:
  1. Redirect users to agar.io/legendmod
  2. Fetch the mod HTML from legendmod.ml  
  3. Use document.write() to inject it INTO the agar.io page
  4. pushState back to "/" so the URL shows https://agar.io/
  
  Result: Google sees origin = "https://agar.io" → LOGIN WORKS ✅

WHY DELTA MOD'S GOOGLE LOGIN FAILS:
  Delta Mod runs on deltio.pages.dev which is NOT agar.io.
  Google sees origin = "https://deltio.pages.dev" → LOGIN BLOCKED ❌ (400 error)

THE v2.0 FIX:
  This script replicates Legend Mod's exact approach for Delta:
  1. When user visits deltio.pages.dev, redirect them to agar.io/?loadMod=delta
  2. On agar.io, fetch Delta's HTML from deltav4.glitch.me
  3. Use document.write() to inject it (same as Legend Express)
  4. pushState to "/" so URL = https://agar.io/
  5. Google login now works because origin = agar.io ✅
---------------------------------------------------------------------------------------------------
*/

(function () {
    'use strict';

    // =====================================================================
    // STEP 1: REDIRECT (Running on deltio.pages.dev)
    // If user lands on deltio.pages.dev, send them to agar.io with a flag
    // =====================================================================
    if (location.host === "deltio.pages.dev") {
        console.log('[Login Fixer] Delta detected on external domain. Redirecting to agar.io...');
        location.href = "https://agar.io/?loadMod=delta" + location.hash;
        return;
    }

    // =====================================================================
    // STEP 2: LOAD DELTA ON AGAR.IO (Running on agar.io)
    // Fetch Delta's HTML and inject it via document.write, same as Legend Express
    // =====================================================================
    if (location.host === "agar.io") {
        const urlParams = new URLSearchParams(location.search);
        const loadMod = urlParams.get('loadMod');

        if (loadMod === 'delta') {
            console.log('[Login Fixer] Loading Delta Mod on agar.io domain...');

            // Clear the page (same as Legend Express)
            document.documentElement.innerHTML = "";

            // Fetch Delta's HTML
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://deltav4.glitch.me/v4/index.html",
                onload: function (response) {
                    console.log('[Login Fixer] Delta HTML fetched. Injecting via document.write...');

                    document.open();
                    document.write(response.responseText);
                    document.close();

                    // Push URL back to root "/" so Google sees https://agar.io/
                    setTimeout(function () {
                        window.history.pushState(null, null, "/");
                        console.log('[Login Fixer] URL set to /. Google Login should now work! ✅');
                    }, 2000);
                },
                onerror: function (err) {
                    console.error('[Login Fixer] Failed to fetch Delta:', err);
                    alert('Login Fixer: Could not load Delta Mod. Please try again.');
                }
            });
        }
    }

})();
