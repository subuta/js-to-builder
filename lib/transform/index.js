import format from 'lib/utils/formatter'
import falafel from 'falafel'
import _ from 'lodash'
import acorn from 'lib/utils/acorn'

import * as types from 'ast-types'
const {namedTypes: n, builders: b} = types

import nodeToBuilder from './nodeToBuilder'
import nodeToJsx from './nodeToJsx'

export default (code, option = {}) => {

  const {
    sourceType = 'module',
    to
  } = option

  const acornOptions = {
    sourceType
  }

  const builderCodeBuilder = falafel(code, {parser: acorn, ...acornOptions}, nodeToBuilder(option))
  const jsxCodeBuilder = falafel(code, {parser: acorn, ...acornOptions}, nodeToJsx(option))
  let builderCode = builderCodeBuilder.toString()

  let result = `const render = () => (
      ${jsxCodeBuilder.toString()}
    )`

  if (to === 'js') {
    result = builderCode
  }

  return {
    code: format(result),
    builder: eval(builderCode)
  }
}
