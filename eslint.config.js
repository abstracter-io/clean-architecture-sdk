const globals = require('globals');
const eslint = require('@eslint/js');
const nodePlugin = require('eslint-plugin-n');
const pluginImport = require('eslint-plugin-import');
const promisePlugin = require('eslint-plugin-promise');
const stylisticPlugin = require('@stylistic/eslint-plugin');
const typescriptEslint = require('typescript-eslint');

module.exports = [
  { ignores: ['lib', 'ignore'] },

  {
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.es2024,
        ...globals.node,
      },
    },

    plugins: {
      import: pluginImport, // https://github.com/import-js/eslint-plugin-import/
    },

    rules: {
      'import/first': 'error',
      'import/no-named-default': 'error',
    },
  },

  // https://github.com/eslint-community/eslint-plugin-promise
  promisePlugin.configs['flat/recommended'],

  // https://eslint.style/
  stylisticPlugin.configs.customize({
    indent: 2,
    semi: true,
  }),

  ...nodePlugin.configs['flat/mixed-esm-and-cjs'],

  eslint.configs.recommended,

  ...typescriptEslint.config({
    files: ['**/*.ts'],
    extends: [
      ...typescriptEslint.configs.strict,
      ...typescriptEslint.configs.stylistic,
    ],
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', {
        args: 'all',
        argsIgnorePattern: '^_',
        caughtErrors: 'all',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      }],

      '@typescript-eslint/consistent-type-definitions': 'off',
    },
  }),

  // Overrides
  // ---
  {
    files: ['**/**.js'],
    languageOptions: {
      sourceType: 'commonjs',
    },
  },

  {
    files: ['tests/**.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-function': 'off',
    },
  },
];
