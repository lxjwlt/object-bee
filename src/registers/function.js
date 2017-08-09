/**
 * @file bee accepts function process
 */

'use strict';

const util = require('../util');

let tempData = null;

module.exports = function (bee) {

    bee.on('before', (data, beeConfig) => {
        tempData = util.copy(data);

        util.loop(tempData, data, beeConfig, ([dataItem], beeItem, key, [currentTempData, currentData], currentBee) => {
            Object.defineProperty(currentTempData, key, {
                get () {
                    let result = bee.execute(beeItem, dataItem, key, currentBee, currentTempData);

                    if (result.hasOwnProperty('value')) {
                        return result.value;
                    }

                    return dataItem;
                }
            });
        });
    });

    bee.installValueScene({
        check (beeItem) {
            return typeof beeItem === 'function';
        },
        apply (beeItem, dataItem, key) {
            return {
                value: beeItem.call(tempData, dataItem, key)
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
