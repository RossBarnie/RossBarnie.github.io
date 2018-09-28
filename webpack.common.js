module.exports = {
  entry: "./_webpack/entry.js",
  output: {
    path: __dirname + "/assets/javascripts",
    filename: "bundle.js",
  },
  devServer: {
    contentBase: './_site'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-react", "@babel/preset-env"]
        }
      }
    ]
  }
};
