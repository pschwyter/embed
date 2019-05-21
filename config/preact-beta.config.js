/*
  Config file for CicleCI deploy for beta
*/
require("dotenv").config();
import configSetup from "./parent.config"
const autoprefixer = require("autoprefixer");

export default (config, env, helpers) => {
  delete config.entry.polyfills;

  config = configSetup(config, env.production, helpers, false, "beta");

  const cssLoaders = helpers.getLoaders(config).filter(loader => {
    return loader.rule.test.toString() === `/\\.(css|less|s[ac]ss|styl)$/`.toString()
  });

  cssLoaders.forEach(loader => {
    loader.rule.loader = [
      "style-loader",
      {
        loader: "css-loader",
        options: {
          localIdentName: '[local]',
          importLoaders: 1,
          sourceMap: false
        }
      },
      {
        loader: "postcss-loader",
        options: {
          ident: "postcss",
          sourceMap: false,
          plugins: () => autoprefixer()
        }
      }
    ];
  });
};
