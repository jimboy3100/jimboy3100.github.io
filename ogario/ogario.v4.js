// Encoded by Szymy
// Decoded by Adam and MGx
// Simplified more by jimboy3100
// Thank you Snez for decoding Feross
// Thank you volum for the case 16: instance

//v1.31

//Game Configurations
//var agarversion="v12/1922/";
var agarversion="";
var LMGameConfiguration = $.ajax({
        type: "GET",
		url: "https://jimboy3100.github.io/agario/live/"+agarversion+"GameConfiguration.json",
		async: false,
        datatype: "json",
        success: function(info) {
			//var GameConfiguration = info;
		}
}).responseJSON;

( function t(ogcustom1, ogcustom2, ogcustom3) {
	var ogcustom1;
	var ogcustom2 = {};
	var ogcustom3 = [47];
    function ogcustom4(ogcustom5, ogcustom6) {

			var ogcustom8 = ogcustom2[ogcustom5] = {'exports': {}}; 
				ogcustom1[ogcustom5][0]['call']({}, function(ogcustom7) {
                var ogcustom2 = ogcustom1[ogcustom5][1][ogcustom7];
				
                return ogcustom4(ogcustom2 || ogcustom7);
            }, ogcustom8, ogcustom8["exports"], t, ogcustom1, ogcustom2, ogcustom3);
        return ogcustom2[ogcustom5]["exports"]; 
   }
	
    for (customcounter1 = 0; customcounter1 < ogcustom3["length"]; customcounter1++) {
        ogcustom4(ogcustom3[customcounter1]);
    }	
    //return ogcustom4;
})({
    1: [function(isSlidingUp, dontForceConstraints, canCreateDiscussions) {
        function require(array) {
            var length = array["length"];
            if (length % 4 > 0) {
                throw new Error("Invalid string. Length must be a multiple of 4");
            }
            return "=" === array[length - 2] ? 2 : "=" === array[length - 1] ? 1 : 0;
        }

        function repeat(str, a, repeats) {
            var viewportCenter;
            var interestingPoint;
            var $this = [];
            var i = a;
            for (; i < repeats; i = i + 3) {
                viewportCenter = (str[i] << 16) + (str[i + 1] << 8) + str[i + 2];
                $this["push"](memory[(interestingPoint = viewportCenter) >> 18 & 63] + memory[interestingPoint >> 12 & 63] + memory[interestingPoint >> 6 & 63] + memory[63 & interestingPoint]);
            }
            return $this["join"]("");
        }
        canCreateDiscussions["byteLength"] = function(script) {
            return 3 * script["length"] / 4 - require(script);
        };
        canCreateDiscussions["toByteArray"] = function(data) {
            var i;
            var np;
            var LIMB_BITMASK;
            var y;
            var array;
            var n = data["length"];
            y = require(data);
            array = new ArrayType(3 * n / 4 - y);
            np = y > 0 ? n - 4 : n;
            var item = 0;
            i = 0;
            for (; i < np; i = i + 4) {
                LIMB_BITMASK = revLookup[data["charCodeAt"](i)] << 18 | revLookup[data["charCodeAt"](i + 1)] << 12 | revLookup[data["charCodeAt"](i + 2)] << 6 | revLookup[data["charCodeAt"](i + 3)];
                array[item++] = LIMB_BITMASK >> 16 & 255;
                array[item++] = LIMB_BITMASK >> 8 & 255;
                array[item++] = 255 & LIMB_BITMASK;
            }
            if (2 === y) {
                LIMB_BITMASK = revLookup[data["charCodeAt"](i)] << 2 | revLookup[data["charCodeAt"](i + 1)] >> 4;
                array[item++] = 255 & LIMB_BITMASK;
            } else {
                if (1 === y) {
                    LIMB_BITMASK = revLookup[data["charCodeAt"](i)] << 10 | revLookup[data["charCodeAt"](i + 1)] << 4 | revLookup[data["charCodeAt"](i + 2)] >> 2;
                    array[item++] = LIMB_BITMASK >> 8 & 255;
                    array[item++] = 255 & LIMB_BITMASK;
                }
            }
            return array;
        };
        canCreateDiscussions["fromByteArray"] = function(item) {
            var firstReferenceNoteNumber;
            var state = item["length"];
            var pointer_state = state % 3;
            var data = "";
            var value = [];
            var start = 0;
            var len = state - pointer_state;
            for (; start < len; start = start + 16383) {
                value["push"](repeat(item, start, start + 16383 > len ? len : start + 16383));
            }
            if (1 === pointer_state) {
                firstReferenceNoteNumber = item[state - 1];
                data = data + memory[firstReferenceNoteNumber >> 2];
                data = data + memory[firstReferenceNoteNumber << 4 & 63];
                data = data + "==";
            } else {
                if (2 === pointer_state) {
                    firstReferenceNoteNumber = (item[state - 2] << 8) + item[state - 1];
                    data = data + memory[firstReferenceNoteNumber >> 10];
                    data = data + memory[firstReferenceNoteNumber >> 4 & 63];
                    data = data + memory[firstReferenceNoteNumber << 2 & 63];
                    data = data + "=";
                }
            }
            return value["push"](data), value["join"]("");
        };
        var memory = [];
        var revLookup = [];
        var ArrayType = "undefined" != typeof Uint8Array ? Uint8Array : Array;
        var indexMap = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var i = 0;
        var value = indexMap["length"];
        for (; i < value; ++i) {
            memory[i] = indexMap[i];
            revLookup[indexMap["charCodeAt"](i)] = i;
        }
        revLookup["-" ["charCodeAt"](0)] = 62;
        revLookup["_" ["charCodeAt"](0)] = 63;
    }, {}],
    2: [function(_0x2aec96, _0x4732e9, _0x7e2a9c) {}, {}],
    3: [function(_0x48f037, _0x2d7a1a, _0x596d63) {
        //'use strict';
        var _0x3babfd = _0x48f037('base64-js'),
            _0x620962 = _0x48f037('ieee754');
        _0x596d63['Buffer'] = _0x3a18a3, _0x596d63['SlowBuffer'] = function(_0x48f037) {
            +_0x48f037 != _0x48f037 && (_0x48f037 = 0);
            return _0x3a18a3['alloc'](+_0x48f037);
        }, _0x596d63['INSPECT_MAX_BYTES'] = 50;
        var _0x42c5b0 = 2147483647;

        function _0x470f93(_0x48f037) {
            if (_0x48f037 > _0x42c5b0) throw new RangeError('Invalid typed array length');
            var _0x2d7a1a = new Uint8Array(_0x48f037);
            return _0x2d7a1a['__proto__'] = _0x3a18a3['prototype'], _0x2d7a1a;
        }

        function _0x3a18a3(_0x48f037, _0x2d7a1a, _0x596d63) {
            if ('number' == typeof _0x48f037) {
                if ('string' == typeof _0x2d7a1a) throw new Error('If encoding is specified then the first argument must be a string');
                return _0x29c58d(_0x48f037);
            }
            return _0x3aa6a5(_0x48f037, _0x2d7a1a, _0x596d63);
        }

        function _0x3aa6a5(_0x48f037, _0x2d7a1a, _0x596d63) {
            if ('\x6e\x75\x6d\x62\x65\x72' == typeof _0x48f037) throw new TypeError('"value" argument must not be a number');
            return _0x48f037 instanceof ArrayBuffer ? function(_0x48f037, _0x2d7a1a, _0x596d63) {
                if (_0x2d7a1a < 0 || _0x48f037['\x62\x79\x74\x65\x4c\x65\x6e\x67\x74\x68'] < _0x2d7a1a) throw new RangeError('\x27\x6f\x66\x66\x73\x65\x74\x27\x20\x69\x73\x20\x6f\x75\x74\x20\x6f\x66\x20\x62\x6f\x75\x6e\x64\x73');
                if (_0x48f037['byteLength'] < _0x2d7a1a + (_0x596d63 || 0)) throw new RangeError('"length" is out of bounds');
                var _0x3babfd;
                _0x3babfd = void 0 === _0x2d7a1a && void 0 === _0x596d63 ? new Uint8Array(_0x48f037) : void 0 === _0x596d63 ? new Uint8Array(_0x48f037, _0x2d7a1a) : new Uint8Array(_0x48f037, _0x2d7a1a, _0x596d63);
                return _0x3babfd['__proto__'] = _0x3a18a3['\x70\x72\x6f\x74\x6f\x74\x79\x70\x65'], _0x3babfd;
            }(_0x48f037, _0x2d7a1a, _0x596d63) : '\x73\x74\x72\x69\x6e\x67' == typeof _0x48f037 ? function(_0x48f037, _0x2d7a1a) {
                'string' == typeof _0x2d7a1a && '' !== _0x2d7a1a || (_0x2d7a1a = '\x75\x74\x66\x38');
                if (!_0x3a18a3['isEncoding'](_0x2d7a1a)) throw new TypeError('"encoding" must be a valid string encoding"');
                var _0x596d63 = 0 | _0x23678f(_0x48f037, _0x2d7a1a),
                    _0x3babfd = _0x470f93(_0x596d63),
                    _0x620962 = _0x3babfd["0x1a"](_0x48f037, _0x2d7a1a);
                _0x620962 !== _0x596d63 && (_0x3babfd = _0x3babfd['slice'](0, _0x620962));
                return _0x3babfd;
            }(_0x48f037, _0x2d7a1a) : function(_0x48f037) {
                if (_0x3a18a3['isBuffer'](_0x48f037)) {
                    var _0x2d7a1a = 0 | _0x2bc50b(_0x48f037['\x6c\x65\x6e\x67\x74\x68']),
                        _0x596d63 = _0x470f93(_0x2d7a1a);
                    return 0 === _0x596d63['length'] ? _0x596d63 : (_0x48f037['copy'](_0x596d63, 0, 0, _0x2d7a1a), _0x596d63);
                }
                if (_0x48f037) {
                    if (_0x331746(_0x48f037) || 'length' in _0x48f037) return 'number' != typeof _0x48f037['length'] || _0x286c75(_0x48f037['length']) ? _0x470f93(0) : _0x202773(_0x48f037);
                    if ('\x42\x75\x66\x66\x65\x72' === _0x48f037['type'] && Array['\x69\x73\x41\x72\x72\x61\x79'](_0x48f037['data'])) return _0x202773(_0x48f037['\x64\x61\x74\x61']);
                }
                throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.');
            }(_0x48f037);
        }

        function _0x2c5cf7(_0x48f037) {
            if ('number' != typeof _0x48f037) throw new TypeError('"size" argument must be a number');
            if (_0x48f037 < 0) throw new RangeError('"size" argument must not be negative');
        }

        function _0x29c58d(_0x48f037) {
            return _0x2c5cf7(_0x48f037), _0x470f93(_0x48f037 < 0 ? 0 : 0 | _0x2bc50b(_0x48f037));
        }

        function _0x202773(foundComponents) {
            /** @type {number} */
            var itemData = foundComponents["length"] < 0 ? 0 : 0 | _0x2bc50b(foundComponents["length"]);
            var hooksByComponent = _0x470f93(itemData);
            /** @type {number} */
            var component = 0;
            for (; component < itemData; component = component + 1) {
                /** @type {number} */
                hooksByComponent[component] = 255 & foundComponents[component];
            }
            return hooksByComponent;
        }
        'use strict';
        /**
         * @param {number} canCreateDiscussions
         * @return {?}
         */
        function _0x2bc50b(canCreateDiscussions) {
            if (canCreateDiscussions >= _0x42c5b0) {
                throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + _0x42c5b0["toString"](16) + " bytes");
            }
            return 0 | canCreateDiscussions;
        }
        /**
         * @param {string} string
         * @param {string} encoding
         * @return {?}
         */
        function _0x23678f(string, encoding) {
            if (_0x3a18a3["isBuffer"](string)) {
                return string["length"];
            }
            if (_0x331746(string) || string instanceof ArrayBuffer) {
                return string["byteLength"];
            }
            if ("string" != typeof string) {
                /** @type {string} */
                string = "" + string;
            }
            var prev2 = string["length"];
            if (0 === prev2) {
                return 0;
            }
            /** @type {boolean} */
            var _0x3babfd = false;
            for (;;) {
                switch (encoding) {
                    case "ascii":
                    case "latin1":
                    case "binary":
                        return prev2;
                    case "utf8":
                    case "utf-8":
                    case void 0:
                        return _0x5a6886(string)["length"];
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return 2 * prev2;
                    case "hex":
                        return prev2 >>> 1;
                    case "base64":
                        return _0x5ba599(string)["length"];
                    default:
                        if (_0x3babfd) {
                            return _0x5a6886(string)["length"];
                        }
                        encoding = ("" + encoding)["toLowerCase"]();
                        /** @type {boolean} */
                        _0x3babfd = true;
                }
            }
        }
        /**
         * @param {!NodeList} object
         * @param {number} name
         * @param {number} method
         * @return {undefined}
         */
        function _0x16496f(object, name, method) {
            var result = object[name];
            object[name] = object[method];
            object[method] = result;
        }
        /**
         * @param {!Object} obj
         * @param {number} t
         * @param {number} i
         * @param {number} s
         * @param {number} format
         * @return {?}
         */
        function _0x18c3aa(obj, t, i, s, format) {
            if (0 === obj["length"]) {
                return -1;
            }
            if ("string" == typeof i ? (s = i, i = 0) : i > 2147483647 ? i = 2147483647 : i < -2147483648 && (i = -2147483648), _0x286c75(i = +i) && (i = format ? 0 : obj["length"] - 1), i < 0 && (i = obj["length"] + i), i >= obj["length"]) {
                if (format) {
                    return -1;
                }
                /** @type {number} */
                i = obj["length"] - 1;
            } else {
                if (i < 0) {
                    if (!format) {
                        return -1;
                    }
                    /** @type {number} */
                    i = 0;
                }
            }
            if ("string" == typeof t && (t = _0x3a18a3["from"](t, s)), _0x3a18a3["isBuffer"](t)) {
                return 0 === t["length"] ? -1 : _0xa7a8a7(obj, t, i, s, format);
            }
            if ("number" == typeof t) {
                return t = t & 255, "function" == typeof Uint8Array["prototype"]["indexOf"] ? format ? Uint8Array["prototype"]["indexOf"]["call"](obj, t, i) : Uint8Array["prototype"]["lastIndexOf"]["call"](obj, t, i) : _0xa7a8a7(obj, [t], i, s, format);
            }
            throw new TypeError("val must be string, number or Buffer");
        }
        /**
         * @param {?} arr
         * @param {?} val
         * @param {number} start
         * @param {?} text
         * @param {number} keyword
         * @return {?}
         */
        function _0xa7a8a7(arr, val, start, text, keyword) {
            /**
             * @param {!Array} path
             * @param {number} index
             * @return {?}
             */
            function read(path, index) {
                return 1 === w ? path[index] : path["readUInt16BE"](index * w);
            }
            var i;
            /** @type {number} */
            var w = 1;
            var end = arr["length"];
            var limit = val["length"];
            if (void 0 !== text && ("ucs2" === (text = String(text)["toLowerCase"]()) || "ucs-2" === text || "utf16le" === text || "utf-16le" === text)) {
                if (arr["length"] < 2 || val["length"] < 2) {
                    return -1;
                }
                /** @type {number} */
                w = 2;
                /** @type {number} */
                end = end / 2;
                /** @type {number} */
                limit = limit / 2;
                /** @type {number} */
                start = start / 2;
            }
            if (keyword) {
                /** @type {number} */
                var r = -1;
                /** @type {number} */
                i = start;
                for (; i < end; i++) {
                    if (read(arr, i) === read(val, -1 === r ? 0 : i - r)) {
                        if (-1 === r && (r = i), i - r + 1 === limit) {
                            return r * w;
                        }
                    } else {
                        if (-1 !== r) {
                            /** @type {number} */
                            i = i - (i - r);
                        }
                        /** @type {number} */
                        r = -1;
                    }
                }
            } else {
                if (start + limit > end) {
                    /** @type {number} */
                    start = end - limit;
                }
                /** @type {number} */
                i = start;
                for (; i >= 0; i--) {
                    /** @type {boolean} */
                    var _0x202773 = true;
                    /** @type {number} */
                    var j = 0;
                    for (; j < limit; j++) {
                        if (read(arr, i + j) !== read(val, j)) {
                            /** @type {boolean} */
                            _0x202773 = false;
                            break;
                        }
                    }
                    if (_0x202773) {
                        return i;
                    }
                }
            }
            return -1;
        }
        /**
         * @param {!Object} data
         * @param {?} component
         * @param {number} offset
         * @param {number} width
         * @return {?}
         */
        function _0x36959d(data, component, offset, width) {
            /** @type {number} */
            offset = Number(offset) || 0;
            /** @type {number} */
            var textWidth = data["length"] - offset;
            if (width) {
                if ((width = Number(width)) > textWidth) {
                    /** @type {number} */
                    width = textWidth;
                }
            } else {
                /** @type {number} */
                width = textWidth;
            }
            var value = component["length"];
            if (value % 2 != 0) {
                throw new TypeError("Invalid hex string");
            }
            if (width > value / 2) {
                /** @type {number} */
                width = value / 2;
            }
            /** @type {number} */
            var x = 0;
            for (; x < width; ++x) {
                /** @type {number} */
                var bottom1 = parseInt(component["substr"](2 * x, 2), 16);
                if (_0x286c75(bottom1)) {
                    return x;
                }
                /** @type {number} */
                data[offset + x] = bottom1;
            }
            return x;
        }
        /**
         * @param {!Object} sawL
         * @param {?} sawR
         * @param {?} mmCoreSplitViewBlock
         * @param {?} $state
         * @return {?}
         */
        function _0x4f4848(sawL, sawR, mmCoreSplitViewBlock, $state) {
            return _0x26579a(_0x5a6886(sawR, sawL["length"] - mmCoreSplitViewBlock), sawL, mmCoreSplitViewBlock, $state);
        }
        /**
         * @param {?} logdir
         * @param {?} type
         * @param {?} data
         * @param {?} callback
         * @return {?}
         */
        function _0x1c9f2a(logdir, type, data, callback) {
            return _0x26579a(function(PL$42) {
                /** @type {!Array} */
                var _0x2d7a1a = [];
                /** @type {number} */
                var PL$41 = 0;
                for (; PL$41 < PL$42["length"]; ++PL$41) {
                    _0x2d7a1a["push"](255 & PL$42["charCodeAt"](PL$41));
                }
                return _0x2d7a1a;
            }(type), logdir, data, callback);
        }
        /**
         * @param {?} logdir
         * @param {?} person
         * @param {?} type
         * @param {?} finish
         * @return {?}
         */
        function _0x16468b(logdir, person, type, finish) {
            return _0x1c9f2a(logdir, person, type, finish);
        }
        /**
         * @param {?} $ionicHistory
         * @param {?} mmCoreSplitViewBlock
         * @param {?} $state
         * @param {?} breadcrumbs
         * @return {?}
         */
        function _0x24a22e($ionicHistory, mmCoreSplitViewBlock, $state, breadcrumbs) {
            return _0x26579a(_0x5ba599(mmCoreSplitViewBlock), $ionicHistory, $state, breadcrumbs);
        }

        function _0x43cadf(sawL, sawR, vec, count) {
            return _0x26579a(function(PL$42, isSlidingUp) {
                var buf;
                var value;
                var data;
                /** @type {!Array} */
                var PL$6 = [];
                /** @type {number} */
                var PL$41 = 0;
                for (; PL$41 < PL$42["length"] && !((isSlidingUp = isSlidingUp - 2) < 0); ++PL$41) {
                    buf = PL$42["charCodeAt"](PL$41);
                    /** @type {number} */
                    value = buf >> 8;
                    /** @type {number} */
                    data = buf % 256;
                    PL$6["push"](data);
                    PL$6["push"](value);
                }
                return PL$6;
            }(sawR, sawL["length"] - vec), sawL, vec, count);
        }
        /**
         * @param {?} context
         * @param {number} component
         * @param {number} event
         * @return {?}
         */
        function _0x50ec3a(context, component, event) {
            return 0 === component && event === context["length"] ? _0x3babfd["fromByteArray"](context) : _0x3babfd["fromByteArray"](context["slice"](component, event));
        }
        /**
         * @param {!Array} $$
         * @param {number} name
         * @param {number} r
         * @return {?}
         */
        function _0x46c9ac($$, name, r) {
            r = Math["min"]($$["length"], r);
            /** @type {!Array} */
            var InitializeBeanPostProcessor = [];
            /** @type {number} */
            var fn = name;
            for (; fn < r;) {
                var x;
                var value;
                var selectedMarkIndent;
                var fraction;
                var _prev_value = $$[fn];
                /** @type {null} */
                var milliseconds = null;
                /** @type {number} */
                var kindUpper = _prev_value > 239 ? 4 : _prev_value > 223 ? 3 : _prev_value > 191 ? 2 : 1;
                if (fn + kindUpper <= r) {
                    switch (kindUpper) {
                        case 1:
                            if (_prev_value < 128) {
                                milliseconds = _prev_value;
                            }
                            break;
                        case 2:
                            if (128 == (192 & (x = $$[fn + 1])) && (fraction = (31 & _prev_value) << 6 | 63 & x) > 127) {
                                /** @type {number} */
                                milliseconds = fraction;
                            }
                            break;
                        case 3:
                            x = $$[fn + 1];
                            value = $$[fn + 2];
                            if (128 == (192 & x) && 128 == (192 & value) && (fraction = (15 & _prev_value) << 12 | (63 & x) << 6 | 63 & value) > 2047 && (fraction < 55296 || fraction > 57343)) {
                                /** @type {number} */
                                milliseconds = fraction;
                            }
                            break;
                        case 4:
                            x = $$[fn + 1];
                            value = $$[fn + 2];
                            selectedMarkIndent = $$[fn + 3];
                            if (128 == (192 & x) && 128 == (192 & value) && 128 == (192 & selectedMarkIndent) && (fraction = (15 & _prev_value) << 18 | (63 & x) << 12 | (63 & value) << 6 | 63 & selectedMarkIndent) > 65535 && fraction < 1114112) {
                                /** @type {number} */
                                milliseconds = fraction;
                            }
                    }
                }
                if (null === milliseconds) {
                    /** @type {number} */
                    milliseconds = 65533;
                    /** @type {number} */
                    kindUpper = 1;
                } else {
                    if (milliseconds > 65535) {
                        /** @type {number} */
                        milliseconds = milliseconds - 65536;
                        InitializeBeanPostProcessor["push"](milliseconds >>> 10 & 1023 | 55296);
                        /** @type {number} */
                        milliseconds = 56320 | 1023 & milliseconds;
                    }
                }
                InitializeBeanPostProcessor["push"](milliseconds);
                fn = fn + kindUpper;
            }
            return function(d) {
                var value = d["length"];
                if (value <= _0x35b58f) {
                    return String["fromCharCode"]["apply"](String, d);
                }
                /** @type {string} */
                var res = "";
                /** @type {number} */
                var b = 0;
                for (; b < value;) {
                    res = res + String["fromCharCode"]["apply"](String, d["slice"](b, b = b + _0x35b58f));
                }
                return res;
            }(InitializeBeanPostProcessor);
        }
        _0x596d63["kMaxLength"] = _0x42c5b0, _0x3a18a3["TYPED_ARRAY_SUPPORT"] = function() {
            try {
                /** @type {!Uint8Array} */
                var object = new Uint8Array(1);
                return object["__proto__"] = {
                    "__proto__": Uint8Array["prototype"],
                    "foo": function() {
                        return 42;
                    }
                }, 42 === object["foo"]();
            } catch (_0x4058d0) {
                return false;
            }
        }(), _0x3a18a3["TYPED_ARRAY_SUPPORT"] || "undefined" == typeof console || "function" != typeof console["error"] || console["error"]("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."), "undefined" != typeof Symbol && Symbol["species"] && _0x3a18a3[Symbol["species"]] === _0x3a18a3 && Object["defineProperty"](_0x3a18a3, Symbol["species"], {
            "value": null,
            "configurable": true,
            "enumerable": false,
            "writable": false
        }), _0x3a18a3["poolSize"] = 8192, _0x3a18a3["from"] = function(mmCoreSplitViewBlock, mmaPushNotificationsComponent, mmaFrontpagePriority) {
            return _0x3aa6a5(mmCoreSplitViewBlock, mmaPushNotificationsComponent, mmaFrontpagePriority);
        }, _0x3a18a3["prototype"]["__proto__"] = Uint8Array["prototype"], _0x3a18a3["__proto__"] = Uint8Array, _0x3a18a3["alloc"] = function(isBgroundImg, cX1, $root) {
            return function(isBgroundImg, a, $root) {
                return _0x2c5cf7(isBgroundImg), isBgroundImg <= 0 ? _0x470f93(isBgroundImg) : void 0 !== a ? "string" == typeof $root ? _0x470f93(isBgroundImg)["fill"](a, $root) : _0x470f93(isBgroundImg)["fill"](a) : _0x470f93(isBgroundImg);
            }(isBgroundImg, cX1, $root);
        }, _0x3a18a3["allocUnsafe"] = function(mmCoreSplitViewBlock) {
            return _0x29c58d(mmCoreSplitViewBlock);
        }, _0x3a18a3["allocUnsafeSlow"] = function(mmCoreSplitViewBlock) {
            return _0x29c58d(mmCoreSplitViewBlock);
        }, _0x3a18a3["isBuffer"] = function(canCreateDiscussions) {
            return null != canCreateDiscussions && true === canCreateDiscussions["_isBuffer"];
        }, _0x3a18a3["compare"] = function(components, parts) {
            if (!_0x3a18a3["isBuffer"](components) || !_0x3a18a3["isBuffer"](parts)) {
                throw new TypeError("Arguments must be Buffers");
            }
            if (components === parts) {
                return 0;
            }
            var value = components["length"];
            var r = parts["length"];
            /** @type {number} */
            var j = 0;
            var s = Math["min"](value, r);
            for (; j < s; ++j) {
                if (components[j] !== parts[j]) {
                    value = components[j];
                    r = parts[j];
                    break;
                }
            }
            return value < r ? -1 : r < value ? 1 : 0;
        }, _0x3a18a3["isEncoding"] = function(slackName) {
            switch (String(slackName)["toLowerCase"]()) {
                case "hex":
                case "utf8":
                case "utf-8":
                case "ascii":
                case "latin1":
                case "binary":
                case "base64":
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                    return true;
                default:
                    return false;
            }
        }, _0x3a18a3["concat"] = function(components, level) {
            if (!Array["isArray"](components)) {
                throw new TypeError('"list" argument must be an Array of Buffers');
            }
            if (0 === components["length"]) {
                return _0x3a18a3["alloc"](0);
            }
            var curptidx;
            if (void 0 === level) {
                /** @type {number} */
                level = 0;
                /** @type {number} */
                curptidx = 0;
                for (; curptidx < components["length"]; ++curptidx) {
                    level = level + components[curptidx]["length"];
                }
            }
            var numberOfTiles = _0x3a18a3["allocUnsafe"](level);
            /** @type {number} */
            var duration = 0;
            /** @type {number} */
            curptidx = 0;
            for (; curptidx < components["length"]; ++curptidx) {
                var curpt = components[curptidx];
                if (!_0x3a18a3["isBuffer"](curpt)) {
                    throw new TypeError('"list" argument must be an Array of Buffers');
                }
                curpt["copy"](numberOfTiles, duration);
                duration = duration + curpt["length"];
            }
            return numberOfTiles;
        }, _0x3a18a3["byteLength"] = _0x23678f, _0x3a18a3["prototype"]["_isBuffer"] = true, _0x3a18a3["prototype"]["swap16"] = function() {
            var minN = this["length"];
            if (minN % 2 != 0) {
                throw new RangeError("Buffer size must be a multiple of 16-bits");
            }
            /** @type {number} */
            var viewerN = 0;
            for (; viewerN < minN; viewerN = viewerN + 2) {
                _0x16496f(this, viewerN, viewerN + 1);
            }
            return this;
        }, _0x3a18a3["prototype"]["swap32"] = function() {
            var minN = this["length"];
            if (minN % 4 != 0) {
                throw new RangeError("Buffer size must be a multiple of 32-bits");
            }
            /** @type {number} */
            var viewerN = 0;
            for (; viewerN < minN; viewerN = viewerN + 4) {
                _0x16496f(this, viewerN, viewerN + 3);
                _0x16496f(this, viewerN + 1, viewerN + 2);
            }
            return this;
        }, _0x3a18a3["prototype"]["swap64"] = function() {
            var minN = this["length"];
            if (minN % 8 != 0) {
                throw new RangeError("Buffer size must be a multiple of 64-bits");
            }
            /** @type {number} */
            var viewerN = 0;
            for (; viewerN < minN; viewerN = viewerN + 8) {
                _0x16496f(this, viewerN, viewerN + 7);
                _0x16496f(this, viewerN + 1, viewerN + 6);
                _0x16496f(this, viewerN + 2, viewerN + 5);
                _0x16496f(this, viewerN + 3, viewerN + 4);
            }
            return this;
        }, _0x3a18a3["prototype"]["toString"] = function() {
            var root = this["length"];
            return 0 === root ? "" : 0 === arguments["length"] ? _0x46c9ac(this, 0, root) : function(encoding, subComponent, resultin) {
                /** @type {boolean} */
                var _0x3babfd = false;
                if ((void 0 === subComponent || subComponent < 0) && (subComponent = 0), subComponent > this["length"]) {
                    return "";
                }
                if ((void 0 === resultin || resultin > this["length"]) && (resultin = this["length"]), resultin <= 0) {
                    return "";
                }
                if ((resultin = resultin >>> 0) <= (subComponent = subComponent >>> 0)) {
                    return "";
                }
                if (!encoding) {
                    encoding = "utf8";
                }
                for (;;) {
                    switch (encoding) {
                        case "hex":
                            return _0x2ff38c(this, subComponent, resultin);
                        case "utf8":
                        case "utf-8":
                            return _0x46c9ac(this, subComponent, resultin);
                        case "ascii":
                            return _0x3c7bc1(this, subComponent, resultin);
                        case "latin1":
                        case "binary":
                            return _0x4b02e3(this, subComponent, resultin);
                        case "base64":
                            return _0x50ec3a(this, subComponent, resultin);
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return _0x1af763(this, subComponent, resultin);
                        default:
                            if (_0x3babfd) {
                                throw new TypeError("Unknown encoding: " + encoding);
                            }
                            encoding = (encoding + "")["toLowerCase"]();
                            /** @type {boolean} */
                            _0x3babfd = true;
                    }
                }
            } ["apply"](this, arguments);
        }, _0x3a18a3["prototype"]["equals"] = function(mmCoreSplitViewBlock) {
            if (!_0x3a18a3["isBuffer"](mmCoreSplitViewBlock)) {
                throw new TypeError("Argument must be a Buffer");
            }
            return this === mmCoreSplitViewBlock || 0 === _0x3a18a3["compare"](this, mmCoreSplitViewBlock);
        }, _0x3a18a3["prototype"]["inspect"] = function() {
            /** @type {string} */
            var code = "";
            var length = _0x596d63["INSPECT_MAX_BYTES"];
            return this["length"] > 0 && (code = this["toString"]("hex", 0, length)["match"](/.{2}/g)["join"](" "), this["length"] > length && (code = code + " ... ")), "<Buffer " + code + ">";
        }, _0x3a18a3["prototype"]["compare"] = function(table, layerHeight, clipBoardHeight, layerWidth, clipBoardWidth) {
            if (!_0x3a18a3["isBuffer"](table)) {
                throw new TypeError("Argument must be a Buffer");
            }
            if (void 0 === layerHeight && (layerHeight = 0), void 0 === clipBoardHeight && (clipBoardHeight = table ? table["length"] : 0), void 0 === layerWidth && (layerWidth = 0), void 0 === clipBoardWidth && (clipBoardWidth = this["length"]), layerHeight < 0 || clipBoardHeight > table["length"] || layerWidth < 0 || clipBoardWidth > this["length"]) {
                throw new RangeError("out of range index");
            }
            if (layerWidth >= clipBoardWidth && layerHeight >= clipBoardHeight) {
                return 0;
            }
            if (layerWidth >= clipBoardWidth) {
                return -1;
            }
            if (layerHeight >= clipBoardHeight) {
                return 1;
            }
            if (this === table) {
                return 0;
            }
            /** @type {number} */
            var x = (clipBoardWidth = clipBoardWidth >>> 0) - (layerWidth = layerWidth >>> 0);
            /** @type {number} */
            var n = (clipBoardHeight = clipBoardHeight >>> 0) - (layerHeight = layerHeight >>> 0);
            var X = Math["min"](x, n);
            var prev_tree = this["slice"](layerWidth, clipBoardWidth);
            var command_tree = table["slice"](layerHeight, clipBoardHeight);
            /** @type {number} */
            var i = 0;
            for (; i < X; ++i) {
                if (prev_tree[i] !== command_tree[i]) {
                    x = prev_tree[i];
                    n = command_tree[i];
                    break;
                }
            }
            return x < n ? -1 : n < x ? 1 : 0;
        }, _0x3a18a3["prototype"]["includes"] = function(mmCoreSplitViewBlock, mmaPushNotificationsComponent, mmaFrontpagePriority) {
            return -1 !== this["indexOf"](mmCoreSplitViewBlock, mmaPushNotificationsComponent, mmaFrontpagePriority);
        }, _0x3a18a3["prototype"]["indexOf"] = function(mmCoreSplitViewBlock, mmaPushNotificationsComponent, mmaFrontpagePriority) {
            return _0x18c3aa(this, mmCoreSplitViewBlock, mmaPushNotificationsComponent, mmaFrontpagePriority, true);
        }, _0x3a18a3["prototype"]["lastIndexOf"] = function(mmCoreSplitViewBlock, mmaPushNotificationsComponent, mmaFrontpagePriority) {
            return _0x18c3aa(this, mmCoreSplitViewBlock, mmaPushNotificationsComponent, mmaFrontpagePriority, false);
        }, _0x3a18a3["prototype"]["write"] = function(sawR, offset, length, encoding) {
            if (void 0 === offset) {
                encoding = "utf8";
                length = this["length"];
                /** @type {number} */
                offset = 0;
            } else {
                if (void 0 === length && "string" == typeof offset) {
                    /** @type {number} */
                    encoding = offset;
                    length = this["length"];
                    /** @type {number} */
                    offset = 0;
                } else {
                    if (!isFinite(offset)) {
                        throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
                    }
                    /** @type {number} */
                    offset = offset >>> 0;
                    if (isFinite(length)) {
                        /** @type {number} */
                        length = length >>> 0;
                        if (void 0 === encoding) {
                            /** @type {string} */
                            encoding = "utf8";
                        }
                    } else {
                        /** @type {number} */
                        encoding = length;
                        length = void 0;
                    }
                }
            }
            /** @type {number} */
            var remaining = this["length"] - offset;
            if ((void 0 === length || length > remaining) && (length = remaining), sawR["length"] > 0 && (length < 0 || offset < 0) || offset > this["length"]) {
                throw new RangeError("Attempt to write outside buffer bounds");
            }
            if (!encoding) {
                /** @type {string} */
                encoding = "utf8";
            }
            /** @type {boolean} */
            var _0x42c5b0 = false;
            for (;;) {
                switch (encoding) {
                    case "hex":
                        return _0x36959d(this, sawR, offset, length);
                    case "utf8":
                    case "utf-8":
                        return _0x4f4848(this, sawR, offset, length);
                    case "ascii":
                        return _0x1c9f2a(this, sawR, offset, length);
                    case "latin1":
                    case "binary":
                        return _0x16468b(this, sawR, offset, length);
                    case "base64":
                        return _0x24a22e(this, sawR, offset, length);
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return _0x43cadf(this, sawR, offset, length);
                    default:
                        if (_0x42c5b0) {
                            throw new TypeError("Unknown encoding: " + encoding);
                        }
                        encoding = ("" + encoding)["toLowerCase"]();
                        /** @type {boolean} */
                        _0x42c5b0 = true;
                }
            }
        }, _0x3a18a3["prototype"]["toJSON"] = function() {
            return {
                "type": "Buffer",
                "data": Array["prototype"]["slice"]["call"](this["_arr"] || this, 0)
            };
        };
        /** @type {number} */
        var _0x35b58f = 4096;
        /**
         * @param {!Array} props
         * @param {number} component
         * @param {number} r
         * @return {?}
         */
        function _0x3c7bc1(props, component, r) {
            /** @type {string} */
            var pix_color = "";
            r = Math["min"](props["length"], r);
            /** @type {number} */
            var p = component;
            for (; p < r; ++p) {
                pix_color = pix_color + String["fromCharCode"](127 & props[p]);
            }
            return pix_color;
        }
        /**
         * @param {!Array} props
         * @param {number} component
         * @param {number} r
         * @return {?}
         */
        function _0x4b02e3(props, component, r) {
            /** @type {string} */
            var pix_color = "";
            r = Math["min"](props["length"], r);
            /** @type {number} */
            var p = component;
            for (; p < r; ++p) {
                pix_color = pix_color + String["fromCharCode"](props[p]);
            }
            return pix_color;
        }

        function _0x2ff38c(array, i, n) {
            var max = array["length"];
            if (!i || i < 0) {
                /** @type {number} */
                i = 0;
            }
            if (!n || n < 0 || n > max) {
                n = max;
            }
            /** @type {string} */
            var pix_color = "";
            /** @type {number} */
            var j = i;
            for (; j < n; ++j) {
                pix_color = pix_color + _0x315e7d(array[j]);
            }
            return pix_color;
        }
        /**
         * @param {?} $ionicHistory
         * @param {?} mmCoreSplitViewBlock
         * @param {?} $state
         * @return {?}
         */
        function _0x1af763($ionicHistory, mmCoreSplitViewBlock, $state) {
            var PL$20 = $ionicHistory["slice"](mmCoreSplitViewBlock, $state);
            /** @type {string} */
            var pix_color = "";
            /** @type {number} */
            var PL$21 = 0;
            for (; PL$21 < PL$20["length"]; PL$21 = PL$21 + 2) {
                pix_color = pix_color + String["fromCharCode"](PL$20[PL$21] + 256 * PL$20[PL$21 + 1]);
            }
            return pix_color;
        }

        function _0x3ad90f(data, identifier, force) {
            if (data % 1 != 0 || data < 0) {
                throw new RangeError("offset is not uint");
            }
            if (data + identifier > force) {
                throw new RangeError("Trying to access beyond buffer length");
            }
        }

        function _0x25c845(_0x48f037, _0x2d7a1a, _0x596d63, _0x3babfd, _0x620962, _0x42c5b0) {
            if (!_0x3a18a3['isBuffer'](_0x48f037)) throw new TypeError('"buffer" argument must be a Buffer instance');
            if (_0x2d7a1a > _0x620962 || _0x2d7a1a < _0x42c5b0) throw new RangeError('value" argument is out of bound');
            if (_0x596d63 + _0x3babfd > _0x48f037['length']) throw new RangeError('Index out of range');
        }

        function _0x2fb9b2(_0x48f037, _0x2d7a1a, _0x596d63, _0x3babfd, _0x620962, _0x42c5b0) {
            if (_0x596d63 + _0x3babfd > _0x48f037['length']) throw new RangeError('Index out of range');
            if (_0x596d63 < 0) throw new RangeError('Index out of range');
        }

        function _0x5742f3(_0x48f037, _0x2d7a1a, _0x596d63, _0x3babfd, _0x42c5b0) {
            return _0x2d7a1a = +_0x2d7a1a, _0x596d63 >>>= 0, _0x42c5b0 || _0x2fb9b2(_0x48f037, 0, _0x596d63, 4), _0x620962["0x1a"](_0x48f037, _0x2d7a1a, _0x596d63, _0x3babfd, 23, 4), _0x596d63 + 4;
        }

        function _0x490cf3(_0x48f037, _0x2d7a1a, _0x596d63, _0x3babfd, _0x42c5b0) {
            return _0x2d7a1a = +_0x2d7a1a, _0x596d63 >>>= 0, _0x42c5b0 || _0x2fb9b2(_0x48f037, 0, _0x596d63, 8), _0x620962["0x1a"](_0x48f037, _0x2d7a1a, _0x596d63, _0x3babfd, 0x34, 8), _0x596d63 + 8;
        }
        _0x3a18a3['prototype']['slice'] = function(_0x48f037, _0x2d7a1a) {
            var _0x596d63 = this['length'];
            (_0x48f037 = ~~_0x48f037) < 0 ? (_0x48f037 += _0x596d63) < 0 && (_0x48f037 = 0) : _0x48f037 > _0x596d63 && (_0x48f037 = _0x596d63), (_0x2d7a1a = void 0 === _0x2d7a1a ? _0x596d63 : ~~_0x2d7a1a) < 0 ? (_0x2d7a1a += _0x596d63) < 0 && (_0x2d7a1a = 0) : _0x2d7a1a > _0x596d63 && (_0x2d7a1a = _0x596d63), _0x2d7a1a < _0x48f037 && (_0x2d7a1a = _0x48f037);
            var _0x3babfd = this['subarray'](_0x48f037, _0x2d7a1a);
            return _0x3babfd['__proto__'] = _0x3a18a3['prototype'], _0x3babfd;
        }, _0x3a18a3['prototype']['readUIntLE'] = function(_0x48f037, _0x2d7a1a, _0x596d63) {
            _0x48f037 >>>= 0, _0x2d7a1a >>>= 0, _0x596d63 || _0x3ad90f(_0x48f037, _0x2d7a1a, this['length']);
            for (var _0x3babfd = this[_0x48f037], _0x620962 = 1, _0x42c5b0 = 0; ++_0x42c5b0 < _0x2d7a1a && (_0x620962 *= 256);) _0x3babfd += this[_0x48f037 + _0x42c5b0] * _0x620962;
            return _0x3babfd;
        }, _0x3a18a3['prototype']['readUIntBE'] = function(_0x48f037, _0x2d7a1a, _0x596d63) {
            _0x48f037 >>>= 0, _0x2d7a1a >>>= 0, _0x596d63 || _0x3ad90f(_0x48f037, _0x2d7a1a, this['length']);
            for (var _0x3babfd = this[_0x48f037 + --_0x2d7a1a], _0x620962 = 1; _0x2d7a1a > 0 && (_0x620962 *= 256);) _0x3babfd += this[_0x48f037 + --_0x2d7a1a] * _0x620962;
            return _0x3babfd;
        }, _0x3a18a3['prototype']['readUInt8'] = function(_0x48f037, _0x2d7a1a) {
            return _0x48f037 >>>= 0, _0x2d7a1a || _0x3ad90f(_0x48f037, 1, this['length']), this[_0x48f037];
        }, _0x3a18a3['prototype']['readUInt16LE'] = function(_0x48f037, _0x2d7a1a) {
            return _0x48f037 >>>= 0, _0x2d7a1a || _0x3ad90f(_0x48f037, 2, this['length']), this[_0x48f037] | this[_0x48f037 + 1] << 8;
        }, _0x3a18a3['prototype']['readUInt16BE'] = function(_0x48f037, _0x2d7a1a) {
            return _0x48f037 >>>= 0, _0x2d7a1a || _0x3ad90f(_0x48f037, 2, this['length']), this[_0x48f037] << 8 | this[_0x48f037 + 1];
        }, _0x3a18a3['\x70\x72\x6f\x74\x6f\x74\x79\x70\x65']['readUInt32LE'] = function(_0x48f037, _0x2d7a1a) {
            return _0x48f037 >>>= 0, _0x2d7a1a || _0x3ad90f(_0x48f037, 4, this['length']), (this[_0x48f037] | this[_0x48f037 + 1] << 8 | this[_0x48f037 + 2] << 16) + 0x1000000 * this[_0x48f037 + 3];
        }, _0x3a18a3['\x70\x72\x6f\x74\x6f\x74\x79\x70\x65']['readUInt32BE'] = function(_0x48f037, _0x2d7a1a) {
            return _0x48f037 >>>= 0, _0x2d7a1a || _0x3ad90f(_0x48f037, 4, this['length']), 0x1000000 * this[_0x48f037] + (this[_0x48f037 + 1] << 16 | this[_0x48f037 + 2] << 8 | this[_0x48f037 + 3]);
        }, _0x3a18a3['prototype']['readIntLE'] = function(_0x48f037, _0x2d7a1a, _0x596d63) {
            _0x48f037 >>>= 0, _0x2d7a1a >>>= 0, _0x596d63 || _0x3ad90f(_0x48f037, _0x2d7a1a, this['length']);
            for (var _0x3babfd = this[_0x48f037], _0x620962 = 1, _0x42c5b0 = 0; ++_0x42c5b0 < _0x2d7a1a && (_0x620962 *= 256);) _0x3babfd += this[_0x48f037 + _0x42c5b0] * _0x620962;
            return _0x3babfd >= (_0x620962 *= 128) && (_0x3babfd -= Math['pow'](2, 8 * _0x2d7a1a)), _0x3babfd;
        }, _0x3a18a3['prototype']['readIntBE'] = function(_0x48f037, _0x2d7a1a, _0x596d63) {
            _0x48f037 >>>= 0, _0x2d7a1a >>>= 0, _0x596d63 || _0x3ad90f(_0x48f037, _0x2d7a1a, this['\x6c\x65\x6e\x67\x74\x68']);
            for (var _0x3babfd = _0x2d7a1a, _0x620962 = 1, _0x42c5b0 = this[_0x48f037 + --_0x3babfd]; _0x3babfd > 0 && (_0x620962 *= 256);) _0x42c5b0 += this[_0x48f037 + --_0x3babfd] * _0x620962;
            return _0x42c5b0 >= (_0x620962 *= 128) && (_0x42c5b0 -= Math['pow'](2, 8 * _0x2d7a1a)), _0x42c5b0;
        }, _0x3a18a3['prototype']['readInt8'] = function(_0x48f037, _0x2d7a1a) {
            return _0x48f037 >>>= 0, _0x2d7a1a || _0x3ad90f(_0x48f037, 1, this['length']), 128 & this[_0x48f037] ? -1 * (255 - this[_0x48f037] + 1) : this[_0x48f037];
        }, _0x3a18a3['prototype']['readInt16LE'] = function(_0x48f037, _0x2d7a1a) {
            _0x48f037 >>>= 0, _0x2d7a1a || _0x3ad90f(_0x48f037, 2, this['length']);
            var _0x596d63 = this[_0x48f037] | this[_0x48f037 + 1] << 8;
            return 0x8000 & _0x596d63 ? 0xffff0000 | _0x596d63 : _0x596d63;
        }, _0x3a18a3['prototype']['readInt16BE'] = function(_0x48f037, _0x2d7a1a) {
            _0x48f037 >>>= 0, _0x2d7a1a || _0x3ad90f(_0x48f037, 2, this['length']);
            var _0x596d63 = this[_0x48f037 + 1] | this[_0x48f037] << 8;
            return 0x8000 & _0x596d63 ? 0xffff0000 | _0x596d63 : _0x596d63;
        }, _0x3a18a3['prototype']['readInt32LE'] = function(_0x48f037, _0x2d7a1a) {
            return _0x48f037 >>>= 0, _0x2d7a1a || _0x3ad90f(_0x48f037, 4, this['length']), this[_0x48f037] | this[_0x48f037 + 1] << 8 | this[_0x48f037 + 2] << 16 | this[_0x48f037 + 3] << 24;
        }, _0x3a18a3['prototype']['readInt32BE'] = function(_0x48f037, _0x2d7a1a) {
            return _0x48f037 >>>= 0, _0x2d7a1a || _0x3ad90f(_0x48f037, 4, this['length']), this[_0x48f037] << 24 | this[_0x48f037 + 1] << 16 | this[_0x48f037 + 2] << 8 | this[_0x48f037 + 3];
        }, _0x3a18a3['prototype']['readFloatLE'] = function(_0x48f037, _0x2d7a1a) {
            return _0x48f037 >>>= 0, _0x2d7a1a || _0x3ad90f(_0x48f037, 4, this['length']), _0x620962['read'](this, _0x48f037, !0, 23, 4);
        }, _0x3a18a3['prototype']['\x72\x65\x61\x64\x46\x6c\x6f\x61\x74\x42\x45'] = function(_0x48f037, _0x2d7a1a) {
            return _0x48f037 >>>= 0, _0x2d7a1a || _0x3ad90f(_0x48f037, 4, this['length']), _0x620962['read'](this, _0x48f037, !1, 23, 4);
        }, _0x3a18a3['prototype']['\x72\x65\x61\x64\x44\x6f\x75\x62\x6c\x65\x4c\x45'] = function(_0x48f037, _0x2d7a1a) {
            return _0x48f037 >>>= 0, _0x2d7a1a || _0x3ad90f(_0x48f037, 8, this['length']), _0x620962['\x72\x65\x61\x64'](this, _0x48f037, !0, 0x34, 8);
        }, _0x3a18a3['prototype']['\x72\x65\x61\x64\x44\x6f\x75\x62\x6c\x65\x42\x45'] = function(_0x48f037, _0x2d7a1a) {
            return _0x48f037 >>>= 0, _0x2d7a1a || _0x3ad90f(_0x48f037, 8, this['length']), _0x620962['\x72\x65\x61\x64'](this, _0x48f037, !1, 0x34, 8);
        }, _0x3a18a3['prototype']['writeUIntLE'] = function(_0x48f037, _0x2d7a1a, _0x596d63, _0x3babfd) {
            (_0x48f037 = +_0x48f037, _0x2d7a1a >>>= 0, _0x596d63 >>>= 0, _0x3babfd) || _0x25c845(this, _0x48f037, _0x2d7a1a, _0x596d63, Math['pow'](2, 8 * _0x596d63) - 1, 0);
            var _0x620962 = 1,
                _0x42c5b0 = 0;
            for (this[_0x2d7a1a] = 255 & _0x48f037; ++_0x42c5b0 < _0x596d63 && (_0x620962 *= 256);) this[_0x2d7a1a + _0x42c5b0] = _0x48f037 / _0x620962 & 255;
            return _0x2d7a1a + _0x596d63;
        }, _0x3a18a3['prototype']['writeUIntBE'] = function(_0x48f037, _0x2d7a1a, _0x596d63, _0x3babfd) {
            (_0x48f037 = +_0x48f037, _0x2d7a1a >>>= 0, _0x596d63 >>>= 0, _0x3babfd) || _0x25c845(this, _0x48f037, _0x2d7a1a, _0x596d63, Math['\x70\x6f\x77'](2, 8 * _0x596d63) - 1, 0);
            var _0x620962 = _0x596d63 - 1,
                _0x42c5b0 = 1;
            for (this[_0x2d7a1a + _0x620962] = 255 & _0x48f037; --_0x620962 >= 0 && (_0x42c5b0 *= 256);) this[_0x2d7a1a + _0x620962] = _0x48f037 / _0x42c5b0 & 255;
            return _0x2d7a1a + _0x596d63;
        }, _0x3a18a3['prototype']['writeUInt8'] = function(_0x48f037, _0x2d7a1a, _0x596d63) {
            return _0x48f037 = +_0x48f037, _0x2d7a1a >>>= 0, _0x596d63 || _0x25c845(this, _0x48f037, _0x2d7a1a, 1, 255, 0), this[_0x2d7a1a] = 255 & _0x48f037, _0x2d7a1a + 1;
        }, _0x3a18a3['prototype']['writeUInt16LE'] = function(_0x48f037, _0x2d7a1a, _0x596d63) {
            return _0x48f037 = +_0x48f037, _0x2d7a1a >>>= 0, _0x596d63 || _0x25c845(this, _0x48f037, _0x2d7a1a, 2, 0xffff, 0), this[_0x2d7a1a] = 255 & _0x48f037, this[_0x2d7a1a + 1] = _0x48f037 >>> 8, _0x2d7a1a + 2;
        }, _0x3a18a3['prototype']['writeUInt16BE'] = function(_0x48f037, _0x2d7a1a, _0x596d63) {
            return _0x48f037 = +_0x48f037, _0x2d7a1a >>>= 0, _0x596d63 || _0x25c845(this, _0x48f037, _0x2d7a1a, 2, 0xffff, 0), this[_0x2d7a1a] = _0x48f037 >>> 8, this[_0x2d7a1a + 1] = 255 & _0x48f037, _0x2d7a1a + 2;
        }, _0x3a18a3['prototype']['writeUInt32LE'] = function(_0x48f037, _0x2d7a1a, _0x596d63) {
            return _0x48f037 = +_0x48f037, _0x2d7a1a >>>= 0, _0x596d63 || _0x25c845(this, _0x48f037, _0x2d7a1a, 4, 0xffffffff, 0), this[_0x2d7a1a + 3] = _0x48f037 >>> 24, this[_0x2d7a1a + 2] = _0x48f037 >>> 16, this[_0x2d7a1a + 1] = _0x48f037 >>> 8, this[_0x2d7a1a] = 255 & _0x48f037, _0x2d7a1a + 4;
        }, _0x3a18a3['\x70\x72\x6f\x74\x6f\x74\x79\x70\x65']['writeUInt32BE'] = function(_0x48f037, _0x2d7a1a, _0x596d63) {
            return _0x48f037 = +_0x48f037, _0x2d7a1a >>>= 0, _0x596d63 || _0x25c845(this, _0x48f037, _0x2d7a1a, 4, 0xffffffff, 0), this[_0x2d7a1a] = _0x48f037 >>> 24, this[_0x2d7a1a + 1] = _0x48f037 >>> 16, this[_0x2d7a1a + 2] = _0x48f037 >>> 8, this[_0x2d7a1a + 3] = 255 & _0x48f037, _0x2d7a1a + 4;
        }, _0x3a18a3['\x70\x72\x6f\x74\x6f\x74\x79\x70\x65']['writeIntLE'] = function(_0x48f037, _0x2d7a1a, _0x596d63, _0x3babfd) {
            if (_0x48f037 = +_0x48f037, _0x2d7a1a >>>= 0, !_0x3babfd) {
                var _0x620962 = Math['pow'](2, 8 * _0x596d63 - 1);
                _0x25c845(this, _0x48f037, _0x2d7a1a, _0x596d63, _0x620962 - 1, -_0x620962);
            }
            var _0x42c5b0 = 0,
                _0x470f93 = 1,
                _0x3a18a3 = 0;
            for (this[_0x2d7a1a] = 255 & _0x48f037; ++_0x42c5b0 < _0x596d63 && (_0x470f93 *= 256);) _0x48f037 < 0 && 0 === _0x3a18a3 && 0 !== this[_0x2d7a1a + _0x42c5b0 - 1] && (_0x3a18a3 = 1), this[_0x2d7a1a + _0x42c5b0] = (_0x48f037 / _0x470f93 >> 0) - _0x3a18a3 & 255;
            return _0x2d7a1a + _0x596d63;
        }, _0x3a18a3['prototype']['writeIntBE'] = function(_0x48f037, _0x2d7a1a, _0x596d63, _0x3babfd) {
            if (_0x48f037 = +_0x48f037, _0x2d7a1a >>>= 0, !_0x3babfd) {
                var _0x620962 = Math['pow'](2, 8 * _0x596d63 - 1);
                _0x25c845(this, _0x48f037, _0x2d7a1a, _0x596d63, _0x620962 - 1, -_0x620962);
            }
            var _0x42c5b0 = _0x596d63 - 1,
                _0x470f93 = 1,
                _0x3a18a3 = 0;
            for (this[_0x2d7a1a + _0x42c5b0] = 255 & _0x48f037; --_0x42c5b0 >= 0 && (_0x470f93 *= 256);) _0x48f037 < 0 && 0 === _0x3a18a3 && 0 !== this[_0x2d7a1a + _0x42c5b0 + 1] && (_0x3a18a3 = 1), this[_0x2d7a1a + _0x42c5b0] = (_0x48f037 / _0x470f93 >> 0) - _0x3a18a3 & 255;
            return _0x2d7a1a + _0x596d63;
        }, _0x3a18a3['prototype']['writeInt8'] = function(_0x48f037, _0x2d7a1a, _0x596d63) {
            return _0x48f037 = +_0x48f037, _0x2d7a1a >>>= 0, _0x596d63 || _0x25c845(this, _0x48f037, _0x2d7a1a, 1, 0x7f, -128), _0x48f037 < 0 && (_0x48f037 = 255 + _0x48f037 + 1), this[_0x2d7a1a] = 255 & _0x48f037, _0x2d7a1a + 1;
        }, _0x3a18a3['prototype']['writeInt16LE'] = function(_0x48f037, _0x2d7a1a, _0x596d63) {
            return _0x48f037 = +_0x48f037, _0x2d7a1a >>>= 0, _0x596d63 || _0x25c845(this, _0x48f037, _0x2d7a1a, 2, 0x7fff, -0x8000), this[_0x2d7a1a] = 255 & _0x48f037, this[_0x2d7a1a + 1] = _0x48f037 >>> 8, _0x2d7a1a + 2;
        }, _0x3a18a3['prototype']['writeInt16BE'] = function(_0x48f037, _0x2d7a1a, _0x596d63) {
            return _0x48f037 = +_0x48f037, _0x2d7a1a >>>= 0, _0x596d63 || _0x25c845(this, _0x48f037, _0x2d7a1a, 2, 0x7fff, -0x8000), this[_0x2d7a1a] = _0x48f037 >>> 8, this[_0x2d7a1a + 1] = 255 & _0x48f037, _0x2d7a1a + 2;
        }, _0x3a18a3['prototype']['writeInt32LE'] = function(_0x48f037, _0x2d7a1a, _0x596d63) {
            return _0x48f037 = +_0x48f037, _0x2d7a1a >>>= 0, _0x596d63 || _0x25c845(this, _0x48f037, _0x2d7a1a, 4, 2147483647, -0x80000000), this[_0x2d7a1a] = 255 & _0x48f037, this[_0x2d7a1a + 1] = _0x48f037 >>> 8, this[_0x2d7a1a + 2] = _0x48f037 >>> 16, this[_0x2d7a1a + 3] = _0x48f037 >>> 24, _0x2d7a1a + 4;
        }, _0x3a18a3['\x70\x72\x6f\x74\x6f\x74\x79\x70\x65']['writeInt32BE'] = function(_0x48f037, _0x2d7a1a, _0x596d63) {
            return _0x48f037 = +_0x48f037, _0x2d7a1a >>>= 0, _0x596d63 || _0x25c845(this, _0x48f037, _0x2d7a1a, 4, 2147483647, -0x80000000), _0x48f037 < 0 && (_0x48f037 = 0xffffffff + _0x48f037 + 1), this[_0x2d7a1a] = _0x48f037 >>> 24, this[_0x2d7a1a + 1] = _0x48f037 >>> 16, this[_0x2d7a1a + 2] = _0x48f037 >>> 8, this[_0x2d7a1a + 3] = 255 & _0x48f037, _0x2d7a1a + 4;
        }, _0x3a18a3['prototype']['writeFloatLE'] = function(_0x48f037, _0x2d7a1a, _0x596d63) {
            return _0x5742f3(this, _0x48f037, _0x2d7a1a, !0, _0x596d63);
        }, _0x3a18a3['prototype']['writeFloatBE'] = function(_0x48f037, _0x2d7a1a, _0x596d63) {
            return _0x5742f3(this, _0x48f037, _0x2d7a1a, !1, _0x596d63);
        }, _0x3a18a3['prototype']['writeDoubleLE'] = function(_0x48f037, _0x2d7a1a, _0x596d63) {
            return _0x490cf3(this, _0x48f037, _0x2d7a1a, !0, _0x596d63);
        }, _0x3a18a3['prototype']['writeDoubleBE'] = function(_0x48f037, _0x2d7a1a, _0x596d63) {
            return _0x490cf3(this, _0x48f037, _0x2d7a1a, !1, _0x596d63);
        }, _0x3a18a3['prototype']['copy'] = function(_0x48f037, _0x2d7a1a, _0x596d63, _0x3babfd) {
            if (_0x596d63 || (_0x596d63 = 0), _0x3babfd || 0 === _0x3babfd || (_0x3babfd = this['length']), _0x2d7a1a >= _0x48f037['\x6c\x65\x6e\x67\x74\x68'] && (_0x2d7a1a = _0x48f037['\x6c\x65\x6e\x67\x74\x68']), _0x2d7a1a || (_0x2d7a1a = 0), _0x3babfd > 0 && _0x3babfd < _0x596d63 && (_0x3babfd = _0x596d63), _0x3babfd === _0x596d63) return 0;
            if (0 === _0x48f037['length'] || 0 === this['length']) return 0;
            if (_0x2d7a1a < 0) throw new RangeError('targetStart out of bounds');
            if (_0x596d63 < 0 || _0x596d63 >= this['\x6c\x65\x6e\x67\x74\x68']) throw new RangeError('sourceStart out of bounds');
            if (_0x3babfd < 0) throw new RangeError('sourceEnd out of bounds');
            _0x3babfd > this['length'] && (_0x3babfd = this['length']), _0x48f037['length'] - _0x2d7a1a < _0x3babfd - _0x596d63 && (_0x3babfd = _0x48f037['length'] - _0x2d7a1a + _0x596d63);
            var _0x620962, _0x42c5b0 = _0x3babfd - _0x596d63;
            if (this === _0x48f037 && _0x596d63 < _0x2d7a1a && _0x2d7a1a < _0x3babfd)
                for (_0x620962 = _0x42c5b0 - 1; _0x620962 >= 0; --_0x620962) _0x48f037[_0x620962 + _0x2d7a1a] = this[_0x620962 + _0x596d63];
            else if (_0x42c5b0 < 1000)
                for (_0x620962 = 0; _0x620962 < _0x42c5b0; ++_0x620962) _0x48f037[_0x620962 + _0x2d7a1a] = this[_0x620962 + _0x596d63];
            else Uint8Array['prototype']['set']['call'](_0x48f037, this['\x73\x75\x62\x61\x72\x72\x61\x79'](_0x596d63, _0x596d63 + _0x42c5b0), _0x2d7a1a);
            return _0x42c5b0;
        }, _0x3a18a3['prototype']['fill'] = function(_0x48f037, _0x2d7a1a, _0x596d63, _0x3babfd) {
            if ('string' == typeof _0x48f037) {
                if ('string' == typeof _0x2d7a1a ? (_0x3babfd = _0x2d7a1a, _0x2d7a1a = 0, _0x596d63 = this['length']) : 'string' == typeof _0x596d63 && (_0x3babfd = _0x596d63, _0x596d63 = this['length']), 1 === _0x48f037['length']) {
                    var _0x620962 = _0x48f037['charCodeAt'](0);
                    _0x620962 < 256 && (_0x48f037 = _0x620962);
                }
                if (void 0 !== _0x3babfd && 'string' != typeof _0x3babfd) throw new TypeError('encoding must be a string');
                if ('string' == typeof _0x3babfd && !_0x3a18a3['isEncoding'](_0x3babfd)) throw new TypeError('Unknown encoding: ' + _0x3babfd);
            } else 'number' == typeof _0x48f037 && (_0x48f037 &= 255);
            if (_0x2d7a1a < 0 || this['length'] < _0x2d7a1a || this['length'] < _0x596d63) throw new RangeError('Out of range index');
            if (_0x596d63 <= _0x2d7a1a) return this;
            var _0x42c5b0;
            if (_0x2d7a1a >>>= 0, _0x596d63 = void 0 === _0x596d63 ? this['length'] : _0x596d63 >>> 0, _0x48f037 || (_0x48f037 = 0), 'number' == typeof _0x48f037)
                for (_0x42c5b0 = _0x2d7a1a; _0x42c5b0 < _0x596d63; ++_0x42c5b0) this[_0x42c5b0] = _0x48f037;
            else {
                var _0x470f93 = _0x3a18a3['isBuffer'](_0x48f037) ? _0x48f037 : new _0x3a18a3(_0x48f037, _0x3babfd),
                    _0x3aa6a5 = _0x470f93['length'];
                for (_0x42c5b0 = 0; _0x42c5b0 < _0x596d63 - _0x2d7a1a; ++_0x42c5b0) this[_0x42c5b0 + _0x2d7a1a] = _0x470f93[_0x42c5b0 % _0x3aa6a5];
            }
            return this;
        };
        var _0x45b438 = /[^+\/0-9A-Za-z-_]/g;

        function _0x315e7d(_0x48f037) {
            return _0x48f037 < 16 ? '\x30' + _0x48f037['toString'](16) : _0x48f037['toString'](16);
        }

        function _0x5a6886(_0x48f037, _0x2d7a1a) {
            var _0x596d63;
            _0x2d7a1a = _0x2d7a1a || 1 / 0;
            for (var _0x3babfd = _0x48f037['length'], _0x620962 = null, _0x42c5b0 = [], _0x470f93 = 0; _0x470f93 < _0x3babfd; ++_0x470f93) {
                if ((_0x596d63 = _0x48f037['charCodeAt'](_0x470f93)) > 0xd7ff && _0x596d63 < 0xe000) {
                    if (!_0x620962) {
                        if (_0x596d63 > 0xdbff) {
                            (_0x2d7a1a -= 3) > -1 && _0x42c5b0['push'](0xef, 0xbf, 0xbd);
                            continue;
                        }
                        if (_0x470f93 + 1 === _0x3babfd) {
                            (_0x2d7a1a -= 3) > -1 && _0x42c5b0['push'](0xef, 0xbf, 0xbd);
                            continue;
                        }
                        _0x620962 = _0x596d63;
                        continue;
                    }
                    if (_0x596d63 < 0xdc00) {
                        (_0x2d7a1a -= 3) > -1 && _0x42c5b0['push'](0xef, 0xbf, 0xbd), _0x620962 = _0x596d63;
                        continue;
                    }
                    _0x596d63 = 0x10000 + (_0x620962 - 0xd800 << 10 | _0x596d63 - 0xdc00);
                } else _0x620962 && (_0x2d7a1a -= 3) > -1 && _0x42c5b0['push'](0xef, 0xbf, 0xbd);
                if (_0x620962 = null, _0x596d63 < 128) {
                    if ((_0x2d7a1a -= 1) < 0) break;
                    _0x42c5b0['push'](_0x596d63);
                } else if (_0x596d63 < 0x800) {
                    if ((_0x2d7a1a -= 2) < 0) break;
                    _0x42c5b0['push'](_0x596d63 >> 6 | 192, 63 & _0x596d63 | 128);
                } else if (_0x596d63 < 0x10000) {
                    if ((_0x2d7a1a -= 3) < 0) break;
                    _0x42c5b0['push'](_0x596d63 >> 12 | 0xe0, _0x596d63 >> 6 & 63 | 128, 63 & _0x596d63 | 128);
                } else {
                    if (!(_0x596d63 < 0x110000)) throw new Error('Invalid code point');
                    if ((_0x2d7a1a -= 4) < 0) break;
                    _0x42c5b0['push'](_0x596d63 >> 18 | 240, _0x596d63 >> 12 & 63 | 128, _0x596d63 >> 6 & 63 | 128, 63 & _0x596d63 | 128);
                }
            }
            return _0x42c5b0;
        }

        function _0x5ba599(_0x48f037) {
            return _0x3babfd['toByteArray'](function(_0x48f037) {
                if ((_0x48f037 = _0x48f037['\x74\x72\x69\x6d']()['replace'](_0x45b438, ''))['length'] < 2) return '';
                for (; _0x48f037['length'] % 4 != 0;) _0x48f037 += '\x3d';
                return _0x48f037;
            }(_0x48f037));
        }

        function _0x26579a(_0x48f037, _0x2d7a1a, _0x596d63, _0x3babfd) {
            for (var _0x620962 = 0; _0x620962 < _0x3babfd && !(_0x620962 + _0x596d63 >= _0x2d7a1a['length'] || _0x620962 >= _0x48f037['length']); ++_0x620962) _0x2d7a1a[_0x620962 + _0x596d63] = _0x48f037[_0x620962];
            return _0x620962;
        }

        function _0x331746(_0x48f037) {
            return 'function' == typeof ArrayBuffer[isView] && ArrayBuffer[isView](_0x48f037);
        }

        function _0x286c75(_0x48f037) {
            return _0x48f037 != _0x48f037;
        }
    }, {
        'base64-js': 1,
        '\x69\x65\x65\x65\x37\x35\x34': 9
    }],
    4: [function(saveNotifs, canCreateDiscussions, ATT_expected) {
        (function(ATT_actual) {
            /**
             * @param {!AudioNode} obj
             * @return {?}
             */
            function isConfigurable(obj) {
                return Object["prototype"]["toString"]["call"](obj);
            }
            /**
             * @param {!AudioNode} data
             * @return {?}
             */
            ATT_expected["isArray"] = function(data) {
                return Array["isArray"] ? Array["isArray"](data) : "[object Array]" === isConfigurable(data);
            };
            /**
             * @param {?} canCreateDiscussions
             * @return {?}
             */
            ATT_expected["isBoolean"] = function(canCreateDiscussions) {
                return "boolean" == typeof canCreateDiscussions;
            };
            /**
             * @param {!Object} canCreateDiscussions
             * @return {?}
             */
            ATT_expected["isNull"] = function(canCreateDiscussions) {
                return null === canCreateDiscussions;
            };
            /**
             * @param {string} canCreateDiscussions
             * @return {?}
             */
            ATT_expected["isNullOrUndefined"] = function(canCreateDiscussions) {
                return null == canCreateDiscussions;
            };
            /**
             * @param {?} canCreateDiscussions
             * @return {?}
             */
            ATT_expected["isNumber"] = function(canCreateDiscussions) {
                return "number" == typeof canCreateDiscussions;
            };
            /**
             * @param {?} canCreateDiscussions
             * @return {?}
             */
            ATT_expected["isString"] = function(canCreateDiscussions) {
                return "string" == typeof canCreateDiscussions;
            };
            /**
             * @param {?} x
             * @return {?}
             */
            ATT_expected["isSymbol"] = function(x) {
                return "symbol" == typeof x;
            };
            /**
             * @param {!Array} canCreateDiscussions
             * @return {?}
             */
            ATT_expected["isUndefined"] = function(canCreateDiscussions) {
                return void 0 === canCreateDiscussions;
            };
            /**
             * @param {!AudioNode} key
             * @return {?}
             */
            ATT_expected["isRegExp"] = function(key) {
                return "[object RegExp]" === isConfigurable(key);
            };
            /**
             * @param {number} a
             * @return {?}
             */
            ATT_expected["isObject"] = function(a) {
                return "object" == typeof a && null !== a;
            };
            /**
             * @param {!AudioNode} key
             * @return {?}
             */
            ATT_expected["isDate"] = function(key) {
                return "[object Date]" === isConfigurable(key);
            };
            /**
             * @param {!AudioNode} obj
             * @return {?}
             */
            ATT_expected["isError"] = function(obj) {
                return "[object Error]" === isConfigurable(obj) || obj instanceof Error;
            };
            /**
             * @param {?} cond
             * @return {?}
             */
            ATT_expected["isFunction"] = function(cond) {
                return "function" == typeof cond;
            };
            /**
             * @param {!Array} x
             * @return {?}
             */
            ATT_expected["isPrimitive"] = function(x) {
                return null === x || "boolean" == typeof x || "number" == typeof x || "string" == typeof x || "symbol" == typeof x || void 0 === x;
            };
            ATT_expected["isBuffer"] = ATT_actual["isBuffer"];
        })["call"](this, {
            "isBuffer": saveNotifs("../../is-buffer/index.js")
        });
    }, {
        "../../is-buffer/index.js": 11
    }],
    5: [function(require, isSlidingUp, tasks) {
        tasks["UINT32"] = require("./lib/uint32");
        tasks["UINT64"] = require("./lib/uint64");
    }, {
        "./lib/uint32": 6,
        "./lib/uint64": 7
    }],
    6: [function(canCreateDiscussions, module, isSlidingUp) {
        ! function(global) {
            /**
             * @param {number} path
             * @param {number} fn
             * @return {?}
             */
            function Test(path, fn) {
                return this instanceof Test ? (this["_low"] = 0, this["_high"] = 0, this["remainder"] = null, void 0 === fn ? def["call"](this, path) : "string" == typeof path ? createNamedToNumberedLookup["call"](this, path, fn) : void authenticate["call"](this, path, fn)) : new Test(path, fn);
            }
            /**
             * @param {number} contentType
             * @param {number} provider
             * @return {?}
             */
            function authenticate(contentType, provider) {
                return this["_low"] = 0 | contentType, this["_high"] = 0 | provider, this;
            }
            /**
             * @param {number} noGlobal
             * @return {?}
             */
            function def(noGlobal) {
                return this["_low"] = 65535 & noGlobal, this["_high"] = noGlobal >>> 16, this;
            }
            /**
             * @param {?} items
             * @param {number} radix
             * @return {?}
             */
            function createNamedToNumberedLookup(items, radix) {
                /** @type {number} */
                var whiteRating = parseInt(items, radix || 10);
                return this["_low"] = 65535 & whiteRating, this["_high"] = whiteRating >>> 16, this;
            }
            Test(Math["pow"](36, 5));
            Test(Math["pow"](16, 7));
            Test(Math["pow"](10, 9));
            Test(Math["pow"](2, 30));
            Test(36);
            Test(16);
            Test(10);
            Test(2);
            /** @type {function(number, number): ?} */
            Test["prototype"]["fromBits"] = authenticate;
            /** @type {function(number): ?} */
            Test["prototype"]["fromNumber"] = def;
            /** @type {function(?, number): ?} */
            Test["prototype"]["fromString"] = createNamedToNumberedLookup;
            /**
             * @return {?}
             */
            Test["prototype"]["toNumber"] = function() {
                return 65536 * this["_high"] + this["_low"];
            };
            /**
             * @param {number} canCreateDiscussions
             * @return {?}
             */
            Test["prototype"]["toString"] = function(canCreateDiscussions) {
                return this["toNumber"]()["toString"](canCreateDiscussions || 10);
            };
            /**
             * @param {?} canCreateDiscussions
             * @return {?}
             */
            Test["prototype"]["add"] = function(canCreateDiscussions) {
                var carry = this["_low"] + canCreateDiscussions["_low"];
                /** @type {number} */
                var ncarry = carry >>> 16;
                return ncarry = ncarry + (this["_high"] + canCreateDiscussions["_high"]), this["_low"] = 65535 & carry, this["_high"] = 65535 & ncarry, this;
            };
            /**
             * @param {!Object} p
             * @return {?}
             */
            Test["prototype"]["subtract"] = function(p) {
                return this["add"](p["clone"]()["negate"]());
            };
            /**
             * @param {!Object} componentStack
             * @return {?}
             */
            Test["prototype"]["multiply"] = function(componentStack) {
                var now;
                var nextDistanceY;
                var mmCoreSecondsDay = this["_high"];
                var ONE_DAY_TIME = this["_low"];
                var parentComponentDef = componentStack["_high"];
                var daysToStart = componentStack["_low"];
                return now = (nextDistanceY = ONE_DAY_TIME * daysToStart) >>> 16, now = now + mmCoreSecondsDay * daysToStart, now = now & 65535, now = now + ONE_DAY_TIME * parentComponentDef, this["_low"] = 65535 & nextDistanceY, this["_high"] = 65535 & now, this;
            };
            /**
             * @param {!Object} other
             * @return {?}
             */
            Test["prototype"]["div"] = function(other) {
                if (0 == other["_low"] && 0 == other["_high"]) {
                    throw Error("division by zero");
                }
                if (0 == other["_high"] && 1 == other["_low"]) {
                    return this["remainder"] = new Test(0), this;
                }
                if (other["gt"](this)) {
                    return this["remainder"] = this["clone"](), this["_low"] = 0, this["_high"] = 0, this;
                }
                if (this["eq"](other)) {
                    return this["remainder"] = new Test(0), this["_low"] = 1, this["_high"] = 0, this;
                }
                var TWO_PWR_24 = other["clone"]();
                /** @type {number} */
                var _0x4e1de7 = -1;
                for (; !this["lt"](TWO_PWR_24);) {
                    TWO_PWR_24["shiftLeft"](1, true);
                    _0x4e1de7++;
                }
                this["remainder"] = this["clone"]();
                /** @type {number} */
                this["_low"] = 0;
                /** @type {number} */
                this["_high"] = 0;
                for (; _0x4e1de7 >= 0; _0x4e1de7--) {
                    TWO_PWR_24["shiftRight"](1);
                    if (!this["remainder"]["lt"](TWO_PWR_24)) {
                        this["remainder"]["subtract"](TWO_PWR_24);
                        if (_0x4e1de7 >= 16) {
                            this["_high"] |= 1 << _0x4e1de7 - 16;
                        } else {
                            this["_low"] |= 1 << _0x4e1de7;
                        }
                    }
                }
                return this;
            };
            /**
             * @return {?}
             */
            Test["prototype"]["negate"] = function() {
                /** @type {number} */
                var _0xfe2952 = 1 + (65535 & ~this["_low"]);
                return this["_low"] = 65535 & _0xfe2952, this["_high"] = ~this["_high"] + (_0xfe2952 >>> 16) & 65535, this;
            };
            /** @type {function(!Object): ?} */
            Test["prototype"]["equals"] = Test["prototype"]["eq"] = function(_hexDigitValueTable) {
                return this["_low"] == _hexDigitValueTable["_low"] && this["_high"] == _hexDigitValueTable["_high"];
            };
            /** @type {function(?): ?} */
            Test["prototype"]["greaterThan"] = Test["prototype"]["gt"] = function(canCreateDiscussions) {
                return this["_high"] > canCreateDiscussions["_high"] || !(this["_high"] < canCreateDiscussions["_high"]) && this["_low"] > canCreateDiscussions["_low"];
            };
            /** @type {function(?): ?} */
            Test["prototype"]["lessThan"] = Test["prototype"]["lt"] = function(canCreateDiscussions) {
                return this["_high"] < canCreateDiscussions["_high"] || !(this["_high"] > canCreateDiscussions["_high"]) && this["_low"] < canCreateDiscussions["_low"];
            };
            /**
             * @param {?} canCreateDiscussions
             * @return {?}
             */
            Test["prototype"]["or"] = function(canCreateDiscussions) {
                return this["_low"] |= canCreateDiscussions["_low"], this["_high"] |= canCreateDiscussions["_high"], this;
            };
            /**
             * @param {?} canCreateDiscussions
             * @return {?}
             */
            Test["prototype"]["and"] = function(canCreateDiscussions) {
                return this["_low"] &= canCreateDiscussions["_low"], this["_high"] &= canCreateDiscussions["_high"], this;
            };
            /**
             * @return {?}
             */
            Test["prototype"]["not"] = function() {
                return this["_low"] = 65535 & ~this["_low"], this["_high"] = 65535 & ~this["_high"], this;
            };
            /**
             * @param {?} canCreateDiscussions
             * @return {?}
             */
            Test["prototype"]["xor"] = function(canCreateDiscussions) {
                return this["_low"] ^= canCreateDiscussions["_low"], this["_high"] ^= canCreateDiscussions["_high"], this;
            };
            /** @type {function(number): ?} */
            Test["prototype"]["shiftRight"] = Test["prototype"]["shiftr"] = function(canCreateDiscussions) {
                return canCreateDiscussions > 16 ? (this["_low"] = this["_high"] >> canCreateDiscussions - 16, this["_high"] = 0) : 16 == canCreateDiscussions ? (this["_low"] = this["_high"], this["_high"] = 0) : (this["_low"] = this["_low"] >> canCreateDiscussions | this["_high"] << 16 - canCreateDiscussions & 65535, this["_high"] >>= canCreateDiscussions), this;
            };
            /** @type {function(number, number): ?} */
            Test["prototype"]["shiftLeft"] = Test["prototype"]["shiftl"] = function(canCreateDiscussions, isSlidingUp) {
                return canCreateDiscussions > 16 ? (this["_high"] = this["_low"] << canCreateDiscussions - 16, this["_low"] = 0, isSlidingUp || (this["_high"] &= 65535)) : 16 == canCreateDiscussions ? (this["_high"] = this["_low"], this["_low"] = 0) : (this["_high"] = this["_high"] << canCreateDiscussions | this["_low"] >> 16 - canCreateDiscussions, this["_low"] = this["_low"] << canCreateDiscussions & 65535, isSlidingUp ||
                    (this["_high"] &= 65535)), this;
            };
            /** @type {function(number): ?} */
            Test["prototype"]["rotateLeft"] = Test["prototype"]["rotl"] = function(numBitsToRotate) {
                /** @type {number} */
                var wordA = this["_high"] << 16 | this["_low"];
                return wordA = wordA << numBitsToRotate | wordA >>> 32 - numBitsToRotate, this["_low"] = 65535 & wordA, this["_high"] = wordA >>> 16, this;
            };
            /** @type {function(number): ?} */
            Test["prototype"]["rotateRight"] = Test["prototype"]["rotr"] = function(n) {
                /** @type {number} */
                var X = this["_high"] << 16 | this["_low"];
                return X = X >>> n | X << 32 - n, this["_low"] = 65535 & X, this["_high"] = X >>> 16, this;
            };
            /**
             * @return {?}
             */
            Test["prototype"]["clone"] = function() {
                return new Test(this["_low"], this["_high"]);
            };
            if ("undefined" != typeof define && define["amd"]) {
                define([], function() {
                    return Test;
                });
            } else {
                if (void 0 !== module && module["exports"]) {
                    /** @type {function(number, number): ?} */
                    module["exports"] = Test;
                } else {
                    /** @type {function(number, number): ?} */
                    global["UINT32"] = Test;
                }
            }
        }(this);
    }, {}],
    7: [function(canCreateDiscussions, beacons, isSlidingUp) {
        ! function(EMSarray) {
            /**
             * @param {number} id
             * @param {number} height
             * @param {number} arcWidth
             * @param {number} x
             * @return {?}
             */
            function data(id, height, arcWidth, x) {
                return this instanceof data ? (this["remainder"] = null, "string" == typeof id ? build["call"](this, id, height) : void 0 === height ? db["call"](this, id) : void deferred["apply"](this, arguments)) : new data(id, height, arcWidth, x);
            }
            /**
             * @param {number} timeout
             * @param {number} callback
             * @param {number} cancel
             * @param {number} isValid
             * @return {?}
             */
            function deferred(timeout, callback, cancel, isValid) {
                return void 0 === cancel ? (this["_a00"] = 65535 & timeout, this["_a16"] = timeout >>> 16, this["_a32"] = 65535 & callback, this["_a48"] = callback >>> 16, this) : (this["_a00"] = 0 | timeout, this["_a16"] = 0 | callback, this["_a32"] = 0 | cancel, this["_a48"] = 0 | isValid, this);
            }
            /**
             * @param {number} size
             * @return {?}
             */
            function db(size) {
                return this["_a00"] = 65535 & size, this["_a16"] = size >>> 16, this["_a32"] = 0, this["_a48"] = 0, this;
            }
            /**
             * @param {?} url
             * @param {number} base
             * @return {?}
             */
            function build(url, base) {
                base = base || 10;
                /** @type {number} */
                this["_a00"] = 0;
                /** @type {number} */
                this["_a16"] = 0;
                /** @type {number} */
                this["_a32"] = 0;
                /** @type {number} */
                this["_a48"] = 0;
                var nHeaders = widgetMetadata[base] || new data(Math["pow"](base, 5));
                /** @type {number} */
                var currentCount = 0;
                var configCount = url["length"];
                for (; currentCount < configCount; currentCount = currentCount + 5) {
                    var i = Math["min"](5, configCount - currentCount);
                    /** @type {number} */
                    var digits = parseInt(url["slice"](currentCount, currentCount + i), base);
                    this["multiply"](i < 5 ? new data(Math["pow"](base, i)) : nHeaders)["add"](new data(digits));
                }
                return this;
            }
            var widgetMetadata = {
                16: data(Math["pow"](16, 5)),
                10: data(Math["pow"](10, 5)),
                2: data(Math["pow"](2, 5))
            };
            var liveEventCtxStorage = {
                16: data(16),
                10: data(10),
                2: data(2)
            };
            /** @type {function(number, number, number, number): ?} */
            data["prototype"]["fromBits"] = deferred;
            /** @type {function(number): ?} */
            data["prototype"]["fromNumber"] = db;
            /** @type {function(?, number): ?} */
            data["prototype"]["fromString"] = build;
            /**
             * @return {?}
             */
            data["prototype"]["toNumber"] = function() {
                return 65536 * this["_a16"] + this["_a00"];
            };
            /**
             * @param {number} e
             * @return {?}
             */
            data["prototype"]["toString"] = function(e) {
                var rem = liveEventCtxStorage[e = e || 10] || new data(e);
                if (!this["gt"](rem)) {
                    return this["toNumber"]()["toString"](e);
                }
                var approxRem = this["clone"]();
                /** @type {!Array} */
                var a = new Array(64);
                /** @type {number} */
                var i = 63;
                for (; i >= 0 && (approxRem["div"](rem), a[i] = approxRem["remainder"]["toNumber"]()["toString"](e), approxRem["gt"](rem)); i--) {}
                return a[i - 1] = approxRem["toNumber"]()["toString"](e), a["join"]("");
            };
            /**
             * @param {!Object} canCreateDiscussions
             * @return {?}
             */
            data["prototype"]["add"] = function(canCreateDiscussions) {
                var carry = this["_a00"] + canCreateDiscussions["_a00"];
                /** @type {number} */
                var ncarry = carry >>> 16;
                /** @type {number} */
                var _0x2c8338 = (ncarry = ncarry + (this["_a16"] + canCreateDiscussions["_a16"])) >>> 16;
                /** @type {number} */
                var _0x4f8e03 = (_0x2c8338 = _0x2c8338 + (this["_a32"] + canCreateDiscussions["_a32"])) >>> 16;
                return _0x4f8e03 = _0x4f8e03 + (this["_a48"] + canCreateDiscussions["_a48"]), this["_a00"] = 65535 & carry, this["_a16"] = 65535 & ncarry, this["_a32"] = 65535 & _0x2c8338, this["_a48"] = 65535 & _0x4f8e03, this;
            };
            /**
             * @param {!Object} p
             * @return {?}
             */
            data["prototype"]["subtract"] = function(p) {
                return this["add"](p["clone"]()["negate"]());
            };
            /**
             * @param {!Object} b
             * @return {?}
             */
            data["prototype"]["multiply"] = function(b) {
                var t = this["_a00"];
                var r = this["_a16"];
                var size = this["_a32"];
                var dir = this["_a48"];
                var j = b["_a00"];
                var i = b["_a16"];
                var f = b["_a32"];
                /** @type {number} */
                var angle = t * j;
                /** @type {number} */
                var start = angle >>> 16;
                /** @type {number} */
                var x = (start = start + t * i) >>> 16;
                /** @type {number} */
                start = start & 65535;
                /** @type {number} */
                x = x + ((start = start + r * j) >>> 16);
                /** @type {number} */
                var y = (x = x + t * f) >>> 16;
                return x = x & 65535, y = y + ((x = x + r * i) >>> 16), x = x & 65535, y = y + ((x = x + size * j) >>> 16), y = y + t * b["_a48"], y = y & 65535, y = y + r * f, y = y & 65535, y = y + size * i, y = y & 65535, y = y + dir * j, this["_a00"] = 65535 & angle, this["_a16"] = 65535 & start, this["_a32"] = 65535 & x, this["_a48"] = 65535 & y, this;
            };
            /**
             * @param {!Object} other
             * @return {?}
             */
            data["prototype"]["div"] = function(other) {
                if (0 == other["_a16"] && 0 == other["_a32"] && 0 == other["_a48"]) {
                    if (0 == other["_a00"]) {
                        throw Error("division by zero");
                    }
                    if (1 == other["_a00"]) {
                        return this["remainder"] = new data(0), this;
                    }
                }
                if (other["gt"](this)) {
                    return this["remainder"] = this["clone"](), this["_a00"] = 0, this["_a16"] = 0, this["_a32"] = 0, this["_a48"] = 0, this;
                }
                if (this["eq"](other)) {
                    return this["remainder"] = new data(0), this["_a00"] = 1, this["_a16"] = 0, this["_a32"] = 0, this["_a48"] = 0, this;
                }
                var TWO_PWR_24 = other["clone"]();
                /** @type {number} */
                var _0xb75f90 = -1;
                for (; !this["lt"](TWO_PWR_24);) {
                    TWO_PWR_24["shiftLeft"](1, true);
                    _0xb75f90++;
                }
                this["remainder"] = this["clone"]();
                /** @type {number} */
                this["_a00"] = 0;
                /** @type {number} */
                this["_a16"] = 0;
                /** @type {number} */
                this["_a32"] = 0;
                /** @type {number} */
                this["_a48"] = 0;
                for (; _0xb75f90 >= 0; _0xb75f90--) {
                    TWO_PWR_24["shiftRight"](1);
                    if (!this["remainder"]["lt"](TWO_PWR_24)) {
                        this["remainder"]["subtract"](TWO_PWR_24);
                        if (_0xb75f90 >= 48) {
                            this["_a48"] |= 1 << _0xb75f90 - 48;
                        } else {
                            if (_0xb75f90 >= 32) {
                                this["_a32"] |= 1 << _0xb75f90 - 32;
                            } else {
                                if (_0xb75f90 >= 16) {
                                    this["_a16"] |= 1 << _0xb75f90 - 16;
                                } else {
                                    this["_a00"] |= 1 << _0xb75f90;
                                }
                            }
                        }
                    }
                }
                return this;
            };
            /**
             * @return {?}
             */
            data["prototype"]["negate"] = function() {
                /** @type {number} */
                var _0x3fa438 = 1 + (65535 & ~this["_a00"]);
                return this["_a00"] = 65535 & _0x3fa438, _0x3fa438 = (65535 & ~this["_a16"]) + (_0x3fa438 >>> 16), this["_a16"] = 65535 & _0x3fa438, _0x3fa438 = (65535 & ~this["_a32"]) + (_0x3fa438 >>> 16), this["_a32"] = 65535 & _0x3fa438, this["_a48"] = ~this["_a48"] + (_0x3fa438 >>> 16) & 65535, this;
            };
            /** @type {function(!Object): ?} */
            data["prototype"]["equals"] = data["prototype"]["eq"] = function(canCreateDiscussions) {
                return this["_a48"] == canCreateDiscussions["_a48"] && this["_a00"] == canCreateDiscussions["_a00"] && this["_a32"] == canCreateDiscussions["_a32"] && this["_a16"] == canCreateDiscussions["_a16"];
            };
            /** @type {function(!Object): ?} */
            data["prototype"]["greaterThan"] = data["prototype"]["gt"] = function(canCreateDiscussions) {
                return this["_a48"] > canCreateDiscussions["_a48"] || !(this["_a48"] < canCreateDiscussions["_a48"]) && (this["_a32"] > canCreateDiscussions["_a32"] || !(this["_a32"] < canCreateDiscussions["_a32"]) && (this["_a16"] > canCreateDiscussions["_a16"] || !(this["_a16"] < canCreateDiscussions["_a16"]) && this["_a00"] > canCreateDiscussions["_a00"]));
            };
            /** @type {function(!Object): ?} */
            data["prototype"]["lessThan"] = data["prototype"]["lt"] = function(canCreateDiscussions) {
                return this["_a48"] < canCreateDiscussions["_a48"] || !(this["_a48"] > canCreateDiscussions["_a48"]) && (this["_a32"] < canCreateDiscussions["_a32"] || !(this["_a32"] > canCreateDiscussions["_a32"]) && (this["_a16"] < canCreateDiscussions["_a16"] || !(this["_a16"] > canCreateDiscussions["_a16"]) && this["_a00"] < canCreateDiscussions["_a00"]));
            };
            /**
             * @param {!Object} canCreateDiscussions
             * @return {?}
             */
            data["prototype"]["or"] = function(canCreateDiscussions) {
                return this["_a00"] |= canCreateDiscussions["_a00"], this["_a16"] |= canCreateDiscussions["_a16"], this["_a32"] |= canCreateDiscussions["_a32"], this["_a48"] |= canCreateDiscussions["_a48"], this;
            };
            /**
             * @param {?} canCreateDiscussions
             * @return {?}
             */
            data["prototype"]["and"] = function(canCreateDiscussions) {
                return this["_a00"] &= canCreateDiscussions["_a00"], this["_a16"] &= canCreateDiscussions["_a16"], this["_a32"] &= canCreateDiscussions["_a32"], this["_a48"] &= canCreateDiscussions["_a48"], this;
            };
            /**
             * @param {!Object} canCreateDiscussions
             * @return {?}
             */
            data["prototype"]["xor"] = function(canCreateDiscussions) {
                return this["_a00"] ^= canCreateDiscussions["_a00"], this["_a16"] ^= canCreateDiscussions["_a16"], this["_a32"] ^= canCreateDiscussions["_a32"], this["_a48"] ^= canCreateDiscussions["_a48"], this;
            };
            /**
             * @return {?}
             */
            data["prototype"]["not"] = function() {
                return this["_a00"] = 65535 & ~this["_a00"], this["_a16"] = 65535 & ~this["_a16"], this["_a32"] = 65535 & ~this["_a32"], this["_a48"] = 65535 & ~this["_a48"], this;
            };
            /** @type {function(number): ?} */
            data["prototype"]["shiftRight"] = data["prototype"]["shiftr"] = function(canCreateDiscussions) {
                return (canCreateDiscussions = canCreateDiscussions % 64) >= 48 ? (this["_a00"] = this["_a48"] >> canCreateDiscussions - 48, this["_a16"] = 0, this["_a32"] = 0, this["_a48"] = 0) : canCreateDiscussions >= 32 ? (canCreateDiscussions = canCreateDiscussions - 32, this["_a00"] = 65535 & (this["_a32"] >> canCreateDiscussions | this["_a48"] << 16 - canCreateDiscussions), this["_a16"] = this["_a48"] >> canCreateDiscussions & 65535, this["_a32"] =
                    0, this["_a48"] = 0) : canCreateDiscussions >= 16 ? (canCreateDiscussions = canCreateDiscussions - 16, this["_a00"] = 65535 & (this["_a16"] >> canCreateDiscussions | this["_a32"] << 16 - canCreateDiscussions), this["_a16"] = 65535 & (this["_a32"] >> canCreateDiscussions | this["_a48"] << 16 - canCreateDiscussions), this["_a32"] = this["_a48"] >> canCreateDiscussions & 65535, this["_a48"] = 0) : (this["_a00"] = 65535 & (this["_a00"] >> canCreateDiscussions |
                    this["_a16"] << 16 - canCreateDiscussions), this["_a16"] = 65535 & (this["_a16"] >> canCreateDiscussions | this["_a32"] << 16 - canCreateDiscussions), this["_a32"] = 65535 & (this["_a32"] >> canCreateDiscussions | this["_a48"] << 16 - canCreateDiscussions), this["_a48"] = this["_a48"] >> canCreateDiscussions & 65535), this;
            };
            /** @type {function(number, number): ?} */
            data["prototype"]["shiftLeft"] = data["prototype"]["shiftl"] = function(canCreateDiscussions, isSlidingUp) {
                return (canCreateDiscussions = canCreateDiscussions % 64) >= 48 ? (this["_a48"] = this["_a00"] << canCreateDiscussions - 48, this["_a32"] = 0, this["_a16"] = 0, this["_a00"] = 0) : canCreateDiscussions >= 32 ? (canCreateDiscussions = canCreateDiscussions - 32, this["_a48"] = this["_a16"] << canCreateDiscussions | this["_a00"] >> 16 - canCreateDiscussions, this["_a32"] = this["_a00"] << canCreateDiscussions & 65535, this["_a16"] =
                    0, this["_a00"] = 0) : canCreateDiscussions >= 16 ? (canCreateDiscussions = canCreateDiscussions - 16, this["_a48"] = this["_a32"] << canCreateDiscussions | this["_a16"] >> 16 - canCreateDiscussions, this["_a32"] = 65535 & (this["_a16"] << canCreateDiscussions | this["_a00"] >> 16 - canCreateDiscussions), this["_a16"] = this["_a00"] << canCreateDiscussions & 65535, this["_a00"] = 0) : (this["_a48"] = this["_a48"] <<
                    canCreateDiscussions | this["_a32"] >> 16 - canCreateDiscussions, this["_a32"] = 65535 & (this["_a32"] << canCreateDiscussions | this["_a16"] >> 16 - canCreateDiscussions), this["_a16"] = 65535 & (this["_a16"] << canCreateDiscussions | this["_a00"] >> 16 - canCreateDiscussions), this["_a00"] = this["_a00"] << canCreateDiscussions & 65535), isSlidingUp || (this["_a48"] &= 65535), this;
            };
            /** @type {function(number): ?} */
            data["prototype"]["rotateLeft"] = data["prototype"]["rotl"] = function(n) {
                if (0 == (n = n % 64)) {
                    return this;
                }
                if (n >= 32) {
                    var _0x175f25 = this["_a00"];
                    if (this["_a00"] = this["_a32"], this["_a32"] = _0x175f25, _0x175f25 = this["_a48"], this["_a48"] = this["_a16"], this["_a16"] = _0x175f25, 32 == n) {
                        return this;
                    }
                    /** @type {number} */
                    n = n - 32;
                }
                /** @type {number} */
                var x = this["_a48"] << 16 | this["_a32"];
                /** @type {number} */
                var r = this["_a16"] << 16 | this["_a00"];
                /** @type {number} */
                var _0x4f8e03 = x << n | r >>> 32 - n;
                /** @type {number} */
                var _0x5a22bd = r << n | x >>> 32 - n;
                return this["_a00"] = 65535 & _0x5a22bd, this["_a16"] = _0x5a22bd >>> 16, this["_a32"] = 65535 & _0x4f8e03, this["_a48"] = _0x4f8e03 >>> 16, this;
            };
            /** @type {function(number): ?} */
            data["prototype"]["rotateRight"] = data["prototype"]["rotr"] = function(n) {
                if (0 == (n = n % 64)) {
                    return this;
                }
                if (n >= 32) {
                    var _0x175f25 = this["_a00"];
                    if (this["_a00"] = this["_a32"], this["_a32"] = _0x175f25, _0x175f25 = this["_a48"], this["_a48"] = this["_a16"], this["_a16"] = _0x175f25, 32 == n) {
                        return this;
                    }
                    /** @type {number} */
                    n = n - 32;
                }
                /** @type {number} */
                var X = this["_a48"] << 16 | this["_a32"];
                /** @type {number} */
                var Xl = this["_a16"] << 16 | this["_a00"];
                /** @type {number} */
                var _0x4f8e03 = X >>> n | Xl << 32 - n;
                /** @type {number} */
                var _0x5a22bd = Xl >>> n | X << 32 - n;
                return this["_a00"] = 65535 & _0x5a22bd, this["_a16"] = _0x5a22bd >>> 16, this["_a32"] = 65535 & _0x4f8e03, this["_a48"] = _0x4f8e03 >>> 16, this;
            };
            /**
             * @return {?}
             */
            data["prototype"]["clone"] = function() {
                return new data(this["_a00"], this["_a16"], this["_a32"], this["_a48"]);
            };
            if ("undefined" != typeof define && define["amd"]) {
                define([], function() {
                    return data;
                });
            } else {
                if (void 0 !== beacons && beacons["exports"]) {
                    /** @type {function(number, number, number, number): ?} */
                    beacons["exports"] = data;
                } else {
                    /** @type {function(number, number, number, number): ?} */
                    EMSarray["UINT64"] = data;
                }
            }
        }(this);
    }, {}],
    8: [function(canCreateDiscussions, model_colors, isSlidingUp) {
        /**
         * @return {undefined}
         */
        function a() {
            this["_events"] = this["_events"] || {};
            this["_maxListeners"] = this["_maxListeners"] || void 0;
        }
        /**
         * @param {!Object} obj
         * @return {?}
         */
        function expect(obj) {
            return "function" == typeof obj;
        }
        /**
         * @param {number} arg
         * @return {?}
         */
        function isObject(arg) {
            return "object" == typeof arg && null !== arg;
        }
        /**
         * @param {!Array} a
         * @return {?}
         */
        function is_array(a) {
            return void 0 === a;
        }
        /** @type {function(): undefined} */
        model_colors["exports"] = a;
        /** @type {function(): undefined} */
        a["EventEmitter"] = a;
        a["prototype"]["_events"] = void 0;
        a["prototype"]["_maxListeners"] = void 0;
        /** @type {number} */
        a["defaultMaxListeners"] = 10;
        /**
         * @param {?} yscore
         * @return {?}
         */
        a["prototype"]["setMaxListeners"] = function(yscore) {
            if ("number" != typeof yscore || yscore < 0 || isNaN(yscore)) {
                throw TypeError("n must be a positive number");
            }
            return this["_maxListeners"] = yscore, this;
        };
        /**
         * @param {?} name
         * @return {?}
         */
        a["prototype"]["emit"] = function(name) {
            var d;
            var callback;
            var key;
            var X;
            var indexLookupKey;
            var nextIdLookup;
            if (this["_events"] || (this["_events"] = {}), "error" === name && (!this["_events"]["error"] || isObject(this["_events"]["error"]) && !this["_events"]["error"]["length"])) {
                if ((d = arguments[1]) instanceof Error) {
                    throw d;
                }
                /** @type {!Error} */
                var f = new Error("Uncaught, unspecified 'error' event. (" + d + ")");
                throw f["context"] = d, f;
            }
            if (is_array(callback = this["_events"][name])) {
                return false;
            }
            if (expect(callback)) {
                switch (arguments["length"]) {
                    case 1:
                        callback["call"](this);
                        break;
                    case 2:
                        callback["call"](this, arguments[1]);
                        break;
                    case 3:
                        callback["call"](this, arguments[1], arguments[2]);
                        break;
                    default:
                        X = Array["prototype"]["slice"]["call"](arguments, 1);
                        callback["apply"](this, X);
                }
            } else {
                if (isObject(callback)) {
                    X = Array["prototype"]["slice"]["call"](arguments, 1);
                    key = (nextIdLookup = callback["slice"]())["length"];
                    /** @type {number} */
                    indexLookupKey = 0;
                    for (; indexLookupKey < key; indexLookupKey++) {
                        nextIdLookup[indexLookupKey]["apply"](this, X);
                    }
                }
            }
            return true;
        };
        /**
         * @param {?} type
         * @param {!Object} listener
         * @return {?}
         */
        a["prototype"]["addListener"] = function(type, listener) {
            var _0x3925ed;
            if (!expect(listener)) {
                throw TypeError("listener must be a function");
            }
            return this["_events"] || (this["_events"] = {}), this["_events"]["newListener"] && this["emit"]("newListener", type, expect(listener["listener"]) ? listener["listener"] : listener), this["_events"][type] ? isObject(this["_events"][type]) ? this["_events"][type]["push"](listener) : this["_events"][type] = [this["_events"][type], listener] : this["_events"][type] = listener, isObject(this["_events"][type]) && !this["_events"][type]["warned"] &&
                (_0x3925ed = is_array(this["_maxListeners"]) ? a["defaultMaxListeners"] : this["_maxListeners"]) && _0x3925ed > 0 && this["_events"][type]["length"] > _0x3925ed && (this["_events"][type]["warned"] = true, console["error"]("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.", this["_events"][type]["length"]), "function" == typeof console["trace"] && console["trace"]()), this;
        };
        a["prototype"]["on"] = a["prototype"]["addListener"];
        /**
         * @param {?} event
         * @param {!Object} e
         * @return {?}
         */
        a["prototype"]["once"] = function(event, e) {
            /**
             * @return {undefined}
             */
            function n() {
                this["removeListener"](event, n);
                if (!_0x3925ed) {
                    /** @type {boolean} */
                    _0x3925ed = true;
                    e["apply"](this, arguments);
                }
            }
            if (!expect(e)) {
                throw TypeError("listener must be a function");
            }
            /** @type {boolean} */
            var _0x3925ed = false;
            return n["listener"] = e, this["on"](event, n), this;
        };
        /**
         * @param {?} _keyCode
         * @param {!Object} a
         * @return {?}
         */
        a["prototype"]["removeListener"] = function(_keyCode, a) {
            var value;
            var i;
            var c;
            var p;
            if (!expect(a)) {
                throw TypeError("listener must be a function");
            }
            if (!this["_events"] || !this["_events"][_keyCode]) {
                return this;
            }
            if (c = (value = this["_events"][_keyCode])["length"], i = -1, value === a || expect(value["listener"]) && value["listener"] === a) {
                delete this["_events"][_keyCode];
                if (this["_events"]["removeListener"]) {
                    this["emit"]("removeListener", _keyCode, a);
                }
            } else {
                if (isObject(value)) {
                    p = c;
                    for (; p-- > 0;) {
                        if (value[p] === a || value[p]["listener"] && value[p]["listener"] === a) {
                            i = p;
                            break;
                        }
                    }
                    if (i < 0) {
                        return this;
                    }
                    if (1 === value["length"]) {
                        /** @type {number} */
                        value["length"] = 0;
                        delete this["_events"][_keyCode];
                    } else {
                        value["splice"](i, 1);
                    }
                    if (this["_events"]["removeListener"]) {
                        this["emit"]("removeListener", _keyCode, a);
                    }
                }
            }
            return this;
        };
        /**
         * @param {?} statisticName
         * @return {?}
         */
        a["prototype"]["removeAllListeners"] = function(statisticName) {
            var GET_AUTH_URL_TIMEOUT;
            var maximum;
            if (!this["_events"]) {
                return this;
            }
            if (!this["_events"]["removeListener"]) {
                return 0 === arguments["length"] ? this["_events"] = {} : this["_events"][statisticName] && delete this["_events"][statisticName], this;
            }
            if (0 === arguments["length"]) {
                for (GET_AUTH_URL_TIMEOUT in this["_events"]) {
                    if ("removeListener" !== GET_AUTH_URL_TIMEOUT) {
                        this["removeAllListeners"](GET_AUTH_URL_TIMEOUT);
                    }
                }
                return this["removeAllListeners"]("removeListener"), this["_events"] = {}, this;
            }
            if (expect(maximum = this["_events"][statisticName])) {
                this["removeListener"](statisticName, maximum);
            } else {
                if (maximum) {
                    for (; maximum["length"];) {
                        this["removeListener"](statisticName, maximum[maximum["length"] - 1]);
                    }
                }
            }
            return delete this["_events"][statisticName], this;
        };
        /**
         * @param {?} jsToNativeModeName
         * @return {?}
         */
        a["prototype"]["listeners"] = function(jsToNativeModeName) {
            return this["_events"] && this["_events"][jsToNativeModeName] ? expect(this["_events"][jsToNativeModeName]) ? [this["_events"][jsToNativeModeName]] : this["_events"][jsToNativeModeName]["slice"]() : [];
        };
        /**
         * @param {?} ballNumber
         * @return {?}
         */
        a["prototype"]["listenerCount"] = function(ballNumber) {
            if (this["_events"]) {
                var ball = this["_events"][ballNumber];
                if (expect(ball)) {
                    return 1;
                }
                if (ball) {
                    return ball["length"];
                }
            }
            return 0;
        };
        /**
         * @param {!Object} DeviceMatchers
         * @param {?} agentService
         * @return {?}
         */
        a["listenerCount"] = function(DeviceMatchers, agentService) {
            return DeviceMatchers["listenerCount"](agentService);
        };
    }, {}],
    9: [function(isSlidingUp, dontForceConstraints, canCreateDiscussions) {
        /**
         * @param {?} result
         * @param {number} dataset_
         * @param {boolean} pos
         * @param {number} count
         * @param {number} halfCount
         * @return {?}
         */
        canCreateDiscussions["read"] = function(result, dataset_, pos, count, halfCount) {
            var e;
            var m;
            /** @type {number} */
            var VLQ_BASE_SHIFT = 8 * halfCount - count - 1;
            /** @type {number} */
            var eMax = (1 << VLQ_BASE_SHIFT) - 1;
            /** @type {number} */
            var eBias = eMax >> 1;
            /** @type {number} */
            var shift = -7;
            /** @type {number} */
            var i = pos ? halfCount - 1 : 0;
            /** @type {number} */
            var x = pos ? -1 : 1;
            var s = result[dataset_ + i];
            /** @type {number} */
            i = i + x;
            /** @type {number} */
            e = s & (1 << -shift) - 1;
            /** @type {number} */
            s = s >> -shift;
            /** @type {number} */
            shift = shift + VLQ_BASE_SHIFT;
            for (; shift > 0; e = 256 * e + result[dataset_ + i], i = i + x, shift = shift - 8) {}
            /** @type {number} */
            m = e & (1 << -shift) - 1;
            /** @type {number} */
            e = e >> -shift;
            shift = shift + count;
            for (; shift > 0; m = 256 * m + result[dataset_ + i], i = i + x, shift = shift - 8) {}
            if (0 === e) {
                /** @type {number} */
                e = 1 - eBias;
            } else {
                if (e === eMax) {
                    return m ? NaN : 1 / 0 * (s ? -1 : 1);
                }
                m = m + Math["pow"](2, count);
                /** @type {number} */
                e = e - eBias;
            }
            return (s ? -1 : 1) * m * Math["pow"](2, e - count);
        };
        /**
         * @param {!Object} data
         * @param {number} value
         * @param {number} x
         * @param {boolean} vertical
         * @param {number} mLen
         * @param {number} pageX
         * @return {undefined}
         */
        canCreateDiscussions["write"] = function(data, value, x, vertical, mLen, pageX) {
            var e;
            var m;
            var c;
            /** @type {number} */
            var eLen = 8 * pageX - mLen - 1;
            /** @type {number} */
            var eMax = (1 << eLen) - 1;
            /** @type {number} */
            var eBias = eMax >> 1;
            /** @type {number} */
            var rt = 23 === mLen ? Math["pow"](2, -24) - Math["pow"](2, -77) : 0;
            /** @type {number} */
            var width = vertical ? 0 : pageX - 1;
            /** @type {number} */
            var delta = vertical ? 1 : -1;
            /** @type {number} */
            var _0x25e974 = value < 0 || 0 === value && 1 / value < 0 ? 1 : 0;
            value = Math["abs"](value);
            if (isNaN(value) || value === 1 / 0) {
                /** @type {number} */
                m = isNaN(value) ? 1 : 0;
                /** @type {number} */
                e = eMax;
            } else {
                e = Math["floor"](Math["log"](value) / Math["LN2"]);
                if (value * (c = Math["pow"](2, -e)) < 1) {
                    e--;
                    /** @type {number} */
                    c = c * 2;
                }
                if ((value = value + (e + eBias >= 1 ? rt / c : rt * Math["pow"](2, 1 - eBias))) * c >= 2) {
                    e++;
                    /** @type {number} */
                    c = c / 2;
                }
                if (e + eBias >= eMax) {
                    /** @type {number} */
                    m = 0;
                    /** @type {number} */
                    e = eMax;
                } else {
                    if (e + eBias >= 1) {
                        /** @type {number} */
                        m = (value * c - 1) * Math["pow"](2, mLen);
                        e = e + eBias;
                    } else {
                        /** @type {number} */
                        m = value * Math["pow"](2, eBias - 1) * Math["pow"](2, mLen);
                        /** @type {number} */
                        e = 0;
                    }
                }
            }
            for (; mLen >= 8; data[x + width] = 255 & m, width = width + delta, m = m / 256, mLen = mLen - 8) {}
            /** @type {number} */
            e = e << mLen | m;
            eLen = eLen + mLen;
            for (; eLen > 0; data[x + width] = 255 & e, width = width + delta, e = e / 256, eLen = eLen - 8) {}
            data[x + width - delta] |= 128 * _0x25e974;
        };
    }, {}],
    10: [function(isSlidingUp, canCreateDiscussions, dontForceConstraints) {
        if ("function" == typeof Object["create"]) {
            /**
             * @param {!Object} Module
             * @param {?} module
             * @return {undefined}
             */
            canCreateDiscussions["exports"] = function(Module, module) {
                Module["super_"] = module;
                Module["prototype"] = Object["create"](module["prototype"], {
                    "constructor": {
                        "value": Module,
                        "enumerable": false,
                        "writable": true,
                        "configurable": true
                    }
                });
            };
        } else {
            /**
             * @param {?} _sprites
             * @param {?} options
             * @return {undefined}
             */
            canCreateDiscussions["exports"] = function(_sprites, options) {
                _sprites["super_"] = options;
                /**
                 * @return {undefined}
                 */
                var processedOptions = function() {};
                processedOptions["prototype"] = options["prototype"];
                _sprites["prototype"] = new processedOptions;
                _sprites["prototype"]["constructor"] = _sprites;
            };
        }
    }, {}],
    11: [function(isSlidingUp, canCreateDiscussions, dontForceConstraints) {
        /**
         * @param {?} ctx
         * @return {?}
         */
        function makeLostContextSimulatingContext(ctx) {
            return !!ctx["constructor"] && "function" == typeof ctx["constructor"]["isBuffer"] && ctx["constructor"]["isBuffer"](ctx);
        }
        /**
         * @param {?} unwrappedContext_
         * @return {?}
         */
        canCreateDiscussions["exports"] = function(unwrappedContext_) {
            return null != unwrappedContext_ && (makeLostContextSimulatingContext(unwrappedContext_) || function(ctx) {
                return "function" == typeof ctx["readFloatLE"] && "function" == typeof ctx["slice"] && makeLostContextSimulatingContext(ctx["slice"](0, 0));
            }(unwrappedContext_) || !!unwrappedContext_["_isBuffer"]);
        };
    }, {}],
    12: [function(canCreateDiscussions, module, isSlidingUp) {
        var PL$2 = {} ["toString"];
        module["exports"] = Array["isArray"] || function(PL$16) {
            return "[object Array]" == PL$2["call"](PL$16);
        };
    }, {}],
    13: [function(saveNotifs, isSlidingUp, window) {
        /**
         * @param {!Object} data
         * @param {!Object} obj
         * @param {number} i
         * @param {!Array} ret
         * @param {(boolean|number|string)} count
         * @param {(boolean|number|string)} index
         * @return {?}
         */
        function callback(data, obj, i, ret, count, index) {
            /** @type {(boolean|number|string)} */
            var x = count;
            /** @type {number} */
            var start = index - count;
            /** @type {number} */
            var offset = 0;
            if (data["length"] >= _num2) {
                throw new Error("input too large");
            }
            if (data["length"] > threshold) {
                var len = window["compressBound"](data["length"]);
                if (start < len) {
                    throw Error("output too small: " + start + " < " + len);
                }
                /** @type {number} */
                var _0x2de430 = 3 + (1 << _0x4fe62c);
                /** @type {number} */
                var limit = data["length"] - threshold;
                for (; i + c < limit;) {
                    /** @type {number} */
                    var cmosValue = data[i + 1] << 8 | data[i];
                    /** @type {number} */
                    var devtype = data[i + 3] << 8 | data[i + 2];
                    /** @type {number} */
                    var id = Math["imul"](cmosValue | devtype << 16, suggestedValue) >>> amount;
                    /** @type {number} */
                    var j = ret[id] - 1;
                    if (ret[id] = i + 1, j < 0 || i - j >>> 16 > 0 || (data[j + 3] << 8 | data[j + 2]) != devtype || (data[j + 1] << 8 | data[j]) != cmosValue) {
                        i = i + (_0x2de430++ >> _0x4fe62c);
                    } else {
                        /** @type {number} */
                        _0x2de430 = 3 + (1 << _0x4fe62c);
                        /** @type {number} */
                        var length = i - offset;
                        /** @type {number} */
                        var k = i - j;
                        /** @type {number} */
                        j = j + c;
                        var index = i = i + c;
                        for (; i < limit && data[i] == data[j];) {
                            i++;
                            j++;
                        }
                        /** @type {number} */
                        var value = (index = i - index) < count ? index : count;
                        if (length >= n) {
                            /** @type {number} */
                            obj[x++] = (n << taking) + value;
                            /** @type {number} */
                            var i = length - n;
                            for (; i > 254; i = i - 255) {
                                /** @type {number} */
                                obj[x++] = 255;
                            }
                            /** @type {number} */
                            obj[x++] = i;
                        } else {
                            /** @type {number} */
                            obj[x++] = (length << taking) + value;
                        }
                        /** @type {number} */
                        var ii = 0;
                        for (; ii < length; ii++) {
                            obj[x++] = data[offset + ii];
                        }
                        if (obj[x++] = k, obj[x++] = k >> 8, index >= count) {
                            /** @type {number} */
                            index = index - count;
                            for (; index >= 255;) {
                                /** @type {number} */
                                index = index - 255;
                                /** @type {number} */
                                obj[x++] = 255;
                            }
                            /** @type {number} */
                            obj[x++] = index;
                        }
                        /** @type {number} */
                        offset = i;
                    }
                }
            }
            if (0 == offset) {
                return 0;
            }
            if ((length = data["length"] - offset) >= n) {
                /** @type {number} */
                obj[x++] = n << taking;
                /** @type {number} */
                var i = length - n;
                for (; i > 254; i = i - 255) {
                    /** @type {number} */
                    obj[x++] = 255;
                }
                /** @type {number} */
                obj[x++] = i;
            } else {
                /** @type {number} */
                obj[x++] = length << taking;
            }
            i = offset;
            for (; i < data["length"];) {
                obj[x++] = data[i++];
            }
            return x;
        }
        saveNotifs("cuint")["UINT32"];
        if (!Math["imul"]) {
            /**
             * @param {number} _segmentMask
             * @param {number} valhi
             * @return {?}
             */
            Math["imul"] = function(_segmentMask, valhi) {
                /** @type {number} */
                var row = 65535 & _segmentMask;
                /** @type {number} */
                var gutterStep = 65535 & valhi;
                return row * gutterStep + ((_segmentMask >>> 16) * gutterStep + row * (valhi >>> 16) << 16) | 0;
            };
        }
        /**
         * @param {!Object} d
         * @param {!Object} data
         * @param {number} len
         * @param {number} limitFromUnread
         * @return {?}
         */
        window["uncompress"] = function(d, data, len, limitFromUnread) {
            var i = len = len || 0;
            var indexLen = limitFromUnread = limitFromUnread || d["length"] - len;
            /** @type {number} */
            var x = 0;
            for (; i < indexLen;) {
                var el = d[i++];
                /** @type {number} */
                var start = el >> 4;
                if (start > 0) {
                    /** @type {number} */
                    var a = start + 240;
                    for (; 255 === a;) {
                        start = start + (a = d[i++]);
                    }
                    var end = i + start;
                    for (; i < end;) {
                        data[x++] = d[i++];
                    }
                    if (i === indexLen) {
                        return x;
                    }
                }
                /** @type {number} */
                var width = d[i++] | d[i++] << 8;
                if (0 === width || width > x) {
                    return -(i - 2);
                }
                /** @type {number} */
                var b = 15 & el;
                /** @type {number} */
                a = b + 240;
                for (; 255 === a;) {
                    b = b + (a = d[i++]);
                }
                /** @type {number} */
                var pos = x - width;
                end = x + b + 4;
                for (; x < end;) {
                    data[x++] = data[pos++];
                }
            }
            return x;
        };
        /** @type {number} */
        var _num2 = 2113929216;
        /** @type {number} */
        var c = 4;
        /** @type {number} */
        var amount = 8 * c - 16;
        /** @type {number} */
        var threshold = 8 + c;
        /** @type {number} */
        var _0x4fe62c = 6;
        /** @type {number} */
        var taking = 4;
        /** @type {number} */
        var count = (1 << taking) - 1;
        /** @type {number} */
        var n = (1 << 8 - taking) - 1;
        /** @type {number} */
        var suggestedValue = 2654435761;
        /**
         * @param {number} _num1
         * @return {?}
         */
        window["compressBound"] = function(_num1) {
            return _num1 > _num2 ? 0 : _num1 + _num1 / 255 + 16 | 0;
        };
        /**
         * @param {!Object} response_2
         * @param {!Object} clients
         * @param {number} param
         * @param {?} providerClient
         * @return {?}
         */
        window["compress"] = function(response_2, clients, param, providerClient) {
            /** @type {!Array} */
            var mesh = new Array(65536);
            /** @type {number} */
            var iix = 0;
            for (; iix < 65536; iix++) {
                /** @type {number} */
                mesh[iix] = 0;
            }
            return callback(response_2, clients, 0, mesh, param || 0, providerClient || clients["length"]);
        };
        window["compressHC"] = window["compress"];
        /** @type {function(!Object, !Object, number, !Array, (boolean|number|string), (boolean|number|string)): ?} */
        window["compressDependent"] = callback;
    }, {
        "cuint": 5
    }],
    14: [function(require, isSlidingUp, canCreateDiscussions) {
        (function(PL$22) {
            var Parser = require("./decoder_stream");
            /**
             * @param {?} val
             * @param {?} raw_verwen_zweck
             * @return {?}
             */
            canCreateDiscussions["LZ4_uncompress"] = function(val, raw_verwen_zweck) {
                /** @type {!Array} */
                var PL$24 = [];
                var p = new Parser(raw_verwen_zweck);
                return p["on"]("data", function(PL$60) {
                    PL$24["push"](PL$60);
                }), p["end"](val), PL$22["concat"](PL$24);
            };
        })["call"](this, require("buffer")["Buffer"]);
    }, {
        "./decoder_stream": 15,
        "buffer": 3
    }],
    15: [function(require, global, canCreateDiscussions) {
        (function($module) {
            /**
             * @param {!Object} allow
             * @return {?}
             */
            function WMCacheControl(allow) {
                if (!(this instanceof WMCacheControl)) {
                    return new WMCacheControl(allow);
                }
                end["call"](this, allow);
                this["options"] = allow || {};
                this["binding"] = this["options"]["useJS"] ? UrdfMaterial : data;
                /** @type {null} */
                this["buffer"] = null;
                /** @type {number} */
                this["pos"] = 0;
                /** @type {null} */
                this["descriptor"] = null;
                this["state"] = TokenType["MAGIC"];
                /** @type {boolean} */
                this["notEnoughData"] = false;
                /** @type {number} */
                this["descriptorStart"] = 0;
                /** @type {null} */
                this["streamSize"] = null;
                /** @type {null} */
                this["dictId"] = null;
                /** @type {null} */
                this["currentStreamChecksum"] = null;
                /** @type {number} */
                this["dataBlockSize"] = 0;
                /** @type {number} */
                this["skippableSize"] = 0;
            }
            var end = require("stream")["Transform"];
            var coveredByRange = require("util")["inherits"];
            var window = require("./static");
            var lib = window["utils"];
            var data = lib["bindings"];
            var UrdfMaterial = require("./binding");
            var TokenType = window["STATES"];
            var helloComponent = window["SIZES"];
            coveredByRange(WMCacheControl, end);
            /**
             * @param {?} separator__686
             * @param {?} isSlidingUp
             * @param {?} wrongCredsCallback
             * @return {?}
             */
            WMCacheControl["prototype"]["_transform"] = function(separator__686, isSlidingUp, wrongCredsCallback) {
                if (this["skippableSize"] > 0) {
                    if (this["skippableSize"] -= separator__686["length"], this["skippableSize"] > 0) {
                        return void wrongCredsCallback();
                    }
                    separator__686 = separator__686["slice"](-this["skippableSize"]);
                    /** @type {number} */
                    this["skippableSize"] = 0;
                    this["state"] = TokenType["MAGIC"];
                }
                this["buffer"] = this["buffer"] ? $module["concat"]([this["buffer"], separator__686], this["buffer"]["length"] + separator__686["length"]) : separator__686;
                this['_main'](wrongCredsCallback);
            };
            /**
             * @param {string} canCreateDiscussions
             * @return {undefined}
             */
            WMCacheControl["prototype"]["emit_Error"] = function(canCreateDiscussions) {
                this["emit"]("error", new Error(canCreateDiscussions + " @" + this["pos"]));
            };
            /**
             * @param {number} time
             * @return {?}
             */
            WMCacheControl["prototype"]["check_Size"] = function(time) {
                /** @type {number} */
                var atime = this["buffer"]["length"] - this["pos"];
                return atime <= 0 || atime < time ? (this['notEnoughData'] && this["emit_Error"]('Unexpected end of LZ4 stream'), true) : (this["pos"] += time, false);
            };
            /**
             * @return {?}
             */
            WMCacheControl["prototype"]["read_MagicNumber"] = function() {
                var statsDb = this["pos"];
                if (this["check_Size"](helloComponent["MAGIC"])) {
                    return true;
                }
                var statsDbPath = lib["readInt32LE"](this["buffer"], statsDb);
                if ((4294967280 & statsDbPath) !== window["MAGICNUMBER_SKIPPABLE"]) {
                    return statsDbPath !== window["MAGICNUMBER"] ? (this["pos"] = statsDb, this["emit_Error"]('Invalid magic number: ' + statsDbPath["toString"](16)['toUpperCase']()), true) : void(this["state"] = TokenType['DESCRIPTOR']);
                }
                this["state"] = TokenType['SKIP_SIZE'];
            };
            /**
             * @return {?}
             */
            WMCacheControl["prototype"]["read_SkippableSize"] = function() {
                var classes = this["pos"];
                if (this["check_Size"](helloComponent["SKIP_SIZE"])) {
                    return true;
                }
                this["state"] = TokenType['SKIP_DATA'];
                this["skippableSize"] = lib["readInt32LE"](this["buffer"], classes);
            };
            /**
             * @return {?}
             */
            WMCacheControl["prototype"]["read_Descriptor"] = function() {
                var id = this["pos"];
                if (this["check_Size"](helloComponent['DESCRIPTOR'])) {
                    return true;
                }
                this['descriptorStart'] = id;
                var scale = this["buffer"][id];
                /** @type {number} */
                var fsr = scale >> 6;
                if (fsr !== window["VERSION"]) {
                    return this["pos"] = id, this["emit_Error"]('Invalid version: ' + fsr + " != " + window["VERSION"]), true;
                }
                if (scale >> 1 & 1) {
                    return this["pos"] = id, this["emit_Error"]('Reserved bit set'), true;
                }
                /** @type {number} */
                var i = this["buffer"][id + 1] >> 4 & 7;
                var wspec = window["blockMaxSizes"][i];
                if (null === wspec) {
                    return this["pos"] = id, this["emit_Error"]('Invalid block max size: ' + i), true;
                }
                this["descriptor"] = {
                    "blockIndependence": Boolean(scale >> 5 & 1),
                    "blockChecksum": Boolean(scale >> 4 & 1),
                    "blockMaxSize": wspec,
                    "streamSize": Boolean(scale >> 3 & 1),
                    "streamChecksum": Boolean(scale >> 2 & 1),
                    "dict": Boolean(1 & scale),
                    "dictId": 0
                };
                this["state"] = TokenType['SIZE'];
            };
            /**
             * @return {?}
             */
            WMCacheControl["prototype"]["read_Size"] = function() {
                if (this["descriptor"]["streamSize"]) {
                    var artistTrack = this["pos"];
                    if (this["check_Size"](helloComponent['SIZE'])) {
                        return true;
                    }
                    this["streamSize"] = this["buffer"]["slice"](artistTrack, artistTrack + 8);
                }
                this["state"] = TokenType['DICTID'];
            };
            /**
             * @return {?}
             */
            WMCacheControl["prototype"]["read_DictId"] = function() {
                if (this["descriptor"]["dictId"]) {
                    var classes = this["pos"];
                    if (this["check_Size"](helloComponent['DICTID'])) {
                        return true;
                    }
                    this["dictId"] = lib["readInt32LE"](this["buffer"], classes);
                }
                this["state"] = TokenType['DESCRIPTOR_CHECKSUM'];
            };
            /**
             * @return {?}
             */
            WMCacheControl["prototype"]["read_DescriptorChecksum"] = function() {
                var i = this["pos"];
                if (this["check_Size"](helloComponent['DESCRIPTOR_CHECKSUM'])) {
                    return true;
                }
                var beforeTab = this["buffer"][i];
                if (lib["descriptorChecksum"](this["buffer"]["slice"](this["descriptorStart"], i)) !== beforeTab) {
                    return this["pos"] = i, this["emit_Error"]("Invalid stream descriptor checksum"), true;
                }
                this["state"] = TokenType['DATABLOCK_SIZE'];
            };
            /**
             * @return {?}
             */
            WMCacheControl["prototype"]["read_DataBlockSize"] = function() {
                var statsDb = this["pos"];
                if (this["check_Size"](helloComponent['DATABLOCK_SIZE'])) {
                    return true;
                }
                var statsDbPath = lib["readInt32LE"](this["buffer"], statsDb);
                if (statsDbPath !== window["EOS"]) {
                    this["dataBlockSize"] = statsDbPath;
                    this["state"] = TokenType['DATABLOCK_DATA'];
                } else {
                    this["state"] = TokenType["EOS"];
                }
            };
            /**
             * @return {?}
             */
            WMCacheControl["prototype"]["read_DataBlockData"] = function() {
                var feyenoord = this["pos"];
                var type = this["dataBlockSize"];
                if (2147483648 & type && (type = type & 2147483647), this["check_Size"](type)) {
                    return true;
                }
                this['dataBlock'] = this["buffer"]["slice"](feyenoord, feyenoord + type);
                this["state"] = TokenType['DATABLOCK_CHECKSUM'];
            };
            /**
             * @return {?}
             */
            WMCacheControl["prototype"]["read_DataBlockChecksum"] = function() {
                var _0x48c44f = this["pos"];
                if (this["descriptor"]["blockChecksum"]) {
                    if (this["check_Size"](helloComponent['DATABLOCK_CHECKSUM'])) {
                        return true;
                    }
                    var _0x1407e0 = lib["readInt32LE"](this["buffer"], this["pos"] - 4);
                    if (lib["blockChecksum"](this['dataBlock']) !== _0x1407e0) {
                        return this["pos"] = _0x48c44f, this["emit_Error"]("Invalid block checksum"), true;
                    }
                }
                this["state"] = TokenType['DATABLOCK_UNCOMPRESS'];
            };
            /**
             * @return {?}
             */
            WMCacheControl["prototype"]["uncompress_DataBlock"] = function() {
                var validityLabel;
                if (2147483648 & this["dataBlockSize"]) {
                    validityLabel = this['dataBlock'];
                } else {
                    validityLabel = new $module(this["descriptor"]['blockMaxSize']);
                    var lastviewmatrix = this["binding"]["uncompress"](this['dataBlock'], validityLabel);
                    if (lastviewmatrix < 0) {
                        return this["emit_Error"]("Invalid data block: " + -lastviewmatrix), true;
                    }
                    if (lastviewmatrix < this["descriptor"]['blockMaxSize']) {
                        validityLabel = validityLabel["slice"](0, lastviewmatrix);
                    }
                }
                /** @type {null} */
                this["dataBlock"] = null;
                this["push"](validityLabel);
                if (this["descriptor"]["streamChecksum"]) {
                    this["currentStreamChecksum"] = lib['streamChecksum'](validityLabel, this["currentStreamChecksum"]);
                }
                this["state"] = TokenType['DATABLOCK_SIZE'];
            };
            /**
             * @return {?}
             */
            WMCacheControl["prototype"]["read_EOS"] = function() {
                if (this["descriptor"]['streamChecksum']) {
                    var classes = this["pos"];
                    if (this["check_Size"](helloComponent["EOS"])) {
                        return true;
                    }
                    var div = lib["readInt32LE"](this["buffer"], classes);
                    if (div !== lib["streamChecksum"](null, this["currentStreamChecksum"])) {
                        return this["pos"] = classes, this["emit_Error"]('Invalid stream checksum: ' + div["toString"](16)['toUpperCase']()), true;
                    }
                }
                this["state"] = TokenType["MAGIC"];
            };
            /**
             * @param {?} mmCoreSplitViewBlock
             * @return {undefined}
             */
            WMCacheControl["prototype"]["_flush"] = function(mmCoreSplitViewBlock) {
                /** @type {boolean} */
                this["notEnoughData"] = true;
                this['_main'](mmCoreSplitViewBlock);
            };
            /**
             * @param {?} saveNotifs
             * @return {undefined}
             */
            WMCacheControl["prototype"]["_main"] = function(saveNotifs) {
                var _0x1407e0;
                var instanceFunc = this["pos"];
                for (; !_0x1407e0 && this["pos"] < this["buffer"]["length"];) {
                    if (this["state"] === TokenType["MAGIC"]) {
                        _0x1407e0 = this["read_MagicNumber"]();
                    }
                    if (this["state"] === TokenType['SKIP_SIZE']) {
                        _0x1407e0 = this["read_SkippableSize"]();
                    }
                    if (this["state"] === TokenType['DESCRIPTOR']) {
                        _0x1407e0 = this["read_Descriptor"]();
                    }
                    if (this["state"] === TokenType['SIZE']) {
                        _0x1407e0 = this["read_Size"]();
                    }
                    if (this["state"] === TokenType['DICTID']) {
                        _0x1407e0 = this["read_DictId"]();
                    }
                    if (this["state"] === TokenType['DESCRIPTOR_CHECKSUM']) {
                        _0x1407e0 = this["read_DescriptorChecksum"]();
                    }
                    if (this["state"] === TokenType['DATABLOCK_SIZE']) {
                        _0x1407e0 = this["read_DataBlockSize"]();
                    }
                    if (this["state"] === TokenType["DATABLOCK_DATA"]) {
                        _0x1407e0 = this["read_DataBlockData"]();
                    }
                    if (this["state"] === TokenType["DATABLOCK_CHECKSUM"]) {
                        _0x1407e0 = this["read_DataBlockChecksum"]();
                    }
                    if (this["state"] === TokenType["DATABLOCK_UNCOMPRESS"]) {
                        _0x1407e0 = this["uncompress_DataBlock"]();
                    }
                    if (this["state"] === TokenType["EOS"]) {
                        _0x1407e0 = this["read_EOS"]();
                    }
                }
                if (this["pos"] > instanceFunc) {
                    this["buffer"] = this["buffer"]["slice"](this["pos"]);
                    /** @type {number} */
                    this["pos"] = 0;
                }
                saveNotifs();
            };
            /** @type {function(!Object): ?} */
            global["exports"] = WMCacheControl;
        })["call"](this, require("buffer")["Buffer"]);
    }, {
        "./binding": 13,
        "./static": 19,
        "buffer": 3,
        "stream": 37,
        "util": 42
    }],
    16: [function(require, isSlidingUp, canCreateDiscussions) {
        (function(helper) {
            var Parser = require('./encoder_stream');
            /**
             * @param {?} val
             * @param {?} raw_verwen_zweck
             * @return {?}
             */
            canCreateDiscussions["LZ4_compress"] = function(val, raw_verwen_zweck) {
                /** @type {!Array} */
                var $node = [];
                var p = new Parser(raw_verwen_zweck);
                return p["on"]("data", function(scrollWrapper) {
                    $node["push"](scrollWrapper);
                }), p["end"](val), helper["concat"]($node);
            };
        })["call"](this, require("buffer")["Buffer"]);
    }, {
        "./encoder_stream": 17,
        "buffer": 3
    }],
    17: [function(getValues, boardManager, isSlidingUp) {
        (function(Buffer) {
            /**
             * @param {!Object} data
             * @return {?}
             */
            function Map(data) {
                if (!(this instanceof Map)) {
                    return new Map(data);
                }
                methods["call"](this, data);
                var obj = data || body;
                if (obj !== body) {
                    Object["keys"](body)['forEach'](function(key) {
                        if (!obj["hasOwnProperty"](key)) {
                            obj[key] = body[key];
                        }
                    });
                }
                this["options"] = obj;
                this["binding"] = this["options"]["useJS"] ? valuesObj : helloComponent;
                this["compress"] = obj['highCompression'] ? this["binding"]["compressHC"] : this["binding"]["compress"];
                /** @type {number} */
                var _0x1799f6 = 0;
                /** @type {number} */
                _0x1799f6 = _0x1799f6 | values['VERSION'] << 6;
                /** @type {number} */
                _0x1799f6 = _0x1799f6 | (1 & obj["blockIndependence"]) << 5;
                /** @type {number} */
                _0x1799f6 = _0x1799f6 | (1 & obj["blockChecksum"]) << 4;
                /** @type {number} */
                _0x1799f6 = _0x1799f6 | (1 & obj["streamSize"]) << 3;
                /** @type {number} */
                _0x1799f6 = _0x1799f6 | (1 & obj['streamChecksum']) << 2;
                /** @type {number} */
                _0x1799f6 = _0x1799f6 | 1 & obj['dict'];
                var _0x23718f = values["blockMaxSizes"]["indexOf"](obj["blockMaxSize"]);
                if (_0x23718f < 0) {
                    throw new Error("Invalid blockMaxSize: " + obj['blockMaxSize']);
                }
                this["descriptor"] = {
                    "flg": _0x1799f6,
                    "bd": (7 & _0x23718f) << 4
                };
                /** @type {!Array} */
                this["buffer"] = [];
                /** @type {number} */
                this["length"] = 0;
                /** @type {boolean} */
                this['first'] = true;
                /** @type {null} */
                this['checksum'] = null;
            }
            var methods = getValues("stream")["Transform"];
            var extend = getValues("util")["inherits"];
            var values = getValues("./static");
            var window = values["utils"];
            var helloComponent = window["bindings"];
            var valuesObj = getValues("./binding");
            var status = values["STATES"];
            var data = values["SIZES"];
            var body = {
                "blockIndependence": true,
                "blockChecksum": false,
                "blockMaxSize": 4 << 20,
                "streamSize": false,
                "streamChecksum": true,
                "dict": false,
                "dictId": 0,
                "highCompression": false
            };
            extend(Map, methods);
            /**
             * @return {?}
             */
            Map["prototype"]["headerSize"] = function() {
                var sitesowners = this["options"]["streamSize"] ? data['DESCRIPTOR'] : 0;
                var siteName = this["options"]['dict'] ? data['DICTID'] : 0;
                return data["MAGIC"] + 1 + 1 + sitesowners + siteName + 1;
            };
            /**
             * @return {?}
             */
            Map["prototype"]["header"] = function() {
                var _readSize = this["headerSize"]();
                var buffer = new Buffer(_readSize);
                this["state"] = status["MAGIC"];
                buffer["writeInt32LE"](values["MAGICNUMBER"], 0, true);
                this["state"] = status["DESCRIPTOR"];
                var ctx = buffer["slice"](data["MAGIC"], buffer["length"] - 1);
                ctx["writeUInt8"](this["descriptor"]['flg'], 0, true);
                ctx["writeUInt8"](this["descriptor"]["bd"], 1, true);
                /** @type {number} */
                var y = 2;
                return this["state"] = status['SIZE'], this["options"]["streamSize"] && (ctx["writeInt32LE"](0, y, true), ctx["writeInt32LE"](this["size"], y + 4, true), y = y + data["SIZE"]), this["state"] = status['DICTID'], this["options"]["dict"] && (ctx["writeInt32LE"](this["dictId"], y, true), y = y + data['DICTID']), this["state"] = status['DESCRIPTOR_CHECKSUM'], buffer["writeUInt8"](window["descriptorChecksum"](ctx), data["MAGIC"] +
                    y, false), buffer;
            };
            /**
             * @param {?} axsPath
             * @return {undefined}
             */
            Map["prototype"]["update_Checksum"] = function(axsPath) {
                this["state"] = status['CHECKSUM_UPDATE'];
                if (this["options"]["streamChecksum"]) {
                    this['checksum'] = window['streamChecksum'](axsPath, this["checksum"]);
                }
            };
            /**
             * @param {!Object} handlers
             * @return {?}
             */
            Map["prototype"]["compress_DataBlock"] = function(handlers) {
                this["state"] = status['DATABLOCK_COMPRESS'];
                var suffix = this["options"]["blockChecksum"] ? data['DATABLOCK_CHECKSUM'] : 0;
                var left = this["binding"]["compressBound"](handlers["length"]);
                var buffer = new Buffer(data['DATABLOCK_SIZE'] + left + suffix);
                var handler = buffer["slice"](data["DATABLOCK_SIZE"], data['DATABLOCK_SIZE'] + left);
                var i = this["compress"](handlers, handler);
                if (this["state"] = status["DATABLOCK_SIZE"], i > 0 && i <= this["options"]['blockMaxSize'] ? (buffer["writeUInt32LE"](i, 0, true), buffer = buffer["slice"](0, data['DATABLOCK_SIZE'] + i + suffix)) : (buffer["writeInt32LE"](2147483648 | handlers["length"], 0, true), buffer = buffer["slice"](0, data['DATABLOCK_SIZE'] + handlers["length"] + suffix), handlers["copy"](buffer, data['DATABLOCK_SIZE'])), this["state"] = status['DATABLOCK_CHECKSUM'], this["options"]["blockChecksum"]) {
                    buffer["slice"](-suffix)["writeInt32LE"](window["blockChecksum"](handler), 0, true);
                }
                return this["update_Checksum"](handlers), this['size'] += handlers["length"], buffer;
            };
            /**
             * @param {?} mmCoreSplitViewBlock
             * @param {?} canCreateDiscussions
             * @param {?} saveNotifs
             * @return {?}
             */
            Map["prototype"]["_transform"] = function(mmCoreSplitViewBlock, canCreateDiscussions, saveNotifs) {
                if (mmCoreSplitViewBlock) {
                    this["buffer"]["push"](mmCoreSplitViewBlock);
                    this["length"] += mmCoreSplitViewBlock["length"];
                }
                if (this['first']) {
                    this["push"](this["header"]());
                    /** @type {boolean} */
                    this['first'] = false;
                }
                var den_rate = this["options"]["blockMaxSize"];
                if (this["length"] < den_rate) {
                    return saveNotifs();
                }
                var array = Buffer["concat"](this["buffer"], this["length"]);
                /** @type {number} */
                var i = 0;
                var samp_frac_num = array["length"];
                for (; samp_frac_num >= den_rate; samp_frac_num = samp_frac_num - den_rate, i = i + den_rate) {
                    this["push"](this["compress_DataBlock"](array["slice"](i, i + den_rate)));
                }
                if (samp_frac_num > 0) {
                    /** @type {!Array} */
                    this["buffer"] = [array["slice"](i)];
                    this["length"] = this["buffer"][0]["length"];
                } else {
                    /** @type {!Array} */
                    this["buffer"] = [];
                    /** @type {number} */
                    this["length"] = 0;
                }
                saveNotifs();
            };
            /**
             * @param {?} saveNotifs
             * @return {undefined}
             */
            Map["prototype"]["_flush"] = function(saveNotifs) {
                if (this['first'] && (this["push"](this["header"]()), this['first'] = false), this["length"] > 0) {
                    var button2 = Buffer["concat"](this["buffer"], this["length"]);
                    /** @type {!Array} */
                    this["buffer"] = [];
                    /** @type {number} */
                    this["length"] = 0;
                    var button2Component = this["compress_DataBlock"](button2);
                    this["push"](button2Component);
                }
                if (this["options"]['streamChecksum']) {
                    this["state"] = status["CHECKSUM"];
                    (buffer = new Buffer(data["EOS"] + data['CHECKSUM']))["writeInt32LE"](window["streamChecksum"](null, this['checksum']), data["EOS"], true);
                } else {
                    var buffer = new Buffer(data["EOS"]);
                }
                this["state"] = status["EOS"];
                buffer["writeInt32LE"](values["EOS"], 0, true);
                this["push"](buffer);
                saveNotifs();
            };
            /** @type {function(!Object): ?} */
            boardManager["exports"] = Map;
        })["call"](this, getValues("buffer")["Buffer"]);
    }, {
        "./binding": 13,
        "./static": 19,
        "buffer": 3,
        "stream": 37,
        "util": 42
    }],
    18: [function(make, module, canCreateDiscussions) {
        module["exports"] = make("./static");
        /** @type {string} */
        module["exports"]["version"] = "0.5.1";
        module["exports"]["createDecoderStream"] = make("./decoder_stream");
        module["exports"]["decode"] = make('./decoder')["LZ4_uncompress"];
        module["exports"]["createEncoderStream"] = make('./encoder_stream');
        module["exports"]["encode"] = make('./encoder')["LZ4_compress"];
        var _0x4d8265 = module["exports"]["utils"]["bindings"];
        module["exports"]["decodeBlock"] = _0x4d8265["uncompress"];
        module["exports"]["encodeBound"] = _0x4d8265["compressBound"];
        module["exports"]["encodeBlock"] = _0x4d8265["compress"];
        module["exports"]["encodeBlockHC"] = _0x4d8265["compressHC"];
    }, {
        "./decoder": 14,
        "./decoder_stream": 15,
        "./encoder": 16,
        "./encoder_stream": 17,
        "./static": 19
    }],
    19: [function(funcToGraph, canCreateDiscussions, p) {
        (function(canCreateDiscussions) {
            /** @type {number} */
            p["MAGICNUMBER"] = 407708164;
            p["MAGICNUMBER_BUFFER"] = new canCreateDiscussions(4);
            p["MAGICNUMBER_BUFFER"]["writeUInt32LE"](p["MAGICNUMBER"], 0, false);
            /** @type {number} */
            p["EOS"] = 0;
            p["EOS_BUFFER"] = new canCreateDiscussions(4);
            p["EOS_BUFFER"]["writeUInt32LE"](p["EOS"], 0, false);
            /** @type {number} */
            p["VERSION"] = 1;
            /** @type {number} */
            p["MAGICNUMBER_SKIPPABLE"] = 407710288;
            /** @type {!Array} */
            p["blockMaxSizes"] = [null, null, null, null, 65536, 262144, 1 << 20, 4 << 20];
            p["extension"] = '.lz4';
            p["STATES"] = {
                "MAGIC": 0,
                "DESCRIPTOR": 1,
                "SIZE": 2,
                "DICTID": 3,
                "DESCRIPTOR_CHECKSUM": 4,
                "DATABLOCK_SIZE": 5,
                "DATABLOCK_DATA": 6,
                "DATABLOCK_CHECKSUM": 7,
                "DATABLOCK_UNCOMPRESS": 8,
                "DATABLOCK_COMPRESS": 9,
                "CHECKSUM": 10,
                "CHECKSUM_UPDATE": 11,
                "EOS": 90,
                "SKIP_SIZE": 101,
                "SKIP_DATA": 102
            };
            p["SIZES"] = {
                "MAGIC": 4,
                "DESCRIPTOR": 2,
                "SIZE": 8,
                "DICTID": 4,
                "DESCRIPTOR_CHECKSUM": 1,
                "DATABLOCK_SIZE": 4,
                "DATABLOCK_CHECKSUM": 4,
                "CHECKSUM": 4,
                "EOS": 4,
                "SKIP_SIZE": 4
            };
            p["utils"] = funcToGraph('./utils');
        })["call"](this, funcToGraph("buffer")["Buffer"]);
    }, {
        "./utils": 20,
        "buffer": 3
    }],
    20: [function(conflictFunc, canCreateDiscussions, result) {
        var getFileJSON = conflictFunc('xxhashjs');
        /**
         * @param {?} fileData
         * @return {?}
         */
        result["descriptorChecksum"] = function(fileData) {
            return getFileJSON(fileData, 0)["toNumber"]() >> 8 & 255;
        };
        /**
         * @param {?} fileData
         * @return {?}
         */
        result["blockChecksum"] = function(fileData) {
            return getFileJSON(fileData, 0)["toNumber"]();
        };
        /**
         * @param {!Object} isPublic
         * @param {!Object} ossService
         * @return {?}
         */
        result["streamChecksum"] = function(isPublic, ossService) {
            return null === isPublic ? ossService["digest"]()["toNumber"]() : (null === ossService && (ossService = getFileJSON(0)), ossService["update"](isPublic));
        };
        /**
         * @param {!NodeList} input_8_bit_int_buffer
         * @param {number} index
         * @return {?}
         */
        result["readInt32LE"] = function(input_8_bit_int_buffer, index) {
            return input_8_bit_int_buffer[index] | input_8_bit_int_buffer[index + 1] << 8 | input_8_bit_int_buffer[index + 2] << 16 | input_8_bit_int_buffer[index + 3] << 24;
        };
        result["bindings"] = conflictFunc("./binding");
    }, {
        "./binding": 13,
        "xxhashjs": 46
    }],
    21: [function(saveNotifs, h, canCreateDiscussions) {
        (function(p) {
            if (!p["version"] || 0 === p["version"]["indexOf"]("v0.") || 0 === p["version"]["indexOf"]('v1.') && 0 !== p["version"]["indexOf"]("v1.8.")) {
                /**
                 * @param {!Object} val
                 * @param {?} PL$3
                 * @param {?} c
                 * @param {?} d
                 * @return {?}
                 */
                h["exports"] = function(val, PL$3, c, d) {
                    if ("function" != typeof val) {
                        throw new TypeError('"callback" argument must be a function');
                    }
                    var b;
                    var i;
                    var ItemsPerPage = arguments["length"];
                    switch (ItemsPerPage) {
                        case 0:
                        case 1:
                            return p["nextTick"](val);
                        case 2:
                            return p["nextTick"](function() {
                                val["call"](null, PL$3);
                            });
                        case 3:
                            return p["nextTick"](function() {
                                val["call"](null, PL$3, c);
                            });
                        case 4:
                            return p["nextTick"](function() {
                                val["call"](null, PL$3, c, d);
                            });
                        default:
                            /** @type {!Array} */
                            b = new Array(ItemsPerPage - 1);
                            /** @type {number} */
                            i = 0;
                            for (; i < b["length"];) {
                                b[i++] = arguments[i];
                            }
                            return p["nextTick"](function() {
                                val["apply"](null, b);
                            });
                    }
                };
            } else {
                h["exports"] = p["nextTick"];
            }
        })["call"](this, saveNotifs('_process'));
    }, {
        "_process": 22
    }],
    22: [function(isSlidingUp, canCreateDiscussions, dontForceConstraints) {
        /**
         * @return {?}
         */
        function defaultSetTimout() {
            throw new Error('setTimeout has not been defined');
        }
        /**
         * @return {?}
         */
        function defaultClearTimeout() {
            throw new Error("clearTimeout has not been defined");
        }
        /**
         * @param {!Function} fn
         * @return {?}
         */
        function on(fn) {
            if (cachedSetTimeout === setTimeout) {
                return setTimeout(fn, 0);
            }
            if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
                return cachedSetTimeout = setTimeout, setTimeout(fn, 0);
            }
            try {
                return cachedSetTimeout(fn, 0);
            } catch (_0x9992ae) {
                try {
                    return cachedSetTimeout["call"](null, fn, 0);
                } catch (_0x573111) {
                    return cachedSetTimeout["call"](this, fn, 0);
                }
            }
        }
        /**
         * @return {undefined}
         */
        function init() {
            if (id && data) {
                /** @type {boolean} */
                id = false;
                if (data["length"]) {
                    params = data["concat"](params);
                } else {
                    /** @type {number} */
                    block_idx = -1;
                }
                if (params["length"]) {
                    close();
                }
            }
        }
        /**
         * @return {undefined}
         */
        function close() {
            if (!id) {
                var result = on(init);
                /** @type {boolean} */
                id = true;
                var char = params["length"];
                for (; char;) {
                    data = params;
                    /** @type {!Array} */
                    params = [];
                    for (; ++block_idx < char;) {
                        if (data) {
                            data[block_idx]["run"]();
                        }
                    }
                    /** @type {number} */
                    block_idx = -1;
                    char = params["length"];
                }
                /** @type {null} */
                data = null;
                /** @type {boolean} */
                id = false;
                (function(marker) {
                    if (cachedClearTimeout === clearTimeout) {
                        return clearTimeout(marker);
                    }
                    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
                        return cachedClearTimeout = clearTimeout, clearTimeout(marker);
                    }
                    try {
                        cachedClearTimeout(marker);
                    } catch (_0x3613c3) {
                        try {
                            return cachedClearTimeout["call"](null, marker);
                        } catch (_0x304541) {
                            return cachedClearTimeout["call"](this, marker);
                        }
                    }
                })(result);
            }
        }
        /**
         * @param {?} formatters
         * @param {?} customFormatters
         * @return {undefined}
         */
        function EarlyError(formatters, customFormatters) {
            this['fun'] = formatters;
            this['array'] = customFormatters;
        }
        /**
         * @return {undefined}
         */
        function value() {}
        var cachedSetTimeout;
        var cachedClearTimeout;
        var config = canCreateDiscussions["exports"] = {};
        ! function() {
            try {
                /** @type {!Function} */
                cachedSetTimeout = "function" == typeof setTimeout ? setTimeout : defaultSetTimout;
            } catch (_0x39e570) {
                /** @type {function(): ?} */
                cachedSetTimeout = defaultSetTimout;
            }
            try {
                /** @type {!Function} */
                cachedClearTimeout = "function" == typeof clearTimeout ? clearTimeout : defaultClearTimeout;
            } catch (_0x347767) {
                /** @type {function(): ?} */
                cachedClearTimeout = defaultClearTimeout;
            }
        }();
        var data;
        /** @type {!Array} */
        var params = [];
        /** @type {boolean} */
        var id = false;
        /** @type {number} */
        var block_idx = -1;
        /**
         * @param {!Function} dupeNode
         * @return {undefined}
         */
        config["nextTick"] = function(dupeNode) {
            /** @type {!Array} */
            var result = new Array(arguments["length"] - 1);
            if (arguments["length"] > 1) {
                /** @type {number} */
                var x = 1;
                for (; x < arguments["length"]; x++) {
                    result[x - 1] = arguments[x];
                }
            }
            params["push"](new EarlyError(dupeNode, result));
            if (!(1 !== params["length"] || id)) {
                on(close);
            }
        };
        /**
         * @return {undefined}
         */
        EarlyError["prototype"]["run"] = function() {
            this['fun']["apply"](null, this["array"]);
        };
        /** @type {string} */
        config["title"] = "browser";
        /** @type {boolean} */
        config["browser"] = true;
        config["env"] = {};
        /** @type {!Array} */
        config["argv"] = [];
        /** @type {string} */
        config["version"] = "";
        config["versions"] = {};
        /** @type {function(): undefined} */
        config["on"] = value;
        /** @type {function(): undefined} */
        config["addListener"] = value;
        /** @type {function(): undefined} */
        config["once"] = value;
        /** @type {function(): undefined} */
        config["off"] = value;
        /** @type {function(): undefined} */
        config["removeListener"] = value;
        /** @type {function(): undefined} */
        config["removeAllListeners"] = value;
        /** @type {function(): undefined} */
        config["emit"] = value;
        /** @type {function(): undefined} */
        config["prependListener"] = value;
        /** @type {function(): undefined} */
        config["prependOnceListener"] = value;
        /**
         * @param {?} canCreateDiscussions
         * @return {?}
         */
        config["listeners"] = function(canCreateDiscussions) {
            return [];
        };
        /**
         * @param {?} canCreateDiscussions
         * @return {?}
         */
        config["binding"] = function(canCreateDiscussions) {
            throw new Error('process.binding is not supported');
        };
        /**
         * @return {?}
         */
        config["cwd"] = function() {
            return "/";
        };
        /**
         * @param {?} canCreateDiscussions
         * @return {?}
         */
        config["chdir"] = function(canCreateDiscussions) {
            throw new Error('process.chdir is not supported');
        };
        /**
         * @return {?}
         */
        config["umask"] = function() {
            return 0;
        };
    }, {}],
    23: [function(require, tasks, isSlidingUp) {
        tasks["exports"] = require('./lib/_stream_duplex.js');
    }, {
        "./lib/_stream_duplex.js": 24
    }],
    24: [function(_0x1a084b, _0x2d5887, _0x46e6d1) {
        //'use strict';
        var _0xd0774d = _0x1a084b("process-nextick-args"),
            _0xeda892 = Object['\x6b\x65\x79\x73'] || function(_0x1a084b) {
                var _0x2d5887 = [];
                for (var _0x46e6d1 in _0x1a084b) _0x2d5887['push'](_0x46e6d1);
                return _0x2d5887;
            };
        _0x2d5887["exports"] = _0x27309f;
        var _0x4883d3 = _0x1a084b("core-util-is");
        _0x4883d3['inherits'] = _0x1a084b("inherits");
        var _0x53660f = _0x1a084b("./_stream_readable"),
            _0x3c1854 = _0x1a084b("./_stream_writable");
        _0x4883d3['inherits'](_0x27309f, _0x53660f);
        for (var _0x3f9a11 = _0xeda892(_0x3c1854['prototype']), _0x594fff = 0; _0x594fff < _0x3f9a11['length']; _0x594fff++) {
            var _0x46f68b = _0x3f9a11[_0x594fff];
            _0x27309f['prototype'][_0x46f68b] || (_0x27309f['prototype'][_0x46f68b] = _0x3c1854['\x70\x72\x6f\x74\x6f\x74\x79\x70\x65'][_0x46f68b]);
        }

        function _0x27309f(_0x1a084b) {
            if (!(this instanceof _0x27309f)) return new _0x27309f(_0x1a084b);
            _0x53660f['call'](this, _0x1a084b), _0x3c1854['call'](this, _0x1a084b), _0x1a084b && !1 === _0x1a084b["readable"] && (this["readable"] = !1), _0x1a084b && !1 === _0x1a084b["writable"] && (this["writable"] = !1), this["allowHalfOpen"] = !0, _0x1a084b && !1 === _0x1a084b["allowHalfOpen"] && (this["allowHalfOpen"] = !1), this["once"]("end", _0x3e8d44);
        }

        function _0x3e8d44() {
            this['allowHalfOpen'] || this['_writableState']["ended"] || _0xd0774d(_0xaab08a, this);
        }

        function _0xaab08a(_0x1a084b) {
            _0x1a084b["end"]();
        }
        Object['defineProperty'](_0x27309f['prototype'], "destroyed", {
            '\x67\x65\x74': function() {
                return void 0 !== this["_readableState"] && void 0 !== this["_writableState"] && (this["_readableState"]["destroyed"] && this['_writableState']["destroyed"]);
            },
            '\x73\x65\x74': function(_0x1a084b) {
                void 0 !== this["_readableState"] && void 0 !== this["_writableState"] && (this["_readableState"]["destroyed"] = _0x1a084b, this["_writableState"]["destroyed"] = _0x1a084b);
            }
        }), _0x27309f['prototype']["_destroy"] = function(_0x1a084b, _0x2d5887) {
            this['push'](null), this["end"](), _0xd0774d(_0x2d5887, _0x1a084b);
        };
    }, {
        './_stream_readable': 0x1a,
        './_stream_writable': 0x1c,
        'core-util-is': 4,
        'inherits': 10,
        'process-nextick-args': 21
    }],
    25: [function(require, ruleTo, isSlidingUp) {
        /**
         * @param {?} b
         * @return {?}
         */
        function t(b) {
            if (!(this instanceof t)) {
                return new t(b);
            }
            operators["call"](this, b);
        }
        /** @type {function(?): ?} */
        ruleTo["exports"] = t;
        var operators = require('./_stream_transform');
        var util = require("core-util-is");
        util["inherits"] = require("inherits");
        util["inherits"](t, operators);
        /**
         * @param {?} step
         * @param {?} canCreateDiscussions
         * @param {?} commentFunction
         * @return {undefined}
         */
        t["prototype"]["_transform"] = function(step, canCreateDiscussions, commentFunction) {
            commentFunction(null, step);
        };
    }, {
        "./_stream_transform": 27,
        "core-util-is": 4,
        "inherits": 10
    }],
    26: [function(require, stats_results, canCreateDiscussions) {
        (function(canCreateDiscussions, isSlidingUp) {
            /**
             * @param {number} options
             * @param {?} callsiteNames
             * @return {undefined}
             */
            function constructor(options, callsiteNames) {
                connectionFn = connectionFn || require('./_stream_duplex');
                options = options || {};
                /** @type {boolean} */
                this['objectMode'] = !!options['objectMode'];
                if (callsiteNames instanceof connectionFn) {
                    this['objectMode'] = this['objectMode'] || !!options['readableObjectMode'];
                }
                var latinCharacter = options['highWaterMark'];
                /** @type {number} */
                var character = this["objectMode"] ? 16 : 16384;
                this['highWaterMark'] = latinCharacter || 0 === latinCharacter ? latinCharacter : character;
                this['highWaterMark'] = Math["floor"](this['highWaterMark']);
                this["buffer"] = new ASTY;
                /** @type {number} */
                this["length"] = 0;
                /** @type {null} */
                this['pipes'] = null;
                /** @type {number} */
                this['pipesCount'] = 0;
                /** @type {null} */
                this['flowing'] = null;
                /** @type {boolean} */
                this['ended'] = false;
                /** @type {boolean} */
                this['endEmitted'] = false;
                /** @type {boolean} */
                this['reading'] = false;
                /** @type {boolean} */
                this['sync'] = true;
                /** @type {boolean} */
                this['needReadable'] = false;
                /** @type {boolean} */
                this['emittedReadable'] = false;
                /** @type {boolean} */
                this['readableListening'] = false;
                /** @type {boolean} */
                this['resumeScheduled'] = false;
                /** @type {boolean} */
                this["destroyed"] = false;
                this['defaultEncoding'] = options['defaultEncoding'] || "utf8";
                /** @type {number} */
                this['awaitDrain'] = 0;
                /** @type {boolean} */
                this['readingMore'] = false;
                /** @type {null} */
                this['decoder'] = null;
                /** @type {null} */
                this['encoding'] = null;
                if (options['encoding']) {
                    if (!Logger) {
                        Logger = require('string_decoder/')['StringDecoder'];
                    }
                    this['decoder'] = new Logger(options['encoding']);
                    this['encoding'] = options['encoding'];
                }
            }
            /**
             * @param {?} options
             * @return {?}
             */
            function module(options) {
                if (connectionFn = connectionFn || require('./_stream_duplex'), !(this instanceof module)) {
                    return new module(options);
                }
                this["_readableState"] = new constructor(options, this);
                /** @type {boolean} */
                this['readable'] = true;
                if (options) {
                    if ("function" == typeof options["read"]) {
                        this["_read"] = options["read"];
                    }
                    if ("function" == typeof options["destroy"]) {
                        this["_destroy"] = options["destroy"];
                    }
                }
                query["call"](this);
            }
            /**
             * @param {!Object} filter
             * @param {!Object} obj
             * @param {string} name
             * @param {boolean} cb
             * @param {string} quiet
             * @return {?}
             */
            function install(filter, obj, name, cb, quiet) {
                var msg;
                var context = filter["_readableState"];
                if (null === obj) {
                    /** @type {boolean} */
                    context['reading'] = false;
                    (function(proto, data) {
                        if (data['ended']) {
                            return;
                        }
                        if (data["decoder"]) {
                            var PL$53 = data['decoder']["end"]();
                            if (PL$53 && PL$53["length"]) {
                                data["buffer"]["push"](PL$53);
                                data["length"] += data['objectMode'] ? 1 : PL$53["length"];
                            }
                        }
                        /** @type {boolean} */
                        data['ended'] = true;
                        go(proto);
                    })(filter, context);
                } else {
                    if (!quiet) {
                        msg = function(selector, tableData) {
                            var obj;
                            /** @type {!Array} */
                            data = tableData;
                            if (!(args["isBuffer"](data) || data instanceof Stream || "string" == typeof tableData || void 0 === tableData || selector['objectMode'])) {
                                /** @type {!TypeError} */
                                obj = new TypeError('Invalid non-string/buffer chunk');
                            }
                            var data;
                            return obj;
                        }(context, obj);
                    }
                    if (msg) {
                        filter["emit"]('error', msg);
                    } else {
                        if (context['objectMode'] || obj && obj["length"] > 0) {
                            if (!("string" == typeof obj || context["objectMode"] || Object['getPrototypeOf'](obj) === args["prototype"])) {
                                obj = function(url) {
                                    return args["from"](url);
                                }(obj);
                            }
                            if (cb) {
                                if (context['endEmitted']) {
                                    filter["emit"]("error", new Error('stream.unshift() after end event'));
                                } else {
                                    fn(filter, context, obj, true);
                                }
                            } else {
                                if (context['ended']) {
                                    filter["emit"]('error', new Error('stream.push() after EOF'));
                                } else {
                                    /** @type {boolean} */
                                    context['reading'] = false;
                                    if (context['decoder'] && !name) {
                                        obj = context["decoder"]["write"](obj);
                                        if (context['objectMode'] || 0 !== obj["length"]) {
                                            fn(filter, context, obj, false);
                                        } else {
                                            factory(filter, context);
                                        }
                                    } else {
                                        fn(filter, context, obj, false);
                                    }
                                }
                            }
                        } else {
                            if (!cb) {
                                /** @type {boolean} */
                                context['reading'] = false;
                            }
                        }
                    }
                }
                return function(a) {
                    return !a['ended'] && (a['needReadable'] || a["length"] < a['highWaterMark'] || 0 === a["length"]);
                }(context);
            }
            /**
             * @param {!Object} value
             * @param {!Object} options
             * @param {!Object} obj
             * @param {boolean} indicate
             * @return {undefined}
             */
            function fn(value, options, obj, indicate) {
                if (options['flowing'] && 0 === options["length"] && !options['sync']) {
                    value["emit"]("data", obj);
                    value["read"](0);
                } else {
                    options["length"] += options['objectMode'] ? 1 : obj["length"];
                    if (indicate) {
                        options["buffer"]["unshift"](obj);
                    } else {
                        options["buffer"]["push"](obj);
                    }
                    if (options['needReadable']) {
                        go(value);
                    }
                }
                factory(value, options);
            }
            /**
             * @param {number} n
             * @param {!Object} arr
             * @return {?}
             */
            function convertToPropTypes(n, arr) {
                return n <= 0 || 0 === arr["length"] && arr['ended'] ? 0 : arr['objectMode'] ? 1 : n != n ? arr["flowing"] && arr["length"] ? arr["buffer"]['head']["data"]["length"] : arr["length"] : (n > arr['highWaterMark'] && (arr['highWaterMark'] = function(n) {
                    return n >= nMax ? n = nMax : (n--, n = n | n >>> 1, n = n | n >>> 2, n = n | n >>> 4, n = n | n >>> 8, n = n | n >>> 16, n++), n;
                }(n)), n <= arr["length"] ? n : arr['ended'] ? arr["length"] : (arr['needReadable'] = true, 0));
            }
            /**
             * @param {!Object} options
             * @return {undefined}
             */
            function go(options) {
                var types = options['_readableState'];
                /** @type {boolean} */
                types['needReadable'] = false;
                if (!types['emittedReadable']) {
                    debug('emitReadable', types['flowing']);
                    /** @type {boolean} */
                    types['emittedReadable'] = true;
                    if (types['sync']) {
                        setTimeout(filter, options);
                    } else {
                        filter(options);
                    }
                }
            }
            /**
             * @param {!Object} config
             * @return {undefined}
             */
            function filter(config) {
                debug('emit readable');
                config["emit"]('readable');
                configuration(config);
            }
            /**
             * @param {!Object} value
             * @param {!Object} properties
             * @return {undefined}
             */
            function factory(value, properties) {
                if (!properties["readingMore"]) {
                    /** @type {boolean} */
                    properties['readingMore'] = true;
                    setTimeout(sendRequest, value, properties);
                }
            }
            /**
             * @param {?} instrumentId
             * @param {!Object} prices
             * @return {undefined}
             */
            function sendRequest(instrumentId, prices) {
                var minBuy = prices["length"];
                for (; !prices['reading'] && !prices['flowing'] && !prices['ended'] && prices["length"] < prices['highWaterMark'] && (debug('maybeReadMore read 0'), instrumentId["read"](0), minBuy !== prices["length"]);) {
                    minBuy = prices["length"];
                }
                /** @type {boolean} */
                prices["readingMore"] = false;
            }
            /**
             * @param {?} decreaseCounter
             * @return {undefined}
             */
            function onOpenHandlerFn(decreaseCounter) {
                debug('readable nexttick read 0');
                decreaseCounter["read"](0);
            }
            /**
             * @param {!Object} config
             * @param {!Object} value
             * @return {undefined}
             */
            function resume(config, value) {
                if (!value['reading']) {
                    debug('resume read 0');
                    config["read"](0);
                }
                /** @type {boolean} */
                value['resumeScheduled'] = false;
                /** @type {number} */
                value['awaitDrain'] = 0;
                config["emit"]("resume");
                configuration(config);
                if (value["flowing"] && !value['reading']) {
                    config["read"](0);
                }
            }
            /**
             * @param {!Object} options
             * @return {undefined}
             */
            function configuration(options) {
                var types = options["_readableState"];
                debug('flow', types['flowing']);
                for (; types['flowing'] && null !== options["read"]();) {}
            }
            /**
             * @param {number} value
             * @param {!Object} args
             * @return {?}
             */
            function type(value, args) {
                return 0 === args["length"] ? null : (args['objectMode'] ? innerStuff = args["buffer"]["shift"]() : !value || value >= args["length"] ? (innerStuff = args['decoder'] ? args["buffer"]["join"]("") : 1 === args["buffer"]["length"] ? args["buffer"]['head']["data"] : args["buffer"]["concat"](args["length"]), args["buffer"]['clear']()) : innerStuff = function(module, event, response) {
                    var result;
                    if (module < event['head']["data"]["length"]) {
                        result = event['head']["data"]["slice"](0, module);
                        event['head']["data"] = event['head']["data"]["slice"](module);
                    } else {
                        result = module === event['head']["data"]["length"] ? event['shift']() : response ? function(i, object) {
                            var value = object['head'];
                            /** @type {number} */
                            var amount = 1;
                            var result = value["data"];
                            /** @type {number} */
                            i = i - result["length"];
                            for (; value = value['next'];) {
                                var data = value["data"];
                                var index = i > data["length"] ? data["length"] : i;
                                if (index === data["length"] ? result = result + data : result = result + data["slice"](0, i), 0 === (i = i - index)) {
                                    if (index === data["length"]) {
                                        ++amount;
                                        if (value['next']) {
                                            object['head'] = value['next'];
                                        } else {
                                            /** @type {null} */
                                            object["head"] = object['tail'] = null;
                                        }
                                    } else {
                                        object['head'] = value;
                                        value["data"] = data["slice"](index);
                                    }
                                    break;
                                }
                                ++amount;
                            }
                            return object["length"] -= amount, result;
                        }(module, event) : function(m, data) {
                            var u = args["allocUnsafe"](m);
                            var result = data['head'];
                            /** @type {number} */
                            var dDarkness = 1;
                            result["data"]["copy"](u);
                            /** @type {number} */
                            m = m - result["data"]["length"];
                            for (; result = result['next'];) {
                                var props = result["data"];
                                var val = m > props["length"] ? props["length"] : m;
                                if (props["copy"](u, u["length"] - m, 0, val), 0 === (m = m - val)) {
                                    if (val === props["length"]) {
                                        ++dDarkness;
                                        if (result['next']) {
                                            data['head'] = result["next"];
                                        } else {
                                            /** @type {null} */
                                            data['head'] = data['tail'] = null;
                                        }
                                    } else {
                                        data['head'] = result;
                                        result["data"] = props["slice"](val);
                                    }
                                    break;
                                }
                                ++dDarkness;
                            }
                            return data["length"] -= dDarkness, u;
                        }(module, event);
                    }
                    return result;
                }(value, args["buffer"], args['decoder']), innerStuff);
                var innerStuff;
            }
            /**
             * @param {?} a
             * @return {undefined}
             */
            function init(a) {
                var left = a['_readableState'];
                if (left["length"] > 0) {
                    throw new Error('"endReadable()" called on non-empty stream');
                }
                if (!left["endEmitted"]) {
                    /** @type {boolean} */
                    left["ended"] = true;
                    setTimeout(connect, left, a);
                }
            }
            /**
             * @param {?} url
             * @param {!Object} response
             * @return {undefined}
             */
            function connect(url, response) {
                if (!(url['endEmitted'] || 0 !== url["length"])) {
                    /** @type {boolean} */
                    url['endEmitted'] = true;
                    /** @type {boolean} */
                    response["readable"] = false;
                    response["emit"]("end");
                }
            }
            /**
             * @param {!NodeList} xs
             * @param {!Object} s
             * @return {?}
             */
            function each(xs, s) {
                /** @type {number} */
                var i = 0;
                var until = xs["length"];
                for (; i < until; i++) {
                    if (xs[i] === s) {
                        return i;
                    }
                }
                return -1;
            }
            var setTimeout = require("process-nextick-args");
            /** @type {function(?): ?} */
            stats_results["exports"] = module;
            var connectionFn;
            var bannerInit = require('isarray');
            /** @type {function(number, ?): undefined} */
            module["ReadableState"] = constructor;
            require("events")["EventEmitter"];
            /**
             * @param {!Object} v
             * @param {string} node
             * @return {?}
             */
            var next = function(v, node) {
                return v["listeners"](node)["length"];
            };
            var query = require('./internal/streams/stream');
            var args = require('safe-buffer')["Buffer"];
            var Stream = isSlidingUp["Uint8Array"] || function() {};
            var handlers = require('core-util-is');
            handlers["inherits"] = require("inherits");
            var TagHourlyStat = require("util");
            var debug = void 0;
            debug = TagHourlyStat && TagHourlyStat["debuglog"] ? TagHourlyStat["debuglog"]("stream") : function() {};
            var Logger;
            var ASTY = require('./internal/streams/BufferList');
            var CheckDailyStat = require('./internal/streams/destroy');
            handlers["inherits"](module, query);
            /** @type {!Array} */
            var PL$13 = ['error', 'close', 'destroy', "pause", 'resume'];
            Object["defineProperty"](module["prototype"], "destroyed", {
                "get": function() {
                    return void 0 !== this['_readableState'] && this["_readableState"]["destroyed"];
                },
                "set": function(mymuted) {
                    if (this["_readableState"]) {
                        this['_readableState']['destroyed'] = mymuted;
                    }
                }
            });
            module["prototype"]["destroy"] = CheckDailyStat["destroy"];
            module["prototype"]["_undestroy"] = CheckDailyStat["undestroy"];
            /**
             * @param {?} notifications
             * @param {?} saveNotifs
             * @return {undefined}
             */
            module["prototype"]["_destroy"] = function(notifications, saveNotifs) {
                this["push"](null);
                saveNotifs(notifications);
            };
            /**
             * @param {?} data
             * @param {string} key
             * @return {?}
             */
            module["prototype"]["push"] = function(data, key) {
                var endDate;
                var match = this['_readableState'];
                return match["objectMode"] ? endDate = true : "string" == typeof data && ((key = key || match['defaultEncoding']) !== match['encoding'] && (data = args["from"](data, key), key = ""), endDate = true), install(this, data, key, false, endDate);
            };
            /**
             * @param {!Object} data
             * @return {?}
             */
            module["prototype"]["unshift"] = function(data) {
                return install(this, data, null, true, false);
            };
            /**
             * @return {?}
             */
            module["prototype"]["isPaused"] = function() {
                return false === this['_readableState']['flowing'];
            };
            /**
             * @param {?} name
             * @return {?}
             */
            module["prototype"]["setEncoding"] = function(name) {
                return Logger || (Logger = require('string_decoder/')['StringDecoder']), this["_readableState"]['decoder'] = new Logger(name), this["_readableState"]["encoding"] = name, this;
            };
            /** @type {number} */
            var nMax = 8388608;
            /**
             * @param {number} value
             * @return {?}
             */
            module["prototype"]["read"] = function(value) {
                debug('read', value);
                /** @type {number} */
                value = parseInt(value, 10);
                var values = this['_readableState'];
                /** @type {number} */
                var prev = value;
                if (0 !== value && (values["emittedReadable"] = false), 0 === value && values['needReadable'] && (values["length"] >= values['highWaterMark'] || values['ended'])) {
                    return debug('read: emitReadable', values["length"], values['ended']), 0 === values["length"] && values['ended'] ? init(this) : go(this), null;
                }
                if (0 === (value = convertToPropTypes(value, values)) && values['ended']) {
                    return 0 === values["length"] && init(this), null;
                }
                var artistTrack;
                var app_name = values['needReadable'];
                return debug('need readable', app_name), (0 === values["length"] || values["length"] - value < values['highWaterMark']) && debug('length less than watermark', app_name = true), values['ended'] || values['reading'] ? debug('reading or ended', app_name = false) : app_name && (debug('do read'), values['reading'] = true, values["sync"] = true, 0 === values["length"] && (values["needReadable"] = true), this["_read"](values["highWaterMark"]), values['sync'] = false,
                    values['reading'] || (value = convertToPropTypes(prev, values))), null === (artistTrack = value > 0 ? type(value, values) : null) ? (values['needReadable'] = true, value = 0) : values["length"] -= value, 0 === values["length"] && (values['ended'] || (values['needReadable'] = true), prev !== value && values['ended'] && init(this)), null !== artistTrack && this["emit"]("data", artistTrack), artistTrack;
            };
            /**
             * @param {?} canCreateDiscussions
             * @return {undefined}
             */
            module["prototype"]["_read"] = function(canCreateDiscussions) {
                this["emit"]('error', new Error('_read() is not implemented'));
            };
            /**
             * @param {!Object} PL$12
             * @param {?} changesIdentifyUser
             * @return {?}
             */
            module["prototype"]["pipe"] = function(PL$12, changesIdentifyUser) {
                /**
                 * @param {?} type
                 * @param {?} msg
                 * @return {undefined}
                 */
                function type(type, msg) {
                    debug("onunpipe");
                    if (type === p && msg && false === msg['hasUnpiped']) {
                        /** @type {boolean} */
                        msg["hasUnpiped"] = true;
                        debug('cleanup');
                        PL$12["removeListener"]('close', onResponse);
                        PL$12["removeListener"]('finish', onfinish);
                        PL$12["removeListener"]('drain', value);
                        PL$12["removeListener"]("error", onerror);
                        PL$12["removeListener"]('unpipe', type);
                        p["removeListener"]('end', callback);
                        p["removeListener"]('end', unpipe);
                        p["removeListener"]("data", save);
                        /** @type {boolean} */
                        _0x49aad3 = true;
                        if (!(!delay["awaitDrain"] || PL$12['_writableState'] && !PL$12['_writableState']['needDrain'])) {
                            value();
                        }
                    }
                }
                /**
                 * @return {undefined}
                 */
                function callback() {
                    debug('onend');
                    PL$12["end"]();
                }
                /**
                 * @param {?} close
                 * @return {undefined}
                 */
                function save(close) {
                    debug('ondata');
                    /** @type {boolean} */
                    _0x1ad8db = false;
                    if (!(false !== PL$12["write"](close) || _0x1ad8db)) {
                        if ((1 === delay['pipesCount'] && delay['pipes'] === PL$12 || delay["pipesCount"] > 1 && -1 !== each(delay["pipes"], PL$12)) && !_0x49aad3) {
                            debug('false write response, pause', p['_readableState']['awaitDrain']);
                            p["_readableState"]['awaitDrain']++;
                            /** @type {boolean} */
                            _0x1ad8db = true;
                        }
                        p["pause"]();
                    }
                }
                /**
                 * @param {?} url
                 * @return {undefined}
                 */
                function onerror(url) {
                    debug("onerror", url);
                    unpipe();
                    PL$12["removeListener"]('error', onerror);
                    if (0 === next(PL$12, 'error')) {
                        PL$12["emit"]('error', url);
                    }
                }
                /**
                 * @return {undefined}
                 */
                function onResponse() {
                    PL$12["removeListener"]("finish", onfinish);
                    unpipe();
                }
                /**
                 * @return {undefined}
                 */
                function onfinish() {
                    debug('onfinish');
                    PL$12["removeListener"]("close", onResponse);
                    unpipe();
                }
                /**
                 * @return {undefined}
                 */
                function unpipe() {
                    debug("unpipe");
                    p["unpipe"](PL$12);
                }
                var p = this;
                var delay = this['_readableState'];
                switch (delay['pipesCount']) {
                    case 0:
                        /** @type {!Object} */
                        delay['pipes'] = PL$12;
                        break;
                    case 1:
                        /** @type {!Array} */
                        delay['pipes'] = [delay["pipes"], PL$12];
                        break;
                    default:
                        delay['pipes']["push"](PL$12);
                }
                delay['pipesCount'] += 1;
                debug("pipe count=%d opts=%j", delay['pipesCount'], changesIdentifyUser);
                /** @type {function(): undefined} */
                var cb = (!changesIdentifyUser || false !== changesIdentifyUser["end"]) && PL$12 !== canCreateDiscussions['stdout'] && PL$12 !== canCreateDiscussions['stderr'] ? callback : unpipe;
                if (delay['endEmitted']) {
                    setTimeout(cb);
                } else {
                    p["once"]('end', cb);
                }
                PL$12["on"]('unpipe', type);
                var value = function(config) {
                    return function() {
                        var m = config['_readableState'];
                        debug("pipeOnDrain", m['awaitDrain']);
                        if (m['awaitDrain']) {
                            m['awaitDrain']--;
                        }
                        if (0 === m['awaitDrain'] && next(config, "data")) {
                            /** @type {boolean} */
                            m["flowing"] = true;
                            configuration(config);
                        }
                    };
                }(p);
                PL$12["on"]('drain', value);
                /** @type {boolean} */
                var _0x49aad3 = false;
                /** @type {boolean} */
                var _0x1ad8db = false;
                return p["on"]("data", save),
                    function(PL$12, inc, PL$16) {
                        if ("function" == typeof PL$12["prependListener"]) {
                            return PL$12["prependListener"](inc, PL$16);
                        }
                        if (PL$12["_events"] && PL$12["_events"][inc]) {
                            if (bannerInit(PL$12["_events"][inc])) {
                                PL$12["_events"][inc]["unshift"](PL$16);
                            } else {
                                /** @type {!Array} */
                                PL$12["_events"][inc] = [PL$16, PL$12["_events"][inc]];
                            }
                        } else {
                            PL$12["on"](inc, PL$16);
                        }
                    }(PL$12, 'error', onerror), PL$12["once"]('close', onResponse), PL$12["once"]("finish", onfinish), PL$12["emit"]('pipe', p), delay['flowing'] || (debug('pipe resume'), p["resume"]()), PL$12;
            };
            /**
             * @param {string} hash
             * @return {?}
             */
            module["prototype"]["unpipe"] = function(hash) {
                var hashes = this["_readableState"];
                var unpipeInfo = {
                    "hasUnpiped": false
                };
                if (0 === hashes['pipesCount']) {
                    return this;
                }
                if (1 === hashes['pipesCount']) {
                    return hash && hash !== hashes['pipes'] ? this : (hash || (hash = hashes['pipes']), hashes['pipes'] = null, hashes['pipesCount'] = 0, hashes['flowing'] = false, hash && hash["emit"]('unpipe', this, unpipeInfo), this);
                }
                if (!hash) {
                    var signedTransactions = hashes["pipes"];
                    var season = hashes['pipesCount'];
                    /** @type {null} */
                    hashes['pipes'] = null;
                    /** @type {number} */
                    hashes['pipesCount'] = 0;
                    /** @type {boolean} */
                    hashes['flowing'] = false;
                    /** @type {number} */
                    var signedTransactionsCounter = 0;
                    for (; signedTransactionsCounter < season; signedTransactionsCounter++) {
                        signedTransactions[signedTransactionsCounter]["emit"]('unpipe', this, unpipeInfo);
                    }
                    return this;
                }
                var index = each(hashes["pipes"], hash);
                return -1 === index ? this : (hashes["pipes"]["splice"](index, 1), hashes['pipesCount'] -= 1, 1 === hashes['pipesCount'] && (hashes["pipes"] = hashes['pipes'][0]), hash["emit"]("unpipe", this, unpipeInfo), this);
            };
            /**
             * @param {string} timedout
             * @param {?} data
             * @return {?}
             */
            module["prototype"]["on"] = function(timedout, data) {
                var renderBodyErr = query["prototype"]["on"]["call"](this, timedout, data);
                if ("data" === timedout) {
                    if (false !== this['_readableState']['flowing']) {
                        this["resume"]();
                    }
                } else {
                    if ('readable' === timedout) {
                        var _0x32227a = this['_readableState'];
                        if (!(_0x32227a['endEmitted'] || _0x32227a['readableListening'])) {
                            /** @type {boolean} */
                            _0x32227a['readableListening'] = _0x32227a['needReadable'] = true;
                            /** @type {boolean} */
                            _0x32227a['emittedReadable'] = false;
                            if (_0x32227a['reading']) {
                                if (_0x32227a["length"]) {
                                    go(this);
                                }
                            } else {
                                setTimeout(onOpenHandlerFn, this);
                            }
                        }
                    }
                }
                return renderBodyErr;
            };
            module["prototype"]["addListener"] = module["prototype"]["on"];
            /**
             * @return {?}
             */
            module["prototype"]["resume"] = function() {
                var THREAD_STARTED = this["_readableState"];
                return THREAD_STARTED['flowing'] || (debug('resume'), THREAD_STARTED['flowing'] = true, function(timeToFadeIn, type) {
                    if (!type['resumeScheduled']) {
                        /** @type {boolean} */
                        type['resumeScheduled'] = true;
                        setTimeout(resume, timeToFadeIn, type);
                    }
                }(this, THREAD_STARTED)), this;
            };
            /**
             * @return {?}
             */
            module["prototype"]["pause"] = function() {
                return debug("call pause flowing=%j", this['_readableState']['flowing']), false !== this['_readableState']["flowing"] && (debug('pause'), this['_readableState']["flowing"] = false, this["emit"]('pause')), this;
            };
            /**
             * @param {!Object} obj
             * @return {?}
             */
            module["prototype"]["wrap"] = function(obj) {
                var parts = this['_readableState'];
                /** @type {boolean} */
                var _0xdc6991 = false;
                var i = this;
                var key;
                for (key in obj["on"]('end', function() {
                        if (debug('wrapped end'), parts['decoder'] && !parts['ended']) {
                            var PL$53 = parts['decoder']["end"]();
                            if (PL$53 && PL$53["length"]) {
                                i["push"](PL$53);
                            }
                        }
                        i["push"](null);
                    }), obj["on"]("data", function(match) {
                        if (!(debug('wrapped data'), parts['decoder'] && (match = parts["decoder"]["write"](match)), parts['objectMode'] && null == match)) {
                            if (parts['objectMode'] || match && match["length"]) {
                                if (!i["push"](match)) {
                                    /** @type {boolean} */
                                    _0xdc6991 = true;
                                    obj["pause"]();
                                }
                            }
                        }
                    }), obj) {
                    if (void 0 === this[key] && "function" == typeof obj[key]) {
                        this[key] = function(keyProp) {
                            return function() {
                                return obj[keyProp]["apply"](obj, arguments);
                            };
                        }(key);
                    }
                }
                /** @type {number} */
                var PL$17 = 0;
                for (; PL$17 < PL$13["length"]; PL$17++) {
                    obj["on"](PL$13[PL$17], i["emit"]['bind'](i, PL$13[PL$17]));
                }
                return i["_read"] = function(supporterL) {
                    debug('wrapped _read', supporterL);
                    if (_0xdc6991) {
                        /** @type {boolean} */
                        _0xdc6991 = false;
                        obj["resume"]();
                    }
                }, i;
            };
            /** @type {function(number, !Object): ?} */
            module["_fromList"] = type;
        })["call"](this, require('_process'), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
    }, {
        "./_stream_duplex": 24,
        "./internal/streams/BufferList": 29,
        "./internal/streams/destroy": 30,
        "./internal/streams/stream": 31,
        "_process": 22,
        "core-util-is": 4,
        "events": 8,
        "inherits": 10,
        "isarray": 12,
        "process-nextick-args": 21,
        "safe-buffer": 36,
        "string_decoder/": 38,
        "util": 2
    }],
    27: [function(require, module, canCreateDiscussions) {
        /**
         * @param {!Object} callback
         * @return {undefined}
         */
        function extractPresetLocal(callback) {
            /**
             * @param {?} arg0
             * @param {?} isBgroundImg
             * @return {?}
             */
            this['afterTransform'] = function(arg0, isBgroundImg) {
                return function(data, song, isBgroundImg) {
                    var pkValue = data['_transformState'];
                    /** @type {boolean} */
                    pkValue['transforming'] = false;
                    var isGoodSong = pkValue['writecb'];
                    if (!isGoodSong) {
                        return data["emit"]("error", new Error('write callback called multiple times'));
                    }
                    /** @type {null} */
                    pkValue['writechunk'] = null;
                    /** @type {null} */
                    pkValue['writecb'] = null;
                    if (null != isBgroundImg) {
                        data["push"](isBgroundImg);
                    }
                    isGoodSong(song);
                    var args = data["_readableState"];
                    /** @type {boolean} */
                    args['reading'] = false;
                    if (args['needReadable'] || args["length"] < args['highWaterMark']) {
                        data["_read"](args['highWaterMark']);
                    }
                }(callback, arg0, isBgroundImg);
            };
            /** @type {boolean} */
            this['needTransform'] = false;
            /** @type {boolean} */
            this['transforming'] = false;
            /** @type {null} */
            this['writecb'] = null;
            /** @type {null} */
            this["writechunk"] = null;
            /** @type {null} */
            this['writeencoding'] = null;
        }
        /**
         * @param {?} mRotation
         * @return {?}
         */
        function render(mRotation) {
            if (!(this instanceof render)) {
                return new render(mRotation);
            }
            NodeList["call"](this, mRotation);
            this["_transformState"] = new extractPresetLocal(this);
            var form = this;
            /** @type {boolean} */
            this['_readableState']["needReadable"] = true;
            /** @type {boolean} */
            this['_readableState']["sync"] = false;
            if (mRotation) {
                if ("function" == typeof mRotation['transform']) {
                    this["_transform"] = mRotation['transform'];
                }
                if ("function" == typeof mRotation['flush']) {
                    this["_flush"] = mRotation['flush'];
                }
            }
            this["once"]('transform', function() {
                if ("function" == typeof this["_flush"]) {
                    this["_flush"](function(data, value) {
                        build(form, data, value);
                    });
                } else {
                    build(form);
                }
            });
        }
        /**
         * @param {!Object} self
         * @param {?} args
         * @param {?} params
         * @return {?}
         */
        function build(self, args, params) {
            if (args) {
                return self["emit"]('error', args);
            }
            if (null != params) {
                self["push"](params);
            }
            var ownVal = self['_writableState'];
            var theOldFunction = self['_transformState'];
            if (ownVal["length"]) {
                throw new Error('Calling transform done when ws.length != 0');
            }
            if (theOldFunction["transforming"]) {
                throw new Error('Calling transform done when still transforming');
            }
            return self["push"](null);
        }
        /** @type {function(?): ?} */
        module["exports"] = render;
        var NodeList = require("./_stream_duplex");
        var lang = require('core-util-is');
        lang["inherits"] = require('inherits');
        lang["inherits"](render, NodeList);
        /**
         * @param {?} mmCoreSplitViewBlock
         * @param {?} mmaPushNotificationsComponent
         * @return {?}
         */
        render["prototype"]["push"] = function(mmCoreSplitViewBlock, mmaPushNotificationsComponent) {
            return this['_transformState']['needTransform'] = false, NodeList["prototype"]["push"]["call"](this, mmCoreSplitViewBlock, mmaPushNotificationsComponent);
        };
        /**
         * @param {?} canCreateDiscussions
         * @param {?} isSlidingUp
         * @param {?} dontForceConstraints
         * @return {?}
         */
        render["prototype"]["_transform"] = function(canCreateDiscussions, isSlidingUp, dontForceConstraints) {
            throw new Error('_transform() is not implemented');
        };
        /**
         * @param {?} toolbar
         * @param {?} defaultSetting
         * @param {?} maybeValue
         * @return {undefined}
         */
        render["prototype"]["_write"] = function(toolbar, defaultSetting, maybeValue) {
            var settings = this['_transformState'];
            if (settings['writecb'] = maybeValue, settings['writechunk'] = toolbar, settings['writeencoding'] = defaultSetting, !settings['transforming']) {
                var defaultLocaleSettings = this['_readableState'];
                if (settings["needTransform"] || defaultLocaleSettings['needReadable'] || defaultLocaleSettings["length"] < defaultLocaleSettings['highWaterMark']) {
                    this["_read"](defaultLocaleSettings["highWaterMark"]);
                }
            }
        };
        /**
         * @param {?} canCreateDiscussions
         * @return {undefined}
         */
        render["prototype"]["_read"] = function(canCreateDiscussions) {
            var _0x1eaa05 = this['_transformState'];
            if (null !== _0x1eaa05['writechunk'] && _0x1eaa05['writecb'] && !_0x1eaa05['transforming']) {
                /** @type {boolean} */
                _0x1eaa05['transforming'] = true;
                this["_transform"](_0x1eaa05["writechunk"], _0x1eaa05['writeencoding'], _0x1eaa05['afterTransform']);
            } else {
                /** @type {boolean} */
                _0x1eaa05["needTransform"] = true;
            }
        };
        /**
         * @param {?} mmCoreSplitViewBlock
         * @param {?} saveNotifs
         * @return {undefined}
         */
        render["prototype"]["_destroy"] = function(mmCoreSplitViewBlock, saveNotifs) {
            var _0x13ad5d = this;
            NodeList["prototype"]["_destroy"]["call"](this, mmCoreSplitViewBlock, function(notifications) {
                saveNotifs(notifications);
                _0x13ad5d["emit"]('close');
            });
        };
    }, {
        "./_stream_duplex": 24,
        "core-util-is": 4,
        "inherits": 10
    }],
    28: [function(require, module, canCreateDiscussions) {
        (function(canCreateDiscussions, isSlidingUp) {
            /**
             * @param {!Object} val
             * @return {undefined}
             */
            function Array(val) {
                var pornResult = this;
                /** @type {null} */
                this['next'] = null;
                /** @type {null} */
                this['entry'] = null;
                /**
                 * @return {undefined}
                 */
                this["finish"] = function() {
                    ! function(obj, err, response_2) {
                        var result = obj["entry"];
                        /** @type {null} */
                        obj['entry'] = null;
                        for (; result;) {
                            var callback = result['callback'];
                            err['pendingcb']--;
                            callback(response_2);
                            result = result["next"];
                        }
                        if (err["corkedRequestsFree"]) {
                            /** @type {!Object} */
                            err["corkedRequestsFree"]['next'] = obj;
                        } else {
                            /** @type {!Object} */
                            err['corkedRequestsFree'] = obj;
                        }
                    }(pornResult, val);
                };
            }
            /**
             * @return {undefined}
             */
            function __anonymous_function__() {}
            /**
             * @param {number} cb
             * @param {!Object} date
             * @return {undefined}
             */
            function handler(cb, date) {
                connectionFn = connectionFn || require("./_stream_duplex");
                cb = cb || {};
                /** @type {boolean} */
                this['objectMode'] = !!cb['objectMode'];
                if (date instanceof connectionFn) {
                    this['objectMode'] = this['objectMode'] || !!cb['writableObjectMode'];
                }
                var latinCharacter = cb['highWaterMark'];
                /** @type {number} */
                var character = this['objectMode'] ? 16 : 16384;
                this["highWaterMark"] = latinCharacter || 0 === latinCharacter ? latinCharacter : character;
                this['highWaterMark'] = Math["floor"](this['highWaterMark']);
                /** @type {boolean} */
                this['finalCalled'] = false;
                /** @type {boolean} */
                this["needDrain"] = false;
                /** @type {boolean} */
                this['ending'] = false;
                /** @type {boolean} */
                this['ended'] = false;
                /** @type {boolean} */
                this["finished"] = false;
                /** @type {boolean} */
                this['destroyed'] = false;
                /** @type {boolean} */
                var _0x42bf80 = false === cb['decodeStrings'];
                /** @type {boolean} */
                this['decodeStrings'] = !_0x42bf80;
                this['defaultEncoding'] = cb['defaultEncoding'] || "utf8";
                /** @type {number} */
                this["length"] = 0;
                /** @type {boolean} */
                this['writing'] = false;
                /** @type {number} */
                this['corked'] = 0;
                /** @type {boolean} */
                this['sync'] = true;
                /** @type {boolean} */
                this['bufferProcessing'] = false;
                /**
                 * @param {?} PL$14
                 * @return {undefined}
                 */
                this['onwrite'] = function(PL$14) {
                    ! function(value, bbls) {
                        var params = value['_writableState'];
                        var appURI = params['sync'];
                        var callback = params['writecb'];
                        if (function(a) {
                                /** @type {boolean} */
                                a["writing"] = false;
                                /** @type {null} */
                                a["writecb"] = null;
                                a["length"] -= a['writelen'];
                                /** @type {number} */
                                a['writelen'] = 0;
                            }(params), bbls) {
                            ! function(self, obj, appURI, message, onerror) {
                                --obj['pendingcb'];
                                if (appURI) {
                                    debug(onerror, message);
                                    debug(log, self, obj);
                                    /** @type {boolean} */
                                    self['_writableState']["errorEmitted"] = true;
                                    self["emit"]('error', message);
                                } else {
                                    onerror(message);
                                    /** @type {boolean} */
                                    self['_writableState']['errorEmitted'] = true;
                                    self["emit"]('error', message);
                                    log(self, obj);
                                }
                            }(value, params, appURI, bbls, callback);
                        } else {
                            var m = map(params);
                            if (!(m || params['corked'] || params['bufferProcessing'] || !params['bufferedRequest'])) {
                                set(value, params);
                            }
                            if (appURI) {
                                setTimeout(connect, value, params, m, callback);
                            } else {
                                connect(value, params, m, callback);
                            }
                        }
                    }(date, PL$14);
                };
                /** @type {null} */
                this["writecb"] = null;
                /** @type {number} */
                this['writelen'] = 0;
                /** @type {null} */
                this['bufferedRequest'] = null;
                /** @type {null} */
                this['lastBufferedRequest'] = null;
                /** @type {number} */
                this['pendingcb'] = 0;
                /** @type {boolean} */
                this['prefinished'] = false;
                /** @type {boolean} */
                this['errorEmitted'] = false;
                /** @type {number} */
                this['bufferedRequestCount'] = 0;
                this['corkedRequestsFree'] = new Array(this);
            }
            /**
             * @param {!Object} allow
             * @return {?}
             */
            function WMCacheControl(allow) {
                if (connectionFn = connectionFn || require("./_stream_duplex"), !(then["call"](WMCacheControl, this) || this instanceof connectionFn)) {
                    return new WMCacheControl(allow);
                }
                this["_writableState"] = new handler(allow, this);
                /** @type {boolean} */
                this['writable'] = true;
                if (allow) {
                    if ("function" == typeof allow["write"]) {
                        this["_write"] = allow["write"];
                    }
                    if ("function" == typeof allow["writev"]) {
                        this['_writev'] = allow['writev'];
                    }
                    if ("function" == typeof allow["destroy"]) {
                        this["_destroy"] = allow["destroy"];
                    }
                    if ("function" == typeof allow['final']) {
                        this['_final'] = allow['final'];
                    }
                }
                fn["call"](this);
            }
            /**
             * @param {!Object} context
             * @param {!Object} args
             * @param {boolean} value
             * @param {?} result
             * @param {!Object} key
             * @param {string} data
             * @param {!Object} t
             * @return {undefined}
             */
            function callback(context, args, value, result, key, data, t) {
                args['writelen'] = result;
                /** @type {!Object} */
                args['writecb'] = t;
                /** @type {boolean} */
                args['writing'] = true;
                /** @type {boolean} */
                args['sync'] = true;
                if (value) {
                    context['_writev'](key, args["onwrite"]);
                } else {
                    context["_write"](key, data, args['onwrite']);
                }
                /** @type {boolean} */
                args['sync'] = false;
            }
            /**
             * @param {!Object} self
             * @param {!Object} context
             * @param {?} remote
             * @param {?} callback
             * @return {undefined}
             */
            function connect(self, context, remote, callback) {
                if (!remote) {
                    (function(proplist, context) {
                        if (0 === context["length"] && context['needDrain']) {
                            /** @type {boolean} */
                            context['needDrain'] = false;
                            proplist["emit"]("drain");
                        }
                    })(self, context);
                }
                context['pendingcb']--;
                callback();
                log(self, context);
            }
            /**
             * @param {!Object} params
             * @param {!Object} obj
             * @return {undefined}
             */
            function set(params, obj) {
                /** @type {boolean} */
                obj['bufferProcessing'] = true;
                var data = obj["bufferedRequest"];
                if (params['_writev'] && data && data['next']) {
                    var node = obj["bufferedRequestCount"];
                    /** @type {!Array} */
                    var log = new Array(node);
                    var state = obj["corkedRequestsFree"];
                    state["entry"] = data;
                    /** @type {number} */
                    var index = 0;
                    /** @type {boolean} */
                    var NOOP = true;
                    for (; data;) {
                        log[index] = data;
                        if (!data['isBuf']) {
                            /** @type {boolean} */
                            NOOP = false;
                        }
                        data = data["next"];
                        /** @type {number} */
                        index = index + 1;
                    }
                    /** @type {boolean} */
                    log['allBuffers'] = NOOP;
                    callback(params, obj, true, obj["length"], log, "", state['finish']);
                    obj['pendingcb']++;
                    /** @type {null} */
                    obj['lastBufferedRequest'] = null;
                    if (state['next']) {
                        obj['corkedRequestsFree'] = state['next'];
                        /** @type {null} */
                        state["next"] = null;
                    } else {
                        obj['corkedRequestsFree'] = new Array(obj);
                    }
                } else {
                    for (; data;) {
                        var payload = data['chunk'];
                        var fn = data['encoding'];
                        var err = data['callback'];
                        if (callback(params, obj, false, obj["objectMode"] ? 1 : payload["length"], payload, fn, err), data = data['next'], obj['writing']) {
                            break;
                        }
                    }
                    if (null === data) {
                        /** @type {null} */
                        obj['lastBufferedRequest'] = null;
                    }
                }
                /** @type {number} */
                obj["bufferedRequestCount"] = 0;
                obj['bufferedRequest'] = data;
                /** @type {boolean} */
                obj['bufferProcessing'] = false;
            }
            /**
             * @param {!Object} context
             * @return {?}
             */
            function map(context) {
                return context['ending'] && 0 === context["length"] && null === context['bufferedRequest'] && !context['finished'] && !context['writing'];
            }
            /**
             * @param {!Object} self
             * @param {!Object} instance
             * @return {undefined}
             */
            function end(self, instance) {
                self['_final'](function(actionId) {
                    instance['pendingcb']--;
                    if (actionId) {
                        self["emit"]('error', actionId);
                    }
                    /** @type {boolean} */
                    instance['prefinished'] = true;
                    self["emit"]("prefinish");
                    log(self, instance);
                });
            }
            /**
             * @param {!Object} self
             * @param {!Object} context
             * @return {?}
             */
            function log(self, context) {
                var fontSize = map(context);
                return fontSize && (! function(srv, properties) {
                    if (!(properties['prefinished'] || properties['finalCalled'])) {
                        if ("function" == typeof srv['_final']) {
                            properties['pendingcb']++;
                            /** @type {boolean} */
                            properties['finalCalled'] = true;
                            debug(end, srv, properties);
                        } else {
                            /** @type {boolean} */
                            properties["prefinished"] = true;
                            srv["emit"]('transform');
                        }
                    }
                }(self, context), 0 === context['pendingcb'] && (context['finished'] = true, self["emit"]('finish'))), fontSize;
            }
            var debug = require('process-nextick-args');
            /** @type {function(!Object): ?} */
            module["exports"] = WMCacheControl;
            var connectionFn;
            var setTimeout = !canCreateDiscussions["browser"] && ["v0.10", 'v0.9.']["indexOf"](canCreateDiscussions["version"]["slice"](0, 5)) > -1 ? setImmediate : debug;
            /** @type {function(number, !Object): undefined} */
            WMCacheControl["WritableState"] = handler;
            var app = require('core-util-is');
            app["inherits"] = require("inherits");
            var _0x42bf80 = {
                "deprecate": require("util-deprecate")
            };
            var fn = require("./internal/streams/stream");
            var _ = require("safe-buffer")["Buffer"];
            var BigNumber = isSlidingUp["Uint8Array"] || function() {};
            var then;
            var TagHourlyStat = require("./internal/streams/destroy");
            app["inherits"](WMCacheControl, fn);
            /**
             * @return {?}
             */
            handler["prototype"]["getBuffer"] = function() {
                var value = this['bufferedRequest'];
                /** @type {!Array} */
                var settingHandler = [];
                for (; value;) {
                    settingHandler["push"](value);
                    value = value['next'];
                }
                return settingHandler;
            };
            (function() {
                try {
                    Object["defineProperty"](handler["prototype"], "buffer", {
                        "get": _0x42bf80["deprecate"](function() {
                            return this["getBuffer"]();
                        }, '_writableState.buffer is deprecated. Use _writableState.getBuffer instead.', "DEP0003")
                    });
                } catch (_0x25e961) {}
            })();
            if ("function" == typeof Symbol && Symbol["hasInstance"] && "function" == typeof Function["prototype"][Symbol["hasInstance"]]) {
                then = Function["prototype"][Symbol["hasInstance"]];
                Object["defineProperty"](WMCacheControl, Symbol["hasInstance"], {
                    "value": function(source) {
                        return !!then["call"](this, source) || source && source['_writableState'] instanceof handler;
                    }
                });
            } else {
                /**
                 * @param {?} onRej
                 * @return {?}
                 */
                then = function(onRej) {
                    return onRej instanceof this;
                };
            }
            /**
             * @return {undefined}
             */
            WMCacheControl["prototype"]["pipe"] = function() {
                this["emit"]('error', new Error('Cannot pipe, not readable'));
            };
            /**
             * @param {!Array} el
             * @param {string} callback
             * @param {string} name
             * @return {?}
             */
            WMCacheControl["prototype"]["write"] = function(el, callback, name) {
                var value;
                var options = this['_writableState'];
                /** @type {boolean} */
                var observable = false;
                var clojIsReversed = (value = el, (_["isBuffer"](value) || value instanceof BigNumber) && !options["objectMode"]);
                return clojIsReversed && !_["isBuffer"](el) && (el = function(obj) {
                    return _["from"](obj);
                }(el)), "function" == typeof callback && (name = callback, callback = null), clojIsReversed ? callback = "buffer" : callback || (callback = options['defaultEncoding']), "function" != typeof name && (name = __anonymous_function__), options['ended'] ? function(tests, fmt) {
                    /** @type {!Error} */
                    var i = new Error('write after end');
                    tests["emit"]('error', i);
                    debug(fmt, i);
                }(this, name) : (clojIsReversed || function(tests, withHashes, diff, d) {
                    /** @type {boolean} */
                    var _0x35c689 = true;
                    /** @type {boolean} */
                    var i = false;
                    return null === diff ? i = new TypeError('May not write null values to stream') : "string" == typeof diff || void 0 === diff || withHashes['objectMode'] || (i = new TypeError('Invalid non-string/buffer chunk')), i && (tests["emit"]('error', i), debug(d, i), _0x35c689 = false), _0x35c689;
                }(this, options, el, name)) && (options["pendingcb"]++, observable = function(elem, commands, isSlidingUp, data, options, obj) {
                    if (!isSlidingUp) {
                        var result = function(diff, obj, predicate) {
                            if (!(diff['objectMode'] || false === diff['decodeStrings'] || "string" != typeof obj)) {
                                obj = _["from"](obj, predicate);
                            }
                            return obj;
                        }(commands, data, options);
                        if (data !== result) {
                            /** @type {boolean} */
                            isSlidingUp = true;
                            options = "buffer";
                            data = result;
                        }
                    }
                    var missingCoins = commands['objectMode'] ? 1 : data["length"];
                    commands["length"] += missingCoins;
                    /** @type {boolean} */
                    var _0x18f779 = commands["length"] < commands['highWaterMark'];
                    if (!_0x18f779) {
                        /** @type {boolean} */
                        commands["needDrain"] = true;
                    }
                    if (commands["writing"] || commands['corked']) {
                        var commandList = commands["lastBufferedRequest"];
                        commands['lastBufferedRequest'] = {
                            "chunk": data,
                            "encoding": options,
                            "isBuf": isSlidingUp,
                            "callback": obj,
                            "next": null
                        };
                        if (commandList) {
                            commandList['next'] = commands['lastBufferedRequest'];
                        } else {
                            commands["bufferedRequest"] = commands['lastBufferedRequest'];
                        }
                        commands['bufferedRequestCount'] += 1;
                    } else {
                        callback(elem, commands, false, missingCoins, data, options, obj);
                    }
                    return _0x18f779;
                }(this, options, clojIsReversed, el, callback, name)), observable;
            };
            /**
             * @return {undefined}
             */
            WMCacheControl["prototype"]["cork"] = function() {
                this['_writableState']['corked']++;
            };
            /**
             * @return {undefined}
             */
            WMCacheControl["prototype"]["uncork"] = function() {
                var callback = this['_writableState'];
                if (callback['corked']) {
                    callback['corked']--;
                    if (!(callback['writing'] || callback['corked'] || callback['finished'] || callback['bufferProcessing'] || !callback['bufferedRequest'])) {
                        set(this, callback);
                    }
                }
            };
            /**
             * @param {string} format
             * @return {?}
             */
            WMCacheControl["prototype"]["setDefaultEncoding"] = function(format) {
                if ("string" == typeof format && (format = format["toLowerCase"]()), !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", 'ucs-2', "utf16le", "utf-16le", 'raw']["indexOf"]((format + "")["toLowerCase"]()) > -1)) {
                    throw new TypeError("Unknown encoding: " + format);
                }
                return this["_writableState"]['defaultEncoding'] = format, this;
            };
            /**
             * @param {?} canCreateDiscussions
             * @param {?} isSlidingUp
             * @param {?} stepCallback
             * @return {undefined}
             */
            WMCacheControl["prototype"]["_write"] = function(canCreateDiscussions, isSlidingUp, stepCallback) {
                stepCallback(new Error('_write() is not implemented'));
            };
            /** @type {null} */
            WMCacheControl["prototype"]["_writev"] = null;
            /**
             * @param {string} data
             * @param {!Object} somePerson
             * @param {!Object} person
             * @return {undefined}
             */
            WMCacheControl["prototype"]["end"] = function(data, somePerson, person) {
                var box = this['_writableState'];
                if ("function" == typeof data) {
                    /** @type {string} */
                    person = data;
                    /** @type {null} */
                    data = null;
                    /** @type {null} */
                    somePerson = null;
                } else {
                    if ("function" == typeof somePerson) {
                        /** @type {!Object} */
                        person = somePerson;
                        /** @type {null} */
                        somePerson = null;
                    }
                }
                if (null != data) {
                    this["write"](data, somePerson);
                }
                if (box['corked']) {
                    /** @type {number} */
                    box['corked'] = 1;
                    this["uncork"]();
                }
                if (!(box['ending'] || box['finished'])) {
                    (function(self, elem, context) {
                        /** @type {boolean} */
                        elem['ending'] = true;
                        log(self, elem);
                        if (context) {
                            if (elem['finished']) {
                                debug(context);
                            } else {
                                self["once"]('finish', context);
                            }
                        }
                        /** @type {boolean} */
                        elem['ended'] = true;
                        /** @type {boolean} */
                        self['writable'] = false;
                    })(this, box, person);
                }
            };
            Object["defineProperty"](WMCacheControl["prototype"], "destroyed", {
                "get": function() {
                    return void 0 !== this['_writableState'] && this['_writableState']['destroyed'];
                },
                "set": function(mymuted) {
                    if (this['_writableState']) {
                        this["_writableState"]['destroyed'] = mymuted;
                    }
                }
            });
            WMCacheControl["prototype"]["destroy"] = TagHourlyStat["destroy"];
            WMCacheControl["prototype"]["_undestroy"] = TagHourlyStat["undestroy"];
            /**
             * @param {?} notifications
             * @param {?} saveNotifs
             * @return {undefined}
             */
            WMCacheControl["prototype"]["_destroy"] = function(notifications, saveNotifs) {
                this["end"]();
                saveNotifs(notifications);
            };
        })["call"](this, require('_process'), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
    }, {
        "./_stream_duplex": 24,
        "./internal/streams/destroy": 30,
        "./internal/streams/stream": 31,
        "_process": 22,
        "core-util-is": 4,
        "inherits": 10,
        "process-nextick-args": 21,
        "safe-buffer": 36,
        "util-deprecate": 39
    }],
    29: [function(saveNotifs, canCreateDiscussions, isSlidingUp) {
        var Long = saveNotifs("safe-buffer")["Buffer"];
        canCreateDiscussions["exports"] = function() {
            /**
             * @return {undefined}
             */
            function TailNode() {
                ! function(impromptuInstance, Impromptu) {
                    if (!(impromptuInstance instanceof Impromptu)) {
                        throw new TypeError('Cannot call a class as a function');
                    }
                }(this, TailNode);
                /** @type {null} */
                this['head'] = null;
                /** @type {null} */
                this["tail"] = null;
                /** @type {number} */
                this["length"] = 0;
            }
            return;
            /**
             * @param {!Object} instancesTypes
             * @return {undefined}
             */
            TailNode["prototype"]["push"] = function(instancesTypes) {
                var item = {
                    "data": instancesTypes,
                    "next": null
                };
                if (this["length"] > 0) {
                    this["tail"]['next'] = item;
                } else {
                    this['head'] = item;
                }
                this["tail"] = item;
                ++this["length"];
            };
            /**
             * @param {!Object} instancesTypes
             * @return {undefined}
             */
            TailNode["prototype"]["unshift"] = function(instancesTypes) {
                var dummy = {
                    "data": instancesTypes,
                    "next": this['head']
                };
                if (0 === this["length"]) {
                    this['tail'] = dummy;
                }
                this['head'] = dummy;
                ++this["length"];
            };
            /**
             * @return {?}
             */
            TailNode["prototype"]['shift'] = function() {
                if (0 !== this["length"]) {
                    var _0x52c1eb = this['head']["data"];
                    return 1 === this["length"] ? this['head'] = this['tail'] = null : this["head"] = this['head']['next'], --this["length"], _0x52c1eb;
                }
            };
            /**
             * @return {undefined}
             */
            TailNode["prototype"]['clear'] = function() {
                /** @type {null} */
                this['head'] = this['tail'] = null;
                /** @type {number} */
                this["length"] = 0;
            };
            /**
             * @param {?} result
             * @return {?}
             */
            TailNode["prototype"]["join"] = function(result) {
                if (0 === this["length"]) {
                    return "";
                }
                var object = this['head'];
                var msg = "" + object["data"];
                for (; object = object["next"];) {
                    msg = msg + (result + object["data"]);
                }
                return msg;
            };
            /**
             * @param {number} high
             * @return {?}
             */
            TailNode["prototype"]["concat"] = function(high) {
                if (0 === this["length"]) {
                    return Long["alloc"](0);
                }
                if (1 === this["length"]) {
                    return this['head']["data"];
                }
                var filter_error;
                var wsFunction;
                var tradeOffset;
                var local_mobile_core_user_remove_user_device = Long["allocUnsafe"](high >>> 0);
                var data = this['head'];
                /** @type {number} */
                var offset = 0;
                for (; data;) {
                    filter_error = data["data"];
                    wsFunction = local_mobile_core_user_remove_user_device;
                    tradeOffset = offset;
                    filter_error["copy"](wsFunction, tradeOffset);
                    offset = offset + data["data"]["length"];
                    data = data['next'];
                }
                return local_mobile_core_user_remove_user_device;
            };
            TailNode;
        }();
    }, {
        "safe-buffer": 36
    }],
    30: [function(debu, data, canCreateDiscussions) {
        /**
         * @param {?} isSummary
         * @param {?} connection
         * @return {undefined}
         */
        function constructor(isSummary, connection) {
            isSummary["emit"]('error', connection);
        }
        var debug = debu('process-nextick-args');
        data["exports"] = {
            "destroy": function(value, error) {
                var mediaQueryStack = this;
                var inputWin = this['_readableState'] && this['_readableState']['destroyed'];
                var winRef = this['_writableState'] && this['_writableState']['destroyed'];
                if (inputWin || winRef) {
                    if (error) {
                        error(value);
                    } else {
                        if (!(!value || this['_writableState'] && this['_writableState']['errorEmitted'])) {
                            debug(constructor, this, value);
                        }
                    }
                } else {
                    if (this["_readableState"]) {
                        /** @type {boolean} */
                        this['_readableState']['destroyed'] = true;
                    }
                    if (this['_writableState']) {
                        /** @type {boolean} */
                        this["_writableState"]['destroyed'] = true;
                    }
                    this["_destroy"](value || null, function(token) {
                        if (!error && token) {
                            debug(constructor, mediaQueryStack, token);
                            if (mediaQueryStack['_writableState']) {
                                /** @type {boolean} */
                                mediaQueryStack["_writableState"]['errorEmitted'] = true;
                            }
                        } else {
                            if (error) {
                                error(token);
                            }
                        }
                    });
                }
            },
            "undestroy": function() {
                if (this['_readableState']) {
                    /** @type {boolean} */
                    this['_readableState']['destroyed'] = false;
                    /** @type {boolean} */
                    this['_readableState']['reading'] = false;
                    /** @type {boolean} */
                    this['_readableState']['ended'] = false;
                    /** @type {boolean} */
                    this["_readableState"]['endEmitted'] = false;
                }
                if (this["_writableState"]) {
                    /** @type {boolean} */
                    this['_writableState']['destroyed'] = false;
                    /** @type {boolean} */
                    this['_writableState']['ended'] = false;
                    /** @type {boolean} */
                    this["_writableState"]["ending"] = false;
                    /** @type {boolean} */
                    this['_writableState']['finished'] = false;
                    /** @type {boolean} */
                    this["_writableState"]['errorEmitted'] = false;
                }
            }
        };
    }, {
        "process-nextick-args": 21
    }],
    31: [function(saveNotifs, module, canCreateDiscussions) {
        module["exports"] = saveNotifs('events')["EventEmitter"];
    }, {
        "events": 8
    }],
    32: [function(saveNotifs, canCreateDiscussions, isSlidingUp) {
        canCreateDiscussions["exports"] = saveNotifs('./readable')["PassThrough"];
    }, {
        "./readable": 33
    }],
    33: [function(render, result, data) {
        /** @type {!Object} */
        (data = result["exports"] = render('./lib/_stream_readable.js'))["Stream"] = data;
        /** @type {!Object} */
        data["Readable"] = data;
        data["Writable"] = render('./lib/_stream_writable.js');
        data["Duplex"] = render("./lib/_stream_duplex.js");
        data["Transform"] = render('./lib/_stream_transform.js');
        data["PassThrough"] = render('./lib/_stream_passthrough.js');
    }, {
        "./lib/_stream_duplex.js": 24,
        "./lib/_stream_passthrough.js": 25,
        "./lib/_stream_readable.js": 26,
        "./lib/_stream_transform.js": 27,
        "./lib/_stream_writable.js": 28
    }],
    34: [function(saveNotifs, canCreateDiscussions, isSlidingUp) {
        canCreateDiscussions["exports"] = saveNotifs('./readable')["Transform"];
    }, {
        "./readable": 33
    }],
    35: [function(require, tasks, isSlidingUp) {
        tasks["exports"] = require('./lib/_stream_writable.js');
    }, {
        "./lib/_stream_writable.js": 28
    }],
    36: [function(chan, result, global) {
        /**
         * @param {!Object} data
         * @param {!Function} result
         * @return {undefined}
         */
        function resolve(data, result) {
            var i;
            for (i in data) {
                result[i] = data[i];
            }
        }
        /**
         * @param {?} files
         * @param {?} app
         * @param {?} cmd
         * @return {?}
         */
        function callback(files, app, cmd) {
            return fn(files, app, cmd);
        }
        var out = chan("buffer");
        var fn = out["Buffer"];
        if (fn["from"] && fn["alloc"] && fn["allocUnsafe"] && fn["allocUnsafeSlow"]) {
            result["exports"] = out;
        } else {
            resolve(out, global);
            /** @type {function(?, ?, ?): ?} */
            global["Buffer"] = callback;
        }
        resolve(fn, callback);
        /**
         * @param {?} val
         * @param {?} lastErrorObject
         * @param {?} callback
         * @return {?}
         */
        callback["from"] = function(val, lastErrorObject, callback) {
            if ("number" == typeof val) {
                throw new TypeError('Argument must not be a number');
            }
            return fn(val, lastErrorObject, callback);
        };
        /**
         * @param {?} responce
         * @param {number} model
         * @param {?} relations
         * @return {?}
         */
        callback["alloc"] = function(responce, model, relations) {
            if ("number" != typeof responce) {
                throw new TypeError('Argument must be a number');
            }
            var _destructure2 = fn(responce);
            return void 0 !== model ? "string" == typeof relations ? _destructure2["fill"](model, relations) : _destructure2["fill"](model) : _destructure2["fill"](0), _destructure2;
        };
        /**
         * @param {?} responce
         * @return {?}
         */
        callback["allocUnsafe"] = function(responce) {
            if ("number" != typeof responce) {
                throw new TypeError('Argument must be a number');
            }
            return fn(responce);
        };
        /**
         * @param {?} got_res
         * @return {?}
         */
        callback["allocUnsafeSlow"] = function(got_res) {
            if ("number" != typeof got_res) {
                throw new TypeError('Argument must be a number');
            }
            return out['SlowBuffer'](got_res);
        };
    }, {
        "buffer": 3
    }],
    37: [function(require, payloadKeyObject, isSlidingUp) {
        /**
         * @return {undefined}
         */
        function embed() {
            uglifyConf["call"](this);
        }
        /** @type {function(): undefined} */
        payloadKeyObject["exports"] = embed;
        var uglifyConf = require('events')["EventEmitter"];
        require("inherits")(embed, uglifyConf);
        embed["Readable"] = require('readable-stream/readable.js');
        embed["Writable"] = require('readable-stream/writable.js');
        embed["Duplex"] = require('readable-stream/duplex.js');
        embed["Transform"] = require('readable-stream/transform.js');
        embed["PassThrough"] = require('readable-stream/passthrough.js');
        /** @type {function(): undefined} */
        embed['Stream'] = embed;
        /**
         * @param {!Object} PL$5
         * @param {boolean} canCreateDiscussions
         * @return {?}
         */
        embed["prototype"]["pipe"] = function(PL$5, canCreateDiscussions) {
            /**
             * @param {?} prop
             * @return {undefined}
             */
            function extendUndefined(prop) {
                if (PL$5["writable"] && false === PL$5["write"](prop) && p["pause"]) {
                    p["pause"]();
                }
            }
            /**
             * @return {undefined}
             */
            function PL$25() {
                if (p['readable'] && p["resume"]) {
                    p["resume"]();
                }
            }
            /**
             * @return {undefined}
             */
            function cb() {
                if (!_0xc89370) {
                    /** @type {boolean} */
                    _0xc89370 = true;
                    PL$5["end"]();
                }
            }
            /**
             * @return {undefined}
             */
            function B107() {
                if (!_0xc89370) {
                    /** @type {boolean} */
                    _0xc89370 = true;
                    if ("function" == typeof PL$5["destroy"]) {
                        PL$5["destroy"]();
                    }
                }
            }
            /**
             * @param {?} canCreateDiscussions
             * @return {undefined}
             */
            function B103(canCreateDiscussions) {
                if (forwarder(), 0 === uglifyConf["listenerCount"](this, 'error')) {
                    throw canCreateDiscussions;
                }
            }
            /**
             * @return {undefined}
             */
            function forwarder() {
                p["removeListener"]("data", extendUndefined);
                PL$5["removeListener"]('drain', PL$25);
                p["removeListener"]('end', cb);
                p["removeListener"]('close', B107);
                p["removeListener"]('error', B103);
                PL$5["removeListener"]('error', B103);
                p["removeListener"]('end', forwarder);
                p["removeListener"]('close', forwarder);
                PL$5["removeListener"]('close', forwarder);
            }
            var p = this;
            p["on"]("data", extendUndefined);
            PL$5["on"]("drain", PL$25);
            if (!(PL$5['_isStdio'] || canCreateDiscussions && false === canCreateDiscussions["end"])) {
                p["on"]('end', cb);
                p["on"]('close', B107);
            }
            /** @type {boolean} */
            var _0xc89370 = false;
            return p["on"]('error', B103), PL$5["on"]('error', B103), p["on"]("end", forwarder), p["on"]('close', forwarder), PL$5["on"]('close', forwarder), PL$5["emit"]("pipe", p), PL$5;
        };
    }, {
        "events": 8,
        "inherits": 10,
        "readable-stream/duplex.js": 23,
        "readable-stream/passthrough.js": 32,
        "readable-stream/readable.js": 33,
        "readable-stream/transform.js": 34,
        "readable-stream/writable.js": 35
    }],
    38: [function(saveNotifs, canCreateDiscussions, rpc_struct) {
        /**
         * @param {string} cb_
         * @return {?}
         */
        function write(cb_) {
            var data;
            switch (this['encoding'] = function(e) {
                var error = function(encoding) {
                    if (!encoding) {
                        return "utf8";
                    }
                    var _0x52c2de;
                    for (;;) {
                        switch (encoding) {
                            case "utf8":
                            case "utf-8":
                                return "utf8";
                            case "ucs2":
                            case 'ucs-2':
                            case "utf16le":
                            case "utf-16le":
                                return "utf16le";
                            case "latin1":
                            case "binary":
                                return "latin1";
                            case "base64":
                            case "ascii":
                            case "hex":
                                return encoding;
                            default:
                                if (_0x52c2de) {
                                    return;
                                }
                                encoding = ("" + encoding)["toLowerCase"]();
                                /** @type {boolean} */
                                _0x52c2de = true;
                        }
                    }
                }(e);
                if ("string" != typeof error && (MEPermPrun["isEncoding"] === check || !check(e))) {
                    throw new Error("Unknown encoding: " + e);
                }
                return error || e;
            }(cb_), this['encoding']) {
                case "utf16le":
                    /** @type {function(!Object, ?): ?} */
                    this['text'] = read;
                    /** @type {function(string): ?} */
                    this["end"] = tojsonObject;
                    /** @type {number} */
                    data = 4;
                    break;
                case "utf8":
                    /** @type {function(!Object): ?} */
                    this['fillLast'] = mixinStatics;
                    /** @type {number} */
                    data = 4;
                    break;
                case "base64":
                    /** @type {function(!Object, ?): ?} */
                    this['text'] = forEach;
                    /** @type {function(string): ?} */
                    this["end"] = mapDestPath;
                    /** @type {number} */
                    data = 3;
                    break;
                default:
                    return this["write"] = extractPresetLocal, void(this["end"] = WAssert);
            }
            /** @type {number} */
            this['lastNeed'] = 0;
            /** @type {number} */
            this['lastTotal'] = 0;
            this['lastChar'] = MEPermPrun["allocUnsafe"](data);
        }
        /**
         * @param {number} i
         * @return {?}
         */
        function eq(i) {
            return i <= 127 ? 0 : i >> 5 == 6 ? 2 : i >> 4 == 14 ? 3 : i >> 3 == 30 ? 4 : -1;
        }
        /**
         * @param {!Object} from
         * @return {?}
         */
        function mixinStatics(from) {
            /** @type {number} */
            var data = this['lastTotal'] - this['lastNeed'];
            var response = function(EMSarray, b, originalEventData) {
                if (128 != (192 & b[0])) {
                    return EMSarray['lastNeed'] = 0, "\ufffd" ['repeat'](originalEventData);
                }
                if (EMSarray["lastNeed"] > 1 && b["length"] > 1) {
                    if (128 != (192 & b[1])) {
                        return EMSarray['lastNeed'] = 1, "\ufffd" ["repeat"](originalEventData + 1);
                    }
                    if (EMSarray['lastNeed'] > 2 && b["length"] > 2 && 128 != (192 & b[2])) {
                        return EMSarray['lastNeed'] = 2, "\ufffd" ['repeat'](originalEventData + 2);
                    }
                }
            }(this, from, data);
            return void 0 !== response ? response : this['lastNeed'] <= from["length"] ? (from["copy"](this['lastChar'], data, 0, this["lastNeed"]), this['lastChar']["toString"](this['encoding'], 0, this['lastTotal'])) : (from["copy"](this['lastChar'], data, 0, from["length"]), void(this['lastNeed'] -= from["length"]));
        }
        /**
         * @param {!Object} async
         * @param {?} callback
         * @return {?}
         */
        function read(async, callback) {
            if ((async ["length"] - callback) % 2 == 0) {
                var p = async ["toString"]("utf16le", callback);
                if (p) {
                    var _0x21ec1c = p["charCodeAt"](p["length"] - 1);
                    if (_0x21ec1c >= 55296 && _0x21ec1c <= 56319) {
                        return this['lastNeed'] = 2, this['lastTotal'] = 4, this['lastChar'][0] = async [async ["length"] - 2], this['lastChar'][1] = async [async ["length"] - 1], p["slice"](0, -1);
                    }
                }
                return p;
            }
            return this['lastNeed'] = 1, this['lastTotal'] = 2, this['lastChar'][0] = async [async ["length"] - 1], async ["toString"]("utf16le", callback, async ["length"] - 1);
        }
        /**
         * @param {string} x
         * @return {?}
         */
        function tojsonObject(x) {
            var comic_number_and_created_date_string = x && x["length"] ? this["write"](x) : "";
            if (this['lastNeed']) {
                /** @type {number} */
                var year = this['lastTotal'] - this['lastNeed'];
                return comic_number_and_created_date_string + this["lastChar"]["toString"]("utf16le", 0, year);
            }
            return comic_number_and_created_date_string;
        }
        /**
         * @param {!Object} collection
         * @param {?} options
         * @return {?}
         */
        function forEach(collection, options) {
            /** @type {number} */
            var functionType = (collection["length"] - options) % 3;
            return 0 === functionType ? collection["toString"]("base64", options) : (this['lastNeed'] = 3 - functionType, this['lastTotal'] = 3, 1 === functionType ? this['lastChar'][0] = collection[collection["length"] - 1] : (this["lastChar"][0] = collection[collection["length"] - 2], this["lastChar"][1] = collection[collection["length"] - 1]), collection["toString"]("base64", options, collection["length"] - functionType));
        }
        /**
         * @param {string} file
         * @return {?}
         */
        function mapDestPath(file) {
            var dataUrl = file && file["length"] ? this["write"](file) : "";
            return this['lastNeed'] ? dataUrl + this['lastChar']["toString"]("base64", 0, 3 - this['lastNeed']) : dataUrl;
        }
        /**
         * @param {?} callback
         * @return {?}
         */
        function extractPresetLocal(callback) {
            return callback["toString"](this['encoding']);
        }
        /**
         * @param {string} message
         * @return {?}
         */
        function WAssert(message) {
            return message && message["length"] ? this["write"](message) : "";
        }
        var MEPermPrun = saveNotifs('safe-buffer')["Buffer"];
        var check = MEPermPrun['isEncoding'] || function(fn) {
            switch ((fn = "" + fn) && fn["toLowerCase"]()) {
                case "hex":
                case "utf8":
                case "utf-8":
                case "ascii":
                case "binary":
                case "base64":
                case "ucs2":
                case 'ucs-2':
                case "utf16le":
                case "utf-16le":
                case 'raw':
                    return true;
                default:
                    return false;
            }
        };
        /** @type {function(string): ?} */
        rpc_struct["StringDecoder"] = write;
        /**
         * @param {?} change
         * @return {?}
         */
        write["prototype"]["write"] = function(change) {
            if (0 === change["length"]) {
                return "";
            }
            var result;
            var i;
            if (this['lastNeed']) {
                if (void 0 === (result = this['fillLast'](change))) {
                    return "";
                }
                i = this['lastNeed'];
                /** @type {number} */
                this["lastNeed"] = 0;
            } else {
                /** @type {number} */
                i = 0;
            }
            return i < change["length"] ? result ? result + this['text'](change, i) : this['text'](change, i) : result || "";
        };
        /**
         * @param {string} foundVersion
         * @return {?}
         */
        write["prototype"]["end"] = function(foundVersion) {
            var opt_by = foundVersion && foundVersion["length"] ? this["write"](foundVersion) : "";
            return this['lastNeed'] ? opt_by + "\ufffd" ['repeat'](this['lastTotal'] - this["lastNeed"]) : opt_by;
        };
        /**
         * @param {!Object} arr
         * @param {undefined} i
         * @return {?}
         */
        write["prototype"]['text'] = function(arr, i) {
            var value = function(EMSarray, a, nconst) {
                /** @type {number} */
                var i = a["length"] - 1;
                if (i < nconst) {
                    return 0;
                }
                var result = eq(a[i]);
                if (result >= 0) {
                    return result > 0 && (EMSarray['lastNeed'] = result - 1), result;
                }
                if (--i < nconst) {
                    return 0;
                }
                if ((result = eq(a[i])) >= 0) {
                    return result > 0 && (EMSarray['lastNeed'] = result - 2), result;
                }
                if (--i < nconst) {
                    return 0;
                }
                if ((result = eq(a[i])) >= 0) {
                    return result > 0 && (2 === result ? result = 0 : EMSarray['lastNeed'] = result - 3), result;
                }
                return 0;
            }(this, arr, i);
            if (!this["lastNeed"]) {
                return arr["toString"]("utf8", i);
            }
            this['lastTotal'] = value;
            /** @type {number} */
            var series = arr["length"] - (value - this['lastNeed']);
            return arr["copy"](this["lastChar"], 0, series), arr["toString"]("utf8", i, series);
        };
        /**
         * @param {?} canCreateDiscussions
         * @return {?}
         */
        write["prototype"]["fillLast"] = function(canCreateDiscussions) {
            if (this["lastNeed"] <= canCreateDiscussions["length"]) {
                return canCreateDiscussions["copy"](this["lastChar"], this['lastTotal'] - this['lastNeed'], 0, this['lastNeed']), this['lastChar']["toString"](this['encoding'], 0, this['lastTotal']);
            }
            canCreateDiscussions["copy"](this["lastChar"], this['lastTotal'] - this['lastNeed'], 0, canCreateDiscussions["length"]);
            this['lastNeed'] -= canCreateDiscussions["length"];
        };
    }, {
        "safe-buffer": 36
    }],
    39: [function(isSlidingUp, canCreateDiscussions, dontForceConstraints) {
        (function(instruction) {
            /**
             * @param {?} field
             * @return {?}
             */
            function getName(field) {
                try {
                    if (!instruction["localStorage"]) {
                        return false;
                    }
                } catch (_0x2fc4f8) {
                    return false;
                }
                var val = instruction["localStorage"][field];
                return null != val && 'true' === String(val)["toLowerCase"]();
            }
            /**
             * @param {?} _getModal
             * @param {?} a
             * @return {?}
             */
            canCreateDiscussions["exports"] = function(_getModal, a) {
                if (getName('noDeprecation')) {
                    return _getModal;
                }
                /** @type {boolean} */
                var _0x5e098f = false;
                return function() {
                    if (!_0x5e098f) {
                        if (getName('throwDeprecation')) {
                            throw new Error(a);
                        }
                        if (getName('traceDeprecation')) {
                            console["trace"](a);
                        } else {
                            console['warn'](a);
                        }
                        /** @type {boolean} */
                        _0x5e098f = true;
                    }
                    return _getModal["apply"](this, arguments);
                };
            };
        })["call"](this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
    }, {}],
    40: [function(canCreateDiscussions, isSlidingUp, mmCoreSplitViewBlock) {
        arguments[4][10][0]["apply"](mmCoreSplitViewBlock, arguments);
    }, {
        "dup": 10
    }],
    41: [function(isSlidingUp, canCreateDiscussions, dontForceConstraints) {
        /**
         * @param {string} canCreateDiscussions
         * @return {?}
         */
        canCreateDiscussions["exports"] = function(canCreateDiscussions) {
            return canCreateDiscussions && 'object' == typeof canCreateDiscussions && "function" == typeof canCreateDiscussions["copy"] && "function" == typeof canCreateDiscussions["fill"] && "function" == typeof canCreateDiscussions["readUInt8"];
        };
    }, {}],
    42: [function(require, canCreateDiscussions, obj) {
        (function(dictionary, window) {
            /**
             * @param {!Object} dir
             * @param {?} width
             * @return {?}
             */
            function f(dir, width) {
                var data = {
                    "seen": [],
                    "stylize": stylizeNoColor
                };
                return arguments["length"] >= 3 && (data['depth'] = arguments[2]), arguments["length"] >= 4 && (data["colors"] = arguments[3]), isNaN(width) ? data['showHidden'] = width : width && obj["_extend"](data, width), $(data['showHidden']) && (data['showHidden'] = false), $(data["depth"]) && (data['depth'] = 2), $(data["colors"]) && (data["colors"] = false), $(data["customInspect"]) && (data['customInspect'] = true), data["colors"] && (data['stylize'] =
                    item), next(data, dir, data["depth"]);
            }
            /**
             * @param {string} text
             * @param {?} i
             * @return {?}
             */
            function item(text, i) {
                var style = f["styles"][i];
                return style ? "\u001b[" + f["colors"][style][0] + "m" + text + "\u001b[" + f["colors"][style][1] + "m" : text;
            }
            /**
             * @param {?} str
             * @param {?} styleType
             * @return {?}
             */
            function stylizeNoColor(str, styleType) {
                return str;
            }
            /**
             * @param {!Object} i
             * @param {!Object} target
             * @param {?} data
             * @return {?}
             */
            function next(i, target, data) {
                if (i['customInspect'] && target && proxy(target["inspect"]) && target["inspect"] !== obj["inspect"] && (!target["constructor"] || target["constructor"]["prototype"] !== target)) {
                    var buffer = target["inspect"](data, i);
                    return fn(buffer) || (buffer = next(i, buffer, data)), buffer;
                }
                var image = function(element, input) {
                    if ($(input)) {
                        return element['stylize']("undefined", "undefined");
                    }
                    if (fn(input)) {
                        /** @type {string} */
                        var selector = "'" + JSON["stringify"](input)['replace'](/^"|"$/g, "")['replace'](/'/g, "\\'")['replace'](/\\"/g, '"') + "'";
                        return element['stylize'](selector, "string");
                    }
                    if (setGeometry(input)) {
                        return element['stylize']("" + input, "number");
                    }
                    if (isNaN(input)) {
                        return element['stylize']("" + input, "boolean");
                    }
                    if (isArray(input)) {
                        return element['stylize']('null', 'null');
                    }
                }(i, target);
                if (image) {
                    return image;
                }
                var next = Object['keys'](target);
                var cb = function(first) {
                    var subwikiListsCache = {};
                    return first['forEach'](function(wikiId, canCreateDiscussions) {
                        /** @type {boolean} */
                        subwikiListsCache[wikiId] = true;
                    }), subwikiListsCache;
                }(next);
                if (i['showHidden'] && (next = Object['getOwnPropertyNames'](target)), recordAction(target) && (next["indexOf"]('message') >= 0 || next["indexOf"]('description') >= 0)) {
                    return once(target);
                }
                if (0 === next["length"]) {
                    if (proxy(target)) {
                        var opt_by = target["name"] ? ": " + target['name'] : "";
                        return i["stylize"]('[Function' + opt_by + "]", 'special');
                    }
                    if (d(target)) {
                        return i['stylize'](RegExp["prototype"]["toString"]["call"](target), 'regexp');
                    }
                    if (contains(target)) {
                        return i['stylize'](Date["prototype"]["toString"]["call"](target), "date");
                    }
                    if (recordAction(target)) {
                        return once(target);
                    }
                }
                var els;
                /** @type {string} */
                var px = "";
                /** @type {boolean} */
                var selector = false;
                /** @type {!Array} */
                var bbox = ["{", "}"];
                if (makeEntryActive(target) && (selector = true, bbox = ["[", "]"]), proxy(target)) {
                    /** @type {string} */
                    px = ' [Function' + (target["name"] ? ": " + target["name"] : "") + "]";
                }
                return d(target) && (px = " " + RegExp["prototype"]["toString"]["call"](target)), contains(target) && (px = " " + Date["prototype"]["toUTCString"]["call"](target)), recordAction(target) && (px = " " + once(target)), 0 !== next["length"] || selector && 0 != target["length"] ? data < 0 ? d(target) ? i["stylize"](RegExp["prototype"]["toString"]["call"](target), 'regexp') : i["stylize"]('[Object]', 'special') : (i['seen']["push"](target),
                    els = selector ? function(x, item, key, cb, result) {
                        /** @type {!Array} */
                        var d = [];
                        /** @type {number} */
                        var i = 0;
                        var trials = item["length"];
                        for (; i < trials; ++i) {
                            if (test(item, String(i))) {
                                d["push"](set(x, item, key, cb, String(i), true));
                            } else {
                                d["push"]("");
                            }
                        }
                        return result["forEach"](function(value) {
                            if (!value["match"](/^\d+$/)) {
                                d["push"](set(x, item, key, cb, value, true));
                            }
                        }), d;
                    }(i, target, data, cb, next) : next["map"](function(value) {
                        return set(i, target, data, cb, value, selector);
                    }), i['seen']['pop'](),
                    function(a, b, output) {
                        if (a['reduce'](function(sum, href) {
                                return 0, href["indexOf"]("\n") >= 0 && 0, sum + href['replace'](/\u001b\[\d\d?m/g, "")["length"] + 1;
                            }, 0) > 60) {
                            return output[0] + ("" === b ? "" : b + "\n ") + " " + a["join"](',\n  ') + " " + output[1];
                        }
                        return output[0] + b + " " + a["join"](", ") + " " + output[1];
                    }(els, px, bbox)) : bbox[0] + px + bbox[1];
            }
            /**
             * @param {!Object} obj
             * @return {?}
             */
            function once(obj) {
                return "[" + Error["prototype"]["toString"]["call"](obj) + "]";
            }
            /**
             * @param {!Object} fn
             * @param {!Object} obj
             * @param {number} args
             * @param {!Function} func
             * @param {string} prop
             * @param {boolean} match
             * @return {?}
             */
            function set(fn, obj, args, func, prop, match) {
                var filter;
                var value;
                var queue;
                if ((queue = Object["getOwnPropertyDescriptor"](obj, prop) || {
                        "value": obj[prop]
                    })['get'] ? value = queue['set'] ? fn['stylize']("[Getter/Setter]", "special") : fn['stylize']('[Getter]', 'special') : queue['set'] && (value = fn['stylize']('[Setter]', 'special')), test(func, prop) || (filter = "[" + prop + "]"), value || (fn['seen']["indexOf"](queue['value']) < 0 ? (value = isArray(args) ? next(fn, queue['value'], null) : next(fn, queue['value'], args - 1))["indexOf"]("\n") >
                        -1 && (value = match ? value['split']("\n")['map'](function(canCreateDiscussions) {
                            return "  " + canCreateDiscussions;
                        })["join"]("\n")['substr'](2) : "\n" + value['split']("\n")['map'](function(canCreateDiscussions) {
                            return '   ' + canCreateDiscussions;
                        })["join"]("\n")) : value = fn['stylize']('[Circular]', "special")), $(filter)) {
                    if (match && prop["match"](/^\d+$/)) {
                        return value;
                    }
                    if ((filter = JSON["stringify"]("" + prop))["match"](/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
                        filter = filter["substr"](1, filter["length"] - 2);
                        filter = fn['stylize'](filter, 'name');
                    } else {
                        filter = filter["replace"](/'/g, "\\'")['replace'](/\\"/g, '"')['replace'](/(^"|"$)/g, "'");
                        filter = fn['stylize'](filter, "string");
                    }
                }
                return filter + ": " + value;
            }
            /**
             * @param {!Object} arr
             * @return {?}
             */
            function makeEntryActive(arr) {
                return Array["isArray"](arr);
            }
            /**
             * @param {?} value
             * @return {?}
             */
            function isNaN(value) {
                return "boolean" == typeof value;
            }
            /**
             * @param {!Object} arr
             * @return {?}
             */
            function isArray(arr) {
                return null === arr;
            }
            /**
             * @param {?} width
             * @return {?}
             */
            function setGeometry(width) {
                return "number" == typeof width;
            }
            /**
             * @param {?} arr
             * @return {?}
             */
            function fn(arr) {
                return "string" == typeof arr;
            }
            /**
             * @param {!Array} name
             * @return {?}
             */
            function $(name) {
                return void 0 === name;
            }
            /**
             * @param {boolean} e
             * @return {?}
             */
            function d(e) {
                return log(e) && "[object RegExp]" === find(e);
            }
            /**
             * @param {string} arg
             * @return {?}
             */
            function log(arg) {
                return "object" == typeof arg && null !== arg;
            }
            /**
             * @param {boolean} path
             * @return {?}
             */
            function contains(path) {
                return log(path) && "[object Date]" === find(path);
            }
            /**
             * @param {string} e
             * @return {?}
             */
            function recordAction(e) {
                return log(e) && ('[object Error]' === find(e) || e instanceof Error);
            }
            /**
             * @param {!Object} after
             * @return {?}
             */
            function proxy(after) {
                return "function" == typeof after;
            }
            /**
             * @param {string} x
             * @return {?}
             */
            function find(x) {
                return Object["prototype"]["toString"]["call"](x);
            }
            /**
             * @param {number} hide
             * @return {?}
             */
            function change_btn(hide) {
                return hide < 10 ? "0" + hide["toString"](10) : hide["toString"](10);
            }
            /**
             * @param {!Function} size
             * @param {string} name
             * @return {?}
             */
            function test(size, name) {
                return Object["prototype"]["hasOwnProperty"]["call"](size, name);
            }
            /** @type {!RegExp} */
            var _digitExpr = /%[sdj%]/g;
            /**
             * @param {?} lhs
             * @return {?}
             */
            obj["format"] = function(lhs) {
                if (!fn(lhs)) {
                    /** @type {!Array} */
                    var output = [];
                    /** @type {number} */
                    var x = 0;
                    for (; x < arguments["length"]; x++) {
                        output["push"](f(arguments[x]));
                    }
                    return output["join"](" ");
                }
                /** @type {number} */
                x = 1;
                /** @type {!Arguments} */
                var params = arguments;
                var mu = params["length"];
                var allPages = String(lhs)['replace'](_digitExpr, function(canCreateDiscussions) {
                    if ("%%" === canCreateDiscussions) {
                        return "%";
                    }
                    if (x >= mu) {
                        return canCreateDiscussions;
                    }
                    switch (canCreateDiscussions) {
                        case "%s":
                            return String(params[x++]);
                        case "%d":
                            return Number(params[x++]);
                        case "%j":
                            try {
                                return JSON["stringify"](params[x++]);
                            } catch (_0x7aad27) {
                                return '[Circular]';
                            }
                        default:
                            return canCreateDiscussions;
                    }
                });
                var path = params[x];
                for (; x < mu; path = params[++x]) {
                    if (isArray(path) || !log(path)) {
                        /** @type {string} */
                        allPages = allPages + (" " + path);
                    } else {
                        /** @type {string} */
                        allPages = allPages + (" " + f(path));
                    }
                }
                return allPages;
            };
            /**
             * @param {?} elem
             * @param {?} msg
             * @return {?}
             */
            obj["deprecate"] = function(elem, msg) {
                if ($(window["process"])) {
                    return function() {
                        return obj["deprecate"](elem, msg)["apply"](this, arguments);
                    };
                }
                if (true === dictionary["noDeprecation"]) {
                    return elem;
                }
                /** @type {boolean} */
                var _0x1e7d72 = false;
                return function() {
                    if (!_0x1e7d72) {
                        if (dictionary['throwDeprecation']) {
                            throw new Error(msg);
                        }
                        if (dictionary['traceDeprecation']) {
                            console["trace"](msg);
                        } else {
                            console["error"](msg);
                        }
                        /** @type {boolean} */
                        _0x1e7d72 = true;
                    }
                    return elem["apply"](this, arguments);
                };
            };
            var content;
            var __WEBPACK_IMPORTED_MODULE_2__array_index__ = {};
            /**
             * @param {string} b
             * @return {?}
             */
            obj["debuglog"] = function(b) {
                if ($(content) && (content = dictionary["env"]['NODE_DEBUG'] || ""), b = b['toUpperCase'](), !__WEBPACK_IMPORTED_MODULE_2__array_index__[b]) {
                    if ((new RegExp("\\b" + b + "\\b", "i"))['test'](content)) {
                        var value = dictionary['pid'];
                        /**
                         * @return {undefined}
                         */
                        __WEBPACK_IMPORTED_MODULE_2__array_index__[b] = function() {
                            var d = obj["format"]["apply"](obj, arguments);
                            console["error"]('%s %d: %s', b, value, d);
                        };
                    } else {
                        /**
                         * @return {undefined}
                         */
                        __WEBPACK_IMPORTED_MODULE_2__array_index__[b] = function() {};
                    }
                }
                return __WEBPACK_IMPORTED_MODULE_2__array_index__[b];
            };
            /** @type {function(!Object, ?): ?} */
            obj["inspect"] = f;
            f["colors"] = {
                "bold": [1, 22],
                "italic": [3, 23],
                "underline": [4, 24],
                "inverse": [7, 27],
                "white": [37, 39],
                "grey": [90, 39],
                "black": [30, 39],
                "blue": [34, 39],
                "cyan": [36, 39],
                "green": [32, 39],
                "magenta": [35, 39],
                "red": [31, 39],
                "yellow": [33, 39]
            };
            f["styles"] = {
                "special": 'cyan',
                "number": 'yellow',
                "boolean": 'yellow',
                "undefined": 'grey',
                "null": 'bold',
                "string": 'green',
                "date": 'magenta',
                "regexp": "red"
            };
            /** @type {function(!Object): ?} */
            obj["isArray"] = makeEntryActive;
            /** @type {function(?): ?} */
            obj["isBoolean"] = isNaN;
            /** @type {function(!Object): ?} */
            obj["isNull"] = isArray;
            /**
             * @param {string} canCreateDiscussions
             * @return {?}
             */
            obj["isNullOrUndefined"] = function(canCreateDiscussions) {
                return null == canCreateDiscussions;
            };
            /** @type {function(?): ?} */
            obj["isNumber"] = setGeometry;
            /** @type {function(?): ?} */
            obj["isString"] = fn;
            /**
             * @param {?} canCreateDiscussions
             * @return {?}
             */
            obj["isSymbol"] = function(canCreateDiscussions) {
                return 'symbol' == typeof canCreateDiscussions;
            };
            /** @type {function(!Array): ?} */
            obj["isUndefined"] = $;
            /** @type {function(boolean): ?} */
            obj["isRegExp"] = d;
            /** @type {function(string): ?} */
            obj["isObject"] = log;
            /** @type {function(boolean): ?} */
            obj["isDate"] = contains;
            /** @type {function(string): ?} */
            obj["isError"] = recordAction;
            /** @type {function(!Object): ?} */
            obj["isFunction"] = proxy;
            /**
             * @param {!Array} x
             * @return {?}
             */
            obj["isPrimitive"] = function(x) {
                return null === x || "boolean" == typeof x || "number" == typeof x || "string" == typeof x || "symbol" == typeof x || void 0 === x;
            };
            obj["isBuffer"] = require("./support/isBuffer");
            /** @type {!Array} */
            var months = ['Jan', 'Feb', "Mar", 'Apr', "May", 'Jun', "Jul", 'Aug', 'Sep', "Oct", 'Nov', 'Dec'];
            /**
             * @return {undefined}
             */
            obj["log"] = function() {
                var okval;
                var func;
                console["log"]('%s - %s', (okval = new Date, func = [change_btn(okval["getHours"]()), change_btn(okval['getMinutes']()), change_btn(okval['getSeconds']())]["join"](":"), [okval["getDate"](), months[okval['getMonth']()], func]["join"](" ")), obj["format"]["apply"](obj, arguments));
            };
            obj["inherits"] = require('inherits');
            /**
             * @param {?} acc
             * @param {string} obj
             * @return {?}
             */
            obj["_extend"] = function(acc, obj) {
                if (!obj || !log(obj)) {
                    return acc;
                }
                var x = Object['keys'](obj);
                var key = x["length"];
                for (; key--;) {
                    acc[x[key]] = obj[x[key]];
                }
                return acc;
            };
        })["call"](this, require("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
    }, {
        "./support/isBuffer": 41,
        "_process": 22,
        "inherits": 40
    }],
    43: [function(canCreateDiscussions, isSlidingUp, mmCoreSplitViewBlock) {
        arguments[4][5][0]["apply"](mmCoreSplitViewBlock, arguments);
    }, {
        "./lib/uint32": 44,
        "./lib/uint64": 45,
        "dup": 5
    }],
    44: [function(canCreateDiscussions, isSlidingUp, mmCoreSplitViewBlock) {
        arguments[4][6][0]["apply"](mmCoreSplitViewBlock, arguments);
    }, {
        "dup": 6
    }],
    45: [function(canCreateDiscussions, isSlidingUp, mmCoreSplitViewBlock) {
        arguments[4][7][0]["apply"](mmCoreSplitViewBlock, arguments);
    }, {
        "dup": 7
    }],
    46: [function(saveNotifs, window, canCreateDiscussions) {
        (function(ByteBuffer) {
            ! function(window) {
                /**
                 * @return {?}
                 */
                function URI() {
                    return 2 == arguments["length"] ? (new URI(arguments[1]))["update"](arguments[0])["digest"]() : this instanceof URI ? void module["call"](this, arguments[0]) : new URI(arguments[0]);
                }
                /**
                 * @param {?} value
                 * @return {?}
                 */
                function module(value) {
                    return this['seed'] = value instanceof Number ? value["clone"]() : Number(value), this["v1"] = this['seed']["clone"]()["add"](numberOfTiles), this["v2"] = this["seed"]["clone"]()["add"](level), this["v3"] = this['seed']["clone"](), this["v4"] = this['seed']["clone"]()["subtract"](heightInches), this['total_len'] = 0, this['memsize'] = 0, this['memory'] = null, this;
                }
                var Number = saveNotifs("cuint")["UINT32"];
                /**
                 * @param {?} i
                 * @param {?} mmCoreSecondsDay
                 * @return {undefined}
                 */
                Number["prototype"]["xxh_update"] = function(i, mmCoreSecondsDay) {
                    var now;
                    var stop;
                    var daysToStart = level["_low"];
                    var interval = level["_high"];
                    /** @type {number} */
                    now = (stop = i * daysToStart) >>> 16;
                    /** @type {number} */
                    now = now + mmCoreSecondsDay * daysToStart;
                    /** @type {number} */
                    now = now & 65535;
                    /** @type {number} */
                    now = now + i * interval;
                    var carry = this["_low"] + (65535 & stop);
                    /** @type {number} */
                    var ncarry = carry >>> 16;
                    /** @type {number} */
                    var mask = (ncarry = ncarry + (this["_high"] + (65535 & now))) << 16 | 65535 & carry;
                    /** @type {number} */
                    ncarry = (mask = mask << 13 | mask >>> 19) >>> 16;
                    /** @type {number} */
                    now = (stop = (carry = 65535 & mask) * (daysToStart = heightInches["_low"])) >>> 16;
                    /** @type {number} */
                    now = now + ncarry * daysToStart;
                    /** @type {number} */
                    now = now & 65535;
                    /** @type {number} */
                    now = now + carry * (interval = heightInches["_high"]);
                    /** @type {number} */
                    this["_low"] = 65535 & stop;
                    /** @type {number} */
                    this["_high"] = 65535 & now;
                };
                var heightInches = Number('2654435761');
                var level = Number("2246822519");
                var power = Number('3266489917');
                var oldTtl = Number('668265263');
                var key = Number('374761393');
                var numberOfTiles = heightInches["clone"]()["add"](level);
                /** @type {function(?): ?} */
                URI["prototype"]["init"] = module;
                /**
                 * @param {!Object} data
                 * @return {?}
                 */
                URI["prototype"]["update"] = function(data) {
                    var buffer;
                    /** @type {boolean} */
                    var HAS_BROKEN_LINEHEIGHT = "string" == typeof data;
                    if (HAS_BROKEN_LINEHEIGHT) {
                        data = function(data) {
                            /** @type {!Array} */
                            var settingHandler = [];
                            /** @type {number} */
                            var parameter = 0;
                            var dataBin = data["length"];
                            for (; parameter < dataBin; parameter++) {
                                var value = data["charCodeAt"](parameter);
                                if (value < 128) {
                                    settingHandler["push"](value);
                                } else {
                                    if (value < 2048) {
                                        settingHandler["push"](192 | value >> 6, 128 | 63 & value);
                                    } else {
                                        if (value < 55296 || value >= 57344) {
                                            settingHandler["push"](224 | value >> 12, 128 | value >> 6 & 63, 128 | 63 & value);
                                        } else {
                                            parameter++;
                                            /** @type {number} */
                                            value = 65536 + ((1023 & value) << 10 | 1023 & data["charCodeAt"](parameter));
                                            settingHandler["push"](240 | value >> 18, 128 | value >> 12 & 63, 128 | value >> 6 & 63, 128 | 63 & value);
                                        }
                                    }
                                }
                            }
                            return new Uint8Array(settingHandler);
                        }(data);
                        /** @type {boolean} */
                        HAS_BROKEN_LINEHEIGHT = false;
                        /** @type {boolean} */
                        buffer = true;
                    }
                    if ("undefined" != typeof ArrayBuffer && data instanceof ArrayBuffer) {
                        /** @type {boolean} */
                        buffer = true;
                        /** @type {!Uint8Array} */
                        data = new Uint8Array(data);
                    }
                    /** @type {number} */
                    var i = 0;
                    var size = data["length"];
                    var l = i + size;
                    if (0 == size) {
                        return this;
                    }
                    if (this['total_len'] += size, 0 == this['memsize'] && (this['memory'] = HAS_BROKEN_LINEHEIGHT ? "" : buffer ? new Uint8Array(16) : new ByteBuffer(16)), this['memsize'] + size < 16) {
                        return HAS_BROKEN_LINEHEIGHT ? this['memory'] += data : buffer ? this["memory"]['set'](data["subarray"](0, size), this['memsize']) : data["copy"](this['memory'], this['memsize'], 0, size), this['memsize'] += size, this;
                    }
                    if (this['memsize'] > 0) {
                        if (HAS_BROKEN_LINEHEIGHT) {
                            this["memory"] += data["slice"](0, 16 - this['memsize']);
                        } else {
                            if (buffer) {
                                this["memory"]["set"](data["subarray"](0, 16 - this['memsize']), this['memsize']);
                            } else {
                                data["copy"](this["memory"], this['memsize'], 0, 16 - this["memsize"]);
                            }
                        }
                        /** @type {number} */
                        var PL$19 = 0;
                        if (HAS_BROKEN_LINEHEIGHT) {
                            this["v1"]["xxh_update"](this['memory']["charCodeAt"](PL$19 + 1) << 8 | this["memory"]["charCodeAt"](PL$19), this["memory"]["charCodeAt"](PL$19 + 3) << 8 | this['memory']["charCodeAt"](PL$19 + 2));
                            /** @type {number} */
                            PL$19 = PL$19 + 4;
                            this["v2"]["xxh_update"](this['memory']["charCodeAt"](PL$19 + 1) << 8 | this['memory']["charCodeAt"](PL$19), this["memory"]["charCodeAt"](PL$19 + 3) << 8 | this['memory']["charCodeAt"](PL$19 + 2));
                            /** @type {number} */
                            PL$19 = PL$19 + 4;
                            this["v3"]["xxh_update"](this['memory']["charCodeAt"](PL$19 + 1) << 8 | this['memory']["charCodeAt"](PL$19), this['memory']["charCodeAt"](PL$19 + 3) << 8 | this['memory']["charCodeAt"](PL$19 + 2));
                            /** @type {number} */
                            PL$19 = PL$19 + 4;
                            this["v4"]["xxh_update"](this['memory']["charCodeAt"](PL$19 + 1) << 8 | this['memory']["charCodeAt"](PL$19), this['memory']["charCodeAt"](PL$19 + 3) << 8 | this['memory']["charCodeAt"](PL$19 + 2));
                        } else {
                            this["v1"]["xxh_update"](this['memory'][PL$19 + 1] << 8 | this['memory'][PL$19], this['memory'][PL$19 + 3] << 8 | this['memory'][PL$19 + 2]);
                            /** @type {number} */
                            PL$19 = PL$19 + 4;
                            this["v2"]["xxh_update"](this['memory'][PL$19 + 1] << 8 | this['memory'][PL$19], this['memory'][PL$19 + 3] << 8 | this['memory'][PL$19 + 2]);
                            /** @type {number} */
                            PL$19 = PL$19 + 4;
                            this["v3"]["xxh_update"](this['memory'][PL$19 + 1] << 8 | this['memory'][PL$19], this["memory"][PL$19 + 3] << 8 | this["memory"][PL$19 + 2]);
                            /** @type {number} */
                            PL$19 = PL$19 + 4;
                            this["v4"]["xxh_update"](this['memory'][PL$19 + 1] << 8 | this["memory"][PL$19], this["memory"][PL$19 + 3] << 8 | this['memory'][PL$19 + 2]);
                        }
                        /** @type {number} */
                        i = i + (16 - this["memsize"]);
                        /** @type {number} */
                        this['memsize'] = 0;
                        if (HAS_BROKEN_LINEHEIGHT) {
                            /** @type {string} */
                            this['memory'] = "";
                        }
                    }
                    if (i <= l - 16) {
                        /** @type {number} */
                        var last = l - 16;
                        do {
                            if (HAS_BROKEN_LINEHEIGHT) {
                                this["v1"]["xxh_update"](data["charCodeAt"](i + 1) << 8 | data["charCodeAt"](i), data["charCodeAt"](i + 3) << 8 | data["charCodeAt"](i + 2));
                                /** @type {number} */
                                i = i + 4;
                                this["v2"]["xxh_update"](data["charCodeAt"](i + 1) << 8 | data["charCodeAt"](i), data["charCodeAt"](i + 3) << 8 | data["charCodeAt"](i + 2));
                                /** @type {number} */
                                i = i + 4;
                                this["v3"]["xxh_update"](data["charCodeAt"](i + 1) << 8 | data["charCodeAt"](i), data["charCodeAt"](i + 3) << 8 | data["charCodeAt"](i + 2));
                                /** @type {number} */
                                i = i + 4;
                                this["v4"]["xxh_update"](data["charCodeAt"](i + 1) << 8 | data["charCodeAt"](i), data["charCodeAt"](i + 3) << 8 | data["charCodeAt"](i + 2));
                            } else {
                                this["v1"]["xxh_update"](data[i + 1] << 8 | data[i], data[i + 3] << 8 | data[i + 2]);
                                /** @type {number} */
                                i = i + 4;
                                this["v2"]["xxh_update"](data[i + 1] << 8 | data[i], data[i + 3] << 8 | data[i + 2]);
                                /** @type {number} */
                                i = i + 4;
                                this["v3"]["xxh_update"](data[i + 1] << 8 | data[i], data[i + 3] << 8 | data[i + 2]);
                                /** @type {number} */
                                i = i + 4;
                                this["v4"]["xxh_update"](data[i + 1] << 8 | data[i], data[i + 3] << 8 | data[i + 2]);
                            }
                            /** @type {number} */
                            i = i + 4;
                        } while (i <= last);
                    }
                    return i < l && (HAS_BROKEN_LINEHEIGHT ? this['memory'] += data["slice"](i) : buffer ? this['memory']['set'](data["subarray"](i, l), this['memsize']) : data["copy"](this['memory'], this['memsize'], i, l), this['memsize'] = l - i), this;
                };
                /**
                 * @return {?}
                 */
                URI["prototype"]["digest"] = function() {
                    var item;
                    var value;
                    var data = this['memory'];
                    /** @type {boolean} */
                    var converter = "string" == typeof data;
                    /** @type {number} */
                    var i = 0;
                    var num_blocks = this['memsize'];
                    var result = new Number;
                    (item = this['total_len'] >= 16 ? this["v1"]["rotl"](1)["add"](this["v2"]["rotl"](7)["add"](this["v3"]["rotl"](12)["add"](this["v4"]["rotl"](18)))) : this['seed']["add"](key))["add"](result["fromNumber"](this['total_len']));
                    for (; i <= num_blocks - 4;) {
                        if (converter) {
                            result["fromBits"](data["charCodeAt"](i + 1) << 8 | data["charCodeAt"](i), data["charCodeAt"](i + 3) << 8 | data["charCodeAt"](i + 2));
                        } else {
                            result["fromBits"](data[i + 1] << 8 | data[i], data[i + 3] << 8 | data[i + 2]);
                        }
                        item["add"](result["multiply"](power))["rotl"](17)["multiply"](oldTtl);
                        /** @type {number} */
                        i = i + 4;
                    }
                    for (; i < num_blocks;) {
                        result["fromBits"](converter ? data["charCodeAt"](i++) : data[i++], 0);
                        item["add"](result["multiply"](key))["rotl"](11)["multiply"](heightInches);
                    }
                    return value = item["clone"]()["shiftRight"](15), item['xor'](value)["multiply"](level), value = item["clone"]()["shiftRight"](13), item["xor"](value)["multiply"](power), value = item["clone"]()["shiftRight"](16), item["xor"](value), this["init"](this['seed']), item;
                };
                if ("undefined" != typeof define && define["amd"]) {
                    define([], function() {
                        return URI;
                    });
                } else {
                    if (void 0 !== window && window["exports"]) {
                        /** @type {function(): ?} */
                        window["exports"] = URI;
                    } else {
                        /** @type {function(): ?} */
                        window["XXH"] = URI;
                    }
                }
            }(this);
        })["call"](this, saveNotifs("buffer")["Buffer"]);
    }, {
        "buffer": 3,
        "cuint": 43
    }],
    47: [function(ogarsettings, more2ogarset, ogarcanvas) {
        //here starts ogario
        (function(more2ogarset, ogarcanvas, moreogarset) {
            var more3ogarset = null,
                more4ogarset = null,
                ogarbuffed = {
                    'pl': {
                        'start': 'Start',
                        'settings': `Ustawienia`,
                        'restoreSettings': `Przywróc ustawienia domyślne`,
                        'animationGroup': 'Animacja',
                        'zoomGroup': 'Zoom',
                        'respGroup': 'Odrodzenie',
                        'namesGroup': `Nazwy`,
                        'massGroup': `Masa`,
                        'skinsGroup': `Skiny`,
                        'foodGroup': `Pokarm`,
                        'transparencyGroup': `Przezroczystość / kolory`,
                        'gridGroup': `Siatka / sektory`,
                        'miniMapGroup': `Minimapa`,
                        'helpersGroup': `Wspomagacze`,
                        'mouseGroup': `Sterowanie myszką`,
                        'hudGroup': `HUD`,
                        'chatGroup': `Czat`,
                        'statsGroup': `Statystyki`,
                        'extrasGroup': `Dodatkowe`,
                        'noSkins': `Wyłącz skiny`,
                        'noNames': 'Wyłącz nazwy',
                        'noColors': 'Wyłącz kolory',
                        'showMass': `Pokaż masę`,
                        'skipStats': 'Pomiń statystyki po śmierci',
                        'showQuest': `Pokaż zadanie (quest)`,
                        'autoZoom': `Auto zoom`,
                        'animation': `Opóźnienie animacji`,
                        'zoomSpeedValue': `Szybkość zoomu`,
                        'quickResp': `Szybkie odrodzenie (klawisz)`,
                        'autoResp': `Auto odrodzenie`,
                        'autoHideCellsInfo': `Autoukrywanie nazw i masy`,
                        'autoHideNames': 'Autoukrywanie nazw',
                        'autoHideMass': `Autoukrywanie masy`,
                        'autoHideFood': `Autoukrywanie pokarmu (masa)`,
                        'autoHideFoodOnZoom': `Autoukrywanie pokarmu (zoom)`,
                        'optimizedNames': `Zoptymalizowane nazwy`,
                        'hideMyName': 'Ukryj własną nazwę',
                        'hideTeammatesNames': 'Ukryj nazwy graczy teamu',
                        'optimizedMass': 'Zoptymalizowana masa (+/-2%)',
                        'shortMass': `Skrócona masa (k)`,
                        'virMassShots': `Licznik strzałów (wirusy)`,
                        'hideMyMass': `Ukryj własną masę`,
                        'hideEnemiesMass': 'Ukryj masę przeciwników',
                        'vanillaSkins': `Podstawowe skiny`,
                        'customSkins': `Własne skiny`,
                        'myTransparentSkin': `Mój przezroczysty skin`,
                        'myCustomColor': 'Mój własny kolor',
                        'transparentCells': `Przezroczyste kulki`,
                        'transparentViruses': `Przezroczyste wirusy`,
                        'transparentSkins': `Przezroczyste skiny`,
                        'showGrid': `Siatka`,
                        'showBgSectors': `Sektory w tle`,
                        'showMapBorders': `Granice mapy`,
                        'showGhostCells': `Duchy kulek`,
                        'showMiniMap': `Pokaż minimapę`,
                        'showMiniMapGrid': `Pokaż siatkę minimapy`,
                        'showMiniMapGuides': `Pokaż prowadnice na minimapie`,
                        'showMiniMapGhostCells': `Pokaż duchy kulek na minimapie`,
                        'oneColoredTeammates': `Jednokolorowi gracze`,
                        'optimizedFood': 'Zoptymalizowany pokarm',
                        'rainbowFood': `Kolorowy pokarm`,
                        'oppColors': `Kolory przeciwników`,
                        'oppRings': 'Ringi przeciwników',
                        'virColors': 'Kolory wirusów',
                        'splitRange': `Zasięg podziału`,
                        'virusesRange': 'Zasięg wirusów',
                        'textStroke': 'Obwódki nazw i masy',
                        'namesStroke': `Obwódki nazw`,
                        'massStroke': `Obwódki masy`,
                        'cursorTracking': `Śledzenie kursora`,
                        'teammatesInd': `Wskaźniki graczy teamu`,
                        'mouseSplit': `LPM - Split myszką`,
                        'mouseFeed': `PPM - Feed myszką`,
                        'mouseInvert': `Odwróć klawisze myszki`,
                        'disableChat': `Wyłącz czat`,
                        'hideChat': `Ukryj czat`,
                        'chatSounds': 'Powiadomienia dźwiękowe',
                        'chatEmoticons': `Emotikony`,
                        'showChatImages': `Pokaż obrazki na czacie`,
                        'showChatVideos': `Pokaż filmiki na czacie`,
                        'showChatBox': `Czatbox zamiast wyskakujących wiadomości`,
                        'messageSound': 'Dźwięk powiadomienia o wiadomości',
                        'commandSound': 'Dźwięk powiadomienia o komendzie',
                        'showTop5': `Pokaż top 5 teamu`,
                        'showTargeting': `Pokaż namierzanie`,
                        'showTime': `Pokaż aktualny czas`,
                        'showLbData': `Pokaż masę w topce`,
                        'normalLb': `Nagłówek \"Topka\"`,
                        'centeredLb': `Wyśrodkowana topka`,
                        'fpsAtTop': 'Statystyki na górze',
                        'showStats': `Pokaż statystyki`,
                        'showStatsMass': `Statystyki: Masa`,
                        'showStatsSTE': `Statystyki: STE`,
                        'showStatsN16': `Statystyki: n/16`,
                        'showStatsFPS': `Statystyki: FPS`,
                        'blockPopups': `Blokuj popupy (reklamy/sklep/zadanie)`,
                        'hotkeys': `Skróty klawiszowe`,
                        'hk-inst-assign': `Aby ustawić skrót klawiszowy kliknij na polu skrótu i naciśnij wybrany klawisz.`,
                        'hk-inst-delete': `Aby usunąć skrót klawiszowy kliknij na polu skrótu i naciśnij klawisz DELETE.`,
                        'hk-inst-keys': `Możliwe kombinacje skrótów klawiszowych z użyciem klawiszy CTRL oraz ALT.`,
                        'hk-feed': 'Feed',
                        'hk-macroFeed': `Szybki feed`,
                        'hk-split': `Podział`,
                        'hk-doubleSplit': 'Podwójny podział',
                        'hk-split16': `Podział na 16`,
                        'hk-pause': `Pauza kulki`,
                        'hk-showTop5': `Pokaż/ukryj top 5 teamu`,
                        'hk-showTime': `Pokaż/ukryj aktualny czas`,
                        'hk-showSplitRange': `Pokaż/ukryj zasięg podziału`,
                        'hk-showSplitInd': `Pokaż/ukryj zasięg podziału z ringami`,
                        'hk-showTeammatesInd': `Pokaż/ukryj wskaźniki graczy teamu`,
                        'hk-showOppColors': `Pokaż/ukryj kolory przeciwników`,
                        'hk-toggleSkins': `Przełącz skiny (własne/standardowe)`,
                        'hk-showSkins': 'Pokaż/ukryj skiny',
                        'hk-transparentSkins': 'Włącz/wyłącz przezroczyste skiny',
                        'hk-showStats': 'Pokaż/ukryj statystyki gry',
                        'hk-toggleCells': `Przełącz kulkę (najmniejsza/największa)`,
                        'hk-showFood': `Pokaż/ukryj pokarm`,
                        'hk-showGrid': `Pokaż/ukryj siatkę`,
                        'hk-showMiniMapGuides': `Pokaż/ukryj prowadnice na minimapie`,
                        'hk-hideChat': `Pokaż/ukryj czat`,
                        'hk-showHUD': `Pokaż/ukryj HUD`,
                        'hk-copyLb': 'Kopiuj topkę',
                        'hk-showLb': `Pokaż/ukryj topkę`,
                        'hk-toggleAutoZoom': `Włącz/wyłącz auto zoom`,
                        'hk-resetZoom': `Reset zoomu`,
                        'hk-zoomLevel': `Zoom - poziom`,
                        'hk-toggleDeath': `Przełącz miejsce śmierci`,
                        'hk-clearChat': `Pokaż historię czatu / Czyść czat`,
                        'hk-showBgSectors': 'Pokaż/ukryj sektory w tle',
                        'hk-hideBots': `Pokaż/ukryj małe boty`,
                        'hk-showNames': `Pokaż/ukryj nazwy`,
                        'hk-hideTeammatesNames': `Pokaż/ukryj nazwy graczy teamu`,
                        'hk-showMass': `Pokaż/ukryj masę`,
                        'hk-showMiniMap': `Pokaż/ukryj minimapę`,
                        'hk-chatMessage': `Napisz wiadomość na czacie`,
                        'hk-quickResp': `Szybkie odrodzenie (respawn)`,
                        'hk-autoResp': `Włącz/wyłacz auto odrodzenie`,
                        'hk-switchServerMode': `Przełącz serwer [publiczny/prywatny]`,
                        'hk-showTargeting': `Pokaż/ukryj panel namierzania`,
                        'hk-setTargeting': `Włącz/wyłącz namierzanie (śledzenie)`,
                        'hk-cancelTargeting': 'Zatrzymaj namierzanie',
                        'hk-changeTarget': `Zmień cel`,
                        'hk-privateMiniMap': `Pokaż cel na minimapie`,
                        'hk-showQuest': `Pokaż/ukryj zadanie`,
                        'commands': 'Komendy',
                        'comm1': `Feeduj!`,
                        'comm2': 'Dziel się!',
                        'comm3': `Pomocy na %currentSector%!`,
                        'comm4': `Wróg na %currentSector%!`,
                        'comm5': `Zabij pomocnika!`,
                        'comm6': 'Strzel z wirusa!',
                        'comm7': `Zjedz wirusa!`,
                        'comm8': `Zjebałem, wybacz.`,
                        'comm9': `Ja pierdolę...`,
                        'comm0': `Kurwa mać!`,
                        'comm10': 'Trick!',
                        'comm11': `Lewo!`,
                        'comm12': `Góra!`,
                        'comm13': `Prawo!`,
                        'comm14': `Dół!`,
                        'saveComm': `Zapisz komendy`,
                        'theme': 'Wygląd',
                        'restoreThemeSettings': `Przywróc ustawienia domyślne wyglądu`,
                        'basicTheming': 'Podstawowy',
                        'themePreset': `Motyw`,
                        'themeType': 'Typ motywu',
                        'darkTheme': `Ciemny motyw`,
                        'lightTheme': `Jasny motyw`,
                        'mainColor': 'Kolor główny',
                        'bgColor': `Tło`,
                        'bordersColor': `Granice mapy`,
                        'gridColor': `Siatka`,
                        'sectorsColor': 'Czcionka sektorów',
                        'namesColor': `Nazwy`,
                        'namesStrokeColor': `Obwódki nazw`,
                        'massColor': `Masa`,
                        'massStrokeColor': `Obwódki masy`,
                        'virusColor': 'Wirusy',
                        'virusStrokeColor': `Obwódki wirusów`,
                        'mVirusColor': 'Mothercell',
                        'mVirusStrokeColor': 'Mothercell stroke',
                        'foodColor': `Pokarm`,
                        'namesFont': `Czcionka nazw`,
                        'massFont': `Czcionka masy`,
                        'sectorsFont': 'Czcionka sektorów',
                        'namesScale': `Skala nazw`,
                        'massScale': `Skala masy`,
                        'virMassScale': `Skala masy wirusów`,
                        'strokeScale': `Skala obwódek tekstu`,
                        'foodSize': `Wielkość pokarmu`,
                        'bordersWidth': `Grubość granic mapy`,
                        'sectorsWidth': `Grubość siatki sektorów`,
                        'sectorsFontSize': 'Rozmiar czcionki sektorów',
                        'cellsAlpha': 'Przezroczystość kulek',
                        'skinsAlpha': `Przezroczystość skinów`,
                        'virusAlpha': `Przezroczystość wirusów`,
                        'textAlpha': `Przezroczystość nazw i masy`,
                        'virusStrokeSize': `Grubość obwódki wirusów`,
                        'teammatesIndColor': 'Wskaźnik gracza',
                        'cursorTrackingColor': `Śledzenie kursora`,
                        'splitRangeColor': 'Zasięg podziału',
                        'safeAreaColor': `Bezpieczna strefa`,
                        'dangerAreaColor': `Strefa zagrożenia`,
                        'ghostCellsColor': `Duchy kulek`,
                        'ghostCellsAlpha': `Przezroczystość duchów kulek`,
                        'menuTheming': 'Menu',
                        'menuPreset': `Motyw menu`,
                        'menuMainColor': `Kolor główny`,
                        'menuBtnTextColor': `Tekst przycisku`,
                        'menuPanelColor': `Panel`,
                        'menuPanelColor2': 'Panel (2)',
                        'menuTextColor': `Tekst panelu`,
                        'menuTextColor2': `Tekst panelu (2)`,
                        'btn1Color': 'Przycisk #1',
                        'btn1Color2': `Przycisk #1 (2)`,
                        'btn2Color': `Przycisk #2`,
                        'btn2Color2': `Przycisk #2 (2)`,
                        'btn3Color': `Przycisk #3`,
                        'btn3Color2': `Przycisk #3 (2)`,
                        'btn4Color': `Przycisk #4`,
                        'btn4Color2': `Przycisk #4 (2)`,
                        'menuBg': `Grafika tła panelu`,
                        'menuOpacity': 'Przezroczystość',
                        'hudTheming': `HUD`,
                        'hudMainColor': `Kolor główny`,
                        'hudColor': `Tło`,
                        'hudTextColor': 'Tekst',
                        'statsHudColor': `Statystyki`,
                        'timeHudColor': `Czas`,
                        'top5MassColor': 'Masa',
                        'lbMeColor': `Topka - ja`,
                        'lbTeammateColor': 'Topka - team',
                        'hudFont': 'Czcionka HUD',
                        'hudScale': 'Skala HUD',
                        'chatTheming': 'Czat',
                        'messageColor': `Tło wiadomości`,
                        'messageTextColor': `Tekst wiadomości`,
                        'messageTimeColor': `Czas wiadomości`,
                        'messageNickColor': `Nick wiadomości`,
                        'commandsColor': 'Tło komendy',
                        'commandsTextColor': `Tekst komendy`,
                        'commandsTimeColor': 'Czas komendy',
                        'commandsNickColor': `Nick komendy`,
                        'chatBoxColor': `Tło czatboxu`,
                        'chatScale': `Skala czatu`,
                        'miniMapTheming': `Minimapa`,
                        'miniMapSectorsColor': `Sektory`,
                        'miniMapSectorColor': `Aktualny sektor`,
                        'miniMapGuidesColor': `Prowadnice`,
                        'miniMapNickColor': `Nick`,
                        'miniMapNickStrokeColor': `Obwódka nicku`,
                        'miniMapMyCellColor': `Moja kulka`,
                        'miniMapMyCellStrokeColor': `Obwódka mojej kulki`,
                        'miniMapTeammatesColor': `Gracze`,
                        'miniMapDeathLocationColor': 'Miejsce śmierci',
                        'miniMapFont': `Czcionka minimapy`,
                        'miniMapNickFont': `Czcionka nicku`,
                        'miniMapWidth': `Szerokość minimapy`,
                        'miniMapSectorsOpacity': `Przezroczystość sektorów`,
                        'miniMapNickSize': `Rozmiar nicku`,
                        'miniMapNickStrokeSize': 'Grubość obwódki nicku',
                        'miniMapMyCellSize': `Wielkość mojej kulki`,
                        'miniMapMyCellStrokeSize': `Grubość obwódki mojej kulki`,
                        'miniMapTeammatesSize': `Wielkość graczy`,
                        'miniMapGhostCellsColor': `Duchy kulek`,
                        'miniMapGhostCellsAlpha': `Przezroczystość duchów kulek`,
                        'imagesTheming': `Grafika / kursory`,
                        'customBackground': 'Grafika tła',
                        'customCursor': 'Grafika kursora',
                        'hideChatMsgA': `Czat został włączony!`,
                        'hideChatMsgB': `Czat został ukryty!`,
                        'showSkinsMsgA': `Skiny zostały włączone!`,
                        'showSkinsMsgB': `Skiny zostały ukryte!`,
                        'hideSmallBotsMsgA': `Małe boty stały się widoczne!`,
                        'hideSmallBotsMsgB': `Małe boty zostały ukryte!`,
                        'autoRespMsgA': `Auto odrodzenie zostało włączone!`,
                        'autoRespMsgB': `Auto odrodzenie zostało wyłączone!`,
                        'autoZoomMsgA': 'Auto zoom został włączony!',
                        'autoZoomMsgB': `Auto zoom został wyłączony!`,
                        'targetNotSet': `Brak celu`,
                        'targetDead': `Nie żyje`,
                        'targetDistance': `Dystans`,
                        'targetMass': `Masa razem`,
                        'totalPartyPlayers': `Aktywnych graczy`,
                        'totalPartyMass': `Łącznie masy`,
                        'exportImport': `Eksport / import ustawień`,
                        'exportSettings': `Eksportuj ustawienia`,
                        'exportInfo': `Aby wyeksportować wybrane ustawienia skopiuj poniższy kod i zapisz go w pliku tekstowym z kodowaniem Unicode.`,
                        'importSettings': 'Importuj ustawienia',
                        'importInfo': `Aby zaimportować wybrane ustawienia wklej poniżej wyeksportowany wcześniej kod i naciśnij przycisk \"Importuj ustawienia\".`,
                        'profile': `Profil`,
                        'profiles': `Profile`,
                        'skins': `Skiny`,
                        'moreSkins': 'Dodaj skiny',
                        'thanks': `Dzięki Awesome!`,
                        'saveSett': `Zapisz ustawienia`,
                        'saved': `Zapisano!`,
                        'resetSett': `Resetuj ustawienia`,
                        'close': `Zamknij`,
                        'enterChatMsg': `Napisz wiadomość`,
                        'activeParties': `Aktywne party`,
                        'noActiveParties': `Brak aktywnych party ;(`,
                        'playlist': `Playlista`,
                        'pause': 'PAUZA!',
                        'visit': `Odwiedź`,
                        'exit': 'Legend mod Express: Czy na pewno chcesz opuścic grę?',
                        'blockWarn': `UWAGA! Popupy zostały zablokowane w ustawieniach.`,
                        'unblockPopups': `Odblokuj tymczasowo`,
                        'mass': `Masa`,
                        'score': 'Top',
                        'leaderboard': `Topka`,
                        'user': `Użytkownik`,
                        'userMuted': `Użytkownik %user% został wyciszony.`,
                        'userUnmuted': `Wyłączono wyciszenie użytkownika %user%.`,
                        'mute': `Wycisz`,
                        'unmute': `Wyłącz wyciszenie`,
                        'mutedUsers': 'Wyciszeni użytkownicy',
                        'activeUsers': 'Aktywni użytkownicy',
                        'showActiveUsers': `Pokaż aktywnych użytkowników`,
                        'none': `Brak`,
                        'sounds': `Dźwięki`,
                        'page_back_button': `Wróć`,
                        'page_create_party': `Stwórz party`,
                        'page_join_party': 'Dołącz',
                        'page_login_and_play': `Zaloguj`,
                        'page_logout': `Wyloguj`,
                        'page_menu_login_facebook': `Zaloguj z Facebook`,
                        'page_menu_login_google': `Zaloguj z Google`,
                        'page_menu_main_free_coins': `Darmowe Monety`,
                        'page_menu_main_gifts': 'Prezenty',
                        'page_menu_main_dailyquests': 'Zadania',
                        'page_party_join_error': 'Nie można dołączyć do tego party. Upewnij się, że token jest prawidłowy lub stwórz nowy.',
                        'page_play': `Graj`,
                        'page_play_as_guest': `Graj jako gość`,
                        'page_shop': `Sklep`,
                        'page_spectate': `Obserwuj`,
                        'page_stats': 'Statystyki'
                    },
                    'en': {
                        'start': `Home`,
                        'settings': `Settings`,
                        'restoreSettings': 'Restore default settings',
                        'animationGroup': 'Animation',
                        'zoomGroup': `Zoom`,
                        'respGroup': `Respawn`,
                        'namesGroup': `Names`,
                        'massGroup': `Mass`,
                        'skinsGroup': 'Skins',
                        'foodGroup': `Food`,
                        'transparencyGroup': `Transparency / colors`,
                        'gridGroup': 'Grid / sectors',
                        'miniMapGroup': `Minimap`,
                        'helpersGroup': `Helpers`,
                        'mouseGroup': `Mouse control`,
                        'hudGroup': `HUD`,
                        'chatGroup': `Chat`,
                        'statsGroup': `Stats`,
                        'extrasGroup': `Extras`,
                        'noSkins': 'No skins',
                        'noNames': `No names`,
                        'noColors': `No colors`,
                        'showMass': 'Show mass',
                        'skipStats': `Skip stats after death`,
                        'showQuest': `Show quest`,
                        'autoZoom': `Auto zoom`,
                        'animation': 'Animation delay',
                        'zoomSpeedValue': 'Zoom speed',
                        'quickResp': `Quick respawn (hotkey)`,
                        'autoResp': 'Auto respawn',
                        'autoHideCellsInfo': `Auto hide names and mass`,
                        'autoHideNames': `Auto hide names`,
                        'autoHideMass': `Auto hide mass`,
                        'autoHideFood': `Auto hide food (mass)`,
                        'autoHideFoodOnZoom': 'Auto hide food (zoom)',
                        'optimizedNames': `Optimized names`,
                        'hideMyName': `Hide my name`,
                        'hideTeammatesNames': `Hide teammates names`,
                        'optimizedMass': `Optimized mass (+/-2%)`,
                        'shortMass': `Short mass (k)`,
                        'virMassShots': 'Virus shots',
                        'hideMyMass': `Hide my mass`,
                        'hideEnemiesMass': 'Hide enemies mass',
                        'vanillaSkins': `Vanilla skins`,
                        'customSkins': `Custom skins`,
                        'myTransparentSkin': `My transparent skin`,
                        'myCustomColor': `My custom color`,
                        'transparentCells': `Transparent cells`,
                        'transparentViruses': `Transparent viruses`,
                        'transparentSkins': `Transparent skins`,
                        'showGrid': `Show grid`,
                        'showBgSectors': `Show background sectors`,
                        'showMapBorders': `Show map borders`,
                        'showGhostCells': 'Ghost cells',
                        'showMiniMap': `Show minimap`,
                        'showMiniMapGrid': `Show minimap grid`,
                        'showMiniMapGuides': `Show minimap guides`,
                        'showMiniMapGhostCells': `Show ghost cells`,
                        'oneColoredTeammates': 'One-colored teammates',
                        'optimizedFood': `Optimized food`,
                        'rainbowFood': 'Rainbow food',
                        'oppColors': `Opponents colors`,
                        'oppRings': 'Opponents rings',
                        'virColors': `Viruses colors`,
                        'splitRange': 'Split range',
                        'virusesRange': `Viruses range`,
                        'textStroke': `Names and mass stroke`,
                        'namesStroke': `Names stroke`,
                        'massStroke': `Mass stroke`,
                        'cursorTracking': `Cursor tracking`,
                        'teammatesInd': `Teammates indicators`,
                        'mouseSplit': `LMB - Mouse split`,
                        'mouseFeed': `RMB - Mouse feed`,
                        'mouseInvert': `Invert mouse buttons`,
                        'disableChat': 'Disable chat',
                        'hideChat': `Hide chat`,
                        'chatSounds': `Sound notifications`,
                        'chatEmoticons': `Emoticons`,
                        'showChatImages': `Show images on chat`,
                        'showChatVideos': `Show videos on chat`,
                        'showChatBox': `Chatbox instead of popups`,
                        'messageSound': `Message notification sound`,
                        'commandSound': `Command notification sound`,
                        'showTop5': `Show team top 5`,
                        'showTargeting': `Show targeting`,
                        'showTime': `Show current time`,
                        'showLbData': `Show leaderboard mass`,
                        'normalLb': `\"Leaderboard\" header`,
                        'centeredLb': `Centered leaderboard`,
                        'fpsAtTop': `Game stats at the top`,
                        'showStats': `Show game stats`,
                        'showStatsMass': `Game stats: Mass`,
                        'showStatsSTE': `Game stats: STE`,
                        'showStatsN16': `Game stats: n/16`,
                        'showStatsFPS': `Game stats: FPS`,
                        'blockPopups': `Block popups (ads/shop/quest)`,
                        'hotkeys': `Hotkeys`,
                        'hk-inst-assign': 'To assign a hotkey click on the input field and press your chosen key.',
                        'hk-inst-delete': 'To delete a hotkey click on the input field and press the DELETE key.',
                        'hk-inst-keys': 'Possible key combinations with the CTRL and ALT keys.',
                        'hk-feed': `Feed`,
                        'hk-macroFeed': 'Macro feed',
                        'hk-split': 'Split',
                        'hk-doubleSplit': 'Double split',
                        'hk-split16': `Split 16`,
                        'hk-pause': `Cell pause`,
                        'hk-showTop5': `Show/hide team top 5`,
                        'hk-showTime': 'Show/hide current time',
                        'hk-showSplitRange': `Show/hide split range`,
                        'hk-showSplitInd': `Show/hide split indicators`,
                        'hk-showTeammatesInd': `Show/hide teammates indicators`,
                        'hk-showOppColors': `Show/hide opponents colors`,
                        'hk-toggleSkins': `Toggle skins (custom/default)`,
                        'hk-showSkins': `Show/hide skins`,
                        'hk-transparentSkins': `Toggle transparent skins`,
                        'hk-showStats': `Show/hide game stats`,
                        'hk-toggleCells': `Toggle own cells (smallest/biggest)`,
                        'hk-showFood': `Show/hide food`,
                        'hk-showGrid': 'Show/hide grid',
                        'hk-showMiniMapGuides': `Show/hide minimap guides`,
                        'hk-hideChat': `Show/hide chat`,
                        'hk-showHUD': `Show/hide HUD`,
                        'hk-copyLb': `Copy leaderboard`,
                        'hk-showLb': 'Show/hide leaderboard',
                        'hk-toggleAutoZoom': `Toggle auto zoom`,
                        'hk-resetZoom': `Reset zoom`,
                        'hk-zoomLevel': `Zoom level`,
                        'hk-toggleDeath': `Toggle death location`,
                        'hk-clearChat': 'Show chat history / Clear chat',
                        'hk-showBgSectors': `Show/hide background sectors`,
                        'hk-hideBots': `Show/hide small bots`,
                        'hk-showNames': `Show/hide names`,
                        'hk-hideTeammatesNames': `Show/hide teammates names`,
                        'hk-showMass': `Show/hide mass`,
                        'hk-showMiniMap': `Show/hide minimap`,
                        'hk-chatMessage': `Enter chat message`,
                        'hk-quickResp': `Quick respawn`,
                        'hk-autoResp': `Toggle auto respawn`,
                        'hk-switchServerMode': `Switch server [public/private]`,
                        'hk-showTargeting': 'Show/hide targeting panel',
                        'hk-setTargeting': 'Start/stop targeting (following)',
                        'hk-cancelTargeting': 'Cancel targeting',
                        'hk-changeTarget': `Change target`,
                        'hk-privateMiniMap': `Show target on the minimap`,
                        'hk-showQuest': `Show/hide quest`,
                        'commands': `Commands`,
                        'comm1': 'Feed me!',
                        'comm2': `Split into me!`,
                        'comm3': `Need backup at %currentSector%!`,
                        'comm4': `Enemy spotted at %currentSector%!`,
                        'comm5': `Need a teammate!`,
                        'comm6': `Tank the virus!`,
                        'comm7': `Eat the virus!`,
                        'comm8': `Let\'s bait!`,
                        'comm9': 'Fake tricksplit!',
                        'comm0': `Fuck!`,
                        'comm10': `Tricksplit!`,
                        'comm11': `Left!`,
                        'comm12': `Up!`,
                        'comm13': `Right!`,
                        'comm14': `Bottom!`,
                        'saveComm': `Save commands`,
                        'theme': `Theme`,
                        'restoreThemeSettings': 'Restore theme default settings',
                        'basicTheming': `Basic theming`,
                        'themePreset': `Theme preset`,
                        'themeType': `Theme type`,
                        'darkTheme': `Dark theme`,
                        'lightTheme': `Light theme`,
                        'mainColor': `Main color`,
                        'bgColor': 'Background',
                        'bordersColor': 'Map borders',
                        'gridColor': `Grid`,
                        'sectorsColor': `Sectors font`,
                        'namesColor': 'Names',
                        'namesStrokeColor': `Names stroke`,
                        'massColor': `Mass`,
                        'massStrokeColor': `Mass stroke`,
                        'virusColor': `Virus`,
                        'virusStrokeColor': `Virus stroke`,
                        'mVirusColor': 'Mothercell',
                        'mVirusStrokeColor': 'Mothercell stroke',
                        'foodColor': `Food`,
                        'namesFont': 'Names font',
                        'massFont': `Mass font`,
                        'sectorsFont': `Sectors font`,
                        'namesScale': `Names scale`,
                        'massScale': 'Mass scale',
                        'virMassScale': `Virus mass scale`,
                        'strokeScale': `Text stroke scale`,
                        'foodSize': `Food size`,
                        'bordersWidth': `Map borders width`,
                        'sectorsWidth': `Sectors grid width`,
                        'sectorsFontSize': `Sectors font size`,
                        'cellsAlpha': `Cells transparency`,
                        'skinsAlpha': `Skins transparency`,
                        'virusAlpha': `Virus transparency`,
                        'textAlpha': `Names & mass transparency`,
                        'virusStrokeSize': `Virus stroke size`,
                        'teammatesIndColor': `Teammate indicator`,
                        'cursorTrackingColor': `Cursor tracking`,
                        'splitRangeColor': `Split range`,
                        'safeAreaColor': `Safe area`,
                        'dangerAreaColor': `Danger area`,
                        'ghostCellsColor': `Ghost cells`,
                        'ghostCellsAlpha': `Ghost cells transparency`,
                        'menuTheming': 'Menu',
                        'menuPreset': `Menu theme`,
                        'menuMainColor': 'Main color',
                        'menuBtnTextColor': 'Button text',
                        'menuPanelColor': `Panel`,
                        'menuPanelColor2': `Panel (2)`,
                        'menuTextColor': `Panel text`,
                        'menuTextColor2': `Panel text (2)`,
                        'btn1Color': `Button #1`,
                        'btn1Color2': `Button #1 (2)`,
                        'btn2Color': `Button #2`,
                        'btn2Color2': `Button #2 (2)`,
                        'btn3Color': 'Button #3',
                        'btn3Color2': `Button #3 (2)`,
                        'btn4Color': `Button #4`,
                        'btn4Color2': `Button #4 (2)`,
                        'menuBg': `Panel background image`,
                        'menuOpacity': 'Transparency',
                        'hudTheming': 'HUD',
                        'hudMainColor': `Main color`,
                        'hudColor': `Background`,
                        'hudTextColor': `Text`,
                        'statsHudColor': 'Stats',
                        'timeHudColor': `Time`,
                        'top5MassColor': 'Mass',
                        'lbMeColor': `Leaderboard - me`,
                        'lbTeammateColor': `Leaderboard - teammate`,
                        'hudFont': `HUD font`,
                        'hudScale': `HUD scale`,
                        'chatTheming': `Chat`,
                        'messageColor': `Message background`,
                        'messageTextColor': `Message text`,
                        'messageTimeColor': `Message time`,
                        'messageNickColor': `Message nick`,
                        'commandsColor': `Command background`,
                        'commandsTextColor': 'Command text',
                        'commandsTimeColor': `Command time`,
                        'commandsNickColor': `Command nick`,
                        'chatBoxColor': 'Chatbox color',
                        'chatScale': `Chat scale`,
                        'miniMapTheming': 'Minimap',
                        'miniMapSectorsColor': `Sectors`,
                        'miniMapSectorColor': 'Current sector',
                        'miniMapGuidesColor': `Guides`,
                        'miniMapNickColor': `Nick`,
                        'miniMapNickStrokeColor': `Nick stroke`,
                        'miniMapMyCellColor': `My cell`,
                        'miniMapMyCellStrokeColor': `My cell stroke`,
                        'miniMapTeammatesColor': `Teammates`,
                        'miniMapDeathLocationColor': 'Death location',
                        'miniMapFont': `Minimap font`,
                        'miniMapNickFont': `Nick font`,
                        'miniMapWidth': `Minimap width`,
                        'miniMapSectorsOpacity': `Sectors transparency`,
                        'miniMapNickSize': `Nick size`,
                        'miniMapNickStrokeSize': `Nick stroke size`,
                        'miniMapMyCellSize': `My cell size`,
                        'miniMapMyCellStrokeSize': `My cell stroke size`,
                        'miniMapTeammatesSize': 'Teammates size',
                        'miniMapGhostCellsColor': 'Ghost cells',
                        'miniMapGhostCellsAlpha': `Ghost cells transparency`,
                        'imagesTheming': `Graphics / cursors`,
                        'customBackground': `Custom background image`,
                        'customCursor': `Custom cursor image`,
                        'hideChatMsgA': `Chat is visible!`,
                        'hideChatMsgB': `Chat is hidden!`,
                        'showSkinsMsgA': 'Skins are visible!',
                        'showSkinsMsgB': `Skins are hidden!`,
                        'hideSmallBotsMsgA': `Small bots are visible!`,
                        'hideSmallBotsMsgB': `Small bots are hidden!`,
                        'autoRespMsgA': `Auto respawn is on!`,
                        'autoRespMsgB': `Auto respawn is off!`,
                        'autoZoomMsgA': `Auto zoom is on!`,
                        'autoZoomMsgB': 'Auto zoom is off!',
                        'targetNotSet': `Target not set`,
                        'targetDead': `Dead`,
                        'targetDistance': `Distance`,
                        'targetMass': `Mass altogether`,
                        'totalPartyPlayers': `Active players`,
                        'totalPartyMass': `Total mass`,
                        'exportImport': `Export / import settings`,
                        'exportSettings': `Export settings`,
                        'exportInfo': 'To export selected settings copy the code below and save it to a text file encoded in Unicode.',
                        'importSettings': 'Import settings',
                        'importInfo': 'To import selected settings paste an exported code below and press the \"Import settings\" button.',
                        'profile': `Profile`,
                        'profiles': `Profiles`,
                        'skins': `Skins`,
                        'moreSkins': `Add skins`,
                        'thanks': 'Thanks to Awesome!',
                        'saveSett': `Save settings`,
                        'saved': `Saved!`,
                        'resetSett': 'Reset to default',
                        'close': `Close`,
                        'enterChatMsg': `Enter chat message`,
                        'activeParties': `Active parties`,
                        'noActiveParties': `No active parties ;(`,
                        'playlist': `Playlist`,
                        'pause': 'PAUSE!',
                        'visit': `Visit`,
                        'exit': `Legend mod Express: Are you sure you want to quit the game?`,
                        'blockWarn': `WARNING! Popups are blocked in the settings.`,
                        'unblockPopups': 'Temporary unblock',
                        'mass': `Mass`,
                        'score': `Score`,
                        'leaderboard': `Leaderboard`,
                        'user': `User`,
                        'userMuted': `User %user% has been muted.`,
                        'userUnmuted': `User %user% has been unmuted.`,
                        'mute': `Mute`,
                        'unmute': `Unmute`,
                        'mutedUsers': `Muted users`,
                        'activeUsers': `Active users`,
                        'showActiveUsers': 'Show active users',
                        'none': `None`,
                        'sounds': `Sounds`,
                        'page_menu_main_free_coins': 'Free Coins',
                        'page_menu_main_gifts': `Gifts`,
                        'page_menu_main_dailyquests': `Daily Quest`,
                        'page_shop': `Shop`
                    }
                },
                ogarlanguage = 'en',
                ogaractuallanguage = more2ogarset[`navigator`][`language`] || more2ogarset['navigator'][`userLanguage`];
            ogaractuallanguage && ogarbuffed[`hasOwnProperty`](ogaractuallanguage) && (ogarlanguage = ogaractuallanguage);
            var ogarcomms = ogarbuffed[ogarlanguage],
                ogario1Commands = {
                    'comm1': ogarcomms[`comm1`],
                    'comm2': ogarcomms[`comm2`],
                    'comm3': ogarcomms[`comm3`],
                    'comm4': ogarcomms[`comm4`],
                    'comm5': ogarcomms[`comm5`],
                    'comm6': ogarcomms[`comm6`],
                    'comm7': ogarcomms['comm7'],
                    'comm8': ogarcomms[`comm8`],
                    'comm9': ogarcomms[`comm9`],
                    'comm0': ogarcomms['comm0'],
                    'comm10': ogarcomms[`comm10`],
                    'comm11': ogarcomms[`comm11`],
                    'comm12': ogarcomms[`comm12`],
                    'comm13': ogarcomms['comm13'],
                    'comm14': ogarcomms[`comm14`]
                },
                ogarparsedchars = {
                    '&': `&amp;`,
                    '<': `&lt;`,
                    '>': `&gt;`,
                    '"': `&quot;`,
                    '\'': '&#39;',
                    '/': '&#x2F;'
                },
                ogarparsedemoticons = {
                    ':)': 'smile.svg',
                    ';)': `wink.svg`,
                    '=)': `smirk.svg`,
                    ':D': 'grin.svg',
                    'X-D': 'xgrin.svg',
                    '=D': `joy.svg`,
                    ':(': `sad.svg`,
                    ';(': `cry.svg`,
                    ':P': `tongue.svg`,
                    ';P': `tonguew.svg`,
                    ':*': `kiss.svg`,
                    '$)': `smileh.svg`,
                    '<3': 'heart.svg',
                    '8=)': `cool.svg`,
                    ':o': `astonished.svg`,
                    '(:|': `sweat.svg`,
                    ':|': `neutral.svg`,
                    ':\\': `unamused.svg`,
                    ':@': 'pouting.svg',
                    '|-)': `sleep.svg`,
                    '^_^': `relaxed.svg`,
                    '-_-': `expressionless.svg`,
                    '$_$': `money.svg`,
                    'O:)': 'angel.svg',
                    '3:)': `devil.svg`,
                    '(poop)': 'poo.svg',
                    '(fuck)': `finger.svg`,
                    '(clap)': `clap.svg`,
                    '(ok)': `ok.svg`,
                    '(victory)': `victory.svg`,
                    '(y)': `thumb.svg`,
                    '(n)': `thumbd.svg`
                },
                ogarsets1 = {
                    'ogario-v3': {
                        'name': `OGARio v3`,
                        'darkTheme': !0,
                        'mainColor': `#01d9cc`,
                        'bgColor': `#000a11`,
                        'bordersColor': `#01d9cc`,
                        'gridColor': `#00243e`,
                        'sectorsColor': `#00243e`,
                        'namesColor': '#ffffff',
                        'namesStrokeColor': `#000000`,
                        'massColor': '#ffffff',
                        'massStrokeColor': `#000000`,
                        'virusColor': '#002f52',
                        'virusStrokeColor': `#00b9e8`,
                        'mVirusColor': '#ce6363',
                        'mVirusStrokeColor': '#b95959',
                        'foodColor': `#5000ff`,
                        'teammatesIndColor': `#ffffff`,
                        'cursorTrackingColor': `#ffffff`,
                        'splitRangeColor': `#ffffff`,
                        'safeAreaColor': `#ffffff`,
                        'dangerAreaColor': '#bf00aa',
                        'namesFont': `ubuntu-bold`,
                        'massFont': `ubuntu-bold`,
                        'sectorsFont': 'ubuntu',
                        'namesScale': 1,
                        'massScale': 3,
                        'foodSize': 5,
                        'bordersWidth': 40,
                        'sectorsWidth': 40,
                        'sectorsFontSize': 1200,
                        'cellsAlpha': 0.9,
                        'skinsAlpha': 0.7,
                        'virusAlpha': 0.6,
                        'textAlpha': 1,
                        'virusStrokeSize': 14,
                        'menuPreset': `ogario-v3`,
                        'menuMainColor': `#01d9cc`,
                        'menuBtnTextColor': `#ffffff`,
                        'menuPanelColor': '#00243e',
                        'menuPanelColor2': `#002f52`,
                        'menuTextColor': `#ffffff`,
                        'menuTextColor2': `#8096a7`,
                        'btn1Color': `#018cf6`,
                        'btn1Color2': `#0176ce`,
                        'btn2Color': `#00b9e8`,
                        'btn2Color2': `#0099c0`,
                        'btn3Color': `#8d5fe6`,
                        'btn3Color2': `#814ee3`,
                        'btn4Color': `#bf00aa`,
                        'btn4Color2': `#a80096`,
                        'menuBg': 'https://cdn.ogario.ovh/static/img/pattern.png',
                        'menuOpacity': 0.96,
                        'hudMainColor': `#01d9cc`,
                        'hudColor': `rgba(0,0,0,0.4)`,
                        'hudTextColor': `#ffffff`,
                        'statsHudColor': `#ffffff`,
                        'timeHudColor': `#01d9cc`,
                        'top5MassColor': `#bf00aa`,
                        'lbMeColor': `#bf00aa`,
                        'lbTeammateColor': `#018cf6`,
                        'hudFont': `ubuntu-bold`,
                        'hudScale': 1,
                        'messageColor': `rgba(0,0,0,0.4)`,
                        'messageTextColor': `#ffffff`,
                        'messageTimeColor': `#018cf6`,
                        'messageNickColor': `#01d9cc`,
                        'commandsColor': 'rgba(191,0,170,0.9)',
                        'commandsTextColor': `#ffffff`,
                        'commandsTimeColor': `#bf00aa`,
                        'commandsNickColor': `#ffffff`,
                        'chatBoxColor': `rgba(0,0,0,0.4)`,
                        'chatScale': 1,
                        'miniMapSectorsColor': `#ffffff`,
                        'miniMapSectorColor': '#01d9cc',
                        'miniMapGuidesColor': `#bf00aa`,
                        'miniMapNickColor': '#ffffff',
                        'miniMapNickStrokeColor': '#000000',
                        'miniMapMyCellColor': '#ffffff',
                        'miniMapMyCellStrokeColor': '#bf00aa',
                        'miniMapTeammatesColor': '#01d9cc',
                        'miniMapDeathLocationColor': '#bf00aa',
                        'miniMapFont': `ubuntu-bold`,
                        'miniMapNickFont': `ubuntu-bold`,
                        'miniMapWidth': 240,
                        'miniMapSectorsOpacity': 0.1,
                        'miniMapNickSize': 11,
                        'miniMapNickStrokeSize': 2,
                        'miniMapMyCellSize': 7.5,
                        'miniMapMyCellStrokeSize': 4,
                        'miniMapTeammatesSize': 5.5,
                        'customBackground': '',
                        'customCursor': `https://cdn.ogario.ovh/static/img/cursors/cursor_02.cur`
                    },
                    'ogario-orange': {
                        'name': `OGARio v2`,
                        'darkTheme': !0,
                        'mainColor': `#ff7800`,
                        'bgColor': '#111111',
                        'bordersColor': `#ff7800`,
                        'gridColor': `#292929`,
                        'sectorsColor': `#292929`,
                        'namesColor': `#ffffff`,
                        'namesStrokeColor': `#000000`,
                        'massColor': `#ffffff`,
                        'massStrokeColor': `#000000`,
                        'virusColor': '#666666',
                        'virusStrokeColor': `#666666`,
                        'mVirusColor': '#ce6363',
                        'mVirusStrokeColor': '#b95959',
                        'foodColor': `#e16400`,
                        'hudMainColor': `#ff7800`,
                        'statsHudColor': `#ff7800`,
                        'top5MassColor': `#ff7800`,
                        'timeHudColor': `#ff7800`,
                        'messageNickColor': `#ff7800`,
                        'commandsColor': `rgba(255,120,0,0.9)`,
                        'commandsTimeColor': `#ff7800`,
                        'commandsTextColor': `#ffffff`,
                        'miniMapSectorsColor': `#ffffff`,
                        'miniMapSectorColor': `#ff7800`,
                        'miniMapGuidesColor': '#ff7800',
                        'miniMapMyCellColor': `#ffffff`,
                        'miniMapMyCellStrokeColor': `#ff7800`,
                        'miniMapTeammatesColor': '#ff7800',
                        'miniMapDeathLocationColor': `#ff7800`,
                        'miniMapSectorsOpacity': 0.1
                    },
                    'ogario-gold': {
                        'name': `OGARio LE`,
                        'darkTheme': !0,
                        'mainColor': `#b5a642`,
                        'bgColor': `#000000`,
                        'bordersColor': `#b5a642`,
                        'gridColor': `#111111`,
                        'sectorsColor': '#111111',
                        'namesColor': `#ffffff`,
                        'namesStrokeColor': `#000000`,
                        'massColor': '#ffffff',
                        'massStrokeColor': '#000000',
                        'virusColor': `#666666`,
                        'virusStrokeColor': `#666666`,
                        'mVirusColor': '#ce6363',
                        'mVirusStrokeColor': '#b95959',
                        'foodColor': `#998c36`,
                        'hudMainColor': `#b5a642`,
                        'statsHudColor': '#b5a642',
                        'top5MassColor': `#b5a642`,
                        'timeHudColor': `#b5a642`,
                        'messageNickColor': '#b5a642',
                        'commandsColor': `rgba(181,166,66,0.9)`,
                        'commandsTimeColor': `#b5a642`,
                        'commandsTextColor': `#ffffff`,
                        'miniMapSectorsColor': `#ffffff`,
                        'miniMapSectorColor': '#b5a642',
                        'miniMapGuidesColor': `#b5a642`,
                        'miniMapMyCellColor': `#ffffff`,
                        'miniMapMyCellStrokeColor': '#b5a642',
                        'miniMapTeammatesColor': `#b5a642`,
                        'miniMapDeathLocationColor': `#b5a642`,
                        'miniMapSectorsOpacity': 0.1
                    },
                    'sniikz-style': {
                        'name': `SniiKz\'s Style`,
                        'darkTheme': !0,
                        'mainColor': `#01d9cc`,
                        'bgColor': '#000000',
                        'bordersColor': '#ffffff',
                        'gridColor': `#00243e`,
                        'sectorsColor': `#00243e`,
                        'namesColor': `#ffffff`,
                        'namesStrokeColor': `#000000`,
                        'massColor': `#ffffff`,
                        'massStrokeColor': `#000000`,
                        'virusColor': '#3b3b3b',
                        'virusStrokeColor': `#ffffff`,
                        'mVirusColor': '#ce6363',
                        'mVirusStrokeColor': '#b95959',
                        'foodColor': `#5000ff`,
                        'teammatesIndColor': '#ffffff',
                        'cursorTrackingColor': `#ffffff`,
                        'splitRangeColor': `#ffffff`,
                        'safeAreaColor': `#ffffff`,
                        'dangerAreaColor': `#bf00aa`,
                        'massScale': 4,
                        'foodSize': 1,
                        'bordersWidth': 40,
                        'sectorsWidth': 40,
                        'sectorsFontSize': 1200,
                        'cellsAlpha': 0.99,
                        'skinsAlpha': 0.7,
                        'virusAlpha': 0.4,
                        'virusStrokeSize': 10,
                        'menuPreset': 'ogario-v3',
                        'menuMainColor': `#fc0079`,
                        'menuBtnTextColor': '#ffffff',
                        'menuPanelColor': `#050008`,
                        'menuPanelColor2': `#1d0526`,
                        'menuTextColor': `#ffffff`,
                        'menuTextColor2': '#65458f',
                        'btn1Color': `#4f0242`,
                        'btn1Color2': '#3b0431',
                        'btn2Color': '#6b0036',
                        'btn2Color2': `#4d0227`,
                        'btn3Color': `#aa084e`,
                        'btn3Color2': '#80063b',
                        'btn4Color': `#aa084e`,
                        'btn4Color2': `#8a063f`,
                        'menuBg': `https://cdn.ogario.ovh/static/img/pattern.png`,
                        'menuOpacity': 1,
                        'hudMainColor': '#5974ff',
                        'hudColor': `rgba(36,36,36,0.49)`,
                        'hudTextColor': `#ffffff`,
                        'statsHudColor': `#ffffff`,
                        'timeHudColor': `#737373`,
                        'top5MassColor': `#1fe000`,
                        'lbMeColor': `#bf00aa`,
                        'lbTeammateColor': `#018cf6`,
                        'hudScale': 1.15,
                        'messageColor': `rgba(0,0,0,0.4)`,
                        'messageTextColor': `#e8e8e8`,
                        'messageTimeColor': `#545454`,
                        'messageNickColor': `#05ff00`,
                        'commandsColor': `rgba(36,36,36,0.9)`,
                        'commandsTextColor': `#ffffff`,
                        'commandsTimeColor': `#545454`,
                        'commandsNickColor': `#ffffff`,
                        'chatBoxColor': 'rgba(0,0,0,0.4)',
                        'chatScale': 1,
                        'miniMapSectorsColor': '#ffffff',
                        'miniMapSectorColor': `#000000`,
                        'miniMapGuidesColor': '#ff00a8',
                        'miniMapNickColor': `#ffffff`,
                        'miniMapNickStrokeColor': `#4d4d4d`,
                        'miniMapMyCellColor': `#f0ff3d`,
                        'miniMapMyCellStrokeColor': `#acba07`,
                        'miniMapTeammatesColor': `#305eff`,
                        'miniMapDeathLocationColor': `#2b2b2b`,
                        'miniMapWidth': 250,
                        'miniMapSectorsOpacity': 0.1,
                        'miniMapNickSize': 9,
                        'miniMapNickStrokeSize': 0,
                        'miniMapMyCellSize': 5,
                        'miniMapMyCellStrokeSize': 0,
                        'miniMapTeammatesSize': 5,
                        'customBackground': '',
                        'customCursor': 'https://cdn.ogario.ovh/static/img/cursors/cursor_01.cur'
                    },
                    'hkg-style': {
                        'name': 'HKG Style',
                        'darkTheme': !0,
                        'mainColor': `#651fff`,
                        'bgColor': `#000000`,
                        'bordersColor': `#ffffff`,
                        'gridColor': `#111111`,
                        'sectorsColor': '#111111',
                        'namesColor': `#ffffff`,
                        'namesStrokeColor': '#000000',
                        'massColor': `#ffffff`,
                        'massStrokeColor': `#000000`,
                        'virusColor': `#666666`,
                        'virusStrokeColor': `#666666`,
                        'mVirusColor': '#ce6363',
                        'mVirusStrokeColor': '#b95959',
                        'foodColor': `#651fff`,
                        'hudMainColor': `#651fff`,
                        'statsHudColor': `#651fff`,
                        'top5MassColor': `#651fff`,
                        'timeHudColor': `#651fff`,
                        'messageNickColor': `#651fff`,
                        'commandsColor': 'rgba(101,31,255,0.9)',
                        'commandsTimeColor': `#651fff`,
                        'commandsTextColor': `#ffffff`,
                        'miniMapSectorsColor': `#ffffff`,
                        'miniMapSectorColor': '#651fff',
                        'miniMapGuidesColor': `#651fff`,
                        'miniMapMyCellColor': `#ffffff`,
                        'miniMapMyCellStrokeColor': `#651fff`,
                        'miniMapTeammatesColor': `#651fff`,
                        'miniMapDeathLocationColor': '#651fff',
                        'miniMapSectorsOpacity': 0.1
                    },
                    'agario-light': {
                        'name': 'Agar.io Light',
                        'darkTheme': !1,
                        'mainColor': `#ffffff`,
                        'bgColor': `#f2fbff`,
                        'bordersColor': `#858a8c`,
                        'gridColor': `#ced6d9`,
                        'sectorsColor': `#ced6d9`,
                        'namesColor': `#ffffff`,
                        'namesStrokeColor': `#000000`,
                        'massColor': `#ffffff`,
                        'massStrokeColor': `#000000`,
                        'virusColor': `#33ff33`,
                        'virusStrokeColor': '#2de52d',
                        'mVirusColor': '#ce6363',
                        'mVirusStrokeColor': '#b95959',
                        'foodColor': `#2de52d`,
                        'hudMainColor': '#ffffff',
                        'statsHudColor': `#ffffff`,
                        'top5MassColor': `#ffffff`,
                        'timeHudColor': `#ffffff`,
                        'messageNickColor': `#ffffff`,
                        'commandsColor': `rgba(255,255,255,0.9)`,
                        'commandsTimeColor': '#ffffff',
                        'commandsTextColor': '#000000',
                        'miniMapSectorsColor': '#ffffff',
                        'miniMapSectorColor': `#ffffff`,
                        'miniMapGuidesColor': `#ffffff`,
                        'miniMapMyCellColor': `#ffffff`,
                        'miniMapMyCellStrokeColor': `#ffffff`,
                        'miniMapTeammatesColor': `#ffffff`,
                        'miniMapDeathLocationColor': `#ffffff`,
                        'miniMapSectorsOpacity': 0.25
                    },
                    'agario-dark': {
                        'name': `Agar.io Dark`,
                        'darkTheme': !0,
                        'mainColor': '#ffffff',
                        'bgColor': `#111111`,
                        'bordersColor': `#999999`,
                        'gridColor': `#333333`,
                        'sectorsColor': `#333333`,
                        'namesColor': `#ffffff`,
                        'namesStrokeColor': `#000000`,
                        'massColor': '#ffffff',
                        'massStrokeColor': '#000000',
                        'virusColor': `#33ff33`,
                        'virusStrokeColor': `#2de52d`,
                        'mVirusColor': '#ce6363',
                        'mVirusStrokeColor': '#b95959',
                        'foodColor': '#2de52d',
                        'hudMainColor': `#ffffff`,
                        'statsHudColor': `#ffffff`,
                        'top5MassColor': `#ffffff`,
                        'timeHudColor': `#ffffff`,
                        'messageNickColor': `#ffffff`,
                        'commandsColor': 'rgba(255,255,255,0.9)',
                        'commandsTimeColor': `#ffffff`,
                        'commandsTextColor': '#ffffff',
                        'miniMapSectorsColor': `#ffffff`,
                        'miniMapSectorColor': `#ffffff`,
                        'miniMapGuidesColor': `#ffffff`,
                        'miniMapMyCellColor': '#ffffff',
                        'miniMapMyCellStrokeColor': '#ffffff',
                        'miniMapTeammatesColor': `#ffffff`,
                        'miniMapDeathLocationColor': `#ffffff`,
                        'miniMapSectorsOpacity': 0.1
                    }
                },
                moremenusets = {
                    'ogario-v3': {
                        'name': `OGARio v3`,
                        'menuMainColor': `#01d9cc`,
                        'menuBtnTextColor': `#ffffff`,
                        'menuPanelColor': `#00243e`,
                        'menuPanelColor2': '#002f52',
                        'menuTextColor': `#ffffff`,
                        'menuTextColor2': '#8096a7',
                        'btn1Color': '#018cf6',
                        'btn1Color2': `#0176ce`,
                        'btn2Color': '#00b9e8',
                        'btn2Color2': `#0099c0`,
                        'btn3Color': '#8d5fe6',
                        'btn3Color2': '#814ee3',
                        'btn4Color': `#f300d8`,
                        'btn4Color2': `#df00c6`,
                        'menuBg': `https://cdn.ogario.ovh/static/img/pattern.png`
                    },
                    'ogario-v2': {
                        'name': 'OGARio v2',
                        'menuMainColor': `#ff7800`,
                        'menuBtnTextColor': `#ffffff`,
                        'menuPanelColor': `#222222`,
                        'menuPanelColor2': `#333333`,
                        'menuTextColor': '#bbbbbb',
                        'menuTextColor2': `#bbbbbb`,
                        'btn1Color': `#428bca`,
                        'btn1Color2': '#3071a9',
                        'btn2Color': `#5cb85c`,
                        'btn2Color2': `#449d44`,
                        'btn3Color': `#f0ad4e`,
                        'btn3Color2': `#ec971f`,
                        'btn4Color': `#d9534f`,
                        'btn4Color2': `#c9302c`,
                        'menuBg': ''
                    },
                    'agario': {
                        'name': `Agar.io`,
                        'menuMainColor': `#5bc0de`,
                        'menuBtnTextColor': '#ffffff',
                        'menuPanelColor': `#ffffff`,
                        'menuPanelColor2': `#cccccc`,
                        'menuTextColor': `#333333`,
                        'menuTextColor2': `#999999`,
                        'btn1Color': `#428bca`,
                        'btn1Color2': `#3071a9`,
                        'btn2Color': `#5cb85c`,
                        'btn2Color2': `#449d44`,
                        'btn3Color': `#f0ad4e`,
                        'btn3Color2': `#ec971f`,
                        'btn4Color': `#d9534f`,
                        'btn4Color2': `#c9302c`,
                        'menuBg': ''
                    }
                },
                ogario1ThemeSettings = {
                    'preset': `ogario-v3`,
                    'darkTheme': !0,
                    'mainColor': `#01d9cc`,
                    'bgColor': `#000a11`,
                    'bordersColor': `#01d9cc`,
                    'gridColor': `#00243e`,
                    'sectorsColor': `#00243e`,
                    'namesColor': `#ffffff`,
                    'namesStrokeColor': `#000000`,
                    'massColor': `#ffffff`,
                    'massStrokeColor': `#000000`,
                    'virusColor': `#002f52`,
                    'virusStrokeColor': '#00b9e8',
                    'mVirusColor': '#ce6363',
                    'mVirusStrokeColor': '#b95959',
                    'foodColor': '#5000ff',
                    'teammatesIndColor': `#ffffff`,
                    'cursorTrackingColor': `#ffffff`,
                    'splitRangeColor': `#ffffff`,
                    'ghostCellsColor': `#ffffff`,
                    'safeAreaColor': '#ffffff',
                    'dangerAreaColor': `#bf00aa`,
                    'namesFont': `ubuntu-bold`,
                    'namesFontFamily': `Ubuntu`,
                    'namesFontWeight': 700,
                    'massFont': `ubuntu-bold`,
                    'massFontFamily': `Ubuntu`,
                    'massFontWeight': 700,
                    'sectorsFont': `ubuntu`,
                    'sectorsFontFamily': `Ubuntu`,
                    'sectorsFontWeight': 400,
                    'sectorsX': 5,
                    'sectorsY': 5,
                    'namesScale': 1,
                    'massScale': 3,
                    'virMassScale': 3,
                    'strokeScale': 1,
                    'foodSize': 5,
                    'bordersWidth': 40,
                    'sectorsWidth': 40,
                    'sectorsFontSize': 1200,
                    'cellsAlpha': 0.9,
                    'skinsAlpha': 0.7,
                    'virusAlpha': 0.6,
                    'textAlpha': 1,
                    'ghostCellsAlpha': 0.3,
                    'virusStrokeSize': 14,
                    'menuPreset': `ogario-v3`,
                    'menuMainColor': `#01d9cc`,
                    'menuBtnTextColor': '#ffffff',
                    'menuPanelColor': '#00243e',
                    'menuPanelColor2': `#002f52`,
                    'menuTextColor': `#ffffff`,
                    'menuTextColor2': `#8096a7`,
                    'btn1Color': `#018cf6`,
                    'btn1Color2': `#0176ce`,
                    'btn2Color': '#00b9e8',
                    'btn2Color2': `#0099c0`,
                    'btn3Color': '#8d5fe6',
                    'btn3Color2': `#814ee3`,
                    'btn4Color': '#bf00aa',
                    'btn4Color2': `#a80096`,
                    'menuBg': `https://cdn.ogario.ovh/static/img/pattern.png`,
                    'menuOpacity': 0.96,
                    'hudMainColor': `#01d9cc`,
                    'hudColor': `rgba(0,0,0,0.4)`,
                    'hudTextColor': '#ffffff',
                    'statsHudColor': `#ffffff`,
                    'timeHudColor': `#01d9cc`,
                    'top5MassColor': '#bf00aa',
                    'lbMeColor': `#bf00aa`,
                    'lbTeammateColor': `#018cf6`,
                    'hudFont': `ubuntu-bold`,
                    'hudFontFamily': 'Ubuntu',
                    'hudFontWeight': 700,
                    'hudScale': 1,
                    'messageColor': 'rgba(0,0,0,0.4)',
                    'messageTextColor': `#ffffff`,
                    'messageTimeColor': `#018cf6`,
                    'messageNickColor': `#01d9cc`,
                    'commandsColor': `rgba(191,0,170,0.9)`,
                    'commandsTextColor': `#ffffff`,
                    'commandsTimeColor': `#bf00aa`,
                    'commandsNickColor': `#ffffff`,
                    'chatBoxColor': 'rgba(0,0,0,0.4)',
                    'chatScale': 1,
                    'miniMapSectorsColor': `#ffffff`,
                    'miniMapSectorColor': '#01d9cc',
                    'miniMapGuidesColor': `#bf00aa`,
                    'miniMapNickColor': `#ffffff`,
                    'miniMapNickStrokeColor': `#000000`,
                    'miniMapMyCellColor': '#ffffff',
                    'miniMapMyCellStrokeColor': `#bf00aa`,
                    'miniMapTeammatesColor': `#01d9cc`,
                    'miniMapDeathLocationColor': `#bf00aa`,
                    'miniMapGhostCellsColor': '#ffffff',
                    'miniMapFont': `ubuntu-bold`,
                    'miniMapFontFamily': `Ubuntu`,
                    'miniMapFontWeight': 700,
                    'miniMapNickFont': `ubuntu-bold`,
                    'miniMapNickFontFamily': 'Ubuntu',
                    'miniMapNickFontWeight': 700,
                    'miniMapWidth': 240,
                    'miniMapTop': 24,
                    'miniMapSectorsOpacity': 0.1,
                    'miniMapNickSize': 11,
                    'miniMapNickStrokeSize': 2,
                    'miniMapMyCellSize': 7.5,
                    'miniMapMyCellStrokeSize': 4,
                    'miniMapTeammatesSize': 5.5,
                    'miniMapGhostCellsAlpha': 0.15,
                    'customBackground': '',
                    'customCursor': 'https://cdn.ogario.ovh/static/img/cursors/cursor_02.cur'
                },
                csssettings = {
                    'menuMainColorCSS': null,
                    'menuPanelColorCSS': null,
                    'menuTextlColorCSS': null,
                    'menuButtonsCSS': null,
                    'hudCSS': null,
                    'chatCSS': null,
                    'chatScaleCSS': null,
                    'cursorCSS': null,
                    'loadThemeSettings': function() {
                        var ogarsettings = null;
                        for (var moreogarset in null !== more2ogarset[`localStorage`][`getItem`](`ogarioThemeSettings`) && (ogarsettings = JSON[`parse`](more2ogarset[`localStorage`][`getItem`](`ogarioThemeSettings`))), ogario1ThemeSettings) ogario1ThemeSettings[`hasOwnProperty`](moreogarset) && (ogarsettings && ogarsettings[`hasOwnProperty`](moreogarset) && (ogario1ThemeSettings[moreogarset] = ogarsettings[moreogarset]), ogarcanvas[`hasOwnProperty`](moreogarset) && (ogarcanvas[moreogarset] = ogario1ThemeSettings[moreogarset]));
                    },
                    'saveThemeSettings': function() {
                        more2ogarset[`localStorage`][`setItem`](`ogarioThemeSettings`, JSON[`stringify`](ogario1ThemeSettings));
                    },
                    'restoreThemeSettings': function() {
                        null !== more2ogarset['localStorage'][`getItem`](`ogarioThemeSettings`) && (more2ogarset[`localStorage`][`removeItem`](`ogarioThemeSettings`), more2ogarset[`location`][`reload`]());
                    },
                    'addCustomCSS': function(ogarsettings, more2ogarset) {
                        this[ogarsettings] || (this[ogarsettings] = moreogarset(`<style type=\'text/css\'>`)[`appendTo`](`head`)), this[ogarsettings]['html'](more2ogarset);
                    },
                    'addPresetBox': function(ogarsettings, more2ogarset, ogarcanvas, more3ogarset, more4ogarset) {
                        for (var ogarbuffed in moreogarset(ogarsettings)['append'](`<div class=\"preset-box\"><span class=\"title-box\">` + ogarcomms[more2ogarset] + '</span><div class=\"select-wrapper\"><select id=\"' + more2ogarset + `\" class=\"form-control\"></select></div></div>`), ogarcanvas) ogarcanvas[`hasOwnProperty`](ogarbuffed) && moreogarset('#' + more2ogarset)[`append`](`<option value=\"` + ogarbuffed + '\">' + ogarcanvas[ogarbuffed][`name`] + `</option>`);
                        moreogarset('#' + more2ogarset)[`val`](ogario1ThemeSettings[more3ogarset]);
                        var ogarlanguage = this;
                        moreogarset('#' + more2ogarset)['on'](`change`, function() {
                            var ogarsettings = this[`value`];
                            ogario1ThemeSettings[more3ogarset] = ogarsettings, ogarlanguage[more4ogarset](ogarsettings);
                        });
                    },
                    'addColorBox': function(ogarsettings, more2ogarset, more3ogarset) {
                        if (moreogarset(ogarsettings)[`append`](`<div class=\"color-box\"><span class=\"title-box\">` + ogarcomms[more2ogarset] + '</span><div class=\"input-group ' + more2ogarset + `-picker\"><input type=\"text\" value=\"` + ogario1ThemeSettings[more2ogarset] + `\" id=\"` + more2ogarset + `\" class=\"form-control\" /><span class=\"input-group-addon\"><i></i></span></div></div>`), more3ogarset) {
                            var more4ogarset = this;
                            moreogarset(ogarsettings + ' .' + more2ogarset + `-picker`)['colorpicker']({
                                'format': `hex`
                            })['on'](`changeColor.colorpicker`, function(ogarsettings) {
                                ogario1ThemeSettings[more2ogarset] = ogarsettings[`color`][`toHex`](), ogarcanvas[`hasOwnProperty`](more2ogarset) && (ogarcanvas[more2ogarset] = ogario1ThemeSettings[more2ogarset]), more4ogarset[more3ogarset]();
                            });
                        } else moreogarset(ogarsettings + ' .' + more2ogarset + '-picker')[`colorpicker`]({
                            'format': `hex`
                        })['on'](`changeColor.colorpicker`, function(ogarsettings) {
                            ogario1ThemeSettings[more2ogarset] = ogarsettings[`color`]['toHex'](), ogarcanvas[`hasOwnProperty`](more2ogarset) && (ogarcanvas[more2ogarset] = ogario1ThemeSettings[more2ogarset]);
                        });
                    },
                    'addRgbaColorBox': function(ogarsettings, more2ogarset, more3ogarset) {
                        if (moreogarset(ogarsettings)['append'](`<div class=\"color-box\"><span class=\"title-box\">` + ogarcomms[more2ogarset] + `</span><div class=\"input-group ` + more2ogarset + `-picker\"><input type=\"text\" value=\"` + ogario1ThemeSettings[more2ogarset] + `\" id=\"` + more2ogarset + '\" class=\"form-control\" /><span class=\"input-group-addon\"><i></i></span></div></div>'), more3ogarset) {
                            var more4ogarset = this;
                            moreogarset(ogarsettings + ' .' + more2ogarset + `-picker`)[`colorpicker`]({
                                'format': `rgba`
                            })['on'](`changeColor.colorpicker`, function(ogarsettings) {
                                var moreogarset = ogarsettings[`color`][`toRGB`]();
                                ogario1ThemeSettings[more2ogarset] = 'rgba(' + moreogarset['r'] + ',' + moreogarset['g'] + ',' + moreogarset['b'] + ',' + moreogarset['a'] + ')', ogarcanvas[`hasOwnProperty`](more2ogarset) && (ogarcanvas[more2ogarset] = ogario1ThemeSettings[more2ogarset]), more4ogarset[more3ogarset]();
                            });
                        } else moreogarset(ogarsettings + ' .' + more2ogarset + `-picker`)[`colorpicker`]({
                            'format': 'rgba'
                        })['on'](`changeColor.colorpicker`, function(ogarsettings) {
                            var moreogarset = ogarsettings[`color`][`toRGB`]();
                            ogario1ThemeSettings[more2ogarset] = `rgba(` + moreogarset['r'] + ',' + moreogarset['g'] + ',' + moreogarset['b'] + ',' + moreogarset['a'] + ')', ogarcanvas[`hasOwnProperty`](more2ogarset) && (ogarcanvas[more2ogarset] = ogario1ThemeSettings[more2ogarset]);
                        });
                    },
                    'addSliderBox': function(ogarsettings, more2ogarset, more3ogarset, more4ogarset, ogarbuffed, ogarlanguage) {
                        if (moreogarset(ogarsettings)[`append`](`<div class=\"slider-box\"><div class=\"box-label\"><span class=\"value-label\">` + ogarcomms[more2ogarset] + `: </span><span id=\"` + more2ogarset + '-value\" class=\"value\">' + ogario1ThemeSettings[more2ogarset] + `</span></div><input id=\"` + more2ogarset + '-slider\" type=\"range\" min=\"' + more3ogarset + `\" max=\"` + more4ogarset + `\" step=\"` + ogarbuffed + `\" value=\"` + ogario1ThemeSettings[more2ogarset] + `\"></div>`), ogarlanguage) {
                            var ogaractuallanguage = this;
                            moreogarset('#' + more2ogarset + `-slider`)['on'](`input`, function() {
                                var ogarsettings = parseFloat(moreogarset(this)[`val`]());
                                moreogarset('#' + more2ogarset + '-value')[`text`](ogarsettings), ogario1ThemeSettings[more2ogarset] = ogarsettings, ogarcanvas[`hasOwnProperty`](more2ogarset) && (ogarcanvas[more2ogarset] = ogarsettings), ogaractuallanguage[ogarlanguage]();
                            });
                        } else moreogarset('#' + more2ogarset + `-slider`)['on'](`input`, function() {
                            var ogarsettings = parseFloat(moreogarset(this)['val']());
                            moreogarset('#' + more2ogarset + '-value')[`text`](ogarsettings), ogario1ThemeSettings[more2ogarset] = ogarsettings, ogarcanvas[`hasOwnProperty`](more2ogarset) && (ogarcanvas[more2ogarset] = ogarsettings);
                        });
                    },
                    'addInputBox': function(ogarsettings, more2ogarset, ogarcanvas, more3ogarset) {
                        moreogarset(ogarsettings)[`append`](`<div class=\"input-box\"><span class=\"title-box\">` + ogarcomms[more2ogarset] + '</span><input id=\"' + more2ogarset + `\" class=\"form-control\" placeholder=\"` + ogarcanvas + '\" value=\"' + ogario1ThemeSettings[more2ogarset] + '\" /></div>');
                        var more4ogarset = this;
                        moreogarset('#' + more2ogarset)['on'](`input`, function() {
                            ogario1ThemeSettings[more2ogarset] = this[`value`], more4ogarset[more3ogarset]();
                        });
                    },
                    'addCursorBox': function(ogarsettings, more2ogarset) {
                        more2ogarset === ogario1ThemeSettings[`customCursor`] ? moreogarset(ogarsettings)['append'](`<div class=\"cursor-box\"><a href=\"#\" class=\"active\"><img src=\"` + more2ogarset + `\"></a></div>`) : moreogarset(ogarsettings)[`append`](`<div class=\"cursor-box\"><a href=\"#\"><img src=\"` + more2ogarset + '\"></a></div>');
                    },
                    'setFont': function(ogarsettings, more2ogarset) {
                        ogario1ThemeSettings[ogarsettings] = more2ogarset, ogario1ThemeSettings[ogarsettings + `Family`] = this[`setFontFamily`](more2ogarset), ogario1ThemeSettings[ogarsettings + 'Weight'] = this[`setFontWeight`](more2ogarset), ogarcanvas['hasOwnProperty'](ogarsettings + `Family`) && (ogarcanvas[ogarsettings + `Family`] = ogario1ThemeSettings[ogarsettings + `Family`]), ogarcanvas[`hasOwnProperty`](ogarsettings + `Weight`) && (ogarcanvas[ogarsettings + 'Weight'] = ogario1ThemeSettings[ogarsettings + `Weight`]);
                    },
                    'addFontBox': function(ogarsettings, more2ogarset, ogarcanvas) {
                        moreogarset(ogarsettings)[`append`]('<div class=\"font-box\"><span class=\"title-box\">' + ogarcomms[more2ogarset] + `</span><div class=\"select-wrapper\"><select id=\"` + more2ogarset + `\" class=\"form-control\"></select></div></div>`), moreogarset('#' + more2ogarset)[`append`](`<option value=\"ubuntu\">Ubuntu</option><option value=\"ubuntu-bold\">Ubuntu Bold</option>`), moreogarset('#' + more2ogarset)[`append`](`<option value=\"roboto\">Roboto</option><option value=\"roboto-bold\">Roboto Bold</option>`), moreogarset('#' + more2ogarset)[`append`](`<option value=\"oswald\">Oswald</option><option value=\"oswald-bold\">Oswald Bold</option>`), moreogarset('#' + more2ogarset)[`val`](ogario1ThemeSettings[more2ogarset]);
                        var more3ogarset = this;
                        ogarcanvas ? moreogarset('#' + more2ogarset)['on'](`change`, function() {
                            var ogarsettings = this[`value`];
                            more3ogarset[`setFont`](more2ogarset, ogarsettings), more3ogarset[ogarcanvas]();
                        }) : moreogarset('#' + more2ogarset)['on'](`change`, function() {
                            var ogarsettings = this['value'];
                            more3ogarset[`setFont`](more2ogarset, ogarsettings);
                        });
                    },
                    'setFontFamily': function(ogarsettings) {
                        return -1 != ogarsettings[`indexOf`](`roboto`) ? `Roboto` : -1 != ogarsettings[`indexOf`](`oswald`) ? `Oswald` : 'Ubuntu';
                    },
                    'setFontWeight': function(ogarsettings) {
                        return -1 != ogarsettings[`indexOf`]('bold') ? 700 : 400;
                    },
                    'setThemeMenu': function() {
                        var ogarsettings = this;
                        moreogarset(`#theme`)[`append`](`<ul class=\"submenu-tabs\"><li class=\"theme-main-tab active\"><a href=\"#theme-main\" class=\"active ogicon-paint-format\" data-toggle=\"tab-tooltip\" title=\"` + ogarcomms[`basicTheming`] + `\"></a></li><li class=\"theme-menu-tab\"><a href=\"#theme-menu\" class=\"ogicon-menu\" data-toggle=\"tab-tooltip\" title=\"` + ogarcomms[`menuTheming`] + `\"></a></li><li class=\"theme-hud-tab\"><a href=\"#theme-hud\" class=\"ogicon-display\" data-toggle=\"tab-tooltip\" title=\"` + ogarcomms[`hudTheming`] + `\"></a></li><li class=\"theme-chat-tab\"><a href=\"#theme-chat\" class=\"ogicon-bubbles\" data-toggle=\"tab-tooltip\" title=\"` + ogarcomms[`chatTheming`] + '\"></a></li><li class=\"theme-minimap-tab\"><a href=\"#theme-minimap\" class=\"ogicon-location2\" data-toggle=\"tab-tooltip\" title=\"' + ogarcomms[`miniMapTheming`] + `\"></a></li><li class=\"theme-images-tab\"><a href=\"#theme-images\" class=\"ogicon-compass\" data-toggle=\"tab-tooltip\" title=\"` + ogarcomms[`imagesTheming`] + '\"></a></li></ul><div id=\"theme-main\" class=\"submenu-panel\"></div><div id=\"theme-menu\" class=\"submenu-panel\"></div><div id=\"theme-hud\" class=\"submenu-panel\"></div><div id=\"theme-chat\" class=\"submenu-panel\"></div><div id=\"theme-minimap\" class=\"submenu-panel\"></div><div id=\"theme-images\" class=\"submenu-panel\"></div>'), this[`addPresetBox`](`#theme-main`, `themePreset`, ogarsets1, `preset`, `changeThemePreset`), this[`addColorBox`](`#theme-main`, `bgColor`, `setBgColor`), this[`addColorBox`](`#theme-main`, `bordersColor`), this[`addColorBox`](`#theme-main`, `gridColor`), this[`addColorBox`]('#theme-main', `sectorsColor`), this[`addColorBox`](`#theme-main`, `namesColor`), this[`addColorBox`](`#theme-main`, `namesStrokeColor`), this[`addColorBox`]('#theme-main', `massColor`), this[`addColorBox`](`#theme-main`, `massStrokeColor`), this[`addColorBox`](`#theme-main`, `virusColor`), this[`addColorBox`](`#theme-main`, `virusStrokeColor`), this.addColorBox('#theme-main', 'mVirusColor'), this.addColorBox('#theme-main', 'mVirusStrokeColor'), this[`addColorBox`](`#theme-main`, `foodColor`, `setFoodColor`), this['addColorBox'](`#theme-main`, 'teammatesIndColor', `setIndicatorColor`), this[`addColorBox`]('#theme-main', `cursorTrackingColor`), this['addColorBox']('#theme-main', `splitRangeColor`), this[`addColorBox`](`#theme-main`, `safeAreaColor`), this[`addColorBox`](`#theme-main`, `dangerAreaColor`), this['addColorBox'](`#theme-main`, `ghostCellsColor`), this[`addFontBox`](`#theme-main`, `namesFont`), this[`addFontBox`](`#theme-main`, 'massFont'), this[`addFontBox`]('#theme-main', `sectorsFont`), this['addSliderBox'](`#theme-main`, `sectorsFontSize`, 200, 2000, 10), this[`addSliderBox`](`#theme-main`, `namesScale`, 0.5, 2, 0.1), this[`addSliderBox`]('#theme-main', `massScale`, 1, 5, 1), this[`addSliderBox`](`#theme-main`, `virMassScale`, 1, 5, 1), this[`addSliderBox`](`#theme-main`, `strokeScale`, 1, 4, 0.1), this[`addSliderBox`](`#theme-main`, `foodSize`, 1, 50, 1, 'setFoodColor'), this[`addSliderBox`](`#theme-main`, `virusStrokeSize`, 2, 40, 1), this['addSliderBox'](`#theme-main`, `bordersWidth`, 2, 200, 2), this[`addSliderBox`](`#theme-main`, `sectorsWidth`, 2, 200, 2), this[`addSliderBox`](`#theme-main`, 'cellsAlpha', 0.01, 0.99, 0.01), this[`addSliderBox`](`#theme-main`, `skinsAlpha`, 0.01, 0.99, 0.01), this[`addSliderBox`](`#theme-main`, 'virusAlpha', 0, 1, 0.01), this[`addSliderBox`](`#theme-main`, `textAlpha`, 0.1, 1, 0.01), this[`addSliderBox`](`#theme-main`, `ghostCellsAlpha`, 0.01, 0.99, 0.01), this[`addPresetBox`](`#theme-menu`, `menuPreset`, moremenusets, `menuPreset`, 'changeMenuPreset'), this[`addSliderBox`](`#theme-menu`, `menuOpacity`, 0.1, 1, 0.01, 'setMenuOpacity'), this[`addColorBox`](`#theme-menu`, `menuMainColor`, 'setMenuMainColor'), this[`addColorBox`]('#theme-menu', 'menuBtnTextColor', 'setMenuButtons'), this[`addColorBox`](`#theme-menu`, `menuPanelColor`, `setMenuPanelColor`), this[`addColorBox`](`#theme-menu`, 'menuPanelColor2', `setMenuPanelColor`), this['addColorBox']('#theme-menu', `menuTextColor`, `setMenuTextColor`), this[`addColorBox`](`#theme-menu`, `menuTextColor2`, `setMenuTextColor`), this[`addColorBox`](`#theme-menu`, 'btn1Color', `setMenuButtons`), this[`addColorBox`](`#theme-menu`, `btn1Color2`, `setMenuButtons`), this[`addColorBox`](`#theme-menu`, `btn2Color`, `setMenuButtons`), this[`addColorBox`](`#theme-menu`, 'btn2Color2', `setMenuButtons`), this[`addColorBox`](`#theme-menu`, `btn3Color`, `setMenuButtons`), this[`addColorBox`]('#theme-menu', `btn3Color2`, `setMenuButtons`), this[`addColorBox`](`#theme-menu`, 'btn4Color', `setMenuButtons`), this[`addColorBox`](`#theme-menu`, `btn4Color2`, `setMenuButtons`), this[`addInputBox`](`#theme-menu`, `menuBg`, `Image URL`, `setMenuBg`), this[`addColorBox`]('#theme-hud', `hudMainColor`, `setHudColors`), this[`addRgbaColorBox`](`#theme-hud`, `hudColor`, 'setHudColors'), this['addColorBox'](`#theme-hud`, `hudTextColor`, `setHudColors`), this[`addColorBox`](`#theme-hud`, `statsHudColor`, 'setHudColors'), this['addColorBox'](`#theme-hud`, `timeHudColor`, `setHudColors`), this[`addColorBox`](`#theme-hud`, `top5MassColor`, `setHudColors`), this[`addColorBox`](`#theme-hud`, 'lbMeColor', `setHudColors`), this[`addColorBox`](`#theme-hud`, `lbTeammateColor`, 'setHudColors'), this[`addFontBox`](`#theme-hud`, `hudFont`, 'setHudFont'), this['addSliderBox']('#theme-hud', `hudScale`, 1, 2, 0.01, `setHudScale`), this[`addRgbaColorBox`](`#theme-chat`, `messageColor`, 'setChatColors'), this[`addColorBox`](`#theme-chat`, `messageTextColor`, `setChatColors`), this[`addColorBox`](`#theme-chat`, `messageTimeColor`, `setChatColors`), this[`addColorBox`](`#theme-chat`, `messageNickColor`, `setChatColors`), this[`addRgbaColorBox`](`#theme-chat`, `commandsColor`, `setChatColors`), this['addColorBox']('#theme-chat', `commandsTextColor`, `setChatColors`), this[`addColorBox`]('#theme-chat', 'commandsTimeColor', `setChatColors`), this[`addColorBox`](`#theme-chat`, `commandsNickColor`, `setChatColors`), this[`addRgbaColorBox`](`#theme-chat`, 'chatBoxColor', 'setChatColors'), this[`addSliderBox`]('#theme-chat', `chatScale`, 1, 2, 0.01, `setChatScale`), this[`addColorBox`](`#theme-minimap`, `miniMapSectorsColor`, 'setMiniMapSectorsColor'), this[`addColorBox`](`#theme-minimap`, `miniMapSectorColor`), this[`addColorBox`](`#theme-minimap`, `miniMapNickColor`), this['addColorBox'](`#theme-minimap`, `miniMapNickStrokeColor`), this[`addColorBox`](`#theme-minimap`, `miniMapMyCellColor`), this['addColorBox']('#theme-minimap', `miniMapMyCellStrokeColor`), this[`addColorBox`]('#theme-minimap', 'miniMapTeammatesColor'), this[`addColorBox`](`#theme-minimap`, `miniMapDeathLocationColor`), this[`addColorBox`](`#theme-minimap`, `miniMapGuidesColor`), this[`addColorBox`](`#theme-minimap`, `miniMapGhostCellsColor`), this[`addFontBox`](`#theme-minimap`, `miniMapFont`, `setMiniMapFont`), this['addFontBox']('#theme-minimap', `miniMapNickFont`), this[`addSliderBox`](`#theme-minimap`, `miniMapWidth`, 200, 400, 2, `setMiniMapWidth`), this['addSliderBox']('#theme-minimap', 'miniMapSectorsOpacity', 0, 1, 0.01, `setMiniMapSectorsOpacity`), this['addSliderBox']('#theme-minimap', `miniMapNickSize`, 8, 16, 1), this[`addSliderBox`](`#theme-minimap`, `miniMapNickStrokeSize`, 0, 6, 1), this[`addSliderBox`](`#theme-minimap`, `miniMapMyCellSize`, 4, 10, 0.5), this[`addSliderBox`](`#theme-minimap`, `miniMapMyCellStrokeSize`, 0, 10, 1), this[`addSliderBox`](`#theme-minimap`, `miniMapTeammatesSize`, 4, 10, 0.5), this['addSliderBox'](`#theme-minimap`, `miniMapGhostCellsAlpha`, 0.01, 0.99, 0.01), this[`addInputBox`](`#theme-images`, `customBackground`, `Image URL`, `setCustomBackground`), this[`addInputBox`]('#theme-images', `customCursor`, 'Cursor image URL', 'setCustomCursor');
                        for (var more2ogarset = `https://cdn.ogario.ovh/static/img/cursors/cursor_`, ogarcanvas = 0; ogarcanvas < 35; ogarcanvas++) ogarcanvas < 9 ? this[`addCursorBox`](`#theme-images`, more2ogarset + '0' + (ogarcanvas + 1) + `.cur`) : this['addCursorBox'](`#theme-images`, more2ogarset + '' + (ogarcanvas + 1) + `.cur`);
                        moreogarset(document)['on'](`click`, `#theme-images .cursor-box a`, function(more2ogarset) {
                            more2ogarset[`preventDefault`]();
                            var ogarcanvas = moreogarset(`img`, this)['attr'](`src`);
                            ogario1ThemeSettings[`customCursor`] = ogarcanvas, ogarsettings[`setCustomCursor`](), moreogarset(`#customCursor`)[`val`](ogarcanvas), moreogarset(`#theme-images .cursor-box a`)['removeClass']('active'), moreogarset(this)[`addClass`](`active`);
                        }), moreogarset(`#theme`)[`append`]('<button class=\"btn btn-block btn-success btn-save\"\">' + ogarcomms[`saveSett`] + `</button>`), moreogarset(document)['on'](`click`, `#theme .btn-save`, function(more2ogarset) {
                            more2ogarset[`preventDefault`]();
                            var ogarcanvas = moreogarset(this);
                            ogarcanvas[`text`](ogarcomms[`saved`]), ogarsettings['saveThemeSettings'](), setTimeout(function() {
                                ogarcanvas[`text`](ogarcomms['saveSett']);
                            }, 500);
                        }), moreogarset(`#theme`)['append'](`<div class=\"restore-settings\"><a href=\"#\">` + ogarcomms[`restoreThemeSettings`] + '</a></div>'), moreogarset(document)['on']('click', `#theme .restore-settings a`, function(more2ogarset) {
                            more2ogarset[`preventDefault`](), ogarsettings[`restoreThemeSettings`]();
                        }), moreogarset(`.skin`)[`colorpicker`]({
                            'format': `hex`,
                            'input': `#color`
                        });
                    },
                    'changePreset': function(ogarsettings, more2ogarset) {
                        if (more2ogarset[ogarsettings]) {
                            ogario1ThemeSettings[ogarsettings] = ogarsettings;
                            ogarsettings = more2ogarset[ogarsettings];
                            for (var more3ogarset in ogarsettings) ogarsettings[`hasOwnProperty`](more3ogarset) && ogario1ThemeSettings[`hasOwnProperty`](more3ogarset) && (ogario1ThemeSettings[more3ogarset] = ogarsettings[more3ogarset], ogarcanvas[`hasOwnProperty`](more3ogarset) && (ogarcanvas[more3ogarset] = ogario1ThemeSettings[more3ogarset]), moreogarset(`#theme .` + more3ogarset + `-picker`) && moreogarset('#theme .' + more3ogarset + `-picker`)[`colorpicker`]('setValue', ogario1ThemeSettings[more3ogarset]), moreogarset('#' + more3ogarset + '-slider') && moreogarset('#' + more3ogarset + `-slider`)[`val`](ogario1ThemeSettings[more3ogarset])[`change`](), (moreogarset(`input[type=text]#` + more3ogarset) || moreogarset(`select#` + more3ogarset)) && moreogarset('#' + more3ogarset)[`val`](ogario1ThemeSettings[more3ogarset]));
                        }
                    },
                    'changeThemePreset': function(ogarsettings) {
                        this[`changePreset`](ogarsettings, ogarsets1), this[`setTheme`]();
                    },
                    'setFonts': function() {
                        this[`setFont`]('namesFont', ogario1ThemeSettings[`namesFont`]), this[`setFont`](`massFont`, ogario1ThemeSettings[`namesFont`]), this[`setFont`](`sectorsFont`, ogario1ThemeSettings[`sectorsFont`]);
                    },
                    'setBgColor': function() {
                        moreogarset(`body`)[`css`](`background-color`, ogario1ThemeSettings[`bgColor`]);
                    },
                    'setFoodColor': function() {
                        ogario1Settings['optimizedFood'] && ogarfooddrawer && ogarfooddrawer[`preDrawPellet`]();
                    },
                    'setIndicatorColor': function() {
                        ogarfooddrawer && ogarfooddrawer[`preDrawIndicator`]();
                    },
                    'setCustomBackground': function() {
                        ogario1ThemeSettings['customBackground'] ? moreogarset(`body`)[`css`](`background-image`, `url(` + ogario1ThemeSettings[`customBackground`] + ')') : moreogarset(`body`)['css'](`background-image`, `none`);
                    },
                    'setCustomCursor': function() {
                        if (ogario1ThemeSettings[`customCursor`]) var ogarsettings = `*{cursor:url(` + ogario1ThemeSettings[`customCursor`] + `), auto !important}`;
                        else ogarsettings = `*{cursor: auto}`;
                        this[`addCustomCSS`](`cursorCSS`, ogarsettings);
                    },
                    'setMenu': function() {
                        this[`setMenuOpacity`](), this[`setMenuMainColor`](), this['setMenuPanelColor'](), this[`setMenuTextColor`](), this[`setMenuButtons`](), this[`setMenuBg`]();
                    },
                    'changeMenuPreset': function(ogarsettings) {
                        this[`changePreset`](ogarsettings, moremenusets), this['setMenu']();
                    },
                    'setMenuOpacity': function() {
                        moreogarset('#helloContainer, #hotkeys, #exp-imp')['css'](`opacity`, ogario1ThemeSettings[`menuOpacity`]);
                    },
                    'setMenuMainColor': function() {
                        var ogarsettings = '::-moz-selection{background-color:' + ogario1ThemeSettings['menuMainColor'] + `!important}::selection{background-color:` + ogario1ThemeSettings[`menuMainColor`] + `!important}.menu-main-color,#quick-menu a:hover,.quick,.quick:focus,.menu-tabs a:hover,.menu-tabs .active,.submenu-tabs a:hover,.submenu-tabs .active,#stats center,#exp-imp h1{color:` + ogario1ThemeSettings[`menuMainColor`] + `}#exp-bar .progress-bar-striped,.quick:hover,.rangeslider__fill{background-color:` + ogario1ThemeSettings['menuMainColor'] + '}#main-menu,.agario-side-panel,#hotkeys,#exp-imp{border-color:' + ogario1ThemeSettings['menuMainColor'] + `}.ps-scrollbar-y{background-color:` + ogario1ThemeSettings[`menuMainColor`] + `!important}`;
                        this[`addCustomCSS`]('menuMainColorCSS', ogarsettings);
                    },
                    'setMenuPanelColor': function() {
                        var ogarsettings = `#main-menu,.agario-side-panel,#hotkeys,#exp-imp{background-color: ` + ogario1ThemeSettings['menuPanelColor'] + '}label:hover,.agario-panel input,.agario-panel select,.agario-side-panel input,.agario-side-panel select,.input-group-addon,.nick .input-group-btn,.skin .input-group-btn,#stream-mode,#hide-url,.menu-tabs a:hover,.menu-tabs .active,.submenu-tabs,#exp-bar .progress,#quick-menu a:hover,.quick,.select-wrapper,#hotkeys-cfg div.row:hover,#hotkeys-cfg .command-in,#exp-imp-settings textarea,.restore-settings{background-color: ' + ogario1ThemeSettings[`menuPanelColor2`] + `}.agario-panel h5,.agario-side-panel h5,#stats h2,.menu-tabs,.submenu-tabs,#skins a.default,#stats hr,#hotkeys-cfg div.row, #exp-imp h1{border-color: ` + ogario1ThemeSettings[`menuPanelColor2`] + `}.quick:hover,#skins a,#profiles{color:` + ogario1ThemeSettings['menuPanelColor2'] + '}input.stream-mode,input.hide-url{color:' + ogario1ThemeSettings['menuPanelColor2'] + `!important}`;
                        this[`addCustomCSS`](`menuPanelColorCSS`, ogarsettings);
                    },
                    'setMenuTextColor': function() {
                        var ogarsettings = `.agario-panel,.agario-side-panel,.agario-panel input,.agario-panel select,.agario-side-panel input,.agario-side-panel select,.input-group-addon,.dark .yt-username,#stream-mode,#hide-url,.menu-tabs a,.submenu-tabs a,#skins a.default:hover,#quick-menu a,#prev-profile.default:hover,#next-profile.default:hover,#statsText,#hotkeys,#hotkeys-cfg .command-in,#exp-imp{color:` + ogario1ThemeSettings[`menuTextColor`] + `}#skins a.default:hover{border-color:` + ogario1ThemeSettings[`menuTextColor`] + `}::-webkit-input-placeholder{color:` + ogario1ThemeSettings[`menuTextColor2`] + `!important}::-moz-placeholder{color:` + ogario1ThemeSettings[`menuTextColor2`] + '!important}#user-id-tag, #version-tag,#statsSubtext,#hotkeys-inst,#exp-imp textarea,.restore-settings a,.restore-settings a:hover{color:' + ogario1ThemeSettings[`menuTextColor2`] + `}#hotkeys-cfg .command-in,#theme .color-box{border-color:` + ogario1ThemeSettings[`menuTextColor2`] + '}';
                        this[`addCustomCSS`]('menuTextColorCSS', ogarsettings);
                    },
                    'setMenuButtons': function() {
                        var ogarsettings = `a,a:hover{color:` + ogario1ThemeSettings[`btn1Color`] + `}.btn,#hotkeys-cfg .custom-key-in{color:` + ogario1ThemeSettings[`menuBtnTextColor`] + `}.btn-primary{background-color:` + ogario1ThemeSettings[`btn1Color`] + `!important}.btn-primary:active,.btn-primary:disabled,.btn-primary:focus,.btn-primary:hover{background-color:` + ogario1ThemeSettings['btn1Color2'] + `!important}.btn-success{background-color:` + ogario1ThemeSettings[`btn2Color`] + `!important}.btn-success:active,.btn-success:disabled,.btn-success:focus,.btn-success:hover{background-color:` + ogario1ThemeSettings[`btn2Color2`] + '!important}.btn-warning{background-color:' + ogario1ThemeSettings[`btn3Color`] + `!important}.btn-warning:active,.btn-warning:disabled,.btn-warning:focus,.btn-warning:hover{background-color:` + ogario1ThemeSettings[`btn3Color2`] + `!important}.btn-danger{background-color:` + ogario1ThemeSettings[`btn4Color`] + `!important}.btn-danger:active,.btn-danger:disabled,.btn-danger:focus,.btn-danger:hover{background-color:` + ogario1ThemeSettings[`btn4Color2`] + `!important}#hotkeys-cfg .custom-key-in{background-color:` + ogario1ThemeSettings['btn4Color2'] + `;border-color:` + ogario1ThemeSettings[`btn4Color2`] + '}';
                        this[`addCustomCSS`](`menuButtonsCSS`, ogarsettings);
                    },
                    'setMenuBg': function() {
                        moreogarset(`#menuBg`)[`val`](ogario1ThemeSettings[`menuBg`]), ogario1ThemeSettings['menuBg'] ? moreogarset(`.menu-panel, .agario-side-panel, #hotkeys, #exp-imp`)[`css`](`background-image`, 'url(' + ogario1ThemeSettings[`menuBg`] + ')') : moreogarset(`.menu-panel, .agario-side-panel, #hotkeys, #exp-imp`)[`css`](`background-image`, `none`);
                    },
                    'setHud': function() {
                        this[`setHudColors`](), this[`setHudFont`](), this[`setHudScale`]();
                    },
                    'setHudColors': function() {
                        var ogarsettings = `.hud-main-color,#top5-hud a,#target-panel-hud a:hover,#target-panel-hud a.active,#message-menu a{color:` + ogario1ThemeSettings[`hudMainColor`] + '}.hud,.hud-b,#chat-emoticons{background-color:' + ogario1ThemeSettings[`hudColor`] + '}.hud,.hud-b,#top5-hud a:hover,#target-panel-hud a{color:' + ogario1ThemeSettings[`hudTextColor`] + `}.stats-hud-color{color:` + ogario1ThemeSettings[`statsHudColor`] + `}.time-hud-color{color:` + ogario1ThemeSettings[`timeHudColor`] + `}.top5-mass-color{color:` + ogario1ThemeSettings[`top5MassColor`] + `}#leaderboard-positions .me{color:` + ogario1ThemeSettings[`lbMeColor`] + `}#leaderboard-positions .teammate{color:` + ogario1ThemeSettings[`lbTeammateColor`] + '}';
                        this[`addCustomCSS`](`hudCSS`, ogarsettings);
                    },
                    'setHudFont': function() {
                        this[`setFont`](`hudFont`, ogario1ThemeSettings[`hudFont`]), moreogarset(`#overlays-hud`)[`css`]({
                            'font-family': ogario1ThemeSettings[`hudFontFamily`],
                            'font-weight': ogario1ThemeSettings[`hudFontWeight`]
                        });
                    },
                    'setHudScale': function() {
                        var ogarsettings = Math['round'](20 * ogario1ThemeSettings[`hudScale`]),
                            more2ogarset = Math[`round`](200 * ogario1ThemeSettings['hudScale']),
                            ogarcanvas = Math[`floor`](55 * ogario1ThemeSettings[`hudScale`]),
                            more3ogarset = Math['floor'](6 * ogario1ThemeSettings[`hudScale`]),
                            more4ogarset = Math[`floor`](280 * ogario1ThemeSettings[`hudScale`]),
                            ogarbuffed = Math['floor'](85 * ogario1ThemeSettings[`hudScale`]),
                            ogarlanguage = Math['floor'](20 * ogario1ThemeSettings[`hudScale`]);
                        moreogarset(`#overlays-hud`)['css'](`font-size`, ogarsettings + 'px'), moreogarset('#leaderboard-hud, #time-hud')['width'](more2ogarset), moreogarset(`#top5-hud`)[`width`](more2ogarset + 30)[`css`](`top`, ogarcanvas + 'px'), moreogarset(`#top5-pos`)[`css`](`padding-left`, more3ogarset + 'px'), moreogarset(`#time-hud`)[`css`](`top`, more4ogarset + 'px'), moreogarset(`#pause-hud`)['css']('top', ogarbuffed + 'px'), moreogarset(`#target-hud`)[`css`](`padding-top`, ogarlanguage + 'px');
                    },
                    'setChat': function() {
                        this[`setChatColors`](), this[`setChatScale`]();
                    },
                    'setChatColors': function() {
                        var ogarsettings = `#message,#messages li,.toast-success{background-color:` + ogario1ThemeSettings[`messageColor`] + `}#message,.message-text,.toast-success .message-text{color:` + ogario1ThemeSettings[`messageTextColor`] + `}.message-nick,.mute-user,.mute-user:hover,.toast-success .message-nick,.toast .mute-user,.toast .mute-user:hover{color:` + ogario1ThemeSettings[`messageNickColor`] + `}.message-time{color:` + ogario1ThemeSettings[`messageTimeColor`] + '}.toast-warning{background-color:' + ogario1ThemeSettings[`commandsColor`] + `}.command-text,.toast-warning .command-text{color:` + ogario1ThemeSettings[`commandsTextColor`] + '}.command-nick,.toast-warning .command-nick,.toast-warning .mute-user,.toast-warning .mute-user:hover{color:' + ogario1ThemeSettings[`commandsNickColor`] + `}.command-time{color:` + ogario1ThemeSettings[`commandsTimeColor`] + `}#chat-box{background-color:` + ogario1ThemeSettings[`chatBoxColor`] + '}';
                        this[`addCustomCSS`](`chatCSS`, ogarsettings);
                    },
                    'setChatScale': function() {
                        var ogarsettings = Math['round'](14 * ogario1ThemeSettings[`chatScale`]),
                            more2ogarset = Math[`round`](280 * ogario1ThemeSettings['chatScale']),
                            ogarcanvas = Math[`round`](350 * ogario1ThemeSettings['chatScale']),
                            more3ogarset = Math['round'](300 * ogario1ThemeSettings[`chatScale`]),
                            more4ogarset = Math[`floor`](14 * ogario1ThemeSettings[`chatScale`]);
                        moreogarset(`#message-box, #messages, #toast-container, #chat-box`)['css'](`font-size`, ogarsettings + 'px'), moreogarset(`#messages, #toast-container, #chat-box`)[`width`](more2ogarset), moreogarset(`#message-box`)['width'](ogarcanvas), moreogarset('#chat-box')[`height`](more3ogarset), moreogarset('.user-list')[`css`](`padding-left`, more4ogarset + 'px');
                        var ogarbuffed = `#toast-container{width:` + more2ogarset + `px;font-size:` + ogarsettings + `px}`;
                        this[`addCustomCSS`](`chatScaleCSS`, ogarbuffed);
                    },
                    'setMiniMap': function() {
                        this[`setMiniMapFont`](), this[`setMiniMapWidth`](), this[`setMiniMapSectorsOpacity`]();
                    },
                    'setMiniMapFont': function() {
                        this[`setFont`]('miniMapFont', ogario1ThemeSettings['miniMapFont']), ogarminimapdrawer && ogarminimapdrawer['resetMiniMapSectors']();
                    },
                    'setMiniMapWidth': function() {
                        var ogarsettings = ogario1ThemeSettings[`miniMapWidth`] / 200;
                        ogario1ThemeSettings[`miniMapTop`] = Math[`round`](20 * ogarsettings), moreogarset(`#minimap-hud`)[`css`]({
                            'width': ogario1ThemeSettings[`miniMapWidth`],
                            'height': ogario1ThemeSettings[`miniMapWidth`] + ogario1ThemeSettings[`miniMapTop`]
                        }), ogarminimapdrawer && ogarminimapdrawer[`resetMiniMapSectors`]();
                    },
                    'setMiniMapSectorsColor': function() {
                        ogarminimapdrawer && ogarminimapdrawer['resetMiniMapSectors']();
                    },
                    'setMiniMapSectorsOpacity': function() {
                        moreogarset(`#minimap-sectors`)[`css`](`opacity`, ogario1ThemeSettings[`miniMapSectorsOpacity`]);
                    },
                    'setTheme': function() {
                        this[`setFonts`](), this['setBgColor'](), this[`setCustomBackground`](), this[`setCustomCursor`](), this[`setMenu`](), this[`setHud`](), this[`setChat`](), this[`setMiniMap`]();
                    },
                    'init': function() {
                        this[`loadThemeSettings`]();
                    }
                },
                ogario1PlayerProfiles = [],
                ogarcopythelb = {
                    'nick': `I<3Legendmod`,
                    'clanTag': 'Ⓜ',
                    'skinURL': '',
                    'color': ogario1ThemeSettings[`mainColor`]
                },
                ogario1Settings = {
                    'quickResp': !0,
                    'autoResp': !1,
                    'autoZoom': !1,
                    'autoHideNames': !0,
                    'autoHideMass': !0,
                    'autoHideFood': !1,
                    'autoHideFoodOnZoom': !1,
                    'noNames': !1,
                    'optimizedNames': !0,
                    'hideMyName': !0,
                    'hideTeammatesNames': !1,
                    'showMass': !0,
                    'optimizedMass': !0,
                    'shortMass': !0,
                    'virMassShots': !0,
                    'hideMyMass': !1,
                    'hideEnemiesMass': !1,
                    'vanillaSkins': !1,
                    'customSkins': !0,
                    'myTransparentSkin': !1,
                    'myCustomColor': !1,
                    'transparentCells': !1,
                    'transparentViruses': !0,
                    'transparentSkins': !1,
                    'showGrid': !1,
                    'showBgSectors': !1,
                    'showMapBorders': !0,
                    'showGhostCells': !1,
                    'showMiniMap': !0,
                    'showMiniMapGrid': !1,
                    'showMiniMapGuides': !0,
                    'showMiniMapGhostCells': !0,
                    'oneColoredTeammates': !1,
                    'optimizedFood': !0,
                    'rainbowFood': !1,
                    'oppColors': !1,
                    'oppRings': !1,
                    'virColors': !1,
                    'splitRange': !1,
                    'virusesRange': !1,
                    'textStroke': !1,
                    'namesStroke': !1,
                    'massStroke': !1,
                    'cursorTracking': !1,
                    'teammatesInd': !1,
                    'mouseSplit': !1,
                    'mouseFeed': !1,
                    'mouseInvert': !1,
                    'disableChat': !1,
                    'hideChat': !1,
                    'chatSounds': !0,
                    'chatEmoticons': !0,
                    'showChatBox': !1,
                    'showChatImages': !0,
                    'showChatVideos': !0,
                    'showTop5': !0,
                    'showTargeting': !0,
                    'showLbData': !0,
                    'showTime': !0,
                    'normalLb': !1,
                    'centeredLb': !0,
                    'fpsAtTop': !0,
                    'showStats': !0,
                    'showStatsMass': !0,
                    'showStatsSTE': !1,
                    'showStatsN16': !1,
                    'showStatsFPS': !0,
                    'blockPopups': !1,
                    'streamMode': !1,
                    'hideSkinUrl': !1,
                    'showQuickMenu': !0,
                    'showSkinsPanel': !0,
                    'animation': 140,
                    'zoomSpeedValue': 0.9,
                    'messageSound': `https://cdn.ogario.ovh/static/sounds/notification_01.mp3`,
                    'commandSound': 'https://cdn.ogario.ovh/static/sounds/notification_02.mp3'
                };
            var ogarminimapdrawer = {
                'name': `Legend mod Express v4`,
                'version': `v4 (4.0.0 b35)`,
                'privateMode': !1,
                'protocolMode': !0,
                'publicIP': 'wss://srv.ogario.eu',
                'privateIP': null,
                'updateInterval': 1000,
                'updateTick': 0,
                'updateMaxTick': 2,
                'currentSector': '',
                'miniMap': null,
                'miniMapCtx': null,
                'miniMapSectors': null,
                'pi2': 2 * Math['PI'],
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
                'playerMass': 0,
                'selectedProfile': 0,
                'lastDeath': 0,
                'skipServerData': !1,
                'gameMode': `:ffa`,
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
                'lastMessageSentTime': Date[`now`](),
                'rFps': 0,
                'renderedFrames': 0,
                'fpsLastRequest': null,
                'statsHUD': null,
                'leaderboardPositionsHUD': null,
                'leaderboardDataHUD': null,
                'activeParties': null,
                'top5pos': null,
                'top5totalMass': null,
                'top5totalPlayers': null,
                'top5limit': 5,
                'timeHUD': null,
                'questHUD': null,
                'retryResp': 0,
                'token': `b2dhcmlvLm92aA==`,
                'canvasScale': 1,
                'selectBiggestCell': !0,
                'noColors': !1,
                'skipStats': !1,
                'showQuest': !1,
                'showSplitInd': !1,
                'pause': !1,
                'targetID': 0,
                'targetStatus': 0,
                'targetNick': '',
                'targetSkinURL': '',
                'targeting': !1,
                'privateMiniMap': !1,
                'messageSound': null,
                'commandSound': null,
                'feedInterval': null,
                'getPlayerX': function() {
                    return ogarcanvas[`playerX`] + ogarcanvas[`mapOffsetX`];
                },
                'getPlayerY': function() {
                    return ogarcanvas[`playerY`] + ogarcanvas[`mapOffsetY`];
                },
                'feed': function() {
                    more2ogarset[`core`] && more2ogarset[`core`]['eject'] && more2ogarset[`core`]['eject']();
                },
                'macroFeed': function(ogarsettings) {
                    if (ogarsettings) {
                        if (this[`feedInterval`]) return;
                        var more2ogarset = this;
                        this[`feed`](), this[`feedInterval`] = setInterval(function() {
                            more2ogarset[`feed`]();
                        }, 80);
                    } else this[`feedInterval`] && (clearInterval(this[`feedInterval`]), this[`feedInterval`] = null);
                },
                'split': function() {
                    more2ogarset[`core`] && more2ogarset[`core`][`split`] && more2ogarset[`core`]['split']();
                },
                'doubleSplit': function() {
                    var ogarsettings = this;
                    ogarsettings[`split`](), setTimeout(function() {
                        ogarsettings['split']();
                    }, 40);
                },
                'popSplit': function() {
                    var ogarsettings = this;
                    ogarsettings[`split`](), setTimeout(function() {
                        ogarsettings['split']();
                    }, 200);
                },
                'split16': function() {
                    var ogarsettings = this;
                    ogarsettings['split'](), setTimeout(function() {
                        ogarsettings['split']();
                    }, 40), setTimeout(function() {
                        ogarsettings[`split`]();
                    }, 80), setTimeout(function() {
                        ogarsettings[`split`]();
                    }, 0x78);
                },
                'toggleSkins': function() {
                    ogarcanvas[`vanillaSkins`] && ogarcanvas['customSkins'] ? ogarcanvas[`vanillaSkins`] = !1 : !ogarcanvas[`vannillaSkins`] && ogarcanvas['customSkins'] ? (ogarcanvas[`vanillaSkins`] = !0, ogarcanvas['customSkins'] = !1) : (ogarcanvas['vanillaSkins'] = !0, ogarcanvas[`customSkins`] = !0);
                },
                'toggleCells': function() {
                    this[`selectBiggestCell`] = !this[`selectBiggestCell`], ogarcanvas[`selectBiggestCell`] = this[`selectBiggestCell`];
                },
                'setShowTop5': function() {
                    ogario1Settings[`showTop5`] = !ogario1Settings[`showTop5`], this[`setTop5`]();
                },
                'setTop5': function() {
                    ogario1Settings[`showTop5`] ? moreogarset(`#top5-hud`)[`show`]() : moreogarset(`#top5-hud`)[`hide`]();
                },
                'setShowTargeting': function() {
                    ogario1Settings[`showTargeting`] = !ogario1Settings[`showTargeting`], this[`setTargetingHUD`]();
                },
                'setTargetingHUD': function() {
                    ogario1Settings[`showTargeting`] ? moreogarset(`#target-hud, #target-panel-hud`)[`show`]() : moreogarset('#target-hud, #target-panel-hud')[`hide`]();
                },
                'setShowTime': function() {
                    ogario1Settings[`showTime`] = !ogario1Settings[`showTime`], ogario1Settings[`showTime`] ? (moreogarset(`#time-hud`)[`show`](), this[`displayTime`]()) : moreogarset(`#time-hud`)[`hide`]();
                },
                'setShowSplitRange': function() {
                    ogario1Settings[`splitRange`] = !ogario1Settings['splitRange'], ogarcanvas[`splitRange`] = ogario1Settings[`splitRange`];
                },
                'setShowSplitInd': function() {
                    this[`showSplitInd`] = !this['showSplitInd'], ogario1Settings['splitRange'] = this[`showSplitInd`], ogario1Settings[`oppRings`] = this['showSplitInd'], ogarcanvas[`splitRange`] = ogario1Settings['splitRange'], ogarcanvas[`oppRings`] = ogario1Settings[`oppRings`];
                },
                'setShowTeammatesInd': function() {
                    ogario1Settings[`teammatesInd`] = !ogario1Settings[`teammatesInd`];
                },
                'setShowOppColors': function() {
                    ogario1Settings[`oppColors`] = !ogario1Settings[`oppColors`], ogarcanvas[`oppColors`] = ogario1Settings[`oppColors`];
                },
                'setShowSkins': function() {
                    this[`noSkins`] = !this[`noSkins`], more2ogarset[`core`] && more2ogarset[`core`][`setSkins`] && more2ogarset[`core`][`setSkins`](!this[`noSkins`]), ogarcanvas[`showCustomSkins`] = !this[`noSkins`], this[`displayChatInfo`](!this[`noSkins`], `showSkinsMsg`);
                },
                'setTransparentSkins': function() {
                    ogario1Settings[`transparentSkins`] = !ogario1Settings[`transparentSkins`], ogarcanvas['transparentSkins'] = ogario1Settings[`transparentSkins`];
                },
                'setShowStats': function() {
                    moreogarset('#stats-hud')[`toggle`]();
                },
                'setShowFood': function() {
                    ogarcanvas[`showFood`] = !ogarcanvas[`showFood`];
                },
                'setShowHUD': function() {
                    moreogarset(`#overlays-hud`)['toggle']();
                },
                'setShowGrid': function() {
                    ogario1Settings[`showGrid`] = !ogario1Settings[`showGrid`];
                },
                'setShowMiniMapGuides': function() {
                    ogario1Settings['showMiniMapGuides'] = !ogario1Settings[`showMiniMapGuides`];
                },
                'setShowLb': function() {
                    `:teams` !== this[`gameMode`] && moreogarset(`#leaderboard-hud`)[`toggle`]();
                },
                'setShowBgSectors': function() {
                    ogario1Settings[`showBgSectors`] = !ogario1Settings[`showBgSectors`];
                },
                'setHideSmallBots': function() {
                    ogarcanvas[`hideSmallBots`] = !ogarcanvas[`hideSmallBots`], this[`displayChatInfo`](!ogarcanvas['hideSmallBots'], `hideSmallBotsMsg`);
                },
                'setShowNames': function() {
                    ogario1Settings[`noNames`] = !ogario1Settings[`noNames`];
                },
                'setHideTeammatesNames': function() {
                    ogario1Settings[`hideTeammatesNames`] = !ogario1Settings[`hideTeammatesNames`];
                },
                'setShowMass': function() {
                    ogario1Settings[`showMass`] = !ogario1Settings[`showMass`];
                },
                'setShowMiniMap': function() {
                    ogario1Settings[`showMiniMap`] = !ogario1Settings['showMiniMap'], this['setMiniMap']();
                },
                'setMiniMap': function() {
                    ogario1Settings['showMiniMap'] ? moreogarset(`#minimap-hud`)[`show`]() : moreogarset(`#minimap-hud`)['hide']();
                },
                'setShowQuest': function() {
                    `:ffa` === this[`gameMode`] && (this[`showQuest`] = !this[`showQuest`], this[`setQuest`]());
                },
                'setQuest': function() {
                    this[`showQuest`] && `:ffa` === this[`gameMode`] ? moreogarset(`#quest-hud`)['show']() : moreogarset(`#quest-hud`)[`hide`]();
                },
                'toggleAutoZoom': function() {
                    ogarcanvas[`autoZoom`] = !ogarcanvas[`autoZoom`], this[`displayChatInfo`](ogarcanvas[`autoZoom`], 'autoZoomMsg');
                },
                'resetZoom': function(ogarsettings) {
                    ogarsettings ? (ogarcanvas[`zoomResetValue`] = 1, ogarcanvas[`zoomValue`] = 1) : ogarcanvas['zoomResetValue'] = 0;
                },
                'setZoom': function(ogarsettings) {
                    ogarcanvas[`zoomValue`] = ogarsettings;
                },
                'toggleDeath': function() {
                    this['lastDeath']--, this[`lastDeath`] < 0 && (this[`lastDeath`] = this[`deathLocations`][`length`] - 1);
                },
                'tryResp': function() {
                    if (ogarcanvas['play'] || 20 == this['retryResp']) this['retryResp'] = 0;
                    else {
                        this['retryResp']++;
                        var ogarsettings = this;
                        setTimeout(function() {
                            moreogarset('.btn-play-guest')['is'](`:visible`) ? moreogarset(`.btn-play-guest`)[`click`]() : moreogarset('.btn-play')[`click`](), ogarcanvas[`play`] || ogarsettings[`tryResp`]();
                        }, 500);
                    }
                },
                'quickResp': function() {
                    ogario1Settings[`quickResp`] && (this[`hideMenu`](), this[`gameServerConnect`](this['ws']), ogarcanvas[`play`] = !1, this['tryResp']());
                },
                'autoResp': function() {
                    ogario1Settings[`autoResp`] && (this[`setAutoResp`](), moreogarset('#overlays')[`stop`]()[`hide`](), moreogarset(`.btn-play-guest`)['is'](`:visible`) ? moreogarset('.btn-play-guest')[`click`]() : moreogarset(`.btn-play`)[`click`]());
                },
                'setAutoResp': function() {
                    ogario1Settings[`autoResp`] && (moreogarset(`#skipStats`)[`prop`](`checked`) || (moreogarset(`#skipStats`)[`click`](), this[`skipStats`] = !0));
                },
                'toggleAutoResp': function() {
                    ogario1Settings[`autoResp`] = !ogario1Settings[`autoResp`], this[`setAutoResp`](), this[`displayChatInfo`](ogario1Settings[`autoResp`], `autoRespMsg`);
                },
                'copyLb': function() {
                    var ogarsettings = moreogarset(`<input>`);
                    moreogarset(`body`)[`append`](ogarsettings), ogarsettings[`val`](moreogarset(`#leaderboard-positions`)['text']())[`select`]();
                    try {
                        document[`execCommand`]('copy');
                    } catch (ogarcopierlbcather) {}
                    ogarsettings[`remove`]();
                },
                'setPause': function() {
                    this[`pause`] = !this[`pause`], ogarcanvas[`pause`] = this[`pause`], this['pause'] ? (ogarcanvas['resetTargetPosition'](), moreogarset(`#pause-hud`)[`show`]()) : moreogarset(`#pause-hud`)[`hide`]();
                },
                'setCenteredLb': function() {
                    ogario1Settings[`centeredLb`] ? moreogarset(`#leaderboard-hud`)[`addClass`](`hud-text-center`) : moreogarset(`#leaderboard-hud`)['removeClass'](`hud-text-center`);
                },
                'setNormalLb': function() {
                    ogario1Settings[`normalLb`] ? moreogarset(`#leaderboard-hud h4`)[`html`](ogarcomms[`leaderboard`]) : moreogarset(`#leaderboard-hud h4`)[`html`](`ogario.ovh`);
                },
                'setFpsAtTop': function() {
                    ogario1Settings[`fpsAtTop`] ? moreogarset(`#stats-hud`)[`removeClass`](`hud-bottom`)[`addClass`](`hud-top`) : moreogarset(`#stats-hud`)[`removeClass`](`hud-top`)['addClass'](`hud-bottom`);
                },
                'setBlockPopups': function() {
                    this[`protocolMode`] ? moreogarset(`#block-warn`)[`hide`]() : ogario1Settings[`blockPopups`] ? this[`blockPopups`]() : this[`unblockPopups`]();
                },
                'blockPopups': function() {
                    moreogarset(`#openfl-content, #openfl-overlay`)[`hide`](), moreogarset(`#openfl-content, #openfl-overlay`)[`addClass`](`block-popups`), moreogarset('#freeCoins, #gifting, #openShopBtn, #dailyQuests')[`prop`](`disabled`, !0), moreogarset(`#block-warn`)[`show`]();
                },
                'unblockPopups': function() {
                    moreogarset(`#openfl-overlay.disabler`)['click'](), moreogarset('#openfl-content, #openfl-overlay')[`hide`](), moreogarset(`#openfl-content, #openfl-overlay`)['removeClass']('block-popups'), moreogarset(`#freeCoins, #gifting, #openShopBtn, #dailyQuests`)[`prop`](`disabled`, !1), moreogarset(`#block-warn`)[`hide`]();
                },
                'tempUnblockPopups': function() {
                    ogario1Settings[`blockPopups`] && this[`unblockPopups`]();
                },
                'displayLeaderboard': function(ogarsettings, more2ogarset = '') {
                    this[`leaderboardPositionsHUD`] && (this[`leaderboardPositionsHUD`][`innerHTML`] = ogarsettings, this[`leaderboardDataHUD`][`innerHTML`] = more2ogarset);
                },
                'displayStats': function() {
                    if (ogario1Settings[`showStats`]) {
                        var ogarsettings = '';
                        ogarcanvas[`play`] && (ogario1Settings[`showStatsMass`] && ogarcanvas[`playerMass`] && (ogarsettings += ogarcomms[`mass`] + ': ' + ogarcanvas[`playerMass`] + ` | `), ogarcanvas[`playerScore`] && (ogarsettings += ogarcomms[`score`] + ': ' + ogarcanvas['playerScore']), ogario1Settings['showStatsSTE'] && ogarcanvas[`STE`] && (ogarsettings += ` | STE: ` + ogarcanvas['STE']), ogario1Settings[`showStatsN16`] && ogarcanvas[`playerSplitCells`] && (ogarsettings += ` | ` + ogarcanvas[`playerSplitCells`] + '/16'), ogario1Settings[`showStatsFPS`] && (ogarsettings += ' | ')), ogario1Settings[`showStatsFPS`] && (ogarsettings += `FPS: ` + ogarfooddrawer[`fps`]), this[`statsHUD`][`textContent`] = ogarsettings;
                        var more2ogarset = this;
                        setTimeout(function() {
                            more2ogarset[`displayStats`]();
                        }, 250);
                    } else moreogarset('#stats-hud')[`hide`]();
                },
                'displayTime': function() {
                    if (ogario1Settings[`showTime`]) {
                        var ogarsettings = new Date()[`toLocaleString`]();
                        this['timeHUD'][`textContent`] = ogarsettings;
                        var more2ogarset = this;
                        setTimeout(function() {
                            more2ogarset[`displayTime`]();
                        }, 1000);
                    } else moreogarset(`#time-hud`)[`hide`]();
                },
                'displayParties': function() {
                    for (var ogarsettings = '', more2ogarset = 0; more2ogarset < this[`parties`]['length']; more2ogarset++) ogarsettings += `<li><a href=\"https://agar.io/#` + this[`parties`][more2ogarset] + `\" onclick=\"$(\'#party-token\').val(\'` + this[`parties`][more2ogarset] + '\'); $(\'#join-party-btn-2\').click();\">https://agar.io/#' + this[`parties`][more2ogarset] + `</a></li>`;
                    this[`activeParties`][`className`] = '' === ogarsettings ? `no-parties` : '', this[`activeParties`]['innerHTML'] = ogarsettings;
                },
                'displayTop5': function() {
                    if (ogario1Settings['showTop5']) {
                        for (var ogarsettings = '', more2ogarset = 0, moreogarset = this[`top5`][`length`], more3ogarset = 0; more3ogarset < moreogarset; more3ogarset++) more2ogarset += this[`top5`][more3ogarset][`mass`], more3ogarset >= this['top5limit'] || (ogarsettings += `<li><span class=\"cell-counter\" style=\"background-color: ` + this[`top5`][more3ogarset][`color`] + '\">' + (more3ogarset + 1) + `</span>`, ogario1Settings[`showTargeting`] && (ogarsettings += `<a href=\"#\" data-user-id=\"` + this[`top5`][more3ogarset]['id'] + `\" class=\"set-target ogicon-target\"></a> `), ogarsettings += `<span class=\"hud-main-color\">[` + this[`calculateMapSector`](this[`top5`][more3ogarset]['x'], this[`top5`][more3ogarset]['y']) + `]</span>`, ogarsettings += `<span class=\"top5-mass-color\">[` + this[`shortMassFormat`](this[`top5`][more3ogarset][`mass`]) + `]</span> ` + this[`escapeHTML`](this[`top5`][more3ogarset][`nick`]) + `</li>`);
                        this[`top5pos`]['innerHTML'] = ogarsettings, ogarcanvas['play'] && ogarcanvas[`playerMass`] && (more2ogarset += ogarcanvas[`playerMass`], moreogarset++), this[`top5totalMass`][`textContent`] = this[`shortMassFormat`](more2ogarset), this[`top5totalPlayers`][`textContent`] = moreogarset;
                    }
                },
                'setTop5limit': function(ogarsettings) {
                    ogarsettings && (this[`top5limit`] = ogarsettings);
                },
                'displayChatHistory': function(ogarsettings) {
                    if (ogarsettings) {
                        this[`clearChatHistory`](!0);
                        for (var more2ogarset = 0; more2ogarset < this[`chatHistory`][`length`]; more2ogarset++) moreogarset(`#messages`)['append'](`<li><span class=\"message-nick\">` + this[`chatHistory`][more2ogarset][`nick`] + `: </span><span class=\"message-text\">` + this['chatHistory'][more2ogarset][`message`] + `</span></li>`);
                    } else this[`clearChatHistory`](!1);
                },
                'clearChatHistory': function(ogarsettings) {
                    moreogarset(`#messages`)[`empty`](), ogarsettings && (toastr[`clear`](), ogario1Settings[`showChatBox`] && (moreogarset(`#chat-box .message`)[`remove`](), this[`chatHistory`]['length'] = 0));
                },
                'displayChatInfo': function(ogarsettings, more2ogarset) {
                    ogarsettings ? toastr['info'](ogarcomms[more2ogarset + 'A']) : toastr['error'](ogarcomms[more2ogarset + 'B']);
                },
                'setDisableChat': function() {
                    ogario1Settings[`hideChat`] = ogario1Settings[`disableChat`], this[`setHideChat`]();
                },
                'hideChat': function() {
                    ogario1Settings['hideChat'] = !ogario1Settings[`hideChat`], this[`setHideChat`](), this[`displayChatInfo`](!ogario1Settings[`hideChat`], 'hideChatMsg');
                },
                'setHideChat': function() {
                    ogario1Settings['hideChat'] && moreogarset('#message-box')[`hide`](), this[`setShowChatBox`]();
                },
                'setShowChatBox': function() {
                    !ogario1Settings[`hideChat`] && ogario1Settings[`showChatBox`] ? moreogarset(`#chat-box`)['show']() : moreogarset(`#chat-box`)[`hide`]();
                },
                'enterChatMessage': function() {
                    var ogarsettings = moreogarset(`#message-box`),
                        more2ogarset = moreogarset('#message');
                    if (ogarsettings['is'](`:visible`)) {
                        var more3ogarset = more2ogarset[`val`]();
                        more3ogarset['length'] ? (this[`sendChatMessage`](101, more3ogarset), ogarcanvas[`play`] && (more2ogarset[`blur`](), ogarsettings[`hide`]())) : (more2ogarset[`blur`](), ogarsettings[`hide`]()), more2ogarset[`val`]('');
                    } else ogarsettings[`show`](), more2ogarset['focus'](), more2ogarset[`val`]('');
                },
                'showMenu': function(ogarsettings) {
                    if (more2ogarset['MC'] && more2ogarset['MC'][`showNickDialog`]) return moreogarset('.ogario-menu')[`show`](), moreogarset(`.menu-panel`)['hide'](), ogarcanvas[`play`] || this['skipStats'] ? moreogarset('#main-panel')[`show`]() : moreogarset(`#stats`)['show'](), more2ogarset['MC']['showNickDialog'](300), moreogarset(`#oferwallContainer`)['is'](`:visible`) && more2ogarset[`closeOfferwall`](), void(moreogarset(`#videoContainer`)['is'](`:visible`) && more2ogarset[`closeVideoContainer`]());
                    ogarsettings ? moreogarset(`#overlays`)[`fadeIn`](ogarsettings) : moreogarset(`#overlays`)[`show`]();
                },
                'hideMenu': function(ogarsettings) {
                    more2ogarset['MC'] && more2ogarset['MC'][`showNickDialog`] ? moreogarset(`.ogario-menu`)[`hide`]() : ogarsettings ? moreogarset(`#overlays`)[`fadeOut`](ogarsettings) : moreogarset(`#overlays`)[`hide`]();
                },
                'escapeHTML': function(ogarsettings) {
                    return String(ogarsettings)[`replace`](/[&<>"'\/]/g, function(ogarsettings) {
                        return ogarparsedchars[ogarsettings];
                    });
                },
                'checkSkinURL': function(ogarsettings) {
                    return /^https?:\/\/i\.(?:imgur|hizliresim)\.com\/\w{6,8}\.(?:jpg|jpeg|png)\??\d*$/i [`test`](ogarsettings) ? ogarsettings[`replace`](`http:`, `https:`) : '';
                },
                'loadSettings': function() {
                    var ogarsettings = null;
                    for (var moreogarset in null !== more2ogarset[`localStorage`][`getItem`](`ogarioSettings`) && (ogarsettings = JSON[`parse`](more2ogarset[`localStorage`][`getItem`]('ogarioSettings'))), ogario1Settings) ogario1Settings[`hasOwnProperty`](moreogarset) && (ogarsettings && ogarsettings['hasOwnProperty'](moreogarset) && (ogario1Settings[moreogarset] = ogarsettings[moreogarset]), ogarcanvas[`hasOwnProperty`](moreogarset) && (ogarcanvas[moreogarset] = ogario1Settings[moreogarset]));
                },
                'saveSettings': function(ogarsettings, ogarcanvas) {
                    more2ogarset['localStorage'][`setItem`](ogarcanvas, JSON['stringify'](ogarsettings));
                },
                'exportSettings': function() {
                    var ogarsettings = {
                        'ogarioCommands': ogario1Commands,
                        'ogarioHotkeys': ogario1Hotkeys,
                        'ogarioPlayerProfiles': ogario1PlayerProfiles,
                        'ogarioSettings': ogario1Settings,
                        'ogarioThemeSettings': ogario1ThemeSettings
                    };
                    for (var more2ogarset in ogarsettings) {
                        if (ogarsettings[`hasOwnProperty`](more2ogarset)) moreogarset(`#export-` + more2ogarset)['prop'](`checked`) || delete ogarsettings[more2ogarset];
                    }
                    ogarsettings = JSON[`stringify`](ogarsettings), moreogarset('#export-settings')[`val`](ogarsettings), moreogarset(`#import-settings`)[`val`](''), ogarsettings = null;
                },
                'importSettings': function() {
                    moreogarset(`#import-settings`)[`blur`]();
                    var ogarsettings = moreogarset(`#import-settings`)[`val`]();
                    if (ogarsettings) {
                        for (var ogarcanvas in ogarsettings = JSON[`parse`](ogarsettings))
                            if (ogarsettings[`hasOwnProperty`](ogarcanvas)) {
                                if (!moreogarset(`#import-` + ogarcanvas)[`prop`](`checked`)) continue;
                                more2ogarset[`localStorage`][`setItem`](ogarcanvas, JSON[`stringify`](ogarsettings[ogarcanvas]));
                            } more2ogarset['location'][`reload`]();
                    }
                },
                'restoreSettings': function() {
                    null !== more2ogarset[`localStorage`]['getItem'](`ogarioSettings`) && (more2ogarset[`localStorage`][`removeItem`](`ogarioSettings`), more2ogarset['location'][`reload`]());
                },
                'setSettings': function(ogarsettings, more2ogarset) {
                    if (ogario1Settings[`hasOwnProperty`](ogarsettings) && null !== more2ogarset) {
                        switch (ogario1Settings[ogarsettings] = more2ogarset, ogarcanvas[`hasOwnProperty`](ogarsettings) && (ogarcanvas[ogarsettings] = more2ogarset), ogarsettings) {
                            case `autoResp`:
                                this[`setAutoResp`]();
                                break;
                            case 'showMiniMap':
                                this[`setMiniMap`]();
                                break;
                            case `showMiniMapGrid`:
                                this['resetMiniMapSectors']();
                                break;
                            case `disableChat`:
                                this['setDisableChat']();
                                break;
                            case `chatSounds`:
                                this[`setChatSoundsBtn`]();
                                break;
                            case `showChatBox`:
                                this[`setShowChatBox`]();
                                break;
                            case `showTop5`:
                                this[`setTop5`]();
                                break;
                            case 'showTargeting':
                                this['setTargetingHUD']();
                                break;
                            case `showTime`:
                                this[`displayTime`](), moreogarset(`#time-hud`)['show']();
                                break;
                            case `centeredLb`:
                                this[`setCenteredLb`]();
                                break;
                            case `normalLb`:
                                this[`setNormalLb`]();
                                break;
                            case `fpsAtTop`:
                                this[`setFpsAtTop`]();
                                break;
                            case `showStats`:
                                this[`displayStats`](), moreogarset(`#stats-hud`)[`show`]();
                                break;
                            case `blockPopups`:
                                this['setBlockPopups']();
                        }
                        this[`saveSettings`](ogario1Settings, `ogarioSettings`);
                    }
                },
                'loadProfiles': function() {
                    if (null !== more2ogarset[`localStorage`][`getItem`](`ogarioPlayerProfiles`)) ogario1PlayerProfiles = JSON[`parse`](more2ogarset[`localStorage`]['getItem'](`ogarioPlayerProfiles`));
                    else
                        for (var ogarsettings = 0; ogarsettings < 10; ogarsettings++) ogario1PlayerProfiles[`push`]({
                            'nick': `Profile #` + (ogarsettings + 1),
                            'clanTag': '',
                            'skinURL': '',
                            'color': ogario1ThemeSettings['mainColor']
                        });
                    null !== more2ogarset[`localStorage`][`getItem`](`ogarioSelectedProfile`) && (this[`selectedProfile`] = JSON['parse'](more2ogarset[`localStorage`][`getItem`]('ogarioSelectedProfile'))), ogarcopythelb[`nick`] = ogario1PlayerProfiles[this[`selectedProfile`]][`nick`], ogarcopythelb[`clanTag`] = ogario1PlayerProfiles[this['selectedProfile']][`clanTag`], ogarcopythelb[`skinURL`] = ogario1PlayerProfiles[this['selectedProfile']]['skinURL'], ogarcopythelb[`color`] = ogario1PlayerProfiles[this[`selectedProfile`]][`color`];
                },
                'changeSkinPreview': function(ogarsettings, more2ogarset) {
                    ogarsettings && more2ogarset && ('skin-preview' === more2ogarset ? (moreogarset('#skin-preview')[`removeClass`](`default`)[`append`](`<a href=\"#\" id=\"skin-popover\" data-toggle=\"popover\" title=\"\" data-html=\"true\" data-content=\"<img src=\'` + ogarsettings['src'] + `\' width=\'500\'>\"></a>`), moreogarset('#skin-popover')[`append`](moreogarset(ogarsettings)[`fadeIn`](1000)), moreogarset(`#skin-popover`)[`popover`]()) : moreogarset('#' + more2ogarset)[`removeClass`](`default`)[`append`](moreogarset(ogarsettings)[`fadeIn`](1000)));
                },
                'setSkinPreview': function(ogarsettings, more2ogarset) {
                    if (moreogarset('#' + more2ogarset)[`empty`]()[`addClass`](`default`), ogarsettings && 0 != ogarsettings[`length`]) {
                        var ogarcanvas = this,
                            more3ogarset = new Image();
                        more3ogarset[`crossOrigin`] = 'Anonymous', more3ogarset[`onload`] = function() {
                            ogarcanvas[`changeSkinPreview`](more3ogarset, more2ogarset);
                        }, more3ogarset[`src`] = ogarsettings;
                    }
                },
                'setProfile': function() {
                    var ogarsettings = (ogario1PlayerProfiles[`length`] + this['selectedProfile'] - 1) % ogario1PlayerProfiles[`length`],
                        more2ogarset = (this[`selectedProfile`] + 1) % ogario1PlayerProfiles[`length`];
                    this[`setSkinPreview`](ogario1PlayerProfiles[ogarsettings][`skinURL`], 'prev-profile'), this['setSkinPreview'](ogario1PlayerProfiles[this['selectedProfile']][`skinURL`], `skin-preview`), this[`setSkinPreview`](ogario1PlayerProfiles[more2ogarset][`skinURL`], `next-profile`), this[`saveSettings`](this[`selectedProfile`], `ogarioSelectedProfile`), moreogarset(`#nick`)[`val`](ogario1PlayerProfiles[this[`selectedProfile`]][`nick`]), moreogarset(`#clantag`)['val'](ogario1PlayerProfiles[this[`selectedProfile`]]['clanTag']), moreogarset(`#skin`)[`val`](ogario1PlayerProfiles[this['selectedProfile']]['skinURL']), moreogarset('#color')[`val`](ogario1PlayerProfiles[this['selectedProfile']][`color`]), moreogarset(`.skin`)['colorpicker'](`setValue`, ogario1PlayerProfiles[this[`selectedProfile`]][`color`]), moreogarset(`#skins a`)[`removeClass`](`selected`), moreogarset(`#skins a[data-profile=\'` + this['selectedProfile'] + '\']')[`addClass`]('selected');
                },
                'prevProfile': function() {
                    this[`setPlayerSettings`](), this[`selectedProfile`] = (ogario1PlayerProfiles[`length`] + this[`selectedProfile`] - 1) % ogario1PlayerProfiles[`length`], this[`setProfile`]();
                },
                'nextProfile': function() {
                    this[`setPlayerSettings`](), this['selectedProfile'] = (this['selectedProfile'] + 1) % ogario1PlayerProfiles[`length`], this['setProfile']();
                },
                'selectProfile': function(ogarsettings) {
                    this[`setPlayerSettings`](), this['selectedProfile'] = parseInt(ogarsettings), this[`setProfile`]();
                },
                'addOption': function(ogarsettings, more2ogarset, ogarcanvas, more3ogarset) {
                    moreogarset(ogarsettings)[`append`](`<label><input type=\"checkbox\" id=\"` + more2ogarset + `\" class=\"js-switch\"> ` + ogarcanvas + `</label>`), moreogarset('#' + more2ogarset)[`prop`](`checked`, more3ogarset);
                },
                'addOptions': function(ogarsettings, more2ogarset) {
                    if (ogarsettings) {
                        moreogarset(`#og-options`)[`append`](`<div class=\"options-box ` + more2ogarset + '\"><h5 class=\"menu-main-color\">' + ogarcomms[more2ogarset] + '</h5></div>');
                        for (var ogarcanvas = 0; ogarcanvas < ogarsettings['length']; ogarcanvas++) {
                            var more3ogarset = ogarsettings[ogarcanvas];
                            ogario1Settings[`hasOwnProperty`](more3ogarset) && (moreogarset('.' + more2ogarset)[`append`](`<label>` + ogarcomms[more3ogarset] + ` <input type=\"checkbox\" class=\"js-switch\" id=\"` + more3ogarset + `\"></label>`), moreogarset('#' + more3ogarset)[`prop`]('checked', ogario1Settings[more3ogarset]));
                        }
                    }
                },
                'addInputBox': function(ogarsettings, more2ogarset, ogarcanvas, more3ogarset) {
                    moreogarset(ogarsettings)['append']('<div class=\"input-box\"><span class=\"title-box\">' + ogarcomms[more2ogarset] + `</span><input id=\"` + more2ogarset + '\" class=\"form-control\" placeholder=\"' + ogarcanvas + `\" value=\"` + ogario1Settings[more2ogarset] + `\" /></div>`);
                    var more4ogarset = this;
                    moreogarset('#' + more2ogarset)['on'](`input`, function() {
                        ogario1Settings[more2ogarset] = this[`value`], more4ogarset[more3ogarset](), more4ogarset[`saveSettings`](ogario1Settings, `ogarioSettings`);
                    });
                },
                'addSliderBox': function(ogarsettings, more2ogarset, more3ogarset, more4ogarset, ogarbuffed, ogarlanguage) {
                    moreogarset(ogarsettings)['append'](`<div class=\"slider-box\"><div class=\"box-label\"><span class=\"value-label\">` + ogarcomms[more2ogarset] + ': </span><span id=\"' + more2ogarset + `-value\" class=\"value\">` + ogario1Settings[more2ogarset] + '</span></div><input id=\"' + more2ogarset + `-slider\" type=\"range\" min=\"` + more3ogarset + `\" max=\"` + more4ogarset + '\" step=\"' + ogarbuffed + `\" value=\"` + ogario1Settings[more2ogarset] + `\"></div>`);
                    var ogaractuallanguage = this;
                    ogarlanguage ? moreogarset('#' + more2ogarset + `-slider`)['on'](`input`, function() {
                        var ogarsettings = parseFloat(moreogarset(this)['val']());
                        moreogarset('#' + more2ogarset + '-value')[`text`](ogarsettings), ogario1Settings[more2ogarset] = ogarsettings, ogarcanvas[`hasOwnProperty`](more2ogarset) && (ogarcanvas[more2ogarset] = ogarsettings), ogaractuallanguage[ogarlanguage](), ogaractuallanguage[`saveSettings`](ogario1Settings, 'ogarioSettings');
                    }) : moreogarset('#' + more2ogarset + `-slider`)['on'](`input`, function() {
                        var ogarsettings = parseFloat(moreogarset(this)[`val`]());
                        moreogarset('#' + more2ogarset + `-value`)[`text`](ogarsettings), ogario1Settings[more2ogarset] = ogarsettings, ogarcanvas[`hasOwnProperty`](more2ogarset) && (ogarcanvas[more2ogarset] = ogarsettings), ogaractuallanguage['saveSettings'](ogario1Settings, 'ogarioSettings');
                    });
                },
                'setLang': function() {
                    if ('pl' === ogarlanguage && more2ogarset[`i18n_dict`] && more2ogarset['i18n_dict']['en'])
                        for (var ogarsettings in more2ogarset[`i18n_dict`]['en']) more2ogarset[`i18n_dict`]['en']['hasOwnProperty'](ogarsettings) && ogarcomms['hasOwnProperty'](ogarsettings) && (more2ogarset[`i18n_dict`]['en'][ogarsettings] = ogarcomms[ogarsettings]);
                },
                'setMenu': function() {
                    for (var ogarsettings in document[`title`] = this[`name`], moreogarset(`#mainPanel`)[`before`](`<div id=\"exp-bar\" class=\"agario-panel\"><span class=\"ogicon-user\"></span><div class=\"agario-exp-bar progress\"><span class=\"progress-bar-text\"></span><div class=\"progress-bar progress-bar-striped\" style=\"width: 0%;\"></div></div><div class=\"progress-bar-star\"></div></div><div id=\"main-menu\" class=\"agario-panel\"><ul class=\"menu-tabs\"><li class=\"start-tab active\"><a href=\"#main-panel\" class=\"active ogicon-home\" data-toggle=\"tab-tooltip\" title=\"` + ogarcomms[`start`] + `\"></a></li><li class=\"profile-tab\"><a href=\"#profile\" class=\"ogicon-user\" data-toggle=\"tab-tooltip\" title=\"` + ogarcomms[`profile`] + `\"></a></li><li class=\"settings-tab\"><a href=\"#og-settings\" class=\"ogicon-cog\" data-toggle=\"tab-tooltip\" title=\"` + ogarcomms[`settings`] + `\"></a></li><li class=\"theme-tab\"><a href=\"#theme\" class=\"ogicon-droplet\" data-toggle=\"tab-tooltip\" title=\"` + ogarcomms[`theme`] + '\"></a></li><li class=\"hotkeys-tab\"><a href=\"#\" class=\"hotkeys-link ogicon-keyboard\" data-toggle=\"tab-tooltip\" title=\"' + ogarcomms[`hotkeys`] + '\"></a></li><li class=\"music-tab\"><a href=\"#music\" class=\"ogicon-music\" data-toggle=\"tab-tooltip\" title=\"Radio / ' + ogarcomms[`sounds`] + `\"></a></li></ul><div id=\"main-panel\" class=\"menu-panel\"></div><div id=\"profile\" class=\"menu-panel\"></div><div id=\"og-settings\" class=\"menu-panel\"><div class=\"submenu-panel\"></div></div><div id=\"theme\" class=\"menu-panel\"></div><div id=\"music\" class=\"menu-panel\"></div></div>`), moreogarset(`#main-panel`)[`append`](`<a href=\"#\" class=\"quick quick-menu ogicon-menu\"></a><a href=\"#\" class=\"quick quick-skins ogicon-images\"></a><div id=\"profiles\"><div id=\"prev-profile\"></div><div id=\"skin-preview\"></div><div id=\"next-profile\"></div></div>`), moreogarset(`#mainPanel div[role=form]`)['appendTo'](moreogarset(`#main-panel`)), moreogarset(`#main-panel div[role=form] .form-group:first`)['remove'](), moreogarset(`#nick`)[`before`](`<input id=\"clantag\" class=\"form-control\" placeholder=\"Tag, e.g. Ⓜ\" maxlength=\"10\"><div class=\"input-group nick\"></div>`), moreogarset(`#nick`)[`appendTo`](moreogarset('.nick')), moreogarset(`.nick`)['append'](`<span class=\"input-group-btn\"><button id=\"stream-mode\" class=\"btn active ogicon-eye\"></button></span>`), moreogarset('.nick')[`after`](`<div class=\"input-group skin\"><input id=\"skin\" class=\"form-control\" placeholder=\"Skin URL (imgur.com direct link)\" maxlength=\"40\"><input type=\"hidden\" id=\"color\" value=\"` + ogarcopythelb[`color`] + '\" maxlength=\"7\" /><span class=\"input-group-addon\"><i></i></span><span class=\"input-group-btn\"><button id=\"hide-url\" class=\"btn active ogicon-eye\"></button></span></div>'), moreogarset(`#locationKnown, #locationUnknown`)[`insertAfter`](moreogarset('.skin')), moreogarset(`#region`)['before'](`<button class=\"btn btn-warning btn-server-info ogicon-cogs\"></button>`), moreogarset(`.btn-spectate, .btn-logout`)[`appendTo`]('#agario-main-buttons'), moreogarset(`#agario-main-buttons`)[`addClass`](`clearfix`)[`before`](`<div id=\"server-info\" class=\"form-group clearfix\"><input id=\"server-ws\" class=\"form-control\" placeholder=\"Server WS\"><button id=\"server-connect\" class=\"btn btn-success ogicon-power\"></button><button id=\"server-reconnect\" class=\"btn btn-primary ogicon-redo2\"></button><input id=\"server-token\" class=\"form-control\" placeholder=\"Server token\"><button id=\"server-join\" class=\"btn btn-success\" data-itr=\"page_join_party\">Join</button></div>`), moreogarset(`#helloContainer div[role=form]`)[`after`](`<div id=\"ogario-party\" class=\"clearfix\"><input id=\"party-token\" class=\"form-control\" placeholder=\"Party token\"></div>`), moreogarset(`#ogario-party`)[`append`]('<button id=\"join-party-btn-2\" class=\"btn btn-success\" data-itr=\"page_join_party\">Join</button><button id=\"create-party-btn-2\" class=\"btn btn-primary\" data-itr=\"page_create_party\">Create</button>'), moreogarset('#pre-join-party-btn:first, #join-party-btn:first, #create-party-btn:first, #leave-party-btn:first, #joinPartyToken:first, .party-icon-back:first')[`appendTo`](moreogarset('#ogario-party')), moreogarset('#settingsChoice, #options')[`appendTo`](moreogarset(`#og-settings .submenu-panel`)), moreogarset('#stats')[`appendTo`](moreogarset(`#main-menu`))[`addClass`](`menu-panel`), moreogarset('#statsContinue')[`attr`]('id', 'statsContinue2'), moreogarset('#mainPanel')[`empty`]()[`remove`](), moreogarset(`.center-container`)[`addClass`](`ogario-menu`), moreogarset(`.center-container`)['append'](`<div id=\"menu-footer\" class=\"menu-main-color\">` + ogarcomms[`visit`] + ` <a href=\"http://legendmod.ml\" target=\"_blank\">legendmod.ml</a> | ` + this[`version`] + ' <a href=\"https://goo.gl/nRREoR\" class=\"release ogicon-info\" target=\"_blank\"></a></div>'), moreogarset(`#leftPanel, #rightPanel`)[`addClass`](`ogario-menu`)[`removeAttr`]('id'), moreogarset(`.agario-profile-panel, .agario-panel-freecoins, .agario-panel-gifting, .agario-shop-panel, #dailyquests-panel`)[`appendTo`](moreogarset(`#profile`))['removeClass'](`agario-side-panel`), moreogarset(`.agario-profile-panel`)[`after`](`<div id=\"block-warn\">` + ogarcomms[`blockWarn`] + '<br><a href=\"#\" id=\"unblock-popups\">' + ogarcomms[`unblockPopups`] + `</a></div>`), moreogarset(`#exp-bar`)[`addClass`](`agario-profile-panel`), moreogarset(`.left-container`)[`empty`](), moreogarset(`.agario-shop-panel`)[`after`]('<div class=\"agario-panel ogario-yt-panel\"><h5 class=\"menu-main-color\">Team OGARio (tag: Ⓜ)</h5><div class=\"g-ytsubscribe\" data-channelid=\"UCaWiPNJWnhzYDrBQoXokn6w\" data-layout=\"full\" data-theme=\"dark\" data-count=\"default\"></div></div>'), moreogarset(`#tags-container`)[`appendTo`](moreogarset('#profile')), moreogarset('.btn-logout')[`appendTo`](moreogarset(`#profile`)), moreogarset('.left-container')[`append`](`<div id=\"quick-menu\" class=\"agario-panel agario-side-panel\"><a href=\"https://ogario.ovh/skins/\" class=\"quick-more-skins ogicon-grin\" target=\"_blank\" data-toggle=\"tab-tooltip\" data-placement=\"left\" title=\"` + ogarcomms[`skins`] + `\"></a><a href=\"https://youtube.com/channel/UCaWiPNJWnhzYDrBQoXokn6w\" class=\"quick-yt ogicon-youtube2\" target=\"_blank\" data-toggle=\"tab-tooltip\" data-placement=\"left\" title=\"Team OGARio\"></a></div>`), this['protocolMode'] || moreogarset(`#quick-menu`)[`prepend`](`<a href=\"#\" class=\"quick-shop ogicon-cart\" data-toggle=\"tab-tooltip\" data-placement=\"left\" title=\"` + ogarcomms[`page_shop`] + `\"></a><a href=\"#\" class=\"quick-free-coins ogicon-coin-dollar\" data-toggle=\"tab-tooltip\" data-placement=\"left\" title=\"` + ogarcomms[`page_menu_main_free_coins`] + `\"></a><a href=\"#\" class=\"quick-free-gifts ogicon-gift\" data-toggle=\"tab-tooltip\" data-placement=\"left\" title=\"` + ogarcomms[`page_menu_main_gifts`] + `\"></a><a href=\"#\" class=\"quick-quests ogicon-trophy\" data-toggle=\"tab-tooltip\" data-placement=\"left\" title=\"` + ogarcomms[`page_menu_main_dailyquests`] + `\"></a>`), moreogarset(`.party-dialog, .partymode-info`)[`remove`](), moreogarset(`.agario-party-6`)['appendTo'](moreogarset(`.center-container`)), moreogarset(`.right-container`)[`empty`](), moreogarset(`.right-container`)[`append`](`<div class=\"agario-party\"></div>`), moreogarset(`.agario-party-6`)[`appendTo`](moreogarset(`.agario-party`))[`addClass`](`agario-panel agario-side-panel`), moreogarset(`.agario-party h4, #cancel-party-btn`)[`remove`](), moreogarset(`.agario-party .btn`)[`addClass`](`btn-sm`), moreogarset(`.right-container`)['append'](`<div id=\"skins-panel\" class=\"agario-panel agario-side-panel\"><div id=\"skins\"></div><a href=\"https://ogario.ovh/skins/\" id=\"more-skins\" class=\"btn btn-block btn-success\" target=\"_blank\">` + ogarcomms[`moreSkins`] + `</a></div>`), moreogarset(`.btn-settings, .text-muted, .tosBox, .agario-promo, #agario-web-incentive, span[data-itr=\'page_option_dark_theme\'], #options #darkTheme`)['remove'](), moreogarset(`#advertisement, #adbg, #a320x250, #g320x250, #s320x250, #adsBottom`)[`css`]('display', `none`), moreogarset(`#advertisement`)[`removeClass`](`agario-panel`), moreogarset(`#adsBottom`)['css']({
                            'z-index': '1',
                            'opacity': '0',
                            'bottom': `-100px`
                        }), moreogarset(`#noNames, #showMass`)[`remove`](), moreogarset(`#og-settings .submenu-panel`)[`append`](`<div id=\"og-options\"></div>`), this['addOptions']([], `animationGroup`), this[`addOptions`]([`autoZoom`], `zoomGroup`), this[`addOptions`]([`quickResp`, `autoResp`], `respGroup`), this[`addOptions`]([`noNames`, `optimizedNames`, `autoHideNames`, `hideMyName`, `hideTeammatesNames`, `namesStroke`], 'namesGroup'), this[`addOptions`]([`showMass`, `optimizedMass`, `autoHideMass`, 'hideMyMass', 'hideEnemiesMass', `shortMass`, `virMassShots`, `massStroke`], 'massGroup'), this['protocolMode'] ? this['addOptions']([`customSkins`], `skinsGroup`) : this[`addOptions`]([`customSkins`, 'vanillaSkins'], 'skinsGroup'), this[`addOptions`](['optimizedFood', `autoHideFood`, 'autoHideFoodOnZoom', `rainbowFood`], `foodGroup`), this[`addOptions`]([`myCustomColor`, `myTransparentSkin`, `transparentSkins`, `transparentCells`, `transparentViruses`], `transparencyGroup`), this[`addOptions`]([`showGrid`, 'showBgSectors', `showMapBorders`], 'gridGroup'), this[`addOptions`]([`disableChat`, `chatSounds`, `chatEmoticons`, 'showChatImages', `showChatVideos`, `showChatBox`], `chatGroup`), this['addOptions'](['showMiniMap', `showMiniMapGrid`, `showMiniMapGuides`, `showMiniMapGhostCells`, 'oneColoredTeammates'], `miniMapGroup`), this[`addOptions`]([`oppColors`, `oppRings`, `virColors`, `splitRange`, 'virusesRange', `cursorTracking`, 'teammatesInd', `showGhostCells`], 'helpersGroup'), this[`addOptions`]([`mouseSplit`, `mouseFeed`, 'mouseInvert'], `mouseGroup`), this[`addOptions`]([`showTop5`, 'showTargeting', `showLbData`, 'centeredLb', `normalLb`, `fpsAtTop`], `hudGroup`), this[`addOptions`](['showStats', `showStatsMass`, `showStatsSTE`, 'showStatsN16', `showStatsFPS`, `showTime`], `statsGroup`), this['protocolMode'] || (this[`addOptions`]([`blockPopups`], `extrasGroup`), moreogarset(`#noSkins, #noColors, #skipStats, #showQuest`)[`addClass`](`js-switch-vanilla`), moreogarset(`.skinsGroup h5`)['after'](`<label class=\"noSkins\">` + ogarcomms[`noSkins`] + ' </label>'), moreogarset(`#noSkins`)[`appendTo`](moreogarset(`.noSkins`)), moreogarset(`.transparencyGroup h5`)[`after`](`<label class=\"noColors\">` + ogarcomms[`noColors`] + ` </label>`), moreogarset(`#noColors`)[`appendTo`](moreogarset(`.noColors`)), moreogarset(`.extrasGroup h5`)[`after`](`<label class=\"skipStats\">` + ogarcomms[`skipStats`] + ' </label>'), moreogarset(`#skipStats`)[`appendTo`](moreogarset(`.skipStats`)), moreogarset(`.skipStats`)[`after`](`<label class=\"showQuest\">` + ogarcomms[`showQuest`] + ' </label>'), moreogarset(`#showQuest`)['appendTo'](moreogarset(`.showQuest`)), moreogarset(`#options`)['remove'](), moreogarset(`#settingsChoice`)[`appendTo`](moreogarset(`.extrasGroup`))[`addClass`](`select-wrapper`)), this[`addSliderBox`](`.animationGroup`, 'animation', 100, 200, 1), this[`addSliderBox`]('.zoomGroup', `zoomSpeedValue`, 0.75, 0.99, 0.01), moreogarset(`#og-settings`)[`append`](`<button class=\"btn btn-block btn-success btn-export\">` + ogarcomms[`exportImport`] + `</button>`), moreogarset(`#og-settings`)[`append`](`<div class=\"restore-settings\"><a href=\"#\">` + ogarcomms[`restoreSettings`] + '</a></div>'), moreogarset(`#music`)[`append`](`<div class=\"agario-panel radio-panel\"><h5 class=\"menu-main-color\">Radio (` + ogarcomms[`thanks`] + `)</h5><audio src=\"http://frshoutcast.comunicazion.eu:8815/;\" controls></audio><span class=\"playlist\"><span class=\"ogicon-file-music\"></span> <a href=\"http://frshoutcast.comunicazion.eu:8815/played.html?sid=1\" target=\"_blank\">` + ogarcomms[`playlist`] + `</a></span></div>`), moreogarset(`#music`)[`append`](`<div class=\"agario-panel sounds-panel\"><h5 class=\"menu-main-color\">` + ogarcomms[`sounds`] + `</h5></div>`), moreogarset(`#music`)[`append`](`<div class=\"agario-panel ogario-yt-panel\"><h5 class=\"menu-main-color\">Team OGARio (tag: Ⓜ)</h5><div class=\"g-ytsubscribe\" data-channelid=\"UCaWiPNJWnhzYDrBQoXokn6w\" data-layout=\"full\" data-theme=\"dark\" data-count=\"default\"></div></div>`), this[`addInputBox`](`.sounds-panel`, `messageSound`, `Sound URL`, `setMessageSound`), this[`addInputBox`]('.sounds-panel', `commandSound`, 'Sound URL', 'setCommandSound'), moreogarset(`body`)[`append`]('<div id=\"overlays-hud\" data-gamemode=\":ffa\"><div id=\"stats-hud\" class=\"hud stats-hud-color\"></div> <div id=\"top5-hud\" class=\"hud\"><h5 class=\"hud-main-color\">Team top <span class=\"team-top\">5</span></h5><div class=\"hud-main-color team-top-menu\"><a href=\"#\" data-limit=\"5\" class=\"team-top-limit active\">5</a> | <a href=\"#\" data-limit=\"10\" class=\"team-top-limit\">10</a> | <a href=\"#\" data-limit=\"100\" class=\"team-top-limit\">100</a></div><ol id=\"top5-pos\"></ol><div id=\"top5-total\"><span class=\"hud-main-color ogicon-users\"></span> ' + ogarcomms[`totalPartyPlayers`] + `: <span id=\"top5-total-players\" class=\"top5-mass-color\">0</span><br><span class=\"hud-main-color ogicon-pacman\"></span> ` + ogarcomms[`totalPartyMass`] + ': <span id=\"top5-total-mass\" class=\"top5-mass-color\">0</span></div></div> <div id=\"time-hud\" class=\"hud time-hud-color\"></div> <div id=\"pause-hud\" class=\"hud\">' + ogarcomms[`pause`] + `</div> <div id=\"leaderboard-hud\" class=\"hud-b\"><h4 class=\"hud-main-color\">legendmod.ml</h4><div id=\"leaderboard-data\"></div><div id=\"leaderboard-positions\"></div></div> <div id=\"btl-leaderboard-hud\"><div class=\"hud hud-c\"><span id=\"btl-players-status\">Players ready</span>: <span id=\"btl-players-count\">0</span></div></div> <div id=\"minimap-hud\" class=\"hud-b\"><canvas id=\"minimap-sectors\"></canvas><canvas id=\"minimap\"></canvas></div><div id=\"target-hud\" class=\"hud\"><div id=\"target-player\"><span id=\"target-skin\"><img src=\"https://cdn.ogario.ovh/static/img/blank.png\" alt=\"\"> </span><span id=\"target-nick\"></span> <span id=\"target-status\" class=\"hud-main-color\">[` + ogarcomms[`targetNotSet`] + `]</span></div><div id=\"target-summary\"></div></div><div id=\"target-panel-hud\" class=\"hud\"><a href=\"#\" id=\"set-targeting\" class=\"ogicon-target\"></a><a href=\"#\" id=\"set-private-minimap\" class=\"ogicon-location2\"></a><a href=\"#\" id=\"cancel-targeting\" class=\"ogicon-cancel-circle\"></a><a href=\"#\" id=\"change-target\" class=\"ogicon-arrow-right\"></a></div> <div id=\"quest-hud\" class=\"hud\"></div> <div id=\"btl-hud\" class=\"hud\"></div></div>`), moreogarset(`body`)[`append`](`<ul id=\"messages\"></ul>`), moreogarset(`body`)['append'](`<div id=\"message-box\"><div id=\"chat-emoticons\"></div><div id=\"message-menu\"><a href=\"#\" class=\"chat-sound-notifications ogicon-volume-high\"></a><a href=\"#\" class=\"chat-active-users ogicon-user-check\"></a><a href=\"#\" class=\"chat-muted-users ogicon-user-minus\"></a><a href=\"#\" class=\"show-chat-emoticons ogicon-smile\"></a></div><input type=\"text\" id=\"message\" class=\"form-control\" placeholder=\"` + ogarcomms[`enterChatMsg`] + '...\" maxlength=\"80\"></div>'), moreogarset(`body`)[`append`](`<div id=\"chat-box\"></div>`), ogarparsedemoticons) ogarparsedemoticons[`hasOwnProperty`](ogarsettings) && moreogarset(`#chat-emoticons`)[`append`](`<img src=\"https://cdn.ogario.ovh/static/emoticons/` + ogarparsedemoticons[ogarsettings] + `\" alt=\"` + ogarsettings + `\" class=\"emoticon\">`);
                    moreogarset(`body`)[`append`](`<div id=\"exp-imp\"><div id=\"exp-imp-menu\"><button id=\"close-exp-imp\" class=\"btn btn-danger\">` + ogarcomms[`close`] + `</button></div><div id=\"exp-imp-settings\"></div></div>`), moreogarset('#exp-imp-settings')[`append`](`<h1>` + ogarcomms[`exportSettings`] + `</h1><h2>` + ogarcomms[`exportInfo`] + `</h2>`), this[`addOption`](`#exp-imp-settings`, `export-ogarioCommands`, ogarcomms[`commands`], !0), this['addOption'](`#exp-imp-settings`, `export-ogarioHotkeys`, ogarcomms[`hotkeys`], !0), this['addOption'](`#exp-imp-settings`, `export-ogarioPlayerProfiles`, ogarcomms['profiles'], !0), this[`addOption`](`#exp-imp-settings`, `export-ogarioSettings`, ogarcomms['settings'], !0), this[`addOption`](`#exp-imp-settings`, `export-ogarioThemeSettings`, ogarcomms['theme'], !0), moreogarset(`#exp-imp-settings`)[`append`]('<textarea id=\"export-settings\" class=\"form-control\" rows=\"14\" cols=\"100\" spellcheck=\"false\" readonly /><button id=\"export-settings-btn\" class=\"btn btn-block btn-success\">' + ogarcomms[`exportSettings`] + '</button>'), moreogarset(`#exp-imp-settings`)['append']('<h1>' + ogarcomms[`importSettings`] + `</h1><h2>` + ogarcomms[`importInfo`] + `</h2>`), this[`addOption`](`#exp-imp-settings`, `import-ogarioCommands`, ogarcomms[`commands`], !0), this[`addOption`](`#exp-imp-settings`, `import-ogarioHotkeys`, ogarcomms[`hotkeys`], !0), this[`addOption`](`#exp-imp-settings`, 'import-ogarioPlayerProfiles', ogarcomms[`profiles`], !0), this[`addOption`](`#exp-imp-settings`, `import-ogarioSettings`, ogarcomms[`settings`], !0), this[`addOption`](`#exp-imp-settings`, 'import-ogarioThemeSettings', ogarcomms['theme'], !0), moreogarset('#exp-imp-settings')['append']('<textarea id=\"import-settings\" class=\"form-control\" rows=\"14\" cols=\"100\" spellcheck=\"false\" /><button id=\"import-settings-btn\" class=\"btn btn-block btn-success\">' + ogarcomms[`importSettings`] + `</button>`), csssettings && csssettings[`setThemeMenu`]();
                    for (var more2ogarset = 0; more2ogarset < ogario1PlayerProfiles[`length`]; more2ogarset++) moreogarset(`#skins`)[`append`](`<div class=\"skin-box\"><a href=\"#profile-` + more2ogarset + `\" id=\"profile-` + more2ogarset + `\" data-profile=\"` + more2ogarset + `\"></a></div>`), this['setSkinPreview'](ogario1PlayerProfiles[more2ogarset]['skinURL'], `profile-` + more2ogarset), more2ogarset == this[`selectedProfile`] && moreogarset(`#profile-` + more2ogarset)[`addClass`]('selected');
                },
                'setUI': function() {
                    var ogarsettings = this;
                    moreogarset(document)['on'](`click`, '.menu-tabs a', function(more2ogarset) {
                        more2ogarset[`preventDefault`](), ogarsettings[`switchMenuTabs`](moreogarset(this), `menu-panel`);
                    }), moreogarset(document)['on']('click', `.submenu-tabs a`, function(more2ogarset) {
                        more2ogarset[`preventDefault`](), ogarsettings['switchMenuTabs'](moreogarset(this), `submenu-panel`);
                    }), moreogarset(document)['on'](`click`, `.quick-menu`, function(more2ogarset) {
                        more2ogarset[`preventDefault`](), ogario1Settings[`showQuickMenu`] = !ogario1Settings[`showQuickMenu`], ogarsettings[`saveSettings`](ogario1Settings, `ogarioSettings`), ogarsettings[`setShowQuickMenu`]();
                    }), moreogarset(document)['on'](`click`, `.quick-skins`, function(more2ogarset) {
                        more2ogarset[`preventDefault`](), ogario1Settings['showSkinsPanel'] = !ogario1Settings[`showSkinsPanel`], ogarsettings[`saveSettings`](ogario1Settings, 'ogarioSettings'), ogarsettings[`setShowSkinsPanel`]();
                    }), moreogarset(document)['on'](`change`, '#region', function() {
                        ogarsettings[`region`] = this['value'];
                    }), moreogarset(document)['on'](`change`, `#gamemode`, function() {
                        var more2ogarset = this[`value`];
                        ':party' !== more2ogarset && ogarsettings[`leaveParty`](), ogarsettings[`gameMode`] = ogarcanvas['gameMode'] = more2ogarset, ogarsettings[`setQuest`]();
                    }), moreogarset(document)['on'](`change`, `#quality`, function() {
                        ogarsettings[`getQuality`](this[`value`]), ogarhusettings();
                    }), moreogarset(document)['on'](`input`, '#skin', function() {
                        var more2ogarset = this[`value`];
                        ogarsettings[`setSkinPreview`](more2ogarset, `skin-preview`), ogarsettings[`setSkinPreview`](more2ogarset, `profile-` + ogarsettings[`selectedProfile`]);
                    }), moreogarset(document)['on'](`click`, `#skins a`, function(more2ogarset) {
                        more2ogarset[`preventDefault`](), ogarsettings[`selectProfile`](moreogarset(this)['attr'](`data-profile`));
                    }), moreogarset(document)['on'](`click`, `#prev-profile`, function() {
                        ogarsettings[`prevProfile`]();
                    }), moreogarset(document)['on'](`click`, `#next-profile`, function() {
                        ogarsettings[`nextProfile`]();
                    }), moreogarset(document)['on'](`click`, `#stream-mode`, function() {
                        ogario1Settings[`streamMode`] = !ogario1Settings[`streamMode`], ogarsettings[`saveSettings`](ogario1Settings, `ogarioSettings`), ogarsettings[`setStreamMode`]();
                    }), moreogarset(document)['on'](`click`, `#hide-url`, function() {
                        ogario1Settings[`hideSkinUrl`] = !ogario1Settings[`hideSkinUrl`], ogarsettings[`saveSettings`](ogario1Settings, `ogarioSettings`), ogarsettings[`setHideSkinUrl`]();
                    }), moreogarset(document)['on']('click', `.btn-server-info`, function() {
                        moreogarset(`#server-info`)[`toggle`]();
                    }), moreogarset(document)['on']('click', `#server-connect`, function() {
                        ogarsettings[`gameServerConnect`](moreogarset('#server-ws')[`val`]());
                    }), moreogarset(document)['on'](`click`, `#server-reconnect`, function() {
                        ogarsettings[`gameServerReconnect`]();
                    }), moreogarset(document)['on'](`click`, `#server-join`, function() {
                        ogarsettings[`gameServerJoin`](moreogarset(`#server-token`)[`val`]());
                    }), moreogarset(document)['on'](`change`, `#og-options input[type=\'checkbox\']`, function() {
                        var more2ogarset = moreogarset(this);
                        ogarsettings[`setSettings`](more2ogarset['attr']('id'), more2ogarset[`prop`](`checked`));
                    }), moreogarset(document)['on'](`change`, '.js-switch-vanilla', function() {
                        var more2ogarset = moreogarset(this),
                            more3ogarset = more2ogarset[`attr`]('id');
                        void 0 !== ogarsettings[more3ogarset] && (ogarsettings[more3ogarset] = more2ogarset['prop'](`checked`), `noSkins` === more3ogarset && (ogarcanvas['showCustomSkins'] = !ogarsettings[`noSkins`]), `showQuest` === more3ogarset && ogarsettings[`setQuest`]());
                    }), moreogarset(document)['on'](`click`, `#og-settings .restore-settings a`, function(more2ogarset) {
                        more2ogarset['preventDefault'](), ogarsettings[`restoreSettings`]();
                    }), moreogarset(document)['on'](`click`, `#og-settings .btn-export`, function(more2ogarset) {
                        more2ogarset['preventDefault'](), ogarsettings['exportSettings'](), moreogarset('#exp-imp')[`fadeIn`](500), moreogarset(`#exp-imp-settings, #export-settings`)[`perfectScrollbar`](`update`);
                    }), moreogarset(document)['on'](`click`, '#close-exp-imp', function(ogarsettings) {
                        ogarsettings[`preventDefault`](), moreogarset(`#exp-imp`)[`fadeOut`](500);
                    }), moreogarset(document)['on'](`focus`, `#export-settings`, function() {
                        moreogarset(this)[`select`]();
                    }), moreogarset(document)['on'](`click`, `#export-settings-btn`, function(more2ogarset) {
                        more2ogarset[`preventDefault`](), ogarsettings[`exportSettings`]();
                    }), moreogarset(document)['on']('click', '#import-settings-btn', function(more2ogarset) {
                        more2ogarset['preventDefault'](), ogarsettings[`importSettings`]();
                    }), moreogarset(document)['on'](`click`, '#unblock-popups', function(more2ogarset) {
                        more2ogarset['preventDefault'](), ogarsettings['unblockPopups']();
                    }), moreogarset(document)['on'](`click`, '#openfl-overlay.disabler', function() {
                        ogario1Settings['blockPopups'] && ogarsettings[`blockPopups`]();
                    }), moreogarset(document)['on'](`click`, `#openfl-content`, function() {
                        if (ogario1Settings['blockPopups']) {
                            var more2ogarset = moreogarset(this);
                            setTimeout(function() {
                                more2ogarset['is'](`:visible`) || ogarsettings[`blockPopups`]();
                            }, 1000);
                        }
                    }), moreogarset(document)['on']('click', `.quick-shop`, function(ogarcanvas) {
                        ogarcanvas[`preventDefault`](), ogarsettings[`unblockPopups`](), more2ogarset['MC'] && more2ogarset['MC'][`openShop`] && more2ogarset['MC'][`openShop`]();
                    }), moreogarset(document)['on'](`click`, `.quick-free-coins`, function(ogarcanvas) {
                        ogarcanvas[`preventDefault`](), ogarsettings[`unblockPopups`](), more2ogarset['MC'] && more2ogarset['MC'][`showFreeCoins`] && more2ogarset['MC'][`showFreeCoins`]();
                    }), moreogarset(document)['on']('click', `.quick-free-gifts`, function(ogarcanvas) {
                        ogarcanvas[`preventDefault`](), ogarsettings['unblockPopups'](), more2ogarset['MC'] && more2ogarset['MC'][`showGifting`] && more2ogarset['MC'][`showGifting`]();
                    }), moreogarset(document)['on'](`click`, `.quick-quests`, function(ogarcanvas) {
                        ogarcanvas[`preventDefault`](), ogarsettings[`unblockPopups`](), more2ogarset['MC'] && more2ogarset['MC'][`showQuests`] && more2ogarset['MC'][`showQuests`]();
                    }), moreogarset(document)['on']('click', `#set-targeting`, function(more2ogarset) {
                        more2ogarset[`preventDefault`](), ogarsettings['setTargeting']();
                    }), moreogarset(document)['on']('click', `#cancel-targeting`, function(more2ogarset) {
                        more2ogarset[`preventDefault`](), ogarsettings[`cancelTargeting`]();
                    }), moreogarset(document)['on'](`click`, `#set-private-minimap`, function(more2ogarset) {
                        more2ogarset[`preventDefault`](), ogarsettings[`setPrivateMiniMap`]();
                    }), moreogarset(document)['on']('click', `#change-target`, function(more2ogarset) {
                        more2ogarset['preventDefault'](), ogarsettings[`changeTarget`]();
                    }), moreogarset(document)['on'](`click`, `.team-top-limit`, function(more2ogarset) {
                        more2ogarset[`preventDefault`]();
                        var ogarcanvas = moreogarset(this),
                            more3ogarset = parseInt(ogarcanvas[`attr`](`data-limit`));
                        more3ogarset && (ogarsettings[`setTop5limit`](more3ogarset), ogarsettings[`displayTop5`](), moreogarset(`.team-top`)['text'](more3ogarset), moreogarset(`.team-top-limit`)[`removeClass`]('active'), ogarcanvas['addClass'](`active`));
                    }), moreogarset(document)['on'](`click`, '#top5-pos .set-target', function(more2ogarset) {
                        more2ogarset[`preventDefault`](), ogarsettings[`setTarget`](parseInt(moreogarset(this)[`attr`](`data-user-id`)));
                    }), moreogarset(document)['on'](`click`, `.mute-user`, function(more2ogarset) {
                        more2ogarset[`preventDefault`](), ogarsettings[`muteChatUser`](parseInt(moreogarset(this)[`attr`](`data-user-id`)));
                    }), moreogarset(document)['on']('click', `.btn-mute-user`, function() {
                        var more2ogarset = moreogarset(this);
                        ogarsettings[`muteChatUser`](parseInt(more2ogarset['attr'](`data-user-id`))), more2ogarset[`removeClass`](`btn-red btn-mute-user`)[`addClass`](`btn-green btn-unmute-user`)[`text`](ogarcomms[`unmute`]);
                    }), moreogarset(document)['on'](`click`, `.btn-unmute-user`, function() {
                        var more2ogarset = moreogarset(this);
                        ogarsettings[`unmuteChatUser`](parseInt(more2ogarset[`attr`](`data-user-id`))), more2ogarset[`removeClass`](`btn-green btn-unmute-user`)['addClass']('btn-red btn-mute-user')['text'](ogarcomms[`mute`]);
                    }), moreogarset(document)['on'](`click`, '.chat-sound-notifications', function(more2ogarset) {
                        more2ogarset['preventDefault'](), ogario1Settings[`chatSounds`] = !ogario1Settings[`chatSounds`], ogarsettings['saveSettings'](ogario1Settings, `ogarioSettings`), ogarsettings[`setChatSoundsBtn`]();
                    }), moreogarset(document)['on'](`click`, `.chat-active-users`, function(more2ogarset) {
                        more2ogarset[`preventDefault`](), ogarsettings[`displayChatActiveUsers`]();
                    }), moreogarset(document)['on']('click', `.chat-muted-users`, function(more2ogarset) {
                        more2ogarset[`preventDefault`](), ogarsettings[`displayChatMutedUsers`]();
                    }), moreogarset(document)['on'](`click`, `.show-chat-emoticons`, function(ogarsettings) {
                        ogarsettings['preventDefault']();
                        var more2ogarset = moreogarset(this),
                            ogarcanvas = moreogarset(`#chat-emoticons`);
                        ogarcanvas[`toggle`](), ogarcanvas['is'](`:visible`) ? more2ogarset[`addClass`](`active`) : (more2ogarset[`removeClass`]('active'), moreogarset(`#message`)[`focus`]());
                    }), moreogarset(document)['on']('click', `#chat-emoticons .emoticon`, function() {
                        var ogarsettings = moreogarset(this)[`attr`](`alt`),
                            more2ogarset = moreogarset(`#message`),
                            ogarcanvas = more2ogarset[`val`]();
                        ogarcanvas[`length`] + ogarsettings[`length`] <= 80 && more2ogarset[`val`](ogarcanvas + ogarsettings), more2ogarset['focus']();
                    }), this['statsHUD'] = document[`getElementById`](`stats-hud`), this['activeParties'] = document['getElementById'](`active-parties`), this[`top5pos`] = document[`getElementById`](`top5-pos`), this[`top5totalMass`] = document[`getElementById`](`top5-total-mass`), this['top5totalPlayers'] = document[`getElementById`]('top5-total-players'), this[`leaderboardPositionsHUD`] = document['getElementById'](`leaderboard-positions`), this['leaderboardDataHUD'] = document['getElementById'](`leaderboard-data`), this[`timeHUD`] = document[`getElementById`](`time-hud`), this[`questHUD`] = document[`getElementById`](`quest-hud`), moreogarset(`#canvas`)[`bind`](`contextmenu`, function() {
                        return !1;
                    }), moreogarset(document)['on']('mouseup', `.btn`, function() {
                        $(this)[`blur`]();
                    }), moreogarset(`[data-toggle=\'tab-tooltip\']`)[`tooltip`]({
                        'trigger': `hover`
                    }), moreogarset('.submenu-panel, #chat-box, #exp-imp-settings, #export-settings, #import-settings')[`perfectScrollbar`]({
                        'suppressScrollX': !0
                    }), Array[`prototype`]['slice'][`call`](document[`querySelectorAll`](`.js-switch`))[`forEach`](function(ogarsettings) {
                        new Switchery(ogarsettings, {
                            'color': ogario1ThemeSettings[`menuMainColor`],
                            'size': `small`
                        });
                    }), moreogarset('input[type=\'range\']')[`rangeslider`]({
                        'polyfill': !1
                    }), toastr[`options`] = {
                        'newestOnTop': !1,
                        'positionClass': `toast-bottom-left`,
                        'timeOut': 15000
                    };
                },
                'switchMenuTabs': function(ogarsettings, more2ogarset) {
                    var ogarcanvas = ogarsettings[`parent`]();
                    if (`menu-panel` === more2ogarset) {
                        if (ogarsettings[`hasClass`](`hotkeys-link`)) return;
                        ogarcanvas['hasClass'](`profile-tab`) && this[`setBlockPopups`]();
                    }
                    ogarsettings[`addClass`](`active`), ogarcanvas[`addClass`](`active`), ogarcanvas[`siblings`]()[`removeClass`](`active`), ogarcanvas[`siblings`]()[`find`]('a')[`removeClass`](`active`);
                    var more3ogarset = ogarsettings[`attr`](`href`);
                    if (`submenu-panel` === more2ogarset) {
                        var more4ogarset = moreogarset(more3ogarset)[`parent`]()[`attr`]('id');
                        moreogarset('#' + more4ogarset + ` .submenu-panel`)[`not`](more3ogarset)[`css`](`display`, `none`);
                    } else moreogarset(`.menu-panel`)[`not`](more3ogarset)[`css`]('display', `none`);
                    moreogarset(more3ogarset)[`fadeIn`](1000), ogarhusettings(), moreogarset('.submenu-panel')[`perfectScrollbar`](`update`);
                },
                'getDefaultSettings': function() {
                    if (this['noSkins'] = moreogarset(`#noSkins`)['prop'](`checked`), this['noColors'] = moreogarset(`#noColors`)[`prop`](`checked`), this[`skipStats`] = moreogarset(`#skipStats`)[`prop`](`checked`), this[`showQuest`] = moreogarset(`#showQuest`)[`prop`](`checked`), ogarcanvas[`showCustomSkins`] = !this[`noSkins`], null !== more2ogarset['localStorage']['getItem'](`scale_setting`)) {
                        var ogarsettings = JSON['parse'](more2ogarset[`localStorage`][`getItem`](`scale_setting`));
                        this[`setCanvasScale`](ogarsettings);
                    } else {
                        var more3ogarset = moreogarset('#quality')[`val`]();
                        this[`getQuality`](more3ogarset);
                    }
                    null !== more2ogarset[`localStorage`][`getItem`](`location`) ? (this[`region`] = more2ogarset[`localStorage`]['getItem'](`location`), moreogarset(`#region`)[`val`](this[`region`]), more2ogarset['MC'] && more2ogarset['MC'][`setRegion`] && more2ogarset['MC'][`setRegion`](this[`region`])) : this[`region`] = moreogarset(`#region`)[`val`](), this[`setParty`](), `:party` === this['gameMode'] && more2ogarset[`location`][`hash`] && moreogarset(`#join-party-btn-2`)['click'](), Array['prototype']['slice'][`call`](document[`querySelectorAll`](`.js-switch-vanilla`))['forEach'](function(ogarsettings) {
                        new Switchery(ogarsettings, {
                            'color': ogario1ThemeSettings[`menuMainColor`],
                            'size': `small`
                        });
                    }), moreogarset(`#nick`)[`val`](ogarcopythelb[`nick`])[`blur`](), moreogarset(`#noNames`)[`prop`](`checked`, !ogario1Settings[`noNames`]), moreogarset(`#showMass`)['prop'](`checked`, ogario1Settings[`showMass`]), this[`unlockButtons`](), this['setAutoResp'](), this[`setQuest`]();
                },
                'getQuality': function(ogarsettings) {
                    var ogarcanvas = 1;
                    switch ('devicePixelRatio' in more2ogarset && (ogarcanvas = more2ogarset[`devicePixelRatio`]), ogarsettings) {
                        case `High`:
                            this[`setCanvasScale`](1);
                            break;
                        case `Medium`:
                            this[`setCanvasScale`](0.9);
                            break;
                        case `Low`:
                            this[`setCanvasScale`](0.75);
                            break;
                        case `VeryLow`:
                            this[`setCanvasScale`](0.5);
                            break;
                        default:
                            this[`setCanvasScale`](ogarcanvas);
                    }
                },
                'setCanvasScale': function(ogarsettings) {
                    this['canvasScale'] = ogarsettings, ogarcanvas[`canvasScale`] = ogarsettings;
                },
                'setStreamMode': function() {
                    ogario1Settings[`streamMode`] ? (moreogarset(`#stream-mode`)[`addClass`](`ogicon-eye-blocked`), moreogarset('#clantag, #nick, #party-token')[`addClass`](`stream-mode`)) : (moreogarset('#stream-mode')[`removeClass`](`ogicon-eye-blocked`), moreogarset(`#clantag, #nick, #party-token`)[`removeClass`]('stream-mode'));
                },
                'setHideSkinUrl': function() {
                    ogario1Settings[`hideSkinUrl`] ? (moreogarset('#hide-url')[`addClass`]('ogicon-eye-blocked'), moreogarset(`#skin`)[`addClass`](`hide-url`)) : (moreogarset(`#hide-url`)[`removeClass`](`ogicon-eye-blocked`), moreogarset(`#skin`)['removeClass'](`hide-url`));
                },
                'setShowQuickMenu': function() {
                    ogario1Settings[`showQuickMenu`] ? moreogarset(`#quick-menu`)[`fadeIn`](500) : moreogarset(`#quick-menu`)[`fadeOut`](500);
                },
                'setShowSkinsPanel': function() {
                    ogario1Settings[`showSkinsPanel`] ? moreogarset(`#skins-panel`)[`fadeIn`](500) : moreogarset(`#skins-panel`)[`fadeOut`](500);
                },
                'unlockButtons': function() {
                    moreogarset(`.btn-play, .btn-play-guest, .btn-login-play, .btn-spectate`)[`prop`](`disabled`, !1);
                },
                'setMainButtons': function() {
                    var ogarsettings = this;
                    moreogarset(document)['on'](`click`, '.btn-play, .btn-play-guest', function() {
                        ogarsettings['onPlay']();
                    }), moreogarset(document)['on'](`click`, '.btn-spectate', function() {
                        ogarsettings[`onSpectate`]();
                    }), moreogarset(document)['on'](`click`, `#create-party-btn-2`, function() {
                        ogarsettings[`onCreate`]();
                    }), moreogarset(document)['on'](`click`, `#join-party-btn-2`, function() {
                        ogarsettings[`skipServerData`] = !0, ogarsettings[`joinParty`](), ogarsettings['onJoin']();
                    }), moreogarset(document)['on'](`click`, `#statsContinue2`, function() {
                        moreogarset('#stats, #main-panel')[`toggle`]();
                    });
                },
                'play': function() {
                    if (this[`setPlayerSettings`](), this[`setParty`](), this[`isSocketOpen`]()) this[`sendPartyData`]();
                    else {
                        this[`connect`]();
                        var ogarsettings = this;
                        setTimeout(function() {
                            ogarsettings[`sendPartyData`]();
                        }, 1000);
                    }
                },
                'onPlay': function() {
                    this[`play`](), this['hideMenu'](), more2ogarset[`addKeyListeners`] && more2ogarset[`addKeyListeners`](), ogario1Settings[`autoHideFood`] && (ogarcanvas[`showFood`] = !0), more2ogarset['ga'] && more2ogarset['ga'](`create`, `UA-67142685-2`, `auto`, `ogarioTracker`), more2ogarset['ga'] && more2ogarset['ga'](`ogarioTracker.send`, `pageview`);
                },
                'onSpectate': function() {
                    this[`onJoin`](), this[`sendPlayerJoin`](), this[`hideMenu`](), more2ogarset[`addKeyListeners`] && more2ogarset['addKeyListeners'](), ogario1Settings[`autoHideFood`] && (ogarcanvas[`showFood`] = !1);
                },
                'join': function() {
                    this[`setParty`](), this[`setPlayerSettings`](), this[`sendPartyData`](), this['sendPlayerDeath']();
                },
                'onJoin': function() {
                    if (this[`setParty`](), this[`isSocketOpen`]()) this[`join`]();
                    else {
                        this[`connect`]();
                        var ogarsettings = this;
                        setTimeout(function() {
                            ogarsettings[`join`](), ogarsettings[`sendPlayerJoin`]();
                        }, 1000);
                    }
                },
                'create': function() {
                    if (this['setParty'](), this[`partyToken`]) this[`onJoin`]();
                    else {
                        var ogarsettings = this;
                        setTimeout(function() {
                            ogarsettings[`create`]();
                        }, 100);
                    }
                },
                'onCreate': function() {
                    this[`setParty`](), `:party` === this[`gameMode`] && this['partyToken'] ? this[`gameServerReconnect`]() : this['createParty'](), this[`create`]();
                },
                'onPlayerSpawn': function() {
                    if (ogarcanvas[`play`] = !0, ogarcanvas[`playerColor`]) return this['sendPlayerSpawn'](), void this['cacheCustomSkin'](ogarcopythelb[`nick`], ogarcanvas['playerColor'], ogarcopythelb[`skinURL`]);
                    var ogarsettings = this;
                    setTimeout(function() {
                        ogarsettings[`onPlayerSpawn`]();
                    }, 100);
                },
                'onPlayerDeath': function() {
                    ogarcanvas[`play`] = !1, ogarcanvas['playerColor'] = null, ogarcanvas[`foodIsHidden`] = !1, ogarcanvas['playerMass'] = 0, ogarcanvas[`playerScore`] = 0, ogarcanvas[`playerSplitCells`] = 0, this[`showMenu`](300), this[`sendPlayerDeath`](), this[`updateDeathLocations`](ogarcanvas[`playerX`], ogarcanvas['playerY']), this[`unlockButtons`](), ogarcommando1(), this[`autoResp`]();
                },
                'setPlayerSettings': function() {
                    var ogarsettings = moreogarset(`#nick`)[`val`](),
                        more2ogarset = moreogarset(`#clantag`)[`val`](),
                        more3ogarset = moreogarset(`#skin`)['val'](),
                        more4ogarset = moreogarset(`#color`)[`val`]();
                    ogarcopythelb[`nick`] = ogarsettings, ogarcopythelb[`clanTag`] = more2ogarset[`trim`](), ogarcopythelb[`skinURL`] = this[`checkSkinURL`](more3ogarset['trim']()), 7 == more4ogarset[`length`] && (ogarcopythelb[`color`] = more4ogarset), ogarcopythelb[`clanTag`][`length`] > 0 && (ogarcanvas[`clanTag`] = ogarcopythelb[`clanTag`]), ogario1PlayerProfiles[this[`selectedProfile`]][`nick`] = ogarcopythelb[`nick`], ogario1PlayerProfiles[this[`selectedProfile`]][`clanTag`] = ogarcopythelb[`clanTag`], ogario1PlayerProfiles[this[`selectedProfile`]][`skinURL`] = ogarcopythelb[`skinURL`], ogario1PlayerProfiles[this[`selectedProfile`]][`color`] = ogarcopythelb[`color`], this[`saveSettings`](ogario1PlayerProfiles, `ogarioPlayerProfiles`);
                },
                'loadSkin': function(ogarsettings, more2ogarset) {
                    var ogarcanvas = this;
                    ogarsettings[more2ogarset] = new Image(), ogarsettings[more2ogarset][`crossOrigin`] = `Anonymous`, ogarsettings[more2ogarset]['onload'] = function() {
                        this[`complete`] && this[`width`] && this[`height`] && this[`width`] <= 2000 && this['height'] <= 2000 && (ogarcanvas['cacheQueue'][`push`](more2ogarset), 1 == ogarcanvas[`cacheQueue`][`length`] && ogarcanvas[`cacheSkin`](ogarcanvas['customSkinsCache']));
                    }, ogarsettings[more2ogarset]['src'] = more2ogarset;
                },
                'cacheSkin': function(ogarsettings) {
                    //console.log(ogarsettings);  //////// return the image src
                    if (0 != this['cacheQueue'][`length`]) {
                        var more2ogarset = this[`cacheQueue`]['shift']();
                        if (more2ogarset) {
                            console.log(more2ogarset);
                            var ogarcanvas = document[`createElement`](`canvas`);
                            ogarcanvas[`width`] = 512, ogarcanvas[`height`] = 512;
                            var moreogarset = ogarcanvas[`getContext`]('2d');
                            moreogarset[`beginPath`](), moreogarset[`arc`](256, 256, 256, 0, 2 * Math['PI'], !1), moreogarset[`clip`](), moreogarset[`drawImage`](this[`customSkinsCache`][more2ogarset], 0, 0, 512, 512), this[`customSkinsCache`][more2ogarset + `_cached`] = new Image(), this[`customSkinsCache`][more2ogarset + `_cached`][`src`] = ogarcanvas[`toDataURL`](), ogarcanvas = null, this[`cacheSkin`](this[`customSkinsCache`]);
                        }
                    }
                },
                'cacheVanillaSkin': function(vanSkin) {
                    //console.log(ogarsettings);  //////// returns img scr of server/tag
                    //if (0 != this['cacheQueue'][`length`]) {
                    var more2ogarset = vanSkin;
                    if (more2ogarset) {
                        console.log(more2ogarset);
                        var ogarcanvas = document[`createElement`](`canvas`);
                        ogarcanvas[`width`] = 512, ogarcanvas[`height`] = 512;
                        var moreogarset = ogarcanvas[`getContext`]('2d');
                        moreogarset[`beginPath`](), moreogarset[`arc`](256, 256, 256, 0, 2 * Math['PI'], !1), moreogarset[`clip`](), moreogarset[`drawImage`](this[`customSkinsCache`][more2ogarset], 0, 0, 512, 512), this[`customSkinsCache`][more2ogarset + `_cached`] = new Image(), this[`customSkinsCache`][more2ogarset + `_cached`][`src`] = ogarcanvas[`toDataURL`](), ogarcanvas = null, this[`cacheSkin`](this[`customSkinsCache`]);
                        //}
                    }
                },
                'getCachedSkin': function(ogarsettings, more2ogarset) {
                    return ogarsettings[more2ogarset + `_cached`] && ogarsettings[more2ogarset + `_cached`][`complete`] && ogarsettings[more2ogarset + '_cached'][`width`] ? ogarsettings[more2ogarset + `_cached`] : null;
                },
                'cacheCustomSkin': function(ogarsettings, more2ogarset, ogarcanvas) {
                    if (ogarcanvas) {
                        var moreogarset = ':party' === this['gameMode'] ? ogarsettings + more2ogarset : ogarsettings;
                        if (moreogarset && (this[`customSkinsMap`][moreogarset] = ogarcanvas), this[`customSkinsCache`][`hasOwnProperty`](ogarcanvas)) return;
                        this['loadSkin'](this[`customSkinsCache`], ogarcanvas);
                    }
                },
                'checkSkinsMap': function(ogarsettings, more2ogarset) {
                    var ogarcanvas = `:party` === this['gameMode'] ? ogarsettings + more2ogarset : ogarsettings;
                    return !!this['customSkinsMap'][`hasOwnProperty`](ogarcanvas);
                },
                'getCustomSkin': function(ogarsettings, more2ogarset) {
                    if (!this[`checkSkinsMap`](ogarsettings, more2ogarset)) return null;
                    var ogarcanvas = `:party` === this[`gameMode`] ? ogarsettings + more2ogarset : ogarsettings;
                    return this[`getCachedSkin`](this[`customSkinsCache`], this['customSkinsMap'][ogarcanvas]);
                },
                'calculateMapSector': function(ogarsettings, more2ogarset, moreogarset = !1) {
                    if (!ogarcanvas['mapOffsetFixed']) return '';
                    var more3ogarset = moreogarset ? ogarcanvas[`mapOffsetX`] + ogarcanvas['mapOffset'] : ogarcanvas['mapOffset'],
                        more4ogarset = moreogarset ? ogarcanvas['mapOffsetY'] + ogarcanvas['mapOffset'] : ogarcanvas[`mapOffset`],
                        ogarbuffed = Math[`floor`]((more2ogarset + more4ogarset) / (ogarcanvas[`mapSize`] / ogario1ThemeSettings[`sectorsY`])),
                        ogarlanguage = Math[`floor`]((ogarsettings + more3ogarset) / (ogarcanvas[`mapSize`] / ogario1ThemeSettings[`sectorsX`]));
                    return ogarbuffed = ogarbuffed < 0 ? 0 : ogarbuffed >= ogario1ThemeSettings[`sectorsY`] ? ogario1ThemeSettings[`sectorsY`] - 1 : ogarbuffed, ogarlanguage = ogarlanguage < 0 ? 0 : ogarlanguage >= ogario1ThemeSettings[`sectorsX`] ? ogario1ThemeSettings[`sectorsX`] - 1 : ogarlanguage, String[`fromCharCode`](ogarbuffed + 65) + (ogarlanguage + 1);
                },
                'shortMassFormat': function(ogarsettings) {
                    return ogarsettings < 1000 ? ogarsettings : Math['round'](ogarsettings / 100) / 10 + 'k';
                },
                'updateDeathLocations': function(ogarsettings, more2ogarset) {
                    ogarcanvas[`mapOffsetFixed`] && (this[`deathLocations`]['push']({
                        'x': ogarsettings + ogarcanvas[`mapOffsetX`],
                        'y': more2ogarset + ogarcanvas[`mapOffsetY`]
                    }), 6 == this['deathLocations'][`length`] && this[`deathLocations`][`shift`](), this[`lastDeath`] = this[`deathLocations`][`length`] - 1);
                },
                'drawMiniMap': function() {
                    if (ogarcanvas[`mapOffsetFixed`]) {
                        var ogarsettings = ogario1ThemeSettings[`miniMapWidth`],
                            more2ogarset = ogario1ThemeSettings['miniMapTop'],
                            moreogarset = ogarsettings + more2ogarset,
                            more3ogarset = ogarsettings - 18,
                            more4ogarset = more2ogarset + 9.5;
                        this[`miniMap`] ? this[`miniMapCtx`][`clearRect`](0, 0, ogarsettings, moreogarset) : (this[`miniMap`] = document[`getElementById`](`minimap`), this[`miniMapCtx`] = this['miniMap'][`getContext`]('2d'), this['miniMapCtx'][`ogarioCtx`] = !0, this[`miniMap`][`width`] = ogarsettings, this[`miniMap`][`height`] = moreogarset), this[`miniMap`][`width`] != ogarsettings && (this[`miniMap`][`width`] = ogarsettings, this[`miniMap`][`height`] = moreogarset);
                        var ogarbuffed = more3ogarset / ogarcanvas[`mapSize`],
                            ogarlanguage = ogarcanvas[`mapOffsetX`] + ogarcanvas[`mapOffset`],
                            ogaractuallanguage = ogarcanvas[`mapOffsetY`] + ogarcanvas[`mapOffset`];
                        if (this['drawSelectedCell'](this[`miniMapCtx`]), this[`currentSector`] = this[`calculateMapSector`](ogarcanvas[`playerX`], ogarcanvas[`playerY`], !0), this[`miniMapCtx`]['globalAlpha'] = 1, this['miniMapCtx'][`font`] = ogario1ThemeSettings[`miniMapFontWeight`] + ' ' + (more2ogarset - 4) + `px ` + ogario1ThemeSettings['miniMapFontFamily'], this[`miniMapCtx`][`fillStyle`] = ogario1ThemeSettings[`miniMapSectorColor`], this[`miniMapCtx`][`fillText`](this['currentSector'], 10, more2ogarset), this['miniMapSectors'] || this[`drawMiniMapSectors`](ogario1ThemeSettings[`sectorsX`], ogario1ThemeSettings[`sectorsY`], more3ogarset, moreogarset, more4ogarset), this['miniMapCtx'][`save`](), this['miniMapCtx']['translate'](9.5, more4ogarset), ':battleroyale' === this[`gameMode`] && ogarfooddrawer && ogarfooddrawer[`drawBattleAreaOnMinimap`](this['miniMapCtx'], more3ogarset, more3ogarset, ogarbuffed, ogarlanguage, ogaractuallanguage), ogario1Settings[`showMiniMapGhostCells`]) {
                            var ogarcomms = ogarcanvas['ghostCells'];
                            this[`miniMapCtx`][`beginPath`]();
                            for (var ogario1Commands = 0; ogario1Commands < ogarcomms[`length`]; ogario1Commands++)
                                if (!ogarcomms[ogario1Commands][`inView`]) {
                                    var ogarparsedchars = ~~((ogarcomms[ogario1Commands]['x'] + ogarlanguage) * ogarbuffed),
                                        ogarparsedemoticons = ~~((ogarcomms[ogario1Commands]['y'] + ogaractuallanguage) * ogarbuffed);
                                    this[`miniMapCtx`]['moveTo'](ogarparsedchars, ogarparsedemoticons), this[`miniMapCtx`][`arc`](ogarparsedchars, ogarparsedemoticons, ~~(ogarcomms[ogario1Commands][`size`] * ogarbuffed), 0, this[`pi2`], !1);
                                } this[`miniMapCtx`]['fillStyle'] = ogario1ThemeSettings[`miniMapGhostCellsColor`], this[`miniMapCtx`][`globalAlpha`] = ogario1ThemeSettings[`miniMapGhostCellsAlpha`], this[`miniMapCtx`][`shadowColor`] = ogario1ThemeSettings[`miniMapGhostCellsColor`], this['miniMapCtx'][`shadowBlur`] = 10, this[`miniMapCtx`][`shadowOffsetX`] = 0, this['miniMapCtx'][`shadowOffsetY`] = 0, this[`miniMapCtx`]['fill'](), this[`miniMapCtx`][`globalAlpha`] = 1, this[`miniMapCtx`][`shadowBlur`] = 0;
                        }
                        if (ogario1Settings[`showMiniMapGuides`]) {
                            ogarparsedchars = Math[`round`]((ogarcanvas[`playerX`] + ogarlanguage) * ogarbuffed), ogarparsedemoticons = Math[`round`]((ogarcanvas[`playerY`] + ogaractuallanguage) * ogarbuffed);
                            this['miniMapCtx']['lineWidth'] = 1, this[`miniMapCtx`][`strokeStyle`] = ogario1ThemeSettings[`miniMapGuidesColor`], this[`miniMapCtx`][`beginPath`](), this[`miniMapCtx`][`moveTo`](ogarparsedchars, 0), this['miniMapCtx'][`lineTo`](ogarparsedchars, more3ogarset - 1), this[`miniMapCtx`][`moveTo`](0, ogarparsedemoticons), this[`miniMapCtx`][`lineTo`](more3ogarset - 1, ogarparsedemoticons), this[`miniMapCtx`][`stroke`]();
                        }
                        if (this[`miniMapCtx`][`beginPath`](), this[`miniMapCtx`][`arc`]((ogarcanvas[`playerX`] + ogarlanguage) * ogarbuffed, (ogarcanvas['playerY'] + ogaractuallanguage) * ogarbuffed, ogario1ThemeSettings[`miniMapMyCellSize`], 0, this[`pi2`], !1), this[`miniMapCtx`][`closePath`](), ogario1ThemeSettings[`miniMapMyCellStrokeSize`] > 0 && (this[`miniMapCtx`][`lineWidth`] = ogario1ThemeSettings[`miniMapMyCellStrokeSize`], this[`miniMapCtx`][`strokeStyle`] = ogario1ThemeSettings['miniMapMyCellStrokeColor'], this[`miniMapCtx`][`stroke`]()), this[`miniMapCtx`][`fillStyle`] = ogario1ThemeSettings['miniMapMyCellColor'], this['miniMapCtx'][`fill`](), this[`teamPlayers`][`length`])
                            for (ogario1Commands = 0; ogario1Commands < this[`teamPlayers`][`length`]; ogario1Commands++) this[`teamPlayers`][ogario1Commands][`drawPosition`](this[`miniMapCtx`], ogarcanvas['mapOffset'], ogarbuffed, this[`privateMiniMap`], this['targetID']);
                        if (this[`deathLocations`][`length`] > 0) {
                            ogarparsedchars = Math[`round`]((this['deathLocations'][this['lastDeath']]['x'] + ogarcanvas[`mapOffset`]) * ogarbuffed), ogarparsedemoticons = Math[`round`]((this[`deathLocations`][this[`lastDeath`]]['y'] + ogarcanvas['mapOffset']) * ogarbuffed);
                            var ogarsets1 = Math[`max`](ogario1ThemeSettings[`miniMapMyCellSize`] - 2, 4);
                            this[`miniMapCtx`][`lineWidth`] = 1, this[`miniMapCtx`][`strokeStyle`] = this[`deathLocations`][`length`] - 1 == this[`lastDeath`] ? ogario1ThemeSettings['miniMapDeathLocationColor'] : `#FFFFFF`, this[`miniMapCtx`][`beginPath`](), this['miniMapCtx'][`moveTo`](ogarparsedchars - ogarsets1, ogarparsedemoticons), this['miniMapCtx'][`lineTo`](ogarparsedchars + ogarsets1, ogarparsedemoticons), this[`miniMapCtx`][`moveTo`](ogarparsedchars, ogarparsedemoticons - ogarsets1), this['miniMapCtx'][`lineTo`](ogarparsedchars, ogarparsedemoticons + ogarsets1), this['miniMapCtx'][`stroke`]();
                        }
                        this[`miniMapCtx`]['restore']();
                    }
                },
                'drawMiniMapSectors': function(ogarsettings, more2ogarset, moreogarset, more3ogarset, more4ogarset) {
                    this['miniMapSectors'] = document[`getElementById`](`minimap-sectors`);
                    var ogarbuffed = this[`miniMapSectors`][`getContext`]('2d');
                    ogarbuffed[`ogarioCtx`] = !0, this[`miniMapSectors`]['width'] = moreogarset, this['miniMapSectors'][`height`] = more3ogarset, ogarbuffed[`fillStyle`] = '#FFFFFF', this[`dTok`](ogarbuffed, moreogarset - 1), ogarfooddrawer[`drawSectors`](ogarbuffed, ogarcanvas[`mapOffsetFixed`], ogarsettings, more2ogarset, 0.5, more4ogarset, moreogarset - 0.5, more3ogarset - 9.5, ogario1ThemeSettings['miniMapSectorsColor'], ogario1ThemeSettings[`miniMapSectorsColor`], 1, !1);
                },
                'resetMiniMapSectors': function() {
                    this[`miniMapSectors`] = null;
                },
                'drawSelectedCell': function(ogarsettings) {
                    ogarcanvas[`play`] && ogarcanvas[`playerSplitCells`] > 1 && (ogario1Settings[`splitRange`] || ogario1Settings['oppColors'] || ogario1Settings[`oppRings`] || ogario1Settings[`showStatsSTE`]) && (ogarsettings[`fillStyle`] = `#FFFFFF`, ogarsettings['globalAlpha'] = this[`selectBiggestCell`] ? 0.6 : 0.3, ogarsettings[`beginPath`](), ogarsettings['arc'](0x30, 15, 6, 0, this[`pi2`], !1), ogarsettings[`closePath`](), ogarsettings[`fill`](), ogarsettings[`globalAlpha`] = this[`selectBiggestCell`] ? 0.3 : 0.6, ogarsettings[`beginPath`](), ogarsettings[`arc`](0x3c, 15, 4, 0, this[`pi2`], !1), ogarsettings['closePath'](), ogarsettings[`fill`]());
                },
                'dTok': function(ogarsettings, more2ogarset) {
                    ogarsettings[`font`] = ogario1ThemeSettings['miniMapFontWeight'] + ' ' + (ogario1ThemeSettings[`miniMapTop`] - 6) + `px ` + ogario1ThemeSettings[`miniMapFontFamily`], ogarsettings['textAlign'] = `right`, ogarsettings['textBaseline'] = 'top', ogarsettings['fillText'](atob(this[`token`]), more2ogarset, 7);
                },
                'drawTeammatesInd': function(ogarsettings, more2ogarset, ogarcanvas, moreogarset) {
                    this[`indicator`] && ogarsettings[`drawImage`](this[`indicator`], more2ogarset - 45, ogarcanvas - moreogarset - 90);
                },
                'drawCellInfo': function(ogarsettings, more2ogarset, moreogarset, more3ogarset, more4ogarset, ogarbuffed, ogarlanguage, ogaractuallanguage, ogarcomms, ogario1Commands, ogarparsedchars, ogarparsedemoticons) {
                    if (!ogarbuffed && !ogarcomms && (ogarsettings[`globalAlpha`] = ogarcanvas[`globalAlpha`], ogario1Settings[`teammatesInd`] && ogarparsedemoticons && !ogaractuallanguage && more4ogarset <= 200 && this[`drawTeammatesInd`](ogarsettings, moreogarset, more3ogarset, more4ogarset), !ogario1Settings[`noNames`] || ogario1Settings[`showMass`])) {
                        var ogarsets1 = !1;
                        if (ogaractuallanguage || ogarlanguage || !(ogarsets1 = this[`setAutoHideCellInfo`](more4ogarset)) || !ogario1Settings[`autoHideNames`] || !ogario1Settings[`autoHideMass`]) {
                            var moremenusets = null;
                            if (!this[`cells`][`hasOwnProperty`](more2ogarset)) return (moremenusets = new ogarbasicassembly(moreogarset, more3ogarset, ogarlanguage, ogaractuallanguage, ogario1Settings['shortMass'], ogario1Settings[`virMassShots`]))[`setMass`](more4ogarset), moremenusets['setNick'](ogario1Commands), void(this[`cells`][more2ogarset] = moremenusets);
                            (moremenusets = this[`cells`][more2ogarset])[`update`](moreogarset, more3ogarset, more4ogarset, ogarlanguage, ogaractuallanguage, ogario1Commands), moremenusets[`setDrawing`](ogario1Settings[`optimizedNames`], ogario1Settings[`optimizedMass`], ogario1Settings[`shortMass`], ogario1Settings['virMassShots'], ogario1Settings[`namesStroke`], ogario1Settings['massStroke']), moremenusets[`setDrawingScale`](ogarcanvas['viewScale'], ogario1ThemeSettings[`namesScale`], ogario1ThemeSettings[`massScale`], ogario1ThemeSettings['virMassScale'], ogario1ThemeSettings[`strokeScale`]), ogarsettings[`globalAlpha`] = ogario1ThemeSettings[`textAlpha`], ogario1Settings[`noNames`] || ogarsets1 && ogario1Settings[`autoHideNames`] || ogaractuallanguage && ogario1Settings['hideMyName'] || ogarparsedemoticons && ogario1Settings[`hideTeammatesNames`] || moremenusets[`drawNick`](ogarsettings, ogario1ThemeSettings[`namesColor`], ogario1ThemeSettings[`namesFontFamily`], ogario1ThemeSettings[`namesFontWeight`], ogario1ThemeSettings['namesStrokeColor']), !ogario1Settings[`showMass`] || ogarsets1 && ogario1Settings[`autoHideMass`] || ogaractuallanguage && ogario1Settings['hideMyMass'] || ogario1Settings[`hideEnemiesMass`] && !ogaractuallanguage && !ogarlanguage || moremenusets['drawMass'](ogarsettings, ogario1ThemeSettings['massColor'], ogario1ThemeSettings[`massFontFamily`], ogario1ThemeSettings[`massFontWeight`], ogario1ThemeSettings['massStrokeColor']);
                        }
                    }
                },
                'setVirusColor': function(ogarsettings) {
                    return Math[`floor`](ogarsettings * ogarsettings / 100) > 183 ? `#C80000` : ogario1ThemeSettings['virusColor'];
                },
                'setVirusStrokeColor': function(ogarsettings) {
                    return ogarcanvas['play'] && 0 != ogarcanvas[`playerMaxMass`] ? Math[`floor`](ogarsettings * ogarsettings / 100) / (this[`selectBiggestCell`] ? ogarcanvas[`playerMaxMass`] : ogarcanvas[`playerMinMass`]) > 0.76 ? `#FFDC00` : '#C80000' : ogario1ThemeSettings[`virusStrokeColor`];
                },
                'setAutoHideCellInfo': function(ogarsettings) {
                    return ogarsettings <= 40 || ogarcanvas[`viewScale`] < 0.5 && ogarsettings < 550 && ogarsettings < 25 / ogarcanvas[`viewScale`];
                },
                'setParty': function() {
                    var ogarsettings = moreogarset(`#party-token`)[`val`]();
                    if (this[`gameMode`] = ogarcanvas[`gameMode`] = moreogarset(`#gamemode`)[`val`](), this[`setQuest`](), `:party` === this['gameMode'] && ogarsettings) {
                        var more2ogarset = ogarsettings; - 1 != ogarsettings[`indexOf`]('#') && (more2ogarset = (ogarsettings = ogarsettings[`split`]('#'))[1]), this[`partyToken`] !== more2ogarset && (this['partyToken'] = more2ogarset, this[`flushSkinsMap`](), this[`flushChatData`](), this[`cancelTargeting`]());
                    }
                },
                'createParty': function() {
                    moreogarset('#create-party-btn')[`click`]();
                },
                'joinParty': function() {
                    var ogarsettings = moreogarset(`#party-token`)['val']();
                    ogarsettings && (moreogarset(`#pre-join-party-btn`)[`click`](), moreogarset(`.party-token`)['val'](ogarsettings), moreogarset(`#join-party-btn`)[`click`]());
                },
                'leaveParty': function() {
                    moreogarset(`#party-token, .party-token`)[`val`](''), moreogarset(`#leave-party-btn`)[`click`]();
                },
                'closeParty': function() {
                    moreogarset(`#party-token, .party-token`)[`val`](''), moreogarset(`.party-icon-back`)[`click`]();
                },
                'flushData': function() {
                    this[`flushPartyData`](), this[`flushSkinsMap`](), this[`flushChatData`](), this[`cancelTargeting`](), ogarcanvas[`play`] = !1, ogarcanvas['playerColor'] = null;
                },
                'flushPartyData': function() {
                    this[`teamPlayers`] = [], this[`parties`] = [], this[`lastSentNick`] = '', this[`lastSentClanTag`] = null, this[`lastSentSkinURL`] = '', this[`lastSentCustomColor`] = '', this[`lastSentPartyToken`] = '', this[`lastSentServerToken`] = '';
                },
                'flushCells': function() {
                    this['cells'] = {};
                },
                'flushSkinsMap': function() {
                    this['customSkinsMap'] = {};
                },
                'flushChatData': function() {
                    this[`chatUsers`] = {};
                },
                'getWS': function(ogarsettings) {
                    ogarsettings && (this['ws'] = ogarsettings, this[`createServerToken`](), this[`updateServerInfo`](), -1 == this['ws'][`indexOf`](`agar.io`) && this[`closeConnection`]());
                },
                'recreateWS': function(ogarsettings) {
                    if (!ogarsettings) return null;
                    var more2ogarset = null;
                    if (/^[a-zA-Z0-9=+\/]{12,}$/ [`test`](ogarsettings)) {
                        var ogarcanvas = atob(ogarsettings);
                        /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}:[0-9]{1,4}/ [`test`](ogarcanvas) && (more2ogarset = `wss://ip-` + ogarcanvas[`replace`](/\./g, '-')[`replace`](':', `.tech.agar.io:`));
                    }
                    return !more2ogarset && /^[a-z0-9]{5,}$/ [`test`](ogarsettings) && (more2ogarset = `wss://live-arena-` + ogarsettings + `.agar.io:443`), more2ogarset;
                },
                'createServerToken': function() {
                    var ogarsettings = this['ws']['match'](/ip-\d+/),
                        ogarcanvas = this['ws'][`match`](/live-arena-([\w\d]+)/),
                        moreogarset = null;
                    ogarsettings && ((ogarsettings = this['ws'][`replace`](`.tech.agar.io`, '')[`replace`](/-/g, '.')[`match`](/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}:[0-9]{1,4}/)) && (this[`serverIP`] = ogarsettings[0], moreogarset = btoa(this['serverIP'])));
                    if (!moreogarset && ogarcanvas && (this['serverArena'] = ogarcanvas[1], moreogarset = this[`serverArena`]), moreogarset) {
                        this[`serverToken`] !== moreogarset && (this['serverToken'] = moreogarset, this[`flushData`](), this[`flushCells`]()), this[`partyToken`] = '';
                        var more3ogarset = this['ws'][`match`](/party_id=([A-Z0-9]{6})/);
                        more3ogarset && (this[`partyToken`] = more3ogarset[1], ogarjoiner('/#' + more2ogarset[`encodeURIComponent`](this[`partyToken`])));
                    }
                },
                'updateServerInfo': function() {
                    moreogarset(`#server-ws`)['val'](this['ws']), moreogarset(`#server-token`)[`val`](this[`serverToken`]), moreogarset(`#party-token, .party-token`)[`val`](this['partyToken']);
                },
                'gameServerConnect': function(ogarsettings) {
                    ogarsettings && (this[`skipServerData`] = !0, more2ogarset[`core`] && more2ogarset['core']['connect'] && more2ogarset[`core`]['connect'](ogarsettings));
                },
                'gameServerReconnect': function() {
                    more2ogarset['MC'] && more2ogarset['MC']['reconnect'] ? more2ogarset['MC'][`reconnect`]() : more2ogarset['master'] && more2ogarset[`master`][`reconnect`] && more2ogarset[`master`][`reconnect`]();
                },
                'gameServerJoin': function(ogarsettings) {
                    var more2ogarset = this[`recreateWS`](ogarsettings);
                    more2ogarset && (this[`skipServerData`] = !0, this[`gameServerConnect`](more2ogarset));
                },
                'connect': function() {
                    this[`closeConnection`](), this[`flushData`](), this[`setParty`](), console[`log`](`[Legend mod Express] Connecting to server`), this['privateMode'] && this[`privateIP`] ? this[`socket`] = new WebSocket(this[`privateIP`]) : this[`socket`] = new WebSocket(this[`publicIP`]), this[`socket`][`ogarioWS`] = !0, this[`socket`][`binaryType`] = `arraybuffer`;
                    var ogarsettings = this;
                    this[`socket`][`onopen`] = function() {
                        console['log']('[Legend mod Express] Socket open');
                        var more2ogarset = ogarsettings['createView'](3);
                        more2ogarset[`setUint8`](0, 0), more2ogarset[`setUint16`](1, 401, !0), ogarsettings['sendBuffer'](more2ogarset), ogarsettings[`sendPartyData`]();
                    }, this[`socket`][`onmessage`] = function(more2ogarset) {
                        ogarsettings[`handleMessage`](more2ogarset);
                    }, this[`socket`][`onclose`] = function(more2ogarset) {
                        ogarsettings[`flushData`](), console[`log`](`[Legend mod Express] Socket close`, more2ogarset);
                    }, this[`socket`][`onerror`] = function(more2ogarset) {
                        ogarsettings[`flushData`](), console[`log`](`[Legend mod Express] Socket error`, more2ogarset);
                    };
                },
                'closeConnection': function() {
                    if (this[`socket`]) {
                        this[`socket`][`onmessage`] = null;
                        try {
                            this['socket'][`close`]();
                        } catch (ogarcloseconlabel) {}
                        this[`socket`] = null;
                    }
                },
                'reconnect': function() {
                    this[`setParty`]();
                    var ogarsettings = this;
                    setTimeout(function() {
                        ogarsettings[`connect`]();
                    }, 1000);
                },
                'switchServerMode': function() {
                    this[`privateIP`] && (this['privateMode'] = !this[`privateMode`], this['isSocketOpen']() && (this[`closeConnection`](), toastr[`error`](`Zamknięto połączenie z serwerem!`)), this[`privateMode`] ? (toastr[`info`]('Przełączono na serwer prywatny!'), moreogarset(`.party-panel`)[`show`]()) : (toastr[`info`](`Przełączono na serwer publiczny!`), moreogarset(`#active-parties`)[`empty`](), moreogarset(`.party-panel`)['hide']()), this[`onJoin`](), ogarcanvas['play'] && this[`onPlayerSpawn`]());
                },
                'isSocketOpen': function() {
                    return null !== this['socket'] && this['socket'][`readyState`] === this[`socket`][`OPEN`];
                },
                'createView': function(ogarsettings) {
                    return new DataView(new ArrayBuffer(ogarsettings));
                },
                'strToBuff': function(ogarsettings, more2ogarset) {
                    var ogarcanvas = this[`createView`](1 + 2 * more2ogarset['length']);
                    ogarcanvas['setUint8'](0, ogarsettings);
                    for (var moreogarset = 0; moreogarset < more2ogarset[`length`]; moreogarset++) ogarcanvas[`setUint16`](1 + 2 * moreogarset, more2ogarset[`charCodeAt`](moreogarset), !0);
                    return ogarcanvas;
                },
                'sendBuffer': function(ogarsettings) {
                    this[`socket`][`send`](ogarsettings[`buffer`]);
                },
                'handleMessage': function(ogarsettings) {
                    this['readMessage'](new DataView(ogarsettings[`data`]));
                },
                'readMessage': function(ogarsettings) {
                    switch (ogarsettings[`getUint8`](0)) {
                        case 0:
                            this[`playerID`] = ogarsettings['getUint32'](1, !0);
                            break;
                        case 1:
                            this[`sendPlayerUpdate`]();
                            break;
                        case 20:
                            this['updateTeamPlayer'](ogarsettings);
                            break;
                        case 30:
                            this[`updateTeamPlayerPosition`](ogarsettings);
                            break;
                        case 96:
                            break;
                        case 100:
                            this['readChatMessage'](ogarsettings);
                    }
                },
                'sendPlayerState': function(ogarsettings) {
                    if (this[`isSocketOpen`]()) {
                        var more2ogarset = this['createView'](1);
                        more2ogarset[`setUint8`](0, ogarsettings), this[`sendBuffer`](more2ogarset);
                    }
                },
                'sendPlayerSpawn': function() {
                    this[`sendPlayerState`](1);
                },
                'sendPlayerDeath': function() {
                    this[`sendPlayerState`](2);
                },
                'sendPlayerJoin': function() {
                    this[`sendPlayerState`](3);
                },
                'sendPlayerData': function(ogarsettings, more2ogarset, ogarcanvas) {
                    null !== this[more2ogarset] && this[more2ogarset] === ogarcanvas || this[`isSocketOpen`]() && (this[`sendBuffer`](this[`strToBuff`](ogarsettings, ogarcanvas)), this[more2ogarset] = ogarcanvas);
                },
                'sendPlayerNick': function() {
                    this[`sendPlayerData`](10, 'lastSentNick', ogarcopythelb[`nick`]);
                },
                'sendPlayerClanTag': function() {
                    this[`sendPlayerData`](11, `lastSentClanTag`, ogarcopythelb[`clanTag`]);
                },
                'sendPlayerSkinURL': function() {
                    this['sendPlayerData'](12, `lastSentSkinURL`, ogarcopythelb['skinURL']);
                },
                'sendPlayerCustomColor': function() {
                    this[`sendPlayerData`](13, `lastSentCustomColor`, ogarcopythelb[`color`]);
                },
                'sendPlayerColor': function() {
                    this[`isSocketOpen`]() && ogarcanvas[`playerColor`] && this['sendBuffer'](this[`strToBuff`](14, ogarcanvas[`playerColor`]));
                },
                'sendPartyToken': function() {
                    this[`setParty`](), this[`sendPlayerData`](15, `lastSentPartyToken`, this[`partyToken`]);
                },
                'sendServerToken': function() {
                    this[`sendPlayerData`](16, 'lastSentServerToken', this[`serverToken`]);
                },
                'sendServerJoin': function() {
                    this['sendServerToken'](), this[`sendPlayerJoin`]();
                },
                'sendServerRegion': function() {
                    if (this[`region`]) {
                        var ogarsettings = this[`region`][`split`]('-');
                        this[`isSocketOpen`]() && this[`sendBuffer`](this[`strToBuff`](17, ogarsettings[0]));
                    }
                },
                'sendServerGameMode': function() {
                    var ogarsettings = `FFA`;
                    switch (this[`gameMode`]) {
                        case `:battleroyale`:
                            ogarsettings = `BTR`;
                            break;
                        case `:teams`:
                            ogarsettings = `TMS`;
                            break;
                        case ':experimental':
                            ogarsettings = `EXP`;
                            break;
                        case ':party':
                            ogarsettings = `PTY`;
                    }
                    this[`isSocketOpen`]() && this[`sendBuffer`](this[`strToBuff`](18, ogarsettings));
                },
                'sendServerData': function() {
                    this[`skipServerData`] ? this[`skipServerData`] = !1 : (this['region'] = moreogarset('#region')[`val`](), this[`gameMode`] = moreogarset('#gamemode')[`val`](), this['sendServerRegion'](), this[`sendServerGameMode`]());
                },
                'sendPartyData': function() {
                    this[`sendPlayerClanTag`](), this['sendPartyToken'](), this['sendServerToken'](), this[`sendPlayerNick`]();
                },
                'sendPlayerUpdate': function() {
                    if (this[`isSocketOpen`]() && ogarcanvas[`play`] && this['playerID'] && ogarcanvas[`playerColor`]) {
                        function ogarsettings(ogarsettings) {
                            for (var more2ogarset = 0; more2ogarset < ogarsettings[`length`]; more2ogarset++) moreogarset[`setUint16`](more3ogarset, ogarsettings[`charCodeAt`](more2ogarset), !0), more3ogarset += 2;
                            moreogarset[`setUint16`](more3ogarset, 0, !0), more3ogarset += 2;
                        }
                        var more2ogarset = 41;
                        more2ogarset += 2 * ogarcopythelb[`nick`][`length`], more2ogarset += 2 * ogarcopythelb[`skinURL`][`length`];
                        var moreogarset = this['createView'](more2ogarset);
                        moreogarset[`setUint8`](0, 20), moreogarset[`setUint32`](1, this[`playerID`], !0);
                        var more3ogarset = 5;
                        ogarsettings(ogarcopythelb[`nick`]), ogarsettings(ogarcopythelb['skinURL']), ogarsettings(ogarcopythelb[`color`]), ogarsettings(ogarcanvas['playerColor']), this['sendBuffer'](moreogarset);
                    }
                },
                'sendPlayerPosition': function() {
                    if (this['isSocketOpen']() && ogarcanvas[`play`] && this[`playerID`]) {
                        var ogarsettings = this['createView'](17);
                        ogarsettings[`setUint8`](0, 30), ogarsettings[`setUint32`](1, this[`playerID`], !0), ogarsettings['setInt32'](5, this[`getPlayerX`](), !0), ogarsettings[`setInt32`](9, this['getPlayerY'](), !0), void 0 !== ogarcanvas[`playerMass`] ? ogarsettings[`setUint32`](13, ogarcanvas[`playerMass`], !0) : ogarsettings['setUint32'](13, this[`playerMass`], !0), this[`sendBuffer`](ogarsettings);
                    }
                },
                'checkPlayerID': function(ogarsettings) {
                    if (ogarsettings)
                        for (var more2ogarset = 0; more2ogarset < this[`teamPlayers`][`length`]; more2ogarset++)
                            if (this['teamPlayers'][more2ogarset]['id'] == ogarsettings) return more2ogarset;
                    return null;
                },
                'updateTeamPlayer': function(ogarsettings) {
                    function more2ogarset() {
                        for (var more2ogarset = '';;) {
                            var ogarcanvas = ogarsettings[`getUint16`](moreogarset, !0);
                            if (0 == ogarcanvas) break;
                            more2ogarset += String[`fromCharCode`](ogarcanvas), moreogarset += 2;
                        }
                        return moreogarset += 2, more2ogarset;
                    }
                    var ogarcanvas = ogarsettings[`getUint32`](1, !0),
                        moreogarset = 5,
                        more3ogarset = more2ogarset(),
                        more4ogarset = this[`checkSkinURL`](more2ogarset()),
                        ogarbuffed = more2ogarset(),
                        ogarlanguage = more2ogarset(),
                        ogaractuallanguage = `:party` === this[`gameMode`] ? more3ogarset + ogarlanguage : more3ogarset,
                        ogarcomms = this['checkPlayerID'](ogarcanvas);
                    if (null !== ogarcomms) this[`teamPlayers`][ogarcomms][`nick`] = more3ogarset, this[`teamPlayers`][ogarcomms][`skinID`] = ogaractuallanguage, this['teamPlayers'][ogarcomms][`skinURL`] = more4ogarset, this[`teamPlayers`][ogarcomms][`setColor`](ogarlanguage, ogarbuffed);
                    else {
                        var ogario1Commands = new function(ogarsettings, more2ogarset, ogarcanvas, moreogarset) {
                            this['id'] = ogarsettings, this[`nick`] = more2ogarset, this['skinID'] = ogarcanvas, this[`skinURL`] = moreogarset, this['x'] = 0, this['y'] = 0, this[`lastX`] = 0, this['lastY'] = 0, this['mass'] = 0, this['clanTag'] = '', this[`color`] = null, this[`customColor`] = ogario1ThemeSettings['miniMapTeammatesColor'], this['alive'] = !1, this['updateTime'] = null, this['pi2'] = 2 * Math['PI'], this['setColor'] = function(ogarsettings, more2ogarset) {
                                this[`color`] = ogarsettings, 7 == more2ogarset[`length`] && (this[`customColor`] = more2ogarset);
                            }, this[`drawPosition`] = function(ogarsettings, more2ogarset, ogarcanvas, moreogarset, more3ogarset) {
                                if (!(!this[`alive`] || moreogarset && more3ogarset && this['id'] != more3ogarset)) {
                                    this[`lastX`] = (29 * this[`lastX`] + this['x']) / 30, this[`lastY`] = (29 * this['lastY'] + this['y']) / 30;
                                    var more4ogarset = (this[`lastX`] + more2ogarset) * ogarcanvas,
                                        ogarbuffed = (this[`lastY`] + more2ogarset) * ogarcanvas;
                                    this[`nick`][`length`] > 0 && (ogarsettings[`font`] = ogario1ThemeSettings['miniMapNickFontWeight'] + ' ' + ogario1ThemeSettings[`miniMapNickSize`] + 'px ' + ogario1ThemeSettings[`miniMapNickFontFamily`], ogarsettings[`textAlign`] = `center`, ogario1ThemeSettings[`miniMapNickStrokeSize`] > 0 && (ogarsettings[`lineWidth`] = ogario1ThemeSettings[`miniMapNickStrokeSize`], ogarsettings[`strokeStyle`] = ogario1ThemeSettings[`miniMapNickStrokeColor`], ogarsettings['strokeText'](this[`nick`], more4ogarset, ogarbuffed - (2 * ogario1ThemeSettings['miniMapTeammatesSize'] + 2))), ogarsettings[`fillStyle`] = ogario1ThemeSettings[`miniMapNickColor`], ogarsettings['fillText'](this[`nick`], more4ogarset, ogarbuffed - (2 * ogario1ThemeSettings[`miniMapTeammatesSize`] + 2))), ogarsettings[`beginPath`](), ogarsettings[`arc`](more4ogarset, ogarbuffed, ogario1ThemeSettings[`miniMapTeammatesSize`], 0, this['pi2'], !1), ogarsettings[`closePath`](), ogario1Settings[`oneColoredTeammates`] ? ogarsettings['fillStyle'] = ogario1ThemeSettings[`miniMapTeammatesColor`] : ogarsettings[`fillStyle`] = this[`customColor`], ogarsettings[`fill`]();
                                }
                            };
                        }(ogarcanvas, more3ogarset, ogaractuallanguage, more4ogarset);
                        ogario1Commands[`setColor`](ogarlanguage, ogarbuffed), this[`teamPlayers`]['push'](ogario1Commands);
                    }
                    this['cacheCustomSkin'](more3ogarset, ogarlanguage, more4ogarset);
                },
                'updateTeamPlayerPosition': function(ogarsettings) {
                    var more2ogarset = ogarsettings[`getUint32`](1, !0),
                        ogarcanvas = this[`checkPlayerID`](more2ogarset);
                    if (null !== ogarcanvas) {
                        var moreogarset = ogarsettings[`getInt32`](5, !0),
                            more3ogarset = ogarsettings[`getInt32`](9, !0),
                            more4ogarset = ogarsettings[`getUint32`](13, !0);
                        if (more4ogarset > 360000) return;
                        var ogarbuffed = this[`teamPlayers`][ogarcanvas];
                        ogarbuffed['x'] = moreogarset, ogarbuffed['y'] = more3ogarset, ogarbuffed['mass'] = more4ogarset, ogarbuffed[`alive`] = !0, ogarbuffed[`updateTime`] = Date[`now`](), this[`targeting`] && this[`targetID`] && more2ogarset == this[`targetID`] && this['updateTarget'](ogarbuffed[`nick`], ogarbuffed[`skinURL`], moreogarset, more3ogarset, more4ogarset, ogarbuffed[`color`]);
                    }
                },
                'updateTeamPlayers': function() {
                    this[`sendPlayerPosition`](), this[`chatUsers`] = {}, this[`top5`] = [];
                    for (var ogarsettings = 0; ogarsettings < this[`teamPlayers`][`length`]; ogarsettings++) {
                        var more2ogarset = this[`teamPlayers`][ogarsettings];
                        (more2ogarset[`alive`] && Date[`now`]() - more2ogarset[`updateTime`] >= 2000 || 0 == more2ogarset['mass']) && (more2ogarset[`alive`] = !1, this[`targeting`] && this[`targetID`] && more2ogarset['id'] == this[`targetID`] && this[`setTargetStatus`](2)), more2ogarset[`alive`] && (this[`top5`][`push`]({
                            'id': more2ogarset['id'],
                            'nick': more2ogarset[`nick`],
                            'x': more2ogarset['x'],
                            'y': more2ogarset['y'],
                            'mass': more2ogarset['mass'],
                            'color': more2ogarset['color']
                        }), this[`isChatUserMuted`](more2ogarset['id']) || this[`addChatUser`](more2ogarset['id'], more2ogarset['nick']));
                    }
                    this[`top5`][`sort`](function(ogarsettings, more2ogarset) {
                        return more2ogarset[`mass`] - ogarsettings[`mass`];
                    }), this[`displayTop5`]();
                },
                'updateParties': function(ogarsettings) {
                    this['parties'] = [];
                    for (var more2ogarset = ogarsettings[`getUint8`](1), ogarcanvas = 2, moreogarset = 0; moreogarset < more2ogarset; moreogarset++) {
                        for (var more3ogarset = '';;) {
                            var more4ogarset = ogarsettings[`getUint16`](ogarcanvas, !0);
                            if (0 == more4ogarset) break;
                            more3ogarset += String['fromCharCode'](more4ogarset), ogarcanvas += 2;
                        }
                        ogarcanvas += 2, this[`parties`]['push'](more3ogarset);
                    }
                },
                'readChatMessage': function(ogarsettings) {
                    if (!ogario1Settings[`disableChat`]) {
                        var more2ogarset = new Date()[`toTimeString`]()[`replace`](/^(\d{2}:\d{2}).*/, '$1'),
                            ogarcanvas = ogarsettings[`getUint8`](1),
                            moreogarset = ogarsettings['getUint32'](2, !0),
                            more3ogarset = ogarsettings[`getUint32`](6, !0);
                        if (!(this[`isChatUserMuted`](moreogarset) || 0 != more3ogarset && more3ogarset != this['playerID'] && moreogarset != this[`playerID`])) {
                            for (var more4ogarset = '', ogarbuffed = 10; ogarbuffed < ogarsettings[`byteLength`]; ogarbuffed += 2) {
                                var ogarlanguage = ogarsettings['getUint16'](ogarbuffed, !0);
                                if (0 == ogarlanguage) break;
                                more4ogarset += String[`fromCharCode`](ogarlanguage);
                            }
                            this[`displayChatMessage`](more2ogarset, ogarcanvas, moreogarset, more4ogarset);
                        }
                    }
                },
                'sendChatMessage': function(ogarsettings, more2ogarset) {
                    if (!(Date[`now`]() - this[`lastMessageSentTime`] < 500 || 0 == more2ogarset[`length`] || 0 == ogarcopythelb[`nick`][`length`]) && this['isSocketOpen']()) {
                        more2ogarset = ogarcopythelb['nick'] + ': ' + more2ogarset;
                        var ogarcanvas = this[`createView`](10 + 2 * more2ogarset['length']);
                        ogarcanvas['setUint8'](0, 100), ogarcanvas[`setUint8`](1, ogarsettings), ogarcanvas[`setUint32`](2, this[`playerID`], !0), ogarcanvas[`setUint32`](6, 0, !0);
                        for (var moreogarset = 0; moreogarset < more2ogarset[`length`]; moreogarset++) ogarcanvas[`setUint16`](10 + 2 * moreogarset, more2ogarset['charCodeAt'](moreogarset), !0);
                        this[`sendBuffer`](ogarcanvas), this[`lastMessageSentTime`] = Date[`now`]();
                    }
                },
                'prepareCommand': function(ogarsettings) {
                    return ogarsettings[`replace`](`%currentSector%`, this[`currentSector`]);
                },
                'sendCommand': function(ogarsettings) {
                    var more2ogarset = this[`prepareCommand`](ogario1Commands[`comm` + ogarsettings]);
                    this[`sendChatMessage`](102, more2ogarset);
                },
                'addChatUser': function(ogarsettings, more2ogarset) {
                    this['chatUsers'][ogarsettings] = more2ogarset;
                },
                'getChatUserNick': function(ogarsettings) {
                    return this[`chatUsers`][`hasOwnProperty`](ogarsettings) ? this[`chatUsers`][ogarsettings] : '';
                },
                'muteChatUser': function(ogarsettings) {
                    if (ogarsettings && !this[`isChatUserMuted`](ogarsettings)) {
                        var more2ogarset = this['getChatUserNick'](ogarsettings);
                        this[`chatMutedUsers`][ogarsettings] = more2ogarset, this[`chatMutedUserIDs`]['push'](ogarsettings), toastr[`error`](ogarcomms[`userMuted`][`replace`](`%user%`, `<strong>` + this[`escapeHTML`](more2ogarset) + `</strong>`) + ` <button data-user-id=\"` + ogarsettings + `\" class=\"btn btn-xs btn-green btn-unmute-user\">` + ogarcomms['unmute'] + `</button>`);
                    }
                },
                'unmuteChatUser': function(ogarsettings) {
                    if (ogarsettings) {
                        var more2ogarset = this['chatMutedUserIDs'][`indexOf`](ogarsettings); - 1 != more2ogarset && (this['chatMutedUserIDs'][`splice`](more2ogarset, 1), toastr[`info`](ogarcomms[`userUnmuted`]['replace'](`%user%`, `<strong>` + this[`escapeHTML`](this[`chatMutedUsers`][ogarsettings]) + `</strong>`)), delete this[`chatMutedUsers`][ogarsettings]);
                    }
                },
                'isChatUserMuted': function(ogarsettings) {
                    return -1 != this[`chatMutedUserIDs`]['indexOf'](ogarsettings);
                },
                'parseMessage': function(ogarsettings) {
                    var more2ogarset = /\[img\](https?:\/\/i\.(?:imgur|hizliresim)\.com\/\w{6,8}\.(?:jpg|jpeg|png|gif)\??\d*)\[\/img\]/i;
                    if (more2ogarset[`test`](ogarsettings)) return ogario1Settings['showChatImages'] ? '<img src=\"' + ogarsettings[`match`](more2ogarset)[1][`replace`](`http:`, `https:`) + `\" style=\"width:100%;border:none;\">` : '';
                    var ogarcanvas = /\[yt\]([\w-]{11})\[\/yt\]/i;
                    if (ogarcanvas['test'](ogarsettings)) return ogario1Settings['showChatVideos'] ? `<iframe type=\"text/html\" width=\"100%\" height=\"auto\" src=\"https://www.youtube.com/embed/` + ogarsettings['match'](ogarcanvas)[1] + `?autoplay=1&amp;vq=tiny\" frameborder=\"0\" />` : '';
                    var moreogarset = this[`escapeHTML`](ogarsettings);
                    return ogario1Settings[`chatEmoticons`] && (moreogarset = this[`parseEmoticons`](moreogarset)), moreogarset;
                },
                'parseEmoticons': function(ogarsettings) {
                    return String(ogarsettings)[`replace`](/\&lt\;3/g, '<3')['replace'](/(O\:\)|3\:\)|8\=\)|\:\)|\;\)|\=\)|\:D|X\-D|\=D|\:\(|\;\(|\:P|\;P|\:\*|\$\)|\<3|\:o|\(\:\||\:\||\:\\|\:\@|\|\-\)|\^\_\^|\-\_\-|\$\_\$|\(poop\)|\(fuck\)|\(clap\)|\(ok\)|\(victory\)|\(y\)|\(n\))/g, function(ogarsettings) {
                        return `<img src=\"https://cdn.ogario.ovh/static/emoticons/` + ogarparsedemoticons[ogarsettings] + `\" alt=\"` + ogarsettings + `\" class=\"emoticon\">`;
                    });
                },
                'displayChatMessage': function(ogarsettings, more2ogarset, ogarcanvas, more3ogarset) {
                    if (0 != more3ogarset[`length`]) {
                        var more4ogarset = more3ogarset[`split`](': ', 1)[`toString`](),
                            ogarbuffed = this[`parseMessage`](more3ogarset[`replace`](more4ogarset + ': ', ''));
                        if (!(0 == more4ogarset[`length`] || more4ogarset[`length`] > 15 || 0 == ogarbuffed[`length`])) {
                            var ogarlanguage = '';
                            if (0 != ogarcanvas && ogarcanvas != this['playerID'] && (this[`addChatUser`](ogarcanvas, more4ogarset), ogarlanguage = '<a href=\"#\" data-user-id=\"' + ogarcanvas + `\" class=\"mute-user ogicon-user-minus\"></a> `), more4ogarset = this[`escapeHTML`](more4ogarset), 101 == more2ogarset) {
                                if (ogario1Settings[`showChatBox`]) return moreogarset(`#chat-box`)[`append`](`<div class=\"message\"><span class=\"message-time\">[` + ogarsettings + `] </span>` + ogarlanguage + `<span class=\"message-nick\">` + more4ogarset + `: </span><span class=\"message-text\">` + ogarbuffed + `</span></div>`), moreogarset(`#chat-box`)['perfectScrollbar'](`update`), moreogarset(`#chat-box`)[`animate`]({
                                    'scrollTop': moreogarset(`#chat-box`)['prop']('scrollHeight')
                                }, 500), void(ogario1Settings[`chatSounds`] && this[`playSound`](this[`messageSound`]));
                                ogario1Settings[`hideChat`] || (toastr[`success`]('<span class=\"message-nick\">' + more4ogarset + ': </span><span class=\"message-text\">' + ogarbuffed + `</span>` + ogarlanguage), ogario1Settings['chatSounds'] && this[`playSound`](this[`messageSound`])), this[`chatHistory`][`push`]({
                                    'nick': more4ogarset,
                                    'message': ogarbuffed
                                }), this['chatHistory'][`length`] > 15 && this[`chatHistory`][`shift`]();
                            } else if (102 == more2ogarset) {
                                if (ogario1Settings[`showChatBox`]) return moreogarset(`#chat-box`)[`append`](`<div class=\"message command\"><span class=\"command-time\">[` + ogarsettings + '] </span>' + ogarlanguage + `<span class=\"command-nick\">` + more4ogarset + `: </span><span class=\"command-text\">` + ogarbuffed + `</span></div>`), moreogarset(`#chat-box`)[`perfectScrollbar`]('update'), moreogarset('#chat-box')[`animate`]({
                                    'scrollTop': moreogarset('#chat-box')[`prop`]('scrollHeight')
                                }, 500), void(ogario1Settings['chatSounds'] && this[`playSound`](this[`commandSound`]));
                                ogario1Settings[`hideChat`] || (toastr[`warning`](`<span class=\"command-nick\">` + more4ogarset + `: </span><span class=\"command-text\">` + ogarbuffed + `</span>` + ogarlanguage), ogario1Settings['chatSounds'] && this[`playSound`](this['commandSound']));
                            } else moreogarset(`#messages`)[`append`](more3ogarset);
                        }
                    }
                },
                'displayUserList': function(ogarsettings, more2ogarset, ogarcanvas, moreogarset, more3ogarset) {
                    var more4ogarset = '';
                    if (Object[`keys`](ogarsettings)[`length`]) {
                        for (var ogarbuffed in more4ogarset += '<ol class=\"user-list\">', ogarsettings) ogarsettings['hasOwnProperty'](ogarbuffed) && (more4ogarset += `<li><strong>` + this[`escapeHTML`](ogarsettings[ogarbuffed]) + '</strong> <button data-user-id=\"' + ogarbuffed + `\" class=\"btn btn-xs ` + ogarcanvas + '\">' + moreogarset + `</button></li>`);
                        more4ogarset += `</ol>`;
                    } else more4ogarset += ogarcomms['none'];
                    toastr[more3ogarset](more4ogarset, more2ogarset, {
                        'closeButton': !0,
                        'tapToDismiss': !1
                    });
                },
                'displayChatActiveUsers': function() {
                    this[`displayUserList`](this[`chatUsers`], ogarcomms['activeUsers'], `btn-red btn-mute-user`, ogarcomms[`mute`], `info`);
                },
                'displayChatMutedUsers': function() {
                    this[`displayUserList`](this[`chatMutedUsers`], ogarcomms['mutedUsers'], `btn-green btn-unmute-user`, ogarcomms[`unmute`], `error`);
                },
                'preloadChatSounds': function() {
                    this[`setMessageSound`](), this[`setCommandSound`]();
                },
                'setChatSoundsBtn': function() {
                    ogario1Settings[`chatSounds`] ? moreogarset(`.chat-sound-notifications`)[`removeClass`](`ogicon-volume-mute2`)[`addClass`](`ogicon-volume-high`) : moreogarset(`.chat-sound-notifications`)[`removeClass`](`ogicon-volume-high`)[`addClass`](`ogicon-volume-mute2`);
                },
                'setMessageSound': function() {
                    this[`messageSound`] = this[`setSound`](ogario1Settings[`messageSound`]);
                },
                'setCommandSound': function() {
                    this[`commandSound`] = this[`setSound`](ogario1Settings[`commandSound`]);
                },
                'setSound': function(ogarsettings) {
                    return ogarsettings ? new Audio(ogarsettings) : null;
                },
                'playSound': function(ogarsettings) {
                    ogarsettings && ogarsettings[`play`] && (ogarsettings[`pause`](), ogarsettings['currentTime'] = 0, ogarsettings[`play`]());
                },
                'setTargeting': function() {
                    this[`targetID`] && (this['targeting'] = !this[`targeting`], ogarcanvas[`targeting`] = this['targeting'], this['setTargetingInfo']());
                },
                'setTargetingInfo': function() {
                    this[`targeting`] ? (moreogarset(`#set-targeting`)[`addClass`](`active`), moreogarset(`#target-status`)[`show`](), 2 != this[`targetStatus`] && moreogarset('#target-summary')[`show`]()) : (moreogarset(`#set-targeting`)[`removeClass`]('active'), moreogarset(`#target-summary, #target-status`)['hide']());
                },
                'cancelTargeting': function() {
                    this[`setTargetStatus`](0);
                },
                'setPrivateMiniMap': function() {
                    this[`targetID`] && (this['privateMiniMap'] = !this['privateMiniMap'], this[`privateMiniMap`] ? moreogarset(`#set-private-minimap`)[`addClass`]('active') : moreogarset(`#set-private-minimap`)['removeClass'](`active`));
                },
                'setTarget': function(ogarsettings) {
                    var more2ogarset = this[`checkPlayerID`](ogarsettings);
                    if (null !== more2ogarset) {
                        var ogarcanvas = this[`teamPlayers`][more2ogarset];
                        if (this[`targetID`] = ogarcanvas['id'], this[`updateTarget`](ogarcanvas[`nick`], ogarcanvas['skinURL'], ogarcanvas['x'], ogarcanvas['y'], ogarcanvas[`mass`], ogarcanvas['color']), !ogarcanvas[`alive`]) return void this[`setTargetStatus`](2);
                        this[`setTargetStatus`](1);
                    } else this[`setTargetStatus`](0);
                },
                'setTargetStatus': function(ogarsettings) {
                    switch (ogarsettings) {
                        case 0:
                            this['targetStatus'] = 0, this[`targetID`] = 0, this[`targetNick`] = '', this[`targetSkinURL`] = '', this[`targeting`] = !1, ogarcanvas[`targeting`] = !1, this[`privateMiniMap`] = !1, moreogarset(`#target-skin, #target-nick, #target-summary`)[`hide`](), moreogarset(`#target-status`)[`show`]()[`text`]('[' + ogarcomms[`targetNotSet`] + ']'), moreogarset(`#target-panel-hud a`)['removeClass']('active');
                            break;
                        case 1:
                            this[`targetStatus`] = 1, this['targeting'] || (this[`targeting`] = !0, ogarcanvas[`targeting`] = !0, this[`setTargetingInfo`]()), moreogarset(`#target-skin, #target-nick, #target-status, #target-summary`)[`show`]();
                            break;
                        case 2:
                            this[`targetStatus`] = 2, moreogarset(`#target-summary`)[`hide`](), moreogarset(`#target-status`)[`show`]()[`text`]('[' + ogarcomms[`targetDead`] + ']'), ogarcanvas[`resetTargetPosition`]();
                    }
                },
                'changeTarget': function() {
                    for (var ogarsettings = this[`checkPlayerID`](this['targetID']), more2ogarset = null, ogarcanvas = 0; ogarcanvas < this[`teamPlayers`][`length`]; ogarcanvas++)
                        if (this[`teamPlayers`][ogarcanvas]['alive']) {
                            if (null === ogarsettings) {
                                ogarsettings = ogarcanvas;
                                break;
                            }
                            if (ogarcanvas < ogarsettings && null === more2ogarset) more2ogarset = ogarcanvas;
                            else if (ogarcanvas > ogarsettings) {
                                more2ogarset = ogarcanvas;
                                break;
                            }
                        } null !== more2ogarset && (ogarsettings = more2ogarset), null !== ogarsettings ? this['setTarget'](this[`teamPlayers`][ogarsettings]['id']) : this[`setTargetStatus`](0);
                },
                'updateTarget': function(ogarsettings, more2ogarset, more3ogarset, more4ogarset, ogarbuffed, ogarlanguage) {
                    ogarcanvas[`setTargetPosition`](more3ogarset, more4ogarset), this[`targetNick`] !== ogarsettings && (this[`targetNick`] = ogarsettings, moreogarset('#target-nick')[`html`](this['escapeHTML'](ogarsettings))), moreogarset(`#target-skin`)[`css`](`background-color`, ogarlanguage), more2ogarset && this[`targetSkinURL`] !== more2ogarset && (this[`customSkinsCache`]['hasOwnProperty'](more2ogarset + '_cached') ? (moreogarset(`#target-skin img`)[`attr`]('src', more2ogarset), this[`targetSkinURL`] = more2ogarset) : moreogarset(`#target-skin img`)[`attr`](`src`, `https://cdn.ogario.ovh/static/img/blank.png`)), moreogarset(`#target-status`)[`text`]('[' + this[`shortMassFormat`](ogarbuffed) + ']');
                    var ogaractuallanguage = this[`calculateMapSector`](more3ogarset, more4ogarset),
                        ogario1Commands = ogarcomms[`targetDistance`] + `: <span class=\"hud-main-color\">` + ogarcanvas[`targetDistance`] + ' [' + ogaractuallanguage + ']</span>';
                    ogarcanvas[`play`] && (ogario1Commands += ` | ` + ogarcomms[`targetMass`] + `: <span class=\"hud-main-color\">` + this[`shortMassFormat`](ogarbuffed + ogarcanvas[`playerMass`]) + `</span>`), moreogarset(`#target-summary`)[`html`](ogario1Commands), 1 != this[`targetStatus`] && this[`setTargetStatus`](1);
                },
                'updateQuest': function() {
                    this[`showQuest`] && `:ffa` === this[`gameMode`] && more2ogarset['MC'] && more2ogarset['MC'][`getQuestProgressLabel`] && (this['questHUD'][`textContent`] = more2ogarset['MC'][`getQuestProgressLabel`]());
                },
                'init': function() {
                    this['loadSettings'](), this['loadProfiles'](), this[`setLang`](), this[`setMenu`](), this['setUI'](), csssettings && csssettings[`setTheme`](), this['setShowQuickMenu'](), this[`setShowSkinsPanel`](), this[`setProfile`](), this[`setMainButtons`](), this[`setStreamMode`](), this[`setHideSkinUrl`](), this[`setMiniMap`](), this['setAutoResp'](), this[`setDisableChat`](), this[`setShowChatBox`](), this[`setTop5`](), this[`setTargetingHUD`](), this[`setQuest`](), this[`displayTime`](), this[`setCenteredLb`](), this[`setNormalLb`](), this[`setFpsAtTop`](), this[`displayStats`](), this[`setBlockPopups`](), this['preloadChatSounds'](), this[`setChatSoundsBtn`]();
                    var ogarsettings = this;
                    setInterval(function() {
                        ogarsettings['drawMiniMap']();
                    }, 33), setInterval(function() {
                        ogarsettings[`updateTeamPlayers`]();
                    }, this[`updateInterval`]);
                }
            };

            function ogarcanvasrenderfromagario() {
                this[`txt`] = '',
                    this[`txtCanvas`] = null,
                    this[`txtCtx`] = null,
                    this[`color`] = `#FFFFFF`,
                    this[`stroke`] = !1,
                    this[`strokeWidth`] = 2,
                    this[`strokeColor`] = `#000000`,
                    this[`font`] = `700 16px Ubuntu`,
                    this[`fontFamily`] = 'Ubuntu',
                    this[`fontWeight`] = 700,
                    this['fontSize'] = 16,
                    this['margin'] = 3,
                    this['scale'] = 1,
                    this['quality'] = 1,
                    this[`measuredWidth`] = 0,
                    this[`redraw`] = !1,
                    this[`remeasure`] = !1,
                    this[`setTxt`] = function(ogariosettxtsetter) {
                        this[`txt`] !== ogariosettxtsetter && (this['txt'] = ogariosettxtsetter,
                            this[`redraw`] = !0,
                            this[`remeasure`] = !0);
                    },
                    this[`setColor`] = function(ogariocolorsetter) {
                        this[`color`] !== ogariocolorsetter && (this['color'] = ogariocolorsetter,
                            this['redraw'] = !0);
                    },
                    this['setStroke'] = function(ogariostrokesetter) {
                        this['stroke'] !== ogariostrokesetter && (this['stroke'] = ogariostrokesetter,
                            this[`redraw`] = !0);
                    },
                    this[`setStrokeWidth`] = function(ogariostrokewidthsetter) {
                        this['stroke'] && this['strokeWidth'] != ogariostrokewidthsetter && (this[`strokeWidth`] = ogariostrokewidthsetter,
                            this[`redraw`] = !0,
                            this[`remeasure`] = !0);
                    },
                    this[`setStrokeColor`] = function(ogariostrokecolorsetter) {
                        this[`stroke`] && this[`strokeColor`] !== ogariostrokecolorsetter && (this[`strokeColor`] = ogariostrokecolorsetter,
                            this[`redraw`] = !0);
                    },
                    this[`setFont`] = function() {
                        this[`font`] = this[`fontWeight`] + ' ' + this[`fontSize`] + `px ` + this[`fontFamily`];
                    },
                    this[`setFontFamily`] = function(ogariofontfamilysetter) {
                        this['fontFamily'] !== ogariofontfamilysetter && (this[`fontFamily`] = ogariofontfamilysetter,
                            this[`setFont`](),
                            this[`redraw`] = !0,
                            this[`remeasure`] = !0);
                    },
                    this[`setFontWeight`] = function(ogariofontweightsetter) {
                        this['fontWeight'] != ogariofontweightsetter && (this['fontWeight'] = ogariofontweightsetter,
                            this[`setFont`](),
                            this[`redraw`] = !0,
                            this[`remeasure`] = !0);
                    },
                    this[`setFontSize`] = function(ogariofontsizesetter) {
                        this['fontSize'] != ogariofontsizesetter && (this[`fontSize`] = ogariofontsizesetter,
                            this[`margin`] = ~~(0.2 * ogariofontsizesetter),
                            this[`setFont`](),
                            this[`redraw`] = !0);
                    },
                    this[`setScale`] = function(ogarioscalesetter) {
                        this[`scale`] != ogarioscalesetter && (this[`scale`] = ogarioscalesetter,
                            this[`redraw`] = !0);
                    },
                    this[`createCanvas`] = function() {
                        this[`txtCanvas`] || (this[`txtCanvas`] = document[`createElement`]('canvas'),
                            this[`txtCtx`] = this[`txtCanvas`][`getContext`]('2d'),
                            this[`txtCtx`][`ogarioCtx`] = !0);
                    },
                    this[`setDrawing`] = function(ogarsetDrawinglabel1, ogarsetDrawinglabel2, ogarsetDrawinglabel3, ogarsetDrawinglabel4, ogarsetDrawinglabel5, ogarsetDrawinglabel6) {
                        this[`setColor`](ogarsetDrawinglabel1),
                            this[`setFontFamily`](ogarsetDrawinglabel2),
                            this[`setFontWeight`](ogarsetDrawinglabel3),
                            this[`setStroke`](ogarsetDrawinglabel4),
                            this['setStrokeWidth'](ogarsetDrawinglabel5),
                            this[`setStrokeColor`](ogarsetDrawinglabel6);
                    },
                    this[`measureWidth`] = function() {
                        return this[`remeasure`] && (this[`txtCtx`][`font`] = this[`fontWeight`] + ` 10px ` + this[`fontFamily`],
                                this[`measuredWidth`] = this[`txtCtx`]['measureText'](this[`txt`])['width'],
                                this[`remeasure`] = !1),
                            ~~(this[`fontSize`] / 10 * this[`measuredWidth`]) + 2 * this[`strokeWidth`];
                    },
                    this[`drawTxt`] = function() {
                        return this[`createCanvas`](),
                            this['redraw'] && (this[`redraw`] = !1,
                                this['txtCanvas'][`width`] = this[`measureWidth`](),
                                this[`txtCanvas`][`height`] = this[`fontSize`] + this[`margin`] * 2,
                                this[`txtCtx`][`font`] = this[`font`],
                                this[`txtCtx`][`globalAlpha`] = 1,
                                this[`txtCtx`]['lineWidth'] = this[`strokeWidth`],
                                this[`txtCtx`][`strokeStyle`] = this[`strokeColor`],
                                this[`txtCtx`][`fillStyle`] = this[`color`],
                                this[`stroke`] && this[`txtCtx`][`strokeText`](this[`txt`], this[`strokeWidth`], ~~(this[`fontSize`] + this[`margin`] * 0.5)),
                                this['txtCtx'][`fillText`](this[`txt`], this[`strokeWidth`], ~~(this[`fontSize`] + this[`margin`] * 0.5))),
                            this[`txtCanvas`];
                    };
            }

            function ogarbasicassembly(ogarsettings, more2ogarset, moreogarset, more3ogarset, more4ogarset, ogarbuffed, ogarlanguage, ogaractuallanguage, ogarcomms, ogario1Commands) {
                this['id'] = ogarsettings, this['x'] = more2ogarset, this['y'] = moreogarset, this[`targetX`] = more2ogarset, this[`targetY`] = moreogarset, this[`color`] = more4ogarset, this[`oppColor`] = null, this['size'] = more3ogarset, this[`targetSize`] = more3ogarset, this[`alpha`] = 1, this['nick'] = '', this['targetNick'] = '', this[`nickCanvas`] = null, this[`mass`] = 0, this[`lastMass`] = 0, this[`kMass`] = 0, this['massCanvas'] = null, this['massTxt'] = '', this[`margin`] = 0, this['scale'] = 1, this['nickScale'] = 1, this[`massScale`] = 1, this[`virMassScale`] = 3, this[`strokeScale`] = 1, this[`fontSize`] = 0x1a, this['nickSize'] = 0x1a, this[`lastNickSize`] = 0, this[`massSize`] = 0x1a, this[`virMassSize`] = 0x1a, this[`nickStrokeSize`] = 3, this[`massStrokeSize`] = 3, this[`isFood`] = ogarbuffed, this[`isVirus`] = ogarlanguage, this['isPlayerCell'] = ogaractuallanguage, this[`shortMass`] = ogarcomms, this[`virMassShots`] = ogario1Commands, this[`rescale`] = !1, this[`redrawNick`] = !0, this[`redrawMass`] = !0, this[`optimizedNames`] = !1, this[`optimizedMass`] = !1, this[`strokeNick`] = !1, this[`strokeMass`] = !1, this[`removed`] = !1, this[`redrawed`] = 0, this[`time`] = 0, this[`skin`] = null, this[`pi2`] = 2 * Math['PI'],
                    this.virusColor = null,
                    this.virusStroke = null,
                    this.nHeight = 6,
                    this['update'] = function(ogarsettings, more2ogarset, ogarcanvas, moreogarset, more3ogarset, more4ogarset) {
                        this['x'] = ogarsettings, this['y'] = more2ogarset, this[`isVirus`] = moreogarset, this[`isPlayerCell`] = more3ogarset, this['setMass'](ogarcanvas), this[`setNick`](more4ogarset);
                    }, this[`removeCell`] = function() {
                        this[`removed`] = !0;
                        var ogarsettings = doagarcommand[`cells`]['indexOf'](this); - 1 != ogarsettings ? (doagarcommand[`cells`][`splice`](ogarsettings, 1), ogario1Settings[`virusesRange`] && -1 != (ogarsettings = doagarcommand[`viruses`][`indexOf`](this)) && doagarcommand[`viruses`][`splice`](ogarsettings, 1)) : -1 != (ogarsettings = doagarcommand[`food`][`indexOf`](this)) && doagarcommand[`food`]['splice'](ogarsettings, 1), -1 != (ogarsettings = doagarcommand[`playerCells`][`indexOf`](this)) && (doagarcommand['removePlayerCell'] = !0, doagarcommand[`playerCells`][`splice`](ogarsettings, 1), -1 != (ogarsettings = doagarcommand[`playerCellIDs`][`indexOf`](this['id'])) && doagarcommand[`playerCellIDs`]['splice'](ogarsettings, 1)), this[`redrawed`] && doagarcommand[`removedCells`][`push`](this), delete doagarcommand[`indexedCells`][this['id']];
                    }, this[`moveCell`] = function() {
                        var ogarsettings = (doagarcommand[`time`] - this[`time`]) / ogario1Settings[`animation`];
                        if (ogarsettings = ogarsettings < 0 ? 0 : ogarsettings > 1 ? 1 : ogarsettings, this['x'] += (this[`targetX`] - this['x']) * ogarsettings, this['y'] += (this[`targetY`] - this['y']) * ogarsettings, this[`size`] += (this['targetSize'] - this[`size`]) * ogarsettings, this[`alpha`] = ogarsettings, this[`removed`]) {
                            if (1 == ogarsettings) {
                                var more2ogarset = doagarcommand[`removedCells`][`indexOf`](this); - 1 != more2ogarset && doagarcommand[`removedCells`][`splice`](more2ogarset, 1);
                            }
                        } else this[`time`] = doagarcommand[`time`];
                    }, this[`isInView`] = function() {
                        return !(this['id'] <= 0) && !(this['x'] + this[`size`] + 40 < doagarcommand[`viewX`] - doagarcommand[`canvasWidth`] / 2 / doagarcommand[`scale`] || this['y'] + this[`size`] + 40 < doagarcommand[`viewY`] - doagarcommand['canvasHeight'] / 2 / doagarcommand['scale'] || this['x'] - this[`size`] - 40 > doagarcommand[`viewX`] + doagarcommand[`canvasWidth`] / 2 / doagarcommand[`scale`] || this['y'] - this['size'] - 40 > doagarcommand['viewY'] + doagarcommand[`canvasHeight`] / 2 / doagarcommand[`scale`]);
                    }, this[`setMass`] = function(ogarsettings) {
                        return this[`size`] = ogarsettings, !(ogarsettings <= 40) && (this['massCanvas'] ? (this[`mass`] = ~~(ogarsettings * ogarsettings / 100), this[`redrawMass`] = !0, this[`isVirus`] ? (this[`virMassShots`] && this[`mass`] < 200 && (this[`mass`] = ~~((200 - this[`mass`]) / 14)), this[`massTxt`] = this[`mass`][`toString`](), this.mass > 220 ? (this.virusColor = ogario1ThemeSettings.mVirusColor, this.virusStroke = ogario1ThemeSettings.mVirusStrokeColor) : (this.virusColor = ogario1ThemeSettings.virusColor, this.virusStroke = ogario1ThemeSettings.virusStrokeColor), !0) : (this[`massTxt`] = this[`mass`][`toString`](), this['mass'] <= 200 || (this[`shortMass`] && this['mass'] >= 1000 ? (this[`kMass`] = Math[`round`](this[`mass`] / 100) / 10, this['massTxt'] = this[`kMass`] + 'k', !0) : (this[`optimizedMass`] && (this['redrawMass'] = Math[`abs`]((this[`mass`] - this[`lastMass`]) / this[`mass`]) >= 0.02 || this[`rescale`]), !0)))) : (this[`massCanvas`] = new ogarcanvasrenderfromagario(), !1));
                    }, this[`setNick`] = function(ogarsettings) {
                        return this[`nick`] = ogarsettings, !(!ogarsettings || this[`isVirus`]) && (!!this[`nickCanvas`] || (this[`nickCanvas`] = new ogarcanvasrenderfromagario(), !1));
                    }, this['setScale'] = function(ogarsettings, more2ogarset, ogarcanvas, moreogarset, more3ogarset) {
                        var more4ogarset = Math[`ceil`](10 * ogarsettings) / 10;
                        this[`rescale`] = !1, this['scale'] != more4ogarset && (this[`scale`] = more4ogarset, this['rescale'] = !0), this[`nickScale`] = more2ogarset, this['massScale'] = ogarcanvas, this[`virMassScale`] = moreogarset, this[`strokeScale`] = more3ogarset;
                    }, this[`setFontSize`] = function() {
                        this[`isVirus`] ? this[`massSize`] = Math[`ceil`](this[`virMassSize`] * this[`scale`] * this[`virMassScale`]) : (this[`fontSize`] = Math[`max`](0.3 * this['size'], 0x1a) * this[`scale`], this[`nickSize`] = ~~(this[`fontSize`] * this[`nickScale`]), this[`massSize`] = ~~(0.5 * this[`fontSize`] * this[`massScale`]), this[`optimizedNames`] ? this[`redrawNick`] = Math[`abs`]((this[`nickSize`] - this['lastNickSize']) / this['nickSize']) >= 0.3 || this['rescale'] : this[`redrawNick`] = !0);
                    }, this['setStrokeSize'] = function() {
                        this[`strokeNick`] && !this[`isVirus`] && (this[`nickStrokeSize`] = ~~(0.1 * this[`nickSize`] * this[`strokeScale`])), this[`strokeMass`] && (this[`massStrokeSize`] = ~~(0.1 * this[`massSize`] * this[`strokeScale`]));
                    }, this['setDrawing'] = function() {
                        this[`optimizedNames`] = ogario1Settings[`optimizedNames`], this['optimizedMass'] = ogario1Settings['optimizedMass'], this[`shortMass`] = ogario1Settings['shortMass'], this[`virMassShots`] = ogario1Settings[`virMassShots`], this['strokeNick'] = ogario1Settings['namesStroke'], this[`strokeMass`] = ogario1Settings[`massStroke`];
                    }, this[`setDrawingScale`] = function() {
                        this[`setScale`](ogarcanvas[`viewScale`], ogario1ThemeSettings[`namesScale`], ogario1ThemeSettings[`massScale`], ogario1ThemeSettings[`virMassScale`], ogario1ThemeSettings[`strokeScale`]), this[`setFontSize`](), this[`setStrokeSize`](), this[`margin`] = 0;
                    }, this['drawNick'] = function(mainCanvas) {
                        if (this['nick'] && this['nickCanvas'] && !this[`isVirus`]) {
                            var nickCanvas = this[`nickCanvas`];
                            nickCanvas[`setDrawing`](ogario1ThemeSettings[`namesColor`], ogario1ThemeSettings[`namesFontFamily`], ogario1ThemeSettings[`namesFontWeight`], this[`strokeNick`], this[`nickStrokeSize`], ogario1ThemeSettings[`namesStrokeColor`]), nickCanvas[`setTxt`](this['nick']), this[`redrawNick`] && (nickCanvas[`setFontSize`](this[`nickSize`]), this[`lastNickSize`] = this['nickSize']), nickCanvas[`setScale`](this[`scale`]);
                            const nickImg = nickCanvas.drawTxt(),
                                w = ~~(nickImg.width / this.scale),
                                h = ~~(nickImg.height / this.scale);
                            this.margin = ~~(h / 2);
                            if (w > 1 && h > 1) {
                                mainCanvas.drawImage(nickImg, ~~(this.x - w / 2), ~~this.y - this.margin, w, h);
                            }
                        }
                    }, this[`drawMass`] = function(mainCanvas) {
                        if (this[`massCanvas`] && !(this[`size`] <= 40)) {
                            var massCanvas = this[`massCanvas`];
                            massCanvas['setDrawing'](ogario1ThemeSettings[`massColor`], ogario1ThemeSettings['massFontFamily'], ogario1ThemeSettings['massFontWeight'], this[`strokeMass`], this['massStrokeSize'], ogario1ThemeSettings[`massStrokeColor`]), this['redrawMass'] && (massCanvas[`setTxt`](this[`massTxt`]), this[`lastMass`] = this[`mass`]), massCanvas[`setFontSize`](this[`massSize`]), massCanvas[`setScale`](this['scale']);
                            let massImg = massCanvas.drawTxt(),
                                w = ~~(massImg.width / this.scale),
                                h = ~~(massImg.height / this.scale),
                                ogartempmassraw = this.margin === 0 ? ~~(this.y - h / 2) : ~~this.y + this.margin;
                            if (w > 1 && h > 1) {
                                mainCanvas.drawImage(massImg, ~~(this.x - w / 2), ogartempmassraw, w, h);
                            }
                        }
                    },
                    this.createStrokeVirusPath = function(_x, _y, _radius, width = 6) {
                        const nAngelsOfVirus = ~~(45 * _radius / 98),
                            angleStep2 = this.pi2 / nAngelsOfVirus,
                            angleStep = angleStep2 / 2,
                            ptx = new Path2D(),
                            radius = _radius - width,
                            p1 = radius + this.nHeight,
                            len = this.pi2 + angleStep2;
                        for (let a1 = 0, a2 = angleStep; a1 <= len; a2 = ((a1 += angleStep2) + angleStep)) {
                            ptx.lineTo(~~(_x + radius * Math.sin(a1)), ~~(_y + radius * Math.cos(a1)));
                            ptx.lineTo(~~(_x + p1 * Math.sin(a2)), ~~(_y + p1 * Math.cos(a2)));
                        }
                        return ptx;
                    },
                    this[`draw`] = function(ogarsettings, more2ogarset) {
                        if (!(doagarcommand[`hideSmallBots`] && this['size'] <= 36)) {
                            ogarsettings[`save`](), this['redrawed']++, more2ogarset && this[`moveCell`](), this['removed'] && (ogarsettings['globalAlpha'] *= 1 - this[`alpha`]);
                            var ogarcanvas = ogarsettings[`globalAlpha`],
                                moreogarset = !1,
                                more3ogarset = this[`isFood`] ? this[`size`] + ogario1ThemeSettings[`foodSize`] : this[`size`];
                            if (ogarsettings[`beginPath`](), ogarsettings[`arc`](this['x'], this['y'], more3ogarset, 0, this[`pi2`], !1), ogarsettings[`closePath`](), this[`isFood`]) return ogarsettings[`fillStyle`] = this[`color`], ogarsettings[`fill`](), void ogarsettings[`restore`]();
                            if (this[`isVirus`]) {
                                return ogario1Settings[`transparentViruses`] && (ogarsettings[`globalAlpha`] *= ogario1ThemeSettings[`virusAlpha`], moreogarset = !0), ogario1Settings['virColors'] && doagarcommand[`play`] ? (ogarsettings['fillStyle'] = ogarminimapdrawer[`setVirusColor`](more3ogarset), ogarsettings['strokeStyle'] = ogarminimapdrawer[`setVirusStrokeColor`](more3ogarset)) : (ogarsettings['fillStyle'] = this.virusColor, ogarsettings[`strokeStyle`] = this.virusStroke), ogarsettings[`fill`](), moreogarset && (ogarsettings['globalAlpha'] = ogarcanvas, moreogarset = !1), ogarsettings['lineWidth'] = ogario1ThemeSettings[`virusStrokeSize`], ogarsettings[`stroke`](this.createStrokeVirusPath(this.x, this.y, this.size - 2, 6)), ogario1Settings['showMass'] && (this[`setDrawing`](), this[`setDrawingScale`](), this['setMass'](this['size']), this['drawMass'](ogarsettings)), void ogarsettings[`restore`]();
                            }
                            ogario1Settings[`transparentCells`] && (ogarsettings[`globalAlpha`] *= ogario1ThemeSettings[`cellsAlpha`], moreogarset = !0);
                            var more4ogarset = this[`color`];
                            doagarcommand[`play`] && (this[`isPlayerCell`] ? ogario1Settings[`myCustomColor`] && (more4ogarset = ogarcopythelb[`color`]) : ogario1Settings[`oppColors`] && !ogario1Settings[`oppRings`] && (more4ogarset = this['oppColor'])), ogarsettings[`fillStyle`] = more4ogarset, ogarsettings[`fill`](), moreogarset && (ogarsettings['globalAlpha'] = ogarcanvas, moreogarset = !1);
                            var ogarbuffed = null;
                            if (ogario1Settings['customSkins'] && doagarcommand['showCustomSkins'] && (ogarbuffed = ogarminimapdrawer['getCustomSkin'](this['targetNick'], this['color'])) && (((ogario1Settings[`transparentSkins`] || doagarcommand[`play`] && ogario1Settings[`oppColors`]) && (!this[`isPlayerCell`] || ogario1Settings['myTransparentSkin']) || this['isPlayerCell'] && ogario1Settings['myTransparentSkin']) && (ogarsettings[`globalAlpha`] *= ogario1ThemeSettings[`skinsAlpha`], moreogarset = !0), ogarsettings[`drawImage`](ogarbuffed, this['x'] - more3ogarset, this['y'] - more3ogarset, 2 * more3ogarset, 2 * more3ogarset), moreogarset && (ogarsettings[`globalAlpha`] = ogarcanvas, moreogarset = !1)), ogario1Settings[`teammatesInd`] && !this[`isPlayerCell`] && more3ogarset <= 200 && (ogarbuffed || ogarminimapdrawer[`checkSkinsMap`](this[`targetNick`], this[`color`])) && ogarfooddrawer[`drawTeammatesInd`](ogarsettings, this['x'], this['y'], more3ogarset), ogario1Settings[`noNames`] && !ogario1Settings[`showMass`] || more2ogarset) ogarsettings['restore']();
                            else {
                                var ogarlanguage = !1;
                                !this[`isPlayerCell`] && (ogarlanguage = ogarminimapdrawer[`setAutoHideCellInfo`](more3ogarset)) && ogario1Settings[`autoHideNames`] && ogario1Settings[`autoHideMass`] ? ogarsettings[`restore`]() : (this[`setDrawing`](), this['setDrawingScale'](), ogarsettings[`globalAlpha`] *= ogario1ThemeSettings[`textAlpha`], ogario1Settings['noNames'] || ogarlanguage && ogario1Settings[`autoHideNames`] || this[`isPlayerCell`] && ogario1Settings[`hideMyName`] || ogarbuffed && ogario1Settings[`hideTeammatesNames`] || this[`setNick`](this[`targetNick`]) && this[`drawNick`](ogarsettings), !ogario1Settings[`showMass`] || ogarlanguage && ogario1Settings[`autoHideMass`] || this[`isPlayerCell`] && ogario1Settings[`hideMyMass`] || ogario1Settings[`hideEnemiesMass`] && !this[`isPlayerCell`] && !this[`isVirus`] || this[`setMass`](this[`size`]) && this[`drawMass`](ogarsettings), ogarsettings[`restore`]());
                            }
                        }
                    };
            }
            var doagarcommand = {
                'ws': null,
                'socket': null,
                'protocolKey': null,
                'clientKey': null,
                'connectionOpened': !1,
                'accessTokenSent': !1,
                'clientVersion': 0x76c0,
                'clientVersionString': '3.4.0',
                'time': Date[`now`](),
                'serverTime': 0,
                'serverTimeDiff': 0,
                'loggedInTime': 0,
                'mapSize': 0x373e,
                'mapOffset': 7071,
                'mapOffsetX': 0,
                'mapOffsetY': 0,
                'mapOffsetFixed': !1,
                'mapMinX': -7071,
                'mapMinY': -7071,
                'mapMaxX': 7071,
                'mapMaxY': 7071,
                'viewMinX': 0,
                'viewMinY': 0,
                'viewMaxX': 0,
                'viewMaxY': 0,
                'canvasWidth': 0,
                'canvasHeight': 0,
                'canvasScale': 1,
                'indexedCells': {},
                'cells': [],
                'removedCells': [],
                'food': [],
                'viruses': [],
                'playerCells': [],
                'playerCellIDs': [],
                'ghostCells': [],
                'playerX': 0,
                'playerY': 0,
                'playerSize': 0,
                'playerMass': 0,
                'playerMaxMass': 0,
                'playerMinMass': 0,
                'playerScore': 0,
                'playerSplitCells': 0,
                'playerColor': null,
                'playerNick': '',
                'playerPosition': 0,
                'leaderboard': [],
                'biggerSTECellsCache': [],
                'biggerCellsCache': [],
                'smallerCellsCache': [],
                'STECellsCache': [],
                'STE': 0,
                'autoZoom': !1,
                'zoomValue': 0.1,
                'viewX': 0,
                'viewY': 0,
                'scale': 1,
                'viewScale': 1,
                'clientX': 0,
                'clientY': 0,
                'cursorX': 0,
                'cursorY': 0,
                'targetX': 0,
                'targetY': 0,
                'targetDistance': 0,
                'battleRoyale': {
                    'state': 0,
                    'players': 0,
                    'startTime': 0,
                    'shrinkTime': 0,
                    'timeLeft': 0,
                    'x': 0,
                    'y': 0,
                    'radius': 0,
                    'targetX': 0,
                    'targetY': 0,
                    'targetRadius': 0,
                    'maxRadius': 11313,
                    'rank': [],
                    'playerRank': 0,
                    'joined': !1
                },
                'play': !1,
                'pause': !1,
                'targeting': !1,
                'removePlayerCell': !1,
                'showCustomSkins': !0,
                'showFood': !0,
                'foodIsHidden': !1,
                'selectBiggestCell': !0,
                'hideSmallBots': !1,
                'pressedKeys': {},
                'connect': function(ogarsettings) {
                    console['log'](`[Legend mod Express] Connecting to game server:`, ogarsettings);
                    var ogarcanvas = this;
                    this[`closeConnection`](), this[`flushCellsData`](), this[`protocolKey`] = null, this[`clientKey`] = null, this[`accessTokenSent`] = !1, this[`connectionOpened`] = !1, this[`mapOffsetFixed`] = !1, this[`leaderboard`] = [], this['ws'] = ogarsettings, this[`socket`] = new WebSocket(ogarsettings), this['socket'][`binaryType`] = `arraybuffer`, this[`socket`][`onopen`] = function() {
                        ogarcanvas[`onOpen`]();
                    }, this[`socket`][`onmessage`] = function(ogarsettings) {
                        ogarcanvas['onMessage'](ogarsettings);
                    }, this['socket'][`onerror`] = function(ogarsettings) {
                        ogarcanvas[`onError`](ogarsettings);
                    }, this['socket']['onclose'] = function(ogarsettings) {
                        ogarcanvas[`onClose`](ogarsettings);
                    }, ogarminimapdrawer[`getWS`](this['ws']), ogarminimapdrawer['sendServerJoin'](), ogarminimapdrawer[`sendServerData`](), ogarminimapdrawer[`displayLeaderboard`](''), more2ogarset[`master`] && more2ogarset[`master`][`onConnect`] && more2ogarset[`master`][`onConnect`]();
                },
                'onOpen': function(ogarsettings) {
                    console[`log`](`[Legend mod Express] Game server socket open`), this[`time`] = Date[`now`]();
                    var more2ogarset = this[`createView`](5);
                    more2ogarset[`setUint8`](0, 254), more2ogarset['setUint32'](1, 20, !0), this[`sendMessage`](more2ogarset), (more2ogarset = this['createView'](5))[`setUint8`](0, 255), more2ogarset[`setUint32`](1, this[`clientVersion`], !0), this[`sendMessage`](more2ogarset), this[`connectionOpened`] = !0;
                },
                'onMessage': function(ogarsettings) {
                    ogarsettings = new DataView(ogarsettings[`data`]), this[`protocolKey`] && (ogarsettings = this[`shiftMessage`](ogarsettings, this['protocolKey'] ^ this[`clientVersion`])), this['handleMessage'](ogarsettings);
                },
                'onError': function(ogarsettings) {
                    console[`log`](`[Legend mod Express] Game server socket error`), this[`flushCellsData`](), more2ogarset[`master`] && more2ogarset[`master`][`onDisconnect`] && more2ogarset[`master`][`onDisconnect`]();
                },
                'onClose': function(ogarsettings) {
                    console['log'](`[Legend mod Express] Game server socket close`), this[`flushCellsData`](), more2ogarset[`master`] && more2ogarset[`master`][`onDisconnect`] && more2ogarset[`master`]['onDisconnect']();
                },
                'closeConnection': function() {
                    if (this[`socket`]) {
                        this[`socket`][`onopen`] = null, this[`socket`][`onmessage`] = null, this[`socket`][`onerror`] = null, this['socket'][`onclose`] = null;
                        try {
                            this[`socket`]['close']();
                        } catch (ogarcloseconncloser) {}
                        this[`socket`] = null, this['ws'] = null;
                    }
                },
                'isSocketOpen': function() {
                    return null !== this[`socket`] && this[`socket`][`readyState`] === this[`socket`][`OPEN`];
                },
                'createView': function(ogarsettings) {
                    return new DataView(new ArrayBuffer(ogarsettings));
                },
                'sendBuffer': function(ogarsettings) {
                    this[`socket`][`send`](ogarsettings[`buffer`]);
                },
                'sendMessage': function(ogarsettings) {
                    if (this[`connectionOpened`]) {
                        if (!this[`clientKey`]) return;
                        ogarsettings = this[`shiftMessage`](ogarsettings, this['clientKey']), this[`clientKey`] = this[`shiftKey`](this['clientKey']);
                    }
                    this[`sendBuffer`](ogarsettings);
                },
                'sendAction': function(ogarsettings) {
                    if (this[`isSocketOpen`]()) {
                        var more2ogarset = this[`createView`](1);
                        more2ogarset[`setUint8`](0, ogarsettings), this[`sendMessage`](more2ogarset);
                    }
                },
                'sendSpectate': function() {
                    this[`sendAction`](1);
                },
                'sendFreeSpectate': function() {
                    this['sendAction'](18);
                },
                'sendEject': function() {
                    this[`sendPosition`](), this[`sendAction`](21);
                },
                'sendSplit': function() {
                    this[`sendPosition`](), this[`sendAction`](17);
                },
                'sendNick': function(ogarsettings) {
                    this[`playerNick`] = ogarsettings, ogarsettings = more2ogarset[`unescape`](more2ogarset[`encodeURIComponent`](ogarsettings));
                    var ogarcanvas = this[`createView`](1 + ogarsettings[`length`]);
                    ogarcanvas[`setUint8`](0, 0);
                    for (var moreogarset = 0; moreogarset < ogarsettings['length']; moreogarset++) ogarcanvas[`setUint8`](moreogarset + 1, ogarsettings[`charCodeAt`](moreogarset));
                    this[`sendMessage`](ogarcanvas);
                },
                'sendPosition': function() {
                    if (this[`isSocketOpen`]() && this[`connectionOpened`] && this[`clientKey`]) {
                        var ogarsettings = this[`cursorX`],
                            more2ogarset = this['cursorY'];
                        (!this['play'] && this[`targeting`] || this[`pause`]) && (ogarsettings = this['targetX'], more2ogarset = this[`targetY`]);
                        var ogarcanvas = this['createView'](13);
                        ogarcanvas[`setUint8`](0, 16), ogarcanvas[`setInt32`](1, ogarsettings, !0), ogarcanvas['setInt32'](5, more2ogarset, !0), ogarcanvas[`setUint32`](9, this['protocolKey'], !0), this['sendMessage'](ogarcanvas);
                    }
                },
                'sendAccessToken': function(ogarsettings, more2ogarset, ogarcanvas) {
                    if (!this[`accessTokenSent`]) {
                        ogarcanvas || (ogarcanvas = 102);
                        for (var moreogarset = ogarsettings[`length`], more3ogarset = this[`clientVersionString`]['length'], more4ogarset = [ogarcanvas, 8, 1, 18, moreogarset + more3ogarset + 23, 1, 8, 10, 0x52, moreogarset + more3ogarset + 18, 1, 8, more2ogarset, 18, more3ogarset + 8, 8, 5, 18, more3ogarset], ogarbuffed = 0; ogarbuffed < more3ogarset; ogarbuffed++) more4ogarset[`push`](this[`clientVersionString`]['charCodeAt'](ogarbuffed));
                        for (more4ogarset[`push`](24, 0, 32, 0, 0x1a, moreogarset + 3, 1, 10, moreogarset, 1), ogarbuffed = 0; ogarbuffed < moreogarset; ogarbuffed++) more4ogarset['push'](ogarsettings['charCodeAt'](ogarbuffed));
                        more4ogarset = new Uint8Array(more4ogarset);
                        var ogarlanguage = new DataView(more4ogarset[`buffer`]);
                        this[`sendMessage`](ogarlanguage);
                    }
                },
                'sendFbToken': function(ogarsettings) {
                    this['sendAccessToken'](ogarsettings, 2);
                },
                'sendGplusToken': function(ogarsettings) {
                    this['sendAccessToken'](ogarsettings, 3);
                },
                'sendRecaptcha': function(ogarsettings) {
                    var more2ogarset = this[`createView`](2 + ogarsettings['length']);
                    more2ogarset[`setUint8`](0, 86);
                    for (var ogarcanvas = 0; ogarcanvas < ogarsettings[`length`]; ogarcanvas++) more2ogarset[`setUint8`](1 + ogarcanvas, ogarsettings[`charCodeAt`](ogarcanvas));
                    more2ogarset[`setUint8`](ogarsettings[`length`] + 1, 0), this[`sendMessage`](more2ogarset);
                },
                'setClientVersion': function(ogarsettings, more2ogarset) {
                    this[`clientVersion`] = ogarsettings, this[`clientVersionString`] = more2ogarset, console[`log`]('[Legend mod Express] Client version:', ogarsettings, more2ogarset);
                },
                'generateClientKey': function(ogarsettings, more2ogarset) {
                    if (!ogarsettings['length'] || !more2ogarset[`byteLength`]) return null;
                    for (var ogarcanvas = null, moreogarset = 1540483477, more3ogarset = ogarsettings[`match`](/(ws+:\/\/)([^:]*)(:\d+)/)[2], more4ogarset = more3ogarset[`length`] + more2ogarset['byteLength'], ogarbuffed = new Uint8Array(more4ogarset), ogarlanguage = 0; ogarlanguage < more3ogarset[`length`]; ogarlanguage++) ogarbuffed[ogarlanguage] = more3ogarset[`charCodeAt`](ogarlanguage);
                    ogarbuffed[`set`](more2ogarset, more3ogarset[`length`]);
                    for (var ogaractuallanguage = new DataView(ogarbuffed[`buffer`]), ogarcomms = more4ogarset - 1, ogario1Commands = 4 + (ogarcomms - 4 & -4) | 0, ogarparsedchars = 255 ^ ogarcomms, ogarparsedemoticons = 0; ogarcomms > 3;) ogarcanvas = 0 | Math['imul'](ogaractuallanguage[`getInt32`](ogarparsedemoticons, !0), moreogarset), ogarparsedchars = (0 | Math[`imul`](ogarcanvas >>> 24 ^ ogarcanvas, moreogarset)) ^ (0 | Math[`imul`](ogarparsedchars, moreogarset)), ogarcomms -= 4, ogarparsedemoticons += 4;
                    switch (ogarcomms) {
                        case 3:
                            ogarparsedchars = ogarbuffed[ogario1Commands + 2] << 16 ^ ogarparsedchars, ogarparsedchars = ogarbuffed[ogario1Commands + 1] << 8 ^ ogarparsedchars;
                            break;
                        case 2:
                            ogarparsedchars = ogarbuffed[ogario1Commands + 1] << 8 ^ ogarparsedchars;
                            break;
                        case 1:
                            break;
                        default:
                            ogarcanvas = ogarparsedchars;
                    }
                    return ogarcanvas != ogarparsedchars && (ogarcanvas = 0 | Math[`imul`](ogarbuffed[ogario1Commands] ^ ogarparsedchars, moreogarset)), ogarcanvas ^= ogarparsedchars = ogarcanvas >>> 13, ogarcanvas = 0 | Math[`imul`](ogarcanvas, moreogarset), ogarcanvas ^= ogarparsedchars = ogarcanvas >>> 15, console[`log`]('[Legend mod Express] Generated client key:', ogarcanvas), ogarcanvas;
                },
                'shiftKey': function(ogarsettings) {
                    return ogarsettings = 0 | Math['imul'](ogarsettings, 1540483477), ogarsettings = 114296087 ^ (0 | Math[`imul`](ogarsettings >>> 24 ^ ogarsettings, 1540483477)), (ogarsettings = 0 | Math[`imul`](ogarsettings >>> 13 ^ ogarsettings, 1540483477)) >>> 15 ^ ogarsettings;
                },
                'shiftMessage': function(ogarsettings, more2ogarset, ogarcanvas) {
                    if (ogarcanvas)
                        for (moreogarset = 0; moreogarset < ogarsettings[`length`]; moreogarset++) ogarsettings['writeUInt8'](ogarsettings['readUInt8'](moreogarset) ^ more2ogarset >>> moreogarset % 4 * 8 & 255, moreogarset);
                    else
                        for (var moreogarset = 0; moreogarset < ogarsettings[`byteLength`]; moreogarset++) ogarsettings[`setUint8`](moreogarset, ogarsettings[`getUint8`](moreogarset) ^ more2ogarset >>> moreogarset % 4 * 8 & 255);
                    return ogarsettings;
                },
                'decompressMessage': function(ogarsettings) {
                    var more2ogarset = new more3ogarset(ogarsettings['buffer']),
                        ogarcanvas = new more3ogarset(more2ogarset[`readUInt32LE`](1));
                    return more4ogarset[`decodeBlock`](more2ogarset[`slice`](5), ogarcanvas), ogarcanvas;
                },
                'handleMessage': function(ogarsettings) {
                    var ogarcanvas = function() {
                            for (var more2ogarset = '';;) {
                                var ogarcanvas = ogarsettings[`getUint8`](moreogarset++);
                                if (0 == ogarcanvas) break;
                                more2ogarset += String[`fromCharCode`](ogarcanvas);
                            }
                            return more2ogarset;
                        },
                        moreogarset = 0,
                        more3ogarset = ogarsettings['getUint8'](moreogarset++);
                    switch (54 == more3ogarset && (more3ogarset = 53), more3ogarset) {
                        case 5:
                            break;
                        case 17:
                            this[`viewX`] = ogarsettings['getFloat32'](moreogarset, !0), moreogarset += 4, this['viewY'] = ogarsettings[`getFloat32`](moreogarset, !0), moreogarset += 4, this[`scale`] = ogarsettings[`getFloat32`](moreogarset, !0);
                            break;
                        case 18:
                            this[`protocolKey`] && (this[`protocolKey`] = this[`shiftKey`](this[`protocolKey`])), this[`flushCellsData`]();
                            break;
                        case 32:
                            this[`playerCellIDs`][`push`](ogarsettings[`getUint32`](moreogarset, !0)), this[`play`] || (this[`play`] = !0, ogarminimapdrawer[`hideMenu`](), this[`playerColor`] = null, ogarminimapdrawer[`onPlayerSpawn`]());
                            break;
                        case 50:
                            this[`pieChart`] = [];
                            var more4ogarset = ogarsettings[`getUint32`](moreogarset, !0);
                            moreogarset += 4;
                            for (var ogarbuffed = 0; ogarbuffed < more4ogarset; ogarbuffed++) this[`pieChart`][`push`](ogarsettings[`getFloat32`](moreogarset, !0)), moreogarset += 4;
                            ogarfooddrawer[`drawPieChart`]();
                            break;
                        case 53:
                            if (this[`leaderboard`] = [], this[`playerPosition`] = 0, 54 == ogarsettings[`getUint8`](0)) {
                                ogarsettings[`getUint16`](moreogarset, !0);
                                moreogarset += 2;
                            }
                            for (var ogarlanguage = 0; moreogarset < ogarsettings[`byteLength`];) {
                                var ogaractuallanguage = '',
                                    ogarcomms = 0,
                                    ogario1Commands = !1;
                                ogarlanguage++, 2 & (csssettings = ogarsettings['getUint8'](moreogarset++)) && (ogaractuallanguage = more2ogarset[`decodeURIComponent`](escape(ogarcanvas()))), 4 & csssettings && (ogarcomms = ogarsettings[`getUint32`](moreogarset, !0), moreogarset += 4), 8 & csssettings && (ogaractuallanguage = this['playerNick'], ogarcomms = `isPlayer`, this[`playerPosition`] = ogarlanguage), 16 & csssettings && (ogario1Commands = !0), this[`leaderboard`][`push`]({
                                    'nick': ogaractuallanguage,
                                    'id': ogarcomms,
                                    'isFriend': ogario1Commands
                                });
                            }
                            this[`handleLeaderboard`]();
                            break;
                        case 54:
                            break;
                        case 69:
                            var ogarparsedchars = ogarsettings[`getUint16`](moreogarset, !0);
                            moreogarset += 2, this['ghostCells'] = [];
                            for (ogarbuffed = 0; ogarbuffed < ogarparsedchars; ogarbuffed++) {
                                var ogarparsedemoticons = ogarsettings[`getInt32`](moreogarset, !0);
                                moreogarset += 4;
                                var ogarsets1 = ogarsettings[`getInt32`](moreogarset, !0);
                                moreogarset += 4;
                                var moremenusets = ogarsettings[`getUint32`](moreogarset, !0);
                                moreogarset += 5;
                                var ogario1ThemeSettings = ~~Math['sqrt'](100 * moremenusets);
                                this[`ghostCells`][`push`]({
                                    'x': ogarparsedemoticons,
                                    'y': ogarsets1,
                                    'size': ogario1ThemeSettings,
                                    'mass': moremenusets,
                                    'inView': this[`isInView`](ogarparsedemoticons, ogarsets1, ogario1ThemeSettings)
                                });
                            }
                            break;
                        case 85:
                            console[`log`](`[Legend mod Express] Captcha requested`), more2ogarset[`master`] && more2ogarset[`master`][`recaptchaRequested`] && more2ogarset[`master`][`recaptchaRequested`]();
                            break;
                        case 102:
                            ogarsettings['byteLength'] < 20 && more2ogarset[`logout`] && more2ogarset[`logout`]();
                            break;
                        case 103:
                            this['loggedInTime'] = Date['now'](), this['accessTokenSent'] = !0;
                            break;
                        case 114:
                        case 161:
                            break;
                        case 176:
                            this[`battleRoyale`][`startTime`] = ogarsettings['getUint32'](moreogarset, !0);
                            break;
                        case 177:
                            this[`battleRoyale`][`joined`] = !0;
                            break;
                        case 178:
                            this[`battleRoyale`]['players'] = ogarsettings[`getUint16`](moreogarset, !0), moreogarset += 2;
                            var csssettings = ogarsettings[`getUint16`](moreogarset, !0);
                            moreogarset += 2, csssettings || (this[`battleRoyale`]['state'] = 0, this['battleRoyale'][`joined`] = !1), 3 & csssettings && (this[`battleRoyale`][`state`] = ogarsettings[`getUint8`](moreogarset++), this[`battleRoyale`]['x'] = ogarsettings['getInt32'](moreogarset, !0), moreogarset += 4, this[`battleRoyale`]['y'] = ogarsettings['getInt32'](moreogarset, !0), moreogarset += 4, this[`battleRoyale`][`radius`] = ogarsettings[`getUint32`](moreogarset, !0), moreogarset += 4, this[`battleRoyale`][`shrinkTime`] = 1000 * ogarsettings[`getUint32`](moreogarset, !0), moreogarset += 4, this[`battleRoyale`]['shrinkTime'] && (this[`battleRoyale`][`timeLeft`] = ~~((this[`battleRoyale`]['shrinkTime'] - Date[`now`]() + this[`serverTimeDiff`]) / 1000), this[`battleRoyale`][`timeLeft`] < 0 && (this[`battleRoyale`][`timeLeft`] = 0))), 2 & csssettings && (this[`battleRoyale`][`targetX`] = ogarsettings[`getInt32`](moreogarset, !0), moreogarset += 4, this['battleRoyale'][`targetY`] = ogarsettings[`getInt32`](moreogarset, !0), moreogarset += 4, this[`battleRoyale`][`targetRadius`] = ogarsettings['getUint32'](moreogarset, !0));
                            break;
                        case 179:
                            csssettings = ogarsettings[`getUint8`](moreogarset), more2ogarset[`decodeURIComponent`](escape(ogarcanvas()));
                            csssettings || more2ogarset['decodeURIComponent'](escape(ogarcanvas()));
                            break;
                        case 180:
                            this[`battleRoyale`]['joined'] = !1, this[`battleRoyale`][`rank`] = [], this[`battleRoyale`]['playerRank'] = ogarsettings[`getUint32`](moreogarset, !0), moreogarset += 8;
                            var ogario1PlayerProfiles = ogarsettings[`getUint16`](moreogarset, !0);
                            moreogarset += 2;
                            for (ogarbuffed = 0; ogarbuffed < ogario1PlayerProfiles; ogarbuffed++) {
                                var ogarcopythelb = more2ogarset[`decodeURIComponent`](escape(ogarcanvas())),
                                    ogario1Settings = ogarsettings[`getUint32`](moreogarset, !0);
                                moreogarset += 4, this[`battleRoyale`][`rank`]['push']({
                                    'place': ogario1Settings,
                                    'name': ogarcopythelb
                                });
                            }
                            break;
                        case 226:
                            break;
                        case 241:
                            this['protocolKey'] = ogarsettings[`getUint32`](moreogarset, !0), console[`log`](`[Legend mod Express] Received protocol key:`, this[`protocolKey`]);
                            var ogarcanvasrenderfromagario = new Uint8Array(ogarsettings[`buffer`], moreogarset += 4);
                            this[`clientKey`] = this[`generateClientKey`](this['ws'], ogarcanvasrenderfromagario), more2ogarset[`master`] && more2ogarset[`master`][`login`] && more2ogarset[`master`][`login`]();
                            break;
                        case 242:
                            this[`serverTime`] = 1000 * ogarsettings[`getUint32`](moreogarset, !0), this[`serverTimeDiff`] = Date['now']() - this[`serverTime`];
                            break;
                        case 255:
                            this[`handleSubmessage`](ogarsettings);
                            break;
                        default:
                            console['log']('[Legend mod Express] Unknown opcode:', ogarsettings[`getUint8`](0));
                    }
                },
                'handleSubmessage': function(ogarsettings) {
                    var more2ogarset = 0;
                    switch ((ogarsettings = this['decompressMessage'](ogarsettings))['readUInt8'](more2ogarset++)) {
                        case 16:
                            this[`updateCells`](ogarsettings, more2ogarset);
                            break;
                        case 64:
                            this[`viewMinX`] = ogarsettings[`readDoubleLE`](more2ogarset), more2ogarset += 8, this[`viewMinY`] = ogarsettings[`readDoubleLE`](more2ogarset), more2ogarset += 8, this['viewMaxX'] = ogarsettings[`readDoubleLE`](more2ogarset), more2ogarset += 8, this['viewMaxY'] = ogarsettings[`readDoubleLE`](more2ogarset), this[`setMapOffset`](this[`viewMinX`], this[`viewMinY`], this[`viewMaxX`], this[`viewMaxY`]);
                            break;
                        default:
                            console[`log`]('[Legend mod Express] Unknown sub opcode:', ogarsettings[`readUInt8`](0));
                    }
                },
                'handleLeaderboard': function() {
                    for (var ogarsettings = '', more2ogarset = '', ogarcanvas = 0; ogarcanvas < this['leaderboard'][`length`] && 10 != ogarcanvas; ogarcanvas++) {
                        var moreogarset = '<span>';
                        'isPlayer' === this[`leaderboard`][ogarcanvas]['id'] ? moreogarset = '<span class=\"me\">' : ogarcopythelb['clanTag'][`length`] && 0 == this[`leaderboard`][ogarcanvas][`nick`][`indexOf`](ogarcopythelb[`clanTag`]) && (moreogarset = `<span class=\"teammate\">`), ogarsettings += moreogarset + (ogarcanvas + 1) + '. ' + ogarminimapdrawer[`escapeHTML`](this['leaderboard'][ogarcanvas]['nick']) + `</span>`;
                    }
                    if (this[`playerPosition`] > 10 && (ogarsettings += '<span class=\"me\">' + this[`playerPosition`] + '. ' + ogarminimapdrawer[`escapeHTML`](this['playerNick']) + `</span>`), ogario1Settings[`showLbData`])
                        for (var more3ogarset = 0; more3ogarset < this[`ghostCells`][`length`] && more3ogarset != ogarcanvas; more3ogarset++) more2ogarset += '<span class=\"lb-data\">', more2ogarset += `<span class=\"top5-mass-color\">[` + ogarminimapdrawer[`shortMassFormat`](this['ghostCells'][more3ogarset][`mass`]) + `]</span>`, more2ogarset += `<span class=\"hud-main-color\">[` + ogarminimapdrawer[`calculateMapSector`](this[`ghostCells`][more3ogarset]['x'], this[`ghostCells`][more3ogarset]['y']) + `]</span>`, more2ogarset += `</span>`;
                    ogarminimapdrawer[`displayLeaderboard`](ogarsettings, more2ogarset);
                },
                'flushCellsData': function() {
                    this[`indexedCells`] = {}, this[`cells`] = [], this[`playerCells`] = [], this[`playerCellIDs`] = [], this[`ghostCells`] = [], this[`food`] = [], this[`viruses`] = [];
                },
                'setMapOffset': function(ogarsettings, more2ogarset, ogarcanvas, moreogarset) {
                    ogarcanvas - ogarsettings > 14000 && moreogarset - more2ogarset > 14000 && (this[`mapOffsetX`] = this[`mapOffset`] - ogarcanvas, this[`mapOffsetY`] = this[`mapOffset`] - moreogarset, this[`mapMinX`] = ~~(-this[`mapOffset`] - this[`mapOffsetX`]), this[`mapMinY`] = ~~(-this[`mapOffset`] - this[`mapOffsetY`]), this[`mapMaxX`] = ~~(this[`mapOffset`] - this['mapOffsetX']), this[`mapMaxY`] = ~~(this[`mapOffset`] - this['mapOffsetY']), this['mapOffsetFixed'] || (this[`viewX`] = (ogarcanvas + ogarsettings) / 2, this[`viewY`] = (moreogarset + more2ogarset) / 2), this['mapOffsetFixed'] = !0, console['log']('[Legend mod Express] Map offset fixed (x, y):', this['mapOffsetX'], this['mapOffsetY']));
                },
                'isInView': function(ogarsettings, more2ogarset, ogarcanvas) {
                    var moreogarset = this['canvasWidth'] / 2 / this[`scale`],
                        more3ogarset = this[`canvasHeight`] / 2 / this[`scale`];
                    return !(ogarsettings + ogarcanvas < this['viewX'] - moreogarset || more2ogarset + ogarcanvas < this[`viewY`] - more3ogarset || ogarsettings - ogarcanvas > this[`viewX`] + moreogarset || more2ogarset - ogarcanvas > this[`viewY`] + more3ogarset);
                },
                'updateCells': function(ogarsettings, ogarcanvas) {
                    var moreogarset = function() {
                        for (var more2ogarset = '';;) {
                            var moreogarset = ogarsettings[`readUInt8`](ogarcanvas++);
                            if (0 == moreogarset) break;
                            more2ogarset += String[`fromCharCode`](moreogarset);
                        }
                        return more2ogarset;
                    };
                    this[`time`] = Date[`now`](), this[`removePlayerCell`] = !1;
                    var more3ogarset = ogarsettings[`readUInt16LE`](ogarcanvas);
                    ogarcanvas += 2;
                    for (var more4ogarset = 0; more4ogarset < more3ogarset; more4ogarset++) {
                        var ogarbuffed = this[`indexedCells`][ogarsettings[`readUInt32LE`](ogarcanvas)],
                            ogarlanguage = this['indexedCells'][ogarsettings['readUInt32LE'](ogarcanvas + 4)];
                        ogarcanvas += 8, ogarbuffed && ogarlanguage && (ogarlanguage[`targetX`] = ogarbuffed['x'], ogarlanguage[`targetY`] = ogarbuffed['y'], ogarlanguage[`targetSize`] = ogarlanguage[`size`], ogarlanguage[`time`] = this[`time`], ogarlanguage[`removeCell`]());
                    }
                    for (more4ogarset = 0;;) {
                        var ogaractuallanguage = ogarsettings[`readUInt32LE`](ogarcanvas);
                        if (ogarcanvas += 4, 0 == ogaractuallanguage) break;
                        var ogarcomms = ogarsettings[`readInt32LE`](ogarcanvas);
                        ogarcanvas += 4;
                        var ogario1Commands = ogarsettings[`readInt32LE`](ogarcanvas);
                        ogarcanvas += 4;
                        var ogarparsedchars = ogarsettings[`readUInt16LE`](ogarcanvas);
                        ogarcanvas += 2;
                        var ogarparsedemoticons = ogarsettings[`readUInt8`](ogarcanvas++),
                            ogarsets1 = 0;
                        128 & ogarparsedemoticons && (ogarsets1 = ogarsettings[`readUInt8`](ogarcanvas++));
                        var moremenusets = null,
                            ogario1ThemeSettings = null,
                            csssettings = '';
                        if (2 & ogarparsedemoticons) {
                            var ogario1PlayerProfiles = ogarsettings[`readUInt8`](ogarcanvas++),
                                ogarcopythelb = ogarsettings[`readUInt8`](ogarcanvas++),
                                ogarcanvasrenderfromagario = ogarsettings[`readUInt8`](ogarcanvas++);
                            moremenusets = this['rgb2Hex'](~~(0.9 * ogario1PlayerProfiles), ~~(0.9 * ogarcopythelb), ~~(0.9 * ogarcanvasrenderfromagario));
                        }

                        //4 & ogarparsedemoticons && (ogario1ThemeSettings = moreogarset()),
                        //8 & ogarparsedemoticons && (csssettings = more2ogarset['decodeURIComponent'](escape(moreogarset())));
                        if (4 & ogarparsedemoticons) {
                            ogario1ThemeSettings = moreogarset();
                        }
                        if (8 & ogarparsedemoticons) {
                            csssettings = more2ogarset['decodeURIComponent'](escape(moreogarset()));
                            if (ogario1ThemeSettings != null) {
                                //loadSkin(csssettings,ogario1ThemeSettings);					
                                //console.log('Player '+csssettings+' is using skin : '+ogario1ThemeSettings);
                                var skin2search = ogario1ThemeSettings.replace('%', '');
                                var LMAgarGameConfiguration = window.LMGameConfiguration;
                                var EquippableSkins = LMAgarGameConfiguration.gameConfig["Gameplay - Equippable Skins"];
                                for (var player = 0; player < EquippableSkins.length; player++) {
                                    //console.log(LMAgarGameConfiguration.gameConfig["Gameplay - Equippable Skins"]);
                                    if (EquippableSkins[player].productId == "skin_" + skin2search) {
                                        console.log("Player: " + csssettings + " Color: " + EquippableSkins[player].cellColor + " Image: " + EquippableSkins[player].image + " SkinId: " + EquippableSkins[player].gameplayId + " Skins type: " + EquippableSkins[player].skinType);
                                        //loadSkin(csssettings,"https://jimboy3100.github.io/agario/live/"+ogario1ThemeSettings);	//test
                                        //console.log(EquippableSkins[player].skinType);
                                        //console.log(EquippableSkins[player].gameplayId);
                                        //console.log(EquippableSkins[player].image);
                                    }
                                }
                            }
                        }
                        //8 & ogarparsedemoticons && (csssettings = more2ogarset['decodeURIComponent'](escape(moreogarset())));
                        var doagarcommand = 1 & ogarparsedemoticons,
                            ogarioset1final = 1 & ogarsets1,
                            ogariocellssetts = null;
                        this['indexedCells'][`hasOwnProperty`](ogaractuallanguage) ? (ogariocellssetts = this[`indexedCells`][ogaractuallanguage], moremenusets && (ogariocellssetts[`color`] = moremenusets)) : ((ogariocellssetts = new ogarbasicassembly(ogaractuallanguage, ogarcomms, ogario1Commands, ogarparsedchars, moremenusets, ogarioset1final, doagarcommand, !1, ogario1Settings[`shortMass`], ogario1Settings[`virMassShots`]))[`time`] = this[`time`], ogarioset1final ? this['food'][`push`](ogariocellssetts) : (doagarcommand && ogario1Settings[`virusesRange`] && this[`viruses`][`push`](ogariocellssetts), this[`cells`][`push`](ogariocellssetts), -1 != this['playerCellIDs']['indexOf'](ogaractuallanguage) && -1 == this[`playerCells`][`indexOf`](ogariocellssetts) && (ogariocellssetts[`isPlayerCell`] = !0, this[`playerColor`] = moremenusets, this[`playerCells`]['push'](ogariocellssetts))), this['indexedCells'][ogaractuallanguage] = ogariocellssetts), ogariocellssetts[`isPlayerCell`] && (csssettings = this['playerNick']), csssettings && (ogariocellssetts[`targetNick`] = csssettings), ogariocellssetts[`targetX`] = ogarcomms, ogariocellssetts[`targetY`] = ogario1Commands, ogariocellssetts[`targetSize`] = ogarparsedchars, ogariocellssetts[`isFood`] = ogarioset1final, ogariocellssetts[`isVirus`] = doagarcommand, ogario1ThemeSettings && (ogariocellssetts[`skin`] = ogario1ThemeSettings), 4 & ogarsets1 && (ogarsettings[`readUInt32LE`](ogarcanvas), ogarcanvas += 4);
                    }
                    for (more3ogarset = ogarsettings[`readUInt16LE`](ogarcanvas), ogarcanvas += 2, more4ogarset = 0; more4ogarset < more3ogarset; more4ogarset++) {
                        ogaractuallanguage = ogarsettings[`readUInt32LE`](ogarcanvas);
                        ogarcanvas += 4, (ogariocellssetts = this[`indexedCells`][ogaractuallanguage]) && ogariocellssetts[`removeCell`]();
                    }
                    this['removePlayerCell'] && !this[`playerCells`][`length`] && (this[`play`] = !1, ogarminimapdrawer[`onPlayerDeath`](), ogarminimapdrawer[`showMenu`](300));
                },
                'color2Hex': function(ogarsettings) {
                    var more2ogarset = ogarsettings[`toString`](16);
                    return 1 == more2ogarset[`length`] ? '0' + more2ogarset : more2ogarset;
                },
                'rgb2Hex': function(ogarsettings, more2ogarset, ogarcanvas) {
                    return '#' + this['color2Hex'](ogarsettings) + this[`color2Hex`](more2ogarset) + this[`color2Hex`](ogarcanvas);
                },
                'sortCells': function() {
                    this[`cells`][`sort`](function(ogarsettings, more2ogarset) {
                        return ogarsettings['size'] == more2ogarset['size'] ? ogarsettings['id'] - more2ogarset['id'] : ogarsettings[`size`] - more2ogarset[`size`];
                    });
                },
                'calculatePlayerMassAndPosition': function() {
                    for (var ogarsettings = 0, more2ogarset = 0, ogarcanvas = 0, moreogarset = 0, more3ogarset = this[`playerCells`][`length`], more4ogarset = 0; more4ogarset < more3ogarset; more4ogarset++) {
                        var ogarbuffed = this[`playerCells`][more4ogarset];
                        ogarsettings += ogarbuffed[`size`], more2ogarset += ogarbuffed[`targetSize`] * ogarbuffed[`targetSize`], ogarcanvas += ogarbuffed['x'] / more3ogarset, moreogarset += ogarbuffed['y'] / more3ogarset;
                    }
                    this['viewX'] = ogarcanvas, this[`viewY`] = moreogarset, this[`playerSize`] = ogarsettings, this[`playerMass`] = ~~(more2ogarset / 100), this[`recalculatePlayerMass`]();
                },
                'recalculatePlayerMass': function() {
                    if (this[`playerScore`] = Math['max'](this[`playerScore`], this['playerMass']), ogario1Settings[`virColors`] || ogario1Settings[`splitRange`] || ogario1Settings[`oppColors`] || ogario1Settings['oppRings'] || ogario1Settings[`showStatsSTE`]) {
                        var ogarsettings = this['playerCells'],
                            more2ogarset = ogarsettings[`length`];
                        ogarsettings[`sort`](function(ogarsettings, more2ogarset) {
                            return ogarsettings['size'] == more2ogarset[`size`] ? ogarsettings['id'] - more2ogarset['id'] : ogarsettings[`size`] - more2ogarset[`size`];
                        }), this['playerMinMass'] = ~~(ogarsettings[0][`size`] * ogarsettings[0][`size`] / 100), this['playerMaxMass'] = ~~(ogarsettings[more2ogarset - 1][`size`] * ogarsettings[more2ogarset - 1][`size`] / 100), this[`playerSplitCells`] = more2ogarset;
                    }
                    if (ogario1Settings[`showStatsSTE`]) {
                        var ogarcanvas = this[`selectBiggestCell`] ? this[`playerMaxMass`] : this[`playerMinMass`];
                        this['STE'] = ogarcanvas > 35 ? ~~(ogarcanvas * (ogarcanvas < 1000 ? 0.35 : 0.38)) : null;
                    }
                },
                'compareCells': function() {
                    if (this[`play`] && (ogario1Settings[`oppColors`] || ogario1Settings[`oppRings`] || ogario1Settings[`splitRange`])) {
                        (ogario1Settings[`oppRings`] || ogario1Settings[`splitRange`]) && (this[`biggerSTECellsCache`] = [], this[`biggerCellsCache`] = [], this['smallerCellsCache'] = [], this[`STECellsCache`] = []);
                        for (var ogarsettings = 0; ogarsettings < this['cells'][`length`]; ogarsettings++) {
                            var more2ogarset = this[`cells`][ogarsettings];
                            if (!more2ogarset[`isVirus`]) {
                                var ogarcanvas = ~~(more2ogarset[`size`] * more2ogarset[`size`] / 100),
                                    moreogarset = this[`selectBiggestCell`] ? this[`playerMaxMass`] : this[`playerMinMass`],
                                    more3ogarset = ogarcanvas / moreogarset,
                                    more4ogarset = moreogarset < 1000 ? 0.35 : 0.38;
                                ogario1Settings[`oppColors`] && !ogario1Settings[`oppRings`] && (more2ogarset['oppColor'] = this['setCellOppColor'](more2ogarset[`isPlayerCell`], more3ogarset, more4ogarset)), more2ogarset[`isPlayerCell`] || !ogario1Settings[`splitRange`] && !ogario1Settings[`oppRings`] || this[`cacheCells`](more2ogarset['x'], more2ogarset['y'], more2ogarset[`size`], more3ogarset, more4ogarset);
                            }
                        }
                    }
                },
                'cacheCells': function(ogarsettings, more2ogarset, ogarcanvas, moreogarset, more3ogarset) {
                    return moreogarset >= 2.5 ? void this[`biggerSTECellsCache`][`push`]({
                        'x': ogarsettings,
                        'y': more2ogarset,
                        'size': ogarcanvas
                    }) : moreogarset >= 1.25 ? void this[`biggerCellsCache`][`push`]({
                        'x': ogarsettings,
                        'y': more2ogarset,
                        'size': ogarcanvas
                    }) : moreogarset < 1.25 && moreogarset > 0.75 ? void 0 : moreogarset > more3ogarset ? void this[`smallerCellsCache`][`push`]({
                        'x': ogarsettings,
                        'y': more2ogarset,
                        'size': ogarcanvas
                    }) : void this[`STECellsCache`][`push`]({
                        'x': ogarsettings,
                        'y': more2ogarset,
                        'size': ogarcanvas
                    });
                },
                'setCellOppColor': function(ogarsettings, more2ogarset, ogarcanvas) {
                    return ogarsettings ? ogarcopythelb[`color`] : more2ogarset > 11 ? `#FF008C` : more2ogarset >= 2.5 ? `#BE00FF` : more2ogarset >= 1.25 ? `#FF0A00` : more2ogarset < 1.25 && more2ogarset > 0.75 ? `#FFDC00` : more2ogarset > ogarcanvas ? '#00C8FF' : '#64FF00';
                },
                'getCursorPosition': function() {
                    this[`cursorX`] = (this[`clientX`] - this[`canvasWidth`] / 2) / this[`viewScale`] + this[`viewX`], this[`cursorY`] = (this[`clientY`] - this['canvasHeight'] / 2) / this[`viewScale`] + this[`viewY`];
                },
                'setZoom': function(ogarsettings) {
                    ogarsettings[`preventDefault`](), this[`zoomValue`] *= Math[`pow`](ogario1Settings[`zoomSpeedValue`], ogarsettings['wheelDelta'] / -0x78 || ogarsettings[`detail`] || 0), this[`zoomValue`] > 4 / this[`viewScale`] && (this[`zoomValue`] = 4 / this[`viewScale`]);
                },
                'setTargetPosition': function(ogarsettings, more2ogarset) {
                    this[`targetX`] = ogarsettings - this[`mapOffsetX`], this[`targetY`] = more2ogarset - this[`mapOffsetY`], this[`targetDistance`] = Math[`round`](Math['sqrt'](Math[`pow`](this[`playerX`] - this[`targetX`], 2) + Math[`pow`](this[`playerY`] - this['targetY'], 2)));
                },
                'resetTargetPosition': function() {
                    this[`targetX`] = this[`playerX`], this[`targetY`] = this[`playerY`];
                },
                'setKeys': function() {
                    var ogarsettings = this;
                    document['onkeydown'] = function(more2ogarset) {
                        var ogarcanvas = more2ogarset[`keyCode`];
                        if (!ogarsettings['pressedKeys'][ogarcanvas]) switch (ogarcanvas) {
                            case 13:
                                ogarsettings['sendNick']('');
                                break;
                            case 32:
                                ogarsettings[`sendSplit`]();
                                break;
                            case 81:
                                ogarsettings[`sendFreeSpectate`]();
                                break;
                            case 83:
                                ogarsettings['sendSpectate']();
                                break;
                            case 87:
                                ogarsettings[`sendEject`]();
                        }
                    }, document[`onkeyup`] = function(more2ogarset) {
                        ogarsettings[`pressedKeys`][more2ogarset[`keyCode`]] = !1;
                    };
                },
                'init': function() {
                    var ogarsettings = this;
                    /firefox/i ['test'](navigator[`userAgent`]) ? document[`addEventListener`](`DOMMouseScroll`, function(more2ogarset) {
                        ogarsettings[`setZoom`](more2ogarset);
                    }, !1): document[`body`][`onmousewheel`] = function(more2ogarset) {
                        ogarsettings[`setZoom`](more2ogarset);
                    }, setInterval(function() {
                        ogarsettings[`sendPosition`]();
                    }, 40), more2ogarset['master'] && more2ogarset['master'][`clientVersion`] && this[`setClientVersion`](more2ogarset[`master`][`clientVersion`], more2ogarset[`master`][`clientVersionString`]);
                }
            };
            more2ogarset['sendAction'] = function(ogarsettings) {
                doagarcommand['sendAction'](ogarsettings);
            };
            var ogarfooddrawer = {
                    'canvas': null,
                    'ctx': null,
                    'canvasWidth': 0,
                    'canvasHeight': 0,
                    'camX': 0,
                    'camY': 0,
                    'scale': 1,
                    'fpsLastRequest': null,
                    'renderedFrames': 0,
                    'fps': 0,
                    'pi2': 2 * Math['PI'],
                    'battleAreaMap': null,
                    'battleAreaMapCtx': null,
                    'pieChart': null,
                    'pellet': null,
                    'indicator': null,
                    'setCanvas': function() {
                        this[`canvas`] = document[`getElementById`](`canvas`), this[`ctx`] = this[`canvas`][`getContext`]('2d'), this[`canvas`][`onmousemove`] = function(ogarsettings) {
                            doagarcommand['clientX'] = ogarsettings[`clientX`], doagarcommand[`clientY`] = ogarsettings['clientY'], doagarcommand[`getCursorPosition`]();
                        };
                    },
                    'resizeCanvas': function() {
                        this[`canvasWidth`] = more2ogarset[`innerWidth`], this[`canvasHeight`] = more2ogarset[`innerHeight`], this[`canvas`][`width`] = this[`canvasWidth`], this['canvas'][`height`] = this[`canvasHeight`], doagarcommand[`canvasWidth`] = this[`canvasWidth`], doagarcommand[`canvasHeight`] = this[`canvasHeight`], this['renderFrame']();
                    },
                    'setView': function() {
                        this[`setScale`](), doagarcommand[`playerCells`][`length`] ? (doagarcommand[`calculatePlayerMassAndPosition`](), this[`camX`] = (this[`camX`] + doagarcommand[`viewX`]) / 2, this[`camY`] = (this[`camY`] + doagarcommand[`viewY`]) / 2) : (this[`camX`] = (29 * this[`camX`] + doagarcommand[`viewX`]) / 30, this[`camY`] = (29 * this[`camY`] + doagarcommand[`viewY`]) / 30), doagarcommand['playerX'] = this[`camX`], doagarcommand[`playerY`] = this['camY'];
                    },
                    'setScale': function() {
                        if (!doagarcommand[`autoZoom`]) return this[`scale`] = (9 * this[`scale`] + this[`getZoom`]()) / 10, void(doagarcommand[`viewScale`] = this[`scale`]);
                        doagarcommand[`play`] ? this['scale'] = (9 * this['scale'] + Math[`pow`](Math['min'](64 / doagarcommand[`playerSize`], 1), 0.4) * this['getZoom']()) / 10 : this[`scale`] = (9 * this[`scale`] + doagarcommand[`scale`] * this['getZoom']()) / 10, doagarcommand['viewScale'] = this[`scale`];
                    },
                    'getZoom': function() {
                        return Math[`max`](this[`canvasWidth`] / 1080, this[`canvasHeight`] / 1920) * doagarcommand[`zoomValue`];
                    },
                    'renderFrame': function() {
                        for (doagarcommand[`time`] = Date[`now`](), more2ogarset = 0; more2ogarset < doagarcommand['cells'][`length`]; more2ogarset++) doagarcommand[`cells`][more2ogarset][`moveCell`]();
                        if (this[`setView`](), doagarcommand[`getCursorPosition`](), doagarcommand[`sortCells`](), doagarcommand[`compareCells`](), this[`ctx`][`clearRect`](0, 0, this[`canvasWidth`], this[`canvasHeight`]), ogario1Settings[`showGrid`] && this[`drawGrid`](this[`ctx`], this[`canvasWidth`], this[`canvasHeight`], this[`scale`], this[`camX`], this[`camY`]), this['ctx'][`save`](), this[`ctx`][`translate`](this[`canvasWidth`] / 2, this[`canvasHeight`] / 2), this[`ctx`][`scale`](this[`scale`], this[`scale`]), this['ctx']['translate'](-this[`camX`], -this[`camY`]), ogario1Settings[`showBgSectors`] && this[`drawSectors`](this['ctx'], doagarcommand[`mapOffsetFixed`], ogario1ThemeSettings[`sectorsX`], ogario1ThemeSettings[`sectorsY`], doagarcommand[`mapMinX`], doagarcommand[`mapMinY`], doagarcommand[`mapMaxX`], doagarcommand['mapMaxY'], ogario1ThemeSettings[`gridColor`], ogario1ThemeSettings[`sectorsColor`], ogario1ThemeSettings[`sectorsWidth`], !0), `:battleroyale` === doagarcommand[`gameMode`] && this[`drawBattleArea`](this[`ctx`]), ogario1Settings['showMapBorders']) {
                            var ogarsettings = ogario1ThemeSettings['bordersWidth'] / 2;
                            this[`drawMapBorders`](this[`ctx`], doagarcommand[`mapOffsetFixed`], doagarcommand[`mapMinX`] - ogarsettings, doagarcommand[`mapMinY`] - ogarsettings, doagarcommand[`mapMaxX`] + ogarsettings, doagarcommand[`mapMaxY`] + ogarsettings, ogario1ThemeSettings[`bordersColor`], ogario1ThemeSettings['bordersWidth']);
                        }
                        ogario1Settings['virusesRange'] && this[`drawVirusesRange`](this[`ctx`], doagarcommand[`viruses`]), this[`drawFood`](), doagarcommand[`play`] && (ogario1Settings[`splitRange`] && this[`drawSplitRange`](this[`ctx`], doagarcommand[`biggerSTECellsCache`], doagarcommand[`playerCells`], doagarcommand['selectBiggestCell']), ogario1Settings[`oppRings`] && this['drawOppRings'](this[`ctx`], this[`scale`], doagarcommand[`biggerSTECellsCache`], doagarcommand[`biggerCellsCache`], doagarcommand[`smallerCellsCache`], doagarcommand[`STECellsCache`]), ogario1Settings['cursorTracking'] && this[`drawCursorTracking`](this[`ctx`], doagarcommand['playerCells'], doagarcommand[`cursorX`], doagarcommand['cursorY'])), this[`drawGhostCells`]();
                        for (var more2ogarset = 0; more2ogarset < doagarcommand[`removedCells`][`length`]; more2ogarset++) doagarcommand[`removedCells`][more2ogarset]['draw'](this['ctx'], !0);
                        for (more2ogarset = 0; more2ogarset < doagarcommand[`cells`][`length`]; more2ogarset++) doagarcommand[`cells`][more2ogarset][`draw`](this['ctx']);
                        this[`ctx`][`restore`](), ':teams' === doagarcommand[`gameMode`] && this['pieChart'] && this[`pieChart`][`width`] && this['ctx'][`drawImage`](this[`pieChart`], this[`canvasWidth`] - this[`pieChart`][`width`] - 10, 10);
                    },
                    'drawGrid': function(ogarsettings, more2ogarset, ogarcanvas, moreogarset, more3ogarset, more4ogarset) {
                        var ogarbuffed = more2ogarset / moreogarset,
                            ogarlanguage = ogarcanvas / moreogarset,
                            ogaractuallanguage = (ogarbuffed / 2 - more3ogarset) % 50,
                            ogarcomms = (ogarlanguage / 2 - more4ogarset) % 50;
                        for (ogarsettings[`strokeStyle`] = ogario1ThemeSettings[`gridColor`], ogarsettings[`globalAlpha`] = 1 * moreogarset, ogarsettings[`beginPath`](); ogaractuallanguage < ogarbuffed; ogaractuallanguage += 50) ogarsettings[`moveTo`](ogaractuallanguage * moreogarset - 0.5, 0), ogarsettings[`lineTo`](ogaractuallanguage * moreogarset - 0.5, ogarlanguage * moreogarset);
                        for (; ogarcomms < ogarlanguage; ogarcomms += 50) ogarsettings[`moveTo`](0, ogarcomms * moreogarset - 0.5), ogarsettings[`lineTo`](ogarbuffed * moreogarset, ogarcomms * moreogarset - 0.5);
                        ogarsettings['stroke'](), ogarsettings['globalAlpha'] = 1;
                    },
                    'drawSectors': function(ogarsettings, more2ogarset, ogarcanvas, moreogarset, more3ogarset, more4ogarset, ogarbuffed, ogarlanguage, ogaractuallanguage, ogarcomms, ogario1Commands, ogarparsedchars) {
                        if (more2ogarset || !ogarparsedchars) {
                            var ogarparsedemoticons = ~~((ogarbuffed - more3ogarset) / ogarcanvas),
                                ogarsets1 = ~~((ogarlanguage - more4ogarset) / moreogarset),
                                moremenusets = 0,
                                csssettings = 0;
                            if (ogarsettings[`strokeStyle`] = ogaractuallanguage, ogarsettings[`fillStyle`] = ogarcomms, ogarsettings[`lineWidth`] = ogario1Commands, ogarparsedchars || !ogarparsedchars && ogario1Settings[`showMiniMapGrid`]) {
                                ogarsettings[`beginPath`]();
                                for (var ogario1PlayerProfiles = 0; ogario1PlayerProfiles < ogarcanvas + 1; ogario1PlayerProfiles++) moremenusets = more3ogarset + ogarparsedemoticons * ogario1PlayerProfiles, ogarsettings[`moveTo`](ogario1PlayerProfiles == ogarcanvas ? ogarbuffed : moremenusets, more4ogarset), ogarsettings['lineTo'](ogario1PlayerProfiles == ogarcanvas ? ogarbuffed : moremenusets, ogarlanguage);
                                for (ogario1PlayerProfiles = 0; ogario1PlayerProfiles < moreogarset + 1; ogario1PlayerProfiles++) csssettings = more4ogarset + ogarsets1 * ogario1PlayerProfiles, ogarsettings[`moveTo`](more3ogarset - ogario1Commands / 2, ogario1PlayerProfiles == moreogarset ? ogarlanguage : csssettings), ogarsettings[`lineTo`](ogarbuffed + ogario1Commands / 2, ogario1PlayerProfiles == moreogarset ? ogarlanguage : csssettings);
                                ogarsettings[`stroke`]();
                            } else this[`drawMapBorders`](ogarsettings, more2ogarset, more3ogarset, more4ogarset, ogarbuffed, ogarlanguage, ogaractuallanguage, ogario1Commands);
                            ogarsettings['font'] = ogarparsedchars ? ogario1ThemeSettings['sectorsFontWeight'] + ' ' + ogario1ThemeSettings[`sectorsFontSize`] + `px ` + ogario1ThemeSettings['sectorsFontFamily'] : ogario1ThemeSettings[`miniMapFontWeight`] + ' ' + ~~(0.4 * ogarsets1) + `px ` + ogario1ThemeSettings['miniMapFontFamily'], ogarsettings[`textAlign`] = `center`, ogarsettings['textBaseline'] = 'middle';
                            for (ogario1PlayerProfiles = 0; ogario1PlayerProfiles < moreogarset; ogario1PlayerProfiles++)
                                for (var ogarcopythelb = 0; ogarcopythelb < ogarcanvas; ogarcopythelb++) {
                                    var ogarminimapdrawer = String[`fromCharCode`](65 + ogario1PlayerProfiles) + (ogarcopythelb + 1);
                                    moremenusets = ~~(more3ogarset + ogarparsedemoticons / 2 + ogarcopythelb * ogarparsedemoticons), csssettings = ~~(more4ogarset + ogarsets1 / 2 + ogario1PlayerProfiles * ogarsets1), ogarsettings[`fillText`](ogarminimapdrawer, moremenusets, csssettings);
                                }
                        }
                    },
                    'drawMapBorders': function(ogarsettings, more2ogarset, ogarcanvas, moreogarset, more3ogarset, more4ogarset, ogarbuffed, ogarlanguage) {
                        more2ogarset && (ogarsettings[`strokeStyle`] = ogarbuffed, ogarsettings[`lineWidth`] = ogarlanguage, ogarsettings[`beginPath`](), ogarsettings[`moveTo`](ogarcanvas, moreogarset), ogarsettings[`lineTo`](more3ogarset, moreogarset), ogarsettings[`lineTo`](more3ogarset, more4ogarset), ogarsettings[`lineTo`](ogarcanvas, more4ogarset), ogarsettings[`closePath`](), ogarsettings['stroke']());
                    },
                    'drawVirusesRange': function(ogarsettings, more2ogarset, ogarcanvas) {
                        if (more2ogarset[`length`]) {
                            ogarsettings[`beginPath`]();
                            for (var moreogarset = 0; moreogarset < more2ogarset[`length`]; moreogarset++) {
                                var more3ogarset = more2ogarset[moreogarset]['x'],
                                    more4ogarset = more2ogarset[moreogarset]['y'];
                                ogarsettings[`moveTo`](more3ogarset, more4ogarset), ogarsettings[`arc`](more3ogarset, more4ogarset, more2ogarset[moreogarset][`size`] + 820, 0, this[`pi2`], !1);
                            }
                            ogarsettings[`fillStyle`] = ogario1ThemeSettings['virusColor'], ogarsettings[`globalAlpha`] = 0.1, ogarsettings[`fill`](), ogarsettings[`globalAlpha`] = 1, ogarcanvas && (more2ogarset = []);
                        }
                    },
                    'drawFood': function() {
                        if (doagarcommand[`showFood`] && !(ogario1Settings[`autoHideFoodOnZoom`] && this['scale'] < 0.2)) {
                            if (ogario1Settings['autoHideFood'] && !doagarcommand['foodIsHidden'] && doagarcommand[`playerMass`] > 1000) return doagarcommand[`showFood`] = !1, void(doagarcommand['foodIsHidden'] = !0);
                            if (ogario1Settings[`rainbowFood`])
                                for (var ogarsettings = 0; ogarsettings < doagarcommand['food'][`length`]; ogarsettings++) doagarcommand['food'][ogarsettings][`moveCell`](), doagarcommand[`food`][ogarsettings][`draw`](this['ctx']);
                            else this[`drawCachedFood`](this[`ctx`], doagarcommand[`food`], this['scale']);
                        }
                    },
                    'drawCachedFood': function(ogarsettings, more2ogarset, ogarcanvas, moreogarset) {
                        if (more2ogarset[`length`]) {
                            if (ogario1Settings[`optimizedFood`] && this[`pellet`])
                                for (var more3ogarset = 0; more3ogarset < more2ogarset[`length`]; more3ogarset++) {
                                    var more4ogarset = more2ogarset[more3ogarset]['x'] - 10 - ogario1ThemeSettings[`foodSize`],
                                        ogarbuffed = more2ogarset[more3ogarset]['y'] - 10 - ogario1ThemeSettings[`foodSize`];
                                    ogarsettings['drawImage'](this['pellet'], more4ogarset, ogarbuffed);
                                } else {
                                    ogarsettings['beginPath']();
                                    for (more3ogarset = 0; more3ogarset < more2ogarset[`length`]; more3ogarset++) {
                                        more4ogarset = more2ogarset[more3ogarset]['x'], ogarbuffed = more2ogarset[more3ogarset]['y'];
                                        if (ogarsettings['moveTo'](more4ogarset, ogarbuffed), ogarcanvas < 0.16) {
                                            var ogarlanguage = more2ogarset[more3ogarset][`size`] + ogario1ThemeSettings[`foodSize`];
                                            ogarsettings[`rect`](more4ogarset - ogarlanguage, ogarbuffed - ogarlanguage, 2 * ogarlanguage, 2 * ogarlanguage);
                                        } else ogarsettings[`arc`](more4ogarset, ogarbuffed, more2ogarset[more3ogarset][`size`] + ogario1ThemeSettings[`foodSize`], 0, this['pi2'], !1);
                                    }
                                    ogarsettings[`fillStyle`] = ogario1ThemeSettings[`foodColor`], ogarsettings[`globalAlpha`] = 1, ogarsettings[`fill`]();
                                }
                            moreogarset && (more2ogarset = []);
                        }
                    },
                    'drawSplitRange': function(ogarsettings, more2ogarset, ogarcanvas, moreogarset, more3ogarset) {
                        if (this['drawCircles'](ogarsettings, more2ogarset, 760, 4, 0.4, `#BE00FF`), ogarcanvas[`length`]) {
                            var more4ogarset = moreogarset ? ogarcanvas[`length`] - 1 : 0;
                            ogarsettings[`lineWidth`] = 6, ogarsettings['globalAlpha'] = ogario1ThemeSettings[`darkTheme`] ? 0.7 : 0.35, ogarsettings['strokeStyle'] = ogario1ThemeSettings[`splitRangeColor`], ogarsettings[`beginPath`](), ogarsettings['arc'](ogarcanvas[more4ogarset]['x'], ogarcanvas[more4ogarset]['y'], ogarcanvas[more4ogarset][`size`] + 760, 0, this[`pi2`], !1), ogarsettings[`closePath`](), ogarsettings[`stroke`]();
                        }
                        ogarsettings['globalAlpha'] = 1, more3ogarset && (more2ogarset = []);
                    },
                    'drawOppRings': function(ogarsettings, more2ogarset, ogarcanvas, moreogarset, more3ogarset, more4ogarset, ogarbuffed) {
                        var ogarlanguage = 14 + 2 / more2ogarset,
                            ogaractuallanguage = 12 + 1 / more2ogarset;
                        this[`drawCircles`](ogarsettings, ogarcanvas, ogarlanguage, ogaractuallanguage, 0.75, `#BE00FF`), this[`drawCircles`](ogarsettings, moreogarset, ogarlanguage, ogaractuallanguage, 0.75, `#FF0A00`), this[`drawCircles`](ogarsettings, more3ogarset, ogarlanguage, ogaractuallanguage, 0.75, `#00C8FF`), this[`drawCircles`](ogarsettings, more4ogarset, ogarlanguage, ogaractuallanguage, 0.75, `#64FF00`), ogarbuffed && (ogarcanvas = [], moreogarset = [], more3ogarset = [], more4ogarset = []);
                    },
                    'drawCursorTracking': function(ogarsettings, more2ogarset, ogarcanvas, moreogarset) {
                        ogarsettings[`lineWidth`] = 4, ogarsettings['globalAlpha'] = ogario1ThemeSettings[`darkTheme`] ? 0.75 : 0.35, ogarsettings[`strokeStyle`] = ogario1ThemeSettings[`cursorTrackingColor`], ogarsettings[`beginPath`]();
                        for (var more3ogarset = 0; more3ogarset < more2ogarset[`length`]; more3ogarset++) ogarsettings[`moveTo`](more2ogarset[more3ogarset]['x'], more2ogarset[more3ogarset]['y']), ogarsettings[`lineTo`](ogarcanvas, moreogarset);
                        ogarsettings[`stroke`](), ogarsettings[`globalAlpha`] = 1;
                    },
                    'drawCircles': function(ogarsettings, more2ogarset, ogarcanvas, moreogarset, more3ogarset, more4ogarset) {
                        ogarsettings[`lineWidth`] = moreogarset, ogarsettings['globalAlpha'] = more3ogarset, ogarsettings[`strokeStyle`] = more4ogarset;
                        for (var ogarbuffed = 0; ogarbuffed < more2ogarset['length']; ogarbuffed++) ogarsettings['beginPath'](), ogarsettings[`arc`](more2ogarset[ogarbuffed]['x'], more2ogarset[ogarbuffed]['y'], more2ogarset[ogarbuffed][`size`] + ogarcanvas, 0, this[`pi2`], !1), ogarsettings[`closePath`](), ogarsettings[`stroke`]();
                        ogarsettings['globalAlpha'] = 1;
                    },
                    'drawDashedCircle': function(ogarsettings, more2ogarset, ogarcanvas, moreogarset, more3ogarset, more4ogarset, ogarbuffed) {
                        var ogarlanguage = this[`pi2`] / more3ogarset;
                        ogarsettings[`lineWidth`] = more4ogarset, ogarsettings[`strokeStyle`] = ogarbuffed;
                        for (var ogaractuallanguage = 0; ogaractuallanguage < more3ogarset; ogaractuallanguage += 2) ogarsettings[`beginPath`](), ogarsettings[`arc`](more2ogarset, ogarcanvas, moreogarset - more4ogarset / 2, ogaractuallanguage * ogarlanguage, (ogaractuallanguage + 1) * ogarlanguage, !1), ogarsettings[`stroke`]();
                    },
                    'drawTeammatesInd': function(ogarsettings, more2ogarset, ogarcanvas, moreogarset) {
                        this[`indicator`] && ogarsettings[`drawImage`](this[`indicator`], more2ogarset - 45, ogarcanvas - moreogarset - 90);
                    },
                    'drawPieChart': function() {
                        this['pieChart'] || (this[`pieChart`] = document[`createElement`](`canvas`));
                        var ogarsettings = this[`pieChart`][`getContext`]('2d'),
                            more2ogarset = Math['min'](200, 0.3 * this[`canvasWidth`]) / 200;
                        this['pieChart'][`width`] = 200 * more2ogarset, this[`pieChart`][`height`] = 240 * more2ogarset, ogarsettings['scale'](more2ogarset, more2ogarset);
                        for (var ogarcanvas = [`#333333`, `#FF3333`, '#33FF33', `#3333FF`], moreogarset = 0, more3ogarset = 0; more3ogarset < doagarcommand[`pieChart`][`length`]; more3ogarset++) {
                            var more4ogarset = moreogarset + doagarcommand['pieChart'][more3ogarset] * this[`pi2`];
                            ogarsettings[`fillStyle`] = ogarcanvas[more3ogarset + 1], ogarsettings['beginPath'](), ogarsettings[`moveTo`](100, 140), ogarsettings[`arc`](100, 140, 80, moreogarset, more4ogarset, !1), ogarsettings['fill'](), moreogarset = more4ogarset;
                        }
                    },
                    'drawBattleArea': function(ogarsettings) {
                        doagarcommand[`battleRoyale`][`state`] && (this[`drawDangerArea`](ogarsettings, doagarcommand[`battleRoyale`]['x'], doagarcommand[`battleRoyale`]['y'], doagarcommand['battleRoyale']['radius'], doagarcommand[`mapMinX`], doagarcommand[`mapMinY`], doagarcommand[`mapMaxX`] - doagarcommand[`mapMinX`], doagarcommand[`mapMaxY`] - doagarcommand['mapMinY'], ogario1ThemeSettings[`dangerAreaColor`], 0.25), this['drawSafeArea'](ogarsettings, doagarcommand[`battleRoyale`][`targetX`], doagarcommand[`battleRoyale`][`targetY`], doagarcommand[`battleRoyale`][`targetRadius`], 40, ogario1ThemeSettings[`safeAreaColor`]));
                    },
                    'drawBattleAreaOnMinimap': function(ogarsettings, more2ogarset, ogarcanvas, moreogarset, more3ogarset, more4ogarset) {
                        if (doagarcommand[`battleRoyale`][`state`]) {
                            this['battleAreaMap'] || (this[`battleAreaMap`] = document['createElement']('canvas'), this[`battleAreaMapCtx`] = this[`battleAreaMap`]['getContext']('2d')), this['battleAreaMap'][`width`] != more2ogarset ? (this[`battleAreaMap`][`width`] = more2ogarset, this[`battleAreaMap`]['height'] = ogarcanvas) : this[`battleAreaMapCtx`][`clearRect`](0, 0, more2ogarset, ogarcanvas);
                            var ogarbuffed = (doagarcommand[`battleRoyale`]['x'] + more3ogarset) * moreogarset,
                                ogarlanguage = (doagarcommand[`battleRoyale`]['y'] + more4ogarset) * moreogarset,
                                ogaractuallanguage = doagarcommand[`battleRoyale`][`radius`] * moreogarset;
                            this[`drawDangerArea`](this[`battleAreaMapCtx`], ogarbuffed, ogarlanguage, ogaractuallanguage, 0, 0, more2ogarset, ogarcanvas, ogario1ThemeSettings[`dangerAreaColor`], 0.25), ogarbuffed = ~~((doagarcommand[`battleRoyale`]['targetX'] + more3ogarset) * moreogarset), ogarlanguage = ~~((doagarcommand['battleRoyale'][`targetY`] + more4ogarset) * moreogarset), ogaractuallanguage = ~~(doagarcommand[`battleRoyale`][`targetRadius`] * moreogarset), this[`drawSafeArea`](this['battleAreaMapCtx'], ogarbuffed, ogarlanguage, ogaractuallanguage, 2, ogario1ThemeSettings[`safeAreaColor`]), ogarsettings[`drawImage`](this[`battleAreaMap`], 0, 0);
                        }
                    },
                    'drawDangerArea': function(ogarsettings, more2ogarset, ogarcanvas, moreogarset, more3ogarset, more4ogarset, ogarbuffed, ogarlanguage, ogaractuallanguage, ogarcomms) {
                        doagarcommand['battleRoyale'][`radius`] == doagarcommand[`battleRoyale`][`maxRadius`] || moreogarset <= 0 || (ogarsettings[`save`](), ogarsettings[`globalAlpha`] = ogarcomms, ogarsettings[`fillStyle`] = ogaractuallanguage, ogarsettings['fillRect'](more3ogarset, more4ogarset, ogarbuffed, ogarlanguage), ogarsettings[`globalCompositeOperation`] = 'destination-out', ogarsettings[`globalAlpha`] = 1, ogarsettings[`beginPath`](), ogarsettings['arc'](more2ogarset, ogarcanvas, moreogarset, 0, this['pi2'], !1), ogarsettings[`fill`](), ogarsettings[`restore`]());
                    },
                    'drawSafeArea': function(ogarsettings, more2ogarset, ogarcanvas, moreogarset, more3ogarset, more4ogarset) {
                        doagarcommand[`battleRoyale`][`state`] > 2 || moreogarset <= 0 || this[`drawDashedCircle`](ogarsettings, more2ogarset, ogarcanvas, moreogarset, 0x3c, more3ogarset, more4ogarset);
                    },
                    'drawGhostCells': function() {
                        if (ogario1Settings[`showGhostCells`]) {
                            var ogarsettings = doagarcommand[`ghostCells`];
                            this['ctx']['beginPath']();
                            for (var more2ogarset = 0; more2ogarset < ogarsettings['length']; more2ogarset++)
                                if (!ogarsettings[more2ogarset][`inView`]) {
                                    var ogarcanvas = ogarsettings[more2ogarset]['x'],
                                        moreogarset = ogarsettings[more2ogarset]['y'];
                                    this[`ctx`][`moveTo`](ogarcanvas, moreogarset), this[`ctx`][`arc`](ogarcanvas, moreogarset, ogarsettings[more2ogarset][`size`], 0, this[`pi2`], !1);
                                } this[`ctx`][`fillStyle`] = ogario1ThemeSettings[`ghostCellsColor`], this[`ctx`][`globalAlpha`] = ogario1ThemeSettings[`ghostCellsAlpha`], this[`ctx`][`shadowColor`] = ogario1ThemeSettings[`ghostCellsColor`], this[`ctx`][`shadowBlur`] = 40, this[`ctx`][`shadowOffsetX`] = 0, this[`ctx`][`shadowOffsetY`] = 0, this[`ctx`][`fill`](), this['ctx']['globalAlpha'] = 1, this[`ctx`][`shadowBlur`] = 0;
                        }
                    },
                    'preDrawPellet': function() {
                        this[`pellet`] = null;
                        var ogarsettings = 10 + ogario1ThemeSettings[`foodSize`],
                            more2ogarset = document[`createElement`](`canvas`);
                        more2ogarset['width'] = 2 * ogarsettings, more2ogarset['height'] = 2 * ogarsettings;
                        var ogarcanvas = more2ogarset[`getContext`]('2d');
                        ogarcanvas[`arc`](ogarsettings, ogarsettings, ogarsettings, 0, this[`pi2`], !1), ogarcanvas[`fillStyle`] = ogario1ThemeSettings[`foodColor`], ogarcanvas[`fill`](), this['pellet'] = new Image(), this[`pellet`][`src`] = more2ogarset[`toDataURL`](), more2ogarset = null;
                    },
                    'preDrawIndicator': function() {
                        this[`indicator`] = null;
                        var ogarsettings = document['createElement'](`canvas`);
                        ogarsettings['width'] = 90, ogarsettings[`height`] = 50;
                        var more2ogarset = ogarsettings[`getContext`]('2d');
                        more2ogarset[`lineWidth`] = 2, more2ogarset[`fillStyle`] = ogario1ThemeSettings['teammatesIndColor'], more2ogarset['strokeStyle'] = `#000000`, more2ogarset[`beginPath`](), more2ogarset[`moveTo`](0, 0), more2ogarset[`lineTo`](90, 0), more2ogarset[`lineTo`](45, 50), more2ogarset[`closePath`](), more2ogarset[`fill`](), more2ogarset[`stroke`](), this[`indicator`] = new Image(), this['indicator'][`src`] = ogarsettings[`toDataURL`](), ogarsettings = null;
                    },
                    'countFps': function() {
                        if (ogario1Settings['showStatsFPS']) {
                            var ogarsettings = Date[`now`]();
                            this[`fpsLastRequest`] || (this[`fpsLastRequest`] = ogarsettings), ogarsettings - this['fpsLastRequest'] >= 1000 && (this[`fps`] = this[`renderedFrames`], this['renderedFrames'] = 0, this[`fpsLastRequest`] = ogarsettings), this[`renderedFrames`]++;
                        }
                    },
                    'render': function() {
                        ogarfooddrawer['countFps'](), ogarfooddrawer[`renderFrame`](), more2ogarset[`requestAnimationFrame`](ogarfooddrawer['render']);
                    },
                    'init': function() {
                        this[`setCanvas`](), this[`resizeCanvas`](), this['preDrawPellet'](), this[`preDrawIndicator`](), more2ogarset[`requestAnimationFrame`](ogarfooddrawer[`render`]);
                    }
                },
                ogarioefaultHotkeys = {},
                ogario1Hotkeys = {},
                ogario11Hotkeys = {
                    'hk-feed': {
                        'label': ogarcomms[`hk-feed`],
                        'defaultKey': 'W',
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer[`feed`]();
                        },
                        'keyUp': null,
                        'type': `normal`
                    },
                    'hk-macroFeed': {
                        'label': ogarcomms[`hk-macroFeed`],
                        'defaultKey': 'E',
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer[`macroFeed`](!0);
                        },
                        'keyUp': function() {
                            ogarminimapdrawer && ogarminimapdrawer[`macroFeed`](!1);
                        },
                        'type': 'normal'
                    },
                    'hk-split': {
                        'label': ogarcomms[`hk-split`],
                        'defaultKey': `SPACE`,
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer['split']();
                        },
                        'keyUp': null,
                        'type': `normal`
                    },
                    'hk-doubleSplit': {
                        'label': ogarcomms[`hk-doubleSplit`],
                        'defaultKey': 'Q',
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer[`doubleSplit`]();
                        },
                        'keyUp': null,
                        'type': `normal`
                    },
                    'hk-popSplit': {
                        'label': `Popsplit`,
                        'defaultKey': 'ALT+Q',
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer['popSplit']();
                        },
                        'keyUp': null,
                        'type': 'normal'
                    },
                    'hk-split16': {
                        'label': ogarcomms[`hk-split16`],
                        'defaultKey': 'SHIFT',
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer[`split16`]();
                        },
                        'keyUp': null,
                        'type': `normal`
                    },
                    'hk-pause': {
                        'label': ogarcomms[`hk-pause`],
                        'defaultKey': 'R',
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer['setPause']();
                        },
                        'keyUp': null,
                        'type': `normal`
                    },
                    'hk-showTop5': {
                        'label': ogarcomms[`hk-showTop5`],
                        'defaultKey': 'T',
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer[`setShowTop5`]();
                        },
                        'keyUp': null,
                        'type': `normal`
                    },
                    'hk-showTime': {
                        'label': ogarcomms['hk-showTime'],
                        'defaultKey': `ALT+T`,
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer[`setShowTime`]();
                        },
                        'keyUp': null,
                        'type': 'normal'
                    },
                    'hk-showSplitRange': {
                        'label': ogarcomms[`hk-showSplitRange`],
                        'defaultKey': 'U',
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer['setShowSplitRange']();
                        },
                        'keyUp': null,
                        'type': `normal`
                    },
                    'hk-showSplitInd': {
                        'label': ogarcomms['hk-showSplitInd'],
                        'defaultKey': 'I',
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer[`setShowSplitInd`]();
                        },
                        'keyUp': null,
                        'type': `normal`
                    },
                    'hk-showTeammatesInd': {
                        'label': ogarcomms['hk-showTeammatesInd'],
                        'defaultKey': `ALT+I`,
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer[`setShowTeammatesInd`]();
                        },
                        'keyUp': null,
                        'type': 'normal'
                    },
                    'hk-showOppColors': {
                        'label': ogarcomms[`hk-showOppColors`],
                        'defaultKey': 'O',
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer[`setShowOppColors`]();
                        },
                        'keyUp': null,
                        'type': `normal`
                    },
                    'hk-toggleSkins': {
                        'label': ogarcomms['hk-toggleSkins'],
                        'defaultKey': 'A',
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer['toggleSkins']();
                        },
                        'keyUp': null,
                        'type': 'normal'
                    },
                    'hk-transparentSkins': {
                        'label': ogarcomms[`hk-transparentSkins`],
                        'defaultKey': '',
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer['setTransparentSkins']();
                        },
                        'keyUp': null,
                        'type': `normal`
                    },
                    'hk-showSkins': {
                        'label': ogarcomms[`hk-showSkins`],
                        'defaultKey': 'S',
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer[`setShowSkins`]();
                        },
                        'keyUp': null,
                        'type': 'normal'
                    },
                    'hk-showStats': {
                        'label': ogarcomms[`hk-showStats`],
                        'defaultKey': `ALT+S`,
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer[`setShowStats`]();
                        },
                        'keyUp': null,
                        'type': `normal`
                    },
                    'hk-toggleCells': {
                        'label': ogarcomms[`hk-toggleCells`],
                        'defaultKey': 'D',
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer[`toggleCells`]();
                        },
                        'keyUp': null,
                        'type': `normal`
                    },
                    'hk-showFood': {
                        'label': ogarcomms[`hk-showFood`],
                        'defaultKey': 'F',
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer[`setShowFood`]();
                        },
                        'keyUp': null,
                        'type': 'normal'
                    },
                    'hk-showGrid': {
                        'label': ogarcomms[`hk-showGrid`],
                        'defaultKey': 'G',
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer[`setShowGrid`]();
                        },
                        'keyUp': null,
                        'type': `normal`
                    },
                    'hk-showMiniMapGuides': {
                        'label': ogarcomms[`hk-showMiniMapGuides`],
                        'defaultKey': `ALT+G`,
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer[`setShowMiniMapGuides`]();
                        },
                        'keyUp': null,
                        'type': `normal`
                    },
                    'hk-hideChat': {
                        'label': ogarcomms['hk-hideChat'],
                        'defaultKey': 'H',
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer['hideChat']();
                        },
                        'keyUp': null,
                        'type': `normal`
                    },
                    'hk-showHUD': {
                        'label': ogarcomms[`hk-showHUD`],
                        'defaultKey': `ALT+H`,
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer['setShowHUD']();
                        },
                        'keyUp': null,
                        'type': 'normal'
                    },
                    'hk-copyLb': {
                        'label': ogarcomms[`hk-copyLb`],
                        'defaultKey': 'L',
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer[`copyLb`]();
                        },
                        'keyUp': null,
                        'type': `normal`
                    },
                    'hk-showLb': {
                        'label': ogarcomms[`hk-showLb`],
                        'defaultKey': 'ALT+L',
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer[`setShowLb`]();
                        },
                        'keyUp': null,
                        'type': `normal`
                    },
                    'hk-toggleAutoZoom': {
                        'label': ogarcomms[`hk-toggleAutoZoom`],
                        'defaultKey': '',
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer[`toggleAutoZoom`]();
                        },
                        'keyUp': null,
                        'type': 'normal'
                    },
                    'hk-resetZoom': {
                        'label': ogarcomms[`hk-resetZoom`],
                        'defaultKey': 'Z',
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer[`resetZoom`](!0);
                        },
                        'keyUp': function() {
                            ogarminimapdrawer && ogarminimapdrawer[`resetZoom`](!1);
                        },
                        'type': `normal`
                    },
                    'hk-toggleDeath': {
                        'label': ogarcomms[`hk-toggleDeath`],
                        'defaultKey': 'X',
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer[`toggleDeath`]();
                        },
                        'keyUp': null,
                        'type': `normal`
                    },
                    'hk-clearChat': {
                        'label': ogarcomms[`hk-clearChat`],
                        'defaultKey': 'C',
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer[`displayChatHistory`](!0);
                        },
                        'keyUp': function() {
                            ogarminimapdrawer && ogarminimapdrawer[`displayChatHistory`](!1);
                        },
                        'type': `normal`
                    },
                    'hk-showBgSectors': {
                        'label': ogarcomms[`hk-showBgSectors`],
                        'defaultKey': 'B',
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer[`setShowBgSectors`]();
                        },
                        'keyUp': null,
                        'type': `normal`
                    },
                    'hk-hideBots': {
                        'label': ogarcomms[`hk-hideBots`],
                        'defaultKey': `ALT+B`,
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer['setHideSmallBots']();
                        },
                        'keyUp': null,
                        'type': `normal`
                    },
                    'hk-showNames': {
                        'label': ogarcomms[`hk-showNames`],
                        'defaultKey': 'N',
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer[`setShowNames`]();
                        },
                        'keyUp': null,
                        'type': `normal`
                    },
                    'hk-hideTeammatesNames': {
                        'label': ogarcomms[`hk-hideTeammatesNames`],
                        'defaultKey': '',
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer[`setHideTeammatesNames`]();
                        },
                        'keyUp': null,
                        'type': `normal`
                    },
                    'hk-showMass': {
                        'label': ogarcomms[`hk-showMass`],
                        'defaultKey': 'M',
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer[`setShowMass`]();
                        },
                        'keyUp': null,
                        'type': `normal`
                    },
                    'hk-showMiniMap': {
                        'label': ogarcomms[`hk-showMiniMap`],
                        'defaultKey': `ALT+M`,
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer[`setShowMiniMap`]();
                        },
                        'keyUp': null,
                        'type': `normal`
                    },
                    'hk-chatMessage': {
                        'label': ogarcomms['hk-chatMessage'],
                        'defaultKey': `ENTER`,
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer[`enterChatMessage`]();
                        },
                        'keyUp': null,
                        'type': `special`
                    },
                    'hk-quickResp': {
                        'label': ogarcomms['hk-quickResp'],
                        'defaultKey': `TILDE`,
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer[`quickResp`]();
                        },
                        'keyUp': null,
                        'type': `normal`
                    },
                    'hk-autoResp': {
                        'label': ogarcomms[`hk-autoResp`],
                        'defaultKey': '',
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer[`toggleAutoResp`]();
                        },
                        'keyUp': null,
                        'type': 'normal'
                    },
                    'hk-zoom1': {
                        'label': ogarcomms['hk-zoomLevel'] + ' 1',
                        'defaultKey': `ALT+1`,
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer['setZoom'](0.5);
                        },
                        'keyUp': null,
                        'type': `normal`
                    },
                    'hk-zoom2': {
                        'label': ogarcomms[`hk-zoomLevel`] + ' 2',
                        'defaultKey': `ALT+2`,
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer[`setZoom`](0.25);
                        },
                        'keyUp': null,
                        'type': `normal`
                    },
                    'hk-zoom3': {
                        'label': ogarcomms[`hk-zoomLevel`] + ' 3',
                        'defaultKey': `ALT+3`,
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer[`setZoom`](0.125);
                        },
                        'keyUp': null,
                        'type': `normal`
                    },
                    'hk-zoom4': {
                        'label': ogarcomms['hk-zoomLevel'] + ' 4',
                        'defaultKey': `ALT+4`,
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer['setZoom'](0.075);
                        },
                        'keyUp': null,
                        'type': 'normal'
                    },
                    'hk-zoom5': {
                        'label': ogarcomms[`hk-zoomLevel`] + ' 5',
                        'defaultKey': `ALT+5`,
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer[`setZoom`](0.05);
                        },
                        'keyUp': null,
                        'type': `normal`
                    },
                    'hk-switchServerMode': {
                        'label': ogarcomms[`hk-switchServerMode`],
                        'defaultKey': '=',
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer[`switchServerMode`]();
                        },
                        'keyUp': null,
                        'type': `normal`
                    },
                    'hk-showTargeting': {
                        'label': ogarcomms[`hk-showTargeting`],
                        'defaultKey': '',
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer[`setShowTargeting`]();
                        },
                        'keyUp': null,
                        'type': 'normal'
                    },
                    'hk-setTargeting': {
                        'label': ogarcomms[`hk-setTargeting`],
                        'defaultKey': '',
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer[`setTargeting`]();
                        },
                        'keyUp': null,
                        'type': `normal`
                    },
                    'hk-cancelTargeting': {
                        'label': ogarcomms[`hk-cancelTargeting`],
                        'defaultKey': '',
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer['cancelTargeting']();
                        },
                        'keyUp': null,
                        'type': `normal`
                    },
                    'hk-changeTarget': {
                        'label': ogarcomms[`hk-changeTarget`],
                        'defaultKey': '',
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer[`changeTarget`]();
                        },
                        'keyUp': null,
                        'type': 'normal'
                    },
                    'hk-privateMiniMap': {
                        'label': ogarcomms[`hk-privateMiniMap`],
                        'defaultKey': '',
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer[`setPrivateMiniMap`]();
                        },
                        'keyUp': null,
                        'type': `normal`
                    },
                    'hk-showQuest': {
                        'label': ogarcomms[`hk-showQuest`],
                        'defaultKey': '',
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer[`setShowQuest`]();
                        },
                        'keyUp': null,
                        'type': `normal`
                    },
                    'hk-comm1': {
                        'label': ogario1Commands['comm1'],
                        'defaultKey': '1',
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer[`sendCommand`](1);
                        },
                        'keyUp': null,
                        'type': `command`
                    },
                    'hk-comm2': {
                        'label': ogario1Commands['comm2'],
                        'defaultKey': '2',
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer[`sendCommand`](2);
                        },
                        'keyUp': null,
                        'type': `command`
                    },
                    'hk-comm3': {
                        'label': ogario1Commands[`comm3`],
                        'defaultKey': '3',
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer[`sendCommand`](3);
                        },
                        'keyUp': null,
                        'type': `command`
                    },
                    'hk-comm4': {
                        'label': ogario1Commands[`comm4`],
                        'defaultKey': '4',
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer[`sendCommand`](4);
                        },
                        'keyUp': null,
                        'type': `command`
                    },
                    'hk-comm5': {
                        'label': ogario1Commands[`comm5`],
                        'defaultKey': '5',
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer[`sendCommand`](5);
                        },
                        'keyUp': null,
                        'type': `command`
                    },
                    'hk-comm6': {
                        'label': ogario1Commands[`comm6`],
                        'defaultKey': '6',
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer[`sendCommand`](6);
                        },
                        'keyUp': null,
                        'type': `command`
                    },
                    'hk-comm7': {
                        'label': ogario1Commands[`comm7`],
                        'defaultKey': '7',
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer[`sendCommand`](7);
                        },
                        'keyUp': null,
                        'type': `command`
                    },
                    'hk-comm8': {
                        'label': ogario1Commands['comm8'],
                        'defaultKey': '8',
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer[`sendCommand`](8);
                        },
                        'keyUp': null,
                        'type': `command`
                    },
                    'hk-comm9': {
                        'label': ogario1Commands[`comm9`],
                        'defaultKey': '9',
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer['sendCommand'](9);
                        },
                        'keyUp': null,
                        'type': 'command'
                    },
                    'hk-comm0': {
                        'label': ogario1Commands[`comm0`],
                        'defaultKey': '0',
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer['sendCommand'](0);
                        },
                        'keyUp': null,
                        'type': `command`
                    },
                    'hk-comm10': {
                        'label': ogario1Commands[`comm10`],
                        'defaultKey': `MOUSE WHEEL`,
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer[`sendCommand`](10);
                        },
                        'keyUp': null,
                        'type': `command`
                    },
                    'hk-comm11': {
                        'label': ogario1Commands[`comm11`],
                        'defaultKey': `LEFT`,
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer[`sendCommand`](11);
                        },
                        'keyUp': null,
                        'type': `command`
                    },
                    'hk-comm12': {
                        'label': ogario1Commands['comm12'],
                        'defaultKey': 'UP',
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer[`sendCommand`](12);
                        },
                        'keyUp': null,
                        'type': `command`
                    },
                    'hk-comm13': {
                        'label': ogario1Commands[`comm13`],
                        'defaultKey': 'RIGHT',
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer[`sendCommand`](13);
                        },
                        'keyUp': null,
                        'type': `command`
                    },
                    'hk-comm14': {
                        'label': ogario1Commands[`comm14`],
                        'defaultKey': `DOWN`,
                        'keyDown': function() {
                            ogarminimapdrawer && ogarminimapdrawer[`sendCommand`](14);
                        },
                        'keyUp': null,
                        'type': `command`
                    }
                },
                lastkeys = {
                    'lastPressedKey': '',
                    'lastKeyId': '',
                    'defaultMessageKey': `ENTER`,
                    'inputClassName': `custom-key-in form-control input-sm`,
                    'loadDefaultHotkeys': function() {
                        for (var ogarsettings in ogario1Hotkeys = {}, ogario11Hotkeys) ogario11Hotkeys[`hasOwnProperty`](ogarsettings) && (ogario1Hotkeys[ogario11Hotkeys[ogarsettings][`defaultKey`]] = ogarsettings);
                        ogario1Hotkeys[`spec-messageKey`] = this[`defaultMessageKey`];
                    },
                    'loadHotkeys': function() {
                        null !== more2ogarset['localStorage'][`getItem`](`ogarioHotkeys`) ? ogario1Hotkeys = JSON[`parse`](more2ogarset[`localStorage`]['getItem'](`ogarioHotkeys`)) : this[`loadDefaultHotkeys`](), null !== more2ogarset[`localStorage`][`getItem`](`ogarioCommands`) && (ogario1Commands = JSON[`parse`](more2ogarset[`localStorage`][`getItem`](`ogarioCommands`)));
                    },
                    'saveHotkeys': function() {
                        more2ogarset[`localStorage`][`setItem`](`ogarioHotkeys`, JSON[`stringify`](ogario1Hotkeys)), this[`saveCommands`]();
                    },
                    'saveCommands': function() {
                        moreogarset(`#hotkeys .command-in`)[`each`](function() {
                            var ogarsettings = moreogarset(this),
                                more2ogarset = ogarsettings[`attr`]('id');
                            ogario1Commands[`hasOwnProperty`](more2ogarset) && (ogario1Commands[more2ogarset] = ogarsettings[`val`]());
                        }), more2ogarset[`localStorage`]['setItem'](`ogarioCommands`, JSON['stringify'](ogario1Commands));
                    },
                    'resetHotkeys': function() {
                        this[`loadDefaultHotkeys`](), moreogarset(`#hotkeys-cfg .custom-key-in`)['each'](function() {
                            var ogarsettings = moreogarset(this)['attr']('id');
                            ogario11Hotkeys[ogarsettings] && moreogarset(this)[`val`](ogario11Hotkeys[ogarsettings][`defaultKey`]);
                        });
                    },
                    'setHotkeysMenu': function() {
                        var ogarsettings = this;
                        for (var more2ogarset in moreogarset(`body`)[`append`]('<div id=\"hotkeys\"><div id=\"hotkeys-menu\"><button id=\"reset-hotkeys\" class=\"btn btn-primary\">' + ogarcomms[`restoreSettings`] + `</button> <button id=\"save-hotkeys\" class=\"btn btn-success\">` + ogarcomms[`saveSett`] + '</button> <button id=\"close-hotkeys\" class=\"btn btn-danger\">' + ogarcomms['close'] + `</button></div><div id=\"hotkeys-cfg\"></div><div id=\"hotkeys-inst\"><ul><li>` + ogarcomms[`hk-inst-assign`] + `</li><li>` + ogarcomms[`hk-inst-delete`] + `</li><li>` + ogarcomms[`hk-inst-keys`] + `</li></ul></div></div>`), ogario11Hotkeys)
                            if (ogario11Hotkeys[`hasOwnProperty`](more2ogarset)) {
                                var ogarcanvas = ogario11Hotkeys[more2ogarset],
                                    more3ogarset = '';
                                for (var more4ogarset in ogario1Hotkeys)
                                    if (ogario1Hotkeys[`hasOwnProperty`](more4ogarset) && ogario1Hotkeys[more4ogarset] === more2ogarset) {
                                        more3ogarset = more4ogarset;
                                        break;
                                    } if ('hk-switchServerMode' === more2ogarset && ogarminimapdrawer && !ogarminimapdrawer[`privateIP`]) continue;
                                if (`command` === ogarcanvas[`type`]) {
                                    var ogarbuffed = more2ogarset[`replace`](`hk-`, '');
                                    moreogarset('#hotkeys-cfg')['append'](`<div class=\"row\"><div class=\"key-label\"><input id=\"` + ogarbuffed + `\" class=\"command-in form-control input-sm\" value=\"` + ogario1Commands[ogarbuffed] + `\" maxlength=\"80\" /></div><div class=\"default-key\">` + ogarcanvas['defaultKey'] + `</div><div class=\"custom-key\"><input id=\"` + more2ogarset + `\" class=\"custom-key-in form-control input-sm\" value=\"` + more3ogarset + `\" /></div></div>`);
                                } else moreogarset(`#hotkeys-cfg`)[`append`](`<div class=\"row\"><div class=\"key-label\">` + ogarcanvas[`label`] + `</div><div class=\"default-key\">` + ogarcanvas[`defaultKey`] + `</div><div class=\"custom-key\"><input id=\"` + more2ogarset + `\" class=\"custom-key-in form-control input-sm\" value=\"` + more3ogarset + `\" /></div></div>`);
                            } moreogarset(document)['on'](`click`, `#reset-hotkeys`, function(more2ogarset) {
                            more2ogarset[`preventDefault`](), ogarsettings[`resetHotkeys`]();
                        }), moreogarset(document)['on'](`click`, `#save-hotkeys`, function(more2ogarset) {
                            more2ogarset[`preventDefault`](), ogarsettings[`saveHotkeys`](), moreogarset(`#hotkeys`)[`fadeOut`](500);
                        }), moreogarset(document)['on']('click', `#close-hotkeys`, function(ogarsettings) {
                            ogarsettings[`preventDefault`](), moreogarset(`#hotkeys`)[`fadeOut`](500);
                        }), moreogarset(document)['on'](`click`, `.hotkeys-link`, function(ogarsettings) {
                            moreogarset(`#hotkeys`)[`fadeIn`](500), moreogarset(`#hotkeys-cfg`)['perfectScrollbar'](`update`), ogarcommando1();
                        }), moreogarset(`#hotkeys-cfg`)[`perfectScrollbar`](), csssettings && csssettings[`setMenuBg`]();
                    },
                    'getPressedKey': function(ogarsettings) {
                        var more2ogarset = '',
                            ogarcanvas = '';
                        switch (ogarsettings[`ctrlKey`] || 17 == ogarsettings['keyCode'] ? more2ogarset = `CTRL` : (ogarsettings[`altKey`] || 18 == ogarsettings[`keyCode`]) && (more2ogarset = `ALT`), ogarsettings['keyCode']) {
                            case 9:
                                ogarcanvas = `TAB`;
                                break;
                            case 13:
                                ogarcanvas = `ENTER`;
                                break;
                            case 16:
                                ogarcanvas = 'SHIFT';
                                break;
                            case 17:
                            case 18:
                                break;
                            case 27:
                                ogarcanvas = `ESC`;
                                break;
                            case 32:
                                ogarcanvas = 'SPACE';
                                break;
                            case 37:
                                ogarcanvas = 'LEFT';
                                break;
                            case 38:
                                ogarcanvas = 'UP';
                                break;
                            case 39:
                                ogarcanvas = `RIGHT`;
                                break;
                            case 40:
                                ogarcanvas = `DOWN`;
                                break;
                            case 46:
                                ogarcanvas = `DEL`;
                                break;
                            case 61:
                            case 187:
                                ogarcanvas = '=';
                                break;
                            case 192:
                                ogarcanvas = `TILDE`;
                                break;
                            default:
                                ogarcanvas = String['fromCharCode'](ogarsettings[`keyCode`]);
                        }
                        return '' !== more2ogarset ? '' !== ogarcanvas ? more2ogarset + '+' + ogarcanvas : more2ogarset : ogarcanvas;
                    },
                    'deleteHotkey': function(ogarsettings, more2ogarset) {
                        delete ogario1Hotkeys[ogarsettings], moreogarset('#' + more2ogarset)[`val`]('');
                    },
                    'setDefaultHotkey': function(ogarsettings) {
                        var more2ogarset = !1;
                        return ogario11Hotkeys[ogarsettings] && !ogario1Hotkeys[`hasOwnProperty`](ogario11Hotkeys[ogarsettings][`defaultKey`]) ? (more2ogarset = ogario11Hotkeys[ogarsettings][`defaultKey`], ogario1Hotkeys[more2ogarset] = ogarsettings, more2ogarset) : more2ogarset;
                    },
                    'setHotkey': function(ogarsettings, more2ogarset) {
                        if (more2ogarset && (this[`lastPressedKey`] !== ogarsettings || this[`lastKeyId`] !== more2ogarset)) {
                            var ogarcanvas = moreogarset('#' + more2ogarset)[`val`]();
                            if (this['deleteHotkey'](ogarcanvas, more2ogarset), `DEL` !== ogarsettings) {
                                if (ogario1Hotkeys[ogarsettings] && ogario1Hotkeys[ogarsettings] !== more2ogarset) {
                                    var more3ogarset = ogario1Hotkeys[ogarsettings],
                                        more4ogarset = this[`setDefaultHotkey`](more3ogarset);
                                    more4ogarset ? (ogario1Hotkeys[more4ogarset] = more3ogarset, moreogarset('#' + more3ogarset)[`val`](more4ogarset)) : this[`deleteHotkey`](ogarsettings, more3ogarset);
                                }
                                ogario1Hotkeys[ogarsettings] = more2ogarset, moreogarset('#' + more2ogarset)[`val`](ogarsettings), `hk-chatMessage` === more2ogarset && (ogario1Hotkeys[`spec-messageKey`] = ogarsettings), this[`lastPressedKey`] = ogarsettings, this[`lastKeyId`] = more2ogarset;
                            }
                        }
                    },
                    'init': function() {
                        this[`loadHotkeys`](), this[`setHotkeysMenu`]();
                    }
                };

            function ogarjoiner(ogarsettings) {
                more2ogarset[`history`] && more2ogarset[`history`]['replaceState'] && more2ogarset[`history`][`replaceState`]({}, more2ogarset['document'][`title`], ogarsettings);
            }

            function ogarassembler() {
                more2ogarset['onkeydown'] = function(ogarsettings) {
                    81 == ogarsettings[`keyCode`] && more2ogarset[`core`][`specialOn`] && more2ogarset[`core`][`specialOn`]();
                }, more2ogarset[`onkeyup`] = function(ogarsettings) {};
            }

            function ogarhusettings() {
                var ogarsettings = more2ogarset['innerWidth'],
                    more3ogarset = more2ogarset[`innerHeight`],
                    more4ogarset = moreogarset(`#helloContainer`),
                    ogarbuffed = more4ogarset['innerHeight']();
                ogarbuffed > 0 ? ogarcanvas['menuHeight'] = ogarbuffed : ogarbuffed = ogarcanvas['menuHeight'] || 618;
                var ogarlanguage = Math['min'](1, more3ogarset / ogarbuffed),
                    ogaractuallanguage = ogarbuffed * ogarlanguage,
                    ogarcomms = Math['round'](more3ogarset / 2 - 0.5 * ogaractuallanguage),
                    ogario1Commands = 'translate(-50%, 0%) scale(' + ogarlanguage + ')';
                more4ogarset[`css`](`transform`, ogario1Commands), more4ogarset[`css`](`-ms-transform`, ogario1Commands), more4ogarset[`css`](`-webkit-transform`, ogario1Commands), more4ogarset[`css`]('top', ogarcomms + 'px'), ogarcanvas[`innerW`] = ogarsettings, ogarcanvas[`innerH`] = more3ogarset;
            }

            function ogarcommando1() {
                ogarminimapdrawer[`protocolMode`] || (more2ogarset[`onkeydown`] = function(ogarsettings) {});
            }
            document[`onkeydown`] = function(ogarsettings) {
                var more2ogarset = lastkeys['getPressedKey'](ogarsettings);
                if (('INPUT' !== ogarsettings[`target`]['tagName'] || ogarsettings[`target`][`className`] === lastkeys[`inputClassName`] || more2ogarset === ogario1Hotkeys[`spec-messageKey`]) && '' !== more2ogarset && !ogarioefaultHotkeys[more2ogarset]) {
                    if (ogarioefaultHotkeys[more2ogarset] = !0, `ESC` === more2ogarset) return ogarsettings[`preventDefault`](), void(ogarminimapdrawer && ogarminimapdrawer[`showMenu`]());
                    if (ogarsettings[`target`][`className`] === lastkeys[`inputClassName`]) return ogarsettings[`preventDefault`](), void lastkeys[`setHotkey`](more2ogarset, ogarsettings[`target`]['id']);
                    if (ogario1Hotkeys[more2ogarset]) {
                        ogarsettings[`preventDefault`]();
                        var ogarcanvas = ogario1Hotkeys[more2ogarset];
                        '' !== ogarcanvas && ogario11Hotkeys[ogarcanvas] && ogario11Hotkeys[ogarcanvas][`keyDown`] && ogario11Hotkeys[ogarcanvas][`keyDown`]();
                    }
                }
            }, document['onkeyup'] = function(ogarsettings) {
                var more2ogarset = lastkeys[`getPressedKey`](ogarsettings);
                if ('' !== more2ogarset) {
                    if (ogario1Hotkeys[more2ogarset]) {
                        var ogarcanvas = ogario1Hotkeys[more2ogarset];
                        '' !== ogarcanvas && ogario11Hotkeys[ogarcanvas] && ogario11Hotkeys[ogarcanvas][`keyUp`] && ogario11Hotkeys[ogarcanvas][`keyUp`]();
                    }
                    ogarioefaultHotkeys[more2ogarset] = !1;
                }
            }, more2ogarset[`onmousedown`] = function(ogarsettings) {
                moreogarset(`#overlays`)['is'](`:visible`) || (2 == ogarsettings['which'] ? (ogarsettings['preventDefault'](), ogarminimapdrawer && ogarminimapdrawer[`sendCommand`](10)) : (ogario1Settings['mouseSplit'] && (1 == ogarsettings[`which`] && !ogario1Settings[`mouseInvert`] || 3 == ogarsettings[`which`] && ogario1Settings[`mouseInvert`]) && (ogarsettings[`preventDefault`](), ogarminimapdrawer && ogarminimapdrawer[`split`]()), ogario1Settings['mouseFeed'] && (3 == ogarsettings[`which`] && !ogario1Settings[`mouseInvert`] || 1 == ogarsettings[`which`] && ogario1Settings[`mouseInvert`]) && (ogarsettings[`preventDefault`](), ogarminimapdrawer && ogarminimapdrawer[`macroFeed`](!0))));
            }, more2ogarset[`onmouseup`] = function(ogarsettings) {
                ogario1Settings[`mouseFeed`] && (3 == ogarsettings[`which`] && !ogario1Settings[`mouseInvert`] || 1 == ogarsettings[`which`] && ogario1Settings[`mouseInvert`]) && ogarminimapdrawer && ogarminimapdrawer['macroFeed'](!1);
            }, more2ogarset[`onbeforeunload`] = function(ogarsettings) {
                return ogarcanvas[`play`] ? ogarcomms[`exit`] : void 0;
            }, ogarcanvas = doagarcommand, more3ogarset = ogarsettings('buffer')[`Buffer`], more4ogarset = ogarsettings(`lz4`), `/ogario` === more2ogarset[`location`]['pathname'] && ogarjoiner('/' + more2ogarset['location']['hash']), more2ogarset[`onresize`] = function() {
                ogarfooddrawer[`resizeCanvas`](), ogarhusettings();
            }, ogarassembler(), more2ogarset[`core`] = {
                'connect': function(ogarsettings) {
                    doagarcommand[`connect`](ogarsettings);
                },
                'disconnect': function() {},
                'sendNick': function(ogarsettings) {
                    doagarcommand[`sendNick`](ogarsettings);
                },
                'sendSpectate': function() {
                    doagarcommand[`sendSpectate`]();
                },
                'eject': function() {
                    doagarcommand['sendEject']();
                },
                'split': function() {
                    doagarcommand['sendSplit']();
                },
                'specialOn': function() {
                    doagarcommand['sendFreeSpectate']();
                },
                'specialOff': function() {
                    doagarcommand['sendFreeSpectate']();
                },
                'sendFbToken': function(ogarsettings) {
                    doagarcommand['sendFbToken'](ogarsettings);
                },
                'sendGplusToken': function(ogarsettings) {
                    doagarcommand['sendGplusToken'](ogarsettings);
                },
                'recaptchaResponse': function(ogarsettings) {
                    doagarcommand['sendRecaptcha'](ogarsettings);
                },
                'setClientVersion': function(ogarsettings, more2ogarset) {
                    doagarcommand['setClientVersion'](ogarsettings, more2ogarset);
                },
                'proxyMobileData': function(ogarsettings = []) {
                    if (Array['isArray'](ogarsettings)) {
                        8 == ogarsettings[0] && ogarsettings[`unshift`](102);
                        var more2ogarset = doagarcommand[`createView`](ogarsettings[`length`]);
                        doagarcommand[`sendMessage`](more2ogarset);
                    } else console[`log`](`ProxyMobileData ERROR: Array data required.`);
                }
            }, more2ogarset['master'][`getClientVersion`](), csssettings[`init`](), ogarminimapdrawer[`init`](), ogarminimapdrawer[`getDefaultSettings`](), ogarminimapdrawer[`connect`](), lastkeys[`init`](), doagarcommand['init'](), ogarfooddrawer[`init`](), more2ogarset[`master`][`init`](), ogarhusettings();
        })(window, window[`ogario`], window[`jQuery`]);
    }, {
        'buffer': 3,
        'lz4': 18
    }]
});
