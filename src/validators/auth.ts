import {BaseRequestValidator} from './base';


class SignUpRequestValidator extends BaseRequestValidator<SignUpRequestBody> {
    async isValid() {
        return true;
    }

    getAccountDocument(): AccountDraft {
        return Object.assign({}, {
            account_name: this.requestParams.account_name
        });
    }
    getUserDocument(accountId:string): UserDraft {
        return Object.assign({}, {
            first_name: this.requestParams.first_name,
            last_name: this.requestParams.last_name,
            phone_number: this.requestParams.phone_number,
            email: this.requestParams.email,
            password: this.requestParams.password,
            account_id: accountId,
            comment: this.requestParams.comment,
        });
    }
}

export {SignUpRequestValidator}
