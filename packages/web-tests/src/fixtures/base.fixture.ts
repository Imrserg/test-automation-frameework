import { test as base } from '@playwright/test';
import { parentSuite, subSuite } from 'allure-js-commons';

// DRY: parentSuite/subSuite для Allure-звіту — одне місце замість повторення
// в кожному тесті. { auto: true } запускає фікстуру для будь-якого тесту
// цього пакета, навіть якщо він її не запитує напряму.
export const test = base.extend<{ allureSuiteLabels: void }>({
    allureSuiteLabels: [
        async ({}, use, testInfo) => {
            await parentSuite('Web');
            await subSuite(testInfo.project.name);
            await use();
        },
        { auto: true },
    ],
});

export { expect } from '@playwright/test';
