// Legend Mod by Jimboy3100

//runs for agar.io
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
/*
//runs only for http://ext.fzogar.xyz/ogs settings
if (location.href == "http://ext.fzogar.xyz/ogs/") {
    setTimeout(function() {
    $("#login_form").append('<span style="float: left; font-size: 13px;">Powered by <a target="_blank" href="http://fzogar.xyz/ogs" style="color: #ffffff;" data-toggle="tooltip" data-title="Legend mod Website" data-placement="left"><u>http://fzogar.xyz/ogs</u></a></span>');
    $("#Loadbtn").after('<input type="submit" id="sendInfo" class="btn btn-default " value="Apply Settings to Mod" style="margin-left: 7px;">');
//    $("#sendInfo").after('<input type="submit" id="sendInfo2" class="btn btn-default " value="Upload from Legend Mod" style="margin-left: 7px;">');
    $("#sendInfo").click(function() {
//        showpaste();
//        alert($("#jsonupdate").val());
        try{window.parent.postMessage("PostedOgarSettings1?datasent="+$("#jsonupdate").val(), "*");
        } catch (e) {}
    });

        }, 1100);
}
//runs only if play.google.com is a popup, doesnt if directly joined
if (location.host == "play.google.com") {
	window.close();
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
       // document.getElementsByClassName('text__NUZ8yEiB TalkyButton__text _2jD5C')[0].click();
        document.getElementById('join').click();
    }, 4000);

    setTimeout(function() {
        document.getElementsByClassName('create-room-form-input')[0].value = IPtoken;
	//document.getElementById('join').click();
        document.getElementsByClassName('create-room-form-button button button-default button-undefined')[0].click();
        document.getElementById('skip').click();
        document.getElementsByClassName('TalkyButton__text')[0].click();
    }, 2000);
    setTimeout(function() {
        document.getElementsByClassName('SDuUr')[1].value = gamename;
        //<a href="http://legendmod.ml" target="_blank" id="LegendModWebsite" class="title" style=""><u>Legend Mod</u></a> <a href=IPAgario target="_blank" id="IPAgario" class="title" style=""><u>Copy Agar.io Token</u></a>

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
*/
//example: https://talky.io/dddd?name=&?ip=

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

//End of Legend Mod
