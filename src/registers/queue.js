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

                let queue = beeItem instanceof QueueRegister ? beeItem.queue : beeItem;

                return bee.multiExecute(queue, dataItem, key, currentBee, currentData, data);
            }
        }
    };

};
