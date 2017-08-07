/**
 * @file return a new data
 */

'use strict';

const util = require('../util');

module.exports = function (bee) {
    return {
        valueScenes: {
            methods: {
                create (data, options) {
                    return bee.call(null, util.copy(data), options);
                }
            }
        }
    };
};
