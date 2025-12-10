const path = require('path')
const chalk = require('chalk')
const dotenvFlow = require('dotenv-flow')
const pkg = require('../package.json')
const { getEnvs, getDefineConstants, getCacheIdentifier } = require('./utils')

const BUILD_ENV = process.env.BUILD_ENV
const TARO_ENV = process.env.TARO_ENV
const BUILD_TARGET = process.env.npm_config_target

dotenvFlow.config({
  node_env: BUILD_ENV
})

const APP_ENVS = getEnvs()
const CONST_ENVS = {
  APP_NAME: pkg.app_name,
  APP_VERSION: pkg.version,
  APP_AUTH_PAGE: '/pages/auth/login',
  ...APP_ENVS
}

Object.keys(CONST_ENVS).forEach((key) => {
  console.log(chalk.green(`${key}=${CONST_ENVS[key]}`))
})

const config = {
  projectName: CONST_ENVS.APP_NAME,
  date: '2021-5-24',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [],
  defineConstants: getDefineConstants(CONST_ENVS),
  alias: {
    '@': path.join(__dirname, '../src')
  },
  sass: {
    resource: path.resolve(__dirname, '..', 'src/style/imports.scss')
  },
  copy: {
    patterns: [{ from: 'src/files/', to: `dist/` }],
    options: {}
  },
  framework: 'react',
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {}
      },
      url: {
        enable: true,
        config: {
          limit: 1024 // 设定转换尺寸上限
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    output: {
      filename: 'js/[name].[hash:8].js',
      chunkFilename: 'js/[name].[chunkhash:8].js'
    },
    miniCssExtractPluginOption: {
      filename: 'css/[name].[hash:8].css',
      chunkFilename: 'css/[id].[chunkhash:8].css'
    },
    router: {
      mode: 'browser'
    },
    devServer: {
      overlay: false
    },
    postcss: {
      autoprefixer: {
        enable: true,
        config: {}
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
