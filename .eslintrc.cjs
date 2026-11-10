module.exports = {
  env: { browser: true, es2021: true },
  extends: ['airbnb', 'airbnb/hooks'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true }
  },
  plugins: ['import'],
  overrides: [
    {
      files: ['src/data/**/*.js'],
      rules: {
        'max-len': 'off',
        'object-curly-newline': 'off'
      }
    }
  ],
  rules: {
    semi: ['error', 'never'],
    'comma-dangle': ['error', 'never'],
    'arrow-body-style': ['error', 'as-needed'],
    'arrow-parens': ['error', 'as-needed'],
    'prefer-arrow-callback': 'error',
    'no-else-return': ['error', { allowElseIf: false }],
    'no-var': 'error',
    'prefer-const': 'error',
    'require-await': 'error',
    'no-async-promise-executor': 'error',
    'import/newline-after-import': ['error', { count: 1 }],
    'react/function-component-definition': ['error', { namedComponents: 'arrow-function' }],
    'max-len': ['error', 120, { ignoreStrings: true, ignoreTemplateLiterals: true, ignoreComments: true, ignoreUrls: true }],
    'react/prop-types': 'off',
    'react/require-default-props': 'off',
    'react/forbid-prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/no-multi-comp': ['error', { ignoreStateless: false }],
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx'] }],
    'react/jsx-props-no-spreading': 'off',
    'import/extensions': 'off',
    'import/no-unresolved': 'off'
  }
}
