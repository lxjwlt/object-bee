const path = require('path');
const webpack = require('webpack');

module.exports = function (env) {
    let plugins = [];

    if (env === 'min') {
        plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                comments: false
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
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [['env', {
                                targets: {
                                    'ie': 9
                                }
                            }]]
                        }
                    }
                }
            ]
        },
        plugins: plugins
    };
};
