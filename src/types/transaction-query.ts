import type { estypes } from '@elastic/elasticsearch';


type TransactionDocTimeAggregation = {
    transaction_time_agg: estypes.AggregationsDateHistogramBucket;
};

type TransactionDocSumAggregation = {
    time_range_sum_agg: estypes.AggregationsSumAggregate;
};

interface TransactionAggregationRecord extends estypes.AggregationsDateHistogramBucketKeys {
    time_range_sum_agg: {
        value: number;
    }
}

type TransactionsTimeAggregationResp = estypes.SearchResponse<TransactionDocument, TransactionDocTimeAggregation>

type TimeReducedHits = Record<number, TransactionDocument[]>;
type TransactionSearchHit = estypes.SearchHit<TransactionDocument>;

export { 
    TransactionDocTimeAggregation, TransactionDocSumAggregation, TransactionAggregationRecord,
    TransactionsTimeAggregationResp, TimeReducedHits, TransactionSearchHit
}
