import { env } from '@framework/core';

// My Demo App RN зареєстрував deep-link схему (src/navigation/Linking.ts),
// напр. mydemoapprn://login. Це надійніше й простіше, ніж відкривати drawer-
// меню — на iOS для цього немає кнопки, лише свайп-жест, якого тут можна
// уникнути повністю.
export async function openDeepLink(path: string): Promise<void> {
    const url = `${env.mobile.deepLinkScheme}://${path}`;

    await driver.execute('mobile: deepLink', {
        url,
        ...(driver.isAndroid ? { package: env.mobile.androidAppPackage } : { bundleId: env.mobile.iosBundleId }),
    });
}
