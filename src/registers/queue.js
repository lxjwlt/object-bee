/**
 * @file queue all actions
 */

'use strict';

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
                return beeItem instanceof QueueRegister;
            },
            apply (beeItem) {
                return bee.$multiExecute(beeItem.queue, ...[...arguments].slice(1));
            }
        }
    };
};
