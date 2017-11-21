import _ from 'lodash'

import {
  Const,
  Let,
  Var,
  Value,
  ArrowFn,
  FnStatement,
  FnCall,
  JSX
} from 'lib/components/simple'

export default (option = {}) => (node) => {
  const {
    shouldOmitProgram = false // specify should/not wrap result by `b.program`
  } = option

  const NODE_TYPE = node.type

  if (NODE_TYPE === 'Program') {
    if (shouldOmitProgram) return
    const body = _.map(node.body, (row) => row.source()).join('\n')
    return node.update(`
      <program>${body}</program>
    `)
  }

  // Expresion
  if (NODE_TYPE === 'CallExpression') {
    const args = _.map(node.arguments, (argument) => argument.source()).join('\n')
    return node.update(`
      <callExpression>${node.callee.source()}${_.isEmpty(node.arguments) ? [] : args}</callExpression>
    `)
  } else if (NODE_TYPE === 'MemberExpression') {
    return node.update(`
      <memberExpression>${node.object.source()}${node.property.source()}</memberExpression>
    `)
  } else if (NODE_TYPE === 'ArrowFunctionExpression') {
    const params = _.map(node.params, (param) => param.source()).join('\n')
    return node.update(`
      <arrowFunctionExpression>${params}${node.body.source()}</arrowFunctionExpression>
    `)
  } else if (NODE_TYPE === 'ObjectExpression') {
    const properties = _.map(node.properties, (property) => property.source()).join('\n')
    return node.update(`
      <objectExpression>${properties}</objectExpression>
    `)
  } else if (NODE_TYPE === 'ArrayExpression') {
    const elements = _.map(node.elements, (element) => element.source()).join('\n')
    return node.update(`
      <arrayExpression>${_.isEmpty(node.elements) ? [] : elements}</arrayExpression>
    `)
  } else if (NODE_TYPE === 'BinaryExpression') {
    return node.update(`
      <binaryExpression operator="${node.operator}">
        ${node.left.source()}${node.right.source()}
      </binaryExpression>
    `)
  } else if (NODE_TYPE === 'AssignmentExpression') {
    return node.update(`
      <assignmentExpression operator="${node.operator}">
        ${node.left.source()}${node.right.source()}
      </assignmentExpression>
    `)
  } else if (NODE_TYPE === 'UpdateExpression') {
    return node.update(`
      <updateExpression operator="${node.operator}" prefix={${node.prefix}}>
        ${node.argument.source()}
      </updateExpression>
    `)
  } else if (NODE_TYPE === 'FunctionExpression') {
    return node.update(`
      <functionExpression id={${node.id}}>
        ${node.params}${node.body.source()}
      </functionExpression>
    `)
  }

  // Statement
  if (NODE_TYPE === 'ExpressionStatement') {
    return node.update(`<expressionStatement>${node.expression.source()}</expressionStatement>`)
  } else if (NODE_TYPE === 'BlockStatement') {
    const body = _.map(node.body, (row) => row.source()).join('\n')
    return node.update(`
      <blockStatement>${body}</blockStatement>
    `)
  } else if (NODE_TYPE === 'ReturnStatement') {
    return node.update(`
      <returnStatement>${node.argument.source()}</returnStatement>
    `)
  } else if (NODE_TYPE === 'DebuggerStatement') {
    return node.update(`
      <debuggerStatement />
    `)
  } else if (NODE_TYPE === 'IfStatement') {
    return node.update(`
      <ifStatement>
        ${node.test.source()}${node.consequent.source()}${node.alternate ? node.alternate.source() : ''}
      </ifStatement>
    `)
  } else if (NODE_TYPE === 'BreakStatement') {
    return node.update(`
      <breakStatement>
        ${node.label ? node.label.source() : ''}
      </breakStatement>
    `)
  } else if (NODE_TYPE === 'ContinueStatement') {
    return node.update(`
      <continueStatement>
        ${node.label ? node.label.source() : ''}
      </continueStatement>
    `)
  } else if (NODE_TYPE === 'ForStatement') {
    return node.update(`
      <forStatement>
        ${node.init.source()}${node.test.source()}${node.update.source()}${node.body.source()}
      </forStatement>
    `)
  } else if (NODE_TYPE === 'ForInStatement') {
    return node.update(`
      <forInStatement>
        ${node.left.source()}${node.right.source()}${node.body.source()}
      </forInStatement>
    `)
  } else if (NODE_TYPE === 'ForOfStatement') {
    return node.update(`
      <forOfStatement>
        ${node.left.source()}${node.right.source()}${node.body.source()}
      </forOfStatement>
    `)
  } else if (NODE_TYPE === 'DoWhileStatement') {
    return node.update(`
      <doWhileStatement>
        ${node.body.source()}${node.test.source()}
      </doWhileStatement>
    `)
  } else if (NODE_TYPE === 'WhileStatement') {
    return node.update(`
      <whileStatement>
        ${node.test.source()}${node.body.source()}
      </whileStatement>
    `)
  } else if (NODE_TYPE === 'LabeledStatement') {
    return node.update(`
      <labeledStatement>
        ${node.label.source()}${node.body.source()}
      </labeledStatement>
    `)
  }

  // Primitive
  if (NODE_TYPE === 'Literal') {
    const value = _.isString(node.value) ? node.value : `{${node.value}}`
    return node.update(`<literal>${value}</literal>`)
  } else if (NODE_TYPE === 'Identifier') {
    return node.update(`<identifier>${node.name}</identifier>`)
  }

  // Other
  if (NODE_TYPE === 'Property') {
    // TODO: なぜかnode.key.source()とnode.value.source()の結果が同じになるのの調査
    let key = node.key.source()
    if (node.key.type === 'Identifier') {
      key = `<identifier>${node.key.name}</identifier>`
    }
    return node.update(`
      <property kind="${node.kind}" method={${node.method}} shorthand={${node.shorthand}} computed={${node.computed}}>
        ${key}${node.value.source()}
      </property>
    `)
  }

  // Pattern
  if (NODE_TYPE === 'AssignmentPattern') {
    return node.update(`
      <assignmentPattern>${node.left.source()}${node.right.source()}</assignmentPattern>
    `)
  } else if (NODE_TYPE === 'ObjectPattern') {
    const properties = _.map(node.properties, (property) => property.source()).join('\n')
    return node.update(`
      <objectPattern>${properties}</objectPattern>
    `)
  }

  // ES6 import
  if (NODE_TYPE === 'ImportDeclaration') {
    const specifiers = _.map(node.specifiers, (specifier) => specifier.source()).join('\n')
    return node.update(`
      <importDeclaration>${specifiers}${node.sourcep.source()}</importDeclaration>
    `)
  } else if (NODE_TYPE === 'ImportDefaultSpecifier') {
    return node.update(`
      <importDefaultSpecifier>${node.local.source()}</importDefaultSpecifier>
    `)
  } else if (NODE_TYPE === 'ImportNamespaceSpecifier') {
    return node.update(`
      <importNamespaceSpecifier>${node.local.source()}</importNamespaceSpecifier>
    `)
  } else if (NODE_TYPE === 'ImportSpecifier') {
    // Fix circular.
    return node.update(`
      <importSpecifier>${node.imported.source()}${node.local.source()}</importSpecifier>
    `)
  }

  // ES6 export
  if (NODE_TYPE === 'ExportDefaultDeclaration') {
    return node.update(`
      <exportDefaultDeclaration>${node.declaration.source()}</exportDefaultDeclaration>
    `)
  } else if (NODE_TYPE === 'ExportNamedDeclaration') {
    return node.update(`
      <exportNamedDeclaration>${node.declaration.source()}</exportNamedDeclaration>
    `)
  }

  // Variable
  if (NODE_TYPE === 'VariableDeclarator') {
    return node.update(`
      <variableDeclarator>${node.id.source()}${node.init ? node.init.source() : ''}</variableDeclarator>
    `)
  } else if (NODE_TYPE === 'VariableDeclaration') {
    const declarations = _.map(node.declarations, (declaration) => declaration.source()).join('\n')
    return node.update(`
      <variableDeclaration kind="${node.kind}">${declarations}</variableDeclaration>
    `)
  }

  // jsx
  if (NODE_TYPE === 'JSXIdentifier') {
    return node.update(`
      <jsxIdentifier name="${node.name}" />
    `)
  } else if (NODE_TYPE === 'JSXOpeningElement') {
    const attributes = `[${_.map(node.attributes, (attribute) => attribute.source()).join(',') || ''}]`
    return node.update(`
      <jsxOpeningElement 
        name={${node.name ? node.name.source() : 'null'}}
        attributes={${attributes}}
        selfClosing={${node.selfClosing}}
      />
    `)
  } else if (NODE_TYPE === 'JSXClosingElement') {
    return node.update(`
      <jsxClosingElement name={${node.name.source()}} />
    `)
  } else if (NODE_TYPE === 'JSXText') {
    return node.update(`<jsxText>${node.value}</jsxText>`)
  } else if (NODE_TYPE === 'JSXElement') {
    const children = _.map(node.children, (child) => child.source()).join('\n')
    return node.update(`
      <jsxElement>${node.openingElement.source()}${children}${node.closingElement.source()}</jsxElement>
    `)
  } else if (NODE_TYPE === 'JSXAttribute') {
    return node.update(`
      <jsxAttribute 
        name={${node.name ? node.name.source() : 'null'}}
        value={${node.value ? node.value.source() : 'null'}}
      />
    `)
  } else if (NODE_TYPE === 'JSXExpressionContainer') {
    return node.update(`
      <jsxExpressionContainer>${node.expression.source()}</jsxExpressionContainer>
    `)
  }

  throw new Error(`${node.type} not found`)
}
