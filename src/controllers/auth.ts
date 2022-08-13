import type {FastifyInstance, FastifyReply} from 'fastify';


function logInController(fastify:FastifyInstance, _config:AppConfig): LogInRequestHandler {
    async function login(request:LogInRequest, reply:FastifyReply): Promise<void> {
        const email = request.body.email;
        const password = request.body.password;

        try {
            const sessionInfo = await fastify.models.user.verifyPassword(email, password);

            if (!sessionInfo.anonymous) {
                const sessionData = {
                    user_id: sessionInfo.user_id, 
                    account_id: sessionInfo.account_id
                }
                request.session.set('user', sessionData);

                reply.code(200).send({message: 'Logged in, session saved'});

            } else {
                reply.code(400).send({error: 'Bad email/password'});
            }

        } catch(error) {
            const errorMessage = fastify.models.user.getModelResponseError(error);
            fastify.log.error(`Cannot log user in: ${errorMessage}`);

            reply.code(500).send({error: errorMessage});
        }
    }

    return login;
}

function signUpController(fastify:FastifyInstance, _config:AppConfig): SignUpRequestHandler {
    async function signup(request:SignUpRequest, reply:FastifyReply): Promise<void> {
        try {
            const newDoc:UserDocument = await fastify.models.user.createDocument(request.body);
            const modelResp:ModelCreateDocResponse<UserDocument> = await fastify.models.user.saveDocument(newDoc);

            if (modelResp.success) {
                reply.code(201).send({message: 'User created'});

            } else {
                reply.code(400).send({error: modelResp.errorMessage});
            }
        } catch(error) {
            const errorMessage = fastify.models.user.getModelResponseError(error);
            fastify.log.error(`Sign up error: ${errorMessage}`);
            reply.code(500).send({error: errorMessage});
        }
    }

    return signup;
}

export {logInController, signUpController}
