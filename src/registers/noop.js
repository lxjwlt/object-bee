/**
 * @file none operation
 */

'use strict';

const util = require('../util');
const NOOP_SYMBOL = util.beeSymbol('noop symbol');

module.exports = {
    check (beeItem) {
        return beeItem === NOOP_SYMBOL;
    },
    apply () {
        return {};
    },
    bee: {
        noop: NOOP_SYMBOL
    }
};
