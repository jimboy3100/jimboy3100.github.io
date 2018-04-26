// ==UserScript==
// @name         Legend Agar.io Extension (Mozzila)
// @namespace    Legend Agario Mod (Mozzila)
// @version      3.1
// @description  Agario Mod - Legend,Ogario,Kitty,Old Skins,Animated Skins,Language Packs,Manual User Scripts,Chat,60++ Macros/Hotkeys(Tricksplit,Doublesplit,Quick Feeding,Popsplit,Auto Coins,Freeze Cell Macro,Auto respawn)
// @author       Jimboy3100
// @match        http://agar.io/*
// @match        https:/jimboy3100.github.io/agar.html
// @grant        GM_xmlhttpRequest
// ==/UserScript==	
// Legend Mod by Jimboy3100
// Check location

var tinyJS = '<script src="//jimboy3100.github.io/extension/extension.js"></script>';
	    function inject(page) {
        page = page.replace("</body>", tinyJS + "</body>");
        return page;
    }
    window.stop();
    document.documentElement.innerHTML = "";
    GM_xmlhttpRequest({
        method: "GET",
        url: "http://agar.io/",
        onload: function(e) {
            var doc = inject(e.responseText);
            document.open();
            document.write(doc);
			document.close();
        }
    });
