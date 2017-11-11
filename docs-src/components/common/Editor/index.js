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
    handleChange: ({onChange, setValue}) => ({value}) => {
      // const {startBlock, document} = change.state
      // update Value and parent htmlPart.
      setValue(value)
      onChange(Plain.serialize(value))
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
