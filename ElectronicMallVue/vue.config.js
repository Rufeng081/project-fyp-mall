const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 9192,
    historyApiFallback: {
      disableDotRule: true,
      htmlAcceptHeaders: ['text/html', 'application/xhtml+xml', '*/*'],
    },
  },
})
