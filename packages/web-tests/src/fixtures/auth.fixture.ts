import { test as base } from './base.fixture';
import { env } from '@framework/core';
import { LoginPage } from '../pages/login.page';

// DRY: логін тут — лише передумова для тестів каталогу/кошика тощо,
// не предмет перевірки (для цього є окремий login.spec.ts).
// Override вбудованого `page`, щоб тест одразу отримував авторизовану сесію.
export const test = base.extend({
    page: async ({ page }, use) => {
        await page.goto('/');
        await new LoginPage(page).login(env.webUser.username, env.webUser.password);
        await use(page);
    },
});

export { expect } from '@playwright/test';
