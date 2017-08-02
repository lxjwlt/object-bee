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
            let match = reg.match(/^([^(]+)\((\S+)\)$/);
            let type = match[1];
            let value = match[2];

            if (type === 'RegExp') {
                return (new RegExp(value.replace(/^\/|\/$/g, ''))).test(key);
            } else {
                return key === value;
            }
        });
    },

    keyBee: {
        match (...matches) {
            return {
                id: MATCH_ID,
                data: matches.map((item) => {
                    let type = item instanceof RegExp ? 'RegExp' : 'String';
                    return `${type}(${item.toString()})`;
                })
            };
        }
    }

};
