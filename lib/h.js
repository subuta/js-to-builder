import _ from 'lodash'
import icepick from 'icepick'

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

  if (_.isFunction(renderFn)) {
    let args = []
    let fromLast = false
    const frozenParams = icepick.freeze([...params]) // keep original params for indexOf.

    while (params.length) {
      let p = fromLast ? params.pop() : params.shift()
      const i = _.indexOf(frozenParams, p)

      if (p === undefined) continue

      const name = fields[p].toString()
      const typeDef = name.split(':')

      // return prop if found by param
      if (props[p] !== undefined) {
        args[i] = props[p]
        continue
      }

      const hasChildren = children.length >= 1
      const hasNext = params.length > 0

      if (isArrayParam(typeDef)) {
        if (hasNext) {
          // put param to params again and reverse search order.
          params.unshift(p)
          fromLast = true
          continue
        }

        // then return first child
        if (hasChildren) {
          args[i] = [children.shift()]
          continue
        }

        // return empty array if params allows array and value not found
        args[i] = []
        continue
      } else if (hasChildren) {
        args[i] = children.shift()
        continue
      }

      // throw error if no suitable value found.
      throw new Error(`Cannot find value for ${getTypeName(tagName)} ${name}`)
    }

    return renderFn.apply(this, [...args])
  }

  return null
}

export default h
