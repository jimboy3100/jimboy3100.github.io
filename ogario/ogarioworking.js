(function (window, CLIENT2, $) {
    var Buffer = null;
    var Lz4 = null;

    var _0x2bb6c3 = 'en';
    var _0x26bdfd = window.navigator.language || window.navigator.userLanguage;
    if (_0x26bdfd && LANG.hasOwnProperty(_0x26bdfd)) {
        _0x2bb6c3 = _0x26bdfd;
    }
    var i18n = LANG[_0x2bb6c3];
    var _0x23cf50 = {
        'comm1': i18n.comm1,
        'comm2': i18n.comm2,
        'comm3': i18n.comm3,
        'comm4': i18n.comm4,
        'comm5': i18n.comm5,
        'comm6': i18n.comm6,
        'comm7': i18n.comm7,
        'comm8': i18n.comm8,
        'comm9': i18n.comm9,
        'comm0': i18n.comm0,
        'comm10': i18n.comm10,
        'comm11': i18n.comm11,
        'comm12': i18n.comm12,
        'comm13': i18n.comm13,
        'comm14': i18n.comm14
    };
    var SPECIALCHARS = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        '\'': '&#39;',
        '/': '&#x2F;'
    };
    var SMILES = {
        ':)': 'smile.svg',
        ';)': 'wink.svg',
        '=)': 'smirk.svg',
        ':D': 'grin.svg',
        'X-D': 'xgrin.svg',
        '=D': 'joy.svg',
        ':(': 'sad.svg',
        ';(': 'cry.svg',
        ':P': 'tongue.svg',
        ';P': 'tonguew.svg',
        ':*': 'kiss.svg',
        '$)': 'smileh.svg',
        '<3': 'heart.svg',
        '8=)': 'cool.svg',
        ':o': 'astonished.svg',
        '(:|': 'sweat.svg',
        ':|': 'neutral.svg',
        ':\\': 'unamused.svg',
        ':@': 'pouting.svg',
        '|-)': 'sleep.svg',
        '^_^': 'relaxed.svg',
        '-_-': 'expressionless.svg',
        '$_$': 'money.svg',
        'O:)': 'angel.svg',
        '3:)': 'devil.svg',
        '(poop)': 'poo.svg',
        '(fuck)': 'finger.svg',
        '(clap)': 'clap.svg',
        '(ok)': 'ok.svg',
        '(victory)': 'victory.svg',
        '(y)': 'thumb.svg',
        '(n)': 'thumbd.svg'
    };
    var imagePatterns = [{
        'name': 'imgur.com',
        'url': 'https://imgur.com/',
        'example': 'https://i.imgur.com/xdmUp5N.png',
        'pattern': 'https?:\/\/\w+\.imgur\.com\/\w{6,}\.(?:%file_ext%)\??\d*'
    }, {
        'name': 'put.re',
        'url': 'https://put.re/',
        'example': 'https://s.put.re/iYHAW65g.png',
        'pattern': 'https?:\/\/\w+\.put\.re\/\w{8,}\.(?:%file_ext%)'
    }, {
        'name': 'postimages.org',
        'url': 'https://postimages.org/',
        'example': 'https://i.postimg.cc/zzK0sRPg/xdmUp5N.png',
        'pattern': 'https?:\/\/\w+\.postimg\.cc\/\w{8,}\/\w+\.(?:%file_ext%)'
    }];
    var THEMES = {
        'ogario-v3': {
            'name': 'OGARio v3',
            'darkTheme': true,
            'mainColor': '#01d9cc',
            'bgColor': '#000a11',
            'bordersColor': '#01d9cc',
            'gridColor': '#00243e',
            'sectorsColor': '#00243e',
            'namesColor': '#ffffff',
            'namesStrokeColor': '#000000',
            'massColor': '#ffffff',
            'massStrokeColor': '#000000',
            'virusColor': '#002f52',
            'virusStrokeColor': '#00b9e8',
            'foodColor': '#5000ff',
            'teammatesIndColor': '#ffffff',
            'cursorTrackingColor': '#ffffff',
            'splitRangeColor': '#ffffff',
            'safeAreaColor': '#ffffff',
            'dangerAreaColor': '#bf00aa',
            'namesFont': 'ubuntu-bold',
            'massFont': 'ubuntu-bold',
            'sectorsFont': 'ubuntu',
            'namesScale': 0x1,
            'massScale': 0x3,
            'foodSize': 0x5,
            'bordersWidth': 0x28,
            'sectorsWidth': 0x28,
            'sectorsFontSize': 0x4b0,
            'cellsAlpha': 0.9,
            'skinsAlpha': 0.7,
            'virusAlpha': 0.6,
            'textAlpha': 0x1,
            'virusStrokeSize': 0xe,
            'menuPreset': 'ogario-v3',
            'menuMainColor': '#01d9cc',
            'menuBtnTextColor': '#ffffff',
            'menuPanelColor': '#00243e',
            'menuPanelColor2': '#002f52',
            'menuTextColor': '#ffffff',
            'menuTextColor2': '#8096a7',
            'btn1Color': '#018cf6',
            'btn1Color2': '#0176ce',
            'btn2Color': '#00b9e8',
            'btn2Color2': '#0099c0',
            'btn3Color': '#8d5fe6',
            'btn3Color2': '#814ee3',
            'btn4Color': '#bf00aa',
            'btn4Color2': '#a80096',
            'menuBg': 'https://cdn.ogario.ovh/static/img/pattern.png',
            'menuOpacity': 0.96,
            'hudMainColor': '#01d9cc',
            'hudColor': 'rgba(0,0,0,0.4)',
            'hudTextColor': '#ffffff',
            'statsHudColor': '#ffffff',
            'timeHudColor': '#01d9cc',
            'top5MassColor': '#bf00aa',
            'lbMeColor': '#bf00aa',
            'lbTeammateColor': '#018cf6',
            'hudFont': 'ubuntu-bold',
            'hudScale': 0x1,
            'messageColor': 'rgba(0,0,0,0.4)',
            'messageTextColor': '#ffffff',
            'messageTimeColor': '#018cf6',
            'messageNickColor': '#01d9cc',
            'commandsColor': 'rgba(191,0,170,0.9)',
            'commandsTextColor': '#ffffff',
            'commandsTimeColor': '#bf00aa',
            'commandsNickColor': '#ffffff',
            'chatBoxColor': 'rgba(0,0,0,0.4)',
            'chatScale': 0x1,
            'miniMapSectorsColor': '#ffffff',
            'miniMapSectorColor': '#01d9cc',
            'miniMapGuidesColor': '#bf00aa',
            'miniMapNickColor': '#ffffff',
            'miniMapNickStrokeColor': '#000000',
            'miniMapMyCellColor': '#ffffff',
            'miniMapMyCellStrokeColor': '#bf00aa',
            'miniMapTeammatesColor': '#01d9cc',
            'miniMapDeathLocationColor': '#bf00aa',
            'miniMapFont': 'ubuntu-bold',
            'miniMapNickFont': 'ubuntu-bold',
            'miniMapWidth': 0xf0,
            'miniMapSectorsOpacity': 0.1,
            'miniMapNickSize': 0xb,
            'miniMapNickStrokeSize': 0x2,
            'miniMapMyCellSize': 7.5,
            'miniMapMyCellStrokeSize': 0x4,
            'miniMapTeammatesSize': 5.5,
            'customBackground': '',
            'customCursor': 'https://cdn.ogario.ovh/static/img/cursors/cursor_02.cur'
        },
        'ogario-orange': {
            'name': 'OGARio v2',
            'darkTheme': true,
            'mainColor': '#ff7800',
            'bgColor': '#111111',
            'bordersColor': '#ff7800',
            'gridColor': '#292929',
            'sectorsColor': '#292929',
            'namesColor': '#ffffff',
            'namesStrokeColor': '#000000',
            'massColor': '#ffffff',
            'massStrokeColor': '#000000',
            'virusColor': '#666666',
            'virusStrokeColor': '#666666',
            'foodColor': '#e16400',
            'hudMainColor': '#ff7800',
            'statsHudColor': '#ff7800',
            'top5MassColor': '#ff7800',
            'timeHudColor': '#ff7800',
            'messageNickColor': '#ff7800',
            'commandsColor': 'rgba(255,120,0,0.9)',
            'commandsTimeColor': '#ff7800',
            'commandsTextColor': '#ffffff',
            'miniMapSectorsColor': '#ffffff',
            'miniMapSectorColor': '#ff7800',
            'miniMapGuidesColor': '#ff7800',
            'miniMapMyCellColor': '#ffffff',
            'miniMapMyCellStrokeColor': '#ff7800',
            'miniMapTeammatesColor': '#ff7800',
            'miniMapDeathLocationColor': '#ff7800',
            'miniMapSectorsOpacity': 0.1
        },
        'ogario-gold': {
            'name': 'OGARio LE',
            'darkTheme': true,
            'mainColor': '#b5a642',
            'bgColor': '#000000',
            'bordersColor': '#b5a642',
            'gridColor': '#111111',
            'sectorsColor': '#111111',
            'namesColor': '#ffffff',
            'namesStrokeColor': '#000000',
            'massColor': '#ffffff',
            'massStrokeColor': '#000000',
            'virusColor': '#666666',
            'virusStrokeColor': '#666666',
            'foodColor': '#998c36',
            'hudMainColor': '#b5a642',
            'statsHudColor': '#b5a642',
            'top5MassColor': '#b5a642',
            'timeHudColor': '#b5a642',
            'messageNickColor': '#b5a642',
            'commandsColor': 'rgba(181,166,66,0.9)',
            'commandsTimeColor': '#b5a642',
            'commandsTextColor': '#ffffff',
            'miniMapSectorsColor': '#ffffff',
            'miniMapSectorColor': '#b5a642',
            'miniMapGuidesColor': '#b5a642',
            'miniMapMyCellColor': '#ffffff',
            'miniMapMyCellStrokeColor': '#b5a642',
            'miniMapTeammatesColor': '#b5a642',
            'miniMapDeathLocationColor': '#b5a642',
            'miniMapSectorsOpacity': 0.1
        },
        'sniikz-style': {
            'name': 'SniiKz\'s Style',
            'darkTheme': true,
            'mainColor': '#01d9cc',
            'bgColor': '#000000',
            'bordersColor': '#ffffff',
            'gridColor': '#00243e',
            'sectorsColor': '#00243e',
            'namesColor': '#ffffff',
            'namesStrokeColor': '#000000',
            'massColor': '#ffffff',
            'massStrokeColor': '#000000',
            'virusColor': '#3b3b3b',
            'virusStrokeColor': '#ffffff',
            'foodColor': '#5000ff',
            'teammatesIndColor': '#ffffff',
            'cursorTrackingColor': '#ffffff',
            'splitRangeColor': '#ffffff',
            'safeAreaColor': '#ffffff',
            'dangerAreaColor': '#bf00aa',
            'massScale': 0x4,
            'foodSize': 0x1,
            'bordersWidth': 0x28,
            'sectorsWidth': 0x28,
            'sectorsFontSize': 0x4b0,
            'cellsAlpha': 0.99,
            'skinsAlpha': 0.7,
            'virusAlpha': 0.4,
            'virusStrokeSize': 0xa,
            'menuPreset': 'ogario-v3',
            'menuMainColor': '#fc0079',
            'menuBtnTextColor': '#ffffff',
            'menuPanelColor': '#050008',
            'menuPanelColor2': '#1d0526',
            'menuTextColor': '#ffffff',
            'menuTextColor2': '#65458f',
            'btn1Color': '#4f0242',
            'btn1Color2': '#3b0431',
            'btn2Color': '#6b0036',
            'btn2Color2': '#4d0227',
            'btn3Color': '#aa084e',
            'btn3Color2': '#80063b',
            'btn4Color': '#aa084e',
            'btn4Color2': '#8a063f',
            'menuBg': 'https://cdn.ogario.ovh/static/img/pattern.png',
            'menuOpacity': 0x1,
            'hudMainColor': '#5974ff',
            'hudColor': 'rgba(36,36,36,0.49)',
            'hudTextColor': '#ffffff',
            'statsHudColor': '#ffffff',
            'timeHudColor': '#737373',
            'top5MassColor': '#1fe000',
            'lbMeColor': '#bf00aa',
            'lbTeammateColor': '#018cf6',
            'hudScale': 1.15,
            'messageColor': 'rgba(0,0,0,0.4)',
            'messageTextColor': '#e8e8e8',
            'messageTimeColor': '#545454',
            'messageNickColor': '#05ff00',
            'commandsColor': 'rgba(36,36,36,0.9)',
            'commandsTextColor': '#ffffff',
            'commandsTimeColor': '#545454',
            'commandsNickColor': '#ffffff',
            'chatBoxColor': 'rgba(0,0,0,0.4)',
            'chatScale': 0x1,
            'miniMapSectorsColor': '#ffffff',
            'miniMapSectorColor': '#000000',
            'miniMapGuidesColor': '#ff00a8',
            'miniMapNickColor': '#ffffff',
            'miniMapNickStrokeColor': '#4d4d4d',
            'miniMapMyCellColor': '#f0ff3d',
            'miniMapMyCellStrokeColor': '#acba07',
            'miniMapTeammatesColor': '#305eff',
            'miniMapDeathLocationColor': '#2b2b2b',
            'miniMapWidth': 0xfa,
            'miniMapSectorsOpacity': 0.1,
            'miniMapNickSize': 0x9,
            'miniMapNickStrokeSize': 0x0,
            'miniMapMyCellSize': 0x5,
            'miniMapMyCellStrokeSize': 0x0,
            'miniMapTeammatesSize': 0x5,
            'customBackground': '',
            'customCursor': 'https://cdn.ogario.ovh/static/img/cursors/cursor_01.cur'
        },
        'hkg-style': {
            'name': 'HKG Style',
            'darkTheme': true,
            'mainColor': '#651fff',
            'bgColor': '#000000',
            'bordersColor': '#ffffff',
            'gridColor': '#111111',
            'sectorsColor': '#111111',
            'namesColor': '#ffffff',
            'namesStrokeColor': '#000000',
            'massColor': '#ffffff',
            'massStrokeColor': '#000000',
            'virusColor': '#666666',
            'virusStrokeColor': '#666666',
            'foodColor': '#651fff',
            'hudMainColor': '#651fff',
            'statsHudColor': '#651fff',
            'top5MassColor': '#651fff',
            'timeHudColor': '#651fff',
            'messageNickColor': '#651fff',
            'commandsColor': 'rgba(101,31,255,0.9)',
            'commandsTimeColor': '#651fff',
            'commandsTextColor': '#ffffff',
            'miniMapSectorsColor': '#ffffff',
            'miniMapSectorColor': '#651fff',
            'miniMapGuidesColor': '#651fff',
            'miniMapMyCellColor': '#ffffff',
            'miniMapMyCellStrokeColor': '#651fff',
            'miniMapTeammatesColor': '#651fff',
            'miniMapDeathLocationColor': '#651fff',
            'miniMapSectorsOpacity': 0.1
        },
        'agario-light': {
            'name': 'Agar.io Light',
            'darkTheme': false,
            'mainColor': '#ffffff',
            'bgColor': '#f2fbff',
            'bordersColor': '#858a8c',
            'gridColor': '#ced6d9',
            'sectorsColor': '#ced6d9',
            'namesColor': '#ffffff',
            'namesStrokeColor': '#000000',
            'massColor': '#ffffff',
            'massStrokeColor': '#000000',
            'virusColor': '#33ff33',
            'virusStrokeColor': '#2de52d',
            'foodColor': '#2de52d',
            'hudMainColor': '#ffffff',
            'statsHudColor': '#ffffff',
            'top5MassColor': '#ffffff',
            'timeHudColor': '#ffffff',
            'messageNickColor': '#ffffff',
            'commandsColor': 'rgba(255,255,255,0.9)',
            'commandsTimeColor': '#ffffff',
            'commandsTextColor': '#000000',
            'miniMapSectorsColor': '#ffffff',
            'miniMapSectorColor': '#ffffff',
            'miniMapGuidesColor': '#ffffff',
            'miniMapMyCellColor': '#ffffff',
            'miniMapMyCellStrokeColor': '#ffffff',
            'miniMapTeammatesColor': '#ffffff',
            'miniMapDeathLocationColor': '#ffffff',
            'miniMapSectorsOpacity': 0.25
        },
        'agario-dark': {
            'name': 'Agar.io Dark',
            'darkTheme': true,
            'mainColor': '#ffffff',
            'bgColor': '#111111',
            'bordersColor': '#999999',
            'gridColor': '#333333',
            'sectorsColor': '#333333',
            'namesColor': '#ffffff',
            'namesStrokeColor': '#000000',
            'massColor': '#ffffff',
            'massStrokeColor': '#000000',
            'virusColor': '#33ff33',
            'virusStrokeColor': '#2de52d',
            'foodColor': '#2de52d',
            'hudMainColor': '#ffffff',
            'statsHudColor': '#ffffff',
            'top5MassColor': '#ffffff',
            'timeHudColor': '#ffffff',
            'messageNickColor': '#ffffff',
            'commandsColor': 'rgba(255,255,255,0.9)',
            'commandsTimeColor': '#ffffff',
            'commandsTextColor': '#ffffff',
            'miniMapSectorsColor': '#ffffff',
            'miniMapSectorColor': '#ffffff',
            'miniMapGuidesColor': '#ffffff',
            'miniMapMyCellColor': '#ffffff',
            'miniMapMyCellStrokeColor': '#ffffff',
            'miniMapTeammatesColor': '#ffffff',
            'miniMapDeathLocationColor': '#ffffff',
            'miniMapSectorsOpacity': 0.1
        }
    };
    var INTERFACE_THEME = {
        'ogario-v3': {
            'name': 'OGARio v3',
            'menuMainColor': '#01d9cc',
            'menuBtnTextColor': '#ffffff',
            'menuPanelColor': '#00243e',
            'menuPanelColor2': '#002f52',
            'menuTextColor': '#ffffff',
            'menuTextColor2': '#8096a7',
            'btn1Color': '#018cf6',
            'btn1Color2': '#0176ce',
            'btn2Color': '#00b9e8',
            'btn2Color2': '#0099c0',
            'btn3Color': '#8d5fe6',
            'btn3Color2': '#814ee3',
            'btn4Color': '#f300d8',
            'btn4Color2': '#df00c6',
            'menuBg': 'https://cdn.ogario.ovh/static/img/pattern.png'
        },
        'ogario-v2': {
            'name': 'OGARio v2',
            'menuMainColor': '#ff7800',
            'menuBtnTextColor': '#ffffff',
            'menuPanelColor': '#222222',
            'menuPanelColor2': '#333333',
            'menuTextColor': '#bbbbbb',
            'menuTextColor2': '#bbbbbb',
            'btn1Color': '#428bca',
            'btn1Color2': '#3071a9',
            'btn2Color': '#5cb85c',
            'btn2Color2': '#449d44',
            'btn3Color': '#f0ad4e',
            'btn3Color2': '#ec971f',
            'btn4Color': '#d9534f',
            'btn4Color2': '#c9302c',
            'menuBg': ''
        },
        'agario': {
            'name': 'Agar.io',
            'menuMainColor': '#5bc0de',
            'menuBtnTextColor': '#ffffff',
            'menuPanelColor': '#ffffff',
            'menuPanelColor2': '#cccccc',
            'menuTextColor': '#333333',
            'menuTextColor2': '#999999',
            'btn1Color': '#428bca',
            'btn1Color2': '#3071a9',
            'btn2Color': '#5cb85c',
            'btn2Color2': '#449d44',
            'btn3Color': '#f0ad4e',
            'btn3Color2': '#ec971f',
            'btn4Color': '#d9534f',
            'btn4Color2': '#c9302c',
            'menuBg': ''
        }
    };

    var INTERFACE_HELPER = {
        'menuMainColorCSS': null,
        'menuPanelColorCSS': null,
        'menuTextlColorCSS': null,
        'menuButtonsCSS': null,
        'hudCSS': null,
        'chatCSS': null,
        'chatScaleCSS': null,
        'cursorCSS': null,
        'loadThemeSettings': function () {
            var _0x34a916 = null;
            if (window.localStorage.getItem('ogarioThemeSettings') !== null) {
                _0x34a916 = JSON.parse(window.localStorage.getItem('ogarioThemeSettings'));
            }
            for (var _0xac9e75 in PRESET) {
                if (PRESET.hasOwnProperty(_0xac9e75)) {
                    if (_0x34a916 && _0x34a916.hasOwnProperty(_0xac9e75)) {
                        PRESET[_0xac9e75] = _0x34a916[_0xac9e75];
                    }
                    if (CLIENT2.hasOwnProperty(_0xac9e75)) {
                        CLIENT2[_0xac9e75] = PRESET[_0xac9e75];
                    }
                }
            }
        },
        'saveThemeSettings': function () {
            window.localStorage.setItem('ogarioThemeSettings', JSON.stringify(PRESET));
        },
        'restoreThemeSettings': function () {
            if (window.localStorage.getItem('ogarioThemeSettings') !== null) {
                window.localStorage.removeItem('ogarioThemeSettings');
                window.location.reload();
            }
        },
        'addCustomCSS': function (_0x343fc7, _0x561362) {
            if (!this[_0x343fc7]) {
                this[_0x343fc7] = $('<style type=\'text/css\'>').appendTo('head');
            }
            this[_0x343fc7].html(_0x561362);
        },
        'addPresetBox': function (_0x9a1161, _0x47ee08, _0x45be4d, _0x2ec210, _0x1f2e18) {
            $(_0x9a1161).append('<div class="preset-box"><span class="title-box">' + i18n[_0x47ee08] + '</span><div class="select-wrapper"><select id="' + _0x47ee08 + '" class="form-control"></select></div></div>');
            for (var _0x359aeb in _0x45be4d) {
                if (_0x45be4d.hasOwnProperty(_0x359aeb)) {
                    $('#' + _0x47ee08).append('<option value="' + _0x359aeb + '\">' + _0x45be4d[_0x359aeb].name + '</option>');
                }
            }
            $('#' + _0x47ee08).val(PRESET[_0x2ec210]);
            var _0x29e893 = this;
            $('#' + _0x47ee08).on('change', function () {
                var _0x359aeb = this.value;
                PRESET[_0x2ec210] = _0x359aeb;
                _0x29e893[_0x1f2e18](_0x359aeb);
            });
        },
        'addColorBox': function (_0x3d2f8e, _0x12abd8, _0x21ad3b) {
            $(_0x3d2f8e).append('<div class="color-box"><span class="title-box">' + i18n[_0x12abd8] + '</span><div class="input-group ' + _0x12abd8 + '-picker\"><input type=\"text\" value=\"' + PRESET[_0x12abd8] + '" id="' + _0x12abd8 + '\" class=\"form-control\" /><span class=\"input-group-addon\"><i></i></span></div></div>');
            if (_0x21ad3b) {
                var _0x35e01d = this;
                $(_0x3d2f8e + ' .' + _0x12abd8 + '-picker').colorpicker({
                    'format': 'hex'
                }).on('changeColor.colorpicker', function (_0x2b4926) {
                    PRESET[_0x12abd8] = _0x2b4926.color.toHex();
                    if (CLIENT2.hasOwnProperty(_0x12abd8)) {
                        CLIENT2[_0x12abd8] = PRESET[_0x12abd8];
                    }
                    _0x35e01d[_0x21ad3b]();
                });
            } else {
                $(_0x3d2f8e + ' .' + _0x12abd8 + '-picker').colorpicker({
                    'format': 'hex'
                }).on('changeColor.colorpicker', function (_0x52907c) {
                    PRESET[_0x12abd8] = _0x52907c.color.toHex();
                    if (CLIENT2.hasOwnProperty(_0x12abd8)) {
                        CLIENT2[_0x12abd8] = PRESET[_0x12abd8];
                    }
                });
            }
        },
        'addRgbaColorBox': function (_0x94377a, _0x123f8d, _0x383d2e) {
            $(_0x94377a).append('<div class="color-box"><span class="title-box">' + i18n[_0x123f8d] + '</span><div class="input-group ' + _0x123f8d + '-picker\"><input type=\"text\" value=\"' + PRESET[_0x123f8d] + '\" id=\"' + _0x123f8d + '\" class=\"form-control\" /><span class=\"input-group-addon\"><i></i></span></div></div>');
            if (_0x383d2e) {
                var _0x1e800d = this;
                $(_0x94377a + ' .' + _0x123f8d + '-picker').colorpicker({
                    'format': 'rgba'
                }).on('changeColor.colorpicker', function (_0x55ec04) {
                    var _0x3a85a8 = _0x55ec04.color.toRGB();
                    PRESET[_0x123f8d] = 'rgba(' + _0x3a85a8.r + ',' + _0x3a85a8.g + ',' + _0x3a85a8.b + ',' + _0x3a85a8.a + ')';
                    if (CLIENT2.hasOwnProperty(_0x123f8d)) {
                        CLIENT2[_0x123f8d] = PRESET[_0x123f8d];
                    }
                    _0x1e800d[_0x383d2e]();
                });
            } else {
                $(_0x94377a + ' .' + _0x123f8d + '-picker').colorpicker({
                    'format': 'rgba'
                }).on('changeColor.colorpicker', function (_0x3ccaa9) {
                    var _0x10fa73 = _0x3ccaa9.color.toRGB();
                    PRESET[_0x123f8d] = 'rgba(' + _0x10fa73.r + ',' + _0x10fa73.g + ',' + _0x10fa73.b + ',' + _0x10fa73.a + ')';
                    if (CLIENT2.hasOwnProperty(_0x123f8d)) {
                        CLIENT2[_0x123f8d] = PRESET[_0x123f8d];
                    }
                });
            }
        },
        'addSliderBox': function (_0x3c1f56, _0x373a4e, _0x367b30, _0x1c7b3a, _0x101151, _0x1e3a7f) {
            $(_0x3c1f56).append('<div class="slider-box"><div class="box-label"><span class="value-label">' + i18n[_0x373a4e] + ': </span><span id="' + _0x373a4e + '-value\" class=\"value\">' + PRESET[_0x373a4e] + '</span></div><input id="' + _0x373a4e + '-slider" type="range" min="' + _0x367b30 + '" max="' + _0x1c7b3a + '" step="' + _0x101151 + '\" value=\"' + PRESET[_0x373a4e] + '\"></div>');
            if (_0x1e3a7f) {
                var _0x1aed11 = this;
                $('#' + _0x373a4e + '-slider').on('input', function () {
                    var _0x335824 = parseFloat($(this).val());
                    $('#' + _0x373a4e + '-value').text(_0x335824);
                    PRESET[_0x373a4e] = _0x335824;
                    if (CLIENT2.hasOwnProperty(_0x373a4e)) {
                        CLIENT2[_0x373a4e] = _0x335824;
                    }
                    _0x1aed11[_0x1e3a7f]();
                });
            } else {
                $('#' + _0x373a4e + '-slider').on('input', function () {
                    var _0x597925 = parseFloat($(this).val());
                    $('#' + _0x373a4e + '-value').text(_0x597925);
                    PRESET[_0x373a4e] = _0x597925;
                    if (CLIENT2.hasOwnProperty(_0x373a4e)) {
                        CLIENT2[_0x373a4e] = _0x597925;
                    }
                });
            }
        },
        'addInputBox': function (_0x3029af, _0x1078ea, _0x24a85c, _0x2f3ce7) {
            $(_0x3029af).append('<div class="input-box"><span class="title-box">' + i18n[_0x1078ea] + '</span><input id="' + _0x1078ea + '" class="form-control" placeholder="' + _0x24a85c + '" value="' + PRESET[_0x1078ea] + '" /></div>');
            var _0xd5bb42 = this;
            $('#' + _0x1078ea).on('input', function () {
                PRESET[_0x1078ea] = this.value;
                _0xd5bb42[_0x2f3ce7]();
            });
        },
        'addCursorBox': function (_0x2d4470, _0x7a9d69) {
            if (_0x7a9d69 === PRESET.customCursor) {
                $(_0x2d4470).append('<div class="cursor-box"><a href="#" class="active"><img src="' + _0x7a9d69 + '"></a></div>');
            } else {
                $(_0x2d4470).append('<div class="cursor-box"><a href="#"><img src="' + _0x7a9d69 + '"></a></div>');
            }
        },
        'setFont': function (_0x1d96bc, _0x211b42) {
            PRESET[_0x1d96bc] = _0x211b42;
            PRESET[_0x1d96bc + 'Family'] = this.setFontFamily(_0x211b42);
            PRESET[_0x1d96bc + 'Weight'] = this.setFontWeight(_0x211b42);
            if (CLIENT2.hasOwnProperty(_0x1d96bc + 'Family')) {
                CLIENT2[_0x1d96bc + 'Family'] = PRESET[_0x1d96bc + 'Family'];
            }
            if (CLIENT2.hasOwnProperty(_0x1d96bc + 'Weight')) {
                CLIENT2[_0x1d96bc + 'Weight'] = PRESET[_0x1d96bc + 'Weight'];
            }
        },
        'addFontBox': function (_0x3ac1f7, _0x54f25e, _0x4adbf6) {
            $(_0x3ac1f7).append('<div class="font-box"><span class="title-box">' + i18n[_0x54f25e] + '</span><div class="select-wrapper"><select id="' + _0x54f25e + '" class="form-control"></select></div></div>');
            $('#' + _0x54f25e).append('<option value=\"ubuntu\">Ubuntu</option><option value=\"ubuntu-bold\">Ubuntu Bold</option>');
            $('#' + _0x54f25e).append('<option value="roboto">Roboto</option><option value="roboto-bold">Roboto Bold</option>');
            $('#' + _0x54f25e).append('<option value="oswald">Oswald</option><option value="oswald-bold">Oswald Bold</option>');
            $('#' + _0x54f25e).val(PRESET[_0x54f25e]);
            var _0x3931f8 = this;
            if (_0x4adbf6) {
                $('#' + _0x54f25e).on('change', function () {
                    var _0x1f4421 = this.value;
                    _0x3931f8.setFont(_0x54f25e, _0x1f4421);
                    _0x3931f8[_0x4adbf6]();
                });
            } else {
                $('#' + _0x54f25e).on('change', function () {
                    var _0x3b99f0 = this.value;
                    _0x3931f8.setFont(_0x54f25e, _0x3b99f0);
                });
            }
        },
        'setFontFamily': function (_0xdb5058) {
            if (_0xdb5058.indexOf('roboto') != -0x1) {
                return 'Roboto';
            } else if (_0xdb5058.indexOf('oswald') != -0x1) {
                return 'Oswald';
            } else {
                return 'Ubuntu';
            }
        },
        'setFontWeight': function (_0x5d7a46) {
            if (_0x5d7a46.indexOf('bold') != -0x1) {
                return 0x2bc;
            }
            return 0x190;
        },
        'setThemeMenu': function () {
            var _0x195478 = this;
            $('#theme').append('<ul class=\"submenu-tabs\"><li class=\"theme-main-tab active\"><a href=\"#theme-main\" class=\"active ogicon-paint-format\" data-toggle=\"tab-tooltip\" title=\"' + i18n.basicTheming + '\"></a></li><li class=\"theme-menu-tab\"><a href=\"#theme-menu\" class=\"ogicon-menu\" data-toggle=\"tab-tooltip\" title=\"' + i18n.menuTheming + '"></a></li><li class="theme-hud-tab"><a href="#theme-hud" class="ogicon-display" data-toggle="tab-tooltip" title="' + i18n.hudTheming + '"></a></li><li class="theme-chat-tab"><a href="#theme-chat" class="ogicon-bubbles" data-toggle="tab-tooltip" title="' + i18n.chatTheming + '"></a></li><li class="theme-minimap-tab"><a href="#theme-minimap" class="ogicon-location2" data-toggle="tab-tooltip" title="' + i18n.miniMapTheming + '"></a></li><li class="theme-images-tab"><a href="#theme-images" class="ogicon-compass" data-toggle="tab-tooltip" title="' + i18n.imagesTheming + '"></a></li></ul><div id="theme-main" class="submenu-panel"></div><div id="theme-menu" class="submenu-panel"></div><div id="theme-hud" class="submenu-panel"></div><div id="theme-chat" class="submenu-panel"></div><div id="theme-minimap" class="submenu-panel"></div><div id="theme-images" class="submenu-panel"></div>');
            this.addPresetBox('#theme-main', 'themePreset', THEMES, 'preset', 'changeThemePreset');
            this.addColorBox('#theme-main', 'bgColor', 'setBgColor');
            this.addColorBox('#theme-main', 'bordersColor');
            this.addColorBox('#theme-main', 'gridColor');
            this.addColorBox('#theme-main', 'sectorsColor');
            this.addColorBox('#theme-main', 'namesColor');
            this.addColorBox('#theme-main', 'namesStrokeColor');
            this.addColorBox('#theme-main', 'massColor');
            this.addColorBox('#theme-main', 'massStrokeColor');
            this.addColorBox('#theme-main', 'virusColor');
            this.addColorBox('#theme-main', 'virusStrokeColor');
            this.addColorBox('#theme-main', 'foodColor', 'setFoodColor');
            this.addColorBox('#theme-main', 'teammatesIndColor', 'setIndicatorColor');
            this.addColorBox('#theme-main', 'cursorTrackingColor');
            this.addColorBox('#theme-main', 'splitRangeColor');
            this.addColorBox('#theme-main', 'safeAreaColor');
            this.addColorBox('#theme-main', 'dangerAreaColor');
            this.addColorBox('#theme-main', 'ghostCellsColor');//c1
            this.addFontBox('#theme-main', 'namesFont');
            this.addFontBox('#theme-main', 'massFont');
            this.addFontBox('#theme-main', 'sectorsFont');
            this.addSliderBox('#theme-main', 'sectorsFontSize', 0xc8, 0x7d0, 0xa);
            this.addSliderBox('#theme-main', 'namesScale', 0.5, 0x2, 0.1);
            this.addSliderBox('#theme-main', 'massScale', 0x1, 0x5, 0x1);
            this.addSliderBox('#theme-main', 'virMassScale', 0x1, 0x5, 0x1);
            this.addSliderBox('#theme-main', 'strokeScale', 0x1, 0x4, 0.1);
            this.addSliderBox('#theme-main', 'foodSize', 0x1, 0x32, 0x1, 'setFoodColor');
            this.addSliderBox('#theme-main', 'virusStrokeSize', 0x2, 0x28, 0x1);
            this.addSliderBox('#theme-main', 'bordersWidth', 0x2, 0xc8, 0x2);
            this.addSliderBox('#theme-main', 'sectorsWidth', 0x2, 0xc8, 0x2);
            this.addSliderBox('#theme-main', 'cellsAlpha', 0.01, 0.99, 0.01);
            this.addSliderBox('#theme-main', 'skinsAlpha', 0.01, 0.99, 0.01);
            this.addSliderBox('#theme-main', 'virusAlpha', 0x0, 0x1, 0.01);
            this.addSliderBox('#theme-main', 'textAlpha', 0.1, 0x1, 0.01);
            this.addPresetBox('#theme-menu', 'menuPreset', INTERFACE_THEME, 'menuPreset', 'changeMenuPreset');
            this.addSliderBox('#theme-menu', 'menuOpacity', 0.1, 0x1, 0.01, 'setMenuOpacity');
            this.addColorBox('#theme-menu', 'menuMainColor', 'setMenuMainColor');
            this.addColorBox('#theme-menu', 'menuBtnTextColor', 'setMenuButtons');
            this.addColorBox('#theme-menu', 'menuPanelColor', 'setMenuPanelColor');
            this.addColorBox('#theme-menu', 'menuPanelColor2', 'setMenuPanelColor');
            this.addColorBox('#theme-menu', 'menuTextColor', 'setMenuTextColor');
            this.addColorBox('#theme-menu', 'menuTextColor2', 'setMenuTextColor');
            this.addColorBox('#theme-menu', 'btn1Color', 'setMenuButtons');
            this.addColorBox('#theme-menu', 'btn1Color2', 'setMenuButtons');
            this.addColorBox('#theme-menu', 'btn2Color', 'setMenuButtons');
            this.addColorBox('#theme-menu', 'btn2Color2', 'setMenuButtons');
            this.addColorBox('#theme-menu', 'btn3Color', 'setMenuButtons');
            this.addColorBox('#theme-menu', 'btn3Color2', 'setMenuButtons');
            this.addColorBox('#theme-menu', 'btn4Color', 'setMenuButtons');
            this.addColorBox('#theme-menu', 'btn4Color2', 'setMenuButtons');
            this.addInputBox('#theme-menu', 'menuBg', 'Image URL', 'setMenuBg');
            this.addColorBox('#theme-hud', 'hudMainColor', 'setHudColors');
            this.addRgbaColorBox('#theme-hud', 'hudColor', 'setHudColors');
            this.addColorBox('#theme-hud', 'hudTextColor', 'setHudColors');
            this.addColorBox('#theme-hud', 'statsHudColor', 'setHudColors');
            this.addColorBox('#theme-hud', 'timeHudColor', 'setHudColors');
            this.addColorBox('#theme-hud', 'top5MassColor', 'setHudColors');
            this.addColorBox('#theme-hud', 'lbMeColor', 'setHudColors');
            this.addColorBox('#theme-hud', 'lbTeammateColor', 'setHudColors');
            this.addFontBox('#theme-hud', 'hudFont', 'setHudFont');
            this.addSliderBox('#theme-hud', 'hudScale', 0x1, 0x2, 0.01, 'setHudScale');
            this.addRgbaColorBox('#theme-chat', 'messageColor', 'setChatColors');
            this.addColorBox('#theme-chat', 'messageTextColor', 'setChatColors');
            this.addColorBox('#theme-chat', 'messageTimeColor', 'setChatColors');
            this.addColorBox('#theme-chat', 'messageNickColor', 'setChatColors');
            this.addRgbaColorBox('#theme-chat', 'commandsColor', 'setChatColors');
            this.addColorBox('#theme-chat', 'commandsTextColor', 'setChatColors');
            this.addColorBox('#theme-chat', 'commandsTimeColor', 'setChatColors');
            this.addColorBox('#theme-chat', 'commandsNickColor', 'setChatColors');
            this.addRgbaColorBox('#theme-chat', 'chatBoxColor', 'setChatColors');
            this.addSliderBox('#theme-chat', 'chatScale', 0x1, 0x2, 0.01, 'setChatScale');
            this.addColorBox('#theme-minimap', 'miniMapSectorsColor', 'setMiniMapSectorsColor');
            this.addColorBox('#theme-minimap', 'miniMapSectorColor');
            this.addColorBox('#theme-minimap', 'miniMapNickColor');
            this.addColorBox('#theme-minimap', 'miniMapNickStrokeColor');
            this.addColorBox('#theme-minimap', 'miniMapMyCellColor');
            this.addColorBox('#theme-minimap', 'miniMapMyCellStrokeColor');
            this.addColorBox('#theme-minimap', 'miniMapTeammatesColor');
            this.addColorBox('#theme-minimap', 'miniMapDeathLocationColor');
            this.addColorBox('#theme-minimap', 'miniMapGuidesColor');
            this.addColorBox('#theme-minimap', 'miniMapGhostCellsColor'); //c1
            this.addFontBox('#theme-minimap', 'miniMapFont', 'setMiniMapFont');
            this.addFontBox('#theme-minimap', 'miniMapNickFont');
            this.addSliderBox('#theme-minimap', 'miniMapWidth', 0xc8, 0x190, 0x2, 'setMiniMapWidth');
            this.addSliderBox('#theme-minimap', 'miniMapSectorsOpacity', 0x0, 0x1, 0.01, 'setMiniMapSectorsOpacity');
            this.addSliderBox('#theme-minimap', 'miniMapNickSize', 0x8, 0x10, 0x1);
            this.addSliderBox('#theme-minimap', 'miniMapNickStrokeSize', 0x0, 0x6, 0x1);
            this.addSliderBox('#theme-minimap', 'miniMapMyCellSize', 0x4, 0xa, 0.5);
            this.addSliderBox('#theme-minimap', 'miniMapMyCellStrokeSize', 0x0, 0xa, 0x1);
            this.addSliderBox('#theme-minimap', 'miniMapTeammatesSize', 0x4, 0xa, 0.5);
            this.addSliderBox('#theme-minimap', 'miniMapGhostCellsAlpha', 0.01, 0.99, 0.01);//c1

            this.addInputBox('#theme-images', 'customBackground', 'Image URL', 'setCustomBackground');
            this.addInputBox('#theme-images', 'customCursor', 'Cursor image URL', 'setCustomCursor');
            var _0x5b054a = 'https://cdn.ogario.ovh/static/img/cursors/cursor_';
            for (var _0x5bde53 = 0x0; _0x5bde53 < 0x23; _0x5bde53++) {
                if (_0x5bde53 < 0x9) {
                    this.addCursorBox('#theme-images', _0x5b054a + '0' + (_0x5bde53 + 0x1) + '.cur');
                    continue;
                }
                this.addCursorBox('#theme-images', _0x5b054a + '' + (_0x5bde53 + 0x1) + '.cur');
            }
            $(document).on('click', '#theme-images .cursor-box a', function (_0x46c427) {
                _0x46c427.preventDefault();
                var _0x4231b1 = $('img', this).attr('src');
                PRESET.customCursor = _0x4231b1;
                _0x195478.setCustomCursor();
                $('#customCursor').val(_0x4231b1);
                $('#theme-images .cursor-box a').removeClass('active');
                $(this).addClass('active');
            });
            $('#theme').append('<button class="btn btn-block btn-success btn-save"">' + i18n.saveSett + '</button>');
            $(document).on('click', '#theme .btn-save', function (_0x2999b1) {
                _0x2999b1.preventDefault();
                var _0x57ebfe = $(this);
                _0x57ebfe.text(i18n.saved);
                _0x195478.saveThemeSettings();
                setTimeout(function () {
                    _0x57ebfe.text(i18n.saveSett);
                }, 0x1f4);
            });
            $('#theme').append('<div class="restore-settings"><a href="#">' + i18n.restoreThemeSettings + '</a></div>');
            $(document).on('click', '#theme .restore-settings a', function (_0x1b5c47) {
                _0x1b5c47.preventDefault();
                _0x195478.restoreThemeSettings();
            });
            $('.skin').colorpicker({
                'format': 'hex',
                'input': '#color'
            });
        },
        'changePreset': function (_0x5c7470, _0x34e70f) {
            if (_0x34e70f[_0x5c7470]) {
                PRESET[_0x5c7470] = _0x5c7470;
                var _0x5c7470 = _0x34e70f[_0x5c7470];
            } else {
                return;
            }
            for (var _0x27fd34 in _0x5c7470) {
                if (_0x5c7470.hasOwnProperty(_0x27fd34) && PRESET.hasOwnProperty(_0x27fd34)) {
                    PRESET[_0x27fd34] = _0x5c7470[_0x27fd34];
                    if (CLIENT2.hasOwnProperty(_0x27fd34)) {
                        CLIENT2[_0x27fd34] = PRESET[_0x27fd34];
                    }
                    if ($('#theme .' + _0x27fd34 + '-picker')) {
                        $('#theme .' + _0x27fd34 + '-picker').colorpicker('setValue', PRESET[_0x27fd34]);
                    }
                    if ($('#' + _0x27fd34 + '-slider')) {
                        $('#' + _0x27fd34 + '-slider').val(PRESET[_0x27fd34]).change();
                    }
                    if ($('input[type=text]#' + _0x27fd34) || $('select#' + _0x27fd34)) {
                        $('#' + _0x27fd34).val(PRESET[_0x27fd34]);
                    }
                }
            }
        },
        'changeThemePreset': function (_0x5ef416) {
            this.changePreset(_0x5ef416, THEMES);
            this.setTheme();
        },
        'setFonts': function () {
            this.setFont('namesFont', PRESET.namesFont);
            this.setFont('massFont', PRESET.namesFont);
            this.setFont('sectorsFont', PRESET.sectorsFont);
        },
        'setBgColor': function () {
            $('body').css('background-color', PRESET.bgColor);
        },
        'setFoodColor': function () {
            if (!CLIENT_SETTINGS.optimizedFood) {
                return;
            }
            WORLD && WORLD.preDrawPellet();
        },
        'setIndicatorColor': function () {
            WORLD && WORLD.preDrawIndicator();
        },
        'setCustomBackground': function () {
            if (PRESET.customBackground) {
                $('body').css('background-image', 'url(' + PRESET.customBackground + ')');
            } else {
                $('body').css('background-image', 'none');
            }
        },
        'setCustomCursor': function () {
            if (PRESET.customCursor) {
                var _0x53897c = '*{cursor:url(' + PRESET.customCursor + '), auto !important}';
            } else {
                var _0x53897c = '*{cursor: auto}';
            }
            this.addCustomCSS('cursorCSS', _0x53897c);
        },
        'setMenu': function () {
            this.setMenuOpacity();
            this.setMenuMainColor();
            this.setMenuPanelColor();
            this.setMenuTextColor();
            this.setMenuButtons();
            this.setMenuBg();
        },
        'changeMenuPreset': function (_0x19ddc6) {
            this.changePreset(_0x19ddc6, INTERFACE_THEME);
            this.setMenu();
        },
        'setMenuOpacity': function () {
            $('#helloContainer, #hotkeys, #exp-imp').css('opacity', PRESET.menuOpacity);
        },
        'setMenuMainColor': function () {
            var _0x5dc305 = '::-moz-selection{background-color:' + PRESET.menuMainColor + '!important}::selection{background-color:' + PRESET.menuMainColor + '!important}.menu-main-color,#quick-menu a:hover,.quick,.quick:focus,.menu-tabs a:hover,.menu-tabs .active,.submenu-tabs a:hover,.submenu-tabs .active,#stats center,#exp-imp h1{color:' + PRESET.menuMainColor + '}#exp-bar .progress-bar-striped,.quick:hover,.rangeslider__fill{background-color:' + PRESET.menuMainColor + '}#main-menu,.agario-side-panel,#hotkeys,#exp-imp{border-color:' + PRESET.menuMainColor + '}.ps-scrollbar-y{background-color:' + PRESET.menuMainColor + '!important}';
            this.addCustomCSS('menuMainColorCSS', _0x5dc305);
        },
        'setMenuPanelColor': function () {
            var _0x763d59 = '#main-menu,.agario-side-panel,#hotkeys,#exp-imp{background-color: ' + PRESET.menuPanelColor + '}label:hover,.agario-panel input,.agario-panel select,.agario-side-panel input,.agario-side-panel select,.input-group-addon,.nick .input-group-btn,.skin .input-group-btn,#stream-mode,#hide-url,.menu-tabs a:hover,.menu-tabs .active,.submenu-tabs,#exp-bar .progress,#quick-menu a:hover,.quick,.select-wrapper,#hotkeys-cfg div.row:hover,#hotkeys-cfg .command-in,#exp-imp-settings textarea,.restore-settings{background-color: ' + PRESET.menuPanelColor2 + '}.agario-panel h5,.agario-side-panel h5,#stats h2,.menu-tabs,.submenu-tabs,#skins a.default,#stats hr,#hotkeys-cfg div.row, #exp-imp h1{border-color: ' + PRESET.menuPanelColor2 + '}.quick:hover,#skins a,#profiles{color:' + PRESET.menuPanelColor2 + '}input.stream-mode,input.hide-url{color:' + PRESET.menuPanelColor2 + '!important}';
            this.addCustomCSS('menuPanelColorCSS', _0x763d59);
        },
        'setMenuTextColor': function () {
            var _0xe3ad42 = '.agario-panel,.agario-side-panel,.agario-panel input,.agario-panel select,.agario-side-panel input,.agario-side-panel select,.input-group-addon,.dark .yt-username,#stream-mode,#hide-url,.menu-tabs a,.submenu-tabs a,#skins a.default:hover,#quick-menu a,#prev-profile.default:hover,#next-profile.default:hover,#statsText,#hotkeys,#hotkeys-cfg .command-in,#exp-imp{color:' + PRESET.menuTextColor + '}#skins a.default:hover{border-color:' + PRESET.menuTextColor + '}::-webkit-input-placeholder{color:' + PRESET.menuTextColor2 + '!important}::-moz-placeholder{color:' + PRESET.menuTextColor2 + '!important}#user-id-tag, #version-tag,#statsSubtext,#hotkeys-inst,#exp-imp textarea,.restore-settings a,.restore-settings a:hover{color:' + PRESET.menuTextColor2 + '}#hotkeys-cfg .command-in,#theme .color-box{border-color:' + PRESET.menuTextColor2 + '}';
            this.addCustomCSS('menuTextColorCSS', _0xe3ad42);
        },
        'setMenuButtons': function () {
            var _0x1a39cf = 'a,a:hover{color:' + PRESET.btn1Color + '}.btn,#hotkeys-cfg .custom-key-in{color:' + PRESET.menuBtnTextColor + '}.btn-primary{background-color:' + PRESET.btn1Color + '!important}.btn-primary:active,.btn-primary:disabled,.btn-primary:focus,.btn-primary:hover{background-color:' + PRESET.btn1Color2 + '!important}.btn-success{background-color:' + PRESET.btn2Color + '!important}.btn-success:active,.btn-success:disabled,.btn-success:focus,.btn-success:hover{background-color:' + PRESET.btn2Color2 + '!important}.btn-warning{background-color:' + PRESET.btn3Color + '!important}.btn-warning:active,.btn-warning:disabled,.btn-warning:focus,.btn-warning:hover{background-color:' + PRESET.btn3Color2 + '!important}.btn-danger{background-color:' + PRESET.btn4Color + '!important}.btn-danger:active,.btn-danger:disabled,.btn-danger:focus,.btn-danger:hover{background-color:' + PRESET.btn4Color2 + '!important}#hotkeys-cfg .custom-key-in{background-color:' + PRESET.btn4Color2 + ';border-color:' + PRESET.btn4Color2 + '}';
            this.addCustomCSS('menuButtonsCSS', _0x1a39cf);
        },
        'setMenuBg': function () {
            $('#menuBg').val(PRESET.menuBg);
            if (PRESET.menuBg) {
                $('.menu-panel, .agario-side-panel, #hotkeys, #exp-imp').css('background-image', 'url(' + PRESET.menuBg + ')');
            } else {
                $('.menu-panel, .agario-side-panel, #hotkeys, #exp-imp').css('background-image', 'none');
            }
        },
        'setHud': function () {
            this.setHudColors();
            this.setHudFont();
            this.setHudScale();
        },
        'setHudColors': function () {
            var _0x3ab434 = '.hud-main-color,#top5-hud a,#target-panel-hud a:hover,#target-panel-hud a.active,#message-menu a{color:' + PRESET.hudMainColor + '}.hud,.hud-b,#chat-emoticons{background-color:' + PRESET.hudColor + '}.hud,.hud-b,#top5-hud a:hover,#target-panel-hud a{color:' + PRESET.hudTextColor + '}.stats-hud-color{color:' + PRESET.statsHudColor + '}.time-hud-color{color:' + PRESET.timeHudColor + '}.top5-mass-color{color:' + PRESET.top5MassColor + '}#leaderboard-positions .me{color:' + PRESET.lbMeColor + '}#leaderboard-positions .teammate{color:' + PRESET.lbTeammateColor + '}';
            this.addCustomCSS('hudCSS', _0x3ab434);
        },
        'setHudFont': function () {
            this.setFont('hudFont', PRESET.hudFont);
            $('#overlays-hud').css({
                'font-family': PRESET.hudFontFamily,
                'font-weight': PRESET.hudFontWeight
            });
        },
        'setHudScale': function () {
            var _0x1f00f4 = Math.round(0x14 * PRESET.hudScale);
            var _0x2b331e = Math.round(0xc8 * PRESET.hudScale);
            var _0x9435be = Math.floor(0x37 * PRESET.hudScale);
            var _0x1da72c = Math.floor(0x6 * PRESET.hudScale);
            var _0x31ac6d = Math.floor(0x118 * PRESET.hudScale);
            var _0x18b6ad = Math.floor(0x55 * PRESET.hudScale);
            var _0x56d66d = Math.floor(0x14 * PRESET.hudScale);
            $('#overlays-hud').css('font-size', _0x1f00f4 + 'px');
            $('#leaderboard-hud, #time-hud').width(_0x2b331e);
            $('#top5-hud').width(_0x2b331e + 0x1e).css('top', _0x9435be + 'px');
            $('#top5-pos').css('padding-left', _0x1da72c + 'px');
            $('#time-hud').css('top', _0x31ac6d + 'px');
            $('#pause-hud').css('top', _0x18b6ad + 'px');
            $('#target-hud').css('padding-top', _0x56d66d + 'px');
        },
        'setChat': function () {
            this.setChatColors();
            this.setChatScale();
        },
        'setChatColors': function () {
            var _0x3b6883 = '#message,#messages li,.toast-success{background-color:' + PRESET.messageColor + '}#message,.message-text,.toast-success .message-text{color:' + PRESET.messageTextColor + '}.message-nick,.mute-user,.mute-user:hover,.toast-success .message-nick,.toast .mute-user,.toast .mute-user:hover{color:' + PRESET.messageNickColor + '}.message-time{color:' + PRESET.messageTimeColor + '}.toast-warning{background-color:' + PRESET.commandsColor + '}.command-text,.toast-warning .command-text{color:' + PRESET.commandsTextColor + '}.command-nick,.toast-warning .command-nick,.toast-warning .mute-user,.toast-warning .mute-user:hover{color:' + PRESET.commandsNickColor + '}.command-time{color:' + PRESET.commandsTimeColor + '}#chat-box{background-color:' + PRESET.chatBoxColor + '}';
            this.addCustomCSS('chatCSS', _0x3b6883);
        },
        'setChatScale': function () {
            var _0x31801e = Math.round(0xe * PRESET.chatScale);
            var _0x2f7e0a = Math.round(0x118 * PRESET.chatScale);
            var _0x28085e = Math.round(0x15e * PRESET.chatScale);
            var _0x5d7b52 = Math.round(0x12c * PRESET.chatScale);
            var _0x491d59 = Math.floor(0xe * PRESET.chatScale);
            $('#message-box, #messages, #toast-container, #chat-box').css('font-size', _0x31801e + 'px');
            $('#messages, #toast-container, #chat-box').width(_0x2f7e0a);
            $('#message-box').width(_0x28085e);
            $('#chat-box').height(_0x5d7b52);
            $('.user-list').css('padding-left', _0x491d59 + 'px');
            var _0x22ee08 = '#toast-container{width:' + _0x2f7e0a + 'px;font-size:' + _0x31801e + 'px}';
            this.addCustomCSS('chatScaleCSS', _0x22ee08);
        },
        'setMiniMap': function () {
            this.setMiniMapFont();
            this.setMiniMapWidth();
            this.setMiniMapSectorsOpacity();
        },
        'setMiniMapFont': function () {
            this.setFont('miniMapFont', PRESET.miniMapFont);
            MapChatUiCtrl && MapChatUiCtrl.resetMiniMapSectors();
        },
        'setMiniMapWidth': function () {
            var _0x5527f3 = PRESET.miniMapWidth / 0xc8;
            PRESET.miniMapTop = Math.round(0x14 * _0x5527f3);
            $('#minimap-hud').css({
                'width': PRESET.miniMapWidth,
                'height': PRESET.miniMapWidth + PRESET.miniMapTop
            });
            MapChatUiCtrl && MapChatUiCtrl.resetMiniMapSectors();
        },
        'setMiniMapSectorsColor': function () {
            MapChatUiCtrl && MapChatUiCtrl.resetMiniMapSectors();
        },
        'setMiniMapSectorsOpacity': function () {
            $('#minimap-sectors').css('opacity', PRESET.miniMapSectorsOpacity);
        },
        'setTheme': function () {
            this.setFonts();
            this.setBgColor();
            this.setCustomBackground();
            this.setCustomCursor();
            this.setMenu();
            this.setHud();
            this.setChat();
            this.setMiniMap();
        },
        'init': function () {
            this.loadThemeSettings();
        }
    };
    var _0x420606 = [];
    var _0x4673ea = {
        'nick': 'I <3 OGARio',
        'clanTag': 'Ⓜ',
        'skinURL': '',
        'color': PRESET.mainColor
    };
    var CLIENT_SETTINGS = {
        'jellyPhisycs':false,
        'virusSound':true,

        'quickResp': true,
        'autoResp': false,
        'autoZoom': false,
        'autoHideNames': true,
        'autoHideMass': true,
        'autoHideFood': false,
        'autoHideFoodOnZoom': false,
        'noNames': false,
        'optimizedNames': true,
        'hideMyName': true,
        'hideTeammatesNames': false,
        'showMass': true,
        'optimizedMass': true,
        'shortMass': true,
        'virMassShots': true,
        'hideMyMass': false,
        'hideEnemiesMass': false,
        'vanillaSkins': false,
        'customSkins': true,
        'myTransparentSkin': false,
        'myCustomColor': false,
        'transparentCells': false,
        'transparentViruses': true,
        'transparentSkins': false,
        'showGrid': false,
        'showBgSectors': false,
        'showMapBorders': true,
        'showGhostCells': false,
        'showMiniMap': true,
        'showMiniMapGrid': false,
        'showMiniMapGuides': true,
        'showMiniMapGhostCells': false,
        'oneColoredTeammates': false,
        'optimizedFood': true,
        'rainbowFood': false,
        'oppColors': false,
        'oppRings': false,
        'virColors': false,
        'splitRange': false,
        'virusesRange': false,
        'textStroke': false,
        'namesStroke': false,
        'massStroke': false,
        'cursorTracking': false,
        'teammatesInd': false,
        'mouseSplit': false,
        'mouseFeed': false,
        'mouseInvert': false,
        'disableChat': false,
        'hideChat': false,
        'chatSounds': true,
        'chatEmoticons': true,
        'showChatBox': false,
        'showChatImages': true,
        'showChatVideos': true,
        'showTop5': true,
        'showTargeting': true,
        'showLbData': true,
        'showTime': true,
        'normalLb': false,
        'centeredLb': true,
        'fpsAtTop': true,
        'showStats': true,
        'showStatsMass': true,
        'showStatsSTE': false,
        'showStatsN16': false,
        'showStatsFPS': true,
        'blockPopups': false,
        'streamMode': false,
        'hideSkinUrl': false,
        'showQuickMenu': true,
        'showSkinsPanel': true,
        'animation': 0x8c,
        'zoomSpeedValue': 0.9,
        'messageSound': 'https://cdn.ogario.ovh/static/sounds/notification_01.mp3',
        'commandSound': 'https://cdn.ogario.ovh/static/sounds/notification_02.mp3'
    };

    function _0x511878(_0x147679, _0x8173f3, _0x58c224, _0x3dbfc5) {
        this.id = _0x147679;
        this.nick = _0x8173f3;
        this.skinID = _0x58c224;
        this.skinURL = _0x3dbfc5;
        this.x = 0x0;
        this.y = 0x0;
        this.lastX = 0x0;
        this.lastY = 0x0;
        this.mass = 0x0;
        this.clanTag = '';
        this.color = null;
        this.customColor = PRESET.miniMapTeammatesColor;
        this.alive = false;
        this.updateTime = null;
        this.pi2 = 0x2 * Math.PI;
        this.setColor = function (_0x2ad2dd, _0x17b9a0) {
            this.color = _0x2ad2dd;
            if (_0x17b9a0.length == 0x7) {
                this.customColor = _0x17b9a0;
            }
        };
        this.drawPosition = function (_0x3314c8, _0xf4a602, _0x4d76c5, _0x4d8880, _0xd47365) {
            if (!this.alive || _0x4d8880 && _0xd47365 && this.id != _0xd47365) {
                return;
            }
            this.lastX = (0x1d * this.lastX + this.x) / 0x1e;
            this.lastY = (0x1d * this.lastY + this.y) / 0x1e;
            var _0x551f9d = (this.lastX + _0xf4a602) * _0x4d76c5;
            var _0x1beb17 = (this.lastY + _0xf4a602) * _0x4d76c5;
            if (this.nick.length > 0x0) {
                _0x3314c8.font = PRESET.miniMapNickFontWeight + ' ' + PRESET.miniMapNickSize + 'px ' + PRESET.miniMapNickFontFamily;
                _0x3314c8.textAlign = 'center';
                if (PRESET.miniMapNickStrokeSize > 0x0) {
                    _0x3314c8.lineWidth = PRESET.miniMapNickStrokeSize;
                    _0x3314c8.strokeStyle = PRESET.miniMapNickStrokeColor;
                    _0x3314c8.strokeText(this.nick, _0x551f9d, _0x1beb17 - (PRESET.miniMapTeammatesSize * 0x2 + 0x2));
                }
                _0x3314c8.fillStyle = PRESET.miniMapNickColor;
                _0x3314c8.fillText(this.nick, _0x551f9d, _0x1beb17 - (PRESET.miniMapTeammatesSize * 0x2 + 0x2));
            }
            _0x3314c8.beginPath();
            _0x3314c8.arc(_0x551f9d, _0x1beb17, PRESET.miniMapTeammatesSize, 0x0, this.pi2, false);
            _0x3314c8.closePath();
            if (CLIENT_SETTINGS.oneColoredTeammates) {
                _0x3314c8.fillStyle = PRESET.miniMapTeammatesColor;
            } else {
                _0x3314c8.fillStyle = this.color;
            }
            _0x3314c8.fill();
        };
    }
    var MapChatUiCtrl = window.bb = {
        'name': 'Delta v4',
        'version': 'v4 (4.0.0 b37)',
        'privateMode': false,
        'protocolMode': true,
        'publicIP': 'wss://srv.ogario.eu',//'ws://37.187.176.125:3000',
        'privateIP': null,
        'updateInterval': 0x3e8,
        'updateTick': 0x0,
        'updateMaxTick': 0x2,
        'currentSector': '',
        'miniMap': null,
        'miniMapCtx': null,
        'miniMapSectors': null,
        'pi2': 0x2 * Math.PI,
        'socket': null,
        'cells': {},
        'teamPlayers': [],
        'parties': [],
        'chatHistory': [],
        'chatUsers': {},
        'chatMutedUsers': {},
        'chatMutedUserIDs': [],
        'customSkinsCache': {},
        'customSkinsMap': {},
        'cacheQueue': [],
        'deathLocations': [],
        'playerID': null,
        'playerMass': 0x0,
        'selectedProfile': 0x0,
        'lastDeath': 0x0,
        'skipServerData': false,
        'gameMode': ':ffa',
        'region': '',
        'partyToken': '',
        'ws': '',
        'serverIP': '',
        'serverArena': '',
        'serverToken': '',
        'lastSentNick': '',
        'lastSentClanTag': null,
        'lastSentSkinURL': '',
        'lastSentCustomColor': '',
        'lastSentPartyToken': '',
        'lastSentServerToken': '',
        'lastMessageSentTime': Date.now(),
        'rFps': 0x0,
        'renderedFrames': 0x0,
        'fpsLastRequest': null,
        'statsHUD': null,
        'leaderboardPositionsHUD': null,
        'leaderboardDataHUD': null,
        'activeParties': null,
        'top5pos': null,
        'top5totalMass': null,
        'top5totalPlayers': null,
        'top5limit': 0x5,
        'timeHUD': null,
        'questHUD': null,
        'retryResp': 0x0,
        'token': 'THlsa28=',
        'canvasScale': 0x1,
        'selectBiggestCell': true,
        'noColors': false,
        'skipStats': false,
        'showQuest': false,
        'showSplitInd': false,
        'pause': false,
        'targetID': 0x0,
        'targetStatus': 0x0,
        'targetNick': '',
        'targetSkinURL': '',
        'targeting': false,
        'privateMiniMap': false,
        'messageSound': null,
        'commandSound': null,
        'feedInterval': null,
        'getPlayerX': function () {
            return CLIENT2.playerX + CLIENT2.mapOffsetX;
        },
        'getPlayerY': function () {
            return CLIENT2.playerY + CLIENT2.mapOffsetY;
        },
        'feed': function () {
            window.core && window.core.eject && window.core.eject();
        },
        'macroFeed': function (_0x138a18) {
            if (_0x138a18) {
                if (this.feedInterval) {
                    return;
                }
                var _0x52f974 = this;
                this.feed();
                this.feedInterval = setInterval(function () {
                    _0x52f974.feed();
                }, 0x50);
            } else {
                if (this.feedInterval) {
                    clearInterval(this.feedInterval);
                    this.feedInterval = null;
                }
            }
        },
        'split': function () {
            window.core && window.core.split && window.core.split();
        },
        'doubleSplit': function () {
            var _0x2bc654 = this;
            _0x2bc654.split();
            setTimeout(function () {
                _0x2bc654.split();
            }, 0x28);
        },
        'popSplit': function () {
            var _0x419ecd = this;
            _0x419ecd.split();
            setTimeout(function () {
                _0x419ecd.split();
            }, 0xc8);
        },
        'split16': function () {
            var _0x2e1495 = this;
            _0x2e1495.split();
            setTimeout(function () {
                _0x2e1495.split();
            }, 0x28);
            setTimeout(function () {
                _0x2e1495.split();
            }, 0x50);
            setTimeout(function () {
                _0x2e1495.split();
            }, 0x78);
        },
        'toggleSkins': function () {
            if (CLIENT2.vanillaSkins && CLIENT2.customSkins) {
                CLIENT2.vanillaSkins = false;
            } else if (!CLIENT2.vannillaSkins && CLIENT2.customSkins) {
                CLIENT2.vanillaSkins = true;
                CLIENT2.customSkins = false;
            } else {
                CLIENT2.vanillaSkins = true;
                CLIENT2.customSkins = true;
            }
        },
        'toggleCells': function () {
            this.selectBiggestCell = !this.selectBiggestCell;
            CLIENT2.selectBiggestCell = this.selectBiggestCell;
        },
        'setShowTop5': function () {
            CLIENT_SETTINGS.showTop5 = !CLIENT_SETTINGS.showTop5;
            this.setTop5();
        },
        'setTop5': function () {
            if (CLIENT_SETTINGS.showTop5) {
                $('#top5-hud').show();
            } else {
                $('#top5-hud').hide();
            }
        },
        'setShowTargeting': function () {
            CLIENT_SETTINGS.showTargeting = !CLIENT_SETTINGS.showTargeting;
            this.setTargetingHUD();
        },
        'setTargetingHUD': function () {
            if (CLIENT_SETTINGS.showTargeting) {
                $('#target-hud, #target-panel-hud').show();
            } else {
                $('#target-hud, #target-panel-hud').hide();
            }
        },
        'setShowTime': function () {
            CLIENT_SETTINGS.showTime = !CLIENT_SETTINGS.showTime;
            if (CLIENT_SETTINGS.showTime) {
                $('#time-hud').show();
                this.displayTime();
            } else {
                $('#time-hud').hide();
            }
        },
        'setShowSplitRange': function () {
            CLIENT_SETTINGS.splitRange = !CLIENT_SETTINGS.splitRange;
            CLIENT2.splitRange = CLIENT_SETTINGS.splitRange;
        },
        'setShowSplitInd': function () {
            this.showSplitInd = !this.showSplitInd;
            CLIENT_SETTINGS.splitRange = this.showSplitInd;
            CLIENT_SETTINGS.oppRings = this.showSplitInd;
            CLIENT2.splitRange = CLIENT_SETTINGS.splitRange;
            CLIENT2.oppRings = CLIENT_SETTINGS.oppRings;
        },
        'setShowTeammatesInd': function () {
            CLIENT_SETTINGS.teammatesInd = !CLIENT_SETTINGS.teammatesInd;
        },
        'setShowOppColors': function () {
            CLIENT_SETTINGS.oppColors = !CLIENT_SETTINGS.oppColors;
            CLIENT2.oppColors = CLIENT_SETTINGS.oppColors;
        },
        'setShowSkins': function () {
            this.noSkins = !this.noSkins;
            window.core && window.core.setSkins && window.core.setSkins(!this.noSkins);
            CLIENT2.showCustomSkins = !this.noSkins;
            this.displayChatInfo(!this.noSkins, 'showSkinsMsg');
        },
        'setTransparentSkins': function () {
            CLIENT_SETTINGS.transparentSkins = !CLIENT_SETTINGS.transparentSkins;
            CLIENT2.transparentSkins = CLIENT_SETTINGS.transparentSkins;
        },
        'setShowStats': function () {
            $('#stats-hud').toggle();
        },
        'setShowFood': function () {
            CLIENT2.showFood = !CLIENT2.showFood;
        },
        'setShowHUD': function () {
            $('#overlays-hud').toggle();
        },
        'setShowGrid': function () {
            CLIENT_SETTINGS.showGrid = !CLIENT_SETTINGS.showGrid;
        },
        'setShowMiniMapGuides': function () {
            CLIENT_SETTINGS.showMiniMapGuides = !CLIENT_SETTINGS.showMiniMapGuides;
        },
        'setShowLb': function () {
            if (this.gameMode === ':teams') {
                return;
            }
            $('#leaderboard-hud').toggle();
        },
        'setShowBgSectors': function () {
            CLIENT_SETTINGS.showBgSectors = !CLIENT_SETTINGS.showBgSectors;
        },
        'setHideSmallBots': function () {
            CLIENT2.hideSmallBots = !CLIENT2.hideSmallBots;
            this.displayChatInfo(!CLIENT2.hideSmallBots, 'hideSmallBotsMsg');
        },
        'setShowNames': function () {
            CLIENT_SETTINGS.noNames = !CLIENT_SETTINGS.noNames;
        },
        'setHideTeammatesNames': function () {
            CLIENT_SETTINGS.hideTeammatesNames = !CLIENT_SETTINGS.hideTeammatesNames;
        },
        'setShowMass': function () {
            CLIENT_SETTINGS.showMass = !CLIENT_SETTINGS.showMass;
        },
        'setShowMiniMap': function () {
            CLIENT_SETTINGS.showMiniMap = !CLIENT_SETTINGS.showMiniMap;
            this.setMiniMap();
        },
        'setMiniMap': function () {
            if (CLIENT_SETTINGS.showMiniMap) {
                $('#minimap-hud').show();
            } else {
                $('#minimap-hud').hide();
            }
        },
        'setShowQuest': function () {
            if (this.gameMode !== ':ffa') {
                return;
            }
            this.showQuest = !this.showQuest;
            this.setQuest();
        },
        'setQuest': function () {
            if (this.showQuest && this.gameMode === ':ffa') {
                $('#quest-hud').show();
            } else {
                $('#quest-hud').hide();
            }
        },
        'toggleAutoZoom': function () {
            CLIENT2.autoZoom = !CLIENT2.autoZoom;
            this.displayChatInfo(CLIENT2.autoZoom, 'autoZoomMsg');
        },
        'resetZoom': function (_0x4fbac4) {
            if (_0x4fbac4) {
                CLIENT2.zoomResetValue = 0x1;
                CLIENT2.zoomValue = 0x1;
            } else {
                CLIENT2.zoomResetValue = 0x0;
            }
        },
        'setZoom': function (_0x15e430) {
            CLIENT2.zoomValue = _0x15e430;
        },
        'toggleDeath': function () {
            this.lastDeath--;
            if (this.lastDeath < 0x0) {
                this.lastDeath = this.deathLocations.length - 0x1;
            }
        },
        'tryResp': function () {
            if (CLIENT2.play || this.retryResp == 0x14) {
                this.retryResp = 0x0;
                return;
            }
            this.retryResp++;
            var _0x36a392 = this;
            setTimeout(function () {
                if ($('.btn-play-guest').is(':visible')) {
                    $('.btn-play-guest').click();
                } else {
                    $('.btn-play').click();
                }
                if (!CLIENT2.play) {
                    _0x36a392.tryResp();
                }
            }, 0x1f4);
        },
        'quickResp': function () {
            if (!CLIENT_SETTINGS.quickResp) {
                return;
            }
            this.hideMenu();
            this.gameServerConnect(this.ws);
            CLIENT2.play = false;
            this.tryResp();
        },
        'autoResp': function () {
            if (!CLIENT_SETTINGS.autoResp) {
                return;
            }
            this.setAutoResp();
            $('#overlays').stop().hide();
            if ($('.btn-play-guest').is(':visible')) {
                $('.btn-play-guest').click();
                return;
            }
            $('.btn-play').click();
        },
        'setAutoResp': function () {
            if (CLIENT_SETTINGS.autoResp) {
                if (!$('#skipStats').prop('checked')) {
                    $('#skipStats').click();
                    this.skipStats = true;
                }
            }
        },
        'toggleAutoResp': function () {
            CLIENT_SETTINGS.autoResp = !CLIENT_SETTINGS.autoResp;
            this.setAutoResp();
            this.displayChatInfo(CLIENT_SETTINGS.autoResp, 'autoRespMsg');
        },
        'copyLb': function () {
            var _0xd3b707 = $('<input>');
            $('body').append(_0xd3b707);
            _0xd3b707.val($('#leaderboard-positions').text()).select();
            try {
                document.execCommand('copy');
            } catch (_0x1e3fd7) {}
            _0xd3b707.remove();
        },
        'setPause': function () {
            this.pause = !this.pause;
            CLIENT2.pause = this.pause;
            if (this.pause) {
                CLIENT2.resetTargetPosition();
                $('#pause-hud').show();
            } else {
                $('#pause-hud').hide();
            }
        },
        'setCenteredLb': function () {
            if (CLIENT_SETTINGS.centeredLb) {
                $('#leaderboard-hud').addClass('hud-text-center');
            } else {
                $('#leaderboard-hud').removeClass('hud-text-center');
            }
        },
        'setNormalLb': function () {
            if (CLIENT_SETTINGS.normalLb) {
                $('#leaderboard-hud h4').html(i18n.leaderboard);
            } else {
                $('#leaderboard-hud h4').html('ogario.ovh');
            }
        },
        'setFpsAtTop': function () {
            if (CLIENT_SETTINGS.fpsAtTop) {
                $('#stats-hud').removeClass('hud-bottom').addClass('hud-top');
            } else {
                $('#stats-hud').removeClass('hud-top').addClass('hud-bottom');
            }
        },
        'setBlockPopups': function () {
            if (this.protocolMode) {
                $('#block-warn').hide();
                return;
            }
            if (CLIENT_SETTINGS.blockPopups) {
                this.blockPopups();
            } else {
                this.unblockPopups();
            }
        },
        'blockPopups': function () {
            $('#openfl-content, #openfl-overlay').hide();
            $('#openfl-content, #openfl-overlay').addClass('block-popups');
            $('#freeCoins, #gifting, #openShopBtn, #dailyQuests').prop('disabled', true);
            $('#block-warn').show();
        },
        'unblockPopups': function () {
            $('#openfl-overlay.disabler').click();
            $('#openfl-content, #openfl-overlay').hide();
            $('#openfl-content, #openfl-overlay').removeClass('block-popups');
            $('#freeCoins, #gifting, #openShopBtn, #dailyQuests').prop('disabled', false);
            $('#block-warn').hide();
        },
        'tempUnblockPopups': function () {
            if (!CLIENT_SETTINGS.blockPopups) {
                return;
            }
            this.unblockPopups();
        },
        'displayLeaderboard': function (_0x2e249f, _0x3d6828 = '') {
            if (!this.leaderboardPositionsHUD) {
                return;
            }
            this.leaderboardPositionsHUD.innerHTML = _0x2e249f;
            this.leaderboardDataHUD.innerHTML = _0x3d6828;
        },
        'displayStats': function () {
            if (!CLIENT_SETTINGS.showStats) {
                $('#stats-hud').hide();
                return;
            }
            var str = '';
            if (CLIENT2.play) {
                if (CLIENT_SETTINGS.showStatsMass && CLIENT2.playerMass) {
                    //str += i18n.mass + ': ' + CLIENT2.playerMass + ' | ';
                    str += i18n.mass+": "+CLIENT2.playerMass+" "+~~(CLIENT2.playerMass/4)+" "+~~(CLIENT2.playerMass/16)+" | ";
                }
                if (CLIENT2.playerScore) {
                    str += i18n.score + ': ' + CLIENT2.playerScore;
                }
                if (CLIENT_SETTINGS.showStatsSTE && CLIENT2.STE) {
                    str += ' | STE: ' + CLIENT2.STE;
                }
                if (CLIENT_SETTINGS.showStatsN16 && CLIENT2.playerSplitCells) {
                    var substr = CLIENT2.playerSplitCells===16?'<span style="background:green">'+CLIENT2.playerSplitCells+'/16</span>':CLIENT2.playerSplitCells+"/16"
                    str += " | "+substr;
                }
                if (CLIENT_SETTINGS.showStatsFPS) {
                    str += ' | ';
                }
            }
            if (CLIENT_SETTINGS.showStatsFPS) {
                str += 'FPS: ' + WORLD.fps;
            }
            this.statsHUD.textContent = str;
            var _0x5c16d3 = this;
            setTimeout(function () {
                _0x5c16d3.displayStats();
            }, 0xfa);
        },
        'displayTime': function () {
            if (!CLIENT_SETTINGS.showTime) {
                $('#time-hud').hide();
                return;
            }
            var _0x73ea7c = new Date().toLocaleString();
            this.timeHUD.textContent = _0x73ea7c;
            var _0x300cde = this;
            setTimeout(function () {
                _0x300cde.displayTime();
            }, 0x3e8);
        },
        'displayParties': function () {
            var _0x4128d1 = '';
            for (var _0x2850e2 = 0x0; _0x2850e2 < this.parties.length; _0x2850e2++) {
                _0x4128d1 += '<li><a href="https://agar.io/#' + this.parties[_0x2850e2] + '\" onclick=\"$(\'#party-token\').val(\'' + this.parties[_0x2850e2] + '\'); $(\'#join-party-btn-2\').click();">https://agar.io/#' + this.parties[_0x2850e2] + '</a></li>';
            }
            if (_0x4128d1 === '') {
                this.activeParties.className = 'no-parties';
            } else {
                this.activeParties.className = '';
            }
            this.activeParties.innerHTML = _0x4128d1;
        },
        'displayTop5': function () {
            if (!CLIENT_SETTINGS.showTop5) {
                return;
            }
            var _0xf61e15 = '';
            var _0x2da24b = 0x0;
            var _0x5716f2 = this.top5.length;
            for (var _0x47d376 = 0x0; _0x47d376 < _0x5716f2; _0x47d376++) {
                _0x2da24b += this.top5[_0x47d376].mass;
                if (_0x47d376 >= this.top5limit) {
                    continue;
                }
                _0xf61e15 += '<li><span class="cell-counter" style="background-color: transparent;color: ' + this.top5[_0x47d376].color + '\">|</span>';//(_0x47d376 + 0x1)
                if (CLIENT_SETTINGS.showTargeting) {
                    _0xf61e15 += '<a href="#" data-user-id="' + this.top5[_0x47d376].id + '" class="set-target ogicon-target"></a> ';
                }
                _0xf61e15 += '<span class="hud-main-color">[' + this.calculateMapSector(this.top5[_0x47d376].x, this.top5[_0x47d376].y) + ']</span>';
                _0xf61e15 += '<span class="top5-mass-color">[' + this.shortMassFormat(this.top5[_0x47d376].mass) + ']</span> ' + this.escapeHTML(this.top5[_0x47d376].nick) + '</li>';
            }
            this.top5pos.innerHTML = _0xf61e15;
            if (CLIENT2.play && CLIENT2.playerMass) {
                _0x2da24b += CLIENT2.playerMass;
                _0x5716f2++;
            }
            this.top5totalMass.textContent = this.shortMassFormat(_0x2da24b);
            this.top5totalPlayers.textContent = _0x5716f2;
        },
        'setTop5limit': function (_0x30c3ae) {
            if (!_0x30c3ae) {
                return;
            }
            this.top5limit = _0x30c3ae;
        },
        'displayChatHistory': function (_0x24fa94) {
            if (_0x24fa94) {
                this.clearChatHistory(true);
                for (var _0x5a4ee6 = 0x0; _0x5a4ee6 < this.chatHistory.length; _0x5a4ee6++) {
                    $('#messages').append('<li><span class="message-nick">' + this.chatHistory[_0x5a4ee6].nick + ': </span><span class="message-text">' + this.chatHistory[_0x5a4ee6].message + '</span></li>');
                }
                return;
            }
            this.clearChatHistory(false);
        },
        'clearChatHistory': function (_0x5a3cbf) {
            $('#messages').empty();
            if (_0x5a3cbf) {
                toastr.clear();
                if (CLIENT_SETTINGS.showChatBox) {
                    $('#chat-box .message').remove();
                    this.chatHistory.length = 0x0;
                }
            }
        },
        'displayChatInfo': function (_0x21b823, _0x40fb59) {
            if (_0x21b823) {
                toastr.info(i18n[_0x40fb59 + 'A']);
            } else {
                toastr.error(i18n[_0x40fb59 + 'B']);
            }
        },
        'setDisableChat': function () {
            CLIENT_SETTINGS.hideChat = CLIENT_SETTINGS.disableChat;
            this.setHideChat();
        },
        'hideChat': function () {
            CLIENT_SETTINGS.hideChat = !CLIENT_SETTINGS.hideChat;
            this.setHideChat();
            this.displayChatInfo(!CLIENT_SETTINGS.hideChat, 'hideChatMsg');
        },
        'setHideChat': function () {
            if (CLIENT_SETTINGS.hideChat) {
                $('#message-box').hide();
            }
            this.setShowChatBox();
        },
        'setShowChatBox': function () {
            if (!CLIENT_SETTINGS.hideChat && CLIENT_SETTINGS.showChatBox) {
                $('#chat-box').show();
            } else {
                $('#chat-box').hide();
            }
        },
        'enterChatMessage': function () {
            var _0x122c69 = $('#message-box');
            var _0x352799 = $('#message');
            if (!_0x122c69.is(':visible')) {
                _0x122c69.show();
                _0x352799.focus();
                _0x352799.val('');
            } else {
                var _0x43f0e3 = _0x352799.val();
                if (_0x43f0e3.length) {
                    this.sendChatMessage(0x65, _0x43f0e3);
                    if (CLIENT2.play) {
                        _0x352799.blur();
                        _0x122c69.hide();
                    }
                } else {
                    _0x352799.blur();
                    _0x122c69.hide();
                }
                _0x352799.val('');
            }
        },
        'showMenu': function (_0x430b78) {
            if (window.MC && window.MC.showNickDialog) {
                $('.ogario-menu').show();
                $('.menu-panel').hide();
                if (!CLIENT2.play && !this.skipStats) {
                    $('#stats').show();
                } else {
                    $('#main-panel').show();
                }
                window.MC.showNickDialog(0x12c);
                $('#oferwallContainer').is(':visible') && window.closeOfferwall();
                $('#videoContainer').is(':visible') && window.closeVideoContainer();
                return;
            }
            if (_0x430b78) {
                $('#overlays').fadeIn(_0x430b78);
            } else {
                $('#overlays').show();
            }
        },
        'hideMenu': function (_0x603cbd) {
            if (window.MC && window.MC.showNickDialog) {
                $('.ogario-menu').hide();
                return;
            }
            if (_0x603cbd) {
                $('#overlays').fadeOut(_0x603cbd);
            } else {
                $('#overlays').hide();
            }
        },
        //m00
        'toggleMenu': function(_0x1da5e8) {
            $('#overlays').toggle()
        },
        'escapeHTML': function (_0x267fa4) {
            return String(_0x267fa4).replace(/[&<>"'\/]/g, function (_0x1eb925) {
                return SPECIALCHARS[_0x1eb925];
            });
        },
        'checkImgURL': function (_0x47857f = '', _0x550824 = false) {

            var _0x154e23 = '';
            var _0x2c1b55 = 'jpg|jpeg|png';
            if (!_0x550824) {
                _0x2c1b55 += '|gif';
            }
            for (var _0x2ea82f = 0x0; _0x2ea82f < imagePatterns.length; _0x2ea82f++) {
                var _0x586d13 = imagePatterns[_0x2ea82f].pattern.replace('%file_ext%', _0x2c1b55);
                var _0x4bfdcb = new RegExp('^' + _0x586d13 + '$', 'i');
                if (_0x4bfdcb.test(_0x47857f)) {
                    _0x154e23 = _0x47857f;
                    break;
                }
            }
            return _0x47857f//_0x154e23;
        },
        'checkSkinURL': function (_0x2283fe) {
            return this.checkImgURL(_0x2283fe, true);
        },
        'loadSettings': function () {
            var _0x264666 = null;
            if (window.localStorage.getItem('ogarioSettings') !== null) {
                _0x264666 = JSON.parse(window.localStorage.getItem('ogarioSettings'));
            }
            for (var _0x4454c7 in CLIENT_SETTINGS) {
                if (CLIENT_SETTINGS.hasOwnProperty(_0x4454c7)) {
                    if (_0x264666 && _0x264666.hasOwnProperty(_0x4454c7)) {
                        CLIENT_SETTINGS[_0x4454c7] = _0x264666[_0x4454c7];
                    }
                    if (CLIENT2.hasOwnProperty(_0x4454c7)) {
                        CLIENT2[_0x4454c7] = CLIENT_SETTINGS[_0x4454c7];
                    }
                }
            }
        },
        'saveSettings': function (_0x3c437e, _0x44001a) {
            window.localStorage.setItem(_0x44001a, JSON.stringify(_0x3c437e));
        },
        'exportSettings': function () {
            var _0x27b39e = {
                'ogarioCommands': _0x23cf50,
                'ogarioHotkeys': _0x3d775c,
                'ogarioPlayerProfiles': _0x420606,
                'ogarioSettings': CLIENT_SETTINGS,
                'ogarioThemeSettings': PRESET
            };
            for (var _0x1bba2a in _0x27b39e) {
                if (_0x27b39e.hasOwnProperty(_0x1bba2a)) {
                    var _0x4bfc16 = $('#export-' + _0x1bba2a).prop('checked');
                    if (!_0x4bfc16) {
                        delete _0x27b39e[_0x1bba2a];
                    }
                }
            }
            _0x27b39e = JSON.stringify(_0x27b39e);
            $('#export-settings').val(_0x27b39e);
            $('#import-settings').val('');
            _0x27b39e = null;
        },
        'importSettings': function () {
            $('#import-settings').blur();
            var _0x1ef00e = $('#import-settings').val();
            if (_0x1ef00e) {
                _0x1ef00e = JSON.parse(_0x1ef00e);
                for (var _0x591db7 in _0x1ef00e) {
                    if (_0x1ef00e.hasOwnProperty(_0x591db7)) {
                        var _0xb73052 = $('#import-' + _0x591db7).prop('checked');
                        if (!_0xb73052) {
                            continue;
                        }
                        window.localStorage.setItem(_0x591db7, JSON.stringify(_0x1ef00e[_0x591db7]));
                    }
                }
                window.location.reload();
            }
        },
        'restoreSettings': function () {
            if (window.localStorage.getItem('ogarioSettings') !== null) {
                window.localStorage.removeItem('ogarioSettings');
                window.location.reload();
            }
        },
        'setSettings': function (_0x55e321, _0x3c1bf9) {
            if (CLIENT_SETTINGS.hasOwnProperty(_0x55e321) && _0x3c1bf9 !== null) {
                CLIENT_SETTINGS[_0x55e321] = _0x3c1bf9;
                if (CLIENT2.hasOwnProperty(_0x55e321)) {
                    CLIENT2[_0x55e321] = _0x3c1bf9;
                }
                switch (_0x55e321) {
                case 'autoResp':
                    this.setAutoResp();
                    break;
                case 'showMiniMap':
                    this.setMiniMap();
                    break;
                case 'showMiniMapGrid':
                    this.resetMiniMapSectors();
                    break;
                case 'disableChat':
                    this.setDisableChat();
                    break;
                case 'chatSounds':
                    this.setChatSoundsBtn();
                    break;
                case 'showChatBox':
                    this.setShowChatBox();
                    break;
                case 'showTop5':
                    this.setTop5();
                    break;
                case 'showTargeting':
                    this.setTargetingHUD();
                    break;
                case 'showTime':
                    this.displayTime();
                    $('#time-hud').show();
                    break;
                case 'centeredLb':
                    this.setCenteredLb();
                    break;
                case 'normalLb':
                    this.setNormalLb();
                    break;
                case 'fpsAtTop':
                    this.setFpsAtTop();
                    break;
                case 'showStats':
                    this.displayStats();
                    $('#stats-hud').show();
                    break;
                case 'blockPopups':
                    this.setBlockPopups();
                    break;
                }
                this.saveSettings(CLIENT_SETTINGS, 'ogarioSettings');
            }
        },
        'loadProfiles': function () {
            if (window.localStorage.getItem('ogarioPlayerProfiles') !== null) {
                _0x420606 = JSON.parse(window.localStorage.getItem('ogarioPlayerProfiles'));
            } else {
                for (var _0x382aa0 = 0x0; _0x382aa0 < 0xa; _0x382aa0++) {
                    _0x420606.push({
                        'nick': 'Profile #' + (_0x382aa0 + 0x1),
                        'clanTag': '',
                        'skinURL': '',
                        'color': PRESET.mainColor
                    });
                }
            }
            if (window.localStorage.getItem('ogarioSelectedProfile') !== null) {
                this.selectedProfile = JSON.parse(window.localStorage.getItem('ogarioSelectedProfile'));
            }
            _0x4673ea.nick = _0x420606[this.selectedProfile].nick;
            _0x4673ea.clanTag = _0x420606[this.selectedProfile].clanTag;
            _0x4673ea.skinURL = _0x420606[this.selectedProfile].skinURL;
            _0x4673ea.color = _0x420606[this.selectedProfile].color;
        },
        'changeSkinPreview': function (_0x2638e1, _0x46803f) {
            if (!_0x2638e1 || !_0x46803f) {
                return;
            }
            if (_0x46803f === 'skin-preview') {
                //m00
                $('#skin-preview').removeClass('default').append('<a href="#" id="skin-popover" data-toggle="popover" title=""></a>'),

                //$('#skin-preview').removeClass('default').append('<a href="#" id="skin-popover" data-toggle="popover" title="" data-html="true" data-content="<img src=\'' + _0x2638e1.src + '\' width=\'500\'>"></a>');
                $('#skin-popover').append($(_0x2638e1).fadeIn(0x3e8));
                $('#skin-popover').popover();
            } else {
                $('#' + _0x46803f).removeClass('default').append($(_0x2638e1).fadeIn(0x3e8));
            }
        },
        'setSkinPreview': function (_0x4f7a68, _0x32b04b) {
            var _0x5aff0a = _0x32b04b == 'skin-preview';
            if ($('#' + _0x32b04b + ' img').attr('src') === _0x4f7a68) {
                return;
            }
            $('#' + _0x32b04b).empty().addClass('default');
            if (!_0x4f7a68) {
                _0x5aff0a && $('#skin').popover('hide');
                return;
            }
            if (!this.checkSkinURL(_0x4f7a68)) {
                if (_0x5aff0a) {
                    var _0x3b4e77 = '<p><strong>Submitted URL is not valid.</strong></p>';
                    if (/hizliresim.com/ .test(_0x4f7a68)) {
                        _0x3b4e77 += '<p>NOTICE: <strong>hizliresim.com</strong> is not supported anymore.</p>';
                    }
                    _0x3b4e77 += '<p>Check if URL:</p><ul><li>is supported by OGARio (see list below)</li><li>is no longer than 60 characters</li></ul>';
                    _0x3b4e77 += '<p>Supported image hosting sites:</p>';
                    _0x3b4e77 += '<ol>';
                    for (var _0x4d0eda = 0x0; _0x4d0eda < imagePatterns.length; _0x4d0eda++) {
                        _0x3b4e77 += '<li><strong><a href="' + imagePatterns[_0x4d0eda].url + '\" rel=\"noreferrer noopener\" target=\"_blank\">' + imagePatterns[_0x4d0eda].name + '</a></strong><span class="example-url">e.g. <a href="' + imagePatterns[_0x4d0eda].example + '"  rel="noreferrer noopener" target="_blank">' + imagePatterns[_0x4d0eda].example + '</a></span></li>';
                    }
                    _0x3b4e77 += '</ol>';
                    $('#skin').attr('data-content', _0x3b4e77);
                    $('#skin').popover('show');
                    $('#skin').focus();
                }
                return;
            }
            var _0x248d39 = this;
            var _0xf9e94c = new Image();
            _0xf9e94c.crossOrigin = 'Anonymous';
            _0xf9e94c.onload = function () {
                _0x248d39.changeSkinPreview(_0xf9e94c, _0x32b04b);
                _0x5aff0a && $('#skin').popover('hide');
            };
            _0xf9e94c.onerror = function () {
                if (_0x5aff0a) {
                    var _0x3b4e77 = '<p><strong>Error while loading image.</strong></p>';
                    _0x3b4e77 += '<p>Check if image URL is valid.</p>';
                    $('#skin').attr('data-content', _0x3b4e77);
                    $('#skin').popover('show');
                    $('#skin').focus();
                }
            };
            _0xf9e94c.src = _0x4f7a68;
        },
        'setProfile': function () {
            var _0x1ae835 = (_0x420606.length + this.selectedProfile - 0x1) % _0x420606.length;
            var _0x2868b7 = (this.selectedProfile + 0x1) % _0x420606.length;
            this.setSkinPreview(_0x420606[_0x1ae835].skinURL, 'prev-profile');
            this.setSkinPreview(_0x420606[this.selectedProfile].skinURL, 'skin-preview');
            this.setSkinPreview(_0x420606[_0x2868b7].skinURL, 'next-profile');
            this.saveSettings(this.selectedProfile, 'ogarioSelectedProfile');
            $('#nick').val(_0x420606[this.selectedProfile].nick);
            $('#clantag').val(_0x420606[this.selectedProfile].clanTag);
            $('#skin').val(_0x420606[this.selectedProfile].skinURL);
            $('#color').val(_0x420606[this.selectedProfile].color);
            $('.skin').colorpicker('setValue', _0x420606[this.selectedProfile].color);
            $('#skins a').removeClass('selected');
            $('#skins a[data-profile=\'' + this.selectedProfile + '\']').addClass('selected');
        },
        'prevProfile': function () {
            this.setPlayerSettings();
            this.selectedProfile = (_0x420606.length + this.selectedProfile - 0x1) % _0x420606.length;
            this.setProfile();
        },
        'nextProfile': function () {
            this.setPlayerSettings();
            this.selectedProfile = (this.selectedProfile + 0x1) % _0x420606.length;
            this.setProfile();
        },
        'selectProfile': function (_0x2026d1) {
            this.setPlayerSettings();
            this.selectedProfile = parseInt(_0x2026d1);
            this.setProfile();
        },
        'addOption': function (_0x5ce98d, _0x503133, _0x4ba017, _0x3df2c3) {
            $(_0x5ce98d).append('<label><input type=\"checkbox\" id=\"' + _0x503133 + '" class="js-switch"> ' + _0x4ba017 + '</label>');
            $('#' + _0x503133).prop('checked', _0x3df2c3);
        },
        'addOptions': function (_0x5cb066, _0x67617c) {
            if (!_0x5cb066) {
                return;
            }
            $('#og-options').append('<div class="options-box ' + _0x67617c + '\"><h5 class=\"menu-main-color\">' + i18n[_0x67617c] + '</h5></div>');
            for (var _0x1a02ef = 0x0; _0x1a02ef < _0x5cb066.length; _0x1a02ef++) {
                var _0xf023ad = _0x5cb066[_0x1a02ef];
                if (CLIENT_SETTINGS.hasOwnProperty(_0xf023ad)) {
                    $('.' + _0x67617c).append('<label>' + i18n[_0xf023ad] + ' <input type="checkbox" class="js-switch" id="' + _0xf023ad + '\"></label>');
                    $('#' + _0xf023ad).prop('checked', CLIENT_SETTINGS[_0xf023ad]);
                }
            }
        },
        'addInputBox': function (_0x3ac6bf, _0x52878f, _0x1de75a, _0x1dd043) {
            $(_0x3ac6bf).append('<div class=\"input-box\"><span class=\"title-box\">' + i18n[_0x52878f] + '</span><input id=\"' + _0x52878f + '" class="form-control" placeholder="' + _0x1de75a + '" value="' + CLIENT_SETTINGS[_0x52878f] + '" /></div>');
            var _0x57fbd6 = this;
            $('#' + _0x52878f).on('input', function () {
                CLIENT_SETTINGS[_0x52878f] = this.value;
                _0x57fbd6[_0x1dd043]();
                _0x57fbd6.saveSettings(CLIENT_SETTINGS, 'ogarioSettings');
            });
        },
        'addSliderBox': function (_0x56f505, _0x1c15d3, _0x50c451, _0x189ec6, _0x2b7adb, _0x829dbf) {
            $(_0x56f505).append('<div class="slider-box"><div class="box-label"><span class="value-label">' + i18n[_0x1c15d3] + ': </span><span id="' + _0x1c15d3 + '-value" class="value">' + CLIENT_SETTINGS[_0x1c15d3] + '</span></div><input id="' + _0x1c15d3 + '-slider\" type=\"range\" min=\"' + _0x50c451 + '" max="' + _0x189ec6 + '" step="' + _0x2b7adb + '" value="' + CLIENT_SETTINGS[_0x1c15d3] + '"></div>');
            var _0x2f7b75 = this;
            if (_0x829dbf) {
                $('#' + _0x1c15d3 + '-slider').on('input', function () {
                    var _0x227cea = parseFloat($(this).val());
                    $('#' + _0x1c15d3 + '-value').text(_0x227cea);
                    CLIENT_SETTINGS[_0x1c15d3] = _0x227cea;
                    if (CLIENT2.hasOwnProperty(_0x1c15d3)) {
                        CLIENT2[_0x1c15d3] = _0x227cea;
                    }
                    _0x2f7b75[_0x829dbf]();
                    _0x2f7b75.saveSettings(CLIENT_SETTINGS, 'ogarioSettings');
                });
            } else {
                $('#' + _0x1c15d3 + '-slider').on('input', function () {
                    var _0x39a5a8 = parseFloat($(this).val());
                    $('#' + _0x1c15d3 + '-value').text(_0x39a5a8);
                    CLIENT_SETTINGS[_0x1c15d3] = _0x39a5a8;
                    if (CLIENT2.hasOwnProperty(_0x1c15d3)) {
                        CLIENT2[_0x1c15d3] = _0x39a5a8;
                    }
                    _0x2f7b75.saveSettings(CLIENT_SETTINGS, 'ogarioSettings');
                });
            }
        },
        'setLang': function () {
            if (_0x2bb6c3 !== 'pl') {
                return;
            }
            if (window.i18n_dict && window.i18n_dict.en) {
                for (var _0x4ccec7 in window.i18n_dict.en) {
                    if (window.i18n_dict.en.hasOwnProperty(_0x4ccec7) && i18n.hasOwnProperty(_0x4ccec7)) {
                        window.i18n_dict.en[_0x4ccec7] = i18n[_0x4ccec7];
                    }
                }
            }
        },
        'setMenu': function () {
            var _0x3f90d3 = this;
            document.title = this.name;
            /*$('#mainPanel').before('<div id="exp-bar" class="agario-panel"><span class="ogicon-user"></span><div class="agario-exp-bar progress"><span class="progress-bar-text"></span><div class="progress-bar progress-bar-striped" style="width: 0%;"></div></div><div class="progress-bar-star"></div></div><div id="main-menu" class="agario-panel"><ul class="menu-tabs"><li class="start-tab active"><a href="#main-panel" class="active ogicon-home" data-toggle="tab-tooltip" title="' + _0x5464ff.start + '"></a></li><li class="profile-tab"><a href="#profile" class="ogicon-user" data-toggle="tab-tooltip" title="' + _0x5464ff.profile + '"></a></li><li class="settings-tab"><a href="#og-settings" class="ogicon-cog" data-toggle="tab-tooltip" title="' + _0x5464ff.settings + '\"></a></li><li class=\"theme-tab\"><a href=\"#theme\" class=\"ogicon-droplet\" data-toggle=\"tab-tooltip\" title=\"' + _0x5464ff.theme + '"></a></li><li class="hotkeys-tab"><a href="#" class="hotkeys-link ogicon-keyboard" data-toggle="tab-tooltip" title="' + _0x5464ff.hotkeys + '\"></a></li><li class=\"music-tab\"><a href=\"#music\" class=\"ogicon-music\" data-toggle=\"tab-tooltip\" title=\"Radio / ' + _0x5464ff.sounds + '"></a></li></ul><div id="main-panel" class="menu-panel"></div><div id="profile" class="menu-panel"></div><div id="og-settings" class="menu-panel"><div class="submenu-panel"></div></div><div id="theme" class="menu-panel"></div><div id="music" class="menu-panel"></div></div>');
            $('#main-panel').append('<a href="#" class="quick quick-menu ogicon-menu"></a><a href="#" class="quick quick-skins ogicon-images"></a><div id="profiles"><div id="prev-profile" class="skin-switch"></div><div id="skin-preview"></div><div id="next-profile" class="skin-switch"></div></div>');
            $('#mainPanel div[role=form]').appendTo($('#main-panel'));
            $('#main-panel div[role=form] .form-group:first').remove();
            $('#nick').before('<input id="clantag" class="form-control" placeholder="Tag, e.g. Ⓜ" maxlength="10"><div class="input-group nick"></div>');
            $('#nick').appendTo($('.nick'));
            $('.nick').append('<span class="input-group-btn"><button id="stream-mode" class="btn active ogicon-eye"></button></span>');
            $('.nick').after('<div class="input-group skin"><input id="skin" class="form-control" placeholder="Skin URL (direct link)" maxlength="60"><input type="hidden" id="color" value="' + _0x4673ea.color + '" maxlength="7" /><span class="input-group-addon"><i></i></span><span class="input-group-btn"><button id="hide-url" class="btn active ogicon-eye"></button></span></div>');
            $('#locationKnown, #locationUnknown').insertAfter($('.skin'));
            $('#region').before('<button class="btn btn-warning btn-server-info ogicon-cogs"></button>');
            $('.btn-spectate, .btn-logout').appendTo('#agario-main-buttons');
            $('#agario-main-buttons').addClass('clearfix').before('<div id="server-info" class="form-group clearfix"><input id="server-ws" class="form-control" placeholder="Server WS"><button id="server-connect" class="btn btn-success ogicon-power"></button><button id="server-reconnect" class="btn btn-primary ogicon-redo2"></button><input id="server-token" class="form-control" placeholder="Server token"><button id="server-join" class="btn btn-success" data-itr="page_join_party">Join</button></div>');
            $('#helloContainer div[role=form]').after('<div id="ogario-party" class="clearfix"><input id="party-token" class="form-control" placeholder="Party token"></div>');
            $('#ogario-party').append('<button id="join-party-btn-2" class="btn btn-success" data-itr="page_join_party">Join</button><button id="create-party-btn-2" class="btn btn-primary" data-itr="page_create_party">Create</button>');
            $('#pre-join-party-btn:first, #join-party-btn:first, #create-party-btn:first, #leave-party-btn:first, #joinPartyToken:first, .party-icon-back:first').appendTo($('#ogario-party'));
            $('#settingsChoice, #options').appendTo($('#og-settings .submenu-panel'));
            $('#stats').appendTo($('#main-menu')).addClass('menu-panel');
            $('#statsContinue').attr('id', 'statsContinue2');
            $('#mainPanel').empty().remove();
            $('.center-container').addClass('ogario-menu');
            $('.center-container').append('<div id="menu-footer" class="menu-main-color">' + _0x5464ff.visit + ' <a href="https://ogario.ovh" target="_blank">ogario.ovh</a> | ' + this.version + ' <a href="https://goo.gl/nRREoR" class="release ogicon-info" target="_blank"></a></div>');
            $('#leftPanel, #rightPanel').addClass('ogario-menu').removeAttr('id');
            $('.agario-profile-panel, .agario-panel-freecoins, .agario-panel-gifting, .agario-shop-panel, #dailyquests-panel').appendTo($('#profile')).removeClass('agario-side-panel');
            $('.agario-profile-panel').after('<div id="block-warn">' + _0x5464ff.blockWarn + '<br><a href="#" id="unblock-popups">' + _0x5464ff.unblockPopups + '</a></div>');
            $('#exp-bar').addClass('agario-profile-panel');
            $('.left-container').empty();
            $('.agario-shop-panel').after('<div class="agario-panel ogario-yt-panel"><h5 class="menu-main-color">Team OGARio (tag: Ⓜ)</h5><div class="g-ytsubscribe" data-channelid="UCaWiPNJWnhzYDrBQoXokn6w" data-layout="full" data-theme="dark" data-count="default"></div></div>');
            $('#tags-container').appendTo($('#profile'));
            $('.btn-logout').appendTo($('#profile'));
            $('.left-container').append('<div id="quick-menu" class="agario-panel agario-side-panel"><a href="https://ogario.ovh/skins/" class="quick-more-skins ogicon-grin" target="_blank" data-toggle="tab-tooltip" data-placement="left" title="' + _0x5464ff.skins + '"></a><a href="https://youtube.com/channel/UCaWiPNJWnhzYDrBQoXokn6w" class="quick-yt ogicon-youtube2" target="_blank" data-toggle="tab-tooltip" data-placement="left" title="Team OGARio"></a></div>');
            */if (!this.protocolMode) {
                $('#quick-menu').prepend('<a href=\"#\" class=\"quick-shop ogicon-cart\" data-toggle=\"tab-tooltip\" data-placement=\"left\" title=\"' + i18n.page_shop + '\"></a><a href=\"#\" class=\"quick-free-coins ogicon-coin-dollar\" data-toggle=\"tab-tooltip\" data-placement=\"left\" title=\"' + i18n.page_menu_main_free_coins + '\"></a><a href=\"#\" class=\"quick-free-gifts ogicon-gift\" data-toggle=\"tab-tooltip\" data-placement=\"left\" title=\"' + i18n.page_menu_main_gifts + '"></a><a href="#" class="quick-quests ogicon-trophy" data-toggle="tab-tooltip" data-placement="left" title="' + i18n.page_menu_main_dailyquests + '\"></a>');
            }
            /*$('.party-dialog, .partymode-info').remove();
            $('.agario-party-6').appendTo($('.center-container'));
            $('.right-container').empty();
            $('.right-container').append('<div class="agario-party"></div>');
            $('.agario-party-6').appendTo($('.agario-party')).addClass('agario-panel agario-side-panel');
            $('.agario-party h4, #cancel-party-btn').remove();
            $('.agario-party .btn').addClass('btn-sm');
            $('.right-container').append('<div id=\"skins-panel\" class=\"agario-panel agario-side-panel\"><div id=\"skins\"></div><a href=\"https://ogario.ovh/skins/\" id=\"more-skins\" class=\"btn btn-block btn-success\" target=\"_blank\">' + _0x5464ff.moreSkins + '</a></div>');
            $('.btn-settings, .text-muted, .tosBox, .agario-promo, #agario-web-incentive, span[data-itr=\'page_option_dark_theme\'], #options #darkTheme').remove();
            $('#advertisement, #adbg, #a320x250, #g320x250, #s320x250, #adsBottom').css('display', 'none');
            $('#advertisement').removeClass('agario-panel');
            $('#adsBottom').css({
                'z-index': '1',
                'opacity': '0',
                'bottom': '-100px'
            });
            $('#noNames, #showMass').remove();
            $('#og-settings .submenu-panel').append('<div id=\"og-options\"></div>');
            */this.addOptions([], 'animationGroup');
            this.addOptions(['autoZoom'], 'zoomGroup');
            this.addOptions(['jellyPhisycs','virusSound'], 'modGroup');
            this.addOptions(['quickResp', 'autoResp'], 'respGroup');
            this.addOptions(['noNames', 'optimizedNames', 'autoHideNames', 'hideMyName', 'hideTeammatesNames', 'namesStroke'], 'namesGroup');
            this.addOptions(['showMass', 'optimizedMass', 'autoHideMass', 'hideMyMass', 'hideEnemiesMass', 'shortMass', 'virMassShots', 'massStroke'], 'massGroup');
            if (this.protocolMode) {
                this.addOptions(['customSkins'], 'skinsGroup');
            } else {
                this.addOptions(['customSkins', 'vanillaSkins'], 'skinsGroup');
            }
            this.addOptions(['optimizedFood', 'autoHideFood', 'autoHideFoodOnZoom', 'rainbowFood'], 'foodGroup');
            this.addOptions(['myCustomColor', 'myTransparentSkin', 'transparentSkins', 'transparentCells', 'transparentViruses'], 'transparencyGroup');
            this.addOptions(['showGrid', 'showBgSectors', 'showMapBorders'], 'gridGroup');
            this.addOptions(['disableChat', 'chatSounds', 'chatEmoticons', 'showChatImages', 'showChatVideos', 'showChatBox'], 'chatGroup');
            this.addOptions(['showMiniMap', 'showMiniMapGrid', 'showMiniMapGuides', 'showMiniMapGhostCells', 'oneColoredTeammates'], 'miniMapGroup');
            this.addOptions(['oppColors', 'oppRings', 'virColors', 'splitRange', 'virusesRange', 'cursorTracking', 'teammatesInd', 'showGhostCells'], 'helpersGroup');
            this.addOptions(['mouseSplit', 'mouseFeed', 'mouseInvert'], 'mouseGroup');
            this.addOptions(['showTop5', 'showTargeting', 'showLbData', 'centeredLb', 'normalLb', 'fpsAtTop'], 'hudGroup');
            this.addOptions(['showStats', 'showStatsMass', 'showStatsSTE', 'showStatsN16', 'showStatsFPS', 'showTime'], 'statsGroup');
            /*if (!this.protocolMode) {
                this.addOptions(['blockPopups'], 'extrasGroup');
                $('#noSkins, #noColors, #skipStats, #showQuest').addClass('js-switch-vanilla');
                $('.skinsGroup h5').after('<label class="noSkins">' + _0x5464ff.noSkins + ' </label>');
                $('#noSkins').appendTo($('.noSkins'));
                $('.transparencyGroup h5').after('<label class=\"noColors\">' + _0x5464ff.noColors + ' </label>');
                $('#noColors').appendTo($('.noColors'));
                $('.extrasGroup h5').after('<label class="skipStats">' + _0x5464ff.skipStats + ' </label>');
                $('#skipStats').appendTo($('.skipStats'));
                $('.skipStats').after('<label class=\"showQuest\">' + _0x5464ff.showQuest + ' </label>');
                $('#showQuest').appendTo($('.showQuest'));
                $('#options').remove();
                $('#settingsChoice').appendTo($('.extrasGroup')).addClass('select-wrapper');
            }
            */this.addSliderBox('.animationGroup', 'animation', 50, 0xc8, 0x1);
            this.addSliderBox('.zoomGroup', 'zoomSpeedValue', 0.75, 0.99, 0.01);
            /*$('#og-settings').append('<button class=\"btn btn-block btn-success btn-export\">' + _0x5464ff.exportImport + '</button>');
            $('#og-settings').append('<div class="restore-settings"><a href="#">' + _0x5464ff.restoreSettings + '</a></div>');
            $('#music').append('<div class="agario-panel radio-panel"><h5 class="menu-main-color">Radio (' + _0x5464ff.thanks + ')</h5><audio src="http://frshoutcast.comunicazion.eu:8815/;" controls></audio><span class="playlist"><span class="ogicon-file-music"></span> <a href="http://frshoutcast.comunicazion.eu:8815/played.html?sid=1" target="_blank">' + _0x5464ff.playlist + '</a></span></div>');
            $('#music').append('<div class="agario-panel sounds-panel"><h5 class="menu-main-color">' + _0x5464ff.sounds + '</h5></div>');
            $('#music').append('<div class=\"agario-panel ogario-yt-panel\"><h5 class=\"menu-main-color\">Team OGARio (tag: Ⓜ)</h5><div class=\"g-ytsubscribe\" data-channelid=\"UCaWiPNJWnhzYDrBQoXokn6w\" data-layout=\"full\" data-theme=\"dark\" data-count=\"default\"></div></div>');
            */this.addInputBox('.sounds-panel', 'messageSound', 'Sound URL', 'setMessageSound');
            this.addInputBox('.sounds-panel', 'commandSound', 'Sound URL', 'setCommandSound');
            /*$('body').append('<div id="overlays-hud" data-gamemode=":ffa"><div id="stats-hud" class="hud stats-hud-color"></div> <div id="top5-hud" class="hud"><h5 class="hud-main-color">Team top <span class="team-top">5</span></h5><div class="hud-main-color team-top-menu"><a href="#" data-limit="5" class="team-top-limit active">5</a> | <a href="#" data-limit="10" class="team-top-limit">10</a> | <a href="#" data-limit="100" class="team-top-limit">100</a></div><ol id="top5-pos"></ol><div id="top5-total"><span class="hud-main-color ogicon-users"></span> ' + _0x5464ff.totalPartyPlayers + ': <span id=\"top5-total-players\" class=\"top5-mass-color\">0</span><br><span class=\"hud-main-color ogicon-pacman\"></span> ' + _0x5464ff.totalPartyMass + ': <span id="top5-total-mass" class="top5-mass-color">0</span></div></div> <div id="time-hud" class="hud time-hud-color"></div> <div id="pause-hud" class="hud">' + _0x5464ff.pause + '</div> <div id="leaderboard-hud" class="hud-b"><h4 class="hud-main-color">ogario.ovh</h4><div id="leaderboard-data"></div><div id="leaderboard-positions"></div></div> <div id="btl-leaderboard-hud"><div class="hud hud-c"><span id="btl-players-status">Players ready</span>: <span id="btl-players-count">0</span></div></div> <div id="minimap-hud" class="hud-b"><canvas id="minimap-sectors"></canvas><canvas id="minimap"></canvas></div><div id="target-hud" class="hud"><div id="target-player"><span id="target-skin"><img src="https://cdn.ogario.ovh/static/img/blank.png" alt=""> </span><span id="target-nick"></span> <span id="target-status" class="hud-main-color">[' + _0x5464ff.targetNotSet + ']</span></div><div id="target-summary"></div></div><div id="target-panel-hud" class="hud"><a href="#" id="set-targeting" class="ogicon-target"></a><a href="#" id="set-private-minimap" class="ogicon-location2"></a><a href="#" id="cancel-targeting" class="ogicon-cancel-circle"></a><a href="#" id="change-target" class="ogicon-arrow-right"></a></div> <div id="quest-hud" class="hud"></div> <div id="btl-hud" class="hud"></div></div>');
            $('body').append('<ul id="messages"></ul>');
            $('body').append('<div id="message-box"><div id="chat-emoticons"></div><div id="message-menu"><a href="#" class="chat-sound-notifications ogicon-volume-high"></a><a href="#" class="chat-active-users ogicon-user-check"></a><a href="#" class="chat-muted-users ogicon-user-minus"></a><a href="#" class="show-chat-emoticons ogicon-smile"></a></div><input type="text" id="message" class="form-control" placeholder="' + _0x5464ff.enterChatMsg + '..." maxlength="80"></div>');
            $('body').append('<div id="chat-box"></div>');
            */
           document.title = this.name
           
            for (var _0x36e3d0 in SMILES) {
                if (SMILES.hasOwnProperty(_0x36e3d0)) {
                    $('#chat-emoticons').append('<img src="https://cdn.ogario.ovh/static/emoticons/' + SMILES[_0x36e3d0] + '\" alt=\"' + _0x36e3d0 + '" class="emoticon">');
                }
            }
            $('body').append('<div id="exp-imp"><div id="exp-imp-menu"><button id="close-exp-imp" class="btn btn-danger">' + i18n.close + '</button></div><div id=\"exp-imp-settings\"></div></div>');
            $('#exp-imp-settings').append('<h1>' + i18n.exportSettings + '</h1><h2>' + i18n.exportInfo + '</h2>');
            this.addOption('#exp-imp-settings', 'export-ogarioCommands', i18n.commands, true);
            this.addOption('#exp-imp-settings', 'export-ogarioHotkeys', i18n.hotkeys, true);
            this.addOption('#exp-imp-settings', 'export-ogarioPlayerProfiles', i18n.profiles, true);
            this.addOption('#exp-imp-settings', 'export-ogarioSettings', i18n.settings, true);
            this.addOption('#exp-imp-settings', 'export-ogarioThemeSettings', i18n.theme, true);
            $('#exp-imp-settings').append('<textarea id="export-settings" class="form-control" rows="14" cols="100" spellcheck="false" readonly /><button id="export-settings-btn" class="btn btn-block btn-success">' + i18n.exportSettings + '</button>');
            $('#exp-imp-settings').append('<h1>' + i18n.importSettings + '</h1><h2>' + i18n.importInfo + '</h2>');
            this.addOption('#exp-imp-settings', 'import-ogarioCommands', i18n.commands, true);
            this.addOption('#exp-imp-settings', 'import-ogarioHotkeys', i18n.hotkeys, true);
            this.addOption('#exp-imp-settings', 'import-ogarioPlayerProfiles', i18n.profiles, true);
            this.addOption('#exp-imp-settings', 'import-ogarioSettings', i18n.settings, true);
            this.addOption('#exp-imp-settings', 'import-ogarioThemeSettings', i18n.theme, true);
            $('#exp-imp-settings').append('<textarea id="import-settings" class="form-control" rows="14" cols="100" spellcheck="false" /><button id="import-settings-btn" class="btn btn-block btn-success">' + i18n.importSettings + '</button>');
            INTERFACE_HELPER && INTERFACE_HELPER.setThemeMenu();
            for (var _0x289c56 = 0x0; _0x289c56 < _0x420606.length; _0x289c56++) {
                $('#skins').append('<div class="skin-box"><a href="#profile-' + _0x289c56 + '\" id=\"profile-' + _0x289c56 + '" data-profile="' + _0x289c56 + '" class="skin-switch"></a></div>');
                this.setSkinPreview(_0x420606[_0x289c56].skinURL, 'profile-' + _0x289c56);
                if (_0x289c56 == this.selectedProfile) {
                    $('#profile-' + _0x289c56).addClass('selected');
                }
            }


            Math.rad = function(degrees) {return degrees * Math.PI / 180} 
            Math.deg = function(radians) {return radians * 180 / Math.PI}

            radius = 50
            centerX = 50
            centerY = 50

            function calc(){
            //console.clear()
            var els=document.getElementsByClassName('skin-box')
            var len=els.length

            var theta = Math.rad(40)
            var deg =  Math.rad(100*2/(len-2))
            
            var theta2 =Math.rad(-40)
            var deg2 = Math.rad(-100*2/(len-2))

            for(var i=0;els.length>i;i++){
                if(i>Math.ceil(len/2))break
            var x = centerX + radius * Math.cos(theta)
            var y = centerY - radius * Math.sin(theta)
            els[i].style=
                'top: '+x+'%;left: '+y+'%;z-index:'+(200-i)
            //els[i].innerText=Math.deg(theta)
            theta+=deg


            }
            
                for(var i=Math.floor(els.length/2);els.length>i;i++){
            var x = centerX + radius * Math.cos(theta2)
            var y = centerY - radius * Math.sin(theta2)
            els[i].style=
                'top: '+x+'%;left: '+y+'%;z-index:'+(200-i)
            //els[i].innerText=Math.deg(theta2)
            theta2+=deg2


            }
            

            }
            calc()


        },
        'setUI': function () {
            var _0x54ce18 = this;
            $(document).on('click', '.menu-tabs a', function (_0x4668d0) {
                _0x4668d0.preventDefault();
                _0x54ce18.switchMenuTabs($(this), 'menu-panel');
            });
            $(document).on('click', '.submenu-tabs a', function (_0x3b871d) {
                _0x3b871d.preventDefault();
                _0x54ce18.switchMenuTabs($(this), 'submenu-panel');
            });
            $(document).on('click', '.quick-menu', function (_0x37de36) {
                _0x37de36.preventDefault();
                CLIENT_SETTINGS.showQuickMenu = !CLIENT_SETTINGS.showQuickMenu;
                _0x54ce18.saveSettings(CLIENT_SETTINGS, 'ogarioSettings');
                _0x54ce18.setShowQuickMenu();
            });
            $(document).on('click', '.quick-skins', function (_0x164ffe) {
                _0x164ffe.preventDefault();
                CLIENT_SETTINGS.showSkinsPanel = !CLIENT_SETTINGS.showSkinsPanel;
                _0x54ce18.saveSettings(CLIENT_SETTINGS, 'ogarioSettings');
                _0x54ce18.setShowSkinsPanel();
            });
            $(document).on('change', '#region', function () {
                _0x54ce18.region = this.value;
            });
            $(document).on('change', '#gamemode', function () {
                var _0x2e80aa = this.value;
                if (_0x2e80aa !== ':party') {
                    _0x54ce18.leaveParty();
                }
                _0x54ce18.gameMode = CLIENT2.gameMode = _0x2e80aa;
                _0x54ce18.setQuest();
            });
            $(document).on('change', '#quality', function () {
                _0x54ce18.getQuality(this.value);
                TRANSFORM_WIEW();
            });
            $('#skin').popover({
                'html': true,
                'placement': 'bottom',
                'trigger': 'manual',
                'animation': false
            });
            $(document).on('input click', '#skin', function () {
                var _0x248b63 = this.value;
                _0x54ce18.setSkinPreview(_0x248b63, 'skin-preview');
                _0x54ce18.setSkinPreview(_0x248b63, 'profile-' + _0x54ce18.selectedProfile);
            });
            $(document).on('click', '.skin .example-url a', function (_0x179081) {
                _0x179081.preventDefault();
                $('#skin').val(this.href).click();
            });
            $(document).on('click', '#overlays', function () {
                if (!$('.skin:hover').length && !$('.skin-switch:hover').length) {
                    $('#skin').popover('hide');
                }
            });
            $(document).on('click', '#skins a', function (_0x14dbfa) {
                _0x14dbfa.preventDefault();
                _0x54ce18.selectProfile($(this).attr('data-profile'));
            });
            $(document).on('click', '#prev-profile', function () {
                _0x54ce18.prevProfile();
            });
            $(document).on('click', '#next-profile', function () {
                _0x54ce18.nextProfile();
            });
            $(document).on('click', '#stream-mode', function () {
                CLIENT_SETTINGS.streamMode = !CLIENT_SETTINGS.streamMode;
                _0x54ce18.saveSettings(CLIENT_SETTINGS, 'ogarioSettings');
                _0x54ce18.setStreamMode();
            });
            $(document).on('click', '#hide-url', function () {
                CLIENT_SETTINGS.hideSkinUrl = !CLIENT_SETTINGS.hideSkinUrl;
                _0x54ce18.saveSettings(CLIENT_SETTINGS, 'ogarioSettings');
                _0x54ce18.setHideSkinUrl();
            });
            $(document).on('click', '.btn-server-info', function () {
                $('#server-info').toggle();
            });
            $(document).on('click', '#server-connect', function () {
                _0x54ce18.gameServerConnect($('#server-ws').val());
            });
            $(document).on('click', '#server-reconnect', function () {
                _0x54ce18.gameServerReconnect();
            });
            $(document).on('click', '#server-join', function () {
                _0x54ce18.gameServerJoin($('#server-token').val());
            });
            $(document).on('change', '#og-options input[type=\'checkbox\']', function () {
                var _0x32e509 = $(this);
                _0x54ce18.setSettings(_0x32e509.attr('id'), _0x32e509.prop('checked'));
            });
            $(document).on('change', '.js-switch-vanilla', function () {
                var _0x213f24 = $(this);
                var _0x32f315 = _0x213f24.attr('id');
                if (typeof _0x54ce18[_0x32f315] !== 'undefined') {
                    _0x54ce18[_0x32f315] = _0x213f24.prop('checked');
                    if (_0x32f315 === 'noSkins') {
                        CLIENT2.showCustomSkins = !_0x54ce18.noSkins;
                    }
                    if (_0x32f315 === 'showQuest') {
                        _0x54ce18.setQuest();
                    }
                }
            });
            $(document).on('click', '#og-settings .restore-settings a', function (_0x1773a3) {
                _0x1773a3.preventDefault();
                _0x54ce18.restoreSettings();
            });
            $(document).on('click', '#og-settings .btn-export', function (_0xdb1fdd) {
                _0xdb1fdd.preventDefault();
                _0x54ce18.exportSettings();
                $('#exp-imp').fadeIn(0x1f4);
                $('#exp-imp-settings, #export-settings').perfectScrollbar('update');
            });
            $(document).on('click', '#close-exp-imp', function (_0x792cc8) {
                _0x792cc8.preventDefault();
                $('#exp-imp').fadeOut(0x1f4);
            });
            $(document).on('focus', '#export-settings', function () {
                $(this).select();
            });
            $(document).on('click', '#export-settings-btn', function (_0x13bfbd) {
                _0x13bfbd.preventDefault();
                _0x54ce18.exportSettings();
            });
            $(document).on('click', '#import-settings-btn', function (_0x5dd67c) {
                _0x5dd67c.preventDefault();
                _0x54ce18.importSettings();
            });
            $(document).on('click', '#unblock-popups', function (_0x3cebd9) {
                _0x3cebd9.preventDefault();
                _0x54ce18.unblockPopups();
            });
            $(document).on('click', '#openfl-overlay.disabler', function () {
                if (CLIENT_SETTINGS.blockPopups) {
                    _0x54ce18.blockPopups();
                }
            });
            $(document).on('click', '#openfl-content', function () {
                if (CLIENT_SETTINGS.blockPopups) {
                    var _0x42a156 = $(this);
                    setTimeout(function () {
                        if (!_0x42a156.is(':visible')) {
                            _0x54ce18.blockPopups();
                        }
                    }, 0x3e8);
                }
            });
            $(document).on('click', '.quick-shop', function (_0x50e1f7) {
                _0x50e1f7.preventDefault();
                _0x54ce18.unblockPopups();
                window.MC && window.MC.openShop && window.MC.openShop();
            });
            $(document).on('click', '.quick-free-coins', function (_0x3a866a) {
                _0x3a866a.preventDefault();
                _0x54ce18.unblockPopups();
                window.MC && window.MC.showFreeCoins && window.MC.showFreeCoins();
            });
            $(document).on('click', '.quick-free-gifts', function (_0x1cbbee) {
                _0x1cbbee.preventDefault();
                _0x54ce18.unblockPopups();
                window.MC && window.MC.showGifting && window.MC.showGifting();
            });
            $(document).on('click', '.quick-quests', function (_0x503b41) {
                _0x503b41.preventDefault();
                _0x54ce18.unblockPopups();
                window.MC && window.MC.showQuests && window.MC.showQuests();
            });
            $(document).on('click', '#set-targeting', function (_0x36959c) {
                _0x36959c.preventDefault();
                _0x54ce18.setTargeting();
            });
            $(document).on('click', '#cancel-targeting', function (_0x4a2160) {
                _0x4a2160.preventDefault();
                _0x54ce18.cancelTargeting();
            });
            $(document).on('click', '#set-private-minimap', function (_0x376764) {
                _0x376764.preventDefault();
                _0x54ce18.setPrivateMiniMap();
            });
            $(document).on('click', '#change-target', function (_0x1f6602) {
                _0x1f6602.preventDefault();
                _0x54ce18.changeTarget();
            });
            $(document).on('click', '.team-top-limit', function (_0x55438c) {
                _0x55438c.preventDefault();
                var _0x420974 = $(this);
                var _0x1989f4 = parseInt(_0x420974.attr('data-limit'));
                if (_0x1989f4) {
                    _0x54ce18.setTop5limit(_0x1989f4);
                    _0x54ce18.displayTop5();
                    $('.team-top').text(_0x1989f4);
                    $('.team-top-limit').removeClass('active');
                    _0x420974.addClass('active');
                }
            });
            $(document).on('click', '#top5-pos .set-target', function (_0x225a1e) {
                _0x225a1e.preventDefault();
                _0x54ce18.setTarget(parseInt($(this).attr('data-user-id')));
            });
            $(document).on('click', '.mute-user', function (_0x4db08f) {
                _0x4db08f.preventDefault();
                _0x54ce18.muteChatUser(parseInt($(this).attr('data-user-id')));
            });
            $(document).on('click', '.btn-mute-user', function () {
                var _0x455625 = $(this);
                _0x54ce18.muteChatUser(parseInt(_0x455625.attr('data-user-id')));
                _0x455625.removeClass('btn-red btn-mute-user').addClass('btn-green btn-unmute-user').text(i18n.unmute);
            });
            $(document).on('click', '.btn-unmute-user', function () {
                var _0x25164e = $(this);
                _0x54ce18.unmuteChatUser(parseInt(_0x25164e.attr('data-user-id')));
                _0x25164e.removeClass('btn-green btn-unmute-user').addClass('btn-red btn-mute-user').text(i18n.mute);
            });
            $(document).on('click', '.chat-sound-notifications', function (_0xafc14e) {
                _0xafc14e.preventDefault();
                CLIENT_SETTINGS.chatSounds = !CLIENT_SETTINGS.chatSounds;
                _0x54ce18.saveSettings(CLIENT_SETTINGS, 'ogarioSettings');
                _0x54ce18.setChatSoundsBtn();
            });
            $(document).on('click', '.chat-active-users', function (_0x178248) {
                _0x178248.preventDefault();
                _0x54ce18.displayChatActiveUsers();
            });
            $(document).on('click', '.chat-muted-users', function (_0x3d0d6d) {
                _0x3d0d6d.preventDefault();
                _0x54ce18.displayChatMutedUsers();
            });
            $(document).on('click', '.show-chat-emoticons', function (_0x313f5a) {
                _0x313f5a.preventDefault();
                var _0x4f1041 = $(this);
                var _0x44f556 = $('#chat-emoticons');
                _0x44f556.toggle();
                if (_0x44f556.is(':visible')) {
                    _0x4f1041.addClass('active');
                } else {
                    _0x4f1041.removeClass('active');
                    $('#message').focus();
                }
            });
            $(document).on('click', '#chat-emoticons .emoticon', function () {
                var _0x408820 = $(this);
                var _0x210bc2 = _0x408820.attr('alt');
                var _0x3df4c9 = $('#message');
                var _0x3a1cdc = _0x3df4c9.val();
                if (_0x3a1cdc.length + _0x210bc2.length <= 0x50) {
                    _0x3df4c9.val(_0x3a1cdc + _0x210bc2);
                }
                _0x3df4c9.focus();
            });
            this.statsHUD = document.getElementById('stats-hud');
            this.activeParties = document.getElementById('active-parties');
            this.top5pos = document.getElementById('top5-pos');
            this.top5totalMass = document.getElementById('top5-total-mass');
            this.top5totalPlayers = document.getElementById('top5-total-players');
            this.leaderboardPositionsHUD = document.getElementById('leaderboard-positions');
            this.leaderboardDataHUD = document.getElementById('leaderboard-data');
            this.timeHUD = document.getElementById('time-hud');
            this.questHUD = document.getElementById('quest-hud');
            $('#canvas').bind('contextmenu', function () {
                return false;
            });
            $(document).on('mouseup', '.btn', function () {
                $(this).blur();
            });
            $('[data-toggle=\'tab-tooltip\']').tooltip({
                'trigger': 'hover'
            });
            $('.submenu-panel, #chat-box, #exp-imp-settings, #export-settings, #import-settings').perfectScrollbar({
                'suppressScrollX': true
            });
            var _0x51e805 = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
            _0x51e805.forEach(function (_0x48b518) {
                var _0x53d80f = new Switchery(_0x48b518, {
                    'color': PRESET.menuMainColor,
                    'size': 'small'
                });
            });
            $('input[type=\'range\']').rangeslider({
                'polyfill': false
            });
            toastr.options = {
                'newestOnTop': false,
                'positionClass': 'toast-bottom-left',
                'timeOut': 0x3a98
            };
        },
        'switchMenuTabs': function (_0x21517a, _0x2b0193) {
            var _0x368660 = _0x21517a.parent();
            if (_0x2b0193 === 'menu-panel') {
                if (_0x21517a.hasClass('hotkeys-link')) {
                    return;
                }
                if (_0x368660.hasClass('profile-tab')) {
                    this.setBlockPopups();
                }
            }
            _0x21517a.addClass('active');
            _0x368660.addClass('active');
            _0x368660.siblings().removeClass('active');
            _0x368660.siblings().find('a').removeClass('active');
            var _0x47191f = _0x21517a.attr('href');
            if (_0x2b0193 === 'submenu-panel') {
                var _0x4323cd = $(_0x47191f).parent().attr('id');
                $('#' + _0x4323cd + ' .submenu-panel').not(_0x47191f).css('display', 'none');
            } else {
                $('.menu-panel').not(_0x47191f).css('display', 'none');
            }
            $(_0x47191f).fadeIn(0x3e8);
            TRANSFORM_WIEW();
            $('.submenu-panel').perfectScrollbar('update');
        },
        'getDefaultSettings': function () {
            var _0xceca35 = this;
            this.noSkins = $('#noSkins').prop('checked');
            this.noColors = $('#noColors').prop('checked');
            this.skipStats = $('#skipStats').prop('checked');
            this.showQuest = $('#showQuest').prop('checked');
            CLIENT2.showCustomSkins = !this.noSkins;
            if (window.localStorage.getItem('scale_setting') !== null) {
                var _0x3c7cdb = JSON.parse(window.localStorage.getItem('scale_setting'));
                this.setCanvasScale(_0x3c7cdb);
            } else {
                var _0x40e3c4 = $('#quality').val();
                this.getQuality(_0x40e3c4);
            }
            if (window.localStorage.getItem('location') !== null) {
                this.region = window.localStorage.getItem('location');
                $('#region').val(this.region);
                window.MC && window.MC.setRegion && window.MC.setRegion(this.region);
            } else {
                this.region = $('#region').val();
            }
            this.setParty();
            if (this.gameMode === ':party' && window.location.hash) {
                $('#join-party-btn-2').click();
            }
            var _0x535b3d = Array.prototype.slice.call(document.querySelectorAll('.js-switch-vanilla'));
            _0x535b3d.forEach(function (_0x4562b8) {
                var _0x1a6592 = new Switchery(_0x4562b8, {
                    'color': PRESET.menuMainColor,
                    'size': 'small'
                });
            });
            $('#nick').val(_0x4673ea.nick).blur();
            $('#noNames').prop('checked', !CLIENT_SETTINGS.noNames);
            $('#showMass').prop('checked', CLIENT_SETTINGS.showMass);
            this.unlockButtons();
            this.setAutoResp();
            this.setQuest();
        },
        'getQuality': function (_0x110ba7) {
            var _0x5cdb6f = 'devicePixelRatio' in window;
            var _0x48c4ae = 0x1;
            if (_0x5cdb6f) {
                _0x48c4ae = window.devicePixelRatio;
            }
            switch (_0x110ba7) {
            case 'High':
                this.setCanvasScale(0x1);
                break;
            case 'Medium':
                this.setCanvasScale(0.9);
                break;
            case 'Low':
                this.setCanvasScale(0.75);
                break;
            case 'VeryLow':
                this.setCanvasScale(0.5);
                break;
            default:
                this.setCanvasScale(_0x48c4ae);
                break;
            }
        },
        'setCanvasScale': function (_0x5c8def) {
            this.canvasScale = _0x5c8def;
            CLIENT2.canvasScale = _0x5c8def;
        },
        'setStreamMode': function () {
            if (CLIENT_SETTINGS.streamMode) {
                $('#stream-mode').addClass('ogicon-eye-blocked');
                $('#clantag, #nick, #party-token').addClass('stream-mode');
            } else {
                $('#stream-mode').removeClass('ogicon-eye-blocked');
                $('#clantag, #nick, #party-token').removeClass('stream-mode');
            }
        },
        'setHideSkinUrl': function () {
            if (CLIENT_SETTINGS.hideSkinUrl) {
                $('#hide-url').addClass('ogicon-eye-blocked');
                $('#skin').addClass('hide-url');
            } else {
                $('#hide-url').removeClass('ogicon-eye-blocked');
                $('#skin').removeClass('hide-url');
            }
        },
        'setShowQuickMenu': function () {
            if (CLIENT_SETTINGS.showQuickMenu) {
                $('#quick-menu').fadeIn(0x1f4);
            } else {
                $('#quick-menu').fadeOut(0x1f4);
            }
        },
        'setShowSkinsPanel': function () {
            if (CLIENT_SETTINGS.showSkinsPanel) {
                $('#skins-panel').fadeIn(0x1f4);
            } else {
                $('#skins-panel').fadeOut(0x1f4);
            }
        },
        'unlockButtons': function () {
            $('.btn-play, .btn-play-guest, .btn-login-play, .btn-spectate').prop('disabled', false);
        },
        'setMainButtons': function () {
            var _0x568acd = this;
            $(document).on('click', '.btn-play, .btn-play-guest', function () {
                _0x568acd.onPlay();
            });
            $(document).on('click', '.btn-spectate', function () {
                _0x568acd.onSpectate();
            });
            $(document).on('click', '#create-party-btn-2', function () {
                _0x568acd.onCreate();
            });
            $(document).on('click', '#join-party-btn-2', function () {
                _0x568acd.skipServerData = true;
                _0x568acd.joinParty();
                _0x568acd.onJoin();
            });
            $(document).on('click', '#statsContinue2', function () {
                $('#stats, #main-panel').toggle();
            });
        },
        'play': function () {
            this.setPlayerSettings();
            this.setParty();
            if (this.isSocketOpen()) {
                this.sendPartyData();
            } else {
                this.connect();
                var _0x33e4e2 = this;
                setTimeout(function () {
                    _0x33e4e2.sendPartyData();
                }, 0x3e8);
            }
        },
        'onPlay': function () {
            this.play();
            this.hideMenu();
            window.addKeyListeners && window.addKeyListeners();
            if (CLIENT_SETTINGS.autoHideFood) {
                CLIENT2.showFood = true;
            }
            window.ga && window.ga('create', 'UA-67142685-2', 'auto', 'ogarioTracker');
            window.ga && window.ga('ogarioTracker.send', 'pageview');
        },
        'onSpectate': function () {
            this.onJoin();
            this.sendPlayerJoin();
            this.hideMenu();
            window.addKeyListeners && window.addKeyListeners();
            if (CLIENT_SETTINGS.autoHideFood) {
                CLIENT2.showFood = false;
            }
        },
        'join': function () {
            this.setParty();
            this.setPlayerSettings();
            this.sendPartyData();
            this.sendPlayerDeath();
        },
        'onJoin': function () {
            this.setParty();
            if (this.isSocketOpen()) {
                this.join();
            } else {
                this.connect();
                var _0x3b7f54 = this;
                setTimeout(function () {
                    _0x3b7f54.join();
                    _0x3b7f54.sendPlayerJoin();
                }, 0x3e8);
            }
        },
        'create': function () {
            this.setParty();
            if (this.partyToken) {
                this.onJoin();
                return;
            }
            var _0xb63478 = this;
            setTimeout(function () {
                _0xb63478.create();
            }, 0x64);
        },
        'onCreate': function () {
            this.setParty();
            if (this.gameMode !== ':party' || !this.partyToken) {
                this.createParty();
            } else {
                this.gameServerReconnect();
            }
            this.create();
        },
        'onPlayerSpawn': function () {
            CLIENT2.play = true;
            if (CLIENT2.playerColor) {
                this.sendPlayerSpawn();
                this.cacheCustomSkin(_0x4673ea.nick, CLIENT2.playerColor, _0x4673ea.skinURL);
                return;
            }
            var _0x523eef = this;
            setTimeout(function () {
                _0x523eef.onPlayerSpawn();
            }, 0x64);
        },
        'onPlayerDeath': function () {
            CLIENT2.play = false;
            CLIENT2.playerColor = null;
            CLIENT2.foodIsHidden = false;
            CLIENT2.playerMass = 0x0;
            CLIENT2.playerScore = 0x0;
            CLIENT2.playerSplitCells = 0x0;
            this.showMenu(0x12c);
            this.sendPlayerDeath();
            this.updateDeathLocations(CLIENT2.playerX, CLIENT2.playerY);
            this.unlockButtons();
            _0x17698d();
            this.autoResp();
        },
        'setPlayerSettings': function () {
            var _0x18184f = $('#nick').val();
            var _0x536407 = $('#clantag').val();
            var _0x1eda49 = $('#skin').val();
            var _0xd0ceb3 = $('#color').val();
            _0x4673ea.nick = _0x18184f;
            _0x4673ea.clanTag = _0x536407.trim();
            _0x4673ea.skinURL = this.checkSkinURL(_0x1eda49.trim());
            if (_0xd0ceb3.length == 0x7) {
                _0x4673ea.color = _0xd0ceb3;
            }
            if (_0x4673ea.clanTag.length > 0x0) {
                CLIENT2.clanTag = _0x4673ea.clanTag;
            }
            _0x420606[this.selectedProfile].nick = _0x4673ea.nick;
            _0x420606[this.selectedProfile].clanTag = _0x4673ea.clanTag;
            _0x420606[this.selectedProfile].skinURL = _0x4673ea.skinURL;
            _0x420606[this.selectedProfile].color = _0x4673ea.color;
            this.saveSettings(_0x420606, 'ogarioPlayerProfiles');
        },
        'loadSkin': function (_0x43dc2a, _0x8c4c58) {
            var _0x41fb1b = this;
            _0x43dc2a[_0x8c4c58] = new Image();
            _0x43dc2a[_0x8c4c58].crossOrigin = 'Anonymous';
            _0x43dc2a[_0x8c4c58].onload = function () {
                if (this.complete && this.width && this.height && this.width <= 0x7d0 && this.height <= 0x7d0) {
                    _0x41fb1b.cacheQueue.push(_0x8c4c58);
                    if (_0x41fb1b.cacheQueue.length == 0x1) {
                        _0x41fb1b.cacheSkin(_0x41fb1b.customSkinsCache);
                    }
                }
            };
            _0x43dc2a[_0x8c4c58].src = _0x8c4c58;
        },
        'cacheSkin': function (_0x111299) {
            if (this.cacheQueue.length == 0x0) {
                return;
            }
            var _0x2a8157 = this.cacheQueue.shift();
            if (_0x2a8157) {
                var _0x385701 = document.createElement('canvas');
                _0x385701.width = 0x200;
                _0x385701.height = 0x200;
                var _0x212173 = _0x385701.getContext('2d');
                _0x212173.beginPath();
                _0x212173.arc(0x100, 0x100, 0x100, 0x0, 0x2 * Math.PI, false);
                _0x212173.clip();
                _0x212173.drawImage(this.customSkinsCache[_0x2a8157], 0x0, 0x0, 0x200, 0x200);
                this.customSkinsCache[_0x2a8157 + '_cached'] = new Image();
                this.customSkinsCache[_0x2a8157 + '_cached'].src = _0x385701.toDataURL();
                _0x385701 = null;
                this.cacheSkin(this.customSkinsCache);
            }
        },
        'getCachedSkin': function (_0x1ba232, _0x3ee809) {
            if (_0x1ba232[_0x3ee809 + '_cached'] && _0x1ba232[_0x3ee809 + '_cached'].complete && _0x1ba232[_0x3ee809 + '_cached'].width) {
                return _0x1ba232[_0x3ee809 + '_cached'];
            }
            return null;
        },
        'cacheCustomSkin': function (_0x28c60e, _0x59daf1, _0x275975) {
            if (_0x275975) {
                var _0x47eddc = this.gameMode === ':party' ? _0x28c60e + _0x59daf1 : _0x28c60e;
                if (_0x47eddc) {
                    this.customSkinsMap[_0x47eddc] = _0x275975;
                }
                if (this.customSkinsCache.hasOwnProperty(_0x275975)) {
                    return;
                }
                this.loadSkin(this.customSkinsCache, _0x275975);
            }
        },
        'checkSkinsMap': function (_0x5e2722, _0x2238dc) {
            var _0x11ee3b = this.gameMode === ':party' ? _0x5e2722 + _0x2238dc : _0x5e2722;
            if (this.customSkinsMap.hasOwnProperty(_0x11ee3b)) {
                return true;
            }
            return false;
        },
        'getCustomSkin': function (_0x430f6e, _0x9d15dc) {
            if (!this.checkSkinsMap(_0x430f6e, _0x9d15dc)) {
                return null;
            }
            var _0x55f02c = this.gameMode === ':party' ? _0x430f6e + _0x9d15dc : _0x430f6e;
            return this.getCachedSkin(this.customSkinsCache, this.customSkinsMap[_0x55f02c]);
        },
        'calculateMapSector': function (_0x3ff952, _0x577897, _0x554651 = false) {
            if (!CLIENT2.mapOffsetFixed) {
                return '';
            }
            var _0x25108b = _0x554651 ? CLIENT2.mapOffsetX + CLIENT2.mapOffset : CLIENT2.mapOffset;
            var _0xf6281e = _0x554651 ? CLIENT2.mapOffsetY + CLIENT2.mapOffset : CLIENT2.mapOffset;
            var _0x5569c9 = Math.floor((_0x577897 + _0xf6281e) / (CLIENT2.mapSize / PRESET.sectorsY));
            var _0x5396e0 = Math.floor((_0x3ff952 + _0x25108b) / (CLIENT2.mapSize / PRESET.sectorsX));
            _0x5569c9 = _0x5569c9 < 0x0 ? 0x0 : _0x5569c9 >= PRESET.sectorsY ? PRESET.sectorsY - 0x1 : _0x5569c9;
            _0x5396e0 = _0x5396e0 < 0x0 ? 0x0 : _0x5396e0 >= PRESET.sectorsX ? PRESET.sectorsX - 0x1 : _0x5396e0;
            return String.fromCharCode(_0x5569c9 + 0x41) + (_0x5396e0 + 0x1);
        },
        'shortMassFormat': function (_0x5f4986) {
            return _0x5f4986 < 0x3e8 ? _0x5f4986 : Math.round(_0x5f4986 / 0x64) / 0xa + 'k';
        },
        'updateDeathLocations': function (_0x2978e6, _0x4c9eca) {
            if (!CLIENT2.mapOffsetFixed) {
                return;
            }
            this.deathLocations.push({
                'x': _0x2978e6 + CLIENT2.mapOffsetX,
                'y': _0x4c9eca + CLIENT2.mapOffsetY
            });
            if (this.deathLocations.length == 0x6) {
                this.deathLocations.shift();
            }
            this.lastDeath = this.deathLocations.length - 0x1;
        },
        'drawMiniMap': function () {
            if (!CLIENT2.mapOffsetFixed) {
                return;
            }
            var _0x184c27 = PRESET.miniMapWidth;
            var _0x57d796 = PRESET.miniMapTop;
            var _0x4883c7 = _0x184c27 + _0x57d796;
            var _0x474681 = _0x184c27 - 0x12;
            var _0x3e2af6 = _0x57d796 + 9.5;
            if (!this.miniMap) {
                this.miniMap = document.getElementById('minimap');
                this.miniMapCtx = this.miniMap.getContext('2d');
                this.miniMapCtx.ogarioCtx = true;
                this.miniMap.width = _0x184c27;
                this.miniMap.height = _0x4883c7;
            } else {
                this.miniMapCtx.clearRect(0x0, 0x0, _0x184c27, _0x4883c7);
            }
            if (this.miniMap.width != _0x184c27) {
                this.miniMap.width = _0x184c27;
                this.miniMap.height = _0x4883c7;
            }
            var _0xf0bd01 = _0x474681 / CLIENT2.mapSize;
            var _0xd252ff = CLIENT2.mapOffsetX + CLIENT2.mapOffset;
            var _0x29f645 = CLIENT2.mapOffsetY + CLIENT2.mapOffset;
            this.drawSelectedCell(this.miniMapCtx);
            this.currentSector = this.calculateMapSector(CLIENT2.playerX, CLIENT2.playerY, true);
            this.miniMapCtx.globalAlpha = 0x1;
            this.miniMapCtx.font = PRESET.miniMapFontWeight + ' ' + (_0x57d796 - 0x4) + 'px ' + PRESET.miniMapFontFamily;
            this.miniMapCtx.fillStyle = PRESET.miniMapSectorColor;
            this.miniMapCtx.fillText(this.currentSector, 0xa, _0x57d796);
            if (!this.miniMapSectors) {
                this.drawMiniMapSectors(PRESET.sectorsX, PRESET.sectorsY, _0x474681, _0x4883c7, _0x3e2af6);
            }
            this.miniMapCtx.save();
            this.miniMapCtx.translate(9.5, _0x3e2af6);
            if (this.gameMode === ':battleroyale') {
                WORLD && WORLD.drawBattleAreaOnMinimap(this.miniMapCtx, _0x474681, _0x474681, _0xf0bd01, _0xd252ff, _0x29f645);
            }

            if(CLIENT_SETTINGS.showMiniMapGhostCells) {
                var _0x1f1f64 = CLIENT.ghostCells;
                this.miniMapCtx.beginPath();
                for(var _0x31130d = 0x0; _0x31130d < _0x1f1f64.length; _0x31130d++)
                    if(true/*!_0x1f1f64[_0x31130d].inView*/) {
                        var _0x15c852 = ~~((_0x1f1f64[_0x31130d].x + _0xd252ff) * _0xf0bd01),
                            _0x19c78e = ~~((_0x1f1f64[_0x31130d].y + _0x29f645) * _0xf0bd01);
                        this.miniMapCtx.moveTo(_0x15c852, _0x19c78e), this.miniMapCtx.arc(_0x15c852, _0x19c78e, ~~(_0x1f1f64[_0x31130d].size * _0xf0bd01), 0x0, this.pi2, false);
                    } this.miniMapCtx.fillStyle = PRESET.miniMapGhostCellsColor, this.miniMapCtx.globalAlpha = PRESET.miniMapGhostCellsAlpha, this.miniMapCtx.shadowColor = PRESET.miniMapGhostCellsColor, this.miniMapCtx.shadowBlur = 0xa, this.miniMapCtx.shadowOffsetX = 0x0, this.miniMapCtx.shadowOffsetY = 0x0, this.miniMapCtx.fill(), this.miniMapCtx.globalAlpha = 0x1, this.miniMapCtx.shadowBlur = 0x0;
            }


            if (CLIENT_SETTINGS.showMiniMapGuides) {
                var _0x5bc965 = Math.round((CLIENT2.playerX + _0xd252ff) * _0xf0bd01);
                var _0x1c4bc1 = Math.round((CLIENT2.playerY + _0x29f645) * _0xf0bd01);
                this.miniMapCtx.lineWidth = 0x1;
                this.miniMapCtx.strokeStyle = PRESET.miniMapGuidesColor;
                this.miniMapCtx.beginPath();
                this.miniMapCtx.moveTo(_0x5bc965, 0x0);
                this.miniMapCtx.lineTo(_0x5bc965, _0x474681 - 0x1);
                this.miniMapCtx.moveTo(0x0, _0x1c4bc1);
                this.miniMapCtx.lineTo(_0x474681 - 0x1, _0x1c4bc1);
                this.miniMapCtx.stroke();
            }
            this.miniMapCtx.beginPath();
            this.miniMapCtx.arc((CLIENT2.playerX + _0xd252ff) * _0xf0bd01, (CLIENT2.playerY + _0x29f645) * _0xf0bd01, PRESET.miniMapMyCellSize, 0x0, this.pi2, false);
            this.miniMapCtx.closePath();
            if (PRESET.miniMapMyCellStrokeSize > 0x0) {
                this.miniMapCtx.lineWidth = PRESET.miniMapMyCellStrokeSize;
                this.miniMapCtx.strokeStyle = PRESET.miniMapMyCellStrokeColor;
                this.miniMapCtx.stroke();
            }
            this.miniMapCtx.fillStyle = PRESET.miniMapMyCellColor;
            this.miniMapCtx.fill();
            if (this.teamPlayers.length) {
                for (var _0x1b9508 = 0x0; _0x1b9508 < this.teamPlayers.length; _0x1b9508++) {
                    this.teamPlayers[_0x1b9508].drawPosition(this.miniMapCtx, CLIENT2.mapOffset, _0xf0bd01, this.privateMiniMap, this.targetID);
                }
            }
            if (this.deathLocations.length > 0x0) {
                var _0x5bc965 = Math.round((this.deathLocations[this.lastDeath].x + CLIENT2.mapOffset) * _0xf0bd01);
                var _0x1c4bc1 = Math.round((this.deathLocations[this.lastDeath].y + CLIENT2.mapOffset) * _0xf0bd01);
                var _0x489c21 = Math.max(PRESET.miniMapMyCellSize - 0x2, 0x4);
                this.miniMapCtx.lineWidth = 0x1;
                this.miniMapCtx.strokeStyle = this.deathLocations.length - 0x1 == this.lastDeath ? PRESET.miniMapDeathLocationColor : '#FFFFFF';
                this.miniMapCtx.beginPath();
                this.miniMapCtx.moveTo(_0x5bc965 - _0x489c21, _0x1c4bc1);
                this.miniMapCtx.lineTo(_0x5bc965 + _0x489c21, _0x1c4bc1);
                this.miniMapCtx.moveTo(_0x5bc965, _0x1c4bc1 - _0x489c21);
                this.miniMapCtx.lineTo(_0x5bc965, _0x1c4bc1 + _0x489c21);
                this.miniMapCtx.stroke();
            }
            this.miniMapCtx.restore();
        },
        'drawMiniMapSectors': function (_0x122736, _0x28392e, _0x86b59e, _0x3a5a9e, _0x56e2c4) {
            this.miniMapSectors = document.getElementById('minimap-sectors');
            var _0x48e2a1 = this.miniMapSectors.getContext('2d');
            _0x48e2a1.ogarioCtx = true;
            this.miniMapSectors.width = _0x86b59e;
            this.miniMapSectors.height = _0x3a5a9e;
            _0x48e2a1.fillStyle = '#FFFFFF';
            this.dTok(_0x48e2a1, _0x86b59e - 0x1);
            WORLD.drawSectors(_0x48e2a1, CLIENT2.mapOffsetFixed, _0x122736, _0x28392e, 0.5, _0x56e2c4, _0x86b59e - 0.5, _0x3a5a9e - 9.5, PRESET.miniMapSectorsColor, PRESET.miniMapSectorsColor, 0x1, false);
        },
        'resetMiniMapSectors': function () {
            this.miniMapSectors = null;
        },
        'drawSelectedCell': function (_0x201880) {
            if (CLIENT2.play && CLIENT2.playerSplitCells > 0x1 && (CLIENT_SETTINGS.splitRange || CLIENT_SETTINGS.oppColors || CLIENT_SETTINGS.oppRings || CLIENT_SETTINGS.showStatsSTE)) {
                _0x201880.fillStyle = '#FFFFFF';
                _0x201880.globalAlpha = this.selectBiggestCell ? 0.6 : 0.3;
                _0x201880.beginPath();
                _0x201880.arc(0x30, 0xf, 0x6, 0x0, this.pi2, false);
                _0x201880.closePath();
                _0x201880.fill();
                _0x201880.globalAlpha = this.selectBiggestCell ? 0.3 : 0.6;
                _0x201880.beginPath();
                _0x201880.arc(0x3c, 0xf, 0x4, 0x0, this.pi2, false);
                _0x201880.closePath();
                _0x201880.fill();
            }
        },
        'dTok': function (_0x5b0b56, _0x29218d) {
            _0x5b0b56.font = PRESET.miniMapFontWeight + ' ' + (PRESET.miniMapTop - 0x6) + 'px ' + PRESET.miniMapFontFamily;
            _0x5b0b56.textAlign = 'right';
            _0x5b0b56.textBaseline = 'top';
            _0x5b0b56.fillText(atob(this.token), _0x29218d, 0x7);
        },
        'drawTeammatesInd': function (_0x525ffc, _0x5bfbcc, _0x5afc12, _0x41bd77) {
            if (!this.indicator) {
                return;
            }
            _0x525ffc.drawImage(this.indicator, _0x5bfbcc - 0x2d, _0x5afc12 - _0x41bd77 - 0x5a);
        },
        'drawCellInfo': function (_0x585cdf, _0x225cb3, _0x2a6026, _0x2a7a56, _0x10df88, _0x317dfe, _0x414514, _0x578fef, _0x33e71b, _0x57a881, _0x32ca26, _0x2a5b7f) {
            if (_0x317dfe || _0x33e71b) {
                return;
            }
            _0x585cdf.globalAlpha = CLIENT2.globalAlpha;
            if (CLIENT_SETTINGS.teammatesInd && _0x2a5b7f && !_0x578fef && _0x10df88 <= 0xc8) {
                this.drawTeammatesInd(_0x585cdf, _0x2a6026, _0x2a7a56, _0x10df88);
            }
            if (CLIENT_SETTINGS.noNames && !CLIENT_SETTINGS.showMass) {
                return;
            }
            var _0x580a3e = false;
            if (!_0x578fef && !_0x414514) {
                _0x580a3e = this.setAutoHideCellInfo(_0x10df88);
                if (_0x580a3e && CLIENT_SETTINGS.autoHideNames && CLIENT_SETTINGS.autoHideMass) {
                    return;
                }
            }
            var _0x5524a0 = null;
            if (this.cells.hasOwnProperty(_0x225cb3)) {
                _0x5524a0 = this.cells[_0x225cb3];
                _0x5524a0.update(_0x2a6026, _0x2a7a56, _0x10df88, _0x414514, _0x578fef, _0x57a881);
            } else {
                _0x5524a0 = new cellObj(_0x2a6026, _0x2a7a56, _0x414514, _0x578fef, CLIENT_SETTINGS.shortMass, CLIENT_SETTINGS.virMassShots);
                _0x5524a0.setMass(_0x10df88);
                _0x5524a0.setNick(_0x57a881);
                this.cells[_0x225cb3] = _0x5524a0;
                return;
            }
            _0x5524a0.setDrawing(CLIENT_SETTINGS.optimizedNames, CLIENT_SETTINGS.optimizedMass, CLIENT_SETTINGS.shortMass, CLIENT_SETTINGS.virMassShots, CLIENT_SETTINGS.namesStroke, CLIENT_SETTINGS.massStroke);
            _0x5524a0.setDrawingScale(CLIENT2.viewScale, PRESET.namesScale, PRESET.massScale, PRESET.virMassScale, PRESET.strokeScale);
            _0x585cdf.globalAlpha = PRESET.textAlpha;
            if (!CLIENT_SETTINGS.noNames && !(_0x580a3e && CLIENT_SETTINGS.autoHideNames) && !(_0x578fef && CLIENT_SETTINGS.hideMyName) && !(_0x2a5b7f && CLIENT_SETTINGS.hideTeammatesNames)) {
                _0x5524a0.drawNick(_0x585cdf, PRESET.namesColor, PRESET.namesFontFamily, PRESET.namesFontWeight, PRESET.namesStrokeColor);
            }
            if (CLIENT_SETTINGS.showMass && !(_0x580a3e && CLIENT_SETTINGS.autoHideMass) && !(_0x578fef && CLIENT_SETTINGS.hideMyMass) && !(CLIENT_SETTINGS.hideEnemiesMass && !_0x578fef && !_0x414514)) {
                _0x5524a0.drawMass(_0x585cdf, PRESET.massColor, PRESET.massFontFamily, PRESET.massFontWeight, PRESET.massStrokeColor);
            }
        },
        'setVirusColor': function (_0x26d7df) {
            var _0x16a185 = Math.floor(_0x26d7df * _0x26d7df / 0x64);
            if (_0x16a185 > 0xb7) {
                return '#C80000';
            }
            return PRESET.virusColor;
        },
        'setVirusStrokeColor': function (_0x48027f) {
            if (CLIENT2.play && CLIENT2.playerMaxMass != 0x0) {
                var _0x5d874e = Math.floor(_0x48027f * _0x48027f / 0x64);
                var _0x12cda6 = _0x5d874e / (this.selectBiggestCell ? CLIENT2.playerMaxMass : CLIENT2.playerMinMass);
                if (_0x12cda6 > 0.76) {
                    return '#FFDC00';
                }
                return '#C80000';
            }
            return PRESET.virusStrokeColor;
        },
        'setAutoHideCellInfo': function (_0x1726dd) {
            if (_0x1726dd <= 0x28 || CLIENT2.viewScale < 0.5 && _0x1726dd < 0x226 && _0x1726dd < 0x19 / CLIENT2.viewScale) {
                return true;
            }
            return false;
        },
        'setParty': function () {
            var _0x134e18 = $('#party-token').val();
            this.gameMode = CLIENT2.gameMode = $('#gamemode').val();
            this.setQuest();
            if (this.gameMode !== ':party' || !_0x134e18) {
                return;
            }
            var _0xbb044a = _0x134e18;
            if (_0x134e18.indexOf('#') != -0x1) {
                _0x134e18 = _0x134e18.split('#');
                _0xbb044a = _0x134e18[0x1];
            }
            if (this.partyToken !== _0xbb044a) {
                this.partyToken = _0xbb044a;
                this.flushSkinsMap();
                this.flushChatData();
                this.cancelTargeting();
            }
        },
        'createParty': function () {
            $('#create-party-btn').click();
        },
        'joinParty': function () {
            var _0x18bd50 = $('#party-token').val();
            if (!_0x18bd50) {
                return;
            }
            $('#pre-join-party-btn').click();
            $('.party-token').val(_0x18bd50);
            $('#join-party-btn').click();
        },
        'leaveParty': function () {
            $('#party-token, .party-token').val('');
            $('#leave-party-btn').click();
        },
        'closeParty': function () {
            $('#party-token, .party-token').val('');
            $('.party-icon-back').click();
        },
        'flushData': function () {
            this.flushPartyData();
            this.flushSkinsMap();
            this.flushChatData();
            this.cancelTargeting();
            CLIENT2.play = false;
            CLIENT2.playerColor = null;
        },
        'flushPartyData': function () {
            this.teamPlayers = [];
            this.parties = [];
            this.lastSentNick = '';
            this.lastSentClanTag = null;
            this.lastSentSkinURL = '';
            this.lastSentCustomColor = '';
            this.lastSentPartyToken = '';
            this.lastSentServerToken = '';
        },
        'flushCells': function () {
            this.cells = {};
        },
        'flushSkinsMap': function () {
            this.customSkinsMap = {};
        },
        'flushChatData': function () {
            this.chatUsers = {};
        },
        'getWS': function (_0x519b45) {
            if (!_0x519b45) {
                return;
            }
            this.ws = _0x519b45;
            this.createServerToken();
            this.updateServerInfo();
            if (this.ws.indexOf('agar.io') == -0x1) {
                this.closeConnection();
            }
        },
        'recreateWS': function (_0x57996f) {
            if (!_0x57996f) {
                return null;
            }
            var _0x477499 = null;
            if (/^[a-zA-Z0-9=+\/]{12,}$/ .test(_0x57996f)) {
                var _0x5af6c6 = atob(_0x57996f);
                if (/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}:[0-9]{1,4}/ .test(_0x5af6c6)) {
                    _0x477499 = 'wss://ip-' + _0x5af6c6.replace(/\./g, '-').replace(':', '.tech.agar.io:');
                }
            }
            if (!_0x477499 && /^[a-z0-9]{5,}$/ .test(_0x57996f)) {
                _0x477499 = 'wss://live-arena-' + _0x57996f + '.agar.io:443';
            }
            return _0x477499;
        },
        'createServerToken': function () {
            var _0x3339e6 = this.ws.match(/ip-\d+/);
            var _0xbc38f5 = this.ws.match(/live-arena-([\w\d]+)/);
            var _0x1691d7 = null;
            if (_0x3339e6) {
                var _0x5e96f5 = this.ws.replace('.tech.agar.io', '').replace(/-/g, '.');
                _0x3339e6 = _0x5e96f5.match(/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}:[0-9]{1,4}/);
                if (_0x3339e6) {
                    this.serverIP = _0x3339e6[0x0];
                    _0x1691d7 = btoa(this.serverIP);
                }
            }
            if (!_0x1691d7 && _0xbc38f5) {
                this.serverArena = _0xbc38f5[0x1];
                _0x1691d7 = this.serverArena;
            }
            if (_0x1691d7) {
                if (this.serverToken !== _0x1691d7) {
                    this.serverToken = _0x1691d7;
                    this.flushData();
                    this.flushCells();
                }
                this.partyToken = '';
                var _0x58da43 = this.ws.match(/party_id=([A-Z0-9]{6})/);
                if (_0x58da43) {
                    this.partyToken = _0x58da43[0x1];
                    _0x20ac1c('/#' + window.encodeURIComponent(this.partyToken));
                }
            }
        },
        'updateServerInfo': function () {
            $('#server-ws').val(this.ws);
            $('#server-token').val(this.serverToken);
            $('#party-token, .party-token').val(this.partyToken);
        },
        'gameServerConnect': function (_0x167a24) {
            if (!_0x167a24) {
                return;
            }
            this.skipServerData = true;
            window.core && window.core.connect && window.core.connect(_0x167a24);
        },
        'gameServerReconnect': function () {
            if (window.MC && window.MC.reconnect) {
                window.MC.reconnect();
                return;
            }
            window.master && window.master.reconnect && window.master.reconnect();
        },
        'gameServerJoin': function (_0x477cb8) {
            var _0x335158 = this.recreateWS(_0x477cb8);
            if (_0x335158) {
                this.skipServerData = true;
                this.gameServerConnect(_0x335158);
            }
        },
        'connect': function () {
            this.closeConnection();
            this.flushData();
            this.setParty();
            console.log('[OGARio by szymy] Connecting to server');
            if (this.privateMode && this.privateIP) {
                this.socket = new WebSocket(this.privateIP);
            } else {
                this.socket = new WebSocket(this.publicIP);
            }
            this.socket.ogarioWS = true;
            this.socket.binaryType = 'arraybuffer';
            var _0x1d29f1 = this;
            this.socket.onopen = function () {
                console.log('[OGARio by szymy] Socket open');
                var _0x37a6d7 = _0x1d29f1.createView(0x3);
                _0x37a6d7.setUint8(0x0, 0x0);
                _0x37a6d7.setUint16(0x1, 0x191, true);
                _0x1d29f1.sendBuffer(_0x37a6d7);
                _0x1d29f1.sendPartyData();
            };
            this.socket.onmessage = function (_0x48b3d7) {
                _0x1d29f1.handleMessage(_0x48b3d7);
            };
            this.socket.onclose = function (_0x5dd7a9) {
                _0x1d29f1.flushData();
                console.log('[OGARio by szymy] Socket close', _0x5dd7a9);
            };
            this.socket.onerror = function (_0x39182d) {
                _0x1d29f1.flushData();
                console.log('[OGARio by szymy] Socket error', _0x39182d);
            };
        },
        'closeConnection': function () {
            if (this.socket) {
                this.socket.onmessage = null;
                try {
                    this.socket.close();
                } catch (_0x3db03b) {}
                this.socket = null;
            }
        },
        'reconnect': function () {
            this.setParty();
            var _0x7b1f18 = this;
            setTimeout(function () {
                _0x7b1f18.connect();
            }, 0x3e8);
        },
        'switchServerMode': function () {
            if (!this.privateIP) {
                return;
            }
            this.privateMode = !this.privateMode;
            if (this.isSocketOpen()) {
                this.closeConnection();
                toastr.error('Zamknięto połączenie z serwerem!');
            }
            if (this.privateMode) {
                toastr.info('Przełączono na serwer prywatny!');
                $('.party-panel').show();
            } else {
                toastr.info('Przełączono na serwer publiczny!');
                $('#active-parties').empty();
                $('.party-panel').hide();
            }
            this.onJoin();
            if (CLIENT2.play) {
                this.onPlayerSpawn();
            }
        },
        'isSocketOpen': function () {
            return this.socket !== null && this.socket.readyState === this.socket.OPEN;
        },
        'createView': function (_0x41b427) {
            return new DataView(new ArrayBuffer(_0x41b427));
        },
        'strToBuff': function (_0x103243, _0x4364d2) {
            var _0x1915bc = this.createView(0x1 + _0x4364d2.length * 0x2);
            _0x1915bc.setUint8(0x0, _0x103243);
            for (var _0x25bcff = 0x0; _0x25bcff < _0x4364d2.length; _0x25bcff++) {
                _0x1915bc.setUint16(0x1 + _0x25bcff * 0x2, _0x4364d2.charCodeAt(_0x25bcff), true);
            }
            return _0x1915bc;
        },
        'sendBuffer': function (_0xf909a1) {
            this.socket.send(_0xf909a1.buffer);
        },
        'handleMessage': function (_0x202b2d) {
            this.readMessage(new DataView(_0x202b2d.data));
        },
        'readMessage': function (_0x1c4497) {
            switch (_0x1c4497.getUint8(0x0)) {
            case 0x0:
                this.playerID = _0x1c4497.getUint32(0x1, true);
                break;
            case 0x1:
                this.sendPlayerUpdate();
                break;
            case 0x14:
                this.updateTeamPlayer(_0x1c4497);
                break;
            case 0x1e:
                this.updateTeamPlayerPosition(_0x1c4497);
                break;
            case 0x60:
                break;
                this.updateParties(_0x1c4497);
                this.displayParties();
                break;
            case 0x64:
                this.readChatMessage(_0x1c4497);
                break;
            }
        },
        'sendPlayerState': function (_0x7418c2) {
            if (this.isSocketOpen()) {
                var _0x318707 = this.createView(0x1);
                _0x318707.setUint8(0x0, _0x7418c2);
                this.sendBuffer(_0x318707);
            }
        },
        'sendPlayerSpawn': function () {
            this.sendPlayerState(0x1);
        },
        'sendPlayerDeath': function () {
            this.sendPlayerState(0x2);
        },
        'sendPlayerJoin': function () {
            this.sendPlayerState(0x3);
        },
        'sendPlayerData': function (_0x386d3a, _0x44777d, _0x4df17a) {
            if (this[_0x44777d] !== null && this[_0x44777d] === _0x4df17a) {
                return;
            }
            if (this.isSocketOpen()) {
                this.sendBuffer(this.strToBuff(_0x386d3a, _0x4df17a));
                this[_0x44777d] = _0x4df17a;
            }
        },
        'sendPlayerNick': function () {
            this.sendPlayerData(0xa, 'lastSentNick', _0x4673ea.nick);
        },
        'sendPlayerClanTag': function () {
            this.sendPlayerData(0xb, 'lastSentClanTag', _0x4673ea.clanTag);
        },
        'sendPlayerSkinURL': function () {
            this.sendPlayerData(0xc, 'lastSentSkinURL', _0x4673ea.skinURL);
        },
        'sendPlayerCustomColor': function () {
            this.sendPlayerData(0xd, 'lastSentCustomColor', _0x4673ea.color);
        },
        'sendPlayerColor': function () {
            if (this.isSocketOpen() && CLIENT2.playerColor) {
                this.sendBuffer(this.strToBuff(0xe, CLIENT2.playerColor));
            }
        },
        'sendPartyToken': function () {
            this.setParty();
            this.sendPlayerData(0xf, 'lastSentPartyToken', this.partyToken);
        },
        'sendServerToken': function () {
            this.sendPlayerData(0x10, 'lastSentServerToken', this.serverToken);
        },
        'sendServerJoin': function () {
            this.sendServerToken();
            this.sendPlayerJoin();
        },
        'sendServerRegion': function () {
            if (!this.region) {
                return;
            }
            var _0x3b77cd = this.region.split('-');
            if (this.isSocketOpen()) {
                this.sendBuffer(this.strToBuff(0x11, _0x3b77cd[0x0]));
            }
        },
        'sendServerGameMode': function () {
            var _0x312a73 = 'FFA';
            switch (this.gameMode) {
            case ':battleroyale':
                _0x312a73 = 'BTR';
                break;
            case ':teams':
                _0x312a73 = 'TMS';
                break;
            case ':experimental':
                _0x312a73 = 'EXP';
                break;
            case ':party':
                _0x312a73 = 'PTY';
                break;
            }
            if (this.isSocketOpen()) {
                this.sendBuffer(this.strToBuff(0x12, _0x312a73));
            }
        },
        'sendServerData': function () {
            if (this.skipServerData) {
                this.skipServerData = false;
                return;
            }
            this.region = $('#region').val();
            this.gameMode = $('#gamemode').val();
            this.sendServerRegion();
            this.sendServerGameMode();
        },
        'sendPartyData': function () {
            this.sendPlayerClanTag();
            this.sendPartyToken();
            this.sendServerToken();
            this.sendPlayerNick();
        },
        'sendPlayerUpdate': function () {
            if (this.isSocketOpen() && CLIENT2.play && this.playerID && CLIENT2.playerColor) {
                function _0x34eb83(_0x17d24e) {
                    for (var _0x323f8c = 0x0; _0x323f8c < _0x17d24e.length; _0x323f8c++) {
                        _0x2ae1bf.setUint16(_0x55a306, _0x17d24e.charCodeAt(_0x323f8c), true);
                        _0x55a306 += 0x2;
                    }
                    _0x2ae1bf.setUint16(_0x55a306, 0x0, true);
                    _0x55a306 += 0x2;
                }
                var _0x4c07ef = 0x29;
                _0x4c07ef += _0x4673ea.nick.length * 0x2;
                _0x4c07ef += _0x4673ea.skinURL.length * 0x2;
                var _0x2ae1bf = this.createView(_0x4c07ef);
                _0x2ae1bf.setUint8(0x0, 0x14);
                _0x2ae1bf.setUint32(0x1, this.playerID, true);
                var _0x55a306 = 0x5;
                _0x34eb83(_0x4673ea.nick);
                _0x34eb83(_0x4673ea.skinURL);
                _0x34eb83(_0x4673ea.color);
                _0x34eb83(CLIENT2.playerColor);
                this.sendBuffer(_0x2ae1bf);
            }
        },
        'sendPlayerPosition': function () {
            if (this.isSocketOpen() && CLIENT2.play && this.playerID) {
                var _0x19923e = this.createView(0x11);
                _0x19923e.setUint8(0x0, 0x1e);
                _0x19923e.setUint32(0x1, this.playerID, true);
                _0x19923e.setInt32(0x5, this.getPlayerX(), true);
                _0x19923e.setInt32(0x9, this.getPlayerY(), true);
                if (typeof CLIENT2.playerMass !== 'undefined') {
                    _0x19923e.setUint32(0xd, CLIENT2.playerMass, true);
                } else {
                    _0x19923e.setUint32(0xd, this.playerMass, true);
                }
                this.sendBuffer(_0x19923e);
            }
        },
        'checkPlayerID': function (_0xe77e7a) {
            if (_0xe77e7a) {
                for (var _0x40ce36 = 0x0; _0x40ce36 < this.teamPlayers.length; _0x40ce36++) {
                    if (this.teamPlayers[_0x40ce36].id == _0xe77e7a) {
                        return _0x40ce36;
                    }
                }
            }
            return null;
        },
        'updateTeamPlayer': function (_0x16ed52) {
            function _0x19a533() {
                for (var _0x5d4fc6 = '';;) {
                    var _0x5ec55e = _0x16ed52.getUint16(_0x5620d4, true);
                    if (_0x5ec55e == 0x0) {
                        break;
                    }
                    _0x5d4fc6 += String.fromCharCode(_0x5ec55e);
                    _0x5620d4 += 0x2;
                }
                _0x5620d4 += 0x2;
                return _0x5d4fc6;
            }
            var _0x18dfc5 = _0x16ed52.getUint32(0x1, true);
            var _0x5620d4 = 0x5;
            var _0x27ec4f = _0x19a533();
            var _0x4628e8 = this.checkSkinURL(_0x19a533());
            var _0x27c710 = _0x19a533();
            var _0x8c092b = _0x19a533();
            var _0x34deaf = this.gameMode === ':party' ? _0x27ec4f + _0x8c092b : _0x27ec4f;
            var _0x494a02 = this.checkPlayerID(_0x18dfc5);
            if (_0x494a02 !== null) {
                this.teamPlayers[_0x494a02].nick = _0x27ec4f;
                this.teamPlayers[_0x494a02].skinID = _0x34deaf;
                this.teamPlayers[_0x494a02].skinURL = _0x4628e8;
                this.teamPlayers[_0x494a02].setColor(_0x8c092b, _0x27c710);
            } else {
                var _0x42b905 = new _0x511878(_0x18dfc5, _0x27ec4f, _0x34deaf, _0x4628e8);
                _0x42b905.setColor(_0x8c092b, _0x27c710);
                this.teamPlayers.push(_0x42b905);
            }
            this.cacheCustomSkin(_0x27ec4f, _0x8c092b, _0x4628e8);
        },
        'updateTeamPlayerPosition': function (_0x3ecf99) {
            var _0x4b5a77 = _0x3ecf99.getUint32(0x1, true);
            var _0x7391ae = this.checkPlayerID(_0x4b5a77);
            if (_0x7391ae !== null) {
                var _0x371121 = _0x3ecf99.getInt32(0x5, true);
                var _0x27a962 = _0x3ecf99.getInt32(0x9, true);
                var _0x457fa4 = _0x3ecf99.getUint32(0xd, true);
                if (_0x457fa4 > 0x57e40) {
                    return;
                }
                var _0x3de1a7 = this.teamPlayers[_0x7391ae];
                _0x3de1a7.x = _0x371121;
                _0x3de1a7.y = _0x27a962;
                _0x3de1a7.mass = _0x457fa4;
                _0x3de1a7.alive = true;
                _0x3de1a7.updateTime = Date.now();
                if (this.targeting && this.targetID && _0x4b5a77 == this.targetID) {
                    this.updateTarget(_0x3de1a7.nick, _0x3de1a7.skinURL, _0x371121, _0x27a962, _0x457fa4, _0x3de1a7.color);
                }
            }
        },
        'updateTeamPlayers': function () {
            this.sendPlayerPosition();
            this.chatUsers = {};
            this.top5 = [];
            for (var _0x476fa1 = 0x0; _0x476fa1 < this.teamPlayers.length; _0x476fa1++) {
                var _0x16bff4 = this.teamPlayers[_0x476fa1];
                if (_0x16bff4.alive && Date.now() - _0x16bff4.updateTime >= 0x7d0 || _0x16bff4.mass == 0x0) {
                    _0x16bff4.alive = false;
                    if (this.targeting && this.targetID && _0x16bff4.id == this.targetID) {
                        this.setTargetStatus(0x2);
                    }
                }
                if (_0x16bff4.alive) {
                    this.top5.push({
                        'id': _0x16bff4.id,
                        'nick': _0x16bff4.nick,
                        'x': _0x16bff4.x,
                        'y': _0x16bff4.y,
                        'mass': _0x16bff4.mass,
                        'color': _0x16bff4.color
                    });
                    if (!this.isChatUserMuted(_0x16bff4.id)) {
                        this.addChatUser(_0x16bff4.id, _0x16bff4.nick);
                    }
                }
            }
            this.top5.sort(function (_0x5acfb9, _0x2d542d) {
                return _0x2d542d.mass - _0x5acfb9.mass;
            });
            this.displayTop5();
        },
        'updateParties': function (_0x499ca9) {
            this.parties = [];
            var _0x5bc75d = _0x499ca9.getUint8(0x1);
            for (var _0x3b1e8b = 0x2, _0x41fc9a = 0x0; _0x41fc9a < _0x5bc75d; _0x41fc9a++) {
                for (var _0x1d5f73 = '';;) {
                    var _0x220640 = _0x499ca9.getUint16(_0x3b1e8b, true);
                    if (_0x220640 == 0x0) {
                        break;
                    }
                    _0x1d5f73 += String.fromCharCode(_0x220640);
                    _0x3b1e8b += 0x2;
                }
                _0x3b1e8b += 0x2;
                this.parties.push(_0x1d5f73);
            }
        },
        'readChatMessage': function (_0xa96a43) {
            if (CLIENT_SETTINGS.disableChat) {
                return;
            }
            var _0x2abac9 = new Date().toTimeString().replace(/^(\d{2}:\d{2}).*/, '$1');
            var _0x3f5dc6 = _0xa96a43.getUint8(0x1);
            var _0x37e16e = _0xa96a43.getUint32(0x2, true);
            var _0x2a51b1 = _0xa96a43.getUint32(0x6, true);
            if (this.isChatUserMuted(_0x37e16e) || _0x2a51b1 != 0x0 && _0x2a51b1 != this.playerID && _0x37e16e != this.playerID) {
                return;
            }
            for (var _0x329e08 = '', _0xbcbc5f = 0xa; _0xbcbc5f < _0xa96a43.byteLength; _0xbcbc5f += 0x2) {
                var _0x4e4543 = _0xa96a43.getUint16(_0xbcbc5f, true);
                if (_0x4e4543 == 0x0) {
                    break;
                }
                _0x329e08 += String.fromCharCode(_0x4e4543);
            }
            this.displayChatMessage(_0x2abac9, _0x3f5dc6, _0x37e16e, _0x329e08);
        },
        'sendChatMessage': function (_0x1fc3d8, _0x4125cc) {
            if (Date.now() - this.lastMessageSentTime < 0x1f4 || _0x4125cc.length == 0x0 || _0x4673ea.nick.length == 0x0) {
                return;
            }
            if (this.isSocketOpen()) {
                var _0x4125cc = _0x4673ea.nick + ': ' + _0x4125cc;
                var _0x4ba361 = this.createView(0xa + _0x4125cc.length * 0x2);
                _0x4ba361.setUint8(0x0, 0x64);
                _0x4ba361.setUint8(0x1, _0x1fc3d8);
                _0x4ba361.setUint32(0x2, this.playerID, true);
                _0x4ba361.setUint32(0x6, 0x0, true);
                for (var _0x1d468c = 0x0; _0x1d468c < _0x4125cc.length; _0x1d468c++) {
                    _0x4ba361.setUint16(0xa + _0x1d468c * 0x2, _0x4125cc.charCodeAt(_0x1d468c), true);
                }
                this.sendBuffer(_0x4ba361);
                this.lastMessageSentTime = Date.now();
            }
        },
        'prepareCommand': function (_0x571cef) {
            var _0x50a06d = _0x571cef.replace('%currentSector%', this.currentSector);
            return _0x50a06d;
        },
        'sendCommand': function (_0x2263f2) {
            var _0x569bc7 = this.prepareCommand(_0x23cf50['comm' + _0x2263f2]);
            this.sendChatMessage(0x66, _0x569bc7);
        },
        'addChatUser': function (_0x4190a3, _0xaa93ba) {
            this.chatUsers[_0x4190a3] = _0xaa93ba;
        },
        'getChatUserNick': function (_0x1271a7) {
            if (this.chatUsers.hasOwnProperty(_0x1271a7)) {
                return this.chatUsers[_0x1271a7];
            }
            return '';
        },
        'muteChatUser': function (_0x5eb917) {
            if (!_0x5eb917 || this.isChatUserMuted(_0x5eb917)) {
                return;
            }
            var _0x3a2e8f = this.getChatUserNick(_0x5eb917);
            this.chatMutedUsers[_0x5eb917] = _0x3a2e8f;
            this.chatMutedUserIDs.push(_0x5eb917);
            toastr.error(i18n.userMuted.replace('%user%', '<strong>' + this.escapeHTML(_0x3a2e8f) + '</strong>') + ' <button data-user-id=\"' + _0x5eb917 + '" class="btn btn-xs btn-green btn-unmute-user">' + i18n.unmute + '</button>');
        },
        'unmuteChatUser': function (_0x47a700) {
            if (!_0x47a700) {
                return;
            }
            var _0x2d393e = this.chatMutedUserIDs.indexOf(_0x47a700);
            if (_0x2d393e != -0x1) {
                this.chatMutedUserIDs.splice(_0x2d393e, 0x1);
                toastr.info(i18n.userUnmuted.replace('%user%', '<strong>' + this.escapeHTML(this.chatMutedUsers[_0x47a700]) + '</strong>'));
                delete this.chatMutedUsers[_0x47a700];
            }
        },
        'isChatUserMuted': function (_0x5bd270) {
            if (this.chatMutedUserIDs.indexOf(_0x5bd270) != -0x1) {
                return true;
            }
            return false;
        },
        'parseMessage': function (_0x485e85) {
            var _0x4ddd91 = /\[img\]([\w\:\/\.\?]+)\[\/img\]/i;
            if (_0x4ddd91.test(_0x485e85)) {
                var _0x1be451 = _0x485e85.match(_0x4ddd91)[0x1];
                if (CLIENT_SETTINGS.showChatImages && this.checkImgURL(_0x1be451)) {
                    return '<img src=\"' + _0x1be451 + '" style="width:100%;border:none;">';
                }
                return '';
            }
            var _0x87d67f = /\[yt\]([\w-]{11})\[\/yt\]/i;
            if (_0x87d67f.test(_0x485e85)) {
                if (CLIENT_SETTINGS.showChatVideos) {
                    var _0x484598 = _0x485e85.match(_0x87d67f);
                    return '<iframe type="text/html" width="100%" height="auto" src="https://www.youtube.com/embed/' + _0x484598[0x1] + '?autoplay=1&amp;vq=tiny\" frameborder=\"0\" />';
                }
                return '';
            }
            var _0x34421a = this.escapeHTML(_0x485e85);
            if (CLIENT_SETTINGS.chatEmoticons) {
                _0x34421a = this.parseEmoticons(_0x34421a);
            }
            return _0x34421a;
        },
        'parseEmoticons': function (_0x2ee7f4) {
            return String(_0x2ee7f4).replace(/\&lt\;3/g, '<3').replace(/(O\:\)|3\:\)|8\=\)|\:\)|\;\)|\=\)|\:D|X\-D|\=D|\:\(|\;\(|\:P|\;P|\:\*|\$\)|\<3|\:o|\(\:\||\:\||\:\\|\:\@|\|\-\)|\^\_\^|\-\_\-|\$\_\$|\(poop\)|\(fuck\)|\(clap\)|\(ok\)|\(victory\)|\(y\)|\(n\))/g, function (_0x4b7992) {
                return '<img src=\"https://cdn.ogario.ovh/static/emoticons/' + SMILES[_0x4b7992] + '" alt="' + _0x4b7992 + '" class="emoticon">';
            });
        },
        'displayChatMessage': function (_0x42598f, _0x4766a4, _0x5d8240, _0x5e002a) {
            if (_0x5e002a.length == 0x0) {
                return;
            }
            var _0x39ebe8 = _0x5e002a.split(': ', 0x1).toString();
            var _0x2b2aa6 = this.parseMessage(_0x5e002a.replace(_0x39ebe8 + ': ', ''));
            if (_0x39ebe8.length == 0x0 || _0x39ebe8.length > 0xf || _0x2b2aa6.length == 0x0) {
                return;
            }
            var _0x52a6a6 = '';
            if (_0x5d8240 != 0x0 && _0x5d8240 != this.playerID) {
                this.addChatUser(_0x5d8240, _0x39ebe8);
                _0x52a6a6 = '<a href=\"#\" data-user-id=\"' + _0x5d8240 + '" class="mute-user ogicon-user-minus"></a> ';
            }
            _0x39ebe8 = this.escapeHTML(_0x39ebe8);
            if (_0x4766a4 == 0x65) {
                if (CLIENT_SETTINGS.showChatBox) {
                    $('#chat-box').append('<div class="message"><span class="message-time">.'+ _0x42598f +  '</span>' + _0x52a6a6 + '<span class="message-nick">' + _0x39ebe8 + ': </span><span class=\"message-text\">' + _0x2b2aa6 + '</span></div>');
                    $('#chat-box').perfectScrollbar('update');
                    $('#chat-box').animate({
                        'scrollTop': $('#chat-box').prop('scrollHeight')
                    }, 0x1f4);
                    if (CLIENT_SETTINGS.chatSounds) {
                        this.playSound(this.messageSound);
                    }
                    return;
                }
                if (!CLIENT_SETTINGS.hideChat) {
                    toastr.success('<span class="message-nick">' + _0x39ebe8 + ': </span><span class="message-text">' + _0x2b2aa6 + '</span>' + _0x52a6a6);
                    if (CLIENT_SETTINGS.chatSounds) {
                        this.playSound(this.messageSound);
                    }
                }
                this.chatHistory.push({
                    'nick': _0x39ebe8,
                    'message': _0x2b2aa6
                });
                if (this.chatHistory.length > 0xf) {
                    this.chatHistory.shift();
                }
            } else if (_0x4766a4 == 0x66) {
                if (CLIENT_SETTINGS.showChatBox) {
                    $('#chat-box').append('<div class="message command"><span class="command-time">' + _0x42598f +  '</span>' + _0x52a6a6 + '<span class="command-nick">' + _0x39ebe8 + ': </span><span class="command-text">' + _0x2b2aa6 + '</span></div>');
                    $('#chat-box').perfectScrollbar('update');
                    $('#chat-box').animate({
                        'scrollTop': $('#chat-box').prop('scrollHeight')
                    }, 0x1f4);
                    if (CLIENT_SETTINGS.chatSounds) {
                        this.playSound(this.commandSound);
                    }
                    return;
                }
                if (!CLIENT_SETTINGS.hideChat) {
                    toastr.warning('<span class=\"command-nick\">' + _0x39ebe8 + ': </span><span class="command-text">' + _0x2b2aa6 + '</span>' + _0x52a6a6);
                    if (CLIENT_SETTINGS.chatSounds) {
                        this.playSound(this.commandSound);
                    }
                }
            } else {
                $('#messages').append(_0x5e002a);
            }
        },
        'displayUserList': function (_0x5a88e1, _0x200ccd, _0xa70c6f, _0x50a847, _0x3f2276) {
            var _0x4eb377 = '';
            if (Object.keys(_0x5a88e1).length) {
                _0x4eb377 += '<ol class=\"user-list\">';
                for (var _0x266d6a in _0x5a88e1) {
                    if (_0x5a88e1.hasOwnProperty(_0x266d6a)) {
                        _0x4eb377 += '<li><strong>' + this.escapeHTML(_0x5a88e1[_0x266d6a]) + '</strong> <button data-user-id="' + _0x266d6a + '" class="btn btn-xs ' + _0xa70c6f + '\">' + _0x50a847 + '</button></li>';
                    }
                }
                _0x4eb377 += '</ol>';
            } else {
                _0x4eb377 += i18n.none;
            }
            toastr[_0x3f2276](_0x4eb377, _0x200ccd, {
                'closeButton': true,
                'tapToDismiss': false
            });
        },
        'displayChatActiveUsers': function () {
            this.displayUserList(this.chatUsers, i18n.activeUsers, 'btn-red btn-mute-user', i18n.mute, 'info');
        },
        'displayChatMutedUsers': function () {
            this.displayUserList(this.chatMutedUsers, i18n.mutedUsers, 'btn-green btn-unmute-user', i18n.unmute, 'error');
        },
        'preloadChatSounds': function () {
            this.setMessageSound();
            this.setCommandSound();
        },
        'setChatSoundsBtn': function () {
            if (CLIENT_SETTINGS.chatSounds) {
                $('.chat-sound-notifications').removeClass('ogicon-volume-mute2').addClass('ogicon-volume-high');
            } else {
                $('.chat-sound-notifications').removeClass('ogicon-volume-high').addClass('ogicon-volume-mute2');
            }
        },
        'setMessageSound': function () {
            this.messageSound = this.setSound(CLIENT_SETTINGS.messageSound);
        },
        'setCommandSound': function () {
            this.commandSound = this.setSound(CLIENT_SETTINGS.commandSound);
        },
        'setSound': function (_0x1042b1) {
            if (!_0x1042b1) {
                return null;
            }
            return new Audio(_0x1042b1);
        },
        'playSound': function (_0x310600) {
            if (_0x310600 && _0x310600.play) {
                _0x310600.pause();
                _0x310600.currentTime = 0x0;
                _0x310600.play();
            }
        },
        'setTargeting': function () {
            if (!this.targetID) {
                return;
            }
            this.targeting = !this.targeting;
            CLIENT2.targeting = this.targeting;
            this.setTargetingInfo();
        },
        'setTargetingInfo': function () {
            if (this.targeting) {
                $('#set-targeting').addClass('active');
                $('#target-status').show();
                if (this.targetStatus != 0x2) {
                    $('#target-summary').show();
                }
            } else {
                $('#set-targeting').removeClass('active');
                $('#target-summary, #target-status').hide();
            }
        },
        'cancelTargeting': function () {
            this.setTargetStatus(0x0);
        },
        'setPrivateMiniMap': function () {
            if (!this.targetID) {
                return;
            }
            this.privateMiniMap = !this.privateMiniMap;
            if (this.privateMiniMap) {
                $('#set-private-minimap').addClass('active');
            } else {
                $('#set-private-minimap').removeClass('active');
            }
        },
        'setTarget': function (_0x35537b) {
            var _0x4dbf55 = this.checkPlayerID(_0x35537b);
            if (_0x4dbf55 !== null) {
                var _0x4b34fb = this.teamPlayers[_0x4dbf55];
                this.targetID = _0x4b34fb.id;
                this.updateTarget(_0x4b34fb.nick, _0x4b34fb.skinURL, _0x4b34fb.x, _0x4b34fb.y, _0x4b34fb.mass, _0x4b34fb.color);
                if (!_0x4b34fb.alive) {
                    this.setTargetStatus(0x2);
                    return;
                }
                this.setTargetStatus(0x1);
            } else {
                this.setTargetStatus(0x0);
            }
        },
        'setTargetStatus': function (_0x161777) {
            switch (_0x161777) {
            case 0x0:
                this.targetStatus = 0x0;
                this.targetID = 0x0;
                this.targetNick = '';
                this.targetSkinURL = '';
                this.targeting = false;
                CLIENT2.targeting = false;
                this.privateMiniMap = false;
                $('#target-skin, #target-nick, #target-summary').hide();
                $('#target-status').show().text('[' + i18n.targetNotSet + ']');
                $('#target-panel-hud a').removeClass('active');
                break;
            case 0x1:
                this.targetStatus = 0x1;
                if (!this.targeting) {
                    this.targeting = true;
                    CLIENT2.targeting = true;
                    this.setTargetingInfo();
                }
                $('#target-skin, #target-nick, #target-status, #target-summary').show();
                break;
            case 0x2:
                this.targetStatus = 0x2;
                $('#target-summary').hide();
                $('#target-status').show().text('[' + i18n.targetDead + ']');
                CLIENT2.resetTargetPosition();
                break;
            }
        },
        'changeTarget': function () {
            var _0x4c21fe = this.checkPlayerID(this.targetID);
            for (var _0x5978f9 = null, _0x1d2c08 = 0x0; _0x1d2c08 < this.teamPlayers.length; _0x1d2c08++) {
                if (!this.teamPlayers[_0x1d2c08].alive) {
                    continue;
                }
                if (_0x4c21fe !== null) {
                    if (_0x1d2c08 < _0x4c21fe && _0x5978f9 === null) {
                        _0x5978f9 = _0x1d2c08;
                        continue;
                    }
                    if (_0x1d2c08 > _0x4c21fe) {
                        _0x5978f9 = _0x1d2c08;
                        break;
                    }
                } else {
                    _0x4c21fe = _0x1d2c08;
                    break;
                }
            }
            if (_0x5978f9 !== null) {
                _0x4c21fe = _0x5978f9;
            }
            if (_0x4c21fe !== null) {
                this.setTarget(this.teamPlayers[_0x4c21fe].id);
            } else {
                this.setTargetStatus(0x0);
            }
        },
        'updateTarget': function (_0x2d7b26, _0x56b897, _0x5c24e8, _0x3376b1, _0x8493cf, _0x4b83c3) {
            CLIENT2.setTargetPosition(_0x5c24e8, _0x3376b1);
            if (this.targetNick !== _0x2d7b26) {
                this.targetNick = _0x2d7b26;
                $('#target-nick').html(this.escapeHTML(_0x2d7b26));
            }
            $('#target-skin').css('background-color', _0x4b83c3);
            if (_0x56b897 && this.targetSkinURL !== _0x56b897) {
                if (this.customSkinsCache.hasOwnProperty(_0x56b897 + '_cached')) {
                    $('#target-skin img').attr('src', _0x56b897);
                    this.targetSkinURL = _0x56b897;
                } else {
                    $('#target-skin img').attr('src', 'https://cdn.ogario.ovh/static/img/blank.png');
                }
            }
            $('#target-status').text('[' + this.shortMassFormat(_0x8493cf) + ']');
            var _0x34d2c8 = this.calculateMapSector(_0x5c24e8, _0x3376b1);
            var _0xc3d78b = i18n.targetDistance + ': <span class="hud-main-color">' + CLIENT2.targetDistance + ' . + _0x34d2c8 + </span>';
            if (CLIENT2.play) {
                _0xc3d78b += ' | ' + i18n.targetMass + ': <span class="hud-main-color">' + this.shortMassFormat(_0x8493cf + CLIENT2.playerMass) + '</span>';
            }
            $('#target-summary').html(_0xc3d78b);
            if (this.targetStatus != 0x1) {
                this.setTargetStatus(0x1);
            }
        },
        'updateQuest': function () {
            if (!this.showQuest || this.gameMode !== ':ffa') {
                return;
            }
            if (window.MC && window.MC.getQuestProgressLabel) {
                this.questHUD.textContent = window.MC.getQuestProgressLabel();
            }
        },
        'init': function () {
            this.loadSettings();
            this.loadProfiles();
            this.setLang();
            this.setMenu();
            this.setUI();
            INTERFACE_HELPER && INTERFACE_HELPER.setTheme();
            this.setShowQuickMenu();
            this.setShowSkinsPanel();
            this.setProfile();
            this.setMainButtons();
            this.setStreamMode();
            this.setHideSkinUrl();
            this.setMiniMap();
            this.setAutoResp();
            this.setDisableChat();
            this.setShowChatBox();
            this.setTop5();
            this.setTargetingHUD();
            this.setQuest();
            this.displayTime();
            this.setCenteredLb();
            this.setNormalLb();
            this.setFpsAtTop();
            this.displayStats();
            this.setBlockPopups();
            this.preloadChatSounds();
            this.setChatSoundsBtn();
            var _0x213871 = this;
            setInterval(function () {
                _0x213871.drawMiniMap();
            }, 0x21);
            setInterval(function () {
                _0x213871.updateTeamPlayers();
            }, this.updateInterval);
        }
    };

    function _0x1b0494() {
        this.txt = '';
        this.txtCanvas = null;
        this.txtCtx = null;
        this.color = '#FFFFFF';
        this.stroke = false;
        this.strokeWidth = 0x2;
        this.strokeColor = '#000000';
        this.font = '700 16px Ubuntu';
        this.fontFamily = 'Ubuntu';
        this.fontWeight = 0x2bc;
        this.fontSize = 0x10;
        this.margin = 0x3;
        this.scale = 0x1;
        this.quality = 0x1;
        this.measuredWidth = 0x0;
        this.redraw = false;
        this.remeasure = false;
        this.setTxt = function (_0x35c108) {
            if (this.txt !== _0x35c108) {
                this.txt = _0x35c108;
                this.redraw = true;
                this.remeasure = true;
            }
        };
        this.setColor = function (_0x21afc3) {
            if (this.color !== _0x21afc3) {
                this.color = _0x21afc3;
                this.redraw = true;
            }
        };
        this.setStroke = function (_0x195619) {
            if (this.stroke !== _0x195619) {
                this.stroke = _0x195619;
                this.redraw = true;
            }
        };
        this.setStrokeWidth = function (_0x28a3f0) {
            if (!this.stroke) {
                return;
            }
            if (this.strokeWidth != _0x28a3f0) {
                this.strokeWidth = _0x28a3f0;
                this.redraw = true;
                this.remeasure = true;
            }
        };
        this.setStrokeColor = function (_0x5db11a) {
            if (!this.stroke) {
                return;
            }
            if (this.strokeColor !== _0x5db11a) {
                this.strokeColor = _0x5db11a;
                this.redraw = true;
            }
        };
        this.setFont = function () {
            this.font = this.fontWeight + ' ' + this.fontSize + 'px ' + this.fontFamily;
        };
        this.setFontFamily = function (_0x39dbad) {
            if (this.fontFamily !== _0x39dbad) {
                this.fontFamily = _0x39dbad;
                this.setFont();
                this.redraw = true;
                this.remeasure = true;
            }
        };
        this.setFontWeight = function (_0x323a7f) {
            if (this.fontWeight != _0x323a7f) {
                this.fontWeight = _0x323a7f;
                this.setFont();
                this.redraw = true;
                this.remeasure = true;
            }
        };
        this.setFontSize = function (_0x3db019) {
            if (this.fontSize != _0x3db019) {
                this.fontSize = _0x3db019;
                this.margin = ~~(_0x3db019 * 0.2);
                this.setFont();
                this.redraw = true;
            }
        };
        this.setScale = function (_0x4f78a5) {
            if (this.scale != _0x4f78a5) {
                this.scale = _0x4f78a5;
                this.redraw = true;
            }
        };
        this.createCanvas = function () {
            if (this.txtCanvas) {
                return;
            }
            this.txtCanvas = document.createElement('canvas');
            this.txtCtx = this.txtCanvas.getContext('2d');
            this.txtCtx.ogarioCtx = true;
        };
        this.setDrawing = function (_0x3c453f, _0x24dd60, _0x4fd99e, _0x227ed2, _0x2abfa2, _0xcdf50) {
            this.setColor(_0x3c453f);
            this.setFontFamily(_0x24dd60);
            this.setFontWeight(_0x4fd99e);
            this.setStroke(_0x227ed2);
            this.setStrokeWidth(_0x2abfa2);
            this.setStrokeColor(_0xcdf50);
        };
        this.measureWidth = function () {
            if (this.remeasure) {
                this.txtCtx.font = this.fontWeight + ' 10px ' + this.fontFamily;
                this.measuredWidth = this.txtCtx.measureText(this.txt).width;
                this.remeasure = false;
            }
            return ~~(this.fontSize / 0xa * this.measuredWidth) + this.strokeWidth * 0x2;
        };
        this.drawTxt = function () {
            this.createCanvas();
            if (this.redraw) {
                this.redraw = false;
                this.txtCanvas.width = this.measureWidth();
                this.txtCanvas.height = this.fontSize + this.margin;
                this.txtCtx.font = this.font;
                this.txtCtx.globalAlpha = 0x1;
                this.txtCtx.lineWidth = this.strokeWidth;
                this.txtCtx.strokeStyle = this.strokeColor;
                this.txtCtx.fillStyle = this.color;
                if (this.stroke) {
                    this.txtCtx.strokeText(this.txt, this.strokeWidth, this.fontSize - this.margin / 0x2);
                }
                this.txtCtx.fillText(this.txt, this.strokeWidth, this.fontSize - this.margin / 0x2);
            }
            return this.txtCanvas;
        };
    }

    var soundFood = MapChatUiCtrl.setSound('https://freesound.org/data/previews/163/163457_2263027-lq.mp3')//shotgun
    var soundSplit = MapChatUiCtrl.setSound('https://www.myinstants.com/media/sounds/quack_5.mp3')//laser
    
    function cellObj(id, x, y, mass, colorHEX, isFood, isVirus, isPlayerCell, shortMass, virMassShots) {
        this.points = []
        this.pointsVel = []
        this.maxPointRad = 0
        this.id = id;
        this.x = x;
        this.y = y;
        this.targetX = x;
        this.targetY = y;
        this.color = colorHEX;
        this.oppColor = null;
        this.size = mass;
        this.targetSize = mass;
        this.alpha = 0x1;
        this.nick = '';
        this.targetNick = '';
        this.nickCanvas = null;
        this.mass = 0x0;
        this.lastMass = 0x0;
        this.kMass = 0x0;
        this.massCanvas = null;
        this.massTxt = '';
        this.margin = 0x0;
        this.scale = 0x1;
        this.nickScale = 0x1;
        this.massScale = 0x1;
        this.virMassScale = 0x3;
        this.strokeScale = 0x1;
        this.fontSize = 0x1a;
        this.nickSize = 0x1a;
        this.lastNickSize = 0x0;
        this.massSize = 0x1a;
        this.virMassSize = 0x1a;
        this.nickStrokeSize = 0x3;
        this.massStrokeSize = 0x3;
        this.isFood = isFood;
        this.isVirus = isVirus;
        this.isPlayerCell = isPlayerCell;
        this.shortMass = shortMass;
        this.virMassShots = virMassShots;
        this.rescale = false;
        this.redrawNick = true;
        this.redrawMass = true;
        this.optimizedNames = false;
        this.optimizedMass = false;
        this.strokeNick = false;
        this.strokeMass = false;
        this.removed = false;
        this.redrawed = 0x0;
        this.time = 0x0;
        this.skin = null;
        this.pi2 = 0x2 * Math.PI;

        this.updateNumPoints= function() {
            //регулировка количества соприкосновений
            var numPoints = this.size * WORLD.scale | 0;
            numPoints = Math.max(numPoints, 5);
            numPoints = Math.min(numPoints, 120);
            if (this.isVirus) numPoints = 100;
            while (this.points.length > numPoints) {
                var i = Math.random() * this.points.length | 0;
                this.points.splice(i, 1);
                this.pointsVel.splice(i, 1);
            }
            if (this.points.length == 0 && numPoints != 0) {
                this.points.push({
                    x: this.x,
                    y: this.y,
                    rl: this.size,
                    parent: this//?
                });
                this.pointsVel.push(Math.random() - 0.5);
            }
            while (this.points.length < numPoints) {
                var i = Math.random() * this.points.length | 0;
                var point = this.points[i];
                var vel = this.pointsVel[i];
                this.points.splice(i, 0, {
                    x: point.x,
                    y: point.y,
                    rl: point.rl,
                    parent: this
                });
                this.pointsVel.splice(i, 0, vel);
            }
        }
        this.sqDist = function(a, b) {
            return (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y);
        }
        this.movePoints= function() {
            //console.log(this.id)
            var pointsVel = this.pointsVel.slice();
            var len = this.points.length;
            for (var i = 0; i < len; ++i) {
                var prevVel = pointsVel[(i - 1 + len) % len];
                var nextVel = pointsVel[(i + 1) % len];
                var newVel = (this.pointsVel[i] + Math.random() - 0.5) * 0.7;
                newVel = Math.max(Math.min(newVel, 10), -10);
                this.pointsVel[i] = (prevVel + nextVel + 8 * newVel) / 10;
            }
            this.maxPointRad = 0
            for (var i = 0; i < len; ++i) {
                var curP = this.points[i];
                var curRl = curP.rl;
                var prevRl = this.points[(i - 1 + len) % len].rl;
                var nextRl = this.points[(i + 1) % len].rl;
                var self = this;
                var affected = CLIENT.quadtree.some({
                    x: curP.x - 5,
                    y: curP.y - 5,
                    w: 10,
                    h: 10
                }, function(item) {
                    return item.parent != self && this.sqDist(item, curP) <= 25;
                }.bind(this));

                //this.viewMinX, this.viewMinY, this.viewMaxX, this.viewMaxY

                //(curP.x < CLIENT.mapMinX || curP.y < CLIENT.mapMaxY ||
                //curP.x > CLIENT.mapMaxX || curP.y > CLIENT.mapMinY))


                //(curP.x < CLIENT.viewMinX || curP.y < CLIENT.viewMaxY ||
                //curP.x > CLIENT.viewMaxX || curP.y > CLIENT.viewMinY))

                /*if (!affected &&
                    (curP.x < CLIENT.mapMinX || curP.y < CLIENT.mapMaxY ||
                    curP.x > CLIENT.mapMaxX || curP.y > CLIENT.mapMinY))
                {
                    affected = true;
                }*/
                if (affected) {
                    //console.log('affected!!!!!')
                    this.pointsVel[i] = Math.min(this.pointsVel[i], 0);
                    this.pointsVel[i] -= 1;
                }
                curRl += this.pointsVel[i];
                curRl = Math.max(curRl, 0);

                curRl = (9 * curRl + this.size) / 10;//собака

                curP.rl = (prevRl + this.size + 8 * curRl) / 10;//собака

                //curP.rl = (prevRl + nextRl + 8 * curRl) / 10;

                var angle = 2 * Math.PI * i / len;
                var rl = curP.rl;
                if(rl > this.maxPointRad) this.maxPointRad = rl
                if (this.isVirus && i % 2 == 0) {
                    rl += 5;
                }

                curP.x = this.x + Math.cos(angle) * rl;
                curP.y = this.y + Math.sin(angle) * rl;
            }
        },
        this.update = function (_0x1f55f2, _0x109f97, _0x38153b, _0x1e869d, _0x15181b, _0x2e7018) {
            this.x = _0x1f55f2;
            this.y = _0x109f97;
            this.isVirus = _0x1e869d;
            this.isPlayerCell = _0x15181b;
            this.setMass(_0x38153b);
            this.setNick(_0x2e7018);
        };
        this.removeCell = function () {
            this.removed = true;
            var _0x370ec6 = CLIENT.cells.indexOf(this);
            if (_0x370ec6 != -0x1) {
                CLIENT.cells.splice(_0x370ec6, 0x1);
                if (CLIENT_SETTINGS.virusesRange) {
                    _0x370ec6 = CLIENT.viruses.indexOf(this);
                    if (_0x370ec6 != -0x1) {
                        CLIENT.viruses.splice(_0x370ec6, 0x1);
                    }
                }
            } else {
                _0x370ec6 = CLIENT.food.indexOf(this);
                if (_0x370ec6 != -0x1) {
                    CLIENT.food.splice(_0x370ec6, 0x1);
                }
            }
            _0x370ec6 = CLIENT.playerCells.indexOf(this);
            if (_0x370ec6 != -0x1) {
                CLIENT.removePlayerCell = true;
                CLIENT.playerCells.splice(_0x370ec6, 0x1);
                _0x370ec6 = CLIENT.playerCellIDs.indexOf(this.id);
                if (_0x370ec6 != -0x1) {
                    CLIENT.playerCellIDs.splice(_0x370ec6, 0x1);
                }
            }
            if (this.redrawed) {
                CLIENT.removedCells.push(this);
            }
            delete CLIENT.indexedCells[this.id];
        };
        this.moveCell = function () {
            var _0x390102 = CLIENT.time - this.time;
            var _0x192f06 = _0x390102 / CLIENT_SETTINGS.animation;
            _0x192f06 = _0x192f06 < 0x0 ? 0x0 : _0x192f06 > 0x1 ? 0x1 : _0x192f06;
            this.x += (this.targetX - this.x) * _0x192f06;
            this.y += (this.targetY - this.y) * _0x192f06;
            this.size += (this.targetSize - this.size) * _0x192f06;
            this.alpha = _0x192f06;
            if (!this.removed) {
                this.time = CLIENT.time;
                return;
            }
            if (_0x192f06 == 0x1) {
                var _0x2dbf58 = CLIENT.removedCells.indexOf(this);
                if (_0x2dbf58 != -0x1) {
                    CLIENT.removedCells.splice(_0x2dbf58, 0x1);
                }
            }
        };
        this.isInView = function () {
            return this.id <= 0x0 ? false : this.x + this.size + 0x28 < CLIENT.viewX - CLIENT.canvasWidth / 0x2 / CLIENT.scale || this.y + this.size + 0x28 < CLIENT.viewY - CLIENT.canvasHeight / 0x2 / CLIENT.scale || this.x - this.size - 0x28 > CLIENT.viewX + CLIENT.canvasWidth / 0x2 / CLIENT.scale || this.y - this.size - 0x28 > CLIENT.viewY + CLIENT.canvasHeight / 0x2 / CLIENT.scale ? false : true;
        };
        this.setMass = function (_0x38153b) {
            this.size = _0x38153b;
            if (_0x38153b <= 0x28) {
                return false;
            }
            if (!this.massCanvas) {
                this.massCanvas = new _0x1b0494();
                return false;
            }
            this.mass = ~~(_0x38153b * _0x38153b / 0x64);
            this.redrawMass = true;
            if (this.isVirus) {
                if (this.virMassShots && this.mass < 0xc8) {
                    this.mass = ~~((0xc8 - this.mass) / 0xe);
                    //M00
                    if(CLIENT_SETTINGS.virusSound && this.lastMass && this.mass < this.lastMass) {MapChatUiCtrl.playSound(soundFood)}
                    this.lastMass = this.mass
                }
                this.massTxt = this.mass.toString();
                return true;
            }
            this.massTxt = this.mass.toString();
            if (this.mass <= 0xc8) {
                return true;
            }
            if (this.shortMass && this.mass >= 0x3e8) {
                this.kMass = Math.round(this.mass / 0x64) / 0xa;
                this.massTxt = this.kMass + 'k';
                return true;
            }
            if (this.optimizedMass) {
                this.redrawMass = Math.abs((this.mass - this.lastMass) / this.mass) >= 0.02 || this.rescale;
            }
            return true;
        };
        this.setNick = function (_0x5ebfcc) {
            this.nick = _0x5ebfcc;
            if (!_0x5ebfcc || this.isVirus) {
                return false;
            }
            if (!this.nickCanvas) {
                this.nickCanvas = new _0x1b0494();
                return false;
            }
            return true;
        };
        this.setScale = function (_0x581f97, _0x48e11d, _0x364112, _0x397288, _0x1193d3) {
            var _0xc322d1 = Math.ceil(_0x581f97 * 0xa) / 0xa;
            this.rescale = false;
            if (this.scale != _0xc322d1) {
                this.scale = _0xc322d1;
                this.rescale = true;
            }
            this.nickScale = _0x48e11d;
            this.massScale = _0x364112;
            this.virMassScale = _0x397288;
            this.strokeScale = _0x1193d3;
        };
        this.setFontSize = function () {
            if (this.isVirus) {
                this.massSize = Math.ceil(this.virMassSize * this.scale * this.virMassScale);
                return;
            }
            this.fontSize = Math.max(this.size * 0.3, 0x1a) * this.scale;
            this.nickSize = ~~(this.fontSize * this.nickScale);
            this.massSize = ~~(this.fontSize * 0.5 * this.massScale);
            if (this.optimizedNames) {
                this.redrawNick = Math.abs((this.nickSize - this.lastNickSize) / this.nickSize) >= 0.3 || this.rescale;
                return;
            }
            this.redrawNick = true;
        };
        this.setStrokeSize = function () {
            if (this.strokeNick && !this.isVirus) {
                this.nickStrokeSize = ~~(this.nickSize * 0.1 * this.strokeScale);
            }
            if (this.strokeMass) {
                this.massStrokeSize = ~~(this.massSize * 0.1 * this.strokeScale);
            }
        };
        this.setDrawing = function () {
            this.optimizedNames = CLIENT_SETTINGS.optimizedNames;
            this.optimizedMass = CLIENT_SETTINGS.optimizedMass;
            this.shortMass = CLIENT_SETTINGS.shortMass;
            this.virMassShots = CLIENT_SETTINGS.virMassShots;
            this.strokeNick = CLIENT_SETTINGS.namesStroke;
            this.strokeMass = CLIENT_SETTINGS.massStroke;
        };
        this.setDrawingScale = function () {
            this.setScale(CLIENT2.viewScale, PRESET.namesScale, PRESET.massScale, PRESET.virMassScale, PRESET.strokeScale);
            this.setFontSize();
            this.setStrokeSize();
            this.margin = 0x0;
        };
        this.drawNick = function (_0x30d2d1) {
            if (!this.nick || !this.nickCanvas || this.isVirus) {
                return;
            }
            var _0x280130 = this.nickCanvas;
            _0x280130.setDrawing(PRESET.namesColor, PRESET.namesFontFamily, PRESET.namesFontWeight, this.strokeNick, this.nickStrokeSize, PRESET.namesStrokeColor);
            _0x280130.setTxt(this.nick);
            if (this.redrawNick) {
                _0x280130.setFontSize(this.nickSize);
                this.lastNickSize = this.nickSize;
            }
            _0x280130.setScale(this.scale);
            var _0x40f71c = _0x280130.drawTxt();
            var _0x466b89 = ~~(_0x40f71c.width / this.scale);
            var _0x4b77d2 = ~~(_0x40f71c.height / this.scale);
            this.margin = ~~(_0x4b77d2 / 0x2);
            _0x30d2d1.drawImage(_0x40f71c, ~~this.x - ~~(_0x466b89 / 0x2), ~~this.y - this.margin, _0x466b89, _0x4b77d2);
        };
        this.drawMass = function (_0x30f7b0) {
            if (!this.massCanvas || this.size <= 0x28) {
                return;
            }
            var _0x21fdee = this.massCanvas;
            _0x21fdee.setDrawing(PRESET.massColor, PRESET.massFontFamily, PRESET.massFontWeight, this.strokeMass, this.massStrokeSize, PRESET.massStrokeColor);
            if (this.redrawMass) {
                _0x21fdee.setTxt(this.massTxt);
                this.lastMass = this.mass;
            }
            _0x21fdee.setFontSize(this.massSize);
            _0x21fdee.setScale(this.scale);
            var _0x5989ea = _0x21fdee.drawTxt();
            var _0x45fb66 = ~~(_0x5989ea.width / this.scale);
            var _0xb3a024 = ~~(_0x5989ea.height / this.scale);
            var _0x109f97 = this.margin == 0x0 ? ~~this.y - ~~(_0xb3a024 / 0x2) : ~~this.y + this.margin;
            _0x30f7b0.drawImage(_0x5989ea, ~~this.x - ~~(_0x45fb66 / 0x2), _0x109f97, _0x45fb66, _0xb3a024);
        };
        this.draw = function (ctx, _0x53dced) {
            if (CLIENT.hideSmallBots && this.size <= 0x24) {
                return;
            }
            ctx.save();
            this.redrawed++;
            if (_0x53dced) {
                this.moveCell();
            }
            if (this.removed) {
                ctx.globalAlpha *= 0x1 - this.alpha;
            }
            var prevAlpha = ctx.globalAlpha;
            var isAlphaChanged = false;
            var size = this.isFood ? this.size + PRESET.foodSize : this.size;
            

            //var jelly = true

            ctx.beginPath();
            if(this.isVirus) ctx.lineJoin = "miter"
            if (CLIENT_SETTINGS.jellyPhisycs && this.points.length) {
                var point = this.points[0];
                ctx.moveTo(point.x, point.y);
                for (var i = 0; i < this.points.length; ++i) {
                    var point = this.points[i];
                    ctx.lineTo(point.x, point.y);
                }
            }else if (this.isVirus) {
                var pointCount = 120;
                var incremental = this.pi2 / pointCount;
                ctx.moveTo(this.x, this.y + this.size + 3);
                for (var i = 1; i < pointCount; i++) {
                    var angle = i * incremental;
                    var dist = this.size - 3 + (i % 2 === 0) * 6;
                    ctx.lineTo(
                        this.x + dist * Math.sin(angle),
                        this.y + dist * Math.cos(angle)
                    )
                }
                ctx.lineTo(this.x, this.y + this.size + 3);
            } else ctx.arc(this.x, this.y, size, 0x0, this.pi2, false);

            ctx.closePath();

            if (this.isFood) {
                ctx.fillStyle = this.color;
                ctx.fill();
                ctx.restore();
                return;
            }
            if (this.isVirus) {
                if (CLIENT_SETTINGS.transparentViruses) {
                    ctx.globalAlpha *= PRESET.virusAlpha;
                    isAlphaChanged = true;
                }
                if (CLIENT_SETTINGS.virColors && CLIENT.play) {
                    ctx.fillStyle = MapChatUiCtrl.setVirusColor(size);
                    ctx.strokeStyle = MapChatUiCtrl.setVirusStrokeColor(size);
                } else {
                    ctx.fillStyle = PRESET.virusColor;
                    ctx.strokeStyle = PRESET.virusStrokeColor;
                }
                ctx.fill();
                if (isAlphaChanged) {
                    ctx.globalAlpha = prevAlpha;
                    isAlphaChanged = false;
                }
                ctx.lineWidth = PRESET.virusStrokeSize;
                ctx.stroke();
                if (CLIENT_SETTINGS.showMass) {
                    this.setDrawing();
                    this.setDrawingScale();
                    this.setMass(this.size);
                    this.drawMass(ctx);
                }
                ctx.restore();
                return;
            }
            if (CLIENT_SETTINGS.transparentCells) {
                ctx.globalAlpha *= PRESET.cellsAlpha;
                isAlphaChanged = true;
            }
            var color = this.color;
            if (CLIENT.play) {
                if (this.isPlayerCell) {
                    if (CLIENT_SETTINGS.myCustomColor) {
                        color = _0x4673ea.color;
                    }
                } else if (CLIENT_SETTINGS.oppColors && !CLIENT_SETTINGS.oppRings) {
                    color = this.oppColor;
                }
            }
            ctx.fillStyle = color;
            ctx.fill();
            if (isAlphaChanged) {
                ctx.globalAlpha = prevAlpha;
                isAlphaChanged = false;
            }
            var skinCtx = null;
            if (CLIENT_SETTINGS.customSkins && CLIENT.showCustomSkins) {
                skinCtx = MapChatUiCtrl.getCustomSkin(this.targetNick, this.color);
                if (skinCtx) {
                    if ((CLIENT_SETTINGS.transparentSkins || CLIENT.play && CLIENT_SETTINGS.oppColors) && !(this.isPlayerCell && !CLIENT_SETTINGS.myTransparentSkin) || this.isPlayerCell && CLIENT_SETTINGS.myTransparentSkin) {
                        ctx.globalAlpha *= PRESET.skinsAlpha;
                        isAlphaChanged = true;
                    }

                    if(CLIENT_SETTINGS.jellyPhisycs){
                        var lineWidth = Math.max(~~(size / 50), 10);
                        ctx.save();
                        ctx.clip();
                        this.maxPointRad && (size=this.maxPointRad)
                        ctx.drawImage(skinCtx, this.x - size-lineWidth, this.y - size-lineWidth, 2 * size+lineWidth*2, 2 * size+lineWidth*2);
    
                        ctx.globalCompositeOperation='luminosity'
    
                        ctx.lineWidth = lineWidth
                        ctx.strokeStyle = color;
                        ctx.stroke();
                        ctx.globalCompositeOperation=''
                        ctx.restore();
    
                    } else ctx.drawImage(skinCtx, this.x - size, this.y - size, 2 * size, 2 * size);


                    //ctx.drawImage(skinCtx, this.x - size, this.y - size, 2 * size, 2 * size);
                    if (isAlphaChanged) {
                        ctx.globalAlpha = prevAlpha;
                        isAlphaChanged = false;
                    }
                }
            }
            if (CLIENT_SETTINGS.teammatesInd && !this.isPlayerCell && size <= 0xc8 && (skinCtx || MapChatUiCtrl.checkSkinsMap(this.targetNick, this.color))) {
                WORLD.drawTeammatesInd(ctx, this.x, this.y, size);
            }


            //
           // x,y is the point to test
            // cx, cy is circle center, and radius is circle radius
            




            
            if (CLIENT_SETTINGS.noNames && !CLIENT_SETTINGS.showMass || _0x53dced) {
                ctx.restore();
                return;
            }
            var _0x2e2c68 = false;
            if (!this.isPlayerCell) {
                _0x2e2c68 = MapChatUiCtrl.setAutoHideCellInfo(size);
                if (_0x2e2c68 && CLIENT_SETTINGS.autoHideNames && CLIENT_SETTINGS.autoHideMass) {
                    ctx.restore();
                    return;
                }
            }
            this.setDrawing();
            this.setDrawingScale();
            ctx.globalAlpha *= PRESET.textAlpha;
            if (!CLIENT_SETTINGS.noNames && !(_0x2e2c68 && CLIENT_SETTINGS.autoHideNames) && !(this.isPlayerCell && CLIENT_SETTINGS.hideMyName) && !(skinCtx && CLIENT_SETTINGS.hideTeammatesNames)) {
                if (this.setNick(this.targetNick)) {
                    this.drawNick(ctx);
                }
            }
            if (CLIENT_SETTINGS.showMass && !(_0x2e2c68 && CLIENT_SETTINGS.autoHideMass) && !(this.isPlayerCell && CLIENT_SETTINGS.hideMyMass) && !(CLIENT_SETTINGS.hideEnemiesMass && !this.isPlayerCell && !this.isVirus)) {
                if (this.setMass(this.size)) {
                    this.drawMass(ctx);
                }
            }
            ctx.restore();
        };
    }
    var CLIENT = window.aa = {
        'quadtree':null,
         updateQuadtree: function(cells) {
            var w = WORLD.canvasWidth / WORLD.scale;
            var h = WORLD.canvasHeight / WORLD.scale;
            var x = (CLIENT.viewX - w / 2);
            var y = (CLIENT.viewY - h / 2);
            this.quadtree = new PointQuadTree(x, y, w, h, 32);
            for (var i = 0; i < cells.length; ++i) {
                var cell = cells[i];
                for (var n = 0; n < cell.points.length; ++n) {
                    this.quadtree.insert(cell.points[n]);
                }
            }
        },
        'isFreeSpectated':false,
        'ws': null,
        'socket': null,
        'protocolKey': null,
        'clientKey': null,
        'connectionOpened': false,
        'accessTokenSent': false,
        'loggedIn': false,
        'clientVersion': 0x76c0,
        'clientVersionString': '3.4.0',
        'time': Date.now(),
        'serverTime': 0x0,
        'serverTimeDiff': 0x0,
        'loggedInTime': 0x0,
        'mapSize': 0x373e,
        'mapOffset': 0x1b9f,
        'mapOffsetX': 0x0,
        'mapOffsetY': 0x0,
        'mapOffsetFixed': false,
        'mapMinX': -0x1b9f,
        'mapMinY': -0x1b9f,
        'mapMaxX': 0x1b9f,
        'mapMaxY': 0x1b9f,
        'viewMinX': 0x0,
        'viewMinY': 0x0,
        'viewMaxX': 0x0,
        'viewMaxY': 0x0,
        'canvasWidth': 0x0,
        'canvasHeight': 0x0,
        'canvasScale': 0x1,
        'indexedCells': {},
        'cells': [],
        'removedCells': [],
        'food': [],
        'viruses': [],
        'playerCells': [],
        'playerCellIDs': [],
        'ghostCells': [],
        'playerX': 0x0,
        'playerY': 0x0,
        'playerSize': 0x0,
        'playerMass': 0x0,
        'playerMaxMass': 0x0,
        'playerMinMass': 0x0,
        'playerScore': 0x0,
        'playerSplitCells': 0x0,
        'playerColor': null,
        'playerNick': '',
        'playerPosition': 0x0,
        'leaderboard': [],
        'biggerSTECellsCache': [],
        'biggerCellsCache': [],
        'smallerCellsCache': [],
        'STECellsCache': [],
        'STE': 0x0,
        'autoZoom': false,
        'zoomValue': 0.1,
        'viewX': 0x0,
        'viewY': 0x0,
        'scale': 0x1,
        'viewScale': 0x1,
        'clientX': 0x0,
        'clientY': 0x0,
        'cursorX': 0x0,
        'cursorY': 0x0,
        'targetX': 0x0,
        'targetY': 0x0,
        'targetDistance': 0x0,
        'battleRoyale': {
            'state': 0x0,
            'players': 0x0,
            'startTime': 0x0,
            'shrinkTime': 0x0,
            'timeLeft': 0x0,
            'x': 0x0,
            'y': 0x0,
            'radius': 0x0,
            'targetX': 0x0,
            'targetY': 0x0,
            'targetRadius': 0x0,
            'maxRadius': 0x2c31,
            'rank': [],
            'playerRank': 0x0,
            'joined': false
        },
        'play': false,
        'pause': false,
        'targeting': false,
        'removePlayerCell': false,
        'showCustomSkins': true,
        'showFood': true,
        'foodIsHidden': false,
        'selectBiggestCell': true,
        'hideSmallBots': false,
        'pressedKeys': {},
        'connect': function (_0x5a6416) {
            console.log('[OGARio by szymy] Connecting to game server:', _0x5a6416);
            var _0x1d750d = this;
            this.closeConnection();
            this.flushCellsData();
            this.protocolKey = null;
            this.clientKey = null;
            this.accessTokenSent = false;
            this.connectionOpened = false;
            this.loggedIn = false;
            this.mapOffsetFixed = false;
            this.leaderboard = [];
            this.ws = _0x5a6416;
            this.socket = new WebSocket(_0x5a6416);
            this.socket.binaryType = 'arraybuffer';
            this.socket.onopen = function () {
                _0x1d750d.onOpen();
            };
            this.socket.onmessage = function (_0x1fe6ff) {
                _0x1d750d.onMessage(_0x1fe6ff);
            };
            this.socket.onerror = function (_0x4e1cbe) {
                _0x1d750d.onError(_0x4e1cbe);
            };
            this.socket.onclose = function (_0x446c51) {
                _0x1d750d.onClose(_0x446c51);
            };
            MapChatUiCtrl.getWS(this.ws);
            MapChatUiCtrl.sendServerJoin();
            MapChatUiCtrl.sendServerData();
            MapChatUiCtrl.displayLeaderboard('');
            if (window.master && window.master.onConnect) {
                window.master.onConnect();
            }
        },
        'onOpen': function (_0x57e3c8) {
            console.log('[OGARio by szymy] Game server socket open');
            this.time = Date.now();
            var _0x37ab5a = this.createView(0x5);
            _0x37ab5a.setUint8(0x0, 0xfe);
            _0x37ab5a.setUint32(0x1, 0x14, true);
            this.sendMessage(_0x37ab5a);
            _0x37ab5a = this.createView(0x5);
            _0x37ab5a.setUint8(0x0, 0xff);
            _0x37ab5a.setUint32(0x1, this.clientVersion, true);
            this.sendMessage(_0x37ab5a);
            this.connectionOpened = true;
        },
        'onMessage': function (_0x2fa35d) {
            _0x2fa35d = new DataView(_0x2fa35d.data);
            if (this.protocolKey) {
                _0x2fa35d = this.shiftMessage(_0x2fa35d, this.protocolKey ^ this.clientVersion);
            }
            this.handleMessage(_0x2fa35d);
        },
        'onError': function (_0x286941) {
            console.log('[OGARio by szymy] Game server socket error');
            this.flushCellsData();
            if (window.master && window.master.onDisconnect) {
                window.master.onDisconnect();
            }
        },
        'onClose': function (_0x487be9) {
            console.log('[OGARio by szymy] Game server socket close');
            this.flushCellsData();
            if (window.master && window.master.onDisconnect) {
                window.master.onDisconnect();
            }
        },
        'closeConnection': function () {
            if (this.socket) {
                this.socket.onopen = null;
                this.socket.onmessage = null;
                this.socket.onerror = null;
                this.socket.onclose = null;
                try {
                    this.socket.close();
                } catch (_0x49aa9b) {}
                this.socket = null;
                this.ws = null;
            }
        },
        'isSocketOpen': function () {
            return this.socket !== null && this.socket.readyState === this.socket.OPEN;
        },
        'writeUint32': function (_0x48088c, _0x30b4fa) {
            while (true) {
                if ((_0x30b4fa & -0x80) == 0x0) {
                    _0x48088c.push(_0x30b4fa);
                    return;
                } else {
                    _0x48088c.push(_0x30b4fa & 0x7f | 0x80);
                    _0x30b4fa = _0x30b4fa >>> 0x7;
                }
            }
        },
        'createView': function (_0x47816d) {
            return new DataView(new ArrayBuffer(_0x47816d));
        },
        'sendBuffer': function (_0xd35ce1) {
            this.socket.send(_0xd35ce1.buffer);
        },
        'sendMessage': function (_0x518fbd) {
            if (this.connectionOpened) {
                if (!this.clientKey) {
                    return;
                }
                _0x518fbd = this.shiftMessage(_0x518fbd, this.clientKey);
                this.clientKey = this.shiftKey(this.clientKey);
            }
            this.sendBuffer(_0x518fbd);
        },
        'sendAction': function (_0x45d21e) {
            if (!this.isSocketOpen()) {
                return;
            }
            var _0x2137fc = this.createView(0x1);
            _0x2137fc.setUint8(0x0, _0x45d21e);
            this.sendMessage(_0x2137fc);
        },
        'sendSpectate': function () {
            this.sendAction(0x1);
        },
        'sendFreeSpectate': function () {
            this.sendAction(0x12);
            this.isFreeSpectated = !this.isFreeSpectated
        },
        'sendEject': function () {
            this.sendPosition();
            this.sendAction(0x15);
        },
        'sendSplit': function () {
            this.sendPosition();
            this.sendAction(0x11);
        },
        'sendNick': function (_0x2394ef) {
            this.playerNick = _0x2394ef;
            _0x2394ef = window.unescape(window.encodeURIComponent(_0x2394ef));
            var _0x3e1b29 = this.createView(0x2 + _0x2394ef.length);
            for (var _0x1ffa48 = 0x0; _0x1ffa48 < _0x2394ef.length; _0x1ffa48++) {
                _0x3e1b29.setUint8(_0x1ffa48 + 0x1, _0x2394ef.charCodeAt(_0x1ffa48));
            }
            this.sendMessage(_0x3e1b29);
        },
        'sendPosition': function () {
            if (!this.isSocketOpen() || !this.connectionOpened || !this.clientKey) {
                return;
            }
            var _0x2e26a6 = this.cursorX;
            var _0x1d3855 = this.cursorY;
            if (!this.play && this.targeting || this.pause) {
                _0x2e26a6 = this.targetX;
                _0x1d3855 = this.targetY;
            }
            var _0x38d484 = this.createView(0xd);
            _0x38d484.setUint8(0x0, 0x10);
            _0x38d484.setInt32(0x1, _0x2e26a6, true);
            _0x38d484.setInt32(0x5, _0x1d3855, true);
            _0x38d484.setUint32(0x9, this.protocolKey, true);
            this.sendMessage(_0x38d484);
        },
        'sendAccessToken': function (_0x2c3c67, _0x4596a3, _0x5c3d81) {
            if (this.accessTokenSent) {
                return;
            }
            if (!_0x5c3d81) {
                _0x5c3d81 = 0x66;
            }
            var _0x18182a = _0x2c3c67.length;
            var _0x280739 = this.clientVersionString.length;
            var _0x21be19 = [_0x5c3d81, 0x8, 0x1, 0x12];
            this.writeUint32(_0x21be19, _0x18182a + _0x280739 + 0x17);
            _0x21be19.push(0x8, 0xa, 0x52);
            this.writeUint32(_0x21be19, _0x18182a + _0x280739 + 0x12);
            _0x21be19.push(0x8, _0x4596a3, 0x12, _0x280739 + 0x8, 0x8, 0x5, 0x12, _0x280739);
            for (var _0x1bfdb6 = 0x0; _0x1bfdb6 < _0x280739; _0x1bfdb6++) {
                _0x21be19.push(this.clientVersionString.charCodeAt(_0x1bfdb6));
            }
            _0x21be19.push(0x18, 0x0, 0x20, 0x0, 0x1a);
            this.writeUint32(_0x21be19, _0x18182a + 0x3);
            _0x21be19.push(0xa);
            this.writeUint32(_0x21be19, _0x18182a);
            for (_0x1bfdb6 = 0x0; _0x1bfdb6 < _0x18182a; _0x1bfdb6++) {
                _0x21be19.push(_0x2c3c67.charCodeAt(_0x1bfdb6));
            }
            _0x21be19 = new Uint8Array(_0x21be19);
            var _0x70d8a6 = new DataView(_0x21be19.buffer);
            this.sendMessage(_0x70d8a6);
        },
        'sendFbToken': function (_0xabc5d1) {
            this.sendAccessToken(_0xabc5d1, 0x2);
        },
        'sendGplusToken': function (_0x3ff3cd) {
            this.sendAccessToken(_0x3ff3cd, 0x4);
        },
        'sendRecaptcha': function (_0x125ef5) {
            var _0xbff144 = this.createView(0x2 + _0x125ef5.length);
            _0xbff144.setUint8(0x0, 0x56);
            for (var _0x415fa0 = 0x0; _0x415fa0 < _0x125ef5.length; _0x415fa0++) {
                _0xbff144.setUint8(0x1 + _0x415fa0, _0x125ef5.charCodeAt(_0x415fa0));
            }
            _0xbff144.setUint8(_0x125ef5.length + 0x1, 0x0);
            this.sendMessage(_0xbff144);
        },
        'setClientVersion': function (_0x289319, _0x3096dc) {
            this.clientVersion = _0x289319;
            this.clientVersionString = _0x3096dc;
            console.log('[OGARio by szymy] Client version:', _0x289319, _0x3096dc);
        },
        'generateClientKey': function (_0x379a9b, _0x169da9) {
            if (!_0x379a9b.length || !_0x169da9.byteLength) {
                return null;
            }
            var _0x33ed6f = null;
            var _0x257dfd = 0x5bd1e995;
            var _0x2145aa = _0x379a9b.match(/(ws+:\/\/)([^:]*)(:\d+)/)[0x2];
            var _0x31ad4c = _0x2145aa.length + _0x169da9.byteLength;
            var _0x4bc16b = new Uint8Array(_0x31ad4c);
            for (var _0x596c83 = 0x0; _0x596c83 < _0x2145aa.length; _0x596c83++) {
                _0x4bc16b[_0x596c83] = _0x2145aa.charCodeAt(_0x596c83);
            }
            _0x4bc16b.set(_0x169da9, _0x2145aa.length);
            var _0x2debc8 = new DataView(_0x4bc16b.buffer);
            var _0x5992f0 = _0x31ad4c - 0x1;
            var _0x229758 = (_0x5992f0 - 0x4 & -0x4) + 0x4 | 0x0;
            var _0x1c5670 = _0x5992f0 ^ 0xff;
            var _0x2e2769 = 0x0;
            while (_0x5992f0 > 0x3) {
                _0x33ed6f = Math.imul(_0x2debc8.getInt32(_0x2e2769, true), _0x257dfd) | 0x0;
                _0x1c5670 = (Math.imul(_0x33ed6f >>> 0x18 ^ _0x33ed6f, _0x257dfd) | 0x0) ^ (Math.imul(_0x1c5670, _0x257dfd) | 0x0);
                _0x5992f0 -= 0x4;
                _0x2e2769 += 0x4;
            }
            switch (_0x5992f0) {
            case 0x3:
                _0x1c5670 = _0x4bc16b[_0x229758 + 0x2] << 0x10 ^ _0x1c5670;
                _0x1c5670 = _0x4bc16b[_0x229758 + 0x1] << 0x8 ^ _0x1c5670;
                break;
            case 0x2:
                _0x1c5670 = _0x4bc16b[_0x229758 + 0x1] << 0x8 ^ _0x1c5670;
                break;
            case 0x1:
                break;
            default:
                _0x33ed6f = _0x1c5670;
                break;
            }
            if (_0x33ed6f != _0x1c5670) {
                _0x33ed6f = Math.imul(_0x4bc16b[_0x229758] ^ _0x1c5670, _0x257dfd) | 0x0;
            }
            _0x1c5670 = _0x33ed6f >>> 0xd;
            _0x33ed6f = _0x1c5670 ^ _0x33ed6f;
            _0x33ed6f = Math.imul(_0x33ed6f, _0x257dfd) | 0x0;
            _0x1c5670 = _0x33ed6f >>> 0xf;
            _0x33ed6f = _0x1c5670 ^ _0x33ed6f;
            console.log('[OGARio by szymy] Generated client key:', _0x33ed6f);
            return _0x33ed6f;
        },
        'shiftKey': function (_0x3ba06a) {
            var _0x455c62 = 0x5bd1e995;
            _0x3ba06a = Math.imul(_0x3ba06a, _0x455c62) | 0x0;
            _0x3ba06a = (Math.imul(_0x3ba06a >>> 0x18 ^ _0x3ba06a, _0x455c62) | 0x0) ^ 0x6d00517;
            _0x3ba06a = Math.imul(_0x3ba06a >>> 0xd ^ _0x3ba06a, _0x455c62) | 0x0;
            return _0x3ba06a >>> 0xf ^ _0x3ba06a;
        },
        'shiftMessage': function (_0x1670f3, _0x5bf6f8, _0x3034b2) {
            if (!_0x3034b2) {
                for (var _0x58a2e5 = 0x0; _0x58a2e5 < _0x1670f3.byteLength; _0x58a2e5++) {
                    _0x1670f3.setUint8(_0x58a2e5, _0x1670f3.getUint8(_0x58a2e5) ^ _0x5bf6f8 >>> _0x58a2e5 % 0x4 * 0x8 & 0xff);
                }
            } else {
                for (var _0x58a2e5 = 0x0; _0x58a2e5 < _0x1670f3.length; _0x58a2e5++) {
                    _0x1670f3.writeUInt8(_0x1670f3.readUInt8(_0x58a2e5) ^ _0x5bf6f8 >>> _0x58a2e5 % 0x4 * 0x8 & 0xff, _0x58a2e5);
                }
            }
            return _0x1670f3;
        },
        'decompressMessage': function (_0xc4df2d) {
            var _0x20a553 = new Buffer(_0xc4df2d.buffer);
            var _0x2b7594 = new Buffer(_0x20a553.readUInt32LE(0x1));
            Lz4.decodeBlock(_0x20a553.slice(0x5), _0x2b7594);
            return _0x2b7594;
        },
        'handleMessage': function (packet) {
            var _0x90fcfe = function () {
                for (var _0x46ce01 = '';;) {
                    var _0x57f07a = packet.getUint8(offset++);
                    if (_0x57f07a == 0x0) {
                        break;
                    }
                    _0x46ce01 += String.fromCharCode(_0x57f07a);
                }
                return _0x46ce01;
            };
            var offset = 0x0;
            var _0x4499a3 = packet.getUint8(offset++);
            if (_0x4499a3 == 0x36) {
                _0x4499a3 = 0x35;
            }
            switch (_0x4499a3) {
            case 0x5:
                break;
            case 0x11:
                this.viewX = packet.getFloat32(offset, true);
                offset += 0x4;
                this.viewY = packet.getFloat32(offset, true);
                offset += 0x4;
                this.scale = packet.getFloat32(offset, true);
                break;
            case 0x12:
                if (this.protocolKey) {
                    this.protocolKey = this.shiftKey(this.protocolKey);
                }
                this.flushCellsData();
                break;
            case 0x20:
                this.playerCellIDs.push(packet.getUint32(offset, true));
                if (!this.play) {
                    this.play = true;
                    MapChatUiCtrl.hideMenu();
                    this.playerColor = null;
                    MapChatUiCtrl.onPlayerSpawn();
                }
                break;
            case 0x32:
                this.pieChart = [];
                var _0x207a3b = packet.getUint32(offset, true);
                offset += 0x4;
                for (var i = 0x0; i < _0x207a3b; i++) {
                    this.pieChart.push(packet.getFloat32(offset, true));
                    offset += 0x4;
                }
                WORLD.drawPieChart();
                break;
            case 0x35:
                this.leaderboard = [];
                this.playerPosition = 0x0;
                if (packet.getUint8(0x0) == 0x36) {
                    var _0x47ec47 = packet.getUint16(offset, true);
                    offset += 0x2;
                }
                for (var _0xd67982 = 0x0; offset < packet.byteLength;) {
                    var _0x4fc358 = packet.getUint8(offset++);
                    var _0x3c6e66 = '';
                    var _0x2ef933 = 0x0;
                    var _0xc80a8a = false;
                    _0xd67982++;
                    if (_0x4fc358 & 0x2) {
                        _0x3c6e66 = window.decodeURIComponent(window.escape(_0x90fcfe()));
                    }
                    if (_0x4fc358 & 0x4) {
                        _0x2ef933 = packet.getUint32(offset, true);
                        offset += 0x4;
                    }
                    if (_0x4fc358 & 0x8) {
                        _0x3c6e66 = this.playerNick;
                        _0x2ef933 = 'isPlayer';
                        this.playerPosition = _0xd67982;
                    }
                    if (_0x4fc358 & 0x10) {
                        _0xc80a8a = true;
                    }
                    this.leaderboard.push({
                        'nick': _0x3c6e66,
                        'id': _0x2ef933,
                        'isFriend': _0xc80a8a
                    });
                }
                this.handleLeaderboard();
                break;
            case 0x36:
                break;
            case 0x45:
                var length = packet.getUint16(offset, true);
                offset += 0x2;
                this.ghostCells = [];
                for(i = 0x0; i < length; i++) {
                    var _0x19c78e = packet.getInt32(offset, true);
                    offset += 0x4;
                    var _0x229ae7 = packet.getInt32(offset, true);
                    offset += 0x4;
                    var _0x4c1984 = packet.getUint32(offset, true);
                    offset += 0x5;
                    var _0x599a97 = ~~Math.sqrt(0x64 * _0x4c1984);
                    this.ghostCells.push({
                        'x': _0x19c78e,
                        'y': _0x229ae7,
                        'size': _0x599a97,
                        'mass': _0x4c1984,
                        'inView': this.isInView(_0x19c78e, _0x229ae7, _0x599a97)
                    });
                }
                break;
            case 0x55:
                console.log('[OGARio by szymy] Captcha requested');
                if (window.master && window.master.recaptchaRequested) {
                    window.master.recaptchaRequested();
                }
                break;
            case 0x66:
                if (packet.byteLength < 0x14) {
                    this.loggedIn = false;
                    window.logout && window.logout();
                }
                break;
            case 0x67:
                this.accessTokenSent = true;
                break;
            case 0x72:
                break;
            case 0xa1:
                break;
            case 0xb0:
                this.battleRoyale.startTime = packet.getUint32(offset, true);
                break;
            case 0xb1:
                this.battleRoyale.joined = true;
                break;
            case 0xb2:
                this.battleRoyale.players = packet.getUint16(offset, true);
                offset += 0x2;
                var _0x4fc358 = packet.getUint16(offset, true);
                offset += 0x2;
                if (!_0x4fc358) {
                    this.battleRoyale.state = 0x0;
                    this.battleRoyale.joined = false;
                }
                if (_0x4fc358 & 0x3) {
                    this.battleRoyale.state = packet.getUint8(offset++);
                    this.battleRoyale.x = packet.getInt32(offset, true);
                    offset += 0x4;
                    this.battleRoyale.y = packet.getInt32(offset, true);
                    offset += 0x4;
                    this.battleRoyale.radius = packet.getUint32(offset, true);
                    offset += 0x4;
                    this.battleRoyale.shrinkTime = packet.getUint32(offset, true) * 0x3e8;
                    offset += 0x4;
                    if (this.battleRoyale.shrinkTime) {
                        this.battleRoyale.timeLeft = ~~((this.battleRoyale.shrinkTime - Date.now() + this.serverTimeDiff) / 0x3e8);
                        if (this.battleRoyale.timeLeft < 0x0) {
                            this.battleRoyale.timeLeft = 0x0;
                        }
                    }
                }
                if (_0x4fc358 & 0x2) {
                    this.battleRoyale.targetX = packet.getInt32(offset, true);
                    offset += 0x4;
                    this.battleRoyale.targetY = packet.getInt32(offset, true);
                    offset += 0x4;
                    this.battleRoyale.targetRadius = packet.getUint32(offset, true);
                }
                break;
            case 0xb3:
                var _0x4fc358 = packet.getUint8(offset);
                var _0x197e8d = window.decodeURIComponent(window.escape(_0x90fcfe()));
                var _0x5d8894 = null;
                console.log('херня',_0x197e8d)
                if (!_0x4fc358) {
                    _0x5d8894 = window.decodeURIComponent(window.escape(_0x90fcfe()));
                }
                break;
            case 0xb4:
                this.battleRoyale.joined = false;
                this.battleRoyale.rank = [];
                this.battleRoyale.playerRank = packet.getUint32(offset, true);
                offset += 0x8;
                var _0x35d6c2 = packet.getUint16(offset, true);
                offset += 0x2;
                for (var i = 0x0; i < _0x35d6c2; i++) {
                    var _0x837be2 = window.decodeURIComponent(window.escape(_0x90fcfe()));
                    var _0x4517e7 = packet.getUint32(offset, true);
                    offset += 0x4;
                    this.battleRoyale.rank.push({
                        'place': _0x4517e7,
                        'name': _0x837be2
                    });
                }
                break;
            case 0xe2:
                var _0x7e77ef = packet.getUint16(0x1, true);
                packet = this.createView(0x3);
                packet.setUint8(0x0, 0xe3);
                packet.setUint16(0x1, _0x7e77ef);
                this.sendMessage(packet);
                break;
            case 0xf1:
                this.protocolKey = packet.getUint32(offset, true);
                console.log('[OGARio by szymy] Received protocol key:', this.protocolKey);
                var _0x2115f9 = new Uint8Array(packet.buffer, offset += 0x4);
                this.clientKey = this.generateClientKey(this.ws, _0x2115f9);
                if (window.master && window.master.login) {
                    window.master.login();
                }
                break;
            case 0xf2:
                this.serverTime = packet.getUint32(offset, true) * 0x3e8;
                this.serverTimeDiff = Date.now() - this.serverTime;
                break;
            case 0xff:
                this.handleSubmessage(packet);
                break;
            default:
                console.log('[OGARio by szymy] Unknown opcode:', packet.getUint8(0x0));
                break;
            }
        },
        'handleSubmessage': function (_0xa65164) {
            _0xa65164 = this.decompressMessage(_0xa65164);
            var _0x2b7c77 = 0x0;
            switch (_0xa65164.readUInt8(_0x2b7c77++)) {
            case 0x10:
                this.updateCells(_0xa65164, _0x2b7c77);
                break;
            case 0x40:
                this.viewMinX = _0xa65164.readDoubleLE(_0x2b7c77);
                _0x2b7c77 += 0x8;
                this.viewMinY = _0xa65164.readDoubleLE(_0x2b7c77);
                _0x2b7c77 += 0x8;
                this.viewMaxX = _0xa65164.readDoubleLE(_0x2b7c77);
                _0x2b7c77 += 0x8;
                this.viewMaxY = _0xa65164.readDoubleLE(_0x2b7c77);
                this.setMapOffset(this.viewMinX, this.viewMinY, this.viewMaxX, this.viewMaxY);;
                break;
            default:
                console.log('[OGARio by szymy] Unknown sub opcode:', _0xa65164.readUInt8(0x0));
                break;
            }
        },
        'handleLeaderboard': function () {
            var _0x2c32b8 = '';
            var _0x2d4d63 = '';
            for (var _0x1207f1 = 0x0; _0x1207f1 < this.leaderboard.length; _0x1207f1++) {
                if (_0x1207f1 == 0xa+5) {
                    break;
                }
                var _0x2d6a7c = '<span>';
                if (this.leaderboard[_0x1207f1].id === 'isPlayer') {
                    _0x2d6a7c = '<span class="me">';
                } else {
                    if (_0x4673ea.clanTag.length && this.leaderboard[_0x1207f1].nick.indexOf(_0x4673ea.clanTag) == 0x0) {
                        _0x2d6a7c = '<span class="teammate">';
                    }
                }
                _0x2c32b8 += _0x2d6a7c + (_0x1207f1 + 0x1) + '. ' + MapChatUiCtrl.escapeHTML(this.leaderboard[_0x1207f1].nick) + '</span>';
            }
            _0x2c32b8+='<span class="me">Total : '+this.leaderboard.length+'</span>'
            if (this.playerPosition > 0xa+5) {
                _0x2c32b8 += '<span class="me">' + this.playerPosition + '. ' + MapChatUiCtrl.escapeHTML(this.playerNick) + '</span>';
            }
            if (CLIENT_SETTINGS.showLbData) {
                for (var _0x5f223a = 0x0; _0x5f223a < this.ghostCells.length; _0x5f223a++) {
                    if (_0x5f223a == _0x1207f1) {
                        break;
                    }
                    _0x2d4d63 += '<span class="lb-data">';
                    _0x2d4d63 += '<span class=\"top5-mass-color\">[' + MapChatUiCtrl.shortMassFormat(this.ghostCells[_0x5f223a].mass) + ']</span>';
                    _0x2d4d63 += '</span>';
                }
            }
            MapChatUiCtrl.displayLeaderboard(_0x2c32b8, _0x2d4d63);
        },
        'flushCellsData': function () {
            this.indexedCells = {};
            this.cells = [];
            this.playerCells = [];
            this.playerCellIDs = [];
            this.ghostCells = [];
            this.food = [];
            this.viruses = [];
        },
        'setMapOffset': function (_0x5a3a71, _0x4ccbb5, _0x885947, _0x39808b) {
            if (_0x885947 - _0x5a3a71 > 0x36b0 && _0x39808b - _0x4ccbb5 > 0x36b0) {
                this.mapOffsetX = this.mapOffset - _0x885947;
                this.mapOffsetY = this.mapOffset - _0x39808b;
                this.mapMinX = ~~(-this.mapOffset - this.mapOffsetX);
                this.mapMinY = ~~(-this.mapOffset - this.mapOffsetY);
                this.mapMaxX = ~~(this.mapOffset - this.mapOffsetX);
                this.mapMaxY = ~~(this.mapOffset - this.mapOffsetY);
                if (!this.mapOffsetFixed) {
                    this.viewX = (_0x885947 + _0x5a3a71) / 0x2;
                    this.viewY = (_0x39808b + _0x4ccbb5) / 0x2;
                }
                this.mapOffsetFixed = true;
                console.log('[OGARio by szymy] Map offset fixed (x, y):', this.mapOffsetX, this.mapOffsetY);
            }
        },
        'isInView': function (_0x4a45a2, _0x379490, _0x5462b0) {
            var _0xaa164d = this.canvasWidth / 0x2 / this.scale;
            var _0x23a1e0 = this.canvasHeight / 0x2 / this.scale;
            if (_0x4a45a2 + _0x5462b0 < this.viewX - _0xaa164d || _0x379490 + _0x5462b0 < this.viewY - _0x23a1e0 || _0x4a45a2 - _0x5462b0 > this.viewX + _0xaa164d || _0x379490 - _0x5462b0 > this.viewY + _0x23a1e0) {
                return false;
            }
            return true;
        },
        'updateCells': function (_0x1b6ac5, _0x53b088) {
            var _0x6e3779 = function () {
                for (var _0x43f0fd = '';;) {
                    var _0xbc3ff3 = _0x1b6ac5.readUInt8(_0x53b088++);
                    if (_0xbc3ff3 == 0x0) {
                        break;
                    }
                    _0x43f0fd += String.fromCharCode(_0xbc3ff3);
                }
                return _0x43f0fd;
            };
            this.time = Date.now();
            this.removePlayerCell = false;
            var _0x44fd5e = _0x1b6ac5.readUInt16LE(_0x53b088);
            _0x53b088 += 0x2;
            for (var _0x3718a1 = 0x0; _0x3718a1 < _0x44fd5e; _0x3718a1++) {
                var _0x3326bd = this.indexedCells[_0x1b6ac5.readUInt32LE(_0x53b088)];
                var _0x47011d = this.indexedCells[_0x1b6ac5.readUInt32LE(_0x53b088 + 0x4)];
                _0x53b088 += 0x8;
                if (_0x3326bd && _0x47011d) {
                    _0x47011d.targetX = _0x3326bd.x;
                    _0x47011d.targetY = _0x3326bd.y;
                    _0x47011d.targetSize = _0x47011d.size;
                    _0x47011d.time = this.time;
                    _0x47011d.removeCell();
                }
            }
            for (_0x3718a1 = 0x0;;) {
                var _0x541cb8 = _0x1b6ac5.readUInt32LE(_0x53b088);
                _0x53b088 += 0x4;
                if (_0x541cb8 == 0x0) {
                    break;
                }
                var _0x248fe1 = _0x1b6ac5.readInt32LE(_0x53b088);
                _0x53b088 += 0x4;
                var _0x38b7a9 = _0x1b6ac5.readInt32LE(_0x53b088);
                _0x53b088 += 0x4;
                var _0x2c1f84 = _0x1b6ac5.readUInt16LE(_0x53b088);
                _0x53b088 += 0x2;
                var _0x235acc = _0x1b6ac5.readUInt8(_0x53b088++);
                var _0x5c1f18 = 0x0;
                if (_0x235acc & 0x80) {
                    _0x5c1f18 = _0x1b6ac5.readUInt8(_0x53b088++);
                }
                var _0x354d84 = null;
                var _0x41110e = null;
                var _0x373be4 = '';
                var _0x4a4a48 = null;
                if (_0x235acc & 0x2) {
                    var _0x3e4609 = _0x1b6ac5.readUInt8(_0x53b088++);
                    var _0xa4cbf1 = _0x1b6ac5.readUInt8(_0x53b088++);
                    var _0x2ae346 = _0x1b6ac5.readUInt8(_0x53b088++);
                    _0x354d84 = this.rgb2Hex(~~(_0x3e4609 * 0.9), ~~(_0xa4cbf1 * 0.9), ~~(_0x2ae346 * 0.9));
                }
                if (_0x235acc & 0x4) {
                    _0x41110e = _0x6e3779();
                }
                if (_0x235acc & 0x8) {
                    _0x373be4 = window.decodeURIComponent(window.escape(_0x6e3779()));
                }
                var _0x5bc3fd = _0x235acc & 0x1;
                var _0x4f4504 = _0x5c1f18 & 0x1;
                var _0x22d31a = null;
                if (this.indexedCells.hasOwnProperty(_0x541cb8)) {
                    _0x22d31a = this.indexedCells[_0x541cb8];
                    if (_0x354d84) {
                        _0x22d31a.color = _0x354d84;
                    }
                } else {
                    _0x22d31a = new cellObj(_0x541cb8, _0x248fe1, _0x38b7a9, _0x2c1f84, _0x354d84, _0x4f4504, _0x5bc3fd, false, CLIENT_SETTINGS.shortMass, CLIENT_SETTINGS.virMassShots);
                    _0x22d31a.time = this.time;
                    if (!_0x4f4504) {
                        if (_0x5bc3fd && CLIENT_SETTINGS.virusesRange) {
                            this.viruses.push(_0x22d31a);
                        }
                        this.cells.push(_0x22d31a);
                        if (this.playerCellIDs.indexOf(_0x541cb8) != -0x1 && this.playerCells.indexOf(_0x22d31a) == -0x1) {
                            _0x22d31a.isPlayerCell = true;
                            this.playerColor = _0x354d84;
                            this.playerCells.push(_0x22d31a);
                        }
                    } else {
                        this.food.push(_0x22d31a);
                    }
                    this.indexedCells[_0x541cb8] = _0x22d31a;
                }
                if (_0x22d31a.isPlayerCell) {
                    _0x373be4 = this.playerNick;
                }
                if (_0x373be4) {
                    _0x22d31a.targetNick = _0x373be4;
                }
                _0x22d31a.targetX = _0x248fe1;
                _0x22d31a.targetY = _0x38b7a9;
                _0x22d31a.targetSize = _0x2c1f84;
                _0x22d31a.isFood = _0x4f4504;
                _0x22d31a.isVirus = _0x5bc3fd;
                if (_0x41110e) {
                    _0x22d31a.skin = _0x41110e;
                }
                if (_0x5c1f18 & 0x4) {
                    _0x4a4a48 = _0x1b6ac5.readUInt32LE(_0x53b088);
                    _0x53b088 += 0x4;
                }
            }
            _0x44fd5e = _0x1b6ac5.readUInt16LE(_0x53b088);
            _0x53b088 += 0x2;
            for (_0x3718a1 = 0x0; _0x3718a1 < _0x44fd5e; _0x3718a1++) {
                var _0x541cb8 = _0x1b6ac5.readUInt32LE(_0x53b088);
                _0x53b088 += 0x4;
                _0x22d31a = this.indexedCells[_0x541cb8];
                if (_0x22d31a) {
                    _0x22d31a.removeCell();
                }
            }
            if (this.removePlayerCell && !this.playerCells.length) {
                this.play = false;
                MapChatUiCtrl.onPlayerDeath();
                //MapChatUiCtrl.showMenu(0x12c);
                //MapChatUiCtrl.pause=true

                //CLIENT.pause=true

                /*if(!CLIENT.isFreeSpectated) CLIENT.sendFreeSpectate()
                CLIENT.sendSpectate()
                this.resetTargetPosition()
                CLIENT.cursorX = CLIENT.targetX 
                CLIENT.cursorY = CLIENT.targetY*/
            }
        },
        'color2Hex': function (_0x3a96f3) {
            var _0x1e1c48 = _0x3a96f3.toString(0x10);
            return _0x1e1c48.length == 0x1 ? '0' + _0x1e1c48 : _0x1e1c48;
        },
        'rgb2Hex': function (_0x53f019, _0x22898c, _0x34d6da) {
            return '#' + this.color2Hex(_0x53f019) + this.color2Hex(_0x22898c) + this.color2Hex(_0x34d6da);
        },
        'sortCells': function () {
            this.cells.sort(function (_0x2c72fd, _0x3fd7f2) {
                return _0x2c72fd.size == _0x3fd7f2.size ? _0x2c72fd.id - _0x3fd7f2.id : _0x2c72fd.size - _0x3fd7f2.size;
            });
        },
        'calculatePlayerMassAndPosition': function () {
            var _0x40449a = 0x0;
            var _0x1b105e = 0x0;
            var _0x5c309f = 0x0;
            var _0xd75bfa = 0x0;
            var _0x5d19f7 = this.playerCells.length;
            for (var _0x7cbe6b = 0x0; _0x7cbe6b < _0x5d19f7; _0x7cbe6b++) {
                var _0x2a868c = this.playerCells[_0x7cbe6b];
                _0x40449a += _0x2a868c.size;
                _0x1b105e += _0x2a868c.targetSize * _0x2a868c.targetSize;
                _0x5c309f += _0x2a868c.x / _0x5d19f7;
                _0xd75bfa += _0x2a868c.y / _0x5d19f7;
            }
            this.viewX = _0x5c309f;
            this.viewY = _0xd75bfa;
            this.playerSize = _0x40449a;
            this.playerMass = ~~(_0x1b105e / 0x64);
            this.recalculatePlayerMass();
        },
        'recalculatePlayerMass': function () {
            this.playerScore = Math.max(this.playerScore, this.playerMass);
            if (CLIENT_SETTINGS.virColors || CLIENT_SETTINGS.splitRange || CLIENT_SETTINGS.oppColors || CLIENT_SETTINGS.oppRings || CLIENT_SETTINGS.showStatsSTE) {
                var _0x1191b0 = this.playerCells;
                var _0x3f8e46 = _0x1191b0.length;
                _0x1191b0.sort(function (_0x40e1f9, _0x2c6d80) {
                    return _0x40e1f9.size == _0x2c6d80.size ? _0x40e1f9.id - _0x2c6d80.id : _0x40e1f9.size - _0x2c6d80.size;
                });
                this.playerMinMass = ~~(_0x1191b0[0x0].size * _0x1191b0[0x0].size / 0x64);
                this.playerMaxMass = ~~(_0x1191b0[_0x3f8e46 - 0x1].size * _0x1191b0[_0x3f8e46 - 0x1].size / 0x64);
                this.playerSplitCells = _0x3f8e46;
            }
            if (CLIENT_SETTINGS.showStatsSTE) {
                var _0x3ee74b = this.selectBiggestCell ? this.playerMaxMass : this.playerMinMass;
                if (_0x3ee74b > 0x23) {
                    this.STE = ~~(_0x3ee74b * (_0x3ee74b < 0x3e8 ? 0.35 : 0.38));
                } else {
                    this.STE = null;
                }
            }
        },
        'compareCells': function () {
            if (!this.play) {
                return;
            }
            if (CLIENT_SETTINGS.oppColors || CLIENT_SETTINGS.oppRings || CLIENT_SETTINGS.splitRange) {
                if (CLIENT_SETTINGS.oppRings || CLIENT_SETTINGS.splitRange) {
                    this.biggerSTECellsCache = [];
                    this.biggerCellsCache = [];
                    this.smallerCellsCache = [];
                    this.STECellsCache = [];
                }
                for (var _0x329cf4 = 0x0; _0x329cf4 < this.cells.length; _0x329cf4++) {
                    var _0x242628 = this.cells[_0x329cf4];
                    if (_0x242628.isVirus) {
                        continue;
                    }
                    var _0xeaed35 = ~~(_0x242628.size * _0x242628.size / 0x64);
                    var _0x9c08f9 = this.selectBiggestCell ? this.playerMaxMass : this.playerMinMass;
                    var _0x5a15e3 = _0xeaed35 / _0x9c08f9;
                    var _0x4ab66f = _0x9c08f9 < 0x3e8 ? 0.35 : 0.38;
                    if (CLIENT_SETTINGS.oppColors && !CLIENT_SETTINGS.oppRings) {
                        _0x242628.oppColor = this.setCellOppColor(_0x242628.isPlayerCell, _0x5a15e3, _0x4ab66f);
                    }
                    if (!_0x242628.isPlayerCell && (CLIENT_SETTINGS.splitRange || CLIENT_SETTINGS.oppRings)) {
                        this.cacheCells(_0x242628.x, _0x242628.y, _0x242628.size, _0x5a15e3, _0x4ab66f);
                    }
                }
            }
        },
        'cacheCells': function (_0x44c70c, _0x1554b6, _0x50c569, _0x2c9502, _0x4426f5) {
            if (_0x2c9502 >= 2.5) {
                this.biggerSTECellsCache.push({
                    'x': _0x44c70c,
                    'y': _0x1554b6,
                    'size': _0x50c569
                });
                return;
            } else if (_0x2c9502 >= 1.25) {
                this.biggerCellsCache.push({
                    'x': _0x44c70c,
                    'y': _0x1554b6,
                    'size': _0x50c569
                });
                return;
            } else if (_0x2c9502 < 1.25 && _0x2c9502 > 0.75) {
                return;
            } else if (_0x2c9502 > _0x4426f5) {
                this.smallerCellsCache.push({
                    'x': _0x44c70c,
                    'y': _0x1554b6,
                    'size': _0x50c569
                });
                return;
            } else {
                this.STECellsCache.push({
                    'x': _0x44c70c,
                    'y': _0x1554b6,
                    'size': _0x50c569
                });
                return;
            }
        },
        'setCellOppColor': function (_0x4b9bff, _0x396ff1, _0x53b989) {
            if (_0x4b9bff) {
                return _0x4673ea.color;
            }
            if (_0x396ff1 > 0xb) {
                return '#FF008C';
            } else if (_0x396ff1 >= 2.5) {
                return '#BE00FF';
            } else if (_0x396ff1 >= 1.25) {
                return '#FF0A00';
            } else if (_0x396ff1 < 1.25 && _0x396ff1 > 0.75) {
                return '#FFDC00';
            } else if (_0x396ff1 > _0x53b989) {
                return '#00C8FF';
            } else {
                return '#64FF00';
            }
        },
        'getCursorPosition': function () {
            this.cursorX = (this.clientX - this.canvasWidth / 0x2) / this.viewScale + this.viewX;
            this.cursorY = (this.clientY - this.canvasHeight / 0x2) / this.viewScale + this.viewY;
        },
        'setZoom': function (_0x23554f) {
            _0x23554f.preventDefault();
            this.zoomValue *= Math.pow(CLIENT_SETTINGS.zoomSpeedValue, _0x23554f.wheelDelta / -0x78 || _0x23554f.detail || 0x0);
            if (this.zoomValue > 0x4 / this.viewScale) {
                this.zoomValue = 0x4 / this.viewScale;
            }
        },
        'setTargetPosition': function (_0x972a36, _0x125a36) {
            this.targetX = _0x972a36 - this.mapOffsetX;
            this.targetY = _0x125a36 - this.mapOffsetY;
            this.targetDistance = Math.round(Math.sqrt(Math.pow(this.playerX - this.targetX, 0x2) + Math.pow(this.playerY - this.targetY, 0x2)));
        },
        'resetTargetPosition': function () {
            this.targetX = this.playerX;
            this.targetY = this.playerY;
        },
        'setKeys': function () {
            var _0xafb071 = this;
            document.onkeydown = function (_0x1aa24f) {
                var _0x343da3 = _0x1aa24f.keyCode;
                if (_0xafb071.pressedKeys[_0x343da3]) {
                    return;
                }
                switch (_0x343da3) {
                case 0xd:
                    _0xafb071.sendNick('');
                    break;
                case 0x20:
                    _0xafb071.sendSplit();
                    break;
                case 0x51:
                    _0xafb071.sendFreeSpectate();
                    break;
                case 0x53:
                    _0xafb071.sendSpectate();
                    break;
                case 0x57:
                    _0xafb071.sendEject();
                    break;
                }
            };
            document.onkeyup = function (_0x186fb2) {
                _0xafb071.pressedKeys[_0x186fb2.keyCode] = false;
            };
        },
        'init': function () {
            var _0x3d9a8c = this;
            if (/firefox/i .test(navigator.userAgent)) {
                document.addEventListener('DOMMouseScroll', function (_0x3a2057) {
                    _0x3d9a8c.setZoom(_0x3a2057);
                }, false);
            } else {
                document.body.onmousewheel = function (_0x10ec03) {
                    _0x3d9a8c.setZoom(_0x10ec03);
                };
            }
            setInterval(function () {
                _0x3d9a8c.sendPosition();
            }, 0x28);
            if (window.master && window.master.clientVersion) {
                this.setClientVersion(window.master.clientVersion, window.master.clientVersionString);
            }
        }
    };
    window.sendAction = function (_0x4921f3) {
        CLIENT.sendAction(_0x4921f3);
    };





    window.addEventListener('mousedown',function(e){
        e.which == 1 ? (WORLD.LMB=true) : (WORLD.RMB=true)
        
    })
    window.addEventListener('mouseup',function(e){
        e.which == 1 ? (WORLD.LMB=false) : (WORLD.RMB=false)
    })





    var WORLD = window.ww = {
        'canvas': null,
        'ctx': null,
        'canvasWidth': 0x0,
        'canvasHeight': 0x0,
        'camX': 0x0,
        'camY': 0x0,
        'scale': 0x1,
        'fpsLastRequest': null,
        'renderedFrames': 0x0,
        'fps': 0x0,
        'pi2': 0x2 * Math.PI,
        'battleAreaMap': null,
        'battleAreaMapCtx': null,
        'pieChart': null,
        'pellet': null,
        'indicator': null,
        'setCanvas': function () {
            this.canvas = document.getElementById('canvas');
            //this.ctx = enableWebGLCanvas(this.canvas)
            //WebGL2D.enable(this.canvas);
            //this.ctx = this.canvas.getContext("webgl-2d");
            this.ctx = this.canvas.getContext('2d');
            this.canvas.onmousemove = function (_0x3c3b3b) {
                CLIENT.clientX = _0x3c3b3b.clientX;
                CLIENT.clientY = _0x3c3b3b.clientY;
                CLIENT.getCursorPosition();
            };
        },
        'resizeCanvas': function () {
            this.canvasWidth = window.innerWidth;
            this.canvasHeight = window.innerHeight;
            this.canvas.width = this.canvasWidth;
            this.canvas.height = this.canvasHeight;
            CLIENT.canvasWidth = this.canvasWidth;
            CLIENT.canvasHeight = this.canvasHeight;
            this.renderFrame();
        },
        'setView': function () {
            this.setScale();
            if (CLIENT.playerCells.length) {
                CLIENT.calculatePlayerMassAndPosition();
                this.camX = (this.camX + CLIENT.viewX) / 0x2;
                this.camY = (this.camY + CLIENT.viewY) / 0x2;
            } else {
                this.camX = (0x1d * this.camX + CLIENT.viewX) / 0x1e;
                this.camY = (0x1d * this.camY + CLIENT.viewY) / 0x1e;
            }
            CLIENT.playerX = this.camX;
            CLIENT.playerY = this.camY;
        },
        'setScale': function () {
            if (!CLIENT.autoZoom) {
                this.scale = (0x9 * this.scale + this.getZoom()) / 0xa;
                CLIENT.viewScale = this.scale;
                return;
            }
            if (CLIENT.play) {
                this.scale = (0x9 * this.scale + Math.pow(Math.min(0x40 / CLIENT.playerSize, 0x1), 0.4) * this.getZoom()) / 0xa;
            } else {
                this.scale = (0x9 * this.scale + CLIENT.scale * this.getZoom()) / 0xa;
            }
            CLIENT.viewScale = this.scale;
        },
        'getZoom': function () {
            return Math.max(this.canvasWidth / 0x438, this.canvasHeight / 0x780) * CLIENT.zoomValue;
        },
        'renderFrame': function () {
            //this.ctx.start2D();
            CLIENT.time = Date.now();
            for (i = 0x0; i < CLIENT.cells.length; i++) {
                CLIENT.cells[i].moveCell();
            }
            this.setView();
            CLIENT.getCursorPosition();
            CLIENT.sortCells();
            CLIENT.compareCells();
            this.ctx.clearRect(0x0, 0x0, this.canvasWidth, this.canvasHeight);
            if (CLIENT_SETTINGS.showGrid) {
                this.drawGrid(this.ctx, this.canvasWidth, this.canvasHeight, this.scale, this.camX, this.camY);
            }
            this.ctx.save();
            this.ctx.translate(this.canvasWidth / 0x2, this.canvasHeight / 0x2);
            this.ctx.scale(this.scale, this.scale);
            this.ctx.translate(-this.camX, -this.camY);
            if (CLIENT_SETTINGS.showBgSectors) {
                this.drawSectors(this.ctx, CLIENT.mapOffsetFixed, PRESET.sectorsX, PRESET.sectorsY, CLIENT.mapMinX, CLIENT.mapMinY, CLIENT.mapMaxX, CLIENT.mapMaxY, PRESET.gridColor, PRESET.sectorsColor, PRESET.sectorsWidth, true);
            }
            if (CLIENT.gameMode === ':battleroyale') {
                this.drawBattleArea(this.ctx);
            }
            if (CLIENT_SETTINGS.showMapBorders) {
                var _0x6993ee = PRESET.bordersWidth / 0x2;
                this.drawMapBorders(this.ctx, CLIENT.mapOffsetFixed, CLIENT.mapMinX - _0x6993ee, CLIENT.mapMinY - _0x6993ee, CLIENT.mapMaxX + _0x6993ee, CLIENT.mapMaxY + _0x6993ee, PRESET.bordersColor, PRESET.bordersWidth);
            }


            if (CLIENT_SETTINGS.virusesRange) {
                this.drawVirusesRange(this.ctx, CLIENT.viruses);
            }
            this.drawFood();
            if (CLIENT.play) {
                if (CLIENT_SETTINGS.splitRange) {
                    this.drawSplitRange(this.ctx, CLIENT.biggerSTECellsCache, CLIENT.playerCells, CLIENT.selectBiggestCell);
                }
                if (CLIENT_SETTINGS.oppRings) {
                    this.drawOppRings(this.ctx, this.scale, CLIENT.biggerSTECellsCache, CLIENT.biggerCellsCache, CLIENT.smallerCellsCache, CLIENT.STECellsCache);
                }
                if (CLIENT_SETTINGS.cursorTracking) {
                    this.drawCursorTracking(this.ctx, CLIENT.playerCells, CLIENT.cursorX, CLIENT.cursorY);
                }
            }

            this.drawGhostCells();
            
            for (var i = 0x0; i < CLIENT.removedCells.length; i++) {
                CLIENT.removedCells[i].draw(this.ctx, true);
            }


            CLIENT_SETTINGS.jellyPhisycs&&CLIENT.updateQuadtree(CLIENT.cells);//

            for (i = 0x0; i < CLIENT.cells.length; i++) {

                if(CLIENT_SETTINGS.jellyPhisycs){
                    CLIENT.cells[i].updateNumPoints();
                    CLIENT.cells[i].movePoints();
                }

                CLIENT.cells[i].draw(this.ctx);


                if(WORLD.LMB && this.pointInCircle(CLIENT.cursorX, CLIENT.cursorY, CLIENT.cells[i].x, CLIENT.cells[i].y, CLIENT.cells[i].size)){
                   CLIENT.selected = CLIENT.cells[i].id
                   //this.drawRing(this.ctx,CLIENT.cells[i].x,CLIENT.cells[i].y,CLIENT.cells[i].size,0.75,'#ffffff')
                }
            }
            CLIENT.indexedCells[CLIENT.selected] && this.drawRing(this.ctx,
                CLIENT.indexedCells[CLIENT.selected].x,
                CLIENT.indexedCells[CLIENT.selected].y,
                CLIENT.indexedCells[CLIENT.selected].size,
            0.75,'#ffffff')
            
            if(WORLD.RMB && CLIENT.indexedCells[CLIENT.selected] && CLIENT.playerCellIDs.length){
                var index = CLIENT.selectBiggestCell ? CLIENT.playerCells.length - 0x1 : 0x0;
                //ctx.arc(playerCells[index].x, playerCells[index].y, playerCells[index].size + 0x2f8, 0x0, this.pi2, false);
                if(CLIENT.playerCells[index] == undefined) return;
                var xc = CLIENT.playerCells[index].targetX//.x
                var yc = CLIENT.playerCells[index].targetY//.y
                
                var x = CLIENT.indexedCells[CLIENT.selected].targetX//.x
                var y = CLIENT.indexedCells[CLIENT.selected].targetY//.y
                
                var a = xc - x
                var b = yc - y
                var distance = Math.sqrt( a*a + b*b ) - (CLIENT.indexedCells[CLIENT.selected].size+CLIENT.playerCells[index].size)
                
                var ang = Math.atan2(y - yc, x - xc);
             
                CLIENT.cursorX= xc +(Math.cos(ang)*distance)
                CLIENT.cursorY= yc +(Math.sin(ang)*distance)
                CLIENT.sendPosition()
                //console.log(xc,yc,x,y,CLIENT.cursorX,CLIENT.cursorY)
                //Math.deg(ang)

                
                /*var xc = CLIENT.playerCells[index].x,
                    yc = CLIENT.playerCells[index].y,*/
                //R = 100000000,
                /*ang = Math.atan2(CLIENT.indexedCells[CLIENT.selected].y - yc, CLIENT.indexedCells[CLIENT.selected].x - xc);
                CLIENT.cursorX= Math.cos(ang)
                CLIENT.cursorY= Math.sin(ang)*/
                //Math.deg(ang)

                //CLIENT.cursorX = CLIENT.indexedCells[CLIENT.selected].x
                //CLIENT.cursorY = CLIENT.indexedCells[CLIENT.selected].y
            }


            this.ctx.restore();
            if (CLIENT.gameMode === ':teams') {
                if (this.pieChart && this.pieChart.width) {
                    this.ctx.drawImage(this.pieChart, this.canvasWidth - this.pieChart.width - 0xa, 0xa);
                }
            }
            //this.ctx.finish2D();
        },
        pointInCircle: function(x, y, cx, cy, radius) {
            var distancesquared = (x - cx) * (x - cx) + (y - cy) * (y - cy);
            return distancesquared <= radius * radius;
        },
        drawRing : function (ctx, x, y, size, alpha, color) {
            ctx.lineWidth = 20;
            ctx.globalAlpha = alpha;
            ctx.strokeStyle = color;
                ctx.beginPath();
                ctx.arc(x, y, size-10, 0x0, this.pi2, false);
                ctx.closePath();
                ctx.stroke();
            
            ctx.globalAlpha = 1;
        },
        'drawGrid': function (ctx, canvasWidth, canvasHeight, scale, camX, camY) {

            var _0x4b588a = canvasWidth / scale;
            var _0x33d6ad = canvasHeight / scale;
            var _0x453e98 = (-camX + _0x4b588a / 0x2) % 0x32;
            var _0x1d1ca9 = (-camY + _0x33d6ad / 0x2) % 0x32;
            ctx.strokeStyle = PRESET.gridColor;
            ctx.globalAlpha = 0x1 * scale;
            ctx.beginPath();
            for (; _0x453e98 < _0x4b588a; _0x453e98 += 0x32) {
                ctx.moveTo(_0x453e98 * scale - 0.5, 0x0);
                ctx.lineTo(_0x453e98 * scale - 0.5, _0x33d6ad * scale);
            }
            for (; _0x1d1ca9 < _0x33d6ad; _0x1d1ca9 += 0x32) {
                ctx.moveTo(0x0, _0x1d1ca9 * scale - 0.5);
                ctx.lineTo(_0x4b588a * scale, _0x1d1ca9 * scale - 0.5);
            }
            ctx.stroke();
            ctx.globalAlpha = 0x1;
        },
        'drawSectors': function (_0x74e095, _0x13ffb1, _0x20cda5, _0x47800e, _0x2118b8, _0x3606b6, _0x20d7d0, _0x588688, _0x5a3fda, _0x3b3b68, _0x17be3f, _0x52e4f4) {
            if (!_0x13ffb1 && _0x52e4f4) {
                return;
            }
            var _0x5be6b2 = ~~((_0x20d7d0 - _0x2118b8) / _0x20cda5);
            var _0xd17fa9 = ~~((_0x588688 - _0x3606b6) / _0x47800e);
            var _0x57d447 = 0x0;
            var _0x112082 = 0x0;
            _0x74e095.strokeStyle = _0x5a3fda;
            _0x74e095.fillStyle = _0x3b3b68;
            _0x74e095.lineWidth = _0x17be3f;
            if (_0x52e4f4 || !_0x52e4f4 && CLIENT_SETTINGS.showMiniMapGrid) {
                _0x74e095.beginPath();
                for (var _0x62d745 = 0x0; _0x62d745 < _0x20cda5 + 0x1; _0x62d745++) {
                    _0x57d447 = _0x2118b8 + _0x5be6b2 * _0x62d745;
                    _0x74e095.moveTo(_0x62d745 == _0x20cda5 ? _0x20d7d0 : _0x57d447, _0x3606b6);
                    _0x74e095.lineTo(_0x62d745 == _0x20cda5 ? _0x20d7d0 : _0x57d447, _0x588688);
                }
                for (var _0x62d745 = 0x0; _0x62d745 < _0x47800e + 0x1; _0x62d745++) {
                    _0x112082 = _0x3606b6 + _0xd17fa9 * _0x62d745;
                    _0x74e095.moveTo(_0x2118b8 - _0x17be3f / 0x2, _0x62d745 == _0x47800e ? _0x588688 : _0x112082);
                    _0x74e095.lineTo(_0x20d7d0 + _0x17be3f / 0x2, _0x62d745 == _0x47800e ? _0x588688 : _0x112082);
                }
                _0x74e095.stroke();
            } else {
                this.drawMapBorders(_0x74e095, _0x13ffb1, _0x2118b8, _0x3606b6, _0x20d7d0, _0x588688, _0x5a3fda, _0x17be3f);
            }
            if (_0x52e4f4) {
                _0x74e095.font = PRESET.sectorsFontWeight + ' ' + PRESET.sectorsFontSize + 'px ' + PRESET.sectorsFontFamily;
            } else {
                _0x74e095.font = PRESET.miniMapFontWeight + ' ' + ~~(0.4 * _0xd17fa9) + 'px ' + PRESET.miniMapFontFamily;
            }
            _0x74e095.textAlign = 'center';
            _0x74e095.textBaseline = 'middle';
            for (var _0x62d745 = 0x0; _0x62d745 < _0x47800e; _0x62d745++) {
                for (var _0x32b7fd = 0x0; _0x32b7fd < _0x20cda5; _0x32b7fd++) {
                    var _0x10a276 = String.fromCharCode(0x41 + _0x62d745) + (_0x32b7fd + 0x1);
                    _0x57d447 = ~~(_0x2118b8 + _0x5be6b2 / 0x2 + _0x32b7fd * _0x5be6b2);
                    _0x112082 = ~~(_0x3606b6 + _0xd17fa9 / 0x2 + _0x62d745 * _0xd17fa9);
                    _0x74e095.fillText(_0x10a276, _0x57d447, _0x112082);
                }
            }
        },
        'drawMapBorders': function (ctx_, _0x51973b, _0x2b09d1, _0x304c6b, _0x411507, _0x5b16fa, _0x4db9eb, _0x2bd2e) {
            if (!_0x51973b) {
                return;
            }
            //blurHERE
            ctx_.strokeStyle = _0x4db9eb;
            ctx_.lineWidth = _0x2bd2e;
            ctx_.shadowBlur = 25;//
            ctx_.shadowColor = bordersColor;//
            ctx_.beginPath();
            ctx_.moveTo(_0x2b09d1, _0x304c6b);
            ctx_.lineTo(_0x411507, _0x304c6b);
            ctx_.lineTo(_0x411507, _0x5b16fa);
            ctx_.lineTo(_0x2b09d1, _0x5b16fa);
            ctx_.closePath();
            ctx_.stroke();
            ctx_.shadowBlur = null;//
            ctx_.shadowColor = null;//
        },
        'drawVirusesRange': function (_0x22fef6, _0x2f1d7e, _0x38a5e7) {
            if (!_0x2f1d7e.length) {
                return;
            }
            _0x22fef6.beginPath();
            for (var _0x4b99eb = 0x0; _0x4b99eb < _0x2f1d7e.length; _0x4b99eb++) {
                var _0x156cb5 = _0x2f1d7e[_0x4b99eb].x;
                var _0x108b3c = _0x2f1d7e[_0x4b99eb].y;
                _0x22fef6.moveTo(_0x156cb5, _0x108b3c);
                _0x22fef6.arc(_0x156cb5, _0x108b3c, _0x2f1d7e[_0x4b99eb].size + 0x334, 0x0, this.pi2, false);
            }
            _0x22fef6.fillStyle = PRESET.virusColor;
            _0x22fef6.globalAlpha = 0.1;
            _0x22fef6.fill();
            _0x22fef6.globalAlpha = 0x1;
            if (_0x38a5e7) {
                _0x2f1d7e = [];
            }
        },
        'drawFood': function () {
            if (!CLIENT.showFood || CLIENT_SETTINGS.autoHideFoodOnZoom && this.scale < 0.2) {
                return;
            }
            if (CLIENT_SETTINGS.autoHideFood && !CLIENT.foodIsHidden && CLIENT.playerMass > 0x3e8) {
                CLIENT.showFood = false;
                CLIENT.foodIsHidden = true;
                return;
            }
            if (!CLIENT_SETTINGS.rainbowFood) {
                this.drawCachedFood(this.ctx, CLIENT.food, this.scale);
                return;
            }
            for (var _0x15d821 = 0x0; _0x15d821 < CLIENT.food.length; _0x15d821++) {
                CLIENT.food[_0x15d821].moveCell();
                CLIENT.food[_0x15d821].draw(this.ctx);
            }
        },
        'drawCachedFood': function (_0x5a96e4, _0x24c67c, _0x5c8e78, _0x319047) {
            if (!_0x24c67c.length) {
                return;
            }
            if (CLIENT_SETTINGS.optimizedFood && this.pellet) {
                for (var _0x5b852b = 0x0; _0x5b852b < _0x24c67c.length; _0x5b852b++) {
                    var _0x4a4a8d = _0x24c67c[_0x5b852b].x - 0xa - PRESET.foodSize;
                    var _0x568d3b = _0x24c67c[_0x5b852b].y - 0xa - PRESET.foodSize;
                    _0x5a96e4.drawImage(this.pellet, _0x4a4a8d, _0x568d3b);
                }
            } else {
                _0x5a96e4.beginPath();
                for (var _0x5b852b = 0x0; _0x5b852b < _0x24c67c.length; _0x5b852b++) {
                    var _0x4a4a8d = _0x24c67c[_0x5b852b].x;
                    var _0x568d3b = _0x24c67c[_0x5b852b].y;
                    _0x5a96e4.moveTo(_0x4a4a8d, _0x568d3b);
                    if (_0x5c8e78 < 0.16) {
                        var _0x383771 = _0x24c67c[_0x5b852b].size + PRESET.foodSize;
                        _0x5a96e4.rect(_0x4a4a8d - _0x383771, _0x568d3b - _0x383771, 0x2 * _0x383771, 0x2 * _0x383771);
                        continue;
                    }
                    _0x5a96e4.arc(_0x4a4a8d, _0x568d3b, _0x24c67c[_0x5b852b].size + PRESET.foodSize, 0x0, this.pi2, false);
                }
                _0x5a96e4.fillStyle = PRESET.foodColor;
                _0x5a96e4.globalAlpha = 0x1;
                _0x5a96e4.fill();
            }
            if (_0x319047) {
                _0x24c67c = [];
            }
        },
        'drawSplitRange': function (ctx, biggerSTECellsCache, playerCells, selectBiggestCell, _0x1d602d) {
            //CLIENT.biggerSTECellsCache, CLIENT.playerCells, CLIENT.selectBiggestCell
            this.drawCircles(ctx, biggerSTECellsCache, 0x2f8, 0x4, 0.4, '#BE00FF');
            if (playerCells.length) {
                var index = selectBiggestCell ? playerCells.length - 0x1 : 0x0;
                ctx.lineWidth = 0x6;
                ctx.globalAlpha = PRESET.darkTheme ? 0.7 : 0.35;
                ctx.strokeStyle = PRESET.splitRangeColor;
                ctx.beginPath();
                ctx.arc(playerCells[index].x, playerCells[index].y, playerCells[index].size + 0x2f8, 0x0, this.pi2, false);
                ctx.closePath();
                ctx.stroke();
            }
            ctx.globalAlpha = 0x1;
            if (_0x1d602d) {
                biggerSTECellsCache = [];
            }
        },
        'drawOppRings': function (ctx, scale, biggerSTECellsCache, biggerCellsCache, smallerCellsCache, STECellsCache, _0x7e78f8) {
            //this.ctx, this.scale, CLIENT.biggerSTECellsCache, CLIENT.biggerCellsCache, CLIENT.smallerCellsCache, CLIENT.STECellsCache
            var radStart = 14 + 2 / scale;
            var radEnd = 12 + 1 / scale;
            this.drawCircles(ctx, biggerSTECellsCache, radStart, radEnd, 0.75, '#BE00FF');
            this.drawCircles(ctx, biggerCellsCache, radStart, radEnd, 0.75, '#FF0A00');
            this.drawCircles(ctx, smallerCellsCache, radStart, radEnd, 0.75, '#00C8FF');
            this.drawCircles(ctx, STECellsCache, radStart, radEnd, 0.75, '#64FF00');
            if (_0x7e78f8) {
                biggerSTECellsCache = [];
                biggerCellsCache = [];
                smallerCellsCache = [];
                STECellsCache = [];
            }
        },
        'drawCursorTracking': function (_0x3d0712, _0x4e80cc, _0x467620, _0x385f7c) {
            _0x3d0712.lineWidth = 0x4;
            _0x3d0712.globalAlpha = PRESET.darkTheme ? 0.75 : 0.35;
            _0x3d0712.strokeStyle = PRESET.cursorTrackingColor;
            _0x3d0712.beginPath();
            for (var _0x37044b = 0x0; _0x37044b < _0x4e80cc.length; _0x37044b++) {
                _0x3d0712.moveTo(_0x4e80cc[_0x37044b].x, _0x4e80cc[_0x37044b].y);
                _0x3d0712.lineTo(_0x467620, _0x385f7c);
            }
            _0x3d0712.stroke();
            _0x3d0712.globalAlpha = 0x1;
        },
        'drawCircles': function (ctx, cells, val1, val2, alpha, color) {
            ctx.lineWidth = val2;
            ctx.globalAlpha = alpha;
            ctx.strokeStyle = color;
            for (var i = 0x0; i < cells.length; i++) {
                ctx.beginPath();
                ctx.arc(cells[i].x, cells[i].y, cells[i].size + val1, 0x0, this.pi2, false);
                ctx.closePath();
                ctx.stroke();
            }
            ctx.globalAlpha = 0x1;
        },
        'drawDashedCircle': function (_0x426858, _0x16622e, _0x290b0c, _0x1f6711, _0x258148, _0x276648, _0x5828b6) {
            var _0x3577d7 = this.pi2 / _0x258148;
            _0x426858.lineWidth = _0x276648;
            _0x426858.strokeStyle = _0x5828b6;
            for (var _0x52e3d6 = 0x0; _0x52e3d6 < _0x258148; _0x52e3d6 += 0x2) {
                _0x426858.beginPath();
                _0x426858.arc(_0x16622e, _0x290b0c, _0x1f6711 - _0x276648 / 0x2, _0x52e3d6 * _0x3577d7, (_0x52e3d6 + 0x1) * _0x3577d7, false);
                _0x426858.stroke();
            }
        },
        'drawTeammatesInd': function (_0x3a4623, _0x428df2, _0x20a76e, _0x4206ba) {
            if (!this.indicator) {
                return;
            }
            _0x3a4623.drawImage(this.indicator, _0x428df2 - 0x2d, _0x20a76e - _0x4206ba - 0x5a);
        },
        'drawPieChart': function () {
            if (!this.pieChart) {
                this.pieChart = document.createElement('canvas');
            }
            var _0x4621e1 = this.pieChart.getContext('2d');
            var _0x523501 = Math.min(0xc8, 0.3 * this.canvasWidth) / 0xc8;
            this.pieChart.width = 0xc8 * _0x523501;
            this.pieChart.height = 0xf0 * _0x523501;
            _0x4621e1.scale(_0x523501, _0x523501);
            var _0xadc286 = ['#333333', '#FF3333', '#33FF33', '#3333FF'];
            for (var _0x3988e4 = 0x0, _0x34e8bd = 0x0; _0x34e8bd < CLIENT.pieChart.length; _0x34e8bd++) {
                var _0x52674c = _0x3988e4 + CLIENT.pieChart[_0x34e8bd] * this.pi2;
                _0x4621e1.fillStyle = _0xadc286[_0x34e8bd + 0x1];
                _0x4621e1.beginPath();
                _0x4621e1.moveTo(0x64, 0x8c);
                _0x4621e1.arc(0x64, 0x8c, 0x50, _0x3988e4, _0x52674c, false);
                _0x4621e1.fill();
                _0x3988e4 = _0x52674c;
            }
        },
        'drawBattleArea': function (_0x2c395e) {
            if (!CLIENT.battleRoyale.state) {
                return;
            }
            this.drawDangerArea(_0x2c395e, CLIENT.battleRoyale.x, CLIENT.battleRoyale.y, CLIENT.battleRoyale.radius, CLIENT.mapMinX, CLIENT.mapMinY, CLIENT.mapMaxX - CLIENT.mapMinX, CLIENT.mapMaxY - CLIENT.mapMinY, PRESET.dangerAreaColor, 0.25);
            this.drawSafeArea(_0x2c395e, CLIENT.battleRoyale.targetX, CLIENT.battleRoyale.targetY, CLIENT.battleRoyale.targetRadius, 0x28, PRESET.safeAreaColor);
        },
        'drawBattleAreaOnMinimap': function (_0x10c30d, _0xd15ed0, _0x2ec3b3, _0x10259e, _0x5ab35c, _0x2c4dd5) {
            if (!CLIENT.battleRoyale.state) {
                return;
            }
            if (!this.battleAreaMap) {
                this.battleAreaMap = document.createElement('canvas');
                this.battleAreaMapCtx = this.battleAreaMap.getContext('2d');
            }
            if (this.battleAreaMap.width != _0xd15ed0) {
                this.battleAreaMap.width = _0xd15ed0;
                this.battleAreaMap.height = _0x2ec3b3;
            } else {
                this.battleAreaMapCtx.clearRect(0x0, 0x0, _0xd15ed0, _0x2ec3b3);
            }
            var _0x1a2502 = (CLIENT.battleRoyale.x + _0x5ab35c) * _0x10259e;
            var _0x3cdc6b = (CLIENT.battleRoyale.y + _0x2c4dd5) * _0x10259e;
            var _0x28b3fe = CLIENT.battleRoyale.radius * _0x10259e;
            this.drawDangerArea(this.battleAreaMapCtx, _0x1a2502, _0x3cdc6b, _0x28b3fe, 0x0, 0x0, _0xd15ed0, _0x2ec3b3, PRESET.dangerAreaColor, 0.25);
            _0x1a2502 = ~~((CLIENT.battleRoyale.targetX + _0x5ab35c) * _0x10259e);
            _0x3cdc6b = ~~((CLIENT.battleRoyale.targetY + _0x2c4dd5) * _0x10259e);
            _0x28b3fe = ~~(CLIENT.battleRoyale.targetRadius * _0x10259e);
            this.drawSafeArea(this.battleAreaMapCtx, _0x1a2502, _0x3cdc6b, _0x28b3fe, 0x2, PRESET.safeAreaColor);
            _0x10c30d.drawImage(this.battleAreaMap, 0x0, 0x0);
        },
        'drawDangerArea': function (_0x5c9fd8, _0x1b1c30, _0x201443, _0x168af6, _0x456c4a, _0x1d056b, _0x457f2e, _0x3f9277, _0x2ccba4, _0x333b9e) {
            if (CLIENT.battleRoyale.radius == CLIENT.battleRoyale.maxRadius || _0x168af6 <= 0x0) {
                return;
            }
            _0x5c9fd8.save();
            _0x5c9fd8.globalAlpha = _0x333b9e;
            _0x5c9fd8.fillStyle = _0x2ccba4;
            _0x5c9fd8.fillRect(_0x456c4a, _0x1d056b, _0x457f2e, _0x3f9277);
            _0x5c9fd8.globalCompositeOperation = 'destination-out';
            _0x5c9fd8.globalAlpha = 0x1;
            _0x5c9fd8.beginPath();
            _0x5c9fd8.arc(_0x1b1c30, _0x201443, _0x168af6, 0x0, this.pi2, false);
            _0x5c9fd8.fill();
            _0x5c9fd8.restore();
        },
        'drawSafeArea': function (_0x368724, _0x15073a, _0x84d2c7, _0x3e6d00, _0x1b38d5, _0xd230cd) {
            if (CLIENT.battleRoyale.state > 0x2 || _0x3e6d00 <= 0x0) {
                return;
            }
            this.drawDashedCircle(_0x368724, _0x15073a, _0x84d2c7, _0x3e6d00, 0x3c, _0x1b38d5, _0xd230cd);
        },
        'drawGhostCells': function () {
            if (!CLIENT_SETTINGS.showGhostCells) {
                return;
            }
            var _0x2fcdfb = CLIENT.ghostCells;
            this.ctx.beginPath();
            for (var _0xd73de2 = 0x0; _0xd73de2 < _0x2fcdfb.length; _0xd73de2++) {
                if (_0x2fcdfb[_0xd73de2].inView) {
                    continue;
                }
                var _0x4cf1f4 = _0x2fcdfb[_0xd73de2].x;
                var _0x2d5dfb = _0x2fcdfb[_0xd73de2].y;
                this.ctx.moveTo(_0x4cf1f4, _0x2d5dfb);
                this.ctx.arc(_0x4cf1f4, _0x2d5dfb, _0x2fcdfb[_0xd73de2].size, 0x0, this.pi2, false);
            }
            this.ctx.fillStyle = PRESET.ghostCellsColor;
            this.ctx.globalAlpha = PRESET.ghostCellsAlpha;
            this.ctx.shadowColor = PRESET.ghostCellsColor;
            this.ctx.shadowBlur = 0x28;
            this.ctx.shadowOffsetX = 0x0;
            this.ctx.shadowOffsetY = 0x0;
            this.ctx.fill();
            this.ctx.globalAlpha = 0x1;
            this.ctx.shadowBlur = 0x0;
        },
        'preDrawPellet': function () {
            this.pellet = null;
            var _0x1502c1 = 0xa + PRESET.foodSize;
            var _0x4ac3c0 = document.createElement('canvas');
            _0x4ac3c0.width = _0x1502c1 * 0x2;
            _0x4ac3c0.height = _0x1502c1 * 0x2;
            var _0x500fcb = _0x4ac3c0.getContext('2d');
            _0x500fcb.arc(_0x1502c1, _0x1502c1, _0x1502c1, 0x0, this.pi2, false);
            _0x500fcb.fillStyle = PRESET.foodColor;
            _0x500fcb.fill();
            this.pellet = new Image();
            this.pellet.src = _0x4ac3c0.toDataURL();
            _0x4ac3c0 = null;
        },
        'preDrawIndicator': function () {
            this.indicator = null;
            var _0x5552e8 = document.createElement('canvas');
            _0x5552e8.width = 0x5a;
            _0x5552e8.height = 0x32;
            var _0x460eac = _0x5552e8.getContext('2d');
            _0x460eac.lineWidth = 0x2;
            _0x460eac.fillStyle = PRESET.teammatesIndColor;
            _0x460eac.strokeStyle = '#000000';
            _0x460eac.beginPath();
            _0x460eac.moveTo(0x0, 0x0);
            _0x460eac.lineTo(0x5a, 0x0);
            _0x460eac.lineTo(0x2d, 0x32);
            _0x460eac.closePath();
            _0x460eac.fill();
            _0x460eac.stroke();
            this.indicator = new Image();
            this.indicator.src = _0x5552e8.toDataURL();
            _0x5552e8 = null;
        },
        'countFps': function () {
            if (!CLIENT_SETTINGS.showStatsFPS) {
                return;
            }
            var _0x371d18 = Date.now();
            if (!this.fpsLastRequest) {
                this.fpsLastRequest = _0x371d18;
            }
            if (_0x371d18 - this.fpsLastRequest >= 0x3e8) {
                this.fps = this.renderedFrames;
                this.renderedFrames = 0x0;
                this.fpsLastRequest = _0x371d18;
            }
            this.renderedFrames++;
        },
        'render': function () {
            WORLD.countFps();
            WORLD.renderFrame();
            window.requestAnimationFrame(WORLD.render);
        },
        'init': function () {
            this.setCanvas();
            this.resizeCanvas();
            this.preDrawPellet();
            this.preDrawIndicator();
            window.requestAnimationFrame(WORLD.render);
        }
    };
    var _0x294431 = {};
    var _0x3d775c = {};
    var _0x4eafd6 = {
        'hk-feed': {
            'label': i18n['hk-feed'],
            'defaultKey': 'W',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.feed();
            },
            'keyUp': null,
            'type': 'normal'
        },
        'hk-macroFeed': {
            'label': i18n['hk-macroFeed'],
            'defaultKey': 'E',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.macroFeed(true);
            },
            'keyUp': function () {
                MapChatUiCtrl && MapChatUiCtrl.macroFeed(false);
            },
            'type': 'normal'
        },
        'hk-split': {
            'label': i18n['hk-split'],
            'defaultKey': 'SPACE',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.split();
            },
            'keyUp': null,
            'type': 'normal'
        },
        'hk-doubleSplit': {
            'label': i18n['hk-doubleSplit'],
            'defaultKey': 'Q',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.doubleSplit();
            },
            'keyUp': null,
            'type': 'normal'
        },
        'hk-popSplit': {
            'label': 'Popsplit',
            'defaultKey': 'ALT+Q',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.popSplit();
            },
            'keyUp': null,
            'type': 'normal'
        },
        'hk-split16': {
            'label': i18n['hk-split16'],
            'defaultKey': 'SHIFT',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.split16();
            },
            'keyUp': null,
            'type': 'normal'
        },
        'hk-pause': {
            'label': i18n['hk-pause'],
            'defaultKey': 'R',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.setPause();
            },
            'keyUp': null,
            'type': 'normal'
        },
        'hk-showTop5': {
            'label': i18n['hk-showTop5'],
            'defaultKey': 'T',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.setShowTop5();
            },
            'keyUp': null,
            'type': 'normal'
        },
        'hk-showTime': {
            'label': i18n['hk-showTime'],
            'defaultKey': 'ALT+T',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.setShowTime();
            },
            'keyUp': null,
            'type': 'normal'
        },
        'hk-showSplitRange': {
            'label': i18n['hk-showSplitRange'],
            'defaultKey': 'U',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.setShowSplitRange();
            },
            'keyUp': null,
            'type': 'normal'
        },
        'hk-showSplitInd': {
            'label': i18n['hk-showSplitInd'],
            'defaultKey': 'I',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.setShowSplitInd();
            },
            'keyUp': null,
            'type': 'normal'
        },
        'hk-showTeammatesInd': {
            'label': i18n['hk-showTeammatesInd'],
            'defaultKey': 'ALT+I',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.setShowTeammatesInd();
            },
            'keyUp': null,
            'type': 'normal'
        },
        'hk-showOppColors': {
            'label': i18n['hk-showOppColors'],
            'defaultKey': 'O',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.setShowOppColors();
            },
            'keyUp': null,
            'type': 'normal'
        },
        'hk-toggleSkins': {
            'label': i18n['hk-toggleSkins'],
            'defaultKey': 'A',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.toggleSkins();
            },
            'keyUp': null,
            'type': 'normal'
        },
        'hk-transparentSkins': {
            'label': i18n['hk-transparentSkins'],
            'defaultKey': '',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.setTransparentSkins();
            },
            'keyUp': null,
            'type': 'normal'
        },
        'hk-showSkins': {
            'label': i18n['hk-showSkins'],
            'defaultKey': 'S',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.setShowSkins();
            },
            'keyUp': null,
            'type': 'normal'
        },
        'hk-showStats': {
            'label': i18n['hk-showStats'],
            'defaultKey': 'ALT+S',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.setShowStats();
            },
            'keyUp': null,
            'type': 'normal'
        },
        'hk-toggleCells': {
            'label': i18n['hk-toggleCells'],
            'defaultKey': 'D',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.toggleCells();
            },
            'keyUp': null,
            'type': 'normal'
        },
        'hk-showFood': {
            'label': i18n['hk-showFood'],
            'defaultKey': 'F',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.setShowFood();
            },
            'keyUp': null,
            'type': 'normal'
        },
        'hk-showGrid': {
            'label': i18n['hk-showGrid'],
            'defaultKey': 'G',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.setShowGrid();
            },
            'keyUp': null,
            'type': 'normal'
        },
        'hk-showMiniMapGuides': {
            'label': i18n['hk-showMiniMapGuides'],
            'defaultKey': 'ALT+G',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.setShowMiniMapGuides();
            },
            'keyUp': null,
            'type': 'normal'
        },
        'hk-hideChat': {
            'label': i18n['hk-hideChat'],
            'defaultKey': 'H',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.hideChat();
            },
            'keyUp': null,
            'type': 'normal'
        },
        'hk-showHUD': {
            'label': i18n['hk-showHUD'],
            'defaultKey': 'ALT+H',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.setShowHUD();
            },
            'keyUp': null,
            'type': 'normal'
        },
        'hk-copyLb': {
            'label': i18n['hk-copyLb'],
            'defaultKey': 'L',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.copyLb();
            },
            'keyUp': null,
            'type': 'normal'
        },
        'hk-showLb': {
            'label': i18n['hk-showLb'],
            'defaultKey': 'ALT+L',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.setShowLb();
            },
            'keyUp': null,
            'type': 'normal'
        },
        'hk-toggleAutoZoom': {
            'label': i18n['hk-toggleAutoZoom'],
            'defaultKey': '',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.toggleAutoZoom();
            },
            'keyUp': null,
            'type': 'normal'
        },
        'hk-resetZoom': {
            'label': i18n['hk-resetZoom'],
            'defaultKey': 'Z',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.resetZoom(true);
            },
            'keyUp': function () {
                MapChatUiCtrl && MapChatUiCtrl.resetZoom(false);
            },
            'type': 'normal'
        },
        'hk-toggleDeath': {
            'label': i18n['hk-toggleDeath'],
            'defaultKey': 'X',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.toggleDeath();
            },
            'keyUp': null,
            'type': 'normal'
        },
        'hk-clearChat': {
            'label': i18n['hk-clearChat'],
            'defaultKey': 'C',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.displayChatHistory(true);
            },
            'keyUp': function () {
                MapChatUiCtrl && MapChatUiCtrl.displayChatHistory(false);
            },
            'type': 'normal'
        },
        'hk-showBgSectors': {
            'label': i18n['hk-showBgSectors'],
            'defaultKey': 'B',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.setShowBgSectors();
            },
            'keyUp': null,
            'type': 'normal'
        },
        'hk-hideBots': {
            'label': i18n['hk-hideBots'],
            'defaultKey': 'ALT+B',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.setHideSmallBots();
            },
            'keyUp': null,
            'type': 'normal'
        },
        'hk-showNames': {
            'label': i18n['hk-showNames'],
            'defaultKey': 'N',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.setShowNames();
            },
            'keyUp': null,
            'type': 'normal'
        },
        'hk-hideTeammatesNames': {
            'label': i18n['hk-hideTeammatesNames'],
            'defaultKey': '',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.setHideTeammatesNames();
            },
            'keyUp': null,
            'type': 'normal'
        },
        'hk-showMass': {
            'label': i18n['hk-showMass'],
            'defaultKey': 'M',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.setShowMass();
            },
            'keyUp': null,
            'type': 'normal'
        },
        'hk-showMiniMap': {
            'label': i18n['hk-showMiniMap'],
            'defaultKey': 'ALT+M',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.setShowMiniMap();
            },
            'keyUp': null,
            'type': 'normal'
        },
        'hk-chatMessage': {
            'label': i18n['hk-chatMessage'],
            'defaultKey': 'ENTER',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.enterChatMessage();
            },
            'keyUp': null,
            'type': 'special'
        },
        'hk-quickResp': {
            'label': i18n['hk-quickResp'],
            'defaultKey': 'TILDE',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.quickResp();
            },
            'keyUp': null,
            'type': 'normal'
        },
        'hk-autoResp': {
            'label': i18n['hk-autoResp'],
            'defaultKey': '',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.toggleAutoResp();
            },
            'keyUp': null,
            'type': 'normal'
        },
        'hk-zoom1': {
            'label': i18n['hk-zoomLevel'] + ' 1',
            'defaultKey': 'ALT+1',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.setZoom(0.5);
            },
            'keyUp': null,
            'type': 'normal'
        },
        'hk-zoom2': {
            'label': i18n['hk-zoomLevel'] + ' 2',
            'defaultKey': 'ALT+2',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.setZoom(0.25);
            },
            'keyUp': null,
            'type': 'normal'
        },
        'hk-zoom3': {
            'label': i18n['hk-zoomLevel'] + ' 3',
            'defaultKey': 'ALT+3',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.setZoom(0.125);
            },
            'keyUp': null,
            'type': 'normal'
        },
        'hk-zoom4': {
            'label': i18n['hk-zoomLevel'] + ' 4',
            'defaultKey': 'ALT+4',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.setZoom(0.075);
            },
            'keyUp': null,
            'type': 'normal'
        },
        'hk-zoom5': {
            'label': i18n['hk-zoomLevel'] + ' 5',
            'defaultKey': 'ALT+5',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.setZoom(0.05);
            },
            'keyUp': null,
            'type': 'normal'
        },
        'hk-switchServerMode': {
            'label': i18n['hk-switchServerMode'],
            'defaultKey': '=',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.switchServerMode();
            },
            'keyUp': null,
            'type': 'normal'
        },
        'hk-showTargeting': {
            'label': i18n['hk-showTargeting'],
            'defaultKey': '',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.setShowTargeting();
            },
            'keyUp': null,
            'type': 'normal'
        },
        'hk-setTargeting': {
            'label': i18n['hk-setTargeting'],
            'defaultKey': '',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.setTargeting();
            },
            'keyUp': null,
            'type': 'normal'
        },
        'hk-cancelTargeting': {
            'label': i18n['hk-cancelTargeting'],
            'defaultKey': '',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.cancelTargeting();
            },
            'keyUp': null,
            'type': 'normal'
        },
        'hk-changeTarget': {
            'label': i18n['hk-changeTarget'],
            'defaultKey': '',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.changeTarget();
            },
            'keyUp': null,
            'type': 'normal'
        },
        'hk-privateMiniMap': {
            'label': i18n['hk-privateMiniMap'],
            'defaultKey': '',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.setPrivateMiniMap();
            },
            'keyUp': null,
            'type': 'normal'
        },
        'hk-showQuest': {
            'label': i18n['hk-showQuest'],
            'defaultKey': '',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.setShowQuest();
            },
            'keyUp': null,
            'type': 'normal'
        },
        'hk-comm1': {
            'label': _0x23cf50.comm1,
            'defaultKey': '1',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.sendCommand(0x1);
            },
            'keyUp': null,
            'type': 'command'
        },
        'hk-comm2': {
            'label': _0x23cf50.comm2,
            'defaultKey': '2',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.sendCommand(0x2);
            },
            'keyUp': null,
            'type': 'command'
        },
        'hk-comm3': {
            'label': _0x23cf50.comm3,
            'defaultKey': '3',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.sendCommand(0x3);
            },
            'keyUp': null,
            'type': 'command'
        },
        'hk-comm4': {
            'label': _0x23cf50.comm4,
            'defaultKey': '4',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.sendCommand(0x4);
            },
            'keyUp': null,
            'type': 'command'
        },
        'hk-comm5': {
            'label': _0x23cf50.comm5,
            'defaultKey': '5',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.sendCommand(0x5);
            },
            'keyUp': null,
            'type': 'command'
        },
        'hk-comm6': {
            'label': _0x23cf50.comm6,
            'defaultKey': '6',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.sendCommand(0x6);
            },
            'keyUp': null,
            'type': 'command'
        },
        'hk-comm7': {
            'label': _0x23cf50.comm7,
            'defaultKey': '7',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.sendCommand(0x7);
            },
            'keyUp': null,
            'type': 'command'
        },
        'hk-comm8': {
            'label': _0x23cf50.comm8,
            'defaultKey': '8',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.sendCommand(0x8);
            },
            'keyUp': null,
            'type': 'command'
        },
        'hk-comm9': {
            'label': _0x23cf50.comm9,
            'defaultKey': '9',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.sendCommand(0x9);
            },
            'keyUp': null,
            'type': 'command'
        },
        'hk-comm0': {
            'label': _0x23cf50.comm0,
            'defaultKey': '0',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.sendCommand(0x0);
            },
            'keyUp': null,
            'type': 'command'
        },
        'hk-comm10': {
            'label': _0x23cf50.comm10,
            'defaultKey': 'MOUSE WHEEL',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.sendCommand(0xa);
            },
            'keyUp': null,
            'type': 'command'
        },
        'hk-comm11': {
            'label': _0x23cf50.comm11,
            'defaultKey': 'LEFT',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.sendCommand(0xb);
            },
            'keyUp': null,
            'type': 'command'
        },
        'hk-comm12': {
            'label': _0x23cf50.comm12,
            'defaultKey': 'UP',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.sendCommand(0xc);
            },
            'keyUp': null,
            'type': 'command'
        },
        'hk-comm13': {
            'label': _0x23cf50.comm13,
            'defaultKey': 'RIGHT',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.sendCommand(0xd);
            },
            'keyUp': null,
            'type': 'command'
        },
        'hk-comm14': {
            'label': _0x23cf50.comm14,
            'defaultKey': 'DOWN',
            'keyDown': function () {
                MapChatUiCtrl && MapChatUiCtrl.sendCommand(0xe);
            },
            'keyUp': null,
            'type': 'command'
        }
    };
    var CONTROLS = {
        'lastPressedKey': '',
        'lastKeyId': '',
        'defaultMessageKey': 'ENTER',
        'inputClassName': 'custom-key-in form-control input-sm',
        'loadDefaultHotkeys': function () {
            _0x3d775c = {};
            for (var _0x1b67e1 in _0x4eafd6) {
                if (_0x4eafd6.hasOwnProperty(_0x1b67e1)) {
                    _0x3d775c[_0x4eafd6[_0x1b67e1].defaultKey] = _0x1b67e1;
                }
            }
            _0x3d775c['spec-messageKey'] = this.defaultMessageKey;
        },
        'loadHotkeys': function () {
            if (window.localStorage.getItem('ogarioHotkeys') !== null) {
                _0x3d775c = JSON.parse(window.localStorage.getItem('ogarioHotkeys'));
            } else {
                this.loadDefaultHotkeys();
            }
            if (window.localStorage.getItem('ogarioCommands') !== null) {
                _0x23cf50 = JSON.parse(window.localStorage.getItem('ogarioCommands'));
            }
        },
        'saveHotkeys': function () {
            window.localStorage.setItem('ogarioHotkeys', JSON.stringify(_0x3d775c));
            this.saveCommands();
        },
        'saveCommands': function () {
            $('#hotkeys .command-in').each(function () {
                var _0x3afd48 = $(this);
                var _0x1d47ce = _0x3afd48.attr('id');
                if (_0x23cf50.hasOwnProperty(_0x1d47ce)) {
                    _0x23cf50[_0x1d47ce] = _0x3afd48.val();
                }
            });
            window.localStorage.setItem('ogarioCommands', JSON.stringify(_0x23cf50));
        },
        'resetHotkeys': function () {
            this.loadDefaultHotkeys();
            $('#hotkeys-cfg .custom-key-in').each(function () {
                var _0xade505 = $(this).attr('id');
                if (_0x4eafd6[_0xade505]) {
                    $(this).val(_0x4eafd6[_0xade505].defaultKey);
                }
            });
        },
        'setHotkeysMenu': function () {
            var _0x4be8ca = this;
            $('body').append('<div id=\"hotkeys\"><div id=\"hotkeys-menu\"><button id=\"reset-hotkeys\" class=\"btn btn-primary\">' + i18n.restoreSettings + '</button> <button id="save-hotkeys" class="btn btn-success">' + i18n.saveSett + '</button> <button id="close-hotkeys" class="btn btn-danger">' + i18n.close + '</button></div><div id="hotkeys-cfg"></div><div id="hotkeys-inst"><ul><li>' + i18n['hk-inst-assign'] + '</li><li>' + i18n['hk-inst-delete'] + '</li><li>' + i18n['hk-inst-keys'] + '</li></ul></div></div>');
            for (var _0x42317e in _0x4eafd6) {
                if (_0x4eafd6.hasOwnProperty(_0x42317e)) {
                    var _0x2e1d52 = _0x4eafd6[_0x42317e];
                    var _0x3a7196 = '';
                    for (var _0x400839 in _0x3d775c) {
                        if (_0x3d775c.hasOwnProperty(_0x400839) && _0x3d775c[_0x400839] === _0x42317e) {
                            _0x3a7196 = _0x400839;
                            break;
                        }
                    }
                    if (_0x42317e === 'hk-switchServerMode' && MapChatUiCtrl && !MapChatUiCtrl.privateIP) {
                        continue;
                    }
                    if (_0x2e1d52.type === 'command') {
                        var _0x47037a = _0x42317e.replace('hk-', '');
                        $('#hotkeys-cfg').append('<div class=\"row\"><div class=\"key-label\"><input id=\"' + _0x47037a + '" class="command-in form-control input-sm" value="' + _0x23cf50[_0x47037a] + '" maxlength="80" /></div><div class="default-key">' + _0x2e1d52.defaultKey + '</div><div class="custom-key"><input id="' + _0x42317e + '" class="custom-key-in form-control input-sm" value="' + _0x3a7196 + '" /></div></div>');
                    } else {
                        $('#hotkeys-cfg').append('<div class="row"><div class="key-label">' + _0x2e1d52.label + '</div><div class=\"default-key\">' + _0x2e1d52.defaultKey + '</div><div class="custom-key"><input id="' + _0x42317e + '" class="custom-key-in form-control input-sm" value="' + _0x3a7196 + '\" /></div></div>');
                    }
                }
            }
            $(document).on('click', '#reset-hotkeys', function (_0x599ac6) {
                _0x599ac6.preventDefault();
                _0x4be8ca.resetHotkeys();
            });
            $(document).on('click', '#save-hotkeys', function (_0x5d1604) {
                _0x5d1604.preventDefault();
                _0x4be8ca.saveHotkeys();
                $('#hotkeys').fadeOut(0x1f4);
            });
            $(document).on('click', '#close-hotkeys', function (_0x1a9896) {
                _0x1a9896.preventDefault();
                $('#hotkeys').fadeOut(0x1f4);
            });
            $(document).on('click', '.hotkeys-link', function (_0x118f6a) {
                $('#hotkeys').fadeIn(0x1f4);
                $('#hotkeys-cfg').perfectScrollbar('update');
                _0x17698d();
            });
            $('#hotkeys-cfg').perfectScrollbar();
            INTERFACE_HELPER && INTERFACE_HELPER.setMenuBg();
        },
        'getPressedKey': function (_0x5bd795) {
            var _0x41ef8c = '';
            var _0x2d4817 = '';
            if (_0x5bd795.ctrlKey || _0x5bd795.keyCode == 0x11) {
                _0x41ef8c = 'CTRL';
            } else if (_0x5bd795.altKey || _0x5bd795.keyCode == 0x12) {
                _0x41ef8c = 'ALT';
            }
            switch (_0x5bd795.keyCode) {
            case 0x9:
                _0x2d4817 = 'TAB';
                break;
            case 0xd:
                _0x2d4817 = 'ENTER';
                break;
            case 0x10:
                _0x2d4817 = 'SHIFT';
                break;
            case 0x11:
                break;
            case 0x12:
                break;
            case 0x1b:
                _0x2d4817 = 'ESC';
                break;
            case 0x20:
                _0x2d4817 = 'SPACE';
                break;
            case 0x25:
                _0x2d4817 = 'LEFT';
                break;
            case 0x26:
                _0x2d4817 = 'UP';
                break;
            case 0x27:
                _0x2d4817 = 'RIGHT';
                break;
            case 0x28:
                _0x2d4817 = 'DOWN';
                break;
            case 0x2e:
                _0x2d4817 = 'DEL';
                break;
            case 0x3d:
                _0x2d4817 = '=';
                break;
            case 0xbb:
                _0x2d4817 = '=';
                break;
            case 0xc0:
                _0x2d4817 = 'TILDE';
                break;
            default:
                _0x2d4817 = String.fromCharCode(_0x5bd795.keyCode);
                break;
            }
            if (_0x41ef8c !== '') {
                if (_0x2d4817 !== '') {
                    return _0x41ef8c + '+' + _0x2d4817;
                }
                return _0x41ef8c;
            }
            return _0x2d4817;
        },
        'deleteHotkey': function (_0x1b7197, _0x3fea06) {
            delete _0x3d775c[_0x1b7197];
            $('#' + _0x3fea06).val('');
        },
        'setDefaultHotkey': function (_0x395c14) {
            var _0x2b8786 = false;
            if (_0x4eafd6[_0x395c14] && !_0x3d775c.hasOwnProperty(_0x4eafd6[_0x395c14].defaultKey)) {
                _0x2b8786 = _0x4eafd6[_0x395c14].defaultKey;
                _0x3d775c[_0x2b8786] = _0x395c14;
                return _0x2b8786;
            }
            return _0x2b8786;
        },
        'setHotkey': function (_0x2ea90f, _0x3593aa) {
            if (!_0x3593aa || this.lastPressedKey === _0x2ea90f && this.lastKeyId === _0x3593aa) {
                return;
            }
            var _0x8e05ae = $('#' + _0x3593aa).val();
            this.deleteHotkey(_0x8e05ae, _0x3593aa);
            if (_0x2ea90f === 'DEL') {
                return;
            }
            if (_0x3d775c[_0x2ea90f] && _0x3d775c[_0x2ea90f] !== _0x3593aa) {
                var _0x336e6a = _0x3d775c[_0x2ea90f];
                var _0xf2ea94 = this.setDefaultHotkey(_0x336e6a);
                if (_0xf2ea94) {
                    _0x3d775c[_0xf2ea94] = _0x336e6a;
                    $('#' + _0x336e6a).val(_0xf2ea94);
                } else {
                    this.deleteHotkey(_0x2ea90f, _0x336e6a);
                }
            }
            _0x3d775c[_0x2ea90f] = _0x3593aa;
            $('#' + _0x3593aa).val(_0x2ea90f);
            if (_0x3593aa === 'hk-chatMessage') {
                _0x3d775c['spec-messageKey'] = _0x2ea90f;
            }
            this.lastPressedKey = _0x2ea90f;
            this.lastKeyId = _0x3593aa;
        },
        'init': function () {
            this.loadHotkeys();
            this.setHotkeysMenu();
        }
    };
    document.onkeydown = function (_0x28cc76) {
        var _0x43528c = CONTROLS.getPressedKey(_0x28cc76);
        if (_0x28cc76.target.tagName === 'INPUT' && _0x28cc76.target.className !== CONTROLS.inputClassName && _0x43528c !== _0x3d775c['spec-messageKey']) {
            return;
        }
        if (_0x43528c !== '' && !_0x294431[_0x43528c]) {
            _0x294431[_0x43528c] = true;
            if (_0x43528c === 'ESC') {
                _0x28cc76.preventDefault();
                //m00
                MapChatUiCtrl && MapChatUiCtrl.toggleMenu();
                return;
            }
            if (_0x28cc76.target.className === CONTROLS.inputClassName) {
                _0x28cc76.preventDefault();
                CONTROLS.setHotkey(_0x43528c, _0x28cc76.target.id);
                return;
            }
            if (_0x3d775c[_0x43528c]) {
                _0x28cc76.preventDefault();
                var _0x20c724 = _0x3d775c[_0x43528c];
                if (_0x20c724 !== '' && _0x4eafd6[_0x20c724]) {
                    if (_0x4eafd6[_0x20c724].keyDown) {
                        _0x4eafd6[_0x20c724].keyDown();
                    }
                }
            }
        }
    };
    document.onkeyup = function (_0x38bd8c) {
        var _0x32a345 = CONTROLS.getPressedKey(_0x38bd8c);
        if (_0x32a345 !== '') {
            if (_0x3d775c[_0x32a345]) {
                var _0x1fe16c = _0x3d775c[_0x32a345];
                if (_0x1fe16c !== '' && _0x4eafd6[_0x1fe16c]) {
                    if (_0x4eafd6[_0x1fe16c].keyUp) {
                        _0x4eafd6[_0x1fe16c].keyUp();
                    }
                }
            }
            _0x294431[_0x32a345] = false;
        }
    };
    window.onmousedown = function (_0x1b6e8e) {
        if (!$('#overlays').is(':visible')) {
            if (_0x1b6e8e.which == 0x2) {
                _0x1b6e8e.preventDefault();
                MapChatUiCtrl && MapChatUiCtrl.sendCommand(0xa);
            } else {
                if (CLIENT_SETTINGS.mouseSplit) {
                    if (_0x1b6e8e.which == 0x1 && !CLIENT_SETTINGS.mouseInvert || _0x1b6e8e.which == 0x3 && CLIENT_SETTINGS.mouseInvert) {
                        _0x1b6e8e.preventDefault();
                        MapChatUiCtrl && MapChatUiCtrl.split();
                    }
                }
                if (CLIENT_SETTINGS.mouseFeed) {
                    if (_0x1b6e8e.which == 0x3 && !CLIENT_SETTINGS.mouseInvert || _0x1b6e8e.which == 0x1 && CLIENT_SETTINGS.mouseInvert) {
                        _0x1b6e8e.preventDefault();
                        MapChatUiCtrl && MapChatUiCtrl.macroFeed(true);
                    }
                }
            }
        }
    };
    window.onmouseup = function (_0x17ad3c) {
        if (CLIENT_SETTINGS.mouseFeed) {
            if (_0x17ad3c.which == 0x3 && !CLIENT_SETTINGS.mouseInvert || _0x17ad3c.which == 0x1 && CLIENT_SETTINGS.mouseInvert) {
                MapChatUiCtrl && MapChatUiCtrl.macroFeed(false);
            }
        }
    };
    window.onbeforeunload = function (_0x372744) {
        if (CLIENT2.play) {
            return i18n.exit;
        } else {
            return;
        }
    };

    function _0x20ac1c(_0x35819f) {
        if (window.history && window.history.replaceState) {
            window.history.replaceState({}, window.document.title, _0x35819f);
        }
    }

    function _0x15ef49() {
        if (window.location.pathname === '/ogario') {
            _0x20ac1c('/' + window.location.hash);
        }
    }

    function _0x27ace7() {
        if (window.NREUM) {
            window.NREUM = null;
            delete window.NREUM;
        }
        if (window.core) {
            window.core = null;
            delete window.core;
        }
        $.ajax('https://agar.io/agario.core.js?v=1', {
            'success': function (_0x7a8770) {
                var _0x5f45e4 = _0x7a8770;
                var _0x161548 = null;
                _0x5f45e4 = _0x5f45e4.replace(/(\(function\(([\w$]+)\){)/i, '$1 var ogario=$2.ogario,gameCtx=null;');
                _0x5f45e4 = _0x5f45e4.replace(/(connect:function\((\w)\){)(\w=[\w$]+\(\w\);)([\w$]+\(\w\);[\w$]+\(\w\)})/i, '$1 ogario.getWS($2); $3$4');
                _0x5f45e4 = _0x5f45e4.replace(/(([\w$]+)=[\w$]+\.getContext\(\"2d\"\);)/i, 'if($2.id==="canvas"){$1 gameCtx=$2;}else{$1}');
                _0x5f45e4 = _0x5f45e4.replace(/(setTarget:function\((\w),(\w)\)\{)([\w$]+\(\w,\w\)})/i, '$1 if(!ogario.play&&ogario.targeting){$2=ogario.targetX;$3=ogario.targetY;} if(ogario.pause){$2=ogario.innerW/2*ogario.canvasScale; $3=ogario.innerH/2*ogario.canvasScale;}$4');
                _0x5f45e4 = _0x5f45e4.replace(/(function\s*([\w$]+)\(\w\){return\s*[\w$]+\(\w,\w\)})/i, '$1 ogario.getString=$2;');
                _0x5f45e4 = _0x5f45e4.replace(/(\w\[\w\+(\d+)>>3]=(\w);\w\[\w\+(\d+)>>3]=(\w);\w\[\w\+(\d+)>>3]=(\w);\w\[\w\+(\d+)>>3]=(\w);)/i, '$1 ogario.setMapCoords($3,$5,$7,$9,$2,$8);');
                _0x5f45e4 = _0x5f45e4.replace(/if\((\+\w\[\w>>3\])<1\.0\){/i, 'if($1<ogario.zoomResetValue){');
                _0x5f45e4 = _0x5f45e4.replace(/(\w)(=\+(\w\[\w>>3\])\*\+\w\()(\.\d)(,\+\w\);)/i, 'if(!ogario.autoZoom){$3=ogario.zoomValue;} $1$2 (ogario.zoomSpeedValue||0.9) $5 ogario.zoomValue=$1;');
                _0x5f45e4 = _0x5f45e4.replace(/(\w=\w\[\w>>2\]\|0;)((\w\[\w>>3\])=(\w);)(\w\[\w>>0\]=a\[\w>>0\];)/i, '$1 if(!ogario.autoZoom){$3=ogario.zoomValue;}else{$2}$5');
                _0x5f45e4 = _0x5f45e4.replace(/(do{\w=\+\w\[\(\w\[\w>>2\]\|0\)\+\d+>>2];\w=\w\+\s*)(\+\(~~\+\w\(\+\(\w\*\w\/100\.0\)\)\|0\))(;\w=\w\+4\|0}while\(\(\w\|0\)!=\(\w\|0\)\);(\w)=(\w);)/i, 'ogario.playerCellsMass=[]; $1$2; ogario.playerCellsMass.push($2)$3 ogario.playerMass=$5; ogario.calculateMass();');
                _0x5f45e4 = _0x5f45e4.replace(/(\w=\+\(\w>>>0\)\+4294967296\.0\*\+\(\w\|0\);)(\w=\+\w\[[\d\w]+\];)(if\(\w<\w\){\w=\w;return})/i, '$1$2');
                _0x5f45e4 = _0x5f45e4.replace(/(if\(!\(\w\[[\d\w]+\]\|0\)\){)(\w=\w;return})([\w$]+\(\d+,\w\[[\d\w]+\]\|0\);)(\w=\w;return})/i, '$3$4');
                _0x5f45e4 = _0x5f45e4.replace(/(if\(\(\w\|0\)==0\|\(\w\[[\d\w]+\]\|0\)==0\))([\w$]+\(\w,\d+,15\);)(else\s*)([\w$]+\(\w,\w\);)/i, '$4');
                _0x5f45e4 = _0x5f45e4.replace(/(\w\[\w>>2\]=\(\w\[\w>>2\]\|0\)\+1;)([\w$]+\(\w\);)([\w$]+\(\w\);)(if\(!\(\w\[[\d\w]+\]\|0\)\){[\w$]+\(\w,\w\);(\w=\w)})/i, '$1$2$3 if(1){ogario.drawGrid(gameCtx);$5}');
                _0x5f45e4 = _0x5f45e4.replace(/([\w$]+\(\d+,\w\[\w>>2\]\|0,(\+\w),(\+\w)\)\|0;[\w$]+\(\d+,\w\[\w>>2\]\|0,\+-(\+\w\[\w\+\d+>>3\]),\+-(\+\w\[\w\+\d+>>3\])\)\|0;)/i, '$1 ogario.viewScale=$2; ogario.playerX=$4; ogario.playerY=$5; ogario.customDraw(gameCtx);');
                _0x5f45e4 = _0x5f45e4.replace(/(do\s*if\(\w\[\w\+\d+>>0\]\|0\){)(if\(\(\w\[[\d\w]+\]\|0\)==0\?\(\w\[\(\w\[\w>>2\]\|0\)\+\d+>>0\]\|0\)==0:0\)break;)/i, '$1 if(ogario.gameMode!==\':teams\'){break;} $2');
                _0x5f45e4 = _0x5f45e4.replace(/(while\(0\);)([\w$]+\(\w,\w\);)(\w=\w\[\w>>2\]\|0;)(if\(\(\(!\(\(\w\[\w\+\d+>>0\]\|0\)!=0\|\(\w\[[\d\w]+\]\|0\)==0\)\?\(\w\[\w\+\d+>>0\]\|0\)==0:0\)\?\(\w\[\w\+\d+>>0\]\|0\)==0:0\)\?\(\w\[\w\+\d+>>0\]\|0\)==0:0\))([\w$]+\(\w,\w\);)(if\(\(\w\[\w\+\d+>>0\]\|0\)!=0\?\(\w\[\(\w\[\w>>2\]\|0\)\+\d+>>0\]\|0\)!=0:0\))([\w$]+\(\w,\w\);)([\w$]+\(\w,\w\);)([\w$]+\(\w,\w\);)(if\(\!\(\w\[\(\w\[\w>>2\]\|0\)\+\d+>>0\]\|0\)\){)(\w=\w\+\d+\|0;\w\[\w>>0\]=1;\w=\w;return})([\w$]+\(\w,\w\);)(\w=\w\+\d+\|0;\w\[\w>>0\]=1;\w=\w;return})/i, '$1$13');
                _0x5f45e4 = _0x5f45e4.replace(/((\w)=\(\w\[\w\+\d+>>0\]\|0\)!=0;)(if\(\(\w\[[\d\w]+\]\|0\)!=0\?\(\w\[[\d\w]+\]\|\w\[(\w)\+\d+>>0\]\)<<24>>24==0:0\))((\w)=\w\[(\w)\+\d+>>2\]\|0;)else/i, '$2=1; $3 if(!ogario.vanillaSkins&&ogario.customSkins){$6=0;}else{$5}else');
                _0x5f45e4 = _0x5f45e4.replace(/if\((\(\w\|0\)!=0\?\(\w\[\w\+\d+>>2\]&2\|0\)!=0:0)\){/i, 'if(0){');
                _0x5f45e4 = _0x5f45e4.replace(/(\/100\.0;)(\w+=\w+<0\.0\?0\.0:\w+>1\.0\?1\.0:\w+;)/gi, '/ogario.animation;$2');
                _0x5f45e4 = _0x5f45e4.replace(/(\/100\.0,)(\(\w+<0\.0\?0\.0:\w+>1\.0\?1\.0:\w+)/gi, '/ogario.animation,$2');
                _0x5f45e4 = _0x5f45e4.replace(/(if\(\w\[\w\+\d+>>0\]\|0\))({(\w)=\(\w\-\+\w\[\w>>3\]\)\/)(100\.0)(;[\w$]+\(\d+,\w\[\w>>2\]\|0,\+\(\w<0\.0\?1\.0:\w>1\.0\?0\.0:)(1\.0-\w)(\)\)\|0})/i, '$1$2 ogario.animation $5$6$7');
                _0x5f45e4 = _0x5f45e4.replace(/((\w=(\(\w\[(\w)\+\d+>>0\]\|0\)==0);)([\w$]+\(\d+,\w\[\w>>2\]\|0\)\|0;)([\w$]+\(\d+,\w\[\w>>2\]\|0,\+\(\+(\w\[\w>>2\])\),\+\(\+(\w\[\w>>2\])\),\+\(\w\+\s*\+(\w\[\w>>2\])\),0\.0,6.283185307179586,0\)\|0;)([\w$]+\(\d+,\w\[\w>>2\]\|0\)\|0;)(\w=\w\[\w>>2\]\|0;)if\(!\w\){([\w$]+\(\d+,\w\|0,(\w)&255\|0,(\w)&255\|0,(\w)&255\|0\)\|0;)([\w$]+\(\d+,\w\[\w>>2\]\|0\)\|0;)break}if\(\w\){([\w$]+\(\d+,\w\|0,(\w)&255\|0,(\w)&255\|0,(\w)&255\|0\)\|0;)([\w$]+\(\d+,\w\[\w>>2\]\|0\)\|0))/i, 'var cellX=+(+$7),cellY=+(+$8),cellSize=+(+$9),isFood=!$3,isVirus=false,isPlayerCell=false,skipCell=false,nick=null,color=null,skin=null; if(isFood){if(!ogario.showFood||ogario.autoHideFoodOnZoom&&ogario.viewScale<0.2){break;}if(ogario.autoHideFood&&!ogario.foodIsHidden&&ogario.playerMass>1000){ogario.showFood=false;ogario.foodIsHidden=true;break;}if(!ogario.rainbowFood){ogario.foodCache.push({x:cellX,y:cellY,size:cellSize});break;}gameCtx.fillStyle=ogario.rgb2Hex($13&255,$14&255,$15&255);} if(ogario.hideSmallBots&&cellSize<=36){skipCell=true;break;} gameCtx.beginPath();gameCtx.arc(cellX,cellY,cellSize,0,2*Math.PI,false);gameCtx.closePath(); if(isFood){gameCtx.fill();break;} ogario.globalAlpha=gameCtx.globalAlpha; if(gameCtx.lineJoin===\'miter\'){isVirus=true;if(ogario.virColors&&ogario.play){gameCtx.fillStyle=ogario.setVirusColor(cellSize);gameCtx.strokeStyle=ogario.setVirusStrokeColor(cellSize);}else{gameCtx.fillStyle=ogario.virusColor;gameCtx.strokeStyle=ogario.virusStrokeColor;}if(ogario.transparentViruses){gameCtx.globalAlpha*=ogario.virusAlpha;}if(ogario.virusesRange&&ogario.play){ogario.virusesCache.push({x:cellX,y:cellY,size:cellSize});}gameCtx.fill();gameCtx.globalAlpha=ogario.globalAlpha;gameCtx.lineWidth=ogario.virusStrokeSize;gameCtx.stroke();break;} if((a[$4+ogario.nameMemOffset+4>>0]&1)==0|0){nick=ogario.getString($4+ogario.nameMemOffset+5);}else{nick=ogario.getString(c[$4+ogario.nameMemOffset+12>>2]|0);} color=ogario.rgb2Hex($13&255|0,$14&255|0,$15&255|0); gameCtx.fillStyle=color; if(nick&&color){if(ogario.showCustomSkins&&ogario.customSkins){skin=ogario.getCustomSkin(nick,color);}} if(ogario.play){var idA=c[$4+ogario.idOffset>>2]|0;var idB=c[ogario.idMemOffset]|0;var idC=c[ogario.idMemOffset+1]|0;loop:do{if((idB|0)!=(idC|0)){while(true){if((c[idB>>2]|0)==(idA|0)){break loop;}idB=idB+4|0;if((idB|0)==(idC|0)){idB=idC;break;}}}}while(false);isPlayerCell=(idB|0)!=(idC|0); if(isPlayerCell){ogario.playerCells.push({x:cellX,y:cellY,size:cellSize});ogario.playerColor=color;} if((ogario.oppColors&&!ogario.oppRings)||(ogario.myCustomColor&&isPlayerCell)){gameCtx.fillStyle=ogario.setOppColor(cellSize,isPlayerCell);} if(!isPlayerCell&&(ogario.splitRange||ogario.oppRings)){ogario.cacheCells(cellX,cellY,cellSize);}} if(ogario.transparentCells){gameCtx.globalAlpha*=ogario.cellsAlpha;}  gameCtx.fill(); gameCtx.globalAlpha=ogario.globalAlpha; if(((ogario.transparentSkins||(ogario.play&&ogario.oppColors))&&!(isPlayerCell&&!ogario.myTransparentSkin))||isPlayerCell&&ogario.myTransparentSkin){gameCtx.globalAlpha*=ogario.skinsAlpha;} if(skin){gameCtx.drawImage(skin,cellX-cellSize,cellY-cellSize,2*cellSize,2*cellSize);} break;$1');
                _0x5f45e4 = _0x5f45e4.replace(/([\w$]+\(\d+\,\w\[\w>>2\]\|0\)\|0}while\(0\);do\s*if\()(\w)\)/i, '$1$2&&ogario.vanillaSkins&&!skin)');
                _0x5f45e4 = _0x5f45e4.replace(/(if\(\(\w\[\w\+\d+>>0\]\|0\)==0\?\(\(\(\(\w\[\w\+\d+>>2\]\|0\)\+\(\w\[[\d\w]+\]\|0\)\|0\)>>>0\)%10\|0\|0\)!=0:0\){\w=\w\[\w>>2\]\|0;[\w$]+\(\d+,\w\|0\)\|0;\w=\w;return})([\w$]+\((\w),\w\);)/i, 'ogario.drawCellInfo(gameCtx, $3, cellX, cellY, cellSize, isFood, isVirus, isPlayerCell, skipCell, nick, color, skin !== null);');
                _0x161548 = _0x5f45e4.match(/(\w=0;\w=\w\[\w\+(\d+)>>2\]\|0;\w=\w\[(\d+)\]\|0;\w=\w\[[\d\w]+\]\|0;)(\w:do)/i);
                if (_0x161548) {
                    _0x5f45e4 = _0x5f45e4.replace(/ogario.idOffset/g, _0x161548[0x2]);
                    _0x5f45e4 = _0x5f45e4.replace(/ogario.idMemOffset/g, _0x161548[0x3]);
                }
                _0x161548 = _0x5f45e4.match(/[\w$]+\(\w\+(\d+)\+\(\(\w<4\.0\?~~\w:4\)\*80\|0\)\|0\)/i);
                if (_0x161548) {
                    _0x5f45e4 = _0x5f45e4.replace(/ogario.nameMemOffset/g, _0x161548[0x1]);
                }
                _0x5f45e4 = _0x5f45e4.replace(/(function\(\){)(for\(var\s+\w=document.createElement\(\"canvas\"\)\.getContext\(\"2d\"\))/i, '$1 console.log("create"); $2');
                _0x5f45e4 = _0x5f45e4.replace(/(\w\[\w\+16>>2\]=0;)(\w\[\w>>2\])=([\w$]+\(\d+\)\|0;)(\w\[[\d\w]+\]=\(\w\[[\d\w]+\]\|0\)\+1)/gi, '$1 $2=-1; $4');
                _0x5f45e4 = _0x5f45e4.replace(/(}\w\[\w>>2]=-1;\w\[\w>>2])=([\w$]+\(\d+\)\|0;)(\w\[[\d\w]+\]=\(\w\[[\d\w]+\]\|0\)\+1)/gi, '$1=-1; $3');
                _0x5f45e4 = _0x5f45e4.replace(/(\){)(\w=\w\.\w\[(\w)\]\.canvas)/gi, '$1 if($3==-1){return;} $2');
                _0x5f45e4 = _0x5f45e4.replace(/(\){)(\w\.\w\[(\w)\]\.(globalAlpha|font|scale|fillStyle|fillRect|fillText))/gi, '$1 if($3==-1){return;} $2');
                _0x5f45e4 = _0x5f45e4.replace(/(\){)(return\s+\w\.\w\[(\w)\]\.measureText)/gi, '$1 if($3==-1){return;} $2');
                var _0x5ad015 = document.createElement('script');
                _0x5ad015.textContent = _0x5f45e4;
                _0x5ad015.async = true;
                document.body.appendChild(_0x5ad015);
            },
            'dataType': 'text',
            'method': 'GET',
            'cache': false,
            'crossDomain': true
        });
    }

    function _0x49d42a() {
        window.onkeydown = function (_0x33d51c) {
            0x51 == _0x33d51c.keyCode && window.core.specialOn && window.core.specialOn();
        };
        window.onkeyup = function (_0x10ee48) {};
    }

    function _0x104405() {
        window.addEventListener('resize', function () {
            setTimeout(TRANSFORM_WIEW, 0x32);
        }, false);
        window.addKeyListeners = function () {
            _0x49d42a();
        };
    }

    function _0x5865b8() {
        CLIENT2.getWS = function (_0x42552c) {
            MapChatUiCtrl.getWS(_0x42552c);
        };
        CLIENT2.displayLeaderboard = function () {
            MapChatUiCtrl.displayLeaderboard(CLIENT2.leaderboardHTML);
        };
        CLIENT2.drawGrid = function (_0x6a6a35) {
            MapChatUiCtrl.drawGrid(_0x6a6a35);
        };
        CLIENT2.customDraw = function (_0x8653b4) {
            MapChatUiCtrl.customDraw(_0x8653b4);
        };
        CLIENT2.drawCellInfo = function (_0x61b881, _0x5bc6be, _0x5c8eb8, _0x147a68, _0x3acf4c, _0x7ff13c, _0x530758, _0x2828c5, _0x15edbc, _0x49941f, _0x3642d7, _0x1f5366) {
            MapChatUiCtrl.drawCellInfo(_0x61b881, _0x5bc6be, _0x5c8eb8, _0x147a68, _0x3acf4c, _0x7ff13c, _0x530758, _0x2828c5, _0x15edbc, _0x49941f, _0x3642d7, _0x1f5366);
        };
        CLIENT2.getCustomSkin = function (_0xf074ae, _0x160e64) {
            return MapChatUiCtrl.getCustomSkin(_0xf074ae, _0x160e64);
        };
        CLIENT2.setVirusColor = function (_0x296704) {
            return MapChatUiCtrl.setVirusColor(_0x296704);
        };
        CLIENT2.setVirusStrokeColor = function (_0x47ff7f) {
            return MapChatUiCtrl.setVirusStrokeColor(_0x47ff7f);
        };
        CLIENT2.setOppColor = function (_0x40cb00, _0x5c8f63) {
            return MapChatUiCtrl.setOppColor(_0x40cb00, _0x5c8f63);
        };
    }

    function _0xbd31d4() {
        if (document.getElementById('canvas')) {
            var _0x21a527 = document.getElementById('canvas');
            _0x21a527.addEventListener('mousemove', function (_0x48e6fc) {
                if (CLIENT2.play && CLIENT2.cursorTracking && CLIENT2.setCursorPosition) {
                    CLIENT2.clientX = _0x48e6fc.clientX;
                    CLIENT2.clientY = _0x48e6fc.clientY;
                    CLIENT2.setCursorPosition();
                }
            }, false);
            return;
        }
        setTimeout(_0xbd31d4, 0x32);
    }

    function _0xf99ad() {
        if (window.MC && window.MC.showNickDialog) {
            window.MC._showNickDialog = window.MC.showNickDialog;
            window.MC.showNickDialog = function () {
                window.MC._showNickDialog.apply(this, arguments);
                $('.ogario-menu').show();
                _0x17698d();
            };
            window.MC._showStatsDialog = window.MC.showStatsDialog;
            window.MC.showStatsDialog = function () {
                window.MC._showStatsDialog.apply(this, arguments);
                _0x17698d();
            };
            window.MC._onConnect = window.MC.onConnect;
            window.MC.onConnect = function () {
                window.MC._onConnect.apply(this, arguments);
                if (MapChatUiCtrl) {
                    MapChatUiCtrl.sendServerJoin();
                    MapChatUiCtrl.sendServerData();
                    MapChatUiCtrl.unlockButtons();
                }
            };
            window.MC._onPlayerSpawn = window.MC.onPlayerSpawn;
            window.MC.onPlayerSpawn = function () {
                window.MC._onPlayerSpawn.apply(this, arguments);
                CLIENT2.playerColor = null;
                MapChatUiCtrl && MapChatUiCtrl.onPlayerSpawn();
            };
            window.MC._onPlayerDeath = window.MC.onPlayerDeath;
            window.MC.onPlayerDeath = function () {
                window.MC._onPlayerDeath.apply(this, arguments);
                MapChatUiCtrl && MapChatUiCtrl.onPlayerDeath();
            };
            window.MC._onAgarioCoreLoaded = window.MC.onAgarioCoreLoaded;
            window.MC.onAgarioCoreLoaded = function () {
                window.MC._onAgarioCoreLoaded.apply(this, arguments);
                window.core && window.core.setNames && window.core.setNames(false);
                window.core && window.core.setShowMass && window.core.setShowMass(false);
                TRANSFORM_WIEW();
            };
            window.MC._wasInitialized = window.MC.wasInitialized;
            window.MC.wasInitialized = function () {
                window.MC._wasInitialized.apply(this, arguments);
                setTimeout(function () {
                    TRANSFORM_WIEW();
                    MapChatUiCtrl && MapChatUiCtrl.getDefaultSettings();
                    MapChatUiCtrl.connect();
                    _0x17698d();
                }, 0x3e8);
            };
            window.MC.onPlayerBanned = function (_0x4b248d) {};
            return;
        }
        setTimeout(_0xf99ad, 0x32);
    }

    function TRANSFORM_WIEW() {
        var _0x14935a = window.innerWidth;
        var _0x47f930 = window.innerHeight;
        var _0x4f3a28 = $('#helloContainer');
        var _0x2c212f = _0x4f3a28.innerHeight();
        if (_0x2c212f > 0x0) {
            CLIENT2.menuHeight = _0x2c212f;
        } else {
            _0x2c212f = CLIENT2.menuHeight || 0x26a;
        }
        var _0x581cbb = Math.min(0x1, _0x47f930 / _0x2c212f);
        var _0x1dc165 = _0x2c212f * _0x581cbb;
        var _0x5dbbcc = Math.round(_0x47f930 / 0x2 - 0.5 * _0x1dc165);
        var _0x4a3108 = 'translate(-50%, 0%) scale(' + _0x581cbb + ')';
        _0x4f3a28.css('transform', _0x4a3108);
        _0x4f3a28.css('-ms-transform', _0x4a3108);
        _0x4f3a28.css('-webkit-transform', _0x4a3108);
        _0x4f3a28.css('top', '' + _0x5dbbcc + 'px');
        CLIENT2.innerW = _0x14935a;
        CLIENT2.innerH = _0x47f930;
    }

    function _0x17698d() {
        if (MapChatUiCtrl.protocolMode) {
            return;
        }
        window.onkeydown = function (_0x4fa298) {};
    }

    function _0x4fa716() {
        window.core = {
            'connect': function (_0x493f1f) {
                CLIENT.connect(_0x493f1f);
            },
            'disconnect': function () {},
            'sendNick': function (_0x236b20) {
                CLIENT.sendNick(_0x236b20);
            },
            'sendSpectate': function () {
                CLIENT.sendSpectate();
            },
            'eject': function () {
                CLIENT.sendEject();
            },
            'split': function () {
                CLIENT.sendSplit();
            },
            'specialOn': function () {
                CLIENT.sendFreeSpectate();
            },
            'specialOff': function () {
                CLIENT.sendFreeSpectate();
            },
            'sendFbToken': function (_0x176158) {
                CLIENT.sendFbToken(_0x176158);
            },
            'sendGplusToken': function (_0x58517c) {
                CLIENT.sendGplusToken(_0x58517c);
            },
            'recaptchaResponse': function (_0x487f6e) {
                CLIENT.sendRecaptcha(_0x487f6e);
            },
            'setClientVersion': function (_0x5ec270, _0x7790f7) {
                CLIENT.setClientVersion(_0x5ec270, _0x7790f7);
            },
            'proxyMobileData': function (_0x538924 = []) {
                if (!Array.isArray(_0x538924)) {
                    console.log('ProxyMobileData ERROR: Array data required.');
                    return;
                }
                if (_0x538924[0x0] == 0x8) {
                    _0x538924.unshift(0x66);
                }
                _0x538924 = new Uint8Array(_0x538924);
                CLIENT.sendMessage(new DataView(_0x538924.buffer));
            }
        };
    }

    function _0xf705aa() {
        Buffer = require_('buffer').Buffer;
        Lz4 = require_('lz4');
    }

    function _0x4e43e9() {
        window.onresize = function () {
            WORLD.resizeCanvas();
            TRANSFORM_WIEW();
        };
    }(function () {
        CLIENT2 = CLIENT;
        _0xf705aa();
        _0x15ef49();
        _0x4e43e9();
        _0x49d42a();
        _0x4fa716();
        window.master.getClientVersion();
        INTERFACE_HELPER.init();
        MapChatUiCtrl.init();
        MapChatUiCtrl.getDefaultSettings();
        MapChatUiCtrl.connect();
        CONTROLS.init();
        CLIENT.init();
        WORLD.init();
        window.master.init();
        TRANSFORM_WIEW();
    }());
}(window, window.ogario, window.jQuery));
