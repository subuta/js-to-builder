import format, { babylonOpts } from 'lib/utils/formatter'
import _ from 'lodash'

import recast from 'recast'
import * as types from 'ast-types'
import * as babylon from 'babylon'

import toBuilder from './toBuilder'
import toSimple from './toSimple'

const {namedTypes: n, builders: b} = types

export const parse = (code, option = {}) => {
  return recast.parse(code, {
    parser: {
      parse (source) {
        return babylon.parse(source, babylonOpts)
      }
    }
  })
}

export default (code, option = {}) => {
  const {
    simple = false
  } = option

  let ast = code

  // if raw javascript snippets passed.
  if (_.isString(code)) {
    ast = parse(code, option)
  }

  // return if ast cannot parsed.
  if (!ast) return

  let transform = simple ? toSimple(option) : toBuilder(option)

  // modify ast.
  types.visit(ast, {
    visitComment (path) {
      this.traverse(path)
      transform(path)
    },

    visitNode (path) {
      this.traverse(path)
      transform(path)
    }
  })

  const jsxCode = recast.print(ast).code

  const result = `
    /** @jsx h */
    // const h = require('js-to-builder').h // use h from js-to-builder.
    
    const render = () => (
      ${jsxCode}
    )
  `

  return {
    code: format(result)
  }
}
