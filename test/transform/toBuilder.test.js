/* global describe, it */

import toBuilder from 'lib/transform'
import format from 'lib/utils/formatter'
import { babelAndEval } from 'test/helper'

const assert = require('assert')

describe('toBuilder', () => {
  it('should convert CallExpression', () => {
    const code = 'hoge()'

    assert(toBuilder(code).code === format(`
      const render = () => (
        <program>
          <expressionStatement>
            <callExpression>
              <identifier>hoge</identifier>
            </callExpression>
          </expressionStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert CallExpression with memberExpression', () => {
    const code = 'console.log()'

    assert(toBuilder(code).code === format(`
      const render = () => (
        <program>
          <expressionStatement>
            <callExpression>
              <memberExpression>
                <identifier>console</identifier>
                <identifier>log</identifier>
              </memberExpression>
            </callExpression>
          </expressionStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert async/await', () => {
    const code = `
      const hoge = async () => {
        await fuga()
      }
    `

    assert(toBuilder(code).code === format(`
      const render = () => (
        <program>
          <variableDeclaration kind="const">
            <variableDeclarator>
              <identifier>hoge</identifier>
              <arrowFunctionExpression async>
                <blockStatement>
                  <expressionStatement>
                    <awaitExpression>
                      <callExpression>
                        <identifier>fuga</identifier>
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
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code).code}`))
    assert(renderedCode === format(code))
  })

  it('should multiline code', () => {
    const code = 'hoge(); fuga();'
    assert(toBuilder(code).code === format(`
      const render = () => (
        <program>
          <expressionStatement>
            <callExpression>
              <identifier>hoge</identifier>
            </callExpression>
          </expressionStatement>
          <expressionStatement>
            <callExpression>
              <identifier>fuga</identifier>
            </callExpression>
          </expressionStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert chained CallExpression', () => {
    const code = 'hoge("arg1").fuga("arg2")'

    assert(toBuilder(code).code === format(`
      const render = () => (
        <program>
          <expressionStatement>
            <callExpression>
              <memberExpression>
                <callExpression>
                  <identifier>hoge</identifier>
                  <literal>arg1</literal>
                </callExpression>
                <identifier>fuga</identifier>
              </memberExpression>
              <literal>arg2</literal>
            </callExpression>
          </expressionStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert nested CallExpression', () => {
    const code = 'fuga(hoge("arg1"), "arg2")'

    assert(toBuilder(code).code === format(`
      const render = () => (
        <program>
          <expressionStatement>
            <callExpression>
              <identifier>fuga</identifier>
              <callExpression>
                <identifier>hoge</identifier>
                <literal>arg1</literal>
              </callExpression>
      
              <literal>arg2</literal>
            </callExpression>
          </expressionStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert CallExpression with arguments', () => {
    const code = 'hoge(\'fuga\')'

    assert(toBuilder(code).code === format(`
      const render = () => (
        <program>
          <expressionStatement>
            <callExpression>
              <identifier>hoge</identifier>
              <literal>fuga</literal>
            </callExpression>
          </expressionStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert ArrayExpression', () => {
    const code = '[]'

    assert(toBuilder(code).code === format(`
      const render = () => (
        <program>
          <expressionStatement>
            <arrayExpression />
          </expressionStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert ArrayExpression with arguments', () => {
    const code = '[1, 2, 3]'

    assert(toBuilder(code).code === format(`
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
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert VariableDeclaration', () => {
    const code = 'const hoge = "hoge"'

    assert(toBuilder(code).code === format(`
      const render = () => (
        <program>
          <variableDeclaration kind="const">
            <variableDeclarator>
              <identifier>hoge</identifier>
              <literal>hoge</literal>
            </variableDeclarator>
          </variableDeclaration>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert VariableDeclaration with ArrayExpression', () => {
    const code = 'const hoge = []'

    assert(toBuilder(code).code === format(`
      const render = () => (
        <program>
          <variableDeclaration kind="const">
            <variableDeclarator>
              <identifier>hoge</identifier>
              <arrayExpression />
            </variableDeclarator>
          </variableDeclaration>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert multiple VariableDeclaration', () => {
    const code = 'const hoge = "hoge", fuga = "fuga"'

    assert(toBuilder(code).code === format(`
      const render = () => (
        <program>
          <variableDeclaration kind="const">
            <variableDeclarator>
              <identifier>hoge</identifier>
              <literal>hoge</literal>
            </variableDeclarator>
            
            <variableDeclarator>
              <identifier>fuga</identifier>
              <literal>fuga</literal>
            </variableDeclarator>
          </variableDeclaration>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert multiple complex VariableDeclaration', () => {
    const code = 'const hoge = "hoge", fuga = () => {}'

    assert(toBuilder(code).code === format(`
      const render = () => (
        <program>
          <variableDeclaration kind="const">
            <variableDeclarator>
              <identifier>hoge</identifier>
              <literal>hoge</literal>
            </variableDeclarator>
      
            <variableDeclarator>
              <identifier>fuga</identifier>
              <arrowFunctionExpression>
                <blockStatement />
              </arrowFunctionExpression>
            </variableDeclarator>
          </variableDeclaration>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert VariableDeclaration with object', () => {
    const code = `const hoge = {
      HOGE: 'hoge'
    }`

    assert(toBuilder(code).code === format(`
      const render = () => (
        <program>
          <variableDeclaration kind="const">
            <variableDeclarator>
              <identifier>hoge</identifier>
              <objectExpression>
                <property kind="init">
                  <identifier>HOGE</identifier>
                  <literal>hoge</literal>
                </property>
              </objectExpression>
            </variableDeclarator>
          </variableDeclaration>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert Empty arrow function expression', () => {
    const code = 'const render = () => {}'

    assert(toBuilder(code).code === format(`
      const render = () => (
        <program>
          <variableDeclaration kind="const">
            <variableDeclarator>
              <identifier>render</identifier>
              <arrowFunctionExpression>
                <blockStatement />
              </arrowFunctionExpression>
            </variableDeclarator>
          </variableDeclaration>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert Empty function expression', () => {
    const code = 'const render = function() {}'

    assert(toBuilder(code).code === format(`
      const render = () => (
        <program>
          <variableDeclaration kind="const">
            <variableDeclarator>
              <identifier>render</identifier>
              <functionExpression>
                <blockStatement />
              </functionExpression>
            </variableDeclarator>
          </variableDeclaration>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert single line arrow function expression', () => {
    const code = 'const render = (str) => console.log(str)'

    assert(toBuilder(code).code === format(`
      const render = () => (
        <program>
          <variableDeclaration kind="const">
            <variableDeclarator>
              <identifier>render</identifier>
              <arrowFunctionExpression>
                <identifier>str</identifier>
                <callExpression>
                  <memberExpression>
                    <identifier>console</identifier>
                    <identifier>log</identifier>
                  </memberExpression>
                  <identifier>str</identifier>
                </callExpression>
              </arrowFunctionExpression>
            </variableDeclarator>
          </variableDeclaration>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert block arrow function expression', () => {
    const code = 'const render = (str) => {console.log(str)}'

    assert(toBuilder(code).code === format(`
      const render = () => (
        <program>
          <variableDeclaration kind="const">
            <variableDeclarator>
              <identifier>render</identifier>
              <arrowFunctionExpression>
                <identifier>str</identifier>
                <blockStatement>
                  <expressionStatement>
                    <callExpression>
                      <memberExpression>
                        <identifier>console</identifier>
                        <identifier>log</identifier>
                      </memberExpression>
                      <identifier>str</identifier>
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
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert Identifier', () => {
    const code = 'hoge'

    assert(toBuilder(code).code === format(`
      const render = () => (
        <program>
          <expressionStatement>
            <identifier>hoge</identifier>
          </expressionStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert module import', () => {
    const code = 'import hoge from \'hoge\''

    assert(toBuilder(code).code === format(`
      const render = () => (
        <program>
          <importDeclaration>
            <importDefaultSpecifier>
              <identifier>hoge</identifier>
            </importDefaultSpecifier>
            <literal>hoge</literal>
          </importDeclaration>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert module default export', () => {
    const code = `export default 'hoge'`

    assert(toBuilder(code).code === format(`
      const render = () => (
        <program>
          <exportDefaultDeclaration>
            <literal>hoge</literal>
          </exportDefaultDeclaration>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert module named export', () => {
    const code = `export const hoge = 'hoge'`

    assert(toBuilder(code).code === format(`
      const render = () => (
        <program>
          <exportNamedDeclaration>
            <variableDeclaration kind="const">
              <variableDeclarator>
                <identifier>hoge</identifier>
                <literal>hoge</literal>
              </variableDeclarator>
            </variableDeclaration>
          </exportNamedDeclaration>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert module import * as ...', () => {
    const code = 'import * as hoge from \'hoge\''

    assert(toBuilder(code).code === format(`
      const render = () => (
        <program>
          <importDeclaration>
            <importNamespaceSpecifier>
              <identifier>hoge</identifier>
            </importNamespaceSpecifier>
            <literal>hoge</literal>
          </importDeclaration>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert module named import', () => {
    const code = 'import { hoge } from \'hoge\''

    assert(toBuilder(code).code === format(`
      const render = () => (
        <program>
          <importDeclaration>
            <importSpecifier>
              <identifier>hoge</identifier>
              <identifier>hoge</identifier>
            </importSpecifier>
            <literal>hoge</literal>
          </importDeclaration>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert module named import as ...', () => {
    const code = 'import { hoge as fuga, fuga as piyo } from \'hoge\''

    assert(toBuilder(code).code === format(`
      const render = () => (
        <program>
          <importDeclaration>
            <importSpecifier>
              <identifier>hoge</identifier>
              <identifier>fuga</identifier>
            </importSpecifier>
            
            <importSpecifier>
              <identifier>fuga</identifier>
              <identifier>piyo</identifier>
            </importSpecifier>
            <literal>hoge</literal>
          </importDeclaration>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert object spread', () => {
    const code = 'const { hoge } = piyo'

    assert(toBuilder(code).code === format(`
      const render = () => (
        <program>
          <variableDeclaration kind="const">
            <variableDeclarator>
              <objectPattern>
                <property kind="init" shorthand>
                  <identifier>hoge</identifier>
                  <identifier>hoge</identifier>
                </property>
              </objectPattern>
              <identifier>piyo</identifier>
            </variableDeclarator>
          </variableDeclaration>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert object spread with assignment', () => {
    const code = `const {
      hoge = false
    } = piyo`

    assert(toBuilder(code).code === format(`
      const render = () => (
        <program>
          <variableDeclaration kind="const">
            <variableDeclarator>
              <objectPattern>
                <property kind="init" shorthand>
                  <identifier>hoge</identifier>
                  <assignmentPattern>
                    <identifier>hoge</identifier>
                    <literal>{false}</literal>
                  </assignmentPattern>
                </property>
              </objectPattern>
              <identifier>piyo</identifier>
            </variableDeclarator>
          </variableDeclaration>
        </program>
      )
    `))

    // FIXME: rendered will be `const { hoge } = piyo` (assignment is ignored...)
    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code).code}`))
    assert(renderedCode !== format(code))
  })

  it('should convert object spread with literal', () => {
    const code = `const { 'hoge': hoge } = piyo`

    assert(toBuilder(code).code === format(`
      const render = () => (
        <program>
          <variableDeclaration kind="const">
            <variableDeclarator>
              <objectPattern>
                <property kind="init">
                  <literal>hoge</literal>
                  <identifier>hoge</identifier>
                </property>
              </objectPattern>
              <identifier>piyo</identifier>
            </variableDeclarator>
          </variableDeclaration>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert object spread with computed', () => {
    const code = `const { ['hoge']: hoge } = piyo`

    assert(toBuilder(code).code === format(`
      const render = () => (
        <program>
          <variableDeclaration kind="const">
            <variableDeclarator>
              <objectPattern>
                <property kind="init" computed>
                  <literal>hoge</literal>
                  <identifier>hoge</identifier>
                </property>
              </objectPattern>
              <identifier>piyo</identifier>
            </variableDeclarator>
          </variableDeclaration>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert if', () => {
    const code = `if (true) console.log('hoge');`

    assert(toBuilder(code).code === format(`
      const render = () => (
        <program>
          <ifStatement>
            <literal>{true}</literal>
            <expressionStatement>
              <callExpression>
                <memberExpression>
                  <identifier>console</identifier>
                  <identifier>log</identifier>
                </memberExpression>
                <literal>hoge</literal>
              </callExpression>
            </expressionStatement>
          </ifStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert if with BlockStatement', () => {
    const code = `if (true) {
      console.log('hoge');
    }`

    assert(toBuilder(code).code === format(`
      const render = () => (
        <program>
          <ifStatement>
            <literal>{true}</literal>
            <blockStatement>
              <expressionStatement>
                <callExpression>
                  <memberExpression>
                    <identifier>console</identifier>
                    <identifier>log</identifier>
                  </memberExpression>
                  <literal>hoge</literal>
                </callExpression>
              </expressionStatement>
            </blockStatement>
          </ifStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert iife', () => {
    const code = `(function() {
      debugger
      return console.log('hoge')
    })()`

    assert(toBuilder(code).code === format(`
      const render = () => (
        <program>
          <expressionStatement>
            <callExpression>
              <functionExpression>
                <blockStatement>
                  <debuggerStatement />

                  <returnStatement>
                    <callExpression>
                      <memberExpression>
                        <identifier>console</identifier>
                        <identifier>log</identifier>
                      </memberExpression>
                      <literal>hoge</literal>
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
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert complex iife', () => {
    const code = `(function hoge(hoge, fuga) {
      debugger
      return console.log('hoge')
    })('hoge', 'fuga')`

    assert(toBuilder(code).code === format(`
      const render = () => (
        <program>
          <expressionStatement>
            <callExpression>
              <functionExpression id={<identifier>hoge</identifier>}>
                <identifier>hoge</identifier>
                <identifier>fuga</identifier>
                <blockStatement>
                  <debuggerStatement />
      
                  <returnStatement>
                    <callExpression>
                      <memberExpression>
                        <identifier>console</identifier>
                        <identifier>log</identifier>
                      </memberExpression>
                      <literal>hoge</literal>
                    </callExpression>
                  </returnStatement>
                </blockStatement>
              </functionExpression>
              <literal>hoge</literal>
              <literal>fuga</literal>
            </callExpression>
          </expressionStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert if with alternate', () => {
    const code = `if (true) {
      console.log('hoge');
    } else {
      console.log('fuga');
    }`

    assert(toBuilder(code).code === format(`
      const render = () => (
        <program>
          <ifStatement>
            <literal>{true}</literal>
            <blockStatement>
              <expressionStatement>
                <callExpression>
                  <memberExpression>
                    <identifier>console</identifier>
                    <identifier>log</identifier>
                  </memberExpression>
                  <literal>hoge</literal>
                </callExpression>
              </expressionStatement>
            </blockStatement>

            <blockStatement>
              <expressionStatement>
                <callExpression>
                  <memberExpression>
                    <identifier>console</identifier>
                    <identifier>log</identifier>
                  </memberExpression>
                  <literal>fuga</literal>
                </callExpression>
              </expressionStatement>
            </blockStatement>
          </ifStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code).code}`))
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
      const render = () => (
        <program>
          <ifStatement>
            <literal>{true}</literal>
            <blockStatement>
              <expressionStatement>
                <callExpression>
                  <memberExpression>
                    <identifier>console</identifier>
                    <identifier>log</identifier>
                  </memberExpression>
                  <literal>hoge</literal>
                </callExpression>
              </expressionStatement>
            </blockStatement>

            <ifStatement>
              <literal>{false}</literal>
              <blockStatement>
                <expressionStatement>
                  <callExpression>
                    <memberExpression>
                      <identifier>console</identifier>
                      <identifier>log</identifier>
                    </memberExpression>
                    <literal>fuga</literal>
                  </callExpression>
                </expressionStatement>
              </blockStatement>

              <blockStatement>
                <expressionStatement>
                  <callExpression>
                    <memberExpression>
                      <identifier>console</identifier>
                      <identifier>log</identifier>
                    </memberExpression>
                    <literal>piyo</literal>
                  </callExpression>
                </expressionStatement>
              </blockStatement>
            </ifStatement>
          </ifStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert if with BinaryExpression', () => {
    const code = `if (true === true) console.log('hoge');`

    assert(toBuilder(code).code === format(`
      const render = () => (
        <program>
          <ifStatement>
            <binaryExpression operator="===">
              <literal>{true}</literal>
              <literal>{true}</literal>
            </binaryExpression>
            <expressionStatement>
              <callExpression>
                <memberExpression>
                  <identifier>console</identifier>
                  <identifier>log</identifier>
                </memberExpression>
                <literal>hoge</literal>
              </callExpression>
            </expressionStatement>
          </ifStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code).code}`))
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
      const render = () => (
        <program>
          <forStatement>
            <assignmentExpression operator="=">
              <identifier>step</identifier>
              <literal>{0}</literal>
            </assignmentExpression>

            <binaryExpression operator="<">
              <identifier>step</identifier>
              <literal>{5}</literal>
            </binaryExpression>

            <updateExpression operator="++" prefix={false}>
              <identifier>step</identifier>
            </updateExpression>

            <blockStatement>
              <ifStatement>
                <literal>{true}</literal>
                <blockStatement>
                  <breakStatement />
                </blockStatement>

                <blockStatement>
                  <continueStatement />
                </blockStatement>
              </ifStatement>
            </blockStatement>
          </forStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert do while', () => {
    const code = `
    do {
      console.log('hoge')
    } while (true)
    `

    assert(toBuilder(code).code === format(`
      const render = () => (
        <program>
          <doWhileStatement>
            <blockStatement>
              <expressionStatement>
                <callExpression>
                  <memberExpression>
                    <identifier>console</identifier>
                    <identifier>log</identifier>
                  </memberExpression>
                  <literal>hoge</literal>
                </callExpression>
              </expressionStatement>
            </blockStatement>
            <literal>{true}</literal>
          </doWhileStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert while', () => {
    const code = `
    while (true) console.log('hoge');
    `

    assert(toBuilder(code).code === format(`
      const render = () => (
        <program>
          <whileStatement>
            <literal>{true}</literal>
            <expressionStatement>
              <callExpression>
                <memberExpression>
                  <identifier>console</identifier>
                  <identifier>log</identifier>
                </memberExpression>
                <literal>hoge</literal>
              </callExpression>
            </expressionStatement>
          </whileStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert while with label', () => {
    const code = `
    markLoop: while (true) { break markLoop; }
    `

    assert(toBuilder(code).code === format(`
      const render = () => (
        <program>
          <labeledStatement>
            <identifier>markLoop</identifier>
            <whileStatement>
              <literal>{true}</literal>
              <blockStatement>
                <breakStatement>
                  <identifier>markLoop</identifier>
                </breakStatement>
              </blockStatement>
            </whileStatement>
          </labeledStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert for in', () => {
    const code = `
    for (var i in obj) { console.log('hoge'); }
    `

    assert(toBuilder(code).code === format(`
      const render = () => (
        <program>
          <forInStatement>
            <variableDeclaration kind="var">
              <variableDeclarator>
                <identifier>i</identifier>
              </variableDeclarator>
            </variableDeclaration>
            <identifier>obj</identifier>
            <blockStatement>
              <expressionStatement>
                <callExpression>
                  <memberExpression>
                    <identifier>console</identifier>
                    <identifier>log</identifier>
                  </memberExpression>
                  <literal>hoge</literal>
                </callExpression>
              </expressionStatement>
            </blockStatement>
          </forInStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert for of', () => {
    const code = `
      for (let i of arr) { console.log(i); }
    `

    assert(toBuilder(code).code === format(`
      const render = () => (
        <program>
          <forOfStatement>
            <variableDeclaration kind="let">
              <variableDeclarator>
                <identifier>i</identifier>
              </variableDeclarator>
            </variableDeclaration>
            <identifier>arr</identifier>
            <blockStatement>
              <expressionStatement>
                <callExpression>
                  <memberExpression>
                    <identifier>console</identifier>
                    <identifier>log</identifier>
                  </memberExpression>
                  <identifier>i</identifier>
                </callExpression>
              </expressionStatement>
            </blockStatement>
          </forOfStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code).code}`))
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
      const render = () => (
        <program>
          <variableDeclaration kind="const">
            <variableDeclarator>
              <identifier>render</identifier>
              <arrowFunctionExpression>
                <blockStatement>
                  <returnStatement>
                    <jsxElement>
                      <jsxOpeningElement
                        name={<jsxIdentifier name="span" />}
                        attributes={[]}
                        selfClosing={false}
                      />
                      <jsxText>hoge</jsxText>
                      <jsxClosingElement name={<jsxIdentifier name="span" />} />
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
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code).code}`))
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
          >
            hoge
          </span>
        )
      }
    `

    assert(toBuilder(code).code === format(`
      const render = () => (
        <program>
          <variableDeclaration kind="const">
            <variableDeclarator>
              <identifier>render</identifier>
              <arrowFunctionExpression>
                <blockStatement>
                  <returnStatement>
                    <jsxElement>
                      <jsxOpeningElement
                        name={<jsxIdentifier name="span" />}
                        attributes={[
                          <jsxAttribute
                            name={<jsxIdentifier name="id" />}
                            value={<literal>example</literal>}
                          />,
                          <jsxAttribute
                            name={<jsxIdentifier name="style" />}
                            value={
                              <jsxExpressionContainer>
                                <objectExpression>
                                  <property kind="init">
                                    <identifier>color</identifier>
                                    <literal>red</literal>
                                  </property>
                                </objectExpression>
                              </jsxExpressionContainer>
                            }
                          />,
                          <jsxAttribute
                            name={<jsxIdentifier name="hidden" />}
                            value={null}
                          />
                        ]}
                        selfClosing={false}
                      />
                        <jsxText>hoge</jsxText>
                      <jsxClosingElement name={<jsxIdentifier name="span" />} />
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
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code).code}`))
    assert(renderedCode === format(code))
  })
})

describe('option', () => {
  it('should omit program if shouldOmitprogram = true', () => {
    const code = 'hoge()'

    assert(toBuilder(code, {shouldOmitProgram: true}).code === format(`
      const render = () => (
        <expressionStatement>
          <callExpression>
            <identifier>hoge</identifier>
          </callExpression>
        </expressionStatement>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code).code}`))
    assert(renderedCode === format(code))
  })
})
