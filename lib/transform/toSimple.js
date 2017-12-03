import _ from 'lodash'
import icepick from 'icepick'

import * as types from 'ast-types'

const {namedTypes: n, builders: b, getFieldNames, getFieldValue} = types

import { getBuilderName, getBuildParams } from 'lib/utils/recast'
import os from 'os'

import toBuilder, { parse } from './toBuilder'

export default (option = {}) => {
  const builderTransform = toBuilder(option)

  const {
    shouldOmitProgram = false, // specify should/not wrap result by `b.program`
    shouldAddFieldNames = false // should print fieldNames also(defaults to `buildParams` only)
  } = option

  return (path) => {
    const {tagName, props, children} = parse(path)

    const replace = (jsx) => path.replace({...path, jsx})

    console.log('tagName = ', tagName)
    console.log('children = ', children)

    const {node} = path
    if (!node) return

    const NODE_TYPE = tagName

    if (NODE_TYPE === 'program') {
      if (shouldOmitProgram) return path.replace(`${children}`)
      return path.replace(`<program>${children}</program>`)
    }

    // run toBuilder first to get jsx.
    builderTransform(path)

    console.log(NODE_TYPE)
    console.log(node)

    // if (NODE_TYPE === 'Program') {
    //   if (shouldOmitProgram) return
    //   let body = _.map(node.body, (row) => row.jsx).join('\n')
    //   return path.replace(`
    //     <program>${body}</program>
    //   `)
    // }
    //
    // Expresion
    if (NODE_TYPE === 'callExpression') {
      const args = _.map(node.arguments, (argument) => argument.jsx).join('\n')
      const withES = n.ExpressionStatement.check(path.parentPath.node)
      let callee = getFieldValue(node.callee.value, 'name')
      // if nested FnCall
      if (n.MemberExpression.check(node.callee) && n.CallExpression.check(node.callee.object)) {
        return replace(`
          <FnCall callee="${node.callee.property.name}" ${withES ? 'es' : ''}>
            ${node.callee.jsx}
            ${args}
          </FnCall>
        `)
      } else if (n.MemberExpression.check(node.callee)) {
        callee = getFieldValue(node.callee.value, 'jsx')
      }

      if (!callee) {
        return replace(`<FnCall ${withES ? 'es' : ''}>${node.callee.jsx}${args}</FnCall>`)
      }

      return replace(`<FnCall ${callee ? `callee="${callee}"` : ''} ${withES ? 'es' : ''}>${args}</FnCall>`)
    }
    // } else if (NODE_TYPE === 'MemberExpression') {
    //   // if nested FnCall
    //   if (n.CallExpression.check(node.object)) {
    //     return path.replace(`${node.object.jsx}`)
    //   } else if (n.Identifier.check(node.object)) {
    //     return path.replace(`${node.object.name}.${node.property.name}`)
    //   }
    //   return path.replace(`${node.object.jsx}.${node.property.name}`)
    // } else if (NODE_TYPE === 'ArrowFunctionExpression') {
    //   const params = _.map(node.params, (param) => param.jsx).join('\n')
    //   return path.replace(`<ArrowFn ${node.async ? 'async' : ''} ${node.generator ? 'generator' : ''}>${params}${node.body.jsx}</ArrowFn>`)
    // } else if (NODE_TYPE === 'ObjectExpression') {
    //   const properties = _.reduce(node.properties, (result, property) => {
    //     result[property.key.name] = property.value.value
    //     return result
    //   }, {})
    //   const withES = n.ExpressionStatement.check(node.parent)
    //
    //   // if JSX
    //   if (n.JSXExpressionContainer.check(node.parent)) {
    //     return path.replace(JSON.stringify(properties))
    //   }
    //
    //   return path.replace(`
    //     <Value ${withES ? 'es' : ''}>{${JSON.stringify(properties)}}</Value>
    //   `)
    // } else if (NODE_TYPE === 'ArrayExpression') {
    //   const elements = _.trim(_.map(node.elements, (element) => element.value).join(','))
    //   const withES = n.ExpressionStatement.check(node.parent)
    //   return path.replace(`<Value ${withES ? 'es' : ''}>{[${_.isEmpty(node.elements) ? '' : elements}]}</Value>`)
    // } else if (NODE_TYPE === 'BinaryExpression') {
    //   return path.replace(`
    //   <binaryExpression operator="${node.operator}">
    //     ${node.left.jsx}${node.right.jsx}
    //   </binaryExpression>
    // `)
    // } else if (NODE_TYPE === 'AssignmentExpression') {
    //   return path.replace(`
    //   <assignmentExpression operator="${node.operator}">
    //     ${node.left.jsx}${node.right.jsx}
    //   </assignmentExpression>
    // `)
    // } else if (NODE_TYPE === 'UpdateExpression') {
    //   return path.replace(`
    //   <updateExpression operator="${node.operator}" prefix={${node.prefix}}>
    //     ${node.argument.jsx}
    //   </updateExpression>
    // `)
    // } else if (NODE_TYPE === 'FunctionExpression') {
    //   const params = _.map(node.params, (param) => param.jsx).join('\n')
    //   return path.replace(`
    //   <Fn ${node.id ? `id="${node.id.name}"` : ''} ${node.async ? 'async' : ''} ${node.generator ? 'generator' : ''}>
    //     ${params}${node.body.jsx}
    //   </Fn>
    // `)
    // } else if (NODE_TYPE === 'ThisExpression') {
    //   return path.replace('this')
    // }
    //
    // Statement
    if (NODE_TYPE === 'expressionStatement') {
      return replace(`${children}`)
    }
    // } else if (NODE_TYPE === 'BlockStatement') {
    //   const body = _.map(node.body, (row) => row.jsx).join('\n')
    //   return path.replace(`
    //   <blockStatement>${body}</blockStatement>
    // `)
    // } else if (NODE_TYPE === 'ReturnStatement') {
    //   return path.replace(`
    //   <returnStatement>${node.argument.jsx}</returnStatement>
    // `)
    // } else if (NODE_TYPE === 'DebuggerStatement') {
    //   return path.replace(`
    //   <debuggerStatement />
    // `)
    // } else if (NODE_TYPE === 'IfStatement') {
    //   return path.replace(`
    //   <ifStatement>
    //     ${node.test.jsx}${node.consequent.jsx}${node.alternate ? node.alternate.jsx : ''}
    //   </ifStatement>
    // `)
    // } else if (NODE_TYPE === 'BreakStatement') {
    //   return path.replace(`
    //   <breakStatement>
    //     ${node.label ? node.label.jsx : ''}
    //   </breakStatement>
    // `)
    // } else if (NODE_TYPE === 'ContinueStatement') {
    //   return path.replace(`
    //   <continueStatement>
    //     ${node.label ? node.label.jsx : ''}
    //   </continueStatement>
    // `)
    // } else if (NODE_TYPE === 'ForStatement') {
    //   return path.replace(`
    //   <forStatement>
    //     ${node.init.jsx}${node.test.jsx}${path.replace.jsx}${node.body.jsx}
    //   </forStatement>
    // `)
    // } else if (NODE_TYPE === 'ForInStatement') {
    //   return path.replace(`
    //   <forInStatement>
    //     ${node.left.jsx}${node.right.jsx}${node.body.jsx}
    //   </forInStatement>
    // `)
    // } else if (NODE_TYPE === 'ForOfStatement') {
    //   return path.replace(`
    //   <forOfStatement>
    //     ${node.left.jsx}${node.right.jsx}${node.body.jsx}
    //   </forOfStatement>
    // `)
    // } else if (NODE_TYPE === 'DoWhileStatement') {
    //   return path.replace(`
    //   <doWhileStatement>
    //     ${node.body.jsx}${node.test.jsx}
    //   </doWhileStatement>
    // `)
    // } else if (NODE_TYPE === 'WhileStatement') {
    //   return path.replace(`
    //   <whileStatement>
    //     ${node.test.jsx}${node.body.jsx}
    //   </whileStatement>
    // `)
    // } else if (NODE_TYPE === 'LabeledStatement') {
    //   return path.replace(`
    //   <labeledStatement>
    //     ${node.label.jsx}${node.body.jsx}
    //   </labeledStatement>
    // `)
    // }
    //
    // // Primitive
    // if (NODE_TYPE === 'Literal') {
    //   const value = _.isString(node.value) ? node.value : `{${node.value}}`
    //   return path.replace(`<Value>${value}</Value>`)
    // } else if (NODE_TYPE === 'Identifier') {
    //   const withES = n.ExpressionStatement.check(node.parent)
    //   return path.replace(`<identifier ${withES ? 'es' : ''}>${node.name}</identifier>`)
    // }
    //
    // // Other
    // if (NODE_TYPE === 'Property') {
    //   // TODO: なぜかnode.key.jsxとnode.value.jsxの結果が同じになるのの調査
    //   let key = node.key.jsx
    //   if (node.key.type === 'Identifier') {
    //     key = `<identifier>${node.key.name}</identifier>`
    //   }
    //   return path.replace(`
    //   <property ${node.kind ? `kind="${node.kind}"` : ''}
    //             ${node.method ? 'method' : ''}
    //             ${node.shorthand ? 'shorthand' : ''}
    //             ${node.computed ? 'computed' : ''}
    //   >
    //     ${key}${node.value.jsx}
    //   </property>
    // `)
    // }
    //
    // // Pattern
    // if (NODE_TYPE === 'AssignmentPattern') {
    //   return path.replace(
    //     `
    //   <assignmentPattern>${node.left.jsx}${node.right.jsx}</assignmentPattern>
    //   `
    //   )
    // } else if (NODE_TYPE === 'ObjectPattern') {
    //   const properties = _.map(node.properties, (property) => property.jsx).join('\n')
    //   return path.replace(
    //     `
    //   <objectPattern>${properties}</objectPattern>
    //   `
    //   )
    // }
    //
    // // ES6 import
    // if (NODE_TYPE === 'ImportDeclaration') {
    //   const specifier = _.first(node.specifiers)
    //   if (node.specifiers.length > 1 || n.ImportSpecifier.check(specifier)) {
    //     const specifiers = _.map(node.specifiers, (specifier) => specifier.jsx).join('\n')
    //     return path.replace(
    //       `
    //   <Import source="${node.sourcep.value}">${specifiers}</Import>
    //   `
    //     )
    //   } else {
    //     const specifier = _.first(node.specifiers)
    //     const isDefault = n.ImportDefaultSpecifier.check(specifier)
    //     return path.replace(
    //       `<Import name="${specifier.jsx}" source="${node.sourcep.value}" ${isDefault ? 'default' : ''}/>`
    //     )
    //   }
    // } else if (NODE_TYPE === 'ImportDefaultSpecifier') {
    //   return path.replace(
    //     `${node.local.name}`
    //   )
    // } else if (NODE_TYPE === 'ImportNamespaceSpecifier') {
    //   return path.replace(
    //     `${node.local.name}`
    //   )
    // } else if (NODE_TYPE === 'ImportSpecifier') {
    //   // Fix circular.
    //   return path.replace(
    //     `
    //   <importSpecifier>${node.imported.jsx}${node.local.jsx}</importSpecifier>
    //   `
    //   )
    // }
    //
    // // ES6 export
    // if (NODE_TYPE === 'ExportDefaultDeclaration') {
    //   return path.replace(
    //     `
    //   <Export default>${node.declaration.jsx}</Export>
    //   `
    //   )
    // } else if (NODE_TYPE === 'ExportNamedDeclaration') {
    //   return path.replace(
    //     `
    //   <Export>${node.declaration.jsx}</Export>
    //   `
    //   )
    // }
    //
    // // Variable
    // if (NODE_TYPE === 'VariableDeclarator') {
    //   // apply update if id.type === ObjectPattern
    //   if (n.ObjectPattern.check(node.id)) {
    //     return path.replace(
    //       `<Declarator>${node.id.jsx}${node.init ? node.init.jsx : ''}</Declarator>`
    //     )
    //   }
    //
    //   // skip update if parent not use declarator.
    //   if (node.parent.declarations.length <= 1) return
    //
    //   return path.replace(
    //     `<Declarator name="${node.id.name}">${node.init ? node.init.jsx : ''}</Declarator>`
    //   )
    // } else if (NODE_TYPE === 'VariableDeclaration') {
    //   // defaults
    //   let name = null
    //   let declarations = _.map(node.declarations, (declaration) => declaration.jsx).join('\n')
    //
    //   // if single variable declaration
    //   if (node.declarations.length === 1 && n.VariableDeclarator.check(_.first(node.declarations))) {
    //     const declarator = _.first(node.declarations)
    //     declarations = declarator.init ? [
    //       `${declarator.init.jsx}`
    //     ] : []
    //     // set name only if id.type = 'Identifier'
    //     if (n.Identifier.check(declarator.id)) {
    //       name = declarator.id.name
    //     } else if (n.ObjectPattern.check(declarator.id)) {
    //       declarations = [
    //         `${declarator.jsx}`
    //       ]
    //     }
    //   }
    //
    //   if (_.toLower(node.kind) === 'const') {
    //     return path.replace(
    //       `
    //   <Const ${name ? `name="${name}"` : ''}>${declarations}</Const>
    //   `
    //     )
    //   } else if (_.toLower(node.kind) === 'let') {
    //     return path.replace(
    //       `
    //   <Let ${name ? `name="${name}"` : ''}>${declarations}</Let>
    //   `
    //     )
    //   } else if (_.toLower(node.kind) === 'var') {
    //     return path.replace(
    //       `
    //   <Var ${name ? `name="${name}"` : ''}>${declarations}</Var>
    //   `
    //     )
    //   }
    // }
    //
    // // jsx
    // if (NODE_TYPE === 'JSXIdentifier') {
    //   return
    // } else if (NODE_TYPE === 'JSXOpeningElement') {
    //   return
    // } else if (NODE_TYPE === 'JSXClosingElement') {
    //   return
    // } else if (NODE_TYPE === 'JSXText') {
    //   return
    // } else if (NODE_TYPE === 'JSXElement') {
    //   const {openingElement} = node
    //   const children = _.map(node.children, (child) => child.jsx).join('\n')
    //
    //   // const properties = _.reduce(node.properties, (result, property) => {
    //   //   result[property.key.name] = property.value.value
    //   //   return result
    //   // }, {})
    //   // const withES = n.ExpressionStatement.check(node.parent)
    //   // return path.replace(`
    //   //   <Value ${withES ? 'es' : ''}>{${JSON.stringify(properties)}}</Value>
    //   // `)
    //
    //   const attributes = _.map(openingElement.attributes, (child) => child.jsx).join('\n')
    //   const tagName = openingElement.name.name
    //   return path.replace(`
    //     <JSX
    //       tagName="${tagName}"
    //       ${attributes}
    //     >
    //       ${children}
    //     </JSX>
    //   `)
    // } else if (NODE_TYPE === 'JSXAttribute') {
    //   if (!node.name) return path.replace('')
    //
    //   let value = node.value ? `{${node.value.jsx}}` : ''
    //   if (n.Literal.check(node.value)) {
    //     value = `"${node.value.value}"`
    //   }
    //
    //   return path.replace(`${node.name.jsx}${value ? `=${value}` : ''}`)
    // } else if (NODE_TYPE === 'JSXExpressionContainer') {
    //   return path.replace(node.expression.jsx)
    // }
    //
    // // ES6
    // if (NODE_TYPE === 'YieldExpression') {
    //   return path.replace(`<yieldExpression>${node.argument.jsx}</yieldExpression>`)
    // }
    //
    // if (NODE_TYPE === 'ClassDeclaration') {
    //   return path.replace(`<ClassDef id="${node.id ? node.id.name : 'null'}">${node.superClass ? node.superClass.jsx : ''}${node.body.jsx}</ClassDef>`)
    // } else if (NODE_TYPE === 'ClassExpression') {
    //   const args = _.map(node.arguments, (argument) => argument.jsx).join('\n')
    //   return path.replace(`<classExpression>${args}</classExpression>`)
    // } else if (NODE_TYPE === 'ClassBody') {
    //   const body = _.map(node.body, (row) => row.jsx).join('\n')
    //   return path.replace(`${body}`)
    // } else if (NODE_TYPE === 'MethodDefinition') {
    //   if (n.Expression.check(node.key)) {
    //     return path.replace(`<Method kind="${node.kind}" ${node.static ? 'static' : ''}>${node.key.jsx}${node.value.jsx}</Method>`)
    //   }
    //   return path.replace(`<Method kind="${node.kind}" key={${node.key.jsx}} ${node.static ? 'static' : ''}>${node.value.jsx}</Method>`)
    // }
    //
    // // ES7
    // if (NODE_TYPE === 'AwaitExpression') {
    //   return path.replace(`<awaitExpression>${node.argument.jsx}</awaitExpression>`)
    // }
  }
}
