// TODO: ajv types: https://ajv.js.org/guide/typescript.html


const CREATE_TRANSACTION_REQUEST_SCHEMA:FastifySchemaType = {
    $id: 'transactionRequest', 
    type: 'object',
    required: ['amount', 'name'],
    properties: {
        name: {
            type: 'string',
        },
        amount: {
            type: 'integer',
        },
        category_id: {
            type: 'string',
        },
        description: {
            type: 'string',
        },
        sepending_id: {
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
    required: ['transaction_id', 'category_id'],
    properties: {
        transaction_id: {
            type: 'string',
        },
        category_id: {
            type: 'string'
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
                    }
                }
            }
        }
    }
};

export const TRANSACTION_SCHEMAS:FastifySchemaType[] = [
    CREATE_TRANSACTION_REQUEST_SCHEMA, TRANSACTION_RESPONSE_SCHEMA, LATEST_TRANSACTIONS_SCHEMA
];
