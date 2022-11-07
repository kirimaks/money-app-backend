declare global {
    namespace NodeJS {
        interface ProcessEnv {
            LISTEN_ADDRESS: string;
            LISTEN_PORT: number;
        }
    }
}

declare module 'fastify' {
  interface FastifyInstance {
    config: { // this should be same as the confKey in options
        FASTIFY_HOST: string;
        FASTIFY_PORT: number;
    };
  }
}

export {};
