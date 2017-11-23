/** @jsx h */

import _ from 'lodash'

import {
  arrowFunctionExpression,
  functionExpression
} from 'lib/components/builtinComponents'

import h from 'lib/h'

import * as types from 'ast-types'

const {namedTypes: n, builders: b} = types

export const Value = (props) => {
  // try to parse as object first.
  const {children} = props
  const value = _.get(props, 'value', _.first(children))
  if (_.isPlainObject(value)) {
    return (
      <objectExpression>
        {_.map(value, (v, k) => (
          <property kind="init" method={false} shorthand={false} computed={false}>
            <identifier>{k}</identifier>
            <literal>{v}</literal>
          </property>
        ))}
      </objectExpression>
    )
  }

  // if value not defined and has empty children.
  if (!value && _.isArray(children) && children.length === 0) return <arrayExpression />

  if (_.isArray(children) && children.length > 1) {
    return (
      <arrayExpression>
        {_.map(children, (value) => (
          <literal>{value}</literal>
        ))}
      </arrayExpression>
    )
  }

  return (
    <literal>{value}</literal>
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
      <variableDeclaration kind={kind}>
        <variableDeclarator>
          <identifier>{name}</identifier>
          <Value>{value}</Value>
        </variableDeclarator>
      </variableDeclaration>
    )
  }

  return (
    <variableDeclaration kind={kind}>
      <variableDeclarator>
        <identifier>{name}</identifier>
        {_.first(children)}
      </variableDeclarator>
    </variableDeclaration>
  )
}

// function call
export const FnCall = (props) => {
  let children = props.children
  let callee = null

  if (n.ExpressionStatement.check(_.first(children))) {
    // Check for nested FnCall
    // shift first child and pass CallExpression as MemberExpression's object.
    callee = (
      <memberExpression>
        {children.shift().expression}
        {<identifier>{props.callee}</identifier>}
      </memberExpression>
    )
  } else if (props.callee.split('.').length > 1) {
    // if callee has dot notation.
    callee = (
      <memberExpression>
        {_.map(props.callee.split('.'), (item) => <identifier>{item}</identifier>)}
      </memberExpression>
    )
  } else {
    callee = (
      <identifier>{props.callee}</identifier>
    )
  }

  return (
    <expressionStatement>
      <callExpression>
        {[
          callee,
          ...children
        ]}
      </callExpression>
    </expressionStatement>
  )
}

export const FnStatement = ({children}) => {
  if (children.length === 1) {
    const child = _.first(children)
    // if FnCall passed.
    if (n.ExpressionStatement.check(child)) {
      return child.expression
    }
    return child
  }

  return (
    <blockStatement>{children}</blockStatement>
  )
}

export const JSX = (props) => {
  const {tagName, children, ...rest} = props

  const attributes = _.reduce(rest, (result, value, key) => {
    let jsxValue = <Value>{value}</Value>

    // if object or false(bool)
    if (_.isPlainObject(value) || value === false) {
      jsxValue = <jsxExpressionContainer>{jsxValue}</jsxExpressionContainer>
    }

    // if key only props(eg: hidden)
    if (value === true) {
      jsxValue = null
    }

    return [...result, (
      <jsxAttribute
        name={<jsxIdentifier name={key} />}
        value={jsxValue}
      />
    )]
  }, [])

  const jsxChildren = _.map(children, (child) => {
    if (_.isString(child)) {
      return <jsxText>{child}</jsxText>
    }
    return child
  })

  return (
    <jsxElement>
      {[
        <jsxOpeningElement
          name={<jsxIdentifier name={tagName} />}
          attributes={attributes}
          selfClosing={false}
        />,
        ...jsxChildren,
        <jsxClosingElement name={<jsxIdentifier name={tagName} />} />
      ]}
    </jsxElement>
  )
}

// const
export const Const = VariableDeclarationCreator('const')
export const Let = VariableDeclarationCreator('let')
export const Var = VariableDeclarationCreator('var')

export const ArrowFn = arrowFunctionExpression
export const Fn = functionExpression
