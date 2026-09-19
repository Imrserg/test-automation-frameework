import type {} from '@wdio/types';
import { env } from '@framework/core';

export const config: WebdriverIO.Config = {
    runner: 'local',
    specs: ['./src/tests/**/*.spec.ts'],
    maxInstances: 1,
    specFileRetries: 2,

    capabilities: [
        {
            platformName: 'Android',
            'appium:deviceName': env.mobile.androidDeviceName,
            'appium:avd': env.mobile.androidAvdName,
            'appium:avdLaunchTimeout': 120000,
            'appium:avdReadyTimeout': 120000,
            'appium:app': env.mobile.androidAppPath,
            'appium:automationName': 'UiAutomator2',
        },
    ],

    services: ['appium'],
    framework: 'mocha',
    reporters: ['spec', ['allure', { outputDir: 'allure-results' }]],

    mochaOpts: {
        ui: 'bdd',
        timeout: 60000,
    },
};
