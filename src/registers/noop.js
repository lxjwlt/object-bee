/**
 * @file none operation
 */

'use strict';

const util = require('../util');
const NOOP_SYMBOL = util.beeSymbol('noop symbol');

module.exports = {
    valueScenes: {
        name: 'noop',
        check (beeItem) {
            return beeItem === NOOP_SYMBOL;
        },
        apply () {
            return {};
        },
        method () {
            return NOOP_SYMBOL;
        }
    }
};
