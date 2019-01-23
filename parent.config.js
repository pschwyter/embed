const path = require("path");
var S3Uploader = require('webpack-s3-uploader')
require("dotenv").config();
const { resolve } = path;


let configSetup = (config, production, static_file, filepath) =>{

  if (production){

    const CACHE_CONTROL_MAX_AGE_SECONDS = 48 * 60 * 60; // 48 hours

    const filename = filepath ? `embed.${filepath}.js` : 'embed.js'

    const cacheControl = static_file ? `max-age=${CACHE_CONTROL_MAX_AGE_SECONDS}` : "no-cache"
    config.output = {
      libraryTarget : "umd",
      filename: filename,
    }

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

  // Add loader for TypeScript
  config.module.loaders.push({
    test: /\.tsx?$/,
    exclude: /node_modules/,
    loaders: ["ts-loader"]
  });

  // Directory aliases
  config.resolve.alias = Object.assign(
    {},
    {
      services: resolve(__dirname, "src/services/"),
      style: resolve(__dirname, "src/style/")
    },
    config.resolve.alias
  );

  return config
}

export default configSetup;