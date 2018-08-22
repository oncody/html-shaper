'use strict';

const eslintConfig = require('oncody-eslint-config');

module.exports = {
  entry: [
    './index.js'
  ],
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: eslintConfig
      }
    ]
  }
};