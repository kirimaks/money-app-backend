import { v4 as uuidv4 } from 'uuid';

import type { estypes } from '@elastic/elasticsearch';

import { AbstractModel, AbstractDocMap } from '../model';


class RequestMetricsDocMap extends AbstractDocMap<RequestMetricsDocument> {
    async save(): Promise<string> {
        const resp:estypes.CreateResponse = await this.elastic.index({
            index: this.indexName,
            document: this.document,
        });

        this.log.debug(`<<< Create request metrics response: ${JSON.stringify(resp)}`);

        return this.document.metric_id;
    }

    async delete(): Promise<void> {}
}

class RequestMetricsModel extends AbstractModel<RequestMetricsDraft, RequestMetricsDocument> {
    getDocumentMap(_string_id:string):Promise<RequestMetricsDocMap> {
        throw new Error('No such method');
    }

    getDocument(_db_id:string):Promise<RequestMetricsDocMap> {
        throw new Error('No such method');
    }


    async createDocumentMap(requestBody:RequestMetricsDraft):Promise<RequestMetricsDocMap> {
        const requestMetricsDocument:RequestMetricsDocument = {
            metric_id: uuidv4(),
            ...requestBody,
        };

        return new RequestMetricsDocMap(this.log, this.elastic, this.indexName, requestMetricsDocument);
    }

    override async createIndex():Promise<estypes.IndicesCreateResponse> {
        const indexDoc:estypes.IndicesCreateRequest= {
            index: this.indexName,
            settings: {
                number_of_shards: 1,
                number_of_replicas: 1,
            },
            mappings: {
                dynamic: 'strict',
                properties: {
                    metric_id: {
                        type: 'keyword',
                    },
                    request_time: {
                        type: 'date',
                    },
                    url: {
                        type: 'keyword',
                    },
                    requestRunTimeMS: {
                        type: 'integer',
                    },
                    requestSize: {
                        type: 'integer',
                    },
                    clientIp: {
                        type: 'keyword',
                    },
                    requestMethod: {
                        type: 'keyword',
                    },
                    routerPath: {
                        type: 'keyword',
                    },
                    is404: {
                        type: 'boolean',
                    },
                }
            }
        };

        return super.createIndex(indexDoc);
    }
}

export { RequestMetricsModel }
