'use strict';

const { name, version } = require('./package.json');

export default {
  "entry": "src/index.js",
  "publicPath": `/`,
  "env": {
    "development": {
      "extraBabelPlugins": [
        "dva-hmr",
        "transform-runtime",
        ["import", { "libraryName": "antd", "style": "css" }]
      ]
    },
    "production": {
      "extraBabelPlugins": [
        "transform-runtime",
        ["import", { "libraryName": "antd", "style": "css" }]
      ]
    }
  },
  "proxy": {
    "/api": {
      "target": "http://hotelpal.cn/",
      "changeOrigin": true,
      "pathRewrite": { "^/api": "" }
    }
  }
}

