import {getErrorMessage, NotFoundError} from '../errors/tools';

import type {HttpError} from '@fastify/sensible/lib/httpError';
import type {FastifyInstance, FastifyReply} from 'fastify';


export function createCategoryController(fastify:FastifyInstance): CreateCategoryRequestHandler {
    return async (request:CreateCategoryRequest, reply:FastifyReply): Promise<HttpError> => {
        try {
            const categoryDraft:CategoryDraft = Object.assign(
                request.body,
                {
                    account_id: request.user.account_id
                }
            );
            const category = await fastify.models.category.createDocumentMap(categoryDraft);
            await category.save();

            return reply.code(201).send({
                category_id: category.document.category_id
            });
            
        } catch(error) {
            const errorMessage = getErrorMessage(error);
            fastify.log.error(`Cannot create category: ${errorMessage}`);

            return fastify.httpErrors.internalServerError();
        }
    }
}


export function getCategoryController(fastify:FastifyInstance): GetCategoryRequestHandler {
    return async (request:GetCategoryRequest, reply:FastifyReply): Promise<HttpError> => {
        try {
            const {category_id} = request.params;
            const category = await fastify.models.category.getDocumentMap(category_id);

            return reply.code(200).send({
                category_id: category.document.category_id
            });

        } catch(error) {
            if (error instanceof NotFoundError) {
                return fastify.httpErrors.notFound();
            }
            const errorMessage = getErrorMessage(error);
            fastify.log.error(`Cannot get category: ${errorMessage}`);

            return fastify.httpErrors.internalServerError();
        }
    }
}

export function deleteCategoryController(fastify:FastifyInstance): DeleteCategoryRequestHandler {
    return async (request:DeleteCategoryRequest, reply:FastifyReply): Promise<HttpError> => {
        try {
            const {category_id} = request.params;
            const category = await fastify.models.category.getDocumentMap(category_id);
            await category.delete();

            return reply.code(204).send({});

        } catch(error) {
            if (error instanceof NotFoundError) {
                return fastify.httpErrors.notFound();
            }
            const errorMessage = getErrorMessage(error);
            fastify.log.error(`Cannot get category: ${errorMessage}`);

            return fastify.httpErrors.internalServerError();
        }
    }
}
