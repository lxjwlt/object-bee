'use strict';

const {check} = require('./util');
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
            }
        };

        check(ori, beeOptions, {
            name: 1,
            age: 12,
            privacy: {
                location: 'china',
                occupation: 'front-end'
            },
            detail: null
        });
    });

    it.only('function', () => {
        let ori = {
            foo: 1
        };

        let beeOptions = {
            foo (value) {
                return value + 1;
            }
        };

        check(ori, beeOptions, {
            foo: 2
        });
    });

    it('computed value', () => {
        let ori = {
            a: 1,
            b: 2,
            c: 5
        };

        let beeOptions = {
            a () {
                return 4;
            },
            b: bee.rename('d'),
            c () {
                return this.a + this.b;
            }
        };

        check(ori, beeOptions, {
            a: 4,
            d: 2,
            c: 6
        });
    });

    it('path of data', function () {
        let ori = {
            info: {
                name: ''
            },
            data: {
                person: {
                    name: 'object-bee'
                }
            }
        };

        let beeOptions = {
            info: {
                name: bee.root('data.person.name')
            }
        };

        check(ori, beeOptions, {
            info: {
                name: 'object-bee'
            },
            data: {
                person: {
                    name: 'object-bee'
                }
            }
        });
    });

    it('path of undefined data', function () {
        let ori = {
            info: {
                name: ''
            },
            data: {
                person: {
                    name: 'object-bee'
                }
            }
        };

        let beeOptions = {
            info: {
                name: bee.root('data.xx.xx')
            }
        };

        check(ori, beeOptions, {
            info: {
                name: undefined
            },
            data: {
                person: {
                    name: 'object-bee'
                }
            }
        });
    });

    it('path of array', function () {
        let ori = {
            info: {
                list: [1,2,3]
            },
            name: ''
        };

        let beeOptions = {
            name: bee.root('info.list[2]')
        };

        check(ori, beeOptions, {
            info: {
                list: [1,2,3]
            },
            name: 3
        });
    });

    it('path of object', function () {
        let ori = {
            info: {
                'test-name': 'test name'
            },
            name: ''
        };

        let beeOptions = {
            name: bee.root('info["test-name"]')
        };

        check(ori, beeOptions, {
            info: {
                'test-name': 'test name'
            },
            name: 'test name'
        });
    });

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
