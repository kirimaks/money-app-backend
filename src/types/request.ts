import type { RouteGenericInterface } from 'fastify/types/route';
import type { FastifyAuthFunction } from '@fastify/auth';
import type { Session } from '@fastify/secure-session';
import type { ContextConfigDefault, FastifySchema, preHandlerHookHandler } from 'fastify';


declare module 'fastify' {
    interface FastifyInstance<RawServer, RawRequest, RawReply, Logger, TypeProvider> {
        verifyJWTToken: (request:FastifyRequest, reply:FastifyReply) => void;
        verifyUserSession: (request:FastifyRequest, reply:FastifyReply) => void;
        auth(
            functions: FastifyAuthFunction[],
            options?: {
                relation?: 'and' | 'or',
                run?: 'all'
            }
        ): preHandlerHookHandler<RawServer, RawRequest, RawReply, RouteGenericInterface, ContextConfigDefault, FastifySchema, TypeProvider>;
    }

    interface FastifyRequest {
        session: Session;
        user: UserSessionInfo;
        requestReceivedTime: number;
    }
}
