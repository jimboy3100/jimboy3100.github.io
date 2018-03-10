// Legend Mod by Jimboy3100
if (location.pathname == "/LMoldskins"){
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('"k l";m(2(){2 e(){7 e=n.p("q"),t=9;r(e){s{t=u.v(e)}w(e){4.x(!1,e)}t&&t.5&&(y.z(t.5),4.A("%c[b] d B C...","D: E"))}}!2(t,a){7 o=3.F("G");o.H="I/J",o.K="L-8",o.6?o.f=2(){"d"!=o.6&&"M"!=o.6||(o.f=9,a&&a())}:(3.g&&3.g.N("O-h-i",t),a&&(o.P=a,o.Q=e)),o.5=t+"?R="+~~(S.T()/U/V),3.W("X")[0].Y(o)}("Z://10.11.12/13/j/h.i.j",2(){4.14("[b] 15 16...")})},0);',62,69,'||function|document|console|src|readyState|var||null||VANILLA||loaded||onreadystatechange|body|vanilla|core|js|use|strict|setTimeout|localStorage||getItem|cachedVanilla|if|try||JSON|parse|catch|assert|window|eval|log|from|cache|color|darkorange|createElement|script|type|text|javascript|charset|utf|complete|setAttribute|data|onload|onerror|ts|Date|now|1e3|60|getElementsByTagName|head|appendChild|http|imasters|org|ru|agar|info|inject|success'.split('|'),0,{}))
setTimeout(function() {

document.body.style.background = "#f3f3f3 url('https://jimboy3100.github.io/banners/iconmod3.png') no-repeat center fixed";
$( "body" ).append('<div id="imagebig"><iframe id="loaderIframeIcon1" src="https://jimboy3100.github.io/extras/banneranimated1oldskins.html" name="CodePen" allowfullscreen="true" sandbox="allow-scripts allow-pointer-lock allow-same-origin allow-popups allow-modals allow-forms" allowtransparency="true" scrolling="no" frameBorder="0" class="result-iframe" style="position:fixed; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:999999;"></iframe></div>');
}, 3000);
setTimeout(function() {
$("#canvas").remove();
$("#adsBottom").remove();
$("#rightPanel").remove();
$("#skinButton").click();
$("#imagebig").remove();
$(".center-container").hide();
$("#dailyquests-panel").hide();
$("#overlays").hide();
$(".radio-module").hide();
$("#service-message-area").hide();
$("#leftPanel>div.agario-panel.agario-side-panel.agario-shop-panel").show();
$("#helloContainer").css("margin-left", "-150px");
$("#imagebig").remove();
}, 7000);
}
else if (location.host == "agar.io" && location.pathname == "/") {
	var oldskins = localStorage.getItem("oldskins");
    	if (oldskins=="true"){
        console.log("Old Skins enabled");
        localStorage.setItem("oldskins", "false");
        location.href = "http://agar.io/LMoldskins";
}
	else{
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

var oReq = new XMLHttpRequest();
oReq.addEventListener("load", reqListener);
oReq.open("GET", "http://agar.io");
oReq.send();
	}
}
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
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
