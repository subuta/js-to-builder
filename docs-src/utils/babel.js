import * as Babel from '@babel/standalone'
import _ from 'lodash'

import { h, print, format, simple } from 'js-to-builder'

// expose h to window for eval
window.h = h

// transpile source code by babel.
export const babelAndEval = (builderCode) => {
  const {
    Const,
    Let,
    Var,
    Value,
    ArrowFn,
    FnStatement,
    FnCall,
    Fn,
    Declarator,
    Import,
    Export,
    JSX,
    ClassDef,
    Method
  } = simple

  const code = _.get(Babel.transform(builderCode, {
    'presets': [
      'es2015',
      'stage-2',
      'react'
    ]
  }), 'code', '')

  const builder = eval(`
    (() => {
      ${format(code)}
      return render()
    })()
  `)

  return print(builder)
}

export default babelAndEval
