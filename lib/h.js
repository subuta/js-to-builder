import _ from 'lodash'

import * as types from 'ast-types'
const {namedTypes: n, builders: b, getFieldNames, getBuilderName, Type} = types

import { getTypeName, getBuildParams } from 'lib/utils/recast'

const h = (tagName, props, ..._children) => {
  // if component passed.
  tagName /*?*/
  const nodeType = getTypeName(tagName) /*?*/
  const node = n[nodeType] /*?*/
  const builder = b[tagName] /*?*/

  nodeType /*?*/
  getBuildParams(nodeType) /*?*/

  // const renderFn = builtinComponents[tagName] || tagName
  //
  // // initialize props with empty object if not defined.
  // if (!props) props = {}
  //
  // let children = (() => {
  //   // prefer props.children if defined
  //   if (props.children) return props.children
  //   // allow array style children.
  //   if (_.isArray(_.first(_children)) && _children.length === 1) return _.first(_children)
  //   // otherwise use default jsx children.
  //   return _children
  // })()
  //
  // if (_.isFunction(renderFn)) {
  //   return renderFn({
  //     ...props,
  //     children
  //   })
  // }
  return null
}

export default h
