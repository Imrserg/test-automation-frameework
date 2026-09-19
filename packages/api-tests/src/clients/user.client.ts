import { APIRequestContext, APIResponse } from '@playwright/test';
import { step } from 'allure-js-commons';
import { BaseApiClient } from './base-api.client';
import { IUserApiClient } from './user-api-client.interface';
import { CreateUserRequest } from './user-api.types';

// SOLID (S): єдина відповідальність — HTTP-виклики до /users.
// Жодної валідації відповіді чи assertions тут — це справа тестів.
export class UserApiClient extends BaseApiClient implements IUserApiClient {
    constructor(request: APIRequestContext) {
        super(request, '/users');
    }

    async createUser(user: CreateUserRequest): Promise<APIResponse> {
        return await step(`Create user "${user.email}" via API`, () => this.post('', user));
    }

    async getUser(token: string): Promise<APIResponse> {
        return await step('Get current user by token', () => this.get('/me', { Authorization: `Bearer ${token}` }));
    }

    async updateUser(token: string, updates: Partial<CreateUserRequest>): Promise<APIResponse> {
        return await step('Update current user', () => this.patch('/me', updates, { Authorization: `Bearer ${token}` }));
    }

    async deleteUser(token: string): Promise<APIResponse> {
        return await step('Delete current user', () => this.delete('/me', { Authorization: `Bearer ${token}` }));
    }
}
