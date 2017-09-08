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
            let methodResults = [];
            let proto = {};

            /**
             * init inner method
             */
            bee.$valueSceneRegisters.forEach(function (register) {
                if (!register.method || !register.apply) {
                    return;
                }

                proto['$' + register.name] = function () {
                    let method = register.method;

                    let methodResult = util.isFunction(method)
                        ? method.apply(null, arguments) : method;

                    methodResults.push(methodResult);
                };
            });

            proto.$root = data;

            const $UNDEFINED = proto.$UNDEFINED = util.beeSymbol('function return undefined');

            /**
             * bind extra method to mediator instead of binding to "currentData",
             * we can return "currentData" from "beeItem" function, and
             * prevent extra method mess up our final data.
             */
            let mediator = Object.create(proto, util.getOwnPropertyDescriptors(currentData));

            let value = beeItem.call(mediator, dataItem, key);

            let result = bee.$multiExecute(methodResults, ...[...arguments].slice(1));

            if (!util.isUndefined(value)) {
                util.assign(result, {

                    /**
                     * use real-time data, cause some other data
                     * are maybe being compute right now.
                     */
                    value: value === $UNDEFINED ? util.undefined : util.copy(value)

                });
            }

            return result;
        }
    });

    bee.$installMethods({
        root (path) {
            return function () {
                let value = util.path(this.$root, path);
                return util.isUndefined(value) ? this.$UNDEFINED : value;
            };
        },
        data (path) {
            return function () {
                let value = util.path(this, path);
                return util.isUndefined(value) ? this.$UNDEFINED : value;
            };
        }
    });
};
