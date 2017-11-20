import * as Babel from '@babel/standalone'
import _ from 'lodash'

import { h, print, format, components, shorthand } from 'js-to-builder'

// expose h to window for eval
window.h = h

// transpile source code by babel.
export const babelAndEval = (builderCode) => {
  const {
    Program,

    ForStatement,
    ForInStatement,
    ForOfStatement,
    DebuggerStatement,
    ReturnStatement,
    ExpressionStatement,

    CallExpression,
    ArrayExpression,
    ObjectExpression,
    ArrowFunctionExpression,
    MemberExpression,
    BinaryExpression,
    AssignmentExpression,
    UpdateExpression,
    FunctionExpression,

    BlockStatement,
    IfStatement,
    LabeledStatement,
    BreakStatement,
    DoWhileStatement,
    WhileStatement,
    ContinueStatement,

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
    JSXClosingElement
  } = components

  const {
    Const,
    Let,
    Var,
    Value,
    ArrowFn,
    FnStatement,
    FnCall,
    JSX
  } = shorthand

  const code = _.get(Babel.transform(builderCode, {
    'presets': [
      'es2015',
      'stage-2',
      'react'
    ]
  }), 'code', '')

  const builder = eval(`
    (() => {
      ${format(code)}
      return render()
    })()
  `)

  return print(builder)
}

export default babelAndEval
