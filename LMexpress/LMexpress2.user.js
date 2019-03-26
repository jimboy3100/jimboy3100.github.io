// ==UserScript==
// @name         Legend Express Agar.io Extension
// @namespace    Legend Express Agario Mod
// @version      1.6
// @description  Agario Mod - Legend,Ogario,Kitty,Old Skins,Animated Skins,Language Packs,Manual User Scripts,Chat,60++ Macros/Hotkeys(Tricksplit,Doublesplit,Quick Feeding,Popsplit,Auto Coins,Freeze Cell Macro,Auto respawn)
// @homepage     http://www.legendmod.ml
// @author       Jimboy3100
// @license      MIT
// @icon         https://jimboy3100.github.io/banners/CropedImage128.gif
// @match        https://agar.io/*
// @match        https://play.google.com/*
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
/*MIT License*/

// Check location
if (location.host === "agar.io" && location.pathname === "/") {
    location.href = "https://agar.io/legendmod" + location.hash;
    return;
}
var modVersion = GM_info.script.version;
    // Inject Legend
function inject(page) {
        var page = page.replace("</body>", "<script>init('" + modVersion + "');</script>" + "</body>");
        return page;
    }
// Inject script
window.stop();
document.documentElement.innerHTML = "";

GM_xmlhttpRequest({
    method : "GET",
    url : "https://jimboy3100.github.io/LMexpress/LMexpress2.html",
    onload : function(legend) {
        var doc = inject(legend.responseText);
        document.open();
        document.write(doc);
				setTimeout(function() {
					window.history.pushState(null, null, "/");
				}, 2000);

        document.close();
    }

});

    // Inject Chat to text userscript
    (function() {
        'use strict';
var textspeach="";
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
                "el-GR": "Ελληνικά",
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
				textspeach="";
            });
            window.SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
            var recognition = new window.SpeechRecognition();
            if (cfg.lang !== "default") {
                recognition.lang = cfg.lang;
            }
            console.log("cfg.lang/recognition.lang=" + cfg.lang + "/" + recognition.lang);
            recognition.addEventListener('result', function(event) {
                var text_to = event.results.item(0).item(0).transcript;
/*                var text_pre = $("#message").val();
                if (text_pre === "") {
                    text_to = cfg.prefix + text_to;
                } else {
                    text_to = text_pre + " " + text_to;
                }
                $("#message").val(text_to); */
				textspeach=text_to;
				legendmod3.sendChatMessage(101,"🎤 " +text_to)
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
				$("#VoiceBtn1").css("background-color", "green");
                recognition.start();
            }

            function fn_recognition_end() {
                $(".voice-start").css("background-color", "");
				$("#VoiceBtn1").css("background-color", "");
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

//runs only if play.google.com is a popup, doesnt if directly joined
if (location.host == "play.google.com") {
	window.close();
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
