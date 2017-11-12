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
      onChange: _.debounce(onChange, 10)
    })
  ),
  withPropsOnChange(
    ['template'],
    ({template, setValue}) => {
      // update Value and parent htmlPart.
      setValue(createInitialState(template.split('\n')))
    }
  ),
  withHandlers({
    handleChange: (props) => ({value}) => {
      const {onChange, setValue} = props
      if (value.document !== props.value.document) {
        // trigger onChange only if document changed.
        onChange(Plain.serialize(value))
      }
      setValue(value)
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
