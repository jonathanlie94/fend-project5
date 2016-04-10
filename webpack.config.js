var webpack = require('webpack');
var path = require('path');

var buildType = process.env.npm_config_type;

var providePlugin = new webpack.ProvidePlugin({
  $: 'jquery',
  classNames: 'classnames'
});

var uglifyJsPlugin = new webpack.optimize.UglifyJsPlugin();

var entry = './app/scripts/main.js';
var buildDir = 'build';

var plugins = [
  providePlugin
];

var config = {
  entry: entry,
  output: {
    path: path.join(__dirname, buildDir),
    filename: 'main.js'
  },
  debug: true,
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          cacheDirectory: true,
          presets: ['es2015']
        }
      },
      {
        test: /\.css$./,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(eot|woff|ttf|svg|gif)([\?]?.*)$/,
        loader: 'file-loader'
      }
    ]
  },
  resolve: {
    root: path.join(__dirname, 'app/scripts')
  },
  plugins: plugins
};

module.exports = config;
