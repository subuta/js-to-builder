import _ from 'lodash'

export default (option = {}) => (node) => {
  const {
    shouldOmitProgram = true // specify should/not wrap result by `b.program`
  } = option

  const NODE_TYPE = node.type

  if (NODE_TYPE === 'Program') {
    if (shouldOmitProgram) return
    const body = `[${_.map(node.body, (row) => row.source()).join(',')}]`
    return node.update(`b.program(${body})`)
  }

  // Expresion
  if (NODE_TYPE === 'CallExpression') {
    const args = `[${_.map(node.arguments, (argument) => argument.source()).join(',')}]`
    return node.update(`b.callExpression(${node.callee.source()}, ${args})`)
  } else if (NODE_TYPE === 'MemberExpression') {
    return node.update(`b.memberExpression(${node.object.source()}, ${node.property.source()})`)
  } else if (NODE_TYPE === 'ArrowFunctionExpression') {
    const params = `[${_.map(node.params, (param) => param.source()).join(',')}]`
    return node.update(`b.arrowFunctionExpression(${params}, ${node.body.source()})`)
  } else if (NODE_TYPE === 'ObjectExpression') {
    const properties = `[${_.map(node.properties, (property) => property.source()).join(',')}]`
    return node.update(`b.objectExpression(${properties})`)
  } else if (NODE_TYPE === 'ArrayExpression') {
    const elements = `[${_.map(node.elements, (element) => element.source()).join(',')}]`
    return node.update(`b.arrayExpression(${elements})`)
  }

  // Statement
  if (NODE_TYPE === 'ExpressionStatement') {
    return node.update(`b.expressionStatement(${node.expression.source()})`)
  } else if (NODE_TYPE === 'BlockStatement') {
    const body = `[${_.map(node.body, (row) => row.source()).join(',')}]`
    return node.update(`b.blockStatement(${body})`)
  } else if (NODE_TYPE === 'ReturnStatement') {
    return node.update(`b.returnStatement(${node.argument.source()})`)
  }

  // Primitive
  if (NODE_TYPE === 'Literal') {
    return node.update(`b.literal(${node.raw})`)
  } else if (NODE_TYPE === 'Identifier') {
    return node.update(`b.identifier('${node.name}')`)
  }

  // Other
  if (NODE_TYPE === 'Property') {
    // TODO: なぜかnode.key.source()とnode.value.source()の結果が同じになるのの調査
    let key = node.key.source()
    if (node.key.type === 'Identifier') {
      key = `b.identifier('${node.key.name}')`
    }
    return node.update(`Object.assign(b.property('${node.kind}', ${key}, ${node.value.source()}), { method: ${node.method}, shorthand: ${node.shorthand}, computed: ${node.computed} })`)
  }

  // Pattern
  if (NODE_TYPE === 'AssignmentPattern') {
    return node.update(`b.assignmentPattern(${node.left.source()}, ${node.right.source()})`)
  } else if (NODE_TYPE === 'ObjectPattern') {
    const properties = `[${_.map(node.properties, (property) => property.source()).join(',')}]`
    return node.update(`b.objectPattern(${properties})`)
  }

  // ES6 import
  if (NODE_TYPE === 'ImportDeclaration') {
    const specifiers = `[${_.map(node.specifiers, (specifier) => specifier.source()).join(',')}]`
    return node.update(`b.importDeclaration(${specifiers}, ${node.sourcep.source()})`)
  } else if (NODE_TYPE === 'ImportDefaultSpecifier') {
    return node.update(`b.importDefaultSpecifier(${node.local.source()})`)
  } else if (NODE_TYPE === 'ImportNamespaceSpecifier') {
    return node.update(`b.importNamespaceSpecifier(${node.local.source()})`)
  } else if (NODE_TYPE === 'ImportSpecifier') {
    // Fix circular.
    return node.update(`b.importSpecifier(${node.imported.source()}, ${node.local.source()})`)
  }

  // ES6 export
  if (NODE_TYPE === 'ExportDefaultDeclaration') {
    return node.update(`b.exportDefaultDeclaration(${node.declaration.source()})`)
  } else if (NODE_TYPE === 'ExportNamedDeclaration') {
    return node.update(`b.exportNamedDeclaration(${node.declaration.source()})`)
  }

  // Variable
  if (NODE_TYPE === 'VariableDeclarator') {
    return node.update(`b.variableDeclarator(${node.id.source()}, ${node.init.source()})`)
  } else if (NODE_TYPE === 'VariableDeclaration') {
    const declarations = `[${_.map(node.declarations, (declaration) => declaration.source()).join(',')}]`
    return node.update(`b.variableDeclaration('${node.kind}', ${declarations})`)
  }

  throw new Error(`${node.type} not found`)
}
