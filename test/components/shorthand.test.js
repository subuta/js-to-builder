/* global describe, it */
/** @jsx h */

import toBuilder from 'lib/transform'
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
  FnCall
} from 'lib/components/shorthand'

import {
  Program,

  ReturnStatement,
  ExpressionStatement,

  CallExpression,
  ArrayExpression,
  ObjectExpression,
  ArrowFunctionExpression,
  MemberExpression,

  BlockStatement,

  Property,

  ImportDeclaration,
  ImportDefaultSpecifier,
  ImportNamespaceSpecifier,
  ImportSpecifier,

  ExportDefaultDeclaration,
  ExportNamedDeclaration,

  AssignmentPattern,
  ObjectPattern,

  VariableDeclaration,
  VariableDeclarator,

  Identifier,
  Literal,
} from 'lib/components'

describe('Components', () => {
  it('Const should render', () => {
    const render = () => (
      <Const name="hoge">
        <Literal>hoge</Literal>
      </Const>
    )

    assert(format(print([render()])) === format(`
      const hoge = 'hoge'
    `))

    const renderWithValue = () => (
      <Const name="hoge" value="hoge" />
    )

    assert(format(print([renderWithValue()])) === format(`
      const hoge = 'hoge'
    `))
  })

  it('Let should render', () => {
    const render = () => (
      <Let name="hoge">
        <Literal>hoge</Literal>
      </Let>
    )

    assert(format(print([render()])) === format(`
      let hoge = 'hoge'
    `))

    const renderWithValue = () => (
      <Let name="hoge" value="hoge" />
    )

    assert(format(print([renderWithValue()])) === format(`
      let hoge = 'hoge'
    `))
  })

  it('Var should render', () => {
    const render = () => (
      <Var name="hoge">
        <Literal>hoge</Literal>
      </Var>
    )

    assert(format(print([render()])) === format(`
      var hoge = 'hoge'
    `))

    const renderWithValue = () => (
      <Var name="hoge" value="hoge" />
    )

    assert(format(print([renderWithValue()])) === format(`
      var hoge = 'hoge'
    `))
  })

  it('Value with primitive should render', () => {
    const render = () => (
      <Const name="hoge">
        <Value>hoge</Value>
      </Const>
    )

    assert(format(print([render()])) === format(`
      const hoge = 'hoge'
    `))

    const renderWithValue = () => (
      <Const name="hoge">
        <Value value="hoge" />
      </Const>
    )

    assert(format(print([renderWithValue()])) === format(`
      const hoge = 'hoge'
    `))

    const renderWithNumber = () => (
      <Const name="hoge">
        <Value>{1}</Value>
      </Const>
    )

    assert(format(print([renderWithNumber()])) === format(`
      const hoge = 1
    `))
  })

  it('Value with string should render', () => {
    const render = () => (
      <Const name="hoge">
        <Value>hoge</Value>
      </Const>
    )

    assert(format(print([render()])) === format(`
      const hoge = 'hoge'
    `))
  })

  it('Value with bool should render', () => {
    const render = () => (
      <Const name="hoge">
        <Value>{true}</Value>
      </Const>
    )

    assert(format(print([render()])) === format(`
      const hoge = true
    `))
  })

  it('Value with object should render', () => {
    const render = () => (
      <Const name="hoge">
        <Value>{{hoge: 'fuga', fuga: 'piyo'}}</Value>
      </Const>
    )

    assert(format(print([render()])) === format(`
      const hoge = {
        hoge: 'fuga',
        fuga: 'piyo'
      }
    `))

    const renderWithValue = () => (
      <Const name="hoge" value={{hoge: 'fuga', fuga: 'piyo'}} />
    )

    assert(format(print([renderWithValue()])) === format(`
      const hoge = {
        hoge: 'fuga',
        fuga: 'piyo'
      }
    `))
  })

  it('Value with array should render', () => {
    const render = () => (
      <Const name="hoge">
        <Value>{[1, 2, 3]}</Value>
      </Const>
    )

    assert(format(print([render()])) === format(`
      const hoge = [1, 2, 3]
    `))

    const renderWithValue = () => (
      <Const name="hoge" value={[1, 2, 3]} />
    )

    assert(format(print([renderWithValue()])) === format(`
      const hoge = [1, 2, 3]
    `))
  })

  it('Value with simple function should render', () => {
    const render = () => (
      <Const name="hoge">
        <ArrowFn>
          <Identifier>str</Identifier>
          <Identifier>hoge</Identifier>
          <FnStatement>
            <FnCall callee="console.log">
              <Identifier>str</Identifier>
            </FnCall>
          </FnStatement>
        </ArrowFn>
      </Const>
    )

    assert(format(print([render()])) === format(`
      const hoge = (str, hoge) => console.log(str)
    `))
  })

  it('Value with complex function should render', () => {
    const render = () => (
      <Const name="hoge">
        <ArrowFn>
          <Identifier>str</Identifier>
          <Identifier>hoge</Identifier>
          <FnStatement>
            <FnCall callee="console.log">
              <Identifier>str</Identifier>
            </FnCall>

            <FnCall callee="console.log">
              <Literal>hoge</Literal>
            </FnCall>
          </FnStatement>
        </ArrowFn>
      </Const>
    )

    assert(format(print([render()])) === format(`
      const hoge = (str, hoge) => {
        console.log(str)
        console.log('hoge')
      }
    `))
  })
})
