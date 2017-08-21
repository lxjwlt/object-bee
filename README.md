<p align="center">
    <img src="/icon/logo.png" width="270" />
</p>

object-bee.js is a lightweight, flexible library for manipulating plain-object data in JavaScript.

## why?

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

The code becomes more meanful and readable.

## Installation

```
npm install object-bee -D
```

## Usage

Using function to manipulate data can contain more complex logic.

As object-bee iterating over all of key / value pairs, Handler function accepts each `value` and `key` as arguments, like `function (value, key) {}`.

Context provide those features as below：

- `this`: a reference to current data
- `this.$root`: a reference to root data

    ```javascript
    bee(data, {
        name: 'object-bee',
        detail: {
            bar: 'woo',
            foo () {
                this.bar === 'woo'; // true
                this.$root.name === 'object-bee'; // true
                this.$root.detail.bar === this.bar; // true
            }
        }
    })
    ```

- `this.$remove()`: support to remove data, see [action.remove]() below.
- `this.$rename(newName)`: support to rename, see [action.rename]() below.
- `this.$ensure()`: ensure current key to exist, see [action.ensure]() below.

    ```javascript
    bee(data, {
        foo () {
            this.$rename('bar');
            this.$remove();
            this.$ensure();
        }
    });
    ```

The return value of handler would replace the origin value of data.

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

## action

- create
- ensure
- entity
- glob

(To be continued)
