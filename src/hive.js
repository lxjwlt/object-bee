/**
 * @file object-hive
 */

'use strict';

const util = require('./util');

const hooks = [];

const valueSceneRegisters = [];

const keySceneRegisters = [];

const MATCHER_ID = 'bee-' + String(Math.random()).replace(/\D/, '');

let matcherIndex = 0;

function bee (data, beeConfig) {

    debugger;

    beeConfig = util.copy(beeConfig);

    hooks.forEach((hook) => {
        if (util.isFunction(hook.before)) {
            hook.before.call(null, data, beeConfig);
        }
    });

    processLoop(data, beeConfig, function (dataItem, beeItem, key, currentData, currentBee) {
        if (isCustomKey(key)) {
            return;
        }

        return bee.execute(beeItem, dataItem, key, currentData, currentBee);
    });

    hooks.forEach((hook) => {
        if (util.isFunction(hook.after)) {
            hook.after.call(null, data, beeConfig);
        }
    });

    matcherIndex = 0;

    return data;
}

bee.execute = function (beeItem, dataItem, key, currentBee, currentData) {
    let register = valueSceneRegisters.filter((register) => {
        return register.check && register.check(beeItem, dataItem);
    })[0];

    return register ?
        register.apply(beeItem, dataItem, key, currentBee, currentData) : {};
};

bee.register = function (config) {

    if (typeof config === 'function') {
        config = config(bee);
    }

    if (!util.isPlainObject(config)) {
        throw(new Error('Expect config of register to be Object'));
    }

    if (config.hasOwnProperty('before') && !util.isFunction(config.before)) {
        throw(new Error('Expect config.before to be Function'));
    }

    if (config.hasOwnProperty('after') && !util.isFunction(config.after)) {
        throw(new Error('Expect config.after to be Function'));
    }

    if (config.hasOwnProperty('methods') && !util.isPlainObject(config.methods)) {
        throw(new Error('Expect config.methods to be Object'));
    }

    Object.keys(config.methods || {}).forEach((key) =>
        setMethod(key, config.methods[key])
    );

    util.makeArray(config.valueScenes).forEach((item) => bee.registerValueScene(item));

    util.makeArray(config.keyScenes).forEach((item) => bee.registerKeyScene(item));

    hooks.push({
        before: config.before,
        after: config.after
    });
};

bee.registerValueScene = function (config) {

    if (!util.isPlainObject(config)) {
        throw(new Error('Expect config of register to be Object'));
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

    Object.keys(config.methods || {}).forEach((key) =>
        setMethod(key, config.methods[key])
    );

    valueSceneRegisters.push(config);
};

bee.registerKeyScene = function (config) {

    if (!util.isPlainObject(config)) {
        throw(new Error('Expect config of register to be Object'));
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

function processLoop (data, beeConfig, func) {
    util.nestLoop(data, beeConfig, (currentData, currentBee) => {
        let allMatchKeys = getAllMatchKeys(currentBee);
        let beforeResult = {};

        for (let matcher of allMatchKeys) {
            let key = matcher.defaultAction.key;

            if (!matcher.defaultAction.hasOwnProperty('key')) {
                continue;
            }

            if (currentBee.hasOwnProperty(key)) {
                beforeResult[key] = matcher.defaultAction;
            } else {
                processData(currentData, currentBee, key, matcher.defaultAction);
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

        return function ([dataItem], beeItem, key, [currentData], currentBee, type) {
            let currentBeforeResult = beforeResult[key] || {};

            let value = currentBeforeResult.hasOwnProperty('value') ? currentBeforeResult.value : dataItem;

            key = currentBeforeResult.hasOwnProperty('key') ? currentBeforeResult.key : key;

            let result = func(value, beeItem, key, currentData, currentBee, type);

            processData(currentData, currentBee, key, Object.assign({}, currentBeforeResult, result));
        };
    });
}

function processData (data, beeConfig, key, action) {

    if (!util.isPlainObject(action)) {
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

    if (action.hasOwnProperty('beeValue')) {
        beeConfig[key] = action.beeValue;
    }

    if (action.remove) {
        delete data[currentKey];
    }
}

module.exports = bee;
