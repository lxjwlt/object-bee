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
        valueScenes: {
            methods: {
                queue: function (...actions) {
                    return new QueueRegister(actions);
                }
            },
            check (beeItem) {
                return beeItem instanceof QueueRegister || util.isArray(beeItem);
            },
            apply (beeItem, dataItem, key) {
                let result = {
                    key: key,
                    value: dataItem
                };

                let queue = beeItem instanceof QueueRegister ? beeItem.queue : beeItem;

                for (let queueBeeItem of queue) {
                    let register = bee.getRegister(queueBeeItem, result.value);

                    if (register) {
                        result = Object.assign(
                            {}, result,
                            register.apply.call(register, queueBeeItem, result.value, result.key)
                        );
                    }
                }

                return result;
            }
        }
    };

};
