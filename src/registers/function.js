/**
 * @file bee accepts function process
 */

'use strict';

const util = require('../util');

module.exports = function (bee) {

    bee.installValueScene({
        check (beeItem) {
            return typeof beeItem === 'function';
        },
        apply (beeItem, dataItem, key, currentBee, currentData, data) {

            let hasOldData = data.hasOwnProperty('$data');
            let oldData = data.$data;

            data.$data = currentData;

            let value = beeItem.call(data, dataItem, key);

            if (hasOldData) {
                data.$data = oldData;
            }

            return {
                value: value
            };
        }
    });

    bee.installValueScene({
        methods: {
            root: {
                chain: false,
                handler (path) {
                    return function () {
                        return util.path(this, path);
                    };
                }
            },
            data: {
                chain: false,
                handler (path) {
                    return function () {
                        return util.path(this.$data, path);
                    };
                }
            }
        }
    });
};
