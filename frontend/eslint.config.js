import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
    {
        ignores: ['dist/**']
    },
    js.configs.recommended,
    {
        files: ['**/*.{js,jsx}'],
        settings: {
            react: {
                version: 'detect'
            }
        },
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                }
            },
            globals: {
                window: 'readonly',
                document: 'readonly',
                console: 'readonly',
                alert: 'readonly',
                Image: 'readonly',
                FormData: 'readonly'
            }
        },
        plugins: {
            react,
            'react-hooks': reactHooks
        },
        rules: {
            ...react.configs.recommended.rules,
            ...reactHooks.configs.recommended.rules,
            'react/react-in-jsx-scope': 'off',
            'no-unused-vars': ['error', { varsIgnorePattern: '^React$' }]
        }
    }
];
