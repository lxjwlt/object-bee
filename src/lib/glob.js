/**
 * @file wildcard matcher
 */

'use strict';

const escapeStringRegexp = require('escape-string-regexp');

function createRegExp (pattern) {
    const negated = pattern[0] === '!';

    if (negated) {
        pattern = pattern.slice(1);
    }

    pattern = escapeStringRegexp(pattern).replace(/\\\*/g, '.*');

    if (negated) {
        pattern = `(?!${pattern})`;
    }

    return new RegExp(`^${pattern}$`);
}

module.exports = (input, pattern) => {
    return createRegExp(pattern).test(input);
};
