'use strict';

const util = require('./util');

const registers = [];

function bee (data, beeConfig) {

    debugger;
    data = util.copy(data);

    loop(data, beeConfig, function (dataItem, beeItem, key, currentData, currentBee) {
        let register = bee.getRegister(beeItem, dataItem);

        return register ?
            register.apply(beeItem, dataItem, key, currentData, currentBee) :
            loop.noModify;
    });

    return data;
}

bee.getRegister = function (beeItem, dataItem) {
    return registers.filter((register) => {
        return register.check(beeItem, dataItem);
    })[0];
};

bee.register = function (config) {

    if (typeof config === 'function') {
        config = config(bee);
    }

    if (!util.isObject(config)) {
        throw(new Error('Expect config of register to be Object'));
    }

    if (typeof config.check !== 'function') {
        throw(new Error('Expect config.check to be Function'));
    }

    if (typeof config.apply !== 'function') {
        throw(new Error('Expect config.apply to be Function'));
    }

    if (config.namespace && !util.isObject(config.namespace)) {
        throw(new Error('Expect config.namespace to be Object'));
    }

    if (util.isObject(config.namespace)) {
        Object.keys(config.namespace).forEach((key) => {
            if (bee[key]) {
                throw(new Error(`${key} namespace has been registered`));
            }

            bee[key] = config.namespace[key];
        });
    }

    registers.push({
        check: config.check,
        apply: config.apply
    });
};

bee.register(require('./registers/function'));
bee.register(require('./registers/escape'));
bee.register(require('./registers/remove'));
bee.register(require('./registers/rename'));
bee.register(require('./registers/queue'));

function loop (data, bee, func) {

    if (util.isArray(bee) && util.isArray(data)) {

        for (let i = bee.length - 1; i >= 0; i--) {

            let result = func(data[i], bee[i], i, data, bee, 'array');

            if (result !== loop.noModify) {
                processData(data, i, result);
            }

            loop(data[i], bee[i], func);
        }

    } else if (util.isObject(bee) && util.isObject(data)) {

        Object.keys(bee).forEach(function (key) {
            let result = func(data[key], bee[key], key, data, bee, 'object');

            if (result !== loop.noModify) {
                processData(data, key, result);
            }

            loop(data[key], bee[key], func);
        });

    }

}

function processData (data, key, config) {

    if (config.hasOwnProperty('key') && config.key !== key) {
        data[config.key] = data[key];
        delete data[key];
        key = config.key;
    }

    if (config.hasOwnProperty('value')) {
        data[key] = config.value;
    }

    if (config.remove) {
        delete data[key];
    }
}

loop.noModify = util.beeSymbol('loop no modify');

module.exports = bee;
