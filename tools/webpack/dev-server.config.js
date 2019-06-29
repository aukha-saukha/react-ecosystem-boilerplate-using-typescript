/* eslint-disable @typescript-eslint/no-var-requires */
const { resolve } = require('path');
const Webpack = require('webpack');

const { PORTS } = require('../../src/data/constants/app/config');

const distPathPublic = resolve(__dirname, '../../dist/wds');
const srcPath = resolve(__dirname, '../../src');

module.exports = {
  // Base directory for resolving entry points and loaders from configuration.
  context: srcPath,

  // Options related to webpack-dev-server
  devServer: {
    // Base path for the content.
    contentBase: distPathPublic,

    // Enable histroy API fallback
    historyApiFallback: true,

    // Enable HMR on the server
    // Important side note: Unlike the cli flag, this doesn't set
    // HotModuleReplacementPlugin. It needs to be set separately via plugins
    // if hot is part of config, not cli.
    hot: true,

    // Enables Hot Module Replacement without page refresh in case of build failures.
    hotOnly: true,

    // Embed the webpack-dev-server runtime into the bundle.
    inline: true,

    // Port
    port: PORTS.webpackDevServer,

    // The relative path from where bundle is served from memory.
    publicPath: '/js',

    // Display only errors to reduce the amount of output.
    stats: 'errors-only',
  },

  // Enable source map
  devtool: 'source-map',

  // Entry points
  entry: {
    // Client
    client: `${srcPath}/client`,

    // Vendor
    vendor: [
      'react',
      'react-dom',
      `webpack-dev-server/client?http://localhost:${PORTS.webpackDevServer}`,
    ],
  },

  // Mode
  mode: 'development',

  // Loaders
  module: {
    rules: [
      // .css, .sass, .scss loader
      {
        exclude: /node_modules/,
        test: /\.(c|sa|sc)ss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]--[hash:base64:5]',
              },
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },

      // .js, .ts, .tsx loader
      {
        exclude: /node_modules/,
        test: /\.(js|ts|tsx)$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: [
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-syntax-dynamic-import',
                '@loadable/babel-plugin',
                'react-hot-loader/babel',
              ],
              presets: [
                [
                  '@babel/preset-env',
                  {
                    modules: false,
                    targets: {
                      browsers: ['>0.2%', 'not dead', 'not ie <= 11', 'not op_mini all'],
                    },
                  },
                ],
                '@babel/preset-react',
                '@babel/preset-typescript',
              ],
            },
          },
        ],
      },
    ],
  },

  // Options related to how webpack emits results
  output: {
    // The filename template for entry chunks.
    filename: '[name].js',

    // The target directory where webpack should store the output file(s).
    path: `${distPathPublic}/js`,

    // Include comments in bundles with information about the contained modules.
    // Use in Dev environment only.
    pathinfo: true,

    // The url to the output directory resolved relative to the HTML page which
    // will be used to serve the bundled file(s).
    publicPath: 'js/',
  },

  // Plugins
  plugins: [
    // Enable Hot Module Replacement
    new Webpack.HotModuleReplacementPlugin(),
  ],

  // Resolve imports without extensions
  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx'],
  },
};
