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

                data['$' + register.name] = function () {
                    let outerArgs = [...args];
                    let method = register.method;

                    outerArgs[0] = util.isFunction(method) ?
                        method.apply(null, arguments) : method;

                    Object.assign(result, register.apply.apply(register.apply, outerArgs));
                };
            });

            let hasOldData = data.hasOwnProperty('$data');
            let oldData = data.$data;

            data.$data = currentData;

            let value = beeItem.call(data, dataItem, key);

            if (hasOldData) {
                data.$data = oldData;
            } else {
                delete data.$data;
            }

            return Object.assign(result, {
                value: value
            });
        }
    });

    bee.$installMethods({
        root (path) {
            return function () {
                return util.path(this, path);
            };
        },
        data (path) {
            return function () {
                return util.path(this.$data, path);
            };
        }
    });
};
