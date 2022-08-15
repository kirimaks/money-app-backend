import {validate as validateUUID} from 'uuid';

import type {FastifyReply} from 'fastify';


async function createAccountRequestValidator(request:CreateAccountRequest, reply:FastifyReply):Promise<void> {
    if (request.body.account_name.match(/[,._]/)) {
        return reply.badRequest('Bad characters in account name');
    }
}

async function getAccountRequestValidator(request:GetAccountRequest, reply:FastifyReply):Promise<void> {
    if (!validateUUID(request.params.account_id)) {
        return reply.badRequest('Invalid uuid');
    }
}

async function removeAccountRequestValidator(request:DeleteAccountRequest, reply:FastifyReply):Promise<void> {
    if (!validateUUID(request.params.account_id)) {
        return reply.badRequest('Invalid uuid');
    }
}

export {createAccountRequestValidator, getAccountRequestValidator, removeAccountRequestValidator}
