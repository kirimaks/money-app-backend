type LogInProperties = {
    Body: {
        email: string;
        password: string;
    }
}
type LogInRequest = FastifyRequest<LogInProperties>;
type LogInRequestHandler = (request:LogInRequest, reply:FastifyReply) => Promise<void>;
