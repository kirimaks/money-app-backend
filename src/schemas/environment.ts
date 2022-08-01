export const envConfigSchema = {
    type: 'object',
    properties: {
        ELASTIC_URL: {type: 'string'},
        ELASTIC_USER: {type: 'string'},
        ELASTIC_PASSWORD: {type: 'string'},
        ACCOUNTS_INDEX_NAME: {type: 'string', 'minLength': 1},
    },
    required: [
        'ELASTIC_URL', 'ELASTIC_USER', 'ELASTIC_PASSWORD', 'ACCOUNTS_INDEX_NAME'
    ]
}
