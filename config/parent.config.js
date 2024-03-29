/*
This file is used by ff files, each responsible for:
 - preact-beta.config.js => CicleCI deploy for beta
 - preact-hotfix.config.js => CicleCI deploy for hotfixes
 - preact-static.config.js => CicleCI deploy for versioned Embed
 - preact.config.js => CicleCI deploy main versionless Embed

The above listed files generate their configurations with `configSetup`
*/
const path = require("path");
var S3Uploader = require("webpack-s3-uploader");
const preactCliSvgLoader = require("preact-cli-svg-loader");
const HtmlWebpackPlugin = require('html-webpack-plugin');
require("dotenv").config();
const { resolve } = path;

const TEMPLATE_PATH = path.resolve(__dirname, '../src/index.ejs');
const ASSET_OUTPUT_PATH = path.resolve(__dirname, '../build/');
const JS_ONLY = /.*\.(js)/;
const JS_AND_HTML = /.*\.(js|html)/;

const generateAWSS3Options = () => {
  return {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_DEFAULT_REGION,
  };
};

const generateAWSS3UploadOptions = (cacheControl) => {
  return {
    Bucket: process.env.AWS_BUCKET,
    CacheControl: cacheControl
  };
};

const getAWSIncludeOption = () => {
  return JS_ONLY;
}

const getWebpackHTMLConfig = () => {
  return {
    filename: `index.html`,
    template: TEMPLATE_PATH
  }
}

const getAWSConfig = (cacheControl) => {
  return {
    include: getAWSIncludeOption(),
    exclude: /.*\.(png|json|icon|txt)/,
    s3Options: generateAWSS3Options(),
    s3UploadOptions: generateAWSS3UploadOptions(cacheControl)
  }
}


const configSetup = (config, production, helpers, staticFile, filepath) => {
  config.node.process = true;

  if (production) {

    const CACHE_CONTROL_MAX_AGE_SECONDS = 48 * 60 * 60; // 48 hours

    const jsFilename = filepath ? `embed.${filepath}.js` : 'embed.js';

    const cacheControl = staticFile ? `max-age=${CACHE_CONTROL_MAX_AGE_SECONDS}` : "no-cache";

    console.log(`Deploying filename: ${jsFilename}`);

    config.output = {
      libraryTarget : "umd",
      filename: jsFilename,
      path: ASSET_OUTPUT_PATH,
    };

    config.plugins.push(
      new HtmlWebpackPlugin(getWebpackHTMLConfig())
    );

    // S3 Upload
    config.plugins.push(new S3Uploader(getAWSConfig(cacheControl)));
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
      models: resolve(__dirname, "../src/models/"),
      services: resolve(__dirname, "../src/services/"),
      style: resolve(__dirname, "../src/style/"),
      constants: resolve(__dirname, "../src/constants/"),
      icons: resolve(__dirname, "../static/icons/")
    },
    config.resolve.alias
  );

  return config
}

export default configSetup;
