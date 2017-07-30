/**
 * @file match key by regular expression
 */

const util = require('../util');
const MATCH_ID = 'key-match';

module.exports = {

    keyCheck (info) {
        return util.isObject(info) && info.id === MATCH_ID;
    },

    match (key, info) {
        return info.data.some((reg) => {
            reg = new RegExp(reg.replace(/^\/|\/$/g, ''));
            return reg.test(key);
        });
    },

    keyMethods: {
        match (...matches) {
            return {
                id: MATCH_ID,
                data: matches.map((item) => {
                    return item.toString();
                })
            };
        }
    }

};
