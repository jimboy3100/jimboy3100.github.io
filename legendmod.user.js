// ==UserScript==
// @name         Legend Mod
// @namespace    Legend Agario Mod
// @version      2.1
// @description  Agario Mod - Legend, Ogario, Kitty, Efsane and other scripts
// @homepage     http://www.legendmod.ml
// @author       Jimboy3100
// @icon         https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/smallbannerlegendclan.png
// @match        http://agar.io/*
// @downloadURL  jimboy3100.github.io/legendmod.user.js
// @updateURL    jimboy3100.github.io/legendmod.user.js
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      agar.io
// ==/UserScript==

// Legend Mod by Jimboy3100
// Start of script
if (location.host == "agar.io" && location.pathname == "/") {

    location.href = "http://agar.io/legendmod" + window.location.search + location.hash;
    //return;
}
// Dependencies
var legendarioCSS = '<link href="http://cdn.ogario.ovh/v3/ogario.v3.css?v=320" rel="stylesheet"></link>';
var legendarioSniffJS = '<script src="http://cdn.ogario.ovh/v3/ogario.v3.sniff.js?v=320"></script>';
var legendarioJS = '<script src="http://cdn.ogario.ovh/v3/ogario.v3.js?v=320" charset="utf-8"></script>';

var keyJS = '<script src="https://jimboy3100.github.io/key-event.js"></script>';

var cpickerJS = '<script src="http://cdn.ogario.ovh/static/js/bootstrap-colorpicker.min.js"></script>';
var toastrJS = '<script src="http://cdn.ogario.ovh/static/js/toastr.min.js"></script>';
var switchJS = '<script src="http://cdn.ogario.ovh/static/js/switchery.min.js"></script>';
var rangeJS = '<script src="http://cdn.ogario.ovh/static/js/rangeslider.min.js"></script>';
var perfectJS = '<script src="http://cdn.ogario.ovh/static/js/perfect-scrollbar.jquery.min.js"></script>';

var legendJS = '<script src="https://jimboy3100.github.io/legendmod.js"></script>';
var legendJSniffJS = '<script src="https://jimboy3100.github.io/legend.sniff.js"></script>';
var legendJSniff2JS = '<script src="https://jimboy3100.github.io/legend.sniff2.js"></script>';
var legendJSniff3JS = '<script src="https://jimboy3100.github.io/legend.sniff3.js"></script>';

var cpickerCSS = '<link href="http://cdn.ogario.ovh/static/css/bootstrap-colorpicker.min.css" rel="stylesheet"></link>';
var toastrCSS = '<link href="http://cdn.ogario.ovh/static/css/toastr.min.css" rel="stylesheet"></link>';
var switchCSS = '<link href="http://cdn.ogario.ovh/static/css/switchery.min.css" rel="stylesheet"></link>';
var rangeCSS = '<link href="http://cdn.ogario.ovh/static/css/rangeslider.css" rel="stylesheet"></link>';
var perfectCSS = '<link href="http://cdn.ogario.ovh/static/css/perfect-scrollbar.min.css" rel="stylesheet"></link>';

var ytJS = '<script src="https://www.youtube.com/iframe_api"></script>';
var faCSS = '<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet"></link>';
var gaJS = "<script>(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o), m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga'); ga('create', 'UA-92655864-2', 'auto'); ga('send', 'pageview');</script>";

var modVersion = GM_info.script.version;
// Inject Legend
function inject(page) {
    var page = page.replace("</head>", cpickerCSS + toastrCSS + switchCSS + rangeCSS + perfectCSS + legendarioCSS  + faCSS + cpickerJS + toastrJS + switchJS + rangeJS + perfectJS + legendJSniff2JS + legendarioSniffJS  + ytJS + keyJS + gaJS+ "</head>");
    //var _page = page.replace("</head>", cpickerCSS + toastrCSS + ogarioCSS + faCSS + cpickerJS + toastrJS + ogarioSniffJS + ytJS + gaJS + "</head>");
    
    page = page.replace(/<script.*?>[\s]*?.*?window\.NREUM[\s\S]*?<\/script>/, "");
    page = page.replace(/<script.*?src=".*?agario\.core\.js.*?><\/script>/, "");
    page = page.replace("</body>", legendJSniffJS + legendarioJS + legendJS + legendJSniff3JS + "<script>init('" + modVersion + "');</script>" + "</body>");
    return page;
}

window.stop();
document.documentElement.innerHTML = "";
GM_xmlhttpRequest({
    method: "GET",
    url: "http://agar.io/",
    onload: function (e) {
        var doc = inject(e.responseText);
        document.open();
        document.write(doc);
        document.close();
    }
});
