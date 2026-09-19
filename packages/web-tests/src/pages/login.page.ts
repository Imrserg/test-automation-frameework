import { Page, Locator } from "@playwright/test";
import { step } from "allure-js-commons";
import { ILoginable } from "@framework/core";
import { BasePage } from "./base.page";

// SOLID (S, L): єдина відповідальність — дії на екрані логіну.
// Реалізує спільний контракт ILoginable — взаємозамінний з мобільним
// LoginScreen скрізь, де очікується "щось, що вміє логінити" (LSP).
// Жодних expect() тут — перевірки залишаються в тестах (SRP).
export class LoginPage extends BasePage implements ILoginable {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByTestId("username");
    this.passwordInput = page.getByTestId("password");
    this.loginButton = page.getByTestId('login-button');
  }

  async login(email: string, password: string): Promise<void> {
    await step(`Log in with email "${email}" and password`, async () => {
      await this.emailInput.fill(email);
      await this.passwordInput.fill(password);
      await this.loginButton.click();
      await this.waitForLoad();
    });
  }
}
