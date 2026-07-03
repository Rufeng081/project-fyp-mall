const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  pages: {
    index: {
      title: 'R Mall | FYP E-Commerce System',
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
    },
  },
  transpileDependencies: true,
  devServer: {
    port: 9192,
    historyApiFallback: {
      disableDotRule: true,
      htmlAcceptHeaders: ['text/html', 'application/xhtml+xml', '*/*'],
    },
  },
})
