/* global describe, it */
/** @jsx h */

import format from 'lib/utils/formatter'
import print from 'lib/utils/print'

import h from 'lib/h'

const assert = require('assert')

import {
  Const,
  Let,
  Var,
  Value,
  ArrowFn,
  FnStatement,
  FnCall,
  Fn,
  JSX,
  Import,
  Export,
  Declarator
} from 'lib/components/simple'

describe('compose', () => {
  it('Const should allow nested components', () => {
    const DefineHoge = () => {
      return (
        <Const name="hoge">
          <literal>hoge</literal>
        </Const>
      )
    }

    const render = () => (
      <program>
        <DefineHoge />

        <Const name="hoge">
          <literal>fuga</literal>
        </Const>
      </program>
    )

    assert(format(print(render())) === format(`
      const hoge = 'hoge'
      const hoge = 'fuga'
    `))
  })
})
