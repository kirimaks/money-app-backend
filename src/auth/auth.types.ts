export type User = {
    id: string;
    email: string;
    passwordHash: string;
};

export type UserRepresentation = Pick<User, "email">;

export type JWTSignPayload = {
    sub: {
        email: string;
    }
};
