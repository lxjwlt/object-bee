/**
 * @file bee accepts function process
 */

module.exports = {
    check (beeItem) {
        return typeof beeItem === 'function';
    },
    apply (beeItem, dataItem, key) {
        return {
            value: beeItem(dataItem, key)
        };
    }
};
