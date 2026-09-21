---
name: mobile-env-doctor
description: Diagnose and fix local iOS Simulator / Android Emulator + Appium setup problems for packages/mobile-tests (device not found, version mismatch, driver missing, emulator crashes/GPU errors, connection timeouts). Use when a mobile test fails to even start, or the emulator/simulator is unstable, before touching test code.
allowed-tools: Bash, Read, Edit
---

# Mobile Env Doctor

Diagnostic checklist for `packages/mobile-tests`, built from real failures hit in this
repo: device/version mismatches, missing Appium drivers, Android GPU/snapshot
corruption, and CI-only WDA connection timeouts. **Run diagnosis before editing any
test or screen code** — nearly every "mobile test failure" in this project's history so
far turned out to be environment, not test logic.

## 1. Confirm what config the tests will actually use

Env values come from `packages/core/src/config/env.ts` (defaults baked in), overridden
by `packages/mobile-tests/.env` (gitignored, per-developer machine).

```bash
cat /Users/serhii_maksymchuk/Downloads/test-automation-framework/packages/mobile-tests/.env 2>/dev/null || echo "no local .env — using env.ts defaults"
```

Defaults if no `.env`: Android device/AVD `Pixel_6_API_33`, iOS device `iPhone 14` /
platform `17.0`. If your actual simulator/emulator doesn't match these, tests will fail
at session start with a device-not-found error — this is the #1 recurring failure.

## 2. iOS — verify the simulator exists

```bash
xcrun simctl list devices available
```

Find an `iPhone <N>` line under a runtime header like `-- iOS 17.0 --`. The
`IOS_DEVICE_NAME` and `IOS_PLATFORM_VERSION` in `.env` must **exactly** match a real
device name and runtime version from this output — not what you assume is installed.
If nothing matches:

```bash
# list installed runtimes; install more via Xcode > Settings > Platforms if needed
xcrun simctl list runtimes
```

Then write/update `packages/mobile-tests/.env`:
```
IOS_DEVICE_NAME=<exact name from simctl output>
IOS_PLATFORM_VERSION=<exact version from simctl output>
```

## 3. Android — verify the AVD exists and boots cleanly

```bash
emulator -list-avds
```

`ANDROID_AVD_NAME` in `.env` must match one of these exactly. If none exist, list is
empty, or the AVD is known-corrupted (see step 4), create one via Android Studio's
Device Manager or `avdmanager`.

Quick boot sanity check (kills after confirming it comes up):
```bash
emulator -avd <avd-name> -no-window &
sleep 30
adb devices   # should show "emulator-XXXX  device", not "offline" or empty
adb -s emulator-XXXX emu kill
```

## 4. Android instability symptoms → fixes

| Symptom | Root cause (confirmed in this repo) | Fix |
|---|---|---|
| `Failed to find ColorBuffer`, `Broken pipe` in emulator log | `hw.gpu.mode=auto` instability, or snapshot corruption from repeated force-kills | Set `hw.gpu.mode=swiftshader` in the AVD's `config.ini` (**not** `swiftshader_indirect` — that value is silently ignored) |
| Emulator boots into a broken/frozen state repeatedly | Corrupted userdata snapshot from unclean shutdowns | `emulator -avd <avd-name> -wipe-data` |
| `Could not find a connected Android device` from Appium | Appium capability only had `appium:deviceName` (cosmetic) with no `appium:avd` | Already fixed in `wdio.android.conf.ts` — confirm `appium:avd` + `avdLaunchTimeout`/`avdReadyTimeout` are still present, didn't get reverted |

AVD config file to inspect/edit directly if needed:
```bash
cat ~/.android/avd/<avd-name>.avd/config.ini | grep -E "hw.gpu"
```

## 5. Appium drivers installed and version-compatible

This repo pins driver majors compatible with `appium@^2.11.0` (newer driver majors
require Appium 3 — a real incompatibility hit in this project):

```bash
npx appium driver list --installed
```

Expect `xcuitest@9.x` and `uiautomator2@4.x`. If missing or on a newer major:
```bash
cd packages/mobile-tests
npx appium driver install xcuitest@9.0.0
npx appium driver install uiautomator2@4.0.0
```

## 6. `write EPIPE` / `ECONNREFUSED` (mostly seen in CI, but possible locally too)

Root cause: WebDriverAgent's `xcodebuild` build/launch can exceed WDIO's default
2-minute client timeout, especially on a first build or a slow machine — WDIO closes
the socket, Appium then crashes writing to it
(appium/appium#20601). Already mitigated in `wdio.ios.conf.ts` via
`connectionRetryTimeout: 300000`, `connectionRetryCount: 2`,
`appium:wdaLaunchTimeout: 300000`. If you see this error despite those settings being
present, the actual WDA build is taking longer than 5 minutes — check Xcode/simulator
health directly rather than raising the timeout further.

## 7. Confirm the app under test is reachable

Both app paths default to direct GitHub release URLs (Appium downloads + caches them
automatically) — no local build required:
```bash
grep -A2 "androidAppPath\|iosAppPath" /Users/serhii_maksymchuk/Downloads/test-automation-framework/packages/core/src/config/env.ts
```
If a corporate network/proxy blocks GitHub release downloads, override
`ANDROID_APP_PATH`/`IOS_APP_PATH` in `.env` with a local `.apk`/`.zip` path instead.

## 8. Run one test in isolation before trusting the full suite

```bash
cd packages/mobile-tests
npm run test:ios      # or test:android
```

`specFileRetries: 2` is already set — a real environment problem will still fail after
retries; a real flake usually passes on retry 1 or 2. If it fails all 3 attempts
identically, it's environment or test logic, not flakiness — go back to steps 1-7
rather than re-running.
