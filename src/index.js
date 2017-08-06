/**
 * @file object-hive entry file
 */

'use strict';

const hive = require('./hive');

hive.register(require('./registers/ensure'));
hive.register(require('./registers/entity'));
hive.register(require('./registers/function'));
hive.register(require('./registers/glob'));
hive.register(require('./registers/match'));
hive.register(require('./registers/noop'));
hive.register(require('./registers/object'));
hive.register(require('./registers/queue'));
hive.register(require('./registers/remove'));
hive.register(require('./registers/rename'));

module.exports = hive;
