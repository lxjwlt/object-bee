/**
 * @file none operation
 */

'use strict';

const util = require('../util');
const NOOP_SYMBOL = util.beeSymbol('noop symbol');

module.exports = {
    valueScenes: {
        check (beeItem) {
            return beeItem === NOOP_SYMBOL;
        },
        apply () {
            return {};
        },
        methods: {
            noop: NOOP_SYMBOL
        }
    }
};
