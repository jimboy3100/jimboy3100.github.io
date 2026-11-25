//v1.4
var RECAPTCHA_V2_KEY = "6LfjUBcUAAAAAF6y2yIZHgHIOO5Y3cU5osS2gbMl";
var RECAPTCHA_V3_KEY = "6LcEt74UAAAAAIc_T6dWpsRufGCvvau5Fd7_G1tY";

function CaptchaRouter(arg) {
    function load() {
        //var t = document.createElement("script");
        //t.setAttribute("src", "https://www.google.com/recaptcha/api.js?onload=onloadCallbackV3&render=explicit"),
        //document.head.appendChild(t)
    }

    function requestCaptcha() {
        return l.render()
    }

    /*
     * One v3 request at a time: the single shared widget was reset while an
     * earlier execute() was still pending, so earlier callbacks never fired.
     * Also handle a missing/failed reCAPTCHA instead of hanging silently.
     */
    var _captchaV3Busy = false;
    var _captchaV3Queue = [];

    /* _retried: a failed or timed-out check is tried once more, then the player is told
     * (the spawn request just never came back, so the player could not spawn and saw nothing) */
    /* Play hid the menu before the captcha: "press Play again" needs the menu back */
    function lmReopenMenu() {
        try { if (window.application && window.legendmod && !window.legendmod.play) window.application.showMenu(300); } catch (err) { }
    }
    function requestCaptchaV3(t, e, _tries, _retried) {
        if (!window.grecaptchaV3 || typeof window.grecaptchaV3.execute !== "function") {
            /* Not loaded yet: retry for ~15 s instead of dropping the request. */
            _tries = (_tries || 0) + 1;
            if (_tries > 15) {
                console.warn("[Captcha] reCAPTCHA v3 did not load; request dropped");
                if (window.toastr) toastr.error(lmT('game2.captchaLoadFailed'));
                lmReopenMenu();
                return;
            }
            setTimeout(function () { requestCaptchaV3(t, e, _tries, _retried); }, 1000);
            return;
        }
        if (_captchaV3Busy) {
            _captchaV3Queue.push([t, e]);
            return;
        }
        _captchaV3Busy = true;

        var settled = false;
        function next() {
            if (settled) return;
            settled = true;
            clearTimeout(hangTimer);
            _captchaV3Busy = false;
            var queued = _captchaV3Queue.shift();
            if (queued) requestCaptchaV3(queued[0], queued[1]);
        }
        function fail() {
            next();
            if (!_retried) {
                setTimeout(function () { requestCaptchaV3(t, e, 0, true); }, 500);
            } else if (window.toastr) {
                toastr.error(lmT('game2.captchaFailed'));
            }
            if (_retried) lmReopenMenu();
        }
        /* execute() can stay pending forever (blocked iframe): do not wedge the queue. */
        var hangTimer = setTimeout(function () {
            console.warn("[Captcha] reCAPTCHA v3 execute timed out");
            fail();
        }, 15000);

        try {
            null === window.recaptchaClientId && (window.recaptchaClientId = window.grecaptchaV3.render("captchaWindowV3", {
                sitekey: RECAPTCHA_V3_KEY,
                badge: "inline",
                size: "invisible"
            }))
            window.grecaptchaV3.reset(window.recaptchaClientId)
            window.grecaptchaV3.execute(window.recaptchaClientId, {
                action: t
            }).then(function(t) {
                if (settled) return; /* timed out; a newer request owns the widget */
                next();
                e(t)
            }, function(err) {
                console.warn("[Captcha] reCAPTCHA v3 execute failed:", err);
                fail();
            })
        } catch (err) {
            console.warn("[Captcha] reCAPTCHA v3 request failed:", err);
            fail();
        }
    }

    function onloadCallback() {
        l.init()
        window.cookieCaptchaOK = true
    }

    function onloadCallbackV3() {
        Object.defineProperty(window, "grecaptchaV3", {
            value: window.grecaptcha,
            writable: !1,
            configurable: !1,
            enumerable: !1
        });
        window.cookieCaptchaOK = true
        //var t = document.createElement("script");
        //t.setAttribute("src", "https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit"),
        //document.head.appendChild(t)
    }
    var l = window.myCaptcha = new Recaptcha("captchaWindow", "verifyUser", arg);
    window.onloadCallbackV3 = onloadCallbackV3
    window.onloadCallback = onloadCallback
    load()
    return {
        load: load,
        validateExpire: l.validateExpire.bind(l),
        requestCaptcha: requestCaptcha,
        requestCaptchaV3: requestCaptchaV3,
        onloadCallback: onloadCallback,
        onloadCallbackV3: onloadCallbackV3
    }
}

function Recaptcha(curtin, e, n) {
    var i = this;
    this.init = function() {
        this.ready = true
    }
    this.show = function() {
        i.sessionExpired = !1,
            document.getElementById(this.curtin).style.display = "block"
    }
    this.hide = function() {
        document.getElementById(this.curtin).style.display = "none"
    }
    this.reset = function() {
		//if (window.captchawidget){
			//grecaptcha.reset(window.captchawidget);
			//window.captchawidget=null;
		//}
        console.log('grecaptcha.reset()')
        //grecaptcha.reset()		
    }
    this.onRender = function(t) {
        window.cookieCaptchaOK = true;
        if (legendmod.botscaptcha) {
            legendmod.botscaptcha = null;
            window.tempol = $("#captchaSpeed").val()
            if ($("#captchaSpeed").val() == null || $("#captchaSpeed").val() == "") {
                window.tempol = 0;
            }
            window.tempo2 = t;
            //window.tempo2 = grecaptcha.getResponse()
            if (window.tempol > 0) {
                setTimeout(function() {
                    legendmod.sendSpawn2(window.tempo2);
                }, window.tempol * 1000);
            } else {
                legendmod.sendSpawn2(window.tempo2);
            }
        }
        console.log("\x1b[32m%s\x1b[34m%s\x1b[0m", consoleMsgLM, " requestCaptcha bypass v2, v3 loaded");
        window.sendTimeOutTokenBots = true;
        /*if(window.core) {
				window.core.recaptchaResponse(_0x196a5a);
			}*/
        /*t ? (window.core.recaptchaResponse(t),
        setTimeout(function() {
            //grecaptcha.reset(myCaptcha.widget)
            i.reset()
            i.hide()
        }, 100)) : i.show()*/
        window.core.recaptchaResponse(t)
        i.hide();
        i.reset();

    }
    this.validateExpire = function() {
        console.log('i.sessionExpired && i.show()')
        i.sessionExpired && i.show()
    }
    this.onExpire = function() {
        console.log('EXPIRE')
        //i.ready && i.widget && (window.core.playerHasCells() ? i.sessionExpired = !0 : i.show())
    }
    this.render = function() {
        if (this.ready) {
            this.show()
            if (null == this.widget) {
                window.captchawidget = this.widget = grecaptcha.render(this.id, {
                    sitekey: RECAPTCHA_V2_KEY,
                    callback: this.onRender.bind(this),
                    "data-theme": 'dark',
                    "expired-callback": this.onExpire.bind(this)
                })
            }
        } else this.reset()
        return this.ready
    }
    this.id = e,
        this.curtin = curtin,
        this.widget = null,
        this.ready = !1,
        window.recaptchaClientId = null,
        this.hide()
}

window.agarCaptcha = CaptchaRouter()

/*Object.defineProperty(window, "agarCaptcha", {
    value: CaptchaRouter()
})*/
/*	
			window.requestCaptchaV2 = function(aa) {
					grecaptcha.v2mode = true;
					grecaptcha.render('recaptcha-screen', {
							'sitekey': '6LfjUBcUAAAAAF6y2yIZHgHIOO5Y3cU5osS2gbMl',
							'callback': SAO
					});
					//window.cookieCaptchaOK=true;
			}
			window.requestCaptchaV3 = function(bb) {
				grecaptcha.v2mode = false;
				grecaptcha.render('captchaWindowV3', {
						'sitekey': '6LcEt74UAAAAAIc_T6dWpsRufGCvvau5Fd7_G1tY',
						'badge': "inline",
						'size': "invisible",
						'callback': SAO						
				});
				//window.cookieCaptchaOK=true;
			}
			window.SAO = function() {
					window.cookieCaptchaOK=true;
					if (legendmod.botscaptcha){
						legendmod.botscaptcha=null;
						window.tempol = $("#captchaSpeed").val()		
						if($("#captchaSpeed").val()==null || $("#captchaSpeed").val()==""){
							window.tempol=0;
					}						
					window.tempo2 = grecaptcha.getResponse()
					setTimeout(function() {
						legendmod.sendSpawn2(window.tempo2);
						}, window.tempol*1000);
					}
					console.log("\x1b[32m%s\x1b[34m%s\x1b[0m", consoleMsgLM, " requestCaptcha bypass v2, v3 loaded");
					window.sendTimeOutTokenBots = true;
			}
			*/



/* original
  function Recaptcha(curtinId, elemId) {
    var self = this;
    this.init = function() {
        this.ready = true;
    }
    this.show = function() {
        document.getElementById(this.curtin).style.display = 'block';
    }
    this.hide = function() {
        document.getElementById(this.curtin).style.display = 'none';
    }
    this.reset = function() {
        grecaptcha.reset();
    }
    this.onRender = function(response) {
        master.notifyToken(response);
        self.hide();
        self.reset();
    }
    this.render = function() {
       if (this.ready) {
            this.show();
            if (this.widget == null)
            	this.widget = grecaptcha.render(this.id, {
                    'sitekey' : '6LfjUBcUAAAAAF6y2yIZHgHIOO5Y3cU5osS2gbMl',
                    'callback' : this.onRender,
                });
           	else
           		this.reset();
       }
       return this.ready;
    }
    this.id = elemId;
    this.curtin = curtinId;
    this.widget = null;
    this.ready = false;
    this.hide();
  }
  function requestCaptcha() {
    return myCaptcha.render();
  }
  var myCaptcha = new Recaptcha('captchaWindow','verifyUser');
  var onloadCallback = function() {
        myCaptcha.init();
  };
  */
