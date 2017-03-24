'use strict';

const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path');
const webpack = require('webpack');

const entryPath = path.join(__dirname, 'example/app.jsx')
const outputPath = path.join(__dirname, 'build')

const config = {
  entry: [
    entryPath
  ],

  output: {
    path: outputPath,
    filename: '[name].js',
  },

  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['stage-2', 'es2015', 'react'],
        plugins: [
          'react-require',
          [
            'babel-root-import',
            {'rootPathSuffix': 'src'}
          ]
        ]
      }
    }, {
      test: /\.sass$/,
      exclude: /node_modules/,
      loader: 'style-loader!css-loader!sass-loader'
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    }, {
      test: /\.(woff|ttf|eot|svg|png|jpg)$/,
      loader: 'url-loader'
    }],
    noParse: [
      /[\/\\]libphonenumber\.js$/
    ]
  },

  resolve: {
    extensions: ['.js', '.jsx']
  },

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      template: 'example/index.html',
      inject: 'body'
    })
  ],

  watchOptions: {
    poll: 1000
  }
};

module.exports = config;
