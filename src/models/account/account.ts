import {validate as isValidUUID} from 'uuid';

import type {FastifyInstance} from 'fastify';
import type {Client, estypes} from '@elastic/elasticsearch';

import {AbstractModel} from '../model';


declare module 'fastify' {
    interface FastifyInstance {
        elastic: Client;
    }
}


class AccountModel extends AbstractModel {
    fastify: FastifyInstance;
    accountIndex: string;

    constructor(fastify:FastifyInstance, config:AppConfig) {
        super();

        this.fastify = fastify;
        this.accountIndex = config.ACCOUNTS_INDEX_NAME;
    }

    createDocument(newAccountDoc:AccountDocument):Promise<ModelCreateDocResponse<AccountDocument>> {
        const response:ModelCreateDocResponse<AccountDocument> = {
            success: false,
            document: newAccountDoc,
        }

        return new Promise(async (resolve, reject): Promise<any> => {
            if (newAccountDoc.account_name === 'failfailfail') {
                resolve(response);
            }

            try {
                if (newAccountDoc.account_name.match(/[,._]/)) {
                    throw new Error('Invalid account name');
                }

                const resp:estypes.CreateResponse = await this.fastify.elastic.index({
                    index: this.accountIndex,
                    document: newAccountDoc,
                });
                this.fastify.log.debug(`<<< Create account response: ${JSON.stringify(resp)} >>>`);
                await this.fastify.elastic.indices.refresh({index: this.accountIndex});

                response.success = true;
                resolve(response);

            } catch(error) {
                this.fastify.log.error(`Cannot create document: ${error}`);
                reject(error);
            }
        });
    }

    getDocument(docId:string):Promise<ModelSearchDocResponse<AccountDocument>> {
        const response:ModelGetDocResponse<AccountDocument> = {
            found: false,
        };

        return new Promise(async (resolve, reject) => {
            try {
                if (!isValidUUID(docId)) {
                    throw new Error('Invalid uuid');
                }

                const resp:estypes.SearchResponse<AccountDocument> = await this.fastify.elastic.search({
                    query: {
                        match: { account_id: docId}
                    }
                });

                if (resp.hits.hits.length > 0) {
                    const hit = resp.hits.hits[0];

                    if (hit && hit._source) {
                        response.document = hit._source;
                        response.found = true;
                        resolve(response);
                    }
                } 
            } catch(error) {
                this.fastify.log.error(`Cannot get account: ${error}`);
                reject(error);
            }

            resolve(response);
        });
    }

    removeDocument(docId:string):Promise<ModelDeleteDocResponse<AccountDocument>> {
        const response:ModelDeleteDocResponse<AccountDocument> = {
            success: false
        };

        return new Promise(async (resolve, reject) => {
            try {
                if (!isValidUUID(docId)) {
                    throw new Error('Invalid uuid');
                }

                const searchResp:estypes.SearchResponse = await this.fastify.elastic.search({
                    query: {
                        match: { account_id: docId}
                    }
                });
                if (searchResp.hits.hits.length > 0) {
                    const firstHit = searchResp.hits.hits[0];
                    if (firstHit) {
                        response.success = true;

                        const recordId:string = firstHit._id;
                        const deleteResp:estypes.DeleteResponse = await this.fastify.elastic.delete({
                            index: this.accountIndex,
                            id: recordId, 
                        });

                        this.fastify.log.debug(deleteResp);
                    }
                }

            } catch(error) {
                this.fastify.log.error(`Cannot remove account: ${error}`);
                reject(error);
            }

            resolve(response);
        });
    }
}


export {AccountModel}
