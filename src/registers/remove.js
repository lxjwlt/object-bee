/**
 * @file remove key from object
 */

const util = require('../util');
const removeSymbol = util.beeSymbol('remove data by specific key');

module.exports = {
    check (beeItem) {
        return beeItem === removeSymbol;
    },
    apply () {
        return {
            remove: true
        };
    },
    bee: {
        remove: removeSymbol
    }
};
