import { User } from '../types/domain';

// DRY: єдине місце генерації тестових даних User для API/Web/Mobile тестів,
// замість того щоб кожен тест руками збирав об'єкт користувача.
// SRP: єдина відповідальність — побудова валідного об'єкта User.
export class UserBuilder {
    private user: Partial<User> = { role: 'customer' };

    withEmail(email: string): this {
        this.user.email = email;
        return this;
    }

    withPassword(password: string): this {
        this.user.password = password;
        return this;
    }

    withRole(role: User['role']): this {
        this.user.role = role;
        return this;
    }

    build(): User {
        const uniqueId = Date.now();
        return {
            id: uniqueId,
            email: this.user.email ?? `user_${uniqueId}@test.com`,
            password: this.user.password ?? 'Pass123!',
            role: this.user.role ?? 'customer',
        };
    }
}
