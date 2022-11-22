export class NotFoundError extends Error {
    message: string;

    constructor(message:string) {
        super(message);
        this.message = message;
        this.name = 'NotFoundError';
    }
}
