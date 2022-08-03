import type {FastifyInstance, FastifyReply, FastifyRequest} from 'fastify';

import {UserModel} from '../models/user/user';


type CreateUserProperties = {
    Body: UserDraft;
}

type GetUserProperties = {
    Params: {
        record_id: string;
    }
}

type RemoveUserProperties = {
    Params: {
        record_id: string;
    }
}

type CreateUserRequest = FastifyRequest<CreateUserProperties>;
type GetUserRequest = FastifyRequest<GetUserProperties>;
type RemoveUserRequest = FastifyRequest<RemoveUserProperties>;

type NewUserRequestHandler = (request:CreateUserRequest, reply:FastifyReply) => Promise<void>;
type GetUserRequestHandler = (request:GetUserRequest, reply:FastifyReply) => Promise<void>;
type RemoveUserRequestHandler = (request:RemoveUserRequest, reply:FastifyReply) => Promise<void>;


function newUserController(fastify:FastifyInstance, config:AppConfig): NewUserRequestHandler {
    async function create(request:CreateUserRequest, reply:FastifyReply): Promise<void> {
        const user = new UserModel(fastify, config);
        const newDoc:UserDocument = user.createUser(request.body);

        try {
            const modelResp:ModelCreateDocResponse<UserDocument> = await user.createDocument(newDoc);
            if (modelResp.success) {
                reply.code(201).send({
                    record_id: modelResp.document.record_id,
                });
            } else {
                reply.code(400).send({error: modelResp.errorMessage});
            }
        } catch(error) {
            fastify.log.error(`Cannot create user: ${error}`);

            const errorMessage = error instanceof Error ? error.message : 'Error not provided';
            reply.code(500).send({error: errorMessage});
        }
    }

    return create;
}

function getUserController(fastify:FastifyInstance, config:AppConfig): GetUserRequestHandler {
    async function get(request:GetUserRequest, reply:FastifyReply): Promise<void> {
        const {record_id} = request.params;
        const user = new UserModel(fastify, config);

        try {
            const modelResp:ModelSearchDocResponse<UserDocument> = await user.getDocument(record_id);
            if (modelResp.found) {
                reply.code(200).send(modelResp.document);
            } else {
                reply.code(404).send({error: 'User not found'});
            }
        } catch(error) {
            fastify.log.error(`Cannot get user: ${error}`);

            const errorMessage = error instanceof Error ? error.message : 'Error message not provided';
            reply.code(500).send({error: errorMessage});
        }
    }

    return get;
}

function removeUserController(fastify:FastifyInstance, config:AppConfig): RemoveUserRequestHandler {
    async function remove(request:RemoveUserRequest, reply:FastifyReply): Promise<void> {
        const {record_id} = request.params;
        const user = new UserModel(fastify, config);

        try {
            const modelResp:ModelDeleteDocResponse<UserDocument> = await user.removeDocument(record_id);
            if (modelResp.success) {
                reply.code(204).send({});
            } else {
                reply.code(404).send({error: 'User not found'});
            }
        } catch(error) {
            fastify.log.error(`Cannot remove user ${error}`);

            const errorMessage = error instanceof Error ? error.message : 'Error message not provided';
            reply.code(500).send({error: errorMessage});
        }
    }

    return remove;
}

export {
    NewUserRequestHandler, GetUserRequestHandler, RemoveUserRequestHandler,
    newUserController, getUserController, removeUserController
}
