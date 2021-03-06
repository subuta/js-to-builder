import { print, parse } from 'recast'
import * as types from 'ast-types'
const {namedTypes: n, builders: b, visit, getFieldNames, getFieldValue} = types

const builderToCode = (builders) => print(builders).code

export default builderToCode
