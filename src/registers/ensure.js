/**
 * @file ensure specific key of object exist
 */

'use strict';

const util = require('../util');
const ENSURE_SYMBOL = util.beeSymbol('ensure symbol');

module.exports = {
    check (beeItem) {
        return beeItem === ENSURE_SYMBOL;
    },
    apply (beeItem, dataItem, key) {
        return {
            key: key
        };
    },
    bee: {
        ensure: ENSURE_SYMBOL
    }
};
