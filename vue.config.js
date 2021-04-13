module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        'assets': '@/assets',
        'components': '@/components',
        'network': '@/network',
        'router': '@/router',
        'store': '@/store',
        'utils': '@/utils',
        'views': '@/views'
      }
    }
  },
  publicPath: './'
}
