require("dotenv").config();
import configSetup from "./parent.config"

export default (config, env, helpers) => {
  delete config.entry.polyfills;

  let { plugin } = helpers.getPluginsByName(config, "ExtractTextPlugin")[0];
  plugin.options.disable = true;

  config = configSetup(config, env.production, helpers, false, "hotfix")

  // This is to fix the issue where the compiled CSS classnames were given a localIdentName of
  // [local]__[hash], but this did not match the component class names
  const { loader: cssLoader } = helpers.getLoadersByName(config, "css-loader")[0];
  cssLoader.options.localIdentName = "[local]";

  const cssLoaderRules = helpers.getRules(config).filter(rule => {
    return String(rule.rule.test) === String(/\.(css|less|s[ac]ss|styl)$/)
  });

  cssLoaderRules.forEach(rule => {
    rule.loader = null;
    rule.use = [
      {
        loader: "style-loader",
        options: {
          insertAt: 'top', //Insert style tag at top of <head>
          singleton: true, //this is for wrap all your style in just one style tag
        }
      },
      {
        loader: 'css-loader',
        options: {
          modules: true,
          localIdentName: '[local]__[hash:base64:5]',
          importLoaders: 1,
          sourceMap: true
        }
      }, {
        loader: 'postcss-loader',
        options: {
          ident: 'postcss',
          sourceMap: true
        }
      }
    ]
  })

  // const { loader: styleLoader } = helpers.getLoadersByName(config, "style-loader")[0];
  // cssLoader.options.insertAt = "top";
  // cssLoader.options.singleton = true;


};






