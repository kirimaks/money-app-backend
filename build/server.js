"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const server = (0, fastify_1.default)({
    maxParamLength: 5000
});
server.get('/ping', async (request, reply) => {
    server.log.info(request);
    server.log.info(reply);
    return 'pong\n';
});
(async () => {
    try {
        await server.listen({ port: 3000 });
    }
    catch (error) {
        server.log.error(error);
        process.exit(1);
    }
});
