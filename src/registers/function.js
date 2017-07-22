module.exports = {
    check (beeItem) {
        return typeof beeItem === 'function';
    },
    apply (beeItem, dataItem, key) {
        return beeItem(dataItem, key);
    }
};
