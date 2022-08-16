import type {FastifyInstance, FastifyReply} from 'fastify';


function createTransactionRequestValidator(_fastify:FastifyInstance) {
    return async (_request:CreateTransactionRequest, _reply:FastifyReply) => {
    }
}

function getTransactionRequestValidator(_fastify:FastifyInstance) {
    return async (_request:GetTransactionRequest, _reply:FastifyReply) => {
    }
}

export {createTransactionRequestValidator, getTransactionRequestValidator}
