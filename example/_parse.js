import { print, parse } from 'recast'
import * as types from 'ast-types'
const {namedTypes: n, builders: b, visit, getFieldNames, getFieldValue} = types

// playground for parser

const code = `
  hoge();
`

const ast = parse(code)
console.log(ast.program)
