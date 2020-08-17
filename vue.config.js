module.exports = {
  publicPath: '.',
  devServer: {
    proxy: {
      '/echo-api': {
        target: 'https://sepeach.com/',
        ws: false,
        changeOrigin: true
      }
      // '/static': {
      //   target: 'https://sepeach.com/',
      //   ws: false,
      //   changeOrigin: true
      // }
    }
  }
}
