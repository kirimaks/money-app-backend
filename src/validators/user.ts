import {validate as validateUUID} from 'uuid';
import {NotFoundError, getErrorMessage} from '../errors/tools';

import type {FastifyInstance, FastifyReply} from 'fastify';


function createUserRequestValidator(fastify:FastifyInstance) {
    async function validate(request:CreateUserRequest, reply:FastifyReply) {
        const {account_id} = request.body;

        try {
            await fastify.models.account.getDocumentMap(account_id);

        } catch(error) {
            if (error instanceof NotFoundError) {
                return reply.badRequest(`No such account: ${account_id}`);
            }

            const errorMessage = getErrorMessage(error);
            fastify.log.error(`Cannot validate sign up request: ${errorMessage}`);
            return reply.internalServerError();
        }
    }

    return validate;
}

async function getUserRequestValidator(request:GetUserRequest, reply:FastifyReply) {
    if (!validateUUID(request.params.record_id)) {
        return reply.badRequest('Invalid uuid');
    }
}

async function removeUserRequestValidator(request:GetUserRequest, reply:FastifyReply) {
    if (!validateUUID(request.params.record_id)) {
        return reply.badRequest('Invalid uuid');
    }
}

export {createUserRequestValidator, getUserRequestValidator, removeUserRequestValidator}
