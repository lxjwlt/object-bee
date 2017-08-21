'use strict';

const {check} = require('../util');
const bee = require('../../src/index');

describe('[entity register]', () => {
    describe('entity method', function () {
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
                privacy: bee.entity([])
            };

            check(ori, beeOptions, {
                name: null,
                age: 12,
                privacy: [],
                detail: null
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
                            name: bee.entity({
                                bar: 1
                            })
                        }
                    }
                }
            };

            check(ori, beeOptions, {
                node: {
                    info: {
                        data: {
                            name: {
                                bar: 1
                            }
                        }
                    }
                }
            });
        });

        it('unknown key', () => {
            let ori = {};

            let beeOptions = {
                unknownKey: bee.entity({
                    foo: 1
                })
            };

            check(ori, beeOptions, {});
        });

        it('multi apply', () => {
            let ori = {
                name: []
            };

            let beeOptions = {
                name: [bee.entity('a'), bee.entity('b'), bee.entity('c')]
            };

            check(ori, beeOptions, {
                name: 'c'
            });
        });

        it('chaining call', () => {
            let ori = {
                num: 1
            };

            let beeOptions = {
                num: bee.entity('a').entity('b')
            };

            check(ori, beeOptions, {
                num: 'b'
            });
        });

        it('renamed key', () => {
            let ori = {
                num: 1
            };

            let beeOptions = {
                num: bee.rename('letter').entity('b')
            };

            check(ori, beeOptions, {
                letter: 'b'
            });
        });

        it('removed key', () => {
            let ori = {
                num: 1
            };

            let beeOptions = {
                num: bee.remove().entity(123)
            };

            check(ori, beeOptions, {});
        });

        it('entity function', () => {
            let ori = {
                foo: 1
            };

            function testFunc () {}

            let beeOptions = {
                foo: bee.entity(testFunc)
            };

            check(ori, beeOptions, {
                foo: testFunc
            });
        });
    });

    describe('entity all method', function () {
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
                a: [1, 2, 3],
                info: {
                    c: func
                }
            };

            check(bee.entityAll, ori, beeOptions, {
                a: [1, 2, 3],
                info: {
                    b: 2,
                    c: func
                }
            });
        });

        it('with escape', function () {
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

        it('unknown key', () => {
            let ori = {};

            let beeOptions = {
                unknownKey: {
                    foo: 1
                }
            };

            check(bee.entityAll, ori, beeOptions, {});
        });

        it('unknown key', () => {
            let ori = {};

            let beeOptions = {
                unknownKey: bee.escape({
                    foo: 1
                })
            };

            check(bee.entityAll, ori, beeOptions, {});
        });

        it('escape not bee', () => {
            let ori = {
                num: 1
            };

            let beeOptions = {
                num: bee.escape('a')
            };

            check(bee.entityAll, ori, beeOptions, {
                num: 1
            });
        });

        it('renamed key', () => {
            let ori = {
                num: 1
            };

            let beeOptions = {
                num: bee.escape(bee.rename('letter').entity('b'))
            };

            check(bee.entityAll, ori, beeOptions, {
                letter: 'b'
            });
        });

        it('escape not in entityAll', () => {
            let ori = {
                num: 1
            };

            let beeOptions = {
                num: bee.escape(bee.rename('letter'))
            };

            check(ori, beeOptions, {
                letter: 1
            });
        });
    });
});
