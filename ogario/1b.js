// WARNING! This file contains some subset of JS that is not supported by type inference.
// You can try checking 'Transpile to ES5' checkbox if you want the types to be inferred
'use strict';
var _0x203f = ['<span class="command-nick">', ': </span><span class="command-text">', "scrollHeight", "warning", "</span>", '<ol class="user-list">', "<li><strong>", '</strong> <button data-user-id="', '" class="btn btn-xs ', "</button></li>", "displayUserList", "activeUsers", "mutedUsers", "setMessageSound", "setCommandSound", "ogicon-volume-mute2", "ogicon-volume-high", "setSound", "setTargetingInfo", "#set-targeting", "targetStatus", "#target-summary", "updateTarget", "targetSkinURL", "#target-skin, #target-nick, #target-summary", 
"targetNotSet", "#target-panel-hud a", "#target-skin, #target-nick, #target-status, #target-summary", "#target-status", "targetDead", "setTarget", "#target-skin", "#target-skin img", "https://cdn.ogario.ovh/static/img/blank.png", "targetDistance", ': <span class="hud-main-color">', "]</span>", "targetMass", "getQuestProgressLabel", "loadSettings", "loadProfiles", "setLang", "setUI", "setTheme", "setMainButtons", "setDisableChat", "preloadChatSounds", "updateInterval", "3.4.0", "flushCellsData", "clientKey", 
"accessTokenSent", "connectionOpened", "loggedIn", "onOpen", "onMessage", "onError", "onClose", "getWS", "sendServerJoin", "sendServerData", "displayLeaderboard", "onConnect", "[OGARio] Game server socket open", "clientVersion", "sendMessage", "protocolKey", "shiftMessage", "[OGARio] Game server socket error", "onDisconnect", "[OGARio] Game server socket close", "shiftKey", "sendAction", "sendPosition", "unescape", "cursorX", "cursorY", "clientVersionString", "writeUint32", "[OGARio] Facebook Token: ", 
"sendAccessToken", "[OGARio] Google Token: ", "[OGARio] Generated client key:", "decodeBlock", "getFloat32", "viewY", "pieChart", "playerPosition", "escape", "handleLeaderboard", "sqrt", "[OGARio] Captcha requested", "recaptchaRequested", "logout", "battleRoyale", "startTime", "joined", "players", "shrinkTime", "timeLeft", "serverTimeDiff", "targetRadius", "rank", "playerRank", "[OGARio] Received protocol key:", "generateClientKey", "login", "serverTime", "[OGARio] Unknown opcode:", "decompressMessage", 
"updateCells", "viewMinY", "viewMaxX", "setMapOffset", "viewMinX", "[OGARio] Unknown sub opcode:", "<span>", "isPlayer", '<span class="me">', '<span class="teammate">', "playerNick", '<span class="lb-data"><span id="lbmarker" class="fa fa-map-marker"> ', "</span></span>", "mapMinX", "mapMinY", "mapMaxY", "rgb2Hex", "decodeURIComponent", "readUInt16LE", "color2Hex", "playerSize", "recalculatePlayerMass", "biggerSTECellsCache", "biggerCellsCache", "STECellsCache", "setCellOppColor", "cacheCells", "smallerCellsCache", 
"#FF008C", "#BE00FF", "#FF0A00", "#64FF00", "clientX", "clientY", "wheelDelta", "detail", "keyCode", "pressedKeys", "sendNick", "sendSplit", "sendFreeSpectate", "sendEject", "onkeyup", "userAgent", "addEventListener", "setZoom", "onmousewheel", "setClientVersion", "ctx", "renderFrame", "calculatePlayerMassAndPosition", "camX", "cameraSpeed", "camY", "getZoom", "setView", "getCursorPosition", "sortCells", "compareCells", "drawGrid", "mapMaxX", "sectorsColor", "drawBattleArea", "drawCommander", "drawVirusesRange", 
"drawFood", "drawCursorTracking", "drawGhostCells", "sectorsFontWeight", "sectorsFontFamily", "textBaseline", "middle", "skrrt", "commanderImage", "commanderImage1", "commanderImage2", "cAlpha", "spawnX", "rotate", "cAngle", "cRadius", "cAngle2", "updateCommander", "cAngle1", "drawCachedFood", "pellet", "rect", "darkTheme", "drawCircles", "#00C8FF", "#333333", "#FF3333", "#33FF33", "#3333FF", "drawDangerArea", "drawSafeArea", "battleAreaMap", "battleAreaMapCtx", "radius", "maxRadius", "fillRect", 
"globalCompositeOperation", "destination-out", "drawDashedCircle", "foodColor", "lineCap", "fpsLastRequest", "renderedFrames", "countFps", "requestAnimationFrame", "render", "resizeCanvas", "hk-feed", "normal", "hk-macroFeed", "macroFeed", "hk-split", "SPACE", "ALT+Q", "popSplit", "hk-split16", "SHIFT", "split16", "hk-pause", "setPause", "hk-showTop5", "setShowTop5", "hk-showTime", "setShowTime", "hk-showSplitRange", "setShowSplitRange", "setShowSplitInd", "hk-showTeammatesInd", "setShowTeammatesInd", 
"hk-showOppColors", "setShowOppColors", "hk-toggleSkins", "toggleSkins", "hk-transparentSkins", "setTransparentSkins", "hk-showSkins", "setShowSkins", "hk-showStats", "ALT+S", "setShowStats", "hk-toggleCells", "toggleCells", "hk-showFood", "setShowFood", "hk-showGrid", "setShowGrid", "hk-showMiniMapGuides", "ALT+G", "setShowMiniMapGuides", "hk-hideChat", "ALT+H", "setShowHUD", "hk-copyLb", "copyLb", "hk-showLb", "ALT+L", "hk-toggleAutoZoom", "toggleAutoZoom", "resetZoom", "toggleDeath", "displayChatHistory", 
"setShowBgSectors", "hk-hideBots", "ALT+B", "hk-showNames", "setShowNames", "hk-hideTeammatesNames", "setHideTeammatesNames", "hk-showMass", "setShowMass", "hk-showMiniMap", "ALT+M", "setShowMiniMap", "hk-chatMessage", "ENTER", "TILDE", "hk-autoResp", "toggleAutoResp", "ALT+1", "hk-zoomLevel", "ALT+2", "ALT+3", "ALT+4", "ALT+5", "hk-switchServerMode", "switchServerMode", "hk-setTargeting", "hk-cancelTargeting", "hk-changeTarget", "hk-showQuest", "setShowQuest", "comm1", "sendCommand", "command", 
"comm5", "MOUSE WHEEL", "LEFT", "RIGHT", "custom-key-in form-control input-sm", "defaultKey", "spec-messageKey", "ogarioHotkeys", "loadDefaultHotkeys", "ogarioCommands", "saveCommands", "#hotkeys .command-in", "#hotkeys-cfg .custom-key-in", '</button> <button id="close-hotkeys" class="btn btn-danger">', '</button></div><div id="hotkeys-cfg"></div><div id="hotkeys-inst"><ul><li>', "hk-inst-assign", "</li><li>", "hk-inst-delete", "hk-inst-keys", "hk-", "#hotkeys-cfg", '<div class="row"><div class="key-label"><input id="', 
'" maxlength="80" /></div><div class="default-key">', '</div><div class="custom-key"><input id="', '" /></div></div>', "label", '</div><div class="default-key">', '" class="custom-key-in form-control input-sm" value="', "#reset-hotkeys", "resetHotkeys", "saveHotkeys", "#hotkeys", "#close-hotkeys", ".hotkeys-link", "ctrlKey", "CTRL", "altKey", "ALT", "ESC", "DOWN", "DEL", "lastPressedKey", "deleteHotkey", "setHotkeysMenu", "INPUT", "target", "tagName", "inputClassName", "showMenu", "setHotkey", "keyDown", 
"getPressedKey", "keyUp", "onmousedown", "which", "mouseInvert", "onmouseup", "onbeforeunload", "/ogario", "pathname", "onresize", "specialOn", "sendSpectate", "sendGplusToken", "sendRecaptcha", "ProxyMobileData ERROR: Array data required.", "getClientVersion", "getDefaultSettings", "ogario", "function", "Cannot find module '", "code", "MODULE_NOT_FOUND", "call", "exports", "length", "push", "byteLength", "toByteArray", "charCodeAt", "fromByteArray", "join", "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", 
"Invalid typed array length", "__proto__", "prototype", "number", "string", "If encoding is specified then the first argument must be a string", '"value" argument must not be a number', "'offset' is out of bounds", "'length' is out of bounds", "utf8", "isEncoding", '"encoding" must be a valid string encoding', "write", "slice", "isBuffer", "copy", "Buffer", "type", "isArray", "data", '"size" argument must be a number', '"size" argument must not be negative', "Attempt to allocate Buffer larger than maximum size: 0x", 
"toString", " bytes", "binary", "utf-8", "utf-16le", "hex", "base64", "toLowerCase", "indexOf", "lastIndexOf", "val must be string, number or Buffer", "readUInt16BE", "ucs-2", "Invalid hex string", "substr", "min", "fromCharCode", "apply", "offset is not uint", "Trying to access beyond buffer length", '"buffer" argument must be a Buffer instance', '"value" argument is out of bounds', "Index out of range", "Invalid code point", "trim", "replace", "isView", "base64-js", "ieee754", "SlowBuffer", "alloc", 
"kMaxLength", "TYPED_ARRAY_SUPPORT", "foo", "error", "This browser lacks typed array (Uint8Array) support which is required by buffer v5.x. Use v4.x if you require old browser support.", "undefined", "species", "defineProperty", "poolSize", "from", "fill", "allocUnsafeSlow", "compare", "Arguments must be Buffers", "ascii", "latin1", "ucs2", "utf16le", "concat", '"list" argument must be an Array of Buffers', "allocUnsafe", "_isBuffer", "swap16", "Buffer size must be a multiple of 16-bits", "Buffer size must be a multiple of 32-bits", 
"swap64", "Buffer size must be a multiple of 64-bits", "equals", "Argument must be a Buffer", "inspect", "INSPECT_MAX_BYTES", "<Buffer ", "out of range index", "includes", "Buffer.write(string, encoding, offset[, length]) is no longer supported", "Attempt to write outside buffer bounds", "Unknown encoding: ", "_arr", "readUIntLE", "readUIntBE", "readUInt8", "readUInt32LE", "readUInt32BE", "readIntLE", "pow", "readIntBE", "readInt8", "readInt16LE", "readInt16BE", "readInt32LE", "readInt32BE", "readFloatLE", 
"read", "readFloatBE", "readDoubleLE", "writeUIntBE", "writeUInt8", "writeUInt16LE", "writeUInt32LE", "writeUInt32BE", "writeIntLE", "writeIntBE", "writeInt8", "writeInt16LE", "writeInt16BE", "writeInt32LE", "writeInt32BE", "writeFloatBE", "writeDoubleLE", "writeDoubleBE", "targetStart out of bounds", "sourceStart out of bounds", "sourceEnd out of bounds", "set", "subarray", "encoding must be a string", "Out of range index", "[object Array]", "isBoolean", "boolean", "isNull", "isNullOrUndefined", 
"isNumber", "isString", "symbol", "isUndefined", "isRegExp", "[object RegExp]", "isObject", "[object Date]", "isError", "isFunction", "isPrimitive", "../../is-buffer/index.js", "UINT32", "./lib/uint32", "UINT64", "./lib/uint64", "_low", "_high", "remainder", "fromNumber", "fromString", "toNumber", "add", "clone", "negate", "div", "division by zero", "shiftLeft", "shiftRight", "subtract", "greaterThan", "lessThan", "and", "not", "shiftr", "shiftl", "rotateLeft", "rotl", "rotateRight", "rotr", "amd", 
"_a00", "_a16", "_a32", "_a48", "multiply", "xor", "_events", "_maxListeners", "object", "n must be a positive number", 'Uncaught, unspecified "error" event. (', "addListener", "listener must be a function", "emit", "newListener", "listener", "warned", "defaultMaxListeners", "trace", "once", "removeListener", "splice", "removeAllListeners", "listenerCount", "abs", "floor", "LN2", "super_", "create", "constructor", "input too large", "compressBound", " < ", "cuint", "imul", "compress", "compressHC", 
"compressDependent", "./decoder_stream", "LZ4_uncompress", "buffer", "options", "binding", "pos", "descriptor", "MAGIC", "notEnoughData", "descriptorStart", "streamSize", "dictId", "currentStreamChecksum", "stream", "util", "inherits", "./static", "utils", "bindings", "STATES", "SIZES", "skippableSize", "state", "_main", "emit_Error", "check_Size", "Unexpected end of LZ4 stream", "read_MagicNumber", "MAGICNUMBER_SKIPPABLE", "SKIP_SIZE", "MAGICNUMBER", "DESCRIPTOR", "Invalid magic number: ", "toUpperCase", 
"read_SkippableSize", "SKIP_DATA", "read_Descriptor", "VERSION", "Invalid version: ", " != ", "Reserved bit set", "blockMaxSizes", "Invalid block max size: ", "SIZE", "read_Size", "read_DictId", "DICTID", "DESCRIPTOR_CHECKSUM", "descriptorChecksum", "DATABLOCK_SIZE", "Invalid stream descriptor checksum", "read_DataBlockSize", "EOS", "dataBlockSize", "DATABLOCK_DATA", "read_DataBlockData", "DATABLOCK_CHECKSUM", "read_DataBlockChecksum", "Invalid block checksum", "DATABLOCK_UNCOMPRESS", "dataBlock", 
"blockMaxSize", "uncompress", "Invalid data block: ", "streamChecksum", "read_EOS", "Invalid stream checksum: ", "_flush", "uncompress_DataBlock", "./encoder_stream", "LZ4_compress", "end", "keys", "forEach", "highCompression", "blockIndependence", "blockChecksum", "dict", "Invalid blockMaxSize: ", "checksum", "Transform", "./binding", "headerSize", "header", "size", "update_Checksum", "CHECKSUM_UPDATE", "compress_DataBlock", "_transform", "first", "CHECKSUM", "version", "0.5.1", "decode", "./decoder", 
"createEncoderStream", "./encoder", "encodeBound", "encodeBlock", "MAGICNUMBER_BUFFER", "EOS_BUFFER", "extension", ".lz4", "./utils", "xxhashjs", "digest", "update", "v1.8.", "nextTick", "clearTimeout has not been defined", "fun", "array", "title", "browser", "env", "argv", "versions", "off", "prependListener", "process.binding is not supported", "cwd", "chdir", "process.chdir is not supported", "umask", "./lib/_stream_duplex.js", "readable", "writable", "allowHalfOpen", "_writableState", "ended", 
"process-nextick-args", "./_stream_writable", "_readableState", "destroyed", "_destroy", "./_stream_transform", "core-util-is", "./_stream_duplex", "objectMode", "highWaterMark", "pipes", "reading", "needReadable", "emittedReadable", "readableListening", "resumeScheduled", "defaultEncoding", "readingMore", "decoder", "encoding", "string_decoder/", "StringDecoder", "_read", "destroy", "Invalid non-string/buffer chunk", "endEmitted", "stream.unshift() after end event", "stream.push() after EOF", "flowing", 
"unshift", "head", "emitReadable", "sync", "emit readable", "readable nexttick read 0", "resume read 0", "awaitDrain", "resume", "flow", "shift", "next", "tail", "isarray", "events", "listeners", "Uint8Array", "debuglog", "./internal/streams/BufferList", "./internal/streams/destroy", "close", "_undestroy", "isPaused", "setEncoding", "read: emitReadable", "need readable", "reading or ended", "do read", "pipe", "onunpipe", "cleanup", "drain", "unpipe", "ondata", "pipesCount", "onerror", "finish", "onfinish", 
"pipe count=%d opts=%j", "stdout", "stderr", "pipeOnDrain", "pipe resume", "call pause flowing=%j", "pause", "wrap", "wrapped end", "bind", "wrapped _read", "_fromList", "_process", "afterTransform", "transforming", "writecb", "write callback called multiple times", "writechunk", "needTransform", "_transformState", "transform", "flush", "prefinish", "Calling transform done when still transforming", "_transform() is not implemented", "_write", "writeencoding", "entry", "callback", "pendingcb", "corkedRequestsFree", 
"finalCalled", "ending", "finished", "decodeStrings", "bufferProcessing", "onwrite", "writing", "writelen", "errorEmitted", "corked", "bufferedRequest", "prefinished", "bufferedRequestCount", "writev", "_writev", "final", "needDrain", "allBuffers", "lastBufferedRequest", "chunk", "_final", "v0.9.", "WritableState", "util-deprecate", "./internal/streams/stream", "safe-buffer", "getBuffer", "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "hasInstance", "write after end", 
"May not write null values to stream", "cork", "setDefaultEncoding", "raw", "_write() is not implemented", "undestroy", "Cannot call a class as a function", "clear", "EventEmitter", "PassThrough", "Stream", "Writable", "./lib/_stream_writable.js", "./lib/_stream_passthrough.js", "./readable", "Argument must not be a number", "Argument must be a number", "Readable", "readable-stream/readable.js", "readable-stream/writable.js", "Duplex", "readable-stream/duplex.js", "readable-stream/transform.js", 
"readable-stream/passthrough.js", "text", "fillLast", "lastNeed", "lastTotal", "\u0413\u0453\u0412\u0407\u0413\u201a\u0412\u0457\u0413\u201a\u0412\u0405", "repeat", "lastChar", "localStorage", "true", "noDeprecation", "throwDeprecation", "traceDeprecation", "warn", "depth", "colors", "showHidden", "_extend", "customInspect", "stylize", "styles", "stringify", "getOwnPropertyNames", "message", "description", "name", "[Function", "special", "regexp", "date", " [Function", "toUTCString", "match", "map", 
"seen", "pop", "reduce", "[Getter/Setter]", "[Getter]", "[Setter]", "value", "split", "   ", "[object Error]", "format", "deprecate", "process", "NODE_DEBUG", "test", "pid", "%s %d: %s", "yellow", "bold", "green", "magenta", "red", "isSymbol", "isDate", "./support/isBuffer", "Jan", "Feb", "Mar", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "log", "%s - %s", "getHours", "getMinutes", "getSeconds", "getDate", "getMonth", "seed", "total_len", "memsize", "memory", "xxh_update", "2654435761", 
"2246822519", "3266489917", "668265263", "374761393", "fromBits", "init", "XXH", "txt", "txtCanvas", "color", "#FFFFFF", "stroke", "strokeWidth", "strokeColor", "font", "700 16px Ubuntu", "fontFamily", "Ubuntu", "fontWeight", "fontSize", "margin", "scale", "quality", "measuredWidth", "redraw", "remeasure", "setTxt", "setColor", "setStroke", "setFont", "px ", "setFontFamily", "setFontWeight", "setFontSize", "setScale", "createCanvas", "createElement", "canvas", "txtCtx", "getContext", "yote", "setDrawing", 
"setStrokeWidth", "setStrokeColor", "measureWidth", " 10px ", "measureText", "drawTxt", "width", "height", "globalAlpha", "lineWidth", "strokeStyle", "fillStyle", "strokeText", "fillText", "targetX", "targetY", "oppColor", "targetSize", "alpha", "nick", "targetNick", "nickCanvas", "mass", "massCanvas", "nickScale", "massScale", "virMassScale", "strokeScale", "lastNickSize", "massSize", "virMassSize", "nickStrokeSize", "massStrokeSize", "isFood", "isPlayerCell", "shortMass", "virMassShots", "rescale", 
"redrawNick", "optimizedNames", "optimizedMass", "removed", "redrawed", "time", "skin", "pi2", "isVirus", "setMass", "setNick", "removeCell", "cells", "food", "virusesRange", "viruses", "removePlayerCell", "playerCells", "playerCellIDs", "suckAnimation", "removedCells", "indexedCells", "moveCell", "animation", "isInView", "canvasWidth", "viewX", "canvasHeight", "redrawMass", "massTxt", "round", "kMass", "lastMass", "ceil", "max", "nickSize", "setStrokeSize", "strokeNick", "namesStroke", "massStroke", 
"viewScale", "drawNick", "namesColor", "namesFontFamily", "namesStrokeColor", "drawImage", "drawMass", "massFontFamily", "massFontWeight", "strokeMass", "massStrokeColor", "draw", "hideSmallBots", "save", "foodSize", "beginPath", "arc", "closePath", "transparentViruses", "virusAlpha", "virColors", "play", "setVirusColor", "setVirusStrokeColor", "virusStrokeColor", "virusStrokeSize", "shadowBlur", "virusGlowSize", "virusGlowColor", "yeet", "showMass", "showVirusMass", "setDrawingScale", "restore", 
"transparentCells", "myCustomColor", "oppRings", "customSkins", "showCustomSkins", "oppColors", "myTransparentSkin", "skinsAlpha", "teammatesInd", "checkSkinsMap", "noNames", "setAutoHideCellInfo", "autoHideMass", "textAlpha", "autoHideNames", "hideMyName", "hideTeammatesNames", "hideEnemiesMass", "history", "replaceState", "document", "innerWidth", "innerHeight", "menuHeight", "translate(-50%, 0%) scale(", "css", "-webkit-transform", "top", "innerW", "innerH", "protocolMode", "onkeydown", "Settings", 
"Zoom", "Respawn", "Names", "Mass", "Food", "Transparency / Colors", "Grid / Sectors", "Helpers", "Mouse Control", "HUD", "Chat", "Extras", "No skins", "No Names", "No Colors", "Show Mass", "Show Virus Mass", "Skip Stats After Death", "Show Quest", "Auto Zoom", "Animation Delay", "Camera Speed", "Cell Eat [Sucking] Animation", "Virus Glow", "Zoom Speed", "Quick Respawn [Hotkey]", "Auto Respawn", "Auto Hide Names", "Auto Hide Mass", "Auto Hide Food [Mass]", "Auto Hide Food [Zoom)]", "Optimized Names", 
"Hide My Name", "Optimized Mass [+/-2%]", "Short Mass [K]", "Virus Shots", "Hide Enemies Mass", "Vanilla Skins", "Custom Skins", "My Transparent Skin", "My Custom Color", "Transparent Viruses", "Transparent Skins", "Show Grid", "Show Background Sectors", "Show Map Borders", "Ghost Cells", "Show Minimap Guides", "Show Ghost Cells", "One-Colored Teammates", "Optimized Food", "Rainbow Food", "Opponents Rings", "Viruses Colors", "Split Range", "Viruses Range", "Names Stroke", "Mass Stroke", "Cursor Tracking", 
"Teammates Indicators", "LMB - Mouse Split", "RMB - Mouse Feed", "Disable Chat", "Hide Chat", "Sound Notifications", "Emoticons", "Show Images On Chat", "Chatbox Instead Of Popups", "Command Notification Sound", "Show Team Players", "Show targeting", "Show current time", "Show leaderboard mass", '"Leaderboard" header', "Leaderboard Players Limit", "Team Players Limit", "Centered leaderboard", "Game stats at the top", "Game stats: Mass", "Game stats: STE", "Game stats: X4 | X16 Mass Split", "Game stats: n/16", 
"Game stats: FPS", "Block popups (ads/shop/quest)", "To assign a hotkey click on the input field and press your chosen key.", "To delete a hotkey click on the input field and press the DELETE key.", "Possible key combinations with the CTRL and ALT keys.", "Feed", "Macro feed", "Split", "Double split", "Split 16", "Cell pause", "Show/hide Team Players", "Show/hide current time", "Show/hide split range", "Show/hide split indicators", "Show/hide opponents colors", "Toggle skins (custom/default)", "Show/hide skins", 
"Toggle transparent skins", "Show/hide game stats", "Toggle own cells (smallest/biggest)", "Show/hide food", "Show/hide grid", "Show/hide minimap guides", "Copy leaderboard", "Show/hide leaderboard", "Toggle auto zoom", "Reset zoom", "Zoom level", "Toggle death location", "Show/hide background sectors", "Show/hide small bots", "Show/hide names", "Show/hide teammates names", "Show/hide mass", "Quick respawn", "Toggle auto respawn", "Show/hide targeting panel", "Start/stop targeting (following)", "Cancel targeting", 
"Change target", "Show/hide quest", "Commands", "Feed me!", "Split into me!", "Need backup at %currentSector%!", "Need a teammate!", "Fuck!", "Tricksplit!", "Up!", "Right!", "Bottom!", "Theme", "Restore theme default settings", "Basic theming", "Theme preset", "Theme type", "Dark theme", "Light theme", "Map borders", "Sectors font", "Names stroke", "Mass stroke", "Virus stroke", "Border Glow", "Names font", "Mass font", "Names scale", "Mass scale", "Virus mass scale", "Text stroke scale", "Map borders width", 
"Sectors grid width", "Sectors font size", "Skins transparency", "Virus transparency", "Virus Stroke Size", "Virus Glow Size", "Border Glow Size", "Split range", "Safe area", "Danger area", "Ghost cells", "Self Color", "Commander Image", "Commander Image [2]", "Commander Image [3]", "Ghost cells transparency", "Menu theme", "Main color", "Panel [3]", "Panel Image", "Panel Image Opacity", "Transparency", "Background", "Text", "Time", "HUD font", "HUD scale", "Message background", "Message nick", "Command background", 
"Command text", "Command time", "Command nick", "Chat scale", "Sectors", "Current sector", "Guides", "Nick stroke", "My cell", "Teammates", "Death location", "Nick font", "Minimap width", "Sectors transparency", "Nick size", "My cell size", "My cell stroke size", "Teammates size", "Custom background image", "Custom cursor image", "Chat is visible!", "Skins are visible!", "Small bots below 76 are visible!", "Small bots below 76 are hidden!", "Auto respawn is on!", "Auto zoom is off!", "Distance", 
"Active players", "Total mass", "Export / import settings", "Export settings", "To export selected settings copy the code below and save it to a text file encoded in Unicode.", "Import settings", 'To import selected settings paste an exported code below and press the "Import settings" button.', "Profile", "Skins", "Add skins", "Thanks to Awesome!", "Save settings", "Saved!", "Reset to default", "Close", "Enter chat message", "Active parties", "Playlist", "Visit", "WARNING! Popups are blocked in the settings.", 
"Unmute", "Muted users", "Active users", "Show active users", "None", "Free Coins", "Gifts", "Daily Quest", "navigator", "language", "userLanguage", "hasOwnProperty", "comm2", "comm3", "comm4", "comm6", "comm7", "comm8", "comm9", "comm0", "comm10", "comm12", "comm13", "comm14", "&amp;", "&lt;", "&gt;", "&quot;", "&#x2F;", "wink.svg", "smirk.svg", "grin.svg", "xgrin.svg", "joy.svg", "sad.svg", "cry.svg", "tonguew.svg", "kiss.svg", "smileh.svg", "heart.svg", "cool.svg", "sweat.svg", "neutral.svg", 
"unamused.svg", "pouting.svg", "sleep.svg", "relaxed.svg", "expressionless.svg", "money.svg", "poo.svg", "finger.svg", "victory.svg", "thumbd.svg", "OGARio", "#fff", "de2c2d", "#252525", "#ffffff", "#12121e", "ubuntu-bold", "ubuntu", "ogario-v3", "#151515", "rgba(255,255,255,0.08)", "https://i.imgur.com/2JNEd9O.jpg", "rgba(0,0,0,0.3)", "#00c2ff", "rgba(0,0,0,0.4)", "#000000", "https://cdn.ogario.ovh/static/img/cursors/cursor_01.cur", "#353535", "#de2c2d", "rgba(0,0,0,0.09)", "rgba(36,36,36,0.63)", 
"rgba(255,0,110,1)", "https://i.imgur.com/wQKUDB3.png", "https://i.imgur.com/XODc5iZ.png", "https://i.imgur.com/Ux8Pt9I.png", "getItem", "XThemeSettings", "parse", "removeItem", "reload", "<style type='text/css'>", "appendTo", "append", '<div class="preset-box"><span class="title-box">', '</span><div class="select-wrapper"><select id="', '" class="form-control"></select></div></div>', "</option>", "val", '<div class="color-box"><span class="title-box">', '</span><div class="input-group ', '-picker"><input type="text" value="', 
'" id="', "colorpicker", "toHex", "changeColor.colorpicker", "-picker", "rgba", "toRGB", "rgba(", '<div class="slider-box"><div class="box-label"><span class="value-label">', ': </span><span id="', '</span></div><input id="', '-slider" type="range" min="', '" max="', '" value="', '"></div>', "input", "-value", "-slider", '<div class="input-box"><span class="title-box">', '" class="form-control" placeholder="', '" /></div>', "customCursor", '<div class="cursor-box"><a href="#" class="active"><img src="', 
'"></a></div>', '<div class="cursor-box"><a href="#"><img src="', "Family", "Weight", '<div class="font-box"><span class="title-box">', '<option value="ubuntu">Ubuntu</option><option value="ubuntu-bold">Ubuntu Bold</option>', '<option value="roboto">Roboto</option><option value="roboto-bold">Roboto Bold</option>', '<option value="oswald">Oswald</option><option value="oswald-bold">Oswald Bold</option>', "change", "roboto", "oswald", "Oswald", "Roboto", "#theme-main", "themePreset", "preset", "addColorBox", 
"setBgColor", "bordersColor", "borderGlowColor", "gridColor", "massColor", "virusColor", "setFoodColor", "teammatesIndColor", "setIndicatorColor", "cursorTrackingColor", "splitRangeColor", "safeAreaColor", "dangerAreaColor", "ghostCellsColor", "addFontBox", "namesFont", "sectorsFont", "sectorsFontSize", "addSliderBox", "namesScale", "borderGlowSize", "bordersWidth", "sectorsWidth", "cellsAlpha", "#theme-menu", "menuMainColorX", "setMenuMainColor", "menuPanelColorX", "setMenuPanelColor", "menuPanelColorX2", 
"addRgbaColorBox", "addInputBox", "menuImg", "Image URL", "setMenuBg", "setMenuOpacity", "setHudColors", "#theme-hud", "hudColor", "statsHudColor", "timeHudColor", "lbMeColor", "lbTeammateColor", "setHudFont", "hudScale", "#theme-chat", "messageColor", "messageTextColor", "messageTimeColor", "setChatColors", "messageNickColor", "commandsColor", "commandsTextColor", "commandsNickColor", "chatScale", "setChatScale", "#theme-minimap", "setMiniMapSectorsColor", "miniMapSectorColor", "miniMapNickStrokeColor", 
"miniMapMyCellColor", "miniMapMyCellStrokeColor", "miniMapTeammatesColor", "miniMapDeathLocationColor", "miniMapGuidesColor", "miniMapFont", "setMiniMapFont", "miniMapNickFont", "setMiniMapWidth", "miniMapSectorsOpacity", "miniMapNickSize", "miniMapNickStrokeSize", "miniMapMyCellSize", "miniMapMyCellStrokeSize", "miniMapGhostCellsAlpha", "customBackground", "#theme-images", "Cursor image URL", "https://cdn.ogario.ovh/static/img/cursors/cursor_0", ".cur", "click", "#theme-images .cursor-box a", "img", 
"src", "setCustomCursor", "#customCursor", "removeClass", "active", "addClass", '<button class="btn btn-block btn-success btn-save"">', "saveSett", "</button>", "#theme .btn-save", "saved", "saveThemeSettings", "restoreThemeSettings", "</a></div>", "preventDefault", ".skin", "#color", "#theme .", "setValue", "input[type=text]#", "select#", "massFont", "body", "background-color", "optimizedFood", "preDrawPellet", "preDrawIndicator", "background-image", "none", "*{cursor:url(", "), auto !important}", 
"*{cursor: auto}", "addCustomCSS", "cursorCSS", "setMenuTextColor", "setMenu", ".menu-image", "menuImgOpacity", "menuMainColorXx", "!important}::selection{background-color:", "}#main-menu,.agario-side-panel,#hotkeys,#exp-imp{border-color:", "}.ps-scrollbar-y, .btn-setting, #join-party-btn-2, #create-party-btn-2{background-color:", "!important}a,a:hover, .btnX{color:", "}.btn,#hotkeys-cfg .custom-key-in{color:#FFF;}.btn-primary{background-color:", "!important}.btn-primary:active,.btn-primary:disabled,.btn-primary:focus,.btn-primary:hover{background-color:", 
"!important}.btn-success{background-color:", "}.btn-success:active,.btn-success:disabled,.btn-success:focus,.btn-success:hover{background-color:", "}.btn-warning{background-color:", "!important}.btn-warning:active,.btn-warning:disabled,.btn-warning:focus,.btn-warning:hover{background-color:", "!important}.btn-danger{background-color:", "!important}.btn-danger:active,.btn-danger:disabled,.btn-danger:focus,.btn-danger:hover, .restore-settings{background-color:", "}#hotkeys-cfg .custom-key-in{background-color:", 
"}hr{border-top: 1px solid ", "menuMainColorCSS", "#main-menu,.agario-side-panel,#hotkeys,#exp-imp, #panelm, #panelx, .menu-panel, .menu-bar-button, #ip-box{background-color: ", "menuPanelColorXx", "}.form-control, .input-group-addon, .agario-panel input,.agario-panel select,.agario-side-panel input,.agario-side-panel select,.input-group-addon,.nick .input-group-btn,.skin .input-group-btn,#stream-mode,#hide-url,.menu-tabs a:hover,.menu-tabs .active,.submenu-tabs,#exp-bar .progress,#quick-menu a:hover,.quick,.select-wrapper,#hotkeys-cfg div.row:hover,#hotkeys-cfg .command-in,#exp-imp-settings textarea{background-color: ", 
"}.quick:hover,#skins a,#profiles{color:", "menuPanelColorX3", "!important}.skin-wheel-bg{border: 70px solid ", "!important;}", "menuPanelColorCSS", "menuTextColorCSS", ".agario-panel,.agario-side-panel,.agario-panel input,.agario-panel select,.agario-side-panel input,.agario-side-panel select,.input-group-addon,.dark .yt-username,#stream-mode,#hide-url,.menu-tabs a,.submenu-tabs a,#skins a.default:hover,#quick-menu a,#prev-profile.default:hover,#next-profile.default:hover,#statsText,#hotkeys,#hotkeys-cfg .command-in,#exp-imp{color:#fff;}::-webkit-input-placeholder{color:#fff!important;}::-moz-placeholder{color:#fff!important;}#user-id-tag, #version-tag,#statsSubtext,#hotkeys-inst,#exp-imp textarea,.restore-settings a,.restore-settings a:hover{color:#fff;}#hotkeys-cfg .command-in,#theme .color-box{border-color: #fff;}", 
"#menuImg", "url(", "setHudScale", ".hud-main-color,#top5-hud a,#target-panel-hud a:hover,#target-panel-hud a.active,#message-menu a{color:", "hudMainColor", "}.hud,.hud-b,#chat-emoticons{background-color:", "}.hud,.hud-b,#top5-hud a:hover,#target-panel-hud a{color:", "hudTextColor", "}.top5-mass-color{color:", "}#leaderboard-positions .me{color:", "}#leaderboard-positions .teammate{color:", "}#player{background: linear-gradient(to right,", ",rgba(255,255,255,0));}", "hudCSS", "hudFont", "#overlays-hud", 
"hudFontFamily", "hudFontWeight", "font-size", "#leaderboard-hud, #time-hud", "#top5-hud", "#top5-pos", "padding-left", "#target-hud", "padding-top", "}.toast-warning{background-color:", "}.command-text,.toast-warning .command-text{color:", "}.command-nick,.toast-warning .command-nick,.toast-warning .mute-user,.toast-warning .mute-user:hover{color:", "}.command-time{color:", "commandsTimeColor", "#message-box, #messages, #toast-container, #chat-box", "#messages, #toast-container, #chat-box", "#message-box", 
"#chat-box", ".user-list", "chatScaleCSS", "#toast-container{width:", "px}", "setMiniMapSectorsOpacity", "resetMiniMapSectors", "miniMapWidth", "miniMapTop", "#minimap-hud", "#fps-hud", "#minimap-sectors", "opacity", "setCustomBackground", "setChat", "I <3 OGARio", "https://i.imgur.com/L4X5ArV.png", ":ffa", "now", "b2dhcmlvLm92aA==", "playerX", "playerY", "core", "eject", "feedInterval", "feed", "vanillaSkins", "vannillaSkins", "selectBiggestCell", "showTop5", "setTop5", "show", "showTargeting", 
"setTargetingHUD", "hide", "showTime", "displayTime", "#time-hud", "splitRange", "showSplitInd", "noSkins", "setSkins", "displayChatInfo", "showSkinsMsg", "transparentSkins", "#stats-hud", "toggle", "showFood", "showGrid", "showMiniMapGuides", ":teams", "gameMode", "#leaderboard-hud", "showBgSectors", "hideSmallBotsMsg", "showMiniMap", "setMiniMap", "showQuest", "setQuest", "#quest-hud", "autoZoom", "autoZoomMsg", "zoomResetValue", "zoomValue", "lastDeath", "deathLocations", "retryResp", ".btn-play-guest", 
":visible", ".btn-play", "quickResp", "hideMenu", "gameServerConnect", "tryResp", "autoResp", "setAutoResp", "#overlays", "stop", "#skipStats", "prop", "autoRespMsg", "<input>", "#leaderboard-positions", "select", "execCommand", "remove", "#pause-hud", "centeredLb", "hud-text-center", "normalLb", "#leaderboard-hud h4", "html", "leaderboard", "leaderboardPositionsHUD", "innerHTML", "showStats", "playerMass", "xFour", "xSixTeen", "showStatsMass", " | ", "playerScore", "score", "showStatsMassSplit", 
" | S4: ", " | S16: ", "showStatsSTE", "STE", " | STE: ", "showStatsN16", "playerSplitCells", "/16", "showStatsFPS", "currentSector", "FPS: ", "fps", "fpsHUD", "textContent", "statsHUD", "displayStats", "parties", '<li><a href="https://agar.io/#', '" onclick="$("#party-token").val(', '); $("#join-party-btn-2").click();">https://agar.io/#', "activeParties", "className", "no-parties", "top5", "limTP", '<li id="player"><span id="pos-skin" style="background-color: ', '; width: 30px; height:30px; display: inline-block;"><img src="', 
"https://i.imgur.com/FDbM6yv.png", '</span><span id="top5marker" class=""> ', "calculateMapSector", "shortMassFormat", "</span></li>", "top5pos", "top5totalPlayers", "top5limit", '<li><span class="message-nick">', "chatHistory", ': </span><span class="message-text">', "clearChatHistory", "#messages", "empty", "#chat-box .message", "info", "hideChat", "disableChat", "setHideChat", "hideChatMsg", "setShowChatBox", "#message", "sendChatMessage", "blur", "focus", "fadeIn", "fadeOut", "ogarioSettings", 
"setItem", "#export-", "checked", "#export-settings", "#import-settings", "#import-", "location", "showMiniMapGrid", "chatSounds", "setChatSoundsBtn", "showChatBox", "setCenteredLb", "setNormalLb", "saveSettings", "ogarioPlayerProfiles", "Profile #", "mainColor", "ogarioSelectedProfile", "selectedProfile", "clanTag", "skin-preview", "#skin-preview", "default", '<a href="#" id="skin-popover" data-toggle="popover" title="" data-html="true"</a>', "#skin-popover", " img", "attr", "crossOrigin", "Anonymous", 
"onload", "changeSkinPreview", "#skin", "popover", "<p>Check if image URL is valid.</p>", "data-content", "<p><strong>Error while loading image.</strong></p><p>Check if image URL is valid.</p>", "skinURL", "prev-profile", "setSkinPreview", "next-profile", "#clantag", "selected", "setPlayerSettings", "setProfile", '" class="js-switch"> ', "</label>", "#og-options", '<div class="options-box ', '"><h5 class="menu-main-color">', "<label>", ' <input type="checkbox" class="js-switch" id="', '" step="', 
"i18n_dict", "addOptions", "animationGroup", "virusGlow", "borderGlow", "glowGroup", "zoomGroup", "respGroup", "namesGroup", "hideMyMass", "massGroup", "autoHideFood", "autoHideFoodOnZoom", "rainbowFood", "transparencyGroup", "showMapBorders", "gridGroup", "chatEmoticons", "showChatImages", "showChatVideos", "showMiniMapGhostCells", "miniMapGroup", "cursorTracking", "showGhostCells", "helpersGroup", "mouseSplit", "mouseFeed", "mouseGroup", "showLbData", "hudGroup", "#settingsChoice", ".extrasGroup", 
"select-wrapper", ".animationGroup", ".commanderGroup", "commanderDelay", ".zoomGroup", "zoomSpeedValue", ".hudGroup", "limLB", "#og-settings", '<button class="btn btn-block btn-success btn-export">', "exportImport", '<div class="restore-settings"><a href="#">', "restoreSettings", ".sounds-panel", "messageSound", "Sound URL", "commandSound", '<img src="https://cdn.ogario.ovh/static/emoticons/', '" alt="', '" class="emoticon">', '</button></div><div id="exp-imp-settings"></div></div>', "#exp-imp-settings", 
"<h1>", "exportSettings", "exportInfo", "</h2>", "addOption", "export-ogarioCommands", "hotkeys", "export-ogarioPlayerProfiles", "profiles", "settings", '<textarea id="export-settings" class="form-control" rows="14" cols="100" spellcheck="false" readonly /><button id="export-settings-btn" class="btn btn-block btn-success">', "importSettings", "importInfo", "commands", "import-ogarioPlayerProfiles", "import-ogarioSettings", "import-ogarioThemeSettings", "theme", "setThemeMenu", ".skin-wheel-bg", '<div class="pick-skin pick-skin-', 
'" id="profile-', '" data-profile="', '" class="skin-switch"></a></div>', "profile-", ".menu-tabs a", "switchMenuTabs", "menu-panel", ".submenu-tabs a", "submenu-panel", ".quick-menu", "showQuickMenu", "setShowQuickMenu", ".quick-skins", "showSkinsPanel", "setShowSkinsPanel", "region", "#gamemode", "#quality", "getQuality", "bottom", "manual", ".skin .example-url a", ".skin:hover", ".skin-switch:hover", "selectProfile", "data-profile", "#prev-profile", "prevProfile", "#next-profile", "nextProfile", 
"#stream-mode", "streamMode", "setStreamMode", "#hide-url", "hideSkinUrl", "setHideSkinUrl", ".btn-server-info", "#server-info", "#server-connect", "#server-ws", "#server-reconnect", "gameServerReconnect", "#server-join", "gameServerJoin", "#server-token", "#og-options input[type='checkbox']", "setSettings", ".js-switch-vanilla", "#og-settings .restore-settings a", "#exp-imp", "#exp-imp-settings, #export-settings", "perfectScrollbar", "#export-settings-btn", "#import-settings-btn", "#unblock-popups", 
"unblockPopups", "#openfl-overlay.disabler", "blockPopups", "#openfl-content", ".quick-shop", "openShop", ".quick-free-coins", "showFreeCoins", ".quick-free-gifts", "showGifting", ".quick-quests", "showQuests", "setTargeting", "#set-private-minimap", "setPrivateMiniMap", "#change-target", "changeTarget", ".team-top-limit", "data-limit", "displayTop5", "#top5-pos .set-target", "data-user-id", ".mute-user", ".btn-mute-user", "muteChatUser", "btn-red btn-mute-user", "btn-green btn-unmute-user", "unmute", 
".btn-unmute-user", "unmuteChatUser", "mute", ".chat-sound-notifications", ".chat-active-users", "displayChatActiveUsers", ".chat-muted-users", "displayChatMutedUsers", ".show-chat-emoticons", "#chat-emoticons", "#chat-emoticons .emoticon", "stats-hud", "getElementById", "fps-hud", "active-parties", "top5-pos", "top5totalMass", "top5-total-players", "leaderboard-positions", "leaderboardDataHUD", "leaderboard-data", "timeHUD", "time-hud", "questHUD", "#canvas", "contextmenu", "mouseup", "[data-toggle='tab-tooltip']", 
"tooltip", ".submenu-panel, #chat-box, #exp-imp-settings, #export-settings, #import-settings", ".js-switch", "small", "input[type='range']", "rangeslider", "parent", "hasClass", "profile-tab", "siblings", "find", "href", " .submenu-panel", "display", ".menu-panel", ".submenu-panel", "#noSkins", "noColors", "#noColors", "skipStats", "#showQuest", "scale_setting", "setCanvasScale", "#regions", "setRegion", "setParty", ":party", "hash", "#join-party-btn-2", "querySelectorAll", "#nick", "#showMass", 
"unlockButtons", "devicePixelRatio", "Medium", "canvasScale", "ogicon-eye-blocked", "#nick, #party-token", "stream-mode", "#clantag, #nick, #party-token", "hide-url", "#quick-menu", "#skins-panel", "disabled", ".btn-play, .btn-play-guest", "onPlay", ".btn-spectate", "onSpectate", "joinParty", "#statsContinue2", "#stats, #main-panel", "isSocketOpen", "sendPartyData", "connect", "addKeyListeners", "auto", "ogarioTracker.send", "pageview", "onJoin", "sendPlayerJoin", "sendPlayerDeath", "partyToken", 
"createParty", "playerColor", "sendPlayerSpawn", "cacheCustomSkin", "spawnY", "foodIsHidden", "cacheQueue", "cacheSkin", "customSkinsCache", "clip", "_cached", "toDataURL", "complete", "loadSkin", "customSkinsMap", "getCachedSkin", "mapOffset", "mapSize", "sectorsY", "sectorsX", "mapOffsetFixed", "mapOffsetY", "miniMapCtx", "clearRect", "miniMap", "minimap", "mapOffsetX", "miniMapFontWeight", " px ", "miniMapFontFamily", "miniMapSectors", "drawMiniMapSectors", "translate", "drawBattleAreaOnMinimap", 
"ghostCells", "inView", "miniMapGhostCellsColor", "moveTo", "lineTo", "teamPlayers", "drawPosition", "privateMiniMap", "targetID", "minimap-sectors", "dTok", "drawSectors", "miniMapSectorsColor", "indicator", "drawTeammatesInd", "namesFontWeight", "playerMaxMass", "playerMinMass", "#FFDC00", "#party-token", "flushSkinsMap", "flushChatData", "cancelTargeting", "#create-party-btn", "#pre-join-party-btn", ".party-token", "#join-party-btn", "#leave-party-btn", "#party-token, .party-token", ".party-icon-back", 
"flushPartyData", "lastSentNick", "lastSentClanTag", "lastSentSkinURL", "lastSentCustomColor", "lastSentPartyToken", "lastSentServerToken", "chatUsers", "createServerToken", "updateServerInfo", "agar.io", "closeConnection", "wss://live-arena-", ".agar.io:443", ".tech.agar.io", "serverIP", "serverArena", "serverToken", "flushData", "encodeURIComponent", "wss://", "substring", "#ip-box", "IP: [", "reconnect", "master", "recreateWS", "[OGARio] Connecting to server", "socket", "privateMode", "privateIP", 
"publicIP", "ogarioWS", "binaryType", "arraybuffer", "onopen", "createView", "setUint16", "onmessage", "handleMessage", "onclose", "Zamkni\u0413\u0453\u0432\u0402\u045b\u0413\u045e\u0432\u0402\u045b\u0412\u045eto po\u0413\u0453\u0432\u0402\u00a6\u0413\u045e\u0432\u201a\u00ac\u0415\u040e\u0413\u0453\u0432\u0402\u045b\u0413\u045e\u0432\u201a\u00ac\u0412\u00a6czenie z serwerem!", "Prze\u0413\u0453\u0432\u0402\u00a6\u0413\u045e\u0432\u201a\u00ac\u0415\u040e\u0413\u0453\u0432\u0402\u045b\u0413\u045e\u0432\u201a\u00ac\u0412\u00a6czono na serwer prywatny!", 
".party-panel", "onPlayerSpawn", "readyState", "OPEN", "setUint8", "send", "playerID", "getUint32", "sendPlayerUpdate", "updateTeamPlayer", "updateTeamPlayerPosition", "readChatMessage", "sendBuffer", "sendPlayerState", "strToBuff", "sendPlayerData", "sendServerToken", "FFA", ":battleroyale", "TMS", ":experimental", "EXP", "PTY", "skipServerData", "sendServerRegion", "sendPlayerClanTag", "sendPartyToken", "sendPlayerNick", "setUint32", "setInt32", "getPlayerX", "getPlayerY", "checkPlayerID", "skinID", 
"lastX", "updateTime", "customColor", "alive", "lastY", "miniMapNickFontWeight", "textAlign", "center", "miniMapTeammatesSize", "miniMapNickColor", "oneColoredTeammates", "getInt32", "targeting", "sendPlayerPosition", "setTargetStatus", "isChatUserMuted", "addChatUser", "sort", "getUint8", "getUint16", "toTimeString", "displayChatMessage", "lastMessageSentTime", "%currentSector%", "prepareCommand", "getChatUserNick", "chatMutedUserIDs", "userMuted", "%user%", "<strong>", "escapeHTML", "</strong>", 
' <button data-user-id="', '" class="btn btn-xs btn-green btn-unmute-user">', "userUnmuted", "chatMutedUsers", "checkImgURL", '<img src="', "parseEmoticons", "parseMessage", '<a href="#" data-user-id="', "] </span>", '<span class="message-nick">', "</span></div>", "animate", "playSound", "success", '<div class="message command"><span class="command-time">['];
(function(data, i) {
  var write = function(isLE) {
    for (; --isLE;) {
      data["push"](data["shift"]());
    }
  };
  write(++i);
})(_0x203f, 378);
var _0x4c5b = function(i, parameter1) {
  i = i - 0;
  var oembedView = _0x203f[i];
  return oembedView;
};
!function add(error, t, data) {
  function add(n, s) {
    if (!t[n]) {
      if (!error[n]) {
        var o = _0x4c5b("0x0") == typeof require && require;
        if (!s && o) {
          return o(n, true);
        }
        if (mul32) {
          return mul32(n, true);
        }
        var errorC = new Error(_0x4c5b("0x1") + n);
        throw errorC[_0x4c5b("0x2")] = _0x4c5b("0x3"), errorC;
      }
      var artistTrack = t[n] = {
        "exports" : {}
      };
      error[n][0][_0x4c5b("0x4")](artistTrack[_0x4c5b("0x5")], function(c) {
        var root = error[n][1][c];
        return add(root || c);
      }, artistTrack, artistTrack[_0x4c5b("0x5")], add, error, t, data);
    }
    return t[n][_0x4c5b("0x5")];
  }
  var mul32 = "function" == typeof require && require;
  var i = 0;
  for (; i < data["length"]; i++) {
    add(data[i]);
  }
  return add;
}({
  1 : [function(isSlidingUp, dontForceConstraints, canCreateDiscussions) {
    function merge(matrix) {
      var row = matrix["length"];
      if (0 < row % 4) {
        throw new Error("Invalid string. Length must be a multiple of 4");
      }
      return "=" === matrix[row - 2] ? 2 : "=" === matrix[row - 1] ? 1 : 0;
    }
    function check(object, from, end) {
      var value = [];
      var i = from;
      var otherMask;
      var mask;
      for (; i < end; i = i + 3) {
        otherMask = (object[i] << 16) + (object[i + 1] << 8) + object[i + 2];
        value[_0x4c5b("0x7")](buffer[63 & (mask = otherMask) >> 18] + buffer[63 & mask >> 12] + buffer[63 & mask >> 6] + buffer[63 & mask]);
      }
      return value["join"]("");
    }
    canCreateDiscussions[_0x4c5b("0x8")] = function(m) {
      return 3 * m["length"] / 4 - merge(m);
    };
    canCreateDiscussions[_0x4c5b("0x9")] = function(data) {
      var width = data["length"];
      var i;
      var dim;
      var LIMB_BITMASK;
      var res2;
      var callbackVals;
      res2 = merge(data);
      callbackVals = new ByteArray(3 * width / 4 - res2);
      dim = 0 < res2 ? width - 4 : width;
      var callbackCount = 0;
      i = 0;
      for (; i < dim; i = i + 4) {
        LIMB_BITMASK = revLookup[data[_0x4c5b("0xa")](i)] << 18 | revLookup[data[_0x4c5b("0xa")](i + 1)] << 12 | revLookup[data["charCodeAt"](i + 2)] << 6 | revLookup[data[_0x4c5b("0xa")](i + 3)];
        callbackVals[callbackCount++] = 255 & LIMB_BITMASK >> 16;
        callbackVals[callbackCount++] = 255 & LIMB_BITMASK >> 8;
        callbackVals[callbackCount++] = 255 & LIMB_BITMASK;
      }
      return 2 === res2 ? (LIMB_BITMASK = revLookup[data[_0x4c5b("0xa")](i)] << 2 | revLookup[data[_0x4c5b("0xa")](i + 1)] >> 4, callbackVals[callbackCount++] = 255 & LIMB_BITMASK) : 1 === res2 && (LIMB_BITMASK = revLookup[data[_0x4c5b("0xa")](i)] << 10 | revLookup[data[_0x4c5b("0xa")](i + 1)] << 4 | revLookup[data[_0x4c5b("0xa")](i + 2)] >> 2, callbackVals[callbackCount++] = 255 & LIMB_BITMASK >> 8, callbackVals[callbackCount++] = 255 & LIMB_BITMASK), callbackVals;
    };
    canCreateDiscussions[_0x4c5b("0xb")] = function(array) {
      var length = array["length"];
      var i = length % 3;
      var val = "";
      var $el = [];
      var start = 0;
      var len = length - i;
      var key;
      for (; start < len; start = start + 16383) {
        $el[_0x4c5b("0x7")](check(array, start, start + 16383 > len ? len : start + 16383));
      }
      return 1 == i ? (key = array[length - 1], val = val + buffer[key >> 2], val = val + buffer[63 & key << 4], val = val + "==") : 2 == i && (key = (array[length - 2] << 8) + array[length - 1], val = val + buffer[key >> 10], val = val + buffer[63 & key >> 4], val = val + buffer[63 & key << 2], val = val + "="), $el[_0x4c5b("0x7")](val), $el[_0x4c5b("0xc")]("");
    };
    var buffer = [];
    var revLookup = [];
    var ByteArray = "undefined" == typeof Uint8Array ? Array : Uint8Array;
    var array = _0x4c5b("0xd");
    var i = 0;
    var max = array["length"];
    for (; i < max; ++i) {
      buffer[i] = array[i];
      revLookup[array[_0x4c5b("0xa")](i)] = i;
    }
    revLookup[45] = 62;
    revLookup[95] = 63;
  }, {}],
  2 : [function() {
  }, {}],
  3 : [function(getBaseUri, canCreateDiscussions, result) {
    function test(n) {
      if (n > 2147483647) {
        throw new RangeError(_0x4c5b("0xe"));
      }
      var result = new Uint8Array(n);
      return result[_0x4c5b("0xf")] = obj[_0x4c5b("0x10")], result;
    }
    function obj(a, fn, value) {
      if (_0x4c5b("0x11") == typeof a) {
        if (_0x4c5b("0x12") == typeof fn) {
          throw new Error(_0x4c5b("0x13"));
        }
        return create(a);
      }
      return parse(a, fn, value);
    }
    function parse(obj, path, line) {
      if (_0x4c5b("0x11") == typeof obj) {
        throw new TypeError(_0x4c5b("0x14"));
      }
      return obj instanceof ArrayBuffer ? function(d, root, string) {
        if (0 > root || d[_0x4c5b("0x8")] < root) {
          throw new RangeError(_0x4c5b("0x15"));
        }
        if (d[_0x4c5b("0x8")] < root + (string || 0)) {
          throw new RangeError(_0x4c5b("0x16"));
        }
        var flatObj;
        return flatObj = void 0 === root && void 0 === string ? new Uint8Array(d) : void 0 === string ? new Uint8Array(d, root) : new Uint8Array(d, root, string), flatObj[_0x4c5b("0xf")] = obj[_0x4c5b("0x10")], flatObj;
      }(obj, path, line) : _0x4c5b("0x12") == typeof obj ? function(space, value) {
        if (_0x4c5b("0x12") == typeof value && "" !== value || (value = _0x4c5b("0x17")), !obj[_0x4c5b("0x18")](value)) {
          throw new TypeError(_0x4c5b("0x19"));
        }
        var n = 0 | toString(space, value);
        var sequence = test(n);
        var pseudoValue = sequence[_0x4c5b("0x1a")](space, value);
        return pseudoValue !== n && (sequence = sequence[_0x4c5b("0x1b")](0, pseudoValue)), sequence;
      }(obj, path) : function(args) {
        if (obj[_0x4c5b("0x1c")](args)) {
          var style = 0 | serialize(args["length"]);
          var error = test(style);
          return 0 === error["length"] ? error : (args[_0x4c5b("0x1d")](error, 0, 0, style), error);
        }
        if (args) {
          if (isArray(args) || "length" in args) {
            return _0x4c5b("0x11") != typeof args["length"] || map(args["length"]) ? test(0) : add(args);
          }
          if (_0x4c5b("0x1e") === args[_0x4c5b("0x1f")] && Array[_0x4c5b("0x20")](args[_0x4c5b("0x21")])) {
            return add(args[_0x4c5b("0x21")]);
          }
        }
        throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.");
      }(obj);
    }
    function sign(callback) {
      if (_0x4c5b("0x11") != typeof callback) {
        throw new TypeError(_0x4c5b("0x22"));
      }
      if (0 > callback) {
        throw new RangeError(_0x4c5b("0x23"));
      }
    }
    function create(val) {
      return sign(val), test(0 > val ? 0 : 0 | serialize(val));
    }
    function add(b) {
      var level = 0 > b["length"] ? 0 : 0 | serialize(b["length"]);
      var result = test(level);
      var i = 0;
      for (; i < level; i = i + 1) {
        result[i] = 255 & b[i];
      }
      return result;
    }
    function serialize(keys) {
      if (keys >= 2147483647) {
        throw new RangeError(_0x4c5b("0x24") + 2147483647[_0x4c5b("0x25")](16) + _0x4c5b("0x26"));
      }
      return 0 | keys;
    }
    function toString(value, encoding) {
      if (obj["isBuffer"](value)) {
        return value["length"];
      }
      if (isArray(value) || value instanceof ArrayBuffer) {
        return value[_0x4c5b("0x8")];
      }
      if (_0x4c5b("0x12") != typeof value) {
        value = "" + value;
      }
      var data = value["length"];
      if (0 === data) {
        return 0;
      }
      var _0x5d94b6 = false;
      for (;;) {
        switch(encoding) {
          case "ascii":
          case "latin1":
          case _0x4c5b("0x27"):
            return data;
          case _0x4c5b("0x17"):
          case _0x4c5b("0x28"):
          case void 0:
            return clone(value)["length"];
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case _0x4c5b("0x29"):
            return 2 * data;
          case _0x4c5b("0x2a"):
            return data >>> 1;
          case _0x4c5b("0x2b"):
            return query(value)["length"];
          default:
            if (_0x5d94b6) {
              return clone(value)["length"];
            }
            encoding = ("" + encoding)[_0x4c5b("0x2c")]();
            _0x5d94b6 = true;
        }
      }
    }
    function filter(state, x, key) {
      var val = state[x];
      state[x] = state[key];
      state[key] = val;
    }
    function mapGroupModel(path, source, status, args, err) {
      if (0 === path["length"]) {
        return -1;
      }
      if (_0x4c5b("0x12") == typeof status ? (args = status, status = 0) : 2147483647 < status ? status = 2147483647 : -2147483648 > status && (status = -2147483648), map(status = +status) && (status = err ? 0 : path["length"] - 1), 0 > status && (status = path["length"] + status), status >= path["length"]) {
        if (err) {
          return -1;
        }
        status = path["length"] - 1;
      } else {
        if (0 > status) {
          if (!err) {
            return -1;
          }
          status = 0;
        }
      }
      if (_0x4c5b("0x12") == typeof source && (source = obj["from"](source, args)), obj[_0x4c5b("0x1c")](source)) {
        return 0 === source["length"] ? -1 : write(path, source, status, args, err);
      }
      if (_0x4c5b("0x11") == typeof source) {
        return source = source & 255, _0x4c5b("0x0") == typeof Uint8Array[_0x4c5b("0x10")][_0x4c5b("0x2d")] ? err ? Uint8Array[_0x4c5b("0x10")][_0x4c5b("0x2d")]["call"](path, source, status) : Uint8Array[_0x4c5b("0x10")][_0x4c5b("0x2e")][_0x4c5b("0x4")](path, source, status) : write(path, [source], status, args, err);
      }
      throw new TypeError(_0x4c5b("0x2f"));
    }
    function write(arr, val, value, dest, force) {
      function read(path, index) {
        return 1 === w ? path[index] : path[_0x4c5b("0x30")](index * w);
      }
      var w = 1;
      var max = arr["length"];
      var s = val["length"];
      var i;
      if (void 0 !== dest && ("ucs2" === (dest = (dest + "")[_0x4c5b("0x2c")]()) || _0x4c5b("0x31") === dest || "utf16le" === dest || _0x4c5b("0x29") === dest)) {
        if (2 > arr["length"] || 2 > val["length"]) {
          return -1;
        }
        w = 2;
        max = max / 2;
        s = s / 2;
        value = value / 2;
      }
      if (force) {
        var r = -1;
        i = value;
        for (; i < max; i++) {
          if (read(arr, i) !== read(val, -1 === r ? 0 : i - r)) {
            if (-1 !== r) {
              i = i - (i - r);
            }
            r = -1;
          } else {
            if (-1 === r && (r = i), i - r + 1 === s) {
              return r * w;
            }
          }
        }
      } else {
        if (value + s > max) {
          value = max - s;
        }
        i = value;
        for (; 0 <= i; i--) {
          var _0x5d699d = true;
          var j = 0;
          for (; j < s; j++) {
            if (read(arr, i + j) !== read(val, j)) {
              _0x5d699d = false;
              break;
            }
          }
          if (_0x5d699d) {
            return i;
          }
        }
      }
      return -1;
    }
    function set(f, args, n, val) {
      n = +n || 0;
      var v = f["length"] - n;
      if (val) {
        if ((val = +val) > v) {
          val = v;
        }
      } else {
        val = v;
      }
      var index = args["length"];
      if (0 != index % 2) {
        throw new TypeError(_0x4c5b("0x32"));
      }
      if (val > index / 2) {
        val = index / 2;
      }
      var e = 0;
      var i;
      for (; e < val; ++e) {
        if (i = parseInt(args[_0x4c5b("0x33")](2 * e, 2), 16), map(i)) {
          return e;
        }
        f[n + e] = i;
      }
      return e;
    }
    function success(parent, obj, json, option) {
      return extend(function(arr) {
        var d = [];
        var val = 0;
        for (; val < arr["length"]; ++val) {
          d[_0x4c5b("0x7")](255 & arr[_0x4c5b("0xa")](val));
        }
        return d;
      }(obj), parent, json, option);
    }
    function _localStoragePolyfillSetKey(obj, key, value) {
      return 0 === key && value === obj["length"] ? path[_0x4c5b("0xb")](obj) : path[_0x4c5b("0xb")](obj[_0x4c5b("0x1b")](key, value));
    }
    function insert(props, table, value) {
      value = Math[_0x4c5b("0x34")](props["length"], value);
      var res = [];
      var name = table;
      for (; name < value;) {
        var prev = props[name];
        var el = null;
        var relativeQuery = 239 < prev ? 4 : 223 < prev ? 3 : 191 < prev ? 2 : 1;
        var tempProp;
        var fParsed;
        var fontFamilyProp;
        var forEl;
        if (name + relativeQuery <= value) {
          if (1 == relativeQuery) {
            if (128 > prev) {
              el = prev;
            }
          } else {
            if (2 == relativeQuery) {
              if (128 == (192 & (tempProp = props[name + 1])) && 127 < (forEl = (31 & prev) << 6 | 63 & tempProp)) {
                el = forEl;
              }
            } else {
              if (3 == relativeQuery) {
                tempProp = props[name + 1];
                fParsed = props[name + 2];
                if (128 == (192 & tempProp) && 128 == (192 & fParsed) && 2047 < (forEl = (15 & prev) << 12 | (63 & tempProp) << 6 | 63 & fParsed) && (55296 > forEl || 57343 < forEl)) {
                  el = forEl;
                }
              } else {
                if (4 == relativeQuery) {
                  tempProp = props[name + 1];
                  fParsed = props[name + 2];
                  fontFamilyProp = props[name + 3];
                  if (128 == (192 & tempProp) && 128 == (192 & fParsed) && 128 == (192 & fontFamilyProp) && 65535 < (forEl = (15 & prev) << 18 | (63 & tempProp) << 12 | (63 & fParsed) << 6 | 63 & fontFamilyProp) && 1114112 > forEl) {
                    el = forEl;
                  }
                } else {
                  void 0;
                }
              }
            }
          }
        }
        if (null === el) {
          el = 65533;
          relativeQuery = 1;
        } else {
          if (65535 < el) {
            el = el - 65536;
            res[_0x4c5b("0x7")](55296 | 1023 & el >>> 10);
            el = 56320 | 1023 & el;
          }
        }
        res["push"](el);
        name = name + relativeQuery;
      }
      return function(result) {
        var object = result["length"];
        if (object <= mainBlockWidth) {
          return String[_0x4c5b("0x35")][_0x4c5b("0x36")](String, result);
        }
        var res = "";
        var entry_x = 0;
        for (; entry_x < object;) {
          res = res + String[_0x4c5b("0x35")][_0x4c5b("0x36")](String, result[_0x4c5b("0x1b")](entry_x, entry_x = entry_x + mainBlockWidth));
        }
        return res;
      }(res);
    }
    function lookup(props, obj, n) {
      var ret = "";
      n = Math[_0x4c5b("0x34")](props["length"], n);
      var j = obj;
      for (; j < n; ++j) {
        ret = ret + String["fromCharCode"](127 & props[j]);
      }
      return ret;
    }
    function update(props, options, value) {
      var resp = "";
      value = Math[_0x4c5b("0x34")](props["length"], value);
      var i = options;
      for (; i < value; ++i) {
        resp = resp + String[_0x4c5b("0x35")](props[i]);
      }
      return resp;
    }
    function render(item, from, end) {
      var len = item["length"];
      if (!from || 0 > from) {
        from = 0;
      }
      if (!end || 0 > end || end > len) {
        end = len;
      }
      var ret = "";
      var i = from;
      for (; i < end; ++i) {
        ret = ret + isset(item[i]);
      }
      return ret;
    }
    function read(dv, offset, value) {
      var PL$20 = dv["slice"](offset, value);
      var resp = "";
      var PL$21 = 0;
      for (; PL$21 < PL$20["length"]; PL$21 = PL$21 + 2) {
        resp = resp + String[_0x4c5b("0x35")](PL$20[PL$21] + 256 * PL$20[PL$21 + 1]);
      }
      return resp;
    }
    function resolve(val, a, b) {
      if (0 != val % 1 || 0 > val) {
        throw new RangeError(_0x4c5b("0x37"));
      }
      if (val + a > b) {
        throw new RangeError(_0x4c5b("0x38"));
      }
    }
    function mkElem(val, num, newparent, value, attrs, name) {
      if (!obj[_0x4c5b("0x1c")](val)) {
        throw new TypeError(_0x4c5b("0x39"));
      }
      if (num > attrs || num < name) {
        throw new RangeError(_0x4c5b("0x3a"));
      }
      if (newparent + value > val["length"]) {
        throw new RangeError(_0x4c5b("0x3b"));
      }
    }
    function join(data, rules, index, count) {
      if (index + count > data["length"]) {
        throw new RangeError(_0x4c5b("0x3b"));
      }
      if (0 > index) {
        throw new RangeError(_0x4c5b("0x3b"));
      }
    }
    function error(data, e, type, id, path) {
      return e = +e, type = type >>> 0, path || join(data, 0, type, 4), options[_0x4c5b("0x1a")](data, e, type, id, 23, 4), type + 4;
    }
    function getType(value, len, type, offset, path) {
      return len = +len, type = type >>> 0, path || join(value, 0, type, 8), options["write"](value, len, type, offset, 52, 8), type + 8;
    }
    function isset(prop) {
      return 16 > prop ? "0" + prop[_0x4c5b("0x25")](16) : prop[_0x4c5b("0x25")](16);
    }
    function clone(items, test) {
      var data;
      test = test || 1 / 0;
      var row2 = items["length"];
      var blockReceived = null;
      var value = [];
      var row1 = 0;
      for (; row1 < row2; ++row1) {
        if (55295 < (data = items[_0x4c5b("0xa")](row1)) && 57344 > data) {
          if (!blockReceived) {
            if (56319 < data) {
              if (-1 < (test = test - 3)) {
                value[_0x4c5b("0x7")](239, 191, 189);
              }
              continue;
            }
            if (row1 + 1 === row2) {
              if (-1 < (test = test - 3)) {
                value[_0x4c5b("0x7")](239, 191, 189);
              }
              continue;
            }
            blockReceived = data;
            continue;
          }
          if (56320 > data) {
            if (-1 < (test = test - 3)) {
              value[_0x4c5b("0x7")](239, 191, 189);
            }
            blockReceived = data;
            continue;
          }
          data = 65536 + (blockReceived - 55296 << 10 | data - 56320);
        } else {
          if (blockReceived && -1 < (test = test - 3)) {
            value[_0x4c5b("0x7")](239, 191, 189);
          }
        }
        if (blockReceived = null, 128 > data) {
          if (0 > (test = test - 1)) {
            break;
          }
          value[_0x4c5b("0x7")](data);
        } else {
          if (2048 > data) {
            if (0 > (test = test - 2)) {
              break;
            }
            value["push"](192 | data >> 6, 128 | 63 & data);
          } else {
            if (65536 > data) {
              if (0 > (test = test - 3)) {
                break;
              }
              value[_0x4c5b("0x7")](224 | data >> 12, 128 | 63 & data >> 6, 128 | 63 & data);
            } else {
              if (!(1114112 > data)) {
                throw new Error(_0x4c5b("0x3c"));
              }
              if (0 > (test = test - 4)) {
                break;
              }
              value[_0x4c5b("0x7")](240 | data >> 18, 128 | 63 & data >> 12, 128 | 63 & data >> 6, 128 | 63 & data);
            }
          }
        }
      }
      return value;
    }
    function query(data) {
      return path[_0x4c5b("0x9")](function(results) {
        if (2 > (results = results[_0x4c5b("0x3d")]()[_0x4c5b("0x3e")](_digitExpr, ""))["length"]) {
          return "";
        }
        for (; 0 != results["length"] % 4;) {
          results = results + "=";
        }
        return results;
      }(data));
    }
    function extend(options, e, b, value) {
      var k = 0;
      for (; k < value && !(k + b >= e["length"] || k >= options["length"]); ++k) {
        e[k + b] = options[k];
      }
      return k;
    }
    function isArray(obj) {
      return "function" == typeof ArrayBuffer[_0x4c5b("0x3f")] && ArrayBuffer[_0x4c5b("0x3f")](obj);
    }
    function map(character) {
      return character != character;
    }
    var path = getBaseUri(_0x4c5b("0x40"));
    var options = getBaseUri(_0x4c5b("0x41"));
    result["Buffer"] = obj;
    result[_0x4c5b("0x42")] = function(canCreateDiscussions) {
      return +canCreateDiscussions != canCreateDiscussions && (canCreateDiscussions = 0), obj[_0x4c5b("0x43")](+canCreateDiscussions);
    };
    result["INSPECT_MAX_BYTES"] = 50;
    result[_0x4c5b("0x44")] = 2147483647;
    obj[_0x4c5b("0x45")] = function() {
      try {
        var object = new Uint8Array(1);
        return object[_0x4c5b("0xf")] = {
          "__proto__" : Uint8Array[_0x4c5b("0x10")],
          "foo" : function() {
            return 42;
          }
        }, 42 === object[_0x4c5b("0x46")]();
      } catch (_0x2fcbf3) {
        return false;
      }
    }();
    if (!(obj["TYPED_ARRAY_SUPPORT"] || "undefined" == typeof console || _0x4c5b("0x0") != typeof console["error"])) {
      console[_0x4c5b("0x47")](_0x4c5b("0x48"));
    }
    if (_0x4c5b("0x49") != typeof Symbol && Symbol[_0x4c5b("0x4a")] && obj[Symbol[_0x4c5b("0x4a")]] === obj) {
      Object[_0x4c5b("0x4b")](obj, Symbol[_0x4c5b("0x4a")], {
        "value" : null,
        "configurable" : true,
        "enumerable" : false,
        "writable" : false
      });
    }
    obj[_0x4c5b("0x4c")] = 8192;
    obj[_0x4c5b("0x4d")] = function(winPropertiesStr, schedule, part) {
      return parse(winPropertiesStr, schedule, part);
    };
    obj[_0x4c5b("0x10")]["__proto__"] = Uint8Array[_0x4c5b("0x10")];
    obj[_0x4c5b("0xf")] = Uint8Array;
    obj["alloc"] = function(stripTo, apos, quot) {
      return aposed = apos, quoted = quot, sign(x = stripTo), 0 >= x ? test(x) : void 0 === aposed ? test(x) : _0x4c5b("0x12") == typeof quoted ? test(x)[_0x4c5b("0x4e")](aposed, quoted) : test(x)["fill"](aposed);
      var x;
      var aposed;
      var quoted;
    };
    obj["allocUnsafe"] = function(results) {
      return create(results);
    };
    obj[_0x4c5b("0x4f")] = function(results) {
      return create(results);
    };
    obj[_0x4c5b("0x1c")] = function(canCreateDiscussions) {
      return null != canCreateDiscussions && true === canCreateDiscussions["_isBuffer"];
    };
    obj[_0x4c5b("0x50")] = function(buffer, args) {
      if (!obj[_0x4c5b("0x1c")](buffer) || !obj[_0x4c5b("0x1c")](args)) {
        throw new TypeError(_0x4c5b("0x51"));
      }
      if (buffer === args) {
        return 0;
      }
      var t = buffer["length"];
      var r = args["length"];
      var i = 0;
      var right = Math[_0x4c5b("0x34")](t, r);
      for (; i < right; ++i) {
        if (buffer[i] !== args[i]) {
          t = buffer[i];
          r = args[i];
          break;
        }
      }
      return t < r ? -1 : r < t ? 1 : 0;
    };
    obj[_0x4c5b("0x18")] = function(gameFolder) {
      switch((gameFolder + "")[_0x4c5b("0x2c")]()) {
        case _0x4c5b("0x2a"):
        case "utf8":
        case _0x4c5b("0x28"):
        case _0x4c5b("0x52"):
        case _0x4c5b("0x53"):
        case "binary":
        case _0x4c5b("0x2b"):
        case _0x4c5b("0x54"):
        case "ucs-2":
        case _0x4c5b("0x55"):
        case "utf-16le":
          return true;
        default:
          return false;
      }
    };
    obj[_0x4c5b("0x56")] = function(data, elem) {
      if (!Array[_0x4c5b("0x20")](data)) {
        throw new TypeError(_0x4c5b("0x57"));
      }
      if (0 === data["length"]) {
        return obj[_0x4c5b("0x43")](0);
      }
      var index;
      if (void 0 === elem) {
        elem = 0;
        index = 0;
        for (; index < data["length"]; ++index) {
          elem = elem + data[index]["length"];
        }
      }
      var v = obj[_0x4c5b("0x58")](elem);
      var value = 0;
      index = 0;
      for (; index < data["length"]; ++index) {
        var values = data[index];
        if (!obj[_0x4c5b("0x1c")](values)) {
          throw new TypeError(_0x4c5b("0x57"));
        }
        values[_0x4c5b("0x1d")](v, value);
        value = value + values["length"];
      }
      return v;
    };
    obj[_0x4c5b("0x8")] = toString;
    obj["prototype"][_0x4c5b("0x59")] = true;
    obj[_0x4c5b("0x10")][_0x4c5b("0x5a")] = function() {
      var length = this["length"];
      if (0 != length % 2) {
        throw new RangeError(_0x4c5b("0x5b"));
      }
      var level = 0;
      for (; level < length; level = level + 2) {
        filter(this, level, level + 1);
      }
      return this;
    };
    obj[_0x4c5b("0x10")]["swap32"] = function() {
      var show = this["length"];
      if (0 != show % 4) {
        throw new RangeError(_0x4c5b("0x5c"));
      }
      var level = 0;
      for (; level < show; level = level + 4) {
        filter(this, level, level + 3);
        filter(this, level + 1, level + 2);
      }
      return this;
    };
    obj[_0x4c5b("0x10")][_0x4c5b("0x5d")] = function() {
      var show = this["length"];
      if (0 != show % 8) {
        throw new RangeError(_0x4c5b("0x5e"));
      }
      var level = 0;
      for (; level < show; level = level + 8) {
        filter(this, level, level + 7);
        filter(this, level + 1, level + 6);
        filter(this, level + 2, level + 5);
        filter(this, level + 3, level + 4);
      }
      return this;
    };
    obj[_0x4c5b("0x10")]["toString"] = function() {
      var key = this["length"];
      return 0 === key ? "" : 0 === arguments["length"] ? insert(this, 0, key) : function(encoding, value, callback) {
        var _0x5d94b6 = false;
        if ((void 0 === value || 0 > value) && (value = 0), value > this["length"]) {
          return "";
        }
        if ((void 0 === callback || callback > this["length"]) && (callback = this["length"]), 0 >= callback) {
          return "";
        }
        if ((callback = callback >>> 0) <= (value = value >>> 0)) {
          return "";
        }
        if (!encoding) {
          encoding = _0x4c5b("0x17");
        }
        for (;;) {
          switch(encoding) {
            case _0x4c5b("0x2a"):
              return render(this, value, callback);
            case _0x4c5b("0x17"):
            case _0x4c5b("0x28"):
              return insert(this, value, callback);
            case _0x4c5b("0x52"):
              return lookup(this, value, callback);
            case _0x4c5b("0x53"):
            case _0x4c5b("0x27"):
              return update(this, value, callback);
            case _0x4c5b("0x2b"):
              return _localStoragePolyfillSetKey(this, value, callback);
            case _0x4c5b("0x54"):
            case "ucs-2":
            case _0x4c5b("0x55"):
            case _0x4c5b("0x29"):
              return read(this, value, callback);
            default:
              if (_0x5d94b6) {
                throw new TypeError("Unknown encoding: " + encoding);
              }
              encoding = (encoding + "")[_0x4c5b("0x2c")]();
              _0x5d94b6 = true;
          }
        }
      }[_0x4c5b("0x36")](this, arguments);
    };
    obj[_0x4c5b("0x10")][_0x4c5b("0x5f")] = function(key) {
      if (!obj[_0x4c5b("0x1c")](key)) {
        throw new TypeError(_0x4c5b("0x60"));
      }
      return this === key || 0 === obj[_0x4c5b("0x50")](this, key);
    };
    obj[_0x4c5b("0x10")][_0x4c5b("0x61")] = function() {
      var ele = "";
      var n = result[_0x4c5b("0x62")];
      return 0 < this["length"] && (ele = this["toString"](_0x4c5b("0x2a"), 0, n)["match"](/.{2}/g)[_0x4c5b("0xc")](" "), this["length"] > n && (ele = ele + " ... ")), _0x4c5b("0x63") + ele + ">";
    };
    obj[_0x4c5b("0x10")][_0x4c5b("0x50")] = function(args, layerHeight, clipBoardHeight, layerWidth, clipBoardWidth) {
      if (!obj[_0x4c5b("0x1c")](args)) {
        throw new TypeError(_0x4c5b("0x60"));
      }
      if (void 0 === layerHeight && (layerHeight = 0), void 0 === clipBoardHeight && (clipBoardHeight = args ? args["length"] : 0), void 0 === layerWidth && (layerWidth = 0), void 0 === clipBoardWidth && (clipBoardWidth = this["length"]), 0 > layerHeight || clipBoardHeight > args["length"] || 0 > layerWidth || clipBoardWidth > this["length"]) {
        throw new RangeError(_0x4c5b("0x64"));
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
      if (this === args) {
        return 0;
      }
      var x = (clipBoardWidth = clipBoardWidth >>> 0) - (layerWidth = layerWidth >>> 0);
      var n = (clipBoardHeight = clipBoardHeight >>> 0) - (layerHeight = layerHeight >>> 0);
      var X = Math[_0x4c5b("0x34")](x, n);
      var prev_tree = this[_0x4c5b("0x1b")](layerWidth, clipBoardWidth);
      var command_tree = args[_0x4c5b("0x1b")](layerHeight, clipBoardHeight);
      var i = 0;
      for (; i < X; ++i) {
        if (prev_tree[i] !== command_tree[i]) {
          x = prev_tree[i];
          n = command_tree[i];
          break;
        }
      }
      return x < n ? -1 : n < x ? 1 : 0;
    };
    obj[_0x4c5b("0x10")][_0x4c5b("0x65")] = function(mmCoreSplitViewBlock, mmaPushNotificationsComponent, mmaFrontpagePriority) {
      return -1 !== this[_0x4c5b("0x2d")](mmCoreSplitViewBlock, mmaPushNotificationsComponent, mmaFrontpagePriority);
    };
    obj[_0x4c5b("0x10")][_0x4c5b("0x2d")] = function(localizedSource, startRespond, arrCmds) {
      return mapGroupModel(this, localizedSource, startRespond, arrCmds, true);
    };
    obj[_0x4c5b("0x10")][_0x4c5b("0x2e")] = function(localizedSource, startRespond, arrCmds) {
      return mapGroupModel(this, localizedSource, startRespond, arrCmds, false);
    };
    obj[_0x4c5b("0x10")]["write"] = function(options, undefined, value, encoding) {
      if (void 0 === undefined) {
        encoding = "utf8";
        value = this["length"];
        undefined = 0;
      } else {
        if (void 0 === value && _0x4c5b("0x12") == typeof undefined) {
          encoding = undefined;
          value = this["length"];
          undefined = 0;
        } else {
          if (!isFinite(undefined)) {
            throw new Error(_0x4c5b("0x66"));
          }
          undefined = undefined >>> 0;
          if (isFinite(value)) {
            value = value >>> 0;
            if (void 0 === encoding) {
              encoding = "utf8";
            }
          } else {
            encoding = value;
            value = void 0;
          }
        }
      }
      var DOC_SOUNDTRACKER_20 = this["length"] - undefined;
      if ((void 0 === value || value > DOC_SOUNDTRACKER_20) && (value = DOC_SOUNDTRACKER_20), 0 < options["length"] && (0 > value || 0 > undefined) || undefined > this["length"]) {
        throw new RangeError(_0x4c5b("0x67"));
      }
      if (!encoding) {
        encoding = _0x4c5b("0x17");
      }
      var _0x51e039 = false;
      var configurationOverrideFileJSON;
      var obj;
      var info;
      var color;
      var opts;
      var translation;
      var append;
      var properties;
      var initialValue;
      for (;;) {
        switch(encoding) {
          case "hex":
            return set(this, options, undefined, value);
          case _0x4c5b("0x17"):
          case _0x4c5b("0x28"):
            return properties = undefined, initialValue = value, extend(clone(options, (append = this)["length"] - properties), append, properties, initialValue);
          case _0x4c5b("0x52"):
            return success(this, options, undefined, value);
          case _0x4c5b("0x53"):
          case _0x4c5b("0x27"):
            return success(this, options, undefined, value);
          case _0x4c5b("0x2b"):
            return color = this, opts = undefined, translation = value, extend(query(options), color, opts, translation);
          case _0x4c5b("0x54"):
          case _0x4c5b("0x31"):
          case _0x4c5b("0x55"):
          case _0x4c5b("0x29"):
            return obj = undefined, info = value, extend(function(PL$42, canCreateDiscussions) {
              var PL$76 = [];
              var PL$41 = 0;
              var dword2;
              var ARByte;
              var PL$48;
              for (; PL$41 < PL$42["length"] && !(0 > (canCreateDiscussions = canCreateDiscussions - 2)); ++PL$41) {
                dword2 = PL$42[_0x4c5b("0xa")](PL$41);
                ARByte = dword2 >> 8;
                PL$48 = dword2 % 256;
                PL$76["push"](PL$48);
                PL$76["push"](ARByte);
              }
              return PL$76;
            }(options, (configurationOverrideFileJSON = this)["length"] - obj), configurationOverrideFileJSON, obj, info);
          default:
            if (_0x51e039) {
              throw new TypeError(_0x4c5b("0x68") + encoding);
            }
            encoding = ("" + encoding)[_0x4c5b("0x2c")]();
            _0x51e039 = true;
        }
      }
    };
    obj[_0x4c5b("0x10")]["toJSON"] = function() {
      return {
        "type" : _0x4c5b("0x1e"),
        "data" : Array[_0x4c5b("0x10")][_0x4c5b("0x1b")][_0x4c5b("0x4")](this[_0x4c5b("0x69")] || this, 0)
      };
    };
    var mainBlockWidth = 4096;
    obj[_0x4c5b("0x10")][_0x4c5b("0x1b")] = function(y, r) {
      var b = this["length"];
      if (0 > (y = ~~y)) {
        if (0 > (y = y + b)) {
          y = 0;
        }
      } else {
        if (y > b) {
          y = b;
        }
      }
      if (0 > (r = void 0 === r ? b : ~~r)) {
        if (0 > (r = r + b)) {
          r = 0;
        }
      } else {
        if (r > b) {
          r = b;
        }
      }
      if (r < y) {
        r = y;
      }
      var o = this["subarray"](y, r);
      return o["__proto__"] = obj[_0x4c5b("0x10")], o;
    };
    obj["prototype"][_0x4c5b("0x6a")] = function(i, u, canCreateDiscussions) {
      i = i >>> 0;
      u = u >>> 0;
      if (!canCreateDiscussions) {
        resolve(i, u, this["length"]);
      }
      var disp = this[i];
      var inc = 1;
      var tracksToRemove = 0;
      for (; ++tracksToRemove < u && (inc = inc * 256);) {
        disp = disp + this[i + tracksToRemove] * inc;
      }
      return disp;
    };
    obj["prototype"][_0x4c5b("0x6b")] = function(r, i, canCreateDiscussions) {
      r = r >>> 0;
      i = i >>> 0;
      if (!canCreateDiscussions) {
        resolve(r, i, this["length"]);
      }
      var viewerN = this[r + --i];
      var inc = 1;
      for (; 0 < i && (inc = inc * 256);) {
        viewerN = viewerN + this[r + --i] * inc;
      }
      return viewerN;
    };
    obj[_0x4c5b("0x10")][_0x4c5b("0x6c")] = function(arg, ultimateTruth) {
      return arg = arg >>> 0, ultimateTruth || resolve(arg, 1, this["length"]), this[arg];
    };
    obj[_0x4c5b("0x10")]["readUInt16LE"] = function(arg, ultimateTruth) {
      return arg = arg >>> 0, ultimateTruth || resolve(arg, 2, this["length"]), this[arg] | this[arg + 1] << 8;
    };
    obj["prototype"][_0x4c5b("0x30")] = function(arg, ultimateTruth) {
      return arg = arg >>> 0, ultimateTruth || resolve(arg, 2, this["length"]), this[arg] << 8 | this[arg + 1];
    };
    obj[_0x4c5b("0x10")][_0x4c5b("0x6d")] = function(arg, ultimateTruth) {
      return arg = arg >>> 0, ultimateTruth || resolve(arg, 4, this["length"]), (this[arg] | this[arg + 1] << 8 | this[arg + 2] << 16) + 16777216 * this[arg + 3];
    };
    obj[_0x4c5b("0x10")][_0x4c5b("0x6e")] = function(arg, ultimateTruth) {
      return arg = arg >>> 0, ultimateTruth || resolve(arg, 4, this["length"]), 16777216 * this[arg] + (this[arg + 1] << 16 | this[arg + 2] << 8 | this[arg + 3]);
    };
    obj[_0x4c5b("0x10")][_0x4c5b("0x6f")] = function(n, count, canCreateDiscussions) {
      n = n >>> 0;
      count = count >>> 0;
      if (!canCreateDiscussions) {
        resolve(n, count, this["length"]);
      }
      var i = this[n];
      var d = 1;
      var offset = 0;
      for (; ++offset < count && (d = d * 256);) {
        i = i + this[n + offset] * d;
      }
      return i >= (d = d * 128) && (i = i - Math[_0x4c5b("0x70")](2, 8 * count)), i;
    };
    obj["prototype"][_0x4c5b("0x71")] = function(r, len, canCreateDiscussions) {
      r = r >>> 0;
      len = len >>> 0;
      if (!canCreateDiscussions) {
        resolve(r, len, this["length"]);
      }
      var l = len;
      var p = 1;
      var tmin = this[r + --l];
      for (; 0 < l && (p = p * 256);) {
        tmin = tmin + this[r + --l] * p;
      }
      return tmin >= (p = p * 128) && (tmin = tmin - Math["pow"](2, 8 * len)), tmin;
    };
    obj[_0x4c5b("0x10")][_0x4c5b("0x72")] = function(arg, ultimateTruth) {
      return arg = arg >>> 0, ultimateTruth || resolve(arg, 1, this["length"]), 128 & this[arg] ? -1 * (255 - this[arg] + 1) : this[arg];
    };
    obj[_0x4c5b("0x10")][_0x4c5b("0x73")] = function(todoscreate, canCreateDiscussions) {
      todoscreate = todoscreate >>> 0;
      if (!canCreateDiscussions) {
        resolve(todoscreate, 2, this["length"]);
      }
      var _0x198aff = this[todoscreate] | this[todoscreate + 1] << 8;
      return 32768 & _0x198aff ? 4294901760 | _0x198aff : _0x198aff;
    };
    obj[_0x4c5b("0x10")][_0x4c5b("0x74")] = function(todoscreate, canCreateDiscussions) {
      todoscreate = todoscreate >>> 0;
      if (!canCreateDiscussions) {
        resolve(todoscreate, 2, this["length"]);
      }
      var _0x198aff = this[todoscreate + 1] | this[todoscreate] << 8;
      return 32768 & _0x198aff ? 4294901760 | _0x198aff : _0x198aff;
    };
    obj[_0x4c5b("0x10")][_0x4c5b("0x75")] = function(arg, ultimateTruth) {
      return arg = arg >>> 0, ultimateTruth || resolve(arg, 4, this["length"]), this[arg] | this[arg + 1] << 8 | this[arg + 2] << 16 | this[arg + 3] << 24;
    };
    obj[_0x4c5b("0x10")][_0x4c5b("0x76")] = function(arg, ultimateTruth) {
      return arg = arg >>> 0, ultimateTruth || resolve(arg, 4, this["length"]), this[arg] << 24 | this[arg + 1] << 16 | this[arg + 2] << 8 | this[arg + 3];
    };
    obj[_0x4c5b("0x10")][_0x4c5b("0x77")] = function(data, iDataLength) {
      return data = data >>> 0, iDataLength || resolve(data, 4, this["length"]), options[_0x4c5b("0x78")](this, data, true, 23, 4);
    };
    obj["prototype"][_0x4c5b("0x79")] = function(data, iDataLength) {
      return data = data >>> 0, iDataLength || resolve(data, 4, this["length"]), options["read"](this, data, false, 23, 4);
    };
    obj["prototype"][_0x4c5b("0x7a")] = function(data, iDataLength) {
      return data = data >>> 0, iDataLength || resolve(data, 8, this["length"]), options["read"](this, data, true, 52, 8);
    };
    obj[_0x4c5b("0x10")]["readDoubleBE"] = function(data, iDataLength) {
      return data = data >>> 0, iDataLength || resolve(data, 8, this["length"]), options[_0x4c5b("0x78")](this, data, false, 52, 8);
    };
    obj[_0x4c5b("0x10")]["writeUIntLE"] = function(value, offset, byteLength, canCreateDiscussions) {
      if (!(value = +value, offset = offset >>> 0, byteLength = byteLength >>> 0, canCreateDiscussions)) {
        mkElem(this, value, offset, byteLength, Math[_0x4c5b("0x70")](2, 8 * byteLength) - 1, 0);
      }
      var mul = 1;
      var i = 0;
      this[offset] = 255 & value;
      for (; ++i < byteLength && (mul = mul * 256);) {
        this[offset + i] = 255 & value / mul;
      }
      return offset + byteLength;
    };
    obj[_0x4c5b("0x10")][_0x4c5b("0x7b")] = function(time, svg, i, canCreateDiscussions) {
      if (!(time = +time, svg = svg >>> 0, i = i >>> 0, canCreateDiscussions)) {
        mkElem(this, time, svg, i, Math[_0x4c5b("0x70")](2, 8 * i) - 1, 0);
      }
      var snI = i - 1;
      var duration = 1;
      this[svg + snI] = 255 & time;
      for (; 0 <= --snI && (duration = duration * 256);) {
        this[svg + snI] = 255 & time / duration;
      }
      return svg + i;
    };
    obj[_0x4c5b("0x10")][_0x4c5b("0x7c")] = function(start, curGradient, stop_elem) {
      return start = +start, curGradient = curGradient >>> 0, stop_elem || mkElem(this, start, curGradient, 1, 255, 0), this[curGradient] = 255 & start, curGradient + 1;
    };
    obj[_0x4c5b("0x10")][_0x4c5b("0x7d")] = function(start, curGradient, stop_elem) {
      return start = +start, curGradient = curGradient >>> 0, stop_elem || mkElem(this, start, curGradient, 2, 65535, 0), this[curGradient] = 255 & start, this[curGradient + 1] = start >>> 8, curGradient + 2;
    };
    obj[_0x4c5b("0x10")]["writeUInt16BE"] = function(c, n, stop_elem) {
      return c = +c, n = n >>> 0, stop_elem || mkElem(this, c, n, 2, 65535, 0), this[n] = c >>> 8, this[n + 1] = 255 & c, n + 2;
    };
    obj["prototype"][_0x4c5b("0x7e")] = function(start, curGradient, stop_elem) {
      return start = +start, curGradient = curGradient >>> 0, stop_elem || mkElem(this, start, curGradient, 4, 4294967295, 0), this[curGradient + 3] = start >>> 24, this[curGradient + 2] = start >>> 16, this[curGradient + 1] = start >>> 8, this[curGradient] = 255 & start, curGradient + 4;
    };
    obj[_0x4c5b("0x10")][_0x4c5b("0x7f")] = function(c, n, stop_elem) {
      return c = +c, n = n >>> 0, stop_elem || mkElem(this, c, n, 4, 4294967295, 0), this[n] = c >>> 24, this[n + 1] = c >>> 16, this[n + 2] = c >>> 8, this[n + 3] = 255 & c, n + 4;
    };
    obj["prototype"][_0x4c5b("0x80")] = function(value, offset, byteLength, canCreateDiscussions) {
      if (value = +value, offset = offset >>> 0, !canCreateDiscussions) {
        var _0x2910f4 = Math[_0x4c5b("0x70")](2, 8 * byteLength - 1);
        mkElem(this, value, offset, byteLength, _0x2910f4 - 1, -_0x2910f4);
      }
      var i = 0;
      var mul = 1;
      var h = 0;
      this[offset] = 255 & value;
      for (; ++i < byteLength && (mul = mul * 256);) {
        if (0 > value && 0 == h && 0 !== this[offset + i - 1]) {
          h = 1;
        }
        this[offset + i] = 255 & (value / mul >> 0) - h;
      }
      return offset + byteLength;
    };
    obj["prototype"][_0x4c5b("0x81")] = function(time, svg, i, canCreateDiscussions) {
      if (time = +time, svg = svg >>> 0, !canCreateDiscussions) {
        var _0x571784 = Math["pow"](2, 8 * i - 1);
        mkElem(this, time, svg, i, _0x571784 - 1, -_0x571784);
      }
      var snI = i - 1;
      var duration = 1;
      var y = 0;
      this[svg + snI] = 255 & time;
      for (; 0 <= --snI && (duration = duration * 256);) {
        if (0 > time && 0 == y && 0 !== this[svg + snI + 1]) {
          y = 1;
        }
        this[svg + snI] = 255 & (time / duration >> 0) - y;
      }
      return svg + i;
    };
    obj[_0x4c5b("0x10")][_0x4c5b("0x82")] = function(i, curGradient, stop_elem) {
      return i = +i, curGradient = curGradient >>> 0, stop_elem || mkElem(this, i, curGradient, 1, 127, -128), 0 > i && (i = 255 + i + 1), this[curGradient] = 255 & i, curGradient + 1;
    };
    obj["prototype"][_0x4c5b("0x83")] = function(start, curGradient, stop_elem) {
      return start = +start, curGradient = curGradient >>> 0, stop_elem || mkElem(this, start, curGradient, 2, 32767, -32768), this[curGradient] = 255 & start, this[curGradient + 1] = start >>> 8, curGradient + 2;
    };
    obj[_0x4c5b("0x10")][_0x4c5b("0x84")] = function(c, n, stop_elem) {
      return c = +c, n = n >>> 0, stop_elem || mkElem(this, c, n, 2, 32767, -32768), this[n] = c >>> 8, this[n + 1] = 255 & c, n + 2;
    };
    obj[_0x4c5b("0x10")][_0x4c5b("0x85")] = function(start, curGradient, stop_elem) {
      return start = +start, curGradient = curGradient >>> 0, stop_elem || mkElem(this, start, curGradient, 4, 2147483647, -2147483648), this[curGradient] = 255 & start, this[curGradient + 1] = start >>> 8, this[curGradient + 2] = start >>> 16, this[curGradient + 3] = start >>> 24, curGradient + 4;
    };
    obj["prototype"][_0x4c5b("0x86")] = function(i, curGradient, stop_elem) {
      return i = +i, curGradient = curGradient >>> 0, stop_elem || mkElem(this, i, curGradient, 4, 2147483647, -2147483648), 0 > i && (i = 4294967295 + i + 1), this[curGradient] = i >>> 24, this[curGradient + 1] = i >>> 16, this[curGradient + 2] = i >>> 8, this[curGradient + 3] = 255 & i, curGradient + 4;
    };
    obj[_0x4c5b("0x10")]["writeFloatLE"] = function(load, value, actual) {
      return error(this, load, value, true, actual);
    };
    obj[_0x4c5b("0x10")][_0x4c5b("0x87")] = function(load, value, actual) {
      return error(this, load, value, false, actual);
    };
    obj[_0x4c5b("0x10")][_0x4c5b("0x88")] = function(options, key, refreshTokenPathOrObject) {
      return getType(this, options, key, true, refreshTokenPathOrObject);
    };
    obj[_0x4c5b("0x10")][_0x4c5b("0x89")] = function(options, key, refreshTokenPathOrObject) {
      return getType(this, options, key, false, refreshTokenPathOrObject);
    };
    obj[_0x4c5b("0x10")]["copy"] = function(indices, i, count, len) {
      if (count || (count = 0), len || 0 === len || (len = this["length"]), i >= indices["length"] && (i = indices["length"]), i || (i = 0), 0 < len && len < count && (len = count), len === count) {
        return 0;
      }
      if (0 === indices["length"] || 0 === this["length"]) {
        return 0;
      }
      if (0 > i) {
        throw new RangeError(_0x4c5b("0x8a"));
      }
      if (0 > count || count >= this["length"]) {
        throw new RangeError(_0x4c5b("0x8b"));
      }
      if (0 > len) {
        throw new RangeError(_0x4c5b("0x8c"));
      }
      if (len > this["length"]) {
        len = this["length"];
      }
      if (indices["length"] - i < len - count) {
        len = indices["length"] - i + count;
      }
      var start = len - count;
      var index;
      if (this === indices && count < i && i < len) {
        index = start - 1;
        for (; 0 <= index; --index) {
          indices[index + i] = this[index + count];
        }
      } else {
        if (1E3 > start) {
          index = 0;
          for (; index < start; ++index) {
            indices[index + i] = this[index + count];
          }
        } else {
          Uint8Array["prototype"][_0x4c5b("0x8d")][_0x4c5b("0x4")](indices, this[_0x4c5b("0x8e")](count, count + start), i);
        }
      }
      return start;
    };
    obj[_0x4c5b("0x10")][_0x4c5b("0x4e")] = function(data, start, end, encoding) {
      if (_0x4c5b("0x12") == typeof data) {
        if (_0x4c5b("0x12") == typeof start ? (encoding = start, start = 0, end = this["length"]) : _0x4c5b("0x12") == typeof end && (encoding = end, end = this["length"]), 1 === data["length"]) {
          var pathOrData = data[_0x4c5b("0xa")](0);
          if (256 > pathOrData) {
            data = pathOrData;
          }
        }
        if (void 0 !== encoding && _0x4c5b("0x12") != typeof encoding) {
          throw new TypeError(_0x4c5b("0x8f"));
        }
        if (_0x4c5b("0x12") == typeof encoding && !obj[_0x4c5b("0x18")](encoding)) {
          throw new TypeError("Unknown encoding: " + encoding);
        }
      } else {
        if (_0x4c5b("0x11") == typeof data) {
          data = data & 255;
        }
      }
      if (0 > start || this["length"] < start || this["length"] < end) {
        throw new RangeError(_0x4c5b("0x90"));
      }
      if (end <= start) {
        return this;
      }
      var i;
      if (start = start >>> 0, end = void 0 === end ? this["length"] : end >>> 0, data || (data = 0), "number" == typeof data) {
        i = start;
        for (; i < end; ++i) {
          this[i] = data;
        }
      } else {
        var buffer = obj[_0x4c5b("0x1c")](data) ? data : new obj(data, encoding);
        var c = buffer["length"];
        i = 0;
        for (; i < end - start; ++i) {
          this[i + start] = buffer[i % c];
        }
      }
      return this;
    };
    var _digitExpr = /[^+\/0-9A-Za-z-_]/g;
  }, {
    "base64-js" : 1,
    "ieee754" : 9
  }],
  4 : [function(saveNotifs, isSlidingUp, computedOptions) {
    (function(options) {
      function isConfigurable(obj) {
        return Object[_0x4c5b("0x10")][_0x4c5b("0x25")][_0x4c5b("0x4")](obj);
      }
      computedOptions[_0x4c5b("0x20")] = function(data) {
        return Array["isArray"] ? Array[_0x4c5b("0x20")](data) : _0x4c5b("0x91") === isConfigurable(data);
      };
      computedOptions[_0x4c5b("0x92")] = function(canCreateDiscussions) {
        return _0x4c5b("0x93") == typeof canCreateDiscussions;
      };
      computedOptions[_0x4c5b("0x94")] = function(canCreateDiscussions) {
        return null === canCreateDiscussions;
      };
      computedOptions[_0x4c5b("0x95")] = function(canCreateDiscussions) {
        return null == canCreateDiscussions;
      };
      computedOptions[_0x4c5b("0x96")] = function(index) {
        return "number" == typeof index;
      };
      computedOptions[_0x4c5b("0x97")] = function(canCreateDiscussions) {
        return _0x4c5b("0x12") == typeof canCreateDiscussions;
      };
      computedOptions["isSymbol"] = function(canCreateDiscussions) {
        return _0x4c5b("0x98") == typeof canCreateDiscussions;
      };
      computedOptions[_0x4c5b("0x99")] = function(canCreateDiscussions) {
        return void 0 === canCreateDiscussions;
      };
      computedOptions[_0x4c5b("0x9a")] = function(key) {
        return _0x4c5b("0x9b") === isConfigurable(key);
      };
      computedOptions[_0x4c5b("0x9c")] = function(a) {
        return "object" == typeof a && null !== a;
      };
      computedOptions["isDate"] = function(key) {
        return _0x4c5b("0x9d") === isConfigurable(key);
      };
      computedOptions[_0x4c5b("0x9e")] = function(obj) {
        return "[object Error]" === isConfigurable(obj) || obj instanceof Error;
      };
      computedOptions[_0x4c5b("0x9f")] = function(canCreateDiscussions) {
        return _0x4c5b("0x0") == typeof canCreateDiscussions;
      };
      computedOptions[_0x4c5b("0xa0")] = function(index) {
        return null === index || _0x4c5b("0x93") == typeof index || "number" == typeof index || _0x4c5b("0x12") == typeof index || _0x4c5b("0x98") == typeof index || void 0 === index;
      };
      computedOptions["isBuffer"] = options["isBuffer"];
    })[_0x4c5b("0x4")](this, {
      "isBuffer" : saveNotifs(_0x4c5b("0xa1"))
    });
  }, {
    "../../is-buffer/index.js" : 11
  }],
  5 : [function(require, isSlidingUp, tasks) {
    tasks[_0x4c5b("0xa2")] = require(_0x4c5b("0xa3"));
    tasks[_0x4c5b("0xa4")] = require(_0x4c5b("0xa5"));
  }, {
    "./lib/uint32" : 6,
    "./lib/uint64" : 7
  }],
  6 : [function(isSlidingUp, global) {
    !function(global) {
      function Task(data, callback) {
        return this instanceof Task ? (this[_0x4c5b("0xa6")] = 0, this[_0x4c5b("0xa7")] = 0, this[_0x4c5b("0xa8")] = null, void 0 === callback ? then["call"](this, data) : "string" == typeof data ? createNamedToNumberedLookup[_0x4c5b("0x4")](this, data, callback) : void resources[_0x4c5b("0x4")](this, data, callback)) : new Task(data, callback);
      }
      function resources(cb, options) {
        return this[_0x4c5b("0xa6")] = 0 | cb, this[_0x4c5b("0xa7")] = 0 | options, this;
      }
      function then(onRej) {
        return this[_0x4c5b("0xa6")] = 65535 & onRej, this["_high"] = onRej >>> 16, this;
      }
      function createNamedToNumberedLookup(items, radix) {
        var whiteRating = parseInt(items, radix || 10);
        return this["_low"] = 65535 & whiteRating, this["_high"] = whiteRating >>> 16, this;
      }
      Task(Math[_0x4c5b("0x70")](36, 5));
      Task(Math[_0x4c5b("0x70")](16, 7));
      Task(Math[_0x4c5b("0x70")](10, 9));
      Task(Math[_0x4c5b("0x70")](2, 30));
      Task(36);
      Task(16);
      Task(10);
      Task(2);
      Task[_0x4c5b("0x10")]["fromBits"] = resources;
      Task["prototype"][_0x4c5b("0xa9")] = then;
      Task["prototype"][_0x4c5b("0xaa")] = createNamedToNumberedLookup;
      Task["prototype"][_0x4c5b("0xab")] = function() {
        return 65536 * this[_0x4c5b("0xa7")] + this["_low"];
      };
      Task["prototype"][_0x4c5b("0x25")] = function(canCreateDiscussions) {
        return this[_0x4c5b("0xab")]()[_0x4c5b("0x25")](canCreateDiscussions || 10);
      };
      Task[_0x4c5b("0x10")][_0x4c5b("0xac")] = function(canCreateDiscussions) {
        var carry = this[_0x4c5b("0xa6")] + canCreateDiscussions[_0x4c5b("0xa6")];
        var ncarry = carry >>> 16;
        return ncarry = ncarry + (this[_0x4c5b("0xa7")] + canCreateDiscussions[_0x4c5b("0xa7")]), this[_0x4c5b("0xa6")] = 65535 & carry, this[_0x4c5b("0xa7")] = 65535 & ncarry, this;
      };
      Task[_0x4c5b("0x10")]["subtract"] = function(canCreateDiscussions) {
        return this[_0x4c5b("0xac")](canCreateDiscussions[_0x4c5b("0xad")]()[_0x4c5b("0xae")]());
      };
      Task[_0x4c5b("0x10")]["multiply"] = function(translates) {
        var nodeCharge = this[_0x4c5b("0xa7")];
        var end_new = this[_0x4c5b("0xa6")];
        var strchoose = translates[_0x4c5b("0xa7")];
        var strifoundthat = translates[_0x4c5b("0xa6")];
        var chargeY;
        var off_new;
        return chargeY = (off_new = end_new * strifoundthat) >>> 16, chargeY = chargeY + nodeCharge * strifoundthat, chargeY = chargeY & 65535, chargeY = chargeY + end_new * strchoose, this[_0x4c5b("0xa6")] = 65535 & off_new, this[_0x4c5b("0xa7")] = 65535 & chargeY, this;
      };
      Task[_0x4c5b("0x10")][_0x4c5b("0xaf")] = function(_hexDigitValueTable) {
        if (0 == _hexDigitValueTable["_low"] && 0 == _hexDigitValueTable[_0x4c5b("0xa7")]) {
          throw Error(_0x4c5b("0xb0"));
        }
        if (0 == _hexDigitValueTable["_high"] && 1 == _hexDigitValueTable[_0x4c5b("0xa6")]) {
          return this[_0x4c5b("0xa8")] = new Task(0), this;
        }
        if (_hexDigitValueTable["gt"](this)) {
          return this["remainder"] = this[_0x4c5b("0xad")](), this[_0x4c5b("0xa6")] = 0, this[_0x4c5b("0xa7")] = 0, this;
        }
        if (this["eq"](_hexDigitValueTable)) {
          return this[_0x4c5b("0xa8")] = new Task(0), this[_0x4c5b("0xa6")] = 1, this[_0x4c5b("0xa7")] = 0, this;
        }
        var TWO_PWR_24 = _hexDigitValueTable[_0x4c5b("0xad")]();
        var _0x42630c = -1;
        for (; !this["lt"](TWO_PWR_24);) {
          TWO_PWR_24[_0x4c5b("0xb1")](1, true);
          _0x42630c++;
        }
        this[_0x4c5b("0xa8")] = this["clone"]();
        this[_0x4c5b("0xa6")] = 0;
        this[_0x4c5b("0xa7")] = 0;
        for (; 0 <= _0x42630c; _0x42630c--) {
          TWO_PWR_24[_0x4c5b("0xb2")](1);
          if (!this[_0x4c5b("0xa8")]["lt"](TWO_PWR_24)) {
            this[_0x4c5b("0xa8")][_0x4c5b("0xb3")](TWO_PWR_24);
            if (16 <= _0x42630c) {
              this[_0x4c5b("0xa7")] |= 1 << _0x42630c - 16;
            } else {
              this[_0x4c5b("0xa6")] |= 1 << _0x42630c;
            }
          }
        }
        return this;
      };
      Task[_0x4c5b("0x10")]["negate"] = function() {
        var _0x42630c = 1 + (65535 & ~this[_0x4c5b("0xa6")]);
        return this[_0x4c5b("0xa6")] = 65535 & _0x42630c, this["_high"] = 65535 & ~this[_0x4c5b("0xa7")] + (_0x42630c >>> 16), this;
      };
      Task["prototype"][_0x4c5b("0x5f")] = Task[_0x4c5b("0x10")]["eq"] = function(canCreateDiscussions) {
        return this["_low"] == canCreateDiscussions[_0x4c5b("0xa6")] && this["_high"] == canCreateDiscussions[_0x4c5b("0xa7")];
      };
      Task[_0x4c5b("0x10")][_0x4c5b("0xb4")] = Task[_0x4c5b("0x10")]["gt"] = function(_hexDigitValueTable) {
        return this[_0x4c5b("0xa7")] > _hexDigitValueTable["_high"] || !(this[_0x4c5b("0xa7")] < _hexDigitValueTable[_0x4c5b("0xa7")]) && this["_low"] > _hexDigitValueTable["_low"];
      };
      Task[_0x4c5b("0x10")][_0x4c5b("0xb5")] = Task[_0x4c5b("0x10")]["lt"] = function(_hexDigitValueTable) {
        return this[_0x4c5b("0xa7")] < _hexDigitValueTable[_0x4c5b("0xa7")] || !(this[_0x4c5b("0xa7")] > _hexDigitValueTable["_high"]) && this[_0x4c5b("0xa6")] < _hexDigitValueTable[_0x4c5b("0xa6")];
      };
      Task["prototype"]["or"] = function(_hexDigitValueTable) {
        return this[_0x4c5b("0xa6")] |= _hexDigitValueTable[_0x4c5b("0xa6")], this[_0x4c5b("0xa7")] |= _hexDigitValueTable["_high"], this;
      };
      Task[_0x4c5b("0x10")][_0x4c5b("0xb6")] = function(canCreateDiscussions) {
        return this[_0x4c5b("0xa6")] &= canCreateDiscussions[_0x4c5b("0xa6")], this[_0x4c5b("0xa7")] &= canCreateDiscussions[_0x4c5b("0xa7")], this;
      };
      Task[_0x4c5b("0x10")][_0x4c5b("0xb7")] = function() {
        return this[_0x4c5b("0xa6")] = 65535 & ~this[_0x4c5b("0xa6")], this[_0x4c5b("0xa7")] = 65535 & ~this[_0x4c5b("0xa7")], this;
      };
      Task[_0x4c5b("0x10")]["xor"] = function(canCreateDiscussions) {
        return this["_low"] ^= canCreateDiscussions[_0x4c5b("0xa6")], this[_0x4c5b("0xa7")] ^= canCreateDiscussions[_0x4c5b("0xa7")], this;
      };
      Task[_0x4c5b("0x10")][_0x4c5b("0xb2")] = Task[_0x4c5b("0x10")][_0x4c5b("0xb8")] = function(canCreateDiscussions) {
        return 16 < canCreateDiscussions ? (this["_low"] = this[_0x4c5b("0xa7")] >> canCreateDiscussions - 16, this[_0x4c5b("0xa7")] = 0) : 16 == canCreateDiscussions ? (this[_0x4c5b("0xa6")] = this["_high"], this[_0x4c5b("0xa7")] = 0) : (this[_0x4c5b("0xa6")] = this[_0x4c5b("0xa6")] >> canCreateDiscussions | 65535 & this[_0x4c5b("0xa7")] << 16 - canCreateDiscussions, this["_high"] >>= canCreateDiscussions), this;
      };
      Task[_0x4c5b("0x10")][_0x4c5b("0xb1")] = Task["prototype"][_0x4c5b("0xb9")] = function(canCreateDiscussions, isSlidingUp) {
        return 16 < canCreateDiscussions ? (this[_0x4c5b("0xa7")] = this[_0x4c5b("0xa6")] << canCreateDiscussions - 16, this[_0x4c5b("0xa6")] = 0, isSlidingUp || (this[_0x4c5b("0xa7")] &= 65535)) : 16 == canCreateDiscussions ? (this[_0x4c5b("0xa7")] = this[_0x4c5b("0xa6")], this[_0x4c5b("0xa6")] = 0) : (this[_0x4c5b("0xa7")] = this[_0x4c5b("0xa7")] << canCreateDiscussions | this[_0x4c5b("0xa6")] >> 16 - canCreateDiscussions, this[_0x4c5b("0xa6")] = 65535 & this[_0x4c5b("0xa6")] << canCreateDiscussions, 
        isSlidingUp || (this[_0x4c5b("0xa7")] &= 65535)), this;
      };
      Task[_0x4c5b("0x10")][_0x4c5b("0xba")] = Task["prototype"][_0x4c5b("0xbb")] = function(numBitsToRotate) {
        var wordA = this[_0x4c5b("0xa7")] << 16 | this[_0x4c5b("0xa6")];
        return wordA = wordA << numBitsToRotate | wordA >>> 32 - numBitsToRotate, this[_0x4c5b("0xa6")] = 65535 & wordA, this["_high"] = wordA >>> 16, this;
      };
      Task["prototype"][_0x4c5b("0xbc")] = Task[_0x4c5b("0x10")][_0x4c5b("0xbd")] = function(n) {
        var X = this[_0x4c5b("0xa7")] << 16 | this[_0x4c5b("0xa6")];
        return X = X >>> n | X << 32 - n, this[_0x4c5b("0xa6")] = 65535 & X, this[_0x4c5b("0xa7")] = X >>> 16, this;
      };
      Task[_0x4c5b("0x10")][_0x4c5b("0xad")] = function() {
        return new Task(this["_low"], this[_0x4c5b("0xa7")]);
      };
      if (_0x4c5b("0x49") != typeof define && define[_0x4c5b("0xbe")]) {
        define([], function() {
          return Task;
        });
      } else {
        if (void 0 !== global && global[_0x4c5b("0x5")]) {
          global[_0x4c5b("0x5")] = Task;
        } else {
          global[_0x4c5b("0xa2")] = Task;
        }
      }
    }(this);
  }, {}],
  7 : [function(canCreateDiscussions, global) {
    !function(global) {
      function Model(obj, type, data, options) {
        return this instanceof Model ? (this[_0x4c5b("0xa8")] = null, _0x4c5b("0x12") == typeof obj ? build[_0x4c5b("0x4")](this, obj, type) : void 0 === type ? db[_0x4c5b("0x4")](this, obj) : void deferred[_0x4c5b("0x36")](this, arguments)) : new Model(obj, type, data, options);
      }
      function deferred(timeout, callback, cancel, isValid) {
        return void 0 === cancel ? (this[_0x4c5b("0xbf")] = 65535 & timeout, this[_0x4c5b("0xc0")] = timeout >>> 16, this[_0x4c5b("0xc1")] = 65535 & callback, this["_a48"] = callback >>> 16, this) : (this[_0x4c5b("0xbf")] = 0 | timeout, this["_a16"] = 0 | callback, this[_0x4c5b("0xc1")] = 0 | cancel, this["_a48"] = 0 | isValid, this);
      }
      function db(size) {
        return this[_0x4c5b("0xbf")] = 65535 & size, this[_0x4c5b("0xc0")] = size >>> 16, this[_0x4c5b("0xc1")] = 0, this[_0x4c5b("0xc2")] = 0, this;
      }
      function build(rrd, name) {
        name = name || 10;
        this["_a00"] = 0;
        this["_a16"] = 0;
        this[_0x4c5b("0xc1")] = 0;
        this[_0x4c5b("0xc2")] = 0;
        var pui_rating_star = processedOptions[name] || new Model(Math[_0x4c5b("0x70")](name, 5));
        var currentCount = 0;
        var configCount = rrd["length"];
        for (; currentCount < configCount; currentCount = currentCount + 5) {
          var i = Math[_0x4c5b("0x34")](5, configCount - currentCount);
          var t = parseInt(rrd[_0x4c5b("0x1b")](currentCount, currentCount + i), name);
          this[_0x4c5b("0xc3")](5 > i ? new Model(Math["pow"](name, i)) : pui_rating_star)["add"](new Model(t));
        }
        return this;
      }
      var processedOptions = {
        16 : Model(Math["pow"](16, 5)),
        10 : Model(Math["pow"](10, 5)),
        2 : Model(Math["pow"](2, 5))
      };
      var els = {
        16 : Model(16),
        10 : Model(10),
        2 : Model(2)
      };
      Model[_0x4c5b("0x10")]["fromBits"] = deferred;
      Model[_0x4c5b("0x10")][_0x4c5b("0xa9")] = db;
      Model["prototype"][_0x4c5b("0xaa")] = build;
      Model[_0x4c5b("0x10")][_0x4c5b("0xab")] = function() {
        return 65536 * this[_0x4c5b("0xc0")] + this[_0x4c5b("0xbf")];
      };
      Model[_0x4c5b("0x10")]["toString"] = function(val) {
        var rem = els[val = val || 10] || new Model(val);
        if (!this["gt"](rem)) {
          return this[_0x4c5b("0xab")]()["toString"](val);
        }
        var approxRem = this[_0x4c5b("0xad")]();
        var a = Array(64);
        var i = 63;
        for (; 0 <= i && (approxRem[_0x4c5b("0xaf")](rem), a[i] = approxRem[_0x4c5b("0xa8")][_0x4c5b("0xab")]()[_0x4c5b("0x25")](val), approxRem["gt"](rem)); i--) {
        }
        return a[i - 1] = approxRem[_0x4c5b("0xab")]()[_0x4c5b("0x25")](val), a["join"]("");
      };
      Model["prototype"][_0x4c5b("0xac")] = function(canCreateDiscussions) {
        var carry = this[_0x4c5b("0xbf")] + canCreateDiscussions[_0x4c5b("0xbf")];
        var ncarry = carry >>> 16;
        var _0x5303de = (ncarry = ncarry + (this[_0x4c5b("0xc0")] + canCreateDiscussions[_0x4c5b("0xc0")])) >>> 16;
        var _0x4deb4c = (_0x5303de = _0x5303de + (this[_0x4c5b("0xc1")] + canCreateDiscussions[_0x4c5b("0xc1")])) >>> 16;
        return _0x4deb4c = _0x4deb4c + (this[_0x4c5b("0xc2")] + canCreateDiscussions[_0x4c5b("0xc2")]), this["_a00"] = 65535 & carry, this[_0x4c5b("0xc0")] = 65535 & ncarry, this[_0x4c5b("0xc1")] = 65535 & _0x5303de, this[_0x4c5b("0xc2")] = 65535 & _0x4deb4c, this;
      };
      Model[_0x4c5b("0x10")][_0x4c5b("0xb3")] = function(canCreateDiscussions) {
        return this[_0x4c5b("0xac")](canCreateDiscussions[_0x4c5b("0xad")]()["negate"]());
      };
      Model["prototype"][_0x4c5b("0xc3")] = function(b) {
        var t = this[_0x4c5b("0xbf")];
        var r = this[_0x4c5b("0xc0")];
        var size = this["_a32"];
        var dir = this[_0x4c5b("0xc2")];
        var j = b[_0x4c5b("0xbf")];
        var i = b[_0x4c5b("0xc0")];
        var f = b["_a32"];
        var angle = t * j;
        var start = angle >>> 16;
        var x = (start = start + t * i) >>> 16;
        start = start & 65535;
        x = x + ((start = start + r * j) >>> 16);
        var y = (x = x + t * f) >>> 16;
        return x = x & 65535, y = y + ((x = x + r * i) >>> 16), x = x & 65535, y = y + ((x = x + size * j) >>> 16), y = y + t * b[_0x4c5b("0xc2")], y = y & 65535, y = y + r * f, y = y & 65535, y = y + size * i, y = y & 65535, y = y + dir * j, this[_0x4c5b("0xbf")] = 65535 & angle, this[_0x4c5b("0xc0")] = 65535 & start, this[_0x4c5b("0xc1")] = 65535 & x, this[_0x4c5b("0xc2")] = 65535 & y, this;
      };
      Model[_0x4c5b("0x10")]["div"] = function(other) {
        if (0 == other[_0x4c5b("0xc0")] && 0 == other["_a32"] && 0 == other["_a48"]) {
          if (0 == other["_a00"]) {
            throw Error(_0x4c5b("0xb0"));
          }
          if (1 == other[_0x4c5b("0xbf")]) {
            return this[_0x4c5b("0xa8")] = new Model(0), this;
          }
        }
        if (other["gt"](this)) {
          return this[_0x4c5b("0xa8")] = this[_0x4c5b("0xad")](), this[_0x4c5b("0xbf")] = 0, this[_0x4c5b("0xc0")] = 0, this[_0x4c5b("0xc1")] = 0, this[_0x4c5b("0xc2")] = 0, this;
        }
        if (this["eq"](other)) {
          return this[_0x4c5b("0xa8")] = new Model(0), this[_0x4c5b("0xbf")] = 1, this[_0x4c5b("0xc0")] = 0, this[_0x4c5b("0xc1")] = 0, this[_0x4c5b("0xc2")] = 0, this;
        }
        var TWO_PWR_24 = other[_0x4c5b("0xad")]();
        var _0x418094 = -1;
        for (; !this["lt"](TWO_PWR_24);) {
          TWO_PWR_24[_0x4c5b("0xb1")](1, true);
          _0x418094++;
        }
        this[_0x4c5b("0xa8")] = this[_0x4c5b("0xad")]();
        this["_a00"] = 0;
        this[_0x4c5b("0xc0")] = 0;
        this[_0x4c5b("0xc1")] = 0;
        this["_a48"] = 0;
        for (; 0 <= _0x418094; _0x418094--) {
          TWO_PWR_24[_0x4c5b("0xb2")](1);
          if (!this[_0x4c5b("0xa8")]["lt"](TWO_PWR_24)) {
            this[_0x4c5b("0xa8")][_0x4c5b("0xb3")](TWO_PWR_24);
            if (48 <= _0x418094) {
              this[_0x4c5b("0xc2")] |= 1 << _0x418094 - 48;
            } else {
              if (32 <= _0x418094) {
                this["_a32"] |= 1 << _0x418094 - 32;
              } else {
                if (16 <= _0x418094) {
                  this[_0x4c5b("0xc0")] |= 1 << _0x418094 - 16;
                } else {
                  this["_a00"] |= 1 << _0x418094;
                }
              }
            }
          }
        }
        return this;
      };
      Model[_0x4c5b("0x10")][_0x4c5b("0xae")] = function() {
        var _0x418094 = 1 + (65535 & ~this["_a00"]);
        return this["_a00"] = 65535 & _0x418094, _0x418094 = (65535 & ~this[_0x4c5b("0xc0")]) + (_0x418094 >>> 16), this[_0x4c5b("0xc0")] = 65535 & _0x418094, _0x418094 = (65535 & ~this[_0x4c5b("0xc1")]) + (_0x418094 >>> 16), this["_a32"] = 65535 & _0x418094, this[_0x4c5b("0xc2")] = 65535 & ~this[_0x4c5b("0xc2")] + (_0x418094 >>> 16), this;
      };
      Model[_0x4c5b("0x10")][_0x4c5b("0x5f")] = Model[_0x4c5b("0x10")]["eq"] = function(canCreateDiscussions) {
        return this[_0x4c5b("0xc2")] == canCreateDiscussions[_0x4c5b("0xc2")] && this[_0x4c5b("0xbf")] == canCreateDiscussions[_0x4c5b("0xbf")] && this[_0x4c5b("0xc1")] == canCreateDiscussions[_0x4c5b("0xc1")] && this[_0x4c5b("0xc0")] == canCreateDiscussions[_0x4c5b("0xc0")];
      };
      Model["prototype"][_0x4c5b("0xb4")] = Model["prototype"]["gt"] = function(canCreateDiscussions) {
        return this[_0x4c5b("0xc2")] > canCreateDiscussions[_0x4c5b("0xc2")] || !(this[_0x4c5b("0xc2")] < canCreateDiscussions[_0x4c5b("0xc2")]) && (this["_a32"] > canCreateDiscussions[_0x4c5b("0xc1")] || !(this[_0x4c5b("0xc1")] < canCreateDiscussions[_0x4c5b("0xc1")]) && (this[_0x4c5b("0xc0")] > canCreateDiscussions[_0x4c5b("0xc0")] || !(this[_0x4c5b("0xc0")] < canCreateDiscussions[_0x4c5b("0xc0")]) && this[_0x4c5b("0xbf")] > canCreateDiscussions[_0x4c5b("0xbf")]));
      };
      Model[_0x4c5b("0x10")]["lessThan"] = Model[_0x4c5b("0x10")]["lt"] = function(canCreateDiscussions) {
        return this[_0x4c5b("0xc2")] < canCreateDiscussions[_0x4c5b("0xc2")] || !(this["_a48"] > canCreateDiscussions[_0x4c5b("0xc2")]) && (this[_0x4c5b("0xc1")] < canCreateDiscussions["_a32"] || !(this[_0x4c5b("0xc1")] > canCreateDiscussions[_0x4c5b("0xc1")]) && (this[_0x4c5b("0xc0")] < canCreateDiscussions[_0x4c5b("0xc0")] || !(this[_0x4c5b("0xc0")] > canCreateDiscussions[_0x4c5b("0xc0")]) && this[_0x4c5b("0xbf")] < canCreateDiscussions[_0x4c5b("0xbf")]));
      };
      Model[_0x4c5b("0x10")]["or"] = function(canCreateDiscussions) {
        return this[_0x4c5b("0xbf")] |= canCreateDiscussions[_0x4c5b("0xbf")], this["_a16"] |= canCreateDiscussions[_0x4c5b("0xc0")], this[_0x4c5b("0xc1")] |= canCreateDiscussions[_0x4c5b("0xc1")], this["_a48"] |= canCreateDiscussions["_a48"], this;
      };
      Model[_0x4c5b("0x10")][_0x4c5b("0xb6")] = function(canCreateDiscussions) {
        return this["_a00"] &= canCreateDiscussions[_0x4c5b("0xbf")], this[_0x4c5b("0xc0")] &= canCreateDiscussions[_0x4c5b("0xc0")], this[_0x4c5b("0xc1")] &= canCreateDiscussions[_0x4c5b("0xc1")], this[_0x4c5b("0xc2")] &= canCreateDiscussions["_a48"], this;
      };
      Model["prototype"][_0x4c5b("0xc4")] = function(canCreateDiscussions) {
        return this[_0x4c5b("0xbf")] ^= canCreateDiscussions[_0x4c5b("0xbf")], this[_0x4c5b("0xc0")] ^= canCreateDiscussions[_0x4c5b("0xc0")], this[_0x4c5b("0xc1")] ^= canCreateDiscussions[_0x4c5b("0xc1")], this[_0x4c5b("0xc2")] ^= canCreateDiscussions[_0x4c5b("0xc2")], this;
      };
      Model["prototype"][_0x4c5b("0xb7")] = function() {
        return this[_0x4c5b("0xbf")] = 65535 & ~this["_a00"], this[_0x4c5b("0xc0")] = 65535 & ~this[_0x4c5b("0xc0")], this["_a32"] = 65535 & ~this[_0x4c5b("0xc1")], this[_0x4c5b("0xc2")] = 65535 & ~this[_0x4c5b("0xc2")], this;
      };
      Model["prototype"][_0x4c5b("0xb2")] = Model[_0x4c5b("0x10")][_0x4c5b("0xb8")] = function(canCreateDiscussions) {
        return 48 <= (canCreateDiscussions = canCreateDiscussions % 64) ? (this[_0x4c5b("0xbf")] = this[_0x4c5b("0xc2")] >> canCreateDiscussions - 48, this[_0x4c5b("0xc0")] = 0, this["_a32"] = 0, this[_0x4c5b("0xc2")] = 0) : 32 <= canCreateDiscussions ? (canCreateDiscussions = canCreateDiscussions - 32, this[_0x4c5b("0xbf")] = 65535 & (this["_a32"] >> canCreateDiscussions | this[_0x4c5b("0xc2")] << 16 - canCreateDiscussions), this["_a16"] = 65535 & this[_0x4c5b("0xc2")] >> canCreateDiscussions, this[_0x4c5b("0xc1")] = 
        0, this[_0x4c5b("0xc2")] = 0) : 16 <= canCreateDiscussions ? (canCreateDiscussions = canCreateDiscussions - 16, this[_0x4c5b("0xbf")] = 65535 & (this[_0x4c5b("0xc0")] >> canCreateDiscussions | this["_a32"] << 16 - canCreateDiscussions), this[_0x4c5b("0xc0")] = 65535 & (this["_a32"] >> canCreateDiscussions | this[_0x4c5b("0xc2")] << 16 - canCreateDiscussions), this[_0x4c5b("0xc1")] = 65535 & this[_0x4c5b("0xc2")] >> canCreateDiscussions, this[_0x4c5b("0xc2")] = 0) : (this[_0x4c5b("0xbf")] = 
        65535 & (this[_0x4c5b("0xbf")] >> canCreateDiscussions | this[_0x4c5b("0xc0")] << 16 - canCreateDiscussions), this["_a16"] = 65535 & (this[_0x4c5b("0xc0")] >> canCreateDiscussions | this[_0x4c5b("0xc1")] << 16 - canCreateDiscussions), this[_0x4c5b("0xc1")] = 65535 & (this[_0x4c5b("0xc1")] >> canCreateDiscussions | this["_a48"] << 16 - canCreateDiscussions), this["_a48"] = 65535 & this["_a48"] >> canCreateDiscussions), this;
      };
      Model["prototype"][_0x4c5b("0xb1")] = Model[_0x4c5b("0x10")]["shiftl"] = function(canCreateDiscussions, isSlidingUp) {
        return 48 <= (canCreateDiscussions = canCreateDiscussions % 64) ? (this[_0x4c5b("0xc2")] = this[_0x4c5b("0xbf")] << canCreateDiscussions - 48, this["_a32"] = 0, this[_0x4c5b("0xc0")] = 0, this[_0x4c5b("0xbf")] = 0) : 32 <= canCreateDiscussions ? (canCreateDiscussions = canCreateDiscussions - 32, this[_0x4c5b("0xc2")] = this[_0x4c5b("0xc0")] << canCreateDiscussions | this["_a00"] >> 16 - canCreateDiscussions, this[_0x4c5b("0xc1")] = 65535 & this[_0x4c5b("0xbf")] << canCreateDiscussions, this[_0x4c5b("0xc0")] = 
        0, this["_a00"] = 0) : 16 <= canCreateDiscussions ? (canCreateDiscussions = canCreateDiscussions - 16, this[_0x4c5b("0xc2")] = this[_0x4c5b("0xc1")] << canCreateDiscussions | this[_0x4c5b("0xc0")] >> 16 - canCreateDiscussions, this[_0x4c5b("0xc1")] = 65535 & (this[_0x4c5b("0xc0")] << canCreateDiscussions | this[_0x4c5b("0xbf")] >> 16 - canCreateDiscussions), this[_0x4c5b("0xc0")] = 65535 & this[_0x4c5b("0xbf")] << canCreateDiscussions, this[_0x4c5b("0xbf")] = 0) : (this[_0x4c5b("0xc2")] = 
        this[_0x4c5b("0xc2")] << canCreateDiscussions | this["_a32"] >> 16 - canCreateDiscussions, this[_0x4c5b("0xc1")] = 65535 & (this[_0x4c5b("0xc1")] << canCreateDiscussions | this[_0x4c5b("0xc0")] >> 16 - canCreateDiscussions), this[_0x4c5b("0xc0")] = 65535 & (this[_0x4c5b("0xc0")] << canCreateDiscussions | this[_0x4c5b("0xbf")] >> 16 - canCreateDiscussions), this[_0x4c5b("0xbf")] = 65535 & this["_a00"] << canCreateDiscussions), isSlidingUp || (this[_0x4c5b("0xc2")] &= 65535), this;
      };
      Model["prototype"][_0x4c5b("0xba")] = Model[_0x4c5b("0x10")]["rotl"] = function(n) {
        if (0 == (n = n % 64)) {
          return this;
        }
        if (32 <= n) {
          var _0x4deb4c = this[_0x4c5b("0xbf")];
          if (this[_0x4c5b("0xbf")] = this[_0x4c5b("0xc1")], this[_0x4c5b("0xc1")] = _0x4deb4c, _0x4deb4c = this[_0x4c5b("0xc2")], this[_0x4c5b("0xc2")] = this[_0x4c5b("0xc0")], this[_0x4c5b("0xc0")] = _0x4deb4c, 32 == n) {
            return this;
          }
          n = n - 32;
        }
        var x = this[_0x4c5b("0xc2")] << 16 | this[_0x4c5b("0xc1")];
        var r = this[_0x4c5b("0xc0")] << 16 | this["_a00"];
        var _0x3f900b = x << n | r >>> 32 - n;
        var _0xf37e1c = r << n | x >>> 32 - n;
        return this[_0x4c5b("0xbf")] = 65535 & _0xf37e1c, this[_0x4c5b("0xc0")] = _0xf37e1c >>> 16, this[_0x4c5b("0xc1")] = 65535 & _0x3f900b, this["_a48"] = _0x3f900b >>> 16, this;
      };
      Model[_0x4c5b("0x10")][_0x4c5b("0xbc")] = Model[_0x4c5b("0x10")][_0x4c5b("0xbd")] = function(n) {
        if (0 == (n = n % 64)) {
          return this;
        }
        if (32 <= n) {
          var _0x4deb4c = this[_0x4c5b("0xbf")];
          if (this[_0x4c5b("0xbf")] = this["_a32"], this[_0x4c5b("0xc1")] = _0x4deb4c, _0x4deb4c = this[_0x4c5b("0xc2")], this[_0x4c5b("0xc2")] = this[_0x4c5b("0xc0")], this[_0x4c5b("0xc0")] = _0x4deb4c, 32 == n) {
            return this;
          }
          n = n - 32;
        }
        var X = this[_0x4c5b("0xc2")] << 16 | this[_0x4c5b("0xc1")];
        var Xl = this[_0x4c5b("0xc0")] << 16 | this["_a00"];
        var _0x47e30f = X >>> n | Xl << 32 - n;
        var _0xf37e1c = Xl >>> n | X << 32 - n;
        return this[_0x4c5b("0xbf")] = 65535 & _0xf37e1c, this[_0x4c5b("0xc0")] = _0xf37e1c >>> 16, this[_0x4c5b("0xc1")] = 65535 & _0x47e30f, this[_0x4c5b("0xc2")] = _0x47e30f >>> 16, this;
      };
      Model[_0x4c5b("0x10")][_0x4c5b("0xad")] = function() {
        return new Model(this[_0x4c5b("0xbf")], this[_0x4c5b("0xc0")], this["_a32"], this[_0x4c5b("0xc2")]);
      };
      if ("undefined" != typeof define && define[_0x4c5b("0xbe")]) {
        define([], function() {
          return Model;
        });
      } else {
        if (void 0 !== global && global[_0x4c5b("0x5")]) {
          global["exports"] = Model;
        } else {
          global[_0x4c5b("0xa4")] = Model;
        }
      }
    }(this);
  }, {}],
  8 : [function(canCreateDiscussions, PL$9) {
    function PL$11() {
      this[_0x4c5b("0xc5")] = this[_0x4c5b("0xc5")] || {};
      this[_0x4c5b("0xc6")] = this[_0x4c5b("0xc6")] || void 0;
    }
    function assert(arg) {
      return "function" == typeof arg;
    }
    function triggerListeners_(listeners) {
      return _0x4c5b("0xc7") == typeof listeners && null !== listeners;
    }
    function change_btn(hide) {
      return void 0 === hide;
    }
    PL$9[_0x4c5b("0x5")] = PL$11;
    PL$11["EventEmitter"] = PL$11;
    PL$11[_0x4c5b("0x10")][_0x4c5b("0xc5")] = void 0;
    PL$11["prototype"]["_maxListeners"] = void 0;
    PL$11["defaultMaxListeners"] = 10;
    PL$11["prototype"]["setMaxListeners"] = function(yscore) {
      if (_0x4c5b("0x11") != typeof yscore || 0 > yscore || isNaN(yscore)) {
        throw TypeError(_0x4c5b("0xc8"));
      }
      return this[_0x4c5b("0xc6")] = yscore, this;
    };
    PL$11["prototype"]["emit"] = function(type) {
      var value;
      var listeners;
      var addressCount;
      var data;
      var signedTransactionsCounter;
      var signedTransactions;
      if (this[_0x4c5b("0xc5")] || (this[_0x4c5b("0xc5")] = {}), "error" === type && (!this[_0x4c5b("0xc5")][_0x4c5b("0x47")] || triggerListeners_(this[_0x4c5b("0xc5")][_0x4c5b("0x47")]) && !this[_0x4c5b("0xc5")][_0x4c5b("0x47")]["length"])) {
        if ((value = arguments[1]) instanceof Error) {
          throw value;
        }
        var result = new Error(_0x4c5b("0xc9") + value + ")");
        throw result["context"] = value, result;
      }
      if (change_btn(listeners = this["_events"][type])) {
        return false;
      }
      if (assert(listeners)) {
        switch(arguments["length"]) {
          case 1:
            listeners["call"](this);
            break;
          case 2:
            listeners["call"](this, arguments[1]);
            break;
          case 3:
            listeners["call"](this, arguments[1], arguments[2]);
            break;
          default:
            data = Array["prototype"]["slice"][_0x4c5b("0x4")](arguments, 1);
            listeners[_0x4c5b("0x36")](this, data);
        }
      } else {
        if (triggerListeners_(listeners)) {
          data = Array[_0x4c5b("0x10")]["slice"][_0x4c5b("0x4")](arguments, 1);
          addressCount = (signedTransactions = listeners[_0x4c5b("0x1b")]())["length"];
          signedTransactionsCounter = 0;
          for (; signedTransactionsCounter < addressCount; signedTransactionsCounter++) {
            signedTransactions[signedTransactionsCounter][_0x4c5b("0x36")](this, data);
          }
        }
      }
      return true;
    };
    PL$11[_0x4c5b("0x10")][_0x4c5b("0xca")] = function(type, listener) {
      var _0x25f6ba;
      if (!assert(listener)) {
        throw TypeError(_0x4c5b("0xcb"));
      }
      return this[_0x4c5b("0xc5")] || (this[_0x4c5b("0xc5")] = {}), this[_0x4c5b("0xc5")]["newListener"] && this[_0x4c5b("0xcc")](_0x4c5b("0xcd"), type, assert(listener[_0x4c5b("0xce")]) ? listener["listener"] : listener), this[_0x4c5b("0xc5")][type] ? triggerListeners_(this[_0x4c5b("0xc5")][type]) ? this[_0x4c5b("0xc5")][type][_0x4c5b("0x7")](listener) : this[_0x4c5b("0xc5")][type] = [this[_0x4c5b("0xc5")][type], listener] : this[_0x4c5b("0xc5")][type] = listener, triggerListeners_(this["_events"][type]) && 
      !this[_0x4c5b("0xc5")][type][_0x4c5b("0xcf")] && (_0x25f6ba = change_btn(this["_maxListeners"]) ? PL$11[_0x4c5b("0xd0")] : this["_maxListeners"]) && 0 < _0x25f6ba && this[_0x4c5b("0xc5")][type]["length"] > _0x25f6ba && (this[_0x4c5b("0xc5")][type][_0x4c5b("0xcf")] = true, console[_0x4c5b("0x47")]("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.", this["_events"][type]["length"]), _0x4c5b("0x0") == typeof console[_0x4c5b("0xd1")] && 
      console[_0x4c5b("0xd1")]()), this;
    };
    PL$11[_0x4c5b("0x10")]["on"] = PL$11[_0x4c5b("0x10")][_0x4c5b("0xca")];
    PL$11[_0x4c5b("0x10")][_0x4c5b("0xd2")] = function(event, f) {
      function update() {
        this[_0x4c5b("0xd3")](event, update);
        if (!_0x5d2533) {
          _0x5d2533 = true;
          f["apply"](this, arguments);
        }
      }
      if (!assert(f)) {
        throw TypeError(_0x4c5b("0xcb"));
      }
      var _0x5d2533 = false;
      return update[_0x4c5b("0xce")] = f, this["on"](event, update), this;
    };
    PL$11[_0x4c5b("0x10")]["removeListener"] = function(type, undefined) {
      var listeners;
      var e;
      var d;
      var i;
      if (!assert(undefined)) {
        throw TypeError("listener must be a function");
      }
      if (!this[_0x4c5b("0xc5")] || !this[_0x4c5b("0xc5")][type]) {
        return this;
      }
      if (d = (listeners = this[_0x4c5b("0xc5")][type])["length"], e = -1, listeners === undefined || assert(listeners[_0x4c5b("0xce")]) && listeners[_0x4c5b("0xce")] === undefined) {
        delete this[_0x4c5b("0xc5")][type];
        if (this[_0x4c5b("0xc5")][_0x4c5b("0xd3")]) {
          this[_0x4c5b("0xcc")](_0x4c5b("0xd3"), type, undefined);
        }
      } else {
        if (triggerListeners_(listeners)) {
          i = d;
          for (; 0 < i--;) {
            if (listeners[i] === undefined || listeners[i]["listener"] && listeners[i][_0x4c5b("0xce")] === undefined) {
              e = i;
              break;
            }
          }
          if (0 > e) {
            return this;
          }
          if (1 === listeners["length"]) {
            listeners["length"] = 0;
            delete this[_0x4c5b("0xc5")][type];
          } else {
            listeners[_0x4c5b("0xd4")](e, 1);
          }
          if (this[_0x4c5b("0xc5")][_0x4c5b("0xd3")]) {
            this[_0x4c5b("0xcc")](_0x4c5b("0xd3"), type, undefined);
          }
        }
      }
      return this;
    };
    PL$11[_0x4c5b("0x10")][_0x4c5b("0xd5")] = function(siteName) {
      var artistTrack;
      var r;
      if (!this[_0x4c5b("0xc5")]) {
        return this;
      }
      if (!this[_0x4c5b("0xc5")]["removeListener"]) {
        return 0 === arguments["length"] ? this[_0x4c5b("0xc5")] = {} : this[_0x4c5b("0xc5")][siteName] && delete this[_0x4c5b("0xc5")][siteName], this;
      }
      if (0 === arguments["length"]) {
        for (artistTrack in this[_0x4c5b("0xc5")]) {
          if (_0x4c5b("0xd3") !== artistTrack) {
            this[_0x4c5b("0xd5")](artistTrack);
          }
        }
        return this["removeAllListeners"](_0x4c5b("0xd3")), this[_0x4c5b("0xc5")] = {}, this;
      }
      if (assert(r = this[_0x4c5b("0xc5")][siteName])) {
        this[_0x4c5b("0xd3")](siteName, r);
      } else {
        if (r) {
          for (; r["length"];) {
            this[_0x4c5b("0xd3")](siteName, r[r["length"] - 1]);
          }
        }
      }
      return delete this[_0x4c5b("0xc5")][siteName], this;
    };
    PL$11[_0x4c5b("0x10")]["listeners"] = function(accountID) {
      return this[_0x4c5b("0xc5")] && this[_0x4c5b("0xc5")][accountID] ? assert(this[_0x4c5b("0xc5")][accountID]) ? [this[_0x4c5b("0xc5")][accountID]] : this[_0x4c5b("0xc5")][accountID][_0x4c5b("0x1b")]() : [];
    };
    PL$11[_0x4c5b("0x10")]["listenerCount"] = function(window_id) {
      if (this[_0x4c5b("0xc5")]) {
        var window = this[_0x4c5b("0xc5")][window_id];
        if (assert(window)) {
          return 1;
        }
        if (window) {
          return window["length"];
        }
      }
      return 0;
    };
    PL$11[_0x4c5b("0xd6")] = function(DeviceMatchers, agentService) {
      return DeviceMatchers[_0x4c5b("0xd6")](agentService);
    };
  }, {}],
  9 : [function(isSlidingUp, dontForceConstraints, canCreateDiscussions) {
    canCreateDiscussions[_0x4c5b("0x78")] = function(result, dataset_, dayMode, count, halfCount) {
      var VLQ_BASE_SHIFT = 8 * halfCount - count - 1;
      var eMax = (1 << VLQ_BASE_SHIFT) - 1;
      var eBias = eMax >> 1;
      var shift = -7;
      var i = dayMode ? halfCount - 1 : 0;
      var stepH = dayMode ? -1 : 1;
      var s = result[dataset_ + i];
      var e;
      var m;
      i = i + stepH;
      e = s & (1 << -shift) - 1;
      s = s >> -shift;
      shift = shift + VLQ_BASE_SHIFT;
      for (; 0 < shift; e = 256 * e + result[dataset_ + i], i = i + stepH, shift = shift - 8) {
      }
      m = e & (1 << -shift) - 1;
      e = e >> -shift;
      shift = shift + count;
      for (; 0 < shift; m = 256 * m + result[dataset_ + i], i = i + stepH, shift = shift - 8) {
      }
      if (0 === e) {
        e = 1 - eBias;
      } else {
        if (e === eMax) {
          return m ? NaN : 1 / 0 * (s ? -1 : 1);
        }
        m = m + Math["pow"](2, count);
        e = e - eBias;
      }
      return (s ? -1 : 1) * m * Math[_0x4c5b("0x70")](2, e - count);
    };
    canCreateDiscussions[_0x4c5b("0x1a")] = function(data, value, x, vertical, mLen, pageX) {
      var eLen = 8 * pageX - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var rt = 23 === mLen ? Math[_0x4c5b("0x70")](2, -24) - Math["pow"](2, -77) : 0;
      var width = vertical ? 0 : pageX - 1;
      var delta = vertical ? 1 : -1;
      var _0x99dc72 = 0 > value || 0 === value && 0 > 1 / value ? 1 : 0;
      var e;
      var m;
      var c;
      value = Math[_0x4c5b("0xd7")](value);
      if (isNaN(value) || value === 1 / 0) {
        m = isNaN(value) ? 1 : 0;
        e = eMax;
      } else {
        e = Math[_0x4c5b("0xd8")](Math["log"](value) / Math[_0x4c5b("0xd9")]);
        if (1 > value * (c = Math[_0x4c5b("0x70")](2, -e))) {
          e--;
          c = c * 2;
        }
        if (2 <= (value = value + (1 <= e + eBias ? rt / c : rt * Math[_0x4c5b("0x70")](2, 1 - eBias))) * c) {
          e++;
          c = c / 2;
        }
        if (e + eBias >= eMax) {
          m = 0;
          e = eMax;
        } else {
          if (1 <= e + eBias) {
            m = (value * c - 1) * Math["pow"](2, mLen);
            e = e + eBias;
          } else {
            m = value * Math["pow"](2, eBias - 1) * Math[_0x4c5b("0x70")](2, mLen);
            e = 0;
          }
        }
      }
      for (; 8 <= mLen; data[x + width] = 255 & m, width = width + delta, m = m / 256, mLen = mLen - 8) {
      }
      e = e << mLen | m;
      eLen = eLen + mLen;
      for (; 0 < eLen; data[x + width] = 255 & e, width = width + delta, e = e / 256, eLen = eLen - 8) {
      }
      data[x + width - delta] |= 128 * _0x99dc72;
    };
  }, {}],
  10 : [function(isSlidingUp, canCreateDiscussions) {
    canCreateDiscussions[_0x4c5b("0x5")] = _0x4c5b("0x0") == typeof Object["create"] ? function(Module, module) {
      Module[_0x4c5b("0xda")] = module;
      Module[_0x4c5b("0x10")] = Object[_0x4c5b("0xdb")](module[_0x4c5b("0x10")], {
        "constructor" : {
          "value" : Module,
          "enumerable" : false,
          "writable" : true,
          "configurable" : true
        }
      });
    } : function(Class, _superclass) {
      Class["super_"] = _superclass;
      var Basic = function() {
      };
      Basic[_0x4c5b("0x10")] = _superclass["prototype"];
      Class["prototype"] = new Basic;
      Class[_0x4c5b("0x10")][_0x4c5b("0xdc")] = Class;
    };
  }, {}],
  11 : [function(isSlidingUp, canCreateDiscussions) {
    function $get(container) {
      return !!container[_0x4c5b("0xdc")] && _0x4c5b("0x0") == typeof container[_0x4c5b("0xdc")][_0x4c5b("0x1c")] && container[_0x4c5b("0xdc")][_0x4c5b("0x1c")](container);
    }
    canCreateDiscussions[_0x4c5b("0x5")] = function(prev) {
      return null != prev && ($get(prev) || "function" == typeof(currentNew = prev)[_0x4c5b("0x77")] && _0x4c5b("0x0") == typeof currentNew[_0x4c5b("0x1b")] && $get(currentNew[_0x4c5b("0x1b")](0, 0)) || !!prev[_0x4c5b("0x59")]);
      var currentNew;
    };
  }, {}],
  12 : [function(canCreateDiscussions, module) {
    var command_codes = {}[_0x4c5b("0x25")];
    module["exports"] = Array[_0x4c5b("0x20")] || function(data) {
      return "[object Array]" == command_codes[_0x4c5b("0x4")](data);
    };
  }, {}],
  13 : [function(saveNotifs, isSlidingUp, window) {
    function callback(data, obj, i, level, offset, total) {
      var b = offset;
      var max = total - offset;
      var t = 0;
      if (data["length"] >= 2113929216) {
        throw new Error(_0x4c5b("0xdd"));
      }
      if (12 < data["length"]) {
        var target = window[_0x4c5b("0xde")](data["length"]);
        if (max < target) {
          throw Error("output too small: " + max + _0x4c5b("0xdf") + target);
        }
        var _0x1fd804 = 67;
        var lengthNew = data["length"] - 12;
        for (; i + 4 < lengthNew;) {
          var cmosValue = data[i + 1] << 8 | data[i];
          var devtype = data[i + 3] << 8 | data[i + 2];
          var currentlevel = Math["imul"](cmosValue | devtype << 16, 2654435761) >>> 16;
          var j = level[currentlevel] - 1;
          if (level[currentlevel] = i + 1, 0 > j || 0 < i - j >>> 16 || (data[j + 3] << 8 | data[j + 2]) != devtype || (data[j + 1] << 8 | data[j]) != cmosValue) {
            i = i + (_0x1fd804++ >> 6);
          } else {
            _0x1fd804 = 67;
            var u = i - t;
            var k = i - j;
            j = j + 4;
            var index = i = i + 4;
            for (; i < lengthNew && data[i] == data[j];) {
              i++;
              j++;
            }
            var idx = 15 > (index = i - index) ? index : 15;
            if (15 <= u) {
              obj[b++] = 240 + idx;
              var du = u - 15;
              for (; 254 < du; du = du - 255) {
                obj[b++] = 255;
              }
              obj[b++] = du;
            } else {
              obj[b++] = (u << 4) + idx;
            }
            var total = 0;
            for (; total < u; total++) {
              obj[b++] = data[t + total];
            }
            if (obj[b++] = k, obj[b++] = k >> 8, 15 <= index) {
              index = index - 15;
              for (; 255 <= index;) {
                index = index - 255;
                obj[b++] = 255;
              }
              obj[b++] = index;
            }
            t = i;
          }
        }
      }
      if (0 == t) {
        return 0;
      }
      if (15 <= (u = data["length"] - t)) {
        obj[b++] = 240;
        var du = u - 15;
        for (; 254 < du; du = du - 255) {
          obj[b++] = 255;
        }
        obj[b++] = du;
      } else {
        obj[b++] = u << 4;
      }
      i = t;
      for (; i < data["length"];) {
        obj[b++] = data[i++];
      }
      return b;
    }
    saveNotifs(_0x4c5b("0xe0"))[_0x4c5b("0xa2")];
    if (!Math[_0x4c5b("0xe1")]) {
      Math["imul"] = function(_segmentMask, valhi) {
        var row = 65535 & _segmentMask;
        var gutterStep = 65535 & valhi;
        return 0 | row * gutterStep + ((_segmentMask >>> 16) * gutterStep + row * (valhi >>> 16) << 16);
      };
    }
    window["uncompress"] = function(array, lines, mean, ref) {
      var l = mean = mean || 0;
      var offset = ref = ref || array["length"] - mean;
      var k = 0;
      for (; l < offset;) {
        var tag = array[l++];
        var id = tag >> 4;
        if (0 < id) {
          var str = id + 240;
          for (; 255 === str;) {
            id = id + (str = array[l++]);
          }
          var j = l + id;
          for (; l < j;) {
            lines[k++] = array[l++];
          }
          if (l === offset) {
            return k;
          }
        }
        var len = array[l++] | array[l++] << 8;
        if (0 == len || len > k) {
          return -(l - 2);
        }
        var d = 15 & tag;
        str = d + 240;
        for (; 255 === str;) {
          d = d + (str = array[l++]);
        }
        var i = k - len;
        j = k + d + 4;
        for (; k < j;) {
          lines[k++] = lines[i++];
        }
      }
      return k;
    };
    window[_0x4c5b("0xde")] = function(canCreateDiscussions) {
      return canCreateDiscussions > 2113929216 ? 0 : 0 | canCreateDiscussions + canCreateDiscussions / 255 + 16;
    };
    window[_0x4c5b("0xe2")] = function(response_2, clients, param, providerClient) {
      var content = Array(65536);
      var GCM_PARAM_PRIORITY = 0;
      for (; 65536 > GCM_PARAM_PRIORITY; GCM_PARAM_PRIORITY++) {
        content[GCM_PARAM_PRIORITY] = 0;
      }
      return callback(response_2, clients, 0, content, param || 0, providerClient || clients["length"]);
    };
    window[_0x4c5b("0xe3")] = window[_0x4c5b("0xe2")];
    window[_0x4c5b("0xe4")] = callback;
  }, {
    "cuint" : 5
  }],
  14 : [function(require, isSlidingUp, canCreateDiscussions) {
    (function(functs) {
      var Parser = require(_0x4c5b("0xe5"));
      canCreateDiscussions[_0x4c5b("0xe6")] = function(input, raw_verwen_zweck) {
        var val = [];
        var p = new Parser(raw_verwen_zweck);
        return p["on"](_0x4c5b("0x21"), function(a) {
          val[_0x4c5b("0x7")](a);
        }), p["end"](input), functs[_0x4c5b("0x56")](val);
      };
    })[_0x4c5b("0x4")](this, require(_0x4c5b("0xe7"))[_0x4c5b("0x1e")]);
  }, {
    "./decoder_stream" : 15,
    "buffer" : 3
  }],
  15 : [function(superfunc, global) {
    (function(HeadingPitchRange) {
      function WMCacheControl(allow) {
        return this instanceof WMCacheControl ? void(end[_0x4c5b("0x4")](this, allow), this[_0x4c5b("0xe8")] = allow || {}, this[_0x4c5b("0xe9")] = this[_0x4c5b("0xe8")]["useJS"] ? startYNew : tiledImageBR, this["buffer"] = null, this[_0x4c5b("0xea")] = 0, this[_0x4c5b("0xeb")] = null, this["state"] = status[_0x4c5b("0xec")], this[_0x4c5b("0xed")] = false, this[_0x4c5b("0xee")] = 0, this[_0x4c5b("0xef")] = null, this[_0x4c5b("0xf0")] = null, this[_0x4c5b("0xf1")] = null, this["dataBlockSize"] = 0, 
        this["skippableSize"] = 0) : new WMCacheControl(allow);
      }
      var end = superfunc(_0x4c5b("0xf2"))["Transform"];
      var coveredByRange = superfunc(_0x4c5b("0xf3"))[_0x4c5b("0xf4")];
      var results = superfunc(_0x4c5b("0xf5"));
      var _related2 = results[_0x4c5b("0xf6")];
      var tiledImageBR = _related2[_0x4c5b("0xf7")];
      var startYNew = superfunc("./binding");
      var status = results[_0x4c5b("0xf8")];
      var regionStr = results[_0x4c5b("0xf9")];
      coveredByRange(WMCacheControl, end);
      WMCacheControl["prototype"]["_transform"] = function(PL$92, canCreateDiscussions, wrongCredsCallback) {
        if (0 < this[_0x4c5b("0xfa")]) {
          if (this[_0x4c5b("0xfa")] -= PL$92["length"], 0 < this[_0x4c5b("0xfa")]) {
            return void wrongCredsCallback();
          }
          PL$92 = PL$92["slice"](-this["skippableSize"]);
          this[_0x4c5b("0xfa")] = 0;
          this[_0x4c5b("0xfb")] = status[_0x4c5b("0xec")];
        }
        this[_0x4c5b("0xe7")] = this[_0x4c5b("0xe7")] ? HeadingPitchRange["concat"]([this[_0x4c5b("0xe7")], PL$92], this[_0x4c5b("0xe7")]["length"] + PL$92["length"]) : PL$92;
        this[_0x4c5b("0xfc")](wrongCredsCallback);
      };
      WMCacheControl[_0x4c5b("0x10")][_0x4c5b("0xfd")] = function(canCreateDiscussions) {
        this[_0x4c5b("0xcc")](_0x4c5b("0x47"), new Error(canCreateDiscussions + " @" + this[_0x4c5b("0xea")]));
      };
      WMCacheControl[_0x4c5b("0x10")][_0x4c5b("0xfe")] = function(count) {
        var num = this[_0x4c5b("0xe7")]["length"] - this[_0x4c5b("0xea")];
        return 0 >= num || num < count ? (this[_0x4c5b("0xed")] && this[_0x4c5b("0xfd")](_0x4c5b("0xff")), true) : (this["pos"] += count, false);
      };
      WMCacheControl[_0x4c5b("0x10")][_0x4c5b("0x100")] = function() {
        var relation = this[_0x4c5b("0xea")];
        if (this[_0x4c5b("0xfe")](regionStr[_0x4c5b("0xec")])) {
          return true;
        }
        var result = _related2[_0x4c5b("0x75")](this[_0x4c5b("0xe7")], relation);
        return (4294967280 & result) === results[_0x4c5b("0x101")] ? void(this[_0x4c5b("0xfb")] = status[_0x4c5b("0x102")]) : result === results[_0x4c5b("0x103")] ? void(this[_0x4c5b("0xfb")] = status[_0x4c5b("0x104")]) : (this[_0x4c5b("0xea")] = relation, this[_0x4c5b("0xfd")](_0x4c5b("0x105") + result["toString"](16)[_0x4c5b("0x106")]()), true);
      };
      WMCacheControl[_0x4c5b("0x10")][_0x4c5b("0x107")] = function() {
        var relationName = this[_0x4c5b("0xea")];
        return !!this["check_Size"](regionStr[_0x4c5b("0x102")]) || void(this[_0x4c5b("0xfb")] = status[_0x4c5b("0x108")], this["skippableSize"] = _related2[_0x4c5b("0x75")](this[_0x4c5b("0xe7")], relationName));
      };
      WMCacheControl[_0x4c5b("0x10")][_0x4c5b("0x109")] = function() {
        var s = this["pos"];
        if (this[_0x4c5b("0xfe")](regionStr[_0x4c5b("0x104")])) {
          return true;
        }
        this[_0x4c5b("0xee")] = s;
        var color = this[_0x4c5b("0xe7")][s];
        var r = color >> 6;
        if (r !== results[_0x4c5b("0x10a")]) {
          return this[_0x4c5b("0xea")] = s, this[_0x4c5b("0xfd")](_0x4c5b("0x10b") + r + _0x4c5b("0x10c") + results[_0x4c5b("0x10a")]), true;
        }
        if (1 & color >> 1) {
          return this["pos"] = s, this[_0x4c5b("0xfd")](_0x4c5b("0x10d")), true;
        }
        var i = 7 & this[_0x4c5b("0xe7")][s + 1] >> 4;
        var quickCommandAction = results[_0x4c5b("0x10e")][i];
        return null === quickCommandAction ? (this[_0x4c5b("0xea")] = s, this[_0x4c5b("0xfd")](_0x4c5b("0x10f") + i), true) : void(this[_0x4c5b("0xeb")] = {
          "blockIndependence" : !!(1 & color >> 5),
          "blockChecksum" : !!(1 & color >> 4),
          "blockMaxSize" : quickCommandAction,
          "streamSize" : !!(1 & color >> 3),
          "streamChecksum" : !!(1 & color >> 2),
          "dict" : !!(1 & color),
          "dictId" : 0
        }, this[_0x4c5b("0xfb")] = status[_0x4c5b("0x110")]);
      };
      WMCacheControl["prototype"][_0x4c5b("0x111")] = function() {
        if (this[_0x4c5b("0xeb")]["streamSize"]) {
          var artistTrack = this[_0x4c5b("0xea")];
          if (this[_0x4c5b("0xfe")](regionStr[_0x4c5b("0x110")])) {
            return true;
          }
          this["streamSize"] = this[_0x4c5b("0xe7")][_0x4c5b("0x1b")](artistTrack, artistTrack + 8);
        }
        this[_0x4c5b("0xfb")] = status["DICTID"];
      };
      WMCacheControl["prototype"][_0x4c5b("0x112")] = function() {
        if (this[_0x4c5b("0xeb")][_0x4c5b("0xf0")]) {
          var relationName = this[_0x4c5b("0xea")];
          if (this["check_Size"](regionStr[_0x4c5b("0x113")])) {
            return true;
          }
          this[_0x4c5b("0xf0")] = _related2["readInt32LE"](this[_0x4c5b("0xe7")], relationName);
        }
        this[_0x4c5b("0xfb")] = status[_0x4c5b("0x114")];
      };
      WMCacheControl[_0x4c5b("0x10")]["read_DescriptorChecksum"] = function() {
        var conditionName = this[_0x4c5b("0xea")];
        if (this["check_Size"](regionStr["DESCRIPTOR_CHECKSUM"])) {
          return true;
        }
        var conditionVariable = this[_0x4c5b("0xe7")][conditionName];
        return _related2[_0x4c5b("0x115")](this[_0x4c5b("0xe7")][_0x4c5b("0x1b")](this[_0x4c5b("0xee")], conditionName)) === conditionVariable ? void(this[_0x4c5b("0xfb")] = status[_0x4c5b("0x116")]) : (this[_0x4c5b("0xea")] = conditionName, this["emit_Error"](_0x4c5b("0x117")), true);
      };
      WMCacheControl["prototype"][_0x4c5b("0x118")] = function() {
        var relation = this[_0x4c5b("0xea")];
        if (this[_0x4c5b("0xfe")](regionStr[_0x4c5b("0x116")])) {
          return true;
        }
        var result = _related2["readInt32LE"](this[_0x4c5b("0xe7")], relation);
        if (result === results[_0x4c5b("0x119")]) {
          this[_0x4c5b("0xfb")] = status[_0x4c5b("0x119")];
        } else {
          this[_0x4c5b("0x11a")] = result;
          this[_0x4c5b("0xfb")] = status[_0x4c5b("0x11b")];
        }
      };
      WMCacheControl[_0x4c5b("0x10")][_0x4c5b("0x11c")] = function() {
        var feyenoord = this[_0x4c5b("0xea")];
        var type = this[_0x4c5b("0x11a")];
        return !(2147483648 & type && (type = type & 2147483647), !this[_0x4c5b("0xfe")](type)) || void(this["dataBlock"] = this["buffer"][_0x4c5b("0x1b")](feyenoord, feyenoord + type), this[_0x4c5b("0xfb")] = status[_0x4c5b("0x11d")]);
      };
      WMCacheControl[_0x4c5b("0x10")][_0x4c5b("0x11e")] = function() {
        var _0x540c6b = this[_0x4c5b("0xea")];
        if (this[_0x4c5b("0xeb")]["blockChecksum"]) {
          if (this[_0x4c5b("0xfe")](regionStr[_0x4c5b("0x11d")])) {
            return true;
          }
          var _0x5cbc7c = _related2[_0x4c5b("0x75")](this["buffer"], this[_0x4c5b("0xea")] - 4);
          if (_related2["blockChecksum"](this["dataBlock"]) !== _0x5cbc7c) {
            return this[_0x4c5b("0xea")] = _0x540c6b, this[_0x4c5b("0xfd")](_0x4c5b("0x11f")), true;
          }
        }
        this[_0x4c5b("0xfb")] = status[_0x4c5b("0x120")];
      };
      WMCacheControl[_0x4c5b("0x10")]["uncompress_DataBlock"] = function() {
        var result;
        if (2147483648 & this["dataBlockSize"]) {
          result = this[_0x4c5b("0x121")];
        } else {
          result = new HeadingPitchRange(this["descriptor"][_0x4c5b("0x122")]);
          var res = this[_0x4c5b("0xe9")][_0x4c5b("0x123")](this[_0x4c5b("0x121")], result);
          if (0 > res) {
            return this[_0x4c5b("0xfd")](_0x4c5b("0x124") + -res), true;
          }
          if (res < this[_0x4c5b("0xeb")][_0x4c5b("0x122")]) {
            result = result[_0x4c5b("0x1b")](0, res);
          }
        }
        this[_0x4c5b("0x121")] = null;
        this[_0x4c5b("0x7")](result);
        if (this["descriptor"]["streamChecksum"]) {
          this[_0x4c5b("0xf1")] = _related2[_0x4c5b("0x125")](result, this[_0x4c5b("0xf1")]);
        }
        this[_0x4c5b("0xfb")] = status[_0x4c5b("0x116")];
      };
      WMCacheControl[_0x4c5b("0x10")][_0x4c5b("0x126")] = function() {
        if (this[_0x4c5b("0xeb")][_0x4c5b("0x125")]) {
          var relation = this["pos"];
          if (this[_0x4c5b("0xfe")](regionStr[_0x4c5b("0x119")])) {
            return true;
          }
          var foreignRelations = _related2["readInt32LE"](this[_0x4c5b("0xe7")], relation);
          if (foreignRelations !== _related2[_0x4c5b("0x125")](null, this[_0x4c5b("0xf1")])) {
            return this[_0x4c5b("0xea")] = relation, this["emit_Error"](_0x4c5b("0x127") + foreignRelations[_0x4c5b("0x25")](16)["toUpperCase"]()), true;
          }
        }
        this[_0x4c5b("0xfb")] = status[_0x4c5b("0xec")];
      };
      WMCacheControl["prototype"][_0x4c5b("0x128")] = function(mmCoreSplitViewBlock) {
        this[_0x4c5b("0xed")] = true;
        this[_0x4c5b("0xfc")](mmCoreSplitViewBlock);
      };
      WMCacheControl[_0x4c5b("0x10")][_0x4c5b("0xfc")] = function(saveNotifs) {
        var _0x5cbc7c = this[_0x4c5b("0xea")];
        var _0x540c6b;
        for (; !_0x540c6b && this[_0x4c5b("0xea")] < this[_0x4c5b("0xe7")]["length"];) {
          if (this[_0x4c5b("0xfb")] === status[_0x4c5b("0xec")]) {
            _0x540c6b = this[_0x4c5b("0x100")]();
          }
          if (this[_0x4c5b("0xfb")] === status[_0x4c5b("0x102")]) {
            _0x540c6b = this[_0x4c5b("0x107")]();
          }
          if (this[_0x4c5b("0xfb")] === status[_0x4c5b("0x104")]) {
            _0x540c6b = this[_0x4c5b("0x109")]();
          }
          if (this[_0x4c5b("0xfb")] === status[_0x4c5b("0x110")]) {
            _0x540c6b = this[_0x4c5b("0x111")]();
          }
          if (this[_0x4c5b("0xfb")] === status[_0x4c5b("0x113")]) {
            _0x540c6b = this[_0x4c5b("0x112")]();
          }
          if (this[_0x4c5b("0xfb")] === status[_0x4c5b("0x114")]) {
            _0x540c6b = this["read_DescriptorChecksum"]();
          }
          if (this[_0x4c5b("0xfb")] === status[_0x4c5b("0x116")]) {
            _0x540c6b = this[_0x4c5b("0x118")]();
          }
          if (this[_0x4c5b("0xfb")] === status[_0x4c5b("0x11b")]) {
            _0x540c6b = this[_0x4c5b("0x11c")]();
          }
          if (this[_0x4c5b("0xfb")] === status[_0x4c5b("0x11d")]) {
            _0x540c6b = this[_0x4c5b("0x11e")]();
          }
          if (this[_0x4c5b("0xfb")] === status[_0x4c5b("0x120")]) {
            _0x540c6b = this[_0x4c5b("0x129")]();
          }
          if (this[_0x4c5b("0xfb")] === status[_0x4c5b("0x119")]) {
            _0x540c6b = this["read_EOS"]();
          }
        }
        if (this[_0x4c5b("0xea")] > _0x5cbc7c) {
          this[_0x4c5b("0xe7")] = this["buffer"][_0x4c5b("0x1b")](this["pos"]);
          this[_0x4c5b("0xea")] = 0;
        }
        saveNotifs();
      };
      global[_0x4c5b("0x5")] = WMCacheControl;
    })[_0x4c5b("0x4")](this, superfunc(_0x4c5b("0xe7"))[_0x4c5b("0x1e")]);
  }, {
    "./binding" : 13,
    "./static" : 19,
    "buffer" : 3,
    "stream" : 37,
    "util" : 42
  }],
  16 : [function(require, isSlidingUp, canCreateDiscussions) {
    (function(B77) {
      var Parser = require(_0x4c5b("0x12a"));
      canCreateDiscussions[_0x4c5b("0x12b")] = function(val, raw_verwen_zweck) {
        var B78 = [];
        var p = new Parser(raw_verwen_zweck);
        return p["on"]("data", function(mmCoreSplitViewBlock) {
          B78[_0x4c5b("0x7")](mmCoreSplitViewBlock);
        }), p[_0x4c5b("0x12c")](val), B77["concat"](B78);
      };
    })[_0x4c5b("0x4")](this, require("buffer")["Buffer"]);
  }, {
    "./encoder_stream" : 17,
    "buffer" : 3
  }],
  17 : [function($, a) {
    (function(Function) {
      function init(fn) {
        if (!(this instanceof init)) {
          return new init(fn);
        }
        methods[_0x4c5b("0x4")](this, fn);
        var attributes = fn || obj;
        if (attributes !== obj) {
          Object[_0x4c5b("0x12d")](obj)[_0x4c5b("0x12e")](function(attribute) {
            if (!attributes["hasOwnProperty"](attribute)) {
              attributes[attribute] = obj[attribute];
            }
          });
        }
        this["options"] = attributes;
        this[_0x4c5b("0xe9")] = this[_0x4c5b("0xe8")]["useJS"] ? $player : helloComponent;
        this[_0x4c5b("0xe2")] = attributes[_0x4c5b("0x12f")] ? this[_0x4c5b("0xe9")][_0x4c5b("0xe3")] : this[_0x4c5b("0xe9")][_0x4c5b("0xe2")];
        var _0x57a3bb = 0;
        _0x57a3bb = _0x57a3bb | pair[_0x4c5b("0x10a")] << 6;
        _0x57a3bb = _0x57a3bb | (1 & attributes[_0x4c5b("0x130")]) << 5;
        _0x57a3bb = _0x57a3bb | (1 & attributes[_0x4c5b("0x131")]) << 4;
        _0x57a3bb = _0x57a3bb | (1 & attributes[_0x4c5b("0xef")]) << 3;
        _0x57a3bb = _0x57a3bb | (1 & attributes[_0x4c5b("0x125")]) << 2;
        _0x57a3bb = _0x57a3bb | 1 & attributes[_0x4c5b("0x132")];
        var _0x48eef2 = pair[_0x4c5b("0x10e")]["indexOf"](attributes[_0x4c5b("0x122")]);
        if (0 > _0x48eef2) {
          throw new Error(_0x4c5b("0x133") + attributes[_0x4c5b("0x122")]);
        }
        this[_0x4c5b("0xeb")] = {
          "flg" : _0x57a3bb,
          "bd" : (7 & _0x48eef2) << 4
        };
        this[_0x4c5b("0xe7")] = [];
        this["length"] = 0;
        this["first"] = true;
        this[_0x4c5b("0x134")] = null;
      }
      var methods = $(_0x4c5b("0xf2"))[_0x4c5b("0x135")];
      var callback = $("util")[_0x4c5b("0xf4")];
      var pair = $(_0x4c5b("0xf5"));
      var window = pair[_0x4c5b("0xf6")];
      var helloComponent = window[_0x4c5b("0xf7")];
      var $player = $(_0x4c5b("0x136"));
      var container = pair[_0x4c5b("0xf8")];
      var args = pair[_0x4c5b("0xf9")];
      var obj = {
        "blockIndependence" : true,
        "blockChecksum" : false,
        "blockMaxSize" : 4194304,
        "streamSize" : false,
        "streamChecksum" : true,
        "dict" : false,
        "dictId" : 0,
        "highCompression" : false
      };
      callback(init, methods);
      init[_0x4c5b("0x10")][_0x4c5b("0x137")] = function() {
        var sitesowners = this[_0x4c5b("0xe8")][_0x4c5b("0xef")] ? args[_0x4c5b("0x104")] : 0;
        var siteName = this[_0x4c5b("0xe8")][_0x4c5b("0x132")] ? args[_0x4c5b("0x113")] : 0;
        return args[_0x4c5b("0xec")] + 1 + 1 + sitesowners + siteName + 1;
      };
      init["prototype"][_0x4c5b("0x138")] = function() {
        var text = this[_0x4c5b("0x137")]();
        var obj = new Function(text);
        this[_0x4c5b("0xfb")] = container[_0x4c5b("0xec")];
        obj[_0x4c5b("0x85")](pair["MAGICNUMBER"], 0, true);
        this[_0x4c5b("0xfb")] = container[_0x4c5b("0x104")];
        var item = obj[_0x4c5b("0x1b")](args["MAGIC"], obj["length"] - 1);
        item[_0x4c5b("0x7c")](this[_0x4c5b("0xeb")]["flg"], 0, true);
        item["writeUInt8"](this[_0x4c5b("0xeb")]["bd"], 1, true);
        var i = 2;
        return this[_0x4c5b("0xfb")] = container["SIZE"], this[_0x4c5b("0xe8")][_0x4c5b("0xef")] && (item[_0x4c5b("0x85")](0, i, true), item[_0x4c5b("0x85")](this["size"], i + 4, true), i = i + args[_0x4c5b("0x110")]), this[_0x4c5b("0xfb")] = container[_0x4c5b("0x113")], this["options"][_0x4c5b("0x132")] && (item[_0x4c5b("0x85")](this["dictId"], i, true), i = i + args[_0x4c5b("0x113")]), this[_0x4c5b("0xfb")] = container["DESCRIPTOR_CHECKSUM"], obj[_0x4c5b("0x7c")](window[_0x4c5b("0x115")](item), 
        args[_0x4c5b("0xec")] + i, false), obj;
      };
      init["prototype"][_0x4c5b("0x13a")] = function(axsPath) {
        this[_0x4c5b("0xfb")] = container[_0x4c5b("0x13b")];
        if (this["options"][_0x4c5b("0x125")]) {
          this[_0x4c5b("0x134")] = window[_0x4c5b("0x125")](axsPath, this[_0x4c5b("0x134")]);
        }
      };
      init[_0x4c5b("0x10")][_0x4c5b("0x13c")] = function(obj) {
        this[_0x4c5b("0xfb")] = container["DATABLOCK_COMPRESS"];
        var t = this[_0x4c5b("0xe8")]["blockChecksum"] ? args[_0x4c5b("0x11d")] : 0;
        var s = this[_0x4c5b("0xe9")][_0x4c5b("0xde")](obj["length"]);
        var ctx = new Function(args[_0x4c5b("0x116")] + s + t);
        var e = ctx[_0x4c5b("0x1b")](args[_0x4c5b("0x116")], args[_0x4c5b("0x116")] + s);
        var x = this[_0x4c5b("0xe2")](obj, e);
        return (this[_0x4c5b("0xfb")] = container["DATABLOCK_SIZE"], 0 < x && x <= this[_0x4c5b("0xe8")][_0x4c5b("0x122")] ? (ctx["writeUInt32LE"](x, 0, true), ctx = ctx[_0x4c5b("0x1b")](0, args[_0x4c5b("0x116")] + x + t)) : (ctx[_0x4c5b("0x85")](2147483648 | obj["length"], 0, true), ctx = ctx[_0x4c5b("0x1b")](0, args["DATABLOCK_SIZE"] + obj["length"] + t), obj[_0x4c5b("0x1d")](ctx, args[_0x4c5b("0x116")])), this["state"] = container["DATABLOCK_CHECKSUM"], this[_0x4c5b("0xe8")][_0x4c5b("0x131")]) && 
        ctx[_0x4c5b("0x1b")](-t)["writeInt32LE"](window[_0x4c5b("0x131")](e), 0, true), this[_0x4c5b("0x13a")](obj), this["size"] += obj["length"], ctx;
      };
      init["prototype"][_0x4c5b("0x13d")] = function(mmCoreSplitViewBlock, canCreateDiscussions, saveNotifs) {
        if (mmCoreSplitViewBlock) {
          this[_0x4c5b("0xe7")][_0x4c5b("0x7")](mmCoreSplitViewBlock);
          this["length"] += mmCoreSplitViewBlock["length"];
        }
        if (this[_0x4c5b("0x13e")]) {
          this[_0x4c5b("0x7")](this[_0x4c5b("0x138")]());
          this[_0x4c5b("0x13e")] = false;
        }
        var den_rate = this[_0x4c5b("0xe8")][_0x4c5b("0x122")];
        if (this["length"] < den_rate) {
          return saveNotifs();
        }
        var array = Function[_0x4c5b("0x56")](this[_0x4c5b("0xe7")], this["length"]);
        var i = 0;
        var samp_frac_num = array["length"];
        for (; samp_frac_num >= den_rate; samp_frac_num = samp_frac_num - den_rate, i = i + den_rate) {
          this["push"](this[_0x4c5b("0x13c")](array[_0x4c5b("0x1b")](i, i + den_rate)));
        }
        if (0 < samp_frac_num) {
          this[_0x4c5b("0xe7")] = [array[_0x4c5b("0x1b")](i)];
          this["length"] = this[_0x4c5b("0xe7")][0]["length"];
        } else {
          this["buffer"] = [];
          this["length"] = 0;
        }
        saveNotifs();
      };
      init[_0x4c5b("0x10")]["_flush"] = function(saveNotifs) {
        if (this[_0x4c5b("0x13e")] && (this[_0x4c5b("0x7")](this[_0x4c5b("0x138")]()), this[_0x4c5b("0x13e")] = false), 0 < this["length"]) {
          var button2 = Function[_0x4c5b("0x56")](this[_0x4c5b("0xe7")], this["length"]);
          this[_0x4c5b("0xe7")] = [];
          this["length"] = 0;
          var button2Component = this[_0x4c5b("0x13c")](button2);
          this[_0x4c5b("0x7")](button2Component);
        }
        if (this[_0x4c5b("0xe8")][_0x4c5b("0x125")]) {
          this[_0x4c5b("0xfb")] = container[_0x4c5b("0x13f")];
          (get_data = new Function(args[_0x4c5b("0x119")] + args[_0x4c5b("0x13f")]))[_0x4c5b("0x85")](window[_0x4c5b("0x125")](null, this[_0x4c5b("0x134")]), args[_0x4c5b("0x119")], true);
        } else {
          var get_data = new Function(args[_0x4c5b("0x119")]);
        }
        this[_0x4c5b("0xfb")] = container[_0x4c5b("0x119")];
        get_data[_0x4c5b("0x85")](pair[_0x4c5b("0x119")], 0, true);
        this[_0x4c5b("0x7")](get_data);
        saveNotifs();
      };
      a[_0x4c5b("0x5")] = init;
    })[_0x4c5b("0x4")](this, $(_0x4c5b("0xe7"))[_0x4c5b("0x1e")]);
  }, {
    "./binding" : 13,
    "./static" : 19,
    "buffer" : 3,
    "stream" : 37,
    "util" : 42
  }],
  18 : [function(make, module) {
    module["exports"] = make("./static");
    module[_0x4c5b("0x5")][_0x4c5b("0x140")] = _0x4c5b("0x141");
    module["exports"]["createDecoderStream"] = make(_0x4c5b("0xe5"));
    module["exports"][_0x4c5b("0x142")] = make(_0x4c5b("0x143"))[_0x4c5b("0xe6")];
    module[_0x4c5b("0x5")][_0x4c5b("0x144")] = make(_0x4c5b("0x12a"));
    module[_0x4c5b("0x5")]["encode"] = make(_0x4c5b("0x145"))[_0x4c5b("0x12b")];
    var _0x5bbe1f = module[_0x4c5b("0x5")][_0x4c5b("0xf6")][_0x4c5b("0xf7")];
    module["exports"]["decodeBlock"] = _0x5bbe1f[_0x4c5b("0x123")];
    module["exports"][_0x4c5b("0x146")] = _0x5bbe1f[_0x4c5b("0xde")];
    module[_0x4c5b("0x5")][_0x4c5b("0x147")] = _0x5bbe1f[_0x4c5b("0xe2")];
    module["exports"]["encodeBlockHC"] = _0x5bbe1f["compressHC"];
  }, {
    "./decoder" : 14,
    "./decoder_stream" : 15,
    "./encoder" : 16,
    "./encoder_stream" : 17,
    "./static" : 19
  }],
  19 : [function(saveNotifs, canCreateDiscussions, TokenType) {
    (function(canCreateDiscussions) {
      TokenType[_0x4c5b("0x103")] = 407708164;
      TokenType[_0x4c5b("0x148")] = new canCreateDiscussions(4);
      TokenType[_0x4c5b("0x148")][_0x4c5b("0x7e")](TokenType[_0x4c5b("0x103")], 0, false);
      TokenType[_0x4c5b("0x119")] = 0;
      TokenType[_0x4c5b("0x149")] = new canCreateDiscussions(4);
      TokenType[_0x4c5b("0x149")][_0x4c5b("0x7e")](TokenType["EOS"], 0, false);
      TokenType[_0x4c5b("0x10a")] = 1;
      TokenType[_0x4c5b("0x101")] = 407710288;
      TokenType[_0x4c5b("0x10e")] = [null, null, null, null, 65536, 262144, 1048576, 4194304];
      TokenType[_0x4c5b("0x14a")] = _0x4c5b("0x14b");
      TokenType[_0x4c5b("0xf8")] = {
        "MAGIC" : 0,
        "DESCRIPTOR" : 1,
        "SIZE" : 2,
        "DICTID" : 3,
        "DESCRIPTOR_CHECKSUM" : 4,
        "DATABLOCK_SIZE" : 5,
        "DATABLOCK_DATA" : 6,
        "DATABLOCK_CHECKSUM" : 7,
        "DATABLOCK_UNCOMPRESS" : 8,
        "DATABLOCK_COMPRESS" : 9,
        "CHECKSUM" : 10,
        "CHECKSUM_UPDATE" : 11,
        "EOS" : 90,
        "SKIP_SIZE" : 101,
        "SKIP_DATA" : 102
      };
      TokenType[_0x4c5b("0xf9")] = {
        "MAGIC" : 4,
        "DESCRIPTOR" : 2,
        "SIZE" : 8,
        "DICTID" : 4,
        "DESCRIPTOR_CHECKSUM" : 1,
        "DATABLOCK_SIZE" : 4,
        "DATABLOCK_CHECKSUM" : 4,
        "CHECKSUM" : 4,
        "EOS" : 4,
        "SKIP_SIZE" : 4
      };
      TokenType[_0x4c5b("0xf6")] = saveNotifs(_0x4c5b("0x14c"));
    })[_0x4c5b("0x4")](this, saveNotifs(_0x4c5b("0xe7"))[_0x4c5b("0x1e")]);
  }, {
    "./utils" : 20,
    "buffer" : 3
  }],
  20 : [function(require, isSlidingUp, tasks) {
    var btoa = require(_0x4c5b("0x14d"));
    tasks[_0x4c5b("0x115")] = function(val) {
      return 255 & btoa(val, 0)["toNumber"]() >> 8;
    };
    tasks[_0x4c5b("0x131")] = function(data) {
      return btoa(data, 0)[_0x4c5b("0xab")]();
    };
    tasks[_0x4c5b("0x125")] = function(previousError, res) {
      return null === previousError ? res[_0x4c5b("0x14e")]()[_0x4c5b("0xab")]() : (null === res && (res = btoa(0)), res[_0x4c5b("0x14f")](previousError));
    };
    tasks[_0x4c5b("0x75")] = function(input_8_bit_int_buffer, index) {
      return input_8_bit_int_buffer[index] | input_8_bit_int_buffer[index + 1] << 8 | input_8_bit_int_buffer[index + 2] << 16 | input_8_bit_int_buffer[index + 3] << 24;
    };
    tasks[_0x4c5b("0xf7")] = require("./binding");
  }, {
    "./binding" : 13,
    "xxhashjs" : 46
  }],
  21 : [function(require, canCreateDiscussions) {
    (function(new_dbm) {
      canCreateDiscussions[_0x4c5b("0x5")] = new_dbm[_0x4c5b("0x140")] && 0 !== new_dbm[_0x4c5b("0x140")][_0x4c5b("0x2d")]("v0.") && (0 !== new_dbm[_0x4c5b("0x140")]["indexOf"]("v1.") || 0 === new_dbm["version"]["indexOf"](_0x4c5b("0x150"))) ? new_dbm[_0x4c5b("0x151")] : function(PL$22, PL$21, PL$6, PL$18) {
        if (_0x4c5b("0x0") != typeof PL$22) {
          throw new TypeError('"callback" argument must be a function');
        }
        var length = arguments["length"];
        var parts;
        var j;
        switch(length) {
          case 0:
          case 1:
            return new_dbm[_0x4c5b("0x151")](PL$22);
          case 2:
            return new_dbm[_0x4c5b("0x151")](function() {
              PL$22[_0x4c5b("0x4")](null, PL$21);
            });
          case 3:
            return new_dbm[_0x4c5b("0x151")](function() {
              PL$22[_0x4c5b("0x4")](null, PL$21, PL$6);
            });
          case 4:
            return new_dbm[_0x4c5b("0x151")](function() {
              PL$22["call"](null, PL$21, PL$6, PL$18);
            });
          default:
            parts = Array(length - 1);
            j = 0;
            for (; j < parts["length"];) {
              parts[j++] = arguments[j];
            }
            return new_dbm[_0x4c5b("0x151")](function() {
              PL$22[_0x4c5b("0x36")](null, parts);
            });
        }
      };
    })[_0x4c5b("0x4")](this, require("_process"));
  }, {
    "_process" : 22
  }],
  22 : [function(isSlidingUp, canCreateDiscussions) {
    function defaultSetTimout() {
      throw new Error("setTimeout has not been defined");
    }
    function defaultClearTimeout() {
      throw new Error(_0x4c5b("0x152"));
    }
    function maybeDefer(fn) {
      if (cachedSetTimeout === setTimeout) {
        return setTimeout(fn, 0);
      }
      if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        return cachedSetTimeout = setTimeout, setTimeout(fn, 0);
      }
      try {
        return cachedSetTimeout(fn, 0);
      } catch (_0x10edcf) {
        try {
          return cachedSetTimeout[_0x4c5b("0x4")](null, fn, 0);
        } catch (_0x2963ac) {
          return cachedSetTimeout[_0x4c5b("0x4")](this, fn, 0);
        }
      }
    }
    function closeMessage() {
      if (reverseIsSingle && cache) {
        reverseIsSingle = false;
        if (cache["length"]) {
          data = cache[_0x4c5b("0x56")](data);
        } else {
          url_old = -1;
        }
        if (data["length"]) {
          close();
        }
      }
    }
    function close() {
      if (!reverseIsSingle) {
        var lastSelectedMarker = maybeDefer(closeMessage);
        reverseIsSingle = true;
        var total_rows = data["length"];
        for (; total_rows;) {
          cache = data;
          data = [];
          for (; ++url_old < total_rows;) {
            if (cache) {
              cache[url_old]["run"]();
            }
          }
          url_old = -1;
          total_rows = data["length"];
        }
        cache = null;
        reverseIsSingle = false;
        (function(marker) {
          if (cachedClearTimeout === clearTimeout) {
            return clearTimeout(marker);
          }
          if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
            return cachedClearTimeout = clearTimeout, clearTimeout(marker);
          }
          try {
            cachedClearTimeout(marker);
          } catch (_0x24489a) {
            try {
              return cachedClearTimeout[_0x4c5b("0x4")](null, marker);
            } catch (_0xee7ec9) {
              return cachedClearTimeout[_0x4c5b("0x4")](this, marker);
            }
          }
        })(lastSelectedMarker);
      }
    }
    function Test(testName, module) {
      this[_0x4c5b("0x153")] = testName;
      this[_0x4c5b("0x154")] = module;
    }
    function value() {
    }
    var p = canCreateDiscussions[_0x4c5b("0x5")] = {};
    var cachedSetTimeout;
    var cachedClearTimeout;
    !function() {
      try {
        cachedSetTimeout = _0x4c5b("0x0") == typeof setTimeout ? setTimeout : defaultSetTimout;
      } catch (_0x5d77b2) {
        cachedSetTimeout = defaultSetTimout;
      }
      try {
        cachedClearTimeout = _0x4c5b("0x0") == typeof clearTimeout ? clearTimeout : defaultClearTimeout;
      } catch (_0x3be504) {
        cachedClearTimeout = defaultClearTimeout;
      }
    }();
    var data = [];
    var reverseIsSingle = false;
    var url_old = -1;
    var cache;
    p[_0x4c5b("0x151")] = function(name) {
      var f = Array(arguments["length"] - 1);
      if (1 < arguments["length"]) {
        var i = 1;
        for (; i < arguments["length"]; i++) {
          f[i - 1] = arguments[i];
        }
      }
      data[_0x4c5b("0x7")](new Test(name, f));
      if (!(1 !== data["length"] || reverseIsSingle)) {
        maybeDefer(close);
      }
    };
    Test[_0x4c5b("0x10")]["run"] = function() {
      this[_0x4c5b("0x153")][_0x4c5b("0x36")](null, this[_0x4c5b("0x154")]);
    };
    p[_0x4c5b("0x155")] = _0x4c5b("0x156");
    p[_0x4c5b("0x156")] = true;
    p[_0x4c5b("0x157")] = {};
    p[_0x4c5b("0x158")] = [];
    p[_0x4c5b("0x140")] = "";
    p[_0x4c5b("0x159")] = {};
    p["on"] = value;
    p["addListener"] = value;
    p[_0x4c5b("0xd2")] = value;
    p[_0x4c5b("0x15a")] = value;
    p[_0x4c5b("0xd3")] = value;
    p[_0x4c5b("0xd5")] = value;
    p[_0x4c5b("0xcc")] = value;
    p[_0x4c5b("0x15b")] = value;
    p["prependOnceListener"] = value;
    p["listeners"] = function() {
      return [];
    };
    p["binding"] = function() {
      throw new Error(_0x4c5b("0x15c"));
    };
    p[_0x4c5b("0x15d")] = function() {
      return "/";
    };
    p[_0x4c5b("0x15e")] = function() {
      throw new Error(_0x4c5b("0x15f"));
    };
    p[_0x4c5b("0x160")] = function() {
      return 0;
    };
  }, {}],
  23 : [function(require, tasks) {
    tasks[_0x4c5b("0x5")] = require(_0x4c5b("0x161"));
  }, {
    "./lib/_stream_duplex.js" : 24
  }],
  24 : [function(require, event) {
    function self(obj) {
      return this instanceof self ? void(rule[_0x4c5b("0x4")](this, obj), db[_0x4c5b("0x4")](this, obj), obj && false === obj[_0x4c5b("0x162")] && (this[_0x4c5b("0x162")] = false), obj && false === obj["writable"] && (this[_0x4c5b("0x163")] = false), this[_0x4c5b("0x164")] = true, obj && false === obj[_0x4c5b("0x164")] && (this[_0x4c5b("0x164")] = false), this[_0x4c5b("0xd2")](_0x4c5b("0x12c"), checkKey)) : new self(obj);
    }
    function checkKey() {
      if (!(this["allowHalfOpen"] || this[_0x4c5b("0x165")][_0x4c5b("0x166")])) {
        EffectChain(VislibLibAxisConfigProvider, this);
      }
    }
    function VislibLibAxisConfigProvider(PL$16) {
      PL$16["end"]();
    }
    var EffectChain = require(_0x4c5b("0x167"));
    var PL$8 = Object[_0x4c5b("0x12d")] || function(nodeProperties) {
      var inlinedFunctions = [];
      var node;
      for (node in nodeProperties) {
        inlinedFunctions[_0x4c5b("0x7")](node);
      }
      return inlinedFunctions;
    };
    event[_0x4c5b("0x5")] = self;
    var plugins = require("core-util-is");
    plugins[_0x4c5b("0xf4")] = require("inherits");
    var rule = require("./_stream_readable");
    var db = require(_0x4c5b("0x168"));
    plugins[_0x4c5b("0xf4")](self, rule);
    var PL$13 = PL$8(db[_0x4c5b("0x10")]);
    var PL$17 = 0;
    var name;
    for (; PL$17 < PL$13["length"]; PL$17++) {
      name = PL$13[PL$17];
      if (!self[_0x4c5b("0x10")][name]) {
        self[_0x4c5b("0x10")][name] = db[_0x4c5b("0x10")][name];
      }
    }
    Object[_0x4c5b("0x4b")](self[_0x4c5b("0x10")], "destroyed", {
      "get" : function() {
        return void 0 !== this["_readableState"] && void 0 !== this[_0x4c5b("0x165")] && this[_0x4c5b("0x169")][_0x4c5b("0x16a")] && this[_0x4c5b("0x165")][_0x4c5b("0x16a")];
      },
      "set" : function(mymuted) {
        if (void 0 !== this["_readableState"] && void 0 !== this[_0x4c5b("0x165")]) {
          this[_0x4c5b("0x169")][_0x4c5b("0x16a")] = mymuted;
          this[_0x4c5b("0x165")][_0x4c5b("0x16a")] = mymuted;
        }
      }
    });
    self[_0x4c5b("0x10")][_0x4c5b("0x16b")] = function(renderer, mmCoreSplitViewBlock) {
      this[_0x4c5b("0x7")](null);
      this[_0x4c5b("0x12c")]();
      EffectChain(mmCoreSplitViewBlock, renderer);
    };
  }, {
    "./_stream_readable" : 26,
    "./_stream_writable" : 28,
    "core-util-is" : 4,
    "inherits" : 10,
    "process-nextick-args" : 21
  }],
  25 : [function(require, modstatus) {
    function ImagesZoom(params) {
      return this instanceof ImagesZoom ? void options["call"](this, params) : new ImagesZoom(params);
    }
    modstatus[_0x4c5b("0x5")] = ImagesZoom;
    var options = require(_0x4c5b("0x16c"));
    var tasks = require(_0x4c5b("0x16d"));
    tasks[_0x4c5b("0xf4")] = require(_0x4c5b("0xf4"));
    tasks[_0x4c5b("0xf4")](ImagesZoom, options);
    ImagesZoom["prototype"][_0x4c5b("0x13d")] = function(step, canCreateDiscussions, commentFunction) {
      commentFunction(null, step);
    };
  }, {
    "./_stream_transform" : 27,
    "core-util-is" : 4,
    "inherits" : 10
  }],
  26 : [function(require, module) {
    (function(dst, isSlidingUp) {
      function init(options, callback) {
        PGQueryStream = PGQueryStream || require(_0x4c5b("0x16e"));
        options = options || {};
        this[_0x4c5b("0x16f")] = !!options[_0x4c5b("0x16f")];
        if (callback instanceof PGQueryStream) {
          this[_0x4c5b("0x16f")] = this[_0x4c5b("0x16f")] || !!options["readableObjectMode"];
        }
        var latinCharacter = options[_0x4c5b("0x170")];
        var character = this[_0x4c5b("0x16f")] ? 16 : 16384;
        this[_0x4c5b("0x170")] = latinCharacter || 0 === latinCharacter ? latinCharacter : character;
        this[_0x4c5b("0x170")] = Math[_0x4c5b("0xd8")](this[_0x4c5b("0x170")]);
        this["buffer"] = new Duplicity;
        this["length"] = 0;
        this[_0x4c5b("0x171")] = null;
        this["pipesCount"] = 0;
        this["flowing"] = null;
        this["ended"] = false;
        this["endEmitted"] = false;
        this[_0x4c5b("0x172")] = false;
        this["sync"] = true;
        this[_0x4c5b("0x173")] = false;
        this[_0x4c5b("0x174")] = false;
        this[_0x4c5b("0x175")] = false;
        this[_0x4c5b("0x176")] = false;
        this["destroyed"] = false;
        this[_0x4c5b("0x177")] = options[_0x4c5b("0x177")] || _0x4c5b("0x17");
        this["awaitDrain"] = 0;
        this[_0x4c5b("0x178")] = false;
        this[_0x4c5b("0x179")] = null;
        this[_0x4c5b("0x17a")] = null;
        if (options[_0x4c5b("0x17a")]) {
          if (!type) {
            type = require(_0x4c5b("0x17b"))[_0x4c5b("0x17c")];
          }
          this[_0x4c5b("0x179")] = new type(options[_0x4c5b("0x17a")]);
          this[_0x4c5b("0x17a")] = options["encoding"];
        }
      }
      function WMCacheControl(allow) {
        return (PGQueryStream = PGQueryStream || require(_0x4c5b("0x16e")), !(this instanceof WMCacheControl)) ? new WMCacheControl(allow) : void(this[_0x4c5b("0x169")] = new init(allow, this), this[_0x4c5b("0x162")] = true, allow && (_0x4c5b("0x0") == typeof allow["read"] && (this[_0x4c5b("0x17d")] = allow[_0x4c5b("0x78")]), _0x4c5b("0x0") == typeof allow[_0x4c5b("0x17e")] && (this[_0x4c5b("0x16b")] = allow[_0x4c5b("0x17e")])), ms[_0x4c5b("0x4")](this));
      }
      function build(item, obj, array, id, replace) {
        var context = item["_readableState"];
        var fn;
        var data;
        var map;
        return null === obj ? (context[_0x4c5b("0x172")] = false, function(window, self) {
          if (!self["ended"]) {
            if (self[_0x4c5b("0x179")]) {
              var script = self[_0x4c5b("0x179")][_0x4c5b("0x12c")]();
              if (script && script["length"]) {
                self[_0x4c5b("0xe7")][_0x4c5b("0x7")](script);
                self["length"] += self["objectMode"] ? 1 : script["length"];
              }
            }
            self[_0x4c5b("0x166")] = true;
            on(window);
          }
        }(item, context)) : (replace || (fn = function(selector, target) {
          var error;
          data = target;
          if (!(args[_0x4c5b("0x1c")](data) || data instanceof Stream || "string" == typeof target || void 0 === target || selector[_0x4c5b("0x16f")])) {
            error = new TypeError(_0x4c5b("0x17f"));
          }
          var data;
          return error;
        }(context, obj)), fn ? item[_0x4c5b("0xcc")](_0x4c5b("0x47"), fn) : context[_0x4c5b("0x16f")] || obj && 0 < obj["length"] ? (_0x4c5b("0x12") == typeof obj || context[_0x4c5b("0x16f")] || Object["getPrototypeOf"](obj) === args["prototype"] || (data = obj, obj = args[_0x4c5b("0x4d")](data)), id ? context[_0x4c5b("0x180")] ? item[_0x4c5b("0xcc")](_0x4c5b("0x47"), new Error(_0x4c5b("0x181"))) : next(item, context, obj, true) : context[_0x4c5b("0x166")] ? item[_0x4c5b("0xcc")](_0x4c5b("0x47"), 
        new Error(_0x4c5b("0x182"))) : (context[_0x4c5b("0x172")] = false, context[_0x4c5b("0x179")] && !array ? (obj = context["decoder"][_0x4c5b("0x1a")](obj), context[_0x4c5b("0x16f")] || 0 !== obj["length"] ? next(item, context, obj, false) : emit(item, context)) : next(item, context, obj, false))) : id || (context[_0x4c5b("0x172")] = false)), !(map = context)["ended"] && (map["needReadable"] || map["length"] < map[_0x4c5b("0x170")] || 0 === map["length"]);
      }
      function next(self, data, args, resume) {
        if (data[_0x4c5b("0x183")] && 0 === data["length"] && !data["sync"]) {
          self["emit"](_0x4c5b("0x21"), args);
          self[_0x4c5b("0x78")](0);
        } else {
          data["length"] += data[_0x4c5b("0x16f")] ? 1 : args["length"];
          if (resume) {
            data["buffer"][_0x4c5b("0x184")](args);
          } else {
            data[_0x4c5b("0xe7")][_0x4c5b("0x7")](args);
          }
          if (data["needReadable"]) {
            on(self);
          }
        }
        emit(self, data);
      }
      function normalize(a, r) {
        return 0 >= a || 0 === r["length"] && r[_0x4c5b("0x166")] ? 0 : r[_0x4c5b("0x16f")] ? 1 : a == a ? (a > r[_0x4c5b("0x170")] && (r[_0x4c5b("0x170")] = ((_x$2 = a) >= 8388608 ? _x$2 = 8388608 : (_x$2--, _x$2 = _x$2 | _x$2 >>> 1, _x$2 = _x$2 | _x$2 >>> 2, _x$2 = _x$2 | _x$2 >>> 4, _x$2 = _x$2 | _x$2 >>> 8, _x$2 = _x$2 | _x$2 >>> 16, _x$2++), _x$2)), a <= r["length"] ? a : r[_0x4c5b("0x166")] ? r["length"] : (r[_0x4c5b("0x173")] = true, 0)) : r[_0x4c5b("0x183")] && r["length"] ? 
        r[_0x4c5b("0xe7")][_0x4c5b("0x185")][_0x4c5b("0x21")]["length"] : r["length"];
        var _x$2;
      }
      function on(context) {
        var data = context["_readableState"];
        data[_0x4c5b("0x173")] = false;
        if (!data[_0x4c5b("0x174")]) {
          debug(_0x4c5b("0x186"), data["flowing"]);
          data[_0x4c5b("0x174")] = true;
          if (data[_0x4c5b("0x187")]) {
            fn(select, context);
          } else {
            select(context);
          }
        }
      }
      function select(options) {
        debug(_0x4c5b("0x188"));
        options[_0x4c5b("0xcc")](_0x4c5b("0x162"));
        stripLocalOptions(options);
      }
      function emit(obj, a) {
        if (!a[_0x4c5b("0x178")]) {
          a[_0x4c5b("0x178")] = true;
          fn(serverFile, obj, a);
        }
      }
      function serverFile(callback, cursor) {
        var leftward = cursor["length"];
        for (; !cursor[_0x4c5b("0x172")] && !cursor[_0x4c5b("0x183")] && !cursor[_0x4c5b("0x166")] && cursor["length"] < cursor["highWaterMark"] && (debug("maybeReadMore read 0"), callback[_0x4c5b("0x78")](0), leftward !== cursor["length"]);) {
          leftward = cursor["length"];
        }
        cursor["readingMore"] = false;
      }
      function update_services(result) {
        debug(_0x4c5b("0x189"));
        result["read"](0);
      }
      function load(options, section) {
        if (!section[_0x4c5b("0x172")]) {
          debug(_0x4c5b("0x18a"));
          options[_0x4c5b("0x78")](0);
        }
        section[_0x4c5b("0x176")] = false;
        section[_0x4c5b("0x18b")] = 0;
        options[_0x4c5b("0xcc")](_0x4c5b("0x18c"));
        stripLocalOptions(options);
        if (section["flowing"] && !section["reading"]) {
          options[_0x4c5b("0x78")](0);
        }
      }
      function stripLocalOptions(options) {
        var types = options[_0x4c5b("0x169")];
        debug(_0x4c5b("0x18d"), types[_0x4c5b("0x183")]);
        for (; types["flowing"] && null !== options["read"]();) {
        }
      }
      function check(val, args) {
        return 0 === args["length"] ? null : (args["objectMode"] ? nextZoom = args[_0x4c5b("0xe7")][_0x4c5b("0x18e")]() : !val || val >= args["length"] ? (nextZoom = args[_0x4c5b("0x179")] ? args[_0x4c5b("0xe7")]["join"]("") : 1 === args[_0x4c5b("0xe7")]["length"] ? args[_0x4c5b("0xe7")][_0x4c5b("0x185")][_0x4c5b("0x21")] : args["buffer"]["concat"](args["length"]), args[_0x4c5b("0xe7")]["clear"]()) : nextZoom = function(a, b, globUseGlobalStorage) {
          var g;
          return a < b["head"]["data"]["length"] ? (g = b[_0x4c5b("0x185")][_0x4c5b("0x21")][_0x4c5b("0x1b")](0, a), b[_0x4c5b("0x185")]["data"] = b[_0x4c5b("0x185")][_0x4c5b("0x21")][_0x4c5b("0x1b")](a)) : g = a === b[_0x4c5b("0x185")][_0x4c5b("0x21")]["length"] ? b[_0x4c5b("0x18e")]() : globUseGlobalStorage ? function(result, args) {
            var el = args[_0x4c5b("0x185")];
            var overflow = 1;
            var od = el[_0x4c5b("0x21")];
            result = result - od["length"];
            for (; el = el[_0x4c5b("0x18f")];) {
              var o = el[_0x4c5b("0x21")];
              var value = result > o["length"] ? o["length"] : result;
              if (od = od + (value === o["length"] ? o : o[_0x4c5b("0x1b")](0, result)), 0 === (result = result - value)) {
                if (value === o["length"]) {
                  ++overflow;
                  args[_0x4c5b("0x185")] = el["next"] ? el[_0x4c5b("0x18f")] : args[_0x4c5b("0x190")] = null;
                } else {
                  args[_0x4c5b("0x185")] = el;
                  el[_0x4c5b("0x21")] = o[_0x4c5b("0x1b")](value);
                }
                break;
              }
              ++overflow;
            }
            return args["length"] -= overflow, od;
          }(a, b) : function(start, object) {
            var next = args[_0x4c5b("0x58")](start);
            var result = object[_0x4c5b("0x185")];
            var amount = 1;
            result["data"]["copy"](next);
            start = start - result[_0x4c5b("0x21")]["length"];
            for (; result = result["next"];) {
              var range = result[_0x4c5b("0x21")];
              var end = start > range["length"] ? range["length"] : start;
              if (range[_0x4c5b("0x1d")](next, next["length"] - start, 0, end), 0 === (start = start - end)) {
                if (end === range["length"]) {
                  ++amount;
                  object[_0x4c5b("0x185")] = result[_0x4c5b("0x18f")] ? result[_0x4c5b("0x18f")] : object[_0x4c5b("0x190")] = null;
                } else {
                  object[_0x4c5b("0x185")] = result;
                  result[_0x4c5b("0x21")] = range[_0x4c5b("0x1b")](end);
                }
                break;
              }
              ++amount;
            }
            return object["length"] -= amount, next;
          }(a, b), g;
        }(val, args[_0x4c5b("0xe7")], args[_0x4c5b("0x179")]), nextZoom);
        var nextZoom;
      }
      function preload(args) {
        var self = args[_0x4c5b("0x169")];
        if (0 < self["length"]) {
          throw new Error('"endReadable()" called on non-empty stream');
        }
        if (!self[_0x4c5b("0x180")]) {
          self["ended"] = true;
          fn(start, self, args);
        }
      }
      function start(context, target) {
        if (!(context[_0x4c5b("0x180")] || 0 !== context["length"])) {
          context[_0x4c5b("0x180")] = true;
          target["readable"] = false;
          target["emit"](_0x4c5b("0x12c"));
        }
      }
      function add(events, event) {
        var i = 0;
        var e = events["length"];
        for (; i < e; i++) {
          if (events[i] === event) {
            return i;
          }
        }
        return -1;
      }
      var fn = require(_0x4c5b("0x167"));
      module["exports"] = WMCacheControl;
      var arrayRemove = require(_0x4c5b("0x191"));
      var PGQueryStream;
      WMCacheControl["ReadableState"] = init;
      require(_0x4c5b("0x192"))["EventEmitter"];
      var resolve = function(b, a) {
        return b[_0x4c5b("0x193")](a)["length"];
      };
      var ms = require("./internal/streams/stream");
      var args = require("safe-buffer")["Buffer"];
      var Stream = isSlidingUp[_0x4c5b("0x194")] || function() {
      };
      var global = require(_0x4c5b("0x16d"));
      global[_0x4c5b("0xf4")] = require(_0x4c5b("0xf4"));
      var message = require("util");
      var debug;
      debug = message && message[_0x4c5b("0x195")] ? message[_0x4c5b("0x195")](_0x4c5b("0xf2")) : function() {
      };
      var Duplicity = require(_0x4c5b("0x196"));
      var UrdfMaterial = require(_0x4c5b("0x197"));
      var type;
      global[_0x4c5b("0xf4")](WMCacheControl, ms);
      var PL$13 = [_0x4c5b("0x47"), _0x4c5b("0x198"), _0x4c5b("0x17e"), "pause", _0x4c5b("0x18c")];
      Object[_0x4c5b("0x4b")](WMCacheControl[_0x4c5b("0x10")], _0x4c5b("0x16a"), {
        "get" : function() {
          return void 0 !== this[_0x4c5b("0x169")] && this[_0x4c5b("0x169")][_0x4c5b("0x16a")];
        },
        "set" : function(mymuted) {
          if (this[_0x4c5b("0x169")]) {
            this[_0x4c5b("0x169")][_0x4c5b("0x16a")] = mymuted;
          }
        }
      });
      WMCacheControl[_0x4c5b("0x10")][_0x4c5b("0x17e")] = UrdfMaterial[_0x4c5b("0x17e")];
      WMCacheControl[_0x4c5b("0x10")][_0x4c5b("0x199")] = UrdfMaterial["undestroy"];
      WMCacheControl[_0x4c5b("0x10")][_0x4c5b("0x16b")] = function(notifications, saveNotifs) {
        this[_0x4c5b("0x7")](null);
        saveNotifs(notifications);
      };
      WMCacheControl[_0x4c5b("0x10")][_0x4c5b("0x7")] = function(done, ret) {
        var savetask = this[_0x4c5b("0x169")];
        var undefined;
        return savetask[_0x4c5b("0x16f")] ? undefined = true : _0x4c5b("0x12") == typeof done && ((ret = ret || savetask["defaultEncoding"]) !== savetask[_0x4c5b("0x17a")] && (done = args[_0x4c5b("0x4d")](done, ret), ret = ""), undefined = true), build(this, done, ret, false, undefined);
      };
      WMCacheControl[_0x4c5b("0x10")][_0x4c5b("0x184")] = function(data) {
        return build(this, data, null, true, false);
      };
      WMCacheControl[_0x4c5b("0x10")][_0x4c5b("0x19a")] = function() {
        return false === this["_readableState"][_0x4c5b("0x183")];
      };
      WMCacheControl[_0x4c5b("0x10")][_0x4c5b("0x19b")] = function(val) {
        return type || (type = require(_0x4c5b("0x17b"))[_0x4c5b("0x17c")]), this[_0x4c5b("0x169")]["decoder"] = new type(val), this[_0x4c5b("0x169")][_0x4c5b("0x17a")] = val, this;
      };
      WMCacheControl[_0x4c5b("0x10")][_0x4c5b("0x78")] = function(dir) {
        debug("read", dir);
        dir = parseInt(dir, 10);
        var data = this[_0x4c5b("0x169")];
        var path = dir;
        if (0 !== dir && (data[_0x4c5b("0x174")] = false), 0 === dir && data[_0x4c5b("0x173")] && (data["length"] >= data["highWaterMark"] || data[_0x4c5b("0x166")])) {
          return debug(_0x4c5b("0x19c"), data["length"], data[_0x4c5b("0x166")]), 0 === data["length"] && data["ended"] ? preload(this) : on(this), null;
        }
        if (0 === (dir = normalize(dir, data)) && data[_0x4c5b("0x166")]) {
          return 0 === data["length"] && preload(this), null;
        }
        var static_ip = data[_0x4c5b("0x173")];
        var actionId;
        return debug(_0x4c5b("0x19d"), static_ip), (0 === data["length"] || data["length"] - dir < data[_0x4c5b("0x170")]) && debug("length less than watermark", static_ip = true), data["ended"] || data[_0x4c5b("0x172")] ? debug(_0x4c5b("0x19e"), static_ip = false) : static_ip && (debug(_0x4c5b("0x19f")), data[_0x4c5b("0x172")] = true, data[_0x4c5b("0x187")] = true, 0 === data["length"] && (data[_0x4c5b("0x173")] = true), this[_0x4c5b("0x17d")](data[_0x4c5b("0x170")]), data[_0x4c5b("0x187")] = 
        false, data[_0x4c5b("0x172")] || (dir = normalize(path, data))), null === (actionId = 0 < dir ? check(dir, data) : null) ? (data[_0x4c5b("0x173")] = true, dir = 0) : data["length"] -= dir, 0 === data["length"] && (data[_0x4c5b("0x166")] || (data[_0x4c5b("0x173")] = true), path !== dir && data["ended"] && preload(this)), null !== actionId && this["emit"](_0x4c5b("0x21"), actionId), actionId;
      };
      WMCacheControl[_0x4c5b("0x10")][_0x4c5b("0x17d")] = function() {
        this[_0x4c5b("0xcc")](_0x4c5b("0x47"), new Error("_read() is not implemented"));
      };
      WMCacheControl[_0x4c5b("0x10")][_0x4c5b("0x1a0")] = function(undefined, changesIdentifyUser) {
        function dispatch(key, value) {
          debug(_0x4c5b("0x1a1"));
          if (key === methods && value && false === value["hasUnpiped"]) {
            value["hasUnpiped"] = true;
            debug(_0x4c5b("0x1a2"));
            undefined[_0x4c5b("0xd3")](_0x4c5b("0x198"), PL$26);
            undefined[_0x4c5b("0xd3")]("finish", Client);
            undefined[_0x4c5b("0xd3")](_0x4c5b("0x1a3"), forwarder);
            undefined[_0x4c5b("0xd3")](_0x4c5b("0x47"), finish);
            undefined[_0x4c5b("0xd3")](_0x4c5b("0x1a4"), dispatch);
            methods["removeListener"](_0x4c5b("0x12c"), end);
            methods[_0x4c5b("0xd3")](_0x4c5b("0x12c"), reject);
            methods[_0x4c5b("0xd3")](_0x4c5b("0x21"), fn);
            _0x261da5 = true;
            if (!(!types[_0x4c5b("0x18b")] || undefined["_writableState"] && !undefined[_0x4c5b("0x165")]["needDrain"])) {
              forwarder();
            }
          }
        }
        function end() {
          debug("onend");
          undefined[_0x4c5b("0x12c")]();
        }
        function fn(artist_name) {
          debug(_0x4c5b("0x1a5"));
          _0x5111b4 = false;
          if (!(false !== undefined[_0x4c5b("0x1a")](artist_name) || _0x5111b4)) {
            if ((1 === types[_0x4c5b("0x1a6")] && types[_0x4c5b("0x171")] === undefined || 1 < types[_0x4c5b("0x1a6")] && -1 !== add(types["pipes"], undefined)) && !_0x261da5) {
              debug("false write response, pause", methods[_0x4c5b("0x169")][_0x4c5b("0x18b")]);
              methods["_readableState"][_0x4c5b("0x18b")]++;
              _0x5111b4 = true;
            }
            methods["pause"]();
          }
        }
        function finish(text) {
          debug(_0x4c5b("0x1a7"), text);
          reject();
          undefined[_0x4c5b("0xd3")](_0x4c5b("0x47"), finish);
          if (0 === resolve(undefined, _0x4c5b("0x47"))) {
            undefined[_0x4c5b("0xcc")](_0x4c5b("0x47"), text);
          }
        }
        function PL$26() {
          undefined[_0x4c5b("0xd3")](_0x4c5b("0x1a8"), Client);
          reject();
        }
        function Client() {
          debug(_0x4c5b("0x1a9"));
          undefined["removeListener"]("close", PL$26);
          reject();
        }
        function reject() {
          debug(_0x4c5b("0x1a4"));
          methods[_0x4c5b("0x1a4")](undefined);
        }
        var methods = this;
        var types = this[_0x4c5b("0x169")];
        switch(types[_0x4c5b("0x1a6")]) {
          case 0:
            types[_0x4c5b("0x171")] = undefined;
            break;
          case 1:
            types["pipes"] = [types[_0x4c5b("0x171")], undefined];
            break;
          default:
            types["pipes"][_0x4c5b("0x7")](undefined);
        }
        types[_0x4c5b("0x1a6")] += 1;
        debug(_0x4c5b("0x1aa"), types[_0x4c5b("0x1a6")], changesIdentifyUser);
        var method = changesIdentifyUser && false === changesIdentifyUser[_0x4c5b("0x12c")] || undefined === dst[_0x4c5b("0x1ab")] || undefined === dst[_0x4c5b("0x1ac")] ? reject : end;
        if (types[_0x4c5b("0x180")]) {
          fn(method);
        } else {
          methods[_0x4c5b("0xd2")]("end", method);
        }
        undefined["on"](_0x4c5b("0x1a4"), dispatch);
        var forwarder = (options = methods, function() {
          var types = options["_readableState"];
          debug(_0x4c5b("0x1ad"), types[_0x4c5b("0x18b")]);
          if (types[_0x4c5b("0x18b")]) {
            types[_0x4c5b("0x18b")]--;
          }
          if (0 === types[_0x4c5b("0x18b")] && resolve(options, _0x4c5b("0x21"))) {
            types[_0x4c5b("0x183")] = true;
            stripLocalOptions(options);
          }
        });
        var options;
        undefined["on"]("drain", forwarder);
        var _0x261da5 = false;
        var _0x5111b4 = false;
        return methods["on"]("data", fn), function(handlers, event, cb) {
          return _0x4c5b("0x0") == typeof handlers[_0x4c5b("0x15b")] ? handlers[_0x4c5b("0x15b")](event, cb) : void(handlers[_0x4c5b("0xc5")] && handlers["_events"][event] ? arrayRemove(handlers["_events"][event]) ? handlers[_0x4c5b("0xc5")][event][_0x4c5b("0x184")](cb) : handlers["_events"][event] = [cb, handlers[_0x4c5b("0xc5")][event]] : handlers["on"](event, cb));
        }(undefined, _0x4c5b("0x47"), finish), undefined[_0x4c5b("0xd2")](_0x4c5b("0x198"), PL$26), undefined[_0x4c5b("0xd2")](_0x4c5b("0x1a8"), Client), undefined["emit"]("pipe", methods), types[_0x4c5b("0x183")] || (debug(_0x4c5b("0x1ae")), methods["resume"]()), undefined;
      };
      WMCacheControl[_0x4c5b("0x10")]["unpipe"] = function(type) {
        var types = this[_0x4c5b("0x169")];
        var unpipeInfo = {
          "hasUnpiped" : false
        };
        if (0 === types[_0x4c5b("0x1a6")]) {
          return this;
        }
        if (1 === types[_0x4c5b("0x1a6")]) {
          return type && type !== types[_0x4c5b("0x171")] ? this : (type || (type = types[_0x4c5b("0x171")]), types["pipes"] = null, types[_0x4c5b("0x1a6")] = 0, types[_0x4c5b("0x183")] = false, type && type[_0x4c5b("0xcc")](_0x4c5b("0x1a4"), this, unpipeInfo), this);
        }
        if (!type) {
          var signedTransactions = types[_0x4c5b("0x171")];
          var type_def = types[_0x4c5b("0x1a6")];
          types[_0x4c5b("0x171")] = null;
          types[_0x4c5b("0x1a6")] = 0;
          types[_0x4c5b("0x183")] = false;
          var signedTransactionsCounter = 0;
          for (; signedTransactionsCounter < type_def; signedTransactionsCounter++) {
            signedTransactions[signedTransactionsCounter][_0x4c5b("0xcc")](_0x4c5b("0x1a4"), this, unpipeInfo);
          }
          return this;
        }
        var result = add(types[_0x4c5b("0x171")], type);
        return -1 === result ? this : (types[_0x4c5b("0x171")][_0x4c5b("0xd4")](result, 1), types["pipesCount"] -= 1, 1 === types[_0x4c5b("0x1a6")] && (types[_0x4c5b("0x171")] = types[_0x4c5b("0x171")][0]), type[_0x4c5b("0xcc")](_0x4c5b("0x1a4"), this, unpipeInfo), this);
      };
      WMCacheControl[_0x4c5b("0x10")]["on"] = function(coords, colour) {
        var xyfortext = ms[_0x4c5b("0x10")]["on"][_0x4c5b("0x4")](this, coords, colour);
        if (_0x4c5b("0x21") === coords) {
          if (false !== this[_0x4c5b("0x169")][_0x4c5b("0x183")]) {
            this[_0x4c5b("0x18c")]();
          }
        } else {
          if (_0x4c5b("0x162") === coords) {
            var _0x84c6e2 = this[_0x4c5b("0x169")];
            if (!(_0x84c6e2["endEmitted"] || _0x84c6e2["readableListening"])) {
              _0x84c6e2["readableListening"] = _0x84c6e2["needReadable"] = true;
              _0x84c6e2[_0x4c5b("0x174")] = false;
              if (_0x84c6e2[_0x4c5b("0x172")]) {
                if (_0x84c6e2["length"]) {
                  on(this);
                }
              } else {
                fn(update_services, this);
              }
            }
          }
        }
        return xyfortext;
      };
      WMCacheControl[_0x4c5b("0x10")][_0x4c5b("0xca")] = WMCacheControl[_0x4c5b("0x10")]["on"];
      WMCacheControl[_0x4c5b("0x10")]["resume"] = function() {
        var quitedTooFastString = this["_readableState"];
        var jsonPathDoubleDot;
        var msg;
        return quitedTooFastString[_0x4c5b("0x183")] || (debug(_0x4c5b("0x18c")), quitedTooFastString[_0x4c5b("0x183")] = true, jsonPathDoubleDot = this, (msg = quitedTooFastString)[_0x4c5b("0x176")] || (msg[_0x4c5b("0x176")] = true, fn(load, jsonPathDoubleDot, msg))), this;
      };
      WMCacheControl[_0x4c5b("0x10")]["pause"] = function() {
        return debug(_0x4c5b("0x1af"), this[_0x4c5b("0x169")][_0x4c5b("0x183")]), false !== this[_0x4c5b("0x169")][_0x4c5b("0x183")] && (debug(_0x4c5b("0x1b0")), this[_0x4c5b("0x169")][_0x4c5b("0x183")] = false, this[_0x4c5b("0xcc")](_0x4c5b("0x1b0"))), this;
      };
      WMCacheControl["prototype"][_0x4c5b("0x1b1")] = function(o) {
        var queue = this[_0x4c5b("0x169")];
        var _0x2fbf37 = false;
        var obj = this;
        var key;
        for (key in o["on"](_0x4c5b("0x12c"), function() {
          if (debug(_0x4c5b("0x1b2")), queue["decoder"] && !queue[_0x4c5b("0x166")]) {
            var asset = queue[_0x4c5b("0x179")][_0x4c5b("0x12c")]();
            if (asset && asset["length"]) {
              obj[_0x4c5b("0x7")](asset);
            }
          }
          obj[_0x4c5b("0x7")](null);
        }), o["on"](_0x4c5b("0x21"), function(value) {
          if (!(debug("wrapped data"), queue[_0x4c5b("0x179")] && (value = queue[_0x4c5b("0x179")]["write"](value)), queue[_0x4c5b("0x16f")] && null == value)) {
            if (queue[_0x4c5b("0x16f")] || value && value["length"]) {
              if (!obj["push"](value)) {
                _0x2fbf37 = true;
                o[_0x4c5b("0x1b0")]();
              }
            }
          }
        }), o) {
          if (void 0 === this[key] && _0x4c5b("0x0") == typeof o[key]) {
            this[key] = function(scope) {
              return function() {
                return o[scope][_0x4c5b("0x36")](o, arguments);
              };
            }(key);
          }
        }
        var PL$17 = 0;
        for (; PL$17 < PL$13["length"]; PL$17++) {
          o["on"](PL$13[PL$17], obj[_0x4c5b("0xcc")][_0x4c5b("0x1b3")](obj, PL$13[PL$17]));
        }
        return obj["_read"] = function(supporterL) {
          debug(_0x4c5b("0x1b4"), supporterL);
          if (_0x2fbf37) {
            _0x2fbf37 = false;
            o[_0x4c5b("0x18c")]();
          }
        }, obj;
      };
      WMCacheControl[_0x4c5b("0x1b5")] = check;
    })[_0x4c5b("0x4")](this, require(_0x4c5b("0x1b6")), _0x4c5b("0x49") == typeof global ? _0x4c5b("0x49") == typeof self ? _0x4c5b("0x49") == typeof window ? {} : window : self : global);
  }, {
    "./_stream_duplex" : 24,
    "./internal/streams/BufferList" : 29,
    "./internal/streams/destroy" : 30,
    "./internal/streams/stream" : 31,
    "_process" : 22,
    "core-util-is" : 4,
    "events" : 8,
    "inherits" : 10,
    "isarray" : 12,
    "process-nextick-args" : 21,
    "safe-buffer" : 36,
    "string_decoder/" : 38,
    "util" : 2
  }],
  27 : [function(ExportProperties, animation) {
    function Date(d) {
      this[_0x4c5b("0x1b7")] = function(bulletBody, isBgroundImg) {
        return function(data, body, isBgroundImg) {
          var passid = data["_transformState"];
          passid[_0x4c5b("0x1b8")] = false;
          var getResultMessageDiv = passid[_0x4c5b("0x1b9")];
          if (!getResultMessageDiv) {
            return data[_0x4c5b("0xcc")]("error", new Error(_0x4c5b("0x1ba")));
          }
          passid[_0x4c5b("0x1bb")] = null;
          passid[_0x4c5b("0x1b9")] = null;
          if (null != isBgroundImg) {
            data[_0x4c5b("0x7")](isBgroundImg);
          }
          getResultMessageDiv(body);
          var args = data["_readableState"];
          args["reading"] = false;
          if (args[_0x4c5b("0x173")] || args["length"] < args[_0x4c5b("0x170")]) {
            data[_0x4c5b("0x17d")](args[_0x4c5b("0x170")]);
          }
        }(d, bulletBody, isBgroundImg);
      };
      this[_0x4c5b("0x1bc")] = false;
      this[_0x4c5b("0x1b8")] = false;
      this["writecb"] = null;
      this[_0x4c5b("0x1bb")] = null;
      this["writeencoding"] = null;
    }
    function delay(duration) {
      if (!(this instanceof delay)) {
        return new delay(duration);
      }
      backEl[_0x4c5b("0x4")](this, duration);
      this[_0x4c5b("0x1bd")] = new Date(this);
      var store = this;
      this[_0x4c5b("0x169")][_0x4c5b("0x173")] = true;
      this[_0x4c5b("0x169")][_0x4c5b("0x187")] = false;
      if (duration) {
        if (_0x4c5b("0x0") == typeof duration[_0x4c5b("0x1be")]) {
          this[_0x4c5b("0x13d")] = duration[_0x4c5b("0x1be")];
        }
        if ("function" == typeof duration[_0x4c5b("0x1bf")]) {
          this["_flush"] = duration["flush"];
        }
      }
      this["once"](_0x4c5b("0x1c0"), function() {
        if (_0x4c5b("0x0") == typeof this["_flush"]) {
          this[_0x4c5b("0x128")](function(f, duration) {
            next(store, f, duration);
          });
        } else {
          next(store);
        }
      });
    }
    function next(actions, message, event) {
      if (message) {
        return actions["emit"]("error", message);
      }
      if (null != event) {
        actions[_0x4c5b("0x7")](event);
      }
      var b = actions[_0x4c5b("0x165")];
      var remove = actions[_0x4c5b("0x1bd")];
      if (b["length"]) {
        throw new Error("Calling transform done when ws.length != 0");
      }
      if (remove[_0x4c5b("0x1b8")]) {
        throw new Error(_0x4c5b("0x1c1"));
      }
      return actions[_0x4c5b("0x7")](null);
    }
    animation[_0x4c5b("0x5")] = delay;
    var backEl = ExportProperties("./_stream_duplex");
    var content = ExportProperties(_0x4c5b("0x16d"));
    content[_0x4c5b("0xf4")] = ExportProperties(_0x4c5b("0xf4"));
    content[_0x4c5b("0xf4")](delay, backEl);
    delay[_0x4c5b("0x10")]["push"] = function(mmCoreSplitViewBlock, mmaPushNotificationsComponent) {
      return this[_0x4c5b("0x1bd")]["needTransform"] = false, backEl["prototype"][_0x4c5b("0x7")][_0x4c5b("0x4")](this, mmCoreSplitViewBlock, mmaPushNotificationsComponent);
    };
    delay["prototype"][_0x4c5b("0x13d")] = function() {
      throw new Error(_0x4c5b("0x1c2"));
    };
    delay[_0x4c5b("0x10")][_0x4c5b("0x1c3")] = function(toolbar, defaultSetting, maybeValue) {
      var settings = this[_0x4c5b("0x1bd")];
      if (settings[_0x4c5b("0x1b9")] = maybeValue, settings[_0x4c5b("0x1bb")] = toolbar, settings["writeencoding"] = defaultSetting, !settings[_0x4c5b("0x1b8")]) {
        var defaultLocaleSettings = this[_0x4c5b("0x169")];
        if (settings[_0x4c5b("0x1bc")] || defaultLocaleSettings[_0x4c5b("0x173")] || defaultLocaleSettings["length"] < defaultLocaleSettings[_0x4c5b("0x170")]) {
          this[_0x4c5b("0x17d")](defaultLocaleSettings["highWaterMark"]);
        }
      }
    };
    delay[_0x4c5b("0x10")][_0x4c5b("0x17d")] = function() {
      var _0xf367e0 = this[_0x4c5b("0x1bd")];
      if (null !== _0xf367e0["writechunk"] && _0xf367e0[_0x4c5b("0x1b9")] && !_0xf367e0[_0x4c5b("0x1b8")]) {
        _0xf367e0[_0x4c5b("0x1b8")] = true;
        this[_0x4c5b("0x13d")](_0xf367e0["writechunk"], _0xf367e0[_0x4c5b("0x1c4")], _0xf367e0[_0x4c5b("0x1b7")]);
      } else {
        _0xf367e0[_0x4c5b("0x1bc")] = true;
      }
    };
    delay[_0x4c5b("0x10")]["_destroy"] = function(PL$3, saveNotifs) {
      var _0x49bf18 = this;
      backEl[_0x4c5b("0x10")][_0x4c5b("0x16b")]["call"](this, PL$3, function(notifications) {
        saveNotifs(notifications);
        _0x49bf18[_0x4c5b("0xcc")](_0x4c5b("0x198"));
      });
    };
  }, {
    "./_stream_duplex" : 24,
    "core-util-is" : 4,
    "inherits" : 10
  }],
  28 : [function(require, stats_results) {
    (function(canCreateDiscussions, isSlidingUp) {
      function Date(primaryTxHex) {
        var clojIsReversed = this;
        this[_0x4c5b("0x18f")] = null;
        this[_0x4c5b("0x1c5")] = null;
        this[_0x4c5b("0x1a8")] = function() {
          !function(isSlidingUp, primaryTxHex, floor) {
            var msg = isSlidingUp[_0x4c5b("0x1c5")];
            isSlidingUp[_0x4c5b("0x1c5")] = null;
            for (; msg;) {
              var result = msg[_0x4c5b("0x1c6")];
              primaryTxHex[_0x4c5b("0x1c7")]--;
              result(floor);
              msg = msg[_0x4c5b("0x18f")];
            }
            if (primaryTxHex[_0x4c5b("0x1c8")]) {
              primaryTxHex[_0x4c5b("0x1c8")][_0x4c5b("0x18f")] = isSlidingUp;
            } else {
              primaryTxHex[_0x4c5b("0x1c8")] = isSlidingUp;
            }
          }(clojIsReversed, primaryTxHex);
        };
      }
      function Out() {
      }
      function constructor(mapping, type) {
        Parser = Parser || require(_0x4c5b("0x16e"));
        mapping = mapping || {};
        this[_0x4c5b("0x16f")] = !!mapping["objectMode"];
        if (type instanceof Parser) {
          this[_0x4c5b("0x16f")] = this[_0x4c5b("0x16f")] || !!mapping["writableObjectMode"];
        }
        var latinCharacter = mapping["highWaterMark"];
        var character = this["objectMode"] ? 16 : 16384;
        this[_0x4c5b("0x170")] = latinCharacter || 0 === latinCharacter ? latinCharacter : character;
        this[_0x4c5b("0x170")] = Math[_0x4c5b("0xd8")](this[_0x4c5b("0x170")]);
        this[_0x4c5b("0x1c9")] = false;
        this["needDrain"] = false;
        this[_0x4c5b("0x1ca")] = false;
        this[_0x4c5b("0x166")] = false;
        this[_0x4c5b("0x1cb")] = false;
        this[_0x4c5b("0x16a")] = false;
        var _0x14dca9 = false === mapping["decodeStrings"];
        this[_0x4c5b("0x1cc")] = !_0x14dca9;
        this["defaultEncoding"] = mapping[_0x4c5b("0x177")] || _0x4c5b("0x17");
        this["length"] = 0;
        this["writing"] = false;
        this["corked"] = 0;
        this["sync"] = true;
        this[_0x4c5b("0x1cd")] = false;
        this[_0x4c5b("0x1ce")] = function(force) {
          !function(data, delta) {
            var value = data[_0x4c5b("0x165")];
            var v = value[_0x4c5b("0x187")];
            var methods = value[_0x4c5b("0x1b9")];
            if (builtinEnabled = value, builtinEnabled[_0x4c5b("0x1cf")] = false, builtinEnabled["writecb"] = null, builtinEnabled["length"] -= builtinEnabled["writelen"], builtinEnabled[_0x4c5b("0x1d0")] = 0, delta) {
              index = data;
              repo = value;
              validationVM = v;
              direction = delta;
              app = methods;
              --repo["pendingcb"];
              if (validationVM) {
                debug(app, direction);
                debug(write, index, repo);
                index["_writableState"]["errorEmitted"] = true;
                index["emit"](_0x4c5b("0x47"), direction);
              } else {
                app(direction);
                index["_writableState"][_0x4c5b("0x1d1")] = true;
                index[_0x4c5b("0xcc")](_0x4c5b("0x47"), direction);
                write(index, repo);
              }
            } else {
              var opts = convert(value);
              if (!(opts || value[_0x4c5b("0x1d2")] || value[_0x4c5b("0x1cd")] || !value[_0x4c5b("0x1d3")])) {
                complete(data, value);
              }
              if (v) {
                assert(assign, data, value, opts, methods);
              } else {
                assign(data, value, opts, methods);
              }
            }
            var index;
            var repo;
            var validationVM;
            var direction;
            var app;
            var builtinEnabled;
          }(type, force);
        };
        this[_0x4c5b("0x1b9")] = null;
        this["writelen"] = 0;
        this[_0x4c5b("0x1d3")] = null;
        this["lastBufferedRequest"] = null;
        this[_0x4c5b("0x1c7")] = 0;
        this[_0x4c5b("0x1d4")] = false;
        this[_0x4c5b("0x1d1")] = false;
        this[_0x4c5b("0x1d5")] = 0;
        this["corkedRequestsFree"] = new Date(this);
      }
      function module(options) {
        return (Parser = Parser || require(_0x4c5b("0x16e")), !(getArgs[_0x4c5b("0x4")](module, this) || this instanceof Parser)) ? new module(options) : void(this[_0x4c5b("0x165")] = new constructor(options, this), this[_0x4c5b("0x163")] = true, options && (_0x4c5b("0x0") == typeof options[_0x4c5b("0x1a")] && (this[_0x4c5b("0x1c3")] = options[_0x4c5b("0x1a")]), "function" == typeof options[_0x4c5b("0x1d6")] && (this[_0x4c5b("0x1d7")] = options["writev"]), _0x4c5b("0x0") == typeof options[_0x4c5b("0x17e")] && 
        (this[_0x4c5b("0x16b")] = options[_0x4c5b("0x17e")]), _0x4c5b("0x0") == typeof options[_0x4c5b("0x1d8")] && (this["_final"] = options[_0x4c5b("0x1d8")])), session[_0x4c5b("0x4")](this));
      }
      function fn(self, params, expected, result, type, data, callback) {
        params[_0x4c5b("0x1d0")] = result;
        params[_0x4c5b("0x1b9")] = callback;
        params[_0x4c5b("0x1cf")] = true;
        params[_0x4c5b("0x187")] = true;
        if (expected) {
          self[_0x4c5b("0x1d7")](type, params[_0x4c5b("0x1ce")]);
        } else {
          self[_0x4c5b("0x1c3")](type, data, params[_0x4c5b("0x1ce")]);
        }
        params[_0x4c5b("0x187")] = false;
      }
      function assign(s, data, params, callback) {
        var socket;
        var autoReview;
        if (!params) {
          socket = s;
          if (0 === (autoReview = data)["length"] && autoReview[_0x4c5b("0x1d9")]) {
            autoReview[_0x4c5b("0x1d9")] = false;
            socket["emit"](_0x4c5b("0x1a3"));
          }
        }
        data[_0x4c5b("0x1c7")]--;
        callback();
        write(s, data);
      }
      function complete(props, context) {
        context[_0x4c5b("0x1cd")] = true;
        var data = context[_0x4c5b("0x1d3")];
        if (props["_writev"] && data && data["next"]) {
          var obj = context[_0x4c5b("0x1d5")];
          var args = Array(obj);
          var instance = context[_0x4c5b("0x1c8")];
          instance[_0x4c5b("0x1c5")] = data;
          var fullCrc = 0;
          var ATTRIBUTE_REPEAT = true;
          for (; data;) {
            args[fullCrc] = data;
            if (!data["isBuf"]) {
              ATTRIBUTE_REPEAT = false;
            }
            data = data[_0x4c5b("0x18f")];
            fullCrc = fullCrc + 1;
          }
          args[_0x4c5b("0x1da")] = ATTRIBUTE_REPEAT;
          fn(props, context, true, context["length"], args, "", instance[_0x4c5b("0x1a8")]);
          context[_0x4c5b("0x1c7")]++;
          context[_0x4c5b("0x1db")] = null;
          if (instance[_0x4c5b("0x18f")]) {
            context[_0x4c5b("0x1c8")] = instance[_0x4c5b("0x18f")];
            instance[_0x4c5b("0x18f")] = null;
          } else {
            context[_0x4c5b("0x1c8")] = new Date(context);
          }
        } else {
          for (; data;) {
            var flags = data[_0x4c5b("0x1dc")];
            var type = data[_0x4c5b("0x17a")];
            var callback = data[_0x4c5b("0x1c6")];
            if (fn(props, context, false, context[_0x4c5b("0x16f")] ? 1 : flags["length"], flags, type, callback), data = data[_0x4c5b("0x18f")], context["writing"]) {
              break;
            }
          }
          if (null === data) {
            context[_0x4c5b("0x1db")] = null;
          }
        }
        context[_0x4c5b("0x1d5")] = 0;
        context[_0x4c5b("0x1d3")] = data;
        context[_0x4c5b("0x1cd")] = false;
      }
      function convert(record) {
        return record[_0x4c5b("0x1ca")] && 0 === record["length"] && null === record[_0x4c5b("0x1d3")] && !record[_0x4c5b("0x1cb")] && !record[_0x4c5b("0x1cf")];
      }
      function end(target, results) {
        target[_0x4c5b("0x1dd")](function(actionId) {
          results[_0x4c5b("0x1c7")]--;
          if (actionId) {
            target["emit"]("error", actionId);
          }
          results[_0x4c5b("0x1d4")] = true;
          target[_0x4c5b("0xcc")](_0x4c5b("0x1c0"));
          write(target, results);
        });
      }
      function write(val, data) {
        var results = convert(data);
        var payload;
        var businessVAT;
        return results && (payload = val, (businessVAT = data)[_0x4c5b("0x1d4")] || businessVAT[_0x4c5b("0x1c9")] || (_0x4c5b("0x0") == typeof payload[_0x4c5b("0x1dd")] ? (businessVAT[_0x4c5b("0x1c7")]++, businessVAT[_0x4c5b("0x1c9")] = true, debug(end, payload, businessVAT)) : (businessVAT[_0x4c5b("0x1d4")] = true, payload["emit"](_0x4c5b("0x1c0")))), 0 === data[_0x4c5b("0x1c7")] && (data[_0x4c5b("0x1cb")] = true, val[_0x4c5b("0xcc")](_0x4c5b("0x1a8")))), results;
      }
      var debug = require(_0x4c5b("0x167"));
      stats_results[_0x4c5b("0x5")] = module;
      var assert = !canCreateDiscussions[_0x4c5b("0x156")] && -1 < ["v0.10", _0x4c5b("0x1de")][_0x4c5b("0x2d")](canCreateDiscussions[_0x4c5b("0x140")][_0x4c5b("0x1b")](0, 5)) ? setImmediate : debug;
      var Parser;
      module[_0x4c5b("0x1df")] = constructor;
      var handlers = require("core-util-is");
      handlers["inherits"] = require(_0x4c5b("0xf4"));
      var _0x384ae3 = {
        "deprecate" : require(_0x4c5b("0x1e0"))
      };
      var session = require(_0x4c5b("0x1e1"));
      var self = require(_0x4c5b("0x1e2"))[_0x4c5b("0x1e")];
      var _Url = isSlidingUp[_0x4c5b("0x194")] || function() {
      };
      var frontEndModuleConfig = require("./internal/streams/destroy");
      var getArgs;
      handlers[_0x4c5b("0xf4")](module, session);
      constructor[_0x4c5b("0x10")][_0x4c5b("0x1e3")] = function() {
        var value = this[_0x4c5b("0x1d3")];
        var settingHandler = [];
        for (; value;) {
          settingHandler[_0x4c5b("0x7")](value);
          value = value[_0x4c5b("0x18f")];
        }
        return settingHandler;
      };
      (function() {
        try {
          Object[_0x4c5b("0x4b")](constructor["prototype"], _0x4c5b("0xe7"), {
            "get" : _0x384ae3["deprecate"](function() {
              return this[_0x4c5b("0x1e3")]();
            }, _0x4c5b("0x1e4"), "DEP0003")
          });
        } catch (_0x232c5e) {
        }
      })();
      if (_0x4c5b("0x0") == typeof Symbol && Symbol[_0x4c5b("0x1e5")] && "function" == typeof Function[_0x4c5b("0x10")][Symbol[_0x4c5b("0x1e5")]]) {
        getArgs = Function["prototype"][Symbol[_0x4c5b("0x1e5")]];
        Object[_0x4c5b("0x4b")](module, Symbol[_0x4c5b("0x1e5")], {
          "value" : function(args) {
            return !!getArgs[_0x4c5b("0x4")](this, args) || args && args[_0x4c5b("0x165")] instanceof constructor;
          }
        });
      } else {
        getArgs = function(extra) {
          return extra instanceof this;
        };
      }
      module["prototype"][_0x4c5b("0x1a0")] = function() {
        this[_0x4c5b("0xcc")]("error", new Error("Cannot pipe, not readable"));
      };
      module[_0x4c5b("0x10")]["write"] = function(file, value, c) {
        var name = this[_0x4c5b("0x165")];
        var content = false;
        var clojIsReversed = (args = file, (self["isBuffer"](args) || args instanceof _Url) && !name[_0x4c5b("0x16f")]);
        var args;
        var data;
        var _localExports;
        var _name;
        var waitImportedItem;
        var d;
        var isMain;
        var i;
        var service_obj;
        var text;
        var message;
        return clojIsReversed && !self[_0x4c5b("0x1c")](file) && (data = file, file = self[_0x4c5b("0x4d")](data)), "function" == typeof value && (c = value, value = null), clojIsReversed ? value = _0x4c5b("0xe7") : value || (value = name[_0x4c5b("0x177")]), "function" != typeof c && (c = Out), name[_0x4c5b("0x166")] ? (service_obj = this, text = c, message = new Error(_0x4c5b("0x1e6")), service_obj["emit"](_0x4c5b("0x47"), message), debug(text, message)) : (clojIsReversed || (_localExports = this, 
        _name = name, d = c, isMain = true, i = false, null === (waitImportedItem = file) ? i = new TypeError(_0x4c5b("0x1e7")) : _0x4c5b("0x12") == typeof waitImportedItem || void 0 === waitImportedItem || _name[_0x4c5b("0x16f")] || (i = new TypeError("Invalid non-string/buffer chunk")), i && (_localExports["emit"](_0x4c5b("0x47"), i), debug(d, i), isMain = false), isMain)) && (name["pendingcb"]++, content = function(set, list, isSlidingUp, value, type, callback) {
          if (!isSlidingUp) {
            var result = function(arrMethod, value, context) {
              return arrMethod[_0x4c5b("0x16f")] || false === arrMethod[_0x4c5b("0x1cc")] || _0x4c5b("0x12") != typeof value || (value = self[_0x4c5b("0x4d")](value, context)), value;
            }(list, value, type);
            if (value !== result) {
              isSlidingUp = true;
              type = _0x4c5b("0xe7");
              value = result;
            }
          }
          var right = list["objectMode"] ? 1 : value["length"];
          list["length"] += right;
          var _0x282475 = list["length"] < list[_0x4c5b("0x170")];
          if (_0x282475 || (list[_0x4c5b("0x1d9")] = true), list[_0x4c5b("0x1cf")] || list[_0x4c5b("0x1d2")]) {
            var l = list["lastBufferedRequest"];
            list[_0x4c5b("0x1db")] = {
              "chunk" : value,
              "encoding" : type,
              "isBuf" : isSlidingUp,
              "callback" : callback,
              "next" : null
            };
            if (l) {
              l[_0x4c5b("0x18f")] = list["lastBufferedRequest"];
            } else {
              list[_0x4c5b("0x1d3")] = list[_0x4c5b("0x1db")];
            }
            list[_0x4c5b("0x1d5")] += 1;
          } else {
            fn(set, list, false, right, value, type, callback);
          }
          return _0x282475;
        }(this, name, clojIsReversed, file, value, c)), content;
      };
      module[_0x4c5b("0x10")][_0x4c5b("0x1e8")] = function() {
        this[_0x4c5b("0x165")][_0x4c5b("0x1d2")]++;
      };
      module[_0x4c5b("0x10")]["uncork"] = function() {
        var value = this[_0x4c5b("0x165")];
        if (value[_0x4c5b("0x1d2")]) {
          value[_0x4c5b("0x1d2")]--;
          if (!(value[_0x4c5b("0x1cf")] || value[_0x4c5b("0x1d2")] || value[_0x4c5b("0x1cb")] || value[_0x4c5b("0x1cd")] || !value[_0x4c5b("0x1d3")])) {
            complete(this, value);
          }
        }
      };
      module[_0x4c5b("0x10")][_0x4c5b("0x1e9")] = function(format) {
        if (_0x4c5b("0x12") == typeof format && (format = format[_0x4c5b("0x2c")]()), !(-1 < [_0x4c5b("0x2a"), "utf8", _0x4c5b("0x28"), _0x4c5b("0x52"), "binary", _0x4c5b("0x2b"), _0x4c5b("0x54"), _0x4c5b("0x31"), _0x4c5b("0x55"), _0x4c5b("0x29"), _0x4c5b("0x1ea")][_0x4c5b("0x2d")]((format + "")[_0x4c5b("0x2c")]()))) {
          throw new TypeError(_0x4c5b("0x68") + format);
        }
        return this[_0x4c5b("0x165")]["defaultEncoding"] = format, this;
      };
      module[_0x4c5b("0x10")]["_write"] = function(canCreateDiscussions, isSlidingUp, stepCallback) {
        stepCallback(new Error(_0x4c5b("0x1eb")));
      };
      module[_0x4c5b("0x10")][_0x4c5b("0x1d7")] = null;
      module[_0x4c5b("0x10")]["end"] = function(b, value, a) {
        var resource = this["_writableState"];
        if (_0x4c5b("0x0") == typeof b) {
          a = b;
          b = null;
          value = null;
        } else {
          if (_0x4c5b("0x0") == typeof value) {
            a = value;
            value = null;
          }
        }
        if (null != b) {
          this[_0x4c5b("0x1a")](b, value);
        }
        if (resource[_0x4c5b("0x1d2")]) {
          resource["corked"] = 1;
          this["uncork"]();
        }
        if (!(resource[_0x4c5b("0x1ca")] || resource[_0x4c5b("0x1cb")])) {
          (function(fn, audio, d) {
            audio[_0x4c5b("0x1ca")] = true;
            write(fn, audio);
            if (d) {
              if (audio[_0x4c5b("0x1cb")]) {
                debug(d);
              } else {
                fn[_0x4c5b("0xd2")](_0x4c5b("0x1a8"), d);
              }
            }
            audio["ended"] = true;
            fn[_0x4c5b("0x163")] = false;
          })(this, resource, a);
        }
      };
      Object[_0x4c5b("0x4b")](module[_0x4c5b("0x10")], _0x4c5b("0x16a"), {
        "get" : function() {
          return void 0 !== this[_0x4c5b("0x165")] && this[_0x4c5b("0x165")][_0x4c5b("0x16a")];
        },
        "set" : function(mymuted) {
          if (this[_0x4c5b("0x165")]) {
            this[_0x4c5b("0x165")][_0x4c5b("0x16a")] = mymuted;
          }
        }
      });
      module[_0x4c5b("0x10")][_0x4c5b("0x17e")] = frontEndModuleConfig[_0x4c5b("0x17e")];
      module[_0x4c5b("0x10")][_0x4c5b("0x199")] = frontEndModuleConfig[_0x4c5b("0x1ec")];
      module[_0x4c5b("0x10")][_0x4c5b("0x16b")] = function(notifications, saveNotifs) {
        this[_0x4c5b("0x12c")]();
        saveNotifs(notifications);
      };
    })[_0x4c5b("0x4")](this, require(_0x4c5b("0x1b6")), _0x4c5b("0x49") == typeof global ? _0x4c5b("0x49") == typeof self ? _0x4c5b("0x49") == typeof window ? {} : window : self : global);
  }, {
    "./_stream_duplex" : 24,
    "./internal/streams/destroy" : 30,
    "./internal/streams/stream" : 31,
    "_process" : 22,
    "core-util-is" : 4,
    "inherits" : 10,
    "process-nextick-args" : 21,
    "safe-buffer" : 36,
    "util-deprecate" : 39
  }],
  29 : [function(saveNotifs, module) {
    var Long = saveNotifs("safe-buffer")["Buffer"];
    module["exports"] = function() {
      function Class() {
        !function(impromptuInstance, Impromptu) {
          if (!(impromptuInstance instanceof Impromptu)) {
            throw new TypeError(_0x4c5b("0x1ed"));
          }
        }(this, Class);
        this[_0x4c5b("0x185")] = null;
        this[_0x4c5b("0x190")] = null;
        this["length"] = 0;
      }
      return Class[_0x4c5b("0x10")][_0x4c5b("0x7")] = function(instancesTypes) {
        var dummy = {
          "data" : instancesTypes,
          "next" : null
        };
        if (0 < this["length"]) {
          this[_0x4c5b("0x190")][_0x4c5b("0x18f")] = dummy;
        } else {
          this[_0x4c5b("0x185")] = dummy;
        }
        this[_0x4c5b("0x190")] = dummy;
        ++this["length"];
      }, Class["prototype"][_0x4c5b("0x184")] = function(instancesTypes) {
        var dummy = {
          "data" : instancesTypes,
          "next" : this[_0x4c5b("0x185")]
        };
        if (0 === this["length"]) {
          this[_0x4c5b("0x190")] = dummy;
        }
        this[_0x4c5b("0x185")] = dummy;
        ++this["length"];
      }, Class["prototype"][_0x4c5b("0x18e")] = function() {
        if (0 !== this["length"]) {
          var _0x3e444b = this[_0x4c5b("0x185")][_0x4c5b("0x21")];
          return this["head"] = 1 === this["length"] ? this[_0x4c5b("0x190")] = null : this["head"][_0x4c5b("0x18f")], --this["length"], _0x3e444b;
        }
      }, Class["prototype"][_0x4c5b("0x1ee")] = function() {
        this[_0x4c5b("0x185")] = this[_0x4c5b("0x190")] = null;
        this["length"] = 0;
      }, Class[_0x4c5b("0x10")][_0x4c5b("0xc")] = function(_) {
        if (0 === this["length"]) {
          return "";
        }
        var path = this[_0x4c5b("0x185")];
        var gen = "" + path[_0x4c5b("0x21")];
        for (; path = path[_0x4c5b("0x18f")];) {
          gen = gen + (_ + path[_0x4c5b("0x21")]);
        }
        return gen;
      }, Class[_0x4c5b("0x10")][_0x4c5b("0x56")] = function(high) {
        if (0 === this["length"]) {
          return Long[_0x4c5b("0x43")](0);
        }
        if (1 === this["length"]) {
          return this[_0x4c5b("0x185")]["data"];
        }
        var local_mobile_core_user_remove_user_device = Long[_0x4c5b("0x58")](high >>> 0);
        var skulpt_name = this[_0x4c5b("0x185")];
        var width = 0;
        var canSuspendIdx;
        var wsFunction;
        var setwidth;
        for (; skulpt_name;) {
          canSuspendIdx = skulpt_name[_0x4c5b("0x21")];
          wsFunction = local_mobile_core_user_remove_user_device;
          setwidth = width;
          canSuspendIdx[_0x4c5b("0x1d")](wsFunction, setwidth);
          width = width + skulpt_name[_0x4c5b("0x21")]["length"];
          skulpt_name = skulpt_name[_0x4c5b("0x18f")];
        }
        return local_mobile_core_user_remove_user_device;
      }, Class;
    }();
  }, {
    "safe-buffer" : 36
  }],
  30 : [function(debu, data) {
    function constructor(isSummary, connection) {
      isSummary[_0x4c5b("0xcc")](_0x4c5b("0x47"), connection);
    }
    var debug = debu(_0x4c5b("0x167"));
    data[_0x4c5b("0x5")] = {
      "destroy" : function(value, error) {
        var mediaQueryStack = this;
        var inputWin = this[_0x4c5b("0x169")] && this["_readableState"][_0x4c5b("0x16a")];
        var winRef = this["_writableState"] && this[_0x4c5b("0x165")]["destroyed"];
        if (inputWin || winRef) {
          if (error) {
            error(value);
          } else {
            if (!(!value || this[_0x4c5b("0x165")] && this[_0x4c5b("0x165")][_0x4c5b("0x1d1")])) {
              debug(constructor, this, value);
            }
          }
        } else {
          if (this[_0x4c5b("0x169")]) {
            this["_readableState"][_0x4c5b("0x16a")] = true;
          }
          if (this[_0x4c5b("0x165")]) {
            this[_0x4c5b("0x165")][_0x4c5b("0x16a")] = true;
          }
          this[_0x4c5b("0x16b")](value || null, function(token) {
            if (!error && token) {
              debug(constructor, mediaQueryStack, token);
              if (mediaQueryStack["_writableState"]) {
                mediaQueryStack[_0x4c5b("0x165")][_0x4c5b("0x1d1")] = true;
              }
            } else {
              if (error) {
                error(token);
              }
            }
          });
        }
      },
      "undestroy" : function() {
        if (this["_readableState"]) {
          this[_0x4c5b("0x169")][_0x4c5b("0x16a")] = false;
          this[_0x4c5b("0x169")][_0x4c5b("0x172")] = false;
          this[_0x4c5b("0x169")]["ended"] = false;
          this[_0x4c5b("0x169")][_0x4c5b("0x180")] = false;
        }
        if (this[_0x4c5b("0x165")]) {
          this["_writableState"][_0x4c5b("0x16a")] = false;
          this["_writableState"][_0x4c5b("0x166")] = false;
          this["_writableState"][_0x4c5b("0x1ca")] = false;
          this[_0x4c5b("0x165")][_0x4c5b("0x1cb")] = false;
          this["_writableState"][_0x4c5b("0x1d1")] = false;
        }
      }
    };
  }, {
    "process-nextick-args" : 21
  }],
  31 : [function(require, canCreateDiscussions) {
    canCreateDiscussions[_0x4c5b("0x5")] = require("events")[_0x4c5b("0x1ef")];
  }, {
    "events" : 8
  }],
  32 : [function(saveNotifs, canCreateDiscussions) {
    canCreateDiscussions[_0x4c5b("0x5")] = saveNotifs("./readable")[_0x4c5b("0x1f0")];
  }, {
    "./readable" : 33
  }],
  33 : [function(render, result, data) {
    (data = result[_0x4c5b("0x5")] = render("./lib/_stream_readable.js"))[_0x4c5b("0x1f1")] = data;
    data["Readable"] = data;
    data[_0x4c5b("0x1f2")] = render(_0x4c5b("0x1f3"));
    data["Duplex"] = render("./lib/_stream_duplex.js");
    data[_0x4c5b("0x135")] = render("./lib/_stream_transform.js");
    data["PassThrough"] = render(_0x4c5b("0x1f4"));
  }, {
    "./lib/_stream_duplex.js" : 24,
    "./lib/_stream_passthrough.js" : 25,
    "./lib/_stream_readable.js" : 26,
    "./lib/_stream_transform.js" : 27,
    "./lib/_stream_writable.js" : 28
  }],
  34 : [function(saveNotifs, canCreateDiscussions) {
    canCreateDiscussions[_0x4c5b("0x5")] = saveNotifs(_0x4c5b("0x1f5"))[_0x4c5b("0x135")];
  }, {
    "./readable" : 33
  }],
  35 : [function(require, tasks) {
    tasks[_0x4c5b("0x5")] = require(_0x4c5b("0x1f3"));
  }, {
    "./lib/_stream_writable.js" : 28
  }],
  36 : [function(nextValFn, chData, prop) {
    function beforeFix(val, prop) {
      var name;
      for (name in val) {
        prop[name] = val[name];
      }
    }
    function value(name, callback, message) {
      return event(name, callback, message);
    }
    var val = nextValFn("buffer");
    var event = val[_0x4c5b("0x1e")];
    if (event[_0x4c5b("0x4d")] && event[_0x4c5b("0x43")] && event[_0x4c5b("0x58")] && event[_0x4c5b("0x4f")]) {
      chData[_0x4c5b("0x5")] = val;
    } else {
      beforeFix(val, prop);
      prop[_0x4c5b("0x1e")] = value;
    }
    beforeFix(event, value);
    value["from"] = function(onCancel, s1, hero) {
      if (_0x4c5b("0x11") == typeof onCancel) {
        throw new TypeError(_0x4c5b("0x1f6"));
      }
      return event(onCancel, s1, hero);
    };
    value[_0x4c5b("0x43")] = function(pass, previousError, begin) {
      if (_0x4c5b("0x11") != typeof pass) {
        throw new TypeError(_0x4c5b("0x1f7"));
      }
      var res = event(pass);
      return void 0 === previousError ? res["fill"](0) : _0x4c5b("0x12") == typeof begin ? res["fill"](previousError, begin) : res[_0x4c5b("0x4e")](previousError), res;
    };
    value[_0x4c5b("0x58")] = function(onCancel) {
      if (_0x4c5b("0x11") != typeof onCancel) {
        throw new TypeError(_0x4c5b("0x1f7"));
      }
      return event(onCancel);
    };
    value[_0x4c5b("0x4f")] = function(a) {
      if (_0x4c5b("0x11") != typeof a) {
        throw new TypeError(_0x4c5b("0x1f7"));
      }
      return val["SlowBuffer"](a);
    };
  }, {
    "buffer" : 3
  }],
  37 : [function(require, beacons) {
    function data() {
      uglifyConf[_0x4c5b("0x4")](this);
    }
    beacons[_0x4c5b("0x5")] = data;
    var uglifyConf = require(_0x4c5b("0x192"))[_0x4c5b("0x1ef")];
    require("inherits")(data, uglifyConf);
    data[_0x4c5b("0x1f8")] = require(_0x4c5b("0x1f9"));
    data[_0x4c5b("0x1f2")] = require(_0x4c5b("0x1fa"));
    data[_0x4c5b("0x1fb")] = require(_0x4c5b("0x1fc"));
    data[_0x4c5b("0x135")] = require(_0x4c5b("0x1fd"));
    data[_0x4c5b("0x1f0")] = require(_0x4c5b("0x1fe"));
    data[_0x4c5b("0x1f1")] = data;
    data[_0x4c5b("0x10")][_0x4c5b("0x1a0")] = function(p, canCreateDiscussions) {
      function type(val) {
        if (p[_0x4c5b("0x163")] && false === p[_0x4c5b("0x1a")](val) && filter[_0x4c5b("0x1b0")]) {
          filter[_0x4c5b("0x1b0")]();
        }
      }
      function B103() {
        if (filter[_0x4c5b("0x162")] && filter[_0x4c5b("0x18c")]) {
          filter[_0x4c5b("0x18c")]();
        }
      }
      function B104() {
        if (!_0x41f6be) {
          _0x41f6be = true;
          p[_0x4c5b("0x12c")]();
        }
      }
      function done() {
        if (!_0x41f6be) {
          _0x41f6be = true;
          if ("function" == typeof p[_0x4c5b("0x17e")]) {
            p[_0x4c5b("0x17e")]();
          }
        }
      }
      function cb(gistId) {
        if (removeAllListeners(), 0 === uglifyConf[_0x4c5b("0xd6")](this, _0x4c5b("0x47"))) {
          throw gistId;
        }
      }
      function removeAllListeners() {
        filter[_0x4c5b("0xd3")](_0x4c5b("0x21"), type);
        p[_0x4c5b("0xd3")](_0x4c5b("0x1a3"), B103);
        filter[_0x4c5b("0xd3")](_0x4c5b("0x12c"), B104);
        filter["removeListener"](_0x4c5b("0x198"), done);
        filter[_0x4c5b("0xd3")](_0x4c5b("0x47"), cb);
        p[_0x4c5b("0xd3")]("error", cb);
        filter[_0x4c5b("0xd3")](_0x4c5b("0x12c"), removeAllListeners);
        filter[_0x4c5b("0xd3")](_0x4c5b("0x198"), removeAllListeners);
        p[_0x4c5b("0xd3")](_0x4c5b("0x198"), removeAllListeners);
      }
      var filter = this;
      filter["on"](_0x4c5b("0x21"), type);
      p["on"](_0x4c5b("0x1a3"), B103);
      if (!(p["_isStdio"] || canCreateDiscussions && false === canCreateDiscussions[_0x4c5b("0x12c")])) {
        filter["on"](_0x4c5b("0x12c"), B104);
        filter["on"](_0x4c5b("0x198"), done);
      }
      var _0x41f6be = false;
      return filter["on"]("error", cb), p["on"](_0x4c5b("0x47"), cb), filter["on"](_0x4c5b("0x12c"), removeAllListeners), filter["on"](_0x4c5b("0x198"), removeAllListeners), p["on"](_0x4c5b("0x198"), removeAllListeners), p[_0x4c5b("0xcc")](_0x4c5b("0x1a0"), filter), p;
    };
  }, {
    "events" : 8,
    "inherits" : 10,
    "readable-stream/duplex.js" : 23,
    "readable-stream/passthrough.js" : 32,
    "readable-stream/readable.js" : 33,
    "readable-stream/transform.js" : 34,
    "readable-stream/writable.js" : 35
  }],
  38 : [function(saveNotifs, isSlidingUp, exports) {
    function connect(remoteID) {
      var data;
      switch(this[_0x4c5b("0x17a")] = function(data) {
        var cleanData = function(encoding) {
          if (!encoding) {
            return _0x4c5b("0x17");
          }
          var _0x389e82;
          for (;;) {
            switch(encoding) {
              case _0x4c5b("0x17"):
              case _0x4c5b("0x28"):
                return _0x4c5b("0x17");
              case _0x4c5b("0x54"):
              case _0x4c5b("0x31"):
              case _0x4c5b("0x55"):
              case _0x4c5b("0x29"):
                return "utf16le";
              case "latin1":
              case _0x4c5b("0x27"):
                return _0x4c5b("0x53");
              case "base64":
              case _0x4c5b("0x52"):
              case "hex":
                return encoding;
              default:
                if (_0x389e82) {
                  return;
                }
                encoding = ("" + encoding)[_0x4c5b("0x2c")]();
                _0x389e82 = true;
            }
          }
        }(data);
        if (_0x4c5b("0x12") != typeof cleanData && (_thirdPartJs["isEncoding"] === finish || !finish(data))) {
          throw new Error(_0x4c5b("0x68") + data);
        }
        return cleanData || data;
      }(remoteID), this[_0x4c5b("0x17a")]) {
        case _0x4c5b("0x55"):
          this[_0x4c5b("0x1ff")] = _validateCaptcha;
          this["end"] = tmp;
          data = 4;
          break;
        case "utf8":
          this[_0x4c5b("0x200")] = TestBadIndex;
          data = 4;
          break;
        case _0x4c5b("0x2b"):
          this[_0x4c5b("0x1ff")] = clickWithWebdriver;
          this["end"] = end;
          data = 3;
          break;
        default:
          return this[_0x4c5b("0x1a")] = extractPresetLocal, void(this[_0x4c5b("0x12c")] = release);
      }
      this[_0x4c5b("0x201")] = 0;
      this[_0x4c5b("0x202")] = 0;
      this["lastChar"] = _thirdPartJs[_0x4c5b("0x58")](data);
    }
    function eq(i) {
      return 127 >= i ? 0 : 6 == i >> 5 ? 2 : 14 == i >> 4 ? 3 : 30 == i >> 3 ? 4 : -1;
    }
    function TestBadIndex(handlers) {
      var data = this["lastTotal"] - this[_0x4c5b("0x201")];
      var opt = function(EMSarray, extra, originalEventData) {
        if (128 != (192 & extra[0])) {
          return EMSarray[_0x4c5b("0x201")] = 0, _0x4c5b("0x203")[_0x4c5b("0x204")](originalEventData);
        }
        if (1 < EMSarray["lastNeed"] && 1 < extra["length"]) {
          if (128 != (192 & extra[1])) {
            return EMSarray[_0x4c5b("0x201")] = 1, _0x4c5b("0x203")[_0x4c5b("0x204")](originalEventData + 1);
          }
          if (2 < EMSarray[_0x4c5b("0x201")] && 2 < extra["length"] && 128 != (192 & extra[2])) {
            return EMSarray[_0x4c5b("0x201")] = 2, _0x4c5b("0x203")[_0x4c5b("0x204")](originalEventData + 2);
          }
        }
      }(this, handlers, data);
      return void 0 === opt ? this[_0x4c5b("0x201")] <= handlers["length"] ? (handlers[_0x4c5b("0x1d")](this["lastChar"], data, 0, this[_0x4c5b("0x201")]), this["lastChar"][_0x4c5b("0x25")](this[_0x4c5b("0x17a")], 0, this[_0x4c5b("0x202")])) : (handlers[_0x4c5b("0x1d")](this["lastChar"], data, 0, handlers["length"]), void(this[_0x4c5b("0x201")] -= handlers["length"])) : opt;
    }
    function _validateCaptcha(p, m) {
      if (0 == (p["length"] - m) % 2) {
        var 0 = p[_0x4c5b("0x25")](_0x4c5b("0x55"), m);
        if (0) {
          var _0x199bd1 = 0[_0x4c5b("0xa")](0["length"] - 1);
          if (55296 <= _0x199bd1 && 56319 >= _0x199bd1) {
            return this[_0x4c5b("0x201")] = 2, this[_0x4c5b("0x202")] = 4, this[_0x4c5b("0x205")][0] = p[p["length"] - 2], this[_0x4c5b("0x205")][1] = p[p["length"] - 1], 0[_0x4c5b("0x1b")](0, -1);
          }
        }
        return 0;
      }
      return this[_0x4c5b("0x201")] = 1, this[_0x4c5b("0x202")] = 2, this[_0x4c5b("0x205")][0] = p[p["length"] - 1], p[_0x4c5b("0x25")](_0x4c5b("0x55"), m, p["length"] - 1);
    }
    function tmp(id) {
      var tmp = id && id["length"] ? this[_0x4c5b("0x1a")](id) : "";
      if (this["lastNeed"]) {
        var depth = this["lastTotal"] - this[_0x4c5b("0x201")];
        return tmp + this[_0x4c5b("0x205")][_0x4c5b("0x25")](_0x4c5b("0x55"), 0, depth);
      }
      return tmp;
    }
    function clickWithWebdriver(selector, context) {
      var NWMatcher = (selector["length"] - context) % 3;
      return 0 == NWMatcher ? selector[_0x4c5b("0x25")](_0x4c5b("0x2b"), context) : (this[_0x4c5b("0x201")] = 3 - NWMatcher, this[_0x4c5b("0x202")] = 3, 1 == NWMatcher ? this[_0x4c5b("0x205")][0] = selector[selector["length"] - 1] : (this["lastChar"][0] = selector[selector["length"] - 2], this[_0x4c5b("0x205")][1] = selector[selector["length"] - 1]), selector[_0x4c5b("0x25")](_0x4c5b("0x2b"), context, selector["length"] - NWMatcher));
    }
    function end(instance) {
      var opt_by = instance && instance["length"] ? this[_0x4c5b("0x1a")](instance) : "";
      return this[_0x4c5b("0x201")] ? opt_by + this["lastChar"][_0x4c5b("0x25")](_0x4c5b("0x2b"), 0, 3 - this["lastNeed"]) : opt_by;
    }
    function extractPresetLocal(callback) {
      return callback[_0x4c5b("0x25")](this[_0x4c5b("0x17a")]);
    }
    function release(value) {
      return value && value["length"] ? this["write"](value) : "";
    }
    var _thirdPartJs = saveNotifs(_0x4c5b("0x1e2"))["Buffer"];
    var finish = _thirdPartJs["isEncoding"] || function(includeString) {
      switch((includeString = "" + includeString) && includeString[_0x4c5b("0x2c")]()) {
        case _0x4c5b("0x2a"):
        case "utf8":
        case _0x4c5b("0x28"):
        case _0x4c5b("0x52"):
        case _0x4c5b("0x27"):
        case _0x4c5b("0x2b"):
        case _0x4c5b("0x54"):
        case _0x4c5b("0x31"):
        case _0x4c5b("0x55"):
        case _0x4c5b("0x29"):
        case _0x4c5b("0x1ea"):
          return true;
        default:
          return false;
      }
    };
    exports[_0x4c5b("0x17c")] = connect;
    connect[_0x4c5b("0x10")][_0x4c5b("0x1a")] = function(options) {
      if (0 === options["length"]) {
        return "";
      }
      var r;
      var i;
      if (this[_0x4c5b("0x201")]) {
        if (void 0 === (r = this["fillLast"](options))) {
          return "";
        }
        i = this[_0x4c5b("0x201")];
        this[_0x4c5b("0x201")] = 0;
      } else {
        i = 0;
      }
      return i < options["length"] ? r ? r + this[_0x4c5b("0x1ff")](options, i) : this["text"](options, i) : r || "";
    };
    connect["prototype"]["end"] = function(b) {
      var opt_by = b && b["length"] ? this[_0x4c5b("0x1a")](b) : "";
      return this[_0x4c5b("0x201")] ? opt_by + _0x4c5b("0x203")[_0x4c5b("0x204")](this[_0x4c5b("0x202")] - this[_0x4c5b("0x201")]) : opt_by;
    };
    connect[_0x4c5b("0x10")]["text"] = function(arr, i) {
      var value = function(EMSarray, a, nconst) {
        var i = a["length"] - 1;
        if (i < nconst) {
          return 0;
        }
        var result = eq(a[i]);
        return 0 <= result ? (0 < result && (EMSarray[_0x4c5b("0x201")] = result - 1), result) : --i < nconst ? 0 : 0 <= (result = eq(a[i])) ? (0 < result && (EMSarray[_0x4c5b("0x201")] = result - 2), result) : --i < nconst ? 0 : 0 <= (result = eq(a[i])) ? (0 < result && (2 === result ? result = 0 : EMSarray[_0x4c5b("0x201")] = result - 3), result) : 0;
      }(this, arr, i);
      if (!this["lastNeed"]) {
        return arr[_0x4c5b("0x25")](_0x4c5b("0x17"), i);
      }
      this[_0x4c5b("0x202")] = value;
      var series = arr["length"] - (value - this[_0x4c5b("0x201")]);
      return arr[_0x4c5b("0x1d")](this["lastChar"], 0, series), arr[_0x4c5b("0x25")](_0x4c5b("0x17"), i, series);
    };
    connect[_0x4c5b("0x10")]["fillLast"] = function(PL$103) {
      return this[_0x4c5b("0x201")] <= PL$103["length"] ? (PL$103[_0x4c5b("0x1d")](this[_0x4c5b("0x205")], this[_0x4c5b("0x202")] - this[_0x4c5b("0x201")], 0, this[_0x4c5b("0x201")]), this[_0x4c5b("0x205")]["toString"](this["encoding"], 0, this[_0x4c5b("0x202")])) : void(PL$103[_0x4c5b("0x1d")](this[_0x4c5b("0x205")], this[_0x4c5b("0x202")] - this[_0x4c5b("0x201")], 0, PL$103["length"]), this[_0x4c5b("0x201")] -= PL$103["length"]);
    };
  }, {
    "safe-buffer" : 36
  }],
  39 : [function(isSlidingUp, canCreateDiscussions) {
    (function(default_maximize) {
      function commaStringToArray(value) {
        try {
          if (!default_maximize[_0x4c5b("0x206")]) {
            return false;
          }
        } catch (_0x4661fa) {
          return false;
        }
        var action = default_maximize[_0x4c5b("0x206")][value];
        return null != action && _0x4c5b("0x207") === (action + "")[_0x4c5b("0x2c")]();
      }
      canCreateDiscussions[_0x4c5b("0x5")] = function(_getModal, a) {
        if (commaStringToArray(_0x4c5b("0x208"))) {
          return _getModal;
        }
        var _0x2ddece = false;
        return function() {
          if (!_0x2ddece) {
            if (commaStringToArray(_0x4c5b("0x209"))) {
              throw new Error(a);
            }
            if (commaStringToArray(_0x4c5b("0x20a"))) {
              console["trace"](a);
            } else {
              console[_0x4c5b("0x20b")](a);
            }
            _0x2ddece = true;
          }
          return _getModal[_0x4c5b("0x36")](this, arguments);
        };
      };
    })[_0x4c5b("0x4")](this, _0x4c5b("0x49") == typeof global ? "undefined" == typeof self ? "undefined" == typeof window ? {} : window : self : global);
  }, {}],
  40 : [function(canCreateDiscussions, isSlidingUp, PL$22) {
    arguments[4][10][0]["apply"](PL$22, arguments);
  }, {
    "dup" : 10
  }],
  41 : [function(canCreateDiscussions, module) {
    module["exports"] = function(data) {
      return data && _0x4c5b("0xc7") == typeof data && _0x4c5b("0x0") == typeof data["copy"] && _0x4c5b("0x0") == typeof data["fill"] && "function" == typeof data["readUInt8"];
    };
  }, {}],
  42 : [function(overload, canCreateDiscussions, obj) {
    (function(boardManager, arrayOfSelects) {
      function value(array, n) {
        var args = {
          "seen" : [],
          "stylize" : stylizeNoColor
        };
        return 3 <= arguments["length"] && (args[_0x4c5b("0x20c")] = arguments[2]), 4 <= arguments["length"] && (args[_0x4c5b("0x20d")] = arguments[3]), callback(n) ? args[_0x4c5b("0x20e")] = n : n && obj[_0x4c5b("0x20f")](args, n), $(args[_0x4c5b("0x20e")]) && (args[_0x4c5b("0x20e")] = false), $(args[_0x4c5b("0x20c")]) && (args[_0x4c5b("0x20c")] = 2), $(args["colors"]) && (args["colors"] = false), $(args["customInspect"]) && (args[_0x4c5b("0x210")] = true), args[_0x4c5b("0x20d")] && 
        (args[_0x4c5b("0x211")] = f), fn(args, array, args[_0x4c5b("0x20c")]);
      }
      function f(text, i) {
        var style = value[_0x4c5b("0x212")][i];
        return style ? "\u001b[" + value[_0x4c5b("0x20d")][style][0] + "m" + text + "\u001b[" + value[_0x4c5b("0x20d")][style][1] + "m" : text;
      }
      function stylizeNoColor(str) {
        return str;
      }
      function fn(x, target, value) {
        if (x[_0x4c5b("0x210")] && target && mixin(target["inspect"]) && target[_0x4c5b("0x61")] !== obj[_0x4c5b("0x61")] && (!target["constructor"] || target[_0x4c5b("0xdc")][_0x4c5b("0x10")] !== target)) {
          var e = target[_0x4c5b("0x61")](value, x);
          return trigger(e) || (e = fn(x, e, value)), e;
        }
        var cb = function(element, input) {
          if ($(input)) {
            return element[_0x4c5b("0x211")](_0x4c5b("0x49"), _0x4c5b("0x49"));
          }
          if (trigger(input)) {
            var type = "" + JSON[_0x4c5b("0x213")](input)[_0x4c5b("0x3e")](/^"|"$/g, "")["replace"](/'/g, "'")[_0x4c5b("0x3e")](/\\"/g, '"');
            return element["stylize"](type, "string");
          }
          return r(input) ? element[_0x4c5b("0x211")]("" + input, "number") : callback(input) ? element[_0x4c5b("0x211")]("" + input, "boolean") : is(input) ? element["stylize"]("null", "null") : void 0;
        }(x, target);
        if (cb) {
          return cb;
        }
        var cssModel = Object[_0x4c5b("0x12d")](target);
        var data = (_data = {}, cssModel[_0x4c5b("0x12e")](function(oid) {
          _data[oid] = true;
        }), _data);
        var _data;
        if (x["showHidden"] && (cssModel = Object[_0x4c5b("0x214")](target)), contains(target) && (0 <= cssModel[_0x4c5b("0x2d")](_0x4c5b("0x215")) || 0 <= cssModel[_0x4c5b("0x2d")](_0x4c5b("0x216")))) {
          return toJSON(target);
        }
        if (0 === cssModel["length"]) {
          if (mixin(target)) {
            var opt_by = target["name"] ? ": " + target[_0x4c5b("0x217")] : "";
            return x[_0x4c5b("0x211")](_0x4c5b("0x218") + opt_by + "]", _0x4c5b("0x219"));
          }
          if (d(target)) {
            return x[_0x4c5b("0x211")](RegExp["prototype"][_0x4c5b("0x25")][_0x4c5b("0x4")](target), _0x4c5b("0x21a"));
          }
          if (isNode(target)) {
            return x["stylize"](Date["prototype"][_0x4c5b("0x25")][_0x4c5b("0x4")](target), _0x4c5b("0x21b"));
          }
          if (contains(target)) {
            return toJSON(target);
          }
        }
        var f = "";
        var set = false;
        var values = ["{", "}"];
        var idx;
        return (build(target) && (set = true, values = ["[", "]"]), mixin(target)) && (f = _0x4c5b("0x21c") + (target[_0x4c5b("0x217")] ? ": " + target["name"] : "") + "]"), d(target) && (f = " " + RegExp[_0x4c5b("0x10")][_0x4c5b("0x25")]["call"](target)), isNode(target) && (f = " " + Date[_0x4c5b("0x10")][_0x4c5b("0x21d")]["call"](target)), contains(target) && (f = " " + toJSON(target)), 0 !== cssModel["length"] || set && 0 != target["length"] ? 0 > value ? d(target) ? x[_0x4c5b("0x211")](RegExp[_0x4c5b("0x10")][_0x4c5b("0x25")]["call"](target), 
        _0x4c5b("0x21a")) : x[_0x4c5b("0x211")]("[Object]", _0x4c5b("0x219")) : (x["seen"][_0x4c5b("0x7")](target), idx = set ? function(value, target, x2, args, cssModel) {
          var a = [];
          var testNum = 0;
          var targetComponentId = target["length"];
          for (; testNum < targetComponentId; ++testNum) {
            if (join(target, testNum + "")) {
              a[_0x4c5b("0x7")](func(value, target, x2, args, testNum + "", true));
            } else {
              a[_0x4c5b("0x7")]("");
            }
          }
          return cssModel[_0x4c5b("0x12e")](function(i) {
            if (!i[_0x4c5b("0x21e")](/^\d+$/)) {
              a["push"](func(value, target, x2, args, i, true));
            }
          }), a;
        }(x, target, value, data, cssModel) : cssModel[_0x4c5b("0x21f")](function(i) {
          return func(x, target, value, data, i, set);
        }), x[_0x4c5b("0x220")][_0x4c5b("0x221")](), function(value, val, array) {
          return 60 < value[_0x4c5b("0x222")](function(canCreateDiscussions, href) {
            return 0, 0 <= href[_0x4c5b("0x2d")]("") && 0, canCreateDiscussions + href[_0x4c5b("0x3e")](/\u001b\[\d\d?m/g, "")["length"] + 1;
          }, 0) ? array[0] + ("" === val ? "" : val + "") + " " + value["join"](",") + " " + array[1] : array[0] + val + " " + value[_0x4c5b("0xc")](", ") + " " + array[1];
        }(idx, f, values)) : values[0] + f + values[1];
      }
      function toJSON(f) {
        return "[" + Error[_0x4c5b("0x10")][_0x4c5b("0x25")][_0x4c5b("0x4")](f) + "]";
      }
      function func(name, obj, key, arr, prop, array) {
        var filter;
        var value;
        var entry;
        if ((entry = Object["getOwnPropertyDescriptor"](obj, prop) || {
          "value" : obj[prop]
        })["get"] ? value = entry[_0x4c5b("0x8d")] ? name[_0x4c5b("0x211")](_0x4c5b("0x223"), _0x4c5b("0x219")) : name[_0x4c5b("0x211")](_0x4c5b("0x224"), _0x4c5b("0x219")) : entry[_0x4c5b("0x8d")] && (value = name[_0x4c5b("0x211")](_0x4c5b("0x225"), _0x4c5b("0x219"))), join(arr, prop) || (filter = "[" + prop + "]"), value || (0 > name[_0x4c5b("0x220")][_0x4c5b("0x2d")](entry["value"]) ? -1 < (value = is(key) ? fn(name, entry[_0x4c5b("0x226")], null) : fn(name, entry[_0x4c5b("0x226")], key - 1))[_0x4c5b("0x2d")]("") && 
        (value = array ? value[_0x4c5b("0x227")]("")[_0x4c5b("0x21f")](function(canCreateDiscussions) {
          return "  " + canCreateDiscussions;
        })["join"]("")["substr"](2) : "" + value[_0x4c5b("0x227")]("")[_0x4c5b("0x21f")](function(canCreateDiscussions) {
          return _0x4c5b("0x228") + canCreateDiscussions;
        })[_0x4c5b("0xc")]("")) : value = name[_0x4c5b("0x211")]("[Circular]", _0x4c5b("0x219"))), $(filter)) {
          if (array && prop[_0x4c5b("0x21e")](/^\d+$/)) {
            return value;
          }
          if ((filter = JSON[_0x4c5b("0x213")]("" + prop))[_0x4c5b("0x21e")](/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
            filter = filter[_0x4c5b("0x33")](1, filter["length"] - 2);
            filter = name[_0x4c5b("0x211")](filter, _0x4c5b("0x217"));
          } else {
            filter = filter[_0x4c5b("0x3e")](/'/g, "'")[_0x4c5b("0x3e")](/\\"/g, '"')[_0x4c5b("0x3e")](/(^"|"$)/g, "");
            filter = name["stylize"](filter, _0x4c5b("0x12"));
          }
        }
        return filter + ": " + value;
      }
      function build(arr) {
        return Array["isArray"](arr);
      }
      function callback(tree) {
        return _0x4c5b("0x93") == typeof tree;
      }
      function is(selector) {
        return null === selector;
      }
      function r(n) {
        return _0x4c5b("0x11") == typeof n;
      }
      function trigger(type) {
        return _0x4c5b("0x12") == typeof type;
      }
      function $(name) {
        return void 0 === name;
      }
      function d(value) {
        return toString(value) && "[object RegExp]" === isArray(value);
      }
      function toString(num) {
        return _0x4c5b("0xc7") == typeof num && null !== num;
      }
      function isNode(obj) {
        return toString(obj) && _0x4c5b("0x9d") === isArray(obj);
      }
      function contains(obj) {
        return toString(obj) && (_0x4c5b("0x229") === isArray(obj) || obj instanceof Error);
      }
      function mixin(targetClass) {
        return _0x4c5b("0x0") == typeof targetClass;
      }
      function isArray(vArg) {
        return Object["prototype"][_0x4c5b("0x25")][_0x4c5b("0x4")](vArg);
      }
      function change_btn(hide) {
        return 10 > hide ? "0" + hide[_0x4c5b("0x25")](10) : hide[_0x4c5b("0x25")](10);
      }
      function join(array, glue) {
        return Object[_0x4c5b("0x10")]["hasOwnProperty"][_0x4c5b("0x4")](array, glue);
      }
      var yieldRe = /%[sdj%]/g;
      obj[_0x4c5b("0x22a")] = function(onSet) {
        if (!trigger(onSet)) {
          var which = [];
          var i = 0;
          for (; i < arguments["length"]; i++) {
            which[_0x4c5b("0x7")](value(arguments[i]));
          }
          return which[_0x4c5b("0xc")](" ");
        }
        i = 1;
        var result = arguments;
        var size = result["length"];
        var temp = (onSet + "")[_0x4c5b("0x3e")](yieldRe, function(canCreateDiscussions) {
          if ("%%" === canCreateDiscussions) {
            return "%";
          }
          if (i >= size) {
            return canCreateDiscussions;
          }
          switch(canCreateDiscussions) {
            case "%s":
              return result[i++] + "";
            case "%d":
              return +result[i++];
            case "%j":
              try {
                return JSON["stringify"](result[i++]);
              } catch (_0x39ad00) {
                return "[Circular]";
              }
            default:
              return canCreateDiscussions;
          }
        });
        var item = result[i];
        for (; i < size; item = result[++i]) {
          temp = temp + (is(item) || !toString(item) ? " " + item : " " + value(item));
        }
        return temp;
      };
      obj[_0x4c5b("0x22b")] = function(elem, msg) {
        if ($(arrayOfSelects[_0x4c5b("0x22c")])) {
          return function() {
            return obj[_0x4c5b("0x22b")](elem, msg)[_0x4c5b("0x36")](this, arguments);
          };
        }
        if (true === boardManager["noDeprecation"]) {
          return elem;
        }
        var _0xc0ab0 = false;
        return function() {
          if (!_0xc0ab0) {
            if (boardManager[_0x4c5b("0x209")]) {
              throw new Error(msg);
            }
            if (boardManager["traceDeprecation"]) {
              console["trace"](msg);
            } else {
              console["error"](msg);
            }
            _0xc0ab0 = true;
          }
          return elem[_0x4c5b("0x36")](this, arguments);
        };
      };
      var __WEBPACK_IMPORTED_MODULE_2__array_index__ = {};
      var content;
      obj[_0x4c5b("0x195")] = function(b) {
        if ($(content) && (content = boardManager[_0x4c5b("0x157")][_0x4c5b("0x22d")] || ""), b = b[_0x4c5b("0x106")](), !__WEBPACK_IMPORTED_MODULE_2__array_index__[b]) {
          if ((new RegExp("\b" + b + "\b", "i"))[_0x4c5b("0x22e")](content)) {
            var previousState = boardManager[_0x4c5b("0x22f")];
            __WEBPACK_IMPORTED_MODULE_2__array_index__[b] = function() {
              var d = obj["format"][_0x4c5b("0x36")](obj, arguments);
              console[_0x4c5b("0x47")](_0x4c5b("0x230"), b, previousState, d);
            };
          } else {
            __WEBPACK_IMPORTED_MODULE_2__array_index__[b] = function() {
            };
          }
        }
        return __WEBPACK_IMPORTED_MODULE_2__array_index__[b];
      };
      obj["inspect"] = value;
      value[_0x4c5b("0x20d")] = {
        "bold" : [1, 22],
        "italic" : [3, 23],
        "underline" : [4, 24],
        "inverse" : [7, 27],
        "white" : [37, 39],
        "grey" : [90, 39],
        "black" : [30, 39],
        "blue" : [34, 39],
        "cyan" : [36, 39],
        "green" : [32, 39],
        "magenta" : [35, 39],
        "red" : [31, 39],
        "yellow" : [33, 39]
      };
      value[_0x4c5b("0x212")] = {
        "special" : "cyan",
        "number" : _0x4c5b("0x231"),
        "boolean" : _0x4c5b("0x231"),
        "undefined" : "grey",
        "null" : _0x4c5b("0x232"),
        "string" : _0x4c5b("0x233"),
        "date" : _0x4c5b("0x234"),
        "regexp" : _0x4c5b("0x235")
      };
      obj[_0x4c5b("0x20")] = build;
      obj[_0x4c5b("0x92")] = callback;
      obj[_0x4c5b("0x94")] = is;
      obj["isNullOrUndefined"] = function(canCreateDiscussions) {
        return null == canCreateDiscussions;
      };
      obj["isNumber"] = r;
      obj[_0x4c5b("0x97")] = trigger;
      obj[_0x4c5b("0x236")] = function(canCreateDiscussions) {
        return _0x4c5b("0x98") == typeof canCreateDiscussions;
      };
      obj[_0x4c5b("0x99")] = $;
      obj[_0x4c5b("0x9a")] = d;
      obj[_0x4c5b("0x9c")] = toString;
      obj[_0x4c5b("0x237")] = isNode;
      obj[_0x4c5b("0x9e")] = contains;
      obj[_0x4c5b("0x9f")] = mixin;
      obj[_0x4c5b("0xa0")] = function(canCreateDiscussions) {
        return null === canCreateDiscussions || _0x4c5b("0x93") == typeof canCreateDiscussions || _0x4c5b("0x11") == typeof canCreateDiscussions || _0x4c5b("0x12") == typeof canCreateDiscussions || _0x4c5b("0x98") == typeof canCreateDiscussions || void 0 === canCreateDiscussions;
      };
      obj[_0x4c5b("0x1c")] = overload(_0x4c5b("0x238"));
      var months = [_0x4c5b("0x239"), _0x4c5b("0x23a"), _0x4c5b("0x23b"), "Apr", _0x4c5b("0x23c"), _0x4c5b("0x23d"), _0x4c5b("0x23e"), _0x4c5b("0x23f"), _0x4c5b("0x240"), _0x4c5b("0x241"), _0x4c5b("0x242"), _0x4c5b("0x243")];
      obj["log"] = function() {
        var stringConstructorEndTime;
        var cx;
        console[_0x4c5b("0x244")](_0x4c5b("0x245"), (stringConstructorEndTime = new Date, cx = [change_btn(stringConstructorEndTime[_0x4c5b("0x246")]()), change_btn(stringConstructorEndTime[_0x4c5b("0x247")]()), change_btn(stringConstructorEndTime[_0x4c5b("0x248")]())]["join"](":"), [stringConstructorEndTime[_0x4c5b("0x249")](), months[stringConstructorEndTime[_0x4c5b("0x24a")]()], cx]["join"](" ")), obj[_0x4c5b("0x22a")][_0x4c5b("0x36")](obj, arguments));
      };
      obj[_0x4c5b("0xf4")] = overload(_0x4c5b("0xf4"));
      obj[_0x4c5b("0x20f")] = function(values, obj) {
        if (!obj || !toString(obj)) {
          return values;
        }
        var h = Object[_0x4c5b("0x12d")](obj);
        var i = h["length"];
        for (; i--;) {
          values[h[i]] = obj[h[i]];
        }
        return values;
      };
    })[_0x4c5b("0x4")](this, overload(_0x4c5b("0x1b6")), "undefined" == typeof global ? _0x4c5b("0x49") == typeof self ? _0x4c5b("0x49") == typeof window ? {} : window : self : global);
  }, {
    "./support/isBuffer" : 41,
    "_process" : 22,
    "inherits" : 40
  }],
  43 : [function(canCreateDiscussions, isSlidingUp, mmCoreSplitViewBlock) {
    arguments[4][5][0][_0x4c5b("0x36")](mmCoreSplitViewBlock, arguments);
  }, {
    "./lib/uint32" : 44,
    "./lib/uint64" : 45,
    "dup" : 5
  }],
  44 : [function(canCreateDiscussions, isSlidingUp, mmCoreSplitViewBlock) {
    arguments[4][6][0][_0x4c5b("0x36")](mmCoreSplitViewBlock, arguments);
  }, {
    "dup" : 6
  }],
  45 : [function(canCreateDiscussions, isSlidingUp, mmCoreSplitViewBlock) {
    arguments[4][7][0][_0x4c5b("0x36")](mmCoreSplitViewBlock, arguments);
  }, {
    "dup" : 7
  }],
  46 : [function(saveNotifs, ParamLocation) {
    (function(ByteBuffer) {
      !function(window) {
        function URI() {
          return 2 == arguments["length"] ? (new URI(arguments[1]))[_0x4c5b("0x14f")](arguments[0])[_0x4c5b("0x14e")]() : this instanceof URI ? void module["call"](this, arguments[0]) : new URI(arguments[0]);
        }
        function module(draggable) {
          return this[_0x4c5b("0x24b")] = draggable instanceof $ ? draggable[_0x4c5b("0xad")]() : $(draggable), this["v1"] = this[_0x4c5b("0x24b")][_0x4c5b("0xad")]()[_0x4c5b("0xac")](classesExtendsFrom), this["v2"] = this[_0x4c5b("0x24b")][_0x4c5b("0xad")]()[_0x4c5b("0xac")](node), this["v3"] = this[_0x4c5b("0x24b")][_0x4c5b("0xad")](), this["v4"] = this[_0x4c5b("0x24b")][_0x4c5b("0xad")]()[_0x4c5b("0xb3")](tmp), this[_0x4c5b("0x24c")] = 0, this[_0x4c5b("0x24d")] = 0, this[_0x4c5b("0x24e")] = null, 
          this;
        }
        var $ = saveNotifs(_0x4c5b("0xe0"))[_0x4c5b("0xa2")];
        $[_0x4c5b("0x10")][_0x4c5b("0x24f")] = function(k, length) {
          var t = node["_low"];
          var index = node[_0x4c5b("0xa7")];
          var start;
          var t2;
          start = (t2 = k * t) >>> 16;
          start = start + length * t;
          start = start & 65535;
          start = start + k * index;
          var pow2 = this[_0x4c5b("0xa6")] + (65535 & t2);
          var sign = pow2 >>> 16;
          var p = (sign = sign + (this[_0x4c5b("0xa7")] + (65535 & start))) << 16 | 65535 & pow2;
          sign = (p = p << 13 | p >>> 19) >>> 16;
          start = (t2 = (pow2 = 65535 & p) * (t = tmp[_0x4c5b("0xa6")])) >>> 16;
          start = start + sign * t;
          start = start & 65535;
          start = start + pow2 * (index = tmp[_0x4c5b("0xa7")]);
          this["_low"] = 65535 & t2;
          this["_high"] = 65535 & start;
        };
        var tmp = $(_0x4c5b("0x250"));
        var node = $(_0x4c5b("0x251"));
        var radixToPower = $(_0x4c5b("0x252"));
        var inputel = $(_0x4c5b("0x253"));
        var key = $(_0x4c5b("0x254"));
        var classesExtendsFrom = tmp[_0x4c5b("0xad")]()[_0x4c5b("0xac")](node);
        URI[_0x4c5b("0x10")]["init"] = module;
        URI[_0x4c5b("0x10")][_0x4c5b("0x14f")] = function(data) {
          var HAS_BROKEN_LINEHEIGHT = _0x4c5b("0x12") == typeof data;
          var buffer;
          if (HAS_BROKEN_LINEHEIGHT) {
            data = function(args) {
              var array = [];
              var next = 0;
              var index = args["length"];
              var i;
              for (; next < index; next++) {
                i = args[_0x4c5b("0xa")](next);
                if (128 > i) {
                  array[_0x4c5b("0x7")](i);
                } else {
                  if (2048 > i) {
                    array[_0x4c5b("0x7")](192 | i >> 6, 128 | 63 & i);
                  } else {
                    if (55296 > i || 57344 <= i) {
                      array[_0x4c5b("0x7")](224 | i >> 12, 128 | 63 & i >> 6, 128 | 63 & i);
                    } else {
                      next++;
                      i = 65536 + ((1023 & i) << 10 | 1023 & args[_0x4c5b("0xa")](next));
                      array[_0x4c5b("0x7")](240 | i >> 18, 128 | 63 & i >> 12, 128 | 63 & i >> 6, 128 | 63 & i);
                    }
                  }
                }
              }
              return new Uint8Array(array);
            }(data);
            HAS_BROKEN_LINEHEIGHT = false;
            buffer = true;
          }
          if (_0x4c5b("0x49") != typeof ArrayBuffer && data instanceof ArrayBuffer) {
            buffer = true;
            data = new Uint8Array(data);
          }
          var i = 0;
          var size = data["length"];
          var x = i + size;
          if (0 == size) {
            return this;
          }
          if (this[_0x4c5b("0x24c")] += size, 0 == this[_0x4c5b("0x24d")] && (this[_0x4c5b("0x24e")] = HAS_BROKEN_LINEHEIGHT ? "" : buffer ? new Uint8Array(16) : new ByteBuffer(16)), 16 > this[_0x4c5b("0x24d")] + size) {
            return HAS_BROKEN_LINEHEIGHT ? this[_0x4c5b("0x24e")] += data : buffer ? this[_0x4c5b("0x24e")][_0x4c5b("0x8d")](data[_0x4c5b("0x8e")](0, size), this[_0x4c5b("0x24d")]) : data[_0x4c5b("0x1d")](this[_0x4c5b("0x24e")], this["memsize"], 0, size), this[_0x4c5b("0x24d")] += size, this;
          }
          if (0 < this["memsize"]) {
            if (HAS_BROKEN_LINEHEIGHT) {
              this[_0x4c5b("0x24e")] += data[_0x4c5b("0x1b")](0, 16 - this[_0x4c5b("0x24d")]);
            } else {
              if (buffer) {
                this[_0x4c5b("0x24e")]["set"](data[_0x4c5b("0x8e")](0, 16 - this[_0x4c5b("0x24d")]), this[_0x4c5b("0x24d")]);
              } else {
                data[_0x4c5b("0x1d")](this[_0x4c5b("0x24e")], this[_0x4c5b("0x24d")], 0, 16 - this[_0x4c5b("0x24d")]);
              }
            }
            var criterion_index = 0;
            if (HAS_BROKEN_LINEHEIGHT) {
              this["v1"][_0x4c5b("0x24f")](this[_0x4c5b("0x24e")][_0x4c5b("0xa")](criterion_index + 1) << 8 | this[_0x4c5b("0x24e")][_0x4c5b("0xa")](criterion_index), this[_0x4c5b("0x24e")][_0x4c5b("0xa")](criterion_index + 3) << 8 | this[_0x4c5b("0x24e")][_0x4c5b("0xa")](criterion_index + 2));
              criterion_index = criterion_index + 4;
              this["v2"][_0x4c5b("0x24f")](this[_0x4c5b("0x24e")][_0x4c5b("0xa")](criterion_index + 1) << 8 | this[_0x4c5b("0x24e")][_0x4c5b("0xa")](criterion_index), this[_0x4c5b("0x24e")][_0x4c5b("0xa")](criterion_index + 3) << 8 | this[_0x4c5b("0x24e")][_0x4c5b("0xa")](criterion_index + 2));
              criterion_index = criterion_index + 4;
              this["v3"][_0x4c5b("0x24f")](this[_0x4c5b("0x24e")][_0x4c5b("0xa")](criterion_index + 1) << 8 | this[_0x4c5b("0x24e")][_0x4c5b("0xa")](criterion_index), this[_0x4c5b("0x24e")]["charCodeAt"](criterion_index + 3) << 8 | this[_0x4c5b("0x24e")][_0x4c5b("0xa")](criterion_index + 2));
              criterion_index = criterion_index + 4;
              this["v4"][_0x4c5b("0x24f")](this["memory"][_0x4c5b("0xa")](criterion_index + 1) << 8 | this[_0x4c5b("0x24e")][_0x4c5b("0xa")](criterion_index), this[_0x4c5b("0x24e")][_0x4c5b("0xa")](criterion_index + 3) << 8 | this[_0x4c5b("0x24e")][_0x4c5b("0xa")](criterion_index + 2));
            } else {
              this["v1"]["xxh_update"](this["memory"][criterion_index + 1] << 8 | this[_0x4c5b("0x24e")][criterion_index], this["memory"][criterion_index + 3] << 8 | this[_0x4c5b("0x24e")][criterion_index + 2]);
              criterion_index = criterion_index + 4;
              this["v2"][_0x4c5b("0x24f")](this["memory"][criterion_index + 1] << 8 | this[_0x4c5b("0x24e")][criterion_index], this[_0x4c5b("0x24e")][criterion_index + 3] << 8 | this["memory"][criterion_index + 2]);
              criterion_index = criterion_index + 4;
              this["v3"]["xxh_update"](this[_0x4c5b("0x24e")][criterion_index + 1] << 8 | this[_0x4c5b("0x24e")][criterion_index], this[_0x4c5b("0x24e")][criterion_index + 3] << 8 | this[_0x4c5b("0x24e")][criterion_index + 2]);
              criterion_index = criterion_index + 4;
              this["v4"][_0x4c5b("0x24f")](this[_0x4c5b("0x24e")][criterion_index + 1] << 8 | this[_0x4c5b("0x24e")][criterion_index], this["memory"][criterion_index + 3] << 8 | this[_0x4c5b("0x24e")][criterion_index + 2]);
            }
            i = i + (16 - this[_0x4c5b("0x24d")]);
            this[_0x4c5b("0x24d")] = 0;
            if (HAS_BROKEN_LINEHEIGHT) {
              this[_0x4c5b("0x24e")] = "";
            }
          }
          if (i <= x - 16) {
            do {
              if (HAS_BROKEN_LINEHEIGHT) {
                this["v1"]["xxh_update"](data[_0x4c5b("0xa")](i + 1) << 8 | data["charCodeAt"](i), data[_0x4c5b("0xa")](i + 3) << 8 | data[_0x4c5b("0xa")](i + 2));
                i = i + 4;
                this["v2"][_0x4c5b("0x24f")](data[_0x4c5b("0xa")](i + 1) << 8 | data[_0x4c5b("0xa")](i), data[_0x4c5b("0xa")](i + 3) << 8 | data["charCodeAt"](i + 2));
                i = i + 4;
                this["v3"][_0x4c5b("0x24f")](data[_0x4c5b("0xa")](i + 1) << 8 | data[_0x4c5b("0xa")](i), data[_0x4c5b("0xa")](i + 3) << 8 | data["charCodeAt"](i + 2));
                i = i + 4;
                this["v4"][_0x4c5b("0x24f")](data[_0x4c5b("0xa")](i + 1) << 8 | data[_0x4c5b("0xa")](i), data[_0x4c5b("0xa")](i + 3) << 8 | data["charCodeAt"](i + 2));
              } else {
                this["v1"][_0x4c5b("0x24f")](data[i + 1] << 8 | data[i], data[i + 3] << 8 | data[i + 2]);
                i = i + 4;
                this["v2"]["xxh_update"](data[i + 1] << 8 | data[i], data[i + 3] << 8 | data[i + 2]);
                i = i + 4;
                this["v3"][_0x4c5b("0x24f")](data[i + 1] << 8 | data[i], data[i + 3] << 8 | data[i + 2]);
                i = i + 4;
                this["v4"][_0x4c5b("0x24f")](data[i + 1] << 8 | data[i], data[i + 3] << 8 | data[i + 2]);
              }
              i = i + 4;
            } while (i <= x - 16);
          }
          return i < x && (HAS_BROKEN_LINEHEIGHT ? this[_0x4c5b("0x24e")] += data["slice"](i) : buffer ? this[_0x4c5b("0x24e")][_0x4c5b("0x8d")](data[_0x4c5b("0x8e")](i, x), this[_0x4c5b("0x24d")]) : data[_0x4c5b("0x1d")](this[_0x4c5b("0x24e")], this[_0x4c5b("0x24d")], i, x), this["memsize"] = x - i), this;
        };
        URI[_0x4c5b("0x10")][_0x4c5b("0x14e")] = function() {
          var data = this["memory"];
          var converter = _0x4c5b("0x12") == typeof data;
          var i = 0;
          var num_blocks = this[_0x4c5b("0x24d")];
          var result = new $;
          var LongPrototype;
          var unwind;
          (LongPrototype = 16 <= this["total_len"] ? this["v1"][_0x4c5b("0xbb")](1)[_0x4c5b("0xac")](this["v2"][_0x4c5b("0xbb")](7)[_0x4c5b("0xac")](this["v3"][_0x4c5b("0xbb")](12)[_0x4c5b("0xac")](this["v4"]["rotl"](18)))) : this[_0x4c5b("0x24b")][_0x4c5b("0xac")](key))[_0x4c5b("0xac")](result["fromNumber"](this[_0x4c5b("0x24c")]));
          for (; i <= num_blocks - 4;) {
            if (converter) {
              result[_0x4c5b("0x255")](data[_0x4c5b("0xa")](i + 1) << 8 | data[_0x4c5b("0xa")](i), data[_0x4c5b("0xa")](i + 3) << 8 | data[_0x4c5b("0xa")](i + 2));
            } else {
              result[_0x4c5b("0x255")](data[i + 1] << 8 | data[i], data[i + 3] << 8 | data[i + 2]);
            }
            LongPrototype["add"](result["multiply"](radixToPower))[_0x4c5b("0xbb")](17)[_0x4c5b("0xc3")](inputel);
            i = i + 4;
          }
          for (; i < num_blocks;) {
            result[_0x4c5b("0x255")](converter ? data["charCodeAt"](i++) : data[i++], 0);
            LongPrototype[_0x4c5b("0xac")](result[_0x4c5b("0xc3")](key))[_0x4c5b("0xbb")](11)[_0x4c5b("0xc3")](tmp);
          }
          return unwind = LongPrototype[_0x4c5b("0xad")]()["shiftRight"](15), LongPrototype[_0x4c5b("0xc4")](unwind)[_0x4c5b("0xc3")](node), unwind = LongPrototype[_0x4c5b("0xad")]()[_0x4c5b("0xb2")](13), LongPrototype["xor"](unwind)[_0x4c5b("0xc3")](radixToPower), unwind = LongPrototype["clone"]()[_0x4c5b("0xb2")](16), LongPrototype[_0x4c5b("0xc4")](unwind), this[_0x4c5b("0x256")](this[_0x4c5b("0x24b")]), LongPrototype;
        };
        if (_0x4c5b("0x49") != typeof define && define["amd"]) {
          define([], function() {
            return URI;
          });
        } else {
          if (void 0 !== ParamLocation && ParamLocation[_0x4c5b("0x5")]) {
            ParamLocation[_0x4c5b("0x5")] = URI;
          } else {
            window[_0x4c5b("0x257")] = URI;
          }
        }
      }(this);
    })["call"](this, saveNotifs(_0x4c5b("0xe7"))["Buffer"]);
  }, {
    "buffer" : 3,
    "cuint" : 43
  }],
  47 : [function(spawn) {
    !function(window, attributes, $) {
      function EmbeddedSVGEdit() {
        this["txt"] = "";
        this["txtCanvas"] = null;
        this["txtCtx"] = null;
        this["color"] = "#FFFFFF"
        this["stroke"] = false;
        this["strokeWidth"] = 2;
        this["strokeColor"] = "#000000";
        this["font"] = "700 16px Ubuntu";
        this["fontFamily"] = _0x4c5b("0x262");
        this["fontWeight"] = 700;
        this["fontSize"] = 16;
        this["margin"] = 3;
        this["scale"] = 1;
        this["quality"] = 1;
        this["measuredWidth"] = 0;
        this["redraw"] = false;
        this["remeasure"] = false;
        this["setTxt"] = function(canCreateDiscussions) {
          if (this["txt"] !== canCreateDiscussions) {
            this["txt"] = canCreateDiscussions;
            this["redraw"] = true;
            this["remeasure"] = true;
          }
        };
        this["setColor"] = function(i) {
          if (this["color"] !== i) {
            this["color"] = i;
            this["redraw"] = true;
          }
        };
        this["setStroke"] = function(color) {
          if (this["stroke"] !== color) {
            this["stroke"] = color;
            this["redraw"] = true;
          }
        };
        this["setStrokeWidth"] = function(canCreateDiscussions) {
          if (this["stroke"] && this["strokeWidth"] != canCreateDiscussions) {
            this["strokeWidth"] = canCreateDiscussions;
            this["redraw"] = true;
            this["remeasure"] = true;
          }
        };
        this["setStrokeColor"] = function(strokeColor) {
          if (this["stroke"] && this["strokeColor"] !== strokeColor) {
            this["strokeColor"] = strokeColor;
            this["redraw"] = true;
          }
        };
        this["setFont"] = function() {
          this["font"] = this["fontWeight"] + " " + this["fontSize"] + "px " + this["fontFamily"];
        };
        this[_0x4c5b("0x270")] = function(canCreateDiscussions) {
          if (this["fontFamily"] !== canCreateDiscussions) {
            this["fontFamily"] = canCreateDiscussions;
            this["setFont"]();
            this["redraw"] = true;
            this["remeasure"] = true;
          }
        };
        this["setFontWeight"] = function(canCreateDiscussions) {
          if (this["fontWeight"] != canCreateDiscussions) {
            this["fontWeight"] = canCreateDiscussions;
            this["setFont"]();
            this["redraw"] = true;
            this["remeasure"] = true;
          }
        };
        this["setFontSize"] = function(canCreateDiscussions) {
          if (this["fontSize"] != canCreateDiscussions) {
            this["fontSize"] = canCreateDiscussions;
            this["margin"] = ~~(.2 * canCreateDiscussions);
            this["setFont"]();
            this["redraw"] = true;
          }
        };
        this["setScale"] = function(canCreateDiscussions) {
          if (this["scale"] != canCreateDiscussions) {
            this["scale"] = canCreateDiscussions;
            this["redraw"] = true;
          }
        };
        this["createCanvas"] = function() {
          if (!this["txtCanvas"]) {
            this["txtCanvas"] = document["createElement"]("canvas");
            this["txtCtx"] = this["txtCanvas"]["getContext"]("2d");
            "yote";
          }
        };
        this["setDrawing"] = function(value, mmCoreSplitViewBlock, mmaPushNotificationsComponent, mmaFrontpagePriority, isBgroundImg, mmaModFeedbackAutomSyncedEvent) {
          this["setColor"](value);
          this["setFontFamily"](mmCoreSplitViewBlock);
          this["setFontWeight"](mmaPushNotificationsComponent);
          this["setStroke"](mmaFrontpagePriority);
          this["setStrokeWidth"](isBgroundImg);
          this["setStrokeColor"](mmaModFeedbackAutomSyncedEvent);
        };
        this["measureWidth"] = function() {
          return this["remeasure"] && (this["txtCtx"]["font"] = this["fontWeight"] + " 10px " + this["fontFamily"], this["measuredWidth"] = this["txtCtx"]["measureText"](this["txt"])["width"], this["remeasure"] = false), ~~(this["fontSize"] / 10 * this["measuredWidth"]) + 2 * this["strokeWidth"];
        };
        this["drawTxt"] = function() {
          return this["createCanvas"](), this["redraw"] && (this["redraw"] = false, this["txtCanvas"]["width"] = this["measureWidth"](), this["txtCanvas"]["height"] = this["fontSize"] + this["margin"], this["txtCtx"]["font"] = this["font"], this["txtCtx"]["globalAlpha"] = 1, this["txtCtx"]["lineWidth"] = this["strokeWidth"], this["txtCtx"]["strokeStyle"] = this["strokeColor"], this["txtCtx"]["fillStyle"] = 
          this["color"], this["stroke"] && this["txtCtx"]["strokeText"](this["txt"], this["strokeWidth"], this["fontSize"] - this["margin"] / 2), this["txtCtx"]["fillText"](this["txt"], this["strokeWidth"], this["fontSize"] - this["margin"] / 2)), this["txtCanvas"];
        };
      }
      function setup(done, config, i, div, src, instances, dswM, cacheM, gf, target) {
        this["id"] = done;
        this["x"] = config;
        this["y"] = i;
        this["targetX"] = config;
        this["targetY"] = i;
        this["color"] = src;
        this[_0x4c5b("0x28b")] = null;
        this["size"] = div;
        this[_0x4c5b("0x28c")] = div;
        this[_0x4c5b("0x28d")] = 1;
        this[_0x4c5b("0x28e")] = "";
        this[_0x4c5b("0x28f")] = "";
        this[_0x4c5b("0x290")] = null;
        this[_0x4c5b("0x291")] = 0;
        this["lastMass"] = 0;
        this["kMass"] = 0;
        this[_0x4c5b("0x292")] = null;
        this["massTxt"] = "";
        this["margin"] = 0;
        this["scale"] = 1;
        this[_0x4c5b("0x293")] = 1;
        this[_0x4c5b("0x294")] = 1;
        this[_0x4c5b("0x295")] = 3;
        this[_0x4c5b("0x296")] = 1;
        this["fontSize"] = 26;
        this["nickSize"] = 26;
        this[_0x4c5b("0x297")] = 0;
        this[_0x4c5b("0x298")] = 26;
        this[_0x4c5b("0x299")] = 26;
        this[_0x4c5b("0x29a")] = 3;
        this[_0x4c5b("0x29b")] = 3;
        this[_0x4c5b("0x29c")] = instances;
        this["isVirus"] = dswM;
        this[_0x4c5b("0x29d")] = cacheM;
        this[_0x4c5b("0x29e")] = gf;
        this[_0x4c5b("0x29f")] = target;
        this[_0x4c5b("0x2a0")] = false;
        this[_0x4c5b("0x2a1")] = true;
        this["redrawMass"] = true;
        this[_0x4c5b("0x2a2")] = false;
        this[_0x4c5b("0x2a3")] = false;
        this["strokeNick"] = false;
        this["strokeMass"] = false;
        this[_0x4c5b("0x2a4")] = false;
        this[_0x4c5b("0x2a5")] = 0;
        this[_0x4c5b("0x2a6")] = 0;
        this[_0x4c5b("0x2a7")] = null;
        this["pi2"] = 2 * Math["PI"];
        this[_0x4c5b("0x14f")] = function(s, ocolor, mmCoreSplitViewBlock, canCreateDiscussions, isSlidingUp, mmaPushNotificationsComponent) {
          this["x"] = s;
          this["y"] = ocolor;
          this[_0x4c5b("0x2a9")] = canCreateDiscussions;
          this[_0x4c5b("0x29d")] = isSlidingUp;
          this[_0x4c5b("0x2aa")](mmCoreSplitViewBlock);
          this[_0x4c5b("0x2ab")](mmaPushNotificationsComponent);
        };
        this[_0x4c5b("0x2ac")] = function() {
          this[_0x4c5b("0x2a4")] = true;
          var i = attrs[_0x4c5b("0x2ad")][_0x4c5b("0x2d")](this);
          if (-1 == i) {
            if (-1 != (i = attrs[_0x4c5b("0x2ae")]["indexOf"](this))) {
              attrs[_0x4c5b("0x2ae")][_0x4c5b("0xd4")](i, 1);
            }
          } else {
            attrs[_0x4c5b("0x2ad")][_0x4c5b("0xd4")](i, 1);
            if (settings[_0x4c5b("0x2af")] && -1 != (i = attrs[_0x4c5b("0x2b0")][_0x4c5b("0x2d")](this))) {
              attrs[_0x4c5b("0x2b0")][_0x4c5b("0xd4")](i, 1);
            }
          }
          if (-1 != (i = attrs["playerCells"][_0x4c5b("0x2d")](this))) {
            attrs[_0x4c5b("0x2b1")] = true;
            attrs[_0x4c5b("0x2b2")]["splice"](i, 1);
            if (-1 != (i = attrs[_0x4c5b("0x2b3")][_0x4c5b("0x2d")](this["id"]))) {
              attrs["playerCellIDs"][_0x4c5b("0xd4")](i, 1);
            }
          }
          if (settings[_0x4c5b("0x2b4")]) {
            if (this[_0x4c5b("0x2a5")]) {
              attrs[_0x4c5b("0x2b5")][_0x4c5b("0x7")](this);
            }
          } else {
            this[_0x4c5b("0x2a5")];
          }
          delete attrs[_0x4c5b("0x2b6")][this["id"]];
        };
        this[_0x4c5b("0x2b7")] = function() {
          var _0x53b64d = (attrs[_0x4c5b("0x2a6")] - this["time"]) / settings[_0x4c5b("0x2b8")];
          if (!(_0x53b64d = 0 > _0x53b64d ? 0 : 1 < _0x53b64d ? 1 : _0x53b64d, this["x"] += (this["targetX"] - this["x"]) * _0x53b64d, this["y"] += (this["targetY"] - this["y"]) * _0x53b64d, this["size"] += (this[_0x4c5b("0x28c")] - this["size"]) * _0x53b64d, this[_0x4c5b("0x28d")] = _0x53b64d, this[_0x4c5b("0x2a4")])) {
            this[_0x4c5b("0x2a6")] = attrs[_0x4c5b("0x2a6")];
          } else {
            if (1 == _0x53b64d) {
              var artistTrack = attrs[_0x4c5b("0x2b5")]["indexOf"](this);
              if (-1 != artistTrack) {
                attrs[_0x4c5b("0x2b5")][_0x4c5b("0xd4")](artistTrack, 1);
              }
            }
          }
        };
        this[_0x4c5b("0x2b9")] = function() {
          return !(0 >= this["id"]) && !(this["x"] + this["size"] + 40 < attrs["viewX"] - attrs[_0x4c5b("0x2ba")] / 2 / attrs["scale"] || this["y"] + this["size"] + 40 < attrs["viewY"] - attrs["canvasHeight"] / 2 / attrs["scale"] || this["x"] - this["size"] - 40 > attrs[_0x4c5b("0x2bb")] + attrs[_0x4c5b("0x2ba")] / 2 / attrs["scale"] || this["y"] - this["size"] - 40 > attrs["viewY"] + attrs[_0x4c5b("0x2bc")] / 2 / attrs["scale"]);
        };
        this[_0x4c5b("0x2aa")] = function(size) {
          return this["size"] = size, !(40 >= size) && (this[_0x4c5b("0x292")] ? (this[_0x4c5b("0x291")] = ~~(size * size / 100), this[_0x4c5b("0x2bd")] = true, this["isVirus"] ? (this[_0x4c5b("0x29f")] && 200 > this[_0x4c5b("0x291")] && (this[_0x4c5b("0x291")] = ~~((200 - this[_0x4c5b("0x291")]) / 14)), this["massTxt"] = this[_0x4c5b("0x291")][_0x4c5b("0x25")](), true) : (this[_0x4c5b("0x2be")] = this[_0x4c5b("0x291")][_0x4c5b("0x25")](), 200 >= this[_0x4c5b("0x291")] || (this[_0x4c5b("0x29e")] && 
          1E3 <= this[_0x4c5b("0x291")] ? (this["kMass"] = Math[_0x4c5b("0x2bf")](this[_0x4c5b("0x291")] / 100) / 10, this[_0x4c5b("0x2be")] = this[_0x4c5b("0x2c0")] + "k", true) : (this[_0x4c5b("0x2a3")] && (this["redrawMass"] = .02 <= Math[_0x4c5b("0xd7")]((this[_0x4c5b("0x291")] - this[_0x4c5b("0x2c1")]) / this["mass"]) || this[_0x4c5b("0x2a0")]), true)))) : (this[_0x4c5b("0x292")] = new EmbeddedSVGEdit, false));
        };
        this[_0x4c5b("0x2ab")] = function(canCreateDiscussions) {
          return this[_0x4c5b("0x28e")] = canCreateDiscussions, canCreateDiscussions && !this["isVirus"] && (!!this[_0x4c5b("0x290")] || (this[_0x4c5b("0x290")] = new EmbeddedSVGEdit, false));
        };
        this["setScale"] = function(factor, isSlidingUp, dontForceConstraints, forceExecution, canCreateDiscussions) {
          var _0x1547b0 = Math[_0x4c5b("0x2c2")](10 * factor) / 10;
          this[_0x4c5b("0x2a0")] = false;
          if (this["scale"] != _0x1547b0) {
            this["scale"] = _0x1547b0;
            this[_0x4c5b("0x2a0")] = true;
          }
          this["nickScale"] = isSlidingUp;
          this[_0x4c5b("0x294")] = dontForceConstraints;
          this[_0x4c5b("0x295")] = forceExecution;
          this["strokeScale"] = canCreateDiscussions;
        };
        this["setFontSize"] = function() {
          if (this[_0x4c5b("0x2a9")]) {
            this[_0x4c5b("0x298")] = Math[_0x4c5b("0x2c2")](this[_0x4c5b("0x299")] * this["scale"] * this[_0x4c5b("0x295")]);
          } else {
            this["fontSize"] = Math[_0x4c5b("0x2c3")](.3 * this["size"], 26) * this["scale"];
            this[_0x4c5b("0x2c4")] = ~~(this["fontSize"] * this["nickScale"]);
            this["massSize"] = ~~(.5 * this["fontSize"] * this["massScale"]);
            this[_0x4c5b("0x2a1")] = !this[_0x4c5b("0x2a2")] || .3 <= Math[_0x4c5b("0xd7")]((this[_0x4c5b("0x2c4")] - this[_0x4c5b("0x297")]) / this[_0x4c5b("0x2c4")]) || this[_0x4c5b("0x2a0")];
          }
        };
        this[_0x4c5b("0x2c5")] = function() {
          if (this[_0x4c5b("0x2c6")] && !this[_0x4c5b("0x2a9")]) {
            this[_0x4c5b("0x29a")] = ~~(.1 * this[_0x4c5b("0x2c4")] * this[_0x4c5b("0x296")]);
          }
          if (this["strokeMass"]) {
            this[_0x4c5b("0x29b")] = ~~(.1 * this[_0x4c5b("0x298")] * this[_0x4c5b("0x296")]);
          }
        };
        this["setDrawing"] = function() {
          this[_0x4c5b("0x2a2")] = settings[_0x4c5b("0x2a2")];
          this[_0x4c5b("0x2a3")] = settings[_0x4c5b("0x2a3")];
          this["shortMass"] = settings[_0x4c5b("0x29e")];
          this[_0x4c5b("0x29f")] = settings[_0x4c5b("0x29f")];
          this["strokeNick"] = settings[_0x4c5b("0x2c7")];
          this["strokeMass"] = settings[_0x4c5b("0x2c8")];
        };
        this["setDrawingScale"] = function() {
          this["setScale"](attributes[_0x4c5b("0x2c9")], data["namesScale"], data[_0x4c5b("0x294")], data[_0x4c5b("0x295")], data[_0x4c5b("0x296")]);
          this["setFontSize"]();
          this["setStrokeSize"]();
          this["margin"] = 0;
        };
        this["drawNick"] = function(functions) {
          if (this["nick"] && this["nickCanvas"] && !this["isVirus"]) {
            var extendedRegExp = this["nickCanvas")];
            extendedRegExp["setDrawing"](data["namesColor"], data["namesFontFamily")], data["namesFontWeight"], this["strokeNick"], this["nickStrokeSize"], data["namesStrokeColor"]);
            extendedRegExp["setTxt"](this["nick"]);
            if (this["redrawNick"]) {
              extendedRegExp["setFontSize"](this["nickSize"]);
              this["lastNickSize"] = this["nickSize"];
            }
            extendedRegExp["setScale"](this["scale"]);
            var value = extendedRegExp["drawTxt"]();
            var val = ~~(value["width"] / this["scale"]);
            var length = ~~(value["height"] / this["scale"]);
            this["margin"] = ~~(length / 2);
            functions["drawImage"](value, ~~this["x"] - ~~(val / 2), ~~this["y"] - this["margin"], val, length);
          }
        };
        this["drawMass"] = function(KUTE) {
          if (this[_0x4c5b("0x292")] && !(40 >= this["size"])) {
            var extendedRegExp = this[_0x4c5b("0x292")];
            extendedRegExp["setDrawing"](data["massColor"], data[_0x4c5b("0x2d0")], data[_0x4c5b("0x2d1")], this[_0x4c5b("0x2d2")], this[_0x4c5b("0x29b")], data[_0x4c5b("0x2d3")]);
            if (this["redrawMass"]) {
              extendedRegExp["setTxt"](this["massTxt"]);
              this[_0x4c5b("0x2c1")] = this[_0x4c5b("0x291")];
            }
            extendedRegExp["setFontSize"](this[_0x4c5b("0x298")]);
            extendedRegExp["setScale"](this["scale"]);
            var el = extendedRegExp["drawTxt"]();
            var ops = ~~(el["width"] / this["scale"]);
            var lastviewmatrix = ~~(el["height"] / this["scale"]);
            var to = 0 == this["margin"] ? ~~this["y"] - ~~(lastviewmatrix / 2) : ~~this["y"] + this["margin"];
            KUTE["drawImage"](el, ~~this["x"] - ~~(ops / 2), to, ops, lastviewmatrix);
          }
        };
        this["draw"] = function(args, canCreateDiscussions) {
          if (!(attrs[_0x4c5b("0x2d5")] && 76 >= this["size"])) {
            args["save"]();
            this[_0x4c5b("0x2a5")]++;
            if (canCreateDiscussions) {
              this["moveCell"]();
            }
            if (this[_0x4c5b("0x2a4")]) {
              args["globalAlpha"] *= 1 - this["alpha"];
            }
            var parent = args["globalAlpha"];
            var previousStyle = false;
            var id = this["isFood"] ? this["size"] + data[_0x4c5b("0x2d7")] : this["size"];
            if (args["beginPath"](), args["arc"](this["x"], this["y"], id, 0, this["pi2"], false), args[_0x4c5b("0x2da")](), this[_0x4c5b("0x29c")]) {
              return args["fillStyle"] = this["color"], args[_0x4c5b("0x4e")](), void args["restore"]();
            }
            if (this["isVirus"]) {
              return settings["transparentViruses"] && (args["globalAlpha"] *= data["virusAlpha"], previousStyle = true), settings["virColors"] && attrs["play"] ? (args["fillStyle"] = m["setVirusColor"](id), args["strokeStyle"] = m["setVirusStrokeColor"](id)) : (args["fillStyle"] = data["virusColor"], args["strokeStyle"] = data["virusStrokeColor"]), args["fill"](), previousStyle && (args["globalAlpha"] = parent, previousStyle = false), args["lineWidth"] = 
              data["virusStrokeSize"], settings["virusGlow"] ? (args["shadowBlur"] = data["virusGlowSize"], args["shadowColor"] = data["virusGlowColor"]) : "yeet", args["stroke"](), settings["showMass"] && settings["showVirusMass"] && (this["setDrawing"](), this["setDrawingScale"](), settings["virusGlow"] ? args["shadowBlur"] = 0 : "yote", this["setMass"](this["size"]), this["drawMass"](args)), void args["restore"]();
            }
            if (settings["transparentCells"]) {
              args["globalAlpha"] *= data["cellsAlpha"];
              previousStyle = true;
            }
            var color = this["color"];
            if (attrs["play"]) {
              if (this["isPlayerCell"]) {
                if (settings["myCustomColor"]) {
                  color = names["color"];
                }
              } else {
                if (settings["oppColors"] && !settings["oppRings"]) {
                  color = this["oppColor"];
                }
              }
            }
            args["fillStyle"] = color;
            args[_0x4c5b("0x4e")]();
            if (previousStyle) {
              args["globalAlpha"] = parent;
              previousStyle = false;
            }
            var date = null;
            if (settings[_0x4c5b("0x2ee")] && attrs[_0x4c5b("0x2ef")] && (date = m["getCustomSkin"](this["targetNick"], this["color"])) && (((settings["transparentSkins"] || attrs[_0x4c5b("0x2de")] && settings[_0x4c5b("0x2f0")]) && (!this[_0x4c5b("0x29d")] || settings[_0x4c5b("0x2f1")]) || this[_0x4c5b("0x29d")] && settings["myTransparentSkin"]) && (args["globalAlpha"] *= data[_0x4c5b("0x2f2")], previousStyle = true), args["drawImage"](date, this["x"] - id, this["y"] - id, 2 * id, 2 * 
            id), previousStyle && (args["globalAlpha"] = parent, previousStyle = false)), settings[_0x4c5b("0x2f3")] && !this[_0x4c5b("0x29d")] && 200 >= id && (date || m[_0x4c5b("0x2f4")](this[_0x4c5b("0x28f")], this["color"])) && methods["drawTeammatesInd"](args, this["x"], this["y"], id), settings[_0x4c5b("0x2f5")] && !settings[_0x4c5b("0x2e7")] || canCreateDiscussions) {
              args["restore"]();
            } else {
              var browser = false;
              if (!this["isPlayerCell"] && (browser = m[_0x4c5b("0x2f6")](id)) && settings["autoHideNames"] && settings[_0x4c5b("0x2f7")]) {
                args["restore"]();
              } else {
                this["setDrawing"]();
                this[_0x4c5b("0x2e9")]();
                args["globalAlpha"] *= data[_0x4c5b("0x2f8")];
                if (!(settings[_0x4c5b("0x2f5")] || browser && settings[_0x4c5b("0x2f9")] || this[_0x4c5b("0x29d")] && settings[_0x4c5b("0x2fa")] || date && settings[_0x4c5b("0x2fb")])) {
                  if (this["setNick"](this[_0x4c5b("0x28f")])) {
                    this[_0x4c5b("0x2ca")](args);
                  }
                }
                if (!(!settings[_0x4c5b("0x2e7")] || browser && settings[_0x4c5b("0x2f7")] || this[_0x4c5b("0x29d")] && settings["hideMyMass"] || settings[_0x4c5b("0x2fc")] && !this[_0x4c5b("0x29d")] && !this["isVirus"])) {
                  if (this[_0x4c5b("0x2aa")](this["size"])) {
                    this[_0x4c5b("0x2cf")](args);
                  }
                }
                args["restore"]();
              }
            }
          }
        };
      }
      function formatPropertyRead(val) {
        if (window["history"] && window[_0x4c5b("0x2fd")][_0x4c5b("0x2fe")]) {
          window[_0x4c5b("0x2fd")][_0x4c5b("0x2fe")]({}, window[_0x4c5b("0x2ff")][_0x4c5b("0x155")], val);
        }
      }
      function _setPosition() {
        var t = window[_0x4c5b("0x300")];
        var height = window[_0x4c5b("0x301")];
        var _this = $("#helloContainer");
        var naturalHeight = _this[_0x4c5b("0x301")]();
        if (0 < naturalHeight) {
          attributes[_0x4c5b("0x302")] = naturalHeight;
        } else {
          naturalHeight = attributes["menuHeight"] || 618;
        }
        var invDistance = Math[_0x4c5b("0x34")](1, height / naturalHeight);
        var magnitude = naturalHeight * invDistance;
        var x = Math[_0x4c5b("0x2bf")](height / 2 - .5 * magnitude);
        var parent = _0x4c5b("0x303") + invDistance + ")";
        _this[_0x4c5b("0x304")](_0x4c5b("0x1be"), parent);
        _this[_0x4c5b("0x304")]("-ms-transform", parent);
        _this[_0x4c5b("0x304")](_0x4c5b("0x305"), parent);
        _this[_0x4c5b("0x304")](_0x4c5b("0x306"), x + "px");
        attributes[_0x4c5b("0x307")] = t;
        attributes[_0x4c5b("0x308")] = height;
      }
      function gotoNewOfflinePage() {
        if (!m[_0x4c5b("0x309")]) {
          window[_0x4c5b("0x30a")] = function() {
          };
        }
      }
      var Result = null;
      var info = null;
      var message = {
        "en" : {
          "start" : "Home",
          "settings" : _0x4c5b("0x30b"),
          "restoreSettings" : "Restore default settings",
          "animationGroup" : "Animation",
          "glowGroup" : "Glow [Turn Off If You Lag]",
          "zoomGroup" : _0x4c5b("0x30c"),
          "respGroup" : _0x4c5b("0x30d"),
          "namesGroup" : _0x4c5b("0x30e"),
          "massGroup" : _0x4c5b("0x30f"),
          "skinsGroup" : "Skins",
          "foodGroup" : _0x4c5b("0x310"),
          "transparencyGroup" : _0x4c5b("0x311"),
          "gridGroup" : _0x4c5b("0x312"),
          "miniMapGroup" : "Minimap",
          "helpersGroup" : _0x4c5b("0x313"),
          "mouseGroup" : _0x4c5b("0x314"),
          "hudGroup" : _0x4c5b("0x315"),
          "chatGroup" : _0x4c5b("0x316"),
          "statsGroup" : "Stats",
          "extrasGroup" : _0x4c5b("0x317"),
          "noSkins" : _0x4c5b("0x318"),
          "noNames" : _0x4c5b("0x319"),
          "noColors" : _0x4c5b("0x31a"),
          "showMass" : _0x4c5b("0x31b"),
          "showVirusMass" : _0x4c5b("0x31c"),
          "skipStats" : _0x4c5b("0x31d"),
          "showQuest" : _0x4c5b("0x31e"),
          "autoZoom" : _0x4c5b("0x31f"),
          "animation" : _0x4c5b("0x320"),
          "cameraSpeed" : _0x4c5b("0x321"),
          "commanderDelay" : "Commander Delay",
          "suckAnimation" : _0x4c5b("0x322"),
          "virusGlow" : _0x4c5b("0x323"),
          "borderGlow" : "Border Glow",
          "zoomSpeedValue" : _0x4c5b("0x324"),
          "quickResp" : _0x4c5b("0x325"),
          "autoResp" : _0x4c5b("0x326"),
          "autoHideCellsInfo" : "Auto Hide Names And Mass",
          "autoHideNames" : _0x4c5b("0x327"),
          "autoHideMass" : _0x4c5b("0x328"),
          "autoHideFood" : _0x4c5b("0x329"),
          "autoHideFoodOnZoom" : _0x4c5b("0x32a"),
          "optimizedNames" : _0x4c5b("0x32b"),
          "hideMyName" : _0x4c5b("0x32c"),
          "hideTeammatesNames" : "Hide Teammates Names",
          "optimizedMass" : _0x4c5b("0x32d"),
          "shortMass" : _0x4c5b("0x32e"),
          "virMassShots" : _0x4c5b("0x32f"),
          "hideMyMass" : "Hide My Mass",
          "hideEnemiesMass" : _0x4c5b("0x330"),
          "vanillaSkins" : _0x4c5b("0x331"),
          "customSkins" : _0x4c5b("0x332"),
          "myTransparentSkin" : _0x4c5b("0x333"),
          "myCustomColor" : _0x4c5b("0x334"),
          "transparentCells" : "Transparent Cells",
          "transparentViruses" : _0x4c5b("0x335"),
          "transparentSkins" : _0x4c5b("0x336"),
          "showGrid" : _0x4c5b("0x337"),
          "showBgSectors" : _0x4c5b("0x338"),
          "showMapBorders" : _0x4c5b("0x339"),
          "showGhostCells" : _0x4c5b("0x33a"),
          "showMiniMap" : "Show Minimap",
          "showMiniMapGrid" : "Show Minimap Grid",
          "showMiniMapGuides" : _0x4c5b("0x33b"),
          "showMiniMapGhostCells" : _0x4c5b("0x33c"),
          "oneColoredTeammates" : _0x4c5b("0x33d"),
          "optimizedFood" : _0x4c5b("0x33e"),
          "rainbowFood" : _0x4c5b("0x33f"),
          "oppColors" : "Opponents Colors",
          "oppRings" : _0x4c5b("0x340"),
          "virColors" : _0x4c5b("0x341"),
          "splitRange" : _0x4c5b("0x342"),
          "virusesRange" : _0x4c5b("0x343"),
          "textStroke" : "Names And Mass Stroke",
          "namesStroke" : _0x4c5b("0x344"),
          "massStroke" : _0x4c5b("0x345"),
          "cursorTracking" : _0x4c5b("0x346"),
          "teammatesInd" : _0x4c5b("0x347"),
          "mouseSplit" : _0x4c5b("0x348"),
          "mouseFeed" : _0x4c5b("0x349"),
          "mouseInvert" : "Invert mouse buttons",
          "disableChat" : _0x4c5b("0x34a"),
          "hideChat" : _0x4c5b("0x34b"),
          "chatSounds" : _0x4c5b("0x34c"),
          "chatEmoticons" : _0x4c5b("0x34d"),
          "showChatImages" : _0x4c5b("0x34e"),
          "showChatVideos" : "Show Videos On Chat",
          "showChatBox" : _0x4c5b("0x34f"),
          "messageSound" : "Message Notification Sound",
          "commandSound" : _0x4c5b("0x350"),
          "showTop5" : _0x4c5b("0x351"),
          "showTargeting" : _0x4c5b("0x352"),
          "showTime" : _0x4c5b("0x353"),
          "showLbData" : _0x4c5b("0x354"),
          "normalLb" : _0x4c5b("0x355"),
          "limLB" : _0x4c5b("0x356"),
          "limTP" : _0x4c5b("0x357"),
          "centeredLb" : _0x4c5b("0x358"),
          "fpsAtTop" : _0x4c5b("0x359"),
          "showStats" : "Show game stats",
          "showStatsMass" : _0x4c5b("0x35a"),
          "showStatsSTE" : _0x4c5b("0x35b"),
          "showStatsMassSplit" : _0x4c5b("0x35c"),
          "showStatsN16" : _0x4c5b("0x35d"),
          "showStatsFPS" : _0x4c5b("0x35e"),
          "blockPopups" : _0x4c5b("0x35f"),
          "hotkeys" : "",
          "hk-inst-assign" : _0x4c5b("0x360"),
          "hk-inst-delete" : _0x4c5b("0x361"),
          "hk-inst-keys" : _0x4c5b("0x362"),
          "hk-feed" : _0x4c5b("0x363"),
          "hk-macroFeed" : _0x4c5b("0x364"),
          "hk-split" : _0x4c5b("0x365"),
          "hk-doubleSplit" : _0x4c5b("0x366"),
          "hk-split16" : _0x4c5b("0x367"),
          "hk-pause" : _0x4c5b("0x368"),
          "hk-showTop5" : _0x4c5b("0x369"),
          "hk-showTime" : _0x4c5b("0x36a"),
          "hk-showSplitRange" : _0x4c5b("0x36b"),
          "hk-showSplitInd" : _0x4c5b("0x36c"),
          "hk-showTeammatesInd" : "Show/hide teammates indicators",
          "hk-showOppColors" : _0x4c5b("0x36d"),
          "hk-toggleSkins" : _0x4c5b("0x36e"),
          "hk-showSkins" : _0x4c5b("0x36f"),
          "hk-transparentSkins" : _0x4c5b("0x370"),
          "hk-showStats" : _0x4c5b("0x371"),
          "hk-toggleCells" : _0x4c5b("0x372"),
          "hk-showFood" : _0x4c5b("0x373"),
          "hk-showGrid" : _0x4c5b("0x374"),
          "hk-showMiniMapGuides" : _0x4c5b("0x375"),
          "hk-hideChat" : "Show/hide chat",
          "hk-showHUD" : "Show/hide HUD",
          "hk-copyLb" : _0x4c5b("0x376"),
          "hk-showLb" : _0x4c5b("0x377"),
          "hk-toggleAutoZoom" : _0x4c5b("0x378"),
          "hk-resetZoom" : _0x4c5b("0x379"),
          "hk-zoomLevel" : _0x4c5b("0x37a"),
          "hk-toggleDeath" : _0x4c5b("0x37b"),
          "hk-clearChat" : "Show chat history / Clear chat",
          "hk-showBgSectors" : _0x4c5b("0x37c"),
          "hk-hideBots" : _0x4c5b("0x37d"),
          "hk-showNames" : _0x4c5b("0x37e"),
          "hk-hideTeammatesNames" : _0x4c5b("0x37f"),
          "hk-showMass" : _0x4c5b("0x380"),
          "hk-showMiniMap" : "Show/hide minimap",
          "hk-chatMessage" : "Enter chat message",
          "hk-quickResp" : _0x4c5b("0x381"),
          "hk-autoResp" : _0x4c5b("0x382"),
          "hk-switchServerMode" : "Switch server [public/private]",
          "hk-showTargeting" : _0x4c5b("0x383"),
          "hk-setTargeting" : _0x4c5b("0x384"),
          "hk-cancelTargeting" : _0x4c5b("0x385"),
          "hk-changeTarget" : _0x4c5b("0x386"),
          "hk-privateMiniMap" : "Show target on the minimap",
          "hk-showQuest" : _0x4c5b("0x387"),
          "commands" : _0x4c5b("0x388"),
          "comm1" : _0x4c5b("0x389"),
          "comm2" : _0x4c5b("0x38a"),
          "comm3" : _0x4c5b("0x38b"),
          "comm4" : "Enemy spotted at %currentSector%!",
          "comm5" : _0x4c5b("0x38c"),
          "comm6" : "Tank the virus!",
          "comm7" : "Eat the virus!",
          "comm8" : "Let's bait!",
          "comm9" : "Fake tricksplit!",
          "comm0" : _0x4c5b("0x38d"),
          "comm10" : _0x4c5b("0x38e"),
          "comm11" : "Left!",
          "comm12" : _0x4c5b("0x38f"),
          "comm13" : _0x4c5b("0x390"),
          "comm14" : _0x4c5b("0x391"),
          "saveComm" : "Save commands",
          "theme" : _0x4c5b("0x392"),
          "restoreThemeSettings" : _0x4c5b("0x393"),
          "basicTheming" : _0x4c5b("0x394"),
          "themePreset" : _0x4c5b("0x395"),
          "themeType" : _0x4c5b("0x396"),
          "darkTheme" : _0x4c5b("0x397"),
          "lightTheme" : _0x4c5b("0x398"),
          "mainColor" : "Main color",
          "bgColor" : "Background",
          "bordersColor" : _0x4c5b("0x399"),
          "gridColor" : "Grid",
          "sectorsColor" : _0x4c5b("0x39a"),
          "namesColor" : _0x4c5b("0x30e"),
          "namesStrokeColor" : _0x4c5b("0x39b"),
          "massColor" : "Mass",
          "massStrokeColor" : _0x4c5b("0x39c"),
          "virusColor" : "Virus",
          "virusStrokeColor" : _0x4c5b("0x39d"),
          "virusGlowColor" : _0x4c5b("0x323"),
          "borderGlowColor" : _0x4c5b("0x39e"),
          "foodColor" : _0x4c5b("0x310"),
          "namesFont" : _0x4c5b("0x39f"),
          "massFont" : _0x4c5b("0x3a0"),
          "sectorsFont" : _0x4c5b("0x39a"),
          "namesScale" : _0x4c5b("0x3a1"),
          "massScale" : _0x4c5b("0x3a2"),
          "virMassScale" : _0x4c5b("0x3a3"),
          "strokeScale" : _0x4c5b("0x3a4"),
          "foodSize" : "Food size",
          "bordersWidth" : _0x4c5b("0x3a5"),
          "sectorsWidth" : _0x4c5b("0x3a6"),
          "sectorsFontSize" : _0x4c5b("0x3a7"),
          "cellsAlpha" : "Cells transparency",
          "skinsAlpha" : _0x4c5b("0x3a8"),
          "virusAlpha" : _0x4c5b("0x3a9"),
          "textAlpha" : "Names & mass transparency",
          "virusStrokeSize" : _0x4c5b("0x3aa"),
          "virusGlowSize" : _0x4c5b("0x3ab"),
          "borderGlowSize" : _0x4c5b("0x3ac"),
          "teammatesIndColor" : "Teammate indicator",
          "cursorTrackingColor" : "Cursor tracking",
          "splitRangeColor" : _0x4c5b("0x3ad"),
          "safeAreaColor" : _0x4c5b("0x3ae"),
          "dangerAreaColor" : _0x4c5b("0x3af"),
          "ghostCellsColor" : _0x4c5b("0x3b0"),
          "color" : _0x4c5b("0x3b1"),
          "commanderImage" : _0x4c5b("0x3b2"),
          "commanderImage1" : _0x4c5b("0x3b3"),
          "commanderImage2" : _0x4c5b("0x3b4"),
          "ghostCellsAlpha" : _0x4c5b("0x3b5"),
          "menuTheming" : "Menu",
          "menuPreset" : _0x4c5b("0x3b6"),
          "menuMainColorX" : _0x4c5b("0x3b7"),
          "menuPanelColorX" : "Panel",
          "menuPanelColorX2" : "Panel [2]",
          "menuPanelColorX3" : _0x4c5b("0x3b8"),
          "menuImg" : _0x4c5b("0x3b9"),
          "menuImgOpacity" : _0x4c5b("0x3ba"),
          "menuOpacity" : _0x4c5b("0x3bb"),
          "hudTheming" : _0x4c5b("0x315"),
          "hudMainColor" : _0x4c5b("0x3b7"),
          "hudColor" : _0x4c5b("0x3bc"),
          "hudTextColor" : _0x4c5b("0x3bd"),
          "statsHudColor" : "Stats",
          "timeHudColor" : _0x4c5b("0x3be"),
          "top5MassColor" : _0x4c5b("0x30f"),
          "lbMeColor" : "Leaderboard - me",
          "lbTeammateColor" : "Leaderboard - teammate",
          "hudFont" : _0x4c5b("0x3bf"),
          "hudScale" : _0x4c5b("0x3c0"),
          "chatTheming" : _0x4c5b("0x316"),
          "messageColor" : _0x4c5b("0x3c1"),
          "messageTextColor" : "Message text",
          "messageTimeColor" : "Message time",
          "messageNickColor" : _0x4c5b("0x3c2"),
          "commandsColor" : _0x4c5b("0x3c3"),
          "commandsTextColor" : _0x4c5b("0x3c4"),
          "commandsTimeColor" : _0x4c5b("0x3c5"),
          "commandsNickColor" : _0x4c5b("0x3c6"),
          "chatBoxColor" : "Chatbox color",
          "chatScale" : _0x4c5b("0x3c7"),
          "miniMapTheming" : "Minimap",
          "miniMapSectorsColor" : _0x4c5b("0x3c8"),
          "miniMapSectorColor" : _0x4c5b("0x3c9"),
          "miniMapGuidesColor" : _0x4c5b("0x3ca"),
          "miniMapNickColor" : "Nick",
          "miniMapNickStrokeColor" : _0x4c5b("0x3cb"),
          "miniMapMyCellColor" : _0x4c5b("0x3cc"),
          "miniMapMyCellStrokeColor" : "My cell stroke",
          "miniMapTeammatesColor" : _0x4c5b("0x3cd"),
          "miniMapDeathLocationColor" : _0x4c5b("0x3ce"),
          "miniMapFont" : "Minimap font",
          "miniMapNickFont" : _0x4c5b("0x3cf"),
          "miniMapWidth" : _0x4c5b("0x3d0"),
          "miniMapSectorsOpacity" : _0x4c5b("0x3d1"),
          "miniMapNickSize" : _0x4c5b("0x3d2"),
          "miniMapNickStrokeSize" : "Nick stroke size",
          "miniMapMyCellSize" : _0x4c5b("0x3d3"),
          "miniMapMyCellStrokeSize" : _0x4c5b("0x3d4"),
          "miniMapTeammatesSize" : _0x4c5b("0x3d5"),
          "miniMapGhostCellsColor" : _0x4c5b("0x3b0"),
          "miniMapGhostCellsAlpha" : "Ghost cells transparency",
          "imagesTheming" : "Graphics / cursors",
          "customBackground" : _0x4c5b("0x3d6"),
          "customCursor" : _0x4c5b("0x3d7"),
          "hideChatMsgA" : _0x4c5b("0x3d8"),
          "hideChatMsgB" : "Chat is hidden!",
          "showSkinsMsgA" : _0x4c5b("0x3d9"),
          "showSkinsMsgB" : "Skins are hidden!",
          "hideSmallBotsMsgA" : _0x4c5b("0x3da"),
          "hideSmallBotsMsgB" : _0x4c5b("0x3db"),
          "autoRespMsgA" : _0x4c5b("0x3dc"),
          "autoRespMsgB" : "Auto respawn is off!",
          "autoZoomMsgA" : "Auto zoom is on!",
          "autoZoomMsgB" : _0x4c5b("0x3dd"),
          "targetNotSet" : "Target not set",
          "targetDead" : "Dead",
          "targetDistance" : _0x4c5b("0x3de"),
          "targetMass" : "Mass altogether",
          "totalPartyPlayers" : _0x4c5b("0x3df"),
          "totalPartyMass" : _0x4c5b("0x3e0"),
          "exportImport" : _0x4c5b("0x3e1"),
          "exportSettings" : _0x4c5b("0x3e2"),
          "exportInfo" : _0x4c5b("0x3e3"),
          "importSettings" : _0x4c5b("0x3e4"),
          "importInfo" : _0x4c5b("0x3e5"),
          "profile" : _0x4c5b("0x3e6"),
          "profiles" : "Profiles",
          "skins" : _0x4c5b("0x3e7"),
          "moreSkins" : _0x4c5b("0x3e8"),
          "thanks" : _0x4c5b("0x3e9"),
          "saveSett" : _0x4c5b("0x3ea"),
          "saved" : _0x4c5b("0x3eb"),
          "resetSett" : _0x4c5b("0x3ec"),
          "close" : _0x4c5b("0x3ed"),
          "enterChatMsg" : _0x4c5b("0x3ee"),
          "activeParties" : _0x4c5b("0x3ef"),
          "noActiveParties" : "No active parties ;(",
          "playlist" : _0x4c5b("0x3f0"),
          "pause" : "PAUSE!",
          "visit" : _0x4c5b("0x3f1"),
          "exit" : "OGARio by szymy: Are you sure you want to quit the game?",
          "blockWarn" : _0x4c5b("0x3f2"),
          "unblockPopups" : "Temporary unblock",
          "mass" : "Mass",
          "score" : "Score",
          "leaderboard" : "Leaderboard",
          "user" : "User",
          "userMuted" : "User %user% has been muted.",
          "userUnmuted" : "User %user% has been unmuted.",
          "mute" : "Mute",
          "unmute" : _0x4c5b("0x3f3"),
          "mutedUsers" : _0x4c5b("0x3f4"),
          "activeUsers" : _0x4c5b("0x3f5"),
          "showActiveUsers" : _0x4c5b("0x3f6"),
          "none" : _0x4c5b("0x3f7"),
          "sounds" : "Sounds",
          "page_menu_main_free_coins" : _0x4c5b("0x3f8"),
          "page_menu_main_gifts" : _0x4c5b("0x3f9"),
          "page_menu_main_dailyquests" : _0x4c5b("0x3fa"),
          "page_shop" : "Shop"
        }
      };
      var action = "en";
      var disabled = window[_0x4c5b("0x3fb")][_0x4c5b("0x3fc")] || window[_0x4c5b("0x3fb")][_0x4c5b("0x3fd")];
      if (disabled && message[_0x4c5b("0x3fe")](disabled)) {
        action = disabled;
      }
      var args = message[action];
      var target = {
        "comm1" : args["comm1"],
        "comm2" : args[_0x4c5b("0x3ff")],
        "comm3" : args[_0x4c5b("0x400")],
        "comm4" : args[_0x4c5b("0x401")],
        "comm5" : args["comm5"],
        "comm6" : args[_0x4c5b("0x402")],
        "comm7" : args[_0x4c5b("0x403")],
        "comm8" : args[_0x4c5b("0x404")],
        "comm9" : args[_0x4c5b("0x405")],
        "comm0" : args[_0x4c5b("0x406")],
        "comm10" : args[_0x4c5b("0x407")],
        "comm11" : args["comm11"],
        "comm12" : args[_0x4c5b("0x408")],
        "comm13" : args[_0x4c5b("0x409")],
        "comm14" : args[_0x4c5b("0x40a")]
      };
      var entityMap = {
        "&" : _0x4c5b("0x40b"),
        "<" : _0x4c5b("0x40c"),
        ">" : _0x4c5b("0x40d"),
        '"' : _0x4c5b("0x40e"),
        "'" : "&#39;",
        "/" : _0x4c5b("0x40f")
      };
      var obj = {
        ":)" : "smile.svg",
        ";)" : _0x4c5b("0x410"),
        "=)" : _0x4c5b("0x411"),
        ":D" : _0x4c5b("0x412"),
        "X-D" : _0x4c5b("0x413"),
        "=D" : _0x4c5b("0x414"),
        ":(" : _0x4c5b("0x415"),
        ";(" : _0x4c5b("0x416"),
        ":P" : "tongue.svg",
        ";P" : _0x4c5b("0x417"),
        ":*" : _0x4c5b("0x418"),
        "$)" : _0x4c5b("0x419"),
        "<3" : _0x4c5b("0x41a"),
        "8=)" : _0x4c5b("0x41b"),
        ":o" : "astonished.svg",
        "(:|" : _0x4c5b("0x41c"),
        ":|" : _0x4c5b("0x41d"),
        ":\\" : _0x4c5b("0x41e"),
        ":@" : _0x4c5b("0x41f"),
        "|-)" : _0x4c5b("0x420"),
        "^_^" : _0x4c5b("0x421"),
        "-_-" : _0x4c5b("0x422"),
        "$_$" : _0x4c5b("0x423"),
        "O:)" : "angel.svg",
        "3:)" : "devil.svg",
        "(poop)" : _0x4c5b("0x424"),
        "(fuck)" : _0x4c5b("0x425"),
        "(clap)" : "clap.svg",
        "(ok)" : "ok.svg",
        "(victory)" : _0x4c5b("0x426"),
        "(y)" : "thumb.svg",
        "(n)" : _0x4c5b("0x427")
      };
      var artistTrack = {
        "ogario-v3" : {
          "name" : _0x4c5b("0x428"),
          "darkTheme" : true,
          "mainColor" : _0x4c5b("0x429"),
          "bgColor" : "#12121e",
          "bordersColor" : _0x4c5b("0x429"),
          "borderGlowColor" : _0x4c5b("0x42a"),
          "gridColor" : _0x4c5b("0x42b"),
          "sectorsColor" : _0x4c5b("0x42b"),
          "namesColor" : _0x4c5b("0x42c"),
          "namesStrokeColor" : _0x4c5b("0x42c"),
          "massColor" : "#ffffff",
          "massStrokeColor" : _0x4c5b("0x42c"),
          "virusColor" : _0x4c5b("0x42d"),
          "virusStrokeColor" : _0x4c5b("0x42c"),
          "virusGlowColor" : _0x4c5b("0x429"),
          "foodColor" : _0x4c5b("0x429"),
          "teammatesIndColor" : _0x4c5b("0x429"),
          "cursorTrackingColor" : _0x4c5b("0x429"),
          "splitRangeColor" : _0x4c5b("0x42c"),
          "safeAreaColor" : _0x4c5b("0x42c"),
          "dangerAreaColor" : _0x4c5b("0x429"),
          "namesFont" : "ubuntu-bold",
          "massFont" : _0x4c5b("0x42e"),
          "sectorsFont" : _0x4c5b("0x42f"),
          "namesScale" : 1,
          "massScale" : 3,
          "foodSize" : 1,
          "bordersWidth" : 55,
          "sectorsWidth" : 82,
          "sectorsFontSize" : 470,
          "cellsAlpha" : .9,
          "skinsAlpha" : .7,
          "virusAlpha" : .6,
          "textAlpha" : 1,
          "virusStrokeSize" : 20,
          "virusGlowSize" : 14,
          "borderGlowSize" : 15,
          "menuPreset" : _0x4c5b("0x430"),
          "menuMainColorX" : _0x4c5b("0x429"),
          "menuPanelColorX" : _0x4c5b("0x431"),
          "menuPanelColorX2" : _0x4c5b("0x42b"),
          "menuPanelColorX3" : _0x4c5b("0x432"),
          "menuImg" : _0x4c5b("0x433"),
          "menuImgOpacity" : .35,
          "hudMainColor" : _0x4c5b("0x429"),
          "hudColor" : _0x4c5b("0x434"),
          "hudTextColor" : _0x4c5b("0x42c"),
          "statsHudColor" : _0x4c5b("0x42c"),
          "timeHudColor" : _0x4c5b("0x429"),
          "top5MassColor" : _0x4c5b("0x435"),
          "lbMeColor" : _0x4c5b("0x429"),
          "lbTeammateColor" : _0x4c5b("0x429"),
          "hudFont" : _0x4c5b("0x42e"),
          "hudScale" : 1,
          "messageColor" : _0x4c5b("0x436"),
          "messageTextColor" : _0x4c5b("0x42c"),
          "messageTimeColor" : "#fff",
          "messageNickColor" : _0x4c5b("0x429"),
          "commandsColor" : "rgba(222,44,45,1)",
          "commandsTextColor" : "#ffffff",
          "commandsTimeColor" : _0x4c5b("0x429"),
          "commandsNickColor" : _0x4c5b("0x42c"),
          "chatBoxColor" : _0x4c5b("0x436"),
          "chatScale" : 1,
          "miniMapSectorsColor" : _0x4c5b("0x42c"),
          "miniMapSectorColor" : "#fff",
          "miniMapGuidesColor" : _0x4c5b("0x429"),
          "miniMapNickColor" : _0x4c5b("0x42c"),
          "miniMapNickStrokeColor" : _0x4c5b("0x437"),
          "miniMapMyCellColor" : "#dedede",
          "miniMapMyCellStrokeColor" : _0x4c5b("0x429"),
          "miniMapTeammatesColor" : _0x4c5b("0x429"),
          "miniMapDeathLocationColor" : _0x4c5b("0x429"),
          "miniMapFont" : _0x4c5b("0x42e"),
          "miniMapNickFont" : _0x4c5b("0x42e"),
          "miniMapWidth" : 200,
          "miniMapSectorsOpacity" : .33,
          "miniMapNickSize" : 11,
          "miniMapNickStrokeSize" : 2,
          "miniMapMyCellSize" : 5.5,
          "miniMapMyCellStrokeSize" : 0,
          "miniMapTeammatesSize" : 5.5,
          "customBackground" : "",
          "customCursor" : _0x4c5b("0x438")
        }
      };
      var GET_AUTH_URL_TIMEOUT = {
        "ogario-v3" : {
          "name" : _0x4c5b("0x428"),
          "menuMainColorX" : _0x4c5b("0x429"),
          "menuPanelColorX" : _0x4c5b("0x431"),
          "menuPanelColorX2" : _0x4c5b("0x42b"),
          "menuPanelColorX3" : "rgba(255,255,255,0.08)",
          "menuImg" : _0x4c5b("0x433"),
          "menuImgOpacity" : .55
        }
      };
      var data = { // is the g
        "preset" : _0x4c5b("0x430"),
        "darkTheme" : true,
        "mainColor" : _0x4c5b("0x429"),
        "bgColor" : _0x4c5b("0x437"),
        "bordersColor" : _0x4c5b("0x42c"),
        "borderGlowColor" : _0x4c5b("0x42c"),
        "gridColor" : "#353535",
        "sectorsColor" : _0x4c5b("0x439"),
        "namesColor" : "#ffffff",
        "namesStrokeColor" : "#ffffff",
        "massColor" : _0x4c5b("0x42c"),
        "massStrokeColor" : _0x4c5b("0x42c"),
        "virusColor" : _0x4c5b("0x437"),
        "virusStrokeColor" : _0x4c5b("0x42c"),
        "virusGlowColor" : _0x4c5b("0x429"),
        "foodColor" : _0x4c5b("0x429"),
        "teammatesIndColor" : "#fff",
        "cursorTrackingColor" : "#fff",
        "splitRangeColor" : _0x4c5b("0x42c"),
        "safeAreaColor" : "#ffffff",
        "dangerAreaColor" : "#fff",
        "namesFont" : _0x4c5b("0x42e"),
        "namesFontFamily" : _0x4c5b("0x262"),
        "namesFontWeight" : 700,
        "massFont" : _0x4c5b("0x42e"),
        "massFontFamily" : "Ubuntu",
        "massFontWeight" : 700,
        "sectorsFont" : "ubuntu",
        "sectorsFontFamily" : _0x4c5b("0x262"),
        "sectorsFontWeight" : 400,
        "sectorsX" : 5,
        "sectorsY" : 5,
        "namesScale" : 1,
        "massScale" : 3,
        "virMassScale" : 3,
        "strokeScale" : 1,
        "foodSize" : 1,
        "bordersWidth" : 34,
        "sectorsWidth" : 82,
        "sectorsFontSize" : 1770,
        "cellsAlpha" : .9,
        "skinsAlpha" : .7,
        "virusAlpha" : .6,
        "textAlpha" : 1,
        "ghostCellsAlpha" : .66,
        "virusStrokeSize" : 20,
        "virusGlowSize" : 14,
        "borderGlowSize" : 14,
        "menuPreset" : "ogario-v3",
        "menuMainColorX" : _0x4c5b("0x43a"),
        "menuPanelColorX" : _0x4c5b("0x431"),
        "menuPanelColorX2" : _0x4c5b("0x42b"),
        "menuPanelColorX3" : _0x4c5b("0x43b"),
        "menuImg" : "https://i.imgur.com/2JNEd9O.jpg",
        "menuImgOpacity" : .55,
        "hudMainColor" : _0x4c5b("0x429"),
        "hudColor" : _0x4c5b("0x43c"),
        "hudTextColor" : _0x4c5b("0x42c"),
        "statsHudColor" : _0x4c5b("0x42c"),
        "timeHudColor" : _0x4c5b("0x429"),
        "top5MassColor" : "#00c2ff",
        "lbMeColor" : _0x4c5b("0x429"),
        "lbTeammateColor" : _0x4c5b("0x429"),
        "hudFont" : _0x4c5b("0x42e"),
        "hudFontFamily" : _0x4c5b("0x262"),
        "hudFontWeight" : 700,
        "hudScale" : 1,
        "messageColor" : _0x4c5b("0x436"),
        "messageTextColor" : _0x4c5b("0x42c"),
        "messageTimeColor" : "#fff",
        "messageNickColor" : _0x4c5b("0x429"),
        "commandsColor" : _0x4c5b("0x43d"),
        "commandsTextColor" : _0x4c5b("0x42c"),
        "commandsTimeColor" : _0x4c5b("0x429"),
        "commandsNickColor" : _0x4c5b("0x42c"),
        "chatBoxColor" : _0x4c5b("0x436"),
        "chatScale" : 1,
        "miniMapSectorsColor" : _0x4c5b("0x42c"),
        "miniMapSectorColor" : "#fff",
        "miniMapGuidesColor" : _0x4c5b("0x429"),
        "miniMapNickColor" : _0x4c5b("0x42c"),
        "miniMapNickStrokeColor" : _0x4c5b("0x437"),
        "miniMapMyCellColor" : "#dedede",
        "miniMapMyCellStrokeColor" : _0x4c5b("0x429"),
        "miniMapTeammatesColor" : _0x4c5b("0x429"),
        "miniMapDeathLocationColor" : _0x4c5b("0x429"),
        "miniMapGhostCellsColor" : _0x4c5b("0x429"),
        "color" : _0x4c5b("0x429"),
        "commanderImage" : "https://i.imgur.com/wQKUDB3.png",
        "commanderImage1" : "https://i.imgur.com/XODc5iZ.png",
        "commanderImage2" : "https://i.imgur.com/Ux8Pt9I.png",
        "miniMapFont" : _0x4c5b("0x42e"),
        "miniMapFontFamily" : _0x4c5b("0x262"),
        "miniMapFontWeight" : 700,
        "miniMapNickFont" : _0x4c5b("0x42e"),
        "miniMapNickFontFamily" : _0x4c5b("0x262"),
        "miniMapNickFontWeight" : 700,
        "miniMapWidth" : 205,
        "miniMapSectorsOpacity" : .33,
        "miniMapNickSize" : 11,
        "miniMapNickStrokeSize" : 2,
        "miniMapMyCellSize" : 5.5,
        "miniMapMyCellStrokeSize" : 0,
        "miniMapTeammatesSize" : 5.5,
        "miniMapGhostCellsAlpha" : .65,
        "customBackground" : "",
        "customCursor" : "https://cdn.ogario.ovh/static/img/cursors/cursor_01.cur"
      };
      var _0x1ed7f4 = {
        "menuMainColorCSS" : null,
        "menuPanelColorCSS" : null,
        "menuTextlColorCSS" : null,
        "menuButtonsCSS" : null,
        "hudCSS" : null,
        "chatCSS" : null,
        "chatScaleCSS" : null,
        "cursorCSS" : null,
        "loadThemeSettings" : function() {
          var parsedHash = null;
          var attribute;
          for (attribute in null !== window[_0x4c5b("0x206")][_0x4c5b("0x441")](_0x4c5b("0x442")) && (parsedHash = JSON[_0x4c5b("0x443")](window[_0x4c5b("0x206")][_0x4c5b("0x441")](_0x4c5b("0x442")))), data) {
            if (data[_0x4c5b("0x3fe")](attribute)) {
              if (parsedHash && parsedHash["hasOwnProperty"](attribute)) {
                data[attribute] = parsedHash[attribute];
              }
              if (attributes["hasOwnProperty"](attribute)) {
                attributes[attribute] = data[attribute];
              }
            }
          }
        },
        "saveThemeSettings" : function() {
          window[_0x4c5b("0x206")]["setItem"](_0x4c5b("0x442"), JSON["stringify"](data));
        },
        "restoreThemeSettings" : function() {
          if (null !== window["localStorage"][_0x4c5b("0x441")]("XThemeSettings")) {
            window[_0x4c5b("0x206")][_0x4c5b("0x444")](_0x4c5b("0x442"));
            window["location"][_0x4c5b("0x445")]();
          }
        },
        "addCustomCSS" : function(template, html) {
          if (!this[template]) {
            this[template] = $(_0x4c5b("0x446"))[_0x4c5b("0x447")]("head");
          }
          this[template]["html"](html);
        },
        "addPresetBox" : function(heading, prefix, obj, index, key) {
          var key;
          for (key in $(heading)[_0x4c5b("0x448")](_0x4c5b("0x449") + args[prefix] + _0x4c5b("0x44a") + prefix + _0x4c5b("0x44b")), obj) {
            if (obj["hasOwnProperty"](key)) {
              $("#" + prefix)["append"]('<option value="' + key + '">' + obj[key][_0x4c5b("0x217")] + _0x4c5b("0x44c"));
            }
          }
          $("#" + prefix)[_0x4c5b("0x44d")](data[index]);
          var graphic = this;
          $("#" + prefix)["on"]("change", function() {
            var el = this[_0x4c5b("0x226")];
            data[index] = el;
            graphic[key](el);
          });
        },
        "addColorBox" : function(s, i, hash) {
          if ($(s)[_0x4c5b("0x448")](_0x4c5b("0x44e") + args[i] + _0x4c5b("0x44f") + i + _0x4c5b("0x450") + data[i] + _0x4c5b("0x451") + i + '" class="form-control" /><span class="input-group-addon"><i></i></span></div></div>'), hash) {
            var deletedHashes = this;
            $(s + " ." + i + "-picker")[_0x4c5b("0x452")]({
              "format" : _0x4c5b("0x2a")
            })["on"]("changeColor.colorpicker", function(canCreateDiscussions) {
              data[i] = canCreateDiscussions["color"][_0x4c5b("0x453")]();
              if (attributes[_0x4c5b("0x3fe")](i)) {
                attributes[i] = data[i];
              }
              deletedHashes[hash]();
            });
          } else {
            $(s + " ." + i + "-picker")[_0x4c5b("0x452")]({
              "format" : _0x4c5b("0x2a")
            })["on"](_0x4c5b("0x454"), function(canCreateDiscussions) {
              data[i] = canCreateDiscussions["color"][_0x4c5b("0x453")]();
              if (attributes[_0x4c5b("0x3fe")](i)) {
                attributes[i] = data[i];
              }
            });
          }
        },
        "addRgbaColorBox" : function(value, attribute, reprAttribute) {
          if ($(value)["append"](_0x4c5b("0x44e") + args[attribute] + _0x4c5b("0x44f") + attribute + '-picker"><input type="text" value="' + data[attribute] + _0x4c5b("0x451") + attribute + '" class="form-control" /><span class="input-group-addon"><i></i></span></div></div>'), reprAttribute) {
            var defaultUndefinedAttributes = this;
            $(value + " ." + attribute + _0x4c5b("0x455"))[_0x4c5b("0x452")]({
              "format" : _0x4c5b("0x456")
            })["on"](_0x4c5b("0x454"), function(iconColors) {
              var levels = iconColors["color"][_0x4c5b("0x457")]();
              data[attribute] = "rgba(" + levels["r"] + "," + levels["g"] + "," + levels["b"] + "," + levels["a"] + ")";
              if (attributes["hasOwnProperty"](attribute)) {
                attributes[attribute] = data[attribute];
              }
              defaultUndefinedAttributes[reprAttribute]();
            });
          } else {
            $(value + " ." + attribute + _0x4c5b("0x455"))[_0x4c5b("0x452")]({
              "format" : _0x4c5b("0x456")
            })["on"](_0x4c5b("0x454"), function(canCreateDiscussions) {
              var levels = canCreateDiscussions["color"][_0x4c5b("0x457")]();
              data[attribute] = _0x4c5b("0x458") + levels["r"] + "," + levels["g"] + "," + levels["b"] + "," + levels["a"] + ")";
              if (attributes[_0x4c5b("0x3fe")](attribute)) {
                attributes[attribute] = data[attribute];
              }
            });
          }
        },
        "addSliderBox" : function(context, attribute, params, courseId, acceptStatement, siteId) {
          if ($(context)[_0x4c5b("0x448")](_0x4c5b("0x459") + args[attribute] + _0x4c5b("0x45a") + attribute + '-value" class="value">' + data[attribute] + _0x4c5b("0x45b") + attribute + _0x4c5b("0x45c") + params + _0x4c5b("0x45d") + courseId + '" step="' + acceptStatement + _0x4c5b("0x45e") + data[attribute] + _0x4c5b("0x45f")), siteId) {
            var remoteStylesEls = this;
            $("#" + attribute + "-slider")["on"](_0x4c5b("0x460"), function() {
              var value = parseFloat($(this)[_0x4c5b("0x44d")]());
              $("#" + attribute + _0x4c5b("0x461"))[_0x4c5b("0x1ff")](value);
              data[attribute] = value;
              if (attributes["hasOwnProperty"](attribute)) {
                attributes[attribute] = value;
              }
              remoteStylesEls[siteId]();
            });
          } else {
            $("#" + attribute + _0x4c5b("0x462"))["on"](_0x4c5b("0x460"), function() {
              var val = parseFloat($(this)[_0x4c5b("0x44d")]());
              $("#" + attribute + _0x4c5b("0x461"))["text"](val);
              data[attribute] = val;
              if (attributes[_0x4c5b("0x3fe")](attribute)) {
                attributes[attribute] = val;
              }
            });
          }
        },
        "addInputBox" : function(boxItem, title, post, userId) {
          $(boxItem)[_0x4c5b("0x448")](_0x4c5b("0x463") + args[title] + '</span><input id="' + title + _0x4c5b("0x464") + post + _0x4c5b("0x45e") + data[title] + _0x4c5b("0x465"));
          var g = this;
          $("#" + title)["on"](_0x4c5b("0x460"), function() {
            data[title] = this[_0x4c5b("0x226")];
            g[userId]();
          });
        },
        "addCursorBox" : function(computeOverlap, index) {
          if (index === data[_0x4c5b("0x466")]) {
            $(computeOverlap)[_0x4c5b("0x448")](_0x4c5b("0x467") + index + _0x4c5b("0x468"));
          } else {
            $(computeOverlap)[_0x4c5b("0x448")](_0x4c5b("0x469") + index + '"></a></div>');
          }
        },
        "setFont" : function(index, value) {
          data[index] = value;
          data[index + _0x4c5b("0x46a")] = this[_0x4c5b("0x270")](value);
          data[index + _0x4c5b("0x46b")] = this["setFontWeight"](value);
          if (attributes[_0x4c5b("0x3fe")](index + _0x4c5b("0x46a"))) {
            attributes[index + _0x4c5b("0x46a")] = data[index + _0x4c5b("0x46a")];
          }
          if (attributes[_0x4c5b("0x3fe")](index + _0x4c5b("0x46b"))) {
            attributes[index + _0x4c5b("0x46b")] = data[index + _0x4c5b("0x46b")];
          }
        },
        "addFontBox" : function(location, content, i) {
          $(location)["append"](_0x4c5b("0x46c") + args[content] + _0x4c5b("0x44a") + content + _0x4c5b("0x44b"));
          $("#" + content)[_0x4c5b("0x448")](_0x4c5b("0x46d"));
          $("#" + content)[_0x4c5b("0x448")](_0x4c5b("0x46e"));
          $("#" + content)["append"](_0x4c5b("0x46f"));
          $("#" + content)[_0x4c5b("0x44d")](data[content]);
          var tileFuncs = this;
          if (i) {
            $("#" + content)["on"](_0x4c5b("0x470"), function() {
              var tiles = this[_0x4c5b("0x226")];
              tileFuncs["setFont"](content, tiles);
              tileFuncs[i]();
            });
          } else {
            $("#" + content)["on"]("change", function() {
              var tiles = this[_0x4c5b("0x226")];
              tileFuncs["setFont"](content, tiles);
            });
          }
        },
        "setFontFamily" : function(fontFamily) {
          return -1 == fontFamily[_0x4c5b("0x2d")](_0x4c5b("0x471")) ? -1 == fontFamily[_0x4c5b("0x2d")](_0x4c5b("0x472")) ? _0x4c5b("0x262") : _0x4c5b("0x473") : _0x4c5b("0x474");
        },
        "setFontWeight" : function(value) {
          return -1 == value["indexOf"](_0x4c5b("0x232")) ? 400 : 700;
        },
        "setThemeMenu" : function() {
          var _0x140cc3 = this;
          this["addPresetBox"](_0x4c5b("0x475"), _0x4c5b("0x476"), artistTrack, _0x4c5b("0x477"), "changeThemePreset");
          this[_0x4c5b("0x478")](_0x4c5b("0x475"), "bgColor", _0x4c5b("0x479"));
          this[_0x4c5b("0x478")](_0x4c5b("0x475"), _0x4c5b("0x47a"));
          this[_0x4c5b("0x478")]("#theme-main", _0x4c5b("0x47b"));
          this["addColorBox"](_0x4c5b("0x475"), _0x4c5b("0x47c"));
          this[_0x4c5b("0x478")]("#theme-main", "sectorsColor");
          this[_0x4c5b("0x478")](_0x4c5b("0x475"), "namesColor");
          this[_0x4c5b("0x478")]("#theme-main", _0x4c5b("0x2cd"));
          this[_0x4c5b("0x478")](_0x4c5b("0x475"), _0x4c5b("0x47d"));
          this[_0x4c5b("0x478")](_0x4c5b("0x475"), _0x4c5b("0x2d3"));
          this[_0x4c5b("0x478")](_0x4c5b("0x475"), "virusColor");
          this[_0x4c5b("0x478")]("#theme-main", "virusStrokeColor");
          this["addColorBox"]("#theme-main", _0x4c5b("0x2e5"));
          this[_0x4c5b("0x478")](_0x4c5b("0x475"), "foodColor", _0x4c5b("0x47f"));
          this[_0x4c5b("0x478")]("#theme-main", _0x4c5b("0x480"), _0x4c5b("0x481"));
          this[_0x4c5b("0x478")]("#theme-main", _0x4c5b("0x482"));
          this[_0x4c5b("0x478")]("#theme-main", _0x4c5b("0x483"));
          this[_0x4c5b("0x478")](_0x4c5b("0x475"), _0x4c5b("0x484"));
          this[_0x4c5b("0x478")](_0x4c5b("0x475"), _0x4c5b("0x485"));
          this[_0x4c5b("0x478")](_0x4c5b("0x475"), _0x4c5b("0x486"));
          this[_0x4c5b("0x478")]("#theme-main", "color");
          this[_0x4c5b("0x487")](_0x4c5b("0x475"), _0x4c5b("0x488"));
          this[_0x4c5b("0x487")]("#theme-main", "massFont");
          this["addFontBox"](_0x4c5b("0x475"), _0x4c5b("0x489"));
          this["addSliderBox"](_0x4c5b("0x475"), _0x4c5b("0x48a"), 200, 2E3, 10);
          this[_0x4c5b("0x48b")]("#theme-main", _0x4c5b("0x48c"), .5, 2, .1);
          this[_0x4c5b("0x48b")](_0x4c5b("0x475"), _0x4c5b("0x294"), 1, 5, 1);
          this[_0x4c5b("0x48b")](_0x4c5b("0x475"), _0x4c5b("0x295"), 1, 5, 1);
          this[_0x4c5b("0x48b")]("#theme-main", "strokeScale", 1, 4, .1);
          this[_0x4c5b("0x48b")](_0x4c5b("0x475"), _0x4c5b("0x2d7"), 1, 50, 1, _0x4c5b("0x47f"));
          this[_0x4c5b("0x48b")](_0x4c5b("0x475"), _0x4c5b("0x2e2"), 2, 40, 1);
          this[_0x4c5b("0x48b")](_0x4c5b("0x475"), _0x4c5b("0x2e4"), 0, 40, 1);
          this["addSliderBox"](_0x4c5b("0x475"), _0x4c5b("0x48d"), 0, 40, 1);
          this[_0x4c5b("0x48b")]("#theme-main", _0x4c5b("0x48e"), 2, 200, 2);
          this["addSliderBox"](_0x4c5b("0x475"), _0x4c5b("0x48f"), 2, 200, 2);
          this[_0x4c5b("0x48b")](_0x4c5b("0x475"), _0x4c5b("0x490"), .01, .99, .01);
          this["addSliderBox"](_0x4c5b("0x475"), _0x4c5b("0x2f2"), .01, .99, .01);
          this[_0x4c5b("0x48b")](_0x4c5b("0x475"), _0x4c5b("0x2dc"), 0, 1, .01);
          this[_0x4c5b("0x48b")](_0x4c5b("0x475"), _0x4c5b("0x2f8"), .1, 1, .01);
          this[_0x4c5b("0x48b")](_0x4c5b("0x475"), "ghostCellsAlpha", .01, .99, .01);
          this[_0x4c5b("0x478")](_0x4c5b("0x491"), _0x4c5b("0x492"), _0x4c5b("0x493"));
          this[_0x4c5b("0x478")](_0x4c5b("0x491"), _0x4c5b("0x494"), _0x4c5b("0x495"));
          this[_0x4c5b("0x478")](_0x4c5b("0x491"), _0x4c5b("0x496"), _0x4c5b("0x495"));
          this[_0x4c5b("0x497")](_0x4c5b("0x491"), "menuPanelColorX3", _0x4c5b("0x495"));
          this[_0x4c5b("0x498")](_0x4c5b("0x491"), _0x4c5b("0x499"), _0x4c5b("0x49a"), _0x4c5b("0x49b"));
          this[_0x4c5b("0x48b")](_0x4c5b("0x491"), "menuImgOpacity", 0, 1, .01, _0x4c5b("0x49c"));
          this[_0x4c5b("0x478")]("#theme-hud", "hudMainColor", _0x4c5b("0x49d"));
          this[_0x4c5b("0x497")](_0x4c5b("0x49e"), _0x4c5b("0x49f"), _0x4c5b("0x49d"));
          this[_0x4c5b("0x478")](_0x4c5b("0x49e"), "hudTextColor", "setHudColors");
          this["addColorBox"](_0x4c5b("0x49e"), _0x4c5b("0x4a0"), _0x4c5b("0x49d"));
          this[_0x4c5b("0x478")]("#theme-hud", _0x4c5b("0x4a1"), _0x4c5b("0x49d"));
          this[_0x4c5b("0x478")](_0x4c5b("0x49e"), "top5MassColor", _0x4c5b("0x49d"));
          this[_0x4c5b("0x478")]("#theme-hud", _0x4c5b("0x4a2"), _0x4c5b("0x49d"));
          this["addColorBox"](_0x4c5b("0x49e"), _0x4c5b("0x4a3"), _0x4c5b("0x49d"));
          this[_0x4c5b("0x487")](_0x4c5b("0x49e"), "hudFont", _0x4c5b("0x4a4"));
          this[_0x4c5b("0x48b")](_0x4c5b("0x49e"), _0x4c5b("0x4a5"), 1, 2, .01, "setHudScale");
          this["addRgbaColorBox"](_0x4c5b("0x4a6"), _0x4c5b("0x4a7"), "setChatColors");
          this[_0x4c5b("0x478")]("#theme-chat", _0x4c5b("0x4a8"), "setChatColors");
          this[_0x4c5b("0x478")](_0x4c5b("0x4a6"), _0x4c5b("0x4a9"), _0x4c5b("0x4aa"));
          this[_0x4c5b("0x478")]("#theme-chat", _0x4c5b("0x4ab"), _0x4c5b("0x4aa"));
          this["addRgbaColorBox"](_0x4c5b("0x4a6"), _0x4c5b("0x4ac"), "setChatColors");
          this[_0x4c5b("0x478")](_0x4c5b("0x4a6"), _0x4c5b("0x4ad"), "setChatColors");
          this[_0x4c5b("0x478")](_0x4c5b("0x4a6"), "commandsTimeColor", "setChatColors");
          this[_0x4c5b("0x478")](_0x4c5b("0x4a6"), _0x4c5b("0x4ae"), "setChatColors");
          this[_0x4c5b("0x497")](_0x4c5b("0x4a6"), "chatBoxColor", _0x4c5b("0x4aa"));
          this[_0x4c5b("0x48b")](_0x4c5b("0x4a6"), _0x4c5b("0x4af"), 1, 2, .01, _0x4c5b("0x4b0"));
          this[_0x4c5b("0x478")](_0x4c5b("0x4b1"), "miniMapSectorsColor", _0x4c5b("0x4b2"));
          this[_0x4c5b("0x478")](_0x4c5b("0x4b1"), _0x4c5b("0x4b3"));
          this[_0x4c5b("0x478")]("#theme-minimap", "miniMapNickColor");
          this[_0x4c5b("0x478")](_0x4c5b("0x4b1"), _0x4c5b("0x4b4"));
          this[_0x4c5b("0x478")](_0x4c5b("0x4b1"), _0x4c5b("0x4b5"));
          this[_0x4c5b("0x478")]("#theme-minimap", _0x4c5b("0x4b6"));
          this["addColorBox"]("#theme-minimap", _0x4c5b("0x4b7"));
          this[_0x4c5b("0x478")]("#theme-minimap", _0x4c5b("0x4b8"));
          this[_0x4c5b("0x478")](_0x4c5b("0x4b1"), _0x4c5b("0x4b9"));
          this[_0x4c5b("0x478")](_0x4c5b("0x4b1"), "miniMapGhostCellsColor");
          this[_0x4c5b("0x487")](_0x4c5b("0x4b1"), _0x4c5b("0x4ba"), _0x4c5b("0x4bb"));
          this[_0x4c5b("0x487")](_0x4c5b("0x4b1"), _0x4c5b("0x4bc"));
          this[_0x4c5b("0x48b")]("#theme-minimap", "miniMapWidth", 200, 400, 1, _0x4c5b("0x4bd"));
          this[_0x4c5b("0x48b")]("#theme-minimap", _0x4c5b("0x4be"), 0, 1, .01, "setMiniMapSectorsOpacity");
          this[_0x4c5b("0x48b")](_0x4c5b("0x4b1"), _0x4c5b("0x4bf"), 8, 16, 1);
          this["addSliderBox"](_0x4c5b("0x4b1"), _0x4c5b("0x4c0"), 0, 6, 1);
          this[_0x4c5b("0x48b")](_0x4c5b("0x4b1"), _0x4c5b("0x4c1"), 4, 10, .5);
          this[_0x4c5b("0x48b")](_0x4c5b("0x4b1"), _0x4c5b("0x4c2"), 0, 10, 1);
          this[_0x4c5b("0x48b")](_0x4c5b("0x4b1"), "miniMapTeammatesSize", 4, 10, .5);
          this["addSliderBox"](_0x4c5b("0x4b1"), _0x4c5b("0x4c3"), .01, .99, .01);
          this[_0x4c5b("0x498")]("#theme-images", _0x4c5b("0x4c4"), "Image URL", "setCustomBackground");
          this[_0x4c5b("0x498")](_0x4c5b("0x4c5"), _0x4c5b("0x466"), _0x4c5b("0x4c6"), "setCustomCursor");
          var _0x2fcc15 = 0;
          for (; 35 > _0x2fcc15; _0x2fcc15++) {
            if (9 > _0x2fcc15) {
              this["addCursorBox"](_0x4c5b("0x4c5"), _0x4c5b("0x4c7") + (_0x2fcc15 + 1) + _0x4c5b("0x4c8"));
            } else {
              this["addCursorBox"]("#theme-images", "https://cdn.ogario.ovh/static/img/cursors/cursor_" + (_0x2fcc15 + 1) + _0x4c5b("0x4c8"));
            }
          }
          $(document)["on"](_0x4c5b("0x4c9"), _0x4c5b("0x4ca"), function(result) {
            result["preventDefault"]();
            var generatedField = $(_0x4c5b("0x4cb"), this)["attr"]("src");
            data[_0x4c5b("0x466")] = generatedField;
            _0x140cc3[_0x4c5b("0x4cd")]();
            $(_0x4c5b("0x4ce"))[_0x4c5b("0x44d")](generatedField);
            $("#theme-images .cursor-box a")[_0x4c5b("0x4cf")](_0x4c5b("0x4d0"));
            $(this)[_0x4c5b("0x4d1")](_0x4c5b("0x4d0"));
          });
          $("#theme")[_0x4c5b("0x448")](_0x4c5b("0x4d2") + args[_0x4c5b("0x4d3")] + _0x4c5b("0x4d4"));
          $(document)["on"](_0x4c5b("0x4c9"), _0x4c5b("0x4d5"), function(result) {
            result["preventDefault"]();
            var element = $(this);
            element[_0x4c5b("0x1ff")](args[_0x4c5b("0x4d6")]);
            _0x140cc3[_0x4c5b("0x4d7")]();
            setTimeout(function() {
              element["text"](args[_0x4c5b("0x4d3")]);
            }, 500);
          });
          $("#theme")[_0x4c5b("0x448")]('<div class="restore-settings"><a href="#">' + args[_0x4c5b("0x4d8")] + _0x4c5b("0x4d9"));
          $(document)["on"](_0x4c5b("0x4c9"), "#theme .restore-settings a", function(canCreateDiscussions) {
            canCreateDiscussions[_0x4c5b("0x4da")]();
            _0x140cc3[_0x4c5b("0x4d8")]();
          });
          $(_0x4c5b("0x4db"))[_0x4c5b("0x452")]({
            "format" : _0x4c5b("0x2a"),
            "input" : _0x4c5b("0x4dc")
          });
        },
        "changePreset" : function(t, i) {
          if (i[t]) {
            var key;
            for (key in data[t] = t, t = i[t], t) {
              if (t[_0x4c5b("0x3fe")](key) && data["hasOwnProperty"](key)) {
                data[key] = t[key];
                if (attributes[_0x4c5b("0x3fe")](key)) {
                  attributes[key] = data[key];
                }
                if ($("#theme ." + key + _0x4c5b("0x455"))) {
                  $(_0x4c5b("0x4dd") + key + _0x4c5b("0x455"))[_0x4c5b("0x452")](_0x4c5b("0x4de"), data[key]);
                }
                if ($("#" + key + _0x4c5b("0x462"))) {
                  $("#" + key + "-slider")[_0x4c5b("0x44d")](data[key])[_0x4c5b("0x470")]();
                }
                if ($(_0x4c5b("0x4df") + key) || $(_0x4c5b("0x4e0") + key)) {
                  $("#" + key)[_0x4c5b("0x44d")](data[key]);
                }
              }
            }
          }
        },
        "changeThemePreset" : function(mmCoreSplitViewBlock) {
          this["changePreset"](mmCoreSplitViewBlock, artistTrack);
          this["setTheme"]();
        },
        "setFonts" : function() {
          this["setFont"](_0x4c5b("0x488"), data[_0x4c5b("0x488")]);
          this["setFont"](_0x4c5b("0x4e1"), data[_0x4c5b("0x488")]);
          this["setFont"](_0x4c5b("0x489"), data[_0x4c5b("0x489")]);
        },
        "setBgColor" : function() {
          $(_0x4c5b("0x4e2"))[_0x4c5b("0x304")](_0x4c5b("0x4e3"), data["bgColor"]);
        },
        "setFoodColor" : function() {
          if (settings[_0x4c5b("0x4e4")] && methods) {
            methods[_0x4c5b("0x4e5")]();
          }
        },
        "setIndicatorColor" : function() {
          if (methods) {
            methods[_0x4c5b("0x4e6")]();
          }
        },
        "setCustomBackground" : function() {
          if (data[_0x4c5b("0x4c4")]) {
            $(_0x4c5b("0x4e2"))["css"](_0x4c5b("0x4e7"), "url(" + data[_0x4c5b("0x4c4")] + ")");
          } else {
            $(_0x4c5b("0x4e2"))[_0x4c5b("0x304")](_0x4c5b("0x4e7"), _0x4c5b("0x4e8"));
          }
        },
        "setCustomCursor" : function() {
          if (data[_0x4c5b("0x466")]) {
            var artistTrack = _0x4c5b("0x4e9") + data[_0x4c5b("0x466")] + _0x4c5b("0x4ea");
          } else {
            artistTrack = _0x4c5b("0x4eb");
          }
          this[_0x4c5b("0x4ec")](_0x4c5b("0x4ed"), artistTrack);
        },
        "setMenu" : function() {
          this[_0x4c5b("0x49c")]();
          this[_0x4c5b("0x493")]();
          this["setMenuPanelColor"]();
          this[_0x4c5b("0x4ee")]();
          this[_0x4c5b("0x49b")]();
        },
        "changeMenuPreset" : function(mmCoreSplitViewBlock) {
          this["changePreset"](mmCoreSplitViewBlock, GET_AUTH_URL_TIMEOUT);
          this[_0x4c5b("0x4ef")]();
        },
        "setMenuOpacity" : function() {
          $(_0x4c5b("0x4f0"))[_0x4c5b("0x304")]("opacity", data[_0x4c5b("0x4f1")]);
        },
        "setMenuMainColor" : function() {
          var artistTrack = "::-moz-selection{background-color:" + data[_0x4c5b("0x4f2")] + _0x4c5b("0x4f3") + data[_0x4c5b("0x4f2")] + "!important}.menu-main-color,#quick-menu a:hover,.quick,.quick:focus,.menu-tabs a:hover,.menu-tabs .active,.submenu-tabs a:hover,.submenu-tabs .active,#stats center,#exp-imp h1{color:" + data[_0x4c5b("0x4f2")] + "}#exp-bar .progress-bar-striped,.quick:hover,.rangeslider__fill{background-color:" + data[_0x4c5b("0x4f2")] + _0x4c5b("0x4f4") + data[_0x4c5b("0x4f2")] + 
          _0x4c5b("0x4f5") + data["menuMainColorXx"] + _0x4c5b("0x4f6") + data[_0x4c5b("0x4f2")] + _0x4c5b("0x4f7") + data[_0x4c5b("0x4f2")] + _0x4c5b("0x4f8") + data[_0x4c5b("0x4f2")] + _0x4c5b("0x4f9") + data[_0x4c5b("0x4f2")] + _0x4c5b("0x4fa") + data[_0x4c5b("0x4f2")] + _0x4c5b("0x4fb") + data[_0x4c5b("0x4f2")] + _0x4c5b("0x4fc") + data[_0x4c5b("0x4f2")] + _0x4c5b("0x4fd") + data[_0x4c5b("0x4f2")] + _0x4c5b("0x4fe") + data[_0x4c5b("0x4f2")] + _0x4c5b("0x4ff") + data[_0x4c5b("0x4f2")] + ";border-color:" + 
          data[_0x4c5b("0x4f2")] + "}.menu-bar-button:hover, .barf {border-bottom: 3px solid " + data["menuMainColorXx"] + _0x4c5b("0x500") + data[_0x4c5b("0x4f2")] + "}";
          this[_0x4c5b("0x4ec")](_0x4c5b("0x501"), artistTrack);
        },
        "setMenuPanelColor" : function() {
          var artistTrack = _0x4c5b("0x502") + data[_0x4c5b("0x503")] + _0x4c5b("0x504") + data[_0x4c5b("0x496")] + "}.agario-panel h5,.agario-side-panel h5,#stats h2,.menu-tabs,.submenu-tabs,#skins a.default,#stats hr,#hotkeys-cfg div.row, #exp-imp h1{border-color: " + data[_0x4c5b("0x496")] + _0x4c5b("0x505") + data["menuPanelColorX2"] + "}#panelX, .menu-bar{background-color:" + data[_0x4c5b("0x506")] + _0x4c5b("0x507") + data[_0x4c5b("0x506")] + _0x4c5b("0x508");
          this[_0x4c5b("0x4ec")](_0x4c5b("0x509"), artistTrack);
        },
        "setMenuTextColor" : function() {
          this[_0x4c5b("0x4ec")](_0x4c5b("0x50a"), _0x4c5b("0x50b"));
        },
        "setMenuBg" : function() {
          $(_0x4c5b("0x50c"))[_0x4c5b("0x44d")](data[_0x4c5b("0x499")]);
          if (data[_0x4c5b("0x499")]) {
            $(_0x4c5b("0x4f0"))[_0x4c5b("0x304")](_0x4c5b("0x4e7"), _0x4c5b("0x50d") + data[_0x4c5b("0x499")] + ")");
          } else {
            $(_0x4c5b("0x4f0"))[_0x4c5b("0x304")]("background-image", _0x4c5b("0x4e8"));
          }
        },
        "setHud" : function() {
          this[_0x4c5b("0x49d")]();
          this[_0x4c5b("0x4a4")]();
          this[_0x4c5b("0x50e")]();
        },
        "setHudColors" : function() {
          var artistTrack = _0x4c5b("0x50f") + data[_0x4c5b("0x510")] + _0x4c5b("0x511") + data[_0x4c5b("0x49f")] + _0x4c5b("0x512") + data[_0x4c5b("0x513")] + "}.stats-hud-color{color:" + data[_0x4c5b("0x4a0")] + "}.time-hud-color{color:" + data["timeHudColor"] + _0x4c5b("0x514") + data["top5MassColor"] + _0x4c5b("0x515") + data[_0x4c5b("0x4a2")] + _0x4c5b("0x516") + data[_0x4c5b("0x4a3")] + _0x4c5b("0x517") + data[_0x4c5b("0x49f")] + _0x4c5b("0x518");
          this[_0x4c5b("0x4ec")](_0x4c5b("0x519"), artistTrack);
        },
        "setHudFont" : function() {
          this["setFont"](_0x4c5b("0x51a"), data[_0x4c5b("0x51a")]);
          $(_0x4c5b("0x51b"))[_0x4c5b("0x304")]({
            "font-family" : data[_0x4c5b("0x51c")],
            "font-weight" : data[_0x4c5b("0x51d")]
          });
        },
        "setHudScale" : function() {
          var ylw = Math[_0x4c5b("0x2bf")](20 * data["hudScale"]);
          var artistTrack = Math[_0x4c5b("0x2bf")](200 * data[_0x4c5b("0x4a5")]);
          var bodyContentWidth = Math[_0x4c5b("0xd8")](55 * data[_0x4c5b("0x4a5")]);
          var strip_width = Math[_0x4c5b("0xd8")](6 * data["hudScale"]);
          var updatedTop = Math[_0x4c5b("0xd8")](280 * data["hudScale"]);
          var updatedLeft = Math["floor"](85 * data[_0x4c5b("0x4a5")]);
          var xlw = Math[_0x4c5b("0xd8")](20 * data[_0x4c5b("0x4a5")]);
          $(_0x4c5b("0x51b"))[_0x4c5b("0x304")](_0x4c5b("0x51e"), ylw + "px");
          $(_0x4c5b("0x51f"))["width"](artistTrack);
          $(_0x4c5b("0x520"))["width"](artistTrack + 30)["css"](_0x4c5b("0x306"), bodyContentWidth + "px");
          $(_0x4c5b("0x521"))[_0x4c5b("0x304")](_0x4c5b("0x522"), strip_width + "px");
          $("#time-hud")[_0x4c5b("0x304")](_0x4c5b("0x306"), updatedTop + "px");
          $("#pause-hud")[_0x4c5b("0x304")](_0x4c5b("0x306"), updatedLeft + "px");
          $(_0x4c5b("0x523"))["css"](_0x4c5b("0x524"), xlw + "px");
        },
        "setChat" : function() {
          this[_0x4c5b("0x4aa")]();
          this[_0x4c5b("0x4b0")]();
        },
        "setChatColors" : function() {
          var artistTrack = "#message,#messages li,.toast-success{background-color:" + data["messageColor"] + "}#message,.message-text,.toast-success .message-text{color:" + data[_0x4c5b("0x4a8")] + "}.message-nick,.mute-user,.mute-user:hover,.toast-success .message-nick,.toast .mute-user,.toast .mute-user:hover{color:" + data[_0x4c5b("0x4ab")] + "}.message-time{color:" + data[_0x4c5b("0x4a9")] + _0x4c5b("0x525") + data[_0x4c5b("0x4ac")] + _0x4c5b("0x526") + data[_0x4c5b("0x4ad")] + _0x4c5b("0x527") + 
          data[_0x4c5b("0x4ae")] + _0x4c5b("0x528") + data[_0x4c5b("0x529")] + "}#chat-box{background-color:" + data["chatBoxColor"] + "}";
          this[_0x4c5b("0x4ec")]("chatCSS", artistTrack);
        },
        "setChatScale" : function() {
          var bodyContentWidth = Math[_0x4c5b("0x2bf")](14 * data[_0x4c5b("0x4af")]);
          var artistTrack = Math[_0x4c5b("0x2bf")](280 * data[_0x4c5b("0x4af")]);
          var GET_AUTH_URL_TIMEOUT = Math[_0x4c5b("0x2bf")](350 * data[_0x4c5b("0x4af")]);
          var numKeysDeleted = Math[_0x4c5b("0x2bf")](300 * data[_0x4c5b("0x4af")]);
          var xlw = Math[_0x4c5b("0xd8")](14 * data[_0x4c5b("0x4af")]);
          $(_0x4c5b("0x52a"))[_0x4c5b("0x304")](_0x4c5b("0x51e"), bodyContentWidth + "px");
          $(_0x4c5b("0x52b"))["width"](artistTrack);
          $(_0x4c5b("0x52c"))["width"](GET_AUTH_URL_TIMEOUT);
          $(_0x4c5b("0x52d"))["height"](numKeysDeleted);
          $(_0x4c5b("0x52e"))[_0x4c5b("0x304")](_0x4c5b("0x522"), xlw + "px");
          this["addCustomCSS"](_0x4c5b("0x52f"), _0x4c5b("0x530") + artistTrack + "px;font-size:" + bodyContentWidth + _0x4c5b("0x531"));
        },
        "setMiniMap" : function() {
          this[_0x4c5b("0x4bb")]();
          this[_0x4c5b("0x4bd")]();
          this[_0x4c5b("0x532")]();
        },
        "setMiniMapFont" : function() {
          this["setFont"](_0x4c5b("0x4ba"), data[_0x4c5b("0x4ba")]);
          if (m) {
            m[_0x4c5b("0x533")]();
          }
        },
        "setMiniMapWidth" : function() {
          var travis_job = data[_0x4c5b("0x534")] / 200;
          data[_0x4c5b("0x535")] = travis_job;
          $(_0x4c5b("0x536"))[_0x4c5b("0x304")]({
            "width" : data[_0x4c5b("0x534")],
            "height" : data[_0x4c5b("0x534")]
          });
          $(_0x4c5b("0x537"))[_0x4c5b("0x304")]({
            "bottom" : data["miniMapWidth"] + 10
          });
          if (m) {
            m["resetMiniMapSectors"]();
          }
        },
        "setMiniMapSectorsColor" : function() {
          if (m) {
            m[_0x4c5b("0x533")]();
          }
        },
        "setMiniMapSectorsOpacity" : function() {
          $(_0x4c5b("0x538"))["css"](_0x4c5b("0x539"), data[_0x4c5b("0x4be")]);
        },
        "setTheme" : function() {
          this["setFonts"]();
          this[_0x4c5b("0x479")]();
          this[_0x4c5b("0x53a")]();
          this[_0x4c5b("0x4cd")]();
          this[_0x4c5b("0x4ef")]();
          this["setHud"]();
          this[_0x4c5b("0x53b")]();
          this["setMiniMap"]();
        },
        "init" : function() {
          this["loadThemeSettings"]();
        }
      };
      var res = [];
      var names = {
        "nick" : _0x4c5b("0x53c"),
        "clanTag" : "\u0413\u0453\u0412\u045e\u0413\u045e\u0432\u201a\u00ac\u0415\u201c\u0413\u045e\u0432\u201a\u00ac\u0415\u040e",
        "skinURL" : _0x4c5b("0x53d"),
        "color" : data["mainColor"]
      };
      var settings = {
        "quickResp" : true,
        "autoResp" : false,
        "autoZoom" : false,
        "autoHideNames" : true,
        "autoHideMass" : true,
        "autoHideFood" : false,
        "autoHideFoodOnZoom" : false,
        "noNames" : false,
        "optimizedNames" : true,
        "hideMyName" : true,
        "hideTeammatesNames" : false,
        "showMass" : true,
        "showVirusMass" : true,
        "optimizedMass" : true,
        "shortMass" : true,
        "virMassShots" : true,
        "hideMyMass" : false,
        "hideEnemiesMass" : false,
        "vanillaSkins" : false,
        "customSkins" : true,
        "myTransparentSkin" : false,
        "myCustomColor" : false,
        "transparentCells" : false,
        "transparentViruses" : true,
        "transparentSkins" : false,
        "showGrid" : false,
        "showBgSectors" : false,
        "showMapBorders" : true,
        "showGhostCells" : true,
        "showMiniMap" : true,
        "showMiniMapGrid" : false,
        "showMiniMapGuides" : true,
        "showMiniMapGhostCells" : false,
        "oneColoredTeammates" : false,
        "optimizedFood" : true,
        "rainbowFood" : false,
        "oppColors" : false,
        "oppRings" : false,
        "virColors" : false,
        "splitRange" : false,
        "virusesRange" : false,
        "textStroke" : false,
        "namesStroke" : false,
        "massStroke" : false,
        "cursorTracking" : false,
        "teammatesInd" : false,
        "mouseSplit" : false,
        "mouseFeed" : false,
        "mouseInvert" : false,
        "disableChat" : false,
        "hideChat" : false,
        "chatSounds" : true,
        "chatEmoticons" : true,
        "showChatBox" : false,
        "showChatImages" : true,
        "showChatVideos" : true,
        "showTop5" : true,
        "showTargeting" : true,
        "showLbData" : false,
        "showTime" : true,
        "normalLb" : false,
        "centeredLb" : true,
        "fpsAtTop" : true,
        "showStats" : true,
        "showStatsMass" : true,
        "showStatsSTE" : false,
        "showStatsMassSplit" : true,
        "showStatsN16" : false,
        "showStatsFPS" : true,
        "blockPopups" : false,
        "streamMode" : false,
        "hideSkinUrl" : false,
        "showQuickMenu" : true,
        "showSkinsPanel" : true,
        "animation" : 140,
        "cameraSpeed" : 7,
        "commanderDelay" : 1E3,
        "suckAnimation" : false,
        "virusGlow" : false,
        "borderGlow" : false,
        "limLB" : 10,
        "limTP" : 5,
        "zoomSpeedValue" : .87,
        "messageSound" : "",
        "commandSound" : ""
      };
      var m = {
        "name" : _0x4c5b("0x428"),
        "version" : "",
        "privateMode" : false,
        "protocolMode" : true,
        "publicIP" : "wss://srv.ogario.eu",
        "privateIP" : null,
        "updateInterval" : 1E3,
        "updateTick" : 0,
        "updateMaxTick" : 2,
        "currentSector" : "",
        "miniMap" : null,
        "miniMapCtx" : null,
        "miniMapSectors" : null,
        "pi2" : 2 * Math["PI"],
        "socket" : null,
        "cells" : {},
        "teamPlayers" : [],
        "parties" : [],
        "chatHistory" : [],
        "chatUsers" : {},
        "chatMutedUsers" : {},
        "chatMutedUserIDs" : [],
        "customSkinsCache" : {},
        "customSkinsMap" : {},
        "cacheQueue" : [],
        "deathLocations" : [],
        "playerID" : null,
        "playerMass" : 0,
        "selectedProfile" : 0,
        "lastDeath" : 0,
        "skipServerData" : false,
        "gameMode" : _0x4c5b("0x53e"),
        "region" : "",
        "partyToken" : "",
        "ws" : "",
        "serverIP" : "",
        "serverArena" : "",
        "serverToken" : "",
        "lastSentNick" : "",
        "lastSentClanTag" : null,
        "lastSentSkinURL" : "",
        "lastSentCustomColor" : "",
        "lastSentPartyToken" : "",
        "lastSentServerToken" : "",
        "lastMessageSentTime" : Date[_0x4c5b("0x53f")](),
        "rFps" : 0,
        "renderedFrames" : 0,
        "fpsLastRequest" : null,
        "statsHUD" : null,
        "leaderboardPositionsHUD" : null,
        "leaderboardDataHUD" : null,
        "activeParties" : null,
        "top5pos" : null,
        "top5totalMass" : null,
        "top5totalPlayers" : null,
        "top5limit" : 5,
        "timeHUD" : null,
        "questHUD" : null,
        "retryResp" : 0,
        "token" : _0x4c5b("0x540"),
        "canvasScale" : 1,
        "selectBiggestCell" : true,
        "noColors" : false,
        "skipStats" : false,
        "showQuest" : false,
        "showSplitInd" : false,
        "pause" : false,
        "targetID" : 0,
        "targetStatus" : 0,
        "targetNick" : "",
        "targetSkinURL" : "",
        "targeting" : false,
        "privateMiniMap" : false,
        "messageSound" : null,
        "commandSound" : null,
        "feedInterval" : null,
        "getPlayerX" : function() {
          return attributes[_0x4c5b("0x541")] + attributes["mapOffsetX"];
        },
        "getPlayerY" : function() {
          return attributes[_0x4c5b("0x542")] + attributes["mapOffsetY"];
        },
        "feed" : function() {
          if (window[_0x4c5b("0x543")] && window[_0x4c5b("0x543")][_0x4c5b("0x544")]) {
            window[_0x4c5b("0x543")]["eject"]();
          }
        },
        "macroFeed" : function(canCreateDiscussions) {
          if (canCreateDiscussions) {
            if (this[_0x4c5b("0x545")]) {
              return;
            }
            var _0x4ec2e4 = this;
            this["feed"]();
            this[_0x4c5b("0x545")] = setInterval(function() {
              _0x4ec2e4[_0x4c5b("0x546")]();
            }, 80);
          } else {
            if (this[_0x4c5b("0x545")]) {
              clearInterval(this[_0x4c5b("0x545")]);
              this[_0x4c5b("0x545")] = null;
            }
          }
        },
        "split" : function() {
          if (window[_0x4c5b("0x543")] && window[_0x4c5b("0x543")][_0x4c5b("0x227")]) {
            window[_0x4c5b("0x543")][_0x4c5b("0x227")]();
          }
        },
        "doubleSplit" : function() {
          var _0x2fcc15 = this;
          _0x2fcc15[_0x4c5b("0x227")]();
          setTimeout(function() {
            _0x2fcc15[_0x4c5b("0x227")]();
          }, 40);
        },
        "popSplit" : function() {
          var layoutSets = this;
          layoutSets[_0x4c5b("0x227")]();
          setTimeout(function() {
            layoutSets["split"]();
          }, 200);
        },
        "split16" : function() {
          var _0x2fcc15 = this;
          _0x2fcc15[_0x4c5b("0x227")]();
          setTimeout(function() {
            _0x2fcc15[_0x4c5b("0x227")]();
          }, 40);
          setTimeout(function() {
            _0x2fcc15[_0x4c5b("0x227")]();
          }, 80);
          setTimeout(function() {
            _0x2fcc15[_0x4c5b("0x227")]();
          }, 120);
        },
        "toggleSkins" : function() {
          if (attributes["vanillaSkins"] && attributes[_0x4c5b("0x2ee")]) {
            attributes[_0x4c5b("0x547")] = false;
          } else {
            if (!attributes[_0x4c5b("0x548")] && attributes[_0x4c5b("0x2ee")]) {
              attributes[_0x4c5b("0x547")] = true;
              attributes[_0x4c5b("0x2ee")] = false;
            } else {
              attributes[_0x4c5b("0x547")] = true;
              attributes[_0x4c5b("0x2ee")] = true;
            }
          }
        },
        "toggleCells" : function() {
          this[_0x4c5b("0x549")] = !this[_0x4c5b("0x549")];
          attributes[_0x4c5b("0x549")] = this[_0x4c5b("0x549")];
        },
        "setShowTop5" : function() {
          settings[_0x4c5b("0x54a")] = !settings["showTop5"];
          this[_0x4c5b("0x54b")]();
        },
        "setTop5" : function() {
          if (settings[_0x4c5b("0x54a")]) {
            $(_0x4c5b("0x520"))[_0x4c5b("0x54c")]();
          } else {
            $(_0x4c5b("0x520"))["hide"]();
          }
        },
        "setShowTargeting" : function() {
          settings[_0x4c5b("0x54d")] = !settings["showTargeting"];
          this[_0x4c5b("0x54e")]();
        },
        "setTargetingHUD" : function() {
          if (settings[_0x4c5b("0x54d")]) {
            $("#target-hud, #target-panel-hud")["show"]();
          } else {
            $("#target-hud, #target-panel-hud")[_0x4c5b("0x54f")]();
          }
        },
        "setShowTime" : function() {
          settings["showTime"] = !settings[_0x4c5b("0x550")];
          if (settings[_0x4c5b("0x550")]) {
            $("#time-hud")[_0x4c5b("0x54c")]();
            this[_0x4c5b("0x551")]();
          } else {
            $(_0x4c5b("0x552"))[_0x4c5b("0x54f")]();
          }
        },
        "setShowSplitRange" : function() {
          settings[_0x4c5b("0x553")] = !settings[_0x4c5b("0x553")];
          attributes[_0x4c5b("0x553")] = settings[_0x4c5b("0x553")];
        },
        "setShowSplitInd" : function() {
          this["showSplitInd"] = !this["showSplitInd"];
          settings[_0x4c5b("0x553")] = this[_0x4c5b("0x554")];
          settings[_0x4c5b("0x2ed")] = this[_0x4c5b("0x554")];
          attributes[_0x4c5b("0x553")] = settings[_0x4c5b("0x553")];
          attributes["oppRings"] = settings[_0x4c5b("0x2ed")];
        },
        "setShowTeammatesInd" : function() {
          settings[_0x4c5b("0x2f3")] = !settings[_0x4c5b("0x2f3")];
        },
        "setShowOppColors" : function() {
          settings[_0x4c5b("0x2f0")] = !settings[_0x4c5b("0x2f0")];
          attributes[_0x4c5b("0x2f0")] = settings[_0x4c5b("0x2f0")];
        },
        "setShowSkins" : function() {
          this["noSkins"] = !this[_0x4c5b("0x555")];
          if (window[_0x4c5b("0x543")] && window[_0x4c5b("0x543")][_0x4c5b("0x556")]) {
            window[_0x4c5b("0x543")][_0x4c5b("0x556")](!this["noSkins"]);
          }
          attributes[_0x4c5b("0x2ef")] = !this[_0x4c5b("0x555")];
          this[_0x4c5b("0x557")](!this[_0x4c5b("0x555")], _0x4c5b("0x558"));
        },
        "setTransparentSkins" : function() {
          settings[_0x4c5b("0x559")] = !settings[_0x4c5b("0x559")];
          attributes[_0x4c5b("0x559")] = settings[_0x4c5b("0x559")];
        },
        "setShowStats" : function() {
          $(_0x4c5b("0x55a"))[_0x4c5b("0x55b")]();
        },
        "setShowFood" : function() {
          attributes[_0x4c5b("0x55c")] = !attributes[_0x4c5b("0x55c")];
        },
        "setShowHUD" : function() {
          $(_0x4c5b("0x51b"))[_0x4c5b("0x55b")]();
        },
        "setShowGrid" : function() {
          settings[_0x4c5b("0x55d")] = !settings[_0x4c5b("0x55d")];
        },
        "setShowMiniMapGuides" : function() {
          settings[_0x4c5b("0x55e")] = !settings[_0x4c5b("0x55e")];
        },
        "setShowLb" : function() {
          if (_0x4c5b("0x55f") !== this[_0x4c5b("0x560")]) {
            $(_0x4c5b("0x561"))[_0x4c5b("0x55b")]();
          }
        },
        "setShowBgSectors" : function() {
          settings[_0x4c5b("0x562")] = !settings["showBgSectors"];
        },
        "setHideSmallBots" : function() {
          attributes["hideSmallBots"] = !attributes[_0x4c5b("0x2d5")];
          this[_0x4c5b("0x557")](!attributes[_0x4c5b("0x2d5")], _0x4c5b("0x563"));
        },
        "setShowNames" : function() {
          settings[_0x4c5b("0x2f5")] = !settings[_0x4c5b("0x2f5")];
        },
        "setHideTeammatesNames" : function() {
          settings[_0x4c5b("0x2fb")] = !settings[_0x4c5b("0x2fb")];
        },
        "setShowMass" : function() {
          settings[_0x4c5b("0x2e7")] = !settings[_0x4c5b("0x2e7")];
        },
        "setShowMiniMap" : function() {
          settings["showMiniMap"] = !settings[_0x4c5b("0x564")];
          this[_0x4c5b("0x565")]();
        },
        "setMiniMap" : function() {
          if (settings[_0x4c5b("0x564")]) {
            $(_0x4c5b("0x536"))["show"]();
          } else {
            $(_0x4c5b("0x536"))[_0x4c5b("0x54f")]();
          }
        },
        "setShowQuest" : function() {
          if (_0x4c5b("0x53e") === this[_0x4c5b("0x560")]) {
            this[_0x4c5b("0x566")] = !this["showQuest"];
            this[_0x4c5b("0x567")]();
          }
        },
        "setQuest" : function() {
          if (this[_0x4c5b("0x566")] && _0x4c5b("0x53e") === this[_0x4c5b("0x560")]) {
            $(_0x4c5b("0x568"))[_0x4c5b("0x54c")]();
          } else {
            $(_0x4c5b("0x568"))[_0x4c5b("0x54f")]();
          }
        },
        "toggleAutoZoom" : function() {
          attributes[_0x4c5b("0x569")] = !attributes[_0x4c5b("0x569")];
          this["displayChatInfo"](attributes[_0x4c5b("0x569")], _0x4c5b("0x56a"));
        },
        "resetZoom" : function(options) {
          if (options) {
            attributes[_0x4c5b("0x56b")] = 1;
            attributes["zoomValue"] = 1;
          } else {
            attributes[_0x4c5b("0x56b")] = 0;
          }
        },
        "setZoom" : function(value) {
          attributes[_0x4c5b("0x56c")] = value;
        },
        "toggleDeath" : function() {
          this[_0x4c5b("0x56d")]--;
          if (0 > this[_0x4c5b("0x56d")]) {
            this[_0x4c5b("0x56d")] = this[_0x4c5b("0x56e")]["length"] - 1;
          }
        },
        "tryResp" : function() {
          if (attributes[_0x4c5b("0x2de")] || 20 == this[_0x4c5b("0x56f")]) {
            this[_0x4c5b("0x56f")] = 0;
          } else {
            this[_0x4c5b("0x56f")]++;
            var _0x2fcc15 = this;
            setTimeout(function() {
              if ($(_0x4c5b("0x570"))["is"](_0x4c5b("0x571"))) {
                $(_0x4c5b("0x570"))[_0x4c5b("0x4c9")]();
              } else {
                $(_0x4c5b("0x572"))[_0x4c5b("0x4c9")]();
              }
              if (!attributes[_0x4c5b("0x2de")]) {
                _0x2fcc15["tryResp"]();
              }
            }, 500);
          }
        },
        "quickResp" : function() {
          if (settings[_0x4c5b("0x573")]) {
            this[_0x4c5b("0x574")]();
            this[_0x4c5b("0x575")](this["ws"]);
            attributes[_0x4c5b("0x2de")] = false;
            this[_0x4c5b("0x576")]();
          }
        },
        "autoResp" : function() {
          if (settings[_0x4c5b("0x577")]) {
            this[_0x4c5b("0x578")]();
            $(_0x4c5b("0x579"))[_0x4c5b("0x57a")]()["hide"]();
            if ($(_0x4c5b("0x570"))["is"](":visible")) {
              $(_0x4c5b("0x570"))[_0x4c5b("0x4c9")]();
            } else {
              $(_0x4c5b("0x572"))["click"]();
            }
          }
        },
        "setAutoResp" : function() {
          if (settings[_0x4c5b("0x577")]) {
            if (!$(_0x4c5b("0x57b"))[_0x4c5b("0x57c")]("checked")) {
              $(_0x4c5b("0x57b"))[_0x4c5b("0x4c9")]();
              this["skipStats"] = true;
            }
          }
        },
        "toggleAutoResp" : function() {
          settings[_0x4c5b("0x577")] = !settings["autoResp"];
          this["setAutoResp"]();
          this[_0x4c5b("0x557")](settings[_0x4c5b("0x577")], _0x4c5b("0x57d"));
        },
        "copyLb" : function() {
          var _msgSibling = $(_0x4c5b("0x57e"));
          $(_0x4c5b("0x4e2"))[_0x4c5b("0x448")](_msgSibling);
          _msgSibling[_0x4c5b("0x44d")]($(_0x4c5b("0x57f"))["text"]())[_0x4c5b("0x580")]();
          try {
            document[_0x4c5b("0x581")](_0x4c5b("0x1d"));
          } catch (_0x15387c) {
          }
          _msgSibling[_0x4c5b("0x582")]();
        },
        "setPause" : function() {
          this[_0x4c5b("0x1b0")] = !this[_0x4c5b("0x1b0")];
          attributes[_0x4c5b("0x1b0")] = this["pause"];
          if (this[_0x4c5b("0x1b0")]) {
            attributes["resetTargetPosition"]();
            $("#pause-hud")[_0x4c5b("0x54c")]();
          } else {
            $(_0x4c5b("0x583"))[_0x4c5b("0x54f")]();
          }
        },
        "setCenteredLb" : function() {
          if (settings[_0x4c5b("0x584")]) {
            $(_0x4c5b("0x561"))[_0x4c5b("0x4d1")](_0x4c5b("0x585"));
          } else {
            $(_0x4c5b("0x561"))[_0x4c5b("0x4cf")](_0x4c5b("0x585"));
          }
        },
        "setNormalLb" : function() {
          if (settings[_0x4c5b("0x586")]) {
            $(_0x4c5b("0x587"))[_0x4c5b("0x588")](args[_0x4c5b("0x589")]);
          } else {
            $("#leaderboard-hud h4")[_0x4c5b("0x588")](_0x4c5b("0x428"));
          }
        },
        "displayLeaderboard" : function(canCreateDiscussions, rationale = "") {
          if (this["leaderboardPositionsHUD"]) {
            this[_0x4c5b("0x58a")][_0x4c5b("0x58b")] = canCreateDiscussions;
            this["leaderboardDataHUD"][_0x4c5b("0x58b")] = rationale;
          }
        },
        "displayStats" : function() {
          if (settings[_0x4c5b("0x58c")]) {
            var pix_color = "";
            var notifyY = "y";
            if (76 < attributes[_0x4c5b("0x58d")]) {
              attributes[_0x4c5b("0x58e")] = Math["round"](attributes[_0x4c5b("0x58d")] / 4);
            }
            if (307 < attributes[_0x4c5b("0x58d")]) {
              attributes[_0x4c5b("0x58f")] = Math[_0x4c5b("0x2bf")](attributes["playerMass"] / 16);
            }
            if (attributes[_0x4c5b("0x2de")]) {
              if (settings[_0x4c5b("0x590")] && attributes["playerMass"]) {
                pix_color = pix_color + (args[_0x4c5b("0x291")] + ": " + attributes[_0x4c5b("0x58d")] + _0x4c5b("0x591"));
              }
              if (attributes[_0x4c5b("0x592")]) {
                pix_color = pix_color + (args[_0x4c5b("0x593")] + ": " + attributes[_0x4c5b("0x592")]);
              }
              if (settings[_0x4c5b("0x594")] && attributes["xFour"]) {
                pix_color = pix_color + (_0x4c5b("0x595") + attributes[_0x4c5b("0x58e")]);
              }
              if (settings[_0x4c5b("0x594")] && attributes[_0x4c5b("0x58f")]) {
                pix_color = pix_color + (_0x4c5b("0x596") + attributes[_0x4c5b("0x58f")]);
              }
              if (settings[_0x4c5b("0x597")] && attributes[_0x4c5b("0x598")]) {
                pix_color = pix_color + (_0x4c5b("0x599") + attributes[_0x4c5b("0x598")]);
              }
              if (settings[_0x4c5b("0x59a")] && attributes[_0x4c5b("0x59b")]) {
                pix_color = pix_color + (_0x4c5b("0x591") + attributes[_0x4c5b("0x59b")] + _0x4c5b("0x59c"));
              }
              if (settings[_0x4c5b("0x59d")]) {
                pix_color = pix_color + _0x4c5b("0x591");
              }
            }
            if (settings[_0x4c5b("0x59d")]) {
              pix_color = pix_color + this[_0x4c5b("0x59e")];
            }
            notifyY = _0x4c5b("0x59f") + methods[_0x4c5b("0x5a0")];
            this[_0x4c5b("0x5a1")][_0x4c5b("0x5a2")] = notifyY;
            this[_0x4c5b("0x5a3")][_0x4c5b("0x5a2")] = pix_color;
            var _0x12cdc4 = this;
            setTimeout(function() {
              _0x12cdc4[_0x4c5b("0x5a4")]();
            }, 250);
          } else {
            $(_0x4c5b("0x55a"))[_0x4c5b("0x54f")]();
          }
        },
        "displayTime" : function() {
          if (settings["showTime"]) {
            var _0x17e064 = (new Date)["toLocaleString"]();
            this["timeHUD"][_0x4c5b("0x5a2")] = _0x17e064;
            var _0x4ec2e4 = this;
            setTimeout(function() {
              _0x4ec2e4["displayTime"]();
            }, 1E3);
          } else {
            $(_0x4c5b("0x552"))[_0x4c5b("0x54f")]();
          }
        },
        "displayParties" : function() {
          var value = "";
          var indexLookupKey = 0;
          for (; indexLookupKey < this[_0x4c5b("0x5a5")]["length"]; indexLookupKey++) {
            value = value + (_0x4c5b("0x5a6") + this[_0x4c5b("0x5a5")][indexLookupKey] + _0x4c5b("0x5a7") + this[_0x4c5b("0x5a5")][indexLookupKey] + _0x4c5b("0x5a8") + this[_0x4c5b("0x5a5")][indexLookupKey] + "</a></li>");
          }
          this[_0x4c5b("0x5a9")][_0x4c5b("0x5aa")] = "" == value ? _0x4c5b("0x5ab") : "";
          this[_0x4c5b("0x5a9")][_0x4c5b("0x58b")] = value;
        },
        "displayTop5" : function() {
          if (settings[_0x4c5b("0x54a")]) {
            var pix_color = "";
            var bufferString = 0;
            var PL$29 = this[_0x4c5b("0x5ac")]["length"];
            var entityType = 0;
            for (; entityType < PL$29; entityType++) {
              bufferString = bufferString + this[_0x4c5b("0x5ac")][entityType][_0x4c5b("0x291")];
              if (!(entityType >= settings[_0x4c5b("0x5ad")])) {
                pix_color = pix_color + (_0x4c5b("0x5ae") + this[_0x4c5b("0x5ac")][entityType]["color"] + _0x4c5b("0x5af") + (this[_0x4c5b("0x5ac")][entityType]["skin"] ? this[_0x4c5b("0x5ac")][entityType][_0x4c5b("0x2a7")] : _0x4c5b("0x5b0")) + '" alt=""> ' + this["escapeHTML"](this[_0x4c5b("0x5ac")][entityType][_0x4c5b("0x28e")]) + _0x4c5b("0x5b1") + this[_0x4c5b("0x5b2")](this["top5"][entityType]["x"], this[_0x4c5b("0x5ac")][entityType]["y"]) + '</span><span id= "top5mass" class=""> ' + 
                this[_0x4c5b("0x5b3")](this[_0x4c5b("0x5ac")][entityType]["mass"]) + _0x4c5b("0x5b4"));
              }
            }
            this[_0x4c5b("0x5b5")][_0x4c5b("0x58b")] = pix_color;
            if (attributes[_0x4c5b("0x2de")] && attributes[_0x4c5b("0x58d")]) {
              bufferString = bufferString + attributes[_0x4c5b("0x58d")];
              PL$29++;
            }
            this["top5totalMass"][_0x4c5b("0x5a2")] = this[_0x4c5b("0x5b3")](bufferString);
            this[_0x4c5b("0x5b6")][_0x4c5b("0x5a2")] = PL$29;
          }
        },
        "setTop5limit" : function(canCreateDiscussions) {
          if (canCreateDiscussions) {
            this[_0x4c5b("0x5b7")] = canCreateDiscussions;
          }
        },
        "displayChatHistory" : function(canCreateDiscussions) {
          if (canCreateDiscussions) {
            this["clearChatHistory"](true);
            var i = 0;
            for (; i < this["chatHistory"]["length"]; i++) {
              $("#messages")[_0x4c5b("0x448")](_0x4c5b("0x5b8") + this[_0x4c5b("0x5b9")][i][_0x4c5b("0x28e")] + _0x4c5b("0x5ba") + this[_0x4c5b("0x5b9")][i]["message"] + _0x4c5b("0x5b4"));
            }
          } else {
            this[_0x4c5b("0x5bb")](false);
          }
        },
        "clearChatHistory" : function(canCreateDiscussions) {
          $(_0x4c5b("0x5bc"))[_0x4c5b("0x5bd")]();
          if (canCreateDiscussions) {
            toastr[_0x4c5b("0x1ee")]();
            if (settings["showChatBox"]) {
              $(_0x4c5b("0x5be"))[_0x4c5b("0x582")]();
              this[_0x4c5b("0x5b9")]["length"] = 0;
            }
          }
        },
        "displayChatInfo" : function(charLoc, name) {
          if (charLoc) {
            toastr[_0x4c5b("0x5bf")](args[name + "A"]);
          } else {
            toastr[_0x4c5b("0x47")](args[name + "B"]);
          }
        },
        "setDisableChat" : function() {
          settings[_0x4c5b("0x5c0")] = settings[_0x4c5b("0x5c1")];
          this[_0x4c5b("0x5c2")]();
        },
        "hideChat" : function() {
          settings[_0x4c5b("0x5c0")] = !settings[_0x4c5b("0x5c0")];
          this["setHideChat"]();
          this[_0x4c5b("0x557")](!settings["hideChat"], _0x4c5b("0x5c3"));
        },
        "setHideChat" : function() {
          if (settings[_0x4c5b("0x5c0")]) {
            $(_0x4c5b("0x52c"))[_0x4c5b("0x54f")]();
          }
          this[_0x4c5b("0x5c4")]();
        },
        "setShowChatBox" : function() {
          if (!settings[_0x4c5b("0x5c0")] && settings["showChatBox"]) {
            $(_0x4c5b("0x52d"))[_0x4c5b("0x54c")]();
          } else {
            $(_0x4c5b("0x52d"))["hide"]();
          }
        },
        "enterChatMessage" : function() {
          var p = $(_0x4c5b("0x52c"));
          var $el = $(_0x4c5b("0x5c5"));
          if (p["is"](_0x4c5b("0x571"))) {
            var artistTrack = $el["val"]();
            if (artistTrack["length"]) {
              this[_0x4c5b("0x5c6")](101, artistTrack);
              if (attributes[_0x4c5b("0x2de")]) {
                $el[_0x4c5b("0x5c7")]();
                p[_0x4c5b("0x54f")]();
              }
            } else {
              $el["blur"]();
              p["hide"]();
            }
            $el[_0x4c5b("0x44d")]("");
          } else {
            p[_0x4c5b("0x54c")]();
            $el[_0x4c5b("0x5c8")]();
            $el["val"]("");
          }
        },
        "showMenu" : function() {
          $("#overlays")[_0x4c5b("0x5c9")](250);
        },
        "hideMenu" : function() {
          $(_0x4c5b("0x579"))[_0x4c5b("0x5ca")](250);
        },
        "escapeHTML" : function(s) {
          return (s + "")["replace"](/[&<>"'\/]/g, function(s) {
            return entityMap[s];
          });
        },
        "loadSettings" : function() {
          var parsedHash = null;
          var attribute;
          for (attribute in null !== window[_0x4c5b("0x206")][_0x4c5b("0x441")](_0x4c5b("0x5cb")) && (parsedHash = JSON[_0x4c5b("0x443")](window["localStorage"][_0x4c5b("0x441")]("ogarioSettings"))), settings) {
            if (settings["hasOwnProperty"](attribute)) {
              if (parsedHash && parsedHash[_0x4c5b("0x3fe")](attribute)) {
                settings[attribute] = parsedHash[attribute];
              }
              if (attributes[_0x4c5b("0x3fe")](attribute)) {
                attributes[attribute] = settings[attribute];
              }
            }
          }
        },
        "saveSettings" : function(data, callback) {
          window[_0x4c5b("0x206")][_0x4c5b("0x5cc")](callback, JSON[_0x4c5b("0x213")](data));
        },
        "exportSettings" : function() {
          var message = {
            "ogarioCommands" : target,
            "ogarioHotkeys" : result,
            "ogarioPlayerProfiles" : res,
            "ogarioSettings" : settings,
            "ogarioThemeSettings" : data
          };
          var clientId;
          for (clientId in message) {
            if (message[_0x4c5b("0x3fe")](clientId)) {
              if (!$(_0x4c5b("0x5cd") + clientId)[_0x4c5b("0x57c")](_0x4c5b("0x5ce"))) {
                delete message[clientId];
              }
            }
          }
          message = JSON["stringify"](message);
          $(_0x4c5b("0x5cf"))[_0x4c5b("0x44d")](message);
          $(_0x4c5b("0x5d0"))[_0x4c5b("0x44d")]("");
          message = null;
        },
        "importSettings" : function() {
          $("#import-settings")[_0x4c5b("0x5c7")]();
          var props = $(_0x4c5b("0x5d0"))[_0x4c5b("0x44d")]();
          if (props) {
            var prop;
            for (prop in props = JSON[_0x4c5b("0x443")](props)) {
              if (props[_0x4c5b("0x3fe")](prop)) {
                if (!$(_0x4c5b("0x5d1") + prop)[_0x4c5b("0x57c")](_0x4c5b("0x5ce"))) {
                  continue;
                }
                window[_0x4c5b("0x206")][_0x4c5b("0x5cc")](prop, JSON[_0x4c5b("0x213")](props[prop]));
              }
            }
            window[_0x4c5b("0x5d2")][_0x4c5b("0x445")]();
          }
        },
        "restoreSettings" : function() {
          if (null !== window[_0x4c5b("0x206")][_0x4c5b("0x441")](_0x4c5b("0x5cb"))) {
            window[_0x4c5b("0x206")][_0x4c5b("0x444")](_0x4c5b("0x5cb"));
            window[_0x4c5b("0x5d2")][_0x4c5b("0x445")]();
          }
        },
        "setSettings" : function(key, value) {
          if (settings[_0x4c5b("0x3fe")](key) && null !== value) {
            switch(settings[key] = value, attributes[_0x4c5b("0x3fe")](key) && (attributes[key] = value), key) {
              case "autoResp":
                this[_0x4c5b("0x578")]();
                break;
              case _0x4c5b("0x564"):
                this[_0x4c5b("0x565")]();
                break;
              case _0x4c5b("0x5d3"):
                this[_0x4c5b("0x533")]();
                break;
              case _0x4c5b("0x5c1"):
                this["setDisableChat"]();
                break;
              case _0x4c5b("0x5d4"):
                this[_0x4c5b("0x5d5")]();
                break;
              case _0x4c5b("0x5d6"):
                this["setShowChatBox"]();
                break;
              case _0x4c5b("0x54a"):
                this["setTop5"]();
                break;
              case "showTargeting":
                this["setTargetingHUD"]();
                break;
              case _0x4c5b("0x550"):
                this["displayTime"]();
                $(_0x4c5b("0x552"))[_0x4c5b("0x54c")]();
                break;
              case _0x4c5b("0x584"):
                this[_0x4c5b("0x5d7")]();
                break;
              case "normalLb":
                this[_0x4c5b("0x5d8")]();
                break;
              case _0x4c5b("0x58c"):
                this[_0x4c5b("0x5a4")]();
                $(_0x4c5b("0x55a"))[_0x4c5b("0x54c")]();
            }
            this[_0x4c5b("0x5d9")](settings, "ogarioSettings");
          }
        },
        "loadProfiles" : function() {
          if (null !== window[_0x4c5b("0x206")][_0x4c5b("0x441")]("ogarioPlayerProfiles")) {
            res = JSON[_0x4c5b("0x443")](window[_0x4c5b("0x206")][_0x4c5b("0x441")](_0x4c5b("0x5da")));
          } else {
            var _0x2fcc15 = 0;
            for (; 10 > _0x2fcc15; _0x2fcc15++) {
              res[_0x4c5b("0x7")]({
                "nick" : _0x4c5b("0x5db") + (_0x2fcc15 + 1),
                "clanTag" : "",
                "skinURL" : "",
                "color" : data[_0x4c5b("0x5dc")]
              });
            }
          }
          if (null !== window[_0x4c5b("0x206")][_0x4c5b("0x441")]("ogarioSelectedProfile")) {
            this["selectedProfile"] = JSON[_0x4c5b("0x443")](window[_0x4c5b("0x206")][_0x4c5b("0x441")](_0x4c5b("0x5dd")));
          }
          names[_0x4c5b("0x28e")] = res[this[_0x4c5b("0x5de")]][_0x4c5b("0x28e")];
          names[_0x4c5b("0x5df")] = res[this["selectedProfile"]][_0x4c5b("0x5df")];
          names["skinURL"] = res[this[_0x4c5b("0x5de")]]["skinURL"];
          names["color"] = res[this[_0x4c5b("0x5de")]]["color"];
        },
        "changeSkinPreview" : function(room, nick) {
          if (room && nick) {
            if (_0x4c5b("0x5e0") === nick) {
              $(_0x4c5b("0x5e1"))[_0x4c5b("0x4cf")](_0x4c5b("0x5e2"))[_0x4c5b("0x448")](_0x4c5b("0x5e3"));
              $(_0x4c5b("0x5e4"))[_0x4c5b("0x448")]($(room)[_0x4c5b("0x5c9")](1E3));
              $(_0x4c5b("0x5e4"))["popover"]();
            } else {
              $("#" + nick)[_0x4c5b("0x4cf")](_0x4c5b("0x5e2"))[_0x4c5b("0x448")]($(room)[_0x4c5b("0x5c9")](1E3));
            }
          }
        },
        "setSkinPreview" : function(url, selected) {
          var isTheOne = _0x4c5b("0x5e0") == selected;
          if ($("#" + selected + _0x4c5b("0x5e5"))[_0x4c5b("0x5e6")]("src") !== url) {
            if ($("#" + selected)["empty"]()[_0x4c5b("0x4d1")](_0x4c5b("0x5e2")), url) {
              var CustomTests = this;
              var element = new Image;
              element[_0x4c5b("0x5e7")] = _0x4c5b("0x5e8");
              element[_0x4c5b("0x5e9")] = function() {
                CustomTests[_0x4c5b("0x5ea")](element, selected);
                if (isTheOne) {
                  $(_0x4c5b("0x5eb"))[_0x4c5b("0x5ec")](_0x4c5b("0x54f"));
                }
              };
              element[_0x4c5b("0x1a7")] = function() {
                if (isTheOne) {
                  _0x4c5b("0x5ed");
                  $(_0x4c5b("0x5eb"))["attr"](_0x4c5b("0x5ee"), _0x4c5b("0x5ef"));
                  $(_0x4c5b("0x5eb"))[_0x4c5b("0x5ec")](_0x4c5b("0x54c"));
                  $("#skin")[_0x4c5b("0x5c8")]();
                }
              };
              element["src"] = url;
            } else {
              if (isTheOne) {
                $(_0x4c5b("0x5eb"))["popover"](_0x4c5b("0x54f"));
              }
            }
          }
        },
        "setProfile" : function() {
          var LAT = (res["length"] + this[_0x4c5b("0x5de")] - 1) % res["length"];
          var chosen_prime = (this[_0x4c5b("0x5de")] + 1) % res["length"];
          this["setSkinPreview"](res[LAT][_0x4c5b("0x5f0")], _0x4c5b("0x5f1"));
          this[_0x4c5b("0x5f2")](res[this[_0x4c5b("0x5de")]][_0x4c5b("0x5f0")], _0x4c5b("0x5e0"));
          this[_0x4c5b("0x5f2")](res[chosen_prime]["skinURL"], _0x4c5b("0x5f3"));
          this[_0x4c5b("0x5d9")](this[_0x4c5b("0x5de")], _0x4c5b("0x5dd"));
          $("#nick")[_0x4c5b("0x44d")](res[this["selectedProfile"]][_0x4c5b("0x28e")]);
          $(_0x4c5b("0x5f4"))[_0x4c5b("0x44d")](res[this[_0x4c5b("0x5de")]][_0x4c5b("0x5df")]);
          $(_0x4c5b("0x5eb"))[_0x4c5b("0x44d")](res[this["selectedProfile"]][_0x4c5b("0x5f0")]);
          $(_0x4c5b("0x4dc"))["val"](res[this["selectedProfile"]]["color"]);
          $(_0x4c5b("0x4db"))[_0x4c5b("0x452")](_0x4c5b("0x4de"), res[this["selectedProfile"]]["color"]);
          $(".skin-wheel-bg a")[_0x4c5b("0x4cf")](_0x4c5b("0x5f5"));
          $(".skin-wheel-bg a[data-profile=" + this["selectedProfile"] + "]")[_0x4c5b("0x4d1")](_0x4c5b("0x5f5"));
        },
        "prevProfile" : function() {
          this[_0x4c5b("0x5f6")]();
          this[_0x4c5b("0x5de")] = (res["length"] + this[_0x4c5b("0x5de")] - 1) % res["length"];
          this["setProfile"]();
        },
        "nextProfile" : function() {
          this[_0x4c5b("0x5f6")]();
          this[_0x4c5b("0x5de")] = (this[_0x4c5b("0x5de")] + 1) % res["length"];
          this[_0x4c5b("0x5f7")]();
        },
        "selectProfile" : function(value) {
          this[_0x4c5b("0x5f6")]();
          this[_0x4c5b("0x5de")] = parseInt(value);
          this[_0x4c5b("0x5f7")]();
        },
        "addOption" : function(combo, index, array, value) {
          $(combo)[_0x4c5b("0x448")]('<label><input type="checkbox" id="' + index + _0x4c5b("0x5f8") + array + _0x4c5b("0x5f9"));
          $("#" + index)["prop"](_0x4c5b("0x5ce"), value);
        },
        "addOptions" : function(properties, element) {
          if (properties) {
            $(_0x4c5b("0x5fa"))[_0x4c5b("0x448")](_0x4c5b("0x5fb") + element + _0x4c5b("0x5fc") + args[element] + "</h5></div>");
            var name = 0;
            var prop;
            for (; name < properties["length"]; name++) {
              prop = properties[name];
              if (settings[_0x4c5b("0x3fe")](prop)) {
                $("." + element)[_0x4c5b("0x448")](_0x4c5b("0x5fd") + args[prop] + _0x4c5b("0x5fe") + prop + '"></label>');
                $("#" + prop)[_0x4c5b("0x57c")](_0x4c5b("0x5ce"), settings[prop]);
              }
            }
          }
        },
        "addInputBox" : function(location, key, service, action) {
          $(location)["append"](_0x4c5b("0x463") + args[key] + '</span><input id="' + key + _0x4c5b("0x464") + service + '" value="' + settings[key] + _0x4c5b("0x465"));
          var checkString = this;
          $("#" + key)["on"]("input", function() {
            settings[key] = this[_0x4c5b("0x226")];
            checkString[action]();
            checkString[_0x4c5b("0x5d9")](settings, _0x4c5b("0x5cb"));
          });
        },
        "addSliderBox" : function(preventPushState, id, valueOrMethod, options, targets, action) {
          $(preventPushState)[_0x4c5b("0x448")](_0x4c5b("0x459") + args[id] + _0x4c5b("0x45a") + id + '-value" class="value">' + settings[id] + _0x4c5b("0x45b") + id + '-slider" type="range" min="' + valueOrMethod + _0x4c5b("0x45d") + options + _0x4c5b("0x5ff") + targets + _0x4c5b("0x45e") + settings[id] + _0x4c5b("0x45f"));
          var checkString = this;
          if (action) {
            $("#" + id + _0x4c5b("0x462"))["on"](_0x4c5b("0x460"), function() {
              var value = parseFloat($(this)[_0x4c5b("0x44d")]());
              $("#" + id + "-value")[_0x4c5b("0x1ff")](value);
              settings[id] = value;
              if (attributes[_0x4c5b("0x3fe")](id)) {
                attributes[id] = value;
              }
              checkString[action]();
              checkString["saveSettings"](settings, _0x4c5b("0x5cb"));
            });
          } else {
            $("#" + id + _0x4c5b("0x462"))["on"]("input", function() {
              var value = parseFloat($(this)[_0x4c5b("0x44d")]());
              $("#" + id + _0x4c5b("0x461"))[_0x4c5b("0x1ff")](value);
              settings[id] = value;
              if (attributes[_0x4c5b("0x3fe")](id)) {
                attributes[id] = value;
              }
              checkString[_0x4c5b("0x5d9")](settings, _0x4c5b("0x5cb"));
            });
          }
        },
        "setLang" : function() {
          if ("pl" === action && window[_0x4c5b("0x600")] && window[_0x4c5b("0x600")]["en"]) {
            var key;
            for (key in window["i18n_dict"]["en"]) {
              if (window[_0x4c5b("0x600")]["en"][_0x4c5b("0x3fe")](key) && args[_0x4c5b("0x3fe")](key)) {
                window[_0x4c5b("0x600")]["en"][key] = args[key];
              }
            }
          }
        },
        "setMenu" : function() {
          var key;
          for (key in document[_0x4c5b("0x155")] = this[_0x4c5b("0x217")], this[_0x4c5b("0x601")]([_0x4c5b("0x2b4")], _0x4c5b("0x602")), this["addOptions"]([_0x4c5b("0x603"), _0x4c5b("0x604")], _0x4c5b("0x605")), this[_0x4c5b("0x601")]([_0x4c5b("0x569")], _0x4c5b("0x606")), this["addOptions"]([_0x4c5b("0x573"), _0x4c5b("0x577")], _0x4c5b("0x607")), this[_0x4c5b("0x601")]([_0x4c5b("0x2f5"), _0x4c5b("0x2a2"), _0x4c5b("0x2f9"), _0x4c5b("0x2fa"), _0x4c5b("0x2fb"), _0x4c5b("0x2c7")], _0x4c5b("0x608")), 
          this[_0x4c5b("0x601")](["showMass", _0x4c5b("0x2e8"), _0x4c5b("0x2a3"), _0x4c5b("0x2f7"), _0x4c5b("0x609"), _0x4c5b("0x2fc"), "shortMass", _0x4c5b("0x29f"), _0x4c5b("0x2c8")], _0x4c5b("0x60a")), this[_0x4c5b("0x601")]([_0x4c5b("0x2ee"), _0x4c5b("0x547")], "skinsGroup"), this["addOptions"](["optimizedFood", _0x4c5b("0x60b"), _0x4c5b("0x60c"), _0x4c5b("0x60d")], "foodGroup"), this[_0x4c5b("0x601")]([_0x4c5b("0x2ec"), _0x4c5b("0x2f1"), "transparentSkins", _0x4c5b("0x2eb"), _0x4c5b("0x2db")], 
          _0x4c5b("0x60e")), this[_0x4c5b("0x601")]([_0x4c5b("0x55d"), _0x4c5b("0x562"), _0x4c5b("0x60f")], _0x4c5b("0x610")), this[_0x4c5b("0x601")]([_0x4c5b("0x5c1"), _0x4c5b("0x5d4"), _0x4c5b("0x611"), _0x4c5b("0x612"), _0x4c5b("0x613"), _0x4c5b("0x5d6")], "chatGroup"), this[_0x4c5b("0x601")]([_0x4c5b("0x564"), _0x4c5b("0x5d3"), "showMiniMapGuides", _0x4c5b("0x614"), "oneColoredTeammates"], _0x4c5b("0x615")), this[_0x4c5b("0x601")]([_0x4c5b("0x2f0"), _0x4c5b("0x2ed"), _0x4c5b("0x2dd"), _0x4c5b("0x553"), 
          _0x4c5b("0x2af"), _0x4c5b("0x616"), _0x4c5b("0x2f3"), _0x4c5b("0x617")], _0x4c5b("0x618")), this[_0x4c5b("0x601")]([_0x4c5b("0x619"), _0x4c5b("0x61a"), "mouseInvert"], _0x4c5b("0x61b")), this[_0x4c5b("0x601")]([_0x4c5b("0x54a"), _0x4c5b("0x54d"), _0x4c5b("0x61c"), _0x4c5b("0x584"), _0x4c5b("0x586")], _0x4c5b("0x61d")), this[_0x4c5b("0x601")](["showStats", _0x4c5b("0x590"), _0x4c5b("0x597"), _0x4c5b("0x594"), _0x4c5b("0x59a"), "showStatsFPS", _0x4c5b("0x550")], "statsGroup"), $(_0x4c5b("0x61e"))["appendTo"]($(_0x4c5b("0x61f")))[_0x4c5b("0x4d1")](_0x4c5b("0x620")), 
          this[_0x4c5b("0x48b")](_0x4c5b("0x621"), _0x4c5b("0x2b8"), 70, 225, 1), this[_0x4c5b("0x48b")](_0x4c5b("0x621"), "cameraSpeed", 1, 25, 1), this[_0x4c5b("0x48b")](_0x4c5b("0x622"), _0x4c5b("0x623"), 25, 1E3, 5), this["addSliderBox"](_0x4c5b("0x624"), _0x4c5b("0x625"), .75, .99, .01), this[_0x4c5b("0x48b")](_0x4c5b("0x626"), _0x4c5b("0x627"), 10, 30, 1), this[_0x4c5b("0x48b")](_0x4c5b("0x626"), _0x4c5b("0x5ad"), 5, 30, 1), $(_0x4c5b("0x628"))[_0x4c5b("0x448")](_0x4c5b("0x629") + args[_0x4c5b("0x62a")] + 
          _0x4c5b("0x4d4")), $(_0x4c5b("0x628"))[_0x4c5b("0x448")](_0x4c5b("0x62b") + args[_0x4c5b("0x62c")] + _0x4c5b("0x4d9")), this[_0x4c5b("0x498")](_0x4c5b("0x62d"), _0x4c5b("0x62e"), _0x4c5b("0x62f"), "setMessageSound"), this[_0x4c5b("0x498")](_0x4c5b("0x62d"), _0x4c5b("0x630"), _0x4c5b("0x62f"), "setCommandSound"), obj) {
            if (obj[_0x4c5b("0x3fe")](key)) {
              $("#chat-emoticons")[_0x4c5b("0x448")](_0x4c5b("0x631") + obj[key] + _0x4c5b("0x632") + key + _0x4c5b("0x633"));
            }
          }
          $(_0x4c5b("0x4e2"))[_0x4c5b("0x448")]('<div id="exp-imp"><div id="exp-imp-menu"><button id="close-exp-imp" class="btn btn-danger">' + args[_0x4c5b("0x198")] + _0x4c5b("0x634"));
          $(_0x4c5b("0x635"))[_0x4c5b("0x448")](_0x4c5b("0x636") + args[_0x4c5b("0x637")] + "</h1><h2>" + args[_0x4c5b("0x638")] + _0x4c5b("0x639"));
          this[_0x4c5b("0x63a")](_0x4c5b("0x635"), _0x4c5b("0x63b"), args["commands"], true);
          this[_0x4c5b("0x63a")](_0x4c5b("0x635"), "export-ogarioHotkeys", args[_0x4c5b("0x63c")], true);
          this[_0x4c5b("0x63a")]("#exp-imp-settings", _0x4c5b("0x63d"), args[_0x4c5b("0x63e")], true);
          this[_0x4c5b("0x63a")](_0x4c5b("0x635"), "export-ogarioSettings", args[_0x4c5b("0x63f")], true);
          this[_0x4c5b("0x63a")]("#exp-imp-settings", "export-ogarioThemeSettings", args["theme"], true);
          $(_0x4c5b("0x635"))["append"](_0x4c5b("0x640") + args[_0x4c5b("0x637")] + _0x4c5b("0x4d4"));
          $(_0x4c5b("0x635"))[_0x4c5b("0x448")](_0x4c5b("0x636") + args[_0x4c5b("0x641")] + "</h1><h2>" + args[_0x4c5b("0x642")] + "</h2>");
          this[_0x4c5b("0x63a")](_0x4c5b("0x635"), "import-ogarioCommands", args[_0x4c5b("0x643")], true);
          this[_0x4c5b("0x63a")]("#exp-imp-settings", "import-ogarioHotkeys", args[_0x4c5b("0x63c")], true);
          this["addOption"](_0x4c5b("0x635"), _0x4c5b("0x644"), args[_0x4c5b("0x63e")], true);
          this[_0x4c5b("0x63a")](_0x4c5b("0x635"), _0x4c5b("0x645"), args[_0x4c5b("0x63f")], true);
          this[_0x4c5b("0x63a")](_0x4c5b("0x635"), _0x4c5b("0x646"), args[_0x4c5b("0x647")], true);
          $(_0x4c5b("0x635"))["append"]('<textarea id="import-settings" class="form-control" rows="14" cols="100" spellcheck="false" /><button id="import-settings-btn" class="btn btn-block btn-success">' + args[_0x4c5b("0x641")] + _0x4c5b("0x4d4"));
          if (_0x1ed7f4) {
            _0x1ed7f4[_0x4c5b("0x648")]();
          }
          var id = 0;
          for (; id < res["length"]; id++) {
            $(_0x4c5b("0x649"))[_0x4c5b("0x448")](_0x4c5b("0x64a") + id + '"><a href="#profile-' + id + _0x4c5b("0x64b") + id + _0x4c5b("0x64c") + id + _0x4c5b("0x64d"));
            this[_0x4c5b("0x5f2")](res[id]["skinURL"], _0x4c5b("0x64e") + id);
            if (id == this[_0x4c5b("0x5de")]) {
              $("#profile-" + id)[_0x4c5b("0x4d1")](_0x4c5b("0x5f5"));
            }
          }
        },
        "setUI" : function() {
          var filters = this;
          $(document)["on"](_0x4c5b("0x4c9"), _0x4c5b("0x64f"), function(canCreateDiscussions) {
            canCreateDiscussions[_0x4c5b("0x4da")]();
            filters[_0x4c5b("0x650")]($(this), _0x4c5b("0x651"));
          });
          $(document)["on"]("click", _0x4c5b("0x652"), function(result) {
            result["preventDefault"]();
            filters[_0x4c5b("0x650")]($(this), _0x4c5b("0x653"));
          });
          $(document)["on"](_0x4c5b("0x4c9"), _0x4c5b("0x654"), function(canCreateDiscussions) {
            canCreateDiscussions[_0x4c5b("0x4da")]();
            settings[_0x4c5b("0x655")] = !settings[_0x4c5b("0x655")];
            filters[_0x4c5b("0x5d9")](settings, _0x4c5b("0x5cb"));
            filters[_0x4c5b("0x656")]();
          });
          $(document)["on"](_0x4c5b("0x4c9"), _0x4c5b("0x657"), function(canCreateDiscussions) {
            canCreateDiscussions[_0x4c5b("0x4da")]();
            settings["showSkinsPanel"] = !settings[_0x4c5b("0x658")];
            filters[_0x4c5b("0x5d9")](settings, _0x4c5b("0x5cb"));
            filters[_0x4c5b("0x659")]();
          });
          $(document)["on"]("change", "#regions", function() {
            filters[_0x4c5b("0x65a")] = this["value"];
          });
          $(document)["on"](_0x4c5b("0x470"), _0x4c5b("0x65b"), function() {
            var diamond_wide_long = this[_0x4c5b("0x226")];
            if (":party" !== diamond_wide_long) {
              filters["leaveParty"]();
            }
            filters[_0x4c5b("0x560")] = attributes[_0x4c5b("0x560")] = diamond_wide_long;
            filters[_0x4c5b("0x567")]();
          });
          $(document)["on"](_0x4c5b("0x470"), _0x4c5b("0x65c"), function() {
            filters[_0x4c5b("0x65d")](this[_0x4c5b("0x226")]);
            _setPosition();
          });
          $(_0x4c5b("0x5eb"))[_0x4c5b("0x5ec")]({
            "html" : true,
            "placement" : _0x4c5b("0x65e"),
            "trigger" : _0x4c5b("0x65f"),
            "animation" : false
          });
          $(document)["on"]("input click", "#skin", function() {
            var query = this[_0x4c5b("0x226")];
            filters[_0x4c5b("0x5f2")](query, _0x4c5b("0x5e0"));
            filters[_0x4c5b("0x5f2")](query, _0x4c5b("0x64e") + filters["selectedProfile"]);
          });
          $(document)["on"](_0x4c5b("0x4c9"), _0x4c5b("0x660"), function(result) {
            result["preventDefault"]();
            $(_0x4c5b("0x5eb"))[_0x4c5b("0x44d")](this["href"])[_0x4c5b("0x4c9")]();
          });
          $(document)["on"]("click", _0x4c5b("0x579"), function() {
            if (!($(_0x4c5b("0x661"))["length"] || $(_0x4c5b("0x662"))["length"])) {
              $(_0x4c5b("0x5eb"))[_0x4c5b("0x5ec")](_0x4c5b("0x54f"));
            }
          });
          $(document)["on"](_0x4c5b("0x4c9"), ".skin-wheel-bg a", function(canCreateDiscussions) {
            canCreateDiscussions[_0x4c5b("0x4da")]();
            filters[_0x4c5b("0x663")]($(this)[_0x4c5b("0x5e6")](_0x4c5b("0x664")));
          });
          $(document)["on"]("click", _0x4c5b("0x665"), function() {
            filters[_0x4c5b("0x666")]();
          });
          $(document)["on"](_0x4c5b("0x4c9"), _0x4c5b("0x667"), function() {
            filters[_0x4c5b("0x668")]();
          });
          $(document)["on"]("click", _0x4c5b("0x669"), function() {
            settings[_0x4c5b("0x66a")] = !settings[_0x4c5b("0x66a")];
            filters[_0x4c5b("0x5d9")](settings, _0x4c5b("0x5cb"));
            filters[_0x4c5b("0x66b")]();
          });
          $(document)["on"](_0x4c5b("0x4c9"), _0x4c5b("0x66c"), function() {
            settings[_0x4c5b("0x66d")] = !settings[_0x4c5b("0x66d")];
            filters[_0x4c5b("0x5d9")](settings, _0x4c5b("0x5cb"));
            filters[_0x4c5b("0x66e")]();
          });
          $(document)["on"]("click", _0x4c5b("0x66f"), function() {
            $(_0x4c5b("0x670"))[_0x4c5b("0x55b")]();
          });
          $(document)["on"](_0x4c5b("0x4c9"), _0x4c5b("0x671"), function() {
            filters[_0x4c5b("0x575")]($(_0x4c5b("0x672"))[_0x4c5b("0x44d")]());
          });
          $(document)["on"](_0x4c5b("0x4c9"), _0x4c5b("0x673"), function() {
            filters[_0x4c5b("0x674")]();
          });
          $(document)["on"](_0x4c5b("0x4c9"), _0x4c5b("0x675"), function() {
            filters[_0x4c5b("0x676")]($(_0x4c5b("0x677"))[_0x4c5b("0x44d")]());
          });
          $(document)["on"](_0x4c5b("0x470"), _0x4c5b("0x678"), function() {
            var doc = $(this);
            filters[_0x4c5b("0x679")](doc[_0x4c5b("0x5e6")]("id"), doc[_0x4c5b("0x57c")](_0x4c5b("0x5ce")));
          });
          $(document)["on"](_0x4c5b("0x470"), _0x4c5b("0x67a"), function() {
            var actions = $(this);
            var vpcId = actions["attr"]("id");
            if (void 0 !== filters[vpcId]) {
              filters[vpcId] = actions[_0x4c5b("0x57c")](_0x4c5b("0x5ce"));
              if (_0x4c5b("0x555") === vpcId) {
                attributes[_0x4c5b("0x2ef")] = !filters[_0x4c5b("0x555")];
              }
              if ("showQuest" === vpcId) {
                filters[_0x4c5b("0x567")]();
              }
            }
          });
          $(document)["on"](_0x4c5b("0x4c9"), _0x4c5b("0x67b"), function(canCreateDiscussions) {
            canCreateDiscussions[_0x4c5b("0x4da")]();
            filters["restoreSettings"]();
          });
          $(document)["on"](_0x4c5b("0x4c9"), "#og-settings .btn-export", function(canCreateDiscussions) {
            canCreateDiscussions[_0x4c5b("0x4da")]();
            filters[_0x4c5b("0x637")]();
            $(_0x4c5b("0x67c"))[_0x4c5b("0x5c9")](500);
            $(_0x4c5b("0x67d"))[_0x4c5b("0x67e")](_0x4c5b("0x14f"));
          });
          $(document)["on"](_0x4c5b("0x4c9"), "#close-exp-imp", function(canCreateDiscussions) {
            canCreateDiscussions[_0x4c5b("0x4da")]();
            $(_0x4c5b("0x67c"))[_0x4c5b("0x5ca")](500);
          });
          $(document)["on"](_0x4c5b("0x5c8"), _0x4c5b("0x5cf"), function() {
            $(this)[_0x4c5b("0x580")]();
          });
          $(document)["on"]("click", _0x4c5b("0x67f"), function(canCreateDiscussions) {
            canCreateDiscussions[_0x4c5b("0x4da")]();
            filters[_0x4c5b("0x637")]();
          });
          $(document)["on"](_0x4c5b("0x4c9"), _0x4c5b("0x680"), function(canCreateDiscussions) {
            canCreateDiscussions[_0x4c5b("0x4da")]();
            filters[_0x4c5b("0x641")]();
          });
          $(document)["on"]("click", _0x4c5b("0x681"), function(canCreateDiscussions) {
            canCreateDiscussions[_0x4c5b("0x4da")]();
            filters[_0x4c5b("0x682")]();
          });
          $(document)["on"](_0x4c5b("0x4c9"), _0x4c5b("0x683"), function() {
            if (settings[_0x4c5b("0x684")]) {
              filters["blockPopups"]();
            }
          });
          $(document)["on"](_0x4c5b("0x4c9"), _0x4c5b("0x685"), function() {
            if (settings["blockPopups"]) {
              var _obj = $(this);
              setTimeout(function() {
                if (!_obj["is"](_0x4c5b("0x571"))) {
                  filters["blockPopups"]();
                }
              }, 1E3);
            }
          });
          $(document)["on"](_0x4c5b("0x4c9"), _0x4c5b("0x686"), function(canCreateDiscussions) {
            canCreateDiscussions[_0x4c5b("0x4da")]();
            filters[_0x4c5b("0x682")]();
            if (window["MC"] && window["MC"][_0x4c5b("0x687")]) {
              window["MC"][_0x4c5b("0x687")]();
            }
          });
          $(document)["on"](_0x4c5b("0x4c9"), _0x4c5b("0x688"), function(canCreateDiscussions) {
            canCreateDiscussions[_0x4c5b("0x4da")]();
            filters[_0x4c5b("0x682")]();
            if (window["MC"] && window["MC"][_0x4c5b("0x689")]) {
              window["MC"][_0x4c5b("0x689")]();
            }
          });
          $(document)["on"](_0x4c5b("0x4c9"), _0x4c5b("0x68a"), function(canCreateDiscussions) {
            canCreateDiscussions[_0x4c5b("0x4da")]();
            filters[_0x4c5b("0x682")]();
            if (window["MC"] && window["MC"][_0x4c5b("0x68b")]) {
              window["MC"][_0x4c5b("0x68b")]();
            }
          });
          $(document)["on"](_0x4c5b("0x4c9"), _0x4c5b("0x68c"), function(result) {
            result["preventDefault"]();
            filters[_0x4c5b("0x682")]();
            if (window["MC"] && window["MC"]["showQuests"]) {
              window["MC"][_0x4c5b("0x68d")]();
            }
          });
          $(document)["on"](_0x4c5b("0x4c9"), "#set-targeting", function(canCreateDiscussions) {
            canCreateDiscussions[_0x4c5b("0x4da")]();
            filters[_0x4c5b("0x68e")]();
          });
          $(document)["on"](_0x4c5b("0x4c9"), "#cancel-targeting", function(canCreateDiscussions) {
            canCreateDiscussions[_0x4c5b("0x4da")]();
            filters["cancelTargeting"]();
          });
          $(document)["on"](_0x4c5b("0x4c9"), _0x4c5b("0x68f"), function(canCreateDiscussions) {
            canCreateDiscussions[_0x4c5b("0x4da")]();
            filters[_0x4c5b("0x690")]();
          });
          $(document)["on"](_0x4c5b("0x4c9"), _0x4c5b("0x691"), function(canCreateDiscussions) {
            canCreateDiscussions[_0x4c5b("0x4da")]();
            filters[_0x4c5b("0x692")]();
          });
          $(document)["on"](_0x4c5b("0x4c9"), _0x4c5b("0x693"), function(canCreateDiscussions) {
            canCreateDiscussions[_0x4c5b("0x4da")]();
            var $realtime = $(this);
            var ds = parseInt($realtime[_0x4c5b("0x5e6")](_0x4c5b("0x694")));
            if (ds) {
              filters["setTop5limit"](ds);
              filters[_0x4c5b("0x695")]();
              $(".team-top")[_0x4c5b("0x1ff")](ds);
              $(_0x4c5b("0x693"))[_0x4c5b("0x4cf")](_0x4c5b("0x4d0"));
              $realtime[_0x4c5b("0x4d1")](_0x4c5b("0x4d0"));
            }
          });
          $(document)["on"](_0x4c5b("0x4c9"), _0x4c5b("0x696"), function(canCreateDiscussions) {
            canCreateDiscussions[_0x4c5b("0x4da")]();
            filters["setTarget"](parseInt($(this)[_0x4c5b("0x5e6")](_0x4c5b("0x697"))));
          });
          $(document)["on"](_0x4c5b("0x4c9"), _0x4c5b("0x698"), function(canCreateDiscussions) {
            canCreateDiscussions[_0x4c5b("0x4da")]();
            filters["muteChatUser"](parseInt($(this)["attr"](_0x4c5b("0x697"))));
          });
          $(document)["on"](_0x4c5b("0x4c9"), _0x4c5b("0x699"), function() {
            var rotateMsg = $(this);
            filters[_0x4c5b("0x69a")](parseInt(rotateMsg[_0x4c5b("0x5e6")](_0x4c5b("0x697"))));
            rotateMsg["removeClass"](_0x4c5b("0x69b"))[_0x4c5b("0x4d1")](_0x4c5b("0x69c"))[_0x4c5b("0x1ff")](args[_0x4c5b("0x69d")]);
          });
          $(document)["on"](_0x4c5b("0x4c9"), _0x4c5b("0x69e"), function() {
            var $node = $(this);
            filters[_0x4c5b("0x69f")](parseInt($node["attr"](_0x4c5b("0x697"))));
            $node["removeClass"](_0x4c5b("0x69c"))["addClass"](_0x4c5b("0x69b"))[_0x4c5b("0x1ff")](args[_0x4c5b("0x6a0")]);
          });
          $(document)["on"](_0x4c5b("0x4c9"), _0x4c5b("0x6a1"), function(canCreateDiscussions) {
            canCreateDiscussions[_0x4c5b("0x4da")]();
            settings[_0x4c5b("0x5d4")] = !settings[_0x4c5b("0x5d4")];
            filters[_0x4c5b("0x5d9")](settings, _0x4c5b("0x5cb"));
            filters[_0x4c5b("0x5d5")]();
          });
          $(document)["on"]("click", _0x4c5b("0x6a2"), function(canCreateDiscussions) {
            canCreateDiscussions[_0x4c5b("0x4da")]();
            filters[_0x4c5b("0x6a3")]();
          });
          $(document)["on"](_0x4c5b("0x4c9"), _0x4c5b("0x6a4"), function(canCreateDiscussions) {
            canCreateDiscussions[_0x4c5b("0x4da")]();
            filters[_0x4c5b("0x6a5")]();
          });
          $(document)["on"]("click", _0x4c5b("0x6a6"), function(canCreateDiscussions) {
            canCreateDiscussions[_0x4c5b("0x4da")]();
            var rotateMsg = $(this);
            var p = $(_0x4c5b("0x6a7"));
            p["toggle"]();
            if (p["is"](_0x4c5b("0x571"))) {
              rotateMsg["addClass"]("active");
            } else {
              rotateMsg[_0x4c5b("0x4cf")](_0x4c5b("0x4d0"));
              $(_0x4c5b("0x5c5"))[_0x4c5b("0x5c8")]();
            }
          });
          $(document)["on"](_0x4c5b("0x4c9"), _0x4c5b("0x6a8"), function() {
            var topOffset = $(this)["attr"]("alt");
            var scrollable = $(_0x4c5b("0x5c5"));
            var pos = scrollable[_0x4c5b("0x44d")]();
            if (80 >= pos["length"] + topOffset["length"]) {
              scrollable[_0x4c5b("0x44d")](pos + topOffset);
            }
            scrollable[_0x4c5b("0x5c8")]();
          });
          this["statsHUD"] = document["getElementById"](_0x4c5b("0x6a9"));
          this[_0x4c5b("0x5a1")] = document["getElementById"](_0x4c5b("0x6ab"));
          this[_0x4c5b("0x5a9")] = document["getElementById"](_0x4c5b("0x6ac"));
          this["top5pos"] = document["getElementById"](_0x4c5b("0x6ad"));
          this[_0x4c5b("0x6ae")] = document["getElementById"]("top5-total-mass");
          this[_0x4c5b("0x5b6")] = document["getElementById"](_0x4c5b("0x6af"));
          this["leaderboardPositionsHUD"] = document["getElementById"](_0x4c5b("0x6b0"));
          this[_0x4c5b("0x6b1")] = document["getElementById"](_0x4c5b("0x6b2"));
          this[_0x4c5b("0x6b3")] = document["getElementById"](_0x4c5b("0x6b4"));
          this[_0x4c5b("0x6b5")] = document["getElementById"]("quest-hud");
          $(_0x4c5b("0x6b6"))[_0x4c5b("0x1b3")](_0x4c5b("0x6b7"), function() {
            return false;
          });
          $(document)["on"](_0x4c5b("0x6b8"), ".btn", function() {
            $(this)[_0x4c5b("0x5c7")]();
          });
          $(_0x4c5b("0x6b9"))[_0x4c5b("0x6ba")]({
            "trigger" : "hover"
          });
          $(_0x4c5b("0x6bb"))[_0x4c5b("0x67e")]({
            "suppressScrollX" : true
          });
          Array[_0x4c5b("0x10")][_0x4c5b("0x1b")][_0x4c5b("0x4")](document["querySelectorAll"](_0x4c5b("0x6bc")))[_0x4c5b("0x12e")](function(remove) {
            new Switchery(remove, {
              "color" : data["menuMainColorX"],
              "size" : _0x4c5b("0x6bd")
            });
          });
          $(_0x4c5b("0x6be"))[_0x4c5b("0x6bf")]({
            "polyfill" : false
          });
          toastr["options"] = {
            "newestOnTop" : false,
            "positionClass" : "toast-bottom-left",
            "timeOut" : 15E3
          };
        },
        "switchMenuTabs" : function(formatters, customFormatters) {
          var _0x2fcc15 = formatters[_0x4c5b("0x6c0")]();
          if (_0x4c5b("0x651") === customFormatters) {
            if (formatters[_0x4c5b("0x6c1")]("hotkeys-link")) {
              return;
            }
            _0x2fcc15[_0x4c5b("0x6c1")](_0x4c5b("0x6c2"));
          }
          formatters[_0x4c5b("0x4d1")](_0x4c5b("0x4d0"));
          _0x2fcc15[_0x4c5b("0x4d1")](_0x4c5b("0x4d0"));
          _0x2fcc15[_0x4c5b("0x6c3")]()[_0x4c5b("0x4cf")](_0x4c5b("0x4d0"));
          _0x2fcc15[_0x4c5b("0x6c3")]()[_0x4c5b("0x6c4")]("a")[_0x4c5b("0x4cf")](_0x4c5b("0x4d0"));
          var delete_behavior_form = formatters[_0x4c5b("0x5e6")](_0x4c5b("0x6c5"));
          if (_0x4c5b("0x653") === customFormatters) {
            var eVideoId = $(delete_behavior_form)["parent"]()["attr"]("id");
            $("#" + eVideoId + _0x4c5b("0x6c6"))[_0x4c5b("0xb7")](delete_behavior_form)[_0x4c5b("0x304")](_0x4c5b("0x6c7"), _0x4c5b("0x4e8"));
          } else {
            $(_0x4c5b("0x6c8"))[_0x4c5b("0xb7")](delete_behavior_form)[_0x4c5b("0x304")](_0x4c5b("0x6c7"), _0x4c5b("0x4e8"));
          }
          $(delete_behavior_form)[_0x4c5b("0x5c9")](1E3);
          _setPosition();
          $(_0x4c5b("0x6c9"))[_0x4c5b("0x67e")](_0x4c5b("0x14f"));
        },
        "getDefaultSettings" : function() {
          if (this[_0x4c5b("0x555")] = $(_0x4c5b("0x6ca"))["prop"]("checked"), this[_0x4c5b("0x6cb")] = $(_0x4c5b("0x6cc"))["prop"](_0x4c5b("0x5ce")), this[_0x4c5b("0x6cd")] = $(_0x4c5b("0x57b"))["prop"](_0x4c5b("0x5ce")), this[_0x4c5b("0x566")] = $(_0x4c5b("0x6ce"))[_0x4c5b("0x57c")](_0x4c5b("0x5ce")), attributes["showCustomSkins"] = !this[_0x4c5b("0x555")], null !== window["localStorage"][_0x4c5b("0x441")](_0x4c5b("0x6cf"))) {
            var artistTrack = JSON[_0x4c5b("0x443")](window[_0x4c5b("0x206")][_0x4c5b("0x441")](_0x4c5b("0x6cf")));
            this[_0x4c5b("0x6d0")](artistTrack);
          } else {
            var artistTrack = $(_0x4c5b("0x65c"))[_0x4c5b("0x44d")]();
            this[_0x4c5b("0x65d")](artistTrack);
          }
          if (null === window[_0x4c5b("0x206")][_0x4c5b("0x441")](_0x4c5b("0x5d2"))) {
            this[_0x4c5b("0x65a")] = $(_0x4c5b("0x6d1"))[_0x4c5b("0x44d")]();
          } else {
            this["region"] = window[_0x4c5b("0x206")][_0x4c5b("0x441")]("location");
            $(_0x4c5b("0x6d1"))["val"](this[_0x4c5b("0x65a")]);
            if (window["MC"] && window["MC"][_0x4c5b("0x6d2")]) {
              window["MC"][_0x4c5b("0x6d2")](this["region"]);
            }
          }
          this[_0x4c5b("0x6d3")]();
          if (_0x4c5b("0x6d4") === this[_0x4c5b("0x560")] && window[_0x4c5b("0x5d2")][_0x4c5b("0x6d5")]) {
            $(_0x4c5b("0x6d6"))[_0x4c5b("0x4c9")]();
          }
          Array[_0x4c5b("0x10")][_0x4c5b("0x1b")][_0x4c5b("0x4")](document[_0x4c5b("0x6d7")](_0x4c5b("0x67a")))[_0x4c5b("0x12e")](function(remove) {
            new Switchery(remove, {
              "color" : data["menuMainColorX"],
              "size" : "small"
            });
          });
          $(_0x4c5b("0x6d8"))["val"](names[_0x4c5b("0x28e")])["blur"]();
          $("#noNames")[_0x4c5b("0x57c")]("checked", !settings[_0x4c5b("0x2f5")]);
          $(_0x4c5b("0x6d9"))[_0x4c5b("0x57c")](_0x4c5b("0x5ce"), settings["showMass"]);
          this[_0x4c5b("0x6da")]();
          this[_0x4c5b("0x578")]();
          this[_0x4c5b("0x567")]();
        },
        "getQuality" : function(object) {
          var _replaceHelper = 1;
          switch(_0x4c5b("0x6db") in window && (_replaceHelper = window[_0x4c5b("0x6db")]), object) {
            case "High":
              this["setCanvasScale"](1);
              break;
            case _0x4c5b("0x6dc"):
              this[_0x4c5b("0x6d0")](.9);
              break;
            case "Low":
              this[_0x4c5b("0x6d0")](.75);
              break;
            case "VeryLow":
              this[_0x4c5b("0x6d0")](.5);
              break;
            default:
              this[_0x4c5b("0x6d0")](_replaceHelper);
          }
        },
        "setCanvasScale" : function(pictureUrl) {
          this[_0x4c5b("0x6dd")] = pictureUrl;
          attributes[_0x4c5b("0x6dd")] = pictureUrl;
        },
        "setStreamMode" : function() {
          if (settings[_0x4c5b("0x66a")]) {
            $(_0x4c5b("0x669"))["addClass"](_0x4c5b("0x6de"));
            $(_0x4c5b("0x6df"))["addClass"](_0x4c5b("0x6e0"));
          } else {
            $(_0x4c5b("0x669"))[_0x4c5b("0x4cf")]("ogicon-eye-blocked");
            $(_0x4c5b("0x6e1"))[_0x4c5b("0x4cf")](_0x4c5b("0x6e0"));
          }
        },
        "setHideSkinUrl" : function() {
          if (settings["hideSkinUrl"]) {
            $(_0x4c5b("0x66c"))[_0x4c5b("0x4d1")](_0x4c5b("0x6de"));
            $(_0x4c5b("0x5eb"))[_0x4c5b("0x4d1")](_0x4c5b("0x6e2"));
          } else {
            $("#hide-url")[_0x4c5b("0x4cf")](_0x4c5b("0x6de"));
            $("#skin")[_0x4c5b("0x4cf")](_0x4c5b("0x6e2"));
          }
        },
        "setShowQuickMenu" : function() {
          if (settings[_0x4c5b("0x655")]) {
            $(_0x4c5b("0x6e3"))["fadeIn"](500);
          } else {
            $(_0x4c5b("0x6e3"))[_0x4c5b("0x5ca")](500);
          }
        },
        "setShowSkinsPanel" : function() {
          if (settings[_0x4c5b("0x658")]) {
            $(_0x4c5b("0x6e4"))["fadeIn"](500);
          } else {
            $(_0x4c5b("0x6e4"))[_0x4c5b("0x5ca")](500);
          }
        },
        "unlockButtons" : function() {
          $(".btn-play, .btn-play-guest, .btn-login-play, .btn-spectate")[_0x4c5b("0x57c")](_0x4c5b("0x6e5"), false);
        },
        "setMainButtons" : function() {
          var _0x2fcc15 = this;
          $(document)["on"](_0x4c5b("0x4c9"), _0x4c5b("0x6e6"), function() {
            _0x2fcc15[_0x4c5b("0x6e7")]();
          });
          $(document)["on"](_0x4c5b("0x4c9"), _0x4c5b("0x6e8"), function() {
            _0x2fcc15[_0x4c5b("0x6e9")]();
          });
          $(document)["on"](_0x4c5b("0x4c9"), "#create-party-btn-2", function() {
            _0x2fcc15["onCreate"]();
          });
          $(document)["on"](_0x4c5b("0x4c9"), _0x4c5b("0x6d6"), function() {
            _0x2fcc15["skipServerData"] = true;
            _0x2fcc15[_0x4c5b("0x6ea")]();
            _0x2fcc15["onJoin"]();
          });
          $(document)["on"]("click", _0x4c5b("0x6eb"), function() {
            $(_0x4c5b("0x6ec"))["toggle"]();
          });
        },
        "play" : function() {
          if (this["setPlayerSettings"](), this[_0x4c5b("0x6d3")](), this[_0x4c5b("0x6ed")]()) {
            this[_0x4c5b("0x6ee")]();
          } else {
            this[_0x4c5b("0x6ef")]();
            var _0x2fcc15 = this;
            setTimeout(function() {
              _0x2fcc15[_0x4c5b("0x6ee")]();
            }, 1E3);
          }
        },
        "onPlay" : function() {
          this["play"]();
          this["hideMenu"]();
          if (window["addKeyListeners"]) {
            window[_0x4c5b("0x6f0")]();
          }
          if (settings[_0x4c5b("0x60b")]) {
            attributes[_0x4c5b("0x55c")] = true;
          }
          if (window["ga"]) {
            window["ga"](_0x4c5b("0xdb"), "UA-67142685-2", _0x4c5b("0x6f1"), "ogarioTracker");
          }
          if (window["ga"]) {
            window["ga"](_0x4c5b("0x6f2"), _0x4c5b("0x6f3"));
          }
        },
        "onSpectate" : function() {
          this[_0x4c5b("0x6f4")]();
          this[_0x4c5b("0x6f5")]();
          this[_0x4c5b("0x574")]();
          if (window[_0x4c5b("0x6f0")]) {
            window[_0x4c5b("0x6f0")]();
          }
          if (settings[_0x4c5b("0x60b")]) {
            attributes["showFood"] = false;
          }
        },
        "join" : function() {
          this[_0x4c5b("0x6d3")]();
          this[_0x4c5b("0x5f6")]();
          this[_0x4c5b("0x6ee")]();
          this[_0x4c5b("0x6f6")]();
        },
        "onJoin" : function() {
          if (this[_0x4c5b("0x6d3")](), this[_0x4c5b("0x6ed")]()) {
            this[_0x4c5b("0xc")]();
          } else {
            this[_0x4c5b("0x6ef")]();
            var _0x2fcc15 = this;
            setTimeout(function() {
              _0x2fcc15[_0x4c5b("0xc")]();
              _0x2fcc15[_0x4c5b("0x6f5")]();
            }, 1E3);
          }
        },
        "create" : function() {
          if (this["setParty"](), this[_0x4c5b("0x6f7")]) {
            this[_0x4c5b("0x6f4")]();
          } else {
            var _0x2fcc15 = this;
            setTimeout(function() {
              _0x2fcc15[_0x4c5b("0xdb")]();
            }, 100);
          }
        },
        "onCreate" : function() {
          this[_0x4c5b("0x6d3")]();
          if (_0x4c5b("0x6d4") === this["gameMode"] && this[_0x4c5b("0x6f7")]) {
            this["gameServerReconnect"]();
          } else {
            this[_0x4c5b("0x6f8")]();
          }
          this[_0x4c5b("0xdb")]();
        },
        "onPlayerSpawn" : function() {
          if (attributes[_0x4c5b("0x2de")] = true, attributes[_0x4c5b("0x6f9")]) {
            return this[_0x4c5b("0x6fa")](), void this[_0x4c5b("0x6fb")](names[_0x4c5b("0x28e")], attributes[_0x4c5b("0x6f9")], names[_0x4c5b("0x5f0")]);
          }
          var _0x2fcc15 = this;
          setTimeout(function() {
            _0x2fcc15["onPlayerSpawn"]();
          }, 100);
          setTimeout(function() {
            attributes["spawnX"] = attributes[_0x4c5b("0x541")];
            attributes["spawnY"] = attributes["playerY"];
            attrs["drawCommander"] = true;
          }, settings[_0x4c5b("0x623")]);
        },
        "onPlayerDeath" : function() {
          attributes[_0x4c5b("0x2de")] = false;
          attributes[_0x4c5b("0x6f9")] = null;
          attributes[_0x4c5b("0x6fd")] = false;
          attributes[_0x4c5b("0x58d")] = 0;
          attributes["playerScore"] = 0;
          attributes[_0x4c5b("0x58e")] = 0;
          attributes["xSixTeen"] = 0;
          attributes[_0x4c5b("0x59b")] = 0;
          this["showMenu"](300);
          this[_0x4c5b("0x6f6")]();
          this["updateDeathLocations"](attributes["playerX"], attributes[_0x4c5b("0x542")]);
          this[_0x4c5b("0x6da")]();
          gotoNewOfflinePage();
          this[_0x4c5b("0x577")]();
        },
        "setPlayerSettings" : function() {
          var user = $(_0x4c5b("0x6d8"))["val"]();
          var B528 = $(_0x4c5b("0x5f4"))["val"]();
          var _0x2fcc15 = $(_0x4c5b("0x5eb"))["val"]();
          var a = $("#color")[_0x4c5b("0x44d")]();
          names["nick"] = user;
          names["clanTag"] = B528["trim"]();
          names[_0x4c5b("0x5f0")] = _0x2fcc15[_0x4c5b("0x3d")]();
          if (7 == a["length"]) {
            names["color"] = a;
          }
          if (0 < names[_0x4c5b("0x5df")]["length"]) {
            attributes[_0x4c5b("0x5df")] = names["clanTag"];
          }
          res[this["selectedProfile"]][_0x4c5b("0x28e")] = names[_0x4c5b("0x28e")];
          res[this[_0x4c5b("0x5de")]][_0x4c5b("0x5df")] = names["clanTag"];
          res[this[_0x4c5b("0x5de")]][_0x4c5b("0x5f0")] = names[_0x4c5b("0x5f0")];
          res[this[_0x4c5b("0x5de")]]["color"] = names["color"];
          this[_0x4c5b("0x5d9")](res, _0x4c5b("0x5da"));
        },
        "loadSkin" : function(entry, url) {
          var PL$39 = this;
          entry[url] = new Image;
          entry[url][_0x4c5b("0x5e7")] = _0x4c5b("0x5e8");
          entry[url][_0x4c5b("0x5e9")] = function() {
            if (this["complete"] && this["width"] && this["height"] && 2E3 >= this["width"] && 2E3 >= this["height"]) {
              PL$39["cacheQueue"]["push"](url);
              if (1 == PL$39[_0x4c5b("0x6fe")]["length"]) {
                PL$39[_0x4c5b("0x6ff")](PL$39[_0x4c5b("0x700")]);
              }
            }
          };
          entry[url]["src"] = url;
        },
        "cacheSkin" : function() {
          if (0 != this[_0x4c5b("0x6fe")]["length"]) {
            var i = this[_0x4c5b("0x6fe")][_0x4c5b("0x18e")]();
            if (i) {
              var canvas = document["createElement"]("canvas");
              canvas["width"] = 512;
              canvas["height"] = 512;
              var umecob = canvas["getContext"]("2d");
              umecob["beginPath"]();
              umecob["arc"](256, 256, 256, 0, 2 * Math["PI"], false);
              umecob[_0x4c5b("0x701")]();
              umecob["drawImage"](this[_0x4c5b("0x700")][i], 0, 0, 512, 512);
              this[_0x4c5b("0x700")][i + _0x4c5b("0x702")] = new Image;
              this[_0x4c5b("0x700")][i + _0x4c5b("0x702")]["src"] = canvas[_0x4c5b("0x703")]();
              canvas = null;
              this[_0x4c5b("0x6ff")](this["customSkinsCache"]);
            }
          }
        },
        "getCachedSkin" : function(newTextBuffer, newTextOffset) {
          return newTextBuffer[newTextOffset + _0x4c5b("0x702")] && newTextBuffer[newTextOffset + _0x4c5b("0x702")][_0x4c5b("0x704")] && newTextBuffer[newTextOffset + "_cached"]["width"] ? newTextBuffer[newTextOffset + _0x4c5b("0x702")] : null;
        },
        "cacheCustomSkin" : function(value, _, val) {
          if (val) {
            var id = _0x4c5b("0x6d4") === this[_0x4c5b("0x560")] ? value + _ : value;
            if (id && (this["customSkinsMap"][id] = val), this[_0x4c5b("0x700")][_0x4c5b("0x3fe")](val)) {
              return;
            }
            this[_0x4c5b("0x705")](this[_0x4c5b("0x700")], val);
          }
        },
        "checkSkinsMap" : function(key, eventPath) {
          var parent = _0x4c5b("0x6d4") === this[_0x4c5b("0x560")] ? key + eventPath : key;
          return !!this[_0x4c5b("0x706")][_0x4c5b("0x3fe")](parent);
        },
        "getCustomSkin" : function(mmCoreSplitViewBlock, $state) {
          if (!this[_0x4c5b("0x2f4")](mmCoreSplitViewBlock, $state)) {
            return null;
          }
          var expectedSiteKey = _0x4c5b("0x6d4") === this[_0x4c5b("0x560")] ? mmCoreSplitViewBlock + $state : mmCoreSplitViewBlock;
          return this[_0x4c5b("0x707")](this[_0x4c5b("0x700")], this["customSkinsMap"][expectedSiteKey]);
        },
        "calculateMapSector" : function(isSlidingUp, $cont, closeExpr = false) {
          if (!attributes["mapOffsetFixed"]) {
            return "";
          }
          var closingExpr = closeExpr ? attributes["mapOffsetX"] + attributes[_0x4c5b("0x708")] : attributes[_0x4c5b("0x708")];
          var easyprivacy = closeExpr ? attributes["mapOffsetY"] + attributes[_0x4c5b("0x708")] : attributes[_0x4c5b("0x708")];
          var okfunc = Math["floor"](($cont + easyprivacy) / (attributes[_0x4c5b("0x709")] / data[_0x4c5b("0x70a")]));
          var val = Math[_0x4c5b("0xd8")]((isSlidingUp + closingExpr) / (attributes[_0x4c5b("0x709")] / data["sectorsX"]));
          return okfunc = 0 > okfunc ? 0 : okfunc >= data["sectorsY"] ? data["sectorsY"] - 1 : okfunc, val = 0 > val ? 0 : val >= data[_0x4c5b("0x70b")] ? data[_0x4c5b("0x70b")] - 1 : val, String[_0x4c5b("0x35")](okfunc + 65) + (val + 1);
        },
        "shortMassFormat" : function(width) {
          return 1E3 > width ? width : Math[_0x4c5b("0x2bf")](width / 100) / 10 + "k";
        },
        "updateDeathLocations" : function(params, key) {
          if (attributes[_0x4c5b("0x70c")]) {
            this[_0x4c5b("0x56e")][_0x4c5b("0x7")]({
              "x" : params + attributes["mapOffsetX"],
              "y" : key + attributes[_0x4c5b("0x70d")]
            });
            if (6 == this[_0x4c5b("0x56e")]["length"]) {
              this["deathLocations"]["shift"]();
            }
            this[_0x4c5b("0x56d")] = this[_0x4c5b("0x56e")]["length"] - 1;
          }
        },
        "drawMiniMap" : function() {
          if (attributes[_0x4c5b("0x70c")]) {
            var time = data[_0x4c5b("0x534")];
            var label = data[_0x4c5b("0x535")];
            var lastTime = time + label;
            var max = time;
            var _propName = label;
            if (this["miniMap"]) {
              this[_0x4c5b("0x70e")][_0x4c5b("0x70f")](0, 0, time, lastTime);
            } else {
              this[_0x4c5b("0x710")] = document["getElementById"](_0x4c5b("0x711"));
              this["miniMapCtx"] = this[_0x4c5b("0x710")]["getContext"]("2d");
              this["miniMap"]["width"] = time;
              this["miniMap"]["height"] = lastTime;
            }
            if (this[_0x4c5b("0x710")]["width"] != time) {
              this[_0x4c5b("0x710")]["width"] = time;
              this[_0x4c5b("0x710")]["height"] = lastTime;
            }
            var ratio = max / attributes["mapSize"];
            var px = attributes[_0x4c5b("0x712")] + attributes["mapOffset"];
            var height = attributes[_0x4c5b("0x70d")] + attributes[_0x4c5b("0x708")];
            if (this["currentSector"] = this[_0x4c5b("0x5b2")](attributes[_0x4c5b("0x541")], attributes[_0x4c5b("0x542")], true), this[_0x4c5b("0x70e")]["globalAlpha"] = 1, this[_0x4c5b("0x70e")]["font"] = data[_0x4c5b("0x713")] + _0x4c5b("0x714") + data[_0x4c5b("0x715")], this[_0x4c5b("0x70e")]["fillStyle"] = data[_0x4c5b("0x4b3")], this[_0x4c5b("0x716")] || this[_0x4c5b("0x717")](data[_0x4c5b("0x70b")], data[_0x4c5b("0x70a")], max, lastTime, _propName), this[_0x4c5b("0x70e")]["save"](), 
            this[_0x4c5b("0x70e")]["translate"](10, _propName), ":battleroyale" === this[_0x4c5b("0x560")] && methods && methods[_0x4c5b("0x719")](this[_0x4c5b("0x70e")], max, max, ratio, px, height), settings["showMiniMapGhostCells"]) {
              var PL$13 = attributes[_0x4c5b("0x71a")];
              this[_0x4c5b("0x70e")]["beginPath"]();
              var PL$17 = 0;
              for (; PL$17 < PL$13["length"]; PL$17++) {
                if (!PL$13[PL$17][_0x4c5b("0x71b")]) {
                  var x0 = ~~((PL$13[PL$17]["x"] + px) * ratio - 10);
                  var x1 = ~~((PL$13[PL$17]["y"] + height) * ratio);
                  this[_0x4c5b("0x70e")]["moveTo"](x0 - 9.5, x1);
                  this[_0x4c5b("0x70e")]["arc"](x0, x1, ~~(PL$13[PL$17]["size"] * ratio), 0, this["pi2"], false);
                }
              }
              this[_0x4c5b("0x70e")]["fillStyle"] = data[_0x4c5b("0x71c")];
              this[_0x4c5b("0x70e")]["globalAlpha"] = data[_0x4c5b("0x4c3")];
              this[_0x4c5b("0x70e")][_0x4c5b("0x4e")]();
              this[_0x4c5b("0x70e")]["globalAlpha"] = 1;
            }
            if (settings[_0x4c5b("0x55e")] && (x0 = Math[_0x4c5b("0x2bf")]((attributes["playerX"] + px) * ratio - 10), x1 = Math[_0x4c5b("0x2bf")]((attributes[_0x4c5b("0x542")] + height) * ratio), this[_0x4c5b("0x70e")]["lineWidth"] = 1, this[_0x4c5b("0x70e")]["strokeStyle"] = data[_0x4c5b("0x4b9")], this[_0x4c5b("0x70e")]["beginPath"](), this["miniMapCtx"][_0x4c5b("0x71d")](x0, 0), this[_0x4c5b("0x70e")][_0x4c5b("0x71e")](x0, max), this[_0x4c5b("0x70e")][_0x4c5b("0x71d")](-9.5, x1), 
            this[_0x4c5b("0x70e")][_0x4c5b("0x71e")](max, x1), this[_0x4c5b("0x70e")]["stroke"]()), this["miniMapCtx"]["beginPath"](), this[_0x4c5b("0x70e")]["arc"]((attributes[_0x4c5b("0x541")] + px) * ratio - 10, (attributes[_0x4c5b("0x542")] + height) * ratio, data[_0x4c5b("0x4c1")], 0, this["pi2"], false), this[_0x4c5b("0x70e")][_0x4c5b("0x2da")](), 0 < data[_0x4c5b("0x4c2")] && (this[_0x4c5b("0x70e")]["lineWidth"] = data[_0x4c5b("0x4c2")], this[_0x4c5b("0x70e")]["strokeStyle"] = 
            data[_0x4c5b("0x4b6")], this[_0x4c5b("0x70e")]["stroke"]()), this[_0x4c5b("0x70e")]["fillStyle"] = data[_0x4c5b("0x4b5")], this[_0x4c5b("0x70e")][_0x4c5b("0x4e")](), this[_0x4c5b("0x71f")]["length"]) {
              PL$17 = 0;
              for (; PL$17 < this[_0x4c5b("0x71f")]["length"]; PL$17++) {
                this[_0x4c5b("0x71f")][PL$17][_0x4c5b("0x720")](this[_0x4c5b("0x70e")], attributes[_0x4c5b("0x708")], ratio, this[_0x4c5b("0x721")], this[_0x4c5b("0x722")]);
              }
            }
            if (0 < this[_0x4c5b("0x56e")]["length"]) {
              x0 = Math[_0x4c5b("0x2bf")]((this[_0x4c5b("0x56e")][this["lastDeath"]]["x"] + attributes[_0x4c5b("0x708")]) * ratio - 10);
              x1 = Math[_0x4c5b("0x2bf")]((this[_0x4c5b("0x56e")][this[_0x4c5b("0x56d")]]["y"] + attributes["mapOffset"]) * ratio);
              var x2 = Math[_0x4c5b("0x2c3")](data[_0x4c5b("0x4c1")] - 2, 4);
              this[_0x4c5b("0x70e")]["lineWidth"] = 1;
              this[_0x4c5b("0x70e")]["strokeStyle"] = this[_0x4c5b("0x56e")]["length"] - 1 == this[_0x4c5b("0x56d")] ? data[_0x4c5b("0x4b8")] : _0x4c5b("0x25b");
              this[_0x4c5b("0x70e")]["beginPath"]();
              this[_0x4c5b("0x70e")][_0x4c5b("0x71d")](x0 - x2, x1);
              this["miniMapCtx"][_0x4c5b("0x71e")](x0 + x2, x1);
              this["miniMapCtx"][_0x4c5b("0x71d")](x0, x1 - x2);
              this["miniMapCtx"][_0x4c5b("0x71e")](x0, x1 + x2);
              this[_0x4c5b("0x70e")]["stroke"]();
            }
            this[_0x4c5b("0x70e")]["restore"]();
          }
        },
        "drawMiniMapSectors" : function(mmCoreSplitViewBlock, $state, breadcrumbs, OSDConfigService, RequestTrackingService) {
          this[_0x4c5b("0x716")] = document["getElementById"](_0x4c5b("0x723"));
          var options = this[_0x4c5b("0x716")]["getContext"]("2d");
          this[_0x4c5b("0x716")]["width"] = breadcrumbs;
          this[_0x4c5b("0x716")]["height"] = OSDConfigService;
          options["fillStyle"] = _0x4c5b("0x25b");
          this[_0x4c5b("0x724")](options, breadcrumbs);
          methods[_0x4c5b("0x725")](options, attributes[_0x4c5b("0x70c")], mmCoreSplitViewBlock, $state, 0, RequestTrackingService, breadcrumbs, OSDConfigService, data["miniMapSectorsColor"], data[_0x4c5b("0x726")], 0, false);
        },
        "resetMiniMapSectors" : function() {
          this[_0x4c5b("0x716")] = null;
        },
        "dTok" : function(canCreateDiscussions) {
          canCreateDiscussions["font"] = data[_0x4c5b("0x713")] + " " + data[_0x4c5b("0x715")];
        },
        "drawTeammatesInd" : function(boardManager, isSlidingUp, $cont, $slides) {
          if (this[_0x4c5b("0x727")]) {
            boardManager["drawImage"](this[_0x4c5b("0x727")], isSlidingUp - 45, $cont - $slides - 90);
          }
        },
        "drawCellInfo" : function(node, key, list, n, tab, color, now, date, size, buffer, data, defer_sort) {
          if (!color && !size && (node["globalAlpha"] = attributes["globalAlpha"], settings[_0x4c5b("0x2f3")] && defer_sort && !date && 200 >= tab && this[_0x4c5b("0x728")](node, list, n, tab), !settings[_0x4c5b("0x2f5")] || settings["showMass"])) {
            var browser = false;
            if (date || now || !(browser = this["setAutoHideCellInfo"](tab)) || !settings["autoHideNames"] || !settings["autoHideMass"]) {
              var rules = null;
              if (!this[_0x4c5b("0x2ad")][_0x4c5b("0x3fe")](key)) {
                return (rules = new setup(list, n, now, date, settings["shortMass"], settings[_0x4c5b("0x29f")]))["setMass"](tab), rules[_0x4c5b("0x2ab")](buffer), void(this[_0x4c5b("0x2ad")][key] = rules);
              }
              (rules = this[_0x4c5b("0x2ad")][key])[_0x4c5b("0x14f")](list, n, tab, now, date, buffer);
              rules["setDrawing"](settings[_0x4c5b("0x2a2")], settings[_0x4c5b("0x2a3")], settings["shortMass"], settings[_0x4c5b("0x29f")], settings["namesStroke"], settings[_0x4c5b("0x2c8")]);
              rules[_0x4c5b("0x2e9")](attributes[_0x4c5b("0x2c9")], data[_0x4c5b("0x48c")], data["massScale"], data["virMassScale"], data[_0x4c5b("0x296")]);
              node["globalAlpha"] = data["textAlpha"];
              if (!(settings[_0x4c5b("0x2f5")] || browser && settings[_0x4c5b("0x2f9")] || date && settings[_0x4c5b("0x2fa")] || defer_sort && settings[_0x4c5b("0x2fb")])) {
                rules[_0x4c5b("0x2ca")](node, data[_0x4c5b("0x2cb")], data[_0x4c5b("0x2cc")], data[_0x4c5b("0x729")], data[_0x4c5b("0x2cd")]);
              }
              if (!(!settings[_0x4c5b("0x2e7")] || browser && settings[_0x4c5b("0x2f7")] || date && settings[_0x4c5b("0x609")] || settings[_0x4c5b("0x2fc")] && !date && !now)) {
                rules["drawMass"](node, data[_0x4c5b("0x47d")], data[_0x4c5b("0x2d0")], data[_0x4c5b("0x2d1")], data[_0x4c5b("0x2d3")]);
              }
            }
          }
        },
        "setVirusColor" : function(canCreateDiscussions) {
          return 183 < Math[_0x4c5b("0xd8")](canCreateDiscussions * canCreateDiscussions / 100) ? "#C80000" : data["virusColor"];
        },
        "setVirusStrokeColor" : function(canCreateDiscussions) {
          return attributes[_0x4c5b("0x2de")] && 0 != attributes[_0x4c5b("0x72a")] ? .76 < Math[_0x4c5b("0xd8")](canCreateDiscussions * canCreateDiscussions / 100) / (this[_0x4c5b("0x549")] ? attributes[_0x4c5b("0x72a")] : attributes[_0x4c5b("0x72b")]) ? _0x4c5b("0x72c") : "#C80000" : data[_0x4c5b("0x2e1")];
        },
        "setAutoHideCellInfo" : function(canCreateDiscussions) {
          return 40 >= canCreateDiscussions || .5 > attributes[_0x4c5b("0x2c9")] && 550 > canCreateDiscussions && canCreateDiscussions < 25 / attributes[_0x4c5b("0x2c9")];
        },
        "setParty" : function() {
          var outFile = $(_0x4c5b("0x72d"))[_0x4c5b("0x44d")]();
          if (this[_0x4c5b("0x560")] = attributes[_0x4c5b("0x560")] = $(_0x4c5b("0x65b"))["val"](), this[_0x4c5b("0x567")](), _0x4c5b("0x6d4") === this[_0x4c5b("0x560")] && outFile) {
            var originalOutFile = outFile;
            if (-1 != outFile[_0x4c5b("0x2d")]("#")) {
              originalOutFile = (outFile = outFile[_0x4c5b("0x227")]("#"))[1];
            }
            if (this[_0x4c5b("0x6f7")] !== originalOutFile) {
              this[_0x4c5b("0x6f7")] = originalOutFile;
              this[_0x4c5b("0x72e")]();
              this[_0x4c5b("0x72f")]();
              this[_0x4c5b("0x730")]();
            }
          }
        },
        "createParty" : function() {
          $(_0x4c5b("0x731"))[_0x4c5b("0x4c9")]();
        },
        "joinParty" : function() {
          var artistTrack = $("#party-token")[_0x4c5b("0x44d")]();
          if (artistTrack) {
            $(_0x4c5b("0x732"))[_0x4c5b("0x4c9")]();
            $(_0x4c5b("0x733"))[_0x4c5b("0x44d")](artistTrack);
            $(_0x4c5b("0x734"))["click"]();
          }
        },
        "leaveParty" : function() {
          $("#party-token, .party-token")["val"]("");
          $(_0x4c5b("0x735"))["click"]();
        },
        "closeParty" : function() {
          $(_0x4c5b("0x736"))["val"]("");
          $(_0x4c5b("0x737"))[_0x4c5b("0x4c9")]();
        },
        "flushData" : function() {
          this[_0x4c5b("0x738")]();
          this[_0x4c5b("0x72e")]();
          this[_0x4c5b("0x72f")]();
          this[_0x4c5b("0x730")]();
          attributes["play"] = false;
          attributes[_0x4c5b("0x6f9")] = null;
        },
        "flushPartyData" : function() {
          this["teamPlayers"] = [];
          this[_0x4c5b("0x5a5")] = [];
          this[_0x4c5b("0x739")] = "";
          this[_0x4c5b("0x73a")] = null;
          this[_0x4c5b("0x73b")] = "";
          this[_0x4c5b("0x73c")] = "";
          this[_0x4c5b("0x73d")] = "";
          this[_0x4c5b("0x73e")] = "";
        },
        "flushCells" : function() {
          this[_0x4c5b("0x2ad")] = {};
        },
        "flushSkinsMap" : function() {
          this[_0x4c5b("0x706")] = {};
        },
        "flushChatData" : function() {
          this[_0x4c5b("0x73f")] = {};
        },
        "getWS" : function(canCreateDiscussions) {
          if (canCreateDiscussions) {
            this["ws"] = canCreateDiscussions;
            this[_0x4c5b("0x740")]();
            this[_0x4c5b("0x741")]();
            if (-1 == this["ws"][_0x4c5b("0x2d")](_0x4c5b("0x742"))) {
              this[_0x4c5b("0x743")]();
            }
          }
        },
        "recreateWS" : function(token) {
          if (!token) {
            return null;
          }
          var levels = null;
          if (/^[a-zA-Z0-9=+\/]{12,}$/[_0x4c5b("0x22e")](token)) {
            var str = atob(token);
            if (/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}:[0-9]{1,4}/[_0x4c5b("0x22e")](str)) {
              levels = "wss://ip-" + str[_0x4c5b("0x3e")](/\./g, "-")[_0x4c5b("0x3e")](":", ".tech.agar.io:");
            }
          }
          return !levels && /^[a-z0-9]{5,}$/["test"](token) && (levels = _0x4c5b("0x744") + token + _0x4c5b("0x745")), levels;
        },
        "createServerToken" : function() {
          var _0x2fcc15 = this["ws"]["match"](/ip-\d+/);
          var end_callback = this["ws"][_0x4c5b("0x21e")](/live-arena-([\w\d]+)/);
          var res = null;
          if (_0x2fcc15 && (_0x2fcc15 = this["ws"][_0x4c5b("0x3e")](_0x4c5b("0x746"), "")["replace"](/-/g, ".")[_0x4c5b("0x21e")](/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}:[0-9]{1,4}/)) && (this[_0x4c5b("0x747")] = _0x2fcc15[0], res = btoa(this[_0x4c5b("0x747")])), !res && end_callback && (this[_0x4c5b("0x748")] = end_callback[1], res = this["serverArena"]), res) {
            if (this[_0x4c5b("0x749")] !== res) {
              this[_0x4c5b("0x749")] = res;
              this[_0x4c5b("0x74a")]();
              this["flushCells"]();
            }
            this[_0x4c5b("0x6f7")] = "";
            var _0x433c87 = this["ws"][_0x4c5b("0x21e")](/party_id=([A-Z0-9]{6})/);
            if (_0x433c87) {
              this[_0x4c5b("0x6f7")] = _0x433c87[1];
              formatPropertyRead("/#" + window[_0x4c5b("0x74b")](this[_0x4c5b("0x6f7")]));
            }
          }
        },
        "updateServerInfo" : function() {
          var iHref = this["ws"];
          iHref = iHref[_0x4c5b("0x227")](_0x4c5b("0x74c"))[_0x4c5b("0xc")]("");
          iHref = iHref[_0x4c5b("0x74d")](0, iHref[_0x4c5b("0x2d")]("?"));
          $(_0x4c5b("0x74e"))[_0x4c5b("0x1ff")](_0x4c5b("0x74f") + iHref + "]");
          $(_0x4c5b("0x677"))[_0x4c5b("0x44d")](this[_0x4c5b("0x749")]);
          $(_0x4c5b("0x736"))[_0x4c5b("0x44d")](this[_0x4c5b("0x6f7")]);
        },
        "gameServerConnect" : function(url__99) {
          if (url__99) {
            this["skipServerData"] = true;
            if (window[_0x4c5b("0x543")] && window["core"][_0x4c5b("0x6ef")]) {
              window[_0x4c5b("0x543")]["connect"](url__99);
            }
          }
        },
        "gameServerReconnect" : function() {
          if (window["MC"] && window["MC"][_0x4c5b("0x750")]) {
            window["MC"][_0x4c5b("0x750")]();
          } else {
            if (window[_0x4c5b("0x751")] && window[_0x4c5b("0x751")][_0x4c5b("0x750")]) {
              window[_0x4c5b("0x751")][_0x4c5b("0x750")]();
            }
          }
        },
        "gameServerJoin" : function(level) {
          var numberOfTiles = this[_0x4c5b("0x752")](level);
          if (numberOfTiles) {
            this["skipServerData"] = true;
            this[_0x4c5b("0x575")](numberOfTiles);
          }
        },
        "connect" : function() {
          this[_0x4c5b("0x743")]();
          this["flushData"]();
          this[_0x4c5b("0x6d3")]();
          console[_0x4c5b("0x244")](_0x4c5b("0x753"));
          this[_0x4c5b("0x754")] = this[_0x4c5b("0x755")] && this["privateIP"] ? new WebSocket(this[_0x4c5b("0x756")]) : new WebSocket(this[_0x4c5b("0x757")]);
          this[_0x4c5b("0x754")][_0x4c5b("0x758")] = true;
          this[_0x4c5b("0x754")][_0x4c5b("0x759")] = _0x4c5b("0x75a");
          var directiveProcessors = this;
          this[_0x4c5b("0x754")][_0x4c5b("0x75b")] = function() {
            console["log"]("[OGARio] Socket open");
            var $node = directiveProcessors[_0x4c5b("0x75c")](3);
            $node["setUint8"](0, 0);
            $node[_0x4c5b("0x75d")](1, 401, true);
            directiveProcessors["sendBuffer"]($node);
            directiveProcessors[_0x4c5b("0x6ee")]();
          };
          this[_0x4c5b("0x754")][_0x4c5b("0x75e")] = function($node) {
            directiveProcessors[_0x4c5b("0x75f")]($node);
          };
          this[_0x4c5b("0x754")][_0x4c5b("0x760")] = function(b) {
            directiveProcessors[_0x4c5b("0x74a")]();
            console[_0x4c5b("0x244")]("[OGARio] Socket close", b);
          };
          this[_0x4c5b("0x754")][_0x4c5b("0x1a7")] = function(b) {
            directiveProcessors[_0x4c5b("0x74a")]();
            console[_0x4c5b("0x244")]("[OGARio] Socket error", b);
          };
        },
        "closeConnection" : function() {
          if (this[_0x4c5b("0x754")]) {
            this["socket"][_0x4c5b("0x75e")] = null;
            try {
              this["socket"][_0x4c5b("0x198")]();
            } catch (_0x2350fc) {
            }
            this["socket"] = null;
          }
        },
        "reconnect" : function() {
          this[_0x4c5b("0x6d3")]();
          var cp = this;
          setTimeout(function() {
            cp["connect"]();
          }, 1E3);
        },
        "switchServerMode" : function() {
          if (this["privateIP"]) {
            this[_0x4c5b("0x755")] = !this[_0x4c5b("0x755")];
            if (this["isSocketOpen"]()) {
              this[_0x4c5b("0x743")]();
              toastr[_0x4c5b("0x47")](_0x4c5b("0x761"));
            }
            if (this[_0x4c5b("0x755")]) {
              toastr[_0x4c5b("0x5bf")](_0x4c5b("0x762"));
              $(_0x4c5b("0x763"))[_0x4c5b("0x54c")]();
            } else {
              toastr[_0x4c5b("0x5bf")]("Prze\u0413\u0453\u0432\u0402\u00a6\u0413\u045e\u0432\u201a\u00ac\u0415\u040e\u0413\u0453\u0432\u0402\u045b\u0413\u045e\u0432\u201a\u00ac\u0412\u00a6czono na serwer publiczny!");
              $("#active-parties")[_0x4c5b("0x5bd")]();
              $(".party-panel")[_0x4c5b("0x54f")]();
            }
            this["onJoin"]();
            if (attributes[_0x4c5b("0x2de")]) {
              this[_0x4c5b("0x764")]();
            }
          }
        },
        "isSocketOpen" : function() {
          return null !== this[_0x4c5b("0x754")] && this[_0x4c5b("0x754")][_0x4c5b("0x765")] === this[_0x4c5b("0x754")][_0x4c5b("0x766")];
        },
        "writeUint32" : function(data, value) {
          for (;;) {
            if (0 == (-128 & value)) {
              return void data[_0x4c5b("0x7")](value);
            }
            data[_0x4c5b("0x7")](128 | 127 & value);
            value = value >>> 7;
          }
        },
        "createView" : function(ol) {
          return new DataView(new ArrayBuffer(ol));
        },
        "strToBuff" : function(leftFence, PL$42) {
          var webfs = this[_0x4c5b("0x75c")](1 + 2 * PL$42["length"]);
          webfs[_0x4c5b("0x767")](0, leftFence);
          var PL$41 = 0;
          for (; PL$41 < PL$42["length"]; PL$41++) {
            webfs[_0x4c5b("0x75d")](1 + 2 * PL$41, PL$42[_0x4c5b("0xa")](PL$41), true);
          }
          return webfs;
        },
        "sendBuffer" : function(callback) {
          this[_0x4c5b("0x754")][_0x4c5b("0x768")](callback[_0x4c5b("0xe7")]);
        },
        "handleMessage" : function(data) {
          this["readMessage"](new DataView(data[_0x4c5b("0x21")]));
        },
        "readMessage" : function(event) {
          switch(event["getUint8"](0)) {
            case 0:
              this[_0x4c5b("0x769")] = event[_0x4c5b("0x76a")](1, true);
              break;
            case 1:
              this[_0x4c5b("0x76b")]();
              break;
            case 20:
              this[_0x4c5b("0x76c")](event);
              break;
            case 30:
              this[_0x4c5b("0x76d")](event);
              break;
            case 96:
              break;
            case 100:
              this[_0x4c5b("0x76e")](event);
          }
        },
        "sendPlayerState" : function(duration) {
          if (this[_0x4c5b("0x6ed")]()) {
            var backEl = this["createView"](1);
            backEl[_0x4c5b("0x767")](0, duration);
            this[_0x4c5b("0x76f")](backEl);
          }
        },
        "sendPlayerSpawn" : function() {
          this[_0x4c5b("0x770")](1);
        },
        "sendPlayerDeath" : function() {
          this[_0x4c5b("0x770")](2);
        },
        "sendPlayerJoin" : function() {
          this[_0x4c5b("0x770")](3);
        },
        "sendPlayerData" : function(data, player, message) {
          if (!(null !== this[player] && this[player] === message)) {
            if (this[_0x4c5b("0x6ed")]()) {
              this[_0x4c5b("0x76f")](this[_0x4c5b("0x771")](data, message));
              this[player] = message;
            }
          }
        },
        "sendPlayerNick" : function() {
          this[_0x4c5b("0x772")](10, _0x4c5b("0x739"), names["nick"]);
        },
        "sendPlayerClanTag" : function() {
          this["sendPlayerData"](11, _0x4c5b("0x73a"), names[_0x4c5b("0x5df")]);
        },
        "sendPlayerSkinURL" : function() {
          this[_0x4c5b("0x772")](12, _0x4c5b("0x73b"), names[_0x4c5b("0x5f0")]);
        },
        "sendPlayerCustomColor" : function() {
          this["sendPlayerData"](13, _0x4c5b("0x73c"), names["color"]);
        },
        "sendPlayerColor" : function() {
          if (this[_0x4c5b("0x6ed")]() && attributes[_0x4c5b("0x6f9")]) {
            this[_0x4c5b("0x76f")](this[_0x4c5b("0x771")](14, attributes[_0x4c5b("0x6f9")]));
          }
        },
        "sendPartyToken" : function() {
          this["setParty"]();
          this[_0x4c5b("0x772")](15, "lastSentPartyToken", this["partyToken"]);
        },
        "sendServerToken" : function() {
          this[_0x4c5b("0x772")](16, _0x4c5b("0x73e"), this[_0x4c5b("0x749")]);
        },
        "sendServerJoin" : function() {
          this[_0x4c5b("0x773")]();
          this[_0x4c5b("0x6f5")]();
        },
        "sendServerRegion" : function() {
          if (this[_0x4c5b("0x65a")]) {
            var pseudoNames = this["region"]["split"]("-");
            if (this[_0x4c5b("0x6ed")]()) {
              this[_0x4c5b("0x76f")](this["strToBuff"](17, pseudoNames[0]));
            }
          }
        },
        "sendServerGameMode" : function() {
          var artistTrack = _0x4c5b("0x774");
          switch(this[_0x4c5b("0x560")]) {
            case _0x4c5b("0x775"):
              artistTrack = "BTR";
              break;
            case _0x4c5b("0x55f"):
              artistTrack = _0x4c5b("0x776");
              break;
            case _0x4c5b("0x777"):
              artistTrack = _0x4c5b("0x778");
              break;
            case _0x4c5b("0x6d4"):
              artistTrack = _0x4c5b("0x779");
          }
          if (this["isSocketOpen"]()) {
            this["sendBuffer"](this["strToBuff"](18, artistTrack));
          }
        },
        "sendServerData" : function() {
          if (this[_0x4c5b("0x77a")]) {
            this[_0x4c5b("0x77a")] = false;
          } else {
            this[_0x4c5b("0x65a")] = $(_0x4c5b("0x6d1"))[_0x4c5b("0x44d")]();
            this[_0x4c5b("0x560")] = $(_0x4c5b("0x65b"))["val"]();
            this[_0x4c5b("0x77b")]();
            this["sendServerGameMode"]();
          }
        },
        "sendPartyData" : function() {
          this[_0x4c5b("0x77c")]();
          this[_0x4c5b("0x77d")]();
          this[_0x4c5b("0x773")]();
          this[_0x4c5b("0x77e")]();
        },
        "sendPlayerUpdate" : function() {
          if (this[_0x4c5b("0x6ed")]() && attributes[_0x4c5b("0x2de")] && this[_0x4c5b("0x769")] && attributes[_0x4c5b("0x6f9")]) {
            var expect = function(PL$42) {
              var PL$41 = 0;
              for (; PL$41 < PL$42["length"]; PL$41++) {
                graphic["setUint16"](sector, PL$42[_0x4c5b("0xa")](PL$41), true);
                sector = sector + 2;
              }
              graphic[_0x4c5b("0x75d")](sector, 0, true);
              sector = sector + 2;
            };
            var type = 41;
            type = type + 2 * names[_0x4c5b("0x28e")]["length"];
            type = type + 2 * names["skinURL"]["length"];
            console[_0x4c5b("0x244")](type);
            var graphic = this[_0x4c5b("0x75c")](type);
            graphic[_0x4c5b("0x767")](0, 20);
            graphic[_0x4c5b("0x77f")](1, this[_0x4c5b("0x769")], true);
            var sector = 5;
            expect(names[_0x4c5b("0x28e")]);
            expect(names[_0x4c5b("0x5f0")]);
            expect(names["color"]);
            expect(attributes[_0x4c5b("0x6f9")]);
            this[_0x4c5b("0x76f")](graphic);
          }
        },
        "sendPlayerPosition" : function() {
          if (this[_0x4c5b("0x6ed")]() && attributes[_0x4c5b("0x2de")] && this[_0x4c5b("0x769")]) {
            var artistTrack = this["createView"](17);
            artistTrack[_0x4c5b("0x767")](0, 30);
            artistTrack["setUint32"](1, this[_0x4c5b("0x769")], true);
            artistTrack[_0x4c5b("0x780")](5, this[_0x4c5b("0x781")](), true);
            artistTrack[_0x4c5b("0x780")](9, this[_0x4c5b("0x782")](), true);
            if (void 0 === attributes[_0x4c5b("0x58d")]) {
              artistTrack[_0x4c5b("0x77f")](13, this[_0x4c5b("0x58d")], true);
            } else {
              artistTrack[_0x4c5b("0x77f")](13, attributes["playerMass"], true);
            }
            this[_0x4c5b("0x76f")](artistTrack);
          }
        },
        "checkPlayerID" : function(id) {
          if (id) {
            var IS_PENDING = 0;
            for (; IS_PENDING < this[_0x4c5b("0x71f")]["length"]; IS_PENDING++) {
              if (this[_0x4c5b("0x71f")][IS_PENDING]["id"] == id) {
                return IS_PENDING;
              }
            }
          }
          return null;
        },
        "updateTeamPlayer" : function(dataHeaders) {
          function $() {
            var string = "";
            var characterCode;
            for (;;) {
              if (characterCode = dataHeaders["getUint16"](offset, true), 0 == characterCode) {
                break;
              }
              string = string + String[_0x4c5b("0x35")](characterCode);
              offset = offset + 2;
            }
            return offset = offset + 2, string;
          }
          var headPath = dataHeaders["getUint32"](1, true);
          var offset = 5;
          var key = $();
          var inputel = $();
          var $unusedPanel = $();
          var x = $();
          var patternlab = _0x4c5b("0x6d4") === this[_0x4c5b("0x560")] ? key + x : key;
          var otherSideWidth = this[_0x4c5b("0x783")](headPath);
          if (null !== otherSideWidth) {
            this[_0x4c5b("0x71f")][otherSideWidth][_0x4c5b("0x28e")] = key;
            this["teamPlayers"][otherSideWidth][_0x4c5b("0x784")] = patternlab;
            this[_0x4c5b("0x71f")][otherSideWidth][_0x4c5b("0x5f0")] = inputel;
            this[_0x4c5b("0x71f")][otherSideWidth]["setColor"](x, $unusedPanel);
          } else {
            var headPattern = new function(envId, canCreateDiscussions, isSlidingUp, dontForceConstraints) {
              this["id"] = envId;
              this[_0x4c5b("0x28e")] = canCreateDiscussions;
              this[_0x4c5b("0x784")] = isSlidingUp;
              this[_0x4c5b("0x5f0")] = dontForceConstraints;
              this["x"] = 0;
              this["y"] = 0;
              this[_0x4c5b("0x785")] = 0;
              this["lastY"] = 0;
              this["mass"] = 0;
              this["clanTag"] = "";
              this["color"] = null;
              this["customColor"] = data[_0x4c5b("0x4b7")];
              this["alive"] = false;
              this[_0x4c5b("0x786")] = null;
              this["pi2"] = 2 * Math["PI"];
              this["setColor"] = function(isSlidingUp, canCreateDiscussions) {
                this["color"] = isSlidingUp;
                if (7 == canCreateDiscussions["length"]) {
                  this[_0x4c5b("0x787")] = canCreateDiscussions;
                }
              };
              this[_0x4c5b("0x720")] = function(config, sy, width, startcode, endcode) {
                if (!(!this[_0x4c5b("0x788")] || startcode && endcode && this["id"] != endcode)) {
                  this[_0x4c5b("0x785")] = (29 * this["lastX"] + this["x"]) / 30;
                  this[_0x4c5b("0x789")] = (29 * this[_0x4c5b("0x789")] + this["y"]) / 30;
                  var start = (this[_0x4c5b("0x785")] + sy) * width - 10;
                  var destOffset = (this[_0x4c5b("0x789")] + sy) * width;
                  if (0 < this["nick"]["length"]) {
                    config["font"] = data[_0x4c5b("0x78a")] + " " + data[_0x4c5b("0x4bf")] + "px " + data["miniMapNickFontFamily"];
                    config[_0x4c5b("0x78b")] = _0x4c5b("0x78c");
                    if (0 < data[_0x4c5b("0x4c0")]) {
                      config["lineWidth"] = data[_0x4c5b("0x4c0")];
                      config["strokeStyle"] = data[_0x4c5b("0x4b4")];
                      config["strokeText"](this[_0x4c5b("0x28e")], start, destOffset - (2 * data[_0x4c5b("0x78d")] + 2));
                    }
                    config["fillStyle"] = data[_0x4c5b("0x78e")];
                    config["fillText"](this[_0x4c5b("0x28e")], start, destOffset - (2 * data[_0x4c5b("0x78d")] + 2));
                  }
                  config["beginPath"]();
                  config["arc"](start, destOffset, data[_0x4c5b("0x78d")], 0, this["pi2"], false);
                  config[_0x4c5b("0x2da")]();
                  config["fillStyle"] = settings[_0x4c5b("0x78f")] ? data["miniMapTeammatesColor"] : this["color"];
                  config["fill"]();
                }
              };
            }(headPath, key, patternlab, inputel);
            headPattern["setColor"](x, $unusedPanel);
            this["teamPlayers"][_0x4c5b("0x7")](headPattern);
          }
          this[_0x4c5b("0x6fb")](key, x, inputel);
        },
        "updateTeamPlayerPosition" : function(canCreateDiscussions) {
          var primaryModel = canCreateDiscussions[_0x4c5b("0x76a")](1, true);
          var key = this[_0x4c5b("0x783")](primaryModel);
          if (null !== key) {
            var s = canCreateDiscussions[_0x4c5b("0x790")](5, true);
            var back = canCreateDiscussions[_0x4c5b("0x790")](9, true);
            var statValue = canCreateDiscussions[_0x4c5b("0x76a")](13, true);
            if (36E4 < statValue) {
              return;
            }
            var stats = this[_0x4c5b("0x71f")][key];
            stats["x"] = s;
            stats["y"] = back;
            stats[_0x4c5b("0x291")] = statValue;
            stats[_0x4c5b("0x788")] = true;
            stats[_0x4c5b("0x786")] = Date[_0x4c5b("0x53f")]();
            if (this[_0x4c5b("0x791")] && this[_0x4c5b("0x722")] && primaryModel == this[_0x4c5b("0x722")]) {
              this["updateTarget"](stats["nick"], stats[_0x4c5b("0x5f0")], s, back, statValue, stats["color"]);
            }
          }
        },
        "updateTeamPlayers" : function() {
          this[_0x4c5b("0x792")]();
          this[_0x4c5b("0x73f")] = {};
          this["top5"] = [];
          var fullCrc = 0;
          var data;
          for (; fullCrc < this[_0x4c5b("0x71f")]["length"]; fullCrc++) {
            data = this[_0x4c5b("0x71f")][fullCrc];
            if (data[_0x4c5b("0x788")] && 2E3 <= Date[_0x4c5b("0x53f")]() - data[_0x4c5b("0x786")] || 0 == data[_0x4c5b("0x291")]) {
              data[_0x4c5b("0x788")] = false;
              if (this[_0x4c5b("0x791")] && this[_0x4c5b("0x722")] && data["id"] == this[_0x4c5b("0x722")]) {
                this[_0x4c5b("0x793")](2);
              }
            }
            if (data[_0x4c5b("0x788")]) {
              this["top5"]["push"]({
                "id" : data["id"],
                "nick" : data[_0x4c5b("0x28e")],
                "x" : data["x"],
                "y" : data["y"],
                "mass" : data[_0x4c5b("0x291")],
                "color" : data["color"],
                "skin" : data["skinURL"]
              });
              if (!this[_0x4c5b("0x794")](data["id"])) {
                this[_0x4c5b("0x795")](data["id"], data[_0x4c5b("0x28e")]);
              }
            }
          }
          this[_0x4c5b("0x5ac")][_0x4c5b("0x796")](function(subtractee, subtractor) {
            return subtractor[_0x4c5b("0x291")] - subtractee[_0x4c5b("0x291")];
          });
          this["displayTop5"]();
        },
        "updateParties" : function(f_arr) {
          this[_0x4c5b("0x5a5")] = [];
          var clientHeight = f_arr[_0x4c5b("0x797")](1);
          var value = 2;
          var targetOffsetHeight = 0;
          for (; targetOffsetHeight < clientHeight; targetOffsetHeight++) {
            var outstring = "";
            var data;
            for (;;) {
              if (data = f_arr[_0x4c5b("0x798")](value, true), 0 == data) {
                break;
              }
              outstring = outstring + String["fromCharCode"](data);
              value = value + 2;
            }
            value = value + 2;
            this[_0x4c5b("0x5a5")][_0x4c5b("0x7")](outstring);
          }
        },
        "readChatMessage" : function(constraints) {
          if (!settings[_0x4c5b("0x5c1")]) {
            var labelFromDom = (new Date)[_0x4c5b("0x799")]()[_0x4c5b("0x3e")](/^(\d{2}:\d{2}).*/, "$1");
            var numKeysDeleted = constraints[_0x4c5b("0x797")](1);
            var postDateGmt = constraints[_0x4c5b("0x76a")](2, true);
            var _0x12cdc4 = constraints[_0x4c5b("0x76a")](6, true);
            if (!(this[_0x4c5b("0x794")](postDateGmt) || 0 != _0x12cdc4 && _0x12cdc4 != this["playerID"] && postDateGmt != this[_0x4c5b("0x769")])) {
              var outstring = "";
              var value = 10;
              var data;
              for (; value < constraints[_0x4c5b("0x8")] && (data = constraints[_0x4c5b("0x798")](value, true), 0 != data); value = value + 2) {
                outstring = outstring + String[_0x4c5b("0x35")](data);
              }
              this[_0x4c5b("0x79a")](labelFromDom, numKeysDeleted, postDateGmt, outstring);
            }
          }
        },
        "sendChatMessage" : function(data, event) {
          if (!(500 > Date[_0x4c5b("0x53f")]() - this[_0x4c5b("0x79b")] || 0 == event["length"] || 0 == names[_0x4c5b("0x28e")]["length"]) && this[_0x4c5b("0x6ed")]()) {
            event = names[_0x4c5b("0x28e")] + ": " + event;
            var readInfo = this[_0x4c5b("0x75c")](10 + 2 * event["length"]);
            readInfo["setUint8"](0, 100);
            readInfo[_0x4c5b("0x767")](1, data);
            readInfo[_0x4c5b("0x77f")](2, this[_0x4c5b("0x769")], true);
            readInfo["setUint32"](6, 0, true);
            var real_type = 0;
            for (; real_type < event["length"]; real_type++) {
              readInfo[_0x4c5b("0x75d")](10 + 2 * real_type, event[_0x4c5b("0xa")](real_type), true);
            }
            this[_0x4c5b("0x76f")](readInfo);
            this[_0x4c5b("0x79b")] = Date[_0x4c5b("0x53f")]();
          }
        },
        "prepareCommand" : function(PL$5) {
          return PL$5["replace"](_0x4c5b("0x79c"), this[_0x4c5b("0x59e")]);
        },
        "sendCommand" : function(callback) {
          var artistTrack = this[_0x4c5b("0x79d")](target["comm" + callback]);
          this[_0x4c5b("0x5c6")](102, artistTrack);
        },
        "addChatUser" : function(url, eTag) {
          this[_0x4c5b("0x73f")][url] = eTag;
        },
        "getChatUserNick" : function(profileId) {
          return this[_0x4c5b("0x73f")][_0x4c5b("0x3fe")](profileId) ? this[_0x4c5b("0x73f")][profileId] : "";
        },
        "muteChatUser" : function(cookieType) {
          if (cookieType && !this[_0x4c5b("0x794")](cookieType)) {
            var value = this[_0x4c5b("0x79e")](cookieType);
            this["chatMutedUsers"][cookieType] = value;
            this[_0x4c5b("0x79f")][_0x4c5b("0x7")](cookieType);
            toastr[_0x4c5b("0x47")](args[_0x4c5b("0x7a0")][_0x4c5b("0x3e")](_0x4c5b("0x7a1"), _0x4c5b("0x7a2") + this[_0x4c5b("0x7a3")](value) + _0x4c5b("0x7a4")) + _0x4c5b("0x7a5") + cookieType + _0x4c5b("0x7a6") + args[_0x4c5b("0x69d")] + _0x4c5b("0x4d4"));
          }
        },
        "unmuteChatUser" : function(listener) {
          if (listener) {
            var script = this[_0x4c5b("0x79f")]["indexOf"](listener);
            if (-1 != script) {
              this["chatMutedUserIDs"][_0x4c5b("0xd4")](script, 1);
              toastr["info"](args[_0x4c5b("0x7a7")][_0x4c5b("0x3e")](_0x4c5b("0x7a1"), _0x4c5b("0x7a2") + this["escapeHTML"](this[_0x4c5b("0x7a8")][listener]) + _0x4c5b("0x7a4")));
              delete this["chatMutedUsers"][listener];
            }
          }
        },
        "isChatUserMuted" : function(mmCoreSplitViewBlock) {
          return -1 != this[_0x4c5b("0x79f")][_0x4c5b("0x2d")](mmCoreSplitViewBlock);
        },
        "parseMessage" : function(url) {
          var http = /\[img\]([\w:\/\.\?]+)\[\/img\]/i;
          if (http[_0x4c5b("0x22e")](url)) {
            var artistTrack = url[_0x4c5b("0x21e")](http)[1];
            return settings[_0x4c5b("0x612")] && this[_0x4c5b("0x7a9")](artistTrack) ? _0x4c5b("0x7aa") + artistTrack + '" style="width:100%;border:none;">' : "";
          }
          var req = /\[yt\]([\w-]{11})\[\/yt\]/i;
          if (req["test"](url)) {
            return settings["showChatVideos"] ? '<iframe type="text/html" width="100%" height="auto" src="https://www.youtube.com/embed/' + url[_0x4c5b("0x21e")](req)[1] + '?autoplay=1&amp;vq=tiny" frameborder="0" />' : "";
          }
          var data = this["escapeHTML"](url);
          return settings[_0x4c5b("0x611")] && (data = this[_0x4c5b("0x7ab")](data)), data;
        },
        "parseEmoticons" : function(text) {
          return (text + "")[_0x4c5b("0x3e")](/&lt;3/g, "<3")[_0x4c5b("0x3e")](/(O:\)|3:\)|8=\)|:\)|;\)|=\)|:D|X\-D|=D|:\(|;\(|:P|;P|:\*|\$\)|<3|:o|\(:\||:\||:\\|:@|\|\-\)|\^_\^|\-_\-|\$_\$|\(poop\)|\(fuck\)|\(clap\)|\(ok\)|\(victory\)|\(y\)|\(n\))/g, function(sourcePropKey) {
            return _0x4c5b("0x631") + obj[sourcePropKey] + _0x4c5b("0x632") + sourcePropKey + _0x4c5b("0x633");
          });
        },
        "displayChatMessage" : function(content, peerId, key, selector) {
          if (0 != selector["length"]) {
            var data = selector[_0x4c5b("0x227")](": ", 1)[_0x4c5b("0x25")]();
            var msg_obj = this[_0x4c5b("0x7ac")](selector["replace"](data + ": ", ""));
            if (!(0 == data["length"] || 15 < data["length"] || 0 == msg_obj["length"])) {
              var axis = "";
              if (0 != key && key != this[_0x4c5b("0x769")] && (this[_0x4c5b("0x795")](key, data), axis = _0x4c5b("0x7ad") + key + '" class="mute-user ogicon-user-minus"></a> '), data = this[_0x4c5b("0x7a3")](data), 101 == peerId) {
                if (settings[_0x4c5b("0x5d6")]) {
                  return $("#chat-box")[_0x4c5b("0x448")]('<div class="message"><span class="message-time">[' + content + _0x4c5b("0x7ae") + axis + _0x4c5b("0x7af") + data + _0x4c5b("0x5ba") + msg_obj + _0x4c5b("0x7b0")), $(_0x4c5b("0x52d"))[_0x4c5b("0x67e")](_0x4c5b("0x14f")), $("#chat-box")[_0x4c5b("0x7b1")]({
                    "scrollTop" : $(_0x4c5b("0x52d"))["prop"]("scrollHeight")
                  }, 500), void(settings["chatSounds"] && this[_0x4c5b("0x7b2")](this[_0x4c5b("0x62e")]));
                }
                if (!settings["hideChat"]) {
                  toastr[_0x4c5b("0x7b3")](_0x4c5b("0x7af") + data + _0x4c5b("0x5ba") + msg_obj + "</span>" + axis);
                  if (settings["chatSounds"]) {
                    this[_0x4c5b("0x7b2")](this[_0x4c5b("0x62e")]);
                  }
                }
                this[_0x4c5b("0x5b9")][_0x4c5b("0x7")]({
                  "nick" : data,
                  "message" : msg_obj
                });
                if (15 < this[_0x4c5b("0x5b9")]["length"]) {
                  this[_0x4c5b("0x5b9")][_0x4c5b("0x18e")]();
                }
              } else {
                if (102 == peerId) {
                  if (settings[_0x4c5b("0x5d6")]) {
                    return $(_0x4c5b("0x52d"))[_0x4c5b("0x448")](_0x4c5b("0x7b4") + content + "] </span>" + axis + _0x4c5b("0x7b5") + data + _0x4c5b("0x7b6") + msg_obj + _0x4c5b("0x7b0")), $(_0x4c5b("0x52d"))[_0x4c5b("0x67e")](_0x4c5b("0x14f")), $("#chat-box")[_0x4c5b("0x7b1")]({
                      "scrollTop" : $(_0x4c5b("0x52d"))[_0x4c5b("0x57c")](_0x4c5b("0x7b7"))
                    }, 500), void(settings["chatSounds"] && this[_0x4c5b("0x7b2")](this[_0x4c5b("0x630")]));
                  }
                  if (!settings["hideChat"]) {
                    toastr[_0x4c5b("0x7b8")](_0x4c5b("0x7b5") + data + _0x4c5b("0x7b6") + msg_obj + _0x4c5b("0x7b9") + axis);
                    if (settings["chatSounds"]) {
                      this[_0x4c5b("0x7b2")](this[_0x4c5b("0x630")]);
                    }
                  }
                } else {
                  $(_0x4c5b("0x5bc"))[_0x4c5b("0x448")](selector);
                }
              }
            }
          }
        },
        "displayUserList" : function(obj, title, fn, initialValue, type) {
          var msg = "";
          if (void 0 !== Object[_0x4c5b("0x12d")](obj) && Object[_0x4c5b("0x12d")](obj)["length"]) {
            var key;
            for (key in msg = msg + _0x4c5b("0x7ba"), obj) {
              if (obj[_0x4c5b("0x3fe")](key)) {
                msg = msg + (_0x4c5b("0x7bb") + this[_0x4c5b("0x7a3")](obj[key]) + _0x4c5b("0x7bc") + key + _0x4c5b("0x7bd") + fn + '">' + initialValue + _0x4c5b("0x7be"));
              }
            }
            msg = msg + "</ol>";
          } else {
            msg = msg + args[_0x4c5b("0x4e8")];
          }
          toastr[type](msg, title, {
            "closeButton" : true,
            "tapToDismiss" : false
          });
        },
        "displayChatActiveUsers" : function() {
          this[_0x4c5b("0x7bf")](this[_0x4c5b("0x73f")], args[_0x4c5b("0x7c0")], _0x4c5b("0x69b"), args[_0x4c5b("0x6a0")], _0x4c5b("0x5bf"));
        },
        "displayChatMutedUsers" : function() {
          this[_0x4c5b("0x7bf")](this[_0x4c5b("0x7a8")], args[_0x4c5b("0x7c1")], "btn-green btn-unmute-user", args[_0x4c5b("0x69d")], _0x4c5b("0x47"));
        },
        "preloadChatSounds" : function() {
          this[_0x4c5b("0x7c2")]();
          this[_0x4c5b("0x7c3")]();
        },
        "setChatSoundsBtn" : function() {
          if (settings["chatSounds"]) {
            $(".chat-sound-notifications")["removeClass"](_0x4c5b("0x7c4"))[_0x4c5b("0x4d1")](_0x4c5b("0x7c5"));
          } else {
            $(_0x4c5b("0x6a1"))[_0x4c5b("0x4cf")](_0x4c5b("0x7c5"))[_0x4c5b("0x4d1")](_0x4c5b("0x7c4"));
          }
        },
        "setMessageSound" : function() {
          this[_0x4c5b("0x62e")] = this["setSound"](settings["messageSound"]);
        },
        "setCommandSound" : function() {
          this[_0x4c5b("0x630")] = this[_0x4c5b("0x7c6")](settings[_0x4c5b("0x630")]);
        },
        "setSound" : function(value) {
          return value ? new Audio(value) : null;
        },
        "playSound" : function(ttyPlayer) {
          if (ttyPlayer && ttyPlayer[_0x4c5b("0x2de")]) {
            ttyPlayer["pause"]();
            ttyPlayer["currentTime"] = 0;
            ttyPlayer["play"]();
          }
        },
        "setTargeting" : function() {
          if (this[_0x4c5b("0x722")]) {
            this[_0x4c5b("0x791")] = !this["targeting"];
            attributes[_0x4c5b("0x791")] = this[_0x4c5b("0x791")];
            this[_0x4c5b("0x7c7")]();
          }
        },
        "setTargetingInfo" : function() {
          if (this[_0x4c5b("0x791")]) {
            $(_0x4c5b("0x7c8"))["addClass"](_0x4c5b("0x4d0"));
            $("#target-status")[_0x4c5b("0x54c")]();
            if (2 != this[_0x4c5b("0x7c9")]) {
              $(_0x4c5b("0x7ca"))[_0x4c5b("0x54c")]();
            }
          } else {
            $(_0x4c5b("0x7c8"))[_0x4c5b("0x4cf")](_0x4c5b("0x4d0"));
            $("#target-summary, #target-status")["hide"]();
          }
        },
        "cancelTargeting" : function() {
          this[_0x4c5b("0x793")](0);
        },
        "setPrivateMiniMap" : function() {
          if (this[_0x4c5b("0x722")]) {
            this[_0x4c5b("0x721")] = !this[_0x4c5b("0x721")];
            if (this[_0x4c5b("0x721")]) {
              $(_0x4c5b("0x68f"))[_0x4c5b("0x4d1")](_0x4c5b("0x4d0"));
            } else {
              $(_0x4c5b("0x68f"))[_0x4c5b("0x4cf")](_0x4c5b("0x4d0"));
            }
          }
        },
        "setTarget" : function(e) {
          var id = this["checkPlayerID"](e);
          if (null !== id) {
            var map = this[_0x4c5b("0x71f")][id];
            if (this[_0x4c5b("0x722")] = map["id"], this[_0x4c5b("0x7cb")](map[_0x4c5b("0x28e")], map[_0x4c5b("0x5f0")], map["x"], map["y"], map[_0x4c5b("0x291")], map["color"]), !map[_0x4c5b("0x788")]) {
              return void this[_0x4c5b("0x793")](2);
            }
            this[_0x4c5b("0x793")](1);
          } else {
            this[_0x4c5b("0x793")](0);
          }
        },
        "setTargetStatus" : function(canCreateDiscussions) {
          if (0 === canCreateDiscussions) {
            this[_0x4c5b("0x7c9")] = 0;
            this["targetID"] = 0;
            this[_0x4c5b("0x28f")] = "";
            this[_0x4c5b("0x7cc")] = "";
            this[_0x4c5b("0x791")] = false;
            attributes[_0x4c5b("0x791")] = false;
            this[_0x4c5b("0x721")] = false;
            $(_0x4c5b("0x7cd"))[_0x4c5b("0x54f")]();
            $("#target-status")[_0x4c5b("0x54c")]()[_0x4c5b("0x1ff")]("[" + args[_0x4c5b("0x7ce")] + "]");
            $(_0x4c5b("0x7cf"))[_0x4c5b("0x4cf")](_0x4c5b("0x4d0"));
          } else {
            if (1 === canCreateDiscussions) {
              this[_0x4c5b("0x7c9")] = 1;
              if (!this[_0x4c5b("0x791")]) {
                this[_0x4c5b("0x791")] = true;
                attributes[_0x4c5b("0x791")] = true;
                this[_0x4c5b("0x7c7")]();
              }
              $(_0x4c5b("0x7d0"))[_0x4c5b("0x54c")]();
            } else {
              if (2 === canCreateDiscussions) {
                this[_0x4c5b("0x7c9")] = 2;
                $(_0x4c5b("0x7ca"))[_0x4c5b("0x54f")]();
                $(_0x4c5b("0x7d1"))["show"]()[_0x4c5b("0x1ff")]("[" + args[_0x4c5b("0x7d2")] + "]");
                attributes["resetTargetPosition"]();
              } else {
                void 0;
              }
            }
          }
        },
        "changeTarget" : function() {
          var current = this[_0x4c5b("0x783")](this[_0x4c5b("0x722")]);
          var end = null;
          var i = 0;
          for (; i < this[_0x4c5b("0x71f")]["length"]; i++) {
            if (this[_0x4c5b("0x71f")][i][_0x4c5b("0x788")]) {
              if (null === current) {
                current = i;
                break;
              }
              if (i < current && null == end) {
                end = i;
              } else {
                if (i > current) {
                  end = i;
                  break;
                }
              }
            }
          }
          if (null !== end) {
            current = end;
          }
          if (null === current) {
            this[_0x4c5b("0x793")](0);
          } else {
            this[_0x4c5b("0x7d3")](this[_0x4c5b("0x71f")][current]["id"]);
          }
        },
        "updateTarget" : function(event, t, value, node, image, index) {
          attributes["setTargetPosition"](value, node);
          if (this[_0x4c5b("0x28f")] !== event) {
            this[_0x4c5b("0x28f")] = event;
            $("#target-nick")[_0x4c5b("0x588")](this[_0x4c5b("0x7a3")](event));
          }
          $(_0x4c5b("0x7d4"))[_0x4c5b("0x304")](_0x4c5b("0x4e3"), index);
          if (t && this["targetSkinURL"] !== t) {
            if (this[_0x4c5b("0x700")][_0x4c5b("0x3fe")](t + _0x4c5b("0x702"))) {
              $(_0x4c5b("0x7d5"))[_0x4c5b("0x5e6")]("src", t);
              this[_0x4c5b("0x7cc")] = t;
            } else {
              $(_0x4c5b("0x7d5"))[_0x4c5b("0x5e6")]("src", _0x4c5b("0x7d6"));
            }
          }
          $(_0x4c5b("0x7d1"))[_0x4c5b("0x1ff")]("[" + this["shortMassFormat"](image) + "]");
          var icons = this[_0x4c5b("0x5b2")](value, node);
          var artistTrack = args[_0x4c5b("0x7d7")] + _0x4c5b("0x7d8") + attributes[_0x4c5b("0x7d7")] + " [" + icons + _0x4c5b("0x7d9");
          if (attributes[_0x4c5b("0x2de")]) {
            artistTrack = artistTrack + (_0x4c5b("0x591") + args[_0x4c5b("0x7da")] + ': <span class="hud-main-color">' + this[_0x4c5b("0x5b3")](image + attributes[_0x4c5b("0x58d")]) + _0x4c5b("0x7b9"));
          }
          $(_0x4c5b("0x7ca"))[_0x4c5b("0x588")](artistTrack);
          if (1 != this[_0x4c5b("0x7c9")]) {
            this[_0x4c5b("0x793")](1);
          }
        },
        "updateQuest" : function() {
          if (this[_0x4c5b("0x566")] && _0x4c5b("0x53e") === this[_0x4c5b("0x560")] && window["MC"] && window["MC"][_0x4c5b("0x7db")]) {
            this[_0x4c5b("0x6b5")]["textContent"] = window["MC"][_0x4c5b("0x7db")]();
          }
        },
        "init" : function() {
          this[_0x4c5b("0x7dc")]();
          this[_0x4c5b("0x7dd")]();
          this[_0x4c5b("0x7de")]();
          this["setMenu"]();
          this[_0x4c5b("0x7df")]();
          if (_0x1ed7f4) {
            _0x1ed7f4[_0x4c5b("0x7e0")]();
          }
          this[_0x4c5b("0x656")]();
          this[_0x4c5b("0x659")]();
          this[_0x4c5b("0x5f7")]();
          this[_0x4c5b("0x7e1")]();
          this[_0x4c5b("0x66b")]();
          this[_0x4c5b("0x66e")]();
          this["setMiniMap"]();
          this[_0x4c5b("0x578")]();
          this[_0x4c5b("0x7e2")]();
          this["setShowChatBox"]();
          this[_0x4c5b("0x54b")]();
          this[_0x4c5b("0x54e")]();
          this["setQuest"]();
          this["displayTime"]();
          this[_0x4c5b("0x5d7")]();
          this[_0x4c5b("0x5d8")]();
          this[_0x4c5b("0x5a4")]();
          this[_0x4c5b("0x7e3")]();
          this[_0x4c5b("0x5d5")]();
          var _0x2fcc15 = this;
          setInterval(function() {
            _0x2fcc15["drawMiniMap"]();
          }, 33);
          setInterval(function() {
            _0x2fcc15["updateTeamPlayers"]();
          }, this[_0x4c5b("0x7e4")]);
        }
      };
      var attrs = { //is the M
        "ws" : null,
        "socket" : null,
        "protocolKey" : null,
        "clientKey" : null,
        "connectionOpened" : false,
        "accessTokenSent" : false,
        "loggedIn" : false,
        "clientVersion" : 30400,
        "clientVersionString" : _0x4c5b("0x7e5"),
        "time" : Date[_0x4c5b("0x53f")](),
        "serverTime" : 0,
        "serverTimeDiff" : 0,
        "loggedInTime" : 0,
        "mapSize" : 14142,
        "mapOffset" : 7071,
        "mapOffsetX" : 0,
        "mapOffsetY" : 0,
        "mapOffsetFixed" : false,
        "mapMinX" : -7071,
        "mapMinY" : -7071,
        "mapMaxX" : 7071,
        "mapMaxY" : 7071,
        "viewMinX" : 0,
        "viewMinY" : 0,
        "viewMaxX" : 0,
        "viewMaxY" : 0,
        "canvasWidth" : 0,
        "canvasHeight" : 0,
        "canvasScale" : 1,
        "indexedCells" : {},
        "cells" : [],
        "removedCells" : [],
        "food" : [],
        "viruses" : [],
        "playerCells" : [],
        "playerCellIDs" : [],
        "ghostCells" : [],
        "playerX" : 0,
        "playerY" : 0,
        "spawnX" : null,
        "spawnY" : null,
        "playerSize" : 0,
        "playerMass" : 0,
        "playerMaxMass" : 0,
        "playerMinMass" : 0,
        "playerScore" : 0,
        "playerSplitCells" : 0,
        "playerColor" : null,
        "playerNick" : "",
        "playerPosition" : 0,
        "leaderboard" : [],
        "biggerSTECellsCache" : [],
        "biggerCellsCache" : [],
        "smallerCellsCache" : [],
        "STECellsCache" : [],
        "STE" : 0,
        "xFour" : 0,
        "xSixTeen" : 0,
        "autoZoom" : false,
        "zoomValue" : .1,
        "viewX" : 0,
        "viewY" : 0,
        "scale" : 1,
        "viewScale" : 1,
        "clientX" : 0,
        "clientY" : 0,
        "cursorX" : 0,
        "cursorY" : 0,
        "targetX" : 0,
        "targetY" : 0,
        "targetDistance" : 0,
        "cRadius" : 10,
        "cAngle" : 4,
        "cAngle1" : 0,
        "cAngle2" : 0,
        "cAlpha" : 1,
        "drawCommander" : 0,
        "battleRoyale" : {
          "state" : 0,
          "players" : 0,
          "startTime" : 0,
          "shrinkTime" : 0,
          "timeLeft" : 0,
          "x" : 0,
          "y" : 0,
          "radius" : 0,
          "targetX" : 0,
          "targetY" : 0,
          "targetRadius" : 0,
          "maxRadius" : 11313,
          "rank" : [],
          "playerRank" : 0,
          "joined" : false
        },
        "play" : false,
        "pause" : false,
        "targeting" : false,
        "removePlayerCell" : false,
        "showCustomSkins" : true,
        "showFood" : true,
        "foodIsHidden" : false,
        "selectBiggestCell" : true,
        "hideSmallBots" : false,
        "pressedKeys" : {},
        "connect" : function(url) {
          console[_0x4c5b("0x244")]("[OGARio] Connecting to game server:", url);
          var bonusTraitModifiers = this;
          this["closeConnection"]();
          this[_0x4c5b("0x7e6")]();
          this["protocolKey"] = null;
          this[_0x4c5b("0x7e7")] = null;
          this[_0x4c5b("0x7e8")] = false;
          this[_0x4c5b("0x7e9")] = false;
          this[_0x4c5b("0x7ea")] = false;
          this["mapOffsetFixed"] = false;
          this[_0x4c5b("0x589")] = [];
          this["ws"] = url;
          this["socket"] = new WebSocket(url);
          this[_0x4c5b("0x754")]["binaryType"] = _0x4c5b("0x75a");
          this[_0x4c5b("0x754")][_0x4c5b("0x75b")] = function() {
            bonusTraitModifiers[_0x4c5b("0x7eb")]();
          };
          this[_0x4c5b("0x754")][_0x4c5b("0x75e")] = function(person) {
            bonusTraitModifiers[_0x4c5b("0x7ec")](person);
          };
          this[_0x4c5b("0x754")][_0x4c5b("0x1a7")] = function(person) {
            bonusTraitModifiers[_0x4c5b("0x7ed")](person);
          };
          this["socket"][_0x4c5b("0x760")] = function(person) {
            bonusTraitModifiers[_0x4c5b("0x7ee")](person);
          };
          m[_0x4c5b("0x7ef")](this["ws"]);
          m[_0x4c5b("0x7f0")]();
          m[_0x4c5b("0x7f1")]();
          m[_0x4c5b("0x7f2")]("");
          if (window[_0x4c5b("0x751")] && window[_0x4c5b("0x751")][_0x4c5b("0x7f3")]) {
            window[_0x4c5b("0x751")][_0x4c5b("0x7f3")]();
          }
        },
        "onOpen" : function() {
          console[_0x4c5b("0x244")](_0x4c5b("0x7f4"));
          this["time"] = Date[_0x4c5b("0x53f")]();
          var artistTrack = this[_0x4c5b("0x75c")](5);
          artistTrack[_0x4c5b("0x767")](0, 254);
          artistTrack["setUint32"](1, 20, true);
          this["sendMessage"](artistTrack);
          (artistTrack = this[_0x4c5b("0x75c")](5))[_0x4c5b("0x767")](0, 255);
          artistTrack["setUint32"](1, this[_0x4c5b("0x7f5")], true);
          this[_0x4c5b("0x7f6")](artistTrack);
          this[_0x4c5b("0x7e9")] = true;
        },
        "onMessage" : function(data) {
          data = new DataView(data[_0x4c5b("0x21")]);
          if (this[_0x4c5b("0x7f7")]) {
            data = this[_0x4c5b("0x7f8")](data, this[_0x4c5b("0x7f7")] ^ this[_0x4c5b("0x7f5")]);
          }
          this[_0x4c5b("0x75f")](data);
        },
        "onError" : function() {
          console[_0x4c5b("0x244")](_0x4c5b("0x7f9"));
          this[_0x4c5b("0x7e6")]();
          if (window[_0x4c5b("0x751")] && window[_0x4c5b("0x751")][_0x4c5b("0x7fa")]) {
            window[_0x4c5b("0x751")][_0x4c5b("0x7fa")]();
          }
        },
        "onClose" : function() {
          console[_0x4c5b("0x244")](_0x4c5b("0x7fb"));
          this[_0x4c5b("0x7e6")]();
          if (window[_0x4c5b("0x751")] && window[_0x4c5b("0x751")][_0x4c5b("0x7fa")]) {
            window[_0x4c5b("0x751")][_0x4c5b("0x7fa")]();
          }
        },
        "closeConnection" : function() {
          if (this["socket"]) {
            this["socket"][_0x4c5b("0x75b")] = null;
            this[_0x4c5b("0x754")][_0x4c5b("0x75e")] = null;
            this["socket"][_0x4c5b("0x1a7")] = null;
            this[_0x4c5b("0x754")][_0x4c5b("0x760")] = null;
            try {
              this[_0x4c5b("0x754")][_0x4c5b("0x198")]();
            } catch (_0x14c418) {
            }
            this[_0x4c5b("0x754")] = null;
            this["ws"] = null;
          }
        },
        "isSocketOpen" : function() {
          return null !== this[_0x4c5b("0x754")] && this[_0x4c5b("0x754")][_0x4c5b("0x765")] === this[_0x4c5b("0x754")][_0x4c5b("0x766")];
        },
        "createView" : function(ol) {
          return new DataView(new ArrayBuffer(ol));
        },
        "sendBuffer" : function(callback) {
          this[_0x4c5b("0x754")][_0x4c5b("0x768")](callback[_0x4c5b("0xe7")]);
        },
        "sendMessage" : function(params) {
          if (this[_0x4c5b("0x7e9")]) {
            if (!this[_0x4c5b("0x7e7")]) {
              return;
            }
            params = this[_0x4c5b("0x7f8")](params, this[_0x4c5b("0x7e7")]);
            this[_0x4c5b("0x7e7")] = this[_0x4c5b("0x7fc")](this[_0x4c5b("0x7e7")]);
          }
          this[_0x4c5b("0x76f")](params);
        },
        "sendAction" : function(data) {
          if (this[_0x4c5b("0x6ed")]()) {
            var readInfo = this[_0x4c5b("0x75c")](1);
            readInfo[_0x4c5b("0x767")](0, data);
            this[_0x4c5b("0x7f6")](readInfo);
          }
        },
        "sendSpectate" : function() {
          this["sendAction"](1);
        },
        "sendFreeSpectate" : function() {
          this["sendAction"](18);
        },
        "sendEject" : function() {
          this[_0x4c5b("0x7fe")]();
          this["sendAction"](21);
        },
        "sendSplit" : function() {
          this[_0x4c5b("0x7fe")]();
          this["sendAction"](17);
        },
        "sendNick" : function(PL$20) {
          this["playerNick"] = PL$20;
          PL$20 = window[_0x4c5b("0x7ff")](window["encodeURIComponent"](PL$20));
          var target = this["createView"](2 + PL$20["length"]);
          var PL$21 = 0;
          for (; PL$21 < PL$20["length"]; PL$21++) {
            target[_0x4c5b("0x767")](PL$21 + 1, PL$20[_0x4c5b("0xa")](PL$21));
          }
          this[_0x4c5b("0x7f6")](target);
        },
        "sendPosition" : function() {
          if (this[_0x4c5b("0x6ed")]() && this[_0x4c5b("0x7e9")] && this[_0x4c5b("0x7e7")]) {
            var relation = this[_0x4c5b("0x800")];
            var relationName = this[_0x4c5b("0x801")];
            if (!this[_0x4c5b("0x2de")] && this[_0x4c5b("0x791")] || this["pause"]) {
              relation = this["targetX"];
              relationName = this["targetY"];
            }
            var _related2 = this[_0x4c5b("0x75c")](13);
            _related2["setUint8"](0, 16);
            _related2["setInt32"](1, relation, true);
            _related2[_0x4c5b("0x780")](5, relationName, true);
            _related2[_0x4c5b("0x77f")](9, this[_0x4c5b("0x7f7")], true);
            this[_0x4c5b("0x7f6")](_related2);
          }
        },
        "sendAccessToken" : function($ionicHistory, mmCoreSplitViewBlock, friend_request) {
          if (!this["accessTokenSent"]) {
            if (!friend_request) {
              friend_request = 102;
            }
            var appendCount = $ionicHistory["length"];
            var count = this[_0x4c5b("0x802")]["length"];
            var data = [friend_request, 8, 1, 18];
            m["writeUint32"](data, appendCount + count + 23);
            data[_0x4c5b("0x7")](8, 10, 82);
            m[_0x4c5b("0x803")](data, appendCount + count + 18);
            data[_0x4c5b("0x7")](8, mmCoreSplitViewBlock, 18, count + 8, 8, 5, 18, count);
            var j = 0;
            for (; j < count; j++) {
              data[_0x4c5b("0x7")](this[_0x4c5b("0x802")][_0x4c5b("0xa")](j));
            }
            data[_0x4c5b("0x7")](24, 0, 32, 0, 26);
            m[_0x4c5b("0x803")](data, appendCount + 3);
            data[_0x4c5b("0x7")](10);
            m[_0x4c5b("0x803")](data, appendCount);
            j = 0;
            for (; j < appendCount; j++) {
              data["push"]($ionicHistory[_0x4c5b("0xa")](j));
            }
            data = new Uint8Array(data);
            var raw_basefont = new DataView(data[_0x4c5b("0xe7")]);
            this[_0x4c5b("0x7f6")](raw_basefont);
          }
        },
        "sendFbToken" : function(text) {
          console[_0x4c5b("0x244")](_0x4c5b("0x804") + text);
          this[_0x4c5b("0x805")](text, 2);
        },
        "sendGplusToken" : function(text) {
          console["log"](_0x4c5b("0x806") + text);
          this[_0x4c5b("0x805")](text, 4);
        },
        "sendRecaptcha" : function(PL$42) {
          var parent = this[_0x4c5b("0x75c")](2 + PL$42["length"]);
          parent["setUint8"](0, 86);
          var PL$41 = 0;
          for (; PL$41 < PL$42["length"]; PL$41++) {
            parent["setUint8"](1 + PL$41, PL$42["charCodeAt"](PL$41));
          }
          parent[_0x4c5b("0x767")](PL$42["length"] + 1, 0);
          this[_0x4c5b("0x7f6")](parent);
        },
        "setClientVersion" : function(name, nextState) {
          this[_0x4c5b("0x7f5")] = name;
          this["clientVersionString"] = nextState;
          console[_0x4c5b("0x244")]("[OGARio] Client version:", name, nextState);
        },
        "generateClientKey" : function(mmCoreLogEnabledDefault, mmCoreLogEnabledConfigName) {
          if (!mmCoreLogEnabledDefault["length"] || !mmCoreLogEnabledConfigName[_0x4c5b("0x8")]) {
            return null;
          }
          var x = null;
          var params = mmCoreLogEnabledDefault[_0x4c5b("0x21e")](/(ws+:\/\/)([^:]*)(:\d+)/)[2];
          var arrayBuffer = params["length"] + mmCoreLogEnabledConfigName[_0x4c5b("0x8")];
          var arr = new Uint8Array(arrayBuffer);
          var i = 0;
          for (; i < params["length"]; i++) {
            arr[i] = params[_0x4c5b("0xa")](i);
          }
          arr[_0x4c5b("0x8d")](mmCoreLogEnabledConfigName, params["length"]);
          var dv = new DataView(arr[_0x4c5b("0xe7")]);
          var maxTextureAvailableSpace = arrayBuffer - 1;
          var orgLen = 0 | 4 + (-4 & maxTextureAvailableSpace - 4);
          var t = 255 ^ maxTextureAvailableSpace;
          var n = 0;
          for (; 3 < maxTextureAvailableSpace;) {
            x = 0 | Math[_0x4c5b("0xe1")](dv[_0x4c5b("0x790")](n, true), 1540483477);
            t = (0 | Math["imul"](x >>> 24 ^ x, 1540483477)) ^ (0 | Math[_0x4c5b("0xe1")](t, 1540483477));
            maxTextureAvailableSpace = maxTextureAvailableSpace - 4;
            n = n + 4;
          }
          switch(maxTextureAvailableSpace) {
            case 3:
              t = arr[orgLen + 2] << 16 ^ t;
              t = arr[orgLen + 1] << 8 ^ t;
              break;
            case 2:
              t = arr[orgLen + 1] << 8 ^ t;
              break;
            case 1:
              break;
            default:
              x = t;
          }
          return x != t && (x = 0 | Math[_0x4c5b("0xe1")](arr[orgLen] ^ t, 1540483477)), x = x ^ (t = x >>> 13), x = 0 | Math[_0x4c5b("0xe1")](x, 1540483477), x = x ^ (t = x >>> 15), console[_0x4c5b("0x244")](_0x4c5b("0x807"), x), x;
        },
        "shiftKey" : function(c) {
          return c = 0 | Math[_0x4c5b("0xe1")](c, 1540483477), c = 114296087 ^ (0 | Math["imul"](c >>> 24 ^ c, 1540483477)), (c = 0 | Math[_0x4c5b("0xe1")](c >>> 13 ^ c, 1540483477)) >>> 15 ^ c;
        },
        "shiftMessage" : function(PL$42, isSlidingUp, $cont) {
          if ($cont) {
            PL$41 = 0;
            for (; PL$41 < PL$42["length"]; PL$41++) {
              PL$42[_0x4c5b("0x7c")](PL$42[_0x4c5b("0x6c")](PL$41) ^ 255 & isSlidingUp >>> 8 * (PL$41 % 4), PL$41);
            }
          } else {
            var PL$41 = 0;
            for (; PL$41 < PL$42["byteLength"]; PL$41++) {
              PL$42[_0x4c5b("0x767")](PL$41, PL$42[_0x4c5b("0x797")](PL$41) ^ 255 & isSlidingUp >>> 8 * (PL$41 % 4));
            }
          }
          return PL$42;
        },
        "decompressMessage" : function(data) {
          var resultFromServer = new Result(data[_0x4c5b("0xe7")]);
          var result = new Result(resultFromServer[_0x4c5b("0x6d")](1));
          return info[_0x4c5b("0x808")](resultFromServer[_0x4c5b("0x1b")](5), result), result;
        },
        "handleMessage" : function(data) {
          var respond = function() {
            var m_key = "";
            var m_buffer;
            for (;;) {
              if (m_buffer = data[_0x4c5b("0x797")](x++), 0 == m_buffer) {
                break;
              }
              m_key = m_key + String[_0x4c5b("0x35")](m_buffer);
            }
            return m_key;
          };
          var x = 0;
          var _0x3bef1a = data["getUint8"](x++);
          switch(54 == _0x3bef1a && (_0x3bef1a = 53), _0x3bef1a) {
            case 5:
              break;
            case 17:
              this[_0x4c5b("0x2bb")] = data[_0x4c5b("0x809")](x, true);
              x = x + 4;
              this[_0x4c5b("0x80a")] = data["getFloat32"](x, true);
              x = x + 4;
              this["scale"] = data[_0x4c5b("0x809")](x, true);
              break;
            case 18:
              if (this[_0x4c5b("0x7f7")]) {
                this[_0x4c5b("0x7f7")] = this[_0x4c5b("0x7fc")](this[_0x4c5b("0x7f7")]);
              }
              console[_0x4c5b("0x244")](18, _0x4c5b("0x7f7"), this[_0x4c5b("0x7f7")]);
              this[_0x4c5b("0x7e6")]();
              break;
            case 32:
              this[_0x4c5b("0x2b3")][_0x4c5b("0x7")](data[_0x4c5b("0x76a")](x, true));
              if (!this[_0x4c5b("0x2de")]) {
                this[_0x4c5b("0x2de")] = true;
                m[_0x4c5b("0x574")]();
                this[_0x4c5b("0x6f9")] = null;
                m[_0x4c5b("0x764")]();
              }
              break;
            case 50:
              this[_0x4c5b("0x80b")] = [];
              var i = data[_0x4c5b("0x76a")](x, true);
              x = x + 4;
              var whichFriend = 0;
              for (; whichFriend < i; whichFriend++) {
                this[_0x4c5b("0x80b")][_0x4c5b("0x7")](data["getFloat32"](x, true));
                x = x + 4;
              }
              methods["drawPieChart"]();
              break;
            case 53:
              if (this["leaderboard"] = [], this[_0x4c5b("0x80c")] = 0, 54 == data[_0x4c5b("0x797")](0)) {
                data[_0x4c5b("0x798")](x, true);
                x = x + 2;
              }
              var _0x39d95d = 0;
              for (; x < data[_0x4c5b("0x8")];) {
                var nickname = "";
                var shouldAdd = 0;
                var isFriend = false;
                _0x39d95d++;
                if (2 & (spaceClick = data[_0x4c5b("0x797")](x++))) {
                  nickname = window["decodeURIComponent"](window[_0x4c5b("0x80d")](respond()));
                }
                if (4 & spaceClick) {
                  shouldAdd = data[_0x4c5b("0x76a")](x, true);
                  x = x + 4;
                }
                if (8 & spaceClick) {
                  nickname = this["playerNick"];
                  shouldAdd = "isPlayer";
                  this[_0x4c5b("0x80c")] = _0x39d95d;
                }
                if (16 & spaceClick) {
                  isFriend = true;
                }
                this[_0x4c5b("0x589")][_0x4c5b("0x7")]({
                  "nick" : nickname,
                  "id" : shouldAdd,
                  "isFriend" : isFriend
                });
              }
              this[_0x4c5b("0x80e")]();
              break;
            case 54:
            case 69:
              var spaceClick = data[_0x4c5b("0x798")](x, true);
              x = x + 2;
              this[_0x4c5b("0x71a")] = [];
              whichFriend = 0;
              for (; whichFriend < spaceClick; whichFriend++) {
                var text_x = data["getUint32"](x, true);
                x = x + 4;
                var p = data[_0x4c5b("0x76a")](x, true);
                x = x + 4;
                var size = data[_0x4c5b("0x76a")](x, true);
                x = x + 5;
                var mdatbox = ~~Math[_0x4c5b("0x80f")](100 * size);
                this[_0x4c5b("0x71a")][_0x4c5b("0x7")]({
                  "x" : text_x,
                  "y" : p,
                  "size" : mdatbox,
                  "mass" : size
                });
              }
              break;
            case 85:
              console[_0x4c5b("0x244")](_0x4c5b("0x810"));
              if (window[_0x4c5b("0x751")] && window[_0x4c5b("0x751")][_0x4c5b("0x811")]) {
                window["master"][_0x4c5b("0x811")]();
              }
              break;
            case 102:
              if (20 > data["byteLength"]) {
                this["loggedIn"] = false;
                if (window[_0x4c5b("0x812")]) {
                  window[_0x4c5b("0x812")]();
                }
              }
              break;
            case 103:
              this[_0x4c5b("0x7e8")] = true;
              break;
            case 114:
            case 161:
              break;
            case 176:
              this[_0x4c5b("0x813")][_0x4c5b("0x814")] = data["getUint32"](x, true);
              break;
            case 177:
              this["battleRoyale"][_0x4c5b("0x815")] = true;
              break;
            case 178:
              this[_0x4c5b("0x813")][_0x4c5b("0x816")] = data["getUint16"](x, true);
              x = x + 2;
              spaceClick = data["getUint16"](x, true);
              x = x + 2;
              if (!spaceClick) {
                this[_0x4c5b("0x813")]["state"] = 0;
                this["battleRoyale"][_0x4c5b("0x815")] = false;
              }
              if (3 & spaceClick) {
                this[_0x4c5b("0x813")][_0x4c5b("0xfb")] = data[_0x4c5b("0x797")](x++);
                this["battleRoyale"]["x"] = data[_0x4c5b("0x790")](x, true);
                x = x + 4;
                this[_0x4c5b("0x813")]["y"] = data[_0x4c5b("0x790")](x, true);
                x = x + 4;
                this[_0x4c5b("0x813")]["radius"] = data[_0x4c5b("0x76a")](x, true);
                x = x + 4;
                this[_0x4c5b("0x813")][_0x4c5b("0x817")] = 1E3 * data[_0x4c5b("0x76a")](x, true);
                x = x + 4;
                if (this["battleRoyale"]["shrinkTime"]) {
                  this[_0x4c5b("0x813")][_0x4c5b("0x818")] = ~~((this[_0x4c5b("0x813")][_0x4c5b("0x817")] - Date[_0x4c5b("0x53f")]() + this[_0x4c5b("0x819")]) / 1E3);
                  if (0 > this[_0x4c5b("0x813")]["timeLeft"]) {
                    this[_0x4c5b("0x813")][_0x4c5b("0x818")] = 0;
                  }
                }
              }
              if (2 & spaceClick) {
                this[_0x4c5b("0x813")]["targetX"] = data[_0x4c5b("0x790")](x, true);
                x = x + 4;
                this[_0x4c5b("0x813")]["targetY"] = data[_0x4c5b("0x790")](x, true);
                x = x + 4;
                this[_0x4c5b("0x813")][_0x4c5b("0x81a")] = data[_0x4c5b("0x76a")](x, true);
              }
              break;
            case 179:
              spaceClick = data[_0x4c5b("0x797")](x);
              window["decodeURIComponent"](window[_0x4c5b("0x80d")](respond()));
              if (!spaceClick) {
                window["decodeURIComponent"](window[_0x4c5b("0x80d")](respond()));
              }
              break;
            case 180:
              this[_0x4c5b("0x813")][_0x4c5b("0x815")] = false;
              this[_0x4c5b("0x813")][_0x4c5b("0x81b")] = [];
              this["battleRoyale"][_0x4c5b("0x81c")] = data[_0x4c5b("0x76a")](x, true);
              x = x + 8;
              text_x = data[_0x4c5b("0x798")](x, true);
              x = x + 2;
              whichFriend = 0;
              for (; whichFriend < text_x; whichFriend++) {
                var sel_construtor_name = window["decodeURIComponent"](window[_0x4c5b("0x80d")](respond()));
                p = data["getUint32"](x, true);
                x = x + 4;
                this[_0x4c5b("0x813")][_0x4c5b("0x81b")]["push"]({
                  "place" : p,
                  "name" : sel_construtor_name
                });
              }
              break;
            case 226:
              size = data[_0x4c5b("0x798")](1, true);
              (data = this[_0x4c5b("0x75c")](3))["setUint8"](0, 227);
              data[_0x4c5b("0x75d")](1, size);
              this["sendMessage"](data);
              break;
            case 241:
              this["protocolKey"] = data[_0x4c5b("0x76a")](x, true);
              console[_0x4c5b("0x244")](_0x4c5b("0x81d"), this[_0x4c5b("0x7f7")]);
              mdatbox = new Uint8Array(data[_0x4c5b("0xe7")], x = x + 4);
              this[_0x4c5b("0x7e7")] = this[_0x4c5b("0x81e")](this["ws"], mdatbox);
              if (window["master"] && window[_0x4c5b("0x751")][_0x4c5b("0x81f")]) {
                window[_0x4c5b("0x751")][_0x4c5b("0x81f")]();
              }
              break;
            case 242:
              this[_0x4c5b("0x820")] = 1E3 * data[_0x4c5b("0x76a")](x, true);
              this[_0x4c5b("0x819")] = Date[_0x4c5b("0x53f")]() - this["serverTime"];
              break;
            case 255:
              this["handleSubmessage"](data);
              break;
            default:
              console[_0x4c5b("0x244")](_0x4c5b("0x821"), data[_0x4c5b("0x797")](0));
          }
        },
        "handleSubmessage" : function(graphic) {
          var sector = 0;
          switch((graphic = this[_0x4c5b("0x822")](graphic))["readUInt8"](sector++)) {
            case 16:
              this[_0x4c5b("0x823")](graphic, sector);
              break;
            case 64:
              this["viewMinX"] = graphic[_0x4c5b("0x7a")](sector);
              sector = sector + 8;
              this[_0x4c5b("0x824")] = graphic[_0x4c5b("0x7a")](sector);
              sector = sector + 8;
              this[_0x4c5b("0x825")] = graphic[_0x4c5b("0x7a")](sector);
              sector = sector + 8;
              this["viewMaxY"] = graphic[_0x4c5b("0x7a")](sector);
              this[_0x4c5b("0x826")](this[_0x4c5b("0x827")], this[_0x4c5b("0x824")], this["viewMaxX"], this["viewMaxY"]);
              break;
            default:
              console[_0x4c5b("0x244")](_0x4c5b("0x828"), graphic[_0x4c5b("0x6c")](0));
          }
        },
        "handleLeaderboard" : function() {
          var id = "";
          var res = "";
          var i = 0;
          var totext;
          for (; i < this[_0x4c5b("0x589")]["length"] && settings[_0x4c5b("0x627")] != i; i++) {
            totext = _0x4c5b("0x829");
            if (_0x4c5b("0x82a") === this[_0x4c5b("0x589")][i]["id"]) {
              totext = _0x4c5b("0x82b");
            } else {
              if (names[_0x4c5b("0x5df")]["length"] && 0 == this[_0x4c5b("0x589")][i][_0x4c5b("0x28e")][_0x4c5b("0x2d")](names[_0x4c5b("0x5df")])) {
                totext = _0x4c5b("0x82c");
              }
            }
            id = id + (totext + (i + 1) + ". " + m[_0x4c5b("0x7a3")](this["leaderboard"][i][_0x4c5b("0x28e")]) + _0x4c5b("0x7b9"));
          }
          if (this["playerPosition"] > settings[_0x4c5b("0x627")] && (id = id + (_0x4c5b("0x82b") + this["playerPosition"] + ". " + m[_0x4c5b("0x7a3")](this[_0x4c5b("0x82d")]) + _0x4c5b("0x7b9"))), settings[_0x4c5b("0x61c")]) {
            var f = 0;
            for (; f < this["ghostCells"]["length"] && f != i; f++) {
              res = res + (_0x4c5b("0x82e") + m[_0x4c5b("0x5b2")](this[_0x4c5b("0x71a")][f]["x"], this["ghostCells"][f]["y"]) + '</span><span id="lbmass" class=""> ' + m[_0x4c5b("0x5b3")](this[_0x4c5b("0x71a")][f][_0x4c5b("0x291")]) + _0x4c5b("0x82f"));
            }
          }
          m[_0x4c5b("0x7f2")](id, res);
        },
        "flushCellsData" : function() {
          this[_0x4c5b("0x2b6")] = {};
          this[_0x4c5b("0x2ad")] = [];
          this[_0x4c5b("0x2b2")] = [];
          this[_0x4c5b("0x2b3")] = [];
          this[_0x4c5b("0x71a")] = [];
          this[_0x4c5b("0x2ae")] = [];
          this[_0x4c5b("0x2b0")] = [];
        },
        "setMapOffset" : function(userId, courseId, state, participant) {
          if (14E3 < state - userId && 14E3 < participant - courseId) {
            this[_0x4c5b("0x712")] = this[_0x4c5b("0x708")] - state;
            this[_0x4c5b("0x70d")] = this[_0x4c5b("0x708")] - participant;
            this[_0x4c5b("0x830")] = ~~(-this[_0x4c5b("0x708")] - this[_0x4c5b("0x712")]);
            this[_0x4c5b("0x831")] = ~~(-this[_0x4c5b("0x708")] - this[_0x4c5b("0x70d")]);
            this["mapMaxX"] = ~~(this[_0x4c5b("0x708")] - this[_0x4c5b("0x712")]);
            this[_0x4c5b("0x832")] = ~~(this[_0x4c5b("0x708")] - this[_0x4c5b("0x70d")]);
            if (!this[_0x4c5b("0x70c")]) {
              this[_0x4c5b("0x2bb")] = (state + userId) / 2;
              this[_0x4c5b("0x80a")] = (participant + courseId) / 2;
            }
            this["mapOffsetFixed"] = true;
            console[_0x4c5b("0x244")]("[OGARio] Map offset fixed (x, y):", this["mapOffsetX"], this[_0x4c5b("0x70d")]);
          }
        },
        "isInView" : function(position, start, offset) {
          var padding = this[_0x4c5b("0x2ba")] / 2 / this["scale"];
          var paddingRight = this[_0x4c5b("0x2bc")] / 2 / this["scale"];
          return !(position + offset < this[_0x4c5b("0x2bb")] - padding || start + offset < this[_0x4c5b("0x80a")] - paddingRight || position - offset > this["viewX"] + padding || start - offset > this[_0x4c5b("0x80a")] + paddingRight);
        },
        "updateCells" : function(validator, value) {
          var doUpdate = function() {
            var result = "";
            var chunkCursor;
            for (;;) {
              if (chunkCursor = validator[_0x4c5b("0x6c")](value++), 0 == chunkCursor) {
                break;
              }
              result = result + String[_0x4c5b("0x35")](chunkCursor);
            }
            return result;
          };
          this[_0x4c5b("0x2a6")] = Date[_0x4c5b("0x53f")]();
          this["removePlayerCell"] = false;
          var i = validator["readUInt16LE"](value);
          value = value + 2;
          var whichFriend = 0;
          for (; whichFriend < i; whichFriend++) {
            var cameraPosition = this[_0x4c5b("0x2b6")][validator[_0x4c5b("0x6d")](value)];
            var lightPosition = this[_0x4c5b("0x2b6")][validator["readUInt32LE"](value + 4)];
            value = value + 8;
            if (cameraPosition && lightPosition) {
              lightPosition["targetX"] = cameraPosition["x"];
              lightPosition["targetY"] = cameraPosition["y"];
              lightPosition["targetSize"] = lightPosition["size"];
              lightPosition[_0x4c5b("0x2a6")] = this[_0x4c5b("0x2a6")];
              lightPosition[_0x4c5b("0x2ac")]();
            }
          }
          whichFriend = 0;
          for (;;) {
            var i = validator[_0x4c5b("0x6d")](value);
            if (value = value + 4, 0 == i) {
              break;
            }
            var j = validator[_0x4c5b("0x75")](value);
            value = value + 4;
            var x = validator[_0x4c5b("0x75")](value);
            value = value + 4;
            var y = validator["readUInt16LE"](value);
            value = value + 2;
            var TAG_CODE_MASK = validator[_0x4c5b("0x6c")](value++);
            var FIVE_BIT_LETTER_MASK = 0;
            if (128 & TAG_CODE_MASK) {
              FIVE_BIT_LETTER_MASK = validator[_0x4c5b("0x6c")](value++);
            }
            var gridIdx = null;
            var ptCoord = null;
            var fun = "";
            if (2 & TAG_CODE_MASK) {
              var _0x5c035d = validator[_0x4c5b("0x6c")](value++);
              var _0x4e3f1f = validator[_0x4c5b("0x6c")](value++);
              var _0x29f5f7 = validator[_0x4c5b("0x6c")](value++);
              gridIdx = this[_0x4c5b("0x833")](~~(.9 * _0x5c035d), ~~(.9 * _0x4e3f1f), ~~(.9 * _0x29f5f7));
            }
            if (4 & TAG_CODE_MASK) {
              ptCoord = doUpdate();
            }
            if (8 & TAG_CODE_MASK) {
              fun = window[_0x4c5b("0x834")](window[_0x4c5b("0x80d")](doUpdate()));
            }
            var blockTagCode = 1 & TAG_CODE_MASK;
            var thirdLetter = 1 & FIVE_BIT_LETTER_MASK;
            var point = null;
            if (this[_0x4c5b("0x2b6")][_0x4c5b("0x3fe")](i)) {
              point = this[_0x4c5b("0x2b6")][i];
              if (gridIdx) {
                point["color"] = gridIdx;
              }
            } else {
              (point = new setup(i, j, x, y, gridIdx, thirdLetter, blockTagCode, false, settings["shortMass"], settings["virMassShots"]))[_0x4c5b("0x2a6")] = this[_0x4c5b("0x2a6")];
              if (thirdLetter) {
                this[_0x4c5b("0x2ae")][_0x4c5b("0x7")](point);
              } else {
                if (blockTagCode && settings[_0x4c5b("0x2af")]) {
                  this[_0x4c5b("0x2b0")][_0x4c5b("0x7")](point);
                }
                this[_0x4c5b("0x2ad")][_0x4c5b("0x7")](point);
                if (-1 != this["playerCellIDs"][_0x4c5b("0x2d")](i) && -1 == this[_0x4c5b("0x2b2")][_0x4c5b("0x2d")](point)) {
                  point[_0x4c5b("0x29d")] = true;
                  this[_0x4c5b("0x6f9")] = gridIdx;
                  this[_0x4c5b("0x2b2")]["push"](point);
                }
              }
              this["indexedCells"][i] = point;
            }
            if (point[_0x4c5b("0x29d")]) {
              fun = this[_0x4c5b("0x82d")];
            }
            if (fun) {
              point[_0x4c5b("0x28f")] = fun;
            }
            point["targetX"] = j;
            point["targetY"] = x;
            point[_0x4c5b("0x28c")] = y;
            point[_0x4c5b("0x29c")] = thirdLetter;
            point[_0x4c5b("0x2a9")] = blockTagCode;
            if (ptCoord) {
              point[_0x4c5b("0x2a7")] = ptCoord;
            }
            if (4 & FIVE_BIT_LETTER_MASK) {
              validator[_0x4c5b("0x6d")](value);
              value = value + 4;
            }
          }
          i = validator[_0x4c5b("0x835")](value);
          value = value + 2;
          whichFriend = 0;
          for (; whichFriend < i; whichFriend++) {
            i = validator[_0x4c5b("0x6d")](value);
            value = value + 4;
            if (point = this[_0x4c5b("0x2b6")][i]) {
              point["removeCell"]();
            }
          }
          if (this[_0x4c5b("0x2b1")] && !this["playerCells"]["length"]) {
            this["play"] = false;
            m["onPlayerDeath"]();
            m["showMenu"](300);
          }
        },
        "color2Hex" : function(canCreateDiscussions) {
          var _0x4ec2e4 = canCreateDiscussions[_0x4c5b("0x25")](16);
          return 1 == _0x4ec2e4["length"] ? "0" + _0x4ec2e4 : _0x4ec2e4;
        },
        "rgb2Hex" : function(r, g, b) {
          return "#" + this["color2Hex"](r) + this[_0x4c5b("0x836")](g) + this[_0x4c5b("0x836")](b);
        },
        "sortCells" : function() {
          this["cells"][_0x4c5b("0x796")](function(sizes, attributes) {
            return sizes["size"] == attributes["size"] ? sizes["id"] - attributes["id"] : sizes["size"] - attributes["size"];
          });
        },
        "calculatePlayerMassAndPosition" : function() {
          var s = 0;
          var _0x35c48f = 0;
          var i = 0;
          var x0 = 0;
          var d = this[_0x4c5b("0x2b2")]["length"];
          var df = 0;
          var f;
          for (; df < d; df++) {
            f = this["playerCells"][df];
            s = s + f["size"];
            _0x35c48f = _0x35c48f + f["targetSize"] * f["targetSize"];
            i = i + f["x"] / d;
            x0 = x0 + f["y"] / d;
          }
          this["viewX"] = i;
          this[_0x4c5b("0x80a")] = x0;
          this[_0x4c5b("0x837")] = s;
          this[_0x4c5b("0x58d")] = ~~(_0x35c48f / 100);
          this[_0x4c5b("0x838")]();
        },
        "recalculatePlayerMass" : function() {
          if (this[_0x4c5b("0x592")] = Math[_0x4c5b("0x2c3")](this["playerScore"], this["playerMass"]), settings[_0x4c5b("0x2dd")] || settings[_0x4c5b("0x553")] || settings[_0x4c5b("0x2f0")] || settings[_0x4c5b("0x2ed")] || settings[_0x4c5b("0x597")]) {
            var data = this["playerCells"];
            var row = data["length"];
            data["sort"](function(cell, coordinates) {
              return cell["size"] == coordinates["size"] ? cell["id"] - coordinates["id"] : cell["size"] - coordinates["size"];
            });
            this["playerMinMass"] = ~~(data[0]["size"] * data[0]["size"] / 100);
            this[_0x4c5b("0x72a")] = ~~(data[row - 1]["size"] * data[row - 1]["size"] / 100);
            this[_0x4c5b("0x59b")] = row;
          }
          if (settings["showStatsSTE"]) {
            var _0x2fcc15 = this[_0x4c5b("0x549")] ? this[_0x4c5b("0x72a")] : this[_0x4c5b("0x72b")];
            this[_0x4c5b("0x598")] = 35 < _0x2fcc15 ? ~~(_0x2fcc15 * (1E3 > _0x2fcc15 ? .35 : .38)) : null;
          }
        },
        "compareCells" : function() {
          if (this[_0x4c5b("0x2de")] && (settings[_0x4c5b("0x2f0")] || settings[_0x4c5b("0x2ed")] || settings[_0x4c5b("0x553")])) {
            if (settings[_0x4c5b("0x2ed")] || settings["splitRange"]) {
              this[_0x4c5b("0x839")] = [];
              this[_0x4c5b("0x83a")] = [];
              this["smallerCellsCache"] = [];
              this[_0x4c5b("0x83b")] = [];
            }
            var method = 0;
            var args;
            for (; method < this[_0x4c5b("0x2ad")]["length"]; method++) {
              if (args = this[_0x4c5b("0x2ad")][method], !args["isVirus"]) {
                var v = ~~(args["size"] * args["size"] / 100);
                var count = this[_0x4c5b("0x549")] ? this["playerMaxMass"] : this["playerMinMass"];
                var i = v / count;
                var nrCallbackWrap = 1E3 > count ? .35 : .38;
                if (settings[_0x4c5b("0x2f0")] && !settings[_0x4c5b("0x2ed")]) {
                  args[_0x4c5b("0x28b")] = this[_0x4c5b("0x83c")](args[_0x4c5b("0x29d")], i, nrCallbackWrap);
                }
                if (!args["isPlayerCell"] && (settings[_0x4c5b("0x553")] || settings[_0x4c5b("0x2ed")])) {
                  this[_0x4c5b("0x83d")](args["x"], args["y"], args["size"], i, nrCallbackWrap);
                }
              }
            }
          }
        },
        "cacheCells" : function(xRel, yRel, requestSize, _num1, _num2) {
          return 2.5 <= _num1 ? void this["biggerSTECellsCache"][_0x4c5b("0x7")]({
            "x" : xRel,
            "y" : yRel,
            "size" : requestSize
          }) : 1.25 <= _num1 ? void this[_0x4c5b("0x83a")][_0x4c5b("0x7")]({
            "x" : xRel,
            "y" : yRel,
            "size" : requestSize
          }) : 1.25 > _num1 && .75 < _num1 ? void 0 : _num1 > _num2 ? void this[_0x4c5b("0x83e")][_0x4c5b("0x7")]({
            "x" : xRel,
            "y" : yRel,
            "size" : requestSize
          }) : void this[_0x4c5b("0x83b")][_0x4c5b("0x7")]({
            "x" : xRel,
            "y" : yRel,
            "size" : requestSize
          });
        },
        "setCellOppColor" : function(data, _num1, _num2) {
          return data ? names["color"] : 11 < _num1 ? _0x4c5b("0x83f") : 2.5 <= _num1 ? _0x4c5b("0x840") : 1.25 <= _num1 ? _0x4c5b("0x841") : 1.25 > _num1 && .75 < _num1 ? _0x4c5b("0x72c") : _num1 > _num2 ? "#00C8FF" : _0x4c5b("0x842");
        },
        "getCursorPosition" : function() {
          this[_0x4c5b("0x800")] = (this[_0x4c5b("0x843")] - this["canvasWidth"] / 2) / this[_0x4c5b("0x2c9")] + this[_0x4c5b("0x2bb")];
          this[_0x4c5b("0x801")] = (this[_0x4c5b("0x844")] - this[_0x4c5b("0x2bc")] / 2) / this["viewScale"] + this[_0x4c5b("0x80a")];
        },
        "setZoom" : function(repaintEverything) {
          repaintEverything[_0x4c5b("0x4da")]();
          this[_0x4c5b("0x56c")] *= Math["pow"](settings[_0x4c5b("0x625")], repaintEverything[_0x4c5b("0x845")] / -120 || repaintEverything[_0x4c5b("0x846")] || 0);
          if (this["zoomValue"] > 4 / this[_0x4c5b("0x2c9")]) {
            this["zoomValue"] = 4 / this[_0x4c5b("0x2c9")];
          }
        },
        "setTargetPosition" : function(value, index) {
          this["targetX"] = value - this[_0x4c5b("0x712")];
          this["targetY"] = index - this["mapOffsetY"];
          this[_0x4c5b("0x7d7")] = Math[_0x4c5b("0x2bf")](Math[_0x4c5b("0x80f")](Math[_0x4c5b("0x70")](this[_0x4c5b("0x541")] - this["targetX"], 2) + Math[_0x4c5b("0x70")](this[_0x4c5b("0x542")] - this["targetY"], 2)));
        },
        "resetTargetPosition" : function() {
          this["targetX"] = this[_0x4c5b("0x541")];
          this["targetY"] = this[_0x4c5b("0x542")];
        },
        "setKeys" : function() {
          var coupling = this;
          document[_0x4c5b("0x30a")] = function(parentNode) {
            var parentOfParent = parentNode[_0x4c5b("0x847")];
            if (!coupling[_0x4c5b("0x848")][parentOfParent]) {
              if (13 === parentOfParent) {
                coupling[_0x4c5b("0x849")]("");
              } else {
                if (32 === parentOfParent) {
                  coupling[_0x4c5b("0x84a")]();
                } else {
                  if (81 === parentOfParent) {
                    coupling[_0x4c5b("0x84b")]();
                  } else {
                    if (83 === parentOfParent) {
                      coupling["sendSpectate"]();
                    } else {
                      if (87 === parentOfParent) {
                        coupling[_0x4c5b("0x84c")]();
                      } else {
                        void 0;
                      }
                    }
                  }
                }
              }
            }
          };
          document[_0x4c5b("0x84d")] = function(res) {
            coupling["pressedKeys"][res[_0x4c5b("0x847")]] = false;
          };
        },
        "init" : function() {
          var bonusTraitModifiers = this;
          if (/firefox/i[_0x4c5b("0x22e")](navigator[_0x4c5b("0x84e")])) {
            document[_0x4c5b("0x84f")]("DOMMouseScroll", function(person) {
              bonusTraitModifiers[_0x4c5b("0x850")](person);
            }, false);
          } else {
            document["body"][_0x4c5b("0x851")] = function(person) {
              bonusTraitModifiers[_0x4c5b("0x850")](person);
            };
          }
          setInterval(function() {
            bonusTraitModifiers[_0x4c5b("0x7fe")]();
          }, 40);
          if (window[_0x4c5b("0x751")] && window[_0x4c5b("0x751")][_0x4c5b("0x7f5")]) {
            this[_0x4c5b("0x852")](window[_0x4c5b("0x751")][_0x4c5b("0x7f5")], window[_0x4c5b("0x751")][_0x4c5b("0x802")]);
          }
        }
      };
      window["sendAction"] = function(a) {
        attrs["sendAction"](a);
      };
      var methods = { //is the ogarfooddrawer
        "canvas" : null,
        "ctx" : null,
        "canvasWidth" : 0,
        "canvasHeight" : 0,
        "camX" : 0,
        "camY" : 0,
        "scale" : 1,
        "fpsLastRequest" : null,
        "renderedFrames" : 0,
        "fps" : 0,
        "pi2" : 2 * Math["PI"],
        "battleAreaMap" : null,
        "battleAreaMapCtx" : null,
        "pieChart" : null,
        "pellet" : null,
        "indicator" : null,
        "setCanvas" : function() {
          this["canvas"] = document["getElementById"]("canvas");
          this["ctx"] = this["canvas"]["getContext"]("2d");
          this["canvas"]["onmousemove"] = function(new_attrs) {
            attrs[_0x4c5b("0x843")] = new_attrs[_0x4c5b("0x843")];
            attrs[_0x4c5b("0x844")] = new_attrs[_0x4c5b("0x844")];
            attrs["getCursorPosition"]();
          };
        },
        "resizeCanvas" : function() {
          this[_0x4c5b("0x2ba")] = window[_0x4c5b("0x300")];
          this[_0x4c5b("0x2bc")] = window[_0x4c5b("0x301")];
          this["canvas"]["width"] = this["canvasWidth"];
          this["canvas"]["height"] = this[_0x4c5b("0x2bc")];
          attrs[_0x4c5b("0x2ba")] = this[_0x4c5b("0x2ba")];
          attrs["canvasHeight"] = this["canvasHeight"];
          this[_0x4c5b("0x854")]();
        },
        "setView" : function() {
          this["setScale"]();
          if (attrs[_0x4c5b("0x2b2")]["length"]) {
            attrs[_0x4c5b("0x855")]();
            this[_0x4c5b("0x856")] += (attrs[_0x4c5b("0x2bb")] - this[_0x4c5b("0x856")]) / settings[_0x4c5b("0x857")];
            this["camY"] += (attrs[_0x4c5b("0x80a")] - this[_0x4c5b("0x858")]) / settings["cameraSpeed"];
          } else {
            this["camX"] = (29 * this["camX"] + attrs[_0x4c5b("0x2bb")]) / 30;
            this[_0x4c5b("0x858")] = (29 * this[_0x4c5b("0x858")] + attrs[_0x4c5b("0x80a")]) / 30;
          }
          attrs["playerX"] = this[_0x4c5b("0x856")];
          attrs[_0x4c5b("0x542")] = this[_0x4c5b("0x858")];
        },
        "setScale" : function() {
          return attrs[_0x4c5b("0x569")] ? void(this["scale"] = attrs[_0x4c5b("0x2de")] ? (9 * this["scale"] + Math[_0x4c5b("0x70")](Math["min"](64 / attrs[_0x4c5b("0x837")], 1), .4) * this[_0x4c5b("0x859")]()) / 10 : (9 * this["scale"] + attrs["scale"] * this[_0x4c5b("0x859")]()) / 10, attrs["viewScale"] = this["scale"]) : (this["scale"] = (9 * this["scale"] + this["getZoom"]()) / 10, void(attrs[_0x4c5b("0x2c9")] = this["scale"]));
        },
        "getZoom" : function() {
          return Math[_0x4c5b("0x2c3")](this["canvasWidth"] / 1080, this["canvasHeight"] / 1920) * attrs[_0x4c5b("0x56c")];
        },
        "renderFrame" : function() {
          attrs[_0x4c5b("0x2a6")] = Date[_0x4c5b("0x53f")]();
          i = 0;
          for (; i < attrs[_0x4c5b("0x2ad")]["length"]; i++) {
            attrs["cells"][i][_0x4c5b("0x2b7")]();
          }
          if (this[_0x4c5b("0x85a")](), attrs[_0x4c5b("0x85b")](), attrs[_0x4c5b("0x85c")](), attrs[_0x4c5b("0x85d")](), this["ctx"][_0x4c5b("0x70f")](0, 0, this[_0x4c5b("0x2ba")], this["canvasHeight"]), settings[_0x4c5b("0x55d")] && this[_0x4c5b("0x85e")](this["ctx"], this[_0x4c5b("0x2ba")], this[_0x4c5b("0x2bc")], this["scale"], this[_0x4c5b("0x856")], this[_0x4c5b("0x858")]), this["ctx"]["save"](), this["ctx"]["translate"](this[_0x4c5b("0x2ba")] / 
          2, this[_0x4c5b("0x2bc")] / 2), this["ctx"]["scale"](this["scale"], this["scale"]), this["ctx"]["translate"](-this[_0x4c5b("0x856")], -this[_0x4c5b("0x858")]), settings["showBgSectors"] && this["drawSectors"](this["ctx"], attrs[_0x4c5b("0x70c")], data[_0x4c5b("0x70b")], data[_0x4c5b("0x70a")], attrs[_0x4c5b("0x830")], attrs["mapMinY"], attrs[_0x4c5b("0x85f")], attrs[_0x4c5b("0x832")], data[_0x4c5b("0x47c")], data[_0x4c5b("0x860")], 
          data[_0x4c5b("0x48f")], true), ":battleroyale" === attrs[_0x4c5b("0x560")] && this[_0x4c5b("0x861")](this["ctx"]), settings[_0x4c5b("0x60f")]) {
            var CHANGE = data[_0x4c5b("0x48e")] / 2;
            this["drawMapBorders"](this["ctx"], attrs[_0x4c5b("0x70c")], attrs["mapMinX"] - CHANGE, attrs[_0x4c5b("0x831")] - CHANGE, attrs[_0x4c5b("0x85f")] + CHANGE, attrs[_0x4c5b("0x832")] + CHANGE, data[_0x4c5b("0x47a")], data["bordersWidth"]);
          }
          this["drawCommander"]();
          if (settings[_0x4c5b("0x2af")]) {
            this[_0x4c5b("0x863")](this["ctx"], attrs[_0x4c5b("0x2b0")]);
          }
          this[_0x4c5b("0x864")]();
          if (attrs[_0x4c5b("0x2de")]) {
            if (settings[_0x4c5b("0x553")]) {
              this["drawSplitRange"](this["ctx"], attrs[_0x4c5b("0x839")], attrs[_0x4c5b("0x2b2")], attrs[_0x4c5b("0x549")]);
            }
            if (settings[_0x4c5b("0x2ed")]) {
              this["drawOppRings"](this["ctx"], this["scale"], attrs["biggerSTECellsCache"], attrs[_0x4c5b("0x83a")], attrs[_0x4c5b("0x83e")], attrs["STECellsCache"]);
            }
            if (settings[_0x4c5b("0x616")]) {
              this[_0x4c5b("0x865")](this["ctx"], attrs[_0x4c5b("0x2b2")], attrs[_0x4c5b("0x800")], attrs[_0x4c5b("0x801")]);
            }
          }
          this[_0x4c5b("0x866")]();
          var i = 0;
          for (; i < attrs["removedCells"]["length"]; i++) {
            attrs[_0x4c5b("0x2b5")][i][_0x4c5b("0x2d4")](this["ctx"], true);
          }
          i = 0;
          for (; i < attrs["cells"]["length"]; i++) {
            attrs[_0x4c5b("0x2ad")][i][_0x4c5b("0x2d4")](this["ctx"]);
          }
          this["ctx"]["restore"]();
          if (":teams" === attrs[_0x4c5b("0x560")] && this[_0x4c5b("0x80b")] && this[_0x4c5b("0x80b")]["width"]) {
            this["ctx"]["drawImage"](this[_0x4c5b("0x80b")], this[_0x4c5b("0x2ba")] - this[_0x4c5b("0x80b")]["width"] - 10, 10);
          }
        },
        "drawGrid" : function(x, y, w, h, counteraxis, subplot) {
          var ratio = y / h;
          var r = w / h;
          var j = (ratio / 2 - counteraxis) % 50;
          var d = (r / 2 - subplot) % 50;
          x["strokeStyle"] = data[_0x4c5b("0x47c")];
          x["globalAlpha"] = 1 * h;
          x["beginPath"]();
          for (; j < ratio; j = j + 50) {
            x[_0x4c5b("0x71d")](j * h - .5, 0);
            x[_0x4c5b("0x71e")](j * h - .5, r * h);
          }
          for (; d < r; d = d + 50) {
            x[_0x4c5b("0x71d")](0, d * h - .5);
            x[_0x4c5b("0x71e")](ratio * h, d * h - .5);
          }
          x["stroke"]();
          x["globalAlpha"] = 1;
        },
        "drawSectors" : function(result, expr, steps, num, start, startAngle, to, what, o, f, val, index) {
          if (expr || !index) {
            var p = ~~((to - start) / steps);
            var angle = ~~((what - startAngle) / num);
            var r = 0;
            var edeeef = 0;
            if (result["strokeStyle"] = o, result["fillStyle"] = f, result["lineWidth"] = val, index || !index && settings[_0x4c5b("0x5d3")]) {
              result["beginPath"]();
              var i = 0;
              for (; i < steps + 1; i++) {
                r = start + p * i;
                result[_0x4c5b("0x71d")](i == steps ? to : r, startAngle);
                result["lineTo"](i == steps ? to : r, what);
              }
              i = 0;
              for (; i < num + 1; i++) {
                edeeef = startAngle + angle * i;
                result[_0x4c5b("0x71d")](start - val / 2, i == num ? what : edeeef);
                result[_0x4c5b("0x71e")](to + val / 2, i == num ? what : edeeef);
              }
              result["stroke"]();
            }
            result["font"] = index ? data[_0x4c5b("0x867")] + " " + data[_0x4c5b("0x48a")] + "px " + data[_0x4c5b("0x868")] : data[_0x4c5b("0x713")] + " " + ~~(.4 * angle) + "px " + data[_0x4c5b("0x715")];
            result[_0x4c5b("0x78b")] = _0x4c5b("0x78c");
            result[_0x4c5b("0x869")] = _0x4c5b("0x86a");
            i = 0;
            for (; i < num; i++) {
              var rotateAngle = 0;
              var radixToPower;
              for (; rotateAngle < steps; rotateAngle++) {
                radixToPower = String[_0x4c5b("0x35")](65 + i) + (rotateAngle + 1);
                r = ~~(start + p / 2 + rotateAngle * p);
                edeeef = ~~(startAngle + angle / 2 + i * angle);
                result["fillText"](radixToPower, r, edeeef);
              }
            }
          }
        },
        "drawMapBorders" : function(ctx, macros, text, x1, x0, y0, radius, canvas) {
          if (macros) {
            ctx["strokeStyle"] = radius;
            ctx["lineWidth"] = canvas;
            ctx["beginPath"]();
            ctx[_0x4c5b("0x71d")](text, x1);
            ctx["lineTo"](x0, x1);
            ctx[_0x4c5b("0x71e")](x0, y0);
            ctx[_0x4c5b("0x71e")](text, y0);
            if (settings[_0x4c5b("0x604")]) {
              ctx[_0x4c5b("0x2e3")] = data[_0x4c5b("0x48d")];
              ctx["shadowColor"] = data[_0x4c5b("0x47b")];
            } else {
              _0x4c5b("0x86b");
            }
            ctx[_0x4c5b("0x2da")]();
            ctx["stroke"]();
          }
          if (settings[_0x4c5b("0x604")]) {
            ctx[_0x4c5b("0x2e3")] = 0;
          } else {
            _0x4c5b("0x86b");
          }
        },
        "drawCommander" : function() {
          if (attrs["drawCommander"]) {
            var pickerAxes = this["ctx"];
            cimg = new Image;
            cimg["src"] = data["commanderImage"];
            cimg1 = new Image;
            cimg1["src"] = data["commanderImage1"];
            cimg2 = new Image;
            cimg2["src"] = data["commanderImage2"];
            pickerAxes["save"]();
            pickerAxes["globalAlpha"] = attrs["cAlpha"];
            pickerAxes["translate"](attributes["spawnX"], attributes["spawnY"]);
            pickerAxes["rotate"](attrs["cAngle"]);
            pickerAxes["drawImage"](cimg, -attrs["cRadius"] / 2, -attrs["cRadius"] / 2, attrs["cRadius"], attrs["cRadius"]);
            pickerAxes["restore"]();
            pickerAxes["save"]();
            pickerAxes["globalAlpha"] = attrs["cAlpha"];
            pickerAxes["translate"](attributes["spawnX"], attributes["spawnY"]);
            pickerAxes["rotate"](attrs["cAngle1"]);
            pickerAxes["drawImage"](cimg1, -attrs["cRadius"] / 2, -attrs["cRadius"] / 2, attrs["cRadius"], attrs["cRadius"]);
            pickerAxes["restore"]();
            pickerAxes["save"]();
            pickerAxes["globalAlpha"] = attrs["cAlpha"];
            pickerAxes["translate"](attributes["spawnX"], attributes["spawnY"]);
            pickerAxes["rotate"](attrs["cAngle2"]);
            pickerAxes["drawImage"](cimg2, -attrs["cRadius"] / 2, -attrs["cRadius"] / 2, attrs["cRadius"], attrs["cRadius"]);
            pickerAxes["restore"]();
            pickerAxes["globalAlpha"] = 1;
            this["updateCommander"]();
          }
        },
        "updateCommander" : function() {
          attrs["cRadius"] += 7;
          attrs["cAngle"] += .007;
          attrs["cAngle1"] -= .006;
          attrs["cAngle2"] += .003;
          if (2025 <= attrs["cRadius"]) {
            attrs["cAlpha"] *= .95;
          }
          if (1E-4 >= attrs["cAlpha"]) {
            this["resetCommander"]();
          }
        },
        "resetCommander" : function() {
          attrs["cRadius"] = 10; //M['clientX']
          attrs["cAngle"] = 4;
          attrs["cAngle1"] = 0;
          attrs["cAngle2"] = 0;
          attrs["cAlpha"] = 1;
          attrs["drawCommander"] = false;
          attributes["spawnX"] = 0;
          attributes["spawnY"] = 0;
        },
        "drawVirusesRange" : function(tags, rows, firstLineToRender) {
          if (rows["length"]) {
            tags["beginPath"]();
            var y = 0;
            for (; y < rows["length"]; y++) {
              var x0 = rows[y]["x"];
              var value = rows[y]["y"];
              tags["moveTo"](x0, value);
              tags["arc"](x0, value, rows[y]["size"] + 820, 0, this["pi2"], false);
            }
            tags["fillStyle"] = data["virusColor"];
            tags["globalAlpha"] = .1;
            tags["fill"]();
            tags["globalAlpha"] = 1;
            if (firstLineToRender) {
              rows = [];
            }
          }
        },
        "drawFood" : function() {
          if (attrs["showFood"] && !(settings[_0x4c5b("0x60c")] && .2 > this["scale"])) {
            if (settings[_0x4c5b("0x60b")] && !attrs[_0x4c5b("0x6fd")] && 1E3 < attrs["playerMass"]) {
              return attrs["showFood"] = false, void(attrs[_0x4c5b("0x6fd")] = true);
            }
            if (settings["rainbowFood"]) {
              var i = 0;
              for (; i < attrs[_0x4c5b("0x2ae")]["length"]; i++) {
                attrs[_0x4c5b("0x2ae")][i]["moveCell"]();
                attrs["food"][i]["draw"](this["ctx"]);
              }
            } else {
              this[_0x4c5b("0x877")](this["ctx"], attrs[_0x4c5b("0x2ae")], this["scale"]);
            }
          }
        },
        "drawCachedFood" : function(rng, rows, firstLineToRender, lastLineToRender) {
          if (rows["length"]) {
            if (settings[_0x4c5b("0x4e4")] && this[_0x4c5b("0x878")]) {
              var y = 0;
              for (; y < rows["length"]; y++) {
                var r = rows[y]["x"] - 10 - data[_0x4c5b("0x2d7")];
                var offset = rows[y]["y"] - 10 - data["foodSize"];
                rng["drawImage"](this[_0x4c5b("0x878")], r, offset);
              }
            } else {
              rng["beginPath"]();
              y = 0;
              for (; y < rows["length"]; y++) {
                if (r = rows[y]["x"], offset = rows[y]["y"], rng[_0x4c5b("0x71d")](r, offset), .16 > firstLineToRender) {
                  var rOffset = rows[y]["size"] + data[_0x4c5b("0x2d7")];
                  rng[_0x4c5b("0x879")](r - rOffset, offset - rOffset, 2 * rOffset, 2 * rOffset);
                } else {
                  rng["arc"](r, offset, rows[y]["size"] + data[_0x4c5b("0x2d7")], 0, this["pi2"], false);
                }
              }
              rng["fillStyle"] = data["foodColor"];
              rng["globalAlpha"] = 1;
              rng[_0x4c5b("0x4e")]();
            }
            if (lastLineToRender) {
              rows = [];
            }
          }
        },
        "drawSplitRange" : function(m, s, groups, viewport, paramsParser) {
          if (this["drawCircles"](m, s, 760, 4, .4, _0x4c5b("0x840")), groups["length"]) {
            var x = viewport ? groups["length"] - 1 : 0;
            m["lineWidth"] = 6;
            m["globalAlpha"] = data[_0x4c5b("0x87a")] ? .7 : .35;
            m["strokeStyle"] = data[_0x4c5b("0x483")];
            m["beginPath"]();
            m["arc"](groups[x]["x"], groups[x]["y"], groups[x]["size"] + 760, 0, this["pi2"], false);
            m["closePath"]();
            m["stroke"]();
          }
          m["globalAlpha"] = 1;
          if (paramsParser) {
            s = [];
          }
        },
        "drawOppRings" : function(mmCoreSplitViewBlock, mmCoreLogEnabledDefault, mmCoreLogEnabledConfigName, theClass, studentId, courseId, canCreateDiscussions) {
          var artistTrack = 14 + 2 / mmCoreLogEnabledDefault;
          var GET_AUTH_URL_TIMEOUT = 12 + 1 / mmCoreLogEnabledDefault;
          this["drawCircles"](mmCoreSplitViewBlock, mmCoreLogEnabledConfigName, artistTrack, GET_AUTH_URL_TIMEOUT, .75, "#BE00FF");
          this[_0x4c5b("0x87b")](mmCoreSplitViewBlock, theClass, artistTrack, GET_AUTH_URL_TIMEOUT, .75, _0x4c5b("0x841"));
          this["drawCircles"](mmCoreSplitViewBlock, studentId, artistTrack, GET_AUTH_URL_TIMEOUT, .75, _0x4c5b("0x87c"));
          this[_0x4c5b("0x87b")](mmCoreSplitViewBlock, courseId, artistTrack, GET_AUTH_URL_TIMEOUT, .75, _0x4c5b("0x842"));
          if (canCreateDiscussions) {
            mmCoreLogEnabledConfigName = [];
            theClass = [];
            studentId = [];
            courseId = [];
          }
        },
        "drawCursorTracking" : function(m, n, t, themes) {
          m["lineWidth"] = 4;
          m["globalAlpha"] = data[_0x4c5b("0x87a")] ? .75 : .35;
          m["strokeStyle"] = data[_0x4c5b("0x482")];
          m["beginPath"]();
          var i = 0;
          for (; i < n["length"]; i++) {
            m[_0x4c5b("0x71d")](n[i]["x"], n[i]["y"]);
            m[_0x4c5b("0x71e")](t, themes);
          }
          m["stroke"]();
          m["globalAlpha"] = 1;
        },
        "drawCircles" : function(canvas, data, edges, width, context, xOffset) {
          canvas["lineWidth"] = width;
          canvas["globalAlpha"] = context;
          canvas["strokeStyle"] = xOffset;
          var i = 0;
          for (; i < data["length"]; i++) {
            canvas["beginPath"]();
            canvas["arc"](data[i]["x"], data[i]["y"], data[i]["size"] + edges, 0, this["pi2"], false);
            canvas[_0x4c5b("0x2da")]();
            canvas["stroke"]();
          }
          canvas["globalAlpha"] = 1;
        },
        "drawDashedCircle" : function(res, message, attrs, clientWidth, clientHeight, types, fields) {
          var indexToDelta = this["pi2"] / clientHeight;
          res["lineWidth"] = types;
          res["strokeStyle"] = fields;
          var blendValueArrayIndex = 0;
          for (; blendValueArrayIndex < clientHeight; blendValueArrayIndex = blendValueArrayIndex + 2) {
            res["beginPath"]();
            res["arc"](message, attrs, clientWidth - types / 2, blendValueArrayIndex * indexToDelta, (blendValueArrayIndex + 1) * indexToDelta, false);
            res["stroke"]();
          }
        },
        "drawTeammatesInd" : function(boardManager, isSlidingUp, $cont, $slides) {
          if (this[_0x4c5b("0x727")]) {
            boardManager["drawImage"](this[_0x4c5b("0x727")], isSlidingUp - 45, $cont - $slides - 62);
          }
        },
        "drawPieChart" : function() {
          if (!this["pieChart"]) {
            this[_0x4c5b("0x80b")] = document["createElement"]("canvas");
          }
          var options = this[_0x4c5b("0x80b")]["getContext"]("2d");
          var data = Math[_0x4c5b("0x34")](200, .3 * this["canvasWidth"]) / 200;
          this[_0x4c5b("0x80b")]["width"] = 200 * data;
          this[_0x4c5b("0x80b")]["height"] = 240 * data;
          options["scale"](data, data);
          var m = [_0x4c5b("0x87d"), _0x4c5b("0x87e"), _0x4c5b("0x87f"), _0x4c5b("0x880")];
          var border = 0;
          var name = 0;
          var leg_x;
          for (; name < attrs["pieChart"]["length"]; name++) {
            leg_x = border + attrs["pieChart"][name] * this["pi2"];
            options["fillStyle"] = m[name + 1];
            options["beginPath"]();
            options[_0x4c5b("0x71d")](100, 140);
            options["arc"](100, 140, 80, border, leg_x, false);
            options[_0x4c5b("0x4e")]();
            border = leg_x;
          }
        },
        "drawBattleArea" : function(mmCoreSplitViewBlock) {
          if (attrs["battleRoyale"][_0x4c5b("0xfb")]) {
            this[_0x4c5b("0x881")](mmCoreSplitViewBlock, attrs[_0x4c5b("0x813")]["x"], attrs[_0x4c5b("0x813")]["y"], attrs["battleRoyale"]["radius"], attrs[_0x4c5b("0x830")], attrs[_0x4c5b("0x831")], attrs[_0x4c5b("0x85f")] - attrs[_0x4c5b("0x830")], attrs["mapMaxY"] - attrs["mapMinY"], data[_0x4c5b("0x485")], .25);
            this[_0x4c5b("0x882")](mmCoreSplitViewBlock, attrs[_0x4c5b("0x813")]["targetX"], attrs[_0x4c5b("0x813")]["targetY"], attrs[_0x4c5b("0x813")][_0x4c5b("0x81a")], 40, data[_0x4c5b("0x484")]);
          }
        },
        "drawBattleAreaOnMinimap" : function(params, aLifeTime, now, pick_x, thisControlX, thisControlY) {
          if (attrs[_0x4c5b("0x813")][_0x4c5b("0xfb")]) {
            if (!this["battleAreaMap"]) {
              this[_0x4c5b("0x883")] = document["createElement"]("canvas");
              this["battleAreaMapCtx"] = this[_0x4c5b("0x883")]["getContext"]("2d");
            }
            if (this[_0x4c5b("0x883")]["width"] == aLifeTime) {
              this[_0x4c5b("0x884")]["clearRect"](0, 0, aLifeTime, now);
            } else {
              this[_0x4c5b("0x883")]["width"] = aLifeTime;
              this[_0x4c5b("0x883")]["height"] = now;
            }
            var lastviewmatrix = (attrs[_0x4c5b("0x813")]["x"] + thisControlX) * pick_x;
            var tIndW = (attrs[_0x4c5b("0x813")]["y"] + thisControlY) * pick_x;
            var FragCoord_x = attrs[_0x4c5b("0x813")][_0x4c5b("0x885")] * pick_x;
            this[_0x4c5b("0x881")](this[_0x4c5b("0x884")], lastviewmatrix, tIndW, FragCoord_x, 0, 0, aLifeTime, now, data["dangerAreaColor"], .25);
            lastviewmatrix = ~~((attrs["battleRoyale"]["targetX"] + thisControlX) * pick_x);
            tIndW = ~~((attrs[_0x4c5b("0x813")]["targetY"] + thisControlY) * pick_x);
            FragCoord_x = ~~(attrs[_0x4c5b("0x813")][_0x4c5b("0x81a")] * pick_x);
            this[_0x4c5b("0x882")](this[_0x4c5b("0x884")], lastviewmatrix, tIndW, FragCoord_x, 2, data[_0x4c5b("0x484")]);
            params["drawImage"](this[_0x4c5b("0x883")], 0, 0);
          }
        },
        "drawDangerArea" : function(window, f, position, title, message, e, category, action, index, _$suspendResize) {
          if (!(attrs[_0x4c5b("0x813")][_0x4c5b("0x885")] == attrs[_0x4c5b("0x813")][_0x4c5b("0x886")] || 0 >= title)) {
            window["save"]();
            window["globalAlpha"] = _$suspendResize;
            window["fillStyle"] = index;
            window[_0x4c5b("0x887")](message, e, category, action);
            window[_0x4c5b("0x888")] = _0x4c5b("0x889");
            window["globalAlpha"] = 1;
            window["beginPath"]();
            window["arc"](f, position, title, 0, this["pi2"], false);
            window[_0x4c5b("0x4e")]();
            window["restore"]();
          }
        },
        "drawSafeArea" : function(mmCoreSplitViewBlock, $state, breadcrumbs, OSDConfigService, RequestTrackingService, PoolService) {
          if (!(2 < attrs[_0x4c5b("0x813")][_0x4c5b("0xfb")] || 0 >= OSDConfigService)) {
            this[_0x4c5b("0x88a")](mmCoreSplitViewBlock, $state, breadcrumbs, OSDConfigService, 60, RequestTrackingService, PoolService);
          }
        },
        "drawGhostCells" : function() {
          if (settings[_0x4c5b("0x617")]) {
            var PL$32 = attrs[_0x4c5b("0x71a")];
            this["ctx"]["beginPath"]();
            var PL$66 = 0;
            for (; PL$66 < PL$32["length"]; PL$66++) {
              if (!PL$32[PL$66][_0x4c5b("0x71b")]) {
                var tempX1 = PL$32[PL$66]["x"];
                var childEdge = PL$32[PL$66]["y"];
                this["ctx"][_0x4c5b("0x71d")](tempX1, childEdge);
                this["ctx"]["arc"](tempX1, childEdge, PL$32[PL$66]["size"], 0, this["pi2"], false);
              }
            }
            this["ctx"]["fillStyle"] = data["ghostCellsColor"];
            this["ctx"]["globalAlpha"] = data["ghostCellsAlpha"];
            this["ctx"][_0x4c5b("0x4e")]();
            this["ctx"]["globalAlpha"] = 1;
          }
        },
        "preDrawPellet" : function() {
          this["pellet"] = null;
          var d = 10 + data["foodSize"];
          var riggedVerts = document["createElement"]("canvas");
          riggedVerts["width"] = 2 * d;
          riggedVerts["height"] = 2 * d;
          var inBtn = riggedVerts["getContext"]("2d");
          inBtn["arc"](d, d, d, 0, this["pi2"], false);
          inBtn["fillStyle"] = data[_0x4c5b("0x88b")];
          inBtn[_0x4c5b("0x4e")]();
          this[_0x4c5b("0x878")] = new Image;
          this[_0x4c5b("0x878")]["src"] = riggedVerts[_0x4c5b("0x703")]();
          riggedVerts = null;
        },
        "preDrawIndicator" : function() {
          this["indicator"] = null;
          var _0x37d6c6 = document["createElement"]("canvas");
          _0x37d6c6["width"] = 90;
          _0x37d6c6["height"] = 50;
          var proto = _0x37d6c6["getContext"]("2d");
          proto["lineWidth"] = 15;
          proto["fillStyle"] = data[_0x4c5b("0x480")];
          proto["strokeStyle"] = data[_0x4c5b("0x480")];
          proto["beginPath"]();
          proto[_0x4c5b("0x88c")] = _0x4c5b("0x2bf");
          proto["moveTo"](77, 11);
          proto[_0x4c5b("0x71e")](46, 39);
          proto[_0x4c5b("0x71d")](13, 11);
          proto[_0x4c5b("0x71e")](44, 39);
          proto["stroke"]();
          proto[_0x4c5b("0x4e")]();
          proto["closePath"]();
          this[_0x4c5b("0x727")] = new Image;
          this[_0x4c5b("0x727")]["src"] = _0x37d6c6[_0x4c5b("0x703")]();
          _0x37d6c6 = null;
        },
        "countFps" : function() {
          if (settings[_0x4c5b("0x59d")]) {
            var _0x2fcc15 = Date[_0x4c5b("0x53f")]();
            if (!this[_0x4c5b("0x88d")]) {
              this[_0x4c5b("0x88d")] = _0x2fcc15;
            }
            if (1E3 <= _0x2fcc15 - this[_0x4c5b("0x88d")]) {
              this["fps"] = this[_0x4c5b("0x88e")];
              this[_0x4c5b("0x88e")] = 0;
              this[_0x4c5b("0x88d")] = _0x2fcc15;
            }
            this[_0x4c5b("0x88e")]++;
          }
        },
        "render" : function() {
          methods[_0x4c5b("0x88f")]();
          methods[_0x4c5b("0x854")]();
          window[_0x4c5b("0x890")](methods[_0x4c5b("0x891")]);
        },
        "init" : function() {
          this["setCanvas"]();
          this[_0x4c5b("0x892")]();
          this[_0x4c5b("0x4e5")]();
          this[_0x4c5b("0x4e6")]();
          window["requestAnimationFrame"](methods[_0x4c5b("0x891")]);
        }
      };
      var map = {};
      var result = {};
      var recordMap = {
        "hk-feed" : {
          "label" : args[_0x4c5b("0x893")],
          "defaultKey" : "W",
          "keyDown" : function() {
            if (m) {
              m[_0x4c5b("0x546")]();
            }
          },
          "keyUp" : null,
          "type" : _0x4c5b("0x894")
        },
        "hk-macroFeed" : {
          "label" : args[_0x4c5b("0x895")],
          "defaultKey" : "E",
          "keyDown" : function() {
            if (m) {
              m[_0x4c5b("0x896")](true);
            }
          },
          "keyUp" : function() {
            if (m) {
              m[_0x4c5b("0x896")](false);
            }
          },
          "type" : _0x4c5b("0x894")
        },
        "hk-split" : {
          "label" : args[_0x4c5b("0x897")],
          "defaultKey" : _0x4c5b("0x898"),
          "keyDown" : function() {
            if (m) {
              m[_0x4c5b("0x227")]();
            }
          },
          "keyUp" : null,
          "type" : _0x4c5b("0x894")
        },
        "hk-doubleSplit" : {
          "label" : args["hk-doubleSplit"],
          "defaultKey" : "Q",
          "keyDown" : function() {
            if (m) {
              m["doubleSplit"]();
            }
          },
          "keyUp" : null,
          "type" : _0x4c5b("0x894")
        },
        "hk-popSplit" : {
          "label" : "Popsplit",
          "defaultKey" : _0x4c5b("0x899"),
          "keyDown" : function() {
            if (m) {
              m[_0x4c5b("0x89a")]();
            }
          },
          "keyUp" : null,
          "type" : _0x4c5b("0x894")
        },
        "hk-split16" : {
          "label" : args[_0x4c5b("0x89b")],
          "defaultKey" : _0x4c5b("0x89c"),
          "keyDown" : function() {
            if (m) {
              m[_0x4c5b("0x89d")]();
            }
          },
          "keyUp" : null,
          "type" : _0x4c5b("0x894")
        },
        "hk-pause" : {
          "label" : args[_0x4c5b("0x89e")],
          "defaultKey" : "R",
          "keyDown" : function() {
            if (m) {
              m[_0x4c5b("0x89f")]();
            }
          },
          "keyUp" : null,
          "type" : _0x4c5b("0x894")
        },
        "hk-showTop5" : {
          "label" : args[_0x4c5b("0x8a0")],
          "defaultKey" : "T",
          "keyDown" : function() {
            if (m) {
              m[_0x4c5b("0x8a1")]();
            }
          },
          "keyUp" : null,
          "type" : _0x4c5b("0x894")
        },
        "hk-showTime" : {
          "label" : args[_0x4c5b("0x8a2")],
          "defaultKey" : "ALT+T",
          "keyDown" : function() {
            if (m) {
              m[_0x4c5b("0x8a3")]();
            }
          },
          "keyUp" : null,
          "type" : _0x4c5b("0x894")
        },
        "hk-showSplitRange" : {
          "label" : args[_0x4c5b("0x8a4")],
          "defaultKey" : "U",
          "keyDown" : function() {
            if (m) {
              m[_0x4c5b("0x8a5")]();
            }
          },
          "keyUp" : null,
          "type" : _0x4c5b("0x894")
        },
        "hk-showSplitInd" : {
          "label" : args["hk-showSplitInd"],
          "defaultKey" : "I",
          "keyDown" : function() {
            if (m) {
              m[_0x4c5b("0x8a6")]();
            }
          },
          "keyUp" : null,
          "type" : _0x4c5b("0x894")
        },
        "hk-showTeammatesInd" : {
          "label" : args[_0x4c5b("0x8a7")],
          "defaultKey" : "ALT+I",
          "keyDown" : function() {
            if (m) {
              m[_0x4c5b("0x8a8")]();
            }
          },
          "keyUp" : null,
          "type" : _0x4c5b("0x894")
        },
        "hk-showOppColors" : {
          "label" : args[_0x4c5b("0x8a9")],
          "defaultKey" : "O",
          "keyDown" : function() {
            if (m) {
              m[_0x4c5b("0x8aa")]();
            }
          },
          "keyUp" : null,
          "type" : _0x4c5b("0x894")
        },
        "hk-toggleSkins" : {
          "label" : args[_0x4c5b("0x8ab")],
          "defaultKey" : "A",
          "keyDown" : function() {
            if (m) {
              m[_0x4c5b("0x8ac")]();
            }
          },
          "keyUp" : null,
          "type" : _0x4c5b("0x894")
        },
        "hk-transparentSkins" : {
          "label" : args[_0x4c5b("0x8ad")],
          "defaultKey" : "",
          "keyDown" : function() {
            if (m) {
              m[_0x4c5b("0x8ae")]();
            }
          },
          "keyUp" : null,
          "type" : _0x4c5b("0x894")
        },
        "hk-showSkins" : {
          "label" : args[_0x4c5b("0x8af")],
          "defaultKey" : "S",
          "keyDown" : function() {
            if (m) {
              m[_0x4c5b("0x8b0")]();
            }
          },
          "keyUp" : null,
          "type" : _0x4c5b("0x894")
        },
        "hk-showStats" : {
          "label" : args[_0x4c5b("0x8b1")],
          "defaultKey" : _0x4c5b("0x8b2"),
          "keyDown" : function() {
            if (m) {
              m[_0x4c5b("0x8b3")]();
            }
          },
          "keyUp" : null,
          "type" : _0x4c5b("0x894")
        },
        "hk-toggleCells" : {
          "label" : args[_0x4c5b("0x8b4")],
          "defaultKey" : "D",
          "keyDown" : function() {
            if (m) {
              m[_0x4c5b("0x8b5")]();
            }
          },
          "keyUp" : null,
          "type" : "normal"
        },
        "hk-showFood" : {
          "label" : args[_0x4c5b("0x8b6")],
          "defaultKey" : "F",
          "keyDown" : function() {
            if (m) {
              m[_0x4c5b("0x8b7")]();
            }
          },
          "keyUp" : null,
          "type" : _0x4c5b("0x894")
        },
        "hk-showGrid" : {
          "label" : args[_0x4c5b("0x8b8")],
          "defaultKey" : "G",
          "keyDown" : function() {
            if (m) {
              m[_0x4c5b("0x8b9")]();
            }
          },
          "keyUp" : null,
          "type" : _0x4c5b("0x894")
        },
        "hk-showMiniMapGuides" : {
          "label" : args[_0x4c5b("0x8ba")],
          "defaultKey" : _0x4c5b("0x8bb"),
          "keyDown" : function() {
            if (m) {
              m[_0x4c5b("0x8bc")]();
            }
          },
          "keyUp" : null,
          "type" : _0x4c5b("0x894")
        },
        "hk-hideChat" : {
          "label" : args[_0x4c5b("0x8bd")],
          "defaultKey" : "H",
          "keyDown" : function() {
            if (m) {
              m["hideChat"]();
            }
          },
          "keyUp" : null,
          "type" : _0x4c5b("0x894")
        },
        "hk-showHUD" : {
          "label" : args["hk-showHUD"],
          "defaultKey" : _0x4c5b("0x8be"),
          "keyDown" : function() {
            if (m) {
              m[_0x4c5b("0x8bf")]();
            }
          },
          "keyUp" : null,
          "type" : _0x4c5b("0x894")
        },
        "hk-copyLb" : {
          "label" : args[_0x4c5b("0x8c0")],
          "defaultKey" : "L",
          "keyDown" : function() {
            if (m) {
              m[_0x4c5b("0x8c1")]();
            }
          },
          "keyUp" : null,
          "type" : _0x4c5b("0x894")
        },
        "hk-showLb" : {
          "label" : args[_0x4c5b("0x8c2")],
          "defaultKey" : _0x4c5b("0x8c3"),
          "keyDown" : function() {
            if (m) {
              m["setShowLb"]();
            }
          },
          "keyUp" : null,
          "type" : "normal"
        },
        "hk-toggleAutoZoom" : {
          "label" : args[_0x4c5b("0x8c4")],
          "defaultKey" : "",
          "keyDown" : function() {
            if (m) {
              m[_0x4c5b("0x8c5")]();
            }
          },
          "keyUp" : null,
          "type" : _0x4c5b("0x894")
        },
        "hk-resetZoom" : {
          "label" : args["hk-resetZoom"],
          "defaultKey" : "Z",
          "keyDown" : function() {
            if (m) {
              m[_0x4c5b("0x8c6")](true);
            }
          },
          "keyUp" : function() {
            if (m) {
              m[_0x4c5b("0x8c6")](false);
            }
          },
          "type" : "normal"
        },
        "hk-toggleDeath" : {
          "label" : args["hk-toggleDeath"],
          "defaultKey" : "X",
          "keyDown" : function() {
            if (m) {
              m[_0x4c5b("0x8c7")]();
            }
          },
          "keyUp" : null,
          "type" : _0x4c5b("0x894")
        },
        "hk-clearChat" : {
          "label" : args["hk-clearChat"],
          "defaultKey" : "C",
          "keyDown" : function() {
            if (m) {
              m[_0x4c5b("0x8c8")](true);
            }
          },
          "keyUp" : function() {
            if (m) {
              m[_0x4c5b("0x8c8")](false);
            }
          },
          "type" : _0x4c5b("0x894")
        },
        "hk-showBgSectors" : {
          "label" : args["hk-showBgSectors"],
          "defaultKey" : "B",
          "keyDown" : function() {
            if (m) {
              m[_0x4c5b("0x8c9")]();
            }
          },
          "keyUp" : null,
          "type" : _0x4c5b("0x894")
        },
        "hk-hideBots" : {
          "label" : args[_0x4c5b("0x8ca")],
          "defaultKey" : _0x4c5b("0x8cb"),
          "keyDown" : function() {
            if (m) {
              m["setHideSmallBots"]();
            }
          },
          "keyUp" : null,
          "type" : _0x4c5b("0x894")
        },
        "hk-showNames" : {
          "label" : args[_0x4c5b("0x8cc")],
          "defaultKey" : "N",
          "keyDown" : function() {
            if (m) {
              m[_0x4c5b("0x8cd")]();
            }
          },
          "keyUp" : null,
          "type" : _0x4c5b("0x894")
        },
        "hk-hideTeammatesNames" : {
          "label" : args[_0x4c5b("0x8ce")],
          "defaultKey" : "",
          "keyDown" : function() {
            if (m) {
              m[_0x4c5b("0x8cf")]();
            }
          },
          "keyUp" : null,
          "type" : _0x4c5b("0x894")
        },
        "hk-showMass" : {
          "label" : args[_0x4c5b("0x8d0")],
          "defaultKey" : "M",
          "keyDown" : function() {
            if (m) {
              m[_0x4c5b("0x8d1")]();
            }
          },
          "keyUp" : null,
          "type" : _0x4c5b("0x894")
        },
        "hk-showMiniMap" : {
          "label" : args[_0x4c5b("0x8d2")],
          "defaultKey" : _0x4c5b("0x8d3"),
          "keyDown" : function() {
            if (m) {
              m[_0x4c5b("0x8d4")]();
            }
          },
          "keyUp" : null,
          "type" : _0x4c5b("0x894")
        },
        "hk-chatMessage" : {
          "label" : args[_0x4c5b("0x8d5")],
          "defaultKey" : _0x4c5b("0x8d6"),
          "keyDown" : function() {
            if (m) {
              m["enterChatMessage"]();
            }
          },
          "keyUp" : null,
          "type" : _0x4c5b("0x219")
        },
        "hk-quickResp" : {
          "label" : args["hk-quickResp"],
          "defaultKey" : _0x4c5b("0x8d7"),
          "keyDown" : function() {
            if (m) {
              m["quickResp"]();
            }
          },
          "keyUp" : null,
          "type" : _0x4c5b("0x894")
        },
        "hk-autoResp" : {
          "label" : args[_0x4c5b("0x8d8")],
          "defaultKey" : "",
          "keyDown" : function() {
            if (m) {
              m[_0x4c5b("0x8d9")]();
            }
          },
          "keyUp" : null,
          "type" : _0x4c5b("0x894")
        },
        "hk-zoom1" : {
          "label" : args["hk-zoomLevel"] + " 1",
          "defaultKey" : _0x4c5b("0x8da"),
          "keyDown" : function() {
            if (m) {
              m[_0x4c5b("0x850")](.5);
            }
          },
          "keyUp" : null,
          "type" : _0x4c5b("0x894")
        },
        "hk-zoom2" : {
          "label" : args[_0x4c5b("0x8db")] + " 2",
          "defaultKey" : _0x4c5b("0x8dc"),
          "keyDown" : function() {
            if (m) {
              m[_0x4c5b("0x850")](.25);
            }
          },
          "keyUp" : null,
          "type" : _0x4c5b("0x894")
        },
        "hk-zoom3" : {
          "label" : args[_0x4c5b("0x8db")] + " 3",
          "defaultKey" : _0x4c5b("0x8dd"),
          "keyDown" : function() {
            if (m) {
              m[_0x4c5b("0x850")](.125);
            }
          },
          "keyUp" : null,
          "type" : _0x4c5b("0x894")
        },
        "hk-zoom4" : {
          "label" : args["hk-zoomLevel"] + " 4",
          "defaultKey" : _0x4c5b("0x8de"),
          "keyDown" : function() {
            if (m) {
              m["setZoom"](.075);
            }
          },
          "keyUp" : null,
          "type" : "normal"
        },
        "hk-zoom5" : {
          "label" : args["hk-zoomLevel"] + " 5",
          "defaultKey" : _0x4c5b("0x8df"),
          "keyDown" : function() {
            if (m) {
              m[_0x4c5b("0x850")](.05);
            }
          },
          "keyUp" : null,
          "type" : _0x4c5b("0x894")
        },
        "hk-switchServerMode" : {
          "label" : args[_0x4c5b("0x8e0")],
          "defaultKey" : "=",
          "keyDown" : function() {
            if (m) {
              m[_0x4c5b("0x8e1")]();
            }
          },
          "keyUp" : null,
          "type" : "normal"
        },
        "hk-showTargeting" : {
          "label" : args["hk-showTargeting"],
          "defaultKey" : "",
          "keyDown" : function() {
            if (m) {
              m["setShowTargeting"]();
            }
          },
          "keyUp" : null,
          "type" : _0x4c5b("0x894")
        },
        "hk-setTargeting" : {
          "label" : args[_0x4c5b("0x8e2")],
          "defaultKey" : "",
          "keyDown" : function() {
            if (m) {
              m[_0x4c5b("0x68e")]();
            }
          },
          "keyUp" : null,
          "type" : _0x4c5b("0x894")
        },
        "hk-cancelTargeting" : {
          "label" : args[_0x4c5b("0x8e3")],
          "defaultKey" : "",
          "keyDown" : function() {
            if (m) {
              m[_0x4c5b("0x730")]();
            }
          },
          "keyUp" : null,
          "type" : _0x4c5b("0x894")
        },
        "hk-changeTarget" : {
          "label" : args[_0x4c5b("0x8e4")],
          "defaultKey" : "",
          "keyDown" : function() {
            if (m) {
              m[_0x4c5b("0x692")]();
            }
          },
          "keyUp" : null,
          "type" : _0x4c5b("0x894")
        },
        "hk-privateMiniMap" : {
          "label" : args["hk-privateMiniMap"],
          "defaultKey" : "",
          "keyDown" : function() {
            if (m) {
              m[_0x4c5b("0x690")]();
            }
          },
          "keyUp" : null,
          "type" : _0x4c5b("0x894")
        },
        "hk-showQuest" : {
          "label" : args[_0x4c5b("0x8e5")],
          "defaultKey" : "",
          "keyDown" : function() {
            if (m) {
              m[_0x4c5b("0x8e6")]();
            }
          },
          "keyUp" : null,
          "type" : "normal"
        },
        "hk-comm1" : {
          "label" : target[_0x4c5b("0x8e7")],
          "defaultKey" : "1",
          "keyDown" : function() {
            if (m) {
              m["sendCommand"](1);
            }
          },
          "keyUp" : null,
          "type" : "command"
        },
        "hk-comm2" : {
          "label" : target[_0x4c5b("0x3ff")],
          "defaultKey" : "2",
          "keyDown" : function() {
            if (m) {
              m[_0x4c5b("0x8e8")](2);
            }
          },
          "keyUp" : null,
          "type" : "command"
        },
        "hk-comm3" : {
          "label" : target[_0x4c5b("0x400")],
          "defaultKey" : "3",
          "keyDown" : function() {
            if (m) {
              m[_0x4c5b("0x8e8")](3);
            }
          },
          "keyUp" : null,
          "type" : "command"
        },
        "hk-comm4" : {
          "label" : target["comm4"],
          "defaultKey" : "4",
          "keyDown" : function() {
            if (m) {
              m["sendCommand"](4);
            }
          },
          "keyUp" : null,
          "type" : _0x4c5b("0x8e9")
        },
        "hk-comm5" : {
          "label" : target[_0x4c5b("0x8ea")],
          "defaultKey" : "5",
          "keyDown" : function() {
            if (m) {
              m[_0x4c5b("0x8e8")](5);
            }
          },
          "keyUp" : null,
          "type" : "command"
        },
        "hk-comm6" : {
          "label" : target[_0x4c5b("0x402")],
          "defaultKey" : "6",
          "keyDown" : function() {
            if (m) {
              m[_0x4c5b("0x8e8")](6);
            }
          },
          "keyUp" : null,
          "type" : _0x4c5b("0x8e9")
        },
        "hk-comm7" : {
          "label" : target[_0x4c5b("0x403")],
          "defaultKey" : "7",
          "keyDown" : function() {
            if (m) {
              m[_0x4c5b("0x8e8")](7);
            }
          },
          "keyUp" : null,
          "type" : _0x4c5b("0x8e9")
        },
        "hk-comm8" : {
          "label" : target[_0x4c5b("0x404")],
          "defaultKey" : "8",
          "keyDown" : function() {
            if (m) {
              m[_0x4c5b("0x8e8")](8);
            }
          },
          "keyUp" : null,
          "type" : "command"
        },
        "hk-comm9" : {
          "label" : target[_0x4c5b("0x405")],
          "defaultKey" : "9",
          "keyDown" : function() {
            if (m) {
              m[_0x4c5b("0x8e8")](9);
            }
          },
          "keyUp" : null,
          "type" : "command"
        },
        "hk-comm0" : {
          "label" : target[_0x4c5b("0x406")],
          "defaultKey" : "0",
          "keyDown" : function() {
            if (m) {
              m[_0x4c5b("0x8e8")](0);
            }
          },
          "keyUp" : null,
          "type" : _0x4c5b("0x8e9")
        },
        "hk-comm10" : {
          "label" : target[_0x4c5b("0x407")],
          "defaultKey" : _0x4c5b("0x8eb"),
          "keyDown" : function() {
            if (m) {
              m[_0x4c5b("0x8e8")](10);
            }
          },
          "keyUp" : null,
          "type" : "command"
        },
        "hk-comm11" : {
          "label" : target["comm11"],
          "defaultKey" : _0x4c5b("0x8ec"),
          "keyDown" : function() {
            if (m) {
              m["sendCommand"](11);
            }
          },
          "keyUp" : null,
          "type" : _0x4c5b("0x8e9")
        },
        "hk-comm12" : {
          "label" : target[_0x4c5b("0x408")],
          "defaultKey" : "UP",
          "keyDown" : function() {
            if (m) {
              m[_0x4c5b("0x8e8")](12);
            }
          },
          "keyUp" : null,
          "type" : _0x4c5b("0x8e9")
        },
        "hk-comm13" : {
          "label" : target[_0x4c5b("0x409")],
          "defaultKey" : _0x4c5b("0x8ed"),
          "keyDown" : function() {
            if (m) {
              m[_0x4c5b("0x8e8")](13);
            }
          },
          "keyUp" : null,
          "type" : _0x4c5b("0x8e9")
        },
        "hk-comm14" : {
          "label" : target[_0x4c5b("0x40a")],
          "defaultKey" : "DOWN",
          "keyDown" : function() {
            if (m) {
              m["sendCommand"](14);
            }
          },
          "keyUp" : null,
          "type" : _0x4c5b("0x8e9")
        }
      };
      var doc = {
        "lastPressedKey" : "",
        "lastKeyId" : "",
        "defaultMessageKey" : _0x4c5b("0x8d6"),
        "inputClassName" : _0x4c5b("0x8ee"),
        "loadDefaultHotkeys" : function() {
          var id;
          for (id in result = {}, recordMap) {
            if (recordMap[_0x4c5b("0x3fe")](id)) {
              result[recordMap[id][_0x4c5b("0x8ef")]] = id;
            }
          }
          result[_0x4c5b("0x8f0")] = this["defaultMessageKey"];
        },
        "loadHotkeys" : function() {
          if (null === window[_0x4c5b("0x206")][_0x4c5b("0x441")](_0x4c5b("0x8f1"))) {
            this[_0x4c5b("0x8f2")]();
          } else {
            result = JSON[_0x4c5b("0x443")](window[_0x4c5b("0x206")][_0x4c5b("0x441")](_0x4c5b("0x8f1")));
          }
          if (null !== window[_0x4c5b("0x206")][_0x4c5b("0x441")](_0x4c5b("0x8f3"))) {
            target = JSON[_0x4c5b("0x443")](window[_0x4c5b("0x206")][_0x4c5b("0x441")](_0x4c5b("0x8f3")));
          }
        },
        "saveHotkeys" : function() {
          window[_0x4c5b("0x206")][_0x4c5b("0x5cc")](_0x4c5b("0x8f1"), JSON[_0x4c5b("0x213")](result));
          this[_0x4c5b("0x8f4")]();
        },
        "saveCommands" : function() {
          $(_0x4c5b("0x8f5"))["each"](function() {
            var doc = $(this);
            var type = doc[_0x4c5b("0x5e6")]("id");
            if (target["hasOwnProperty"](type)) {
              target[type] = doc[_0x4c5b("0x44d")]();
            }
          });
          window[_0x4c5b("0x206")]["setItem"]("ogarioCommands", JSON[_0x4c5b("0x213")](target));
        },
        "resetHotkeys" : function() {
          this[_0x4c5b("0x8f2")]();
          $(_0x4c5b("0x8f6"))["each"](function() {
            var id = $(this)[_0x4c5b("0x5e6")]("id");
            if (recordMap[id]) {
              $(this)[_0x4c5b("0x44d")](recordMap[id][_0x4c5b("0x8ef")]);
            }
          });
        },
        "setHotkeysMenu" : function() {
          var _0x12cdc4 = this;
          var value;
          for (value in $(_0x4c5b("0x4e2"))["append"]('<div id="hotkeys"><div id="hotkeys-menu"><button id="reset-hotkeys" class="btn btn-primary">' + args[_0x4c5b("0x62c")] + '</button> <button id="save-hotkeys" class="btn btn-success">' + args[_0x4c5b("0x4d3")] + _0x4c5b("0x8f7") + args[_0x4c5b("0x198")] + _0x4c5b("0x8f8") + args[_0x4c5b("0x8f9")] + _0x4c5b("0x8fa") + args[_0x4c5b("0x8fb")] + _0x4c5b("0x8fa") + args[_0x4c5b("0x8fc")] + "</li></ul></div></div>"), recordMap) {
            if (recordMap[_0x4c5b("0x3fe")](value)) {
              var options = recordMap[value];
              var tpl_key = "";
              var key;
              for (key in result) {
                if (result[_0x4c5b("0x3fe")](key) && result[key] === value) {
                  tpl_key = key;
                  break;
                }
              }
              if (_0x4c5b("0x8e0") == value && m && !m["privateIP"]) {
                continue;
              }
              if ("command" === options["type"]) {
                var name = value["replace"](_0x4c5b("0x8fd"), "");
                $(_0x4c5b("0x8fe"))[_0x4c5b("0x448")](_0x4c5b("0x8ff") + name + '" class="command-in form-control input-sm" value="' + target[name] + _0x4c5b("0x900") + options["defaultKey"] + _0x4c5b("0x901") + value + '" class="custom-key-in form-control input-sm" value="' + tpl_key + _0x4c5b("0x902"));
              } else {
                $("#hotkeys-cfg")["append"]('<div class="row"><div class="key-label">' + options[_0x4c5b("0x903")] + _0x4c5b("0x904") + options[_0x4c5b("0x8ef")] + _0x4c5b("0x901") + value + _0x4c5b("0x905") + tpl_key + _0x4c5b("0x902"));
              }
            }
          }
          $(document)["on"]("click", _0x4c5b("0x906"), function(canCreateDiscussions) {
            canCreateDiscussions[_0x4c5b("0x4da")]();
            _0x12cdc4[_0x4c5b("0x907")]();
          });
          $(document)["on"](_0x4c5b("0x4c9"), "#save-hotkeys", function(canCreateDiscussions) {
            canCreateDiscussions[_0x4c5b("0x4da")]();
            _0x12cdc4[_0x4c5b("0x908")]();
            $(_0x4c5b("0x909"))[_0x4c5b("0x5ca")](500);
          });
          $(document)["on"]("click", _0x4c5b("0x90a"), function(canCreateDiscussions) {
            canCreateDiscussions[_0x4c5b("0x4da")]();
            $(_0x4c5b("0x909"))[_0x4c5b("0x5ca")](500);
          });
          $(document)["on"](_0x4c5b("0x4c9"), _0x4c5b("0x90b"), function() {
            $(_0x4c5b("0x909"))[_0x4c5b("0x5c9")](500);
            $(_0x4c5b("0x8fe"))["perfectScrollbar"](_0x4c5b("0x14f"));
            gotoNewOfflinePage();
          });
          $("#hotkeys-cfg")[_0x4c5b("0x67e")]();
        },
        "getPressedKey" : function(isModifier) {
          var value = "";
          var key = "";
          switch(isModifier[_0x4c5b("0x90c")] || 17 == isModifier[_0x4c5b("0x847")] ? value = _0x4c5b("0x90d") : (isModifier[_0x4c5b("0x90e")] || 18 == isModifier[_0x4c5b("0x847")]) && (value = _0x4c5b("0x90f")), isModifier["keyCode"]) {
            case 9:
              key = "TAB";
              break;
            case 13:
              key = "ENTER";
              break;
            case 16:
              key = _0x4c5b("0x89c");
              break;
            case 17:
            case 18:
              break;
            case 27:
              key = _0x4c5b("0x910");
              break;
            case 32:
              key = _0x4c5b("0x898");
              break;
            case 37:
              key = _0x4c5b("0x8ec");
              break;
            case 38:
              key = "UP";
              break;
            case 39:
              key = _0x4c5b("0x8ed");
              break;
            case 40:
              key = _0x4c5b("0x911");
              break;
            case 46:
              key = _0x4c5b("0x912");
              break;
            case 61:
            case 187:
              key = "=";
              break;
            case 192:
              key = _0x4c5b("0x8d7");
              break;
            default:
              key = String["fromCharCode"](isModifier[_0x4c5b("0x847")]);
          }
          return "" == value ? key : "" === key ? value : value + "+" + key;
        },
        "deleteHotkey" : function(discussionIndex, domRootID) {
          delete result[discussionIndex];
          $("#" + domRootID)[_0x4c5b("0x44d")]("");
        },
        "setDefaultHotkey" : function(id) {
          var name = false;
          return recordMap[id] && !result[_0x4c5b("0x3fe")](recordMap[id][_0x4c5b("0x8ef")]) ? (name = recordMap[id]["defaultKey"], result[name] = id, name) : name;
        },
        "setHotkey" : function(id, item) {
          if (item && (this[_0x4c5b("0x913")] !== id || this["lastKeyId"] !== item)) {
            var artistTrack = $("#" + item)[_0x4c5b("0x44d")]();
            if (this[_0x4c5b("0x914")](artistTrack, item), "DEL" !== id) {
              if (result[id] && result[id] !== item) {
                var value = result[id];
                var dpName = this["setDefaultHotkey"](value);
                if (dpName) {
                  result[dpName] = value;
                  $("#" + value)[_0x4c5b("0x44d")](dpName);
                } else {
                  this["deleteHotkey"](id, value);
                }
              }
              result[id] = item;
              $("#" + item)[_0x4c5b("0x44d")](id);
              if (_0x4c5b("0x8d5") === item) {
                result[_0x4c5b("0x8f0")] = id;
              }
              this[_0x4c5b("0x913")] = id;
              this["lastKeyId"] = item;
            }
          }
        },
        "init" : function() {
          this["loadHotkeys"]();
          this[_0x4c5b("0x915")]();
        }
      };
      document[_0x4c5b("0x30a")] = function(script) {
        var text = doc["getPressedKey"](script);
        if ((_0x4c5b("0x916") !== script[_0x4c5b("0x917")][_0x4c5b("0x918")] || script[_0x4c5b("0x917")][_0x4c5b("0x5aa")] === doc[_0x4c5b("0x919")] || text === result["spec-messageKey"]) && "" !== text && !map[text]) {
          if (map[text] = true, _0x4c5b("0x910") === text) {
            return script["preventDefault"](), void(m && m[_0x4c5b("0x91a")]());
          }
          if (script[_0x4c5b("0x917")]["className"] === doc[_0x4c5b("0x919")]) {
            return script[_0x4c5b("0x4da")](), void doc[_0x4c5b("0x91b")](text, script["target"]["id"]);
          }
          if (result[text]) {
            script[_0x4c5b("0x4da")]();
            var id = result[text];
            if ("" !== id && recordMap[id] && recordMap[id][_0x4c5b("0x91c")]) {
              recordMap[id][_0x4c5b("0x91c")]();
            }
          }
        }
      };
      document[_0x4c5b("0x84d")] = function(th) {
        var text = doc[_0x4c5b("0x91d")](th);
        if ("" !== text) {
          if (result[text]) {
            var id = result[text];
            if ("" !== id && recordMap[id] && recordMap[id][_0x4c5b("0x91e")]) {
              recordMap[id]["keyUp"]();
            }
          }
          map[text] = false;
        }
      };
      window[_0x4c5b("0x91f")] = function(result) {
        if (!$(_0x4c5b("0x579"))["is"](":visible")) {
          if (2 == result[_0x4c5b("0x920")]) {
            result[_0x4c5b("0x4da")]();
            if (m) {
              m[_0x4c5b("0x8e8")](10);
            }
          } else {
            if (settings[_0x4c5b("0x619")] && (1 == result["which"] && !settings[_0x4c5b("0x921")] || 3 == result[_0x4c5b("0x920")] && settings["mouseInvert"])) {
              result[_0x4c5b("0x4da")]();
              if (m) {
                m[_0x4c5b("0x227")]();
              }
            }
            if (settings[_0x4c5b("0x61a")] && (3 == result[_0x4c5b("0x920")] && !settings[_0x4c5b("0x921")] || 1 == result[_0x4c5b("0x920")] && settings["mouseInvert"])) {
              result[_0x4c5b("0x4da")]();
              if (m) {
                m[_0x4c5b("0x896")](true);
              }
            }
          }
        }
      };
      window[_0x4c5b("0x922")] = function(canCreateDiscussions) {
        if (settings[_0x4c5b("0x61a")] && (3 == canCreateDiscussions[_0x4c5b("0x920")] && !settings["mouseInvert"] || 1 == canCreateDiscussions[_0x4c5b("0x920")] && settings[_0x4c5b("0x921")]) && m) {
          m[_0x4c5b("0x896")](false);
        }
      };
      window[_0x4c5b("0x923")] = function() {
        return attributes["play"] ? args["exit"] : void 0;
      };
      attributes = attrs;
      Result = spawn(_0x4c5b("0xe7"))[_0x4c5b("0x1e")];
      info = spawn("lz4");
      if (_0x4c5b("0x924") === window[_0x4c5b("0x5d2")][_0x4c5b("0x925")]) {
        formatPropertyRead("/" + window[_0x4c5b("0x5d2")]["hash"]);
      }
      window[_0x4c5b("0x926")] = function() {
        methods[_0x4c5b("0x892")]();
        _setPosition();
      };
      (function() {
        window[_0x4c5b("0x30a")] = function(canCreateDiscussions) {
          if (81 == canCreateDiscussions[_0x4c5b("0x847")] && window[_0x4c5b("0x543")][_0x4c5b("0x927")]) {
            window[_0x4c5b("0x543")][_0x4c5b("0x927")]();
          }
        };
        window[_0x4c5b("0x84d")] = function() {
        };
      })();
      window["core"] = {
        "connect" : function(a) {
          attrs[_0x4c5b("0x6ef")](a);
        },
        "disconnect" : function() {
        },
        "sendNick" : function(a) {
          attrs[_0x4c5b("0x849")](a);
        },
        "sendSpectate" : function() {
          attrs[_0x4c5b("0x928")]();
        },
        "eject" : function() {
          attrs[_0x4c5b("0x84c")]();
        },
        "split" : function() {
          attrs[_0x4c5b("0x84a")]();
        },
        "specialOn" : function() {
          attrs["sendFreeSpectate"]();
        },
        "specialOff" : function() {
          attrs[_0x4c5b("0x84b")]();
        },
        "sendFbToken" : function(a) {
          attrs["sendFbToken"](a);
        },
        "sendGplusToken" : function(a) {
          attrs[_0x4c5b("0x929")](a);
        },
        "recaptchaResponse" : function(a) {
          attrs[_0x4c5b("0x92a")](a);
        },
        "setClientVersion" : function(a, b) {
          attrs["setClientVersion"](a, b);
        },
        "proxyMobileData" : function(data = []) {
          if (Array[_0x4c5b("0x20")](data)) {
            if (8 == data[0]) {
              data[_0x4c5b("0x184")](102);
            }
            data = new Uint8Array(data);
            attrs[_0x4c5b("0x7f6")](new DataView(data["buffer"]));
          } else {
            console[_0x4c5b("0x244")](_0x4c5b("0x92b"));
          }
        }
      };
      window[_0x4c5b("0x751")][_0x4c5b("0x92c")]();
      _0x1ed7f4[_0x4c5b("0x256")]();
      m[_0x4c5b("0x256")]();
      m[_0x4c5b("0x92d")]();
      m[_0x4c5b("0x6ef")]();
      doc[_0x4c5b("0x256")]();
      attrs["init"]();
      methods[_0x4c5b("0x256")]();
      window[_0x4c5b("0x751")][_0x4c5b("0x256")]();
      _setPosition();
    }(window, window[_0x4c5b("0x92e")], window["jQuery"]);
  }, {
    "buffer" : 3,
    "lz4" : 18
  }]
}, {}, [47]);
