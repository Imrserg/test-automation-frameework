import { APIResponse } from '@playwright/test';
import { CreateUserRequest } from './user-api.types';

// SOLID (D): тести/fixtures залежать від цієї абстракції, а не від
// конкретного класу UserApiClient — дозволяє підмінити реалізацію
// (наприклад, MockUserApiClient) без зміни тестового коду.
export interface IUserApiClient {
    createUser(user: CreateUserRequest): Promise<APIResponse>;
    getUser(token: string): Promise<APIResponse>;
    updateUser(token: string, updates: Partial<CreateUserRequest>): Promise<APIResponse>;
    deleteUser(token: string): Promise<APIResponse>;
}
