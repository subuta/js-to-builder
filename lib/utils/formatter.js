import * as babylon from 'babylon'
import { printAstToDoc } from 'prettier/src/printer'
import { printDocToString } from 'prettier/src/doc-printer'
import createError from 'prettier/src/parser-create-error'

// https://github.com/prettier/prettier/pull/1940
// modified from to allow estree plugin https://github.com/prettier/prettier/blob/master/src/parser-babylon.js

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

// use prettier source code directory for only include browser-compatible feature..
// see: https://github.com/prettier/prettier/issues/1867

export default (code) => {
  // format code with 2 tab.
  // https://github.com/prettier/prettier#options

  const RULE = {
    tabWidth: 2,
    semi: false,
    printWidth: 80,
    singleQuote: true,
    bracketSpacing: true,
    originalText: code
  }

  let ast
  try {
    ast = babylon.parse(code, babylonOpts)
  } catch (originalError) {
    try {
      ast = babylon.parse(
        code,
        Object.assign({}, babylonOpts, {strictMode: false})
      )
    } catch (nonStrictError) {
      throw createError(
        // babel error prints (l:c) with cols that are zero indexed
        // so we need our custom error
        originalError.message.replace(/ \(.*\)/, ''),
        {
          start: {
            line: originalError.loc.line,
            column: originalError.loc.column + 1
          }
        }
      )
    }
  }
  delete ast.tokens

  const doc = printAstToDoc(ast, RULE)
  const result = printDocToString(doc, RULE)
  return result.formatted
}
