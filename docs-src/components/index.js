import React from 'react'
import _ from 'lodash'

import {
  compose,
  withState,
  withPropsOnChange
} from 'recompose'

import classes from './style.js'

import CodeEditor from './CodeEditor'
import JsxEditor from './JsxEditor'

import { toBuilder, format } from 'js-to-builder'

const initialCode = 'const hoge = "fuga";'

const enhance = compose(
  withState('code', 'setCode', ''),
  withState('error', 'setError', null),
  withPropsOnChange(
    ['code', 'setCode'],
    ({code, setCode}) => {
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
        setCode: _.debounce(setCode, 100) // debounce setCode call
      }
    }
  )
)

export default enhance(({ setCode, jsx, error }) => {
  return (
    <div className={classes.Content}>
      <CodeEditor
        onChange={(value) => setCode(value)}
        template={initialCode}
      />

      <JsxEditor
        onChange={(value) => console.log('jsx edited', jsx)}
        jsx={jsx}
        error={error}
      />
    </div>
  )
})
