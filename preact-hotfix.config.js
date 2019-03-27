require("dotenv").config();
import configSetup from "./parent.config"

export default (config, env, helpers) => {
  delete config.entry.polyfills;

  let { plugin: etp } = helpers.getPluginsByName(config, "ExtractTextPlugin")[0];
  etp.options.disable = true;

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
      "style-loader/url",
      "css-loader"
    ];
  });
};






