import _ from 'lodash'

import * as types from 'ast-types'

const {builders: b} = types
import { getBuildParams } from 'lib/utils/recast'

const h = function (tagName, props, ..._children) {
  const renderFn = b[tagName]
  const params = getBuildParams(tagName)

  // initialize props with empty object if not defined.
  if (!props) props = {}

  let children = (() => {
    // prefer props.children if defined
    if (props.children) return props.children
    // allow array style children.
    if (_.isArray(_.first(_children)) && _children.length === 1) return _.first(_children)
    // otherwise use default jsx children.
    return _children
  })()

  if (_.isFunction(renderFn)) {
    let args = _.map(params, (p) => {
      if (props[p]) return props[p]
      return children.shift()
    })
    if (tagName === 'program') {
      args = [args]
    }
    return renderFn.apply(this, args)
  }

  return null
}

export default h
