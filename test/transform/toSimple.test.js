/* global describe, it */

import toBuilder from 'lib/transform'
import format from 'lib/utils/formatter'
import { babelAndEval } from 'test/helper'

const assert = require('assert')

describe('toBuilder', () => {
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
            <Fn id={null}>
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
                <property kind="init" shorthand>
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
                <property kind="init" shorthand>
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
                <property kind="init" computed>
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
          <ifStatement>
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
          <ifStatement>
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

  // it('should convert iife', () => {
  //   const code = `(function() {
  //     debugger
  //     return console.log('hoge')
  //   })()`
  //
  //   assert(toBuilder(code, { simple: true }).code === format(`
  //     const render = () => (
  //       <program>
  //         <expressionStatement>
  //           <callExpression>
  //             <functionExpression id={null}>
  //               <blockStatement>
  //                 <debuggerStatement />
  //
  //                 <returnStatement>
  //                   <callExpression>
  //                     <memberExpression>
  //                       <identifier>console</identifier>
  //                       <identifier>log</identifier>
  //                     </memberExpression>
  //                     <literal>hoge</literal>
  //                   </callExpression>
  //                 </returnStatement>
  //               </blockStatement>
  //             </functionExpression>
  //           </callExpression>
  //         </expressionStatement>
  //       </program>
  //     )
  //   `))
  //
  //   // eval jsx and check rendered code equals to original code.
  //   const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code, { simple: true }).code}`))
  //   assert(renderedCode === format(code))
  // })

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
          <ifStatement>
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

  // it('should convert for in', () => {
  //   const code = `
  //   for (var i in obj) { console.log('hoge'); }
  //   `
  //
  //   assert(toBuilder(code, { simple: true }).code === format(`
  //     const render = () => (
  //       <program>
  //         <forInStatement>
  //           <variableDeclaration kind="var">
  //             <variableDeclarator>
  //               <identifier>i</identifier>
  //             </variableDeclarator>
  //           </variableDeclaration>
  //           <identifier>obj</identifier>
  //           <blockStatement>
  //             <expressionStatement>
  //               <callExpression>
  //                 <memberExpression>
  //                   <identifier>console</identifier>
  //                   <identifier>log</identifier>
  //                 </memberExpression>
  //                 <literal>hoge</literal>
  //               </callExpression>
  //             </expressionStatement>
  //           </blockStatement>
  //         </forInStatement>
  //       </program>
  //     )
  //   `))
  //
  //   // eval jsx and check rendered code equals to original code.
  //   const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code, { simple: true }).code}`))
  //   assert(renderedCode === format(code))
  // })
  //
  // it('should convert for of', () => {
  //   const code = `
  //     for (let i of arr) { console.log(i); }
  //   `
  //
  //   assert(toBuilder(code, { simple: true }).code === format(`
  //     const render = () => (
  //       <program>
  //         <forOfStatement>
  //           <variableDeclaration kind="let">
  //             <variableDeclarator>
  //               <identifier>i</identifier>
  //             </variableDeclarator>
  //           </variableDeclaration>
  //           <identifier>arr</identifier>
  //           <blockStatement>
  //             <expressionStatement>
  //               <callExpression>
  //                 <memberExpression>
  //                   <identifier>console</identifier>
  //                   <identifier>log</identifier>
  //                 </memberExpression>
  //                 <identifier>i</identifier>
  //               </callExpression>
  //             </expressionStatement>
  //           </blockStatement>
  //         </forOfStatement>
  //       </program>
  //     )
  //   `))
  //
  //   // eval jsx and check rendered code equals to original code.
  //   const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code, { simple: true }).code}`))
  //   assert(renderedCode === format(code))
  // })

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
    const renderedCode = format(babelAndEval(`/** @jsx h */\n${toBuilder(code, { simple: true }).code}`))
    assert(renderedCode === format(code))
  })
})
