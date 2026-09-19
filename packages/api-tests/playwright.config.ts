import { defineConfig } from '@playwright/test';
import { env } from '@framework/core';

export default defineConfig({
    testDir: './src/tests',
    fullyParallel: true,
    retries: 2,
    reporter: [['list'], ['html', { open: 'never' }], ['allure-playwright']],
    use: {
        baseURL: env.apiBaseUrl,
        extraHTTPHeaders: {
            'Content-Type': 'application/json',
        },
    },
});
