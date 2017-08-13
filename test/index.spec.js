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

        check(ori, beeOptions, {
            name: null,
            age: 12,
            privacy: {
                location: 'us',
                occupation: 'front-end'
            },
            detail: null
        });
    });

    it('queue actions', () => {
        let ori = {
            privacy: {
                location: 'china',
                occupation: 'front-end'
            }
        };

        let beeOptions = {
            privacy: bee.queue(bee.rename('list'), () => {
                return 11;
            })
        };

        check(ori, beeOptions, {
            list: 11
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

        check(ori, beeOptions, {
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

        check(ori, beeOptions, {
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

        check(ori, beeOptions, {
            a: 4,
            d: 2,
            c: 6
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

        check(ori, beeOptions, {
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

        check(bee.entityAll, ori, beeOptions, {
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

        check(bee.entityAll, ori, beeOptions, {
            a: 1,
            info: {
                b: 2,
                c: 4
            }
        });
    });

    it('function in queue', function () {
        let ori = {
            info: 1
        };

        let beeOptions = {
            info: [bee.rename('num'), (value) => {
                return value + 2;
            }]
        };

        check(ori, beeOptions, {
            num: 3
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
