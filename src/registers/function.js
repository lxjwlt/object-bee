/**
 * @file bee accepts function process
 */

'use strict';

const util = require('../util');

module.exports = function (bee) {

    bee.$installValueScene({
        check (beeItem) {
            return typeof beeItem === 'function';
        },
        apply (beeItem, dataItem, key, currentBee, currentData, data) {
            let result = {};
            let args = [...arguments];

            /**
             * init inner method
             */
            bee.$valueSceneRegisters.forEach(function (register) {
                if (!register.method || !register.apply) {
                    return;
                }

                currentData['$' + register.name] = function () {
                    let outerArgs = [...args];
                    let method = register.method;

                    outerArgs[0] = util.isFunction(method) ?
                        method.apply(null, arguments) : method;

                    Object.assign(result, register.apply.apply(register.apply, outerArgs));
                };
            });

            let hasOldData = currentData.hasOwnProperty('$root');
            let oldData = currentData.$root;

            currentData.$root = data;

            let value = beeItem.call(currentData, dataItem, key);

            if (hasOldData) {
                currentData.$root = oldData;
            } else {
                delete currentData.$root;
            }

            return Object.assign(result, {
                value: value
            });
        }
    });

    bee.$installMethods({
        root (path) {
            return function () {
                return util.path(this.$root, path);
            };
        },
        data (path) {
            return function () {
                return util.path(this, path);
            };
        }
    });
};
