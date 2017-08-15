/**
 * @file object-hive
 */

'use strict';

const util = require('./util');

const hooks = {};

const valueSceneRegisters = [];

const keySceneRegisters = [];

const MATCHER_ID = 'bee-' + String(Math.random()).replace(/\D/, '');

let matcherIndex = 0;

function bee (data, beeConfig) {

    debugger;

    beeConfig = util.copy(beeConfig);

    bee.emit('before', data, beeConfig);

    processLoop(data, beeConfig);

    bee.emit('after', data, beeConfig);

    matcherIndex = 0;

    return data;
}

bee.execute = function (beeItem, dataItem, key, currentBee, currentData, data) {
    if (isCustomKey(key)) {
        return {};
    }
    return beeItem instanceof Chain ?
        beeItem.execute(dataItem, key, currentBee, currentData, data) :
        executeValueScene(beeItem, dataItem, key, currentBee, currentData, data);
};

bee.install = function (config) {

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
        bee.on('before', config.before);
    }

    if (config.hasOwnProperty('after')) {
        bee.on('after', config.after);
    }

    if (config.hasOwnProperty('methods')) {
        bee.installMethods(config.methods);
    }

    util.makeArray(config.valueScenes).forEach((item) => bee.installValueScene(item));

    util.makeArray(config.keyScenes).forEach((item) => bee.installKeyScene(item));
};

bee.on = function (hookName, func) {
    if (!util.isFunction(func)) {
        throw(new Error(`Expect handler of "${hookName}" listener to be Function`));
    }
    hooks[hookName] = util.makeArray(hooks[hookName]);
    hooks[hookName].push(func);
};

bee.emit = function (name) {
    let args = [...arguments].slice(1);
    util.makeArray(hooks[name]).forEach((func) => func.apply(null, args));
};

bee.installMethods = function (methods) {
    if (!util.isPlainObject(methods)) {
        throw(new Error('Expect arguments to be Object'));
    }

    Object.keys(methods).forEach((key) =>
        setMethod(key, methods[key])
    );
};

class Chain {

    constructor (item) {
        this.beeItems = [item];
    }

    execute (dataItem, key, currentBee, currentData, data) {
        let result = {
            key: key
        };

        if (currentData.hasOwnProperty(key)) {
            result.value = dataItem;
        }

        return this.beeItems.reduce((action, beeItem) => {
            return Object.assign(
                action,
                executeValueScene(beeItem, action.value, action.key, currentBee, currentData, data)
            );
        }, result);
    }

}

Chain.setMethods = function (name, method) {
    Chain.prototype[name] = function () {

        this.beeItems.push(
            util.isFunction(method) ? method.apply(null, arguments) : method
        );

        return this;
    };
};

Chain.clone = function (instance) {
    let newInstance = new Chain();
    newInstance.beeItems = [...instance];
    return newInstance;
};

bee.installValueScene = function (config) {

    if (!util.isPlainObject(config)) {
        throw(new Error('Expect config for "valueScene" to be Object'));
    }

    if (config.hasOwnProperty('check') && !util.isFunction(config.check)) {
        throw(new Error('Expect config.check to be Function'));
    }

    if (config.hasOwnProperty('apply') && !util.isFunction(config.apply)) {
        throw(new Error('Expect config.apply to be Function'));
    }

    if (config.hasOwnProperty('methods') && !util.isPlainObject(config.methods)) {
        throw(new Error('Expect config.methods to be Object'));
    }

    Object.keys(config.methods || {}).forEach((key) => {
        let method = config.methods[key];
        let canChain = true;

        if (util.isPlainObject(method)) {
            canChain = method.hasOwnProperty('chain') ? method.chain : canChain;
            method = method.handler;
        }

        setMethod(key, !canChain ? method : function () {
            return new Chain(
                util.isFunction(method) ? method.apply(null, arguments) : method
            );
        });

        Chain.setMethods(key, config.methods[key]);
    });

    valueSceneRegisters.push(config);
};

bee.installKeyScene = function (config) {

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

    if (config.hasOwnProperty('methods') && !util.isPlainObject(config.methods)) {
        throw(new Error('Expect config.methods to be Object'));
    }

    for (let key of Object.keys(config.methods || {})) {
        setMethod(key, function () {
            return MATCHER_ID + JSON.stringify({
                index: matcherIndex++,
                info: config.methods[key].apply(null, arguments)
            });
        });
    }

    keySceneRegisters.push(config);
};

function executeValueScene (beeItem, dataItem, key, currentBee, currentData, data) {
    let register = valueSceneRegisters.filter((register) => {
        return register.check && register.check(beeItem, dataItem);
    })[0];

    return register ?
        register.apply(beeItem, dataItem, key, currentBee, currentData, data) : {};
}

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
            let key = matcher.defaultAction.key;

            if (!matcher.defaultAction.hasOwnProperty('key')) {
                continue;
            }

            let defaultAction = Object.assign(
                {}, matcher.defaultAction,
                bee.execute(matcher.bee, currentData[key], key, currentBee, currentData)
            );

            if (currentBee.hasOwnProperty(key)) {
                beforeResult[key] = defaultAction;
            } else {
                processData(currentData, currentBee, key, defaultAction);
            }
        }

        util.forEach(currentData, (item, key) => {
            let matchers = allMatchKeys.filter((item) => {
                return item.keyRegisters.some((register) => {
                    return register.match && register.match(key, item.info);
                });
            });

            let allBee = matchers.reduce((result, matcher) => {
                return result.concat(matcher.bee);
            }, []);

            let result = allBee.reduce((result, beeValue) => {
                return Object.assign({}, result,
                    bee.execute(beeValue, item, key, currentBee, currentData));
            }, {});

            if (currentBee.hasOwnProperty(key)) {
                beforeResult[key] = Object.assign({}, beforeResult[key], result);
            } else {
                processData(currentData, currentBee, key, result);
            }
        });

        return function ([dataItem, triggerDataItem], beeItem, key, [currentData, currentTriggerData], currentBee) {
            let isComputed = false;
            let value;

            Object.defineProperty(currentTriggerData, key, {
                get () {

                    if (isComputed) {
                        return value;
                    }

                    isComputed = true;

                    let result = beforeResult[key] || {};
                    let processResult;
                    let currentValue;
                    let currentBeeValue;

                    do {
                        currentValue = result.hasOwnProperty('value') ? result.value : triggerDataItem;

                        currentBeeValue = result.hasOwnProperty('beeValue') ? result.beeValue : beeItem;

                        result = Object.assign({}, result,
                            bee.execute(currentBeeValue, currentValue, key, currentBee, currentTriggerData, triggerData));

                        processResult = processData(currentData, currentBee, key, result);

                    } while (processResult === true);

                    value = result.hasOwnProperty('value') ? result.value : triggerDataItem;

                    return currentValue;
                }
            });
        };
    });

    util.loop(triggerData, triggerData);
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
