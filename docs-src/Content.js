import React from 'react'
import _ from 'lodash'

import {
  compose,
  withState,
  withPropsOnChange
} from 'recompose'

import { toBuilder, format } from 'js-to-builder'

const enhance = compose(
  withState('code', 'setCode', ''),
  withState('error', 'setError', null),
  withPropsOnChange(
    ['code', 'setCode'],
    ({code, setCode, setError}) => {
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

export default enhance(({setCode, jsx, error}) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      height: '100vh'
    }}>
      <textarea
        onInput={(e) => setCode(e.target.value)}
        style={{
          flex: 1,
          height: '90%'
        }}
        cols="30"
        rows="10"
      />
      <pre
        style={{
          margin: '0 0 0 16px',
          color: error ? 'red' : 'black',
          flex: 1,
          height: '90%'
        }}
      >
        {error ? error.toString() : jsx}
      </pre>
    </div>
  )
})
