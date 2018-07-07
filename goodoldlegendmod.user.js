// ==UserScript==
// @name         Legend Agar.io Extension
// @namespace    Legend Agario Mod
// @version      3.1
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
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @grant GM_registerMenuCommand
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
url = window.location.href;
GM_registerMenuCommand('Legend Mod Website', function() {
    window.open("http://legendmod.ml");
}, 'r');
GM_registerMenuCommand('LM Library', function() {
    window.open("https://github.com/jimboy3100/jimboy3100.github.io/");
}, 'r');
GM_registerMenuCommand('Donate for Legend Mod', function() {
    window.open("https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=CM3GDVCW6PBF6");
}, 'r');
if (location.pathname == "/LMoldskins"){
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('"k l";m(2(){2 e(){7 e=n.p("q"),t=9;r(e){s{t=u.v(e)}w(e){4.x(!1,e)}t&&t.5&&(y.z(t.5),4.A("%c[b] d B C...","D: E"))}}!2(t,a){7 o=3.F("G");o.H="I/J",o.K="L-8",o.6?o.f=2(){"d"!=o.6&&"M"!=o.6||(o.f=9,a&&a())}:(3.g&&3.g.N("O-h-i",t),a&&(o.P=a,o.Q=e)),o.5=t+"?R="+~~(S.T()/U/V),3.W("X")[0].Y(o)}("Z://10.11.12/13/j/h.i.j",2(){4.14("[b] 15 16...")})},0);',62,69,'||function|document|console|src|readyState|var||null||VANILLA||loaded||onreadystatechange|body|vanilla|core|js|use|strict|setTimeout|localStorage||getItem|cachedVanilla|if|try||JSON|parse|catch|assert|window|eval|log|from|cache|color|darkorange|createElement|script|type|text|javascript|charset|utf|complete|setAttribute|data|onload|onerror|ts|Date|now|1e3|60|getElementsByTagName|head|appendChild|http|imasters|org|ru|agar|info|inject|success'.split('|'),0,{}))
setTimeout(function() {

document.body.style.background = "#f3f3f3 url('https://jimboy3100.github.io/banners/iconmod3.png') no-repeat center fixed";
$( "body" ).append('<div id="imagebig"><iframe id="loaderIframeIcon1" src="https://jimboy3100.github.io/extras/banneranimated1oldskins.html" name="CodePen" allowfullscreen="true" sandbox="allow-scripts allow-pointer-lock allow-same-origin allow-popups allow-modals allow-forms" allowtransparency="true" scrolling="no" frameBorder="0" class="result-iframe" style="position:fixed; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:999999;"></iframe></div>');
}, 3000);
setTimeout(function() {
$("#canvas").remove();$("#adsBottom").remove();$("#rightPanel").remove();$(".agario-panel.agario-side-panel.agario-profile-panel").remove();$("#dailyquests-panel").remove();$("#v-ex-menu").remove();$("#service-message-area").remove();$(".radio-module").remove();$(".tosBox.right").remove();$(".tosBox.left").remove();$(".form-group.clearfix").remove();$("#skinCustomButton").remove();$("#settings").remove();$("#vanilla-home-link").remove();$("#settingsButton").remove();$("#instructions").remove();$(".btn.btn-play.btn-primary").remove();$(".btn.btn-play-guest.btn-success").remove();$(".btn.btn-warning.btn-login-play").text("Login");$(".btn.btn-warning.btn-login-play").css("margin-left", "80px");$("#helloContainer").css("margin-left", "-150px");$('.agario-panel.agario-side-panel.agario-shop-panel').append('<button id="logoutbtn" onclick="logout(); return false;" class="btn btn-danger btn-logout" data-itr="page_logout">Logout</button>');$("#imagebig").remove();
}, 7000);
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
else if (location.host == "agar.io" && location.pathname == "/") {
	var oldskins = localStorage.getItem("oldskins");
    	if (oldskins=="true"){
        console.log("Old Skins enabled");
        localStorage.setItem("oldskins", "false");
        location.href = "http://agar.io/LMoldskins";
}
	else{
        location.href = "http://agar.io/legend";
    document.documentElement.innerHTML = "";

// Dependencies
var cpickerCSS = '<link href="https://jimboy3100.github.io/bootstrap-colorpicker.min.css" rel="stylesheet"></link>';
var toastrCSS = '<link href="https://jimboy3100.github.io/toastr.min.css" rel="stylesheet"></link>';
var switchCSS = '<link href="https://jimboy3100.github.io/switchery.min.css" rel="stylesheet"></link>';
var rangeCSS = '<link href="https://jimboy3100.github.io/rangeslider.css" rel="stylesheet"></link>';
var perfectCSS = '<link href="https://jimboy3100.github.io/perfect-scrollbar.min.css" rel="stylesheet"></link>';
var faCSS = '<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet"></link>';
var legendarioCSS = '<link href="http://cdn.ogario.ovh/v3/ogario.v3.css?v=339" rel="stylesheet"></link>';
var keyJS = '<script src="https://jimboy3100.github.io/key-event.js"></script>';
var cpickerJS = '<script src="https://jimboy3100.github.io/bootstrap-colorpicker.min.js"></script>';
var toastrJS = '<script src="https://jimboy3100.github.io/toastr.min.js"></script>';
var switchJS = '<script src="https://jimboy3100.github.io/switchery.min.js"></script>';
var rangeJS = '<script src="https://jimboy3100.github.io/rangeslider.min.js"></script>';
var perfectJS = '<script src="https://jimboy3100.github.io/perfect-scrollbar.jquery.min.js"></script>';
var legendJS = '<script src="https://jimboy3100.github.io/legendmod.js"></script>';
var legendJSniffJS = '<script src="https://jimboy3100.github.io/legend.sniff.js"></script>';
var legendJSniff2JS = '<script src="https://jimboy3100.github.io/legend.sniff2.js"></script>';
var legendJSniff3JS = '<script src="https://jimboy3100.github.io/legend.sniff3.js"></script>';
var legendarioSniffJS = '<script src="http://cdn.ogario.ovh/v3/ogario.v3.sniff.js?v=339"></script>';
var legendarioJS = '<script src="http://cdn.ogario.ovh/v3/ogario.v3.js?v=339" charset="utf-8"></script>';

var modVersion = GM_info.script.version;

    // Inject Legend
    function inject(page) {
        page = page.replace(/<script[^>]*>((?!<script)[\s\S])*?NREUM[\s\S]*?<\/script>/, "");
        page = page.replace(/<script[^>]*>((?!<script)[\s\S])*?Outstream[\s\S]*?<\/script>/, "");
        page = page.replace(/<script[^>]*src="[^"]*outstream\.js[^"]*"[^>]*><\/script>/, "");
        page = page.replace("</head>", legendarioSniffJS + cpickerCSS + toastrCSS + switchCSS + rangeCSS + perfectCSS + legendarioCSS + faCSS + cpickerJS + toastrJS + switchJS + rangeJS + perfectJS + keyJS + legendJSniff2JS + "</head>");
        page = page.replace("</body>", legendJSniffJS + "</body>");
        page = page.replace(/<script[^>]*src="[^"]*agario\.core\.js[^"]*"[^>]*><\/script>/, "");
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
            setTimeout(function() {
            document.write("</body>", legendarioJS + legendJS + legendJSniff3JS +  "<script>init('" + modVersion + "');</script>" + "</body>");

            document.close();
                }, 1500);
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
}
//runs only if play.google.com is a popup, doesnt if directly joined
if (location.host == "play.google.com") {
	window.close();
}
//runs only for http://ext.fzogar.xyz/ogs settings
if (location.href == "http://ext.fzogar.xyz/ogs/") {
    setTimeout(function() {
    $("#login_form").append('<span style="float: left; font-size: 13px;">Powered by <a target="_blank" href="http://fzogar.xyz/ogs" style="color: #ffffff;" data-toggle="tooltip" data-title="Legend mod Website" data-placement="left"><u>http://fzogar.xyz/ogs</u></a></span>');
    $("#Loadbtn").after('<input type="submit" id="sendInfo" class="btn btn-default " value="Apply Settings to Mod" style="margin-left: 7px;">');
    $("#sendInfo").click(function() {
        try{window.parent.postMessage("PostedOgarSettings1?datasent="+$("#jsonupdate").val(), "*");
        } catch (e) {}
    });

        }, 1100);
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
    var IPtoken = getParameterByName("token", url2);
    setTimeout(function() {
        document.getElementById('join').click();
    }, 4000);

    setTimeout(function() {
        document.getElementsByClassName('create-room-form-input')[0].value = IPtoken;
        document.getElementsByClassName('create-room-form-button button button-default button-undefined')[0].click();
        document.getElementById('skip').click();
        document.getElementsByClassName('TalkyButton__text')[0].click();
    }, 2000);
    setTimeout(function() {
        document.getElementsByClassName('SDuUr')[1].value = gamename;
		if (IPAgario.length==6){
		document.getElementsByClassName('_24sME message message-info message-full-width')[0].before("[Talky.io]: Legend Mod. Server: " + "http://agar.io/#" + IPAgario + " . [PARTY] (Password rooms are different than Public)");}
		else{
		document.getElementsByClassName('_24sME message message-info message-full-width')[0].before("[Talky.io]: Legend Mod. Server: " + "http://agar.io/?sip=" + IPAgario + " . (Password rooms are different than Public)");}

        document.getElementsByClassName('_1U4l9qYTHl6ExTsW9IvwnO')[1].value = gamename;
        document.getElementsByClassName('message message-info message-full-width')[0].style.visibility = 'hidden';
        document.getElementsByClassName('_24sME message message-info message-full-width')[0].remove();
        document.getElementsByClassName('Box _3-HLf')[0].remove();

    }, 6000);
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
