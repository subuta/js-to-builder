import * as babylon from 'babylon'
import prettier from 'lib/utils/prettier'
import parserCreateError from 'prettier/src/parser-create-error'

export const babylonOpts = {
  sourceType: 'module',
  strictMode: true,
  allowImportExportEverywhere: true,
  allowReturnOutsideFunction: true,
  plugins: [
    'jsx',
    'flow',
    'estree',
    'objectRestSpread',
    'classProperties',
    'dynamicImport',
    'optionalChaining',
    'throwExpressions',
    'doExpressions',
    'decorators',
    'exportDefaultFrom',
    'exportNamespaceFrom',
    'asyncGenerators',
    'functionBind',
    'functionSent',
    'numericSeparator',
    'importMeta',
    'optionalCatchBinding',
    'optionalChaining',
    'classPrivateProperties',
    'pipelineOperator',
    'nullishCoalescingOperator'
  ]
}

// from: https://github.com/prettier/prettier/blob/master/src/parser-babylon.js
const parse = (text) => {
  let ast
  try {
    ast = babylon.parse(text, babylonOpts)
  } catch (originalError) {
    try {
      ast = babylon.parse(
        text,
        Object.assign({}, babylonOpts, {strictMode: false})
      )
    } catch (nonStrictError) {
      throw parserCreateError(
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
  return ast
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
      return parse(text)
    }
  })
}
