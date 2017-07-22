'use strict';

const registers = [];

function bee (data, bee) {

    debugger;
    data = copy(data);

    loop(data, bee, function (dataItem, beeItem, key, currentData, currentBee) {
        let register = registers.filter((register) => {
            return register.check(beeItem, dataItem);
        })[0];

        return register ? register.apply(beeItem, dataItem, key, currentData, currentBee, loop.noModify) : loop.noModify;
    });

    return data;
}

bee.register = function (config) {

    if (!isObject(config)) {
        throw(new Error('Expect config of register to be Object'));
    }

    if (typeof config.check !== 'function') {
        throw(new Error('Expect config.check to be Function'));
    }

    if (typeof config.apply !== 'function') {
        throw(new Error('Expect config.apply to be Function'));
    }

    if (config.namespace && !isObject(config.namespace)) {
        throw(new Error('Expect config.namespace to be Object'));
    }

    if (isObject(config.namespace)) {
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

function loop (data, bee, func) {

    if (isArray(bee) && isArray(data)) {

        for (let i = bee.length - 1; i >= 0; i--) {

            let result = func(data[i], bee[i], i, data, bee, 'array');

            if (result !== loop.noModify) {
                data[i] = result;
            }

            loop(data[i], bee[i], func);
        }

    } else if (isObject(bee) && isObject(data)) {

        Object.keys(bee).forEach(function (key) {
            let result = func(data[key], bee[key], key, data, bee, 'object');

            if (result !== loop.noModify) {
                data[key] = result;
            }

            loop(data[key], bee[key], func);
        });

    }

}

loop.noModify = beeSymbol('loop no modify');

function copy (data) {
    return JSON.parse(JSON.stringify(data));
}

function isObject (data) {
    return typeof data === 'object' && data;
}

function isArray (data) {
    return Object.prototype.toString.apply(data) === '[object array]';
}

function beeSymbol (desc) {
    return Symbol(`[object-bee] ${desc}`);
}

module.exports = bee;
