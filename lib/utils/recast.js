import _ from 'lodash'

import * as types from 'ast-types'

const {namedTypes: n, builders: b, Type} = types
const def = Type.def

// FROM https://github.com/benjamn/ast-types/blob/master/lib/types.js#L612
export const getBuilderName = (typeName) => {
  return typeName.replace(/^[A-Z]+/, function (upperCasePrefix) {
    let len = upperCasePrefix.length
    switch (len) {
      case 0:
        return ''
      // If there's only one initial capital letter, just lower-case it.
      case 1:
        return upperCasePrefix.toLowerCase()
      default:
        // If there's more than one initial capital letter, lower-case
        // all but the last one, so that XMLDefaultDeclaration (for
        // example) becomes xmlDefaultDeclaration.
        return upperCasePrefix.slice(
          0, len - 1).toLowerCase() +
          upperCasePrefix.charAt(len - 1)
    }
  })
}

// builderName -> nodeType
export const getTypeName = (builderName) => {
  return builderName.replace(/^[a-z]+/, function (lowerCasePrefix) {
    if (lowerCasePrefix === 'jsx') return 'JSX' // Fix for irregular builderName
    let len = lowerCasePrefix.length
    switch (len) {
      case builderName.length:
        return _.upperFirst(builderName)
      case 1:
      default:
        return _.upperFirst(lowerCasePrefix)
    }
  })
}

// get buildParams from builderName
export const getBuildParams = (builderName) => {
  return _.clone(def(getTypeName(builderName)).buildParams)
}

// get buildParams from builderName
export const getAllFields = (builderName) => {
  return _.clone(def(getTypeName(builderName)).allFields)
}

// get superTypeList from builderName
export const getSuperTypeList = (builderName) => {
  return _.clone(def(getTypeName(builderName)).supertypeList)
}

// get superTypeList from builderName
export const createMatcher = (typeDef) => {
  if (!typeDef.match(/\[.*]/)) return

  let fns = []
  let match

  // eslint-disable-next-line no-cond-assign
  let re = /(\w+)/g
  while ((match = re.exec(typeDef)) !== null) {
    if (match[0] === 'null') {
      // match with null
      fns.push((node) => node === null)
    } else if (!n[match[0]]) {
      return
    } else {
      fns.push(n[match[0]].check)
    }
  }

  return (node) => _.some(fns, (fn) => fn(node))
}
