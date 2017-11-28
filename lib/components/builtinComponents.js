import _ from 'lodash'

import * as types from 'ast-types'

const {namedTypes: n, builders: b} = types

import {
  withES
} from 'lib/components/hoc'

// AST(JSX) to builder
export const program = ({children}) => {
  return b.program.apply(this, [children])
}

export const returnStatement = ({children}) => {
  return b.returnStatement.apply(this, children)
}

export const debuggerStatement = ({children}) => {
  return b.debuggerStatement.apply(this, children)
}

export const expressionStatement = ({children}) => {
  return b.expressionStatement.apply(this, children)
}

export const ifStatement = ({children}) => {
  return b.ifStatement.apply(this, children)
}

export const callExpression = ({children: [source, ...args]}) => {
  return b.callExpression.apply(this, [source, args])
}

export const memberExpression = ({children: [object, property]}) => {
  return b.memberExpression.apply(this, [object, property])
}

export const arrayExpression = ({children}) => {
  return b.arrayExpression.apply(this, [children])
}

export const objectExpression = ({children}) => {
  return b.objectExpression.apply(this, [children])
}

export const binaryExpression = ({operator, children}) => {
  return b.binaryExpression.apply(this, [operator, ...children])
}

export const assignmentExpression = ({operator, children}) => {
  return b.assignmentExpression.apply(this, [operator, ...children])
}

export const updateExpression = ({operator, prefix, children}) => {
  return b.updateExpression.apply(this, [operator, _.first(children), prefix])
}

export const functionExpression = ({id = null, generator = false, async = false, children}) => {
  const params = _.slice(children, 0, -1) // get children except last.
  const body = _.last(children)
  return {
    ...b.functionExpression.apply(this, [id, params, body]),
    generator,
    async
  }
}

export const variableDeclarator = ({children: [id, init]}) => {
  return b.variableDeclarator.apply(this, [id, init || null])
}

export const variableDeclaration = (props) => {
  const {kind = null} = props
  return b.variableDeclaration.apply(this, [kind, props.children])
}

export const arrowFunctionExpression = ({generator = false, async = false, children}) => {
  const params = _.slice(children, 0, -1) // get children except last.
  const body = _.last(children)
  return {
    ...b.arrowFunctionExpression.apply(this, [params, body]),
    generator,
    async
  }
}

export const blockStatement = ({children}) => {
  return b.blockStatement.apply(this, [children])
}

export const labeledStatement = ({children}) => {
  return b.labeledStatement.apply(this, children)
}

export const forStatement = ({children}) => {
  return b.forStatement.apply(this, children)
}

export const forInStatement = ({children}) => {
  return b.forInStatement.apply(this, children)
}

export const forOfStatement = ({children}) => {
  return b.forOfStatement.apply(this, children)
}

export const breakStatement = ({children}) => {
  return b.breakStatement.apply(this, children)
}

export const continueStatement = ({children}) => {
  return b.continueStatement.apply(this, children)
}

export const doWhileStatement = ({children}) => {
  return b.doWhileStatement.apply(this, children)
}

export const whileStatement = ({children}) => {
  return b.whileStatement.apply(this, children)
}

export const importDeclaration = ({children}) => {
  const source = children.pop()
  const specifier = children
  return b.importDeclaration.apply(this, [specifier, source])
}

export const importDefaultSpecifier = ({children: [local]}) => {
  return b.importDefaultSpecifier.apply(this, [local])
}

export const importNamespaceSpecifier = ({children: [local]}) => {
  return b.importNamespaceSpecifier.apply(this, [local])
}

export const importSpecifier = ({children: [imported, local]}) => {
  return b.importSpecifier.apply(this, [imported, local])
}

export const exportDefaultDeclaration = ({children}) => {
  return b.exportDefaultDeclaration.apply(this, children)
}

export const exportNamedDeclaration = ({children}) => {
  return b.exportNamedDeclaration.apply(this, children)
}

export const objectPattern = ({children: properties}) => {
  return b.objectPattern.apply(this, [properties])
}

export const assignmentPattern = ({children: [left, right]}) => {
  return b.assignmentPattern.apply(this, [left, right])
}

export const property = (props) => {
  const {kind = null, method = false, shorthand = false, computed = false} = props
  const [key, source] = props.children
  // FIXME: https://github.com/benjamn/ast-types/issues/161
  return {
    ...b.property(kind, key, source),
    method,
    shorthand,
    computed
  }
}

export const identifier = withES(({children}) => {
  return b.identifier.apply(this, children)
})

export const literal = ({children}) => {
  return b.literal.apply(this, children)
}

// JSX
export const jsxElement = ({children}) => {
  const openElement = children.shift() // first one
  const closeElement = children.pop() // last one
  return b.jsxElement.apply(this, [openElement, closeElement, children])
}

export const jsxOpeningElement = ({name, attributes, selfClosing}) => {
  return b.jsxOpeningElement.apply(this, [name, attributes, selfClosing])
}

export const jsxClosingElement = ({name}) => {
  return b.jsxClosingElement.apply(this, [name])
}

export const jsxIdentifier = ({name, children}) => {
  return b.jsxIdentifier.apply(this, [name, children])
}

export const jsxAttribute = ({name, value}) => {
  return b.jsxAttribute.apply(this, [name, value])
}

export const jsxExpressionContainer = ({children}) => {
  return b.jsxExpressionContainer.apply(this, children)
}

export const jsxText = ({children}) => {
  return b.jsxText.apply(this, children)
}

// ES6
export const yieldExpression = ({children}) => {
  return b.yieldExpression.apply(this, children)
}

// ES7
export const awaitExpression = ({children}) => {
  return b.awaitExpression.apply(this, children)
}

export default {
  program,

  forStatement,
  forInStatement,
  forOfStatement,
  debuggerStatement,
  returnStatement,
  expressionStatement,

  callExpression,
  arrayExpression,
  objectExpression,
  arrowFunctionExpression,
  memberExpression,
  binaryExpression,
  assignmentExpression,
  updateExpression,
  functionExpression,

  blockStatement,
  ifStatement,
  labeledStatement,
  breakStatement,
  doWhileStatement,
  whileStatement,
  continueStatement,

  property,

  importDeclaration,
  importDefaultSpecifier,
  importNamespaceSpecifier,
  importSpecifier,

  exportDefaultDeclaration,
  exportNamedDeclaration,

  assignmentPattern,
  objectPattern,

  variableDeclaration,
  variableDeclarator,

  identifier,
  literal,

  // JSX
  jsxElement,
  jsxOpeningElement,
  jsxIdentifier,
  jsxText,
  jsxClosingElement,
  jsxAttribute,
  jsxExpressionContainer,

  // ES6
  yieldExpression,

  // ES7
  awaitExpression
}
