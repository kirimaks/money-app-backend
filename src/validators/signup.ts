import type {FastifyInstance, FastifyReply} from 'fastify';

import {NotFoundError, getErrorMessage} from '../errors/tools';


export function signUpRequestValidator(fastify:FastifyInstance) {
    async function validate(request:SignUpRequest, reply:FastifyReply) {
        fastify.log.info('<<< signUpRequestValidator() >>>');

        try {
            const resp = await fastify.models.user.searchDocument({email: request.body.email});

            fastify.log.info(`Response: ${JSON.stringify(resp.document)}`);

            return reply.badRequest('This email already exist');

        } catch(error) {
            if (error instanceof NotFoundError) {
                fastify.log.info(`[[ Email: ${request.body.email} not found (sign up ok) ]]`);

            } else {
                const errorMessage = getErrorMessage(error);
                fastify.log.error(`Cannot validate sign up request: ${errorMessage}`);
                return reply.internalServerError();
            }
        }
    }

    return validate;
}
