require("dotenv").config();
import configSetup from "./parent.config"
const childProc = require('child_process');

export default (config, env, helpers) => {
  delete config.entry.polyfills;

  let { plugin } = helpers.getPluginsByName(config, "ExtractTextPlugin")[0];
  plugin.options.disable = true;

  config = configSetup(config, env.production, helpers, false, "hotfix")

  let { plugin: htmlPlugin } = helpers.getPluginsByName(config, "HtmlWebpackPlugin")[0];
  htmlPlugin.options.minify = {
    collapseWhitespace: false,
    removeComments: false,
    removeRedundantAttributes: false,
    removeScriptTypeAttributes: false,
    removeStyleLinkTypeAttributes: false,
    useShortDoctype: false
  };
  htmlPlugin.options.cache = false;
  htmlPlugin.options.hash = true;
  htmlPlugin.options.inject = false;

  // This is to fix the issue where the compiled CSS classnames were given a localIdentName of
  // [local]__[hash], but this did not match the component class names
  const { loader: cssLoader } = helpers.getLoadersByName(config, "css-loader")[0];
  cssLoader.options.localIdentName = "[local]";

};
