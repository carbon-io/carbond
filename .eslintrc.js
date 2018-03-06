module.exports = {
  parserOptions: {
    ecmaVersion: 9,
    ecmaFeatures: {
      impliedStrict: true,
    },
  },
  env: {
    es6: true,
    node: true,
  },
  extends: 'eslint:recommended',
  rules: {
    /**
     * Relaxing overly strict recommended
     */

    // warn about console statements
    'no-console': 'off',

    // warn about unreachable code
    'no-unreachable': 'warn',


    /**
     * Best Practices
     */

    // disallow unused expressions
    'no-unused-expressions': 'error',

    // disallow redundant return statements
    'no-useless-return': 'error',

    // disallow unmodified conditions of loops
    'no-unmodified-loop-condition': 'warn',

    // disallow unused variables
    'no-unused-vars': ['warn', {args: 'none'}],

    // require the use of === and !==
    //eqeqeq: 'warn',

    // disallow the use of variables before they are defined
    //'no-use-before-define': 'error',

    // require let or const instead of var
    //'no-var': 'error',

    // require constructor names to begin with a capital letter
    //'new-cap': 'warn',

    // require return statements to either always or never specify values
    //'consistent-return': 'warn',

    // disallow this keywords outside of classes or class-like objects
    //'no-invalid-this': 'error',

    // require const declarations for variables that are never reassigned after declared
    //'prefer-const': 'error',


    /**
     * Styling
     */

    // require or disallow semicolons instead of ASI
    semi: ['error', 'never'],

    // enforce consistent indentation
    indent: ['warn', 2, {'SwitchCase': 1, 'FunctionExpression': {parameters: 'off'}}],

    // require or disallow trailing commas
    'comma-dangle': ['error', 'always-multiline'],

    // require or disallow newline at the end of files
    'eol-last': ['error', 'always'],

    // enforce consistent linebreak style
    'linebreak-style': ['error', 'unix'],

    // disallow trailing whitespace at the end of lines
    'no-trailing-spaces': 'error',

    // require parens in arrow function arguments
    'arrow-parens': ['error', 'as-needed', {'requireForBlockBody': true}],

    // enforce consistent spacing before blocks
    'space-before-blocks': ['error', 'always'],

    // enforce consistent spacing before function definition opening parenthesis
    'space-before-function-paren': ['error', 'never'],

    // enforce consistent spacing before and after keywords
    'keyword-spacing': [
      'error',
      {
        before: true, // requires at least one space before keywords
        after: true,  // requires at least one space after keywords
      },
    ],

    // enforce consistent spacing around commas
    'comma-spacing': 'error',
    'comma-style': ['error', 'last'],

    // enforce single quotes everywhere possible
    'quotes': ['warn', 'single', {'avoidEscape': true}],

    // enforce standard key spacing in object literals
    'key-spacing': 'warn',

    // enforce consistent spacing within parentheses
    'space-in-parens': 'error',

    // enforce no spacing in array brackets
    'array-bracket-spacing': 'warn',

    // enforce consistent line breaks within array brackets
    'array-bracket-newline': ['warn', 'consistent'],

    // enforce no spacing in curly brackets
    'object-curly-spacing': 'error',

    // enforce consistent line breaks within function parenthesis
    'function-paren-newline': ['error', 'consistent'],

    // enforce brace style
    'brace-style': ['error', '1tbs', {'allowSingleLine': false}],

    // disallow multiple spaces
    'no-multi-spaces': [
      'warn',
      {
        ignoreEOLComments: true,
        exceptions: {
          VariableDeclarator: true,
          Property: true,
        },
      },
    ],

    // enforce max length
    //'max-len': ['warn', {code: 100}],

    // enforce consistent newlines within objects
    'object-curly-newline': ['error', {
      multiline: true,
      consistent: true,
    }],

    // enforce consistent spacing around infix operators
    'space-infix-ops': 'error',

    // require curly braces for control statements
    'curly': 'error',
  },
}
