/* global describe, it */

import toBuilder from 'lib/transform'
import format from 'lib/utils/formatter'
import { babelAndEval } from 'test/helper'
import os from 'os'

const assert = require('assert')
const EOL = os.EOL ? os.EOL : '\n'

describe('toBuilder', () => {
  it('should convert Identifier', () => {
    const code = 'hoge'

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.

      const render = () => (
        <program>
          <expressionStatement>
            <identifier name="hoge" />
          </expressionStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })

  it('should convert CallExpression', () => {
    const code = 'hoge()'

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.
      
      const render = () => (
        <program>
          <expressionStatement>
            <callExpression>
              <identifier name="hoge" />
            </callExpression>
          </expressionStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })

  it('should convert blank string', () => {
    const code = `const a = ''`

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.
      
      const render = () => (
        <program>
          <variableDeclaration kind="const">
            <variableDeclarator>
              <identifier name="a" />
              <literal value="" />
            </variableDeclarator>
          </variableDeclaration>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })

  it('should convert CallExpression with memberExpression', () => {
    const code = 'console.log()'

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.

      const render = () => (
        <program>
          <expressionStatement>
            <callExpression>
              <memberExpression computed={false}>
                <identifier name="console" />
                <identifier name="log" />
              </memberExpression>
            </callExpression>
          </expressionStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })

  it('should convert generator', () => {
    const code = `
      const hoge = function*() {
        yield true;
      }
    `

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.

      const render = () => (
        <program>
          <variableDeclaration kind="const">
            <variableDeclarator>
              <identifier name="hoge" />
              <functionExpression id={null} generator={true} expression={false}>
                <blockStatement>
                  <expressionStatement>
                    <yieldExpression delegate={false}>
                      <literal value={true} />
                    </yieldExpression>
                  </expressionStatement>
                </blockStatement>
              </functionExpression>
            </variableDeclarator>
          </variableDeclaration>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })

  it('should convert async/await', () => {
    const code = `
      const hoge = async () => {
        await fuga()
      }
    `

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.

      const render = () => (
        <program>
          <variableDeclaration kind="const">
            <variableDeclarator>
              <identifier name="hoge" />
              <arrowFunctionExpression expression={false} async={true}>
                <blockStatement>
                  <expressionStatement>
                    <awaitExpression all={false}>
                      <callExpression>
                        <identifier name="fuga" />
                      </callExpression>
                    </awaitExpression>
                  </expressionStatement>
                </blockStatement>
              </arrowFunctionExpression>
            </variableDeclarator>
          </variableDeclaration>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })

  it('should convert Class', () => {
    const code = `
      class Hoge extends Component{
        constructor() {
          this.hoge = ''
        }

        static piyo() {}
        fuga() {}
      }
    `

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.
      
      const render = () => (
        <program>
          <classDeclaration>
            <identifier name="Hoge" />
            <classBody>
              <methodDefinition kind="constructor" static={false}>
                <identifier name="constructor" />
                <functionExpression id={null} generator={false} expression={false}>
                  <blockStatement>
                    <expressionStatement>
                      <assignmentExpression operator="=">
                        <memberExpression computed={false}>
                          <thisExpression />
                          <identifier name="hoge" />
                        </memberExpression>
                        <literal value="" />
                      </assignmentExpression>
                    </expressionStatement>
                  </blockStatement>
                </functionExpression>
              </methodDefinition>
              <methodDefinition kind="method" static={true}>
                <identifier name="piyo" />
                <functionExpression id={null} generator={false} expression={false}>
                  <blockStatement />
                </functionExpression>
              </methodDefinition>
              <methodDefinition kind="method" static={false}>
                <identifier name="fuga" />
                <functionExpression id={null} generator={false} expression={false}>
                  <blockStatement />
                </functionExpression>
              </methodDefinition>
            </classBody>
            <identifier name="Component" />
          </classDeclaration>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })

  it('should multiline code', () => {
    const code = 'hoge(); fuga();'
    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.
      
      const render = () => (
        <program>
          <expressionStatement>
            <callExpression>
              <identifier name="hoge" />
            </callExpression>
          </expressionStatement>
          <expressionStatement>
            <callExpression>
              <identifier name="fuga" />
            </callExpression>
          </expressionStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })

  it('should convert chained CallExpression', () => {
    const code = 'hoge("arg1").fuga("arg2")'

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.
      
      const render = () => (
        <program>
          <expressionStatement>
            <callExpression>
              <memberExpression computed={false}>
                <callExpression>
                  <identifier name="hoge" />
                  <literal value="arg1" />
                </callExpression>
                <identifier name="fuga" />
              </memberExpression>
              <literal value="arg2" />
            </callExpression>
          </expressionStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })

  it('should convert nested CallExpression', () => {
    const code = 'fuga(hoge("arg1"), "arg2")'

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.
      
      const render = () => (
        <program>
          <expressionStatement>
            <callExpression>
              <identifier name="fuga" />
              <callExpression>
                <identifier name="hoge" />
                <literal value="arg1" />
              </callExpression>
              <literal value="arg2" />
            </callExpression>
          </expressionStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })

  it('should convert CallExpression with arguments', () => {
    const code = 'hoge(\'fuga\')'

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.
      
      const render = () => (
        <program>
          <expressionStatement>
            <callExpression>
              <identifier name="hoge" />
              <literal value="fuga" />
            </callExpression>
          </expressionStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })

  it('should convert ArrayExpression', () => {
    const code = '[]'

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.
      
      const render = () => (
        <program>
          <expressionStatement>
            <arrayExpression />
          </expressionStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })

  it('should convert ArrayExpression with arguments', () => {
    const code = '[1, 2, 3]'

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.
      
      const render = () => (
        <program>
          <expressionStatement>
            <arrayExpression>
              <literal>{1}</literal>
              <literal>{2}</literal>
              <literal>{3}</literal>
            </arrayExpression>
          </expressionStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })

  it('should convert array rest spread', () => {
    const code = 'const [ hoge, ...fuga ] = piyo'

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.
      
      const render = () => (
        <program>
          <variableDeclaration kind="const">
            <variableDeclarator>
              <arrayPattern>
                <identifier name="hoge" />
                <restElement>
                  <identifier name="fuga" />
                </restElement>
              </arrayPattern>
              <identifier name="piyo" />
            </variableDeclarator>
          </variableDeclaration>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })

  it('should convert VariableDeclaration', () => {
    const code = 'const hoge = "hoge"'

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.
      
      const render = () => (
        <program>
          <variableDeclaration kind="const">
            <variableDeclarator>
              <identifier name="hoge" />
              <literal value="hoge" />
            </variableDeclarator>
          </variableDeclaration>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })

  it('should convert VariableDeclaration with ArrayExpression', () => {
    const code = 'const hoge = []'

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.
      
      const render = () => (
        <program>
          <variableDeclaration kind="const">
            <variableDeclarator>
              <identifier name="hoge" />
              <arrayExpression />
            </variableDeclarator>
          </variableDeclaration>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })

  it('should convert multiple VariableDeclaration', () => {
    const code = 'const hoge = "hoge", fuga = "fuga"'

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.

      const render = () => (
        <program>
          <variableDeclaration kind="const">
            <variableDeclarator>
              <identifier name="hoge" />
              <literal value="hoge" />
            </variableDeclarator>
            <variableDeclarator>
              <identifier name="fuga" />
              <literal value="fuga" />
            </variableDeclarator>
          </variableDeclaration>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })

  it('should convert multiple complex VariableDeclaration', () => {
    const code = 'const hoge = "hoge", fuga = () => {}'

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.

      const render = () => (
        <program>
          <variableDeclaration kind="const">
            <variableDeclarator>
              <identifier name="hoge" />
              <literal value="hoge" />
            </variableDeclarator>
            <variableDeclarator>
              <identifier name="fuga" />
              <arrowFunctionExpression expression={false}>
                <blockStatement />
              </arrowFunctionExpression>
            </variableDeclarator>
          </variableDeclaration>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })

  it('should convert VariableDeclaration with object', () => {
    const code = `const hoge = {
      HOGE: 'hoge'
    }`

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.

      const render = () => (
        <program>
          <variableDeclaration kind="const">
            <variableDeclarator>
              <identifier name="hoge" />
              <objectExpression>
                <property kind="init">
                  <identifier name="HOGE" />
                  <literal value="hoge" />
                </property>
              </objectExpression>
            </variableDeclarator>
          </variableDeclaration>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })

  it('should convert Empty arrow function expression', () => {
    const code = 'const render = () => {}'

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.

      const render = () => (
        <program>
          <variableDeclaration kind="const">
            <variableDeclarator>
              <identifier name="render" />
              <arrowFunctionExpression expression={false}>
                <blockStatement />
              </arrowFunctionExpression>
            </variableDeclarator>
          </variableDeclaration>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })

  it('should convert Empty function expression', () => {
    const code = 'const render = function() {}'

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.

      const render = () => (
        <program>
          <variableDeclaration kind="const">
            <variableDeclarator>
              <identifier name="render" />
              <functionExpression id={null} generator={false} expression={false}>
                <blockStatement />
              </functionExpression>
            </variableDeclarator>
          </variableDeclaration>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })

  it('should convert single line arrow function expression', () => {
    const code = 'const render = (str) => console.log(str)'

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.

      const render = () => (
        <program>
          <variableDeclaration kind="const">
            <variableDeclarator>
              <identifier name="render" />
              <arrowFunctionExpression expression={true}>
                <identifier name="str" />
                <callExpression>
                  <memberExpression computed={false}>
                    <identifier name="console" />
                    <identifier name="log" />
                  </memberExpression>
                  <identifier name="str" />
                </callExpression>
              </arrowFunctionExpression>
            </variableDeclarator>
          </variableDeclaration>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })

  it('should convert block arrow function expression', () => {
    const code = 'const render = (str) => {console.log(str)}'

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.

      const render = () => (
        <program>
          <variableDeclaration kind="const">
            <variableDeclarator>
              <identifier name="render" />
              <arrowFunctionExpression expression={false}>
                <identifier name="str" />
                <blockStatement>
                  <expressionStatement>
                    <callExpression>
                      <memberExpression computed={false}>
                        <identifier name="console" />
                        <identifier name="log" />
                      </memberExpression>
                      <identifier name="str" />
                    </callExpression>
                  </expressionStatement>
                </blockStatement>
              </arrowFunctionExpression>
            </variableDeclarator>
          </variableDeclaration>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })

  it('should convert Identifier', () => {
    const code = 'hoge'

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.

      const render = () => (
        <program>
          <expressionStatement>
            <identifier name="hoge" />
          </expressionStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })

  it('should convert module import', () => {
    const code = 'import hoge from \'hoge\''

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.
      
      const render = () => (
        <program>
          <importDeclaration importKind="value">
            <importDefaultSpecifier>
              <identifier name="hoge" />
            </importDefaultSpecifier>
            <literal value="hoge" />
          </importDeclaration>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })

  it('should convert module default export', () => {
    const code = `export default 'hoge'`

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.
      
      const render = () => (
        <program>
          <exportDefaultDeclaration>
            <literal value="hoge" />
          </exportDefaultDeclaration>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })

  it('should convert module named export', () => {
    const code = `export const hoge = 'hoge'`

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.
      
      const render = () => (
        <program>
          <exportNamedDeclaration source={null}>
            <variableDeclaration kind="const">
              <variableDeclarator>
                <identifier name="hoge" />
                <literal value="hoge" />
              </variableDeclarator>
            </variableDeclaration>
          </exportNamedDeclaration>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })

  it('should convert module import * as ...', () => {
    const code = 'import * as hoge from \'hoge\''

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.
      
      const render = () => (
        <program>
          <importDeclaration importKind="value">
            <importNamespaceSpecifier>
              <identifier name="hoge" />
            </importNamespaceSpecifier>
            <literal value="hoge" />
          </importDeclaration>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })

  it('should convert module named import', () => {
    const code = 'import { hoge } from \'hoge\''

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.
      
      const render = () => (
        <program>
          <importDeclaration importKind="value">
            <importSpecifier>
              <identifier name="hoge" />
              <identifier name="hoge" />
            </importSpecifier>
            <literal value="hoge" />
          </importDeclaration>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })

  it('should convert module named import as ...', () => {
    const code = 'import { hoge as fuga, fuga as piyo } from \'hoge\''

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.
      
      const render = () => (
        <program>
          <importDeclaration importKind="value">
            <importSpecifier>
              <identifier name="hoge" />
              <identifier name="fuga" />
            </importSpecifier>
            <importSpecifier>
              <identifier name="fuga" />
              <identifier name="piyo" />
            </importSpecifier>
            <literal value="hoge" />
          </importDeclaration>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })

  it('should convert object spread', () => {
    const code = 'const { hoge } = piyo'

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.
      
      const render = () => (
        <program>
          <variableDeclaration kind="const">
            <variableDeclarator>
              <objectPattern>
                <property kind="init" shorthand={true}>
                  <identifier name="hoge" />
                  <identifier name="hoge" />
                </property>
              </objectPattern>
              <identifier name="piyo" />
            </variableDeclarator>
          </variableDeclaration>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })

  it('should convert object assignment', () => {
    const code = `
      const hoge = {
        hoge: 'HOGE'
      }
    `

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.
      
      const render = () => (
        <program>
          <variableDeclaration kind="const">
            <variableDeclarator>
              <identifier name="hoge" />
              <objectExpression>
                <property kind="init">
                  <identifier name="hoge" />
                  <literal value="HOGE" />
                </property>
              </objectExpression>
            </variableDeclarator>
          </variableDeclaration>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })

  it('should convert object rest spread', () => {
    const code = 'const { hoge, ...rest } = piyo'

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.
      
      const render = () => (
        <program>
          <variableDeclaration kind="const">
            <variableDeclarator>
              <objectPattern>
                <property kind="init" shorthand={true}>
                  <identifier name="hoge" />
                  <identifier name="hoge" />
                </property>
                <restProperty>
                  <identifier name="rest" />
                </restProperty>
              </objectPattern>
              <identifier name="piyo" />
            </variableDeclarator>
          </variableDeclaration>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })

  it('should convert object spread with assignment', () => {
    const code = `const {
      hoge = false
    } = piyo`

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.
      
      const render = () => (
        <program>
          <variableDeclaration kind="const">
            <variableDeclarator>
              <objectPattern>
                <property kind="init" shorthand={true}>
                  <identifier name="hoge" />
                  <assignmentPattern>
                    <identifier name="hoge" />
                    <literal value={false} />
                  </assignmentPattern>
                </property>
              </objectPattern>
              <identifier name="piyo" />
            </variableDeclarator>
          </variableDeclaration>
        </program>
      )
    `))

    // FIXME: rendered will be `const { hoge } = piyo` (assignment is ignored...)
    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode !== format(code))
  })

  it('should convert object spread with literal', () => {
    const code = `const { 'hoge': hoge } = piyo`

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.

      const render = () => (
        <program>
          <variableDeclaration kind="const">
            <variableDeclarator>
              <objectPattern>
                <property kind="init">
                  <literal value="hoge" />
                  <identifier name="hoge" />
                </property>
              </objectPattern>
              <identifier name="piyo" />
            </variableDeclarator>
          </variableDeclaration>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })

  it('should convert object spread with computed', () => {
    const code = `const { ['hoge']: hoge } = piyo`

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.

      const render = () => (
        <program>
          <variableDeclaration kind="const">
            <variableDeclarator>
              <objectPattern>
                <property kind="init" computed={true}>
                  <literal value="hoge" />
                  <identifier name="hoge" />
                </property>
              </objectPattern>
              <identifier name="piyo" />
            </variableDeclarator>
          </variableDeclaration>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })

  it('should convert if', () => {
    const code = `if (true) console.log('hoge');`

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.

      const render = () => (
        <program>
          <ifStatement alternate={null}>
            <literal value={true} />
            <expressionStatement>
              <callExpression>
                <memberExpression computed={false}>
                  <identifier name="console" />
                  <identifier name="log" />
                </memberExpression>
                <literal value="hoge" />
              </callExpression>
            </expressionStatement>
          </ifStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })

  it('should convert if with BlockStatement', () => {
    const code = `if (true) {
      console.log('hoge');
    }`

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.

      const render = () => (
        <program>
          <ifStatement alternate={null}>
            <literal value={true} />
            <blockStatement>
              <expressionStatement>
                <callExpression>
                  <memberExpression computed={false}>
                    <identifier name="console" />
                    <identifier name="log" />
                  </memberExpression>
                  <literal value="hoge" />
                </callExpression>
              </expressionStatement>
            </blockStatement>
          </ifStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })

  it('should convert iife', () => {
    const code = `(function() {
      debugger
      return console.log('hoge')
    })()`

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.

      const render = () => (
        <program>
          <expressionStatement>
            <callExpression>
              <functionExpression id={null} generator={false} expression={false}>
                <blockStatement>
                  <debuggerStatement />
                  <returnStatement>
                    <callExpression>
                      <memberExpression computed={false}>
                        <identifier name="console" />
                        <identifier name="log" />
                      </memberExpression>
                      <literal value="hoge" />
                    </callExpression>
                  </returnStatement>
                </blockStatement>
              </functionExpression>
            </callExpression>
          </expressionStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })

  it('should convert complex iife', () => {
    const code = `(function hoge(hoge, fuga) {
      debugger
      return console.log('hoge')
    })('hoge', 'fuga')`

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.

      const render = () => (
        <program>
          <expressionStatement>
            <callExpression>
              <functionExpression generator={false} expression={false}>
                <identifier name="hoge" />
                <identifier name="hoge" />
                <identifier name="fuga" />
                <blockStatement>
                  <debuggerStatement />
                  <returnStatement>
                    <callExpression>
                      <memberExpression computed={false}>
                        <identifier name="console" />
                        <identifier name="log" />
                      </memberExpression>
                      <literal value="hoge" />
                    </callExpression>
                  </returnStatement>
                </blockStatement>
              </functionExpression>
              <literal value="hoge" />
              <literal value="fuga" />
            </callExpression>
          </expressionStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })

  it('should convert if with alternate', () => {
    const code = `if (true) {
      console.log('hoge');
    } else {
      console.log('fuga');
    }`

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.

      const render = () => (
        <program>
          <ifStatement>
            <literal value={true} />
            <blockStatement>
              <expressionStatement>
                <callExpression>
                  <memberExpression computed={false}>
                    <identifier name="console" />
                    <identifier name="log" />
                  </memberExpression>
                  <literal value="hoge" />
                </callExpression>
              </expressionStatement>
            </blockStatement>
            <blockStatement>
              <expressionStatement>
                <callExpression>
                  <memberExpression computed={false}>
                    <identifier name="console" />
                    <identifier name="log" />
                  </memberExpression>
                  <literal value="fuga" />
                </callExpression>
              </expressionStatement>
            </blockStatement>
          </ifStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
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
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.
      
      const render = () => (
        <program>
          <ifStatement>
            <literal value={true} />
            <blockStatement>
              <expressionStatement>
                <callExpression>
                  <memberExpression computed={false}>
                    <identifier name="console" />
                    <identifier name="log" />
                  </memberExpression>
                  <literal value="hoge" />
                </callExpression>
              </expressionStatement>
            </blockStatement>
            <ifStatement>
              <literal value={false} />
              <blockStatement>
                <expressionStatement>
                  <callExpression>
                    <memberExpression computed={false}>
                      <identifier name="console" />
                      <identifier name="log" />
                    </memberExpression>
                    <literal value="fuga" />
                  </callExpression>
                </expressionStatement>
              </blockStatement>
              <blockStatement>
                <expressionStatement>
                  <callExpression>
                    <memberExpression computed={false}>
                      <identifier name="console" />
                      <identifier name="log" />
                    </memberExpression>
                    <literal value="piyo" />
                  </callExpression>
                </expressionStatement>
              </blockStatement>
            </ifStatement>
          </ifStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })

  it('should convert if with BinaryExpression', () => {
    const code = `if (true === true) console.log('hoge');`

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.
      
      const render = () => (
        <program>
          <ifStatement alternate={null}>
            <binaryExpression operator="===">
              <literal value={true} />
              <literal value={true} />
            </binaryExpression>
            <expressionStatement>
              <callExpression>
                <memberExpression computed={false}>
                  <identifier name="console" />
                  <identifier name="log" />
                </memberExpression>
                <literal value="hoge" />
              </callExpression>
            </expressionStatement>
          </ifStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
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
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.
      
      const render = () => (
        <program>
          <forStatement>
            <assignmentExpression operator="=">
              <identifier name="step" />
              <literal>{0}</literal>
            </assignmentExpression>
            <binaryExpression operator="<">
              <identifier name="step" />
              <literal>{5}</literal>
            </binaryExpression>
            <updateExpression operator="++" prefix={false}>
              <identifier name="step" />
            </updateExpression>
            <blockStatement>
              <ifStatement>
                <literal value={true} />
                <blockStatement>
                  <breakStatement label={null} />
                </blockStatement>
                <blockStatement>
                  <continueStatement label={null} />
                </blockStatement>
              </ifStatement>
            </blockStatement>
          </forStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })

  it('should convert do while', () => {
    const code = `
    do {
      console.log('hoge')
    } while (true)
    `

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.
      
      const render = () => (
        <program>
          <doWhileStatement>
            <blockStatement>
              <expressionStatement>
                <callExpression>
                  <memberExpression computed={false}>
                    <identifier name="console" />
                    <identifier name="log" />
                  </memberExpression>
                  <literal value="hoge" />
                </callExpression>
              </expressionStatement>
            </blockStatement>
            <literal value={true} />
          </doWhileStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })

  it('should convert while', () => {
    const code = `
    while (true) console.log('hoge');
    `

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.
      
      const render = () => (
        <program>
          <whileStatement>
            <literal value={true} />
            <expressionStatement>
              <callExpression>
                <memberExpression computed={false}>
                  <identifier name="console" />
                  <identifier name="log" />
                </memberExpression>
                <literal value="hoge" />
              </callExpression>
            </expressionStatement>
          </whileStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })

  it('should convert while with label', () => {
    const code = `
    markLoop: while (true) { break markLoop; }
    `

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.
      
      const render = () => (
        <program>
          <labeledStatement>
            <identifier name="markLoop" />
            <whileStatement>
              <literal value={true} />
              <blockStatement>
                <breakStatement>
                  <identifier name="markLoop" />
                </breakStatement>
              </blockStatement>
            </whileStatement>
          </labeledStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })

  it('should convert for in', () => {
    const code = `
    for (var i in obj) { console.log('hoge'); }
    `

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.
      
      const render = () => (
        <program>
          <forInStatement each={false}>
            <variableDeclaration kind="var">
              <variableDeclarator init={null}>
                <identifier name="i" />
              </variableDeclarator>
            </variableDeclaration>
            <identifier name="obj" />
            <blockStatement>
              <expressionStatement>
                <callExpression>
                  <memberExpression computed={false}>
                    <identifier name="console" />
                    <identifier name="log" />
                  </memberExpression>
                  <literal value="hoge" />
                </callExpression>
              </expressionStatement>
            </blockStatement>
          </forInStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })

  it('should convert for of', () => {
    const code = `
      for (let i of arr) { console.log(i); }
    `

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.
      
      const render = () => (
        <program>
          <forOfStatement>
            <variableDeclaration kind="let">
              <variableDeclarator init={null}>
                <identifier name="i" />
              </variableDeclarator>
            </variableDeclaration>
            <identifier name="arr" />
            <blockStatement>
              <expressionStatement>
                <callExpression>
                  <memberExpression computed={false}>
                    <identifier name="console" />
                    <identifier name="log" />
                  </memberExpression>
                  <identifier name="i" />
                </callExpression>
              </expressionStatement>
            </blockStatement>
          </forOfStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })

  // JSX
  it('should convert simple jsx', () => {
    const code = `
      const render = () => {
        return (
          <span>hoge</span>
        )
      }
    `

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.

      const render = () => (
        <program>
          <variableDeclaration kind="const">
            <variableDeclarator>
              <identifier name="render" />
              <arrowFunctionExpression expression={false}>
                <blockStatement>
                  <returnStatement>
                    <jsxElement>
                      <jsxOpeningElement selfClosing={false}>
                        <jsxIdentifier name="span" />
                      </jsxOpeningElement>
                      <jsxClosingElement>
                        <jsxIdentifier name="span" />
                      </jsxClosingElement>
                      <jsxText value="hoge" />
                    </jsxElement>
                  </returnStatement>
                </blockStatement>
              </arrowFunctionExpression>
            </variableDeclarator>
          </variableDeclaration>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })

  it('should convert jsx with attributes', () => {
    const code = `
      const render = () => {
        return (
          <span
            id="example"
            style={{
              color: 'red'
            }}
            hidden
          >hoge</span>
        )
      }
    `

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.

      const render = () => (
        <program>
          <variableDeclaration kind="const">
            <variableDeclarator>
              <identifier name="render" />
              <arrowFunctionExpression expression={false}>
                <blockStatement>
                  <returnStatement>
                    <jsxElement>
                      <jsxOpeningElement selfClosing={false}>
                        <jsxIdentifier name="span" />
                        <jsxAttribute>
                          <jsxIdentifier name="id" />
                          <literal value="example" />
                        </jsxAttribute>
                        <jsxAttribute>
                          <jsxIdentifier name="style" />
                          <jsxExpressionContainer>
                            <objectExpression>
                              <property kind="init">
                                <identifier name="color" />
                                <literal value="red" />
                              </property>
                            </objectExpression>
                          </jsxExpressionContainer>
                        </jsxAttribute>
                        <jsxAttribute value={null}>
                          <jsxIdentifier name="hidden" />
                        </jsxAttribute>
                      </jsxOpeningElement>
                      <jsxClosingElement>
                        <jsxIdentifier name="span" />
                      </jsxClosingElement>
                      <jsxText value="hoge" />
                    </jsxElement>
                  </returnStatement>
                </blockStatement>
              </arrowFunctionExpression>
            </variableDeclarator>
          </variableDeclaration>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })

  // Flow
  it('should convert Flow to valid JS', () => {
    const code = `var a: string = 'hoge';`

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.

      const render = () => (
        <program>
          <variableDeclaration kind="var">
            <variableDeclarator>
              <identifier name="a">
                <typeAnnotation>
                  <stringTypeAnnotation />
                </typeAnnotation>
              </identifier>
              <literal value="hoge" />
            </variableDeclarator>
          </variableDeclaration>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    // should convert to valid JavaScript(without Flow annotation.)
    assert(renderedCode === format(`var a = 'hoge'`))
  })
})

describe('option', () => {
  it('should omit program if shouldOmitprogram = true', () => {
    const code = 'hoge()'

    assert(toBuilder(code, {shouldOmitProgram: true}).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.

      const render = () => (
        <expressionStatement>
          <callExpression>
            <identifier name="hoge" />
          </callExpression>
        </expressionStatement>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })
})

describe('comments', () => {
  it('should convert line comment', () => {
    const code = '// comment\nhoge'

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.

      const render = () => (
        <program>
          <expressionStatement leadingComments={['// comment']}>
            <identifier name="hoge" />
          </expressionStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })

  it('should convert line comment with variableDeclaration', () => {
    const code = `// comment\nconst hoge = 'fuga'`

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.

      const render = () => (
        <program>
          <variableDeclaration kind="const" leadingComments={['// comment']}>
            <variableDeclarator>
              <identifier name="hoge" />
              <literal value="fuga" />
            </variableDeclarator>
          </variableDeclaration>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })

  it('should convert trailing line comment', () => {
    const code = 'hoge // comment'

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.

      const render = () => (
        <program>
          <expressionStatement trailingComments={['// comment']}>
            <identifier name="hoge" />
          </expressionStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })

  it('should convert multiple line comment', () => {
    const code = '// comment1\n// comment2\nhoge'

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.

      const render = () => (
        <program>
          <expressionStatement leadingComments={['// comment1', '// comment2']}>
            <identifier name="hoge" />
          </expressionStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })

  it('should convert block comment', () => {
    const code = '/* hoge */\nhoge'

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.

      const render = () => (
        <program>
          <expressionStatement leadingComments={['/* hoge */']}>
            <identifier name="hoge" />
          </expressionStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })

  it('should convert trailing block comment', () => {
    const code = 'hoge /* hoge */'

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.

      const render = () => (
        <program>
          <expressionStatement trailingComments={['/* hoge */']}>
            <identifier name="hoge" />
          </expressionStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    assert(renderedCode === format(code))
  })

  it('should convert multi-line block comment with \n', () => {
    const code = '/* hoge\nfuga */\nhoge'

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.

      const render = () => (
        <program>
          <expressionStatement leadingComments={['/* hoge\\nfuga */']}>
            <identifier name="hoge" />
          </expressionStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    // should replace line feed by os.EOL
    assert(renderedCode === format('/* hoge\nfuga */\nhoge\n'))
  })

  it('should convert multi-line block comment with \r\n', () => {
    const code = '/* hoge\r\nfuga */\r\nhoge\r\n'

    assert(toBuilder(code).code === format(`
      /** @jsx h */
      // const h = require('js-to-builder').h // use h from js-to-builder.

      const render = () => (
        <program>
          <expressionStatement leadingComments={['/* hoge\\nfuga */']}>
            <identifier name="hoge" />
          </expressionStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(toBuilder(code).code))
    // should replace line feed by os.EOL
    assert(renderedCode === format('/* hoge\nfuga */\nhoge\n'))
  })
})
