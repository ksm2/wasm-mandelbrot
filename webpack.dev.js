const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = common.map(config => merge(config, {
  mode: 'development',

  devtool: 'inline-source-map',

  devServer: {
    contentBase: './dist',
    host: '192.168.113.141',
  },
}))
