/**
 * @file bee accepts function process
 */

const util = require('../util');

let tempData = null;

module.exports = function (bee) {
    return {
        before (data, beeConfig) {
            tempData = util.copy(data);

            util.loop(tempData, data, beeConfig, ([dataItem], beeItem, key, [currentTempData, currentData], currentBee) => {
                Object.defineProperty(currentTempData, key, {
                    get () {
                        let result = bee.execute(dataItem, beeItem, key, currentTempData, currentBee);

                        if (result.hasOwnProperty('value')) {
                            return result.value;
                        }

                        return dataItem;
                    }
                });
            });
        },
        check (beeItem) {
            return typeof beeItem === 'function';
        },
        apply (beeItem, dataItem, key) {
            return {
                value: beeItem.call(tempData, dataItem, key)
            };
        },
        bee: {
            path (path) {
                return function () {
                    return util.path(this, path);
                }
            }
        }
    };
};
