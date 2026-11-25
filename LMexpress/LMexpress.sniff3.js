//Legend Mod Sniff 3.34 by jimboy3100
/* Texts from the language packs (developers/i18n/src/lmx.json, lmx.vo.*); the voice settings carry
 * data-i18n attributes, so LMi18n.apply switches them when the language changes. */
function _lmvoT(k, v) { return window.lmT ? window.lmT(k, v) : String(k); }
function _lmvoE(k, v) { return String(_lmvoT(k, v)).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

//Prevent Image crash

//preventcanvasimagecrash();


/*
//1. RegisterSkins (declared on ogario.js)
if ( typeof core != 'undefined'){
//core.registerSkin('fly', null, 'https://i.imgur.com/poFMdZd.png', 1, null);
	core.registerSkin = function(a, b, c, d, e){
	window.customskinsname=a;
	window.customskinsurl=c;
	}
}
*/


if (isMobile){
	/* play.html also loads LMmobile.js (newer touch controls) on these devices; it is in the page by the load event
	   and sets LM_IS_MOBILE, so only fall back to the old gamepad when LMmobile is not there. */
	/* The old gamepad's init() rewrites HUD scale/minimap and clicks Save on every start, and
	   before isMobile worked it never loaded: keep it opt-in (localStorage LMgamepad = "1"). */
	var _lmGamepadCheck = function () {
		var _optIn = false;
		try { _optIn = localStorage.getItem('LMgamepad') === '1'; } catch (e) { }
		if (!window.LM_IS_MOBILE && _optIn) opengamepad();
	};
	if (document.readyState === 'complete') _lmGamepadCheck();
	else window.addEventListener('load', _lmGamepadCheck);
}

function opengamepad() {
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "https://jimboy3100.github.io/ExampleScripts/gamepad.user.js";
    $("body").append(s);
}

// Inject Chat to text userscript
//setTimeout(function() {
//	console.log("VoiceDeOChat:Stage 1");
 var myEle = document.getElementById("voice-prefix");
    if(!myEle){
//    console.log("VoiceDeOChat:Stage 2");
    		
var textspeach="";
        function pre_loop() {
            if (document.getElementById("message-box")) {
                return initialize();
            }
            /* Use MutationObserver instead of polling every 4 seconds */
            var _obs = new MutationObserver(function(mutations, obs) {
                if (document.getElementById("message-box")) {
                    obs.disconnect();
                    initialize();
                }
            });
            _obs.observe(document.body, { childList: true, subtree: true });
        }
        pre_loop();
		

        function initialize() {
            var lang_hash = {
				"en-US": "English",
                "default": _lmvoT('lmx.vo.allLanguages'),
                "ja": "日本語",
				"ar": "عربي",				
                "el-GR": "Ελληνικά",
                "zh-CN": "简体中文",
                "zh-TW": "繁體中文",
                "ko": "한국어",
				"fr": "French",
				"tr": "Turkish",
				"de": "German",
				"es": "Spanish"
            };
			/*
            var lang_hash = {
                "en-US": "English"
            };	
*/			
            var cfg = {};
			cfg.prefix = localStorage.getItem("prefix");
			if (cfg.prefix==null){
				cfg.prefix="🎤";
			}
            //cfg.prefix = GM_getValue("prefix", "🎤");
			cfg.lang = localStorage.getItem("lang");
			if (cfg.lang==null){
				cfg.lang="en-US";
			}						
            //cfg.lang = GM_getValue("lang", "default");
			/*cfg.unpause = localStorage.getItem("unpause");
			if (cfg.unpause==null){
				cfg.unpause=false;
			}	*/		
            //cfg.unpause = GM_getValue("unpause", false);
//            console.log("load prefix=" + cfg.prefix + " lang=" + cfg.lang + " unpause=" + cfg.unpause);
            $("#message-box").mousedown(function() {
                return false;
            });
            $(".team-top-menu").mousedown(function() {
                return false;
            });
            $("#message-menu").append('<a href="#" class="chatbox-hide icon-close" style="float:right;">X</a>');
            $(".chatbox-hide").click(function() {
                $("#message-box").css("display", "none");
                /*if (cfg.unpause && $("#pause-hud").css("display") == "block") {
                    var code = 82; // 'R'
                    $(document).trigger(jQuery.Event('keydown', {
                        keyCode: code,
                        which: code
                    }));
                }*/
            });
            /*$("#message-menu").append('<a href="#" class="chatbox-clear icon-clear" style="float:right;">C</a>');
            $(".chatbox-clear").click(function() {
                $("#message").val("");
				textspeach="";
            });*/
			
            window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            var recognition;
            if (typeof window.SpeechRecognition !== "undefined") {
                recognition = new window.SpeechRecognition();
                if (cfg.lang !== "default") {
                    recognition.lang = cfg.lang;
                }
                recognition.addEventListener('result', function(event) {
                    var text_to = event.results.item(0).item(0).transcript;
                    textspeach = text_to;
                    /* use the configured prefix (was hard-coded) */
                    application.sendChatMessage(101, (cfg.prefix ? cfg.prefix + " " : "🎤 ") + text_to);
                }, false);
                recognition.addEventListener('end', function(event) {
                    fn_recognition_end();
                }, false);
                /* Denied microphone: stop the auto-restart instead of retrying every 500 ms forever. */
                recognition.addEventListener('error', function(event) {
                    if (event && (event.error === 'not-allowed' || event.error === 'service-not-allowed')) {
                        window.voiceStarted = null;
                        toastr.warning(_lmvoE('lmx.vo.micBlocked'));
                    }
                }, false);
            } else {
                console.warn("SpeechRecognition API is not supported in this browser.");
            }
            $("#message-menu").append('<a href="#" class="voice-start icon-mic" style="float:right;">🎤</a>');
            $(".voice-start").click(function() {
				if (!window.voiceStarted){
					window.voiceStarted=true;
					doNextStartStep();
				}
				else{
					window.voiceStarted=null;
				}
            });
			function doNextStartStep(){
				if (window.voiceStarted){
					fn_recognition_start();
				}
				else{
					toastr.info(_lmvoE('lmx.vo.stopped'));
				}				
			}
            function fn_recognition_start() {
                //$("#voice-config").css("display", "none");
                $(".voice-start").css("background-color", "green");
				$("#VoiceBtn1").css("background-color", "green");
                if (recognition) {
                    recognition.start();
                } else {
                    toastr.warning(_lmvoE('lmx.vo.unsupported'));
                }
            }

            function fn_recognition_end() {
                $(".voice-start").css("background-color", "");
				$("#VoiceBtn1").css("background-color", "");	
				
				setTimeout(function() {					
            		doNextStartStep();
            	}, 500);				
            }
            $("#og-options").append('<div id="voice-config" class="options-box voiceGroup"></div>');
            $("#voice-config").append('<h5 class="menu-main-color" data-i18n="lmx.vo.title">' + _lmvoE('lmx.vo.title') + '</h5>');
            $("#voice-config").append('<label><span data-i18n="lmx.vo.prefix">' + _lmvoE('lmx.vo.prefix') + '</span><input type="text" id="voice-prefix" style="width:4em; float:none;"/></label>');
            /* as a property: a prefix with a quote broke the attribute */
            $("#voice-prefix").val(cfg.prefix);
			$("#voice-prefix").blur(function() {
					fn_config_save();
			});
            function fn_lang_make() {
                $("#voice-config").append('<label><span data-i18n="lmx.vo.lang">' + _lmvoE('lmx.vo.lang') + '</span><select id="voice-lang"/></select></label>');
                for (var code in lang_hash) {
                    var desc = lang_hash[code];
                    var selected = (code === cfg.lang) ? ' selected' : '';
                    $("#voice-lang").append('<option value="' + code + '"' + selected + (code === 'default' ? ' data-i18n="lmx.vo.allLanguages"' : '') + '>' + desc + '</option>');
                }
				$("#voice-lang").change(function() {
					//console.log('changed');
					fn_config_save();
				});					
            }	
            fn_lang_make();
			
            //$("#voice-config").append('<label title="Voice UnPause"><input type="checkbox" id="voice-unpause"' + (cfg.unpause ? ' checked' : '') + '/>UnPause</label>');
            function fn_config_save() {
                cfg.prefix = $("#voice-prefix").val();
				localStorage.setItem("prefix", cfg.prefix);	
                //GM_setValue("prefix", cfg.prefix);				
                cfg.lang = $("#voice-lang").val();
				localStorage.setItem("lang", cfg.lang);	
                //GM_setValue("lang", cfg.lang);
                if (cfg.lang !== "default" && recognition) {
                    recognition.lang = cfg.lang;
                }
                /*cfg.unpause = $("#voice-unpause").prop('checked');
				localStorage.setItem("unpause", cfg.unpause);*/
                //GM_setValue("unpause", cfg.unpause);
//                console.log("saved prefix=" + cfg.prefix + " lang=" + cfg.lang + " unpause=" + cfg.unpause);
            }
            var observ_obj = $("#og-settings");
            var observ_cur = observ_obj.css("display");
            var observer = new MutationObserver(function(mutations) {
                var observ_pre = observ_cur;
                var observ_new = observ_obj.css("display");
                observ_cur = observ_new;
                if (observ_new == "none" && observ_pre == "block") {
                    fn_config_save(cfg);
                }
            });
            observer.observe(observ_obj[0], {
                attributes: true,
                attributeFilter: ['style']
            });


        }
	}
//	}, 4000);

//trigger twemoji emoji icons 
/* lazy: about 1,300 picker images were downloaded at start even if the picker is never opened */
var twemoji; if (twemoji && document.getElementsByClassName("emoji-content")[0]) twemoji.parse(document.getElementsByClassName("emoji-content")[0], { attributes: function () { return { loading: "lazy" }; } });
