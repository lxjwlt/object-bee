/**
 * @file glob match for key
 */

'use strict';

const glob = require('../lib/glob');
const util = require('../util');
const MATCH_ID = 'glob-match';

module.exports = {

    keyScenes: {
        name: 'glob',

        check (info) {
            return util.isPlainObject(info) && info.id === MATCH_ID;
        },

        match (key, info) {
            return info.data.some(pattern => glob(key, pattern));
        },

        method (...matches) {
            return {
                id: MATCH_ID,
                data: matches
            };
        }
    }

};
