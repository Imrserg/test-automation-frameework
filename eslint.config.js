const js = require('@eslint/js');
const tseslint = require('@typescript-eslint/eslint-plugin');
const globals = require('globals');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
    {
        ignores: [
            '**/node_modules/**',
            '**/dist/**',
            '**/allure-results/**',
            '**/allure-report/**',
            '**/combined-report/**',
            '**/test-results/**',
            '**/playwright-report/**',
            'packages/debug.*',
        ],
    },
    js.configs.recommended,
    ...tseslint.configs['flat/recommended'],
    // Prettier керує форматуванням — вимикає ESLint-правила, що могли б
    // з ним конфліктувати (indent, quotes, semi тощо). Має йти після
    // recommended-конфігів, щоб перекрити їх, і до кастомних блоків нижче.
    prettierConfig,
    {
        rules: {
            '@typescript-eslint/explicit-function-return-type': 'off',
            'no-console': 'warn',
            // Playwright's fixture API uses `async ({}, use) => {}` for fixtures
            // that don't need any of the built-in options — a legitimate pattern.
            'no-empty-pattern': 'off',
        },
    },
    {
        // SRP guardrail: assertions do not belong inside Page/Screen Objects
        files: ['packages/web-tests/src/pages/**/*.ts', 'packages/mobile-tests/src/screens/**/*.ts'],
        rules: {
            'no-restricted-syntax': [
                'error',
                {
                    selector: "CallExpression[callee.name='expect']",
                    message:
                        'Assertions (expect) are not allowed inside Page/Screen Objects. Move the assertion to the test file (SRP).',
                },
            ],
        },
    },
    {
        // this file itself: plain Node/CommonJS, not part of the TS project
        files: ['eslint.config.js'],
        languageOptions: {
            sourceType: 'commonjs',
            globals: globals.node,
        },
        rules: {
            '@typescript-eslint/no-require-imports': 'off',
        },
    },
];
