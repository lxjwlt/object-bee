'use strict';

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

});
