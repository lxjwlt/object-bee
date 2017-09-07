/**
 * @file ensure specific key of object exist
 */

'use strict';

const util = require('../util');
const MATCH_ID = '_ensure_key_';

function EnsureClass () {}

module.exports = {
    valueScenes: {
        name: 'ensure',
        check (beeItem) {
            return beeItem instanceof EnsureClass;
        },
        apply () {
            return {
                create: true
            };
        },
        method () {
            return new EnsureClass();
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
