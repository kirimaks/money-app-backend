import {getErrorMessage, AuthError} from '../errors/tools';
import {SignUpRequestValidator} from '../validators/auth';

import type {HttpError} from '@fastify/sensible/lib/httpError';
import type {FastifyInstance, FastifyReply} from 'fastify';


function logInController(fastify:FastifyInstance, _config:AppConfig): LogInRequestHandler {
    async function login(request:LogInRequest, reply:FastifyReply): Promise<HttpError> {
        const email = request.body.email;
        const password = request.body.password;

        try {
            const sessionInfo = await fastify.models.user.verifyPassword(email, password);
            const sessionData = {
                user_id: sessionInfo.user_id, 
                account_id: sessionInfo.account_id
            }
            fastify.log.info(`Setting session: ${JSON.stringify(sessionData)}`);

            request.session.set('user', sessionData);

            return reply.code(200).send({message: 'Logged in, session saved'});

        } catch(error) {
            const errorMessage = getErrorMessage(error);
            fastify.log.error(`Cannot log user in: ${errorMessage}`);

            if (error instanceof AuthError) {
                return fastify.httpErrors.unauthorized();
            }

            return fastify.httpErrors.internalServerError(errorMessage);
        }
    }

    return login;
}

function signUpController(fastify:FastifyInstance, _config:AppConfig): SignUpRequestHandler {
    async function signup(request:SignUpRequest, reply:FastifyReply): Promise<HttpError> {
        try {
            const validator = new SignUpRequestValidator(request.body);

            if (await validator.isValid()) {
                const accountDocument = validator.getAccountDocument();
                const account = await fastify.models.account.createDocumentMap(accountDocument);
                const accountId = await account.save();

                const userDocument = validator.getUserDocument(accountId);
                const user = await fastify.models.user.createDocumentMap(userDocument);
                await user.save();

                /* TODO: format output */
                return reply.code(201).send(user.document);
            }

            return fastify.httpErrors.badRequest(validator.errorMessage);

        } catch(error) {
            const errorMessage = getErrorMessage(error);
            fastify.log.error(`Sign up error: ${errorMessage}`);

            return fastify.httpErrors.internalServerError(errorMessage);
        }
    }

    return signup;
}

export {logInController, signUpController}
