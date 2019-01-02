export default (config, env, helpers) => {
  delete config.entry.polyfills;
  config.output.filename = "[name].js";

  // let { plugin } = helpers.getPluginsByName(config, "ExtractTextPlugin")[0];
  // plugin.options.disable = true;

  if (env.production) {
    config.output.libraryTarget = "umd";
  }

  const { loader: cssLoader } =
		helpers.getLoadersByName(config, 'css-loader')[0];
  // loader.options.localIdentName = '[local]';
  cssLoader.options.localIdentName = '[local]';
  console.log(111, cssLoader);
};
