import React from 'react'

import classes from './style.js'

import Editor from 'docs-src/components/common/Editor'

export default ({onChange, template}) => {
  return (
    <div className={classes.CodeEditor}>
      <Editor
        onChange={(value) => onChange(value)}
        template={template}
      />
    </div>
  )
}
