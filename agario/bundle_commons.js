/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	var parentJsonpFunction = window["webpackJsonp"];
/******/ 	window["webpackJsonp"] = function webpackJsonpCallback(chunkIds, moreModules, executeModules) {
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [], result;
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(chunkIds, moreModules, executeModules);
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/ 		if(executeModules) {
/******/ 			for(i=0; i < executeModules.length; i++) {
/******/ 				result = __webpack_require__(__webpack_require__.s = executeModules[i]);
/******/ 			}
/******/ 		}
/******/ 		return result;
/******/ 	};
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// objects to store loaded and loading chunks
/******/ 	var installedChunks = {
/******/ 		2: 0
/******/ 	};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// on error function for async loading
/******/ 	__webpack_require__.oe = function(err) { console.error(err); throw err; };
/******/ })
/************************************************************************/
/******/ ({

/***/ 11:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(global) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Store", function() { return Store; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createLogger", function() { return createLogger; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createNamespacedHelpers", function() { return createNamespacedHelpers; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "install", function() { return install; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapActions", function() { return mapActions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapGetters", function() { return mapGetters; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapMutations", function() { return mapMutations; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapState", function() { return mapState; });
/*!
 * vuex v3.6.2
 * (c) 2021 Evan You
 * @license MIT
 */
function applyMixin (Vue) {
  var version = Number(Vue.version.split('.')[0]);

  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit });
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    var _init = Vue.prototype._init;
    Vue.prototype._init = function (options) {
      if ( options === void 0 ) options = {};

      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit;
      _init.call(this, options);
    };
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function vuexInit () {
    var options = this.$options;
    // store injection
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store;
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store;
    }
  }
}

var target = typeof window !== 'undefined'
  ? window
  : typeof global !== 'undefined'
    ? global
    : {};
var devtoolHook = target.__VUE_DEVTOOLS_GLOBAL_HOOK__;

function devtoolPlugin (store) {
  if (!devtoolHook) { return }

  store._devtoolHook = devtoolHook;

  devtoolHook.emit('vuex:init', store);

  devtoolHook.on('vuex:travel-to-state', function (targetState) {
    store.replaceState(targetState);
  });

  store.subscribe(function (mutation, state) {
    devtoolHook.emit('vuex:mutation', mutation, state);
  }, { prepend: true });

  store.subscribeAction(function (action, state) {
    devtoolHook.emit('vuex:action', action, state);
  }, { prepend: true });
}

/**
 * Get the first item that pass the test
 * by second argument function
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */
function find (list, f) {
  return list.filter(f)[0]
}

/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */
function deepCopy (obj, cache) {
  if ( cache === void 0 ) cache = [];

  // just return if obj is immutable value
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  // if obj is hit, it is in circular structure
  var hit = find(cache, function (c) { return c.original === obj; });
  if (hit) {
    return hit.copy
  }

  var copy = Array.isArray(obj) ? [] : {};
  // put the copy into cache at first
  // because we want to refer it in recursive deepCopy
  cache.push({
    original: obj,
    copy: copy
  });

  Object.keys(obj).forEach(function (key) {
    copy[key] = deepCopy(obj[key], cache);
  });

  return copy
}

/**
 * forEach for object
 */
function forEachValue (obj, fn) {
  Object.keys(obj).forEach(function (key) { return fn(obj[key], key); });
}

function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

function isPromise (val) {
  return val && typeof val.then === 'function'
}

function assert (condition, msg) {
  if (!condition) { throw new Error(("[vuex] " + msg)) }
}

function partial (fn, arg) {
  return function () {
    return fn(arg)
  }
}

// Base data struct for store's module, package with some attribute and method
var Module = function Module (rawModule, runtime) {
  this.runtime = runtime;
  // Store some children item
  this._children = Object.create(null);
  // Store the origin module object which passed by programmer
  this._rawModule = rawModule;
  var rawState = rawModule.state;

  // Store the origin module's state
  this.state = (typeof rawState === 'function' ? rawState() : rawState) || {};
};

var prototypeAccessors = { namespaced: { configurable: true } };

prototypeAccessors.namespaced.get = function () {
  return !!this._rawModule.namespaced
};

Module.prototype.addChild = function addChild (key, module) {
  this._children[key] = module;
};

Module.prototype.removeChild = function removeChild (key) {
  delete this._children[key];
};

Module.prototype.getChild = function getChild (key) {
  return this._children[key]
};

Module.prototype.hasChild = function hasChild (key) {
  return key in this._children
};

Module.prototype.update = function update (rawModule) {
  this._rawModule.namespaced = rawModule.namespaced;
  if (rawModule.actions) {
    this._rawModule.actions = rawModule.actions;
  }
  if (rawModule.mutations) {
    this._rawModule.mutations = rawModule.mutations;
  }
  if (rawModule.getters) {
    this._rawModule.getters = rawModule.getters;
  }
};

Module.prototype.forEachChild = function forEachChild (fn) {
  forEachValue(this._children, fn);
};

Module.prototype.forEachGetter = function forEachGetter (fn) {
  if (this._rawModule.getters) {
    forEachValue(this._rawModule.getters, fn);
  }
};

Module.prototype.forEachAction = function forEachAction (fn) {
  if (this._rawModule.actions) {
    forEachValue(this._rawModule.actions, fn);
  }
};

Module.prototype.forEachMutation = function forEachMutation (fn) {
  if (this._rawModule.mutations) {
    forEachValue(this._rawModule.mutations, fn);
  }
};

Object.defineProperties( Module.prototype, prototypeAccessors );

var ModuleCollection = function ModuleCollection (rawRootModule) {
  // register root module (Vuex.Store options)
  this.register([], rawRootModule, false);
};

ModuleCollection.prototype.get = function get (path) {
  return path.reduce(function (module, key) {
    return module.getChild(key)
  }, this.root)
};

ModuleCollection.prototype.getNamespace = function getNamespace (path) {
  var module = this.root;
  return path.reduce(function (namespace, key) {
    module = module.getChild(key);
    return namespace + (module.namespaced ? key + '/' : '')
  }, '')
};

ModuleCollection.prototype.update = function update$1 (rawRootModule) {
  update([], this.root, rawRootModule);
};

ModuleCollection.prototype.register = function register (path, rawModule, runtime) {
    var this$1 = this;
    if ( runtime === void 0 ) runtime = true;

  if ((false)) {
    assertRawModule(path, rawModule);
  }

  var newModule = new Module(rawModule, runtime);
  if (path.length === 0) {
    this.root = newModule;
  } else {
    var parent = this.get(path.slice(0, -1));
    parent.addChild(path[path.length - 1], newModule);
  }

  // register nested modules
  if (rawModule.modules) {
    forEachValue(rawModule.modules, function (rawChildModule, key) {
      this$1.register(path.concat(key), rawChildModule, runtime);
    });
  }
};

ModuleCollection.prototype.unregister = function unregister (path) {
  var parent = this.get(path.slice(0, -1));
  var key = path[path.length - 1];
  var child = parent.getChild(key);

  if (!child) {
    if ((false)) {
      console.warn(
        "[vuex] trying to unregister module '" + key + "', which is " +
        "not registered"
      );
    }
    return
  }

  if (!child.runtime) {
    return
  }

  parent.removeChild(key);
};

ModuleCollection.prototype.isRegistered = function isRegistered (path) {
  var parent = this.get(path.slice(0, -1));
  var key = path[path.length - 1];

  if (parent) {
    return parent.hasChild(key)
  }

  return false
};

function update (path, targetModule, newModule) {
  if ((false)) {
    assertRawModule(path, newModule);
  }

  // update target module
  targetModule.update(newModule);

  // update nested modules
  if (newModule.modules) {
    for (var key in newModule.modules) {
      if (!targetModule.getChild(key)) {
        if ((false)) {
          console.warn(
            "[vuex] trying to add a new module '" + key + "' on hot reloading, " +
            'manual reload is needed'
          );
        }
        return
      }
      update(
        path.concat(key),
        targetModule.getChild(key),
        newModule.modules[key]
      );
    }
  }
}

var functionAssert = {
  assert: function (value) { return typeof value === 'function'; },
  expected: 'function'
};

var objectAssert = {
  assert: function (value) { return typeof value === 'function' ||
    (typeof value === 'object' && typeof value.handler === 'function'); },
  expected: 'function or object with "handler" function'
};

var assertTypes = {
  getters: functionAssert,
  mutations: functionAssert,
  actions: objectAssert
};

function assertRawModule (path, rawModule) {
  Object.keys(assertTypes).forEach(function (key) {
    if (!rawModule[key]) { return }

    var assertOptions = assertTypes[key];

    forEachValue(rawModule[key], function (value, type) {
      assert(
        assertOptions.assert(value),
        makeAssertionMessage(path, key, type, value, assertOptions.expected)
      );
    });
  });
}

function makeAssertionMessage (path, key, type, value, expected) {
  var buf = key + " should be " + expected + " but \"" + key + "." + type + "\"";
  if (path.length > 0) {
    buf += " in module \"" + (path.join('.')) + "\"";
  }
  buf += " is " + (JSON.stringify(value)) + ".";
  return buf
}

var Vue; // bind on install

var Store = function Store (options) {
  var this$1 = this;
  if ( options === void 0 ) options = {};

  // Auto install if it is not done yet and `window` has `Vue`.
  // To allow users to avoid auto-installation in some cases,
  // this code should be placed here. See #731
  if (!Vue && typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
  }

  if ((false)) {
    assert(Vue, "must call Vue.use(Vuex) before creating a store instance.");
    assert(typeof Promise !== 'undefined', "vuex requires a Promise polyfill in this browser.");
    assert(this instanceof Store, "store must be called with the new operator.");
  }

  var plugins = options.plugins; if ( plugins === void 0 ) plugins = [];
  var strict = options.strict; if ( strict === void 0 ) strict = false;

  // store internal state
  this._committing = false;
  this._actions = Object.create(null);
  this._actionSubscribers = [];
  this._mutations = Object.create(null);
  this._wrappedGetters = Object.create(null);
  this._modules = new ModuleCollection(options);
  this._modulesNamespaceMap = Object.create(null);
  this._subscribers = [];
  this._watcherVM = new Vue();
  this._makeLocalGettersCache = Object.create(null);

  // bind commit and dispatch to self
  var store = this;
  var ref = this;
  var dispatch = ref.dispatch;
  var commit = ref.commit;
  this.dispatch = function boundDispatch (type, payload) {
    return dispatch.call(store, type, payload)
  };
  this.commit = function boundCommit (type, payload, options) {
    return commit.call(store, type, payload, options)
  };

  // strict mode
  this.strict = strict;

  var state = this._modules.root.state;

  // init root module.
  // this also recursively registers all sub-modules
  // and collects all module getters inside this._wrappedGetters
  installModule(this, state, [], this._modules.root);

  // initialize the store vm, which is responsible for the reactivity
  // (also registers _wrappedGetters as computed properties)
  resetStoreVM(this, state);

  // apply plugins
  plugins.forEach(function (plugin) { return plugin(this$1); });

  var useDevtools = options.devtools !== undefined ? options.devtools : Vue.config.devtools;
  if (useDevtools) {
    devtoolPlugin(this);
  }
};

var prototypeAccessors$1 = { state: { configurable: true } };

prototypeAccessors$1.state.get = function () {
  return this._vm._data.$$state
};

prototypeAccessors$1.state.set = function (v) {
  if ((false)) {
    assert(false, "use store.replaceState() to explicit replace store state.");
  }
};

Store.prototype.commit = function commit (_type, _payload, _options) {
    var this$1 = this;

  // check object-style commit
  var ref = unifyObjectStyle(_type, _payload, _options);
    var type = ref.type;
    var payload = ref.payload;
    var options = ref.options;

  var mutation = { type: type, payload: payload };
  var entry = this._mutations[type];
  if (!entry) {
    if ((false)) {
      console.error(("[vuex] unknown mutation type: " + type));
    }
    return
  }
  this._withCommit(function () {
    entry.forEach(function commitIterator (handler) {
      handler(payload);
    });
  });

  this._subscribers
    .slice() // shallow copy to prevent iterator invalidation if subscriber synchronously calls unsubscribe
    .forEach(function (sub) { return sub(mutation, this$1.state); });

  if (
    false
  ) {
    console.warn(
      "[vuex] mutation type: " + type + ". Silent option has been removed. " +
      'Use the filter functionality in the vue-devtools'
    );
  }
};

Store.prototype.dispatch = function dispatch (_type, _payload) {
    var this$1 = this;

  // check object-style dispatch
  var ref = unifyObjectStyle(_type, _payload);
    var type = ref.type;
    var payload = ref.payload;

  var action = { type: type, payload: payload };
  var entry = this._actions[type];
  if (!entry) {
    if ((false)) {
      console.error(("[vuex] unknown action type: " + type));
    }
    return
  }

  try {
    this._actionSubscribers
      .slice() // shallow copy to prevent iterator invalidation if subscriber synchronously calls unsubscribe
      .filter(function (sub) { return sub.before; })
      .forEach(function (sub) { return sub.before(action, this$1.state); });
  } catch (e) {
    if ((false)) {
      console.warn("[vuex] error in before action subscribers: ");
      console.error(e);
    }
  }

  var result = entry.length > 1
    ? Promise.all(entry.map(function (handler) { return handler(payload); }))
    : entry[0](payload);

  return new Promise(function (resolve, reject) {
    result.then(function (res) {
      try {
        this$1._actionSubscribers
          .filter(function (sub) { return sub.after; })
          .forEach(function (sub) { return sub.after(action, this$1.state); });
      } catch (e) {
        if ((false)) {
          console.warn("[vuex] error in after action subscribers: ");
          console.error(e);
        }
      }
      resolve(res);
    }, function (error) {
      try {
        this$1._actionSubscribers
          .filter(function (sub) { return sub.error; })
          .forEach(function (sub) { return sub.error(action, this$1.state, error); });
      } catch (e) {
        if ((false)) {
          console.warn("[vuex] error in error action subscribers: ");
          console.error(e);
        }
      }
      reject(error);
    });
  })
};

Store.prototype.subscribe = function subscribe (fn, options) {
  return genericSubscribe(fn, this._subscribers, options)
};

Store.prototype.subscribeAction = function subscribeAction (fn, options) {
  var subs = typeof fn === 'function' ? { before: fn } : fn;
  return genericSubscribe(subs, this._actionSubscribers, options)
};

Store.prototype.watch = function watch (getter, cb, options) {
    var this$1 = this;

  if ((false)) {
    assert(typeof getter === 'function', "store.watch only accepts a function.");
  }
  return this._watcherVM.$watch(function () { return getter(this$1.state, this$1.getters); }, cb, options)
};

Store.prototype.replaceState = function replaceState (state) {
    var this$1 = this;

  this._withCommit(function () {
    this$1._vm._data.$$state = state;
  });
};

Store.prototype.registerModule = function registerModule (path, rawModule, options) {
    if ( options === void 0 ) options = {};

  if (typeof path === 'string') { path = [path]; }

  if ((false)) {
    assert(Array.isArray(path), "module path must be a string or an Array.");
    assert(path.length > 0, 'cannot register the root module by using registerModule.');
  }

  this._modules.register(path, rawModule);
  installModule(this, this.state, path, this._modules.get(path), options.preserveState);
  // reset store to update getters...
  resetStoreVM(this, this.state);
};

Store.prototype.unregisterModule = function unregisterModule (path) {
    var this$1 = this;

  if (typeof path === 'string') { path = [path]; }

  if ((false)) {
    assert(Array.isArray(path), "module path must be a string or an Array.");
  }

  this._modules.unregister(path);
  this._withCommit(function () {
    var parentState = getNestedState(this$1.state, path.slice(0, -1));
    Vue.delete(parentState, path[path.length - 1]);
  });
  resetStore(this);
};

Store.prototype.hasModule = function hasModule (path) {
  if (typeof path === 'string') { path = [path]; }

  if ((false)) {
    assert(Array.isArray(path), "module path must be a string or an Array.");
  }

  return this._modules.isRegistered(path)
};

Store.prototype.hotUpdate = function hotUpdate (newOptions) {
  this._modules.update(newOptions);
  resetStore(this, true);
};

Store.prototype._withCommit = function _withCommit (fn) {
  var committing = this._committing;
  this._committing = true;
  fn();
  this._committing = committing;
};

Object.defineProperties( Store.prototype, prototypeAccessors$1 );

function genericSubscribe (fn, subs, options) {
  if (subs.indexOf(fn) < 0) {
    options && options.prepend
      ? subs.unshift(fn)
      : subs.push(fn);
  }
  return function () {
    var i = subs.indexOf(fn);
    if (i > -1) {
      subs.splice(i, 1);
    }
  }
}

function resetStore (store, hot) {
  store._actions = Object.create(null);
  store._mutations = Object.create(null);
  store._wrappedGetters = Object.create(null);
  store._modulesNamespaceMap = Object.create(null);
  var state = store.state;
  // init all modules
  installModule(store, state, [], store._modules.root, true);
  // reset vm
  resetStoreVM(store, state, hot);
}

function resetStoreVM (store, state, hot) {
  var oldVm = store._vm;

  // bind store public getters
  store.getters = {};
  // reset local getters cache
  store._makeLocalGettersCache = Object.create(null);
  var wrappedGetters = store._wrappedGetters;
  var computed = {};
  forEachValue(wrappedGetters, function (fn, key) {
    // use computed to leverage its lazy-caching mechanism
    // direct inline function use will lead to closure preserving oldVm.
    // using partial to return function with only arguments preserved in closure environment.
    computed[key] = partial(fn, store);
    Object.defineProperty(store.getters, key, {
      get: function () { return store._vm[key]; },
      enumerable: true // for local getters
    });
  });

  // use a Vue instance to store the state tree
  // suppress warnings just in case the user has added
  // some funky global mixins
  var silent = Vue.config.silent;
  Vue.config.silent = true;
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed: computed
  });
  Vue.config.silent = silent;

  // enable strict mode for new vm
  if (store.strict) {
    enableStrictMode(store);
  }

  if (oldVm) {
    if (hot) {
      // dispatch changes in all subscribed watchers
      // to force getter re-evaluation for hot reloading.
      store._withCommit(function () {
        oldVm._data.$$state = null;
      });
    }
    Vue.nextTick(function () { return oldVm.$destroy(); });
  }
}

function installModule (store, rootState, path, module, hot) {
  var isRoot = !path.length;
  var namespace = store._modules.getNamespace(path);

  // register in namespace map
  if (module.namespaced) {
    if (store._modulesNamespaceMap[namespace] && ("production" !== 'production')) {
      console.error(("[vuex] duplicate namespace " + namespace + " for the namespaced module " + (path.join('/'))));
    }
    store._modulesNamespaceMap[namespace] = module;
  }

  // set state
  if (!isRoot && !hot) {
    var parentState = getNestedState(rootState, path.slice(0, -1));
    var moduleName = path[path.length - 1];
    store._withCommit(function () {
      if ((false)) {
        if (moduleName in parentState) {
          console.warn(
            ("[vuex] state field \"" + moduleName + "\" was overridden by a module with the same name at \"" + (path.join('.')) + "\"")
          );
        }
      }
      Vue.set(parentState, moduleName, module.state);
    });
  }

  var local = module.context = makeLocalContext(store, namespace, path);

  module.forEachMutation(function (mutation, key) {
    var namespacedType = namespace + key;
    registerMutation(store, namespacedType, mutation, local);
  });

  module.forEachAction(function (action, key) {
    var type = action.root ? key : namespace + key;
    var handler = action.handler || action;
    registerAction(store, type, handler, local);
  });

  module.forEachGetter(function (getter, key) {
    var namespacedType = namespace + key;
    registerGetter(store, namespacedType, getter, local);
  });

  module.forEachChild(function (child, key) {
    installModule(store, rootState, path.concat(key), child, hot);
  });
}

/**
 * make localized dispatch, commit, getters and state
 * if there is no namespace, just use root ones
 */
function makeLocalContext (store, namespace, path) {
  var noNamespace = namespace === '';

  var local = {
    dispatch: noNamespace ? store.dispatch : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if (false) {
          console.error(("[vuex] unknown local action type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      return store.dispatch(type, payload)
    },

    commit: noNamespace ? store.commit : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if (false) {
          console.error(("[vuex] unknown local mutation type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      store.commit(type, payload, options);
    }
  };

  // getters and state object must be gotten lazily
  // because they will be changed by vm update
  Object.defineProperties(local, {
    getters: {
      get: noNamespace
        ? function () { return store.getters; }
        : function () { return makeLocalGetters(store, namespace); }
    },
    state: {
      get: function () { return getNestedState(store.state, path); }
    }
  });

  return local
}

function makeLocalGetters (store, namespace) {
  if (!store._makeLocalGettersCache[namespace]) {
    var gettersProxy = {};
    var splitPos = namespace.length;
    Object.keys(store.getters).forEach(function (type) {
      // skip if the target getter is not match this namespace
      if (type.slice(0, splitPos) !== namespace) { return }

      // extract local getter type
      var localType = type.slice(splitPos);

      // Add a port to the getters proxy.
      // Define as getter property because
      // we do not want to evaluate the getters in this time.
      Object.defineProperty(gettersProxy, localType, {
        get: function () { return store.getters[type]; },
        enumerable: true
      });
    });
    store._makeLocalGettersCache[namespace] = gettersProxy;
  }

  return store._makeLocalGettersCache[namespace]
}

function registerMutation (store, type, handler, local) {
  var entry = store._mutations[type] || (store._mutations[type] = []);
  entry.push(function wrappedMutationHandler (payload) {
    handler.call(store, local.state, payload);
  });
}

function registerAction (store, type, handler, local) {
  var entry = store._actions[type] || (store._actions[type] = []);
  entry.push(function wrappedActionHandler (payload) {
    var res = handler.call(store, {
      dispatch: local.dispatch,
      commit: local.commit,
      getters: local.getters,
      state: local.state,
      rootGetters: store.getters,
      rootState: store.state
    }, payload);
    if (!isPromise(res)) {
      res = Promise.resolve(res);
    }
    if (store._devtoolHook) {
      return res.catch(function (err) {
        store._devtoolHook.emit('vuex:error', err);
        throw err
      })
    } else {
      return res
    }
  });
}

function registerGetter (store, type, rawGetter, local) {
  if (store._wrappedGetters[type]) {
    if ((false)) {
      console.error(("[vuex] duplicate getter key: " + type));
    }
    return
  }
  store._wrappedGetters[type] = function wrappedGetter (store) {
    return rawGetter(
      local.state, // local state
      local.getters, // local getters
      store.state, // root state
      store.getters // root getters
    )
  };
}

function enableStrictMode (store) {
  store._vm.$watch(function () { return this._data.$$state }, function () {
    if ((false)) {
      assert(store._committing, "do not mutate vuex store state outside mutation handlers.");
    }
  }, { deep: true, sync: true });
}

function getNestedState (state, path) {
  return path.reduce(function (state, key) { return state[key]; }, state)
}

function unifyObjectStyle (type, payload, options) {
  if (isObject(type) && type.type) {
    options = payload;
    payload = type;
    type = type.type;
  }

  if ((false)) {
    assert(typeof type === 'string', ("expects string as the type, but found " + (typeof type) + "."));
  }

  return { type: type, payload: payload, options: options }
}

function install (_Vue) {
  if (Vue && _Vue === Vue) {
    if ((false)) {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      );
    }
    return
  }
  Vue = _Vue;
  applyMixin(Vue);
}

/**
 * Reduce the code which written in Vue.js for getting the state.
 * @param {String} [namespace] - Module's namespace
 * @param {Object|Array} states # Object's item can be a function which accept state and getters for param, you can do something for state and getters in it.
 * @param {Object}
 */
var mapState = normalizeNamespace(function (namespace, states) {
  var res = {};
  if (false) {
    console.error('[vuex] mapState: mapper parameter must be either an Array or an Object');
  }
  normalizeMap(states).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedState () {
      var state = this.$store.state;
      var getters = this.$store.getters;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapState', namespace);
        if (!module) {
          return
        }
        state = module.context.state;
        getters = module.context.getters;
      }
      return typeof val === 'function'
        ? val.call(this, state, getters)
        : state[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

/**
 * Reduce the code which written in Vue.js for committing the mutation
 * @param {String} [namespace] - Module's namespace
 * @param {Object|Array} mutations # Object's item can be a function which accept `commit` function as the first param, it can accept another params. You can commit mutation and do any other things in this function. specially, You need to pass anthor params from the mapped function.
 * @return {Object}
 */
var mapMutations = normalizeNamespace(function (namespace, mutations) {
  var res = {};
  if (false) {
    console.error('[vuex] mapMutations: mapper parameter must be either an Array or an Object');
  }
  normalizeMap(mutations).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedMutation () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      // Get the commit method from store
      var commit = this.$store.commit;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapMutations', namespace);
        if (!module) {
          return
        }
        commit = module.context.commit;
      }
      return typeof val === 'function'
        ? val.apply(this, [commit].concat(args))
        : commit.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

/**
 * Reduce the code which written in Vue.js for getting the getters
 * @param {String} [namespace] - Module's namespace
 * @param {Object|Array} getters
 * @return {Object}
 */
var mapGetters = normalizeNamespace(function (namespace, getters) {
  var res = {};
  if (false) {
    console.error('[vuex] mapGetters: mapper parameter must be either an Array or an Object');
  }
  normalizeMap(getters).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    // The namespace has been mutated by normalizeNamespace
    val = namespace + val;
    res[key] = function mappedGetter () {
      if (namespace && !getModuleByNamespace(this.$store, 'mapGetters', namespace)) {
        return
      }
      if (false) {
        console.error(("[vuex] unknown getter: " + val));
        return
      }
      return this.$store.getters[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

/**
 * Reduce the code which written in Vue.js for dispatch the action
 * @param {String} [namespace] - Module's namespace
 * @param {Object|Array} actions # Object's item can be a function which accept `dispatch` function as the first param, it can accept anthor params. You can dispatch action and do any other things in this function. specially, You need to pass anthor params from the mapped function.
 * @return {Object}
 */
var mapActions = normalizeNamespace(function (namespace, actions) {
  var res = {};
  if (false) {
    console.error('[vuex] mapActions: mapper parameter must be either an Array or an Object');
  }
  normalizeMap(actions).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedAction () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      // get dispatch function from store
      var dispatch = this.$store.dispatch;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapActions', namespace);
        if (!module) {
          return
        }
        dispatch = module.context.dispatch;
      }
      return typeof val === 'function'
        ? val.apply(this, [dispatch].concat(args))
        : dispatch.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

/**
 * Rebinding namespace param for mapXXX function in special scoped, and return them by simple object
 * @param {String} namespace
 * @return {Object}
 */
var createNamespacedHelpers = function (namespace) { return ({
  mapState: mapState.bind(null, namespace),
  mapGetters: mapGetters.bind(null, namespace),
  mapMutations: mapMutations.bind(null, namespace),
  mapActions: mapActions.bind(null, namespace)
}); };

/**
 * Normalize the map
 * normalizeMap([1, 2, 3]) => [ { key: 1, val: 1 }, { key: 2, val: 2 }, { key: 3, val: 3 } ]
 * normalizeMap({a: 1, b: 2, c: 3}) => [ { key: 'a', val: 1 }, { key: 'b', val: 2 }, { key: 'c', val: 3 } ]
 * @param {Array|Object} map
 * @return {Object}
 */
function normalizeMap (map) {
  if (!isValidMap(map)) {
    return []
  }
  return Array.isArray(map)
    ? map.map(function (key) { return ({ key: key, val: key }); })
    : Object.keys(map).map(function (key) { return ({ key: key, val: map[key] }); })
}

/**
 * Validate whether given map is valid or not
 * @param {*} map
 * @return {Boolean}
 */
function isValidMap (map) {
  return Array.isArray(map) || isObject(map)
}

/**
 * Return a function expect two param contains namespace and map. it will normalize the namespace and then the param's function will handle the new namespace and the map.
 * @param {Function} fn
 * @return {Function}
 */
function normalizeNamespace (fn) {
  return function (namespace, map) {
    if (typeof namespace !== 'string') {
      map = namespace;
      namespace = '';
    } else if (namespace.charAt(namespace.length - 1) !== '/') {
      namespace += '/';
    }
    return fn(namespace, map)
  }
}

/**
 * Search a special module from store by namespace. if module not exist, print error message.
 * @param {Object} store
 * @param {String} helper
 * @param {String} namespace
 * @return {Object}
 */
function getModuleByNamespace (store, helper, namespace) {
  var module = store._modulesNamespaceMap[namespace];
  if (false) {
    console.error(("[vuex] module namespace not found in " + helper + "(): " + namespace));
  }
  return module
}

// Credits: borrowed code from fcomb/redux-logger

function createLogger (ref) {
  if ( ref === void 0 ) ref = {};
  var collapsed = ref.collapsed; if ( collapsed === void 0 ) collapsed = true;
  var filter = ref.filter; if ( filter === void 0 ) filter = function (mutation, stateBefore, stateAfter) { return true; };
  var transformer = ref.transformer; if ( transformer === void 0 ) transformer = function (state) { return state; };
  var mutationTransformer = ref.mutationTransformer; if ( mutationTransformer === void 0 ) mutationTransformer = function (mut) { return mut; };
  var actionFilter = ref.actionFilter; if ( actionFilter === void 0 ) actionFilter = function (action, state) { return true; };
  var actionTransformer = ref.actionTransformer; if ( actionTransformer === void 0 ) actionTransformer = function (act) { return act; };
  var logMutations = ref.logMutations; if ( logMutations === void 0 ) logMutations = true;
  var logActions = ref.logActions; if ( logActions === void 0 ) logActions = true;
  var logger = ref.logger; if ( logger === void 0 ) logger = console;

  return function (store) {
    var prevState = deepCopy(store.state);

    if (typeof logger === 'undefined') {
      return
    }

    if (logMutations) {
      store.subscribe(function (mutation, state) {
        var nextState = deepCopy(state);

        if (filter(mutation, prevState, nextState)) {
          var formattedTime = getFormattedTime();
          var formattedMutation = mutationTransformer(mutation);
          var message = "mutation " + (mutation.type) + formattedTime;

          startMessage(logger, message, collapsed);
          logger.log('%c prev state', 'color: #9E9E9E; font-weight: bold', transformer(prevState));
          logger.log('%c mutation', 'color: #03A9F4; font-weight: bold', formattedMutation);
          logger.log('%c next state', 'color: #4CAF50; font-weight: bold', transformer(nextState));
          endMessage(logger);
        }

        prevState = nextState;
      });
    }

    if (logActions) {
      store.subscribeAction(function (action, state) {
        if (actionFilter(action, state)) {
          var formattedTime = getFormattedTime();
          var formattedAction = actionTransformer(action);
          var message = "action " + (action.type) + formattedTime;

          startMessage(logger, message, collapsed);
          logger.log('%c action', 'color: #03A9F4; font-weight: bold', formattedAction);
          endMessage(logger);
        }
      });
    }
  }
}

function startMessage (logger, message, collapsed) {
  var startMessage = collapsed
    ? logger.groupCollapsed
    : logger.group;

  // render
  try {
    startMessage.call(logger, message);
  } catch (e) {
    logger.log(message);
  }
}

function endMessage (logger) {
  try {
    logger.groupEnd();
  } catch (e) {
    logger.log('—— log end ——');
  }
}

function getFormattedTime () {
  var time = new Date();
  return (" @ " + (pad(time.getHours(), 2)) + ":" + (pad(time.getMinutes(), 2)) + ":" + (pad(time.getSeconds(), 2)) + "." + (pad(time.getMilliseconds(), 3)))
}

function repeat (str, times) {
  return (new Array(times + 1)).join(str)
}

function pad (num, maxLength) {
  return repeat('0', maxLength - num.toString().length) + num
}

var index = {
  Store: Store,
  install: install,
  version: '3.6.2',
  mapState: mapState,
  mapMutations: mapMutations,
  mapGetters: mapGetters,
  mapActions: mapActions,
  createNamespacedHelpers: createNamespacedHelpers,
  createLogger: createLogger
};

/* harmony default export */ __webpack_exports__["default"] = (index);


/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(13)))

/***/ }),

/***/ 112:
/***/ (function(module, exports, __webpack_require__) {

var _typeof = __webpack_require__(39)["default"];
var toPrimitive = __webpack_require__(263);
function toPropertyKey(t) {
  var i = toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
module.exports = toPropertyKey, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ 13:
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ 161:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var scope = (typeof global !== "undefined" && global) ||
            (typeof self !== "undefined" && self) ||
            window;
var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, scope, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, scope, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(scope, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(354);
// On some exotic environments, it's not clear which object `setimmediate` was
// able to install onto.  Search each possibility in the same order as the
// `setimmediate` library.
exports.setImmediate = (typeof self !== "undefined" && self.setImmediate) ||
                       (typeof global !== "undefined" && global.setImmediate) ||
                       (this && this.setImmediate);
exports.clearImmediate = (typeof self !== "undefined" && self.clearImmediate) ||
                         (typeof global !== "undefined" && global.clearImmediate) ||
                         (this && this.clearImmediate);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13)))

/***/ }),

/***/ 162:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ 163:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(19);
var settle = __webpack_require__(367);
var buildURL = __webpack_require__(369);
var parseHeaders = __webpack_require__(370);
var isURLSameOrigin = __webpack_require__(371);
var createError = __webpack_require__(164);

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies = __webpack_require__(372);

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
          cookies.read(config.xsrfCookieName) :
          undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (config.withCredentials) {
      request.withCredentials = true;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ 164:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var enhanceError = __webpack_require__(368);

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ 165:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ 166:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ 167:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SpineAnimation = SpineAnimation;
var _spineCanvas = __webpack_require__(385);
var spine = _spineCanvas.Spine;

/* eslint-disable no-var */
/* eslint-disable no-unused-vars */
var animationsCount = 0;
var spineAnimations = [];
var spineAnimationsCounter = [];
function SpineAnimation(spineFileName, w, h, sx, sy, autoPlay, clone, texturesCount) {
  if (autoPlay == null) {
    autoPlay = false;
  }
  if (clone == null) {
    clone = false;
  }
  if (clone && spineAnimations[spineFileName]) {
    spineAnimationsCounter[spineFileName]++;
    return spineAnimations[spineFileName];
  }
  if (clone) {
    spineAnimationsCounter[spineFileName] = 1;
  }
  spineAnimations[spineFileName] = this;
  var context;
  var canvas;
  var spineSkeleton;
  var spineAnimationState;
  this.getContext = function () {
    return context;
  };
  this.getCanvas = function () {
    return canvas;
  };
  this.getAnimation = function () {
    return spineAnimationState;
  };
  this.getSkeleton = function () {
    return spineSkeleton;
  };
  var isPlaying = false;
  var assetsLoaded = false;
  var animOffsetX = 0;
  var animOffsetY = 0;
  var doCenterAnimation = true;
  var onloadCommandQueue = [];
  var canvasWidth = 600;
  var canvasHeight = 600;
  var manualCanvasSize = false;
  if (w > 0 && h > 0) {
    canvasWidth = w;
    canvasHeight = h;
    manualCanvasSize = true;
  }
  var canvasScaleX = 1;
  var canvasScaleY = 1;
  if (sx > 0) {
    canvasScaleX = sx;
  }
  if (sy > 0) {
    canvasScaleY = sx;
  }

  // canvas = document.getElementById("canvas");
  canvas = document.createElement('canvas');
  canvas.setAttribute('id', spineFileName + 'Canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  context = canvas.getContext('2d');
  var lastFrameTime = Date.now() / 1000;
  var url = window['configurationUrl'];

  // start loading assets
  var skeletonRenderer = new spine.canvas.SkeletonRenderer(context);
  // enable debug rendering
  // skeletonRenderer.debugRendering = true;
  // enable the triangle renderer, supports meshes, but may produce artifacts in some browsers
  skeletonRenderer.triangleRendering = false;
  var assetManager = new spine.canvas.AssetManager();
  assetManager.loadText(url + spineFileName + '.json');
  assetManager.loadText(url + spineFileName + '.atlas');
  if (!texturesCount) {
    assetManager.loadTexture(url + spineFileName + '.png');
  } else {
    for (var i = 0; i < texturesCount; i++) {
      var textureIndex = i > 0 ? i + 1 : '';
      var fileName = "".concat(url).concat(spineFileName).concat(textureIndex, ".png");
      assetManager.loadTexture(fileName);
    }
  }
  animationsCount++;
  this.currentAnimName = null;
  this.currentAnimLoop = false;
  // console.info(spineFileName, "test: animations counter: ", animationsCount);

  // console.log("test: loading anim:", spineFileName);
  // called on a loop untill assets are loaded
  this.loadingAssets = function () {
    if (canvas == null) {
      return;
    }
    if (assetManager.isLoadingComplete()) {
      // Load the texture atlas using spineFileName.atlas
      // and spineFileName.png from the AssetManager.
      // The function passed to TextureAtlas is used to resolve relative paths.
      var file = assetManager.get(url + spineFileName + '.atlas');
      if (!file) {
        /* eslint-disable no-console */
        console.error('Could not load:', spineFileName + '.atlas');
        return;
      }
      var atlas = new spine.TextureAtlas(file, function (path) {
        return assetManager.get(url + path);
      });

      // Create a AtlasAttachmentLoader, which is specific to the WebGL backend.
      var atlasLoader = new spine.AtlasAttachmentLoader(atlas);

      // Create a SkeletonJson instance for parsing the .json file.
      var skeletonJson = new spine.SkeletonJson(atlasLoader);

      // Set the scale to apply during parsing, parse the file, and create a new skeleton.
      var skeleton = assetManager.get(url + spineFileName + '.json');
      var skeletonData = skeletonJson.readSkeletonData(skeleton);
      spineSkeleton = new spine.Skeleton(skeletonData);
      spineSkeleton.flipY = true;
      spineSkeleton.setToSetupPose();
      spineSkeleton.updateWorldTransform();
      var offset = new spine.Vector2();
      var size = new spine.Vector2();
      spineSkeleton.getBounds(offset, size, []);
      if (!manualCanvasSize) {
        canvasWidth = Math.ceil(size.x);
        canvasHeight = Math.ceil(size.y);
        setCanvasSize();
        animOffsetX = offset.x;
        animOffsetY = offset.y;
      }
      spineSkeleton.setSkinByName('default');

      // Create an AnimationState, and set the initial animation in looping mode.
      var stateData = new spine.AnimationStateData(spineSkeleton.data);
      spineAnimationState = new spine.AnimationState(stateData);
      spineAnimationState.addListener({
        event: function event(trackIndex, _event) {
          // console.log("Event on track " + trackIndex + ": " + JSON.stringify(event));
          canvas.dispatchEvent(new Event('animation_event'));
        },
        complete: function complete(trackIndex, loopCount) {
          // console.log("Animation on track " + trackIndex + " completed");
          canvas.dispatchEvent(new Event('animation_complete'));
        },
        start: function start(trackIndex) {
          // console.log("Animation on track " + trackIndex + " started");
          canvas.dispatchEvent(new Event('animation_start'));
        },
        end: function end(trackIndex) {
          // console.log("Animation on track " + trackIndex + " ended");
          canvas.dispatchEvent(new Event('animation_end'));
        }
      });
      assetsLoaded = true;
      for (var _i = 0; _i < onloadCommandQueue.length; _i++) {
        var command = onloadCommandQueue[_i];
        var commandName = command[0];
        if (commandName == 'play') {
          this.play(command[1], command[2], command[3]);
        }
        if (commandName == 'pause') {
          this.pause();
        }
        if (commandName == 'resume') {
          this.resume();
        }
      }

      // console.log("test: animations loaded!");
    } else {
      window.requestAnimationFrame(this.loadingAssets.bind(this));
    }
    canvas.dispatchEvent(new Event('load_complete'));
  };
  this.play = function (animName, loop, add) {
    if (loop === undefined) {
      loop = true;
    }
    if (assetsLoaded && spineAnimationState) {
      this.currentAnimName = animName;
      this.currentAnimLoop = loop;
      if (add) {
        spineAnimationState.addAnimation(0, animName, loop, 0);
      } else {
        spineAnimationState.setAnimation(0, animName, loop);
      }
      if (!isPlaying) {
        isPlaying = true;
        window.requestAnimationFrame(this.render.bind(this));
      }
    } else {
      onloadCommandQueue.push(['play', animName, loop, add]);
    }
    return this;
  };
  this.pause = function () {
    if (assetsLoaded) {
      if (isPlaying) {
        isPlaying = false;
      }
    } else {
      onloadCommandQueue.push(['pause']);
    }
  };
  this.resume = function () {
    if (assetsLoaded) {
      if (!isPlaying) {
        isPlaying = true;
        window.requestAnimationFrame(this.render.bind(this));
      }
    } else {
      onloadCommandQueue.push(['resume']);
    }
  };
  this.setOffset = function (x, y) {
    doCenterAnimation = false;
    animOffsetX = x;
    animOffsetY = y;
  };
  this.setOffsetCentered = function () {
    doCenterAnimation = true;
  };

  // warning: this clears the canvas when the animation is paused
  this.setSize = function (w, h) {
    canvasWidth = w;
    canvasHeight = h;
    setCanvasSize();
  };
  var setCanvasSize = function setCanvasSize() {
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
  };
  this.render = function () {
    if (!isPlaying) {
      return;
    }
    context.clearRect(0, 0, canvas.width / canvasScaleX, canvas.height / canvasScaleY);
    var now = Date.now() / 1000;
    var delta = now - lastFrameTime;
    lastFrameTime = now;
    spineAnimationState.update(delta);
    spineAnimationState.apply(spineSkeleton);
    spineSkeleton.updateWorldTransform();
    if (doCenterAnimation) {
      spineSkeleton.x = canvasWidth / 2;
      spineSkeleton.y = canvasHeight / 2;
    } else {
      spineSkeleton.x = animOffsetX;
      spineSkeleton.y = animOffsetY;
    }
    skeletonRenderer.draw(spineSkeleton);
    window.requestAnimationFrame(this.render.bind(this));
  };
  this.dispose = function () {
    if (clone) {
      spineAnimationsCounter[spineFileName]--;
    }

    // only not cloned or last clone instances are disposed
    if (!clone || spineAnimationsCounter[spineFileName] == 0) {
      this.pause();
      animationsCount--;
      spineAnimations[spineFileName] = null;
      spineAnimationsCounter[spineFileName] = 0;

      // console.info("test: disposed! Animations counter: ", animationsCount);

      canvas = null;
      context = null;
      spineSkeleton = null;
      spineAnimationState = null;
    }
  };
  if (!autoPlay) {
    this.pause();
  }
  window.requestAnimationFrame(this.loadingAssets.bind(this));
}

/***/ }),

/***/ 19:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(162);
var isBuffer = __webpack_require__(364);

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim
};


/***/ }),

/***/ 2:
/***/ (function(module, exports) {

function _interopRequireDefault(e) {
  return e && e.__esModule ? e : {
    "default": e
  };
}
module.exports = _interopRequireDefault, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ 21:
/***/ (function(module, exports) {

function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
module.exports = _classCallCheck, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ 22:
/***/ (function(module, exports, __webpack_require__) {

var toPropertyKey = __webpack_require__(112);
function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, toPropertyKey(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
    writable: !1
  }), e;
}
module.exports = _createClass, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ 26:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(2);
var _axios = _interopRequireDefault(__webpack_require__(362));
var Maths = function (module) {
  var lerp = function lerp(value, target, t) {
    t = clamp(t, 0, 1);
    return value + t * (target - value);
  }; // lerp

  var clamp = function clamp(v, min, max) {
    if (v < min) return min;
    if (v > max) return max;
    return v;
  };
  var fixed = function fixed(value, precision) {
    var n = Math.pow(10, precision);
    return ~~(value * n) / n;
  };
  module.lerp = lerp;
  module.clamp = clamp;
  module.fixed = fixed;
  return module;
}({});
window['Maths'] = Maths;
var Utils = function (module) {
  var prettyTime = function prettyTime() {
    var now = new Date();

    // Create an array with the current month, day and time
    var date = [now.getMonth() + 1, now.getDate(), now.getFullYear()];

    // Create an array with the current hour, minute and second
    var time = [now.getHours(), now.getMinutes(), now.getSeconds()];

    // Determine AM or PM suffix based on the hour
    // var suffix = ( time[0] < 12 ) ? "AM" : "PM";

    // Convert hour from military time
    // time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12;

    // If hour is 0, set it to 12
    // time[0] = time[0] || 12;

    // If seconds and minutes are less than 10, add a zero
    for (var i = 1; i < 3; i++) {
      if (time[i] < 10) {
        time[i] = '0' + time[i];
      }
    }

    // Return the formatted string
    return '[' + date.join('/') + ' ' + time.join(':') + ']';
  }; // prettyTime

  module.ptime = prettyTime;
  return module;
}({});
window['Utils'] = Utils;

// String prototype to replaceAll
/* eslint-disable no-extend-native*/
String.prototype.replaceAll = function (target, newStr) {
  var retStr = this;
  while (retStr.indexOf(target) != -1) {
    retStr = retStr.replace(target, newStr);
  }
  return retStr;
};
if (!String.prototype.startsWith) {
  /* eslint-disable no-extend-native*/
  String.prototype.startsWith = function (searchString, position) {
    return this.substr(position || 0, searchString.length) === searchString;
  };
}
function isEmpty(val) {
  return val == null || val == undefined || val === '';
}
function normalizeAngle(ang) {
  while (ang < -Math.PI) ang += Math.PI * 2;
  while (ang > Math.PI) ang -= Math.PI * 2;
  return ang;
}
function RGBtoStyle(c) {
  var str = c.toString(16);
  while (str.length < 6) str = '0' + str;
  return '#' + str;
}
function clamp(v, min, max) {
  if (v < min) return min;
  if (v > max) return max;
  return v;
}
function smoothStep(x) {
  x = clamp(x, 0.0, 1.0);
  return x;
  // return x*x*(3 - 2*x);
}
function smoothStep2(x) {
  x = clamp(x, 0.0, 1.0);
  return x * x * (3 - 2 * x);
}
function shuffle(array) {
  var counter = array.length;
  var temp;
  var index;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}
if (!Date.now) {
  Date.now = function () {
    return new Date().getTime();
  };
}

// requestAnimationFrame polyfill
/*
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                    || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if(!window.requestAnimationFrame){
        window.requestAnimationFrame = function(callback, element) {
            return setTimeout(callback, 1000 / 60);
        };

        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
}());
*/

/* eslint-disable no-extend-native*/
String.prototype.toCamelCase = function () {
  return this.substring(0, 1).toUpperCase() + this.substring(1);
};
function get(selector) {
  return document.querySelectorAll(selector)[0];
}
function show(selector) {
  var elem = get(selector);
  if (elem) {
    elem.style.display = 'block';
  }
}
function hide(selector) {
  var elem = get(selector);
  if (elem) {
    elem.style.display = 'none';
  }
}
function empty(selector) {
  var elem = get(selector);
  if (elem) {
    while (elem.firstChild) {
      elem.removeChild(elem.firstChild);
    }
  }
}
function addClass(selector, className) {
  var elem = get(selector);
  if (elem) {
    var classes = className.split(' ');
    for (var i = 0; i < classes.length; i++) {
      elem.classList.add(classes[i]);
    }
  }
}
function removeClass(selector, className) {
  var elem = get(selector);
  if (elem) {
    var classes = className.split(' ');
    for (var i = 0; i < classes.length; i++) {
      elem.classList.remove(classes[i]);
    }
  }
}
function setAttribute(selector, attribute, value) {
  get(selector).setAttribute(attribute, value);
}
function load(url, callback) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (this.status >= 200 && this.status < 400) {
        if (callback) {
          callback(this.responseText);
        }
      }
    }
  };
  request.send();
  request = null;
}
function fadeIn(selector, duration) {
  var elem = get(selector);
  var opacity = 0;
  elem.style.opacity = 0;
  elem.style.filter = '';
  var last = +new Date();
  var _tick = function tick() {
    opacity += (new Date() - last) / duration;
    elem.style.opacity = opacity;
    elem.style.filter = 'alpha(opacity=' + 100 * opacity | 0 + ')';
    last = +new Date();
    if (opacity < 1) {
      window.requestAnimationFrame && requestAnimationFrame(_tick) || setTimeout(_tick, 16);
    } else {
      show(selector);
    }
  };
  _tick();
}
function fadeOut(selector, duration) {
  var elem = get(selector);
  var opacity = 100;
  elem.style.opacity = 100;
  elem.style.filter = '';
  var last = +new Date();
  var _tick2 = function tick() {
    opacity -= (new Date() - last) / duration;
    elem.style.opacity = opacity;
    elem.style.filter = 'alpha(opacity=' + 100 * opacity | 0 + ')';
    last = +new Date();
    if (opacity < 1) {
      window.requestAnimationFrame && requestAnimationFrame(_tick2) || setTimeout(_tick2, 16);
    } else {
      hide(selector);
    }
  };
  _tick2();
}
function isVisible(selector) {
  var elem = get(selector);
  if (elem) {
    return elem.offsetWidth > 0 && elem.offsetHeight > 0;
  }
  return false;
}
function ajax(url, onLoad, onError) {
  _axios["default"].get(url).then(onLoad)["catch"](onError);
}
module.exports = {
  isEmpty: isEmpty,
  normalizeAngle: normalizeAngle,
  RGBtoStyle: RGBtoStyle,
  clamp: clamp,
  smoothStep: smoothStep,
  smoothStep2: smoothStep2,
  shuffle: shuffle,
  get: get,
  show: show,
  hide: hide,
  empty: empty,
  addClass: addClass,
  removeClass: removeClass,
  setAttribute: setAttribute,
  load: load,
  fadeIn: fadeIn,
  fadeOut: fadeOut,
  isVisible: isVisible,
  ajax: ajax
};

/***/ }),

/***/ 263:
/***/ (function(module, exports, __webpack_require__) {

var _typeof = __webpack_require__(39)["default"];
function toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
module.exports = toPrimitive, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ 33:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = exports["default"] = Object.freeze({
  // Storage Object Keys
  LOCAL_STORAGE_KEY: 'storeUsersObject',
  LOCAL_GUEST_KEY: 'Guest',
  STORAGE_INFO_KEY: 'storeObjectInfo',
  // Storage Properties Keys
  SETTINGS: 'settings',
  HAS_PLAYED_TEAMS: 'hasPlayedTeams',
  SESSION_COUNTER: 'session_counter',
  FACEBOOK_FRIENDS: 'facebookFriends',
  STORED_OBJECT_INFO: 'storeObjectInfo',
  MYSTERY_SKIN_NOTIFICATION: 'mysterySkinNotifications',
  COOKIES_CONSENT: 'cookies_consent',
  PRIVACY_SETTINGS: 'privacy_settings',
  LAST_VIDEO_TIMESTAMP: 'last_video_timestamp',
  GDPR_CONSENT: 'gdpr_consent',
  GDPR_BANNER_COUNTER: 'gdpr_banner_counter',
  HAS_OPENED_SKIN_EDITOR: 'has_opened_skin_editor',
  HAS_SEEN_SKIN_EDITOR_TUTORIAL: 'has_seen_skin_editor_tutorial',
  SKIN_EDITOR_CACHE: 'skin_editor_cache',
  PREVIOUS_PURCHASE_INTENTION_DIALOG: 'previous_purchase_intention_dialog'
});

/***/ }),

/***/ 354:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13), __webpack_require__(82)))

/***/ }),

/***/ 355:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ModuleGame = exports.LoginState = exports.GameState = exports.GameMode = void 0;
var GameState = exports.GameState = {
  HOME: 0,
  PLAY: 1,
  GAMEOVER: 2,
  SPECTATE: 3
};
var GameMode = exports.GameMode = {
  FFA: ':ffa',
  BATTLEROYALE: ':battleroyale',
  EXPERIMENTAL: ':experimental',
  TEAMS: ':teams',
  TEAMRUSH: ':teamrush',
  PARTY: ':party'
};
var LoginState = exports.LoginState = {
  INIT: 0,
  WAIT: 1,
  IN: 2,
  OUT: 3
};
var ModuleGame = exports.ModuleGame = {
  namespaced: true,
  state: {
    value: GameState.HOME,
    login: LoginState.INIT,
    loginRealm: 'guest',
    connected: false,
    mode: null,
    prevGameMode: null,
    nextGameMode: null,
    country: null,
    region: null,
    regions: null,
    version: null,
    firstView: true,
    confirm: false
  },
  actions: {
    countryUpdate: function countryUpdate(state, country) {
      this.commit('game/countryUpdate', country);
    }
  },
  mutations: {
    gameUpdate: function gameUpdate(state, value) {
      var delay = 0;
      if (value === GameState.HOME) {
        delay = 1000;
      }
      setTimeout(function () {
        // console.log('state:', state.value, '=>', value);
        state.value = value;
        // View state has changed, will not be first anymore
        state.firstView = false;
      }, delay);
    },
    connectUpdate: function connectUpdate(state, value) {
      setTimeout(function () {
        state.connected = value;
        // Check if it was disconnected while playing
        if (!value && state.value == GameState.PLAY) {
          // Show main menu
          state.value = GameState.HOME;
        }
      }, 1000);
    },
    countryUpdate: function countryUpdate(state, country) {
      state.country = country;
      window.agarApp.country = country;
    },
    // REGIONS
    regionUpdate: function regionUpdate(state, region) {
      state.region = region;
    },
    regionsUpdate: function regionsUpdate(state, regions) {
      // console.log('test: regions update', regions);
      state.regions = [];
      for (var region in regions) {
        if (regions.hasOwnProperty(region) && region.toLowerCase() != 'unknown') {
          state.regions.push({
            name: region,
            count: regions[region].numPlayers
          });
        }
      }
    },
    //
    loginUpdate: function loginUpdate(state, value) {
      // console.log('test: login state', value);
      state.login = value.login[1];
    },
    loginRealmUpdate: function loginRealmUpdate(state, value) {
      state.loginRealm = value;
    },
    modeUpdate: function modeUpdate(state, value) {
      if (!value) {
        value = state.prevGameMode;
      }

      // console.log('test: game mode', state.mode, '=>', value);
      if (state.mode == value) return;
      if (state.mode != GameMode.PARTY && state.value != GameState.GAMEOVER) {
        state.prevGameMode = state.mode ? state.mode : GameMode.FFA;
        state.mode = value;
        window.location.hash = value.replace(':', '');
      } else {
        state.nextGameMode = value;
        state.confirm = true;
      }
    },
    versionTagUpdate: function versionTagUpdate(state, value) {
      state.version = value;
    }
  }
};

/***/ }),

/***/ 356:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PartyState = exports.ModuleParty = void 0;
var PartyState = exports.PartyState = {
  INIT: 0,
  CREATING: 1,
  JOINING: 2,
  JOINED: 3,
  LINK: 4,
  ERROR: 5,
  LEAVING: 6,
  ENTER: 7
};
var ModuleParty = exports.ModuleParty = {
  namespaced: true,
  state: {
    value: PartyState.INIT
  },
  mutations: {
    // PARTY MODE STATE MACHINE!
    partyUpdate: function partyUpdate(state, action) {
      switch (state.value) {
        case PartyState.INIT:
          if (action == 'create') state.value = PartyState.CREATING;else if (action == 'enter') state.value = PartyState.LINK;else if (action == 'join') state.value = PartyState.JOINING;
          break;
        case PartyState.CREATING:
          if (action == 'exit') state.value = PartyState.INIT;else if (action == 'created') state.value = PartyState.JOINED;else if (action == 'timeout') state.value = PartyState.ERROR;else if (action == 'error') state.value = PartyState.ERROR;
          break;
        case PartyState.JOINED:
          if (action == 'exit') this.commit('game/modeUpdate', null); // set to previous mode
          break;
        case PartyState.LINK:
          if (action == 'exit') state.value = PartyState.INIT;else if (action == 'join') state.value = PartyState.JOINING;
          break;
        case PartyState.JOINING:
          if (action == 'exit') state.value = PartyState.INIT;else if (action == 'party_full') state.value = PartyState.ERROR;else if (action == 'code_ok') state.value = PartyState.JOINED;else if (action == 'code_error') state.value = PartyState.ERROR;else if (action == 'timeout') state.value = PartyState.ERROR;
          break;
        case PartyState.ERROR:
          if (action == 'exit') state.value = PartyState.INIT;
          break;
      }
    }
  }
};

/***/ }),

/***/ 357:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(2);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ModuleUser = void 0;
var _vue = _interopRequireDefault(__webpack_require__(37));
var ModuleUser = exports.ModuleUser = {
  namespaced: true,
  state: {
    userId: null,
    userInfo: null,
    coin: 100,
    dna: 100,
    xpBoosts: {
      amount: 0,
      timer: 0
    },
    massBoosts: {
      amount: 0,
      timer: 0
    },
    potions: [null, null, null],
    mysterySkinNotificationCount: 0,
    customSkinTokensCount: 0,
    customSkinVipTokensCount: 0,
    skin: '',
    lastGameStats: {},
    deaths: 0
  },
  mutations: {
    versionUserIdUpdate: function versionUserIdUpdate(state, value) {
      state.userId = value;
    },
    userInfoUpdate: function userInfoUpdate(state, value) {
      state.userInfo = value;
    },
    coinUpdate: function coinUpdate(state, value) {
      state.coin = value;
    },
    dnaUpdate: function dnaUpdate(state, value) {
      state.dna = value;
    },
    mysterySkinNotificationCountUpdate: function mysterySkinNotificationCountUpdate(state, value) {
      state.mysterySkinNotificationCount = !value || value < 0 ? 0 : value;
    },
    customSkinTokensCountUpdate: function customSkinTokensCountUpdate(state, value) {
      state.customSkinTokensCount = !value || value < 0 ? 0 : value;
    },
    customSkinVipTokensCountUpdate: function customSkinVipTokensCountUpdate(state, value) {
      state.customSkinVipTokensCount = !value || value < 0 ? 0 : value;
    },
    xpBoostAmountUpdate: function xpBoostAmountUpdate(state, value) {
      _vue["default"].set(state.xpBoosts, 'amount', value);
    },
    xpBoostTimerUpdate: function xpBoostTimerUpdate(state, value) {
      _vue["default"].set(state.xpBoosts, 'timer', value);
    },
    massBoostAmountUpdate: function massBoostAmountUpdate(state, value) {
      _vue["default"].set(state.massBoosts, 'amount', value);
    },
    massBoostTimerUpdate: function massBoostTimerUpdate(state, value) {
      _vue["default"].set(state.massBoosts, 'timer', value);
    },
    potionUpdate: function potionUpdate(state, value) {
      _vue["default"].set(state.potions, value.slot - 1, value);
    },
    potionRefresh: function potionRefresh(state) {
      state.potions = [];
    },
    statsUpdate: function statsUpdate(state, value) {
      state.lastGameStats = value;
    },
    skinUpdate: function skinUpdate(state, value) {
      state.skin = value;
    }
  }
};

/***/ }),

/***/ 358:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(2);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ModuleSettings = void 0;
var _vue = _interopRequireDefault(__webpack_require__(37));
var _storage = _interopRequireDefault(__webpack_require__(53));
_storage["default"].load();
var labels = [];
labels['noSkins'] = 'page_option_no_skins';
labels['noNames'] = 'page_option_no_names';
labels['noColors'] = 'page_option_no_colors';
labels['showMass'] = 'page_option_show_mass';
labels['blackTheme'] = 'page_option_dark_theme';
labels['skipStats'] = 'page_option_skip_stats';
labels['showQuest'] = 'page_option_show_quest';
labels['playArenaSounds'] = 'menu_settings_arena_sfx';
labels['playMenuSounds'] = 'menu_settings_menu_sfx';
labels['showOnlineStatus'] = 'page_option_show_online_status';
// The availability of this option depends on a a/b test
// labels['showMinimap'] = 'menu_settings_minimap';

var ModuleSettings = exports.ModuleSettings = {
  namespaced: true,
  state: {
    options: _storage["default"].settings,
    labels: labels
  },
  actions: {
    load: function load(state) {
      _storage["default"].load();
      for (var key in _storage["default"].settings) {
        if (key && _storage["default"].settings && _storage["default"].settings.hasOwnProperty(key)) {
          this.commit('settings/update', {
            key: key,
            value: _storage["default"].settings[key]
          });
        }
      }
    },
    update: function update(state, option) {
      /*
      switch (option.key) {
      case 'showMinimap':
          window.core['setMinimap'](option.value);
          break;
      case 'minimizeMinimap':
          window.core['minimizeMinimap'](option.value);
          break;
      case 'playersMinimap':
          window.core['playersMinimap'](option.value);
          break;
      }
      */
      this.commit('settings/update', option);
    },
    remove: function remove(state, option) {
      this.commit('settings/remove', option);
    },
    add: function add(state, option) {
      if (state.options[option.key] != undefined) {
        option.value = state.options[option.key];
      }
      this.commit('settings/add', option);
      this.commit('settings/update', option);
    }
  },
  mutations: {
    update: function update(state, option) {
      _storage["default"].update(option.key, option.value);
      _vue["default"].set(this.state.settings.options, option.key, option.value);
    },
    remove: function remove(state, value) {
      _vue["default"]["delete"](state.settings, value);
    },
    add: function add(state, option) {
      _vue["default"].set(state.labels, option.key, option.label);
    }
  },
  getters: {
    labels: function labels(state) {
      return state.labels;
    }
  }
};

/***/ }),

/***/ 359:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ModuleAnalytics = void 0;
var ModuleAnalytics = exports.ModuleAnalytics = {
  namespaced: true,
  state: {
    init: false
  },
  mutations: {
    initUpdate: function initUpdate(state, value) {
      state.init = value;
    }
  },
  getters: {}
};

/***/ }),

/***/ 362:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(363);

/***/ }),

/***/ 363:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(19);
var bind = __webpack_require__(162);
var Axios = __webpack_require__(365);
var defaults = __webpack_require__(84);

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(utils.merge(defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(166);
axios.CancelToken = __webpack_require__(378);
axios.isCancel = __webpack_require__(165);

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(379);

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),

/***/ 364:
/***/ (function(module, exports) {

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}


/***/ }),

/***/ 365:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var defaults = __webpack_require__(84);
var utils = __webpack_require__(19);
var InterceptorManager = __webpack_require__(373);
var dispatchRequest = __webpack_require__(374);

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = utils.merge({
      url: arguments[0]
    }, arguments[1]);
  }

  config = utils.merge(defaults, {method: 'get'}, this.defaults, config);
  config.method = config.method.toLowerCase();

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ 366:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(19);

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ 367:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var createError = __webpack_require__(164);

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  // Note: status is not exposed by XDomainRequest
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ 368:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }
  error.request = request;
  error.response = response;
  return error;
};


/***/ }),

/***/ 369:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(19);

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ 37:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(global, setImmediate) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EffectScope", function() { return EffectScope; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "computed", function() { return computed; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "customRef", function() { return customRef; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Vue; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defineAsyncComponent", function() { return defineAsyncComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defineComponent", function() { return defineComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "del", function() { return del; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "effectScope", function() { return effectScope; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCurrentInstance", function() { return getCurrentInstance; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCurrentScope", function() { return getCurrentScope; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return h; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "inject", function() { return inject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isProxy", function() { return isProxy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isReactive", function() { return isReactive; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isReadonly", function() { return isReadonly; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isRef", function() { return isRef; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isShallow", function() { return isShallow; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "markRaw", function() { return markRaw; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mergeDefaults", function() { return mergeDefaults; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "nextTick", function() { return nextTick; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "onActivated", function() { return onActivated; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "onBeforeMount", function() { return onBeforeMount; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "onBeforeUnmount", function() { return onBeforeUnmount; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "onBeforeUpdate", function() { return onBeforeUpdate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "onDeactivated", function() { return onDeactivated; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "onErrorCaptured", function() { return onErrorCaptured; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "onMounted", function() { return onMounted; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "onRenderTracked", function() { return onRenderTracked; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "onRenderTriggered", function() { return onRenderTriggered; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "onScopeDispose", function() { return onScopeDispose; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "onServerPrefetch", function() { return onServerPrefetch; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "onUnmounted", function() { return onUnmounted; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "onUpdated", function() { return onUpdated; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "provide", function() { return provide; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "proxyRefs", function() { return proxyRefs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "reactive", function() { return reactive; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "readonly", function() { return readonly; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ref", function() { return ref$1; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "set", function() { return set; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shallowReactive", function() { return shallowReactive; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shallowReadonly", function() { return shallowReadonly; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shallowRef", function() { return shallowRef; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toRaw", function() { return toRaw; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toRef", function() { return toRef; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toRefs", function() { return toRefs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "triggerRef", function() { return triggerRef; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "unref", function() { return unref; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "useAttrs", function() { return useAttrs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "useCssModule", function() { return useCssModule; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "useCssVars", function() { return useCssVars; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "useListeners", function() { return useListeners; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "useSlots", function() { return useSlots; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "version", function() { return version; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "watch", function() { return watch; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "watchEffect", function() { return watchEffect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "watchPostEffect", function() { return watchPostEffect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "watchSyncEffect", function() { return watchSyncEffect; });
/*!
 * Vue.js v2.7.16
 * (c) 2014-2023 Evan You
 * Released under the MIT License.
 */
var emptyObject = Object.freeze({});
var isArray = Array.isArray;
// These helpers produce better VM code in JS engines due to their
// explicitness and function inlining.
function isUndef(v) {
    return v === undefined || v === null;
}
function isDef(v) {
    return v !== undefined && v !== null;
}
function isTrue(v) {
    return v === true;
}
function isFalse(v) {
    return v === false;
}
/**
 * Check if value is primitive.
 */
function isPrimitive(value) {
    return (typeof value === 'string' ||
        typeof value === 'number' ||
        // $flow-disable-line
        typeof value === 'symbol' ||
        typeof value === 'boolean');
}
function isFunction(value) {
    return typeof value === 'function';
}
/**
 * Quick object check - this is primarily used to tell
 * objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject(obj) {
    return obj !== null && typeof obj === 'object';
}
/**
 * Get the raw type string of a value, e.g., [object Object].
 */
var _toString = Object.prototype.toString;
function toRawType(value) {
    return _toString.call(value).slice(8, -1);
}
/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject(obj) {
    return _toString.call(obj) === '[object Object]';
}
function isRegExp(v) {
    return _toString.call(v) === '[object RegExp]';
}
/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex(val) {
    var n = parseFloat(String(val));
    return n >= 0 && Math.floor(n) === n && isFinite(val);
}
function isPromise(val) {
    return (isDef(val) &&
        typeof val.then === 'function' &&
        typeof val.catch === 'function');
}
/**
 * Convert a value to a string that is actually rendered.
 */
function toString(val) {
    return val == null
        ? ''
        : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
            ? JSON.stringify(val, replacer, 2)
            : String(val);
}
function replacer(_key, val) {
    // avoid circular deps from v3
    if (val && val.__v_isRef) {
        return val.value;
    }
    return val;
}
/**
 * Convert an input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber(val) {
    var n = parseFloat(val);
    return isNaN(n) ? val : n;
}
/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap(str, expectsLowerCase) {
    var map = Object.create(null);
    var list = str.split(',');
    for (var i = 0; i < list.length; i++) {
        map[list[i]] = true;
    }
    return expectsLowerCase ? function (val) { return map[val.toLowerCase()]; } : function (val) { return map[val]; };
}
/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);
/**
 * Check if an attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');
/**
 * Remove an item from an array.
 */
function remove$2(arr, item) {
    var len = arr.length;
    if (len) {
        // fast path for the only / last item
        if (item === arr[len - 1]) {
            arr.length = len - 1;
            return;
        }
        var index = arr.indexOf(item);
        if (index > -1) {
            return arr.splice(index, 1);
        }
    }
}
/**
 * Check whether an object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key);
}
/**
 * Create a cached version of a pure function.
 */
function cached(fn) {
    var cache = Object.create(null);
    return function cachedFn(str) {
        var hit = cache[str];
        return hit || (cache[str] = fn(str));
    };
}
/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
    return str.replace(camelizeRE, function (_, c) { return (c ? c.toUpperCase() : ''); });
});
/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
});
/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
    return str.replace(hyphenateRE, '-$1').toLowerCase();
});
/**
 * Simple bind polyfill for environments that do not support it,
 * e.g., PhantomJS 1.x. Technically, we don't need this anymore
 * since native bind is now performant enough in most browsers.
 * But removing it would mean breaking code that was able to run in
 * PhantomJS 1.x, so this must be kept for backward compatibility.
 */
/* istanbul ignore next */
function polyfillBind(fn, ctx) {
    function boundFn(a) {
        var l = arguments.length;
        return l
            ? l > 1
                ? fn.apply(ctx, arguments)
                : fn.call(ctx, a)
            : fn.call(ctx);
    }
    boundFn._length = fn.length;
    return boundFn;
}
function nativeBind(fn, ctx) {
    return fn.bind(ctx);
}
// @ts-expect-error bind cannot be `undefined`
var bind = Function.prototype.bind ? nativeBind : polyfillBind;
/**
 * Convert an Array-like object to a real Array.
 */
function toArray(list, start) {
    start = start || 0;
    var i = list.length - start;
    var ret = new Array(i);
    while (i--) {
        ret[i] = list[i + start];
    }
    return ret;
}
/**
 * Mix properties into target object.
 */
function extend(to, _from) {
    for (var key in _from) {
        to[key] = _from[key];
    }
    return to;
}
/**
 * Merge an Array of Objects into a single Object.
 */
function toObject(arr) {
    var res = {};
    for (var i = 0; i < arr.length; i++) {
        if (arr[i]) {
            extend(res, arr[i]);
        }
    }
    return res;
}
/* eslint-disable no-unused-vars */
/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 */
function noop(a, b, c) { }
/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };
/* eslint-enable no-unused-vars */
/**
 * Return the same value.
 */
var identity = function (_) { return _; };
/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual(a, b) {
    if (a === b)
        return true;
    var isObjectA = isObject(a);
    var isObjectB = isObject(b);
    if (isObjectA && isObjectB) {
        try {
            var isArrayA = Array.isArray(a);
            var isArrayB = Array.isArray(b);
            if (isArrayA && isArrayB) {
                return (a.length === b.length &&
                    a.every(function (e, i) {
                        return looseEqual(e, b[i]);
                    }));
            }
            else if (a instanceof Date && b instanceof Date) {
                return a.getTime() === b.getTime();
            }
            else if (!isArrayA && !isArrayB) {
                var keysA = Object.keys(a);
                var keysB = Object.keys(b);
                return (keysA.length === keysB.length &&
                    keysA.every(function (key) {
                        return looseEqual(a[key], b[key]);
                    }));
            }
            else {
                /* istanbul ignore next */
                return false;
            }
        }
        catch (e) {
            /* istanbul ignore next */
            return false;
        }
    }
    else if (!isObjectA && !isObjectB) {
        return String(a) === String(b);
    }
    else {
        return false;
    }
}
/**
 * Return the first index at which a loosely equal value can be
 * found in the array (if value is a plain object, the array must
 * contain an object of the same shape), or -1 if it is not present.
 */
function looseIndexOf(arr, val) {
    for (var i = 0; i < arr.length; i++) {
        if (looseEqual(arr[i], val))
            return i;
    }
    return -1;
}
/**
 * Ensure a function is called only once.
 */
function once(fn) {
    var called = false;
    return function () {
        if (!called) {
            called = true;
            fn.apply(this, arguments);
        }
    };
}
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#polyfill
function hasChanged(x, y) {
    if (x === y) {
        return x === 0 && 1 / x !== 1 / y;
    }
    else {
        return x === x || y === y;
    }
}

var SSR_ATTR = 'data-server-rendered';
var ASSET_TYPES = ['component', 'directive', 'filter'];
var LIFECYCLE_HOOKS = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed',
    'activated',
    'deactivated',
    'errorCaptured',
    'serverPrefetch',
    'renderTracked',
    'renderTriggered'
];

var config = {
    /**
     * Option merge strategies (used in core/util/options)
     */
    // $flow-disable-line
    optionMergeStrategies: Object.create(null),
    /**
     * Whether to suppress warnings.
     */
    silent: false,
    /**
     * Show production mode tip message on boot?
     */
    productionTip: "production" !== 'production',
    /**
     * Whether to enable devtools
     */
    devtools: "production" !== 'production',
    /**
     * Whether to record perf
     */
    performance: false,
    /**
     * Error handler for watcher errors
     */
    errorHandler: null,
    /**
     * Warn handler for watcher warns
     */
    warnHandler: null,
    /**
     * Ignore certain custom elements
     */
    ignoredElements: [],
    /**
     * Custom user key aliases for v-on
     */
    // $flow-disable-line
    keyCodes: Object.create(null),
    /**
     * Check if a tag is reserved so that it cannot be registered as a
     * component. This is platform-dependent and may be overwritten.
     */
    isReservedTag: no,
    /**
     * Check if an attribute is reserved so that it cannot be used as a component
     * prop. This is platform-dependent and may be overwritten.
     */
    isReservedAttr: no,
    /**
     * Check if a tag is an unknown element.
     * Platform-dependent.
     */
    isUnknownElement: no,
    /**
     * Get the namespace of an element
     */
    getTagNamespace: noop,
    /**
     * Parse the real tag name for the specific platform.
     */
    parsePlatformTagName: identity,
    /**
     * Check if an attribute must be bound using property, e.g. value
     * Platform-dependent.
     */
    mustUseProp: no,
    /**
     * Perform updates asynchronously. Intended to be used by Vue Test Utils
     * This will significantly reduce performance if set to false.
     */
    async: true,
    /**
     * Exposed for legacy reasons
     */
    _lifecycleHooks: LIFECYCLE_HOOKS
};

/**
 * unicode letters used for parsing html tags, component names and property paths.
 * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
 * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
 */
var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;
/**
 * Check if a string starts with $ or _
 */
function isReserved(str) {
    var c = (str + '').charCodeAt(0);
    return c === 0x24 || c === 0x5f;
}
/**
 * Define a property.
 */
function def(obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: true,
        configurable: true
    });
}
/**
 * Parse simple path.
 */
var bailRE = new RegExp("[^".concat(unicodeRegExp.source, ".$_\\d]"));
function parsePath(path) {
    if (bailRE.test(path)) {
        return;
    }
    var segments = path.split('.');
    return function (obj) {
        for (var i = 0; i < segments.length; i++) {
            if (!obj)
                return;
            obj = obj[segments[i]];
        }
        return obj;
    };
}

// can we use __proto__?
var hasProto = '__proto__' in {};
// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
UA && UA.indexOf('android') > 0;
var isIOS = UA && /iphone|ipad|ipod|ios/.test(UA);
UA && /chrome\/\d+/.test(UA) && !isEdge;
UA && /phantomjs/.test(UA);
var isFF = UA && UA.match(/firefox\/(\d+)/);
// Firefox has a "watch" function on Object.prototype...
// @ts-expect-error firebox support
var nativeWatch = {}.watch;
var supportsPassive = false;
if (inBrowser) {
    try {
        var opts = {};
        Object.defineProperty(opts, 'passive', {
            get: function () {
                /* istanbul ignore next */
                supportsPassive = true;
            }
        }); // https://github.com/facebook/flow/issues/285
        window.addEventListener('test-passive', null, opts);
    }
    catch (e) { }
}
// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
    if (_isServer === undefined) {
        /* istanbul ignore if */
        if (!inBrowser && typeof global !== 'undefined') {
            // detect presence of vue-server-renderer and avoid
            // Webpack shimming the process
            _isServer =
                global['process'] && global['process'].env.VUE_ENV === 'server';
        }
        else {
            _isServer = false;
        }
    }
    return _isServer;
};
// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;
/* istanbul ignore next */
function isNative(Ctor) {
    return typeof Ctor === 'function' && /native code/.test(Ctor.toString());
}
var hasSymbol = typeof Symbol !== 'undefined' &&
    isNative(Symbol) &&
    typeof Reflect !== 'undefined' &&
    isNative(Reflect.ownKeys);
var _Set; // $flow-disable-line
/* istanbul ignore if */ if (typeof Set !== 'undefined' && isNative(Set)) {
    // use native Set when available.
    _Set = Set;
}
else {
    // a non-standard Set polyfill that only works with primitive keys.
    _Set = /** @class */ (function () {
        function Set() {
            this.set = Object.create(null);
        }
        Set.prototype.has = function (key) {
            return this.set[key] === true;
        };
        Set.prototype.add = function (key) {
            this.set[key] = true;
        };
        Set.prototype.clear = function () {
            this.set = Object.create(null);
        };
        return Set;
    }());
}

var currentInstance = null;
/**
 * This is exposed for compatibility with v3 (e.g. some functions in VueUse
 * relies on it). Do not use this internally, just use `currentInstance`.
 *
 * @internal this function needs manual type declaration because it relies
 * on previously manually authored types from Vue 2
 */
function getCurrentInstance() {
    return currentInstance && { proxy: currentInstance };
}
/**
 * @internal
 */
function setCurrentInstance(vm) {
    if (vm === void 0) { vm = null; }
    if (!vm)
        currentInstance && currentInstance._scope.off();
    currentInstance = vm;
    vm && vm._scope.on();
}

/**
 * @internal
 */
var VNode = /** @class */ (function () {
    function VNode(tag, data, children, text, elm, context, componentOptions, asyncFactory) {
        this.tag = tag;
        this.data = data;
        this.children = children;
        this.text = text;
        this.elm = elm;
        this.ns = undefined;
        this.context = context;
        this.fnContext = undefined;
        this.fnOptions = undefined;
        this.fnScopeId = undefined;
        this.key = data && data.key;
        this.componentOptions = componentOptions;
        this.componentInstance = undefined;
        this.parent = undefined;
        this.raw = false;
        this.isStatic = false;
        this.isRootInsert = true;
        this.isComment = false;
        this.isCloned = false;
        this.isOnce = false;
        this.asyncFactory = asyncFactory;
        this.asyncMeta = undefined;
        this.isAsyncPlaceholder = false;
    }
    Object.defineProperty(VNode.prototype, "child", {
        // DEPRECATED: alias for componentInstance for backwards compat.
        /* istanbul ignore next */
        get: function () {
            return this.componentInstance;
        },
        enumerable: false,
        configurable: true
    });
    return VNode;
}());
var createEmptyVNode = function (text) {
    if (text === void 0) { text = ''; }
    var node = new VNode();
    node.text = text;
    node.isComment = true;
    return node;
};
function createTextVNode(val) {
    return new VNode(undefined, undefined, undefined, String(val));
}
// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode(vnode) {
    var cloned = new VNode(vnode.tag, vnode.data, 
    // #7975
    // clone children array to avoid mutating original in case of cloning
    // a child.
    vnode.children && vnode.children.slice(), vnode.text, vnode.elm, vnode.context, vnode.componentOptions, vnode.asyncFactory);
    cloned.ns = vnode.ns;
    cloned.isStatic = vnode.isStatic;
    cloned.key = vnode.key;
    cloned.isComment = vnode.isComment;
    cloned.fnContext = vnode.fnContext;
    cloned.fnOptions = vnode.fnOptions;
    cloned.fnScopeId = vnode.fnScopeId;
    cloned.asyncMeta = vnode.asyncMeta;
    cloned.isCloned = true;
    return cloned;
}

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var uid$2 = 0;
var pendingCleanupDeps = [];
var cleanupDeps = function () {
    for (var i = 0; i < pendingCleanupDeps.length; i++) {
        var dep = pendingCleanupDeps[i];
        dep.subs = dep.subs.filter(function (s) { return s; });
        dep._pending = false;
    }
    pendingCleanupDeps.length = 0;
};
/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 * @internal
 */
var Dep = /** @class */ (function () {
    function Dep() {
        // pending subs cleanup
        this._pending = false;
        this.id = uid$2++;
        this.subs = [];
    }
    Dep.prototype.addSub = function (sub) {
        this.subs.push(sub);
    };
    Dep.prototype.removeSub = function (sub) {
        // #12696 deps with massive amount of subscribers are extremely slow to
        // clean up in Chromium
        // to workaround this, we unset the sub for now, and clear them on
        // next scheduler flush.
        this.subs[this.subs.indexOf(sub)] = null;
        if (!this._pending) {
            this._pending = true;
            pendingCleanupDeps.push(this);
        }
    };
    Dep.prototype.depend = function (info) {
        if (Dep.target) {
            Dep.target.addDep(this);
            if (false) {
                Dep.target.onTrack(__assign({ effect: Dep.target }, info));
            }
        }
    };
    Dep.prototype.notify = function (info) {
        // stabilize the subscriber list first
        var subs = this.subs.filter(function (s) { return s; });
        if (false) {
            // subs aren't sorted in scheduler if not running async
            // we need to sort them now to make sure they fire in correct
            // order
            subs.sort(function (a, b) { return a.id - b.id; });
        }
        for (var i = 0, l = subs.length; i < l; i++) {
            var sub = subs[i];
            if (false) {
                sub.onTrigger &&
                    sub.onTrigger(__assign({ effect: subs[i] }, info));
            }
            sub.update();
        }
    };
    return Dep;
}());
// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
Dep.target = null;
var targetStack = [];
function pushTarget(target) {
    targetStack.push(target);
    Dep.target = target;
}
function popTarget() {
    targetStack.pop();
    Dep.target = targetStack[targetStack.length - 1];
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */
var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);
var methodsToPatch = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
];
/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
    // cache original method
    var original = arrayProto[method];
    def(arrayMethods, method, function mutator() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var result = original.apply(this, args);
        var ob = this.__ob__;
        var inserted;
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args;
                break;
            case 'splice':
                inserted = args.slice(2);
                break;
        }
        if (inserted)
            ob.observeArray(inserted);
        // notify change
        if (false) {
            ob.dep.notify({
                type: "array mutation" /* TriggerOpTypes.ARRAY_MUTATION */,
                target: this,
                key: method
            });
        }
        else {
            ob.dep.notify();
        }
        return result;
    });
});

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);
var NO_INITIAL_VALUE = {};
/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
var shouldObserve = true;
function toggleObserving(value) {
    shouldObserve = value;
}
// ssr mock dep
var mockDep = {
    notify: noop,
    depend: noop,
    addSub: noop,
    removeSub: noop
};
/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
var Observer = /** @class */ (function () {
    function Observer(value, shallow, mock) {
        if (shallow === void 0) { shallow = false; }
        if (mock === void 0) { mock = false; }
        this.value = value;
        this.shallow = shallow;
        this.mock = mock;
        // this.value = value
        this.dep = mock ? mockDep : new Dep();
        this.vmCount = 0;
        def(value, '__ob__', this);
        if (isArray(value)) {
            if (!mock) {
                if (hasProto) {
                    value.__proto__ = arrayMethods;
                    /* eslint-enable no-proto */
                }
                else {
                    for (var i = 0, l = arrayKeys.length; i < l; i++) {
                        var key = arrayKeys[i];
                        def(value, key, arrayMethods[key]);
                    }
                }
            }
            if (!shallow) {
                this.observeArray(value);
            }
        }
        else {
            /**
             * Walk through all properties and convert them into
             * getter/setters. This method should only be called when
             * value type is Object.
             */
            var keys = Object.keys(value);
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                defineReactive(value, key, NO_INITIAL_VALUE, undefined, shallow, mock);
            }
        }
    }
    /**
     * Observe a list of Array items.
     */
    Observer.prototype.observeArray = function (value) {
        for (var i = 0, l = value.length; i < l; i++) {
            observe(value[i], false, this.mock);
        }
    };
    return Observer;
}());
// helpers
/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe(value, shallow, ssrMockReactivity) {
    if (value && hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
        return value.__ob__;
    }
    if (shouldObserve &&
        (ssrMockReactivity || !isServerRendering()) &&
        (isArray(value) || isPlainObject(value)) &&
        Object.isExtensible(value) &&
        !value.__v_skip /* ReactiveFlags.SKIP */ &&
        !isRef(value) &&
        !(value instanceof VNode)) {
        return new Observer(value, shallow, ssrMockReactivity);
    }
}
/**
 * Define a reactive property on an Object.
 */
function defineReactive(obj, key, val, customSetter, shallow, mock, observeEvenIfShallow) {
    if (observeEvenIfShallow === void 0) { observeEvenIfShallow = false; }
    var dep = new Dep();
    var property = Object.getOwnPropertyDescriptor(obj, key);
    if (property && property.configurable === false) {
        return;
    }
    // cater for pre-defined getter/setters
    var getter = property && property.get;
    var setter = property && property.set;
    if ((!getter || setter) &&
        (val === NO_INITIAL_VALUE || arguments.length === 2)) {
        val = obj[key];
    }
    var childOb = shallow ? val && val.__ob__ : observe(val, false, mock);
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter() {
            var value = getter ? getter.call(obj) : val;
            if (Dep.target) {
                if (false) {
                    dep.depend({
                        target: obj,
                        type: "get" /* TrackOpTypes.GET */,
                        key: key
                    });
                }
                else {
                    dep.depend();
                }
                if (childOb) {
                    childOb.dep.depend();
                    if (isArray(value)) {
                        dependArray(value);
                    }
                }
            }
            return isRef(value) && !shallow ? value.value : value;
        },
        set: function reactiveSetter(newVal) {
            var value = getter ? getter.call(obj) : val;
            if (!hasChanged(value, newVal)) {
                return;
            }
            if (false) {
                customSetter();
            }
            if (setter) {
                setter.call(obj, newVal);
            }
            else if (getter) {
                // #7981: for accessor properties without setter
                return;
            }
            else if (!shallow && isRef(value) && !isRef(newVal)) {
                value.value = newVal;
                return;
            }
            else {
                val = newVal;
            }
            childOb = shallow ? newVal && newVal.__ob__ : observe(newVal, false, mock);
            if (false) {
                dep.notify({
                    type: "set" /* TriggerOpTypes.SET */,
                    target: obj,
                    key: key,
                    newValue: newVal,
                    oldValue: value
                });
            }
            else {
                dep.notify();
            }
        }
    });
    return dep;
}
function set(target, key, val) {
    if (false) {
        warn("Cannot set reactive property on undefined, null, or primitive value: ".concat(target));
    }
    if (isReadonly(target)) {
        "production" !== 'production' && warn("Set operation on key \"".concat(key, "\" failed: target is readonly."));
        return;
    }
    var ob = target.__ob__;
    if (isArray(target) && isValidArrayIndex(key)) {
        target.length = Math.max(target.length, key);
        target.splice(key, 1, val);
        // when mocking for SSR, array methods are not hijacked
        if (ob && !ob.shallow && ob.mock) {
            observe(val, false, true);
        }
        return val;
    }
    if (key in target && !(key in Object.prototype)) {
        target[key] = val;
        return val;
    }
    if (target._isVue || (ob && ob.vmCount)) {
        "production" !== 'production' &&
            warn('Avoid adding reactive properties to a Vue instance or its root $data ' +
                'at runtime - declare it upfront in the data option.');
        return val;
    }
    if (!ob) {
        target[key] = val;
        return val;
    }
    defineReactive(ob.value, key, val, undefined, ob.shallow, ob.mock);
    if (false) {
        ob.dep.notify({
            type: "add" /* TriggerOpTypes.ADD */,
            target: target,
            key: key,
            newValue: val,
            oldValue: undefined
        });
    }
    else {
        ob.dep.notify();
    }
    return val;
}
function del(target, key) {
    if (false) {
        warn("Cannot delete reactive property on undefined, null, or primitive value: ".concat(target));
    }
    if (isArray(target) && isValidArrayIndex(key)) {
        target.splice(key, 1);
        return;
    }
    var ob = target.__ob__;
    if (target._isVue || (ob && ob.vmCount)) {
        "production" !== 'production' &&
            warn('Avoid deleting properties on a Vue instance or its root $data ' +
                '- just set it to null.');
        return;
    }
    if (isReadonly(target)) {
        "production" !== 'production' &&
            warn("Delete operation on key \"".concat(key, "\" failed: target is readonly."));
        return;
    }
    if (!hasOwn(target, key)) {
        return;
    }
    delete target[key];
    if (!ob) {
        return;
    }
    if (false) {
        ob.dep.notify({
            type: "delete" /* TriggerOpTypes.DELETE */,
            target: target,
            key: key
        });
    }
    else {
        ob.dep.notify();
    }
}
/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray(value) {
    for (var e = void 0, i = 0, l = value.length; i < l; i++) {
        e = value[i];
        if (e && e.__ob__) {
            e.__ob__.dep.depend();
        }
        if (isArray(e)) {
            dependArray(e);
        }
    }
}

function reactive(target) {
    makeReactive(target, false);
    return target;
}
/**
 * Return a shallowly-reactive copy of the original object, where only the root
 * level properties are reactive. It also does not auto-unwrap refs (even at the
 * root level).
 */
function shallowReactive(target) {
    makeReactive(target, true);
    def(target, "__v_isShallow" /* ReactiveFlags.IS_SHALLOW */, true);
    return target;
}
function makeReactive(target, shallow) {
    // if trying to observe a readonly proxy, return the readonly version.
    if (!isReadonly(target)) {
        if (false) {
            if (isArray(target)) {
                warn("Avoid using Array as root value for ".concat(shallow ? "shallowReactive()" : "reactive()", " as it cannot be tracked in watch() or watchEffect(). Use ").concat(shallow ? "shallowRef()" : "ref()", " instead. This is a Vue-2-only limitation."));
            }
            var existingOb = target && target.__ob__;
            if (existingOb && existingOb.shallow !== shallow) {
                warn("Target is already a ".concat(existingOb.shallow ? "" : "non-", "shallow reactive object, and cannot be converted to ").concat(shallow ? "" : "non-", "shallow."));
            }
        }
        var ob = observe(target, shallow, isServerRendering() /* ssr mock reactivity */);
        if (false) {
            if (target == null || isPrimitive(target)) {
                warn("value cannot be made reactive: ".concat(String(target)));
            }
            if (isCollectionType(target)) {
                warn("Vue 2 does not support reactive collection types such as Map or Set.");
            }
        }
    }
}
function isReactive(value) {
    if (isReadonly(value)) {
        return isReactive(value["__v_raw" /* ReactiveFlags.RAW */]);
    }
    return !!(value && value.__ob__);
}
function isShallow(value) {
    return !!(value && value.__v_isShallow);
}
function isReadonly(value) {
    return !!(value && value.__v_isReadonly);
}
function isProxy(value) {
    return isReactive(value) || isReadonly(value);
}
function toRaw(observed) {
    var raw = observed && observed["__v_raw" /* ReactiveFlags.RAW */];
    return raw ? toRaw(raw) : observed;
}
function markRaw(value) {
    // non-extensible objects won't be observed anyway
    if (Object.isExtensible(value)) {
        def(value, "__v_skip" /* ReactiveFlags.SKIP */, true);
    }
    return value;
}
/**
 * @internal
 */
function isCollectionType(value) {
    var type = toRawType(value);
    return (type === 'Map' || type === 'WeakMap' || type === 'Set' || type === 'WeakSet');
}

/**
 * @internal
 */
var RefFlag = "__v_isRef";
function isRef(r) {
    return !!(r && r.__v_isRef === true);
}
function ref$1(value) {
    return createRef(value, false);
}
function shallowRef(value) {
    return createRef(value, true);
}
function createRef(rawValue, shallow) {
    if (isRef(rawValue)) {
        return rawValue;
    }
    var ref = {};
    def(ref, RefFlag, true);
    def(ref, "__v_isShallow" /* ReactiveFlags.IS_SHALLOW */, shallow);
    def(ref, 'dep', defineReactive(ref, 'value', rawValue, null, shallow, isServerRendering()));
    return ref;
}
function triggerRef(ref) {
    if (false) {
        warn("received object is not a triggerable ref.");
    }
    if (false) {
        ref.dep &&
            ref.dep.notify({
                type: "set" /* TriggerOpTypes.SET */,
                target: ref,
                key: 'value'
            });
    }
    else {
        ref.dep && ref.dep.notify();
    }
}
function unref(ref) {
    return isRef(ref) ? ref.value : ref;
}
function proxyRefs(objectWithRefs) {
    if (isReactive(objectWithRefs)) {
        return objectWithRefs;
    }
    var proxy = {};
    var keys = Object.keys(objectWithRefs);
    for (var i = 0; i < keys.length; i++) {
        proxyWithRefUnwrap(proxy, objectWithRefs, keys[i]);
    }
    return proxy;
}
function proxyWithRefUnwrap(target, source, key) {
    Object.defineProperty(target, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            var val = source[key];
            if (isRef(val)) {
                return val.value;
            }
            else {
                var ob = val && val.__ob__;
                if (ob)
                    ob.dep.depend();
                return val;
            }
        },
        set: function (value) {
            var oldValue = source[key];
            if (isRef(oldValue) && !isRef(value)) {
                oldValue.value = value;
            }
            else {
                source[key] = value;
            }
        }
    });
}
function customRef(factory) {
    var dep = new Dep();
    var _a = factory(function () {
        if (false) {
            dep.depend({
                target: ref,
                type: "get" /* TrackOpTypes.GET */,
                key: 'value'
            });
        }
        else {
            dep.depend();
        }
    }, function () {
        if (false) {
            dep.notify({
                target: ref,
                type: "set" /* TriggerOpTypes.SET */,
                key: 'value'
            });
        }
        else {
            dep.notify();
        }
    }), get = _a.get, set = _a.set;
    var ref = {
        get value() {
            return get();
        },
        set value(newVal) {
            set(newVal);
        }
    };
    def(ref, RefFlag, true);
    return ref;
}
function toRefs(object) {
    if (false) {
        warn("toRefs() expects a reactive object but received a plain one.");
    }
    var ret = isArray(object) ? new Array(object.length) : {};
    for (var key in object) {
        ret[key] = toRef(object, key);
    }
    return ret;
}
function toRef(object, key, defaultValue) {
    var val = object[key];
    if (isRef(val)) {
        return val;
    }
    var ref = {
        get value() {
            var val = object[key];
            return val === undefined ? defaultValue : val;
        },
        set value(newVal) {
            object[key] = newVal;
        }
    };
    def(ref, RefFlag, true);
    return ref;
}

var rawToReadonlyFlag = "__v_rawToReadonly";
var rawToShallowReadonlyFlag = "__v_rawToShallowReadonly";
function readonly(target) {
    return createReadonly(target, false);
}
function createReadonly(target, shallow) {
    if (!isPlainObject(target)) {
        if (false) {
            if (isArray(target)) {
                warn("Vue 2 does not support readonly arrays.");
            }
            else if (isCollectionType(target)) {
                warn("Vue 2 does not support readonly collection types such as Map or Set.");
            }
            else {
                warn("value cannot be made readonly: ".concat(typeof target));
            }
        }
        return target;
    }
    if (false) {
        warn("Vue 2 does not support creating readonly proxy for non-extensible object.");
    }
    // already a readonly object
    if (isReadonly(target)) {
        return target;
    }
    // already has a readonly proxy
    var existingFlag = shallow ? rawToShallowReadonlyFlag : rawToReadonlyFlag;
    var existingProxy = target[existingFlag];
    if (existingProxy) {
        return existingProxy;
    }
    var proxy = Object.create(Object.getPrototypeOf(target));
    def(target, existingFlag, proxy);
    def(proxy, "__v_isReadonly" /* ReactiveFlags.IS_READONLY */, true);
    def(proxy, "__v_raw" /* ReactiveFlags.RAW */, target);
    if (isRef(target)) {
        def(proxy, RefFlag, true);
    }
    if (shallow || isShallow(target)) {
        def(proxy, "__v_isShallow" /* ReactiveFlags.IS_SHALLOW */, true);
    }
    var keys = Object.keys(target);
    for (var i = 0; i < keys.length; i++) {
        defineReadonlyProperty(proxy, target, keys[i], shallow);
    }
    return proxy;
}
function defineReadonlyProperty(proxy, target, key, shallow) {
    Object.defineProperty(proxy, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            var val = target[key];
            return shallow || !isPlainObject(val) ? val : readonly(val);
        },
        set: function () {
            "production" !== 'production' &&
                warn("Set operation on key \"".concat(key, "\" failed: target is readonly."));
        }
    });
}
/**
 * Returns a reactive-copy of the original object, where only the root level
 * properties are readonly, and does NOT unwrap refs nor recursively convert
 * returned properties.
 * This is used for creating the props proxy object for stateful components.
 */
function shallowReadonly(target) {
    return createReadonly(target, true);
}

function computed(getterOrOptions, debugOptions) {
    var getter;
    var setter;
    var onlyGetter = isFunction(getterOrOptions);
    if (onlyGetter) {
        getter = getterOrOptions;
        setter =  false
            ? function () {
                warn('Write operation failed: computed value is readonly');
            }
            : noop;
    }
    else {
        getter = getterOrOptions.get;
        setter = getterOrOptions.set;
    }
    var watcher = isServerRendering()
        ? null
        : new Watcher(currentInstance, getter, noop, { lazy: true });
    if (false) {
        watcher.onTrack = debugOptions.onTrack;
        watcher.onTrigger = debugOptions.onTrigger;
    }
    var ref = {
        // some libs rely on the presence effect for checking computed refs
        // from normal refs, but the implementation doesn't matter
        effect: watcher,
        get value() {
            if (watcher) {
                if (watcher.dirty) {
                    watcher.evaluate();
                }
                if (Dep.target) {
                    if (false) {
                        Dep.target.onTrack({
                            effect: Dep.target,
                            target: ref,
                            type: "get" /* TrackOpTypes.GET */,
                            key: 'value'
                        });
                    }
                    watcher.depend();
                }
                return watcher.value;
            }
            else {
                return getter();
            }
        },
        set value(newVal) {
            setter(newVal);
        }
    };
    def(ref, RefFlag, true);
    def(ref, "__v_isReadonly" /* ReactiveFlags.IS_READONLY */, onlyGetter);
    return ref;
}

var WATCHER = "watcher";
var WATCHER_CB = "".concat(WATCHER, " callback");
var WATCHER_GETTER = "".concat(WATCHER, " getter");
var WATCHER_CLEANUP = "".concat(WATCHER, " cleanup");
// Simple effect.
function watchEffect(effect, options) {
    return doWatch(effect, null, options);
}
function watchPostEffect(effect, options) {
    return doWatch(effect, null, ( false
        ? __assign(__assign({}, options), { flush: 'post' }) : { flush: 'post' }));
}
function watchSyncEffect(effect, options) {
    return doWatch(effect, null, ( false
        ? __assign(__assign({}, options), { flush: 'sync' }) : { flush: 'sync' }));
}
// initial value for watchers to trigger on undefined initial values
var INITIAL_WATCHER_VALUE = {};
// implementation
function watch(source, cb, options) {
    if (false) {
        warn("`watch(fn, options?)` signature has been moved to a separate API. " +
            "Use `watchEffect(fn, options?)` instead. `watch` now only " +
            "supports `watch(source, cb, options?) signature.");
    }
    return doWatch(source, cb, options);
}
function doWatch(source, cb, _a) {
    var _b = _a === void 0 ? emptyObject : _a, immediate = _b.immediate, deep = _b.deep, _c = _b.flush, flush = _c === void 0 ? 'pre' : _c, onTrack = _b.onTrack, onTrigger = _b.onTrigger;
    if (false) {
        if (immediate !== undefined) {
            warn("watch() \"immediate\" option is only respected when using the " +
                "watch(source, callback, options?) signature.");
        }
        if (deep !== undefined) {
            warn("watch() \"deep\" option is only respected when using the " +
                "watch(source, callback, options?) signature.");
        }
    }
    var warnInvalidSource = function (s) {
        warn("Invalid watch source: ".concat(s, ". A watch source can only be a getter/effect ") +
            "function, a ref, a reactive object, or an array of these types.");
    };
    var instance = currentInstance;
    var call = function (fn, type, args) {
        if (args === void 0) { args = null; }
        var res = invokeWithErrorHandling(fn, null, args, instance, type);
        if (deep && res && res.__ob__)
            res.__ob__.dep.depend();
        return res;
    };
    var getter;
    var forceTrigger = false;
    var isMultiSource = false;
    if (isRef(source)) {
        getter = function () { return source.value; };
        forceTrigger = isShallow(source);
    }
    else if (isReactive(source)) {
        getter = function () {
            source.__ob__.dep.depend();
            return source;
        };
        deep = true;
    }
    else if (isArray(source)) {
        isMultiSource = true;
        forceTrigger = source.some(function (s) { return isReactive(s) || isShallow(s); });
        getter = function () {
            return source.map(function (s) {
                if (isRef(s)) {
                    return s.value;
                }
                else if (isReactive(s)) {
                    s.__ob__.dep.depend();
                    return traverse(s);
                }
                else if (isFunction(s)) {
                    return call(s, WATCHER_GETTER);
                }
                else {
                    "production" !== 'production' && warnInvalidSource(s);
                }
            });
        };
    }
    else if (isFunction(source)) {
        if (cb) {
            // getter with cb
            getter = function () { return call(source, WATCHER_GETTER); };
        }
        else {
            // no cb -> simple effect
            getter = function () {
                if (instance && instance._isDestroyed) {
                    return;
                }
                if (cleanup) {
                    cleanup();
                }
                return call(source, WATCHER, [onCleanup]);
            };
        }
    }
    else {
        getter = noop;
        "production" !== 'production' && warnInvalidSource(source);
    }
    if (cb && deep) {
        var baseGetter_1 = getter;
        getter = function () { return traverse(baseGetter_1()); };
    }
    var cleanup;
    var onCleanup = function (fn) {
        cleanup = watcher.onStop = function () {
            call(fn, WATCHER_CLEANUP);
        };
    };
    // in SSR there is no need to setup an actual effect, and it should be noop
    // unless it's eager
    if (isServerRendering()) {
        // we will also not call the invalidate callback (+ runner is not set up)
        onCleanup = noop;
        if (!cb) {
            getter();
        }
        else if (immediate) {
            call(cb, WATCHER_CB, [
                getter(),
                isMultiSource ? [] : undefined,
                onCleanup
            ]);
        }
        return noop;
    }
    var watcher = new Watcher(currentInstance, getter, noop, {
        lazy: true
    });
    watcher.noRecurse = !cb;
    var oldValue = isMultiSource ? [] : INITIAL_WATCHER_VALUE;
    // overwrite default run
    watcher.run = function () {
        if (!watcher.active) {
            return;
        }
        if (cb) {
            // watch(source, cb)
            var newValue = watcher.get();
            if (deep ||
                forceTrigger ||
                (isMultiSource
                    ? newValue.some(function (v, i) {
                        return hasChanged(v, oldValue[i]);
                    })
                    : hasChanged(newValue, oldValue))) {
                // cleanup before running cb again
                if (cleanup) {
                    cleanup();
                }
                call(cb, WATCHER_CB, [
                    newValue,
                    // pass undefined as the old value when it's changed for the first time
                    oldValue === INITIAL_WATCHER_VALUE ? undefined : oldValue,
                    onCleanup
                ]);
                oldValue = newValue;
            }
        }
        else {
            // watchEffect
            watcher.get();
        }
    };
    if (flush === 'sync') {
        watcher.update = watcher.run;
    }
    else if (flush === 'post') {
        watcher.post = true;
        watcher.update = function () { return queueWatcher(watcher); };
    }
    else {
        // pre
        watcher.update = function () {
            if (instance && instance === currentInstance && !instance._isMounted) {
                // pre-watcher triggered before
                var buffer = instance._preWatchers || (instance._preWatchers = []);
                if (buffer.indexOf(watcher) < 0)
                    buffer.push(watcher);
            }
            else {
                queueWatcher(watcher);
            }
        };
    }
    if (false) {
        watcher.onTrack = onTrack;
        watcher.onTrigger = onTrigger;
    }
    // initial run
    if (cb) {
        if (immediate) {
            watcher.run();
        }
        else {
            oldValue = watcher.get();
        }
    }
    else if (flush === 'post' && instance) {
        instance.$once('hook:mounted', function () { return watcher.get(); });
    }
    else {
        watcher.get();
    }
    return function () {
        watcher.teardown();
    };
}

var activeEffectScope;
var EffectScope = /** @class */ (function () {
    function EffectScope(detached) {
        if (detached === void 0) { detached = false; }
        this.detached = detached;
        /**
         * @internal
         */
        this.active = true;
        /**
         * @internal
         */
        this.effects = [];
        /**
         * @internal
         */
        this.cleanups = [];
        this.parent = activeEffectScope;
        if (!detached && activeEffectScope) {
            this.index =
                (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(this) - 1;
        }
    }
    EffectScope.prototype.run = function (fn) {
        if (this.active) {
            var currentEffectScope = activeEffectScope;
            try {
                activeEffectScope = this;
                return fn();
            }
            finally {
                activeEffectScope = currentEffectScope;
            }
        }
        else if (false) {
            warn("cannot run an inactive effect scope.");
        }
    };
    /**
     * This should only be called on non-detached scopes
     * @internal
     */
    EffectScope.prototype.on = function () {
        activeEffectScope = this;
    };
    /**
     * This should only be called on non-detached scopes
     * @internal
     */
    EffectScope.prototype.off = function () {
        activeEffectScope = this.parent;
    };
    EffectScope.prototype.stop = function (fromParent) {
        if (this.active) {
            var i = void 0, l = void 0;
            for (i = 0, l = this.effects.length; i < l; i++) {
                this.effects[i].teardown();
            }
            for (i = 0, l = this.cleanups.length; i < l; i++) {
                this.cleanups[i]();
            }
            if (this.scopes) {
                for (i = 0, l = this.scopes.length; i < l; i++) {
                    this.scopes[i].stop(true);
                }
            }
            // nested scope, dereference from parent to avoid memory leaks
            if (!this.detached && this.parent && !fromParent) {
                // optimized O(1) removal
                var last = this.parent.scopes.pop();
                if (last && last !== this) {
                    this.parent.scopes[this.index] = last;
                    last.index = this.index;
                }
            }
            this.parent = undefined;
            this.active = false;
        }
    };
    return EffectScope;
}());
function effectScope(detached) {
    return new EffectScope(detached);
}
/**
 * @internal
 */
function recordEffectScope(effect, scope) {
    if (scope === void 0) { scope = activeEffectScope; }
    if (scope && scope.active) {
        scope.effects.push(effect);
    }
}
function getCurrentScope() {
    return activeEffectScope;
}
function onScopeDispose(fn) {
    if (activeEffectScope) {
        activeEffectScope.cleanups.push(fn);
    }
    else if (false) {
        warn("onScopeDispose() is called when there is no active effect scope" +
            " to be associated with.");
    }
}

function provide(key, value) {
    if (!currentInstance) {
        if (false) {
            warn("provide() can only be used inside setup().");
        }
    }
    else {
        // TS doesn't allow symbol as index type
        resolveProvided(currentInstance)[key] = value;
    }
}
function resolveProvided(vm) {
    // by default an instance inherits its parent's provides object
    // but when it needs to provide values of its own, it creates its
    // own provides object using parent provides object as prototype.
    // this way in `inject` we can simply look up injections from direct
    // parent and let the prototype chain do the work.
    var existing = vm._provided;
    var parentProvides = vm.$parent && vm.$parent._provided;
    if (parentProvides === existing) {
        return (vm._provided = Object.create(parentProvides));
    }
    else {
        return existing;
    }
}
function inject(key, defaultValue, treatDefaultAsFactory) {
    if (treatDefaultAsFactory === void 0) { treatDefaultAsFactory = false; }
    // fallback to `currentRenderingInstance` so that this can be called in
    // a functional component
    var instance = currentInstance;
    if (instance) {
        // #2400
        // to support `app.use` plugins,
        // fallback to appContext's `provides` if the instance is at root
        var provides = instance.$parent && instance.$parent._provided;
        if (provides && key in provides) {
            // TS doesn't allow symbol as index type
            return provides[key];
        }
        else if (arguments.length > 1) {
            return treatDefaultAsFactory && isFunction(defaultValue)
                ? defaultValue.call(instance)
                : defaultValue;
        }
        else if (false) {
            warn("injection \"".concat(String(key), "\" not found."));
        }
    }
    else if (false) {
        warn("inject() can only be used inside setup() or functional components.");
    }
}

var normalizeEvent = cached(function (name) {
    var passive = name.charAt(0) === '&';
    name = passive ? name.slice(1) : name;
    var once = name.charAt(0) === '~'; // Prefixed last, checked first
    name = once ? name.slice(1) : name;
    var capture = name.charAt(0) === '!';
    name = capture ? name.slice(1) : name;
    return {
        name: name,
        once: once,
        capture: capture,
        passive: passive
    };
});
function createFnInvoker(fns, vm) {
    function invoker() {
        var fns = invoker.fns;
        if (isArray(fns)) {
            var cloned = fns.slice();
            for (var i = 0; i < cloned.length; i++) {
                invokeWithErrorHandling(cloned[i], null, arguments, vm, "v-on handler");
            }
        }
        else {
            // return handler return value for single handlers
            return invokeWithErrorHandling(fns, null, arguments, vm, "v-on handler");
        }
    }
    invoker.fns = fns;
    return invoker;
}
function updateListeners(on, oldOn, add, remove, createOnceHandler, vm) {
    var name, cur, old, event;
    for (name in on) {
        cur = on[name];
        old = oldOn[name];
        event = normalizeEvent(name);
        if (isUndef(cur)) {
            "production" !== 'production' &&
                warn("Invalid handler for event \"".concat(event.name, "\": got ") + String(cur), vm);
        }
        else if (isUndef(old)) {
            if (isUndef(cur.fns)) {
                cur = on[name] = createFnInvoker(cur, vm);
            }
            if (isTrue(event.once)) {
                cur = on[name] = createOnceHandler(event.name, cur, event.capture);
            }
            add(event.name, cur, event.capture, event.passive, event.params);
        }
        else if (cur !== old) {
            old.fns = cur;
            on[name] = old;
        }
    }
    for (name in oldOn) {
        if (isUndef(on[name])) {
            event = normalizeEvent(name);
            remove(event.name, oldOn[name], event.capture);
        }
    }
}

function mergeVNodeHook(def, hookKey, hook) {
    if (def instanceof VNode) {
        def = def.data.hook || (def.data.hook = {});
    }
    var invoker;
    var oldHook = def[hookKey];
    function wrappedHook() {
        hook.apply(this, arguments);
        // important: remove merged hook to ensure it's called only once
        // and prevent memory leak
        remove$2(invoker.fns, wrappedHook);
    }
    if (isUndef(oldHook)) {
        // no existing hook
        invoker = createFnInvoker([wrappedHook]);
    }
    else {
        /* istanbul ignore if */
        if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
            // already a merged invoker
            invoker = oldHook;
            invoker.fns.push(wrappedHook);
        }
        else {
            // existing plain hook
            invoker = createFnInvoker([oldHook, wrappedHook]);
        }
    }
    invoker.merged = true;
    def[hookKey] = invoker;
}

function extractPropsFromVNodeData(data, Ctor, tag) {
    // we are only extracting raw values here.
    // validation and default values are handled in the child
    // component itself.
    var propOptions = Ctor.options.props;
    if (isUndef(propOptions)) {
        return;
    }
    var res = {};
    var attrs = data.attrs, props = data.props;
    if (isDef(attrs) || isDef(props)) {
        for (var key in propOptions) {
            var altKey = hyphenate(key);
            if (false) {
                var keyInLowerCase = key.toLowerCase();
                if (key !== keyInLowerCase && attrs && hasOwn(attrs, keyInLowerCase)) {
                    tip("Prop \"".concat(keyInLowerCase, "\" is passed to component ") +
                        "".concat(formatComponentName(
                        // @ts-expect-error tag is string
                        tag || Ctor), ", but the declared prop name is") +
                        " \"".concat(key, "\". ") +
                        "Note that HTML attributes are case-insensitive and camelCased " +
                        "props need to use their kebab-case equivalents when using in-DOM " +
                        "templates. You should probably use \"".concat(altKey, "\" instead of \"").concat(key, "\"."));
                }
            }
            checkProp(res, props, key, altKey, true) ||
                checkProp(res, attrs, key, altKey, false);
        }
    }
    return res;
}
function checkProp(res, hash, key, altKey, preserve) {
    if (isDef(hash)) {
        if (hasOwn(hash, key)) {
            res[key] = hash[key];
            if (!preserve) {
                delete hash[key];
            }
            return true;
        }
        else if (hasOwn(hash, altKey)) {
            res[key] = hash[altKey];
            if (!preserve) {
                delete hash[altKey];
            }
            return true;
        }
    }
    return false;
}

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:
// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren(children) {
    for (var i = 0; i < children.length; i++) {
        if (isArray(children[i])) {
            return Array.prototype.concat.apply([], children);
        }
    }
    return children;
}
// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren(children) {
    return isPrimitive(children)
        ? [createTextVNode(children)]
        : isArray(children)
            ? normalizeArrayChildren(children)
            : undefined;
}
function isTextNode(node) {
    return isDef(node) && isDef(node.text) && isFalse(node.isComment);
}
function normalizeArrayChildren(children, nestedIndex) {
    var res = [];
    var i, c, lastIndex, last;
    for (i = 0; i < children.length; i++) {
        c = children[i];
        if (isUndef(c) || typeof c === 'boolean')
            continue;
        lastIndex = res.length - 1;
        last = res[lastIndex];
        //  nested
        if (isArray(c)) {
            if (c.length > 0) {
                c = normalizeArrayChildren(c, "".concat(nestedIndex || '', "_").concat(i));
                // merge adjacent text nodes
                if (isTextNode(c[0]) && isTextNode(last)) {
                    res[lastIndex] = createTextVNode(last.text + c[0].text);
                    c.shift();
                }
                res.push.apply(res, c);
            }
        }
        else if (isPrimitive(c)) {
            if (isTextNode(last)) {
                // merge adjacent text nodes
                // this is necessary for SSR hydration because text nodes are
                // essentially merged when rendered to HTML strings
                res[lastIndex] = createTextVNode(last.text + c);
            }
            else if (c !== '') {
                // convert primitive to vnode
                res.push(createTextVNode(c));
            }
        }
        else {
            if (isTextNode(c) && isTextNode(last)) {
                // merge adjacent text nodes
                res[lastIndex] = createTextVNode(last.text + c.text);
            }
            else {
                // default key for nested array children (likely generated by v-for)
                if (isTrue(children._isVList) &&
                    isDef(c.tag) &&
                    isUndef(c.key) &&
                    isDef(nestedIndex)) {
                    c.key = "__vlist".concat(nestedIndex, "_").concat(i, "__");
                }
                res.push(c);
            }
        }
    }
    return res;
}

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList(val, render) {
    var ret = null, i, l, keys, key;
    if (isArray(val) || typeof val === 'string') {
        ret = new Array(val.length);
        for (i = 0, l = val.length; i < l; i++) {
            ret[i] = render(val[i], i);
        }
    }
    else if (typeof val === 'number') {
        ret = new Array(val);
        for (i = 0; i < val; i++) {
            ret[i] = render(i + 1, i);
        }
    }
    else if (isObject(val)) {
        if (hasSymbol && val[Symbol.iterator]) {
            ret = [];
            var iterator = val[Symbol.iterator]();
            var result = iterator.next();
            while (!result.done) {
                ret.push(render(result.value, ret.length));
                result = iterator.next();
            }
        }
        else {
            keys = Object.keys(val);
            ret = new Array(keys.length);
            for (i = 0, l = keys.length; i < l; i++) {
                key = keys[i];
                ret[i] = render(val[key], key, i);
            }
        }
    }
    if (!isDef(ret)) {
        ret = [];
    }
    ret._isVList = true;
    return ret;
}

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot(name, fallbackRender, props, bindObject) {
    var scopedSlotFn = this.$scopedSlots[name];
    var nodes;
    if (scopedSlotFn) {
        // scoped slot
        props = props || {};
        if (bindObject) {
            if (false) {
                warn('slot v-bind without argument expects an Object', this);
            }
            props = extend(extend({}, bindObject), props);
        }
        nodes =
            scopedSlotFn(props) ||
                (isFunction(fallbackRender) ? fallbackRender() : fallbackRender);
    }
    else {
        nodes =
            this.$slots[name] ||
                (isFunction(fallbackRender) ? fallbackRender() : fallbackRender);
    }
    var target = props && props.slot;
    if (target) {
        return this.$createElement('template', { slot: target }, nodes);
    }
    else {
        return nodes;
    }
}

/**
 * Runtime helper for resolving filters
 */
function resolveFilter(id) {
    return resolveAsset(this.$options, 'filters', id, true) || identity;
}

function isKeyNotMatch(expect, actual) {
    if (isArray(expect)) {
        return expect.indexOf(actual) === -1;
    }
    else {
        return expect !== actual;
    }
}
/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */
function checkKeyCodes(eventKeyCode, key, builtInKeyCode, eventKeyName, builtInKeyName) {
    var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
    if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
        return isKeyNotMatch(builtInKeyName, eventKeyName);
    }
    else if (mappedKeyCode) {
        return isKeyNotMatch(mappedKeyCode, eventKeyCode);
    }
    else if (eventKeyName) {
        return hyphenate(eventKeyName) !== key;
    }
    return eventKeyCode === undefined;
}

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps(data, tag, value, asProp, isSync) {
    if (value) {
        if (!isObject(value)) {
            "production" !== 'production' &&
                warn('v-bind without argument expects an Object or Array value', this);
        }
        else {
            if (isArray(value)) {
                value = toObject(value);
            }
            var hash = void 0;
            var _loop_1 = function (key) {
                if (key === 'class' || key === 'style' || isReservedAttribute(key)) {
                    hash = data;
                }
                else {
                    var type = data.attrs && data.attrs.type;
                    hash =
                        asProp || config.mustUseProp(tag, type, key)
                            ? data.domProps || (data.domProps = {})
                            : data.attrs || (data.attrs = {});
                }
                var camelizedKey = camelize(key);
                var hyphenatedKey = hyphenate(key);
                if (!(camelizedKey in hash) && !(hyphenatedKey in hash)) {
                    hash[key] = value[key];
                    if (isSync) {
                        var on = data.on || (data.on = {});
                        on["update:".concat(key)] = function ($event) {
                            value[key] = $event;
                        };
                    }
                }
            };
            for (var key in value) {
                _loop_1(key);
            }
        }
    }
    return data;
}

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic(index, isInFor) {
    var cached = this._staticTrees || (this._staticTrees = []);
    var tree = cached[index];
    // if has already-rendered static tree and not inside v-for,
    // we can reuse the same tree.
    if (tree && !isInFor) {
        return tree;
    }
    // otherwise, render a fresh tree.
    tree = cached[index] = this.$options.staticRenderFns[index].call(this._renderProxy, this._c, this // for render fns generated for functional component templates
    );
    markStatic(tree, "__static__".concat(index), false);
    return tree;
}
/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce(tree, index, key) {
    markStatic(tree, "__once__".concat(index).concat(key ? "_".concat(key) : ""), true);
    return tree;
}
function markStatic(tree, key, isOnce) {
    if (isArray(tree)) {
        for (var i = 0; i < tree.length; i++) {
            if (tree[i] && typeof tree[i] !== 'string') {
                markStaticNode(tree[i], "".concat(key, "_").concat(i), isOnce);
            }
        }
    }
    else {
        markStaticNode(tree, key, isOnce);
    }
}
function markStaticNode(node, key, isOnce) {
    node.isStatic = true;
    node.key = key;
    node.isOnce = isOnce;
}

function bindObjectListeners(data, value) {
    if (value) {
        if (!isPlainObject(value)) {
            "production" !== 'production' && warn('v-on without argument expects an Object value', this);
        }
        else {
            var on = (data.on = data.on ? extend({}, data.on) : {});
            for (var key in value) {
                var existing = on[key];
                var ours = value[key];
                on[key] = existing ? [].concat(existing, ours) : ours;
            }
        }
    }
    return data;
}

function resolveScopedSlots(fns, res, 
// the following are added in 2.6
hasDynamicKeys, contentHashKey) {
    res = res || { $stable: !hasDynamicKeys };
    for (var i = 0; i < fns.length; i++) {
        var slot = fns[i];
        if (isArray(slot)) {
            resolveScopedSlots(slot, res, hasDynamicKeys);
        }
        else if (slot) {
            // marker for reverse proxying v-slot without scope on this.$slots
            // @ts-expect-error
            if (slot.proxy) {
                // @ts-expect-error
                slot.fn.proxy = true;
            }
            res[slot.key] = slot.fn;
        }
    }
    if (contentHashKey) {
        res.$key = contentHashKey;
    }
    return res;
}

// helper to process dynamic keys for dynamic arguments in v-bind and v-on.
function bindDynamicKeys(baseObj, values) {
    for (var i = 0; i < values.length; i += 2) {
        var key = values[i];
        if (typeof key === 'string' && key) {
            baseObj[values[i]] = values[i + 1];
        }
        else if (false) {
            // null is a special value for explicitly removing a binding
            warn("Invalid value for dynamic directive argument (expected string or null): ".concat(key), this);
        }
    }
    return baseObj;
}
// helper to dynamically append modifier runtime markers to event names.
// ensure only append when value is already string, otherwise it will be cast
// to string and cause the type check to miss.
function prependModifier(value, symbol) {
    return typeof value === 'string' ? symbol + value : value;
}

function installRenderHelpers(target) {
    target._o = markOnce;
    target._n = toNumber;
    target._s = toString;
    target._l = renderList;
    target._t = renderSlot;
    target._q = looseEqual;
    target._i = looseIndexOf;
    target._m = renderStatic;
    target._f = resolveFilter;
    target._k = checkKeyCodes;
    target._b = bindObjectProps;
    target._v = createTextVNode;
    target._e = createEmptyVNode;
    target._u = resolveScopedSlots;
    target._g = bindObjectListeners;
    target._d = bindDynamicKeys;
    target._p = prependModifier;
}

/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots(children, context) {
    if (!children || !children.length) {
        return {};
    }
    var slots = {};
    for (var i = 0, l = children.length; i < l; i++) {
        var child = children[i];
        var data = child.data;
        // remove slot attribute if the node is resolved as a Vue slot node
        if (data && data.attrs && data.attrs.slot) {
            delete data.attrs.slot;
        }
        // named slots should only be respected if the vnode was rendered in the
        // same context.
        if ((child.context === context || child.fnContext === context) &&
            data &&
            data.slot != null) {
            var name_1 = data.slot;
            var slot = slots[name_1] || (slots[name_1] = []);
            if (child.tag === 'template') {
                slot.push.apply(slot, child.children || []);
            }
            else {
                slot.push(child);
            }
        }
        else {
            (slots.default || (slots.default = [])).push(child);
        }
    }
    // ignore slots that contains only whitespace
    for (var name_2 in slots) {
        if (slots[name_2].every(isWhitespace)) {
            delete slots[name_2];
        }
    }
    return slots;
}
function isWhitespace(node) {
    return (node.isComment && !node.asyncFactory) || node.text === ' ';
}

function isAsyncPlaceholder(node) {
    // @ts-expect-error not really boolean type
    return node.isComment && node.asyncFactory;
}

function normalizeScopedSlots(ownerVm, scopedSlots, normalSlots, prevScopedSlots) {
    var res;
    var hasNormalSlots = Object.keys(normalSlots).length > 0;
    var isStable = scopedSlots ? !!scopedSlots.$stable : !hasNormalSlots;
    var key = scopedSlots && scopedSlots.$key;
    if (!scopedSlots) {
        res = {};
    }
    else if (scopedSlots._normalized) {
        // fast path 1: child component re-render only, parent did not change
        return scopedSlots._normalized;
    }
    else if (isStable &&
        prevScopedSlots &&
        prevScopedSlots !== emptyObject &&
        key === prevScopedSlots.$key &&
        !hasNormalSlots &&
        !prevScopedSlots.$hasNormal) {
        // fast path 2: stable scoped slots w/ no normal slots to proxy,
        // only need to normalize once
        return prevScopedSlots;
    }
    else {
        res = {};
        for (var key_1 in scopedSlots) {
            if (scopedSlots[key_1] && key_1[0] !== '$') {
                res[key_1] = normalizeScopedSlot(ownerVm, normalSlots, key_1, scopedSlots[key_1]);
            }
        }
    }
    // expose normal slots on scopedSlots
    for (var key_2 in normalSlots) {
        if (!(key_2 in res)) {
            res[key_2] = proxyNormalSlot(normalSlots, key_2);
        }
    }
    // avoriaz seems to mock a non-extensible $scopedSlots object
    // and when that is passed down this would cause an error
    if (scopedSlots && Object.isExtensible(scopedSlots)) {
        scopedSlots._normalized = res;
    }
    def(res, '$stable', isStable);
    def(res, '$key', key);
    def(res, '$hasNormal', hasNormalSlots);
    return res;
}
function normalizeScopedSlot(vm, normalSlots, key, fn) {
    var normalized = function () {
        var cur = currentInstance;
        setCurrentInstance(vm);
        var res = arguments.length ? fn.apply(null, arguments) : fn({});
        res =
            res && typeof res === 'object' && !isArray(res)
                ? [res] // single vnode
                : normalizeChildren(res);
        var vnode = res && res[0];
        setCurrentInstance(cur);
        return res &&
            (!vnode ||
                (res.length === 1 && vnode.isComment && !isAsyncPlaceholder(vnode))) // #9658, #10391
            ? undefined
            : res;
    };
    // this is a slot using the new v-slot syntax without scope. although it is
    // compiled as a scoped slot, render fn users would expect it to be present
    // on this.$slots because the usage is semantically a normal slot.
    if (fn.proxy) {
        Object.defineProperty(normalSlots, key, {
            get: normalized,
            enumerable: true,
            configurable: true
        });
    }
    return normalized;
}
function proxyNormalSlot(slots, key) {
    return function () { return slots[key]; };
}

function initSetup(vm) {
    var options = vm.$options;
    var setup = options.setup;
    if (setup) {
        var ctx = (vm._setupContext = createSetupContext(vm));
        setCurrentInstance(vm);
        pushTarget();
        var setupResult = invokeWithErrorHandling(setup, null, [vm._props || shallowReactive({}), ctx], vm, "setup");
        popTarget();
        setCurrentInstance();
        if (isFunction(setupResult)) {
            // render function
            // @ts-ignore
            options.render = setupResult;
        }
        else if (isObject(setupResult)) {
            // bindings
            if (false) {
                warn("setup() should not return VNodes directly - " +
                    "return a render function instead.");
            }
            vm._setupState = setupResult;
            // __sfc indicates compiled bindings from <script setup>
            if (!setupResult.__sfc) {
                for (var key in setupResult) {
                    if (!isReserved(key)) {
                        proxyWithRefUnwrap(vm, setupResult, key);
                    }
                    else if (false) {
                        warn("Avoid using variables that start with _ or $ in setup().");
                    }
                }
            }
            else {
                // exposed for compiled render fn
                var proxy = (vm._setupProxy = {});
                for (var key in setupResult) {
                    if (key !== '__sfc') {
                        proxyWithRefUnwrap(proxy, setupResult, key);
                    }
                }
            }
        }
        else if (false) {
            warn("setup() should return an object. Received: ".concat(setupResult === null ? 'null' : typeof setupResult));
        }
    }
}
function createSetupContext(vm) {
    var exposeCalled = false;
    return {
        get attrs() {
            if (!vm._attrsProxy) {
                var proxy = (vm._attrsProxy = {});
                def(proxy, '_v_attr_proxy', true);
                syncSetupProxy(proxy, vm.$attrs, emptyObject, vm, '$attrs');
            }
            return vm._attrsProxy;
        },
        get listeners() {
            if (!vm._listenersProxy) {
                var proxy = (vm._listenersProxy = {});
                syncSetupProxy(proxy, vm.$listeners, emptyObject, vm, '$listeners');
            }
            return vm._listenersProxy;
        },
        get slots() {
            return initSlotsProxy(vm);
        },
        emit: bind(vm.$emit, vm),
        expose: function (exposed) {
            if (false) {
                if (exposeCalled) {
                    warn("expose() should be called only once per setup().", vm);
                }
                exposeCalled = true;
            }
            if (exposed) {
                Object.keys(exposed).forEach(function (key) {
                    return proxyWithRefUnwrap(vm, exposed, key);
                });
            }
        }
    };
}
function syncSetupProxy(to, from, prev, instance, type) {
    var changed = false;
    for (var key in from) {
        if (!(key in to)) {
            changed = true;
            defineProxyAttr(to, key, instance, type);
        }
        else if (from[key] !== prev[key]) {
            changed = true;
        }
    }
    for (var key in to) {
        if (!(key in from)) {
            changed = true;
            delete to[key];
        }
    }
    return changed;
}
function defineProxyAttr(proxy, key, instance, type) {
    Object.defineProperty(proxy, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            return instance[type][key];
        }
    });
}
function initSlotsProxy(vm) {
    if (!vm._slotsProxy) {
        syncSetupSlots((vm._slotsProxy = {}), vm.$scopedSlots);
    }
    return vm._slotsProxy;
}
function syncSetupSlots(to, from) {
    for (var key in from) {
        to[key] = from[key];
    }
    for (var key in to) {
        if (!(key in from)) {
            delete to[key];
        }
    }
}
/**
 * @internal use manual type def because public setup context type relies on
 * legacy VNode types
 */
function useSlots() {
    return getContext().slots;
}
/**
 * @internal use manual type def because public setup context type relies on
 * legacy VNode types
 */
function useAttrs() {
    return getContext().attrs;
}
/**
 * Vue 2 only
 * @internal use manual type def because public setup context type relies on
 * legacy VNode types
 */
function useListeners() {
    return getContext().listeners;
}
function getContext() {
    if (false) {
        warn("useContext() called without active instance.");
    }
    var vm = currentInstance;
    return vm._setupContext || (vm._setupContext = createSetupContext(vm));
}
/**
 * Runtime helper for merging default declarations. Imported by compiled code
 * only.
 * @internal
 */
function mergeDefaults(raw, defaults) {
    var props = isArray(raw)
        ? raw.reduce(function (normalized, p) { return ((normalized[p] = {}), normalized); }, {})
        : raw;
    for (var key in defaults) {
        var opt = props[key];
        if (opt) {
            if (isArray(opt) || isFunction(opt)) {
                props[key] = { type: opt, default: defaults[key] };
            }
            else {
                opt.default = defaults[key];
            }
        }
        else if (opt === null) {
            props[key] = { default: defaults[key] };
        }
        else if (false) {
            warn("props default key \"".concat(key, "\" has no corresponding declaration."));
        }
    }
    return props;
}

function initRender(vm) {
    vm._vnode = null; // the root of the child tree
    vm._staticTrees = null; // v-once cached trees
    var options = vm.$options;
    var parentVnode = (vm.$vnode = options._parentVnode); // the placeholder node in parent tree
    var renderContext = parentVnode && parentVnode.context;
    vm.$slots = resolveSlots(options._renderChildren, renderContext);
    vm.$scopedSlots = parentVnode
        ? normalizeScopedSlots(vm.$parent, parentVnode.data.scopedSlots, vm.$slots)
        : emptyObject;
    // bind the createElement fn to this instance
    // so that we get proper render context inside it.
    // args order: tag, data, children, normalizationType, alwaysNormalize
    // internal version is used by render functions compiled from templates
    // @ts-expect-error
    vm._c = function (a, b, c, d) { return createElement$1(vm, a, b, c, d, false); };
    // normalization is always applied for the public version, used in
    // user-written render functions.
    // @ts-expect-error
    vm.$createElement = function (a, b, c, d) { return createElement$1(vm, a, b, c, d, true); };
    // $attrs & $listeners are exposed for easier HOC creation.
    // they need to be reactive so that HOCs using them are always updated
    var parentData = parentVnode && parentVnode.data;
    /* istanbul ignore else */
    if (false) {
        defineReactive(vm, '$attrs', (parentData && parentData.attrs) || emptyObject, function () {
            !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
        }, true);
        defineReactive(vm, '$listeners', options._parentListeners || emptyObject, function () {
            !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
        }, true);
    }
    else {
        defineReactive(vm, '$attrs', (parentData && parentData.attrs) || emptyObject, null, true);
        defineReactive(vm, '$listeners', options._parentListeners || emptyObject, null, true);
    }
}
var currentRenderingInstance = null;
function renderMixin(Vue) {
    // install runtime convenience helpers
    installRenderHelpers(Vue.prototype);
    Vue.prototype.$nextTick = function (fn) {
        return nextTick(fn, this);
    };
    Vue.prototype._render = function () {
        var vm = this;
        var _a = vm.$options, render = _a.render, _parentVnode = _a._parentVnode;
        if (_parentVnode && vm._isMounted) {
            vm.$scopedSlots = normalizeScopedSlots(vm.$parent, _parentVnode.data.scopedSlots, vm.$slots, vm.$scopedSlots);
            if (vm._slotsProxy) {
                syncSetupSlots(vm._slotsProxy, vm.$scopedSlots);
            }
        }
        // set parent vnode. this allows render functions to have access
        // to the data on the placeholder node.
        vm.$vnode = _parentVnode;
        // render self
        var prevInst = currentInstance;
        var prevRenderInst = currentRenderingInstance;
        var vnode;
        try {
            setCurrentInstance(vm);
            currentRenderingInstance = vm;
            vnode = render.call(vm._renderProxy, vm.$createElement);
        }
        catch (e) {
            handleError(e, vm, "render");
            // return error render result,
            // or previous vnode to prevent render error causing blank component
            /* istanbul ignore else */
            if (false) {
                try {
                    vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
                }
                catch (e) {
                    handleError(e, vm, "renderError");
                    vnode = vm._vnode;
                }
            }
            else {
                vnode = vm._vnode;
            }
        }
        finally {
            currentRenderingInstance = prevRenderInst;
            setCurrentInstance(prevInst);
        }
        // if the returned array contains only a single node, allow it
        if (isArray(vnode) && vnode.length === 1) {
            vnode = vnode[0];
        }
        // return empty vnode in case the render function errored out
        if (!(vnode instanceof VNode)) {
            if (false) {
                warn('Multiple root nodes returned from render function. Render function ' +
                    'should return a single root node.', vm);
            }
            vnode = createEmptyVNode();
        }
        // set parent
        vnode.parent = _parentVnode;
        return vnode;
    };
}

function ensureCtor(comp, base) {
    if (comp.__esModule || (hasSymbol && comp[Symbol.toStringTag] === 'Module')) {
        comp = comp.default;
    }
    return isObject(comp) ? base.extend(comp) : comp;
}
function createAsyncPlaceholder(factory, data, context, children, tag) {
    var node = createEmptyVNode();
    node.asyncFactory = factory;
    node.asyncMeta = { data: data, context: context, children: children, tag: tag };
    return node;
}
function resolveAsyncComponent(factory, baseCtor) {
    if (isTrue(factory.error) && isDef(factory.errorComp)) {
        return factory.errorComp;
    }
    if (isDef(factory.resolved)) {
        return factory.resolved;
    }
    var owner = currentRenderingInstance;
    if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
        // already pending
        factory.owners.push(owner);
    }
    if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
        return factory.loadingComp;
    }
    if (owner && !isDef(factory.owners)) {
        var owners_1 = (factory.owners = [owner]);
        var sync_1 = true;
        var timerLoading_1 = null;
        var timerTimeout_1 = null;
        owner.$on('hook:destroyed', function () { return remove$2(owners_1, owner); });
        var forceRender_1 = function (renderCompleted) {
            for (var i = 0, l = owners_1.length; i < l; i++) {
                owners_1[i].$forceUpdate();
            }
            if (renderCompleted) {
                owners_1.length = 0;
                if (timerLoading_1 !== null) {
                    clearTimeout(timerLoading_1);
                    timerLoading_1 = null;
                }
                if (timerTimeout_1 !== null) {
                    clearTimeout(timerTimeout_1);
                    timerTimeout_1 = null;
                }
            }
        };
        var resolve = once(function (res) {
            // cache resolved
            factory.resolved = ensureCtor(res, baseCtor);
            // invoke callbacks only if this is not a synchronous resolve
            // (async resolves are shimmed as synchronous during SSR)
            if (!sync_1) {
                forceRender_1(true);
            }
            else {
                owners_1.length = 0;
            }
        });
        var reject_1 = once(function (reason) {
            "production" !== 'production' &&
                warn("Failed to resolve async component: ".concat(String(factory)) +
                    (reason ? "\nReason: ".concat(reason) : ''));
            if (isDef(factory.errorComp)) {
                factory.error = true;
                forceRender_1(true);
            }
        });
        var res_1 = factory(resolve, reject_1);
        if (isObject(res_1)) {
            if (isPromise(res_1)) {
                // () => Promise
                if (isUndef(factory.resolved)) {
                    res_1.then(resolve, reject_1);
                }
            }
            else if (isPromise(res_1.component)) {
                res_1.component.then(resolve, reject_1);
                if (isDef(res_1.error)) {
                    factory.errorComp = ensureCtor(res_1.error, baseCtor);
                }
                if (isDef(res_1.loading)) {
                    factory.loadingComp = ensureCtor(res_1.loading, baseCtor);
                    if (res_1.delay === 0) {
                        factory.loading = true;
                    }
                    else {
                        // @ts-expect-error NodeJS timeout type
                        timerLoading_1 = setTimeout(function () {
                            timerLoading_1 = null;
                            if (isUndef(factory.resolved) && isUndef(factory.error)) {
                                factory.loading = true;
                                forceRender_1(false);
                            }
                        }, res_1.delay || 200);
                    }
                }
                if (isDef(res_1.timeout)) {
                    // @ts-expect-error NodeJS timeout type
                    timerTimeout_1 = setTimeout(function () {
                        timerTimeout_1 = null;
                        if (isUndef(factory.resolved)) {
                            reject_1( false ? "timeout (".concat(res_1.timeout, "ms)") : null);
                        }
                    }, res_1.timeout);
                }
            }
        }
        sync_1 = false;
        // return in case resolved synchronously
        return factory.loading ? factory.loadingComp : factory.resolved;
    }
}

function getFirstComponentChild(children) {
    if (isArray(children)) {
        for (var i = 0; i < children.length; i++) {
            var c = children[i];
            if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
                return c;
            }
        }
    }
}

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;
// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement$1(context, tag, data, children, normalizationType, alwaysNormalize) {
    if (isArray(data) || isPrimitive(data)) {
        normalizationType = children;
        children = data;
        data = undefined;
    }
    if (isTrue(alwaysNormalize)) {
        normalizationType = ALWAYS_NORMALIZE;
    }
    return _createElement(context, tag, data, children, normalizationType);
}
function _createElement(context, tag, data, children, normalizationType) {
    if (isDef(data) && isDef(data.__ob__)) {
        "production" !== 'production' &&
            warn("Avoid using observed data object as vnode data: ".concat(JSON.stringify(data), "\n") + 'Always create fresh vnode data objects in each render!', context);
        return createEmptyVNode();
    }
    // object syntax in v-bind
    if (isDef(data) && isDef(data.is)) {
        tag = data.is;
    }
    if (!tag) {
        // in case of component :is set to falsy value
        return createEmptyVNode();
    }
    // warn against non-primitive key
    if (false) {
        warn('Avoid using non-primitive value as key, ' +
            'use string/number value instead.', context);
    }
    // support single function children as default scoped slot
    if (isArray(children) && isFunction(children[0])) {
        data = data || {};
        data.scopedSlots = { default: children[0] };
        children.length = 0;
    }
    if (normalizationType === ALWAYS_NORMALIZE) {
        children = normalizeChildren(children);
    }
    else if (normalizationType === SIMPLE_NORMALIZE) {
        children = simpleNormalizeChildren(children);
    }
    var vnode, ns;
    if (typeof tag === 'string') {
        var Ctor = void 0;
        ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
        if (config.isReservedTag(tag)) {
            // platform built-in elements
            if (false) {
                warn("The .native modifier for v-on is only valid on components but it was used on <".concat(tag, ">."), context);
            }
            vnode = new VNode(config.parsePlatformTagName(tag), data, children, undefined, undefined, context);
        }
        else if ((!data || !data.pre) &&
            isDef((Ctor = resolveAsset(context.$options, 'components', tag)))) {
            // component
            vnode = createComponent(Ctor, data, context, children, tag);
        }
        else {
            // unknown or unlisted namespaced elements
            // check at runtime because it may get assigned a namespace when its
            // parent normalizes children
            vnode = new VNode(tag, data, children, undefined, undefined, context);
        }
    }
    else {
        // direct component options / constructor
        vnode = createComponent(tag, data, context, children);
    }
    if (isArray(vnode)) {
        return vnode;
    }
    else if (isDef(vnode)) {
        if (isDef(ns))
            applyNS(vnode, ns);
        if (isDef(data))
            registerDeepBindings(data);
        return vnode;
    }
    else {
        return createEmptyVNode();
    }
}
function applyNS(vnode, ns, force) {
    vnode.ns = ns;
    if (vnode.tag === 'foreignObject') {
        // use default namespace inside foreignObject
        ns = undefined;
        force = true;
    }
    if (isDef(vnode.children)) {
        for (var i = 0, l = vnode.children.length; i < l; i++) {
            var child = vnode.children[i];
            if (isDef(child.tag) &&
                (isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
                applyNS(child, ns, force);
            }
        }
    }
}
// ref #5318
// necessary to ensure parent re-render when deep bindings like :style and
// :class are used on slot nodes
function registerDeepBindings(data) {
    if (isObject(data.style)) {
        traverse(data.style);
    }
    if (isObject(data.class)) {
        traverse(data.class);
    }
}

/**
 * @internal this function needs manual public type declaration because it relies
 * on previously manually authored types from Vue 2
 */
function h(type, props, children) {
    if (!currentInstance) {
        "production" !== 'production' &&
            warn("globally imported h() can only be invoked when there is an active " +
                "component instance, e.g. synchronously in a component's render or setup function.");
    }
    return createElement$1(currentInstance, type, props, children, 2, true);
}

function handleError(err, vm, info) {
    // Deactivate deps tracking while processing error handler to avoid possible infinite rendering.
    // See: https://github.com/vuejs/vuex/issues/1505
    pushTarget();
    try {
        if (vm) {
            var cur = vm;
            while ((cur = cur.$parent)) {
                var hooks = cur.$options.errorCaptured;
                if (hooks) {
                    for (var i = 0; i < hooks.length; i++) {
                        try {
                            var capture = hooks[i].call(cur, err, vm, info) === false;
                            if (capture)
                                return;
                        }
                        catch (e) {
                            globalHandleError(e, cur, 'errorCaptured hook');
                        }
                    }
                }
            }
        }
        globalHandleError(err, vm, info);
    }
    finally {
        popTarget();
    }
}
function invokeWithErrorHandling(handler, context, args, vm, info) {
    var res;
    try {
        res = args ? handler.apply(context, args) : handler.call(context);
        if (res && !res._isVue && isPromise(res) && !res._handled) {
            res.catch(function (e) { return handleError(e, vm, info + " (Promise/async)"); });
            res._handled = true;
        }
    }
    catch (e) {
        handleError(e, vm, info);
    }
    return res;
}
function globalHandleError(err, vm, info) {
    if (config.errorHandler) {
        try {
            return config.errorHandler.call(null, err, vm, info);
        }
        catch (e) {
            // if the user intentionally throws the original error in the handler,
            // do not log it twice
            if (e !== err) {
                logError(e, null, 'config.errorHandler');
            }
        }
    }
    logError(err, vm, info);
}
function logError(err, vm, info) {
    if (false) {
        warn("Error in ".concat(info, ": \"").concat(err.toString(), "\""), vm);
    }
    /* istanbul ignore else */
    if (inBrowser && typeof console !== 'undefined') {
        console.error(err);
    }
    else {
        throw err;
    }
}

/* globals MutationObserver */
var isUsingMicroTask = false;
var callbacks = [];
var pending = false;
function flushCallbacks() {
    pending = false;
    var copies = callbacks.slice(0);
    callbacks.length = 0;
    for (var i = 0; i < copies.length; i++) {
        copies[i]();
    }
}
// Here we have async deferring wrappers using microtasks.
// In 2.5 we used (macro) tasks (in combination with microtasks).
// However, it has subtle problems when state is changed right before repaint
// (e.g. #6813, out-in transitions).
// Also, using (macro) tasks in event handler would cause some weird behaviors
// that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
// So we now use microtasks everywhere, again.
// A major drawback of this tradeoff is that there are some scenarios
// where microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690, which have workarounds)
// or even between bubbling of the same event (#6566).
var timerFunc;
// The nextTick behavior leverages the microtask queue, which can be accessed
// via either native Promise.then or MutationObserver.
// MutationObserver has wider support, however it is seriously bugged in
// UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
// completely stops working after triggering a few times... so, if native
// Promise is available, we will use it:
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
    var p_1 = Promise.resolve();
    timerFunc = function () {
        p_1.then(flushCallbacks);
        // In problematic UIWebViews, Promise.then doesn't completely break, but
        // it can get stuck in a weird state where callbacks are pushed into the
        // microtask queue but the queue isn't being flushed, until the browser
        // needs to do some other work, e.g. handle a timer. Therefore we can
        // "force" the microtask queue to be flushed by adding an empty timer.
        if (isIOS)
            setTimeout(noop);
    };
    isUsingMicroTask = true;
}
else if (!isIE &&
    typeof MutationObserver !== 'undefined' &&
    (isNative(MutationObserver) ||
        // PhantomJS and iOS 7.x
        MutationObserver.toString() === '[object MutationObserverConstructor]')) {
    // Use MutationObserver where native Promise is not available,
    // e.g. PhantomJS, iOS7, Android 4.4
    // (#6466 MutationObserver is unreliable in IE11)
    var counter_1 = 1;
    var observer = new MutationObserver(flushCallbacks);
    var textNode_1 = document.createTextNode(String(counter_1));
    observer.observe(textNode_1, {
        characterData: true
    });
    timerFunc = function () {
        counter_1 = (counter_1 + 1) % 2;
        textNode_1.data = String(counter_1);
    };
    isUsingMicroTask = true;
}
else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
    // Fallback to setImmediate.
    // Technically it leverages the (macro) task queue,
    // but it is still a better choice than setTimeout.
    timerFunc = function () {
        setImmediate(flushCallbacks);
    };
}
else {
    // Fallback to setTimeout.
    timerFunc = function () {
        setTimeout(flushCallbacks, 0);
    };
}
/**
 * @internal
 */
function nextTick(cb, ctx) {
    var _resolve;
    callbacks.push(function () {
        if (cb) {
            try {
                cb.call(ctx);
            }
            catch (e) {
                handleError(e, ctx, 'nextTick');
            }
        }
        else if (_resolve) {
            _resolve(ctx);
        }
    });
    if (!pending) {
        pending = true;
        timerFunc();
    }
    // $flow-disable-line
    if (!cb && typeof Promise !== 'undefined') {
        return new Promise(function (resolve) {
            _resolve = resolve;
        });
    }
}

function useCssModule(name) {
    if (name === void 0) { name = '$style'; }
    /* istanbul ignore else */
    {
        if (!currentInstance) {
            "production" !== 'production' && warn("useCssModule must be called inside setup()");
            return emptyObject;
        }
        var mod = currentInstance[name];
        if (!mod) {
            "production" !== 'production' &&
                warn("Current instance does not have CSS module named \"".concat(name, "\"."));
            return emptyObject;
        }
        return mod;
    }
}

/**
 * Runtime helper for SFC's CSS variable injection feature.
 * @private
 */
function useCssVars(getter) {
    if (!inBrowser && !false)
        return;
    var instance = currentInstance;
    if (!instance) {
        "production" !== 'production' &&
            warn("useCssVars is called without current active component instance.");
        return;
    }
    watchPostEffect(function () {
        var el = instance.$el;
        var vars = getter(instance, instance._setupProxy);
        if (el && el.nodeType === 1) {
            var style = el.style;
            for (var key in vars) {
                style.setProperty("--".concat(key), vars[key]);
            }
        }
    });
}

/**
 * v3-compatible async component API.
 * @internal the type is manually declared in <root>/types/v3-define-async-component.d.ts
 * because it relies on existing manual types
 */
function defineAsyncComponent(source) {
    if (isFunction(source)) {
        source = { loader: source };
    }
    var loader = source.loader, loadingComponent = source.loadingComponent, errorComponent = source.errorComponent, _a = source.delay, delay = _a === void 0 ? 200 : _a, timeout = source.timeout, // undefined = never times out
    _b = source.suspensible, // undefined = never times out
    suspensible = _b === void 0 ? false : _b, // in Vue 3 default is true
    userOnError = source.onError;
    if (false) {
        warn("The suspensible option for async components is not supported in Vue2. It is ignored.");
    }
    var pendingRequest = null;
    var retries = 0;
    var retry = function () {
        retries++;
        pendingRequest = null;
        return load();
    };
    var load = function () {
        var thisRequest;
        return (pendingRequest ||
            (thisRequest = pendingRequest =
                loader()
                    .catch(function (err) {
                    err = err instanceof Error ? err : new Error(String(err));
                    if (userOnError) {
                        return new Promise(function (resolve, reject) {
                            var userRetry = function () { return resolve(retry()); };
                            var userFail = function () { return reject(err); };
                            userOnError(err, userRetry, userFail, retries + 1);
                        });
                    }
                    else {
                        throw err;
                    }
                })
                    .then(function (comp) {
                    if (thisRequest !== pendingRequest && pendingRequest) {
                        return pendingRequest;
                    }
                    if (false) {
                        warn("Async component loader resolved to undefined. " +
                            "If you are using retry(), make sure to return its return value.");
                    }
                    // interop module default
                    if (comp &&
                        (comp.__esModule || comp[Symbol.toStringTag] === 'Module')) {
                        comp = comp.default;
                    }
                    if (false) {
                        throw new Error("Invalid async component load result: ".concat(comp));
                    }
                    return comp;
                })));
    };
    return function () {
        var component = load();
        return {
            component: component,
            delay: delay,
            timeout: timeout,
            error: errorComponent,
            loading: loadingComponent
        };
    };
}

function createLifeCycle(hookName) {
    return function (fn, target) {
        if (target === void 0) { target = currentInstance; }
        if (!target) {
            "production" !== 'production' &&
                warn("".concat(formatName(hookName), " is called when there is no active component instance to be ") +
                    "associated with. " +
                    "Lifecycle injection APIs can only be used during execution of setup().");
            return;
        }
        return injectHook(target, hookName, fn);
    };
}
function formatName(name) {
    if (name === 'beforeDestroy') {
        name = 'beforeUnmount';
    }
    else if (name === 'destroyed') {
        name = 'unmounted';
    }
    return "on".concat(name[0].toUpperCase() + name.slice(1));
}
function injectHook(instance, hookName, fn) {
    var options = instance.$options;
    options[hookName] = mergeLifecycleHook(options[hookName], fn);
}
var onBeforeMount = createLifeCycle('beforeMount');
var onMounted = createLifeCycle('mounted');
var onBeforeUpdate = createLifeCycle('beforeUpdate');
var onUpdated = createLifeCycle('updated');
var onBeforeUnmount = createLifeCycle('beforeDestroy');
var onUnmounted = createLifeCycle('destroyed');
var onActivated = createLifeCycle('activated');
var onDeactivated = createLifeCycle('deactivated');
var onServerPrefetch = createLifeCycle('serverPrefetch');
var onRenderTracked = createLifeCycle('renderTracked');
var onRenderTriggered = createLifeCycle('renderTriggered');
var injectErrorCapturedHook = createLifeCycle('errorCaptured');
function onErrorCaptured(hook, target) {
    if (target === void 0) { target = currentInstance; }
    injectErrorCapturedHook(hook, target);
}

/**
 * Note: also update dist/vue.runtime.mjs when adding new exports to this file.
 */
var version = '2.7.16';
/**
 * @internal type is manually declared in <root>/types/v3-define-component.d.ts
 */
function defineComponent(options) {
    return options;
}

var seenObjects = new _Set();
/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
function traverse(val) {
    _traverse(val, seenObjects);
    seenObjects.clear();
    return val;
}
function _traverse(val, seen) {
    var i, keys;
    var isA = isArray(val);
    if ((!isA && !isObject(val)) ||
        val.__v_skip /* ReactiveFlags.SKIP */ ||
        Object.isFrozen(val) ||
        val instanceof VNode) {
        return;
    }
    if (val.__ob__) {
        var depId = val.__ob__.dep.id;
        if (seen.has(depId)) {
            return;
        }
        seen.add(depId);
    }
    if (isA) {
        i = val.length;
        while (i--)
            _traverse(val[i], seen);
    }
    else if (isRef(val)) {
        _traverse(val.value, seen);
    }
    else {
        keys = Object.keys(val);
        i = keys.length;
        while (i--)
            _traverse(val[keys[i]], seen);
    }
}

var uid$1 = 0;
/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 * @internal
 */
var Watcher = /** @class */ (function () {
    function Watcher(vm, expOrFn, cb, options, isRenderWatcher) {
        recordEffectScope(this, 
        // if the active effect scope is manually created (not a component scope),
        // prioritize it
        activeEffectScope && !activeEffectScope._vm
            ? activeEffectScope
            : vm
                ? vm._scope
                : undefined);
        if ((this.vm = vm) && isRenderWatcher) {
            vm._watcher = this;
        }
        // options
        if (options) {
            this.deep = !!options.deep;
            this.user = !!options.user;
            this.lazy = !!options.lazy;
            this.sync = !!options.sync;
            this.before = options.before;
            if (false) {
                this.onTrack = options.onTrack;
                this.onTrigger = options.onTrigger;
            }
        }
        else {
            this.deep = this.user = this.lazy = this.sync = false;
        }
        this.cb = cb;
        this.id = ++uid$1; // uid for batching
        this.active = true;
        this.post = false;
        this.dirty = this.lazy; // for lazy watchers
        this.deps = [];
        this.newDeps = [];
        this.depIds = new _Set();
        this.newDepIds = new _Set();
        this.expression =  false ? expOrFn.toString() : '';
        // parse expression for getter
        if (isFunction(expOrFn)) {
            this.getter = expOrFn;
        }
        else {
            this.getter = parsePath(expOrFn);
            if (!this.getter) {
                this.getter = noop;
                "production" !== 'production' &&
                    warn("Failed watching path: \"".concat(expOrFn, "\" ") +
                        'Watcher only accepts simple dot-delimited paths. ' +
                        'For full control, use a function instead.', vm);
            }
        }
        this.value = this.lazy ? undefined : this.get();
    }
    /**
     * Evaluate the getter, and re-collect dependencies.
     */
    Watcher.prototype.get = function () {
        pushTarget(this);
        var value;
        var vm = this.vm;
        try {
            value = this.getter.call(vm, vm);
        }
        catch (e) {
            if (this.user) {
                handleError(e, vm, "getter for watcher \"".concat(this.expression, "\""));
            }
            else {
                throw e;
            }
        }
        finally {
            // "touch" every property so they are all tracked as
            // dependencies for deep watching
            if (this.deep) {
                traverse(value);
            }
            popTarget();
            this.cleanupDeps();
        }
        return value;
    };
    /**
     * Add a dependency to this directive.
     */
    Watcher.prototype.addDep = function (dep) {
        var id = dep.id;
        if (!this.newDepIds.has(id)) {
            this.newDepIds.add(id);
            this.newDeps.push(dep);
            if (!this.depIds.has(id)) {
                dep.addSub(this);
            }
        }
    };
    /**
     * Clean up for dependency collection.
     */
    Watcher.prototype.cleanupDeps = function () {
        var i = this.deps.length;
        while (i--) {
            var dep = this.deps[i];
            if (!this.newDepIds.has(dep.id)) {
                dep.removeSub(this);
            }
        }
        var tmp = this.depIds;
        this.depIds = this.newDepIds;
        this.newDepIds = tmp;
        this.newDepIds.clear();
        tmp = this.deps;
        this.deps = this.newDeps;
        this.newDeps = tmp;
        this.newDeps.length = 0;
    };
    /**
     * Subscriber interface.
     * Will be called when a dependency changes.
     */
    Watcher.prototype.update = function () {
        /* istanbul ignore else */
        if (this.lazy) {
            this.dirty = true;
        }
        else if (this.sync) {
            this.run();
        }
        else {
            queueWatcher(this);
        }
    };
    /**
     * Scheduler job interface.
     * Will be called by the scheduler.
     */
    Watcher.prototype.run = function () {
        if (this.active) {
            var value = this.get();
            if (value !== this.value ||
                // Deep watchers and watchers on Object/Arrays should fire even
                // when the value is the same, because the value may
                // have mutated.
                isObject(value) ||
                this.deep) {
                // set new value
                var oldValue = this.value;
                this.value = value;
                if (this.user) {
                    var info = "callback for watcher \"".concat(this.expression, "\"");
                    invokeWithErrorHandling(this.cb, this.vm, [value, oldValue], this.vm, info);
                }
                else {
                    this.cb.call(this.vm, value, oldValue);
                }
            }
        }
    };
    /**
     * Evaluate the value of the watcher.
     * This only gets called for lazy watchers.
     */
    Watcher.prototype.evaluate = function () {
        this.value = this.get();
        this.dirty = false;
    };
    /**
     * Depend on all deps collected by this watcher.
     */
    Watcher.prototype.depend = function () {
        var i = this.deps.length;
        while (i--) {
            this.deps[i].depend();
        }
    };
    /**
     * Remove self from all dependencies' subscriber list.
     */
    Watcher.prototype.teardown = function () {
        if (this.vm && !this.vm._isBeingDestroyed) {
            remove$2(this.vm._scope.effects, this);
        }
        if (this.active) {
            var i = this.deps.length;
            while (i--) {
                this.deps[i].removeSub(this);
            }
            this.active = false;
            if (this.onStop) {
                this.onStop();
            }
        }
    };
    return Watcher;
}());

var mark;
var measure;
if (false) {
    var perf_1 = inBrowser && window.performance;
    /* istanbul ignore if */
    if (perf_1 &&
        // @ts-ignore
        perf_1.mark &&
        // @ts-ignore
        perf_1.measure &&
        // @ts-ignore
        perf_1.clearMarks &&
        // @ts-ignore
        perf_1.clearMeasures) {
        mark = function (tag) { return perf_1.mark(tag); };
        measure = function (name, startTag, endTag) {
            perf_1.measure(name, startTag, endTag);
            perf_1.clearMarks(startTag);
            perf_1.clearMarks(endTag);
            // perf.clearMeasures(name)
        };
    }
}

function initEvents(vm) {
    vm._events = Object.create(null);
    vm._hasHookEvent = false;
    // init parent attached events
    var listeners = vm.$options._parentListeners;
    if (listeners) {
        updateComponentListeners(vm, listeners);
    }
}
var target$1;
function add$1(event, fn) {
    target$1.$on(event, fn);
}
function remove$1(event, fn) {
    target$1.$off(event, fn);
}
function createOnceHandler$1(event, fn) {
    var _target = target$1;
    return function onceHandler() {
        var res = fn.apply(null, arguments);
        if (res !== null) {
            _target.$off(event, onceHandler);
        }
    };
}
function updateComponentListeners(vm, listeners, oldListeners) {
    target$1 = vm;
    updateListeners(listeners, oldListeners || {}, add$1, remove$1, createOnceHandler$1, vm);
    target$1 = undefined;
}
function eventsMixin(Vue) {
    var hookRE = /^hook:/;
    Vue.prototype.$on = function (event, fn) {
        var vm = this;
        if (isArray(event)) {
            for (var i = 0, l = event.length; i < l; i++) {
                vm.$on(event[i], fn);
            }
        }
        else {
            (vm._events[event] || (vm._events[event] = [])).push(fn);
            // optimize hook:event cost by using a boolean flag marked at registration
            // instead of a hash lookup
            if (hookRE.test(event)) {
                vm._hasHookEvent = true;
            }
        }
        return vm;
    };
    Vue.prototype.$once = function (event, fn) {
        var vm = this;
        function on() {
            vm.$off(event, on);
            fn.apply(vm, arguments);
        }
        on.fn = fn;
        vm.$on(event, on);
        return vm;
    };
    Vue.prototype.$off = function (event, fn) {
        var vm = this;
        // all
        if (!arguments.length) {
            vm._events = Object.create(null);
            return vm;
        }
        // array of events
        if (isArray(event)) {
            for (var i_1 = 0, l = event.length; i_1 < l; i_1++) {
                vm.$off(event[i_1], fn);
            }
            return vm;
        }
        // specific event
        var cbs = vm._events[event];
        if (!cbs) {
            return vm;
        }
        if (!fn) {
            vm._events[event] = null;
            return vm;
        }
        // specific handler
        var cb;
        var i = cbs.length;
        while (i--) {
            cb = cbs[i];
            if (cb === fn || cb.fn === fn) {
                cbs.splice(i, 1);
                break;
            }
        }
        return vm;
    };
    Vue.prototype.$emit = function (event) {
        var vm = this;
        if (false) {
            var lowerCaseEvent = event.toLowerCase();
            if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
                tip("Event \"".concat(lowerCaseEvent, "\" is emitted in component ") +
                    "".concat(formatComponentName(vm), " but the handler is registered for \"").concat(event, "\". ") +
                    "Note that HTML attributes are case-insensitive and you cannot use " +
                    "v-on to listen to camelCase events when using in-DOM templates. " +
                    "You should probably use \"".concat(hyphenate(event), "\" instead of \"").concat(event, "\"."));
            }
        }
        var cbs = vm._events[event];
        if (cbs) {
            cbs = cbs.length > 1 ? toArray(cbs) : cbs;
            var args = toArray(arguments, 1);
            var info = "event handler for \"".concat(event, "\"");
            for (var i = 0, l = cbs.length; i < l; i++) {
                invokeWithErrorHandling(cbs[i], vm, args, vm, info);
            }
        }
        return vm;
    };
}

var activeInstance = null;
var isUpdatingChildComponent = false;
function setActiveInstance(vm) {
    var prevActiveInstance = activeInstance;
    activeInstance = vm;
    return function () {
        activeInstance = prevActiveInstance;
    };
}
function initLifecycle(vm) {
    var options = vm.$options;
    // locate first non-abstract parent
    var parent = options.parent;
    if (parent && !options.abstract) {
        while (parent.$options.abstract && parent.$parent) {
            parent = parent.$parent;
        }
        parent.$children.push(vm);
    }
    vm.$parent = parent;
    vm.$root = parent ? parent.$root : vm;
    vm.$children = [];
    vm.$refs = {};
    vm._provided = parent ? parent._provided : Object.create(null);
    vm._watcher = null;
    vm._inactive = null;
    vm._directInactive = false;
    vm._isMounted = false;
    vm._isDestroyed = false;
    vm._isBeingDestroyed = false;
}
function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode, hydrating) {
        var vm = this;
        var prevEl = vm.$el;
        var prevVnode = vm._vnode;
        var restoreActiveInstance = setActiveInstance(vm);
        vm._vnode = vnode;
        // Vue.prototype.__patch__ is injected in entry points
        // based on the rendering backend used.
        if (!prevVnode) {
            // initial render
            vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
        }
        else {
            // updates
            vm.$el = vm.__patch__(prevVnode, vnode);
        }
        restoreActiveInstance();
        // update __vue__ reference
        if (prevEl) {
            prevEl.__vue__ = null;
        }
        if (vm.$el) {
            vm.$el.__vue__ = vm;
        }
        // if parent is an HOC, update its $el as well
        var wrapper = vm;
        while (wrapper &&
            wrapper.$vnode &&
            wrapper.$parent &&
            wrapper.$vnode === wrapper.$parent._vnode) {
            wrapper.$parent.$el = wrapper.$el;
            wrapper = wrapper.$parent;
        }
        // updated hook is called by the scheduler to ensure that children are
        // updated in a parent's updated hook.
    };
    Vue.prototype.$forceUpdate = function () {
        var vm = this;
        if (vm._watcher) {
            vm._watcher.update();
        }
    };
    Vue.prototype.$destroy = function () {
        var vm = this;
        if (vm._isBeingDestroyed) {
            return;
        }
        callHook$1(vm, 'beforeDestroy');
        vm._isBeingDestroyed = true;
        // remove self from parent
        var parent = vm.$parent;
        if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
            remove$2(parent.$children, vm);
        }
        // teardown scope. this includes both the render watcher and other
        // watchers created
        vm._scope.stop();
        // remove reference from data ob
        // frozen object may not have observer.
        if (vm._data.__ob__) {
            vm._data.__ob__.vmCount--;
        }
        // call the last hook...
        vm._isDestroyed = true;
        // invoke destroy hooks on current rendered tree
        vm.__patch__(vm._vnode, null);
        // fire destroyed hook
        callHook$1(vm, 'destroyed');
        // turn off all instance listeners.
        vm.$off();
        // remove __vue__ reference
        if (vm.$el) {
            vm.$el.__vue__ = null;
        }
        // release circular reference (#6759)
        if (vm.$vnode) {
            vm.$vnode.parent = null;
        }
    };
}
function mountComponent(vm, el, hydrating) {
    vm.$el = el;
    if (!vm.$options.render) {
        // @ts-expect-error invalid type
        vm.$options.render = createEmptyVNode;
        if (false) {
            /* istanbul ignore if */
            if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
                vm.$options.el ||
                el) {
                warn('You are using the runtime-only build of Vue where the template ' +
                    'compiler is not available. Either pre-compile the templates into ' +
                    'render functions, or use the compiler-included build.', vm);
            }
            else {
                warn('Failed to mount component: template or render function not defined.', vm);
            }
        }
    }
    callHook$1(vm, 'beforeMount');
    var updateComponent;
    /* istanbul ignore if */
    if (false) {
        updateComponent = function () {
            var name = vm._name;
            var id = vm._uid;
            var startTag = "vue-perf-start:".concat(id);
            var endTag = "vue-perf-end:".concat(id);
            mark(startTag);
            var vnode = vm._render();
            mark(endTag);
            measure("vue ".concat(name, " render"), startTag, endTag);
            mark(startTag);
            vm._update(vnode, hydrating);
            mark(endTag);
            measure("vue ".concat(name, " patch"), startTag, endTag);
        };
    }
    else {
        updateComponent = function () {
            vm._update(vm._render(), hydrating);
        };
    }
    var watcherOptions = {
        before: function () {
            if (vm._isMounted && !vm._isDestroyed) {
                callHook$1(vm, 'beforeUpdate');
            }
        }
    };
    if (false) {
        watcherOptions.onTrack = function (e) { return callHook$1(vm, 'renderTracked', [e]); };
        watcherOptions.onTrigger = function (e) { return callHook$1(vm, 'renderTriggered', [e]); };
    }
    // we set this to vm._watcher inside the watcher's constructor
    // since the watcher's initial patch may call $forceUpdate (e.g. inside child
    // component's mounted hook), which relies on vm._watcher being already defined
    new Watcher(vm, updateComponent, noop, watcherOptions, true /* isRenderWatcher */);
    hydrating = false;
    // flush buffer for flush: "pre" watchers queued in setup()
    var preWatchers = vm._preWatchers;
    if (preWatchers) {
        for (var i = 0; i < preWatchers.length; i++) {
            preWatchers[i].run();
        }
    }
    // manually mounted instance, call mounted on self
    // mounted is called for render-created child components in its inserted hook
    if (vm.$vnode == null) {
        vm._isMounted = true;
        callHook$1(vm, 'mounted');
    }
    return vm;
}
function updateChildComponent(vm, propsData, listeners, parentVnode, renderChildren) {
    if (false) {
        isUpdatingChildComponent = true;
    }
    // determine whether component has slot children
    // we need to do this before overwriting $options._renderChildren.
    // check if there are dynamic scopedSlots (hand-written or compiled but with
    // dynamic slot names). Static scoped slots compiled from template has the
    // "$stable" marker.
    var newScopedSlots = parentVnode.data.scopedSlots;
    var oldScopedSlots = vm.$scopedSlots;
    var hasDynamicScopedSlot = !!((newScopedSlots && !newScopedSlots.$stable) ||
        (oldScopedSlots !== emptyObject && !oldScopedSlots.$stable) ||
        (newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key) ||
        (!newScopedSlots && vm.$scopedSlots.$key));
    // Any static slot children from the parent may have changed during parent's
    // update. Dynamic scoped slots may also have changed. In such cases, a forced
    // update is necessary to ensure correctness.
    var needsForceUpdate = !!(renderChildren || // has new static slots
        vm.$options._renderChildren || // has old static slots
        hasDynamicScopedSlot);
    var prevVNode = vm.$vnode;
    vm.$options._parentVnode = parentVnode;
    vm.$vnode = parentVnode; // update vm's placeholder node without re-render
    if (vm._vnode) {
        // update child tree's parent
        vm._vnode.parent = parentVnode;
    }
    vm.$options._renderChildren = renderChildren;
    // update $attrs and $listeners hash
    // these are also reactive so they may trigger child update if the child
    // used them during render
    var attrs = parentVnode.data.attrs || emptyObject;
    if (vm._attrsProxy) {
        // force update if attrs are accessed and has changed since it may be
        // passed to a child component.
        if (syncSetupProxy(vm._attrsProxy, attrs, (prevVNode.data && prevVNode.data.attrs) || emptyObject, vm, '$attrs')) {
            needsForceUpdate = true;
        }
    }
    vm.$attrs = attrs;
    // update listeners
    listeners = listeners || emptyObject;
    var prevListeners = vm.$options._parentListeners;
    if (vm._listenersProxy) {
        syncSetupProxy(vm._listenersProxy, listeners, prevListeners || emptyObject, vm, '$listeners');
    }
    vm.$listeners = vm.$options._parentListeners = listeners;
    updateComponentListeners(vm, listeners, prevListeners);
    // update props
    if (propsData && vm.$options.props) {
        toggleObserving(false);
        var props = vm._props;
        var propKeys = vm.$options._propKeys || [];
        for (var i = 0; i < propKeys.length; i++) {
            var key = propKeys[i];
            var propOptions = vm.$options.props; // wtf flow?
            props[key] = validateProp(key, propOptions, propsData, vm);
        }
        toggleObserving(true);
        // keep a copy of raw propsData
        vm.$options.propsData = propsData;
    }
    // resolve slots + force update if has children
    if (needsForceUpdate) {
        vm.$slots = resolveSlots(renderChildren, parentVnode.context);
        vm.$forceUpdate();
    }
    if (false) {
        isUpdatingChildComponent = false;
    }
}
function isInInactiveTree(vm) {
    while (vm && (vm = vm.$parent)) {
        if (vm._inactive)
            return true;
    }
    return false;
}
function activateChildComponent(vm, direct) {
    if (direct) {
        vm._directInactive = false;
        if (isInInactiveTree(vm)) {
            return;
        }
    }
    else if (vm._directInactive) {
        return;
    }
    if (vm._inactive || vm._inactive === null) {
        vm._inactive = false;
        for (var i = 0; i < vm.$children.length; i++) {
            activateChildComponent(vm.$children[i]);
        }
        callHook$1(vm, 'activated');
    }
}
function deactivateChildComponent(vm, direct) {
    if (direct) {
        vm._directInactive = true;
        if (isInInactiveTree(vm)) {
            return;
        }
    }
    if (!vm._inactive) {
        vm._inactive = true;
        for (var i = 0; i < vm.$children.length; i++) {
            deactivateChildComponent(vm.$children[i]);
        }
        callHook$1(vm, 'deactivated');
    }
}
function callHook$1(vm, hook, args, setContext) {
    if (setContext === void 0) { setContext = true; }
    // #7573 disable dep collection when invoking lifecycle hooks
    pushTarget();
    var prevInst = currentInstance;
    var prevScope = getCurrentScope();
    setContext && setCurrentInstance(vm);
    var handlers = vm.$options[hook];
    var info = "".concat(hook, " hook");
    if (handlers) {
        for (var i = 0, j = handlers.length; i < j; i++) {
            invokeWithErrorHandling(handlers[i], vm, args || null, vm, info);
        }
    }
    if (vm._hasHookEvent) {
        vm.$emit('hook:' + hook);
    }
    if (setContext) {
        setCurrentInstance(prevInst);
        prevScope && prevScope.on();
    }
    popTarget();
}

var MAX_UPDATE_COUNT = 100;
var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;
/**
 * Reset the scheduler's state.
 */
function resetSchedulerState() {
    index = queue.length = activatedChildren.length = 0;
    has = {};
    if (false) {
        circular = {};
    }
    waiting = flushing = false;
}
// Async edge case #6566 requires saving the timestamp when event listeners are
// attached. However, calling performance.now() has a perf overhead especially
// if the page has thousands of event listeners. Instead, we take a timestamp
// every time the scheduler flushes and use that for all event listeners
// attached during that flush.
var currentFlushTimestamp = 0;
// Async edge case fix requires storing an event listener's attach timestamp.
var getNow = Date.now;
// Determine what event timestamp the browser is using. Annoyingly, the
// timestamp can either be hi-res (relative to page load) or low-res
// (relative to UNIX epoch), so in order to compare time we have to use the
// same timestamp type when saving the flush timestamp.
// All IE versions use low-res event timestamps, and have problematic clock
// implementations (#9632)
if (inBrowser && !isIE) {
    var performance_1 = window.performance;
    if (performance_1 &&
        typeof performance_1.now === 'function' &&
        getNow() > document.createEvent('Event').timeStamp) {
        // if the event timestamp, although evaluated AFTER the Date.now(), is
        // smaller than it, it means the event is using a hi-res timestamp,
        // and we need to use the hi-res version for event listener timestamps as
        // well.
        getNow = function () { return performance_1.now(); };
    }
}
var sortCompareFn = function (a, b) {
    if (a.post) {
        if (!b.post)
            return 1;
    }
    else if (b.post) {
        return -1;
    }
    return a.id - b.id;
};
/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue() {
    currentFlushTimestamp = getNow();
    flushing = true;
    var watcher, id;
    // Sort queue before flush.
    // This ensures that:
    // 1. Components are updated from parent to child. (because parent is always
    //    created before the child)
    // 2. A component's user watchers are run before its render watcher (because
    //    user watchers are created before the render watcher)
    // 3. If a component is destroyed during a parent component's watcher run,
    //    its watchers can be skipped.
    queue.sort(sortCompareFn);
    // do not cache length because more watchers might be pushed
    // as we run existing watchers
    for (index = 0; index < queue.length; index++) {
        watcher = queue[index];
        if (watcher.before) {
            watcher.before();
        }
        id = watcher.id;
        has[id] = null;
        watcher.run();
        // in dev build, check and stop circular updates.
        if (false) {
            circular[id] = (circular[id] || 0) + 1;
            if (circular[id] > MAX_UPDATE_COUNT) {
                warn('You may have an infinite update loop ' +
                    (watcher.user
                        ? "in watcher with expression \"".concat(watcher.expression, "\"")
                        : "in a component render function."), watcher.vm);
                break;
            }
        }
    }
    // keep copies of post queues before resetting state
    var activatedQueue = activatedChildren.slice();
    var updatedQueue = queue.slice();
    resetSchedulerState();
    // call component updated and activated hooks
    callActivatedHooks(activatedQueue);
    callUpdatedHooks(updatedQueue);
    cleanupDeps();
    // devtool hook
    /* istanbul ignore if */
    if (devtools && config.devtools) {
        devtools.emit('flush');
    }
}
function callUpdatedHooks(queue) {
    var i = queue.length;
    while (i--) {
        var watcher = queue[i];
        var vm = watcher.vm;
        if (vm && vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
            callHook$1(vm, 'updated');
        }
    }
}
/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent(vm) {
    // setting _inactive to false here so that a render function can
    // rely on checking whether it's in an inactive tree (e.g. router-view)
    vm._inactive = false;
    activatedChildren.push(vm);
}
function callActivatedHooks(queue) {
    for (var i = 0; i < queue.length; i++) {
        queue[i]._inactive = true;
        activateChildComponent(queue[i], true /* true */);
    }
}
/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher(watcher) {
    var id = watcher.id;
    if (has[id] != null) {
        return;
    }
    if (watcher === Dep.target && watcher.noRecurse) {
        return;
    }
    has[id] = true;
    if (!flushing) {
        queue.push(watcher);
    }
    else {
        // if already flushing, splice the watcher based on its id
        // if already past its id, it will be run next immediately.
        var i = queue.length - 1;
        while (i > index && queue[i].id > watcher.id) {
            i--;
        }
        queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
        waiting = true;
        if (false) {
            flushSchedulerQueue();
            return;
        }
        nextTick(flushSchedulerQueue);
    }
}

function initProvide(vm) {
    var provideOption = vm.$options.provide;
    if (provideOption) {
        var provided = isFunction(provideOption)
            ? provideOption.call(vm)
            : provideOption;
        if (!isObject(provided)) {
            return;
        }
        var source = resolveProvided(vm);
        // IE9 doesn't support Object.getOwnPropertyDescriptors so we have to
        // iterate the keys ourselves.
        var keys = hasSymbol ? Reflect.ownKeys(provided) : Object.keys(provided);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            Object.defineProperty(source, key, Object.getOwnPropertyDescriptor(provided, key));
        }
    }
}
function initInjections(vm) {
    var result = resolveInject(vm.$options.inject, vm);
    if (result) {
        toggleObserving(false);
        Object.keys(result).forEach(function (key) {
            /* istanbul ignore else */
            if (false) {
                defineReactive(vm, key, result[key], function () {
                    warn("Avoid mutating an injected value directly since the changes will be " +
                        "overwritten whenever the provided component re-renders. " +
                        "injection being mutated: \"".concat(key, "\""), vm);
                });
            }
            else {
                defineReactive(vm, key, result[key]);
            }
        });
        toggleObserving(true);
    }
}
function resolveInject(inject, vm) {
    if (inject) {
        // inject is :any because flow is not smart enough to figure out cached
        var result = Object.create(null);
        var keys = hasSymbol ? Reflect.ownKeys(inject) : Object.keys(inject);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            // #6574 in case the inject object is observed...
            if (key === '__ob__')
                continue;
            var provideKey = inject[key].from;
            if (provideKey in vm._provided) {
                result[key] = vm._provided[provideKey];
            }
            else if ('default' in inject[key]) {
                var provideDefault = inject[key].default;
                result[key] = isFunction(provideDefault)
                    ? provideDefault.call(vm)
                    : provideDefault;
            }
            else if (false) {
                warn("Injection \"".concat(key, "\" not found"), vm);
            }
        }
        return result;
    }
}

function FunctionalRenderContext(data, props, children, parent, Ctor) {
    var _this = this;
    var options = Ctor.options;
    // ensure the createElement function in functional components
    // gets a unique context - this is necessary for correct named slot check
    var contextVm;
    if (hasOwn(parent, '_uid')) {
        contextVm = Object.create(parent);
        contextVm._original = parent;
    }
    else {
        // the context vm passed in is a functional context as well.
        // in this case we want to make sure we are able to get a hold to the
        // real context instance.
        contextVm = parent;
        // @ts-ignore
        parent = parent._original;
    }
    var isCompiled = isTrue(options._compiled);
    var needNormalization = !isCompiled;
    this.data = data;
    this.props = props;
    this.children = children;
    this.parent = parent;
    this.listeners = data.on || emptyObject;
    this.injections = resolveInject(options.inject, parent);
    this.slots = function () {
        if (!_this.$slots) {
            normalizeScopedSlots(parent, data.scopedSlots, (_this.$slots = resolveSlots(children, parent)));
        }
        return _this.$slots;
    };
    Object.defineProperty(this, 'scopedSlots', {
        enumerable: true,
        get: function () {
            return normalizeScopedSlots(parent, data.scopedSlots, this.slots());
        }
    });
    // support for compiled functional template
    if (isCompiled) {
        // exposing $options for renderStatic()
        this.$options = options;
        // pre-resolve slots for renderSlot()
        this.$slots = this.slots();
        this.$scopedSlots = normalizeScopedSlots(parent, data.scopedSlots, this.$slots);
    }
    if (options._scopeId) {
        this._c = function (a, b, c, d) {
            var vnode = createElement$1(contextVm, a, b, c, d, needNormalization);
            if (vnode && !isArray(vnode)) {
                vnode.fnScopeId = options._scopeId;
                vnode.fnContext = parent;
            }
            return vnode;
        };
    }
    else {
        this._c = function (a, b, c, d) {
            return createElement$1(contextVm, a, b, c, d, needNormalization);
        };
    }
}
installRenderHelpers(FunctionalRenderContext.prototype);
function createFunctionalComponent(Ctor, propsData, data, contextVm, children) {
    var options = Ctor.options;
    var props = {};
    var propOptions = options.props;
    if (isDef(propOptions)) {
        for (var key in propOptions) {
            props[key] = validateProp(key, propOptions, propsData || emptyObject);
        }
    }
    else {
        if (isDef(data.attrs))
            mergeProps(props, data.attrs);
        if (isDef(data.props))
            mergeProps(props, data.props);
    }
    var renderContext = new FunctionalRenderContext(data, props, children, contextVm, Ctor);
    var vnode = options.render.call(null, renderContext._c, renderContext);
    if (vnode instanceof VNode) {
        return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options, renderContext);
    }
    else if (isArray(vnode)) {
        var vnodes = normalizeChildren(vnode) || [];
        var res = new Array(vnodes.length);
        for (var i = 0; i < vnodes.length; i++) {
            res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options, renderContext);
        }
        return res;
    }
}
function cloneAndMarkFunctionalResult(vnode, data, contextVm, options, renderContext) {
    // #7817 clone node before setting fnContext, otherwise if the node is reused
    // (e.g. it was from a cached normal slot) the fnContext causes named slots
    // that should not be matched to match.
    var clone = cloneVNode(vnode);
    clone.fnContext = contextVm;
    clone.fnOptions = options;
    if (false) {
        (clone.devtoolsMeta = clone.devtoolsMeta || {}).renderContext =
            renderContext;
    }
    if (data.slot) {
        (clone.data || (clone.data = {})).slot = data.slot;
    }
    return clone;
}
function mergeProps(to, from) {
    for (var key in from) {
        to[camelize(key)] = from[key];
    }
}

function getComponentName(options) {
    return options.name || options.__name || options._componentTag;
}
// inline hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
    init: function (vnode, hydrating) {
        if (vnode.componentInstance &&
            !vnode.componentInstance._isDestroyed &&
            vnode.data.keepAlive) {
            // kept-alive components, treat as a patch
            var mountedNode = vnode; // work around flow
            componentVNodeHooks.prepatch(mountedNode, mountedNode);
        }
        else {
            var child = (vnode.componentInstance = createComponentInstanceForVnode(vnode, activeInstance));
            child.$mount(hydrating ? vnode.elm : undefined, hydrating);
        }
    },
    prepatch: function (oldVnode, vnode) {
        var options = vnode.componentOptions;
        var child = (vnode.componentInstance = oldVnode.componentInstance);
        updateChildComponent(child, options.propsData, // updated props
        options.listeners, // updated listeners
        vnode, // new parent vnode
        options.children // new children
        );
    },
    insert: function (vnode) {
        var context = vnode.context, componentInstance = vnode.componentInstance;
        if (!componentInstance._isMounted) {
            componentInstance._isMounted = true;
            callHook$1(componentInstance, 'mounted');
        }
        if (vnode.data.keepAlive) {
            if (context._isMounted) {
                // vue-router#1212
                // During updates, a kept-alive component's child components may
                // change, so directly walking the tree here may call activated hooks
                // on incorrect children. Instead we push them into a queue which will
                // be processed after the whole patch process ended.
                queueActivatedComponent(componentInstance);
            }
            else {
                activateChildComponent(componentInstance, true /* direct */);
            }
        }
    },
    destroy: function (vnode) {
        var componentInstance = vnode.componentInstance;
        if (!componentInstance._isDestroyed) {
            if (!vnode.data.keepAlive) {
                componentInstance.$destroy();
            }
            else {
                deactivateChildComponent(componentInstance, true /* direct */);
            }
        }
    }
};
var hooksToMerge = Object.keys(componentVNodeHooks);
function createComponent(Ctor, data, context, children, tag) {
    if (isUndef(Ctor)) {
        return;
    }
    var baseCtor = context.$options._base;
    // plain options object: turn it into a constructor
    if (isObject(Ctor)) {
        Ctor = baseCtor.extend(Ctor);
    }
    // if at this stage it's not a constructor or an async component factory,
    // reject.
    if (typeof Ctor !== 'function') {
        if (false) {
            warn("Invalid Component definition: ".concat(String(Ctor)), context);
        }
        return;
    }
    // async component
    var asyncFactory;
    // @ts-expect-error
    if (isUndef(Ctor.cid)) {
        asyncFactory = Ctor;
        Ctor = resolveAsyncComponent(asyncFactory, baseCtor);
        if (Ctor === undefined) {
            // return a placeholder node for async component, which is rendered
            // as a comment node but preserves all the raw information for the node.
            // the information will be used for async server-rendering and hydration.
            return createAsyncPlaceholder(asyncFactory, data, context, children, tag);
        }
    }
    data = data || {};
    // resolve constructor options in case global mixins are applied after
    // component constructor creation
    resolveConstructorOptions(Ctor);
    // transform component v-model data into props & events
    if (isDef(data.model)) {
        // @ts-expect-error
        transformModel(Ctor.options, data);
    }
    // extract props
    // @ts-expect-error
    var propsData = extractPropsFromVNodeData(data, Ctor, tag);
    // functional component
    // @ts-expect-error
    if (isTrue(Ctor.options.functional)) {
        return createFunctionalComponent(Ctor, propsData, data, context, children);
    }
    // extract listeners, since these needs to be treated as
    // child component listeners instead of DOM listeners
    var listeners = data.on;
    // replace with listeners with .native modifier
    // so it gets processed during parent component patch.
    data.on = data.nativeOn;
    // @ts-expect-error
    if (isTrue(Ctor.options.abstract)) {
        // abstract components do not keep anything
        // other than props & listeners & slot
        // work around flow
        var slot = data.slot;
        data = {};
        if (slot) {
            data.slot = slot;
        }
    }
    // install component management hooks onto the placeholder node
    installComponentHooks(data);
    // return a placeholder vnode
    // @ts-expect-error
    var name = getComponentName(Ctor.options) || tag;
    var vnode = new VNode(
    // @ts-expect-error
    "vue-component-".concat(Ctor.cid).concat(name ? "-".concat(name) : ''), data, undefined, undefined, undefined, context, 
    // @ts-expect-error
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children }, asyncFactory);
    return vnode;
}
function createComponentInstanceForVnode(
// we know it's MountedComponentVNode but flow doesn't
vnode, 
// activeInstance in lifecycle state
parent) {
    var options = {
        _isComponent: true,
        _parentVnode: vnode,
        parent: parent
    };
    // check inline-template render functions
    var inlineTemplate = vnode.data.inlineTemplate;
    if (isDef(inlineTemplate)) {
        options.render = inlineTemplate.render;
        options.staticRenderFns = inlineTemplate.staticRenderFns;
    }
    return new vnode.componentOptions.Ctor(options);
}
function installComponentHooks(data) {
    var hooks = data.hook || (data.hook = {});
    for (var i = 0; i < hooksToMerge.length; i++) {
        var key = hooksToMerge[i];
        var existing = hooks[key];
        var toMerge = componentVNodeHooks[key];
        // @ts-expect-error
        if (existing !== toMerge && !(existing && existing._merged)) {
            hooks[key] = existing ? mergeHook(toMerge, existing) : toMerge;
        }
    }
}
function mergeHook(f1, f2) {
    var merged = function (a, b) {
        // flow complains about extra args which is why we use any
        f1(a, b);
        f2(a, b);
    };
    merged._merged = true;
    return merged;
}
// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel(options, data) {
    var prop = (options.model && options.model.prop) || 'value';
    var event = (options.model && options.model.event) || 'input';
    (data.attrs || (data.attrs = {}))[prop] = data.model.value;
    var on = data.on || (data.on = {});
    var existing = on[event];
    var callback = data.model.callback;
    if (isDef(existing)) {
        if (isArray(existing)
            ? existing.indexOf(callback) === -1
            : existing !== callback) {
            on[event] = [callback].concat(existing);
        }
    }
    else {
        on[event] = callback;
    }
}

var warn = noop;
var tip = noop;
var generateComponentTrace; // work around flow check
var formatComponentName;
if (false) {
    var hasConsole_1 = typeof console !== 'undefined';
    var classifyRE_1 = /(?:^|[-_])(\w)/g;
    var classify_1 = function (str) {
        return str.replace(classifyRE_1, function (c) { return c.toUpperCase(); }).replace(/[-_]/g, '');
    };
    warn = function (msg, vm) {
        if (vm === void 0) { vm = currentInstance; }
        var trace = vm ? generateComponentTrace(vm) : '';
        if (config.warnHandler) {
            config.warnHandler.call(null, msg, vm, trace);
        }
        else if (hasConsole_1 && !config.silent) {
            console.error("[Vue warn]: ".concat(msg).concat(trace));
        }
    };
    tip = function (msg, vm) {
        if (hasConsole_1 && !config.silent) {
            console.warn("[Vue tip]: ".concat(msg) + (vm ? generateComponentTrace(vm) : ''));
        }
    };
    formatComponentName = function (vm, includeFile) {
        if (vm.$root === vm) {
            return '<Root>';
        }
        var options = isFunction(vm) && vm.cid != null
            ? vm.options
            : vm._isVue
                ? vm.$options || vm.constructor.options
                : vm;
        var name = getComponentName(options);
        var file = options.__file;
        if (!name && file) {
            var match = file.match(/([^/\\]+)\.vue$/);
            name = match && match[1];
        }
        return ((name ? "<".concat(classify_1(name), ">") : "<Anonymous>") +
            (file && includeFile !== false ? " at ".concat(file) : ''));
    };
    var repeat_1 = function (str, n) {
        var res = '';
        while (n) {
            if (n % 2 === 1)
                res += str;
            if (n > 1)
                str += str;
            n >>= 1;
        }
        return res;
    };
    generateComponentTrace = function (vm) {
        if (vm._isVue && vm.$parent) {
            var tree = [];
            var currentRecursiveSequence = 0;
            while (vm) {
                if (tree.length > 0) {
                    var last = tree[tree.length - 1];
                    if (last.constructor === vm.constructor) {
                        currentRecursiveSequence++;
                        vm = vm.$parent;
                        continue;
                    }
                    else if (currentRecursiveSequence > 0) {
                        tree[tree.length - 1] = [last, currentRecursiveSequence];
                        currentRecursiveSequence = 0;
                    }
                }
                tree.push(vm);
                vm = vm.$parent;
            }
            return ('\n\nfound in\n\n' +
                tree
                    .map(function (vm, i) {
                    return "".concat(i === 0 ? '---> ' : repeat_1(' ', 5 + i * 2)).concat(isArray(vm)
                        ? "".concat(formatComponentName(vm[0]), "... (").concat(vm[1], " recursive calls)")
                        : formatComponentName(vm));
                })
                    .join('\n'));
        }
        else {
            return "\n\n(found in ".concat(formatComponentName(vm), ")");
        }
    };
}

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;
/**
 * Options with restrictions
 */
if (false) {
    strats.el = strats.propsData = function (parent, child, vm, key) {
        if (!vm) {
            warn("option \"".concat(key, "\" can only be used during instance ") +
                'creation with the `new` keyword.');
        }
        return defaultStrat(parent, child);
    };
}
/**
 * Helper that recursively merges two data objects together.
 */
function mergeData(to, from, recursive) {
    if (recursive === void 0) { recursive = true; }
    if (!from)
        return to;
    var key, toVal, fromVal;
    var keys = hasSymbol
        ? Reflect.ownKeys(from)
        : Object.keys(from);
    for (var i = 0; i < keys.length; i++) {
        key = keys[i];
        // in case the object is already observed...
        if (key === '__ob__')
            continue;
        toVal = to[key];
        fromVal = from[key];
        if (!recursive || !hasOwn(to, key)) {
            set(to, key, fromVal);
        }
        else if (toVal !== fromVal &&
            isPlainObject(toVal) &&
            isPlainObject(fromVal)) {
            mergeData(toVal, fromVal);
        }
    }
    return to;
}
/**
 * Data
 */
function mergeDataOrFn(parentVal, childVal, vm) {
    if (!vm) {
        // in a Vue.extend merge, both should be functions
        if (!childVal) {
            return parentVal;
        }
        if (!parentVal) {
            return childVal;
        }
        // when parentVal & childVal are both present,
        // we need to return a function that returns the
        // merged result of both functions... no need to
        // check if parentVal is a function here because
        // it has to be a function to pass previous merges.
        return function mergedDataFn() {
            return mergeData(isFunction(childVal) ? childVal.call(this, this) : childVal, isFunction(parentVal) ? parentVal.call(this, this) : parentVal);
        };
    }
    else {
        return function mergedInstanceDataFn() {
            // instance merge
            var instanceData = isFunction(childVal)
                ? childVal.call(vm, vm)
                : childVal;
            var defaultData = isFunction(parentVal)
                ? parentVal.call(vm, vm)
                : parentVal;
            if (instanceData) {
                return mergeData(instanceData, defaultData);
            }
            else {
                return defaultData;
            }
        };
    }
}
strats.data = function (parentVal, childVal, vm) {
    if (!vm) {
        if (childVal && typeof childVal !== 'function') {
            "production" !== 'production' &&
                warn('The "data" option should be a function ' +
                    'that returns a per-instance value in component ' +
                    'definitions.', vm);
            return parentVal;
        }
        return mergeDataOrFn(parentVal, childVal);
    }
    return mergeDataOrFn(parentVal, childVal, vm);
};
/**
 * Hooks and props are merged as arrays.
 */
function mergeLifecycleHook(parentVal, childVal) {
    var res = childVal
        ? parentVal
            ? parentVal.concat(childVal)
            : isArray(childVal)
                ? childVal
                : [childVal]
        : parentVal;
    return res ? dedupeHooks(res) : res;
}
function dedupeHooks(hooks) {
    var res = [];
    for (var i = 0; i < hooks.length; i++) {
        if (res.indexOf(hooks[i]) === -1) {
            res.push(hooks[i]);
        }
    }
    return res;
}
LIFECYCLE_HOOKS.forEach(function (hook) {
    strats[hook] = mergeLifecycleHook;
});
/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets(parentVal, childVal, vm, key) {
    var res = Object.create(parentVal || null);
    if (childVal) {
        "production" !== 'production' && assertObjectType(key, childVal, vm);
        return extend(res, childVal);
    }
    else {
        return res;
    }
}
ASSET_TYPES.forEach(function (type) {
    strats[type + 's'] = mergeAssets;
});
/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (parentVal, childVal, vm, key) {
    // work around Firefox's Object.prototype.watch...
    //@ts-expect-error work around
    if (parentVal === nativeWatch)
        parentVal = undefined;
    //@ts-expect-error work around
    if (childVal === nativeWatch)
        childVal = undefined;
    /* istanbul ignore if */
    if (!childVal)
        return Object.create(parentVal || null);
    if (false) {
        assertObjectType(key, childVal, vm);
    }
    if (!parentVal)
        return childVal;
    var ret = {};
    extend(ret, parentVal);
    for (var key_1 in childVal) {
        var parent_1 = ret[key_1];
        var child = childVal[key_1];
        if (parent_1 && !isArray(parent_1)) {
            parent_1 = [parent_1];
        }
        ret[key_1] = parent_1 ? parent_1.concat(child) : isArray(child) ? child : [child];
    }
    return ret;
};
/**
 * Other object hashes.
 */
strats.props =
    strats.methods =
        strats.inject =
            strats.computed =
                function (parentVal, childVal, vm, key) {
                    if (childVal && "production" !== 'production') {
                        assertObjectType(key, childVal, vm);
                    }
                    if (!parentVal)
                        return childVal;
                    var ret = Object.create(null);
                    extend(ret, parentVal);
                    if (childVal)
                        extend(ret, childVal);
                    return ret;
                };
strats.provide = function (parentVal, childVal) {
    if (!parentVal)
        return childVal;
    return function () {
        var ret = Object.create(null);
        mergeData(ret, isFunction(parentVal) ? parentVal.call(this) : parentVal);
        if (childVal) {
            mergeData(ret, isFunction(childVal) ? childVal.call(this) : childVal, false // non-recursive
            );
        }
        return ret;
    };
};
/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
    return childVal === undefined ? parentVal : childVal;
};
/**
 * Validate component names
 */
function checkComponents(options) {
    for (var key in options.components) {
        validateComponentName(key);
    }
}
function validateComponentName(name) {
    if (!new RegExp("^[a-zA-Z][\\-\\.0-9_".concat(unicodeRegExp.source, "]*$")).test(name)) {
        warn('Invalid component name: "' +
            name +
            '". Component names ' +
            'should conform to valid custom element name in html5 specification.');
    }
    if (isBuiltInTag(name) || config.isReservedTag(name)) {
        warn('Do not use built-in or reserved HTML elements as component ' +
            'id: ' +
            name);
    }
}
/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps(options, vm) {
    var props = options.props;
    if (!props)
        return;
    var res = {};
    var i, val, name;
    if (isArray(props)) {
        i = props.length;
        while (i--) {
            val = props[i];
            if (typeof val === 'string') {
                name = camelize(val);
                res[name] = { type: null };
            }
            else if (false) {
                warn('props must be strings when using array syntax.');
            }
        }
    }
    else if (isPlainObject(props)) {
        for (var key in props) {
            val = props[key];
            name = camelize(key);
            res[name] = isPlainObject(val) ? val : { type: val };
        }
    }
    else if (false) {
        warn("Invalid value for option \"props\": expected an Array or an Object, " +
            "but got ".concat(toRawType(props), "."), vm);
    }
    options.props = res;
}
/**
 * Normalize all injections into Object-based format
 */
function normalizeInject(options, vm) {
    var inject = options.inject;
    if (!inject)
        return;
    var normalized = (options.inject = {});
    if (isArray(inject)) {
        for (var i = 0; i < inject.length; i++) {
            normalized[inject[i]] = { from: inject[i] };
        }
    }
    else if (isPlainObject(inject)) {
        for (var key in inject) {
            var val = inject[key];
            normalized[key] = isPlainObject(val)
                ? extend({ from: key }, val)
                : { from: val };
        }
    }
    else if (false) {
        warn("Invalid value for option \"inject\": expected an Array or an Object, " +
            "but got ".concat(toRawType(inject), "."), vm);
    }
}
/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives$1(options) {
    var dirs = options.directives;
    if (dirs) {
        for (var key in dirs) {
            var def = dirs[key];
            if (isFunction(def)) {
                dirs[key] = { bind: def, update: def };
            }
        }
    }
}
function assertObjectType(name, value, vm) {
    if (!isPlainObject(value)) {
        warn("Invalid value for option \"".concat(name, "\": expected an Object, ") +
            "but got ".concat(toRawType(value), "."), vm);
    }
}
/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions(parent, child, vm) {
    if (false) {
        checkComponents(child);
    }
    if (isFunction(child)) {
        // @ts-expect-error
        child = child.options;
    }
    normalizeProps(child, vm);
    normalizeInject(child, vm);
    normalizeDirectives$1(child);
    // Apply extends and mixins on the child options,
    // but only if it is a raw options object that isn't
    // the result of another mergeOptions call.
    // Only merged options has the _base property.
    if (!child._base) {
        if (child.extends) {
            parent = mergeOptions(parent, child.extends, vm);
        }
        if (child.mixins) {
            for (var i = 0, l = child.mixins.length; i < l; i++) {
                parent = mergeOptions(parent, child.mixins[i], vm);
            }
        }
    }
    var options = {};
    var key;
    for (key in parent) {
        mergeField(key);
    }
    for (key in child) {
        if (!hasOwn(parent, key)) {
            mergeField(key);
        }
    }
    function mergeField(key) {
        var strat = strats[key] || defaultStrat;
        options[key] = strat(parent[key], child[key], vm, key);
    }
    return options;
}
/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset(options, type, id, warnMissing) {
    /* istanbul ignore if */
    if (typeof id !== 'string') {
        return;
    }
    var assets = options[type];
    // check local registration variations first
    if (hasOwn(assets, id))
        return assets[id];
    var camelizedId = camelize(id);
    if (hasOwn(assets, camelizedId))
        return assets[camelizedId];
    var PascalCaseId = capitalize(camelizedId);
    if (hasOwn(assets, PascalCaseId))
        return assets[PascalCaseId];
    // fallback to prototype chain
    var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
    if (false) {
        warn('Failed to resolve ' + type.slice(0, -1) + ': ' + id);
    }
    return res;
}

function validateProp(key, propOptions, propsData, vm) {
    var prop = propOptions[key];
    var absent = !hasOwn(propsData, key);
    var value = propsData[key];
    // boolean casting
    var booleanIndex = getTypeIndex(Boolean, prop.type);
    if (booleanIndex > -1) {
        if (absent && !hasOwn(prop, 'default')) {
            value = false;
        }
        else if (value === '' || value === hyphenate(key)) {
            // only cast empty string / same name to boolean if
            // boolean has higher priority
            var stringIndex = getTypeIndex(String, prop.type);
            if (stringIndex < 0 || booleanIndex < stringIndex) {
                value = true;
            }
        }
    }
    // check default value
    if (value === undefined) {
        value = getPropDefaultValue(vm, prop, key);
        // since the default value is a fresh copy,
        // make sure to observe it.
        var prevShouldObserve = shouldObserve;
        toggleObserving(true);
        observe(value);
        toggleObserving(prevShouldObserve);
    }
    if (false) {
        assertProp(prop, key, value, vm, absent);
    }
    return value;
}
/**
 * Get the default value of a prop.
 */
function getPropDefaultValue(vm, prop, key) {
    // no default, return undefined
    if (!hasOwn(prop, 'default')) {
        return undefined;
    }
    var def = prop.default;
    // warn against non-factory defaults for Object & Array
    if (false) {
        warn('Invalid default value for prop "' +
            key +
            '": ' +
            'Props with type Object/Array must use a factory function ' +
            'to return the default value.', vm);
    }
    // the raw prop value was also undefined from previous render,
    // return previous default value to avoid unnecessary watcher trigger
    if (vm &&
        vm.$options.propsData &&
        vm.$options.propsData[key] === undefined &&
        vm._props[key] !== undefined) {
        return vm._props[key];
    }
    // call factory function for non-Function types
    // a value is Function if its prototype is function even across different execution context
    return isFunction(def) && getType(prop.type) !== 'Function'
        ? def.call(vm)
        : def;
}
/**
 * Assert whether a prop is valid.
 */
function assertProp(prop, name, value, vm, absent) {
    if (prop.required && absent) {
        warn('Missing required prop: "' + name + '"', vm);
        return;
    }
    if (value == null && !prop.required) {
        return;
    }
    var type = prop.type;
    var valid = !type || type === true;
    var expectedTypes = [];
    if (type) {
        if (!isArray(type)) {
            type = [type];
        }
        for (var i = 0; i < type.length && !valid; i++) {
            var assertedType = assertType(value, type[i], vm);
            expectedTypes.push(assertedType.expectedType || '');
            valid = assertedType.valid;
        }
    }
    var haveExpectedTypes = expectedTypes.some(function (t) { return t; });
    if (!valid && haveExpectedTypes) {
        warn(getInvalidTypeMessage(name, value, expectedTypes), vm);
        return;
    }
    var validator = prop.validator;
    if (validator) {
        if (!validator(value)) {
            warn('Invalid prop: custom validator check failed for prop "' + name + '".', vm);
        }
    }
}
var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol|BigInt)$/;
function assertType(value, type, vm) {
    var valid;
    var expectedType = getType(type);
    if (simpleCheckRE.test(expectedType)) {
        var t = typeof value;
        valid = t === expectedType.toLowerCase();
        // for primitive wrapper objects
        if (!valid && t === 'object') {
            valid = value instanceof type;
        }
    }
    else if (expectedType === 'Object') {
        valid = isPlainObject(value);
    }
    else if (expectedType === 'Array') {
        valid = isArray(value);
    }
    else {
        try {
            valid = value instanceof type;
        }
        catch (e) {
            warn('Invalid prop type: "' + String(type) + '" is not a constructor', vm);
            valid = false;
        }
    }
    return {
        valid: valid,
        expectedType: expectedType
    };
}
var functionTypeCheckRE = /^\s*function (\w+)/;
/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType(fn) {
    var match = fn && fn.toString().match(functionTypeCheckRE);
    return match ? match[1] : '';
}
function isSameType(a, b) {
    return getType(a) === getType(b);
}
function getTypeIndex(type, expectedTypes) {
    if (!isArray(expectedTypes)) {
        return isSameType(expectedTypes, type) ? 0 : -1;
    }
    for (var i = 0, len = expectedTypes.length; i < len; i++) {
        if (isSameType(expectedTypes[i], type)) {
            return i;
        }
    }
    return -1;
}
function getInvalidTypeMessage(name, value, expectedTypes) {
    var message = "Invalid prop: type check failed for prop \"".concat(name, "\".") +
        " Expected ".concat(expectedTypes.map(capitalize).join(', '));
    var expectedType = expectedTypes[0];
    var receivedType = toRawType(value);
    // check if we need to specify expected value
    if (expectedTypes.length === 1 &&
        isExplicable(expectedType) &&
        isExplicable(typeof value) &&
        !isBoolean(expectedType, receivedType)) {
        message += " with value ".concat(styleValue(value, expectedType));
    }
    message += ", got ".concat(receivedType, " ");
    // check if we need to specify received value
    if (isExplicable(receivedType)) {
        message += "with value ".concat(styleValue(value, receivedType), ".");
    }
    return message;
}
function styleValue(value, type) {
    if (type === 'String') {
        return "\"".concat(value, "\"");
    }
    else if (type === 'Number') {
        return "".concat(Number(value));
    }
    else {
        return "".concat(value);
    }
}
var EXPLICABLE_TYPES = ['string', 'number', 'boolean'];
function isExplicable(value) {
    return EXPLICABLE_TYPES.some(function (elem) { return value.toLowerCase() === elem; });
}
function isBoolean() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return args.some(function (elem) { return elem.toLowerCase() === 'boolean'; });
}

/* not type checking this file because flow doesn't play well with Proxy */
var initProxy;
if (false) {
    var allowedGlobals_1 = makeMap('Infinity,undefined,NaN,isFinite,isNaN,' +
        'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
        'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt,' +
        'require' // for Webpack/Browserify
    );
    var warnNonPresent_1 = function (target, key) {
        warn("Property or method \"".concat(key, "\" is not defined on the instance but ") +
            'referenced during render. Make sure that this property is reactive, ' +
            'either in the data option, or for class-based components, by ' +
            'initializing the property. ' +
            'See: https://v2.vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.', target);
    };
    var warnReservedPrefix_1 = function (target, key) {
        warn("Property \"".concat(key, "\" must be accessed with \"$data.").concat(key, "\" because ") +
            'properties starting with "$" or "_" are not proxied in the Vue instance to ' +
            'prevent conflicts with Vue internals. ' +
            'See: https://v2.vuejs.org/v2/api/#data', target);
    };
    var hasProxy_1 = typeof Proxy !== 'undefined' && isNative(Proxy);
    if (hasProxy_1) {
        var isBuiltInModifier_1 = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
        config.keyCodes = new Proxy(config.keyCodes, {
            set: function (target, key, value) {
                if (isBuiltInModifier_1(key)) {
                    warn("Avoid overwriting built-in modifier in config.keyCodes: .".concat(key));
                    return false;
                }
                else {
                    target[key] = value;
                    return true;
                }
            }
        });
    }
    var hasHandler_1 = {
        has: function (target, key) {
            var has = key in target;
            var isAllowed = allowedGlobals_1(key) ||
                (typeof key === 'string' &&
                    key.charAt(0) === '_' &&
                    !(key in target.$data));
            if (!has && !isAllowed) {
                if (key in target.$data)
                    warnReservedPrefix_1(target, key);
                else
                    warnNonPresent_1(target, key);
            }
            return has || !isAllowed;
        }
    };
    var getHandler_1 = {
        get: function (target, key) {
            if (typeof key === 'string' && !(key in target)) {
                if (key in target.$data)
                    warnReservedPrefix_1(target, key);
                else
                    warnNonPresent_1(target, key);
            }
            return target[key];
        }
    };
    initProxy = function initProxy(vm) {
        if (hasProxy_1) {
            // determine which proxy handler to use
            var options = vm.$options;
            var handlers = options.render && options.render._withStripped ? getHandler_1 : hasHandler_1;
            vm._renderProxy = new Proxy(vm, handlers);
        }
        else {
            vm._renderProxy = vm;
        }
    };
}

var sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop
};
function proxy(target, sourceKey, key) {
    sharedPropertyDefinition.get = function proxyGetter() {
        return this[sourceKey][key];
    };
    sharedPropertyDefinition.set = function proxySetter(val) {
        this[sourceKey][key] = val;
    };
    Object.defineProperty(target, key, sharedPropertyDefinition);
}
function initState(vm) {
    var opts = vm.$options;
    if (opts.props)
        initProps$1(vm, opts.props);
    // Composition API
    initSetup(vm);
    if (opts.methods)
        initMethods(vm, opts.methods);
    if (opts.data) {
        initData(vm);
    }
    else {
        var ob = observe((vm._data = {}));
        ob && ob.vmCount++;
    }
    if (opts.computed)
        initComputed$1(vm, opts.computed);
    if (opts.watch && opts.watch !== nativeWatch) {
        initWatch(vm, opts.watch);
    }
}
function initProps$1(vm, propsOptions) {
    var propsData = vm.$options.propsData || {};
    var props = (vm._props = shallowReactive({}));
    // cache prop keys so that future props updates can iterate using Array
    // instead of dynamic object key enumeration.
    var keys = (vm.$options._propKeys = []);
    var isRoot = !vm.$parent;
    // root instance props should be converted
    if (!isRoot) {
        toggleObserving(false);
    }
    var _loop_1 = function (key) {
        keys.push(key);
        var value = validateProp(key, propsOptions, propsData, vm);
        /* istanbul ignore else */
        if (false) {
            var hyphenatedKey = hyphenate(key);
            if (isReservedAttribute(hyphenatedKey) ||
                config.isReservedAttr(hyphenatedKey)) {
                warn("\"".concat(hyphenatedKey, "\" is a reserved attribute and cannot be used as component prop."), vm);
            }
            defineReactive(props, key, value, function () {
                if (!isRoot && !isUpdatingChildComponent) {
                    warn("Avoid mutating a prop directly since the value will be " +
                        "overwritten whenever the parent component re-renders. " +
                        "Instead, use a data or computed property based on the prop's " +
                        "value. Prop being mutated: \"".concat(key, "\""), vm);
                }
            }, true /* shallow */);
        }
        else {
            defineReactive(props, key, value, undefined, true /* shallow */);
        }
        // static props are already proxied on the component's prototype
        // during Vue.extend(). We only need to proxy props defined at
        // instantiation here.
        if (!(key in vm)) {
            proxy(vm, "_props", key);
        }
    };
    for (var key in propsOptions) {
        _loop_1(key);
    }
    toggleObserving(true);
}
function initData(vm) {
    var data = vm.$options.data;
    data = vm._data = isFunction(data) ? getData(data, vm) : data || {};
    if (!isPlainObject(data)) {
        data = {};
        "production" !== 'production' &&
            warn('data functions should return an object:\n' +
                'https://v2.vuejs.org/v2/guide/components.html#data-Must-Be-a-Function', vm);
    }
    // proxy data on instance
    var keys = Object.keys(data);
    var props = vm.$options.props;
    var methods = vm.$options.methods;
    var i = keys.length;
    while (i--) {
        var key = keys[i];
        if (false) {
            if (methods && hasOwn(methods, key)) {
                warn("Method \"".concat(key, "\" has already been defined as a data property."), vm);
            }
        }
        if (props && hasOwn(props, key)) {
            "production" !== 'production' &&
                warn("The data property \"".concat(key, "\" is already declared as a prop. ") +
                    "Use prop default value instead.", vm);
        }
        else if (!isReserved(key)) {
            proxy(vm, "_data", key);
        }
    }
    // observe data
    var ob = observe(data);
    ob && ob.vmCount++;
}
function getData(data, vm) {
    // #7573 disable dep collection when invoking data getters
    pushTarget();
    try {
        return data.call(vm, vm);
    }
    catch (e) {
        handleError(e, vm, "data()");
        return {};
    }
    finally {
        popTarget();
    }
}
var computedWatcherOptions = { lazy: true };
function initComputed$1(vm, computed) {
    // $flow-disable-line
    var watchers = (vm._computedWatchers = Object.create(null));
    // computed properties are just getters during SSR
    var isSSR = isServerRendering();
    for (var key in computed) {
        var userDef = computed[key];
        var getter = isFunction(userDef) ? userDef : userDef.get;
        if (false) {
            warn("Getter is missing for computed property \"".concat(key, "\"."), vm);
        }
        if (!isSSR) {
            // create internal watcher for the computed property.
            watchers[key] = new Watcher(vm, getter || noop, noop, computedWatcherOptions);
        }
        // component-defined computed properties are already defined on the
        // component prototype. We only need to define computed properties defined
        // at instantiation here.
        if (!(key in vm)) {
            defineComputed(vm, key, userDef);
        }
        else if (false) {
            if (key in vm.$data) {
                warn("The computed property \"".concat(key, "\" is already defined in data."), vm);
            }
            else if (vm.$options.props && key in vm.$options.props) {
                warn("The computed property \"".concat(key, "\" is already defined as a prop."), vm);
            }
            else if (vm.$options.methods && key in vm.$options.methods) {
                warn("The computed property \"".concat(key, "\" is already defined as a method."), vm);
            }
        }
    }
}
function defineComputed(target, key, userDef) {
    var shouldCache = !isServerRendering();
    if (isFunction(userDef)) {
        sharedPropertyDefinition.get = shouldCache
            ? createComputedGetter(key)
            : createGetterInvoker(userDef);
        sharedPropertyDefinition.set = noop;
    }
    else {
        sharedPropertyDefinition.get = userDef.get
            ? shouldCache && userDef.cache !== false
                ? createComputedGetter(key)
                : createGetterInvoker(userDef.get)
            : noop;
        sharedPropertyDefinition.set = userDef.set || noop;
    }
    if (false) {
        sharedPropertyDefinition.set = function () {
            warn("Computed property \"".concat(key, "\" was assigned to but it has no setter."), this);
        };
    }
    Object.defineProperty(target, key, sharedPropertyDefinition);
}
function createComputedGetter(key) {
    return function computedGetter() {
        var watcher = this._computedWatchers && this._computedWatchers[key];
        if (watcher) {
            if (watcher.dirty) {
                watcher.evaluate();
            }
            if (Dep.target) {
                if (false) {
                    Dep.target.onTrack({
                        effect: Dep.target,
                        target: this,
                        type: "get" /* TrackOpTypes.GET */,
                        key: key
                    });
                }
                watcher.depend();
            }
            return watcher.value;
        }
    };
}
function createGetterInvoker(fn) {
    return function computedGetter() {
        return fn.call(this, this);
    };
}
function initMethods(vm, methods) {
    var props = vm.$options.props;
    for (var key in methods) {
        if (false) {
            if (typeof methods[key] !== 'function') {
                warn("Method \"".concat(key, "\" has type \"").concat(typeof methods[key], "\" in the component definition. ") +
                    "Did you reference the function correctly?", vm);
            }
            if (props && hasOwn(props, key)) {
                warn("Method \"".concat(key, "\" has already been defined as a prop."), vm);
            }
            if (key in vm && isReserved(key)) {
                warn("Method \"".concat(key, "\" conflicts with an existing Vue instance method. ") +
                    "Avoid defining component methods that start with _ or $.");
            }
        }
        vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
    }
}
function initWatch(vm, watch) {
    for (var key in watch) {
        var handler = watch[key];
        if (isArray(handler)) {
            for (var i = 0; i < handler.length; i++) {
                createWatcher(vm, key, handler[i]);
            }
        }
        else {
            createWatcher(vm, key, handler);
        }
    }
}
function createWatcher(vm, expOrFn, handler, options) {
    if (isPlainObject(handler)) {
        options = handler;
        handler = handler.handler;
    }
    if (typeof handler === 'string') {
        handler = vm[handler];
    }
    return vm.$watch(expOrFn, handler, options);
}
function stateMixin(Vue) {
    // flow somehow has problems with directly declared definition object
    // when using Object.defineProperty, so we have to procedurally build up
    // the object here.
    var dataDef = {};
    dataDef.get = function () {
        return this._data;
    };
    var propsDef = {};
    propsDef.get = function () {
        return this._props;
    };
    if (false) {
        dataDef.set = function () {
            warn('Avoid replacing instance root $data. ' +
                'Use nested data properties instead.', this);
        };
        propsDef.set = function () {
            warn("$props is readonly.", this);
        };
    }
    Object.defineProperty(Vue.prototype, '$data', dataDef);
    Object.defineProperty(Vue.prototype, '$props', propsDef);
    Vue.prototype.$set = set;
    Vue.prototype.$delete = del;
    Vue.prototype.$watch = function (expOrFn, cb, options) {
        var vm = this;
        if (isPlainObject(cb)) {
            return createWatcher(vm, expOrFn, cb, options);
        }
        options = options || {};
        options.user = true;
        var watcher = new Watcher(vm, expOrFn, cb, options);
        if (options.immediate) {
            var info = "callback for immediate watcher \"".concat(watcher.expression, "\"");
            pushTarget();
            invokeWithErrorHandling(cb, vm, [watcher.value], vm, info);
            popTarget();
        }
        return function unwatchFn() {
            watcher.teardown();
        };
    };
}

var uid = 0;
function initMixin$1(Vue) {
    Vue.prototype._init = function (options) {
        var vm = this;
        // a uid
        vm._uid = uid++;
        var startTag, endTag;
        /* istanbul ignore if */
        if (false) {
            startTag = "vue-perf-start:".concat(vm._uid);
            endTag = "vue-perf-end:".concat(vm._uid);
            mark(startTag);
        }
        // a flag to mark this as a Vue instance without having to do instanceof
        // check
        vm._isVue = true;
        // avoid instances from being observed
        vm.__v_skip = true;
        // effect scope
        vm._scope = new EffectScope(true /* detached */);
        // #13134 edge case where a child component is manually created during the
        // render of a parent component
        vm._scope.parent = undefined;
        vm._scope._vm = true;
        // merge options
        if (options && options._isComponent) {
            // optimize internal component instantiation
            // since dynamic options merging is pretty slow, and none of the
            // internal component options needs special treatment.
            initInternalComponent(vm, options);
        }
        else {
            vm.$options = mergeOptions(resolveConstructorOptions(vm.constructor), options || {}, vm);
        }
        /* istanbul ignore else */
        if (false) {
            initProxy(vm);
        }
        else {
            vm._renderProxy = vm;
        }
        // expose real self
        vm._self = vm;
        initLifecycle(vm);
        initEvents(vm);
        initRender(vm);
        callHook$1(vm, 'beforeCreate', undefined, false /* setContext */);
        initInjections(vm); // resolve injections before data/props
        initState(vm);
        initProvide(vm); // resolve provide after data/props
        callHook$1(vm, 'created');
        /* istanbul ignore if */
        if (false) {
            vm._name = formatComponentName(vm, false);
            mark(endTag);
            measure("vue ".concat(vm._name, " init"), startTag, endTag);
        }
        if (vm.$options.el) {
            vm.$mount(vm.$options.el);
        }
    };
}
function initInternalComponent(vm, options) {
    var opts = (vm.$options = Object.create(vm.constructor.options));
    // doing this because it's faster than dynamic enumeration.
    var parentVnode = options._parentVnode;
    opts.parent = options.parent;
    opts._parentVnode = parentVnode;
    var vnodeComponentOptions = parentVnode.componentOptions;
    opts.propsData = vnodeComponentOptions.propsData;
    opts._parentListeners = vnodeComponentOptions.listeners;
    opts._renderChildren = vnodeComponentOptions.children;
    opts._componentTag = vnodeComponentOptions.tag;
    if (options.render) {
        opts.render = options.render;
        opts.staticRenderFns = options.staticRenderFns;
    }
}
function resolveConstructorOptions(Ctor) {
    var options = Ctor.options;
    if (Ctor.super) {
        var superOptions = resolveConstructorOptions(Ctor.super);
        var cachedSuperOptions = Ctor.superOptions;
        if (superOptions !== cachedSuperOptions) {
            // super option changed,
            // need to resolve new options.
            Ctor.superOptions = superOptions;
            // check if there are any late-modified/attached options (#4976)
            var modifiedOptions = resolveModifiedOptions(Ctor);
            // update base extend options
            if (modifiedOptions) {
                extend(Ctor.extendOptions, modifiedOptions);
            }
            options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
            if (options.name) {
                options.components[options.name] = Ctor;
            }
        }
    }
    return options;
}
function resolveModifiedOptions(Ctor) {
    var modified;
    var latest = Ctor.options;
    var sealed = Ctor.sealedOptions;
    for (var key in latest) {
        if (latest[key] !== sealed[key]) {
            if (!modified)
                modified = {};
            modified[key] = latest[key];
        }
    }
    return modified;
}

function Vue(options) {
    if (false) {
        warn('Vue is a constructor and should be called with the `new` keyword');
    }
    this._init(options);
}
//@ts-expect-error Vue has function type
initMixin$1(Vue);
//@ts-expect-error Vue has function type
stateMixin(Vue);
//@ts-expect-error Vue has function type
eventsMixin(Vue);
//@ts-expect-error Vue has function type
lifecycleMixin(Vue);
//@ts-expect-error Vue has function type
renderMixin(Vue);

function initUse(Vue) {
    Vue.use = function (plugin) {
        var installedPlugins = this._installedPlugins || (this._installedPlugins = []);
        if (installedPlugins.indexOf(plugin) > -1) {
            return this;
        }
        // additional parameters
        var args = toArray(arguments, 1);
        args.unshift(this);
        if (isFunction(plugin.install)) {
            plugin.install.apply(plugin, args);
        }
        else if (isFunction(plugin)) {
            plugin.apply(null, args);
        }
        installedPlugins.push(plugin);
        return this;
    };
}

function initMixin(Vue) {
    Vue.mixin = function (mixin) {
        this.options = mergeOptions(this.options, mixin);
        return this;
    };
}

function initExtend(Vue) {
    /**
     * Each instance constructor, including Vue, has a unique
     * cid. This enables us to create wrapped "child
     * constructors" for prototypal inheritance and cache them.
     */
    Vue.cid = 0;
    var cid = 1;
    /**
     * Class inheritance
     */
    Vue.extend = function (extendOptions) {
        extendOptions = extendOptions || {};
        var Super = this;
        var SuperId = Super.cid;
        var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
        if (cachedCtors[SuperId]) {
            return cachedCtors[SuperId];
        }
        var name = getComponentName(extendOptions) || getComponentName(Super.options);
        if (false) {
            validateComponentName(name);
        }
        var Sub = function VueComponent(options) {
            this._init(options);
        };
        Sub.prototype = Object.create(Super.prototype);
        Sub.prototype.constructor = Sub;
        Sub.cid = cid++;
        Sub.options = mergeOptions(Super.options, extendOptions);
        Sub['super'] = Super;
        // For props and computed properties, we define the proxy getters on
        // the Vue instances at extension time, on the extended prototype. This
        // avoids Object.defineProperty calls for each instance created.
        if (Sub.options.props) {
            initProps(Sub);
        }
        if (Sub.options.computed) {
            initComputed(Sub);
        }
        // allow further extension/mixin/plugin usage
        Sub.extend = Super.extend;
        Sub.mixin = Super.mixin;
        Sub.use = Super.use;
        // create asset registers, so extended classes
        // can have their private assets too.
        ASSET_TYPES.forEach(function (type) {
            Sub[type] = Super[type];
        });
        // enable recursive self-lookup
        if (name) {
            Sub.options.components[name] = Sub;
        }
        // keep a reference to the super options at extension time.
        // later at instantiation we can check if Super's options have
        // been updated.
        Sub.superOptions = Super.options;
        Sub.extendOptions = extendOptions;
        Sub.sealedOptions = extend({}, Sub.options);
        // cache constructor
        cachedCtors[SuperId] = Sub;
        return Sub;
    };
}
function initProps(Comp) {
    var props = Comp.options.props;
    for (var key in props) {
        proxy(Comp.prototype, "_props", key);
    }
}
function initComputed(Comp) {
    var computed = Comp.options.computed;
    for (var key in computed) {
        defineComputed(Comp.prototype, key, computed[key]);
    }
}

function initAssetRegisters(Vue) {
    /**
     * Create asset registration methods.
     */
    ASSET_TYPES.forEach(function (type) {
        // @ts-expect-error function is not exact same type
        Vue[type] = function (id, definition) {
            if (!definition) {
                return this.options[type + 's'][id];
            }
            else {
                /* istanbul ignore if */
                if (false) {
                    validateComponentName(id);
                }
                if (type === 'component' && isPlainObject(definition)) {
                    // @ts-expect-error
                    definition.name = definition.name || id;
                    definition = this.options._base.extend(definition);
                }
                if (type === 'directive' && isFunction(definition)) {
                    definition = { bind: definition, update: definition };
                }
                this.options[type + 's'][id] = definition;
                return definition;
            }
        };
    });
}

function _getComponentName(opts) {
    return opts && (getComponentName(opts.Ctor.options) || opts.tag);
}
function matches(pattern, name) {
    if (isArray(pattern)) {
        return pattern.indexOf(name) > -1;
    }
    else if (typeof pattern === 'string') {
        return pattern.split(',').indexOf(name) > -1;
    }
    else if (isRegExp(pattern)) {
        return pattern.test(name);
    }
    /* istanbul ignore next */
    return false;
}
function pruneCache(keepAliveInstance, filter) {
    var cache = keepAliveInstance.cache, keys = keepAliveInstance.keys, _vnode = keepAliveInstance._vnode, $vnode = keepAliveInstance.$vnode;
    for (var key in cache) {
        var entry = cache[key];
        if (entry) {
            var name_1 = entry.name;
            if (name_1 && !filter(name_1)) {
                pruneCacheEntry(cache, key, keys, _vnode);
            }
        }
    }
    $vnode.componentOptions.children = undefined;
}
function pruneCacheEntry(cache, key, keys, current) {
    var entry = cache[key];
    if (entry && (!current || entry.tag !== current.tag)) {
        // @ts-expect-error can be undefined
        entry.componentInstance.$destroy();
    }
    cache[key] = null;
    remove$2(keys, key);
}
var patternTypes = [String, RegExp, Array];
// TODO defineComponent
var KeepAlive = {
    name: 'keep-alive',
    abstract: true,
    props: {
        include: patternTypes,
        exclude: patternTypes,
        max: [String, Number]
    },
    methods: {
        cacheVNode: function () {
            var _a = this, cache = _a.cache, keys = _a.keys, vnodeToCache = _a.vnodeToCache, keyToCache = _a.keyToCache;
            if (vnodeToCache) {
                var tag = vnodeToCache.tag, componentInstance = vnodeToCache.componentInstance, componentOptions = vnodeToCache.componentOptions;
                cache[keyToCache] = {
                    name: _getComponentName(componentOptions),
                    tag: tag,
                    componentInstance: componentInstance
                };
                keys.push(keyToCache);
                // prune oldest entry
                if (this.max && keys.length > parseInt(this.max)) {
                    pruneCacheEntry(cache, keys[0], keys, this._vnode);
                }
                this.vnodeToCache = null;
            }
        }
    },
    created: function () {
        this.cache = Object.create(null);
        this.keys = [];
    },
    destroyed: function () {
        for (var key in this.cache) {
            pruneCacheEntry(this.cache, key, this.keys);
        }
    },
    mounted: function () {
        var _this = this;
        this.cacheVNode();
        this.$watch('include', function (val) {
            pruneCache(_this, function (name) { return matches(val, name); });
        });
        this.$watch('exclude', function (val) {
            pruneCache(_this, function (name) { return !matches(val, name); });
        });
    },
    updated: function () {
        this.cacheVNode();
    },
    render: function () {
        var slot = this.$slots.default;
        var vnode = getFirstComponentChild(slot);
        var componentOptions = vnode && vnode.componentOptions;
        if (componentOptions) {
            // check pattern
            var name_2 = _getComponentName(componentOptions);
            var _a = this, include = _a.include, exclude = _a.exclude;
            if (
            // not included
            (include && (!name_2 || !matches(include, name_2))) ||
                // excluded
                (exclude && name_2 && matches(exclude, name_2))) {
                return vnode;
            }
            var _b = this, cache = _b.cache, keys = _b.keys;
            var key = vnode.key == null
                ? // same constructor may get registered as different local components
                    // so cid alone is not enough (#3269)
                    componentOptions.Ctor.cid +
                        (componentOptions.tag ? "::".concat(componentOptions.tag) : '')
                : vnode.key;
            if (cache[key]) {
                vnode.componentInstance = cache[key].componentInstance;
                // make current key freshest
                remove$2(keys, key);
                keys.push(key);
            }
            else {
                // delay setting the cache until update
                this.vnodeToCache = vnode;
                this.keyToCache = key;
            }
            // @ts-expect-error can vnode.data can be undefined
            vnode.data.keepAlive = true;
        }
        return vnode || (slot && slot[0]);
    }
};

var builtInComponents = {
    KeepAlive: KeepAlive
};

function initGlobalAPI(Vue) {
    // config
    var configDef = {};
    configDef.get = function () { return config; };
    if (false) {
        configDef.set = function () {
            warn('Do not replace the Vue.config object, set individual fields instead.');
        };
    }
    Object.defineProperty(Vue, 'config', configDef);
    // exposed util methods.
    // NOTE: these are not considered part of the public API - avoid relying on
    // them unless you are aware of the risk.
    Vue.util = {
        warn: warn,
        extend: extend,
        mergeOptions: mergeOptions,
        defineReactive: defineReactive
    };
    Vue.set = set;
    Vue.delete = del;
    Vue.nextTick = nextTick;
    // 2.6 explicit observable API
    Vue.observable = function (obj) {
        observe(obj);
        return obj;
    };
    Vue.options = Object.create(null);
    ASSET_TYPES.forEach(function (type) {
        Vue.options[type + 's'] = Object.create(null);
    });
    // this is used to identify the "base" constructor to extend all plain-object
    // components with in Weex's multi-instance scenarios.
    Vue.options._base = Vue;
    extend(Vue.options.components, builtInComponents);
    initUse(Vue);
    initMixin(Vue);
    initExtend(Vue);
    initAssetRegisters(Vue);
}

initGlobalAPI(Vue);
Object.defineProperty(Vue.prototype, '$isServer', {
    get: isServerRendering
});
Object.defineProperty(Vue.prototype, '$ssrContext', {
    get: function () {
        /* istanbul ignore next */
        return this.$vnode && this.$vnode.ssrContext;
    }
});
// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
    value: FunctionalRenderContext
});
Vue.version = version;

// these are reserved for web because they are directly compiled away
// during template compilation
var isReservedAttr = makeMap('style,class');
// attributes that should be using props for binding
var acceptValue = makeMap('input,textarea,option,select,progress');
var mustUseProp = function (tag, type, attr) {
    return ((attr === 'value' && acceptValue(tag) && type !== 'button') ||
        (attr === 'selected' && tag === 'option') ||
        (attr === 'checked' && tag === 'input') ||
        (attr === 'muted' && tag === 'video'));
};
var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');
var isValidContentEditableValue = makeMap('events,caret,typing,plaintext-only');
var convertEnumeratedValue = function (key, value) {
    return isFalsyAttrValue(value) || value === 'false'
        ? 'false'
        : // allow arbitrary string value for contenteditable
            key === 'contenteditable' && isValidContentEditableValue(value)
                ? value
                : 'true';
};
var isBooleanAttr = makeMap('allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
    'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
    'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
    'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
    'required,reversed,scoped,seamless,selected,sortable,' +
    'truespeed,typemustmatch,visible');
var xlinkNS = 'http://www.w3.org/1999/xlink';
var isXlink = function (name) {
    return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink';
};
var getXlinkProp = function (name) {
    return isXlink(name) ? name.slice(6, name.length) : '';
};
var isFalsyAttrValue = function (val) {
    return val == null || val === false;
};

function genClassForVnode(vnode) {
    var data = vnode.data;
    var parentNode = vnode;
    var childNode = vnode;
    while (isDef(childNode.componentInstance)) {
        childNode = childNode.componentInstance._vnode;
        if (childNode && childNode.data) {
            data = mergeClassData(childNode.data, data);
        }
    }
    // @ts-expect-error parentNode.parent not VNodeWithData
    while (isDef((parentNode = parentNode.parent))) {
        if (parentNode && parentNode.data) {
            data = mergeClassData(data, parentNode.data);
        }
    }
    return renderClass(data.staticClass, data.class);
}
function mergeClassData(child, parent) {
    return {
        staticClass: concat(child.staticClass, parent.staticClass),
        class: isDef(child.class) ? [child.class, parent.class] : parent.class
    };
}
function renderClass(staticClass, dynamicClass) {
    if (isDef(staticClass) || isDef(dynamicClass)) {
        return concat(staticClass, stringifyClass(dynamicClass));
    }
    /* istanbul ignore next */
    return '';
}
function concat(a, b) {
    return a ? (b ? a + ' ' + b : a) : b || '';
}
function stringifyClass(value) {
    if (Array.isArray(value)) {
        return stringifyArray(value);
    }
    if (isObject(value)) {
        return stringifyObject(value);
    }
    if (typeof value === 'string') {
        return value;
    }
    /* istanbul ignore next */
    return '';
}
function stringifyArray(value) {
    var res = '';
    var stringified;
    for (var i = 0, l = value.length; i < l; i++) {
        if (isDef((stringified = stringifyClass(value[i]))) && stringified !== '') {
            if (res)
                res += ' ';
            res += stringified;
        }
    }
    return res;
}
function stringifyObject(value) {
    var res = '';
    for (var key in value) {
        if (value[key]) {
            if (res)
                res += ' ';
            res += key;
        }
    }
    return res;
}

var namespaceMap = {
    svg: 'http://www.w3.org/2000/svg',
    math: 'http://www.w3.org/1998/Math/MathML'
};
var isHTMLTag = makeMap('html,body,base,head,link,meta,style,title,' +
    'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
    'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
    'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
    's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
    'embed,object,param,source,canvas,script,noscript,del,ins,' +
    'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
    'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
    'output,progress,select,textarea,' +
    'details,dialog,menu,menuitem,summary,' +
    'content,element,shadow,template,blockquote,iframe,tfoot');
// this map is intentionally selective, only covering SVG elements that may
// contain child elements.
var isSVG = makeMap('svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
    'foreignobject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
    'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view', true);
var isReservedTag = function (tag) {
    return isHTMLTag(tag) || isSVG(tag);
};
function getTagNamespace(tag) {
    if (isSVG(tag)) {
        return 'svg';
    }
    // basic support for MathML
    // note it doesn't support other MathML elements being component roots
    if (tag === 'math') {
        return 'math';
    }
}
var unknownElementCache = Object.create(null);
function isUnknownElement(tag) {
    /* istanbul ignore if */
    if (!inBrowser) {
        return true;
    }
    if (isReservedTag(tag)) {
        return false;
    }
    tag = tag.toLowerCase();
    /* istanbul ignore if */
    if (unknownElementCache[tag] != null) {
        return unknownElementCache[tag];
    }
    var el = document.createElement(tag);
    if (tag.indexOf('-') > -1) {
        // https://stackoverflow.com/a/28210364/1070244
        return (unknownElementCache[tag] =
            el.constructor === window.HTMLUnknownElement ||
                el.constructor === window.HTMLElement);
    }
    else {
        return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()));
    }
}
var isTextInputType = makeMap('text,number,password,search,email,tel,url');

/**
 * Query an element selector if it's not an element already.
 */
function query(el) {
    if (typeof el === 'string') {
        var selected = document.querySelector(el);
        if (!selected) {
            "production" !== 'production' && warn('Cannot find element: ' + el);
            return document.createElement('div');
        }
        return selected;
    }
    else {
        return el;
    }
}

function createElement(tagName, vnode) {
    var elm = document.createElement(tagName);
    if (tagName !== 'select') {
        return elm;
    }
    // false or null will remove the attribute but undefined will not
    if (vnode.data &&
        vnode.data.attrs &&
        vnode.data.attrs.multiple !== undefined) {
        elm.setAttribute('multiple', 'multiple');
    }
    return elm;
}
function createElementNS(namespace, tagName) {
    return document.createElementNS(namespaceMap[namespace], tagName);
}
function createTextNode(text) {
    return document.createTextNode(text);
}
function createComment(text) {
    return document.createComment(text);
}
function insertBefore(parentNode, newNode, referenceNode) {
    parentNode.insertBefore(newNode, referenceNode);
}
function removeChild(node, child) {
    node.removeChild(child);
}
function appendChild(node, child) {
    node.appendChild(child);
}
function parentNode(node) {
    return node.parentNode;
}
function nextSibling(node) {
    return node.nextSibling;
}
function tagName(node) {
    return node.tagName;
}
function setTextContent(node, text) {
    node.textContent = text;
}
function setStyleScope(node, scopeId) {
    node.setAttribute(scopeId, '');
}

var nodeOps = /*#__PURE__*/Object.freeze({
  __proto__: null,
  createElement: createElement,
  createElementNS: createElementNS,
  createTextNode: createTextNode,
  createComment: createComment,
  insertBefore: insertBefore,
  removeChild: removeChild,
  appendChild: appendChild,
  parentNode: parentNode,
  nextSibling: nextSibling,
  tagName: tagName,
  setTextContent: setTextContent,
  setStyleScope: setStyleScope
});

var ref = {
    create: function (_, vnode) {
        registerRef(vnode);
    },
    update: function (oldVnode, vnode) {
        if (oldVnode.data.ref !== vnode.data.ref) {
            registerRef(oldVnode, true);
            registerRef(vnode);
        }
    },
    destroy: function (vnode) {
        registerRef(vnode, true);
    }
};
function registerRef(vnode, isRemoval) {
    var ref = vnode.data.ref;
    if (!isDef(ref))
        return;
    var vm = vnode.context;
    var refValue = vnode.componentInstance || vnode.elm;
    var value = isRemoval ? null : refValue;
    var $refsValue = isRemoval ? undefined : refValue;
    if (isFunction(ref)) {
        invokeWithErrorHandling(ref, vm, [value], vm, "template ref function");
        return;
    }
    var isFor = vnode.data.refInFor;
    var _isString = typeof ref === 'string' || typeof ref === 'number';
    var _isRef = isRef(ref);
    var refs = vm.$refs;
    if (_isString || _isRef) {
        if (isFor) {
            var existing = _isString ? refs[ref] : ref.value;
            if (isRemoval) {
                isArray(existing) && remove$2(existing, refValue);
            }
            else {
                if (!isArray(existing)) {
                    if (_isString) {
                        refs[ref] = [refValue];
                        setSetupRef(vm, ref, refs[ref]);
                    }
                    else {
                        ref.value = [refValue];
                    }
                }
                else if (!existing.includes(refValue)) {
                    existing.push(refValue);
                }
            }
        }
        else if (_isString) {
            if (isRemoval && refs[ref] !== refValue) {
                return;
            }
            refs[ref] = $refsValue;
            setSetupRef(vm, ref, value);
        }
        else if (_isRef) {
            if (isRemoval && ref.value !== refValue) {
                return;
            }
            ref.value = value;
        }
        else if (false) {
            warn("Invalid template ref type: ".concat(typeof ref));
        }
    }
}
function setSetupRef(_a, key, val) {
    var _setupState = _a._setupState;
    if (_setupState && hasOwn(_setupState, key)) {
        if (isRef(_setupState[key])) {
            _setupState[key].value = val;
        }
        else {
            _setupState[key] = val;
        }
    }
}

/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/paldepind/snabbdom/blob/master/LICENSE
 *
 * modified by Evan You (@yyx990803)
 *
 * Not type-checking this because this file is perf-critical and the cost
 * of making flow understand it is not worth it.
 */
var emptyNode = new VNode('', {}, []);
var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];
function sameVnode(a, b) {
    return (a.key === b.key &&
        a.asyncFactory === b.asyncFactory &&
        ((a.tag === b.tag &&
            a.isComment === b.isComment &&
            isDef(a.data) === isDef(b.data) &&
            sameInputType(a, b)) ||
            (isTrue(a.isAsyncPlaceholder) && isUndef(b.asyncFactory.error))));
}
function sameInputType(a, b) {
    if (a.tag !== 'input')
        return true;
    var i;
    var typeA = isDef((i = a.data)) && isDef((i = i.attrs)) && i.type;
    var typeB = isDef((i = b.data)) && isDef((i = i.attrs)) && i.type;
    return typeA === typeB || (isTextInputType(typeA) && isTextInputType(typeB));
}
function createKeyToOldIdx(children, beginIdx, endIdx) {
    var i, key;
    var map = {};
    for (i = beginIdx; i <= endIdx; ++i) {
        key = children[i].key;
        if (isDef(key))
            map[key] = i;
    }
    return map;
}
function createPatchFunction(backend) {
    var i, j;
    var cbs = {};
    var modules = backend.modules, nodeOps = backend.nodeOps;
    for (i = 0; i < hooks.length; ++i) {
        cbs[hooks[i]] = [];
        for (j = 0; j < modules.length; ++j) {
            if (isDef(modules[j][hooks[i]])) {
                cbs[hooks[i]].push(modules[j][hooks[i]]);
            }
        }
    }
    function emptyNodeAt(elm) {
        return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm);
    }
    function createRmCb(childElm, listeners) {
        function remove() {
            if (--remove.listeners === 0) {
                removeNode(childElm);
            }
        }
        remove.listeners = listeners;
        return remove;
    }
    function removeNode(el) {
        var parent = nodeOps.parentNode(el);
        // element may have already been removed due to v-html / v-text
        if (isDef(parent)) {
            nodeOps.removeChild(parent, el);
        }
    }
    function isUnknownElement(vnode, inVPre) {
        return (!inVPre &&
            !vnode.ns &&
            !(config.ignoredElements.length &&
                config.ignoredElements.some(function (ignore) {
                    return isRegExp(ignore)
                        ? ignore.test(vnode.tag)
                        : ignore === vnode.tag;
                })) &&
            config.isUnknownElement(vnode.tag));
    }
    var creatingElmInVPre = 0;
    function createElm(vnode, insertedVnodeQueue, parentElm, refElm, nested, ownerArray, index) {
        if (isDef(vnode.elm) && isDef(ownerArray)) {
            // This vnode was used in a previous render!
            // now it's used as a new node, overwriting its elm would cause
            // potential patch errors down the road when it's used as an insertion
            // reference node. Instead, we clone the node on-demand before creating
            // associated DOM element for it.
            vnode = ownerArray[index] = cloneVNode(vnode);
        }
        vnode.isRootInsert = !nested; // for transition enter check
        if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
            return;
        }
        var data = vnode.data;
        var children = vnode.children;
        var tag = vnode.tag;
        if (isDef(tag)) {
            if (false) {
                if (data && data.pre) {
                    creatingElmInVPre++;
                }
                if (isUnknownElement(vnode, creatingElmInVPre)) {
                    warn('Unknown custom element: <' +
                        tag +
                        '> - did you ' +
                        'register the component correctly? For recursive components, ' +
                        'make sure to provide the "name" option.', vnode.context);
                }
            }
            vnode.elm = vnode.ns
                ? nodeOps.createElementNS(vnode.ns, tag)
                : nodeOps.createElement(tag, vnode);
            setScope(vnode);
            createChildren(vnode, children, insertedVnodeQueue);
            if (isDef(data)) {
                invokeCreateHooks(vnode, insertedVnodeQueue);
            }
            insert(parentElm, vnode.elm, refElm);
            if (false) {
                creatingElmInVPre--;
            }
        }
        else if (isTrue(vnode.isComment)) {
            vnode.elm = nodeOps.createComment(vnode.text);
            insert(parentElm, vnode.elm, refElm);
        }
        else {
            vnode.elm = nodeOps.createTextNode(vnode.text);
            insert(parentElm, vnode.elm, refElm);
        }
    }
    function createComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
        var i = vnode.data;
        if (isDef(i)) {
            var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
            if (isDef((i = i.hook)) && isDef((i = i.init))) {
                i(vnode, false /* hydrating */);
            }
            // after calling the init hook, if the vnode is a child component
            // it should've created a child instance and mounted it. the child
            // component also has set the placeholder vnode's elm.
            // in that case we can just return the element and be done.
            if (isDef(vnode.componentInstance)) {
                initComponent(vnode, insertedVnodeQueue);
                insert(parentElm, vnode.elm, refElm);
                if (isTrue(isReactivated)) {
                    reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
                }
                return true;
            }
        }
    }
    function initComponent(vnode, insertedVnodeQueue) {
        if (isDef(vnode.data.pendingInsert)) {
            insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
            vnode.data.pendingInsert = null;
        }
        vnode.elm = vnode.componentInstance.$el;
        if (isPatchable(vnode)) {
            invokeCreateHooks(vnode, insertedVnodeQueue);
            setScope(vnode);
        }
        else {
            // empty component root.
            // skip all element-related modules except for ref (#3455)
            registerRef(vnode);
            // make sure to invoke the insert hook
            insertedVnodeQueue.push(vnode);
        }
    }
    function reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
        var i;
        // hack for #4339: a reactivated component with inner transition
        // does not trigger because the inner node's created hooks are not called
        // again. It's not ideal to involve module-specific logic in here but
        // there doesn't seem to be a better way to do it.
        var innerNode = vnode;
        while (innerNode.componentInstance) {
            innerNode = innerNode.componentInstance._vnode;
            if (isDef((i = innerNode.data)) && isDef((i = i.transition))) {
                for (i = 0; i < cbs.activate.length; ++i) {
                    cbs.activate[i](emptyNode, innerNode);
                }
                insertedVnodeQueue.push(innerNode);
                break;
            }
        }
        // unlike a newly created component,
        // a reactivated keep-alive component doesn't insert itself
        insert(parentElm, vnode.elm, refElm);
    }
    function insert(parent, elm, ref) {
        if (isDef(parent)) {
            if (isDef(ref)) {
                if (nodeOps.parentNode(ref) === parent) {
                    nodeOps.insertBefore(parent, elm, ref);
                }
            }
            else {
                nodeOps.appendChild(parent, elm);
            }
        }
    }
    function createChildren(vnode, children, insertedVnodeQueue) {
        if (isArray(children)) {
            if (false) {
                checkDuplicateKeys(children);
            }
            for (var i_1 = 0; i_1 < children.length; ++i_1) {
                createElm(children[i_1], insertedVnodeQueue, vnode.elm, null, true, children, i_1);
            }
        }
        else if (isPrimitive(vnode.text)) {
            nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)));
        }
    }
    function isPatchable(vnode) {
        while (vnode.componentInstance) {
            vnode = vnode.componentInstance._vnode;
        }
        return isDef(vnode.tag);
    }
    function invokeCreateHooks(vnode, insertedVnodeQueue) {
        for (var i_2 = 0; i_2 < cbs.create.length; ++i_2) {
            cbs.create[i_2](emptyNode, vnode);
        }
        i = vnode.data.hook; // Reuse variable
        if (isDef(i)) {
            if (isDef(i.create))
                i.create(emptyNode, vnode);
            if (isDef(i.insert))
                insertedVnodeQueue.push(vnode);
        }
    }
    // set scope id attribute for scoped CSS.
    // this is implemented as a special case to avoid the overhead
    // of going through the normal attribute patching process.
    function setScope(vnode) {
        var i;
        if (isDef((i = vnode.fnScopeId))) {
            nodeOps.setStyleScope(vnode.elm, i);
        }
        else {
            var ancestor = vnode;
            while (ancestor) {
                if (isDef((i = ancestor.context)) && isDef((i = i.$options._scopeId))) {
                    nodeOps.setStyleScope(vnode.elm, i);
                }
                ancestor = ancestor.parent;
            }
        }
        // for slot content they should also get the scopeId from the host instance.
        if (isDef((i = activeInstance)) &&
            i !== vnode.context &&
            i !== vnode.fnContext &&
            isDef((i = i.$options._scopeId))) {
            nodeOps.setStyleScope(vnode.elm, i);
        }
    }
    function addVnodes(parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
        for (; startIdx <= endIdx; ++startIdx) {
            createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm, false, vnodes, startIdx);
        }
    }
    function invokeDestroyHook(vnode) {
        var i, j;
        var data = vnode.data;
        if (isDef(data)) {
            if (isDef((i = data.hook)) && isDef((i = i.destroy)))
                i(vnode);
            for (i = 0; i < cbs.destroy.length; ++i)
                cbs.destroy[i](vnode);
        }
        if (isDef((i = vnode.children))) {
            for (j = 0; j < vnode.children.length; ++j) {
                invokeDestroyHook(vnode.children[j]);
            }
        }
    }
    function removeVnodes(vnodes, startIdx, endIdx) {
        for (; startIdx <= endIdx; ++startIdx) {
            var ch = vnodes[startIdx];
            if (isDef(ch)) {
                if (isDef(ch.tag)) {
                    removeAndInvokeRemoveHook(ch);
                    invokeDestroyHook(ch);
                }
                else {
                    // Text node
                    removeNode(ch.elm);
                }
            }
        }
    }
    function removeAndInvokeRemoveHook(vnode, rm) {
        if (isDef(rm) || isDef(vnode.data)) {
            var i_3;
            var listeners = cbs.remove.length + 1;
            if (isDef(rm)) {
                // we have a recursively passed down rm callback
                // increase the listeners count
                rm.listeners += listeners;
            }
            else {
                // directly removing
                rm = createRmCb(vnode.elm, listeners);
            }
            // recursively invoke hooks on child component root node
            if (isDef((i_3 = vnode.componentInstance)) &&
                isDef((i_3 = i_3._vnode)) &&
                isDef(i_3.data)) {
                removeAndInvokeRemoveHook(i_3, rm);
            }
            for (i_3 = 0; i_3 < cbs.remove.length; ++i_3) {
                cbs.remove[i_3](vnode, rm);
            }
            if (isDef((i_3 = vnode.data.hook)) && isDef((i_3 = i_3.remove))) {
                i_3(vnode, rm);
            }
            else {
                rm();
            }
        }
        else {
            removeNode(vnode.elm);
        }
    }
    function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
        var oldStartIdx = 0;
        var newStartIdx = 0;
        var oldEndIdx = oldCh.length - 1;
        var oldStartVnode = oldCh[0];
        var oldEndVnode = oldCh[oldEndIdx];
        var newEndIdx = newCh.length - 1;
        var newStartVnode = newCh[0];
        var newEndVnode = newCh[newEndIdx];
        var oldKeyToIdx, idxInOld, vnodeToMove, refElm;
        // removeOnly is a special flag used only by <transition-group>
        // to ensure removed elements stay in correct relative positions
        // during leaving transitions
        var canMove = !removeOnly;
        if (false) {
            checkDuplicateKeys(newCh);
        }
        while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
            if (isUndef(oldStartVnode)) {
                oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
            }
            else if (isUndef(oldEndVnode)) {
                oldEndVnode = oldCh[--oldEndIdx];
            }
            else if (sameVnode(oldStartVnode, newStartVnode)) {
                patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
                oldStartVnode = oldCh[++oldStartIdx];
                newStartVnode = newCh[++newStartIdx];
            }
            else if (sameVnode(oldEndVnode, newEndVnode)) {
                patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
                oldEndVnode = oldCh[--oldEndIdx];
                newEndVnode = newCh[--newEndIdx];
            }
            else if (sameVnode(oldStartVnode, newEndVnode)) {
                // Vnode moved right
                patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
                canMove &&
                    nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
                oldStartVnode = oldCh[++oldStartIdx];
                newEndVnode = newCh[--newEndIdx];
            }
            else if (sameVnode(oldEndVnode, newStartVnode)) {
                // Vnode moved left
                patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
                canMove &&
                    nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
                oldEndVnode = oldCh[--oldEndIdx];
                newStartVnode = newCh[++newStartIdx];
            }
            else {
                if (isUndef(oldKeyToIdx))
                    oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
                idxInOld = isDef(newStartVnode.key)
                    ? oldKeyToIdx[newStartVnode.key]
                    : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
                if (isUndef(idxInOld)) {
                    // New element
                    createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
                }
                else {
                    vnodeToMove = oldCh[idxInOld];
                    if (sameVnode(vnodeToMove, newStartVnode)) {
                        patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
                        oldCh[idxInOld] = undefined;
                        canMove &&
                            nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
                    }
                    else {
                        // same key but different element. treat as new element
                        createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
                    }
                }
                newStartVnode = newCh[++newStartIdx];
            }
        }
        if (oldStartIdx > oldEndIdx) {
            refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
            addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
        }
        else if (newStartIdx > newEndIdx) {
            removeVnodes(oldCh, oldStartIdx, oldEndIdx);
        }
    }
    function checkDuplicateKeys(children) {
        var seenKeys = {};
        for (var i_4 = 0; i_4 < children.length; i_4++) {
            var vnode = children[i_4];
            var key = vnode.key;
            if (isDef(key)) {
                if (seenKeys[key]) {
                    warn("Duplicate keys detected: '".concat(key, "'. This may cause an update error."), vnode.context);
                }
                else {
                    seenKeys[key] = true;
                }
            }
        }
    }
    function findIdxInOld(node, oldCh, start, end) {
        for (var i_5 = start; i_5 < end; i_5++) {
            var c = oldCh[i_5];
            if (isDef(c) && sameVnode(node, c))
                return i_5;
        }
    }
    function patchVnode(oldVnode, vnode, insertedVnodeQueue, ownerArray, index, removeOnly) {
        if (oldVnode === vnode) {
            return;
        }
        if (isDef(vnode.elm) && isDef(ownerArray)) {
            // clone reused vnode
            vnode = ownerArray[index] = cloneVNode(vnode);
        }
        var elm = (vnode.elm = oldVnode.elm);
        if (isTrue(oldVnode.isAsyncPlaceholder)) {
            if (isDef(vnode.asyncFactory.resolved)) {
                hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
            }
            else {
                vnode.isAsyncPlaceholder = true;
            }
            return;
        }
        // reuse element for static trees.
        // note we only do this if the vnode is cloned -
        // if the new node is not cloned it means the render functions have been
        // reset by the hot-reload-api and we need to do a proper re-render.
        if (isTrue(vnode.isStatic) &&
            isTrue(oldVnode.isStatic) &&
            vnode.key === oldVnode.key &&
            (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))) {
            vnode.componentInstance = oldVnode.componentInstance;
            return;
        }
        var i;
        var data = vnode.data;
        if (isDef(data) && isDef((i = data.hook)) && isDef((i = i.prepatch))) {
            i(oldVnode, vnode);
        }
        var oldCh = oldVnode.children;
        var ch = vnode.children;
        if (isDef(data) && isPatchable(vnode)) {
            for (i = 0; i < cbs.update.length; ++i)
                cbs.update[i](oldVnode, vnode);
            if (isDef((i = data.hook)) && isDef((i = i.update)))
                i(oldVnode, vnode);
        }
        if (isUndef(vnode.text)) {
            if (isDef(oldCh) && isDef(ch)) {
                if (oldCh !== ch)
                    updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly);
            }
            else if (isDef(ch)) {
                if (false) {
                    checkDuplicateKeys(ch);
                }
                if (isDef(oldVnode.text))
                    nodeOps.setTextContent(elm, '');
                addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
            }
            else if (isDef(oldCh)) {
                removeVnodes(oldCh, 0, oldCh.length - 1);
            }
            else if (isDef(oldVnode.text)) {
                nodeOps.setTextContent(elm, '');
            }
        }
        else if (oldVnode.text !== vnode.text) {
            nodeOps.setTextContent(elm, vnode.text);
        }
        if (isDef(data)) {
            if (isDef((i = data.hook)) && isDef((i = i.postpatch)))
                i(oldVnode, vnode);
        }
    }
    function invokeInsertHook(vnode, queue, initial) {
        // delay insert hooks for component root nodes, invoke them after the
        // element is really inserted
        if (isTrue(initial) && isDef(vnode.parent)) {
            vnode.parent.data.pendingInsert = queue;
        }
        else {
            for (var i_6 = 0; i_6 < queue.length; ++i_6) {
                queue[i_6].data.hook.insert(queue[i_6]);
            }
        }
    }
    var hydrationBailed = false;
    // list of modules that can skip create hook during hydration because they
    // are already rendered on the client or has no need for initialization
    // Note: style is excluded because it relies on initial clone for future
    // deep updates (#7063).
    var isRenderedModule = makeMap('attrs,class,staticClass,staticStyle,key');
    // Note: this is a browser-only function so we can assume elms are DOM nodes.
    function hydrate(elm, vnode, insertedVnodeQueue, inVPre) {
        var i;
        var tag = vnode.tag, data = vnode.data, children = vnode.children;
        inVPre = inVPre || (data && data.pre);
        vnode.elm = elm;
        if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
            vnode.isAsyncPlaceholder = true;
            return true;
        }
        // assert node match
        if (false) {
            if (!assertNodeMatch(elm, vnode, inVPre)) {
                return false;
            }
        }
        if (isDef(data)) {
            if (isDef((i = data.hook)) && isDef((i = i.init)))
                i(vnode, true /* hydrating */);
            if (isDef((i = vnode.componentInstance))) {
                // child component. it should have hydrated its own tree.
                initComponent(vnode, insertedVnodeQueue);
                return true;
            }
        }
        if (isDef(tag)) {
            if (isDef(children)) {
                // empty element, allow client to pick up and populate children
                if (!elm.hasChildNodes()) {
                    createChildren(vnode, children, insertedVnodeQueue);
                }
                else {
                    // v-html and domProps: innerHTML
                    if (isDef((i = data)) &&
                        isDef((i = i.domProps)) &&
                        isDef((i = i.innerHTML))) {
                        if (i !== elm.innerHTML) {
                            /* istanbul ignore if */
                            if (false) {
                                hydrationBailed = true;
                                console.warn('Parent: ', elm);
                                console.warn('server innerHTML: ', i);
                                console.warn('client innerHTML: ', elm.innerHTML);
                            }
                            return false;
                        }
                    }
                    else {
                        // iterate and compare children lists
                        var childrenMatch = true;
                        var childNode = elm.firstChild;
                        for (var i_7 = 0; i_7 < children.length; i_7++) {
                            if (!childNode ||
                                !hydrate(childNode, children[i_7], insertedVnodeQueue, inVPre)) {
                                childrenMatch = false;
                                break;
                            }
                            childNode = childNode.nextSibling;
                        }
                        // if childNode is not null, it means the actual childNodes list is
                        // longer than the virtual children list.
                        if (!childrenMatch || childNode) {
                            /* istanbul ignore if */
                            if (false) {
                                hydrationBailed = true;
                                console.warn('Parent: ', elm);
                                console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children);
                            }
                            return false;
                        }
                    }
                }
            }
            if (isDef(data)) {
                var fullInvoke = false;
                for (var key in data) {
                    if (!isRenderedModule(key)) {
                        fullInvoke = true;
                        invokeCreateHooks(vnode, insertedVnodeQueue);
                        break;
                    }
                }
                if (!fullInvoke && data['class']) {
                    // ensure collecting deps for deep class bindings for future updates
                    traverse(data['class']);
                }
            }
        }
        else if (elm.data !== vnode.text) {
            elm.data = vnode.text;
        }
        return true;
    }
    function assertNodeMatch(node, vnode, inVPre) {
        if (isDef(vnode.tag)) {
            return (vnode.tag.indexOf('vue-component') === 0 ||
                (!isUnknownElement(vnode, inVPre) &&
                    vnode.tag.toLowerCase() ===
                        (node.tagName && node.tagName.toLowerCase())));
        }
        else {
            return node.nodeType === (vnode.isComment ? 8 : 3);
        }
    }
    return function patch(oldVnode, vnode, hydrating, removeOnly) {
        if (isUndef(vnode)) {
            if (isDef(oldVnode))
                invokeDestroyHook(oldVnode);
            return;
        }
        var isInitialPatch = false;
        var insertedVnodeQueue = [];
        if (isUndef(oldVnode)) {
            // empty mount (likely as component), create new root element
            isInitialPatch = true;
            createElm(vnode, insertedVnodeQueue);
        }
        else {
            var isRealElement = isDef(oldVnode.nodeType);
            if (!isRealElement && sameVnode(oldVnode, vnode)) {
                // patch existing root node
                patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly);
            }
            else {
                if (isRealElement) {
                    // mounting to a real element
                    // check if this is server-rendered content and if we can perform
                    // a successful hydration.
                    if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
                        oldVnode.removeAttribute(SSR_ATTR);
                        hydrating = true;
                    }
                    if (isTrue(hydrating)) {
                        if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
                            invokeInsertHook(vnode, insertedVnodeQueue, true);
                            return oldVnode;
                        }
                        else if (false) {
                            warn('The client-side rendered virtual DOM tree is not matching ' +
                                'server-rendered content. This is likely caused by incorrect ' +
                                'HTML markup, for example nesting block-level elements inside ' +
                                '<p>, or missing <tbody>. Bailing hydration and performing ' +
                                'full client-side render.');
                        }
                    }
                    // either not server-rendered, or hydration failed.
                    // create an empty node and replace it
                    oldVnode = emptyNodeAt(oldVnode);
                }
                // replacing existing element
                var oldElm = oldVnode.elm;
                var parentElm = nodeOps.parentNode(oldElm);
                // create new node
                createElm(vnode, insertedVnodeQueue, 
                // extremely rare edge case: do not insert if old element is in a
                // leaving transition. Only happens when combining transition +
                // keep-alive + HOCs. (#4590)
                oldElm._leaveCb ? null : parentElm, nodeOps.nextSibling(oldElm));
                // update parent placeholder node element, recursively
                if (isDef(vnode.parent)) {
                    var ancestor = vnode.parent;
                    var patchable = isPatchable(vnode);
                    while (ancestor) {
                        for (var i_8 = 0; i_8 < cbs.destroy.length; ++i_8) {
                            cbs.destroy[i_8](ancestor);
                        }
                        ancestor.elm = vnode.elm;
                        if (patchable) {
                            for (var i_9 = 0; i_9 < cbs.create.length; ++i_9) {
                                cbs.create[i_9](emptyNode, ancestor);
                            }
                            // #6513
                            // invoke insert hooks that may have been merged by create hooks.
                            // e.g. for directives that uses the "inserted" hook.
                            var insert_1 = ancestor.data.hook.insert;
                            if (insert_1.merged) {
                                // start at index 1 to avoid re-invoking component mounted hook
                                // clone insert hooks to avoid being mutated during iteration.
                                // e.g. for customed directives under transition group.
                                var cloned = insert_1.fns.slice(1);
                                for (var i_10 = 0; i_10 < cloned.length; i_10++) {
                                    cloned[i_10]();
                                }
                            }
                        }
                        else {
                            registerRef(ancestor);
                        }
                        ancestor = ancestor.parent;
                    }
                }
                // destroy old node
                if (isDef(parentElm)) {
                    removeVnodes([oldVnode], 0, 0);
                }
                else if (isDef(oldVnode.tag)) {
                    invokeDestroyHook(oldVnode);
                }
            }
        }
        invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
        return vnode.elm;
    };
}

var directives = {
    create: updateDirectives,
    update: updateDirectives,
    destroy: function unbindDirectives(vnode) {
        // @ts-expect-error emptyNode is not VNodeWithData
        updateDirectives(vnode, emptyNode);
    }
};
function updateDirectives(oldVnode, vnode) {
    if (oldVnode.data.directives || vnode.data.directives) {
        _update(oldVnode, vnode);
    }
}
function _update(oldVnode, vnode) {
    var isCreate = oldVnode === emptyNode;
    var isDestroy = vnode === emptyNode;
    var oldDirs = normalizeDirectives(oldVnode.data.directives, oldVnode.context);
    var newDirs = normalizeDirectives(vnode.data.directives, vnode.context);
    var dirsWithInsert = [];
    var dirsWithPostpatch = [];
    var key, oldDir, dir;
    for (key in newDirs) {
        oldDir = oldDirs[key];
        dir = newDirs[key];
        if (!oldDir) {
            // new directive, bind
            callHook(dir, 'bind', vnode, oldVnode);
            if (dir.def && dir.def.inserted) {
                dirsWithInsert.push(dir);
            }
        }
        else {
            // existing directive, update
            dir.oldValue = oldDir.value;
            dir.oldArg = oldDir.arg;
            callHook(dir, 'update', vnode, oldVnode);
            if (dir.def && dir.def.componentUpdated) {
                dirsWithPostpatch.push(dir);
            }
        }
    }
    if (dirsWithInsert.length) {
        var callInsert = function () {
            for (var i = 0; i < dirsWithInsert.length; i++) {
                callHook(dirsWithInsert[i], 'inserted', vnode, oldVnode);
            }
        };
        if (isCreate) {
            mergeVNodeHook(vnode, 'insert', callInsert);
        }
        else {
            callInsert();
        }
    }
    if (dirsWithPostpatch.length) {
        mergeVNodeHook(vnode, 'postpatch', function () {
            for (var i = 0; i < dirsWithPostpatch.length; i++) {
                callHook(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
            }
        });
    }
    if (!isCreate) {
        for (key in oldDirs) {
            if (!newDirs[key]) {
                // no longer present, unbind
                callHook(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
            }
        }
    }
}
var emptyModifiers = Object.create(null);
function normalizeDirectives(dirs, vm) {
    var res = Object.create(null);
    if (!dirs) {
        // $flow-disable-line
        return res;
    }
    var i, dir;
    for (i = 0; i < dirs.length; i++) {
        dir = dirs[i];
        if (!dir.modifiers) {
            // $flow-disable-line
            dir.modifiers = emptyModifiers;
        }
        res[getRawDirName(dir)] = dir;
        if (vm._setupState && vm._setupState.__sfc) {
            var setupDef = dir.def || resolveAsset(vm, '_setupState', 'v-' + dir.name);
            if (typeof setupDef === 'function') {
                dir.def = {
                    bind: setupDef,
                    update: setupDef,
                };
            }
            else {
                dir.def = setupDef;
            }
        }
        dir.def = dir.def || resolveAsset(vm.$options, 'directives', dir.name, true);
    }
    // $flow-disable-line
    return res;
}
function getRawDirName(dir) {
    return (dir.rawName || "".concat(dir.name, ".").concat(Object.keys(dir.modifiers || {}).join('.')));
}
function callHook(dir, hook, vnode, oldVnode, isDestroy) {
    var fn = dir.def && dir.def[hook];
    if (fn) {
        try {
            fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
        }
        catch (e) {
            handleError(e, vnode.context, "directive ".concat(dir.name, " ").concat(hook, " hook"));
        }
    }
}

var baseModules = [ref, directives];

function updateAttrs(oldVnode, vnode) {
    var opts = vnode.componentOptions;
    if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
        return;
    }
    if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
        return;
    }
    var key, cur, old;
    var elm = vnode.elm;
    var oldAttrs = oldVnode.data.attrs || {};
    var attrs = vnode.data.attrs || {};
    // clone observed objects, as the user probably wants to mutate it
    if (isDef(attrs.__ob__) || isTrue(attrs._v_attr_proxy)) {
        attrs = vnode.data.attrs = extend({}, attrs);
    }
    for (key in attrs) {
        cur = attrs[key];
        old = oldAttrs[key];
        if (old !== cur) {
            setAttr(elm, key, cur, vnode.data.pre);
        }
    }
    // #4391: in IE9, setting type can reset value for input[type=radio]
    // #6666: IE/Edge forces progress value down to 1 before setting a max
    /* istanbul ignore if */
    if ((isIE || isEdge) && attrs.value !== oldAttrs.value) {
        setAttr(elm, 'value', attrs.value);
    }
    for (key in oldAttrs) {
        if (isUndef(attrs[key])) {
            if (isXlink(key)) {
                elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
            }
            else if (!isEnumeratedAttr(key)) {
                elm.removeAttribute(key);
            }
        }
    }
}
function setAttr(el, key, value, isInPre) {
    if (isInPre || el.tagName.indexOf('-') > -1) {
        baseSetAttr(el, key, value);
    }
    else if (isBooleanAttr(key)) {
        // set attribute for blank value
        // e.g. <option disabled>Select one</option>
        if (isFalsyAttrValue(value)) {
            el.removeAttribute(key);
        }
        else {
            // technically allowfullscreen is a boolean attribute for <iframe>,
            // but Flash expects a value of "true" when used on <embed> tag
            value = key === 'allowfullscreen' && el.tagName === 'EMBED' ? 'true' : key;
            el.setAttribute(key, value);
        }
    }
    else if (isEnumeratedAttr(key)) {
        el.setAttribute(key, convertEnumeratedValue(key, value));
    }
    else if (isXlink(key)) {
        if (isFalsyAttrValue(value)) {
            el.removeAttributeNS(xlinkNS, getXlinkProp(key));
        }
        else {
            el.setAttributeNS(xlinkNS, key, value);
        }
    }
    else {
        baseSetAttr(el, key, value);
    }
}
function baseSetAttr(el, key, value) {
    if (isFalsyAttrValue(value)) {
        el.removeAttribute(key);
    }
    else {
        // #7138: IE10 & 11 fires input event when setting placeholder on
        // <textarea>... block the first input event and remove the blocker
        // immediately.
        /* istanbul ignore if */
        if (isIE &&
            !isIE9 &&
            el.tagName === 'TEXTAREA' &&
            key === 'placeholder' &&
            value !== '' &&
            !el.__ieph) {
            var blocker_1 = function (e) {
                e.stopImmediatePropagation();
                el.removeEventListener('input', blocker_1);
            };
            el.addEventListener('input', blocker_1);
            // $flow-disable-line
            el.__ieph = true; /* IE placeholder patched */
        }
        el.setAttribute(key, value);
    }
}
var attrs = {
    create: updateAttrs,
    update: updateAttrs
};

function updateClass(oldVnode, vnode) {
    var el = vnode.elm;
    var data = vnode.data;
    var oldData = oldVnode.data;
    if (isUndef(data.staticClass) &&
        isUndef(data.class) &&
        (isUndef(oldData) ||
            (isUndef(oldData.staticClass) && isUndef(oldData.class)))) {
        return;
    }
    var cls = genClassForVnode(vnode);
    // handle transition classes
    var transitionClass = el._transitionClasses;
    if (isDef(transitionClass)) {
        cls = concat(cls, stringifyClass(transitionClass));
    }
    // set the class
    if (cls !== el._prevClass) {
        el.setAttribute('class', cls);
        el._prevClass = cls;
    }
}
var klass = {
    create: updateClass,
    update: updateClass
};

// in some cases, the event used has to be determined at runtime
// so we used some reserved tokens during compile.
var RANGE_TOKEN = '__r';
var CHECKBOX_RADIO_TOKEN = '__c';

// normalize v-model event tokens that can only be determined at runtime.
// it's important to place the event as the first in the array because
// the whole point is ensuring the v-model callback gets called before
// user-attached handlers.
function normalizeEvents(on) {
    /* istanbul ignore if */
    if (isDef(on[RANGE_TOKEN])) {
        // IE input[type=range] only supports `change` event
        var event_1 = isIE ? 'change' : 'input';
        on[event_1] = [].concat(on[RANGE_TOKEN], on[event_1] || []);
        delete on[RANGE_TOKEN];
    }
    // This was originally intended to fix #4521 but no longer necessary
    // after 2.5. Keeping it for backwards compat with generated code from < 2.4
    /* istanbul ignore if */
    if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
        on.change = [].concat(on[CHECKBOX_RADIO_TOKEN], on.change || []);
        delete on[CHECKBOX_RADIO_TOKEN];
    }
}
var target;
function createOnceHandler(event, handler, capture) {
    var _target = target; // save current target element in closure
    return function onceHandler() {
        var res = handler.apply(null, arguments);
        if (res !== null) {
            remove(event, onceHandler, capture, _target);
        }
    };
}
// #9446: Firefox <= 53 (in particular, ESR 52) has incorrect Event.timeStamp
// implementation and does not fire microtasks in between event propagation, so
// safe to exclude.
var useMicrotaskFix = isUsingMicroTask && !(isFF && Number(isFF[1]) <= 53);
function add(name, handler, capture, passive) {
    // async edge case #6566: inner click event triggers patch, event handler
    // attached to outer element during patch, and triggered again. This
    // happens because browsers fire microtask ticks between event propagation.
    // the solution is simple: we save the timestamp when a handler is attached,
    // and the handler would only fire if the event passed to it was fired
    // AFTER it was attached.
    if (useMicrotaskFix) {
        var attachedTimestamp_1 = currentFlushTimestamp;
        var original_1 = handler;
        //@ts-expect-error
        handler = original_1._wrapper = function (e) {
            if (
            // no bubbling, should always fire.
            // this is just a safety net in case event.timeStamp is unreliable in
            // certain weird environments...
            e.target === e.currentTarget ||
                // event is fired after handler attachment
                e.timeStamp >= attachedTimestamp_1 ||
                // bail for environments that have buggy event.timeStamp implementations
                // #9462 iOS 9 bug: event.timeStamp is 0 after history.pushState
                // #9681 QtWebEngine event.timeStamp is negative value
                e.timeStamp <= 0 ||
                // #9448 bail if event is fired in another document in a multi-page
                // electron/nw.js app, since event.timeStamp will be using a different
                // starting reference
                e.target.ownerDocument !== document) {
                return original_1.apply(this, arguments);
            }
        };
    }
    target.addEventListener(name, handler, supportsPassive ? { capture: capture, passive: passive } : capture);
}
function remove(name, handler, capture, _target) {
    (_target || target).removeEventListener(name, 
    //@ts-expect-error
    handler._wrapper || handler, capture);
}
function updateDOMListeners(oldVnode, vnode) {
    if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
        return;
    }
    var on = vnode.data.on || {};
    var oldOn = oldVnode.data.on || {};
    // vnode is empty when removing all listeners,
    // and use old vnode dom element
    target = vnode.elm || oldVnode.elm;
    normalizeEvents(on);
    updateListeners(on, oldOn, add, remove, createOnceHandler, vnode.context);
    target = undefined;
}
var events = {
    create: updateDOMListeners,
    update: updateDOMListeners,
    // @ts-expect-error emptyNode has actually data
    destroy: function (vnode) { return updateDOMListeners(vnode, emptyNode); }
};

var svgContainer;
function updateDOMProps(oldVnode, vnode) {
    if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
        return;
    }
    var key, cur;
    var elm = vnode.elm;
    var oldProps = oldVnode.data.domProps || {};
    var props = vnode.data.domProps || {};
    // clone observed objects, as the user probably wants to mutate it
    if (isDef(props.__ob__) || isTrue(props._v_attr_proxy)) {
        props = vnode.data.domProps = extend({}, props);
    }
    for (key in oldProps) {
        if (!(key in props)) {
            elm[key] = '';
        }
    }
    for (key in props) {
        cur = props[key];
        // ignore children if the node has textContent or innerHTML,
        // as these will throw away existing DOM nodes and cause removal errors
        // on subsequent patches (#3360)
        if (key === 'textContent' || key === 'innerHTML') {
            if (vnode.children)
                vnode.children.length = 0;
            if (cur === oldProps[key])
                continue;
            // #6601 work around Chrome version <= 55 bug where single textNode
            // replaced by innerHTML/textContent retains its parentNode property
            if (elm.childNodes.length === 1) {
                elm.removeChild(elm.childNodes[0]);
            }
        }
        if (key === 'value' && elm.tagName !== 'PROGRESS') {
            // store value as _value as well since
            // non-string values will be stringified
            elm._value = cur;
            // avoid resetting cursor position when value is the same
            var strCur = isUndef(cur) ? '' : String(cur);
            if (shouldUpdateValue(elm, strCur)) {
                elm.value = strCur;
            }
        }
        else if (key === 'innerHTML' &&
            isSVG(elm.tagName) &&
            isUndef(elm.innerHTML)) {
            // IE doesn't support innerHTML for SVG elements
            svgContainer = svgContainer || document.createElement('div');
            svgContainer.innerHTML = "<svg>".concat(cur, "</svg>");
            var svg = svgContainer.firstChild;
            while (elm.firstChild) {
                elm.removeChild(elm.firstChild);
            }
            while (svg.firstChild) {
                elm.appendChild(svg.firstChild);
            }
        }
        else if (
        // skip the update if old and new VDOM state is the same.
        // `value` is handled separately because the DOM value may be temporarily
        // out of sync with VDOM state due to focus, composition and modifiers.
        // This  #4521 by skipping the unnecessary `checked` update.
        cur !== oldProps[key]) {
            // some property updates can throw
            // e.g. `value` on <progress> w/ non-finite value
            try {
                elm[key] = cur;
            }
            catch (e) { }
        }
    }
}
function shouldUpdateValue(elm, checkVal) {
    return (
    //@ts-expect-error
    !elm.composing &&
        (elm.tagName === 'OPTION' ||
            isNotInFocusAndDirty(elm, checkVal) ||
            isDirtyWithModifiers(elm, checkVal)));
}
function isNotInFocusAndDirty(elm, checkVal) {
    // return true when textbox (.number and .trim) loses focus and its value is
    // not equal to the updated value
    var notInFocus = true;
    // #6157
    // work around IE bug when accessing document.activeElement in an iframe
    try {
        notInFocus = document.activeElement !== elm;
    }
    catch (e) { }
    return notInFocus && elm.value !== checkVal;
}
function isDirtyWithModifiers(elm, newVal) {
    var value = elm.value;
    var modifiers = elm._vModifiers; // injected by v-model runtime
    if (isDef(modifiers)) {
        if (modifiers.number) {
            return toNumber(value) !== toNumber(newVal);
        }
        if (modifiers.trim) {
            return value.trim() !== newVal.trim();
        }
    }
    return value !== newVal;
}
var domProps = {
    create: updateDOMProps,
    update: updateDOMProps
};

var parseStyleText = cached(function (cssText) {
    var res = {};
    var listDelimiter = /;(?![^(]*\))/g;
    var propertyDelimiter = /:(.+)/;
    cssText.split(listDelimiter).forEach(function (item) {
        if (item) {
            var tmp = item.split(propertyDelimiter);
            tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
        }
    });
    return res;
});
// merge static and dynamic style data on the same vnode
function normalizeStyleData(data) {
    var style = normalizeStyleBinding(data.style);
    // static style is pre-processed into an object during compilation
    // and is always a fresh object, so it's safe to merge into it
    return data.staticStyle ? extend(data.staticStyle, style) : style;
}
// normalize possible array / string values into Object
function normalizeStyleBinding(bindingStyle) {
    if (Array.isArray(bindingStyle)) {
        return toObject(bindingStyle);
    }
    if (typeof bindingStyle === 'string') {
        return parseStyleText(bindingStyle);
    }
    return bindingStyle;
}
/**
 * parent component style should be after child's
 * so that parent component's style could override it
 */
function getStyle(vnode, checkChild) {
    var res = {};
    var styleData;
    if (checkChild) {
        var childNode = vnode;
        while (childNode.componentInstance) {
            childNode = childNode.componentInstance._vnode;
            if (childNode &&
                childNode.data &&
                (styleData = normalizeStyleData(childNode.data))) {
                extend(res, styleData);
            }
        }
    }
    if ((styleData = normalizeStyleData(vnode.data))) {
        extend(res, styleData);
    }
    var parentNode = vnode;
    // @ts-expect-error parentNode.parent not VNodeWithData
    while ((parentNode = parentNode.parent)) {
        if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
            extend(res, styleData);
        }
    }
    return res;
}

var cssVarRE = /^--/;
var importantRE = /\s*!important$/;
var setProp = function (el, name, val) {
    /* istanbul ignore if */
    if (cssVarRE.test(name)) {
        el.style.setProperty(name, val);
    }
    else if (importantRE.test(val)) {
        el.style.setProperty(hyphenate(name), val.replace(importantRE, ''), 'important');
    }
    else {
        var normalizedName = normalize(name);
        if (Array.isArray(val)) {
            // Support values array created by autoprefixer, e.g.
            // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
            // Set them one by one, and the browser will only set those it can recognize
            for (var i = 0, len = val.length; i < len; i++) {
                el.style[normalizedName] = val[i];
            }
        }
        else {
            el.style[normalizedName] = val;
        }
    }
};
var vendorNames = ['Webkit', 'Moz', 'ms'];
var emptyStyle;
var normalize = cached(function (prop) {
    emptyStyle = emptyStyle || document.createElement('div').style;
    prop = camelize(prop);
    if (prop !== 'filter' && prop in emptyStyle) {
        return prop;
    }
    var capName = prop.charAt(0).toUpperCase() + prop.slice(1);
    for (var i = 0; i < vendorNames.length; i++) {
        var name_1 = vendorNames[i] + capName;
        if (name_1 in emptyStyle) {
            return name_1;
        }
    }
});
function updateStyle(oldVnode, vnode) {
    var data = vnode.data;
    var oldData = oldVnode.data;
    if (isUndef(data.staticStyle) &&
        isUndef(data.style) &&
        isUndef(oldData.staticStyle) &&
        isUndef(oldData.style)) {
        return;
    }
    var cur, name;
    var el = vnode.elm;
    var oldStaticStyle = oldData.staticStyle;
    var oldStyleBinding = oldData.normalizedStyle || oldData.style || {};
    // if static style exists, stylebinding already merged into it when doing normalizeStyleData
    var oldStyle = oldStaticStyle || oldStyleBinding;
    var style = normalizeStyleBinding(vnode.data.style) || {};
    // store normalized style under a different key for next diff
    // make sure to clone it if it's reactive, since the user likely wants
    // to mutate it.
    vnode.data.normalizedStyle = isDef(style.__ob__) ? extend({}, style) : style;
    var newStyle = getStyle(vnode, true);
    for (name in oldStyle) {
        if (isUndef(newStyle[name])) {
            setProp(el, name, '');
        }
    }
    for (name in newStyle) {
        cur = newStyle[name];
        // ie9 setting to null has no effect, must use empty string
        setProp(el, name, cur == null ? '' : cur);
    }
}
var style = {
    create: updateStyle,
    update: updateStyle
};

var whitespaceRE = /\s+/;
/**
 * Add class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function addClass(el, cls) {
    /* istanbul ignore if */
    if (!cls || !(cls = cls.trim())) {
        return;
    }
    /* istanbul ignore else */
    if (el.classList) {
        if (cls.indexOf(' ') > -1) {
            cls.split(whitespaceRE).forEach(function (c) { return el.classList.add(c); });
        }
        else {
            el.classList.add(cls);
        }
    }
    else {
        var cur = " ".concat(el.getAttribute('class') || '', " ");
        if (cur.indexOf(' ' + cls + ' ') < 0) {
            el.setAttribute('class', (cur + cls).trim());
        }
    }
}
/**
 * Remove class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function removeClass(el, cls) {
    /* istanbul ignore if */
    if (!cls || !(cls = cls.trim())) {
        return;
    }
    /* istanbul ignore else */
    if (el.classList) {
        if (cls.indexOf(' ') > -1) {
            cls.split(whitespaceRE).forEach(function (c) { return el.classList.remove(c); });
        }
        else {
            el.classList.remove(cls);
        }
        if (!el.classList.length) {
            el.removeAttribute('class');
        }
    }
    else {
        var cur = " ".concat(el.getAttribute('class') || '', " ");
        var tar = ' ' + cls + ' ';
        while (cur.indexOf(tar) >= 0) {
            cur = cur.replace(tar, ' ');
        }
        cur = cur.trim();
        if (cur) {
            el.setAttribute('class', cur);
        }
        else {
            el.removeAttribute('class');
        }
    }
}

function resolveTransition(def) {
    if (!def) {
        return;
    }
    /* istanbul ignore else */
    if (typeof def === 'object') {
        var res = {};
        if (def.css !== false) {
            extend(res, autoCssTransition(def.name || 'v'));
        }
        extend(res, def);
        return res;
    }
    else if (typeof def === 'string') {
        return autoCssTransition(def);
    }
}
var autoCssTransition = cached(function (name) {
    return {
        enterClass: "".concat(name, "-enter"),
        enterToClass: "".concat(name, "-enter-to"),
        enterActiveClass: "".concat(name, "-enter-active"),
        leaveClass: "".concat(name, "-leave"),
        leaveToClass: "".concat(name, "-leave-to"),
        leaveActiveClass: "".concat(name, "-leave-active")
    };
});
var hasTransition = inBrowser && !isIE9;
var TRANSITION = 'transition';
var ANIMATION = 'animation';
// Transition property/event sniffing
var transitionProp = 'transition';
var transitionEndEvent = 'transitionend';
var animationProp = 'animation';
var animationEndEvent = 'animationend';
if (hasTransition) {
    /* istanbul ignore if */
    if (window.ontransitionend === undefined &&
        window.onwebkittransitionend !== undefined) {
        transitionProp = 'WebkitTransition';
        transitionEndEvent = 'webkitTransitionEnd';
    }
    if (window.onanimationend === undefined &&
        window.onwebkitanimationend !== undefined) {
        animationProp = 'WebkitAnimation';
        animationEndEvent = 'webkitAnimationEnd';
    }
}
// binding to window is necessary to make hot reload work in IE in strict mode
var raf = inBrowser
    ? window.requestAnimationFrame
        ? window.requestAnimationFrame.bind(window)
        : setTimeout
    : /* istanbul ignore next */ function (/* istanbul ignore next */ fn) { return fn(); };
function nextFrame(fn) {
    raf(function () {
        // @ts-expect-error
        raf(fn);
    });
}
function addTransitionClass(el, cls) {
    var transitionClasses = el._transitionClasses || (el._transitionClasses = []);
    if (transitionClasses.indexOf(cls) < 0) {
        transitionClasses.push(cls);
        addClass(el, cls);
    }
}
function removeTransitionClass(el, cls) {
    if (el._transitionClasses) {
        remove$2(el._transitionClasses, cls);
    }
    removeClass(el, cls);
}
function whenTransitionEnds(el, expectedType, cb) {
    var _a = getTransitionInfo(el, expectedType), type = _a.type, timeout = _a.timeout, propCount = _a.propCount;
    if (!type)
        return cb();
    var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
    var ended = 0;
    var end = function () {
        el.removeEventListener(event, onEnd);
        cb();
    };
    var onEnd = function (e) {
        if (e.target === el) {
            if (++ended >= propCount) {
                end();
            }
        }
    };
    setTimeout(function () {
        if (ended < propCount) {
            end();
        }
    }, timeout + 1);
    el.addEventListener(event, onEnd);
}
var transformRE = /\b(transform|all)(,|$)/;
function getTransitionInfo(el, expectedType) {
    var styles = window.getComputedStyle(el);
    // JSDOM may return undefined for transition properties
    var transitionDelays = (styles[transitionProp + 'Delay'] || '').split(', ');
    var transitionDurations = (styles[transitionProp + 'Duration'] || '').split(', ');
    var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
    var animationDelays = (styles[animationProp + 'Delay'] || '').split(', ');
    var animationDurations = (styles[animationProp + 'Duration'] || '').split(', ');
    var animationTimeout = getTimeout(animationDelays, animationDurations);
    var type;
    var timeout = 0;
    var propCount = 0;
    /* istanbul ignore if */
    if (expectedType === TRANSITION) {
        if (transitionTimeout > 0) {
            type = TRANSITION;
            timeout = transitionTimeout;
            propCount = transitionDurations.length;
        }
    }
    else if (expectedType === ANIMATION) {
        if (animationTimeout > 0) {
            type = ANIMATION;
            timeout = animationTimeout;
            propCount = animationDurations.length;
        }
    }
    else {
        timeout = Math.max(transitionTimeout, animationTimeout);
        type =
            timeout > 0
                ? transitionTimeout > animationTimeout
                    ? TRANSITION
                    : ANIMATION
                : null;
        propCount = type
            ? type === TRANSITION
                ? transitionDurations.length
                : animationDurations.length
            : 0;
    }
    var hasTransform = type === TRANSITION && transformRE.test(styles[transitionProp + 'Property']);
    return {
        type: type,
        timeout: timeout,
        propCount: propCount,
        hasTransform: hasTransform
    };
}
function getTimeout(delays, durations) {
    /* istanbul ignore next */
    while (delays.length < durations.length) {
        delays = delays.concat(delays);
    }
    return Math.max.apply(null, durations.map(function (d, i) {
        return toMs(d) + toMs(delays[i]);
    }));
}
// Old versions of Chromium (below 61.0.3163.100) formats floating pointer numbers
// in a locale-dependent way, using a comma instead of a dot.
// If comma is not replaced with a dot, the input will be rounded down (i.e. acting
// as a floor function) causing unexpected behaviors
function toMs(s) {
    return Number(s.slice(0, -1).replace(',', '.')) * 1000;
}

function enter(vnode, toggleDisplay) {
    var el = vnode.elm;
    // call leave callback now
    if (isDef(el._leaveCb)) {
        el._leaveCb.cancelled = true;
        el._leaveCb();
    }
    var data = resolveTransition(vnode.data.transition);
    if (isUndef(data)) {
        return;
    }
    /* istanbul ignore if */
    if (isDef(el._enterCb) || el.nodeType !== 1) {
        return;
    }
    var css = data.css, type = data.type, enterClass = data.enterClass, enterToClass = data.enterToClass, enterActiveClass = data.enterActiveClass, appearClass = data.appearClass, appearToClass = data.appearToClass, appearActiveClass = data.appearActiveClass, beforeEnter = data.beforeEnter, enter = data.enter, afterEnter = data.afterEnter, enterCancelled = data.enterCancelled, beforeAppear = data.beforeAppear, appear = data.appear, afterAppear = data.afterAppear, appearCancelled = data.appearCancelled, duration = data.duration;
    // activeInstance will always be the <transition> component managing this
    // transition. One edge case to check is when the <transition> is placed
    // as the root node of a child component. In that case we need to check
    // <transition>'s parent for appear check.
    var context = activeInstance;
    var transitionNode = activeInstance.$vnode;
    while (transitionNode && transitionNode.parent) {
        context = transitionNode.context;
        transitionNode = transitionNode.parent;
    }
    var isAppear = !context._isMounted || !vnode.isRootInsert;
    if (isAppear && !appear && appear !== '') {
        return;
    }
    var startClass = isAppear && appearClass ? appearClass : enterClass;
    var activeClass = isAppear && appearActiveClass ? appearActiveClass : enterActiveClass;
    var toClass = isAppear && appearToClass ? appearToClass : enterToClass;
    var beforeEnterHook = isAppear ? beforeAppear || beforeEnter : beforeEnter;
    var enterHook = isAppear ? (isFunction(appear) ? appear : enter) : enter;
    var afterEnterHook = isAppear ? afterAppear || afterEnter : afterEnter;
    var enterCancelledHook = isAppear
        ? appearCancelled || enterCancelled
        : enterCancelled;
    var explicitEnterDuration = toNumber(isObject(duration) ? duration.enter : duration);
    if (false) {
        checkDuration(explicitEnterDuration, 'enter', vnode);
    }
    var expectsCSS = css !== false && !isIE9;
    var userWantsControl = getHookArgumentsLength(enterHook);
    var cb = (el._enterCb = once(function () {
        if (expectsCSS) {
            removeTransitionClass(el, toClass);
            removeTransitionClass(el, activeClass);
        }
        // @ts-expect-error
        if (cb.cancelled) {
            if (expectsCSS) {
                removeTransitionClass(el, startClass);
            }
            enterCancelledHook && enterCancelledHook(el);
        }
        else {
            afterEnterHook && afterEnterHook(el);
        }
        el._enterCb = null;
    }));
    if (!vnode.data.show) {
        // remove pending leave element on enter by injecting an insert hook
        mergeVNodeHook(vnode, 'insert', function () {
            var parent = el.parentNode;
            var pendingNode = parent && parent._pending && parent._pending[vnode.key];
            if (pendingNode &&
                pendingNode.tag === vnode.tag &&
                pendingNode.elm._leaveCb) {
                pendingNode.elm._leaveCb();
            }
            enterHook && enterHook(el, cb);
        });
    }
    // start enter transition
    beforeEnterHook && beforeEnterHook(el);
    if (expectsCSS) {
        addTransitionClass(el, startClass);
        addTransitionClass(el, activeClass);
        nextFrame(function () {
            removeTransitionClass(el, startClass);
            // @ts-expect-error
            if (!cb.cancelled) {
                addTransitionClass(el, toClass);
                if (!userWantsControl) {
                    if (isValidDuration(explicitEnterDuration)) {
                        setTimeout(cb, explicitEnterDuration);
                    }
                    else {
                        whenTransitionEnds(el, type, cb);
                    }
                }
            }
        });
    }
    if (vnode.data.show) {
        toggleDisplay && toggleDisplay();
        enterHook && enterHook(el, cb);
    }
    if (!expectsCSS && !userWantsControl) {
        cb();
    }
}
function leave(vnode, rm) {
    var el = vnode.elm;
    // call enter callback now
    if (isDef(el._enterCb)) {
        el._enterCb.cancelled = true;
        el._enterCb();
    }
    var data = resolveTransition(vnode.data.transition);
    if (isUndef(data) || el.nodeType !== 1) {
        return rm();
    }
    /* istanbul ignore if */
    if (isDef(el._leaveCb)) {
        return;
    }
    var css = data.css, type = data.type, leaveClass = data.leaveClass, leaveToClass = data.leaveToClass, leaveActiveClass = data.leaveActiveClass, beforeLeave = data.beforeLeave, leave = data.leave, afterLeave = data.afterLeave, leaveCancelled = data.leaveCancelled, delayLeave = data.delayLeave, duration = data.duration;
    var expectsCSS = css !== false && !isIE9;
    var userWantsControl = getHookArgumentsLength(leave);
    var explicitLeaveDuration = toNumber(isObject(duration) ? duration.leave : duration);
    if (false) {
        checkDuration(explicitLeaveDuration, 'leave', vnode);
    }
    var cb = (el._leaveCb = once(function () {
        if (el.parentNode && el.parentNode._pending) {
            el.parentNode._pending[vnode.key] = null;
        }
        if (expectsCSS) {
            removeTransitionClass(el, leaveToClass);
            removeTransitionClass(el, leaveActiveClass);
        }
        // @ts-expect-error
        if (cb.cancelled) {
            if (expectsCSS) {
                removeTransitionClass(el, leaveClass);
            }
            leaveCancelled && leaveCancelled(el);
        }
        else {
            rm();
            afterLeave && afterLeave(el);
        }
        el._leaveCb = null;
    }));
    if (delayLeave) {
        delayLeave(performLeave);
    }
    else {
        performLeave();
    }
    function performLeave() {
        // the delayed leave may have already been cancelled
        // @ts-expect-error
        if (cb.cancelled) {
            return;
        }
        // record leaving element
        if (!vnode.data.show && el.parentNode) {
            (el.parentNode._pending || (el.parentNode._pending = {}))[vnode.key] =
                vnode;
        }
        beforeLeave && beforeLeave(el);
        if (expectsCSS) {
            addTransitionClass(el, leaveClass);
            addTransitionClass(el, leaveActiveClass);
            nextFrame(function () {
                removeTransitionClass(el, leaveClass);
                // @ts-expect-error
                if (!cb.cancelled) {
                    addTransitionClass(el, leaveToClass);
                    if (!userWantsControl) {
                        if (isValidDuration(explicitLeaveDuration)) {
                            setTimeout(cb, explicitLeaveDuration);
                        }
                        else {
                            whenTransitionEnds(el, type, cb);
                        }
                    }
                }
            });
        }
        leave && leave(el, cb);
        if (!expectsCSS && !userWantsControl) {
            cb();
        }
    }
}
// only used in dev mode
function checkDuration(val, name, vnode) {
    if (typeof val !== 'number') {
        warn("<transition> explicit ".concat(name, " duration is not a valid number - ") +
            "got ".concat(JSON.stringify(val), "."), vnode.context);
    }
    else if (isNaN(val)) {
        warn("<transition> explicit ".concat(name, " duration is NaN - ") +
            'the duration expression might be incorrect.', vnode.context);
    }
}
function isValidDuration(val) {
    return typeof val === 'number' && !isNaN(val);
}
/**
 * Normalize a transition hook's argument length. The hook may be:
 * - a merged hook (invoker) with the original in .fns
 * - a wrapped component method (check ._length)
 * - a plain function (.length)
 */
function getHookArgumentsLength(fn) {
    if (isUndef(fn)) {
        return false;
    }
    // @ts-expect-error
    var invokerFns = fn.fns;
    if (isDef(invokerFns)) {
        // invoker
        return getHookArgumentsLength(Array.isArray(invokerFns) ? invokerFns[0] : invokerFns);
    }
    else {
        // @ts-expect-error
        return (fn._length || fn.length) > 1;
    }
}
function _enter(_, vnode) {
    if (vnode.data.show !== true) {
        enter(vnode);
    }
}
var transition = inBrowser
    ? {
        create: _enter,
        activate: _enter,
        remove: function (vnode, rm) {
            /* istanbul ignore else */
            if (vnode.data.show !== true) {
                // @ts-expect-error
                leave(vnode, rm);
            }
            else {
                rm();
            }
        }
    }
    : {};

var platformModules = [attrs, klass, events, domProps, style, transition];

// the directive module should be applied last, after all
// built-in modules have been applied.
var modules = platformModules.concat(baseModules);
var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });

/**
 * Not type checking this file because flow doesn't like attaching
 * properties to Elements.
 */
/* istanbul ignore if */
if (isIE9) {
    // http://www.matts411.com/post/internet-explorer-9-oninput/
    document.addEventListener('selectionchange', function () {
        var el = document.activeElement;
        // @ts-expect-error
        if (el && el.vmodel) {
            trigger(el, 'input');
        }
    });
}
var directive = {
    inserted: function (el, binding, vnode, oldVnode) {
        if (vnode.tag === 'select') {
            // #6903
            if (oldVnode.elm && !oldVnode.elm._vOptions) {
                mergeVNodeHook(vnode, 'postpatch', function () {
                    directive.componentUpdated(el, binding, vnode);
                });
            }
            else {
                setSelected(el, binding, vnode.context);
            }
            el._vOptions = [].map.call(el.options, getValue);
        }
        else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
            el._vModifiers = binding.modifiers;
            if (!binding.modifiers.lazy) {
                el.addEventListener('compositionstart', onCompositionStart);
                el.addEventListener('compositionend', onCompositionEnd);
                // Safari < 10.2 & UIWebView doesn't fire compositionend when
                // switching focus before confirming composition choice
                // this also fixes the issue where some browsers e.g. iOS Chrome
                // fires "change" instead of "input" on autocomplete.
                el.addEventListener('change', onCompositionEnd);
                /* istanbul ignore if */
                if (isIE9) {
                    el.vmodel = true;
                }
            }
        }
    },
    componentUpdated: function (el, binding, vnode) {
        if (vnode.tag === 'select') {
            setSelected(el, binding, vnode.context);
            // in case the options rendered by v-for have changed,
            // it's possible that the value is out-of-sync with the rendered options.
            // detect such cases and filter out values that no longer has a matching
            // option in the DOM.
            var prevOptions_1 = el._vOptions;
            var curOptions_1 = (el._vOptions = [].map.call(el.options, getValue));
            if (curOptions_1.some(function (o, i) { return !looseEqual(o, prevOptions_1[i]); })) {
                // trigger change event if
                // no matching option found for at least one value
                var needReset = el.multiple
                    ? binding.value.some(function (v) { return hasNoMatchingOption(v, curOptions_1); })
                    : binding.value !== binding.oldValue &&
                        hasNoMatchingOption(binding.value, curOptions_1);
                if (needReset) {
                    trigger(el, 'change');
                }
            }
        }
    }
};
function setSelected(el, binding, vm) {
    actuallySetSelected(el, binding, vm);
    /* istanbul ignore if */
    if (isIE || isEdge) {
        setTimeout(function () {
            actuallySetSelected(el, binding, vm);
        }, 0);
    }
}
function actuallySetSelected(el, binding, vm) {
    var value = binding.value;
    var isMultiple = el.multiple;
    if (isMultiple && !Array.isArray(value)) {
        "production" !== 'production' &&
            warn("<select multiple v-model=\"".concat(binding.expression, "\"> ") +
                "expects an Array value for its binding, but got ".concat(Object.prototype.toString
                    .call(value)
                    .slice(8, -1)), vm);
        return;
    }
    var selected, option;
    for (var i = 0, l = el.options.length; i < l; i++) {
        option = el.options[i];
        if (isMultiple) {
            selected = looseIndexOf(value, getValue(option)) > -1;
            if (option.selected !== selected) {
                option.selected = selected;
            }
        }
        else {
            if (looseEqual(getValue(option), value)) {
                if (el.selectedIndex !== i) {
                    el.selectedIndex = i;
                }
                return;
            }
        }
    }
    if (!isMultiple) {
        el.selectedIndex = -1;
    }
}
function hasNoMatchingOption(value, options) {
    return options.every(function (o) { return !looseEqual(o, value); });
}
function getValue(option) {
    return '_value' in option ? option._value : option.value;
}
function onCompositionStart(e) {
    e.target.composing = true;
}
function onCompositionEnd(e) {
    // prevent triggering an input event for no reason
    if (!e.target.composing)
        return;
    e.target.composing = false;
    trigger(e.target, 'input');
}
function trigger(el, type) {
    var e = document.createEvent('HTMLEvents');
    e.initEvent(type, true, true);
    el.dispatchEvent(e);
}

// recursively search for possible transition defined inside the component root
function locateNode(vnode) {
    // @ts-expect-error
    return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
        ? locateNode(vnode.componentInstance._vnode)
        : vnode;
}
var show = {
    bind: function (el, _a, vnode) {
        var value = _a.value;
        vnode = locateNode(vnode);
        var transition = vnode.data && vnode.data.transition;
        var originalDisplay = (el.__vOriginalDisplay =
            el.style.display === 'none' ? '' : el.style.display);
        if (value && transition) {
            vnode.data.show = true;
            enter(vnode, function () {
                el.style.display = originalDisplay;
            });
        }
        else {
            el.style.display = value ? originalDisplay : 'none';
        }
    },
    update: function (el, _a, vnode) {
        var value = _a.value, oldValue = _a.oldValue;
        /* istanbul ignore if */
        if (!value === !oldValue)
            return;
        vnode = locateNode(vnode);
        var transition = vnode.data && vnode.data.transition;
        if (transition) {
            vnode.data.show = true;
            if (value) {
                enter(vnode, function () {
                    el.style.display = el.__vOriginalDisplay;
                });
            }
            else {
                leave(vnode, function () {
                    el.style.display = 'none';
                });
            }
        }
        else {
            el.style.display = value ? el.__vOriginalDisplay : 'none';
        }
    },
    unbind: function (el, binding, vnode, oldVnode, isDestroy) {
        if (!isDestroy) {
            el.style.display = el.__vOriginalDisplay;
        }
    }
};

var platformDirectives = {
    model: directive,
    show: show
};

// Provides transition support for a single element/component.
var transitionProps = {
    name: String,
    appear: Boolean,
    css: Boolean,
    mode: String,
    type: String,
    enterClass: String,
    leaveClass: String,
    enterToClass: String,
    leaveToClass: String,
    enterActiveClass: String,
    leaveActiveClass: String,
    appearClass: String,
    appearActiveClass: String,
    appearToClass: String,
    duration: [Number, String, Object]
};
// in case the child is also an abstract component, e.g. <keep-alive>
// we want to recursively retrieve the real component to be rendered
function getRealChild(vnode) {
    var compOptions = vnode && vnode.componentOptions;
    if (compOptions && compOptions.Ctor.options.abstract) {
        return getRealChild(getFirstComponentChild(compOptions.children));
    }
    else {
        return vnode;
    }
}
function extractTransitionData(comp) {
    var data = {};
    var options = comp.$options;
    // props
    for (var key in options.propsData) {
        data[key] = comp[key];
    }
    // events.
    // extract listeners and pass them directly to the transition methods
    var listeners = options._parentListeners;
    for (var key in listeners) {
        data[camelize(key)] = listeners[key];
    }
    return data;
}
function placeholder(h, rawChild) {
    // @ts-expect-error
    if (/\d-keep-alive$/.test(rawChild.tag)) {
        return h('keep-alive', {
            props: rawChild.componentOptions.propsData
        });
    }
}
function hasParentTransition(vnode) {
    while ((vnode = vnode.parent)) {
        if (vnode.data.transition) {
            return true;
        }
    }
}
function isSameChild(child, oldChild) {
    return oldChild.key === child.key && oldChild.tag === child.tag;
}
var isNotTextNode = function (c) { return c.tag || isAsyncPlaceholder(c); };
var isVShowDirective = function (d) { return d.name === 'show'; };
var Transition = {
    name: 'transition',
    props: transitionProps,
    abstract: true,
    render: function (h) {
        var _this = this;
        var children = this.$slots.default;
        if (!children) {
            return;
        }
        // filter out text nodes (possible whitespaces)
        children = children.filter(isNotTextNode);
        /* istanbul ignore if */
        if (!children.length) {
            return;
        }
        // warn multiple elements
        if (false) {
            warn('<transition> can only be used on a single element. Use ' +
                '<transition-group> for lists.', this.$parent);
        }
        var mode = this.mode;
        // warn invalid mode
        if (false) {
            warn('invalid <transition> mode: ' + mode, this.$parent);
        }
        var rawChild = children[0];
        // if this is a component root node and the component's
        // parent container node also has transition, skip.
        if (hasParentTransition(this.$vnode)) {
            return rawChild;
        }
        // apply transition data to child
        // use getRealChild() to ignore abstract components e.g. keep-alive
        var child = getRealChild(rawChild);
        /* istanbul ignore if */
        if (!child) {
            return rawChild;
        }
        if (this._leaving) {
            return placeholder(h, rawChild);
        }
        // ensure a key that is unique to the vnode type and to this transition
        // component instance. This key will be used to remove pending leaving nodes
        // during entering.
        var id = "__transition-".concat(this._uid, "-");
        child.key =
            child.key == null
                ? child.isComment
                    ? id + 'comment'
                    : id + child.tag
                : isPrimitive(child.key)
                    ? String(child.key).indexOf(id) === 0
                        ? child.key
                        : id + child.key
                    : child.key;
        var data = ((child.data || (child.data = {})).transition =
            extractTransitionData(this));
        var oldRawChild = this._vnode;
        var oldChild = getRealChild(oldRawChild);
        // mark v-show
        // so that the transition module can hand over the control to the directive
        if (child.data.directives && child.data.directives.some(isVShowDirective)) {
            child.data.show = true;
        }
        if (oldChild &&
            oldChild.data &&
            !isSameChild(child, oldChild) &&
            !isAsyncPlaceholder(oldChild) &&
            // #6687 component root is a comment node
            !(oldChild.componentInstance &&
                oldChild.componentInstance._vnode.isComment)) {
            // replace old child transition data with fresh one
            // important for dynamic transitions!
            var oldData = (oldChild.data.transition = extend({}, data));
            // handle transition mode
            if (mode === 'out-in') {
                // return placeholder node and queue update when leave finishes
                this._leaving = true;
                mergeVNodeHook(oldData, 'afterLeave', function () {
                    _this._leaving = false;
                    _this.$forceUpdate();
                });
                return placeholder(h, rawChild);
            }
            else if (mode === 'in-out') {
                if (isAsyncPlaceholder(child)) {
                    return oldRawChild;
                }
                var delayedLeave_1;
                var performLeave = function () {
                    delayedLeave_1();
                };
                mergeVNodeHook(data, 'afterEnter', performLeave);
                mergeVNodeHook(data, 'enterCancelled', performLeave);
                mergeVNodeHook(oldData, 'delayLeave', function (leave) {
                    delayedLeave_1 = leave;
                });
            }
        }
        return rawChild;
    }
};

// Provides transition support for list items.
var props = extend({
    tag: String,
    moveClass: String
}, transitionProps);
delete props.mode;
var TransitionGroup = {
    props: props,
    beforeMount: function () {
        var _this = this;
        var update = this._update;
        this._update = function (vnode, hydrating) {
            var restoreActiveInstance = setActiveInstance(_this);
            // force removing pass
            _this.__patch__(_this._vnode, _this.kept, false, // hydrating
            true // removeOnly (!important, avoids unnecessary moves)
            );
            _this._vnode = _this.kept;
            restoreActiveInstance();
            update.call(_this, vnode, hydrating);
        };
    },
    render: function (h) {
        var tag = this.tag || this.$vnode.data.tag || 'span';
        var map = Object.create(null);
        var prevChildren = (this.prevChildren = this.children);
        var rawChildren = this.$slots.default || [];
        var children = (this.children = []);
        var transitionData = extractTransitionData(this);
        for (var i = 0; i < rawChildren.length; i++) {
            var c = rawChildren[i];
            if (c.tag) {
                if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
                    children.push(c);
                    map[c.key] = c;
                    (c.data || (c.data = {})).transition = transitionData;
                }
                else if (false) {
                    var opts = c.componentOptions;
                    var name_1 = opts
                        ? getComponentName(opts.Ctor.options) || opts.tag || ''
                        : c.tag;
                    warn("<transition-group> children must be keyed: <".concat(name_1, ">"));
                }
            }
        }
        if (prevChildren) {
            var kept = [];
            var removed = [];
            for (var i = 0; i < prevChildren.length; i++) {
                var c = prevChildren[i];
                c.data.transition = transitionData;
                // @ts-expect-error .getBoundingClientRect is not typed in Node
                c.data.pos = c.elm.getBoundingClientRect();
                if (map[c.key]) {
                    kept.push(c);
                }
                else {
                    removed.push(c);
                }
            }
            this.kept = h(tag, null, kept);
            this.removed = removed;
        }
        return h(tag, null, children);
    },
    updated: function () {
        var children = this.prevChildren;
        var moveClass = this.moveClass || (this.name || 'v') + '-move';
        if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
            return;
        }
        // we divide the work into three loops to avoid mixing DOM reads and writes
        // in each iteration - which helps prevent layout thrashing.
        children.forEach(callPendingCbs);
        children.forEach(recordPosition);
        children.forEach(applyTranslation);
        // force reflow to put everything in position
        // assign to this to avoid being removed in tree-shaking
        // $flow-disable-line
        this._reflow = document.body.offsetHeight;
        children.forEach(function (c) {
            if (c.data.moved) {
                var el_1 = c.elm;
                var s = el_1.style;
                addTransitionClass(el_1, moveClass);
                s.transform = s.WebkitTransform = s.transitionDuration = '';
                el_1.addEventListener(transitionEndEvent, (el_1._moveCb = function cb(e) {
                    if (e && e.target !== el_1) {
                        return;
                    }
                    if (!e || /transform$/.test(e.propertyName)) {
                        el_1.removeEventListener(transitionEndEvent, cb);
                        el_1._moveCb = null;
                        removeTransitionClass(el_1, moveClass);
                    }
                }));
            }
        });
    },
    methods: {
        hasMove: function (el, moveClass) {
            /* istanbul ignore if */
            if (!hasTransition) {
                return false;
            }
            /* istanbul ignore if */
            if (this._hasMove) {
                return this._hasMove;
            }
            // Detect whether an element with the move class applied has
            // CSS transitions. Since the element may be inside an entering
            // transition at this very moment, we make a clone of it and remove
            // all other transition classes applied to ensure only the move class
            // is applied.
            var clone = el.cloneNode();
            if (el._transitionClasses) {
                el._transitionClasses.forEach(function (cls) {
                    removeClass(clone, cls);
                });
            }
            addClass(clone, moveClass);
            clone.style.display = 'none';
            this.$el.appendChild(clone);
            var info = getTransitionInfo(clone);
            this.$el.removeChild(clone);
            return (this._hasMove = info.hasTransform);
        }
    }
};
function callPendingCbs(c) {
    /* istanbul ignore if */
    if (c.elm._moveCb) {
        c.elm._moveCb();
    }
    /* istanbul ignore if */
    if (c.elm._enterCb) {
        c.elm._enterCb();
    }
}
function recordPosition(c) {
    c.data.newPos = c.elm.getBoundingClientRect();
}
function applyTranslation(c) {
    var oldPos = c.data.pos;
    var newPos = c.data.newPos;
    var dx = oldPos.left - newPos.left;
    var dy = oldPos.top - newPos.top;
    if (dx || dy) {
        c.data.moved = true;
        var s = c.elm.style;
        s.transform = s.WebkitTransform = "translate(".concat(dx, "px,").concat(dy, "px)");
        s.transitionDuration = '0s';
    }
}

var platformComponents = {
    Transition: Transition,
    TransitionGroup: TransitionGroup
};

// install platform specific utils
Vue.config.mustUseProp = mustUseProp;
Vue.config.isReservedTag = isReservedTag;
Vue.config.isReservedAttr = isReservedAttr;
Vue.config.getTagNamespace = getTagNamespace;
Vue.config.isUnknownElement = isUnknownElement;
// install platform runtime directives & components
extend(Vue.options.directives, platformDirectives);
extend(Vue.options.components, platformComponents);
// install platform patch function
Vue.prototype.__patch__ = inBrowser ? patch : noop;
// public mount method
Vue.prototype.$mount = function (el, hydrating) {
    el = el && inBrowser ? query(el) : undefined;
    return mountComponent(this, el, hydrating);
};
// devtools global hook
/* istanbul ignore next */
if (inBrowser) {
    setTimeout(function () {
        if (config.devtools) {
            if (devtools) {
                devtools.emit('init', Vue);
            }
            else if (false) {
                // @ts-expect-error
                console[console.info ? 'info' : 'log']('Download the Vue Devtools extension for a better development experience:\n' +
                    'https://github.com/vuejs/vue-devtools');
            }
        }
        if (false) {
            // @ts-expect-error
            console[console.info ? 'info' : 'log']("You are running Vue in development mode.\n" +
                "Make sure to turn on production mode when deploying for production.\n" +
                "See more tips at https://vuejs.org/guide/deployment.html");
        }
    }, 0);
}



/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(13), __webpack_require__(161).setImmediate))

/***/ }),

/***/ 370:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(19);

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ 371:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(19);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
  (function standardBrowserEnv() {
    var msie = /(msie|trident)/i.test(navigator.userAgent);
    var urlParsingNode = document.createElement('a');
    var originURL;

    /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
    function resolveURL(url) {
      var href = url;

      if (msie) {
        // IE needs attribute set twice to normalize properties
        urlParsingNode.setAttribute('href', href);
        href = urlParsingNode.href;
      }

      urlParsingNode.setAttribute('href', href);

      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
                  urlParsingNode.pathname :
                  '/' + urlParsingNode.pathname
      };
    }

    originURL = resolveURL(window.location.href);

    /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
    return function isURLSameOrigin(requestURL) {
      var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
      return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
    };
  })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
      return true;
    };
  })()
);


/***/ }),

/***/ 372:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(19);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
  (function standardBrowserEnv() {
    return {
      write: function write(name, value, expires, path, domain, secure) {
        var cookie = [];
        cookie.push(name + '=' + encodeURIComponent(value));

        if (utils.isNumber(expires)) {
          cookie.push('expires=' + new Date(expires).toGMTString());
        }

        if (utils.isString(path)) {
          cookie.push('path=' + path);
        }

        if (utils.isString(domain)) {
          cookie.push('domain=' + domain);
        }

        if (secure === true) {
          cookie.push('secure');
        }

        document.cookie = cookie.join('; ');
      },

      read: function read(name) {
        var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return (match ? decodeURIComponent(match[3]) : null);
      },

      remove: function remove(name) {
        this.write(name, '', Date.now() - 86400000);
      }
    };
  })() :

  // Non standard browser env (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return {
      write: function write() {},
      read: function read() { return null; },
      remove: function remove() {}
    };
  })()
);


/***/ }),

/***/ 373:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(19);

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ 374:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(19);
var transformData = __webpack_require__(375);
var isCancel = __webpack_require__(165);
var defaults = __webpack_require__(84);
var isAbsoluteURL = __webpack_require__(376);
var combineURLs = __webpack_require__(377);

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Support baseURL config
  if (config.baseURL && !isAbsoluteURL(config.url)) {
    config.url = combineURLs(config.baseURL, config.url);
  }

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers || {}
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ 375:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(19);

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};


/***/ }),

/***/ 376:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ 377:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ 378:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Cancel = __webpack_require__(166);

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ 379:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ 385:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Spine = void 0;
//Using v3.6 - https://github.com/EsotericSoftware/spine-runtimes/blob/3.6/spine-ts/build/spine-canvas.js

var __extends = void 0 && (void 0).__extends || function () {
  var extendStatics = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (d, b) {
    d.__proto__ = b;
  } || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
  };
  return function (d, b) {
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
var spine;
(function (spine) {
  var Animation = function () {
    function Animation(name, timelines, duration) {
      if (name == null) throw new Error("name cannot be null.");
      if (timelines == null) throw new Error("timelines cannot be null.");
      this.name = name;
      this.timelines = timelines;
      this.duration = duration;
    }
    Animation.prototype.apply = function (skeleton, lastTime, time, loop, events, alpha, pose, direction) {
      if (skeleton == null) throw new Error("skeleton cannot be null.");
      if (loop && this.duration != 0) {
        time %= this.duration;
        if (lastTime > 0) lastTime %= this.duration;
      }
      var timelines = this.timelines;
      for (var i = 0, n = timelines.length; i < n; i++) timelines[i].apply(skeleton, lastTime, time, events, alpha, pose, direction);
    };
    Animation.binarySearch = function (values, target, step) {
      if (step === void 0) {
        step = 1;
      }
      var low = 0;
      var high = values.length / step - 2;
      if (high == 0) return step;
      var current = high >>> 1;
      while (true) {
        if (values[(current + 1) * step] <= target) low = current + 1;else high = current;
        if (low == high) return (low + 1) * step;
        current = low + high >>> 1;
      }
    };
    Animation.linearSearch = function (values, target, step) {
      for (var i = 0, last = values.length - step; i <= last; i += step) if (values[i] > target) return i;
      return -1;
    };
    return Animation;
  }();
  spine.Animation = Animation;
  var MixPose;
  (function (MixPose) {
    MixPose[MixPose["setup"] = 0] = "setup";
    MixPose[MixPose["current"] = 1] = "current";
    MixPose[MixPose["currentLayered"] = 2] = "currentLayered";
  })(MixPose = spine.MixPose || (spine.MixPose = {}));
  var MixDirection;
  (function (MixDirection) {
    MixDirection[MixDirection["in"] = 0] = "in";
    MixDirection[MixDirection["out"] = 1] = "out";
  })(MixDirection = spine.MixDirection || (spine.MixDirection = {}));
  var TimelineType;
  (function (TimelineType) {
    TimelineType[TimelineType["rotate"] = 0] = "rotate";
    TimelineType[TimelineType["translate"] = 1] = "translate";
    TimelineType[TimelineType["scale"] = 2] = "scale";
    TimelineType[TimelineType["shear"] = 3] = "shear";
    TimelineType[TimelineType["attachment"] = 4] = "attachment";
    TimelineType[TimelineType["color"] = 5] = "color";
    TimelineType[TimelineType["deform"] = 6] = "deform";
    TimelineType[TimelineType["event"] = 7] = "event";
    TimelineType[TimelineType["drawOrder"] = 8] = "drawOrder";
    TimelineType[TimelineType["ikConstraint"] = 9] = "ikConstraint";
    TimelineType[TimelineType["transformConstraint"] = 10] = "transformConstraint";
    TimelineType[TimelineType["pathConstraintPosition"] = 11] = "pathConstraintPosition";
    TimelineType[TimelineType["pathConstraintSpacing"] = 12] = "pathConstraintSpacing";
    TimelineType[TimelineType["pathConstraintMix"] = 13] = "pathConstraintMix";
    TimelineType[TimelineType["twoColor"] = 14] = "twoColor";
  })(TimelineType = spine.TimelineType || (spine.TimelineType = {}));
  var CurveTimeline = function () {
    function CurveTimeline(frameCount) {
      if (frameCount <= 0) throw new Error("frameCount must be > 0: " + frameCount);
      this.curves = spine.Utils.newFloatArray((frameCount - 1) * CurveTimeline.BEZIER_SIZE);
    }
    CurveTimeline.prototype.getFrameCount = function () {
      return this.curves.length / CurveTimeline.BEZIER_SIZE + 1;
    };
    CurveTimeline.prototype.setLinear = function (frameIndex) {
      this.curves[frameIndex * CurveTimeline.BEZIER_SIZE] = CurveTimeline.LINEAR;
    };
    CurveTimeline.prototype.setStepped = function (frameIndex) {
      this.curves[frameIndex * CurveTimeline.BEZIER_SIZE] = CurveTimeline.STEPPED;
    };
    CurveTimeline.prototype.getCurveType = function (frameIndex) {
      var index = frameIndex * CurveTimeline.BEZIER_SIZE;
      if (index == this.curves.length) return CurveTimeline.LINEAR;
      var type = this.curves[index];
      if (type == CurveTimeline.LINEAR) return CurveTimeline.LINEAR;
      if (type == CurveTimeline.STEPPED) return CurveTimeline.STEPPED;
      return CurveTimeline.BEZIER;
    };
    CurveTimeline.prototype.setCurve = function (frameIndex, cx1, cy1, cx2, cy2) {
      var tmpx = (-cx1 * 2 + cx2) * 0.03,
        tmpy = (-cy1 * 2 + cy2) * 0.03;
      var dddfx = ((cx1 - cx2) * 3 + 1) * 0.006,
        dddfy = ((cy1 - cy2) * 3 + 1) * 0.006;
      var ddfx = tmpx * 2 + dddfx,
        ddfy = tmpy * 2 + dddfy;
      var dfx = cx1 * 0.3 + tmpx + dddfx * 0.16666667,
        dfy = cy1 * 0.3 + tmpy + dddfy * 0.16666667;
      var i = frameIndex * CurveTimeline.BEZIER_SIZE;
      var curves = this.curves;
      curves[i++] = CurveTimeline.BEZIER;
      var x = dfx,
        y = dfy;
      for (var n = i + CurveTimeline.BEZIER_SIZE - 1; i < n; i += 2) {
        curves[i] = x;
        curves[i + 1] = y;
        dfx += ddfx;
        dfy += ddfy;
        ddfx += dddfx;
        ddfy += dddfy;
        x += dfx;
        y += dfy;
      }
    };
    CurveTimeline.prototype.getCurvePercent = function (frameIndex, percent) {
      percent = spine.MathUtils.clamp(percent, 0, 1);
      var curves = this.curves;
      var i = frameIndex * CurveTimeline.BEZIER_SIZE;
      var type = curves[i];
      if (type == CurveTimeline.LINEAR) return percent;
      if (type == CurveTimeline.STEPPED) return 0;
      i++;
      var x = 0;
      for (var start = i, n = i + CurveTimeline.BEZIER_SIZE - 1; i < n; i += 2) {
        x = curves[i];
        if (x >= percent) {
          var prevX = void 0,
            prevY = void 0;
          if (i == start) {
            prevX = 0;
            prevY = 0;
          } else {
            prevX = curves[i - 2];
            prevY = curves[i - 1];
          }
          return prevY + (curves[i + 1] - prevY) * (percent - prevX) / (x - prevX);
        }
      }
      var y = curves[i - 1];
      return y + (1 - y) * (percent - x) / (1 - x);
    };
    return CurveTimeline;
  }();
  CurveTimeline.LINEAR = 0;
  CurveTimeline.STEPPED = 1;
  CurveTimeline.BEZIER = 2;
  CurveTimeline.BEZIER_SIZE = 10 * 2 - 1;
  spine.CurveTimeline = CurveTimeline;
  var RotateTimeline = function (_super) {
    __extends(RotateTimeline, _super);
    function RotateTimeline(frameCount) {
      var _this = _super.call(this, frameCount) || this;
      _this.frames = spine.Utils.newFloatArray(frameCount << 1);
      return _this;
    }
    RotateTimeline.prototype.getPropertyId = function () {
      return (TimelineType.rotate << 24) + this.boneIndex;
    };
    RotateTimeline.prototype.setFrame = function (frameIndex, time, degrees) {
      frameIndex <<= 1;
      this.frames[frameIndex] = time;
      this.frames[frameIndex + RotateTimeline.ROTATION] = degrees;
    };
    RotateTimeline.prototype.apply = function (skeleton, lastTime, time, events, alpha, pose, direction) {
      var frames = this.frames;
      var bone = skeleton.bones[this.boneIndex];
      if (time < frames[0]) {
        switch (pose) {
          case MixPose.setup:
            bone.rotation = bone.data.rotation;
            return;
          case MixPose.current:
            var r_1 = bone.data.rotation - bone.rotation;
            r_1 -= (16384 - (16384.499999999996 - r_1 / 360 | 0)) * 360;
            bone.rotation += r_1 * alpha;
        }
        return;
      }
      if (time >= frames[frames.length - RotateTimeline.ENTRIES]) {
        if (pose == MixPose.setup) bone.rotation = bone.data.rotation + frames[frames.length + RotateTimeline.PREV_ROTATION] * alpha;else {
          var r_2 = bone.data.rotation + frames[frames.length + RotateTimeline.PREV_ROTATION] - bone.rotation;
          r_2 -= (16384 - (16384.499999999996 - r_2 / 360 | 0)) * 360;
          bone.rotation += r_2 * alpha;
        }
        return;
      }
      var frame = Animation.binarySearch(frames, time, RotateTimeline.ENTRIES);
      var prevRotation = frames[frame + RotateTimeline.PREV_ROTATION];
      var frameTime = frames[frame];
      var percent = this.getCurvePercent((frame >> 1) - 1, 1 - (time - frameTime) / (frames[frame + RotateTimeline.PREV_TIME] - frameTime));
      var r = frames[frame + RotateTimeline.ROTATION] - prevRotation;
      r -= (16384 - (16384.499999999996 - r / 360 | 0)) * 360;
      r = prevRotation + r * percent;
      if (pose == MixPose.setup) {
        r -= (16384 - (16384.499999999996 - r / 360 | 0)) * 360;
        bone.rotation = bone.data.rotation + r * alpha;
      } else {
        r = bone.data.rotation + r - bone.rotation;
        r -= (16384 - (16384.499999999996 - r / 360 | 0)) * 360;
        bone.rotation += r * alpha;
      }
    };
    return RotateTimeline;
  }(CurveTimeline);
  RotateTimeline.ENTRIES = 2;
  RotateTimeline.PREV_TIME = -2;
  RotateTimeline.PREV_ROTATION = -1;
  RotateTimeline.ROTATION = 1;
  spine.RotateTimeline = RotateTimeline;
  var TranslateTimeline = function (_super) {
    __extends(TranslateTimeline, _super);
    function TranslateTimeline(frameCount) {
      var _this = _super.call(this, frameCount) || this;
      _this.frames = spine.Utils.newFloatArray(frameCount * TranslateTimeline.ENTRIES);
      return _this;
    }
    TranslateTimeline.prototype.getPropertyId = function () {
      return (TimelineType.translate << 24) + this.boneIndex;
    };
    TranslateTimeline.prototype.setFrame = function (frameIndex, time, x, y) {
      frameIndex *= TranslateTimeline.ENTRIES;
      this.frames[frameIndex] = time;
      this.frames[frameIndex + TranslateTimeline.X] = x;
      this.frames[frameIndex + TranslateTimeline.Y] = y;
    };
    TranslateTimeline.prototype.apply = function (skeleton, lastTime, time, events, alpha, pose, direction) {
      var frames = this.frames;
      var bone = skeleton.bones[this.boneIndex];
      if (time < frames[0]) {
        switch (pose) {
          case MixPose.setup:
            bone.x = bone.data.x;
            bone.y = bone.data.y;
            return;
          case MixPose.current:
            bone.x += (bone.data.x - bone.x) * alpha;
            bone.y += (bone.data.y - bone.y) * alpha;
        }
        return;
      }
      var x = 0,
        y = 0;
      if (time >= frames[frames.length - TranslateTimeline.ENTRIES]) {
        x = frames[frames.length + TranslateTimeline.PREV_X];
        y = frames[frames.length + TranslateTimeline.PREV_Y];
      } else {
        var frame = Animation.binarySearch(frames, time, TranslateTimeline.ENTRIES);
        x = frames[frame + TranslateTimeline.PREV_X];
        y = frames[frame + TranslateTimeline.PREV_Y];
        var frameTime = frames[frame];
        var percent = this.getCurvePercent(frame / TranslateTimeline.ENTRIES - 1, 1 - (time - frameTime) / (frames[frame + TranslateTimeline.PREV_TIME] - frameTime));
        x += (frames[frame + TranslateTimeline.X] - x) * percent;
        y += (frames[frame + TranslateTimeline.Y] - y) * percent;
      }
      if (pose == MixPose.setup) {
        bone.x = bone.data.x + x * alpha;
        bone.y = bone.data.y + y * alpha;
      } else {
        bone.x += (bone.data.x + x - bone.x) * alpha;
        bone.y += (bone.data.y + y - bone.y) * alpha;
      }
    };
    return TranslateTimeline;
  }(CurveTimeline);
  TranslateTimeline.ENTRIES = 3;
  TranslateTimeline.PREV_TIME = -3;
  TranslateTimeline.PREV_X = -2;
  TranslateTimeline.PREV_Y = -1;
  TranslateTimeline.X = 1;
  TranslateTimeline.Y = 2;
  spine.TranslateTimeline = TranslateTimeline;
  var ScaleTimeline = function (_super) {
    __extends(ScaleTimeline, _super);
    function ScaleTimeline(frameCount) {
      return _super.call(this, frameCount) || this;
    }
    ScaleTimeline.prototype.getPropertyId = function () {
      return (TimelineType.scale << 24) + this.boneIndex;
    };
    ScaleTimeline.prototype.apply = function (skeleton, lastTime, time, events, alpha, pose, direction) {
      var frames = this.frames;
      var bone = skeleton.bones[this.boneIndex];
      if (time < frames[0]) {
        switch (pose) {
          case MixPose.setup:
            bone.scaleX = bone.data.scaleX;
            bone.scaleY = bone.data.scaleY;
            return;
          case MixPose.current:
            bone.scaleX += (bone.data.scaleX - bone.scaleX) * alpha;
            bone.scaleY += (bone.data.scaleY - bone.scaleY) * alpha;
        }
        return;
      }
      var x = 0,
        y = 0;
      if (time >= frames[frames.length - ScaleTimeline.ENTRIES]) {
        x = frames[frames.length + ScaleTimeline.PREV_X] * bone.data.scaleX;
        y = frames[frames.length + ScaleTimeline.PREV_Y] * bone.data.scaleY;
      } else {
        var frame = Animation.binarySearch(frames, time, ScaleTimeline.ENTRIES);
        x = frames[frame + ScaleTimeline.PREV_X];
        y = frames[frame + ScaleTimeline.PREV_Y];
        var frameTime = frames[frame];
        var percent = this.getCurvePercent(frame / ScaleTimeline.ENTRIES - 1, 1 - (time - frameTime) / (frames[frame + ScaleTimeline.PREV_TIME] - frameTime));
        x = (x + (frames[frame + ScaleTimeline.X] - x) * percent) * bone.data.scaleX;
        y = (y + (frames[frame + ScaleTimeline.Y] - y) * percent) * bone.data.scaleY;
      }
      if (alpha == 1) {
        bone.scaleX = x;
        bone.scaleY = y;
      } else {
        var bx = 0,
          by = 0;
        if (pose == MixPose.setup) {
          bx = bone.data.scaleX;
          by = bone.data.scaleY;
        } else {
          bx = bone.scaleX;
          by = bone.scaleY;
        }
        if (direction == MixDirection.out) {
          x = Math.abs(x) * spine.MathUtils.signum(bx);
          y = Math.abs(y) * spine.MathUtils.signum(by);
        } else {
          bx = Math.abs(bx) * spine.MathUtils.signum(x);
          by = Math.abs(by) * spine.MathUtils.signum(y);
        }
        bone.scaleX = bx + (x - bx) * alpha;
        bone.scaleY = by + (y - by) * alpha;
      }
    };
    return ScaleTimeline;
  }(TranslateTimeline);
  spine.ScaleTimeline = ScaleTimeline;
  var ShearTimeline = function (_super) {
    __extends(ShearTimeline, _super);
    function ShearTimeline(frameCount) {
      return _super.call(this, frameCount) || this;
    }
    ShearTimeline.prototype.getPropertyId = function () {
      return (TimelineType.shear << 24) + this.boneIndex;
    };
    ShearTimeline.prototype.apply = function (skeleton, lastTime, time, events, alpha, pose, direction) {
      var frames = this.frames;
      var bone = skeleton.bones[this.boneIndex];
      if (time < frames[0]) {
        switch (pose) {
          case MixPose.setup:
            bone.shearX = bone.data.shearX;
            bone.shearY = bone.data.shearY;
            return;
          case MixPose.current:
            bone.shearX += (bone.data.shearX - bone.shearX) * alpha;
            bone.shearY += (bone.data.shearY - bone.shearY) * alpha;
        }
        return;
      }
      var x = 0,
        y = 0;
      if (time >= frames[frames.length - ShearTimeline.ENTRIES]) {
        x = frames[frames.length + ShearTimeline.PREV_X];
        y = frames[frames.length + ShearTimeline.PREV_Y];
      } else {
        var frame = Animation.binarySearch(frames, time, ShearTimeline.ENTRIES);
        x = frames[frame + ShearTimeline.PREV_X];
        y = frames[frame + ShearTimeline.PREV_Y];
        var frameTime = frames[frame];
        var percent = this.getCurvePercent(frame / ShearTimeline.ENTRIES - 1, 1 - (time - frameTime) / (frames[frame + ShearTimeline.PREV_TIME] - frameTime));
        x = x + (frames[frame + ShearTimeline.X] - x) * percent;
        y = y + (frames[frame + ShearTimeline.Y] - y) * percent;
      }
      if (pose == MixPose.setup) {
        bone.shearX = bone.data.shearX + x * alpha;
        bone.shearY = bone.data.shearY + y * alpha;
      } else {
        bone.shearX += (bone.data.shearX + x - bone.shearX) * alpha;
        bone.shearY += (bone.data.shearY + y - bone.shearY) * alpha;
      }
    };
    return ShearTimeline;
  }(TranslateTimeline);
  spine.ShearTimeline = ShearTimeline;
  var ColorTimeline = function (_super) {
    __extends(ColorTimeline, _super);
    function ColorTimeline(frameCount) {
      var _this = _super.call(this, frameCount) || this;
      _this.frames = spine.Utils.newFloatArray(frameCount * ColorTimeline.ENTRIES);
      return _this;
    }
    ColorTimeline.prototype.getPropertyId = function () {
      return (TimelineType.color << 24) + this.slotIndex;
    };
    ColorTimeline.prototype.setFrame = function (frameIndex, time, r, g, b, a) {
      frameIndex *= ColorTimeline.ENTRIES;
      this.frames[frameIndex] = time;
      this.frames[frameIndex + ColorTimeline.R] = r;
      this.frames[frameIndex + ColorTimeline.G] = g;
      this.frames[frameIndex + ColorTimeline.B] = b;
      this.frames[frameIndex + ColorTimeline.A] = a;
    };
    ColorTimeline.prototype.apply = function (skeleton, lastTime, time, events, alpha, pose, direction) {
      var slot = skeleton.slots[this.slotIndex];
      var frames = this.frames;
      if (time < frames[0]) {
        switch (pose) {
          case MixPose.setup:
            slot.color.setFromColor(slot.data.color);
            return;
          case MixPose.current:
            var color = slot.color,
              setup = slot.data.color;
            color.add((setup.r - color.r) * alpha, (setup.g - color.g) * alpha, (setup.b - color.b) * alpha, (setup.a - color.a) * alpha);
        }
        return;
      }
      var r = 0,
        g = 0,
        b = 0,
        a = 0;
      if (time >= frames[frames.length - ColorTimeline.ENTRIES]) {
        var i = frames.length;
        r = frames[i + ColorTimeline.PREV_R];
        g = frames[i + ColorTimeline.PREV_G];
        b = frames[i + ColorTimeline.PREV_B];
        a = frames[i + ColorTimeline.PREV_A];
      } else {
        var frame = Animation.binarySearch(frames, time, ColorTimeline.ENTRIES);
        r = frames[frame + ColorTimeline.PREV_R];
        g = frames[frame + ColorTimeline.PREV_G];
        b = frames[frame + ColorTimeline.PREV_B];
        a = frames[frame + ColorTimeline.PREV_A];
        var frameTime = frames[frame];
        var percent = this.getCurvePercent(frame / ColorTimeline.ENTRIES - 1, 1 - (time - frameTime) / (frames[frame + ColorTimeline.PREV_TIME] - frameTime));
        r += (frames[frame + ColorTimeline.R] - r) * percent;
        g += (frames[frame + ColorTimeline.G] - g) * percent;
        b += (frames[frame + ColorTimeline.B] - b) * percent;
        a += (frames[frame + ColorTimeline.A] - a) * percent;
      }
      if (alpha == 1) slot.color.set(r, g, b, a);else {
        var color = slot.color;
        if (pose == MixPose.setup) color.setFromColor(slot.data.color);
        color.add((r - color.r) * alpha, (g - color.g) * alpha, (b - color.b) * alpha, (a - color.a) * alpha);
      }
    };
    return ColorTimeline;
  }(CurveTimeline);
  ColorTimeline.ENTRIES = 5;
  ColorTimeline.PREV_TIME = -5;
  ColorTimeline.PREV_R = -4;
  ColorTimeline.PREV_G = -3;
  ColorTimeline.PREV_B = -2;
  ColorTimeline.PREV_A = -1;
  ColorTimeline.R = 1;
  ColorTimeline.G = 2;
  ColorTimeline.B = 3;
  ColorTimeline.A = 4;
  spine.ColorTimeline = ColorTimeline;
  var TwoColorTimeline = function (_super) {
    __extends(TwoColorTimeline, _super);
    function TwoColorTimeline(frameCount) {
      var _this = _super.call(this, frameCount) || this;
      _this.frames = spine.Utils.newFloatArray(frameCount * TwoColorTimeline.ENTRIES);
      return _this;
    }
    TwoColorTimeline.prototype.getPropertyId = function () {
      return (TimelineType.twoColor << 24) + this.slotIndex;
    };
    TwoColorTimeline.prototype.setFrame = function (frameIndex, time, r, g, b, a, r2, g2, b2) {
      frameIndex *= TwoColorTimeline.ENTRIES;
      this.frames[frameIndex] = time;
      this.frames[frameIndex + TwoColorTimeline.R] = r;
      this.frames[frameIndex + TwoColorTimeline.G] = g;
      this.frames[frameIndex + TwoColorTimeline.B] = b;
      this.frames[frameIndex + TwoColorTimeline.A] = a;
      this.frames[frameIndex + TwoColorTimeline.R2] = r2;
      this.frames[frameIndex + TwoColorTimeline.G2] = g2;
      this.frames[frameIndex + TwoColorTimeline.B2] = b2;
    };
    TwoColorTimeline.prototype.apply = function (skeleton, lastTime, time, events, alpha, pose, direction) {
      var slot = skeleton.slots[this.slotIndex];
      var frames = this.frames;
      if (time < frames[0]) {
        switch (pose) {
          case MixPose.setup:
            slot.color.setFromColor(slot.data.color);
            slot.darkColor.setFromColor(slot.data.darkColor);
            return;
          case MixPose.current:
            var light = slot.color,
              dark = slot.darkColor,
              setupLight = slot.data.color,
              setupDark = slot.data.darkColor;
            light.add((setupLight.r - light.r) * alpha, (setupLight.g - light.g) * alpha, (setupLight.b - light.b) * alpha, (setupLight.a - light.a) * alpha);
            dark.add((setupDark.r - dark.r) * alpha, (setupDark.g - dark.g) * alpha, (setupDark.b - dark.b) * alpha, 0);
        }
        return;
      }
      var r = 0,
        g = 0,
        b = 0,
        a = 0,
        r2 = 0,
        g2 = 0,
        b2 = 0;
      if (time >= frames[frames.length - TwoColorTimeline.ENTRIES]) {
        var i = frames.length;
        r = frames[i + TwoColorTimeline.PREV_R];
        g = frames[i + TwoColorTimeline.PREV_G];
        b = frames[i + TwoColorTimeline.PREV_B];
        a = frames[i + TwoColorTimeline.PREV_A];
        r2 = frames[i + TwoColorTimeline.PREV_R2];
        g2 = frames[i + TwoColorTimeline.PREV_G2];
        b2 = frames[i + TwoColorTimeline.PREV_B2];
      } else {
        var frame = Animation.binarySearch(frames, time, TwoColorTimeline.ENTRIES);
        r = frames[frame + TwoColorTimeline.PREV_R];
        g = frames[frame + TwoColorTimeline.PREV_G];
        b = frames[frame + TwoColorTimeline.PREV_B];
        a = frames[frame + TwoColorTimeline.PREV_A];
        r2 = frames[frame + TwoColorTimeline.PREV_R2];
        g2 = frames[frame + TwoColorTimeline.PREV_G2];
        b2 = frames[frame + TwoColorTimeline.PREV_B2];
        var frameTime = frames[frame];
        var percent = this.getCurvePercent(frame / TwoColorTimeline.ENTRIES - 1, 1 - (time - frameTime) / (frames[frame + TwoColorTimeline.PREV_TIME] - frameTime));
        r += (frames[frame + TwoColorTimeline.R] - r) * percent;
        g += (frames[frame + TwoColorTimeline.G] - g) * percent;
        b += (frames[frame + TwoColorTimeline.B] - b) * percent;
        a += (frames[frame + TwoColorTimeline.A] - a) * percent;
        r2 += (frames[frame + TwoColorTimeline.R2] - r2) * percent;
        g2 += (frames[frame + TwoColorTimeline.G2] - g2) * percent;
        b2 += (frames[frame + TwoColorTimeline.B2] - b2) * percent;
      }
      if (alpha == 1) {
        slot.color.set(r, g, b, a);
        slot.darkColor.set(r2, g2, b2, 1);
      } else {
        var light = slot.color,
          dark = slot.darkColor;
        if (pose == MixPose.setup) {
          light.setFromColor(slot.data.color);
          dark.setFromColor(slot.data.darkColor);
        }
        light.add((r - light.r) * alpha, (g - light.g) * alpha, (b - light.b) * alpha, (a - light.a) * alpha);
        dark.add((r2 - dark.r) * alpha, (g2 - dark.g) * alpha, (b2 - dark.b) * alpha, 0);
      }
    };
    return TwoColorTimeline;
  }(CurveTimeline);
  TwoColorTimeline.ENTRIES = 8;
  TwoColorTimeline.PREV_TIME = -8;
  TwoColorTimeline.PREV_R = -7;
  TwoColorTimeline.PREV_G = -6;
  TwoColorTimeline.PREV_B = -5;
  TwoColorTimeline.PREV_A = -4;
  TwoColorTimeline.PREV_R2 = -3;
  TwoColorTimeline.PREV_G2 = -2;
  TwoColorTimeline.PREV_B2 = -1;
  TwoColorTimeline.R = 1;
  TwoColorTimeline.G = 2;
  TwoColorTimeline.B = 3;
  TwoColorTimeline.A = 4;
  TwoColorTimeline.R2 = 5;
  TwoColorTimeline.G2 = 6;
  TwoColorTimeline.B2 = 7;
  spine.TwoColorTimeline = TwoColorTimeline;
  var AttachmentTimeline = function () {
    function AttachmentTimeline(frameCount) {
      this.frames = spine.Utils.newFloatArray(frameCount);
      this.attachmentNames = new Array(frameCount);
    }
    AttachmentTimeline.prototype.getPropertyId = function () {
      return (TimelineType.attachment << 24) + this.slotIndex;
    };
    AttachmentTimeline.prototype.getFrameCount = function () {
      return this.frames.length;
    };
    AttachmentTimeline.prototype.setFrame = function (frameIndex, time, attachmentName) {
      this.frames[frameIndex] = time;
      this.attachmentNames[frameIndex] = attachmentName;
    };
    AttachmentTimeline.prototype.apply = function (skeleton, lastTime, time, events, alpha, pose, direction) {
      var slot = skeleton.slots[this.slotIndex];
      if (direction == MixDirection.out && pose == MixPose.setup) {
        var attachmentName_1 = slot.data.attachmentName;
        slot.setAttachment(attachmentName_1 == null ? null : skeleton.getAttachment(this.slotIndex, attachmentName_1));
        return;
      }
      var frames = this.frames;
      if (time < frames[0]) {
        if (pose == MixPose.setup) {
          var attachmentName_2 = slot.data.attachmentName;
          slot.setAttachment(attachmentName_2 == null ? null : skeleton.getAttachment(this.slotIndex, attachmentName_2));
        }
        return;
      }
      var frameIndex = 0;
      if (time >= frames[frames.length - 1]) frameIndex = frames.length - 1;else frameIndex = Animation.binarySearch(frames, time, 1) - 1;
      var attachmentName = this.attachmentNames[frameIndex];
      skeleton.slots[this.slotIndex].setAttachment(attachmentName == null ? null : skeleton.getAttachment(this.slotIndex, attachmentName));
    };
    return AttachmentTimeline;
  }();
  spine.AttachmentTimeline = AttachmentTimeline;
  var zeros = null;
  var DeformTimeline = function (_super) {
    __extends(DeformTimeline, _super);
    function DeformTimeline(frameCount) {
      var _this = _super.call(this, frameCount) || this;
      _this.frames = spine.Utils.newFloatArray(frameCount);
      _this.frameVertices = new Array(frameCount);
      if (zeros == null) zeros = spine.Utils.newFloatArray(64);
      return _this;
    }
    DeformTimeline.prototype.getPropertyId = function () {
      return (TimelineType.deform << 27) + +this.attachment.id + this.slotIndex;
    };
    DeformTimeline.prototype.setFrame = function (frameIndex, time, vertices) {
      this.frames[frameIndex] = time;
      this.frameVertices[frameIndex] = vertices;
    };
    DeformTimeline.prototype.apply = function (skeleton, lastTime, time, firedEvents, alpha, pose, direction) {
      var slot = skeleton.slots[this.slotIndex];
      var slotAttachment = slot.getAttachment();
      if (!(slotAttachment instanceof spine.VertexAttachment) || !slotAttachment.applyDeform(this.attachment)) return;
      var verticesArray = slot.attachmentVertices;
      if (verticesArray.length == 0) alpha = 1;
      var frameVertices = this.frameVertices;
      var vertexCount = frameVertices[0].length;
      var frames = this.frames;
      if (time < frames[0]) {
        var vertexAttachment = slotAttachment;
        switch (pose) {
          case MixPose.setup:
            verticesArray.length = 0;
            return;
          case MixPose.current:
            if (alpha == 1) {
              verticesArray.length = 0;
              break;
            }
            var vertices_1 = spine.Utils.setArraySize(verticesArray, vertexCount);
            if (vertexAttachment.bones == null) {
              var setupVertices = vertexAttachment.vertices;
              for (var i = 0; i < vertexCount; i++) vertices_1[i] += (setupVertices[i] - vertices_1[i]) * alpha;
            } else {
              alpha = 1 - alpha;
              for (var i = 0; i < vertexCount; i++) vertices_1[i] *= alpha;
            }
        }
        return;
      }
      var vertices = spine.Utils.setArraySize(verticesArray, vertexCount);
      if (time >= frames[frames.length - 1]) {
        var lastVertices = frameVertices[frames.length - 1];
        if (alpha == 1) {
          spine.Utils.arrayCopy(lastVertices, 0, vertices, 0, vertexCount);
        } else if (pose == MixPose.setup) {
          var vertexAttachment = slotAttachment;
          if (vertexAttachment.bones == null) {
            var setupVertices_1 = vertexAttachment.vertices;
            for (var i_1 = 0; i_1 < vertexCount; i_1++) {
              var setup = setupVertices_1[i_1];
              vertices[i_1] = setup + (lastVertices[i_1] - setup) * alpha;
            }
          } else {
            for (var i_2 = 0; i_2 < vertexCount; i_2++) vertices[i_2] = lastVertices[i_2] * alpha;
          }
        } else {
          for (var i_3 = 0; i_3 < vertexCount; i_3++) vertices[i_3] += (lastVertices[i_3] - vertices[i_3]) * alpha;
        }
        return;
      }
      var frame = Animation.binarySearch(frames, time);
      var prevVertices = frameVertices[frame - 1];
      var nextVertices = frameVertices[frame];
      var frameTime = frames[frame];
      var percent = this.getCurvePercent(frame - 1, 1 - (time - frameTime) / (frames[frame - 1] - frameTime));
      if (alpha == 1) {
        for (var i_4 = 0; i_4 < vertexCount; i_4++) {
          var prev = prevVertices[i_4];
          vertices[i_4] = prev + (nextVertices[i_4] - prev) * percent;
        }
      } else if (pose == MixPose.setup) {
        var vertexAttachment = slotAttachment;
        if (vertexAttachment.bones == null) {
          var setupVertices_2 = vertexAttachment.vertices;
          for (var i_5 = 0; i_5 < vertexCount; i_5++) {
            var prev = prevVertices[i_5],
              setup = setupVertices_2[i_5];
            vertices[i_5] = setup + (prev + (nextVertices[i_5] - prev) * percent - setup) * alpha;
          }
        } else {
          for (var i_6 = 0; i_6 < vertexCount; i_6++) {
            var prev = prevVertices[i_6];
            vertices[i_6] = (prev + (nextVertices[i_6] - prev) * percent) * alpha;
          }
        }
      } else {
        for (var i_7 = 0; i_7 < vertexCount; i_7++) {
          var prev = prevVertices[i_7];
          vertices[i_7] += (prev + (nextVertices[i_7] - prev) * percent - vertices[i_7]) * alpha;
        }
      }
    };
    return DeformTimeline;
  }(CurveTimeline);
  spine.DeformTimeline = DeformTimeline;
  var EventTimeline = function () {
    function EventTimeline(frameCount) {
      this.frames = spine.Utils.newFloatArray(frameCount);
      this.events = new Array(frameCount);
    }
    EventTimeline.prototype.getPropertyId = function () {
      return TimelineType.event << 24;
    };
    EventTimeline.prototype.getFrameCount = function () {
      return this.frames.length;
    };
    EventTimeline.prototype.setFrame = function (frameIndex, event) {
      this.frames[frameIndex] = event.time;
      this.events[frameIndex] = event;
    };
    EventTimeline.prototype.apply = function (skeleton, lastTime, time, firedEvents, alpha, pose, direction) {
      if (firedEvents == null) return;
      var frames = this.frames;
      var frameCount = this.frames.length;
      if (lastTime > time) {
        this.apply(skeleton, lastTime, Number.MAX_VALUE, firedEvents, alpha, pose, direction);
        lastTime = -1;
      } else if (lastTime >= frames[frameCount - 1]) return;
      if (time < frames[0]) return;
      var frame = 0;
      if (lastTime < frames[0]) frame = 0;else {
        frame = Animation.binarySearch(frames, lastTime);
        var frameTime = frames[frame];
        while (frame > 0) {
          if (frames[frame - 1] != frameTime) break;
          frame--;
        }
      }
      for (; frame < frameCount && time >= frames[frame]; frame++) firedEvents.push(this.events[frame]);
    };
    return EventTimeline;
  }();
  spine.EventTimeline = EventTimeline;
  var DrawOrderTimeline = function () {
    function DrawOrderTimeline(frameCount) {
      this.frames = spine.Utils.newFloatArray(frameCount);
      this.drawOrders = new Array(frameCount);
    }
    DrawOrderTimeline.prototype.getPropertyId = function () {
      return TimelineType.drawOrder << 24;
    };
    DrawOrderTimeline.prototype.getFrameCount = function () {
      return this.frames.length;
    };
    DrawOrderTimeline.prototype.setFrame = function (frameIndex, time, drawOrder) {
      this.frames[frameIndex] = time;
      this.drawOrders[frameIndex] = drawOrder;
    };
    DrawOrderTimeline.prototype.apply = function (skeleton, lastTime, time, firedEvents, alpha, pose, direction) {
      var drawOrder = skeleton.drawOrder;
      var slots = skeleton.slots;
      if (direction == MixDirection.out && pose == MixPose.setup) {
        spine.Utils.arrayCopy(skeleton.slots, 0, skeleton.drawOrder, 0, skeleton.slots.length);
        return;
      }
      var frames = this.frames;
      if (time < frames[0]) {
        if (pose == MixPose.setup) spine.Utils.arrayCopy(skeleton.slots, 0, skeleton.drawOrder, 0, skeleton.slots.length);
        return;
      }
      var frame = 0;
      if (time >= frames[frames.length - 1]) frame = frames.length - 1;else frame = Animation.binarySearch(frames, time) - 1;
      var drawOrderToSetupIndex = this.drawOrders[frame];
      if (drawOrderToSetupIndex == null) spine.Utils.arrayCopy(slots, 0, drawOrder, 0, slots.length);else {
        for (var i = 0, n = drawOrderToSetupIndex.length; i < n; i++) drawOrder[i] = slots[drawOrderToSetupIndex[i]];
      }
    };
    return DrawOrderTimeline;
  }();
  spine.DrawOrderTimeline = DrawOrderTimeline;
  var IkConstraintTimeline = function (_super) {
    __extends(IkConstraintTimeline, _super);
    function IkConstraintTimeline(frameCount) {
      var _this = _super.call(this, frameCount) || this;
      _this.frames = spine.Utils.newFloatArray(frameCount * IkConstraintTimeline.ENTRIES);
      return _this;
    }
    IkConstraintTimeline.prototype.getPropertyId = function () {
      return (TimelineType.ikConstraint << 24) + this.ikConstraintIndex;
    };
    IkConstraintTimeline.prototype.setFrame = function (frameIndex, time, mix, bendDirection) {
      frameIndex *= IkConstraintTimeline.ENTRIES;
      this.frames[frameIndex] = time;
      this.frames[frameIndex + IkConstraintTimeline.MIX] = mix;
      this.frames[frameIndex + IkConstraintTimeline.BEND_DIRECTION] = bendDirection;
    };
    IkConstraintTimeline.prototype.apply = function (skeleton, lastTime, time, firedEvents, alpha, pose, direction) {
      var frames = this.frames;
      var constraint = skeleton.ikConstraints[this.ikConstraintIndex];
      if (time < frames[0]) {
        switch (pose) {
          case MixPose.setup:
            constraint.mix = constraint.data.mix;
            constraint.bendDirection = constraint.data.bendDirection;
            return;
          case MixPose.current:
            constraint.mix += (constraint.data.mix - constraint.mix) * alpha;
            constraint.bendDirection = constraint.data.bendDirection;
        }
        return;
      }
      if (time >= frames[frames.length - IkConstraintTimeline.ENTRIES]) {
        if (pose == MixPose.setup) {
          constraint.mix = constraint.data.mix + (frames[frames.length + IkConstraintTimeline.PREV_MIX] - constraint.data.mix) * alpha;
          constraint.bendDirection = direction == MixDirection.out ? constraint.data.bendDirection : frames[frames.length + IkConstraintTimeline.PREV_BEND_DIRECTION];
        } else {
          constraint.mix += (frames[frames.length + IkConstraintTimeline.PREV_MIX] - constraint.mix) * alpha;
          if (direction == MixDirection["in"]) constraint.bendDirection = frames[frames.length + IkConstraintTimeline.PREV_BEND_DIRECTION];
        }
        return;
      }
      var frame = Animation.binarySearch(frames, time, IkConstraintTimeline.ENTRIES);
      var mix = frames[frame + IkConstraintTimeline.PREV_MIX];
      var frameTime = frames[frame];
      var percent = this.getCurvePercent(frame / IkConstraintTimeline.ENTRIES - 1, 1 - (time - frameTime) / (frames[frame + IkConstraintTimeline.PREV_TIME] - frameTime));
      if (pose == MixPose.setup) {
        constraint.mix = constraint.data.mix + (mix + (frames[frame + IkConstraintTimeline.MIX] - mix) * percent - constraint.data.mix) * alpha;
        constraint.bendDirection = direction == MixDirection.out ? constraint.data.bendDirection : frames[frame + IkConstraintTimeline.PREV_BEND_DIRECTION];
      } else {
        constraint.mix += (mix + (frames[frame + IkConstraintTimeline.MIX] - mix) * percent - constraint.mix) * alpha;
        if (direction == MixDirection["in"]) constraint.bendDirection = frames[frame + IkConstraintTimeline.PREV_BEND_DIRECTION];
      }
    };
    return IkConstraintTimeline;
  }(CurveTimeline);
  IkConstraintTimeline.ENTRIES = 3;
  IkConstraintTimeline.PREV_TIME = -3;
  IkConstraintTimeline.PREV_MIX = -2;
  IkConstraintTimeline.PREV_BEND_DIRECTION = -1;
  IkConstraintTimeline.MIX = 1;
  IkConstraintTimeline.BEND_DIRECTION = 2;
  spine.IkConstraintTimeline = IkConstraintTimeline;
  var TransformConstraintTimeline = function (_super) {
    __extends(TransformConstraintTimeline, _super);
    function TransformConstraintTimeline(frameCount) {
      var _this = _super.call(this, frameCount) || this;
      _this.frames = spine.Utils.newFloatArray(frameCount * TransformConstraintTimeline.ENTRIES);
      return _this;
    }
    TransformConstraintTimeline.prototype.getPropertyId = function () {
      return (TimelineType.transformConstraint << 24) + this.transformConstraintIndex;
    };
    TransformConstraintTimeline.prototype.setFrame = function (frameIndex, time, rotateMix, translateMix, scaleMix, shearMix) {
      frameIndex *= TransformConstraintTimeline.ENTRIES;
      this.frames[frameIndex] = time;
      this.frames[frameIndex + TransformConstraintTimeline.ROTATE] = rotateMix;
      this.frames[frameIndex + TransformConstraintTimeline.TRANSLATE] = translateMix;
      this.frames[frameIndex + TransformConstraintTimeline.SCALE] = scaleMix;
      this.frames[frameIndex + TransformConstraintTimeline.SHEAR] = shearMix;
    };
    TransformConstraintTimeline.prototype.apply = function (skeleton, lastTime, time, firedEvents, alpha, pose, direction) {
      var frames = this.frames;
      var constraint = skeleton.transformConstraints[this.transformConstraintIndex];
      if (time < frames[0]) {
        var data = constraint.data;
        switch (pose) {
          case MixPose.setup:
            constraint.rotateMix = data.rotateMix;
            constraint.translateMix = data.translateMix;
            constraint.scaleMix = data.scaleMix;
            constraint.shearMix = data.shearMix;
            return;
          case MixPose.current:
            constraint.rotateMix += (data.rotateMix - constraint.rotateMix) * alpha;
            constraint.translateMix += (data.translateMix - constraint.translateMix) * alpha;
            constraint.scaleMix += (data.scaleMix - constraint.scaleMix) * alpha;
            constraint.shearMix += (data.shearMix - constraint.shearMix) * alpha;
        }
        return;
      }
      var rotate = 0,
        translate = 0,
        scale = 0,
        shear = 0;
      if (time >= frames[frames.length - TransformConstraintTimeline.ENTRIES]) {
        var i = frames.length;
        rotate = frames[i + TransformConstraintTimeline.PREV_ROTATE];
        translate = frames[i + TransformConstraintTimeline.PREV_TRANSLATE];
        scale = frames[i + TransformConstraintTimeline.PREV_SCALE];
        shear = frames[i + TransformConstraintTimeline.PREV_SHEAR];
      } else {
        var frame = Animation.binarySearch(frames, time, TransformConstraintTimeline.ENTRIES);
        rotate = frames[frame + TransformConstraintTimeline.PREV_ROTATE];
        translate = frames[frame + TransformConstraintTimeline.PREV_TRANSLATE];
        scale = frames[frame + TransformConstraintTimeline.PREV_SCALE];
        shear = frames[frame + TransformConstraintTimeline.PREV_SHEAR];
        var frameTime = frames[frame];
        var percent = this.getCurvePercent(frame / TransformConstraintTimeline.ENTRIES - 1, 1 - (time - frameTime) / (frames[frame + TransformConstraintTimeline.PREV_TIME] - frameTime));
        rotate += (frames[frame + TransformConstraintTimeline.ROTATE] - rotate) * percent;
        translate += (frames[frame + TransformConstraintTimeline.TRANSLATE] - translate) * percent;
        scale += (frames[frame + TransformConstraintTimeline.SCALE] - scale) * percent;
        shear += (frames[frame + TransformConstraintTimeline.SHEAR] - shear) * percent;
      }
      if (pose == MixPose.setup) {
        var data = constraint.data;
        constraint.rotateMix = data.rotateMix + (rotate - data.rotateMix) * alpha;
        constraint.translateMix = data.translateMix + (translate - data.translateMix) * alpha;
        constraint.scaleMix = data.scaleMix + (scale - data.scaleMix) * alpha;
        constraint.shearMix = data.shearMix + (shear - data.shearMix) * alpha;
      } else {
        constraint.rotateMix += (rotate - constraint.rotateMix) * alpha;
        constraint.translateMix += (translate - constraint.translateMix) * alpha;
        constraint.scaleMix += (scale - constraint.scaleMix) * alpha;
        constraint.shearMix += (shear - constraint.shearMix) * alpha;
      }
    };
    return TransformConstraintTimeline;
  }(CurveTimeline);
  TransformConstraintTimeline.ENTRIES = 5;
  TransformConstraintTimeline.PREV_TIME = -5;
  TransformConstraintTimeline.PREV_ROTATE = -4;
  TransformConstraintTimeline.PREV_TRANSLATE = -3;
  TransformConstraintTimeline.PREV_SCALE = -2;
  TransformConstraintTimeline.PREV_SHEAR = -1;
  TransformConstraintTimeline.ROTATE = 1;
  TransformConstraintTimeline.TRANSLATE = 2;
  TransformConstraintTimeline.SCALE = 3;
  TransformConstraintTimeline.SHEAR = 4;
  spine.TransformConstraintTimeline = TransformConstraintTimeline;
  var PathConstraintPositionTimeline = function (_super) {
    __extends(PathConstraintPositionTimeline, _super);
    function PathConstraintPositionTimeline(frameCount) {
      var _this = _super.call(this, frameCount) || this;
      _this.frames = spine.Utils.newFloatArray(frameCount * PathConstraintPositionTimeline.ENTRIES);
      return _this;
    }
    PathConstraintPositionTimeline.prototype.getPropertyId = function () {
      return (TimelineType.pathConstraintPosition << 24) + this.pathConstraintIndex;
    };
    PathConstraintPositionTimeline.prototype.setFrame = function (frameIndex, time, value) {
      frameIndex *= PathConstraintPositionTimeline.ENTRIES;
      this.frames[frameIndex] = time;
      this.frames[frameIndex + PathConstraintPositionTimeline.VALUE] = value;
    };
    PathConstraintPositionTimeline.prototype.apply = function (skeleton, lastTime, time, firedEvents, alpha, pose, direction) {
      var frames = this.frames;
      var constraint = skeleton.pathConstraints[this.pathConstraintIndex];
      if (time < frames[0]) {
        switch (pose) {
          case MixPose.setup:
            constraint.position = constraint.data.position;
            return;
          case MixPose.current:
            constraint.position += (constraint.data.position - constraint.position) * alpha;
        }
        return;
      }
      var position = 0;
      if (time >= frames[frames.length - PathConstraintPositionTimeline.ENTRIES]) position = frames[frames.length + PathConstraintPositionTimeline.PREV_VALUE];else {
        var frame = Animation.binarySearch(frames, time, PathConstraintPositionTimeline.ENTRIES);
        position = frames[frame + PathConstraintPositionTimeline.PREV_VALUE];
        var frameTime = frames[frame];
        var percent = this.getCurvePercent(frame / PathConstraintPositionTimeline.ENTRIES - 1, 1 - (time - frameTime) / (frames[frame + PathConstraintPositionTimeline.PREV_TIME] - frameTime));
        position += (frames[frame + PathConstraintPositionTimeline.VALUE] - position) * percent;
      }
      if (pose == MixPose.setup) constraint.position = constraint.data.position + (position - constraint.data.position) * alpha;else constraint.position += (position - constraint.position) * alpha;
    };
    return PathConstraintPositionTimeline;
  }(CurveTimeline);
  PathConstraintPositionTimeline.ENTRIES = 2;
  PathConstraintPositionTimeline.PREV_TIME = -2;
  PathConstraintPositionTimeline.PREV_VALUE = -1;
  PathConstraintPositionTimeline.VALUE = 1;
  spine.PathConstraintPositionTimeline = PathConstraintPositionTimeline;
  var PathConstraintSpacingTimeline = function (_super) {
    __extends(PathConstraintSpacingTimeline, _super);
    function PathConstraintSpacingTimeline(frameCount) {
      return _super.call(this, frameCount) || this;
    }
    PathConstraintSpacingTimeline.prototype.getPropertyId = function () {
      return (TimelineType.pathConstraintSpacing << 24) + this.pathConstraintIndex;
    };
    PathConstraintSpacingTimeline.prototype.apply = function (skeleton, lastTime, time, firedEvents, alpha, pose, direction) {
      var frames = this.frames;
      var constraint = skeleton.pathConstraints[this.pathConstraintIndex];
      if (time < frames[0]) {
        switch (pose) {
          case MixPose.setup:
            constraint.spacing = constraint.data.spacing;
            return;
          case MixPose.current:
            constraint.spacing += (constraint.data.spacing - constraint.spacing) * alpha;
        }
        return;
      }
      var spacing = 0;
      if (time >= frames[frames.length - PathConstraintSpacingTimeline.ENTRIES]) spacing = frames[frames.length + PathConstraintSpacingTimeline.PREV_VALUE];else {
        var frame = Animation.binarySearch(frames, time, PathConstraintSpacingTimeline.ENTRIES);
        spacing = frames[frame + PathConstraintSpacingTimeline.PREV_VALUE];
        var frameTime = frames[frame];
        var percent = this.getCurvePercent(frame / PathConstraintSpacingTimeline.ENTRIES - 1, 1 - (time - frameTime) / (frames[frame + PathConstraintSpacingTimeline.PREV_TIME] - frameTime));
        spacing += (frames[frame + PathConstraintSpacingTimeline.VALUE] - spacing) * percent;
      }
      if (pose == MixPose.setup) constraint.spacing = constraint.data.spacing + (spacing - constraint.data.spacing) * alpha;else constraint.spacing += (spacing - constraint.spacing) * alpha;
    };
    return PathConstraintSpacingTimeline;
  }(PathConstraintPositionTimeline);
  spine.PathConstraintSpacingTimeline = PathConstraintSpacingTimeline;
  var PathConstraintMixTimeline = function (_super) {
    __extends(PathConstraintMixTimeline, _super);
    function PathConstraintMixTimeline(frameCount) {
      var _this = _super.call(this, frameCount) || this;
      _this.frames = spine.Utils.newFloatArray(frameCount * PathConstraintMixTimeline.ENTRIES);
      return _this;
    }
    PathConstraintMixTimeline.prototype.getPropertyId = function () {
      return (TimelineType.pathConstraintMix << 24) + this.pathConstraintIndex;
    };
    PathConstraintMixTimeline.prototype.setFrame = function (frameIndex, time, rotateMix, translateMix) {
      frameIndex *= PathConstraintMixTimeline.ENTRIES;
      this.frames[frameIndex] = time;
      this.frames[frameIndex + PathConstraintMixTimeline.ROTATE] = rotateMix;
      this.frames[frameIndex + PathConstraintMixTimeline.TRANSLATE] = translateMix;
    };
    PathConstraintMixTimeline.prototype.apply = function (skeleton, lastTime, time, firedEvents, alpha, pose, direction) {
      var frames = this.frames;
      var constraint = skeleton.pathConstraints[this.pathConstraintIndex];
      if (time < frames[0]) {
        switch (pose) {
          case MixPose.setup:
            constraint.rotateMix = constraint.data.rotateMix;
            constraint.translateMix = constraint.data.translateMix;
            return;
          case MixPose.current:
            constraint.rotateMix += (constraint.data.rotateMix - constraint.rotateMix) * alpha;
            constraint.translateMix += (constraint.data.translateMix - constraint.translateMix) * alpha;
        }
        return;
      }
      var rotate = 0,
        translate = 0;
      if (time >= frames[frames.length - PathConstraintMixTimeline.ENTRIES]) {
        rotate = frames[frames.length + PathConstraintMixTimeline.PREV_ROTATE];
        translate = frames[frames.length + PathConstraintMixTimeline.PREV_TRANSLATE];
      } else {
        var frame = Animation.binarySearch(frames, time, PathConstraintMixTimeline.ENTRIES);
        rotate = frames[frame + PathConstraintMixTimeline.PREV_ROTATE];
        translate = frames[frame + PathConstraintMixTimeline.PREV_TRANSLATE];
        var frameTime = frames[frame];
        var percent = this.getCurvePercent(frame / PathConstraintMixTimeline.ENTRIES - 1, 1 - (time - frameTime) / (frames[frame + PathConstraintMixTimeline.PREV_TIME] - frameTime));
        rotate += (frames[frame + PathConstraintMixTimeline.ROTATE] - rotate) * percent;
        translate += (frames[frame + PathConstraintMixTimeline.TRANSLATE] - translate) * percent;
      }
      if (pose == MixPose.setup) {
        constraint.rotateMix = constraint.data.rotateMix + (rotate - constraint.data.rotateMix) * alpha;
        constraint.translateMix = constraint.data.translateMix + (translate - constraint.data.translateMix) * alpha;
      } else {
        constraint.rotateMix += (rotate - constraint.rotateMix) * alpha;
        constraint.translateMix += (translate - constraint.translateMix) * alpha;
      }
    };
    return PathConstraintMixTimeline;
  }(CurveTimeline);
  PathConstraintMixTimeline.ENTRIES = 3;
  PathConstraintMixTimeline.PREV_TIME = -3;
  PathConstraintMixTimeline.PREV_ROTATE = -2;
  PathConstraintMixTimeline.PREV_TRANSLATE = -1;
  PathConstraintMixTimeline.ROTATE = 1;
  PathConstraintMixTimeline.TRANSLATE = 2;
  spine.PathConstraintMixTimeline = PathConstraintMixTimeline;
})(spine || (spine = {}));
var spine;
(function (spine) {
  var AnimationState = function () {
    function AnimationState(data) {
      this.tracks = new Array();
      this.events = new Array();
      this.listeners = new Array();
      this.queue = new EventQueue(this);
      this.propertyIDs = new spine.IntSet();
      this.mixingTo = new Array();
      this.animationsChanged = false;
      this.timeScale = 1;
      this.trackEntryPool = new spine.Pool(function () {
        return new TrackEntry();
      });
      this.data = data;
    }
    AnimationState.prototype.update = function (delta) {
      delta *= this.timeScale;
      var tracks = this.tracks;
      for (var i = 0, n = tracks.length; i < n; i++) {
        var current = tracks[i];
        if (current == null) continue;
        current.animationLast = current.nextAnimationLast;
        current.trackLast = current.nextTrackLast;
        var currentDelta = delta * current.timeScale;
        if (current.delay > 0) {
          current.delay -= currentDelta;
          if (current.delay > 0) continue;
          currentDelta = -current.delay;
          current.delay = 0;
        }
        var next = current.next;
        if (next != null) {
          var nextTime = current.trackLast - next.delay;
          if (nextTime >= 0) {
            next.delay = 0;
            next.trackTime = nextTime + delta * next.timeScale;
            current.trackTime += currentDelta;
            this.setCurrent(i, next, true);
            while (next.mixingFrom != null) {
              next.mixTime += currentDelta;
              next = next.mixingFrom;
            }
            continue;
          }
        } else if (current.trackLast >= current.trackEnd && current.mixingFrom == null) {
          tracks[i] = null;
          this.queue.end(current);
          this.disposeNext(current);
          continue;
        }
        if (current.mixingFrom != null && this.updateMixingFrom(current, delta)) {
          var from = current.mixingFrom;
          current.mixingFrom = null;
          while (from != null) {
            this.queue.end(from);
            from = from.mixingFrom;
          }
        }
        current.trackTime += currentDelta;
      }
      this.queue.drain();
    };
    AnimationState.prototype.updateMixingFrom = function (to, delta) {
      var from = to.mixingFrom;
      if (from == null) return true;
      var finished = this.updateMixingFrom(from, delta);
      if (to.mixTime > 0 && (to.mixTime >= to.mixDuration || to.timeScale == 0)) {
        if (from.totalAlpha == 0 || to.mixDuration == 0) {
          to.mixingFrom = from.mixingFrom;
          to.interruptAlpha = from.interruptAlpha;
          this.queue.end(from);
        }
        return finished;
      }
      from.animationLast = from.nextAnimationLast;
      from.trackLast = from.nextTrackLast;
      from.trackTime += delta * from.timeScale;
      to.mixTime += delta * to.timeScale;
      return false;
    };
    AnimationState.prototype.apply = function (skeleton) {
      if (skeleton == null) throw new Error("skeleton cannot be null.");
      if (this.animationsChanged) this._animationsChanged();
      var events = this.events;
      var tracks = this.tracks;
      var applied = false;
      for (var i = 0, n = tracks.length; i < n; i++) {
        var current = tracks[i];
        if (current == null || current.delay > 0) continue;
        applied = true;
        var currentPose = i == 0 ? spine.MixPose.current : spine.MixPose.currentLayered;
        var mix = current.alpha;
        if (current.mixingFrom != null) mix *= this.applyMixingFrom(current, skeleton, currentPose);else if (current.trackTime >= current.trackEnd && current.next == null) mix = 0;
        var animationLast = current.animationLast,
          animationTime = current.getAnimationTime();
        var timelineCount = current.animation.timelines.length;
        var timelines = current.animation.timelines;
        if (mix == 1) {
          for (var ii = 0; ii < timelineCount; ii++) timelines[ii].apply(skeleton, animationLast, animationTime, events, 1, spine.MixPose.setup, spine.MixDirection["in"]);
        } else {
          var timelineData = current.timelineData;
          var firstFrame = current.timelinesRotation.length == 0;
          if (firstFrame) spine.Utils.setArraySize(current.timelinesRotation, timelineCount << 1, null);
          var timelinesRotation = current.timelinesRotation;
          for (var ii = 0; ii < timelineCount; ii++) {
            var timeline = timelines[ii];
            var pose = timelineData[ii] >= AnimationState.FIRST ? spine.MixPose.setup : currentPose;
            if (timeline instanceof spine.RotateTimeline) {
              this.applyRotateTimeline(timeline, skeleton, animationTime, mix, pose, timelinesRotation, ii << 1, firstFrame);
            } else timeline.apply(skeleton, animationLast, animationTime, events, mix, pose, spine.MixDirection["in"]);
          }
        }
        this.queueEvents(current, animationTime);
        events.length = 0;
        current.nextAnimationLast = animationTime;
        current.nextTrackLast = current.trackTime;
      }
      this.queue.drain();
      return applied;
    };
    AnimationState.prototype.applyMixingFrom = function (to, skeleton, currentPose) {
      var from = to.mixingFrom;
      if (from.mixingFrom != null) this.applyMixingFrom(from, skeleton, currentPose);
      var mix = 0;
      if (to.mixDuration == 0) {
        mix = 1;
        currentPose = spine.MixPose.setup;
      } else {
        mix = to.mixTime / to.mixDuration;
        if (mix > 1) mix = 1;
      }
      var events = mix < from.eventThreshold ? this.events : null;
      var attachments = mix < from.attachmentThreshold,
        drawOrder = mix < from.drawOrderThreshold;
      var animationLast = from.animationLast,
        animationTime = from.getAnimationTime();
      var timelineCount = from.animation.timelines.length;
      var timelines = from.animation.timelines;
      var timelineData = from.timelineData;
      var timelineDipMix = from.timelineDipMix;
      var firstFrame = from.timelinesRotation.length == 0;
      if (firstFrame) spine.Utils.setArraySize(from.timelinesRotation, timelineCount << 1, null);
      var timelinesRotation = from.timelinesRotation;
      var pose;
      var alphaDip = from.alpha * to.interruptAlpha,
        alphaMix = alphaDip * (1 - mix),
        alpha = 0;
      from.totalAlpha = 0;
      for (var i = 0; i < timelineCount; i++) {
        var timeline = timelines[i];
        switch (timelineData[i]) {
          case AnimationState.SUBSEQUENT:
            if (!attachments && timeline instanceof spine.AttachmentTimeline) continue;
            if (!drawOrder && timeline instanceof spine.DrawOrderTimeline) continue;
            pose = currentPose;
            alpha = alphaMix;
            break;
          case AnimationState.FIRST:
            pose = spine.MixPose.setup;
            alpha = alphaMix;
            break;
          case AnimationState.DIP:
            pose = spine.MixPose.setup;
            alpha = alphaDip;
            break;
          default:
            pose = spine.MixPose.setup;
            alpha = alphaDip;
            var dipMix = timelineDipMix[i];
            alpha *= Math.max(0, 1 - dipMix.mixTime / dipMix.mixDuration);
            break;
        }
        from.totalAlpha += alpha;
        if (timeline instanceof spine.RotateTimeline) this.applyRotateTimeline(timeline, skeleton, animationTime, alpha, pose, timelinesRotation, i << 1, firstFrame);else {
          timeline.apply(skeleton, animationLast, animationTime, events, alpha, pose, spine.MixDirection.out);
        }
      }
      if (to.mixDuration > 0) this.queueEvents(from, animationTime);
      this.events.length = 0;
      from.nextAnimationLast = animationTime;
      from.nextTrackLast = from.trackTime;
      return mix;
    };
    AnimationState.prototype.applyRotateTimeline = function (timeline, skeleton, time, alpha, pose, timelinesRotation, i, firstFrame) {
      if (firstFrame) timelinesRotation[i] = 0;
      if (alpha == 1) {
        timeline.apply(skeleton, 0, time, null, 1, pose, spine.MixDirection["in"]);
        return;
      }
      var rotateTimeline = timeline;
      var frames = rotateTimeline.frames;
      var bone = skeleton.bones[rotateTimeline.boneIndex];
      if (time < frames[0]) {
        if (pose == spine.MixPose.setup) bone.rotation = bone.data.rotation;
        return;
      }
      var r2 = 0;
      if (time >= frames[frames.length - spine.RotateTimeline.ENTRIES]) r2 = bone.data.rotation + frames[frames.length + spine.RotateTimeline.PREV_ROTATION];else {
        var frame = spine.Animation.binarySearch(frames, time, spine.RotateTimeline.ENTRIES);
        var prevRotation = frames[frame + spine.RotateTimeline.PREV_ROTATION];
        var frameTime = frames[frame];
        var percent = rotateTimeline.getCurvePercent((frame >> 1) - 1, 1 - (time - frameTime) / (frames[frame + spine.RotateTimeline.PREV_TIME] - frameTime));
        r2 = frames[frame + spine.RotateTimeline.ROTATION] - prevRotation;
        r2 -= (16384 - (16384.499999999996 - r2 / 360 | 0)) * 360;
        r2 = prevRotation + r2 * percent + bone.data.rotation;
        r2 -= (16384 - (16384.499999999996 - r2 / 360 | 0)) * 360;
      }
      var r1 = pose == spine.MixPose.setup ? bone.data.rotation : bone.rotation;
      var total = 0,
        diff = r2 - r1;
      if (diff == 0) {
        total = timelinesRotation[i];
      } else {
        diff -= (16384 - (16384.499999999996 - diff / 360 | 0)) * 360;
        var lastTotal = 0,
          lastDiff = 0;
        if (firstFrame) {
          lastTotal = 0;
          lastDiff = diff;
        } else {
          lastTotal = timelinesRotation[i];
          lastDiff = timelinesRotation[i + 1];
        }
        var current = diff > 0,
          dir = lastTotal >= 0;
        if (spine.MathUtils.signum(lastDiff) != spine.MathUtils.signum(diff) && Math.abs(lastDiff) <= 90) {
          if (Math.abs(lastTotal) > 180) lastTotal += 360 * spine.MathUtils.signum(lastTotal);
          dir = current;
        }
        total = diff + lastTotal - lastTotal % 360;
        if (dir != current) total += 360 * spine.MathUtils.signum(lastTotal);
        timelinesRotation[i] = total;
      }
      timelinesRotation[i + 1] = diff;
      r1 += total * alpha;
      bone.rotation = r1 - (16384 - (16384.499999999996 - r1 / 360 | 0)) * 360;
    };
    AnimationState.prototype.queueEvents = function (entry, animationTime) {
      var animationStart = entry.animationStart,
        animationEnd = entry.animationEnd;
      var duration = animationEnd - animationStart;
      var trackLastWrapped = entry.trackLast % duration;
      var events = this.events;
      var i = 0,
        n = events.length;
      for (; i < n; i++) {
        var event_1 = events[i];
        if (event_1.time < trackLastWrapped) break;
        if (event_1.time > animationEnd) continue;
        this.queue.event(entry, event_1);
      }
      if (entry.loop ? trackLastWrapped > entry.trackTime % duration : animationTime >= animationEnd && entry.animationLast < animationEnd) {
        this.queue.complete(entry);
      }
      for (; i < n; i++) {
        var event_2 = events[i];
        if (event_2.time < animationStart) continue;
        this.queue.event(entry, events[i]);
      }
    };
    AnimationState.prototype.clearTracks = function () {
      var oldDrainDisabled = this.queue.drainDisabled;
      this.queue.drainDisabled = true;
      for (var i = 0, n = this.tracks.length; i < n; i++) this.clearTrack(i);
      this.tracks.length = 0;
      this.queue.drainDisabled = oldDrainDisabled;
      this.queue.drain();
    };
    AnimationState.prototype.clearTrack = function (trackIndex) {
      if (trackIndex >= this.tracks.length) return;
      var current = this.tracks[trackIndex];
      if (current == null) return;
      this.queue.end(current);
      this.disposeNext(current);
      var entry = current;
      while (true) {
        var from = entry.mixingFrom;
        if (from == null) break;
        this.queue.end(from);
        entry.mixingFrom = null;
        entry = from;
      }
      this.tracks[current.trackIndex] = null;
      this.queue.drain();
    };
    AnimationState.prototype.setCurrent = function (index, current, interrupt) {
      var from = this.expandToIndex(index);
      this.tracks[index] = current;
      if (from != null) {
        if (interrupt) this.queue.interrupt(from);
        current.mixingFrom = from;
        current.mixTime = 0;
        if (from.mixingFrom != null && from.mixDuration > 0) current.interruptAlpha *= Math.min(1, from.mixTime / from.mixDuration);
        from.timelinesRotation.length = 0;
      }
      this.queue.start(current);
    };
    AnimationState.prototype.setAnimation = function (trackIndex, animationName, loop) {
      var animation = this.data.skeletonData.findAnimation(animationName);
      if (animation == null) throw new Error("Animation not found: " + animationName);
      return this.setAnimationWith(trackIndex, animation, loop);
    };
    AnimationState.prototype.setAnimationWith = function (trackIndex, animation, loop) {
      if (animation == null) throw new Error("animation cannot be null.");
      var interrupt = true;
      var current = this.expandToIndex(trackIndex);
      if (current != null) {
        if (current.nextTrackLast == -1) {
          this.tracks[trackIndex] = current.mixingFrom;
          this.queue.interrupt(current);
          this.queue.end(current);
          this.disposeNext(current);
          current = current.mixingFrom;
          interrupt = false;
        } else this.disposeNext(current);
      }
      var entry = this.trackEntry(trackIndex, animation, loop, current);
      this.setCurrent(trackIndex, entry, interrupt);
      this.queue.drain();
      return entry;
    };
    AnimationState.prototype.addAnimation = function (trackIndex, animationName, loop, delay) {
      var animation = this.data.skeletonData.findAnimation(animationName);
      if (animation == null) throw new Error("Animation not found: " + animationName);
      return this.addAnimationWith(trackIndex, animation, loop, delay);
    };
    AnimationState.prototype.addAnimationWith = function (trackIndex, animation, loop, delay) {
      if (animation == null) throw new Error("animation cannot be null.");
      var last = this.expandToIndex(trackIndex);
      if (last != null) {
        while (last.next != null) last = last.next;
      }
      var entry = this.trackEntry(trackIndex, animation, loop, last);
      if (last == null) {
        this.setCurrent(trackIndex, entry, true);
        this.queue.drain();
      } else {
        last.next = entry;
        if (delay <= 0) {
          var duration = last.animationEnd - last.animationStart;
          if (duration != 0) {
            if (last.loop) delay += duration * (1 + (last.trackTime / duration | 0));else delay += duration;
            delay -= this.data.getMix(last.animation, animation);
          } else delay = 0;
        }
      }
      entry.delay = delay;
      return entry;
    };
    AnimationState.prototype.setEmptyAnimation = function (trackIndex, mixDuration) {
      var entry = this.setAnimationWith(trackIndex, AnimationState.emptyAnimation, false);
      entry.mixDuration = mixDuration;
      entry.trackEnd = mixDuration;
      return entry;
    };
    AnimationState.prototype.addEmptyAnimation = function (trackIndex, mixDuration, delay) {
      if (delay <= 0) delay -= mixDuration;
      var entry = this.addAnimationWith(trackIndex, AnimationState.emptyAnimation, false, delay);
      entry.mixDuration = mixDuration;
      entry.trackEnd = mixDuration;
      return entry;
    };
    AnimationState.prototype.setEmptyAnimations = function (mixDuration) {
      var oldDrainDisabled = this.queue.drainDisabled;
      this.queue.drainDisabled = true;
      for (var i = 0, n = this.tracks.length; i < n; i++) {
        var current = this.tracks[i];
        if (current != null) this.setEmptyAnimation(current.trackIndex, mixDuration);
      }
      this.queue.drainDisabled = oldDrainDisabled;
      this.queue.drain();
    };
    AnimationState.prototype.expandToIndex = function (index) {
      if (index < this.tracks.length) return this.tracks[index];
      spine.Utils.ensureArrayCapacity(this.tracks, index - this.tracks.length + 1, null);
      this.tracks.length = index + 1;
      return null;
    };
    AnimationState.prototype.trackEntry = function (trackIndex, animation, loop, last) {
      var entry = this.trackEntryPool.obtain();
      entry.trackIndex = trackIndex;
      entry.animation = animation;
      entry.loop = loop;
      entry.eventThreshold = 0;
      entry.attachmentThreshold = 0;
      entry.drawOrderThreshold = 0;
      entry.animationStart = 0;
      entry.animationEnd = animation.duration;
      entry.animationLast = -1;
      entry.nextAnimationLast = -1;
      entry.delay = 0;
      entry.trackTime = 0;
      entry.trackLast = -1;
      entry.nextTrackLast = -1;
      entry.trackEnd = Number.MAX_VALUE;
      entry.timeScale = 1;
      entry.alpha = 1;
      entry.interruptAlpha = 1;
      entry.mixTime = 0;
      entry.mixDuration = last == null ? 0 : this.data.getMix(last.animation, animation);
      return entry;
    };
    AnimationState.prototype.disposeNext = function (entry) {
      var next = entry.next;
      while (next != null) {
        this.queue.dispose(next);
        next = next.next;
      }
      entry.next = null;
    };
    AnimationState.prototype._animationsChanged = function () {
      this.animationsChanged = false;
      var propertyIDs = this.propertyIDs;
      propertyIDs.clear();
      var mixingTo = this.mixingTo;
      for (var i = 0, n = this.tracks.length; i < n; i++) {
        var entry = this.tracks[i];
        if (entry != null) entry.setTimelineData(null, mixingTo, propertyIDs);
      }
    };
    AnimationState.prototype.getCurrent = function (trackIndex) {
      if (trackIndex >= this.tracks.length) return null;
      return this.tracks[trackIndex];
    };
    AnimationState.prototype.addListener = function (listener) {
      if (listener == null) throw new Error("listener cannot be null.");
      this.listeners.push(listener);
    };
    AnimationState.prototype.removeListener = function (listener) {
      var index = this.listeners.indexOf(listener);
      if (index >= 0) this.listeners.splice(index, 1);
    };
    AnimationState.prototype.clearListeners = function () {
      this.listeners.length = 0;
    };
    AnimationState.prototype.clearListenerNotifications = function () {
      this.queue.clear();
    };
    return AnimationState;
  }();
  AnimationState.emptyAnimation = new spine.Animation("<empty>", [], 0);
  AnimationState.SUBSEQUENT = 0;
  AnimationState.FIRST = 1;
  AnimationState.DIP = 2;
  AnimationState.DIP_MIX = 3;
  spine.AnimationState = AnimationState;
  var TrackEntry = function () {
    function TrackEntry() {
      this.timelineData = new Array();
      this.timelineDipMix = new Array();
      this.timelinesRotation = new Array();
    }
    TrackEntry.prototype.reset = function () {
      this.next = null;
      this.mixingFrom = null;
      this.animation = null;
      this.listener = null;
      this.timelineData.length = 0;
      this.timelineDipMix.length = 0;
      this.timelinesRotation.length = 0;
    };
    TrackEntry.prototype.setTimelineData = function (to, mixingToArray, propertyIDs) {
      if (to != null) mixingToArray.push(to);
      var lastEntry = this.mixingFrom != null ? this.mixingFrom.setTimelineData(this, mixingToArray, propertyIDs) : this;
      if (to != null) mixingToArray.pop();
      var mixingTo = mixingToArray;
      var mixingToLast = mixingToArray.length - 1;
      var timelines = this.animation.timelines;
      var timelinesCount = this.animation.timelines.length;
      var timelineData = spine.Utils.setArraySize(this.timelineData, timelinesCount);
      this.timelineDipMix.length = 0;
      var timelineDipMix = spine.Utils.setArraySize(this.timelineDipMix, timelinesCount);
      outer: for (var i = 0; i < timelinesCount; i++) {
        var id = timelines[i].getPropertyId();
        if (!propertyIDs.add(id)) timelineData[i] = AnimationState.SUBSEQUENT;else if (to == null || !to.hasTimeline(id)) timelineData[i] = AnimationState.FIRST;else {
          for (var ii = mixingToLast; ii >= 0; ii--) {
            var entry = mixingTo[ii];
            if (!entry.hasTimeline(id)) {
              if (entry.mixDuration > 0) {
                timelineData[i] = AnimationState.DIP_MIX;
                timelineDipMix[i] = entry;
                continue outer;
              }
            }
          }
          timelineData[i] = AnimationState.DIP;
        }
      }
      return lastEntry;
    };
    TrackEntry.prototype.hasTimeline = function (id) {
      var timelines = this.animation.timelines;
      for (var i = 0, n = timelines.length; i < n; i++) if (timelines[i].getPropertyId() == id) return true;
      return false;
    };
    TrackEntry.prototype.getAnimationTime = function () {
      if (this.loop) {
        var duration = this.animationEnd - this.animationStart;
        if (duration == 0) return this.animationStart;
        return this.trackTime % duration + this.animationStart;
      }
      return Math.min(this.trackTime + this.animationStart, this.animationEnd);
    };
    TrackEntry.prototype.setAnimationLast = function (animationLast) {
      this.animationLast = animationLast;
      this.nextAnimationLast = animationLast;
    };
    TrackEntry.prototype.isComplete = function () {
      return this.trackTime >= this.animationEnd - this.animationStart;
    };
    TrackEntry.prototype.resetRotationDirections = function () {
      this.timelinesRotation.length = 0;
    };
    return TrackEntry;
  }();
  spine.TrackEntry = TrackEntry;
  var EventQueue = function () {
    function EventQueue(animState) {
      this.objects = [];
      this.drainDisabled = false;
      this.animState = animState;
    }
    EventQueue.prototype.start = function (entry) {
      this.objects.push(EventType.start);
      this.objects.push(entry);
      this.animState.animationsChanged = true;
    };
    EventQueue.prototype.interrupt = function (entry) {
      this.objects.push(EventType.interrupt);
      this.objects.push(entry);
    };
    EventQueue.prototype.end = function (entry) {
      this.objects.push(EventType.end);
      this.objects.push(entry);
      this.animState.animationsChanged = true;
    };
    EventQueue.prototype.dispose = function (entry) {
      this.objects.push(EventType.dispose);
      this.objects.push(entry);
    };
    EventQueue.prototype.complete = function (entry) {
      this.objects.push(EventType.complete);
      this.objects.push(entry);
    };
    EventQueue.prototype.event = function (entry, event) {
      this.objects.push(EventType.event);
      this.objects.push(entry);
      this.objects.push(event);
    };
    EventQueue.prototype.drain = function () {
      if (this.drainDisabled) return;
      this.drainDisabled = true;
      var objects = this.objects;
      var listeners = this.animState.listeners;
      for (var i = 0; i < objects.length; i += 2) {
        var type = objects[i];
        var entry = objects[i + 1];
        switch (type) {
          case EventType.start:
            if (entry.listener != null && entry.listener.start) entry.listener.start(entry);
            for (var ii = 0; ii < listeners.length; ii++) if (listeners[ii].start) listeners[ii].start(entry);
            break;
          case EventType.interrupt:
            if (entry.listener != null && entry.listener.interrupt) entry.listener.interrupt(entry);
            for (var ii = 0; ii < listeners.length; ii++) if (listeners[ii].interrupt) listeners[ii].interrupt(entry);
            break;
          case EventType.end:
            if (entry.listener != null && entry.listener.end) entry.listener.end(entry);
            for (var ii = 0; ii < listeners.length; ii++) if (listeners[ii].end) listeners[ii].end(entry);
          case EventType.dispose:
            if (entry.listener != null && entry.listener.dispose) entry.listener.dispose(entry);
            for (var ii = 0; ii < listeners.length; ii++) if (listeners[ii].dispose) listeners[ii].dispose(entry);
            this.animState.trackEntryPool.free(entry);
            break;
          case EventType.complete:
            if (entry.listener != null && entry.listener.complete) entry.listener.complete(entry);
            for (var ii = 0; ii < listeners.length; ii++) if (listeners[ii].complete) listeners[ii].complete(entry);
            break;
          case EventType.event:
            var event_3 = objects[i++ + 2];
            if (entry.listener != null && entry.listener.event) entry.listener.event(entry, event_3);
            for (var ii = 0; ii < listeners.length; ii++) if (listeners[ii].event) listeners[ii].event(entry, event_3);
            break;
        }
      }
      this.clear();
      this.drainDisabled = false;
    };
    EventQueue.prototype.clear = function () {
      this.objects.length = 0;
    };
    return EventQueue;
  }();
  spine.EventQueue = EventQueue;
  var EventType;
  (function (EventType) {
    EventType[EventType["start"] = 0] = "start";
    EventType[EventType["interrupt"] = 1] = "interrupt";
    EventType[EventType["end"] = 2] = "end";
    EventType[EventType["dispose"] = 3] = "dispose";
    EventType[EventType["complete"] = 4] = "complete";
    EventType[EventType["event"] = 5] = "event";
  })(EventType = spine.EventType || (spine.EventType = {}));
  var AnimationStateAdapter2 = function () {
    function AnimationStateAdapter2() {}
    AnimationStateAdapter2.prototype.start = function (entry) {};
    AnimationStateAdapter2.prototype.interrupt = function (entry) {};
    AnimationStateAdapter2.prototype.end = function (entry) {};
    AnimationStateAdapter2.prototype.dispose = function (entry) {};
    AnimationStateAdapter2.prototype.complete = function (entry) {};
    AnimationStateAdapter2.prototype.event = function (entry, event) {};
    return AnimationStateAdapter2;
  }();
  spine.AnimationStateAdapter2 = AnimationStateAdapter2;
})(spine || (spine = {}));
var spine;
(function (spine) {
  var AnimationStateData = function () {
    function AnimationStateData(skeletonData) {
      this.animationToMixTime = {};
      this.defaultMix = 0;
      if (skeletonData == null) throw new Error("skeletonData cannot be null.");
      this.skeletonData = skeletonData;
    }
    AnimationStateData.prototype.setMix = function (fromName, toName, duration) {
      var from = this.skeletonData.findAnimation(fromName);
      if (from == null) throw new Error("Animation not found: " + fromName);
      var to = this.skeletonData.findAnimation(toName);
      if (to == null) throw new Error("Animation not found: " + toName);
      this.setMixWith(from, to, duration);
    };
    AnimationStateData.prototype.setMixWith = function (from, to, duration) {
      if (from == null) throw new Error("from cannot be null.");
      if (to == null) throw new Error("to cannot be null.");
      var key = from.name + "." + to.name;
      this.animationToMixTime[key] = duration;
    };
    AnimationStateData.prototype.getMix = function (from, to) {
      var key = from.name + "." + to.name;
      var value = this.animationToMixTime[key];
      return value === undefined ? this.defaultMix : value;
    };
    return AnimationStateData;
  }();
  spine.AnimationStateData = AnimationStateData;
})(spine || (spine = {}));
var spine;
(function (spine) {
  var AssetManager = function () {
    function AssetManager(textureLoader, pathPrefix) {
      if (pathPrefix === void 0) {
        pathPrefix = "";
      }
      this.assets = {};
      this.errors = {};
      this.toLoad = 0;
      this.loaded = 0;
      this.textureLoader = textureLoader;
      this.pathPrefix = pathPrefix;
    }
    AssetManager.downloadText = function (url, success, error) {
      var request = new XMLHttpRequest();
      request.open("GET", url, true);
      request.onload = function () {
        if (request.status == 200) {
          success(request.responseText);
        } else {
          error(request.status, request.responseText);
        }
      };
      request.onerror = function () {
        error(request.status, request.responseText);
      };
      request.send();
    };
    AssetManager.downloadBinary = function (url, success, error) {
      var request = new XMLHttpRequest();
      request.open("GET", url, true);
      request.responseType = "arraybuffer";
      request.onload = function () {
        if (request.status == 200) {
          success(new Uint8Array(request.response));
        } else {
          error(request.status, request.responseText);
        }
      };
      request.onerror = function () {
        error(request.status, request.responseText);
      };
      request.send();
    };
    AssetManager.prototype.loadText = function (path, success, error) {
      var _this = this;
      if (success === void 0) {
        success = null;
      }
      if (error === void 0) {
        error = null;
      }
      path = this.pathPrefix + path;
      this.toLoad++;
      AssetManager.downloadText(path, function (data) {
        _this.assets[path] = data;
        if (success) success(path, data);
        _this.toLoad--;
        _this.loaded++;
      }, function (state, responseText) {
        _this.errors[path] = "Couldn't load text " + path + ": status " + status + ", " + responseText;
        if (error) error(path, "Couldn't load text " + path + ": status " + status + ", " + responseText);
        _this.toLoad--;
        _this.loaded++;
      });
    };
    AssetManager.prototype.loadTexture = function (path, success, error) {
      var _this = this;
      if (success === void 0) {
        success = null;
      }
      if (error === void 0) {
        error = null;
      }
      path = this.pathPrefix + path;
      this.toLoad++;
      var img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = function (ev) {
        var texture = _this.textureLoader(img);
        _this.assets[path] = texture;
        _this.toLoad--;
        _this.loaded++;
        if (success) success(path, img);
      };
      img.onerror = function (ev) {
        _this.errors[path] = "Couldn't load image " + path;
        _this.toLoad--;
        _this.loaded++;
        if (error) error(path, "Couldn't load image " + path);
      };
      img.src = path;
    };
    AssetManager.prototype.loadTextureData = function (path, data, success, error) {
      var _this = this;
      if (success === void 0) {
        success = null;
      }
      if (error === void 0) {
        error = null;
      }
      path = this.pathPrefix + path;
      this.toLoad++;
      var img = new Image();
      img.onload = function (ev) {
        var texture = _this.textureLoader(img);
        _this.assets[path] = texture;
        _this.toLoad--;
        _this.loaded++;
        if (success) success(path, img);
      };
      img.onerror = function (ev) {
        _this.errors[path] = "Couldn't load image " + path;
        _this.toLoad--;
        _this.loaded++;
        if (error) error(path, "Couldn't load image " + path);
      };
      img.src = data;
    };
    AssetManager.prototype.loadTextureAtlas = function (path, success, error) {
      var _this = this;
      if (success === void 0) {
        success = null;
      }
      if (error === void 0) {
        error = null;
      }
      var parent = path.lastIndexOf("/") >= 0 ? path.substring(0, path.lastIndexOf("/")) : "";
      path = this.pathPrefix + path;
      this.toLoad++;
      AssetManager.downloadText(path, function (atlasData) {
        var pagesLoaded = {
          count: 0
        };
        var atlasPages = new Array();
        try {
          var atlas = new spine.TextureAtlas(atlasData, function (path) {
            atlasPages.push(parent + "/" + path);
            var image = document.createElement("img");
            image.width = 16;
            image.height = 16;
            return new spine.FakeTexture(image);
          });
        } catch (e) {
          var ex = e;
          _this.errors[path] = "Couldn't load texture atlas " + path + ": " + ex.message;
          if (error) error(path, "Couldn't load texture atlas " + path + ": " + ex.message);
          _this.toLoad--;
          _this.loaded++;
          return;
        }
        var _loop_1 = function _loop_1(atlasPage) {
          var pageLoadError = false;
          _this.loadTexture(atlasPage, function (imagePath, image) {
            pagesLoaded.count++;
            if (pagesLoaded.count == atlasPages.length) {
              if (!pageLoadError) {
                try {
                  var atlas = new spine.TextureAtlas(atlasData, function (path) {
                    return _this.get(parent + "/" + path);
                  });
                  _this.assets[path] = atlas;
                  if (success) success(path, atlas);
                  _this.toLoad--;
                  _this.loaded++;
                } catch (e) {
                  var ex = e;
                  _this.errors[path] = "Couldn't load texture atlas " + path + ": " + ex.message;
                  if (error) error(path, "Couldn't load texture atlas " + path + ": " + ex.message);
                  _this.toLoad--;
                  _this.loaded++;
                }
              } else {
                _this.errors[path] = "Couldn't load texture atlas page " + imagePath + "} of atlas " + path;
                if (error) error(path, "Couldn't load texture atlas page " + imagePath + " of atlas " + path);
                _this.toLoad--;
                _this.loaded++;
              }
            }
          }, function (imagePath, errorMessage) {
            pageLoadError = true;
            pagesLoaded.count++;
            if (pagesLoaded.count == atlasPages.length) {
              _this.errors[path] = "Couldn't load texture atlas page " + imagePath + "} of atlas " + path;
              if (error) error(path, "Couldn't load texture atlas page " + imagePath + " of atlas " + path);
              _this.toLoad--;
              _this.loaded++;
            }
          });
        };
        for (var _i = 0, atlasPages_1 = atlasPages; _i < atlasPages_1.length; _i++) {
          var atlasPage = atlasPages_1[_i];
          _loop_1(atlasPage);
        }
      }, function (state, responseText) {
        _this.errors[path] = "Couldn't load texture atlas " + path + ": status " + status + ", " + responseText;
        if (error) error(path, "Couldn't load texture atlas " + path + ": status " + status + ", " + responseText);
        _this.toLoad--;
        _this.loaded++;
      });
    };
    AssetManager.prototype.get = function (path) {
      path = this.pathPrefix + path;
      return this.assets[path];
    };
    AssetManager.prototype.remove = function (path) {
      path = this.pathPrefix + path;
      var asset = this.assets[path];
      if (asset.dispose) asset.dispose();
      this.assets[path] = null;
    };
    AssetManager.prototype.removeAll = function () {
      for (var key in this.assets) {
        var asset = this.assets[key];
        if (asset.dispose) asset.dispose();
      }
      this.assets = {};
    };
    AssetManager.prototype.isLoadingComplete = function () {
      return this.toLoad == 0;
    };
    AssetManager.prototype.getToLoad = function () {
      return this.toLoad;
    };
    AssetManager.prototype.getLoaded = function () {
      return this.loaded;
    };
    AssetManager.prototype.dispose = function () {
      this.removeAll();
    };
    AssetManager.prototype.hasErrors = function () {
      return Object.keys(this.errors).length > 0;
    };
    AssetManager.prototype.getErrors = function () {
      return this.errors;
    };
    return AssetManager;
  }();
  spine.AssetManager = AssetManager;
})(spine || (spine = {}));
var spine;
(function (spine) {
  var AtlasAttachmentLoader = function () {
    function AtlasAttachmentLoader(atlas) {
      this.atlas = atlas;
    }
    AtlasAttachmentLoader.prototype.newRegionAttachment = function (skin, name, path) {
      var region = this.atlas.findRegion(path);
      if (region == null) throw new Error("Region not found in atlas: " + path + " (region attachment: " + name + ")");
      region.renderObject = region;
      var attachment = new spine.RegionAttachment(name);
      attachment.setRegion(region);
      return attachment;
    };
    AtlasAttachmentLoader.prototype.newMeshAttachment = function (skin, name, path) {
      var region = this.atlas.findRegion(path);
      if (region == null) throw new Error("Region not found in atlas: " + path + " (mesh attachment: " + name + ")");
      region.renderObject = region;
      var attachment = new spine.MeshAttachment(name);
      attachment.region = region;
      return attachment;
    };
    AtlasAttachmentLoader.prototype.newBoundingBoxAttachment = function (skin, name) {
      return new spine.BoundingBoxAttachment(name);
    };
    AtlasAttachmentLoader.prototype.newPathAttachment = function (skin, name) {
      return new spine.PathAttachment(name);
    };
    AtlasAttachmentLoader.prototype.newPointAttachment = function (skin, name) {
      return new spine.PointAttachment(name);
    };
    AtlasAttachmentLoader.prototype.newClippingAttachment = function (skin, name) {
      return new spine.ClippingAttachment(name);
    };
    return AtlasAttachmentLoader;
  }();
  spine.AtlasAttachmentLoader = AtlasAttachmentLoader;
})(spine || (spine = {}));
var spine;
(function (spine) {
  var BlendMode;
  (function (BlendMode) {
    BlendMode[BlendMode["Normal"] = 0] = "Normal";
    BlendMode[BlendMode["Additive"] = 1] = "Additive";
    BlendMode[BlendMode["Multiply"] = 2] = "Multiply";
    BlendMode[BlendMode["Screen"] = 3] = "Screen";
  })(BlendMode = spine.BlendMode || (spine.BlendMode = {}));
})(spine || (spine = {}));
var spine;
(function (spine) {
  var Bone = function () {
    function Bone(data, skeleton, parent) {
      this.children = new Array();
      this.x = 0;
      this.y = 0;
      this.rotation = 0;
      this.scaleX = 0;
      this.scaleY = 0;
      this.shearX = 0;
      this.shearY = 0;
      this.ax = 0;
      this.ay = 0;
      this.arotation = 0;
      this.ascaleX = 0;
      this.ascaleY = 0;
      this.ashearX = 0;
      this.ashearY = 0;
      this.appliedValid = false;
      this.a = 0;
      this.b = 0;
      this.worldX = 0;
      this.c = 0;
      this.d = 0;
      this.worldY = 0;
      this.sorted = false;
      if (data == null) throw new Error("data cannot be null.");
      if (skeleton == null) throw new Error("skeleton cannot be null.");
      this.data = data;
      this.skeleton = skeleton;
      this.parent = parent;
      this.setToSetupPose();
    }
    Bone.prototype.update = function () {
      this.updateWorldTransformWith(this.x, this.y, this.rotation, this.scaleX, this.scaleY, this.shearX, this.shearY);
    };
    Bone.prototype.updateWorldTransform = function () {
      this.updateWorldTransformWith(this.x, this.y, this.rotation, this.scaleX, this.scaleY, this.shearX, this.shearY);
    };
    Bone.prototype.updateWorldTransformWith = function (x, y, rotation, scaleX, scaleY, shearX, shearY) {
      this.ax = x;
      this.ay = y;
      this.arotation = rotation;
      this.ascaleX = scaleX;
      this.ascaleY = scaleY;
      this.ashearX = shearX;
      this.ashearY = shearY;
      this.appliedValid = true;
      var parent = this.parent;
      if (parent == null) {
        var rotationY = rotation + 90 + shearY;
        var la = spine.MathUtils.cosDeg(rotation + shearX) * scaleX;
        var lb = spine.MathUtils.cosDeg(rotationY) * scaleY;
        var lc = spine.MathUtils.sinDeg(rotation + shearX) * scaleX;
        var ld = spine.MathUtils.sinDeg(rotationY) * scaleY;
        var skeleton = this.skeleton;
        if (skeleton.flipX) {
          x = -x;
          la = -la;
          lb = -lb;
        }
        if (skeleton.flipY) {
          y = -y;
          lc = -lc;
          ld = -ld;
        }
        this.a = la;
        this.b = lb;
        this.c = lc;
        this.d = ld;
        this.worldX = x + skeleton.x;
        this.worldY = y + skeleton.y;
        return;
      }
      var pa = parent.a,
        pb = parent.b,
        pc = parent.c,
        pd = parent.d;
      this.worldX = pa * x + pb * y + parent.worldX;
      this.worldY = pc * x + pd * y + parent.worldY;
      switch (this.data.transformMode) {
        case spine.TransformMode.Normal:
          {
            var rotationY = rotation + 90 + shearY;
            var la = spine.MathUtils.cosDeg(rotation + shearX) * scaleX;
            var lb = spine.MathUtils.cosDeg(rotationY) * scaleY;
            var lc = spine.MathUtils.sinDeg(rotation + shearX) * scaleX;
            var ld = spine.MathUtils.sinDeg(rotationY) * scaleY;
            this.a = pa * la + pb * lc;
            this.b = pa * lb + pb * ld;
            this.c = pc * la + pd * lc;
            this.d = pc * lb + pd * ld;
            return;
          }
        case spine.TransformMode.OnlyTranslation:
          {
            var rotationY = rotation + 90 + shearY;
            this.a = spine.MathUtils.cosDeg(rotation + shearX) * scaleX;
            this.b = spine.MathUtils.cosDeg(rotationY) * scaleY;
            this.c = spine.MathUtils.sinDeg(rotation + shearX) * scaleX;
            this.d = spine.MathUtils.sinDeg(rotationY) * scaleY;
            break;
          }
        case spine.TransformMode.NoRotationOrReflection:
          {
            var s = pa * pa + pc * pc;
            var prx = 0;
            if (s > 0.0001) {
              s = Math.abs(pa * pd - pb * pc) / s;
              pb = pc * s;
              pd = pa * s;
              prx = Math.atan2(pc, pa) * spine.MathUtils.radDeg;
            } else {
              pa = 0;
              pc = 0;
              prx = 90 - Math.atan2(pd, pb) * spine.MathUtils.radDeg;
            }
            var rx = rotation + shearX - prx;
            var ry = rotation + shearY - prx + 90;
            var la = spine.MathUtils.cosDeg(rx) * scaleX;
            var lb = spine.MathUtils.cosDeg(ry) * scaleY;
            var lc = spine.MathUtils.sinDeg(rx) * scaleX;
            var ld = spine.MathUtils.sinDeg(ry) * scaleY;
            this.a = pa * la - pb * lc;
            this.b = pa * lb - pb * ld;
            this.c = pc * la + pd * lc;
            this.d = pc * lb + pd * ld;
            break;
          }
        case spine.TransformMode.NoScale:
        case spine.TransformMode.NoScaleOrReflection:
          {
            var cos = spine.MathUtils.cosDeg(rotation);
            var sin = spine.MathUtils.sinDeg(rotation);
            var za = pa * cos + pb * sin;
            var zc = pc * cos + pd * sin;
            var s = Math.sqrt(za * za + zc * zc);
            if (s > 0.00001) s = 1 / s;
            za *= s;
            zc *= s;
            s = Math.sqrt(za * za + zc * zc);
            var r = Math.PI / 2 + Math.atan2(zc, za);
            var zb = Math.cos(r) * s;
            var zd = Math.sin(r) * s;
            var la = spine.MathUtils.cosDeg(shearX) * scaleX;
            var lb = spine.MathUtils.cosDeg(90 + shearY) * scaleY;
            var lc = spine.MathUtils.sinDeg(shearX) * scaleX;
            var ld = spine.MathUtils.sinDeg(90 + shearY) * scaleY;
            if (this.data.transformMode != spine.TransformMode.NoScaleOrReflection ? pa * pd - pb * pc < 0 : this.skeleton.flipX != this.skeleton.flipY) {
              zb = -zb;
              zd = -zd;
            }
            this.a = za * la + zb * lc;
            this.b = za * lb + zb * ld;
            this.c = zc * la + zd * lc;
            this.d = zc * lb + zd * ld;
            return;
          }
      }
      if (this.skeleton.flipX) {
        this.a = -this.a;
        this.b = -this.b;
      }
      if (this.skeleton.flipY) {
        this.c = -this.c;
        this.d = -this.d;
      }
    };
    Bone.prototype.setToSetupPose = function () {
      var data = this.data;
      this.x = data.x;
      this.y = data.y;
      this.rotation = data.rotation;
      this.scaleX = data.scaleX;
      this.scaleY = data.scaleY;
      this.shearX = data.shearX;
      this.shearY = data.shearY;
    };
    Bone.prototype.getWorldRotationX = function () {
      return Math.atan2(this.c, this.a) * spine.MathUtils.radDeg;
    };
    Bone.prototype.getWorldRotationY = function () {
      return Math.atan2(this.d, this.b) * spine.MathUtils.radDeg;
    };
    Bone.prototype.getWorldScaleX = function () {
      return Math.sqrt(this.a * this.a + this.c * this.c);
    };
    Bone.prototype.getWorldScaleY = function () {
      return Math.sqrt(this.b * this.b + this.d * this.d);
    };
    Bone.prototype.updateAppliedTransform = function () {
      this.appliedValid = true;
      var parent = this.parent;
      if (parent == null) {
        this.ax = this.worldX;
        this.ay = this.worldY;
        this.arotation = Math.atan2(this.c, this.a) * spine.MathUtils.radDeg;
        this.ascaleX = Math.sqrt(this.a * this.a + this.c * this.c);
        this.ascaleY = Math.sqrt(this.b * this.b + this.d * this.d);
        this.ashearX = 0;
        this.ashearY = Math.atan2(this.a * this.b + this.c * this.d, this.a * this.d - this.b * this.c) * spine.MathUtils.radDeg;
        return;
      }
      var pa = parent.a,
        pb = parent.b,
        pc = parent.c,
        pd = parent.d;
      var pid = 1 / (pa * pd - pb * pc);
      var dx = this.worldX - parent.worldX,
        dy = this.worldY - parent.worldY;
      this.ax = dx * pd * pid - dy * pb * pid;
      this.ay = dy * pa * pid - dx * pc * pid;
      var ia = pid * pd;
      var id = pid * pa;
      var ib = pid * pb;
      var ic = pid * pc;
      var ra = ia * this.a - ib * this.c;
      var rb = ia * this.b - ib * this.d;
      var rc = id * this.c - ic * this.a;
      var rd = id * this.d - ic * this.b;
      this.ashearX = 0;
      this.ascaleX = Math.sqrt(ra * ra + rc * rc);
      if (this.ascaleX > 0.0001) {
        var det = ra * rd - rb * rc;
        this.ascaleY = det / this.ascaleX;
        this.ashearY = Math.atan2(ra * rb + rc * rd, det) * spine.MathUtils.radDeg;
        this.arotation = Math.atan2(rc, ra) * spine.MathUtils.radDeg;
      } else {
        this.ascaleX = 0;
        this.ascaleY = Math.sqrt(rb * rb + rd * rd);
        this.ashearY = 0;
        this.arotation = 90 - Math.atan2(rd, rb) * spine.MathUtils.radDeg;
      }
    };
    Bone.prototype.worldToLocal = function (world) {
      var a = this.a,
        b = this.b,
        c = this.c,
        d = this.d;
      var invDet = 1 / (a * d - b * c);
      var x = world.x - this.worldX,
        y = world.y - this.worldY;
      world.x = x * d * invDet - y * b * invDet;
      world.y = y * a * invDet - x * c * invDet;
      return world;
    };
    Bone.prototype.localToWorld = function (local) {
      var x = local.x,
        y = local.y;
      local.x = x * this.a + y * this.b + this.worldX;
      local.y = x * this.c + y * this.d + this.worldY;
      return local;
    };
    Bone.prototype.worldToLocalRotation = function (worldRotation) {
      var sin = spine.MathUtils.sinDeg(worldRotation),
        cos = spine.MathUtils.cosDeg(worldRotation);
      return Math.atan2(this.a * sin - this.c * cos, this.d * cos - this.b * sin) * spine.MathUtils.radDeg;
    };
    Bone.prototype.localToWorldRotation = function (localRotation) {
      var sin = spine.MathUtils.sinDeg(localRotation),
        cos = spine.MathUtils.cosDeg(localRotation);
      return Math.atan2(cos * this.c + sin * this.d, cos * this.a + sin * this.b) * spine.MathUtils.radDeg;
    };
    Bone.prototype.rotateWorld = function (degrees) {
      var a = this.a,
        b = this.b,
        c = this.c,
        d = this.d;
      var cos = spine.MathUtils.cosDeg(degrees),
        sin = spine.MathUtils.sinDeg(degrees);
      this.a = cos * a - sin * c;
      this.b = cos * b - sin * d;
      this.c = sin * a + cos * c;
      this.d = sin * b + cos * d;
      this.appliedValid = false;
    };
    return Bone;
  }();
  spine.Bone = Bone;
})(spine || (spine = {}));
var spine;
(function (spine) {
  var BoneData = function () {
    function BoneData(index, name, parent) {
      this.x = 0;
      this.y = 0;
      this.rotation = 0;
      this.scaleX = 1;
      this.scaleY = 1;
      this.shearX = 0;
      this.shearY = 0;
      this.transformMode = TransformMode.Normal;
      if (index < 0) throw new Error("index must be >= 0.");
      if (name == null) throw new Error("name cannot be null.");
      this.index = index;
      this.name = name;
      this.parent = parent;
    }
    return BoneData;
  }();
  spine.BoneData = BoneData;
  var TransformMode;
  (function (TransformMode) {
    TransformMode[TransformMode["Normal"] = 0] = "Normal";
    TransformMode[TransformMode["OnlyTranslation"] = 1] = "OnlyTranslation";
    TransformMode[TransformMode["NoRotationOrReflection"] = 2] = "NoRotationOrReflection";
    TransformMode[TransformMode["NoScale"] = 3] = "NoScale";
    TransformMode[TransformMode["NoScaleOrReflection"] = 4] = "NoScaleOrReflection";
  })(TransformMode = spine.TransformMode || (spine.TransformMode = {}));
})(spine || (spine = {}));
var spine;
(function (spine) {
  var Event = function () {
    function Event(time, data) {
      if (data == null) throw new Error("data cannot be null.");
      this.time = time;
      this.data = data;
    }
    return Event;
  }();
  spine.Event = Event;
})(spine || (spine = {}));
var spine;
(function (spine) {
  var EventData = function () {
    function EventData(name) {
      this.name = name;
    }
    return EventData;
  }();
  spine.EventData = EventData;
})(spine || (spine = {}));
var spine;
(function (spine) {
  var IkConstraint = function () {
    function IkConstraint(data, skeleton) {
      this.mix = 1;
      this.bendDirection = 0;
      if (data == null) throw new Error("data cannot be null.");
      if (skeleton == null) throw new Error("skeleton cannot be null.");
      this.data = data;
      this.mix = data.mix;
      this.bendDirection = data.bendDirection;
      this.bones = new Array();
      for (var i = 0; i < data.bones.length; i++) this.bones.push(skeleton.findBone(data.bones[i].name));
      this.target = skeleton.findBone(data.target.name);
    }
    IkConstraint.prototype.getOrder = function () {
      return this.data.order;
    };
    IkConstraint.prototype.apply = function () {
      this.update();
    };
    IkConstraint.prototype.update = function () {
      var target = this.target;
      var bones = this.bones;
      switch (bones.length) {
        case 1:
          this.apply1(bones[0], target.worldX, target.worldY, this.mix);
          break;
        case 2:
          this.apply2(bones[0], bones[1], target.worldX, target.worldY, this.bendDirection, this.mix);
          break;
      }
    };
    IkConstraint.prototype.apply1 = function (bone, targetX, targetY, alpha) {
      if (!bone.appliedValid) bone.updateAppliedTransform();
      var p = bone.parent;
      var id = 1 / (p.a * p.d - p.b * p.c);
      var x = targetX - p.worldX,
        y = targetY - p.worldY;
      var tx = (x * p.d - y * p.b) * id - bone.ax,
        ty = (y * p.a - x * p.c) * id - bone.ay;
      var rotationIK = Math.atan2(ty, tx) * spine.MathUtils.radDeg - bone.ashearX - bone.arotation;
      if (bone.ascaleX < 0) rotationIK += 180;
      if (rotationIK > 180) rotationIK -= 360;else if (rotationIK < -180) rotationIK += 360;
      bone.updateWorldTransformWith(bone.ax, bone.ay, bone.arotation + rotationIK * alpha, bone.ascaleX, bone.ascaleY, bone.ashearX, bone.ashearY);
    };
    IkConstraint.prototype.apply2 = function (parent, child, targetX, targetY, bendDir, alpha) {
      if (alpha == 0) {
        child.updateWorldTransform();
        return;
      }
      if (!parent.appliedValid) parent.updateAppliedTransform();
      if (!child.appliedValid) child.updateAppliedTransform();
      var px = parent.ax,
        py = parent.ay,
        psx = parent.ascaleX,
        psy = parent.ascaleY,
        csx = child.ascaleX;
      var os1 = 0,
        os2 = 0,
        s2 = 0;
      if (psx < 0) {
        psx = -psx;
        os1 = 180;
        s2 = -1;
      } else {
        os1 = 0;
        s2 = 1;
      }
      if (psy < 0) {
        psy = -psy;
        s2 = -s2;
      }
      if (csx < 0) {
        csx = -csx;
        os2 = 180;
      } else os2 = 0;
      var cx = child.ax,
        cy = 0,
        cwx = 0,
        cwy = 0,
        a = parent.a,
        b = parent.b,
        c = parent.c,
        d = parent.d;
      var u = Math.abs(psx - psy) <= 0.0001;
      if (!u) {
        cy = 0;
        cwx = a * cx + parent.worldX;
        cwy = c * cx + parent.worldY;
      } else {
        cy = child.ay;
        cwx = a * cx + b * cy + parent.worldX;
        cwy = c * cx + d * cy + parent.worldY;
      }
      var pp = parent.parent;
      a = pp.a;
      b = pp.b;
      c = pp.c;
      d = pp.d;
      var id = 1 / (a * d - b * c),
        x = targetX - pp.worldX,
        y = targetY - pp.worldY;
      var tx = (x * d - y * b) * id - px,
        ty = (y * a - x * c) * id - py;
      x = cwx - pp.worldX;
      y = cwy - pp.worldY;
      var dx = (x * d - y * b) * id - px,
        dy = (y * a - x * c) * id - py;
      var l1 = Math.sqrt(dx * dx + dy * dy),
        l2 = child.data.length * csx,
        a1 = 0,
        a2 = 0;
      outer: if (u) {
        l2 *= psx;
        var cos = (tx * tx + ty * ty - l1 * l1 - l2 * l2) / (2 * l1 * l2);
        if (cos < -1) cos = -1;else if (cos > 1) cos = 1;
        a2 = Math.acos(cos) * bendDir;
        a = l1 + l2 * cos;
        b = l2 * Math.sin(a2);
        a1 = Math.atan2(ty * a - tx * b, tx * a + ty * b);
      } else {
        a = psx * l2;
        b = psy * l2;
        var aa = a * a,
          bb = b * b,
          dd = tx * tx + ty * ty,
          ta = Math.atan2(ty, tx);
        c = bb * l1 * l1 + aa * dd - aa * bb;
        var c1 = -2 * bb * l1,
          c2 = bb - aa;
        d = c1 * c1 - 4 * c2 * c;
        if (d >= 0) {
          var q = Math.sqrt(d);
          if (c1 < 0) q = -q;
          q = -(c1 + q) / 2;
          var r0 = q / c2,
            r1 = c / q;
          var r = Math.abs(r0) < Math.abs(r1) ? r0 : r1;
          if (r * r <= dd) {
            y = Math.sqrt(dd - r * r) * bendDir;
            a1 = ta - Math.atan2(y, r);
            a2 = Math.atan2(y / psy, (r - l1) / psx);
            break outer;
          }
        }
        var minAngle = spine.MathUtils.PI,
          minX = l1 - a,
          minDist = minX * minX,
          minY = 0;
        var maxAngle = 0,
          maxX = l1 + a,
          maxDist = maxX * maxX,
          maxY = 0;
        c = -a * l1 / (aa - bb);
        if (c >= -1 && c <= 1) {
          c = Math.acos(c);
          x = a * Math.cos(c) + l1;
          y = b * Math.sin(c);
          d = x * x + y * y;
          if (d < minDist) {
            minAngle = c;
            minDist = d;
            minX = x;
            minY = y;
          }
          if (d > maxDist) {
            maxAngle = c;
            maxDist = d;
            maxX = x;
            maxY = y;
          }
        }
        if (dd <= (minDist + maxDist) / 2) {
          a1 = ta - Math.atan2(minY * bendDir, minX);
          a2 = minAngle * bendDir;
        } else {
          a1 = ta - Math.atan2(maxY * bendDir, maxX);
          a2 = maxAngle * bendDir;
        }
      }
      var os = Math.atan2(cy, cx) * s2;
      var rotation = parent.arotation;
      a1 = (a1 - os) * spine.MathUtils.radDeg + os1 - rotation;
      if (a1 > 180) a1 -= 360;else if (a1 < -180) a1 += 360;
      parent.updateWorldTransformWith(px, py, rotation + a1 * alpha, parent.ascaleX, parent.ascaleY, 0, 0);
      rotation = child.arotation;
      a2 = ((a2 + os) * spine.MathUtils.radDeg - child.ashearX) * s2 + os2 - rotation;
      if (a2 > 180) a2 -= 360;else if (a2 < -180) a2 += 360;
      child.updateWorldTransformWith(cx, cy, rotation + a2 * alpha, child.ascaleX, child.ascaleY, child.ashearX, child.ashearY);
    };
    return IkConstraint;
  }();
  spine.IkConstraint = IkConstraint;
})(spine || (spine = {}));
var spine;
(function (spine) {
  var IkConstraintData = function () {
    function IkConstraintData(name) {
      this.order = 0;
      this.bones = new Array();
      this.bendDirection = 1;
      this.mix = 1;
      this.name = name;
    }
    return IkConstraintData;
  }();
  spine.IkConstraintData = IkConstraintData;
})(spine || (spine = {}));
var spine;
(function (spine) {
  var PathConstraint = function () {
    function PathConstraint(data, skeleton) {
      this.position = 0;
      this.spacing = 0;
      this.rotateMix = 0;
      this.translateMix = 0;
      this.spaces = new Array();
      this.positions = new Array();
      this.world = new Array();
      this.curves = new Array();
      this.lengths = new Array();
      this.segments = new Array();
      if (data == null) throw new Error("data cannot be null.");
      if (skeleton == null) throw new Error("skeleton cannot be null.");
      this.data = data;
      this.bones = new Array();
      for (var i = 0, n = data.bones.length; i < n; i++) this.bones.push(skeleton.findBone(data.bones[i].name));
      this.target = skeleton.findSlot(data.target.name);
      this.position = data.position;
      this.spacing = data.spacing;
      this.rotateMix = data.rotateMix;
      this.translateMix = data.translateMix;
    }
    PathConstraint.prototype.apply = function () {
      this.update();
    };
    PathConstraint.prototype.update = function () {
      var attachment = this.target.getAttachment();
      if (!(attachment instanceof spine.PathAttachment)) return;
      var rotateMix = this.rotateMix,
        translateMix = this.translateMix;
      var translate = translateMix > 0,
        rotate = rotateMix > 0;
      if (!translate && !rotate) return;
      var data = this.data;
      var spacingMode = data.spacingMode;
      var lengthSpacing = spacingMode == spine.SpacingMode.Length;
      var rotateMode = data.rotateMode;
      var tangents = rotateMode == spine.RotateMode.Tangent,
        scale = rotateMode == spine.RotateMode.ChainScale;
      var boneCount = this.bones.length,
        spacesCount = tangents ? boneCount : boneCount + 1;
      var bones = this.bones;
      var spaces = spine.Utils.setArraySize(this.spaces, spacesCount),
        lengths = null;
      var spacing = this.spacing;
      if (scale || lengthSpacing) {
        if (scale) lengths = spine.Utils.setArraySize(this.lengths, boneCount);
        for (var i = 0, n = spacesCount - 1; i < n;) {
          var bone = bones[i];
          var setupLength = bone.data.length;
          if (setupLength < PathConstraint.epsilon) {
            if (scale) lengths[i] = 0;
            spaces[++i] = 0;
          } else {
            var x = setupLength * bone.a,
              y = setupLength * bone.c;
            var length_1 = Math.sqrt(x * x + y * y);
            if (scale) lengths[i] = length_1;
            spaces[++i] = (lengthSpacing ? setupLength + spacing : spacing) * length_1 / setupLength;
          }
        }
      } else {
        for (var i = 1; i < spacesCount; i++) spaces[i] = spacing;
      }
      var positions = this.computeWorldPositions(attachment, spacesCount, tangents, data.positionMode == spine.PositionMode.Percent, spacingMode == spine.SpacingMode.Percent);
      var boneX = positions[0],
        boneY = positions[1],
        offsetRotation = data.offsetRotation;
      var tip = false;
      if (offsetRotation == 0) tip = rotateMode == spine.RotateMode.Chain;else {
        tip = false;
        var p = this.target.bone;
        offsetRotation *= p.a * p.d - p.b * p.c > 0 ? spine.MathUtils.degRad : -spine.MathUtils.degRad;
      }
      for (var i = 0, p = 3; i < boneCount; i++, p += 3) {
        var bone = bones[i];
        bone.worldX += (boneX - bone.worldX) * translateMix;
        bone.worldY += (boneY - bone.worldY) * translateMix;
        var x = positions[p],
          y = positions[p + 1],
          dx = x - boneX,
          dy = y - boneY;
        if (scale) {
          var length_2 = lengths[i];
          if (length_2 != 0) {
            var s = (Math.sqrt(dx * dx + dy * dy) / length_2 - 1) * rotateMix + 1;
            bone.a *= s;
            bone.c *= s;
          }
        }
        boneX = x;
        boneY = y;
        if (rotate) {
          var a = bone.a,
            b = bone.b,
            c = bone.c,
            d = bone.d,
            r = 0,
            cos = 0,
            sin = 0;
          if (tangents) r = positions[p - 1];else if (spaces[i + 1] == 0) r = positions[p + 2];else r = Math.atan2(dy, dx);
          r -= Math.atan2(c, a);
          if (tip) {
            cos = Math.cos(r);
            sin = Math.sin(r);
            var length_3 = bone.data.length;
            boneX += (length_3 * (cos * a - sin * c) - dx) * rotateMix;
            boneY += (length_3 * (sin * a + cos * c) - dy) * rotateMix;
          } else {
            r += offsetRotation;
          }
          if (r > spine.MathUtils.PI) r -= spine.MathUtils.PI2;else if (r < -spine.MathUtils.PI) r += spine.MathUtils.PI2;
          r *= rotateMix;
          cos = Math.cos(r);
          sin = Math.sin(r);
          bone.a = cos * a - sin * c;
          bone.b = cos * b - sin * d;
          bone.c = sin * a + cos * c;
          bone.d = sin * b + cos * d;
        }
        bone.appliedValid = false;
      }
    };
    PathConstraint.prototype.computeWorldPositions = function (path, spacesCount, tangents, percentPosition, percentSpacing) {
      var target = this.target;
      var position = this.position;
      var spaces = this.spaces,
        out = spine.Utils.setArraySize(this.positions, spacesCount * 3 + 2),
        world = null;
      var closed = path.closed;
      var verticesLength = path.worldVerticesLength,
        curveCount = verticesLength / 6,
        prevCurve = PathConstraint.NONE;
      if (!path.constantSpeed) {
        var lengths = path.lengths;
        curveCount -= closed ? 1 : 2;
        var pathLength_1 = lengths[curveCount];
        if (percentPosition) position *= pathLength_1;
        if (percentSpacing) {
          for (var i = 0; i < spacesCount; i++) spaces[i] *= pathLength_1;
        }
        world = spine.Utils.setArraySize(this.world, 8);
        for (var i = 0, o = 0, curve = 0; i < spacesCount; i++, o += 3) {
          var space = spaces[i];
          position += space;
          var p = position;
          if (closed) {
            p %= pathLength_1;
            if (p < 0) p += pathLength_1;
            curve = 0;
          } else if (p < 0) {
            if (prevCurve != PathConstraint.BEFORE) {
              prevCurve = PathConstraint.BEFORE;
              path.computeWorldVertices(target, 2, 4, world, 0, 2);
            }
            this.addBeforePosition(p, world, 0, out, o);
            continue;
          } else if (p > pathLength_1) {
            if (prevCurve != PathConstraint.AFTER) {
              prevCurve = PathConstraint.AFTER;
              path.computeWorldVertices(target, verticesLength - 6, 4, world, 0, 2);
            }
            this.addAfterPosition(p - pathLength_1, world, 0, out, o);
            continue;
          }
          for (;; curve++) {
            var length_4 = lengths[curve];
            if (p > length_4) continue;
            if (curve == 0) p /= length_4;else {
              var prev = lengths[curve - 1];
              p = (p - prev) / (length_4 - prev);
            }
            break;
          }
          if (curve != prevCurve) {
            prevCurve = curve;
            if (closed && curve == curveCount) {
              path.computeWorldVertices(target, verticesLength - 4, 4, world, 0, 2);
              path.computeWorldVertices(target, 0, 4, world, 4, 2);
            } else path.computeWorldVertices(target, curve * 6 + 2, 8, world, 0, 2);
          }
          this.addCurvePosition(p, world[0], world[1], world[2], world[3], world[4], world[5], world[6], world[7], out, o, tangents || i > 0 && space == 0);
        }
        return out;
      }
      if (closed) {
        verticesLength += 2;
        world = spine.Utils.setArraySize(this.world, verticesLength);
        path.computeWorldVertices(target, 2, verticesLength - 4, world, 0, 2);
        path.computeWorldVertices(target, 0, 2, world, verticesLength - 4, 2);
        world[verticesLength - 2] = world[0];
        world[verticesLength - 1] = world[1];
      } else {
        curveCount--;
        verticesLength -= 4;
        world = spine.Utils.setArraySize(this.world, verticesLength);
        path.computeWorldVertices(target, 2, verticesLength, world, 0, 2);
      }
      var curves = spine.Utils.setArraySize(this.curves, curveCount);
      var pathLength = 0;
      var x1 = world[0],
        y1 = world[1],
        cx1 = 0,
        cy1 = 0,
        cx2 = 0,
        cy2 = 0,
        x2 = 0,
        y2 = 0;
      var tmpx = 0,
        tmpy = 0,
        dddfx = 0,
        dddfy = 0,
        ddfx = 0,
        ddfy = 0,
        dfx = 0,
        dfy = 0;
      for (var i = 0, w = 2; i < curveCount; i++, w += 6) {
        cx1 = world[w];
        cy1 = world[w + 1];
        cx2 = world[w + 2];
        cy2 = world[w + 3];
        x2 = world[w + 4];
        y2 = world[w + 5];
        tmpx = (x1 - cx1 * 2 + cx2) * 0.1875;
        tmpy = (y1 - cy1 * 2 + cy2) * 0.1875;
        dddfx = ((cx1 - cx2) * 3 - x1 + x2) * 0.09375;
        dddfy = ((cy1 - cy2) * 3 - y1 + y2) * 0.09375;
        ddfx = tmpx * 2 + dddfx;
        ddfy = tmpy * 2 + dddfy;
        dfx = (cx1 - x1) * 0.75 + tmpx + dddfx * 0.16666667;
        dfy = (cy1 - y1) * 0.75 + tmpy + dddfy * 0.16666667;
        pathLength += Math.sqrt(dfx * dfx + dfy * dfy);
        dfx += ddfx;
        dfy += ddfy;
        ddfx += dddfx;
        ddfy += dddfy;
        pathLength += Math.sqrt(dfx * dfx + dfy * dfy);
        dfx += ddfx;
        dfy += ddfy;
        pathLength += Math.sqrt(dfx * dfx + dfy * dfy);
        dfx += ddfx + dddfx;
        dfy += ddfy + dddfy;
        pathLength += Math.sqrt(dfx * dfx + dfy * dfy);
        curves[i] = pathLength;
        x1 = x2;
        y1 = y2;
      }
      if (percentPosition) position *= pathLength;
      if (percentSpacing) {
        for (var i = 0; i < spacesCount; i++) spaces[i] *= pathLength;
      }
      var segments = this.segments;
      var curveLength = 0;
      for (var i = 0, o = 0, curve = 0, segment = 0; i < spacesCount; i++, o += 3) {
        var space = spaces[i];
        position += space;
        var p = position;
        if (closed) {
          p %= pathLength;
          if (p < 0) p += pathLength;
          curve = 0;
        } else if (p < 0) {
          this.addBeforePosition(p, world, 0, out, o);
          continue;
        } else if (p > pathLength) {
          this.addAfterPosition(p - pathLength, world, verticesLength - 4, out, o);
          continue;
        }
        for (;; curve++) {
          var length_5 = curves[curve];
          if (p > length_5) continue;
          if (curve == 0) p /= length_5;else {
            var prev = curves[curve - 1];
            p = (p - prev) / (length_5 - prev);
          }
          break;
        }
        if (curve != prevCurve) {
          prevCurve = curve;
          var ii = curve * 6;
          x1 = world[ii];
          y1 = world[ii + 1];
          cx1 = world[ii + 2];
          cy1 = world[ii + 3];
          cx2 = world[ii + 4];
          cy2 = world[ii + 5];
          x2 = world[ii + 6];
          y2 = world[ii + 7];
          tmpx = (x1 - cx1 * 2 + cx2) * 0.03;
          tmpy = (y1 - cy1 * 2 + cy2) * 0.03;
          dddfx = ((cx1 - cx2) * 3 - x1 + x2) * 0.006;
          dddfy = ((cy1 - cy2) * 3 - y1 + y2) * 0.006;
          ddfx = tmpx * 2 + dddfx;
          ddfy = tmpy * 2 + dddfy;
          dfx = (cx1 - x1) * 0.3 + tmpx + dddfx * 0.16666667;
          dfy = (cy1 - y1) * 0.3 + tmpy + dddfy * 0.16666667;
          curveLength = Math.sqrt(dfx * dfx + dfy * dfy);
          segments[0] = curveLength;
          for (ii = 1; ii < 8; ii++) {
            dfx += ddfx;
            dfy += ddfy;
            ddfx += dddfx;
            ddfy += dddfy;
            curveLength += Math.sqrt(dfx * dfx + dfy * dfy);
            segments[ii] = curveLength;
          }
          dfx += ddfx;
          dfy += ddfy;
          curveLength += Math.sqrt(dfx * dfx + dfy * dfy);
          segments[8] = curveLength;
          dfx += ddfx + dddfx;
          dfy += ddfy + dddfy;
          curveLength += Math.sqrt(dfx * dfx + dfy * dfy);
          segments[9] = curveLength;
          segment = 0;
        }
        p *= curveLength;
        for (;; segment++) {
          var length_6 = segments[segment];
          if (p > length_6) continue;
          if (segment == 0) p /= length_6;else {
            var prev = segments[segment - 1];
            p = segment + (p - prev) / (length_6 - prev);
          }
          break;
        }
        this.addCurvePosition(p * 0.1, x1, y1, cx1, cy1, cx2, cy2, x2, y2, out, o, tangents || i > 0 && space == 0);
      }
      return out;
    };
    PathConstraint.prototype.addBeforePosition = function (p, temp, i, out, o) {
      var x1 = temp[i],
        y1 = temp[i + 1],
        dx = temp[i + 2] - x1,
        dy = temp[i + 3] - y1,
        r = Math.atan2(dy, dx);
      out[o] = x1 + p * Math.cos(r);
      out[o + 1] = y1 + p * Math.sin(r);
      out[o + 2] = r;
    };
    PathConstraint.prototype.addAfterPosition = function (p, temp, i, out, o) {
      var x1 = temp[i + 2],
        y1 = temp[i + 3],
        dx = x1 - temp[i],
        dy = y1 - temp[i + 1],
        r = Math.atan2(dy, dx);
      out[o] = x1 + p * Math.cos(r);
      out[o + 1] = y1 + p * Math.sin(r);
      out[o + 2] = r;
    };
    PathConstraint.prototype.addCurvePosition = function (p, x1, y1, cx1, cy1, cx2, cy2, x2, y2, out, o, tangents) {
      if (p == 0 || isNaN(p)) p = 0.0001;
      var tt = p * p,
        ttt = tt * p,
        u = 1 - p,
        uu = u * u,
        uuu = uu * u;
      var ut = u * p,
        ut3 = ut * 3,
        uut3 = u * ut3,
        utt3 = ut3 * p;
      var x = x1 * uuu + cx1 * uut3 + cx2 * utt3 + x2 * ttt,
        y = y1 * uuu + cy1 * uut3 + cy2 * utt3 + y2 * ttt;
      out[o] = x;
      out[o + 1] = y;
      if (tangents) out[o + 2] = Math.atan2(y - (y1 * uu + cy1 * ut * 2 + cy2 * tt), x - (x1 * uu + cx1 * ut * 2 + cx2 * tt));
    };
    PathConstraint.prototype.getOrder = function () {
      return this.data.order;
    };
    return PathConstraint;
  }();
  PathConstraint.NONE = -1;
  PathConstraint.BEFORE = -2;
  PathConstraint.AFTER = -3;
  PathConstraint.epsilon = 0.00001;
  spine.PathConstraint = PathConstraint;
})(spine || (spine = {}));
var spine;
(function (spine) {
  var PathConstraintData = function () {
    function PathConstraintData(name) {
      this.order = 0;
      this.bones = new Array();
      this.name = name;
    }
    return PathConstraintData;
  }();
  spine.PathConstraintData = PathConstraintData;
  var PositionMode;
  (function (PositionMode) {
    PositionMode[PositionMode["Fixed"] = 0] = "Fixed";
    PositionMode[PositionMode["Percent"] = 1] = "Percent";
  })(PositionMode = spine.PositionMode || (spine.PositionMode = {}));
  var SpacingMode;
  (function (SpacingMode) {
    SpacingMode[SpacingMode["Length"] = 0] = "Length";
    SpacingMode[SpacingMode["Fixed"] = 1] = "Fixed";
    SpacingMode[SpacingMode["Percent"] = 2] = "Percent";
  })(SpacingMode = spine.SpacingMode || (spine.SpacingMode = {}));
  var RotateMode;
  (function (RotateMode) {
    RotateMode[RotateMode["Tangent"] = 0] = "Tangent";
    RotateMode[RotateMode["Chain"] = 1] = "Chain";
    RotateMode[RotateMode["ChainScale"] = 2] = "ChainScale";
  })(RotateMode = spine.RotateMode || (spine.RotateMode = {}));
})(spine || (spine = {}));
(function () {
  if (!Math.fround) {
    Math.fround = function (array) {
      return function (x) {
        return array[0] = x, array[0];
      };
    }(new Float32Array(1));
  }
})();
var spine;
(function (spine) {
  var Assets = function () {
    function Assets(clientId) {
      this.toLoad = new Array();
      this.assets = {};
      this.clientId = clientId;
    }
    Assets.prototype.loaded = function () {
      var i = 0;
      for (var v in this.assets) i++;
      return i;
    };
    return Assets;
  }();
  var SharedAssetManager = function () {
    function SharedAssetManager(pathPrefix) {
      if (pathPrefix === void 0) {
        pathPrefix = "";
      }
      this.clientAssets = {};
      this.queuedAssets = {};
      this.rawAssets = {};
      this.errors = {};
      this.pathPrefix = pathPrefix;
    }
    SharedAssetManager.prototype.queueAsset = function (clientId, textureLoader, path) {
      var clientAssets = this.clientAssets[clientId];
      if (clientAssets === null || clientAssets === undefined) {
        clientAssets = new Assets(clientId);
        this.clientAssets[clientId] = clientAssets;
      }
      if (textureLoader !== null) clientAssets.textureLoader = textureLoader;
      clientAssets.toLoad.push(path);
      if (this.queuedAssets[path] === path) {
        return false;
      } else {
        this.queuedAssets[path] = path;
        return true;
      }
    };
    SharedAssetManager.prototype.loadText = function (clientId, path) {
      var _this = this;
      path = this.pathPrefix + path;
      if (!this.queueAsset(clientId, null, path)) return;
      var request = new XMLHttpRequest();
      request.onreadystatechange = function () {
        if (request.readyState == XMLHttpRequest.DONE) {
          if (request.status >= 200 && request.status < 300) {
            _this.rawAssets[path] = request.responseText;
          } else {
            _this.errors[path] = "Couldn't load text " + path + ": status " + request.status + ", " + request.responseText;
          }
        }
      };
      request.open("GET", path, true);
      request.send();
    };
    SharedAssetManager.prototype.loadJson = function (clientId, path) {
      var _this = this;
      path = this.pathPrefix + path;
      if (!this.queueAsset(clientId, null, path)) return;
      var request = new XMLHttpRequest();
      request.onreadystatechange = function () {
        if (request.readyState == XMLHttpRequest.DONE) {
          if (request.status >= 200 && request.status < 300) {
            _this.rawAssets[path] = JSON.parse(request.responseText);
          } else {
            _this.errors[path] = "Couldn't load text " + path + ": status " + request.status + ", " + request.responseText;
          }
        }
      };
      request.open("GET", path, true);
      request.send();
    };
    SharedAssetManager.prototype.loadTexture = function (clientId, textureLoader, path) {
      var _this = this;
      path = this.pathPrefix + path;
      if (!this.queueAsset(clientId, textureLoader, path)) return;
      var img = new Image();
      img.src = path;
      img.crossOrigin = "anonymous";
      img.onload = function (ev) {
        _this.rawAssets[path] = img;
      };
      img.onerror = function (ev) {
        _this.errors[path] = "Couldn't load image " + path;
      };
    };
    SharedAssetManager.prototype.get = function (clientId, path) {
      path = this.pathPrefix + path;
      var clientAssets = this.clientAssets[clientId];
      if (clientAssets === null || clientAssets === undefined) return true;
      return clientAssets.assets[path];
    };
    SharedAssetManager.prototype.updateClientAssets = function (clientAssets) {
      for (var i = 0; i < clientAssets.toLoad.length; i++) {
        var path = clientAssets.toLoad[i];
        var asset = clientAssets.assets[path];
        if (asset === null || asset === undefined) {
          var rawAsset = this.rawAssets[path];
          if (rawAsset === null || rawAsset === undefined) continue;
          if (rawAsset instanceof HTMLImageElement) {
            clientAssets.assets[path] = clientAssets.textureLoader(rawAsset);
          } else {
            clientAssets.assets[path] = rawAsset;
          }
        }
      }
    };
    SharedAssetManager.prototype.isLoadingComplete = function (clientId) {
      var clientAssets = this.clientAssets[clientId];
      if (clientAssets === null || clientAssets === undefined) return true;
      this.updateClientAssets(clientAssets);
      return clientAssets.toLoad.length == clientAssets.loaded();
    };
    SharedAssetManager.prototype.dispose = function () {};
    SharedAssetManager.prototype.hasErrors = function () {
      return Object.keys(this.errors).length > 0;
    };
    SharedAssetManager.prototype.getErrors = function () {
      return this.errors;
    };
    return SharedAssetManager;
  }();
  spine.SharedAssetManager = SharedAssetManager;
})(spine || (spine = {}));
var spine;
(function (spine) {
  var Skeleton = function () {
    function Skeleton(data) {
      this._updateCache = new Array();
      this.updateCacheReset = new Array();
      this.time = 0;
      this.flipX = false;
      this.flipY = false;
      this.x = 0;
      this.y = 0;
      if (data == null) throw new Error("data cannot be null.");
      this.data = data;
      this.bones = new Array();
      for (var i = 0; i < data.bones.length; i++) {
        var boneData = data.bones[i];
        var bone = void 0;
        if (boneData.parent == null) bone = new spine.Bone(boneData, this, null);else {
          var parent_1 = this.bones[boneData.parent.index];
          bone = new spine.Bone(boneData, this, parent_1);
          parent_1.children.push(bone);
        }
        this.bones.push(bone);
      }
      this.slots = new Array();
      this.drawOrder = new Array();
      for (var i = 0; i < data.slots.length; i++) {
        var slotData = data.slots[i];
        var bone = this.bones[slotData.boneData.index];
        var slot = new spine.Slot(slotData, bone);
        this.slots.push(slot);
        this.drawOrder.push(slot);
      }
      this.ikConstraints = new Array();
      for (var i = 0; i < data.ikConstraints.length; i++) {
        var ikConstraintData = data.ikConstraints[i];
        this.ikConstraints.push(new spine.IkConstraint(ikConstraintData, this));
      }
      this.transformConstraints = new Array();
      for (var i = 0; i < data.transformConstraints.length; i++) {
        var transformConstraintData = data.transformConstraints[i];
        this.transformConstraints.push(new spine.TransformConstraint(transformConstraintData, this));
      }
      this.pathConstraints = new Array();
      for (var i = 0; i < data.pathConstraints.length; i++) {
        var pathConstraintData = data.pathConstraints[i];
        this.pathConstraints.push(new spine.PathConstraint(pathConstraintData, this));
      }
      this.color = new spine.Color(1, 1, 1, 1);
      this.updateCache();
    }
    Skeleton.prototype.updateCache = function () {
      var updateCache = this._updateCache;
      updateCache.length = 0;
      this.updateCacheReset.length = 0;
      var bones = this.bones;
      for (var i = 0, n = bones.length; i < n; i++) bones[i].sorted = false;
      var ikConstraints = this.ikConstraints;
      var transformConstraints = this.transformConstraints;
      var pathConstraints = this.pathConstraints;
      var ikCount = ikConstraints.length,
        transformCount = transformConstraints.length,
        pathCount = pathConstraints.length;
      var constraintCount = ikCount + transformCount + pathCount;
      outer: for (var i = 0; i < constraintCount; i++) {
        for (var ii = 0; ii < ikCount; ii++) {
          var constraint = ikConstraints[ii];
          if (constraint.data.order == i) {
            this.sortIkConstraint(constraint);
            continue outer;
          }
        }
        for (var ii = 0; ii < transformCount; ii++) {
          var constraint = transformConstraints[ii];
          if (constraint.data.order == i) {
            this.sortTransformConstraint(constraint);
            continue outer;
          }
        }
        for (var ii = 0; ii < pathCount; ii++) {
          var constraint = pathConstraints[ii];
          if (constraint.data.order == i) {
            this.sortPathConstraint(constraint);
            continue outer;
          }
        }
      }
      for (var i = 0, n = bones.length; i < n; i++) this.sortBone(bones[i]);
    };
    Skeleton.prototype.sortIkConstraint = function (constraint) {
      var target = constraint.target;
      this.sortBone(target);
      var constrained = constraint.bones;
      var parent = constrained[0];
      this.sortBone(parent);
      if (constrained.length > 1) {
        var child = constrained[constrained.length - 1];
        if (!(this._updateCache.indexOf(child) > -1)) this.updateCacheReset.push(child);
      }
      this._updateCache.push(constraint);
      this.sortReset(parent.children);
      constrained[constrained.length - 1].sorted = true;
    };
    Skeleton.prototype.sortPathConstraint = function (constraint) {
      var slot = constraint.target;
      var slotIndex = slot.data.index;
      var slotBone = slot.bone;
      if (this.skin != null) this.sortPathConstraintAttachment(this.skin, slotIndex, slotBone);
      if (this.data.defaultSkin != null && this.data.defaultSkin != this.skin) this.sortPathConstraintAttachment(this.data.defaultSkin, slotIndex, slotBone);
      for (var i = 0, n = this.data.skins.length; i < n; i++) this.sortPathConstraintAttachment(this.data.skins[i], slotIndex, slotBone);
      var attachment = slot.getAttachment();
      if (attachment instanceof spine.PathAttachment) this.sortPathConstraintAttachmentWith(attachment, slotBone);
      var constrained = constraint.bones;
      var boneCount = constrained.length;
      for (var i = 0; i < boneCount; i++) this.sortBone(constrained[i]);
      this._updateCache.push(constraint);
      for (var i = 0; i < boneCount; i++) this.sortReset(constrained[i].children);
      for (var i = 0; i < boneCount; i++) constrained[i].sorted = true;
    };
    Skeleton.prototype.sortTransformConstraint = function (constraint) {
      this.sortBone(constraint.target);
      var constrained = constraint.bones;
      var boneCount = constrained.length;
      if (constraint.data.local) {
        for (var i = 0; i < boneCount; i++) {
          var child = constrained[i];
          this.sortBone(child.parent);
          if (!(this._updateCache.indexOf(child) > -1)) this.updateCacheReset.push(child);
        }
      } else {
        for (var i = 0; i < boneCount; i++) {
          this.sortBone(constrained[i]);
        }
      }
      this._updateCache.push(constraint);
      for (var ii = 0; ii < boneCount; ii++) this.sortReset(constrained[ii].children);
      for (var ii = 0; ii < boneCount; ii++) constrained[ii].sorted = true;
    };
    Skeleton.prototype.sortPathConstraintAttachment = function (skin, slotIndex, slotBone) {
      var attachments = skin.attachments[slotIndex];
      if (!attachments) return;
      for (var key in attachments) {
        this.sortPathConstraintAttachmentWith(attachments[key], slotBone);
      }
    };
    Skeleton.prototype.sortPathConstraintAttachmentWith = function (attachment, slotBone) {
      if (!(attachment instanceof spine.PathAttachment)) return;
      var pathBones = attachment.bones;
      if (pathBones == null) this.sortBone(slotBone);else {
        var bones = this.bones;
        var i = 0;
        while (i < pathBones.length) {
          var boneCount = pathBones[i++];
          for (var n = i + boneCount; i < n; i++) {
            var boneIndex = pathBones[i];
            this.sortBone(bones[boneIndex]);
          }
        }
      }
    };
    Skeleton.prototype.sortBone = function (bone) {
      if (bone.sorted) return;
      var parent = bone.parent;
      if (parent != null) this.sortBone(parent);
      bone.sorted = true;
      this._updateCache.push(bone);
    };
    Skeleton.prototype.sortReset = function (bones) {
      for (var i = 0, n = bones.length; i < n; i++) {
        var bone = bones[i];
        if (bone.sorted) this.sortReset(bone.children);
        bone.sorted = false;
      }
    };
    Skeleton.prototype.updateWorldTransform = function () {
      var updateCacheReset = this.updateCacheReset;
      for (var i = 0, n = updateCacheReset.length; i < n; i++) {
        var bone = updateCacheReset[i];
        bone.ax = bone.x;
        bone.ay = bone.y;
        bone.arotation = bone.rotation;
        bone.ascaleX = bone.scaleX;
        bone.ascaleY = bone.scaleY;
        bone.ashearX = bone.shearX;
        bone.ashearY = bone.shearY;
        bone.appliedValid = true;
      }
      var updateCache = this._updateCache;
      for (var i = 0, n = updateCache.length; i < n; i++) updateCache[i].update();
    };
    Skeleton.prototype.setToSetupPose = function () {
      this.setBonesToSetupPose();
      this.setSlotsToSetupPose();
    };
    Skeleton.prototype.setBonesToSetupPose = function () {
      var bones = this.bones;
      for (var i = 0, n = bones.length; i < n; i++) bones[i].setToSetupPose();
      var ikConstraints = this.ikConstraints;
      for (var i = 0, n = ikConstraints.length; i < n; i++) {
        var constraint = ikConstraints[i];
        constraint.bendDirection = constraint.data.bendDirection;
        constraint.mix = constraint.data.mix;
      }
      var transformConstraints = this.transformConstraints;
      for (var i = 0, n = transformConstraints.length; i < n; i++) {
        var constraint = transformConstraints[i];
        var data = constraint.data;
        constraint.rotateMix = data.rotateMix;
        constraint.translateMix = data.translateMix;
        constraint.scaleMix = data.scaleMix;
        constraint.shearMix = data.shearMix;
      }
      var pathConstraints = this.pathConstraints;
      for (var i = 0, n = pathConstraints.length; i < n; i++) {
        var constraint = pathConstraints[i];
        var data = constraint.data;
        constraint.position = data.position;
        constraint.spacing = data.spacing;
        constraint.rotateMix = data.rotateMix;
        constraint.translateMix = data.translateMix;
      }
    };
    Skeleton.prototype.setSlotsToSetupPose = function () {
      var slots = this.slots;
      spine.Utils.arrayCopy(slots, 0, this.drawOrder, 0, slots.length);
      for (var i = 0, n = slots.length; i < n; i++) slots[i].setToSetupPose();
    };
    Skeleton.prototype.getRootBone = function () {
      if (this.bones.length == 0) return null;
      return this.bones[0];
    };
    Skeleton.prototype.findBone = function (boneName) {
      if (boneName == null) throw new Error("boneName cannot be null.");
      var bones = this.bones;
      for (var i = 0, n = bones.length; i < n; i++) {
        var bone = bones[i];
        if (bone.data.name == boneName) return bone;
      }
      return null;
    };
    Skeleton.prototype.findBoneIndex = function (boneName) {
      if (boneName == null) throw new Error("boneName cannot be null.");
      var bones = this.bones;
      for (var i = 0, n = bones.length; i < n; i++) if (bones[i].data.name == boneName) return i;
      return -1;
    };
    Skeleton.prototype.findSlot = function (slotName) {
      if (slotName == null) throw new Error("slotName cannot be null.");
      var slots = this.slots;
      for (var i = 0, n = slots.length; i < n; i++) {
        var slot = slots[i];
        if (slot.data.name == slotName) return slot;
      }
      return null;
    };
    Skeleton.prototype.findSlotIndex = function (slotName) {
      if (slotName == null) throw new Error("slotName cannot be null.");
      var slots = this.slots;
      for (var i = 0, n = slots.length; i < n; i++) if (slots[i].data.name == slotName) return i;
      return -1;
    };
    Skeleton.prototype.setSkinByName = function (skinName) {
      var skin = this.data.findSkin(skinName);
      if (skin == null) throw new Error("Skin not found: " + skinName);
      this.setSkin(skin);
    };
    Skeleton.prototype.setSkin = function (newSkin) {
      if (newSkin != null) {
        if (this.skin != null) newSkin.attachAll(this, this.skin);else {
          var slots = this.slots;
          for (var i = 0, n = slots.length; i < n; i++) {
            var slot = slots[i];
            var name_1 = slot.data.attachmentName;
            if (name_1 != null) {
              var attachment = newSkin.getAttachment(i, name_1);
              if (attachment != null) slot.setAttachment(attachment);
            }
          }
        }
      }
      this.skin = newSkin;
    };
    Skeleton.prototype.getAttachmentByName = function (slotName, attachmentName) {
      return this.getAttachment(this.data.findSlotIndex(slotName), attachmentName);
    };
    Skeleton.prototype.getAttachment = function (slotIndex, attachmentName) {
      if (attachmentName == null) throw new Error("attachmentName cannot be null.");
      if (this.skin != null) {
        var attachment = this.skin.getAttachment(slotIndex, attachmentName);
        if (attachment != null) return attachment;
      }
      if (this.data.defaultSkin != null) return this.data.defaultSkin.getAttachment(slotIndex, attachmentName);
      return null;
    };
    Skeleton.prototype.setAttachment = function (slotName, attachmentName) {
      if (slotName == null) throw new Error("slotName cannot be null.");
      var slots = this.slots;
      for (var i = 0, n = slots.length; i < n; i++) {
        var slot = slots[i];
        if (slot.data.name == slotName) {
          var attachment = null;
          if (attachmentName != null) {
            attachment = this.getAttachment(i, attachmentName);
            if (attachment == null) throw new Error("Attachment not found: " + attachmentName + ", for slot: " + slotName);
          }
          slot.setAttachment(attachment);
          return;
        }
      }
      throw new Error("Slot not found: " + slotName);
    };
    Skeleton.prototype.findIkConstraint = function (constraintName) {
      if (constraintName == null) throw new Error("constraintName cannot be null.");
      var ikConstraints = this.ikConstraints;
      for (var i = 0, n = ikConstraints.length; i < n; i++) {
        var ikConstraint = ikConstraints[i];
        if (ikConstraint.data.name == constraintName) return ikConstraint;
      }
      return null;
    };
    Skeleton.prototype.findTransformConstraint = function (constraintName) {
      if (constraintName == null) throw new Error("constraintName cannot be null.");
      var transformConstraints = this.transformConstraints;
      for (var i = 0, n = transformConstraints.length; i < n; i++) {
        var constraint = transformConstraints[i];
        if (constraint.data.name == constraintName) return constraint;
      }
      return null;
    };
    Skeleton.prototype.findPathConstraint = function (constraintName) {
      if (constraintName == null) throw new Error("constraintName cannot be null.");
      var pathConstraints = this.pathConstraints;
      for (var i = 0, n = pathConstraints.length; i < n; i++) {
        var constraint = pathConstraints[i];
        if (constraint.data.name == constraintName) return constraint;
      }
      return null;
    };
    Skeleton.prototype.getBounds = function (offset, size, temp) {
      if (offset == null) throw new Error("offset cannot be null.");
      if (size == null) throw new Error("size cannot be null.");
      var drawOrder = this.drawOrder;
      var minX = Number.POSITIVE_INFINITY,
        minY = Number.POSITIVE_INFINITY,
        maxX = Number.NEGATIVE_INFINITY,
        maxY = Number.NEGATIVE_INFINITY;
      for (var i = 0, n = drawOrder.length; i < n; i++) {
        var slot = drawOrder[i];
        var verticesLength = 0;
        var vertices = null;
        var attachment = slot.getAttachment();
        if (attachment instanceof spine.RegionAttachment) {
          verticesLength = 8;
          vertices = spine.Utils.setArraySize(temp, verticesLength, 0);
          attachment.computeWorldVertices(slot.bone, vertices, 0, 2);
        } else if (attachment instanceof spine.MeshAttachment) {
          var mesh = attachment;
          verticesLength = mesh.worldVerticesLength;
          vertices = spine.Utils.setArraySize(temp, verticesLength, 0);
          mesh.computeWorldVertices(slot, 0, verticesLength, vertices, 0, 2);
        }
        if (vertices != null) {
          for (var ii = 0, nn = vertices.length; ii < nn; ii += 2) {
            var x = vertices[ii],
              y = vertices[ii + 1];
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
          }
        }
      }
      offset.set(minX, minY);
      size.set(maxX - minX, maxY - minY);
    };
    Skeleton.prototype.update = function (delta) {
      this.time += delta;
    };
    return Skeleton;
  }();
  spine.Skeleton = Skeleton;
})(spine || (spine = {}));
var spine;
(function (spine) {
  var SkeletonBounds = function () {
    function SkeletonBounds() {
      this.minX = 0;
      this.minY = 0;
      this.maxX = 0;
      this.maxY = 0;
      this.boundingBoxes = new Array();
      this.polygons = new Array();
      this.polygonPool = new spine.Pool(function () {
        return spine.Utils.newFloatArray(16);
      });
    }
    SkeletonBounds.prototype.update = function (skeleton, updateAabb) {
      if (skeleton == null) throw new Error("skeleton cannot be null.");
      var boundingBoxes = this.boundingBoxes;
      var polygons = this.polygons;
      var polygonPool = this.polygonPool;
      var slots = skeleton.slots;
      var slotCount = slots.length;
      boundingBoxes.length = 0;
      polygonPool.freeAll(polygons);
      polygons.length = 0;
      for (var i = 0; i < slotCount; i++) {
        var slot = slots[i];
        var attachment = slot.getAttachment();
        if (attachment instanceof spine.BoundingBoxAttachment) {
          var boundingBox = attachment;
          boundingBoxes.push(boundingBox);
          var polygon = polygonPool.obtain();
          if (polygon.length != boundingBox.worldVerticesLength) {
            polygon = spine.Utils.newFloatArray(boundingBox.worldVerticesLength);
          }
          polygons.push(polygon);
          boundingBox.computeWorldVertices(slot, 0, boundingBox.worldVerticesLength, polygon, 0, 2);
        }
      }
      if (updateAabb) {
        this.aabbCompute();
      } else {
        this.minX = Number.POSITIVE_INFINITY;
        this.minY = Number.POSITIVE_INFINITY;
        this.maxX = Number.NEGATIVE_INFINITY;
        this.maxY = Number.NEGATIVE_INFINITY;
      }
    };
    SkeletonBounds.prototype.aabbCompute = function () {
      var minX = Number.POSITIVE_INFINITY,
        minY = Number.POSITIVE_INFINITY,
        maxX = Number.NEGATIVE_INFINITY,
        maxY = Number.NEGATIVE_INFINITY;
      var polygons = this.polygons;
      for (var i = 0, n = polygons.length; i < n; i++) {
        var polygon = polygons[i];
        var vertices = polygon;
        for (var ii = 0, nn = polygon.length; ii < nn; ii += 2) {
          var x = vertices[ii];
          var y = vertices[ii + 1];
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }
      this.minX = minX;
      this.minY = minY;
      this.maxX = maxX;
      this.maxY = maxY;
    };
    SkeletonBounds.prototype.aabbContainsPoint = function (x, y) {
      return x >= this.minX && x <= this.maxX && y >= this.minY && y <= this.maxY;
    };
    SkeletonBounds.prototype.aabbIntersectsSegment = function (x1, y1, x2, y2) {
      var minX = this.minX;
      var minY = this.minY;
      var maxX = this.maxX;
      var maxY = this.maxY;
      if (x1 <= minX && x2 <= minX || y1 <= minY && y2 <= minY || x1 >= maxX && x2 >= maxX || y1 >= maxY && y2 >= maxY) return false;
      var m = (y2 - y1) / (x2 - x1);
      var y = m * (minX - x1) + y1;
      if (y > minY && y < maxY) return true;
      y = m * (maxX - x1) + y1;
      if (y > minY && y < maxY) return true;
      var x = (minY - y1) / m + x1;
      if (x > minX && x < maxX) return true;
      x = (maxY - y1) / m + x1;
      if (x > minX && x < maxX) return true;
      return false;
    };
    SkeletonBounds.prototype.aabbIntersectsSkeleton = function (bounds) {
      return this.minX < bounds.maxX && this.maxX > bounds.minX && this.minY < bounds.maxY && this.maxY > bounds.minY;
    };
    SkeletonBounds.prototype.containsPoint = function (x, y) {
      var polygons = this.polygons;
      for (var i = 0, n = polygons.length; i < n; i++) if (this.containsPointPolygon(polygons[i], x, y)) return this.boundingBoxes[i];
      return null;
    };
    SkeletonBounds.prototype.containsPointPolygon = function (polygon, x, y) {
      var vertices = polygon;
      var nn = polygon.length;
      var prevIndex = nn - 2;
      var inside = false;
      for (var ii = 0; ii < nn; ii += 2) {
        var vertexY = vertices[ii + 1];
        var prevY = vertices[prevIndex + 1];
        if (vertexY < y && prevY >= y || prevY < y && vertexY >= y) {
          var vertexX = vertices[ii];
          if (vertexX + (y - vertexY) / (prevY - vertexY) * (vertices[prevIndex] - vertexX) < x) inside = !inside;
        }
        prevIndex = ii;
      }
      return inside;
    };
    SkeletonBounds.prototype.intersectsSegment = function (x1, y1, x2, y2) {
      var polygons = this.polygons;
      for (var i = 0, n = polygons.length; i < n; i++) if (this.intersectsSegmentPolygon(polygons[i], x1, y1, x2, y2)) return this.boundingBoxes[i];
      return null;
    };
    SkeletonBounds.prototype.intersectsSegmentPolygon = function (polygon, x1, y1, x2, y2) {
      var vertices = polygon;
      var nn = polygon.length;
      var width12 = x1 - x2,
        height12 = y1 - y2;
      var det1 = x1 * y2 - y1 * x2;
      var x3 = vertices[nn - 2],
        y3 = vertices[nn - 1];
      for (var ii = 0; ii < nn; ii += 2) {
        var x4 = vertices[ii],
          y4 = vertices[ii + 1];
        var det2 = x3 * y4 - y3 * x4;
        var width34 = x3 - x4,
          height34 = y3 - y4;
        var det3 = width12 * height34 - height12 * width34;
        var x = (det1 * width34 - width12 * det2) / det3;
        if ((x >= x3 && x <= x4 || x >= x4 && x <= x3) && (x >= x1 && x <= x2 || x >= x2 && x <= x1)) {
          var y = (det1 * height34 - height12 * det2) / det3;
          if ((y >= y3 && y <= y4 || y >= y4 && y <= y3) && (y >= y1 && y <= y2 || y >= y2 && y <= y1)) return true;
        }
        x3 = x4;
        y3 = y4;
      }
      return false;
    };
    SkeletonBounds.prototype.getPolygon = function (boundingBox) {
      if (boundingBox == null) throw new Error("boundingBox cannot be null.");
      var index = this.boundingBoxes.indexOf(boundingBox);
      return index == -1 ? null : this.polygons[index];
    };
    SkeletonBounds.prototype.getWidth = function () {
      return this.maxX - this.minX;
    };
    SkeletonBounds.prototype.getHeight = function () {
      return this.maxY - this.minY;
    };
    return SkeletonBounds;
  }();
  spine.SkeletonBounds = SkeletonBounds;
})(spine || (spine = {}));
var spine;
(function (spine) {
  var SkeletonClipping = function () {
    function SkeletonClipping() {
      this.triangulator = new spine.Triangulator();
      this.clippingPolygon = new Array();
      this.clipOutput = new Array();
      this.clippedVertices = new Array();
      this.clippedTriangles = new Array();
      this.scratch = new Array();
    }
    SkeletonClipping.prototype.clipStart = function (slot, clip) {
      if (this.clipAttachment != null) return 0;
      this.clipAttachment = clip;
      var n = clip.worldVerticesLength;
      var vertices = spine.Utils.setArraySize(this.clippingPolygon, n);
      clip.computeWorldVertices(slot, 0, n, vertices, 0, 2);
      var clippingPolygon = this.clippingPolygon;
      SkeletonClipping.makeClockwise(clippingPolygon);
      var clippingPolygons = this.clippingPolygons = this.triangulator.decompose(clippingPolygon, this.triangulator.triangulate(clippingPolygon));
      for (var i = 0, n_1 = clippingPolygons.length; i < n_1; i++) {
        var polygon = clippingPolygons[i];
        SkeletonClipping.makeClockwise(polygon);
        polygon.push(polygon[0]);
        polygon.push(polygon[1]);
      }
      return clippingPolygons.length;
    };
    SkeletonClipping.prototype.clipEndWithSlot = function (slot) {
      if (this.clipAttachment != null && this.clipAttachment.endSlot == slot.data) this.clipEnd();
    };
    SkeletonClipping.prototype.clipEnd = function () {
      if (this.clipAttachment == null) return;
      this.clipAttachment = null;
      this.clippingPolygons = null;
      this.clippedVertices.length = 0;
      this.clippedTriangles.length = 0;
      this.clippingPolygon.length = 0;
    };
    SkeletonClipping.prototype.isClipping = function () {
      return this.clipAttachment != null;
    };
    SkeletonClipping.prototype.clipTriangles = function (vertices, verticesLength, triangles, trianglesLength, uvs, light, dark, twoColor) {
      var clipOutput = this.clipOutput,
        clippedVertices = this.clippedVertices;
      var clippedTriangles = this.clippedTriangles;
      var polygons = this.clippingPolygons;
      var polygonsCount = this.clippingPolygons.length;
      var vertexSize = twoColor ? 12 : 8;
      var index = 0;
      clippedVertices.length = 0;
      clippedTriangles.length = 0;
      outer: for (var i = 0; i < trianglesLength; i += 3) {
        var vertexOffset = triangles[i] << 1;
        var x1 = vertices[vertexOffset],
          y1 = vertices[vertexOffset + 1];
        var u1 = uvs[vertexOffset],
          v1 = uvs[vertexOffset + 1];
        vertexOffset = triangles[i + 1] << 1;
        var x2 = vertices[vertexOffset],
          y2 = vertices[vertexOffset + 1];
        var u2 = uvs[vertexOffset],
          v2 = uvs[vertexOffset + 1];
        vertexOffset = triangles[i + 2] << 1;
        var x3 = vertices[vertexOffset],
          y3 = vertices[vertexOffset + 1];
        var u3 = uvs[vertexOffset],
          v3 = uvs[vertexOffset + 1];
        for (var p = 0; p < polygonsCount; p++) {
          var s = clippedVertices.length;
          if (this.clip(x1, y1, x2, y2, x3, y3, polygons[p], clipOutput)) {
            var clipOutputLength = clipOutput.length;
            if (clipOutputLength == 0) continue;
            var d0 = y2 - y3,
              d1 = x3 - x2,
              d2 = x1 - x3,
              d4 = y3 - y1;
            var d = 1 / (d0 * d2 + d1 * (y1 - y3));
            var clipOutputCount = clipOutputLength >> 1;
            var clipOutputItems = this.clipOutput;
            var clippedVerticesItems = spine.Utils.setArraySize(clippedVertices, s + clipOutputCount * vertexSize);
            for (var ii = 0; ii < clipOutputLength; ii += 2) {
              var x = clipOutputItems[ii],
                y = clipOutputItems[ii + 1];
              clippedVerticesItems[s] = x;
              clippedVerticesItems[s + 1] = y;
              clippedVerticesItems[s + 2] = light.r;
              clippedVerticesItems[s + 3] = light.g;
              clippedVerticesItems[s + 4] = light.b;
              clippedVerticesItems[s + 5] = light.a;
              var c0 = x - x3,
                c1 = y - y3;
              var a = (d0 * c0 + d1 * c1) * d;
              var b = (d4 * c0 + d2 * c1) * d;
              var c = 1 - a - b;
              clippedVerticesItems[s + 6] = u1 * a + u2 * b + u3 * c;
              clippedVerticesItems[s + 7] = v1 * a + v2 * b + v3 * c;
              if (twoColor) {
                clippedVerticesItems[s + 8] = dark.r;
                clippedVerticesItems[s + 9] = dark.g;
                clippedVerticesItems[s + 10] = dark.b;
                clippedVerticesItems[s + 11] = dark.a;
              }
              s += vertexSize;
            }
            s = clippedTriangles.length;
            var clippedTrianglesItems = spine.Utils.setArraySize(clippedTriangles, s + 3 * (clipOutputCount - 2));
            clipOutputCount--;
            for (var ii = 1; ii < clipOutputCount; ii++) {
              clippedTrianglesItems[s] = index;
              clippedTrianglesItems[s + 1] = index + ii;
              clippedTrianglesItems[s + 2] = index + ii + 1;
              s += 3;
            }
            index += clipOutputCount + 1;
          } else {
            var clippedVerticesItems = spine.Utils.setArraySize(clippedVertices, s + 3 * vertexSize);
            clippedVerticesItems[s] = x1;
            clippedVerticesItems[s + 1] = y1;
            clippedVerticesItems[s + 2] = light.r;
            clippedVerticesItems[s + 3] = light.g;
            clippedVerticesItems[s + 4] = light.b;
            clippedVerticesItems[s + 5] = light.a;
            if (!twoColor) {
              clippedVerticesItems[s + 6] = u1;
              clippedVerticesItems[s + 7] = v1;
              clippedVerticesItems[s + 8] = x2;
              clippedVerticesItems[s + 9] = y2;
              clippedVerticesItems[s + 10] = light.r;
              clippedVerticesItems[s + 11] = light.g;
              clippedVerticesItems[s + 12] = light.b;
              clippedVerticesItems[s + 13] = light.a;
              clippedVerticesItems[s + 14] = u2;
              clippedVerticesItems[s + 15] = v2;
              clippedVerticesItems[s + 16] = x3;
              clippedVerticesItems[s + 17] = y3;
              clippedVerticesItems[s + 18] = light.r;
              clippedVerticesItems[s + 19] = light.g;
              clippedVerticesItems[s + 20] = light.b;
              clippedVerticesItems[s + 21] = light.a;
              clippedVerticesItems[s + 22] = u3;
              clippedVerticesItems[s + 23] = v3;
            } else {
              clippedVerticesItems[s + 6] = u1;
              clippedVerticesItems[s + 7] = v1;
              clippedVerticesItems[s + 8] = dark.r;
              clippedVerticesItems[s + 9] = dark.g;
              clippedVerticesItems[s + 10] = dark.b;
              clippedVerticesItems[s + 11] = dark.a;
              clippedVerticesItems[s + 12] = x2;
              clippedVerticesItems[s + 13] = y2;
              clippedVerticesItems[s + 14] = light.r;
              clippedVerticesItems[s + 15] = light.g;
              clippedVerticesItems[s + 16] = light.b;
              clippedVerticesItems[s + 17] = light.a;
              clippedVerticesItems[s + 18] = u2;
              clippedVerticesItems[s + 19] = v2;
              clippedVerticesItems[s + 20] = dark.r;
              clippedVerticesItems[s + 21] = dark.g;
              clippedVerticesItems[s + 22] = dark.b;
              clippedVerticesItems[s + 23] = dark.a;
              clippedVerticesItems[s + 24] = x3;
              clippedVerticesItems[s + 25] = y3;
              clippedVerticesItems[s + 26] = light.r;
              clippedVerticesItems[s + 27] = light.g;
              clippedVerticesItems[s + 28] = light.b;
              clippedVerticesItems[s + 29] = light.a;
              clippedVerticesItems[s + 30] = u3;
              clippedVerticesItems[s + 31] = v3;
              clippedVerticesItems[s + 32] = dark.r;
              clippedVerticesItems[s + 33] = dark.g;
              clippedVerticesItems[s + 34] = dark.b;
              clippedVerticesItems[s + 35] = dark.a;
            }
            s = clippedTriangles.length;
            var clippedTrianglesItems = spine.Utils.setArraySize(clippedTriangles, s + 3);
            clippedTrianglesItems[s] = index;
            clippedTrianglesItems[s + 1] = index + 1;
            clippedTrianglesItems[s + 2] = index + 2;
            index += 3;
            continue outer;
          }
        }
      }
    };
    SkeletonClipping.prototype.clip = function (x1, y1, x2, y2, x3, y3, clippingArea, output) {
      var originalOutput = output;
      var clipped = false;
      var input = null;
      if (clippingArea.length % 4 >= 2) {
        input = output;
        output = this.scratch;
      } else input = this.scratch;
      input.length = 0;
      input.push(x1);
      input.push(y1);
      input.push(x2);
      input.push(y2);
      input.push(x3);
      input.push(y3);
      input.push(x1);
      input.push(y1);
      output.length = 0;
      var clippingVertices = clippingArea;
      var clippingVerticesLast = clippingArea.length - 4;
      for (var i = 0;; i += 2) {
        var edgeX = clippingVertices[i],
          edgeY = clippingVertices[i + 1];
        var edgeX2 = clippingVertices[i + 2],
          edgeY2 = clippingVertices[i + 3];
        var deltaX = edgeX - edgeX2,
          deltaY = edgeY - edgeY2;
        var inputVertices = input;
        var inputVerticesLength = input.length - 2,
          outputStart = output.length;
        for (var ii = 0; ii < inputVerticesLength; ii += 2) {
          var inputX = inputVertices[ii],
            inputY = inputVertices[ii + 1];
          var inputX2 = inputVertices[ii + 2],
            inputY2 = inputVertices[ii + 3];
          var side2 = deltaX * (inputY2 - edgeY2) - deltaY * (inputX2 - edgeX2) > 0;
          if (deltaX * (inputY - edgeY2) - deltaY * (inputX - edgeX2) > 0) {
            if (side2) {
              output.push(inputX2);
              output.push(inputY2);
              continue;
            }
            var c0 = inputY2 - inputY,
              c2 = inputX2 - inputX;
            var ua = (c2 * (edgeY - inputY) - c0 * (edgeX - inputX)) / (c0 * (edgeX2 - edgeX) - c2 * (edgeY2 - edgeY));
            output.push(edgeX + (edgeX2 - edgeX) * ua);
            output.push(edgeY + (edgeY2 - edgeY) * ua);
          } else if (side2) {
            var c0 = inputY2 - inputY,
              c2 = inputX2 - inputX;
            var ua = (c2 * (edgeY - inputY) - c0 * (edgeX - inputX)) / (c0 * (edgeX2 - edgeX) - c2 * (edgeY2 - edgeY));
            output.push(edgeX + (edgeX2 - edgeX) * ua);
            output.push(edgeY + (edgeY2 - edgeY) * ua);
            output.push(inputX2);
            output.push(inputY2);
          }
          clipped = true;
        }
        if (outputStart == output.length) {
          originalOutput.length = 0;
          return true;
        }
        output.push(output[0]);
        output.push(output[1]);
        if (i == clippingVerticesLast) break;
        var temp = output;
        output = input;
        output.length = 0;
        input = temp;
      }
      if (originalOutput != output) {
        originalOutput.length = 0;
        for (var i = 0, n = output.length - 2; i < n; i++) originalOutput[i] = output[i];
      } else originalOutput.length = originalOutput.length - 2;
      return clipped;
    };
    SkeletonClipping.makeClockwise = function (polygon) {
      var vertices = polygon;
      var verticeslength = polygon.length;
      var area = vertices[verticeslength - 2] * vertices[1] - vertices[0] * vertices[verticeslength - 1],
        p1x = 0,
        p1y = 0,
        p2x = 0,
        p2y = 0;
      for (var i = 0, n = verticeslength - 3; i < n; i += 2) {
        p1x = vertices[i];
        p1y = vertices[i + 1];
        p2x = vertices[i + 2];
        p2y = vertices[i + 3];
        area += p1x * p2y - p2x * p1y;
      }
      if (area < 0) return;
      for (var i = 0, lastX = verticeslength - 2, n = verticeslength >> 1; i < n; i += 2) {
        var x = vertices[i],
          y = vertices[i + 1];
        var other = lastX - i;
        vertices[i] = vertices[other];
        vertices[i + 1] = vertices[other + 1];
        vertices[other] = x;
        vertices[other + 1] = y;
      }
    };
    return SkeletonClipping;
  }();
  spine.SkeletonClipping = SkeletonClipping;
})(spine || (spine = {}));
var spine;
(function (spine) {
  var SkeletonData = function () {
    function SkeletonData() {
      this.bones = new Array();
      this.slots = new Array();
      this.skins = new Array();
      this.events = new Array();
      this.animations = new Array();
      this.ikConstraints = new Array();
      this.transformConstraints = new Array();
      this.pathConstraints = new Array();
      this.fps = 0;
    }
    SkeletonData.prototype.findBone = function (boneName) {
      if (boneName == null) throw new Error("boneName cannot be null.");
      var bones = this.bones;
      for (var i = 0, n = bones.length; i < n; i++) {
        var bone = bones[i];
        if (bone.name == boneName) return bone;
      }
      return null;
    };
    SkeletonData.prototype.findBoneIndex = function (boneName) {
      if (boneName == null) throw new Error("boneName cannot be null.");
      var bones = this.bones;
      for (var i = 0, n = bones.length; i < n; i++) if (bones[i].name == boneName) return i;
      return -1;
    };
    SkeletonData.prototype.findSlot = function (slotName) {
      if (slotName == null) throw new Error("slotName cannot be null.");
      var slots = this.slots;
      for (var i = 0, n = slots.length; i < n; i++) {
        var slot = slots[i];
        if (slot.name == slotName) return slot;
      }
      return null;
    };
    SkeletonData.prototype.findSlotIndex = function (slotName) {
      if (slotName == null) throw new Error("slotName cannot be null.");
      var slots = this.slots;
      for (var i = 0, n = slots.length; i < n; i++) if (slots[i].name == slotName) return i;
      return -1;
    };
    SkeletonData.prototype.findSkin = function (skinName) {
      if (skinName == null) throw new Error("skinName cannot be null.");
      var skins = this.skins;
      for (var i = 0, n = skins.length; i < n; i++) {
        var skin = skins[i];
        if (skin.name == skinName) return skin;
      }
      return null;
    };
    SkeletonData.prototype.findEvent = function (eventDataName) {
      if (eventDataName == null) throw new Error("eventDataName cannot be null.");
      var events = this.events;
      for (var i = 0, n = events.length; i < n; i++) {
        var event_4 = events[i];
        if (event_4.name == eventDataName) return event_4;
      }
      return null;
    };
    SkeletonData.prototype.findAnimation = function (animationName) {
      if (animationName == null) throw new Error("animationName cannot be null.");
      var animations = this.animations;
      for (var i = 0, n = animations.length; i < n; i++) {
        var animation = animations[i];
        if (animation.name == animationName) return animation;
      }
      return null;
    };
    SkeletonData.prototype.findIkConstraint = function (constraintName) {
      if (constraintName == null) throw new Error("constraintName cannot be null.");
      var ikConstraints = this.ikConstraints;
      for (var i = 0, n = ikConstraints.length; i < n; i++) {
        var constraint = ikConstraints[i];
        if (constraint.name == constraintName) return constraint;
      }
      return null;
    };
    SkeletonData.prototype.findTransformConstraint = function (constraintName) {
      if (constraintName == null) throw new Error("constraintName cannot be null.");
      var transformConstraints = this.transformConstraints;
      for (var i = 0, n = transformConstraints.length; i < n; i++) {
        var constraint = transformConstraints[i];
        if (constraint.name == constraintName) return constraint;
      }
      return null;
    };
    SkeletonData.prototype.findPathConstraint = function (constraintName) {
      if (constraintName == null) throw new Error("constraintName cannot be null.");
      var pathConstraints = this.pathConstraints;
      for (var i = 0, n = pathConstraints.length; i < n; i++) {
        var constraint = pathConstraints[i];
        if (constraint.name == constraintName) return constraint;
      }
      return null;
    };
    SkeletonData.prototype.findPathConstraintIndex = function (pathConstraintName) {
      if (pathConstraintName == null) throw new Error("pathConstraintName cannot be null.");
      var pathConstraints = this.pathConstraints;
      for (var i = 0, n = pathConstraints.length; i < n; i++) if (pathConstraints[i].name == pathConstraintName) return i;
      return -1;
    };
    return SkeletonData;
  }();
  spine.SkeletonData = SkeletonData;
})(spine || (spine = {}));
var spine;
(function (spine) {
  var SkeletonJson = function () {
    function SkeletonJson(attachmentLoader) {
      this.scale = 1;
      this.linkedMeshes = new Array();
      this.attachmentLoader = attachmentLoader;
    }
    SkeletonJson.prototype.readSkeletonData = function (json) {
      var scale = this.scale;
      var skeletonData = new spine.SkeletonData();
      var root = typeof json === "string" ? JSON.parse(json) : json;
      var skeletonMap = root.skeleton;
      if (skeletonMap != null) {
        skeletonData.hash = skeletonMap.hash;
        skeletonData.version = skeletonMap.spine;
        skeletonData.width = skeletonMap.width;
        skeletonData.height = skeletonMap.height;
        skeletonData.fps = skeletonMap.fps;
        skeletonData.imagesPath = skeletonMap.images;
      }
      if (root.bones) {
        for (var i = 0; i < root.bones.length; i++) {
          var boneMap = root.bones[i];
          var parent_2 = null;
          var parentName = this.getValue(boneMap, "parent", null);
          if (parentName != null) {
            parent_2 = skeletonData.findBone(parentName);
            if (parent_2 == null) throw new Error("Parent bone not found: " + parentName);
          }
          var data = new spine.BoneData(skeletonData.bones.length, boneMap.name, parent_2);
          data.length = this.getValue(boneMap, "length", 0) * scale;
          data.x = this.getValue(boneMap, "x", 0) * scale;
          data.y = this.getValue(boneMap, "y", 0) * scale;
          data.rotation = this.getValue(boneMap, "rotation", 0);
          data.scaleX = this.getValue(boneMap, "scaleX", 1);
          data.scaleY = this.getValue(boneMap, "scaleY", 1);
          data.shearX = this.getValue(boneMap, "shearX", 0);
          data.shearY = this.getValue(boneMap, "shearY", 0);
          data.transformMode = SkeletonJson.transformModeFromString(this.getValue(boneMap, "transform", "normal"));
          skeletonData.bones.push(data);
        }
      }
      if (root.slots) {
        for (var i = 0; i < root.slots.length; i++) {
          var slotMap = root.slots[i];
          var slotName = slotMap.name;
          var boneName = slotMap.bone;
          var boneData = skeletonData.findBone(boneName);
          if (boneData == null) throw new Error("Slot bone not found: " + boneName);
          var data = new spine.SlotData(skeletonData.slots.length, slotName, boneData);
          var color = this.getValue(slotMap, "color", null);
          if (color != null) data.color.setFromString(color);
          var dark = this.getValue(slotMap, "dark", null);
          if (dark != null) {
            data.darkColor = new spine.Color(1, 1, 1, 1);
            data.darkColor.setFromString(dark);
          }
          data.attachmentName = this.getValue(slotMap, "attachment", null);
          data.blendMode = SkeletonJson.blendModeFromString(this.getValue(slotMap, "blend", "normal"));
          skeletonData.slots.push(data);
        }
      }
      if (root.ik) {
        for (var i = 0; i < root.ik.length; i++) {
          var constraintMap = root.ik[i];
          var data = new spine.IkConstraintData(constraintMap.name);
          data.order = this.getValue(constraintMap, "order", 0);
          for (var j = 0; j < constraintMap.bones.length; j++) {
            var boneName = constraintMap.bones[j];
            var bone = skeletonData.findBone(boneName);
            if (bone == null) throw new Error("IK bone not found: " + boneName);
            data.bones.push(bone);
          }
          var targetName = constraintMap.target;
          data.target = skeletonData.findBone(targetName);
          if (data.target == null) throw new Error("IK target bone not found: " + targetName);
          data.bendDirection = this.getValue(constraintMap, "bendPositive", true) ? 1 : -1;
          data.mix = this.getValue(constraintMap, "mix", 1);
          skeletonData.ikConstraints.push(data);
        }
      }
      if (root.transform) {
        for (var i = 0; i < root.transform.length; i++) {
          var constraintMap = root.transform[i];
          var data = new spine.TransformConstraintData(constraintMap.name);
          data.order = this.getValue(constraintMap, "order", 0);
          for (var j = 0; j < constraintMap.bones.length; j++) {
            var boneName = constraintMap.bones[j];
            var bone = skeletonData.findBone(boneName);
            if (bone == null) throw new Error("Transform constraint bone not found: " + boneName);
            data.bones.push(bone);
          }
          var targetName = constraintMap.target;
          data.target = skeletonData.findBone(targetName);
          if (data.target == null) throw new Error("Transform constraint target bone not found: " + targetName);
          data.local = this.getValue(constraintMap, "local", false);
          data.relative = this.getValue(constraintMap, "relative", false);
          data.offsetRotation = this.getValue(constraintMap, "rotation", 0);
          data.offsetX = this.getValue(constraintMap, "x", 0) * scale;
          data.offsetY = this.getValue(constraintMap, "y", 0) * scale;
          data.offsetScaleX = this.getValue(constraintMap, "scaleX", 0);
          data.offsetScaleY = this.getValue(constraintMap, "scaleY", 0);
          data.offsetShearY = this.getValue(constraintMap, "shearY", 0);
          data.rotateMix = this.getValue(constraintMap, "rotateMix", 1);
          data.translateMix = this.getValue(constraintMap, "translateMix", 1);
          data.scaleMix = this.getValue(constraintMap, "scaleMix", 1);
          data.shearMix = this.getValue(constraintMap, "shearMix", 1);
          skeletonData.transformConstraints.push(data);
        }
      }
      if (root.path) {
        for (var i = 0; i < root.path.length; i++) {
          var constraintMap = root.path[i];
          var data = new spine.PathConstraintData(constraintMap.name);
          data.order = this.getValue(constraintMap, "order", 0);
          for (var j = 0; j < constraintMap.bones.length; j++) {
            var boneName = constraintMap.bones[j];
            var bone = skeletonData.findBone(boneName);
            if (bone == null) throw new Error("Transform constraint bone not found: " + boneName);
            data.bones.push(bone);
          }
          var targetName = constraintMap.target;
          data.target = skeletonData.findSlot(targetName);
          if (data.target == null) throw new Error("Path target slot not found: " + targetName);
          data.positionMode = SkeletonJson.positionModeFromString(this.getValue(constraintMap, "positionMode", "percent"));
          data.spacingMode = SkeletonJson.spacingModeFromString(this.getValue(constraintMap, "spacingMode", "length"));
          data.rotateMode = SkeletonJson.rotateModeFromString(this.getValue(constraintMap, "rotateMode", "tangent"));
          data.offsetRotation = this.getValue(constraintMap, "rotation", 0);
          data.position = this.getValue(constraintMap, "position", 0);
          if (data.positionMode == spine.PositionMode.Fixed) data.position *= scale;
          data.spacing = this.getValue(constraintMap, "spacing", 0);
          if (data.spacingMode == spine.SpacingMode.Length || data.spacingMode == spine.SpacingMode.Fixed) data.spacing *= scale;
          data.rotateMix = this.getValue(constraintMap, "rotateMix", 1);
          data.translateMix = this.getValue(constraintMap, "translateMix", 1);
          skeletonData.pathConstraints.push(data);
        }
      }
      if (root.skins) {
        for (var skinName in root.skins) {
          var skinMap = root.skins[skinName];
          var skin = new spine.Skin(skinName);
          for (var slotName in skinMap) {
            var slotIndex = skeletonData.findSlotIndex(slotName);
            if (slotIndex == -1) throw new Error("Slot not found: " + slotName);
            var slotMap = skinMap[slotName];
            for (var entryName in slotMap) {
              var attachment = this.readAttachment(slotMap[entryName], skin, slotIndex, entryName, skeletonData);
              if (attachment != null) skin.addAttachment(slotIndex, entryName, attachment);
            }
          }
          skeletonData.skins.push(skin);
          if (skin.name == "default") skeletonData.defaultSkin = skin;
        }
      }
      for (var i = 0, n = this.linkedMeshes.length; i < n; i++) {
        var linkedMesh = this.linkedMeshes[i];
        var skin = linkedMesh.skin == null ? skeletonData.defaultSkin : skeletonData.findSkin(linkedMesh.skin);
        if (skin == null) throw new Error("Skin not found: " + linkedMesh.skin);
        var parent_3 = skin.getAttachment(linkedMesh.slotIndex, linkedMesh.parent);
        if (parent_3 == null) throw new Error("Parent mesh not found: " + linkedMesh.parent);
        linkedMesh.mesh.setParentMesh(parent_3);
        linkedMesh.mesh.updateUVs();
      }
      this.linkedMeshes.length = 0;
      if (root.events) {
        for (var eventName in root.events) {
          var eventMap = root.events[eventName];
          var data = new spine.EventData(eventName);
          data.intValue = this.getValue(eventMap, "int", 0);
          data.floatValue = this.getValue(eventMap, "float", 0);
          data.stringValue = this.getValue(eventMap, "string", "");
          skeletonData.events.push(data);
        }
      }
      if (root.animations) {
        for (var animationName in root.animations) {
          var animationMap = root.animations[animationName];
          this.readAnimation(animationMap, animationName, skeletonData);
        }
      }
      return skeletonData;
    };
    SkeletonJson.prototype.readAttachment = function (map, skin, slotIndex, name, skeletonData) {
      var scale = this.scale;
      name = this.getValue(map, "name", name);
      var type = this.getValue(map, "type", "region");
      switch (type) {
        case "region":
          {
            var path = this.getValue(map, "path", name);
            var region = this.attachmentLoader.newRegionAttachment(skin, name, path);
            if (region == null) return null;
            region.path = path;
            region.x = this.getValue(map, "x", 0) * scale;
            region.y = this.getValue(map, "y", 0) * scale;
            region.scaleX = this.getValue(map, "scaleX", 1);
            region.scaleY = this.getValue(map, "scaleY", 1);
            region.rotation = this.getValue(map, "rotation", 0);
            region.width = map.width * scale;
            region.height = map.height * scale;
            var color = this.getValue(map, "color", null);
            if (color != null) region.color.setFromString(color);
            region.updateOffset();
            return region;
          }
        case "boundingbox":
          {
            var box = this.attachmentLoader.newBoundingBoxAttachment(skin, name);
            if (box == null) return null;
            this.readVertices(map, box, map.vertexCount << 1);
            var color = this.getValue(map, "color", null);
            if (color != null) box.color.setFromString(color);
            return box;
          }
        case "mesh":
        case "linkedmesh":
          {
            var path = this.getValue(map, "path", name);
            var mesh = this.attachmentLoader.newMeshAttachment(skin, name, path);
            if (mesh == null) return null;
            mesh.path = path;
            var color = this.getValue(map, "color", null);
            if (color != null) mesh.color.setFromString(color);
            var parent_4 = this.getValue(map, "parent", null);
            if (parent_4 != null) {
              mesh.inheritDeform = this.getValue(map, "deform", true);
              this.linkedMeshes.push(new LinkedMesh(mesh, this.getValue(map, "skin", null), slotIndex, parent_4));
              return mesh;
            }
            var uvs = map.uvs;
            this.readVertices(map, mesh, uvs.length);
            mesh.triangles = map.triangles;
            mesh.regionUVs = uvs;
            mesh.updateUVs();
            mesh.hullLength = this.getValue(map, "hull", 0) * 2;
            return mesh;
          }
        case "path":
          {
            var path = this.attachmentLoader.newPathAttachment(skin, name);
            if (path == null) return null;
            path.closed = this.getValue(map, "closed", false);
            path.constantSpeed = this.getValue(map, "constantSpeed", true);
            var vertexCount = map.vertexCount;
            this.readVertices(map, path, vertexCount << 1);
            var lengths = spine.Utils.newArray(vertexCount / 3, 0);
            for (var i = 0; i < map.lengths.length; i++) lengths[i] = map.lengths[i] * scale;
            path.lengths = lengths;
            var color = this.getValue(map, "color", null);
            if (color != null) path.color.setFromString(color);
            return path;
          }
        case "point":
          {
            var point = this.attachmentLoader.newPointAttachment(skin, name);
            if (point == null) return null;
            point.x = this.getValue(map, "x", 0) * scale;
            point.y = this.getValue(map, "y", 0) * scale;
            point.rotation = this.getValue(map, "rotation", 0);
            var color = this.getValue(map, "color", null);
            if (color != null) point.color.setFromString(color);
            return point;
          }
        case "clipping":
          {
            var clip = this.attachmentLoader.newClippingAttachment(skin, name);
            if (clip == null) return null;
            var end = this.getValue(map, "end", null);
            if (end != null) {
              var slot = skeletonData.findSlot(end);
              if (slot == null) throw new Error("Clipping end slot not found: " + end);
              clip.endSlot = slot;
            }
            var vertexCount = map.vertexCount;
            this.readVertices(map, clip, vertexCount << 1);
            var color = this.getValue(map, "color", null);
            if (color != null) clip.color.setFromString(color);
            return clip;
          }
      }
      return null;
    };
    SkeletonJson.prototype.readVertices = function (map, attachment, verticesLength) {
      var scale = this.scale;
      attachment.worldVerticesLength = verticesLength;
      var vertices = map.vertices;
      if (verticesLength == vertices.length) {
        var scaledVertices = spine.Utils.toFloatArray(vertices);
        if (scale != 1) {
          for (var i = 0, n = vertices.length; i < n; i++) scaledVertices[i] *= scale;
        }
        attachment.vertices = scaledVertices;
        return;
      }
      var weights = new Array();
      var bones = new Array();
      for (var i = 0, n = vertices.length; i < n;) {
        var boneCount = vertices[i++];
        bones.push(boneCount);
        for (var nn = i + boneCount * 4; i < nn; i += 4) {
          bones.push(vertices[i]);
          weights.push(vertices[i + 1] * scale);
          weights.push(vertices[i + 2] * scale);
          weights.push(vertices[i + 3]);
        }
      }
      attachment.bones = bones;
      attachment.vertices = spine.Utils.toFloatArray(weights);
    };
    SkeletonJson.prototype.readAnimation = function (map, name, skeletonData) {
      var scale = this.scale;
      var timelines = new Array();
      var duration = 0;
      if (map.slots) {
        for (var slotName in map.slots) {
          var slotMap = map.slots[slotName];
          var slotIndex = skeletonData.findSlotIndex(slotName);
          if (slotIndex == -1) throw new Error("Slot not found: " + slotName);
          for (var timelineName in slotMap) {
            var timelineMap = slotMap[timelineName];
            if (timelineName == "attachment") {
              var timeline = new spine.AttachmentTimeline(timelineMap.length);
              timeline.slotIndex = slotIndex;
              var frameIndex = 0;
              for (var i = 0; i < timelineMap.length; i++) {
                var valueMap = timelineMap[i];
                timeline.setFrame(frameIndex++, valueMap.time, valueMap.name);
              }
              timelines.push(timeline);
              duration = Math.max(duration, timeline.frames[timeline.getFrameCount() - 1]);
            } else if (timelineName == "color") {
              var timeline = new spine.ColorTimeline(timelineMap.length);
              timeline.slotIndex = slotIndex;
              var frameIndex = 0;
              for (var i = 0; i < timelineMap.length; i++) {
                var valueMap = timelineMap[i];
                var color = new spine.Color();
                color.setFromString(valueMap.color);
                timeline.setFrame(frameIndex, valueMap.time, color.r, color.g, color.b, color.a);
                this.readCurve(valueMap, timeline, frameIndex);
                frameIndex++;
              }
              timelines.push(timeline);
              duration = Math.max(duration, timeline.frames[(timeline.getFrameCount() - 1) * spine.ColorTimeline.ENTRIES]);
            } else if (timelineName == "twoColor") {
              var timeline = new spine.TwoColorTimeline(timelineMap.length);
              timeline.slotIndex = slotIndex;
              var frameIndex = 0;
              for (var i = 0; i < timelineMap.length; i++) {
                var valueMap = timelineMap[i];
                var light = new spine.Color();
                var dark = new spine.Color();
                light.setFromString(valueMap.light);
                dark.setFromString(valueMap.dark);
                timeline.setFrame(frameIndex, valueMap.time, light.r, light.g, light.b, light.a, dark.r, dark.g, dark.b);
                this.readCurve(valueMap, timeline, frameIndex);
                frameIndex++;
              }
              timelines.push(timeline);
              duration = Math.max(duration, timeline.frames[(timeline.getFrameCount() - 1) * spine.TwoColorTimeline.ENTRIES]);
            } else throw new Error("Invalid timeline type for a slot: " + timelineName + " (" + slotName + ")");
          }
        }
      }
      if (map.bones) {
        for (var boneName in map.bones) {
          var boneMap = map.bones[boneName];
          var boneIndex = skeletonData.findBoneIndex(boneName);
          if (boneIndex == -1) throw new Error("Bone not found: " + boneName);
          for (var timelineName in boneMap) {
            var timelineMap = boneMap[timelineName];
            if (timelineName === "rotate") {
              var timeline = new spine.RotateTimeline(timelineMap.length);
              timeline.boneIndex = boneIndex;
              var frameIndex = 0;
              for (var i = 0; i < timelineMap.length; i++) {
                var valueMap = timelineMap[i];
                timeline.setFrame(frameIndex, valueMap.time, valueMap.angle);
                this.readCurve(valueMap, timeline, frameIndex);
                frameIndex++;
              }
              timelines.push(timeline);
              duration = Math.max(duration, timeline.frames[(timeline.getFrameCount() - 1) * spine.RotateTimeline.ENTRIES]);
            } else if (timelineName === "translate" || timelineName === "scale" || timelineName === "shear") {
              var timeline = null;
              var timelineScale = 1;
              if (timelineName === "scale") timeline = new spine.ScaleTimeline(timelineMap.length);else if (timelineName === "shear") timeline = new spine.ShearTimeline(timelineMap.length);else {
                timeline = new spine.TranslateTimeline(timelineMap.length);
                timelineScale = scale;
              }
              timeline.boneIndex = boneIndex;
              var frameIndex = 0;
              for (var i = 0; i < timelineMap.length; i++) {
                var valueMap = timelineMap[i];
                var x = this.getValue(valueMap, "x", 0),
                  y = this.getValue(valueMap, "y", 0);
                timeline.setFrame(frameIndex, valueMap.time, x * timelineScale, y * timelineScale);
                this.readCurve(valueMap, timeline, frameIndex);
                frameIndex++;
              }
              timelines.push(timeline);
              duration = Math.max(duration, timeline.frames[(timeline.getFrameCount() - 1) * spine.TranslateTimeline.ENTRIES]);
            } else throw new Error("Invalid timeline type for a bone: " + timelineName + " (" + boneName + ")");
          }
        }
      }
      if (map.ik) {
        for (var constraintName in map.ik) {
          var constraintMap = map.ik[constraintName];
          var constraint = skeletonData.findIkConstraint(constraintName);
          var timeline = new spine.IkConstraintTimeline(constraintMap.length);
          timeline.ikConstraintIndex = skeletonData.ikConstraints.indexOf(constraint);
          var frameIndex = 0;
          for (var i = 0; i < constraintMap.length; i++) {
            var valueMap = constraintMap[i];
            timeline.setFrame(frameIndex, valueMap.time, this.getValue(valueMap, "mix", 1), this.getValue(valueMap, "bendPositive", true) ? 1 : -1);
            this.readCurve(valueMap, timeline, frameIndex);
            frameIndex++;
          }
          timelines.push(timeline);
          duration = Math.max(duration, timeline.frames[(timeline.getFrameCount() - 1) * spine.IkConstraintTimeline.ENTRIES]);
        }
      }
      if (map.transform) {
        for (var constraintName in map.transform) {
          var constraintMap = map.transform[constraintName];
          var constraint = skeletonData.findTransformConstraint(constraintName);
          var timeline = new spine.TransformConstraintTimeline(constraintMap.length);
          timeline.transformConstraintIndex = skeletonData.transformConstraints.indexOf(constraint);
          var frameIndex = 0;
          for (var i = 0; i < constraintMap.length; i++) {
            var valueMap = constraintMap[i];
            timeline.setFrame(frameIndex, valueMap.time, this.getValue(valueMap, "rotateMix", 1), this.getValue(valueMap, "translateMix", 1), this.getValue(valueMap, "scaleMix", 1), this.getValue(valueMap, "shearMix", 1));
            this.readCurve(valueMap, timeline, frameIndex);
            frameIndex++;
          }
          timelines.push(timeline);
          duration = Math.max(duration, timeline.frames[(timeline.getFrameCount() - 1) * spine.TransformConstraintTimeline.ENTRIES]);
        }
      }
      if (map.paths) {
        for (var constraintName in map.paths) {
          var constraintMap = map.paths[constraintName];
          var index = skeletonData.findPathConstraintIndex(constraintName);
          if (index == -1) throw new Error("Path constraint not found: " + constraintName);
          var data = skeletonData.pathConstraints[index];
          for (var timelineName in constraintMap) {
            var timelineMap = constraintMap[timelineName];
            if (timelineName === "position" || timelineName === "spacing") {
              var timeline = null;
              var timelineScale = 1;
              if (timelineName === "spacing") {
                timeline = new spine.PathConstraintSpacingTimeline(timelineMap.length);
                if (data.spacingMode == spine.SpacingMode.Length || data.spacingMode == spine.SpacingMode.Fixed) timelineScale = scale;
              } else {
                timeline = new spine.PathConstraintPositionTimeline(timelineMap.length);
                if (data.positionMode == spine.PositionMode.Fixed) timelineScale = scale;
              }
              timeline.pathConstraintIndex = index;
              var frameIndex = 0;
              for (var i = 0; i < timelineMap.length; i++) {
                var valueMap = timelineMap[i];
                timeline.setFrame(frameIndex, valueMap.time, this.getValue(valueMap, timelineName, 0) * timelineScale);
                this.readCurve(valueMap, timeline, frameIndex);
                frameIndex++;
              }
              timelines.push(timeline);
              duration = Math.max(duration, timeline.frames[(timeline.getFrameCount() - 1) * spine.PathConstraintPositionTimeline.ENTRIES]);
            } else if (timelineName === "mix") {
              var timeline = new spine.PathConstraintMixTimeline(timelineMap.length);
              timeline.pathConstraintIndex = index;
              var frameIndex = 0;
              for (var i = 0; i < timelineMap.length; i++) {
                var valueMap = timelineMap[i];
                timeline.setFrame(frameIndex, valueMap.time, this.getValue(valueMap, "rotateMix", 1), this.getValue(valueMap, "translateMix", 1));
                this.readCurve(valueMap, timeline, frameIndex);
                frameIndex++;
              }
              timelines.push(timeline);
              duration = Math.max(duration, timeline.frames[(timeline.getFrameCount() - 1) * spine.PathConstraintMixTimeline.ENTRIES]);
            }
          }
        }
      }
      if (map.deform) {
        for (var deformName in map.deform) {
          var deformMap = map.deform[deformName];
          var skin = skeletonData.findSkin(deformName);
          if (skin == null) throw new Error("Skin not found: " + deformName);
          for (var slotName in deformMap) {
            var slotMap = deformMap[slotName];
            var slotIndex = skeletonData.findSlotIndex(slotName);
            if (slotIndex == -1) throw new Error("Slot not found: " + slotMap.name);
            for (var timelineName in slotMap) {
              var timelineMap = slotMap[timelineName];
              var attachment = skin.getAttachment(slotIndex, timelineName);
              if (attachment == null) throw new Error("Deform attachment not found: " + timelineMap.name);
              var weighted = attachment.bones != null;
              var vertices = attachment.vertices;
              var deformLength = weighted ? vertices.length / 3 * 2 : vertices.length;
              var timeline = new spine.DeformTimeline(timelineMap.length);
              timeline.slotIndex = slotIndex;
              timeline.attachment = attachment;
              var frameIndex = 0;
              for (var j = 0; j < timelineMap.length; j++) {
                var valueMap = timelineMap[j];
                var deform = void 0;
                var verticesValue = this.getValue(valueMap, "vertices", null);
                if (verticesValue == null) deform = weighted ? spine.Utils.newFloatArray(deformLength) : vertices;else {
                  deform = spine.Utils.newFloatArray(deformLength);
                  var start = this.getValue(valueMap, "offset", 0);
                  spine.Utils.arrayCopy(verticesValue, 0, deform, start, verticesValue.length);
                  if (scale != 1) {
                    for (var i = start, n = i + verticesValue.length; i < n; i++) deform[i] *= scale;
                  }
                  if (!weighted) {
                    for (var i = 0; i < deformLength; i++) deform[i] += vertices[i];
                  }
                }
                timeline.setFrame(frameIndex, valueMap.time, deform);
                this.readCurve(valueMap, timeline, frameIndex);
                frameIndex++;
              }
              timelines.push(timeline);
              duration = Math.max(duration, timeline.frames[timeline.getFrameCount() - 1]);
            }
          }
        }
      }
      var drawOrderNode = map.drawOrder;
      if (drawOrderNode == null) drawOrderNode = map.draworder;
      if (drawOrderNode != null) {
        var timeline = new spine.DrawOrderTimeline(drawOrderNode.length);
        var slotCount = skeletonData.slots.length;
        var frameIndex = 0;
        for (var j = 0; j < drawOrderNode.length; j++) {
          var drawOrderMap = drawOrderNode[j];
          var drawOrder = null;
          var offsets = this.getValue(drawOrderMap, "offsets", null);
          if (offsets != null) {
            drawOrder = spine.Utils.newArray(slotCount, -1);
            var unchanged = spine.Utils.newArray(slotCount - offsets.length, 0);
            var originalIndex = 0,
              unchangedIndex = 0;
            for (var i = 0; i < offsets.length; i++) {
              var offsetMap = offsets[i];
              var slotIndex = skeletonData.findSlotIndex(offsetMap.slot);
              if (slotIndex == -1) throw new Error("Slot not found: " + offsetMap.slot);
              while (originalIndex != slotIndex) unchanged[unchangedIndex++] = originalIndex++;
              drawOrder[originalIndex + offsetMap.offset] = originalIndex++;
            }
            while (originalIndex < slotCount) unchanged[unchangedIndex++] = originalIndex++;
            for (var i = slotCount - 1; i >= 0; i--) if (drawOrder[i] == -1) drawOrder[i] = unchanged[--unchangedIndex];
          }
          timeline.setFrame(frameIndex++, drawOrderMap.time, drawOrder);
        }
        timelines.push(timeline);
        duration = Math.max(duration, timeline.frames[timeline.getFrameCount() - 1]);
      }
      if (map.events) {
        var timeline = new spine.EventTimeline(map.events.length);
        var frameIndex = 0;
        for (var i = 0; i < map.events.length; i++) {
          var eventMap = map.events[i];
          var eventData = skeletonData.findEvent(eventMap.name);
          if (eventData == null) throw new Error("Event not found: " + eventMap.name);
          var event_5 = new spine.Event(spine.Utils.toSinglePrecision(eventMap.time), eventData);
          event_5.intValue = this.getValue(eventMap, "int", eventData.intValue);
          event_5.floatValue = this.getValue(eventMap, "float", eventData.floatValue);
          event_5.stringValue = this.getValue(eventMap, "string", eventData.stringValue);
          timeline.setFrame(frameIndex++, event_5);
        }
        timelines.push(timeline);
        duration = Math.max(duration, timeline.frames[timeline.getFrameCount() - 1]);
      }
      if (isNaN(duration)) {
        throw new Error("Error while parsing animation, duration is NaN");
      }
      skeletonData.animations.push(new spine.Animation(name, timelines, duration));
    };
    SkeletonJson.prototype.readCurve = function (map, timeline, frameIndex) {
      if (!map.curve) return;
      if (map.curve === "stepped") timeline.setStepped(frameIndex);else if (Object.prototype.toString.call(map.curve) === '[object Array]') {
        var curve = map.curve;
        timeline.setCurve(frameIndex, curve[0], curve[1], curve[2], curve[3]);
      }
    };
    SkeletonJson.prototype.getValue = function (map, prop, defaultValue) {
      return map[prop] !== undefined ? map[prop] : defaultValue;
    };
    SkeletonJson.blendModeFromString = function (str) {
      str = str.toLowerCase();
      if (str == "normal") return spine.BlendMode.Normal;
      if (str == "additive") return spine.BlendMode.Additive;
      if (str == "multiply") return spine.BlendMode.Multiply;
      if (str == "screen") return spine.BlendMode.Screen;
      throw new Error("Unknown blend mode: " + str);
    };
    SkeletonJson.positionModeFromString = function (str) {
      str = str.toLowerCase();
      if (str == "fixed") return spine.PositionMode.Fixed;
      if (str == "percent") return spine.PositionMode.Percent;
      throw new Error("Unknown position mode: " + str);
    };
    SkeletonJson.spacingModeFromString = function (str) {
      str = str.toLowerCase();
      if (str == "length") return spine.SpacingMode.Length;
      if (str == "fixed") return spine.SpacingMode.Fixed;
      if (str == "percent") return spine.SpacingMode.Percent;
      throw new Error("Unknown position mode: " + str);
    };
    SkeletonJson.rotateModeFromString = function (str) {
      str = str.toLowerCase();
      if (str == "tangent") return spine.RotateMode.Tangent;
      if (str == "chain") return spine.RotateMode.Chain;
      if (str == "chainscale") return spine.RotateMode.ChainScale;
      throw new Error("Unknown rotate mode: " + str);
    };
    SkeletonJson.transformModeFromString = function (str) {
      str = str.toLowerCase();
      if (str == "normal") return spine.TransformMode.Normal;
      if (str == "onlytranslation") return spine.TransformMode.OnlyTranslation;
      if (str == "norotationorreflection") return spine.TransformMode.NoRotationOrReflection;
      if (str == "noscale") return spine.TransformMode.NoScale;
      if (str == "noscaleorreflection") return spine.TransformMode.NoScaleOrReflection;
      throw new Error("Unknown transform mode: " + str);
    };
    return SkeletonJson;
  }();
  spine.SkeletonJson = SkeletonJson;
  var LinkedMesh = function () {
    function LinkedMesh(mesh, skin, slotIndex, parent) {
      this.mesh = mesh;
      this.skin = skin;
      this.slotIndex = slotIndex;
      this.parent = parent;
    }
    return LinkedMesh;
  }();
})(spine || (spine = {}));
var spine;
(function (spine) {
  var Skin = function () {
    function Skin(name) {
      this.attachments = new Array();
      if (name == null) throw new Error("name cannot be null.");
      this.name = name;
    }
    Skin.prototype.addAttachment = function (slotIndex, name, attachment) {
      if (attachment == null) throw new Error("attachment cannot be null.");
      var attachments = this.attachments;
      if (slotIndex >= attachments.length) attachments.length = slotIndex + 1;
      if (!attachments[slotIndex]) attachments[slotIndex] = {};
      attachments[slotIndex][name] = attachment;
    };
    Skin.prototype.getAttachment = function (slotIndex, name) {
      var dictionary = this.attachments[slotIndex];
      return dictionary ? dictionary[name] : null;
    };
    Skin.prototype.attachAll = function (skeleton, oldSkin) {
      var slotIndex = 0;
      for (var i = 0; i < skeleton.slots.length; i++) {
        var slot = skeleton.slots[i];
        var slotAttachment = slot.getAttachment();
        if (slotAttachment && slotIndex < oldSkin.attachments.length) {
          var dictionary = oldSkin.attachments[slotIndex];
          for (var key in dictionary) {
            var skinAttachment = dictionary[key];
            if (slotAttachment == skinAttachment) {
              var attachment = this.getAttachment(slotIndex, key);
              if (attachment != null) slot.setAttachment(attachment);
              break;
            }
          }
        }
        slotIndex++;
      }
    };
    return Skin;
  }();
  spine.Skin = Skin;
})(spine || (spine = {}));
var spine;
(function (spine) {
  var Slot = function () {
    function Slot(data, bone) {
      this.attachmentVertices = new Array();
      if (data == null) throw new Error("data cannot be null.");
      if (bone == null) throw new Error("bone cannot be null.");
      this.data = data;
      this.bone = bone;
      this.color = new spine.Color();
      this.darkColor = data.darkColor == null ? null : new spine.Color();
      this.setToSetupPose();
    }
    Slot.prototype.getAttachment = function () {
      return this.attachment;
    };
    Slot.prototype.setAttachment = function (attachment) {
      if (this.attachment == attachment) return;
      this.attachment = attachment;
      this.attachmentTime = this.bone.skeleton.time;
      this.attachmentVertices.length = 0;
    };
    Slot.prototype.setAttachmentTime = function (time) {
      this.attachmentTime = this.bone.skeleton.time - time;
    };
    Slot.prototype.getAttachmentTime = function () {
      return this.bone.skeleton.time - this.attachmentTime;
    };
    Slot.prototype.setToSetupPose = function () {
      this.color.setFromColor(this.data.color);
      if (this.darkColor != null) this.darkColor.setFromColor(this.data.darkColor);
      if (this.data.attachmentName == null) this.attachment = null;else {
        this.attachment = null;
        this.setAttachment(this.bone.skeleton.getAttachment(this.data.index, this.data.attachmentName));
      }
    };
    return Slot;
  }();
  spine.Slot = Slot;
})(spine || (spine = {}));
var spine;
(function (spine) {
  var SlotData = function () {
    function SlotData(index, name, boneData) {
      this.color = new spine.Color(1, 1, 1, 1);
      if (index < 0) throw new Error("index must be >= 0.");
      if (name == null) throw new Error("name cannot be null.");
      if (boneData == null) throw new Error("boneData cannot be null.");
      this.index = index;
      this.name = name;
      this.boneData = boneData;
    }
    return SlotData;
  }();
  spine.SlotData = SlotData;
})(spine || (spine = {}));
var spine;
(function (spine) {
  var Texture = function () {
    function Texture(image) {
      this._image = image;
    }
    Texture.prototype.getImage = function () {
      return this._image;
    };
    Texture.filterFromString = function (text) {
      switch (text.toLowerCase()) {
        case "nearest":
          return TextureFilter.Nearest;
        case "linear":
          return TextureFilter.Linear;
        case "mipmap":
          return TextureFilter.MipMap;
        case "mipmapnearestnearest":
          return TextureFilter.MipMapNearestNearest;
        case "mipmaplinearnearest":
          return TextureFilter.MipMapLinearNearest;
        case "mipmapnearestlinear":
          return TextureFilter.MipMapNearestLinear;
        case "mipmaplinearlinear":
          return TextureFilter.MipMapLinearLinear;
        default:
          throw new Error("Unknown texture filter " + text);
      }
    };
    Texture.wrapFromString = function (text) {
      switch (text.toLowerCase()) {
        case "mirroredtepeat":
          return TextureWrap.MirroredRepeat;
        case "clamptoedge":
          return TextureWrap.ClampToEdge;
        case "repeat":
          return TextureWrap.Repeat;
        default:
          throw new Error("Unknown texture wrap " + text);
      }
    };
    return Texture;
  }();
  spine.Texture = Texture;
  var TextureFilter;
  (function (TextureFilter) {
    TextureFilter[TextureFilter["Nearest"] = 9728] = "Nearest";
    TextureFilter[TextureFilter["Linear"] = 9729] = "Linear";
    TextureFilter[TextureFilter["MipMap"] = 9987] = "MipMap";
    TextureFilter[TextureFilter["MipMapNearestNearest"] = 9984] = "MipMapNearestNearest";
    TextureFilter[TextureFilter["MipMapLinearNearest"] = 9985] = "MipMapLinearNearest";
    TextureFilter[TextureFilter["MipMapNearestLinear"] = 9986] = "MipMapNearestLinear";
    TextureFilter[TextureFilter["MipMapLinearLinear"] = 9987] = "MipMapLinearLinear";
  })(TextureFilter = spine.TextureFilter || (spine.TextureFilter = {}));
  var TextureWrap;
  (function (TextureWrap) {
    TextureWrap[TextureWrap["MirroredRepeat"] = 33648] = "MirroredRepeat";
    TextureWrap[TextureWrap["ClampToEdge"] = 33071] = "ClampToEdge";
    TextureWrap[TextureWrap["Repeat"] = 10497] = "Repeat";
  })(TextureWrap = spine.TextureWrap || (spine.TextureWrap = {}));
  var TextureRegion = function () {
    function TextureRegion() {
      this.u = 0;
      this.v = 0;
      this.u2 = 0;
      this.v2 = 0;
      this.width = 0;
      this.height = 0;
      this.rotate = false;
      this.offsetX = 0;
      this.offsetY = 0;
      this.originalWidth = 0;
      this.originalHeight = 0;
    }
    return TextureRegion;
  }();
  spine.TextureRegion = TextureRegion;
  var FakeTexture = function (_super) {
    __extends(FakeTexture, _super);
    function FakeTexture() {
      return _super !== null && _super.apply(this, arguments) || this;
    }
    FakeTexture.prototype.setFilters = function (minFilter, magFilter) {};
    FakeTexture.prototype.setWraps = function (uWrap, vWrap) {};
    FakeTexture.prototype.dispose = function () {};
    return FakeTexture;
  }(spine.Texture);
  spine.FakeTexture = FakeTexture;
})(spine || (spine = {}));
var spine;
(function (spine) {
  var TextureAtlas = function () {
    function TextureAtlas(atlasText, textureLoader) {
      this.pages = new Array();
      this.regions = new Array();
      this.load(atlasText, textureLoader);
    }
    TextureAtlas.prototype.load = function (atlasText, textureLoader) {
      if (textureLoader == null) throw new Error("textureLoader cannot be null.");
      var reader = new TextureAtlasReader(atlasText);
      var tuple = new Array(4);
      var page = null;
      while (true) {
        var line = reader.readLine();
        if (line == null) break;
        line = line.trim();
        if (line.length == 0) page = null;else if (!page) {
          page = new TextureAtlasPage();
          page.name = line;
          if (reader.readTuple(tuple) == 2) {
            page.width = parseInt(tuple[0]);
            page.height = parseInt(tuple[1]);
            reader.readTuple(tuple);
          }
          reader.readTuple(tuple);
          page.minFilter = spine.Texture.filterFromString(tuple[0]);
          page.magFilter = spine.Texture.filterFromString(tuple[1]);
          var direction = reader.readValue();
          page.uWrap = spine.TextureWrap.ClampToEdge;
          page.vWrap = spine.TextureWrap.ClampToEdge;
          if (direction == "x") page.uWrap = spine.TextureWrap.Repeat;else if (direction == "y") page.vWrap = spine.TextureWrap.Repeat;else if (direction == "xy") page.uWrap = page.vWrap = spine.TextureWrap.Repeat;
          page.texture = textureLoader(line);
          page.texture.setFilters(page.minFilter, page.magFilter);
          page.texture.setWraps(page.uWrap, page.vWrap);
          page.width = page.texture.getImage().width;
          page.height = page.texture.getImage().height;
          this.pages.push(page);
        } else {
          var region = new TextureAtlasRegion();
          region.name = line;
          region.page = page;
          region.rotate = reader.readValue() == "true";
          reader.readTuple(tuple);
          var x = parseInt(tuple[0]);
          var y = parseInt(tuple[1]);
          reader.readTuple(tuple);
          var width = parseInt(tuple[0]);
          var height = parseInt(tuple[1]);
          region.u = x / page.width;
          region.v = y / page.height;
          if (region.rotate) {
            region.u2 = (x + height) / page.width;
            region.v2 = (y + width) / page.height;
          } else {
            region.u2 = (x + width) / page.width;
            region.v2 = (y + height) / page.height;
          }
          region.x = x;
          region.y = y;
          region.width = Math.abs(width);
          region.height = Math.abs(height);
          if (reader.readTuple(tuple) == 4) {
            if (reader.readTuple(tuple) == 4) {
              reader.readTuple(tuple);
            }
          }
          region.originalWidth = parseInt(tuple[0]);
          region.originalHeight = parseInt(tuple[1]);
          reader.readTuple(tuple);
          region.offsetX = parseInt(tuple[0]);
          region.offsetY = parseInt(tuple[1]);
          region.index = parseInt(reader.readValue());
          region.texture = page.texture;
          this.regions.push(region);
        }
      }
    };
    TextureAtlas.prototype.findRegion = function (name) {
      for (var i = 0; i < this.regions.length; i++) {
        if (this.regions[i].name == name) {
          return this.regions[i];
        }
      }
      return null;
    };
    TextureAtlas.prototype.dispose = function () {
      for (var i = 0; i < this.pages.length; i++) {
        this.pages[i].texture.dispose();
      }
    };
    return TextureAtlas;
  }();
  spine.TextureAtlas = TextureAtlas;
  var TextureAtlasReader = function () {
    function TextureAtlasReader(text) {
      this.index = 0;
      this.lines = text.split(/\r\n|\r|\n/);
    }
    TextureAtlasReader.prototype.readLine = function () {
      if (this.index >= this.lines.length) return null;
      return this.lines[this.index++];
    };
    TextureAtlasReader.prototype.readValue = function () {
      var line = this.readLine();
      var colon = line.indexOf(":");
      if (colon == -1) throw new Error("Invalid line: " + line);
      return line.substring(colon + 1).trim();
    };
    TextureAtlasReader.prototype.readTuple = function (tuple) {
      var line = this.readLine();
      var colon = line.indexOf(":");
      if (colon == -1) throw new Error("Invalid line: " + line);
      var i = 0,
        lastMatch = colon + 1;
      for (; i < 3; i++) {
        var comma = line.indexOf(",", lastMatch);
        if (comma == -1) break;
        tuple[i] = line.substr(lastMatch, comma - lastMatch).trim();
        lastMatch = comma + 1;
      }
      tuple[i] = line.substring(lastMatch).trim();
      return i + 1;
    };
    return TextureAtlasReader;
  }();
  var TextureAtlasPage = function () {
    function TextureAtlasPage() {}
    return TextureAtlasPage;
  }();
  spine.TextureAtlasPage = TextureAtlasPage;
  var TextureAtlasRegion = function (_super) {
    __extends(TextureAtlasRegion, _super);
    function TextureAtlasRegion() {
      return _super !== null && _super.apply(this, arguments) || this;
    }
    return TextureAtlasRegion;
  }(spine.TextureRegion);
  spine.TextureAtlasRegion = TextureAtlasRegion;
})(spine || (spine = {}));
var spine;
(function (spine) {
  var TransformConstraint = function () {
    function TransformConstraint(data, skeleton) {
      this.rotateMix = 0;
      this.translateMix = 0;
      this.scaleMix = 0;
      this.shearMix = 0;
      this.temp = new spine.Vector2();
      if (data == null) throw new Error("data cannot be null.");
      if (skeleton == null) throw new Error("skeleton cannot be null.");
      this.data = data;
      this.rotateMix = data.rotateMix;
      this.translateMix = data.translateMix;
      this.scaleMix = data.scaleMix;
      this.shearMix = data.shearMix;
      this.bones = new Array();
      for (var i = 0; i < data.bones.length; i++) this.bones.push(skeleton.findBone(data.bones[i].name));
      this.target = skeleton.findBone(data.target.name);
    }
    TransformConstraint.prototype.apply = function () {
      this.update();
    };
    TransformConstraint.prototype.update = function () {
      if (this.data.local) {
        if (this.data.relative) this.applyRelativeLocal();else this.applyAbsoluteLocal();
      } else {
        if (this.data.relative) this.applyRelativeWorld();else this.applyAbsoluteWorld();
      }
    };
    TransformConstraint.prototype.applyAbsoluteWorld = function () {
      var rotateMix = this.rotateMix,
        translateMix = this.translateMix,
        scaleMix = this.scaleMix,
        shearMix = this.shearMix;
      var target = this.target;
      var ta = target.a,
        tb = target.b,
        tc = target.c,
        td = target.d;
      var degRadReflect = ta * td - tb * tc > 0 ? spine.MathUtils.degRad : -spine.MathUtils.degRad;
      var offsetRotation = this.data.offsetRotation * degRadReflect;
      var offsetShearY = this.data.offsetShearY * degRadReflect;
      var bones = this.bones;
      for (var i = 0, n = bones.length; i < n; i++) {
        var bone = bones[i];
        var modified = false;
        if (rotateMix != 0) {
          var a = bone.a,
            b = bone.b,
            c = bone.c,
            d = bone.d;
          var r = Math.atan2(tc, ta) - Math.atan2(c, a) + offsetRotation;
          if (r > spine.MathUtils.PI) r -= spine.MathUtils.PI2;else if (r < -spine.MathUtils.PI) r += spine.MathUtils.PI2;
          r *= rotateMix;
          var cos = Math.cos(r),
            sin = Math.sin(r);
          bone.a = cos * a - sin * c;
          bone.b = cos * b - sin * d;
          bone.c = sin * a + cos * c;
          bone.d = sin * b + cos * d;
          modified = true;
        }
        if (translateMix != 0) {
          var temp = this.temp;
          target.localToWorld(temp.set(this.data.offsetX, this.data.offsetY));
          bone.worldX += (temp.x - bone.worldX) * translateMix;
          bone.worldY += (temp.y - bone.worldY) * translateMix;
          modified = true;
        }
        if (scaleMix > 0) {
          var s = Math.sqrt(bone.a * bone.a + bone.c * bone.c);
          var ts = Math.sqrt(ta * ta + tc * tc);
          if (s > 0.00001) s = (s + (ts - s + this.data.offsetScaleX) * scaleMix) / s;
          bone.a *= s;
          bone.c *= s;
          s = Math.sqrt(bone.b * bone.b + bone.d * bone.d);
          ts = Math.sqrt(tb * tb + td * td);
          if (s > 0.00001) s = (s + (ts - s + this.data.offsetScaleY) * scaleMix) / s;
          bone.b *= s;
          bone.d *= s;
          modified = true;
        }
        if (shearMix > 0) {
          var b = bone.b,
            d = bone.d;
          var by = Math.atan2(d, b);
          var r = Math.atan2(td, tb) - Math.atan2(tc, ta) - (by - Math.atan2(bone.c, bone.a));
          if (r > spine.MathUtils.PI) r -= spine.MathUtils.PI2;else if (r < -spine.MathUtils.PI) r += spine.MathUtils.PI2;
          r = by + (r + offsetShearY) * shearMix;
          var s = Math.sqrt(b * b + d * d);
          bone.b = Math.cos(r) * s;
          bone.d = Math.sin(r) * s;
          modified = true;
        }
        if (modified) bone.appliedValid = false;
      }
    };
    TransformConstraint.prototype.applyRelativeWorld = function () {
      var rotateMix = this.rotateMix,
        translateMix = this.translateMix,
        scaleMix = this.scaleMix,
        shearMix = this.shearMix;
      var target = this.target;
      var ta = target.a,
        tb = target.b,
        tc = target.c,
        td = target.d;
      var degRadReflect = ta * td - tb * tc > 0 ? spine.MathUtils.degRad : -spine.MathUtils.degRad;
      var offsetRotation = this.data.offsetRotation * degRadReflect,
        offsetShearY = this.data.offsetShearY * degRadReflect;
      var bones = this.bones;
      for (var i = 0, n = bones.length; i < n; i++) {
        var bone = bones[i];
        var modified = false;
        if (rotateMix != 0) {
          var a = bone.a,
            b = bone.b,
            c = bone.c,
            d = bone.d;
          var r = Math.atan2(tc, ta) + offsetRotation;
          if (r > spine.MathUtils.PI) r -= spine.MathUtils.PI2;else if (r < -spine.MathUtils.PI) r += spine.MathUtils.PI2;
          r *= rotateMix;
          var cos = Math.cos(r),
            sin = Math.sin(r);
          bone.a = cos * a - sin * c;
          bone.b = cos * b - sin * d;
          bone.c = sin * a + cos * c;
          bone.d = sin * b + cos * d;
          modified = true;
        }
        if (translateMix != 0) {
          var temp = this.temp;
          target.localToWorld(temp.set(this.data.offsetX, this.data.offsetY));
          bone.worldX += temp.x * translateMix;
          bone.worldY += temp.y * translateMix;
          modified = true;
        }
        if (scaleMix > 0) {
          var s = (Math.sqrt(ta * ta + tc * tc) - 1 + this.data.offsetScaleX) * scaleMix + 1;
          bone.a *= s;
          bone.c *= s;
          s = (Math.sqrt(tb * tb + td * td) - 1 + this.data.offsetScaleY) * scaleMix + 1;
          bone.b *= s;
          bone.d *= s;
          modified = true;
        }
        if (shearMix > 0) {
          var r = Math.atan2(td, tb) - Math.atan2(tc, ta);
          if (r > spine.MathUtils.PI) r -= spine.MathUtils.PI2;else if (r < -spine.MathUtils.PI) r += spine.MathUtils.PI2;
          var b = bone.b,
            d = bone.d;
          r = Math.atan2(d, b) + (r - spine.MathUtils.PI / 2 + offsetShearY) * shearMix;
          var s = Math.sqrt(b * b + d * d);
          bone.b = Math.cos(r) * s;
          bone.d = Math.sin(r) * s;
          modified = true;
        }
        if (modified) bone.appliedValid = false;
      }
    };
    TransformConstraint.prototype.applyAbsoluteLocal = function () {
      var rotateMix = this.rotateMix,
        translateMix = this.translateMix,
        scaleMix = this.scaleMix,
        shearMix = this.shearMix;
      var target = this.target;
      if (!target.appliedValid) target.updateAppliedTransform();
      var bones = this.bones;
      for (var i = 0, n = bones.length; i < n; i++) {
        var bone = bones[i];
        if (!bone.appliedValid) bone.updateAppliedTransform();
        var rotation = bone.arotation;
        if (rotateMix != 0) {
          var r = target.arotation - rotation + this.data.offsetRotation;
          r -= (16384 - (16384.499999999996 - r / 360 | 0)) * 360;
          rotation += r * rotateMix;
        }
        var x = bone.ax,
          y = bone.ay;
        if (translateMix != 0) {
          x += (target.ax - x + this.data.offsetX) * translateMix;
          y += (target.ay - y + this.data.offsetY) * translateMix;
        }
        var scaleX = bone.ascaleX,
          scaleY = bone.ascaleY;
        if (scaleMix > 0) {
          if (scaleX > 0.00001) scaleX = (scaleX + (target.ascaleX - scaleX + this.data.offsetScaleX) * scaleMix) / scaleX;
          if (scaleY > 0.00001) scaleY = (scaleY + (target.ascaleY - scaleY + this.data.offsetScaleY) * scaleMix) / scaleY;
        }
        var shearY = bone.ashearY;
        if (shearMix > 0) {
          var r = target.ashearY - shearY + this.data.offsetShearY;
          r -= (16384 - (16384.499999999996 - r / 360 | 0)) * 360;
          bone.shearY += r * shearMix;
        }
        bone.updateWorldTransformWith(x, y, rotation, scaleX, scaleY, bone.ashearX, shearY);
      }
    };
    TransformConstraint.prototype.applyRelativeLocal = function () {
      var rotateMix = this.rotateMix,
        translateMix = this.translateMix,
        scaleMix = this.scaleMix,
        shearMix = this.shearMix;
      var target = this.target;
      if (!target.appliedValid) target.updateAppliedTransform();
      var bones = this.bones;
      for (var i = 0, n = bones.length; i < n; i++) {
        var bone = bones[i];
        if (!bone.appliedValid) bone.updateAppliedTransform();
        var rotation = bone.arotation;
        if (rotateMix != 0) rotation += (target.arotation + this.data.offsetRotation) * rotateMix;
        var x = bone.ax,
          y = bone.ay;
        if (translateMix != 0) {
          x += (target.ax + this.data.offsetX) * translateMix;
          y += (target.ay + this.data.offsetY) * translateMix;
        }
        var scaleX = bone.ascaleX,
          scaleY = bone.ascaleY;
        if (scaleMix > 0) {
          if (scaleX > 0.00001) scaleX *= (target.ascaleX - 1 + this.data.offsetScaleX) * scaleMix + 1;
          if (scaleY > 0.00001) scaleY *= (target.ascaleY - 1 + this.data.offsetScaleY) * scaleMix + 1;
        }
        var shearY = bone.ashearY;
        if (shearMix > 0) shearY += (target.ashearY + this.data.offsetShearY) * shearMix;
        bone.updateWorldTransformWith(x, y, rotation, scaleX, scaleY, bone.ashearX, shearY);
      }
    };
    TransformConstraint.prototype.getOrder = function () {
      return this.data.order;
    };
    return TransformConstraint;
  }();
  spine.TransformConstraint = TransformConstraint;
})(spine || (spine = {}));
var spine;
(function (spine) {
  var TransformConstraintData = function () {
    function TransformConstraintData(name) {
      this.order = 0;
      this.bones = new Array();
      this.rotateMix = 0;
      this.translateMix = 0;
      this.scaleMix = 0;
      this.shearMix = 0;
      this.offsetRotation = 0;
      this.offsetX = 0;
      this.offsetY = 0;
      this.offsetScaleX = 0;
      this.offsetScaleY = 0;
      this.offsetShearY = 0;
      this.relative = false;
      this.local = false;
      if (name == null) throw new Error("name cannot be null.");
      this.name = name;
    }
    return TransformConstraintData;
  }();
  spine.TransformConstraintData = TransformConstraintData;
})(spine || (spine = {}));
var spine;
(function (spine) {
  var Triangulator = function () {
    function Triangulator() {
      this.convexPolygons = new Array();
      this.convexPolygonsIndices = new Array();
      this.indicesArray = new Array();
      this.isConcaveArray = new Array();
      this.triangles = new Array();
      this.polygonPool = new spine.Pool(function () {
        return new Array();
      });
      this.polygonIndicesPool = new spine.Pool(function () {
        return new Array();
      });
    }
    Triangulator.prototype.triangulate = function (verticesArray) {
      var vertices = verticesArray;
      var vertexCount = verticesArray.length >> 1;
      var indices = this.indicesArray;
      indices.length = 0;
      for (var i = 0; i < vertexCount; i++) indices[i] = i;
      var isConcave = this.isConcaveArray;
      isConcave.length = 0;
      for (var i = 0, n = vertexCount; i < n; ++i) isConcave[i] = Triangulator.isConcave(i, vertexCount, vertices, indices);
      var triangles = this.triangles;
      triangles.length = 0;
      while (vertexCount > 3) {
        var previous = vertexCount - 1,
          i = 0,
          next = 1;
        while (true) {
          outer: if (!isConcave[i]) {
            var p1 = indices[previous] << 1,
              p2 = indices[i] << 1,
              p3 = indices[next] << 1;
            var p1x = vertices[p1],
              p1y = vertices[p1 + 1];
            var p2x = vertices[p2],
              p2y = vertices[p2 + 1];
            var p3x = vertices[p3],
              p3y = vertices[p3 + 1];
            for (var ii = (next + 1) % vertexCount; ii != previous; ii = (ii + 1) % vertexCount) {
              if (!isConcave[ii]) continue;
              var v = indices[ii] << 1;
              var vx = vertices[v],
                vy = vertices[v + 1];
              if (Triangulator.positiveArea(p3x, p3y, p1x, p1y, vx, vy)) {
                if (Triangulator.positiveArea(p1x, p1y, p2x, p2y, vx, vy)) {
                  if (Triangulator.positiveArea(p2x, p2y, p3x, p3y, vx, vy)) break outer;
                }
              }
            }
            break;
          }
          if (next == 0) {
            do {
              if (!isConcave[i]) break;
              i--;
            } while (i > 0);
            break;
          }
          previous = i;
          i = next;
          next = (next + 1) % vertexCount;
        }
        triangles.push(indices[(vertexCount + i - 1) % vertexCount]);
        triangles.push(indices[i]);
        triangles.push(indices[(i + 1) % vertexCount]);
        indices.splice(i, 1);
        isConcave.splice(i, 1);
        vertexCount--;
        var previousIndex = (vertexCount + i - 1) % vertexCount;
        var nextIndex = i == vertexCount ? 0 : i;
        isConcave[previousIndex] = Triangulator.isConcave(previousIndex, vertexCount, vertices, indices);
        isConcave[nextIndex] = Triangulator.isConcave(nextIndex, vertexCount, vertices, indices);
      }
      if (vertexCount == 3) {
        triangles.push(indices[2]);
        triangles.push(indices[0]);
        triangles.push(indices[1]);
      }
      return triangles;
    };
    Triangulator.prototype.decompose = function (verticesArray, triangles) {
      var vertices = verticesArray;
      var convexPolygons = this.convexPolygons;
      this.polygonPool.freeAll(convexPolygons);
      convexPolygons.length = 0;
      var convexPolygonsIndices = this.convexPolygonsIndices;
      this.polygonIndicesPool.freeAll(convexPolygonsIndices);
      convexPolygonsIndices.length = 0;
      var polygonIndices = this.polygonIndicesPool.obtain();
      polygonIndices.length = 0;
      var polygon = this.polygonPool.obtain();
      polygon.length = 0;
      var fanBaseIndex = -1,
        lastWinding = 0;
      for (var i = 0, n = triangles.length; i < n; i += 3) {
        var t1 = triangles[i] << 1,
          t2 = triangles[i + 1] << 1,
          t3 = triangles[i + 2] << 1;
        var x1 = vertices[t1],
          y1 = vertices[t1 + 1];
        var x2 = vertices[t2],
          y2 = vertices[t2 + 1];
        var x3 = vertices[t3],
          y3 = vertices[t3 + 1];
        var merged = false;
        if (fanBaseIndex == t1) {
          var o = polygon.length - 4;
          var winding1 = Triangulator.winding(polygon[o], polygon[o + 1], polygon[o + 2], polygon[o + 3], x3, y3);
          var winding2 = Triangulator.winding(x3, y3, polygon[0], polygon[1], polygon[2], polygon[3]);
          if (winding1 == lastWinding && winding2 == lastWinding) {
            polygon.push(x3);
            polygon.push(y3);
            polygonIndices.push(t3);
            merged = true;
          }
        }
        if (!merged) {
          if (polygon.length > 0) {
            convexPolygons.push(polygon);
            convexPolygonsIndices.push(polygonIndices);
          } else {
            this.polygonPool.free(polygon);
            this.polygonIndicesPool.free(polygonIndices);
          }
          polygon = this.polygonPool.obtain();
          polygon.length = 0;
          polygon.push(x1);
          polygon.push(y1);
          polygon.push(x2);
          polygon.push(y2);
          polygon.push(x3);
          polygon.push(y3);
          polygonIndices = this.polygonIndicesPool.obtain();
          polygonIndices.length = 0;
          polygonIndices.push(t1);
          polygonIndices.push(t2);
          polygonIndices.push(t3);
          lastWinding = Triangulator.winding(x1, y1, x2, y2, x3, y3);
          fanBaseIndex = t1;
        }
      }
      if (polygon.length > 0) {
        convexPolygons.push(polygon);
        convexPolygonsIndices.push(polygonIndices);
      }
      for (var i = 0, n = convexPolygons.length; i < n; i++) {
        polygonIndices = convexPolygonsIndices[i];
        if (polygonIndices.length == 0) continue;
        var firstIndex = polygonIndices[0];
        var lastIndex = polygonIndices[polygonIndices.length - 1];
        polygon = convexPolygons[i];
        var o = polygon.length - 4;
        var prevPrevX = polygon[o],
          prevPrevY = polygon[o + 1];
        var prevX = polygon[o + 2],
          prevY = polygon[o + 3];
        var firstX = polygon[0],
          firstY = polygon[1];
        var secondX = polygon[2],
          secondY = polygon[3];
        var winding = Triangulator.winding(prevPrevX, prevPrevY, prevX, prevY, firstX, firstY);
        for (var ii = 0; ii < n; ii++) {
          if (ii == i) continue;
          var otherIndices = convexPolygonsIndices[ii];
          if (otherIndices.length != 3) continue;
          var otherFirstIndex = otherIndices[0];
          var otherSecondIndex = otherIndices[1];
          var otherLastIndex = otherIndices[2];
          var otherPoly = convexPolygons[ii];
          var x3 = otherPoly[otherPoly.length - 2],
            y3 = otherPoly[otherPoly.length - 1];
          if (otherFirstIndex != firstIndex || otherSecondIndex != lastIndex) continue;
          var winding1 = Triangulator.winding(prevPrevX, prevPrevY, prevX, prevY, x3, y3);
          var winding2 = Triangulator.winding(x3, y3, firstX, firstY, secondX, secondY);
          if (winding1 == winding && winding2 == winding) {
            otherPoly.length = 0;
            otherIndices.length = 0;
            polygon.push(x3);
            polygon.push(y3);
            polygonIndices.push(otherLastIndex);
            prevPrevX = prevX;
            prevPrevY = prevY;
            prevX = x3;
            prevY = y3;
            ii = 0;
          }
        }
      }
      for (var i = convexPolygons.length - 1; i >= 0; i--) {
        polygon = convexPolygons[i];
        if (polygon.length == 0) {
          convexPolygons.splice(i, 1);
          this.polygonPool.free(polygon);
          polygonIndices = convexPolygonsIndices[i];
          convexPolygonsIndices.splice(i, 1);
          this.polygonIndicesPool.free(polygonIndices);
        }
      }
      return convexPolygons;
    };
    Triangulator.isConcave = function (index, vertexCount, vertices, indices) {
      var previous = indices[(vertexCount + index - 1) % vertexCount] << 1;
      var current = indices[index] << 1;
      var next = indices[(index + 1) % vertexCount] << 1;
      return !this.positiveArea(vertices[previous], vertices[previous + 1], vertices[current], vertices[current + 1], vertices[next], vertices[next + 1]);
    };
    Triangulator.positiveArea = function (p1x, p1y, p2x, p2y, p3x, p3y) {
      return p1x * (p3y - p2y) + p2x * (p1y - p3y) + p3x * (p2y - p1y) >= 0;
    };
    Triangulator.winding = function (p1x, p1y, p2x, p2y, p3x, p3y) {
      var px = p2x - p1x,
        py = p2y - p1y;
      return p3x * py - p3y * px + px * p1y - p1x * py >= 0 ? 1 : -1;
    };
    return Triangulator;
  }();
  spine.Triangulator = Triangulator;
})(spine || (spine = {}));
var spine;
(function (spine) {
  var IntSet = function () {
    function IntSet() {
      this.array = new Array();
    }
    IntSet.prototype.add = function (value) {
      var contains = this.contains(value);
      this.array[value | 0] = value | 0;
      return !contains;
    };
    IntSet.prototype.contains = function (value) {
      return this.array[value | 0] != undefined;
    };
    IntSet.prototype.remove = function (value) {
      this.array[value | 0] = undefined;
    };
    IntSet.prototype.clear = function () {
      this.array.length = 0;
    };
    return IntSet;
  }();
  spine.IntSet = IntSet;
  var Color = function () {
    function Color(r, g, b, a) {
      if (r === void 0) {
        r = 0;
      }
      if (g === void 0) {
        g = 0;
      }
      if (b === void 0) {
        b = 0;
      }
      if (a === void 0) {
        a = 0;
      }
      this.r = r;
      this.g = g;
      this.b = b;
      this.a = a;
    }
    Color.prototype.set = function (r, g, b, a) {
      this.r = r;
      this.g = g;
      this.b = b;
      this.a = a;
      this.clamp();
      return this;
    };
    Color.prototype.setFromColor = function (c) {
      this.r = c.r;
      this.g = c.g;
      this.b = c.b;
      this.a = c.a;
      return this;
    };
    Color.prototype.setFromString = function (hex) {
      hex = hex.charAt(0) == '#' ? hex.substr(1) : hex;
      this.r = parseInt(hex.substr(0, 2), 16) / 255.0;
      this.g = parseInt(hex.substr(2, 2), 16) / 255.0;
      this.b = parseInt(hex.substr(4, 2), 16) / 255.0;
      this.a = (hex.length != 8 ? 255 : parseInt(hex.substr(6, 2), 16)) / 255.0;
      return this;
    };
    Color.prototype.add = function (r, g, b, a) {
      this.r += r;
      this.g += g;
      this.b += b;
      this.a += a;
      this.clamp();
      return this;
    };
    Color.prototype.clamp = function () {
      if (this.r < 0) this.r = 0;else if (this.r > 1) this.r = 1;
      if (this.g < 0) this.g = 0;else if (this.g > 1) this.g = 1;
      if (this.b < 0) this.b = 0;else if (this.b > 1) this.b = 1;
      if (this.a < 0) this.a = 0;else if (this.a > 1) this.a = 1;
      return this;
    };
    return Color;
  }();
  Color.WHITE = new Color(1, 1, 1, 1);
  Color.RED = new Color(1, 0, 0, 1);
  Color.GREEN = new Color(0, 1, 0, 1);
  Color.BLUE = new Color(0, 0, 1, 1);
  Color.MAGENTA = new Color(1, 0, 1, 1);
  spine.Color = Color;
  var MathUtils = function () {
    function MathUtils() {}
    MathUtils.clamp = function (value, min, max) {
      if (value < min) return min;
      if (value > max) return max;
      return value;
    };
    MathUtils.cosDeg = function (degrees) {
      return Math.cos(degrees * MathUtils.degRad);
    };
    MathUtils.sinDeg = function (degrees) {
      return Math.sin(degrees * MathUtils.degRad);
    };
    MathUtils.signum = function (value) {
      return value > 0 ? 1 : value < 0 ? -1 : 0;
    };
    MathUtils.toInt = function (x) {
      return x > 0 ? Math.floor(x) : Math.ceil(x);
    };
    MathUtils.cbrt = function (x) {
      var y = Math.pow(Math.abs(x), 1 / 3);
      return x < 0 ? -y : y;
    };
    MathUtils.randomTriangular = function (min, max) {
      return MathUtils.randomTriangularWith(min, max, (min + max) * 0.5);
    };
    MathUtils.randomTriangularWith = function (min, max, mode) {
      var u = Math.random();
      var d = max - min;
      if (u <= (mode - min) / d) return min + Math.sqrt(u * d * (mode - min));
      return max - Math.sqrt((1 - u) * d * (max - mode));
    };
    return MathUtils;
  }();
  MathUtils.PI = 3.1415927;
  MathUtils.PI2 = MathUtils.PI * 2;
  MathUtils.radiansToDegrees = 180 / MathUtils.PI;
  MathUtils.radDeg = MathUtils.radiansToDegrees;
  MathUtils.degreesToRadians = MathUtils.PI / 180;
  MathUtils.degRad = MathUtils.degreesToRadians;
  spine.MathUtils = MathUtils;
  var Interpolation = function () {
    function Interpolation() {}
    Interpolation.prototype.apply = function (start, end, a) {
      return start + (end - start) * this.applyInternal(a);
    };
    return Interpolation;
  }();
  spine.Interpolation = Interpolation;
  var Pow = function (_super) {
    __extends(Pow, _super);
    function Pow(power) {
      var _this = _super.call(this) || this;
      _this.power = 2;
      _this.power = power;
      return _this;
    }
    Pow.prototype.applyInternal = function (a) {
      if (a <= 0.5) return Math.pow(a * 2, this.power) / 2;
      return Math.pow((a - 1) * 2, this.power) / (this.power % 2 == 0 ? -2 : 2) + 1;
    };
    return Pow;
  }(Interpolation);
  spine.Pow = Pow;
  var PowOut = function (_super) {
    __extends(PowOut, _super);
    function PowOut(power) {
      return _super.call(this, power) || this;
    }
    PowOut.prototype.applyInternal = function (a) {
      return Math.pow(a - 1, this.power) * (this.power % 2 == 0 ? -1 : 1) + 1;
    };
    return PowOut;
  }(Pow);
  spine.PowOut = PowOut;
  var Utils = function () {
    function Utils() {}
    Utils.arrayCopy = function (source, sourceStart, dest, destStart, numElements) {
      for (var i = sourceStart, j = destStart; i < sourceStart + numElements; i++, j++) {
        dest[j] = source[i];
      }
    };
    Utils.setArraySize = function (array, size, value) {
      if (value === void 0) {
        value = 0;
      }
      var oldSize = array.length;
      if (oldSize == size) return array;
      array.length = size;
      if (oldSize < size) {
        for (var i = oldSize; i < size; i++) array[i] = value;
      }
      return array;
    };
    Utils.ensureArrayCapacity = function (array, size, value) {
      if (value === void 0) {
        value = 0;
      }
      if (array.length >= size) return array;
      return Utils.setArraySize(array, size, value);
    };
    Utils.newArray = function (size, defaultValue) {
      var array = new Array(size);
      for (var i = 0; i < size; i++) array[i] = defaultValue;
      return array;
    };
    Utils.newFloatArray = function (size) {
      if (Utils.SUPPORTS_TYPED_ARRAYS) {
        return new Float32Array(size);
      } else {
        var array = new Array(size);
        for (var i = 0; i < array.length; i++) array[i] = 0;
        return array;
      }
    };
    Utils.newShortArray = function (size) {
      if (Utils.SUPPORTS_TYPED_ARRAYS) {
        return new Int16Array(size);
      } else {
        var array = new Array(size);
        for (var i = 0; i < array.length; i++) array[i] = 0;
        return array;
      }
    };
    Utils.toFloatArray = function (array) {
      return Utils.SUPPORTS_TYPED_ARRAYS ? new Float32Array(array) : array;
    };
    Utils.toSinglePrecision = function (value) {
      return Utils.SUPPORTS_TYPED_ARRAYS ? Math.fround(value) : value;
    };
    return Utils;
  }();
  Utils.SUPPORTS_TYPED_ARRAYS = typeof Float32Array !== "undefined";
  spine.Utils = Utils;
  var DebugUtils = function () {
    function DebugUtils() {}
    DebugUtils.logBones = function (skeleton) {
      for (var i = 0; i < skeleton.bones.length; i++) {
        var bone = skeleton.bones[i];
        console.log(bone.data.name + ", " + bone.a + ", " + bone.b + ", " + bone.c + ", " + bone.d + ", " + bone.worldX + ", " + bone.worldY);
      }
    };
    return DebugUtils;
  }();
  spine.DebugUtils = DebugUtils;
  var Pool = function () {
    function Pool(instantiator) {
      this.items = new Array();
      this.instantiator = instantiator;
    }
    Pool.prototype.obtain = function () {
      return this.items.length > 0 ? this.items.pop() : this.instantiator();
    };
    Pool.prototype.free = function (item) {
      if (item.reset) item.reset();
      this.items.push(item);
    };
    Pool.prototype.freeAll = function (items) {
      for (var i = 0; i < items.length; i++) {
        if (items[i].reset) items[i].reset();
        this.items[i] = items[i];
      }
    };
    Pool.prototype.clear = function () {
      this.items.length = 0;
    };
    return Pool;
  }();
  spine.Pool = Pool;
  var Vector2 = function () {
    function Vector2(x, y) {
      if (x === void 0) {
        x = 0;
      }
      if (y === void 0) {
        y = 0;
      }
      this.x = x;
      this.y = y;
    }
    Vector2.prototype.set = function (x, y) {
      this.x = x;
      this.y = y;
      return this;
    };
    Vector2.prototype.length = function () {
      var x = this.x;
      var y = this.y;
      return Math.sqrt(x * x + y * y);
    };
    Vector2.prototype.normalize = function () {
      var len = this.length();
      if (len != 0) {
        this.x /= len;
        this.y /= len;
      }
      return this;
    };
    return Vector2;
  }();
  spine.Vector2 = Vector2;
  var TimeKeeper = function () {
    function TimeKeeper() {
      this.maxDelta = 0.064;
      this.framesPerSecond = 0;
      this.delta = 0;
      this.totalTime = 0;
      this.lastTime = Date.now() / 1000;
      this.frameCount = 0;
      this.frameTime = 0;
    }
    TimeKeeper.prototype.update = function () {
      var now = Date.now() / 1000;
      this.delta = now - this.lastTime;
      this.frameTime += this.delta;
      this.totalTime += this.delta;
      if (this.delta > this.maxDelta) this.delta = this.maxDelta;
      this.lastTime = now;
      this.frameCount++;
      if (this.frameTime > 1) {
        this.framesPerSecond = this.frameCount / this.frameTime;
        this.frameTime = 0;
        this.frameCount = 0;
      }
    };
    return TimeKeeper;
  }();
  spine.TimeKeeper = TimeKeeper;
  var WindowedMean = function () {
    function WindowedMean(windowSize) {
      if (windowSize === void 0) {
        windowSize = 32;
      }
      this.addedValues = 0;
      this.lastValue = 0;
      this.mean = 0;
      this.dirty = true;
      this.values = new Array(windowSize);
    }
    WindowedMean.prototype.hasEnoughData = function () {
      return this.addedValues >= this.values.length;
    };
    WindowedMean.prototype.addValue = function (value) {
      if (this.addedValues < this.values.length) this.addedValues++;
      this.values[this.lastValue++] = value;
      if (this.lastValue > this.values.length - 1) this.lastValue = 0;
      this.dirty = true;
    };
    WindowedMean.prototype.getMean = function () {
      if (this.hasEnoughData()) {
        if (this.dirty) {
          var mean = 0;
          for (var i = 0; i < this.values.length; i++) {
            mean += this.values[i];
          }
          this.mean = mean / this.values.length;
          this.dirty = false;
        }
        return this.mean;
      } else {
        return 0;
      }
    };
    return WindowedMean;
  }();
  spine.WindowedMean = WindowedMean;
})(spine || (spine = {}));
var spine;
(function (spine) {
  var Attachment = function () {
    function Attachment(name) {
      if (name == null) throw new Error("name cannot be null.");
      this.name = name;
    }
    return Attachment;
  }();
  spine.Attachment = Attachment;
  var VertexAttachment = function (_super) {
    __extends(VertexAttachment, _super);
    function VertexAttachment(name) {
      var _this = _super.call(this, name) || this;
      _this.id = (VertexAttachment.nextID++ & 65535) << 11;
      _this.worldVerticesLength = 0;
      return _this;
    }
    VertexAttachment.prototype.computeWorldVertices = function (slot, start, count, worldVertices, offset, stride) {
      count = offset + (count >> 1) * stride;
      var skeleton = slot.bone.skeleton;
      var deformArray = slot.attachmentVertices;
      var vertices = this.vertices;
      var bones = this.bones;
      if (bones == null) {
        if (deformArray.length > 0) vertices = deformArray;
        var bone = slot.bone;
        var x = bone.worldX;
        var y = bone.worldY;
        var a = bone.a,
          b = bone.b,
          c = bone.c,
          d = bone.d;
        for (var v_1 = start, w = offset; w < count; v_1 += 2, w += stride) {
          var vx = vertices[v_1],
            vy = vertices[v_1 + 1];
          worldVertices[w] = vx * a + vy * b + x;
          worldVertices[w + 1] = vx * c + vy * d + y;
        }
        return;
      }
      var v = 0,
        skip = 0;
      for (var i = 0; i < start; i += 2) {
        var n = bones[v];
        v += n + 1;
        skip += n;
      }
      var skeletonBones = skeleton.bones;
      if (deformArray.length == 0) {
        for (var w = offset, b = skip * 3; w < count; w += stride) {
          var wx = 0,
            wy = 0;
          var n = bones[v++];
          n += v;
          for (; v < n; v++, b += 3) {
            var bone = skeletonBones[bones[v]];
            var vx = vertices[b],
              vy = vertices[b + 1],
              weight = vertices[b + 2];
            wx += (vx * bone.a + vy * bone.b + bone.worldX) * weight;
            wy += (vx * bone.c + vy * bone.d + bone.worldY) * weight;
          }
          worldVertices[w] = wx;
          worldVertices[w + 1] = wy;
        }
      } else {
        var deform = deformArray;
        for (var w = offset, b = skip * 3, f = skip << 1; w < count; w += stride) {
          var wx = 0,
            wy = 0;
          var n = bones[v++];
          n += v;
          for (; v < n; v++, b += 3, f += 2) {
            var bone = skeletonBones[bones[v]];
            var vx = vertices[b] + deform[f],
              vy = vertices[b + 1] + deform[f + 1],
              weight = vertices[b + 2];
            wx += (vx * bone.a + vy * bone.b + bone.worldX) * weight;
            wy += (vx * bone.c + vy * bone.d + bone.worldY) * weight;
          }
          worldVertices[w] = wx;
          worldVertices[w + 1] = wy;
        }
      }
    };
    VertexAttachment.prototype.applyDeform = function (sourceAttachment) {
      return this == sourceAttachment;
    };
    return VertexAttachment;
  }(Attachment);
  VertexAttachment.nextID = 0;
  spine.VertexAttachment = VertexAttachment;
})(spine || (spine = {}));
var spine;
(function (spine) {
  var AttachmentType;
  (function (AttachmentType) {
    AttachmentType[AttachmentType["Region"] = 0] = "Region";
    AttachmentType[AttachmentType["BoundingBox"] = 1] = "BoundingBox";
    AttachmentType[AttachmentType["Mesh"] = 2] = "Mesh";
    AttachmentType[AttachmentType["LinkedMesh"] = 3] = "LinkedMesh";
    AttachmentType[AttachmentType["Path"] = 4] = "Path";
    AttachmentType[AttachmentType["Point"] = 5] = "Point";
  })(AttachmentType = spine.AttachmentType || (spine.AttachmentType = {}));
})(spine || (spine = {}));
var spine;
(function (spine) {
  var BoundingBoxAttachment = function (_super) {
    __extends(BoundingBoxAttachment, _super);
    function BoundingBoxAttachment(name) {
      var _this = _super.call(this, name) || this;
      _this.color = new spine.Color(1, 1, 1, 1);
      return _this;
    }
    return BoundingBoxAttachment;
  }(spine.VertexAttachment);
  spine.BoundingBoxAttachment = BoundingBoxAttachment;
})(spine || (spine = {}));
var spine;
(function (spine) {
  var ClippingAttachment = function (_super) {
    __extends(ClippingAttachment, _super);
    function ClippingAttachment(name) {
      var _this = _super.call(this, name) || this;
      _this.color = new spine.Color(0.2275, 0.2275, 0.8078, 1);
      return _this;
    }
    return ClippingAttachment;
  }(spine.VertexAttachment);
  spine.ClippingAttachment = ClippingAttachment;
})(spine || (spine = {}));
var spine;
(function (spine) {
  var MeshAttachment = function (_super) {
    __extends(MeshAttachment, _super);
    function MeshAttachment(name) {
      var _this = _super.call(this, name) || this;
      _this.color = new spine.Color(1, 1, 1, 1);
      _this.inheritDeform = false;
      _this.tempColor = new spine.Color(0, 0, 0, 0);
      return _this;
    }
    MeshAttachment.prototype.updateUVs = function () {
      var u = 0,
        v = 0,
        width = 0,
        height = 0;
      if (this.region == null) {
        u = v = 0;
        width = height = 1;
      } else {
        u = this.region.u;
        v = this.region.v;
        width = this.region.u2 - u;
        height = this.region.v2 - v;
      }
      var regionUVs = this.regionUVs;
      if (this.uvs == null || this.uvs.length != regionUVs.length) this.uvs = spine.Utils.newFloatArray(regionUVs.length);
      var uvs = this.uvs;
      if (this.region.rotate) {
        for (var i = 0, n = uvs.length; i < n; i += 2) {
          uvs[i] = u + regionUVs[i + 1] * width;
          uvs[i + 1] = v + height - regionUVs[i] * height;
        }
      } else {
        for (var i = 0, n = uvs.length; i < n; i += 2) {
          uvs[i] = u + regionUVs[i] * width;
          uvs[i + 1] = v + regionUVs[i + 1] * height;
        }
      }
    };
    MeshAttachment.prototype.applyDeform = function (sourceAttachment) {
      return this == sourceAttachment || this.inheritDeform && this.parentMesh == sourceAttachment;
    };
    MeshAttachment.prototype.getParentMesh = function () {
      return this.parentMesh;
    };
    MeshAttachment.prototype.setParentMesh = function (parentMesh) {
      this.parentMesh = parentMesh;
      if (parentMesh != null) {
        this.bones = parentMesh.bones;
        this.vertices = parentMesh.vertices;
        this.worldVerticesLength = parentMesh.worldVerticesLength;
        this.regionUVs = parentMesh.regionUVs;
        this.triangles = parentMesh.triangles;
        this.hullLength = parentMesh.hullLength;
        this.worldVerticesLength = parentMesh.worldVerticesLength;
      }
    };
    return MeshAttachment;
  }(spine.VertexAttachment);
  spine.MeshAttachment = MeshAttachment;
})(spine || (spine = {}));
var spine;
(function (spine) {
  var PathAttachment = function (_super) {
    __extends(PathAttachment, _super);
    function PathAttachment(name) {
      var _this = _super.call(this, name) || this;
      _this.closed = false;
      _this.constantSpeed = false;
      _this.color = new spine.Color(1, 1, 1, 1);
      return _this;
    }
    return PathAttachment;
  }(spine.VertexAttachment);
  spine.PathAttachment = PathAttachment;
})(spine || (spine = {}));
var spine;
(function (spine) {
  var PointAttachment = function (_super) {
    __extends(PointAttachment, _super);
    function PointAttachment(name) {
      var _this = _super.call(this, name) || this;
      _this.color = new spine.Color(0.38, 0.94, 0, 1);
      return _this;
    }
    PointAttachment.prototype.computeWorldPosition = function (bone, point) {
      point.x = this.x * bone.a + this.y * bone.b + bone.worldX;
      point.y = this.x * bone.c + this.y * bone.d + bone.worldY;
      return point;
    };
    PointAttachment.prototype.computeWorldRotation = function (bone) {
      var cos = spine.MathUtils.cosDeg(this.rotation),
        sin = spine.MathUtils.sinDeg(this.rotation);
      var x = cos * bone.a + sin * bone.b;
      var y = cos * bone.c + sin * bone.d;
      return Math.atan2(y, x) * spine.MathUtils.radDeg;
    };
    return PointAttachment;
  }(spine.VertexAttachment);
  spine.PointAttachment = PointAttachment;
})(spine || (spine = {}));
var spine;
(function (spine) {
  var RegionAttachment = function (_super) {
    __extends(RegionAttachment, _super);
    function RegionAttachment(name) {
      var _this = _super.call(this, name) || this;
      _this.x = 0;
      _this.y = 0;
      _this.scaleX = 1;
      _this.scaleY = 1;
      _this.rotation = 0;
      _this.width = 0;
      _this.height = 0;
      _this.color = new spine.Color(1, 1, 1, 1);
      _this.offset = spine.Utils.newFloatArray(8);
      _this.uvs = spine.Utils.newFloatArray(8);
      _this.tempColor = new spine.Color(1, 1, 1, 1);
      return _this;
    }
    RegionAttachment.prototype.updateOffset = function () {
      var regionScaleX = this.width / this.region.originalWidth * this.scaleX;
      var regionScaleY = this.height / this.region.originalHeight * this.scaleY;
      var localX = -this.width / 2 * this.scaleX + this.region.offsetX * regionScaleX;
      var localY = -this.height / 2 * this.scaleY + this.region.offsetY * regionScaleY;
      var localX2 = localX + this.region.width * regionScaleX;
      var localY2 = localY + this.region.height * regionScaleY;
      var radians = this.rotation * Math.PI / 180;
      var cos = Math.cos(radians);
      var sin = Math.sin(radians);
      var localXCos = localX * cos + this.x;
      var localXSin = localX * sin;
      var localYCos = localY * cos + this.y;
      var localYSin = localY * sin;
      var localX2Cos = localX2 * cos + this.x;
      var localX2Sin = localX2 * sin;
      var localY2Cos = localY2 * cos + this.y;
      var localY2Sin = localY2 * sin;
      var offset = this.offset;
      offset[RegionAttachment.OX1] = localXCos - localYSin;
      offset[RegionAttachment.OY1] = localYCos + localXSin;
      offset[RegionAttachment.OX2] = localXCos - localY2Sin;
      offset[RegionAttachment.OY2] = localY2Cos + localXSin;
      offset[RegionAttachment.OX3] = localX2Cos - localY2Sin;
      offset[RegionAttachment.OY3] = localY2Cos + localX2Sin;
      offset[RegionAttachment.OX4] = localX2Cos - localYSin;
      offset[RegionAttachment.OY4] = localYCos + localX2Sin;
    };
    RegionAttachment.prototype.setRegion = function (region) {
      this.region = region;
      var uvs = this.uvs;
      if (region.rotate) {
        uvs[2] = region.u;
        uvs[3] = region.v2;
        uvs[4] = region.u;
        uvs[5] = region.v;
        uvs[6] = region.u2;
        uvs[7] = region.v;
        uvs[0] = region.u2;
        uvs[1] = region.v2;
      } else {
        uvs[0] = region.u;
        uvs[1] = region.v2;
        uvs[2] = region.u;
        uvs[3] = region.v;
        uvs[4] = region.u2;
        uvs[5] = region.v;
        uvs[6] = region.u2;
        uvs[7] = region.v2;
      }
    };
    RegionAttachment.prototype.computeWorldVertices = function (bone, worldVertices, offset, stride) {
      var vertexOffset = this.offset;
      var x = bone.worldX,
        y = bone.worldY;
      var a = bone.a,
        b = bone.b,
        c = bone.c,
        d = bone.d;
      var offsetX = 0,
        offsetY = 0;
      offsetX = vertexOffset[RegionAttachment.OX1];
      offsetY = vertexOffset[RegionAttachment.OY1];
      worldVertices[offset] = offsetX * a + offsetY * b + x;
      worldVertices[offset + 1] = offsetX * c + offsetY * d + y;
      offset += stride;
      offsetX = vertexOffset[RegionAttachment.OX2];
      offsetY = vertexOffset[RegionAttachment.OY2];
      worldVertices[offset] = offsetX * a + offsetY * b + x;
      worldVertices[offset + 1] = offsetX * c + offsetY * d + y;
      offset += stride;
      offsetX = vertexOffset[RegionAttachment.OX3];
      offsetY = vertexOffset[RegionAttachment.OY3];
      worldVertices[offset] = offsetX * a + offsetY * b + x;
      worldVertices[offset + 1] = offsetX * c + offsetY * d + y;
      offset += stride;
      offsetX = vertexOffset[RegionAttachment.OX4];
      offsetY = vertexOffset[RegionAttachment.OY4];
      worldVertices[offset] = offsetX * a + offsetY * b + x;
      worldVertices[offset + 1] = offsetX * c + offsetY * d + y;
    };
    return RegionAttachment;
  }(spine.Attachment);
  RegionAttachment.OX1 = 0;
  RegionAttachment.OY1 = 1;
  RegionAttachment.OX2 = 2;
  RegionAttachment.OY2 = 3;
  RegionAttachment.OX3 = 4;
  RegionAttachment.OY3 = 5;
  RegionAttachment.OX4 = 6;
  RegionAttachment.OY4 = 7;
  RegionAttachment.X1 = 0;
  RegionAttachment.Y1 = 1;
  RegionAttachment.C1R = 2;
  RegionAttachment.C1G = 3;
  RegionAttachment.C1B = 4;
  RegionAttachment.C1A = 5;
  RegionAttachment.U1 = 6;
  RegionAttachment.V1 = 7;
  RegionAttachment.X2 = 8;
  RegionAttachment.Y2 = 9;
  RegionAttachment.C2R = 10;
  RegionAttachment.C2G = 11;
  RegionAttachment.C2B = 12;
  RegionAttachment.C2A = 13;
  RegionAttachment.U2 = 14;
  RegionAttachment.V2 = 15;
  RegionAttachment.X3 = 16;
  RegionAttachment.Y3 = 17;
  RegionAttachment.C3R = 18;
  RegionAttachment.C3G = 19;
  RegionAttachment.C3B = 20;
  RegionAttachment.C3A = 21;
  RegionAttachment.U3 = 22;
  RegionAttachment.V3 = 23;
  RegionAttachment.X4 = 24;
  RegionAttachment.Y4 = 25;
  RegionAttachment.C4R = 26;
  RegionAttachment.C4G = 27;
  RegionAttachment.C4B = 28;
  RegionAttachment.C4A = 29;
  RegionAttachment.U4 = 30;
  RegionAttachment.V4 = 31;
  spine.RegionAttachment = RegionAttachment;
})(spine || (spine = {}));
var spine;
(function (spine) {
  var JitterEffect = function () {
    function JitterEffect(jitterX, jitterY) {
      this.jitterX = 0;
      this.jitterY = 0;
      this.jitterX = jitterX;
      this.jitterY = jitterY;
    }
    JitterEffect.prototype.begin = function (skeleton) {};
    JitterEffect.prototype.transform = function (position, uv, light, dark) {
      position.x += spine.MathUtils.randomTriangular(-this.jitterX, this.jitterY);
      position.y += spine.MathUtils.randomTriangular(-this.jitterX, this.jitterY);
    };
    JitterEffect.prototype.end = function () {};
    return JitterEffect;
  }();
  spine.JitterEffect = JitterEffect;
})(spine || (spine = {}));
var spine;
(function (spine) {
  var SwirlEffect = function () {
    function SwirlEffect(radius) {
      this.centerX = 0;
      this.centerY = 0;
      this.radius = 0;
      this.angle = 0;
      this.worldX = 0;
      this.worldY = 0;
      this.radius = radius;
    }
    SwirlEffect.prototype.begin = function (skeleton) {
      this.worldX = skeleton.x + this.centerX;
      this.worldY = skeleton.y + this.centerY;
    };
    SwirlEffect.prototype.transform = function (position, uv, light, dark) {
      var radAngle = this.angle * spine.MathUtils.degreesToRadians;
      var x = position.x - this.worldX;
      var y = position.y - this.worldY;
      var dist = Math.sqrt(x * x + y * y);
      if (dist < this.radius) {
        var theta = SwirlEffect.interpolation.apply(0, radAngle, (this.radius - dist) / this.radius);
        var cos = Math.cos(theta);
        var sin = Math.sin(theta);
        position.x = cos * x - sin * y + this.worldX;
        position.y = sin * x + cos * y + this.worldY;
      }
    };
    SwirlEffect.prototype.end = function () {};
    return SwirlEffect;
  }();
  SwirlEffect.interpolation = new spine.PowOut(2);
  spine.SwirlEffect = SwirlEffect;
})(spine || (spine = {}));
var spine;
(function (spine) {
  var canvas;
  (function (canvas) {
    var AssetManager = function (_super) {
      __extends(AssetManager, _super);
      function AssetManager(pathPrefix) {
        if (pathPrefix === void 0) {
          pathPrefix = "";
        }
        return _super.call(this, function (image) {
          return new spine.canvas.CanvasTexture(image);
        }, pathPrefix) || this;
      }
      return AssetManager;
    }(spine.AssetManager);
    canvas.AssetManager = AssetManager;
  })(canvas = spine.canvas || (spine.canvas = {}));
})(spine || (spine = {}));
var spine;
(function (spine) {
  var canvas;
  (function (canvas) {
    var CanvasTexture = function (_super) {
      __extends(CanvasTexture, _super);
      function CanvasTexture(image) {
        return _super.call(this, image) || this;
      }
      CanvasTexture.prototype.setFilters = function (minFilter, magFilter) {};
      CanvasTexture.prototype.setWraps = function (uWrap, vWrap) {};
      CanvasTexture.prototype.dispose = function () {};
      return CanvasTexture;
    }(spine.Texture);
    canvas.CanvasTexture = CanvasTexture;
  })(canvas = spine.canvas || (spine.canvas = {}));
})(spine || (spine = {}));
var spine;
(function (spine) {
  var canvas;
  (function (canvas) {
    var SkeletonRenderer = function () {
      function SkeletonRenderer(context) {
        this.triangleRendering = false;
        this.debugRendering = false;
        this.vertices = spine.Utils.newFloatArray(8 * 1024);
        this.tempColor = new spine.Color();
        this.ctx = context;
      }
      SkeletonRenderer.prototype.draw = function (skeleton) {
        if (this.triangleRendering) this.drawTriangles(skeleton);else this.drawImages(skeleton);
      };
      SkeletonRenderer.prototype.drawImages = function (skeleton) {
        var ctx = this.ctx;
        var drawOrder = skeleton.drawOrder;
        if (this.debugRendering) ctx.strokeStyle = "green";
        ctx.save();
        for (var i = 0, n = drawOrder.length; i < n; i++) {
          var slot = drawOrder[i];
          var attachment = slot.getAttachment();
          var regionAttachment = null;
          var region = null;
          var image = null;
          if (attachment instanceof spine.RegionAttachment) {
            regionAttachment = attachment;
            region = regionAttachment.region;
            image = region.texture.getImage();
          } else continue;
          var skeleton_1 = slot.bone.skeleton;
          var skeletonColor = skeleton_1.color;
          var slotColor = slot.color;
          var regionColor = regionAttachment.color;
          var alpha = skeletonColor.a * slotColor.a * regionColor.a;
          var color = this.tempColor;
          color.set(skeletonColor.r * slotColor.r * regionColor.r, skeletonColor.g * slotColor.g * regionColor.g, skeletonColor.b * slotColor.b * regionColor.b, alpha);
          var att = attachment;
          var bone = slot.bone;
          var w = region.width;
          var h = region.height;
          ctx.save();
          ctx.transform(bone.a, bone.c, bone.b, bone.d, bone.worldX, bone.worldY);
          ctx.translate(attachment.offset[0], attachment.offset[1]);
          ctx.rotate(attachment.rotation * Math.PI / 180);
          var atlasScale = att.width / w;
          ctx.scale(atlasScale * attachment.scaleX, atlasScale * attachment.scaleY);
          ctx.translate(w / 2, h / 2);
          if (attachment.region.rotate) {
            var t = w;
            w = h;
            h = t;
            ctx.rotate(-Math.PI / 2);
          }
          ctx.scale(1, -1);
          ctx.translate(-w / 2, -h / 2);
          if (color.r != 1 || color.g != 1 || color.b != 1 || color.a != 1) {
            ctx.globalAlpha = color.a;
          }
          ctx.drawImage(image, region.x, region.y, w, h, 0, 0, w, h);
          if (this.debugRendering) ctx.strokeRect(0, 0, w, h);
          ctx.restore();
        }
        ctx.restore();
      };
      SkeletonRenderer.prototype.drawTriangles = function (skeleton) {
        var blendMode = null;
        var vertices = this.vertices;
        var triangles = null;
        var drawOrder = skeleton.drawOrder;
        for (var i = 0, n = drawOrder.length; i < n; i++) {
          var slot = drawOrder[i];
          var attachment = slot.getAttachment();
          var texture = null;
          var region = null;
          if (attachment instanceof spine.RegionAttachment) {
            var regionAttachment = attachment;
            vertices = this.computeRegionVertices(slot, regionAttachment, false);
            triangles = SkeletonRenderer.QUAD_TRIANGLES;
            region = regionAttachment.region;
            texture = region.texture.getImage();
          } else if (attachment instanceof spine.MeshAttachment) {
            var mesh = attachment;
            vertices = this.computeMeshVertices(slot, mesh, false);
            triangles = mesh.triangles;
            texture = mesh.region.renderObject.texture.getImage();
          } else continue;
          if (texture != null) {
            var slotBlendMode = slot.data.blendMode;
            if (slotBlendMode != blendMode) {
              blendMode = slotBlendMode;
            }
            var ctx = this.ctx;
            for (var j = 0; j < triangles.length; j += 3) {
              var t1 = triangles[j] * 8,
                t2 = triangles[j + 1] * 8,
                t3 = triangles[j + 2] * 8;
              var x0 = vertices[t1],
                y0 = vertices[t1 + 1],
                u0 = vertices[t1 + 6],
                v0 = vertices[t1 + 7];
              var x1 = vertices[t2],
                y1 = vertices[t2 + 1],
                u1 = vertices[t2 + 6],
                v1 = vertices[t2 + 7];
              var x2 = vertices[t3],
                y2 = vertices[t3 + 1],
                u2 = vertices[t3 + 6],
                v2 = vertices[t3 + 7];
              this.drawTriangle(texture, x0, y0, u0, v0, x1, y1, u1, v1, x2, y2, u2, v2);
              if (this.debugRendering) {
                ctx.strokeStyle = "green";
                ctx.beginPath();
                ctx.moveTo(x0, y0);
                ctx.lineTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.lineTo(x0, y0);
                ctx.stroke();
              }
            }
          }
        }
      };
      SkeletonRenderer.prototype.drawTriangle = function (img, x0, y0, u0, v0, x1, y1, u1, v1, x2, y2, u2, v2) {
        var ctx = this.ctx;
        u0 *= img.width;
        v0 *= img.height;
        u1 *= img.width;
        v1 *= img.height;
        u2 *= img.width;
        v2 *= img.height;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.closePath();
        x1 -= x0;
        y1 -= y0;
        x2 -= x0;
        y2 -= y0;
        u1 -= u0;
        v1 -= v0;
        u2 -= u0;
        v2 -= v0;
        var det = 1 / (u1 * v2 - u2 * v1),
          a = (v2 * x1 - v1 * x2) * det,
          b = (v2 * y1 - v1 * y2) * det,
          c = (u1 * x2 - u2 * x1) * det,
          d = (u1 * y2 - u2 * y1) * det,
          e = x0 - a * u0 - c * v0,
          f = y0 - b * u0 - d * v0;
        ctx.save();
        ctx.transform(a, b, c, d, e, f);
        ctx.clip();
        ctx.drawImage(img, 0, 0);
        ctx.restore();
      };
      SkeletonRenderer.prototype.computeRegionVertices = function (slot, region, pma) {
        var skeleton = slot.bone.skeleton;
        var skeletonColor = skeleton.color;
        var slotColor = slot.color;
        var regionColor = region.color;
        var alpha = skeletonColor.a * slotColor.a * regionColor.a;
        var multiplier = pma ? alpha : 1;
        var color = this.tempColor;
        color.set(skeletonColor.r * slotColor.r * regionColor.r * multiplier, skeletonColor.g * slotColor.g * regionColor.g * multiplier, skeletonColor.b * slotColor.b * regionColor.b * multiplier, alpha);
        region.computeWorldVertices(slot.bone, this.vertices, 0, SkeletonRenderer.VERTEX_SIZE);
        var vertices = this.vertices;
        var uvs = region.uvs;
        vertices[spine.RegionAttachment.C1R] = color.r;
        vertices[spine.RegionAttachment.C1G] = color.g;
        vertices[spine.RegionAttachment.C1B] = color.b;
        vertices[spine.RegionAttachment.C1A] = color.a;
        vertices[spine.RegionAttachment.U1] = uvs[0];
        vertices[spine.RegionAttachment.V1] = uvs[1];
        vertices[spine.RegionAttachment.C2R] = color.r;
        vertices[spine.RegionAttachment.C2G] = color.g;
        vertices[spine.RegionAttachment.C2B] = color.b;
        vertices[spine.RegionAttachment.C2A] = color.a;
        vertices[spine.RegionAttachment.U2] = uvs[2];
        vertices[spine.RegionAttachment.V2] = uvs[3];
        vertices[spine.RegionAttachment.C3R] = color.r;
        vertices[spine.RegionAttachment.C3G] = color.g;
        vertices[spine.RegionAttachment.C3B] = color.b;
        vertices[spine.RegionAttachment.C3A] = color.a;
        vertices[spine.RegionAttachment.U3] = uvs[4];
        vertices[spine.RegionAttachment.V3] = uvs[5];
        vertices[spine.RegionAttachment.C4R] = color.r;
        vertices[spine.RegionAttachment.C4G] = color.g;
        vertices[spine.RegionAttachment.C4B] = color.b;
        vertices[spine.RegionAttachment.C4A] = color.a;
        vertices[spine.RegionAttachment.U4] = uvs[6];
        vertices[spine.RegionAttachment.V4] = uvs[7];
        return vertices;
      };
      SkeletonRenderer.prototype.computeMeshVertices = function (slot, mesh, pma) {
        var skeleton = slot.bone.skeleton;
        var skeletonColor = skeleton.color;
        var slotColor = slot.color;
        var regionColor = mesh.color;
        var alpha = skeletonColor.a * slotColor.a * regionColor.a;
        var multiplier = pma ? alpha : 1;
        var color = this.tempColor;
        color.set(skeletonColor.r * slotColor.r * regionColor.r * multiplier, skeletonColor.g * slotColor.g * regionColor.g * multiplier, skeletonColor.b * slotColor.b * regionColor.b * multiplier, alpha);
        var numVertices = mesh.worldVerticesLength / 2;
        if (this.vertices.length < mesh.worldVerticesLength) {
          this.vertices = spine.Utils.newFloatArray(mesh.worldVerticesLength);
        }
        var vertices = this.vertices;
        mesh.computeWorldVertices(slot, 0, mesh.worldVerticesLength, vertices, 0, SkeletonRenderer.VERTEX_SIZE);
        var uvs = mesh.uvs;
        for (var i = 0, n = numVertices, u = 0, v = 2; i < n; i++) {
          vertices[v++] = color.r;
          vertices[v++] = color.g;
          vertices[v++] = color.b;
          vertices[v++] = color.a;
          vertices[v++] = uvs[u++];
          vertices[v++] = uvs[u++];
          v += 2;
        }
        return vertices;
      };
      return SkeletonRenderer;
    }();
    SkeletonRenderer.QUAD_TRIANGLES = [0, 1, 2, 2, 3, 0];
    SkeletonRenderer.VERTEX_SIZE = 2 + 2 + 4;
    canvas.SkeletonRenderer = SkeletonRenderer;
  })(canvas = spine.canvas || (spine.canvas = {}));
})(spine || (spine = {}));
var Spine = exports.Spine = spine;

/***/ }),

/***/ 39:
/***/ (function(module, exports) {

function _typeof(o) {
  "@babel/helpers - typeof";

  return module.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports, _typeof(o);
}
module.exports = _typeof, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ 40:
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),

/***/ 5:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(2);
Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "GameMode", {
  enumerable: true,
  get: function get() {
    return _game.GameMode;
  }
});
Object.defineProperty(exports, "GameState", {
  enumerable: true,
  get: function get() {
    return _game.GameState;
  }
});
Object.defineProperty(exports, "LoginState", {
  enumerable: true,
  get: function get() {
    return _game.LoginState;
  }
});
Object.defineProperty(exports, "PartyState", {
  enumerable: true,
  get: function get() {
    return _party.PartyState;
  }
});
exports.store = void 0;
var _vue = _interopRequireDefault(__webpack_require__(37));
var _vuex = _interopRequireDefault(__webpack_require__(11));
var _game = __webpack_require__(355);
var _party = __webpack_require__(356);
var _user = __webpack_require__(357);
var _settings = __webpack_require__(358);
var _analytics = __webpack_require__(359);
_vue["default"].use(_vuex["default"]);
var store = exports.store = new _vuex["default"].Store({
  // strict: true,
  modules: {
    game: _game.ModuleGame,
    settings: _settings.ModuleSettings,
    user: _user.ModuleUser,
    party: _party.ModuleParty,
    analytics: _analytics.ModuleAnalytics
  },
  state: {
    i18n: {}
  },
  mutations: {
    gameUpdate: function gameUpdate(state, value) {
      // Check for stats to be skipped
      if (value == _game.GameState.GAMEOVER && (state.game.value == _game.GameState.HOME || state.settings.options.skipStats)) {
        value = _game.GameState.HOME;
      }
      this.commit('game/gameUpdate', value);
    },
    partyConfirmUpdate: function partyConfirmUpdate(state, value) {
      if (value) {
        if (state.party.value == _party.PartyState.JOINED) {
          state.party.value = _party.PartyState.INIT;
          state.game.mode = state.game.nextGameMode;
          window.location.hash = state.game.mode.replace(':', '');
        } else {
          state.game.mode = _game.GameMode.PARTY;
        }
      }
      state.game.confirm = false;
    },
    localizedTextUpdate: function localizedTextUpdate(state, data) {
      _vue["default"].set(state.i18n, data.key, data.value);
    }
  },
  actions: {},
  getters: {
    i18n: function i18n(state) {
      return state.i18n;
    },
    loginComplete: function loginComplete(state) {
      return state.game.login == _game.LoginState.IN || state.game.login == _game.LoginState.OUT;
    },
    gameState: function gameState(state) {
      return state.game.value;
    },
    gameMode: function gameMode(state) {
      return state.game.mode;
    },
    partyState: function partyState(state) {
      return state.party.value;
    },
    settings: function settings(state) {
      return state.settings.options;
    },
    realm: function realm(state) {
      return state.user && state.user.userInfo ? state.user.userInfo.realm[0] : null;
    }
    // guest: (state) => state.login == LoginState.OUT,
    // loggedin: (state) => state.login == LoginState.IN,
  }
});

/***/ }),

/***/ 53:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(2);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(21));
var _createClass2 = _interopRequireDefault(__webpack_require__(22));
var _storageKeys = _interopRequireDefault(__webpack_require__(33));
var Storage = /*#__PURE__*/function () {
  function Storage() {
    (0, _classCallCheck2["default"])(this, Storage);
    this._settings = {
      noSkins: false,
      // no skins!
      noNames: false,
      // no names!
      noColors: false,
      blackTheme: false,
      showMass: false,
      skipStats: false,
      showQuest: true,
      playArenaSounds: false,
      playMenuSounds: true,
      showOnlineStatus: true,
      targetedAds: true,
      showMinimap: true,
      quality: 'Retina',
      scale: 1,
      lastNick: ''
    };
    this.storage = {};
    this.load();
  }
  return (0, _createClass2["default"])(Storage, [{
    key: "settings",
    get: function get() {
      return this._settings;
    },
    set: function set(value) {
      this._settings = value;
    }
  }, {
    key: "load",
    value: function load() {
      this.storage = null;
      try {
        this.storage = this.getKey(_storageKeys["default"].SETTINGS);
      } catch (err) {
        /* eslint-disable no-console */
        console.info('LocalStorage not available. Game usability can be affected!');
      }
      if (this.storage == null) {
        this.storage = {};
        this.save();
      } else {
        this.copy(this.storage, this.settings);
      }
    }
  }, {
    key: "copy",
    value: function copy(source, destiny) {
      for (var key in source) {
        if (source.hasOwnProperty(key)) {
          destiny[key] = source[key];
        }
      }
    }
  }, {
    key: "save",
    value: function save() {
      this.copy(this.settings, this.storage);
      if (this.storage == null) {
        return;
      }
      try {
        this.updateKey(_storageKeys["default"].SETTINGS, JSON.stringify(this.storage));
      } catch (err) {
        console.info('LocalStorage not available. Game usability can be affected!');
      }
    }
  }, {
    key: "isValidJson",
    value: function isValidJson(str) {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    }
  }, {
    key: "updateKey",
    value: function updateKey(key, value) {
      if (key == null || value == null) {
        throw new Error('Key or value not defined!');
      }
      window.localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    }
  }, {
    key: "getKey",
    value: function getKey(key) {
      if (key == null) {
        throw new Error('Key not defined!');
      }
      var value = window.localStorage.getItem(key);
      return this.isValidJson(value) ? JSON.parse(value) : value;
    }
  }, {
    key: "update",
    value: function update(key, value) {
      this.load();
      if (this.storage[key] != value) {
        this.settings[key] = value;
        this.save();
      }
    }
  }]);
}();
var storage = new Storage();
var _default = exports["default"] = storage;

/***/ }),

/***/ 82:
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ 84:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var utils = __webpack_require__(19);
var normalizeHeaderName = __webpack_require__(366);

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(163);
  } else if (typeof process !== 'undefined') {
    // For node use HTTP adapter
    adapter = __webpack_require__(163);
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(82)))

/***/ }),

/***/ 85:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = exports["default"] = Object.freeze({
  LOGIN: 'login',
  LOGIN_UNSUCCESSFUL: 'login_unsuccessful',
  CHECK_APPROVAL: 'check_approval',
  CONSENT_RESPONSE: 'consent_response',
  HIDE_PRIVACY_POLICY_BANNER: 'hide_privacy_policy_banner'
});

/***/ }),

/***/ 86:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(2);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MCSDK = void 0;
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(21));
var _createClass2 = _interopRequireDefault(__webpack_require__(22));
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
/* eslint-disable brace-style */
/* eslint-disable block-spacing */
var MCSDK = exports.MCSDK = /*#__PURE__*/function () {
  function MCSDK(target, endpoint, apiKey, checksumKey, analyticsEnv) {
    (0, _classCallCheck2["default"])(this, MCSDK);
    this._target = target;
    this._endpoint = endpoint;
    this._apiKey = apiKey;
    this._checksumKey = checksumKey;
    this._analyticsEnv = analyticsEnv;
    this._sdk = null;
    this._tests = []; // Libra or other tests
    this._initTimer = new Date().getTime() / 1000;
    this.load();
  }
  return (0, _createClass2["default"])(MCSDK, [{
    key: "session",
    get: function get() {
      return this._sdk.session;
    }
  }, {
    key: "load",
    value: function load() {
      this._target.mcReady = this.mcReady.bind(this);
      (function (d, s, id, modules, namespace) {
        var js = d.getElementsByTagName(s)[0];
        var fjs = js;
        if (d.getElementById(id)) {
          return;
        }
        js = d.createElement(s);
        js.id = id;
        if (modules) js.setAttribute('data-modules', modules.join(','));
        if (namespace) js.setAttribute('data-namespace', namespace);
        js.src = 'miniclip.js'; // //static.miniclipcdn.com/js/sdk/v1.5/
        fjs.parentNode.insertBefore(js, fjs);
      })(document, 'script', 'miniclipsdk', ['analytics'], 'MCSDK');
    }
  }, {
    key: "mcReady",
    value: function mcReady(SDK) {
      var _this = this;
      // console.log('== '+SDK.namespace+' is ready! ==');
      // if (this._endpoint) {
      //     this._target.miniclip.goliath.Goliath.URL = this._endpoint;
      // }
      var self = this;
      SDK.init({
        analytics: {
          version: 'v3.5.0',
          gameId: 1384,
          gameName: 'agario_web',
          apiKey: this._apiKey,
          checksumKey: this._checksumKey,
          environment: this._analyticsEnv
        },
        session: {
          generate_user_id: false
        }
      }, function (sdk) {
        if (_this._endpoint) {
          sdk.analytics._handler.URL = _this._endpoint;
        }
        sdk.analytics._handler.onSuccess = _this.onEventSendComplete.bind(_this);

        // Override session event name
        if (sdk && sdk.analytics) {
          // sdk.analytics.setEventName('session', 'session_client');
        }

        /* console.log(sdk);
        console.log('== '+sdk.namespace+'.init complete ==');
        console.log('version='+SDK.version); */

        self._target.dispatchEvent(new Event(MCSDK.EVENT_READY));
      });
      this._sdk = SDK;
    }
  }, {
    key: "setUserId",
    value: function setUserId(id) {
      this._sdk.analytics._handler.setUserId(id);
    }
  }, {
    key: "setSessionId",
    value: function setSessionId(id) {
      this._sdk.analytics._handler.setSessionId(id);
    }
  }, {
    key: "sendInit",
    value: function sendInit(data) {
      var _this2 = this;
      var init = {
        'os': this._sdk.analytics.os_info,
        'browser': this._sdk.analytics.browser_info,
        'timestamp': '' + new Date(),
        'login_type': 'Guest',
        'platform': 'agario_web'
      };

      // const now = new Date().getTime() / 1000;
      // const event = new this._target.miniclip.goliath.Event('client_init', now);
      // event.os = this._sdk.analytics.os_info;
      // event.browser = this._sdk.analytics.browser_info;
      // event.timestamp = + new Date();

      Object.assign(init, data);
      setTimeout(function () {
        _this2._sdk.analytics.sendEvent('client_init', init, false);
      }, 100);
      this._initTimer = new Date().getTime() / 1000;
    }
  }, {
    key: "sendEndSession",
    value: function sendEndSession(xp, level) {
      var now = new Date().getTime() / 1000;
      var session_length = now - this._initTimer | 0;
      var event = {}; // new this._target.miniclip.goliath.Event('client_session', now);
      event.session_length = session_length;
      // event.end_reason = end_reason;
      // for (let prod in wallet) {
      //     if (wallet[prod]) {
      //         event['wallet_' + prod] = wallet[prod];
      //     }
      // }
      // event.xp = xp;
      // event.level = level;
      // for (let slot in potion_slots) {
      //     if (potion_slots[slot]) {
      //         event['potion_slot_' + slot] = potion_slots[slot];
      //     }
      // }
      // event.settings = settings;
      this._sdk.analytics.sendEvent('client_session', event, false);
    }

    /**
     * @param  {} time_total - the match duration in seconds
     */
  }, {
    key: "sendMatchEvent",
    value: function sendMatchEvent(game_type, time_total) {
      var event = {};
      event.game_type = game_type;
      event.time_total = time_total;
      event.timestamp = '' + new Date();
      this._sdk.analytics.sendEvent('client_match', event, false);
    }

    /**
     * @param  {} step - impression, click
     * @param  {} result - privacy_policy, gave_ad_permission, denied_ad_permission
     * @param  {} context - privacy_policy_with_ad_consent, video_ad, offerwall, settings_popup, settings
     */
  }, {
    key: "sendGDPREvent",
    value: function sendGDPREvent(step, result, context) {
      var data = {};
      data.step = step;
      data.click_result = result;
      data.context = context;
      this._sdk.analytics.sendEvent('privacy_policy_consent', data, false);
    }

    /**
     * @param  {array} content - content from Libra
     */
  }, {
    key: "sendLibraContent",
    value: function sendLibraContent(content) {
      var event = {};
      event.libra_content = content;
      event.timestamp = '' + new Date();
      this._sdk.analytics.sendEvent('client_libra_content', event, false);
    }
  }, {
    key: "sendGiftInvite",
    value: function sendGiftInvite(action, totalFriends, playingFriends) {
      var data = {};
      data.action = action;
      data.friends_invitable = totalFriends;
      data.friends_playing = playingFriends;
      this._sdk.analytics.sendEvent('gift_invite', data, false);
    }
  }, {
    key: "sendInterstitialEvent",
    value: function sendInterstitialEvent(timestamp, type, step, id, mediator) {
      var data = {};
      data.timestamp = timestamp;
      data.type = type;
      data.step = step;
      data.request_id = id;
      data.mediator = mediator;
      this._sdk.analytics.sendEvent('interstitial_banner_funnel', data, false);
    }

    /**
     * @param  {} num - Number of sent events
     * @param  {} data - Received data
     */
  }, {
    key: "onEventSendComplete",
    value: function onEventSendComplete(num, data) {
      if (!data) {
        return;
      }
      var result = JSON.parse(data);
      this._tests = this.getLibraTests(result.content);

      // Notify available a/b tests
      var customEvent = document.createEvent('CustomEvent');
      customEvent.initCustomEvent(MCSDK.EVENT_LIBRA, true, true, this._tests);
      this._target.dispatchEvent(customEvent);
      if (result.content != undefined) {
        this.sendLibraContent(result.content);
      }
    }

    /**
     * @param  {object} content
     *
     * Returns {array} list of tests (of object {<test_name>:<group_name>})
     *
     * Checks if events result contains Libra's content
     * and returns
     */
  }, {
    key: "getLibraTests",
    value: function getLibraTests(content) {
      var ret = [];
      if (content && content.length > 0) {
        var _iterator = _createForOfIteratorHelper(content),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var item = _step.value;
            if (item.type == MCSDK.TYPE_LIBRA) {
              for (var prop in item) {
                if (prop != 'type') {
                  ret.push({
                    name: prop,
                    group: item[prop]
                  });
                }
              }
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
      return ret;
    }

    /**
     * @param  {string} name
     *
     * Returns a Test if found by name
     */
  }, {
    key: "getTest",
    value: function getTest(name) {
      var _iterator2 = _createForOfIteratorHelper(this._tests),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var test = _step2.value;
          if (test.name == name) {
            return test;
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      return null;
    }
  }], [{
    key: "TYPE_LIBRA",
    get: function get() {
      return 'libra';
    }
  }, {
    key: "EVENT_READY",
    get: function get() {
      return 'mcsdk.event_ready';
    }
  }, {
    key: "EVENT_LIBRA",
    get: function get() {
      return 'mcsdk.event_libra';
    }
  }, {
    key: "EVENT_UNLOAD",
    get: function get() {
      return 'beforeunload';
    }
  }]);
}();

/***/ })

/******/ });