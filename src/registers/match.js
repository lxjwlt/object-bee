/**
 * @file match key by regular expression
 */

'use strict';

const util = require('../util');
const MATCH_ID = 'key-match';

module.exports = {

    keyScenes: {
        name: 'match',

        check (info) {
            return util.isPlainObject(info) && info.id === MATCH_ID;
        },

        match (key, info) {
            return info.data.some((item) => {
                let type = item.type;
                let value = item.value;

                if (type === 'RegExp') {
                    return (new RegExp(value.replace(/^\/|\/$/g, ''))).test(key);
                } else {
                    return key === value;
                }
            });
        },

        method (...matches) {
            return {
                id: MATCH_ID,
                data: matches.map((item) => {
                    return {
                        type: item instanceof RegExp ? 'RegExp' : 'String',
                        value: item.toString()
                    };
                })
            };
        }
    }

};
