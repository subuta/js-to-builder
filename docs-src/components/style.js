import {
  registerStyles
} from 'docs-src/utils/style'

const Content = {
  display: 'flex',
  alignItems: 'flex-start',
  height: '100vh',
  fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace',
  fontSize: 13,
  color: '#24292e',
  wordWrap: 'normal',
  whiteSpace: 'pre'
}

const CodeEditor = {
  padding: 8,
  flex: '1 1 auto',
  height: '90%',
  width: '50%',
  fontSize: 13
}

const JsxEditor = {
  margin: '0 0 0 16px',
  padding: 8,
  flex: '1 1 auto',
  height: '90%',
  width: '50%',
  color: 'black',
  '& p.is-error': {
    color: 'red'
  }
}

export default registerStyles({
  Content,
  CodeEditor,
  JsxEditor
})
