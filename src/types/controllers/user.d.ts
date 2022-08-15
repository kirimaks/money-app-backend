type CreateUserProperties = {
    Body: UserDraft;
};
type CreateUserRequest = FastifyRequest<CreateUserProperties>;
type NewUserRequestHandler = (request:CreateUserRequest, reply:FastifyReply) => Promise<HttpError>;

type GetUserProperties = {
    Params: {
        record_id: string;
    },
    Headers: {
        'x-control-header': string;
    }
};
type GetUserRequest = FastifyRequest<GetUserProperties>;
type GetUserRequestHandler = (request:GetUserRequest, reply:FastifyReply) => Promise<HttpError>;

type RemoveUserProperties = {
    Params: {
        record_id: string;
    },
    Headers: {
        'x-control-header': string;
    }
};
type RemoveUserRequest = FastifyRequest<RemoveUserProperties>;
type RemoveUserRequestHandler = (request:RemoveUserRequest, reply:FastifyReply) => Promise<HttpError>;
