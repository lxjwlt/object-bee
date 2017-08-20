'use strict';

const {check} = require('../util');
const bee = require('../../src/index');

describe('[function register]', () => {

    // todo
    describe('normal function', function () {

        it('return value', () => {
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

        it('unknown key', () => {
            let ori = {};

            let beeOptions = {
                unknownKey () {
                    return 'foo';
                }
            };

            check(ori, beeOptions, {});
        });

        it('child config', () => {
            let ori = {
                info: 'foo'
            };

            let beeOptions = {
                info: [function () {
                    return {
                        foo: 1
                    };
                }, {
                    foo () {
                        return 'bar';
                    }
                }]
            };

            check(ori, beeOptions, {
                info: {
                    foo: 'bar'
                }
            });
        });

    });

    // todo
    describe('computed value', function () {

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

        it.skip('multi function', () => {
            let ori = {
                a: 1
            };

            let beeOptions = {
                a: [function () {
                    return 123;
                }, function () {
                    return this.a === 123;
                }]
            };

            check(ori, beeOptions, {
                a: true
            });
        });

        it('loop get', () => {
            let ori = {
                info: 'foo'
            };

            let beeOptions = {
                info () {
                    return this.info === undefined;
                }
            };

            check(ori, beeOptions, {
                info: true
            });
        });

        it('check root data in child config', () => {
            let ori = {
                name: 'bar',
                info: 'foo'
            };

            let beeOptions = {
                info: [function () {
                    return {
                        foo: 'foo'
                    };
                }, {
                    foo () {
                        debugger;
                        return this.$root.name === 'bar';
                    }
                }]
            };

            check(ori, beeOptions, {
                name: 'bar',
                info: {
                    foo: true
                }
            });
        });

    });

    // todo
    describe('inner method', function () {

        it('rename', () => {
            let ori = {
                foo: 'bar'
            };

            let beeOptions = {
                foo (value, key) {
                    this.$rename(value);
                    return key;
                }
            };

            check(ori, beeOptions, {
                bar: 'foo'
            });
        });

        it('remove', () => {
            let ori = {
                bar: 1,
                foo: 2
            };

            let beeOptions = {
                foo () {
                    this.$remove();
                    return 3;
                }
            };

            check(ori, beeOptions, {
                bar: 1
            });
        });

        it('ensure', () => {
            let ori = {};

            let beeOptions = {
                newKey () {
                    this.$ensure();
                    return 3;
                }
            };

            check(ori, beeOptions, {
                newKey: 3
            });
        });

    });

    describe('root method', function () {

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

    });

    // todo
    describe('data method', function () {});

});
