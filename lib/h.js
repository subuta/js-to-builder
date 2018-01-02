import _ from 'lodash'
import icepick from 'icepick'

import {
  getBuildParams,
  getTypeName,
  getAllFields,
  createMatcher
} from 'lib/utils/recast'

import * as types from 'ast-types'

const {builders: b} = types

const isOnlyBooleanParam = (param) => _.trim(param) === 'boolean'

const h = function (tagName, props, ..._children) {
  // initialize props with empty object if not defined.
  if (!props) props = {}

  // flatten and ignore `undefined`
  // FIXME: Make ignore whole falsy value at children except for literal is parent.
  const flattenAndFilter = (array) => _.reject(_.flattenDeep(array), (value) => value === undefined)

  let children = (() => {
    // allow array style children.
    if (_.isArray(_.first(_children)) && _children.length === 1) return flattenAndFilter(_.first(_children))
    // otherwise use default jsx children.
    if (!_.isEmpty(_children)) return flattenAndFilter(_children)
    // then use children from props.
    return props.children || []
  })()

  if (tagName === 'fragment') {
    return children
  }

  let renderFn = tagName
  if (_.isString(tagName)) {
    renderFn = b[tagName]

    const params = getBuildParams(tagName)
    const fields = getAllFields(tagName)

    let args = []
    let fromLast = false
    const frozenParams = icepick.freeze([...params]) // keep original params for get index.

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

      const matcher = createMatcher(typeDef[1])

      if (isOnlyBooleanParam(typeDef[1])) {
        // set false if type is boolean and no value found in props.
        args[i] = false
        continue
      } else if (matcher) {
        if (hasNext && fromLast && hasChildren) {
          // in case of type has more than one array fields(like TemplateLiteral)
          // filter matches and remove matched from children.
          args[i] = []
          _.each(children, (child, idx) => {
            if (!matcher(child)) return
            args[i].push(child)
            children.splice(idx, 1)
          })
          continue
        } else if (hasNext) {
          // put param to params again and reverse search order.
          params.unshift(p)
          fromLast = true
          continue
        }

        if (hasChildren) {
          args[i] = children
          continue
        }

        // return empty array if params allows array and value not found
        args[i] = []
        continue
      } else if (hasChildren) {
        args[i] = fromLast ? children.pop() : children.shift()
        continue
      }

      // throw error if no suitable value found.
      throw new Error(`Cannot find value for ${getTypeName(tagName)} ${name}`)
    }

    let builder = renderFn.apply(this, [...args])

    if (!props['comments']) {
      props['comments'] = []
    }

    const parseComment = (comment, leading, trailing) => {
      if (comment.match(/\/\/(.*)/)) {
        return b.commentLine(comment.match(/\/\/(.*)/)[1], leading, trailing)
      } else if (comment.match(/\/\*([\s\S]*)\*\//)) {
        return b.commentBlock(comment.match(/\/\*([\s\S]*)\*\//)[1], leading, trailing)
      }
    }

    // add comments
    if (props.leadingComments) {
      _.each(props.leadingComments, (comment) => props['comments'].push(parseComment(comment, true, false)))
    }

    if (props.trailingComments) {
      _.each(props.trailingComments, (comment) => props['comments'].push(parseComment(comment, false, true)))
    }

    if (props.es) {
      builder = b.expressionStatement(builder)
    }

    builder = {...builder, ...props} // merge extra props

    return builder
  } else {
    return renderFn({...props, children})
  }
}

export default h
