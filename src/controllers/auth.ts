import {UserModel} from '../models/user/user';

import type {FastifyInstance, FastifyReply} from 'fastify';


function logInController(fastify:FastifyInstance, config:AppConfig): LogInRequestHandler {
    async function login(request:LogInRequest, reply:FastifyReply): Promise<void> {
        const user = new UserModel(fastify, config);
        const email = request.body.email;
        const password = request.body.password;

        try {
            const sessionInfo = await user.verifyPassword(email, password);

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
            const errorMessage = user.getModelResponseError(error);
            fastify.log.error(`Cannot log user in: ${errorMessage}`);

            reply.code(500).send({error: errorMessage});
        }
    }

    return login;
}

export {logInController}
