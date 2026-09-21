import { test as base } from '@playwright/test';
import { parentSuite } from 'allure-js-commons';
import { UserApiClient } from '../clients/user.client';
import { IUserApiClient } from '../clients/user-api-client.interface';

// SOLID (D): тест отримує userClient типу IUserApiClient (абстракція),
// конкретна реалізація підставляється тут — в одному місці.
type ApiFixtures = {
    userClient: IUserApiClient;
    allureSuiteLabels: void;
};

export const test = base.extend<ApiFixtures>({
    userClient: async ({ request }, use) => {
        await use(new UserApiClient(request));
    },
    // DRY: parentSuite для Allure — одне місце замість повторення в кожному тесті.
    allureSuiteLabels: [
        async ({}, use) => {
            await parentSuite('API');
            await use();
        },
        { auto: true },
    ],
});

export { expect } from '@playwright/test';
