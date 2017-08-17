/**
 * @file ensure specific key of object exist
 */

'use strict';

const util = require('../util');
const ENSURE_SYMBOL = util.beeSymbol('ensure symbol');
const MATCH_ID = '_ensure_key_';

module.exports = {
    valueScenes: {
        check (beeItem) {
            return beeItem === ENSURE_SYMBOL;
        },
        apply (beeItem, dataItem, key) {
            return {
                create: true,
                key: key
            };
        },
        methods: {
            ensure: ENSURE_SYMBOL
        }
    },
    keyScenes: {
        check (info) {
            return util.isPlainObject(info) && info.id === MATCH_ID;
        },
        apply (info) {
            return {
                create: true,
                key: info.key
            };
        },
        match (key, info) {
            return key === info.key;
        },
        methods: {
            keep (key) {
                return {
                    id: MATCH_ID,
                    key: key
                };
            }
        }
    }
};
