import fp from 'fastify-plugin';
import type { FastifyPluginAsync, FastifyInstance } from 'fastify';
import { isString } from '../types/guards';


const registerRequestMetrics:FastifyPluginAsync<AppConfig> = async (fastify:FastifyInstance, _config:AppConfig) => {
    fastify.decorateRequest('requestReceivedTime', 0);

    fastify.addHook('onRequest', async (request, _reply) => {
        request.requestReceivedTime = new Date().getTime();
    });

    fastify.addHook('onResponse', async (request, _reply) => {
        const requestRunTime = (new Date().getTime()) - request.requestReceivedTime;

        let bodyLength = 0;

        if (isString(request.body)) {
            bodyLength = request.body.length;
        }

        const requestBody:RequestMetricsDraft = { 
            url: request.url,
            request_time: request.requestReceivedTime,
            requestRunTimeMS: requestRunTime,
            requestSize: bodyLength,
            clientIp: request.ip,
            requestMethod: request.method,
            routerPath: request.routerPath,
            is404: request.is404,
        };

        const metricsDoc = await fastify.models.requestMetricsModel.createDocumentMap(requestBody);
        await metricsDoc.save();
    });
};

export default fp(registerRequestMetrics);
