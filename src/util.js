/**
 * @file utility
 */

const util = {

    copy (data) {
        return JSON.parse(JSON.stringify(data));
    },

    isObject (data) {
        return typeof data === 'object' && data;
    },

    isArray (data) {
        return Object.prototype.toString.apply(data) === '[object array]';
    },

    beeSymbol (desc) {
        return Symbol(`[object-bee] ${desc}`);
    }

};

module.exports = util;
