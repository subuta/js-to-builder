import _ from 'lodash'
import { getBuildParams, getTypeName, getAllFields } from 'lib/utils/recast'

import * as types from 'ast-types'

const {builders: b} = types

const isArrayParam = (param) => /\[.*\]/.test(param)

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

  const fields = getAllFields(tagName)

  console.log(tagName);
  console.log(params);

  if (_.isFunction(renderFn)) {
    let args = _.map(params, (p) => {
      const name = fields[p].toString()
      const typeDef = name.split(':')

      // return prop if found by param
      if (props[p] !== undefined) return props[p]

      const hasChildren = children.length >= 1

      console.log(p);
      console.log(typeDef);
      console.log(props);
      console.log(children);

      if (isArrayParam(typeDef)) {
        // then return first child
        if (hasChildren) return [children.shift()]
        // return empty array if params allows array and value not found
        return []
      } else if (hasChildren) {
        return children.shift()
      }

      // throw error if no suitable value found.
      throw new Error(`Cannot find value for ${getTypeName(tagName)} ${name}`)
    })

    return renderFn.apply(this, [...args])
  }

  return null
}

export default h
