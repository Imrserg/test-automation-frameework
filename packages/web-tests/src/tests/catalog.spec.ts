import { suite } from 'allure-js-commons';
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Product catalog', () => {
    test.beforeEach(async () => {
        await suite('Catalog');
    });

    test('should list products after login', async ({ page }) => {
        await expect(page.getByTestId('title')).toBeVisible();
    });
});
