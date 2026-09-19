import * as dotenv from 'dotenv';
dotenv.config();

// KISS: один плаский об'єкт конфігурації, без зайвих абстракцій (фабрик, білдерів).
// Значення за замовчуванням дозволяють запускати проєкт "з коробки" на staging.
export const env = {
    // UserApiClient/CreateUserRequest побудовані під реальну схему цього API.
    // https://github.com/wearetla/thinking-tester-contact-list-app
    apiBaseUrl: process.env.API_BASE_URL ?? 'https://thinking-tester-contact-list.herokuapp.com',
    webBaseUrl: process.env.WEB_BASE_URL ?? 'https://www.saucedemo.com',
    testEnv: process.env.TEST_ENV ?? 'staging',
    webUser: {
        username: process.env.WEB_TEST_USERNAME ?? 'standard_user',
        password: process.env.WEB_TEST_PASSWORD ?? 'secret_sauce',
    },
    mobile: {
        // Appium підтримує appium:app як пряме http(s) посилання (сам завантажує й кешує),
        // тож дефолти вказують на реальний реліз My Demo App RN — працює "з коробки".
        // https://github.com/saucelabs/my-demo-app-rn/releases
        androidAppPath:
            process.env.ANDROID_APP_PATH ??
            'https://github.com/saucelabs/my-demo-app-rn/releases/download/v1.3.0/Android-MyDemoAppRN.1.3.0.build-244.apk',
        iosAppPath:
            process.env.IOS_APP_PATH ??
            'https://github.com/saucelabs/my-demo-app-rn/releases/download/v1.3.0/iOS-Simulator-MyRNDemoApp.1.3.0-162.zip',
        androidDeviceName: process.env.ANDROID_DEVICE_NAME ?? 'Pixel_6_API_33',
        // appium:avd — ім'я реального AVD на машині (emulator -list-avds), за яким
        // UiAutomator2 сам піднімає емулятор, якщо жоден пристрій ще не запущений.
        androidAvdName: process.env.ANDROID_AVD_NAME ?? 'Pixel_6_API_33',
        iosDeviceName: process.env.IOS_DEVICE_NAME ?? 'iPhone 14',
        iosPlatformVersion: process.env.IOS_PLATFORM_VERSION ?? '17.0',
        // com.saucelabs.mydemoapp.rn — реальний applicationId/bundleId
        // https://github.com/saucelabs/my-demo-app-rn (android/app/build.gradle, ios/*.xcodeproj).
        androidAppPackage: process.env.ANDROID_APP_PACKAGE ?? 'com.saucelabs.mydemoapp.rn',
        iosBundleId: process.env.IOS_BUNDLE_ID ?? 'com.saucelabs.mydemoapp.rn',
        deepLinkScheme: process.env.MOBILE_DEEP_LINK_SCHEME ?? 'mydemoapprn',
        user: {
            username: process.env.MOBILE_TEST_USERNAME ?? 'bob@example.com',
            password: process.env.MOBILE_TEST_PASSWORD ?? '10203040',
        },
    },
} as const;
