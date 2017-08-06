/**
 * @file utility
 */

'use strict';

const util = {

    copy (data) {
        return require('lodash.clonedeep')(data);
    },

    isRegExp (data) {
        return Object.prototype.toString.call(data) === '[object RegExp]';
    },

    isFunction (data) {
        return typeof data === 'function';
    },

    isPlainObject (data) {
        return data && Object.prototype.toString.call(data) === '[object Object]' &&
            Object.getPrototypeOf(data) === Object.prototype;
    },

    isArray (data) {
        return Object.prototype.toString.apply(data) === '[object Array]';
    },

    isUndefined (data) {
        return typeof data === 'undefined';
    },

    beeSymbol (desc) {
        return Symbol(`[object-bee] ${desc}`);
    },

    forEach (data, func) {
        if (util.isArray(data)) {
            data.forEach(function (item, i) {
                func.apply(this, arguments);
            });
        } else if (util.isPlainObject(data)) {
            Object.keys(data).forEach(function (key) {
                func.call(this, data[key], key);
            });
        }
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
            let func = outerFunc(...dataList, bee);

            Object.keys(bee).forEach(function (key) {
                let dataValueList = dataList.map((data) => data[key]);

                func(dataValueList, bee[key], key, dataList, bee, 'object');

                util.nestLoop(...dataValueList, bee[key], outerFunc);
            });
        }
    },

    loop () {
        let args = [...arguments];
        let innerFunc = args[args.length - 1];
        util.nestLoop.apply(null, args.slice(0, -1).concat(function () {
            return innerFunc;
        }));
    },

    path (data, path) {
        let paths = path.split('.');

        for (let path of paths) {
            data = data[path];
            if (!data) {
                return null;
            }
        }

        return data;
    }

};

module.exports = util;
