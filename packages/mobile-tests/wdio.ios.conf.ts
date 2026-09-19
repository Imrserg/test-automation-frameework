import type {} from '@wdio/types';
import { env } from '@framework/core';

export const config: WebdriverIO.Config = {
    runner: 'local',
    specs: ['./src/tests/**/*.spec.ts'],
    maxInstances: 1,
    specFileRetries: 2,
    // На спільних macOS-раннерах (напр. GitHub Actions) перша збірка
    // WebDriverAgent через xcodebuild може тривати довше стандартного
    // connectionRetryTimeout (2 хв) — тоді wdio розриває з'єднання, а
    // Appium падає з "write EPIPE", намагаючись відповісти в закритий
    // сокет (https://github.com/appium/appium/issues/20601).
    connectionRetryTimeout: 300000,
    connectionRetryCount: 2,

    capabilities: [
        {
            platformName: 'iOS',
            'appium:deviceName': env.mobile.iosDeviceName,
            'appium:platformVersion': env.mobile.iosPlatformVersion,
            'appium:app': env.mobile.iosAppPath,
            'appium:automationName': 'XCUITest',
            'appium:wdaLaunchTimeout': 300000,
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
