const EMAIL_MIN_LENGTH = 3;
const EMAIL_MAX_LENGTH = 32;

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 32;


const LOG_IN_REQUEST_SCHEMA = {
    $id: 'logInRequest',
    type: 'object',
    required: ['email', 'password'],
    properties: {
        email: {
            type: 'string',
            minLength: EMAIL_MIN_LENGTH,
            maxLength: EMAIL_MAX_LENGTH,
        },
        password: {
            type: 'string',
            minLength: PASSWORD_MIN_LENGTH,
            maxLength: PASSWORD_MAX_LENGTH,
        }
    }
};

const LOG_IN_FAIL_RESPONSE_SCHEMA = {
    $id: 'logInErrorResponse',
    type: 'object',
    required: ['error'],
    properties: {
        error: {
            type: 'string'
        }
    }
};

const SIGN_UP_FAIL_RESPONSE = {
    $id: 'signUpErrorResponse',
    type: 'object',
    required: ['error', 'message', 'statusCode'],
    properties: {
        error: {
            type: 'string'
        }, 
        message: {
            type: 'string'
        },
        statusCode: {
            type: 'number'
        }
    }
};

const SIGN_UP_OK_RESPONSE = {
    $id: 'signUpOkResponse',
    type: 'object',
    required: ['user_id', 'account_id', 'email', 'first_name', 'last_name'],
    properties: {
        user_id: {
            type: 'string',
        },
        account_id: {
            type: 'string',
        },
        email: {
            type: 'string',
        },
        first_name: {
            type: 'string',
        },
        last_name: {
            type: 'string'
        }
    }
};

const SIGN_UP_REQUEST = {
    $id: 'signUpRequest',
    type: 'object',
    required: ['first_name', 'last_name', 'phone_number', 'email', 'password', 'account_name'],
    properties: {
        first_name: {
            type: 'string',
        },
        last_name: {
            type: 'string',
        },
        phone_number: {
            type: 'string',
        },
        email: {
            type: 'string',
        },
        password: { /* TODO: Password validator */
            type: 'string',
        },
        account_name: {
            type: 'string',
        }
    }
};

const AUTH_SCHEMAS = [
    LOG_IN_REQUEST_SCHEMA, LOG_IN_FAIL_RESPONSE_SCHEMA,
    SIGN_UP_FAIL_RESPONSE, SIGN_UP_OK_RESPONSE, SIGN_UP_REQUEST
];

export {AUTH_SCHEMAS};
