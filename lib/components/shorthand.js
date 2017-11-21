/** @jsx h */

import _ from 'lodash'

import h, {
  arrowFunctionExpression,
  functionExpression
} from 'lib/h'

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
  const {children} = props
  let callee = <identifier>{props.callee}</identifier>
  if (props.callee && props.callee.split('.').length > 1) {
    callee = (
      <memberExpression>
        {_.map(props.callee.split('.'), (item) => <identifier>{item}</identifier>)}
      </memberExpression>
    )
  }
  return (
    <callExpression>
      {[
        callee,
        ...children
      ]}
    </callExpression>
  )
}

export const FnStatement = ({children}) => {
  if (children.length === 1) {
    return _.first(children)
  }

  return (
    <blockStatement>
      {_.map(children, (child) => {
        // wrap with ExpressionStatement if child is not statement.
        if (!n.Statement.check(child)) {
          return (
            <expressionStatement>{child}</expressionStatement>
          )
        }
        return child
      })}
    </blockStatement>
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
