import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import prettierRecomended from 'eslint-plugin-prettier/recommended'
// const gitignorePath = fileURLToPath(new URL('.gitignore', import.meta.url))

export default defineConfig([
    // includeIgnoreFile(gitignorePath, 'Imported .gitignore patterns'),
    globalIgnores([
        '**/public**',
        '**/build/',
        '**/dist/',
        '**/out/',
        '**/old/',
        '**/original/',
        '**/debug__critical_css__screenshots/',
        '**/node_modules/',
        '**/libs/',
    ]),
    js.configs.recommended,
    tseslint.configs.recommended,
    prettierRecomended,
    {
        files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
        rules: {
            // eslint rules
            'no-console': 'warn',
            'eqeqeq': 'warn',
            'curly': 'warn',
            'no-else-return': 'warn',

            // my additions
            // 'no-unused-vars': 'warn',
            '@typescript-eslint/no-unused-vars': 'warn',
        },
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
    },
])
