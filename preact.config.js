require("dotenv").config();
import configSetup from "./parent.config"
var CspHtmlWebpackPlugin = require("csp-html-webpack-plugin");

export default (config, env, helpers) => {
  delete config.entry.polyfills;

  let { plugin: etp } = helpers.getPluginsByName(config, "ExtractTextPlugin")[0];
  etp.options.disable = true;
  
  config = configSetup(config, env.production, helpers, false, null)

  config.plugins.push(
    new CspHtmlWebpackPlugin({
      'base-uri': "'self'",
      'object-src': "'none'",
      'script-src': ["'unsafe-inline'", "'self'", "'unsafe-eval'"],
      'style-src': ["'unsafe-inline'", "'self'", "'unsafe-eval'"]
    }, {
      enabled: true,
      hashingMethod: 'sha256',
      hashEnabled: {
        'script-src': true,
        'style-src': true
      },
      nonceEnabled: {
        'script-src': true,
        'style-src': true
      }
    })
  )

  console.log(1111, env.production, config.plugins)

  // This is to fix the issue where the compiled CSS classnames were given a localIdentName of
  // [local]__[hash], but this did not match the component class names
  const { loader: cssLoader } = helpers.getLoadersByName(config, "css-loader")[0];
  cssLoader.options.localIdentName = "[local]";

};

