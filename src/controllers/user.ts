import {getErrorMessage, NotFoundError} from '../errors/tools';

import type {FastifyInstance, FastifyReply} from 'fastify';
import type {HttpError} from '@fastify/sensible/lib/httpError';


function newUserController(fastify:FastifyInstance, _config:AppConfig): NewUserRequestHandler {
    async function create(request:CreateUserRequest, reply:FastifyReply): Promise<HttpError> {
        try {
            const user = await fastify.models.user.createDocumentMap(request.body);
            await user.save();

            return reply.code(201).send({user_id: user.document.user_id});

        } catch(error) {
            const errorMessage = getErrorMessage(error);

            fastify.log.error(`Cannot create user: ${errorMessage}`);
            return fastify.httpErrors.internalServerError(errorMessage);
        }
    }

    return create;
}

function getUserController(fastify:FastifyInstance, _config:AppConfig): GetUserRequestHandler {
    async function get(request:GetUserRequest, reply:FastifyReply): Promise<HttpError> {
        try {
            const {record_id} = request.params;
            const user = await fastify.models.user.getDocumentMap(record_id);
            return reply.code(200).send(user.document);

        } catch(error) {
            if (error instanceof NotFoundError) {
                return fastify.httpErrors.notFound();
            } 
            const errorMessage = getErrorMessage(error);
            fastify.log.error(`Cannot create user: ${errorMessage}`);
            return fastify.httpErrors.internalServerError(errorMessage);
        }
    }

    return get;
}

function removeUserController(fastify:FastifyInstance, _config:AppConfig): RemoveUserRequestHandler {
    async function remove(request:RemoveUserRequest, reply:FastifyReply): Promise<HttpError> {
        try {
            const {record_id} = request.params;
            const user = await fastify.models.user.getDocumentMap(record_id);
            await user.delete();

            return reply.code(204).send({});

        } catch(error) {
            if (error instanceof NotFoundError) {
                return fastify.httpErrors.notFound();
            } 
            const errorMessage = getErrorMessage(error);
            fastify.log.error(`Cannot create user: ${errorMessage}`);
            return fastify.httpErrors.internalServerError(errorMessage);
        }
    }

    return remove;
}

export {
    newUserController, getUserController, removeUserController
}
