import type { FastifyLoggerInstance } from 'fastify';
import type { Client as ESClient, estypes } from '@elastic/elasticsearch';

import { errors as ElasticErrors } from '@elastic/elasticsearch';
import { getErrorMessage } from '../errors/tools';
import { CreateIndexError, IndexExist } from '../errors/exceptions';


/* Mapping to concrete document in elastic */
abstract class AbstractDocMap<DocType> {
    log: FastifyLoggerInstance;
    elastic: ESClient;
    indexName: string;
    document: DocType;

    abstract save(): Promise<string>;
    abstract delete(): Promise<void>;

    constructor(log:FastifyLoggerInstance, elastic:ESClient, indexName:string, document:DocType) {
        this.log = log;
        this.elastic = elastic;
        this.indexName = indexName;
        this.document = document;
    }
}
 
abstract class AbstractModel<DocDraftType, DocType> { 
    log: FastifyLoggerInstance;
    elastic: ESClient;
    indexName: string;

    /* Creates document mapping */
    abstract createDocumentMap(document:DocDraftType):Promise<AbstractDocMap<DocType>>;

    /* Getting document mapping */
    abstract getDocumentMap(record_id:string):Promise<AbstractDocMap<DocType>>; // Deprecated?
    abstract getDocument(db_id:string):Promise<AbstractDocMap<DocType>>;

    constructor(log:FastifyLoggerInstance, elastic:ESClient, indexName: string) {
        this.log = log;
        this.elastic = elastic;
        this.indexName = indexName;
    }

    getDeleteDoc(dbRecordId:string) {
        return {
            index: this.indexName,
            id: dbRecordId,
        }
    }

    getSearchByIdDock(recordId:string) {
        return {
            query: { 
                match: {record_id: recordId} 
            }
        }
    }

    async deleteIndex(): Promise<estypes.IndicesExistsResponse> {
        const indexExistResp:estypes.IndicesExistsResponse = await this.elastic.indices.exists({
            index: this.indexName
        });

        if (indexExistResp) {
            this.log.debug(`<<< Removing index: ${this.indexName} >>>`);

            const deleteResp = await this.elastic.indices.delete({
                index: this.indexName
            });
            this.log.debug(`Delete response: ${JSON.stringify(deleteResp)}`);

        } else {
            /* TODO: throw error? */
            this.log.debug(`<<< Index: ${this.indexName} not exist >>>`);
        }

        return indexExistResp;
    }

    protected async createIndex(indexDoc:estypes.IndicesCreateRequest):Promise<estypes.IndicesCreateResponse> {
        this.log.info(`<<< Creating index: [${this.indexName}] >>>`);

        try {
            return await this.elastic.indices.create(indexDoc);

        } catch(error) {
            if (error instanceof ElasticErrors.ResponseError) {
                if (error.body.error.type === 'resource_already_exists_exception') {
                    throw new IndexExist(`Index: [${this.indexName}] exist`);
                }
            }

            const errorMessage = getErrorMessage(error);
            throw new CreateIndexError(errorMessage);
        }
    }
}

export {AbstractModel, AbstractDocMap}
