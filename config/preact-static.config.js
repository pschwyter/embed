/*
  Config file for CicleCI deploy for versioned Embed
*/
require("dotenv").config();
import configSetup from "./parent.config"
const childProc = require('child_process');

export default (config, env, helpers) => {
  delete config.entry.polyfills;

  let { plugin } = helpers.getPluginsByName(config, "ExtractTextPlugin")[0];
  plugin.options.disable = true;

  const miniCommitHash = childProc.execSync('git rev-parse HEAD')
    .toString()
    .substr(0, 8);

  config = configSetup(config, env.production, helpers, true, miniCommitHash)

  // This is to fix the issue where the compiled CSS classnames were given a localIdentName of
  // [local]__[hash], but this did not match the component class names
  const { loader: cssLoader } = helpers.getLoadersByName(config, "css-loader")[0];
  cssLoader.options.localIdentName = "[local]";

};
