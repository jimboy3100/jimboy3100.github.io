// Senpa.io WASM Module (Emscripten glue code)
// Loaded lazily when first connecting to a senpa.io server
(function() {
var Module = {};

let moduleOverrides = {};
let key;
for (key in Module) {
    if (Module.hasOwnProperty(key)) {
        moduleOverrides[key] = Module[key];
    }
}
let arguments_ = [];
let thisProgram = './this.program';
let quit_ = function (status, toThrow) {
    throw toThrow;
};
const ENVIRONMENT_IS_WEB = typeof window === 'object';
const ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';
const ENVIRONMENT_IS_NODE =
    typeof process === 'object' && typeof process.versions === 'object' && typeof process.versions.node === 'string';
let scriptDirectory = '';

function locateFile(path) {
    if (Module['locateFile']) {
        return Module['locateFile'](path, scriptDirectory);
    }
    return scriptDirectory + path;
}
let read_, readAsync, readBinary, setWindowTitle;
let nodeFS;
let nodePath;
if (ENVIRONMENT_IS_NODE) {
    // if (ENVIRONMENT_IS_WORKER) {
    //     scriptDirectory = require("path").dirname(scriptDirectory) + "/"
    // } else {
    //     scriptDirectory = __dirname + "/"
    // }
    // read_ = function shell_read(filename, binary) {
    //     if (!nodeFS) nodeFS = require("fs");
    //     if (!nodePath) nodePath = require("path");
    //     filename = nodePath["normalize"](filename);
    //     return nodeFS["readFileSync"](filename, binary ? null : "utf8")
    // };
    // readBinary = function readBinary(filename) {
    //     var ret = read_(filename, true);
    //     if (!ret.buffer) {
    //         ret = new Uint8Array(ret)
    //     }
    //     assert(ret.buffer);
    //     return ret
    // };
    // readAsync = function readAsync(filename, onload, onerror) {
    //     if (!nodeFS) nodeFS = require("fs");
    //     if (!nodePath) nodePath = require("path");
    //     filename = nodePath["normalize"](filename);
    //     nodeFS["readFile"](filename, function(err, data) {
    //         if (err) onerror(err);
    //         else onload(data.buffer)
    //     })
    // };
    // if (process["argv"].length > 1) {
    //     thisProgram = process["argv"][1].replace(/\\/g, "/")
    // }
    // arguments_ = process["argv"].slice(2);
    // if (typeof module !== "undefined") {
    //     module["exports"] = Module
    // }
    // process["on"]("uncaughtException", function(ex) {
    //     if (!(ex instanceof ExitStatus)) {
    //         throw ex
    //     }
    // });
    // process["on"]("unhandledRejection", abort);
    // quit_ = function(status, toThrow) {
    //     if (keepRuntimeAlive()) {
    //         process["exitCode"] = status;
    //         throw toThrow
    //     }
    //     process["exit"](status)
    // };
    // Module["inspect"] = function() {
    //     return "[Emscripten Module object]"
    // }
} else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
    if (ENVIRONMENT_IS_WORKER) {
        scriptDirectory = self.location.href;
    } else if (typeof document !== 'undefined' && document.currentScript) {
        scriptDirectory = document.currentScript.src;
    }
    if (scriptDirectory.indexOf('blob:') !== 0) {
        scriptDirectory = scriptDirectory.substr(0, scriptDirectory.lastIndexOf('/') + 1);
    } else {
        scriptDirectory = '';
    }
    {
        read_ = function (url) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, false);
            xhr.send(null);
            return xhr.responseText;
        };
        if (ENVIRONMENT_IS_WORKER) {
            readBinary = function (url) {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', url, false);
                xhr.responseType = 'arraybuffer';
                xhr.send(null);
                return new Uint8Array(xhr.response);
            };
        }
        readAsync = function (url, onload, onerror) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'arraybuffer';
            xhr.onload = function () {
                if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) {
                    onload(xhr.response);
                    return;
                }
                onerror();
            };
            xhr.onerror = onerror;
            xhr.send(null);
        };
    }
    setWindowTitle = function (title) {
        document.title = title;
    };
} else {
}
const out = Module['print'] || console.log.bind(console);
const err = Module['printErr'] || console.warn.bind(console);
for (key in moduleOverrides) {
    if (moduleOverrides.hasOwnProperty(key)) {
        Module[key] = moduleOverrides[key];
    }
}
moduleOverrides = null;
if (Module['arguments']) arguments_ = Module['arguments'];
if (Module['thisProgram']) thisProgram = Module['thisProgram'];
if (Module['quit']) quit_ = Module['quit'];
let wasmBinary;
if (Module['wasmBinary']) wasmBinary = Module['wasmBinary'];
const noExitRuntime = Module['noExitRuntime'] || true;
if (typeof WebAssembly !== 'object') {
    abort('no native wasm support detected');
}
let wasmMemory;
let ABORT = false;
let EXITSTATUS;

function assert(condition, text) {
    if (!condition) {
        abort('Assertion failed: ' + text);
    }
}
const UTF8Decoder = typeof TextDecoder !== 'undefined' ? new TextDecoder('utf8') : undefined;

function UTF8ArrayToString(heap, idx, maxBytesToRead) {
    const endIdx = idx + maxBytesToRead;
    let endPtr = idx;
    while (heap[endPtr] && !(endPtr >= endIdx)) ++endPtr;
    if (endPtr - idx > 16 && heap.subarray && UTF8Decoder) {
        return UTF8Decoder.decode(heap.subarray(idx, endPtr));
    } else {
        var str = '';
        while (idx < endPtr) {
            let u0 = heap[idx++];
            if (!(u0 & 128)) {
                str += String.fromCharCode(u0);
                continue;
            }
            const u1 = heap[idx++] & 63;
            if ((u0 & 224) == 192) {
                str += String.fromCharCode(((u0 & 31) << 6) | u1);
                continue;
            }
            const u2 = heap[idx++] & 63;
            if ((u0 & 240) == 224) {
                u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
            } else {
                u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heap[idx++] & 63);
            }
            if (u0 < 65536) {
                str += String.fromCharCode(u0);
            } else {
                const ch = u0 - 65536;
                str += String.fromCharCode(55296 | (ch >> 10), 56320 | (ch & 1023));
            }
        }
    }
    return str;
}

function UTF8ToString(ptr, maxBytesToRead) {
    return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : '';
}

function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
    if (!(maxBytesToWrite > 0)) return 0;
    const startIdx = outIdx;
    const endIdx = outIdx + maxBytesToWrite - 1;
    for (let i = 0; i < str.length; ++i) {
        let u = str.charCodeAt(i);
        if (u >= 55296 && u <= 57343) {
            const u1 = str.charCodeAt(++i);
            u = (65536 + ((u & 1023) << 10)) | (u1 & 1023);
        }
        if (u <= 127) {
            if (outIdx >= endIdx) break;
            heap[outIdx++] = u;
        } else if (u <= 2047) {
            if (outIdx + 1 >= endIdx) break;
            heap[outIdx++] = 192 | (u >> 6);
            heap[outIdx++] = 128 | (u & 63);
        } else if (u <= 65535) {
            if (outIdx + 2 >= endIdx) break;
            heap[outIdx++] = 224 | (u >> 12);
            heap[outIdx++] = 128 | ((u >> 6) & 63);
            heap[outIdx++] = 128 | (u & 63);
        } else {
            if (outIdx + 3 >= endIdx) break;
            heap[outIdx++] = 240 | (u >> 18);
            heap[outIdx++] = 128 | ((u >> 12) & 63);
            heap[outIdx++] = 128 | ((u >> 6) & 63);
            heap[outIdx++] = 128 | (u & 63);
        }
    }
    heap[outIdx] = 0;
    return outIdx - startIdx;
}

function stringToUTF8(str, outPtr, maxBytesToWrite) {
    return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
}

function lengthBytesUTF8(str) {
    let len = 0;
    for (let i = 0; i < str.length; ++i) {
        let u = str.charCodeAt(i);
        if (u >= 55296 && u <= 57343) u = (65536 + ((u & 1023) << 10)) | (str.charCodeAt(++i) & 1023);
        if (u <= 127) ++len;
        else if (u <= 2047) len += 2;
        else if (u <= 65535) len += 3;
        else len += 4;
    }
    return len;
}
const UTF16Decoder = typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-16le') : undefined;

function UTF16ToString(ptr, maxBytesToRead) {
    let endPtr = ptr;
    let idx = endPtr >> 1;
    const maxIdx = idx + maxBytesToRead / 2;
    while (!(idx >= maxIdx) && HEAPU16[idx]) ++idx;
    endPtr = idx << 1;
    if (endPtr - ptr > 32 && UTF16Decoder) {
        return UTF16Decoder.decode(HEAPU8.subarray(ptr, endPtr));
    } else {
        let str = '';
        for (let i = 0; !(i >= maxBytesToRead / 2); ++i) {
            const codeUnit = HEAP16[(ptr + i * 2) >> 1];
            if (codeUnit == 0) break;
            str += String.fromCharCode(codeUnit);
        }
        return str;
    }
}

function stringToUTF16(str, outPtr, maxBytesToWrite) {
    if (maxBytesToWrite === undefined) {
        maxBytesToWrite = 2147483647;
    }
    if (maxBytesToWrite < 2) return 0;
    maxBytesToWrite -= 2;
    const startPtr = outPtr;
    const numCharsToWrite = maxBytesToWrite < str.length * 2 ? maxBytesToWrite / 2 : str.length;
    for (let i = 0; i < numCharsToWrite; ++i) {
        const codeUnit = str.charCodeAt(i);
        HEAP16[outPtr >> 1] = codeUnit;
        outPtr += 2;
    }
    HEAP16[outPtr >> 1] = 0;
    return outPtr - startPtr;
}

function lengthBytesUTF16(str) {
    return str.length * 2;
}

function UTF32ToString(ptr, maxBytesToRead) {
    let i = 0;
    let str = '';
    while (!(i >= maxBytesToRead / 4)) {
        const utf32 = HEAP32[(ptr + i * 4) >> 2];
        if (utf32 == 0) break;
        ++i;
        if (utf32 >= 65536) {
            const ch = utf32 - 65536;
            str += String.fromCharCode(55296 | (ch >> 10), 56320 | (ch & 1023));
        } else {
            str += String.fromCharCode(utf32);
        }
    }
    return str;
}

function stringToUTF32(str, outPtr, maxBytesToWrite) {
    if (maxBytesToWrite === undefined) {
        maxBytesToWrite = 2147483647;
    }
    if (maxBytesToWrite < 4) return 0;
    const startPtr = outPtr;
    const endPtr = startPtr + maxBytesToWrite - 4;
    for (let i = 0; i < str.length; ++i) {
        let codeUnit = str.charCodeAt(i);
        if (codeUnit >= 55296 && codeUnit <= 57343) {
            const trailSurrogate = str.charCodeAt(++i);
            codeUnit = (65536 + ((codeUnit & 1023) << 10)) | (trailSurrogate & 1023);
        }
        HEAP32[outPtr >> 2] = codeUnit;
        outPtr += 4;
        if (outPtr + 4 > endPtr) break;
    }
    HEAP32[outPtr >> 2] = 0;
    return outPtr - startPtr;
}

function lengthBytesUTF32(str) {
    let len = 0;
    for (let i = 0; i < str.length; ++i) {
        const codeUnit = str.charCodeAt(i);
        if (codeUnit >= 55296 && codeUnit <= 57343) ++i;
        len += 4;
    }
    return len;
}
let buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;

function updateGlobalBufferAndViews(buf) {
    buffer = buf;
    Module['HEAP8'] = HEAP8 = new Int8Array(buf);
    Module['HEAP16'] = HEAP16 = new Int16Array(buf);
    Module['HEAP32'] = HEAP32 = new Int32Array(buf);
    Module['HEAPU8'] = HEAPU8 = new Uint8Array(buf);
    Module['HEAPU16'] = HEAPU16 = new Uint16Array(buf);
    Module['HEAPU32'] = HEAPU32 = new Uint32Array(buf);
    Module['HEAPF32'] = HEAPF32 = new Float32Array(buf);
    Module['HEAPF64'] = HEAPF64 = new Float64Array(buf);
}
const INITIAL_MEMORY = Module['INITIAL_MEMORY'] || 16777216;
let wasmTable;
const __ATPRERUN__ = [];
const __ATINIT__ = [];
const __ATMAIN__ = [];
const __ATPOSTRUN__ = [];
let runtimeInitialized = false;
let runtimeExited = false;
const runtimeKeepaliveCounter = 0;

function keepRuntimeAlive() {
    return noExitRuntime || runtimeKeepaliveCounter > 0;
}

function preRun() {
    if (Module['preRun']) {
        if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
        while (Module['preRun'].length) {
            addOnPreRun(Module['preRun'].shift());
        }
    }
    callRuntimeCallbacks(__ATPRERUN__);
}

function initRuntime() {
    runtimeInitialized = true;
    callRuntimeCallbacks(__ATINIT__);
}

function preMain() {
    callRuntimeCallbacks(__ATMAIN__);
}

function exitRuntime() {
    runtimeExited = true;
}

function postRun() {
    if (Module['postRun']) {
        if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
        while (Module['postRun'].length) {
            addOnPostRun(Module['postRun'].shift());
        }
    }
    callRuntimeCallbacks(__ATPOSTRUN__);
}

function addOnPreRun(cb) {
    __ATPRERUN__.unshift(cb);
}

function addOnInit(cb) {
    __ATINIT__.unshift(cb);
}

function addOnPostRun(cb) {
    __ATPOSTRUN__.unshift(cb);
}
let runDependencies = 0;
let runDependencyWatcher = null;
let dependenciesFulfilled = null;

function addRunDependency(id) {
    runDependencies++;
    if (Module['monitorRunDependencies']) {
        Module['monitorRunDependencies'](runDependencies);
    }
}

function removeRunDependency(id) {
    runDependencies--;
    if (Module['monitorRunDependencies']) {
        Module['monitorRunDependencies'](runDependencies);
    }
    if (runDependencies == 0) {
        if (runDependencyWatcher !== null) {
            clearInterval(runDependencyWatcher);
            runDependencyWatcher = null;
        }
        if (dependenciesFulfilled) {
            const callback = dependenciesFulfilled;
            dependenciesFulfilled = null;
            callback();
        }
    }
}
Module['preloadedImages'] = {};
Module['preloadedAudios'] = {};

function abort(what) {
    {
        if (Module['onAbort']) {
            Module['onAbort'](what);
        }
    }
    what += '';
    err(what);
    ABORT = true;
    EXITSTATUS = 1;
    what = 'abort(' + what + '). Build with -s ASSERTIONS=1 for more info.';
    const e = new WebAssembly.RuntimeError(what);
    throw e;
}
const dataURIPrefix = 'data:application/octet-stream;base64,';

function isDataURI(filename) {
    return filename.startsWith(dataURIPrefix);
}

function isFileURI(filename) {
    return filename.startsWith('file://');
}
const wasmBinaryFile = 'https://senpa.io/web/static/js/bundle.wasm';
if (!isDataURI(wasmBinaryFile)) {
    // wasmBinaryFile = locateFile(wasmBinaryFile)
}

function getBinary(file) {
    try {
        if (file == wasmBinaryFile && wasmBinary) {
            return new Uint8Array(wasmBinary);
        }
        if (readBinary) {
            return readBinary(file);
        } else {
            throw 'both async and sync fetching of the wasm failed';
        }
    } catch (err) {
        abort(err);
    }
}

function getBinaryPromise() {
    if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
        if (typeof fetch === 'function' && !isFileURI(wasmBinaryFile)) {
            return fetch(wasmBinaryFile, {
                credentials: 'same-origin'
            })
                .then(function (response) {
                    if (!response['ok']) {
                        throw "failed to load wasm binary file at '" + wasmBinaryFile + "'";
                    }
                    return response['arrayBuffer']();
                })
                .catch(function () {
                    return getBinary(wasmBinaryFile);
                });
        } else {
            if (readAsync) {
                return new Promise(function (resolve, reject) {
                    readAsync(
                        wasmBinaryFile,
                        function (response) {
                            resolve(new Uint8Array(response));
                        },
                        reject
                    );
                });
            }
        }
    }
    return Promise.resolve().then(function () {
        return getBinary(wasmBinaryFile);
    });
}

function createWasm() {
    const info = {
        a: asmLibraryArg
    };

    function receiveInstance(instance, module) {
        const exports = instance.exports;
        Module['asm'] = exports;
        wasmMemory = Module['asm']['F'];
        updateGlobalBufferAndViews(wasmMemory.buffer);
        wasmTable = Module['asm']['J'];
        addOnInit(Module['asm']['G']);
        removeRunDependency('wasm-instantiate');
    }
    addRunDependency('wasm-instantiate');

    function receiveInstantiationResult(result) {
        receiveInstance(result['instance']);
    }

    function instantiateArrayBuffer(receiver) {
        return getBinaryPromise()
            .then(function (binary) {
                return WebAssembly.instantiate(binary, info);
            })
            .then(function (instance) {
                return instance;
            })
            .then(receiver, function (reason) {
                err('failed to asynchronously prepare wasm: ' + reason);
                abort(reason);
            });
    }

    function instantiateAsync() {
        if (
            !wasmBinary &&
            typeof WebAssembly.instantiateStreaming === 'function' &&
            !isDataURI(wasmBinaryFile) &&
            !isFileURI(wasmBinaryFile) &&
            typeof fetch === 'function'
        ) {
            return fetch(new URL('./bundle.wasm', 'https://senpa.io/web/static/js/').toString(), {
                // return fetch(wasmBinaryFile, {
                credentials: 'same-origin'
            }).then(function (response) {
                const result = WebAssembly.instantiateStreaming(response, info);
                return result.then(receiveInstantiationResult, function (reason) {
                    err('wasm streaming compile failed: ' + reason);
                    err('falling back to ArrayBuffer instantiation');
                    return instantiateArrayBuffer(receiveInstantiationResult);
                });
            });
        } else {
            return instantiateArrayBuffer(receiveInstantiationResult);
        }
    }
    if (Module['instantiateWasm']) {
        try {
            const exports = Module['instantiateWasm'](info, receiveInstance);
            return exports;
        } catch (e) {
            err('Module.instantiateWasm callback failed with error: ' + e);
            return false;
        }
    }
    instantiateAsync();
    return {};
}

function callRuntimeCallbacks(callbacks) {
    while (callbacks.length > 0) {
        const callback = callbacks.shift();
        if (typeof callback == 'function') {
            callback(Module);
            continue;
        }
        const func = callback.func;
        if (typeof func === 'number') {
            if (callback.arg === undefined) {
                wasmTable.get(func)();
            } else {
                wasmTable.get(func)(callback.arg);
            }
        } else {
            func(callback.arg === undefined ? null : callback.arg);
        }
    }
}

function handleException(e) {
    if (e instanceof ExitStatus || e == 'unwind') {
        return EXITSTATUS;
    }
    const toLog = e;
    err('exception thrown: ' + toLog);
    quit_(1, e);
}

function __embind_register_bigint(primitiveType, name, size, minRange, maxRange) {}

function getShiftFromSize(size) {
    switch (size) {
        case 1:
            return 0;
        case 2:
            return 1;
        case 4:
            return 2;
        case 8:
            return 3;
        default:
            throw new TypeError('Unknown type size: ' + size);
    }
}

function embind_init_charCodes() {
    const codes = new Array(256);
    for (let i = 0; i < 256; ++i) {
        codes[i] = String.fromCharCode(i);
    }
    embind_charCodes = codes;
}
var embind_charCodes = undefined;

function readLatin1String(ptr) {
    let ret = '';
    let c = ptr;
    while (HEAPU8[c]) {
        ret += embind_charCodes[HEAPU8[c++]];
    }
    return ret;
}
const awaitingDependencies = {};
const registeredTypes = {};
const typeDependencies = {};
const char_0 = 48;
const char_9 = 57;

function makeLegalFunctionName(name) {
    if (undefined === name) {
        return '_unknown';
    }
    name = name.replace(/[^a-zA-Z0-9_]/g, '$');
    const f = name.charCodeAt(0);
    if (f >= char_0 && f <= char_9) {
        return '_' + name;
    } else {
        return name;
    }
}

function createNamedFunction(name, body) {
    name = makeLegalFunctionName(name);
    return new Function(
        'body',
        'return function ' +
            name +
            '() {\n' +
            '    "use strict";' +
            '    return body.apply(this, arguments);\n' +
            '};\n'
    )(body);
}

function extendError(baseErrorType, errorName) {
    const errorClass = createNamedFunction(errorName, function (message) {
        this.name = errorName;
        this.message = message;
        const stack = new Error(message).stack;
        if (stack !== undefined) {
            this.stack = this.toString() + '\n' + stack.replace(/^Error(:[^\n]*)?\n/, '');
        }
    });
    errorClass.prototype = Object.create(baseErrorType.prototype);
    errorClass.prototype.constructor = errorClass;
    errorClass.prototype.toString = function () {
        if (this.message === undefined) {
            return this.name;
        } else {
            return this.name + ': ' + this.message;
        }
    };
    return errorClass;
}
let BindingError = undefined;

function throwBindingError(message) {
    throw new BindingError(message);
}
let InternalError = undefined;

function throwInternalError(message) {
    throw new InternalError(message);
}

function whenDependentTypesAreResolved(myTypes, dependentTypes, getTypeConverters) {
    myTypes.forEach(function (type) {
        typeDependencies[type] = dependentTypes;
    });

    function onComplete(typeConverters) {
        const myTypeConverters = getTypeConverters(typeConverters);
        if (myTypeConverters.length !== myTypes.length) {
            throwInternalError('Mismatched type converter count');
        }
        for (let i = 0; i < myTypes.length; ++i) {
            registerType(myTypes[i], myTypeConverters[i]);
        }
    }
    const typeConverters = new Array(dependentTypes.length);
    const unregisteredTypes = [];
    let registered = 0;
    dependentTypes.forEach(function (dt, i) {
        if (registeredTypes.hasOwnProperty(dt)) {
            typeConverters[i] = registeredTypes[dt];
        } else {
            unregisteredTypes.push(dt);
            if (!awaitingDependencies.hasOwnProperty(dt)) {
                awaitingDependencies[dt] = [];
            }
            awaitingDependencies[dt].push(function () {
                typeConverters[i] = registeredTypes[dt];
                ++registered;
                if (registered === unregisteredTypes.length) {
                    onComplete(typeConverters);
                }
            });
        }
    });
    if (0 === unregisteredTypes.length) {
        onComplete(typeConverters);
    }
}

function registerType(rawType, registeredInstance, options) {
    options = options || {};
    if (!('argPackAdvance' in registeredInstance)) {
        throw new TypeError('registerType registeredInstance requires argPackAdvance');
    }
    const name = registeredInstance.name;
    if (!rawType) {
        throwBindingError('type "' + name + '" must have a positive integer typeid pointer');
    }
    if (registeredTypes.hasOwnProperty(rawType)) {
        if (options.ignoreDuplicateRegistrations) {
            return;
        } else {
            throwBindingError("Cannot register type '" + name + "' twice");
        }
    }
    registeredTypes[rawType] = registeredInstance;
    delete typeDependencies[rawType];
    if (awaitingDependencies.hasOwnProperty(rawType)) {
        const callbacks = awaitingDependencies[rawType];
        delete awaitingDependencies[rawType];
        callbacks.forEach(function (cb) {
            cb();
        });
    }
}

function __embind_register_bool(rawType, name, size, trueValue, falseValue) {
    const shift = getShiftFromSize(size);
    name = readLatin1String(name);
    registerType(rawType, {
        name: name,
        fromWireType: function (wt) {
            return !!wt;
        },
        toWireType: function (destructors, o) {
            return o ? trueValue : falseValue;
        },
        argPackAdvance: 8,
        readValueFromPointer: function (pointer) {
            let heap;
            if (size === 1) {
                heap = HEAP8;
            } else if (size === 2) {
                heap = HEAP16;
            } else if (size === 4) {
                heap = HEAP32;
            } else {
                throw new TypeError('Unknown boolean type size: ' + name);
            }
            return this['fromWireType'](heap[pointer >> shift]);
        },
        destructorFunction: null
    });
}
const emval_free_list = [];
const emval_handle_array = [
    {},
    {
        value: undefined
    },
    {
        value: null
    },
    {
        value: true
    },
    {
        value: false
    }
];

function __emval_decref(handle) {
    if (handle > 4 && 0 === --emval_handle_array[handle].refcount) {
        emval_handle_array[handle] = undefined;
        emval_free_list.push(handle);
    }
}

function count_emval_handles() {
    let count = 0;
    for (let i = 5; i < emval_handle_array.length; ++i) {
        if (emval_handle_array[i] !== undefined) {
            ++count;
        }
    }
    return count;
}

function get_first_emval() {
    for (let i = 5; i < emval_handle_array.length; ++i) {
        if (emval_handle_array[i] !== undefined) {
            return emval_handle_array[i];
        }
    }
    return null;
}

function init_emval() {
    Module['count_emval_handles'] = count_emval_handles;
    Module['get_first_emval'] = get_first_emval;
}

function __emval_register(value) {
    switch (value) {
        case undefined: {
            return 1;
        }
        case null: {
            return 2;
        }
        case true: {
            return 3;
        }
        case false: {
            return 4;
        }
        default: {
            const handle = emval_free_list.length ? emval_free_list.pop() : emval_handle_array.length;
            emval_handle_array[handle] = {
                refcount: 1,
                value: value
            };
            return handle;
        }
    }
}

function simpleReadValueFromPointer(pointer) {
    return this['fromWireType'](HEAPU32[pointer >> 2]);
}

function __embind_register_emval(rawType, name) {
    name = readLatin1String(name);
    registerType(rawType, {
        name: name,
        fromWireType: function (handle) {
            const rv = emval_handle_array[handle].value;
            __emval_decref(handle);
            return rv;
        },
        toWireType: function (destructors, value) {
            return __emval_register(value);
        },
        argPackAdvance: 8,
        readValueFromPointer: simpleReadValueFromPointer,
        destructorFunction: null
    });
}

function _embind_repr(v) {
    if (v === null) {
        return 'null';
    }
    const t = typeof v;
    if (t === 'object' || t === 'array' || t === 'function') {
        return v.toString();
    } else {
        return '' + v;
    }
}

function floatReadValueFromPointer(name, shift) {
    switch (shift) {
        case 2:
            return function (pointer) {
                return this['fromWireType'](HEAPF32[pointer >> 2]);
            };
        case 3:
            return function (pointer) {
                return this['fromWireType'](HEAPF64[pointer >> 3]);
            };
        default:
            throw new TypeError('Unknown float type: ' + name);
    }
}

function __embind_register_float(rawType, name, size) {
    const shift = getShiftFromSize(size);
    name = readLatin1String(name);
    registerType(rawType, {
        name: name,
        fromWireType: function (value) {
            return value;
        },
        toWireType: function (destructors, value) {
            if (gay > 304) console.log('value', value);
            if (typeof value !== 'number' && typeof value !== 'boolean') {
                throw new TypeError('Cannot convert "' + _embind_repr(value) + '" to ' + this.name);
            }
            return value;
        },
        argPackAdvance: 8,
        readValueFromPointer: floatReadValueFromPointer(name, shift),
        destructorFunction: null
    });
}

function new_(constructor, argumentList) {
    if (!(constructor instanceof Function)) {
        // throw new TypeError("new_ called with constructor type " + typeof constructor + " which is not a function")
    }
    const dummy = createNamedFunction(constructor.name || 'unknownFunctionName', function () {});
    dummy.prototype = constructor.prototype;
    const obj = new dummy();
    const r = constructor.apply(obj, argumentList);
    return r instanceof Object ? r : obj;
}

function runDestructors(destructors) {
    while (destructors.length) {
        const ptr = destructors.pop();
        const del = destructors.pop();
        del(ptr);
    }
}

function craftInvokerFunction(humanName, argTypes, classType, cppInvokerFunc, cppTargetFunc) {
    const argCount = argTypes.length;
    if (argCount < 2) {
        throwBindingError("argTypes array size mismatch! Must at least get return value and 'this' types!");
    }
    const isClassMethodFunc = argTypes[1] !== null && classType !== null;
    let needsDestructorStack = false;
    for (var i = 1; i < argTypes.length; ++i) {
        if (argTypes[i] !== null && argTypes[i].destructorFunction === undefined) {
            needsDestructorStack = true;
            break;
        }
    }
    const returns = argTypes[0].name !== 'void';
    let argsList = '';
    let argsListWired = '';
    for (var i = 0; i < argCount - 2; ++i) {
        argsList += (i !== 0 ? ', ' : '') + 'arg' + i;
        argsListWired += (i !== 0 ? ', ' : '') + 'arg' + i + 'Wired';
    }
    let invokerFnBody =
        'return function ' +
        makeLegalFunctionName(humanName) +
        '(' +
        argsList +
        ') {\n' +
        'if (arguments.length !== ' +
        (argCount - 2) +
        ') {\n' +
        "throwBindingError('function " +
        humanName +
        " called with ' + arguments.length + ' arguments, expected " +
        (argCount - 2) +
        " args!');\n" +
        '}\n';
    if (needsDestructorStack) {
        invokerFnBody += 'var destructors = [];\n';
    }
    const dtorStack = needsDestructorStack ? 'destructors' : 'null';
    const args1 = ['throwBindingError', 'invoker', 'fn', 'runDestructors', 'retType', 'classParam'];
    const args2 = [throwBindingError, cppInvokerFunc, cppTargetFunc, runDestructors, argTypes[0], argTypes[1]];
    if (isClassMethodFunc) {
        invokerFnBody += 'var thisWired = classParam.toWireType(' + dtorStack + ', this);\n';
    }
    for (var i = 0; i < argCount - 2; ++i) {
        invokerFnBody +=
            'var arg' +
            i +
            'Wired = argType' +
            i +
            '.toWireType(' +
            dtorStack +
            ', arg' +
            i +
            '); // ' +
            argTypes[i + 2].name +
            '\n';
        args1.push('argType' + i);
        args2.push(argTypes[i + 2]);
    }
    if (isClassMethodFunc) {
        argsListWired = 'thisWired' + (argsListWired.length > 0 ? ', ' : '') + argsListWired;
    }
    invokerFnBody +=
        (returns ? 'var rv = ' : '') + 'invoker(fn' + (argsListWired.length > 0 ? ', ' : '') + argsListWired + ');\n';
    if (needsDestructorStack) {
        invokerFnBody += 'runDestructors(destructors);\n';
    } else {
        for (var i = isClassMethodFunc ? 1 : 2; i < argTypes.length; ++i) {
            const paramName = i === 1 ? 'thisWired' : 'arg' + (i - 2) + 'Wired';
            if (argTypes[i].destructorFunction !== null) {
                invokerFnBody += paramName + '_dtor(' + paramName + '); // ' + argTypes[i].name + '\n';
                args1.push(paramName + '_dtor');
                args2.push(argTypes[i].destructorFunction);
            }
        }
    }
    if (returns) {
        invokerFnBody += 'var ret = retType.fromWireType(rv);\n' + 'return ret;\n';
    } else {
    }
    invokerFnBody += '}\n';
    args1.push(invokerFnBody);
    const invokerFunction = new_(Function, args1).apply(null, args2);
    return invokerFunction;
}

function ensureOverloadTable(proto, methodName, humanName) {
    if (undefined === proto[methodName].overloadTable) {
        const prevFunc = proto[methodName];
        proto[methodName] = function () {
            if (!proto[methodName].overloadTable.hasOwnProperty(arguments.length)) {
                throwBindingError(
                    "Function '" +
                        humanName +
                        "' called with an invalid number of arguments (" +
                        arguments.length +
                        ') - expects one of (' +
                        proto[methodName].overloadTable +
                        ')!'
                );
            }
            return proto[methodName].overloadTable[arguments.length].apply(this, arguments);
        };
        proto[methodName].overloadTable = [];
        proto[methodName].overloadTable[prevFunc.argCount] = prevFunc;
    }
}

function exposePublicSymbol(name, value, numArguments) {
    if (Module.hasOwnProperty(name)) {
        if (
            undefined === numArguments ||
            (undefined !== Module[name].overloadTable && undefined !== Module[name].overloadTable[numArguments])
        ) {
            throwBindingError("Cannot register public name '" + name + "' twice");
        }
        ensureOverloadTable(Module, name, name);
        if (Module.hasOwnProperty(numArguments)) {
            throwBindingError(
                'Cannot register multiple overloads of a function with the same number of arguments (' +
                    numArguments +
                    ')!'
            );
        }
        Module[name].overloadTable[numArguments] = value;
    } else {
        Module[name] = value;
        if (undefined !== numArguments) {
            Module[name].numArguments = numArguments;
        }
    }
}

function heap32VectorToArray(count, firstElement) {
    const array = [];
    for (let i = 0; i < count; i++) {
        array.push(HEAP32[(firstElement >> 2) + i]);
    }
    return array;
}

function replacePublicSymbol(name, value, numArguments) {
    if (!Module.hasOwnProperty(name)) {
        throwInternalError('Replacing nonexistant public symbol');
    }
    if (undefined !== Module[name].overloadTable && undefined !== numArguments) {
        Module[name].overloadTable[numArguments] = value;
    } else {
        Module[name] = value;
        Module[name].argCount = numArguments;
    }
}

function dynCallLegacy(sig, ptr, args) {
    const f = Module['dynCall_' + sig];
    return args && args.length ? f.apply(null, [ptr].concat(args)) : f.call(null, ptr);
}

function dynCall(sig, ptr, args) {
    if (sig.includes('j')) {
        return dynCallLegacy(sig, ptr, args);
    }
    return wasmTable.get(ptr).apply(null, args);
}

function getDynCaller(sig, ptr) {
    const argCache = [];
    return function () {
        argCache.length = arguments.length;
        for (let i = 0; i < arguments.length; i++) {
            argCache[i] = arguments[i];
        }
        return dynCall(sig, ptr, argCache);
    };
}

function embind__requireFunction(signature, rawFunction) {
    signature = readLatin1String(signature);

    function makeDynCaller() {
        if (signature.includes('j')) {
            return getDynCaller(signature, rawFunction);
        }
        return wasmTable.get(rawFunction);
    }
    const fp = makeDynCaller();
    if (typeof fp !== 'function') {
        throwBindingError('unknown function pointer with signature ' + signature + ': ' + rawFunction);
    }
    return fp;
}
let UnboundTypeError = undefined;

function getTypeName(type) {
    const ptr = ___getTypeName(type);
    const rv = readLatin1String(ptr);
    _free(ptr);
    return rv;
}

function throwUnboundTypeError(message, types) {
    const unboundTypes = [];
    const seen = {};

    function visit(type) {
        if (seen[type]) {
            return;
        }
        if (registeredTypes[type]) {
            return;
        }
        if (typeDependencies[type]) {
            typeDependencies[type].forEach(visit);
            return;
        }
        unboundTypes.push(type);
        seen[type] = true;
    }
    types.forEach(visit);
    throw new UnboundTypeError(message + ': ' + unboundTypes.map(getTypeName).join([', ']));
}

function __embind_register_function(name, argCount, rawArgTypesAddr, signature, rawInvoker, fn) {
    const argTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
    name = readLatin1String(name);
    rawInvoker = embind__requireFunction(signature, rawInvoker);
    exposePublicSymbol(
        name,
        function () {
            throwUnboundTypeError('Cannot call ' + name + ' due to unbound types', argTypes);
        },
        argCount - 1
    );
    whenDependentTypesAreResolved([], argTypes, function (argTypes) {
        const invokerArgsArray = [argTypes[0], null].concat(argTypes.slice(1));
        replacePublicSymbol(name, craftInvokerFunction(name, invokerArgsArray, null, rawInvoker, fn), argCount - 1);
        return [];
    });
}

function integerReadValueFromPointer(name, shift, signed) {
    switch (shift) {
        case 0:
            return signed
                ? function readS8FromPointer(pointer) {
                      return HEAP8[pointer];
                  }
                : function readU8FromPointer(pointer) {
                      return HEAPU8[pointer];
                  };
        case 1:
            return signed
                ? function readS16FromPointer(pointer) {
                      return HEAP16[pointer >> 1];
                  }
                : function readU16FromPointer(pointer) {
                      return HEAPU16[pointer >> 1];
                  };
        case 2:
            return signed
                ? function readS32FromPointer(pointer) {
                      return HEAP32[pointer >> 2];
                  }
                : function readU32FromPointer(pointer) {
                      return HEAPU32[pointer >> 2];
                  };
        default:
            throw new TypeError('Unknown integer type: ' + name);
    }
}

function __embind_register_integer(primitiveType, name, size, minRange, maxRange) {
    name = readLatin1String(name);
    if (maxRange === -1) {
        maxRange = 4294967295;
    }
    const shift = getShiftFromSize(size);
    let fromWireType = function (value) {
        return value;
    };
    if (minRange === 0) {
        const bitshift = 32 - 8 * size;
        fromWireType = function (value) {
            return (value << bitshift) >>> bitshift;
        };
    }
    const isUnsignedType = name.includes('unsigned');
    registerType(primitiveType, {
        name: name,
        fromWireType: fromWireType,
        toWireType: function (destructors, value) {
            if (typeof value !== 'number' && typeof value !== 'boolean') {
                throw new TypeError('Cannot convert "' + _embind_repr(value) + '" to ' + this.name);
            }
            if (value < minRange || value > maxRange) {
                throw new TypeError(
                    'Passing a number "' +
                        _embind_repr(value) +
                        '" from JS side to C/C++ side to an argument of type "' +
                        name +
                        '", which is outside the valid range [' +
                        minRange +
                        ', ' +
                        maxRange +
                        ']!'
                );
            }
            return isUnsignedType ? value >>> 0 : value | 0;
        },
        argPackAdvance: 8,
        readValueFromPointer: integerReadValueFromPointer(name, shift, minRange !== 0),
        destructorFunction: null
    });
}

function __embind_register_memory_view(rawType, dataTypeIndex, name) {
    const typeMapping = [
        Int8Array,
        Uint8Array,
        Int16Array,
        Uint16Array,
        Int32Array,
        Uint32Array,
        Float32Array,
        Float64Array
    ];
    const TA = typeMapping[dataTypeIndex];

    function decodeMemoryView(handle) {
        handle = handle >> 2;
        const heap = HEAPU32;
        const size = heap[handle];
        const data = heap[handle + 1];
        return new TA(buffer, data, size);
    }
    name = readLatin1String(name);
    registerType(
        rawType,
        {
            name: name,
            fromWireType: decodeMemoryView,
            argPackAdvance: 8,
            readValueFromPointer: decodeMemoryView
        },
        {
            ignoreDuplicateRegistrations: true
        }
    );
}

function __embind_register_std_string(rawType, name) {
    name = readLatin1String(name);
    const stdStringIsUTF8 = name === 'std::string';
    registerType(rawType, {
        name: name,
        fromWireType: function (value) {
            const length = HEAPU32[value >> 2];
            let str;
            if (stdStringIsUTF8) {
                let decodeStartPtr = value + 4;
                for (var i = 0; i <= length; ++i) {
                    const currentBytePtr = value + 4 + i;
                    if (i == length || HEAPU8[currentBytePtr] == 0) {
                        const maxRead = currentBytePtr - decodeStartPtr;
                        const stringSegment = UTF8ToString(decodeStartPtr, maxRead);
                        if (str === undefined) {
                            str = stringSegment;
                        } else {
                            str += String.fromCharCode(0);
                            str += stringSegment;
                        }
                        decodeStartPtr = currentBytePtr + 1;
                    }
                }
            } else {
                const a = new Array(length);
                for (var i = 0; i < length; ++i) {
                    a[i] = String.fromCharCode(HEAPU8[value + 4 + i]);
                }
                str = a.join('');
            }
            _free(value);
            return str;
        },
        toWireType: function (destructors, value) {
            if (value instanceof ArrayBuffer) {
                value = new Uint8Array(value);
            }
            let getLength;
            const valueIsOfTypeString = typeof value === 'string';
            if (
                !(
                    valueIsOfTypeString ||
                    value instanceof Uint8Array ||
                    value instanceof Uint8ClampedArray ||
                    value instanceof Int8Array
                )
            ) {
                throwBindingError('Cannot pass non-string to std::string');
            }
            if (stdStringIsUTF8 && valueIsOfTypeString) {
                getLength = function () {
                    return lengthBytesUTF8(value);
                };
            } else {
                getLength = function () {
                    return value.length;
                };
            }
            const length = getLength();
            const ptr = _malloc(4 + length + 1);
            HEAPU32[ptr >> 2] = length;
            if (stdStringIsUTF8 && valueIsOfTypeString) {
                stringToUTF8(value, ptr + 4, length + 1);
            } else {
                if (valueIsOfTypeString) {
                    for (var i = 0; i < length; ++i) {
                        const charCode = value.charCodeAt(i);
                        if (charCode > 255) {
                            _free(ptr);
                            throwBindingError('String has UTF-16 code units that do not fit in 8 bits');
                        }
                        HEAPU8[ptr + 4 + i] = charCode;
                    }
                } else {
                    for (var i = 0; i < length; ++i) {
                        HEAPU8[ptr + 4 + i] = value[i];
                    }
                }
            }
            if (destructors !== null) {
                destructors.push(_free, ptr);
            }
            return ptr;
        },
        argPackAdvance: 8,
        readValueFromPointer: simpleReadValueFromPointer,
        destructorFunction: function (ptr) {
            _free(ptr);
        }
    });
}

function __embind_register_std_wstring(rawType, charSize, name) {
    name = readLatin1String(name);
    let decodeString, encodeString, getHeap, lengthBytesUTF, shift;
    if (charSize === 2) {
        decodeString = UTF16ToString;
        encodeString = stringToUTF16;
        lengthBytesUTF = lengthBytesUTF16;
        getHeap = function () {
            return HEAPU16;
        };
        shift = 1;
    } else if (charSize === 4) {
        decodeString = UTF32ToString;
        encodeString = stringToUTF32;
        lengthBytesUTF = lengthBytesUTF32;
        getHeap = function () {
            return HEAPU32;
        };
        shift = 2;
    }
    registerType(rawType, {
        name: name,
        fromWireType: function (value) {
            const length = HEAPU32[value >> 2];
            const HEAP = getHeap();
            let str;
            let decodeStartPtr = value + 4;
            for (let i = 0; i <= length; ++i) {
                const currentBytePtr = value + 4 + i * charSize;
                if (i == length || HEAP[currentBytePtr >> shift] == 0) {
                    const maxReadBytes = currentBytePtr - decodeStartPtr;
                    const stringSegment = decodeString(decodeStartPtr, maxReadBytes);
                    if (str === undefined) {
                        str = stringSegment;
                    } else {
                        str += String.fromCharCode(0);
                        str += stringSegment;
                    }
                    decodeStartPtr = currentBytePtr + charSize;
                }
            }
            _free(value);
            return str;
        },
        toWireType: function (destructors, value) {
            if (!(typeof value === 'string')) {
                throwBindingError('Cannot pass non-string to C++ string type ' + name);
            }
            const length = lengthBytesUTF(value);
            const ptr = _malloc(4 + length + charSize);
            HEAPU32[ptr >> 2] = length >> shift;
            encodeString(value, ptr + 4, length + charSize);
            if (destructors !== null) {
                destructors.push(_free, ptr);
            }
            return ptr;
        },
        argPackAdvance: 8,
        readValueFromPointer: simpleReadValueFromPointer,
        destructorFunction: function (ptr) {
            _free(ptr);
        }
    });
}

function __embind_register_void(rawType, name) {
    name = readLatin1String(name);
    registerType(rawType, {
        isVoid: true,
        name: name,
        argPackAdvance: 0,
        fromWireType: function () {
            return undefined;
        },
        toWireType: function (destructors, o) {
            return undefined;
        }
    });
}

function requireHandle(handle) {
    if (!handle) {
        throwBindingError('Cannot use deleted val. handle = ' + handle);
    }
    return emval_handle_array[handle].value;
}

function requireRegisteredType(rawType, humanName) {
    const impl = registeredTypes[rawType];
    if (undefined === impl) {
        throwBindingError(humanName + ' has unknown type ' + getTypeName(rawType));
    }
    return impl;
}

function __emval_as(handle, returnType, destructorsRef) {
    handle = requireHandle(handle);
    returnType = requireRegisteredType(returnType, 'emval::as');
    const destructors = [];
    const rd = __emval_register(destructors);
    HEAP32[destructorsRef >> 2] = rd;
    return returnType['toWireType'](destructors, handle);
}

function __emval_lookupTypes(argCount, argTypes) {
    const a = new Array(argCount);
    for (let i = 0; i < argCount; ++i) {
        a[i] = requireRegisteredType(HEAP32[(argTypes >> 2) + i], 'parameter ' + i);
    }
    return a;
}

function __emval_call(handle, argCount, argTypes, argv) {
    handle = requireHandle(handle);
    const types = __emval_lookupTypes(argCount, argTypes);
    const args = new Array(argCount);
    for (let i = 0; i < argCount; ++i) {
        const type = types[i];
        args[i] = type['readValueFromPointer'](argv);
        argv += type['argPackAdvance'];
    }
    const rv = handle.apply(undefined, args);
    return __emval_register(rv);
}

function __emval_allocateDestructors(destructorsRef) {
    const destructors = [];
    HEAP32[destructorsRef >> 2] = __emval_register(destructors);
    return destructors;
}
const emval_symbols = {};

function getStringOrSymbol(address) {
    const symbol = emval_symbols[address];
    if (symbol === undefined) {
        return readLatin1String(address);
    } else {
        return symbol;
    }
}
const emval_methodCallers = [];

function __emval_call_method(caller, handle, methodName, destructorsRef, args) {
    caller = emval_methodCallers[caller];
    handle = requireHandle(handle);
    methodName = getStringOrSymbol(methodName);
    // if(methodName === "toString") console.log(handle, destructorsRef, gay ++)
    // if(methodName === 'replace') debugger
    return caller(handle, methodName, __emval_allocateDestructors(destructorsRef), args);
}

function __emval_call_void_method(caller, handle, methodName, args) {
    caller = emval_methodCallers[caller];
    handle = requireHandle(handle);
    methodName = getStringOrSymbol(methodName);
    caller(handle, methodName, null, args);
}

function emval_get_global() {
    if (typeof globalThis === 'object') {
        return globalThis;
    }
    return (function () {
        return Function;
    })()('return this')();
}

function __emval_get_global(name) {
    if (name === 0) {
        return __emval_register(emval_get_global());
    } else {
        name = getStringOrSymbol(name);
        return __emval_register(emval_get_global()[name]);
    }
}

function __emval_addMethodCaller(caller) {
    const id = emval_methodCallers.length;
    emval_methodCallers.push(caller);
    return id;
}

function __emval_get_method_caller(argCount, argTypes) {
    const types = __emval_lookupTypes(argCount, argTypes);
    const retType = types[0];
    const signatureName =
        retType.name +
        '_$' +
        types
            .slice(1)
            .map(function (t) {
                return t.name;
            })
            .join('_') +
        '$';
    const params = ['retType'];
    const args = [retType];
    let argsList = '';
    for (var i = 0; i < argCount - 1; ++i) {
        argsList += (i !== 0 ? ', ' : '') + 'arg' + i;
        params.push('argType' + i);
        args.push(types[1 + i]);
    }
    const functionName = makeLegalFunctionName('methodCaller_' + signatureName);
    let functionBody = 'return function ' + functionName + '(handle, name, destructors, args) {\n';
    let offset = 0;
    for (var i = 0; i < argCount - 1; ++i) {
        functionBody +=
            '    var arg' + i + ' = argType' + i + '.readValueFromPointer(args' + (offset ? '+' + offset : '') + ');\n';
        offset += types[i + 1]['argPackAdvance'];
    }
    functionBody += 'var rv = handle[name](' + argsList + ');\n';
    for (var i = 0; i < argCount - 1; ++i) {
        if (types[i + 1]['deleteObject']) {
            functionBody += '    argType' + i + '.deleteObject(arg' + i + ');\n';
        }
    }
    if (!retType.isVoid) {
        functionBody += '    return retType.toWireType(destructors, rv);\n';
    }
    functionBody += '};\n';
    params.push(functionBody);
    const invokerFunction = new_(Function, params).apply(null, args);
    return __emval_addMethodCaller(invokerFunction);
}

function __emval_get_module_property(name) {
    name = getStringOrSymbol(name);
    return __emval_register(Module[name]);
}

function __emval_get_property(handle, key) {
    handle = requireHandle(handle);
    key = requireHandle(key);
    return __emval_register(handle[key]);
}

function __emval_incref(handle) {
    if (handle > 4) {
        emval_handle_array[handle].refcount += 1;
    }
}

function __emval_instanceof(object, constructor) {
    object = requireHandle(object);
    constructor = requireHandle(constructor);
    return object instanceof constructor;
}

function craftEmvalAllocator(argCount) {
    let argsList = '';
    for (var i = 0; i < argCount; ++i) {
        argsList += (i !== 0 ? ', ' : '') + 'arg' + i;
    }
    let functionBody = 'return function emval_allocator_' + argCount + '(constructor, argTypes, args) {\n';
    for (var i = 0; i < argCount; ++i) {
        functionBody +=
            'var argType' +
            i +
            " = requireRegisteredType(Module['HEAP32'][(argTypes >>> 2) + " +
            i +
            '], "parameter ' +
            i +
            '");\n' +
            'var arg' +
            i +
            ' = argType' +
            i +
            '.readValueFromPointer(args);\n' +
            'args += argType' +
            i +
            "['argPackAdvance'];\n";
    }
    functionBody += 'var obj = new constructor(' + argsList + ');\n' + 'return __emval_register(obj);\n' + '}\n';
    return new Function('requireRegisteredType', 'Module', '__emval_register', functionBody)(
        requireRegisteredType,
        Module,
        __emval_register
    );
}
const emval_newers = {};

function __emval_new(handle, argCount, argTypes, args) {
    handle = requireHandle(handle);
    let newer = emval_newers[argCount];
    if (!newer) {
        newer = craftEmvalAllocator(argCount);
        emval_newers[argCount] = newer;
    }
    return newer(handle, argTypes, args);
}

function __emval_new_array() {
    return __emval_register([]);
}

function __emval_new_cstring(v) {
    return __emval_register(getStringOrSymbol(v));
}

function __emval_new_object() {
    return __emval_register({});
}

function __emval_run_destructors(handle) {
    const destructors = emval_handle_array[handle].value;
    runDestructors(destructors);
    __emval_decref(handle);
}

function __emval_set_property(handle, key, value) {
    handle = requireHandle(handle);
    key = requireHandle(key);
    value = requireHandle(value);
    handle[key] = value;
}

function __emval_take_value(type, argv) {
    type = requireRegisteredType(type, '_emval_take_value');
    const v = type['readValueFromPointer'](argv);
    return __emval_register(v);
}

function __emval_typeof(handle) {
    handle = requireHandle(handle);
    return __emval_register(typeof handle);
}

function _abort() {
    abort();
}

function abortOnCannotGrowMemory(requestedSize) {
    abort('OOM');
}

function _emscripten_resize_heap(requestedSize) {
    const oldSize = HEAPU8.length;
    requestedSize = requestedSize >>> 0;
    abortOnCannotGrowMemory(requestedSize);
}
embind_init_charCodes();
BindingError = Module['BindingError'] = extendError(Error, 'BindingError');
InternalError = Module['InternalError'] = extendError(Error, 'InternalError');
init_emval();
UnboundTypeError = Module['UnboundTypeError'] = extendError(Error, 'UnboundTypeError');
var asmLibraryArg = {
    t: __embind_register_bigint,
    w: __embind_register_bool,
    v: __embind_register_emval,
    o: __embind_register_float,
    l: __embind_register_function,
    d: __embind_register_integer,
    c: __embind_register_memory_view,
    p: __embind_register_std_string,
    j: __embind_register_std_wstring,
    x: __embind_register_void,
    g: __emval_as,
    D: __emval_call,
    b: __emval_call_method,
    f: __emval_call_void_method,
    m: __emval_decref,
    y: __emval_get_global,
    a: __emval_get_method_caller,
    r: __emval_get_module_property,
    i: __emval_get_property,
    h: __emval_incref,
    q: __emval_instanceof,
    s: __emval_new,
    C: __emval_new_array,
    z: __emval_new_cstring,
    E: __emval_new_object,
    A: __emval_run_destructors,
    e: __emval_set_property,
    k: __emval_take_value,
    B: __emval_typeof,
    n: _abort,
    u: _emscripten_resize_heap
};
const asm = createWasm();
var ___wasm_call_ctors = (Module['___wasm_call_ctors'] = function () {
    return (___wasm_call_ctors = Module['___wasm_call_ctors'] = Module['asm']['G']).apply(null, arguments);
});
var _malloc = (Module['_malloc'] = function () {
    return (_malloc = Module['_malloc'] = Module['asm']['H']).apply(null, arguments);
});
var _main = (Module['_main'] = function () {
    return (_main = Module['_main'] = Module['asm']['I']).apply(null, arguments);
});
var ___getTypeName = (Module['___getTypeName'] = function () {
    return (___getTypeName = Module['___getTypeName'] = Module['asm']['K']).apply(null, arguments);
});
var ___embind_register_native_and_builtin_types = (Module['___embind_register_native_and_builtin_types'] = function () {
    return (___embind_register_native_and_builtin_types = Module['___embind_register_native_and_builtin_types'] =
        Module['asm']['L']).apply(null, arguments);
});
var _free = (Module['_free'] = function () {
    return (_free = Module['_free'] = Module['asm']['M']).apply(null, arguments);
});
let calledRun;

function ExitStatus(status) {
    this.name = 'ExitStatus';
    this.message = 'Program terminated with exit(' + status + ')';
    this.status = status;
}
let calledMain = false;
dependenciesFulfilled = function runCaller() {
    if (!calledRun) run();
    if (!calledRun) dependenciesFulfilled = runCaller;
};

function callMain(args) {
    const entryFunction = Module['_main'];
    const argc = 0;
    const argv = 0;
    try {
        const ret = entryFunction(argc, argv);
        exit(ret, true);
        return ret;
    } catch (e) {
        return handleException(e);
    } finally {
        calledMain = true;
    }
}

function run(args) {
    args = args || arguments_;
    if (runDependencies > 0) {
        return;
    }
    preRun();
    if (runDependencies > 0) {
        return;
    }

    function doRun() {
        if (calledRun) return;
        calledRun = true;
        Module['calledRun'] = true;
        if (ABORT) return;
        initRuntime();
        preMain();
        if (Module['onRuntimeInitialized']) Module['onRuntimeInitialized']();
        if (shouldRunNow) callMain(args);
        postRun();
    }
    if (Module['setStatus']) {
        Module['setStatus']('Running...');
        setTimeout(function () {
            setTimeout(function () {
                Module['setStatus']('');
            }, 1);
            doRun();
        }, 1);
    } else {
        doRun();
    }
}
Module['run'] = run;

function exit(status, implicit) {
    EXITSTATUS = status;
    if (keepRuntimeAlive()) {
    } else {
        exitRuntime();
    }
    procExit(status);
}

function procExit(code) {
    EXITSTATUS = code;
    if (!keepRuntimeAlive()) {
        if (Module['onExit']) Module['onExit'](code);
        ABORT = true;
    }
    quit_(code, new ExitStatus(code));
}
if (Module['preInit']) {
    if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
    while (Module['preInit'].length > 0) {
        Module['preInit'].pop()();
    }
}
var shouldRunNow = true;
if (Module['noInitialRun']) shouldRunNow = false;
run();
window._SenpaModule = Module;
})();
