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
    // Node.js modules don't allow directory imports, so need to
    // add '/index.js' at the end of each import
    'import/extensions': ['error', 'ignorePackages'],
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
