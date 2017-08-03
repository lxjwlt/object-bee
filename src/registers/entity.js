/**
 * @file entity value no need to transform
 */

'use strict';

const util = require('../util');

class EntityRegister {

    constructor (value) {
        this.value = value;
    }

}

class EscapeRegister {

    constructor (value) {
        this.value = value;
    }

}

module.exports = function (bee) {
    return {
        check (beeItem) {
            return beeItem instanceof EntityRegister;
        },
        apply (beeItem) {
            return {
                value: beeItem.value
            };
        },
        bee: {
            entity (value) {
                return new EntityRegister(value);
            },
            escape (value) {
                return new EscapeRegister(value);
            },
            entityAll (data, config) {
                let actualConfig = util.copy(config);

                util.loop(actualConfig, config, ([actualConfigItem], configItem, key, [currentActualConfig]) => {
                    if (util.isObject(configItem)) {
                        return;
                    }

                    currentActualConfig[key] = configItem instanceof EscapeRegister ?
                        configItem.value : bee.entity(configItem);
                });

                return bee(data, actualConfig);
            }
        }
    };
};
