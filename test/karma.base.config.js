let webpackConfig = Object.assign({}, require('../webpack.config')(), {
    devtool: 'inline-source-map'
});

module.exports = {
    frameworks: ['mocha'],
    reporters: ['mocha'],
    files: [
        '**/*.spec.js'
    ],
    preprocessors: {
        '**/*.spec.js': ['webpack', 'sourcemap']
    },
    webpack: webpackConfig,
    webpackMiddleware: {
        noInfo: true,
        stats: 'errors-only'
    },
    plugins: [
        'karma-mocha',
        'karma-mocha-reporter',
        'karma-sourcemap-loader',
        'karma-webpack'
    ]
};
