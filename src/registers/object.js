/**
 * @file object is a default structure, some other register can use object as bee-item.
 */

'use strict';

const util = require('../util');

module.exports = {
    check (beeItem) {
        return util.isPlainObject(beeItem);
    },
    apply (beeItem) {
        return {
            beeValue: beeItem
        };
    }
};
