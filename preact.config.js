const path = require("path");

const { resolve } = path;

export default (config, env, helpers) => {
  delete config.entry.polyfills;
  config.output.filename = "[name].js";

  let { plugin } = helpers.getPluginsByName(config, "ExtractTextPlugin")[0];
  plugin.options.disable = true;

  if (env.production) {
    config.output.libraryTarget = "umd";
  }

  // Add loader for TypeScript
  config.module.loaders.push({
    test: /\.tsx?$/,
    exclude: /node_modules/,
    loaders: ["ts-loader"]
  });

  config.resolve.alias["preact-cli-entrypoint"] = resolve(process.cwd(), "src", "index");

  // This is to fix the issue where the compiled CSS classnames were given a localIdentName of
  // [local]__[hash], but this did not match the component class names
  const { loader: cssLoader } = helpers.getLoadersByName(config, "css-loader")[0];
  cssLoader.options.localIdentName = "[local]";

  config.resolve.alias.services = path.join(__dirname, "/src/services");
  config.resolve.alias.style = path.join(__dirname, "/src/style");
};
