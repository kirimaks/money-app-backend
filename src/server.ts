import fastify from 'fastify';


const server = fastify({
    maxParamLength: 5000
});

server.get('/ping', async (request, reply) => {
    server.log.info(request);
    server.log.info(reply);

    return 'pong\n';
});

(async () => {
    try { 
        await server.listen({port: 3000});

    } catch(error) {
        server.log.error(error);
        process.exit(1);
    }
});
