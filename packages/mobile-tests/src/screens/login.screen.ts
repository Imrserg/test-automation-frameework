import type { ChainablePromiseElement } from 'webdriverio';
import { step } from 'allure-js-commons';
import { ILoginable } from '@framework/core';
import { BaseScreen } from './base.screen';
import { platformLocator } from '../locators/platform-locator';
import { LoginLocators } from '../locators/login.locators';

// SOLID (S, L): єдина відповідальність — дії на екрані логіну.
// Реалізує ILoginable — той самий контракт, що й web LoginPage,
// тому взаємозамінний скрізь, де потрібен "логінабельний" екран (LSP).
// Жодних expect()/assertions тут (SRP) — див. ESLint-правило в .eslintrc.json.
class LoginScreen extends BaseScreen implements ILoginable {
    get emailInput(): ChainablePromiseElement {
        return platformLocator(LoginLocators.emailInput);
    }

    get passwordInput(): ChainablePromiseElement {
        return platformLocator(LoginLocators.passwordInput);
    }

    get loginButton(): ChainablePromiseElement {
        return platformLocator(LoginLocators.loginButton);
    }

    async login(email: string, password: string): Promise<void> {
        await step(`Log in as "${email}"`, async () => {
            await this.waitForDisplayed(this.emailInput);
            await this.emailInput.setValue(email);
            await this.passwordInput.setValue(password);
            await this.loginButton.click();
        });
    }
}

export default new LoginScreen();
