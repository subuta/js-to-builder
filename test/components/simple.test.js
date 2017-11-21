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
  JSX
} from 'lib/components/simple'

describe('Components', () => {
  it('Const should render', () => {
    const render = () => (
      <Const name="hoge">
        <literal>hoge</literal>
      </Const>
    )

    assert(format(print(render())) === format(`
      const hoge = 'hoge'
    `))

    const renderWithValue = () => (
      <Const name="hoge" value="hoge" />
    )

    assert(format(print(renderWithValue())) === format(`
      const hoge = 'hoge'
    `))
  })

  it('Let should render', () => {
    const render = () => (
      <Let name="hoge">
        <literal>hoge</literal>
      </Let>
    )

    assert(format(print(render())) === format(`
      let hoge = 'hoge'
    `))

    const renderWithValue = () => (
      <Let name="hoge" value="hoge" />
    )

    assert(format(print(renderWithValue())) === format(`
      let hoge = 'hoge'
    `))
  })

  it('Var should render', () => {
    const render = () => (
      <Var name="hoge">
        <literal>hoge</literal>
      </Var>
    )

    assert(format(print(render())) === format(`
      var hoge = 'hoge'
    `))

    const renderWithValue = () => (
      <Var name="hoge" value="hoge" />
    )

    assert(format(print(renderWithValue())) === format(`
      var hoge = 'hoge'
    `))
  })

  it('Value with primitive should render', () => {
    const render = () => (
      <Const name="hoge">
        <Value>hoge</Value>
      </Const>
    )

    assert(format(print(render())) === format(`
      const hoge = 'hoge'
    `))

    const renderWithValue = () => (
      <Const name="hoge">
        <Value value="hoge" />
      </Const>
    )

    assert(format(print(renderWithValue())) === format(`
      const hoge = 'hoge'
    `))

    const renderWithNumber = () => (
      <Const name="hoge">
        <Value>{1}</Value>
      </Const>
    )

    assert(format(print(renderWithNumber())) === format(`
      const hoge = 1
    `))
  })

  it('Value with string should render', () => {
    const render = () => (
      <Const name="hoge">
        <Value>hoge</Value>
      </Const>
    )

    assert(format(print(render())) === format(`
      const hoge = 'hoge'
    `))
  })

  it('Value with bool should render', () => {
    const render = () => (
      <Const name="hoge">
        <Value>{true}</Value>
      </Const>
    )

    assert(format(print(render())) === format(`
      const hoge = true
    `))
  })

  it('Value with null should render', () => {
    const render = () => (
      <Const name="hoge">
        <Value>{null}</Value>
      </Const>
    )

    assert(format(print(render())) === format(`
      const hoge = null
    `))
  })

  it('Value with object should render', () => {
    const render = () => (
      <Const name="hoge">
        <Value>{{hoge: 'fuga', fuga: 'piyo'}}</Value>
      </Const>
    )

    assert(format(print(render())) === format(`
      const hoge = {
        hoge: 'fuga',
        fuga: 'piyo'
      }
    `))

    const renderWithValue = () => (
      <Const name="hoge" value={{hoge: 'fuga', fuga: 'piyo'}} />
    )

    assert(format(print(renderWithValue())) === format(`
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

    assert(format(print(render())) === format(`
      const hoge = [1, 2, 3]
    `))

    const renderWithValue = () => (
      <Const name="hoge" value={[1, 2, 3]} />
    )

    assert(format(print(renderWithValue())) === format(`
      const hoge = [1, 2, 3]
    `))
  })

  it('Value with simple function should render', () => {
    const render = () => (
      <Const name="hoge">
        <ArrowFn>
          <identifier>str</identifier>
          <identifier>hoge</identifier>
          <FnStatement>
            <FnCall callee="console.log">
              <identifier>str</identifier>
            </FnCall>
          </FnStatement>
        </ArrowFn>
      </Const>
    )

    assert(format(print(render())) === format(`
      const hoge = (str, hoge) => console.log(str)
    `))
  })

  it('Value with complex function should render', () => {
    const render = () => (
      <Const name="hoge">
        <ArrowFn>
          <identifier>str</identifier>
          <identifier>hoge</identifier>
          <FnStatement>
            <FnCall callee="console.log">
              <identifier>str</identifier>
            </FnCall>
            <Const name="hoge" value="true" />
          </FnStatement>
        </ArrowFn>
      </Const>
    )

    assert(format(print(render())) === format(`
      const hoge = (str, hoge) => {
        console.log(str)
        const hoge = 'true'
      }
    `))
  })

  it('simple JSX should render', () => {
    const render = () => (
      <JSX tagName="span">hoge</JSX>
    )

    assert(format(print(render())) === format(`
      <span>hoge</span>
    `))
  })

  it('JSX with attributes should render', () => {
    const render = () => (
      <JSX
        tagName="span"
        style={{
          color: 'red'
        }}
        fuga={false}
        hidden
      >
        hoge
      </JSX>
    )

    assert(format(print(render())) === format(`
      <span 
        style={{
          color: 'red'
        }}
        fuga={false}
        hidden
      >
        hoge
      </span>
    `))
  })

  it('nested JSX should render', () => {
    const render = () => (
      <JSX tagName="p">
        <JSX
          tagName="b"
          style={{
            color: 'red'
          }}
        >
          piyo
        </JSX>
      </JSX>
    )

    assert(format(print(render())) === format(`
      <p>
        <b
          style={{
            color: 'red'
          }}
        >
          piyo
        </b>
      </p>
    `))
  })
})
