/** @jsx h */

import _ from 'lodash'
import h from 'lib/h'

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

export const Value = ({props, children}) => {
  const value = _.get(props, 'value', _.first(children))

  if (_.isObject(value)) {
    return (
      <ObjectExpression>
        {_.map(value, (v, k) => (
          <Property kind="init" method={false} shorthand={false} computed={false}>
            <Identifier>{k}</Identifier>
            <Literal>{v}</Literal>
          </Property>
        ))}
      </ObjectExpression>
    )
  }

  return (
    <Literal>{value}</Literal>
  )
}

export const VariableDeclarationCreator = (kind) => ({props, children}) => {
  const {
    name,
    value
  } = props

  if (value) {
    return (
      <VariableDeclaration kind={kind}>
        <VariableDeclarator>
          <Identifier>{name}</Identifier>
          <Value>{value}</Value>
        </VariableDeclarator>
      </VariableDeclaration>
    )
  }

  return (
    <VariableDeclaration kind={kind}>
      <VariableDeclarator>
        <Identifier>{name}</Identifier>
        {_.first(children)}
      </VariableDeclarator>
    </VariableDeclaration>
  )
}

// const
export const Const = VariableDeclarationCreator('const')
export const Let = VariableDeclarationCreator('let')
export const Var = VariableDeclarationCreator('var')
