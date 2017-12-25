import recast from 'recast'

import * as types from 'ast-types'
const {namedTypes: n, builders: b} = types

const code = `
  const hoge = 'value';
`

const ast = recast.parse(code)

// ast.program.body[0].expression

// console.log(n);
// console.log(n.Identifier);

recast.visit(ast, {
  visitVariableDeclaration: function(path) {
    path.value.type /*?*/

    // path.get('comments', 0, 'value').replace('fugaa')
    // console.log(path.value.comments);
    path.get('comments').replace([b.commentLine('oo', true, false)])
    // path.node.comments = [b.commentLine('oo', true, false)]

    // path.replace('"fuga"') /*?*/
    this.traverse(path);
  }
});

recast.print(ast).code /*?*/
