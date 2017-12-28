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

describe('scenario', () => {
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

  it('program should allow mixed usage of nested array of component and single component as children', () => {
    const render = () => (
      <program>
        {[
          <Import name="hoge" source="hoge.js" default />,
          <Import name="fuga" source="fuga.js" default />
        ]}

        <Import name="piyo" source="piyo.js" default />
      </program>
    )

    assert(format(print(render())) === format(`
      import hoge from 'hoge.js'
      import fuga from 'fuga.js'
      import piyo from 'piyo.js'
    `))
  })

  it('allow use of `fragment` and nested array', () => {
    const TwoImports = () => (
      <fragment>
        {[
          <Import name="hoge" source="hoge.js" default />,
          <Import name="fuga" source="fuga.js" default />
        ]}
      </fragment>
    )

    const render = () => (
      <program>
        {[<TwoImports />]}
      </program>
    )

    assert(format(print(render())) === format(`
      import hoge from 'hoge.js'
      import fuga from 'fuga.js'
    `))
  })
})
