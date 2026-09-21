import { suite } from 'allure-js-commons';
import { HttpStatus } from '@framework/core';
import { test, expect } from '../fixtures/api.fixture';
import { CreateUserRequestBuilder } from '../data/create-user.builder';
import { CreateUserResponseSchema, UserProfileSchema } from '../clients/user-api.types';

test.describe('User API tests', () => {
    test.beforeEach(async () => {
        await suite('User API tests');
    });

    test('Should create a user', async ({ userClient }) => {
        const user = new CreateUserRequestBuilder().build();

        const response = await userClient.createUser(user);
        const body = CreateUserResponseSchema.parse(await response.json());

        expect(response.status(), 'Expected status code 201').toBe(HttpStatus.CREATED);
        expect(body.user.email).toBe(user.email);
        expect(body.token).toBeTruthy();
    });

    test('Should GET the current user by token', async ({ userClient }) => {
        const user = new CreateUserRequestBuilder().build();
        const created = await userClient.createUser(user);
        const { token } = CreateUserResponseSchema.parse(await created.json());

        const response = await userClient.getUser(token);
        const body = UserProfileSchema.parse(await response.json());

        expect(response.status(), 'Expected status code 200').toBe(HttpStatus.OK);
        expect(body.email).toBe(user.email);
    });

    test('Should update the current user by token', async ({ userClient }) => {
        const user = new CreateUserRequestBuilder().build();
        const created = await userClient.createUser(user);
        const { token } = CreateUserResponseSchema.parse(await created.json());

        const updatedEmail = `updated_${Date.now()}@test.com`;
        const response = await userClient.updateUser(token, { firstName: 'Updated', email: updatedEmail });
        const body = UserProfileSchema.parse(await response.json());

        expect(response.status(), 'Expected status code 200').toBe(HttpStatus.OK);
        expect(body.firstName).toBe('Updated');
        expect(body.email).toBe(updatedEmail);
    });

    test('Should DELETE the current user by token', async ({ userClient }) => {
        const user = new CreateUserRequestBuilder().build();
        const created = await userClient.createUser(user);
        const { token } = CreateUserResponseSchema.parse(await created.json());

        const response = await userClient.deleteUser(token);

        expect(response.status(), 'Expected status code 200').toBe(HttpStatus.OK);

        const afterDelete = await userClient.getUser(token);
        expect(afterDelete.status(), 'Expected status code 401').toBe(HttpStatus.UNAUTHORIZED);
    });
});
