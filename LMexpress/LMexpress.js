/**************
 * Legend express v1.96 by Jimboy3100   email:jimboy3100@hotmail.com
 *************/
/* the footer shows the loader version as it is (1.9), no old "30" suffix */
var semimodVersion = "";

/* Texts shown to the player come from the language packs (developers/i18n/src/lmx.json, keys "lmx.ex.*"):
 * _lmxT gives the text in the chosen language, _lmxE the same escaped for HTML and attributes. */
function _lmxT(k, v) { return window.lmT ? window.lmT(k, v) : String(k); }
function _lmxE(k, v) { return String(_lmxT(k, v)).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
/* Choose Language: every language under its own name (the same in every language), value = languagemod number */
function _lmxLanguageOptions() {
    var names = (window.LMi18n && window.LMi18n.names) || ['English', 'Greek', 'Spanish', 'Bulgarian', 'French', 'Arabic', 'Chinese', 'Russian', 'German', 'Turkish', 'Polish', 'Dutch', 'Portuguese (Brazil)', 'Indonesian', 'Japanese', 'Italian'];
    var html = '';
    for (var i = 0; i < names.length; i++) html += '<option value="' + (i + 1) + '" data-itr=""' + (i === 0 ? ' selected' : '') + '>' + String(names[i]).replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</option>';
    return html;
}


loadericon();

/*
var CutNameConflictwithMessage=false;
(function(){
    var _privateLog = console.log;
    console.log = function (message) {
        if (CutNameConflictwithMessage==false){
        if (~message.indexOf("OGARio by szymy")){
        console.log = _privateLog;
        }
        else{
            _privateLog.apply(console, arguments);
        }
        }
    };
})();

(function(){
    var _privateLog = console.log;
    console.log = function (message) {
        if (~message.indexOf("OGARio by szymy")){
        }
        else{
            _privateLog.apply(console, arguments);
        }
    };
})();
*/
//chat Translations
findUserLang();
if (window.userLanguage) {
    startTranslating()
}

/* Thanks to the players of the builds before 2026-11-28: once per browser (lmLegacyCheck = date of
 * the check), a browser with Legend Mod data of an earlier build gets a permanent Premium licence.
 * Every build since 2017 stored "timesopened" at each start; it is read before this build writes
 * it. A giveaway or Mega FFA licence ends (cleared later), so it counts as no Premium. A fresh
 * browser only gets the marker. Returns true when the licence was given (thank-you toast). */
function _lmLegacyPremiumCheck(ls) {
    try {
        if (ls.getItem("lmLegacyCheck") !== null) return false;
        var lic = ls.getItem("proLicenceUID");
        var premium = !!lic && lic !== "null" && lic.indexOf("Give") === -1 && lic.indexOf("MegaFFA") === -1;
        var usedBefore = ls.getItem("timesopened") !== null;
        ls.setItem("lmLegacyCheck", new Date().toISOString().slice(0, 10));
        if (!usedBefore || premium) return false;
        ls.setItem("proLicenceUID", "permanent");
        return true;
    } catch (e) { return false; }
}
/* the texts and toastr are there before this file runs; a short wait covers a slow load */
function _lmLegacyPremiumToast(tries) {
    if (window.toastr && window.lmT) {
        try { toastr.warning(_lmxT('pkg.legpremw.thanks'), '', { timeOut: 20000, extendedTimeOut: 20000 }).css("width", "350px"); } catch (e) { }
    } else if (tries < 20) {
        setTimeout(function () { _lmLegacyPremiumToast(tries + 1); }, 500);
    }
}
if (_lmLegacyPremiumCheck(localStorage)) _lmLegacyPremiumToast(0);

window.proLicenceUID = localStorage.getItem("proLicenceUID");
if (window.proLicenceUID == "null") window.proLicenceUID = null
var currentIP = "0.0.0.0:0";
var currentIPopened;
var currentToken = "";
var previousMode = localStorage.getItem("gamemode");

var checkonlyonce = localStorage.getItem("checkonlyonce");
var checkonlyfourtenth = localStorage.getItem("checkonlyfourtenth");
var checkonlytfourtheenth = localStorage.getItem("checkonlytfourtheenth");

var stateObj = {
    foo: "bar"
};

var minimapbckimg = "";
var leadbimg = "";
var teambimg = "";
var canvasbimg = "";
var pic1urlimg = "https://i.imgur.com/RVBi3T1.gif";
var pic2urlimg = "https://i.imgur.com/p2T29QE.gif";
var pic3urlimg = "https://i.imgur.com/EucIfYY.gif";
var pic4urlimg = "https://i.imgur.com/KOoBDaK.gif";
var pic5urlimg = "https://i.imgur.com/CS03xWv.gif";
var pic6urlimg = "https://i.imgur.com/tfMUu2J.gif";
var pic1dataimg = "Bad Choice!";
var pic2dataimg = "Why?";
var pic3dataimg = "Yow!!";
var pic4dataimg = "Death!";
var pic5dataimg = "Relax!";
var pic6dataimg = "Legend Mod!";
var yt1url = "dQw4w9WgXcQ";
var yt2url = "btPJPFnesV4";
var yt3url = "UD-MkihnOXg";
var yt4url = "vpoqWs6BuIY";
var yt5url = "VUvfn5-BLM8";
var yt6url = "CnIfNSpCf70";
/* a cleared chat icon / YouTube field falls back to these (it sent [img][/img] / [yt][/yt]) */
var _lmChatDefaults = { pic1urlimg: pic1urlimg, pic2urlimg: pic2urlimg, pic3urlimg: pic3urlimg, pic4urlimg: pic4urlimg, pic5urlimg: pic5urlimg, pic6urlimg: pic6urlimg, yt1url: yt1url, yt2url: yt2url, yt3url: yt3url, yt4url: yt4url, yt5url: yt5url, yt6url: yt6url };
var yt1data = "Rick Astley - Never Gonna Give You Up";
var yt2data = "Survivor - Eye Of The Tiger";
var yt3data = "Lion king - The Lion Sleeps Tonight";
var yt4data = "Agario - Jumbo Solo vs Teams";
var yt5data = "Agario - Kill3r vs Teams";
var yt6data = "Promotional";
var lastIP = localStorage.getItem("lastIP");
var previousnickname = localStorage.getItem("previousnickname");
var leadbtext = localStorage.getItem("leadbtext");
var teambtext = localStorage.getItem("teambtext");
var imgUrl = localStorage.getItem("imgUrl");
var imgHref = localStorage.getItem("imgHref");
var showToken = localStorage.getItem("showTK");
var showPlayer = localStorage.getItem("showPlayer");
var SHOSHOBtn = localStorage.getItem("SHOSHOBtn");


/* The website is served on www.legendmod.ml (jimboy3100.github.io redirects there).
 * Test the hostname: a URL check also matched agar.io links whose ?sip= names a
 * legendmod.ml server, and missed the live site when it looked for github.io only. */
function _lmOnLegendWebsite() {
    return /(^|\.)jimboy3100\.github\.io$|(^|\.)legendmod\.ml$|(^|\.)expanding\.land$/i.test(location.hostname);
}

var timesopened = localStorage.getItem("timesopened");
/* The launch link of this tab. localStorage "url" is shared by every agar.io tab, so two tabs loading
 * at the same time (a restored session) took each other's server or party; the loaders since 1.9 also
 * keep it per tab (sessionStorage "lm-launch-url" with this page load's timeOrigin). Older loaders
 * write only "url". */
function _lmLaunchLink() {
    var link = null, origin = 0;
    try { link = localStorage.getItem("url"); } catch (e) { }
    try { origin = performance.timeOrigin || performance.timing.navigationStart; } catch (e) { }
    try {
        var own = JSON.parse(sessionStorage.getItem("lm-launch-url") || "null");
        if (own && typeof own.url === "string" && origin && Number(own.o) === origin) link = own.url;
    } catch (e) { }
    return link;
}
var url = _lmLaunchLink();
/* The loaders store the launch link (with ?sip=/?pass=/?replay=...) for this page load.
 * Consume it once: otherwise a later visit to agar.io/legendmod, where nothing is
 * stored, re-applies the old link's actions. */
try { localStorage.setItem("url", location.href); } catch (e) { }
if (!url) url = location.href;

var modVersion;
if (_lmOnLegendWebsite()) {
    window.legendModFromWebsite = true; // Flag: loaded from website, not Agar.io userscript (private servers only)
    $("#region").val("Private").change();
    $("#region").hide();

    //$(".row").hide()
    modVersion = "1.8"
    init(modVersion, "website"); /* no Legend Express loader: no update notice */
    $(".btn.btn-warning.btn-spectate.btn-needs-server").children()[0].className = "ogicon-eye"
    legendmod.gameMode = ":party"
    $("#gamemode").change(function () {
        legendmod.gameMode = ":party"
    });

    /* LW: Show both buttons like agar.io — Play as Guest (left) + Login And Play (right) */
    /* Don't hide login button — keep it visible */
    /* Don't make Play guest 100% width — leave room for Login And Play */
    $(".btn.btn-play-guest.btn-success.btn-needs-server").text(_lmxT('pack.playAsGuest'))
    $("#ogario-party").hide() /* party section stays hidden on private servers */
    //$("#openskinchanger").hide() // LW: show skin changer
    $(".quick.quick-bots.ogicon-trophy").hide()
    //$(".profile-tab").hide() // LW: show profile tab
    //$(".menu-tabs").children().css("width", "16.6%") // LW: let tabs auto-size
    if (!window.legendModFromWebsite) {
        $("#gamemode").css("width", "87%")
    }
    $('#hotkeys-cfg').children().show();


}
var region = getParameterByName("r", url);
var realmode = getParameterByName("m", url);
var realmodePS = realmode
var searchStr = getParameterByName("search", url);
var searchSip = getParameterByName("sip", url);

var clanpass = getParameterByName("pass", url);
var searchedplayer = getParameterByName("player", url);
var autoplayplayer = getParameterByName("autoplayer", url);
var replayURL = getParameterByName("replay", url);
var replayStart = getParameterByName("replayStart", url);
var replayEnd = getParameterByName("replayEnd", url);

var realmode2 = "";
var mode = ""; //just in case
var token = "";
var messageone = 1; //If legendmod is being used
var troll1;
var seticon = "YES";
var setmessagecom = "YES";
var setyt = "YES";
var searching;
var timerId;
var MSGCOMMANDS = "";
var MSGCOMMANDS2;
var MSGNICK;
var playerMsg = "";
var commandMsg = "";
var otherMsg = "";
var rotateminimap = 0;
var rotateminimapfirst = 0;
var openthecommunication = "NO";
var clickedname = "NO";
var oldteammode;
var checkedGameNames = 0;
var timesdisconnected = 0;
var PanelImageSrc;
var AdminClanSymbol;
var AdminPassword;
var AdminRights = 0;
var LegendClanSymbol = "0";
/* Theme values (menuBg URL, panel colour) can come from imported or cloud settings:
 * keep only characters that cannot leave a CSS url()/colour or the HTML attribute. */
/* a URL for url(...): quotes, brackets and spaces removed. Not named _lmCssUrl: ogario.v4.js has a global
 * _lmCssUrl that returns the whole url("..."), and this one replaced it once loaded (the menu background
 * image and --lm-menu-bg were lost after a theme change) */
function _lmxCssUrl(u) { return String(u == null ? '' : u).replace(/["'()<>\\\s`]/g, ''); }
function _lmCssColor(c) { return String(c == null ? '' : c).replace(/[^#a-zA-Z0-9(),.%\s-]/g, ''); }
var legbgcolor = $("#menuPanelColor").val();
var legbgpic = $("#menuBg").val();
var legmaincolor = $("#hudMainColor ").val();
var dyinglight1load = localStorage.getItem("dyinglight1load");
var url2;
var semiurl2;
var PostedThings;
//var Ultimouseenabled = 0;
var setscriptingcom = "YES";
var usedonceSkin = 0;
var detailed = "";

var userData = {};
try {
    userData = JSON.parse(localStorage.getItem("userData")) || {};
} catch (e) {
    userData = {};
}
var userip = "0.0.0.0:0";
var usercity = "NotFound";
var usercountry = "NotFound";
var userfirstname = localStorage.getItem("userfirstname");
var userlastname = localStorage.getItem("userlastname");
var usergender = localStorage.getItem("usergender");
var userid = localStorage.getItem("userid");
var fbresponse = {};

var CopyTkPwLb2;
var languagemod = localStorage.getItem("languagemod");
//for MsgCommands
var MSGCOMMANDS2a;
var MSGCOMMANDSA;
var MSGCOMMANDS2;
var MSGCOMMANDS3;
var Express = "True";

//for the LM JSON
var LegendJSON;
var LegendSettings = "true";
var LegendSettingsfirstclicked = "false";
var switcheryLegendSwitch, switcheryLegendSwitch2;

var showonceusers3 = 0;
var client2;




var animatedserverchanged = false;

if (timesopened != null) {
    timesopened++;
    localStorage.setItem("timesopened", timesopened);
} else if (timesopened == null) {
    localStorage.setItem("timesopened", "0");
}
loadersettings();

//
function postSNEZ(server, username, password, data) {
    try {
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", server, true);
        xhttp.setRequestHeader("username", username);
        xhttp.setRequestHeader("password", password);
        xhttp.send(data);
    } catch (e) { }
}

function getSNEZ(server, username, password, callback) {
    var xhttp = new XMLHttpRequest();
    try {
        xhttp.open("GET", server, true);
        xhttp.setRequestHeader("username", username);
        xhttp.setRequestHeader("password", password);
        xhttp.onload = function () { if (callback) callback(xhttp); };
        xhttp.onerror = function () { if (callback) callback(xhttp); };
        xhttp.send();
    } catch (e) { if (callback) callback(xhttp); }
}


//Animated color texts
var tcm2 = {
    prototypes: {
        canvas: (CanvasRenderingContext2D.prototype),
        old: {}
    },
    f: {
        prototype_override: function (type, name, runat, callback) {
            if (!(type in tcm2.prototypes.old)) tcm2.prototypes.old[type] = {};
            if (!(name in tcm2.prototypes.old[type])) tcm2.prototypes.old[type][name] = tcm2.prototypes[type][name];
            tcm2.prototypes[type][name] = function () {
                (runat == 'before' && callback(this, arguments));
                tcm2.prototypes.old[type][name].apply(this, arguments);
                (runat == 'after' && callback(this, arguments));
            };
        },
        gradient: function (a) {
            var c = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff'];
            var g = a.createLinearGradient(0, 0, a.canvas.width, 0);
            g.addColorStop(0, c[Math.floor(Math.random() * c.length)]);
            g.addColorStop(1, c[Math.floor(Math.random() * c.length)]);
            return g;
        },
        override: function () {
            tcm2.f.prototype_override('canvas', 'fillText', 'before', function (a, b) {
                if (a.canvas.id != "minimap" && a.canvas.id != "minimap-sectors") {
                    a.fillStyle = tcm2.f.gradient(a);
                }
            });
        },
        restore: function () {
            if (tcm2.prototypes.old.canvas && tcm2.prototypes.old.canvas.fillText) {
                tcm2.prototypes.canvas.fillText = tcm2.prototypes.old.canvas.fillText;
            }
        }
    }
};

urlIpWhenOpened();

//emphasischat();
//specialeffecttargeting();
/* Legend Express update notice. The newest loader of each kind; the loaders since LMX_OWNER_SINCE write
 * the single-owner record (sessionStorage "lm-loader-owner", html[data-lm-loader]:
 * "<extension|userscript>:<performance.timeOrigin>") before they take over agar.io's page. */
/* The extension stays at the Chrome Web Store's version until 1.9.0 is published there: its notice tells
 * a store install to unzip a new package over its folder, which a store install cannot do. Set it to '1.9'
 * when the store has 1.9.0. */
var LMX_LATEST = { userscript: '1.9', extension: '1.8.5' };
var LMX_OWNER_SINCE = '1.9';
var LMX_UPDATE_URL = { userscript: 'https://www.legendmod.ml/LMexpress/LMexpress.user.js', extension: 'https://www.legendmod.ml/LMexpress/LegendExpressExtension.zip' };

/* Compares dotted versions by number, so "1.10" is newer than "1.9" and "1.8" equals "1.8.0": -1, 0 or 1 */
function _lmxCompareVersions(a, b) {
    var x = String(a == null ? '' : a).split('.'), y = String(b == null ? '' : b).split('.');
    for (var i = 0; i < Math.max(x.length, y.length); i++) {
        var p = parseInt(x[i], 10) || 0, q = parseInt(y[i], 10) || 0;
        if (p !== q) return p < q ? -1 : 1;
    }
    return 0;
}

/* The loader that named itself in the single-owner record for this page load, or '' */
function _lmxOwnerLoader() {
    /* the loaders use navigationStart where the browser has no timeOrigin */
    var origin = 0, seen = [];
    try { origin = performance.timeOrigin || performance.timing.navigationStart; } catch (e) { }
    try { seen.push(sessionStorage.getItem('lm-loader-owner')); } catch (e) { }
    try { seen.push(document.documentElement.getAttribute('data-lm-loader')); } catch (e) { }
    for (var i = 0; i < seen.length; i++) {
        var m = /^(extension|userscript):(.+)$/.exec(seen[i] || '');
        /* a record of an earlier page load in this tab has another timeOrigin */
        if (m && origin && Number(m[2]) === origin) return m[1];
    }
    return '';
}

/* What started Legend Mod: 'website' (www.legendmod.ml and its frames), 'userscript' or 'extension' */
function _lmxLoaderKind(modVersion, loaderName) {
    if (loaderName === 'website' || _lmOnLegendWebsite()) return 'website';
    if (loaderName === 'userscript' || loaderName === 'extension') return loaderName;
    var owner = _lmxOwnerLoader(), v = String(modVersion == null ? '' : modVersion);
    if (_lmxCompareVersions(v, LMX_OWNER_SINCE) >= 0) return owner || 'userscript';
    /* An old loader, which does not name itself. Beside a new one it is the other kind (the new one wrote the record). */
    if (owner) return owner === 'extension' ? 'userscript' : 'extension';
    /* Only the extension had 1.8.0 and 1.8.3 (the userscript had "1.8", never 1.8.3). Of the versions
     * both had, the extension's 1.8.4 and 1.8.5 mirror their on/off switch in lmExpressEnabled; the
     * userscript never wrote it. Every other old version is a userscript. */
    if (v === '1.8.0' || v === '1.8.3') return 'extension';
    var mirror = null;
    try { mirror = localStorage.getItem('lmExpressEnabled'); } catch (e) { }
    if ((v === '1.8.4' || v === '1.8.5') && mirror != null) return 'extension';
    return 'userscript';
}

/* "Legend Express x is available" for a userscript or extension older than the newest one, once per tab
 * session. Website visitors have no loader to update. Returns the loader kind it was shown for, or ''. */
function _lmxUpdateNotice(modVersion, loaderName) {
    /* the website starts LM while this file is still running, before LMX_LATEST is set */
    var kind = _lmxLoaderKind(modVersion, loaderName);
    if (kind === 'website') return '';
    var latest = (LMX_LATEST || {})[kind];
    if (!latest || _lmxCompareVersions(modVersion, latest) >= 0) return '';
    try {
        if (sessionStorage.getItem('lmUpdateNoticeShown') === kind + ' ' + latest) return '';
        sessionStorage.setItem('lmUpdateNoticeShown', kind + ' ' + latest);
    } catch (e) { }
    /* the text is escaped; the two versions go in as highlighted HTML */
    var html = _lmEscHtml(_lmxT('lmx.ex.updateAvailable', ['\u0001', '\u0002']))
        .replace('\u0001', '<font color="yellow"><b>' + _lmEscHtml(latest) + '</b></font>')
        .replace('\u0002', '<font color="yellow"><b>v' + _lmEscHtml(modVersion) + '</b></font>');
    if (kind === 'extension') html += '<br>' + _lmxE('lmx.ex.updateExtension');
    html += '<br><a target="_blank" rel="noopener" href="' + LMX_UPDATE_URL[kind] + '"><font color="yellow"><b><u>' + _lmxE('lmx.ex.updateLink') + '</u></b></font></a>';
    try {
        toastr.info(html, '', { timeOut: 20000, extendedTimeOut: 20000 }).css('width', '350px');
    } catch (e) { }
    return kind;
}

function startLM(modVersion, loaderName) {
    if (!window.LMstarted) {
        window.LMstarted = true
        // ANNOUNCEMENTS
        //toastr.info('<b><font color="yellow"><span style="text-shadow: 0px 0px 10px #0DA9C7;background: transparent url(https://www.legendmod.ml/banners/particles.gif);">'+'Legend mod </span></font> is back!<br><font color="red"></b>Enable Vanilla skins on Settings</font>').css("width", "350px");
        window.LMVersion = modVersion;
        _lmxUpdateNotice(modVersion, loaderName);

        //$("#ogario-party").wrap('<div style="display: none;" id="hidendivtoken"></div>');
        adminstuff();
        return initializeLM(modVersion);
    }
}



function loadersettings() {
    if (timesopened >= 3) {
        if (checkonlyonce != "true") {
            //if($("#SHOSHOBtn").attr('aria-pressed') == "false"){
            if (SHOSHOBtn != "true") {
                toastr.error(Premadeletter18 + '</br> <button id=enableshortcuts1 class="btn btn-sm btn-primary btn-play btn-enable-shortcuts" onclick="enableshortcuts();" style="margin-top: 10px;border-color: darkblue;">' + Premadeletter19 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-play btn-enable-shortcuts" style="width: 100%;margin-top: 10px;">' + Premadeletter20 + '</button>', "", {
                    timeOut: 15000,
                    extendedTimeOut: 15000
                }).css("width", "300px");
                checkonlyonce = "true";
                localStorage.setItem("checkonlyonce", checkonlyonce);
            }
        }
    }
    /*if (checkonlyfourtenth != "true") {
    toastr.info('<center><b>'+
    'Try <font color="yellow"><span style="text-shadow: 0px 0px 10px #0DA9C7;background: transparent url(https://www.legendmod.ml/banners/particles.gif);">Unlimited FPS</font></span>:<br>'+
    'Change  frame per sec, to <u><font color="blue">unlimited</font></u><br>'+
    'on <u><font color="blue">settings tab</font></u'+
    '</b></center>', '', {
                timeOut: 20000,
                extendedTimeOut: 20000
    }).css("width", "450px");	
	
    //if($("#SHOSHOBtn").attr('aria-pressed') == "false"){
    toastr.info('<center><b>'+
    'IF HOTKEYS <font color="yellow"><span style="text-shadow: 0px 0px 10px #0DA9C7;background: transparent url(https://www.legendmod.ml/banners/particles.gif);">NOT WORKING</font></span>:<br>'+
    'Change theme, <u><a target="_blank" href="https://www.legendmod.ml/themes/"><font color="blue">click here</font></u></a><br>'+
    'or <u><font color="green">chrome://settings/clearBrowserData </font></u>delete cookies'+
    '<br>or <u><font color="green">Settings->Import/Export->Download </font></u> your latest saved setting</b></center>', '', {
                timeOut: 20000,
                extendedTimeOut: 20000
            }).css("width", "450px");
        	
        	
    checkonlyfourtenth = "true";
    localStorage.setItem("checkonlyfourtenth", checkonlyfourtenth);				
   // }					
    }
*/
    if (checkonlytfourtheenth != "true") {
        LMLegendFFAPromo();
        checkonlytfourtheenth = "true";
        localStorage.setItem("checkonlytfourtheenth", checkonlytfourtheenth);
    }
    if (timesopened == 10 || timesopened == 100 || timesopened == 1000) {
        //if($("#SHOSHOBtn").attr('aria-pressed') == "false"){
        if (SHOSHOBtn != "true") {
            toastr.error(Premadeletter18 + '</br> <button id=enableshortcuts1 class="btn btn-sm btn-primary btn-play btn-enable-shortcuts" onclick="enableshortcuts();" style="margin-top: 10px;border-color: darkblue;">' + Premadeletter19 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-play btn-enable-shortcuts" style="width: 100%;margin-top: 10px;">' + Premadeletter20 + '</button>', "", {
                timeOut: 15000,
                extendedTimeOut: 15000
            }).css("width", "300px");
            checkonlyonce = "true";
            localStorage.setItem("checkonlyonce", checkonlyonce);
        }
    }
}

function loadericon() {
    //continue loadericon
    /*$("#imagebig").fadeOut(1500);
    setTimeout(function() {
        $("#imagebig").remove();
    }, 1600); */
}

function PremiumUsers() {
    /* ProLicenceUsersTableJS.js failed to load: this threw and the ban check after it never ran */
    if (typeof ProLicenceUsersTable === "undefined" || !ProLicenceUsersTable || !ProLicenceUsersTable.ProLicenceUsers) return;
    if (!window.proLicenceUID || window.proLicenceUID.includes("Give")) {

        if (window.agarioUID && ProLicenceUsersTable.ProLicenceUsers[window.agarioUID]) {

            if (ProLicenceUsersTable.ProLicenceUsers[window.agarioUID].reason.includes("Give")) {
                var todayYYYYMMDD = parseInt(
                    new Date()
                        .toISOString()
                        .slice(0, 10)
                        .replace(/-/g, ""),
                    10
                );

                var giveawayReason =
                    String(
                        ProLicenceUsersTable
                            .ProLicenceUsers[window.agarioUID]
                            .reason || ""
                    );

                var expDateText =
                    String(
                        giveawayReason.split("@")[1] || ""
                    ).replace(/\D/g, "");

                var expDate =
                    parseInt(expDateText, 10);

                if (
                    expDateText.length !== 8 ||
                    !isFinite(expDate)
                ) {
                    console.warn(
                        "[Premium] Invalid giveaway expiration date:",
                        giveawayReason
                    );
                } else if (
                    expDate < todayYYYYMMDD &&
                    window.proLicenceUID
                ) {
                    window.proLicenceUID = null;
                    localStorage.removeItem("proLicenceUID");

                    toastr
                        .warning(
                            _lmxT('lmx.ex.giveawayEnded')
                        )
                        .css("width", "350px");
                } else if (expDate >= todayYYYYMMDD) {
                    if (!window.proLicenceUID) {
                        window.proLicenceUID = "Give";
                        localStorage.setItem(
                            "proLicenceUID",
                            window.proLicenceUID
                        );

                        toastr
                            .warning(
                                _lmxT('lmx.ex.giveawayUntil', [expDateText.slice(0, 4) +
                                    "/" +
                                    expDateText.slice(4, 6) +
                                    "/" +
                                    expDateText.slice(6, 8)])
                            )
                            .css("width", "350px");
                    }
                }
            }
            else {
                window.proLicenceUID = ProLicenceUsersTable.ProLicenceUsers[window.agarioUID].reason
                localStorage.setItem("proLicenceUID", window.proLicenceUID);
                toastr.warning(_lmxT('lmx.ex.premiumStored')).css("width", "350px");
            }
        }
        /* stored giveaway licence whose entry was removed from the loaded table: it has ended */
        else if (window.agarioUID && window.proLicenceUID && window.proLicenceUID.includes("Give") &&
            ProLicenceUsersTable && ProLicenceUsersTable.ProLicenceUsers) {
            window.proLicenceUID = null;
            localStorage.removeItem("proLicenceUID");
            toastr.warning(_lmxT('lmx.ex.giveawayEnded')).css("width", "350px");
        }
        localStorage.setItem("proLicenceUID", window.proLicenceUID);
    }
}
function PremiumUsersLMscore() {
    if (!window.proLicenceUID) {
        window.proLicenceUID = "permanent";
        localStorage.setItem("proLicenceUID", "permanent");
        toastr.warning(_lmxT('lmx.ex.premiumByLevel', [_lmEscHtml(window.LMscore)])).css("width", "350px");
    }
}
function enableshortcuts() {
    if ($("#IPBtn").attr('aria-pressed') == "false") {
        $("#IPBtn").click();
    }
    if ($("#SHOSHOBtn").attr('aria-pressed') == "false") {
        $("#SHOSHOBtn").click();
    }



}

/* Wait for a valid server token without cancelling unrelated listeners.
 * Returns a cancellation function for this registration only. */
var serverTokenWaitId = 0;

function whenServerTokenReady(callback, options) {
    if (typeof callback !== "function") {
        return function () { };
    }

    options = options || {};

    var expectedPreviousToken =
        options.previousToken == null
            ? null
            : String(options.previousToken).trim();

    var allowCurrentToken =
        options.allowCurrentToken !== false;

    var currentValue =
        String($("#server-token").val() || "").trim();

    /*
     * Use the current token only when the caller explicitly permits it and it
     * is not the token from the connection being replaced.
     */
    if (
        allowCurrentToken &&
        currentValue &&
        (
            expectedPreviousToken === null ||
            currentValue !== expectedPreviousToken
        )
    ) {
        callback(currentValue);
        return function () { };
    }

    var active = true;
    var namespace =
        ".lmState" + (++serverTokenWaitId);

    function handler(event, emittedToken) {
        if (!active) {
            return;
        }

        var readyToken =
            String(
                emittedToken ||
                $("#server-token").val() ||
                ""
            ).trim();

        if (!readyToken) {
            return;
        }

        if (
            expectedPreviousToken !== null &&
            readyToken === expectedPreviousToken
        ) {
            return;
        }

        active = false;

        $(document).off(
            "lm:serverTokenReady" + namespace,
            handler
        );

        callback(readyToken);
    }

    $(document).on(
        "lm:serverTokenReady" + namespace,
        handler
    );

    return function cancelServerTokenWait() {
        if (!active) {
            return;
        }

        active = false;

        $(document).off(
            "lm:serverTokenReady" + namespace,
            handler
        );
    };
}

/* Only one pending adres wait at a time: older waits would fire later with stale mode/region. */
var _lmAdresCancelWait = null;

function adres(info, thismode, thisregion) {
    if (thismode == null || thisregion == null) {
        joinSERVERfindinfo();
    }
    if (_lmAdresCancelWait) {
        _lmAdresCancelWait();
        _lmAdresCancelWait = null;
    }
    if ($("#gamemode").val() != ":party") {
        var previousServerToken =
            String($("#server-token").val() || "").trim();

        _lmAdresCancelWait = whenServerTokenReady(function (readyToken) {
            /* private room: the token holds a used single-use ticket, the address bar gets the share link */
            var _lmRoomM = /\/el-room\/([A-HJ-NP-Z2-9]{6})(?:\?|$)/.exec(String(readyToken || ""));
            if (_lmRoomM) {
                history.replaceState(stateObj, "page 2", (_lmOnLegendWebsite() ? "/play" : "") + "?room=" + _lmRoomM[1]);
                return;
            }
            currentIP =
                "live-arena-" +
                readyToken +
                ".agar.io";

            if (!legendmod.integrity) {
                currentIP = readyToken;
            }
            if (realmode != ":party") {
                if (!thismode) {
                    realmode = $("#gamemode").val();
                } else {
                    realmode = thismode;
                }
                if (!thisregion) {
                    region = $("#region").val();
                } else {
                    region = thisregion;
                }
                /* replaceState: every join/reconnect would otherwise add another history entry */
                if (currentIPopened == true) {
                    if (_lmOnLegendWebsite()) history.replaceState(stateObj, "page 2", "/play?sip=" + currentIP + "&r=" + $('#region').val() + "&m=" + realmode);
                    else history.replaceState(stateObj, "page 2", "?sip=" + currentIP + "&r=" + $('#region').val() + "&m=" + realmode);
                    return currentIPopened = false;
                } else if (thismode != null && thisregion != null) {
                    if (_lmOnLegendWebsite()) history.replaceState(stateObj, "page 2", "/play?sip=" + currentIP + "&r=" + $('#region').val() + "&m=" + realmode);
                    else history.replaceState(stateObj, "page 2", "?sip=" + currentIP + "&r=" + $('#region').val() + "&m=" + realmode);

                } else {
                    if (_lmOnLegendWebsite()) history.replaceState(stateObj, "page 2", "/play?sip=" + currentIP);
                    else history.replaceState(stateObj, "page 2", "?sip=" + currentIP);
                    realmode = null;
                    region = null;
                    return realmode, region;
                }
            } else if (realmode == ":party") {
                /* the party redirect targets agar.io: on the website it would leave the site */
                if (window.legendModFromWebsite) {
                    realmode = thismode || $("#gamemode").val();
                    return;
                }
                window.history.pushState(null, null, window.location.pathname);
                window.location.href = "https://agar.io/#" + $('#party-token').val()
            }
        }, {
            previousToken: previousServerToken,
            allowCurrentToken: true
        });
    } else { //if party
        /* Party mode: wait for token then redirect (agar.io only, see above) */
        if (window.legendModFromWebsite) return;
        _lmAdresCancelWait = whenServerTokenReady(function (readyToken) {
            window.history.pushState(null, null, window.location.pathname);
            window.location.href = "https://agar.io/#" + $('#party-token').val()
        });
    }
}


function LMserverbox() {
    //window.LMstarted
    (function (a, c) {
        function r(a, d) {
            if (d) {
                var f = new Date;
                f.setTime(f.getTime() + 864E5 * d);
                f = "; expires=" + f.toGMTString()
            } else f = "";
            document.cookie = "agario_redirect=" + a + f + "; path=/"
        }
        joinSIPonstart();
        joinPLAYERonstart();
        joinreplayURLonstart();
        joinROOMonstart();

    })(window, window.jQuery);
}

function urlIpWhenOpened() {
    /* React to server-token being set instead of waiting 6 seconds */
    whenServerTokenReady(function (readyToken) {
        /* private room: the token holds a used single-use ticket, the address bar gets the share link */
        var _lmRoomM = /\/el-room\/([A-HJ-NP-Z2-9]{6})(?:\?|$)/.exec(String(readyToken || ""));
        if (_lmRoomM) {
            history.replaceState(stateObj, "page 2", (_lmOnLegendWebsite() ? "/play" : "") + "?room=" + _lmRoomM[1]);
            return;
        }
        currentIP =
            "live-arena-" +
            readyToken +
            ".agar.io";

        if (!legendmod.integrity) {
            currentIP = readyToken;
        }
        if (searchSip != null) {
            if (region == null) {
                if (_lmOnLegendWebsite()) history.pushState(stateObj, "page 2", "/play?sip=" + searchSip);
                else history.pushState(stateObj, "page 2", "?sip=" + searchSip);
            } else {
                if (_lmOnLegendWebsite()) history.pushState(stateObj, "page 2", "/play?sip=" + searchSip + "&r=" + region + "&m=" + realmode);
                else history.pushState(stateObj, "page 2", "?sip=" + searchSip + "&r=" + region + "&m=" + realmode);
            }
        } else if (searchSip == null) {
            if (_lmOnLegendWebsite()) history.pushState(stateObj, "page 2", "/play?sip=" + currentIP + "&r=" + $('#region').val() + "&m=" + $('#gamemode').val());
            else history.pushState(stateObj, "page 2", "?sip=" + currentIP + "&r=" + $('#region').val() + "&m=" + $('#gamemode').val());
            region = $('#region').val();
            realmode = $('#gamemode').val();
            return region, realmode;
        } else {
            if (realmode != ":party") {
                if (_lmOnLegendWebsite()) history.pushState(stateObj, "page 2", "/play?sip=" + currentIP + "&r=" + $('#region').val() + "&m=" + realmode);
                else history.pushState(stateObj, "page 2", "?sip=" + currentIP + "&r=" + $('#region').val() + "&m=" + realmode);
            }
        }
    });
}

function play() {
    $('*[data-itr="page_play"]').click();
}

function changeServer(fromSearchTimer) {
    /* The search hops servers every few seconds: stop its timer hops once the
     * player is in a game there, or the next hop ends that game. */
    if (fromSearchTimer && typeof legendmod !== "undefined" && legendmod && legendmod.play) {
        if (timerId) clearInterval(timerId);
        searching = false;
        $("#searchSpan>i").removeClass("fa fa-times").addClass("fa fa-search");
        toastr.info(_lmxT('lmx.ex.searchStoppedPlaying')).css("width", "210px");
        return;
    }
    $("#server-reconnect").click();
    appendLog($("#leaderboard-positions").text());
}

function isValidIpAndPort(input) {
    var parts = input.split(":");
    var ip = parts[0].split(".");
    var port = parts[1];
    return validateNum(port, 1, 65535) &&
        ip.length == 4 &&
        ip.every(function (segment) {
            return validateNum(segment, 0, 255);
        });
}

function validateNum(input, min, max) {
    var num = +input;
    return num >= min && num <= max && input == num.toString();
}

function joinToken(token) {
    appendLog($("#leaderboard-positions").text());
    $("#joinPartyToken").val(token);
    $("#join-party-btn").click();
    $("#joinPartyToken").val("");
    /* "" is not a mode in the list: #gamemode read null and links carried m=null.
     * Leave the selection as it is. */
    currentToken = token;
    $("#searchSpan>i").removeClass("fa fa-times").addClass("fa fa-search");
}

function searchHandler(searchStr) {
    searchStr = searchStr.trim();
    /* a pasted ?sip= server link: join that server like the link does on page load,
     * instead of a player search that hops servers and ends the current game */
    if (_lmSearchSipHandler(searchStr)) { // is a ?sip= link
    } else if (searchIPHandler(searchStr)) { // is an IP      
    } else if (searchTKHandler(searchStr)) { // is a token     
    } else {
        searchPlayer(searchStr);
    }
}

function _lmSearchSipHandler(searchStr) {
    var sipLink = searchStr;
    if (/^sip=/i.test(sipLink)) sipLink = "?" + sipLink;
    var sipValue = getParameterByName("sip", sipLink);
    if (!sipValue) return false;
    var sipR = getParameterByName("r", sipLink);
    var sipM = getParameterByName("m", sipLink);
    /* only values the selects have; Private servers swap the mode list (on a region change
     * event), so leave the selects as they are when either side is Private */
    if (sipR && sipR !== "Private" && $("#region").val() !== "Private" && _lmSelectHasValue("#region", sipR)) {
        $("#region").val(sipR);
        region = sipR;
        if (sipM && _lmSelectHasValue("#gamemode", sipM)) {
            $("#gamemode").val(sipM);
            realmode = sipM;
            currentIPopened = true;
            legendmod.gameMode = realmode;
        }
    }
    $("#server-token").val(sipValue.replace("live-arena-", "").replace(".agar.io", ""));
    $("#server-join").click();
    $("#searchSpan>i").removeClass("fa fa-times").addClass("fa fa-search");
    hideSearchHud();
    showMenu2();
    return true;
}

function searchTKHandler(searchStr) {
    searchStr = searchStr.trim();

    if (searchStr.startsWith("https://agar.io/#")) {
        joinpartyfromconnect(searchStr.replace("https://agar.io/#", ""));
        realmodereturn();

    } else if (searchStr.startsWith("agar.io/#")) {
        joinToken(searchStr.replace("agar.io/#", ""));
        realmodereturn();
    } else {
        return false;
    }
    $("#searchSpan>i").removeClass("fa fa-times").addClass("fa fa-search");
    /* the IP check before this hid the menu and faded in the search overlay; a party link
     * never searches, so bring the menu back (the overlay stayed over the game) */
    hideSearchHud();
    showMenu2();
    return true;
}

function realmodereturn() {
    region = $("#region").val();
    realmode = $("#gamemode").val();
    return realmode, region;
}

function realmodereturnfromStart() {
    region = getParameterByName("r", url);
    realmode = getParameterByName("m", url);
    return region, realmode;
}


function searchIPHandler(searchStr) { //VERY WEIRD FUNCTION, MOD DOESNT LOAD IF CHANGED
    /* #regioncheck / #gamemodecheck are never created: fall back to the real selects
     * so searches keep the current region and mode instead of undefined. */
    region = $("#regioncheck").length ? $("#regioncheck").val() : $("#region").val(); //...
    realmode = $("#gamemodecheck").length ? $("#gamemodecheck").val() : $("#gamemode").val(); //...
    /* a pasted ?r=..&m=..&search=.. link carries the server's region and mode */
    try {
        var _lmSearchR = getParameterByName("r", searchStr);
        var _lmSearchM = getParameterByName("m", searchStr);
        if (_lmSearchR) region = _lmSearchR;
        if (_lmSearchM) realmode = _lmSearchM;
    } catch (e) { }
    $("#Backtomenu").hide();
    hideMenu();
    showSearchHud();
    searchStr = searchStr.trim();
    if (isValidIpAndPort(searchStr)) {
        findIP(searchStr);
    } else if (isValidIpAndPort(searchStr.replace("wss://", ""))) {
        findIP(searchStr.replace("wss://", ""));
    } else if (isValidIpAndPort(searchStr.replace("agar.io/?search=wss://", ""))) {
        findIP(searchStr.replace("agar.io/?search=wss://", ""));
    } else if (isValidIpAndPort(searchStr.replace("https://agar.io/?search=wss://", ""))) {
        findIP(searchStr.replace("https://agar.io/?search=wss://", ""));
    } else if (getParameterByName("search", searchStr)) {
        if (region) {
            /* match by value, not a selector string: a quote in r= threw a jQuery error */
            $('#region option').filter(function () { return this.value === region; }).prop('selected', 'selected').change();
            if (!_lmOnLegendWebsite()) {
                getInfo();
            }


        }
        findIP(getParameterByName("search", searchStr).replace("wss://", ""));
    } else {
        return false;
    }
    return true;

}

function findIP(searchIP) {

    /* Select the option whose value is the mode (":ffa", ":teams", ":battleroyale"...).
     * FFA used to look for value="" which no select has, and battle royale was missing. */
    var _lmModeOpt = realmode ? $('#gamemode option').filter(function () { return this.value === realmode; }) : $();
    if (_lmModeOpt.length && $('#gamemode').val() !== realmode) {
        _lmModeOpt.prop('selected', 'selected').change();
    }
    if (!searching) {
        if ($.trim(searchIP) == '') { } else {
            //            showCancelSearch();
            searching = true;
            var interval = 1800;
            var maxTries = 8;
            var numTries = 0;
            var numAttempts = 0;
            var maxAttempts = 2;
            toastr["success"](Premadeletter21 + " \'wss://" + _lmEscHtml(searchIP) + "\'...").css("width", "210px");
            numTries++;
            if (currentIP == searchIP) {
                $("#searchSpan>i").removeClass("fa fa-times").addClass("fa fa-search");
                searching = false;
                //                hideCancelSearch();
                //hideSearchHud();
                toastr.info(Premadeletter29 + '! </br> <button  class="btn btn-play btn-primary btn-needs-server" onclick=hideSearchHud();play(); style="margin-top: 10px;border-color: darkblue;">' + Premadeletter13 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-spectate-shortcut" onclick=hideSearchHud(); style="width: 100%;margin-top: 10px;">' + Premadeletter14 + '</button>', "", {
                    timeOut: 20000,
                    extendedTimeOut: 20000
                }).css("width", "210px");
            } else {
                changeServer();
                if (timerId) clearInterval(timerId);
                timerId = setInterval(function () {
                    if (numAttempts == maxAttempts) {
                        numAttempts = 0;
                        numTries++;
                        toastr["success"](Premadeletter30 + ": " + numTries + "\/" + maxTries).css("width", "210px");
                        /* test the current server before giving up, so a hit on the last try counts */
                        if (currentIP == searchIP) {
                            $("#searchSpan>i").removeClass("fa fa-times").addClass("fa fa-search");
                            clearInterval(timerId);
                            searching = false;
                            //hideCancelSearch(); /* never defined: threw and broke the found/gave-up toast */
                            //hideSearchHud();							
                            toastr.info(Premadeletter29 + '! </br> <button  class="btn btn-play btn-primary btn-needs-server" onclick=hideSearchHud();play(); style="margin-top: 10px;border-color: darkblue;">' + Premadeletter13 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-spectate-shortcut" onclick=hideSearchHud(); style="width: 100%;margin-top: 10px;">' + Premadeletter14 + '</button>', "", {
                                timeOut: 20000,
                                extendedTimeOut: 20000
                            }).css("width", "210px");
                        } else if (numTries >= maxTries) {
                            $("#searchSpan>i").removeClass("fa fa-times").addClass("fa fa-search");
                            clearInterval(timerId);
                            searching = false;
                            //hideCancelSearch(); /* never defined: threw and broke the found/gave-up toast */
                            toastr.error(Premadeletter31).css("width", "210px");
                            /* gave up: do not hop to another server */
                        } else {
                            changeServer(true);
                        }
                    } else {
                        numAttempts++;
                        //console.log("numAttempts: " + numAttempts);
                    }
                }, interval);

            }
        }
    } else {
        $("#searchSpan>i").removeClass("fa fa-times").addClass("fa fa-search");
        clearInterval(timerId);
        searching = false;
        //        hideCancelSearch();
        $("#searchSpan>i").removeClass("fa fa-times").addClass("fa fa-search");
        toastr.error(Premadeletter32 + "!").css("width", "210px");
    }
}

function searchPlayer(searchString) {
    if (!searching) {
        if ($.trim(searchString) == '') { } else {
            //            showCancelSearch();
            searching = true;
            //var interval = 2500;
            var interval = 1800;
            var maxTries = 8;
            var numTries = 0;
            var minNamesFound = 3;
            var numAttempts = 0;
            var maxAttempts = 2;
            toastr["success"](Premadeletter30 + " \'" + _lmEscHtml(searchString) + "\'...").css("width", "210px");
            var leaderboard = $("#leaderboard-positions").text();
            var names = searchString.split(/[1-9]\.\s|10\.\s/g).filter(function (el) {
                return el.length != 0;
            });
            //console.log(leaderboard);

            var numNames = names.length;
            //console.log("Number of names: " + numNames);

            var found = false;
            numTries++;
            toastr["success"](Premadeletter30 + ": " + numTries + "\/" + maxTries).css("width", "210px");
            if (numNames == 1) {
                found = foundName(leaderboard, searchString);
            } else if (numNames > 1) {
                found = foundNames(leaderboard, names, minNamesFound);
            }

            if (found) {
                $("#searchSpan>i").removeClass("fa fa-times").addClass("fa fa-search");
                searching = false;
                //                hideCancelSearch();
                //hideSearchHud();
                toastr.info(Premadeletter29 + '! </br> <button  class="btn btn-play btn-primary btn-needs-server" onclick=hideSearchHud();play(); style="margin-top: 10px;border-color: darkblue;">' + Premadeletter13 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-spectate-shortcut" onclick=hideSearchHud(); style="width: 100%;margin-top: 10px;">' + Premadeletter14 + '</button>', "", {
                    timeOut: 20000,
                    extendedTimeOut: 20000
                }).css("width", "210px");
                //		testmessage();
                /* "nothing" is not a mode in the list (#gamemode read null): keep the selection */
            } else {
                changeServer();

                // start timer

                if (timerId) clearInterval(timerId);
                timerId = setInterval(function () {
                    if (numAttempts == maxAttempts) {

                        numAttempts = 0;
                        leaderboard = $("#leaderboard-positions").text();
                        if (numNames == 1) {
                            found = foundName(leaderboard, searchString);
                        } else if (numNames > 1) {
                            found = foundNames(leaderboard, names, minNamesFound);
                        }
                        numTries++;
                        toastr["success"](Premadeletter30 + ": " + numTries + "\/" + maxTries).css("width", "210px");
                        /* test the current leaderboard before giving up, so a hit on the last try counts */
                        if (found) {
                            $("#searchSpan>i").removeClass("fa fa-times").addClass("fa fa-search");
                            clearInterval(timerId);
                            searching = false;
                            //                            hideCancelSearch();
                            //hideSearchHud();
                            toastr.info(Premadeletter29 + '! </br> <button  class="btn btn-play btn-primary btn-needs-server" onclick=hideSearchHud();play(); style="margin-top: 10px;border-color: darkblue;">' + Premadeletter13 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-spectate-shortcut" onclick=hideSearchHud(); style="width: 100%;margin-top: 10px;">' + Premadeletter14 + '</button>', "", {
                                timeOut: 20000,
                                extendedTimeOut: 20000
                            }).css("width", "210px");
                        } else if (numTries >= maxTries) {
                            clearInterval(timerId);
                            searching = false;
                            //                            hideCancelSearch();
                            toastr.error(Premadeletter31).css("width", "210px");
                            /* gave up: do not hop to another server */
                        } else {
                            changeServer(true);
                        }
                    } else {
                        numAttempts++;
                    }
                }, interval);
            }
        }

    } else {
        clearInterval(timerId);
        searching = false;
        //        hideCancelSearch();
        toastr.error(Premadeletter32).css("width", "210px");
    }
}

function copyToClipboard(element) {
    var $temp = $("<textarea>");
    $("body").append($temp);
    var html = $(element).html();
    html = html.replace(/<br>/g, "\n"); // or \r\n
    var _lmDecode = document.createElement("textarea");
    _lmDecode.innerHTML = html;
    html = _lmDecode.value;
    console.log(html);
    $temp.val(html).select();
    document.execCommand("copy");
    $temp.remove();
}

/* a board's rows on their own lines (application.boardText): .text() ran the rows together */
function _lmBoardHtml(id) {
    var t = window.application && typeof application.boardText === 'function' ? application.boardText(id) : $('#' + id).text();
    return (t.indexOf('\n') !== -1 ? '<br>' : '') + _lmEscHtml(t).replace(/\n/g, '<br>');
}

function copyToClipboardAll() {
    $("#CopyTkPwLb").remove();
    if ($("#top5-pos").text() != "") {
        $("#server-join").after('<er id="CopyTkPwLb" style="display: none;">Server: ' + _lmEscHtml(CopyTkPwLb2) + '<br>Leaderboard: ' + _lmBoardHtml('leaderboard-positions') + '<br>Teamboard:' + _lmBoardHtml('top5-pos') + '<br>My Game Name: ' + _lmEscHtml($("#nick").val()) + '</er>'); // i18n-ok: copied text is pasted to teammates/Discord, kept the same for everyone
    } else {
        $("#server-join").after('<er id="CopyTkPwLb" style="display: none;">Server: ' + _lmEscHtml(CopyTkPwLb2) + '<br>Leaderboard: ' + _lmBoardHtml('leaderboard-positions') + '<br>My Game Name: ' + _lmEscHtml($("#nick").val()) + '</er>'); // i18n-ok: copied text is pasted to teammates/Discord, kept the same for everyone
    }
    copyToClipboard('er#CopyTkPwLb');
}

function foundName(leaderboard, name) {
    return leaderboard.includes(name);
}


function foundNames(leaderboard, names, minNamesFound) {
    var numNames = names.length;
    var countFound = 0;
    var found = false;

    for (var i = 0; i < numNames; i++) {
        found = foundName(leaderboard, names[i]);
        if (found) {
            countFound++;
        }
    }
    return (countFound >= minNamesFound) ? true : false;
}




/* thismode is the party token from the pasted link; #server does not exist, so the
 * token was always empty and the player joined no party */
function joinpartyfromconnect(thismode) {
    $("#party-token").val(String(thismode || $("#server").val() || "").trim());
    $("#join-party-btn-2").click();
    legendmod.gameMode = ":party";
    return realmode = legendmod.gameMode;
}

function BeforeReportFakesSkin() {
    ReportFakesSkin();
    /*
    if ($("#skin").val() != "https://www.legendmod.ml/banners/iconfake1.png") {
        toastr.info(Premadeletter95 + ' <font color="red"><b>Ctrl+V</font></b>, ' + Premadeletter96).css("width", "350px"); // erase the 's		
        copy("https://www.legendmod.ml/banners/iconfake1.png");
    } else {
        ReportFakesSkin();
    }
    */
}

function ReportFakesSkin() {
    var Temporaryletter1 = _lmxE('pack.teamboard');
    var Temporaryletter2 = _lmxE('pack.leaderboard');

    $('body').append(
        '<div class="modal fade in" id="SkinChanger" aria-hidden="false" style="display:none;">' +
        '<div class="modal-backdrop fade in"></div>' +
        '<div class="modal-dialog" style="width:522px;">' +
        '<div class="modal-content">' +

        '<div class="modal-header">' +
        '<button type="button" class="close" onclick="exitSkinChanger(); return false;"><span aria-hidden="true">&#10005;</span></button>' +
        '<h4 class="modal-title" style="font-family: var(--lm-hud-font, Roboto Condensed, sans-serif)">' + Premadeletter119 + '</h4>' +
        '</div>' +

        '<div id="SkinChangerhud" style="display:block; padding: 10px;">' +
        '<div id="SkinChangertoolshud1" align="middle">' +
        '<p style="color:var(--lm-tc,#fff); font-size:12px; margin-bottom: -4px;" align="middle">' + Premadeletter120 +
        //'<br><br><font id= "Leadboardlet1" style="color:white; size:12px; margin-right: 70px;">' + Temporaryletter2 + '</font><font id= "Teamboardlet1" style="color:white; size:12px; margin-left: 70px;">' + Temporaryletter1 + '</font></p><br>' +
        '<br><br><font id= "Leadboardlet1" style="color:var(--lm-tc,#fff); size:12px; ">' + Temporaryletter2 + '</p><br>' +
        '<input id="LeaderboardInput1" class="form-control" placeholder="' + _lmxE('lmx.ex.nickname') + '" data-i18n-placeholder="lmx.ex.nickname" value="" style="margin-top: 0px; margin-right: 2px; width: 30%; display: inline; " " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        //' <input id="TeamboardInput1" class="form-control" placeholder="' + _lmxE('lmx.ex.nickname') + '" data-i18n-placeholder="lmx.ex.nickname" value="" style="margin-top: 0px; margin-left: 2px; width: 30%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        '<input id="LeaderboardInput2" class="form-control" placeholder="' + _lmxE('lmx.ex.nickname') + '" data-i18n-placeholder="lmx.ex.nickname" value="" style="margin-top: 0px; margin-right: 2px; width: 30%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        //' <input id="TeamboardInput2" class="form-control" placeholder="' + _lmxE('lmx.ex.nickname') + '" data-i18n-placeholder="lmx.ex.nickname" value="" style="margin-top: 0px; margin-left: 2px; width: 30%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        '<input id="LeaderboardInput3" class="form-control" placeholder="' + _lmxE('lmx.ex.nickname') + '" data-i18n-placeholder="lmx.ex.nickname" value="" style="margin-top: 0px; margin-right: 2px; width: 30%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        //' <input id="TeamboardInput3" class="form-control" placeholder="' + _lmxE('lmx.ex.nickname') + '" data-i18n-placeholder="lmx.ex.nickname" value="" style="margin-top: 0px; margin-left: 2px; width: 30%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        '<input id="LeaderboardInput4" class="form-control" placeholder="' + _lmxE('lmx.ex.nickname') + '" data-i18n-placeholder="lmx.ex.nickname" value="" style="margin-top: 0px; margin-right: 2px; width: 30%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        //' <input id="TeamboardInput4" class="form-control" placeholder="' + _lmxE('lmx.ex.nickname') + '" data-i18n-placeholder="lmx.ex.nickname" value="" style="margin-top: 0px; margin-left: 2px; width: 30%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        '<input id="LeaderboardInput5" class="form-control" placeholder="' + _lmxE('lmx.ex.nickname') + '" data-i18n-placeholder="lmx.ex.nickname" value="" style="margin-top: 0px; margin-right: 2px; width: 30%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        //' <input id="TeamboardInput5" class="form-control" placeholder="' + _lmxE('lmx.ex.nickname') + '" data-i18n-placeholder="lmx.ex.nickname" value="" style="margin-top: 0px; margin-left: 2px; width: 30%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        '<input id="LeaderboardInput6" class="form-control" placeholder="' + _lmxE('lmx.ex.nickname') + '" data-i18n-placeholder="lmx.ex.nickname" value="" style="margin-top: 0px; margin-right: 2px; width: 30%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        //' <input id="TeamboardInput6" class="form-control" placeholder="' + _lmxE('lmx.ex.nickname') + '" data-i18n-placeholder="lmx.ex.nickname" value="" style="margin-top: 0px; margin-left: 2px; width: 30%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        '<input id="LeaderboardInput7" class="form-control" placeholder="' + _lmxE('lmx.ex.nickname') + '" data-i18n-placeholder="lmx.ex.nickname" value="" style="margin-top: 0px; margin-right: 2px; width: 30%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        //' <input id="TeamboardInput7" class="form-control" placeholder="' + _lmxE('lmx.ex.nickname') + '" data-i18n-placeholder="lmx.ex.nickname" value="" style="margin-top: 0px; margin-left: 2px; width: 30%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        '<input id="LeaderboardInput8" class="form-control" placeholder="' + _lmxE('lmx.ex.nickname') + '" data-i18n-placeholder="lmx.ex.nickname" value="" style="margin-top: 0px; margin-right: 2px; width: 30%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        //' <input id="TeamboardInput8" class="form-control" placeholder="' + _lmxE('lmx.ex.nickname') + '" data-i18n-placeholder="lmx.ex.nickname" value="" style="margin-top: 0px; margin-left: 2px; width: 30%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        '<input id="LeaderboardInput9" class="form-control" placeholder="' + _lmxE('lmx.ex.nickname') + '" data-i18n-placeholder="lmx.ex.nickname" value="" style="margin-top: 0px; margin-right: 2px; width: 30%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        // ' <input id="TeamboardInput9" class="form-control" placeholder="' + _lmxE('lmx.ex.nickname') + '" data-i18n-placeholder="lmx.ex.nickname" value="" style="margin-top: 0px; margin-left: 2px; width: 30%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        '<input id="LeaderboardInput10" class="form-control" placeholder="' + _lmxE('lmx.ex.nickname') + '" data-i18n-placeholder="lmx.ex.nickname" value="" style="margin-top: 0px; margin-right: 2px; width: 30%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        //' <input id="TeamboardInput10" class="form-control" placeholder="' + _lmxE('lmx.ex.nickname') + '" data-i18n-placeholder="lmx.ex.nickname" value="" style="margin-top: 0px; margin-left: 2px; width: 30%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="" >' +
        '</div><p style="color:var(--lm-tc2,#fff); font-size:12px" align="middle">' + Premadeletter121 + '<br>' + Premadeletter122 + '</u></p>' +
        '</div>' +
        '</div></div></div></div>');
    $('#LeaderboardInput1').css('width', '60%');
    $('#LeaderboardInput2').css('width', '60%');
    $('#LeaderboardInput3').css('width', '60%');
    $('#LeaderboardInput4').css('width', '60%');
    $('#LeaderboardInput5').css('width', '60%');
    $('#LeaderboardInput6').css('width', '60%');
    $('#LeaderboardInput7').css('width', '60%');
    $('#LeaderboardInput8').css('width', '60%');
    $('#LeaderboardInput9').css('width', '60%');
    $('#LeaderboardInput10').css('width', '60%');
    /*$('#LeaderboardInput1').copyCSS('#server-token').css('width', '60%');
    $('#LeaderboardInput2').copyCSS('#server-token').css('width', '60%');
    $('#LeaderboardInput3').copyCSS('#server-token').css('width', '60%');
    $('#LeaderboardInput4').copyCSS('#server-token').css('width', '60%');
    $('#LeaderboardInput5').copyCSS('#server-token').css('width', '60%');
    $('#LeaderboardInput6').copyCSS('#server-token').css('width', '60%');
    $('#LeaderboardInput7').copyCSS('#server-token').css('width', '60%');
    $('#LeaderboardInput8').copyCSS('#server-token').css('width', '60%');
    $('#LeaderboardInput9').copyCSS('#server-token').css('width', '60%');
    $('#LeaderboardInput10').copyCSS('#server-token').css('width', '60%');
	
    $('#TeamboardInput1').copyCSS('#server-token').css('width', '30%');
    $('#TeamboardInput2').copyCSS('#server-token').css('width', '30%');
    $('#TeamboardInput3').copyCSS('#server-token').css('width', '30%');
    $('#TeamboardInput4').copyCSS('#server-token').css('width', '30%');
    $('#TeamboardInput5').copyCSS('#server-token').css('width', '30%');
    $('#TeamboardInput6').copyCSS('#server-token').css('width', '30%');
    $('#TeamboardInput7').copyCSS('#server-token').css('width', '30%');
    $('#TeamboardInput8').copyCSS('#server-token').css('width', '30%');
    $('#TeamboardInput9').copyCSS('#server-token').css('width', '30%');
    $('#TeamboardInput10').copyCSS('#server-token').css('width', '30%');
    */
    if (typeof lmPromoChrome === 'function') lmPromoChrome('#SkinChanger');
    OthersSkinChanger();
    SkinBtnsPut();
    OpenSkinChanger();
}
function SkinBtnsPut() {
    $("#LeaderboardInput1").after('<button id="LeaderboardIconFake1" class="btn btn-info" style="background-color: transparent;" onclick="Leader11();return false;"><i class="fa fa-wpexplorer"></i></button>');
    $("#LeaderboardInput2").after('<button id="LeaderboardIconFake2" class="btn btn-info" style="background-color: transparent;" onclick="Leader12();return false;"><i class="fa fa-wpexplorer"></i></button>');
    $("#LeaderboardInput3").after('<button id="LeaderboardIconFake3" class="btn btn-info" style="background-color: transparent;" onclick="Leader13();return false;"><i class="fa fa-wpexplorer"></i></button>');
    $("#LeaderboardInput4").after('<button id="LeaderboardIconFake4" class="btn btn-info" style="background-color: transparent;" onclick="Leader14();return false;"><i class="fa fa-wpexplorer"></i></button>');
    $("#LeaderboardInput5").after('<button id="LeaderboardIconFake5" class="btn btn-info" style="background-color: transparent;" onclick="Leader15();return false;"><i class="fa fa-wpexplorer"></i></button>');
    $("#LeaderboardInput6").after('<button id="LeaderboardIconFake6" class="btn btn-info" style="background-color: transparent;" onclick="Leader16();return false;"><i class="fa fa-wpexplorer"></i></button>');
    $("#LeaderboardInput7").after('<button id="LeaderboardIconFake7" class="btn btn-info" style="background-color: transparent;" onclick="Leader17();return false;"><i class="fa fa-wpexplorer"></i></button>');
    $("#LeaderboardInput8").after('<button id="LeaderboardIconFake8" class="btn btn-info" style="background-color: transparent;" onclick="Leader18();return false;"><i class="fa fa-wpexplorer"></i></button>');
    $("#LeaderboardInput9").after('<button id="LeaderboardIconFake9" class="btn btn-info" style="background-color: transparent;" onclick="Leader19();return false;"><i class="fa fa-wpexplorer"></i></button>');
    $("#LeaderboardInput10").after('<button id="LeaderboardIconFake10" class="btn btn-info" style="background-color: transparent;" onclick="Leader20();return false;"><i class="fa fa-wpexplorer"></i></button>');


    $("#TeamboardInput1").before('<button id="TeamboardIconFake1" class="btn btn-info" style="background-color: transparent;" onclick="Teamer11();return false;"><i class="fa fa-wpexplorer"></i></button>');
    $("#TeamboardInput2").before('<button id="TeamboardIconFake2" class="btn btn-info" style="background-color: transparent;" onclick="Teamer12();return false;"><i class="fa fa-wpexplorer"></i></button>');
    $("#TeamboardInput3").before('<button id="TeamboardIconFake3" class="btn btn-info" style="background-color: transparent;" onclick="Teamer13();return false;"><i class="fa fa-wpexplorer"></i></button>');
    $("#TeamboardInput4").before('<button id="TeamboardIconFake4" class="btn btn-info" style="background-color: transparent;" onclick="Teamer14();return false;"><i class="fa fa-wpexplorer"></i></button>');
    $("#TeamboardInput5").before('<button id="TeamboardIconFake5" class="btn btn-info" style="background-color: transparent;" onclick="Teamer15();return false;"><i class="fa fa-wpexplorer"></i></button>');
    $("#TeamboardInput6").before('<button id="TeamboardIconFake6" class="btn btn-info" style="background-color: transparent;" onclick="Teamer16();return false;"><i class="fa fa-wpexplorer"></i></button>');
    $("#TeamboardInput7").before('<button id="TeamboardIconFake7" class="btn btn-info" style="background-color: transparent;" onclick="Teamer17();return false;"><i class="fa fa-wpexplorer"></i></button>');
    $("#TeamboardInput8").before('<button id="TeamboardIconFake8" class="btn btn-info" style="background-color: transparent;" onclick="Teamer18();return false;"><i class="fa fa-wpexplorer"></i></button>');
    $("#TeamboardInput9").before('<button id="TeamboardIconFake9" class="btn btn-info" style="background-color: transparent;" onclick="Teamer19();return false;"><i class="fa fa-wpexplorer"></i></button>');
    $("#TeamboardInput10").before('<button id="TeamboardIconFake10" class="btn btn-info" style="background-color: transparent;" onclick="Teamer20();return false;"><i class="fa fa-wpexplorer"></i></button>');

}

function OthersSkinChanger() {
    //var leaderboardnames = [$("#leaderboard-positions").text().split('1. ').pop().split('2. ')[0], $("#leaderboard-positions").text().split('2. ').pop().split('3. ')[0], $("#leaderboard-positions").text().split('3. ').pop().split('4. ')[0], $("#leaderboard-positions").text().split('4. ').pop().split('5. ')[0], $("#leaderboard-positions").text().split('5. ').pop().split('6. ')[0], $("#leaderboard-positions").text().split('6. ').pop().split('7. ')[0], $("#leaderboard-positions").text().split('7. ').pop().split('8. ')[0], $("#leaderboard-positions").text().split('8. ').pop().split('9. ')[0], $("#leaderboard-positions").text().split('9. ').pop().split('10. ')[0], $("#leaderboard-positions").text().split('10. ').pop().split('11. ')[0]];
    //$(".team-top-limit")[2].click();
    /*
        var Top5b = {};
        var Top5c = {};
        var Top5d = {};
        var Top5a = $("#top5-pos").text();
        for (var n = 1; n <= 21; n++) {
            Top5b[n] = Top5a.split('[')[n];
            if (Top5b[n] != null) {
                Top5c[n] = Top5b[n].split('] ')[1];
                Top5d[n] = Top5c[n].slice(0, -1);
            } else {
                Top5d[n - 1] = Top5c[n - 1];
                break;
            }
            console.log(Top5d[n]);
        }
    
    
        $("#LeaderboardInput1").val(leaderboardnames[0]);
        $("#LeaderboardInput2").val(leaderboardnames[1]);
        $("#LeaderboardInput3").val(leaderboardnames[2]);
        $("#LeaderboardInput4").val(leaderboardnames[3]);
        $("#LeaderboardInput5").val(leaderboardnames[4]);
        $("#LeaderboardInput6").val(leaderboardnames[5]);
        $("#LeaderboardInput7").val(leaderboardnames[6]);
        $("#LeaderboardInput8").val(leaderboardnames[7]);
        $("#LeaderboardInput9").val(leaderboardnames[8]);
        $("#LeaderboardInput10").val(leaderboardnames[9]);
    /*
        $("#TeamboardInput1").val(Top5d[1]);
        $("#TeamboardInput2").val(Top5d[2]);
        $("#TeamboardInput3").val(Top5d[3]);
        $("#TeamboardInput4").val(Top5d[4]);
        $("#TeamboardInput5").val(Top5d[5]);
        $("#TeamboardInput6").val(Top5d[6]);
        $("#TeamboardInput7").val(Top5d[7]);
        $("#TeamboardInput8").val(Top5d[8]);
        $("#TeamboardInput9").val(Top5d[9]);
        $("#TeamboardInput10").val(Top5d[10]);
    */
    for (var i = 0; i < 10; i++) {
        var x = i + 1;
        if (application.teamPlayers[i]) {
            $("#TeamboardInput" + x).val(application.teamPlayers[i].nick);
        }
        if (legendmod.leaderboard[i]) {
            $("#LeaderboardInput" + x).val(legendmod.leaderboard[i].nick);
        }
    }
}






/* the menu panels that were shown come back on close (ogario.v4.js lmMenuPanelsHide) */
function exitSkinChanger() {
    if (typeof lmMenuPanelsRestore === 'function') lmMenuPanelsRestore();
    else $("#main-menu, #skins-panel, #quick-menu, #exp-bar").show();
    $("#SkinChanger").remove();
}

function OpenSkinChanger() {
    if (typeof lmMenuPanelsHide === 'function') lmMenuPanelsHide();
    else $("#main-menu, #skins-panel, #quick-menu, #exp-bar").hide();
    $("#SkinChanger").show().addClass('in').attr('aria-hidden', 'false');
    if (typeof lmPromoCentre === 'function') lmPromoCentre('#SkinChanger');
}

//function LeaderboardController(){core.registerSkin(otherMsg, null, 'https://www.legendmod.ml/banners/iconfake1.png', 1, null);}
function fakeSkinReport(nick) {
    if (nick) {
        ogarcopythelb.skinURLBefore = ogarcopythelb.skinURL
        ogarcopythelb.nickBefore = ogarcopythelb.nick
        ogarcopythelb.playerColorBefore = ogario.playerColor
        ogarcopythelb.playBefore = ogario.play

        ogarcopythelb.nick = nick

        ogarcopythelb.skinURL = "https://www.legendmod.ml/banners/iconfake1.png"
        ogario.play = true
        ogario.playerColor = true
        application.sendServerJoin()

        application.sendPlayerUpdate()
        application.sendPlayerJoin()
        //}

        //setTimeout(function() {
        ogarcopythelb.skinURL = ogarcopythelb.skinURLBefore
        ogarcopythelb.nick = ogarcopythelb.nickBefore
        ogario.playerColor = ogarcopythelb.playerColorBefore
        ogario.play = ogarcopythelb.playBefore
        ogarcopythelb.skinURLBefore = null
        ogarcopythelb.nickBefore = null
        ogarcopythelb.playerColorBefore = null
        ogarcopythelb.playBefore = null
        //}, 100);
    }
}
function prevnamereturner() {
    return previousnickname = $("#nick").val();
}

function ogarioplayfalse() {
    ogario.play = false;
    return false;
}

function Leader11() {
    //prevnamereturner();
    fakeSkinReport($('#LeaderboardInput1').val())
    //$("#nick").val($('#LeaderboardInput1').val());
}

function Leader12() {
    fakeSkinReport($('#LeaderboardInput2').val())
}

function Leader13() {
    fakeSkinReport($('#LeaderboardInput3').val())
}

function Leader14() {
    fakeSkinReport($('#LeaderboardInput4').val())
}

function Leader15() {
    fakeSkinReport($('#LeaderboardInput5').val())
}

function Leader16() {
    fakeSkinReport($('#LeaderboardInput6').val())
}

function Leader17() {
    fakeSkinReport($('#LeaderboardInput7').val())
}

function Leader18() {
    fakeSkinReport($('#LeaderboardInput8').val())
}

function Leader19() {
    fakeSkinReport($('#LeaderboardInput9').val())
}

function Leader20() {
    fakeSkinReport($('#LeaderboardInput10').val())
}

function Teamer11() {
    fakeSkinReport($('#TeamboardInput1').val())
}

function Teamer12() {
    fakeSkinReport($('#TeamboardInput2').val())
}

function Teamer13() {
    fakeSkinReport($('#TeamboardInput3').val())
}

function Teamer14() {
    fakeSkinReport($('#TeamboardInput4').val())
}

function Teamer15() {
    fakeSkinReport($('#TeamboardInput5').val())
}

function Teamer16() {
    fakeSkinReport($('#TeamboardInput6').val())
}

function Teamer17() {
    fakeSkinReport($('#TeamboardInput7').val())
}

function Teamer18() {
    fakeSkinReport($('#TeamboardInput8').val())
}

function Teamer19() {
    fakeSkinReport($('#TeamboardInput9').val())
}

function Teamer20() {
    fakeSkinReport($('#TeamboardInput10').val())
}

/* returns true when the browser copied the text (callers that ignore it are unchanged) */
function copy(text) {
    var ok = false;
    $("#tempCopy").val(text);
    $("#tempCopy").show();
    $("#tempCopy").select();
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    $("#tempCopy").hide();
    $("#tempCopy").val("");
    return ok;
}
function LegendSettingsfirst() {
    $('#export-settings').before('<label><input type="checkbox" id="export-LegendSettings" class="js-switch" data-switchery="true" checked style="display: none;"> <span data-i18n="lmx.ex.legendModSettings">' + _lmxE('lmx.ex.legendModSettings') + '</span></label>');
    var elemLegendSwitch = document.querySelector('#export-LegendSettings');
    var ogarioswitchbackcolor = $("input#export-ogarioThemeSettings.js-switch").next().css("background-color");
    var switcheryLegendSwitch = new Switchery(elemLegendSwitch, {
        size: 'small',
        color: ogarioswitchbackcolor,
        jackColor: 'rgb(250, 250, 250)'
    });
    $('#import-settings').before('<label><input type="checkbox" id="import-LegendSettings" class="js-switch" data-switchery="true" checked style="display: none;"> <span data-i18n="lmx.ex.legendModSettings">' + _lmxE('lmx.ex.legendModSettings') + '</span></label>');
    var elemLegendSwitch2 = document.querySelector('#import-LegendSettings');
    var switcheryLegendSwitch2 = new Switchery(elemLegendSwitch2, {
        size: 'small',
        color: ogarioswitchbackcolor,
        jackColor: 'rgb(250, 250, 250)'
    });

    try { LegendJSON = JSON.parse(document.getElementById("export-settings").value); } catch (e) { console.warn("Invalid settings JSON:", e); }
    LegendSettingsfirstAPI(LegendJSON, switcheryLegendSwitch);
    $("#export-settings-btn").click(function () {
        /* ogario's export handler is bound on document, so it runs after this one and
         * rewrote the text without the API part (also what Upload sends): add it after that. */
        setTimeout(function () {
            LegendSettingsfirstAPI(LegendJSON, switcheryLegendSwitch);
            if (copy($("#export-settings").val()) && window.toastr) toastr.success(_lmxT('lmx.ex.settingsCopied'));
        }, 0);
    });

    /* Save the export as a file and load an import from a file (no copy/paste needed) */
    if (!document.getElementById('lm-export-download')) {
        $('<button id="lm-export-download" class="btn btn-block btn-primary" type="button" data-i18n="lmx.ex.downloadSettings">' + _lmxE('lmx.ex.downloadSettings') + '</button>')
            .insertAfter('#export-settings-btn')
            .on('click', function () {
                var text = $('#export-settings').val() || '';
                if (!text) { if (window.toastr) toastr.warning(_lmxT('lmx.ex.pressExportFirst')); return; }
                var a = document.createElement('a');
                a.href = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
                a.download = 'legendmod-settings.json';
                document.body.appendChild(a);
                a.click();
                a.remove();
                setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
            });
        var fileIn = $('<input type="file" accept=".json,.txt,application/json,text/plain" style="display:none">');
        $('<button id="lm-import-file" class="btn btn-block btn-primary" type="button" data-i18n="lmx.ex.loadSettingsFile">' + _lmxE('lmx.ex.loadSettingsFile') + '</button>')
            .insertBefore('#import-settings')
            .on('click', function () { fileIn.val(''); fileIn.trigger('click'); });
        fileIn.insertBefore('#import-settings').on('change', function () {
            var file = this.files && this.files[0];
            if (!file) return;
            var reader = new FileReader();
            reader.onload = function () {
                $('#import-settings').val(String(reader.result || ''));
                if (window.toastr) toastr.info(_lmxT('lmx.ex.fileLoaded'));
            };
            reader.onerror = function () { if (window.toastr) toastr.error(_lmxT('lmx.ex.fileReadError')); };
            reader.readAsText(file);
        });
    }

    $("#import-settings-btn").clone().insertAfter("#import-settings-btn").attr('id', 'import-settings-btn2');

    $("#import-settings-btn").hide();
    $("#import-settings-btn2").click(function () {
        LegendSettingsImport(switcheryLegendSwitch2);
        return switcheryLegendSwitch, switcheryLegendSwitch2;
    });

}

function LegendSettingsfirstAPI(LegendJSON, switcheryLegendSwitch) {
    if (switcheryLegendSwitch.isChecked()) {
        try { LegendJSON = JSON.parse(document.getElementById("export-settings").value); } catch (e) { console.warn("Invalid settings JSON:", e); return; }
        parseLegendJSONAPI(LegendJSON);
        var LegendJSONnice = JSON.stringify(LegendJSON, null, 4);
        document.getElementById("export-settings").value = LegendJSONnice;
    } else {
        try { LegendJSON = JSON.parse(document.getElementById("export-settings").value); } catch (e) { console.warn("Invalid settings JSON:", e); return; }
        parseLegendJSONAPI(LegendJSON);
        delete LegendJSON.legendSettings;
        var LegendJSONnice = JSON.stringify(LegendJSON, null, 4);
        document.getElementById("export-settings").value = LegendJSONnice;
    }
    return LegendJSON;
}

function parseLegendJSONAPI(LegendJSON) {


    LegendJSON.legendSettings = {};
    LegendJSON.legendSettings.previousMode = localStorage.getItem("gamemode");
    LegendJSON.legendSettings.checkonlyonce = localStorage.getItem("checkonlyonce");
    LegendJSON.legendSettings.previousnickname = localStorage.getItem("previousnickname");
    LegendJSON.legendSettings.showToken = localStorage.getItem("showTK");
    LegendJSON.legendSettings.showPlayer = localStorage.getItem("showPlayer");
    LegendJSON.legendSettings.SHOSHOBtn = localStorage.getItem("SHOSHOBtn");
    /* Rounded / Square HUD is a theme setting now (hudRoundedCorners); the stopwatch is removed */
    LegendJSON.legendSettings.timesopened = localStorage.getItem("timesopened");

    /* Dying Light: its switch is the gameplay setting dyingLight (exported with ogarioSettings) */
    LegendJSON.legendSettings.languagemod = localStorage.getItem("languagemod");

    LegendJSON.legendSettings.lastIP = localStorage.getItem("lastIP");
    if (LegendJSON.legendSettings.lastIP == "null" || LegendJSON.legendSettings.lastIP == null) {
        LegendJSON.legendSettings.lastIP = "0.0.0.0:0"
    };
    LegendJSON.legendSettings.note1 = localStorage.getItem("note1");
    if (LegendJSON.legendSettings.note1 == "null" || LegendJSON.legendSettings.note1 == null) {
        LegendJSON.legendSettings.note1 = ""
    };
    LegendJSON.legendSettings.note2 = localStorage.getItem("note2");
    if (LegendJSON.legendSettings.note2 == "null" || LegendJSON.legendSettings.note2 == null) {
        LegendJSON.legendSettings.note2 = ""
    };
    LegendJSON.legendSettings.note3 = localStorage.getItem("note3");
    if (LegendJSON.legendSettings.note3 == "null" || LegendJSON.legendSettings.note3 == null) {
        LegendJSON.legendSettings.note3 = ""
    };
    LegendJSON.legendSettings.note4 = localStorage.getItem("note4");
    if (LegendJSON.legendSettings.note4 == "null" || LegendJSON.legendSettings.note4 == null) {
        LegendJSON.legendSettings.note4 = ""
    };
    LegendJSON.legendSettings.note5 = localStorage.getItem("note5");
    if (LegendJSON.legendSettings.note5 == "null" || LegendJSON.legendSettings.note5 == null) {
        LegendJSON.legendSettings.note5 = ""
    };
    LegendJSON.legendSettings.note6 = localStorage.getItem("note6");
    if (LegendJSON.legendSettings.note6 == "null" || LegendJSON.legendSettings.note6 == null) {
        LegendJSON.legendSettings.note6 = ""
    };
    LegendJSON.legendSettings.note7 = localStorage.getItem("note7");
    if (LegendJSON.legendSettings.note7 == "null" || LegendJSON.legendSettings.note7 == null) {
        LegendJSON.legendSettings.note7 = ""
    };
    LegendJSON.legendSettings.minimapbckimg = localStorage.getItem("minimapbckimg");
    if (LegendJSON.legendSettings.minimapbckimg == "null" || LegendJSON.legendSettings.minimapbckimg == null) {
        LegendJSON.legendSettings.minimapbckimg = ""
    };
    LegendJSON.legendSettings.teambimg = localStorage.getItem("teambimg");
    if (LegendJSON.legendSettings.teambimg == "null" || LegendJSON.legendSettings.teambimg == null) {
        LegendJSON.legendSettings.teambimg = ""
    };
    LegendJSON.legendSettings.canvasbimg = localStorage.getItem("canvasbimg");
    if (LegendJSON.legendSettings.canvasbimg == "null" || LegendJSON.legendSettings.canvasbimg == null) {
        LegendJSON.legendSettings.canvasbimg = ""
    };
    LegendJSON.legendSettings.leadbtext = localStorage.getItem("leadbtext");
    if (LegendJSON.legendSettings.leadbtext == "null" || LegendJSON.legendSettings.leadbtext == null) {
        LegendJSON.legendSettings.leadbtext = ""
    };
    LegendJSON.legendSettings.leadbimg = localStorage.getItem("leadbimg");
    if (LegendJSON.legendSettings.leadbimg == "null" || LegendJSON.legendSettings.leadbimg == null) {
        LegendJSON.legendSettings.leadbimg = ""
    };
    LegendJSON.legendSettings.teambtext = localStorage.getItem("teambtext");
    if (LegendJSON.legendSettings.teambtext == "null" || LegendJSON.legendSettings.teambtext == null) {
        LegendJSON.legendSettings.teambtext = ""
    };
    /* imgUrl / imgHref: the old "Main Banner" fields (no longer in the menu, nothing shows them);
     * a stored value still goes out and comes back with the settings, for older versions */
    LegendJSON.legendSettings.imgUrl = localStorage.getItem("imgUrl");
    if (LegendJSON.legendSettings.imgUrl == "null" || LegendJSON.legendSettings.imgUrl == null) {
        LegendJSON.legendSettings.imgUrl = ""
    };
    LegendJSON.legendSettings.imgHref = localStorage.getItem("imgHref");
    if (LegendJSON.legendSettings.imgHref == "null" || LegendJSON.legendSettings.imgHref == null) {
        LegendJSON.legendSettings.imgHref = ""
    };
    LegendJSON.legendSettings.pic1urlimg = localStorage.getItem("pic1urlimg");
    if (LegendJSON.legendSettings.pic1urlimg == "null" || LegendJSON.legendSettings.pic1urlimg == null) {
        LegendJSON.legendSettings.pic1urlimg = ""
    };
    LegendJSON.legendSettings.pic2urlimg = localStorage.getItem("pic2urlimg");
    if (LegendJSON.legendSettings.pic2urlimg == "null" || LegendJSON.legendSettings.pic2urlimg == null) {
        LegendJSON.legendSettings.pic2urlimg = ""
    };
    LegendJSON.legendSettings.pic3urlimg = localStorage.getItem("pic3urlimg");
    if (LegendJSON.legendSettings.pic3urlimg == "null" || LegendJSON.legendSettings.pic3urlimg == null) {
        LegendJSON.legendSettings.pic3urlimg = ""
    };
    LegendJSON.legendSettings.pic4urlimg = localStorage.getItem("pic4urlimg");
    if (LegendJSON.legendSettings.pic4urlimg == "null" || LegendJSON.legendSettings.pic4urlimg == null) {
        LegendJSON.legendSettings.pic4urlimg = ""
    };
    LegendJSON.legendSettings.pic5urlimg = localStorage.getItem("pic5urlimg");
    if (LegendJSON.legendSettings.pic5urlimg == "null" || LegendJSON.legendSettings.pic5urlimg == null) {
        LegendJSON.legendSettings.pic5urlimg = ""
    };
    LegendJSON.legendSettings.pic6urlimg = localStorage.getItem("pic6urlimg");
    if (LegendJSON.legendSettings.pic6urlimg == "null" || LegendJSON.legendSettings.pic6urlimg == null) {
        LegendJSON.legendSettings.pic6urlimg = ""
    };
    LegendJSON.legendSettings.yt1urlimg = localStorage.getItem("yt1urlimg");
    if (LegendJSON.legendSettings.yt1urlimg == "null" || LegendJSON.legendSettings.yt1urlimg == null) {
        LegendJSON.legendSettings.yt1urlimg = ""
    };
    LegendJSON.legendSettings.yt2urlimg = localStorage.getItem("yt2urlimg");
    if (LegendJSON.legendSettings.yt2urlimg == "null" || LegendJSON.legendSettings.yt2urlimg == null) {
        LegendJSON.legendSettings.yt2urlimg = ""
    };
    LegendJSON.legendSettings.yt3urlimg = localStorage.getItem("yt3urlimg");
    if (LegendJSON.legendSettings.yt3urlimg == "null" || LegendJSON.legendSettings.yt3urlimg == null) {
        LegendJSON.legendSettings.yt3urlimg = ""
    };
    LegendJSON.legendSettings.yt4urlimg = localStorage.getItem("yt4urlimg");
    if (LegendJSON.legendSettings.yt4urlimg == "null" || LegendJSON.legendSettings.yt4urlimg == null) {
        LegendJSON.legendSettings.yt4urlimg = ""
    };
    LegendJSON.legendSettings.yt5urlimg = localStorage.getItem("yt5urlimg");
    if (LegendJSON.legendSettings.yt5urlimg == "null" || LegendJSON.legendSettings.yt5urlimg == null) {
        LegendJSON.legendSettings.yt5urlimg = ""
    };
    LegendJSON.legendSettings.yt6urlimg = localStorage.getItem("yt6urlimg");
    if (LegendJSON.legendSettings.yt6urlimg == "null" || LegendJSON.legendSettings.yt6urlimg == null) {
        LegendJSON.legendSettings.yt6urlimg = ""
    };
    LegendJSON.legendSettings.pic1dataimg = localStorage.getItem("pic1dataimg");
    if (LegendJSON.legendSettings.pic1dataimg == "null" || LegendJSON.legendSettings.pic1dataimg == null) {
        LegendJSON.legendSettings.pic1dataimg = ""
    };
    LegendJSON.legendSettings.pic2dataimg = localStorage.getItem("pic2dataimg");
    if (LegendJSON.legendSettings.pic2dataimg == "null" || LegendJSON.legendSettings.pic2dataimg == null) {
        LegendJSON.legendSettings.pic2dataimg = ""
    };
    LegendJSON.legendSettings.pic3dataimg = localStorage.getItem("pic3dataimg");
    if (LegendJSON.legendSettings.pic3dataimg == "null" || LegendJSON.legendSettings.pic3dataimg == null) {
        LegendJSON.legendSettings.pic3dataimg = ""
    };
    LegendJSON.legendSettings.pic4dataimg = localStorage.getItem("pic4dataimg");
    if (LegendJSON.legendSettings.pic4dataimg == "null" || LegendJSON.legendSettings.pic4dataimg == null) {
        LegendJSON.legendSettings.pic4dataimg = ""
    };
    LegendJSON.legendSettings.pic5dataimg = localStorage.getItem("pic5dataimg");
    if (LegendJSON.legendSettings.pic5dataimg == "null" || LegendJSON.legendSettings.pic5dataimg == null) {
        LegendJSON.legendSettings.pic5dataimg = ""
    };
    LegendJSON.legendSettings.pic6dataimg = localStorage.getItem("pic6dataimg");
    if (LegendJSON.legendSettings.pic6dataimg == "null" || LegendJSON.legendSettings.pic6dataimg == null) {
        LegendJSON.legendSettings.pic6dataimg = ""
    };
    LegendJSON.legendSettings.yt1dataimg = localStorage.getItem("yt1dataimg");
    if (LegendJSON.legendSettings.yt1dataimg == "null" || LegendJSON.legendSettings.yt1dataimg == null) {
        LegendJSON.legendSettings.yt1dataimg = ""
    };
    LegendJSON.legendSettings.yt2dataimg = localStorage.getItem("yt2dataimg");
    if (LegendJSON.legendSettings.yt2dataimg == "null" || LegendJSON.legendSettings.yt2dataimg == null) {
        LegendJSON.legendSettings.yt2dataimg = ""
    };
    LegendJSON.legendSettings.yt3dataimg = localStorage.getItem("yt3dataimg");
    if (LegendJSON.legendSettings.yt3dataimg == "null" || LegendJSON.legendSettings.yt3dataimg == null) {
        LegendJSON.legendSettings.yt3dataimg = ""
    };
    LegendJSON.legendSettings.yt4dataimg = localStorage.getItem("yt4dataimg");
    if (LegendJSON.legendSettings.yt4dataimg == "null" || LegendJSON.legendSettings.yt4dataimg == null) {
        LegendJSON.legendSettings.yt4dataimg = ""
    };
    LegendJSON.legendSettings.yt5dataimg = localStorage.getItem("yt5dataimg");
    if (LegendJSON.legendSettings.yt5dataimg == "null" || LegendJSON.legendSettings.yt5dataimg == null) {
        LegendJSON.legendSettings.yt5dataimg = ""
    };
    LegendJSON.legendSettings.yt6dataimg = localStorage.getItem("yt6dataimg");
    if (LegendJSON.legendSettings.yt6dataimg == "null" || LegendJSON.legendSettings.yt6dataimg == null) {
        LegendJSON.legendSettings.yt6dataimg = ""
    };
    LegendJSON.legendSettings.discwebhook1 = localStorage.getItem("discwebhook1");
    if (LegendJSON.legendSettings.discwebhook1 == "null" || LegendJSON.legendSettings.discwebhook1 == null) {
        LegendJSON.legendSettings.discwebhook1 = ""
    };
    LegendJSON.legendSettings.discwebhook2 = localStorage.getItem("discwebhook2");
    if (LegendJSON.legendSettings.discwebhook2 == "null" || LegendJSON.legendSettings.discwebhook2 == null) {
        LegendJSON.legendSettings.discwebhook2 = ""
    };
    LegendJSON.legendSettings.Userscript1 = localStorage.getItem("Userscript1");
    if (LegendJSON.legendSettings.Userscript1 == "null" || LegendJSON.legendSettings.Userscript1 == null) {
        LegendJSON.legendSettings.Userscript1 = ""
    };
    LegendJSON.legendSettings.Userscript2 = localStorage.getItem("Userscript2");
    if (LegendJSON.legendSettings.Userscript2 == "null" || LegendJSON.legendSettings.Userscript2 == null) {
        LegendJSON.legendSettings.Userscript2 = ""
    };
    LegendJSON.legendSettings.Userscript3 = localStorage.getItem("Userscript3");
    if (LegendJSON.legendSettings.Userscript3 == "null" || LegendJSON.legendSettings.Userscript3 == null) {
        LegendJSON.legendSettings.Userscript3 = ""
    };
    LegendJSON.legendSettings.Userscript4 = localStorage.getItem("Userscript4");
    if (LegendJSON.legendSettings.Userscript4 == "null" || LegendJSON.legendSettings.Userscript4 == null) {
        LegendJSON.legendSettings.Userscript4 = ""
    };
    LegendJSON.legendSettings.Userscript5 = localStorage.getItem("Userscript5");
    if (LegendJSON.legendSettings.Userscript5 == "null" || LegendJSON.legendSettings.Userscript5 == null) {
        LegendJSON.legendSettings.Userscript5 = ""
    };
    LegendJSON.legendSettings.Userscripttexture1 = localStorage.getItem("Userscripttexture1");
    if (LegendJSON.legendSettings.Userscripttexture1 == "null" || LegendJSON.legendSettings.Userscripttexture1 == null) {
        LegendJSON.legendSettings.Userscripttexture1 = ""
    };
    LegendJSON.legendSettings.Userscripttexture2 = localStorage.getItem("Userscripttexture2");
    if (LegendJSON.legendSettings.Userscripttexture2 == "null" || LegendJSON.legendSettings.Userscripttexture2 == null) {
        LegendJSON.legendSettings.Userscripttexture2 = ""
    };
    LegendJSON.legendSettings.Userscripttexture3 = localStorage.getItem("Userscripttexture3");
    if (LegendJSON.legendSettings.Userscripttexture3 == "null" || LegendJSON.legendSettings.Userscripttexture3 == null) {
        LegendJSON.legendSettings.Userscripttexture3 = ""
    };
    LegendJSON.legendSettings.Userscripttexture4 = localStorage.getItem("Userscripttexture4");
    if (LegendJSON.legendSettings.Userscripttexture4 == "null" || LegendJSON.legendSettings.Userscripttexture4 == null) {
        LegendJSON.legendSettings.Userscripttexture4 = ""
    };
    LegendJSON.legendSettings.Userscripttexture5 = localStorage.getItem("Userscripttexture5");
    if (LegendJSON.legendSettings.Userscripttexture5 == "null" || LegendJSON.legendSettings.Userscripttexture5 == null) {
        LegendJSON.legendSettings.Userscripttexture5 = ""
    };
    return LegendJSON;
}

function LegendSettingsImport(switcheryLegendSwitch2) {
    if (switcheryLegendSwitch2.isChecked()) {
        try { LegendJSON = JSON.parse(document.getElementById("import-settings").value); } catch (e) {
            console.warn("Invalid import JSON:", e);
            /* the player saw nothing before */
            if (window.toastr) toastr.error(_lmxT('lmx.ex.importInvalid'));
            return;
        }
        //        parseLegendJSONAPI(LegendJSON);
        /* the Legend Mod settings that take effect at the next load (the import's Reload button) */
        window._lmImportReload = [];
        saveLegendJSONAPI();
        setTimeout(function () {
            $("#import-settings-btn").click();
        }, 100)
    } else {
        window._lmImportReload = null;
        $("#import-settings-btn").click();
    }
}

/* Imported settings from older exports can lack keys: do not store the
 * strings "undefined"/"null" for them, keep the current value instead. */
/* Import without a reload (ogario.v4.js importSettings): these keys only remember the last mode,
 * nick, address and open count, and the language switches at once; any other key that changes is
 * read when the page loads, so the import offers a Reload (window._lmImportReload). */
var _LM_IMPORT_LIVE_KEYS = { gamemode: 1, checkonlyonce: 1, previousnickname: 1, timesopened: 1, lastIP: 1 };
function _lmImportSet(key, value) {
    if (value === undefined || value === null) return;
    var before = localStorage.getItem(key);
    localStorage.setItem(key, value);
    if (String(value) === String(before == null ? '' : before)) return;
    if (key === 'languagemod') { _lmImportLanguage(String(value)); return; }
    if (!_LM_IMPORT_LIVE_KEYS[key] && Array.isArray(window._lmImportReload)) window._lmImportReload.push(key);
}
/* the Choose Language path: the menus, lmT and agar.io's texts follow at once */
function _lmImportLanguage(n) {
    try {
        if ($('#legendlanguages').length) { $('#legendlanguages').val(n); changeModLanguage(false); }
        else if (window.LMi18n && typeof window.LMi18n.setLang === 'function') window.LMi18n.setLang(n);
    } catch (e) { }
}

/* Imported user scripts (Userscript1-5 URLs, Userscripttexture1-5 code) ran on
 * every later start without being shown. Ask before importing new ones, unless
 * the cloud download asked for the same values already; a confirmed slot runs
 * at start like one the user loaded. */
function _lmImportUserscripts(ls) {
    var changed = [];
    for (var n = 1; n <= 5; n++) {
        ["Userscript" + n, "Userscripttexture" + n].forEach(function (k) {
            var v = ls[k];
            if (v === undefined || v === null) return;
            if (String(v) === String(localStorage.getItem(k))) return;
            changed.push(k);
        });
    }
    if (!changed.length) return;
    var confirmed = window._lmCloudConfirmedScripts || {};
    var ask = changed.some(function (k) {
        var v = String(ls[k]);
        return v !== "" && v !== "null" && confirmed[k] !== v;
    });
    if (ask && !confirm(_lmxT('lmx.ex.importScriptsAsk', [changed.join(", ")]))) return;
    changed.forEach(function (k) {
        localStorage.setItem(k, ls[k]);
        var slot = k.charAt(k.length - 1);
        var v = String(ls[k]);
        if (v !== "" && v !== "null") localStorage.setItem("UserscriptEnabled" + slot, "1");
    });
    /* a user script runs when the page loads: the import offers a Reload */
    if (Array.isArray(window._lmImportReload)) window._lmImportReload.push('userscripts');
}

function saveLegendJSONAPI() {
    /* pasted text "null" or a number parsed fine and then threw here */
    if (LegendJSON && typeof LegendJSON === 'object' && LegendJSON.legendSettings != undefined) {

        _lmImportSet("gamemode", LegendJSON.legendSettings.previousMode);
        _lmImportSet("checkonlyonce", LegendJSON.legendSettings.checkonlyonce);
        _lmImportSet("previousnickname", LegendJSON.legendSettings.previousnickname);
        _lmImportSet("showTK", LegendJSON.legendSettings.showToken);
        _lmImportSet("showPlayer", LegendJSON.legendSettings.showPlayer);
        _lmImportSet("SHOSHOBtn", LegendJSON.legendSettings.SHOSHOBtn);
        /* an older export's Rounded / Square HUD button: the next start carries it into the theme
         * settings once (loadThemeSettings in ogario.v4.js); its removed stopwatch button is ignored */
        _lmImportSet("MAINBTBtn", LegendJSON.legendSettings.MAINBTBtn);
        _lmImportSet("timesopened", LegendJSON.legendSettings.timesopened);

        /* an older file's Dying Light flag: the next start moves it into the setting dyingLight */
        _lmImportSet("dyinglight1load", LegendJSON.legendSettings.dyinglight1load);
        _lmImportSet("languagemod", LegendJSON.legendSettings.languagemod);

        /* initialMusicUrl of an older export (the removed YouTube player) is ignored */
        _lmImportSet("lastIP", LegendJSON.legendSettings.lastIP);
        _lmImportSet("note1", LegendJSON.legendSettings.note1);
        _lmImportSet("note2", LegendJSON.legendSettings.note2);
        _lmImportSet("note3", LegendJSON.legendSettings.note3);
        _lmImportSet("note4", LegendJSON.legendSettings.note4);
        _lmImportSet("note5", LegendJSON.legendSettings.note5);
        _lmImportSet("note6", LegendJSON.legendSettings.note6);
        _lmImportSet("note7", LegendJSON.legendSettings.note7);
        _lmImportSet("minimapbckimg", LegendJSON.legendSettings.minimapbckimg);
        _lmImportSet("teambimg", LegendJSON.legendSettings.teambimg);
        _lmImportSet("canvasbimg", LegendJSON.legendSettings.canvasbimg);
        _lmImportSet("leadbtext", LegendJSON.legendSettings.leadbtext);
        _lmImportSet("leadbimg", LegendJSON.legendSettings.leadbimg);
        _lmImportSet("teambtext", LegendJSON.legendSettings.teambtext);
        _lmImportSet("imgUrl", LegendJSON.legendSettings.imgUrl);
        _lmImportSet("imgHref", LegendJSON.legendSettings.imgHref);
        _lmImportSet("pic1urlimg", LegendJSON.legendSettings.pic1urlimg);
        _lmImportSet("pic2urlimg", LegendJSON.legendSettings.pic2urlimg);
        _lmImportSet("pic3urlimg", LegendJSON.legendSettings.pic3urlimg);
        _lmImportSet("pic4urlimg", LegendJSON.legendSettings.pic4urlimg);
        _lmImportSet("pic5urlimg", LegendJSON.legendSettings.pic5urlimg);
        _lmImportSet("pic6urlimg", LegendJSON.legendSettings.pic6urlimg);
        _lmImportSet("yt1urlimg", LegendJSON.legendSettings.yt1urlimg);
        _lmImportSet("yt2urlimg", LegendJSON.legendSettings.yt2urlimg);
        _lmImportSet("yt3urlimg", LegendJSON.legendSettings.yt3urlimg);
        _lmImportSet("yt4urlimg", LegendJSON.legendSettings.yt4urlimg);
        _lmImportSet("yt5urlimg", LegendJSON.legendSettings.yt5urlimg);
        _lmImportSet("yt6urlimg", LegendJSON.legendSettings.yt6urlimg);
        _lmImportSet("pic1dataimg", LegendJSON.legendSettings.pic1dataimg);
        _lmImportSet("pic2dataimg", LegendJSON.legendSettings.pic2dataimg);
        _lmImportSet("pic3dataimg", LegendJSON.legendSettings.pic3dataimg);
        _lmImportSet("pic4dataimg", LegendJSON.legendSettings.pic4dataimg);
        _lmImportSet("pic5dataimg", LegendJSON.legendSettings.pic5dataimg);
        _lmImportSet("pic6dataimg", LegendJSON.legendSettings.pic6dataimg);
        _lmImportSet("yt1dataimg", LegendJSON.legendSettings.yt1dataimg);
        _lmImportSet("yt2dataimg", LegendJSON.legendSettings.yt2dataimg);
        _lmImportSet("yt3dataimg", LegendJSON.legendSettings.yt3dataimg);
        _lmImportSet("yt4dataimg", LegendJSON.legendSettings.yt4dataimg);
        _lmImportSet("yt5dataimg", LegendJSON.legendSettings.yt5dataimg);
        _lmImportSet("yt6dataimg", LegendJSON.legendSettings.yt6dataimg);
        _lmImportSet("discwebhook1", LegendJSON.legendSettings.discwebhook1);
        _lmImportSet("discwebhook2", LegendJSON.legendSettings.discwebhook2);
        /* user scripts are code that runs in this page: ask first */
        _lmImportUserscripts(LegendJSON.legendSettings);
    }
}


/* Chat shortcodes come from other players: escape every value put into HTML
 * and accept only plain http(s) links (no quotes, spaces or brackets). */
function _lmEscHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"'`]/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '`': '&#96;' }[c];
    });
}

function _lmYoutubeId(url) {
    var id = getParameterByName("v", url);
    /* YouTube's Share button gives youtu.be/ID?si=..., and Shorts/embed/live links have no ?v= */
    if (!id) {
        var m = String(url || '').match(/(?:youtu\.be\/|\/shorts\/|\/embed\/|\/live\/)([A-Za-z0-9_-]{6,20})/);
        id = m ? m[1] : null;
    }
    return /^[A-Za-z0-9_-]{6,20}$/.test(String(id || '')) ? id : null;
}

/* Several call sites outside the scope that defines escapeHtml use it as a global. */
if (typeof window.escapeHtml !== "function") window.escapeHtml = _lmEscHtml;

/* true when the URL's host matches re ("evil.example/discord.com" is not Discord) */
function _lmHostIs(value, re) {
    try { return re.test(new URL(value).hostname.toLowerCase()); } catch (e) { return false; }
}
function _lmSafeChatUrl(value) {
    return /^https?:\/\/[^\s"'<>`\\]+$/i.test(String(value || ''));
}

function MsgCommands1(MSGCOMMANDS, MSGNICK, MSGEL) {
    MSGNICK = _lmEscHtml(MSGNICK);
    /* remove only the message that carried the command (not every chat line and toast),
     * and only once the command was accepted */
    function _lmRemoveCmdMsg() {
        if (MSGEL && MSGEL.length) MSGEL.remove();
    }
    /* Accept buttons are bound inside the toast toastr returns (_lmToast): visible toasts
     * share the same ids/classes, so a document-wide selector hit the wrong or every toast. */

    if (MSGCOMMANDS.includes("[url]")) {
        MSGCOMMANDS = MSGCOMMANDS.split("[url]").pop();
        MSGCOMMANDS = MSGCOMMANDS.split('[/url]')[0];
        if (!/^https?:\/\//i.test(MSGCOMMANDS)) { /* http:// or https:// in any case */
            MSGCOMMANDS = "https://" + MSGCOMMANDS;
        }
        if (!_lmSafeChatUrl(MSGCOMMANDS)) return;
        if ($("#nick").val().includes("url") == false) _lmRemoveCmdMsg();
        var _lmToast = toastr.warning(Premadeletter22 + ' ' + MSGNICK + ' ' + Premadeletter63 + ': <a id="visiturl" href="' + _lmEscHtml(MSGCOMMANDS) + '" target="_blank"><font color="blue">' + _lmEscHtml(MSGCOMMANDS) + '</font></a></br> <button id="acceptURL" class="btn btn-block btn-info" style="margin-top: 10px;border-color: darkblue;">' + Premadeletter24 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-nodo-hideall" style="width: 100%;margin-top: -10px;">' + Premadeletter25 + '</button>', "", {
            timeOut: 20000,
            extendedTimeOut: 20000
        }).css("width", "250px");
        _lmToast.find("#acceptURL").click(function () {
            window.open(MSGCOMMANDS, '_blank');
        });
    } else if (MSGCOMMANDS.includes("[tag]") && MSGCOMMANDS.includes("[/tag]")) { /* "type [tag] to join" is a sentence */
        if ($("#nick").val().includes("tag") == false) _lmRemoveCmdMsg();
        MSGCOMMANDS = MSGCOMMANDS.split("[tag]").pop();
        MSGCOMMANDS = MSGCOMMANDS.split('[/tag]')[0];
        if (MSGCOMMANDS != "") {
            var _lmToast = toastr.warning(Premadeletter22 + ' ' + MSGNICK + ' ' + _lmxE('pack.wantsYouToUse') + ': <i id="visiturl"><font color="blue">' + _lmEscHtml(MSGCOMMANDS) + '</font></i></br> <button id="acceptURL" class="btn btn-block btn-info" style="margin-top: 10px;border-color: darkblue;">' + Premadeletter24 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-nodo-hideall" style="width: 100%;margin-top: -10px;">' + Premadeletter25 + '</button>', "", {
                timeOut: 20000,
                extendedTimeOut: 20000
            }).css("width", "250px");
            _lmToast.find("#acceptURL").click(function () {
                $("#clantag").val(MSGCOMMANDS);
                $('#clantag').css('background-color', '#ff6347');
                newsubmit();
            });
        } else {
            var _lmToast = toastr.warning(Premadeletter22 + ' ' + MSGNICK + ' ' + _lmxE('pack.wantsYouToRemove') + ': <i id="visiturl"><font color="blue">' + _lmEscHtml(MSGCOMMANDS) + '</font></i></br> <button id="acceptURL" class="btn btn-block btn-info" style="margin-top: 10px;border-color: darkblue;">' + Premadeletter24 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-nodo-hideall" style="width: 100%;margin-top: -10px;">' + Premadeletter25 + '</button>', "", {
                timeOut: 20000,
                extendedTimeOut: 20000
            }).css("width", "250px");
            _lmToast.find("#acceptURL").click(function () {
                $("#clantag").val(MSGCOMMANDS);
                $('#clantag').css('background-color', '#ff6347');
                newsubmit();
            });
        }
    } else if (MSGCOMMANDS.includes("[yut]")) {
        MSGCOMMANDS = MSGCOMMANDS.split("[yut]").pop();
        MSGCOMMANDS = MSGCOMMANDS.split('[/yut]')[0];
        if (!/^https?:\/\//i.test(MSGCOMMANDS)) { /* http:// or https:// in any case */
            MSGCOMMANDS = "https://" + MSGCOMMANDS;
        }
        if (!_lmSafeChatUrl(MSGCOMMANDS)) return;
        var _lmYutId = _lmYoutubeId(MSGCOMMANDS);
        if (!_lmYutId) return;
        /* one standard form (youtu.be / Shorts links included) */
        var _lmYutList = getParameterByName("list", MSGCOMMANDS);
        MSGCOMMANDS = "https://www.youtube.com/watch?v=" + _lmYutId +
            (/^[A-Za-z0-9_-]{6,64}$/.test(String(_lmYutList || '')) ? "&list=" + _lmYutList : "");
        if ($("#nick").val().includes("yut") == false) _lmRemoveCmdMsg();
        /* the YouTube player is gone: the invite opens the video on YouTube, like a [url] invite */
        var _lmToast = toastr.warning(Premadeletter22 + ' ' + MSGNICK + ' ' + Premadeletter63 + ': <a id="visiturl" href="' + _lmEscHtml(MSGCOMMANDS) + '" target="_blank"><font color="blue">' + _lmEscHtml(MSGCOMMANDS) + '</font></a></br> <button id="acceptURL" class="btn btn-block btn-info" style="margin-top: 10px;border-color: darkblue;">' + Premadeletter24 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-nodo-hideall" style="width: 100%;margin-top: -10px;">' + Premadeletter25 + '</button>', "", {
            timeOut: 20000,
            extendedTimeOut: 20000
        }).css("width", "250px");
        _lmToast.find("#acceptURL").click(function () {
            window.open(MSGCOMMANDS, '_blank');
        });
    } else if (MSGCOMMANDS.includes("[discord]")) {
        MSGCOMMANDS = MSGCOMMANDS.split("[discord]").pop();
        MSGCOMMANDS = MSGCOMMANDS.split('[/discord]')[0];
        if (MSGCOMMANDS.includes("https://") == false && MSGCOMMANDS.includes("http://") == false && MSGCOMMANDS.includes("HTTPS://") == false && MSGCOMMANDS.includes("HTTP://") == false) {
            MSGCOMMANDS = "https://" + MSGCOMMANDS;
        }
        if (!_lmSafeChatUrl(MSGCOMMANDS)) return;
        if (_lmHostIs(MSGCOMMANDS, /(^|\.)(discord\.gg|discord\.com|discordapp\.com)$/)) {
            if ($("#nick").val().includes("discord") == false) _lmRemoveCmdMsg();
            var _lmToast = toastr.warning('<img src="https://www.legendmod.ml/banners/icondiscord.png" style="float:left;width:100px;height:100px;">' + Premadeletter22 + ' ' + MSGNICK + ' ' + Premadeletter66 + ': <a id="visiturl" href="' + _lmEscHtml(MSGCOMMANDS) + '" target="_blank"><font color="blue">' + _lmEscHtml(MSGCOMMANDS) + '</font></a></br> <button id="acceptURL" class="btn btn-block btn-info" style="margin-top: 10px;border-color: darkblue;">' + Premadeletter24 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-nodo-hideall" style="width: 100%;margin-top: -10px;">' + Premadeletter25 + '</button>', "", {
                timeOut: 20000,
                extendedTimeOut: 20000
            }).css("width", "300px");
            _lmToast.find("#acceptURL").click(function () {
                window.open(MSGCOMMANDS, '_blank');
            });
        }
    } else if (MSGCOMMANDS.includes("Legend.Mod&?player=")) { /* the format dosendmsgcommand sends; a sentence naming Legend.Mod was deleted */

        playerMsg = getParameterByName("player", MSGCOMMANDS);
        commandMsg = getParameterByName("com", MSGCOMMANDS);
        otherMsg = getParameterByName("do", MSGCOMMANDS);
        //		$( ".toast.toast-success" ).text("");
        //		$(".message-text").text();.hide();
        _lmRemoveCmdMsg();
        //without confirmation
        if (commandMsg == "Team5") {
            $("#top5-hud").css('background-image', 'url(" https://www.legendmod.ml/banners/icogeneral.gif ")').css({
                opacity: 0.8
            });
            setTimeout(function () {
                /* put back the player's own team-board image (it was wiped until reload) */
                lmHudBgImage("#top5-hud", lmHudBgSaved("teambimg"));
            }, 12000);
        } else if (commandMsg == "Hello") {
            if ($('#message-box').css('display') == 'none') {
                if ($("#clantag").val() != "") {
                    /* a second Hello within 5 s saved "Hello Team" as the nick to restore */
                    if (window._lmHelloNick == null) window._lmHelloNick = $("#nick").val();
                    clearTimeout(window._lmHelloT);
                    $("#nick").val("Hello Team");
                    $("#helloContainer").show();
                    newsubmit();
                    window._lmHelloT = setTimeout(function () {
                        $("#nick").val(window._lmHelloNick);
                        window._lmHelloNick = null;
                        $("#helloContainer").show();
                        newsubmit();
                    }, 5000);
                }
            }
        }

        //with confirmation
        else if (commandMsg == "HideAll") {
            var _lmToast = toastr.warning(Premadeletter22 + ' ' + _lmEscHtml(playerMsg) + ' ' + Premadeletter23 + '</br> <button class="btn btn-sm btn-primary btn-play btn-do-hideall" style="margin-top: 10px;border-color: darkblue;">' + Premadeletter24 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-nodo-hideall" style="width: 100%;margin-top: 10px;">' + Premadeletter25 + '</button>', "", {
                timeOut: 20000,
                extendedTimeOut: 20000
            }).css("width", "210px");
            _lmToast.find(".btn.btn-sm.btn-primary.btn-play.btn-do-hideall").click(function () {
                $("#HideAllBthn").click();
            });
        } else if (commandMsg == "NamePerm") {
            var _lmToast = toastr.warning(Premadeletter22 + ' ' + _lmEscHtml(playerMsg) + ' ' + Premadeletter26 + ': ' + _lmEscHtml(playerMsg) + ' </br> <button class="btn btn-sm btn-primary btn-play btn-do-NamePerm" style="margin-top: 10px;border-color: darkblue;">' + Premadeletter24 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-nodo-NamePerm" style="width: 100%;margin-top: 10px;">' + Premadeletter25 + '</button>', "", {
                timeOut: 20000,
                extendedTimeOut: 20000
            }).css("width", "210px");
            _lmToast.find(".btn.btn-sm.btn-primary.btn-play.btn-do-NamePerm").click(function () {
                $("#nick").val(playerMsg);
                $("#helloContainer").show();
                newsubmit();
            });
        } else if (commandMsg == "dTroll2") {
            var _lmToast = toastr.warning(Premadeletter22 + ' ' + _lmEscHtml(playerMsg) + ' ' + Premadeletter27 + '</br> <button class="btn btn-sm btn-primary btn-play btn-do-troll" style="margin-top: 10px;border-color: darkblue;">' + Premadeletter24 + '</button><br><button class="btn btn-sm btn-warning btn-spectate btn-nodo-troll" style="width: 100%;margin-top: 10px;">' + Premadeletter25 + '</button>', "", {
                timeOut: 20000,
                extendedTimeOut: 20000
            }).css("width", "210px");
            _lmToast.find(".btn.btn-sm.btn-primary.btn-play.btn-do-troll").click(function () {
                settrolling();
            });
        }

    } else if (MSGCOMMANDS.includes("https://agar.io/sip=151.80.91.73:1511")) {
        commandMsg = getParameterByName("com", MSGCOMMANDS);
        otherMsg = getParameterByName("do", MSGCOMMANDS);
        _lmRemoveCmdMsg();
        LegendClanSymbol = $("#nick").val();
        console.log("Step1");
        /* everyone except nicks starting with the clan symbol is asked to rejoin.
         * Any chat sender can type this text, so it never reconnects by itself:
         * the user has to press the button. */
        if (LegendClanSymbol.indexOf("℄") !== 0) {
            console.log("Step2");
            var _lmRejoinToast = toastr.warning(_lmxT('lmx.ex.asksReconnect', ["<b>" + MSGNICK + "</b>"]) + '<br><button class="btn btn-sm btn-primary btn-lm-rejoin" style="margin-top: 10px;border-color: darkblue;">' + _lmxE('lmx.ex.reconnect') + '</button><br><button class="btn btn-sm btn-warning btn-lm-norejoin" style="width: 100%;margin-top: 10px;">' + Premadeletter25 + '</button>', "", {
                timeOut: 20000,
                extendedTimeOut: 20000
            }).css("width", "210px");
            _lmRejoinToast.find(".btn-lm-rejoin").click(function () {
                $("#server-join").click();
            });
        }
    } else if (MSGCOMMANDS.includes("[DosAttack]")) {
        if ($("#nick").val().includes("DosAttack") == false) _lmRemoveCmdMsg();
        MSGCOMMANDS = MSGCOMMANDS.split("[DosAttack]").pop();
        MSGCOMMANDS = MSGCOMMANDS.split('[/DosAttack]')[0];
        var nameArr = MSGCOMMANDS.split(',');
        /* missing or bad coordinates showed "Attack NaN" and drew the marker at NaN */
        if (!isFinite(parseFloat(nameArr[0])) || !isFinite(parseFloat(nameArr[1]))) return;
        window.targetingLeadclientX = nameArr[0]
        window.targetingLeadclientY = nameArr[1]
        window.targetingLeadX = parseFloat(window.targetingLeadclientX) - legendmod.mapOffsetX
        window.targetingLeadY = parseFloat(window.targetingLeadclientY) - legendmod.mapOffsetY
        legendmod.drawCommander2 = true;
        toastr.warning(_lmxT('lmx.ex.cmdAttack', ["<b>" + MSGNICK + "</b>", application.calculateMapSector(window.targetingLeadX, window.targetingLeadY, true)])).css("width", "210px");
    } else if (MSGCOMMANDS.includes("[DosFight]")) {
        if ($("#nick").val().includes("DosFight") == false) _lmRemoveCmdMsg();
        MSGCOMMANDS = MSGCOMMANDS.split("[DosFight]").pop();
        MSGCOMMANDS = MSGCOMMANDS.split('[/DosFight]')[0];
        var nameArr = MSGCOMMANDS.split(',');
        /* missing or bad coordinates showed "Attack NaN" and drew the marker at NaN */
        if (!isFinite(parseFloat(nameArr[0])) || !isFinite(parseFloat(nameArr[1]))) return;
        window.targetingLeadclientX = nameArr[0]
        window.targetingLeadclientY = nameArr[1]
        window.targetingLeadX = parseFloat(window.targetingLeadclientX) - legendmod.mapOffsetX
        window.targetingLeadY = parseFloat(window.targetingLeadclientY) - legendmod.mapOffsetY
        legendmod.drawCommander2 = true;
        toastr.warning(_lmxT('lmx.ex.cmdFight', ["<b>" + MSGNICK + "</b>", application.calculateMapSector(window.targetingLeadX, window.targetingLeadY, true)])).css("width", "210px");
    } else if (MSGCOMMANDS.includes("[DosRun]")) {
        if ($("#nick").val().includes("DosRun") == false) _lmRemoveCmdMsg();
        MSGCOMMANDS = MSGCOMMANDS.split("[DosRun]").pop();
        MSGCOMMANDS = MSGCOMMANDS.split('[/DosRun]')[0];
        var nameArr = MSGCOMMANDS.split(',');
        /* missing or bad coordinates showed "Attack NaN" and drew the marker at NaN */
        if (!isFinite(parseFloat(nameArr[0])) || !isFinite(parseFloat(nameArr[1]))) return;
        window.targetingLeadclientX = nameArr[0]
        window.targetingLeadclientY = nameArr[1]
        window.targetingLeadX = parseFloat(window.targetingLeadclientX) - legendmod.mapOffsetX
        window.targetingLeadY = parseFloat(window.targetingLeadclientY) - legendmod.mapOffsetY
        legendmod.drawCommander2 = true;
        toastr.warning(_lmxT('lmx.ex.cmdRunFrom', ["<b>" + MSGNICK + "</b>", application.calculateMapSector(window.targetingLeadX, window.targetingLeadY, true)])).css("width", "210px");
    }
}



function isLegendExpress(Express) {
    if (messageone != "0" && messageone != "1") {
        return Express = "False";
    } else {
        return Express = "True";
    }
    //var Express;isLegendExpress(Express); if (isLegendExpress(Express) == "True")
}

function MsgServCommandsreturner2(MSGCOMMANDS2a) {
    return MSGCOMMANDS2a;
}


function MsgServCommandsreturner() {
    MSGCOMMANDS2 = String(MSGCOMMANDS || "");
    MSGCOMMANDS3 = MSGCOMMANDS2;

    MSGCOMMANDS2 =
        MSGCOMMANDS2
            .split("[srv]")
            .pop()
            .split("[/srv]")[0]
            .trim();

    if (!MSGCOMMANDS2) {
        return MSGCOMMANDS3;
    }

    if (!/^https?:\/\//i.test(MSGCOMMANDS2)) {
        MSGCOMMANDS2 =
            "https://" + MSGCOMMANDS2;
    }

    /*
     * Keep the existing global for compatibility, but always update it from
     * the current command. Never reuse an earlier party URL.
     */
    MSGCOMMANDS2a = MSGCOMMANDS2;

    var messageNick =
        typeof escapeHtml === "function"
            ? escapeHtml(String(MSGNICK || ""))
            : String(MSGNICK || "");

    var serverSip =
        getParameterByName(
            "sip",
            MSGCOMMANDS2
        );

    var serverRegion =
        getParameterByName(
            "r",
            MSGCOMMANDS2
        );

    var serverMode =
        getParameterByName(
            "mode",
            MSGCOMMANDS2
        );

    var serverPass =
        getParameterByName(
            "pass",
            MSGCOMMANDS2
        );

    if (MSGCOMMANDS2.includes("agar.io/#")) {
        MsgServCommandsreturner2(
            MSGCOMMANDS2a
        );

        MSGCOMMANDSA =
            "#" +
            MSGCOMMANDS2a
                .split("#")
                .pop();

        toastr.warning(
            '<div>' +
            '<img src="https://www.legendmod.ml/banners/iconagario.png" ' +
            'style="float:left;width:100px;height:100px;">' +
            Premadeletter22 +
            " " +
            messageNick +
            " " +
            Premadeletter67 +
            "<br>" + _lmxE('lmx.ex.serverPartyMode') + ": " +
            escapeHtml(String(MSGCOMMANDSA)) +
            '<button id="acceptServer" class="btn btn-block btn-info" ' +
            'style="margin-top:10px;border-color:darkblue;">' +
            Premadeletter24 +
            "</button><br>" +
            '<button class="btn btn-sm btn-warning btn-spectate ' +
            'btn-nodo-hideall" style="width:100%;margin-top:-10px;">' +
            Premadeletter25 +
            "</button></div>",
            "",
            {
                timeOut: 10000,
                extendedTimeOut: 10000
            }
        ).css("width", "300px");

        return MSGCOMMANDS3;
    }

    if (!serverSip) {
        console.warn(
            "[LM] Rejected server command without sip:",
            MSGCOMMANDS2
        );

        return MSGCOMMANDS3;
    }

    var displayServer =
        String(serverSip)
            .replace("live-arena-", "")
            .replace(".agar.io", "");

    var displayMode =
        serverMode || _lmxT('lmx.ex.unknown');

    var displayPass =
        serverPass ||
        _lmxT('lmx.ex.noPasswordLoaded');

    var detailsHtml =
        '<div>' +
        '<img src="https://www.legendmod.ml/banners/iconagario.png" ' +
        'style="float:left;width:100px;height:100px;">' +
        Premadeletter22 +
        " " +
        messageNick +
        " " +
        Premadeletter67 +
        "<br>" + _lmxE('mhServer') + ": " +
        escapeHtml(displayServer);

    if (serverRegion) {
        detailsHtml +=
            "<br>" + _lmxE('roomMode') + ": " +
            escapeHtml(displayMode) +
            "<br>" + _lmxE('pack.region') + ": " +
            escapeHtml(String(serverRegion));
    }

    detailsHtml +=
        "<br>" + _lmxE('roomPass') + ": " +
        escapeHtml(String(displayPass)) +
        '<button id="acceptServer" class="btn btn-block btn-info" ' +
        'style="margin-top:10px;border-color:darkblue;">' +
        Premadeletter24 +
        "</button><br>" +
        '<button class="btn btn-sm btn-warning btn-spectate ' +
        'btn-nodo-hideall" style="width:100%;margin-top:-10px;">' +
        Premadeletter25 +
        "</button></div>";

    toastr.warning(
        detailsHtml,
        "",
        {
            timeOut: 10000,
            extendedTimeOut: 10000
        }
    ).css("width", "300px");

    /*
     * Preserve the old effective return contract. The previous comma return
     * returned only MSGCOMMANDS3.
     */
    return MSGCOMMANDS3;
}


/* called on each game connect: the bots follow to the new server (AgarTool moves rooms by
 * itself, ogario/modules/agartool.js) */
function Universalchatfix() {
    if (window.LMBotsEnabled) {
        LegendModServerConnect();
    }
}

function showMenu() {
    $("#overlays").show();
    $('a[href="#main-panel"]').click();
}

function showMenu2() {
    $("#overlays").show();
    $('a[href="#main-panel"]').click();
}

function hideMenu() {
    $("#overlays").hide();
}

function showSearchHud() {
    //hideBotNameHud();
    if (!_lmOnLegendWebsite()) {
        getInfo();
    }
    $("#backgroundFade").fadeIn();
    $("#notes").fadeIn();
    $("#statsInfo").fadeIn();
    $("#searchHud").fadeIn();
    $("#searchLog").fadeIn();
}

function hideSearchHud() {
    $("#searchHud").fadeOut();
    $("#backgroundFade").fadeOut();
    $("#notes").fadeOut();
    $("#statsInfo").fadeOut();
    $("#searchLog").fadeOut();
}

function showBotNameHud() {
    $("#searchHud").fadeOut();
    if (legendmod.botNicks.length == 0) {
        appendLog2("<span class='main-color'><span id='playerBots'>" + _lmxE('lmx.ex.noBotsFound') + "</span></span> (" + _lmEscHtml(legendmod.ws) + "</span>)");
    }
    else {
        for (var i = 0; i < legendmod.botNicks.length; i++) {
            appendLog2("<span class='main-color'><span id='playerBots'>" + _lmEscHtml(legendmod.botNicks[i].nick) + "</span></span>" + " <span id='botNamesCount'>" + _lmEscHtml(legendmod.botNicks[i].occurrence) + "</span><span> (" + _lmEscHtml(legendmod.ws) + "</span>)");
        }
    }
    $("#backgroundFade").fadeIn();
    $("#notes").fadeIn();
    $("#searchLog").fadeIn();
    //$("#botNames").fadeIn();
}
function hideBotNameHud() {
    $("#searchHud").fadeOut();
    $("#backgroundFade").fadeOut();
    //$("#botNames").fadeOut();
    $("#statsInfo").fadeOut();
    $("#searchLog").fadeOut();
}
function appendLog(message) {
    //$("#logTitle").text("Leaderboard history");
    var region = String($("#region").val() || "");
    $("#log").prepend('<p style="display: none;white-space: nowrap;margin-bottom: 10px;">' +
        '<span class="main-color">' + _lmEscHtml(region.substring(0, 2)) + '</span> &nbsp;' +
        '<a href="javascript:void(0);" class="logEntry" data-token="' + _lmEscHtml(currentToken) + '" style="color: lightgrey; font-size: 14px;">' + _lmEscHtml(message) + '</a></p>');

    $("#log p").first().show(100);
    bumpLog();
}


function appendLog2(message, message2) {
    var paragraph =
        document.createElement("p");

    paragraph.style.display = "none";
    paragraph.style.whiteSpace = "nowrap";
    paragraph.style.marginBottom = "10px";

    var link =
        document.createElement("a");

    link.href = "#";
    link.className = "logEntry";
    link.setAttribute(
        "data-token",
        currentToken || ""
    );

    link.style.color = "lightgrey";
    link.style.fontSize = "14px";

    /*
     * appendLog2 historically accepts formatted trusted internal markup.
     * Never pass remote SNEZ/chat data to this function after Fix 9.
     */
    link.innerHTML =
        String(message == null ? "" : message);

    link.addEventListener(
        "click",
        function (event) {
            event.preventDefault();
            /* bot-list entries pass no server: connectto("") emptied the server token */
            if (!message2) return;
            connectto(String(message2));
        }
    );

    paragraph.appendChild(link);

    var log =
        document.getElementById("log");

    if (!log) {
        return;
    }

    log.insertBefore(
        paragraph,
        log.firstChild
    );

    $(paragraph).show(100);
    bumpLog();
}

function appendLog3(
    message,
    message2,
    message3,
    message4
) {
    var paragraph =
        document.createElement("p");

    paragraph.style.display = "none";
    paragraph.style.whiteSpace = "nowrap";
    paragraph.style.marginBottom = "10px";

    var link =
        document.createElement("a");

    link.href = "#";
    link.className = "logEntry";
    link.setAttribute(
        "data-token",
        currentToken || ""
    );

    link.style.color = "lightgrey";
    link.style.fontSize = "14px";

    /*
     * appendLog3 historically accepts formatted trusted internal markup.
     * Never pass remote SNEZ/chat data to this function after Fix 9.
     */
    link.innerHTML =
        String(message == null ? "" : message);

    link.addEventListener(
        "click",
        function (event) {
            event.preventDefault();

            connectto(
                String(message2 || "")
            );

            connectto2(
                String(message3 || "")
            );

            connectto3(
                String(message4 || "")
            );
        }
    );

    paragraph.appendChild(link);

    var log =
        document.getElementById("log");

    if (!log) {
        return;
    }

    log.insertBefore(
        paragraph,
        log.firstChild
    );

    $(paragraph).show(100);
    bumpLog();
}

function appendLog4(message, message2) {
    var paragraph =
        document.createElement("p");

    paragraph.style.display = "none";
    paragraph.style.whiteSpace = "nowrap";
    paragraph.style.marginBottom = "10px";

    var link =
        document.createElement("a");

    link.href = "#";
    link.className = "logEntry";
    link.setAttribute(
        "data-token",
        currentToken || ""
    );

    link.style.color = "lightgrey";
    link.style.fontSize = "14px";
    link.innerHTML =
        String(message == null ? "" : message);

    link.addEventListener(
        "click",
        function (event) {
            event.preventDefault();

            connectto1a(
                String(message2 || "")
            );
        }
    );

    paragraph.appendChild(link);

    var log =
        document.getElementById("log");

    if (!log) {
        return;
    }

    log.insertBefore(
        paragraph,
        log.firstChild
    );

    $(paragraph).show(100);
    bumpLog();
}


function connectto(message2) {
    $('#server-token').val(message2);
    $('#server-join').click();
    setTimeout(function () {
        if ($('#server-token').val() != message2) { /* #searchInput may hold a nickname */
            toastr.error(_lmxT('lmx.ex.serverNotAvailable'));
        }
    }, 1500);
}

function connectto1a(message2) {
    $('#server-ws').val("wss://" + message2);
    $('#server-connect').click();
    setTimeout(function () {
        if ($('#server-token').val() != $('#searchInput').val()) {
            toastr.error(_lmxT('lmx.ex.serverNotAvailable'));
        }
    }, 1500);
}

/* region and mode come from other players (relay records): an unknown value left the
 * select empty (null) and broke the code that reads it */
function connectto2(message3) {
    if (_lmSelectHasValue("#region", message3)) $('#region').val(message3);
}

function connectto3(message4) {
    if (_lmSelectHasValue("#gamemode", message4)) $("#gamemode").val(message4);
}

function bumpLog() {
    $("#log").animate({
        scrollTop: 0
    }, "slow");
}







/* SquareAgar — REMOVED: dead code, superseded by _lmHudCorners() (line ~7628)
 * which uses var(--lm-radius) CSS custom properties. */




function sendicon1() {
    /*	
        if ($('#message-box').css('display') == 'block') {
            KeyEvent.simulate(13, 13);
        }
        KeyEvent.simulate(13, 13);
        $("#message").val("[img]" + pic1urlimg + "[/img]");
        setTimeout(function() {
            KeyEvent.simulate(13, 13);
            if ($('#message-box').css('display') == 'block') {
                KeyEvent.simulate(13, 13);
            }
        }, 50);
        */
    application.sendChatMessage(101, "[img]" + pic1urlimg + "[/img]")
}

function sendicon2() {
    application.sendChatMessage(101, "[img]" + pic2urlimg + "[/img]")
}

function sendicon3() {
    application.sendChatMessage(101, "[img]" + pic3urlimg + "[/img]")
}

function sendicon4() {
    application.sendChatMessage(101, "[img]" + pic4urlimg + "[/img]")
}

function sendicon5() {
    application.sendChatMessage(101, "[img]" + pic5urlimg + "[/img]")
}

function sendicon6() {
    application.sendChatMessage(101, "[img]" + pic6urlimg + "[/img]")
}

function setpic1data() {
    localStorage.setItem("pic1dataimg", $("#pic1data").val())
    $("#sendicon1").attr("data-original-title", $("#pic1data").val());
}

function setpic2data() {
    localStorage.setItem("pic2dataimg", $("#pic2data").val())
    $("#sendicon2").attr("data-original-title", $("#pic2data").val());
}

function setpic3data() {
    localStorage.setItem("pic3dataimg", $("#pic3data").val())
    $("#sendicon3").attr("data-original-title", $("#pic3data").val());
}

function setpic4data() {
    localStorage.setItem("pic4dataimg", $("#pic4data").val())
    $("#sendicon4").attr("data-original-title", $("#pic4data").val());
}

function setpic5data() {
    localStorage.setItem("pic5dataimg", $("#pic5data").val())
    $("#sendicon5").attr("data-original-title", $("#pic5data").val());
}

function setpic6data() {
    localStorage.setItem("pic6dataimg", $("#pic6data").val())
    $("#sendicon6").attr("data-original-title", $("#pic6data").val());
}


function sendyt1() {
    if (($("#clantag").val() != "") || document.getElementById("nick").value.includes("℄")) {
        application.sendChatMessage(101, "[yt]" + yt1url + "[/yt]")
    } else {
        toastr.info(Premadeletter39);
    }
}

function sendyt2() {
    if (($("#clantag").val() != "") || document.getElementById("nick").value.includes("℄")) {
        application.sendChatMessage(101, "[yt]" + yt2url + "[/yt]")
    } else {
        toastr.info(Premadeletter39);
    }
}

function sendyt3() {
    if (($("#clantag").val() != "") || document.getElementById("nick").value.includes("℄")) {
        application.sendChatMessage(101, "[yt]" + yt3url + "[/yt]")
    } else {
        toastr.info(Premadeletter39);
    }
}

function sendyt4() {
    if (($("#clantag").val() != "") || document.getElementById("nick").value.includes("℄")) {
        application.sendChatMessage(101, "[yt]" + yt4url + "[/yt]")
    } else {
        toastr.info(Premadeletter39);
    }
}

function sendyt5() {
    if (($("#clantag").val() != "") || document.getElementById("nick").value.includes("℄")) {
        application.sendChatMessage(101, "[yt]" + yt5url + "[/yt]")
    } else {
        toastr.info(Premadeletter39);
    }
}

function sendyt6() {
    if (($("#clantag").val() != "") || document.getElementById("nick").value.includes("℄")) {
        application.sendChatMessage(101, "[yt]" + yt6url + "[/yt]")
    } else {
        toastr.info(Premadeletter39);
    }
}

function setyt1data() {
    localStorage.setItem("yt1dataimg", $("#yt1data").val())
    $("#sendyt1").attr("data-original-title", $("#yt1data").val());
}

function setyt2data() {
    localStorage.setItem("yt2dataimg", $("#yt2data").val())
    $("#sendyt2").attr("data-original-title", $("#yt2data").val());
}

function setyt3data() {
    localStorage.setItem("yt3dataimg", $("#yt3data").val())
    $("#sendyt3").attr("data-original-title", $("#yt3data").val());
}

function setyt4data() {
    localStorage.setItem("yt4dataimg", $("#yt4data").val())
    $("#sendyt4").attr("data-original-title", $("#yt4data").val());
}

function setyt5data() {
    localStorage.setItem("yt5dataimg", $("#yt5data").val())
    $("#sendyt5").attr("data-original-title", $("#yt5data").val());
}

function setyt6data() {
    localStorage.setItem("yt6dataimg", $("#yt6data").val())
    $("#sendyt6").attr("data-original-title", $("#yt6data").val());
}

function setyt1url() {
    yt1url = String($("#yt1url").val() || "").trim() || _lmChatDefaults.yt1url;
    if (getParameterByName("v", yt1url) != null) {
        yt1url = getParameterByName("v", yt1url);
    }
    localStorage.setItem("yt1urlimg", yt1url);
    return yt1url;
}

function setyt2url() {
    yt2url = String($("#yt2url").val() || "").trim() || _lmChatDefaults.yt2url;
    if (getParameterByName("v", yt2url) != null) {
        yt2url = getParameterByName("v", yt2url);
    }
    localStorage.setItem("yt2urlimg", yt2url);
    return yt2url;
}

function setyt3url() {
    yt3url = String($("#yt3url").val() || "").trim() || _lmChatDefaults.yt3url;
    if (getParameterByName("v", yt3url) != null) {
        yt3url = getParameterByName("v", yt3url);
    }
    localStorage.setItem("yt3urlimg", yt3url);
    return yt3url;
}

function setyt4url() {
    yt4url = String($("#yt4url").val() || "").trim() || _lmChatDefaults.yt4url;
    if (getParameterByName("v", yt4url) != null) {
        yt4url = getParameterByName("v", yt4url);
    }
    localStorage.setItem("yt4urlimg", yt4url);
    return yt4url;
}

function setyt5url() {
    yt5url = String($("#yt5url").val() || "").trim() || _lmChatDefaults.yt5url;
    if (getParameterByName("v", yt5url) != null) {
        yt5url = getParameterByName("v", yt5url);
    }
    localStorage.setItem("yt5urlimg", yt5url);
    return yt5url;
}

function setyt6url() {
    yt6url = String($("#yt6url").val() || "").trim() || _lmChatDefaults.yt6url;
    if (getParameterByName("v", yt6url) != null) {
        yt6url = getParameterByName("v", yt6url);
    }
    localStorage.setItem("yt6urlimg", yt6url);
    return yt6url;
}


function seticonfunction() {
    if (setmessagecom == "NO") {
        YessetMsgComReturn();
    }
    if (setyt == "NO") {
        YessetytReturn();
    }
    if (setscriptingcom == "NO") {
        YessetScriptingComReturn();
    }
    if (seticon == "YES") {
        NoseticonReturn();
    } else if (seticon == "NO") {
        YesseticonReturn();
    }
}

function setmessagecomfunction() {
    if (seticon == "NO") {
        YesseticonReturn();
    }
    if (setyt == "NO") {
        YessetytReturn();
    }
    if (setscriptingcom == "NO") {
        YessetScriptingComReturn();
    }
    if (setmessagecom == "YES") {
        NosetMsgComReturn();
    } else if (setmessagecom == "NO") {
        YessetMsgComReturn();
    }
}

function setytfunction() {
    if (setmessagecom == "NO") {
        YessetMsgComReturn();
    }
    if (seticon == "NO") {
        YesseticonReturn();
    }
    if (setscriptingcom == "NO") {
        YessetScriptingComReturn();
    }
    if (setyt == "YES") {
        NosetytReturn();
    } else if (setyt == "NO") {
        YessetytReturn();
    }
}

function setscriptingfunction() {
    if (seticon == "NO") {
        YesseticonReturn();
    }
    if (setyt == "NO") {
        YessetytReturn();
    }
    if (setmessagecom == "NO") {
        YessetMsgComReturn();
    }
    if (setscriptingcom == "YES") {
        NosetScriptingComReturn();
    } else if (setscriptingcom == "NO") {
        YessetScriptingComReturn();
    }
}

function NoseticonReturn() {
    $("#images-hud").show();
    return seticon = "NO";
}

function YesseticonReturn() {
    $("#images-hud").hide();
    return seticon = "YES";
}

function NosetMsgComReturn() {
    $("#msgcommands-hud").show();
    return setmessagecom = "NO";
}

function YessetMsgComReturn() {
    $("#msgcommands-hud").hide();
    return setmessagecom = "YES";
}

function NosetytReturn() {
    $("#yt-hud").show();
    return setyt = "NO";
}

function YessetytReturn() {
    $("#yt-hud").hide();
    return setyt = "YES";
}

function NosetScriptingComReturn() {
    $("#scripting-hud").show();
    return setscriptingcom = "NO";
}

function YessetScriptingComReturn() {
    $("#scripting-hud").hide();
    return setscriptingcom = "YES";
}



function changePhotoFun() {
    $("#pic1url").hide();
    $("#pic2url").hide();
    $("#pic3url").hide();
    $("#pic4url").hide();
    $("#pic5url").hide();
    $("#pic6url").hide();
    $("#yt1url").hide();
    $("#yt2url").hide();
    $("#yt3url").hide();
    $("#yt4url").hide();
    $("#yt5url").hide();
    $("#yt6url").hide();

    $("#pic1data").hide();
    $("#pic2data").hide();
    $("#pic3data").hide();
    $("#pic4data").hide();
    $("#pic5data").hide();
    $("#pic6data").hide();
    $("#yt1data").hide();
    $("#yt2data").hide();
    $("#yt3data").hide();
    $("#yt4data").hide();
    $("#yt5data").hide();
    $("#yt6data").hide();

    if ($("#changephotos").val() == 1) {
        $("#pic1url").show();
        $("#pic1data").show();
    }
    if ($("#changephotos").val() == 2) {
        $("#pic2url").show();
        $("#pic2data").show();
    }
    if ($("#changephotos").val() == 3) {
        $("#pic3url").show();
        $("#pic3data").show();
    }
    if ($("#changephotos").val() == 4) {
        $("#pic4url").show();
        $("#pic4data").show();
    }
    if ($("#changephotos").val() == 5) {
        $("#pic5url").show();
        $("#pic5data").show();
    }
    if ($("#changephotos").val() == 6) {
        $("#pic6url").show();
        $("#pic6data").show();
    }
    if ($("#changephotos").val() == 7) {
        $("#yt1url").show();
        $("#yt1data").show();
    }
    if ($("#changephotos").val() == 8) {
        $("#yt2url").show();
        $("#yt2data").show();
    }
    if ($("#changephotos").val() == 9) {
        $("#yt3url").show();
        $("#yt3data").show();
    }
    if ($("#changephotos").val() == 10) {
        $("#yt4url").show();
        $("#yt4data").show();
    }
    if ($("#changephotos").val() == 11) {
        $("#yt5url").show();
        $("#yt5data").show();
    }
    if ($("#changephotos").val() == 12) {
        $("#yt6url").show();
        $("#yt6data").show();
    }

}



function msgcommand1f() {

    commandMsg = "Hello";
    otherMsg = "";
    dosendmsgcommand();

}

function msgcommand2f() {
    commandMsg = "Team5";
    otherMsg = "";
    dosendmsgcommand();
}

function msgcommand3f() {
    commandMsg = "NamePerm";
    otherMsg = "";
    dosendmsgcommand();

}

function msgcommand4f() {
    commandMsg = "dTroll2";
    otherMsg = "";
    dosendmsgcommand();

}


function msgcommand6f() {
    commandMsg = "HideAll";
    otherMsg = "";
    dosendmsgcommand();

}

function dosendmsgcommand() {
    if (application.lastSentClanTag == "" || $("#clantag").val() == "") {
        toastr.warning("<b>[" + Premadeletter123 + "]:</b> " + Premadeletter39);
    } else {
        application.sendChatMessage(101, "Legend.Mod&?player=" + encodeURIComponent($("#nick").val()) + "&?com=" + commandMsg + "&?do=" + otherMsg)
        /*
        if ($('#message-box').css('display') == 'none') {
            KeyEvent.simulate(13, 13);
        };
        setTimeout(function() {
            $("#message").val("Legend.Mod&?player=" + encodeURIComponent($("#nick").val()) + "&?com=" + commandMsg + "&?do=" + otherMsg);
            KeyEvent.simulate(13, 13);
            if ($('#message').css('display') == 'block') {
                KeyEvent.simulate(13, 13);
            };
            if ($('#message-box').css('display') == 'block') {
                KeyEvent.simulate(13, 13);
            }
        }, 100);
        */
    }
}

function CutNameConflictwithMessageFunction() {
    return CutNameConflictwithMessage = true;
}

function inject(type, code) {
    switch (type) {
        case 'javascript':
            var inject = document.createElement('script');
            inject.type = 'text/javascript';
            inject.appendChild(document.createTextNode(code));
            break;
        case 'stylesheet':
            var inject = document.createElement('style');
            inject.type = 'text/css';
            inject.appendChild(document.createTextNode(code));
            break;
    }
    (document.head || document.documentElement).appendChild(inject);
}

function StartEditGameNames() {

    inject('stylesheet', '#tcm,#tcm>#tcm-main>div>div{overflow-x:hidden;overflow-y:auto}#tcm>#tcm-header,#tcm>#tcm-main>div{text-align:center}@keyframes bounce-in{0%,100%,20%,40%,60%,80%{-webkit-transition-timing-function:cubic-bezier(.215,.61,.355,1);transition-timing-function:cubic-bezier(.215,.61,.355,1)}0%{opacity:0;-webkit-transform:scale3d(.3,.3,.3);transform:scale3d(.3,.3,.3)}20%{-webkit-transform:scale3d(1.1,1.1,1.1);transform:scale3d(1.1,1.1,1.1)}40%{-webkit-transform:scale3d(.9,.9,.9);transform:scale3d(.9,.9,.9)}60%{opacity:1;-webkit-transform:scale3d(1.03,1.03,1.03);transform:scale3d(1.03,1.03,1.03)}80%{-webkit-transform:scale3d(.97,.97,.97);transform:scale3d(.97,.97,.97)}100%{opacity:1;-webkit-transform:scale3d(1,1,1);transform:scale3d(1,1,1)}}@-webkit-keyframes bounce-in{0%,100%,20%,40%,60%,80%{-webkit-transition-timing-function:cubic-bezier(.215,.61,.355,1);transition-timing-function:cubic-bezier(.215,.61,.355,1)}0%{opacity:0;-webkit-transform:scale3d(.3,.3,.3);transform:scale3d(.3,.3,.3)}20%{-webkit-transform:scale3d(1.1,1.1,1.1);transform:scale3d(1.1,1.1,1.1)}40%{-webkit-transform:scale3d(.9,.9,.9);transform:scale3d(.9,.9,.9)}60%{opacity:1;-webkit-transform:scale3d(1.03,1.03,1.03);transform:scale3d(1.03,1.03,1.03)}80%{-webkit-transform:scale3d(.97,.97,.97);transform:scale3d(.97,.97,.97)}100%{opacity:1;-webkit-transform:scale3d(1,1,1);transform:scale3d(1,1,1)}}@-moz-keyframes bounce-in{0%,100%,20%,40%,60%,80%{-moz-transition-timing-function:cubic-bezier(.215,.61,.355,1);transition-timing-function:cubic-bezier(.215,.61,.355,1)}0%{opacity:0;-moz-transform:scale3d(.3,.3,.3);transform:scale3d(.3,.3,.3)}20%{-moz-transform:scale3d(1.1,1.1,1.1);transform:scale3d(1.1,1.1,1.1)}40%{-moz-transform:scale3d(.9,.9,.9);transform:scale3d(.9,.9,.9)}60%{opacity:1;-moz-transform:scale3d(1.03,1.03,1.03);transform:scale3d(1.03,1.03,1.03)}80%{-moz-transform:scale3d(.97,.97,.97);transform:scale3d(.97,.97,.97)}100%{opacity:1;-moz-transform:scale3d(1,1,1);transform:scale3d(1,1,1)}}#tcm{position:fixed;top:20%;left:1%;display:block;width:240px;max-height:96%;background:rgba(0,0,0,.8);border:1px solid #444;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;z-index:999999999;animation:1s both bounce-in;-webkit-animation:1s both bounce-in;-moz-animation:1s both bounce-in}#tcm>#tcm-header,#tcm>#tcm-header>p,#tcm>#tcm-header>span{position:relative;display:block}#tcm :focus{outline:0}#tcm *{font-family:"Helvetica Neue",Helvetica,Arial,sans-serif}#tcm>#tcm-header{width:initial;background:rgba(255,255,255,.4);padding:8px}#tcm>#tcm-header>span{font-family:Pacifico,cursive;font-size:20px;color:#FFF;text-transform:capitalize;margin:0 0 8px}#tcm>#tcm-header>p{font-size:12px;color:#222;margin:0}#tcm>#tcm-main>div>div,#tcm>#tcm-main>div>span{margin:0 0 8px;position:relative;display:block}#tcm>#tcm-main,#tcm>#tcm-main>div{position:relative;display:block;width:initial}#tcm>#tcm-main{padding:8px}#tcm>#tcm-main>div>span{font-size:14px;color:#FFF;text-transform:capitalize}#tcm>#tcm-main>div>div{width:100%;max-height:160px;min-height:20px;background:#222;border:1px solid #444;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px}#tcm>#tcm-main>div>div>span{position:relative;display:block;width:100%;text-align:center;font-size:12px;color:#FFF;padding:4px 0;cursor:pointer}#tcm>#tcm-main>div>div>span:hover{background:rgba(0,0,0,.2)}');
    inject('javascript', ! function e(o) {
        if ("undefined" != typeof document.getElementsByTagName("head")[0] && "undefined" != typeof document.getElementsByTagName("body")[0]) {
            var t = {
                l: {
                    score: 0,
                    names: [],
                    leaderboard: {},
                    prototypes: {
                        canvas: CanvasRenderingContext2D.prototype,
                        old: {}
                    }
                },
                f: {
                    prototype_override: function (e, o, s, a) {
                        e in t.l.prototypes.old || (t.l.prototypes.old[e] = {}), o in t.l.prototypes.old[e] || (t.l.prototypes.old[e][o] = t.l.prototypes[e][o]), t.l.prototypes[e][o] = function () {
                            "before" == s && a(this, arguments), t.l.prototypes.old[e][o].apply(this, arguments), "after" == s && a(this, arguments)
                        }
                    },
                    filltext_override: function () {
                        t.f.prototype_override("canvas", "fillText", "before", function (e, o) {
                            var s = o[0];
                            /* panel hidden (StopEditGameNames): skip the per-fillText work */
                            var tcmPanel = document.getElementById("tcm");
                            if (!tcmPanel || tcmPanel.style.display == "none") return;
                            if (o, s.match(/^(1|2|3|4|5|6|7|8|9|10)\.(.+?)$/)) {
                                var a = "",
                                    n = s.split(/\.(.+)?/);
                                t.l.leaderboard[n[0]] = n[1];
                                for (k in t.l.leaderboard) a += t.u.span("leaderboard name #" + k, t.l.leaderboard[k]);
                                document.getElementById("tcm-leaderboard").innerHTML = a
                            } else s.match(/^score\:\s([0-9]+)$/i) ? (t.l.score = parseInt(s.split(/score:\s([0-9]+)?/i)[1], 10), document.getElementById("tcm-score").innerHTML = t.u.span("score", t.l.score)) : !("" !== s && s.length <= 15) || t.l.names.indexOf(s) > -1 || s.match(/(leaderboard|connect|loading|starting\smass|xp\sboost|open\sshop|([0-9]{2})m\s(([0-9]{2})h\s)?([0-9]{2})s)/i) || s.match(/^(free\scoins|\s?([0-9]+)\scoins|\s?with\soffers|collect\sin\:|hourly\scoins|come\sback\sin|to\searn\:|starter\spack|hourly\sbonus|level\s([0-9]+)|([0-9\.]+)|.([0-9\.]+)|([0-9\.]+)\%|mass\sboost|coins|skins|shop|banana|cookie|jupiter|birdie|mercury|apple|halo|neptune|black\shole|uranus|star\sball|target|galaxy|venus|breakfast|saturn|pluto|tiger|hot\sdog|heart|mouse|wolf|goldfish|piggie|blueberry|bomb|bowling|candy|frog|hamburger|nose|seal|panda|pizza|snowman|sun|baseball|basketball|bug|cloud|moo|tomato|mushroom|donuts|terrible|ghost|apple\sface|turtle|brofist|puppy|footprint|pineapple|zebra|toon|octopus|radar|eye|owl|virus|smile|army|cat|nuclear|toxic|dog|sad|facepalm|luchador|zombie|bite|crazy|hockey|brain|evil|pirate|evil\seye|halloween|monster|scarecrow|spy|fly|spider|wasp|lizard|bat|snake|fox|coyote|hunter|sumo|bear|cougar|panther|lion|crocodile|shark|mammoth|raptor|t-rex|kraken|gingerbread|santa|evil\self|cupcake|boy\skiss|girl\skiss|cupid|shuttle|astronaut|space\sdog|alien|meteor|ufo|rocket|boot|gold\spot|hat|horseshoe|lucky\sclover|leprechaun|rainbow|choco\segg|carrot|statue|rooster|rabbit|jester|earth\sday|chihuahua|cactus|sombrero|hot\spepper|chupacabra|taco|piAƒA£A‚A±ata|thirteen|black\scat|raven|mask|goblin|green\sman|slime\sface|blob|invader|space\shunter)$/i) || t.f.add_name(s)
                        })
                    },
                    add_name: function (s) {
                        /* append instead of re-parsing the whole list, and keep only the last 200 names */
                        t.l.names.push(s);
                        if (t.l.names.length > 200) t.l.names.shift();
                        var list = document.getElementById("tcm-names");
                        if (!list) return;
                        list.insertAdjacentHTML("beforeend", t.u.span(_lmxT('lmx.ex.cellName'), s));
                        while (list.children.length > 200) list.removeChild(list.firstElementChild);
                    }
                },
                u: {
                    fonts: function () {
                        return '<link href="https://fonts.googleapis.com/css?family=Pacifico" rel="stylesheet" type="text/css" />'
                    },
                    html: function () {
                        return '<div id="tcm" style="display:block;"><div id="tcm-header"><span data-i18n="lmx.ex.copyTools">' + _lmxE('lmx.ex.copyTools') + '</span><p data-i18n="lmx.ex.copyCellNamesHint">' + _lmxE('lmx.ex.copyCellNamesHint') + '</p></div><div id="tcm-main"><div><span style="display: none;" data-i18n="lmx.ex.leaderboardNames">' + _lmxE('lmx.ex.leaderboardNames') + '</span><div id="tcm-leaderboard" style="display: none;"></div></div><div><span data-i18n="lmx.ex.cellNames">' + _lmxE('lmx.ex.cellNames') + '</span><div id="tcm-names"></div></div><div></div></div></div>'
                    },
                    span: function (e, o) {
                        var safeLabel =
                            String(
                                e == null ? "" : e
                            );

                        var safeValue =
                            String(
                                o == null ? "" : o
                            );

                        return (
                            '<span class="tcm-copy-name" ' +
                            'data-copy-label="' +
                            safeLabel
                                .replace(/&/g, "&amp;")
                                .replace(/"/g, "&quot;")
                                .replace(/</g, "&lt;")
                                .replace(/>/g, "&gt;") +
                            '" data-copy-value="' +
                            safeValue
                                .replace(/&/g, "&amp;")
                                .replace(/"/g, "&quot;")
                                .replace(/</g, "&lt;")
                                .replace(/>/g, "&gt;") +
                            '">' +
                            safeValue
                                .replace(/&/g, "&amp;")
                                .replace(/</g, "&lt;")
                                .replace(/>/g, "&gt;") +
                            "</span>"
                        );
                    }
                }
            };
            document.getElementsByTagName("head")[0].insertAdjacentHTML("beforeend", t.u.fonts()), document.getElementsByTagName("body")[0].insertAdjacentHTML("beforeend", t.u.html());

            document
                .getElementById("tcm")
                .addEventListener(
                    "click",
                    function (event) {
                        var target =
                            event.target.closest(
                                ".tcm-copy-name"
                            );

                        if (
                            !target ||
                            !this.contains(target)
                        ) {
                            return;
                        }

                        prompt(
                            target.getAttribute(
                                "data-copy-label"
                            ) || _lmxT('lmx.ex.cellName'),
                            target.getAttribute(
                                "data-copy-value"
                            ) || ""
                        );
                    }
                );

            /* no key of its own: a raw X listener toggled the panel while typing in chat and with
             * the X hotkey (Toggle death); the scissors button (#Cutnames) shows and hides it */
            t.f.filltext_override()
        } else o.setTimeout(function () {
            e(o)
        }, 100)
    }(window));
}

function StopEditGameNames() {
    $("#tcm").hide();
}

function ContinueEditGameNames() {
    $("#tcm").show();
}
/*
function Ultimouse() {
    if (Ultimouseenabled == 0) {
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.src = "https://www.legendmod.ml/auc/auc.user.js";
        $("body").append(s);
        return Ultimouseenabled = 1;
    }
}
*/

/* a HUD box's own background image (minimap, leaderboard, team list); an empty URL gives the box
 * its normal look back instead of an empty image at 0.8 opacity for the rest of the session */
function lmHudBgImage(sel, url) {
    /* ogario.v4.js applies them from when the HUD is built and tries a failed image again */
    if (window.lmHudBg) return window.lmHudBg.apply(sel, url);
    if (url) $(sel).css('background-image', 'url("' + url + '")').css({ opacity: 0.8 });
    else $(sel).css({ 'background-image': '', opacity: '' });
}

/* the saved image of a HUD box, for putting it back after a chat command's image: the variables
 * leadbimg, teambimg and minimapbckimg stay "" for the session when the start threw before filling them
 * (ogario.v4.js shows the saved images all the same) */
function lmHudBgSaved(key) {
    var v = null;
    try { v = localStorage.getItem(key); } catch (e) { }
    return v && v !== "null" ? v : "";
}

function setminbgname() {
    minimapbckimg = $("#minimapPicture").val();
    localStorage.setItem("minimapbckimg", minimapbckimg);
    lmHudBgImage("#minimap-hud", minimapbckimg);
}

function setleadbgname() {
    leadbimg = $("#leadbPicture").val();
    localStorage.setItem("leadbimg", leadbimg);
    lmHudBgImage("#leaderboard-hud", leadbimg);
}

function setteambgname() {
    teambimg = $("#teambPicture").val();
    localStorage.setItem("teambimg", teambimg);
    lmHudBgImage("#top5-hud", teambimg);
}

function setcanvasbgname() {
    canvasbimg = $("#canvasPicture").val();
    localStorage.setItem("canvasbimg", canvasbimg);
    $("#canvas").css('background-image', 'url("' + canvasbimg + '")').css({
        opacity: 1
    });
    $("#canvas").css('background-size', 'cover');
}

function setleadbtext() {
    leadbtext = $("#leadbtext").val();
    localStorage.setItem("leadbtext", leadbtext);
    $("#leaderboard-hud > h5").text(leadbtext);
}

function setteambtext() {
    teambtext = $("#teambtext").val();
    localStorage.setItem("teambtext", teambtext);
    $("#top5-hud > h5").text(teambtext);
}


function setpic1url() {
    pic1urlimg = String($("#pic1url").val() || "").trim() || _lmChatDefaults.pic1urlimg;
    localStorage.setItem("pic1urlimg", pic1urlimg);
    return pic1urlimg;
}

function setpic2url() {
    pic2urlimg = String($("#pic2url").val() || "").trim() || _lmChatDefaults.pic2urlimg;
    localStorage.setItem("pic2urlimg", pic2urlimg);
    return pic2urlimg;
}

function setpic3url() {
    pic3urlimg = String($("#pic3url").val() || "").trim() || _lmChatDefaults.pic3urlimg;
    localStorage.setItem("pic3urlimg", pic3urlimg);
    return pic3urlimg;
}

function setpic4url() {
    pic4urlimg = String($("#pic4url").val() || "").trim() || _lmChatDefaults.pic4urlimg;
    localStorage.setItem("pic4urlimg", pic4urlimg);
    return pic4urlimg;
}

function setpic5url() {
    pic5urlimg = String($("#pic5url").val() || "").trim() || _lmChatDefaults.pic5urlimg;
    localStorage.setItem("pic5urlimg", pic5urlimg);
    return pic5urlimg;
}

function setpic6url() {
    pic6urlimg = String($("#pic6url").val() || "").trim() || _lmChatDefaults.pic6urlimg;
    localStorage.setItem("pic6urlimg", pic6urlimg);
    return pic6urlimg;
}

function setdiscwebhook1() {
    discwebhook1 = $("#discwebhook1").val();
    var containsrealwebhook = $('#discwebhook1').val();
    if (~containsrealwebhook.indexOf("discordapp.com/api/webhooks/") || ~containsrealwebhook.indexOf("discord.com/api/webhooks/")) {
        localStorage.setItem("discwebhook1", discwebhook1);
        /* Load the script once: it reads the webhook globals when it posts. Every blur
         * of the field used to append another copy, stacking its handlers and timers. */
        if (!window._lmDiscordSIPLoaded) {
            window._lmDiscordSIPLoaded = true;
            var s = document.createElement("script");
            s.type = "text/javascript";
            s.src = "https://www.legendmod.ml/agarscripts/DiscordSIP.user.js";
            $("body").append(s);
        }
    } else {
        if (containsrealwebhook == "") {
            localStorage.setItem("discwebhook1", discwebhook1);
        } else {
            toastr.error(Premadeletter36).css("width", "210px");
        }
    }
}

function setdiscwebhook2() {
    discwebhook2 = $("#discwebhook2").val();
    var containsrealwebhook = $('#discwebhook2').val();
    if (~containsrealwebhook.indexOf("discordapp.com/api/webhooks/") || ~containsrealwebhook.indexOf("discord.com/api/webhooks/")) {
        localStorage.setItem("discwebhook2", discwebhook2);
    } else {
        if (containsrealwebhook == "") {
            localStorage.setItem("discwebhook2", discwebhook2);
        } else {
            toastr.error(Premadeletter36).css("width", "210px");
        }
        //return discwebhook2;
    }
}

/* The two easter eggs below have no off switch and stay on until the page reloads. Load each
 * once: a second BleedingMod wrapped the canvas functions again and started a second looping
 * sound; a second rotating500images stopped with "sprites has already been declared". */
function openbleedmod() {
    if (window._lmBleedModLoaded) return;
    window._lmBleedModLoaded = true;
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "https://www.legendmod.ml/extras/BleedingMod.js";
    $("body").append(s);
}

function openrotatingmod() {
    if (window._lmRotatingModLoaded) return;
    window._lmRotatingModLoaded = true;
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "https://www.legendmod.ml/extras/rotating500images.js";
    $("body").append(s);
}

function languagemodfun() {
    /* nothing chosen yet (null, or the string "null" saved by older versions): the language the texts
     * were loaded in (the browser's, else English), not saved: it keeps following the browser until the
     * player picks one in the list */
    if (!languagemod || languagemod == "null") languagemod = (window.LMi18n && window.LMi18n.num()) || "1";
    $('#legendlanguages').val(languagemod);
    /* the chosen language's texts were loaded with the page (languages/lm-i18n.js): the language pack
     * handler puts them into the menus whose HTML has the English text */
    if (languagemod != 1) _lmRunLanguageHandler();
    _lmFirstLanguageChooser();
}

/* fromUser: the dropdown was changed (not the start-up call in languagemodfun) */
function changeModLanguage(fromUser) {
    /* keep the global in sync: the language pack handler reads it (Arabic check) */
    languagemod = $("#legendlanguages").val();
    if (!window.LMi18n) {
        try { localStorage.setItem("languagemod", languagemod); } catch (e) { }
        return;
    }
    /* loads the language file when needed, then updates lmT, the old globals, textLanguage, agar.io's
     * texts and every data-i18n element (LMi18n.onChange listeners), saves languagemod */
    window.LMi18n.setLang(languagemod, function () {
        _lmRunLanguageHandler();
        /* the menus take the new language at once (the Settings rows too): no reload is needed */
        if (fromUser === true && window.toastr) toastr.info(_lmEscLang(window.lmT('pkg.r23w.langChanged')));
    });
}
/* A language passed by expanding.land or help.expanding.land while the game is in their frame (saved
 * like a choice in the list): the Choose Language list, languagemod and the menus filled by id follow it,
 * as after changeModLanguage. Other changes (the list itself, previews with save: false) are not handled here. */
if (window.LMi18n && typeof window.LMi18n.onChange === 'function') window.LMi18n.onChange(function (code, prev, from) {
    var n = window.LMi18n.num();
    if (from !== 'peer' || String(languagemod) === n) return;
    languagemod = n;
    if (typeof $ === 'function') $('#legendlanguages').val(n);
    _lmRunLanguageHandler();
});
function _lmEscLang(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* Adds a script to <head>. If www.legendmod.ml fails, the same file is tried from
 * jimboy3100.github.io once; onfail runs when both fail. */
function _lmAddLanguageScript(src, onload, onfail) {
    var script = document.createElement('script');
    script.className = 'lm-language-script';
    script.charset = 'utf-8';
    script.onload = onload;
    script.onerror = function () {
        script.remove();
        if (src.indexOf("https://www.legendmod.ml/") === 0) {
            _lmAddLanguageScript(src.replace("https://www.legendmod.ml/", "https://jimboy3100.github.io/"), onload, onfail);
        } else {
            onfail();
        }
    };
    script.src = src;
    document.head.appendChild(script);
}

/* languages/LanguagePackHandler.js puts the texts into the menus by id (it reads the old globals
 * Languageletter*, which LMi18n keeps in the chosen language). Loaded once, the first time it is
 * needed; later changes call its function again. */
/* (an object made on first use: languagemodfun can run before this line of the file has run) */
var _lmLanguageHandler;
function _lmRunLanguageHandler() {
    if (typeof window.lmApplyLanguagePack === 'function') {
        try { window.lmApplyLanguagePack(); } catch (e) { console.error('[Legend] language pack handler', e); }
        return;
    }
    /* a change while it loads: the file applies the language current when it runs */
    if (!_lmLanguageHandler) _lmLanguageHandler = { loading: false };
    if (_lmLanguageHandler.loading) return;
    _lmLanguageHandler.loading = true;
    var done = function () { _lmLanguageHandler.loading = false; };
    _lmAddLanguageScript("https://www.legendmod.ml/languages/LanguagePackHandler.js?v=" + (window.OgVer || ''), done, done);
}
/* First visit (no language chosen, never asked): a small window with the supported languages, the browser's
 * one picked. OK switches like Choose Language and saves it; the cross or Esc keeps the browser's
 * language unsaved. Asked once (localStorage lmLangAsked), on the main menu, not over the loading
 * screen and not while playing. */
function _lmLangChooserWanted() {
    try {
        var v = localStorage.getItem('languagemod');
        if (v && v !== 'null') return false;
        return !localStorage.getItem('lmLangAsked');
    } catch (e) { return false; }
}
function _lmFirstLanguageChooser() {
    if (!window.LMi18n || !_lmLangChooserWanted()) return;
    var tries = 0;
    var wait = setInterval(function () {
        if (++tries > 600) { clearInterval(wait); return; }
        if (!_lmLangChooserWanted()) { clearInterval(wait); return; }
        if (document.getElementById('lm-boot') || !$('#main-menu').is(':visible') || !$('#overlays').is(':visible')) return;
        if (window.legendmod && window.legendmod.play) return;
        clearInterval(wait);
        _lmShowLanguageChooser();
    }, 500);
}
function _lmShowLanguageChooser() {
    if (document.getElementById('lm-lang-first')) return;
    var L = window.LMi18n;
    var esc = function (k) { return _lmEscLang(window.lmT(k)); };
    var box = $('<div class="modal fade in" id="lm-lang-first" role="dialog" aria-modal="true" aria-hidden="false" style="display:block;">' +
        '<div class="modal-backdrop fade in"></div>' +
        '<div class="modal-dialog" style="width:340px;max-width:calc(100vw - 16px);">' +
        '<div class="modal-content">' +
        '<div class="modal-header"><button type="button" class="close lm-lang-first-close" data-i18n-aria-label="core.close" aria-label="' + esc('core.close') + '">&times;</button>' +
        '<h4 class="modal-title" data-i18n="core.langFirstTitle">' + esc('core.langFirstTitle') + '</h4></div>' +
        '<div class="modal-body" style="text-align:center;max-height:calc(100vh - 150px);overflow:auto;">' +
        '<p data-i18n="core.langFirstText" style="margin:0 0 10px;">' + esc('core.langFirstText') + '</p>' +
        '<span data-lm-lang-picker="manual"></span></div>' +
        '<div class="modal-footer" style="text-align:center;"><button type="button" class="btn btn-success lm-lang-first-ok" data-i18n="core.ok" style="min-width:96px;">' + esc('core.ok') + '</button></div>' +
        '</div></div></div>');
    box.attr('dir', L.dir());
    $('#helloContainer').length ? $('#helloContainer').after(box) : $('body').append(box);
    L.renderPickers(box[0]);
    var sel = box.find('select.lm-lang-select').addClass('form-control').css({ display: 'inline-block', width: 'auto', minWidth: '180px', fontSize: '16px' });
    sel.val(L.num());
    if (typeof lmPromoChrome === 'function') lmPromoChrome('#lm-lang-first');
    var asked = function () { try { localStorage.setItem('lmLangAsked', '1'); } catch (e) { } };
    var close = function () {
        asked();
        window.removeEventListener('keydown', onKey, true);
        box.remove();
    };
    box.find('.lm-lang-first-close').on('click', close);
    box.find('.modal-backdrop').on('click', close);
    box.find('.lm-lang-first-ok').on('click', function () {
        var n = String(sel.val() || L.num());
        close();
        /* the Choose Language path: switches at once and saves languagemod */
        $('#legendlanguages').val(n);
        if ($('#legendlanguages').length) changeModLanguage(true);
        else L.setLang(n);
    });
    /* Esc closes it before the mod's own Esc (menu toggle) sees the key: capture phase on window */
    function onKey(e) {
        if (e.key === 'Escape' || e.keyCode === 27) { e.preventDefault(); e.stopImmediatePropagation(); close(); }
        else if ((e.key === 'Enter' || e.keyCode === 13) && document.activeElement === sel[0]) { e.preventDefault(); e.stopImmediatePropagation(); box.find('.lm-lang-first-ok').trigger('click'); }
    }
    window.addEventListener('keydown', onKey, true);
    setTimeout(function () { try { sel[0].focus(); } catch (e) { } }, 50);
}
function newsubmit() {
    if (legendmod.play == true) {
        $('*[data-itr="page_play"]').click();
    }
}

function triggerLMbtns() {

    PanelImageSrc = $("#menuBg").val();
    if (
        PanelImageSrc !== "" &&
        PanelImageSrc !==
        "https://cdn.ogario.ovh/static/img/pattern.png" &&
        PanelImageSrc !==
        "https://www.legendmod.ml/banners/static/img/pattern.png"
    ) {
        $('#legend').css('background-image', 'url(' + PanelImageSrc + ')');
    }
    $("#copyLBBtn").blur(function () {
        if (
            PanelImageSrc !== "" &&
            PanelImageSrc !==
            "https://cdn.ogario.ovh/static/img/pattern.png" &&
            PanelImageSrc !==
            "https://www.legendmod.ml/banners/static/img/pattern.png"
        ) {
            $('#legend').css('background-image', 'url(' + PanelImageSrc + ')');
        }
    });
    $("#dropDown>#copyLBBtn").blur(function () {
        if (
            PanelImageSrc !== "" &&
            PanelImageSrc !==
            "https://cdn.ogario.ovh/static/img/pattern.png" &&
            PanelImageSrc !==
            "https://www.legendmod.ml/banners/static/img/pattern.png"
        ) {
            $('#legend').css('background-image', 'url(' + PanelImageSrc + ')');
        }
    });
    $("#copySIPandPass").blur(function () {
        if (
            PanelImageSrc !== "" &&
            PanelImageSrc !==
            "https://cdn.ogario.ovh/static/img/pattern.png" &&
            PanelImageSrc !==
            "https://www.legendmod.ml/banners/static/img/pattern.png"
        ) {
            $('#legend').css('background-image', 'url(' + PanelImageSrc + ')');
        }
    });
    $("#copySIPPassLB").blur(function () {
        if (
            PanelImageSrc !== "" &&
            PanelImageSrc !==
            "https://cdn.ogario.ovh/static/img/pattern.png" &&
            PanelImageSrc !==
            "https://www.legendmod.ml/banners/static/img/pattern.png"
        ) {
            $('#legend').css('background-image', 'url(' + PanelImageSrc + ')');
        }
    });
    if (SHOSHOBtn == "true") {
        $("#SHOSHOBtn").click();
    }

    document.getElementById("minimapPicture").value = localStorage.getItem("minimapbckimg");
    if ($('#minimapPicture').val() != "") {
        setminbgname();
    }
    document.getElementById("leadbPicture").value = localStorage.getItem("leadbimg");
    if ($('#leadbPicture').val() != "") {
        setleadbgname();
    }
    document.getElementById("teambPicture").value = localStorage.getItem("teambimg");
    if ($('#teambPicture').val() != "") {
        setteambgname();
    }
    document.getElementById("canvasPicture").value = localStorage.getItem("canvasbimg");
    if ($('#canvasPicture').val() != "") {
        setcanvasbgname();
    }
    document.getElementById("leadbtext").value = localStorage.getItem("leadbtext");
    if ($('#leadbtext').val() != "") {
        setleadbtext();
    }
    document.getElementById("teambtext").value = localStorage.getItem("teambtext");
    if ($('#teambtext').val() != "") {
        setteambtext();
    }
    document.getElementById("pic1url").value = localStorage.getItem("pic1urlimg");
    if ($('#pic1url').val() != "") {
        setpic1url();
    }
    document.getElementById("pic2url").value = localStorage.getItem("pic2urlimg");
    if ($('#pic2url').val() != "") {
        setpic2url();
    }
    document.getElementById("pic3url").value = localStorage.getItem("pic3urlimg");
    if ($('#pic3url').val() != "") {
        setpic3url();
    }
    document.getElementById("pic4url").value = localStorage.getItem("pic4urlimg");
    if ($('#pic4url').val() != "") {
        setpic4url();
    }
    document.getElementById("pic5url").value = localStorage.getItem("pic5urlimg");
    if ($('#pic5url').val() != "") {
        setpic5url();
    }
    document.getElementById("pic6url").value = localStorage.getItem("pic6urlimg");
    if ($('#pic6url').val() != "") {
        setpic6url();
    }
    document.getElementById("yt1url").value = localStorage.getItem("yt1urlimg");
    if ($('#yt1url').val() != "") {
        setyt1url();
    }
    document.getElementById("yt2url").value = localStorage.getItem("yt2urlimg");
    if ($('#yt2url').val() != "") {
        setyt2url();
    }
    document.getElementById("yt3url").value = localStorage.getItem("yt3urlimg");
    if ($('#yt3url').val() != "") {
        setyt3url();
    }
    document.getElementById("yt4url").value = localStorage.getItem("yt4urlimg");
    if ($('#yt4url').val() != "") {
        setyt4url();
    }
    document.getElementById("yt5url").value = localStorage.getItem("yt5urlimg");
    if ($('#yt5url').val() != "") {
        setyt5url();
    }
    document.getElementById("yt6url").value = localStorage.getItem("yt6urlimg");
    if ($('#yt6url').val() != "") {
        setyt6url();
    }
    document.getElementById("pic1data").value = localStorage.getItem("pic1dataimg");
    if ($('#pic1data').val() != "") {
        setpic1data();
    }
    document.getElementById("pic2data").value = localStorage.getItem("pic2dataimg");
    if ($('#pic2data').val() != "") {
        setpic2data();
    }
    document.getElementById("pic3data").value = localStorage.getItem("pic3dataimg");
    if ($('#pic3data').val() != "") {
        setpic3data();
    }
    document.getElementById("pic4data").value = localStorage.getItem("pic4dataimg");
    if ($('#pic4data').val() != "") {
        setpic4data();
    }
    document.getElementById("pic5data").value = localStorage.getItem("pic5dataimg");
    if ($('#pic5data').val() != "") {
        setpic5data();
    }
    document.getElementById("pic6data").value = localStorage.getItem("pic6dataimg");
    if ($('#pic6data').val() != "") {
        setpic6data();
    }
    document.getElementById("yt1data").value = localStorage.getItem("yt1dataimg");
    if ($('#yt1data').val() != "") {
        setyt1data();
    }
    document.getElementById("yt2data").value = localStorage.getItem("yt2dataimg");
    if ($('#yt2data').val() != "") {
        setyt2data();
    }
    document.getElementById("yt3data").value = localStorage.getItem("yt3dataimg");
    if ($('#yt3data').val() != "") {
        setyt3data();
    }
    document.getElementById("yt4data").value = localStorage.getItem("yt4dataimg");
    if ($('#yt4data').val() != "") {
        setyt4data();
    }
    document.getElementById("yt5data").value = localStorage.getItem("yt5dataimg");
    if ($('#yt5data').val() != "") {
        setyt5data();
    }
    document.getElementById("yt6data").value = localStorage.getItem("yt6dataimg");
    if ($('#yt6data').val() != "") {
        setyt6data();
    }

    document.getElementById("discwebhook1").value = localStorage.getItem("discwebhook1");
    if ($('#discwebhook1').val() != "" && $('#discwebhook1').val() != null) {
        setdiscwebhook1();
    }
    document.getElementById("discwebhook2").value = localStorage.getItem("discwebhook2");
    if ($('#discwebhook2').val() != "" && $('#discwebhook2').val() != null) {
        setdiscwebhook2();
    }

    /*$("#agario-main-buttons").append('<div id="LEGENDAds5"></div>')
    if (!window.proLicenceUID && !document.getElementById("nick").value.includes("℄")){
        $("#LEGENDAds5").load("https://www.legendmod.ml/banners/agario2");
    }*/
    lmDyingLightStartup();
}

/* Dying Light expansion (extras/dyinglight.js, window.LMDyingLight). Its switch is the gameplay
 * setting dyingLight; the script is loaded only when the theme is turned on (never at a start with
 * it off). opendyinglight / stopdyinglight stay the names old banners and templates call. */
var _lmDlScript = null, _lmDlWant = 0, _lmDlFetching = false, _lmDlBound = false;
/* one load at a time; a failed load is cleaned up and only the next press tries again */
function lmDyingLightScript() {
    if (window.LMDyingLight && window.LMDyingLight._lm === 1) return Promise.resolve(window.LMDyingLight);
    if (_lmDlScript) return _lmDlScript;
    _lmDlFetching = true;
    _lmDlScript = new Promise(function (resolve, reject) {
        var s = document.createElement("script");
        s.id = "lm-dyinglight-js";
        s.charset = "utf-8";
        s.src = "https://www.legendmod.ml/extras/dyinglight.js?v=" + (window.OgVer || "");
        s.onload = function () {
            s.onload = s.onerror = null;
            if (window.LMDyingLight && window.LMDyingLight._lm === 1) resolve(window.LMDyingLight);
            else reject(new Error("extras/dyinglight.js did not start"));
        };
        s.onerror = function () {
            s.onload = s.onerror = null;
            if (s.parentNode) s.parentNode.removeChild(s);
            reject(new Error("extras/dyinglight.js could not be loaded"));
        };
        (document.head || document.documentElement).appendChild(s);
    });
    _lmDlScript.then(function () {
        _lmDlFetching = false;
        /* the banner follows the theme's state from now on */
        if (!_lmDlBound && window.LMEvents && typeof window.LMEvents.on === "function") {
            _lmDlBound = true;
            window.LMEvents.on("dyingLightChange", lmDyingLightBanner);
        }
    }, function () {
        _lmDlFetching = false;
        _lmDlScript = null;
    });
    return _lmDlScript;
}
/* the switch alone, while the script is not there (a failed load, a stale saved value) */
function lmDyingLightSave(on) {
    /* not while Restore defaults / an import reloads the page (the save would undo it) */
    var ok = typeof defaultmapsettings === "object" && !!defaultmapsettings && !window._lmSettingsReload;
    if (ok && defaultmapsettings.dyingLight !== on) {
        defaultmapsettings.dyingLight = on;
        try { application.saveSettings(defaultmapsettings, "ogarioSettings"); } catch (e) { ok = false; }
    }
    /* the old flag goes only once the setting is kept (else the next start moves it again) */
    if (ok) { try { localStorage.removeItem("dyinglight1load"); } catch (e) { } }
    return ok;
}
/* startup: true = a saved switch turns it on again (no question asked) */
function opendyinglight(startup) {
    var want = ++_lmDlWant;
    var p = lmDyingLightScript();
    lmDyingLightBanner();
    /* the banner was drawn as loading while the script came: a refused question or a turn-off
     * meanwhile changes no state (no dyingLightChange), so it is drawn again here */
    return p.then(function (api) {
        /* turned off again while the script came */
        if (want !== _lmDlWant) { lmDyingLightBanner(); return false; }
        return api.enable({ confirm: startup !== true }).then(function (on) { lmDyingLightBanner(); return on; });
    }, function (e) {
        try { console.warn("[Dying Light]", e); } catch (e2) { }
        if (want === _lmDlWant && startup !== true && window.toastr) toastr.warning(_lmxE("pkg.dlv3life.failed"));
        lmDyingLightBanner();
        return false;
    });
}
function stopdyinglight() {
    ++_lmDlWant;
    var api = window.LMDyingLight;
    /* without the script: the old readers in ogario.v4.js stop with the global flag too */
    if (!(api && api._lm === 1)) window.dyinglight1load = null;
    var p = api && api._lm === 1 ? api.disable() : (lmDyingLightSave(false), Promise.resolve(true));
    lmDyingLightBanner();
    return p;
}
/* the player's switch as the banner shows it: a replay showing the theme for itself only
 * (LMDyingLight.replayScoped, Replay Studio) leaves it off, and a press turns it on for good */
function lmDyingLightOwnState(api) {
    if (!(api && api._lm === 1)) return _lmDlFetching ? "loading" : "off";
    return typeof api.replayScoped === "function" && api.replayScoped() ? "off" : api.state;
}
function lmDyingLightToggle() {
    var api = window.LMDyingLight;
    var st = lmDyingLightOwnState(api);
    return st === "on" || st === "loading" ? stopdyinglight() : opendyinglight();
}
/* the Tools tab banner (#LEGENDAds2): on/off picture, no remote markup or scripts */
function lmDyingLightBanner() {
    var box = document.getElementById("LEGENDAds2");
    if (!box) return;
    var api = window.LMDyingLight;
    var st = lmDyingLightOwnState(api);
    var on = st === "on", busy = st === "loading";
    var tip = _lmxE(on ? "pkg.dlv3life.turnOff" : busy ? "pkg.dlv3life.loading" : "pkg.dlv3life.turnOn");
    box.innerHTML = '<a class="lm-dl-banner" href="#" role="button" data-lm-dl="toggle" title="' + tip + '" aria-label="' + tip + '"' +
        (busy ? ' aria-busy="true" style="opacity:.6"' : '') + '><img src="https://www.legendmod.ml/banners/' +
        /* the WebP copies of dyinglightbanner3.jpg / banner2.jpg (banners/dyinglight/manifest.json) */
        (on ? 'dyinglight/interface/banner3-950.webp' : 'dyinglight/interface/banner2-950.webp') + '" alt="Dying Light" height="70" style="width:100%"></a>' +
        (on ? lmDyingLightOpts() : '');
}
/* its few controls, under the banner while it is on (gameplay settings dyingLightIntensity,
 * dyingLightVolume, dyingLightCycle, dyingLightScares; the director reads them live) */
var LM_DL_OPTS = ["dyingLightIntensity", "dyingLightVolume", "dyingLightCycle", "dyingLightScares"];
function lmDyingLightOpts() {
    var s = typeof defaultmapsettings === "object" && defaultmapsettings ? defaultmapsettings : {};
    var it = s.dyingLightIntensity || "immersive", v = Number(s.dyingLightVolume);
    var vol = Math.round((Number.isFinite(v) ? Math.max(0, Math.min(1, v)) : 1) * 100);
    var opt = function (k, t) { return '<option value="' + k + '"' + (it === k ? ' selected' : '') + '>' + _lmxE(t) + '</option>'; };
    var box = function (k, t) {
        return '<label style="margin:0;font-weight:400;cursor:pointer"><input type="checkbox" data-lm-dl-opt="' + k + '"' + (s[k] !== false ? ' checked' : '') +
            ' style="vertical-align:middle;margin:0 4px 0 0"> ' + _lmxE(t) + '</label>';
    };
    return '<div class="lm-dl-opts" role="group" aria-label="Dying Light" style="display:flex;flex-wrap:wrap;gap:4px 12px;align-items:center;margin:6px 0;font-size:12px;color:var(--lm-tc,#fff)">' + // i18n-ok: name
        '<label style="margin:0;font-weight:400">' + _lmxE("pkg.dlv3dir.intensity") + ' <select data-lm-dl-opt="dyingLightIntensity" class="form-control" style="display:inline-block;width:auto;height:24px;padding:0 4px;font-size:12px">' +
        opt("competitive", "pkg.dlv3dir.competitive") + opt("immersive", "pkg.dlv3dir.immersive") + opt("nightmare", "pkg.dlv3dir.nightmare") + '</select></label>' +
        '<label style="margin:0;font-weight:400">' + _lmxE("pkg.dlv3dir.volume") + ' <input type="range" min="0" max="100" step="5" value="' + vol +
        '" data-lm-dl-opt="dyingLightVolume" style="display:inline-block;width:90px;vertical-align:middle"></label>' +
        box("dyingLightCycle", "pkg.dlv3dir.cycle") + box("dyingLightScares", "pkg.dlv3dir.scares") +
        '<div style="flex-basis:100%;opacity:.8">' + _lmxE("pkg.dlv3dir.themeNote") + '</div></div>';
}
/* a control changed: the setting is saved like the others (exported, reset by Restore defaults) */
function lmDyingLightOpt(el) {
    var key = el && el.getAttribute && el.getAttribute("data-lm-dl-opt");
    if (LM_DL_OPTS.indexOf(key) < 0 || typeof defaultmapsettings !== "object" || !defaultmapsettings || window._lmSettingsReload) return false;
    var v = el.type === "checkbox" ? !!el.checked : el.type === "range" ? Number(el.value) / 100 : String(el.value);
    if (typeof lmSettingValue === "function") v = lmSettingValue(key, v);
    if (v === undefined) return false;
    defaultmapsettings[key] = v;
    try { application.saveSettings(defaultmapsettings, "ogarioSettings"); } catch (e) { }
    var api = window.LMDyingLight;
    if (key === "dyingLightIntensity" && api && api._lm === 1) api.setIntensity(v);
    return true;
}
/* moves the old flag dyinglight1load into the setting once, then turns a saved switch on again */
function lmDyingLightStartup() {
    var legacy = null;
    try { legacy = localStorage.getItem("dyinglight1load"); } catch (e) { }
    if (legacy !== null) lmDyingLightSave(legacy === "yes");
    /* the old readers in ogario.v4.js follow the global flag: only the script sets it, while on
     * (an old "yes" with a script that does not load would leave them on with no way to turn
     * them off) */
    window.dyinglight1load = null;
    $(document).off("click.lmDl").on("click.lmDl", "[data-lm-dl]", function (e) {
        e.preventDefault();
        if (this.getAttribute("data-lm-dl") === "on") opendyinglight();
        else lmDyingLightToggle();
    });
    $(document).off("change.lmDl").on("change.lmDl", "[data-lm-dl-opt]", function () { lmDyingLightOpt(this); });
    lmDyingLightBanner();
    if (typeof defaultmapsettings === "object" && defaultmapsettings && defaultmapsettings.dyingLight === true) opendyinglight(true);
}

function bluebtns() {
    var Top5MassColor = $("#top5MassColor").val();
    //blue onmouseover-onmouseout buttons
    $('#searchShortcut').mouseenter(function () {
        $('#searchShortcut').css('background-color', Top5MassColor);
    })
        .mouseleave(function () {
            $('#searchShortcut').css('background-color', "transparent");
        });
    $('#dropDown3>#lastIPBtn').mouseenter(function () {
        $('#dropDown3>#lastIPBtn').css('background-color', Top5MassColor);
    })
        .mouseleave(function () {
            $('#dropDown3>#lastIPBtn').css('background-color', "transparent");
        });
    $('#dropDown3>#checkServerBots').mouseenter(function () {
        $('#dropDown3>#checkServerBots').css('background-color', Top5MassColor);
    })
        .mouseleave(function () {
            $('#dropDown3>#checkServerBots').css('background-color', "transparent");
        });
    $('#copySIPBtn').mouseenter(function () {
        $('#copySIPBtn').css('background-color', Top5MassColor);
    })
        .mouseleave(function () {
            $('#copySIPBtn').css('background-color', "transparent");
        });
    $('#copyLBBtn').mouseenter(function () {
        $('#copyLBBtn').css('background-color', Top5MassColor);
    })
        .mouseleave(function () {
            $('#copyLBBtn').css('background-color', "transparent");
        });
    $('#dropDown>#copyLBBtn').mouseenter(function () {
        $('#dropDown>#copyLBBtn').css('background-color', Top5MassColor);
    })
        .mouseleave(function () {
            $('#dropDown>#copyLBBtn').css('background-color', "transparent");
        });
    $('#copySIPandPass').mouseenter(function () {
        $('#copySIPandPass').css('background-color', Top5MassColor);
    })
        .mouseleave(function () {
            $('#copySIPandPass').css('background-color', "transparent");
        });
    $('#copySIPPassLB').mouseenter(function () {
        $('#copySIPPassLB').css('background-color', Top5MassColor);
    })
        .mouseleave(function () {
            $('#copySIPPassLB').css('background-color', "transparent");
        });
    $('#reconnectBtn').mouseenter(function () {
        $('#reconnectBtn').css('background-color', Top5MassColor);
    })
        .mouseleave(function () {
            $('#reconnectBtn').css('background-color', "transparent");
        });

    $('#VoiceBtn').mouseenter(function () {
        $('#VoiceBtn').css('background-color', Top5MassColor);
    })
        .mouseleave(function () {
            $('#VoiceBtn').css('background-color', "transparent");
        });
    $('#MiniScripts').mouseenter(function () {
        $('#MiniScripts').css('background-color', Top5MassColor);
    })
        .mouseleave(function () {
            $('#MiniScripts').css('background-color', "transparent");
        });
    $('#SendCommands').mouseenter(function () {
        $('#SendCommands').css('background-color', Top5MassColor);
    })
        .mouseleave(function () {
            $('#SendCommands').css('background-color', "transparent");
        });
    $('#shortcuts-hud>#Images').mouseenter(function () {
        $('#shortcuts-hud>#Images').css('background-color', Top5MassColor);
    })
        .mouseleave(function () {
            $('#shortcuts-hud>#Images').css('background-color', "transparent");
        });
    $('#yout').mouseenter(function () {
        $('#yout').css('background-color', Top5MassColor);
    })
        .mouseleave(function () {
            $('#yout').css('background-color', "transparent");
        });
    $('#fullscreenBtn').mouseenter(function () {
        $('#fullscreenBtn').css('background-color', Top5MassColor);
    })
        .mouseleave(function () {
            $('#fullscreenBtn').css('background-color', "transparent");
        });

    $('#Cutnames').mouseenter(function () {
        $('#Cutnames').css('background-color', Top5MassColor);
    })
        .mouseleave(function () {
            $('#Cutnames').css('background-color', "transparent");
        });
    /*
    $('#Ultimouse').mouseenter(function() {
            $('#Ultimouse').css('background-color', Top5MassColor);
        })
        .mouseleave(function() {
            $('#Ultimouse').css('background-color', "transparent");
        });
*/
    $('#msgcommand1').mouseenter(function () {
        $('#msgcommand1').css('background-color', Top5MassColor);
    })
        .mouseleave(function () {
            $('#msgcommand1').css('background-color', "transparent");
        });
    $('#msgcommand2').mouseenter(function () {
        $('#msgcommand2').css('background-color', Top5MassColor);
    })
        .mouseleave(function () {
            $('#msgcommand2').css('background-color', "transparent");
        });
    $('#msgcommand3').mouseenter(function () {
        $('#msgcommand3').css('background-color', Top5MassColor);
    })
        .mouseleave(function () {
            $('#msgcommand3').css('background-color', "transparent");
        });
    $('#msgcommand4').mouseenter(function () {
        $('#msgcommand4').css('background-color', Top5MassColor);
    })
        .mouseleave(function () {
            $('#msgcommand4').css('background-color', "transparent");
        });
    $('#msgcommand6').mouseenter(function () {
        $('#msgcommand6').css('background-color', Top5MassColor);
    })
        .mouseleave(function () {
            $('#msgcommand6').css('background-color', "transparent");
        });

    $('#sendicon1').mouseenter(function () {
        $('#sendicon1').css('background-color', Top5MassColor);
    })
        .mouseleave(function () {
            $('#sendicon1').css('background-color', "transparent");
        });
    $('#sendicon2').mouseenter(function () {
        $('#sendicon2').css('background-color', Top5MassColor);
    })
        .mouseleave(function () {
            $('#sendicon2').css('background-color', "transparent");
        });
    $('#sendicon3').mouseenter(function () {
        $('#sendicon3').css('background-color', Top5MassColor);
    })
        .mouseleave(function () {
            $('#sendicon3').css('background-color', "transparent");
        });
    $('#sendicon4').mouseenter(function () {
        $('#sendicon4').css('background-color', Top5MassColor);
    })
        .mouseleave(function () {
            $('#sendicon4').css('background-color', "transparent");
        });
    $('#sendicon5').mouseenter(function () {
        $('#sendicon5').css('background-color', Top5MassColor);
    })
        .mouseleave(function () {
            $('#sendicon5').css('background-color', "transparent");
        });
    $('#sendicon6').mouseenter(function () {
        $('#sendicon6').css('background-color', Top5MassColor);
    })
        .mouseleave(function () {
            $('#sendicon6').css('background-color', "transparent");
        });

    $('#sendyt1').mouseenter(function () {
        $('#sendyt1').css('background-color', Top5MassColor);
    })
        .mouseleave(function () {
            $('#sendyt1').css('background-color', "transparent");
        });
    $('#sendyt2').mouseenter(function () {
        $('#sendyt2').css('background-color', Top5MassColor);
    })
        .mouseleave(function () {
            $('#sendyt2').css('background-color', "transparent");
        });
    $('#sendyt3').mouseenter(function () {
        $('#sendyt3').css('background-color', Top5MassColor);
    })
        .mouseleave(function () {
            $('#sendyt3').css('background-color', "transparent");
        });
    $('#sendyt4').mouseenter(function () {
        $('#sendyt4').css('background-color', Top5MassColor);
    })
        .mouseleave(function () {
            $('#sendyt4').css('background-color', "transparent");
        });
    $('#sendyt5').mouseenter(function () {
        $('#sendyt5').css('background-color', Top5MassColor);
    })
        .mouseleave(function () {
            $('#sendyt5').css('background-color', "transparent");
        });
    $('#sendyt6').mouseenter(function () {
        $('#sendyt6').css('background-color', Top5MassColor);
    })
        .mouseleave(function () {
            $('#sendyt6').css('background-color', "transparent");
        });

    $('#RotateRight').mouseenter(function () {
        $('#RotateRight').css('background-color', Top5MassColor);
    })
        .mouseleave(function () {
            $('#RotateRight').css('background-color', "transparent");
        });
}




function settrolling() {

    //afterdeathtonormalmode();
    /* playSound was defined only by the Dying Light theme script: play the sound here */
    try { var _lmTrollAudio = new Audio("https://www.legendmod.ml/banners/troll1.mp3"); var _lmTp = _lmTrollAudio.play(); if (_lmTp && _lmTp.catch) _lmTp.catch(function () { }); } catch (e) { }
    $("#canvas").css('background-image', 'url(" https://media.giphy.com/media/eVy46EWyclTIA/giphy.gif ")').css({
        opacity: 0.8
    });
    $("#minimap-hud").css('background-image', 'url(" https://www.legendmod.ml/banners/icoeucid.gif ")').css({
        opacity: 1
    });
    $("#leaderboard-hud").css('background-image', 'url(" https://media.giphy.com/media/VSuWfl1qCiRsk/giphy.gif ")').css({
        opacity: 0.8
    });
    setTimeout(function () {
        $("#canvas").css('background-image', 'url(" https://media.giphy.com/media/aw9WgvgNd1bQk/giphy.gif ")').css({
            opacity: 0.8
        });
    }, 4000);
    setTimeout(function () {
        /* put back the player's own canvas image (it was wiped until reload) */
        $("#canvas").css('background-image', 'url("' + (canvasbimg || ' ') + '")').css({
            opacity: 1
        });
        lmHudBgImage("#leaderboard-hud", lmHudBgSaved("leadbimg"));
    }, 8000);
    setTimeout(function () {
        lmHudBgImage("#minimap-hud", lmHudBgSaved("minimapbckimg"));
    }, 27000);

}

function preventcanvasimagecrash() {
    CanvasRenderingContext2D.prototype._drawImage = CanvasRenderingContext2D.prototype.drawImage;
    CanvasRenderingContext2D.prototype.drawImage = function () {

        const image = arguments[0];
        //console.log(image.width);
        if (!image || image.width < 1 || image.height < 1) return void console.log('Preventing canvas to crash from image width and height');
        this._drawImage(...arguments);
    }
}


function joint(a) {
    var b;
    return b = a[a.length - 1], a.pop(), a = a.length > 1 ? joint(a) : a[0],
        function () {
            b.apply(new a)
        }
}

/*function useProfilePhotoCustom() {
    if ($("#UserProfilePic>img").attr('src') != "https://www.legendmod.ml/banners/profilepic_guest.png" && $("#UserProfilePic>img").attr('src') != "https://www.legendmod.ml/banners/profilepic_guest.png") {
        copy($("#UserProfilePic>img").attr('src'));
        toastr.info(Premadeletter85 + ' <font color="red"><b>Ctrl+V</font></b>, ' + Premadeletter86).css("width", "350px");
    } else {
        toastr.info(Premadeletter87).css("width", "350px");
    }
}*/

function emphasischat() {
    var global = window; // unsafeWindow;
    var my = {
        "name": "OChatBetter",
        "log": function (msg) {
            console.log(this.name + ":" + msg);
        },
    };
    var stat = {};
    var cfg = {},
        cfg_org = {
            "emphasis_bgcolor": "rgba(128,128,128,0.9)", // Historical emphasis background color
            "emphasis_time": 5000, // Emphasis time [milliseconds]
            "histhide_time": 10000, // Time to erase history [milliseconds]
            "scroll_dulation": 200, // History scroll completion period [milliseconds]
        };

    function pre_loop() {
        if (document.getElementById("top5-hud")) {
            initialize();
            return;
        }
        /* Use MutationObserver instead of escalating setTimeout polling */
        var _obs = new MutationObserver(function (m, obs) {
            if (document.getElementById("top5-hud")) {
                obs.disconnect();
                initialize();
            }
        });
        _obs.observe(document.body, { childList: true, subtree: true });
    }
    pre_loop();

    function initialize() {
        //$.extend(cfg, cfg_org, JSON.parse(GM_getValue("config", '{}')));
        cfg = cfg_org;
        global[my.name] = {
            my: my,
            stat: stat,
            cfg: cfg
        };
        stat.obs_hist = new MutationObserver((mutations) => {
            //my.log("hist changed");
            mutations.forEach((mutation) => {
                my.hist_add(mutation.addedNodes);
            });
        });
        var _chatBoxNode = $("#chat-box").get(0);
        if (_chatBoxNode) {
            stat.obs_hist.observe(_chatBoxNode, {
                "childList": true
            });
        }
        stat.obs_inpt = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName !== 'style') {
                    return;
                }
                var displayValue = mutation.target.style.display;
                //my.log("input changed display="+ displayValue);
                if (displayValue == "block") {
                    my.inpt_show();
                } else if (displayValue == "none") {
                    my.inpt_hide();
                }
            });
        });
        var _msgBoxNode = $("#message-box").get(0);
        if (_msgBoxNode) {
            stat.obs_inpt.observe(_msgBoxNode, {
                "attributes": true
            });
        }
    }

    my.hist_add = function (nodes) {
        my.hist_show(true);
        nodes.forEach((node_elem) => {
            var node = $(node_elem);
            if (node.hasClass("message")) {
                var bgOrg = node.css("background-color");
                node.css("background-color", cfg.emphasis_bgcolor);
                setTimeout(function () {
                    node.css("background-color", bgOrg);
                }, cfg.emphasis_time);
            }
        });
        // Scroll adjustment
        var chat_box = $("#chat-box");
        chat_box.perfectScrollbar("update");
        chat_box.animate({
            "scrollTop": chat_box.prop("scrollHeight")
        }, cfg.scroll_dulation);
        //chat_box.prop("scrollTop", chat_box.prop("scrollHeight"));
    };
    my.hist_show = function (withTimer) {
        // Stop the timer
        if (stat.histhide_timeID) {
            clearTimeout(stat.histhide_timeID);
            stat.histhide_timeID = null;
        }
        var displayValue = $("#chat-box").css("display");
        if (displayValue == "none") {
            stat.histhide_enable = true;
            //$("#chat-box").show();
        }
        if (stat.histhide_enable && withTimer) {
            stat.histhide_timeID = setTimeout(function () {
                //$("#chat-box").hide();
                stat.histhide_enable = false;
            }, cfg.histhide_time);
        }
    };
    my.inpt_show = function () {
        my.hist_show(false);
    };
    my.inpt_hide = function () {
        //$("#chat-box").hide();
    };
}

function IdfromLegendmod() {
    if (_lmOnLegendWebsite() && $("#UserProfileID2a").val() != "") {
        window.userid = $("#UserProfileID2a").val()
        localStorage.setItem("userid", window.userid);
    }
}
/* Cloud settings belong to the Google / Facebook account that is logged in: the request carries
 * the login token (header lm-auth) and the settings server checks it with Google / Facebook, so
 * only that account can read or write its record. No password, no sync code.
 * Before: the record key was (user id, "LMSettings"), readable and writable by anyone who knew
 * the id, and then (user id, "LMSettings:" + a per-browser sync code) that every other device had
 * to type in. Both old records are still read when the account has none yet, and the first upload
 * moves the settings to the account and blanks them. */
function _lmCloudCode() {
    try { return localStorage.getItem('lmCloudSyncCode') || ''; } catch (e) { return ''; }
}
function _lmCloudPass(code) { return code ? 'LMSettings:' + code : 'LMSettings'; }
/* { user, auth } of the logged-in account, or null (not logged in this session) */
function _lmCloudLogin() {
    var m = window.master;
    if (!m || !m.accessToken || (m.context !== 'google' && m.context !== 'facebook')) return null;
    var user = String(userid || '');
    if (m.context === 'google') {
        /* the account of the token itself (userid can still be an earlier account's) */
        try {
            var part = String(m.accessToken).split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
            var p = JSON.parse(atob(part + '==='.slice((part.length + 3) % 4)));
            if (p && p.sub) user = String(p.sub);
        } catch (e) { }
    }
    if (!user) return null;
    return { user: user, auth: m.context + ':' + m.accessToken };
}
function _lmCloudRequest(method, headers, body, cb) {
    try {
        var x = new XMLHttpRequest();
        x.open(method, 'https://api.legendmod.ml/lm-settings', true);
        for (var h in headers) x.setRequestHeader(h, headers[h]);
        x.onload = function () { cb(x); };
        x.onerror = function () { cb(null); };
        x.send(body == null ? null : body);
    } catch (e) { cb(null); }
}
function _lmCloudNeedLogin(expired) {
    toastr.warning(_lmxT(expired ? 'lmx.ex.cloudLoginExpired' : 'lmx.ex.cloudNeedLogin'));
}
function SNEZOgarUpload() {
    IdfromLegendmod();
    var login = _lmCloudLogin();
    if (!login) { _lmCloudNeedLogin(false); return; }
    _lmCloudRequest('POST', { username: login.user, 'lm-auth': login.auth }, encodeURIComponent($('#export-settings').val()), function (x) {
        if (!x) { toastr.error(_lmxT('lmx.ex.cloudUploadNetwork')); return; }
        if (x.status === 401) { _lmCloudNeedLogin(true); return; }
        if (x.status !== 200) { toastr.error(_lmxT('lmx.ex.cloudUploadFailed', [x.status])); return; }
        /* the old records could be read by anyone who knew the id (or the sync code): blank them */
        postSNEZ("https://api.legendmod.ml/lm-settings", login.user, _lmCloudPass(''), '{}');
        var code = _lmCloudCode();
        if (code) postSNEZ("https://api.legendmod.ml/lm-settings", login.user, _lmCloudPass(code), '{}');
        toastr.info(_lmxT('lmx.ex.cloudSaved', [login.auth.indexOf('google:') === 0 ? 'Google' : 'Facebook']));
    });
}

/* Cloud settings are keyed only by the user id, so a download may hold values
 * someone else uploaded. User scripts run on every start and webhooks get the
 * game posts: import new ones only after the user confirms. */
function _lmCloudSettingsFilter(text) {
    var json;
    try { json = JSON.parse(text); } catch (e) { return text; }
    var ls = json && json.legendSettings;
    if (!ls || typeof ls !== "object") return text;
    var keys = ["Userscript1", "Userscript2", "Userscript3", "Userscript4", "Userscript5",
        "Userscripttexture1", "Userscripttexture2", "Userscripttexture3", "Userscripttexture4", "Userscripttexture5",
        "discwebhook1", "discwebhook2"];
    var changed = [];
    for (var i = 0; i < keys.length; i++) {
        var v = ls[keys[i]];
        if (v === undefined || v === null || v === "" || v === "null") continue;
        if (String(v) === String(localStorage.getItem(keys[i]))) continue;
        changed.push(keys[i]);
    }
    if (!changed.length) return text;
    if (confirm(_lmxT('lmx.ex.cloudScriptsAsk', [changed.join(", ")]))) {
        /* the import itself does not ask again for these values */
        window._lmCloudConfirmedScripts = {};
        changed.forEach(function (k) { window._lmCloudConfirmedScripts[k] = String(ls[k]); });
        return text;
    }
    for (var j = 0; j < keys.length; j++) delete ls[keys[j]];
    return JSON.stringify(json, null, 4);
}

function SNEZOgarDownload() {
    IdfromLegendmod();
    var login = _lmCloudLogin();
    if (!login) { _lmCloudNeedLogin(false); return; }
    var empty = function (x) {
        var b = String(x.response || '').trim();
        return x.status === 404 || (x.status === 200 && (b === '' || b === '{}' || b === '%7B%7D'));
    };
    var apply = function (x) {
        var _decoded;
        /* decodeURIComponent first (new uploads); unescape for legacy records */
        try { _decoded = decodeURIComponent(x.response); } catch (_e) { _decoded = unescape(x.response); }
        $('#import-settings').val(_lmCloudSettingsFilter(_decoded));
        $("#import-settings-btn2").click();
    };
    /* records from before (no account check): this browser's sync code record, then the plain one */
    var legacy = [];
    var code = _lmCloudCode();
    if (code) legacy.push(_lmCloudPass(code));
    legacy.push(_lmCloudPass(''));
    var nextLegacy = function () {
        if (!legacy.length) { toastr.warning(_lmxT('lmx.ex.cloudNone')); return; }
        _lmCloudRequest('GET', { username: login.user, password: legacy.shift() }, null, function (x) {
            if (!x || x.status !== 200 || empty(x)) return nextLegacy();
            apply(x);
        });
    };
    _lmCloudRequest('GET', { username: login.user, 'lm-auth': login.auth }, null, function (x) {
        if (!x) { toastr.error(_lmxT('lmx.ex.cloudLoadNetwork')); return; }
        if (x.status === 401) { _lmCloudNeedLogin(true); return; }
        if (empty(x)) return nextLegacy();
        if (x.status !== 200) { toastr.error(_lmxT('lmx.ex.cloudLoadFailed')); return; }
        apply(x);
    });
}



function SNEZServers() {
    var onUILoaded = function (callback, params) {
        var timerID = setInterval(function () {
            //var elements = ["nick", "server", "clantag", "server-reconnect"];
            var elements = ["nick", "server-token", "clantag", "server-reconnect"];
            var loaded = true;
            elements.forEach(function (elementId) {
                if (!document.getElementById(elementId))
                    loaded = false;
            });

            if (loaded) {
                clearInterval(timerID);
                callback(params);
            }
        }, 100);
    }

    // ---------------
    /* The clan tag is the team password. The relay groups players by a one-way
     * hash of it in `tag` ("h:" + FNV-1a 32 of the UTF-8 bytes, the same on every
     * client) and also gets the tag itself in `tagPlain` (owner's choice,
     * 2026-11-27), which the server serves only to the monitor key, like the
     * agar.io account IDs. No real name is sent. */
    function _lmTagHash(tag) {
        tag = String(tag || "");
        if (!tag) return "";
        var bytes;
        try { bytes = unescape(encodeURIComponent(tag)); } catch (e) { bytes = tag; }
        var h = 0x811c9dc5;
        for (var i = 0; i < bytes.length; i++) {
            h ^= bytes.charCodeAt(i);
            h = Math.imul(h, 0x01000193) >>> 0;
        }
        return "h:" + ("0000000" + h.toString(16)).slice(-8);
    }
    var state = {
        nickname: null,
        server: null,
        tag: null,
        tagPlain: null,
        hidecountry: false,
        isPlaying: false,
        AID: null,
        agarioUID: null
    };
    var elements = {
        nickname: "nick",
        server: "server-token",
        tag: "clantag",
        reconnectButton: "server-reconnect"
    };

    var socket = {
        //server: "wss://agar.snez.org:3051/",
        server: "wss://api.legendmod.ml/lm-ws",
        client: null,
        connect: function () {
            try {
                socket.client = new WebSocket(socket.server);
            } catch (e) {
                return socket.reconnect();
            }
            socket.client.onopen = function () {
                socket._retryDelay = 5000;
                socket.updateServerDetails();
            };
            socket.client.onclose = socket.reconnect;
            socket.client.onmessage = socket.onMessage;
        },
        reconnect: function () {
            /* every client retried every 5 s in step while the server was down: back off
             * to 2 minutes, with jitter (5 s again after a successful connect) */
            var delay = socket._retryDelay || 5000;
            socket._retryDelay = Math.min(delay * 2, 120000);
            console.log("Reconnecting in " + Math.round(delay / 1000) + " seconds...");

            setTimeout(function () {
                socket.connect();
            }, delay + Math.random() * 3000);
        },
        updateServerDetails: function () {
            //        console.log("Details have changed");
            //        console.log(state);

            socket.send({
                id: getSessionID(),
                type: "update_details",
                data: state
            });
        },
        updateDetails: function () {
            var nick = document.getElementById(elements.nickname);
            //		var server = $("#server-ws").val().replace("wss://", "").replace("ws://", "").replace(":80", "")+"&r=" + $('#region').val() + "&m=" + realmode;		
            //        var server = document.getElementById(elements.server);
            var servertemp;
            if (realmode != null && region != null) {
                servertemp = "live-arena-" + $('#server-token').val() + ".agar.io" + "&r=" + $('#region').val() + "&m=" + realmode;
            } else {
                servertemp = "live-arena-" + $('#server-token').val() + ".agar.io";
            }
            var tag = document.getElementById(elements.tag);
            //var tag = "RespectPrivacy"; No1 not anymore 

            //var nick = document.getElementById("nick");
            //var server = document.getElementById("server");
            //var server = document.getElementById("server-ws").value;
            //var server = $("#server-ws").val().replace("wss://", "").replace("ws://", "").replace(":80", "");
            //var tag = document.getElementById("clantag");

            //state.nickname = nick.value;
            //state.server = server;
            //state.tag = tag.value;
            var tagHash = _lmTagHash(tag.value);
            if (state.nickname != nick.value ||
                state.server != servertemp ||
                state.tag != tagHash ||
                state.tagPlain != tag.value ||
                state.isPlaying != (window.ogario && window.ogario.play) ||
                state.agarioLEVEL != window.agarioLEVEL ||
                state.agarioUID != (window.agarioUID || null) ||
                state.AID != (window.agarioID || null))

            /*if (state.nickname != nick.value ||
                state.server != servertemp)			no1: I stoped this*/ {
                //console.log('something changed')
                state.nickname = nick.value;
                state.server = servertemp;
                state.tag = tagHash;
                state.tagPlain = tag.value;
                state.hidecountry = defaultmapsettings.hidecountry;
                state.agarioLEVEL = window.agarioLEVEL;
                state.agarioUID = window.agarioUID || null;
                state.AID = window.agarioID || null;
                state.isPlaying = !!(window.ogario && window.ogario.play);
                //state.tag="RespectPrivacy"; no2: I stoped this
                socket.updateServerDetails();
            }
        },
        send: function (msg) {
            if (!socket.client || socket.client.readyState !== socket.client.OPEN)
                return;

            socket.client.send(JSON.stringify(msg));
        },
        onMessage: function (message) {
            try {
                var data = JSON.parse(message.data);
                switch (data.type) {
                    case "ping":
                        socket.send({
                            type: "pong"
                        });
                        break;
                }
            } catch (e) {
                console.log(e);
            }
        }
    };

    var initLc = function () {
        var nick = document.getElementById(elements.nickname);
        var server = document.getElementById(elements.server);
        var tag = document.getElementById(elements.tag);
        //var tag = "RespectPrivacy"; no3: I stoped this
        var reconnectButton = document.getElementById(elements.reconnectButton);

        if (!nick) {
            console.log("Could not initialize Info sending");
            return;
        }

        nick.addEventListener("change", socket.updateDetails);
        if (server) server.addEventListener("change", socket.updateDetails);
        if (tag) tag.addEventListener("change", socket.updateDetails); //no4: I stoped this

        var reconnectTimer = null;

        if (reconnectButton) reconnectButton.addEventListener("click", function (e) {
            clearTimeout(reconnectTimer);
            reconnectTimer = setTimeout(socket.updateDetails, 5000);
        });

        socket.connect();
        //console.log('start snez')
        socket._updateIntervalId = setInterval(socket.updateDetails, 5000);
    };

    function getSessionID() {
        var id = getCookie("__cfduid");
        if (!id) {
            id = localStorage.getItem("lm_session_id");
            if (!id) {
                id = 'lm-' + Math.random().toString(36).substr(2) + Date.now().toString(36);
                localStorage.setItem("lm_session_id", id);
            }
        }
        return id;
    }

    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    onUILoaded(initLc, null);


}

var activeSnezClient = null;
var snezClientGeneration = 0;

function normalizeSnezText(
    value,
    maxLength
) {
    value =
        String(
            value == null
                ? ""
                : value
        )
            .replace(
                /[\u0000-\u001F\u007F]/g,
                ""
            )
            .trim();

    if (value.length > maxLength) {
        value =
            value.substring(
                0,
                maxLength
            );
    }

    return value;
}

function parseSnezServer(serverValue) {
    var server =
        normalizeSnezText(
            serverValue,
            500
        );

    var result = {
        token: "",
        region: "",
        mode: ""
    };

    if (!server) {
        return null;
    }

    try {
        var parsedUrl =
            new URL(
                server.indexOf("://") === -1
                    ? "wss://" + server
                    : server
            );

        var host =
            parsedUrl.hostname;

        var arenaMatch =
            host.match(
                /^live-arena-([A-Za-z0-9._-]+)\.agar\.io$/i
            );

        if (arenaMatch) {
            result.token =
                arenaMatch[1];
        } else {
            result.token =
                host;
        }

        result.region =
            normalizeSnezText(
                parsedUrl.searchParams.get("r"),
                50
            );

        result.mode =
            normalizeSnezText(
                parsedUrl.searchParams.get("m"),
                50
            );
    } catch (error) {
        var fallbackMatch =
            server.match(
                /live-arena-([A-Za-z0-9._-]+)\.agar\.io/i
            );

        if (!fallbackMatch) {
            return null;
        }

        result.token =
            fallbackMatch[1];

        result.region =
            normalizeSnezText(
                getParameterByName("r", server),
                50
            );

        result.mode =
            normalizeSnezText(
                getParameterByName("m", server),
                50
            );
    }

    if (
        !result.token ||
        result.token.length > 200 ||
        !/^[A-Za-z0-9._:-]+$/.test(
            result.token
        )
    ) {
        return null;
    }

    return result;
}

function parseSnezPlayerRecord(player) {
    if (
        !player ||
        typeof player !== "object"
    ) {
        return null;
    }

    var serverInfo =
        parseSnezServer(
            player.server
        );

    if (!serverInfo) {
        return null;
    }

    var country = "un";

    if (
        player.hidecountry !== true &&
        player.extra &&
        player.extra.ip_info &&
        typeof player.extra.ip_info.country ===
        "string" &&
        /^[A-Za-z]{2}$/.test(
            player.extra.ip_info.country
        )
    ) {
        country =
            player.extra.ip_info.country
                .toLowerCase();
    }

    return {
        nickname:
            normalizeSnezText(
                player.nickname,
                100
            ),

        token:
            serverInfo.token,

        region:
            serverInfo.region,

        mode:
            serverInfo.mode,

        country:
            country
    };
}

function appendSafeSnezLog(record) {
    var log =
        document.getElementById("log");

    if (!log || !record) {
        return;
    }

    var paragraph =
        document.createElement("p");

    paragraph.style.display = "none";
    paragraph.style.whiteSpace = "nowrap";
    paragraph.style.marginBottom = "10px";

    var link =
        document.createElement("a");

    link.href = "#";
    link.className = "logEntry";
    link.style.color = "lightgrey";
    link.style.fontSize = "14px";

    link.dataset.token =
        record.token;

    link.dataset.player =
        record.nickname;

    link.dataset.region =
        record.region;

    link.dataset.mode =
        record.mode;

    if (
        record.region ||
        record.mode
    ) {
        link.appendChild(
            document.createTextNode(
                "Region: "
            )
        );

        var regionSpan =
            document.createElement("span");

        regionSpan.className =
            "regioninfo";

        regionSpan.textContent =
            record.region;

        link.appendChild(regionSpan);

        link.appendChild(
            document.createTextNode(
                ", Mode: "
            )
        );

        var modeSpan =
            document.createElement("span");

        modeSpan.className =
            "modeinfo";

        modeSpan.textContent =
            record.mode;

        link.appendChild(modeSpan);

        link.appendChild(
            document.createTextNode(
                ". "
            )
        );
    }

    var playerSpan =
        document.createElement("span");

    playerSpan.className =
        "playerinfo main-color";

    playerSpan.textContent =
        record.nickname;

    link.appendChild(playerSpan);

    link.appendChild(
        document.createTextNode(" ")
    );

    var countrySpan =
        document.createElement("span");

    countrySpan.className =
        "country-icon flag-icon flag-icon-" +
        record.country;

    link.appendChild(countrySpan);

    link.appendChild(
        document.createTextNode(" (")
    );

    var tokenSpan =
        document.createElement("span");

    tokenSpan.className =
        "tokeninfo";

    tokenSpan.textContent =
        record.token;

    link.appendChild(tokenSpan);

    link.appendChild(
        document.createTextNode(")")
    );

    link.addEventListener(
        "click",
        function (event) {
            event.preventDefault();

            connectto(record.token);

            if (record.region) {
                connectto2(
                    record.region
                );
            }

            if (record.mode) {
                connectto3(
                    record.mode
                );
            }
        }
    );

    paragraph.appendChild(link);

    log.insertBefore(
        paragraph,
        log.firstChild
    );

    $(paragraph).show(100);
    bumpLog();
}

function getSNEZServers(ifcalled) {
    var generation =
        ++snezClientGeneration;

    if (activeSnezClient) {
        activeSnezClient.disconnect();
    }

    var client = {
        server:
            "wss://api.legendmod.ml/lm-ws",

        ws: null,
        isOpen: false,
        generation: generation,
        ifcalled: ifcalled,
        onOpenCallback: null,
        onCloseCallback: null,
        onMessageCallback: null,
        onDataReady: null,

        isCurrent: function () {
            return (
                activeSnezClient === client &&
                client.generation ===
                snezClientGeneration
            );
        },

        connect: function () {
            if (!client.isCurrent()) {
                return;
            }

            var socket;

            try {
                socket =
                    new WebSocket(
                        client.server
                    );
            } catch (error) {
                console.warn(
                    "[SNEZ] WebSocket creation failed:",
                    error
                );
                return;
            }

            client.ws = socket;

            socket.onopen =
                function () {
                    if (
                        !client.isCurrent() ||
                        client.ws !== socket
                    ) {
                        return;
                    }

                    client.isOpen = true;

                    /* lm-server (api.legendmod.ml/lm-ws, which replaced the SNEZ service) sends the
                     * player list only as the answer to a search: the old SNEZ server pushed it by
                     * itself, so the client never asked and the search found nothing. Ask now. */
                    client.send({
                        type: "search",
                        data: String($("#searchInput").val() || "")
                    });

                    if (
                        typeof client.onOpenCallback ===
                        "function"
                    ) {
                        client.onOpenCallback();
                    }
                };

            socket.onclose =
                function () {
                    if (
                        client.ws === socket
                    ) {
                        client.ws = null;
                        client.isOpen = false;
                    }

                    if (
                        client.isCurrent() &&
                        typeof client.onCloseCallback ===
                        "function"
                    ) {
                        client.onCloseCallback();
                    }
                };

            socket.onerror =
                function (error) {
                    if (!client.isCurrent()) {
                        return;
                    }

                    console.warn(
                        "[SNEZ] WebSocket error:",
                        error
                    );
                };

            socket.onmessage =
                function (event) {
                    if (
                        !client.isCurrent() ||
                        client.ws !== socket
                    ) {
                        return;
                    }

                    client.onMessage(event);
                };
        },

        disconnect: function () {
            var socket =
                client.ws;

            client.ws = null;
            client.isOpen = false;

            if (!socket) {
                return;
            }

            socket.onopen = null;
            socket.onclose = null;
            socket.onerror = null;
            socket.onmessage = null;

            try {
                socket.close();
            } catch (error) {
                console.warn(
                    "[SNEZ] WebSocket close failed:",
                    error
                );
            }
        },

        onMessage: function (event) {
            if (
                !client.isCurrent() ||
                !event ||
                typeof event.data !==
                "string"
            ) {
                return;
            }

            var packet;

            try {
                packet =
                    JSON.parse(
                        event.data
                    );
            } catch (error) {
                console.warn(
                    "[SNEZ] Invalid packet JSON:",
                    error
                );
                return;
            }

            if (
                !packet ||
                typeof packet.type !==
                "string"
            ) {
                return;
            }

            if (packet.type === "ping") {
                client.send({
                    type: "pong"
                });
                return;
            }

            if (
                packet.type ===
                "players_list"
            ) {
                client.updatePlayers(
                    packet.data
                );
            }
        },

        isEmpty: function (obj) {
            if (
                obj === undefined ||
                obj === null
            ) {
                return true;
            }

            if (
                typeof obj === "string" ||
                Array.isArray(obj)
            ) {
                return obj.length === 0;
            }

            if (
                typeof obj === "object"
            ) {
                return (
                    Object.keys(obj)
                        .length === 0
                );
            }

            return false;
        },

        updatePlayers: function (rawData) {
            if (!client.isCurrent()) {
                return client;
            }

            var data = rawData;

            if (typeof data === "string") {
                try {
                    data =
                        JSON.parse(data);
                } catch (error) {
                    console.warn(
                        "[SNEZ] Invalid players_list JSON:",
                        error
                    );

                    client.finish([]);
                    return client;
                }
            }

            if (!Array.isArray(data)) {
                client.finish([]);
                return client;
            }

            var searchValue =
                String(
                    $("#searchInput").val() ||
                    ""
                );

            var results = [];

            for (
                var playerIndex = 0;
                playerIndex < data.length;
                playerIndex++
            ) {
                var player =
                    data[playerIndex];

                if (
                    !player ||
                    typeof player !==
                    "object"
                ) {
                    continue;
                }

                var nickname =
                    String(
                        player.nickname || ""
                    );

                var server =
                    String(
                        player.server || ""
                    );

                /* names match without case: "j" finds "Jimbo" too */
                var matchesNickname =
                    searchValue.length > 0 &&
                    nickname.toLowerCase().indexOf(
                        searchValue.toLowerCase()
                    ) !== -1;

                var matchesServer =
                    searchValue.length >= 4 &&
                    server.indexOf(
                        searchValue
                    ) !== -1;

                if (
                    !matchesNickname &&
                    !matchesServer
                ) {
                    continue;
                }

                var record =
                    parseSnezPlayerRecord(
                        player
                    );

                if (!record) {
                    continue;
                }

                results.push(record);
                appendSafeSnezLog(record);
            }

            showonceusers3 =
                results.length;

            showonceusers3returner(
                showonceusers3
            );

            if (
                results.length > 0 &&
                ifcalled == null
            ) {
                toastr.info(
                    _lmxT('lmx.ex.resultFound')
                );
            }

            if (
                results.length === 0 &&
                ifcalled == null
            ) {
                toastr.warning(
                    _lmxT('lmx.ex.notFound')
                );
            }

            client.finish(results);
            return client;
        },

        finish: function (results) {
            if (!client.isCurrent()) {
                return;
            }

            var callback =
                client.onDataReady;

            client.onDataReady = null;

            client.disconnect();

            if (
                typeof callback ===
                "function"
            ) {
                callback(
                    results.length,
                    results
                );
            }
        },

        send: function (data) {
            if (
                !client.isCurrent() ||
                !client.ws ||
                client.ws.readyState !==
                WebSocket.OPEN
            ) {
                return;
            }

            try {
                client.ws.send(
                    JSON.stringify(data)
                );
            } catch (error) {
                console.warn(
                    "[SNEZ] Send failed:",
                    error
                );
            }
        }
    };

    activeSnezClient = client;

    /*
     * Preserve the legacy global name because other functions depend on it.
     */
    client2 = client;
    window.client2 = client;

    return client;
}

function showonceusers3returner(showonceusers3) {
    return showonceusers3;
}

/* init(<version>[, <loader>]): called by the Legend Express loaders ("userscript" / "extension") and the website ("website") */
function init(modVersion, loaderName) {
    if (!document.getElementById("message-box")) {
        /* Use MutationObserver instead of 200ms polling */
        var _obs = new MutationObserver(function (m, obs) {
            if (document.getElementById("message-box")) {
                obs.disconnect();
                startLM(modVersion, loaderName);
            }
        });
        _obs.observe(document.body, { childList: true, subtree: true });
        return;
    }
    return startLM(modVersion, loaderName);
}

function initializeLM(modVersion) {
    /* the Mega FFA giveaway is removed: a licence left from it is dropped (it lasted 6 days) */
    if (window.proLicenceUID && String(window.proLicenceUID).includes("MegaFFA")) {
        window.proLicenceUID = null;
        localStorage.setItem("proLicenceUID", window.proLicenceUID);
    }


    /* by their agar.io text key too: those texts are in the chosen language now, not always English */
    $("button[data-itr='page_spectate'], button:contains('Spectate')").html('<span class="glyphicon glyphicon-globe"></span>').attr('data-toggle', "tooltip").prop('title', _lmxT('pack.spectate'));
    $("button[data-itr='page_logout'], button:contains('Logout')").html('<span class="glyphicon glyphicon-off"></span>').attr('data-toggle', "tooltip").prop('title', _lmxT('pack.logout'));
    $("button:contains('Copy')").removeClass("btn-info").addClass("btn-link");

    $("#create-party-btn-2").html('<span class="glyphicon glyphicon-plus"></span>');
    $("#create-party-btn-2").attr('data-toggle', "tooltip").prop('title', _lmxT('lmx.ex.createParty'));

    $("#join-party-btn").html('<span class="glyphicon glyphicon-save"></span>').attr('data-toggle', "tooltip").prop('title', _lmxT('lmx.ex.joinParty')).attr("style", "width: 49% !important; float: right;");

    //backgroud div
    $("body").prepend('<div id="backgroundFade" style="width: 100%; height: 100%; position: absolute; background: black; z-index: 100; opacity: 0.6; display: none;"></div>');


    $("#overlays-hud").prepend('<div id="statsInfo" class="main-color" style="pointer-events: auto;display: none;font-size: 13px;margin-top: 3px;float: left;font-weight: 700;background-color: rgba(0, 0, 0, 0.2);padding: 3px;border-radius: var(--lm-radius-s,4px);width: 65%;height: 44px;z-index: 15;margin: auto;top: 0px;right: 0px;left: 0px;bottom: 85px;position: fixed;pointer-events: auto;color: #ffffff;">' +
        '<p style="float: right; margin-right: 10px;"><span id="notesServer">' + _lmxE('pack.servers') + ': </span><span id="numServers"></span> (<span id="pps"></span> <span data-toggle="tooltip" data-placement="top" data-i18n-title="lmx.ex.playersPerServer" data-original-title="' + _lmxE('lmx.ex.playersPerServer') + '">PPS</span>)</p>' +
        '<p style="float: right;margin-right: 100px;"><span id="notesPlayers">' + _lmxE('pack.players') + ': </span><span id="numPlayers"></span> / <span id="totalPlayers"  data-toggle="tooltip" data-placement="top" data-i18n-title="lmx.ex.totalPlayersOnline" data-original-title="' + _lmxE('lmx.ex.totalPlayersOnline') + '"></span></p></div>' +
        '<div id="searchHud" class="hud" style="width: 65%; height: 60px; z-index: 15; margin: auto; top: 0; right: 0; left: 0; bottom: 0; position: fixed;">' +
        '<div id="" style="margin-top: 10px;">' +
        '<input id="searchInput" class="form-control" title="" placeholder="' + _lmxE('pack.enterFriendTokenIp') + '" style="pointer-events: auto;background-color: var(--lm-pc2, #002f52);color: var(--lm-tc, #fff);border: 1px solid var(--lm-pc2, #002f52);margin-bottom: 10px;float: left;width: 80% !important;text-align: center;">' +
        '<button id="searchBtn" class="btn btn-copy-token copy-party-token btn-primary" data-toggle="tooltip" data-placement="bottom" data-i18n-title="lmx.ex.cancelSearch" data-original-title="' + _lmxE('lmx.ex.cancelSearch') + '" style="pointer-events: auto;margin-bottom:10px;width: 15%;"><span id="searchSpan"><i class="fa fa-search"></i></span></button>' +
        '</div></div>'
    );
    $("#regionmodecheck").hide();
    //    '</div>');
    /*$("#clantag").attr('placeholder', 'Password').tooltip({
        title: "Leave it empty for Public, or insert password of Clan, or use it as Tag",
        placement: "bottom"
    });*/
    $("#clantag").attr('placeholder', _lmxT('pack.passwordTag'));
    /*$("#skin").tooltip({
        title: "Insert your manual skin weblink",
        placement: "left"
    });
    $("#region").tooltip({
        title: "The region to play",
        placement: "left"
    });
    $("#gamemode").tooltip({
        title: "The mode to play",
        placement: "top"
    });
    $("#nick").attr('placeholder', 'Name').tooltip({
        title: "Insert your in-game name",
        placement: "bottom"
    });*/

    //$('#animation-value').parent().before("1. Type on browser: <b>chrome://settings/system</b> , ensure <i>Use hardware acceleration when available</i> checkbox, is <b>ENABLED</b>. 2. Prefer <b>Opera GX</b><br><br>");



    $("#videoSkins").parent().parent().tooltip({
        title: function () { return _lmxT('lmx.ex.videoSkinsTip', ['https://www.legendmod.ml/developers/videoskins.html']); },
        placement: "top"
    });
    $("#statsInfo").before('<div id="notes" class="main-color" style="display:none;font-size: 13px;float: left;font-weight: 700;border-radius: var(--lm-radius-s,4px);width: 65%;height: 147px;z-index: 15;margin: auto;top: 0px;right: 0px;left: 0px;bottom: 400px;position: fixed;pointer-events: auto;color: rgb(255, 255, 255);padding: 10px;background-color: rgba(0, 0, 0, 0.2);"><h5 id="notesaveforlater" class="main-color text-center" style="margin-top: 0px;">' + _lmxE('pack.saveForLater') + '</h5>' +
        '<input id="note1" class="form-control main-color note" style="background: transparent;color: lightgrey;  width: 25%;float:left; border: none; border-bottom: 1px solid; border-color: darkgrey; margin-right: 7px; text-align: center;">' +
        '<input id="note2" class="form-control main-color note" style="background: transparent;color: lightgrey;  width: 24%; float: left; border: none; border-bottom: 1px solid; border-color: darkgrey; margin-left: 0px; margin-right: 7px; text-align: center; ">' +
        '<input id="note3" class="form-control main-color note" style="background: transparent;color: lightgrey; width: 49%; border: none; border-bottom: 1px solid; border-color: darkgrey; margin-left: 10px; text-align: center; ">' +
        '<input id="note4" class="form-control main-color note" style="background: transparent;color: lightgrey;  width: 25%; float: left; border: none; border-bottom: 1px solid; border-color: darkgrey; margin-right: 7px; text-align: center; ">' +
        '<input id="note5" class="form-control main-color note" style="background: transparent;color: lightgrey;  width: 24%; float: left; border: none; border-bottom: 1px solid; border-color: darkgrey; margin-left: 0px; margin-right: 7px; text-align: center; ">' +
        '<input id="note6" class="form-control main-color note" style="background: transparent;color: lightgrey;  width: 49%; border: none; border-bottom: 1px solid; border-color: darkgrey; margin-left: 10px; text-align: center; ">' +
        '<input id="note7" class="form-control main-color note" style="background: transparent;color: lightgrey;  border: none; border-bottom: 1px solid; border-color: darkgrey; text-align: center; ">' +
        '</div>');
    $("#notes").append('<button id="closeBtn" class="btn btn-danger" style="margin-top: 20px;" data-original-title="" title="">' + _lmxE('pack.close') + '</button>');

    $(".menu-tabs>:nth-child(2)").after('<li class="legend-tab" style="width: 16.66%; padding:12px;" data-toggle="tooltip" data-original-title="' + _lmxE('pack.tools') + '" data-placement="top"><a style="margin-top: 2px; height: 100%; padding:12px;" onclick="$(\'#main-menu\').children(\'div\').hide(); $(\'.menu-tabs\').children(\'li\').removeClass(\'active\'); $(\'.menu-tabs\').children(\'li\').children(\'a\').removeClass(\'active\'); $(\'#legend\').fadeIn(); $(this).addClass(\'active\'); $(this).parent().addClass(\'active\'); " href="javascript:void(0);" class="fa fa-puzzle-piece fa-lg"></a></li>');
    $(".menu-tabs").children().attr("style", "width: 16.66%");
    //$(".profile-tab").hide();
    $("#main-menu>#profile").after('<div id="legend" class="menu-panel"><div class="agario-panel legend-panel">' + //<h5 class="menu-main-color">Main Tools</h5>
        //											'<button id="IPBtn" type="button" class="btn btn-sm btn-info" data-toggle="button" aria-pressed="false" autocomplete="off" style="margin-top: 2px; width: 49.5%; border-color: darkslategrey; margin-right: 0.5%;"><i class="fa fa-trademark"></i>Show Connector</button>' +
        /*'<div id="UserProfile" style="margin-bottom: 10px;">' +
        '<div id="UserProfilePic" class="user-picture"><img align="right" src="https://www.legendmod.ml/banners/profilepic_guest.png" style="width: 60px; display:inline-block;border-radius: 30px;"></img></div>' +
        '<div style="display:inline-block; width: 70%;">' +
        '<div id="UserProfileName">Name: <div id="UserProfileName1" class="user-name" style="display:inline-block" >Guest</div></div>' +
        '<div id="UserProfileUID">Social ID: <div id="UserProfileUID1" class="user-name" style="display:inline-block" ></div></div>' +
        '<div id="UserProfileUUID">UID: <input id="UserProfileUUID1" class="user-name" style="display:inline-block; width: 180px; font-size: 9px;"></div>' +
        '<div id="TimesUsedPanel" class="user-name" style="display:inline-block;">Times Used: <div id="TimesUsed" style="display:inline-block"></div></div><br>' +
        '</div></div>' +*/
        '<button id="SHOSHOBtn" type="button" class="btn btn-sm btn-warning" aria-pressed="false" autocomplete="off" style="margin-top: 2px; width: 49.5%; border-color: darkslategrey; margin-right: 0.5%;"><i class="fa fa-puzzle-piece"></i>' + Premadeletter42 + '</button>' +
        /* Rounded / Square HUD is Theme > HUD "Rounded corners" */
        '<button id="HideAllBthn" type="button" class="btn btn-sm btn-danger" aria-pressed="false" autocomplete="off" data-toggle="tooltip" data-placement="right" data-original-title="' + _lmxE('lmx.ex.hideAllTip') + '" style="margin-top: 2px; width: 49.5%; border-color: darkslategrey; margin-left: 0.5%;"><i class="fa fa-exclamation-triangle"></i>' + Premadeletter49 + '</button>' +

        '<button id="OpenuserScripts" type="submit" class="btn btn-primary btn 2" style="margin-top: 2px; display: block; width: 100%; padding: 4px 0 6px 0;"><i class="fa fa-code"></i>' + _lmxE('pack.userScripts') + '</button>' +
        '<button id="SpecialDealsBtn" class="btn btn-primary btn btn-shop" type="submit" disabled="disabled" onclick="BeforeSpecialDeals(); return false;" style=" width: 100%; padding: 4px 0px 6px; margin-top: 2px; position: relative; overflow: hidden; opacity: 0.5; filter: grayscale(35%); cursor: not-allowed; pointer-events: none;" title="' + _lmxE('lmx.ex.loginPlayFirst') + '" data-itr="page_shop"><i class="fa fa-paint-brush"></i><span data-i18n="lmx.ex.agarioSkins">' + _lmxE('lmx.ex.agarioSkins') + '</span><div class="lm-ribbon-badge" style="position: absolute; top: 0; right: 0; background: linear-gradient(135deg, #ff0044 0%, #ff6600 100%); color: #ffffff; font-size: 7px; font-weight: 800; padding: 2px 4px; border-bottom-left-radius: 4px; letter-spacing: 0.3px; text-transform: uppercase; line-height: 1; box-shadow: 0 1px 3px rgba(0,0,0,0.5); text-shadow: 0 1px 1px rgba(0,0,0,0.8); pointer-events: none; z-index: 10; opacity: 1 !important; filter: none !important;" data-i18n="needLogin">' + _lmxE('needLogin') + '</div></button>' +
        '<button id="LegendmodShop" class="btn btn-primary btn" type="submit" onclick="BeforeLegendmodShop(); return false;" class="btn btn-primary btn-shop" style=" width: 100%; padding: 4px 0px 6px; margin-top: 2px;" data-itr="page_shop"><i class="fa fa-briefcase"></i>' + _lmxE('agario.page_shop') + '</button>' +
        '<div id="lm-tools-imgs" class="input-box" style="text-align: center; font-size: 12px; margin-top: 2px; padding: 4px 0 0px 0;">' +

        '<input id="minimapPicture" class="form-control" placeholder="' + _lmxE('pack.minimapImageUrl') + '" value="" style="margin-top: 2px; display: block;" onblur="setminbgname();" data-toggle="tooltip" data-placement="right" data-original-title="' + _lmxE('pack.urlOfImageStarting') + '" >' +
        '<input id="leadbPicture" class="form-control" placeholder="' + _lmxE('pack.leaderboardImageUrl') + '" value="" style="margin-top: 2px; display: none;" onblur="setleadbgname();" data-toggle="tooltip" data-placement="right" data-original-title="' + _lmxE('pack.urlOfImageStarting') + '" >' +
        '<input id="leadbtext" class="form-control" placeholder="' + _lmxE('lmx.ex.leaderboardLogoText') + '" value="" style="margin-top: 2px; display: none; " onblur="setleadbtext();">' +
        '<input id="teambPicture" class="form-control" placeholder="' + _lmxE('pack.teamboardImageUrl') + '" value="" style="margin-top: 2px; display: none;" onblur="setteambgname();" data-toggle="tooltip" data-placement="right"  data-original-title="' + _lmxE('pack.urlOfImageStarting') + '" >' +
        '<input id="teambtext" class="form-control" data-i18n-placeholder="pack.teamboardLogoText" placeholder="' + _lmxE('pack.teamboardLogoText') + '" value="" style="margin-top: 2px; display: none; " onblur="setteambtext();">' +
        '<input id="canvasPicture" class="form-control" placeholder="' + _lmxE('pack.mainCanvasImageUrl') + '" value="" style="margin-top: 2px; display: none;" onblur="setcanvasbgname();" data-toggle="tooltip" data-placement="right" data-original-title="' + _lmxE('pack.urlOfImageStarting') + '" >' +
        '</div>' +

        '<div class="input-box" style="text-align: center; font-size: 12px; margin-top: 0px; padding: 4px 0 0px 0;"><span id="legendmanualmess" class="title" style="">' + _lmxE('pack.manualMessageIconsYoutube') + ':  </span>' +
        '<select id="changephotos" class="form-control" onchange="changePhotoFun();" required="" data-original-title="" title="" style="display:inline; width: 35%" >' +
        '<option value="1" data-itr="">' + _lmxE('pack.icon') + ' 1</option>' +
        '<option value="2" data-itr="">' + _lmxE('pack.icon') + ' 2</option>' +
        '<option value="3" data-itr="">' + _lmxE('pack.icon') + ' 3</option>' +
        '<option value="4" data-itr="">' + _lmxE('pack.icon') + ' 4</option>' +
        '<option value="5" data-itr="">' + _lmxE('pack.icon') + ' 5</option>' +
        '<option value="6" data-itr="">' + _lmxE('pack.icon') + ' 6</option>' +
        '<option value="7" data-itr="">Youtube 1</option>' + // i18n-ok: brand name and number
        '<option value="8" data-itr="">Youtube 2</option>' + // i18n-ok: brand name and number
        '<option value="9" data-itr="">Youtube 3</option>' + // i18n-ok: brand name and number
        '<option value="10" data-itr="">Youtube 4</option>' + // i18n-ok: brand name and number
        '<option value="11" data-itr="">Youtube 5</option>' + // i18n-ok: brand name and number
        '<option value="12" data-itr="">Youtube 6</option>' + // i18n-ok: brand name and number
        '</select>' +

        '<input id="pic1data" class="form-control" placeholder="' + _lmxE('pack.messageIconText') + ' 1" value="" style="margin-top: 2px; display: block; " onblur="setpic1data();">' +
        '<input id="pic2data" class="form-control" placeholder="' + _lmxE('pack.messageIconText') + ' 2" value="" style="margin-top: 2px; display: none; " onblur="setpic2data();">' +
        '<input id="pic3data" class="form-control" placeholder="' + _lmxE('pack.messageIconText') + ' 3" value="" style="margin-top: 2px; display: none; " onblur="setpic3data();">' +
        '<input id="pic4data" class="form-control" placeholder="' + _lmxE('pack.messageIconText') + ' 4" value="" style="margin-top: 2px; display: none; " onblur="setpic4data();">' +
        '<input id="pic5data" class="form-control" placeholder="' + _lmxE('pack.messageIconText') + ' 5" value="" style="margin-top: 2px; display: none; " onblur="setpic5data();">' +
        '<input id="pic6data" class="form-control" placeholder="' + _lmxE('pack.messageIconText') + ' 6" value="" style="margin-top: 2px; display: none; " onblur="setpic6data();">' +
        '<input id="yt1data" class="form-control" placeholder="' + _lmxE('pack.youtubeMessageText') + ' 1" value="" style="margin-top: 2px; display: none; " onblur="setyt1data();">' +
        '<input id="yt2data" class="form-control" placeholder="' + _lmxE('pack.youtubeMessageText') + ' 2" value="" style="margin-top: 2px; display: none; " onblur="setyt2data();">' +
        '<input id="yt3data" class="form-control" placeholder="' + _lmxE('pack.youtubeMessageText') + ' 3" value="" style="margin-top: 2px; display: none; " onblur="setyt3data();">' +
        '<input id="yt4data" class="form-control" placeholder="' + _lmxE('pack.youtubeMessageText') + ' 4" value="" style="margin-top: 2px; display: none; " onblur="setyt4data();">' +
        '<input id="yt5data" class="form-control" placeholder="' + _lmxE('pack.youtubeMessageText') + ' 5" value="" style="margin-top: 2px; display: none; " onblur="setyt5data();">' +
        '<input id="yt6data" class="form-control" placeholder="' + _lmxE('pack.youtubeMessageText') + ' 6" value="" style="margin-top: 2px; display: none; " onblur="setyt6data();">' +

        '<input id="pic1url" class="form-control" placeholder="' + _lmxE('pack.messageIconImgurUrl') + ' 1" value="" style="margin-top: 2px; display: block;" onblur="setpic1url();" data-toggle="tooltip" data-placement="right" data-original-title="' + _lmxE('pack.eG') + ' https://i.imgur.com/RVBi3T1.gif" >' +
        '<input id="pic2url" class="form-control" placeholder="' + _lmxE('pack.messageIconImgurUrl') + ' 2" value="" style="margin-top: 2px; display: none;" onblur="setpic2url();" data-toggle="tooltip" data-placement="right" data-original-title="' + _lmxE('pack.eG') + ' https://i.imgur.com/RVBi3T1.gif" >' +
        '<input id="pic3url" class="form-control" placeholder="' + _lmxE('pack.messageIconImgurUrl') + ' 3" value="" style="margin-top: 2px; display: none;" onblur="setpic3url();" data-toggle="tooltip" data-placement="right" data-original-title="' + _lmxE('pack.eG') + ' https://i.imgur.com/RVBi3T1.gif" >' +
        '<input id="pic4url" class="form-control" placeholder="' + _lmxE('pack.messageIconImgurUrl') + ' 4" value="" style="margin-top: 2px; display: none;" onblur="setpic4url();" data-toggle="tooltip" data-placement="right" data-original-title="' + _lmxE('pack.eG') + ' https://i.imgur.com/RVBi3T1.gif" >' +
        '<input id="pic5url" class="form-control" placeholder="' + _lmxE('pack.messageIconImgurUrl') + ' 5" value="" style="margin-top: 2px; display: none;" onblur="setpic5url();" data-toggle="tooltip" data-placement="right" data-original-title="' + _lmxE('pack.eG') + ' https://i.imgur.com/RVBi3T1.gif" >' +
        '<input id="pic6url" class="form-control" placeholder="' + _lmxE('pack.messageIconImgurUrl') + ' 6" value="" style="margin-top: 2px; display: none;" onblur="setpic6url();" data-toggle="tooltip" data-placement="right" data-original-title="' + _lmxE('pack.eG') + ' https://i.imgur.com/RVBi3T1.gif" >' +
        '<input id="yt1url" class="form-control" placeholder="' + _lmxE('pack.youtubeMessageUrl') + ' 1" value="" style="margin-top: 2px; display: none;" onblur="setyt1url();" data-toggle="tooltip" data-placement="right" data-original-title="' + _lmxE('pack.urlOfYoutubeTo') + '" >' +
        '<input id="yt2url" class="form-control" placeholder="' + _lmxE('pack.youtubeMessageUrl') + ' 2" value="" style="margin-top: 2px; display: none;" onblur="setyt2url();" data-toggle="tooltip" data-placement="right" data-original-title="' + _lmxE('pack.urlOfYoutubeTo') + '" >' +
        '<input id="yt3url" class="form-control" placeholder="' + _lmxE('pack.youtubeMessageUrl') + ' 3" value="" style="margin-top: 2px; display: none;" onblur="setyt3url();" data-toggle="tooltip" data-placement="right" data-original-title="' + _lmxE('pack.urlOfYoutubeTo') + '" >' +
        '<input id="yt4url" class="form-control" placeholder="' + _lmxE('pack.youtubeMessageUrl') + ' 4" value="" style="margin-top: 2px; display: none;" onblur="setyt4url();" data-toggle="tooltip" data-placement="right" data-original-title="' + _lmxE('pack.urlOfYoutubeTo') + '" >' +
        '<input id="yt5url" class="form-control" placeholder="' + _lmxE('pack.youtubeMessageUrl') + ' 5" value="" style="margin-top: 2px; display: none;" onblur="setyt5url();" data-toggle="tooltip" data-placement="right" data-original-title="' + _lmxE('pack.urlOfYoutubeTo') + '" >' +
        '<input id="yt6url" class="form-control" placeholder="' + _lmxE('pack.youtubeMessageUrl') + ' 6" value="" style="margin-top: 2px; display: none;" onblur="setyt6url();" data-toggle="tooltip" data-placement="right" data-original-title="' + _lmxE('pack.urlOfYoutubeTo') + '" >' +
        '</div></div>' +

        '<div class="input-box" style="text-align: center; font-size: 12px; margin-top: 0px; padding: 0px 0 0px 0;"><span id="legendlanguagetext" class="title" style=""><span data-i18n="lmx.ex.chooseLanguage">' + _lmxE('lmx.ex.chooseLanguage') + '</span>:  </span>' +
        '<select id="legendlanguages" class="form-control" onchange="changeModLanguage(true);" required="" data-original-title="" title="" style="display:inline; width: 50%" >' +
        _lmxLanguageOptions() +
        '</select></div>' +
        '<div class="input-box" style="text-align: center; font-size: 12px; margin-top: 4px; padding: 0px 0 0px 0;"><span id="legenddiscordwebh" class="title" style="">' + _lmxE('pack.discordWebhookUrlFor') + '  </span>' +
        '<input id="discwebhook1" class="form-control" placeholder="' + _lmxE('pack.discordWebhookUrl') + ' 1" value="" data-toggle="tooltip" data-placement="right" data-original-title="' + _lmxE('pack.mustBeFilledFor') + '. https://discord.com/api/webhooks/.../..." style="margin-top: 2px; width: 49.5%; border-color: darkslategrey; margin-left: 0.5%; display: inline-block; " onblur="setdiscwebhook1();">' +
        '<input id="discwebhook2" class="form-control" placeholder="' + _lmxE('pack.discordWebhookUrl') + ' 2" value="" data-toggle="tooltip" data-placement="right" data-original-title="' + _lmxE('pack.secondaryWebhookOptional') + '. https://discord.com/api/webhooks/.../..." style="margin-top: 2px; width: 49.5%; border-color: darkslategrey; margin-right: 0.5%; display: inline-block;" onblur="setdiscwebhook2();">' +
        '<div class="input-box" style="text-align: center; font-size: 12px; margin-top: 4px; padding: 0px 0 0px 0;"><span id="legendotherscripts" class="title" style="">' + _lmxE('pack.expansions') + ': </span>' +
        '</div><div id="LEGENDAds2"></div><div id="LEGENDAds3"></div>' +
        '</div></div>');
    /* the Command Centre button goes under User Scripts once the Tools tab exists (commandcentre.js
     * adds it itself when it loads after this) */
    try { if (window.LMCommandCentre && typeof window.LMCommandCentre.addMenuButton === 'function') window.LMCommandCentre.addMenuButton(); } catch (e) { }
    /* The images and titles of the minimap, leaderboard and teamboard and the screen background image
     * are appearance settings: they are in the Theme tab next to the other settings of the same part
     * (they were a "Manual background" chooser in the Tools tab). Same ids, storage and handlers.
     * The screen image is not Theme > Images > Custom background image: that one is drawn on the map
     * (it moves with the camera), this one stays still on the screen over it. */
    (function _lmManualImagesToTheme() {
        var rows = [['#theme-minimap', 'minimapPicture', 'pack.minimapImageUrl'],
            ['#theme-hud', 'leadbPicture', 'pack.leaderboardImageUrl'], ['#theme-hud', 'leadbtext', 'lmx.ex.leaderboardLogoText'],
            ['#theme-hud', 'teambPicture', 'pack.teamboardImageUrl'], ['#theme-hud', 'teambtext', 'pack.teamboardLogoText'],
            ['#theme-images', 'canvasPicture', 'pkg.d1.screenBg']];
        rows.forEach(function (r) {
            var host = $(r[0]), inp = $('#' + r[1]);
            /* no Theme tab: the field stays where it was, shown */
            if (!host.length || !inp.length) { inp.css('display', 'block'); return; }
            var row = $('<div class="input-box lm-manual-img"><span class="title-box"></span></div>');
            row.find('.title-box').attr('data-i18n', r[2]).text(_lmxT(r[2]));
            inp.css({ display: '', marginTop: '' }).appendTo(row);
            /* the screen image right under the map background image and its transparency */
            var after = r[1] === 'canvasPicture' ? $('#backgroundAlpha-slider').closest('.slider-box') : $();
            if (after.length && after.parent().is(host)) row.insertAfter(after); else row.appendTo(host);
        });
        /* the saved HUD images in their fields now: an empty field losing focus saves "" over the
         * image, and the fields were filled only by the last step of the start (never when it threw) */
        [['minimapPicture', 'minimapbckimg'], ['leadbPicture', 'leadbimg'], ['teambPicture', 'teambimg']].forEach(function (f) {
            var el = document.getElementById(f[0]), v = null;
            try { v = localStorage.getItem(f[1]); } catch (e) { }
            if (el && !el.value && v && v !== 'null') el.value = v;
        });
        /* nothing left in the Tools tab box once they moved: no empty gap there */
        var src = $('#lm-tools-imgs');
        if (src.length && !src.children().length) src.remove();
    })();
    //fix userprofile
    $("#UserProfile").css("font-size", "12px");
    //$("#UserProfilePic").click(function() {
    //useProfilePhotoCustom();
    //});

    // fix leaderboard buttons
    $("#leaderboard-menu").css("pointer-events", "auto");

    // detect paste
    /*
        $(document).bind("paste", function(e) {
            if (!searching && !($("input,textarea").is(":focus"))) {
                var pastedData = e.originalEvent.clipboardData.getData('text');
                hideMenu();
                showSearchHud();
                $("#searchInput").val(pastedData);
                $("#searchInput").select();
                //searchHandler(pastedData);
                $("#searchBtn").click();
            }
        });
*/
    changeFrameWorkStart()

    $("#searchInput").bind("paste", function (e) {
        if (!searching) {
            var pastedData = e.originalEvent.clipboardData.getData('text');
            $("#searchInput").val(pastedData);
            $("#searchInput").select();
            //searchHandler(pastedData);
            $("#searchBtn").click();
        }
    });

    //load notes
    $("#note1").val(localStorage.getItem('note1'));
    $("#note2").val(localStorage.getItem('note2'));
    $("#note3").val(localStorage.getItem('note3'));
    $("#note4").val(localStorage.getItem('note4'));
    $("#note5").val(localStorage.getItem('note5'));
    $("#note6").val(localStorage.getItem('note6'));
    $("#note7").val(localStorage.getItem('note7'));

    /* input/change also catch right-click paste, long-press paste and autofill (keyup missed them) */
    $(".note").on("input change keyup", function (event) {
        localStorage.setItem(event.target.id, $(event.target).val());
    });

    //roller and other icons
    $('#exp-bar > .icon-user').addClass('fa fa-cog fa-spin fa-3x fa-fw').removeClass('icon-user');


    // save notes

    $("#import-settings-btn").attr('class', 'btn btn-success');
    $("#searchHud").after('<div id="searchLog" class="main-color" style="font-size: 13px;float: left;font-weight: 700;border-radius: var(--lm-radius-s,4px);width: 65%;height: 270px;z-index: 15;margin: auto;top: 0px;right: 0px;left: 0px;bottom: -390px;position: fixed;pointer-events: auto;color: rgb(255, 255, 255);padding: 10px;display: none;background-color: rgba(0, 0, 0, 0.2);"><h5 id="logTitle" class="main-color text-center" style="margin-top: 0px;">' + _lmxE('lmx.ex.results') + '</h5>' +
        '<div id="log" style="font-weight: normal; overflow-x: hidden; overflow-y: auto;height: 90%;">' +
        '</div></div>');

    $("#minimap-hud").prepend('<div id="shortcuts-hud" class="hud" style="width: 70%; height: 30px; padding: 0px; pointer-events: auto; position: absolute; right: 0px; top: -30px; display: block;">' +
        '<button id="VoiceBtn" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" data-toggle="tooltip" data-original-title="' + _lmxE('pack.voiceCameraChat') + '"><i id="VoiceBtn1" class="fa fa-microphone" style="padding-left: 0px;"></i></button>' +
        '<button id="MiniScripts" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="setscriptingfunction();" data-toggle="tooltip" data-original-title="' + _lmxE('pack.miniScripts') + '"><i id="MiniScripts1" class="fa fa-linode" style="padding-left: 0px;"></i></button>' +
        '<button id="SendCommands" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="setmessagecomfunction();" data-toggle="tooltip" data-original-title="' + _lmxE('pack.messageScriptCommands') + '"><i id="SendCommands1" class="fa fa-sitemap" style="padding-left: 0px;"></i></button>' +
        '<button id="Images" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="seticonfunction();" data-toggle="tooltip" data-original-title="' + _lmxE('pack.messageImgurIcons') + '"><i id="Images1" class="fa fa-picture-o" style="padding-left: 0px;"></i></button>' +
        '<button id="yout" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="setytfunction();" data-toggle="tooltip" data-original-title="' + _lmxE('pack.messageYoutubeVideos') + '"><i id="yout1" class="fa fa-youtube" style="padding-left: 0px;"></i></button>' +
        '</div>');


    $("#minimap-hud").prepend('<div id="images-hud" class="hud" style="width: 70%; height: 30px; padding: 0px; pointer-events: auto; position: absolute; right: 0px; top: -60px; display: none;">' +
        '<button id="sendicon1" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="sendicon1();" data-toggle="tooltip" data-original-title="' + _lmxE('lmx.ex.icon1') + '"><i id="sendicon11" class="fa fa-exclamation-triangle" style="padding-left: 0px;"></i></button>' +
        '<button id="sendicon2" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="sendicon2();" data-toggle="tooltip" data-original-title="' + _lmxE('lmx.ex.icon2') + '"><i id="sendicon21" class="fa fa-question-circle" style="padding-left: 0px;"></i></button>' +
        '<button id="sendicon3" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="sendicon3();" data-toggle="tooltip" data-original-title="' + _lmxE('lmx.ex.icon3') + '"><i id="sendicon31" class="fa fa-wheelchair" style="padding-center: 0px;"></i></button>' +
        '<button id="sendicon4" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="sendicon4();" data-toggle="tooltip" data-original-title="' + _lmxE('lmx.ex.icon4') + '"><i id="sendicon41" class="fa fa-cutlery" style="padding-center: 0px;"></i></button>' +
        '<button id="sendicon5" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="sendicon5();" data-toggle="tooltip" data-original-title="' + _lmxE('lmx.ex.icon5') + '"><i id="sendicon51" class="fa fa-bed" style="padding-left: 0px;"></i></button>' +
        '<button id="sendicon6" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="sendicon6();" data-toggle="tooltip" data-original-title="' + _lmxE('lmx.ex.icon6') + '"><i id="sendicon61" class="fa fa-telegram" style="padding-left: 0px;"></i></button></div>');

    $("#minimap-hud").prepend('<div id="yt-hud" class="hud" style="width: 70%; height: 30px; padding: 0px; pointer-events: auto; position: absolute; right: 0px; top: -60px; display: none;">' +
        '<button id="sendyt1" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="sendyt1();" data-toggle="tooltip" data-original-title="Rick Astley - Never Gonna Give You Up"><i id="sendyt11" class="fa fa-music" style="padding-left: 0px;"></i></button>' + // i18n-ok: song title (proper name), the player can change it
        '<button id="sendyt2" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="sendyt2();" data-toggle="tooltip" data-original-title="Survivor - Eye Of The Tiger"><i id="sendyt21" class="fa fa-music" style="padding-left: 0px;"></i></button>' + // i18n-ok: song title (proper name), the player can change it
        '<button id="sendyt3" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="sendyt3();" data-toggle="tooltip" data-original-title="Lion king - The Lion Sleeps Tonight"><i id="sendyt31" class="fa fa-music" style="padding-center: 0px;"></i></button>' + // i18n-ok: song title (proper name), the player can change it
        '<button id="sendyt4" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="sendyt4();" data-toggle="tooltip" data-original-title="Agario - Jumbo Solo vs Teams"><i id="sendyt41" class="fa fa-video-camera" style="padding-center: 0px;"></i></button>' + // i18n-ok: video title (proper name), the player can change it
        '<button id="sendyt5" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="sendyt5();" data-toggle="tooltip" data-original-title="Agario - Kill3r vs Teams"><i id="sendyt51" class="fa fa-video-camera" style="padding-left: 0px;"></i></button>' + // i18n-ok: video title (proper name), the player can change it
        '<button id="sendyt6" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="sendyt6();" data-toggle="tooltip" data-original-title="' + _lmxE('lmx.ex.promoVideo') + '"><i id="sendyt61" class="fa fa-telegram" style="padding-left: 0px;"></i></button></div>');

    $("#minimap-hud").prepend('<div id="msgcommands-hud" class="hud" style="width: 70%; height: 30px; padding: 0px; pointer-events: auto; position: absolute; right: 0px; top: -60px; display: none;">' +
        '<button id="msgcommand1" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="msgcommand1f();" data-toggle="tooltip" data-original-title="' + _lmxE('pack.helloTeam') + '"><i id="msgcommand11" class="fa fa-coffee" style="padding-left: 0px;"></i></button>' +
        '<button id="msgcommand2" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="msgcommand2f();" data-toggle="tooltip" data-original-title="' + _lmxE('pack.laughToTeam') + '"><i id="msgcommand21" class="fa fa-smile-o" style="padding-left: 0px;"></i></button>' +
        '<button id="msgcommand3" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="msgcommand3f();" data-toggle="tooltip" data-original-title="' + _lmxE('pack.teamChangeNameTo') + '"><i id="msgcommand31" class="fa fa-magic" style="padding-center: 0px;"></i></button>' +
        '<button id="msgcommand4" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="msgcommand4f();" data-toggle="tooltip" data-original-title="' + _lmxE('pack.trollOnDeath') + '"><i id="msgcommand41" class="fa fa-bath" style="padding-center: 0px;"></i></button>' +
        '<button id="msgcommand6" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 16%; height: 100%;" onclick="msgcommand6f();" data-toggle="tooltip" data-original-title="' + _lmxE('pack.insaneModeHideEverything') + '"><i id="msgcommand" class="fa fa-exclamation-triangle" style="padding-left: 0px;"></i></button></div>');

    $("#minimap-hud").prepend('<div id="scripting-hud" class="hud" style="width: 12.5%; height: 30px; padding: 0px; pointer-events: auto; position: absolute; right: 0px; top: -60px; display: none;">' +
        '<button id="Cutnames" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 100%; height: 100%;" data-toggle="tooltip" data-original-title="' + _lmxE('pack.editNames') + '"><i id="Cutnames1" class="fa fa-scissors" style="padding-left: 0px;"></i></button>' +
        //'<button id="Ultimouse" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 50%; height: 100%;" onclick="Ultimouse();" data-toggle="tooltip" data-original-title="Ultimouse Control"><i id="Ultimouse1" class="fa fa-mouse-pointer" style="padding-left: 0px;"></i></button>'+
        '</div>');

    $("#leaderboard-hud").append('<div id="leaderboard-menu" style="pointer-events: auto;">' +
        '<a id="searchShortcut" class="btn btn-info" data-toggle="tooltip" data-placement="left" data-original-title="' + _lmxE('pack.joinServerBackspace') + '" style="width: 33.3%;text-shadow: 0.3px 0.3px #000000;font-size: small;margin-top: 0px;border-top-color: rgb(141, 201, 64);border-bottom-style: none;border-left-style: none;border: none;margin-top: 0px; background-color: transparent;color: ' + legmaincolor + ' ; " title=""><i class="fa fa-search fa-lg"></i></a>' +
        '<a id="copySIPBtn" href="javascript:void(0);" class="btn btn-sm btn-copy-leaderboard btn-info" style="background-color: transparent;color: ' + legmaincolor + ' ; width: 33.3%;text-shadow: 0.3px 0.3px #000000;font-size: small;margin-top: 0px;/* border: none; */border-left-style: none;border-right-style: none;border-bottom-style: none;border: none; user-drag: none; user-select: none; -moz-user-select: none; -webkit-user-drag: none; -webkit-user-select: none; -ms-user-select: none;" data-toggle="tooltip" data-placement="left" data-original-title="' + _lmxE('pack.copyTokenSip') + '">' + _lmxE('pack.copy') + '</a>' +
        '<a id="reconnectBtn" class="btn btn-info" title="" data-toggle="tooltip" data-placement="bottom" data-original-title="' + _lmxE('pack.changeServer') + '" style="' +
        'background-color: transparent;color: ' + legmaincolor + ' ;width: 33.3%; text-shadow: 0.3px 0.3px #000000; font-size: small; margin-top: 0px; border: none;"><i class="fa fa-refresh fa-lg"></i></a>' + // i18n-ok: CSS

        '<div id="dropDown3" class="hud" style="position: absolute; pointer-events: auto; width: 33%; height: 60px; left: 0px; padding: 0px; border-radius: 0px;">' +
        '<a id="checkServerBots" data-disabled="true" href="javascript:void(0);" class="btn btn-sm btn-copy-leaderboard btn-info" style="width: 100%;text-shadow: 0.3px 0.3px #000000;font-size: small;margin-top: 0px;border-top-color: rgb(141, 201, 64);border-bottom-style: none;border-left-style: none;border: none;margin-top: 0px; background-color: transparent;color: ' + legmaincolor + ' ;" data-toggle="tooltip" data-html="true" data-placement="left" data-original-title="<p style=&quot;margin-top:3px; margin-bottom:0px; margin-right: 2px;&quot; align=&quot;center&quot;><span class=&quot;hud-main-color&quot; style=&quot;position:absolute; left: 15px;&quot;></span>  ' + _lmxE('lmx.ex.botNames') + '</p><hr style=&quot;margin-top:5px; margin-bottom:10px; border-color:darkslategray;&quot;/><p class=&quot;&quot; style=&quot;margin-bottom:3px; font-weight:normal;&quot; align=&quot;justify&quot;>   ' + _lmxE('lmx.ex.botNamesHint') + '</p>"><i class="fa fa-exclamation fa-lg"></i></a><br>' + // i18n-ok: attribute markup only: its texts come from the packs
        '<a id="lastIPBtn" data-disabled="true" href="javascript:void(0);" class="btn btn-sm btn-copy-leaderboard btn-info" style="width: 100%;text-shadow: 0.3px 0.3px #000000;font-size: small;margin-top: 0px;border-top-color: rgb(141, 201, 64);border-bottom-style: none;border-left-style: none;border: none;margin-top: 0px; background-color: transparent;color: ' + legmaincolor + ' ;" data-toggle="tooltip" data-html="true" data-placement="left" data-original-title="<p style=&quot;margin-top:3px; margin-bottom:0px; margin-right: 2px;&quot; align=&quot;center&quot;><span class=&quot;hud-main-color&quot; style=&quot;position:absolute; left: 15px;&quot;></span>' + _lmxE('lmx.ex.joinBack') + '</p><hr style=&quot;margin-top:5px; margin-bottom:10px; border-color:darkslategray;&quot;/><p class=&quot;&quot; style=&quot;margin-bottom:3px; font-weight:normal;&quot; align=&quot;justify&quot;>' + _lmxE('lmx.ex.joinBackHint') + '</p>"><i class="fa fa-arrow-circle-down fa-lg"></i></a>' + // i18n-ok: attribute markup only: its texts come from the packs
        '</div>' +
        '<div id="dropDown2" class="hud" style="position: absolute; pointer-events: auto; width: 33%; height: 90px; left: 67px; padding: 0px; border-radius: 0px;">' +
        '<a id="copySIPandPass" href="javascript:void(0);" class="btn btn-sm btn-copy-leaderboard btn-info" style="background-color: transparent;color: ' + legmaincolor + ' ; width: 100%;text-shadow: rgb(0, 0, 0) 0.3px 0.3px;font-size: small;margin-top: 0px;display: block;border: none; user-drag: none; user-select: none; -moz-user-select: none; -webkit-user-drag: none; -webkit-user-select: none; -ms-user-select: none;" data-toggle="tooltip" data-placement="left" data-original-title="' + _lmxE('pack.copyTokenSipPassword') + '">' + _lmxE('pack.tkPw') + '</a>' +
        '<a id="copyLBBtn" href="javascript:void(0);" class="btn btn-sm btn-copy-leaderboard btn-info" style="background-color: transparent;color: ' + legmaincolor + ' ; width: 100%;text-shadow: rgb(0, 0, 0) 0.3px 0.3px;font-size: small;margin-top: 0px;display: block;border: none; user-drag: none; user-select: none; -moz-user-select: none; -webkit-user-drag: none; -webkit-user-select: none; -ms-user-select: none;" data-toggle="tooltip" data-placement="left" data-original-title="' + _lmxE('pack.copyLeaderboardL') + '">' + _lmxE('pack.board') + '</a>' +
        '<a id="copySIPPassLB" href="javascript:void(0);" class="btn btn-sm btn-copy-leaderboard btn-info" style="background-color: transparent;color: ' + legmaincolor + ' ; width: 100%;text-shadow: rgb(0, 0, 0) 0.3px 0.3px;font-size: small;margin-top: 0px;display: block;border: none; user-drag: none; user-select: none; -moz-user-select: none; -webkit-user-drag: none; -webkit-user-select: none; -ms-user-select: none;" data-toggle="tooltip" data-placement="left" data-original-title="' + _lmxE('pack.copyTokenSipPassword2') + '">' + _lmxE('pack.tkAll') + '</a>' +
        '</div>' +
        '<div id="dropDown" class="hud" style="position: absolute; pointer-events: auto; width: 33%; height: 30px; left: 67px; padding: -30px; border-radius: 0px;">' +
        '<a id="copyLBBtn" href="javascript:void(0);" class="btn btn-sm btn-copy-leaderboard btn-info" style="background-color: transparent;color: ' + legmaincolor + ' ; width: 100%;text-shadow: rgb(0, 0, 0) 0.3px 0.3px;font-size: small;margin-top: 0px;display: block;border: none; user-drag: none; user-select: none; -moz-user-select: none; -webkit-user-drag: none; -webkit-user-select: none; -ms-user-select: none;" data-toggle="tooltip" data-placement="left" data-original-title="' + _lmxE('pack.copyLeaderboardL') + '">' + _lmxE('pack.board') + '</a>' +
        '</div>' +

        '<input id="tempCopy" style="display: none;" value="">' +
        '</div>');
    // hide dropdowns initially (use !important to override agar.io's .hud CSS)
    $("#dropDown")[0].style.setProperty("display", "none", "important");
    $("#dropDown2")[0].style.setProperty("display", "none", "important");
    $("#dropDown3")[0].style.setProperty("display", "none", "important");
    // player shortcut
    if (window.legendModFromWebsite) {
        $("#leaderboard-menu").hide();
        $("#server-reconnect").hide();
        $("#gamemode").css("width", "100%");
    }

    $("#copySIPBtn").mouseenter(function () {
        $("#dropDown3")[0].style.setProperty("display", "none", "important");
        $("#copySIPBtn").text(_lmxT('pack.token'));
        if ($("#clantag").val() != "") {
            $("#dropDown2")[0].style.setProperty("display", "block", "important");
        } else {
            $("#dropDown")[0].style.setProperty("display", "block", "important");
        }
    });
    $("#leaderboard-menu").mouseleave(function () {
        $("#dropDown")[0].style.setProperty("display", "none", "important");
        $("#dropDown2")[0].style.setProperty("display", "none", "important");
        $("#dropDown3")[0].style.setProperty("display", "none", "important");
        $("#copySIPBtn").text(_lmxT('pack.copy'));
    });

    $("#logTitle").after('<a href="#" id="notesclear" style="color: lightgrey;float: right;position: absolute;right: 12px;top: 9px;" class="main-color" onclick="$(\'#log\').html(\'\');" data-toggle="" data-placement="left" data-original-title="' + _lmxE('pack.clearList') + '"><i class="fa fa-trash fa-2"></i></a>');
    $("#searchBtn").tooltip('disable');
    /* the same copy as the hotkey (one row per line) */
    $("#copyLBBtn").click(function () {
        if (window.application && typeof application.copyLb === 'function') application.copyLb(); else copy($("#leaderboard-positions").text());
    });
    $("#dropDown>#copyLBBtn").click(function () {
        if (window.application && typeof application.copyLb === 'function') application.copyLb(); else copy($("#leaderboard-positions").text());
    });
    $("#lastIPBtn").click(function () {
        lastIP = localStorage.getItem("lastIP");
        if (lastIP == "" || lastIP == null) { } else {
            $('#server-token').val(lastIP);
            $('#server-join').click();
            setTimeout(function () {
                if ($('#server-token').val() != lastIP) {
                    toastr.error(Premadeletter31).css("width", "210px");
                }
            }, 1000);
        }
    });
    $("#checkServerBots").click(function () {
        hideMenu();
        showBotNameHud();
        //$("#searchInput").focus().select();       
    });

    $("#copyIPBtn").click(function () {
        if (searchSip != null) {
            copy("https://agar.io/?r=" + region + "&m=" + realmode + "&search=wss://" + searchSip);
        } else {
            copy("https://agar.io/?r=" + $('#region').val() + "&m=" + realmode + "&search=wss://" + currentIP);
        }
    });

    $("#copySIPBtn").click(function () {
        /* private room: the room link (the token's ticket was used and cannot join) */
        if (_lmRoomCopyLink()) return;
        if (realmode == ":party") {
            CopyTkPwLb2 = "https://agar.io/?sip=" + $("#server-token").val();
            copy(CopyTkPwLb2);
        } else if (realmode != ":party") {
            if (region != null && realmode != null) {
                if (_lmOnLegendWebsite()) CopyTkPwLb2 = "https://agar.io/play?sip=" + $("#server-token").val() + "&r=" + $('#region').val() + "&m=" + realmode;
                else CopyTkPwLb2 = "https://agar.io/?sip=" + $("#server-token").val() + "&r=" + $('#region').val() + "&m=" + realmode;
                copy(CopyTkPwLb2);
            } else {
                CopyTkPwLb2 = "https://agar.io/?sip=" + $("#server-token").val();
                copy(CopyTkPwLb2);
            }
        } else {
            if (realmode == ":party") {
                CopyTkPwLb2 = "https://agar.io/?sip=" + $("#server-token").val();
                copy(CopyTkPwLb2);
            } else if (realmode != ":party") {
                if (_lmOnLegendWebsite()) CopyTkPwLb2 = "https://agar.io/play?sip=" + $("#server-token").val() + "&r=" + $('#region').val() + "&m=" + realmode;
                else CopyTkPwLb2 = "https://agar.io/?sip=" + $("#server-token").val() + "&r=" + $('#region').val() + "&m=" + realmode;
                copy(CopyTkPwLb2);
            }
        }
    });

    $("#copySIPandPass").click(function () {
        /* private room: the room link (the token's ticket was used and cannot join) */
        if (_lmRoomCopyLink()) return;
        if (searchSip != null) {
            if (realmode == ":party") {
                CopyTkPwLb2 = "https://agar.io/?sip=" + $("#server-token").val() + "&pass=" + encodeURIComponent($("#clantag").val());
                copy(CopyTkPwLb2);
            } else if (realmode != ":party") {
                if (_lmOnLegendWebsite()) CopyTkPwLb2 = "https://agar.io/play?sip=" + $("#server-token").val() + "&pass=" + encodeURIComponent($("#clantag").val()) + "&r=" + $('#region').val() + "&m=" + realmode;
                else CopyTkPwLb2 = "https://agar.io/?sip=" + $("#server-token").val() + "&pass=" + encodeURIComponent($("#clantag").val()) + "&r=" + $('#region').val() + "&m=" + realmode;
                copy(CopyTkPwLb2);

            }
        } else {
            if (realmode == ":party") {
                CopyTkPwLb2 = "https://agar.io/?sip=" + $("#server-token").val() + "&pass=" + encodeURIComponent($("#clantag").val());
                copy(CopyTkPwLb2);
            } else if (realmode != ":party") {
                if (_lmOnLegendWebsite()) CopyTkPwLb2 = "https://agar.io/play?sip=" + $("#server-token").val() + "&pass=" + encodeURIComponent($("#clantag").val()) + "&r=" + $('#region').val() + "&m=" + realmode;
                else CopyTkPwLb2 = "https://agar.io/?sip=" + $("#server-token").val() + "&pass=" + encodeURIComponent($("#clantag").val()) + "&r=" + $('#region').val() + "&m=" + realmode;
                copy(CopyTkPwLb2);
            }
        }
    });

    $("#copySIPPassLB").click(function () {
        var _lmRoomL = _lmRoomShareFor();
        if (_lmRoomL) { CopyTkPwLb2 = _lmRoomL; copyToClipboardAll(); return; }
        if (searchSip != null) {
            if (realmode == ":party") {
                CopyTkPwLb2 = "https://agar.io/?sip=" + $("#server-token").val() + "&pass=" + encodeURIComponent($("#clantag").val());
                copyToClipboardAll();
            } else if (realmode != ":party") {
                if (_lmOnLegendWebsite()) CopyTkPwLb2 = "https://agar.io/play?sip=" + $("#server-token").val() + "&pass=" + encodeURIComponent($("#clantag").val()) + "&r=" + $('#region').val() + "&m=" + realmode;
                else CopyTkPwLb2 = "https://agar.io/?sip=" + $("#server-token").val() + "&pass=" + encodeURIComponent($("#clantag").val()) + "&r=" + $('#region').val() + "&m=" + realmode;
                copyToClipboardAll(); /* TK&ALL: include leaderboard, teamboard and nick like the other branches */
            }
        } else {
            if (realmode == ":party") {
                CopyTkPwLb2 = "https://agar.io/?sip=" + $("#server-token").val() + "&pass=" + encodeURIComponent($("#clantag").val());
                copyToClipboardAll();
            } else if (realmode != ":party") {
                if (_lmOnLegendWebsite()) CopyTkPwLb2 = "https://agar.io/play?sip=" + $("#server-token").val() + "&pass=" + encodeURIComponent($("#clantag").val()) + "&r=" + $('#region').val() + "&m=" + realmode;
                else CopyTkPwLb2 = "https://agar.io/?sip=" + $("#server-token").val() + "&pass=" + encodeURIComponent($("#clantag").val()) + "&r=" + $('#region').val() + "&m=" + realmode;
                copyToClipboardAll();
            }
        }
    });

    //fix message-box focus
    $('#message').click(function () {
        $("#message").focus();
    });

    $("#reconnectBtn").click(function () {
        $("#server-reconnect").click();
    });
    $("#reconnectBtn").mouseenter(function () {
        $("#dropDown")[0].style.setProperty("display", "none", "important");
        $("#dropDown2")[0].style.setProperty("display", "none", "important");
        $("#copySIPBtn").text(_lmxT('pack.copy'));
    });

    $("#searchBtn").click(function () {
        if (!searching) {
            var _lmQ = String($("#searchInput").val() || "").trim();
            var _lmQl = _lmQ.toLowerCase();
            /* Links, tokens and IPs go straight to searchHandler. */
            var _lmIsLink = _lmQl.indexOf("agar.io/#") >= 0 || _lmQl.indexOf("ws://") === 0 || _lmQl.indexOf("wss://") === 0 ||
                _lmQl.indexOf("sip=") >= 0 || _lmQl.indexOf("search=") >= 0 || /^[0-9.]+:[0-9]+$/.test(_lmQl);
            if (_lmQ && _lmIsLink) {
                searchHandler(_lmQ);
                return;
            }
            var client = getSNEZServers();
            /* The name lookup server (lm-ws) down: the button did nothing and said nothing.
             * If it never opens, say so and search the text directly. */
            var _lmOpened = false, _lmFellBack = false;
            var _lmFallback = function () {
                if (_lmOpened || _lmFellBack) return;
                _lmFellBack = true;
                if (window.toastr) toastr.warning(_lmxT('lmx.ex.searchServerDown'));
                if (_lmQ) searchHandler(_lmQ);
            };
            client.onOpenCallback = function () { _lmOpened = true; };
            client.onCloseCallback = _lmFallback;
            setTimeout(_lmFallback, 8000);
            client.connect();
        } else {
            $("#searchSpan>i").removeClass("fa fa-times").addClass("fa fa-search");
            clearInterval(timerId);
            searching = false;
            //        hideCancelSearch();
            toastr.error(Premadeletter32 + "!").css("width", "210px");
        }
        //var searchString = $("#searchInput").val();
        //searchHandler(searchString);
    });
    $("#searchInput").keyup(function (event) {
        if (event.keyCode == 13) {
            $("#searchBtn").click();
        }
    });

    $("#closeBtn").click(function () {
        /* closing the window did not stop the search: it kept switching servers */
        if (searching) {
            clearInterval(timerId);
            searching = false;
            $("#searchSpan>i").removeClass("fa fa-times").addClass("fa fa-search");
        }
        hideSearchHud();
        showMenu2();
    });

    $("#searchShortcut").mouseenter(function () {
        $("#dropDown").hide();
        $("#dropDown3").show(100);
        $("#copySIPBtn").text(_lmxT('pack.copy'));
    });

    $("#searchHud").css("pointer-events", "auto");
    //$("#searchHud").css("pointer-events", "auto");

    $("#searchShortcut").click(function () {
        hideMenu();
        $("#regioncheck").val($("#region").val());
        $("#gamemodecheck").val($("#gamemode").val());
        showSearchHud();
        $("#searchInput").focus().select();
    });

    /*$('#nick').mouseenter(function() {
        $('#nick').css('background-color', '#000066');
        return clickedname = "YES"
    }).mouseleave(function() {
        $('#nick').css('background-color', '');
    });*/
    $('#nick').blur(function () {
        previousnickname = $("#nick").val();
        localStorage.setItem("previousnickname", previousnickname);
        //Animated Skins
        var animatedkey;
        for (animatedkey in animatedskins) {
            if (animatedkey == $("#nick").val()) {
                toastr.info(_lmxT('lmx.ex.nickReserved', ["<font color='yellow'><b>", "</b></font>"]));
            }
        }
        //
        if (clickedname == "YES") {
            if (fancyCount2($("#nick").val()) >= 16) {
                //if ($("#nick").val().length >= 16) {
                //toastr.warning("<b>[SERVER]:</b> " + Premadeletter2 + ':<br>' + $('#nick').val());
                toastr.warning("<b>[" + Premadeletter123 + "]:</b> " + Premadeletter2 + ':<br>' + _lmEscHtml($('#nick').val())); /* the nick is the player's own text: escaped */
            }
        }
        if ($("#nick").val() == "EasterEgg1") {
            toastr.info(Premadeletter3).css("width", "210px");
            $("#nick").val("Easter Egg");
            $(".btn.btn-play-guest.btn-success.btn-needs-server").click();
            openbleedmod();
        } else if ($("#nick").val() == "EasterEgg2") {
            toastr.info(Premadeletter4).css("width", "210px");
            $("#nick").val("Easter Egg");
            $(".btn.btn-play-guest.btn-success.btn-needs-server").click();
            openrotatingmod();
        } else if ($("#nick").val() == "EasterEgg3") {
            toastr.info(Premadeletter5 + ',<br>' + Premadeletter6 + '<a target="_blank" href="https://github.com/jimboy3100">https://github.com/jimboy3100</a>');
            $("#nick").val("Video");
            if (typeof openvidmod == "function") openvidmod();
        }
    });
    $("#nick").on("input", function () {
        if (fancyCount2($("#nick").val()) > 15) {
            while (fancyCount2($("#nick").val()) > 15) {
                $("#nick").val($("#nick").val().slice(0, -1))
            }
        }
    });
    $(document).keyup(function (event) {
        if (event.which == 8) { // search
            /* not while editing any text field (textarea, select, contenteditable too) */
            if (!$(document.activeElement).is('input, textarea, select, [contenteditable], [contenteditable] *')) {
                $("#searchShortcut").click();
            }

        }
        /* else if (event.which == 187 && !($("input").is(":focus")) && ogario.play == false) { // refresh server
                        $("#reconnectBtn").click();

                    } 
                    else if (event.which == 27) { // ESCAPE

                        if ($('#searchHud').is(':visible')) {
                            hideSearchHud();
                        } else {
         //                   showMenu();
                        }
                    }
        */
    });


    $("#Cutnames").click(function () {
        CutNameConflictwithMessageFunction();
        if (checkedGameNames == 0) {
            StartEditGameNames();
            return checkedGameNames = 2;
        } else if (checkedGameNames == 1) {
            ContinueEditGameNames();
            return checkedGameNames = 2;
        } else if (checkedGameNames == 2) {
            StopEditGameNames();
            return checkedGameNames = 1;
        }

    });
    $("#VoiceBtn").click(function () {
        var currentIP2 = $("#server-token").val();
        var pass2 = $("#clantag").val();
        if (pass2 != "") {
            semiurl2 = currentIP2 + "pass=" + pass2;
        } else {
            semiurl2 = currentIP2;
        }
        url2 = "https://talky.io/" + semiurl2;

        setTimeout(function () {
            $("#VoiceBtn").focusout();
        }, 100);
        var win = window.open(url2, '_blank');
    });

    $('#clantag').css("width", "95.5px");
    $('#nick').css("width", "171px");
    /*$('#clantag').mouseenter(function() {
        $('#clantag').css('background-color', '#000066');
    }).mouseleave(function() {
        $('#clantag').css('background-color', '');
    });*/
    //	$('#region').unbind('mouseenter');
    //	$('#gamemode').unbind('mouseenter');
    /*$('#region').mouseenter(function() {
        $('#region').css('background-color', '#003300');
    }).mouseleave(function() {
        $('#region').css('background-color', '');
    });
    $('#gamemode').mouseenter(function() {
        $('#gamemode').css('background-color', '#003300');
    }).mouseleave(function() {
        $('#gamemode').css('background-color', '');
    });*/

    $(".btn.btn-block.btn-success.btn-export").click(function () {
        setTimeout(function () {
            if (LegendSettingsfirstclicked == "false") {
                LegendSettingsfirst();
                return LegendSettingsfirstclicked = "true";
            } else {
                $("#export-settings-btn").click();
                return false;
            }
        }, 100);
    });


    $('*[data-itr="page_play"]').click(function () {
        /* a private room token is a used single-use ticket: not kept as the last IP */
        if (String($('#server-token').val() || '').indexOf('/el-room/') === -1) localStorage.setItem("lastIP", $('#server-token').val());
        return lastIP = $('#server-token').val();
    });

    $("#HideAllBthn").tooltip({
        title: function () { return _lmxT('lmx.ex.hideAllTip'); },
        placement: "bottom"
    });

    $("#SHOSHOBtn").click(function () {
        var wasPressed = $(this).attr('aria-pressed') === 'true';
        var checked = !wasPressed;
        $(this).attr('aria-pressed', String(checked));
        $(this).toggleClass('active', checked);
        if (checked) {
            localStorage.setItem("SHOSHOBtn", true);
            $("#shortcuts-hud").show();
            //$("#rotate-hud").show();
            $(this).html('<i class="fa fa-puzzle-piece"></i>' + Premadeletter43);
        } else {
            localStorage.setItem("SHOSHOBtn", false);
            $("#shortcuts-hud").hide();
            //$("#rotate-hud").hide();
            $("#images-hud").hide();
            $("#scripting-hud").hide();
            $("#msgcommands-hud").hide();
            $("#yt-hud").hide();
            $("#images-hud").hide();
            $(this).html('<i class="fa fa-puzzle-piece"></i>' + Premadeletter42);
            return seticon = "YES";
        }
    });
    $("#HideAllBthn").click(function () {
        var wasPressed = $(this).attr('aria-pressed') === 'true';
        var checked = !wasPressed;
        $(this).attr('aria-pressed', String(checked));
        $(this).toggleClass('active', checked);
        /* un-hiding showed every HUD, also the ones turned off in the settings (minimap, top 5,
         * targeting, stats), and never the clock: remember what was shown */
        var _lmHudSel = "#shortcuts-hud,#exp-bar,#time-hud,#leaderboard-hud,#minimap-hud,#stats-hud,#top5-hud,#target-hud,#target-panel-hud";
        if (checked) {
            window._lmHiddenHuds = $(_lmHudSel).filter(function () { return $(this).css("display") !== "none"; });
            $("#shortcuts-hud").hide();

            $("#exp-bar").hide();
            $("#time-hud").hide();
            $("#leaderboard-hud").hide();
            $("#minimap-hud").hide();
            $("#stats-hud").hide();
            $("#top5-hud").hide();
            $("#target-hud").hide();
            $("#target-panel-hud").hide();
            $(this).html('<i class="fa fa-exclamation-triangle"></i>' + Premadeletter48);
        } else if (window._lmHiddenHuds) {
            window._lmHiddenHuds.show();
            window._lmHiddenHuds = null;
            $(this).html('<i class="fa fa-exclamation-triangle"></i>' + Premadeletter49);
        } else {
            $("#shortcuts-hud").show();
            $("#exp-bar").show();
            $("#leaderboard-hud").show();
            $("#minimap-hud").show();
            $("#stats-hud").show();
            $("#top5-hud").show();
            $("#target-panel-hud").show();
            $("#target-hud").show();
            $(this).html('<i class="fa fa-exclamation-triangle"></i>' + Premadeletter49);
        }
    });
    $("#OpenuserScripts").click(function () {

        $("#main-menu").hide();
        $("#skins-panel").hide();
        $("#quick-menu").hide();
        $("#exp-bar").hide();
        $("#userscripts").show();

    });


    /*		$("#LMImplements").click(function() {
                if (modVersion == "1.3" ) {
                var myWindow = window.open("https://agar.io/LMImplements", "_blank", "width=400,height=800");
                }
                else{
                toastr.info('Mod <font color="yellow"><b>v' + modVersion + '</b></font>  ' + Premadeletter16 + ' <font color="yellow"><b>v1.3</b></font>, in order to use this function</font>');	
                }
            });		
    */


    /* positioning parent for "More FPS", centred on the footer whatever the version label's width */
    $("#menu-footer").text("").css("position", "relative");
    //$("#agario-main-buttons").after('<div id="LEGENDAds4"></div>'); //
    //$("#LEGENDAds4").load("https://www.legendmod.ml/banners/bannerLMdevs"); //
    $("#menu-footer").prepend('<span style="float: left; font-size: 13px;"><a target="_blank" href="https://jimboy3100.github.io" style="color: #ffffff;" data-toggle="tooltip" data-title="' + _lmxE('lmx.ex.website') + '" data-placement="left">v' + modVersion +
        '</a></span><span class="lm-footer-fps" style="position: absolute; left: 50%; top: 5px; transform: translateX(-50%); white-space: nowrap; font-size: 13px;"><a id="MorefpsText" href="https://www.legendmod.ml/?nav=FPS" data-toggle="tooltip" data-title="' + _lmxE('lmx.ex.improvePerformance') + '" data-placement="top" style ="font-size: 13px"; target="_blank">' + _lmxE('pack.moreFps') + '</a></span>' +
        '<a style="float: right;  margin-top: -2px" target="_blank" href="https://www.buymeacoffee.com/legendmod">☕︎</a>');
    /* Build number next to the release label (bug reports can name it), plus a one-time
     * "What's new" toast when the build changes for someone who played before. */
    if (window.OgVer && !$('#menu-footer .lm-ogver').length) {
        $('#menu-footer a[href="https://jimboy3100.github.io"]').first()
            .append('<small class="lm-ogver"> · ' + (typeof window.OgVer === 'number' ? window.OgVer.toFixed(3) : String(window.OgVer)) + '</small>');
        try {
            var _lmSeenVer = localStorage.getItem('lmLastSeenOgVer');
            if (_lmSeenVer && _lmSeenVer !== String(window.OgVer) && window.toastr) {
                toastr.info('<b>' + _lmxE('lmx.ex.updatedTitle', [String(window.OgVer)]) + '</b><br>' +
                    _lmxT('lmx.ex.updatedNews'), '', { timeOut: 14000, extendedTimeOut: 4000 });
            }
            localStorage.setItem('lmLastSeenOgVer', String(window.OgVer));
        } catch (e) { }
    }
    $("#shortcuts-hud").hide();
    $("#exp-bar").hide();
    /* the clock stays when Settings > Stats > Show current time is on (it was hidden on every load,
     * so a clock switched on never came back after a reload) */
    if (!(window.legendmod5 && window.legendmod5.showTime)) $("#time-hud").hide();

    $("#TimesUsed").text(timesopened);
    LMserverbox();

    bluebtns();
    //SNEZ Upload / Download Settings
    SNEZServers();
    $("#import-settings-btn").attr('class', 'btn btn-success');
    $("#close-exp-imp").before('<button id="SNEZOgarUploadBtn" onclick="SNEZOgarUpload(); return false" style="margin-right: 25px;" class="btn btn-success" data-original-title="" title="">' + Premadeletter109 + '</button>');
    $("#close-exp-imp").before('<button id="SNEZOgarDownloadBtn" onclick="SNEZOgarDownload(event); return false" style="margin-right: 25px;" class="btn btn-success" data-original-title="" title="">' + Premadeletter109a + '</button>');
    if (_lmOnLegendWebsite()) {
        $("#close-exp-imp").after('<br><div id="UserProfileUID2">' + _lmxE('pack.socialId') + ': <input id="UserProfileID2a" class="user-name" style="display:inline-block"></div>');
        if (localStorage.getItem("userid") != "" && localStorage.getItem("userid") != null && localStorage.getItem("userid") != "null") {
            userid = localStorage.getItem("userid");
            $("#UserProfileID2a").val(window.userid)
        }
        $("#UserProfileID2a").blur(function () {
            IdfromLegendmod()
        });
    }
    /*
     * Preserve the real game-core disconnect implementation.
     * LMexpress may add side effects, but it must not replace connection control.
     */
    if (
        window.core &&
        typeof window.core.disconnect ===
        "function" &&
        !window.core.disconnect
            ._lmExpressWrapped
    ) {
        var originalCoreDisconnect =
            window.core.disconnect;

        var wrappedCoreDisconnect =
            function () {
                adres(
                    null,
                    $("#gamemode").val(),
                    $("#region").val()
                );

                pauseVideos();

                return originalCoreDisconnect
                    .apply(
                        this,
                        arguments
                    );
            };

        wrappedCoreDisconnect
            ._lmExpressWrapped = true;

        window.core.disconnect =
            wrappedCoreDisconnect;
    }
    $('#server-reconnect').click(function () {
        setTimeout(function () {
            adres(null, $('#gamemode').val(), $('#region').val());
        }, 100);
    });

    $("#gamemode")
        .off("change.lmAddress")
        .on(
            "change.lmAddress",
            function () {
                setTimeout(
                    function () {
                        adres(
                            null,
                            $("#gamemode")
                                .val(),
                            $("#region")
                                .val()
                        );
                    },
                    50
                );
            }
        );

    $("#region")
        .off("change.lmAddress")
        .on(
            "change.lmAddress",
            function () {
                setTimeout(
                    function () {
                        adres(
                            null,
                            $("#gamemode")
                                .val(),
                            $("#region")
                                .val()
                        );
                    },
                    50
                );
            }
        );

    $('#server-join').click(function () {
        adres(null, null, null);
    });

    $('#server-connect').click(function () {
        adres(null, null, null);
    });
    triggerLMbtns();
    languagemodfun();
    $('[data-toggle="tooltip"]').tooltip();

    /* Chat embed shortcodes: [yut], [url], [tag], [discord], etc.
     * OLD: DOMNodeInserted / DOMSubtreeModified (deprecated, removed from modern browsers).
     * NEW: MutationObserver — standard API, works in all browsers. */
    /*
     * Process each new chat message ELEMENT once (a teammate may send the same
     * command twice in a row; MsgCommands1's own warning toasts also change the
     * toast container). Elements come from the MutationRecords, so a chat-box
     * message is not mistaken for a stale success toast and several messages
     * arriving together are all handled.
     */
    var _chatPending = [];
    var _chatFlushTimer = null;
    function _queueChatEl(el) {
        if (el && _chatPending.indexOf(el) === -1) _chatPending.push(el);
    }
    function _flushChatEmbeds() {
        _chatFlushTimer = null;
        var list = _chatPending;
        _chatPending = [];
        for (var i = 0; i < list.length; i++) {
            var $el = $(list[i]);
            if (!$el.closest(document.documentElement).length) continue; /* already removed */
            var isToast = $el.is('.toast');
            var _msgEl = isToast ? $el : $el.find('.message-text').first();
            if (!_msgEl.length || _msgEl.attr('data-lm-done')) continue;
            MSGCOMMANDS = _msgEl.text();
            MSGNICK = $el.find('.message-nick').first().text().replace(": ", "");
            if (!MSGCOMMANDS) continue;
            _msgEl.attr('data-lm-done', '1');
            /* one malformed command must not drop the rest of the queued messages */
            try { MsgCommands1(MSGCOMMANDS, MSGNICK, _msgEl); } catch (e) { console.warn('[LM] chat command failed:', e); }
        }
    }
    /* collect the .toast-success / .message elements touched by these mutations;
     * the 50 ms delay lets toastr/ogario finish filling the element */
    function _processChatEmbeds(mutations, selector) {
        for (var i = 0; i < mutations.length; i++) {
            var m = mutations[i];
            /* the changed node's own message (text filled in later), not every message below it */
            var t = m.target && m.target.nodeType === 3 ? m.target.parentNode : m.target;
            if (t && t.nodeType === 1) _queueChatEl(t.closest(selector));
            for (var j = 0; j < m.addedNodes.length; j++) {
                var n = m.addedNodes[j];
                if (n && n.nodeType === 3) n = n.parentNode;
                if (!n || n.nodeType !== 1) continue;
                _queueChatEl(n.closest(selector));
                var inner = n.querySelectorAll(selector);
                for (var q = 0; q < inner.length; q++) _queueChatEl(inner[q]);
            }
        }
        if (_chatPending.length && !_chatFlushTimer) _chatFlushTimer = setTimeout(_flushChatEmbeds, 50);
    }

    /* Observe toast notifications (toastr success messages) */
    var _chatToastObs = new MutationObserver(function (mutations) {
        _processChatEmbeds(mutations, '.toast.toast-success');
    });
    /* toastr removes #toast-container when its last toast closes and creates a new
     * one for the next toast: keep watching <body> and attach to every new container
     * (the observer used to stay on the first, deleted one). */
    var _observedToastEl = null;
    var _attachToastObs = function () {
        var el = document.getElementById('toast-container');
        if (el && el !== _observedToastEl) {
            _observedToastEl = el;
            _chatToastObs.observe(el, { childList: true, subtree: true });
            /* toasts already inside the new container */
            _processChatEmbeds([{ target: el, addedNodes: el.children }], '.toast.toast-success');
        }
    };
    _attachToastObs();
    new MutationObserver(_attachToastObs).observe(document.body, { childList: true, subtree: false });

    /* Observe chat box content changes */
    var _chatBoxEl = document.getElementById('chat-box');
    if (_chatBoxEl) {
        new MutationObserver(function (mutations) { _processChatEmbeds(mutations, '.message'); }).observe(_chatBoxEl, { childList: true, subtree: true, characterData: true });
    }
}


/* the share link of the private room the player is in, or '' */
function _lmRoomShareFor() {
    var m = /\/el-room\/([A-HJ-NP-Z2-9]{6})(?:[?&#]|$)/.exec(String(window.legendmod && window.legendmod.ws || ""));
    return m && typeof window._lmRoomShareLink === "function" ? window._lmRoomShareLink(m[1]) : "";
}
function _lmRoomCopyLink() {
    var l = _lmRoomShareFor();
    if (l) copy(l);
    return !!l;
}

function joinSIPonstart() {
    if (searchSip != null) {
        /* an older room share (?sip=...el-room/CODE?t=...): the room window gets a new ticket */
        var _lmRoomSip = /\/el-room\/([A-HJ-NP-Z2-9]{6})(?:[?&#]|$)/.exec(String(getParameterByName("sip", url) || ""));
        if (_lmRoomSip) {
            setTimeout(function () {
                if (typeof window._lmRoomOpen === "function") window._lmRoomOpen("join", _lmRoomSip[1]);
            }, 1500);
            return;
        }
        var sipTarget = getParameterByName("sip", url).replace("live-arena-", "").replace(".agar.io", "");

        if (realmodePS != null && region != null) {
            if (region == "Private") {
                $('#gamemode').val(realmodePS);
                $('#region').val(region);
                deleteGamemode();
            }
        }

        /* If token already matches, we're done */
        if (sipTarget == $("#server-token").val()) return;

        /* Try to join immediately */
        joinSIPonstart1();

        /* Listen for server-token to be set — retry up to 2 times */
        var _sipRetries = 0;
        var _sipHandler = function () {
            if (sipTarget == $("#server-token").val()) return; /* matched */
            _sipRetries++;
            if (_sipRetries >= 2) {
                toastr.error(_lmxT('lmx.ex.serverNotFound'));
                return;
            }
            /* Retry join */
            joinSIPonstart1();
            /* Re-listen for next token update */
            $(document).one('lm:serverTokenReady', _sipHandler);
        };
        /* Check if token is already set before waiting for event */
        var existingToken = $('#server-token').val();
        if (existingToken) {
            _sipHandler();
        } else {
            $(document).one('lm:serverTokenReady', _sipHandler);
        }

        /* Safety timeout — stop listening after 5s */
        setTimeout(function () {
            $(document).off('lm:serverTokenReady', _sipHandler);
        }, 5000);

    } else if (url.includes('https://agar.io/#') == true) {
        $('#gamemode').val(":party");
        realmodereturnfromStart();
        /* the party token is the part after "#" in the launch link */
        joinpartyfromconnect(String(url.split('https://agar.io/#')[1] || '').split(/[?&]/)[0]);
    }
}

/* joinSIPonstart2/3 merged into joinSIPonstart above */

function joinSIPonstart1() {
    realmodereturnfromStart();
    var sipValue = getParameterByName("sip", url);
    if (sipValue) {
        $("#server-token").val(sipValue.replace("live-arena-", "").replace(".agar.io", ""));
    } else {
        $("#server-token").val("");
    }
    if (region != null && realmode != null) {
        currentIPopened = true;
        legendmod.gameMode = realmode;
    }
    $("#server-join").click();
}

function joinPLAYERonstart() {
    if (searchedplayer != null) {
        $("#searchInput").val(searchedplayer);
        var client = getSNEZServers("NoText");

        client.onDataReady = function (
            count,
            results
        ) {
            if (
                !results ||
                results.length === 0
            ) {
                return;
            }

            var record = results[0];

            toastr.info(
                _lmxT('lmx.ex.playerFoundConnected', [
                    "<font color='yellow'>" + escapeHtml(record.nickname) + "</font>",
                    "<font color='yellow'>" + escapeHtml(searchedplayer) + "</font>"
                ])
            );

            connectto(record.token);

            if (record.region) {
                connectto2(
                    record.region
                );
            }

            if (record.mode) {
                connectto3(
                    record.mode
                );
            }
        };

        client.connect();
    }
    if (autoplayplayer == "yes") {
        autoplayplaying();
        window.autoPlay = true;
    }
}
/* ?room=CODE (private room share link): open the room window on Join with the code filled in.
 * Read from this page's own address only (the stored launch link may be an older visit's). */
function joinROOMonstart() {
    var code = String(getParameterByName("room", location.href) || "").toUpperCase().replace(/\s+/g, "");
    if (!/^[A-HJ-NP-Z2-9]{6}$/.test(code)) return;
    setTimeout(function () {
        if (typeof window._lmRoomOpen === "function") window._lmRoomOpen("join", code);
    }, 1500);
}
/* ?replay=<.lm URL>&replayStart=<packet>&replayEnd=<packet>: Replay Studio downloads and plays it */
function joinreplayURLonstart() {
    setTimeout(function () {
        if (replayURL && typeof window.lmReplayStudio === 'function') window.lmReplayStudio('url', [replayURL, replayStart, replayEnd]);
    }, 3000);
}

function autoplayplaying() {
    $("#nick").val("LM Autoplay");

    window.legendmod5.customSkins = false;
    window.legendmod5.videoSkins = false;
    window.legendmod5.jellyPhisycs = false;
    window.legendmod5.rainbowFood = false;
    window.legendmod5.virusGlow = false;
    window.legendmod5.borderGlow = false;
    window.legendmod5.showBgSectors = false;
    window.legendmod5.showMapBorders = false;
    window.legendmod5.showMiniMapGhostCells = false;
    window.legendmod5.showExtraMiniMapGuides = false;
    window.legendmod5.oppColors = false;
    window.legendmod5.oppRings = false;
    window.legendmod5.virColors = false;
    window.legendmod5.splitRange = false;
    window.legendmod5.virusesRange = false;
    window.legendmod5.teammatesInd = false;
    window.legendmod5.showGhostCells = false;
    defaultmapsettings.top5skins = false;
    window.legendmod5.showChatImages = false;
    window.legendmod5.showChatVideos = false;
    window.legendmod5.chatSounds = false;
    window.legendmod5.spawnspecialeffects = false;

    window.legendmod5.autoResp = true;
    $(".btn.btn-play-guest.btn-success.btn-needs-server").click();
}

function _lmSelectHasValue(sel, value) {
    value = String(value);
    return $(sel + " option").filter(function () {
        return this.value === value;
    }).length > 0;
}

function joinSERVERfindinfo() {
    $("#log").html("");
    var searchedtoken =
        $("#server-token").val();

    /* .val() returns "" (never null) when empty; "" matched every player in the search. */
    if (searchedtoken && String(searchedtoken).trim().length >= 4) {
        $("#searchInput").val(
            searchedtoken
        );

        var client =
            getSNEZServers("NoText");

        client.onDataReady = function (
            count,
            results
        ) {
            if (
                !results ||
                results.length === 0
            ) {
                return;
            }

            var regionCounts = {};
            var modeCounts = {};
            var nicknameToIgnore =
                $("#nick").val() || "";

            for (
                var i = 0;
                i < results.length;
                i++
            ) {
                var record = results[i];

                if (
                    record.nickname ===
                    nicknameToIgnore
                ) {
                    continue;
                }

                /* relay records are crowd-sourced: count only values that exist in the selects */
                if (
                    record.region &&
                    record.region !== "null" &&
                    _lmSelectHasValue("#region", record.region)
                ) {
                    regionCounts[
                        record.region
                    ] =
                        (regionCounts[
                            record.region
                        ] || 0) + 1;
                }

                if (
                    record.mode &&
                    record.mode !== "null" &&
                    _lmSelectHasValue("#gamemode", record.mode)
                ) {
                    modeCounts[
                        record.mode
                    ] =
                        (modeCounts[
                            record.mode
                        ] || 0) + 1;
                }
            }

            var maxRegion = null;
            var maxRegionCount = 0;

            for (var r in regionCounts) {
                if (
                    regionCounts[r] >
                    maxRegionCount
                ) {
                    maxRegionCount =
                        regionCounts[r];
                    maxRegion = r;
                }
            }

            var maxMode = null;
            var maxModeCount = 0;

            for (var m in modeCounts) {
                if (
                    modeCounts[m] >
                    maxModeCount
                ) {
                    maxModeCount =
                        modeCounts[m];
                    maxMode = m;
                }
            }

            if (!maxRegion || !maxMode) {
                return;
            }

            realmode = maxMode;
            region = maxRegion;

            if (
                document.URL.includes(
                    "jimboy3100.github.io"
                )
            ) {
                history.pushState(
                    stateObj,
                    "page 2",
                    "/play?sip=" + currentIP
                );
            } else if (
                legendmod.integrity
            ) {
                history.pushState(
                    stateObj,
                    "page 2",
                    "?sip=" +
                    currentIP +
                    "&r=" +
                    maxRegion +
                    "&m=" +
                    maxMode
                );
            } else {
                history.pushState(
                    stateObj,
                    "page 2",
                    "?sip=" + currentIP
                );
            }

            ModeRegionregion();

            if (
                $("#region").val() !==
                maxRegion ||
                $("#gamemode").val() !==
                maxMode
            ) {
                var finalText =
                    "<font color='yellow'>" +
                    _lmxE('lmx.ex.bestChoice', [escapeHtml(maxRegion), escapeHtml(maxMode)]) +
                    "</font><br>" + _lmxE('lmx.ex.infoChanged');

                toastr
                    .info(finalText)
                    .css(
                        "width",
                        "350px"
                    );

                $("#region").val(
                    maxRegion
                );
                master.region =
                    maxRegion;

                $("#gamemode").val(
                    maxMode
                );
                master.gameMode =
                    maxMode;
                legendmod.gameMode =
                    maxMode;
            }
        };

        client.connect();
    }
}






function ModeRegionregion() {
    realmode = $("#gamemode").val();
    region = $("#region").val();
    return realmode, region;
}



function BeforeSpecialDeals(tab) {
    if (window._lmRoomShopOff && window._lmRoomShopOff()) return false;
    if (typeof window.checkUserUID === 'function' && !window.checkUserUID()) {
        if (window.toastr) {
            toastr.error(_lmxT('lmx.ex.shopNeedLogin'));
        }
        return false;
    }
    var targetTab = tab || 'skins';

    var appUser =
        (
            window.application &&
            window.application.user
        ) ||
        (
            window.legendmod &&
            window.legendmod.user
        ) ||
        {};

    var isLoggedIn;

    if (
        typeof window.checkUserLoggedIn ===
        'function'
    ) {
        isLoggedIn =
            window.checkUserLoggedIn();
    } else {
        var fallbackUserId =
            appUser.userId !== undefined &&
                appUser.userId !== null
                ? String(
                    appUser.userId
                ).trim()
                : '';

        var normalizedFallbackUserId =
            fallbackUserId.toLowerCase();

        isLoggedIn =
            !!(
                window.loggedIn === true ||
                appUser.authenticated === true ||
                (
                    fallbackUserId &&
                    fallbackUserId !== '0' &&
                    normalizedFallbackUserId !==
                    'null' &&
                    normalizedFallbackUserId !==
                    'undefined'
                )
            );
    }

    var hasUID;

    if (
        typeof window.checkUserUID ===
        'function'
    ) {
        hasUID =
            window.checkUserUID();
    } else {
        var fallbackUID =
            typeof window.agarioUID ===
                'string'
                ? window.agarioUID.trim()
                : '';

        var normalizedFallbackUID =
            fallbackUID.toLowerCase();

        hasUID =
            !!(
                isLoggedIn &&
                fallbackUID &&
                fallbackUID.length >= 8 &&
                fallbackUID.indexOf('$') ===
                -1 &&
                fallbackUID !== '0' &&
                normalizedFallbackUID !==
                'null' &&
                normalizedFallbackUID !==
                'undefined'
            );
    }

    if (!isLoggedIn || !hasUID) {
        if (window.toastr) {
            toastr.error(
                _lmxT('lmx.ex.shopNeedLogin')
            );
        }

        return false;
    }

    if ($('#specialShopModal').length) {
        /*
         * Reuse the existing shop. SpecialDeals() has a fast reopen path
         * that shows the retained modal and switches tabs without rebuilding
         * its complete DOM or image grid.
         */
        if (
            typeof window.SpecialDeals ===
            'function'
        ) {
            window.SpecialDeals(
                targetTab
            );
        } else {
            $('#specialShopModal')
                .show()
                .addClass('in')
                .attr(
                    'aria-hidden',
                    'false'
                );

            $('body').addClass(
                'modal-open'
            );

            $(
                '.shop-tab[data-tab="' +
                targetTab +
                '"]'
            ).trigger('click');

            if (
                typeof window.updateShopLoginState ===
                'function'
            ) {
                window.updateShopLoginState();
            }
        }

        return;
    }

    window._pendingShopTab = targetTab;

    if (window._specialDealsScriptLoading) {
        return;
    }

    var existingScript =
        document.getElementById(
            'lm-special-deals-script'
        );

    if (existingScript) {
        window._specialDealsScriptLoading =
            false;

        /*
         * The script may already be loaded because the user opened
         * the shop before login. Reuse its exported function instead
         * of permanently returning.
         */
        if (
            typeof window.SpecialDeals ===
            'function'
        ) {
            window.SpecialDeals(
                targetTab
            );
        } else {
            console.warn(
                '[SHOP] skinsAndDeals.js exists, but SpecialDeals is not ready yet.'
            );
        }

        return;
    }

    window._specialDealsScriptLoading = true;

    var SpecialDealsJS = document.createElement("script");
    SpecialDealsJS.id = "lm-special-deals-script";
    SpecialDealsJS.type = "text/javascript";
    SpecialDealsJS.src = "https://www.legendmod.ml/LMexpress/skinsAndDeals.js?v=" + (window.OgVer || "");

    SpecialDealsJS.onload = function () {
        window._specialDealsScriptLoading = false;

        var pendingTab = window._pendingShopTab || targetTab;

        if (typeof window.SpecialDeals === 'function' && !$('#specialShopModal').length) {
            window.SpecialDeals(pendingTab);
        }
    };

    SpecialDealsJS.onerror = function () {
        window._specialDealsScriptLoading = false;

        if (SpecialDealsJS.parentNode) {
            SpecialDealsJS.parentNode.removeChild(SpecialDealsJS);
        }

        if (window.toastr) {
            toastr.error(_lmxT('lmx.ex.shopLoadFailed'));
        } else {
            console.error('[SHOP] Failed to load skinsAndDeals.js');
        }
    };

    document.body.appendChild(SpecialDealsJS);
}
function BeforeLegendmodShop() {
    /* shop.js builds the shop window each time it runs, so it runs on every click:
     * replace the old tag instead of adding one more per click */
    $("#lm-shop-script").remove();
    var SpecialDealsJS = document.createElement("script");
    SpecialDealsJS.id = "lm-shop-script";
    SpecialDealsJS.type = "text/javascript";
    SpecialDealsJS.src = "https://www.legendmod.ml/LMexpress/shop/shop.js?v=" + (window.OgVer || "");
    $("body").append(SpecialDealsJS);
}

function isEquivalent(a, b) {
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);
    if (aProps.length != bProps.length) {
        return false;
    }
    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];
        if (a[propName] !== b[propName]) {
            return false;
        }
    }
    return true;
}

//Snez Agar Version Destinations
function AgarVersionDestinations() {
    /*
     * The current config version always comes from agar.io itself
     * (window.agarversion, refreshed from the login response). The shared
     * LMConfigVersion record only adds previously seen versions to the
     * Advanced dropdown, so a missing record (404) must not break anything.
     */
    window.agarversionDestinationFound = false;
    window.agarversionDestinations = { 0: window.agarversion };

    function refreshDropdown() {
        if (typeof populateLibConfig === 'function') populateLibConfig();
    }

    refreshDropdown();

    /*
     * Version history = union of:
     *  - the shared LMConfigVersion record on api.legendmod.ml (grows as players see new versions),
     *  - agario/live/versions.json in this repo (every v15 config agar.io still serves,
     *    rebuilt after the SNEZ -> api.legendmod.ml move lost the old record),
     *  - agar.io's current version (window.agarversion).
     * Whenever the merged list has a version the server record lacks, it is written back,
     * so the server record fills itself and stays complete.
     */
    var _lmVerServer = null, _lmVerServerStatus = 0, _lmVerRepo = [], _lmVerPending = 2;
    function _lmVerId(v) {
        var m = /^v(\d+)\/(\d+)\/$/.exec(String(v || ''));
        return m ? Number(m[1]) * 1e7 + Number(m[2]) : -1;
    }
    function _lmVerMerge() {
        if (--_lmVerPending > 0) return;
        try {
            var seen = {}, versions = [];
            var add = function (v) {
                if (typeof v === 'string' && _lmVerId(v) >= 0 && !seen[v]) { seen[v] = true; versions.push(v); }
            };
            var serverList = [];
            if (_lmVerServer) Object.keys(_lmVerServer).forEach(function (k) { serverList.push(_lmVerServer[k]); });
            serverList.forEach(add);
            _lmVerRepo.forEach(add);
            add(window.agarversion);
            versions.sort(function (a, c) { return _lmVerId(a) - _lmVerId(c); });

            window.agarversionDestinations = {};
            versions.forEach(function (value, index) {
                window.agarversionDestinations[index] = value;
            });

            /* Auto-populate the server: write back when it lacks any known version.
             * Never overwrite a record we could not read (only 200 with a parsed body, or 404). */
            var missing = versions.some(function (v) { return serverList.indexOf(v) === -1; });
            if (missing && ((_lmVerServerStatus === 200 && _lmVerServer) || _lmVerServerStatus === 404)) {
                postSNEZ('https://api.legendmod.ml/lm-settings', 'LMConfigVersion', 'LMConfigVersionPass', JSON.stringify(window.agarversionDestinations));
            }
            refreshDropdown();
        } catch (e) { }
    }

    try {
        getSNEZ("https://api.legendmod.ml/lm-settings", "LMConfigVersion", "LMConfigVersionPass", function (xhttp) {
            try {
                _lmVerServerStatus = xhttp ? xhttp.status : 0;
                if (xhttp && xhttp.status === 200 && xhttp.response) {
                    var parsed = JSON.parse(xhttp.response);
                    if (isObject(parsed)) _lmVerServer = parsed;
                }
            } catch (e) { }
            _lmVerMerge();
        });
    } catch (e) { _lmVerMerge(); }

    try {
        var _lmVerXhr = new XMLHttpRequest();
        _lmVerXhr.open("GET", "https://www.legendmod.ml/agario/live/versions.json", true);
        _lmVerXhr.onload = function () {
            try {
                var list = JSON.parse(_lmVerXhr.responseText);
                if (Array.isArray(list)) _lmVerRepo = list;
            } catch (e) { }
            _lmVerMerge();
        };
        _lmVerXhr.onerror = function () { _lmVerMerge(); };
        _lmVerXhr.send();
    } catch (e) { _lmVerMerge(); }

    /* agar.io's version can arrive later (login response): add it and write it back. */
    window._lmAddAgarVersion = function (version) {
        if (_lmVerPending > 0 || _lmVerId(version) < 0) return;
        var known = Object.keys(window.agarversionDestinations || {}).map(function (k) { return window.agarversionDestinations[k]; });
        if (known.indexOf(version) !== -1) return;
        known.push(version);
        known.sort(function (a, c) { return _lmVerId(a) - _lmVerId(c); });
        window.agarversionDestinations = {};
        known.forEach(function (v, i) { window.agarversionDestinations[i] = v; });
        if ((_lmVerServerStatus === 200 && _lmVerServer) || _lmVerServerStatus === 404) {
            postSNEZ('https://api.legendmod.ml/lm-settings', 'LMConfigVersion', 'LMConfigVersionPass', JSON.stringify(window.agarversionDestinations));
        }
        refreshDropdown();
    };
}



function isObject(val) {
    if (val == null) {
        return false;
    }
    return ((typeof val == 'function') || (typeof val == 'object'));
}

function LegendModServerConnect() { };




function UIDcontroller() {
    PremiumUsers();
    /* the server list arrives later: check again once it has been merged */
    AgarBannedUIDs(_lmCheckBannedUID);
    _lmCheckBannedUID();
}

function _lmCheckBannedUID() {
    if (window._lmBanApplied) return;
    var bannedUID = localStorage.getItem("bannedUID");
    if ((window.agarioUID && bannedUserUIDs.includes(window.agarioUID)) || bannedUID == "true") {
        window._lmBanApplied = true;
        localStorage.setItem("bannedUID", true);
        document.documentElement.innerHTML = "";
        window.localStorage.setItem('HSLO[Saigo]:settings', defaultSettings.lbTeammateColor)
        toastr.error(_lmxT('lmx.ex.banned', ['<a target="_blank" href="https://www.legendmod.ml/"><font color="blue"><b><u>jimboy3100.github.io</u></b></font></a>'])).css("width", "350px");

    }
}

function AgarBannedUIDs(onLoaded) {
    //postSNEZ('https://lmsettings.snez.org/', 'LMAgarBannedUIDs', 'LMAgarBannedUIDsPass', JSON.stringify({0: "v12/2204/", 1: "v12/2168/", 2: "v12/1922/"}));		 //default
    try {
        getSNEZ("https://api.legendmod.ml/lm-settings", "LMAgarBannedUIDs", "LMAgarBannedUIDsPass", function (xhttp) {
            try {
                if (!xhttp) return;
                /* No record on the server yet (404) means an empty ban list. */
                if (xhttp.status === 404) {
                    window.AgarBannedUIDsAdded = true;
                    return;
                }
                if (xhttp.status !== 200 || !xhttp.response) return;
                var responseLMAgarBannedUIDs = JSON.parse(xhttp.response);
                for (var i = 0; i < Object.keys(responseLMAgarBannedUIDs).length; i++) {
                    if (window.bannedUserUIDs) {
                        var bannedUID_entry = responseLMAgarBannedUIDs[i].split('@')[0];
                        if (!bannedUserUIDs.includes(responseLMAgarBannedUIDs[i])) {
                            //console.log('does not include', responseLMAgarBannedUIDs[i])
                            window.bannedUserUIDs.push(responseLMAgarBannedUIDs[i])
                        }
                    }
                }
                window.AgarBannedUIDsAdded = true;
                if (typeof onLoaded === "function") onLoaded();
            } catch (error) { }
        });
    }
    catch (error) { }
}

/*
 * The ban list's username/password are public in this file, so the server
 * (api.legendmod.ml/lm-settings) also requires the admin key (x-lm-admin header,
 * /etc/lm-settings/admin.key on the VPS) for writes. Asked once, kept in this browser.
 */
function _lmBanAdminKey(forcePrompt) {
    var key = '';
    try { key = localStorage.getItem('lmBanAdminKey') || ''; } catch (e) { }
    if (!key || forcePrompt) {
        key = String(window.prompt(_lmxT('lmx.ex.banKeyPrompt', ['/etc/lm-settings/admin.key'])) || '').trim();
        if (key) { try { localStorage.setItem('lmBanAdminKey', key); } catch (e) { } }
    }
    return key;
}

function _lmPostBanList() {
    var key = _lmBanAdminKey(false);
    if (!key) {
        toastr.error(_lmxT('lmx.ex.banNoKey'));
        AgarBannedUIDsResync();
        return;
    }
    try {
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", 'https://api.legendmod.ml/lm-settings', true);
        xhttp.setRequestHeader("username", 'LMAgarBannedUIDs');
        xhttp.setRequestHeader("password", 'LMAgarBannedUIDsPass');
        xhttp.setRequestHeader("x-lm-admin", key);
        xhttp.onload = function () {
            if (xhttp.status === 200) {
                toastr.success(_lmxT('lmx.ex.banSaved'));
                return;
            }
            if (xhttp.status === 403) {
                try { localStorage.removeItem('lmBanAdminKey'); } catch (e) { }
                toastr.error(_lmxT('lmx.ex.banWrongKey'));
            } else {
                toastr.error(_lmxT('lmx.ex.banHttp', [xhttp.status]));
            }
            AgarBannedUIDsResync();
        };
        xhttp.onerror = function () {
            toastr.error(_lmxT('lmx.ex.banNetwork'));
            AgarBannedUIDsResync();
        };
        xhttp.send(JSON.stringify(window.bannedUserUIDs));
    } catch (e) { }
}

/* After a refused write, reload the server's list so the panel shows what is really stored. */
function AgarBannedUIDsResync() {
    getSNEZ("https://api.legendmod.ml/lm-settings", "LMAgarBannedUIDs", "LMAgarBannedUIDsPass", function (xhttp) {
        try {
            if (!xhttp) return;
            if (xhttp.status === 404) { window.bannedUserUIDs.length = 0; return; }
            if (xhttp.status !== 200 || !xhttp.response) return;
            var list = JSON.parse(xhttp.response);
            window.bannedUserUIDs.length = 0;
            for (var k in list) {
                if (Object.prototype.hasOwnProperty.call(list, k) && typeof list[k] === 'string') window.bannedUserUIDs.push(list[k]);
            }
        } catch (e) { }
    });
}

function AddAgarBannedUIDs(UID) {
    if (window.bannedUserUIDs && window.AgarBannedUIDsAdded) {

        /* Validate the UID being banned (it used to check the admin's own agarioUID). */
        if (!window.bannedUserUIDs.includes(UID) && UID != null && UID != "" && String(UID).includes('-')) {
            window.bannedUserUIDs[window.bannedUserUIDs.length] = UID;
            _lmPostBanList();
        }
    }
}

function RemoveAgarBannedUIDs(UID) {
    if (window.bannedUserUIDs && window.AgarBannedUIDsAdded) {
        if (UID != null) {
            for (var i = bannedUserUIDs.length - 1; i >= 0; i--) {
                if (bannedUserUIDs[i] == UID) {
                    bannedUserUIDs.splice(i, 1);
                }
            }
            _lmPostBanList();
        }
    }
}

function BannedUIDS() {
    if (AdminRights == 1) {
        if (window.AgarBannedUIDsAdded) {
            $('#helloContainer').after('<div class="modal fade in" id="BannedUIDSModal" aria-hidden="false" style="display: block;">' +
                '<div class="modal-backdrop fade in"></div>' +
                '<div class="modal-dialog" style="top: calc(50vh - 241.5px); width: 500px;">' +
                '<div class="modal-content">' +
                '<div id="CloseBannedUIDS2" class="modal-header"><button id="CloseBannedUIDS" type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&#10005;</span><span class="sr-only">' + Premadeletter113 + '</span></button>' +
                '<h4 class="modal-title" style="font-family: var(--lm-hud-font, Roboto Condensed, sans-serif)">' + _lmxE('lmx.ex.bannedIds') + '</h4>' +
                '</div>' +
                '<div class="modal-body"><input type="text" class="form-control" id="Bannedagario_uid_input" placeholder="*' + _lmxE('lmx.ex.uidToBan') + '" style="width: 85%; display: inline-block">' +
                '<button id="AddBannedUID" type="submit" class="btn btn-primary btn 2" style="margin-top: 2px; display: block; width: 20%; padding: 4px 0px 6px; text-transform: capitalize;">' + _lmxE('lmx.ex.add') + '</button>' +
                '<br><span style="display:inline; color: red;"> <b>' + _lmxE('lmx.ex.bannedUids') + ':</b></span>' +
                '<br><br>' +
                '<select id="ss-select-BannedUIDS" class="form-control" required="" style="display:inline; width: 80%; margin-top: -30px;"></select>' +
                '<button id="RemoveBannedUID" type="submit" class="btn btn-primary btn 2" style="margin-top: 2px; display: block; width: 20%; padding: 4px 0px 6px; text-transform: capitalize;">' + _lmxE('lmx.ex.remove') + '</button>' +
                '<br>' +
                '<p class="alert-warning text-center">' + _lmxE('lmx.ex.careUids') + '<br>' + _lmxE('lmx.ex.yourUid') + ': <span class="alert-success" id="exp-uid">' + _lmEscHtml(window.agarioUID) + '</span></p>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>');
            populateBanListConfig();
            lmPromoChrome("#BannedUIDSModal");

            $("#CloseBannedUIDS").click(function () {
                $("#BannedUIDSModal").remove();
            });
            $("#AddBannedUID").click(function () {
                var temp = $("#Bannedagario_uid_input").val()
                if (!bannedUserUIDs.includes(temp) && temp != null && temp != "" && temp.includes('-')) {
                    AddAgarBannedUIDs(temp);
                    /* AddAgarBannedUIDs already appended it; avoid a duplicate entry. */
                    if (!bannedUserUIDs.includes(temp)) bannedUserUIDs.push(temp);
                    var opt = document.createElement("option");
                    opt.text = temp;
                    document.getElementById('ss-select-BannedUIDS').options.add(opt);
                    toastr.info(_lmxT('lmx.ex.banAdded', [_lmEscHtml(temp)]));
                } else {
                    toastr.info(_lmxT('lmx.ex.banBadUid', [_lmEscHtml(temp)]));
                }
            });
            $("#RemoveBannedUID").click(function () {
                var temp = $("#ss-select-BannedUIDS").val();
                var x = document.getElementById("ss-select-BannedUIDS");
                x.remove(x.selectedIndex);
                RemoveAgarBannedUIDs(temp);
                toastr.info(_lmxT('lmx.ex.banRemoved', [_lmEscHtml(temp)]));
            });
        } else {
            toastr.info(_lmxT('lmx.ex.playFirst'));
        }
    } else {
        toastr.info(_lmxT('lmx.ex.noAuthority'));
    }
}

function populateBanListConfig() {
    var select = document.getElementById("ss-select-BannedUIDS");
    for (var i = 0; i < Object.keys(window.bannedUserUIDs).length; i++) {
        select.options[select.options.length] = new Option(window.bannedUserUIDs[i])
    }
}



function findUserLang() {
    if (window.navigator.languages) {
        if (window.navigator.languages[0] && (window.navigator.languages[0] == "en" || window.navigator.languages[1] && window.navigator.languages[1].includes('-'))) {
            if (window.navigator.languages[1] && (window.navigator.languages[1] == "en" || window.navigator.languages[1].includes('-'))) {
                if (window.navigator.languages[2] && (window.navigator.languages[2] == "en" || window.navigator.languages[2].includes('-'))) {
                    if (window.navigator.languages[3] && !(window.navigator.languages[3] == "en" || window.navigator.languages[3].includes('-'))) window.userLanguage = window.navigator.languages[3]
                }
                else window.userLanguage = window.navigator.languages[2]
            }
            else window.userLanguage = window.navigator.languages[1]
        }
        else window.userLanguage = window.navigator.languages[0]
    }
}

function startTranslating(_lmTry) {

    var targetNode = document.querySelector("#chat-box");
    /* #chat-box is built by the game UI after this file runs: wait for it (1 s steps, 2 min) */
    if (!targetNode) {
        if ((_lmTry | 0) < 120) setTimeout(function () { startTranslating((_lmTry | 0) + 1); }, 1000);
        return;
    }
    if (targetNode._lmTrObserved) return;
    targetNode._lmTrObserved = true;
    var observerOptions = {
        childList: true,
        attributes: false,
        subtree: false //Omit or set to false to observe only changes to the parent node.
    };

    var observerMut = new MutationObserver(callbackMut);

    /* Translate each newly added message once. Translating "the last child" once per
     * mutation record sent every message twice when the 200-message trim added a
     * removal record next to the append. */
    function callbackMut(mutationList, observerMut) {
        if (!defaultmapsettings.showChatTranslation) return;
        mutationList.forEach((mutation) => {
            for (var ai = 0; ai < mutation.addedNodes.length; ai++) {
                var msgNode = mutation.addedNodes[ai];
                if (!msgNode || msgNode.nodeType !== 1 || !msgNode.classList) continue;
                if (!msgNode.classList.contains('message') || msgNode.classList.contains('command')) continue;
                if (msgNode.getAttribute('data-lm-translated')) continue;
                var textHost = msgNode.lastChild;
                var textNode = textHost && textHost.firstChild;
                if (!textNode || !textNode.textContent) continue;
                msgNode.setAttribute('data-lm-translated', '1');
                doMainTranslation(targetNode, textNode.textContent, msgNode);
            }
        });
    };

    observerMut.observe(targetNode, observerOptions);

}
/* Chat translation (setting "showChatTranslation", off by default) with the browser's built-in
 * Translator + LanguageDetector (Chrome 138+): runs on the device, no key, nothing is sent to a
 * translation server. The Yandex v1.5 API used before was shut down (HTTP 410). Browsers without
 * the built-in translator show no translation. */
var _lmTrCache = {};
function _lmTrGet(src, dst) {
    var k = src + '>' + dst;
    if (!_lmTrCache[k]) {
        _lmTrCache[k] = self.Translator.create({ sourceLanguage: src, targetLanguage: dst }).catch(function () { delete _lmTrCache[k]; return null; });
    }
    return _lmTrCache[k];
}
var _lmDetector = null;
function doMainTranslation(targetNode, bb, msgNode) {
    var dst = String(window.userLanguage || '').split('-')[0];
    if (!dst || !bb || typeof self === 'undefined' || !self.Translator || !self.LanguageDetector) return;
    if (!_lmDetector) _lmDetector = self.LanguageDetector.create().catch(function () { _lmDetector = null; return null; });
    _lmDetector.then(function (det) {
        if (!det) return null;
        return det.detect(bb).then(function (res) {
            var best = res && res[0];
            var src = best && best.confidence >= 0.5 ? String(best.detectedLanguage || '').split('-')[0] : '';
            if (!src || src === 'und' || src === dst) return null;
            return _lmTrGet(src, dst);
        });
    }).then(function (tr) {
        return tr ? tr.translate(bb) : null;
    }).then(function (text) {
        if (!text || text === bb) return;
        var trHost = msgNode ? msgNode.lastChild : (targetNode.lastChild && targetNode.lastChild.lastChild);
        if (!trHost) return;
        /* the translation comes after the box scrolled to the new message: a reader at the bottom
         * (or the scroll to it still going) stays at the bottom, else the added line was cut off */
        var box = targetNode && targetNode.nodeType === 1 ? targetNode : null;
        var $box = box && window.jQuery ? window.jQuery(box) : null;
        var follow = !!box && (box.scrollHeight - box.scrollTop - box.clientHeight < 40 || !!($box && $box.is(':animated')));
        var trText = document.createElement('span');
        trText.style.color = 'deepskyblue';
        trText.style.textShadow = '1px 1px 1px white';
        trText.textContent = ' [' + text + ']';
        trHost.appendChild(trText);
        if (!box) return;
        if (follow) { if ($box) $box.stop(true); box.scrollTop = box.scrollHeight; }
        if ($box && $box.perfectScrollbar) { try { $box.perfectScrollbar('update'); } catch (e) { } }
    }).catch(function () { });
}
function changeFrameWork() {
    defaultmapsettings.unlockedFPS = false;
    application.saveSettings(defaultmapsettings, "ogarioSettings");
}

function changeFrameWorkStart() {
    defaultmapsettings.unlockedFPS = false;
}
/* -- Legend Mod Theme Bridge (mod-side helpers), the receiver is lib/lm-theme-bridge.js --
 * lmThemeData()  -> only visual values and the language: {pc, pc2, mc, tc, tc2, bg, op, btc, b1..b4, b1b..b4b,
 *                   hm, hb, ht (HUD colours), hf, hw, hs (HUD font, weight, scale), rad, rs (corners), lang}
 * lmThemeQuery() -> returns "?lm=<base64url JSON>" to append to any URL
 * lmThemeHash()  -> returns "#lm=<base64url JSON>"
 * lmThemeSend(iframe) -> sends the theme with postMessage, only to a Legend page
 * lmThemeChanged() -> the theme setters call it: open Legend pages that said "lm-theme-ready" get the new theme
 * lang: the Choose Language number (1 English .. 16 Italian): the web pages (lib/lm-i18n.js) show
 * that language; on agar.io the site cannot read the mod's localStorage. */
/* the exact HTTPS origins of the Legend pages: nothing else gets the theme */
var LM_THEME_ORIGINS = ['https://www.legendmod.ml', 'https://legendmod.ml', 'https://jimboy3100.github.io'];
/* the longest theme value in a link (base64url characters); the page reads at most 4096 */
var LM_THEME_MAX = 4000;
/* UTF-8 safe base64url (btoa only handles Latin-1; Unicode bg URLs would throw) */
function _lmUtf8ToBase64(str) {
    try {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (_, p) { return String.fromCharCode(parseInt(p, 16)); }))
            .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    } catch (e) { return ''; }
}
/* a colour as the page accepts it (hex, rgb()/hsl() or a colour word), else the default */
function _lmThemeColor(v, d) {
    v = typeof v === 'string' ? v.trim() : '';
    return v.length <= 64 && /^(#[0-9a-fA-F]{3,8}|(rgba?|hsla?)\([0-9.,%\s\/-]+\)|[a-zA-Z]{3,20})$/.test(v) ? v : d;
}
/* The menu background for a web page: https only, no user:pass@, no fragment, and only query values
 * that cannot carry a login or token (raw, w, h, size ...). '' when the address cannot be made safe. */
function lmThemeSafeImage(v) {
    if (typeof v !== 'string') return '';
    v = v.trim();
    if (!v || v.length > 1024 || /[\s"'()\\<>\u0000-\u001f\u007f]/.test(v)) return '';
    var u;
    try { u = new URL(v); } catch (e) { return ''; }
    if (u.protocol !== 'https:' || u.username || u.password || !u.hostname) return '';
    var q = [];
    (u.search ? u.search.slice(1).split('&') : []).forEach(function (p) {
        var kv = p.split('='), val = kv.length > 1 ? kv.slice(1).join('=') : '';
        if (/^(raw|v|ver|version|w|h|width|height|size|format|fm|fit|auto|quality|dpr)$/.test(kv[0]) && /^[A-Za-z0-9._-]{0,32}$/.test(val)) q.push(p);
    });
    u.search = q.length ? '?' + q.join('&') : '';
    u.hash = '';
    return u.href.length <= 1024 && !/[\s"'()\\<>]/.test(u.href) ? u.href : '';
}
function lmThemeData() {
    var ds = typeof defaultSettings !== 'undefined' && defaultSettings ? defaultSettings : {};
    var c = _lmThemeColor;
    var d = {
        pc: c(ds.menuPanelColor || $('#menuPanelColor').val(), '#00243e'),
        pc2: c(ds.menuPanelColor2 || $('#menuPanelColor2').val(), '#002f52'),
        mc: c(ds.menuMainColor || $('#hudMainColor').val(), '#01d9cc'),
        tc: c(ds.menuTextColor, '#ffffff'),
        tc2: c(ds.menuTextColor2, '#8096a7'),
        bg: lmThemeSafeImage(ds.menuBg || $('#menuBg').val() || ''),
        op: String(ds.menuOpacity != null && isFinite(parseFloat(ds.menuOpacity)) ? parseFloat(ds.menuOpacity) : '0.96'),
        btc: c(ds.menuBtnTextColor, '#ffffff'),
        b1: c(ds.btn1Color, '#018cf6'),
        b2: c(ds.btn2Color, '#00b9e8'),
        b3: c(ds.btn3Color, '#8d5fe6'),
        b4: c(ds.btn4Color, '#bf00aa'),
        b1b: c(ds.btn1Color2, '#0176ce'),
        b2b: c(ds.btn2Color2, '#0099c0'),
        b3b: c(ds.btn3Color2, '#814ee3'),
        b4b: c(ds.btn4Color2, '#a80096'),
        /* the HUD palette and typography (separate from the menu) */
        hm: c(ds.hudMainColor, '#01d9cc'),
        hb: c(ds.hudColor, 'rgba(0,0,0,0.4)'),
        ht: c(ds.hudTextColor, '#ffffff'),
        hf: String(ds.hudFontFamily || '').replace(/[^A-Za-z0-9 ,-]/g, '').trim().slice(0, 64),
        hw: String(parseInt(ds.hudFontWeight, 10) || ''),
        /* the HUD scale shown on this screen (a page opened here matches the game's HUD) */
        hs: (function (v) { return String(isFinite(v) ? v : ''); })(typeof window.lmHudScale === 'function' ? window.lmHudScale() : parseFloat(ds.hudScale))
    };
    /* the corners of Rounded / Square HUD, when the player chose one: windows and buttons / fields */
    try {
        var st = getComputedStyle(document.documentElement);
        var rad = parseFloat(st.getPropertyValue('--lm-radius')), rs = parseFloat(st.getPropertyValue('--lm-radius-s'));
        if (isFinite(rad)) d.rad = String(rad);
        if (isFinite(rad) && isFinite(rs)) d.rs = String(rs);
    } catch (e) { }
    /* the Legend Mod language (languagemod 1 English ... 16 Italian): the only setting that goes with the theme.
     * The language on screen (LMi18n.num()) first: a first-time player's browser language is not saved yet. */
    try {
        var lang = parseInt((window.LMi18n && window.LMi18n.num()) ||
            (typeof languagemod !== 'undefined' && languagemod ? languagemod : localStorage.getItem('languagemod')), 10);
        d.lang = lang >= 1 && lang <= 16 ? String(lang) : '1';
    } catch (e) { d.lang = '1'; }
    return d;
}
/* the theme as one bounded base64url value; without the background when it would be too long */
function lmThemeToken() {
    try {
        var d = lmThemeData(), s = _lmUtf8ToBase64(JSON.stringify(d));
        if (s.length > LM_THEME_MAX && d.bg) { d.bg = ''; s = _lmUtf8ToBase64(JSON.stringify(d)); }
        return s && s.length <= LM_THEME_MAX ? s : '';
    } catch (e) { return ''; }
}
function lmThemeQuery() {
    var t = lmThemeToken();
    return t ? '?lm=' + t : '';
}
function lmThemeHash() {
    var t = lmThemeToken();
    return t ? '#lm=' + t : '';
}
/* The one navigation helper: a Legend page that the mod opens gets the theme in its URL (#lm=...),
 * replacing an older one; an anchor stays first (#controls&lm=...), the page takes the theme out and
 * goes to #controls. Only exact HTTPS Legend origins: http links, files, the game page and other
 * sites are returned unchanged. */
function lmThemeUrl(url) {
    try {
        var u = new URL(url, location.href);
        if (u.protocol !== 'https:' || LM_THEME_ORIGINS.indexOf(u.origin) < 0) return url;
        if (/\.(js|css|json|png|jpe?g|gif|webp|svg|ico|mp3|txt|zip|xml|pdf)$/i.test(u.pathname) || /\/play\.html$/.test(u.pathname)) return url;
        var t = lmThemeToken();
        if (!t) return url;
        var keep = u.hash.replace(/^#/, '').split('&').filter(function (p) { return p && p.indexOf('lm=') !== 0; });
        keep.push('lm=' + t);
        u.hash = keep.join('&');
        return u.href;
    } catch (e) { return url; }
}
/* every link the mod shows (menu footer, quick menu, More skins, More FPS, promo windows, notices)
 * gets the theme when it is clicked, so it is the current one */
(function () {
    function onLink(ev) {
        var a = ev.target && ev.target.closest ? ev.target.closest('a[href]') : null;
        if (!a) return;
        var href = a.getAttribute('href');
        if (!href || href.charAt(0) === '#' || /^(javascript|mailto|tel):/i.test(href)) return;
        var to = lmThemeUrl(href);
        if (to !== href) a.setAttribute('href', to);
    }
    document.addEventListener('click', onLink, true);
    document.addEventListener('auxclick', onLink, true);
    /* right click: Open in new tab / Copy link address get the theme too */
    document.addEventListener('contextmenu', onLink, true);
})();
/* The origins a Legend page can have: jimboy3100.github.io redirects to www.legendmod.ml,
 * so a frame opened on one of them may be on the other. Empty for any other site. */
function lmThemeOrigins(url) {
    try {
        var o = new URL(url, location.href).origin;
        if (LM_THEME_ORIGINS.indexOf(o) >= 0) return LM_THEME_ORIGINS.slice();
        if (o === location.origin && location.protocol === 'https:') return [o];
    } catch (e) { }
    return [];
}
/* Live theme: the Legend pages that said "lm-theme-ready" (embedded frames, tabs the mod opened),
 * at most 16, each with its exact origin. They get the theme in answer and on every change. */
var _lmThemePeers = [], _lmThemeTimer = 0;
function _lmThemePeer(win) {
    for (var i = 0; i < _lmThemePeers.length; i++) if (_lmThemePeers[i].win === win) return _lmThemePeers[i];
    return null;
}
function lmThemeSend(iframeEl) {
    if (!iframeEl || !iframeEl.contentWindow) return;
    /* never '*': the theme goes only to a Legend page, a third-party frame gets nothing */
    var p = _lmThemePeer(iframeEl.contentWindow);
    var to = p ? [p.origin] : lmThemeOrigins(iframeEl.src || '');
    if (!to.length) return;
    var msg = { type: 'lm-theme', theme: lmThemeData() };
    to.forEach(function (o) {
        try { iframeEl.contentWindow.postMessage(msg, o); } catch (e) { }
    });
}
function _lmThemeBroadcast() {
    _lmThemePeers = _lmThemePeers.filter(function (p) { try { return !!p.win && !p.win.closed; } catch (e) { return false; } });
    if (!_lmThemePeers.length) return;
    var msg = { type: 'lm-theme', theme: lmThemeData() };
    _lmThemePeers.forEach(function (p) { try { p.win.postMessage(msg, p.origin); } catch (e) { } });
}
/* called by the theme setters (ogario addCustomCSS), Rounded / Square HUD and a language change;
 * many changes in a row (dragging a colour) send once */
function lmThemeChanged() {
    /* a saved Rounded HUD is applied on load before the list above is set: nothing to send yet
     * (it threw there and stopped the rest of the load: timer, HUD images and titles not restored) */
    if (!_lmThemePeers || !_lmThemePeers.length) return;
    clearTimeout(_lmThemeTimer);
    _lmThemeTimer = setTimeout(_lmThemeBroadcast, 150);
}
window.lmThemeChanged = lmThemeChanged;
window.addEventListener('message', function (ev) {
    var d = ev && ev.data;
    if (!d || typeof d !== 'object' || d.type !== 'lm-theme-ready' || !ev.source || ev.source === window) return;
    if (LM_THEME_ORIGINS.indexOf(ev.origin) < 0) return;
    var p = _lmThemePeer(ev.source);
    if (p) {
        /* a frame that moves between Legend pages says ready on each one; bounded */
        if (++p.n > 50) return;
        p.origin = ev.origin;
    } else {
        if (_lmThemePeers.length >= 16) _lmThemePeers.shift();
        _lmThemePeers.push({ win: ev.source, origin: ev.origin, n: 1 });
    }
    try { ev.source.postMessage({ type: 'lm-theme', theme: lmThemeData() }, ev.origin); } catch (e) { }
});
try { if (window.LMi18n && typeof window.LMi18n.onChange === 'function') window.LMi18n.onChange(lmThemeChanged); } catch (e) { }
/* After any lm-promo modal is built, send theme to its iframes */
function lmThemeSendToModalIframes(sel) {
    setTimeout(function () {
        $(sel).find('iframe').each(function () {
            lmThemeSend(this);
            /* Also send after iframe loads (in case it wasn't ready) */
            var el = this;
            $(this).on('load', function () { lmThemeSend(el); });
        });
    }, 200);
}

/* The theme's CSS custom properties are set by the theme setters in ogario.v4.js (setMenu..., setHud...),
 * on :root and, for the menu colours, inline. This copies the menu colours inline again for windows built
 * before the theme was read, with the same names: --lm-pc, --lm-pc2, --lm-mc, --lm-tc, --lm-tc2. */
function _lmSyncThemeVars() {
    try {
        var _td = lmThemeData(), _r = document.documentElement.style;
        ['pc', 'pc2', 'mc', 'tc', 'tc2'].forEach(function (k) { _r.setProperty('--lm-' + k, _td[k]); });
    } catch (e) { }
}
/* Defer slightly so ogario has parsed ogarioThemeSettings from localStorage */
setTimeout(_lmSyncThemeVars, 500);

/* Promo and admin windows (Bootstrap modal markup): themed like the LM windows (Match history,
 * Private room) with the --lm-* menu colours, the close cross on the right and "?" on the left,
 * centred and kept on screen, and only this dialog drags (by its title bar). */
/* Bootstrap gives the dialog a 30px top margin; centre what is left. A dialog built hidden has no
 * height yet (it was placed half a screen down and ran off the bottom): it is centred when shown. */
function lmPromoCentre(sel) {
    var d = $(sel).last().find('.modal-dialog');
    var h = d.outerHeight() || 0;
    if (!h) return;
    d.css('top', Math.max(0, Math.round((window.innerHeight - h) / 2) - 30) + 'px');
}
function lmPromoChrome(sel) {
    _lmSyncThemeVars();
    if (!document.getElementById('lm-promo-css')) {
        var st = document.createElement('style');
        st.id = 'lm-promo-css';
        st.textContent =
            '.modal.lm-promo .modal-backdrop{background:#000;opacity:.55}' +
            /* centred on narrow screens too (Bootstrap puts it at the left edge below 768 px, under the
             * team list); a dialog taller than the screen scrolls by touch instead of running off it */
            '.modal.lm-promo{overflow-y:auto;-webkit-overflow-scrolling:touch}' +
            '.modal.lm-promo .modal-dialog{max-width:calc(100vw - 16px);margin-left:auto;margin-right:auto}' +
            '.modal.lm-promo .modal-content{background:var(--lm-pc,#00243e);color:var(--lm-tc,#fff);border:1px solid var(--lm-pc2,#002f52);border-top:3px solid var(--lm-mc,#01d9cc);border-radius:var(--lm-radius,6px);box-shadow:0 8px 32px rgba(0,0,0,.5);overflow:hidden;font-family:inherit}' +
            '.modal.lm-promo .modal-header{position:relative;min-height:0;padding:10px 52px 8px;text-align:center;border-bottom:1px solid var(--lm-pc2,#002f52);background:linear-gradient(180deg,var(--lm-pc2,#002f52) 0%,var(--lm-pc,#00243e) 100%);cursor:move}' +
            '.modal.lm-promo .modal-title{font-family:inherit!important;font-size:16px;font-weight:700;letter-spacing:1px;text-transform:uppercase;line-height:1.4;color:var(--lm-mc,#01d9cc)}' +
            '.modal.lm-promo .modal-header .close{position:absolute;top:6px;right:10px;float:none;margin:0;padding:0;min-width:28px;min-height:28px;display:flex;align-items:center;justify-content:center;border-radius:var(--lm-radius-s,4px);background:rgba(255,255,255,.05);color:var(--lm-tc2,#8096a7);opacity:1;text-shadow:none;font-size:18px;font-weight:400;line-height:1;cursor:pointer}' +
            '.modal.lm-promo .modal-header .close+.close{right:auto;left:10px;font-size:14px;font-weight:700}' +
            '.modal.lm-promo .modal-header .close:hover{color:var(--lm-tc,#fff);background:rgba(255,255,255,.12)}' +
            '.modal.lm-promo iframe{display:block;max-width:100%;max-height:calc(100vh - 100px);border:0;background:var(--lm-pc,#00243e)}' +
            '.modal.lm-promo .modal-body .form-control{background:rgba(0,0,0,.25);color:var(--lm-tc,#fff);border:1px solid var(--lm-pc2,#002f52)}' +
            '.modal.lm-promo .modal-body{background:transparent;color:var(--lm-tc,#fff);padding:12px 15px}' +
            '.modal.lm-promo .modal-body button:not(.btn){background:var(--lm-pc2,#002f52);color:var(--lm-tc,#fff);border:1px solid rgba(255,255,255,.12);border-radius:var(--lm-radius-s,4px);padding:4px 12px;cursor:pointer}' +
            '.modal.lm-promo .modal-body button:not(.btn):hover{background:rgba(255,255,255,.12)}' +
            '.modal.lm-promo .modal-body select.form-control{background:rgba(0,0,0,.25);color:var(--lm-tc,#fff);border:1px solid var(--lm-pc2,#002f52)}' +
            '.modal.lm-promo .modal-body input[type="number"]{background:rgba(0,0,0,.25);color:var(--lm-tc,#fff);border:1px solid var(--lm-pc2,#002f52);border-radius:var(--lm-radius-s,4px);padding:3px 6px}' +
            '.modal.lm-promo .modal-body input[type="file"]{color:var(--lm-tc2,#8096a7)}' +
            '.modal.lm-promo .modal-body input[type="text"]{background:rgba(0,0,0,.25);color:var(--lm-tc,#fff);border:1px solid var(--lm-pc2,#002f52)}' +
            '.modal.lm-promo .modal-footer{background:var(--lm-pc2,#002f52);border-top:1px solid rgba(255,255,255,.08);padding:10px 15px}';
        (document.head || document.documentElement).appendChild(st);
    }
    /* it stays next to #helloContainer (inside #overlays, under the HUD): the HUD controls
     * (notifications bell, theme previews) remain usable while a promo is open */
    var m = $(sel).last().addClass('lm-promo');
    var d = m.find('.modal-dialog');
    lmPromoCentre(sel);
    if (typeof d.draggable === 'function') d.draggable({ handle: '.modal-header', cancel: '.close' });
    /* Send theme to any iframes inside this modal */
    lmThemeSendToModalIframes(sel);
}
function LMLegendFFAPromo() {
    if (window.LM_IS_MOBILE) return; // skip promo on mobile
    $('#helloContainer').after(
        '<div class="modal fade in" id="LMPromoLegendFFA" aria-hidden="false" style="display: block;">' +
        '<div class="modal-backdrop fade in"></div>' +
        '<div class="modal-dialog" style="top: calc(50vh - 241.5px); width: 922px;">' +
        '<div class="modal-content">' +

        '<div id="CloseLMPromoLegendFFA2" class="modal-header">' +

        '<button id="CloseLMPromoLegendFFA" type="button" class="close">' +
        '<span aria-hidden="true">&#10005;</span>' +
        '</button>' +

        '<h4 class="modal-title" style="font-family: var(--lm-hud-font, Roboto Condensed, sans-serif)">' +
        '\ud83d\udc51 ' + _lmxE('lmx.ex.ffaServerTitle') + '' +
        '</h4>' +

        '</div>' +

        '<div id="LMadvertisementLegendFFA">' +
        '<iframe id="legendFFAIframe" ' +
        'src="https://www.legendmod.ml/extras/legendffa.html" ' +
        'width="920" height="550" style="border:none;"></iframe>' +
        '</div>' +

        '</div>' +
        '</div>' +
        '</div>'
    );

    lmPromoChrome("#LMPromoLegendFFA");

    $("#CloseLMPromoLegendFFA").on("click", function () {
        $("#LMPromoLegendFFA").remove();
    });
}




/* Shared look of the Legend windows (Custom Macros, Replay Studio, ... and the
 * lm_extended_ui dialogs). Every window module calls lmUiKit() before it builds its window,
 * so the window never depends on another script having added these rules first.
 * The --lm-w-* sizes and surfaces below are read by the modules' own styles with their old
 * value as fallback: header, title, text, padding and control sizes are the same everywhere,
 * and the window surface follows the menu opacity (--lm-op) and background image (--lm-menu-bg).
 * The opacity is on the surface colour only: the text and the controls stay fully opaque.
 * .lm-modal-container gives the window chrome only (border, accent, corners, shadow);
 * the size of the lm_extended_ui dialogs is set for those dialogs alone (.lm-modal-overlay). */
function lmUiKit() {
    if (document.getElementById('lm-ui-kit')) return;
    var mix = false;
    try { mix = !!(window.CSS && CSS.supports && CSS.supports('color', 'color-mix(in srgb, red 50%, transparent)')); } catch (e) { }
    /* the surface colour at the menu opacity; older browsers: the plain panel colour.
     * Windows are full of small text: at least 82 %, so what is behind never makes it unreadable */
    var A = function (c, k) { return mix ? 'color-mix(in srgb, ' + c + ' ' + k + ', transparent)' : c; };
    var op = 'calc(max(var(--lm-op, 1), 0.82) * 100%)';
    var s1 = A('var(--lm-pc, #00243e)', op), s2 = A('var(--lm-pc2, #002f52)', op);
    var st = document.createElement('style');
    st.id = 'lm-ui-kit';
    st.textContent =
        /* the text sizes follow Settings > Accessibility > menu text size (--lm-font-scale, set by
         * ogario/modules/accessibility.js): sizes, not multipliers, so nested text is scaled once */
        ':root{--lm-w-fs:calc(12px * var(--lm-font-scale, 1));--lm-w-fs-s:calc(11px * var(--lm-font-scale, 1));--lm-w-title:calc(14px * var(--lm-font-scale, 1));--lm-w-gap:6px;--lm-w-pad:8px 12px;--lm-w-hpad:4px 6px 4px 12px;' + // i18n-ok: CSS
        '--lm-w-ctl:28px;--lm-w-x:36px;' +
        '--lm-w-surface:' + s1 + ';' + // i18n-ok: CSS
        '--lm-w-bg:linear-gradient(' + s1 + ',' + s1 + '),var(--lm-menu-bg, none) center/cover no-repeat;' + // i18n-ok: CSS
        '--lm-w-head:linear-gradient(180deg,' + s2 + ' 0%,' + s1 + ' 100%);' +
        '--lm-w-sep:' + (mix ? A('var(--lm-tc, #fff)', '10%') : 'rgba(255,255,255,.1)') + ';' + // i18n-ok: CSS
        '--lm-w-btn:' + (mix ? A('var(--lm-tc, #fff)', '6%') : 'rgba(255,255,255,.06)') + ';' + // i18n-ok: CSS
        '--lm-w-btn-h:' + (mix ? A('var(--lm-tc, #fff)', '14%') : 'rgba(255,255,255,.14)') + ';' + // i18n-ok: CSS
        '--lm-w-field:rgba(0,0,0,.22)}' +
        /* the notification panel is a HUD part: its text follows the HUD text size (accessibility.js
         * scales it as a whole), not the menu text size on top of it */
        '#lm-notif-panel{--lm-w-fs:12px;--lm-w-fs-s:11px;--lm-w-title:14px}' +
        /* touch screens: larger controls and close crosses */
        '@media (pointer:coarse){:root{--lm-w-ctl:36px;--lm-w-x:40px}}' +
        '.lm-modal-container{border-radius:var(--lm-radius,6px);box-shadow:0 8px 32px rgba(0,0,0,.5);' +
        'border:1px solid var(--lm-pc2,rgba(255,255,255,.12));border-top:3px solid var(--lm-mc,#01d9cc);box-sizing:border-box}' +
        /* windows keep the menu's text font (most set font-family:inherit; on the others this rule
         * gave Profiles, Theme Workshop, Command Centre, Custom Macros and Discover the HUD font);
         * the dialogs in a .lm-modal-overlay (lm_extended_ui, skin packs) keep the HUD font */
        '.lm-modal-overlay .lm-modal-container{font-family:var(--lm-hud-font,\'Ubuntu\',\'Inter\',sans-serif)}' +
        /* low priority (:where): a window's own rules stay in charge */
        ':where(.lm-w) :focus-visible{outline:2px solid var(--lm-mc,#01d9cc);outline-offset:1px}' +
        ':where(.lm-w) ::-webkit-scrollbar{width:8px;height:8px}' +
        ':where(.lm-w) ::-webkit-scrollbar-thumb{background:' + (mix ? A('var(--lm-tc, #fff)', '22%') : 'rgba(255,255,255,.22)') + ';border-radius:var(--lm-radius-s,4px)}' +
        ':where(.lm-w) ::-webkit-scrollbar-track{background:transparent}';
    (document.head || document.documentElement).appendChild(st);
    lmUiAccent();
    /* the theme sets --lm-mc, --lm-pc, --lm-pc2 and --lm-tc on <html> (ogario.v4.js setMenu*Color) */
    try {
        new MutationObserver(lmUiAccent).observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });
    } catch (e) { }
}
/* --lm-w-acc: the accent as text on window panels (active tabs, primary buttons): the accent itself,
 * or the menu text colour when the accent cannot be read on the panels. With the light "Agar.io"
 * menu preset the accent #5bc0de on the #cccccc panel was 1.3:1 (Theme workshop tab, Discover
 * Open buttons); every theme whose accent reads well on its panels keeps the accent. */
var _lmUiAccSig = '';
function lmUiAccent() {
    var r = document.documentElement, cs = r.style;
    var mc = cs.getPropertyValue('--lm-mc').trim(), pc = cs.getPropertyValue('--lm-pc').trim();
    var pc2 = cs.getPropertyValue('--lm-pc2').trim(), tc = cs.getPropertyValue('--lm-tc').trim();
    var sig = mc + '|' + pc + '|' + pc2 + '|' + tc;
    if (sig === _lmUiAccSig) return;
    _lmUiAccSig = sig;
    var lum = function (c) {
        var m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(c), v;
        if (m) {
            var h = m[1].length === 3 ? m[1].replace(/(.)/g, '$1$1') : m[1];
            v = [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)];
        } else {
            m = /^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/i.exec(c);
            if (!m) return -1;
            v = [+m[1], +m[2], +m[3]];
        }
        v = v.map(function (x) { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); });
        return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
    };
    var ratio = function (a, b) { return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05); };
    var lm = lum(mc), lp = lum(pc), lp2 = lum(pc2), lt = lum(tc);
    var acc = 'var(--lm-mc, #01d9cc)';
    /* unknown colour formats keep the accent, as before */
    if (lm >= 0 && lt >= 0 && (lp >= 0 || lp2 >= 0)) {
        var worst = Math.min(lp >= 0 ? ratio(lm, lp) : 99, lp2 >= 0 ? ratio(lm, lp2) : 99);
        var worstT = Math.min(lp >= 0 ? ratio(lt, lp) : 99, lp2 >= 0 ? ratio(lt, lp2) : 99);
        if (worst < 3 && worstT > worst) acc = 'var(--lm-tc, #ffffff)';
    }
    if (cs.getPropertyValue('--lm-w-acc').trim() !== acc) cs.setProperty('--lm-w-acc', acc);
}
window.lmUiKit = lmUiKit;
//2. Administration Tools
/* Premadeletter39 is supplied by the active language pack. */
function adminstuff() {


    /* Load bannedUID list via a proper script element (not innerHTML/script tag injection) */
    if (!document.getElementById('lm-banneduid-script')) {
        var _bannedScript = document.createElement('script');
        _bannedScript.id = 'lm-banneduid-script';
        _bannedScript.src = 'https://www.legendmod.ml/LMexpress/bannedUID.js';
        document.head.appendChild(_bannedScript);
    }


    /* a menu panel in the current menu theme (it had the colours of the moment it was made, a black
     * border, white text and a fixed 500 x 165 size) */
    lmUiKit();
    if (!document.getElementById('lm-admin-css')) {
        $('head').append($('<style id="lm-admin-css">').text(
            '#administrationtools{width:500px;max-width:calc(100vw - 16px);min-height:165px;box-sizing:border-box;padding-bottom:8px;color:var(--lm-tc,#fff);font-size:var(--lm-w-fs,12px);' + // i18n-ok: CSS
            'background-color:var(--lm-pc,#00243e);background-image:var(--lm-menu-bg,none);background-size:cover;background-position:center;' +
            'border:1px solid var(--lm-pc2,#002f52);border-top:3px solid var(--lm-mc,#01d9cc);border-radius:var(--lm-radius,6px)}' +
            '#administrationtools h5{font-size:var(--lm-w-title,14px);font-weight:700;letter-spacing:1px;text-transform:uppercase}' +
            '#administrationtools p{color:var(--lm-tc2,#fff);font-size:var(--lm-w-fs,12px)}'));
    }
    $("#menu-footer").after('<div id="administrationtools" style="display: none;">' +
        '<div id="administrationtoolshud" style="display:block; margin-left: 10px; margin-right: 10px;">' + //margin-left: 10px"
        '<div id="administrationtoolshud1" align="middle"><h5 class="main-color">' + _lmxE('lmx.ex.adminTools') + '</h5>' +
        '<p align="middle">' + _lmxE('lmx.ex.adminEnter') + '</p>' +
        '<input id="AdminClanSymbol" class="form-control" placeholder="' + _lmxE('lmx.ex.clanSymbol') + '" value="" style="margin-top: 2px; margin-right: 2px; width: 40%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="' + _lmxE('lmx.ex.clanSymbolTip') + '" >' +
        '<input id="AdminPassword" type="password" class="form-control" placeholder="' + _lmxE('roomPass') + '" value="" style="margin-top: 2px; margin-left: 2px; width: 40%; display: inline;" " data-toggle="tooltip" data-placement="top" data-original-title="' + _lmxE('lmx.ex.adminPasswordTip') + '" >' +
        '</div><p align="middle">' + _lmxE('lmx.ex.adminNotice') + '</p>' +
        '</div></div>');
    $("#administrationtoolshud").after('<button id="AdminBacktomenu" onclick="administrationtools(); return false" class="btn btn-danger"  style="margin-left: 10px;" data-original-title="" title="">' + _lmxE('pack.close') + '</button>');
    $("#AdminClanSymbol").val("℄");
    if (localStorage.getItem("AdminClanSymbol") && localStorage.getItem("AdminClanSymbol") != "") {
        $('#AdminClanSymbol').val(localStorage.getItem("AdminClanSymbol"));
    }
    $('#AdminPassword').val(localStorage.getItem("AdminPassword"));

    $("#AdminClanSymbol").blur(function () {
        AdminClanSymbol = $("#AdminClanSymbol").val();
        localStorage.setItem("AdminClanSymbol", AdminClanSymbol);
    });

    $("#AdminPassword").blur(function () {
        AdminPassword = $("#AdminPassword").val();
        if ($("#AdminClanSymbol").val() != "") {
            if (AdminPassword == atob("TEVHRU5ENjk=")) {

                localStorage.setItem("AdminPassword", AdminPassword);
                toastr["warning"]('<b>' + _lmxT('lmx.ex.adminWelcome', ['<font color="yellow">' + $('<div>').text(document.getElementById("nick").value).html() + '</font>']) + '</b>');
                $("#main-menu").show();
                $("#skins-panel").show();
                $("#quick-menu").show();
                $("#exp-bar").show();
                $("#administrationtools").hide();
                $("#minimap-hud").prepend('<div id="administrationtool-hud" class="hud" style="width: 55.5%; height: 30px; padding: 0px; pointer-events: auto; position: absolute; right: 0px; top: -120px; display: block;">' +
                    '<button id="administrationtool0" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 20%; height: 100%;" onclick="banlistLM();"><i id="administrationtool01" class="fa fa-address-book" style="padding-left: 0px;"></i></button>' +
                    '<button id="administrationtool1" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 20%; height: 100%;" onclick="disconnect2min();"><i id="administrationtool11" class="fa fa-bomb" style="padding-left: 0px;"></i></button>' +
                    '<button id="administrationtool2" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 20%; height: 100%;" onclick="disconnectnow();"><i id="administrationtoo21" class="fa fa-ban" style="padding-left: 0px;"></i></button>' +
                    //'<button id="administrationtool3" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 20%; height: 100%;" onclick="showstatsphp();"><i id="administrationtoo31" class="fa fa-database" style="padding-left: 0px;"></i></button>'+	
                    '<button id="administrationtool4" class="btn-link" style="padding: 0px; color: #d6d3d3; width: 20%; height: 100%;" onclick="showstatsphp2();"><i id="administrationtoo41" class="fa fa-wpexplorer" style="padding-left: 0px;"></i></button>' +
                    '</div>');
                //				$("#administrationtool1").attr("data-original-title", "Disconnect enemies in 2 minutes " + $("#AdminClanSymbol").val() + " Symbol" );
                //				$("#administrationtool2").attr("data-original-title", "Disconnect enemies in now " + $("#AdminClanSymbol").val() + " Symbol" );
                return AdminRights = 1;
            }
            else { toastr["info"](_lmxT('lmx.ex.accessDenied')); }
        }
        else { toastr["info"](_lmxT('lmx.ex.registerClanFirst')); }
    });
    //setTimeout(function () {	
    $("#nick").blur(function () {
        if ($('#administrationtool-hud').is(':hidden') || $('#administrationtool-hud').length == 0) {
            if ($("#nick").val() == "℄🌀Jimboy3100" || $("#nick").val() == "℄🌀JustWatchPro") {
                $("#main-menu").hide();
                $("#skins-panel").hide();
                $("#quick-menu").hide();
                $("#exp-bar").hide();
                $("#administrationtools").show();
            }
        }
    });
    //}, 8000);
    if ($("#AdminPassword").val() == "LEGEND69") { $("#AdminPassword").blur(); }
}

function banlistLM() {
    BannedUIDS();
}
function disconnect2min() {
    if (AdminRights == 1) {
        commandMsg = "EU-London";
        otherMsg = ""; //otherMsg=$("#AdminClanSymbol").val();
        dosendadmincommand();
        toastr["info"](_lmxT('lmx.ex.adminRejoinAsk'));
    }
}

function disconnectnow() {
    if (AdminRights == 1) {
        commandMsg = "RU-Russia";
        otherMsg = ""; //otherMsg=$("#AdminClanSymbol").val();
        dosendadmincommand();
        toastr["info"](_lmxT('lmx.ex.adminRejoinNow'));
    }
}
/*function showstatsphp(){
    window.open('https://analytics.google.com/analytics/web/?hl=el&pli=1#realtime/rt-content/a92655864w165988480p166491055/', '_blank');
}*/
function showstatsphp2() {
    window.open(lmThemeUrl('https://www.legendmod.ml/monitor/'), '_blank');
}
function dosendadmincommand() {
    if (AdminRights == 1) {
        if ($('#message-box').css('display') == 'none') { KeyEvent.simulate(13, 13); };
        setTimeout(function () { $("#message").val("https://agar.io/sip=151.80.91.73:1511&?do=" + otherMsg + "&?com=" + commandMsg); KeyEvent.simulate(13, 13); if ($('#message').css('display') == 'block') { KeyEvent.simulate(13, 13); }; if ($('#message-box').css('display') == 'block') { KeyEvent.simulate(13, 13); } }, 100);
    }
    else {
        toastr["info"](_lmxT('lmx.ex.somethingWrong'));
    }
}

function administrationtools() {
    $("#main-menu").show();
    $("#skins-panel").show();
    $("#quick-menu").show();
    $("#exp-bar").show();
    $("#administrationtools").hide();
}

