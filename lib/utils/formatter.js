import parse from 'prettier/src/parser-babylon'
import { printAstToDoc } from 'prettier/src/printer'
import { printDocToString } from 'prettier/src/doc-printer'

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

  const ast = parse(code)
  const doc = printAstToDoc(ast, RULE)
  const result = printDocToString(doc, RULE)
  return result.formatted
}
