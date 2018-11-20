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

	
	var my = {
		"name": "lib Legend Mod",
		"log": function(msg){ console.log(this.name + ":"+ msg); }
	};
	var stat = my;
	Object.assign(stat, {
        'publicIP': "ws://37.187.176.125:3000",
		"miniMapTeammatesColor": "#01d9cc",
	});
	//var cfg = {}, cfg_org = {
	//};
	my.log("start");
	lib_ogar = my;

	// =====  Test driverー  =====

	if(/atmarkit\.co\.jp\/d9KcsYjB/.test(location.href)){
		//setTimeout(init_html, 100);
		//loadScript("http://ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js", init_html);
		loadScript("http://ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js");
    loadScript("https://jimboy3100.github.io/ExampleScripts/libLM.js");
}
