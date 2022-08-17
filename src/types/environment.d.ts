export {};


declare global {
    namespace NodeJS {
        interface ProcessEnv { 
            ELASTIC_URL: string;
            ELASTIC_USER: string;
            ELASTIC_PASSWORD: string;
            ACCOUNTS_INDEX_NAME: string;
            USERS_INDEX_NAME: string;
            TRANSACTIONS_INDEX_NAME: string;
            CATEGORIES_INDEX_NAME: string;
            ENV: 'test' | 'dev' | 'prod';
            SESSION_SECRET_KEY: string;
        }
    }
}
