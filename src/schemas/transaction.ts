const CREATE_TRANSACTION_REQUEST_SCHEMA:FastifySchemaType = {
    $id: 'transactionRequest', 
    type: 'object',
    required: ['amount'],
    properties: {
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

export const TRANSACTION_SCHEMAS:FastifySchemaType[] = [
    CREATE_TRANSACTION_REQUEST_SCHEMA, TRANSACTION_RESPONSE_SCHEMA
];
