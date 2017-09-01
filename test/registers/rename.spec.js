'use strict';

const {check} = require('../util');
const bee = require('../../src/index');
const assert = require('assert');

describe('[rename register]', () => {
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

    it('multi apply', () => {
        let ori = {
            name: []
        };

        let beeOptions = {
            name: [bee.rename('a'), bee.rename('b'), bee.rename('c')]
        };

        check(ori, beeOptions, {
            c: []
        });
    });

    it('chaining call', () => {
        let ori = {
            num: 1
        };

        let beeOptions = {
            num: bee.rename('a').rename('b')
        };

        check(ori, beeOptions, {
            b: 1
        });
    });

    it('removed key', () => {
        let ori = {
            num: 1
        };

        let beeOptions = {
            num: [bee.remove(), bee.rename('b')]
        };

        check(ori, beeOptions, {});
    });

    it('inherit descriptor', () => {
        let ori = {};
        let value = 1;
        let setFunc = function (val) {
            value = val;
        };
        let getFunc = function () {
            return value;
        };

        let descriptor = {
            enumerable: false,
            configurable: true,
            set: setFunc,
            get: getFunc
        };

        Object.defineProperty(ori, 'num', descriptor);

        bee(ori, {
            num: bee.rename('foo')
        });

        assert.strictEqual(ori.foo, 1);

        assert.strictEqual(ori.num, undefined);

        assert.deepStrictEqual(Object.getOwnPropertyDescriptor(ori, 'foo'), descriptor);
    });
});
