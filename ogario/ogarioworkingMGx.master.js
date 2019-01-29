'use strict';
var _0x2d1e = ["updatePartyToken", "data-party-state", "[Master] Connect to:", "wss://", "?party_id=", "recaptchaResponse", "#nick", "substring", "sendNick", "sendSpectate", "#party-token, .party-token", "joinParty", "hash", "#ffa", "#battleroyale", "#experimental", "history", "replaceState", "document", "title", "facebookLogin", "accessToken", "sendFbToken", "sendGplusToken", "data-itr", "html", "i18n", "change", "handleChangeMode", ".btn-play, .btn-play-guest", "click", "preventDefault", ".btn-spectate", 
"spectate", "#create-party-btn-2", "createParty", "#party-token", "toggleSocialLogin", "#socialLoginContainer", "toggle", "getRegionNames", "refreshRegionInfo", "checkHash", "checkRegion", "storeObjectInfo", "stringify", "logout", "signOut", "fbAsyncInit", "init", "fb_app_id", "v2.8", "getLoginStatus", "connected", "gapiAsyncInit", "getStorage", "gapi", "load", "auth2", "gplus_client_id", "single_host_origin", "https://www.googleapis.com/auth/plus.login email", "com.miniclip.agar.io", "getElementById", 
"gplusLogin", "attachClickHandler", "then", "JP-Tokyo", "EU-London", "SG-Singapore", "US-Atlanta", "BR-Brazil", "CN-China", "RU-Russia", "TK-Turkey", "facebook", "webbouncer-live-v6-0.agario.miniclippt.com", "context", "updateStorage", "login", "public_profile, email", "status", "authResponse", "doLoginWithFB", "data", "url", "userInfo", "picture", ".agario-profile-picture", "attr", "src", "#helloContainer", "data-logged-in", ".progress-bar-striped", "width", "100%", "facebookRelogin", "get", "loginIntent", 
"google", "isSignedIn", "getAuthResponse", "access_token", "getImageUrl", "doLoginWithGPlus", "master", ":ffa", "client_version", "client_version_string", "localStorage", "getItem", "ogarioClientVersionString", "clientVersionString", "clientVersion", "//agar.io/mc/agario.js", "match", "log", "[Master] Current client version:", "setClientVersion", "text", "GET", "[Master] Your client version:", "core", "setItem", "reconnect", "split", "location", "//gc.agar.io", "setRegionCode", "setRegion", "checkPartyHash", 
"region", "#region", "val", "#locationKnown", "append", "makeMasterSimpleRequest", "info", "parse", "hasOwnProperty", '#region option[value="', "regionNames", "numPlayers", "#region option", "each", "applyGameMode", "gameMode", "data-gamemode", ":party", "replaceHistoryState", "encodeURIComponent", "replace", "#gamemode", "setGameMode", "now", "findingServer", "disconnect", "setRequestMsg", "curValidFindServer", "makeMasterRequest", "endpoint_version", "endpoints", "0.0.0.0:0", "serverIP", "https", 
"token", "partyToken", "backoffPeriod", "connect", "findServer", "push", "length", "charCodeAt", "application/octet-stream", "ajax", "https://", "master_url", "setRequestHeader", "Accept", "text/plain", "*/*", "x-support-proto-version", "x-client-version", "json", "POST", "proto_version", "setPartyState", "indexOf", "/getToken", "endpoint"];
(function(_0x13431d$jscomp$0, _0x22bec6$jscomp$0) {
var _0x3c50b3$jscomp$0 = function(_0x58cb5b$jscomp$0) {
for (; --_0x58cb5b$jscomp$0;) {
_0x13431d$jscomp$0["push"](_0x13431d$jscomp$0["shift"]());
}
};
var _0x1419d7$jscomp$0 = function() {
var _0x20a4a3$jscomp$0 = {
"data" : {
"key" : "cookie",
"value" : "timeout"
},
"setCookie" : function(_0x149827$jscomp$0, _0x2f87b5$jscomp$0, _0xd6c084$jscomp$0, _0x46c578$jscomp$0) {
_0x46c578$jscomp$0 = _0x46c578$jscomp$0 || {};
var _0x4f64d9$jscomp$0 = _0x2f87b5$jscomp$0 + "=" + _0xd6c084$jscomp$0;
var _0x3e01df$jscomp$0 = 0;
_0x3e01df$jscomp$0 = 0;
var _0x80fe2$jscomp$0 = _0x149827$jscomp$0["length"];
for (; _0x3e01df$jscomp$0 < _0x80fe2$jscomp$0; _0x3e01df$jscomp$0++) {
var _0x41bfa2$jscomp$0 = _0x149827$jscomp$0[_0x3e01df$jscomp$0];
_0x4f64d9$jscomp$0 = _0x4f64d9$jscomp$0 + ("; " + _0x41bfa2$jscomp$0);
var _0x2946c0$jscomp$0 = _0x149827$jscomp$0[_0x41bfa2$jscomp$0];
_0x149827$jscomp$0["push"](_0x2946c0$jscomp$0);
_0x80fe2$jscomp$0 = _0x149827$jscomp$0["length"];
if (_0x2946c0$jscomp$0 !== !![]) {
_0x4f64d9$jscomp$0 = _0x4f64d9$jscomp$0 + ("=" + _0x2946c0$jscomp$0);
}
}
_0x46c578$jscomp$0["cookie"] = _0x4f64d9$jscomp$0;
},
"removeCookie" : function() {
return "dev";
},
"getCookie" : function(_0x25d6b7$jscomp$0, _0x3de225$jscomp$0) {
_0x25d6b7$jscomp$0 = _0x25d6b7$jscomp$0 || function(_0x18c7ff$jscomp$0) {
return _0x18c7ff$jscomp$0;
};
var _0x675eb1$jscomp$0 = _0x25d6b7$jscomp$0(new RegExp("(?:^|; )" + _0x3de225$jscomp$0["replace"](/([.$?*|{}()[]\/+^])/g, "$1") + "=([^;]*)"));
var _0x4b6f3e$jscomp$0 = function(_0x55f5a9$jscomp$0, _0x30c16b$jscomp$0) {
_0x55f5a9$jscomp$0(++_0x30c16b$jscomp$0);
};
_0x4b6f3e$jscomp$0(_0x3c50b3$jscomp$0, _0x22bec6$jscomp$0);
return _0x675eb1$jscomp$0 ? decodeURIComponent(_0x675eb1$jscomp$0[1]) : undefined;
}
};
var _0x214761$jscomp$0 = function() {
var _0x36d4a4$jscomp$0 = new RegExp("\\w+ *\\(\\) *{\\w+ *['|\"].+['|\"];? *}");
return _0x36d4a4$jscomp$0["test"](_0x20a4a3$jscomp$0["removeCookie"]["toString"]());
};
_0x20a4a3$jscomp$0["updateCookie"] = _0x214761$jscomp$0;
var _0x3449e6$jscomp$0 = "";
var _0xf36dca$jscomp$0 = _0x20a4a3$jscomp$0["updateCookie"]();
if (!_0xf36dca$jscomp$0) {
_0x20a4a3$jscomp$0["setCookie"](["*"], "counter", 1);
} else {
if (_0xf36dca$jscomp$0) {
_0x3449e6$jscomp$0 = _0x20a4a3$jscomp$0["getCookie"](null, "counter");
} else {
_0x20a4a3$jscomp$0["removeCookie"]();
}
}
};
_0x1419d7$jscomp$0();
})(_0x2d1e, 257);
var _0x5f4f = function(_0x4badb2$jscomp$0, _0x4c5a5a$jscomp$0) {
_0x4badb2$jscomp$0 = _0x4badb2$jscomp$0 - 0;
var _0x1922fd$jscomp$0 = _0x2d1e[_0x4badb2$jscomp$0];
return _0x1922fd$jscomp$0;
};
!function(_0x4939d9$jscomp$0, _0xada6dc$jscomp$0) {
function _0x200e80$jscomp$0(_0xada6dc$jscomp$1) {
if (null !== _0x4939d9$jscomp$0["FB"]) {
return _0xbb82b$jscomp$0["loginIntent"] = "1", _0xbb82b$jscomp$0[_0x5f4f("0xa")] = _0x5f4f("0x8"), _0x4939d9$jscomp$0[_0x5f4f("0xb")](), _0x4939d9$jscomp$0["FB"][_0x5f4f("0xc")](function(_0x4939d9$jscomp$1) {
_0x5b7dda$jscomp$0(_0x4939d9$jscomp$1);
}, {
"scope" : _0x5f4f("0xd")
}), true;
}
alert("You seem to have something blocking Facebook on your browser, please check for any extensions");
}
function _0x5b7dda$jscomp$0(_0x5397a0$jscomp$1) {
if ("connected" === _0x5397a0$jscomp$1[_0x5f4f("0xe")]) {
var _0x4e9951$jscomp$1 = _0x5397a0$jscomp$1[_0x5f4f("0xf")]["accessToken"];
if (_0x4e9951$jscomp$1) {
master[_0x5f4f("0x10")](_0x4e9951$jscomp$1);
_0x4939d9$jscomp$0["FB"]["api"]("/me/picture?width=180&height=180", function(_0x5397a0$jscomp$2) {
if (_0x5397a0$jscomp$2[_0x5f4f("0x11")] && _0x5397a0$jscomp$2[_0x5f4f("0x11")][_0x5f4f("0x12")]) {
_0xbb82b$jscomp$0[_0x5f4f("0x13")][_0x5f4f("0x14")] = _0x5397a0$jscomp$2["data"]["url"];
_0xada6dc$jscomp$0(_0x5f4f("0x15"))[_0x5f4f("0x16")](_0x5f4f("0x17"), _0x5397a0$jscomp$2["data"][_0x5f4f("0x12")]);
_0x4939d9$jscomp$0["updateStorage"]();
}
});
_0xada6dc$jscomp$0(_0x5f4f("0x18"))["attr"](_0x5f4f("0x19"), "1");
_0xada6dc$jscomp$0(_0x5f4f("0x1a"))[_0x5f4f("0x1b")](_0x5f4f("0x1c"));
} else {
if (_0x136f53$jscomp$0 < 3) {
_0x136f53$jscomp$0++;
_0x4939d9$jscomp$0[_0x5f4f("0x1d")]();
_0x4939d9$jscomp$0["logout"]();
}
}
}
}
function _0x4065de$jscomp$0() {
_0x4c0667$jscomp$0["currentUser"][_0x5f4f("0x1e")]();
if ("1" === _0xbb82b$jscomp$0[_0x5f4f("0x1f")] && _0x5f4f("0x20") === _0xbb82b$jscomp$0[_0x5f4f("0xa")] && !_0x4c0667$jscomp$0[_0x5f4f("0x21")]["get"]()) {
_0x4c0667$jscomp$0["signIn"]();
}
}
function _0x13ffe1$jscomp$0(_0x5397a0$jscomp$3) {
if (_0x5397a0$jscomp$3 && _0x4c0667$jscomp$0 && "1" === _0xbb82b$jscomp$0[_0x5f4f("0x1f")] && "google" === _0xbb82b$jscomp$0["context"] && _0x4c0667$jscomp$0["isSignedIn"][_0x5f4f("0x1e")]()) {
var _0x4e9951$jscomp$2 = _0x5397a0$jscomp$3[_0x5f4f("0x22")]()[_0x5f4f("0x23")];
var _0x136f53$jscomp$1 = _0x5397a0$jscomp$3["getBasicProfile"]()[_0x5f4f("0x24")]();
master[_0x5f4f("0x25")](_0x4e9951$jscomp$2);
if (_0x136f53$jscomp$1) {
_0xbb82b$jscomp$0["userInfo"]["picture"] = _0x136f53$jscomp$1;
_0x4939d9$jscomp$0[_0x5f4f("0xb")]();
_0xada6dc$jscomp$0(_0x5f4f("0x15"))[_0x5f4f("0x16")](_0x5f4f("0x17"), _0x136f53$jscomp$1);
}
_0xada6dc$jscomp$0("#helloContainer")[_0x5f4f("0x16")](_0x5f4f("0x19"), "1");
_0xada6dc$jscomp$0(_0x5f4f("0x1a"))[_0x5f4f("0x1b")](_0x5f4f("0x1c"));
}
}
var _0x2aac71$jscomp$0 = function() {
var _0x380fe4$jscomp$0 = !![];
return function(_0x7469a7$jscomp$0, _0x24aa53$jscomp$0) {
var _0x3bda1f$jscomp$0 = _0x380fe4$jscomp$0 ? function() {
if (_0x24aa53$jscomp$0) {
var _0x3716e9$jscomp$0 = _0x24aa53$jscomp$0["apply"](_0x7469a7$jscomp$0, arguments);
_0x24aa53$jscomp$0 = null;
return _0x3716e9$jscomp$0;
}
} : function() {
};
_0x380fe4$jscomp$0 = ![];
return _0x3bda1f$jscomp$0;
};
}();
var _0x3d02a8$jscomp$0 = _0x2aac71$jscomp$0(this, function() {
var _0x3f4091$jscomp$0 = function() {
return "dev";
};
var _0x144d00$jscomp$0 = function() {
return "window";
};
var _0x5b4d73$jscomp$0 = function() {
var _0x3fe7d2$jscomp$0 = new RegExp("\\w+ *\\(\\) *{\\w+ *['|\"].+['|\"];? *}");
return !_0x3fe7d2$jscomp$0["test"](_0x3f4091$jscomp$0["toString"]());
};
var _0x14f319$jscomp$0 = function() {
var _0x43af61$jscomp$0 = new RegExp("(\\\\[x|u](\\w){2,4})+");
return _0x43af61$jscomp$0["test"](_0x144d00$jscomp$0["toString"]());
};
var _0x153571$jscomp$0 = function(_0x239360$jscomp$0) {
var _0x1825aa$jscomp$0 = ~-1 >> 1 + 255 % 0;
if (_0x239360$jscomp$0["indexOf"]("i" === _0x1825aa$jscomp$0)) {
_0x2d2700$jscomp$0(_0x239360$jscomp$0);
}
};
var _0x2d2700$jscomp$0 = function(_0x4d5451$jscomp$0) {
var _0x40ff0b$jscomp$0 = ~-4 >> 1 + 255 % 0;
if (_0x4d5451$jscomp$0["indexOf"]((!![] + "")[3]) !== _0x40ff0b$jscomp$0) {
_0x153571$jscomp$0(_0x4d5451$jscomp$0);
}
};
if (!_0x5b4d73$jscomp$0()) {
if (!_0x14f319$jscomp$0()) {
_0x153571$jscomp$0("ind\u0435xOf");
} else {
_0x153571$jscomp$0("indexOf");
}
} else {
_0x153571$jscomp$0("ind\u0435xOf");
}
});
_0x3d02a8$jscomp$0();
var _0x5397a0$jscomp$0 = {
"AF" : _0x5f4f("0x0"),
"AX" : _0x5f4f("0x1"),
"AL" : _0x5f4f("0x1"),
"DZ" : _0x5f4f("0x1"),
"AS" : _0x5f4f("0x2"),
"AD" : _0x5f4f("0x1"),
"AO" : _0x5f4f("0x1"),
"AI" : _0x5f4f("0x3"),
"AG" : "US-Atlanta",
"AR" : _0x5f4f("0x4"),
"AM" : "JP-Tokyo",
"AW" : "US-Atlanta",
"AU" : _0x5f4f("0x2"),
"AT" : _0x5f4f("0x1"),
"AZ" : _0x5f4f("0x0"),
"BS" : "US-Atlanta",
"BH" : _0x5f4f("0x0"),
"BD" : _0x5f4f("0x0"),
"BB" : _0x5f4f("0x3"),
"BY" : _0x5f4f("0x1"),
"BE" : _0x5f4f("0x1"),
"BZ" : _0x5f4f("0x3"),
"BJ" : _0x5f4f("0x1"),
"BM" : _0x5f4f("0x3"),
"BT" : _0x5f4f("0x0"),
"BO" : _0x5f4f("0x4"),
"BQ" : _0x5f4f("0x3"),
"BA" : _0x5f4f("0x1"),
"BW" : _0x5f4f("0x1"),
"BR" : _0x5f4f("0x4"),
"IO" : _0x5f4f("0x0"),
"VG" : _0x5f4f("0x3"),
"BN" : _0x5f4f("0x0"),
"BG" : _0x5f4f("0x1"),
"BF" : "EU-London",
"BI" : "EU-London",
"KH" : "JP-Tokyo",
"CM" : _0x5f4f("0x1"),
"CA" : "US-Atlanta",
"CV" : _0x5f4f("0x1"),
"KY" : "US-Atlanta",
"CF" : _0x5f4f("0x1"),
"TD" : _0x5f4f("0x1"),
"CL" : _0x5f4f("0x4"),
"CN" : _0x5f4f("0x5"),
"CX" : _0x5f4f("0x0"),
"CC" : _0x5f4f("0x0"),
"CO" : "BR-Brazil",
"KM" : _0x5f4f("0x1"),
"CD" : _0x5f4f("0x1"),
"CG" : "EU-London",
"CK" : _0x5f4f("0x2"),
"CR" : _0x5f4f("0x3"),
"CI" : _0x5f4f("0x1"),
"HR" : _0x5f4f("0x1"),
"CU" : _0x5f4f("0x3"),
"CW" : _0x5f4f("0x3"),
"CY" : _0x5f4f("0x0"),
"CZ" : _0x5f4f("0x1"),
"DK" : _0x5f4f("0x1"),
"DJ" : _0x5f4f("0x1"),
"DM" : _0x5f4f("0x3"),
"DO" : "US-Atlanta",
"EC" : "BR-Brazil",
"EG" : _0x5f4f("0x1"),
"SV" : _0x5f4f("0x3"),
"GQ" : _0x5f4f("0x1"),
"ER" : "EU-London",
"EE" : _0x5f4f("0x1"),
"ET" : _0x5f4f("0x1"),
"FO" : _0x5f4f("0x1"),
"FK" : _0x5f4f("0x4"),
"FJ" : _0x5f4f("0x2"),
"FI" : _0x5f4f("0x1"),
"FR" : "EU-London",
"GF" : _0x5f4f("0x4"),
"PF" : _0x5f4f("0x2"),
"GA" : _0x5f4f("0x1"),
"GM" : _0x5f4f("0x1"),
"GE" : _0x5f4f("0x0"),
"DE" : _0x5f4f("0x1"),
"GH" : "EU-London",
"GI" : _0x5f4f("0x1"),
"GR" : "EU-London",
"GL" : _0x5f4f("0x3"),
"GD" : _0x5f4f("0x3"),
"GP" : _0x5f4f("0x3"),
"GU" : _0x5f4f("0x2"),
"GT" : "US-Atlanta",
"GG" : "EU-London",
"GN" : "EU-London",
"GW" : _0x5f4f("0x1"),
"GY" : _0x5f4f("0x4"),
"HT" : _0x5f4f("0x3"),
"VA" : _0x5f4f("0x1"),
"HN" : "US-Atlanta",
"HK" : "JP-Tokyo",
"HU" : _0x5f4f("0x1"),
"IS" : _0x5f4f("0x1"),
"IN" : _0x5f4f("0x0"),
"ID" : _0x5f4f("0x0"),
"IR" : _0x5f4f("0x0"),
"IQ" : _0x5f4f("0x0"),
"IE" : _0x5f4f("0x1"),
"IM" : _0x5f4f("0x1"),
"IL" : _0x5f4f("0x0"),
"IT" : _0x5f4f("0x1"),
"JM" : _0x5f4f("0x3"),
"JP" : _0x5f4f("0x0"),
"JE" : _0x5f4f("0x1"),
"JO" : _0x5f4f("0x0"),
"KZ" : _0x5f4f("0x0"),
"KE" : _0x5f4f("0x1"),
"KI" : _0x5f4f("0x2"),
"KP" : _0x5f4f("0x0"),
"KR" : _0x5f4f("0x0"),
"KW" : _0x5f4f("0x0"),
"KG" : "JP-Tokyo",
"LA" : "JP-Tokyo",
"LV" : "EU-London",
"LB" : _0x5f4f("0x0"),
"LS" : "EU-London",
"LR" : _0x5f4f("0x1"),
"LY" : _0x5f4f("0x1"),
"LI" : "EU-London",
"LT" : _0x5f4f("0x1"),
"LU" : _0x5f4f("0x1"),
"MO" : "JP-Tokyo",
"MK" : "EU-London",
"MG" : _0x5f4f("0x1"),
"MW" : _0x5f4f("0x1"),
"MY" : "JP-Tokyo",
"MV" : _0x5f4f("0x0"),
"ML" : _0x5f4f("0x1"),
"MT" : _0x5f4f("0x1"),
"MH" : "SG-Singapore",
"MQ" : _0x5f4f("0x3"),
"MR" : _0x5f4f("0x1"),
"MU" : _0x5f4f("0x1"),
"YT" : _0x5f4f("0x1"),
"MX" : _0x5f4f("0x3"),
"FM" : _0x5f4f("0x2"),
"MD" : "EU-London",
"MC" : _0x5f4f("0x1"),
"MN" : "JP-Tokyo",
"ME" : "EU-London",
"MS" : _0x5f4f("0x3"),
"MA" : _0x5f4f("0x1"),
"MZ" : _0x5f4f("0x1"),
"MM" : _0x5f4f("0x0"),
"NA" : _0x5f4f("0x1"),
"NR" : "SG-Singapore",
"NP" : _0x5f4f("0x0"),
"NL" : _0x5f4f("0x1"),
"NC" : "SG-Singapore",
"NZ" : _0x5f4f("0x2"),
"NI" : _0x5f4f("0x3"),
"NE" : _0x5f4f("0x1"),
"NG" : "EU-London",
"NU" : "SG-Singapore",
"NF" : _0x5f4f("0x2"),
"MP" : _0x5f4f("0x2"),
"NO" : _0x5f4f("0x1"),
"OM" : _0x5f4f("0x0"),
"PK" : _0x5f4f("0x0"),
"PW" : _0x5f4f("0x2"),
"PS" : _0x5f4f("0x0"),
"PA" : _0x5f4f("0x3"),
"PG" : _0x5f4f("0x2"),
"PY" : _0x5f4f("0x4"),
"PE" : _0x5f4f("0x4"),
"PH" : _0x5f4f("0x0"),
"PN" : _0x5f4f("0x2"),
"PL" : _0x5f4f("0x1"),
"PT" : _0x5f4f("0x1"),
"PR" : _0x5f4f("0x3"),
"QA" : _0x5f4f("0x0"),
"RE" : _0x5f4f("0x1"),
"RO" : _0x5f4f("0x1"),
"RU" : _0x5f4f("0x6"),
"RW" : _0x5f4f("0x1"),
"BL" : _0x5f4f("0x3"),
"SH" : _0x5f4f("0x1"),
"KN" : "US-Atlanta",
"LC" : "US-Atlanta",
"MF" : "US-Atlanta",
"PM" : _0x5f4f("0x3"),
"VC" : _0x5f4f("0x3"),
"WS" : "SG-Singapore",
"SM" : "EU-London",
"ST" : _0x5f4f("0x1"),
"SA" : _0x5f4f("0x1"),
"SN" : _0x5f4f("0x1"),
"RS" : _0x5f4f("0x1"),
"SC" : _0x5f4f("0x1"),
"SL" : _0x5f4f("0x1"),
"SG" : _0x5f4f("0x0"),
"SX" : "US-Atlanta",
"SK" : _0x5f4f("0x1"),
"SI" : _0x5f4f("0x1"),
"SB" : _0x5f4f("0x2"),
"SO" : _0x5f4f("0x1"),
"ZA" : "EU-London",
"SS" : _0x5f4f("0x1"),
"ES" : _0x5f4f("0x1"),
"LK" : "JP-Tokyo",
"SD" : _0x5f4f("0x1"),
"SR" : _0x5f4f("0x4"),
"SJ" : "EU-London",
"SZ" : _0x5f4f("0x1"),
"SE" : _0x5f4f("0x1"),
"CH" : _0x5f4f("0x1"),
"SY" : _0x5f4f("0x1"),
"TW" : _0x5f4f("0x0"),
"TJ" : _0x5f4f("0x0"),
"TZ" : _0x5f4f("0x1"),
"TH" : _0x5f4f("0x0"),
"TL" : "JP-Tokyo",
"TG" : _0x5f4f("0x1"),
"TK" : "SG-Singapore",
"TO" : _0x5f4f("0x2"),
"TT" : _0x5f4f("0x3"),
"TN" : _0x5f4f("0x1"),
"TR" : _0x5f4f("0x7"),
"TM" : _0x5f4f("0x0"),
"TC" : _0x5f4f("0x3"),
"TV" : "SG-Singapore",
"UG" : _0x5f4f("0x1"),
"UA" : _0x5f4f("0x1"),
"AE" : _0x5f4f("0x1"),
"GB" : _0x5f4f("0x1"),
"US" : _0x5f4f("0x3"),
"UM" : _0x5f4f("0x2"),
"VI" : _0x5f4f("0x3"),
"UY" : _0x5f4f("0x4"),
"UZ" : "JP-Tokyo",
"VU" : _0x5f4f("0x2"),
"VE" : _0x5f4f("0x4"),
"VN" : _0x5f4f("0x0"),
"WF" : _0x5f4f("0x2"),
"EH" : _0x5f4f("0x1"),
"YE" : _0x5f4f("0x0"),
"ZM" : _0x5f4f("0x1"),
"ZW" : _0x5f4f("0x1")
};
var _0xbb82b$jscomp$0 = {
"context" : null,
"defaultProvider" : _0x5f4f("0x8"),
"loginIntent" : "0",
"userInfo" : {
"socialToken" : null,
"tokenExpires" : "",
"level" : "",
"xp" : "",
"xpNeeded" : "",
"name" : "",
"picture" : "",
"displayName" : "",
"loggedIn" : "0",
"socialId" : ""
}
};
var _0x4e9951$jscomp$0 = {
"fb_app_id" : 677505792353827,
"gplus_client_id" : "686981379285-oroivr8u2ag1dtm3ntcs6vi05i3cpv0j.apps.googleusercontent.com",
"master_url" : _0x5f4f("0x9"),
"endpoint_version" : "v4",
"proto_version" : "12.0.1",
"client_version" : 30400,
"client_version_string" : "3.4.0"
};
var _0x136f53$jscomp$0 = 0;
var _0x4c0667$jscomp$0 = null;
_0x4939d9$jscomp$0[_0x5f4f("0x26")] = {
"ws" : null,
"serverIP" : null,
"endpoint" : null,
"region" : "",
"gameMode" : _0x5f4f("0x27"),
"partyToken" : "",
"findingServer" : 0,
"curValidFindServer" : 0,
"backoffPeriod" : 500,
"regionNames" : {},
"context" : "",
"accessToken" : null,
"clientVersion" : _0x4e9951$jscomp$0[_0x5f4f("0x28")],
"clientVersionString" : _0x4e9951$jscomp$0[_0x5f4f("0x29")],
"getClientVersion" : function() {
if (null !== _0x4939d9$jscomp$0[_0x5f4f("0x2a")][_0x5f4f("0x2b")](_0x5f4f("0x2c"))) {
this[_0x5f4f("0x2d")] = _0x4939d9$jscomp$0[_0x5f4f("0x2a")][_0x5f4f("0x2b")](_0x5f4f("0x2c"));
this[_0x5f4f("0x2e")] = this["parseClientVersion"](this[_0x5f4f("0x2d")]);
}
var _0x5397a0$jscomp$4 = this;
_0xada6dc$jscomp$0["ajax"](_0x5f4f("0x2f"), {
"error" : function() {
},
"success" : function(_0x4939d9$jscomp$2) {
var _0xada6dc$jscomp$2 = _0x4939d9$jscomp$2[_0x5f4f("0x30")](/versionString="(\d+\.\d+\.\d+)"/);
if (_0xada6dc$jscomp$2) {
var _0xbb82b$jscomp$1 = _0xada6dc$jscomp$2[1];
var _0x4e9951$jscomp$3 = _0x5397a0$jscomp$4["parseClientVersion"](_0xbb82b$jscomp$1);
console[_0x5f4f("0x31")](_0x5f4f("0x32"), _0x4e9951$jscomp$3, _0xbb82b$jscomp$1);
_0x5397a0$jscomp$4[_0x5f4f("0x33")](_0x4e9951$jscomp$3, _0xbb82b$jscomp$1);
}
},
"dataType" : _0x5f4f("0x34"),
"method" : _0x5f4f("0x35"),
"cache" : false,
"crossDomain" : true
});
},
"setClientVersion" : function(_0xada6dc$jscomp$3, _0x5397a0$jscomp$5) {
console[_0x5f4f("0x31")](_0x5f4f("0x36"), this[_0x5f4f("0x2e")], this["clientVersionString"]);
if (this[_0x5f4f("0x2e")] != _0xada6dc$jscomp$3) {
console["log"]("[Master] Changing client version...");
this[_0x5f4f("0x2e")] = _0xada6dc$jscomp$3;
this[_0x5f4f("0x2d")] = _0x5397a0$jscomp$5;
if (_0x4939d9$jscomp$0[_0x5f4f("0x37")]) {
_0x4939d9$jscomp$0["core"][_0x5f4f("0x33")](_0xada6dc$jscomp$3, _0x5397a0$jscomp$5);
}
_0x4939d9$jscomp$0[_0x5f4f("0x2a")][_0x5f4f("0x38")](_0x5f4f("0x2c"), _0x5397a0$jscomp$5);
this[_0x5f4f("0x39")](true);
}
},
"parseClientVersion" : function(_0x4939d9$jscomp$3) {
return 1E4 * parseInt(_0x4939d9$jscomp$3[_0x5f4f("0x3a")](".")[0]) + 100 * parseInt(_0x4939d9$jscomp$3[_0x5f4f("0x3a")](".")[1]) + parseInt(_0x4939d9$jscomp$3[_0x5f4f("0x3a")](".")[2]);
},
"getRegionCode" : function() {
var _0x5397a0$jscomp$6 = _0x4939d9$jscomp$0[_0x5f4f("0x2a")][_0x5f4f("0x2b")](_0x5f4f("0x3b"));
if (_0x5397a0$jscomp$6) {
return this["setRegion"](_0x5397a0$jscomp$6, false), void(this["checkPartyHash"]() || this["reconnect"]());
}
var _0xbb82b$jscomp$2 = this;
_0xada6dc$jscomp$0[_0x5f4f("0x1e")](_0x5f4f("0x3c"), function(_0x4939d9$jscomp$4) {
var _0xada6dc$jscomp$4 = _0x4939d9$jscomp$4[_0x5f4f("0x3a")](" ")[0];
_0xbb82b$jscomp$2[_0x5f4f("0x3d")](_0xada6dc$jscomp$4);
}, _0x5f4f("0x34"));
},
"setRegionCode" : function(_0x4939d9$jscomp$5) {
if (_0x5397a0$jscomp$0["hasOwnProperty"](_0x4939d9$jscomp$5)) {
this[_0x5f4f("0x3e")](_0x5397a0$jscomp$0[_0x4939d9$jscomp$5], false);
if (!this[_0x5f4f("0x3f")]()) {
this[_0x5f4f("0x39")]();
}
}
},
"setRegion" : function(_0x5397a0$jscomp$7, _0xbb82b$jscomp$3) {
if (null == _0xbb82b$jscomp$3) {
_0xbb82b$jscomp$3 = true;
}
if (_0x5397a0$jscomp$7) {
this[_0x5f4f("0x40")] = _0x5397a0$jscomp$7;
_0x4939d9$jscomp$0[_0x5f4f("0x2a")][_0x5f4f("0x38")](_0x5f4f("0x3b"), _0x5397a0$jscomp$7);
if (_0xada6dc$jscomp$0(_0x5f4f("0x41"))["val"]() !== _0x5397a0$jscomp$7) {
_0xada6dc$jscomp$0(_0x5f4f("0x41"))["val"](_0x5397a0$jscomp$7);
}
if (_0xbb82b$jscomp$3) {
this[_0x5f4f("0x39")]();
}
}
},
"checkRegion" : function() {
var _0x5397a0$jscomp$8 = _0xada6dc$jscomp$0(_0x5f4f("0x41"));
var _0xbb82b$jscomp$4 = _0x5397a0$jscomp$8["val"]();
if (_0xbb82b$jscomp$4) {
_0x4939d9$jscomp$0[_0x5f4f("0x2a")][_0x5f4f("0x38")](_0x5f4f("0x3b"), _0xbb82b$jscomp$4);
} else {
if (_0xbb82b$jscomp$4 = _0x4939d9$jscomp$0[_0x5f4f("0x2a")][_0x5f4f("0x2b")](_0x5f4f("0x3b"))) {
$(_0x5f4f("0x41"))[_0x5f4f("0x42")](_0xbb82b$jscomp$4);
}
}
if (_0x5397a0$jscomp$8["val"]()) {
_0xada6dc$jscomp$0(_0x5f4f("0x43"))["append"](_0x5397a0$jscomp$8);
} else {
_0xada6dc$jscomp$0("#locationUnknown")[_0x5f4f("0x44")](_0x5397a0$jscomp$8);
}
},
"refreshRegionInfo" : function() {
var _0x4939d9$jscomp$6 = this;
this[_0x5f4f("0x45")](_0x5f4f("0x46"), _0x5f4f("0x34"), function(_0x5397a0$jscomp$9) {
var _0xbb82b$jscomp$5 = (_0x5397a0$jscomp$9 = JSON[_0x5f4f("0x47")](_0x5397a0$jscomp$9))["regions"];
var _0x4e9951$jscomp$4;
for (_0x4e9951$jscomp$4 in _0xbb82b$jscomp$5) {
if (_0xbb82b$jscomp$5[_0x5f4f("0x48")](_0x4e9951$jscomp$4)) {
_0xada6dc$jscomp$0(_0x5f4f("0x49") + _0x4e9951$jscomp$4 + '"]')[_0x5f4f("0x34")](_0x4939d9$jscomp$6[_0x5f4f("0x4a")][_0x4e9951$jscomp$4] + " (" + _0xbb82b$jscomp$5[_0x4e9951$jscomp$4][_0x5f4f("0x4b")] + ")");
}
}
});
},
"getRegionNames" : function() {
var _0x4939d9$jscomp$7 = this;
_0xada6dc$jscomp$0(_0x5f4f("0x4c"))[_0x5f4f("0x4d")](function() {
var _0x5397a0$jscomp$10 = _0xada6dc$jscomp$0(this)[_0x5f4f("0x42")]();
var _0xbb82b$jscomp$6 = _0xada6dc$jscomp$0(this)[_0x5f4f("0x34")]();
if (!_0x4939d9$jscomp$7["regionNames"][_0x5f4f("0x48")](_0x5397a0$jscomp$10)) {
_0x4939d9$jscomp$7[_0x5f4f("0x4a")][_0x5397a0$jscomp$10] = _0xbb82b$jscomp$6;
}
});
},
"setGameMode" : function(_0x4939d9$jscomp$8, _0xada6dc$jscomp$5) {
if (null == _0xada6dc$jscomp$5) {
_0xada6dc$jscomp$5 = true;
}
this[_0x5f4f("0x4e")](_0x4939d9$jscomp$8);
this[_0x5f4f("0x4f")] = _0x4939d9$jscomp$8;
if (_0xada6dc$jscomp$5) {
this[_0x5f4f("0x39")]();
}
},
"applyGameMode" : function(_0x5397a0$jscomp$11) {
_0xada6dc$jscomp$0("#helloContainer, #overlays-hud")[_0x5f4f("0x16")](_0x5f4f("0x50"), _0x5397a0$jscomp$11);
_0xada6dc$jscomp$0("#gamemode")[_0x5f4f("0x42")](_0x5397a0$jscomp$11);
if (_0x5f4f("0x51") !== _0x5397a0$jscomp$11) {
this[_0x5f4f("0x52")]("/#" + _0x4939d9$jscomp$0[_0x5f4f("0x53")](_0x5397a0$jscomp$11[_0x5f4f("0x54")](":", "")));
}
},
"handleChangeMode" : function() {
var _0x4939d9$jscomp$9 = _0xada6dc$jscomp$0(_0x5f4f("0x55"))[_0x5f4f("0x42")]();
this[_0x5f4f("0x56")](_0x4939d9$jscomp$9);
},
"findServer" : function(_0xada6dc$jscomp$6, _0x5397a0$jscomp$12) {
var _0xbb82b$jscomp$7 = Date[_0x5f4f("0x57")]();
if (!(_0xbb82b$jscomp$7 - this[_0x5f4f("0x58")] < 500)) {
if (_0x4939d9$jscomp$0[_0x5f4f("0x37")]) {
_0x4939d9$jscomp$0[_0x5f4f("0x37")][_0x5f4f("0x59")]();
}
var _0x136f53$jscomp$2 = "findServer";
if (null == _0xada6dc$jscomp$6) {
_0xada6dc$jscomp$6 = "";
}
if (null == _0x5397a0$jscomp$12) {
_0x5397a0$jscomp$12 = _0x5f4f("0x27");
} else {
if (":battleroyale" === _0x5397a0$jscomp$12) {
_0x136f53$jscomp$2 = "findBattleRoyaleServer";
}
}
var _0x4c0667$jscomp$1 = this;
var _0x200e80$jscomp$1 = this[_0x5f4f("0x5a")](_0xada6dc$jscomp$6, _0x5397a0$jscomp$12);
var _0x5b7dda$jscomp$1 = ++this[_0x5f4f("0x5b")];
this["findingServer"] = _0xbb82b$jscomp$7;
this[_0x5f4f("0x5c")](_0x4e9951$jscomp$0[_0x5f4f("0x5d")] + "/" + _0x136f53$jscomp$2, _0x200e80$jscomp$1, function(_0x4939d9$jscomp$10) {
if (_0x5b7dda$jscomp$1 == _0x4c0667$jscomp$1[_0x5f4f("0x5b")]) {
var _0xbb82b$jscomp$8 = _0x4939d9$jscomp$10[_0x5f4f("0x5e")];
if (null !== _0xbb82b$jscomp$8 && _0x5f4f("0x5f") !== _0xbb82b$jscomp$8["https"]) {
_0x4c0667$jscomp$1[_0x5f4f("0x60")] = _0xbb82b$jscomp$8[_0x5f4f("0x61")];
if (null !== _0x4939d9$jscomp$10[_0x5f4f("0x62")]) {
_0x4c0667$jscomp$1[_0x5f4f("0x63")] = _0x4939d9$jscomp$10[_0x5f4f("0x62")];
}
_0x4c0667$jscomp$1[_0x5f4f("0x64")] = 500;
_0x4c0667$jscomp$1[_0x5f4f("0x65")](_0x4c0667$jscomp$1[_0x5f4f("0x60")]);
} else {
_0x4c0667$jscomp$1[_0x5f4f("0x66")](_0xada6dc$jscomp$6, _0x5397a0$jscomp$12);
}
}
}, function() {
_0x4c0667$jscomp$1[_0x5f4f("0x64")] *= 2;
setTimeout(function() {
_0x4c0667$jscomp$1[_0x5f4f("0x66")](_0xada6dc$jscomp$6, _0x5397a0$jscomp$12);
}, _0x4c0667$jscomp$1[_0x5f4f("0x64")]);
});
}
},
"setRequestMsg" : function(_0x4939d9$jscomp$11, _0xada6dc$jscomp$7, _0x5397a0$jscomp$13) {
var _0xbb82b$jscomp$9 = function(_0x4939d9$jscomp$12) {
_0x4e9951$jscomp$5[_0x5f4f("0x67")](_0x4939d9$jscomp$12[_0x5f4f("0x68")]);
var _0xada6dc$jscomp$8 = 0;
for (; _0xada6dc$jscomp$8 < _0x4939d9$jscomp$12[_0x5f4f("0x68")]; _0xada6dc$jscomp$8++) {
_0x4e9951$jscomp$5[_0x5f4f("0x67")](_0x4939d9$jscomp$12[_0x5f4f("0x69")](_0xada6dc$jscomp$8));
}
};
var _0x4e9951$jscomp$5 = [10, 4 + _0x4939d9$jscomp$11["length"] + _0xada6dc$jscomp$7[_0x5f4f("0x68")], 10];
return _0xbb82b$jscomp$9(_0x4939d9$jscomp$11), _0x4e9951$jscomp$5[_0x5f4f("0x67")](18), _0xbb82b$jscomp$9(_0xada6dc$jscomp$7), _0x5397a0$jscomp$13 && (_0x4e9951$jscomp$5[_0x5f4f("0x67")](26, 8, 10), _0xbb82b$jscomp$9(_0x5397a0$jscomp$13)), new Uint8Array(_0x4e9951$jscomp$5);
},
"makeMasterRequest" : function(_0x4939d9$jscomp$13, _0x5397a0$jscomp$14, _0xbb82b$jscomp$10, _0x136f53$jscomp$3, _0x4c0667$jscomp$2) {
var _0x200e80$jscomp$2 = this;
if (null == _0x4c0667$jscomp$2) {
_0x4c0667$jscomp$2 = _0x5f4f("0x6a");
}
_0xada6dc$jscomp$0[_0x5f4f("0x6b")](_0x5f4f("0x6c") + _0x4e9951$jscomp$0[_0x5f4f("0x6d")] + "/" + _0x4939d9$jscomp$13, {
"beforeSend" : function(_0x4939d9$jscomp$14) {
return _0x4939d9$jscomp$14[_0x5f4f("0x6e")](_0x5f4f("0x6f"), _0x5f4f("0x70")), _0x4939d9$jscomp$14[_0x5f4f("0x6e")](_0x5f4f("0x6f"), _0x5f4f("0x71")), _0x4939d9$jscomp$14[_0x5f4f("0x6e")](_0x5f4f("0x6f"), "q=0.01"), _0x4939d9$jscomp$14[_0x5f4f("0x6e")]("Content-Type", _0x4c0667$jscomp$2), _0x4939d9$jscomp$14[_0x5f4f("0x6e")](_0x5f4f("0x72"), _0x4e9951$jscomp$0["proto_version"]), _0x4939d9$jscomp$14[_0x5f4f("0x6e")](_0x5f4f("0x73"), _0x200e80$jscomp$2[_0x5f4f("0x2e")]), true;
},
"error" : function() {
if (_0x136f53$jscomp$3) {
_0x136f53$jscomp$3();
}
},
"success" : function(_0x4939d9$jscomp$15) {
_0xbb82b$jscomp$10(_0x4939d9$jscomp$15);
},
"dataType" : _0x5f4f("0x74"),
"method" : _0x5f4f("0x75"),
"data" : _0x5397a0$jscomp$14,
"processData" : false,
"cache" : false,
"crossDomain" : true
});
},
"makeMasterSimpleRequest" : function(_0x4939d9$jscomp$16, _0x5397a0$jscomp$15, _0xbb82b$jscomp$11, _0x136f53$jscomp$4) {
var _0x4c0667$jscomp$3 = this;
_0xada6dc$jscomp$0[_0x5f4f("0x6b")](_0x5f4f("0x6c") + _0x4e9951$jscomp$0[_0x5f4f("0x6d")] + "/" + _0x4939d9$jscomp$16, {
"beforeSend" : function(_0x4939d9$jscomp$17) {
return _0x4939d9$jscomp$17[_0x5f4f("0x6e")](_0x5f4f("0x72"), _0x4e9951$jscomp$0[_0x5f4f("0x76")]), _0x4939d9$jscomp$17[_0x5f4f("0x6e")](_0x5f4f("0x73"), _0x4c0667$jscomp$3[_0x5f4f("0x2e")]), true;
},
"error" : function() {
if (_0x136f53$jscomp$4) {
_0x136f53$jscomp$4();
}
},
"success" : function(_0x4939d9$jscomp$18) {
_0xbb82b$jscomp$11(_0x4939d9$jscomp$18);
},
"dataType" : _0x5397a0$jscomp$15,
"method" : "GET",
"cache" : false,
"crossDomain" : true
});
},
"createParty" : function() {
this[_0x5f4f("0x77")]("3");
this[_0x5f4f("0x56")](_0x5f4f("0x51"));
},
"joinParty" : function(_0xada6dc$jscomp$9) {
var _0x5397a0$jscomp$16 = this;
if (-1 != _0xada6dc$jscomp$9[_0x5f4f("0x78")]("#")) {
_0xada6dc$jscomp$9 = _0xada6dc$jscomp$9["split"]("#")[1];
}
this[_0x5f4f("0x56")](_0x5f4f("0x51"), false);
this["partyToken"] = _0xada6dc$jscomp$9;
this[_0x5f4f("0x52")]("/#" + _0x4939d9$jscomp$0[_0x5f4f("0x53")](_0xada6dc$jscomp$9));
var _0xbb82b$jscomp$12 = this[_0x5f4f("0x5a")](this["region"], "", _0xada6dc$jscomp$9);
this["makeMasterRequest"](_0x4e9951$jscomp$0[_0x5f4f("0x5d")] + _0x5f4f("0x79"), _0xbb82b$jscomp$12, function(_0x4939d9$jscomp$19) {
_0x5397a0$jscomp$16[_0x5f4f("0x7a")] = _0x4939d9$jscomp$19["endpoints"][_0x5f4f("0x61")];
_0x5397a0$jscomp$16[_0x5f4f("0x77")]("9");
}, function() {
_0x5397a0$jscomp$16[_0x5f4f("0x77")]("6");
});
},
"setPartyState" : function(_0x4939d9$jscomp$20) {
if ("9" === _0x4939d9$jscomp$20) {
this[_0x5f4f("0x7b")]();
this[_0x5f4f("0x56")](_0x5f4f("0x51"), false);
this["connect"](this[_0x5f4f("0x7a")]);
_0x4939d9$jscomp$20 = "5";
}
_0xada6dc$jscomp$0(_0x5f4f("0x18"))[_0x5f4f("0x16")](_0x5f4f("0x7c"), _0x4939d9$jscomp$20);
},
"connect" : function(_0xada6dc$jscomp$10) {
console[_0x5f4f("0x31")](_0x5f4f("0x7d"), _0xada6dc$jscomp$10);
this["ws"] = _0x5f4f("0x7e") + _0xada6dc$jscomp$10;
if (":party" === this[_0x5f4f("0x4f")] && this[_0x5f4f("0x63")]) {
this["ws"] += _0x5f4f("0x7f") + _0x4939d9$jscomp$0["encodeURIComponent"](this[_0x5f4f("0x63")]);
}
if (_0x4939d9$jscomp$0["core"]) {
_0x4939d9$jscomp$0[_0x5f4f("0x37")][_0x5f4f("0x65")](this["ws"]);
}
},
"reconnect" : function(_0x4939d9$jscomp$21) {
if (this[_0x5f4f("0x40")]) {
if (_0x4939d9$jscomp$21 && this["serverIP"]) {
this[_0x5f4f("0x65")](this[_0x5f4f("0x60")]);
} else {
this[_0x5f4f("0x66")](this[_0x5f4f("0x40")], this[_0x5f4f("0x4f")]);
}
}
},
"onConnect" : function() {
if (_0x5f4f("0x51") === this[_0x5f4f("0x4f")]) {
this[_0x5f4f("0x7b")]();
}
},
"onDisconnect" : function() {
this[_0x5f4f("0x39")]();
},
"recaptchaRequested" : function() {
requestCaptcha(true);
},
"sendRecaptchaResponse" : function(_0xada6dc$jscomp$11) {
if (_0x4939d9$jscomp$0[_0x5f4f("0x37")]) {
_0x4939d9$jscomp$0[_0x5f4f("0x37")][_0x5f4f("0x80")](_0xada6dc$jscomp$11);
}
},
"notifyToken" : function(_0x4939d9$jscomp$22) {
this["sendRecaptchaResponse"](_0x4939d9$jscomp$22);
},
"setNick" : function() {
this[_0x5f4f("0xc")]();
var _0x5397a0$jscomp$17 = _0xada6dc$jscomp$0(_0x5f4f("0x81"))["val"]();
if (_0x5397a0$jscomp$17 && _0x5397a0$jscomp$17[_0x5f4f("0x68")] > 15) {
_0x5397a0$jscomp$17 = _0x5397a0$jscomp$17[_0x5f4f("0x82")](0, 15);
}
if (_0x4939d9$jscomp$0[_0x5f4f("0x37")]) {
_0x4939d9$jscomp$0[_0x5f4f("0x37")][_0x5f4f("0x83")](_0x5397a0$jscomp$17);
}
},
"spectate" : function() {
if (_0x4939d9$jscomp$0[_0x5f4f("0x37")]) {
_0x4939d9$jscomp$0[_0x5f4f("0x37")][_0x5f4f("0x84")]();
}
},
"updatePartyToken" : function() {
_0xada6dc$jscomp$0(_0x5f4f("0x85"))[_0x5f4f("0x42")](this[_0x5f4f("0x63")]);
},
"checkHash" : function() {
if (this["checkPartyHash"]()) {
this[_0x5f4f("0x86")](_0x4939d9$jscomp$0[_0x5f4f("0x3b")][_0x5f4f("0x87")]);
} else {
if (_0x4939d9$jscomp$0[_0x5f4f("0x3b")][_0x5f4f("0x87")] && -1 != [_0x5f4f("0x88"), _0x5f4f("0x89"), "#teams", _0x5f4f("0x8a")][_0x5f4f("0x78")](_0x4939d9$jscomp$0[_0x5f4f("0x3b")][_0x5f4f("0x87")])) {
this[_0x5f4f("0x56")](_0x4939d9$jscomp$0[_0x5f4f("0x3b")][_0x5f4f("0x87")][_0x5f4f("0x54")]("#", ":"));
}
}
},
"checkPartyHash" : function() {
return _0x4939d9$jscomp$0[_0x5f4f("0x3b")][_0x5f4f("0x87")] && 7 == _0x4939d9$jscomp$0[_0x5f4f("0x3b")][_0x5f4f("0x87")][_0x5f4f("0x68")];
},
"replaceHistoryState" : function(_0xada6dc$jscomp$12) {
if (_0x4939d9$jscomp$0[_0x5f4f("0x8b")] && _0x4939d9$jscomp$0[_0x5f4f("0x8b")]["replaceState"]) {
_0x4939d9$jscomp$0[_0x5f4f("0x8b")][_0x5f4f("0x8c")]({}, _0x4939d9$jscomp$0[_0x5f4f("0x8d")][_0x5f4f("0x8e")], _0xada6dc$jscomp$12);
}
},
"facebookLogin" : function() {
_0x4939d9$jscomp$0[_0x5f4f("0x8f")]();
},
"doLoginWithFB" : function(_0x4939d9$jscomp$23) {
this["context"] = _0x5f4f("0x8");
this["accessToken"] = _0x4939d9$jscomp$23;
},
"doLoginWithGPlus" : function(_0x4939d9$jscomp$24) {
this[_0x5f4f("0xa")] = "google";
this[_0x5f4f("0x90")] = _0x4939d9$jscomp$24;
},
"login" : function() {
if (this[_0x5f4f("0x90")]) {
if (_0x5f4f("0x8") === this["context"] && _0x4939d9$jscomp$0[_0x5f4f("0x37")] && _0x4939d9$jscomp$0[_0x5f4f("0x37")][_0x5f4f("0x91")]) {
_0x4939d9$jscomp$0[_0x5f4f("0x37")][_0x5f4f("0x91")](this[_0x5f4f("0x90")]);
}
if (_0x5f4f("0x20") === this["context"] && _0x4939d9$jscomp$0[_0x5f4f("0x37")] && _0x4939d9$jscomp$0[_0x5f4f("0x37")][_0x5f4f("0x92")]) {
_0x4939d9$jscomp$0[_0x5f4f("0x37")]["sendGplusToken"](this[_0x5f4f("0x90")]);
}
}
},
"logout" : function() {
this[_0x5f4f("0x90")] = null;
this[_0x5f4f("0x39")]();
},
"setUI" : function() {
var _0x5397a0$jscomp$18 = this;
_0xada6dc$jscomp$0("[data-itr]")[_0x5f4f("0x4d")](function() {
var _0x5397a0$jscomp$19 = _0xada6dc$jscomp$0(this);
var _0xbb82b$jscomp$13 = _0x5397a0$jscomp$19[_0x5f4f("0x16")](_0x5f4f("0x93"));
_0x5397a0$jscomp$19[_0x5f4f("0x94")](_0x4939d9$jscomp$0[_0x5f4f("0x95")](_0xbb82b$jscomp$13));
});
_0xada6dc$jscomp$0(_0x5f4f("0x55"))["on"](_0x5f4f("0x96"), function() {
_0x5397a0$jscomp$18[_0x5f4f("0x97")]();
});
_0xada6dc$jscomp$0(_0x5f4f("0x98"))["on"](_0x5f4f("0x99"), function(_0x4939d9$jscomp$25) {
_0x4939d9$jscomp$25[_0x5f4f("0x9a")]();
_0x5397a0$jscomp$18["setNick"]();
});
_0xada6dc$jscomp$0(_0x5f4f("0x9b"))["on"](_0x5f4f("0x99"), function(_0x4939d9$jscomp$26) {
_0x4939d9$jscomp$26[_0x5f4f("0x9a")]();
_0x5397a0$jscomp$18[_0x5f4f("0x9c")]();
});
_0xada6dc$jscomp$0(_0x5f4f("0x9d"))["on"](_0x5f4f("0x99"), function(_0x4939d9$jscomp$27) {
_0x4939d9$jscomp$27["preventDefault"]();
_0x5397a0$jscomp$18[_0x5f4f("0x9e")]();
});
$("#join-party-btn-2")["on"](_0x5f4f("0x99"), function(_0x4939d9$jscomp$28) {
_0x4939d9$jscomp$28[_0x5f4f("0x9a")]();
_0x5397a0$jscomp$18[_0x5f4f("0x86")](_0xada6dc$jscomp$0(_0x5f4f("0x9f"))[_0x5f4f("0x42")]());
});
_0x4939d9$jscomp$0[_0x5f4f("0xa0")] = function() {
_0xada6dc$jscomp$0(_0x5f4f("0xa1"))[_0x5f4f("0xa2")]();
};
},
"init" : function() {
var _0x4939d9$jscomp$29 = this;
this["setUI"]();
this[_0x5f4f("0xa3")]();
this[_0x5f4f("0xa4")]();
this[_0x5f4f("0xa5")]();
this["getRegionCode"]();
this[_0x5f4f("0xa6")]();
setInterval(function() {
_0x4939d9$jscomp$29[_0x5f4f("0xa4")]();
}, 18E4);
}
};
_0x4939d9$jscomp$0["getStorage"] = function() {
if (null !== _0x4939d9$jscomp$0["localStorage"]["getItem"](_0x5f4f("0xa7"))) {
_0xbb82b$jscomp$0 = JSON[_0x5f4f("0x47")](_0x4939d9$jscomp$0[_0x5f4f("0x2a")]["getItem"]("storeObjectInfo"));
}
};
_0x4939d9$jscomp$0[_0x5f4f("0xb")] = function() {
_0x4939d9$jscomp$0[_0x5f4f("0x2a")][_0x5f4f("0x38")](_0x5f4f("0xa7"), JSON[_0x5f4f("0xa8")](_0xbb82b$jscomp$0));
};
_0x4939d9$jscomp$0[_0x5f4f("0xa9")] = function() {
if (_0x5f4f("0x20") === _0xbb82b$jscomp$0["context"] && _0x4c0667$jscomp$0) {
_0x4c0667$jscomp$0[_0x5f4f("0xaa")]();
}
delete _0x4939d9$jscomp$0["localStorage"][_0x5f4f("0xa7")];
_0xada6dc$jscomp$0(_0x5f4f("0x18"))[_0x5f4f("0x16")](_0x5f4f("0x19"), "0");
_0xada6dc$jscomp$0(_0x5f4f("0x1a"))[_0x5f4f("0x1b")]("0%");
master[_0x5f4f("0xa9")]();
};
_0x4939d9$jscomp$0["facebookLogin"] = function() {
alert("You seem to have something blocking Facebook on your browser, please check for any extensions");
};
_0x4939d9$jscomp$0[_0x5f4f("0xab")] = function() {
_0x4939d9$jscomp$0["FB"][_0x5f4f("0xac")]({
"appId" : _0x4e9951$jscomp$0[_0x5f4f("0xad")],
"cookie" : true,
"xfbml" : true,
"status" : true,
"version" : _0x5f4f("0xae")
});
if (true) {
_0x4939d9$jscomp$0["getStorage"]();
if ("1" === _0xbb82b$jscomp$0[_0x5f4f("0x1f")] && _0x5f4f("0x8") === _0xbb82b$jscomp$0[_0x5f4f("0xa")]) {
_0x4939d9$jscomp$0["FB"][_0x5f4f("0xaf")](function(_0xada6dc$jscomp$13) {
if (_0x5f4f("0xb0") === _0xada6dc$jscomp$13[_0x5f4f("0xe")]) {
_0x5b7dda$jscomp$0(_0xada6dc$jscomp$13);
} else {
_0x4939d9$jscomp$0["logout"]();
}
});
}
_0x4939d9$jscomp$0[_0x5f4f("0x1d")] = _0x200e80$jscomp$0;
_0x4939d9$jscomp$0[_0x5f4f("0x8f")] = _0x200e80$jscomp$0;
}
};
_0x4939d9$jscomp$0[_0x5f4f("0xb1")] = function() {
_0x4939d9$jscomp$0[_0x5f4f("0xb2")]();
_0x4939d9$jscomp$0[_0x5f4f("0xb3")][_0x5f4f("0xb4")](_0x5f4f("0xb5"), function() {
_0x4c0667$jscomp$0 = _0x4939d9$jscomp$0["gapi"][_0x5f4f("0xb5")][_0x5f4f("0xac")]({
"client_id" : _0x4e9951$jscomp$0[_0x5f4f("0xb6")],
"cookie_policy" : _0x5f4f("0xb7"),
"scope" : _0x5f4f("0xb8"),
"app_package_name" : _0x5f4f("0xb9")
});
var _0xada6dc$jscomp$14 = document[_0x5f4f("0xba")](_0x5f4f("0xbb"));
_0xada6dc$jscomp$14["addEventListener"](_0x5f4f("0x99"), function() {
_0xbb82b$jscomp$0[_0x5f4f("0x1f")] = "1";
_0xbb82b$jscomp$0[_0x5f4f("0xa")] = _0x5f4f("0x20");
_0x4939d9$jscomp$0[_0x5f4f("0xb")]();
});
_0x4c0667$jscomp$0[_0x5f4f("0xbc")](_0xada6dc$jscomp$14);
_0x4c0667$jscomp$0["currentUser"]["listen"](_0x13ffe1$jscomp$0);
_0x4c0667$jscomp$0[_0x5f4f("0xbd")](_0x4065de$jscomp$0);
});
};
}(window, window["jQuery"]);
