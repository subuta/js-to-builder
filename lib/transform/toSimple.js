import _ from 'lodash'

import * as types from 'ast-types'

const {namedTypes: n, builders: b} = types

export default (option = {}) => {
  // transform first to get updated source.
  const tsource = (node) => {
    transform(node)
    return node.source()
  }
  const transform = (node) => {
    const {
      shouldOmitProgram = false // specify should/not wrap result by `b.program`
    } = option

    const NODE_TYPE = node.type

    if (NODE_TYPE === 'Program') {
      if (shouldOmitProgram) return
      let body = _.map(node.body, (row) => row.source()).join('\n')
      return node.update(`
        <program>${body}</program>
      `)
    }

    // Expresion
    if (NODE_TYPE === 'CallExpression') {
      const args = _.map(node.arguments, (argument) => tsource(argument)).join('\n')
      const withES = n.ExpressionStatement.check(node.parent)
      let callee = node.callee.name
      // if nested FnCall
      if (n.MemberExpression.check(node.callee) && n.CallExpression.check(node.callee.object)) {
        return node.update(`
          <FnCall callee="${node.callee.property.name}" ${withES ? 'es' : ''}>
            ${tsource(node.callee)}
            ${args}
          </FnCall>
        `)
      } else if (n.MemberExpression.check(node.callee)) {
        callee = tsource(node.callee)
      }
      return node.update(`<FnCall callee="${callee}" ${withES ? 'es' : ''}>${args}</FnCall>`)
    } else if (NODE_TYPE === 'MemberExpression') {
      // if nested FnCall
      if (n.CallExpression.check(node.object)) {
        return node.update(`${node.object.source()}`)
      }
      return node.update(`${node.object.name}.${node.property.name}`)
    } else if (NODE_TYPE === 'ArrowFunctionExpression') {
      const params = _.map(node.params, (param) => tsource(param)).join('\n')
      return node.update(`<ArrowFn>${params}${tsource(node.body)}</ArrowFn>`)
    } else if (NODE_TYPE === 'ObjectExpression') {
      const properties = _.reduce(node.properties, (result, property) => {
        result[property.key.name] = property.value.value
        return result
      }, {})
      const withES = n.ExpressionStatement.check(node.parent)
      return node.update(`
        <Value ${withES ? 'es' : ''}>{${JSON.stringify(properties)}}</Value>
      `)
    } else if (NODE_TYPE === 'ArrayExpression') {
      const elements = _.trim(_.map(node.elements, (element) => element.value).join(','))
      const withES = n.ExpressionStatement.check(node.parent)
      return node.update(`<Value ${withES ? 'es' : ''}>{[${_.isEmpty(node.elements) ? '' : elements}]}</Value>`)
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
      <Fn id={${node.id}}>
        ${node.params}${tsource(node.body)}
      </Fn>
    `)
    }

    // Statement
    if (NODE_TYPE === 'ExpressionStatement') {
      return node.update(`${node.expression.source()}`)
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
      return node.update(`<Value>${value}</Value>`)
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
      return node.update(`<Declarator name="${node.id.name}">${node.init ? node.init.source() : ''}</Declarator>`)
    } else if (NODE_TYPE === 'VariableDeclaration') {
      // defaults
      let name = null
      let declarations = _.map(node.declarations, (declaration) => declaration.source()).join('\n')

      // if single variable declaration
      if (node.declarations.length === 1 && n.VariableDeclarator.check(_.first(node.declarations))) {
        const declarator = _.first(node.declarations)
        name = declarator.id.name

        if (n.Literal.check(declarator.init)) {
          // Wrap with Value if child is literal.
          declarations = [`<Value>${declarator.init.value}</Value>`]
        } else {
          declarations = [`${tsource(declarator.init)}`]
        }
      }

      if (_.toLower(node.kind) === 'const') {
        return node.update(`
          <Const ${name ? `name="${name}"` : ''}>${declarations}</Const>
        `)
      } else if (_.toLower(node.kind) === 'let') {
        return node.update(`
          <Let ${name ? `name="${name}"` : ''}>${declarations}</Let>
        `)
      } else if (_.toLower(node.kind) === 'var') {
        return node.update(`
          <Var ${name ? `name="${name}"` : ''}>${declarations}</Var>
        `)
      }
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
  return transform
}
