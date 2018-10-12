// ==UserScript==
// @name         Legend Express Agar.io Expansion 1
// @namespace    Legend Express Agario Mod
// @version      1
// @description  Old skins and Agario tools (https:// handler)
// @homepage     http://www.legendmod.ml
// @author       Jimboy3100
// @license      MIT
// @icon         https://jimboy3100.github.io/banners/CropedImage128.gif
// @match        https://agar.io/*
// @run-at       document-start
// @grant        none
// ==/UserScript==


if (location.pathname == "/LMoldskins"){
eval(function(p,a,c,k,e,d){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--){d[e(c)]=k[c]||e(c)}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('"u v";k(2(){2 e(){g e=p.x("F"),a=b;G(e){H{a=I.z(e)}A(e){6.J(!1,e)}a&&a.5&&(C.B(a.5),6.D("%c[9] d E y...","n: m"))}}g a,t,o;a="//l.q/r.w/f/j.h.f",t=2(){6.s("[9] O 11...")},(o=3.10("Z")).K="X/Y",o.12="13-8",o.4?o.i=2(){"d"!=o.4&&"14"!=o.4||(o.i=b,t&&t())}:(3.7&&3.7.15("V-j-h",a),t&&(o.W=t,o.N=e)),o.5=a+"?M="+~~(L.P()/Q/U),3.T("S")[0].R(o)},0);',62,68,'||function|document|readyState|src|console|body||VANILLA||null||loaded||js|var|core|onreadystatechange|vanilla|setTimeout|imaster|darkorange|color||localStorage|space|agar|info||use|strict|io|getItem|cache|parse|catch|eval|window|log|from|cachedVanilla|if|try|JSON|assert|type|Date|_|onerror|inject|now|1e3|appendChild|head|getElementsByTagName|60|data|onload|text|javascript|script|createElement|success|charset|utf|complete|setAttribute'.split('|'),0,{}))

setTimeout(function() {

document.body.style.background = "#f3f3f3 url('https://jimboy3100.github.io/banners/iconmod3.png') no-repeat center fixed";
$( "body" ).append('<div id="imagebig"><iframe id="loaderIframeIcon1" src="https://jimboy3100.github.io/extras/banneranimated1oldskins.html" name="CodePen" allowfullscreen="true" sandbox="allow-scripts allow-pointer-lock allow-same-origin allow-popups allow-modals allow-forms" allowtransparency="true" scrolling="no" frameBorder="0" class="result-iframe" style="position:fixed; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:999999;"></iframe></div>');
}, 3000);
setTimeout(function() {
	

$("#adsBottom").remove();
$("#mainui-modes").remove();
$("#mainui-party").remove();
$("#mainui-promo").remove();

var socialcontainer=$('#socialLoginContainer');
$("#mainui-user").after(socialcontainer);
var skinButton=$('#skinButton');
$(".user-container").append(skinButton);
$("#mainui-offers").css("height", "200px");
$('#skinButton').css({left:110,top:35});
$("#mainui-play").hide();

$(".radio-module").remove();
$(".tosBox.right").remove();
$("#service-message-area").remove();
$("#v-ex-menu").remove();
$(".tosBox.left").remove();
$(".form-group.clearfix").remove();


$("#imagebig").remove();
$("#canvas").hide();
$(".form-group.clearfix").remove();
$(".feature-button.shop.large").click();

}, 18000);
}
