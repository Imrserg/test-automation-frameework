---
name: ci-triage
description: Investigate a failed GitHub Actions run for this repo (workflow "Automation test suite" / .github/workflows/ci.yml) using the gh CLI instead of the user manually pasting logs. Use when the user mentions CI failed, a workflow run, a red X on a PR, or asks why a GitHub Actions job broke.
allowed-tools: Bash
---

# CI Triage

Pulls failure info directly from GitHub Actions via `gh`, instead of the user copying
logs by hand. Grounded in the actual jobs in `.github/workflows/ci.yml`
(workflow name: "Automation test suite"): `lint`, `api-tests`, `web-tests`,
`android-tests`, `ios-tests`, `allure-report`.

## 0. Check `gh` is authenticated first

```bash
gh auth status
```

If not authenticated, this is interactive (`gh auth login`) and cannot be done
non-interactively — tell the user to run it themselves and stop here rather than
attempting workarounds.

## 1. Find the run

```bash
gh run list --workflow=ci.yml --limit=10
# or, for a specific PR:
gh pr checks <PR_NUMBER>
```

## 2. Get the failure directly

```bash
gh run view <RUN_ID> --log-failed
```

This prints only the failed steps' logs — usually enough on its own, avoids pulling
the full multi-job log. Use `gh run view <RUN_ID> --log` (full log) only if
`--log-failed` doesn't show the actual error (e.g. the failure is in a setup step
that "succeeded" but left a broken state).

For a job-specific deep dive:
```bash
gh run view <RUN_ID> --job=<JOB_ID>
```

## 3. Pattern-match against known failure modes for this repo

Before treating a failure as novel, check whether it matches something already solved
here — re-diagnosing from scratch wastes time on issues with a known fix.

| Symptom in log | Job | Known cause | Fix already applied |
|---|---|---|---|
| `write EPIPE` / `ECONNREFUSED` | `ios-tests` | WDA `xcodebuild` build exceeds WDIO's default 2-min client timeout on shared macOS runners (appium/appium#20601) | `connectionRetryTimeout`/`wdaLaunchTimeout` raised in `wdio.ios.conf.ts` — if still failing, WDA build is taking >5min, investigate runner load, don't just raise timeout further |
| `FATAL: Not enough space to create userdata partition` | `android-tests` | Default AVD disk size exceeds runner's free space | Disk-space-freeing step + explicit `disk-size: 6000M` already in `ci.yml` — if still failing, another tool is eating runner disk, check `df -h /` output right before the emulator step |
| iOS device/version not found | `ios-tests` | Runner's available simulators change over time (macos-latest image updates) | `ci.yml` has a dynamic-detection step (queries `xcrun simctl list ... available` at runtime) — if this fails, the detection script's `jq`/`python3` logic itself broke, not the device availability |
| Deprecation warning about Node 20 / `actions/*` versions, but the visible `ci.yml` already uses v24/v5+ | `allure-report` (Pages deployment) | GitHub's own hidden "pages build and deployment" system workflow — **not** fixable from this repo's own workflow files | None — this is an intrinsic part of using GitHub Pages at all, don't chase it further |
| `lint` fails on `no-restricted-syntax` for `expect(...)` | `lint` | A Page/Screen Object file has an `expect()` call — violates the SRP ESLint rule scoped to `packages/web-tests/src/pages/**` and `packages/mobile-tests/src/screens/**` | Move the assertion into the corresponding `*.spec.ts` |

## 4. Download artifacts if the log alone isn't enough

Each test job uploads its own Allure results even on failure
(`allure-results-api`/`-web`/`-android`/`-ios`, see `ci.yml`'s `if: always()` upload
steps). For a full visual report instead of raw logs, use the **`allure-report-local`**
skill's "Case B" flow with this run's ID.

## 5. Re-running

```bash
gh run rerun <RUN_ID> --failed   # only the failed jobs
gh run rerun <RUN_ID>            # everything
```

Only rerun after identifying *why* it failed — rerunning a deterministic failure (lint
error, disk space misconfig) just wastes CI minutes. Rerun is appropriate for confirmed
one-off flakiness (e.g. a runner-level transient network blip), not as a first response.
