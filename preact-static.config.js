const path = require("path");
var S3Uploader = require('webpack-s3-uploader')
require("dotenv").config();
const { resolve } = path;
const childProc = require('child_process');

export default (config, env, helpers) => {
  delete config.entry.polyfills;
  config.output.filename = "[name].js";

  let { plugin } = helpers.getPluginsByName(config, "ExtractTextPlugin")[0];
  plugin.options.disable = true;

  if (env.production) {

    const miniCommitHash = childProc.execSync('git rev-parse HEAD')
    .toString()
    .substr(0, 8);

    config.output = {
      libraryTarget : "umd",
      filename: `embed.${miniCommitHash}.js`,
    }

    //S3 Upload
    config.plugins.push(new S3Uploader({
      include: /.*\.(js)/,
      exclude: /.*\.(png|json|icon|txt)/,
      s3Options: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
      },
      s3UploadOptions: {
        Bucket: process.env.AWS_BUCKET
      },
    }));
  }

  // Add loader for TypeScript
  config.module.loaders.push({
    test: /\.tsx?$/,
    exclude: /node_modules/,
    loaders: ["ts-loader"]
  });

  // This is to fix the issue where the compiled CSS classnames were given a localIdentName of
  // [local]__[hash], but this did not match the component class names
  const { loader: cssLoader } = helpers.getLoadersByName(config, "css-loader")[0];
  cssLoader.options.localIdentName = "[local]";

  // Directory aliases
  config.resolve.alias = Object.assign(
    {},
    {
      services: resolve(__dirname, "src/services/"),
      style: resolve(__dirname, "src/style/")
    },
    config.resolve.alias
  );
};
