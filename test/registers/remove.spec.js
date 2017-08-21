'use strict';

const {check} = require('../util');
const bee = require('../../src/index');

describe('[remove register]', () => {
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
            privacy: bee.remove()
        };

        check(ori, beeOptions, {
            name: null,
            age: 12,
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
                        name: bee.remove()
                    }
                }
            }
        };

        check(ori, beeOptions, {
            node: {
                info: {
                    data: {}
                }
            }
        });
    });

    it('unknown key', () => {
        let ori = {};

        let beeOptions = {
            unknownKey: bee.remove()
        };

        check(ori, beeOptions, {});
    });

    it('multi apply', () => {
        let ori = {
            name: []
        };

        let beeOptions = {
            name: [bee.remove(), bee.remove(), bee.remove()]
        };

        check(ori, beeOptions, {});
    });

    it('chaining call', () => {
        let ori = {
            num: 1
        };

        let beeOptions = {
            num: bee.remove().remove()
        };

        check(ori, beeOptions, {});
    });
});
