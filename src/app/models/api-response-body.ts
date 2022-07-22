export interface IApiResponseBody<T = any> {
    Error?: boolean;
    Message?: string;
    Metrics?: IApiResponseMetrics
    RowsAffected?: number;
    Success?: boolean;
    Data?: T;
    RowCount?: number;
}


export interface IApiResponseMetrics {
    elapsedTime ?: number;
    executionTime ?: number;
    sortCount ?: number;
    resultCount ?: number;
    resultSize ?: number;
    mutationCount ?: number;
    errorCount ?: number;
    warningCount ?: number;
}
