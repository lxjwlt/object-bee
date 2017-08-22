'use strict';

const {check} = require('./util');
const bee = require('../src/index');

class ValueScenesTester {
    constructor (config) {
        this.config = config;
    }
}

bee.$install({
    valueScenes: {
        name: '_valueScene',
        check (beeItem) {
            return beeItem instanceof ValueScenesTester;
        },
        apply (beeItem) {
            return require('clone')(beeItem.config);
        },
        method (config) {
            return new ValueScenesTester(config);
        }
    }
});

// todo
describe('value-scenes-register', () => {
    it('remove', function () {
        let data = {
            foo: 1
        };

        let beeOptions = {
            foo: bee._valueScene({
                remove: true
            })
        };

        check(data, beeOptions, {});
    });
});
