require("dotenv").config();
import configSetup from "./parent.config"

export default (config, env, helpers) => {
  delete config.entry.polyfills;

  let { plugin: etp } = helpers.getPluginsByName(config, "ExtractTextPlugin")[0];
  etp.options.disable = true;
  
  // let { plugin: sehwp } = helpers.getPluginsByName(config, "ScriptExtHtmlWebpackPlugin")[0];
  // sehwp.options.disable = true;
  
  let { index } = helpers.getPluginsByName(config, 'CommonsChunkPlugin')[0]
  config.plugins.splice(index, 1)
  console.log(1111, config.plugins)

  config = configSetup(config, env.production, helpers, false, null)

  // This is to fix the issue where the compiled CSS classnames were given a localIdentName of
  // [local]__[hash], but this did not match the component class names
  const { loader: cssLoader } = helpers.getLoadersByName(config, "css-loader")[0];
  cssLoader.options.localIdentName = "[local]";

};

