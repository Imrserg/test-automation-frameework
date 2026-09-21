---
name: new-test
description: Create a new API, Web UI, or Mobile test in this monorepo following its existing SOLID/Page-Object/Screen-Object/Builder conventions. Use when the user asks to add a test, add an endpoint, add a page/screen, or extend test coverage in packages/api-tests, packages/web-tests, or packages/mobile-tests.
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# New Test (API / Web / Mobile)

Adds a new test to this repo while matching the conventions already established in
`packages/api-tests`, `packages/web-tests`, `packages/mobile-tests`, `packages/core`.
**Always read at least one existing sibling file of each type you're about to create
before writing the new one** — conventions here are enforced by example, not by a
generator, and small repos drift if you don't match neighbors exactly.

## Decide the suite first

| User asks about... | Package | Layer name |
|---|---|---|
| HTTP endpoint / backend response | `packages/api-tests` | API Client |
| Browser flow / page | `packages/web-tests` | Page Object |
| Native app screen (iOS/Android) | `packages/mobile-tests` | Screen Object |

If the same user-facing action exists in more than one suite (e.g. "login"), implement
the interface from `packages/core/src/interfaces/` (see `ILoginable`) so the new
Page/Screen Object stays swappable with its sibling (LSP) — check
`packages/core/src/interfaces/loginable.ts` for the pattern before inventing a new one.

## Hard rules (all suites)

1. **No `expect()` / assertions inside Page Objects, Screen Objects, or API Clients.**
   Assertions belong only in `*.spec.ts` test files (SRP). This is enforced by an
   ESLint rule (`no-restricted-syntax` in `eslint.config.js`) for
   `packages/web-tests/src/pages/**` and `packages/mobile-tests/src/screens/**` —
   `npm run lint` will fail if you violate it. The same rule applies by convention
   (not yet lint-enforced) to `packages/api-tests/src/clients/**`.
2. **Wrap every user-facing action in an Allure `step()`** with a human-readable,
   dynamic message (includes the actual value being acted on, e.g. the email or SKU).
   - Playwright packages (`api-tests`, `web-tests`): `import { step } from 'allure-js-commons';`
   - Mobile (`mobile-tests`, WDIO): `import { addParentSuite, addSuite, addSubSuite } from '@wdio/allure-reporter';`
     for suite labels in the test file, but individual actions inside Screen Objects
     still use `step()` from `allure-js-commons` (see `login.screen.ts`) — WDIO and
     Playwright share the same `allure-js-commons` step API even though suite labels
     use different reporter packages.
3. **Never generate test data by hand in a test.** Use or extend a Builder
   (`packages/core/src/data/user.builder.ts`, `packages/api-tests/src/data/create-user.builder.ts`)
   with a fluent `withX()` API and a `.build()` that fills sane defaults using
   `randomUUID()` (not `Date.now()` — collides under parallel workers, see the comment
   in `create-user.builder.ts`).
4. **Depend on interfaces, not concrete classes, in fixtures** (DIP) — see
   `IUserApiClient` + `ApiFixtures` in `packages/api-tests/src/fixtures/api.fixture.ts`.
5. Every new file gets the same one-or-two-line `//` comment style already used
   throughout: state *which* principle it demonstrates and *why*, not what the code
   obviously does. Don't over-comment simple methods.
6. Run `npm run lint` and `npx tsc --noEmit` (from the relevant package) after creating
   files — this codebase has a strict TS config and a custom ESLint rule; don't declare
   done without both passing.

---

## API test (`packages/api-tests`)

Files to touch, in order:

1. **`src/clients/<resource>-api.types.ts`** — Zod schemas, not raw TS interfaces.
   ```ts
   import { z } from 'zod';

   export const CreateOrderRequestSchema = z.object({
       productId: z.string(),
       quantity: z.number().int().positive(),
   });
   export type CreateOrderRequest = z.infer<typeof CreateOrderRequestSchema>;

   export const OrderSchema = z.object({
       _id: z.string(),
       productId: z.string(),
       quantity: z.number(),
   });
   export type Order = z.infer<typeof OrderSchema>;
   ```
   Response bodies get parsed with `Schema.parse(await response.json())` in the
   *test*, not the client — see `user.spec.ts`.

2. **`src/clients/<resource>-api-client.interface.ts`** — narrow interface, one method
   per endpoint the tests actually need (ISP) — model on `IUserApiClient`.

3. **`src/clients/<resource>.client.ts`** — extends `BaseApiClient`, implements the
   interface, every method wrapped in `step(...)`, returns the raw `APIResponse`
   (no parsing/assertions here):
   ```ts
   export class OrderApiClient extends BaseApiClient implements IOrderApiClient {
       constructor(request: APIRequestContext) {
           super(request, '/orders');
       }

       async createOrder(order: CreateOrderRequest): Promise<APIResponse> {
           return await step(`Create order for product "${order.productId}"`, () => this.post('', order));
       }
   }
   ```

4. **`src/data/create-<resource>.builder.ts`** (only if the resource needs varied test
   data) — fluent builder per `create-user.builder.ts`.

5. **Register the client in `src/fixtures/api.fixture.ts`** — add to `ApiFixtures` type
   and the `test.extend({...})` block, same shape as `userClient`.

6. **`src/tests/<resource>.spec.ts`**:
   ```ts
   import { suite } from 'allure-js-commons';
   import { test, expect } from '../fixtures/api.fixture';
   import { CreateOrderRequestBuilder } from '../data/create-order.builder';
   import { OrderSchema } from '../clients/order-api.types';

   test.describe('Orders API', () => {
       test.beforeEach(async () => {
           await suite('Orders');
       });

       test('Should create an order', async ({ orderClient }) => {
           const order = new CreateOrderRequestBuilder().build();
           const response = await orderClient.createOrder(order);
           const body = OrderSchema.parse(await response.json());

           expect(response.status()).toBe(201);
           expect(body.productId).toBe(order.productId);
       });
   });
   ```

7. **Cleanup**: if the test creates a resource on the real external API, delete it in
   the same test (or `test.afterEach`) unless the test's whole point is deletion.
   `user.spec.ts` currently only cleans up in its own "delete" test — treat that as a
   known gap, not a pattern to copy, for any *new* resource you add.

---

## Web UI test (`packages/web-tests`)

1. **`src/pages/<name>.page.ts`** — extends `BasePage`, locators built with
   `page.getByTestId(...)` (matches this app's actual test attributes — check the
   running app / an existing page for the real `data-testid` before inventing one),
   actions wrapped in `step()`, no `expect()`:
   ```ts
   export class CheckoutPage extends BasePage {
       readonly submitButton: Locator;

       constructor(page: Page) {
           super(page);
           this.submitButton = page.getByTestId('checkout-submit');
       }

       async submitOrder(): Promise<void> {
           await step('Submit order', async () => {
               await this.submitButton.click();
               await this.waitForLoad();
           });
       }
   }
   ```
   If the page shares a recurring block (header, nav) with another page, extract a
   Component Object into `src/components/` and compose it (see `HeaderComponent` used
   by `CatalogPage`) instead of duplicating locators.

2. **`src/tests/<name>.spec.ts`** — import `test`/`expect` from
   `../fixtures/auth.fixture` if the flow needs a logged-in session (most flows do —
   see `catalog.spec.ts`), or from `../fixtures/base.fixture` only for flows that must
   start unauthenticated (e.g. `login.spec.ts` itself). Add a `suite(...)` label in
   `beforeEach`:
   ```ts
   import { suite } from 'allure-js-commons';
   import { test, expect } from '../fixtures/auth.fixture';
   import { CheckoutPage } from '../pages/checkout.page';

   test.describe('Checkout', () => {
       test.beforeEach(async () => {
           await suite('Checkout');
       });

       test('should submit an order', async ({ page }) => {
           const checkout = new CheckoutPage(page);
           await checkout.submitOrder();
           await expect(page.getByTestId('order-confirmation')).toBeVisible();
       });
   });
   ```
   `parentSuite('Web')` / `subSuite(projectName)` are already set globally by
   `allureSuiteLabels` in `base.fixture.ts` — don't repeat them per test.

3. **Verify real selectors before writing them.** Use the `playwright-cli` skill
   (already installed in this repo) to open the running app and inspect actual
   `data-testid` attributes rather than guessing — guessed selectors are the most
   common cause of new Page Objects failing on first run.

---

## Mobile test (`packages/mobile-tests`)

1. **`src/locators/<name>.locators.ts`** — a `Record<string, PlatformLocator>` with
   both `android`/`ios` values. For this app (My Demo App RN), iOS `testID` and
   Android `accessibilityLabel` are usually identical strings prefixed with `~` (see
   `login.locators.ts`) — check `config/TestProperties.ts` in the app's own source (or
   an existing locator file here) before assuming that pattern holds for a new screen.

2. **`src/screens/<name>.screen.ts`** — extends `BaseScreen`, implements a `core`
   interface if the action exists cross-platform, uses `platformLocator(...)` for every
   getter, wraps actions in `step()`, **exported as a singleton instance**
   (`export default new XScreen();`), not the class — matches `login.screen.ts`:
   ```ts
   class CartScreen extends BaseScreen {
       get checkoutButton(): ChainablePromiseElement {
           return platformLocator(CartLocators.checkoutButton);
       }

       async checkout(): Promise<void> {
           await step('Proceed to checkout', async () => {
               await this.waitForDisplayed(this.checkoutButton);
               await this.checkoutButton.click();
           });
       }
   }

   export default new CartScreen();
   ```

3. **`src/tests/<name>.spec.ts`** — WDIO's own `describe`/`it` (not Playwright's
   `test`), Allure suite labels via `@wdio/allure-reporter` in `beforeEach`, platform
   branching only for the `subSuite` label (`driver.isAndroid ? 'Android' : 'iOS'`) —
   the test body itself should read identically for both platforms, exactly like
   `login.spec.ts`:
   ```ts
   import { addParentSuite, addSuite, addSubSuite } from '@wdio/allure-reporter';
   import CartScreen from '../screens/cart.screen';

   describe('Cart (Mobile)', () => {
       beforeEach(() => {
           addParentSuite('Mobile');
           addSuite('Cart');
           addSubSuite(driver.isAndroid ? 'Android' : 'iOS');
       });

       it('should proceed to checkout', async () => {
           await CartScreen.checkout();
           await expect(CheckoutAddressScreen.container).toBeDisplayed();
       });
   });
   ```

4. Deep links / navigation helpers live in `src/navigation/` (see `deep-link.ts`) — add
   there, not inline in the test, if a new screen needs one.

---

## After creating files

```bash
# from the relevant package directory
npx tsc --noEmit
npm run lint          # from repo root — covers the SRP no-expect rule
npm run test:api      # or test:web / test:android / test:ios
```

Don't report the task done without at least a successful compile + lint; running the
actual suite requires a live API/browser/emulator and should be attempted when
feasible, but its absence must be stated explicitly rather than assumed passing.
