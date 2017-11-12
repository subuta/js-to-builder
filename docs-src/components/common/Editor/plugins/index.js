import Prism from 'slate-prism'

// import jsx syntax
import 'prismjs/components/prism-jsx'

import EditCode from 'slate-edit-code'
import IMEFix from './IMEFix'
import Code from './Code'

export default [
  IMEFix(),
  Code(),
  Prism({
    onlyIn: (node) => node.type === 'code',
    getSyntax: node => node.data.get('className').split('-')[1]
  }),
  EditCode({
    containerType: 'code',
    lineType: 'code_line',
    exitBlockType: null
  })
]
