interface UserDraft {
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
    password: string;
    account_id: string;
    comment: string;
}

interface UserDocument extends UserDraft {
    user_id: string;
    password: {
        hash: string;
        salt: string;
        expires: number;
    };
}

interface PasswordInfo {
    hash: string;
    salt: string;
    expires: number;
}

type CreateUserProperties = {
    Body: UserDraft;
};
type CreateUserRequest = FastifyRequest<CreateUserProperties>;
type NewUserRequestHandler = (request:CreateUserRequest, reply:FastifyReply) => Promise<HttpError>;

type GetUserProperties = {
    Params: {
        record_id: string;
    },
};
type GetUserRequest = FastifyRequest<GetUserProperties>;
type GetUserRequestHandler = (request:GetUserRequest, reply:FastifyReply) => Promise<HttpError>;

type RemoveUserProperties = {
    Params: {
        record_id: string;
    },
};
type RemoveUserRequest = FastifyRequest<RemoveUserProperties>;
type RemoveUserRequestHandler = (request:RemoveUserRequest, reply:FastifyReply) => Promise<HttpError>;
