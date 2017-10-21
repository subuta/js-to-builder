import prettier from 'prettier'

// https://github.com/prettier/prettier/issues/1867

// format code with 2 tab.
// https://github.com/prettier/prettier#options
const RULE = {
  tabWidth: 2,
  semi: false,
  printWidth: 40,
  singleQuote: true,
  bracketSpacing: true
}

export default (code) => prettier.format(code, RULE)
