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

const LOG_IN_OK_RESPONSE_SCHEMA = {
    $id: 'logInOkResponse',
    type: 'object',
    required: ['message'],
    properties: {
        message: {
            type: 'string'
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

const AUTH_SCHEMAS = [LOG_IN_REQUEST_SCHEMA, LOG_IN_OK_RESPONSE_SCHEMA, LOG_IN_FAIL_RESPONSE_SCHEMA];

export {AUTH_SCHEMAS};
