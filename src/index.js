/**
 * @file object-hive entry file
 */

'use strict';

const hive = require('./hive');

hive.install(require('./registers/create'));
hive.install(require('./registers/ensure'));
hive.install(require('./registers/entity'));
hive.install(require('./registers/function'));
hive.install(require('./registers/glob'));
hive.install(require('./registers/match'));
hive.install(require('./registers/noop'));
hive.install(require('./registers/object'));
hive.install(require('./registers/queue'));
hive.install(require('./registers/remove'));
hive.install(require('./registers/rename'));

module.exports = hive;
