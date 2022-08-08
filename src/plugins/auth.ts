import type { 
    FastifyPluginAsync, ContextConfigDefault, FastifyInstance, FastifyReply,
    FastifyRequest, FastifySchema, preHandlerHookHandler 
} from 'fastify';
import type { RouteGenericInterface } from 'fastify/types/route';

import type {FastifyAuthFunction} from '@fastify/auth';

import fp from 'fastify-plugin';


declare module 'fastify' {
    interface FastifyInstance<RawServer, RawRequest, RawReply, Logger, TypeProvider> {
        verifyJWTToken: (request:FastifyRequest, reply:FastifyReply) => void;
        verifyUserAndPassword: (request:FastifyRequest, reply:FastifyReply) => void;
        auth(
            functions: FastifyAuthFunction[],
            options?: {
                relation?: 'and' | 'or',
                run?: 'all'
            }
        ): preHandlerHookHandler<RawServer, RawRequest, RawReply, RouteGenericInterface, ContextConfigDefault, FastifySchema, TypeProvider>;
    }
}

interface AuthOptions {}

const authPlugin:FastifyPluginAsync<AuthOptions> = async (fastify:FastifyInstance, _options) => {

    fastify.decorate('verifyJWTToken', async (_request:FastifyRequest, _reply:FastifyReply) => {
        fastify.log.debug('Calling verifyJWTToken');

        if (Math.random() > 0.5) {
            return true;
        }

        throw Error('JWT auth failed');
    });

    fastify.decorate('verifyUserAndPassword', async (_request:FastifyRequest, _reply:FastifyReply) => {
        fastify.log.debug('Calling verifyUserAndPassword');

        if (Math.random() > 0.5) {
            return true;
        }

        throw Error('User/password auth failed');
    });

    fastify.register(require('@fastify/auth')).after(() => {
        fastify.addHook(
            'preHandler', 
            fastify.auth([fastify.verifyJWTToken, fastify.verifyUserAndPassword])
        );
    });
};

export default fp(authPlugin);
