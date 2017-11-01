/* global describe, it */
/** @jsx h */

import toBuilder from 'lib/transform'
import format from 'lib/utils/formatter'
import print from 'lib/utils/print'

import recast from 'recast'

import h from 'lib/h'

import {
  Program,

  ForStatement,
  ForInStatement,
  ForOfStatement,
  DebuggerStatement,
  ReturnStatement,
  ExpressionStatement,

  CallExpression,
  ArrayExpression,
  ObjectExpression,
  ArrowFunctionExpression,
  MemberExpression,
  BinaryExpression,
  AssignmentExpression,
  UpdateExpression,
  FunctionExpression,

  BlockStatement,
  IfStatement,
  LabeledStatement,
  BreakStatement,
  DoWhileStatement,
  WhileStatement,
  ContinueStatement,

  Property,

  ImportDeclaration,
  ImportDefaultSpecifier,
  ImportNamespaceSpecifier,
  ImportSpecifier,

  ExportDefaultDeclaration,
  ExportNamedDeclaration,

  AssignmentPattern,
  ObjectPattern,

  VariableDeclaration,
  VariableDeclarator,

  Identifier,
  Literal,
} from 'lib/components'

import * as types from 'ast-types'
const {namedTypes: n, builders: b} = types

const assert = require('assert')

describe('toBuilder', () => {
  it('should convert CallExpression', () => {
    const code = 'hoge()'

    assert(toBuilder(code, {to: 'jsx'}).code === format(`
      const render = () => (
        <ExpressionStatement>
          <CallExpression>
            <Identifier>hoge</Identifier>
          </CallExpression>
        </ExpressionStatement>
      )
    `))

    const render = () => (
      <ExpressionStatement>
        <CallExpression>
          <Identifier>hoge</Identifier>
        </CallExpression>
      </ExpressionStatement>
    )

    assert(format(print([render()])) === format(code))
  })

  it('should convert chained CallExpression', () => {
    const code = 'hoge("arg1").fuga("arg2")'

    assert(toBuilder(code, {to: 'jsx'}).code === format(`
      const render = () => (
        <ExpressionStatement>
          <CallExpression>
            <MemberExpression>
              <CallExpression>
                <Identifier>hoge</Identifier>
                <Literal>arg1</Literal>
              </CallExpression>
              <Identifier>fuga</Identifier>
            </MemberExpression>
            <Literal>arg2</Literal>
          </CallExpression>
        </ExpressionStatement>
      )
    `))

    const render = () => (
      <ExpressionStatement>
        <CallExpression>
          <MemberExpression>
            <CallExpression>
              <Identifier>hoge</Identifier>
              <Literal>arg1</Literal>
            </CallExpression>
            <Identifier>fuga</Identifier>
          </MemberExpression>
          <Literal>arg2</Literal>
        </CallExpression>
      </ExpressionStatement>
    )

    assert(format(print([render()])) === format(code))
  })

  it('should convert CallExpression with arguments', () => {
    const code = 'hoge(\'fuga\')'

    assert(toBuilder(code).code === format(`
      const render = () => (
        <ExpressionStatement>
          <CallExpression>
            <Identifier>hoge</Identifier>
            <Literal>fuga</Literal>
          </CallExpression>
        </ExpressionStatement>
      )
    `))

    const render = () => (
      <ExpressionStatement>
        <CallExpression>
          <Identifier>hoge</Identifier>
          <Literal>fuga</Literal>
        </CallExpression>
      </ExpressionStatement>
    )

    assert(format(print([render()])) === format(code))
  })

  it('should convert ArrayExpression', () => {
    const code = '[]'

    assert(toBuilder(code).code === format(`
      const render = () => (
        <ExpressionStatement>
          <ArrayExpression />
        </ExpressionStatement>
      )
    `))

    const render = () => (
      <ExpressionStatement>
        <ArrayExpression />
      </ExpressionStatement>
    )

    assert(format(print([render()])) === format(code))
  })

  it('should convert ArrayExpression with arguments', () => {
    const code = '[1, 2, 3]'

    assert(toBuilder(code).code === format(`
      const render = () => (
        <ExpressionStatement>
          <ArrayExpression>
            <Literal>{1}</Literal>
            <Literal>{2}</Literal>
            <Literal>{3}</Literal>
          </ArrayExpression>
        </ExpressionStatement>
      )
    `))

    const render = () => (
      <ExpressionStatement>
        <ArrayExpression>
          <Literal>{1}</Literal>
          <Literal>{2}</Literal>
          <Literal>{3}</Literal>
        </ArrayExpression>
      </ExpressionStatement>
    )

    assert(format(print([render()])) === format(code))
  })

  it('should convert VariableDeclaration', () => {
    const code = 'const hoge = "hoge"'

    assert(toBuilder(code).code === format(`
      const render = () => (
        <VariableDeclaration kind="const">
          <VariableDeclarator>
            <Identifier>hoge</Identifier>
            <Literal>hoge</Literal>
          </VariableDeclarator>
        </VariableDeclaration>
      )
    `))

    const render = () => (
      <VariableDeclaration kind="const">
        <VariableDeclarator>
          <Identifier>hoge</Identifier>
          <Literal>hoge</Literal>
        </VariableDeclarator>
      </VariableDeclaration>
    )

    assert(format(print([render()])) === format(code))
  })

  it('should convert VariableDeclaration with object', () => {
    const code = `const hoge = {
      HOGE: 'hoge'
    }`

    assert(toBuilder(code).code === format(`
      const render = () => (
        <VariableDeclaration kind="const">
          <VariableDeclarator>
            <Identifier>hoge</Identifier>
            <ObjectExpression>
              <Property kind="init" method={false} shorthand={false} computed={false}>
                <Identifier>HOGE</Identifier>
                <Literal>hoge</Literal>
              </Property>
            </ObjectExpression>
          </VariableDeclarator>
        </VariableDeclaration>
      )
    `))

    const render = () => (
      <VariableDeclaration kind="const">
        <VariableDeclarator>
          <Identifier>hoge</Identifier>
          <ObjectExpression>
            <Property kind="init" method={false} shorthand={false} computed={false}>
              <Identifier>HOGE</Identifier>
              <Literal>hoge</Literal>
            </Property>
          </ObjectExpression>
        </VariableDeclarator>
      </VariableDeclaration>
    )

    assert(format(print([render()])) === format(code))
  })

  it('should convert Empty arrow function expression', () => {
    const code = 'const render = () => {}'

    assert(toBuilder(code).code === format(`
      const render = () => (
        <VariableDeclaration kind="const">
          <VariableDeclarator>
            <Identifier>render</Identifier>
            <ArrowFunctionExpression>
              <BlockStatement />
            </ArrowFunctionExpression>
          </VariableDeclarator>
        </VariableDeclaration>
      )
    `))

    const render = () => (
      <VariableDeclaration kind="const">
        <VariableDeclarator>
          <Identifier>render</Identifier>
          <ArrowFunctionExpression>
            <BlockStatement />
          </ArrowFunctionExpression>
        </VariableDeclarator>
      </VariableDeclaration>
    )

    assert(format(print([render()])) === format(code))
  })

  it('should convert single line arrow function expression', () => {
    const code = 'const render = (str) => console.log(str)'

    assert(toBuilder(code).code === format(`
      const render = () => (
        <VariableDeclaration kind="const">
          <VariableDeclarator>
            <Identifier>render</Identifier>
            <ArrowFunctionExpression>
              <Identifier>str</Identifier>
              <CallExpression>
                <MemberExpression>
                  <Identifier>console</Identifier>
                  <Identifier>log</Identifier>
                </MemberExpression>
                <Identifier>str</Identifier>
              </CallExpression>
            </ArrowFunctionExpression>
          </VariableDeclarator>
        </VariableDeclaration>
      )
    `))

    const render = () => (
      <VariableDeclaration kind="const">
        <VariableDeclarator>
          <Identifier>render</Identifier>
          <ArrowFunctionExpression>
            <Identifier>str</Identifier>
            <CallExpression>
              <MemberExpression>
                <Identifier>console</Identifier>
                <Identifier>log</Identifier>
              </MemberExpression>
              <Identifier>str</Identifier>
            </CallExpression>
          </ArrowFunctionExpression>
        </VariableDeclarator>
      </VariableDeclaration>
    )

    assert(format(print([render()])) === format(code))
  })

  it('should convert block arrow function expression', () => {
    const code = 'const render = (str) => {console.log(str)}'

    assert(toBuilder(code).code === format(`
      const render = () => (
        <VariableDeclaration kind="const">
          <VariableDeclarator>
            <Identifier>render</Identifier>
            <ArrowFunctionExpression>
              <Identifier>str</Identifier>
              <BlockStatement>
                <ExpressionStatement>
                  <CallExpression>
                    <MemberExpression>
                      <Identifier>console</Identifier>
                      <Identifier>log</Identifier>
                    </MemberExpression>
                    <Identifier>str</Identifier>
                  </CallExpression>
                </ExpressionStatement>
              </BlockStatement>
            </ArrowFunctionExpression>
          </VariableDeclarator>
        </VariableDeclaration>
      )
    `))

    const render = () => (
      <VariableDeclaration kind="const">
        <VariableDeclarator>
          <Identifier>render</Identifier>
          <ArrowFunctionExpression>
            <Identifier>str</Identifier>
            <BlockStatement>
              <ExpressionStatement>
                <CallExpression>
                  <MemberExpression>
                    <Identifier>console</Identifier>
                    <Identifier>log</Identifier>
                  </MemberExpression>
                  <Identifier>str</Identifier>
                </CallExpression>
              </ExpressionStatement>
            </BlockStatement>
          </ArrowFunctionExpression>
        </VariableDeclarator>
      </VariableDeclaration>
    )

    assert(format(print([render()])) === format(code))
  })

  it('should convert Identifier', () => {
    const code = 'hoge'

    assert(toBuilder(code).code === format(`
      const render = () => (
        <ExpressionStatement>
          <Identifier>hoge</Identifier>
        </ExpressionStatement>
      )
    `))

    const render = () => (
      <ExpressionStatement>
        <Identifier>hoge</Identifier>
      </ExpressionStatement>
    )

    assert(format(print([render()])) === format(code))
  })

  it('should convert module import', () => {
    const code = 'import hoge from \'hoge\''

    assert(toBuilder(code).code === format(`
      const render = () => (
        <ImportDeclaration>
          <ImportDefaultSpecifier>
            <Identifier>hoge</Identifier>
          </ImportDefaultSpecifier>
          <Literal>hoge</Literal>
        </ImportDeclaration>
      )
    `))

    const render = () => (
      <ImportDeclaration>
        <ImportDefaultSpecifier>
          <Identifier>hoge</Identifier>
        </ImportDefaultSpecifier>
        <Literal>hoge</Literal>
      </ImportDeclaration>
    )

    assert(format(print([render()])) === format(code))
  })

  it('should convert module default export', () => {
    const code = `export default 'hoge'`

    assert(toBuilder(code).code === format(`
      const render = () => (
        <ExportDefaultDeclaration>
          <Literal>hoge</Literal>
        </ExportDefaultDeclaration>
      )
    `))

    const render = () => (
      <ExportDefaultDeclaration>
        <Literal>hoge</Literal>
      </ExportDefaultDeclaration>
    )

    assert(format(print([render()])) === format(code))
  })

  it('should convert module named export', () => {
    const code = `export const hoge = 'hoge'`

    assert(toBuilder(code).code === format(`
      const render = () => (
        <ExportNamedDeclaration>
          <VariableDeclaration kind="const">
            <VariableDeclarator>
              <Identifier>hoge</Identifier>
              <Literal>hoge</Literal>
            </VariableDeclarator>
          </VariableDeclaration>
        </ExportNamedDeclaration>
      )
    `))

    const render = () => (
      <ExportNamedDeclaration>
        <VariableDeclaration kind="const">
          <VariableDeclarator>
            <Identifier>hoge</Identifier>
            <Literal>hoge</Literal>
          </VariableDeclarator>
        </VariableDeclaration>
      </ExportNamedDeclaration>
    )

    assert(format(print([render()])) === format(code))
  })

  it('should convert module import * as ...', () => {
    const code = 'import * as hoge from \'hoge\''

    assert(toBuilder(code).code === format(`
      const render = () => (
        <ImportDeclaration>
          <ImportNamespaceSpecifier>
            <Identifier>hoge</Identifier>
          </ImportNamespaceSpecifier>
          <Literal>hoge</Literal>
        </ImportDeclaration>
      )
    `))

    const render = () => (
      <ImportDeclaration>
        <ImportNamespaceSpecifier>
          <Identifier>hoge</Identifier>
        </ImportNamespaceSpecifier>
        <Literal>hoge</Literal>
      </ImportDeclaration>
    )

    assert(format(print([render()])) === format(code))
  })

  it('should convert module named import', () => {
    const code = 'import { hoge } from \'hoge\''

    assert(toBuilder(code).code === format(`
      const render = () => (
        <ImportDeclaration>
          <ImportSpecifier>
            <Identifier>hoge</Identifier>
            <Identifier>hoge</Identifier>
          </ImportSpecifier>
          <Literal>hoge</Literal>
        </ImportDeclaration>
      )
    `))

    const render = () => (
      <ImportDeclaration>
        <ImportSpecifier>
          <Identifier>hoge</Identifier>
          <Identifier>hoge</Identifier>
        </ImportSpecifier>
        <Literal>hoge</Literal>
      </ImportDeclaration>
    )

    assert(format(print([render()])) === format(code))
  })

  it('should convert module named import as ...', () => {
    const code = 'import { hoge as fuga } from \'hoge\''

    assert(toBuilder(code).code === format(`
      const render = () => (
        <ImportDeclaration>
          <ImportSpecifier>
            <Identifier>hoge</Identifier>
            <Identifier>fuga</Identifier>
          </ImportSpecifier>
          <Literal>hoge</Literal>
        </ImportDeclaration>
      )
    `))

    const render = () => (
      <ImportDeclaration>
        <ImportSpecifier>
          <Identifier>hoge</Identifier>
          <Identifier>fuga</Identifier>
        </ImportSpecifier>
        <Literal>hoge</Literal>
      </ImportDeclaration>
    )

    assert(format(print([render()])) === format(code))
  })

  it('should convert object spread', () => {
    const code = 'const { hoge } = piyo'

    assert(toBuilder(code).code === format(`
      const render = () => (
        <VariableDeclaration kind="const">
          <VariableDeclarator>
            <ObjectPattern>
              <Property kind="init" method={false} shorthand={true} computed={false}>
                <Identifier>hoge</Identifier>
                <Identifier>hoge</Identifier>
              </Property>
            </ObjectPattern>
            <Identifier>piyo</Identifier>
          </VariableDeclarator>
        </VariableDeclaration>
      )
    `))

    const render = () => (
      <VariableDeclaration kind="const">
        <VariableDeclarator>
          <ObjectPattern>
            <Property kind="init" method={false} shorthand={true} computed={false}>
              <Identifier>hoge</Identifier>
              <Identifier>hoge</Identifier>
            </Property>
          </ObjectPattern>
          <Identifier>piyo</Identifier>
        </VariableDeclarator>
      </VariableDeclaration>
    )

    assert(format(print([render()])) === format(code))
  })

  it('should convert object spread with assignment', () => {
    const code = `const {
      hoge = false
    } = piyo`

    assert(toBuilder(code).code === format(`
      const render = () => (
        <VariableDeclaration kind="const">
          <VariableDeclarator>
            <ObjectPattern>
              <Property kind="init" method={false} shorthand={true} computed={false}>
                <Identifier>hoge</Identifier>
                <AssignmentPattern>
                  <Identifier>hoge</Identifier>
                  <Literal>{false}</Literal>
                </AssignmentPattern>
              </Property>
            </ObjectPattern>
            <Identifier>piyo</Identifier>
          </VariableDeclarator>
        </VariableDeclaration>
      )
    `))

    const render = () => (
      <VariableDeclaration kind="const">
        <VariableDeclarator>
          <ObjectPattern>
            <Property kind="init" method={false} shorthand={true} computed={false}>
              <Identifier>hoge</Identifier>
              <AssignmentPattern>
                <Identifier>hoge</Identifier>
                <Literal>{false}</Literal>
              </AssignmentPattern>
            </Property>
          </ObjectPattern>
          <Identifier>piyo</Identifier>
        </VariableDeclarator>
      </VariableDeclaration>
    )

    // FIXME: { hoge = false } が再現できてない。
    assert(format(print([render()])) !== format(code))
  })

  it('should convert object spread with literal', () => {
    const code = `const { 'hoge': hoge } = piyo`

    assert(toBuilder(code).code === format(`
      const render = () => (
        <VariableDeclaration kind="const">
          <VariableDeclarator>
            <ObjectPattern>
              <Property kind="init" method={false} shorthand={false} computed={false}>
                <Literal>hoge</Literal>
                <Identifier>hoge</Identifier>
              </Property>
            </ObjectPattern>
            <Identifier>piyo</Identifier>
          </VariableDeclarator>
        </VariableDeclaration>
      )
    `))

    const render = () => (
      <VariableDeclaration kind="const">
        <VariableDeclarator>
          <ObjectPattern>
            <Property kind="init" method={false} shorthand={false} computed={false}>
              <Literal>hoge</Literal>
              <Identifier>hoge</Identifier>
            </Property>
          </ObjectPattern>
          <Identifier>piyo</Identifier>
        </VariableDeclarator>
      </VariableDeclaration>
    )

    assert(format(print([render()])) === format(code))
  })

  it('should convert object spread with computed', () => {
    const code = `const { ['hoge']: hoge } = piyo`

    assert(toBuilder(code).code === format(`
      const render = () => (
        <VariableDeclaration kind="const">
          <VariableDeclarator>
            <ObjectPattern>
              <Property kind="init" method={false} shorthand={false} computed={true}>
                <Literal>hoge</Literal>
                <Identifier>hoge</Identifier>
              </Property>
            </ObjectPattern>
            <Identifier>piyo</Identifier>
          </VariableDeclarator>
        </VariableDeclaration>
      )
    `))

    const render = () => (
      <VariableDeclaration kind="const">
        <VariableDeclarator>
          <ObjectPattern>
            <Property kind="init" method={false} shorthand={false} computed={true}>
              <Literal>hoge</Literal>
              <Identifier>hoge</Identifier>
            </Property>
          </ObjectPattern>
          <Identifier>piyo</Identifier>
        </VariableDeclarator>
      </VariableDeclaration>
    )

    assert(format(print([render()])) === format(code))
  })

  it('should convert if', () => {
    const code = `if (true) console.log('hoge');`

    assert(toBuilder(code).code === format(`
      const render = () => (
        <IfStatement>
          <Literal>{true}</Literal>
          <ExpressionStatement>
            <CallExpression>
              <MemberExpression>
                <Identifier>console</Identifier>
                <Identifier>log</Identifier>
              </MemberExpression>
              <Literal>hoge</Literal>
            </CallExpression>
          </ExpressionStatement>
        </IfStatement>
      )
    `))

    const render = () => (
      <IfStatement>
        <Literal>{true}</Literal>
        <ExpressionStatement>
          <CallExpression>
            <MemberExpression>
              <Identifier>console</Identifier>
              <Identifier>log</Identifier>
            </MemberExpression>
            <Literal>hoge</Literal>
          </CallExpression>
        </ExpressionStatement>
      </IfStatement>
    )

    assert(format(print([render()])) === format(code))
  })

  it('should convert if with BlockStatement', () => {
    const code = `if (true) {
      console.log('hoge');
    }`

    assert(toBuilder(code).code === format(`
      const render = () => (
        <IfStatement>
          <Literal>{true}</Literal>
          <BlockStatement>
            <ExpressionStatement>
              <CallExpression>
                <MemberExpression>
                  <Identifier>console</Identifier>
                  <Identifier>log</Identifier>
                </MemberExpression>
                <Literal>hoge</Literal>
              </CallExpression>
            </ExpressionStatement>
          </BlockStatement>
        </IfStatement>
      )
    `))

    const render = () => (
      <IfStatement>
        <Literal>{true}</Literal>
        <BlockStatement>
          <ExpressionStatement>
            <CallExpression>
              <MemberExpression>
                <Identifier>console</Identifier>
                <Identifier>log</Identifier>
              </MemberExpression>
              <Literal>hoge</Literal>
            </CallExpression>
          </ExpressionStatement>
        </BlockStatement>
      </IfStatement>
    )

    assert(format(print([render()])) === format(code))
  })

  it('should convert iife', () => {
    const code = `(function() {
      debugger
      return console.log('hoge')
    })()`

    assert(toBuilder(code).code /*?*/ === format(`
      const render = () => (
        <ExpressionStatement>
          <CallExpression>
            <FunctionExpression id={null}>
              <BlockStatement>
                <DebuggerStatement />
      
                <ReturnStatement>
                  <CallExpression>
                    <MemberExpression>
                      <Identifier>console</Identifier>
                      <Identifier>log</Identifier>
                    </MemberExpression>
                    <Literal>hoge</Literal>
                  </CallExpression>
                </ReturnStatement>
              </BlockStatement>
            </FunctionExpression>
          </CallExpression>
        </ExpressionStatement>
      )
    `))

    const render = () => (
      <ExpressionStatement>
        <CallExpression>
          <FunctionExpression id={null}>
            <BlockStatement>
              <DebuggerStatement />

              <ReturnStatement>
                <CallExpression>
                  <MemberExpression>
                    <Identifier>console</Identifier>
                    <Identifier>log</Identifier>
                  </MemberExpression>
                  <Literal>hoge</Literal>
                </CallExpression>
              </ReturnStatement>
            </BlockStatement>
          </FunctionExpression>
        </CallExpression>
      </ExpressionStatement>
    )

    assert(format(print([render()])) === format(code))
  })

  it('should convert if with alternate', () => {
    const code = `if (true) {
      console.log('hoge');
    } else {
      console.log('fuga');
    }`

    assert(toBuilder(code).code === format(`
      const render = () => (
        <IfStatement>
          <Literal>{true}</Literal>
          <BlockStatement>
            <ExpressionStatement>
              <CallExpression>
                <MemberExpression>
                  <Identifier>console</Identifier>
                  <Identifier>log</Identifier>
                </MemberExpression>
                <Literal>hoge</Literal>
              </CallExpression>
            </ExpressionStatement>
          </BlockStatement>
          
          <BlockStatement>
            <ExpressionStatement>
              <CallExpression>
                <MemberExpression>
                  <Identifier>console</Identifier>
                  <Identifier>log</Identifier>
                </MemberExpression>
                <Literal>fuga</Literal>
              </CallExpression>
            </ExpressionStatement>
          </BlockStatement>
        </IfStatement>
      )
    `))

    const render = () => (
      <IfStatement>
        <Literal>{true}</Literal>
        <BlockStatement>
          <ExpressionStatement>
            <CallExpression>
              <MemberExpression>
                <Identifier>console</Identifier>
                <Identifier>log</Identifier>
              </MemberExpression>
              <Literal>hoge</Literal>
            </CallExpression>
          </ExpressionStatement>
        </BlockStatement>

        <BlockStatement>
          <ExpressionStatement>
            <CallExpression>
              <MemberExpression>
                <Identifier>console</Identifier>
                <Identifier>log</Identifier>
              </MemberExpression>
              <Literal>fuga</Literal>
            </CallExpression>
          </ExpressionStatement>
        </BlockStatement>
      </IfStatement>
    )

    assert(format(print([render()])) === format(code))
  })

  it('should convert if with complex alternate', () => {
    const code = `if (true) {
      console.log('hoge');
    } else if (false) {
      console.log('fuga');
    } else {
      console.log('piyo');
    }`

    assert(toBuilder(code).code === format(`
      const render = () => (
        <IfStatement>
          <Literal>{true}</Literal>
          <BlockStatement>
            <ExpressionStatement>
              <CallExpression>
                <MemberExpression>
                  <Identifier>console</Identifier>
                  <Identifier>log</Identifier>
                </MemberExpression>
                <Literal>hoge</Literal>
              </CallExpression>
            </ExpressionStatement>
          </BlockStatement>
      
          <IfStatement>
            <Literal>{false}</Literal>
            <BlockStatement>
              <ExpressionStatement>
                <CallExpression>
                  <MemberExpression>
                    <Identifier>console</Identifier>
                    <Identifier>log</Identifier>
                  </MemberExpression>
                  <Literal>fuga</Literal>
                </CallExpression>
              </ExpressionStatement>
            </BlockStatement>
      
            <BlockStatement>
              <ExpressionStatement>
                <CallExpression>
                  <MemberExpression>
                    <Identifier>console</Identifier>
                    <Identifier>log</Identifier>
                  </MemberExpression>
                  <Literal>piyo</Literal>
                </CallExpression>
              </ExpressionStatement>
            </BlockStatement>
          </IfStatement>
        </IfStatement>
      )
    `))

    const render = () => (
      <IfStatement>
        <Literal>{true}</Literal>
        <BlockStatement>
          <ExpressionStatement>
            <CallExpression>
              <MemberExpression>
                <Identifier>console</Identifier>
                <Identifier>log</Identifier>
              </MemberExpression>
              <Literal>hoge</Literal>
            </CallExpression>
          </ExpressionStatement>
        </BlockStatement>

        <IfStatement>
          <Literal>{false}</Literal>
          <BlockStatement>
            <ExpressionStatement>
              <CallExpression>
                <MemberExpression>
                  <Identifier>console</Identifier>
                  <Identifier>log</Identifier>
                </MemberExpression>
                <Literal>fuga</Literal>
              </CallExpression>
            </ExpressionStatement>
          </BlockStatement>

          <BlockStatement>
            <ExpressionStatement>
              <CallExpression>
                <MemberExpression>
                  <Identifier>console</Identifier>
                  <Identifier>log</Identifier>
                </MemberExpression>
                <Literal>piyo</Literal>
              </CallExpression>
            </ExpressionStatement>
          </BlockStatement>
        </IfStatement>
      </IfStatement>
    )

    assert(format(print([render()])) === format(code))
  })

  it('should convert if with BinaryExpression', () => {
    const code = `if (true === true) console.log('hoge');`

    assert(toBuilder(code).code === format(`
      const render = () => (
        <IfStatement>
          <BinaryExpression operator="===">
            <Literal>{true}</Literal>
            <Literal>{true}</Literal>
          </BinaryExpression>
          <ExpressionStatement>
            <CallExpression>
              <MemberExpression>
                <Identifier>console</Identifier>
                <Identifier>log</Identifier>
              </MemberExpression>
              <Literal>hoge</Literal>
            </CallExpression>
          </ExpressionStatement>
        </IfStatement>
      )
    `))

    const render = () => (
      <IfStatement>
        <BinaryExpression operator="===">
          <Literal>{true}</Literal>
          <Literal>{true}</Literal>
        </BinaryExpression>
        <ExpressionStatement>
          <CallExpression>
            <MemberExpression>
              <Identifier>console</Identifier>
              <Identifier>log</Identifier>
            </MemberExpression>
            <Literal>hoge</Literal>
          </CallExpression>
        </ExpressionStatement>
      </IfStatement>
    )

    assert(format(print([render()])) === format(code))
  })

  it('should convert for loop', () => {
    const code = `for (step = 0; step < 5; step++) {
      if (true) {
        break
      } else {
        continue
      }
    }`

    assert(toBuilder(code).code === format(`
      const render = () => (
        <ForStatement>
          <AssignmentExpression operator="=">
            <Identifier>step</Identifier>
            <Literal>{0}</Literal>
          </AssignmentExpression>
      
          <BinaryExpression operator="<">
            <Identifier>step</Identifier>
            <Literal>{5}</Literal>
          </BinaryExpression>
      
          <UpdateExpression operator="++" prefix={false}>
            <Identifier>step</Identifier>
          </UpdateExpression>
      
          <BlockStatement>
            <IfStatement>
              <Literal>{true}</Literal>
              <BlockStatement>
                <BreakStatement />
              </BlockStatement>
      
              <BlockStatement>
                <ContinueStatement />
              </BlockStatement>
            </IfStatement>
          </BlockStatement>
        </ForStatement>
      )
    `))

    const render = () => (
      <ForStatement>
        <AssignmentExpression operator="=">
          <Identifier>step</Identifier>
          <Literal>{0}</Literal>
        </AssignmentExpression>

        <BinaryExpression operator="<">
          <Identifier>step</Identifier>
          <Literal>{5}</Literal>
        </BinaryExpression>

        <UpdateExpression operator="++" prefix={false}>
          <Identifier>step</Identifier>
        </UpdateExpression>

        <BlockStatement>
          <IfStatement>
            <Literal>{true}</Literal>
            <BlockStatement>
              <BreakStatement />
            </BlockStatement>

            <BlockStatement>
              <ContinueStatement />
            </BlockStatement>
          </IfStatement>
        </BlockStatement>
      </ForStatement>
    )

    assert(format(print([render()])) === format(code))
  })

  it('should convert do while', () => {
    const code = `
    do { 
      console.log('hoge')
    } while (true)
    `

    assert(toBuilder(code).code === format(`
      const render = () => (
        <DoWhileStatement>
          <BlockStatement>
            <ExpressionStatement>
              <CallExpression>
                <MemberExpression>
                  <Identifier>console</Identifier>
                  <Identifier>log</Identifier>
                </MemberExpression>
                <Literal>hoge</Literal>
              </CallExpression>
            </ExpressionStatement>
          </BlockStatement>
          <Literal>{true}</Literal>
        </DoWhileStatement>
      )
    `))

    const render = () => (
      <DoWhileStatement>
        <BlockStatement>
          <ExpressionStatement>
            <CallExpression>
              <MemberExpression>
                <Identifier>console</Identifier>
                <Identifier>log</Identifier>
              </MemberExpression>
              <Literal>hoge</Literal>
            </CallExpression>
          </ExpressionStatement>
        </BlockStatement>
        <Literal>{true}</Literal>
      </DoWhileStatement>
    )

    assert(format(print([render()])) === format(code))
  })

  it('should convert while', () => {
    const code = `
    while (true) console.log('hoge');
    `

    assert(toBuilder(code).code === format(`
      const render = () => (
        <WhileStatement>
          <Literal>{true}</Literal>
          <ExpressionStatement>
            <CallExpression>
              <MemberExpression>
                <Identifier>console</Identifier>
                <Identifier>log</Identifier>
              </MemberExpression>
              <Literal>hoge</Literal>
            </CallExpression>
          </ExpressionStatement>
        </WhileStatement>
      )
    `))

    const render = () => (
      <WhileStatement>
        <Literal>{true}</Literal>
        <ExpressionStatement>
          <CallExpression>
            <MemberExpression>
              <Identifier>console</Identifier>
              <Identifier>log</Identifier>
            </MemberExpression>
            <Literal>hoge</Literal>
          </CallExpression>
        </ExpressionStatement>
      </WhileStatement>
    )

    assert(format(print([render()])) === format(code))
  })

  it('should convert while with label', () => {
    const code = `
    markLoop: while (true) { break markLoop; }
    `

    assert(toBuilder(code).code === format(`
      const render = () => (
        <LabeledStatement>
          <Identifier>markLoop</Identifier>
          <WhileStatement>
            <Literal>{true}</Literal>
            <BlockStatement>
              <BreakStatement>
                <Identifier>markLoop</Identifier>
              </BreakStatement>
            </BlockStatement>
          </WhileStatement>
        </LabeledStatement>
      )
    `))

    const render = () => (
      <LabeledStatement>
        <Identifier>markLoop</Identifier>
        <WhileStatement>
          <Literal>{true}</Literal>
          <BlockStatement>
            <BreakStatement>
              <Identifier>markLoop</Identifier>
            </BreakStatement>
          </BlockStatement>
        </WhileStatement>
      </LabeledStatement>
    )

    assert(format(print([render()])) === format(code))
  })

  it('should convert for in', () => {
    const code = `
    for (var i in obj) { console.log('hoge'); }
    `

    assert(toBuilder(code).code === format(`
      const render = () => (
        <ForInStatement>
          <VariableDeclaration kind="var">
            <VariableDeclarator>
              <Identifier>i</Identifier>
            </VariableDeclarator>
          </VariableDeclaration>
          <Identifier>obj</Identifier>
          <BlockStatement>
            <ExpressionStatement>
              <CallExpression>
                <MemberExpression>
                  <Identifier>console</Identifier>
                  <Identifier>log</Identifier>
                </MemberExpression>
                <Literal>hoge</Literal>
              </CallExpression>
            </ExpressionStatement>
          </BlockStatement>
        </ForInStatement>
      )
    `))

    const render = () => (
      <ForInStatement>
        <VariableDeclaration kind="var">
          <VariableDeclarator>
            <Identifier>i</Identifier>
          </VariableDeclarator>
        </VariableDeclaration>
        <Identifier>obj</Identifier>
        <BlockStatement>
          <ExpressionStatement>
            <CallExpression>
              <MemberExpression>
                <Identifier>console</Identifier>
                <Identifier>log</Identifier>
              </MemberExpression>
              <Literal>hoge</Literal>
            </CallExpression>
          </ExpressionStatement>
        </BlockStatement>
      </ForInStatement>
    )

    assert(format(print([render()])) === format(code))
  })

  it('should convert for of', () => {
    const code = `
    for (let i of arr) { console.log(i); }
    `

    assert(toBuilder(code).code === format(`
      const render = () => (
        <ForOfStatement>
          <VariableDeclaration kind="let">
            <VariableDeclarator>
              <Identifier>i</Identifier>
            </VariableDeclarator>
          </VariableDeclaration>
          <Identifier>arr</Identifier>
          <BlockStatement>
            <ExpressionStatement>
              <CallExpression>
                <MemberExpression>
                  <Identifier>console</Identifier>
                  <Identifier>log</Identifier>
                </MemberExpression>
                <Identifier>i</Identifier>
              </CallExpression>
            </ExpressionStatement>
          </BlockStatement>
        </ForOfStatement>
      )
    `))

    const render = () => (
      <ForOfStatement>
        <VariableDeclaration kind="let">
          <VariableDeclarator>
            <Identifier>i</Identifier>
          </VariableDeclarator>
        </VariableDeclaration>
        <Identifier>arr</Identifier>
        <BlockStatement>
          <ExpressionStatement>
            <CallExpression>
              <MemberExpression>
                <Identifier>console</Identifier>
                <Identifier>log</Identifier>
              </MemberExpression>
              <Identifier>i</Identifier>
            </CallExpression>
          </ExpressionStatement>
        </BlockStatement>
      </ForOfStatement>
    )

    assert(format(print([render()])) === format(code))
  })
})

describe('option', () => {
  it('should not omit Program if shouldOmitProgram = false', () => {
    const code = 'hoge()'

    assert(toBuilder(code, {shouldOmitProgram: false}).code === format(`
      const render = () => (
        <Program>
          <ExpressionStatement>
            <CallExpression>
              <Identifier>hoge</Identifier>
            </CallExpression>
          </ExpressionStatement>
        </Program>
      )
    `))

    const render = () => (
      <Program>
        <ExpressionStatement>
          <CallExpression>
            <Identifier>hoge</Identifier>
          </CallExpression>
        </ExpressionStatement>
      </Program>
    )

    assert(format(recast.print(render()).code) === format(code))
  })
})
