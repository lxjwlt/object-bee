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

    debugger;

    beeConfig = util.copy(beeConfig);

    bee.$emit('before', data, beeConfig);

    processLoop(data, beeConfig);

    bee.$emit('after', data, beeConfig);

    matcherIndex = 0;

    return data;
}

bee.$valueSceneRegisters = valueSceneRegisters;

bee.$execute = function (beeItem, dataItem, key, currentBee, currentData, data) {
    if (isCustomKey(key)) {
        return {};
    }

    if (!(beeItem instanceof Chain)) {
        let register = valueSceneRegisters.filter((register) => {
            return register.check && register.check(beeItem, dataItem);
        })[0];

        return register ?
            register.apply(beeItem, dataItem, key, currentBee, currentData, data) : {};
    }

    return bee.$multiExecute(beeItem.results, dataItem, key, currentBee, currentData, data);
};

bee.$multiExecute = function (beeItems, dataItem, key, currentBee, currentData, data, defaultAction) {
    return beeItems.reduce((action, beeItem) => {
        key = action.hasOwnProperty('key') ? action.key : key;

        dataItem = action.hasOwnProperty('value') ? action.value : dataItem;

        currentBee = action.hasOwnProperty('beeValue') ? action.beeValue : currentBee;

        return Object.assign(
            action,
            bee.$execute(beeItem, dataItem, key, currentBee, currentData, data)
        );
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
        throw(new Error('Expect config of register to be Object'));
    }

    if (config.hasOwnProperty('before')) {
        bee.$on('before', config.before);
    }

    if (config.hasOwnProperty('after')) {
        bee.$on('after', config.after);
    }

    if (config.hasOwnProperty('methods')) {
        bee.$installMethods(config.methods);
    }

    util.makeArray(config.valueScenes).forEach((item) => bee.$installValueScene(item));

    util.makeArray(config.keyScenes).forEach((item) => bee.$installKeyScene(item));
};

bee.$on = function () {
    return event.on.apply(event, arguments);
};

bee.$emit = function (name) {
    return event.emit.apply(event, arguments);
};

bee.$installMethods = function (methods) {
    if (!util.isPlainObject(methods)) {
        throw(new Error('Expect arguments to be Object'));
    }

    Object.keys(methods).forEach((key) =>
        setMethod(key, methods[key])
    );
};

bee.$installValueScene = function (config) {

    if (!util.isPlainObject(config)) {
        throw(new Error('Expect config for "valueScene" to be Object'));
    }

    if (config.hasOwnProperty('check') && !util.isFunction(config.check)) {
        throw(new Error('Expect config.check to be Function'));
    }

    if (config.hasOwnProperty('apply') && !util.isFunction(config.apply)) {
        throw(new Error('Expect config.apply to be Function'));
    }

    if (config.hasOwnProperty('method') &&
        !util.isPlainObject(config.method) && !util.isFunction(config.method)) {
        throw(new Error('Expect config.method to be Object or function'));
    }

    if (config.method) {

        if (!config.name) {
            throw(new Error('Expect config.name to be defined when config.method is defined.'));
        }

        let method = config.method;
        let canChain = true;

        if (util.isPlainObject(method)) {
            canChain = method.hasOwnProperty('chain') ? method.chain : canChain;
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
        throw(new Error('Expect config for "keyScene" to be Object'));
    }

    if (config.hasOwnProperty('check') && !util.isFunction(config.check)) {
        throw(new Error('Expect config.check to be Function'));
    }

    if (config.hasOwnProperty('apply') && !util.isFunction(config.apply)) {
        throw(new Error('Expect config.apply to be Function'));
    }

    if (config.hasOwnProperty('match') && !util.isFunction(config.match)) {
        throw(new Error('Expect config.match to be Function'));
    }

    if (config.hasOwnProperty('method') &&
        !util.isPlainObject(config.method) && !util.isFunction(config.method)) {
        throw(new Error('Expect config.method to be Object or function'));
    }

    if (config.method) {

        if (!config.name) {
            throw(new Error('Expect config.name to be defined when config.method is defined.'));
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
        throw(new Error(`${key} isn't a custom key of object-bee.`));
    }
    return JSON.parse(key.slice(MATCHER_ID.length));
}

function setMethod (name, method) {
    if (bee[name]) {
        throw(new Error(`"${name}" has been registered`));
    }

    bee[name] = method;
}

function processLoop (data, beeConfig) {
    let triggerData = util.copy(data);

    debugger;

    util.nestLoop(data, triggerData, beeConfig, (currentData, currentTriggerData, currentBee) => {
        let allMatchKeys = getAllMatchKeys(currentBee);
        let beforeResult = {};

        for (let matcher of allMatchKeys) {

            if (!matcher.defaultAction.hasOwnProperty('key')) {
                continue;
            }

            let key = matcher.defaultAction.key;

            if (currentBee.hasOwnProperty(key)) {
                beforeResult[key] = matcher.defaultAction;
            } else {
                processData(currentData, currentBee, key, matcher.defaultAction);
            }
        }

        return function ([dataItem, triggerDataItem], beeItem, key, [currentData, currentTriggerData], currentBee) {
            let isComputed = false;
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

                    isComputed = true;

                    let result = beforeResult[key] || {};
                    let processResult;

                    do {
                        let currentBeeValue = result.hasOwnProperty('beeValue') ? result.beeValue : beeItem;

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
                            currentTriggerData, triggerData, result
                        );

                        processResult = processData(currentData, currentBee, key, result);

                    } while (processResult === true);

                    value = triggerDataItem;

                    /**
                     * If value or config of data has been modified,
                     * we should update the detecting process.
                     */
                    if (result.hasOwnProperty('value') && result.value !== triggerDataItem ||
                        result.hasOwnProperty('beeValue') && result.beeValue !== oldBeeItem) {
                        value = processLoop(
                            result.hasOwnProperty('value') ? result.value : dataItem,
                            result.beeValue
                        );
                    }

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

    if (action.hasOwnProperty('beeValue') && action.beeValue !== beeConfig[key]) {
        beeConfig[key] = action.beeValue;
        return true;
    }

    if (!action.create && (!data || !data.hasOwnProperty(key))) {
        return;
    }

    let currentKey = key;

    if (action.hasOwnProperty('key')) {
        data[action.key] = data[key];

        /**
         * it mean to be "rename" when the action.key is
         * different from original key.
         */
        if (action.key !== key) {
            delete data[key];
        }

        currentKey = action.key;
    }

    if (action.hasOwnProperty('value')) {
        data[currentKey] = action.value;
    }

    if (action.remove && !action.create) {
        delete data[currentKey];
    }
}

module.exports = bee;
