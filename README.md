<p align="center">
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

let data = {
   a: 1,
   b: 2
   sum: 0
}

bee(data, {
    sum () {
        return this.a + this.b;
    }
});

data.sum === 3; // true
```
