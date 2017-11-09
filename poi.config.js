module.exports = (options, req) => ({
  entry: './docs-src/index.js',
  dist: 'docs',
  homepage: '/js-to-builder/',
  presets: [
    require('poi-preset-react')(options)
  ]
})
