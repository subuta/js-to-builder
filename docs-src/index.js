import React from 'react'
import ReactDOM from 'react-dom'

import _ from 'lodash'
window._ = _

import './style'
import { wrap } from './utils/style'

import Content from './components'

let App = () => {
  return (
    <div>
      <Content />
    </div>
  )
}

// styleを注入する。
App = wrap(App)

let render = () => {
  const appNode = document.getElementById('app')
  ReactDOM.render(<App />, appNode)
}

// Native
// Check if the DOMContentLoaded has already been completed
if (document.readyState === 'complete' || document.readyState !== 'loading') {
  render()
} else {
  document.addEventListener('DOMContentLoaded', render)
}
