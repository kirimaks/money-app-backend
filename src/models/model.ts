function isModelResponse(catchedError:unknown): catchedError is ModelResponse {
    return (
        typeof catchedError === 'object' && catchedError != null && 'errorMessage' in catchedError
    );
}
 

abstract class AbstractModel { 
    abstract createDocument(document:unknown):object;
    abstract saveDocument(document:unknown):Promise<ModelCreateDocResponse<unknown>>;
    abstract removeDocument(docId:string):Promise<ModelDeleteDocResponse<unknown>>;
    abstract getDocument(docId:string):Promise<ModelSearchDocResponse<unknown>>;
    // abstract searchDocument(document:unknown):unknown[];

   
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
