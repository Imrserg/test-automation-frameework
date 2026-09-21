import { defineConfig, devices } from '@playwright/test';
import { env } from '@framework/core';

export default defineConfig({
    testDir: './src/tests',
    fullyParallel: true,
    retries: 2,
    reporter: [['list'], ['html', { open: 'never' }], ['allure-playwright']],
    use: {
        baseURL: env.webBaseUrl,
        trace: 'on',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        testIdAttribute: 'data-test',
    },
    projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
        { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
        { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    ],
});
