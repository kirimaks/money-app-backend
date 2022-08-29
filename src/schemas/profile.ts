

const PROFILE_RESPONSE_SCHEMA = {
    $id: 'profileReponse',
    type: 'object',
    required: ['first_name', 'last_name', 'phone_number'],
    properties: {
        first_name: {
            type: 'string',
        },
        last_name: {
            type: 'string',
        },
        phone_number: {
            type: 'string',
        }
    }
};

const PROFILE_UPDATE_SCHEMA = {
    $id: 'profileUpdate',
    type: 'object',
    properties: {
        first_name: {
            type: 'string',
        },
        last_name: {
            type: 'string',
        },
        phone_number: {
            type: 'string',
        }
    }
};

const PROFILE_SCHEMAS = [PROFILE_RESPONSE_SCHEMA, PROFILE_UPDATE_SCHEMA];

export { PROFILE_SCHEMAS }
