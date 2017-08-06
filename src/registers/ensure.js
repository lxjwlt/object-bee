/**
 * @file ensure specific key of object exist
 */

'use strict';

const util = require('../util');
const ENSURE_SYMBOL = util.beeSymbol('ensure symbol');
const MATCH_ID = '_ensure_key_';

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
    },
    keyCheck (info) {
        return util.isPlainObject(info) && info.id === MATCH_ID;
    },
    match (key, info) {
        return key === info.key;
    },
    keyApply (info) {
        return {
            key: info.key
        };
    },
    keyBee: {
        keep (key) {
            return {
                id: MATCH_ID,
                key: key
            };
        }
    }
};
