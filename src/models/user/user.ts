import {v4 as uuidv4, validate as validateUUID} from 'uuid';

import type {FastifyInstance} from 'fastify';
import type {estypes} from '@elastic/elasticsearch';

import {AbstractModel} from '../model';
import {getErrorMessage} from '../../errors/tools';


class UserModel extends AbstractModel {
    constructor(fastify:FastifyInstance, config:AppConfig) {
        super(fastify, config.USERS_INDEX_NAME);
    }

    private getIndexDoc(newDocument:UserDocument) {
        return {
            index: this.indexName,
            document: newDocument,
        }
    }

    private getDeleteDoc(dbRecordId:string) {
        return {
            index: this.indexName,
            id: dbRecordId,
        }
    }

    private getSearchByIdDock(recordId:string) {
        return {
            query: {
                match: {record_id: recordId}
            }
        }
    }

    createDocument(requestBody:UserDraft):UserDocument {
        return {
            record_id: uuidv4(),
            first_name: requestBody.first_name,
            last_name: requestBody.last_name, 
            phone_number: requestBody.phone_number,
            email: requestBody.email,
            password: requestBody.password,
            account_id: requestBody.account_id,
            comment: requestBody.comment,
        }
    }

    saveDocument(newUserDoc:UserDocument):Promise<ModelCreateDocResponse<UserDocument>> {
        const response:ModelCreateDocResponse<UserDocument> = {
            success: false,
            document: newUserDoc,
        }

        return new Promise(async (resolve, reject) => {
            if (!validateUUID(newUserDoc.account_id)) {
                response.errorMessage = 'Invalid uuid';
                resolve(response);
                return;
            }

            try {
                if (newUserDoc.first_name === 'fail500fail') {
                    throw new Error('Cannot create this user');
                }

                const indexDoc = this.getIndexDoc(newUserDoc);
                const resp:estypes.CreateResponse = await this.fastify.elastic.index(indexDoc);
                this.fastify.log.debug(`<<< Create user response: ${JSON.stringify(resp)}`);
                await this.fastify.elastic.indices.refresh({index: this.indexName});

                response.success = true;
                resolve(response);

            } catch(error) {
                this.fastify.log.error(`Cannot create user: ${error}`);

                response.errorMessage = getErrorMessage(error);
                reject(response);
            }
        });
    }

    getDocument(recordId:string, options:ModelRequestOptions):Promise<ModelSearchDocResponse<UserDocument>> {
        const response:ModelGetDocResponse<UserDocument> = {
            found: false,
            errorMessage: '',
        };

        return new Promise(async (resolve, reject) => {
            if (!validateUUID(recordId)) {
                response.errorMessage = 'Invalid uuid';
                resolve(response);
                return;
            }

            try {
                if (options.controlHeader === 'fail500fail') {
                    throw new Error('Cannot get this document');
                }

                const searchDoc = this.getSearchByIdDock(recordId);
                const resp:estypes.SearchResponse<UserDocument> = await this.fastify.elastic.search(searchDoc);

                /* TODO: type guards */

                if (resp.hits.hits.length > 0) {
                    const hit = resp.hits.hits[0];
                    if (hit && hit._source) {
                        response.document = hit._source;
                        response.found = true;
                        resolve(response);
                    }
                }
            } catch(error) {
                this.fastify.log.error(`Cannot get user: ${error}`);
                reject(error);
            }

            resolve(response);
        });
    }

    removeDocument(recordId:string, options:ModelRequestOptions):Promise<ModelDeleteDocResponse<UserDocument>> {
        const response:ModelDeleteDocResponse<UserDocument> = {
            success: false,
            errorMessage: ''
        };

        return new Promise(async (resolve, reject) => {
            if (!validateUUID(recordId)) {
                response.success = false;
                response.errorMessage = 'Invalid uuid';
                resolve(response);
                return;
            }
      
            try {
                if (options.controlHeader === 'fail500fail') {
                    throw new Error('Cannot remove this user');
                }

                const searchDoc = this.getSearchByIdDock(recordId);
                const searchResp:estypes.SearchResponse = await this.fastify.elastic.search(searchDoc);

                if (searchResp.hits.hits.length > 0) {
                    const firstHit = searchResp.hits.hits[0];
                    if (firstHit) {
                        const foundRecordId:string = firstHit._id;
                        const deleteDoc = this.getDeleteDoc(foundRecordId);
                        const deleteResp:estypes.DeleteResponse = await this.fastify.elastic.delete(deleteDoc);

                        this.fastify.log.debug(deleteResp);
                        response.success = true;
                    }
                }

            } catch(error) {
                this.fastify.log.error(`Cannot remove user: ${error}`);
                reject(error);
            }

            resolve(response);
        });
    }

    async createIndex() {
        const indexDoc:estypes.IndicesCreateRequest = {
            index: this.indexName,
            settings: {
                number_of_shards: 1,
                number_of_replicas: 1,
            },
            mappings: {
                properties: {
                    user_id: {
                        type: 'text',
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
                    password: {
                        type: 'text',
                        index: false,
                    },
                    comment: {
                        type: 'text',
                    }
                }
            }
        };

        return await this.fastify.elastic.indices.create(indexDoc);
    }

    async deleteIndex() {
        const indexDoc:estypes.IndicesDeleteRequest = {
            index: this.indexName,
        };

        return await this.fastify.elastic.indices.delete(indexDoc);
    }
}

export {UserModel};
