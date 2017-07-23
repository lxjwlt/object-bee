/**
 * @file utility
 */

const util = {

    copy (data) {
        return JSON.parse(JSON.stringify(data));
    },

    isFunction (data) {
        return typeof data === 'function';
    },

    isObject (data) {
        return typeof data === 'object' && data;
    },

    isArray (data) {
        return Object.prototype.toString.apply(data) === '[object array]';
    },

    beeSymbol (desc) {
        return Symbol(`[object-bee] ${desc}`);
    },

    loop (data, bee, func) {
        let dataList = [data];

        if (arguments.length > 3) {
            let args = [...arguments];
            bee = args[args.length - 2];
            func = args[args.length - 1];
            dataList = args.slice(0, -2);
        }

        if (util.isArray(bee) && dataList.every((data) => util.isArray(data))) {

            for (let i = bee.length - 1; i >= 0; i--) {
                let dataValueList = dataList.map((data) => data[i]);

                func(dataValueList, bee[i], i, dataList, bee, 'array');

                util.loop(...dataValueList, bee[i], func);
            }

        } else if (util.isObject(bee) && dataList.every((data) => util.isObject(data))) {

            Object.keys(bee).forEach(function (key) {
                let dataValueList = dataList.map((data) => data[key]);

                func(dataValueList, bee[key], key, dataList, bee, 'object');

                util.loop(...dataValueList, bee[key], func);
            });

        }
    }

};

module.exports = util;
