//v0.1

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

var modVersion = "3.2";


function reqListener () {
    var doc=this.responseText;
    window.stop();
    document.documentElement.innerHTML = "";
    document.open();
    document.write(doc);
  //console.log(this.responseText);
            document.write("</head>", legendarioSniffJS + cpickerCSS + toastrCSS + switchCSS + rangeCSS + perfectCSS + legendarioCSS + faCSS + cpickerJS + toastrJS + switchJS + rangeJS + perfectJS + keyJS + legendJSniff2JS + "</head>");
            document.write("</body>", legendJSniffJS + "</body");
            setTimeout(function() {
            document.write("</body>", legendarioJS + legendJS + legendJSniff3JS +  "<script>init('" + modVersion + "');</script>" + "</body>");

            document.close();
                }, 1500);
}

var oReq = new XMLHttpRequest();
oReq.addEventListener("load", reqListener);
oReq.open("GET", "http://agar.io");
oReq.send();

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
    }
}
