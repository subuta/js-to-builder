import _ from 'lodash'
import icepick from 'icepick'

import * as types from 'ast-types'

const {namedTypes: n, builders: b, getFieldNames, getFieldValue} = types

import { getBuilderName, getBuildParams } from 'lib/utils/recast'
import os from 'os'

import toBuilder, {
  parse,
  serializeComment
} from './toBuilder'

const extractCommentPropsString = (node) => {
  let propsString = ''

  // add comments
  if (node.leadingComments) {
    propsString += `leadingComments={${JSON.stringify(_.map(node.leadingComments, serializeComment))}} `
  }

  if (node.trailingComments) {
    propsString += `trailingComments={${JSON.stringify(_.map(node.trailingComments, serializeComment))}}`
  }

  return propsString
}

// extract value of passed node.
const valueOf = (node) => {
  if (n.Identifier.check(node)) {
    return node.name
  } else if (n.Literal.check(node)) {
    return node.value
  }
}

export default (option = {}) => {
  const builderTransform = toBuilder(option)

  const {
    shouldOmitProgram = false, // specify should/not wrap result by `b.program`
    shouldAddFieldNames = false // should print fieldNames also(defaults to `buildParams` only)
  } = option

  return (path) => {
    const {node} = path
    const replace = (jsx) => path.replace({...node, jsx})
    const {tagName, props, children} = parse(path)

    if (!node) return

    const NODE_TYPE = tagName

    if (NODE_TYPE === 'program') {
      if (shouldOmitProgram) return path.replace(`${children}`)
      return path.replace(`<program>${children}</program>`)
    }

    // run toBuilder first to get jsx.
    builderTransform(path)

    // Expression
    if (NODE_TYPE === 'callExpression') {
      const args = _.map(node.arguments, (argument) => argument.jsx).join('\n')
      const withES = n.ExpressionStatement.check(path.parentPath.node)
      const calleeNode = node.callee

      let callee = getFieldValue(node.callee, 'name')
      // if nested FnCall
      if (n.MemberExpression.check(calleeNode) && n.CallExpression.check(calleeNode.object)) {
        return replace(`
          <FnCall callee="${node.callee.property.name}" ${withES ? 'es' : ''}>
            ${node.callee.jsx}
            ${args}
          </FnCall>
        `)
      } else if (n.MemberExpression.check(calleeNode)) {
        callee = getFieldValue(calleeNode, 'jsx')
      }

      if (!callee) {
        return replace(`<FnCall ${withES ? 'es' : ''}>${node.callee.jsx}${args}</FnCall>`)
      }

      return replace(`<FnCall ${callee ? `callee="${callee}"` : ''} ${withES ? 'es' : ''}>${args}</FnCall>`)
    } else if (NODE_TYPE === 'memberExpression') {
      const stringify = (node) => {
        const objectNode = node.object
        const propertyNode = node.property

        let object = valueOf(objectNode)
        if (n.MemberExpression.check(objectNode)) {
          object = objectNode.jsx
        } else if (n.ThisExpression.check(objectNode)) {
          object = 'this'
        }

        if (n.Identifier.check(propertyNode)) {
          return `${object}.${valueOf(propertyNode)}`
        } else if (n.Literal.check(propertyNode)) {
          return `${object}['${valueOf(propertyNode)}']`
        }
      }

      // if nested FnCall
      const objectNode = node.object
      const withES = n.ExpressionStatement.check(path.parentPath.node)
      if (n.MemberExpression.check(path.parentPath.node)) {
        return replace(stringify(node))
      } else if (n.CallExpression.check(objectNode)) {
        return replace(`${objectNode.jsx}`)
      } else if (n.CallExpression.check(path.parentPath.node)) {
        return replace(stringify(node))
      }

      return replace(`<Value member="${stringify(node)}" ${withES ? 'es' : ''}/>`)
    } else if (NODE_TYPE === 'arrowFunctionExpression') {
      const params = _.map(node.params, (param) => param.jsx).join('\n')
      return replace(`<ArrowFn ${node.async ? 'async' : ''} ${node.generator ? 'generator' : ''}>${params}${node.body.jsx}</ArrowFn>`)
    } else if (NODE_TYPE === 'objectExpression') {
      // FIXME: <Value member="...user"/> でも良いかもしれない
      // return original if contains spreadProperty.
      if (_.some(node.properties, (property) => n.SpreadProperty.check(property))) return

      let properties = _.transform(node.properties, (result, property) => {
        let value = ''

        if (n.Identifier.check(property.value)) {
          value = `<Value member="${property.value.name}" />`
        } else if (n.Literal.check(property.value)) {
          value = `'${property.value.value}'`
        } else if (n.Expression.check(property.value)) {
          value = property.value.jsx
        }
        result.push([property.key.name, value])
      }, [])
      properties = `{${_.map(properties, (property) => property.join(':'))}}`

      const withES = n.ExpressionStatement.check(path.parentPath.node)

      // if JSX
      if (n.JSXExpressionContainer.check(path.parentPath.node)) {
        return replace(`${properties}`)
      }

      return replace(`
        <Value ${withES ? 'es' : ''}>{${properties}}</Value>
      `)
    } else if (NODE_TYPE === 'arrayExpression') {
      const elements = _.trim(_.map(node.elements, (element) => element.value).join(','))
      const withES = n.ExpressionStatement.check(path.parentPath.node)
      return replace(`<Value ${withES ? 'es' : ''}>{[${_.isEmpty(node.elements) ? '' : elements}]}</Value>`)
    } else if (NODE_TYPE === 'BinaryExpression') {
      return path.replace(`
      <binaryExpression operator="${node.operator}">
        ${node.left.jsx}${node.right.jsx}
      </binaryExpression>
    `)
    } else if (NODE_TYPE === 'assignmentExpression') {
      const withES = n.ExpressionStatement.check(path.parentPath.node)
      return replace(`
      <assignmentExpression operator="${node.operator}" ${withES ? 'es' : ''}>
        ${node.left.jsx}
        ${node.right.jsx}
      </assignmentExpression>
    `)
    } else if (NODE_TYPE === 'UpdateExpression') {
      return path.replace(`
      <updateExpression operator="${node.operator}" prefix={${node.prefix}}>
        ${node.argument.jsx}
      </updateExpression>
    `)
    } else if (NODE_TYPE === 'functionExpression') {
      const params = _.map(node.params, (param) => param.jsx).join('\n')
      return replace(`<Fn ${node.id ? `id="${node.id.name}"` : ''} ${node.async ? 'async' : ''} ${node.generator ? 'generator' : ''}>${params}${node.body.jsx}</Fn>`)
    }

    // Statement
    if (NODE_TYPE === 'expressionStatement') {
      return replace(`${children}`)
    } else if (NODE_TYPE === 'BlockStatement') {
      return
    } else if (NODE_TYPE === 'ReturnStatement') {
      return path.replace(`
      <returnStatement>${node.argument.jsx}</returnStatement>
    `)
    } else if (NODE_TYPE === 'DebuggerStatement') {
      return path.replace(`
      <debuggerStatement />
    `)
    } else if (NODE_TYPE === 'IfStatement') {
      return path.replace(`
      <ifStatement>
        ${node.test.jsx}${node.consequent.jsx}${node.alternate ? node.alternate.jsx : ''}
      </ifStatement>
    `)
    } else if (NODE_TYPE === 'BreakStatement') {
      return path.replace(`
      <breakStatement>
        ${node.label ? node.label.jsx : ''}
      </breakStatement>
    `)
    } else if (NODE_TYPE === 'ContinueStatement') {
      return path.replace(`
      <continueStatement>
        ${node.label ? node.label.jsx : ''}
      </continueStatement>
    `)
    } else if (NODE_TYPE === 'ForStatement') {
      return path.replace(`
      <forStatement>
        ${node.init.jsx}${node.test.jsx}${path.replace.jsx}${node.body.jsx}
      </forStatement>
    `)
    } else if (NODE_TYPE === 'ForInStatement') {
      return replace(`<forInStatement>${node.left.jsx}${node.right.jsx}${node.body.jsx}</forInStatement>
    `)
    } else if (NODE_TYPE === 'ForOfStatement') {
      return path.replace(`
      <forOfStatement>
        ${node.left.jsx}${node.right.jsx}${node.body.jsx}
      </forOfStatement>
    `)
    } else if (NODE_TYPE === 'DoWhileStatement') {
      return path.replace(`
      <doWhileStatement>
        ${node.body.jsx}${node.test.jsx}
      </doWhileStatement>
    `)
    } else if (NODE_TYPE === 'WhileStatement') {
      return path.replace(`
      <whileStatement>
        ${node.test.jsx}${node.body.jsx}
      </whileStatement>
    `)
    } else if (NODE_TYPE === 'LabeledStatement') {
      return path.replace(`
      <labeledStatement>
        ${node.label.jsx}${node.body.jsx}
      </labeledStatement>
    `)
    }

    // Primitive
    if (NODE_TYPE === 'literal') {
      let value = `{${node.value}}`
      if (_.isString(node.value)) {
        value = node.value
      }
      if (node.value === '') {
        return replace(`<Value value={""}/>`)
      }
      return replace(`<Value>${value}</Value>`)
    } else if (NODE_TYPE === 'identifier') {
      const withES = n.ExpressionStatement.check(path.parentPath.node)
      const commentPropsString = extractCommentPropsString(path.parentPath.node)
      return replace(`<identifier ${commentPropsString} ${withES ? 'es' : ''} >${node.name}</identifier>`)
    }

    // Other
    if (NODE_TYPE === 'Property') {
      // TODO: なぜかnode.key.jsxとnode.value.jsxの結果が同じになるのの調査
      let key = node.key.jsx
      if (node.key.type === 'Identifier') {
        key = `<identifier>${node.key.name}</identifier>`
      }
      return replace(`
      <property ${node.kind ? `kind="${node.kind}"` : ''}
                ${node.method ? 'method' : ''}
                ${node.shorthand ? 'shorthand' : ''}
                ${node.computed ? 'computed' : ''}
      >
        ${key}${node.value.jsx}
      </property>
    `)
    }

    // Pattern
    if (NODE_TYPE === 'assignmentPattern') {
      return replace(`<assignmentPattern>${node.left.jsx}${node.right.jsx}</assignmentPattern>`)
    } else if (NODE_TYPE === 'objectPattern') {
      const properties = _.map(node.properties, (property) => property.jsx).join('\n')
      return replace(`<objectPattern>${properties}</objectPattern>`)
    }

    // ES6 import
    if (NODE_TYPE === 'importDeclaration') {
      const specifier = _.first(node.specifiers)
      if (node.specifiers.length > 1 || n.ImportSpecifier.check(specifier)) {
        const specifiers = _.map(node.specifiers, (specifier) => specifier.jsx).join('\n')
        return replace(`<Import source="${node.source.value}">${specifiers}</Import>`)
      } else {
        const specifier = _.first(node.specifiers)
        const isDefault = n.ImportDefaultSpecifier.check(specifier)
        return replace(`<Import name="${specifier.jsx}" source="${node.source.value}" ${isDefault ? 'default' : ''}/>`)
      }
    } else if (NODE_TYPE === 'importDefaultSpecifier') {
      return replace(`${node.local.name}`)
    } else if (NODE_TYPE === 'importNamespaceSpecifier') {
      return replace(`${node.local.name}`)
    } else if (NODE_TYPE === 'importSpecifier') {
      // Fix circular.
      return replace(`<importSpecifier>${node.imported.jsx}${node.local.jsx}</importSpecifier>`)
    }

    // ES6 export
    if (NODE_TYPE === 'exportDefaultDeclaration') {
      return replace(`<Export default>${node.declaration.jsx}</Export>`)
    } else if (NODE_TYPE === 'exportNamedDeclaration') {
      return replace(`<Export>${node.declaration.jsx}</Export>`)
    }

    // Variable
    if (NODE_TYPE === 'variableDeclarator') {
      const declarations = path.parentPath.value

      // apply update if id.type === ObjectPattern
      if (n.ObjectPattern.check(node.id)) {
        return replace(`<Declarator>${node.id.jsx}${node.init ? node.init.jsx : ''}</Declarator>`)
      }

      // skip update if parent not use declarator.
      if (declarations.length <= 1) return

      return replace(`<Declarator name="${node.id.name}">${node.init ? node.init.jsx : ''}</Declarator>`)
    } else if (NODE_TYPE === 'variableDeclaration') {
      // defaults
      let name = null
      let declarations = _.map(node.declarations, (declaration) => declaration.jsx).join('\n')

      // if single variable declaration
      if (node.declarations.length === 1 && n.VariableDeclarator.check(_.first(node.declarations))) {
        const declarator = _.first(node.declarations)
        declarations = declarator.init ? [
          `${declarator.init.jsx}`
        ] : []
        // set name only if id.type = 'Identifier'
        if (n.Identifier.check(declarator.id)) {
          name = declarator.id.name
        } else if (n.ObjectPattern.check(declarator.id)) {
          declarations = [
            `${declarator.jsx}`
          ]
        } else if (n.ArrayPattern.check(declarator.id)) {
          declarations = [
            `${declarator.jsx}`
          ]
        }
      }

      const commentPropsString = extractCommentPropsString(path.node)

      if (_.toLower(node.kind) === 'const') {
        return replace(`<Const ${name ? `name="${name}"` : ''} ${commentPropsString}>${declarations}</Const>`)
      } else if (_.toLower(node.kind) === 'let') {
        return replace(`<Let ${name ? `name="${name}"` : ''} ${commentPropsString}>${declarations}</Let>`)
      } else if (_.toLower(node.kind) === 'var') {
        return replace(`<Var ${name ? `name="${name}"` : ''} ${commentPropsString}>${declarations}</Var>`)
      }
    }

    // jsx
    if (NODE_TYPE === 'jsxIdentifier') {
      return replace(`${node.name}`)
    } else if (NODE_TYPE === 'JSXOpeningElement') {
      return
    } else if (NODE_TYPE === 'JSXClosingElement') {
      return
    } else if (NODE_TYPE === 'jsxText') {
      return replace(`${node.value}`)
    } else if (NODE_TYPE === 'jsxElement') {
      const {openingElement} = node
      const children = _.map(node.children, (child) => child.jsx).join('\n')
      const attributes = _.map(openingElement.attributes, (child) => child.jsx).join('\n')
      const tagName = openingElement.name.jsx
      return replace(`
        <JSX
          tagName="${tagName}"
          ${attributes}
        >
          ${children}
        </JSX>
      `)
    } else if (NODE_TYPE === 'jsxAttribute') {
      if (!node.name) return replace('')

      let value = node.value ? `{${node.value.jsx}}` : ''
      if (n.Literal.check(node.value)) {
        value = `"${node.value.value}"`
      }

      return replace(`${node.name.jsx}${value ? `=${value}` : ''}`)
    } else if (NODE_TYPE === 'jsxExpressionContainer') {
      return replace(node.expression.jsx)
    }

    // ES6
    if (NODE_TYPE === 'yieldExpression') {
      return
    }

    if (NODE_TYPE === 'classDeclaration') {
      return replace(`<ClassDef id="${node.id ? node.id.name : 'null'}">${node.body.jsx}${node.superClass ? node.superClass.jsx : ''}</ClassDef>`)
    } else if (NODE_TYPE === 'ClassExpression') {
      const args = _.map(node.arguments, (argument) => argument.jsx).join('\n')
      return path.replace(`<classExpression>${args}</classExpression>`)
    } else if (NODE_TYPE === 'classBody') {
      const body = _.map(node.body, (row) => row.jsx).join('\n')
      return replace(`${body}`)
    } else if (NODE_TYPE === 'methodDefinition') {
      if (n.Expression.check(node.key)) {
        return replace(`<Method kind="${node.kind}" ${node.static ? 'static' : ''}>${node.key.jsx}${node.value.jsx}</Method>`)
      }
      return replace(`<Method kind="${node.kind}" key={${node.key.jsx}} ${node.static ? 'static' : ''}>${node.value.jsx}</Method>`)
    }

    // ES7
    if (NODE_TYPE === 'AwaitExpression') {
      return path.replace(`<awaitExpression>${node.argument.jsx}</awaitExpression>`)
    }
  }
}
