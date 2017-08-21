/**
 * @file Event
 */

const util = require('./util');

class Event {
    constructor () {
        this.events = {};
    }

    on (hookName, func) {
        if (!util.isFunction(func)) {
            throw (new Error(`Expect handler of "${hookName}" listener to be Function`));
        }

        this.events[hookName] = util.makeArray(this.events[hookName]);
        this.events[hookName].push(func);
    }

    off (hookName, func) {
        let handlers = this.events[hookName];

        if (!handlers) {
            return false;
        }

        if (!func) {
            delete this.events[hookName];
            return true;
        }

        let index = handlers.indexOf(func);

        if (index >= 0) {
            handlers.splice(index, 1);
            return true;
        }

        return false;
    }

    emit (names) {
        let args = [...arguments].slice(1);

        names = names.split(/\s+/g);

        for (let name of names) {
            util.makeArray(this.events[name]).forEach((func) => func.apply(null, args));
        }
    }
}

module.exports = Event;
