/** @jsx h */

import _ from 'lodash'

import {
  withES
} from 'lib/components/hoc'

import h from 'lib/h'
import * as types from 'ast-types'

const {namedTypes: n, builders: b} = types

export const Value = withES((props) => {
  // try to parse as object first.
  const {children} = props
  const value = _.get(props, 'value', _.first(children))
  if (_.isPlainObject(value)) {
    return (
      <objectExpression>
        {_.map(value, (v, k) => (
          <property kind='init' method={false} shorthand={false} computed={false}>
            <identifier>{k}</identifier>
            <literal>{v}</literal>
          </property>
        ))}
      </objectExpression>
    )
  }

  // if value not defined and has empty children.
  if (value === undefined && _.isArray(children) && children.length === 0) return <arrayExpression />

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
})

export const Declarator = (props) => {
  const {children} = props

  let value = props.value
  if (props.value) {
    value = (
      <Value>{props.value}</Value>
    )
  } else {
    value = _.last(children)
  }

  let name = _.first(children)
  if (props.name) {
    name = <identifier>{props.name}</identifier>
  }

  return (
    <variableDeclarator>
      {name}
      {value || null}
    </variableDeclarator>
  )
}

const VariableDeclarationCreator = (kind) => (props) => {
  const {
    leadingComments,
    trailingComments,
    ...rest
  } = props

  const children = (() => {
    // props.value or if not wrapped with VariableDeclarator.
    if (props.value || !n.VariableDeclarator.check(_.first(props.children))) {
      return (
        <Declarator {...rest} />
      )
    }
    return props.children
  })()

  return (
    <variableDeclaration
      kind={kind}
      leadingComments={leadingComments}
      trailingComments={trailingComments}
    >
      {children}
    </variableDeclaration>
  )
}

// function call
export const FnCall = withES((props) => {
  let children = props.children

  // if callee omitted.
  if (!props.callee) return <callExpression>{children}</callExpression>

  let callee = <identifier>{props.callee}</identifier>
  if (_.indexOf(props.callee, '.') > -1 && props.callee.split('.').length > 1) {
    // if callee has dot notation.
    callee = (
      <memberExpression>
        {_.map(props.callee.split('.'), (item) => <identifier>{item}</identifier>)}
      </memberExpression>
    )
  } else if (n.CallExpression.check(_.first(children))) {
    // Check for nested FnCall
    // shift first child and pass CallExpression as MemberExpression's object.
    callee = (
      <memberExpression>
        {children.shift()}
        {<identifier>{props.callee}</identifier>}
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
})

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
      return <jsxText value={child} />
    }
    return child
  })

  return (
    <jsxElement>
      {[
        <jsxOpeningElement selfClosing={false}>
          {[
            <jsxIdentifier name={tagName} />,
            ...attributes
          ]}
        </jsxOpeningElement>,
        <jsxClosingElement>
          <jsxIdentifier name={tagName} />
        </jsxClosingElement>,
        ...jsxChildren
      ]}
    </jsxElement>
  )
}

export const Import = (props) => {
  let specifiers = []

  if (props.name) {
    specifiers = [(
      <importNamespaceSpecifier>
        <identifier name={props.name} />
      </importNamespaceSpecifier>
    )]

    if (props.default) {
      specifiers = [(
        <importDefaultSpecifier>
          <identifier name={props.name} />
        </importDefaultSpecifier>
      )]
    }
  }

  if (!_.isEmpty(props.children)) {
    specifiers = props.children
  }

  return (
    <importDeclaration
      importKind="value"
      leadingComments={props.leadingComments}
      trailingComments={props.trailingComments}
    >
      {[
        ...specifiers,
        <literal value={props.source} />
      ]}
    </importDeclaration>
  )
}

export const Export = (props) => {
  const {children} = props

  if (props.default) {
    return (
      <exportDefaultDeclaration
        leadingComments={props.leadingComments}
        trailingComments={props.trailingComments}
      >
        {children}
      </exportDefaultDeclaration>
    )
  }

  // otherwise treat as named export.
  return (
    <exportNamedDeclaration source={null}>
      {children}
    </exportNamedDeclaration>
  )
}

export const Fn = (props) => {
  const nextProps = {
    ...props,
    // wrap id with identifier.
    id: props.id ? <identifier>{props.id}</identifier> : null
  }
  return <functionExpression {...nextProps} />
}

export const ClassDef = (props) => {
  const {children} = props
  const id = props.id ? <identifier>{props.id}</identifier> : null
  let superClass = null
  if (!n.MethodDefinition.check(_.last(children))) {
    superClass = children.pop()
  }

  return (
    <classDeclaration
      id={id}
      leadingComments={props.leadingComments}
      trailingComments={props.trailingComments}
    >
      <classBody>
        {children}
      </classBody>
      {superClass}
    </classDeclaration>
  )
}

export const Method = (props) => {
  const {kind, children} = props
  const key = props.key ? <identifier>{props.key}</identifier> : children.shift()
  return (
    <methodDefinition
      kind={kind}
      static={props.static}
      leadingComments={props.leadingComments}
      trailingComments={props.trailingComments}
    >
      {key}
      {children}
    </methodDefinition>
  )
}

// const
export const Const = VariableDeclarationCreator('const')
export const Let = VariableDeclarationCreator('let')
export const Var = VariableDeclarationCreator('var')

export const ArrowFn = (props) => <arrowFunctionExpression {...props} />
