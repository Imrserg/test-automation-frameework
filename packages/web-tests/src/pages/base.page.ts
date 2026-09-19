import { Page } from '@playwright/test';

// SOLID (O): спільна поведінка для всіх сторінок, відкрита для розширення
// через успадкування — нові сторінки не змінюють цей клас.
export abstract class BasePage {
    constructor(protected readonly page: Page) {}

    async waitForLoad(): Promise<void> {
        await this.page.waitForLoadState('networkidle');
    }
}
