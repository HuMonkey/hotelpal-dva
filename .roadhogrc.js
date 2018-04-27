'use strict';

const { name, version } = require('./package.json');

export default {
  "entry": "src/index.js",
  "publicPath": `//s.newscdn.cn/${name}/${version}/`,
  "env": {
    "development": {
      "extraBabelPlugins": [
        "dva-hmr",
        "transform-runtime"
      ]
    },
    "production": {
      "extraBabelPlugins": [
        "transform-runtime"
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
