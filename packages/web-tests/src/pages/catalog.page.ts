import { Page, Locator } from '@playwright/test';
import { step } from 'allure-js-commons';
import { BasePage } from './base.page';
import { HeaderComponent } from '../components/header.component';

// KISS: прості дії, читабельні як user story, без зайвих патернів.
export class CatalogPage extends BasePage {
    readonly header: HeaderComponent; // композиція замість дублювання (DRY)

    constructor(page: Page) {
        super(page);
        this.header = new HeaderComponent(page);
    }

    private addToCartButton(sku: string): Locator {
        return this.page.getByTestId(`add-to-cart-${sku}`);
    }

    async addItemToCart(sku: string): Promise<void> {
        await step(`Add "${sku}" to cart`, async () => {
            await this.addToCartButton(sku).click();
        });
    }
}
