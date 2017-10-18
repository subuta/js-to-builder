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

  let builder = nodeToBuilder(option)
  if (to === 'jsx') {
    builder = nodeToJsx(option)
  }

  const codeBuilder = falafel(code, { parser: acorn, ...acornOptions }, builder)

  const result = codeBuilder.toString()

  return {
    code: format(result),
    builder: to === 'jsx' ? format(result) : eval(result)
  }
}
