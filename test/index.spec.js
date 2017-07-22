'use strict';

const assert = require('assert');
const bee = require('../src/index');

describe('object-bee', () => {

    it('normal use', () => {
        let ori = {
            name: null,
            age: 12,
            privacy: {
                location: 'china',
                occupation: 'front-end'
            },
            detail: null
        };

        let beeOptions = {
            age: 4,
            name () {
                return 1;
            },
            privacy: {
                location: bee.escape('us')
            }
        };

        equalAndNotModify(ori, beeOptions, {
            name: 1,
            age: 12,
            privacy: {
                location: 'us',
                occupation: 'front-end'
            },
            detail: null
        });
    });

    it('delete key', () => {
        let ori = {
            name: null,
            age: 12,
            privacy: {
                location: 'china',
                occupation: 'front-end'
            },
            detail: null
        };

        let beeOptions = {
            detail: bee.remove
        };

        equalAndNotModify(ori, beeOptions, {
            name: null,
            age: 12,
            privacy: {
                location: 'china',
                occupation: 'front-end'
            }
        });
    });

});

function equalAndNotModify (data, format, expect) {
    let clone = JSON.parse(JSON.stringify(data));

    let result = bee(data, format);

    assert.deepEqual(result, expect);

    assert.deepEqual(data, clone, 'can not change origin object');
}
