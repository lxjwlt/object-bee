/**
 * @file entity value no need to transform
 */

class EntityRegister {

    constructor (value) {
        this.value = value;
    }

}

module.exports = {
    check (beeItem) {
        return beeItem instanceof EntityRegister;
    },
    apply (beeItem) {
        return {
            value: beeItem.value
        };
    },
    bee: {
        entity: function (value) {
            return new EntityRegister(value);
        }
    }
};
