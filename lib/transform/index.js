import format from 'lib/utils/formatter'
// import falafel from 'falafel'
import _ from 'lodash'
import acorn from 'lib/utils/acorn'

import recast from 'recast'
import * as types from 'ast-types'
const {namedTypes: n, builders: b} = types

import toSimple from './toSimple'
import toBuilder from './toBuilder'

export default (code, option = {}) => {
  const {
    sourceType = 'module',
    simple = false
  } = option

  const acornOptions = {
    sourceType,
    ecmaVersion: 8, // to allow async/await
    plugins: {
      jsx: true
    }
  }

  let buildTransform = simple ? toSimple : toBuilder

  const ast = recast.parse(code)
  const transfom = buildTransform(option)

  // modify ast.
  types.visit(ast, {
    visitNode (path) {
      this.traverse(path)
      transfom(path)
    }
  })

  const jsxCode = recast.print(ast).code

  const result = `const render = () => (
    ${jsxCode}
  )`

  return {
    code: format(result)
  }
}
