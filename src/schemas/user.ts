const FIRST_NAME_MIN_LENGTH = 2;
const FIRST_NAME_MAX_LENGTH = 24;

const LAST_NAME_MIN_LENGTH = 2;
const LAST_NAME_MAX_LENGTH = 24;

const PHONE_NUMBER_MIN_LENGTH = 8;
const PHONE_NUMBER_MAX_LENGTH = 10;

const EMAIL_MIN_LENGTH = 6;
const EMAIL_MAX_LENGTH = 32;

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 32;

const ACCOUNT_ID_MIN_LENGTH = 32;
const ACCOUNT_ID_MAX_LENGTH = 64;

const COMMENT_MIN_LENGTH = 1;
const COMMENT_MAX_LENGTH = 128;

const CREATE_USER_REQUEST_SCHEMA = {
    $id: 'createUserRequest',
    type: 'object',
    required: [
        'first_name', 'last_name', 'phone_number', 'email', 'password', 'account_id', 'comment'
    ],
    properties: {
        first_name: {
            type: 'string',
            minLength: FIRST_NAME_MIN_LENGTH,
            maxLength: FIRST_NAME_MAX_LENGTH,
        },
        last_name: {
            type: 'string',
            minLength: LAST_NAME_MIN_LENGTH,
            maxLength: LAST_NAME_MAX_LENGTH,
        },
        phone_number: {
            type: 'string',
            minLength: PHONE_NUMBER_MIN_LENGTH,
            maxLength: PHONE_NUMBER_MAX_LENGTH,
        },
        email: {
            type: 'string',
            minLength: EMAIL_MIN_LENGTH,
            maxLength: EMAIL_MAX_LENGTH,
        },
        password: {
            type: 'string',
            minLength: PASSWORD_MIN_LENGTH,
            maxLength: PASSWORD_MAX_LENGTH,
        },
        account_id: {
            type: 'string',
            minLength: ACCOUNT_ID_MIN_LENGTH,
            maxLength: ACCOUNT_ID_MAX_LENGTH,
        },
        comment: {
            type: 'string',
            minLength: COMMENT_MIN_LENGTH,
            maxLength: COMMENT_MAX_LENGTH,
        }
    }
};

const CREATE_USER_RESPONSE_SCHEMA = { 
    $id: 'createUserResponse',
    type: 'object',
    properties: {
        record_id: {
            type: 'string'
        },
        first_name: {
            type: 'string'
        },
        last_name: {
            type: 'string'
        },
        phone_number: {
            type: 'string'
        },
        email: {
            type: 'string'
        },
        password: {
            type: 'string'
        },
        account_id: {
            type: 'string'
        },
        comment: {
            type: 'string'
        }
    }
};

const GET_USER_RESPONSE_SCHEMA = {
    $id: 'getUserResponse',
    type: 'object',
    properties: {
        record_id: {
            type: 'string'
        },
        first_name: {
            type: 'string'
        },
        last_name: {
            type: 'string'
        },
        phone_number: {
            type: 'string'
        },
        email: {
            type: 'string'
        },
        password: {
            type: 'string'
        },
        account_id: {
            type: 'string'
        },
        comment: {
            type: 'string'
        }
    }

};


const USER_SCHEMAS = [CREATE_USER_REQUEST_SCHEMA, CREATE_USER_RESPONSE_SCHEMA, GET_USER_RESPONSE_SCHEMA];

export {USER_SCHEMAS}
