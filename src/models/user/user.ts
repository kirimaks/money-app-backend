import {v4 as uuidv4} from 'uuid';
import {scryptSync, randomBytes} from 'crypto';

import type {FastifyLoggerInstance} from 'fastify';
import type {Client as ESClient, estypes} from '@elastic/elasticsearch';

import {AbstractModel, AbstractDocMap} from '../model';
import {AuthError, NotFoundError} from '../../errors/tools';


class UserDocMap extends AbstractDocMap<UserDocument> {
    async save(): Promise<string> {
        if (this.document.first_name === 'fail500fail') {
            throw new Error('Cannot create this user');
        }

        const indexDoc:estypes.IndexRequest = {
            index: this.indexName,
            document: this.document,
        };

        const resp:estypes.CreateResponse = await this.elastic.index(indexDoc);
        this.log.debug(`<<< Create user response: ${JSON.stringify(resp)}`);

        await this.elastic.indices.refresh({index: this.indexName});

        return this.document.user_id;
    }

    async delete(): Promise<void> {
        const request:estypes.DeleteByQueryRequest = {
            index: this.indexName,
            query: {
                match: {user_id: this.document.user_id}
            }
        };
        const resp:estypes.DeleteByQueryResponse = await this.elastic.deleteByQuery(request);
        this.log.debug(`Delete user response: ${JSON.stringify(resp)}`);
    }
}

class UserModel extends AbstractModel<UserDraft, UserDocument> {
    SALT_BYTES_LENGTH: number;

    constructor(log:FastifyLoggerInstance, elastic:ESClient, indexName:string) {
        super(log, elastic, indexName);

        this.SALT_BYTES_LENGTH = 16;
    }

    async createDocumentMap(requestBody:UserDraft):Promise<UserDocMap> {
        const salt:string = randomBytes(this.SALT_BYTES_LENGTH).toString('hex');
        const hash:Buffer = scryptSync(requestBody.password, salt, 64);

        const expires = new Date();
        expires.setMonth(expires.getMonth() + 1);

        const passwordInfo:PasswordInfo = {
            hash: hash.toString('hex'),
            salt: salt,
            expires: expires.getTime(),
        };

        const document = {
            user_id: uuidv4(),
            first_name: requestBody.first_name,
            last_name: requestBody.last_name, 
            phone_number: requestBody.phone_number,
            email: requestBody.email,
            password: passwordInfo,
            account_id: requestBody.account_id,
            comment: requestBody.comment,
        }

        return new UserDocMap(this.log, this.elastic, this.indexName, document);
    }

    async verifyPassword(email:string, password:string): Promise<UserSessionInfo> {
        const sessionInfo:UserSessionInfo = {
            anonymous: true,
            account_id: '',
            user_id: ''
        };

        const searchDoc:estypes.SearchRequest = {
            query: {
                match: {email: email}
            }
        };

        const searchResp:estypes.SearchResponseBody<UserDocument> = await this.elastic.search(searchDoc);

        if (searchResp.hits.hits.length > 0) {
            const firstHit = searchResp.hits.hits[0];

            if (firstHit && firstHit._source) {
                const user:UserDocument = firstHit._source;
                const hash:Buffer = scryptSync(password, user.password.salt, 64);

                if (hash.toString('hex') === user.password.hash) {
                    sessionInfo.user_id = user.user_id;
                    sessionInfo.account_id = user.account_id;
                    sessionInfo.anonymous = false;
                    return sessionInfo;

                }

            }
        }

        throw new AuthError('Auth error');
    }

    async getDocumentMap(user_id:string):Promise<UserDocMap> {
        const searchDoc:estypes.SearchRequest = {
            query: {
                match: {user_id: user_id}
            }
        };
        const resp:estypes.SearchResponse<UserDocument> = await this.elastic.search(searchDoc);

        if (resp.hits.hits.length > 0) {
            const hit = resp.hits.hits[0];
            if (hit && hit._source) {
                return new UserDocMap(this.log, this.elastic, this.indexName, hit._source);
            }
        }

        throw new NotFoundError(`Document ${user_id} not found`);
    }

    async createIndex(): Promise<estypes.IndicesCreateResponse> {
        this.log.debug(`<<< Creating index: ${this.indexName} >>>`);

        const indexDoc:estypes.IndicesCreateRequest = {
            index: this.indexName,
            settings: {
                number_of_shards: 1,
                number_of_replicas: 1,
            },
            mappings: {
                dynamic: 'strict',
                properties: {
                    user_id: {
                        type: 'text',
                    },
                    account_id: {
                        type: 'text',
                    },
                    created: {
                        type: 'date',
                    },
                    password: {
                        type: 'object',
                        enabled: false,
                        properties: {
                            hash: {
                                type: 'text'
                            },
                            salt: {
                                type: 'text'
                            },
                            expires: {
                                type: 'date'
                            }
                        }
                    },
                    first_name: {
                        type: 'text',
                    },
                    last_name: {
                        type: 'text',
                    },
                    email: {
                        type: 'text',
                    },
                    phone_number: {
                        type: 'text',
                    },
                    comment: {
                        type: 'text',
                    }
                }
            }
        };

        return await this.elastic.indices.create(indexDoc);
    }
}

export {UserModel};
