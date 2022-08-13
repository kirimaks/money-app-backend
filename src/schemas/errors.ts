const BAD_REQUEST_RESPONSE = {
    $id: 'badRequestResponse',
    type: 'object',
    required: ['error', 'message', 'statusCode'],
    properties: {
        error: {
            type: 'string',
        },
        message: {
            type: 'string',
        },
        statusCode: {
            type: 'number',
        }
    }
};

const ERROR_SCHEMAS = [
    BAD_REQUEST_RESPONSE,
];

export {ERROR_SCHEMAS}
