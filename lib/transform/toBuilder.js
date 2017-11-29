import _ from 'lodash'
import icepick from 'icepick'

import * as types from 'ast-types'
const {namedTypes: n, builders: b, getFieldNames} = types

import { getBuilderName } from 'lib/utils/recast'

import os from 'os'

export default (option = {}) => (path) => {
  const {
    shouldOmitProgram = false // specify should/not wrap result by `b.program`
  } = option

  const { node } = path
  const fieldNames = _.without(getFieldNames(node), 'type')
  const NODE_TYPE = getBuilderName(node.type)

  console.log('NODE_TYPE = ', NODE_TYPE);
  console.log('fieldNames = ', fieldNames);

  let props = []
  let children = []

  _.each(fieldNames, (fieldName) => {
    const isBool = _.isBoolean(node[fieldName])

    if (fieldName === 'name' ||
        isBool) {
      props = icepick.push(props, [fieldName, node[fieldName]])
      return
    }

    children = icepick.push(children, [fieldName, node[fieldName]])
  })

  // construct props
  props = ' ' + props.map(([key, value]) => {
    if (value === false) return ''
    return `${key}="${value}"`
  }).join(' ') /*?*/

  // construct children
  children = children.map(([_, value]) => value).join(os.EOL)

  path.replace(`<${NODE_TYPE}${props}>${children}</${NODE_TYPE}>`)
}
