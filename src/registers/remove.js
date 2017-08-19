/**
 * @file remove key from object
 */

'use strict';

const util = require('../util');
const removeSymbol = util.beeSymbol('remove data by specific key');

module.exports = {
    valueScenes: {
        name: 'remove',
        check (beeItem) {
            return beeItem === removeSymbol;
        },
        apply () {
            return {
                remove: true
            };
        },
        method () {
            return removeSymbol;
        }
    }
};
