import type { ChainablePromiseElement } from 'webdriverio';

// SOLID (O): спільна поведінка для всіх екранів, відкрита для розширення
// через успадкування — нові екрани не змінюють цей клас.
export abstract class BaseScreen {
    async waitForDisplayed(element: ChainablePromiseElement): Promise<void> {
        await element.waitForDisplayed({ timeout: 10000 });
    }

    async swipeUp(): Promise<void> {
        const { width, height } = await driver.getWindowRect();
        await driver.touchAction([
            { action: 'press', x: width / 2, y: height * 0.8 },
            { action: 'moveTo', x: width / 2, y: height * 0.2 },
            { action: 'release' },
        ]);
    }
}
