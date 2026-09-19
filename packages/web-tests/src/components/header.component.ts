import { Page, Locator } from '@playwright/test';

// DRY: шапка сайту повторюється на кількох сторінках — виносимо в
// окремий Component Object і підключаємо композицією замість дублювання
// локаторів/методів у кожному Page Object.
export class HeaderComponent {
    readonly cartIcon: Locator;
    readonly accountMenu: Locator;

    constructor(private readonly page: Page) {
        this.cartIcon = page.getByTestId('cart-icon');
        this.accountMenu = page.getByTestId('account-menu');
    }

    async openCart(): Promise<void> {
        await this.cartIcon.click();
    }
}
