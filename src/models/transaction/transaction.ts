import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

import { AbstractDocMap, AbstractModel } from '../model';
import { NotFoundError } from '../../errors/tools';
import { isAggregation } from '../../types/guards';

import type { estypes } from '@elastic/elasticsearch';
import type { 
    TransactionsTimeAggregationResp, TimeReducedHits, TransactionSearchHit 
} from '../../types/transaction-query';


/* TODO: Check type for sorting */
interface SearchRequestSorted extends Omit<estypes.SearchRequest, 'sort'> { 
    sort: any;
}

class TransactionDocMap extends AbstractDocMap<TransactionDocument> {
    async save(): Promise<string> {
        const request:estypes.IndexRequest = {
            index: this.indexName,
            document: this.document,
        };
        const resp:estypes.CreateResponse = await this.elastic.index(request);

        this.log.debug(`<<< Create transaction response: ${JSON.stringify(resp)} >>>`);
        await this.elastic.indices.refresh({index: this.indexName});

        return this.document.transaction_id;
    }

    async delete(): Promise<void> {
        const request:estypes.DeleteByQueryRequest = {
            index: this.indexName,
            query: {
                match: {transaction_id: this.document.transaction_id}
            }
        };
        const resp:estypes.DeleteByQueryResponse = await this.elastic.deleteByQuery(request);
        this.log.debug(`<<< Delete doc response: ${JSON.stringify(resp)} >>>`);
    }
}

class TransactionModel extends AbstractModel<TransactionDraft, TransactionDocument> {
    async createDocumentMap(transactionData: TransactionDraft): Promise<TransactionDocMap> {
        const transactionDocument:TransactionDocument = Object.assign(
            {
                transaction_id: uuidv4(),
                timestamp: new Date().getTime(),
            },
            transactionData
        );

        return new TransactionDocMap(this.log, this.elastic, this.indexName, transactionDocument);
    }

    async getDocument(user_db_id:string):Promise<TransactionDocMap> {
        const request:estypes.GetRequest = {
            id: user_db_id,
            index: this.indexName,
        };

        const resp:estypes.GetGetResult<TransactionDocument> = await this.elastic.get(request);

        if (resp.found && resp._source) {
            return new TransactionDocMap(this.log, this.elastic, this.indexName, resp._source);
        }

        throw new NotFoundError(`Document ${user_db_id} not found`);
    }

    async getDocumentMap(transaction_id:string):Promise<TransactionDocMap> {
        const searchDoc:estypes.SearchRequest = {
            query: {
                match: {transaction_id: transaction_id}
            }
        };
        const resp:estypes.SearchResponse<TransactionDocument> = await this.elastic.search(searchDoc);
        if (resp.hits.hits.length > 0) {
            const hit = resp.hits.hits[0];
            if (hit && hit._source) {
                return new TransactionDocMap(this.log, this.elastic, this.indexName, hit._source);
            }
        }

        throw new NotFoundError('No such document');
    }

    async getRecentTransactions(account_id:string):Promise<TransactionDocument[]> {
        const searchDoc:SearchRequestSorted = {
            index: this.indexName,
            from: 0, 
            size: 10,
            query: {
                bool: {
                    must: [
                        {match: {account_id: account_id}},
                        {range: {timestamp: {lte: new Date().getTime()}}}
                    ]
                }
            },
            sort: [{
                timestamp: {
                    order: 'desc'
                }
            }]
        };

        const resp:estypes.SearchResponse<TransactionDocument> = await this.elastic.search(searchDoc);

        if (resp.hits.hits.length > 0) {
            const transactions:TransactionDocument[] = [];

            for (const hit of resp.hits.hits) {
                if (hit._source) {
                    transactions.push(hit._source);
                }
            }

            return transactions;
        }

        throw new NotFoundError('No transactions');
    }

    override async createIndex():Promise<estypes.IndicesCreateResponse> {
        const indexDoc:estypes.IndicesCreateRequest = {
            index: this.indexName,
            settings: {
                number_of_shards: 2,
                number_of_replicas: 1,
            },
            mappings: {
                dynamic: 'strict',
                properties: {
                    name: {
                        type: 'text',
                    },
                    transaction_id: {
                        type: 'text',
                    },
                    timestamp: {
                        type: 'date',
                    },
                    user_id: {
                        type: 'text',
                    },
                    account_id: {
                        type: 'keyword',
                    },
                    amount: {
                        type: 'integer',
                    },
                    source_id: {
                        type: 'keyword',
                    },
                    tags: {
                        properties: {
                            tag_id: {
                                type: 'keyword',
                            },
                            tag_name: {
                                type: 'keyword',
                            },
                            tag_icon: {
                                type: 'keyword',
                                index: false,
                            }
                        }
                    },
                    category_id: { // TODO: remove
                        type: 'text',
                    },
                    description: {
                        type: 'text',
                    },
                    spending_id: {
                        type: 'text', // TODO: keyword
                    },
                    saving_id: {
                        type: 'text', // TODO: keyword
                    },
                    budget_id: {
                        type: 'text',  // TODO: keyword
                    }
                }
            }
        };

        return super.createIndex(indexDoc);
    }

    async getAggregatedRecentTransactions(account_id:string, start_time:number):Promise<TimeReducedHits> {
        this.log.info(`Transaction starting time: ${start_time}`);

        const searchDoc:SearchRequestSorted = {
            index: this.indexName,
            query: {
                bool: {
                    must: [
                        {term: { account_id: account_id }},
                        {range: { timestamp: {'lt': start_time}}}
                    ]
                }
            },
            sort: [{
                timestamp: {
                    order: 'desc'
                }
            }],
            aggs: {
                'transaction_time_agg': {
                    date_histogram: {
                        field: 'timestamp',
                        calendar_interval: 'hour',
                    },
                    aggs: {
                        'time_range_sum_agg': {
                            sum: {
                                field: 'amount'
                            }
                        }
                    }
                }
            }
        };

        const resp:TransactionsTimeAggregationResp = await this.elastic.search(searchDoc);

        if (resp.hits.hits.length > 0) {
            if (resp.aggregations && isAggregation(resp.aggregations['transaction_time_agg'])) {
                return aggregateTransactionsByTime(resp);
            }
        }

        throw new NotFoundError('No transactions');
    }
}

function aggregateTransactionsByTime(elasticResp:TransactionsTimeAggregationResp): TimeReducedHits {
    return elasticResp.hits.hits.reduce((acc:TimeReducedHits, cur:TransactionSearchHit) => {
        if (cur._source && cur._source.timestamp) {
            const timestamp:number = moment(cur._source.timestamp).startOf('hour').valueOf();

            if (!(timestamp in acc)) {
                acc[timestamp] = [];
            }
            
            acc[timestamp]?.push(cur._source);
        }

        return acc;

    }, {});
}

export { TransactionModel }
