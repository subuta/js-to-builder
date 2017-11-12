import _ from 'lodash'

import * as types from 'ast-types'
const {namedTypes: n, builders: b} = types

/** @jsx h */

const h = (tagName, props, ...children) => {
  // return `<${tagName}>${_.map(children, (child) => child || '').join('\n')}</${tagName}>`
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
