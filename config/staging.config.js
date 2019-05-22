/*
 Dedicated config file for `deploy-test`
*/
const path = require("path");
const AWS = require('aws-sdk');
var S3Uploader = require("webpack-s3-uploader");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const preactCliSvgLoader = require("preact-cli-svg-loader");
const childProc = require('child_process');


require("dotenv").config();
const { resolve } = path;

const miniCommitHash = childProc.execSync('git rev-parse HEAD')
  .toString()
  .substr(0, 10);

const autoprefixer = require("autoprefixer");
const TEMPLATE_PATH = path.resolve(__dirname, '../src/index.ejs');
const ASSET_OUTPUT_PATH = path.resolve(__dirname, '../build/')
const jsFilename = `${miniCommitHash}.js`;
const htmlFilename = `${miniCommitHash}.html`;

const configSetup = (config, helpers) => {
  config.node.process = true;

  console.log(`Compiling: ${jsFilename} and ${htmlFilename}`);

  config.output = {
    libraryTarget : "umd",
    filename: jsFilename,
    path: ASSET_OUTPUT_PATH
  };

  config.plugins.push(
    new HtmlWebpackPlugin({
      filename: htmlFilename,
      template: TEMPLATE_PATH,
      scriptName: jsFilename
    })
  );

  // S3 Upload
  config.plugins.push(new S3Uploader({
    include: /.*\.(js|html)/,
    exclude: /.*\.(png|json|icon|txt)/,
    s3Options: {
      credentials: new AWS.SharedIniFileCredentials(),
      region: process.env.AWS_DEFAULT_REGION,
    },
    s3UploadOptions: {
      Bucket: process.env.AWS_BUCKET
    },
  }));

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

  export default (config, env, helpers) => {
    delete config.entry.polyfills;
    const ROOT_URL = `${process.env.ROOT_URL}`

    config = configSetup(config, helpers);
    console.log(`Deploying to: \x1b[34mhttps://${ROOT_URL}/${htmlFilename}\x1b[0m`);

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