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

    it('escape value', () => {
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
                location: bee.escape('us')
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

});

function equalAndNotModify (data, format, expect) {
    let clone = JSON.parse(JSON.stringify(data));

    let result = bee(data, format);

    assert.deepEqual(result, expect);

    assert.deepEqual(data, clone, 'can not change origin object');
}
