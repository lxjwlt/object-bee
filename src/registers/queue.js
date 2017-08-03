/**
 * @file queue all actions
 */

'use strict';

const util = require('../util');

class QueueRegister {
    constructor (actions) {
        this.queue = actions;
    }
}

module.exports = function (bee) {
    return {
        check (beeItem) {
            return beeItem instanceof QueueRegister || util.isArray(beeItem);
        },
        apply (beeItem, dataItem, key) {
            let result = {};
            let currentKey = key;
            let currentValue = dataItem;
            let queue = beeItem instanceof QueueRegister ? beeItem.queue : beeItem;

            for (let queueBeeItem of queue) {
                let register = bee.getRegister(queueBeeItem, currentValue);

                if (register) {
                    result = Object.assign(
                        {}, result,
                        register.apply.call(register, queueBeeItem, currentValue, currentKey)
                    );

                    currentKey = result.key;
                    currentValue = result.value;
                }
            }

            return result;
        },
        bee: {
            queue (...actions) {
                return new QueueRegister(actions);
            }
        }
    };
};
