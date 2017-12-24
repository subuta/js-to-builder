import * as babylon from 'babylon'
import prettier from 'lib/utils/prettier'

export const babylonOpts = {
  sourceType: 'module',
  strictMode: false,
  tokens: false,
  plugins: [
    'jsx',
    'flow',
    'estree',
    'objectRestSpread',
    'classProperties',
    'dynamicImport',
    'optionalChaining',
    'throwExpressions'
  ]
}

export default (code) => {
  const RULE = {
    tabWidth: 2,
    semi: false,
    printWidth: 80,
    singleQuote: true,
    cursorOffset: -1,
    rangeStart: 0,
    rangeEnd: Infinity
  }

  return prettier.format(code, {
    ...RULE,
    parser (text) {
      return babylon.parse(text, babylonOpts)
    }
  })
}
