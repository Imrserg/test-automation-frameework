import type { ChainablePromiseElement } from 'webdriverio';
import { BaseScreen } from './base.screen';

// Успішний логін без параметрів маршруту (напр. через deep link) веде саме
// сюди (LoginPage.tsx: successfullyLogin -> navigation.navigate(CHECKOUT_ADDRESS)).
class CheckoutAddressScreen extends BaseScreen {
    get container(): ChainablePromiseElement {
        return $('~checkout address screen');
    }
}

export default new CheckoutAddressScreen();
