'use strict';

const {check} = require('../util');
const bee = require('../../src/index');

describe('[mirror register]', () => {
    it('normal', () => {
        let ori = {
            name: 'foo',
            children: {
                name: 'bar',
                children: {
                    name: 'end'
                }
            }
        };

        let beeOptions = {
            name () {
                return 'foo';
            },
            children: bee.mirror()
        };

        check(ori, beeOptions, {
            name: 'foo',
            children: {
                name: 'foo',
                children: {
                    name: 'foo'
                }
            }
        });
    });
});
