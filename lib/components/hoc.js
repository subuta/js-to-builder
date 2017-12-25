/** @jsx h */

import h from 'lib/h'

// withExpression hoc
export const withES = (BaseComponent) => ({es, leadingComments, trailingComments, ...rest}) => {
  if (es) {
    return (
      <expressionStatement
        leadingComments={leadingComments}
        trailingComments={trailingComments}
      >
        <BaseComponent {...rest} />
      </expressionStatement>
    )
  }
  return (
    <BaseComponent {...rest} />
  )
}
