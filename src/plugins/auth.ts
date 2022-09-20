import { validate as validateUUID } from 'uuid';
import fp from 'fastify-plugin';
import { getErrorMessage } from '../errors/tools';

import type { FastifyPluginAsync, FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';


const SESSION_AUTH_EXCLUDE = [
    '/auth/login',
    '/auth/signup'
];

const authPlugin:FastifyPluginAsync<AppConfig> = async (fastify:FastifyInstance, _options:AppConfig) => {

    fastify.decorate('verifyJWTToken', async (_request:FastifyRequest, _reply:FastifyReply) => {
        fastify.log.debug('Calling verifyJWTToken');

        throw Error('JWT auth failed');
    });

    fastify.decorate('verifyUserSession', async (request:FastifyRequest, _reply:FastifyReply) => {
        fastify.log.debug('Calling verifyUserSession');

        if (request.raw && request.raw.url) {
            if (SESSION_AUTH_EXCLUDE.includes(request.raw.url)) {
                return true;
            }
        }

        try {
            const session = request.session.get('user');

            if (session) {
                /* TODO: validate session time */
                if (validateUUID(session.user_id) && validateUUID(session.account_id)) {
                    request.user = {
                        user_id: session.user_id,
                        user_db_id: session.user_db_id,
                        account_id: session.account_id,
                        anonymous: false,
                    }
                    return true;
                }
            }
        } catch(error) {
            const errorMessage = getErrorMessage(error);
            fastify.log.error(`Cannot validate session: ${errorMessage}`);
        }

        throw Error('Invalid session');
    });

    fastify.register(require('@fastify/auth')).after(() => {
        fastify.addHook(
            'preHandler', 
            fastify.auth([fastify.verifyJWTToken, fastify.verifyUserSession])
        );
    });
};

export default fp(authPlugin);
