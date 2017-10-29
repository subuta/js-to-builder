/** @jsx h */

import _ from 'lodash'
import h from 'lib/h'

import * as types from 'ast-types'
const {namedTypes: n, builders: b} = types

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
  // try to parse as object first.
  const value = _.get(props, 'value', _.first(children))
  if (_.isPlainObject(value)) {
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

  if (_.isArray(children) && children.length > 1) {
    return (
      <ArrayExpression>
        {_.map(children, (value) => (
          <Literal>{value}</Literal>
        ))}
      </ArrayExpression>
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

// function call
export const FnCall = ({props, children}) => {
  let callee = <Identifier>{props.callee}</Identifier>
  if (props.callee && props.callee.split('.').length > 1) {
    callee = (
      <MemberExpression>
        {_.map(props.callee.split('.'), (item) => <Identifier>{item}</Identifier>)}
      </MemberExpression>
    )
  }
  return (
    <CallExpression>
      {[
        callee,
        ...children
      ]}
    </CallExpression>
  )
}

export const FnStatement = ({props, children}) => {
  if (children.length === 1) {
    return _.first(children)
  }

  return (
    <BlockStatement>
      {_.map(children, (child) => {
        // wrap with ExpressionStatement if child is not statement.
        if (!n.Statement.check(child)) {
          return (
            <ExpressionStatement>{child}</ExpressionStatement>
          )
        }
        return child
      })}
    </BlockStatement>
  )
}

// const
export const Const = VariableDeclarationCreator('const')
export const Let = VariableDeclarationCreator('let')
export const Var = VariableDeclarationCreator('var')

export const ArrowFn = ArrowFunctionExpression