import React from 'react'

import Editor from 'docs-src/components/common/Editor'

import _ from 'lodash'

import {
  compose,
} from 'recompose'

import classes from './style.js'

const enhance = compose()

export default enhance(({onChange, jsx = '', error}) => {
  return (
    <div className={classes.JsxEditor}>
      <Editor
        onChange={(value) => onChange(value)}
        template={jsx}
      />

      {error ? error.toString() : ''}
    </div>
  )
})
