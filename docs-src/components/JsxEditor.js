import React from 'react'

import Editor from 'docs-src/components/common/Editor'

import _ from 'lodash'

import {
  compose,
  branch,
  renderComponent
} from 'recompose'

import classes from './style.js'

const enhance = compose(
  branch(
    ({jsx, error}) => !jsx || error,
    renderComponent(({error}) => {
      return (
        <div className={classes.JsxEditor}>
          <p className="is-error">{error ? error.toString() : ''}</p>
        </div>
      )
    }),
    _.identity
  )
)

export default enhance(({onChange, jsx}) => {
  return (
    <div className={classes.JsxEditor}>
      <Editor
        onChange={(value) => onChange(value)}
        template={jsx}
      />
    </div>
  )
})
