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
            /* TODO: validate special charactes */
            if (accountName.includes('_')) {
                resolve(response);
            }

            if (accountName.includes(',')) {
                reject('Invalid uuid');
            }

            try {
                const resp:estypes.CreateResponse = await this.fastify.elastic.index({
                    index: this.accountIndex,
                    document: newAccountDoc,
                });
                this.fastify.log.debug(`<<< Create account response: ${JSON.stringify(resp)} >>>`);
                await this.fastify.elastic.indices.refresh({index: this.accountIndex});

                response.success = true;
                resolve(response);

            } catch(err) {
                this.fastify.log.error(`Cannot create document: ${err}`);
                reject(err);
            }
        });
    }

    getAccount(accountId:string):Promise<ModelSearchDocResponse<AccountDocument>> {
        const response:ModelSearchDocResponse<AccountDocument> = {
            found: false,
        };

        return new Promise(async (resolve, reject) => {
            if (!isValidUUID(accountId)) {
                reject('Invalid uuid');
            }

            try {
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
            } catch(err) {
                this.fastify.log.error(`Cannot get account: ${err}`);
                reject('Cannot get account');
            }

            resolve(response);
        });
    }

    removeAccount(accountId:string):Promise<ModelDeleteDocResponse<AccountDocument>> {
        const response:ModelDeleteDocResponse<AccountDocument> = {
            success: false
        };

        return new Promise(async (resolve, reject) => {
            if (!isValidUUID(accountId)) {
                reject('Invalid uuid');
            }

            try {
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

            } catch(err) {
                console.error('Cannot delete account: ', err);
                reject('Cannot remove account');
            }

            resolve(response);
        });
    }
}
