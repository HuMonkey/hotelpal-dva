'use strict';

const { name, version } = require('./package.json');

export default {
  "entry": "src/index.js",
  "publicPath": `//static.hotelpal.cn/${version}/`,
  // "publicPath": `/`,
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
    "/test": {
      // "target": "http://v2.hotelpal.cn/",
      "target": "http://hotelpal.cn/",
      "changeOrigin": true,
      "pathRewrite": { "^/test": "" }
    }
  }
}

