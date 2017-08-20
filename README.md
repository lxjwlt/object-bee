<p alian="center">
<img src="/icon/icon.png" align="center" />
</p>

# object-bee
object便捷工具

## Installation

```
npm install object-bee -D
```

## Usage

```javascript
const bee = require('object-bee');

bee(data, {
    name (value) {
        return bee(value, {
            age: 1
        });
    },
    man: bee.escape(function () {

    })
});
```
