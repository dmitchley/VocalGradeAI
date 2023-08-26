module.exports = {
  entry: "./src/main.js",
  target: "electron-main", // or 'electron-renderer' or 'electron-preload'
  module: {
    rules: require("./webpack.rules"),
  },
  externals: {
    electron: "commonjs electron",
    fs: "commonjs fs",
  },
};
