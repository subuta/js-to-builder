import { toBuilder, print } from 'js-to-builder'

const code = `const hoge = 'fuga';`

// will return ast-types builder
const variableDeclaration = toBuilder(code).builder

// will print original code
console.log(print([
  variableDeclaration
]))

// -> `const hoge = "fuga";`
