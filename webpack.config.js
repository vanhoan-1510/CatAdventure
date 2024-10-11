const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const WebpackObfuscator = require('webpack-obfuscator');
const isProduction = process.env.NODE_ENV === 'production';
module.exports = {
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
    },
    devtool: isProduction ? 'hidden-source-map' : 'eval-source-map',
    output: {
        filename: 'bundle.[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './assets/index.html',
            filename: 'index.html'
        }),
        ...(isProduction ? [
            new CopyPlugin({
                patterns: [
                    { from: 'assets/atlas', to: 'atlas' },
                    { from: 'assets/font', to: 'font' }
                    
                ]
            }),
            new WebpackObfuscator({
                optionsPreset: 'low-obfuscation',
                identifierNamesGenerator: 'mangled-shuffled',
                debugProtection: true,
                debugProtectionInterval: 0,
                ignoreImports: true,
                simplify: true,
                log: false,
            })
        ] : []),
    ],
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'assets'),
        },
        compress: true,
        port: 8080,
    }
};