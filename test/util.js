/**
 * @file utility for test
 */

const assert = require('assert');
const cloneDeep = require('lodash.clonedeep');
const bee = require('../src/index');

'use strict';

let util = {
    check (methods, data, format, expect) {
        if (typeof methods !== 'function') {
            expect = format;
            format = data;
            data = methods;
            methods = bee;
        }

        let result;

        if (methods === bee) {
            let clone = cloneDeep(data);
            result = methods.create(data, format);
            assert.deepEqual(result, expect, '[clone] expect deep equal');
            assert.deepEqual(data, clone, '[clone] can not change origin object');
        }

        result = methods(data, format);

        assert.equal(result, data, '[normal] expect return original data');
        assert.deepEqual(result, expect, '[normal] expect deep equal');
    }
};

module.exports = util;
