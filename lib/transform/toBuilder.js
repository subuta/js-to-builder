import _ from 'lodash'
import icepick from 'icepick'

import * as types from 'ast-types'

const {namedTypes: n, builders: b, getFieldNames, getFieldValue} = types

import { getBuilderName, getBuildParams } from 'lib/utils/recast'
import os from 'os'

export default (option = {}) => (path) => {
  const {
    shouldOmitProgram = false, // specify should/not wrap result by `b.program`
    shouldAddFieldNames = false // should print fieldNames also(defaults to `buildParams` only)
  } = option

  const {node} = path
  const NODE_TYPE = getBuilderName(node.type)
  const params = shouldAddFieldNames ? _.without(getFieldNames(node), 'type') : getBuildParams(NODE_TYPE)

  let props = []
  let children = []

  _.each(params, (param) => {
    const value = getFieldValue(node, param)
    const isBool = _.isBoolean(value)

    if (param === 'name' ||
      isBool ||
      value === null
    ) {
      props = icepick.push(props, [param, value])
      return
    }

    children = icepick.push(children, [param, value])
  })

  // construct props
  props = ' ' + props.map(([key, value]) => {
    if (value === false) return `${key}={false}`
    if (value === null) return `${key}={null}`
    return `${key}="${value}"`
  }).join(' ')

  // construct children
  children = children.map(([_, value]) => value).join(os.EOL)

  if (_.isEmpty(children)) {
    return path.replace(`<${NODE_TYPE}${props} />`)
  }

  path.replace(`<${NODE_TYPE}${props}>${children}</${NODE_TYPE}>`)
}
