import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores([
    'dist',
    // Archived design references, kept for provenance but not maintained.
    // Linting them produced ~960 of the 968 reported problems and buried the
    // 8 real ones in src/.
    'prototype',
    'Live is Health',
    // Agent worktrees are throwaway copies of the whole repo.
    '.claude',
  ]),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    // Build scripts are Node, not browser, and are plain modules rather than
    // components — the react-refresh export rule does not apply.
    files: ['scripts/**/*.mjs', '*.config.js', 'vite.config.js'],
    languageOptions: { globals: globals.node },
    rules: { 'react-refresh/only-export-components': 'off' },
  },
  {
    // The service worker runs in a worker global scope.
    files: ['public/sw.js'],
    languageOptions: { globals: { ...globals.serviceworker, ...globals.browser } },
  },
])
