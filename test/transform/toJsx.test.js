/* global describe, it */
/** @jsx h */

import toBuilder from 'lib/transform'
import format from 'lib/utils/formatter'
import print from 'lib/utils/print'
import h from 'lib/h'

import {
  ExpressionStatement,
  CallExpression,
  Identifier
} from 'lib/components'

import * as types from 'ast-types'
const {namedTypes: n, builders: b} = types

const assert = require('assert')

describe('toBuilder', () => {
  it('should convert CallExpression', () => {
    const code = 'hoge()'

    assert(toBuilder(code, {to: 'jsx'}).code === format(`
      const render = () => (
        <ExpressionStatement>
          <CallExpression>
            <Identifier>hoge</Identifier>
          </CallExpression>
        </ExpressionStatement>
      )
    `))

    const render = () => (
      <ExpressionStatement>
        <CallExpression>
          <Identifier>hoge</Identifier>
        </CallExpression>
      </ExpressionStatement>
    )

    assert(format(print([render()])) === format(code))
  })

  // it('should convert CallExpression with arguments', () => {
  //   const code = 'hoge(\'fuga\')'
  //
  //   assert(toBuilder(code).code === format(`
  //     b.expressionStatement(
  //       b.callExpression(
  //         b.identifier('hoge'),
  //         [
  //           b.literal('fuga')
  //         ]
  //       )
  //     )
  //   `))
  //
  //   assert(format(print([toBuilder(code).builder])) === format(code))
  // })
  //
  // it('should convert ArrayExpression', () => {
  //   const code = '[]'
  //
  //   assert(toBuilder(code).code === format(`
  //     b.expressionStatement(
  //       b.arrayExpression(
  //         []
  //       )
  //     )
  //   `))
  //
  //   assert(format(print([toBuilder(code).builder])) === format(code))
  // })
  //
  // it('should convert ArrayExpression with arguments', () => {
  //   const code = '[1, 2, 3]'
  //
  //   assert(toBuilder(code).code === format(`
  //     b.expressionStatement(
  //       b.arrayExpression([
  //         b.literal(1),
  //         b.literal(2),
  //         b.literal(3)
  //       ])
  //     )
  //   `))
  //
  //   assert(format(print([toBuilder(code).builder])) === format(code))
  // })
  //
  // it('should convert VariableDeclaration', () => {
  //   const code = 'const hoge = "hoge"'
  //
  //   assert(toBuilder(code).code === format(`
  //     b.variableDeclaration('const', [
  //       b.variableDeclarator(
  //         b.identifier('hoge'),
  //         b.literal('hoge')
  //       )
  //     ])
  //   `))
  //
  //   assert(format(print([toBuilder(code).builder])) === format(code))
  // })
  //
  // it('should convert VariableDeclaration with object', () => {
  //   const code = `const hoge = {
  //     HOGE: 'hoge'
  //   }`
  //
  //   assert(toBuilder(code).code === format(`
  //     b.variableDeclaration('const', [
  //       b.variableDeclarator(
  //         b.identifier('hoge'),
  //         b.objectExpression([
  //           Object.assign(
  //             b.property(
  //               'init',
  //               b.identifier('HOGE'),
  //               b.literal('hoge')
  //             ),
  //             {
  //               method: false,
  //               shorthand: false,
  //               computed: false
  //             }
  //           )
  //         ])
  //       )
  //     ])
  //   `))
  //
  //   assert(format(print([toBuilder(code).builder])) === format(code))
  // })
  //
  // it('should convert Empty arrow function expression', () => {
  //   const code = 'const render = () => {}'
  //
  //   assert(toBuilder(code).code === format(`
  //     b.variableDeclaration('const', [
  //       b.variableDeclarator(
  //         b.identifier('render'),
  //         b.arrowFunctionExpression(
  //           [],
  //           b.blockStatement([])
  //         )
  //       )
  //     ])
  //   `))
  //
  //   assert(format(print([toBuilder(code).builder])) === format(code))
  // })
  //
  // it('should convert single line arrow function expression', () => {
  //   const code = 'const render = (str) => console.log(str)'
  //   assert(toBuilder(code).code === format(`
  //     b.variableDeclaration('const', [
  //       b.variableDeclarator(
  //         b.identifier('render'),
  //         b.arrowFunctionExpression(
  //           [b.identifier('str')],
  //           b.callExpression(
  //             b.memberExpression(
  //               b.identifier('console'),
  //               b.identifier('log')
  //             ),
  //             [b.identifier('str')]
  //           )
  //         )
  //       )
  //     ])
  //   `))
  //
  //   assert(format(print([toBuilder(code).builder])) === format(code))
  // })
  //
  // it('should convert block arrow function expression', () => {
  //   const code = 'const render = (str) => {console.log(str)}'
  //
  //   assert(toBuilder(code).code === format(`
  //     b.variableDeclaration('const', [
  //       b.variableDeclarator(
  //         b.identifier('render'),
  //         b.arrowFunctionExpression(
  //           [b.identifier('str')],
  //           b.blockStatement([
  //             b.expressionStatement(
  //               b.callExpression(
  //                 b.memberExpression(
  //                   b.identifier('console'),
  //                   b.identifier('log')
  //                 ),
  //                 [b.identifier('str')]
  //               )
  //             )
  //           ])
  //         )
  //       )
  //     ])
  //   `))
  //
  //   assert(format(print([toBuilder(code).builder])) === format(code))
  // })
  //
  // it('should convert Identifier', () => {
  //   const code = 'hoge'
  //
  //   assert(toBuilder(code).code === format(`
  //     b.expressionStatement(
  //       b.identifier('hoge')
  //     )
  //   `))
  //
  //   assert(format(print([toBuilder(code).builder])) === format(code))
  // })
  //
  // it('should convert module import', () => {
  //   const code = 'import hoge from \'hoge\''
  //
  //   assert(toBuilder(code).code === format(`
  //     b.importDeclaration([
  //       b.importDefaultSpecifier(
  //         b.identifier('hoge')
  //       )
  //     ], b.literal('hoge'))
  //   `))
  //
  //   assert(format(print([toBuilder(code).builder])) === format(code))
  // })
  //
  // it('should convert module default export', () => {
  //   const code = `export default 'hoge'`
  //
  //   assert(toBuilder(code).code === format(`
  //     b.exportDefaultDeclaration(
  //       b.literal('hoge')
  //     )
  //   `))
  //
  //   assert(format(print([toBuilder(code).builder])) === format(code))
  // })
  //
  // it('should convert module named export', () => {
  //   const code = `export const hoge = 'hoge'`
  //
  //   assert(toBuilder(code).code === format(`
  //     b.exportNamedDeclaration(
  //       b.variableDeclaration('const', [
  //         b.variableDeclarator(
  //           b.identifier('hoge'),
  //           b.literal('hoge')
  //         )
  //       ])
  //     )
  //   `))
  //
  //   assert(format(print([toBuilder(code).builder])) === format(code))
  // })
  //
  // it('should convert module import * as ...', () => {
  //   const code = 'import * as hoge from \'hoge\''
  //
  //   assert(toBuilder(code).code === format(`
  //     b.importDeclaration([
  //       b.importNamespaceSpecifier(
  //         b.identifier('hoge')
  //       )
  //     ], b.literal('hoge'))
  //   `))
  //
  //   assert(format(print([toBuilder(code).builder])) === format(code))
  // })
  //
  // it('should convert module named import', () => {
  //   const code = 'import { hoge } from \'hoge\''
  //
  //   assert(toBuilder(code).code === format(`
  //     b.importDeclaration([
  //       b.importSpecifier(
  //         b.identifier('hoge'),
  //         b.identifier('hoge')
  //       )
  //     ], b.literal('hoge'))
  //   `))
  //
  //   assert(format(print([toBuilder(code).builder])) === format(code))
  // })
  //
  // it('should convert module named import as ...', () => {
  //   const code = 'import { hoge as fuga } from \'hoge\''
  //
  //   assert(toBuilder(code).code === format(`
  //     b.importDeclaration([
  //       b.importSpecifier(
  //         b.identifier('hoge'),
  //         b.identifier('fuga')
  //       )
  //     ], b.literal('hoge'))
  //   `))
  //
  //   assert(format(print([toBuilder(code).builder])) === format(code))
  // })
  //
  // it('should convert object spread', () => {
  //   const code = 'const { hoge } = piyo'
  //
  //   assert(toBuilder(code).code === format(`
  //     b.variableDeclaration('const', [
  //       b.variableDeclarator(
  //         b.objectPattern([
  //           Object.assign(
  //             b.property(
  //               'init',
  //               b.identifier('hoge'),
  //               b.identifier('hoge')
  //             ),
  //             {
  //               method: false,
  //               shorthand: true,
  //               computed: false
  //             }
  //           )
  //         ]),
  //         b.identifier('piyo')
  //       )
  //     ])
  //   `))
  //
  //   assert(format(print([toBuilder(code).builder])) === format(code))
  // })
  //
  // it('should convert object spread with assignment', () => {
  //   const code = `const {
  //     hoge = false
  //   } = piyo`
  //
  //   assert(toBuilder(code).code === format(`
  //     b.variableDeclaration('const', [
  //       b.variableDeclarator(
  //         b.objectPattern([
  //           Object.assign(
  //             b.property(
  //               'init',
  //               b.identifier('hoge'),
  //               b.assignmentPattern(
  //                 b.identifier('hoge'),
  //                 b.literal(false)
  //               )
  //             ),
  //             {
  //               method: false,
  //               shorthand: true,
  //               computed: false
  //             }
  //           )
  //         ]),
  //         b.identifier('piyo')
  //       )
  //     ])
  //   `))
  //
  //   // FIXME: { hoge = false } が再現できてない。
  //   assert(format(print([toBuilder(code).builder])) !== format(code))
  // })
  //
  // it('should convert object spread with literal', () => {
  //   const code = `const { 'hoge': hoge } = piyo`
  //
  //   assert(toBuilder(code).code === format(`
  //     b.variableDeclaration('const', [
  //       b.variableDeclarator(
  //         b.objectPattern([
  //           Object.assign(
  //             b.property(
  //               'init',
  //               b.literal('hoge'),
  //               b.identifier('hoge')
  //             ),
  //             {
  //               method: false,
  //               shorthand: false,
  //               computed: false
  //             }
  //           )
  //         ]),
  //         b.identifier('piyo')
  //       )
  //     ])
  //   `))
  //
  //   assert(format(print([toBuilder(code).builder])) === format(code))
  // })
  //
  // it('should convert object spread with computed', () => {
  //   const code = `const { ['hoge']: hoge } = piyo`
  //
  //   assert(toBuilder(code).code === format(`
  //     b.variableDeclaration('const', [
  //       b.variableDeclarator(
  //         b.objectPattern([
  //           Object.assign(
  //             b.property(
  //               'init',
  //               b.literal('hoge'),
  //               b.identifier('hoge')
  //             ),
  //             {
  //               method: false,
  //               shorthand: false,
  //               computed: true
  //             }
  //           )
  //         ]),
  //         b.identifier('piyo')
  //       )
  //     ])
  //   `))
  //
  //   assert(format(print([toBuilder(code).builder])) === format(code))
  // })
})

// describe('option', () => {
//   it('should not omit Program if shouldOmitProgram = false', () => {
//     const code = 'hoge()'
//
//     assert(toBuilder(code, {shouldOmitProgram: false}).code === format(`
//       b.program([
//         b.expressionStatement(
//           b.callExpression(
//             b.identifier('hoge'),
//             []
//           )
//         )
//       ])
//     `))
//
//     assert(format(print([toBuilder(code).builder])) === format(code))
//   })
// })
