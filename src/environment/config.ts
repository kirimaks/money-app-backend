const envSchema = {
    type: 'object',
    required: ['FASTIFY_PORT', 'FASTIFY_HOST', 'FASTIFY_LOG_LEVEL'],
    properties: {
        FASTIFY_HOST: {
            type: 'string',
        },
        FASTIFY_PORT: {
            type: 'string',
        },
        FASTIFY_LOG_LEVEL: {
            type: 'string',
        }
    }
};

const envOptions = {
    configKey: 'config',
    schema: envSchema,
    data: process.env,
    dotenv: true,
};

export default envOptions;
