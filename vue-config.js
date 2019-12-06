module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
  outputDir: "webapp",
  assetsDir: "assets",
  filenameHashing: false,
  lintOnSave: true,
  productionSourceMap: false,

  devServer: {
    //   host: "localhost",
    //   port: 8080,
    //   https: false,
    //   open: true,
    // proxy: 'http://39.104.164.162:8895/'
    // proxy: 'http://192.168.1.120:8895/'
  }
};
