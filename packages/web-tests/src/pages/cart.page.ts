import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class CartPage extends BasePage {
    readonly itemCount: Locator;

    constructor(page: Page) {
        super(page);
        this.itemCount = page.getByTestId('cart-item-count');
    }

    async open(): Promise<void> {
        await this.page.goto('/cart');
        await this.waitForLoad();
    }
}
