/**
 * @file remove key from object
 */

const removeSymbol = Symbol('[object-bee] remove data by specific key');

module.exports = {
    check (beeItem) {
        return beeItem === removeSymbol;
    },
    apply (beeItem, dataItem, key, data, bee, noModify) {
        delete data[key];
        return noModify;
    },
    namespace: {
        remove: removeSymbol
    }
};
