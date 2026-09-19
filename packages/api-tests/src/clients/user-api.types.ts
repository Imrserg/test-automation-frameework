export interface CreateUserRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

// Форма, спільна для user-об'єкта в POST /users, і для відповіді GET /users/me.
export interface UserProfile {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    __v: number;
}

export interface CreateUserResponse {
    user: UserProfile;
    token: string;
}
