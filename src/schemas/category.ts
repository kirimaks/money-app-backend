const CREATE_CATEGORY_REQUEST = {
    $id: 'createCategoryRequest',
    type: 'object',
    required: ['category_name'],
    properties: {
        category_name: {
            type: 'string'
        }
    }
};

const CATEGORY_RESPONSE = {
    $id: 'categoryResponse',
    type: 'object',
    required: ['category_id'],
    properties: {
        category_id: {
            type: 'string',
        },
        account_id: {
            type: 'string',
        },
        category_name: {
            type: 'string',
        }
    }
};

export const CATEGORY_SCHEMAS = [
    CREATE_CATEGORY_REQUEST, CATEGORY_RESPONSE
];
