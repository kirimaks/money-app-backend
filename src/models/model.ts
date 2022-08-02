abstract class AbstractModel { 
    abstract createDocument(document:unknown):Promise<ModelCreateDocResponse<unknown>>;
    abstract removeDocument(docId:string):Promise<ModelDeleteDocResponse<unknown>>;
    abstract getDocument(docId:string):Promise<ModelSearchDocResponse<unknown>>;
    // abstract searchDocument(document:unknown):unknown[];
}

export {AbstractModel};
