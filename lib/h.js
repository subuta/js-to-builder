import _ from 'lodash'

import builtinComponents from 'lib/components/builtinComponents'

const h = (tagName, props, ..._children) => {
  // if component passed.
  const renderFn = builtinComponents[tagName] || tagName

  // initialize props with empty object if not defined.
  if (!props) props = {}

  let children = (() => {
    // prefer props.children if defined
    if (props.children) return props.children
    // allow array style children.
    if (_.isArray(_.first(_children))) return _.first(_children)
    // otherwise use default jsx children.
    return _children
  })()

  if (_.isFunction(renderFn)) {
    return renderFn({
      ...props,
      children
    })
  }
  return null
}

export default h
