/* global describe, it */

import _ from 'lodash'

import {
  getBuilderName,
  getTypeName,
  getSuperTypeList,
  getBuildParams
} from 'lib/utils/recast'

import * as types from 'ast-types'
const {namedTypes: n, builders: b} = types

const assert = require('assert')

describe('getSuperTypeList', () => {
  it('should return supertypeList', () => {
    assert.deepEqual(getSuperTypeList('identifier'), ['Identifier', 'Expression', 'Pattern', 'Node', 'Printable'])
  })
})

describe('getBuildParams', () => {
  it('should return buildParams', () => {
    assert.deepEqual(getBuildParams('identifier'), ['name'])
  })
})

describe('getBuilderName', () => {
  it('should transform builder <-> namedType', () => {
    const builderNames = _.keys(b)
    _.each(builderNames, builderName => {
      if (_.endsWith(builderName, 'Statement')) return
      const typeName = getTypeName(builderName)
      assert(n[typeName] !== undefined)
      assert(getBuilderName(typeName) === builderName)
    })
  })
})
