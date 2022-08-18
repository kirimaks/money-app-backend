interface SignUpRequestBody {
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
    password: string;
    comment: string;
    account_name: string;
}

interface UserSessionInfo {
    anonymous: boolean;
    account_id: string;
    user_id: string;
}

interface RandomSessionInfo {
    account_id: string;
    user_id: string;
    cookie: string;
}

type LogInProperties = {
    Body: {
        email: string;
        password: string;
    }
}
type LogInRequest = FastifyRequest<LogInProperties>;
type LogInRequestHandler = (request:LogInRequest, reply:FastifyReply) => Promise<HttpError>;

type SignUpProperties = {
    Body: SignUpRequestBody;
}
type SignUpRequest = FastifyRequest<SignUpProperties>;
type SignUpRequestHandler = (request:SignUpRequest, reply:FastifyReply) => Promise<HttpError>;
