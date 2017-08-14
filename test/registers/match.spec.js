'use strict';

const {check} = require('../util');
const bee = require('../../src/index');

describe('[match register]', () => {

    it('multi type match', function () {
        let ori = {
            foo: 1,
            bar: 2,
            1: 3
        };

        let beeOptions = {
            [bee.match(/foo/, 1, 'bar')]: (value) => {
                return String(value) + '!?';
            }
        };

        check(ori, beeOptions, {
            foo: '1!?',
            bar: '2!?',
            1: '3!?'
        });
    });

    describe('string match', function () {

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
                [bee.match('detail', 'age')] () {
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
                            [bee.match('name')]: bee.remove()
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
            let ori = {
                foo: 'bar'
            };

            let beeOptions = {
                [bee.match('unknownKey')] () {
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
                [bee.match('unknowKey')]: bee.ensure()
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
                    name: (value) => {
                        return value + '!!';
                    },
                    [bee.match('name', 'career')]: (value) => {
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

    });

    describe('regExp match', function () {

        it('normal', () => {
            let ori = {
                abc12345: 1,
                abc123: 'foo'
            };

            let beeOptions = {
                [bee.match(/^abc\d+$/)] () {
                    return 'bar';
                }
            };

            check(ori, beeOptions, {
                abc12345: 'bar',
                abc123: 'bar'
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
                            [bee.match(/^name$/)]: bee.remove()
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

        it('rename', () => {
            let ori = {
                foo: 'bar'
            };

            let beeOptions = {
                [bee.match(/foo/)]: bee.rename('bar')
            };

            check(ori, beeOptions, {
                bar: 'bar'
            });
        });

        it('unknown key', () => {
            let ori = {
                foo: 'bar'
            };

            let beeOptions = {
                [bee.match(/abc/)] () {
                    return 111;
                }
            };

            check(ori, beeOptions, {
                foo: 'bar'
            });
        });

        it('ensure unknown key', () => {
            let ori = {
                name: []
            };

            let beeOptions = {
                [bee.match('unknownKey')]: bee.ensure()
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
                    name: (value) => {
                        return value + '!!';
                    },
                    [bee.match(/^name|career$/)]: (value) => {
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

            check(ori, beeOptions, {
                info: {
                    name: 'bee!!',
                    career: 'front-end!!'
                }
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



});
