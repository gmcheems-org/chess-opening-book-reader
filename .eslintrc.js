module.exports = {
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      presets: ['@babel/preset-env'],
    },
  },
  extends: ['eslint:recommended'],
  plugins: ['import'],
  env: {
    'shared-node-browser': true,
  },
  rules: {
    'no-var': 'error',
    'import/no-unresolved': 'error',
    'import/no-commonjs': 'error',
  },
  overrides: [
    {
      files: ['test/**/*.js'],
      env: {
        mocha: true,
      },
    },
  ],
}
