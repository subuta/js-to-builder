/** @jsx h */

import { createHyperscript } from 'slate-hyperscript'
import _ from 'lodash'

const h = createHyperscript({
  blocks: {
    code: 'code',
    code_line: 'code_line'
  },
  inlines: {},
  marks: {}
})

module.exports = (children) => {
  return (
    <value>
      <document>
        <code className="language-jsx" style={{color: 'red'}}>
          {_.map(children, (child, i) => <code_line>{child}</code_line>)}
        </code>
      </document>
    </value>
  )
}
