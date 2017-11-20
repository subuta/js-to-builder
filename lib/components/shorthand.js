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
  FunctionExpression,
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

  JSXElement,
  JSXOpeningElement,
  JSXIdentifier,
  JSXText,
  JSXClosingElement,
  JSXAttribute,
  JSXExpressionContainer
} from 'lib/components'

export const Value = (props) => {
  // try to parse as object first.
  const {children} = props
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

export const VariableDeclarationCreator = (kind) => (props) => {
  const {
    name,
    value,
    children
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
export const FnCall = (props) => {
  const {children} = props
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

export const FnStatement = ({children}) => {
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

export const JSX = (props) => {
  const {tagName, children, ...rest} = props

  const attributes = _.reduce(rest, (result, value, key) => {
    let jsxValue = <Value>{value}</Value>

    // if object or false(bool)
    if (_.isPlainObject(value) || value === false) {
      jsxValue = <JSXExpressionContainer>{jsxValue}</JSXExpressionContainer>
    }

    // if key only props(eg: hidden)
    if (value === true) {
      jsxValue = null
    }

    return [...result, (
      <JSXAttribute
        name={<JSXIdentifier name={key} />}
        value={jsxValue}
      />
    )]
  }, [])

  const jsxChildren = _.map(children, (child) => {
    if (_.isString(child)) {
      return <JSXText>{child}</JSXText>
    }
    return child
  })

  return (
    <JSXElement>
      {[
        <JSXOpeningElement
          name={<JSXIdentifier name={tagName} />}
          attributes={attributes}
          selfClosing={false}
        />,
        ...jsxChildren,
        <JSXClosingElement name={<JSXIdentifier name={tagName} />} />
      ]}
    </JSXElement>
  )
}

// const
export const Const = VariableDeclarationCreator('const')
export const Let = VariableDeclarationCreator('let')
export const Var = VariableDeclarationCreator('var')

export const ArrowFn = ArrowFunctionExpression
export const Fn = FunctionExpression
