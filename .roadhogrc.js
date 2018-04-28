'use strict';

const { name, version } = require('./package.json');

export default {
  "entry": "src/index.js",
  "publicPath": `/`,
  "env": {
    "development": {
      "extraBabelPlugins": [
        "dva-hmr",
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
