import { addParentSuite, addSuite, addSubSuite } from '@wdio/allure-reporter';
import { env } from '@framework/core';
import { openDeepLink } from '../navigation/deep-link';
import LoginScreen from '../screens/login.screen';
import CheckoutAddressScreen from '../screens/checkout-address.screen';

// KISS: тест виглядає ідентично до web-версії з попереднього пакета —
// різниця схована повністю в шарі Screen Object.
describe('Login (Mobile)', () => {
    beforeEach(() => {
        addParentSuite('Mobile');
        addSuite('Login');
        addSubSuite(driver.isAndroid ? 'Android' : 'iOS');
    });

    it('should login successfully with valid credentials', async () => {
        await openDeepLink('login');
        await LoginScreen.login(env.mobile.user.username, env.mobile.user.password);

        await expect(CheckoutAddressScreen.container).toBeDisplayed();
    });
});
