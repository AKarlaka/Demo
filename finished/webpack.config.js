const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const { version } = require('./package.json');

module.exports = (webpackConfig, env) => {
  const production = env === 'production';
  console.log('production:', production);
  if (production) {
    webpackConfig.plugins.push(
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false,
      })
    )
  }
  // FilenameHash
  webpackConfig.output.chunkFilename = '[name].[chunkhash].js';

  webpackConfig.plugins = webpackConfig.plugins.concat([
    new CopyWebpackPlugin([
      {
        from: 'public',
        to: production ? '../' : webpackConfig.output.outputPath,
      },
    ]),
    new HtmlWebpackPlugin({
      template: `${__dirname}/src/index.ejs`,
      filename: production ? './index.html' : 'index.html',
      minify: production ? {
        collapseWhitespace: true,
      } : null,
      hash: true,
    }),
    new webpack.DefinePlugin({
      BUILD_MODE: JSON.stringify(process.env.BUILD_MODE),
    }),
  ]);
  return webpackConfig;
};
