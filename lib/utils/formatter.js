import * as babylon from 'babylon'
import { printAstToDoc } from 'prettier/src/printer'
import { printDocToString } from 'prettier/src/doc-printer'

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

// FIXME: Replace below to `prettier.format` after they setup UMD bundle.
// SEE: https://github.com/prettier/prettier/issues/1867
// SEE: https://github.com/prettier/prettier/issues/3296
export default (code) => {
  const RULE = {
    tabWidth: 2,
    semi: false,
    printWidth: 80,
    singleQuote: true,
    bracketSpacing: true,
    originalText: code
  }

  // FIXME: Comment's are not included in result(`prettier.format` will resolve this issue.)
  const ast = babylon.parse(code, babylonOpts)
  const doc = printAstToDoc(ast, RULE)
  const result = printDocToString(doc, RULE)
  return result.formatted
}
