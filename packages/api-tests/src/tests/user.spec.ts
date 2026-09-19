import { suite } from 'allure-js-commons';
import { test, expect } from '../fixtures/api.fixture';
import { CreateUserRequestBuilder } from '../data/create-user.builder';
import { CreateUserResponse, UserProfile } from '../clients/user-api.types';

test.describe('Users API', () => {
    test.beforeEach(async () => {
        await suite('Users');
    });

    test('Should create a user', async ({ userClient }) => {
        const user = new CreateUserRequestBuilder().build();

        const response = await userClient.createUser(user);
        const body: CreateUserResponse = await response.json();

        expect(response.status()).toBe(201);
        expect(body.user.email).toBe(user.email);
        expect(body.token).toBeTruthy();
    });

    test('Should get the current user by token', async ({ userClient }) => {
        const user = new CreateUserRequestBuilder().build();
        const created = await userClient.createUser(user);
        const { token } = (await created.json()) as CreateUserResponse;

        const response = await userClient.getUser(token);
        const body: UserProfile = await response.json();

        expect(response.status()).toBe(200);
        expect(body.email).toBe(user.email);
    });

    test('Should update the current user by token', async ({ userClient }) => {
        const user = new CreateUserRequestBuilder().build();
        const created = await userClient.createUser(user);
        const { token } = (await created.json()) as CreateUserResponse;

        const updatedEmail = `updated_${Date.now()}@test.com`;
        const response = await userClient.updateUser(token, { firstName: 'Updated', email: updatedEmail });
        const body: UserProfile = await response.json();

        expect(response.status()).toBe(200);
        expect(body.firstName).toBe('Updated');
        expect(body.email).toBe(updatedEmail);
    });

    test('Should delete the current user by token', async ({ userClient }) => {
        const user = new CreateUserRequestBuilder().build();
        const created = await userClient.createUser(user);
        const { token } = (await created.json()) as CreateUserResponse;

        const response = await userClient.deleteUser(token);

        expect(response.status()).toBe(200);

        const afterDelete = await userClient.getUser(token);
        expect(afterDelete.status()).toBe(401);
    });
});
