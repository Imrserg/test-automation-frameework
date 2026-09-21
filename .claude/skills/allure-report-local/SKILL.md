---
name: allure-report-local
description: Generate and view a combined Allure report locally — either from a fresh local test run or by downloading allure-results artifacts from a GitHub Actions CI run. Use when the user wants to see test results as a report instead of raw terminal output, or wants CI results without waiting for the GitHub Pages job.
allowed-tools: Bash
---

# Allure Report (Local)

This repo publishes a combined Allure report to GitHub Pages via the `allure-report`
job in `.github/workflows/ci.yml`, but that only runs after all four test jobs finish
and only on `workflow_dispatch`/`pull_request` triggers. This skill covers the two
cases where you want a report *without* waiting for or triggering that job.

## Case A: Report from a run you just did locally

Each package writes raw Allure results to its own `allure-results/` folder
(`packages/api-tests/allure-results`, `packages/web-tests/allure-results`,
`packages/mobile-tests/allure-results`) — these are gitignored, ephemeral per-run
output, not committed artifacts.

```bash
# run whichever suites you care about first, e.g.:
npm run test:api
npm run test:web

# then combine whatever allure-results exist across packages
npm run report:combined
```

This runs `allure generate packages/*/allure-results -o combined-report --clean`
(root `package.json`). Open the result:
```bash
npx allure open combined-report
```
(`allure open` serves it on localhost and opens a browser — required because Allure
reports need a local server, not just opening the HTML file directly.)

If a package's `allure-results/` is empty or missing, that suite just didn't run yet —
`report:combined`'s glob (`packages/*/allure-results`) silently skips it rather than
erroring.

## Case B: Report from a specific CI run, without waiting for the Pages job

Requires `gh` CLI authenticated (`gh auth status` to check; `gh auth login` if not —
this is interactive and can't be done non-interactively, tell the user to run it
themselves if it's not already authenticated).

```bash
# find the run you want
gh run list --workflow=ci.yml --limit=10

# download all allure-results-* artifacts from that run into a scratch dir
gh run download <RUN_ID> --pattern "allure-results-*" --dir /tmp/allure-ci-<RUN_ID>
```

Artifact names match the upload steps in `ci.yml`: `allure-results-api`,
`allure-results-web`, `allure-results-android`, `allure-results-ios` — not all four
necessarily exist for a given run (depends on which `suite` input was chosen, or which
jobs were skipped).

Reassemble into the per-package layout `report:combined` expects, then generate:
```bash
mkdir -p packages/api-tests/allure-results packages/web-tests/allure-results packages/mobile-tests/allure-results
cp -r /tmp/allure-ci-<RUN_ID>/allure-results-api/. packages/api-tests/allure-results/ 2>/dev/null || true
cp -r /tmp/allure-ci-<RUN_ID>/allure-results-web/. packages/web-tests/allure-results/ 2>/dev/null || true
cp -r /tmp/allure-ci-<RUN_ID>/allure-results-android/. packages/mobile-tests/allure-results/ 2>/dev/null || true
cp -r /tmp/allure-ci-<RUN_ID>/allure-results-ios/. packages/mobile-tests/allure-results/ 2>/dev/null || true

npm run report:combined
npx allure open combined-report
```

This is the exact assembly logic the `allure-report` CI job itself uses (see
`ci.yml`'s "Assemble allure-results per package" step) — mirrored here for local use.

## Cleanup

`combined-report/`, `allure-results/`, and `allure-report/` are all gitignored — safe
to delete freely between runs, no need to ask before removing them:
```bash
rm -rf combined-report packages/*/allure-results
```
