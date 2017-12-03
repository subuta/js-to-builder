import _ from 'lodash'
import icepick from 'icepick'

import * as types from 'ast-types'

const {namedTypes: n, builders: b, getFieldNames, getFieldValue} = types

import { getBuilderName, getBuildParams } from 'lib/utils/recast'
import os from 'os'

export const parse = (path, shouldAddFieldNames) => {
  const {node} = path
  const NODE_TYPE = getBuilderName(node.type)

  let params = shouldAddFieldNames ? _.without(getFieldNames(node), 'type') : getBuildParams(NODE_TYPE)
  let props = {}
  let children = []

  _.each(_.without(getFieldNames(node), 'type'), (param) => {
    const value = getFieldValue(node, param)
    const isEmptyArray = _.isArray(value) && _.isEmpty(value)
    // return if value is falsy or empty array.
    if (!value || isEmptyArray) return
    params = _.uniq([...params, param])
  })

  _.each(params, (param) => {
    let value = getFieldValue(node, param)
    const isBool = _.isBoolean(value)
    const isString = _.isString(value)

    // following params will treat as props.
    // - String
    // - Boolean(true/false)
    // - null
    if (isString || isBool || value === null) {
      props[param] = value
      return
    }

    // will treat as children otherwise.
    if (_.isArray(value)) {
      value = _.map(value, (value) => _.get(value, 'jsx', value))
    } else {
      value = _.get(value, 'jsx', value)
    }

    children = icepick.push(children, value)
  })

  // construct props
  const propsString = ' ' + _.map(props, (value, key) => {
    if (value === false) {
      // should not omit props if key is required(included in params).
      if (_.includes(params, key)) return `${key}={false}`
      return shouldAddFieldNames ? `${key}={false}` : ''
    }
    if (value === true) {
      // should not omit props if key is required(included in params).
      if (_.includes(params, key)) return `${key}={true}`
      return `${key}`
    }
    if (value === null) return `${key}={null}`
    return `${key}="${value}"`
  }).join(' ')

  // construct children
  children = _.flatten(children.map((value) => {
    if (_.isPlainObject(value)) return `{${value}}`
    if (_.isString(value) || _.isObject(value)) return value
    return `{${value}}`
  })).join(os.EOL)

  return {
    tagName: NODE_TYPE,
    props,
    propsString,
    children
  }
}

export default (option = {}) => (path) => {
  const {
    shouldOmitProgram = false, // specify should/not wrap result by `b.program`
    shouldAddFieldNames = false // should print fieldNames also(defaults to `buildParams` only)
  } = option

  const {propsString, children, tagName} = parse(path, shouldAddFieldNames)

  if (_.isEmpty(children)) {
    return path.replace({...path, jsx: `<${tagName}${propsString} />`})
  }

  if (tagName === 'program') {
    if (shouldOmitProgram) return path.replace(`${children}`)
    return path.replace(`<${tagName}${propsString}>${children}</${tagName}>`)
  }

  path.replace({...path, jsx: `<${tagName}${propsString}>${children}</${tagName}>`})
}
