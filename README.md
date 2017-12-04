## js-to-builder

SEE https://subuta.github.io/js-to-builder/ and try js-to-builder feature

Will generate [ast-types](https://github.com/benjamn/ast-types) builder JSX from your JavaScript code.

### Feature

- `toBuilder` feature to parse JavaScript code and generate equivalent `builder-jsx`.
- Built-in `builder-jsx` shorthand that may use for your own JavaScript code generator. (or write your own code block) 

### Why?

`builder-jsx` let you easily compose/reuse your code block compared to original AST compatible builder api.

### Getting Started
#### Installation

```bash
npm i js-to-builder --save
```

### Example
#### 1. To generate builder-jsx code from your code(JavaScript).
You may use [Online editor](https://subuta.github.io/js-to-builder/)

```jsx harmony
// 1. import toBuilder from `js-to-builder`
import { toBuilder } from 'js-to-builder'

// 2. parse code(string) and generate ast-types builder jsx
const variableDeclaration = toBuilder(`const hoge = 'fuga'`)

// 3. print builder-jsx code and copy it(to clipboard) for next step.
console.log(variableDeclaration.code)

// ->
// const render = () => (
//   <program>
//     <variableDeclaration kind="const">
//       <variableDeclarator>
//         <identifier name="hoge" />
//         <literal value="fuga" />
//       </variableDeclarator>
//     </variableDeclaration>
//   </program>
// )
```

#### 2. To generate code from builder-jsx
Copy and paste printed `builder-jsx` and use `js-to-builder` for construct your own JavaScript code generator.

```jsx harmony
// 1. specify jsx pragma as h (the one imported from `js-to-builder`)
/** @jsx h */
import { h, components, format } from 'js-to-builder'
import { print } from 'recast'

// 2. paste(or write your own) builder-jsx code
const render = () => (
  <program>
    <variableDeclaration kind="const">
      <variableDeclarator>
        <identifier name="hoge" />
        <literal value="fuga" />
      </variableDeclarator>
    </variableDeclaration>
  </program>
)

// 3. use react's `print` to convert builder code to JavaScript code.
const code = format(print(render()))

// will print JavaScript Code
console.log(code)

// ->
// const hoge = 'fuga'

// You can save generated JavaScript Code as a file using `fs.writeFile` of-course :)
```

### Development

```bash
# clone this repository and then ...
npm i

# will run docs (Github pages)
npm run watch
open http://localhost:4000
```

#### To run tests locally

- Setup [Wallaby.js](https://wallabyjs.com/) for your IDE.
- and call wallaby using `wallaby.js` config.
- `Will add another test runner(AVA or Karma?) later!`

#### References

- Use [AST Explorer](https://astexplorer.net/) to see how AST Tree created from your code(set parser to [recast](https://github.com/benjamn/recast) of-course).
- [MDN Parser API](https://developer.mozilla.org/en-US/docs/Mozilla/Projects/SpiderMonkey/Parser_API) and [ESTree Spec](https://github.com/estree/estree) describes about definition of JavaScript AST.

#### License

MIT
