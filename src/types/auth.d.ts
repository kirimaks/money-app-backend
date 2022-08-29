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
    user_id: string;    /* Possibly id to exponse */
    user_db_id: string; /* Internal id not for exponse */
}

interface RandomSessionInfo {
    account_id: string;
    user_id: string;
    cookie: string;
}

interface SessionData {
    user_id: string;
    user_db_id: string;
    account_id: string;
}

type LogInProperties = {
    body: {
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

type LogOutRequest = FastifyRequest<{}>;
type LogOutRequestHandler = (request:LogOutRequest, reply:FastifyReply) => Promise<HttpError>;
