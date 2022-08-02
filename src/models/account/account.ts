import {v4 as uuidv4, validate as isValidUUID} from 'uuid';

import type {FastifyInstance} from 'fastify';
import type {Client, estypes} from '@elastic/elasticsearch';


declare module 'fastify' {
    interface FastifyInstance {
        elastic: Client;
    }
}


export class AccountModel implements AccountModel {
    fastify: FastifyInstance;
    accountIndex: string;

    constructor(fastify:FastifyInstance) {
        this.fastify = fastify;
        this.accountIndex = process.env.ACCOUNTS_INDEX_NAME;
    }

    createDocument(accountName:string):AccountDocument {
        const accountId:string = uuidv4();
        return {
            account_id: accountId,
            account_name: accountName,
        }
    }

    createAccount(accountName:string):Promise<ModelCreateDocResponse<AccountDocument>> {
        const newAccountDoc = this.createDocument(accountName);
        const response:ModelCreateDocResponse<AccountDocument> = {
            success: false,
            document: newAccountDoc,
        }

        return new Promise(async (resolve, reject): Promise<any> => {
            if (accountName === 'failfailfail') {
                resolve(response);
            }

            try {
                if (accountName.match(/[,._]/)) {
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

    getAccount(accountId:string):Promise<ModelSearchDocResponse<AccountDocument>> {
        const response:ModelSearchDocResponse<AccountDocument> = {
            found: false,
        };

        return new Promise(async (resolve, reject) => {
            try {
                if (!isValidUUID(accountId)) {
                    throw new Error('Invalid uuid');
                }

                const resp:estypes.SearchResponse<AccountDocument> = await this.fastify.elastic.search({
                    query: {
                        match: { account_id: accountId }
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

    removeAccount(accountId:string):Promise<ModelDeleteDocResponse<AccountDocument>> {
        const response:ModelDeleteDocResponse<AccountDocument> = {
            success: false
        };

        return new Promise(async (resolve, reject) => {
            try {
                if (!isValidUUID(accountId)) {
                    throw new Error('Invalid uuid');
                }

                const searchResp:estypes.SearchResponse = await this.fastify.elastic.search({
                    query: {
                        match: { account_id: accountId }
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
