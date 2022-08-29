import {getErrorMessage, AuthError} from '../errors/tools';

import type {HttpError} from '@fastify/sensible/lib/httpError';
import type {FastifyInstance, FastifyReply} from 'fastify';


function getAccountDocument(requestBody:SignUpRequestBody):AccountDraft {
    return {
        account_name: requestBody.account_name
    };
}

function getUserDocument(requestBody:SignUpRequestBody, accountId:string):UserDraft {
    return {
        account_id: accountId,
        first_name: requestBody.first_name,
        last_name: requestBody.last_name,
        phone_number: requestBody.phone_number,
        email: requestBody.email,
        password: requestBody.password,
        comment: requestBody.comment,
    };
}

function logInController(fastify:FastifyInstance, config:AppConfig): LogInRequestHandler {
    async function login(request:LogInRequest, reply:FastifyReply): Promise<HttpError> {
        const email = request.body.email;
        const password = request.body.password;

        try {
            const sessionInfo = await fastify.models.user.verifyPassword(email, password);
            const sessionData:SessionData = {
                user_id: sessionInfo.user_id, 
                account_id: sessionInfo.account_id,
                user_db_id: sessionInfo.user_db_id,
            }
            fastify.log.info(`Setting session: ${JSON.stringify(sessionData)}`);

            request.session.set('user', sessionData);
            request.session.options({maxAge: config.SESSION_MAX_AGE_MINUTES * 60});

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
            const accountDocument = getAccountDocument(request.body);
            const account = await fastify.models.account.createDocumentMap(accountDocument);
            const accountId = await account.save();

            const userDocument = getUserDocument(request.body, accountId);
            const user = await fastify.models.user.createDocumentMap(userDocument);
            await user.save();

            return reply.code(201).send(user.document);

        } catch(error) {
            const errorMessage = getErrorMessage(error);
            fastify.log.error(`Sign up error: ${errorMessage}`);

            return fastify.httpErrors.internalServerError(errorMessage);
        }
    }

    return signup;
}

function logOutController(fastify:FastifyInstance): LogOutRequestHandler {
    async function logout(request:LogOutRequest, reply:FastifyReply): Promise<HttpError> {
        try {
            fastify.log.info(`<<< Session: ${JSON.stringify(request.session)} >>>`);

            await request.session.delete();

            fastify.log.info(`<<< Session: ${JSON.stringify(request.session)} >>>`);

            return reply.code(204).send();

        } catch(error) {
            const errorMessage = getErrorMessage(error);
            fastify.log.error(`Log out error: ${errorMessage}`);

            return fastify.httpErrors.internalServerError();
        }
    }

    return logout;
}

export { logInController, signUpController, logOutController }
