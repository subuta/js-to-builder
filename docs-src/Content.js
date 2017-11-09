import React from 'react'
import _ from 'lodash'

import {
  compose,
  withState,
  withPropsOnChange
} from 'recompose'

import { toBuilder, format } from 'js-to-builder'

const enhance = compose(
  withState('code', 'setCode', 'const hoge = "fuga";'),
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

export default enhance(({code, setCode, jsx, error}) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      height: '100vh',
      fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace',
      fontSize: 13,
      color: '#24292e',
      wordWrap: 'normal',
      whiteSpace: 'pre'
    }}>
      <textarea
        onInput={(e) => setCode(e.target.value)}
        style={{
          padding: 8,
          flex: 1,
          height: '90%',
          fontSize: 13
        }}
        defaultValue={code}
        cols="30"
        rows="10"
      />
      <pre
        style={{
          margin: '0 0 0 16px',
          padding: 8,
          color: error ? 'red' : 'inherit',
          flex: 1,
          height: '90%'
        }}
      >
        {error ? error.toString() : jsx}
      </pre>
    </div>
  )
})
