### js-to-builder

Will generate [ast-types](https://github.com/benjamn/ast-types) builder from your javascript code.

### Why?

Because it's harder to write builder-code(AST) manually ;)

### Getting Started
#### Installation

```bash
npm i js-to-builder --save
```

#### Example

```js
import { toBuilder, print } from 'js-to-builder'

const code = `const hoge = 'fuga';`

// will return ast-types builder
const variableDeclaration = toBuilder(code).builder

// will print original code
console.log(print([
  variableDeclaration
]))

// -> `const hoge = "fuga";`

```

### Development

```bash
// clone this repository and then ...
npm i
```

#### To run tests locally

- Setup [Wallaby.js](https://wallabyjs.com/) for your IDE.
- and call wallaby using `wallaby.js` config.
- `Will add another test runner(AVA or Karma?) later!`

#### References

- Use [AST Explorer](https://astexplorer.net/) to see how AST Tree created from your code(set parser to [recast](https://github.com/benjamn/recast) of-course).
- [MDN Parser API](https://developer.mozilla.org/en-US/docs/Mozilla/Projects/SpiderMonkey/Parser_API) and [ESTree Spec](https://github.com/estree/estree) will describes about definition of JavaScript AST.

#### License

MIT
