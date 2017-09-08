/**
 * @file store the values returned from chaining call function
 */

class Chain {
    constructor (defaultResult) {
        this.results = [];

        if (defaultResult) {
            this.results.push(defaultResult);
        }
    }
}

Chain.setMethods = function (name, method) {
    Chain.prototype[name] = function () {
        this.results.push(method.apply(null, arguments));

        return this;
    };
};

module.exports = Chain;
