import {
  registerRules
} from './utils/style'

const app = {
  position: 'relative',
  zIndex: 0
}

const body = {
  margin: 0,
  padding: 0,
  backgroundColor: '#FFFFFF',
  color: '#333333',
  fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace'
}

registerRules({
  body,
  '#app': app
})
