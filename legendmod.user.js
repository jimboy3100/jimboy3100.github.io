// ==UserScript==
// @name         Legend Agar.io Extension
// @namespace    Legend Agario Mod
// @version      2.8
// @description  Agario Mod - Legend,Ogario,Kitty,Old Skins,Animated Skins,Language Packs,Manual User Scripts,Chat,60++ Macros/Hotkeys(Tricksplit,Doublesplit,Quick Feeding,Popsplit,Auto Coins,Freeze Cell Macro,Auto respawn)
// @homepage     http://www.legendmod.ml
// @author       Jimboy3100
// @license      MIT
// @icon         https://jimboy3100.github.io/banners/CropedImage128.gif
// @match        http://agar.io/*
// @match        https://talky.io/*
// @match        https://play.google.com/*
// @match        http://ext.fzogar.xyz/ogs/*
// @downloadURL  jimboy3100.github.io/legendmod.user.js
// @updateURL    jimboy3100.github.io/legendmod.user.js
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_deleteValue
// @connect      jimboy3100.github.io
// ==/UserScript==
// Legend Mod by Jimboy3100

/*MIT License

Copyright (c) [The Legend Mod]

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

// Start of script
GM_registerMenuCommand('Legend Mod Website', function() {
    window.open("http://legendmod.ml");
}, 'r');
GM_registerMenuCommand('LM Library', function() {
    window.open("https://github.com/jimboy3100/jimboy3100.github.io/");
}, 'r');
GM_registerMenuCommand('Donate for Legend Mod', function() {
    window.open("https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=CM3GDVCW6PBF6");
}, 'r');
if (location.pathname =="/LMoldskins"){
        function loadScript(a){var b=document.createElement("script");b.type="text/javascript",b.src=a,document.head.appendChild(b)}function stopPage(){window.stop(),document.documentElement.innerHTML=null}"/"==location.pathname?(stopPage(),location.href="http://agar.io/LMoldskins"+location.hash):"/LMoldskins"==location.pathname&&(stopPage(),loadScript("https://code.jquery.com/jquery-3.1.0.min.js"),loadScript("https://cdn.socket.io/socket.io-1.4.5.js"),loadScript("https://jimboy3100.github.io/old/oldskins.js?v="+Math.floor(1e10*Math.random()+1)));
}
if (location.host === "agar.io" && location.pathname === "/") {
	var oldskins = localStorage.getItem("oldskins");
    	if (oldskins=="true"){
        console.log("Old Skins enabled");
        localStorage.setItem("oldskins", "false");
        function loadScript(a){var b=document.createElement("script");b.type="text/javascript",b.src=a,document.head.appendChild(b)}function stopPage(){window.stop(),document.documentElement.innerHTML=null}"/"==location.pathname?(stopPage(),location.href="http://agar.io/LMoldskins"+location.hash):"/LMoldskins"==location.pathname&&(stopPage(),loadScript("https://code.jquery.com/jquery-3.1.0.min.js"),loadScript("https://cdn.socket.io/socket.io-1.4.5.js"),loadScript("https://jimboy3100.github.io/old/oldskins.js?v="+Math.floor(1e10*Math.random()+1)));
    }
	else{
	window.stop();	
	location.href = "about:blank" + window.location.search + location.hash;
// Dependencies

	var modVersion = GM_info.script.version;

    // Inject Legend
    function inject(page) {
        var page = page.replace("</body>", "<script>init('" + modVersion + "');</script>" + "</body>");
        return page;
    }

    window.stop();
    document.documentElement.innerHTML = "";
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://jimboy3100.github.io/v3/",
        onload: function(legend) {
            var doc = inject(legend.responseText);
            document.open();
            document.write(doc);
            document.close();
        }       
    });

    // Inject Chat to text userscript
    (function() {
        'use strict';

        function pre_loop() {
            if (!document.getElementById("message-box")) {
                setTimeout(pre_loop, 4000);
                console.log("VoiceDeOChat:wait for Legend load");
                return;
            }
            return initialize();
        }
        return pre_loop();

        function initialize() {
            var lang_hash = {
                "default": "default",
                "ja": "日本語",
                "en-US": "English",
                "en-US": "Ελληνικά",
                "zh-CN": "简体中文",
                "zh-TW": "繁體中文",
                "ko": "한국어"
            };
            var cfg = {};
            cfg.prefix = GM_getValue("prefix", "🎤");
            cfg.lang = GM_getValue("lang", "default");
            cfg.unpause = GM_getValue("unpause", false);
            console.log("load prefix=" + cfg.prefix + " lang=" + cfg.lang + " unpause=" + cfg.unpause);
            $("#message-box").mousedown(function() {
                return false;
            });
            $(".team-top-menu").mousedown(function() {
                return false;
            });
            $("#message-menu").append('<a href="#" class="chatbox-hide icon-close" style="float:right;">X</a>');
            $(".chatbox-hide").click(function() {
                $("#message-box").css("display", "none");
                if (cfg.unpause && $("#pause-hud").css("display") == "block") {
                    var code = 82; // 'R'
                    $(document).trigger(jQuery.Event('keydown', {
                        keyCode: code,
                        which: code
                    }));
                }
            });
            $("#message-menu").append('<a href="#" class="chatbox-clear icon-clear" style="float:right;">C</a>');
            $(".chatbox-clear").click(function() {
                $("#message").val("");
            });
            window.SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
            var recognition = new window.SpeechRecognition();
            if (cfg.lang !== "default") {
                recognition.lang = cfg.lang;
            }
            console.log("cfg.lang/recognition.lang=" + cfg.lang + "/" + recognition.lang);
            recognition.addEventListener('result', function(event) {
                var text_to = event.results.item(0).item(0).transcript;
                var text_pre = $("#message").val();
                if (text_pre === "") {
                    text_to = cfg.prefix + text_to;
                } else {
                    text_to = text_pre + " " + text_to;
                }
                $("#message").val(text_to);
            }, false);
            recognition.addEventListener('end', function(event) {
                fn_recognition_end();
            }, false);
            $("#message-menu").append('<a href="#" class="voice-start icon-mic" style="float:right;">🎤</a>');
            $(".voice-start").click(function() {
                fn_recognition_start();
            });

            function fn_recognition_start() {
                $("#voice-config").css("display", "none");
                $(".voice-start").css("background-color", "green");
                recognition.start();
            }

            function fn_recognition_end() {
                $(".voice-start").css("background-color", "");
            }
            $("#og-options").append('<div id="voice-config" class="options-box voiceGroup"></div>');
            $("#voice-config").append('<h5 class="menu-main-color">Voice</h5>');
            $("#voice-config").append('<label>Voice-Prefix:<input type="text" id="voice-prefix" style="width:4em; float:none;" value="' + cfg.prefix + '"/></label>');

            function fn_lang_make() {
                $("#voice-config").append('<label>Voice-lang:<select id="voice-lang"/></select></label>');
                for (var code in lang_hash) {
                    var desc = lang_hash[code];
                    var selected = (code === cfg.lang) ? ' selected' : '';
                    $("#voice-lang").append('<option value="' + code + '"' + selected + '>' + desc + '</option>');
                }
            }
            fn_lang_make();
            $("#voice-config").append('<label title="Voice UnPause><input type="checkbox" id="voice-unpause"' + (cfg.unpause ? ' checked' : '') + '/>UnPause</label>');

            var observ_obj = $("#og-settings");
            var observ_cur = observ_obj.css("display");
            var observer = new MutationObserver(function(mutations) {
                var observ_pre = observ_cur;
                var observ_new = observ_obj.css("display");
                observ_cur = observ_new;
                if (observ_new == "none" && observ_pre == "block") {
                    fn_config_save();
                }
            });
            observer.observe(observ_obj[0], {
                attributes: true,
                attributeFilter: ['style']
            });

            function fn_config_save() {
                cfg.prefix = $("#voice-prefix").val();
                GM_setValue("prefix", cfg.prefix);
                cfg.lang = $("#voice-lang").val();
                GM_setValue("lang", cfg.lang);
                if (cfg.lang !== "default") {
                    recognition.lang = cfg.lang;
                }
                cfg.unpause = $("#voice-unpause").prop('checked');
                GM_setValue("unpause", cfg.unpause);
                console.log("saved prefix=" + cfg.prefix + " lang=" + cfg.lang + " unpause=" + cfg.unpause);
            }
        }
    })();
}
}
//runs only for http://ext.fzogar.xyz/ogs settings
if (location.href == "http://ext.fzogar.xyz/ogs/") {
    setTimeout(function() {
    $("#login_form").append('<span style="float: left; font-size: 13px;">Powered by <a target="_blank" href="http://ext.fzogar.xyz/ogs/" style="color: #ffffff;" data-toggle="tooltip" data-title="Legend mod Website" data-placement="left"><u>http://ext.fzogar.xyz/ogs/</u></a></span>');
    $("#upload-button").after('<input type="submit" id="sendInfo" class="btn btn-default " value="Apply Settings to Mod" style="margin-left: 7px;">');
//    $("#sendInfo").after('<input type="submit" id="sendInfo2" class="btn btn-default " value="Upload from Legend Mod" style="margin-left: 7px;">');
    $("#sendInfo").click(function() {
        showpaste();
//        alert($("#jsonupdate").val());
        try{window.parent.postMessage("PostedOgarSettings1?datasent="+$("#jsonupdate").val(), "*");
        } catch (e) {}
    });

        }, 1100);
}
//runs only if play.google.com is a popup, doesnt if directly joined
if (location.host == "play.google.com") {
	window.close();
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
    url2 = url2.toLowerCase();
    var gamename = getParameterByName("name", url2);
    var IPAgario = getParameterByName("ip", url2);

    setTimeout(function() {
        document.getElementsByClassName('_26dP_7FWLFRnvW8hs-AIzR')[0].remove();
        document.getElementsByClassName('_26dP_7FWLFRnvW8hs-AIzR')[0].remove();
        document.getElementsByClassName('_26dP_7FWLFRnvW8hs-AIzR')[0].remove();
    }, 6100);

    setTimeout(function() {
	document.getElementById('join').click();
    document.getElementById('skip').click();
    document.getElementsByClassName('TalkyButton__text')[0].click();
    }, 5500);
    setTimeout(function() {
        document.getElementsByClassName('_1U4l9')[1].value = gamename;
        //<a href="http://legendmod.ml" target="_blank" id="LegendModWebsite" class="title" style=""><u>Legend Mod</u></a> <a href=IPAgario target="_blank" id="IPAgario" class="title" style=""><u>Copy Agar.io Token</u></a> 
        
		if (IPAgario.length==28){
		document.getElementsByClassName('message message-info message-full-width')[0].before("[Talky.io]: Legend Mod. Server: " + "http://agar.io/#" + IPAgario + " . [PARTY] (Password rooms are different than Public)");}
		else{
		document.getElementsByClassName('message message-info message-full-width')[0].before("[Talky.io]: Legend Mod. Server: " + "http://agar.io/?sip=" + IPAgario + " . (Password rooms are different than Public)");}	
		
        document.getElementsByClassName('_1U4l9qYTHl6ExTsW9IvwnO')[1].value = gamename;

        document.getElementsByClassName('Box _3-HLf')[0].remove();
        document.getElementsByClassName('_2kpBd')[0].remove();
		document.getElementsByClassName('Box _2vX5-')[0].remove();
		document.getElementsByClassName('message message-info message-full-width')[0].style.visibility = 'hidden';
		document.getElementsByClassName('message message-info message-full-width')[0].style.visibility = 'hidden';

    }, 6000);
      setTimeout(function() {
		document.getElementsByClassName('Box _3-HLf')[0].remove();
        document.getElementsByClassName('_2kpBd')[0].remove();
		document.getElementsByClassName('Box _2vX5-')[0].remove();
		document.getElementsByClassName('message message-info message-full-width')[0].style.visibility = 'hidden';
		document.getElementsByClassName('message message-info message-full-width')[0].style.visibility = 'hidden';  
		}, 6200);
}

//example: https://talky.io/dddd?name=&?ip=

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
//End of Legend Mod
