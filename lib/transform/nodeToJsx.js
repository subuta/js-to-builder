import _ from 'lodash'

export default (option = {}) => (node) => {
  const {
    shouldOmitProgram = true // specify should/not wrap result by `b.program`
  } = option

  const NODE_TYPE = node.type

  if (NODE_TYPE === 'Program') {
    if (shouldOmitProgram) return
    const body = _.map(node.body, (row) => row.source()).join('\n')
    return node.update(`
      <Program>${body}</Program>
    `)
  }

  // Expresion
  if (NODE_TYPE === 'CallExpression') {
    const args = _.map(node.arguments, (argument) => argument.source()).join('\n')
    return node.update(`
      <CallExpression>${node.callee.source()}${_.isEmpty(node.arguments) ? [] : args}</CallExpression>
    `)
  } else if (NODE_TYPE === 'MemberExpression') {
    return node.update(`
      <MemberExpression>${node.object.source()}${node.property.source()}</MemberExpression>
    `)
  } else if (NODE_TYPE === 'ArrowFunctionExpression') {
    const params = _.map(node.params, (param) => param.source()).join('\n')
    return node.update(`
      <ArrowFunctionExpression>${params}${node.body.source()}</ArrowFunctionExpression>
    `)
  } else if (NODE_TYPE === 'ObjectExpression') {
    const properties = _.map(node.properties, (property) => property.source()).join('\n')
    return node.update(`
      <ObjectExpression>${properties}</ObjectExpression>
    `)
  } else if (NODE_TYPE === 'ArrayExpression') {
    const elements = _.map(node.elements, (element) => element.source()).join('\n')
    return node.update(`
      <ArrayExpression>${_.isEmpty(node.elements) ? [] : elements}</ArrayExpression>
    `)
  } else if (NODE_TYPE === 'BinaryExpression') {
    return node.update(`
      <BinaryExpression operator="${node.operator}">
        ${node.left.source()}${node.right.source()}
      </BinaryExpression>
    `)
  } else if (NODE_TYPE === 'AssignmentExpression') {
    return node.update(`
      <AssignmentExpression operator="${node.operator}">
        ${node.left.source()}${node.right.source()}
      </AssignmentExpression>
    `)
  } else if (NODE_TYPE === 'UpdateExpression') {
    return node.update(`
      <UpdateExpression operator="${node.operator}" prefix={${node.prefix}}>
        ${node.argument.source()}
      </UpdateExpression>
    `)
  } else if (NODE_TYPE === 'FunctionExpression') {
    return node.update(`
      <FunctionExpression id={${node.id}}>
        ${node.params}${node.body.source()}
      </FunctionExpression>
    `)
  }

  // Statement
  if (NODE_TYPE === 'ExpressionStatement') {
    return node.update(`<ExpressionStatement>${node.expression.source()}</ExpressionStatement>`)
  } else if (NODE_TYPE === 'BlockStatement') {
    const body = _.map(node.body, (row) => row.source()).join('\n')
    return node.update(`
      <BlockStatement>${body}</BlockStatement>
    `)
  } else if (NODE_TYPE === 'ReturnStatement') {
    return node.update(`
      <ReturnStatement>${node.argument.source()}</ReturnStatement>
    `)
  } else if (NODE_TYPE === 'DebuggerStatement') {
    return node.update(`
      <DebuggerStatement />
    `)
  } else if (NODE_TYPE === 'IfStatement') {
    return node.update(`
      <IfStatement>
        ${node.test.source()}${node.consequent.source()}${node.alternate ? node.alternate.source() : ''}
      </IfStatement>
    `)
  } else if (NODE_TYPE === 'BreakStatement') {
    return node.update(`
      <BreakStatement>
        ${node.label ? node.label.source() : ''}
      </BreakStatement>
    `)
  } else if (NODE_TYPE === 'ContinueStatement') {
    return node.update(`
      <ContinueStatement>
        ${node.label ? node.label.source() : ''}
      </ContinueStatement>
    `)
  } else if (NODE_TYPE === 'ForStatement') {
    return node.update(`
      <ForStatement>
        ${node.init.source()}${node.test.source()}${node.update.source()}${node.body.source()}
      </ForStatement>
    `)
  } else if (NODE_TYPE === 'ForInStatement') {
    return node.update(`
      <ForInStatement>
        ${node.left.source()}${node.right.source()}${node.body.source()}
      </ForInStatement>
    `)
  } else if (NODE_TYPE === 'ForOfStatement') {
    return node.update(`
      <ForOfStatement>
        ${node.left.source()}${node.right.source()}${node.body.source()}
      </ForOfStatement>
    `)
  } else if (NODE_TYPE === 'DoWhileStatement') {
    return node.update(`
      <DoWhileStatement>
        ${node.body.source()}${node.test.source()}
      </DoWhileStatement>
    `)
  } else if (NODE_TYPE === 'WhileStatement') {
    return node.update(`
      <WhileStatement>
        ${node.test.source()}${node.body.source()}
      </WhileStatement>
    `)
  } else if (NODE_TYPE === 'LabeledStatement') {
    return node.update(`
      <LabeledStatement>
        ${node.label.source()}${node.body.source()}
      </LabeledStatement>
    `)
  }

  // Primitive
  if (NODE_TYPE === 'Literal') {
    const value = _.isString(node.value) ? node.value : `{${node.value}}`
    return node.update(`<Literal>${value}</Literal>`)
  } else if (NODE_TYPE === 'Identifier') {
    return node.update(`<Identifier>${node.name}</Identifier>`)
  }

  // Other
  if (NODE_TYPE === 'Property') {
    // TODO: なぜかnode.key.source()とnode.value.source()の結果が同じになるのの調査
    let key = node.key.source()
    if (node.key.type === 'Identifier') {
      key = `<Identifier>${node.key.name}</Identifier>`
    }
    return node.update(`
      <Property kind="${node.kind}" method={${node.method}} shorthand={${node.shorthand}} computed={${node.computed}}>
        ${key}${node.value.source()}
      </Property>
    `)
  }

  // Pattern
  if (NODE_TYPE === 'AssignmentPattern') {
    return node.update(`
      <AssignmentPattern>${node.left.source()}${node.right.source()}</AssignmentPattern>
    `)
  } else if (NODE_TYPE === 'ObjectPattern') {
    const properties = _.map(node.properties, (property) => property.source()).join('\n')
    return node.update(`
      <ObjectPattern>${properties}</ObjectPattern>
    `)
  }

  // ES6 import
  if (NODE_TYPE === 'ImportDeclaration') {
    const specifiers = _.map(node.specifiers, (specifier) => specifier.source()).join('\n')
    return node.update(`
      <ImportDeclaration>${specifiers}${node.sourcep.source()}</ImportDeclaration>
    `)
  } else if (NODE_TYPE === 'ImportDefaultSpecifier') {
    return node.update(`
      <ImportDefaultSpecifier>${node.local.source()}</ImportDefaultSpecifier>
    `)
  } else if (NODE_TYPE === 'ImportNamespaceSpecifier') {
    return node.update(`
      <ImportNamespaceSpecifier>${node.local.source()}</ImportNamespaceSpecifier>
    `)
  } else if (NODE_TYPE === 'ImportSpecifier') {
    // Fix circular.
    return node.update(`
      <ImportSpecifier>${node.imported.source()}${node.local.source()}</ImportSpecifier>
    `)
  }

  // ES6 export
  if (NODE_TYPE === 'ExportDefaultDeclaration') {
    return node.update(`
      <ExportDefaultDeclaration>${node.declaration.source()}</ExportDefaultDeclaration>
    `)
  } else if (NODE_TYPE === 'ExportNamedDeclaration') {
    return node.update(`
      <ExportNamedDeclaration>${node.declaration.source()}</ExportNamedDeclaration>
    `)
  }

  // Variable
  if (NODE_TYPE === 'VariableDeclarator') {
    return node.update(`
      <VariableDeclarator>${node.id.source()}${node.init ? node.init.source() : ''}</VariableDeclarator>
    `)
  } else if (NODE_TYPE === 'VariableDeclaration') {
    const declarations = _.map(node.declarations, (declaration) => declaration.source()).join('\n')
    return node.update(`
      <VariableDeclaration kind="${node.kind}">${declarations}</VariableDeclaration>
    `)
  }

  throw new Error(`${node.type} not found`)
}
