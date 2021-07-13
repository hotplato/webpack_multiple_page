const path = require('path')
const common = require('./webpack.config')
const { merge } = require('webpack-merge')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-cheap-module-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'src'),
    watchContentBase: true,
    inline: true,
    hot: true,
    host: 'localhost',
    port: 8080,
  },
})
