/**
 * @file glob match for key
 */

'use strict';

const multimatch = require('multimatch');
const util = require('../util');
const MATCH_ID = 'glob-match';

module.exports = {

    keyCheck (info) {
        return util.isObject(info) && info.id === MATCH_ID;
    },

    match (key, info) {
        return multimatch([key], info.data).length;
    },

    keyBee: {
        glob (...matches) {
            return {
                id: MATCH_ID,
                data: matches
            };
        }
    }

};
