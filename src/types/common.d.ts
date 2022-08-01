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
    ENV: 'test' | 'dev' | 'prod';
}
