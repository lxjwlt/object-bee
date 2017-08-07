/**
 * @file return a new data
 */

'use strict';

const util = require('../util');

module.exports = function (bee) {
    return {
        methods: {
            create (data, options) {
                return bee.call(null, util.copy(data), options);
            }
        }
    };
};
