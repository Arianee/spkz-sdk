const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: path.join(__dirname, 'examples/metamask/main.ts'),
  output: {
    path: path.join(__dirname, 'examples/dist/'),
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      assert: require.resolve('assert/'),
      http: require.resolve('stream-http'),
      os: require.resolve('os-browserify/browser'),
      https: require.resolve('https-browserify')
    }
  },
  plugins: [new HtmlWebpackPlugin({
    template: path.join(__dirname, 'examples/metamask/index.html'),
    filename: path.join(__dirname, 'examples/dist/index.html')
  }),
  new webpack.ProvidePlugin({
    process: 'process/browser'
  }),
  new webpack.ProvidePlugin({
    Buffer: ['buffer', 'Buffer']
  })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'examples/dist')
    },
    watchFiles: ['src/**/*.ts', 'examples/metamask/**/*'],
    port: 4200,
    liveReload: true,
    client: {
      overlay: { errors: true, warnings: false },
      progress: true
    }

  }
};
