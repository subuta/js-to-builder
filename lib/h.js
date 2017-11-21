import _ from 'lodash'

import builtinComponents from 'lib/components/builtinComponents'

const h = (tagName, props, ...children) => {
  // if component passed.
  const renderFn = builtinComponents[tagName] || tagName
  if (_.isFunction(renderFn)) {
    if (_.isArray(_.first(children))) {
      children = _.first(children)
    }
    return renderFn({
      ...props,
      children
    })
  }
  return null
}

export default h
