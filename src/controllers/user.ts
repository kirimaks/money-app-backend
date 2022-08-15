import {getErrorMessage, NotFoundError} from '../errors/tools';
import {
    NewUserRequestValidator, GetUserRequestValidator, RemoveUserRequestValidator
} from '../validators/user';

import type {FastifyInstance, FastifyReply} from 'fastify';
import type {HttpError} from '@fastify/sensible/lib/httpError';


function newUserController(fastify:FastifyInstance, _config:AppConfig): NewUserRequestHandler {
    async function create(request:CreateUserRequest, reply:FastifyReply): Promise<HttpError> {
        try {
            const validator = new NewUserRequestValidator(fastify.elastic, request.body);

            if (await validator.isValid()) {
                const newUser = await fastify.models.user.createDocumentMap(request.body);
                await newUser.save();
                return reply.code(201).send({record_id: newUser.document.user_id});
            } 

            return fastify.httpErrors.badRequest(validator.errorMessage);

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
            const validator = new GetUserRequestValidator(request.params);
            if (await validator.isValid()) {
                const {record_id} = request.params;
                const userDoc = await fastify.models.user.getDocumentMap(record_id);
                return reply.code(200).send(userDoc.document);
            }
            return fastify.httpErrors.badRequest(validator.errorMessage);

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
            const validator = new RemoveUserRequestValidator(request.params);
            if (await validator.isValid()) {
                const {record_id} = request.params;
                const userDoc = await fastify.models.user.getDocumentMap(record_id);
                await userDoc.delete();
                return reply.code(204).send({});
            }

            return fastify.httpErrors.badRequest(validator.errorMessage);

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
