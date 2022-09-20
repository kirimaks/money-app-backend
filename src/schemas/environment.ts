const envConfigSchema = {
    type: 'object',
    properties: {
        ELASTIC_URL: {type: 'string'},
        ELASTIC_USER: {type: 'string'},
        ELASTIC_PASSWORD: {type: 'string'},
        ACCOUNTS_INDEX_NAME: {type: 'string', 'minLength': 1},
        USERS_INDEX_NAME: {type: 'string', 'minLength': 1},
        SESSION_SECRET_KEY: {type: 'string', 'minLength': 32},
        REQUEST_METRICS_INDEX_NAME: {type: 'string', 'minLength': 1},
    },
    required: [
        'ELASTIC_URL', 'ELASTIC_USER', 'ELASTIC_PASSWORD', 'ACCOUNTS_INDEX_NAME', 'USERS_INDEX_NAME', 
        'SESSION_SECRET_KEY', 'REQUEST_METRICS_INDEX_NAME'
    ]
}

export {envConfigSchema}
