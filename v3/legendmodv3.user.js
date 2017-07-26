// ==UserScript==
// @name         Legend Agar.io Extension Tempory Edition
// @namespace    Legend Agar.io
// @version      2.2
// @description  Agario Mod - Legend,Ogario,Kitty,Old Skins,Animated Skins,Language Packs,Manual User Scripts,Chat,60++ Macros/Hotkeys(Tricksplit,Doublesplit,Quick Feeding,Popsplit,Auto Coins,Freeze Cell Macro,Auto respawn)
// @homepage     http://www.legendmod.ml
// @author       Jimboy3100
// @license      MIT
// @icon         https://jimboy3100.github.io/banners/CropedImage128.gif
// @match        http://agar.io/*
// @match        https://talky.io/*
// @match        https://play.google.com/*
// @downloadURL  jimboy3100.github.io/legendmod.user.js
// @updateURL    jimboy3100.github.io/legendmod.user.js
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// ==/UserScript==
// Legend Mod by Jimboy3100
/*MIT License
Copyright (c) [2017] [The Legend Mod]
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/


// Check location
//if (location.host === "agar.io" && location.pathname === "/") {
//    location.href = "http://agar.io/ogario" + location.hash;
//   return;
//}

// Inject script
if (location.host == "agar.io" && location.pathname == "/") {
	location.href = "http://agar.io/legendmod" + window.location.search + location.hash;
	window.stop();
	document.documentElement.innerHTML = "";
	GM_xmlhttpRequest({
		method : "GET",
		url : "https://jimboy3100.github.io/v3/legendmodv3.html",
		onload : function(e) {
			document.open();
			document.write(e.responseText);
			document.close();
		}
	});
}
// Inject Chat Talky.io Userscript
if (location.host == "talky.io") {
	
	(function() {
    var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = 'https://jimboy3100.github.io/banners/icon32croped.ico.gif';
    document.getElementsByTagName('head')[0].appendChild(link);
	})();

	document.title="Legend Mod - Talky";
	
    var url2 = window.location.href;
    var gamename = getParameterByName("name", url2);
    var IPAgario = getParameterByName("ip", url2);

    setTimeout(function() {
        document.getElementsByClassName('_26dP_7FWLFRnvW8hs-AIzR')[0].remove();
        document.getElementsByClassName('_26dP_7FWLFRnvW8hs-AIzR')[0].remove();
        document.getElementsByClassName('_26dP_7FWLFRnvW8hs-AIzR')[0].remove();
    }, 4100);

    setTimeout(function() {
        document.getElementById('skip').click();
        document.getElementsByClassName('TalkyButton__text')[0].click();

    }, 3500);
    setTimeout(function() {
        document.getElementsByClassName('_1U4l9qYTHl6ExTsW9IvwnO')[1].value = gamename;
        //<a href="http://legendmod.ml" target="_blank" id="LegendModWebsite" class="title" style=""><u>Legend Mod</u></a> <a href=IPAgario target="_blank" id="IPAgario" class="title" style=""><u>Copy Agar.io Token</u></a> 
        
		if (IPAgario.length==6){
		document.getElementsByClassName('message message-info message-full-width')[0].before("[Talky.io]: Legend Mod. Server: " + "http://agar.io/#" + IPAgario + " . [PARTY] (Password rooms are different than Public)");}
		else{
		document.getElementsByClassName('message message-info message-full-width')[0].before("[Talky.io]: Legend Mod. Server: " + "http://agar.io/?sip=" + IPAgario + " . (Password rooms are different than Public)");}	
		
        document.getElementsByClassName('_1U4l9qYTHl6ExTsW9IvwnO')[1].value = gamename;
        document.getElementsByClassName('message message-info message-full-width')[0].style.visibility = 'hidden';
        document.getElementsByClassName('Box _3-HLfCQ5QT5fuKgw4tvBkP')[0].remove();
        document.getElementsByClassName('-ZMXacQm9s80kTx3I-A47')[0].remove();

    }, 4000);
}
//runs only if play.google.com is a popup, doesnt if directly joined
if (location.host == "play.google.com") {
	window.close();
}


//End of Legend Mod

