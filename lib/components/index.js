import * as types from 'ast-types'
const {builders: b} = types

// AST(JSX) to builder
export const ExpressionStatement = ({children}) => {
  return b.expressionStatement.apply(this, children)
}

export const CallExpression = ({children: [source, ...args]}) => {
  return b.callExpression.apply(this, [source, args])
}

export const Identifier = ({children}) => {
  return b.identifier.apply(this, children)
}
