const path = require('path');
const { merge } = require('webpack-merge');
const baseConfig = require('./base.config');

/**
 * @type {import('webpack').Configuration}
 */

module.exports = merge(baseConfig, {
  target: 'web',
  mode: 'development',
  entry: './client.js',
  output: {
    filename: 'client_bundle.js',
    path: path.resolve(__dirname, '../', 'dist/client')
  },
});
