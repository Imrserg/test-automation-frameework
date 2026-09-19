import type { ChainablePromiseElement } from 'webdriverio';

export interface PlatformLocator {
    android: string;
    ios: string;
}

// DRY: одна функція замість дублювання if(driver.isAndroid)/else
// у кожному геттері кожного Screen Object.
// KISS: проста умова, без зайвої стратегії/фабрики під це.
export function platformLocator(locator: PlatformLocator): ChainablePromiseElement {
    return $(driver.isAndroid ? locator.android : locator.ios);
}
