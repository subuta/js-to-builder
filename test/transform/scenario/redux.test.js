/* global describe, it */
/** @jsx h */

import toBuilder from 'lib/transform'
import format from 'lib/utils/formatter'
import print from 'lib/utils/print'

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
        <program>
          <variableDeclaration kind="const">
            <variableDeclarator>
              <identifier>actionCreator</identifier>
              <arrowFunctionExpression>
                <identifier>arg</identifier>
                <blockStatement>
                  <returnStatement>
                    <objectExpression>
                      <property
                        kind="init"
                        method={false}
                        shorthand={false}
                        computed={false}
                      >
                        <identifier>type</identifier>
                        <literal>HOGE</literal>
                      </property>
        
                      <property
                        kind="init"
                        method={false}
                        shorthand={false}
                        computed={false}
                      >
                        <identifier>payload</identifier>
                        <identifier>arg</identifier>
                      </property>
                    </objectExpression>
                  </returnStatement>
                </blockStatement>
              </arrowFunctionExpression>
            </variableDeclarator>
          </variableDeclaration>
        </program>
      )
    `))

    const render = () => (
      <program>
        <variableDeclaration kind="const">
          <variableDeclarator>
            <identifier>actionCreator</identifier>
            <arrowFunctionExpression>
              <identifier>arg</identifier>
              <blockStatement>
                <returnStatement>
                  <objectExpression>
                    <property
                      kind="init"
                      method={false}
                      shorthand={false}
                      computed={false}
                    >
                      <identifier>type</identifier>
                      <literal>HOGE</literal>
                    </property>

                    <property
                      kind="init"
                      method={false}
                      shorthand={false}
                      computed={false}
                    >
                      <identifier>payload</identifier>
                      <identifier>arg</identifier>
                    </property>
                  </objectExpression>
                </returnStatement>
              </blockStatement>
            </arrowFunctionExpression>
          </variableDeclarator>
        </variableDeclaration>
      </program>
    )

    assert(format(print(render())) === format(code))
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
        <program>
          <variableDeclaration kind="const">
            <variableDeclarator>
              <identifier>actionCreator</identifier>
              <arrowFunctionExpression>
                <identifier>arg</identifier>
                <blockStatement>
                  <returnStatement>
                    <arrowFunctionExpression>
                      <identifier>dispatch</identifier>
                      <blockStatement>
                        <expressionStatement>
                          <callExpression>
                            <identifier>dispatch</identifier>
                            <objectExpression>
                              <property
                                kind="init"
                                method={false}
                                shorthand={false}
                                computed={false}
                              >
                                <identifier>type</identifier>
                                <literal>HOGE</literal>
                              </property>
        
                              <property
                                kind="init"
                                method={false}
                                shorthand={false}
                                computed={false}
                              >
                                <identifier>payload</identifier>
                                <identifier>arg</identifier>
                              </property>
                            </objectExpression>
                          </callExpression>
                        </expressionStatement>
                      </blockStatement>
                    </arrowFunctionExpression>
                  </returnStatement>
                </blockStatement>
              </arrowFunctionExpression>
            </variableDeclarator>
          </variableDeclaration>
        </program>
      )
    `))

    const render = () => (
      <program>
        <variableDeclaration kind="const">
          <variableDeclarator>
            <identifier>actionCreator</identifier>
            <arrowFunctionExpression>
              <identifier>arg</identifier>
              <blockStatement>
                <returnStatement>
                  <arrowFunctionExpression>
                    <identifier>dispatch</identifier>
                    <blockStatement>
                      <expressionStatement>
                        <callExpression>
                          <identifier>dispatch</identifier>
                          <objectExpression>
                            <property
                              kind="init"
                              method={false}
                              shorthand={false}
                              computed={false}
                            >
                              <identifier>type</identifier>
                              <literal>HOGE</literal>
                            </property>

                            <property
                              kind="init"
                              method={false}
                              shorthand={false}
                              computed={false}
                            >
                              <identifier>payload</identifier>
                              <identifier>arg</identifier>
                            </property>
                          </objectExpression>
                        </callExpression>
                      </expressionStatement>
                    </blockStatement>
                  </arrowFunctionExpression>
                </returnStatement>
              </blockStatement>
            </arrowFunctionExpression>
          </variableDeclarator>
        </variableDeclaration>
      </program>
    )

    assert(format(print(render())) === format(code))
  })

  it('should parse and generate reducer code', () => {
    const code = `
      const reducer = (state = {}, action) => {
        return state
      }
    `
    assert(toBuilder(code).code === format(`
      const render = () => (
        <program>
          <variableDeclaration kind="const">
            <variableDeclarator>
              <identifier>reducer</identifier>
              <arrowFunctionExpression>
                <assignmentPattern>
                  <identifier>state</identifier>
                  <objectExpression />
                </assignmentPattern>
        
                <identifier>action</identifier>
                <blockStatement>
                  <returnStatement>
                    <identifier>state</identifier>
                  </returnStatement>
                </blockStatement>
              </arrowFunctionExpression>
            </variableDeclarator>
          </variableDeclaration>
        </program>
      )
    `))

    const render = () => (
      <program>
        <variableDeclaration kind="const">
          <variableDeclarator>
            <identifier>reducer</identifier>
            <arrowFunctionExpression>
              <assignmentPattern>
                <identifier>state</identifier>
                <objectExpression />
              </assignmentPattern>

              <identifier>action</identifier>
              <blockStatement>
                <returnStatement>
                  <identifier>state</identifier>
                </returnStatement>
              </blockStatement>
            </arrowFunctionExpression>
          </variableDeclarator>
        </variableDeclaration>
      </program>
    )

    assert(format(print(render())) === format(code))
  })

  it('should parse and generate selector code', () => {
    const code = `
      const getState = (state) => state.reducer
    `
    assert(toBuilder(code).code === format(`
      const render = () => (
        <program>
          <variableDeclaration kind="const">
            <variableDeclarator>
              <identifier>getState</identifier>
              <arrowFunctionExpression>
                <identifier>state</identifier>
                <memberExpression>
                  <identifier>state</identifier>
                  <identifier>reducer</identifier>
                </memberExpression>
              </arrowFunctionExpression>
            </variableDeclarator>
          </variableDeclaration>
        </program>
      )
    `))

    const render = () => (
      <program>
        <variableDeclaration kind="const">
          <variableDeclarator>
            <identifier>getState</identifier>
            <arrowFunctionExpression>
              <identifier>state</identifier>
              <memberExpression>
                <identifier>state</identifier>
                <identifier>reducer</identifier>
              </memberExpression>
            </arrowFunctionExpression>
          </variableDeclarator>
        </variableDeclaration>
      </program>
    )

    assert(format(print(render())) === format(code))
  })
})
