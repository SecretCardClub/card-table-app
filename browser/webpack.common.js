const path = require("path");
const webpack = require('webpack')


module.exports = {
  entry: path.resolve(__dirname,  "index.js"),


  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
    ],
  },


  output: {
    filename: 'bundle.js',
    // path: path.resolve(__dirname, 'dist'),
    path: `/Users/ian/Code/JS/ReactNative/uneCarte/api/restServer/public`
  }
};