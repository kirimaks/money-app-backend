import type {FastifyInstance, FastifyReply} from 'fastify';


export function createTransactionRequestValidator(_fastify:FastifyInstance) {
    return async (_request:CreateTransactionRequest, _reply:FastifyReply) => {
    }
}

export function getTransactionRequestValidator(_fastify:FastifyInstance) {
    return async (_request:GetTransactionRequest, _reply:FastifyReply) => {
    }
}
