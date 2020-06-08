var RECAPTCHA_V2_KEY = "6LfjUBcUAAAAAF6y2yIZHgHIOO5Y3cU5osS2gbMl";
var RECAPTCHA_V3_KEY = "6LcEt74UAAAAAIc_T6dWpsRufGCvvau5Fd7_G1tY";

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
            console.log('grecaptcha.reset()')
            grecaptcha.reset()
        }
        this.onRender = function(t) {
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
            if(this.ready) {
                this.show()
                if(null == this.widget){ 
                    this.widget = grecaptcha.render(this.id, {
                        sitekey: RECAPTCHA_V2_KEY,
                        callback: this.onRender.bind(this),
                        "data-theme":'dark',
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

    
    function CaptchaRouter(arg) {
        function load() {
            var t = document.createElement("script");
            t.setAttribute("src", "https://www.google.com/recaptcha/api.js?onload=onloadCallbackV3&render=explicit"),
            document.head.appendChild(t)
        }
        function requestCaptcha() {
            return l.render()
        }
        function requestCaptchaV3(t, e) {
            null === window.recaptchaClientId && (window.recaptchaClientId = window.grecaptchaV3.render("captchaWindowV3", {
                sitekey: RECAPTCHA_V3_KEY,
                badge: "inline",
                size: "invisible"
            }))
            grecaptcha.reset(window.recaptchaClientId)
            window.grecaptchaV3.execute(window.recaptchaClientId, {
                action: t
            }).then(function(t) {
                e(t)
            })
        }
        function onloadCallback() {
            l.init()
        }
        function onloadCallbackV3() {
            Object.defineProperty(window, "grecaptchaV3", {
                value: window.grecaptcha,
                writable: !1,
                configurable: !1,
                enumerable: !1
            });
            var t = document.createElement("script");
            t.setAttribute("src", "https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit"),
            document.head.appendChild(t)
        }
        var l = window.myCaptcha = new Recaptcha("captchaWindow","verifyUser",arg);
        window.onloadCallbackV3 = onloadCallbackV3
        window.onloadCallback =   onloadCallback
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

    window.agarCaptcha = CaptchaRouter()
