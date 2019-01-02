export default (config, env, helpers) => {
  delete config.entry.polyfills;
  config.output.filename = "[name].js";

  let { plugin } = helpers.getPluginsByName(config, "ExtractTextPlugin")[0];
  plugin.options.disable = true;

  if (env.production) {
    config.output.libraryTarget = "umd";
  }

  const { loader: cssLoader } =
    helpers.getLoadersByName(config, 'css-loader')[0];
    
  // This is to fix the issue where the compiled CSS classnames were given a localIdentName of [local]__[hash], but this did not match the component class names
  cssLoader.options.localIdentName = '[local]';
};
