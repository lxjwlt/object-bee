/**
 * @file remove key from object
 */

'use strict';

const util = require('../util');
const removeSymbol = util.beeSymbol('remove data by specific key');

module.exports = {
    valueScenes: {
        check (beeItem) {
            return beeItem === removeSymbol;
        },
        apply () {
            return {
                remove: true
            };
        },
        methods: {
            remove: removeSymbol
        }
    }
};
