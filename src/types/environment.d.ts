export {};


declare global {
    namespace NodeJS {
        interface ProcessEnv { 
            ELASTIC_URL: string;
            ELASTIC_USER: string;
            ELASTIC_PASSWORD: string;
            ACCOUNTS_INDEX_NAME: string;
            ENV: 'test' | 'dev' | 'prod';
        }
    }
}
