import type {FastifyInstance} from 'fastify';
import type {estypes} from '@elastic/elasticsearch';

import type {AccountModel} from './account/account';
import type {UserModel} from './user/user';


declare module 'fastify' {
    interface FastifyInstance {
        models: {
            account: AccountModel;
            user: UserModel;
        }
    }
}

function isModelResponse(catchedError:unknown): catchedError is ModelResponse {
    return (
        typeof catchedError === 'object' && catchedError != null && 'errorMessage' in catchedError
    );
}
 
abstract class AbstractModel { 
    fastify: FastifyInstance;
    indexName: string;

    abstract createDocument(document:unknown):object;
    abstract saveDocument(document:unknown):Promise<ModelCreateDocResponse<unknown>>;
    abstract removeDocument(docId:string, options:ModelRequestOptions):Promise<ModelDeleteDocResponse<unknown>>;
    abstract getDocument(docId:string, options:ModelRequestOptions):Promise<ModelSearchDocResponse<unknown>>;
    abstract createIndex():Promise<estypes.IndicesCreateResponse>;

    constructor(fastify:FastifyInstance, indexName:string) {
        this.fastify = fastify;
        this.indexName = indexName;
    }

    getIndexDoc(newDocument:UserDocument) {
        return {
            index: this.indexName,
            document: newDocument,
        }
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

    getModelResponseError(catchedError:unknown):string {
        if (catchedError instanceof Error) {
            return catchedError.message;
        }

        if (isModelResponse(catchedError)) {
            return catchedError.errorMessage;
        }

        return 'Cannot parse error message';
    }

    async deleteIndex(): Promise<estypes.IndicesExistsResponse> {
        const indexExistResp:estypes.IndicesExistsResponse = await this.fastify.elastic.indices.exists({
            index: this.indexName
        })

        if (indexExistResp) {
            this.fastify.log.debug(`<<< Removing index: ${this.indexName} >>>`);

            const deleteResp = await this.fastify.elastic.indices.delete({
                index: this.indexName
            });
            this.fastify.log.debug(`Delete response: ${JSON.stringify(deleteResp)}`);
        } else {
            this.fastify.log.debug(`<<< Index: ${this.indexName} not exist >>>`);
        }

        return indexExistResp;
    }
}

export {AbstractModel}
