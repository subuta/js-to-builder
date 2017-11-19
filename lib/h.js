import _ from 'lodash'

import * as types from 'ast-types'
const {namedTypes: n, builders: b} = types

/** @jsx h */

const h = (tagName, props, ...children) => {
  // if component passed.
  if (_.isFunction(tagName)) {
    if (_.isArray(_.first(children))) {
      children = _.first(children)
    }
    return tagName({
      ...props,
      children
    })
  }
  return null
}

export default h
