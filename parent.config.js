const path = require("path");
const StyleExtHtmlWebpackPlugin = require("style-ext-html-webpack-plugin");
var S3Uploader = require("webpack-s3-uploader");
const StyleExtHtmlWebpackPlugin = require("style-ext-html-webpack-plugin");
const preactCliSvgLoader = require("preact-cli-svg-loader");
require("dotenv").config();
const { resolve } = path;


let configSetup = (config, production, helpers, staticFile, filepath) => {
  config.node.process = true;

  if (production){

    const CACHE_CONTROL_MAX_AGE_SECONDS = 48 * 60 * 60; // 48 hours

    const filename = filepath ? `embed.${filepath}.js` : 'embed.js'

    const cacheControl = staticFile ? `max-age=${CACHE_CONTROL_MAX_AGE_SECONDS}` : "no-cache"

    console.log(`Deploying filename: ${filename}`);

    config.output = {
      libraryTarget : "umd",
      filename: filename,
    };

    config.plugins.push(new StyleExtHtmlWebpackPlugin());

    config.plugins.push(new StyleExtHtmlWebpackPlugin());

    // S3 Upload
    config.plugins.push(new S3Uploader({
      include: /.*\.(js)/,
      exclude: /.*\.(png|json|icon|txt)/,
      s3Options: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_DEFAULT_REGION,
      },
      s3UploadOptions: {
        Bucket: process.env.AWS_BUCKET,
        CacheControl: cacheControl
      },
    }));
  }
  config.resolve.alias["preact-cli-entrypoint"] = resolve(process.cwd(), "src", "index");

  // Add loader for TypeScript
  config.module.loaders.push({
    test: /\.tsx?$/,
    exclude: /node_modules/,
    loaders: ["ts-loader"]
  });

  // Add loader for SVGs
  preactCliSvgLoader(config, helpers);

  // Directory aliases
  config.resolve.alias = Object.assign(
    {},
    {
      models: resolve(__dirname, "src/models/"),
      services: resolve(__dirname, "src/services/"),
      style: resolve(__dirname, "src/style/"),
      constants: resolve(__dirname, "src/constants/"),
      icons: resolve(__dirname, "static/icons/")
    },
    config.resolve.alias
  );

  return config
}

export default configSetup;