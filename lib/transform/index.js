import format from 'lib/utils/formatter'
import falafel from 'falafel'
import _ from 'lodash'
import acorn from 'lib/utils/acorn'

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

  let transform = simple ? toSimple : toBuilder

  const jsxCodeBuilder = falafel(code, {parser: acorn, ...acornOptions}, transform(option))
  const result = `const render = () => (
    ${jsxCodeBuilder.toString()}
  )`

  return {
    code: format(result)
  }
}
