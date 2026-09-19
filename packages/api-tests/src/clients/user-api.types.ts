import { z } from 'zod';

export const CreateUserRequestSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    password: z.string(),
});

export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>;

// Форма, спільна для user-об'єкта в POST /users, і для відповіді GET /users/me.
export const UserProfileSchema = z.object({
    _id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    __v: z.number(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

export const CreateUserResponseSchema = z.object({
    user: UserProfileSchema,
    token: z.string(),
});

export type CreateUserResponse = z.infer<typeof CreateUserResponseSchema>;
