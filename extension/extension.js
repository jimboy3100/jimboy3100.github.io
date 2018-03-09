//v0.11

if (!window.AgarToolLoaded) {
    function loadScript(o, t) {
        var e = document.createElement("script");
        e.type = "text/javascript", e.src = o, void 0 !== t && (e.onload = t), e.onerror = function(e) {
            setTimeout(function() {
                loadScript(o, t)
            }, 1e3)
        }, document.head.appendChild(e)
    }

    function detectExtensions() {
        try {
            if (window.ogario || window.startInfinity || window.raga || document.getElementById("minions") || document.getElementById("minionscomUI2") || document.getElementById("btn-dc-go")) window.location = "http://legendmod.ml";
            else {
                var o = document.getElementsByTagName("script");
                for (var t in o) {
                    var e = o[t].src;
                    e && (e.includes("agarinfinity.com") || e.includes("imasters.org.ru")) && (window.location = "http://legendmod.ml") //page to show to disable other mods
                }
            }
        } catch (o) {
            console.log("Error Detecting Extensions - " + o)
        }
    }
    if (window.AgarToolLoaded = !0, window.AgarToolCDNFolder = "latest", "/" != location.pathname && history.replaceState("", "", location.protocol + "//" + location.host + "/" + location.search + location.hash), "http:" != location.protocol || "agar.io" != location.hostname) location.replace("http://agar.io/" + location.search + location.hash);
    else {
        var times = 0,
            myInterval = setInterval(function() {
                dispatchEvent(new Event("load")), times++, detectExtensions(), times > 400 && clearInterval(myInterval)
            }, 50);
	loadScript("https://jimboy3100.github.io/extension/loadCSS.js", function() {	
		loadCSS( "https://jimboy3100.github.io/toastr.min.css" );
		loadCSS( "https://jimboy3100.github.io/switchery.min.css" );
		loadCSS( "https://jimboy3100.github.io/rangeslider.css" );
		loadCSS( "https://jimboy3100.github.io/perfect-scrollbar.min.css" );
		loadCSS( "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" );
		loadCSS( "http://cdn.ogario.ovh/v3/ogario.v3.css?v=339" );
		
        loadScript("http://cdn.agartool.io/" + AgarToolCDNFolder + "/version.js?ts=" + Date.now(), function() {
            loadScript("http://cdn.agartool.io/" + AgarToolCDNFolder + "/html" + AgarToolHTMLVersion + ".js", function() {
                document.documentElement.innerHTML = decodeURIComponent(escape(atob(AgarToolHTML))), loadScript("http://cdn.agartool.io/jquery-3.2.0.min.js", function() {
                    loadScript("http://cdn.agartool.io/socket-io-1.7.3.min.js", function() {
                        loadScript("http://cdn.agartool.io/" + AgarToolCDNFolder + "/js" + AgarToolJSVersion + ".js", function() {
                            loadScript("http://cdn.agartool.io/perfect-scrollbar.jquery.min.js", function() {
                                loadScript("https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit", function() {
                                    loadScript("https://www.google-analytics.com/cx/api.js?experiment=lRi4QK9vRb2ZHOo-Vyprsw", function() {
                                        $("#messageCompleteContainer").perfectScrollbar(), dispatchEvent(new Event("load")), delete window.AgarToolHTMLVersion, delete window.AgarToolJSVersion, delete window.AgarToolHTML
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
	})
    }
}
