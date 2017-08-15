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
        apply (beeItem, dataItem, key, currentBee, currentData) {
            return {
                value: beeItem.call(currentData, dataItem, key)
            };
        }
    });

    bee.installValueScene({
        methods: {
            root (path) {
                return function () {
                    return util.path(this, path);
                };
            },

            /**
             * todo computed value in current data
             */
            data () {}
        }
    });
};
