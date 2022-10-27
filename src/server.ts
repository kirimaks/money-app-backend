import fastify from 'fastify';

import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';

import { appRouter } from './trpc/auth/routes';
import { createContext } from './trpc/context';


const server = fastify({
    maxParamLength: 5000
});

server.get('/ping', async (request, reply) => {
    server.log.info(request);
    server.log.info(reply);

    return 'pong\n';
});

server.register(
    fastifyTRPCPlugin, {
        prefix: '/trpc',
        trpcOptions: { router: appRouter, createContext }
    }
);

server.listen({port: 8080}, (error, address) => {
    if (error) {
        // console.error(error);
        server.log.error(error);
        process.exit(1);
    }

    console.log(`Server listening at ${address}`);
});
