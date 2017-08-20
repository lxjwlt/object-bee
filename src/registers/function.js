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
            let proto = {
                $root: data
            };

            /**
             * init inner method
             */
            bee.$valueSceneRegisters.forEach(function (register) {
                if (!register.method || !register.apply) {
                    return;
                }

                proto['$' + register.name] = function () {
                    let outerArgs = [...args];
                    let method = register.method;

                    outerArgs[0] = util.isFunction(method) ?
                        method.apply(null, arguments) : method;

                    Object.assign(result, register.apply.apply(register.apply, outerArgs));
                };
            });

            /**
             * bind extra method to mediator instead of binding to "currentData",
             * we can return "currentData" from "beeItem" function, and
             * prevent extra method mess up our final data.
             */
            let mediator = Object.create(proto, Object.getOwnPropertyDescriptors(currentData));

            let value = beeItem.call(mediator, dataItem, key);

            return Object.assign(result, {

                /**
                 * use real-time data, cause some other data
                 * are maybe being compute right now.
                 */
                value: util.copy(value)

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
