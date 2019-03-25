require("dotenv").config();
import configSetup from "./parent.config"
var CspHtmlWebpackPlugin = require("csp-html-webpack-plugin");

export default (config, env, helpers) => {
  delete config.entry.polyfills;

  let { plugin: etp } = helpers.getPluginsByName(config, "ExtractTextPlugin")[0];
  etp.options.disable = true;
  
  config = configSetup(config, env.production, helpers, false, null)

  // [local]__[hash], but this did not match the component class names
  const { loader: cssLoader } = helpers.getLoadersByName(config, "css-loader")[0];
  cssLoader.options.localIdentName = "[local]";
  cssLoader.options.sourceMap = false;
};

