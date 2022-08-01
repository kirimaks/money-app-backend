import Ajv from "ajv";

import {envConfigSchema} from './schemas/environment';


function getAppConfig(): AppConfig {
    return Object.assign({}, process.env);
}


function validateConfig(config:object):boolean {
    const ajv = new Ajv();
    const validate = ajv.compile(envConfigSchema);

    if (validate(config)) {
        return true;
    }

    console.error('<<< Config error >>>');
    console.error(validate.errors);

    return false;
}

function getElasticSearchOptions(config:AppConfig):ElasticSearchOptionsType {
    return {
        node: config.ELASTIC_URL,
        auth: {
            username: config.ELASTIC_USER,
            password: config.ELASTIC_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false
        },
    }
}

function getSwaggerOptions() {
    return {
        routePrefix: '/documentation',
        swagger: {
            info: {
              title: 'Test swagger',
              description: 'Testing the Fastify swagger API',
              version: '0.1.0'
            },
            externalDocs: {
              url: 'https://swagger.io',
              description: 'Find more info here'
            },
            host: 'localhost',
            schemes: ['http'],
            consumes: ['application/json'],
            produces: ['application/json'],
            tags: [
              { name: 'user', description: 'User related end-points' },
              { name: 'code', description: 'Code related end-points' }
            ],
            definitions: {
              User: {
                type: 'object',
                required: ['id', 'email'],
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                  email: {type: 'string', format: 'email' }
                }
              }
            },
            securityDefinitions: {
              apiKey: {
                type: 'apiKey',
                name: 'apiKey',
                in: 'header'
              }
            }
        },

        uiConfig: {
            docExpansion: 'full',
            deepLinking: false
        },
        // uiHooks: {
        //     onRequest: function (request:any, reply:any, next:any) { next() },
        //     preHandler: function (request:any, reply:any, next:any) { next() }
        // },
        staticCSP: true,
        // transformStaticCSP: (header:any) => header,
        exposeRoute: true
    }
}

export { getAppConfig, validateConfig, getElasticSearchOptions, getSwaggerOptions }
