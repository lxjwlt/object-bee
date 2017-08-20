'use strict';

const assert = require('assert');
const {check} = require('./util');
const bee = require('../src/index');

describe('object-bee', () => {

    it('no enum key', function () {
        let data = {};

        Object.defineProperty(data, 'name', {
            enumerable: false,
            writable: true,
            configurable: true,
            value: 'foo'
        });

        let beeOptions = {
            name: bee.rename('foo')
        };

        check(data, beeOptions, {
            foo: 'foo'
        });
    });

    it('no enum key', function () {
        let data = Object.create(null, {
            name: {
                enumerable: false,
                configurable: true,
                value: 'foo'
            }
        });

        let beeOptions = {
            name: bee.rename('foo')
        };

        check(data, beeOptions, {
            foo: 'foo'
        });
    });

    it('chaining call', function () {
        let data = {
            a: 1
        };

        let beeOptions = {
            a: bee.rename('b').rename('cc')
        };

        check(data, beeOptions, {
            cc: 1
        });
    });

    describe('event', () => {

        it('before event', function (done) {
            function test () {
                done();
            }

            bee.$on('before', test);
            bee({}, {});
            bee.$off('before', test);
        });

        it('after event', function (done) {
            function test () {
                done();
            }

            bee.$on('after', test);
            bee({}, {});
            bee.$off('after', test);
        });

        it('custom event', function (done) {
            function test () {
                done();
            }

            bee.$on('xxx', test);
            bee.$emit('xxx');
            bee.$off('xxx', test);
        });

        it('event arguments', function (done) {
            function test (...nums) {
                assert.deepStrictEqual(nums, [1, 2, 3]);
                done();
            }
            bee.$on('xx', test);
            bee.$emit('xx', 1, 2, 3);
            bee.$off('xxx', test);
        });

    });

});
