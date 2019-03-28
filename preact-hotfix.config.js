require("dotenv").config();
import configSetup from "./parent.config"
const autoprefixer = require("autoprefixer");

export default (config, env, helpers) => {
  delete config.entry.polyfills;

  config = configSetup(config, env.production, helpers, false, "hotfix")

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
