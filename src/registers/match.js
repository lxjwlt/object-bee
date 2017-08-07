/**
 * @file match key by regular expression
 */

'use strict';

const util = require('../util');
const MATCH_ID = 'key-match';

module.exports = {

    keyScenes: {
        check (info) {
            return util.isPlainObject(info) && info.id === MATCH_ID;
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

        methods: {
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
    }

};
