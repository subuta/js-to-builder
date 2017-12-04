import prettier from 'prettier'

export const babylonOpts = {
  sourceType: 'module',
  strictMode: false,
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

// SEE: https://github.com/prettier/prettier/issues/3296
export default (code) => {
  const RULE = {
    tabWidth: 2,
    semi: false,
    printWidth: 80,
    singleQuote: true,
    bracketSpacing: true,
    originalText: code,
    parser (code, {babylon}) {
      return babylon(code, babylonOpts)
    }
  }
  return prettier.format(code, RULE)
}
