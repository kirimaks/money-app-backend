class IndexExist extends Error {
    constructor(message:string) {
        super(message);
    }
}

class CreateIndexError extends Error {
    constructor(message:string) {
        super(message);
    }
}

export { IndexExist, CreateIndexError }
