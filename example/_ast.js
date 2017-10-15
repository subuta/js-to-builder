import _ from 'lodash'
import { print, parse } from 'recast'
import * as types from 'ast-types'
const {namedTypes: n, builders: b, visit, getFieldNames, getFieldValue} = types

// playground for ast

const ast = b.program([
  b.variableDeclaration('const', [
    b.variableDeclarator(
      b.objectPattern([
        Object.assign(
          b.property(
            'init',
            b.literal('hoge'),
            b.identifier('hoge')
          ),
          {
            method: false,
            shorthand: false,
            computed: true
          }
        )
      ]),
      b.identifier('piyo')
    )
  ])
])

console.log(print(ast).code)
