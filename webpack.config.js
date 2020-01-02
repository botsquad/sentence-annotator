const path = require('path');
const webpack = require('webpack');

const ROOT = path.resolve( __dirname, 'src' );
const DESTINATION = path.resolve( __dirname, 'dist' );

module.exports = {
  context: ROOT,

  entry: {
    'main': './main.tsx',
    'example': './example.tsx'
  },

  output: {
    filename: '[name].bundle.js',
    path: DESTINATION
  },

  resolve: {
    extensions: ['.ts', '.js', '.tsx'],
    modules: [
      ROOT,
      'node_modules'
    ]
  },

  module: {
    rules: [
      /****************
       * PRE-LOADERS
       *****************/
      {
        enforce: 'pre',
        test: /\.js$/,
        use: 'source-map-loader'
      },
/*
      {
        enforce: 'pre',
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: 'tslint-loader'
      },
*/
      /****************
       * LOADERS
       *****************/
      {
        test: /\.tsx?$/,
        exclude: [ /node_modules/ ],
        use: 'ts-loader',
      }
    ]
  },

  devtool: 'cheap-module-source-map',
  devServer: {}
};
