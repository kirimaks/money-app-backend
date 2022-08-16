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
    ACCOUNTS_INDEX_NAME: string;
    USERS_INDEX_NAME: string;
    TRANSACTIONS_INDEX_NAME: string;
    ENV: 'test' | 'dev' | 'prod';
    SESSION_SECRET_KEY: string;
}

enum AppIndex {
    ACCOUNT = 'ACCOUNT',
    USER = 'USER',
}

type Cookie = {
    name: string;
    value: string;
};
