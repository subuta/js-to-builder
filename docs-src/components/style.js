import {
  registerStyles
} from 'docs-src/utils/style'

const Content = {
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  padding: 16,
  fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace',
  fontSize: 13,
  color: '#24292e',

  '& > h3': {
    marginTop: 0
  }
}

const ToggleSimple = {
  margin: '16px 0 0'
}

const ToggleSimpleInput = {
  margin: '4px 0 0',
  cursor: 'pointer',

  '& > label': {
    margin: '0 4px 0 0',
    userSelect: 'none'
  }
}

const Editors = {
  margin: '16px 0 0',
  display: 'flex',
  alignItems: 'flex-start',
  flex: '1 1 100%',
  '& > *': {
    margin: '0 16px 0 0',
    '&:nth-of-type(2)': {
      margin: 0
    }
  }
}

const Footer = {
  margin: '0 0 16px',
  padding: '0 16px',
  display: 'flex',
  justifyContent: 'flex-end',

  '& > a': {
    marginTop: 0
  }
}

export default registerStyles({
  Content,
  ToggleSimple,
  ToggleSimpleInput,
  Editors,
  Footer
})
