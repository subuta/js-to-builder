/* global describe, it */

import _ from 'lodash'

import format from 'lib/utils/formatter'

const assert = require('assert')

describe('format', () => {
  it('should keep correct format', () => {
    const code = 'hoge\n'

    assert(code === format(code))
  })

  it('should keep line comment', () => {
    const code = 'hoge // hoge\n'

    assert(code === format(code))
  })
})
