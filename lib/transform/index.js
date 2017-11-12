import format from 'lib/utils/formatter'
import falafel from 'falafel'
import _ from 'lodash'
import acorn from 'lib/utils/acorn'

import * as types from 'ast-types'
const {namedTypes: n, builders: b} = types

import nodeToJsx from './nodeToJsx'

export default (code, option = {}) => {
  const {
    sourceType = 'module'
  } = option

  const acornOptions = {
    sourceType
  }

  const jsxCodeBuilder = falafel(code, {parser: acorn, ...acornOptions}, nodeToJsx(option))
  const result = `const render = () => (
    ${jsxCodeBuilder.toString()}
  )`

  return {
    code: format(result)
  }
}
