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
        methods: {
            entityAll (data, config) {
                let actualConfig = util.copy(config);

                util.loop(actualConfig, config, ([actualConfigItem], configItem, key, [currentActualConfig]) => {
                    if (util.isPlainObject(configItem)) {
                        return;
                    }

                    currentActualConfig[key] = configItem instanceof EscapeRegister ?
                        configItem.value : bee.entity(configItem);
                });

                return bee(data, actualConfig);
            }
        },
        valueScenes: [
            {
                check (beeItem) {
                    return beeItem instanceof EntityRegister;
                },
                apply (beeItem) {
                    return {
                        value: beeItem.value
                    };
                },
                methods: {
                    entity (value) {
                        return new EntityRegister(value);
                    }
                }
            },
            {
                methods: {
                    escape: {
                        chain: false,
                        handler (value) {
                            return new EscapeRegister(value);
                        }
                    }
                }
            }
        ]
    };
};
