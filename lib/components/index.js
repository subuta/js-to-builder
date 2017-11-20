import _ from 'lodash'

import * as types from 'ast-types'
const {builders: b} = types

// AST(JSX) to builder
export const Program = ({children}) => {
  return b.program.apply(this, [children])
}

export const ReturnStatement = ({children}) => {
  return b.returnStatement.apply(this, children)
}

export const DebuggerStatement = ({children}) => {
  return b.debuggerStatement.apply(this, children)
}

export const ExpressionStatement = ({children}) => {
  return b.expressionStatement.apply(this, children)
}

export const IfStatement = ({children}) => {
  return b.ifStatement.apply(this, children)
}

export const CallExpression = ({children: [source, ...args]}) => {
  return b.callExpression.apply(this, [source, args])
}

export const MemberExpression = ({children: [object, property]}) => {
  return b.memberExpression.apply(this, [object, property])
}

export const ArrayExpression = ({children}) => {
  return b.arrayExpression.apply(this, [children])
}

export const ObjectExpression = ({children}) => {
  return b.objectExpression.apply(this, [children])
}

export const BinaryExpression = ({operator, children}) => {
  return b.binaryExpression.apply(this, [operator, ...children])
}

export const AssignmentExpression = ({operator, children}) => {
  return b.assignmentExpression.apply(this, [operator, ...children])
}

export const UpdateExpression = ({operator, prefix, children}) => {
  return b.updateExpression.apply(this, [operator, _.first(children), prefix])
}

export const FunctionExpression = ({id, children}) => {
  let params = []
  if (children.length > 1) {
    params = children.pop()
  }
  return b.functionExpression.apply(this, [id, params, ...children])
}

export const VariableDeclarator = ({children: [id, init]}) => {
  return b.variableDeclarator.apply(this, [id, init || null])
}

export const VariableDeclaration = (props) => {
  const {kind = null} = props
  return b.variableDeclaration.apply(this, [kind, props.children])
}

export const ArrowFunctionExpression = ({children}) => {
  const params = _.slice(children, 0, -1) // get children except last.
  const body = _.last(children)
  return b.arrowFunctionExpression.apply(this, [params, body])
}

export const BlockStatement = ({children}) => {
  return b.blockStatement.apply(this, [children])
}

export const LabeledStatement = ({children}) => {
  return b.labeledStatement.apply(this, children)
}

export const ForStatement = ({children}) => {
  return b.forStatement.apply(this, children)
}

export const ForInStatement = ({children}) => {
  return b.forInStatement.apply(this, children)
}

export const ForOfStatement = ({children}) => {
  return b.forOfStatement.apply(this, children)
}

export const BreakStatement = ({children}) => {
  return b.breakStatement.apply(this, children)
}

export const ContinueStatement = ({children}) => {
  return b.continueStatement.apply(this, children)
}

export const DoWhileStatement = ({children}) => {
  return b.doWhileStatement.apply(this, children)
}

export const WhileStatement = ({children}) => {
  return b.whileStatement.apply(this, children)
}

export const ImportDeclaration = ({children}) => {
  const source = children.pop()
  const specifier = children
  return b.importDeclaration.apply(this, [specifier, source])
}

export const ImportDefaultSpecifier = ({children: [local]}) => {
  return b.importDefaultSpecifier.apply(this, [local])
}

export const ImportNamespaceSpecifier = ({children: [local]}) => {
  return b.importNamespaceSpecifier.apply(this, [local])
}

export const ImportSpecifier = ({children: [imported, local]}) => {
  return b.importSpecifier.apply(this, [imported, local])
}

export const ExportDefaultDeclaration = ({children}) => {
  return b.exportDefaultDeclaration.apply(this, children)
}

export const ExportNamedDeclaration = ({children}) => {
  return b.exportNamedDeclaration.apply(this, children)
}

export const ObjectPattern = ({children: properties}) => {
  return b.objectPattern.apply(this, [properties])
}

export const AssignmentPattern = ({children: [left, right]}) => {
  return b.assignmentPattern.apply(this, [left, right])
}

export const Property = (props) => {
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

export const Identifier = ({children}) => {
  return b.identifier.apply(this, children)
}

export const Literal = ({children}) => {
  return b.literal.apply(this, children)
}

// JSX
export const JSXElement = ({children}) => {
  const openElement = children.shift() // first one
  const closeElement = children.pop() // last one
  return b.jsxElement.apply(this, [openElement, closeElement, children])
}

export const JSXOpeningElement = ({name, attributes, selfClosing}) => {
  return b.jsxOpeningElement.apply(this, [name, attributes, selfClosing])
}

export const JSXClosingElement = ({name}) => {
  return b.jsxClosingElement.apply(this, [name])
}

export const JSXIdentifier = ({name, children}) => {
  return b.jsxIdentifier.apply(this, [name, children])
}

export const JSXAttribute = ({name, value}) => {
  return b.jsxAttribute.apply(this, [name, value])
}

export const JSXExpressionContainer = ({children}) => {
  return b.jsxExpressionContainer.apply(this, children)
}

export const JSXText = ({children}) => {
  return b.jsxText.apply(this, children)
}
