const envSchema = {
    type: 'object',
    required: ['PORT', 'HOST'],
    properties: {
        HOST: {
            type: 'string',
        },
        PORT: {
            type: 'string',
        },
    }
};

const envOptions = {
    configKey: 'config',
    schema: envSchema,
    data: process.env,
    dotenv: true,
};

export default envOptions;
