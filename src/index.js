'use strict';

const util = require('./util');

const registers = [];

function bee (data, beeConfig) {

    debugger;
    data = util.copy(data);

    registers.forEach((register) => {
        if (util.isFunction(register.before)) {
            register.before.call(null, data, beeConfig);
        }
    });

    processLoop(data, beeConfig, function (dataItem, beeItem, key, currentData, currentBee) {
        let register = bee.getRegister(beeItem, dataItem);

        return register ?
            register.apply(beeItem, dataItem, key, currentData, currentBee) :
            processLoop.noModify;
    });

    return util.copy(data);
}

bee.execute = function (dataItem, beeItem, key, currentData, currentBee) {
    let register = bee.getRegister(beeItem, dataItem);

    return register ?
        register.apply(beeItem, dataItem, key, currentData, currentBee) :
        processLoop.noModify;
};

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
        before: config.before,
        check: config.check,
        apply: config.apply
    });
};

bee.register(require('./registers/function'));
bee.register(require('./registers/escape'));
bee.register(require('./registers/remove'));
bee.register(require('./registers/rename'));
bee.register(require('./registers/queue'));

function processLoop (data, bee, func) {
    util.loop(data, bee, ([dataItem], beeItem, key, [currentData], currentBee, type) => {
        let result = func(dataItem, beeItem, key, currentData, currentBee, type);

        if (result !== processLoop.noModify) {
            processData(currentData, key, result);
        }
    });
}

processLoop.noModify = util.beeSymbol('loop no modify');

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

module.exports = bee;
