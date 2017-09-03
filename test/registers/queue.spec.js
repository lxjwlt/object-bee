'use strict';

const {check} = require('../util');
const bee = require('../../src/index');

describe('[queue register]', () => {
    it('queue method', () => {
        let ori = {
            name: 1
        };

        let beeOptions = {
            name: bee.queue(bee.rename('info'), () => {
                return 123;
            })
        };

        check(ori, beeOptions, {
            info: 123
        });
    });

    it('array queue', () => {
        let ori = {
            name: 1
        };

        let beeOptions = {
            name: bee.queue(bee.rename('info'), () => {
                return 123;
            })
        };

        check(ori, beeOptions, {
            info: 123
        });
    });

    it('value chaining in function queue', () => {
        let ori = {
            name: 1
        };

        let beeOptions = {
            name: bee.queue((value) => {
                return value + 1;
            }, (value) => {
                return value + 1;
            })
        };

        check(ori, beeOptions, {
            name: 3
        });
    });

    it('key chaining in function queue', () => {
        let ori = {
            name: 1
        };

        let beeOptions = {
            name: bee.queue(bee.rename('foo'), (value, key) => {
                return key + '!';
            })
        };

        check(ori, beeOptions, {
            foo: 'foo!'
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
                        name: bee.queue(bee.rename('value'), bee.remove())
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
        let ori = {};

        let beeOptions = {
            unknownKey: bee.queue(bee.rename('info'))
        };

        check(ori, beeOptions, {});
    });

    it('chaining apply', () => {
        let ori = {
            name: []
        };

        let beeOptions = {
            name: bee.queue(bee.rename('bar')).queue(bee.rename('foo'))
        };

        check(ori, beeOptions, {
            foo: []
        });
    });
});
