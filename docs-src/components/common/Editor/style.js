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

const EditorWrapper = {
  position: 'relative',
  flex: '1 1 auto',
  height: '100%',
  width: '50%'
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

const Error = {
  margin: 0,
  padding: 8,
  position: 'absolute',
  whiteSpace: 'pre-wrap',
  left: 0,
  bottom: 0,
  right: 0,
  background: '#EEEEEE',
  color: 'red',
  opacity: 0.8,
  fontWeight: 'bold'
}

export default registerStyles({
  EditorWrapper,
  Editor,
  Error
})
