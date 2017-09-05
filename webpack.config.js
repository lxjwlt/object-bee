const path = require('path');
const webpack = require('webpack');
const pkg = require('./package.json');

module.exports = function (env) {
    let plugins = [
        new webpack.BannerPlugin({
            banner: [
                `${pkg.name} v${pkg.version}`,
                `(c) 2017-present ${pkg.author}`,
                `Released under the ${pkg.license} license`,
                `${pkg.repository.url}`,
            ].join('\n'),
            entryOnly: true
        })
    ];

    if (env === 'min') {
        plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                comments: new RegExp(`${pkg.name}\\sv\\d+\\.\\d+\\.\\d+`)
            })
        );
    }

    return {
        entry: './src/index.js',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: env === 'min' ? 'index.min.js' : 'index.js',
            library: 'bee',
            libraryTarget: 'umd'
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /(node_modules)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [['env', {
                                targets: {
                                    'ie': 9
                                }
                            }]],
                            plugins: ['transform-runtime']
                        }
                    }
                }
            ]
        },
        plugins: plugins,
        node: false
    };
};
