/**
 * @file escape value from any other process
 */

class EscapeRegister {

    constructor (value) {
        this.value = value;
    }

}

module.exports = {
    check (beeItem) {
        return beeItem instanceof EscapeRegister;
    },
    apply (beeItem) {
        return beeItem.value;
    },
    namespace: {
        escape: function (value) {
            return new EscapeRegister(value);
        }
    }
};
