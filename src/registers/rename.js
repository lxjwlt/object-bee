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
    apply (beeItem, dataItem, key, data, bee, noModify) {
        delete data[key];
        data[beeItem.name] = dataItem;
        return noModify;
    },
    namespace: {
        rename (name) {
            return new RenameRegister(name);
        }
    }
};
