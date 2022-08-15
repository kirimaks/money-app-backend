import {validate as validateUUID} from 'uuid';

import {BaseRequestValidator} from './base';

import type {Client as ESClient, estypes} from '@elastic/elasticsearch';


class NewUserRequestValidator extends BaseRequestValidator<CreateUserRequest> {
    elastic:ESClient;

    constructor(elastic:ESClient, requestParams:CreateUserRequest) {
        super(requestParams);

        this.elastic = elastic;
    }

    async isValid():Promise<boolean> {
        const accountId = this.requestParams.account_id;

        if (!await this.accountExists(accountId)) {
            this.errorMessage = `No such account: ${accountId}`;
            return false;
        }

        return true;
    }

    async accountExists(accountId:string):Promise<boolean> {
        const searchRequest:estypes.SearchRequest = {
            query: {
                match: {account_id: accountId}
            }
        };
        const searchResp:estypes.SearchResponseBody<AccountDocument> = await this.elastic.search(searchRequest);

        if (searchResp.hits.hits.length > 0) {
            const firstHit = searchResp.hits.hits[0];
            if (firstHit && firstHit._source) {
                return true;
            }
        }

        return false;
    }
}

class GetUserRequestValidator extends BaseRequestValidator<GetUserRequest> {
    async isValid():Promise<boolean> {
        if (!validateUUID(this.requestParams.record_id)) {
            this.errorMessage = 'Invalid uuid';
            return false;
        }

        return true;
    }
}

class RemoveUserRequestValidator extends BaseRequestValidator<GetUserRequest> {
    async isValid():Promise<boolean> {
        if (!validateUUID(this.requestParams.record_id)) {
            this.errorMessage = 'Invalid uuid';
            return false;
        }

        return true;
    }
}

export {NewUserRequestValidator, GetUserRequestValidator, RemoveUserRequestValidator}
