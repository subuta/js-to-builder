import {
  registerStyles
} from 'docs-src/utils/style'

const Content = {
  padding: 16,
  display: 'flex',
  alignItems: 'flex-start',
  height: '100vh',
  fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace',
  fontSize: 13,
  color: '#24292e',
  wordWrap: 'normal',
  whiteSpace: 'pre'
}

const Editor = {
  margin: '0 16px 0 0',
  '&:nth-of-type(2)': {
    margin: 0
  }
}

export default registerStyles({
  Content,
  Editor
})
