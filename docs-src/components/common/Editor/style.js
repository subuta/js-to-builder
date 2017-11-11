import {
  registerStyles
} from 'docs-src/utils/style'

const LineNumber = {
  content: 'counter(linenumber)',
  color: 'rgba(27,31,35,0.3)',
  display: 'block',
  padding: '0 8px',
  textAlign: 'right'
}

const Editor = {
  padding: '0 8px',
  '-webkit-font-smoothing': 'auto',
  border: `1px solid #cccccc`,
  fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;',
  height: '100%',

  '& > pre': {
    margin: '8px 0',

    '& > code': {
      '& > *': {
        fontSize: 14,
        lineHeight: '20px',
        verticalAlign: 'top'
      }
    }
  },

  '& > pre.line-numbers': {
    position: 'relative',
    paddingLeft: 32,
    counterReset: 'linenumber',

    '& > code': {
      position: 'relative',
      whiteSpace: 'inherit'
    }
  },

  '& .line': {
    position: 'relative',
  },

  '& .line-numbers-rows': {
    position: 'absolute',
    top: 0,
    left: -32,
    width: 32, /* works for line-numbers below 1000 lines */
    letterSpacing: '-1px',
    borderRight: '1px solid transparent',
    userSelect: 'none'
  },

  '& span.line-numbers-rows': {
    display: 'block',
    counterIncrement: 'linenumber'
  },

  '& span.line-numbers-rows:before': LineNumber,
  '& span.line-numbers-rows.has-error:before': {
    ...LineNumber,
    color: 'red'
  }
}

export default registerStyles({
  Editor
})
