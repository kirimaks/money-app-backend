import {v4 as uuidv4} from 'uuid';
import type {estypes} from '@elastic/elasticsearch';

import {AbstractModel, AbstractDocMap} from '../model';
import {NotFoundError} from '../../errors/tools';


class CategoryDocMap extends AbstractDocMap<CategoryDocument> {
    async save(): Promise<string> {
        const resp:estypes.CreateResponse = await this.elastic.index({
            index: this.indexName,
            document: this.document,
        });

        this.log.debug(`<<< Category saved: ${JSON.stringify(resp)} >>>`);
        await this.elastic.indices.refresh({index: this.indexName});

        return this.document.category_id;
    }

    async delete(): Promise<void> {
        const request:estypes.DeleteByQueryRequest = {
            index: this.indexName,
            query: {
                match: {category_id: this.document.category_id}
            }
        };
        const resp:estypes.DeleteByQueryResponse = await this.elastic.deleteByQuery(request);
        this.log.debug(`<<<< Delete category respons: ${JSON.stringify(resp)}`);
    }
}

class CategoryModel extends AbstractModel<CategoryDraft, CategoryDocument> {
    async createDocumentMap(draft:CategoryDraft):Promise<CategoryDocMap> {
        const categoryDoc:CategoryDocument = {
            category_id: uuidv4(),
            category_name: draft.category_name,
            account_id: draft.account_id,
        };

        return new CategoryDocMap(this.log, this.elastic, this.indexName, categoryDoc);
    }

    async getDocumentMap(category_id:string):Promise<CategoryDocMap> {
        const searchDoc:estypes.SearchRequest = {
            query: {
                match: {category_id: category_id}
            }
        };
        const resp:estypes.SearchResponse<CategoryDocument> = await this.elastic.search(searchDoc);
        if (resp.hits.hits.length > 0) {
            const hit = resp.hits.hits[0];
            if (hit && hit._source) {
                return new CategoryDocMap(this.log, this.elastic, this.indexName, hit._source);
            }
        }

        throw new NotFoundError(`Document ${category_id} not found`);
    }

    async createIndex() {
        const indexDoc:estypes.IndicesCreateRequest = {
            index: this.indexName,
            settings: {
                number_of_shards: 1,
                number_of_replicas: 1,
            },
            mappings: {
                dynamic: 'strict',
                properties: {
                    category_id: {
                        type: 'text',
                    },
                    account_id: {
                        type: 'text',
                    },
                    account_name: {
                        type: 'text'
                    }
                }
            }
        };

        return await this.elastic.indices.create(indexDoc);
    }
}

export {CategoryModel}
