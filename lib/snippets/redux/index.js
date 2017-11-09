import toBuilder from 'lib/transform'
import _ from 'lodash'

export const genActionType = (method) => {
  const ACTION_TYPE = _.snakeCase(method).toUpperCase()

  const code = `
    const ${ACTION_TYPE} = '${ACTION_TYPE}'
  `

  return toBuilder(code).builder
}

export const genActionCreator = (method) => {
  const methodName = _.camelCase(method)
  const ACTION_TYPE = _.snakeCase(method).toUpperCase()

  const code = `
    const ${methodName} = () => {
      return {
        type: ${ACTION_TYPE}
      }
    }
  `

  return toBuilder(code).builder
}

export default {
  genActionType,
  genActionCreator
}
