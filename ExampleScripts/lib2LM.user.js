// ==UserScript==
// @name         lib Legend Mod
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js
// @match        http://www.atmarkit.co.jp/d9KcsYjB
// @grant        unsafeWindow
// ==/UserScript==

loadScript("http://ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js");

	// =====  Test driverー  =====

	if(/atmarkit\.co\.jp\/d9KcsYjB/.test(location.href)){
		//setTimeout(init_html, 100);
		//loadScript("http://ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js", init_html);
		loadScript("http://ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js");
	setTimeout(function() {
		loadScript("https://jimboy3100.github.io/ExampleScripts/libLM.js");
	}, 1500);		
    		
}
	// =====  Other general-purpose processing  =====
	function loadScript(url, callback){
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = url;
		if(typeof callback !== 'undefined'){
			script.onload = callback;
		}
		document.head.appendChild(script);
	}
	function escapeHtml(e) {
		return e.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	}
