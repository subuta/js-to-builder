import format, { babylonOpts } from 'lib/utils/formatter'
import _ from 'lodash'

import recast from 'recast'
import * as types from 'ast-types'
import * as babylon from 'babylon'

const {namedTypes: n, builders: b} = types

import toSimple from './toSimple'
import toBuilder from './toBuilder'

export default (code, option = {}) => {
  const {
    simple = false
  } = option

  const recastOpts = {
    parser: {
      parse (source) {
        return babylon.parse(source, babylonOpts)
      }
    }
  }

  let transform = simple ? toSimple(option) : toBuilder(option)
  const ast = recast.parse(code, recastOpts)

  // modify ast.
  types.visit(ast, {
    visitNode (path) {
      this.traverse(path)
      transform(path)
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
