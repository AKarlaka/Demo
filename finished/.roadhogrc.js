export default {
  entry: "src/entry/*.js",
  disableCSSModules: false,
  multipage: true,
  hash: true,
  autoprefixer: {
    browsers: [
      "last 2 versions"
    ]
  },
  env: {
    development: {
      extraBabelPlugins: [
        "dva-hmr",
        "transform-runtime",
        ["import", { "libraryName": "antd", "style": true }]
      ]
    },
    production: {
      extraBabelPlugins: [
        "transform-runtime",
        "dva-hmr",
        ["import", { "libraryName": "antd", "style": "css" }]
      ]
    }
  },
  /**
   * 调用哪个接口
   */
  proxy: {
    "/api/": {
      "target": "http://admin.dev.choicesaas.cn",
      "changeOrigin": true
    },
    "/apiTakeout/": {
      "target": "http://admin.dev.choicesaas.cn",
      "changeOrigin": true
    },
    "/plAdmin": {
      "target": "http://admin.dev.choicesaas.cn",
      "changeOrigin": true,
    }
  }
}
