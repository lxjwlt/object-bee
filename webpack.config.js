const path = require('path');
const webpack = require('webpack');
const pkg = require('./package.json');
const isCoverage = process.env.NODE_ENV === 'coverage';
const isMin = process.env.NODE_ENV === 'min';

module.exports = function () {
    let plugins = [
        new webpack.BannerPlugin({
            banner: [
                `${pkg.name} v${pkg.version}`,
                `(c) 2017-present ${pkg.author}`,
                `Released under the ${pkg.license} license`,
                `${pkg.repository.url}`
            ].join('\n'),
            entryOnly: true
        })
    ];

    if (isMin) {
        plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                comments: new RegExp(`${pkg.name}\\sv\\d+\\.\\d+\\.\\d+`)
            })
        );
    }

    let config = {
        entry: './src/index.js',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: isMin ? `${pkg.name}.min.js` : `${pkg.name}.js`,
            library: 'bee',
            libraryTarget: 'umd'
        },
        module: {
            rules: [].concat(
                isCoverage ? {
                    test: /\.js$/,
                    include: path.resolve('src'),
                    loader: 'istanbul-instrumenter-loader'
                } : [],
                {
                    test: /\.js$/,
                    exclude: /(node_modules)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [['env', {
                                targets: {
                                    'ie': 9
                                },
                                loose: true
                            }]]
                        }
                    }
                }
            )
        },
        plugins: plugins,
        node: {
            Buffer: false,
            process: false,
            setImmediate: false
        }
    };

    if (isCoverage) {
        config.devtool = 'inline-cheap-module-source-map';
    }

    return config;
};
