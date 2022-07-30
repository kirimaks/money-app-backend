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
