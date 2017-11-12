import React from 'react'
import _ from 'lodash'

import * as Babel from '@babel/standalone'

import {
  compose,
  withState,
  withPropsOnChange
} from 'recompose'

import classes from './style.js'

import { components, h, toBuilder, print, format } from 'js-to-builder'

// expose h to window for eval
window.h = h

const renderBuilder = (builderCode) => {
  const code = _.get(Babel.transform(builderCode, babelOptions), 'code', '')
  // FIXME: remove eval.
  const builder = eval(`
            (() => {
              ${format(code)}
              return render()
            })()
          `)
  return print(builder)
}

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

import CodeEditor from './CodeEditor'
import JsxEditor from './JsxEditor'

const enhance = compose(
  withState('code', 'setCode', ''),
  withState('codeTemplate', 'setCodeTemplate', `const hoge = 'fuga'`),
  withState('error', 'setError', null),
  withPropsOnChange(
    ['code', 'setCode', 'setCodeTemplate'],
    ({code, setCode, setCodeTemplate}) => {
      let jsx = ''
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
        error,
        setCode: _.debounce(setCode, 1000 / 60), // debounce setCode call
        setCodeTemplate: _.debounce(setCodeTemplate, 1000 / 60) // debounce setCodeTemplate call
      }
    }
  )
)

const babelOptions = {
  'presets': [
    'es2015',
    'stage-2',
    'react'
  ]
}

// FIXME: 編集中のeditorのフォーカスが外れるのを直す。
export default enhance((props) => {
  const {
    setCode,
    jsx,
    error,
    codeTemplate,
    setCodeTemplate
  } = props

  return (
    <div className={classes.Content}>
      <CodeEditor
        onChange={(value) => {
          setCode(value)
        }}
        template={codeTemplate}
      />

      <JsxEditor
        onChange={(value) => {
          const jsxCode = `/** @jsx h */ ${value}`
          try {
            const code = format(renderBuilder(jsxCode))
            window.requestAnimationFrame(() => setCodeTemplate(code))
          } catch (e) {
            console.log('error on eval', e)
          }
        }}
        jsx={jsx}
        error={error}
      />
    </div>
  )
})
