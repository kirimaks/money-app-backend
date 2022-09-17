export const ACCOUNT_NAME_MIN_LENGTH = 10;
export const ACCOUNT_NAME_MAX_LENGTH = 20;


const CREATE_ACCOUNT_REQUEST_SCHEMA:FastifySchemaType = {
    $id: 'createAccountRequest',
    type: 'object',
    required: ['account_name'],
    properties: {
        account_name: { 
            type: 'string',
            minLength: ACCOUNT_NAME_MIN_LENGTH,
            maxLength: ACCOUNT_NAME_MAX_LENGTH,
        }
    }
};

const CREATE_ACCOUNT_RESPONSE_SCHEMA:FastifySchemaType = {
    $id: 'createAccountResponse',
    type: 'object',
    required: ['account_name', 'account_id'],
    properties: {
        account_name: { type: 'string' },
        account_id: { type: 'string' },
    }
};

const GET_ACCOUNT_REQUEST_SCHEMA:FastifySchemaType  = {
    $id: 'getAccountRequest',
    type: 'object',
    required: ['account_id'],
    properties: {
        account_id: { type: 'string' }
    }
};

const GET_ACCOUNT_RESPONSE_SCHEMA:FastifySchemaType  = {
    $id: 'getAccountResponse',
    type: 'object',
    required: ['account_id', 'account_name', 'money_sources'],
    properties: {
        account_id: {
            type: 'string',
        },
        account_name: { 
            type: 'string',
        },
        money_sources: {
            type: 'array',
        },
    }
};

const CREATE_MONEY_SOURCE_RESPONSE_SCHEMA:FastifySchemaType = {
    $id: 'createMoneySourceResponse',
    type: 'object',
    required: ['updated'],
    properties: {
        updated: {
            type: 'string'
        }
    }
};

const ACCOUNT_DETAILS_RESPONSE = {
    $id: 'accountDetailsResponse',
    type: 'object',
    required: ['account_name', 'money_sources'],
    properties: {
        account_name: {
            type: 'string',
        },
        money_sources: {
            type: 'array',
        }
    }
};

const CREATE_TAG_REQUEST = {
    $id: 'createTagResponse',
    type: 'object',
    required: ['updated'],
    properties: {
        updated: {
            type: 'string',
        },
    }
};

export const ACCOUNT_SCHEMAS:FastifySchemaType[] = [
    CREATE_ACCOUNT_REQUEST_SCHEMA, CREATE_ACCOUNT_RESPONSE_SCHEMA, 
    GET_ACCOUNT_REQUEST_SCHEMA, GET_ACCOUNT_RESPONSE_SCHEMA,
    CREATE_MONEY_SOURCE_RESPONSE_SCHEMA, ACCOUNT_DETAILS_RESPONSE,
    CREATE_TAG_REQUEST
];
