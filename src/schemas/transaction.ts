// TODO: ajv types: https://ajv.js.org/guide/typescript.html


const CREATE_TRANSACTION_REQUEST_SCHEMA:FastifySchemaType = {
    $id: 'transactionRequest', 
    type: 'object',
    required: ['amount', 'name'], // TODO: source_id required
    properties: {
        name: {
            type: 'string',
        },
        amount: {
            type: 'integer',
        },
        source_id: {
            type: 'string',
        },
        tags: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    tag_name: {
                        type: 'string',
                    },
                    tag_id: {
                        type: 'string',
                    },
                    tag_icon: {
                        type: 'string',
                    }
                }
            }
        },
        category_id: {
            type: 'string',
        },
        description: {
            type: 'string',
        },
        spending_id: {
            type: 'string',
        },
        saving_id: {
            type: 'string',
        },
        budget_id: {
            type: 'string',
        },
    }
};

const TRANSACTION_RESPONSE_SCHEMA:FastifySchemaType = {
    $id: 'transactionResponse', 
    type: 'object',
    required: ['transaction_id'],
    properties: {
        transaction_id: {
            type: 'string',
        },
        category_id: { // TODO: remove
            type: 'string'
        },
        tags: {
            type: 'array',
        }
    }
};

const LATEST_TRANSACTIONS_SCHEMA:FastifySchemaType = {
    $id: 'latestTransactionsResponse',
    type: 'object',
    required: [],
    properties: {
        transactions: {
            type: 'array',
            maxItems: 10,
            items: {
                type: 'object',
                properties: {
                    transaction_id: {
                        type: 'string',
                    },
                    amount: {
                        type: 'string',
                    },
                    timestamp: {
                        type: 'string',
                    },
                    name: {
                        type: 'string',
                    },
                    tags: {
                        type: 'array',
                    }
                }
            }
        }
    }
};

export const TRANSACTION_SCHEMAS:FastifySchemaType[] = [
    CREATE_TRANSACTION_REQUEST_SCHEMA, TRANSACTION_RESPONSE_SCHEMA, LATEST_TRANSACTIONS_SCHEMA
];
