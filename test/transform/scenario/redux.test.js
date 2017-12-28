/* global describe, it */
/** @jsx h */

import toBuilder from 'lib/transform'
import format from 'lib/utils/formatter'
import { babelAndEval } from 'test/helper'

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
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.
      
      const render = () => (
        <program>
          <variableDeclaration kind="const">
            <variableDeclarator>
              <identifier name="actionCreator" />
              <arrowFunctionExpression expression={false}>
                <identifier name="arg" />
                <blockStatement>
                  <returnStatement>
                    <objectExpression>
                      <property kind="init">
                        <identifier name="type" />
                        <literal value="HOGE" />
                      </property>
                      <property kind="init">
                        <identifier name="payload" />
                        <identifier name="arg" />
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

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
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
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.

      const render = () => (
        <program>
          <variableDeclaration kind="const">
            <variableDeclarator>
              <identifier name="actionCreator" />
              <arrowFunctionExpression expression={false}>
                <identifier name="arg" />
                <blockStatement>
                  <returnStatement>
                    <arrowFunctionExpression expression={false}>
                      <identifier name="dispatch" />
                      <blockStatement>
                        <expressionStatement>
                          <callExpression>
                            <identifier name="dispatch" />
                            <objectExpression>
                              <property kind="init">
                                <identifier name="type" />
                                <literal value="HOGE" />
                              </property>
                              <property kind="init">
                                <identifier name="payload" />
                                <identifier name="arg" />
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

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })

  it('should parse and generate reducer code', () => {
    const code = `
      const reducer = (state = {}, action) => {
        return state
      }
    `
    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.

      const render = () => (
        <program>
          <variableDeclaration kind="const">
            <variableDeclarator>
              <identifier name="reducer" />
              <arrowFunctionExpression expression={false}>
                <assignmentPattern>
                  <identifier name="state" />
                  <objectExpression />
                </assignmentPattern>
                <identifier name="action" />
                <blockStatement>
                  <returnStatement>
                    <identifier name="state" />
                  </returnStatement>
                </blockStatement>
              </arrowFunctionExpression>
            </variableDeclarator>
          </variableDeclaration>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })

  it('should parse and generate selector code', () => {
    const code = `
      const getState = (state) => state.reducer
    `
    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.

      const render = () => (
        <program>
          <variableDeclaration kind="const">
            <variableDeclarator>
              <identifier name="getState" />
              <arrowFunctionExpression expression={true}>
                <identifier name="state" />
                <memberExpression computed={false}>
                  <identifier name="state" />
                  <identifier name="reducer" />
                </memberExpression>
              </arrowFunctionExpression>
            </variableDeclarator>
          </variableDeclaration>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })
})
