'use strict;';

const crypto = require('crypto');
const crypto_orig_createHash = crypto.createHash;
crypto.createHash = (algorithm) => crypto_orig_createHash(algorithm == 'md4' ? 'sha256' : algorithm);

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const config = {
    entry: {
        main: './src/app/index.tsx',
    },
    output: {
        filename: '[name].[chunkhash].js',
        path: path.resolve(__dirname, '../../dist/app'),
        publicPath: './',
        clean: true
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                }
            }
        },
        runtimeChunk: 'single'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json'],
        alias: {
            react: require.resolve('react'),
            'argo-ui': path.resolve(__dirname, '../../node_modules/argo-ui/src'),
            'assets': path.resolve(__dirname, '../../dist/app/assets')
        },
        fallback: {
            crypto: false
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                            configFile: path.resolve(__dirname, './tsconfig.json')
                        }
                    }
                ],
                exclude: /node_modules\/(?!argo-ui)/
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: require('sass'),
                            sassOptions: {
                                includePaths: [path.resolve(__dirname, '../../node_modules')]
                            }
                        }
                    }
                ]
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(woff2?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                type: 'asset',
                generator: {
                    filename: 'assets/fonts/[name][ext]'
                }
            },
            {
                test: /\.mjs$/,
                include: /node_modules/,
                type: 'javascript/auto'
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            SYSTEM_INFO: JSON.stringify({
                version: process.env.VERSION || 'latest',
            })
        }),
        new HtmlWebpackPlugin({
            template: 'src/app/index.html'
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'node_modules/@fortawesome/fontawesome-free/webfonts',
                    to: 'assets/fonts',
                    noErrorOnMissing: true
                },
                {
                    from: 'node_modules/argo-ui/src/assets/fonts',
                    to: 'assets/fonts',
                    noErrorOnMissing: true
                },
                {
                    from: 'src/assets',
                    to: 'assets',
                    noErrorOnMissing: true
                }
            ]
        })
    ]
};

module.exports = config;
