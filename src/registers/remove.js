/**
 * @file remove key from object
 */

'use strict';

function RemoveClass () {}

module.exports = {
    valueScenes: {
        name: 'remove',
        check (beeItem) {
            return beeItem instanceof RemoveClass;
        },
        apply () {
            return {
                remove: true
            };
        },
        method () {
            return new RemoveClass();
        }
    }
};
