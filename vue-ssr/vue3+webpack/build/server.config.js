const path = require('path');
const nodeExternals = require('webpack-node-externals');
const { merge } = require('webpack-merge');
const baseConfig = require('./base.config');
/**
 * @type {import('webpack').Configuration}
 */
module.exports = merge(baseConfig, {
  target: 'node', // 指定打包的是node
  mode: 'development',
  entry: './server.js',
  output: {
    filename: 'server_bundle.js',
    path: path.resolve(__dirname, '../', 'dist/server')
  },
  externals: [nodeExternals()],
});
