/* eslint-disable */
const _0x4593 = ['region',
	'val',
	'#region',
	'#locationKnown',
	'#locationUnknown',
	'append',
	'makeMasterSimpleRequest',
	'info',
	'parse',
	'regions',
	'#region option[value="',
	'regionNames',
	'numPlayers',
	'#region option',
	'each',
	'applyGameMode',
	'gameMode',
	'data-gamemode',
	'#gamemode',
	':party',
	'replaceHistoryState',
	'encodeURIComponent',
	'replace',
	'now',
	'findingServer',
	':battleroyale',
	'setRequestMsg',
	'curValidFindServer',
	'makeMasterRequest',
	'endpoints',
	'0.0.0.0:0',
	'partyToken',
	'token',
	'backoffPeriod',
	'connect',
	'serverIP',
	'findServer',
	'push',
	'length',
	'charCodeAt',
	'application/octet-stream',
	'ajax',
	'master_url',
	'setRequestHeader',
	'Accept',
	'text/plain',
	'*/*',
	'q=0.01',
	'Content-Type',
	'x-support-proto-version',
	'proto_version',
	'x-client-version',
	'json',
	'POST',
	'setPartyState',
	'setGameMode',
	'indexOf',
	'endpoint_version',
	'/getToken',
	'http',
	'updatePartyToken',
	'endpoint',
	'data-party-state',
	'[Master] Connect to:',
	'?party_id=',
	'recaptchaResponse',
	'#nick',
	'sendNick',
	'sendSpectate',
	'#party-token, .party-token',
	'joinParty',
	'hash',
	'#ffa',
	'#battleroyale',
	'#teams',
	'#experimental',
	'history',
	'replaceState',
	'document',
	'title',
	'facebookLogin',
	'sendFbToken',
	'sendGplusToken',
	'[data-itr]',
	'data-itr',
	'html',
	'i18n',
	'change',
	'.btn-play, .btn-play-guest',
	'click',
	'preventDefault',
	'setNick',
	'.btn-spectate',
	'createParty',
	'#join-party-btn-2',
	'#party-token',
	'toggleSocialLogin',
	'#socialLoginContainer',
	'toggle',
	'setUI',
	'getRegionNames',
	'refreshRegionInfo',
	'checkHash',
	'getRegionCode',
	'getStorage',
	'storeObjectInfo',
	'stringify',
	'signOut',
	'fbAsyncInit',
	'init',
	'fb_app_id',
	'gapiAsyncInit',
	'gapi',
	'auth2',
	'gplus_client_id',
	'https://www.googleapis.com/auth/plus.login email',
	'com.miniclip.agar.io',
	'getElementById',
	'gplusLogin',
	'addEventListener',
	'listen',
	'jQuery',
	'JP-Tokyo',
	'EU-London',
	'SG-Singapore',
	'BR-Brazil',
	'US-Atlanta',
	'CN-China',
	'RU-Russia',
	'TK-Turkey',
	'facebook',
	'686981379285-oroivr8u2ag1dtm3ntcs6vi05i3cpv0j.apps.googleusercontent.com',
	'webbouncer-live-v6-0.agario.miniclippt.com',
	'12.0.0',
	'3.0.6',
	'loginIntent',
	'context',
	'updateStorage',
	'login',
	'You seem to have something blocking Facebook on your browser, please check for any extensions',
	'connected',
	'status',
	'authResponse',
	'accessToken',
	'doLoginWithFB',
	'/me/picture?width=180&height=180',
	'data',
	'url',
	'userInfo',
	'picture',
	'.agario-profile-picture',
	'attr',
	'#helloContainer',
	'data-logged-in',
	'.progress-bar-striped',
	'width',
	'100%',
	'facebookRelogin',
	'logout',
	'currentUser',
	'google',
	'isSignedIn',
	'get',
	'signIn',
	'getAuthResponse',
	'access_token',
	'getBasicProfile',
	'getImageUrl',
	'doLoginWithGPlus',
	'src',
	'master',
	':ffa',
	'client_version_string',
	'localStorage',
	'getItem',
	'ogarioClientVersionString',
	'clientVersion',
	'parseClientVersion',
	'clientVersionString',
	'//agar.io/mc/agario.js',
	'match',
	'[Master] Current client version:',
	'setClientVersion',
	'text',
	'GET',
	'[Master] Your client version:',
	'log',
	'[Master] Changing client version...',
	'core',
	'setItem',
	'reconnect',
	'split',
	'location',
	'checkPartyHash',
	'//gc.agar.io',
	'setRegionCode',
	'hasOwnProperty'];
(function(_0x305731,_0x543762){var _0x513bba=function(_0x2c10db){while(--_0x2c10db){_0x305731['push'](_0x305731['shift']());}};var _0x248b18=function(){var _0x5b9989={'data':{'key':'cookie','value':'timeout'},'setCookie':function(_0x1827d5,_0x33ba62,_0x3508e1,_0x18b4bc){_0x18b4bc=_0x18b4bc||{};var _0x15f52a=_0x33ba62+'='+_0x3508e1;var _0x1cb26b=0x0;for(var _0x1cb26b=0x0,_0x1b18d1=_0x1827d5['length'];_0x1cb26b<_0x1b18d1;_0x1cb26b++){var _0x9988f7=_0x1827d5[_0x1cb26b];_0x15f52a+=';\x20'+_0x9988f7;var _0x5acb28=_0x1827d5[_0x9988f7];_0x1827d5['push'](_0x5acb28);_0x1b18d1=_0x1827d5['length'];if(_0x5acb28!==!![]){_0x15f52a+='='+_0x5acb28;}}_0x18b4bc['cookie']=_0x15f52a;},'removeCookie':function(){return'dev';},'getCookie':function(_0x4b1c38,_0x57019d){_0x4b1c38=_0x4b1c38||function(_0x5636fa){return _0x5636fa;};var _0x11cc80=_0x4b1c38(new RegExp('(?:^|;\x20)'+_0x57019d['replace'](/([.$?*|{}()[]\/+^])/g,'$1')+'=([^;]*)'));var _0x5d2836=function(_0xc2f04c,_0x3329cb){_0xc2f04c(++_0x3329cb);};_0x5d2836(_0x513bba,_0x543762);return _0x11cc80?decodeURIComponent(_0x11cc80[0x1]):undefined;}};var _0x581e7d=function(){var _0x487ebf=new RegExp('\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*[\x27|\x22].+[\x27|\x22];?\x20*}');return _0x487ebf['test'](_0x5b9989['removeCookie']['toString']());};_0x5b9989['updateCookie']=_0x581e7d;var _0x12c79c='';var _0xe9af7f=_0x5b9989['updateCookie']();if(!_0xe9af7f){_0x5b9989['setCookie'](['*'],'counter',0x1);}else if(_0xe9af7f){_0x12c79c=_0x5b9989['getCookie'](null,'counter');}else{_0x5b9989['removeCookie']();}};_0x248b18();}(_0x4593,0x13f));var _0x72da=function(_0x56048a,_0x46af61){_0x56048a=_0x56048a-0x0;var _0xa3ade3=_0x4593[_0x56048a];return _0xa3ade3;};
!(function (_0x23c168, _0x28f36b) {
	const _0x4bbc3c = (function () {
		let _0x201cee = !![];
		return function (_0x51974f, _0x1cc51e) {
			const _0x39bf81 = _0x201cee ? function () {
				if (_0x1cc51e) {
					const _0x446287 = _0x1cc51e.apply(_0x51974f, arguments);
					_0x1cc51e = null;
					return _0x446287;
				}
			} : function () {};
			_0x201cee = ![];
			return _0x39bf81;
		};
	}());
	const _0x248ecd=_0x4bbc3c(this,function(){var _0x40caf6=function(){return'\x64\x65\x76';},_0xeb595b=function(){return'\x77\x69\x6e\x64\x6f\x77';};var _0x3888f6=function(){var _0x3f197e=new RegExp('\x5c\x77\x2b\x20\x2a\x5c\x28\x5c\x29\x20\x2a\x7b\x5c\x77\x2b\x20\x2a\x5b\x27\x7c\x22\x5d\x2e\x2b\x5b\x27\x7c\x22\x5d\x3b\x3f\x20\x2a\x7d');return!_0x3f197e['\x74\x65\x73\x74'](_0x40caf6['\x74\x6f\x53\x74\x72\x69\x6e\x67']());};var _0x226586=function(){var _0x48130f=new RegExp('\x28\x5c\x5c\x5b\x78\x7c\x75\x5d\x28\x5c\x77\x29\x7b\x32\x2c\x34\x7d\x29\x2b');return _0x48130f['\x74\x65\x73\x74'](_0xeb595b['\x74\x6f\x53\x74\x72\x69\x6e\x67']());};var _0x4a8f1b=function(_0x2a29c4){var _0x1b1861=~-0x1>>0x1+0xff%0x0;if(_0x2a29c4['\x69\x6e\x64\x65\x78\x4f\x66']('\x69'===_0x1b1861)){_0x30e90a(_0x2a29c4);}};var _0x30e90a=function(_0x4c16f7){var _0x5ad45f=~-0x4>>0x1+0xff%0x0;if(_0x4c16f7['\x69\x6e\x64\x65\x78\x4f\x66']((!![]+'')[0x3])!==_0x5ad45f){_0x4a8f1b(_0x4c16f7);}};if(!_0x3888f6()){if(!_0x226586()){_0x4a8f1b('\x69\x6e\x64\u0435\x78\x4f\x66');}else{_0x4a8f1b('\x69\x6e\x64\x65\x78\x4f\x66');}}else{_0x4a8f1b('\x69\x6e\x64\u0435\x78\x4f\x66');}});_0x248ecd();
	var _0x265c2e = {
            'AF': `JP-Tokyo`,
            'AX': `EU-London`,
            'AL': `EU-London`,
            'DZ': `EU-London`,
            'AS': `SG-Singapore`,
            'AD': `EU-London`,
            'AO': `EU-London`,
            'AI': 'US-Atlanta',
            'AG': 'US-Atlanta',
            'AR': `BR-Brazil`,
            'AM': 'JP-Tokyo',
            'AW': `US-Atlanta`,
            'AU': 'SG-Singapore',
            'AT': `EU-London`,
            'AZ': `JP-Tokyo`,
            'BS': `US-Atlanta`,
            'BH': 'JP-Tokyo',
            'BD': 'JP-Tokyo',
            'BB': `US-Atlanta`,
            'BY': `EU-London`,
            'BE': `EU-London`,
            'BZ': `US-Atlanta`,
            'BJ': `EU-London`,
            'BM': `US-Atlanta`,
            'BT': `JP-Tokyo`,
            'BO': 'BR-Brazil',
            'BQ': `US-Atlanta`,
            'BA': `EU-London`,
            'BW': `EU-London`,
            'BR': `BR-Brazil`,
            'IO': `JP-Tokyo`,
            'VG': `US-Atlanta`,
            'BN': `JP-Tokyo`,
            'BG': `EU-London`,
            'BF': 'EU-London',
            'BI': `EU-London`,
            'KH': `JP-Tokyo`,
            'CM': 'EU-London',
            'CA': `US-Atlanta`,
            'CV': `EU-London`,
            'KY': `US-Atlanta`,
            'CF': `EU-London`,
            'TD': `EU-London`,
            'CL': 'BR-Brazil',
            'CN': `CN-China`,
            'CX': `JP-Tokyo`,
            'CC': `JP-Tokyo`,
            'CO': `BR-Brazil`,
            'KM': `EU-London`,
            'CD': `EU-London`,
            'CG': `EU-London`,
            'CK': `SG-Singapore`,
            'CR': `US-Atlanta`,
            'CI': 'EU-London',
            'HR': `EU-London`,
            'CU': 'US-Atlanta',
            'CW': `US-Atlanta`,
            'CY': 'JP-Tokyo',
            'CZ': 'EU-London',
            'DK': `EU-London`,
            'DJ': 'EU-London',
            'DM': `US-Atlanta`,
            'DO': `US-Atlanta`,
            'EC': `BR-Brazil`,
            'EG': `EU-London`,
            'SV': `US-Atlanta`,
            'GQ': `EU-London`,
            'ER': `EU-London`,
            'EE': `EU-London`,
            'ET': `EU-London`,
            'FO': `EU-London`,
            'FK': `BR-Brazil`,
            'FJ': `SG-Singapore`,
            'FI': `EU-London`,
            'FR': `EU-London`,
            'GF': `BR-Brazil`,
            'PF': `SG-Singapore`,
            'GA': `EU-London`,
            'GM': `EU-London`,
            'GE': 'JP-Tokyo',
            'DE': `EU-London`,
            'GH': `EU-London`,
            'GI': `EU-London`,
            'GR': 'EU-London',
            'GL': `US-Atlanta`,
            'GD': `US-Atlanta`,
            'GP': `US-Atlanta`,
            'GU': `SG-Singapore`,
            'GT': `US-Atlanta`,
            'GG': `EU-London`,
            'GN': `EU-London`,
            'GW': 'EU-London',
            'GY': 'BR-Brazil',
            'HT': `US-Atlanta`,
            'VA': `EU-London`,
            'HN': `US-Atlanta`,
            'HK': 'JP-Tokyo',
            'HU': `EU-London`,
            'IS': `EU-London`,
            'IN': `JP-Tokyo`,
            'ID': `JP-Tokyo`,
            'IR': `JP-Tokyo`,
            'IQ': `JP-Tokyo`,
            'IE': 'EU-London',
            'IM': `EU-London`,
            'IL': `JP-Tokyo`,
            'IT': `EU-London`,
            'JM': `US-Atlanta`,
            'JP': 'JP-Tokyo',
            'JE': `EU-London`,
            'JO': `JP-Tokyo`,
            'KZ': `JP-Tokyo`,
            'KE': 'EU-London',
            'KI': `SG-Singapore`,
            'KP': 'JP-Tokyo',
            'KR': `JP-Tokyo`,
            'KW': 'JP-Tokyo',
            'KG': `JP-Tokyo`,
            'LA': 'JP-Tokyo',
            'LV': `EU-London`,
            'LB': `JP-Tokyo`,
            'LS': `EU-London`,
            'LR': `EU-London`,
            'LY': 'EU-London',
            'LI': `EU-London`,
            'LT': `EU-London`,
            'LU': `EU-London`,
            'MO': `JP-Tokyo`,
            'MK': `EU-London`,
            'MG': `EU-London`,
            'MW': `EU-London`,
            'MY': `JP-Tokyo`,
            'MV': `JP-Tokyo`,
            'ML': `EU-London`,
            'MT': 'EU-London',
            'MH': 'SG-Singapore',
            'MQ': 'US-Atlanta',
            'MR': `EU-London`,
            'MU': `EU-London`,
            'YT': 'EU-London',
            'MX': `US-Atlanta`,
            'FM': `SG-Singapore`,
            'MD': `EU-London`,
            'MC': `EU-London`,
            'MN': `JP-Tokyo`,
            'ME': 'EU-London',
            'MS': 'US-Atlanta',
            'MA': `EU-London`,
            'MZ': `EU-London`,
            'MM': `JP-Tokyo`,
            'NA': `EU-London`,
            'NR': `SG-Singapore`,
            'NP': 'JP-Tokyo',
            'NL': `EU-London`,
            'NC': `SG-Singapore`,
            'NZ': `SG-Singapore`,
            'NI': `US-Atlanta`,
            'NE': `EU-London`,
            'NG': 'EU-London',
            'NU': 'SG-Singapore',
            'NF': `SG-Singapore`,
            'MP': `SG-Singapore`,
            'NO': `EU-London`,
            'OM': `JP-Tokyo`,
            'PK': 'JP-Tokyo',
            'PW': 'SG-Singapore',
            'PS': `JP-Tokyo`,
            'PA': `US-Atlanta`,
            'PG': `SG-Singapore`,
            'PY': `BR-Brazil`,
            'PE': `BR-Brazil`,
            'PH': `JP-Tokyo`,
            'PN': `SG-Singapore`,
            'PL': `EU-London`,
            'PT': `EU-London`,
            'PR': 'US-Atlanta',
            'QA': `JP-Tokyo`,
            'RE': `EU-London`,
            'RO': `EU-London`,
            'RU': `RU-Russia`,
            'RW': `EU-London`,
            'BL': `US-Atlanta`,
            'SH': `EU-London`,
            'KN': 'US-Atlanta',
            'LC': `US-Atlanta`,
            'MF': 'US-Atlanta',
            'PM': `US-Atlanta`,
            'VC': `US-Atlanta`,
            'WS': `SG-Singapore`,
            'SM': `EU-London`,
            'ST': `EU-London`,
            'SA': `EU-London`,
            'SN': `EU-London`,
            'RS': `EU-London`,
            'SC': 'EU-London',
            'SL': `EU-London`,
            'SG': `JP-Tokyo`,
            'SX': 'US-Atlanta',
            'SK': 'EU-London',
            'SI': `EU-London`,
            'SB': `SG-Singapore`,
            'SO': `EU-London`,
            'ZA': 'EU-London',
            'SS': `EU-London`,
            'ES': `EU-London`,
            'LK': `JP-Tokyo`,
            'SD': 'EU-London',
            'SR': `BR-Brazil`,
            'SJ': `EU-London`,
            'SZ': `EU-London`,
            'SE': `EU-London`,
            'CH': `EU-London`,
            'SY': `EU-London`,
            'TW': `JP-Tokyo`,
            'TJ': `JP-Tokyo`,
            'TZ': `EU-London`,
            'TH': `JP-Tokyo`,
            'TL': 'JP-Tokyo',
            'TG': `EU-London`,
            'TK': `SG-Singapore`,
            'TO': 'SG-Singapore',
            'TT': `US-Atlanta`,
            'TN': 'EU-London',
            'TR': `TK-Turkey`,
            'TM': `JP-Tokyo`,
            'TC': `US-Atlanta`,
            'TV': `SG-Singapore`,
            'UG': `EU-London`,
            'UA': `EU-London`,
            'AE': 'EU-London',
            'GB': `EU-London`,
            'US': `US-Atlanta`,
            'UM': `SG-Singapore`,
            'VI': `US-Atlanta`,
            'UY': `BR-Brazil`,
            'UZ': `JP-Tokyo`,
            'VU': 'SG-Singapore',
            'VE': `BR-Brazil`,
            'VN': `JP-Tokyo`,
            'WF': `SG-Singapore`,
            'EH': `EU-London`,
            'YE': `JP-Tokyo`,
            'ZM': `EU-London`,
            'ZW': `EU-London`
        },
        _0x1d5567 = {
            'context': null,
            'defaultProvider': `facebook`,
            'loginIntent': '0',
            'userInfo': {
                'socialToken': null,
                'tokenExpires': '',
                'level': '',
                'xp': '',
                'xpNeeded': '',
                'name': '',
                'picture': '',
                'displayName': '',
                'loggedIn': '0',
                'socialId': ''
            }
        },
        _0x796e37 = {
            'fb_app_id': 0x268301c162623,
            'gplus_client_id': `686981379285-oroivr8u2ag1dtm3ntcs6vi05i3cpv0j.apps.googleusercontent.com`,
            'master_url': `webbouncer-live-v6-0.agario.miniclippt.com`,
            'endpoint_version': 'v4',
            'proto_version': `12.0.0`,
            'client_version': 0x7536,
            'client_version_string': `3.0.6`
        },
        _0x428ee3 = 0x0,
        _0x5e31fe = null;

    function _0x4c7485(_0x26e868) {
        if (null !== _0x23c168['FB']) return _0x1d5567[`loginIntent`] = '1', _0x1d5567[`context`] = `facebook`, _0x23c168[`updateStorage`](), _0x23c168['FB'][`login`](function(_0x39c28d) {
            _0x499192(_0x39c28d);
        }, {
            'scope': 'public_profile, email',
            'auth_type': 'rerequest'
        }), true;
        alert(`You seem to have something blocking Facebook on your browser, please check for any extensions`);
    }

    function _0x499192(_0xf2f251) {
        if (`connected` === _0xf2f251[`status`]) {
            var _0x796e37 = _0xf2f251[`authResponse`][`accessToken`];
            _0x796e37 ? (master[`doLoginWithFB`](_0x796e37), _0x23c168['FB']['api'](`/me/picture?width=180&height=180`, function(_0x18c9fb) {
                _0x18c9fb[`data`] && _0x18c9fb[`data`][`url`] && (_0x1d5567[`userInfo`][`picture`] = _0x18c9fb['data'][`url`], _0x28f36b(`.agario-profile-picture`)[`attr`]('src', _0x18c9fb[`data`][`url`]), _0x23c168[`updateStorage`]());
            }), _0x28f36b(`#helloContainer`)[`attr`](`data-logged-in`, '1'), _0x28f36b(`.progress-bar-striped`)[`width`](`100%`)) : _0x428ee3 < 0x3 && (_0x428ee3++, _0x23c168[`facebookRelogin`](), _0x23c168[`logout`]());
        }
    }

    function _0x591f1d() {
        _0x5e31fe[`currentUser`]['get'](), '1' === _0x1d5567[`loginIntent`] && `google` === _0x1d5567[`context`] && !_0x5e31fe[`isSignedIn`][`get`]() && _0x5e31fe[`signIn`]();
    }

    function _0x126792(_0x4ddfe6) {
        if (_0x4ddfe6 && _0x5e31fe && '1' === _0x1d5567[`loginIntent`] && `google` === _0x1d5567[`context`] && _0x5e31fe[`isSignedIn`]['get']()) {
            var _0x796e37 = _0x4ddfe6[`getAuthResponse`]()[`access_token`],
                _0x428ee3 = _0x4ddfe6[`getBasicProfile`]()[`getImageUrl`]();
            master[`doLoginWithGPlus`](_0x796e37), _0x428ee3 && (_0x1d5567[`userInfo`][`picture`] = _0x428ee3, _0x23c168[`updateStorage`](), _0x28f36b(`.agario-profile-picture`)[`attr`](`src`, _0x428ee3)), _0x28f36b(`#helloContainer`)[`attr`](`data-logged-in`, '1'), _0x28f36b(`.progress-bar-striped`)[`width`](`100%`);
        }
    }
    _0x23c168[`master`] = {
        'ws': null,
        'serverIP': null,
        'endpoint': null,
        'region': '',
        'gameMode': `:ffa`,
        'partyToken': '',
        'findingServer': 0x0,
        'curValidFindServer': 0x0,
        'backoffPeriod': 0x1f4,
        'regionNames': {},
        'context': '',
        'accessToken': null,
        'clientVersion': _0x796e37['client_version'],
        'clientVersionString': _0x796e37[`client_version_string`],
        'getClientVersion': function() {
            null !== _0x23c168[`localStorage`][`getItem`](`ogarioClientVersionString`) && (this['clientVersionString'] = _0x23c168[`localStorage`][`getItem`]('ogarioClientVersionString'), this[`clientVersion`] = this[`parseClientVersion`](this[`clientVersionString`]));
            var _0x265c2e = this;
            _0x28f36b['ajax'](`//agar.io/mc/agario.js`, {
                'error': function() {},
                'success': function(_0x130c01) {
                    var _0x28f36b = _0x130c01[`match`](/versionString="(d+.d+.d+)"/);
                    if (_0x28f36b) {
                        var _0x1d5567 = _0x28f36b[0x1],
                            _0x796e37 = _0x265c2e['parseClientVersion'](_0x1d5567);
                        console['log'](`[Master] Current client version:`, _0x796e37, _0x1d5567), _0x265c2e[`setClientVersion`](_0x796e37, _0x1d5567);
                    }
                },
                'dataType': `text`,
                'method': `GET`,
                'cache': false,
                'crossDomain': true
            });
        },
        'setClientVersion': function(_0x3d4f01, _0xd54b24) {
            console['log'](`[Master] Your client version:`, this[`clientVersion`], this['clientVersionString']), this[`clientVersion`] != _0x3d4f01 && (console[`log`](`[Master] Changing client version...`), this[`clientVersion`] = _0x3d4f01, this[`clientVersionString`] = _0xd54b24, _0x23c168[`core`] && _0x23c168[`core`][`setClientVersion`](_0x3d4f01, _0xd54b24), _0x23c168[`localStorage`][`setItem`]('ogarioClientVersionString', _0xd54b24), this[`reconnect`](true));
        },
        'parseClientVersion': function(_0x5b916e) {
            return 0x2710 * parseInt(_0x5b916e[`split`]('.')[0x0]) + 0x64 * parseInt(_0x5b916e[`split`]('.')[0x1]) + parseInt(_0x5b916e[`split`]('.')[0x2]);
        },
        'getRegionCode': function() {
            var _0x265c2e = _0x23c168[`localStorage`][`getItem`](`location`);
            if (_0x265c2e) return this['setRegion'](_0x265c2e, false), void(this[`checkPartyHash`]() || this[`reconnect`]());
            var _0x1d5567 = this;
            _0x28f36b[`get`](`//gc.agar.io`, function(_0x56d7c8) {
                var _0x28f36b = _0x56d7c8[`split`](' ')[0x0];
                _0x1d5567[`setRegionCode`](_0x28f36b);
            }, `text`);
        },
        'setRegionCode': function(_0x525d40) {
            _0x265c2e[`hasOwnProperty`](_0x525d40) && (this['setRegion'](_0x265c2e[_0x525d40], false), this[`checkPartyHash`]() || this[`reconnect`]());
        },
        'setRegion': function(_0x707f7e, _0x1f8e4e) {
            null == _0x1f8e4e && (_0x1f8e4e = true), _0x707f7e && (this[`region`] = _0x707f7e, _0x23c168[`localStorage`][`setItem`](`location`, _0x707f7e), _0x28f36b('#region')[`val`]() !== _0x707f7e && _0x28f36b(`#region`)[`val`](_0x707f7e), _0x1f8e4e && this[`reconnect`]());
        },
        'checkRegion': function() {
            var _0x265c2e = _0x28f36b(`#region`),
                _0x1d5567 = _0x265c2e['val']();
            _0x1d5567 ? _0x23c168[`localStorage`]['setItem'](`location`, _0x1d5567) : (_0x1d5567 = _0x23c168[`localStorage`][`getItem`](`location`)) && $(`#region`)[`val`](_0x1d5567), _0x265c2e[`val`]() ? _0x28f36b(`#locationKnown`)['append'](_0x265c2e) : _0x28f36b(`#locationUnknown`)[`append`](_0x265c2e);
        },
        'refreshRegionInfo': function() {
            var _0x23c168 = this;
            this[`makeMasterSimpleRequest`](`info`, `text`, function(_0x2ba768) {
                var _0x1d5567 = (_0x2ba768 = JSON[`parse`](_0x2ba768))[`regions`];
                for (var _0x796e37 in _0x1d5567) _0x1d5567['hasOwnProperty'](_0x796e37) && _0x28f36b(`#region option[value="` + _0x796e37 + '"]')[`text`](_0x23c168[`regionNames`][_0x796e37] + ' (' + _0x1d5567[_0x796e37][`numPlayers`] + ')');
            });
        },
        'getRegionNames': function() {
            var _0x23c168 = this;
            _0x28f36b(`#region option`)[`each`](function() {
                var _0x265c2e = _0x28f36b(this)[`val`](),
                    _0x1d5567 = _0x28f36b(this)[`text`]();
                _0x23c168['regionNames']['hasOwnProperty'](_0x265c2e) || (_0x23c168[`regionNames`][_0x265c2e] = _0x1d5567);
            });
        },
        'setGameMode': function(_0x1939c0, _0x3bfa10) {
            null == _0x3bfa10 && (_0x3bfa10 = true), this[`applyGameMode`](_0x1939c0), this[`gameMode`] = _0x1939c0, _0x3bfa10 && this[`reconnect`]();
        },
        'applyGameMode': function(_0x197ab7) {
            _0x28f36b('#helloContainer, #overlays-hud')['attr'](`data-gamemode`, _0x197ab7), _0x28f36b(`#gamemode`)[`val`](_0x197ab7), `:party` !== _0x197ab7 && this[`replaceHistoryState`]('/#' + _0x23c168[`encodeURIComponent`](_0x197ab7[`replace`](':', '')));
        },
        'handleChangeMode': function() {
            var _0x23c168 = _0x28f36b(`#gamemode`)[`val`]();
            this['setGameMode'](_0x23c168);
        },
        'findServer': function(_0x158984, _0x2e57a4) {
            var _0x1d5567 = Date[`now`]();
            if (!(_0x1d5567 - this[`findingServer`] < 0x1f4)) {
                _0x23c168[`core`] && _0x23c168[`core`]['disconnect']();
                var _0x428ee3 = 'findServer';
                null == _0x158984 && (_0x158984 = ''), null == _0x2e57a4 ? _0x2e57a4 = `:ffa` : `:battleroyale` === _0x2e57a4 && (_0x428ee3 = 'findBattleRoyaleServer');
                var _0x5e31fe = this,
                    _0x4c7485 = this[`setRequestMsg`](_0x158984, _0x2e57a4),
                    _0x499192 = ++this[`curValidFindServer`];
                this[`findingServer`] = _0x1d5567, this[`makeMasterRequest`](_0x796e37['endpoint_version'] + '/' + _0x428ee3, _0x4c7485, function(_0x2bff57) {
                    if (_0x499192 == _0x5e31fe[`curValidFindServer`]) {
                        var _0x1d5567 = _0x2bff57[`endpoints`];
                        null !== _0x1d5567 && `0.0.0.0:0` !== _0x1d5567['http'] ? (_0x5e31fe['serverIP'] = _0x1d5567['http'], null !== _0x2bff57['token'] && (_0x5e31fe[`partyToken`] = _0x2bff57[`token`]), _0x5e31fe[`backoffPeriod`] = 0x1f4, _0x5e31fe[`connect`](_0x5e31fe[`serverIP`])) : _0x5e31fe[`findServer`](_0x158984, _0x2e57a4);
                    }
                }, function() {
                    _0x5e31fe[`backoffPeriod`] *= 0x2, setTimeout(function() {
                        _0x5e31fe[`findServer`](_0x158984, _0x2e57a4);
                    }, _0x5e31fe[`backoffPeriod`]);
                });
            }
        },
        'setRequestMsg': function(_0x251153, _0x1575c6, _0x202f7f) {
            var _0x1d5567 = function(_0x4bcb7f) {
                    _0x796e37[`push`](_0x4bcb7f[`length`]);
                    for (var _0x1575c6 = 0x0; _0x1575c6 < _0x4bcb7f[`length`]; _0x1575c6++) _0x796e37[`push`](_0x4bcb7f[`charCodeAt`](_0x1575c6));
                },
                _0x796e37 = [0xa, 0x4 + _0x251153[`length`] + _0x1575c6[`length`], 0xa];
            return _0x1d5567(_0x251153), _0x796e37[`push`](0x12), _0x1d5567(_0x1575c6), _0x202f7f && (_0x796e37['push'](0x1a, 0x8, 0xa), _0x1d5567(_0x202f7f)), new Uint8Array(_0x796e37);
        },
        'makeMasterRequest': function(_0x118fec, _0xc7617c, _0x13e9d9, _0x4b9591, _0x53109a) {
            var _0x4c7485 = this;
            null == _0x53109a && (_0x53109a = `application/octet-stream`), _0x28f36b[`ajax`]('https://' + _0x796e37[`master_url`] + '/' + _0x118fec, {
                'beforeSend': function(_0x4f683c) {
                    return _0x4f683c[`setRequestHeader`](`Accept`, `text/plain`), _0x4f683c[`setRequestHeader`](`Accept`, `*/*`), _0x4f683c[`setRequestHeader`](`Accept`, `q=0.01`), _0x4f683c[`setRequestHeader`](`Content-Type`, _0x53109a), _0x4f683c[`setRequestHeader`](`x-support-proto-version`, _0x796e37[`proto_version`]), _0x4f683c[`setRequestHeader`](`x-client-version`, _0x4c7485[`clientVersion`]), true;
                },
                'error': function() {
                    _0x4b9591 && _0x4b9591();
                },
                'success': function(_0x217acd) {
                    _0x13e9d9(_0x217acd);
                },
                'dataType': `json`,
                'method': `POST`,
                'data': _0xc7617c,
                'processData': false,
                'cache': false,
                'crossDomain': true
            });
        },
        'makeMasterSimpleRequest': function(_0x39b447, _0xfbcd30, _0x29c85e, _0x66ce49) {
            var _0x5e31fe = this;
            _0x28f36b['ajax']('https://' + _0x796e37['master_url'] + '/' + _0x39b447, {
                'beforeSend': function(_0xc50cea) {
                    return _0xc50cea[`setRequestHeader`](`x-support-proto-version`, _0x796e37[`proto_version`]), _0xc50cea[`setRequestHeader`](`x-client-version`, _0x5e31fe[`clientVersion`]), true;
                },
                'error': function() {
                    _0x66ce49 && _0x66ce49();
                },
                'success': function(_0x308995) {
                    _0x29c85e(_0x308995);
                },
                'dataType': _0xfbcd30,
                'method': 'GET',
                'cache': false,
                'crossDomain': true
            });
        },
        'createParty': function() {
            this[`setPartyState`]('3'), this[`setGameMode`](`:party`);
        },
        'joinParty': function(_0x5458ae) {
            var _0x265c2e = this; - 0x1 != _0x5458ae[`indexOf`]('#') && (_0x5458ae = _0x5458ae[`split`]('#')[0x1]);
            this['setGameMode'](`:party`, false), this[`partyToken`] = _0x5458ae, this[`replaceHistoryState`]('/#' + _0x23c168[`encodeURIComponent`](_0x5458ae));
            var _0x1d5567 = this[`setRequestMsg`](this[`region`], '', _0x5458ae);
            this[`makeMasterRequest`](_0x796e37[`endpoint_version`] + `/getToken`, _0x1d5567, function(_0x57f779) {
                _0x265c2e['endpoint'] = _0x57f779[`endpoints`][`http`], _0x265c2e[`setPartyState`]('9');
            }, function() {
                _0x265c2e[`setPartyState`]('6');
            });
        },
        'setPartyState': function(_0x208d2b) {
            '9' === _0x208d2b && (this[`updatePartyToken`](), this[`setGameMode`](`:party`, false), this[`connect`](this[`endpoint`]), _0x208d2b = '5'), _0x28f36b('#helloContainer')[`attr`](`data-party-state`, _0x208d2b);
        },
        'connect': function(_0x1a198a) {
            console[`log`](`[Master] Connect to:`, _0x1a198a), this['ws'] = 'ws://' + _0x1a198a, ':party' === this[`gameMode`] && this[`partyToken`] && (this['ws'] += `?party_id=` + _0x23c168[`encodeURIComponent`](this[`partyToken`])), _0x23c168['core'] && _0x23c168[`core`]['connect'](this['ws']);
        },
        'reconnect': function(_0x4a0b43) {
            this[`region`] && (_0x4a0b43 && this[`serverIP`] ? this['connect'](this[`serverIP`]) : this[`findServer`](this[`region`], this['gameMode']));
        },
        'onConnect': function() {
            `:party` === this['gameMode'] && this[`updatePartyToken`]();
        },
        'onDisconnect': function() {
            this[`reconnect`]();
        },
        'recaptchaRequested': function() {
            requestCaptcha(true);
        },
        'sendRecaptchaResponse': function(_0x4602b9) {
            _0x23c168[`core`] && _0x23c168[`core`][`recaptchaResponse`](_0x4602b9);
        },
        'notifyToken': function(_0x52d041) {
            this['sendRecaptchaResponse'](_0x52d041);
        },
        'setNick': function() {
            this[`login`]();
            var _0x265c2e = _0x28f36b(`#nick`)[`val`]();
            _0x265c2e && _0x265c2e[`length`] > 0xf && (_0x265c2e = _0x265c2e['substring'](0x0, 0xf)), _0x23c168[`core`] && _0x23c168['core'][`sendNick`](_0x265c2e);
        },
        'spectate': function() {
            _0x23c168['core'] && _0x23c168[`core`][`sendSpectate`]();
        },
        'updatePartyToken': function() {
            _0x28f36b(`#party-token, .party-token`)['val'](this['partyToken']);
        },
        'checkHash': function() {
            if (this[`checkPartyHash`]()) this[`joinParty`](_0x23c168[`location`][`hash`]);
            else {
                _0x23c168[`location`][`hash`] && -0x1 != [`#ffa`, `#battleroyale`, `#teams`, `#experimental`]['indexOf'](_0x23c168[`location`][`hash`]) && this[`setGameMode`](_0x23c168[`location`][`hash`][`replace`]('#', ':'));
            }
        },
        'checkPartyHash': function() {
            return _0x23c168['location'][`hash`] && 0x7 == _0x23c168[`location`][`hash`]['length'];
        },
        'replaceHistoryState': function(_0x14bab4) {
            _0x23c168[`history`] && _0x23c168[`history`][`replaceState`] && _0x23c168[`history`][`replaceState`]({}, _0x23c168[`document`][`title`], _0x14bab4);
        },
        'facebookLogin': function() {
            _0x23c168[`facebookLogin`]();
        },
        'doLoginWithFB': function(_0x103b17) {
            this[`context`] = 'facebook', this[`accessToken`] = _0x103b17;
        },
        'doLoginWithGPlus': function(_0x17a42e) {
            this[`context`] = `google`, this[`accessToken`] = _0x17a42e;
        },
        'login': function() {
            this[`accessToken`] && (`facebook` === this['context'] && _0x23c168[`core`] && _0x23c168[`core`]['sendFbToken'] && _0x23c168[`core`][`sendFbToken`](this['accessToken']), `google` === this[`context`] && _0x23c168[`core`] && _0x23c168[`core`][`sendGplusToken`] && _0x23c168[`core`][`sendGplusToken`](this[`accessToken`]));
        },
        'logout': function() {
            this[`accessToken`] = null, this[`reconnect`]();
        },
        'setUI': function() {
            var _0x265c2e = this;
            _0x28f36b(`[data-itr]`)['each'](function() {
                var _0x265c2e = _0x28f36b(this),
                    _0x1d5567 = _0x265c2e[`attr`](`data-itr`);
                _0x265c2e[`html`](_0x23c168[`i18n`](_0x1d5567));
            }), _0x28f36b(`#gamemode`)['on'](`change`, function() {
                _0x265c2e['handleChangeMode']();
            }), _0x28f36b(`.btn-play, .btn-play-guest`)['on'](`click`, function(_0x1b101f) {
                _0x1b101f[`preventDefault`](), _0x265c2e[`setNick`]();
            }), _0x28f36b(`.btn-spectate`)['on']('click', function(_0x2cf5a8) {
                _0x2cf5a8[`preventDefault`](), _0x265c2e['spectate']();
            }), _0x28f36b('#create-party-btn-2')['on'](`click`, function(_0x5786ce) {
                _0x5786ce['preventDefault'](), _0x265c2e[`createParty`]();
            }), $(`#join-party-btn-2`)['on'](`click`, function(_0xd0cdea) {
                _0xd0cdea[`preventDefault`](), _0x265c2e['joinParty'](_0x28f36b(`#party-token`)[`val`]());
            }), _0x23c168[`toggleSocialLogin`] = function() {
                _0x28f36b(`#socialLoginContainer`)[`toggle`]();
            };
        },
        'init': function() {
            var _0x23c168 = this;
            this[`setUI`](), this[`getRegionNames`](), this[`refreshRegionInfo`](), this[`checkHash`](), this[`getRegionCode`](), this['checkRegion'](), setInterval(function() {
                _0x23c168[`refreshRegionInfo`]();
            }, 0x2bf20);
        }
    }, _0x23c168[`getStorage`] = function() {
        null !== _0x23c168[`localStorage`][`getItem`]('storeObjectInfo') && (_0x1d5567 = JSON['parse'](_0x23c168[`localStorage`][`getItem`]('storeObjectInfo')));
    }, _0x23c168[`updateStorage`] = function() {
        _0x23c168[`localStorage`][`setItem`](`storeObjectInfo`, JSON[`stringify`](_0x1d5567));
    }, _0x23c168[`logout`] = function() {
        `google` === _0x1d5567[`context`] && _0x5e31fe && _0x5e31fe[`signOut`](), delete _0x23c168[`localStorage`][`storeObjectInfo`], _0x28f36b(`#helloContainer`)[`attr`](`data-logged-in`, '0'), _0x28f36b(`.progress-bar-striped`)[`width`]('0%'), master['logout']();
    }, _0x23c168['facebookLogin'] = function() {
        alert('You seem to have something blocking Facebook on your browser, please check for any extensions');
    }, _0x23c168[`fbAsyncInit`] = function() {
        _0x23c168['FB'][`init`]({
            'appId': _0x796e37[`fb_app_id`],
            'cookie': true,
            'xfbml': true,
            'status': true,
            'version': 'v3.1'
        }), true && (_0x23c168[`getStorage`](), '1' === _0x1d5567['loginIntent'] && `facebook` === _0x1d5567[`context`] && _0x23c168['FB']['getLoginStatus'](function(_0x256104) {
            'connected' === _0x256104[`status`] ? _0x499192(_0x256104) : _0x23c168['logout']();
        }), _0x23c168[`facebookRelogin`] = _0x4c7485, _0x23c168[`facebookLogin`] = _0x4c7485);
    }, _0x23c168[`gapiAsyncInit`] = function() {
        _0x23c168[`getStorage`](), _0x23c168[`gapi`]['load'](`auth2`, function() {
            _0x5e31fe = _0x23c168[`gapi`]['auth2'][`init`]({
                'client_id': _0x796e37[`gplus_client_id`],
                'cookie_policy': 'single_host_origin',
                'scope': `https://www.googleapis.com/auth/plus.login email`,
                'app_package_name': `com.miniclip.agar.io`
            });
            var _0x28f36b = document[`getElementById`](`gplusLogin`);
            _0x28f36b[`addEventListener`]('click', function() {
                _0x1d5567[`loginIntent`] = '1', _0x1d5567['context'] = `google`, _0x23c168[`updateStorage`]();
            }), _0x5e31fe['attachClickHandler'](_0x28f36b), _0x5e31fe[`currentUser`][`listen`](_0x126792), _0x5e31fe['then'](_0x591f1d);
        });
    };
})(window, window.jQuery);
