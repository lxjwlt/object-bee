'use strict';

const {check} = require('../util');
const bee = require('../../src/index');
const assert = require('assert');

describe('[function register]', () => {
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

        it('check arguments', () => {
            let ori = {
                foo: 1
            };

            let beeOptions = {
                foo (value, key) {
                    assert.equal(key, 'foo');
                    assert.equal(value, 1);
                    return value;
                }
            };

            check(ori, beeOptions, {
                foo: 1
            });
        });

        it('check arguments in unknown key', () => {
            let ori = {};

            let beeOptions = {
                foo (value, key) {
                    assert.equal(key, 'foo');
                    assert.equal(value, undefined);
                    return value;
                }
            };

            check(ori, beeOptions, {});
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

        it('no modify', function () {
            let ori = {
                info: 'foo'
            };

            let beeOptions = {
                info () {}
            };

            check(ori, beeOptions, {
                info: 'foo'
            });
        });

        it('only action', function () {
            let ori = {
                info: 'foo'
            };

            let beeOptions = {
                info () {
                    this.$rename('foo');
                }
            };

            check(ori, beeOptions, {
                foo: 'foo'
            });
        });

        it('return undefined', function () {
            let ori = {
                info: 'foo'
            };

            let beeOptions = {
                info () {
                    return this.$UNDEFINED;
                }
            };

            check(ori, beeOptions, {
                info: undefined
            });
        });

        it('return undefined and action', function () {
            let ori = {
                info: 'foo'
            };

            let beeOptions = {
                info () {
                    this.$rename('foo');
                    return this.$UNDEFINED;
                }
            };

            check(ori, beeOptions, {
                foo: undefined
            });
        });
    });

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

        it('root data', () => {
            let ori = {
                foo: {
                    name: 'test',
                    bar: {
                        info: {
                            name: '123'
                        }
                    }
                }
            };

            let beeOptions = {
                foo: {
                    bar: {
                        info: {
                            name () {
                                return this.$root.foo.name + '!';
                            }
                        }
                    }
                }
            };

            check(ori, beeOptions, {
                foo: {
                    name: 'test',
                    bar: {
                        info: {
                            name: 'test!'
                        }
                    }
                }
            });
        });

        it('current data', () => {
            let ori = {
                foo: {
                    bar: {
                        a: 1,
                        b: 2
                    }
                }
            };

            let beeOptions = {
                foo: {
                    bar: {
                        b () {
                            return this.a + 5;
                        }
                    }
                }
            };

            check(ori, beeOptions, {
                foo: {
                    bar: {
                        a: 1,
                        b: 6
                    }
                }
            });
        });

        it('get later data', () => {
            let ori = {
                name: '',
                info: {
                    foo: 'bar'
                }
            };

            let beeOptions = {
                name () {
                    return this.info.foo;
                },
                info: {
                    foo () {
                        return 123;
                    }
                }
            };

            check(ori, beeOptions, {
                name: 123,
                info: {
                    foo: 123
                }
            });
        });

        it('removed key', () => {
            let ori = {
                a: 1,
                b: 2
            };

            let beeOptions = {
                a: bee.remove(),
                b (value) {
                    return this.a + value;
                }
            };

            check(ori, beeOptions, {
                b: 3
            });
        });

        it('loop get', () => {
            let ori = {
                info: 'foo'
            };

            let beeOptions = {
                info () {
                    return this.info === 'foo';
                }
            };

            check(ori, beeOptions, {
                info: true
            });
        });

        it('loop get in multi function', () => {
            let ori = {
                a: 1
            };

            let beeOptions = {
                a: [function () {
                    return 123;
                }, function () {
                    return this.a === 1;
                }]
            };

            check(ori, beeOptions, {
                a: true
            });
        });

        it('get parent data', () => {
            let ori = {
                info: {
                    foo: 1,
                    person: {
                        bar: 2
                    }
                }
            };

            let beeOptions = {
                info: {
                    foo () {
                        return 3;
                    },
                    person: {
                        bar () {
                            return this.$root.info;
                        }
                    }
                }
            };

            check(ori, beeOptions, {
                info: {
                    foo: 3,
                    person: {
                        bar: {
                            foo: 3,
                            person: {
                                bar: 2
                            }
                        }
                    }
                }
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

        it('no data', () => {
            let ori = {};

            let beeOptions = {
                info () {
                    return this.foo.bar;
                }
            };

            assert.throws(function () {

                check(ori, beeOptions, {});

            }, function (err) {
                assert.strictEqual(err.toString(), `TypeError: Cannot read property 'bar' of undefined`);
                return true;
            });
        });
    });

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

        it('noop', () => {
            let ori = {
                foo: 1
            };

            let beeOptions = {
                foo () {
                    this.$noop();
                    return 3;
                }
            };

            check(ori, beeOptions, {
                foo: 3
            });
        });

        it('queue', () => {
            let ori = {
                foo: 1
            };

            let beeOptions = {
                foo () {
                    this.$queue(bee.rename('name'));
                    return 3;
                }
            };

            check(ori, beeOptions, {
                name: 3
            });
        });
    });

    /**
     * todo unify error
     * chrome 60+ wouldn't report error，even if object can't not be set some key
     */
    describe('data can\'t be modified in function', function () {
        it('value', function () {
            let ori = {
                info: {
                    name: 'foo',
                    foo: 'bar'
                }
            };

            let beeOptions = {
                info (value) {
                    value.name = 'bar';
                    return value;
                }
            };

            assert.throws(function () {
                check(ori, beeOptions, {
                    info: {
                        name: 'foo',
                        foo: 'bar'
                    }
                });
            }, function (err) {
                assert.strictEqual(
                    err.toString(),
                    `TypeError: Cannot assign to read only property 'name' of object '#<Object>'`
                );
                return true;
            });
        });

        it('current data', function () {
            let ori = {
                info: {
                    name: 'foo',
                    foo: 'bar'
                }
            };

            let beeOptions = {
                info: {
                    foo (value) {
                        this.name = 'bar';
                        return value;
                    }
                }
            };

            assert.throws(function () {
                check(ori, beeOptions, {
                    info: {
                        name: 'foo',
                        foo: 'bar'
                    }
                });
            }, function (err) {
                assert.strictEqual(
                    err.toString(),
                    'TypeError: Cannot set property name of #<Object> which has only a getter'
                );
                return true;
            });
        });

        it('root data', function () {
            let data = {
                bar: 'foo',
                info: {
                    foo: 'foo'
                }
            };

            let beeOptions = {
                info: {
                    foo (value) {
                        this.$root.bar = 'bar';
                        return value;
                    }
                }
            };

            assert.throws(function () {
                check(data, beeOptions, {
                    name: 'bar',
                    info: {
                        foo: 'foo'
                    }
                });
            }, function (err) {
                assert.strictEqual(
                    err.toString(),
                    'TypeError: Cannot set property bar of #<Object> which has only a getter'
                );
                return true;
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
                    list: [1, 2, 3]
                },
                name: ''
            };

            let beeOptions = {
                name: bee.root('info.list[2]')
            };

            check(ori, beeOptions, {
                info: {
                    list: [1, 2, 3]
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

        it('empty path', function () {
            let ori = {
                info: {
                    root: ''
                }
            };

            let beeOptions = {
                info: {
                    root: bee.root()
                }
            };

            check(ori, beeOptions, {
                info: {
                    root: {
                        info: {
                            root: ''
                        }
                    }
                }
            });
        });
    });

    describe('data method', function () {
        it('path of data', function () {
            let ori = {
                info: {
                    a: 1,
                    b: 2
                }
            };

            let beeOptions = {
                info: {
                    b: bee.data('a')
                }
            };

            check(ori, beeOptions, {
                info: {
                    a: 1,
                    b: 1
                }
            });
        });

        it('path of undefined data', function () {
            let ori = {
                info: {
                    name: ''
                }
            };

            let beeOptions = {
                info: {
                    name: bee.data('xx.xx.xx')
                }
            };

            check(ori, beeOptions, {
                info: {
                    name: undefined
                }
            });
        });

        it('path of array', function () {
            let ori = {
                info: {
                    list: [1, 2, 3],
                    number: 0
                }
            };

            let beeOptions = {
                info: {
                    number: bee.data('list[1]')
                }
            };

            check(ori, beeOptions, {
                info: {
                    list: [1, 2, 3],
                    number: 2
                }
            });
        });

        it('path of object', function () {
            let ori = {
                info: {
                    'test-name': 'test name',
                    name: ''
                }
            };

            let beeOptions = {
                info: {
                    name: bee.data('["test-name"]')
                }
            };

            check(ori, beeOptions, {
                info: {
                    'test-name': 'test name',
                    name: 'test name'
                }
            });
        });

        it('empty path', function () {
            let ori = {
                info: {
                    name: 'foo',
                    person: ''
                }
            };

            let beeOptions = {
                info: {
                    person: bee.data()
                }
            };

            check(ori, beeOptions, {
                info: {
                    name: 'foo',
                    person: {
                        name: 'foo',
                        person: ''
                    }
                }
            });
        });
    });
});
