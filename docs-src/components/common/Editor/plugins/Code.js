import React from 'react'

const CodeLine = (props) => {
  const {node} = props
  const error = node.data.get('error')

  let rowClass = 'line-numbers-rows'
  if (error) {
    rowClass += ' has-error'
  }

  return (
    <div
      className="line"
      data-key={node.key}
    >
      <span
        className={rowClass}
        contentEditable={false}
        title={error}
      />
      {props.children}
    </div>
  )
}

export default (options = {}) => {
  return {
    renderNode (props) {
      const {node, attributes, children} = props
      if (node.type === 'code') {
        return <pre className="line-numbers"><code {...attributes}>{children}</code></pre>
      } else if (node.type === 'code_line') {
        return <CodeLine {...props}>{children}</CodeLine>
      }
    }
  }
}
