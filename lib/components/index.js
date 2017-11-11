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

export const BinaryExpression = ({props, children}) => {
  return b.binaryExpression.apply(this, [props.operator, ...children])
}

export const AssignmentExpression = ({props, children}) => {
  return b.assignmentExpression.apply(this, [props.operator, ...children])
}

export const UpdateExpression = ({props, children}) => {
  return b.updateExpression.apply(this, [props.operator, _.first(children), props.prefix])
}

export const FunctionExpression = ({props, children}) => {
  let params = []
  if (children.length > 1) {
    params = children.pop()
  }
  return b.functionExpression.apply(this, [props.id, params, ...children])
}

export const VariableDeclarator = ({children: [id, init]}) => {
  return b.variableDeclarator.apply(this, [id, init || null])
}

export const VariableDeclaration = ({props, children}) => {
  const {kind = null} = props
  return b.variableDeclaration.apply(this, [kind, children])
}

export const ArrowFunctionExpression = ({props, children}) => {
  const params = _.slice(children, 0, -1) // get children except last.
  const body = _.last(children)
  return b.arrowFunctionExpression.apply(this, [params, body])
}

export const BlockStatement = ({props, children}) => {
  return b.blockStatement.apply(this, [children])
}

export const LabeledStatement = ({props, children}) => {
  return b.labeledStatement.apply(this, children)
}

export const ForStatement = ({props, children}) => {
  return b.forStatement.apply(this, children)
}

export const ForInStatement = ({props, children}) => {
  return b.forInStatement.apply(this, children)
}

export const ForOfStatement = ({props, children}) => {
  return b.forOfStatement.apply(this, children)
}

export const BreakStatement = ({props, children}) => {
  return b.breakStatement.apply(this, children)
}

export const ContinueStatement = ({props, children}) => {
  return b.continueStatement.apply(this, children)
}

export const DoWhileStatement = ({props, children}) => {
  return b.doWhileStatement.apply(this, children)
}

export const WhileStatement = ({props, children}) => {
  return b.whileStatement.apply(this, children)
}

export const ImportDeclaration = ({props, children}) => {
  const specifier = _.slice(children, 0, -1) // get children except last.
  const source = _.last(children)
  return b.importDeclaration.apply(this, [specifier, source])
}

export const ImportDefaultSpecifier = ({props, children: [local]}) => {
  return b.importDefaultSpecifier.apply(this, [local])
}

export const ImportNamespaceSpecifier = ({props, children: [local]}) => {
  return b.importNamespaceSpecifier.apply(this, [local])
}

export const ImportSpecifier = ({props, children: [imported, local]}) => {
  return b.importSpecifier.apply(this, [imported, local])
}

export const ExportDefaultDeclaration = ({props, children}) => {
  return b.exportDefaultDeclaration.apply(this, children)
}

export const ExportNamedDeclaration = ({props, children}) => {
  return b.exportNamedDeclaration.apply(this, children)
}

export const ObjectPattern = ({props, children: properties}) => {
  return b.objectPattern.apply(this, [properties])
}

export const AssignmentPattern = ({props, children: [left, right]}) => {
  return b.assignmentPattern.apply(this, [left, right])
}

export const Property = ({props, children: [key, source]}) => {
  const {kind = null, method = false, shorthand = false, computed = false} = props
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
