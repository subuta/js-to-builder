module.exports = (options, req) => ({
  entry: './docs-src/index.js',
  dist: 'docs',
  presets: [
    require('poi-preset-react')(options)
  ]
})
