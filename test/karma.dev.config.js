const baseConfig = require('./karma.base.config.js');

module.exports = function (config) {
    let devConfig = Object.assign({}, baseConfig, {
        browsers: ['ChromeHeadless'],
        plugins: baseConfig.plugins.concat([
            'karma-chrome-launcher'
        ])
    });

    config.set(devConfig);
};
