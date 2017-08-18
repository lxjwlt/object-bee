'use strict';

const {check} = require('../util');
const bee = require('../../src/index');

describe('[function register]', () => {

    // todo
    describe('normal function', function () {

        it('function', () => {
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
