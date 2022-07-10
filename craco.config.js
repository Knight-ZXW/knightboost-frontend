const path = require('path')
const CracoLessPlugin = require('craco-less');
const CracoAntDesignPlugin = require("craco-antd");
const defaultThemeVars = require('antd/dist/default-theme')
module.exports = {
  webpack:{
    alias:{
      '@': path.resolve('src'),
    }
  },
  style: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')]
    }
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              hack: `true;@import "${require.resolve(
                'antd/lib/style/color/colorPalette.less'
              )}";`,
              ...defaultThemeVars,
              '@primary-color': '#1DA57A' },
            javascriptEnabled: true,
          },
        },
      },
    },
    { plugin: CracoAntDesignPlugin },
  ],

  devServer: (devServerConfig) => {
    devServerConfig.proxy = {
      '/api/': {
        // target: 'http://127.0.0.1:7001/v1',
        target: process.env.API_HOST,
        changeOrigin: true,
        pathRewrite: { '^/api/': '/' }
      },
      '/external-api/': {
        target: 'https://jsonplaceholder.typicode.com',
        changeOrigin: true,
        pathRewrite: { '^/external-api/': '/' }
      }
    }
    return devServerConfig
  }
}
