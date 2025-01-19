import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  {
    ignores: ['**/bin/*', '**/docs/*', '**/tests/*', 'tsconfig.json'],
  },

  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
]
