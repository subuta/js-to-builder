import format from 'lib/utils/formatter'
import falafel from 'falafel'
import _ from 'lodash'
import * as acorn from 'acorn'

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
  let builderCode = builderCodeBuilder.toString()

  let result = builderCode
  if (to === 'jsx') {
    const jsxCodeBuilder = falafel(code, {parser: acorn, ...acornOptions}, nodeToJsx(option))
    result = `const render = () => (
      ${jsxCodeBuilder.toString()}
    )`
  }

  return {
    code: format(result),
    builder: eval(builderCode)
  }
}
