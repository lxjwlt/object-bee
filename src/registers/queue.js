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
            name: 'queue',
            method (...actions) {
                return new QueueRegister(actions);
            },
            check (beeItem) {
                return beeItem instanceof QueueRegister || util.isArray(beeItem);
            },
            apply (beeItem, dataItem, key, currentBee, currentData, data) {
                let result = {
                    key: key
                };

                if (currentData.hasOwnProperty(key)) {
                    result.value = dataItem;
                }

                let queue = beeItem instanceof QueueRegister ? beeItem.queue : beeItem;

                for (let queueBeeItem of queue) {
                    Object.assign(result, bee.execute(
                        queueBeeItem, result.value, result.key,
                        currentBee, currentData, data
                    ));
                }

                return result;
            }
        }
    };

};
