import type {FastifyInstance, FastifyReply} from 'fastify';

import {UserModel} from '../models/user/user';


function newUserController(fastify:FastifyInstance, config:AppConfig): NewUserRequestHandler {
    async function create(request:CreateUserRequest, reply:FastifyReply): Promise<void> {
        const user = new UserModel(fastify, config);
        try {
            const newDoc:UserDocument = await user.createDocument(request.body);
            const modelResp:ModelCreateDocResponse<UserDocument> = await user.saveDocument(newDoc);
            if (modelResp.success) {
                reply.code(201).send({
                    record_id: modelResp.document.record_id,
                });
            } else {
                reply.code(400).send({error: modelResp.errorMessage});
            }
        } catch(error) {
            fastify.log.error(`Cannot create user: ${error}`);

            reply.code(500).send({error: user.getModelResponseError(error)});
        }
    }

    return create;
}

function getUserController(fastify:FastifyInstance, config:AppConfig): GetUserRequestHandler {
    async function get(request:GetUserRequest, reply:FastifyReply): Promise<void> {
        const {record_id} = request.params;
        const user = new UserModel(fastify, config);
        const options:ModelRequestOptions = {
            controlHeader: request.headers['x-control-header'],
        }

        try {
            const modelResp:ModelSearchDocResponse<UserDocument> = await user.getDocument(record_id, options);
            if (modelResp.errorMessage.length > 0) {
                reply.code(400).send({error: modelResp.errorMessage});

            } else if (modelResp.found) {
                reply.code(200).send(modelResp.document);

            } else {
                reply.code(404).send({error: 'User not found'});

            }
        } catch(error) {
            fastify.log.error(`Cannot get user: ${error}`);
            reply.code(500).send({error: user.getModelResponseError(error)});
        }
    }

    return get;
}

function removeUserController(fastify:FastifyInstance, config:AppConfig): RemoveUserRequestHandler {
    async function remove(request:RemoveUserRequest, reply:FastifyReply): Promise<void> {
        const {record_id} = request.params;
        const user = new UserModel(fastify, config);
        const options:ModelRequestOptions = {
            controlHeader: request.headers['x-control-header'],
        }

        try {
            const modelResp:ModelDeleteDocResponse<UserDocument> = await user.removeDocument(record_id, options);
            if (modelResp.errorMessage.length > 0) {
                reply.code(400).send({error: modelResp.errorMessage});

            } else if (modelResp.success) {
                reply.code(204).send({});

            } else {
                reply.code(404).send({error: 'User not found'});
            }
        } catch(error) {
            fastify.log.error(`Cannot remove user ${error}`);
            reply.code(500).send({error: user.getModelResponseError(error)});
        }
    }

    return remove;
}

export {
    newUserController, getUserController, removeUserController
}
