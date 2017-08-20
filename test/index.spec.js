'use strict';

const assert = require('assert');
const {check} = require('./util');
const bee = require('../src/index');

describe('object-bee', () => {

    it('chaining call', function () {
        let ori = {
            a: 1
        };

        let beeOptions = {
            a: bee.rename('b').rename('cc')
        };

        check(ori, beeOptions, {
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
