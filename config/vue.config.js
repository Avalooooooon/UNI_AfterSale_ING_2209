// 解决跨域问题
module.exports = {
  devServer: {
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://www.bizspace.cn:8690',
        changeOrigin: true,
        pathRewrite: {
          '/api': ''
        }
      }
    }
  }
}
