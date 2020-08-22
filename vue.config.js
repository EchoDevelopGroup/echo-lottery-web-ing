function make(prefix) {
  return {
    [prefix]: {
      target: 'https://sepeach.com/',
      ws: false,
      changeOrigin: true
    }
  }
}

function makeList(list) {
  return list.reduce((prev, curr) => ({ ...prev, ...make(curr) }), {})
}

module.exports = {
  publicPath: '.',
  devServer: {
    proxy: {
      '/echo-api': {
        target: 'https://sepeach.com/',
        ws: false,
        changeOrigin: true
      },
      ...makeList([
        '/hdslb-i0',
        '/hdslb-i1',
        '/hdslb-i2',
        '/hdslb-i3',
        '/hdslb-i4'
      ])
      // '/static': {
      //   target: 'https://sepeach.com/',
      //   ws: false,
      //   changeOrigin: true
      // }
    }
  }
}
