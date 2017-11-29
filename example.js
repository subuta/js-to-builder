import recast from 'recast'

import * as types from 'ast-types'
const {namedTypes: n, builders: b} = types

const code = `
  // hoge
  console.log('hoge');
`

const ast = recast.parse(code)

ast.program.body[0].expression /*?*/

console.log(n);
console.log(n.Identifier);

recast.visit(ast, {
  visitCallExpression: function(path) {
    path.value.type /*?*/
    path.replace('"fuga"') /*?*/
    this.traverse(path);
  }
});

recast.print(ast).code /*?*/
