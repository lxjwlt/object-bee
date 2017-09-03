/**
 * @file object is a default structure, some other register can use object as bee-item.
 */

'use strict';

const util = require('../util');
const configSymbol = util.beeSymbol('use of config');

module.exports = function (bee) {
    return {
        methods: {
            CONFIG: configSymbol
        },
        valueScenes: {
            name: 'config',
            check (config) {
                return util.isPlainObject(config);
            },
            apply (config) {
                let hasExtraConfig = config[configSymbol];

                if (!hasExtraConfig) {
                    return {
                        beeValue: config
                    };
                }

                let beeValues = [];

                if (hasExtraConfig) {
                    beeValues.push(config[configSymbol]);
                    delete config[configSymbol];
                }

                beeValues.push(config);

                return bee.$multiExecute(beeValues, ...[...arguments].slice(1));
            },
            method (config) {
                return config;
            }
        }
    };
};
