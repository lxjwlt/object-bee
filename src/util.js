/**
 * @file utility
 */

'use strict';

const util = {

    copy (data) {
        return require('clone')(data, {
            includeNonEnumerable: true
        });
    },

    isRegExp (data) {
        return Object.prototype.toString.call(data) === '[object RegExp]';
    },

    isFunction (data) {
        return typeof data === 'function';
    },

    isSymbol (data) {
        return typeof data === 'symbol';
    },

    isPlainObject: require('is-plain-obj'),

    isEqualObject (dataA, dataB) {
        if (!util.isPlainObject(dataA) || !util.isPlainObject(dataB)) {
            return dataA === dataB;
        }

        let keys = Object.keys(dataA);

        if (keys.length !== Object.keys(dataB).length) {
            return;
        }

        for (let key of keys) {
            if (dataA[key] !== dataB[key]) {
                return false;
            }
        }

        return true;
    },

    isArray (data) {
        return Object.prototype.toString.apply(data) === '[object Array]';
    },

    isUndefined (data) {
        return typeof data === 'undefined';
    },

    beeSymbol (desc) {
        return `[object-bee] ${desc} ${Date.now()} ${Math.random()}`;
    },

    nestLoop (data, bee, outerFunc) {
        let dataList = [data];

        if (arguments.length > 3) {
            let args = [...arguments];
            bee = args[args.length - 2];
            outerFunc = args[args.length - 1];
            dataList = args.slice(0, -2);
        }

        if (util.isPlainObject(bee) && dataList.every((data) => util.isPlainObject(data))) {
            let func = outerFunc && outerFunc(...dataList, bee);

            let keys = dataList.reduce((result, data) => {
                return result.concat(Object.getOwnPropertyNames(data));
            }, []).concat(Object.getOwnPropertyNames(bee));

            let keyMap = keys.reduce((map, key) => {
                map[key] = true;
                return map;
            }, {});

            Object.keys(keyMap).forEach(function (key) {
                let dataValueList = dataList.map((data) => data[key]);

                if (func) {
                    func(dataValueList, bee[key], key, dataList, bee, 'object');
                }

                util.nestLoop(...dataValueList, bee[key], outerFunc);
            });
        }
    },

    loop () {
        let args = [...arguments];
        let innerFunc;

        if (util.isFunction(args[args.length - 1])) {
            innerFunc = args[args.length - 1];
            args = args.slice(0, -1).concat(function () {
                return innerFunc;
            });
        }

        util.nestLoop.apply(null, args);
    },

    loopObject (data, func) {
        util.loop(data, data, function ([value], value2, key, [currentData]) {
            func(value, key, currentData, data);
        });
    },

    path (data, path) {
        if (!path || !(path = path.trim())) {
            return data;
        }

        let startJoiner = path[0] === '[' ? '' : '.';

        /* eslint-disable no-new-func */
        let func = new Function('data', `
            try {
                return data${startJoiner}${path}
            } catch (e) {}
        `);
        /* eslint-enable no-new-func */

        return func(data);
    },

    makeArray (data) {
        if (util.isArray(data)) {
            return data;
        }

        if (data === null || util.isUndefined(data)) {
            return [];
        }

        if (typeof data === 'object' && data.length) {
            return Array.prototype.slice.call(data);
        }

        return [data];
    },

    hasOwnProperty (obj, key) {
        return Object.prototype.hasOwnProperty.call(obj, key);
    },

    getOwnPropertyDescriptors (obj) {
        return Object.getOwnPropertyNames(obj).reduce((map, key) => {
            let descriptor = Object.getOwnPropertyDescriptor(obj, key);

            if (typeof descriptor !== 'undefined') {
                map[key] = descriptor;
            }

            return map;
        }, {});
    },

    assign: require('object-assign')

};

module.exports = util;
