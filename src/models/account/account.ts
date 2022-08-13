import {validate as isValidUUID, v4 as uuidv4} from 'uuid';

import type {estypes} from '@elastic/elasticsearch';

import {AbstractModel} from '../model';
import {getErrorMessage} from '../../errors/tools';


class AccountModel extends AbstractModel {
    createDocument(requestBody:AccountDraft):AccountDocument {
        return {
            account_name: requestBody.account_name,
            record_id: uuidv4(),
        }
    }

    saveDocument(newAccountDoc:AccountDocument):Promise<ModelCreateDocResponse<AccountDocument>> {
        const response:ModelCreateDocResponse<AccountDocument> = {
            success: false,
            document: newAccountDoc,
        }

        return new Promise<ModelCreateDocResponse<AccountDocument>>(async (resolve, reject) => {
            if (newAccountDoc.account_name.match(/[,._]/)) {
                response.success = false;
                response.errorMessage = 'Bad characters in account name';
                resolve(response);
                return;
            }

            try {
                if (newAccountDoc.account_name === 'fail500fail') {
                    throw new Error('Account creation failed');
                }

                const resp:estypes.CreateResponse = await this.elastic.index({
                    index: this.indexName,
                    document: newAccountDoc,
                });

                this.log.debug(`<<< Create account response: ${JSON.stringify(resp)} >>>`);
                await this.elastic.indices.refresh({index: this.indexName});

                response.success = true;
                resolve(response);

            } catch(error) {
                this.log.error(`Cannot create account: ${error}`);

                response.errorMessage = getErrorMessage(error);
                reject(response);
            }
        });
    }

    getDocument(docId:string, options:ModelRequestOptions):Promise<ModelSearchDocResponse<AccountDocument>> {
        const response:ModelGetDocResponse<AccountDocument> = {
            found: false,
            errorMessage: ''
        }

        return new Promise(async (resolve, reject) => {
            if (!isValidUUID(docId)) {
                response.found = false;
                response.errorMessage = 'Invalid uuid';
                resolve(response);
                return;
            }

            try {
                if (options.controlHeader === 'fail500fail') {
                    throw new Error('Cannot create this account');
                }

                const searchDoc = this.getSearchByIdDock(docId);
                const resp:estypes.SearchResponse<AccountDocument> = await this.elastic.search(searchDoc);
                if (resp.hits.hits.length > 0) {
                    const hit = resp.hits.hits[0];
                    if (hit && hit._source) {
                        response.document = hit._source;
                        response.found = true;
                        resolve(response);
                    }
                }

            } catch(error) {
                this.log.error(`Cannot get account: ${error}`);

                response.errorMessage = getErrorMessage(error);
                reject(response);
            }

            resolve(response);
        });
    }

    removeDocument(docId:string, options:ModelRequestOptions):Promise<ModelDeleteDocResponse<AccountDocument>> {
        const response:ModelDeleteDocResponse<AccountDocument> = {
            success: false,
            errorMessage: '',
        };

        return new Promise(async (resolve, reject) => {
            if (!isValidUUID(docId)) {
                response.success = false;
                response.errorMessage = 'Invalid uuid';
                resolve(response);
                return;
            }

            try {
                if (options.controlHeader === 'fail500fail') {
                    throw new Error('Cannot remove this account');
                }

                const searchDoc = this.getSearchByIdDock(docId);
                const searchResp:estypes.SearchResponse = await this.elastic.search(searchDoc);
                if (searchResp.hits.hits.length > 0) {
                    const firstHit = searchResp.hits.hits[0];
                    if (firstHit) {
                        response.success = true;

                        const recordId:string = firstHit._id;
                        const deleteResp:estypes.DeleteResponse = await this.elastic.delete({
                            index: this.indexName,
                            id: recordId, 
                        });

                        this.log.debug(deleteResp);
                    }
                }

            } catch(error) {
                this.log.error(`Cannot remove account: ${error}`);

                response.errorMessage = getErrorMessage(error);
                reject(response);
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
                dynamic: 'strict',
                properties: {
                    record_id: {
                        type: 'text',
                    },
                    account_name: {
                        type: 'text',
                    },
                    created_date: {
                        type: 'date',
                    },
                    comment: {
                        type: 'text',
                        index: false
                    }
                }
            }
        };

        return await this.elastic.indices.create(indexDoc);
    }
}

export {AccountModel}
