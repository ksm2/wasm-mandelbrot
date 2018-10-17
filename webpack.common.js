const CopyWebpackPlugin = require('copy-webpack-plugin')
const HTMLPlugin = require('html-webpack-plugin')
const { DefinePlugin } = require('webpack')
const { resolve } = require('path')

module.exports = [true, false].map((useWasm) => ({
  entry: './src/main.ts',

  output: {
    filename: `${useWasm ? 'wasm' : 'javascript'}.[contenthash:6].js`,
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },

  resolve: {
    extensions: ['.ts', '.js', '.wasm'],
    alias: {
      mandelbrot: resolve(__dirname, 'pkg'),
    },
  },

  plugins: [
    new CopyWebpackPlugin([
      { from: '*', context: './assets/' },
    ]),

    new DefinePlugin({
      USE_WASM: JSON.stringify(useWasm),
    }),

    new HTMLPlugin({
      title: `${useWasm ? 'WebAssembly' : 'JavaScript'} Mandelbrot Generator`,
      filename: useWasm ? 'wasm.html' : 'javascript.html',
      template: './src/index.html',
    }),
  ],
}))
