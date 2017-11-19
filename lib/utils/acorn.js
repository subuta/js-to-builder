import inject from 'acorn-jsx/inject'

const acorn = inject(require('acorn'))

export default (() => {
  let pp = acorn.Parser.prototype

  const tt = acorn.tokTypes
  const empty = []

  // override original parseImport(ImportDeclaration) to fix conflict.
  pp.parseImport = function (node) {
    this.next()
    // import '...'
    if (this.type === tt.string) {
      node.specifiers = empty
      node.sourcep = this.parseExprAtom() // fix conflict of name `source`
    } else {
      node.specifiers = this.parseImportSpecifiers()
      this.expectContextual('from')
      node.sourcep = this.type === tt.string ? this.parseExprAtom() : this.unexpected() // fix conflict of name `source`
    }
    this.semicolon()
    return this.finishNode(node, 'ImportDeclaration')
  }

  return acorn
})()
