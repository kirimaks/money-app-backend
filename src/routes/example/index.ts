import type { FastifyPluginAsync, FastifyInstance, FastifyRequest, FastifyReply } from "fastify"

const example: FastifyPluginAsync = async (fastify:FastifyInstance, opts:object): Promise<void> => {
  fastify.log.debug(opts);

  fastify.get('/', async function (request:FastifyRequest, reply:FastifyReply) {
    fastify.log.debug(request);
    reply.send('this is an example');
  })
}

export default example;
