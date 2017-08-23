/**
 * @file ensure specific key of object exist
 */

'use strict';

const util = require('../util');
const ENSURE_SYMBOL = util.beeSymbol('ensure symbol');
const MATCH_ID = '_ensure_key_';

module.exports = {
    valueScenes: {
        name: 'ensure',
        check (beeItem) {
            return beeItem === ENSURE_SYMBOL;
        },
        apply () {
            return {
                create: true
            };
        },
        method () {
            return ENSURE_SYMBOL;
        }
    },
    keyScenes: {
        name: 'keep',
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
        method (key) {
            return {
                id: MATCH_ID,
                key: key
            };
        }
    }
};
