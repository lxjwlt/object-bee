/**
 * @file rename specific key of object
 */

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
    namespace: {
        rename (name) {
            return new RenameRegister(name);
        }
    }
};
