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
    required: ['error'],
    properties: {
        error: {
            type: 'string'
        }
    }
};

const AUTH_SCHEMAS = [
    LOG_IN_REQUEST_SCHEMA, 
    LOG_IN_FAIL_RESPONSE_SCHEMA,
    SIGN_UP_FAIL_RESPONSE
];

export {AUTH_SCHEMAS};
