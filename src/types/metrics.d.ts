interface RequestMetricsDraft {
    url: string;
    requestRunTimeMS: number;
    requestSize: number;
    clientIp: string;
    requestMethod: string;
    routerPath: string;
    is404: boolean;
    request_time: number;
}

interface RequestMetricsDocument extends RequestMetricsDraft {
    metric_id: string;
}
