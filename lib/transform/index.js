import format from 'lib/utils/formatter'
import _ from 'lodash'

import recast from 'recast'
import * as types from 'ast-types'

const {namedTypes: n, builders: b} = types

import toSimple from './toSimple'
import toBuilder from './toBuilder'

export default (code, option = {}) => {
  const {
    simple = false
  } = option

  let transfom = simple ? toSimple(option) : toBuilder(option)
  const ast = recast.parse(code)

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
