// plugins/webpack/index.js
module.exports = function (context, options) {
  return {
    name: "cusotm-webpack-plugin",
    configureWebpack(config, isServer, utils) {
      return {
        mergeStrategy: { "devServer.proxy": "replace" },
        devServer: {
          proxy: {
            "/devbi.navigahub.com/api": {
              target: "https://devbi.navigahub.com/api/functions/",
              secure: false,
              changeOrigin: true,
              logLevel: "debug",
            },
          },
        },
      };
    },
  };
};
