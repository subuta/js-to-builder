import React from 'react'
import _ from 'lodash'

import * as Babel from '@babel/standalone'

import {
  compose,
  withState,
  withPropsOnChange,
  withHandlers
} from 'recompose'

import classes from './style.js'

import { components, shorthand, h, toBuilder, print, format } from 'js-to-builder'

// expose h to window for eval
window.h = h

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
} = components

const {
  Const,
  Let,
  Var,
  Value,
  ArrowFn,
  FnStatement,
  FnCall
} = shorthand

import Editor from 'docs-src/components/common/Editor'

const enhance = compose(
  withState('code', 'setCode', ''),
  withState('codeTemplate', 'setCodeTemplate', `const hoge = 'fuga'`),
  withState('builderError', 'setBuilderError', null),
  withPropsOnChange(
    ['code', 'setCode', 'setCodeTemplate'],
    ({code, setCode, setCodeTemplate}) => {
      let jsx = null
      let error = null

      if (_.isEmpty(code)) return

      // because toBuilder will throw syntax error while editing :)
      try {
        jsx = format(toBuilder(code, {to: 'jsx'}).code)
      } catch (e) {
        error = e.toString()
      }

      return {
        jsx,
        codeError: error,
        setCode: _.debounce(setCode, 1000 / 60), // debounce setCode call
        setCodeTemplate: _.debounce(setCodeTemplate, 1000 / 60) // debounce setCodeTemplate call
      }
    }
  ),
  withHandlers({
    renderBuilder: () => (builderCode) => {
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
  }),
  withHandlers({
    handleBuilderChange: ({setCodeTemplate, setBuilderError, renderBuilder}) => (value) => {
      if (_.isEmpty(value)) return
      const jsxCode = `/** @jsx h */ ${value}`
      try {
        const code = format(renderBuilder(jsxCode))
        setBuilderError(null)
        setCodeTemplate(format(`
          ${code}
        `))
      } catch (e) {
        setBuilderError(e)
      }
    }
  })
)

export default enhance((props) => {
  const {
    setCode,
    jsx,
    codeError,
    builderError,
    codeTemplate,
    handleBuilderChange
  } = props

  return (
    <div>
      <div className={classes.Content}>
        <h3>js-to-builder</h3>

        <a href="https://github.com/subuta/js-to-builder" target="_blank">https://github.com/subuta/js-to-builder</a>

        <div className={classes.Editors}>
          <Editor
            onChange={(value) => {
              setCode(value)
            }}
            template={codeTemplate}
            error={codeError}
          />

          <Editor
            onChange={handleBuilderChange}
            template={jsx || ''}
            error={builderError}
          />
        </div>
      </div>

      <div className={classes.Footer}>
        <a href="https://github.com/subuta" target="_blank">by @subuta</a>
      </div>
    </div>
  )
})
