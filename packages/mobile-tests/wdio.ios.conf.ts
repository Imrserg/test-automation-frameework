import type {} from '@wdio/types';
import { env } from '@framework/core';

export const config: WebdriverIO.Config = {
    runner: 'local',
    specs: ['./src/tests/**/*.spec.ts'],
    maxInstances: 1,
    specFileRetries: 2,

    capabilities: [
        {
            platformName: 'iOS',
            'appium:deviceName': env.mobile.iosDeviceName,
            'appium:platformVersion': env.mobile.iosPlatformVersion,
            'appium:app': env.mobile.iosAppPath,
            'appium:automationName': 'XCUITest',
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
