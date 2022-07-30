import type { FastifyPluginAsync, FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

const root: FastifyPluginAsync = async (fastify:FastifyInstance, opts:object): Promise<void> => {
  fastify.log.debug(opts);
  fastify.get('/', async function (request:FastifyRequest, reply:FastifyReply) {
    fastify.log.debug(request);
    reply.send({ root: true });
  })
}

export default root;
