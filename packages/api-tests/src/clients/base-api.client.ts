import { APIRequestContext, APIResponse } from '@playwright/test';

// SOLID (O): базовий клас закритий для модифікації — усі нові ендпоінти
// додаються через успадкування (UserApiClient, OrderApiClient), а не
// правками цього файлу.
// DRY: спільна логіка побудови шляху й HTTP-методів в одному місці.
export abstract class BaseApiClient {
    constructor(
        protected readonly request: APIRequestContext,
        protected readonly basePath: string,
    ) {}

    protected get(path: string, headers?: Record<string, string>): Promise<APIResponse> {
        return this.request.get(`${this.basePath}${path}`, { headers });
    }

    protected post(path: string, data: unknown): Promise<APIResponse> {
        return this.request.post(`${this.basePath}${path}`, { data });
    }

    protected patch(path: string, data: unknown, headers?: Record<string, string>): Promise<APIResponse> {
        return this.request.patch(`${this.basePath}${path}`, { data, headers });
    }

    protected delete(path: string, headers?: Record<string, string>): Promise<APIResponse> {
        return this.request.delete(`${this.basePath}${path}`, { headers });
    }
}
