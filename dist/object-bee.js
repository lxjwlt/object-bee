/*!
 * object-bee v1.0.0
 * (c) 2017-present lxjwlt
 * Released under the MIT license
 * https://github.com/lxjwlt/object-bee.git
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["bee"] = factory();
	else
		root["bee"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @file utility
 */



var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var util = {
    copy: function copy(data) {
        return __webpack_require__(3)(data, {
            includeNonEnumerable: true
        });
    },
    isRegExp: function isRegExp(data) {
        return Object.prototype.toString.call(data) === '[object RegExp]';
    },
    isFunction: function isFunction(data) {
        return typeof data === 'function';
    },
    isSymbol: function isSymbol(data) {
        return (typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'symbol';
    },


    isPlainObject: __webpack_require__(4),

    isEqualObject: function isEqualObject(dataA, dataB) {
        if (!util.isPlainObject(dataA) || !util.isPlainObject(dataB)) {
            return dataA === dataB;
        }

        var keys = Object.keys(dataA);

        if (keys.length !== Object.keys(dataB).length) {
            return;
        }

        for (var _iterator = keys, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
            var _ref;

            if (_isArray) {
                if (_i >= _iterator.length) break;
                _ref = _iterator[_i++];
            } else {
                _i = _iterator.next();
                if (_i.done) break;
                _ref = _i.value;
            }

            var key = _ref;

            if (dataA[key] !== dataB[key]) {
                return false;
            }
        }

        return true;
    },
    isArray: function isArray(data) {
        return Object.prototype.toString.apply(data) === '[object Array]';
    },
    isUndefined: function isUndefined(data) {
        return typeof data === 'undefined';
    },
    beeSymbol: function beeSymbol(desc) {
        return '[object-bee] ' + desc + ' ' + Date.now() + ' ' + Math.random();
    },
    nestLoop: function nestLoop(data, bee, outerFunc) {
        var dataList = [data];

        if (arguments.length > 3) {
            var args = [].concat(Array.prototype.slice.call(arguments));
            bee = args[args.length - 2];
            outerFunc = args[args.length - 1];
            dataList = args.slice(0, -2);
        }

        if (util.isPlainObject(bee) && dataList.every(function (data) {
            return util.isPlainObject(data);
        })) {
            var func = outerFunc && outerFunc.apply(undefined, dataList.concat([bee]));

            var keys = dataList.reduce(function (result, data) {
                return result.concat(Object.getOwnPropertyNames(data));
            }, []).concat(Object.getOwnPropertyNames(bee));

            var keyMap = keys.reduce(function (map, key) {
                map[key] = true;
                return map;
            }, {});

            Object.keys(keyMap).forEach(function (key) {
                var dataValueList = dataList.map(function (data) {
                    return data[key];
                });

                if (func) {
                    func(dataValueList, bee[key], key, dataList, bee, 'object');
                }

                util.nestLoop.apply(util, dataValueList.concat([bee[key], outerFunc]));
            });
        }
    },
    loop: function loop() {
        var args = [].concat(Array.prototype.slice.call(arguments));
        var innerFunc = void 0;

        if (util.isFunction(args[args.length - 1])) {
            innerFunc = args[args.length - 1];
            args = args.slice(0, -1).concat(function () {
                return innerFunc;
            });
        }

        util.nestLoop.apply(null, args);
    },
    loopObject: function loopObject(data, func) {
        util.loop(data, data, function (_ref2, value2, key, _ref3) {
            var value = _ref2[0];
            var currentData = _ref3[0];

            func(value, key, currentData, data);
        });
    },
    path: function path(data, _path) {
        if (!_path || !(_path = _path.trim())) {
            return data;
        }

        var startJoiner = _path[0] === '[' ? '' : '.';

        /* eslint-disable no-new-func */
        var func = new Function('data', '\n            try {\n                return data' + startJoiner + _path + '\n            } catch (e) {}\n        ');
        /* eslint-enable no-new-func */

        return func(data);
    },
    makeArray: function makeArray(data) {
        if (util.isArray(data)) {
            return data;
        }

        if (data === null || util.isUndefined(data)) {
            return [];
        }

        if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object' && data.length) {
            return Array.prototype.slice.call(data);
        }

        return [data];
    },
    hasOwnProperty: function hasOwnProperty(obj, key) {
        return Object.prototype.hasOwnProperty.call(obj, key);
    },
    getOwnPropertyDescriptors: function getOwnPropertyDescriptors(obj) {
        return Object.getOwnPropertyNames(obj).reduce(function (map, key) {
            var descriptor = Object.getOwnPropertyDescriptor(obj, key);

            if (typeof descriptor !== 'undefined') {
                map[key] = descriptor;
            }

            return map;
        }, {});
    },


    assign: __webpack_require__(5)

};

module.exports = util;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @file object-bee entry file
 */



var bee = __webpack_require__(2);

bee.$install(__webpack_require__(8));
bee.$install(__webpack_require__(9));
bee.$install(__webpack_require__(10));
bee.$install(__webpack_require__(11));
bee.$install(__webpack_require__(12));
bee.$install(__webpack_require__(15));
bee.$install(__webpack_require__(16));
bee.$install(__webpack_require__(17));
bee.$install(__webpack_require__(18));
bee.$install(__webpack_require__(19));
bee.$install(__webpack_require__(20));
bee.$install(__webpack_require__(21));

module.exports = bee;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @file object-bee
 */



var util = __webpack_require__(0);
var Chain = __webpack_require__(6);
var event = new (__webpack_require__(7))();

var valueSceneRegisters = [];

var keySceneRegisters = [];

var MATCHER_ID = 'bee-' + String(Math.random()).replace(/\D/, '');

var matcherIndex = 0;

function bee(data, beeConfig) {
    beeConfig = util.copy(beeConfig);

    bee.$emit('before', data, beeConfig);

    processLoop(data, beeConfig);

    bee.$emit('after', data, beeConfig);

    matcherIndex = 0;

    return data;
}

bee.$valueSceneRegisters = valueSceneRegisters;

bee.$execute = function (beeItem, dataItem, key, currentBee, currentData, data, beeConfig) {
    if (isCustomKey(key)) {
        return {};
    }

    if (!(beeItem instanceof Chain)) {
        var register = valueSceneRegisters.filter(function (register) {
            return register.check && register.check(beeItem, dataItem);
        })[0];

        return register ? register.apply(beeItem, dataItem, key, currentBee, currentData, data, beeConfig) : {};
    }

    return bee.$multiExecute(beeItem.results, dataItem, key, currentBee, currentData, data, beeConfig);
};

bee.$multiExecute = function (beeItems, dataItem, key, currentBee, currentData, data, beeConfig, defaultAction) {
    return beeItems.reduce(function (action, beeItem) {
        key = util.hasOwnProperty(action, 'key') ? action.key : key;

        dataItem = util.hasOwnProperty(action, 'value') ? action.value : dataItem;

        currentBee = util.hasOwnProperty(action, 'beeValue') ? action.beeValue : currentBee;

        var newAction = bee.$execute(beeItem, dataItem, key, currentBee, currentData, data, beeConfig);

        if (util.hasOwnProperty(newAction, 'beeValue')) {
            newAction.beeValue = mergeBeeValue(action.beeValue, newAction.beeValue);
        }

        return util.assign(action, newAction);
    }, defaultAction || {});
};

bee.$install = function (config) {
    if (typeof config === 'function') {
        config = config(bee);
    }

    if (!config) {
        return;
    }

    if (!util.isPlainObject(config)) {
        throw new Error('Expect config of register to be Object');
    }

    if (util.hasOwnProperty(config, 'before')) {
        bee.$on('before', config.before);
    }

    if (util.hasOwnProperty(config, 'after')) {
        bee.$on('after', config.after);
    }

    if (util.hasOwnProperty(config, 'methods')) {
        bee.$installMethods(config.methods);
    }

    util.makeArray(config.valueScenes).forEach(function (item) {
        return bee.$installValueScene(item);
    });

    util.makeArray(config.keyScenes).forEach(function (item) {
        return bee.$installKeyScene(item);
    });
};

bee.$on = function () {
    return event.on.apply(event, arguments);
};

bee.$emit = function () {
    return event.emit.apply(event, arguments);
};

bee.$off = function () {
    return event.off.apply(event, arguments);
};

bee.$installMethods = function (methods) {
    if (!util.isPlainObject(methods)) {
        throw new Error('Expect arguments to be Object');
    }

    Object.keys(methods).forEach(function (key) {
        return setMethod(key, methods[key]);
    });
};

bee.$installValueScene = function (config) {
    if (!util.isPlainObject(config)) {
        throw new Error('Expect config for "valueScene" to be Object');
    }

    if (util.hasOwnProperty(config, 'check') && !util.isFunction(config.check)) {
        throw new Error('Expect config.check to be Function');
    }

    if (util.hasOwnProperty(config, 'apply') && !util.isFunction(config.apply)) {
        throw new Error('Expect config.apply to be Function');
    }

    if (util.hasOwnProperty(config, 'method') && !util.isPlainObject(config.method) && !util.isFunction(config.method)) {
        throw new Error('Expect config.method to be Object or function');
    }

    if (config.method) {
        if (!config.name) {
            throw new Error('Expect config.name to be defined when config.method is defined.');
        }

        var method = config.method;
        var canChain = true;

        if (util.isPlainObject(method)) {
            canChain = util.hasOwnProperty(method, 'chain') ? method.chain : canChain;
            method = method.handler;
        }

        if (canChain) {
            setMethod(config.name, function () {
                return new Chain(method.apply(null, arguments));
            });

            Chain.setMethods(config.name, method);
        } else {
            setMethod(config.name, method);
        }
    }

    valueSceneRegisters.push(config);
};

bee.$installKeyScene = function (config) {
    if (!util.isPlainObject(config)) {
        throw new Error('Expect config for "keyScene" to be Object');
    }

    if (util.hasOwnProperty(config, 'check') && !util.isFunction(config.check)) {
        throw new Error('Expect config.check to be Function');
    }

    if (util.hasOwnProperty(config, 'apply') && !util.isFunction(config.apply)) {
        throw new Error('Expect config.apply to be Function');
    }

    if (util.hasOwnProperty(config, 'match') && !util.isFunction(config.match)) {
        throw new Error('Expect config.match to be Function');
    }

    if (util.hasOwnProperty(config, 'method') && !util.isPlainObject(config.method) && !util.isFunction(config.method)) {
        throw new Error('Expect config.method to be Object or function');
    }

    if (config.method) {
        if (!config.name) {
            throw new Error('Expect config.name to be defined when config.method is defined.');
        }

        var method = config.method;

        if (util.isPlainObject(method)) {
            method = method.handler;
        }

        setMethod(config.name, function () {
            return MATCHER_ID + JSON.stringify({
                index: matcherIndex++,
                info: method.apply(null, arguments)
            });
        });
    }

    keySceneRegisters.push(config);
};

function getAllMatchKeys(data) {
    if (!util.isPlainObject(data)) {
        return [];
    }

    return Object.keys(data).filter(function (key) {
        return isCustomKey(key);
    }).map(function (key) {
        var info = parseKeyInfo(key);
        var keyRegisters = keySceneRegisters.filter(function (register) {
            return register.check && register.check(info.info);
        });

        return {
            index: info.index,
            keyRegisters: keyRegisters,
            bee: data[key],
            defaultAction: keyRegisters.reduce(function (result, register) {
                return util.assign(result, register.apply && register.apply(info.info));
            }, {}),
            info: info.info
        };
    }).sort(function (a, b) {
        return a.index - b.index;
    });
}

function isCustomKey(key) {
    return key.indexOf(MATCHER_ID) === 0;
}

function parseKeyInfo(key) {
    if (key.indexOf(MATCHER_ID) !== 0) {
        throw new Error(key + ' isn\'t a custom key of object-bee.');
    }
    return JSON.parse(key.slice(MATCHER_ID.length));
}

function setMethod(name, method) {
    if (bee[name]) {
        throw new Error('"' + name + '" has been registered');
    }

    bee[name] = method;
}

function processLoop(data, beeConfig, root, rootConfig) {
    var triggerData = util.copy(data);

    root = root || triggerData;

    rootConfig = rootConfig || beeConfig;

    util.loop(data, triggerData, function (dataItem, triggerDataItem, key, currentData, currentTriggerData) {
        Object.defineProperty(currentTriggerData, key, {
            configurable: true,
            enumerable: true,
            writable: false,
            value: triggerDataItem
        });
    });

    util.nestLoop(data, triggerData, beeConfig, function (currentData, currentTriggerData, currentBee) {
        var allMatchKeys = getAllMatchKeys(currentBee);
        var beforeResult = {};

        for (var _iterator = allMatchKeys, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
            var _ref;

            if (_isArray) {
                if (_i >= _iterator.length) break;
                _ref = _iterator[_i++];
            } else {
                _i = _iterator.next();
                if (_i.done) break;
                _ref = _i.value;
            }

            var matcher = _ref;

            if (!util.hasOwnProperty(matcher.defaultAction, 'key')) {
                continue;
            }

            var key = matcher.defaultAction.key;

            if (util.hasOwnProperty(currentBee, key)) {
                beforeResult[key] = matcher.defaultAction;
            } else {
                processData(currentData, currentBee, key, matcher.defaultAction);
            }
        }

        return function (_ref2, beeItem, key, _ref3, currentBee) {
            var dataItem = _ref2[0],
                triggerDataItem = _ref2[1];
            var currentData = _ref3[0],
                currentTriggerData = _ref3[1];

            var isComputed = false;
            var isComputing = false;
            var value = void 0;
            var oldBeeItem = currentBee[key];

            if (isCustomKey(key)) {
                return;
            }

            Object.defineProperty(currentTriggerData, key, {
                enumerable: true,
                get: function get() {
                    if (isComputed) {
                        return value;
                    }

                    if (isComputing) {
                        return dataItem;
                    }

                    isComputing = true;

                    var result = beforeResult[key] || {};
                    var processResult = void 0;

                    do {
                        var currentBeeValue = util.hasOwnProperty(result, 'beeValue') ? result.beeValue : beeItem;

                        var matchers = allMatchKeys.filter(function (item) {
                            return item.keyRegisters.some(function (register) {
                                return register.match && register.match(key, item.info);
                            });
                        });

                        var allBee = matchers.reduce(function (result, matcher) {
                            return result.concat(matcher.bee);
                        }, []);

                        if (currentBeeValue) {
                            allBee.push(currentBeeValue);
                        }

                        result = bee.$multiExecute(allBee, triggerDataItem, key, currentBee, currentTriggerData, root, rootConfig, result);

                        processResult = processData(currentData, currentBee, key, result);
                    } while (processResult === true);

                    value = triggerDataItem;

                    /**
                     * If value or config of data has been modified,
                     * we should update the detecting process.
                     */
                    if (util.hasOwnProperty(result, 'value') && result.value !== triggerDataItem || util.hasOwnProperty(result, 'beeValue') && result.beeValue !== oldBeeItem) {
                        value = processLoop(util.hasOwnProperty(result, 'value') ? result.value : dataItem, util.hasOwnProperty(result, 'beeValue') ? result.beeValue : beeItem, root, rootConfig);
                    }

                    isComputed = true;

                    isComputing = false;

                    return value;
                }
            });
        };
    });

    util.loop(triggerData, triggerData);

    return triggerData;
}

function processData(data, beeConfig, key, action) {
    if (!util.isPlainObject(action)) {
        return;
    }

    if (util.hasOwnProperty(action, 'beeValue') && !util.isEqualObject(action.beeValue, beeConfig[key])) {
        beeConfig[key] = mergeBeeValue(beeConfig[key], action.beeValue);
        return true;
    }

    if (!action.create && (!data || !util.hasOwnProperty(data, key))) {
        return;
    }

    var currentKey = key;

    if (util.hasOwnProperty(action, 'key')) {
        var descriptor = Object.getOwnPropertyDescriptor(data, key) || {
            configurable: true,
            enumerable: true,
            writable: true,
            value: data[key]
        };

        /**
         * It mean to be "rename" when the action.key is
         * different from original key.
         */
        if (action.key !== key) {
            delete data[key];
        }

        Object.defineProperty(data, action.key, descriptor);

        currentKey = action.key;
    } else if (action.create) {
        data[key] = data[key];
    }

    if (util.hasOwnProperty(action, 'value')) {
        data[currentKey] = action.value;
    }

    if (action.remove && !action.create) {
        delete data[currentKey];
    }
}

function mergeBeeValue(oldValue, newValue) {
    if (util.isPlainObject(oldValue) && util.isPlainObject(newValue)) {
        return util.assign({}, oldValue, newValue);
    } else {
        return newValue;
    }
}

module.exports = bee;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

var clone = (function() {
'use strict';

function _instanceof(obj, type) {
  return type != null && obj instanceof type;
}

var nativeMap;
try {
  nativeMap = Map;
} catch(_) {
  // maybe a reference error because no `Map`. Give it a dummy value that no
  // value will ever be an instanceof.
  nativeMap = function() {};
}

var nativeSet;
try {
  nativeSet = Set;
} catch(_) {
  nativeSet = function() {};
}

var nativePromise;
try {
  nativePromise = Promise;
} catch(_) {
  nativePromise = function() {};
}

/**
 * Clones (copies) an Object using deep copying.
 *
 * This function supports circular references by default, but if you are certain
 * there are no circular references in your object, you can save some CPU time
 * by calling clone(obj, false).
 *
 * Caution: if `circular` is false and `parent` contains circular references,
 * your program may enter an infinite loop and crash.
 *
 * @param `parent` - the object to be cloned
 * @param `circular` - set to true if the object to be cloned may contain
 *    circular references. (optional - true by default)
 * @param `depth` - set to a number if the object is only to be cloned to
 *    a particular depth. (optional - defaults to Infinity)
 * @param `prototype` - sets the prototype to be used when cloning an object.
 *    (optional - defaults to parent prototype).
 * @param `includeNonEnumerable` - set to true if the non-enumerable properties
 *    should be cloned as well. Non-enumerable properties on the prototype
 *    chain will be ignored. (optional - false by default)
*/
function clone(parent, circular, depth, prototype, includeNonEnumerable) {
  if (typeof circular === 'object') {
    depth = circular.depth;
    prototype = circular.prototype;
    includeNonEnumerable = circular.includeNonEnumerable;
    circular = circular.circular;
  }
  // maintain two arrays for circular references, where corresponding parents
  // and children have the same index
  var allParents = [];
  var allChildren = [];

  var useBuffer = typeof Buffer != 'undefined';

  if (typeof circular == 'undefined')
    circular = true;

  if (typeof depth == 'undefined')
    depth = Infinity;

  // recurse this function so we don't reset allParents and allChildren
  function _clone(parent, depth) {
    // cloning null always returns null
    if (parent === null)
      return null;

    if (depth === 0)
      return parent;

    var child;
    var proto;
    if (typeof parent != 'object') {
      return parent;
    }

    if (_instanceof(parent, nativeMap)) {
      child = new nativeMap();
    } else if (_instanceof(parent, nativeSet)) {
      child = new nativeSet();
    } else if (_instanceof(parent, nativePromise)) {
      child = new nativePromise(function (resolve, reject) {
        parent.then(function(value) {
          resolve(_clone(value, depth - 1));
        }, function(err) {
          reject(_clone(err, depth - 1));
        });
      });
    } else if (clone.__isArray(parent)) {
      child = [];
    } else if (clone.__isRegExp(parent)) {
      child = new RegExp(parent.source, __getRegExpFlags(parent));
      if (parent.lastIndex) child.lastIndex = parent.lastIndex;
    } else if (clone.__isDate(parent)) {
      child = new Date(parent.getTime());
    } else if (useBuffer && Buffer.isBuffer(parent)) {
      child = new Buffer(parent.length);
      parent.copy(child);
      return child;
    } else if (_instanceof(parent, Error)) {
      child = Object.create(parent);
    } else {
      if (typeof prototype == 'undefined') {
        proto = Object.getPrototypeOf(parent);
        child = Object.create(proto);
      }
      else {
        child = Object.create(prototype);
        proto = prototype;
      }
    }

    if (circular) {
      var index = allParents.indexOf(parent);

      if (index != -1) {
        return allChildren[index];
      }
      allParents.push(parent);
      allChildren.push(child);
    }

    if (_instanceof(parent, nativeMap)) {
      parent.forEach(function(value, key) {
        var keyChild = _clone(key, depth - 1);
        var valueChild = _clone(value, depth - 1);
        child.set(keyChild, valueChild);
      });
    }
    if (_instanceof(parent, nativeSet)) {
      parent.forEach(function(value) {
        var entryChild = _clone(value, depth - 1);
        child.add(entryChild);
      });
    }

    for (var i in parent) {
      var attrs;
      if (proto) {
        attrs = Object.getOwnPropertyDescriptor(proto, i);
      }

      if (attrs && attrs.set == null) {
        continue;
      }
      child[i] = _clone(parent[i], depth - 1);
    }

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(parent);
      for (var i = 0; i < symbols.length; i++) {
        // Don't need to worry about cloning a symbol because it is a primitive,
        // like a number or string.
        var symbol = symbols[i];
        var descriptor = Object.getOwnPropertyDescriptor(parent, symbol);
        if (descriptor && !descriptor.enumerable && !includeNonEnumerable) {
          continue;
        }
        child[symbol] = _clone(parent[symbol], depth - 1);
        if (!descriptor.enumerable) {
          Object.defineProperty(child, symbol, {
            enumerable: false
          });
        }
      }
    }

    if (includeNonEnumerable) {
      var allPropertyNames = Object.getOwnPropertyNames(parent);
      for (var i = 0; i < allPropertyNames.length; i++) {
        var propertyName = allPropertyNames[i];
        var descriptor = Object.getOwnPropertyDescriptor(parent, propertyName);
        if (descriptor && descriptor.enumerable) {
          continue;
        }
        child[propertyName] = _clone(parent[propertyName], depth - 1);
        Object.defineProperty(child, propertyName, {
          enumerable: false
        });
      }
    }

    return child;
  }

  return _clone(parent, depth);
}

/**
 * Simple flat clone using prototype, accepts only objects, usefull for property
 * override on FLAT configuration object (no nested props).
 *
 * USE WITH CAUTION! This may not behave as you wish if you do not know how this
 * works.
 */
clone.clonePrototype = function clonePrototype(parent) {
  if (parent === null)
    return null;

  var c = function () {};
  c.prototype = parent;
  return new c();
};

// private utility functions

function __objToStr(o) {
  return Object.prototype.toString.call(o);
}
clone.__objToStr = __objToStr;

function __isDate(o) {
  return typeof o === 'object' && __objToStr(o) === '[object Date]';
}
clone.__isDate = __isDate;

function __isArray(o) {
  return typeof o === 'object' && __objToStr(o) === '[object Array]';
}
clone.__isArray = __isArray;

function __isRegExp(o) {
  return typeof o === 'object' && __objToStr(o) === '[object RegExp]';
}
clone.__isRegExp = __isRegExp;

function __getRegExpFlags(re) {
  var flags = '';
  if (re.global) flags += 'g';
  if (re.ignoreCase) flags += 'i';
  if (re.multiline) flags += 'm';
  return flags;
}
clone.__getRegExpFlags = __getRegExpFlags;

return clone;
})();

if (typeof module === 'object' && module.exports) {
  module.exports = clone;
}


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var toString = Object.prototype.toString;

module.exports = function (x) {
	var prototype;
	return toString.call(x) === '[object Object]' && (prototype = Object.getPrototypeOf(x), prototype === null || prototype === Object.getPrototypeOf({}));
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @file store the values returned from chaining call function
 */

var Chain = function Chain(defaultResult) {
    _classCallCheck(this, Chain);

    this.results = [];

    if (defaultResult) {
        this.results.push(defaultResult);
    }
};

Chain.setMethods = function (name, method) {
    Chain.prototype[name] = function () {
        this.results.push(method.apply(null, arguments));

        return this;
    };
};

module.exports = Chain;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @file Event
 */

var util = __webpack_require__(0);

var Event = function () {
    function Event() {
        _classCallCheck(this, Event);

        this.events = {};
    }

    Event.prototype.on = function on(hookName, func) {
        if (!util.isFunction(func)) {
            throw new Error('Expect handler of "' + hookName + '" listener to be Function');
        }

        this.events[hookName] = util.makeArray(this.events[hookName]);
        this.events[hookName].push(func);
    };

    Event.prototype.off = function off(hookName, func) {
        var handlers = this.events[hookName];

        if (!handlers) {
            return false;
        }

        if (!func) {
            delete this.events[hookName];
            return true;
        }

        var index = handlers.indexOf(func);

        if (index >= 0) {
            handlers.splice(index, 1);
            return true;
        }

        return false;
    };

    Event.prototype.emit = function emit(names) {
        var args = [].concat(Array.prototype.slice.call(arguments)).slice(1);

        names = names.split(/\s+/g);

        for (var _iterator = names, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
            var _ref;

            if (_isArray) {
                if (_i >= _iterator.length) break;
                _ref = _iterator[_i++];
            } else {
                _i = _iterator.next();
                if (_i.done) break;
                _ref = _i.value;
            }

            var name = _ref;

            util.makeArray(this.events[name]).forEach(function (func) {
                return func.apply(null, args);
            });
        }
    };

    return Event;
}();

module.exports = Event;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @file return a new data
 */



var util = __webpack_require__(0);

module.exports = function (bee) {
    return {
        methods: {
            create: function create(data, options) {
                return bee(util.copy(data), options);
            }
        }
    };
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @file ensure specific key of object exist
 */



var util = __webpack_require__(0);
var MATCH_ID = '_ensure_key_';

function EnsureClass() {}

module.exports = {
    valueScenes: {
        name: 'ensure',
        check: function check(beeItem) {
            return beeItem instanceof EnsureClass;
        },
        apply: function apply() {
            return {
                create: true
            };
        },
        method: function method() {
            return new EnsureClass();
        }
    },
    keyScenes: {
        name: 'keep',
        check: function check(info) {
            return util.isPlainObject(info) && info.id === MATCH_ID;
        },
        apply: function apply(info) {
            return {
                create: true,
                key: info.key
            };
        },
        match: function match(key, info) {
            return key === info.key;
        },
        method: function method(key) {
            return {
                id: MATCH_ID,
                key: key
            };
        }
    }
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @file entity value no need to transform
 */



function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var util = __webpack_require__(0);

var EntityRegister = function EntityRegister(value) {
    _classCallCheck(this, EntityRegister);

    this.value = value;
};

var EscapeRegister = function EscapeRegister(value) {
    _classCallCheck(this, EscapeRegister);

    this.value = value;
};

module.exports = function (bee) {
    return {
        methods: {
            entityAll: function entityAll(data, config) {
                var actualConfig = util.copy(config);

                util.loop(actualConfig, config, function (_ref, configItem, key, _ref2) {
                    var actualConfigItem = _ref[0];
                    var currentActualConfig = _ref2[0];

                    if (util.isPlainObject(configItem)) {
                        return;
                    }

                    currentActualConfig[key] = configItem instanceof EscapeRegister ? configItem.value : bee.entity(configItem);
                });

                return bee(data, actualConfig);
            }
        },
        valueScenes: [{
            name: 'entity',
            check: function check(beeItem) {
                return beeItem instanceof EntityRegister;
            },
            apply: function apply(beeItem) {
                return {
                    value: beeItem.value
                };
            },
            method: function method(value) {
                return new EntityRegister(value);
            }
        }, {
            name: 'escape',
            check: function check(beeItem) {
                return beeItem instanceof EscapeRegister;
            },
            apply: function apply(beeItem) {
                return {
                    beeValue: beeItem.value
                };
            },

            method: {
                chain: false,
                handler: function handler(value) {
                    return new EscapeRegister(value);
                }
            }
        }]
    };
};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @file bee accepts function process
 */



var util = __webpack_require__(0);

module.exports = function (bee) {
    bee.$installValueScene({
        check: function check(beeItem) {
            return typeof beeItem === 'function';
        },
        apply: function apply(beeItem, dataItem, key, currentBee, currentData, data) {
            var methodResults = [];
            var proto = {};

            /**
             * init inner method
             */
            bee.$valueSceneRegisters.forEach(function (register) {
                if (!register.method || !register.apply) {
                    return;
                }

                proto['$' + register.name] = function () {
                    var method = register.method;

                    var methodResult = util.isFunction(method) ? method.apply(null, arguments) : method;

                    methodResults.push(methodResult);
                };
            });

            proto.$root = data;

            var $UNDEFINED = proto.$UNDEFINED = util.beeSymbol('function return undefined');

            /**
             * bind extra method to mediator instead of binding to "currentData",
             * we can return "currentData" from "beeItem" function, and
             * prevent extra method mess up our final data.
             */
            var mediator = Object.create(proto, util.getOwnPropertyDescriptors(currentData));

            var value = beeItem.call(mediator, dataItem, key);

            var result = bee.$multiExecute.apply(bee, [methodResults].concat([].concat(Array.prototype.slice.call(arguments)).slice(1)));

            if (!util.isUndefined(value)) {
                util.assign(result, {

                    /**
                     * use real-time data, cause some other data
                     * are maybe being compute right now.
                     */
                    value: value === $UNDEFINED ? util.undefined : util.copy(value)

                });
            }

            return result;
        }
    });

    bee.$installMethods({
        root: function root(path) {
            return function () {
                var value = util.path(this.$root, path);
                return util.isUndefined(value) ? this.$UNDEFINED : value;
            };
        },
        data: function data(path) {
            return function () {
                var value = util.path(this, path);
                return util.isUndefined(value) ? this.$UNDEFINED : value;
            };
        }
    });
};

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @file glob match for key
 */



var glob = __webpack_require__(13);
var util = __webpack_require__(0);
var MATCH_ID = 'glob-match';

module.exports = {

    keyScenes: {
        name: 'glob',

        check: function check(info) {
            return util.isPlainObject(info) && info.id === MATCH_ID;
        },
        match: function match(key, info) {
            return info.data.some(function (pattern) {
                return glob(key, pattern);
            });
        },
        method: function method() {
            for (var _len = arguments.length, matches = Array(_len), _key = 0; _key < _len; _key++) {
                matches[_key] = arguments[_key];
            }

            return {
                id: MATCH_ID,
                data: matches
            };
        }
    }

};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @file wildcard matcher
 */



var escapeStringRegexp = __webpack_require__(14);

function createRegExp(pattern) {
    var negated = pattern[0] === '!';

    if (negated) {
        pattern = pattern.slice(1);
    }

    pattern = escapeStringRegexp(pattern).replace(/\\\*/g, '.*');

    if (negated) {
        pattern = '(?!' + pattern + ')';
    }

    return new RegExp('^' + pattern + '$');
}

module.exports = function (input, pattern) {
    return createRegExp(pattern).test(input);
};

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;

module.exports = function (str) {
	if (typeof str !== 'string') {
		throw new TypeError('Expected a string');
	}

	return str.replace(matchOperatorsRe, '\\$&');
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @file match key by regular expression
 */



var util = __webpack_require__(0);
var MATCH_ID = 'key-match';

module.exports = {

    keyScenes: {
        name: 'match',

        check: function check(info) {
            return util.isPlainObject(info) && info.id === MATCH_ID;
        },
        match: function match(key, info) {
            return info.data.some(function (item) {
                var type = item.type;
                var value = item.value;

                if (type === 'RegExp') {
                    return new RegExp(value.replace(/^\/|\/$/g, '')).test(key);
                } else {
                    return key === value;
                }
            });
        },
        method: function method() {
            for (var _len = arguments.length, matches = Array(_len), _key = 0; _key < _len; _key++) {
                matches[_key] = arguments[_key];
            }

            return {
                id: MATCH_ID,
                data: matches.map(function (item) {
                    return {
                        type: item instanceof RegExp ? 'RegExp' : 'String',
                        value: item.toString()
                    };
                })
            };
        }
    }

};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @file reuse config
 */



function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var util = __webpack_require__(0);

var Mirror = function Mirror(path) {
    _classCallCheck(this, Mirror);

    this.path = path;
    this.config = null;
};

module.exports = {
    valueScenes: {
        name: 'mirror',
        check: function check(beeItem) {
            return beeItem instanceof Mirror;
        },
        apply: function apply(beeItem, dataItem, key, currentBee, currentData, data, beeConfig) {
            if (!beeItem.config) {
                var mirrorConfig = util.path(beeConfig, beeItem.path);

                beeItem.config = mirrorConfig;
            }

            return {
                beeValue: util.copy(beeItem.config)
            };
        },
        method: function method(path) {
            return new Mirror(path);
        }
    }
};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @file none operation
 */



var util = __webpack_require__(0);
var NOOP_SYMBOL = util.beeSymbol('noop symbol');

module.exports = {
    valueScenes: {
        name: 'noop',
        check: function check(beeItem) {
            return beeItem === NOOP_SYMBOL;
        },
        apply: function apply() {
            return {};
        },
        method: function method() {
            return NOOP_SYMBOL;
        }
    }
};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @file object is a default structure, some other register can use object as bee-item.
 */



var util = __webpack_require__(0);
var configSymbol = util.beeSymbol('use of config');

module.exports = function (bee) {
    return {
        methods: {
            CONFIG: configSymbol
        },
        valueScenes: {
            name: 'config',
            check: function check(config) {
                return util.isPlainObject(config);
            },
            apply: function apply(config) {
                var hasExtraConfig = config[configSymbol];

                if (!hasExtraConfig) {
                    return {
                        beeValue: config
                    };
                }

                var beeValues = [];

                if (hasExtraConfig) {
                    beeValues.push(config[configSymbol]);
                    delete config[configSymbol];
                }

                beeValues.push(config);

                return bee.$multiExecute.apply(bee, [beeValues].concat([].concat(Array.prototype.slice.call(arguments)).slice(1)));
            },
            method: function method(config) {
                return config;
            }
        }
    };
};

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @file queue all actions
 */



function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var QueueRegister = function QueueRegister(actions) {
    _classCallCheck(this, QueueRegister);

    this.queue = actions;
};

module.exports = function (bee) {
    return {
        valueScenes: {
            name: 'queue',
            method: function method() {
                for (var _len = arguments.length, actions = Array(_len), _key = 0; _key < _len; _key++) {
                    actions[_key] = arguments[_key];
                }

                return new QueueRegister(actions);
            },
            check: function check(beeItem) {
                return beeItem instanceof QueueRegister;
            },
            apply: function apply(beeItem) {
                return bee.$multiExecute.apply(bee, [beeItem.queue].concat([].concat(Array.prototype.slice.call(arguments)).slice(1)));
            }
        }
    };
};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @file remove key from object
 */



function RemoveClass() {}

module.exports = {
    valueScenes: {
        name: 'remove',
        check: function check(beeItem) {
            return beeItem instanceof RemoveClass;
        },
        apply: function apply() {
            return {
                remove: true
            };
        },
        method: function method() {
            return new RemoveClass();
        }
    }
};

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @file rename specific key of object
 */



function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RenameRegister = function RenameRegister(name) {
    _classCallCheck(this, RenameRegister);

    this.name = name;
};

module.exports = {
    valueScenes: {
        name: 'rename',
        check: function check(beeItem) {
            return beeItem instanceof RenameRegister;
        },
        apply: function apply(beeItem) {
            return {
                key: beeItem.name
            };
        },
        method: function method(name) {
            return new RenameRegister(name);
        }
    }
};

/***/ })
/******/ ]);
});