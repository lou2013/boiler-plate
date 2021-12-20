module.exports = {
  parser: '@typescript-eslint/parser',
  // endOfLine:"auto",
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier'
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js','docker-data','test'],
  rules: {
    "no-console":2,
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 1,
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 1,
    'no-cond-assign':["error", "always"],
    'no-invalid-regexp':1,
    'no-irregular-whitespace':2,
    'lines-around-comment':2,
    'lines-between-class-members': ["error", "always"],
    'eqeqeq': ["error", "always"],
    'prettier/prettier': [
      'error',
      {
        'endOfLine': 'auto',
      }
    ]
  },
};
