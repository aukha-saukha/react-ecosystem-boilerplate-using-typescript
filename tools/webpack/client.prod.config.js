/* eslint-disable @typescript-eslint/no-var-requires */
const LoadablePlugin = require('@loadable/webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { resolve } = require('path');
const TerserPlugin = require('terser-webpack-plugin');

// Custom plugin to create required directories if they don't exist already
const CreateRequiredDirectoriesPlugin = require('./create-required-directories-plugin');

// Distribution base directory
const distBase = resolve(__dirname, '../../dist/prod');

// Various directories with path
const PATHS = {
  distPublic: `${distBase}/public`,
  distPublicCSS: `${distBase}/public/css`,
  distPublicJS: `${distBase}/public/js`,
  distPublicStats: `${distBase}/public/stats`,
  src: resolve(__dirname, '../../src'),
};

module.exports = {
  // Base directory for resolving entry points and loaders from configuration.
  context: PATHS.src,

  // Entry points
  entry: {
    // Client
    client: `${PATHS.src}/client`,
  },

  // Mode
  mode: 'production',

  // Loaders
  module: {
    rules: [
      // .css, .sass, .scss loader
      {
        exclude: /node_modules/,
        test: /\.(c|sa|sc)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]--[hash:base64:5]',
                mode: 'local',
              },
            },
          },
          {
            loader: 'sass-loader',
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
                'react-remove-properties',
              ],
              presets: [
                [
                  '@babel/preset-env',
                  {
                    forceAllTransforms: true,
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

  // Optimization
  optimization: {
    minimizer: [
      new OptimizeCSSAssetsPlugin({}),

      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false,
          },
        },
      }),
    ],

    splitChunks: {
      cacheGroups: {
        // Create a custom vendor chunk.
        vendor: {
          chunks: 'all',
          enforce: true,
          name: 'vendor',
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
        },
      },
    },
  },

  // Options related to how webpack emits results
  output: {
    // The filename template for entry chunks.
    filename: '[name].[chunkhash].js',

    // The target directory where webpack should store the output file(s).
    path: PATHS.distPublicJS,

    // The url to the output directory resolved relative to the HTML page which
    // will be used to serve the bundled file(s).
    publicPath: 'js/',
  },

  // Show warning if chunk size is too large
  performance: {
    hints: 'warning',
  },

  // Plugins
  plugins: [
    // Plugin to create required directories if they don't exist already.
    new CreateRequiredDirectoriesPlugin({
      dirs: [
        distBase,
        PATHS.distPublic,
        PATHS.distPublicCSS,
        PATHS.distPublicJS,
        PATHS.distPublicStats,
      ],
    }),

    new LoadablePlugin({
      // Manifest file name
      filename: `../stats/loadable-stats.json`,

      // Write assets to disk at given filename location
      writeToDisk: true,
    }),

    // Extract CSS to an exernal file
    new MiniCssExtractPlugin({
      filename: '../css/[name].[contenthash].css',
    }),
  ],

  // Resolve imports without extensions
  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx'],
  },
};
