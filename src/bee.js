/**
 * @file object-bee
 */

'use strict';

const util = require('./util');
const Chain = require('./chain');
const event = new (require('./event'))();

const valueSceneRegisters = [];

const keySceneRegisters = [];

const MATCHER_ID = 'bee-' + String(Math.random()).replace(/\D/, '');

let matcherIndex = 0;

function bee (data, beeConfig) {
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
        let register = valueSceneRegisters.filter((register) => {
            return register.check && register.check(beeItem, dataItem);
        })[0];

        return register
            ? register.apply(beeItem, dataItem, key, currentBee, currentData, data, beeConfig) : {};
    }

    return bee.$multiExecute(beeItem.results, dataItem, key, currentBee, currentData, data, beeConfig);
};

bee.$multiExecute = function (beeItems, dataItem, key, currentBee, currentData, data, beeConfig, defaultAction) {
    return beeItems.reduce((action, beeItem) => {
        key = util.hasOwnProperty(action, 'key') ? action.key : key;

        dataItem = util.hasOwnProperty(action, 'value') ? action.value : dataItem;

        currentBee = util.hasOwnProperty(action, 'beeValue') ? action.beeValue : currentBee;

        let newAction = bee.$execute(beeItem, dataItem, key, currentBee, currentData, data, beeConfig);

        if (util.hasOwnProperty(newAction, 'beeValue')) {
            newAction.beeValue = mergeBeeValue(action.beeValue, newAction.beeValue);
        }

        return Object.assign(action, newAction);
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
        throw (new Error('Expect config of register to be Object'));
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

    util.makeArray(config.valueScenes).forEach((item) => bee.$installValueScene(item));

    util.makeArray(config.keyScenes).forEach((item) => bee.$installKeyScene(item));
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
        throw (new Error('Expect arguments to be Object'));
    }

    Object.keys(methods).forEach((key) =>
        setMethod(key, methods[key])
    );
};

bee.$installValueScene = function (config) {
    if (!util.isPlainObject(config)) {
        throw (new Error('Expect config for "valueScene" to be Object'));
    }

    if (util.hasOwnProperty(config, 'check') && !util.isFunction(config.check)) {
        throw (new Error('Expect config.check to be Function'));
    }

    if (util.hasOwnProperty(config, 'apply') && !util.isFunction(config.apply)) {
        throw (new Error('Expect config.apply to be Function'));
    }

    if (util.hasOwnProperty(config, 'method') &&
        !util.isPlainObject(config.method) && !util.isFunction(config.method)) {
        throw (new Error('Expect config.method to be Object or function'));
    }

    if (config.method) {
        if (!config.name) {
            throw (new Error('Expect config.name to be defined when config.method is defined.'));
        }

        let method = config.method;
        let canChain = true;

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
        throw (new Error('Expect config for "keyScene" to be Object'));
    }

    if (util.hasOwnProperty(config, 'check') && !util.isFunction(config.check)) {
        throw (new Error('Expect config.check to be Function'));
    }

    if (util.hasOwnProperty(config, 'apply') && !util.isFunction(config.apply)) {
        throw (new Error('Expect config.apply to be Function'));
    }

    if (util.hasOwnProperty(config, 'match') && !util.isFunction(config.match)) {
        throw (new Error('Expect config.match to be Function'));
    }

    if (util.hasOwnProperty(config, 'method') &&
        !util.isPlainObject(config.method) && !util.isFunction(config.method)) {
        throw (new Error('Expect config.method to be Object or function'));
    }

    if (config.method) {
        if (!config.name) {
            throw (new Error('Expect config.name to be defined when config.method is defined.'));
        }

        let method = config.method;

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

function getAllMatchKeys (data) {
    if (!util.isPlainObject(data)) {
        return [];
    }

    return Object.keys(data)
        .filter((key) => isCustomKey(key))
        .map((key) => {
            let info = parseKeyInfo(key);
            let keyRegisters = keySceneRegisters.filter((register) => {
                return register.check && register.check(info.info);
            });

            return {
                index: info.index,
                keyRegisters: keyRegisters,
                bee: data[key],
                defaultAction: keyRegisters.reduce((result, register) => {
                    return Object.assign(
                        result,
                        register.apply && register.apply(info.info)
                    );
                }, {}),
                info: info.info
            };
        })
        .sort((a, b) => a.index - b.index);
}

function isCustomKey (key) {
    return key.indexOf(MATCHER_ID) === 0;
}

function parseKeyInfo (key) {
    if (key.indexOf(MATCHER_ID) !== 0) {
        throw (new Error(`${key} isn't a custom key of object-bee.`));
    }
    return JSON.parse(key.slice(MATCHER_ID.length));
}

function setMethod (name, method) {
    if (bee[name]) {
        throw (new Error(`"${name}" has been registered`));
    }

    bee[name] = method;
}

function processLoop (data, beeConfig, root, rootConfig) {
    let triggerData = util.copy(data);

    root = root || triggerData;

    rootConfig = rootConfig || beeConfig;

    util.loop(data, triggerData, (dataItem, triggerDataItem, key, currentData, currentTriggerData) => {
        Object.defineProperty(currentTriggerData, key, {
            configurable: true,
            enumerable: true,
            writable: false,
            value: triggerDataItem
        });
    });

    util.nestLoop(data, triggerData, beeConfig, (currentData, currentTriggerData, currentBee) => {
        let allMatchKeys = getAllMatchKeys(currentBee);
        let beforeResult = {};

        for (let matcher of allMatchKeys) {
            if (!util.hasOwnProperty(matcher.defaultAction, 'key')) {
                continue;
            }

            let key = matcher.defaultAction.key;

            if (util.hasOwnProperty(currentBee, key)) {
                beforeResult[key] = matcher.defaultAction;
            } else {
                processData(currentData, currentBee, key, matcher.defaultAction);
            }
        }

        return function ([dataItem, triggerDataItem], beeItem, key, [currentData, currentTriggerData], currentBee) {
            let isComputed = false;
            let isComputing = false;
            let value;
            let oldBeeItem = currentBee[key];

            if (isCustomKey(key)) {
                return;
            }

            Object.defineProperty(currentTriggerData, key, {
                enumerable: true,
                get () {
                    if (isComputed) {
                        return value;
                    }

                    if (isComputing) {
                        return dataItem;
                    }

                    isComputing = true;

                    let result = beforeResult[key] || {};
                    let processResult;

                    do {
                        let currentBeeValue = util.hasOwnProperty(result, 'beeValue') ? result.beeValue : beeItem;

                        let matchers = allMatchKeys.filter((item) => {
                            return item.keyRegisters.some((register) => {
                                return register.match && register.match(key, item.info);
                            });
                        });

                        let allBee = matchers.reduce((result, matcher) => {
                            return result.concat(matcher.bee);
                        }, []);

                        if (currentBeeValue) {
                            allBee.push(currentBeeValue);
                        }

                        result = bee.$multiExecute(
                            allBee, triggerDataItem, key, currentBee,
                            currentTriggerData, root, rootConfig, result
                        );

                        processResult = processData(currentData, currentBee, key, result);
                    } while (processResult === true);

                    value = triggerDataItem;

                    /**
                     * If value or config of data has been modified,
                     * we should update the detecting process.
                     */
                    if ((util.hasOwnProperty(result, 'value') && result.value !== triggerDataItem) ||
                        (util.hasOwnProperty(result, 'beeValue') && result.beeValue !== oldBeeItem)) {
                        value = processLoop(
                            util.hasOwnProperty(result, 'value') ? result.value : dataItem,
                            util.hasOwnProperty(result, 'beeValue') ? result.beeValue : beeItem,
                            root, rootConfig
                        );
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

function processData (data, beeConfig, key, action) {
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

    let currentKey = key;

    if (util.hasOwnProperty(action, 'key')) {
        let descriptor = Object.getOwnPropertyDescriptor(data, key) || {
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

function mergeBeeValue (oldValue, newValue) {
    if (util.isPlainObject(oldValue) && util.isPlainObject(newValue)) {
        return Object.assign({}, oldValue, newValue);
    } else {
        return newValue;
    }
}

module.exports = bee;
