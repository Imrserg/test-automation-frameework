import { PlatformLocator } from './platform-locator';

// Локатори винесені окремо від Screen Object (SRP) —
// Screen Object відповідає за поведінку, локатори — за структуру екрана.
//
// My Demo App RN (testProperties у config/TestProperties.ts) ставить testID
// на iOS і accessibilityLabel на Android — обидва мапляться в Appium через
// один і той самий селектор accessibility id (~value), тому значення
// однакові для обох платформ. Джерело значень — src/config/translations/en.ts
// + InputField.tsx/Button.tsx (`${label} ${testId}` / `${testId} ${testId}`).
export const LoginLocators: Record<string, PlatformLocator> = {
    emailInput: {
        android: '~Username input field',
        ios: '~Username input field',
    },
    passwordInput: {
        android: '~Password input field',
        ios: '~Password input field',
    },
    loginButton: {
        android: '~Login button',
        ios: '~Login button',
    },
};
