require("dotenv").config();
import configSetup from "./parent.config"
const autoprefixer = require("autoprefixer");
const childProc = require('child_process');

export default (config, env, helpers) => {
  delete config.entry.polyfills;

  // let { plugin } = helpers.getPluginsByName(config, "ExtractTextPlugin")[0];
  // plugin.options.disable = true;

  config = configSetup(config, env.production, helpers, false, "hotfix")

  // [local]__[hash], but this did not match the component class names
  const { loader: cssLoader } = helpers.getLoadersByName(config, "css-loader")[0];
  cssLoader.options.localIdentName = "[local]";
  cssLoader.options.sourceMap = false;

  const { loader: postCSSLoader } = helpers.getLoadersByName(config, "postcss-loader")[0];
  postCSSLoader.options.sourceMap = false;


  const cssLoaders = helpers.getLoaders(config).filter(loader => {
    return loader.rule.test.toString() === `/\\.(css|less|s[ac]ss|styl)$/`.toString()
  });

  cssLoaders.forEach(loader => {
    loader.rule.loader = [
      "style-loader",
      {
        loader: "css-loader"
      },
      {
        loader: "postcss-loader",
        options: {
          ident: "postcss",
          sourceMap: true,
          plugins: () => autoprefixer()
        }
      }
    ];
  });
};
