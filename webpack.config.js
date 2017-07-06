var webpack = require("webpack");
var path = require("path");

var DEV = path.resolve(__dirname, "project/dev");
var OUTPUT = path.resolve(__dirname, "project/static/js");

var config = {
  entry: DEV + "/App.jsx",
  output: {
    path: OUTPUT,
    filename: "client.js"
  },
  module: {
    loaders: [{
        include: DEV,
        loader: "babel-loader",
    }]
  }
};

module.exports = config;
