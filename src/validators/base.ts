abstract class BaseRequestValidator<T> {
    requestParams: T;
    errorMessage: string;

    abstract isValid(requestParams:T):Promise<boolean>;

    constructor(requestParams:T) {
        this.requestParams = requestParams;
        this.errorMessage = '';
    }
}

export {BaseRequestValidator};
