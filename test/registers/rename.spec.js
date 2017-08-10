'use strict';

const {check} = require('../util');
const bee = require('../../src/index');

describe('[register] rename', () => {

    it('normal', () => {
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
            privacy: bee.rename('info')
        };

        check(ori, beeOptions, {
            name: null,
            age: 12,
            info: {
                location: 'china',
                occupation: 'front-end'
            },
            detail: null
        });
    });

    it('in deep', () => {
        let ori = {
            node: {
                info: {
                    data: {
                        name: 'foo'
                    }
                }
            }
        };

        let beeOptions = {
            node: {
                info: {
                    data: {
                        name: bee.rename('value')
                    }
                }
            }
        };

        check(ori, beeOptions, {
            node: {
                info: {
                    data: {
                        value: 'foo'
                    }
                }
            }
        });
    });

    it('unknown key', () => {
        let ori = {};

        let beeOptions = {
            unknownKey: bee.rename('info')
        };

        check(ori, beeOptions, {});
    });

});
