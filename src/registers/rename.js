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
    check (beeItem) {
        return beeItem instanceof RenameRegister;
    },
    apply (beeItem) {
        return {
            key: beeItem.name
        };
    },
    bee: {
        rename (name) {
            return new RenameRegister(name);
        }
    }
};
