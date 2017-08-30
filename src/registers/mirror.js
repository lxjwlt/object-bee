/**
 * @file mirror
 */

'use strict';

const util = require('../util');

class Mirror {
    constructor (path) {
        this.path = path;
    }
}

module.exports = {
    valueScenes: {
        name: 'mirror',
        check (beeItem) {
            return beeItem instanceof Mirror;
        },
        apply (beeItem, dataItem, key, currentBee, currentData, data, beeConfig) {
            let mirrorConfig = util.copy(util.path(beeConfig, beeItem.path));

            util.loopObject(mirrorConfig, (value, key, currentData) => {
                if (value instanceof Mirror) {
                    currentData[key] = new Mirror(value.path, dataItem);
                }
            });

            return {
                beeValue: mirrorConfig
            };
        },
        method (path, relativeData) {
            return new Mirror(path, relativeData);
        }
    }
};
