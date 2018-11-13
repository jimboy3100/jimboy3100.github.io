// ==UserScript==
// @name         Legend Express Agar.io Extension
// @namespace    Legend Express Agario Mod
// @version      1.4
// @description  Agario Mod - Legend,Ogario,Kitty,Old Skins,Animated Skins,Language Packs,Manual User Scripts,Chat,60++ Macros/Hotkeys(Tricksplit,Doublesplit,Quick Feeding,Popsplit,Auto Coins,Freeze Cell Macro,Auto respawn)
// @homepage     http://www.legendmod.ml
// @author       Jimboy3100
// @license      MIT
// @icon         https://jimboy3100.github.io/banners/CropedImage128.gif
// @match        http://agar.io/*
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

if (location.protocol != 'http:')
{
 location.href = 'http:' + window.location.href.substring(window.location.protocol.length);
}

var url = window.location.href;
if (location.pathname == "/LMoldskins"){
eval(function(p,a,c,k,e,d){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--){d[e(c)]=k[c]||e(c)}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('"u v";k(2(){2 e(){g e=p.x("F"),a=b;G(e){H{a=I.z(e)}A(e){6.J(!1,e)}a&&a.5&&(C.B(a.5),6.D("%c[9] d E y...","n: m"))}}g a,t,o;a="//l.q/r.w/f/j.h.f",t=2(){6.s("[9] O 11...")},(o=3.10("Z")).K="X/Y",o.12="13-8",o.4?o.i=2(){"d"!=o.4&&"14"!=o.4||(o.i=b,t&&t())}:(3.7&&3.7.15("V-j-h",a),t&&(o.W=t,o.N=e)),o.5=a+"?M="+~~(L.P()/Q/U),3.T("S")[0].R(o)},0);',62,68,'||function|document|readyState|src|console|body||VANILLA||null||loaded||js|var|core|onreadystatechange|vanilla|setTimeout|imaster|darkorange|color||localStorage|space|agar|info||use|strict|io|getItem|cache|parse|catch|eval|window|log|from|cachedVanilla|if|try|JSON|assert|type|Date|_|onerror|inject|now|1e3|appendChild|head|getElementsByTagName|60|data|onload|text|javascript|script|createElement|success|charset|utf|complete|setAttribute'.split('|'),0,{}))

setTimeout(function() {

document.body.style.background = "#f3f3f3 url('https://jimboy3100.github.io/banners/iconmod3.png') no-repeat center fixed";
$( "body" ).append('<div id="imagebig"><iframe id="loaderIframeIcon1" src="https://jimboy3100.github.io/extras/banneranimated1oldskins.html" name="CodePen" allowfullscreen="true" sandbox="allow-scripts allow-pointer-lock allow-same-origin allow-popups allow-modals allow-forms" allowtransparency="true" scrolling="no" frameBorder="0" class="result-iframe" style="position:fixed; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:999999;"></iframe></div>');
}, 4000);
setTimeout(function() {
$("#canvas").remove();$("#adsBottom").remove();$("#rightPanel").remove();$(".agario-panel.agario-side-panel.agario-profile-panel").remove();$("#dailyquests-panel").remove();$("#v-ex-menu").remove();$("#service-message-area").remove();$(".radio-module").remove();$(".tosBox.right").remove();$(".tosBox.left").remove();$(".form-group.clearfix").remove();$("#skinCustomButton").remove();$("#settings").remove();$("#vanilla-home-link").remove();$("#settingsButton").remove();$("#instructions").remove();$(".btn.btn-play.btn-primary").remove();$(".btn.btn-play-guest.btn-success").remove();$(".btn.btn-warning.btn-login-play").text("Login");$(".btn.btn-warning.btn-login-play").css("margin-left", "80px");$("#helloContainer").css("margin-left", "-150px");$('.agario-panel.agario-side-panel.agario-shop-panel').append('<button id="logoutbtn" onclick="logout(); return false;" class="btn btn-danger btn-logout" data-itr="page_logout">Logout</button>');$("#imagebig").remove();
}, 10000);
}
else if(getParameterByName("mod", url)=="tiny"){
var tinyJS = '<script src="http://jimboy3100.github.io/ExampleScripts/LMTiny.user.js"></script>';
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

}

else if (location.host === "agar.io" && location.pathname === "/") {
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
        url: "https://jimboy3100.github.io/LMexpress/LMexpress.html",
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
//End of Legend Mod
