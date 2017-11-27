import React from 'react'
import _ from 'lodash'

import {
  compose,
  withState,
  withPropsOnChange,
  withHandlers
} from 'recompose'

import classes from './style.js'

import { components, shorthand, toBuilder, print, format } from 'js-to-builder'

import Editor from 'docs-src/components/common/Editor'
import { babelAndEval } from 'docs-src/utils/babel'

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
        // TODO: add simple: true / false toggle.
        jsx = format(toBuilder(code).code)
        // jsx = format(toBuilder(code, {simple: true}).code)
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
        const code = format(babelAndEval(jsxCode))
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
