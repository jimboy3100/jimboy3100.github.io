// ==UserScript==
// @name         Legend Agar.io Extension
// @namespace    Legend Agario Mod
// @version      3.1
// @description  Agario Mod - Legend,Ogario,Kitty,Old Skins,Animated Skins,Language Packs,Manual User Scripts,Chat,60++ Macros/Hotkeys(Tricksplit,Doublesplit,Quick Feeding,Popsplit,Auto Coins,Freeze Cell Macro,Auto respawn)
// @author       Jimboy3100
// @match        http://agar.io/*
// @grant        none
// ==/UserScript==	
// Legend Mod by Jimboy3100


			var script = document.createElement("script");
			script.type = "text/javascript";
			script.src = location.protocol + "//jimboy3100.github.io/extension/extension.js?ts="+Date.now();
			script.onerror = function(err)
			{
				setTimeout(loadExtension, 100);
			};
			document.head.appendChild(script);
