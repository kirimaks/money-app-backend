export type User = {
    id: string;
    email: string;
    passwordHash: string;
};

export type JWTSignPayload = {
    sub: {
        id: string;
        email: string;
    }
};
