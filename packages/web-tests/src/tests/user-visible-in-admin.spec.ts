import { suite } from 'allure-js-commons';
import { test, expect } from '../fixtures/auth.fixture';
import { CatalogPage } from '../pages/catalog.page';

test.describe('Add sauce labs product to the basket', () => {
    test.beforeEach(async () => {
        await suite('Cart');
    });

    test('Should add product to cart', async ({ page }) => {
        const catalogPage = new CatalogPage(page);

        await catalogPage.addItemToCart('sauce-labs-backpack');

        await expect(page.getByTestId('remove-sauce-labs-backpack')).toBeVisible();
    });
});
