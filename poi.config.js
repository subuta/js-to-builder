const _ = require('lodash')
const path = require('path')

// setting for building docs
module.exports = (options, req) => ({
  entry: './docs-src/index.js',
  dist: 'docs',
  homepage: '/js-to-builder/',
  presets: [
    require('poi-preset-react')(options)
  ],

  transformModules: [
    'icepick',
    'prettier',
    'string-width',
    'ansi-regex',
    'ansi-styles',
    'is-fullwidth-code-point',
    'chalk'
  ],

  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },

  webpack (config) {
    config = _.assign(config, {
      devtool: 'cheap-module-source-map',
      node: {
        module: 'empty',
        fs: 'empty'
      }
    })
    return config
  }
})
