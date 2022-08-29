type ProfileProperties = {};
type ProfileRequest = FastifyRequest<ProfileProperties> & {readonly user: UserDocument};
type ProfileRequestHandler = (request:ProfileRequest, reply:FastifyReply) => Promise<HttpError>;

interface ProfileUpdateFields {
    first_name?: string;
    last_name?: string;
    phone_number?: string;
}

type ProfileUpdateProperties = {
    body: ProfileUpdateFields;
};
type ProfileUpdateRequest = FastifyRequest<ProfileUpdateProperties> & {readonly user: UserDocument};
type ProfileUpdateRequestHandler = (request:ProfileUpdateRequest, reply:FastifyReply) => Promise<HttpError>;
