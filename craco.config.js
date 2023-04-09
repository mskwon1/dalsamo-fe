const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const CracoEnvPlugin = require('craco-plugin-env')

module.exports = {
  plugins: [
    {
      plugin: {
        overrideWebpackConfig: ({ webpackConfig }) => {
          webpackConfig.resolve.plugins.push(new TsconfigPathsPlugin({}));
          return webpackConfig;
        }
      }
    },
    {
      plugin: CracoEnvPlugin,
      options: {
        variables: {}
      }
    }
  ]
};