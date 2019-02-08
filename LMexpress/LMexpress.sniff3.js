//Legend Mod Sniff 3 by jimboy3100

//1. RegisterSkins
if ( typeof core != 'undefined'){
//core.registerSkin('fly', null, 'https://i.imgur.com/poFMdZd.png', 1, null);
	core.registerSkin = function(a, b, c, d, e){
	window.customskinsname=a;
	window.customskinsurl=c;
	}
}
