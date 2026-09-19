import { randomUUID } from 'node:crypto';
import { CreateUserRequest } from '../clients/user-api.types';

// DRY: єдине місце генерації тіла запиту на реєстрацію користувача
// для thinking-tester-contact-list API.
export class CreateUserRequestBuilder {
    private request: Partial<CreateUserRequest> = {};

    withFirstName(firstName: string): this {
        this.request.firstName = firstName;
        return this;
    }

    withLastName(lastName: string): this {
        this.request.lastName = lastName;
        return this;
    }

    withEmail(email: string): this {
        this.request.email = email;
        return this;
    }

    withPassword(password: string): this {
        this.request.password = password;
        return this;
    }

    build(): CreateUserRequest {
        // crypto.randomUUID() замість Date.now(): дві збірки в одному воркері
        // паралельного прогону можуть трапитись в ту саму мілісекунду й дати
        // однаковий email → 400 "already in use" на реальному API.
        const uniqueId = randomUUID();
        return {
            firstName: this.request.firstName ?? 'Test',
            lastName: this.request.lastName ?? 'User',
            email: this.request.email ?? `user_${uniqueId}@test.com`,
            password: this.request.password ?? 'Pass123!',
        };
    }
}
