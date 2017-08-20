/**
 * @file object-bee entry file
 */

'use strict';

const bee = require('./bee');

bee.$install(require('./registers/create'));
bee.$install(require('./registers/ensure'));
bee.$install(require('./registers/entity'));
bee.$install(require('./registers/function'));
bee.$install(require('./registers/glob'));
bee.$install(require('./registers/match'));
bee.$install(require('./registers/noop'));
bee.$install(require('./registers/object'));
bee.$install(require('./registers/queue'));
bee.$install(require('./registers/remove'));
bee.$install(require('./registers/rename'));

module.exports = bee;
