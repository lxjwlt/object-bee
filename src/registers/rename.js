/**
 * @file rename specific key of object
 */

'use strict';

class RenameRegister {
    constructor (name) {
        this.name = name;
    }
}

module.exports = {
    valueScenes: {
        name: 'rename',
        check (beeItem) {
            return beeItem instanceof RenameRegister;
        },
        apply (beeItem) {
            return {
                key: beeItem.name
            };
        },
        method (name) {
            return new RenameRegister(name);
        }
    }
};
