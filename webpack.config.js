// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);

import * as path from 'path'; 
import { fileURLToPath } from 'url';
import { dirname } from 'path';
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



export default {
  entry: {
    admin: "./src/js/pages/admin.js",
    profile: "./src/js/pages/profile.js",
    register: "./src/js/pages/register.js",
    findKindred: "./src/js/pages/findKindred.js",
    questions: "./src/js/pages/questions.js",
    recommendations: "./src/js/pages/recommendations.js",
    loggedInPage: "./src/js/pages/loggedInPage.js",
    regLoginErrors: "./src/js/modules/regLoginErrors.mjs",
    registerPlaceFinder: "./src/js/modules/registerPlaceFinder.mjs",
    register: "./src/js/pages/register.js"
  },

  // devtool: 'inline-source-map',

  mode: "production",
  // mode: "development",

  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, 'public/bundles'),
    clean: true
  },

  // plugins: [new MiniCssExtractPlugin()],

  // module: {
  //   rules: [
  //     {
  //       test: /\.css$/i,
  //       use: ['style-loader', 'css-loader']
  //       // use: [
  //       //   // {loader: "style-loader", options: {injectType: "linkTag"}},
  //       //   MiniCssExtractPlugin.loader,
  //       //   'css-loader'
  //       // ]
  //     }
  //   ]
  // }

  // optimization: {
  //   splitChunks: {
  //     chunks: "all",
  //   },
  // }

};