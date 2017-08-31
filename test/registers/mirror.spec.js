'use strict';

const {check} = require('../util');
const bee = require('../../src/index');

describe('[mirror register]', () => {
    it('normal', () => {
        let ori = {
            name: 'foo',
            children: {
                name: 'bar',
                children: {
                    name: 'test',
                    children: {
                        name: 'end'
                    }
                }
            }
        };

        let beeOptions = {
            name () {
                return 'foo';
            },
            children: bee.mirror()
        };

        check(ori, beeOptions, {
            name: 'foo',
            children: {
                name: 'foo',
                children: {
                    name: 'foo',
                    children: {
                        name: 'foo'
                    }
                }
            }
        });
    });

    it('with path', () => {
        let ori = {
            name: 'foo',
            info: {
                tree: {
                    count: 20,
                    nodes: {
                        count: 30,
                        nodes: {
                            count: 40
                        }
                    }
                }
            }
        };

        let beeOptions = {
            info: {
                tree: {
                    count (value) {
                        return value - 10;
                    },
                    nodes: bee.mirror('info.tree')
                }
            }
        };

        check(ori, beeOptions, {
            name: 'foo',
            info: {
                tree: {
                    count: 10,
                    nodes: {
                        count: 20,
                        nodes: {
                            count: 30
                        }
                    }
                }
            }
        });
    });

    it('parallel multi apply', () => {
        let ori = {
            name: 'foo',
            child: {
                name: 'foo',
                child: {},
                tree: {
                    count: 1,
                    nodes: {
                        count: 2
                    }
                }
            },
            tree: {
                count: 5,
                nodes: {
                    count: 6,
                    nodes: {
                        count: 7
                    }
                }
            }
        };

        let beeOptions = {
            name () {
                return 'bar';
            },
            child: bee.mirror(),
            tree: {
                count (value) {
                    return value * 2;
                },
                nodes: bee.mirror('tree')
            }
        };

        check(ori, beeOptions, {
            name: 'bar',
            child: {
                name: 'bar',
                child: {},
                tree: {
                    count: 2,
                    nodes: {
                        count: 4
                    }
                }
            },
            tree: {
                count: 10,
                nodes: {
                    count: 12,
                    nodes: {
                        count: 14
                    }
                }
            }
        });
    });

    it('nesting multi apply', () => {
        let ori = {
            name: 'foo',
            child: {
                name: 'foo',
                tree: {
                    count: 5,
                    nodes: {
                        count: 6,
                        nodes: {
                            count: 7
                        }
                    }
                },
                child: {
                    name: 'foo',
                    tree: {
                        count: 5
                    }
                }
            }
        };

        let beeOptions = {
            name () {
                return 'bar';
            },
            child: bee.mirror(),
            tree: {
                count (value) {
                    return value * 2;
                },
                nodes: bee.mirror('tree')
            }
        };

        check(ori, beeOptions, {
            name: 'bar',
            child: {
                name: 'bar',
                tree: {
                    count: 10,
                    nodes: {
                        count: 12,
                        nodes: {
                            count: 14
                        }
                    }
                },
                child: {
                    name: 'bar',
                    tree: {
                        count: 10
                    }
                }
            }
        });
    });

    it('none nesting', () => {
        let ori = {
            info: {
                name: 'bar'
            },
            child: {
                name: '',
                chile: {
                    name: ''
                }
            }
        };

        let beeOptions = {
            info: {
                name () {
                    return 'foo';
                }
            },
            child: bee.mirror('info')
        };

        check(ori, beeOptions, {
            info: {
                name: 'foo'
            },
            child: {
                name: 'foo',
                chile: {
                    name: ''
                }
            }
        });
    });

    it('mirror with rename', () => {
        let ori = {
            name: 'foo',
            children: {
                name: 'bar',
                children: {
                    name: 'test',
                    children: {
                        name: 'end'
                    }
                }
            }
        };

        let beeOptions = {
            name () {
                return 'foo';
            },
            children: [bee.mirror(), bee.rename('nodes')]
        };

        check(ori, beeOptions, {
            name: 'foo',
            nodes: {
                name: 'foo',
                nodes: {
                    name: 'foo',
                    nodes: {
                        name: 'foo'
                    }
                }
            }
        });
    });

    it('rename', () => {
        let ori = {
            name: 'foo',
            children: {
                name: 'bar',
                children: {
                    name: 'test',
                    children: {
                        name: 'end'
                    }
                }
            }
        };

        let beeOptions = {
            name: bee.rename('foo'),
            children: bee.mirror()
        };

        check(ori, beeOptions, {
            foo: 'foo',
            children: {
                foo: 'bar',
                children: {
                    foo: 'test',
                    children: {
                        foo: 'end'
                    }
                }
            }
        });
    });

    it.skip('override config', () => {
        let ori = {
            count: 1,
            nodes: {
                count: 2,
                nodes: {
                    count: 3
                }
            }
        };

        let beeOptions = {
            info: {
                name () {
                    return 'foo';
                }
            },
            child: bee.mirror('info')
        };

        check(ori, beeOptions, {
            info: {
                name: 'foo'
            },
            child: {
                name: 'foo',
                chile: {
                    name: ''
                }
            }
        });
    });
});
