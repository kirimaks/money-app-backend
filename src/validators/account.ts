import {validate as validateUUID} from 'uuid';
import {BaseRequestValidator} from './base';


class GetAccountRequestValidator extends BaseRequestValidator<GetAccountRequest> {
    async isValid():Promise<boolean> {
        if (!validateUUID(this.requestParams.account_id)) {
            this.errorMessage = 'Invalid uuid';
            return false;
        }

        return true;
    }
}

class CreateAccountValidator extends BaseRequestValidator<CreateAccountRequest> {
    async isValid():Promise<boolean> {
        if (this.requestParams.account_name.match(/[,._]/)) {
            this.errorMessage = 'Bad characters in account name';
            return false;
        }

        return true;
    }
}

class RemoveAccountRequestValidator extends BaseRequestValidator<DeleteAccountRequest> {
    async isValid():Promise<boolean> {
        if (!validateUUID(this.requestParams.account_id)) {
            this.errorMessage = 'Invalid uuid';
            return false;
        }

        return true;
    }
}

export {GetAccountRequestValidator, CreateAccountValidator, RemoveAccountRequestValidator}
