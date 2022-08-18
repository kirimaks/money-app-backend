type ProfileProperties = {};
type ProfileRequest = FastifyRequest<ProfileProperties> & {readonly user: UserDocument};
type ProfileRequestHandler = (request:ProfileRequest, reply:FastifyReply) => Promise<HttpError>;
