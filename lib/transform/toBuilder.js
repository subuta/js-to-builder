import _ from 'lodash'
import icepick from 'icepick'
import os from 'os'

import * as types from 'ast-types'

const {namedTypes: n, builders: b, getFieldNames, getFieldValue} = types

import { getBuilderName, getBuildParams } from 'lib/utils/recast'

const EOL = os.EOL ? os.EOL : '\n'

export const serializeComment = (comment) => {
  if (n.CommentLine.check(comment)) {
    return `//${comment.value.replace(/(\r|\n)/g, `\$1`)}`
  } else if (n.CommentBlock.check(comment)) {
    return `/*${comment.value.replace(/(\r|\n)/g, `\$1`)}*/`
  }
}

export const parse = (path) => {
  const node = path.value
  const NODE_TYPE = getBuilderName(node.type)

  const fieldNames = _.without(getFieldNames(node), 'type')
  let params = getBuildParams(NODE_TYPE)
  let props = {}
  let children = []

  _.each(fieldNames, (param) => {
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

  const serializeComment = (comment) => {
    if (n.CommentLine.check(comment)) {
      return `//${comment.value.replace(/(\r|\n)/g, `\$1`)}`
    } else if (n.CommentBlock.check(comment)) {
      return `/*${comment.value.replace(/(\r|\n)/g, `\$1`)}*/`
    }
  }

  // add comments
  if (node.leadingComments) {
    props['leadingComments'] = _.map(node.leadingComments, serializeComment)
  }

  if (node.trailingComments) {
    props['trailingComments'] = _.map(node.trailingComments, serializeComment)
  }

  // construct props
  const propsString = ' ' + _.map(props, (value, key) => {
    if (value === false) {
      // should not omit props if key is required(included in params).
      if (_.includes(params, key)) return `${key}={false}`
      return ''
    }
    if (value === true) {
      // should not omit props if key is required(included in params).
      if (_.includes(params, key)) return `${key}={true}`
      return `${key}`
    }
    if (value === null) return `${key}={null}`
    if (_.isArray(value)) return `${key}={${JSON.stringify(value)}}`
    return `${key}="${value}"`
  }).join(' ')

  // construct children
  children = _.flatten(children.map((value) => {
    if (_.isPlainObject(value)) return `{${value}}`
    if (_.isString(value) || _.isObject(value)) return value
    return `{${value}}`
  })).join(EOL)

  return {
    tagName: NODE_TYPE,
    props,
    propsString,
    children
  }
}

export default (option = {}) => (path) => {
  const {
    shouldOmitProgram = false // specify should/not wrap result by `b.program`
  } = option

  const node = path.value
  const {propsString, children, tagName} = parse(path)

  if (_.isEmpty(children)) {
    return path.replace({...node, jsx: `<${tagName}${propsString} />`})
  }

  if (tagName === 'program') {
    if (shouldOmitProgram) return path.replace(`${children}`)
    return path.replace(`<${tagName}${propsString}>${children}</${tagName}>`)
  }

  path.replace({...node, jsx: `<${tagName}${propsString}>${children}</${tagName}>`})
}
