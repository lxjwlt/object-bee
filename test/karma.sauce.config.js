let baseConfig = require('./karma.base.config.js');

const customLaunchers = {

    // modern browser
    sl_chrome: {
        base: 'SauceLabs',
        browserName: 'chrome',
        platform: 'Windows 7'
    },
    sl_firefox: {
        base: 'SauceLabs',
        browserName: 'firefox'
    },
    sl_mac_safari: {
        base: 'SauceLabs',
        browserName: 'safari',
        platform: 'OS X 10.10'
    },

    // ie
    sl_ie_9: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 7',
        version: '9'
    },
    sl_ie_10: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 8',
        version: '10'
    },
    sl_ie_11: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 8.1',
        version: '11'
    },
    sl_edge: {
        base: 'SauceLabs',
        browserName: 'MicrosoftEdge',
        platform: 'Windows 10'
    }

};

module.exports = function (config) {
    let sauceConfig = Object.assign({}, baseConfig, {
        singleRun: true,
        browsers: Object.keys(customLaunchers),
        customLaunchers: customLaunchers,
        reporters: ['dots', 'saucelabs'],
        sauceLabs: {
            testName: 'object-bee.js unit tests',
            recordScreenshots: false
        },
        build: process.env.TRAVIS_BUILD_NUMBER || Date.now(),
        captureTimeout: 300000,
        browserNoActivityTimeout: 300000,
        plugins: baseConfig.plugins.concat([
            'karma-sauce-launcher'
        ])
    });

    config.set(sauceConfig);
};
