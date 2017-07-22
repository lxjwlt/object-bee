/**
 * @file queue all actions
 */

class QueueRegister {
    constructor (actions) {
        this.queue = actions;
    }
}

module.exports = function (bee) {
    return {
        check (beeItem) {
            return beeItem instanceof QueueRegister;
        },
        apply (beeItem, dataItem, key) {
            let result = {};
            let currentKey = key;
            let currentValue = dataItem;

            for (let queueBeeItem of beeItem.queue) {
                let register = bee.getRegister(queueBeeItem, currentValue);

                if (register) {
                    result = Object.assign(
                        {}, result,
                        register.apply.call(register, queueBeeItem, currentValue, currentKey)
                    );

                    currentKey = result.key;
                    currentValue = result.value;
                }
            }

            return result;
        },
        namespace: {
            queue (...actions) {
                return new QueueRegister(actions);
            }
        }
    };
};
