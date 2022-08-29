import {getErrorMessage, NotFoundError} from '../errors/tools';

import type {FastifyInstance, FastifyReply} from 'fastify';
import type {HttpError} from '@fastify/sensible/lib/httpError';


function profileController(fastify:FastifyInstance, _config:AppConfig): ProfileRequestHandler {
    async function profile(request:ProfileRequest, reply:FastifyReply): Promise<HttpError> {
        /* TODO: use db_id */
        const {user_id} = request.user;

        try {
            const user = await fastify.models.user.getDocumentMap(user_id);
            return reply.code(200).send(user.document);

        } catch(error) {

            if (error instanceof NotFoundError) {
                return fastify.httpErrors.notFound();
            }

            const errorMessage = getErrorMessage(error);
            fastify.log.error(`Cannot get user details: ${errorMessage}`);
            return fastify.httpErrors.internalServerError(errorMessage);
        }
    }

    return profile;
}

function profileUpdateController(fastify:FastifyInstance, _config:AppConfig): ProfileUpdateRequestHandler {
    async function update(request:ProfileUpdateRequest, reply:FastifyReply): Promise<HttpError> {
        const {user_db_id} = request.user;

        try {
            const user = await fastify.models.user.updateDocument(user_db_id, request.body);
            return reply.code(200).send(user.document);

        } catch(error) {
            if (error instanceof NotFoundError) {
                return fastify.httpErrors.notFound();
            }

            const errorMessage = getErrorMessage(error);
            fastify.log.error(`Cannot update user details: ${errorMessage}`);
            return fastify.httpErrors.internalServerError();
        }
    }

    return update;
}

export { profileController, profileUpdateController }
