import _ from 'lodash'
import icepick from 'icepick'

import * as types from 'ast-types'

const {namedTypes: n, builders: b, getFieldNames, getFieldValue} = types

import { getBuilderName, getBuildParams } from 'lib/utils/recast'
import os from 'os'

// TODO: JSXをpathに追加しつつ、組み立てていく。
// arguments, bodyなどArray<*>な引数を省略してもちゃんとレンダリング出来るような工夫を考える。
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

  NODE_TYPE /*?*/

  _.each(params, (param) => {
    param /*?*/

    let value = getFieldValue(node, param)
    const isBool = _.isBoolean(value)

    value /*?*/

    if (param === 'name' ||
        isBool ||
        value === null
    ) {
      props = icepick.push(props, [param, value])
      return
    }

    if (_.isArray(value)) {
      value = _.map(value, ({jsx}) => jsx)
    } else {
      value = value.jsx
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
    return path.replace({...path, jsx: `<${NODE_TYPE}${props} />`})
  }

  if (NODE_TYPE === 'program') {
    return path.replace(`<${NODE_TYPE}${props}>${children}</${NODE_TYPE}>`)
  }

  path.replace({...path, jsx: `<${NODE_TYPE}${props}>${children}</${NODE_TYPE}>`})
}
