import * as controllers from '../controllers/category';
import * as validators from '../validators/category';

import type {FastifyInstance, RouteOptions} from 'fastify';


export default async (fastify:FastifyInstance, _config:AppConfig): Promise<void> => {
    const routes:RouteOptions[] = [
        {
            method: 'POST',
            url: '/categories/new-category',
            preHandler: validators.createCategoryRequestValidator(fastify),
            handler: controllers.createCategoryController(fastify),
            schema: {
                body: {
                    $ref: 'createCategoryRequest',
                },
                response: {
                    400: {
                        $ref: 'badRequestResponse',
                    },
                    201: {
                        $ref: 'categoryResponse'
                    }
                }
            }
        },
        {
            method: 'GET',
            url: '/categories/:category_id',
            handler: controllers.getCategoryController(fastify),
            schema: {
                response: {
                    400: {
                        $ref: 'badRequestResponse'
                    },
                    200: {
                        $ref: 'categoryResponse',
                    }
                }
            }
        },
        {
            method: 'DELETE',
            url: '/categories/:category_id',
            handler: controllers.deleteCategoryController(fastify),
            schema: {
                response: {
                    400: {
                        $ref: 'badRequestResponse'
                    }
                }
            }
        }
    ];

    routes.map((route) => fastify.route(route));
}
