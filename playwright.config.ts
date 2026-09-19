import { defineConfig } from '@playwright/test';

// Safety net for `npx playwright test` run from the repo root: without a config
// here, Playwright's default recursive scan picks up every package's specs and runs
// them with none of that package's `use` options (baseURL, testIdAttribute, etc.),
// which silently produces wrong results instead of a clear error. Ignoring every
// package forces test runs through `npm run test:web` / `npm run test:api`, which
// set cwd to the package and pick up its own playwright.config.ts correctly.
export default defineConfig({
    testIgnore: '**/packages/**',
});
