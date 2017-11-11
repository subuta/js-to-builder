import React from 'react'
import Plain from 'slate-plain-serializer'
import _ from 'lodash'

import {
  compose,
  withPropsOnChange,
  withState,
  withHandlers
} from 'recompose'

import classes from './style'
import plugins from './plugins'
import createInitialState from './createInitialState'

// Import the Slate editor.
import { Editor } from 'slate-react'

const enhance = compose(
  withState('value', 'setValue', ({template = ''}) => createInitialState(template.split('\n'))),
  withPropsOnChange(
    ['onChange'],
    ({onChange}) => ({
      onChange: _.debounce(onChange, 1000 / 60)
    })
  ),
  withPropsOnChange(
    ['template'],
    ({template, onChange, setValue}) => {
      // update Value and parent htmlPart.
      setValue(createInitialState(template.split('\n')))
      onChange(template)
    }
  ),
  withHandlers({
    handleChange: ({onChange, setValue}) => ({value}) => {
      // const {startBlock, document} = change.state
      const html = Plain.serialize(value)
      // update Value and parent htmlPart.
      setValue(value)
      onChange(html)
    }
  })
)

export default enhance((props) => {
  const {
    value,
    handleChange,
  } = props

  return (
    <Editor
      className={classes.Editor}
      placeholder='enter some code'
      plugins={plugins}
      value={value}
      onChange={handleChange}
    />
  )
})
