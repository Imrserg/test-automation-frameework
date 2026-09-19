import { suite } from "allure-js-commons";
import { test, expect } from "../fixtures/base.fixture";
import { env } from "@framework/core";
import { LoginPage } from "../pages/login.page";

test.describe("Login (Web)", () => {
  test.beforeEach(async () => {
    await suite("Login");
  });

  test("should login successfully with valid credentials", async ({ page }) => {
    await page.goto("/");
    const loginPage = new LoginPage(page);

    await loginPage.login(env.webUser.username, env.webUser.password);

    await expect(page.getByText("Swag Labs")).toBeVisible();
  });
});
