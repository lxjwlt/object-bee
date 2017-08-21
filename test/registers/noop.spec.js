'use strict';

const {check} = require('../util');
const bee = require('../../src/index');

describe('[noop register]', () => {
    it('normal', () => {
        let ori = {
            foo: 'bar'
        };

        let beeOptions = {
            privacy: bee.noop()
        };

        check(ori, beeOptions, {
            foo: 'bar'
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
                        name: bee.noop()
                    }
                }
            }
        };

        check(ori, beeOptions, {
            node: {
                info: {
                    data: {
                        name: 'foo'
                    }
                }
            }
        });
    });

    it('unknown key', () => {
        let ori = {
            foo: 1
        };

        let beeOptions = {
            unknownKey: bee.noop()
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
            name: [bee.noop(), bee.noop(), bee.noop()]
        };

        check(ori, beeOptions, {
            name: []
        });
    });

    it('mixed apply', () => {
        let ori = {
            name: []
        };

        let beeOptions = {
            name: [bee.rename('foo'), bee.noop()]
        };

        check(ori, beeOptions, {
            foo: []
        });
    });

    it('chaining call', () => {
        let ori = {
            num: 1
        };

        let beeOptions = {
            num: bee.noop().noop()
        };

        check(ori, beeOptions, {
            num: 1
        });
    });

    it('mixed chaining call', () => {
        let ori = {
            foo: 1
        };

        let beeOptions = {
            foo: bee.noop().rename('b')
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
            num: [bee.remove(), bee.noop()]
        };

        check(ori, beeOptions, {});
    });
});
