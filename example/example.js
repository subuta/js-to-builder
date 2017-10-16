import { toBuilder, print } from 'js-to-builder'

const code = `const hoge = 'fuga';`

// parse and generate ast-types builder
const variableDeclaration = toBuilder(code)

// will print builder code (main feature of this library!)
console.log(variableDeclaration.code)

// -> `
// b.variableDeclaration('const', [
//   b.variableDeclarator(
//     b.identifier('hoge'),
//     b.literal('fuga')
//   )
// ]);
// `

// will print original code
console.log(print([
  variableDeclaration.builder
]))

// -> `const hoge = "fuga";`
