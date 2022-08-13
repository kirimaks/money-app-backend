import type {FastifyInstance, FastifyReply} from 'fastify';

import {UserModel} from '../models/user/user';
import {getErrorMessage} from '../errors/tools';


function profileController(fastify:FastifyInstance, config:AppConfig): ProfileRequestHandler {
    async function profile(request:ProfileRequest, reply:FastifyReply): Promise<void> {
        const {user_id} = request.user;
        const user = new UserModel(fastify, config);
        const modelOptions:ModelRequestOptions = {controlHeader: undefined}; /* TODO: remove */

        try {
            const modelResp:ModelSearchDocResponse<UserDocument> = await user.getDocument(
                user_id, modelOptions
            );

            if (modelResp.errorMessage.length > 0) {
                reply.code(400).send({error: modelResp.errorMessage});
            } else if (modelResp.found) {
                reply.code(200).send(modelResp.document);
            } else {
                reply.code(404).send({error: 'Profile not found'});
            }
        } catch(error) {
            const errorMessage = getErrorMessage(error);
            fastify.log.error(`Cannot get user details: ${errorMessage}`);
            reply.code(500).send({ error: errorMessage });
        }
    }

    return profile;
}

export {profileController};
