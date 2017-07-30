/**
 * @file utility
 */

const util = {

    copy (data) {
        return JSON.parse(JSON.stringify(data));
    },

    isRegExp (data) {
        return Object.prototype.toString.call(data) === '[object RegExp]';
    },

    isFunction (data) {
        return typeof data === 'function';
    },

    isObject (data) {
        return typeof data === 'object' && data;
    },

    isArray (data) {
        return Object.prototype.toString.apply(data) === '[object Array]';
    },

    beeSymbol (desc) {
        return Symbol(`[object-bee] ${desc}`);
    },

    forEach (data, func) {
        if (util.isArray(data)) {
            data.forEach(function (item, i) {
                func.apply(this, arguments);
            });
        } else if (util.isObject(data)) {
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

        if (util.isArray(bee) && dataList.every((data) => util.isArray(data))) {
            let func = outerFunc(...dataList, bee);

            for (let i = bee.length - 1; i >= 0; i--) {
                let dataValueList = dataList.map((data) => data[i]);

                func(dataValueList, bee[i], i, dataList, bee, 'array');

                util.nestLoop(...dataValueList, bee[i], outerFunc);
            }

        } else if (util.isObject(bee) && dataList.every((data) => util.isObject(data))) {
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
    }

};

module.exports = util;
