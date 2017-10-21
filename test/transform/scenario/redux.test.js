/* global describe, it */

import toBuilder from 'lib/transform'
import format from 'lib/utils/formatter'
import print from 'lib/utils/print'

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
      b.variableDeclaration('const', [
        b.variableDeclarator(
          b.identifier('actionCreator'),
          b.arrowFunctionExpression(
            [b.identifier('arg')],
            b.blockStatement([
              b.returnStatement(
                b.objectExpression([
                  Object.assign(
                    b.property(
                      'init',
                      b.identifier('type'),
                      b.literal('HOGE')
                    ),
                    {
                      method: false,
                      shorthand: false,
                      computed: false
                    }
                  ),
                  Object.assign(
                    b.property(
                      'init',
                      b.identifier('payload'),
                      b.identifier('arg')
                    ),
                    {
                      method: false,
                      shorthand: false,
                      computed: false
                    }
                  )
                ])
              )
            ])
          )
        )
      ])
    `))

    assert(format(print([toBuilder(code).builder])) === format(code))
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
      b.variableDeclaration('const', [
        b.variableDeclarator(
          b.identifier('actionCreator'),
          b.arrowFunctionExpression(
            [b.identifier('arg')],
            b.blockStatement([
              b.returnStatement(
                b.arrowFunctionExpression(
                  [b.identifier('dispatch')],
                  b.blockStatement([
                    b.expressionStatement(
                      b.callExpression(
                        b.identifier(
                          'dispatch'
                        ),
                        [
                          b.objectExpression([
                            Object.assign(
                              b.property(
                                'init',
                                b.identifier(
                                  'type'
                                ),
                                b.literal(
                                  'HOGE'
                                )
                              ),
                              {
                                method: false,
                                shorthand: false,
                                computed: false
                              }
                            ),
                            Object.assign(
                              b.property(
                                'init',
                                b.identifier(
                                  'payload'
                                ),
                                b.identifier(
                                  'arg'
                                )
                              ),
                              {
                                method: false,
                                shorthand: false,
                                computed: false
                              }
                            )
                          ])
                        ]
                      )
                    )
                  ])
                )
              )
            ])
          )
        )
      ])
    `))

    assert(format(print([toBuilder(code).builder])) === format(code))
  })

  it('should parse and generate reducer code', () => {
    const code = `
      const reducer = (state = {}, action) => {
        return state
      }
    `
    assert(toBuilder(code).code === format(`
      b.variableDeclaration('const', [
        b.variableDeclarator(
          b.identifier('reducer'),
          b.arrowFunctionExpression(
            [
              b.assignmentPattern(
                b.identifier('state'),
                b.objectExpression([])
              ),
              b.identifier('action')
            ],
            b.blockStatement([
              b.returnStatement(
                b.identifier('state')
              )
            ])
          )
        )
      ])
    `))

    assert(format(print([toBuilder(code).builder])) === format(code))
  })

  it('should parse and generate selector code', () => {
    const code = `
      const getState = (state) => state.reducer
    `
    assert(toBuilder(code).code === format(`
      b.variableDeclaration('const', [
        b.variableDeclarator(
          b.identifier('getState'),
          b.arrowFunctionExpression(
            [b.identifier('state')],
            b.memberExpression(
              b.identifier('state'),
              b.identifier('reducer')
            )
          )
        )
      ])
    `))

    assert(format(print([toBuilder(code).builder])) === format(code))
  })
})
