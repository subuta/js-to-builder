/* global describe, it */

import toBuilder from 'lib/transform'
import format from 'lib/utils/formatter'
import { babelAndEval } from 'test/helper'

const assert = require('assert')

describe('toBuilder with simple:true', () => {
  it('should convert CallExpression', () => {
    const code = 'hoge()'

    assert(toBuilder(code, {simple: true}).code === format(`
      const render = () => (
        <program>
          <FnCall callee="hoge" es/>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code, {simple: true}).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert blank string', () => {
    const code = `const a = ''`

    assert(toBuilder(code, {simple: true}).code === format(`
      const render = () => (
        <program>
          <Const name="a">
            <Value value={''} />
          </Const>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code, {simple: true}).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert CallExpression with memberExpression', () => {
    const code = 'console.log()'

    assert(toBuilder(code, {simple: true}).code === format(`
      const render = () => (
        <program>
          <FnCall callee="console.log" es/>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code, {simple: true}).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert generator', () => {
    const code = `
      const hoge = function*() {
        yield true;
      }
    `

    assert(toBuilder(code, {simple: true}).code === format(`
      const render = () => (
        <program>
          <Const name="hoge">
            <Fn generator>
              <blockStatement>
                <yieldExpression delegate={false}>
                  <Value>{true}</Value>
                </yieldExpression>
              </blockStatement>
            </Fn>
          </Const>
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

    assert(toBuilder(code, {simple: true}).code === format(`
      const render = () => (
        <program>
          <Const name="hoge">
            <ArrowFn async>
              <blockStatement>
                <awaitExpression all={false}>
                  <FnCall callee="fuga" />
                </awaitExpression>
              </blockStatement>
            </ArrowFn>
          </Const>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code).code}`))
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

    assert(toBuilder(code, {simple: true}).code === format(`
      const render = () => (
        <program>
          <ClassDef id="Hoge">
            <identifier>Component</identifier>
            <Method kind="constructor">
              <identifier>constructor</identifier>
              <Fn>
                <blockStatement>
                  <assignmentExpression operator="=">
                    this.hoge
                    <Value value={''} />
                  </assignmentExpression>
                </blockStatement>
              </Fn>
            </Method>
            <Method kind="method" static>
              <identifier>piyo</identifier>
              <Fn>
                <blockStatement />
              </Fn>
            </Method>
            <Method kind="method">
              <identifier>fuga</identifier>
              <Fn>
                <blockStatement />
              </Fn>
            </Method>
          </ClassDef>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code).code}`))
    assert(renderedCode === format(code))
  })

  it('should multiline code', () => {
    const code = 'hoge(); fuga();'
    assert(toBuilder(code, {simple: true}).code === format(`
      const render = () => (
        <program>
          <FnCall callee="hoge" es/>
          <FnCall callee="fuga" es/>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code, {simple: true}).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert chained CallExpression', () => {
    const code = 'hoge("arg1").fuga("arg2")'

    assert(toBuilder(code, {simple: true}).code === format(`
      const render = () => (
        <program>
          <FnCall callee="fuga" es>
            <FnCall callee="hoge">
              <Value>arg1</Value>
            </FnCall>
            <Value>arg2</Value>
          </FnCall>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code, {simple: true}).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert nested CallExpression', () => {
    const code = 'fuga(hoge("arg1"), "arg2")'

    assert(toBuilder(code, {simple: true}).code === format(`
      const render = () => (
        <program>
          <FnCall callee="fuga" es>
            <FnCall callee="hoge">
              <Value>arg1</Value>
            </FnCall>
            <Value>arg2</Value>
          </FnCall>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert CallExpression with arguments', () => {
    const code = 'hoge(\'fuga\')'

    assert(toBuilder(code, {simple: true}).code === format(`
      const render = () => (
        <program>
          <FnCall callee="hoge" es>
            <Value>fuga</Value>
          </FnCall>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code, {simple: true}).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert ArrayExpression', () => {
    const code = '[]'

    assert(toBuilder(code, {simple: true}).code === format(`
      const render = () => (
        <program>
          <Value es>{[]}</Value>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code, {simple: true}).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert ArrayExpression with arguments', () => {
    const code = '[1, 2, 3]'

    assert(toBuilder(code, {simple: true}).code === format(`
      const render = () => (
        <program>
          <Value es>{[1, 2, 3]}</Value>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code, {simple: true}).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert array rest spread', () => {
    const code = 'const [ hoge, ...fuga ] = piyo'

    assert(toBuilder(code, {simple: true}).code /*?*/ === format(`
      const render = () => (
        <program>
          <Const>
            <variableDeclarator>
              <arrayPattern>
                <identifier>hoge</identifier>
                <restElement>
                  <identifier>fuga</identifier>
                </restElement>
              </arrayPattern>
              <identifier>piyo</identifier>
            </variableDeclarator>
          </Const>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert VariableDeclaration', () => {
    const code = 'const hoge = "hoge"'

    assert(toBuilder(code, {simple: true}).code === format(`
       const render = () => (
         <program>
		      <Const name="hoge">
             <Value>hoge</Value>
           </Const>
         </program>
       )
     `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code, {simple: true}).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert VariableDeclaration with ArrayExpression', () => {
    const code = 'const hoge = []'

    assert(toBuilder(code, {simple: true}).code === format(`
      const render = () => (
        <program>
		      <Const name="hoge">
            <Value>{[]}</Value>
          </Const>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code, {simple: true}).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert multiple VariableDeclaration', () => {
    const code = 'const hoge = "hoge", fuga = "fuga"'

    assert(toBuilder(code, {simple: true}).code === format(`
      const render = () => (
        <program>
          <Const>
            <Declarator name="hoge">
              <Value>hoge</Value>
            </Declarator>
            <Declarator name="fuga">
              <Value>fuga</Value>
            </Declarator>
          </Const>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert multiple complex VariableDeclaration', () => {
    const code = 'const hoge = "hoge", fuga = () => {}'

    assert(toBuilder(code, {simple: true}).code === format(`
      const render = () => (
        <program>
          <Const>
            <Declarator name="hoge">
              <Value>hoge</Value>
            </Declarator>
            <Declarator name="fuga">
              <ArrowFn>
                <blockStatement />
              </ArrowFn>
            </Declarator>
          </Const>
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

    assert(toBuilder(code, {simple: true}).code === format(`
      const render = () => (
        <program>
          <Const name="hoge">
            <Value>{{ HOGE: 'hoge' }}</Value>
          </Const>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code, {simple: true}).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert Empty arrow function expression', () => {
    const code = 'const render = () => {}'

    assert(toBuilder(code, {simple: true}).code === format(`
      const render = () => (
        <program>
          <Const name="render">
            <ArrowFn>
              <blockStatement />
            </ArrowFn>
          </Const>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code, {simple: true}).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert Empty function expression', () => {
    const code = 'const render = function() {}'

    assert(toBuilder(code, {simple: true}).code === format(`
      const render = () => (
        <program>
          <Const name="render">
            <Fn>
              <blockStatement />
            </Fn>
          </Const>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code, {simple: true}).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert single line arrow function expression', () => {
    const code = 'const render = str => console.log(str)'

    assert(toBuilder(code, {simple: true}).code === format(`
      const render = () => (
        <program>
          <Const name="render">
            <ArrowFn>
              <identifier>str</identifier>
              <FnCall callee="console.log">
                <identifier>str</identifier>
              </FnCall>
            </ArrowFn>
          </Const>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code, {simple: true}).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert block arrow function expression', () => {
    const code = 'const render = str => {console.log(str)}'

    assert(toBuilder(code, {simple: true}).code === format(`
      const render = () => (
        <program>
          <Const name="render">
            <ArrowFn>
              <identifier>str</identifier>
              <blockStatement>
                <FnCall callee="console.log" es>
                  <identifier>str</identifier>
                </FnCall>
              </blockStatement>
            </ArrowFn>
          </Const>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code, {simple: true}).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert Identifier', () => {
    const code = 'hoge'

    assert(toBuilder(code, {simple: true}).code === format(`
      const render = () => (
        <program>
          <identifier es>hoge</identifier>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code, {simple: true}).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert module import', () => {
    const code = 'import hoge from \'hoge\''

    assert(toBuilder(code, {simple: true}).code === format(`
      const render = () => (
        <program>
          <Import name="hoge" source="hoge" default />
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code, {simple: true}).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert module default export', () => {
    const code = `export default 'hoge'`

    assert(toBuilder(code, {simple: true}).code === format(`
      const render = () => (
        <program>
          <Export default>
            <Value>hoge</Value>
          </Export>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code, {simple: true}).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert module named export', () => {
    const code = `export const hoge = 'hoge'`

    assert(toBuilder(code, {simple: true}).code === format(`
      const render = () => (
        <program>
          <Export>
            <Const name="hoge">
              <Value>hoge</Value>
            </Const>
          </Export>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code, {simple: true}).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert module import * as ...', () => {
    const code = 'import * as hoge from \'hoge\''

    assert(toBuilder(code, {simple: true}).code === format(`
      const render = () => (
        <program>
          <Import name="hoge" source="hoge" />
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code, {simple: true}).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert module named import', () => {
    const code = 'import { hoge } from \'hoge\''

    assert(toBuilder(code, {simple: true}).code === format(`
      const render = () => (
        <program>
          <Import source="hoge">
            <importSpecifier>
              <identifier>hoge</identifier>
              <identifier>hoge</identifier>
            </importSpecifier>
          </Import>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code, {simple: true}).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert module named import as ...', () => {
    const code = 'import { hoge as fuga, fuga as piyo } from \'hoge\''

    assert(toBuilder(code, {simple: true}).code === format(`
      const render = () => (
        <program>
          <Import source="hoge">
            <importSpecifier>
              <identifier>hoge</identifier>
              <identifier>fuga</identifier>
            </importSpecifier>
            <importSpecifier>
              <identifier>fuga</identifier>
              <identifier>piyo</identifier>
            </importSpecifier>
          </Import>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code, {simple: true}).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert object spread', () => {
    const code = 'const { hoge } = piyo'

    assert(toBuilder(code, {simple: true}).code === format(`
      const render = () => (
        <program>
          <Const>
            <Declarator>
              <objectPattern>
                <property kind="init" shorthand={true}>
                  <identifier>hoge</identifier>
                  <identifier>hoge</identifier>
                </property>
              </objectPattern>
              <identifier>piyo</identifier>
            </Declarator>
          </Const>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code, {simple: true}).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert object assignment', () => {
    const code = `
      const hoge = { 
        hoge: 'HOGE' 
      }
    `

    assert(toBuilder(code, {simple: true}).code === format(`
      const render = () => (
        <program>
          <Const name="hoge">
            <Value>{{ hoge: 'HOGE' }}</Value>
          </Const>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code, {simple: true}).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert object rest spread', () => {
    const code = 'const { hoge, ...rest } = piyo'

    assert(toBuilder(code, {simple: true}).code === format(`
      const render = () => (
        <program>
          <Const>
            <Declarator>
              <objectPattern>
                <property kind="init" shorthand={true}>
                  <identifier>hoge</identifier>
                  <identifier>hoge</identifier>
                </property>
                <restProperty>
                  <identifier>rest</identifier>
                </restProperty>
              </objectPattern>
              <identifier>piyo</identifier>
            </Declarator>
          </Const>
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

    assert(toBuilder(code, {simple: true}).code === format(`
      const render = () => (
        <program>
          <Const>
            <Declarator>
              <objectPattern>
                <property kind="init" shorthand={true}>
                  <identifier>hoge</identifier>
                  <assignmentPattern>
                    <identifier>hoge</identifier>
                    <Value>{false}</Value>
                  </assignmentPattern>
                </property>
              </objectPattern>
              <identifier>piyo</identifier>
            </Declarator>
          </Const>
        </program>
      )
    `))

    // FIXME: rendered will be `const { hoge } = piyo` (assignment is ignored...)
    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code, {simple: true}).code}`))
    assert(renderedCode !== format(code))
  })

  it('should convert object spread with literal', () => {
    const code = `const { 'hoge': hoge } = piyo`

    assert(toBuilder(code, {simple: true}).code === format(`
      const render = () => (
        <program>
          <Const>
            <Declarator>
              <objectPattern>
                <property kind="init">
                  <Value>hoge</Value>
                  <identifier>hoge</identifier>
                </property>
              </objectPattern>
              <identifier>piyo</identifier>
            </Declarator>
          </Const>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code, {simple: true}).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert object spread with computed', () => {
    const code = `const { ['hoge']: hoge } = piyo`

    assert(toBuilder(code, {simple: true}).code === format(`
      const render = () => (
        <program>
          <Const>
            <Declarator>
              <objectPattern>
                <property kind="init" computed={true}>
                  <Value>hoge</Value>
                  <identifier>hoge</identifier>
                </property>
              </objectPattern>
              <identifier>piyo</identifier>
            </Declarator>
          </Const>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code, {simple: true}).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert if', () => {
    const code = `if (true) console.log('hoge');`

    assert(toBuilder(code, {simple: true}).code === format(`
      const render = () => (
        <program>
          <ifStatement alternate={null}>
            <Value>{true}</Value>
            <FnCall callee="console.log" es>
              <Value>hoge</Value>
            </FnCall>
          </ifStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code, {simple: true}).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert if with BlockStatement', () => {
    const code = `if (true) {
      console.log('hoge');
    }`

    assert(toBuilder(code, {simple: true}).code === format(`
      const render = () => (
        <program>
          <ifStatement alternate={null}>
            <Value>{true}</Value>
            <blockStatement>
              <FnCall callee="console.log" es>
                <Value>hoge</Value>
              </FnCall>
            </blockStatement>
          </ifStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code, {simple: true}).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert iife', () => {
    const code = `(function() {
      debugger
      return console.log('hoge')
    })()`

    assert(toBuilder(code, {simple: true}).code === format(`
      const render = () => (
        <program>
          <FnCall es>
            <Fn>
              <blockStatement>
                <debuggerStatement />
                <returnStatement>
                  <FnCall callee="console.log">
                    <Value>hoge</Value>
                  </FnCall>
                </returnStatement>
              </blockStatement>
            </Fn>
          </FnCall>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code, {simple: true}).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert complex iife', () => {
    const code = `(function hoge(hoge, fuga) {
      debugger
      return console.log('hoge')
    })('hoge', 'fuga')`

    assert(toBuilder(code, {simple: true}).code === format(`
      const render = () => (
        <program>
          <FnCall es>
            <Fn id="hoge">
              <identifier>hoge</identifier>
              <identifier>fuga</identifier>
              <blockStatement>
                <debuggerStatement />
                <returnStatement>
                  <FnCall callee="console.log">
                    <Value>hoge</Value>
                  </FnCall>
                </returnStatement>
              </blockStatement>
            </Fn>
            <Value>hoge</Value>
            <Value>fuga</Value>
          </FnCall>
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

    assert(toBuilder(code, {simple: true}).code === format(`
      const render = () => (
        <program>
          <ifStatement>
            <Value>{true}</Value>
            <blockStatement>
              <FnCall callee="console.log" es>
                <Value>hoge</Value>
              </FnCall>
            </blockStatement>
            <blockStatement>
              <FnCall callee="console.log" es>
                <Value>fuga</Value>
              </FnCall>
            </blockStatement>
          </ifStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code, {simple: true}).code}`))
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

    assert(toBuilder(code, {simple: true}).code === format(`
      const render = () => (
        <program>
          <ifStatement>
            <Value>{true}</Value>
            <blockStatement>
              <FnCall callee="console.log" es>
                <Value>hoge</Value>
              </FnCall>
            </blockStatement>
            <ifStatement>
              <Value>{false}</Value>
              <blockStatement>
                <FnCall callee="console.log" es>
                  <Value>fuga</Value>
                </FnCall>
              </blockStatement>
              <blockStatement>
                <FnCall callee="console.log" es>
                  <Value>piyo</Value>
                </FnCall>
              </blockStatement>
            </ifStatement>
          </ifStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code, {simple: true}).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert if with BinaryExpression', () => {
    const code = `if (true === true) console.log('hoge');`

    assert(toBuilder(code, {simple: true}).code === format(`
      const render = () => (
        <program>
          <ifStatement alternate={null}>
            <binaryExpression operator="===">
              <Value>{true}</Value>
              <Value>{true}</Value>
            </binaryExpression>
            <FnCall callee="console.log" es>
              <Value>hoge</Value>
            </FnCall>
          </ifStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code, {simple: true}).code}`))
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

    assert(toBuilder(code, {simple: true}).code === format(`
      const render = () => (
        <program>
          <forStatement>
            <assignmentExpression operator="=">
              <identifier>step</identifier>
              <Value>{0}</Value>
            </assignmentExpression>
      
            <binaryExpression operator="<">
              <identifier>step</identifier>
              <Value>{5}</Value>
            </binaryExpression>
            <updateExpression operator="++" prefix={false}>
              <identifier>step</identifier>
            </updateExpression>
            <blockStatement>
              <ifStatement>
                <Value>{true}</Value>
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
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code, {simple: true}).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert do while', () => {
    const code = `
    do {
      console.log('hoge')
    } while (true)
    `

    assert(toBuilder(code, {simple: true}).code === format(`
      const render = () => (
        <program>
          <doWhileStatement>
            <blockStatement>
              <FnCall callee="console.log" es>
                <Value>hoge</Value>
              </FnCall>
            </blockStatement>
            <Value>{true}</Value>
          </doWhileStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code, {simple: true}).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert while', () => {
    const code = `
    while (true) console.log('hoge');
    `

    assert(toBuilder(code, {simple: true}).code === format(`
      const render = () => (
        <program>
          <whileStatement>
            <Value>{true}</Value>
            <FnCall callee="console.log" es>
              <Value>hoge</Value>
            </FnCall>
          </whileStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code, {simple: true}).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert while with label', () => {
    const code = `
    markLoop: while (true) { break markLoop; }
    `

    assert(toBuilder(code, {simple: true}).code === format(`
      const render = () => (
        <program>
          <labeledStatement>
            <identifier>markLoop</identifier>
            <whileStatement>
              <Value>{true}</Value>
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
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code, {simple: true}).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert for in', () => {
    const code = `
    for (var i in obj) { console.log('hoge'); }
    `

    assert(toBuilder(code, {simple: true}).code === format(`
      const render = () => (
        <program>
          <forInStatement each={false}>
            <Var name="i" />
            <identifier>obj</identifier>
            <blockStatement>
              <FnCall callee="console.log" es>
                <Value>hoge</Value>
              </FnCall>
            </blockStatement>
          </forInStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code, {simple: true}).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert for of', () => {
    const code = `
      for (let i of arr) { console.log(i); }
    `

    assert(toBuilder(code, {simple: true}).code === format(`
      const render = () => (
        <program>
          <forOfStatement>
            <Let name="i" />
            <identifier>arr</identifier>
            <blockStatement>
              <FnCall callee="console.log" es>
                <identifier>i</identifier>
              </FnCall>
            </blockStatement>
          </forOfStatement>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code, {simple: true}).code}`))
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

    assert(toBuilder(code, {simple: true}).code === format(`
      const render = () => (
        <program>
          <Const name="render">
            <ArrowFn>
              <blockStatement>
                <returnStatement>
                  <JSX tagName="span">hoge</JSX>
                </returnStatement>
              </blockStatement>
            </ArrowFn>
          </Const>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code, {simple: true}).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert jsx with attributes', () => {
    const code = `
      const render = () => {
        return (
          <span
            id="example"
            style={{
              color: 'red',
              backgroundColor: 'red'
            }}
            hidden
          >
            hoge
          </span>
        )
      }
    `

    assert(toBuilder(code, {simple: true}).code === format(`
      const render = () => (
        <program>
          <Const name="render">
            <ArrowFn>
              <blockStatement>
                <returnStatement>
                  <JSX
                    tagName="span"
                    id="example"
                    style={{ color: 'red', backgroundColor: 'red' }}
                    hidden
                  >
                    hoge
                  </JSX>
                </returnStatement>
              </blockStatement>
            </ArrowFn>
          </Const>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code, {simple: true}).code}`))
    assert(renderedCode === format(code))
  })

  // Flow
  it('should convert Flow to valid JS', () => {
    const code = `var a: string = 'hoge';`

    assert(toBuilder(code, {simple: true}).code === format(`
      const render = () => (
        <program>
          <Var name="a">
            <Value>hoge</Value>
          </Var>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code, {simple: true}).code}`))
    // should convert to valid JavaScript(without Flow annotation.)
    assert(renderedCode === format(`var a = 'hoge'`))
  })
})

describe('option', () => {
  it('should omit program if shouldOmitprogram = true', () => {
    const code = 'hoge()'

    assert(toBuilder(code, {shouldOmitProgram: true, simple: true}).code === format(`
      const render = () => (
        <FnCall callee="hoge" es />
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code, {simple: true}).code}`))
    assert(renderedCode === format(code))
  })
})

describe('comments', () => {
  it('should convert line comment', () => {
    const code = '// comment\nhoge'

    assert(toBuilder(code, {simple: true}).code === format(`
      const render = () => (
        <program>
          <identifier leadingComments={['// comment']} es>hoge</identifier>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code, {simple: true}).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert line comment with variableDeclaration', () => {
    const code = `// comment\nconst hoge = 'fuga'`

    assert(toBuilder(code, {simple: true}).code === format(`
      const render = () => (
        <program>
          <Const name="hoge" leadingComments={['// comment']}>
            <Value>fuga</Value>
          </Const>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code, {simple: true}).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert trailing line comment', () => {
    const code = 'hoge // comment'

    assert(toBuilder(code, {simple: true}).code === format(`
      const render = () => (
        <program>
          <identifier trailingComments={['// comment']} es>
            hoge
          </identifier>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code, {simple: true}).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert multiple line comment', () => {
    const code = '// comment1\n// comment2\nhoge'

    assert(toBuilder(code, {simple: true}).code === format(`
      const render = () => (
        <program>
          <identifier leadingComments={['// comment1', '// comment2']} es>
            hoge
          </identifier>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code, {simple: true}).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert block comment', () => {
    const code = '/* hoge */\nhoge'

    assert(toBuilder(code, {simple: true}).code === format(`
      const render = () => (
        <program>
          <identifier leadingComments={['/* hoge */']} es>
            hoge
          </identifier>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code, {simple: true}).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert trailing block comment', () => {
    const code = 'hoge /* hoge */'

    assert(toBuilder(code, {simple: true}).code === format(`
      const render = () => (
        <program>
          <identifier trailingComments={['/* hoge */']} es>
            hoge
          </identifier>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code, {simple: true}).code}`))
    assert(renderedCode === format(code))
  })

  it('should convert multi-line block comment with \n', () => {
    const code = '/* hoge\nfuga */\nhoge'

    assert(toBuilder(code, {simple: true}).code === format(`
      const render = () => (
        <program>
          <identifier leadingComments={['/* hoge\\nfuga */']} es>
            hoge
          </identifier>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code, {simple: true}).code}`))
    // should replace line feed by os.EOL
    assert(renderedCode === format('/* hoge\nfuga */\nhoge\n'))
  })

  it('should convert multi-line block comment with \r\n', () => {
    const code = '/* hoge\r\nfuga */\r\nhoge\r\n'

    assert(toBuilder(code).code === format(`
      const render = () => (
        <program>
          <identifier leadingComments={['/* hoge\\nfuga */']} es>
            hoge
          </identifier>
        </program>
      )
    `))

    // eval jsx and check rendered code equals to original code.
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code).code}`))
    // should replace line feed by os.EOL
    assert(renderedCode === format('/* hoge\nfuga */\nhoge\n'))
  })
})
