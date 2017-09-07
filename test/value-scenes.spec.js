'use strict';

const assert = require('assert');
const {check} = require('./util');
const bee = require('../src/index');

class ValueScenesTester {
    constructor (config) {
        this.config = config;
    }
}

bee.$install({
    valueScenes: {
        name: '_valueScene',
        check (beeItem) {
            return beeItem instanceof ValueScenesTester;
        },
        apply (beeItem) {
            return require('clone')(beeItem.config);
        },
        method (config) {
            return new ValueScenesTester(config);
        }
    }
});

describe('value-scenes-register', () => {
    it('empty config', function () {
        let data = {
            foo: 1
        };

        let beeOptions = {
            foo: bee._valueScene({})
        };

        check(data, beeOptions, {
            foo: 1
        });
    });

    it('same key', function () {
        let data = {
            foo: 1
        };

        let beeOptions = {
            foo: bee._valueScene({
                key: 'foo'
            })
        };

        check(data, beeOptions, {
            foo: 1
        });
    });

    it('rewrite key', function () {
        let data = {
            foo: 1
        };

        let beeOptions = {
            foo: bee._valueScene({
                key: 'bar'
            })
        };

        check(data, beeOptions, {
            bar: 1
        });
    });

    it.skip('rewrite none-configurable key', function () {
        let data = {};

        Object.defineProperty(data, 'foo', {
            enumerable: true,
            value: 1
        });

        let beeOptions = {
            foo: bee._valueScene({
                key: 'bar'
            })
        };

        assert.throws(function () {
            bee(data, beeOptions);
        });

        assert.deepStrictEqual(data, {
            foo: 1
        });
    });

    it('unknown key', function () {
        let data = {};

        let beeOptions = {
            bar: bee._valueScene({
                key: 'bar'
            })
        };

        check(data, beeOptions, {});
    });

    it('inherit descriptor', function () {
        let data = {};
        let descriptor = {
            enumerable: true,
            configurable: true,
            get () {
                return 'yeah';
            },
            set: undefined
        };

        Object.defineProperty(data, 'foo', descriptor);

        let beeOptions = {
            foo: bee._valueScene({
                key: 'bar'
            })
        };

        check(data, beeOptions, {
            bar: 'yeah'
        });

        assert.deepEqual(
            Object.getOwnPropertyDescriptor(data, 'bar'), descriptor
        );
    });

    it('origin value', function () {
        let data = {
            bar: 'foo'
        };

        let beeOptions = {
            bar: bee._valueScene({
                value: 'foo'
            })
        };

        check(data, beeOptions, {
            bar: 'foo'
        });
    });

    it('change value', function () {
        let data = {
            bar: 'foo'
        };

        let beeOptions = {
            bar: bee._valueScene({
                value: 1
            })
        };

        check(data, beeOptions, {
            bar: 1
        });
    });

    it('undefined value', function () {
        let data = {
            bar: 'foo'
        };

        let beeOptions = {
            bar: bee._valueScene({
                value: undefined
            })
        };

        check(data, beeOptions, {
            bar: undefined
        });
    });

    it('remove', function () {
        let data = {
            foo: 1
        };

        let beeOptions = {
            foo: bee._valueScene({
                remove: true
            })
        };

        check(data, beeOptions, {});
    });

    it('no remove', function () {
        let data = {
            foo: 1
        };

        let beeOptions = {
            foo: bee._valueScene({
                remove: false
            })
        };

        check(data, beeOptions, {
            foo: 1
        });
    });

    it('create', function () {
        let data = {};

        let beeOptions = {
            bar: bee._valueScene({
                create: true
            })
        };

        check(data, beeOptions, {
            bar: undefined
        });
    });

    it('not create', function () {
        let data = {};

        let beeOptions = {
            bar: bee._valueScene({
                create: false
            })
        };

        check(data, beeOptions, {});
    });

    it('create a exist key', function () {
        let data = {
            bar: 1
        };

        let beeOptions = {
            bar: bee._valueScene({
                create: true
            })
        };

        check(data, beeOptions, {
            bar: 1
        });
    });

    it('function beeValue', function () {
        let data = {
            bar: 1
        };

        let beeOptions = {
            bar: bee._valueScene({
                beeValue  () {
                    return 123;
                }
            })
        };

        check(data, beeOptions, {
            bar: 123
        });
    });

    it('object beeValue', function () {
        let data = {
            info: {
                name: 'ball'
            }
        };

        let beeOptions = {
            info: bee._valueScene({
                beeValue: {
                    name: bee.rename('ball')
                }
            })
        };

        check(data, beeOptions, {
            info: {
                ball: 'ball'
            }
        });
    });

    it('undefined beeValue', function () {
        let data = {};

        let beeOptions = {
            info: bee._valueScene({
                beeValue: {
                    name: bee.rename('ball')
                }
            })
        };

        check(data, beeOptions, {});
    });

    it('create, rename and assign value', function () {
        let data = {};

        let beeOptions = {
            bar: bee._valueScene({
                create: true,
                value: 'foo',
                key: 'foo-name'
            })
        };

        check(data, beeOptions, {
            'foo-name': 'foo'
        });
    });

    it('create and remove', function () {
        let data = {};

        let beeOptions = {
            bar: bee._valueScene({
                create: true,
                remove: true
            })
        };

        check(data, beeOptions, {
            bar: undefined
        });
    });

    it('beeValue and default action', function () {
        let data = {
            info: {
                name: 'ball'
            }
        };

        let beeOptions = {
            info: bee._valueScene({
                beeValue: {
                    total () {
                        return this.total + this.nest.nest;
                    },
                    nest: {
                        nest () {
                            return 4;
                        }
                    }
                },
                value: {
                    total: 1,
                    nest: {
                        nest: 2
                    }
                }
            })
        };

        check(data, beeOptions, {
            info: {
                total: 5,
                nest: {
                    nest: 4
                }
            }
        });
    });

    it('beeValue and create', function () {
        let data = {};

        let beeOptions = {
            info: bee._valueScene({
                create: true,
                beeValue: {
                    name () {
                        return 'foo';
                    }
                },
                value: {
                    name: ''
                }
            })
        };

        check(data, beeOptions, {
            info: {
                name: 'foo'
            }
        });
    });

    it('beeValue and remove', function () {
        let data = {
            info: 'foo'
        };

        let beeOptions = {
            info: bee._valueScene({
                remove: true,
                beeValue: {
                    name () {
                        return 'foo';
                    }
                },
                value: {
                    name: ''
                }
            })
        };

        check(data, beeOptions, {});
    });
});
