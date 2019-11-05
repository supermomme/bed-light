module.exports = {
  devServer: {
    disableHostCheck: true,
    proxy: {
      '/api': {
        target: process.env.VUE_APP_API_URL,
        pathRewrite: { '^/api': '' }
      }
    }
  },
  transpileDependencies: [
    'vuetify'
  ]
}
