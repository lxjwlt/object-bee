<p align="center">
    <img src="/icon/logo.png" width="200" />
</p>

<p align="center">
    <a href="https://www.npmjs.com/package/object-bee">
        <img src="https://img.shields.io/npm/v/object-bee.svg" />
    </a>
    <a href="https://travis-ci.org/lxjwlt/object-bee">
        <img src="https://img.shields.io/travis/lxjwlt/object-bee/dev.svg" />
    </a>
    <a href="https://codecov.io/gh/lxjwlt/object-bee/branch/dev">
        <img src="https://img.shields.io/codecov/c/github/lxjwlt/object-bee/dev.svg" />
    </a>
</p>

<p align="center">
    <a href="https://saucelabs.com/u/js-object-bee"><img src="https://saucelabs.com/browser-matrix/js-object-bee.svg" alt="Browser Matrix"></a>
</p>

object-bee.js is a lightweight, flexible library for manipulating plain-object data in JavaScript.

## Why?

Manipulating data may need a lot of conditional judgment in usual, and it would bring a great costs of maintenance to the our project, as below:

```javascript
function fixData (data) {
    if (data && data.info && data.info.name) { // mess!
        data.info['modify-name'] = data.info.name;
        delete data.info.name;
    }

    if (data && data.info && data.info.person && data.info.person.age) { // mess!
        delete data.info.person.age;
    }
}
```

To help improving maintainability and readability, `object-bee` access data by the structure of data itself, and deal with the value inner data only when the value exists —— just like bee finding flower :)

Rewrite the code above by `object-bee`:

```javascript
const bee = require('object-bee');

function fixData (data) {
    bee(data, {
        info: {
            name: bee.rename('modify-name'),
            person: {
                age: bee.remove()
            }
        }
    });
}
```

The code becomes more meaningful and readable.

## Installation

```
npm install object-bee -S
```

## Usage

Using function to manipulate data can contain more complex logic.

As object-bee iterating over all of key / value pairs, Handler function accepts each `value` and `key` as arguments, like `function (value, key) {}`, and the return value would replace the original value of data.

```javascript
const bee = require('object-bee');

data = {
    a: 1,
    b: 2,
    sum: -1
};

bee(data, {
    sum () {
        return this.a + this.b;
    }
});

data.detail.sum === 3; // true
```

Context provide those features as below：

- `this`: a reference to current data
- `this.$root`: a reference to root data

    ```javascript
    let data = {
        name: 'object-bee',
        detail: {
            bar: 'woo'
        }
    };

    bee(data, {
        detail: {
            foo () {
                this.bar === 'woo'; // true
                this.$root.name === 'object-bee'; // true
                this.$root.detail.bar === this.bar; // true
            }
        }
    })
    ```

- `this.$UNDEFINED`: `undefined` returned by function will be ignore, If you want replace the original value with `undefined`, you should return `this.$UNDEFINED` instead, for examples:

    ```javascript
    let data = {
        foo: 1,
        bar: 2
    };

    bee(data, {

        // no modify
        foo () {},

        // return 'this.$UNDEFINED' explicitly to assign undefined to data.bar
        bar () {
            return this.$UNDEFINED;
        }
    })
    // => { foo: 1, bar: undefined }
    ```

- `this.$config`: specify config inner function:

    ```javascript
    bee(data, {
        info () {
            this.$config({
                name: bee.rename('foo')
            });
        }
    });
    ```

- `this.$remove()`: support to remove data, see [action.remove](#actions) below.
- `this.$rename(newName)`: support to rename, see [action.rename](#actions) below.
- `this.$ensure()`: ensure current key to exist, see [action.ensure](#actions) below.
- `this.$mirror([path])`: reuse config, see [action.mirror](#actions) below.

    ```javascript
    bee(data, {
        foo () {
            this.$rename('bar');
            this.$remove();
            this.$ensure();
            this.$mirror();
        }
    });
    ```

## Actions

object-bee provide several shorthand to simplify the usage of function. There are 3 types of actions, use in value place, key place, or normal place.

### In value place

- `#remove`: remove current key from data.

    ```javascript
    bee(data, {
        unnecessaryKey: bee.remove()
    });
    ```

- `#ensure`: ensure the key exist no matter whether it is undefined or being removed.

    ```javascript
    bee({}, {
        newKey: bee.ensure()
    });
    // => { newKey: undefined }

    bee({}, {
        newKey: bee.ensure().remove() // #ensure has higher priority
    });
    // => { newKey: undefined }
    ```

- `#rename`: rename the key

    ```javascript
    bee(data, {
        bar: bee.rename('foo')
    });
    ```

- `#root`: get value by path string related to **root** data.

- `#data`: get value by path string related to **current** data:

    ```javascript
    let data = {
        info: {
            detail: {
                name: 'object-bee',
            },
            foo: '',
            bar: ''
        }
    };

    bee(data, {
        foo: bee.root('info.detail.name'),
        bar: bee.data('detail.name')
    });
    ```

    Valid paths for `#data` and `#root` can be:

    ```
    path
    path.path.path
    list[2].path.path[0]
    ```

- `#mirror([path])`: reuse config for recursive data, such as tree data, of which nodes have similar data structure. At this case, we can reuse config:

    ```javascript
    let treeData = {
        name: 'root',
        child: {
            name: 'node',
            child: {
                name: 'leaf'
            }
        }
    };

    bee(treeData, {
        name () {
            return 'foo';
        }
        child: bee.mirror()
    });
    ```

    `#mirror` can accept a `path` to specify target config.

- `#noop`: no-operation function used for placeholder.

### In key place

- `#keep`: same as `#ensure`, except it is used in computed key

    ```javascript
    bee({}, {
        [bee.keep('newKey')] () {
            return 'bar';
        }
    });
    // => { newKey: 'bar' }

    bee({}, {
        [bee.keep('newKey')]: bee.remove() // #keep has higher priority
    });
    // => { newKey: undefined }
    ```

- `#match`: match key by RegExp and String. It would apply **default** action to corresponding data of matching key.

    ```javascript
    bee({
        num1: 1,
        num2: 2
    }, {
        [bee.match(/^num\d$/)] () {
            return 0;
        }
    });
    // => { num1: 0, num2: 0 }
    ```

    > **default** action provided by `#match` has lowest priority than action of certain key.

- `#glob`: like `#match` method, except it matches keys by glob, more detail in [multimatch](https://github.com/sindresorhus/multimatch)

    ```javascript
    bee({
        letterA: '',
        letterB: ''
    }, {
        [bee.glob('letter*')] () {
            return 'Z';
        }
    });
    // => { letterA: 'Z', letterB: 'Z' }
    ```

    > **default** action provided by `#glob` has lowest priority than action of certain key.

### Normal action

- `#create`: by this method, object-bee would clone a new data, so original data would not be modified.

    ```javascript
    let newData = bee(data, {});
    newData !== data; // true
    ```

## Combination

All kinds of actions support to chain:

```javascript
bee(data, {
    foo: bee.remove().ensure().rename('bar')
});
```

As all actions has its corresponding method inner function , it is recommend to use function to deal with more complex logic:

```javascript
bee(data, {
    foo () {
        this.$ensure();
        this.$rename('bar');

        if (...) {
            this.$remove();
        }
    }
});
```

Applying actions and setting config at the same time:

```javascript
let data = {
    detail: {}
};

bee(data, {
    detail () {
        this.$rename('info');

        this.$config({
            foo: bee.ensure()
        });
    }
});
// => { info: { foo: undefined } }
```

The code above may be suspected of messing up structure. If we want to keep the structure readable, we can use `bee.CONFIG` in computed key and assign action to it:

```javascript
bee(data, {
    detail: {
        [bee.CONFIG]: bee.rename('info'),
        foo: bee.ensure();
    }
});

// or function
bee(data, {
    detail: {
        [bee.CONFIG] () {
            this.$rename('info')
        },
        foo: bee.ensure();
    }
});
```

This code do same thing as last code.
