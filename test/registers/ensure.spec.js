'use strict';

const {check} = require('../util');
const bee = require('../../src/index');

describe('[register] ensure', () => {

    describe('ensure method', function () {

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
                foo: bee.ensure()
            };

            check(ori, beeOptions, {
                name: null,
                age: 12,
                privacy: {
                    location: 'china',
                    occupation: 'front-end'
                },
                detail: null,
                foo: undefined
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
                            bar: bee.ensure()
                        }
                    }
                }
            };

            check(ori, beeOptions, {
                node: {
                    info: {
                        data: {
                            name: 'foo',
                            bar: undefined
                        }
                    }
                }
            });
        });

        it('exist key', () => {
            let ori = {
                foo: 1
            };

            let beeOptions = {
                foo: bee.ensure()
            };

            check(ori, beeOptions, {
                foo: 1
            });
        });

        it('multi apply', () => {
            let ori = {
                name: []
            };

            let beeOptions = {
                name: [],
                detail: [bee.ensure(), bee.ensure(), bee.ensure()]
            };

            check(ori, beeOptions, {
                name: [],
                detail: undefined
            });
        });

        it('multi apply to exist key', () => {
            let ori = {
                name: []
            };

            let beeOptions = {
                name: [bee.ensure(), bee.ensure(), bee.ensure()]
            };

            check(ori, beeOptions, {
                name: []
            });
        });

        it('chaining call', () => {
            let ori = {
                foo: 1
            };

            let beeOptions = {
                num: bee.ensure().ensure()
            };

            check(ori, beeOptions, {
                foo: 1,
                num: undefined
            });
        });

        it('chaining call to exist key', () => {
            let ori = {
                num: 1
            };

            let beeOptions = {
                num: bee.ensure().ensure()
            };

            check(ori, beeOptions, {
                num: 1
            });
        });

        it('ensure key and assign value', function () {
            let ori = {};

            let beeOptions = {
                newKey: [bee.ensure(), () => {
                    return 12;
                }]
            };

            check(ori, beeOptions, {
                newKey: 12
            });
        });

        it.skip('ensure removed key and assign value', function () {
            let ori = {};

            let beeOptions = {
                newKey: [bee.remove(), bee.ensure()]
            };

            check(ori, beeOptions, {
                newKey: undefined
            });
        });

    });

    describe('keep method', function () {

        it('ensure key with keep method', function () {
            let ori = {};

            let beeOptions = {
                [bee.keep('newKey')]: []
            };

            check(ori, beeOptions, {
                newKey: undefined
            });
        });

        it('ensure key with keep method', function () {
            let ori = {};

            let beeOptions = {
                [bee.keep('newKey')]: () => {
                    return 123;
                }
            };

            check(ori, beeOptions, {
                newKey: 123
            });
        });

        it('ensure key with keep method and assign value', function () {
            let ori = {};

            let beeOptions = {
                [bee.keep('newKey')]: bee.noop,
                newKey: () => {
                    return 123;
                }
            };

            check(ori, beeOptions, {
                newKey: 123
            });
        });

    });
});
