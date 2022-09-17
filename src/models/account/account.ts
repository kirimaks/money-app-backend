import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

import type { estypes } from '@elastic/elasticsearch';

import { AbstractModel, AbstractDocMap } from '../model';
import { NotFoundError } from '../../errors/tools';
import { getDefaultTags, getDefaultSources } from './tools';


class AccountDocMap extends AbstractDocMap<AccountDocument> {
    async save(): Promise<string> {
        if (this.document.account_name === 'fail500fail') {
            throw new Error('Account creation failed');
        }

        const resp:estypes.CreateResponse = await this.elastic.index({
            index: this.indexName,
            document: this.document,
        });

        this.log.debug(`<<< Create account response: ${JSON.stringify(resp)} >>>`);
        await this.elastic.indices.refresh({index: this.indexName});

        return this.document.account_id;
    }

    async delete(): Promise<void> {
        const request:estypes.DeleteByQueryRequest = {
            index: this.indexName,
            query: {
                match: {account_id: this.document.account_id}
            }
        };
        const resp:estypes.DeleteByQueryResponse = await this.elastic.deleteByQuery(request);
        this.log.debug(`Delete doc response: ${JSON.stringify(resp)}`);
    }
}


class AccountModel extends AbstractModel<AccountDraft, AccountDocument> {
    async createDocumentMap(requestBody:AccountDraft):Promise<AccountDocMap> {

        const accountDocument:AccountDocument = {
            /* TODO: budgets, spendings, ... */
            account_name: requestBody.account_name,
            account_id: uuidv4(),
            money_sources: getDefaultSources(),
            tags: getDefaultTags(),
        }

        return new AccountDocMap(this.log, this.elastic, this.indexName, accountDocument);
    }

    async getDocument(account_db_id:string):Promise<AccountDocMap> {
        const request:estypes.GetRequest = {
            id: account_db_id,
            index: this.indexName,
        };

        const resp:estypes.GetGetResult<AccountDocument> = await this.elastic.get(request);

        if (resp.found && resp._source) {
            return new AccountDocMap(this.log, this.elastic, this.indexName, resp._source);
        }

        throw new NotFoundError(`Document ${account_db_id} not found`);
    }

    async getDocumentMap(account_id:string):Promise<AccountDocMap> {
        const searchDoc:estypes.SearchRequest = {
            query: {
                term: {account_id: account_id}
            }
        };
        const resp:estypes.SearchResponse<AccountDocument> = await this.elastic.search(searchDoc);
        if (resp.hits.hits.length > 0) {
            const hit = resp.hits.hits[0];
            if (hit && hit._source) {
                return new AccountDocMap(this.log, this.elastic, this.indexName, hit._source);
            }
        }

        throw new NotFoundError(`Document ${account_id} not found`);
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
                    account_id: {
                        type: 'keyword',
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
                    },
                    money_sources: {
                        properties: {
                            source_name: {
                                type: 'keyword'
                            },
                            source_id: {
                                type: 'keyword'
                            },
                            source_icon: {
                                type: 'keyword',
                                index: false,
                            }
                        }
                    },
                    tags: {
                        properties: {
                            tag_name: {
                                type: 'keyword',
                            },
                            tag_id: {
                                type: 'keyword',
                            },
                            tag_icon: {
                                type: 'keyword',
                                index: false,
                            }
                        }
                    }
                }
            }
        };

        return await this.elastic.indices.create(indexDoc);
    }

    async addMoneySource(accountId:string, sourceName:string, sourceIcon:string): Promise<estypes.UpdateByQueryResponse> {
        const updateRequest:estypes.UpdateByQueryRequest = {
            index: this.indexName,
            query: {
                term: {
                    account_id: accountId
                }
            },
            script: {
                source: 'ctx._source.money_sources.add(params.new_source)',
                params: {
                    new_source: {
                        source_id: uuidv4(),
                        source_name: sourceName,
                        source_icon: sourceIcon,
                    }
                }
            }
        };

        return await this.elastic.updateByQuery(updateRequest);
    }
    
    async createTag(accountId:string, tagName:string, tagIcon:string): Promise<estypes.UpdateByQueryResponse> {
        const updateRequest:estypes.UpdateByQueryRequest = {
            index: this.indexName,
            query: {
                term: {
                    account_id: accountId,
                }
            },
            script: {
                source: 'ctx._source.tags.add(params.new_tag)',
                params: {
                    new_tag: {
                        tag_id: crypto.randomBytes(4).toString('hex'),
                        tag_name: tagName,
                        tag_icon: tagIcon,
                    }
                }
            }
        };

        return await this.elastic.updateByQuery(updateRequest);
    }
}

export {AccountModel}
