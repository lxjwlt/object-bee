'use strict';

const {check} = require('../util');
const bee = require('../../src/index');

describe('[object register]', () => {
    it('object in queue', function () {
        let ori = {
            info: {
                name: 'foo'
            }
        };

        let beeOptions = {
            info: bee.queue(bee.rename('person'), {
                name: () => {
                    return 'bee';
                }
            })
        };

        check(ori, beeOptions, {
            person: {
                name: 'bee'
            }
        });
    });

    it('removed key', function () {
        let ori = {
            info: {
                name: 'foo'
            }
        };

        let beeOptions = {
            info: bee.queue(bee.remove(), {
                name: () => {
                    return 'bee';
                }
            })
        };

        check(ori, beeOptions, {});
    });

    it('entity object', () => {
        let ori = {
            person: 'foo'
        };

        let beeOptions = {
            person: bee.entity({
                name: 'foo'
            })
        };

        check(ori, beeOptions, {
            person: {
                name: 'foo'
            }
        });
    });

    it('multi apply', () => {
        let ori = {
            name: {
                first: 'a',
                last: 'b'
            }
        };

        let beeOptions = {
            name: bee.queue({
                first: bee.remove()
            }, {
                last () {
                    return 1;
                }
            })
        };

        check(ori, beeOptions, {
            name: {
                last: 1
            }
        });
    });

    it('multi apply', () => {
        let ori = {
            name: {
                first: 'a',
                last: 'b'
            }
        };

        let beeOptions = {
            name: bee.queue({
                first: bee.rename('a'),
                last: bee.rename('b')
            }, {
                first () {
                    return 1;
                }
            })
        };

        check(ori, beeOptions, {
            name: {
                first: 1,
                b: 'b'
            }
        });
    });

    it('unknown key', () => {
        let ori = {
            num: 1
        };

        let beeOptions = {
            unknownKey: {
                name: 1
            }
        };

        check(ori, beeOptions, {
            num: 1
        });
    });

    it('unknown key in queue', () => {
        let ori = {
            num: 1
        };

        let beeOptions = {
            unknownKey: [{
                name: 1
            }]
        };

        check(ori, beeOptions, {
            num: 1
        });
    });

    it('empty object', () => {
        let ori = {
            num: 1
        };

        let beeOptions = {
            num: {}
        };

        check(ori, beeOptions, {
            num: 1
        });
    });

    it('empty object in queue', () => {
        let ori = {
            num: 1
        };

        let beeOptions = {
            num: bee.queue(function () {
                return 123;
            }, {})
        };

        check(ori, beeOptions, {
            num: 123
        });
    });
});
