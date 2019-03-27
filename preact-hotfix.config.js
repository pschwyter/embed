require("dotenv").config();
import configSetup from "./parent.config"
const childProc = require('child_process');

export default (config, env, helpers) => {
  delete config.entry.polyfills;

  let { plugin } = helpers.getPluginsByName(config, "ExtractTextPlugin")[0];
  plugin.options.disable = true;

  config = configSetup(config, env.production, helpers, false, "hotfix")

  // This is to fix the issue where the compiled CSS classnames were given a localIdentName of
  // [local]__[hash], but this did not match the component class names
  const { loader: cssLoader } = helpers.getLoadersByName(config, "css-loader")[0];
  cssLoader.options.localIdentName = "[local]";

  const cssLoaders = helpers.getLoaders(config).filter(loader => {
    return loader.rule.test.toString() === `/\\.(css|less|s[ac]ss|styl)$/`.toString()
  });

  cssLoaders.forEach(loader => {
    loader.rule.loader = [
      "style-loader",
      {
        loader: "css-loader",
        options: {
          modules: true,
          localIdentName: "[local]__[hash:base64:5]",
          importLoaders: 1,
          sourceMap: false
        }
      }, {
        loader: "postcss-loader",
        options: {
          ident: "postcss",
          sourceMap: true,
          plugins: () => [require("autoprefixer")]
        }
      }
    ];
  });
};
