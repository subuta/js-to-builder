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
    handleBuilderChange: ({setCodeTemplate, setBuilderError}) => (value) => {
      if (_.isEmpty(value)) return
      const jsxCode = `/** @jsx h */ ${value}`
      try {
        const code = format(renderBuilder(jsxCode))
        setBuilderError(null)
        setCodeTemplate(code)
      } catch (e) {
        setBuilderError(e)
      }
    }
  })
)

const babelOptions = {
  'presets': [
    'es2015',
    'stage-2',
    'react'
  ]
}

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
    <div className={classes.Content}>
      <Editor
        className={classes.Editor}
        onChange={(value) => {
          setCode(value)
        }}
        template={codeTemplate}
        error={codeError}
      />

      <Editor
        className={classes.Editor}
        onChange={handleBuilderChange}
        template={jsx || ''}
        error={builderError}
      />
    </div>
  )
})
