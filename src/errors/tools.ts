function getErrorMessage(catchedError:unknown):string {
    if (catchedError instanceof Error) {
        return catchedError.message;
    }

    return 'Error message is not provided';
}


// TODO: move to "exceptions" ---------------
class NotFoundError extends Error {
    constructor(message:string) {
        super(message);
        this.message = 'Not Found';
    }
}


class AuthError extends Error {
    constructor(message:string) {
        super(message);
    }
}
// ------------------------------------------

export { getErrorMessage, NotFoundError, AuthError }
