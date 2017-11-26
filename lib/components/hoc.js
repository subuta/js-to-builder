/** @jsx h */

import h from 'lib/h'

// withExpression hoc
export const withES = (BaseComponent) => ({es, ...rest}) => {
  if (es) {
    return (
      <expressionStatement>
        <BaseComponent {...rest} />
      </expressionStatement>
    )
  }
  return (
    <BaseComponent {...rest} />
  )
}
