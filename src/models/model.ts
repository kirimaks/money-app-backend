import type {FastifyInstance} from 'fastify';


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
    abstract createIndex():void;
    abstract deleteIndex():void;

    constructor(fastify:FastifyInstance, indexName:string) {
        this.fastify = fastify;
        this.indexName = indexName;
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

}

export {AbstractModel};
