require("dotenv").config();
import configSetup from "./parent.config"

export default (config, env, helpers) => {
  delete config.entry.polyfills;

  // let { plugin } = helpers.getPluginsByName(config, "ExtractTextPlugin")[0];
  // plugin.options.disable = true;

  config = configSetup(config, env.production, helpers, false, "hotfix")

  // This is to fix the issue where the compiled CSS classnames were given a localIdentName of
  // [local]__[hash], but this did not match the component class names
  const { loader: cssLoader } = helpers.getLoadersByName(config, "css-loader")[0];
  cssLoader.options.localIdentName = "[local]";

};
