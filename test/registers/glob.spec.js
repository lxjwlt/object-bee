'use strict';

const {check} = require('../util');
const bee = require('../../src/index');

describe('[glob register]', () => {
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
            [bee.glob('ag*', 'de*')] () {
                return 'foo';
            }
        };

        check(ori, beeOptions, {
            name: null,
            age: 'foo',
            privacy: {
                location: 'china',
                occupation: 'front-end'
            },
            detail: 'foo'
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
                        [bee.glob('n*me')]: bee.remove()
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

    it('match all', () => {
        let ori = {
            foo: null,
            bar: null
        };

        let beeOptions = {
            [bee.glob('**')] () {
                return 1;
            }
        };

        check(ori, beeOptions, {
            foo: 1,
            bar: 1
        });
    });

    it('unknown key', () => {
        let ori = {
            foo: 'bar'
        };

        let beeOptions = {
            [bee.match('bar*')] () {
                return 111;
            }
        };

        check(ori, beeOptions, {
            foo: 'bar'
        });
    });

    it('ensure', () => {
        let ori = {
            name: []
        };

        let beeOptions = {
            [bee.glob('bar*')]: bee.ensure()
        };

        check(ori, beeOptions, {
            name: []
        });
    });

    it('has origin bee', function () {
        let ori = {
            info: {
                name: 'bee',
                career: 'front-end'
            }
        };

        let beeOptions = {
            info: {
                [bee.glob('**')]: (value) => {
                    return value + '!!';
                },
                name: (value) => {
                    return value + '!!';
                }
            }
        };

        check(ori, beeOptions, {
            info: {
                name: 'bee!!!!',
                career: 'front-end!!'
            }
        });
    });

    it('rename', () => {
        let ori = {
            foo: 'bar',
            a: 1
        };

        let beeOptions = {
            [bee.glob('**')]: bee.rename('c'),
            foo: [bee.rename('b'), () => {
                return 123;
            }]
        };

        check(ori, beeOptions, {
            b: 123,
            c: 1
        });
    });

    it('origin bee and rename', function () {
        let ori = {
            name: 'bee'
        };

        let beeOptions = {
            [bee.match(/name/)]: bee.rename('foo'),
            name: [bee.rename('bar'), () => {
                return 123;
            }]
        };

        check(ori, beeOptions, {
            bar: 123
        });
    });
});
