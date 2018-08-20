'use strict';

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: [
    './src/index.js'
  ],
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ['html-loader','html-formatter-loader']

      },
    ]
  },
  resolveLoader: {
    alias: {
      'html-formatter-loader': './src/loader.js'
    }
  },
  plugins: [
    new HtmlWebpackPlugin({template: './src/index.html'}),
  ]
};