/**
 * @file reuse config
 */

'use strict';

const util = require('../util');

class Mirror {
    constructor (path) {
        this.path = path;
        this.config = null;
    }
}

module.exports = {
    valueScenes: {
        name: 'mirror',
        check (beeItem) {
            return beeItem instanceof Mirror;
        },
        apply (beeItem, dataItem, key, currentBee, currentData, data, beeConfig) {
            if (!beeItem.config) {
                let mirrorConfig = util.path(beeConfig, beeItem.path);

                beeItem.config = (mirrorConfig);
            }

            return {
                beeValue: util.copy(beeItem.config)
            };
        },
        method (path) {
            return new Mirror(path);
        }
    }
};
