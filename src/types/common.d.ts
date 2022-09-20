interface FastifySchemaType {
    $id: string;
    type: string;
    required: string[];
    properties: any;
}

interface ElasticSearchOptionsType {
    node: string;
    auth: {
        username: string;
        password: string;
    },
    tls: {
        rejectUnauthorized: boolean
    }
}

interface AppConfig {
    ELASTIC_URL: string;
    ELASTIC_USER: string;
    ELASTIC_PASSWORD: string;
    ENV: 'test' | 'dev' | 'prod';
    SESSION_SECRET_KEY: string;
    ACCOUNTS_INDEX_NAME: string;
    USERS_INDEX_NAME: string;
    TRANSACTIONS_INDEX_NAME: string;
    CATEGORIES_INDEX_NAME: string;
    REQUEST_METRICS_INDEX_NAME: string;
    SESSION_MAX_AGE_MINUTES: number;
}

enum AppIndex {
    ACCOUNT = 'ACCOUNT',
    USER = 'USER',
}

type Cookie = {
    name: string;
    value: string;
};

declare global {
    namespace NodeJS {
        interface ProcessEnv extends AppConfig {};
    }
}
