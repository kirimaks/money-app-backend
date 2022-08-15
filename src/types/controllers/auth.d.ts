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
