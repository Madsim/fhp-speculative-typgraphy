import path from 'path'
import { fileURLToPath } from 'url'

import HtmlWebpackPlugin from 'html-webpack-plugin'
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const config = (env, argv) => {
  const isDev = argv.mode !== 'production'

  return {
    entry: './src/index.jsx',
    output: {
      path: path.resolve(dirname, 'dist'),
      filename: isDev ? '[name].js' : '[name].[contenthash].js',
      publicPath: '/',
      clean: true
    },
    devtool: isDev ? 'eval-source-map' : 'source-map',
    resolve: {
      extensions: ['.js', '.jsx']
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          resolve: { fullySpecified: false },
          loader: 'babel-loader'
        },
        {
          test: /\.(woff2?|ttf|otf)$/,
          type: 'asset/resource'
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({ template: './src/index.html' }),
      isDev && new ReactRefreshWebpackPlugin()
    ].filter(Boolean),
    devServer: {
      port: 3000,
      hot: true,
      historyApiFallback: true,
      open: true
    }
  }
}

export default config
