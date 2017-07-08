var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var pkg = require('./package.json');

// bundle dependencies in separate vendor bundle
var vendorPackages = Object.keys(pkg.dependencies).filter(function (el) {
    return el.indexOf('font') === -1; // exclude font packages from vendor bundle
});

/*
 * Default webpack configuration for development
 */
var config = {
    devtool: 'eval-source-map',
    cache: true,
    entry: {
        main: path.join(__dirname, "app", "App.js"),
        vendor: vendorPackages
    },
    output: {
        path: path.join(__dirname, "js"),
        filename: '[name].js',
        sourceMapFilename: "[file].map"
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.js' })
    ],
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015', 'react', 'stage-2']
            }
        }]
    }
}

/*
 * If bundling for production, optimize output
 */
if (process.env.NODE_ENV === 'production') {
    config.devtool = false;

    config.plugins = [
        new webpack.optimize.OccurenceOrderPlugin(),

        new webpack.optimize.UglifyJsPlugin({
            comments: false,
            compress: { warnings: false }
        }),
        new webpack.DefinePlugin({
            'process.env': { NODE_ENV: JSON.stringify('production') }
        })
    ];
};

module.exports = config;