import type { estypes } from '@elastic/elasticsearch';


function isString(obj:unknown): obj is string {
    if (typeof obj === 'string') {
        return true;
    }

    return false;
}

function isAggregation(obj:unknown): obj is estypes.AggregationsAggregate {
    if (typeof obj !== undefined) {
        return true;
    }

    return false;
}

export { isString, isAggregation }
