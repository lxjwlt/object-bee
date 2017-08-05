'use strict';

const assert = require('assert');
const cloneDeep = require('lodash.clonedeep');
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

        equalAndNotModify(ori, beeOptions, {
            name: 1,
            age: 12,
            privacy: {
                location: 'china',
                occupation: 'front-end'
            },
            detail: null
        });
    });

    it('entity value', () => {
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
            privacy: {
                location: bee.entity('us')
            }
        };

        equalAndNotModify(ori, beeOptions, {
            name: null,
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
            detail: null
        };

        let beeOptions = {
            detail: bee.remove
        };

        equalAndNotModify(ori, beeOptions, {
        });
    });

    it('rename key', () => {
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

        equalAndNotModify(ori, beeOptions, {
            name: null,
            age: 12,
            info: {
                location: 'china',
                occupation: 'front-end'
            },
            detail: null
        });
    });

    it('queue actions', () => {
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
            privacy: bee.queue(bee.rename('list'), () => {
                return 11;
            })
        };

        equalAndNotModify(ori, beeOptions, {
            name: null,
            age: 12,
            list: 11,
            detail: null
        });
    });

    it('queue actions', () => {
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
            privacy: bee.queue(bee.rename('list'), bee.rename('info'), () => {
                return 11;
            })
        };

        equalAndNotModify(ori, beeOptions, {
            name: null,
            age: 12,
            info: 11,
            detail: null
        });
    });

    it('queue actions', () => {
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
            privacy: [bee.rename('list'), () => {
                return 13;
            }]
        };

        equalAndNotModify(ori, beeOptions, {
            name: null,
            age: 12,
            list: 13,
            detail: null
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

        equalAndNotModify(ori, beeOptions, {
            a: 4,
            d: 2,
            c: 6
        });
    });

    it('match specific name', function () {
        let ori = {
            a: 1,
            b: 2,
            c: 5
        };

        let beeOptions = {
            [bee.match(/a|b/)] () {
                return 4;
            }
        };

        equalAndNotModify(ori, beeOptions, {
            a: 4,
            b: 4,
            c: 5
        });
    });

    it('match specific name in deep', function () {
        let ori = {
            info: {
                age: 26,
                career: 'front-end'
            }
        };

        let beeOptions = {
            info: {
                [bee.match(/^(age|career)$/)]: bee.remove
            }
        };

        equalAndNotModify(ori, beeOptions, {
            info: {}
        });
    });

    it('match specific name with origin bee', function () {
        let ori = {
            info: {
                name: 'bee',
                career: 'front-end'
            }
        };

        let beeOptions = {
            info: {
                name: (value) => {
                    return value + '!!';
                },
                [bee.match(/^(name|career)$/)]: (value) => {
                    return value + '!!';
                }
            }
        };

        equalAndNotModify(ori, beeOptions, {
            info: {
                name: 'bee!!!!',
                career: 'front-end!!'
            }
        });
    });

    it('multi reg match', function () {
        let ori = {
            info: {
                name: 'bee',
                career: 'front-end'
            }
        };

        let beeOptions = {
            info: {
                [bee.match(/^name$/, /^career$/)]: (value) => {
                    return value + '!!';
                }
            }
        };

        equalAndNotModify(ori, beeOptions, {
            info: {
                name: 'bee!!',
                career: 'front-end!!'
            }
        });
    });

    it('multi string match', function () {
        let ori = {
            a: 1,
            b: 2,
            c: 3
        };

        let beeOptions = {
            [bee.match('a', 'b')]: (value) => {
                return value + 1;
            }
        };

        equalAndNotModify(ori, beeOptions, {
            a: 2,
            b: 3,
            c: 3
        });
    });

    it('multi type match', function () {
        let ori = {
            a: 1,
            b: 2,
            1: 3
        };

        let beeOptions = {
            [bee.match(/a/, 1, 'b')]: (value) => {
                return String(value) + '!?';
            }
        };

        equalAndNotModify(ori, beeOptions, {
            a: '1!?',
            b: '2!?',
            1: '3!?'
        });
    });

    it('glob match', function () {
        let ori = {
            abc: 1,
            cabc: 2
        };

        let beeOptions = {
            [bee.glob('ab**')]: (value) => {
                return value + 2;
            }
        };

        equalAndNotModify(ori, beeOptions, {
            abc: 3,
            cabc: 2
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
                name: bee.path('data.person.name')
            }
        };

        equalAndNotModify(ori, beeOptions, {
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

    it('entity all values', function () {
        let ori = {
            a: 1,
            info: {
                b: 2,
                c: 3
            }
        };

        let func = () => {
            return 4;
        };

        let beeOptions = {
            a: [1,2,3],
            info: {
                c: func
            }
        };

        equalAndNotModify(bee.entityAll, ori, beeOptions, {
            a: [1,2,3],
            info: {
                b: 2,
                c: func
            }
        });
    });

    it('entity all values with escape', function () {
        let ori = {
            a: 1,
            info: {
                b: 2,
                c: 3
            }
        };

        let beeOptions = {
            info: {
                c: bee.escape(() => {
                    return 4;
                })
            }
        };

        equalAndNotModify(bee.entityAll, ori, beeOptions, {
            a: 1,
            info: {
                b: 2,
                c: 4
            }
        });
    });

    it('object in queue', function () {
        let ori = {
            info: {
                name: 'foo'
            }
        };

        let beeOptions = {
            info: [bee.rename('person'), {
                name: () => {
                    return 'bee';
                }
            }]
        };

        equalAndNotModify(ori, beeOptions, {
            person: {
                name: 'bee'
            }
        });
    });

    it('object in queue', function () {
        let ori = {
            info: 1
        };

        let beeOptions = {
            info: [bee.rename('num'), (value) => {
                return value + 2;
            }]
        };

        equalAndNotModify(ori, beeOptions, {
            num: 3
        });
    });

});

function equalAndNotModify (methods, data, format, expect) {

    if (typeof methods !== 'function') {
        expect = format;
        format = data;
        data = methods;
        methods = bee;
    }

    let clone = cloneDeep(data);

    let result = methods(data, format);

    assert.deepEqual(result, expect);

    assert.deepEqual(data, clone, 'can not change origin object');
}
