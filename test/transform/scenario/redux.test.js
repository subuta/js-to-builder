/* global describe, it */
/** @jsx h */

import toBuilder from 'lib/transform'
import format from 'lib/utils/formatter'
import print from 'lib/utils/print'

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

import h from 'lib/h'

const assert = require('assert')

describe('redux', () => {
  it('should parse and generate actionCreator code', () => {
    const code = `
      const actionCreator = (arg) => {
        return {
          type: 'HOGE',
          payload: arg
        }
      }
    `
    assert(toBuilder(code).code === format(`
      const render = () => (
        <VariableDeclaration kind="const">
          <VariableDeclarator>
            <Identifier>actionCreator</Identifier>
            <ArrowFunctionExpression>
              <Identifier>arg</Identifier>
              <BlockStatement>
                <ReturnStatement>
                  <ObjectExpression>
                    <Property
                      kind="init"
                      method={false}
                      shorthand={false}
                      computed={false}
                    >
                      <Identifier>type</Identifier>
                      <Literal>HOGE</Literal>
                    </Property>
      
                    <Property
                      kind="init"
                      method={false}
                      shorthand={false}
                      computed={false}
                    >
                      <Identifier>payload</Identifier>
                      <Identifier>arg</Identifier>
                    </Property>
                  </ObjectExpression>
                </ReturnStatement>
              </BlockStatement>
            </ArrowFunctionExpression>
          </VariableDeclarator>
        </VariableDeclaration>
      )
    `))

    const render = () => (
      <VariableDeclaration kind="const">
        <VariableDeclarator>
          <Identifier>actionCreator</Identifier>
          <ArrowFunctionExpression>
            <Identifier>arg</Identifier>
            <BlockStatement>
              <ReturnStatement>
                <ObjectExpression>
                  <Property
                    kind="init"
                    method={false}
                    shorthand={false}
                    computed={false}
                  >
                    <Identifier>type</Identifier>
                    <Literal>HOGE</Literal>
                  </Property>

                  <Property
                    kind="init"
                    method={false}
                    shorthand={false}
                    computed={false}
                  >
                    <Identifier>payload</Identifier>
                    <Identifier>arg</Identifier>
                  </Property>
                </ObjectExpression>
              </ReturnStatement>
            </BlockStatement>
          </ArrowFunctionExpression>
        </VariableDeclarator>
      </VariableDeclaration>
    )

    assert(format(print([render()])) === format(code))
  })

  it('should parse and generate redux-thunk actionCreator code', () => {
    const code = `
      const actionCreator = (arg) => {
        return (dispatch) => {
          dispatch({
            type: 'HOGE',
            payload: arg
          })
        }
      }
    `
    assert(toBuilder(code).code === format(`
      const render = () => (
        <VariableDeclaration kind="const">
          <VariableDeclarator>
            <Identifier>actionCreator</Identifier>
            <ArrowFunctionExpression>
              <Identifier>arg</Identifier>
              <BlockStatement>
                <ReturnStatement>
                  <ArrowFunctionExpression>
                    <Identifier>dispatch</Identifier>
                    <BlockStatement>
                      <ExpressionStatement>
                        <CallExpression>
                          <Identifier>dispatch</Identifier>
                          <ObjectExpression>
                            <Property
                              kind="init"
                              method={false}
                              shorthand={false}
                              computed={false}
                            >
                              <Identifier>type</Identifier>
                              <Literal>HOGE</Literal>
                            </Property>
      
                            <Property
                              kind="init"
                              method={false}
                              shorthand={false}
                              computed={false}
                            >
                              <Identifier>payload</Identifier>
                              <Identifier>arg</Identifier>
                            </Property>
                          </ObjectExpression>
                        </CallExpression>
                      </ExpressionStatement>
                    </BlockStatement>
                  </ArrowFunctionExpression>
                </ReturnStatement>
              </BlockStatement>
            </ArrowFunctionExpression>
          </VariableDeclarator>
        </VariableDeclaration>
      )
    `))

    const render = () => (
      <VariableDeclaration kind="const">
        <VariableDeclarator>
          <Identifier>actionCreator</Identifier>
          <ArrowFunctionExpression>
            <Identifier>arg</Identifier>
            <BlockStatement>
              <ReturnStatement>
                <ArrowFunctionExpression>
                  <Identifier>dispatch</Identifier>
                  <BlockStatement>
                    <ExpressionStatement>
                      <CallExpression>
                        <Identifier>dispatch</Identifier>
                        <ObjectExpression>
                          <Property
                            kind="init"
                            method={false}
                            shorthand={false}
                            computed={false}
                          >
                            <Identifier>type</Identifier>
                            <Literal>HOGE</Literal>
                          </Property>

                          <Property
                            kind="init"
                            method={false}
                            shorthand={false}
                            computed={false}
                          >
                            <Identifier>payload</Identifier>
                            <Identifier>arg</Identifier>
                          </Property>
                        </ObjectExpression>
                      </CallExpression>
                    </ExpressionStatement>
                  </BlockStatement>
                </ArrowFunctionExpression>
              </ReturnStatement>
            </BlockStatement>
          </ArrowFunctionExpression>
        </VariableDeclarator>
      </VariableDeclaration>
    )

    assert(format(print([render()])) === format(code))
  })

  it('should parse and generate reducer code', () => {
    const code = `
      const reducer = (state = {}, action) => {
        return state
      }
    `
    assert(toBuilder(code).code === format(`
      const render = () => (
        <VariableDeclaration kind="const">
          <VariableDeclarator>
            <Identifier>reducer</Identifier>
            <ArrowFunctionExpression>
              <AssignmentPattern>
                <Identifier>state</Identifier>
                <ObjectExpression />
              </AssignmentPattern>
      
              <Identifier>action</Identifier>
              <BlockStatement>
                <ReturnStatement>
                  <Identifier>state</Identifier>
                </ReturnStatement>
              </BlockStatement>
            </ArrowFunctionExpression>
          </VariableDeclarator>
        </VariableDeclaration>
      )
    `))

    const render = () => (
      <VariableDeclaration kind="const">
        <VariableDeclarator>
          <Identifier>reducer</Identifier>
          <ArrowFunctionExpression>
            <AssignmentPattern>
              <Identifier>state</Identifier>
              <ObjectExpression />
            </AssignmentPattern>

            <Identifier>action</Identifier>
            <BlockStatement>
              <ReturnStatement>
                <Identifier>state</Identifier>
              </ReturnStatement>
            </BlockStatement>
          </ArrowFunctionExpression>
        </VariableDeclarator>
      </VariableDeclaration>
    )

    assert(format(print([render()])) === format(code))
  })

  it('should parse and generate selector code', () => {
    const code = `
      const getState = (state) => state.reducer
    `
    assert(toBuilder(code).code === format(`
      const render = () => (
        <VariableDeclaration kind="const">
          <VariableDeclarator>
            <Identifier>getState</Identifier>
            <ArrowFunctionExpression>
              <Identifier>state</Identifier>
              <MemberExpression>
                <Identifier>state</Identifier>
                <Identifier>reducer</Identifier>
              </MemberExpression>
            </ArrowFunctionExpression>
          </VariableDeclarator>
        </VariableDeclaration>
      )
    `))

    const render = () => (
      <VariableDeclaration kind="const">
        <VariableDeclarator>
          <Identifier>getState</Identifier>
          <ArrowFunctionExpression>
            <Identifier>state</Identifier>
            <MemberExpression>
              <Identifier>state</Identifier>
              <Identifier>reducer</Identifier>
            </MemberExpression>
          </ArrowFunctionExpression>
        </VariableDeclarator>
      </VariableDeclaration>
    )

    assert(format(print([render()])) === format(code))
  })
})
