type LogInProperties = {
    Body: {
        email: string;
        password: string;
    }
}
type LogInRequest = FastifyRequest<LogInProperties>;
type LogInRequestHandler = (request:LogInRequest, reply:FastifyReply) => Promise<void>;

type SignUpProperties = {
    Body: UserDraft;
}
type SignUpRequest = FastifyRequest<SignUpProperties>;
type SignUpRequestHandler = (request:SignUpRequest, reply:FastifyReply) => Promise<void>;
